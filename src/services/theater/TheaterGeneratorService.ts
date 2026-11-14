import type { RuntimeHexEntity, TerrainType } from '../../features/home/HexTypes';
import type { EraMode } from './eraConfig';

export interface StrategicHubSeed {
  q: number;
  r: number;
  name: string;
  terrain: TerrainType;
  infra: number;
  population: number;
}

export interface TheaterGenerationConfig {
  nationId: 'ven' | 'bra' | 'col';
  era: EraMode;
  qRange: [number, number];
  rRange: [number, number];
  existingEntities?: RuntimeHexEntity[];
  strategicHubs?: StrategicHubSeed[];
}

export class TheaterGeneratorService {
  public static generateTheater(config: TheaterGenerationConfig): RuntimeHexEntity[] {
    const entities: RuntimeHexEntity[] = [];
    const [minQ, maxQ] = config.qRange;
    const [minR, maxR] = config.rRange;

    const occupiedCoords = new Set<string>(
      (config.existingEntities ?? []).map((hex) => `${hex.q},${hex.r}`)
    );

    const hubMap = new Map<string, StrategicHubSeed>();
    (config.strategicHubs ?? []).forEach((hub) => {
      hubMap.set(`${hub.q},${hub.r}`, hub);
    });

    console.log(
      `[TheaterGeneratorService] Generating ${config.nationId} | qRange: [${minQ}, ${maxQ}], rRange: [${minR}, ${maxR}] | Existing occupied collisions: ${occupiedCoords.size} | Hubs: ${hubMap.size}`
    );

    let idCounter = 1;
    let skippedOccupied = 0;
    let skippedOrganic = 0;

    for (let q = minQ; q <= maxQ; q++) {
      for (let r = minR; r <= maxR; r++) {
        const coordKey = `${q},${r}`;

        // 1. Border Collision Check
        if (occupiedCoords.has(coordKey)) {
          skippedOccupied++;
          continue;
        }

        // 2. Organic shape culling
        const hub = hubMap.get(coordKey);
        if (!hub && this.isOutsideOrganicPolygon(q, r, minQ, maxQ, minR, maxR)) {
          skippedOrganic++;
          continue;
        }

        const terrain = hub ? hub.terrain : this.resolveTerrainHeuristic(q, r, minQ, minR, maxR);
        if (terrain === 'deep water') continue;

        const wx = parseFloat((q * 1.5).toFixed(2));
        const wy = parseFloat(((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r).toFixed(2));

        const eraPopMultiplier = config.era === 'cold_war_1983' ? 0.55 : 1.0;
        const basePop = hub
          ? hub.population
          : terrain === 'urban'
          ? 850000
          : Math.abs((q * 7919 + r * 104729) % 45000) + 6000;

        entities.push({
          id: `${config.nationId}_${idCounter++}`,
          q,
          r,
          wx,
          wy,
          terrain,
          fac_ctl: config.nationId,
          infra: hub ? hub.infra : this.resolveDefaultInfra(terrain, config.era),
          population: Math.round(basePop * eraPopMultiplier),
          sett_name: hub?.name,
        } as RuntimeHexEntity);
      }
    }

    console.log(
      `[TheaterGeneratorService] SUCCESS: Generated ${entities.length} hexes for ${config.nationId} (Skipped due to collision: ${skippedOccupied}, Skipped due to organic culling: ${skippedOrganic})`
    );

    return entities;
  }

  private static isOutsideOrganicPolygon(
    q: number,
    r: number,
    minQ: number,
    maxQ: number,
    minR: number,
    maxR: number
  ): boolean {
    const centerQ = (minQ + maxQ) / 2;
    const centerR = (minR + maxR) / 2;
    const normQ = (q - centerQ) / ((maxQ - minQ) / 2 || 1);
    const normR = (r - centerR) / ((maxR - minR) / 2 || 1);

    const jitter = Math.sin(q * 1.7 + r * 2.3) * 0.18;
    return normQ * normQ + normR * normR > 1.05 + jitter;
  }

  private static resolveTerrainHeuristic(
    q: number,
    r: number,
    minQ: number,
    minR: number,
    maxR: number
  ): TerrainType {
    if (r <= minR + 1) return 'coastal';
    if (q <= minQ + 2) return 'mountain';
    if (r >= maxR - 2) return (q + r) % 3 === 0 ? 'marsh' : 'jungle';
    if ((q * 3 + r * 5) % 11 === 0) return 'hills';
    if ((q + r) % 9 === 0) return 'forest';
    return 'plain';
  }

  private static resolveDefaultInfra(terrain: TerrainType, era: EraMode): number {
    if (terrain === 'urban' || terrain === 'port') return era === 'cold_war_1983' ? 4 : 5;
    if (terrain === 'coastal' || terrain === 'plain') return 2;
    return 1;
  }
}