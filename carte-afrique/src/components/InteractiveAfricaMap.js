import React, { useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid, geoBounds } from 'd3-geo';
import { COUNTRIES_DATA, COUNTRY_NAME_MAP, PRICE_COLORS } from '../data/mockData';

const GEO_URL =
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

const DEFAULT_CENTER = [20, 5];
const DEFAULT_ZOOM = 1;

function getZoomForBounds(bounds) {
  const [[x0, y0], [x1, y1]] = bounds;
  const maxDim = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  if (maxDim < 5) return 8;
  if (maxDim < 10) return 6;
  if (maxDim < 20) return 4;
  if (maxDim < 40) return 3;
  return 2;
}

export default function InteractiveAfricaMap({ selectedCountry, onSelectCountry }) {
  const [position, setPosition] = useState({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  const [isZoomed, setIsZoomed] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, name: '' });

  const getCountryColor = (countryData) => {
    if (!countryData) return PRICE_COLORS.default;
    return PRICE_COLORS[countryData.priceLevel] || PRICE_COLORS.default;
  };

  const handleCountryClick = useCallback((countryData, geo) => {
    if (!countryData) return;
    onSelectCountry(countryData);
    const centroid = geoCentroid(geo);
    const bounds = geoBounds(geo);
    setPosition({ coordinates: centroid, zoom: getZoomForBounds(bounds) });
    setIsZoomed(true);
  }, [onSelectCountry]);

  const handleReset = useCallback(() => {
    setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
    setIsZoomed(false);
    onSelectCountry(null);
  }, [onSelectCountry]);

  const handleMouseMove = useCallback((e) => {
    setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
  }, []);

  const handleMouseEnter = useCallback((name) => {
    setTooltip(prev => ({ ...prev, visible: true, name }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="bg-bg-secondary border border-border rounded-card shadow-lg flex flex-col h-full">

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-md text-xs font-medium pointer-events-none
                     bg-bg-primary border border-border text-text-primary shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 32 }}
        >
          {tooltip.name}
        </div>
      )}

      {/* Header */}
      <div className="px-3 sm:px-5 py-2.5 border-b border-border flex items-center justify-between flex-shrink-0 gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-text-primary truncate">
            Carte interactive de l'Afrique
          </h2>
          {/* Sous-titre masqué sur très petit écran */}
          <p className="text-xs text-text-secondary mt-0.5 hidden sm:block">
            Cliquez sur un pays pour afficher les détails
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          {/* Bouton retour */}
          {isZoomed && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium
                         bg-bg-primary border border-border text-text-secondary
                         hover:text-text-primary hover:border-accent transition-all duration-200 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span className="hidden sm:inline">Carte complète</span>
            </button>
          )}

          {/* Légende — scrollable horizontalement sur mobile */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-text-secondary overflow-x-auto max-w-[180px] sm:max-w-none">
            {Object.entries(PRICE_COLORS)
              .filter(([key]) => key !== 'default')
              .map(([key, color]) => (
                <div key={key} className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: color }} />
                  {/* Label masqué sur mobile, seulement les couleurs */}
                  <span className="hidden sm:inline">{key}</span>
                </div>
              ))}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: PRICE_COLORS.default }} />
              <span className="hidden sm:inline">N/A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden p-1 sm:p-2"
        onMouseMove={handleMouseMove}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 420, center: [20, 0] }}
          width={800}
          height={600}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={setPosition}
            minZoom={1}
            maxZoom={10}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoName = geo.properties.name;
                  const mappedName = COUNTRY_NAME_MAP[geoName];
                  const countryData = mappedName ? COUNTRIES_DATA[mappedName] : null;
                  const isSelected = selectedCountry?.id === countryData?.id;
                  const displayName = mappedName || geoName;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(countryData, geo)}
                      onMouseEnter={() => handleMouseEnter(displayName)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: getCountryColor(countryData),
                          stroke: isSelected ? '#FFFFFF' : '#30363D',
                          strokeWidth: isSelected ? 2 / position.zoom : 0.5 / position.zoom,
                          outline: 'none',
                          transition: 'fill 0.2s',
                        },
                        hover: {
                          fill: '#58A6FF',
                          outline: 'none',
                          cursor: countryData ? 'pointer' : 'default',
                        },
                        pressed: { fill: '#3FB950', outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

    </div>
  );
}