import type { RuntimeHexEntity } from '../../../features/home/HexTypes';
import { MOCK_COLOMBIA_THEATER } from '../col';
import { TheaterGeneratorService, type StrategicHubSeed } from '../../theater/TheaterGeneratorService';
import type { EraMode } from '../../theater/eraConfig';

export const VENEZUELA_STRATEGIC_HUBS: StrategicHubSeed[] = [
  { q: 12, r: -8, name: 'Caracas', terrain: 'urban', infra: 6, population: 3200000 },
  { q: 12, r: -9, name: 'La Guaira', terrain: 'port', infra: 5, population: 350000 },
  { q: 9, r: -7, name: 'Maracaibo', terrain: 'port', infra: 5, population: 2100000 },
  { q: 11, r: -8, name: 'Valencia', terrain: 'urban', infra: 4, population: 1500000 },
  { q: 16, r: -6, name: 'Ciudad Guayana', terrain: 'urban', infra: 4, population: 950000 },
  { q: 10, r: -6, name: 'Mérida', terrain: 'mountain', infra: 3, population: 450000 },
  { q: 9, r: -5, name: 'San Cristóbal', terrain: 'mountain', infra: 3, population: 600000 },
];

export function buildVenezuelaTheater(era: EraMode = 'cold_war_1983'): RuntimeHexEntity[] {
  const venHexes = TheaterGeneratorService.generateTheater({
    nationId: 'ven',
    era,
    // Corrected northern tier (less negative / closer to origin r, higher q)
    qRange: [8, 18],
    rRange: [-12, -3],
    existingEntities: MOCK_COLOMBIA_THEATER,
    strategicHubs: VENEZUELA_STRATEGIC_HUBS,
  });
  return venHexes;
}

export const MOCK_VENEZUELA_THEATER: RuntimeHexEntity[] = buildVenezuelaTheater('cold_war_1983');