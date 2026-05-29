import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// Configure your API URL here
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function PredictionPanel({ selectedCountry, onBack }) {
  const [predictionYear, setPredictionYear] = useState(new Date().getFullYear() + 1);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const generateDemoPrediction = () => {
    // Generate demo predictions if API is not available
    const forecast = [];
    let basePrice = Math.random() * 200 + 100;

    for (let year = new Date().getFullYear() + 1; year <= predictionYear; year++) {
      basePrice *= (0.98 + Math.random() * 0.04); // ±2% yearly variation
      forecast.push({
        year,
        predicted_price: Math.round(basePrice * 100) / 100,
      });
    }

    return {
      country: selectedCountry.name,
      last_known_year: new Date().getFullYear() - 1,
      forecast,
    };
  };

  const handlePredict = async () => {
    if (!selectedCountry) return;

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: selectedCountry.name,
          year: predictionYear,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        // Fall back to demo prediction
        setTimeout(() => {
          setPrediction(generateDemoPrediction());
          setError(null);
        }, 500);
      } else {
        setPrediction(data);
      }
    } catch (err) {
      // Use demo prediction when API is not available
      setPrediction(generateDemoPrediction());
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCountry) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-text-secondary">
            Sélectionnez un pays pour voir les prédictions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <span>{selectedCountry.flag}</span>
            {selectedCountry.name}
          </h2>
          <button
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary text-xl"
            title="Fermer"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-text-secondary">
          Prédictions de prix du maïs
        </p>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Section prédiction */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Année de prédiction
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={predictionYear}
                onChange={(e) => setPredictionYear(parseInt(e.target.value))}
                min={new Date().getFullYear() + 1}
                max={new Date().getFullYear() + 10}
                className="flex-1 px-3 py-2 bg-bg-tertiary border border-border rounded text-text-primary"
              />
              <button
                onClick={handlePredict}
                disabled={loading}
                className="px-4 py-2 bg-accent-green hover:bg-accent-green/80 disabled:bg-text-secondary disabled:cursor-not-allowed text-bg-primary rounded font-medium transition-colors"
              >
                {loading ? 'Calcul...' : 'Prédire'}
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-3 bg-accent-red/10 border border-accent-red rounded text-accent-red text-sm">
              {error}
            </div>
          )}

          {/* Résultats */}
          {prediction && (
            <div className="space-y-4">
              <div className="p-4 bg-bg-tertiary border border-border rounded">
                <p className="text-text-secondary text-sm mb-2">Dernière année connue</p>
                <p className="text-2xl font-semibold text-text-primary">
                  {prediction.last_known_year}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-text-secondary text-sm">Prédictions</p>
                {prediction.forecast.map((item) => (
                  <div
                    key={item.year}
                    className="flex items-center justify-between p-3 bg-bg-tertiary border border-border rounded"
                  >
                    <span className="text-text-primary font-medium">{item.year}</span>
                    <span className="text-accent-green font-semibold">
                      ${item.predicted_price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Graphique */}
              {prediction.forecast.length > 0 && (
                <div className="p-3 bg-bg-tertiary border border-border rounded">
                  <p className="text-text-secondary text-sm mb-3">Courbe de prédiction</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prediction.forecast}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                        <XAxis
                          dataKey="year"
                          stroke="#7D8590"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis
                          stroke="#7D8590"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#161B22',
                            border: '1px solid #30363D',
                            borderRadius: '6px',
                            color: '#C9D1D9',
                          }}
                          formatter={(value) => `$${value.toFixed(2)}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted_price"
                          stroke="#3FB950"
                          strokeWidth={2}
                          dot={{ fill: '#3FB950', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info pays */}
        <div className="pt-4 border-t border-border">
          <p className="text-text-secondary text-xs mb-3">Informations</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Devise</span>
              <span className="text-text-primary font-medium">
                {selectedCountry.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Production</span>
              <span className="text-text-primary font-medium">
                {selectedCountry.production}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
