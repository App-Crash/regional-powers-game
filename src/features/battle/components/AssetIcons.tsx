import React from 'react';

interface IconProps {
  type: 'DRONE' | 'MISSILE' | string;
  rangeClass: 'short' | 'mid' | 'long' | string;
  size?: number;
  className?: string;
}

export const TacticalAssetIcon: React.FC<IconProps> = ({ type, rangeClass, size = 16, className = '' }) => {
  // Short-Range: Quadcopter / FPV drone
  if (rangeClass === 'short' || type === 'DRONE') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 12v-2a2 2 0 0 1 2-2h2" />
        <circle cx="5" cy="5" r="3" />
        <circle cx="19" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <line x1="7.2" y1="7.2" x2="16.8" y2="16.8" />
        <line x1="16.8" y1="7.2" x2="7.2" y2="16.8" />
      </svg>
    );
  }

  // Mid-Range: Swept-wing loitering drone (Hornet style)
  if (rangeClass === 'mid') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2, 20 18, 12 14, 4 18" />
        <line x1="12" y1="14" x2="12" y2="22" />
      </svg>
    );
  }

  // Long-Range: Cruise Missile (Slender fuselage with folding wings)
  if (rangeClass === 'long' && type === 'MISSILE') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2v20M9 7l3-5 3 5M6 12h12M8 18l4-2 4 2" />
      </svg>
    );
  }

  // Default Fallback / Ballistic Profile
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v20M15 5l-3-3-3 3M7 16l5 6 5-6" />
    </svg>
  );
};