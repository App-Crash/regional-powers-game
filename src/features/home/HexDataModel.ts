import type { HexData, TerrainType, FactionControl } from './HexTypes';
import { WORLD_SECTOR_RECORDS } from './worldSectorRecords';

/**
 * Checks if a coordinate is along the interpolation line from (0,0) to a target anchor.
 */
function isAlongCorridor(q: number, r: number, targetQ: number, targetR: number): boolean {
  const N = Math.max(Math.abs(targetQ), Math.abs(targetR), Math.abs(targetQ + targetR));
  if (N === 0) return false;
  
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const lerpQ = Math.round(0 * (1 - t) + targetQ * t);
    const lerpR = Math.round(0 * (1 - t) + targetR * t);
    if (q === lerpQ && r === lerpR) return true;
  }
  return false;
}

export function generateHexDataMap(hexWidth: number, hexHeight: number): Map<string, HexData> {
  const map = new Map<string, HexData>();

  // Extract coastal coordinates for the dynamic deep water rule
  const coastalEntries = Object.entries(WORLD_SECTOR_RECORDS)
    .filter(([_, rec]) => rec.terrain === 'coastal')
    .map(([key]) => key.split(',').map(Number));

  // Extract faction border anchors to extend outward
  const enemyAnchors = Object.entries(WORLD_SECTOR_RECORDS)
    .filter(([_, rec]) => rec.controlledBy === 'enemy')
    .map(([key]) => key.split(',').map(Number));

  const allyAnchors = Object.entries(WORLD_SECTOR_RECORDS)
    .filter(([_, rec]) => rec.controlledBy === 'ally')
    .map(([key]) => key.split(',').map(Number));

  for (let q = -17; q <= 17; q++) {
    for (let r = -17; r <= 17; r++) {
      if (Math.abs(q + r) > 17) continue;

      const wx = hexWidth * (q + r / 2);
      const wy = (hexHeight * 3 / 4) * r;
      const coordKey = `${q},${r}`;
      const id = `hex_${q}_${r}`;

      // 1. Explicit pre-canned database record lookup
      if (WORLD_SECTOR_RECORDS[coordKey]) {
        const record = WORLD_SECTOR_RECORDS[coordKey];
        map.set(id, {
          id, q, r,
          terrain: record.terrain,
          infrastructure: record.infrastructure,
          population: record.population,
          elevation: record.elevation,
          wx, wy,
          controlledBy: record.controlledBy,
        });
        continue;
      }

      // 2. Rule: Deep water hexes are derived dynamically north of coastal hexes
      const isNorthOfCoast = coastalEntries.some(([cq, cr]) => q <= cq && r > cr && (r - cr) >= 1);
      if (isNorthOfCoast) {
        map.set(id, {
          id, q, r,
          terrain: 'deep water',
          infrastructure: 0,
          population: 0,
          elevation: 0,
          wx, wy,
          controlledBy: null, // International waters
        });
        continue;
      }

      // 3. Rule: Faction control and corridors extending out from (0,0) / borders
      let controlledBy: FactionControl = 'player';
      let terrain: TerrainType = 'plains';
      let elevation = 300;
      let infrastructure = 3;
      let population = 5000;

      const connectsToEnemy = enemyAnchors.some(([tq, tr]) => isAlongCorridor(q, r, tq, tr));
      const connectsToAlly = allyAnchors.some(([tq, tr]) => isAlongCorridor(q, r, tq, tr));

      if (connectsToEnemy || q >= 6) {
        controlledBy = 'enemy';
        terrain = 'hills';
        elevation = 400;
      } else if (connectsToAlly || q <= -10) {
        controlledBy = 'ally';
        terrain = 'jungle';
        elevation = 150;
      } else {
        controlledBy = 'player'; // Derived friendly territory linking capital out
      }

      map.set(id, {
        id, q, r,
        terrain,
        infrastructure,
        population,
        elevation,
        wx, wy,
        controlledBy,
      });
    }
  }

  return map;
}