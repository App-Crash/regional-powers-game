export type FactionCode = 'col' | 'ven' | 'ecu' | 'bra' | 'per' | 'pan';
export type FactionControl = FactionCode;

export type TerrainType = 
  | 'mountain' 
  | 'plain' 
  | 'coastal' 
  | 'deep water' 
  | 'hills' 
  | 'forest' 
  | 'jungle' 
  | 'urban'
  | 'port'
  | 'marsh';

export interface InfraNode {
  id: string;
  name: string;
  cat: string;
  tier: number;
  cap: number;
  state: 'online' | 'offline' | 'damaged';
  maint_dur: number;
  maint_prog: number;
}

export interface RuntimeHexEntity {
  id: string;
  q: number;
  r: number;
  terrain: TerrainType;
  infra: number;
  population: number;
  elevation: number;
  wx: number;
  wy: number;
  fac_ctl: FactionCode;
  sett_name: string;
  infra_nodes: InfraNode[];
}

export type HexData = RuntimeHexEntity;

export type DiplomaticStance = 'player' | 'friendly' | 'enemy' | 'neutral';

export interface DiplomaticState {
  playerFaction: FactionCode;
  activeWars: Record<FactionCode, FactionCode[]>;
  allies: Record<FactionCode, FactionCode[]>;
}