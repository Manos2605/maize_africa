import React, { useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine, Legend,
} from 'recharts';

const API_BASE = 'http://127.0.0.1:8000';

const LAST_DATA_YEAR = 2024;
const MIN_FORECAST_YEAR = LAST_DATA_YEAR + 1;
const MAX_FORECAST_YEAR = LAST_DATA_YEAR + 20;

// Nom francais -> nom attendu par l'API (anglais)
const FR_TO_API = {
  "Ethiopie":             "Ethiopia",
  "Nigeria":              "Nigeria",
  "Afrique du Sud":       "South Africa",
  "Kenya":                "Kenya",
  "Ghana":                "Ghana",
  "Tanzanie":             "Tanzania",
  "Cameroun":             "Cameroon",
  "RDC":                  "Democratic Republic of the Congo",
  "Mozambique":           "Mozambique",
  "Zimbabwe":             "Zimbabwe",
  "Zambie":               "Zambia",
  "Ouganda":              "Uganda",
  "Mali":                 "Mali",
  "Senegal":              "Senegal",
  "Cote d'Ivoire":        "Ivory Coast",
  "Maroc":                "Morocco",
  "Egypte":               "Egypt",
  "Algerie":              "Algeria",
  "Tunisie":              "Tunisia",
  "Soudan":               "Sudan",
  "Angola":               "Angola",
  "Malawi":               "Malawi",
  "Rwanda":               "Rwanda",
  "Burkina Faso":         "Burkina Faso",
  "Niger":                "Niger",
  "Tchad":                "Chad",
  "Madagascar":           "Madagascar",
  "Namibie":              "Namibia",
  "Botswana":             "Botswana",
  "Liberia":              "Liberia",
  "Sierra Leone":         "Sierra Leone",
  "Guinee":               "Guinea",
  "Benin":                "Benin",
  "Togo":                 "Togo",
};

// Tooltip recharts personnalise
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name} : {p.value} USD/t
        </p>
      ))}
    </div>
  );
};

// Icone fleche haut/bas
const ArrowIcon = ({ up }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-0.5">
    {up
      ? <><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></>
      : <><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></>
    }
  </svg>
);

// Icone loupe chargement
const SpinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="inline mr-1.5 animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default function CountryDetailsPanel({ selectedCountry }) {

  const [targetYear, setTargetYear]     = useState(MIN_FORECAST_YEAR + 2);
  const [forecast, setForecast]         = useState(null);   // { lastKnownYear, data: [{year, predicted_price}] }
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  // Reset forecast quand on change de pays
  const prevCountryRef = React.useRef(null);
  if (selectedCountry?.id !== prevCountryRef.current) {
    prevCountryRef.current = selectedCountry?.id;
    if (forecast !== null) setForecast(null);
    if (error !== null)    setError(null);
  }

  const runPrediction = useCallback(async () => {
    if (!selectedCountry) return;
    setLoading(true);
    setError(null);
    setForecast(null);

    const apiName = FR_TO_API[selectedCountry.name] || selectedCountry.name;

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ country: apiName, year: targetYear }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setForecast({ lastKnownYear: json.last_known_year, data: json.forecast });
    } catch (e) {
      setError(e.message || 'Erreur de connexion a l\'API');
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, targetYear]);

  // ── Etat vide ──────────────────────────────────────────────────────────────
  if (!selectedCountry) {
    return (
      <div className="bg-bg-secondary border border-border rounded-card p-6 flex flex-col items-center justify-center h-full text-center gap-3">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-text-secondary">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <p className="text-text-secondary text-sm">Selectionnez un pays sur la carte</p>
      </div>
    );
  }

  // ── Donnees historiques depuis selectedCountry ─────────────────────────────
  const historiqueData = selectedCountry.historique.labels.map((label, i) => ({
    periode: label,
    reel:    selectedCountry.historique.reel[i],
    prevision: selectedCountry.historique.prevision[i],
  }));

  // ── Fusion historique + predictions pour le graphique combine ─────────────
  const forecastChartData = forecast
    ? [
        // Dernier point historique comme ancre
        { periode: String(forecast.lastKnownYear), reel: selectedCountry.prixActuel },
        // Points de prediction
        ...forecast.data.map((f) => ({
          periode:   String(f.year),
          prediction: f.predicted_price,
        })),
      ]
    : [];

  // Delta entre prediction finale et prix actuel
  const lastPred = forecast?.data?.[forecast.data.length - 1];
  const delta = lastPred
    ? ((lastPred.predicted_price - selectedCountry.prixActuel) / selectedCountry.prixActuel * 100)
    : null;

  return (
    <div className="bg-bg-secondary border border-border rounded-card text-text-primary shadow-lg flex flex-col gap-4 p-5 h-full overflow-y-auto">

      {/* ── En-tete pays ── */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-semibold text-text-primary">{selectedCountry.name}</h2>
        <p className="text-text-secondary text-sm mt-0.5">
          Dernieres donnees : {LAST_DATA_YEAR}
        </p>
      </div>

      {/* ── Prix actuel ── */}
      <div className="bg-bg-tertiary rounded-xl p-4 border border-border flex-shrink-0">
        <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">
          Dernier prix connu ({LAST_DATA_YEAR})
        </p>
        <p className="text-3xl font-bold text-accent-green">
          {selectedCountry.prixActuel}
          <span className="text-base font-normal text-text-secondary ml-1">
            {selectedCountry.unit}
          </span>
        </p>
        <p className={`mt-1.5 text-sm ${selectedCountry.variation >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
          {selectedCountry.variation > 0 ? '+' : ''}{selectedCountry.variation}%
          <span className="text-text-secondary ml-1">vs annee precedente</span>
        </p>
      </div>

      {/* ── Graphique historique ── */}
      <div className="bg-bg-tertiary rounded-xl p-4 border border-border flex-shrink-0">
        <h3 className="text-sm font-semibold mb-3 text-text-primary">Historique</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historiqueData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="periode" stroke="#7D8590" tick={{ fontSize: 10 }} />
              <YAxis stroke="#7D8590" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line type="monotone" dataKey="reel" name="Reel" stroke="#58A6FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="prevision" name="Prevision" stroke="#F0883E" strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Prediction par annee ── */}
      <div className="bg-bg-tertiary rounded-xl p-4 border border-border flex-shrink-0">
        <h3 className="text-sm font-semibold mb-3 text-text-primary">Prediction par annee cible</h3>

        {/* Slider annee */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-text-secondary w-10 flex-shrink-0">
            {MIN_FORECAST_YEAR}
          </span>
          <input
            type="range"
            min={MIN_FORECAST_YEAR}
            max={MAX_FORECAST_YEAR}
            step={1}
            value={targetYear}
            onChange={(e) => {
              setTargetYear(Number(e.target.value));
              setForecast(null);
              setError(null);
            }}
            className="flex-1 accent-accent-green"
          />
          <span className="text-xs text-text-secondary w-10 flex-shrink-0 text-right">
            {MAX_FORECAST_YEAR}
          </span>
        </div>

        {/* Annee selectionnee + bouton */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-semibold text-accent-green text-center">
            {targetYear}
          </div>
          <button
            onClick={runPrediction}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-medium hover:bg-accent-green/20 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><SpinIcon /> Calcul...</>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Predire
              </>
            )}
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="text-xs text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Resultats */}
        {forecast && !error && (
          <div className="space-y-3">

            {/* Prix predit final */}
            <div className="bg-bg-secondary border border-border rounded-xl p-3">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                Prix predit en {targetYear}
              </p>
              <p className="text-2xl font-bold text-accent-green">
                {lastPred?.predicted_price}
                <span className="text-sm font-normal text-text-secondary ml-1">USD/t</span>
              </p>
              {delta !== null && (
                <p className={`text-xs mt-1 ${delta >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  <ArrowIcon up={delta >= 0} />
                  {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs {LAST_DATA_YEAR}
                </p>
              )}
            </div>

            {/* Graphique de prediction */}
            {forecast.data.length > 1 && (
              <div>
                <p className="text-xs text-text-secondary mb-2">Evolution prevue jusqu'en {targetYear}</p>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                      <XAxis dataKey="periode" stroke="#7D8590" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#7D8590" tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        x={String(forecast.lastKnownYear)}
                        stroke="#7D8590"
                        strokeDasharray="4 3"
                        label={{ value: 'Debut', fill: '#7D8590', fontSize: 9, position: 'insideTopRight' }}
                      />
                      <Line type="monotone" dataKey="reel" name="Reel" stroke="#58A6FF" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                      <Line type="monotone" dataKey="prediction" name="Prediction" stroke="#3FB950" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Tableau annee par annee */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 text-xs text-text-secondary bg-bg-secondary px-3 py-1.5 border-b border-border">
                <span>Annee</span>
                <span className="text-right">Prix predit</span>
              </div>
              {forecast.data.map((f) => (
                <div
                  key={f.year}
                  className={`grid grid-cols-2 px-3 py-2 text-sm border-b border-border last:border-none transition-colors
                    ${f.year === targetYear ? 'bg-accent-green/5 font-semibold' : 'hover:bg-bg-hover'}`}
                >
                  <span className={f.year === targetYear ? 'text-accent-green' : 'text-text-secondary'}>
                    {f.year}
                  </span>
                  <span className="text-right text-text-primary">{f.predicted_price} USD/t</span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* ── Facteurs influents ── */}
      {selectedCountry.facteurs?.length > 0 && (
        <div className="bg-bg-tertiary rounded-xl p-4 border border-border flex-shrink-0">
          <h3 className="text-sm font-semibold mb-3 text-text-primary">Facteurs influents</h3>
          <div className="space-y-3">
            {selectedCountry.facteurs.map((facteur, index) => (
              <div key={index} className="border-b border-border pb-3 last:border-none last:pb-0">
                <h4 className="text-sm font-medium text-text-primary mb-0.5">{facteur.titre}</h4>
                <p className="text-xs text-text-secondary">{facteur.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}