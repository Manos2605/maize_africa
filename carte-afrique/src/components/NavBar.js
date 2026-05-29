import { useState } from 'react';

const IconDashboard = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const IconHistory = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconReport = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);

const IconInsights = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
  </svg>
);

const IconMoon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const IconSun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
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

const NAV_LINKS = [
  { id: 'dashboard',  label: 'Dashboard',  Icon: IconDashboard },
  { id: 'historique', label: 'Historique', Icon: IconHistory   },
  { id: 'rapports',   label: 'Rapports',   Icon: IconReport    },
  { id: 'insights',   label: 'Insights',   Icon: IconInsights  },
];

export default function NavBar({ activeTab, onTabChange, darkMode, onToggleDark }) {
  return (
    <nav className="flex items-center justify-between px-6 h-14 bg-bg-secondary border-b border-border select-none flex-shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center text-accent-green">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-text-primary font-semibold text-sm">MaizePredict AI</span>
          <span className="text-text-secondary text-[11px]">Prediction du prix du mais en Afrique</span>
        </div>
      </div>

      {/* Liens */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-150 relative
                ${isActive
                  ? 'text-accent-green'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }
              `}
            >
              <Icon />
              {label}
              {isActive && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-accent-green rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Toggle dark mode */}
      <button
        onClick={onToggleDark}
        className="w-9 h-9 rounded-lg bg-bg-tertiary hover:bg-bg-hover border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-150"
        title={darkMode ? 'Mode clair' : 'Mode sombre'}
      >
        {darkMode ? <IconSun /> : <IconMoon />}
      </button>

    </nav>
  );
}