export type EraMode = 'cold_war_1983' | 'modern_2026';

export interface EraThemeConfig {
  id: EraMode;
  label: string;
  hudTitle: string;
  containerClasses: string;
  headerClasses: string;
  accentText: string;
  borderAccent: string;
  badgeFriendly: string;
  badgeHostile: string;
  defaultUnitDoctrine: string;
}

export const ERA_THEMES: Record<EraMode, EraThemeConfig> = {
  cold_war_1983: {
    id: 'cold_war_1983',
    label: '1983 // COLD WAR',
    hudTitle: '',
    containerClasses: 'bg-black font-wargames crt-scanlines text-amber-400',
    headerClasses: 'bg-slate-950 border-b-2 border-amber-500/40',
    accentText: 'text-amber-400',
    borderAccent: 'border-amber-500/60',
    badgeFriendly: '[FRIENDLY // CARACAS PACT]',
    badgeHostile: '[HOSTILE // BOGOTA BLOC]',
    defaultUnitDoctrine: 'Armored Cavalry & M60 Patton Platoon',
  },
  modern_2026: {
    id: 'modern_2026',
    label: '2026 // MODERN',
    hudTitle: 'SOUTHCOM // ASYMMETRIC THEATER COMMAND [v2.6]',
    containerClasses: 'bg-slate-950 font-mono text-emerald-400',
    headerClasses: 'bg-slate-900 border-b-2 border-emerald-500/40',
    accentText: 'text-emerald-400',
    borderAccent: 'border-emerald-500/60',
    badgeFriendly: '[FRIENDLY // FANB DEFENDER]',
    badgeHostile: '[HOSTILE // COALITION VANGUARD]',
    defaultUnitDoctrine: 'FPV Drone Swarm & Mobile Air Defense',
  },
};

export function getEraThemeConfig(era: EraMode): EraThemeConfig {
  return ERA_THEMES[era] ?? ERA_THEMES.cold_war_1983;
}