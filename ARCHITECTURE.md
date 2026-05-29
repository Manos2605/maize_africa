# Architecture - MaizePredict AI Dashboard

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Header (h-16)                         │
│         Logo + Dark Mode Toggle (Simplified)              │
├──────────────────────────────────────┬──────────────────┤
│                                      │                  │
│     InteractiveAfricaMap             │ PredictionPanel  │
│     (70% width)                      │ (30% width)      │
│                                      │                  │
│     - GeoJSON Map                    │ - Country Info   │
│     - Clickable Countries            │ - Year Input     │
│     - Zoom Animation                 │ - Predict Button │
│     - Color Coding by Price          │ - Chart          │
│                                      │ - Results        │
│                                      │ (scrollable)     │
│                                      │                  │
└──────────────────────────────────────┴──────────────────┘
```

## Component Tree

```
App.js
└── DashboardPage.js (Page principale)
    ├── Header (inline)
    ├── InteractiveAfricaMap.js
    │   └── react-simple-maps
    │       ├── ComposableMap
    │       └── Geographies
    │
    └── PredictionPanel.js
        ├── Country Display
        ├── Year Input
        ├── Predict Button
        ├── LineChart (Recharts)
        └── Results Display
```

## Data Flow

```
DashboardPage
  ├── state: selectedCountry
  │   └── onChange → zoom map to country
  │
  ├── InteractiveAfricaMap
  │   ├── reads: selectedCountry
  │   ├── reads: mapScale, mapCenter (for zoom)
  │   └── emits: onSelectCountry(country)
  │
  └── PredictionPanel
      ├── reads: selectedCountry
      ├── state: predictionYear
      ├── state: loading, error, prediction
      │
      └── API Call Flow
          ├── User selects country
          ├── User enters year
          ├── Click "Prédire"
          ├── POST /predict (FastAPI)
          ├── Display results or fallback to demo
          └── Render chart with Recharts
```

## File Structure

```
carte-afrique/
├── public/
│   ├── index.html (updated: full-height setup)
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── App.js (simple entry)
│   ├── index.js (React DOM render)
│   ├── index.css (global styles + tailwind)
│   ├── App.css (unused, can be deleted)
│   │
│   ├── pages/
│   │   └── DashboardPage.js ⭐ Main component
│   │       ├── Layout management
│   │       ├── Zoom coordinates
│   │       └── State management
│   │
│   ├── components/
│   │   ├── InteractiveAfricaMap.js ⭐ Map component
│   │   │   └── GeoJSON + react-simple-maps
│   │   │
│   │   └── PredictionPanel.js ⭐ Prediction component
│   │       ├── API integration
│   │       ├── Form handling
│   │       └── Recharts visualization
│   │
│   └── data/
│       └── mockData.js
│           ├── COUNTRIES_DATA (demo data)
│           ├── COUNTRY_NAME_MAP (GeoJSON → local names)
│           └── PRICE_COLORS (color scheme)
│
├── .env.example (configuration template)
├── tailwind.config.js (design tokens)
├── package.json
└── README.md (setup instructions)
```

## Styling System

### Design Tokens (tailwind.config.js)
```javascript
colors:
  bg:
    primary: '#0D1117'    // Main background
    secondary: '#161B22'  // Card backgrounds
    tertiary: '#1C2128'   // Element backgrounds
    hover: '#21262D'      // Hover states

  accent:
    green: '#3FB950'      // Positive/predictions
    orange: '#F0883E'     // Secondary
    blue: '#58A6FF'       // Primary
    red: '#F85149'        // Negative/errors

  text:
    primary: '#E6EDF3'    // Main text
    secondary: '#7D8590'  // Secondary text
```

### Tailwind Classes
- Layout: `flex`, `grid`, `gap-*`
- Spacing: `p-*`, `m-*`, `px-*`, `py-*`
- Sizing: `h-screen`, `w-full`, `h-full`
- Borders: `border`, `rounded`, `border-border`
- Typography: `font-sans`, `text-*`, `font-semibold`

## Zoom Coordinates

Countries are configured in DashboardPage.js:

```javascript
COUNTRY_COORDS = {
  Nigeria: { center: [8, 10], scale: 1200 },
  Kenya: { center: [35, 0], scale: 1500 },
  // ... other countries
}
```

When a country is selected:
1. `selectedCountry` state updates
2. `useEffect` detects change
3. `mapCenter` and `mapScale` state updates
4. ComposableMap re-renders with new coordinates
5. Animation happens over 500ms (CSS transition)

## API Integration

### PredictionPanel Integration

```javascript
const handlePredict = async () => {
  // 1. Send POST request
  POST ${API_URL}/predict
  body: { country: string, year: number }
  
  // 2. Handle response
  if (error) {
    // Show error or fallback to demo
  } else {
    // Display forecast data
    setPrediction(data)
  }
}
```

### Demo Mode Fallback

If API unavailable:
```javascript
generateDemoPrediction() {
  // Generate realistic but simulated predictions
  // Uses random variation ±2% per year
}
```

## Key Features Implementation

### 1. Full Height Layout
- `h-screen` on root div
- `flex flex-col` for vertical layout
- `flex-1` for flexible grow regions
- `overflow-hidden/auto` for scrolling control

### 2. Zoom Animation
- `transition-all duration-500` on ComposableMap
- Smooth coordinate transition in ComposableMap
- State-driven (mapScale, mapCenter)

### 3. API Consumption
- Configurable via `REACT_APP_API_URL` env var
- Handles CORS with fallback
- Error handling + demo mode

### 4. Responsive Design
- 2-column layout (70/30 split)
- Fixed width panel (w-96)
- Scrollable prediction panel only
- Full-height map

## Performance Considerations

1. **Code Splitting**: Single page app, no route-based splitting needed
2. **API Caching**: Implement if repeated requests to same country
3. **Large Maps**: GeoJSON loaded once via URL
4. **Chart Rendering**: Recharts optimized for small datasets
5. **Component Re-renders**: Use React.memo if needed

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript
- CSS Grid + Flexbox support required
- No IE11 support

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000
# Defaults to http://localhost:8000 if not set
```

## Security Notes

- No sensitive data stored in frontend
- API calls use POST with JSON body
- CORS handled by backend
- No authentication currently (add if needed)

## Future Enhancements

1. Add authentication (user profiles, saved predictions)
2. Historical data comparison
3. Multiple year predictions at once
4. Export predictions (CSV, PDF)
5. Advanced filtering and analysis
6. Mobile responsive layout
7. Offline support (PWA)
8. Real-time data updates (WebSocket)
