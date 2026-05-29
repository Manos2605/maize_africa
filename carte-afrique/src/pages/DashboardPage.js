import React, { useState, useEffect } from "react";
import InteractiveAfricaMap from "../components/InteractiveAfricaMap";
import PredictionPanel from "../components/PredictionPanel";

const DashboardPage = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mapScale, setMapScale] = useState(420);
  const [mapCenter, setMapCenter] = useState([20, 5]);

  // Coordonnées des pays pour le zoom
  const COUNTRY_COORDS = {
    Nigeria: { center: [8, 10], scale: 1200 },
    Cameroun: { center: [12, 5], scale: 1500 },
    Kenya: { center: [35, 0], scale: 1500 },
    Ghana: { center: [-2, 8], scale: 1800 },
    Ethiopie: { center: [40, 8], scale: 1500 },
    Tanzania: { center: [35, -7], scale: 1500 },
  };

  // Gestion du zoom sur le pays
  useEffect(() => {
    if (selectedCountry && COUNTRY_COORDS[selectedCountry.name]) {
      const coords = COUNTRY_COORDS[selectedCountry.name];
      setMapCenter(coords.center);
      setMapScale(coords.scale);
    } else {
      setMapScale(420);
      setMapCenter([20, 5]);
    }
  }, [selectedCountry]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} h-screen bg-bg-primary flex flex-col overflow-hidden`}>
      {/* Header simplifié */}
      <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🌽</div>
          <div className="flex flex-col">
            <span className="text-text-primary font-semibold">MaizePredict AI</span>
            <span className="text-text-secondary text-xs">Prédiction du prix du maïs en Afrique</span>
          </div>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-lg bg-bg-tertiary hover:bg-bg-hover border border-border flex items-center justify-center text-text-secondary"
          title="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Carte */}
        <div className="flex-1 overflow-auto">
          <InteractiveAfricaMap
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            mapScale={mapScale}
            mapCenter={mapCenter}
          />
        </div>

        {/* Panel prédiction */}
        <div className="w-96 border-l border-border bg-bg-secondary overflow-auto">
          <PredictionPanel
            selectedCountry={selectedCountry}
            onBack={() => setSelectedCountry(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
