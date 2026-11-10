import * as THREE from 'three';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';
import { generateHexDataMap, type HexData, type FactionControl } from './HexDataModel';

const HEX_SIZE = 1.3;
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;

export const GLOBAL_HEX_DATA = generateHexDataMap(HEX_WIDTH, HEX_HEIGHT);

export function getHexCenterPosition(q: number, r: number): { x: number; y: number; z: number } {
  const wx = HEX_WIDTH * (q + r / 2);
  const wy = (HEX_HEIGHT * 3 / 4) * r;
  const surfaceZ = getCurvatureHeight(wx, wy);
  const rotX = TERRAIN_ROTATION_X;

  const rotatedY = wy * Math.cos(rotX) - surfaceZ * Math.sin(rotX);
  const rotatedZ = wy * Math.sin(rotX) + surfaceZ * Math.cos(rotX);

  return { x: wx, y: rotatedY, z: rotatedZ };
}

const CONTROL_COLORS: Record<NonNullable<FactionControl>, number> = {
  player: 0x38bdf8,  // Blue (Friendly / Player)
  enemy: 0xef4444,   // Red (Enemy)
  neutral: 0x64748b, // Grey (Neutral)
  ally: 0x22c55e,    // Green (Allied Nations)
};

export function createHexGridGroup(): { gridGroup: THREE.Group; controlGroup: THREE.Group } {
  const gridGroup = new THREE.Group();
  gridGroup.name = 'HexGridLayer';

  const controlGroup = new THREE.Group();
  controlGroup.name = 'PoliticalControlLayer';

  const edgeMap = new Map<string, [THREE.Vector3, THREE.Vector3]>();
  const key = (p: THREE.Vector3) => `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.z.toFixed(2)}`;

  const hexShape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const hx = (HEX_SIZE * 0.94) * Math.cos(angle);
    const hy = (HEX_SIZE * 0.94) * Math.sin(angle);
    if (i === 0) hexShape.moveTo(hx, hy);
    else hexShape.lineTo(hx, hy);
  }
  const hexGeo = new THREE.ShapeGeometry(hexShape);

  GLOBAL_HEX_DATA.forEach((hex) => {
    const { wx, wy, controlledBy } = hex;
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

    // Render political control overlay ONLY if hex is claimed by a faction (excludes water / null)
    if (controlledBy !== null) {
      const controlMat = new THREE.MeshBasicMaterial({
        color: CONTROL_COLORS[controlledBy],
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
      });
      const controlMesh = new THREE.Mesh(hexGeo, controlMat);
      const rotatedCenterY = wy * Math.cos(rotX) - surfaceZ * Math.sin(rotX);
      const rotatedCenterZ = wy * Math.sin(rotX) + surfaceZ * Math.cos(rotX);
      controlMesh.position.set(wx, rotatedCenterY, rotatedCenterZ + 0.015);
      controlMesh.rotation.x = rotX;
      controlGroup.add(controlMesh);
    }
  });

  const linePositions: number[] = [];
  edgeMap.forEach(([p1, p2]) => {
    linePositions.push(p1.x, p1.y, p1.z);
    linePositions.push(p2.x, p2.y, p2.z);
  });

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x334155,
    transparent: true,
    opacity: 0.65,
  });

  const gridLines = new THREE.LineSegments(lineGeo, lineMat);
  gridGroup.add(gridLines);

  const planeGeo = new THREE.PlaneGeometry(80, 45);
  const planeMat = new THREE.MeshBasicMaterial({ visible: false });
  const raycastPlane = new THREE.Mesh(planeGeo, planeMat);
  raycastPlane.name = 'HexRaycastPlane';
  raycastPlane.rotation.x = TERRAIN_ROTATION_X;
  gridGroup.add(raycastPlane);

  gridGroup.add(controlGroup);
  return { gridGroup, controlGroup };
}

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

  return new THREE.LineLoop(highlightGeo, highlightMat);
}