export type UnitDomain = 'air' | 'ground' | 'naval';

export type LogisticsRole = 'refueler' | 'airlifter' | 'logistics_bn';

export interface LogisticsUnit {
  id: string;
  name: string;
  role: LogisticsRole;
  rangeBonus: number;
}

export interface CombatUnit {
  id: string;
  name: string;
  callsign: string;
  domain: UnitDomain;
  faction: string;
  q: number;
  r: number;
  organicRange: number;
  readiness: number; // percentage 0-100
  personnel: number;
  equipment: string; // e.g., "F-16A / Mirage 5" or "M60A3 Patton"
}

export interface MissionOption {
  id: 'capture_target' | 'strike_infra' | 'sead_sweep';
  label: string;
  description: string;
}

export type OrderPhase =
  | 'IDLE'
  | 'UNIT_SELECTED'
  | 'DESTINATION_SELECTED'
  | 'MISSION_CONFIRMED';