import { type TerrainType, type FactionCode } from '../home/HexTypes';
import { type TheaterRegion } from '../../services/factions';

export interface UnplacedSeed {
  id: string;
  sett_name: string;
  population: number;
  infra: number;
  elevation: number;
  terrain: TerrainType;
  fac_ctl: FactionCode;
  infra_nodes: any[];
}

export interface TheaterRegionOption {
  code: TheaterRegion;
  label: string;
  enabled: boolean;
}

export const THEATER_REGIONS: TheaterRegionOption[] = [
  { code: 'SA', label: 'South America (SA)', enabled: true },
  { code: 'NA', label: 'North America (NA)', enabled: false },
  { code: 'EU', label: 'Europe (EU)', enabled: false },
  { code: 'AP', label: 'Asia-Pacific (AP)', enabled: false },
  { code: 'AF', label: 'Africa (AF)', enabled: false },
  { code: 'GLOBAL', label: 'Global (WW3)', enabled: false },
];