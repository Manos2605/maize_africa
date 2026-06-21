// src/data/mockData.js
// Données fixes + chargement dynamique des 33 pays depuis l'API

/* const API_BASE = 'http://127.0.0.1:8000';*/
const API_BASE = 'https://iageneratif-model-sonwa.hf.space';

// Template par défaut pour les pays sans données spécifiques
const getDefaultCountryData = (countryName, countryCode) => ({
  id: countryCode,
  name: countryName,
  flag: '🌍',
  currency: 't/ha',
  unit: 't/ha',
  city: 'N/A',
  priceLevel: 'medium',
  prixActuel: 0,
  variation: 0,
  tendance: 'stable',
  production: 'N/A',
  importations: 'N/A',
  historique: {
    labels: [],
    reel: [],
    prevision: [],
  },
  facteurs: [],
  sparkline: [],
});

// Données enrichies pour les pays avec mockData détaillées
const COUNTRIES_DATA_DETAILED = {};

// Correspondance nom pays (carte/geojson) → nom de l'API
// Sera enrichie automatiquement lors du chargement
export let COUNTRY_NAME_MAP = {
  // Noms de base (directe match)
  'Algeria': 'Algeria',
  'Angola': 'Angola',
  'Benin': 'Benin',
  'Botswana': 'Botswana',
  'Burkina Faso': 'Burkina Faso',
  'Burundi': 'Burundi',
  'Cameroon': 'Cameroon',
  'Cape Verde': 'Cape Verde',
  'Central African Republic': 'Central African Republic',
  'Chad': 'Chad',
  'Comoros': 'Comoros',
  'Congo': 'Congo',
  'Democratic Republic of the Congo': 'Congo',
  'Djibouti': 'Djibouti',
  'Egypt': 'Egypt',
  'Equatorial Guinea': 'Equatorial Guinea',
  'Eritrea': 'Eritrea',
  'Ethiopia': 'Ethiopia',
  'Gabon': 'Gabon',
  'Gambia': 'Gambia',
  'Ghana': 'Ghana',
  'Guinea': 'Guinea',
  'Guinea-Bissau': 'Guinea-Bissau',
  'Ivory Coast': 'Ivory Coast',
  'Côte d\'Ivoire': 'Ivory Coast',
  'Kenya': 'Kenya',
  'Lesotho': 'Lesotho',
  'Liberia': 'Liberia',
  'Libya': 'Libya',
  'Madagascar': 'Madagascar',
  'Malawi': 'Malawi',
  'Mali': 'Mali',
  'Mauritania': 'Mauritania',
  'Mauritius': 'Mauritius',
  'Morocco': 'Morocco',
  'Mozambique': 'Mozambique',
  'Namibia': 'Namibia',
  'Niger': 'Niger',
  'Nigeria': 'Nigeria',
  'Rwanda': 'Rwanda',
  'Sao Tome and Principe': 'Sao Tome and Principe',
  'Senegal': 'Senegal',
  'Seychelles': 'Seychelles',
  'Sierra Leone': 'Sierra Leone',
  'Somalia': 'Somalia',
  'South Africa': 'South Africa',
  'South Sudan': 'South Sudan',
  'Sudan': 'Sudan',
  'Swaziland': 'Eswatini',
  'Eswatini': 'Eswatini',
  'Tanzania': 'Tanzania',
  'United Republic of Tanzania': 'Tanzania',
  'Togo': 'Togo',
  'Tunisia': 'Tunisia',
  'Uganda': 'Uganda',
  'Zambia': 'Zambia',
  'Zimbabwe': 'Zimbabwe',
  'Western Sahara': 'Western Sahara',
};

// Couleurs de la légende carte
export const PRICE_LEGEND = [
  { label: '> 400',    color: '#F85149', level: 'vhigh'  },
  { label: '350 – 400',color: '#F0883E', level: 'high'   },
  { label: '300 – 350',color: '#58A6FF', level: 'medium' },
  { label: '250 – 300',color: '#3FB950', level: 'low'    },
  { label: '< 250',    color: '#6E7681', level: 'vlow'   },
];

// Couleur par niveau de prix (pour colorier les pays sur la carte)
export const PRICE_COLORS = {
  vhigh:   '#F85149',
  high:    '#F0883E',
  medium:  '#58A6FF',
  low:     '#3FB950',
  vlow:    '#6E7681',
  default: '#21262D',   // pays sans données
};


// Fonction pour trouver le nom correct du pays dans les données chargées
export const getCountryFromGeoName = (geoName, countriesData, countryNameMap) => {
  // Chercher d'abord dans la map (priorité haute)
  const mappedName = countryNameMap[geoName];
  if (mappedName && countriesData[mappedName]) {
    return countriesData[mappedName];
  }
  
  // Exact match en minuscules
  const geoLower = geoName.toLowerCase();
  for (const [countryName, countryData] of Object.entries(countriesData)) {
    if (countryName.toLowerCase() === geoLower) {
      return countryData;
    }
  }
  
  // Match partiel par mots-clés
  const geoWords = geoLower.split(' ').filter(w => w.length > 2);
  for (const [countryName, countryData] of Object.entries(countriesData)) {
    const countryLower = countryName.toLowerCase();
    const countryWords = countryLower.split(' ');
    if (geoWords.some(word => countryWords.some(cw => cw === word))) {
      return countryData;
    }
  }
  
  // Match partiel (le geojson contient le nom du pays)
  for (const [countryName, countryData] of Object.entries(countriesData)) {
    if (geoLower.includes(countryName.toLowerCase()) || countryName.toLowerCase().includes(geoLower)) {
      return countryData;
    }
  }
  
  // Fallback : chercher le premier pays qui contient des mots similaires (Levenshtein-like)
  const getWords = (str) => str.toLowerCase().split(/[\s\-,;]+/).filter(w => w.length > 2);
  const geoCountryWords = getWords(geoName);
  
  for (const [countryName, countryData] of Object.entries(countriesData)) {
    const countryWords = getWords(countryName);
    // Comparer les premiers caractères et les longueurs
    const hasCommonStart = geoCountryWords.some(gw => 
      countryWords.some(cw => cw.substring(0, 3) === gw.substring(0, 3))
    );
    if (hasCommonStart) {
      return countryData;
    }
  }
  
  return null;
};
export let COUNTRIES_DATA = { ...COUNTRIES_DATA_DETAILED };
export let AVAILABLE_COUNTRIES = []; // Liste des pays disponibles depuis l'API

export const loadAllCountries = async () => {
  try {
    const res = await fetch(`${API_BASE}/countries`);
    const json = await res.json();
    const countries = json.countries || [];

    COUNTRIES_DATA = { ...COUNTRIES_DATA_DETAILED };
    AVAILABLE_COUNTRIES = countries;

    countries.forEach((countryName) => {
      if (!COUNTRIES_DATA[countryName]) {
        const code = countryName.toUpperCase().substring(0, 3);
        COUNTRIES_DATA[countryName] = getDefaultCountryData(countryName, code);
      }
      if (!COUNTRY_NAME_MAP[countryName]) {
        COUNTRY_NAME_MAP[countryName] = countryName;
      }
    });

    // 1. Charger tous les prix en parallèle
    const pricesResults = await Promise.allSettled(
      countries.map(async (countryName) => {
        const r = await fetch(`${API_BASE}/rendement/${encodeURIComponent(countryName)}`);
        const data = await r.json();
        const rendement = data.rendement || [];
        const prices = [...rendement].sort((a, b) => a.year - b.year);
        const lastEntry = prices[prices.length - 1];
        const prevEntry = prices[prices.length - 2];
        const prixActuel = lastEntry?.rendement ?? null;
        const variation = (prixActuel && prevEntry?.rendement)
          ? ((prixActuel - prevEntry.rendement) / prevEntry.rendement * 100)
          : 0;
        return { countryName, prixActuel, variation };
      })
    );

    // 2. Collecter tous les prix valides
    const validPrices = pricesResults
      .filter(r => r.status === 'fulfilled' && r.value.prixActuel !== null)
      .map(r => r.value);

    // 3. Calculer les seuils par quintiles sur les prix réels
    const sorted = [...validPrices].sort((a, b) => a.prixActuel - b.prixActuel);
    const n = sorted.length;
    const q = (ratio) => sorted[Math.floor(ratio * (n - 1))]?.prixActuel ?? 0;

    const thresholds = {
      q20: q(0.20),  
      q40: q(0.40),  
      q60: q(0.60),  
      q80: q(0.80),  
    };

    console.log('Seuils de prix calculés :', thresholds);

    // 4. Assigner priceLevel selon les seuils réels
    const getPriceLevel = (price) => {
      if (!price || price <= 0) return 'default';
      if (price > thresholds.q80) return 'vhigh';
      if (price > thresholds.q60) return 'high';
      if (price > thresholds.q40) return 'medium';
      if (price > thresholds.q20) return 'low';
      return 'vlow';
    };

    // 5. Mettre à jour COUNTRIES_DATA avec prix + niveau calculé
    validPrices.forEach(({ countryName, prixActuel, variation }) => {
      if (COUNTRIES_DATA[countryName]) {
        COUNTRIES_DATA[countryName] = {
          ...COUNTRIES_DATA[countryName],
          prixActuel,
          variation,
          priceLevel: getPriceLevel(prixActuel),
        };
      }
    });

    // 6. Mettre à jour la légende avec les vrais seuils
    PRICE_LEGEND[0].label = `> ${Math.round(thresholds.q80)}`;
    PRICE_LEGEND[1].label = `${Math.round(thresholds.q60)} – ${Math.round(thresholds.q80)}`;
    PRICE_LEGEND[2].label = `${Math.round(thresholds.q40)} – ${Math.round(thresholds.q60)}`;
    PRICE_LEGEND[3].label = `${Math.round(thresholds.q20)} – ${Math.round(thresholds.q40)}`;
    PRICE_LEGEND[4].label = `< ${Math.round(thresholds.q20)}`;

    console.log(`✓ ${countries.length} pays chargés avec seuils dynamiques`);
    return COUNTRIES_DATA;

  } catch (error) {
    console.error('Erreur chargement pays:', error);
    return COUNTRIES_DATA_DETAILED;
  }
};
