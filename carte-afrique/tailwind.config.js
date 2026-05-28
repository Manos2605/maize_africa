/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Fonds principaux (inspirés du design)
        bg: {
          primary:   '#0D1117',  // fond global très sombre
          secondary: '#161B22',  // fond des cartes
          tertiary:  '#1C2128',  // fond des éléments internes
          hover:     '#21262D',  // survol
        },
        // Bordures
        border: {
          DEFAULT: '#30363D',
          light:   '#3D444D',
        },
        // Accents
        accent: {
          green:  '#3FB950',   // prix en hausse, sparkline
          orange: '#F0883E',   // ligne prévision
          blue:   '#58A6FF',   // ligne historique
          red:    '#F85149',   // prix en baisse
        },
        // Texte
        text: {
          primary:   '#E6EDF3',
          secondary: '#7D8590',
          muted:     '#484F58',
        },
        // Légende carte (5 niveaux de prix)
        price: {
          vhigh:  '#F85149',  // > 400
          high:   '#F0883E',  // 350–400
          medium: '#58A6FF',  // 300–350
          low:    '#3FB950',  // 250–300
          vlow:   '#6E7681',  // < 250
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      }
    },
  },
  plugins: [],
}