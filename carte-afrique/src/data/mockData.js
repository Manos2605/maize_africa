// src/data/mockData.js
// Données fixes + chargement dynamique des 33 pays depuis l'API

const API_BASE = 'http://127.0.0.1:8000';

// Template par défaut pour les pays sans données spécifiques
const getDefaultCountryData = (countryName, countryCode) => ({
  id: countryCode,
  name: countryName,
  flag: '🌍',
  currency: 'USD',
  unit: 'USD/t',
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
const COUNTRIES_DATA_DETAILED = {
  Nigeria: {
    id: 'NGA',
    name: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    unit: 'NGN/kg',
    city: 'Abuja',
    priceLevel: 'medium',       // pour la couleur sur la carte
    prixActuel: 320,
    variation: +2.5,
    tendance: 'hausse',         // 'hausse' | 'baisse' | 'stable'
    production: '8.5M t',
    importations: '1.2M t',

    // Graphique 1 — Historique 12 mois (7 passés + 5 prévisions)
    historique: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.','Jan.','Fév.','Mar.','Avr.','Mai','Juin'],
      reel:     [210, 225, 235, 248, 255, 265, 272, 280, 290, 298, 308, 320],
      prevision:[null,null,null,null,null,null,null,null, 295, 310, 325, 340],
    },

    // Graphique 2 — Prévision 6 prochains mois
    prevision6mois: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      valeurs: [330, 340, 350, 360, 380, 400],
    },

    // Facteurs influents
    facteurs: [
      {
        icon: '☀️',
        titre: 'Sécheresse régionale',
        description: 'Les faibles précipitations dans le nord du pays réduisent les rendements du maïs.',
      },
      {
        icon: '🛢️',
        titre: 'Prix du pétrole',
        description: "La hausse du prix du pétrole augmente les coûts de transport et de production.",
      },
      {
        icon: '💱',
        titre: 'Taux de change USD/NGN',
        description: "La dépréciation du NGN face au USD impacte les coûts d'importation des intrants.",
      },
    ],

    // Sparkline (mini graphique dans la carte prix actuel)
    sparkline: [290, 295, 300, 305, 308, 310, 312, 315, 318, 320],
  },

  Cameroon: {
    id: 'CMR',
    name: 'Cameroon',
    flag: '🇨🇲',
    currency: 'XAF',
    unit: 'FCFA/kg',
    city: 'Yaoundé',
    priceLevel: 'low',
    prixActuel: 185,
    variation: +1.1,
    tendance: 'hausse',
    production: '1.2M t',
    importations: '0.1M t',

    historique: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.','Jan.','Fév.','Mar.','Avr.','Mai','Juin'],
      reel:     [165, 168, 170, 172, 174, 176, 178, 179, 181, 182, 183, 185],
      prevision:[null,null,null,null,null,null,null,null, 183, 186, 190, 195],
    },

    prevision6mois: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      valeurs: [186, 188, 190, 192, 194, 196],
    },

    facteurs: [
      {
        icon: '☀️',
        titre: 'Sécheresse Extrême-Nord',
        description: 'La région Extrême-Nord subit un déficit pluviométrique qui affecte la production.',
      },
      {
        icon: '🏪',
        titre: 'Marchés locaux tendus',
        description: 'La demande en maïs dépasse l\'offre sur les marchés de Yaoundé et Douala.',
      },
      {
        icon: '💰',
        titre: 'Inflation CEMAC',
        description: 'La légère inflation dans la zone CEMAC pèse sur le pouvoir d\'achat des ménages.',
      },
    ],

    sparkline: [178, 179, 180, 181, 182, 182, 183, 183, 184, 185],
  },

  Kenya: {
    id: 'KEN',
    name: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    unit: 'KES/kg',
    city: 'Nairobi',
    priceLevel: 'low',
    prixActuel: 55,
    variation: +3.2,
    tendance: 'hausse',
    production: '3.1M t',
    importations: '0.8M t',

    historique: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.','Jan.','Fév.','Mar.','Avr.','Mai','Juin'],
      reel:     [40, 42, 44, 46, 48, 49, 50, 51, 52, 53, 54, 55],
      prevision:[null,null,null,null,null,null,null,null, 53, 56, 60, 64],
    },

    prevision6mois: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      valeurs: [57, 59, 61, 63, 65, 67],
    },

    facteurs: [
      {
        icon: '🌵',
        titre: 'Sécheresse Corne de l\'Afrique',
        description: 'La sécheresse persistante dans la Corne de l\'Afrique réduit fortement les récoltes.',
      },
      {
        icon: '🚛',
        titre: 'Hausse coûts transport',
        description: 'La flambée des prix du carburant augmente les coûts logistiques.',
      },
      {
        icon: '📈',
        titre: 'Inflation alimentaire',
        description: 'L\'inflation alimentaire au Kenya dépasse 6%, tirant les prix vers le haut.',
      },
    ],

    sparkline: [50, 51, 51, 52, 52, 53, 53, 54, 54, 55],
  },

  Ghana: {
    id: 'GHA',
    name: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    unit: 'GHS/kg',
    city: 'Accra',
    priceLevel: 'vlow',
    prixActuel: 9,
    variation: -1.2,
    tendance: 'baisse',
    production: '2.1M t',
    importations: '0.3M t',

    historique: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.','Jan.','Fév.','Mar.','Avr.','Mai','Juin'],
      reel:     [10.5, 10.3, 10.1, 10.0, 9.8, 9.7, 9.6, 9.5, 9.4, 9.3, 9.1, 9.0],
      prevision:[null,null,null,null,null,null,null,null, 9.2, 9.0, 8.8, 8.6],
    },

    prevision6mois: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      valeurs: [8.8, 8.7, 8.6, 8.5, 8.5, 8.4],
    },

    facteurs: [
      {
        icon: '🌧️',
        titre: 'Pluviométrie satisfaisante',
        description: 'Les pluies abondantes cette saison favorisent de bonnes récoltes.',
      },
      {
        icon: '💹',
        titre: 'Cedi GHS stabilisé',
        description: 'La stabilisation du Cedi réduit la pression sur les coûts d\'importation.',
      },
      {
        icon: '📉',
        titre: 'Baisse demande régionale',
        description: 'La demande régionale en maïs ghanaen est en léger recul.',
      },
    ],

    sparkline: [9.5, 9.4, 9.3, 9.3, 9.2, 9.2, 9.1, 9.1, 9.0, 9.0],
  },

  Ethiopia: {
    id: 'ETH',  
    name: 'Ethiopia',
    flag: '🇪🇹',
    currency: 'ETB',
    unit: 'ETB/kg',
    city: 'Addis-Abeba',
    priceLevel: 'vlow',
    prixActuel: 48,
    variation: +1.8,
    tendance: 'hausse',
    production: '9.2M t',
    importations: '0.4M t',

    historique: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.','Jan.','Fév.','Mar.','Avr.','Mai','Juin'],
      reel:     [40, 41, 42, 43, 44, 44, 45, 45, 46, 46, 47, 48],
      prevision:[null,null,null,null,null,null,null,null, 47, 49, 51, 53],
    },

    prevision6mois: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      valeurs: [49, 50, 51, 52, 53, 54],
    },

    facteurs: [
      {
        icon: '🌦️',
        titre: 'Pluies El Niño',
        description: 'Les précipitations liées à El Niño sont abondantes cette année.',
      },
      {
        icon: '🌾',
        titre: 'Saison agricole favorable',
        description: 'La saison principale Meher s\'annonce productive pour le maïs.',
      },
      {
        icon: '💸',
        titre: 'Dévaluation ETB',
        description: 'La récente dévaluation du Birr éthiopien renchérit les intrants importés.',
      },
    ],

    sparkline: [45, 45, 46, 46, 46, 47, 47, 47, 48, 48],
  },

  Tanzania: {
    id: 'TZA',
    name: 'Tanzania',
    flag: '🇹🇿',
    currency: 'TZS',
    unit: 'TZS/kg',
    city: 'Dar es Salaam',
    priceLevel: 'medium',
    prixActuel: 750,
    variation: -0.8,
    tendance: 'baisse',
    production: '3.6M t',
    importations: '0.2M t',

    historique: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.','Jan.','Fév.','Mar.','Avr.','Mai','Juin'],
      reel:     [790, 785, 780, 775, 772, 768, 765, 762, 758, 755, 752, 750],
      prevision:[null,null,null,null,null,null,null,null, 755, 748, 742, 736],
    },

    prevision6mois: {
      labels: ['Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      valeurs: [745, 740, 738, 735, 732, 730],
    },

    facteurs: [
      {
        icon: '🌧️',
        titre: 'Bonnes précipitations',
        description: 'Les pluies régulières soutiennent une bonne saison agricole.',
      },
      {
        icon: '🚢',
        titre: 'Exportations en hausse',
        description: 'La Tanzanie exporte davantage de maïs vers les pays voisins (+5%).',
      },
      {
        icon: '🏦',
        titre: 'Taux de change stable',
        description: 'Le shilling tanzanien reste stable face au dollar américain.',
      },
    ],

    sparkline: [758, 757, 756, 755, 754, 753, 752, 752, 751, 750],
  },
};

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
  // 1️⃣ Chercher d'abord dans la map (priorité haute)
  const mappedName = countryNameMap[geoName];
  if (mappedName && countriesData[mappedName]) {
    return countriesData[mappedName];
  }
  
  // 2️⃣ Exact match en minuscules
  const geoLower = geoName.toLowerCase();
  for (const [countryName, countryData] of Object.entries(countriesData)) {
    if (countryName.toLowerCase() === geoLower) {
      return countryData;
    }
  }
  
  // 3️⃣ Match partiel par mots-clés
  const geoWords = geoLower.split(' ').filter(w => w.length > 2);
  for (const [countryName, countryData] of Object.entries(countriesData)) {
    const countryLower = countryName.toLowerCase();
    const countryWords = countryLower.split(' ');
    if (geoWords.some(word => countryWords.some(cw => cw === word))) {
      return countryData;
    }
  }
  
  // 4️⃣ Match partiel (le geojson contient le nom du pays)
  for (const [countryName, countryData] of Object.entries(countriesData)) {
    if (geoLower.includes(countryName.toLowerCase()) || countryName.toLowerCase().includes(geoLower)) {
      return countryData;
    }
  }
  
  // 5️⃣ Fallback : chercher le premier pays qui contient des mots similaires (Levenshtein-like)
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
    if (!res.ok) throw new Error('Erreur lors du chargement des pays');
    const json = await res.json();
    const countries = json.countries || [];

    // Réinitialiser avec les données détaillées
    COUNTRIES_DATA = { ...COUNTRIES_DATA_DETAILED };
    AVAILABLE_COUNTRIES = countries; // Sauvegarder la liste

    // Ajouter les pays retournés par l'API
    countries.forEach((countryName) => {
      if (!COUNTRIES_DATA[countryName]) {
        const code = countryName.toUpperCase().substring(0, 3);
        COUNTRIES_DATA[countryName] = getDefaultCountryData(countryName, code);
      }
      
      // Enrichir COUNTRY_NAME_MAP : mapper le nom anglais (géojson) vers le nom de l'API
      if (!COUNTRY_NAME_MAP[countryName]) {
        COUNTRY_NAME_MAP[countryName] = countryName;
      }
    });

    console.log(`✓ ${countries.length} pays disponibles depuis l'API`);
    console.log('Pays:', countries);
    return COUNTRIES_DATA;
  } catch (error) {
    console.error('Erreur chargement pays:', error);
    return COUNTRIES_DATA_DETAILED;
  }
};