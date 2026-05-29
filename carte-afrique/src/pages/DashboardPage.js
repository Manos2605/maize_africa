import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import InteractiveAfricaMap from '../components/InteractiveAfricaMap';
import CountryDetailsPanel from '../components/CountryDetailsPanel';

const DashboardPage = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeTab, setActiveTab]             = useState('dashboard');
  const [darkMode, setDarkMode]               = useState(true);

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen flex flex-col overflow-hidden bg-bg-primary`}>

      <NavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(prev => !prev)}
      />

      {/* Corps — prend toute la hauteur restante */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden min-h-0">

        {/* Carte — 2/3 */}
        <div className="lg:col-span-2 min-h-0">
          <InteractiveAfricaMap
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>

        {/* Panel details — 1/3, scrollable en interne */}
        <div className="min-h-0 overflow-hidden">
          <CountryDetailsPanel selectedCountry={selectedCountry} />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;