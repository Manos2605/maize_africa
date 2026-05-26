from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import joblib
import uvicorn
from sklearn.preprocessing import MinMaxScaler

class LSTMModel(nn.Module):
    """
    LSTM Bidirectionnel + Attention
    Correspond à l'architecture optimisée du notebook.
    """
    def __init__(self, input_size, hidden_size=64, num_layers=2, dropout=0.3):
        super(LSTMModel, self).__init__()

        self.lstm = nn.LSTM(
            input_size,
            hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout,
            bidirectional=True,
        )
        lstm_out_size = hidden_size * 2  # bidirectionnel

        # Attention sur les pas de temps
        self.attention = nn.Linear(lstm_out_size, 1)

        self.bn   = nn.BatchNorm1d(lstm_out_size)
        self.drop = nn.Dropout(dropout)

        # Tête de régression
        self.fc1 = nn.Linear(lstm_out_size, 32)
        self.act  = nn.ReLU()
        self.fc2  = nn.Linear(32, 1)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)                                     # (batch, seq, hidden*2)
        attn_weights = torch.softmax(self.attention(lstm_out), dim=1)  # (batch, seq, 1)
        context = (attn_weights * lstm_out).sum(dim=1)                 # (batch, hidden*2)
        out = self.bn(context)
        out = self.drop(out)
        out = self.act(self.fc1(out))
        out = self.fc2(out)
        return out

FEATURES = [
    "country_encoded",
    "year",
    "production_tonnes",
    "yield_t_ha",
    "price_lag1",
    "price_lag2",
    "price_delta",
]

FEATURES_TO_SCALE = [f for f in FEATURES if f != "country_encoded"]
TARGET            = "producer_price"
SEQUENCE_LENGTH   = 5


encoder             = joblib.load("./model/country_encoder.save")
scalers_per_country = joblib.load("./model/scalers_per_country.save")

# Scaler global pour l'année (utilisé lors du forecast itératif)
dataset = pd.read_csv("./data/maize_final.csv")
dataset["country_encoded"] = encoder.transform(dataset["country"])

# Lag features — reconstruire comme dans le notebook
dataset = dataset.sort_values(["country", "year"])
dataset["price_lag1"]  = dataset.groupby("country")[TARGET].shift(1)
dataset["price_lag2"]  = dataset.groupby("country")[TARGET].shift(2)
dataset["price_delta"] = dataset.groupby("country")[TARGET].diff()
dataset = dataset.groupby("country", group_keys=False).apply(
    lambda g: g.fillna(method="ffill").fillna(method="bfill")
).reset_index(drop=True)

# Scaler global pour normaliser l'année lors du forecast
year_scaler = MinMaxScaler()
year_scaler.fit(dataset[["year"]])

# Scaler global pour country_encoded
_ce_scaler = MinMaxScaler()
_ce_scaler.fit(dataset[["country_encoded"]])

# Dataset normalisé (même pipeline que le notebook)
dataset_normalized = dataset.copy()
for country in dataset["country"].unique():
    mask = dataset_normalized["country"] == country
    scaler = scalers_per_country[country]
    data   = dataset_normalized.loc[mask, FEATURES_TO_SCALE + [TARGET]].copy()
    dataset_normalized.loc[mask, FEATURES_TO_SCALE + [TARGET]] = scaler.fit_transform(data)

dataset_normalized["country_encoded"] = _ce_scaler.transform(
    dataset_normalized[["country_encoded"]]
)

# Modèle
input_size = len(FEATURES)
model = LSTMModel(input_size=input_size)
model.load_state_dict(
    torch.load("./model/model_africa_maize.pt", map_location="cpu")
)
model.eval()

# API
app = FastAPI(
    title="Maize Price Forecast API",
    description="Prédiction du prix du maïs en Afrique (54 pays) via LSTM bidirectionnel.",
    version="2.0.0",
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


@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        country = request.country
        annee   = request.year

        # Vérification pays
        if country not in scalers_per_country:
            available = sorted(scalers_per_country.keys())
            return {"error": f"Pays '{country}' inconnu. Pays disponibles : {available}"}

        scaler = scalers_per_country[country]
        n_cols = len(FEATURES_TO_SCALE) + 1  # features scalées + target

        # Données normalisées du pays
        country_data_norm = dataset_normalized[
            dataset_normalized["country"] == country
        ].sort_values("year")

        last_known_year = int(dataset[dataset["country"] == country]["year"].max())

        # Vérification année
        if annee <= last_known_year:
            return {
                "error": f"L'année {annee} est déjà dans les données. "
                         f"Choisir une année > {last_known_year}."
            }

        if len(country_data_norm) < SEQUENCE_LENGTH:
            return {
                "error": f"Pas assez de données pour {country} "
                         f"(besoin de {SEQUENCE_LENGTH} ans, disponible : {len(country_data_norm)})."
            }

        # Séquence initiale = dernières SEQUENCE_LENGTH années connues (normalisées)
        sequence     = country_data_norm[FEATURES].values[-SEQUENCE_LENGTH:].copy()
        year_col_idx = FEATURES.index("year")

        predictions = []

        # Forecast itératif : prédit year par year depuis last_known+1 jusqu'à annee
        for year in range(last_known_year + 1, annee + 1):

            input_tensor = torch.tensor(
                sequence, dtype=torch.float32
            ).unsqueeze(0)  # (1, seq_len, n_features)

            with torch.no_grad():
                pred_scaled = model(input_tensor).cpu().numpy()[0, 0]

            # Inverse transform → vrai prix USD/tonne
            dummy = np.zeros((1, n_cols))
            dummy[0, -1] = pred_scaled
            predicted_value = float(scaler.inverse_transform(dummy)[0, -1])

            predictions.append({
                "year":            year,
                "predicted_price": round(predicted_value, 2),
            })

            # Mise à jour séquence pour l'itération suivante
            new_row = sequence[-1].copy()
            new_row[year_col_idx] = float(year_scaler.transform([[year]])[0, 0])
            sequence = np.vstack([sequence[1:], new_row])

        return {
            "country":         country,
            "last_known_year": last_known_year,
            "forecast":        predictions,
        }

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=False)