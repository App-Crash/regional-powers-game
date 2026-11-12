export type TerrainType =
  | 'deep water'
  | 'coastal'
  | 'port'
  | 'urban'
  | 'suburban'
  | 'plains'
  | 'farmland'
  | 'forest'
  | 'desert'
  | 'jungle'
  | 'hills'
  | 'mountainous';

export type FactionControl = 'player' | 'enemy' | 'neutral' | 'ally' | null;

export type OperationalState = 'online' | 'offline';

export type InfraCategory = 
  | 'ELEC_GEN'
  | 'ELEC_DIST'
  | 'WAT_TRT'
  | 'CIV_LOG'
  | 'TRNSPRT'
  | 'HVY_MFG'
  | 'CON_MFG'
  | 'COMM';

export interface InfraNode {
  id: string;
  name: string;
  cat: InfraCategory;
  tier: number;
  cap: number;
  state: OperationalState;
  maint_dur: number;
  maint_prog: number;
}

export interface HexData {
  id: string;
  q: number;
  r: number;
  terrain: TerrainType;
  infra: number; // 0 to 9
  population: number;
  elevation: number; // in meters
  wx: number;
  wy: number;
  ctrl: FactionControl;
  sett_name: string; // Non-optional canonical field from game API
}

export interface RuntimeHexEntity extends HexData {
  infra_nodes: InfraNode[];
}

export interface SectorRecord {
  terrain: TerrainType;
  ctrl: FactionControl;
  elevation: number;
  infra: number;
  population: number;
}