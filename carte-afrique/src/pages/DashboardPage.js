import React, { useState } from "react";

import NavBar from "../components/NavBar";
import InteractiveAfricaMap from "../components/InteractiveAfricaMap";
import CountryDetailsPanel from "../components/CountryDetailsPanel";

const DashboardPage = () => {

  const [selectedCountry, setSelectedCountry] = useState(null);

  // Etat navigation
  const [activeTab, setActiveTab] = useState("dashboard");

  // Etat dark mode
  const [darkMode, setDarkMode] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={darkMode ? "dark min-h-screen bg-bg-primary" : "min-h-screen bg-white"}>

      <NavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
      />

      <div className="
        p-6
        grid grid-cols-1 lg:grid-cols-3
        gap-6
      ">

        {/* Carte */}
        <div className="lg:col-span-2">
          <InteractiveAfricaMap
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>

        {/* Panel détails */}
        <div>
          <CountryDetailsPanel
            selectedCountry={selectedCountry}
          />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;