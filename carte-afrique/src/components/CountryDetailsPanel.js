import React from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const CountryDetailsPanel = ({ selectedCountry }) => {

    if (!selectedCountry) {
    return (
        <div className="
        bg-bg-secondary
        border border-border
        rounded-card
        p-6
        text-text-primary
        ">
        <h2 className="text-2xl font-semibold mb-3">
            Détails du Pays
        </h2>

        <p className="text-text-secondary">
            Sélectionnez un pays sur la carte.
        </p>
        </div>
    );
    }

  // Transformation des données historiques
    const historiqueData =
    selectedCountry.historique.labels.map((label, index) => ({
        mois: label,
        reel: selectedCountry.historique.reel[index],
        prevision: selectedCountry.historique.prevision[index],
    }));

  // Transformation prévision 6 mois
    const forecastData =
    selectedCountry.prevision6mois.labels.map((label, index) => ({
        mois: label,
        valeur: selectedCountry.prevision6mois.valeurs[index],
    }));
    console.log(selectedCountry);
    return (
    <div className="
        bg-bg-secondary
        border border-border
        rounded-card
        p-6
        text-text-primary
        shadow-lg
        space-y-6
    ">

      {/* Header */}
        <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span>{selectedCountry.flag}</span>
            {selectedCountry.name}
        </h2>

        <p className="text-text-secondary mt-1">
            {selectedCountry.city}
        </p>
        </div>

      {/* Prix actuel */}
        <div className="
        bg-bg-tertiary
        rounded-xl
        p-4
        border border-border
        ">
        <p className="text-text-secondary text-sm mb-1">
            Prix actuel
        </p>

        <h3 className="text-3xl font-bold text-accent-green">
            {selectedCountry.prixActuel} {selectedCountry.unit}
        </h3>

        <p
        className={`mt-2 text-sm ${
        selectedCountry.variation >= 0
        ? "text-accent-green"
        : "text-accent-red"
        }`}
>
        {selectedCountry.variation > 0 ? "+" : ""}
        {selectedCountry.variation}%
        </p>
        </div>

      {/* Production */}
        <div className="
        bg-bg-tertiary
        rounded-xl
        p-4
        border border-border
        ">
        <p className="text-text-secondary text-sm">
            Production
        </p>

        <h3 className="text-2xl font-semibold mt-1">
            {selectedCountry.production}
        </h3>
        </div>

      {/* Graphique historique */}
        <div className="
        bg-bg-tertiary
        rounded-xl
        p-4
        border border-border
        ">
        <h3 className="text-lg font-semibold mb-4">
            Historique & Prévisions
        </h3>

        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historiqueData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                dataKey="mois"
                stroke="#7D8590"
                />

                <YAxis
                stroke="#7D8590"
                />

                <Tooltip />

                <Line
                type="monotone"
                dataKey="reel"
                stroke="#58A6FF"
                strokeWidth={3}
                dot={false}
                />

                <Line
                type="monotone"
                dataKey="prevision"
                stroke="#F0883E"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>

      {/* Prévisions 6 mois */}
        <div className="
        bg-bg-tertiary
        rounded-xl
        p-4
        border border-border
        ">
        <h3 className="text-lg font-semibold mb-4">
            Prévisions 6 mois
        </h3>

        <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                dataKey="mois"
                stroke="#7D8590"
                />

                <YAxis
                stroke="#7D8590"
                />

                <Tooltip />

                <Line
            type="monotone"
                dataKey="valeur"
                stroke="#3FB950"
                strokeWidth={3}
                dot={false}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>

      {/* Facteurs */}
        <div className="
        bg-bg-tertiary
        rounded-xl
        p-4
        border border-border
        ">
        <h3 className="text-lg font-semibold mb-4">
            Facteurs influents
        </h3>

        <div className="space-y-4">
            {selectedCountry.facteurs.map((facteur, index) => (
            <div
                key={index}
                className="border-b border-border pb-3 last:border-none"
            >
                <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">
                    {facteur.icon}
                </span>

                <h4 className="font-medium">
                    {facteur.titre}
                </h4>
                </div>

                <p className="text-sm text-text-secondary">
                {facteur.description}
                </p>
            </div>
            ))}
        </div>
        </div>

    </div>
    );
};

export default CountryDetailsPanel;