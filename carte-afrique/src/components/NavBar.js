// src/components/NavBar.js

import { useState } from 'react';

// Icônes SVG inline (pas besoin d'installer une lib d'icônes)
const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const IconHistory = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconReport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);

const IconInsights = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
  </svg>
);

const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"  x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// Liens de navigation
const NAV_LINKS = [
  { id: 'dashboard',  label: 'Dashboard',  Icon: IconDashboard },
  { id: 'historique', label: 'Historique', Icon: IconHistory   },
  { id: 'rapports',   label: 'Rapports',   Icon: IconReport    },
  { id: 'insights',   label: 'Insights',   Icon: IconInsights  },
];

// ─────────────────────────────────────────────
// Composant NavBar
// Props :
//   activeTab   : string — onglet actif ('dashboard', 'historique', ...)
//   onTabChange : function(id) — appelée au clic sur un onglet
//   darkMode    : boolean
//   onToggleDark: function() — bascule le thème
// ─────────────────────────────────────────────
export default function NavBar({ activeTab, onTabChange, darkMode, onToggleDark }) {

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="
      flex items-center justify-between
      px-6 h-16
      bg-bg-secondary
      border-b border-border
      select-none
    ">

      {/* ── Gauche : Logo ── */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="
          w-9 h-9 rounded-lg
          bg-accent-green/10
          flex items-center justify-center
          text-xl
        ">
          🌽
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-text-primary font-semibold text-sm">
            MaizePredict AI
          </span>
          <span className="text-text-secondary text-xs">
            Prédiction du prix du maïs en Afrique
          </span>
        </div>
      </div>

      {/* ── Centre : Liens de navigation ── */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                flex items-center gap-2
                px-4 py-2 rounded-lg
                text-sm font-medium
                transition-all duration-150
                relative
                ${isActive
                  ? 'text-accent-green'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }
              `}
            >
              <Icon />
              {label}

              {/* Indicateur actif (trait vert sous le lien) */}
              {isActive && (
                <span className="
                  absolute -bottom-[17px] left-0 right-0
                  h-[2px] bg-accent-green rounded-full
                "/>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Droite : Toggle dark mode + profil ── */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">

        {/* Bouton dark/light mode */}
        <button
          onClick={onToggleDark}
          className="
            w-9 h-9 rounded-lg
            bg-bg-tertiary hover:bg-bg-hover
            border border-border
            flex items-center justify-center
            text-text-secondary hover:text-text-primary
            transition-all duration-150
          "
          title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>

        {/* Profil utilisateur */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(prev => !prev)}
            className="
              flex items-center gap-2
              px-3 py-1.5 rounded-lg
              bg-bg-tertiary hover:bg-bg-hover
              border border-border
              transition-all duration-150
            "
          >
            {/* Avatar initiales */}
            <div className="
              w-7 h-7 rounded-full
              bg-accent-green
              flex items-center justify-center
              text-xs font-semibold text-bg-primary
            ">
              AD
            </div>
            <div className="flex flex-col leading-tight text-left">
              <span className="text-text-primary text-xs font-medium">
                Amadou Diallo
              </span>
              <span className="text-text-secondary text-[10px]">
                Analyste
              </span>
            </div>
            <span className={`
              text-text-secondary transition-transform duration-200
              ${userMenuOpen ? 'rotate-180' : ''}
            `}>
              <IconChevron />
            </span>
          </button>

          {/* Menu déroulant profil */}
          {userMenuOpen && (
            <div className="
              absolute right-0 top-full mt-2
              w-44 py-1
              bg-bg-secondary border border-border
              rounded-lg shadow-lg
              z-50
            ">
              {['Mon profil', 'Paramètres', 'Se déconnecter'].map((item) => (
                <button
                  key={item}
                  onClick={() => setUserMenuOpen(false)}
                  className="
                    w-full text-left px-4 py-2
                    text-sm text-text-secondary
                    hover:text-text-primary hover:bg-bg-hover
                    transition-colors duration-100
                  "
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}