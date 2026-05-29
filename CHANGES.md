# Refactorisation - MaizePredict AI Dashboard

## Overview
L'application a été refactorisée pour intégrer directement l'API FastAPI avec une interface simplifiée et optimisée en pleine hauteur (h-100vh).

## Changes Principales

### 1. **Interface Simplifiée - Suppression du Profil**
   - ✅ Suppression du composant `NavBar.js` avec tous les éléments inutiles
   - ✅ Suppression du composant `CountryDetailsPanel.js` remplacé par `PredictionPanel.js`
   - ✅ Header minimaliste avec uniquement le logo et le toggle dark mode

### 2. **Layout Full Height (h-100vh)**
   - ✅ Dashboard occupe tout l'écran sans scrollbar horizontale
   - ✅ Carte interactive à gauche prenant 70% de l'espace
   - ✅ Panel de prédiction à droite prenant 30% de l'espace
   - ✅ Scrolling vertical seulement pour le panel de prédiction

### 3. **Intégration API FastAPI**
   - ✅ Nouveau composant `PredictionPanel.js` qui consomme l'API
   - ✅ Endpoints utilisés:
     - `POST /predict` - Prédictions pour un pays et une année
     - `GET /countries` - Récupération des pays (utilisable ultérieurement)
   - ✅ Mode démonstration avec fallback en cas d'API indisponible

### 4. **Zoom sur le Pays**
   - ✅ Au clic sur un pays, la carte zoome automatiquement (smooth animation 500ms)
   - ✅ Coordonnées de zoom configurables pour chaque pays
   - ✅ Retour à la vue initiale quand on ferme la sélection

### 5. **Nouveau Composant: PredictionPanel**
   - 📍 Affiche le pays sélectionné avec son flag
   - 📊 Input pour choisir l'année de prédiction
   - 🎯 Bouton "Prédire" pour déclencher l'API
   - 📈 Graphique Recharts avec courbe de prédiction
   - ⚠️ Gestion des erreurs API avec fallback mode démo
   - ℹ️ Informations sur le pays (devise, production)

## Structure Fichiers

### Supprimés
- `src/components/NavBar.js` - Navigation avec profil utilisateur
- `src/components/CountryDetailsPanel.js` - Ancien panel détails

### Modifiés
- `src/pages/DashboardPage.js` - Refactorisation complète pour layout full-height
- `src/components/InteractiveAfricaMap.js` - Réduction, ajout props mapScale/mapCenter
- `public/index.html` - Meta tags et styling full-height
- `README.md` - Documentation mise à jour

### Nouveaux
- `src/components/PredictionPanel.js` - Panel de prédiction avec API integration
- `.env.example` - Template pour variables d'environnement
- `CHANGES.md` - Ce fichier

## Configuration API

### Variables d'Environnement
```env
REACT_APP_API_URL=http://localhost:8000
```

### Endpoints Requis (FastAPI)
```
POST /predict
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

## Fonctionnalités Conservées
- ✅ Carte interactive GeoJSON
- ✅ Coloration des pays selon le prix
- ✅ Dark mode
- ✅ Recharts pour les visualisations
- ✅ Tailwind CSS + design tokens existants

## Fonctionnalités Supprimées
- ❌ Navigation multi-onglets (Dashboard, Historique, Rapports, Insights)
- ❌ Profil utilisateur + menu déroulant
- ❌ Panel détails avec facteurs influents
- ❌ Données mockées statiques

## Mode Démonstration
Si le backend FastAPI n'est pas disponible:
- L'application génère des prédictions aléatoires réalistes
- L'UX reste complètement fonctionnelle
- Parfait pour les tests sans backend

## Prochaines Étapes
1. Configurer `REACT_APP_API_URL` avec l'URL du backend
2. Lancer le FastAPI backend: `python -m uvicorn api:app --port 8000`
3. Lancer l'app React: `npm start`
4. Cliquer sur un pays → zooms automatiquement
5. Choisir une année et cliquer "Prédire" pour voir les prédictions
