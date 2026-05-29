# MaizePredict AI - Maize Price Forecasting Dashboard

An interactive dashboard for predicting maize prices across African countries using machine learning. Built with React, Recharts, and react-simple-maps.

## Features

- **Interactive Africa Map**: Click on any African country to view predictions
- **Zoom Animation**: Map smoothly zooms to the selected country
- **Price Predictions**: LSTM-based predictions using the FastAPI backend
- **Full-Height Interface**: Optimized for desktop viewing with h-100vh layout
- **Dark Mode**: Professional dark theme with color-coded country data
- **Real-time Charts**: Visualize historical and forecasted prices with Recharts

## Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- FastAPI backend running (see Backend Setup below)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure the API endpoint (optional):

Create a `.env` file in the project root:

```
REACT_APP_API_URL=http://localhost:8000
```

### Running the App

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Backend Setup

The app integrates with a FastAPI backend that provides LSTM-based price predictions.

### FastAPI Requirements

The backend should expose these endpoints:

- `GET /countries` - List available countries
- `POST /predict` - Get price prediction for a country and year

Request format:
```json
{
  "country": "Nigeria",
  "year": 2025
}
```

Response format:
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

### Running the Backend

From the parent directory, start the FastAPI server:

```bash
python -m uvicorn api:app --host 127.0.0.1 --port 8000
```

## Supported Countries

Currently supports predictions for:
- Nigeria
- Cameroon
- Kenya
- Ghana
- Ethiopia
- Tanzania

## Architecture

- **Frontend**: React 18 with Tailwind CSS
- **Maps**: react-simple-maps with GeoJSON
- **Charts**: Recharts for data visualization
- **Styling**: Tailwind CSS with custom design tokens
- **API**: Axios for backend communication

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Demo Mode

If the FastAPI backend is not available, the app falls back to demo mode with simulated predictions. This allows you to test the UI without the backend running.

## Technologies

- React 18
- Tailwind CSS
- Recharts
- react-simple-maps
- FastAPI (backend)
