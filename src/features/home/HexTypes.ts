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

export type InfrastructureCategory = 
  | 'ELECTRIC_GENERATION'
  | 'ELECTRIC_DISTRIBUTION'
  | 'WATER_TREATMENT'
  | 'CIVIL_LOGISTICS'
  | 'TRANSPORTATION'
  | 'HEAVY_MANUFACTURING'
  | 'CONSUMER_MANUFACTURING'
  | 'COMMUNICATIONS';

export interface InfrastructureNode {
  id: string;
  name: string;
  category: InfrastructureCategory;
  tier: number;
  capacity: number;
  state: OperationalState;
  maintenance_repair_duration: number;
  maintenance_repair_progress: number;
}

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

export interface RuntimeHexEntity extends HexData {
  settlementName?: string;
  infrastructureNodes: InfrastructureNode[];
}

export interface SectorRecord {
  terrain: TerrainType;
  controlledBy: FactionControl;
  elevation: number;
  infrastructure: number;
  population: number;
}