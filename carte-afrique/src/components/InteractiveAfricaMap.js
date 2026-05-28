import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';

import {
  COUNTRIES_DATA,
  COUNTRY_NAME_MAP,
  PRICE_COLORS,
} from '../data/mockData';

// Carte GeoJSON Afrique
const GEO_URL =
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

export default function InteractiveAfricaMap({
  selectedCountry,
  onSelectCountry,
}) {

  // Retourne la couleur du pays
  const getCountryColor = (countryData) => {
    if (!countryData) {
      return PRICE_COLORS.default;
    }

    return PRICE_COLORS[countryData.priceLevel] || PRICE_COLORS.default;
  };

  return (
    <div className="
      bg-bg-secondary
      border border-border
      rounded-card
      p-5
      shadow-lg
    ">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Carte Interactive de l’Afrique
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Cliquez sur un pays pour afficher les détails.
          </p>
        </div>

        {/* Légende */}
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          {Object.entries(PRICE_COLORS)
            .filter(([key]) => key !== 'default')
            .map(([key, color]) => (
              <div key={key} className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span>{key}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Carte */}
      <div className="w-full flex justify-center">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 420,
            center: [20, 5],
          }}
          className="w-full max-w-5xl"
        >

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {

                // Nom renvoyé par le GeoJSON
                const geoName = geo.properties.name;

                // Conversion anglais -> français
                const mappedName = COUNTRY_NAME_MAP[geoName];

                // Données du pays
                const countryData = mappedName
                  ? COUNTRIES_DATA[mappedName]
                  : null;

                // Vérifie si sélectionné
                const isSelected =
                  selectedCountry?.id === countryData?.id;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (countryData) {
                        onSelectCountry(countryData);
                      }
                    }}
                    className="transition-all duration-200 cursor-pointer"
                    style={{
                      default: {
                        fill: getCountryColor(countryData),
                        stroke: isSelected ? '#FFFFFF' : '#30363D',
                        strokeWidth: isSelected ? 2 : 0.6,
                        outline: 'none',
                      },
                      hover: {
                        fill: '#58A6FF',
                        outline: 'none',
                        cursor: countryData ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: '#3FB950',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}
