# Quick Start Guide - MaizePredict AI

## 30-Second Setup

### Step 1: Install Dependencies
```bash
cd carte-afrique
npm install
```

### Step 2: Start Backend (Optional)
```bash
# From project root, in another terminal
python -m uvicorn api:app --host 127.0.0.1 --port 8000
```

### Step 3: Start Frontend
```bash
npm start
# Opens http://localhost:3000 automatically
```

## ✨ You're Done!

The dashboard is now running with:
- ✅ Interactive map of Africa
- ✅ Automatic zoom on country click
- ✅ Price prediction form
- ✅ Chart visualization
- ✅ Demo mode if backend unavailable

---

## Usage

### Click to Explore
1. **Click any country** on the map → Map zooms to that country
2. **Enter a year** (e.g., 2025) in the right panel
3. **Click "Prédire"** button → Get price prediction
4. **View chart** with forecasted prices
5. **Close** by clicking the X button

### Supported Countries
- Nigeria 🇳🇬
- Cameroon 🇨🇲
- Kenya 🇰🇪
- Ghana 🇬🇭
- Ethiopia 🇪🇹
- Tanzania 🇹🇿

---

## Configuration

### API Backend URL (Optional)

Create `.env` in `carte-afrique/`:
```env
REACT_APP_API_URL=http://localhost:8000
```

Default is already `http://localhost:8000`

### Run with Custom API URL
```bash
# Set environment variable before npm start
export REACT_APP_API_URL=http://my-api.com:8000
npm start
```

---

## Demo Mode

**No backend available?** No problem!

The app automatically generates realistic predictions when the API is unavailable. Perfect for:
- ✅ Testing the UI
- ✅ Demoing without backend
- ✅ Development

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm start` | Start dev server (http://localhost:3000) |
| `npm build` | Build for production |
| `npm test` | Run tests |
| `npm eject` | Advanced: eject from Create React App |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate form inputs |
| `Enter` | Submit prediction |
| `Esc` | Close prediction panel |

---

## Troubleshooting

### "Port 3000 already in use"
```bash
# Kill the process on port 3000
# Or use different port:
PORT=3001 npm start
```

### "API connection error"
- ✅ Ensure backend is running on `http://localhost:8000`
- ✅ Check `.env` file `REACT_APP_API_URL`
- ✅ App will use demo mode if API unavailable

### "Map not zooming"
- ✅ Try clicking a different country
- ✅ Refresh the page (F5)
- ✅ Check browser console for errors

### "Dependencies not installed"
```bash
cd carte-afrique
npm install
npm start
```

---

## Next Steps

1. ✅ Backend running? Skip ahead
2. ❌ Backend not running? 
   - App works in demo mode
   - To use real predictions, start backend first
3. Open http://localhost:3000
4. Click a country
5. Enter year and predict!

---

## Project Structure
```
carte-afrique/
├── src/
│   ├── pages/DashboardPage.js       ← Main component
│   ├── components/
│   │   ├── InteractiveAfricaMap.js  ← Map
│   │   └── PredictionPanel.js       ← Predictions
│   └── data/mockData.js             ← Demo data
├── public/
│   └── index.html                   ← HTML entry
├── package.json
├── tailwind.config.js               ← Styling
└── README.md                         ← Full docs
```

---

## API Expected Format

If using custom backend, ensure `/predict` endpoint returns:

```json
{
  "country": "Nigeria",
  "last_known_year": 2023,
  "forecast": [
    {"year": 2024, "predicted_price": 320.50},
    {"year": 2025, "predicted_price": 335.75}
  ]
}
```

---

## Features

### 🗺️ Map
- Interactive GeoJSON map
- Click to zoom
- Color-coded by price
- Smooth animations

### 📊 Predictions
- LSTM-based forecasts
- Custom year selection
- Interactive charts
- Real-time results

### 🎨 UI
- Dark mode (default)
- Full-height layout
- Responsive design
- Clean interface

### ⚡ Performance
- Fast loading
- Smooth animations
- Efficient rendering
- Demo fallback

---

## Browser Support
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Need Help?

1. **Check README.md** for full documentation
2. **Check ARCHITECTURE.md** for system design
3. **Check console errors** (F12 → Console tab)
4. **Check .env file** configuration

---

## Production Deployment

To deploy to Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variable `REACT_APP_API_URL`
4. Deploy!

```bash
npm run build  # Creates optimized build
```

---

**Happy predicting! 🌽🚀**
