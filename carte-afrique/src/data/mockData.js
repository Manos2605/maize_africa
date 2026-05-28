// src/data/mockData.js
// Données fictives — à remplacer par les appels API quand le backend sera prêt.
// Structure identique à ce que l'API devra retourner.

export const COUNTRIES_DATA = {
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

  Cameroun: {
    id: 'CMR',
    name: 'Cameroun',
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

  Ethiopie: {
    id: 'ETH',
    name: 'Éthiopie',
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
    name: 'Tanzanie',
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

// Correspondance nom pays (carte) → clé dans COUNTRIES_DATA
// Utile quand react-simple-maps retourne des noms en anglais
export const COUNTRY_NAME_MAP = {
  'Nigeria':             'Nigeria',
  'Cameroon':            'Cameroun',
  'Kenya':               'Kenya',
  'Ghana':               'Ghana',
  'Ethiopia':            'Ethiopie',
  'Tanzania':            'Tanzania',
  'United Republic of Tanzania': 'Tanzania',
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