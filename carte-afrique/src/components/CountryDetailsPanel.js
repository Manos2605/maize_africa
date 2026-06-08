import React, { useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine, Legend,
} from 'recharts';

/* const API_BASE = 'http://127.0.0.1:8000'; */
const API_BASE = 'https://iageneratif-model-sonwa.hf.space';

const LAST_DATA_YEAR = 2024;
const CURRENT_YEAR = 2026;
const MIN_FORECAST_YEAR = CURRENT_YEAR + 1;
const MAX_FORECAST_YEAR = LAST_DATA_YEAR + 20;

const FR_TO_API = {
  "Ethiopie":       "Ethiopia",
  "Nigeria":        "Nigeria",
  "Afrique du Sud": "South Africa",
  "Kenya":          "Kenya",
  "Ghana":          "Ghana",
  "Tanzanie":       "Tanzania",
  "Cameroun":       "Cameroon",
  "RDC":            "Democratic Republic of the Congo",
  "Mozambique":     "Mozambique",
  "Zimbabwe":       "Zimbabwe",
  "Zambie":         "Zambia",
  "Ouganda":        "Uganda",
  "Mali":           "Mali",
  "Senegal":        "Senegal",
  "Cote d'Ivoire":  "Ivory Coast",
  "Maroc":          "Morocco",
  "Egypte":         "Egypt",
  "Algerie":        "Algeria",
  "Tunisie":        "Tunisia",
  "Soudan":         "Sudan",
  "Angola":         "Angola",
  "Malawi":         "Malawi",
  "Rwanda":         "Rwanda",
  "Burkina Faso":   "Burkina Faso",
  "Niger":          "Niger",
  "Tchad":          "Chad",
  "Madagascar":     "Madagascar",
  "Namibie":        "Namibia",
  "Botswana":       "Botswana",
  "Liberia":        "Liberia",
  "Sierra Leone":   "Sierra Leone",
  "Guinee":         "Guinea",
  "Benin":          "Benin",
  "Togo":           "Togo",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name} : {Number(p.value).toFixed(1)} USD/t
        </p>
      ))}
    </div>
  );
};

const ArrowIcon = ({ up }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-0.5">
    {up
      ? <><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></>
      : <><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></>
    }
  </svg>
);

const SpinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="inline mr-1.5 animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default function CountryDetailsPanel({ selectedCountry }) {
  const [targetYear, setTargetYear] = useState(MIN_FORECAST_YEAR + 2);
  const [forecast, setForecast]     = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // Données brutes de l'API : { prices: [{year, price}], prixActuel, variation, bridge: [{year, predicted_price}] }
  const [apiData, setApiData]               = useState(null);
  const [loadingHistorique, setLoadingHistorique] = useState(false);

  // Charger historique + bridge 2025-2026 au changement de pays
  React.useEffect(() => {
    if (!selectedCountry) return;

    setApiData(null);
    setForecast(null);
    setError(null);
    setLoadingHistorique(true);

    const apiName = FR_TO_API[selectedCountry.name] || selectedCountry.name;

    // 1. Historique réel
    fetch(`${API_BASE}/prices/${encodeURIComponent(apiName)}`)
      .then(res => res.json())
      .then(async (data) => {
        const prices = data.prices || [];

        // Prix actuel = dernier point du dataset (2024)
        const sorted = [...prices].sort((a, b) => a.year - b.year);
        const lastEntry  = sorted[sorted.length - 1];
        const prevEntry  = sorted[sorted.length - 2];
        const prixActuel = lastEntry?.price ?? null;
        const variation  = (prixActuel && prevEntry?.price)
          ? ((prixActuel - prevEntry.price) / prevEntry.price * 100)
          : null;

        // 2. Bridge automatique 2025 → 2026 (années manquantes jusqu'à aujourd'hui)
        let bridge = [];
        try {
          const bridgeRes = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: apiName, year: CURRENT_YEAR }),
          });
          const bridgeJson = await bridgeRes.json();
          if (bridgeJson.forecast) {
            // Garder uniquement 2025 et 2026
            bridge = bridgeJson.forecast.filter(f => f.year >= LAST_DATA_YEAR + 1 && f.year <= CURRENT_YEAR);
          }
        } catch (_) { /* bridge optionnel */ }

        setApiData({ prices: sorted, prixActuel, variation, bridge });
      })
      .catch(() => setApiData(null))
      .finally(() => setLoadingHistorique(false));

  }, [selectedCountry]);

  // Lancer une prédiction manuelle (années > 2026)
  const runPrediction = useCallback(async () => {
    if (!selectedCountry) return;
    setLoading(true);
    setError(null);
    setForecast(null);

    const apiName = FR_TO_API[selectedCountry.name] || selectedCountry.name;

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: apiName, year: targetYear }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setForecast({ lastKnownYear: json.last_known_year, data: json.forecast });
    } catch (e) {
      setError(e.message || 'Erreur de connexion à l\'API');
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, targetYear]);

  // ─── Données graphique unifié ───────────────────────────────────────────────
  // Points réels (jusqu'à 2024)
  const reelPoints = (apiData?.prices || []).map(p => ({
    periode: String(p.year),
    reel: p.price,
  }));

  // Points bridge (2025-2026, prédits automatiquement)
  const bridgePoints = (apiData?.bridge || []).map(p => ({
    periode: String(p.year),
    bridge: p.predicted_price,
  }));

  // Points prédiction manuelle (> 2026)
  const predPoints = forecast
    ? forecast.data
        .filter(f => f.year > CURRENT_YEAR)
        .map(f => ({ periode: String(f.year), prediction: f.predicted_price }))
    : [];

  // Fusion par période sur un seul tableau
  const allPeriodes = [
    ...new Set([
      ...reelPoints.map(p => p.periode),
      ...bridgePoints.map(p => p.periode),
      ...predPoints.map(p => p.periode),
    ]),
  ].sort();

  const chartData = allPeriodes.map(periode => {
    const r = reelPoints.find(p => p.periode === periode);
    const b = bridgePoints.find(p => p.periode === periode);
    const pr = predPoints.find(p => p.periode === periode);
    return {
      periode,
      ...(r  ? { reel: r.reel }                : {}),
      ...(b  ? { bridge: b.bridge }             : {}),
      ...(pr ? { prediction: pr.prediction }    : {}),
    };
  });

  // Jonction reel→bridge : dupliquer le dernier point réel comme premier point bridge
  if (reelPoints.length && bridgePoints.length) {
    const lastReel = reelPoints[reelPoints.length - 1];
    const anchorIdx = chartData.findIndex(p => p.periode === lastReel.periode);
    if (anchorIdx !== -1) chartData[anchorIdx].bridge = lastReel.reel;
  }

  // Jonction bridge→prediction
  if (bridgePoints.length && predPoints.length) {
    const lastBridge = bridgePoints[bridgePoints.length - 1];
    const anchorIdx = chartData.findIndex(p => p.periode === lastBridge.periode);
    if (anchorIdx !== -1) chartData[anchorIdx].prediction = lastBridge.bridge;
  } else if (reelPoints.length && predPoints.length && !bridgePoints.length) {
    const lastReel = reelPoints[reelPoints.length - 1];
    const anchorIdx = chartData.findIndex(p => p.periode === lastReel.periode);
    if (anchorIdx !== -1) chartData[anchorIdx].prediction = lastReel.reel;
  }

  // Delta prédiction finale vs prix 2024
  const lastPred = forecast?.data?.[forecast.data.length - 1];
  const delta = (lastPred && apiData?.prixActuel)
    ? ((lastPred.predicted_price - apiData.prixActuel) / apiData.prixActuel * 100)
    : null;

  //  État vide
  if (!selectedCountry) {
    return (
      <div className="bg-bg-secondary border border-border rounded-card p-6 flex flex-col items-center justify-center h-full text-center gap-3">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-text-secondary">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <p className="text-text-secondary text-sm">Sélectionnez un pays sur la carte</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-card text-text-primary shadow-lg flex flex-col gap-4 p-5 h-full overflow-y-auto">

      {/* En-tête pays */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-semibold text-text-primary">{selectedCountry.name}</h2>
        <p className="text-text-secondary text-sm mt-0.5">
          Dernières données : {LAST_DATA_YEAR} · Nous sommes en {CURRENT_YEAR}
        </p>
      </div>

      {/* Prix actuel 2024 */}
      <div className="bg-bg-tertiary rounded-xl p-4 border border-border flex-shrink-0">
        <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">
          Dernier prix connu ({LAST_DATA_YEAR})
        </p>
        {loadingHistorique ? (
          <p className="text-text-secondary text-sm"><SpinIcon /> Chargement...</p>
        ) : (
          <>
            <p className="text-3xl font-bold text-accent-green">
              {apiData?.prixActuel != null ? Number(apiData.prixActuel).toFixed(1) : '—'}
              <span className="text-base font-normal text-text-secondary ml-1">USD/t</span>
            </p>
            {apiData?.variation != null && (
              <p className={`mt-1.5 text-sm ${apiData.variation >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                <ArrowIcon up={apiData.variation >= 0} />
                {apiData.variation > 0 ? '+' : ''}{apiData.variation.toFixed(1)}%
                <span className="text-text-secondary ml-1">vs {LAST_DATA_YEAR - 1}</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* Graphique unifié : historique + bridge + prédiction */}
      <div className="bg-bg-tertiary rounded-xl p-4 border border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Historique &amp; Prévisions
          </h3>
          {forecast && (
            <span className="text-xs text-text-secondary">
              jusqu'en {targetYear}
            </span>
          )}
        </div>

        {loadingHistorique ? (
          <div className="h-52 flex items-center justify-center text-text-secondary text-xs">
            <SpinIcon /> Chargement des données...
          </div>
        ) : (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="periode" stroke="#7D8590" tick={{ fontSize: 10 }} />
                <YAxis stroke="#7D8590" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />

                {/* Ligne réelle */}
                <Line
                  type="monotone" dataKey="reel" name="Réel"
                  stroke="#58A6FF" strokeWidth={2} dot={false} connectNulls
                />

                {/* Bridge 2025-2026 (pointillé bleu clair) */}
                <Line
                  type="monotone" dataKey="bridge" name="Prévision"
                  stroke="#F0883E" strokeWidth={2} strokeDasharray="5 4"
                  dot={false} connectNulls
                />

                {/* Prédiction manuelle (vert) */}
                {forecast && (
                  <Line
                    type="monotone" dataKey="prediction" name="Prédiction"
                    stroke="#3FB950" strokeWidth={2} strokeDasharray="5 4"
                    dot={{ r: 3 }} connectNulls
                  />
                )}

                {/* Séparateur fin du dataset */}
                <ReferenceLine
                  x={String(LAST_DATA_YEAR)}
                  stroke="#7D8590" strokeDasharray="4 3"
                  label={{ value: 'Fin data', fill: '#7D8590', fontSize: 9, position: 'insideTopRight' }}
                />

                {/* Séparateur aujourd'hui */}
                <ReferenceLine
                  x={String(CURRENT_YEAR)}
                  stroke="#F0883E" strokeDasharray="4 3"
                  label={{ value: "Auj.", fill: '#F0883E', fontSize: 9, position: 'insideTopRight' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Prédiction manuelle (années > 2026) */}
      <div className="bg-bg-tertiary rounded-xl p-4 border border-border flex-shrink-0">
        <h3 className="text-sm font-semibold mb-3 text-text-primary">Prédiction par année cible</h3>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-text-secondary w-10 flex-shrink-0">{MIN_FORECAST_YEAR}</span>
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
          <span className="text-xs text-text-secondary w-10 flex-shrink-0 text-right">{MAX_FORECAST_YEAR}</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-semibold text-accent-green text-center">
            {targetYear}
          </div>
          <button
            onClick={runPrediction}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-medium hover:bg-accent-green/20 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <><SpinIcon /> Calcul...</> : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Prédire
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="text-xs text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {forecast && !error && lastPred && (
          <div className="space-y-3">
            <div className="bg-bg-secondary border border-border rounded-xl p-3">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                Prix prédit en {targetYear}
              </p>
              <p className="text-2xl font-bold text-accent-green">
                {Number(lastPred.predicted_price).toFixed(1)}
                <span className="text-sm font-normal text-text-secondary ml-1">USD/t</span>
              </p>
              {delta !== null && (
                <p className={`text-xs mt-1 ${delta >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  <ArrowIcon up={delta >= 0} />
                  {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs {LAST_DATA_YEAR}
                </p>
              )}
            </div>

            {/* Tableau année par année */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 text-xs text-text-secondary bg-bg-secondary px-3 py-1.5 border-b border-border">
                <span>Année</span>
                <span className="text-right">Prix prédit</span>
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
                  <span className="text-right text-text-primary">{Number(f.predicted_price).toFixed(1)} USD/t</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Facteurs influents */}
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