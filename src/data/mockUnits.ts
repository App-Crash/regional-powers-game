import { type CombatUnit, type LogisticsUnit, type MissionOption } from '../types/unitOrders';

export const INITIAL_COMBAT_UNITS: CombatUnit[] = [
  {
    id: 'unit-18th-air-assault',
    name: '18th Air Assault Brigade',
    callsign: 'CONDOR-1',
    domain: 'air',
    faction: 'col',
    q: -4,
    r: 1,
    organicRange: 3,
    readiness: 94,
    personnel: 3400,
    equipment: 'Black Hawk / Super Tucano',
  },
  {
    id: 'unit-col-mech-div',
    name: '4th Mechanized Division',
    callsign: 'BOGOTA-SHIELD',
    domain: 'ground',
    faction: 'col',
    q: -4,
    r: 1,
    organicRange: 2,
    readiness: 88,
    personnel: 12000,
    equipment: 'EE-9 Cascavel / M113',
  },
  {
    id: 'unit-ven-su30-wing',
    name: '13th Fighter Air Group (Caracas)',
    callsign: 'DIABLO-LEAD',
    domain: 'air',
    faction: 'ven',
    q: 1,
    r: -2,
    organicRange: 4,
    readiness: 82,
    personnel: 1800,
    equipment: 'Su-30MK2 Flanker-G',
  },
];

export const AVAILABLE_LOGISTICS_UNITS: LogisticsUnit[] = [
  {
    id: 'log-kc767-tanker',
    name: 'KC-767 Aerial Refueling Wing',
    role: 'refueler',
    rangeBonus: 4,
  },
  {
    id: 'log-c130-airlift',
    name: 'C-130 Hercules Airlift & Logistics Bn',
    role: 'airlifter',
    rangeBonus: 5,
  },
];

export const HOSTILE_MISSIONS: MissionOption[] = [
  {
    id: 'capture_target',
    label: 'Capture Target',
    description: 'Air-assault insertion to seize sector control.',
  },
  {
    id: 'strike_infra',
    label: 'Neutralize Infrastructure',
    description: 'Precision strike against military installations.',
  },
  {
    id: 'sead_sweep',
    label: 'SEAD / Air Superiority',
    description: 'Suppress enemy air defenses in target sector.',
  },
];