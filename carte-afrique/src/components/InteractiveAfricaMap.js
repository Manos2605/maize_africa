import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { COUNTRY_NAME_MAP, PRICE_COLORS, getCountryFromGeoName } from '../data/mockData';

const GEO_URL =
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

export default function InteractiveAfricaMap({ selectedCountry, onSelectCountry, countriesData }) {

  // Afficher les pays disponibles (debug)
  React.useEffect(() => {
    console.log('🗺️ InteractiveAfricaMap loaded with', Object.keys(countriesData).length, 'countries');
    if (Object.keys(countriesData).length > 0) {
      console.log('Available countries:', Object.keys(countriesData).sort());
    }
  }, [countriesData]);

  const getCountryColor = (countryData) => {
    if (!countryData) return PRICE_COLORS.default;
    return PRICE_COLORS[countryData.priceLevel] || PRICE_COLORS.default;
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-card shadow-lg flex flex-col h-full">

      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Carte interactive de l'Afrique</h2>
          <p className="text-xs text-text-secondary mt-0.5">Cliquez sur un pays pour afficher les details</p>
        </div>

        {/* Legende */}
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          {Object.entries(PRICE_COLORS)
            .filter(([key]) => key !== 'default')
            .map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span>{key}</span>
              </div>
            ))}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PRICE_COLORS.default }} />
            <span>N/A</span>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-2">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 340, center: [20, 5] }}
          className="w-full max-w-3xl"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              // Log exhaustif au premier rendu
              let countMatched = 0;
              let countNotMatched = 0;
              const notMatched = [];
              
              // Comptabiliser les matchs
              geographies.forEach((geo) => {
                const geoName = geo.properties.name;
                const countryData = getCountryFromGeoName(geoName, countriesData, COUNTRY_NAME_MAP);
                if (countryData) {
                  countMatched++;
                } else {
                  countNotMatched++;
                  notMatched.push(geoName);
                }
              });
              
              if (Object.keys(countriesData).length > 0) {
                console.log(`📊 Matching: ${countMatched} matched, ${countNotMatched} not matched`);
                if (notMatched.length > 0 && notMatched.length <= 20) {
                  console.log('❌ Not matched:', notMatched);
                }
              }
              
              return geographies.map((geo) => {
                const geoName = geo.properties.name;
                
                // Utiliser la fonction de fallback intelligent
                const countryData = getCountryFromGeoName(geoName, countriesData, COUNTRY_NAME_MAP);
                
                const isSelected = selectedCountry?.id === countryData?.id;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => { if (countryData) onSelectCountry(countryData); }}
                    className="transition-all duration-200"
                    style={{
                      default: {
                        fill: countryData ? getCountryColor(countryData) : PRICE_COLORS.default,
                        stroke: isSelected ? '#FFFFFF' : '#30363D',
                        strokeWidth: isSelected ? 2 : 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: countryData ? '#58A6FF' : PRICE_COLORS.default,
                        outline: 'none',
                        cursor: countryData ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: countryData ? '#3FB950' : PRICE_COLORS.default,
                        outline: 'none',
                      },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ComposableMap>
      </div>

    </div>
  );
}