import { type RuntimeHexEntity, type TerrainType, type FactionCode } from '../home/HexTypes';
import { buildTheaterRegion } from '../../services/factions';

interface Point2D {
  q: number;
  r: number;
}

// Monotone chain convex hull in axial (q, r) space
function computeConvexHull(points: Point2D[]): Point2D[] {
  if (points.length <= 3) return points;
  const sorted = [...points].sort((a, b) => (a.q === b.q ? a.r - b.r : a.q - b.q));
  const cross = (o: Point2D, a: Point2D, b: Point2D) =>
    (a.q - o.q) * (b.r - o.r) - (a.r - o.r) * (b.q - o.q);

  const lower: Point2D[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: Point2D[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

// Check if point is inside or within 1-hex buffer of the hull polygon
function isInsideOrNearHull(q: number, r: number, hull: Point2D[]): boolean {
  if (hull.length < 3) return false;

  let inside = false;
  for (let i = 0, j = hull.length - 1; i < hull.length; j = i++) {
    const xi = hull[i].q, yi = hull[i].r;
    const xj = hull[j].q, yj = hull[j].r;
    const intersect = yi > r !== yj > r && q < ((xj - xi) * (r - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  if (inside) return true;

  for (let i = 0; i < hull.length; i++) {
    const a = hull[i];
    const b = hull[(i + 1) % hull.length];
    const abq = b.q - a.q;
    const abr = b.r - a.r;
    const lenSq = abq * abq + abr * abr || 1;
    const t = Math.max(0, Math.min(1, ((q - a.q) * abq + (r - a.q) * abr) / lenSq));
    const projQ = a.q + t * abq;
    const projR = a.r + t * abr;
    const dist = Math.hypot(q - projQ, r - projR);
    if (dist <= 1.15) return true;
  }
  return false;
}

export function generateInteriorFillerHexes(
  anchorCities: RuntimeHexEntity[],
  nationId = 'ven'
): RuntimeHexEntity[] {
  // Fallback default boundary points if no cities have been placed yet
  const effectivePoints = anchorCities.length > 0 
    ? anchorCities.map((c) => ({ q: c.q, r: c.r }))
    : [
        { q: 12, r: -5 },
        { q: 18, r: -8 },
        { q: 20, r: -3 },
        { q: 14, r: -1 },
      ];

  const regionalHexes = buildTheaterRegion('SA');
  const occupiedKeys = new Set<string>(
    regionalHexes.map((h) => `${h.q},${h.r}`)
  );
  anchorCities.forEach((c) => occupiedKeys.add(`${c.q},${c.r}`));

  const hull = computeConvexHull(effectivePoints);

  const minQ = Math.min(...effectivePoints.map((p) => p.q)) - 2;
  const maxQ = Math.max(...effectivePoints.map((p) => p.q)) + 2;
  const minR = Math.min(...effectivePoints.map((p) => p.r)) - 2;
  const maxR = Math.max(...effectivePoints.map((p) => p.r)) + 2;

  const fillerHexes: RuntimeHexEntity[] = [];
  let counter = 1;

  for (let q = minQ; q <= maxQ; q++) {
    for (let r = minR; r <= maxR; r++) {
      const key = `${q},${r}`;
      if (occupiedKeys.has(key)) continue;
      if (!isInsideOrNearHull(q, r, hull)) continue;

      let terrain: TerrainType = 'plain';
      let elevation = 180;
      if (q <= 10 && r >= -6) {
        terrain = 'mountain';
        elevation = 2100;
      } else if (r >= -4 || q >= 15) {
        terrain = 'forest';
        elevation = 240;
      }

      fillerHexes.push({
        id: `${nationId}-f-${String(counter).padStart(3, '0')}`,
        q,
        r,
        terrain,
        infra: 1,
        population: 12000 + ((Math.abs(q * 17 + r * 31) % 25) * 1000),
        elevation,
        wx: 0,
        wy: 0,
        fac_ctl: nationId as FactionCode,
        sett_name: `Sector ${q},${r}`,
        infra_nodes: [],
      });
      counter++;
    }
  }

  return fillerHexes;
}

// Bounded chunk exporter ensuring each generated file stays under ~250 lines
export function buildTypeScriptChunkFiles(
  anchorCities: RuntimeHexEntity[],
  fillerHexes: RuntimeHexEntity[],
  nationCode = 'ven',
  nationName = 'Venezuela',
  region = 'SA',
  maxLinesPerFile = 250
): Record<string, string> {
  const allEntities = [...anchorCities, ...fillerHexes];
  const files: Record<string, string> = {};
  
  if (allEntities.length === 0) {
    files[`${nationCode}1.ts`] = [
      `import { type RuntimeHexEntity } from '../../../features/home/HexTypes';`,
      ``,
      `export const MOCK_${nationCode.toUpperCase()}_CHUNK_1: RuntimeHexEntity[] = [];`,
      ``
    ].join('\n');

    files['index.ts'] = [
      `import { type RuntimeHexEntity } from '../../../features/home/HexTypes';`,
      `import { MOCK_${nationCode.toUpperCase()}_CHUNK_1 } from './${nationCode}1';`,
      ``,
      `export const NATION_META = {`,
      `  code: '${nationCode}' as const,`,
      `  region: '${region}' as const,`,
      `  name: '${nationName}',`,
      `};`,
      ``,
      `export const MOCK_${nationCode.toUpperCase()}_THEATER: RuntimeHexEntity[] = [`,
      `  ...MOCK_${nationCode.toUpperCase()}_CHUNK_1,`,
      `];`,
      ``,
      `export function buildTheaterNation(): RuntimeHexEntity[] {`,
      `  return MOCK_${nationCode.toUpperCase()}_THEATER;`,
      `}`,
      ``
    ].join('\n');
    return files;
  }

  const chunkArrays: RuntimeHexEntity[][] = [];
  let currentChunk: RuntimeHexEntity[] = [];
  let currentLines = 15;

  for (const entity of allEntities) {
    const entityLines = 14;
    if (currentLines + entityLines > maxLinesPerFile && currentChunk.length > 0) {
      chunkArrays.push(currentChunk);
      currentChunk = [entity];
      currentLines = 15 + entityLines;
    } else {
      currentChunk.push(entity);
      currentLines += entityLines;
    }
  }
  if (currentChunk.length > 0) {
    chunkArrays.push(currentChunk);
  }

  const exportedNames: string[] = [];

  chunkArrays.forEach((chunk, index) => {
    const fileIndex = index + 1;
    const exportName = `MOCK_${nationCode.toUpperCase()}_CHUNK_${fileIndex}`;
    exportedNames.push(exportName);

    files[`${nationCode}${fileIndex}.ts`] = [
      `import { type RuntimeHexEntity } from '../../../features/home/HexTypes';`,
      ``,
      `export const ${exportName}: RuntimeHexEntity[] = ${JSON.stringify(chunk, null, 2)};`,
      ``
    ].join('\n');
  });

  const imports = exportedNames
    .map((name, idx) => `import { ${name} } from './${nationCode}${idx + 1}';`)
    .join('\n');
  const spreads = exportedNames.map((name) => `  ...${name},`).join('\n');

  files['index.ts'] = [
    `import { type RuntimeHexEntity } from '../../../features/home/HexTypes';`,
    imports,
    ``,
    `export const NATION_META = {`,
    `  code: '${nationCode}' as const,`,
    `  region: '${region}' as const,`,
    `  name: '${nationName}',`,
    `};`,
    ``,
    `export const MOCK_${nationCode.toUpperCase()}_THEATER: RuntimeHexEntity[] = [`,
    spreads,
    `];`,
    ``,
    `export function buildTheaterNation(): RuntimeHexEntity[] {`,
    `  return MOCK_${nationCode.toUpperCase()}_THEATER;`,
    `}`,
    ``
  ].join('\n');

  return files;
}