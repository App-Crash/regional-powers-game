export type BiomeType = 'MOUNTAINS' | 'PLAINS' | 'COASTAL' | 'VALLEY';

export type AssetCategory = 'CAPITAL' | 'SEA_PORT' | 'AIRBASE' | 'LOGISTICS_HUB' | 'MINING_COMPLEX' | 'SAM_GRID';

export interface GarrisonUnit {
  id: string;
  name: string;
  type: 'FPV_DRONE' | 'SAM_PANTSIR' | 'CRUISE_MISSILE' | 'INFANTRY';
  count: number;
}

export interface HexNode {
  id: string;
  q: number;
  r: number;
  x: number;
  y: number;
  biome: BiomeType;
  assetType?: AssetCategory;
  name: string;
  elevation: number;
  resourceOutput: {
    rawMetals: number;
    hydrocarbons: number;
    manpower: number;
    exportLogistics: number;
  };
  garrison: GarrisonUnit[];
  isFrontlineBorder?: boolean;
}