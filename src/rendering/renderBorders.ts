import * as THREE from 'three';
import { getHexCenterPosition } from '../features/home/HexGridLayer';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from '../features/home/CurvedTerrain';

export function createInternationalBordersGroup(): THREE.Group {
  const borderGroup = new THREE.Group();
  borderGroup.name = 'InternationalBordersGroup';

  const borderMaterial = new THREE.LineBasicMaterial({
    color: 0xf59e0b, // Amber border line
    linewidth: 3,
    transparent: true,
    opacity: 0.68,              // Midpoint material opacity
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -8,
  });

  // ⚓ 1. HARD ANCHOR: Retrieve exact world 2D position for Hex [-4, 9]
  const apexHexWorld = getHexCenterPosition(-4, 9);
  const anchorX = apexHexWorld.x;
  const anchorY = apexHexWorld.y;

  // 🗺️ 2. Geographic Offsets (dx, dy) relative to [-4, 9]
  const perimeterRelativeOffsets: [number, number][] = [
    [0, 0],         // ⚓ INDEX 0: LOCKED EXACTLY TO [-4, 9] (NORTHERNMOST APEX)
    [-8, -5],       // Caribbean coast heading toward Santa Marta
    [-18, -12],     // Barranquilla / Cartagena sector
    [-28, -22],     // Gulf of Urabá / Panama connection
    [-32, -32],     // Panama border Pacific drop
    [-30, -50],     // Northern Chocó Pacific coast
    [-26, -70],     // Buenaventura / Pacific central
    [-22, -88],     // Tumaco / Southwest coast
    [-15, -100],    // Ecuador border junction (Ipiales tripoint)
    [-4, -108],     // Putumayo Amazon frontier tracking east
    [10, -118],     // Leticia Amazon tip (Southernmost vertex)
    [22, -102],     // Brazilian border tracking northeast
    [35, -80],      // Vaupés / Apaporis river sector
    [42, -55],      // Easternmost apex (Orinoco River / Vichada)
    [32, -32],      // Arauca / Venezuela frontier tracking north
    [18, -16],      // Cúcuta / Norte de Santander
    [8, -6],        // Guajira eastern neck
    [0, 0]          // Close loop back precisely at [-4, 9]
  ];

  const points: THREE.Vector3[] = [];

  perimeterRelativeOffsets.forEach(([dx, dy]) => {
    // 3. Absolute 2D Position = Anchor World Pos + Offset
    const worldX = anchorX + dx;
    const worldY = anchorY + dy;

    // 4. Height evaluation at flat 2D point (+0.40 to safely clear terrain and hex control borders)
    const vz = getCurvatureHeight(worldX, worldY) + 0.40;

    // 5. Pitch Transformation matching CurvedTerrain engine
    const rotatedY = worldY * Math.cos(TERRAIN_ROTATION_X) - vz * Math.sin(TERRAIN_ROTATION_X);
    const rotatedZ = worldY * Math.sin(TERRAIN_ROTATION_X) + vz * Math.cos(TERRAIN_ROTATION_X);

    points.push(new THREE.Vector3(worldX, rotatedY, rotatedZ));
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const borderLine = new THREE.Line(geometry, borderMaterial);
  borderLine.renderOrder = 25;
  borderGroup.add(borderLine);

  return borderGroup;
}