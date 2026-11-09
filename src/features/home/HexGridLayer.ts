import * as THREE from 'three';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';

const HEX_SIZE = 1.3;
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;

/** Calculates the exact 3D world position centered on a hex coordinate (q, r) */
export function getHexCenterPosition(q: number, r: number): { x: number; y: number; z: number } {
  const wx = HEX_WIDTH * (q + r / 2);
  const wy = (HEX_HEIGHT * 3 / 4) * r;

  const surfaceZ = getCurvatureHeight(wx, wy);
  const rotX = TERRAIN_ROTATION_X;

  const rotatedY = wy * Math.cos(rotX) - surfaceZ * Math.sin(rotX);
  const rotatedZ = wy * Math.sin(rotX) + surfaceZ * Math.cos(rotX);

  return { x: wx, y: wy, z: surfaceZ };
}

export function createHexGridGroup(): THREE.Group {
  const hexGridGroup = new THREE.Group();
  hexGridGroup.name = 'HexGridLayer';

  const edgeMap = new Map<string, [THREE.Vector3, THREE.Vector3]>();
  const key = (p: THREE.Vector3) => `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.z.toFixed(2)}`;

  // 1. Generate deduplicated shared border edges across expanded ~30x30 map grid
  for (let q = -17; q <= 17; q++) {
    for (let r = -17; r <= 17; r++) {
      if (Math.abs(q + r) > 17) continue;

      const wx = HEX_WIDTH * (q + r / 2);
      const wy = (HEX_HEIGHT * 3 / 4) * r;

      if (Math.hypot(wx, wy) > 37) continue;

      const surfaceZ = getCurvatureHeight(wx, wy);
      const rotX = TERRAIN_ROTATION_X;

      const localVerts: THREE.Vector3[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const vx = wx + HEX_SIZE * Math.cos(angle);
        const vy = wy + HEX_SIZE * Math.sin(angle);
        const vz = getCurvatureHeight(vx, vy);

        const rotatedY = vy * Math.cos(rotX) - vz * Math.sin(rotX);
        const rotatedZ = vy * Math.sin(rotX) + vz * Math.cos(rotX);
        localVerts.push(new THREE.Vector3(vx, rotatedY, rotatedZ + 0.03));
      }

      for (let i = 0; i < 6; i++) {
        const p1 = localVerts[i];
        const p2 = localVerts[(i + 1) % 6];
        const k1 = key(p1);
        const k2 = key(p2);
        const edgeKey = k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;

        if (!edgeMap.has(edgeKey)) {
          edgeMap.set(edgeKey, [p1, p2]);
        }
      }

      // Invisible Mesh Collider for robust raycast click detection
      const hitGeom = new THREE.CylinderGeometry(HEX_SIZE * 0.95, HEX_SIZE * 0.95, 0.1, 6);
      hitGeom.rotateY(Math.PI / 6);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeom, hitMat);

      const rotatedCenterY = wy * Math.cos(rotX) - surfaceZ * Math.sin(rotX);
      const rotatedCenterZ = wy * Math.sin(rotX) + surfaceZ * Math.cos(rotX);
      hitMesh.position.set(wx, rotatedCenterY, rotatedCenterZ + 0.02);
      hitMesh.rotation.x = rotX;
      hitMesh.userData = { id: `hex_${q}_${r}`, type: 'hex', q, r, wx, wy };

      hexGridGroup.add(hitMesh);
    }
  }

  // 2. Render Shared Borders with Neutral Dark Gray Lines (#334155)
  const linePositions: number[] = [];
  edgeMap.forEach(([p1, p2]) => {
    linePositions.push(p1.x, p1.y, p1.z);
    linePositions.push(p2.x, p2.y, p2.z);
  });

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x334155, // Neutral Slate / Dark Gray
    transparent: true,
    opacity: 0.65,
  });

  const gridLines = new THREE.LineSegments(lineGeo, lineMat);
  gridLines.name = 'SharedHexLines';
  hexGridGroup.add(gridLines);

  return hexGridGroup;
}

/** Creates a bright selection highlight outline for a chosen hex */
export function createHexHighlightMesh(q: number, r: number): THREE.LineLoop {
  const wx = HEX_WIDTH * (q + r / 2);
  const wy = (HEX_HEIGHT * 3 / 4) * r;
  const rotX = TERRAIN_ROTATION_X;

  const points: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const vx = wx + HEX_SIZE * Math.cos(angle);
    const vy = wy + HEX_SIZE * Math.sin(angle);
    const vz = getCurvatureHeight(vx, vy);

    const rotatedY = vy * Math.cos(rotX) - vz * Math.sin(rotX);
    const rotatedZ = vy * Math.sin(rotX) + vz * Math.cos(rotX);
    points.push(new THREE.Vector3(vx, rotatedY, rotatedZ + 0.05));
  }

  const highlightGeo = new THREE.BufferGeometry().setFromPoints(points);
  const highlightMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    linewidth: 2,
  });

  const highlightLoop = new THREE.LineLoop(highlightGeo, highlightMat);
  highlightLoop.name = 'HexHighlight';
  return highlightLoop;
}