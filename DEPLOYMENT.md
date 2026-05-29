Deployment Guide - MaizePredict AI Dashboard
==============================================

## What's Been Done

Your maize price prediction dashboard has been completely refactored with the following improvements:

✅ API Integration - Consumes your FastAPI /predict endpoint
✅ Cleaned Interface - Profile & unused navigation removed
✅ Full Height Layout - Optimized h-100vh design
✅ Zoom Animation - Smooth country selection with map zoom
✅ Demo Fallback - Works without backend for testing
✅ Complete Documentation - 4 comprehensive guides provided

## Current Status

Branch: `maize-price-forecast-api`
Latest Commit: `feat: add new architecture doc and refactor dashboard layout`

All changes are committed and ready for preview deployment.

## Next Steps

### Option 1: Preview Deployment (Recommended)

1. **Open a Pull Request**
   - Go to: https://github.com/Manos2605/maize_africa
   - Click "Pull requests" → "New pull request"
   - Compare: `main` ← `maize-price-forecast-api`
   - Title: "feat: integrate FastAPI prediction model with interactive dashboard"
   - Description: (Use the IMPLEMENTATION_SUMMARY.md content)

2. **Vercel Preview Deployment**
   - A preview link will auto-generate when you create the PR
   - Click the preview link to test the dashboard
   - The v0 Preview will automatically start the dev server

3. **Test the Dashboard**
   - Click on African countries to see the zoom animation
   - Select a country and enter a year
   - Click "Prédire" to see predictions (demo mode works without backend)
   - Verify the chart displays correctly

### Option 2: Local Testing Before PR

If you want to test locally first:

```bash
# Install dependencies
cd carte-afrique
npm install

# Start the FastAPI backend (in another terminal)
python -m uvicorn api:app --host 127.0.0.1 --port 8000

# Start the React frontend
npm start  # Opens http://localhost:3000
```

## Files Modified

### Components
- `src/pages/DashboardPage.js` - Refactored main page with zoom logic
- `src/components/InteractiveAfricaMap.js` - Enhanced with zoom props
- `src/components/PredictionPanel.js` - NEW: API integration & predictions
- Removed: `NavBar.js`, `CountryDetailsPanel.js`

### Configuration
- `public/index.html` - Updated viewport & meta tags
- `README.md` - Complete setup guide
- `.env.example` - API URL configuration template

### Documentation
- `QUICKSTART.md` - 30-second setup guide
- `ARCHITECTURE.md` - System design & data flow
- `IMPLEMENTATION_SUMMARY.md` - Detailed technical specs
- `CHANGES.md` - Complete change log
- `DEPLOYMENT.md` - This file

## API Integration Details

### Endpoint Expected
```
POST /predict
Content-Type: application/json

{
  "country": "Nigeria",
  "year": 2025
}

Response:
{
  "country": "Nigeria",
  "last_known_year": 2023,
  "forecast": [
    {"year": 2024, "predicted_price": 320.50},
    {"year": 2025, "predicted_price": 335.75}
  ]
}
```

### Configuration
Set the API URL via environment variable:
```
REACT_APP_API_URL=https://your-api-domain.com
```

Or defaults to `http://localhost:8000`

## Demo Mode

The dashboard includes an intelligent fallback:
- ✅ If backend is available → Real LSTM predictions
- ✅ If backend is unavailable → Realistic demo predictions
- ✅ If API errors → Automatic fallback to demo mode

This allows full testing of the UI without the backend running.

## Supported Countries

- Nigeria 🇳🇬
- Cameroon 🇨🇲
- Kenya 🇰🇪
- Ghana 🇬🇭
- Ethiopia 🇪🇹
- Tanzania 🇹🇿

Additional countries can be added by updating `mockData.js`.

## Performance Notes

- Map renders with GeoJSON from CDN
- Charts use Recharts for efficient rendering
- Full-height layout prevents scrolling issues
- Smooth 500ms zoom transitions

## Troubleshooting

### Maps not loading?
- Check internet connection (GeoJSON loads from CDN)
- Verify `react-simple-maps` is installed

### API not connecting?
- Verify backend is running on port 8000
- Check CORS headers in backend
- Check `REACT_APP_API_URL` environment variable

### Demo mode not showing?
- Check browser console for errors
- Verify country data is loaded (check mockData.js)

## Production Deployment

Once tested and merged to main:

```bash
# Build production bundle
npm run build

# Deploy to Vercel
# The build folder will be deployed automatically
```

## Questions?

Refer to:
- `README.md` - Setup & features
- `QUICKSTART.md` - Quick reference
- `IMPLEMENTATION_SUMMARY.md` - Technical deep dive
- `ARCHITECTURE.md` - System design
