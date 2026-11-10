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

export interface HexData {
  id: string;
  q: number;
  r: number;
  terrain: TerrainType;
  infrastructure: number; // 0 to 9
  population: number;
  elevation: number;      // in meters
  wx: number;
  wy: number;
  controlledBy: FactionControl;
}

export interface SectorRecord {
  terrain: TerrainType;
  controlledBy: FactionControl;
  elevation: number;
  infrastructure: number;
  population: number;
}