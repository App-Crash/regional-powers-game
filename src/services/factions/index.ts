import type { RuntimeHexEntity } from '../../features/home/HexTypes';

export type TheaterRegion = 'SA' | 'NA' | 'EU' | 'AP' | 'AF' | 'GLOBAL';

export interface NationMeta {
  code: string;
  region: Exclude<TheaterRegion, 'GLOBAL'>;
  name: string;
}

interface NationModule {
  NATION_META?: NationMeta;
  buildTheaterNation?: () => RuntimeHexEntity[];
}

const nationModules = import.meta.glob<NationModule>('./*/index.ts', { eager: true });

export function getRegisteredNations(region?: TheaterRegion): NationMeta[] {
  return Object.values(nationModules)
    .flatMap((mod) => (mod.NATION_META ? [mod.NATION_META] : []))
    .filter((meta) => !region || region === 'GLOBAL' || meta.region === region);
}

export function buildTheaterNationByCode(code: string): RuntimeHexEntity[] {
  const mod = Object.values(nationModules).find((m) => m.NATION_META?.code === code);
  return mod?.buildTheaterNation ? mod.buildTheaterNation() : [];
}

export function buildTheaterRegion(region: TheaterRegion = 'SA'): RuntimeHexEntity[] {
  return Object.values(nationModules).flatMap((mod) => {
    if (!mod.buildTheaterNation || !mod.NATION_META) return [];
    if (region !== 'GLOBAL' && mod.NATION_META.region !== region) return [];
    return mod.buildTheaterNation();
  });
}