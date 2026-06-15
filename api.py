from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import joblib
import uvicorn
from sklearn.preprocessing import MinMaxScaler


class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size=32, num_layers=2, dropout=0.1):
        super(LSTMModel, self).__init__()

        self.lstm = nn.LSTM(
            input_size,
            hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout,
            bidirectional=True,
        )

        lstm_out_size = hidden_size * 2
        self.attention = nn.Linear(lstm_out_size, 1)

        self.bn = nn.BatchNorm1d(lstm_out_size)
        self.drop = nn.Dropout(dropout)

        self.fc1 = nn.Linear(lstm_out_size, 32)
        self.act = nn.ReLU()
        self.fc2 = nn.Linear(32, 1)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)

        attn_weights = torch.softmax(self.attention(lstm_out), dim=1)
        context = (attn_weights * lstm_out).sum(dim=1)

        out = self.bn(context)
        out = self.drop(out)
        out = self.act(self.fc1(out))
        out = self.fc2(out)
        return out


FEATURES = [
    "country_encoded",
    "year",
    "rainfall_mm",
    "avg_temp_c",
    "harvested_area_ha",
    "yield_t_ha_lag1",
    "yield_t_ha_lag2",
    "yield_t_ha_lag3",
    "yield_t_ha_delta",
]

TARGET = "yield_t_ha"
SEQUENCE_LENGTH = 3


encoder = joblib.load("./model/country_encoder.save")
scalers_per_country = joblib.load("./model/scalers_per_country.save")

dataset = pd.read_csv("./data/maize_dataset_africa_full.csv")
dataset["country_encoded"] = encoder.transform(dataset["country"])

dataset = dataset.sort_values(["country", "year"])

dataset["yield_t_ha_lag1"] = dataset.groupby("country")[TARGET].shift(1)
dataset["yield_t_ha_lag2"] = dataset.groupby("country")[TARGET].shift(2)
dataset["yield_t_ha_lag3"] = dataset.groupby("country")[TARGET].shift(3)
dataset["yield_t_ha_delta"] = dataset.groupby("country")[TARGET].diff()

dataset = dataset.groupby("country", group_keys=False).apply(
    lambda g: g.fillna(method="ffill").fillna(method="bfill")
).reset_index(drop=True)


features_to_scale = [f for f in FEATURES if f != "country_encoded"]

dataset_normalized = dataset.copy()

for country in dataset["country"].unique():
    mask = dataset_normalized["country"] == country
    scaler = scalers_per_country[country]

    dataset_normalized.loc[
        mask,
        features_to_scale + [TARGET]
    ] = scaler.transform(
        dataset_normalized.loc[mask, features_to_scale + [TARGET]]
    )

# country_encoded scaling
ce_scaler = MinMaxScaler()
dataset_normalized["country_encoded"] = ce_scaler.fit_transform(
    dataset_normalized[["country_encoded"]]
)


year_scaler = MinMaxScaler()
year_scaler.fit(dataset[["year"]])


model = LSTMModel(input_size=len(FEATURES))
model.load_state_dict(torch.load("./model/best_model_weights.pt", map_location="cpu"))
model.eval()


# API
app = FastAPI(
    title="Maize Price Forecast API",
    description="Prédiction du prix du maïs en Afrique (33 pays) via LSTM bidirectionnel.",
    version="2.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://maize-africa-wlsc.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    country: str
    year: int


@app.get("/")
def root():
    return {"message": "Maize Price Africa API"}


@app.get("/countries")
def list_countries():
    return {"countries": sorted(dataset["country"].unique().tolist())}


@app.get("/rendement/{country}")
def get_country_rendement(country: str):
    if country not in dataset["country"].unique():
        available = sorted(dataset["country"].unique().tolist())
        return {"error": f"Pays '{country}' inconnu. Pays disponibles : {available}"}

    country_rendement = dataset[
        dataset["country"] == country
    ][["year", TARGET]].sort_values("year")

    rendement = [
        {"year": int(row["year"]), "rendement": float(row[TARGET])}
        for _, row in country_rendement.iterrows()
    ]

    return {
        "country": country,
        "rendement": rendement,
    }


@app.post("/predict")
def predict(request: PredictionRequest):

    country = request.country
    annee = request.year

    scaler = scalers_per_country[country]

    country_data_norm = dataset_normalized[
        dataset_normalized["country"] == country
    ].sort_values("year")

    last_year = int(dataset[dataset["country"] == country]["year"].max())

    if annee <= last_year:
        return {"error": "année invalide"}

    values = country_data_norm[FEATURES].values

    sequence = values[-SEQUENCE_LENGTH:].copy()

    year_idx = FEATURES.index("year")
    lag1 = FEATURES.index("yield_t_ha_lag1")
    lag2 = FEATURES.index("yield_t_ha_lag2")
    lag3 = FEATURES.index("yield_t_ha_lag3")
    delta = FEATURES.index("yield_t_ha_delta")

    preds = []

    for year in range(last_year + 1, annee + 1):

        x = torch.tensor(sequence, dtype=torch.float32).unsqueeze(0)

        with torch.no_grad():
            pred_scaled = model(x).cpu().numpy()[0, 0]

        dummy = np.zeros((1, len(features_to_scale) + 1))
        dummy[0, -1] = pred_scaled

        pred = scaler.inverse_transform(dummy)[0, -1]

        preds.append({"year": year, "pred": float(pred)})

        prev = sequence[-1].copy()
        new = prev.copy()

        new[year_idx] = year_scaler.transform(pd.DataFrame({"year":[year]}))[0,0]

        old1 = prev[lag1]
        old2 = prev[lag2]

        new[lag3] = old2
        new[lag2] = old1
        new[lag1] = pred_scaled
        new[delta] = pred_scaled - old1

        sequence = np.vstack([sequence[1:], new])

    return {
        "country": country,
        "last_year": last_year,
        "forecast": preds
    }


if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000)