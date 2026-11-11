import * as THREE from 'three';
import { getHexCenterPosition } from '../features/home/HexGridLayerDebug';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from '../features/home/CurvedTerrain';

export function createInternationalBordersGroup(): THREE.Group {
  const borderGroup = new THREE.Group();
  borderGroup.name = 'InternationalBordersGroup';

  const borderMaterial = new THREE.LineBasicMaterial({
    color: 0xf59e0b, // Amber border line
    linewidth: 3,
    transparent: true,
    opacity: 0.95,
  });

  // ⚓ 1. Mandated Apex Anchor Hex [-4, 9]
  // We grab its raw coordinate position directly from the engine.
  const northernApexHex = getHexCenterPosition(-4, 9);

  // 🗺️ 2. Boundary Hull Vector sequence anchored relative to northern apex
  // Traces: Punta Gallinas -> Caribbean Coast -> Panama/Pacific -> Amazon -> Orinoco -> Venezuela -> Return
  // Using explicit relative offsets (dx, dy) from the apex guarantees the apex is the absolute highest Y vertex.
  const countryHullOffsets: [number, number][] = [
    [0, 0],       // ⚓ APEX: Locked at [-4, 9] (Punta Gallinas / Northernmost Tip)
    [-12, -8],    // Santa Marta / Barranquilla coastal sweep
    [-25, -18],   // Cartagena & Gulf of Morrosquillo
    [-38, -30],   // Gulf of Urabá / Panama Border Connection
    [-42, -45],   // Chocó / Pacific Coast Northern Start
    [-38, -70],   // Buenaventura / Pacific Coast Central
    [-32, -95],   // Nariño / Tumaco Southwest Coast
    [-22, -112],  // Ecuador Border Tripoint (Ipiales sector)
    [-8, -120],   // Putumayo Amazon Basin Southern Frontier
    [12, -132],   // Leticia Wedge / Southernmost Amazon Tip
    [28, -115],   // Brazilian Border / Vaupés Sector
    [45, -88],    // Mitú / Inírida Eastern Amazonian Bulge
    [52, -58],    // Puerto Carreño / Orinoco River Eastern Apex
    [38, -35],    // Arauca / Venezuelan Llanos Frontier
    [22, -18],    // Cúcuta / Norte de Santander Sector
    [10, -8],     // Serranía del Perijá / Eastern Guajira Base
    [0, 0]        // Close Loop precisely back at [-4, 9] Apex
  ];

  const points: THREE.Vector3[] = [];

  // Determine standard orientation multiplier for vertical curvature
  // If your grid Y increases northward, dy stays positive; if downward, we adjust scale.
  countryHullOffsets.forEach(([dx, dy]) => {
    // Offset directly from the northern apex hex position
    const worldX = northernApexHex.x + dx;
    const worldY = northernApexHex.y + dy;

    // Sample terrain height on flat 2D projection before rotation
    const vz = getCurvatureHeight(worldX, worldY) + 0.35;

    // Apply exact terrain curvature pitch rotation
    const rotatedY = worldY * Math.cos(TERRAIN_ROTATION_X) - vz * Math.sin(TERRAIN_ROTATION_X);
    const rotatedZ = worldY * Math.sin(TERRAIN_ROTATION_X) + vz * Math.cos(TERRAIN_ROTATION_X);

    points.push(new THREE.Vector3(worldX, rotatedY, rotatedZ));
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const borderLine = new THREE.Line(geometry, borderMaterial);
  borderGroup.add(borderLine);

  return borderGroup;
}