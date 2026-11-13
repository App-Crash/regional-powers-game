import * as THREE from 'three';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';
import { gameApi } from '../../services/gameApi';
import { type HexData, type DiplomaticStance } from './HexTypes';

const HEX_SIZE = 1.3;
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;

export const GLOBAL_HEX_DATA = new Map<string, HexData>();

// Single source of truth for axial (q, r) -> world (wx, wy) projection
export function axialToWorld(q: number, r: number): { wx: number; wy: number } {
  const wx = HEX_WIDTH * (q + r / 2);
  const wy = ((HEX_HEIGHT * 3) / 4) * r;
  return { wx, wy };
}

export function getHexCenterPosition(q: number, r: number): { x: number; y: number; z: number } {
  const { wx, wy } = axialToWorld(q, r);
  const surfaceZ = getCurvatureHeight(wx, wy);
  const rotX = TERRAIN_ROTATION_X;

  const rotatedY = wy * Math.cos(rotX) - surfaceZ * Math.sin(rotX);
  const rotatedZ = wy * Math.sin(rotX) + surfaceZ * Math.cos(rotX);

  return { x: wx, y: rotatedY, z: rotatedZ };
}

const STANCE_COLORS: Record<DiplomaticStance, number> = {
  player: 0x38bdf8,   // Blue
  enemy: 0xef4444,    // Red
  neutral: 0x64748b,  // Grey
  friendly: 0x22c55e, // Green
};

export function updatePoliticalControlGroup(
  controlGroup: THREE.Group,
  hexDataMap: Map<string, HexData> = GLOBAL_HEX_DATA
) {
  controlGroup.clear();

  const stancePositions: Record<DiplomaticStance, number[]> = {
    player: [],
    enemy: [],
    neutral: [],
    friendly: [],
  };

  hexDataMap.forEach((hex) => {
    const { q, r, fac_ctl } = hex;

    if (fac_ctl === null || fac_ctl === undefined) {
      return;
    }

    const stance = gameApi.resolveFactionStance(fac_ctl);
    if (!(stance in stancePositions)) {
      return;
    }

    // Compute wx, wy directly from q, r so control overlay matches city & hit meshes
    const { wx, wy } = axialToWorld(q, r);

    const rotX = TERRAIN_ROTATION_X;
    const localVerts: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const vx = wx + (HEX_SIZE * 0.94) * Math.cos(angle);
      const vy = wy + (HEX_SIZE * 0.94) * Math.sin(angle);
      const vz = getCurvatureHeight(vx, vy);

      const rotatedY = vy * Math.cos(rotX) - vz * Math.sin(rotX);
      const rotatedZ = vy * Math.sin(rotX) + vz * Math.cos(rotX);
      localVerts.push(new THREE.Vector3(vx, rotatedY, rotatedZ + 0.04));
    }

    const centerZ = getCurvatureHeight(wx, wy);
    const rotatedCenterY = wy * Math.cos(rotX) - centerZ * Math.sin(rotX);
    const rotatedCenterZ = wy * Math.sin(rotX) + centerZ * Math.cos(rotX);
    const centerPos = new THREE.Vector3(wx, rotatedCenterY, rotatedCenterZ + 0.02);

    const targetBuffer = stancePositions[stance];
    for (let i = 0; i < 6; i++) {
      const v1 = localVerts[i];
      const v2 = localVerts[(i + 1) % 6];

      targetBuffer.push(centerPos.x, centerPos.y, centerPos.z);
      targetBuffer.push(v1.x, v1.y, v1.z);
      targetBuffer.push(v2.x, v2.y, v2.z);
    }
  });

  Object.entries(stancePositions).forEach(([stance, positions]) => {
    if (positions.length === 0) return;

    const controlGeo = new THREE.BufferGeometry();
    controlGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    controlGeo.computeVertexNormals();

    const controlMat = new THREE.MeshBasicMaterial({
      color: STANCE_COLORS[stance as DiplomaticStance],
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const controlMesh = new THREE.Mesh(controlGeo, controlMat);
    controlMesh.renderOrder = 2;
    controlGroup.add(controlMesh);
  });
}

export function rebuildHexGridFromData(
  gridGroup: THREE.Group,
  controlGroup: THREE.Group,
  hexList: HexData[]
) {
  GLOBAL_HEX_DATA.clear();
  hexList.forEach((hex) => {
    // Normalize wx, wy on hydration so every consumer shares identical coordinates
    const { wx, wy } = axialToWorld(hex.q, hex.r);
    GLOBAL_HEX_DATA.set(`${hex.q},${hex.r}`, { ...hex, wx, wy });
  });

  for (let i = gridGroup.children.length - 1; i >= 0; i--) {
    const child = gridGroup.children[i];
    if (child !== controlGroup) {
      gridGroup.remove(child);
    }
  }

  const edgeMap = new Map<string, [THREE.Vector3, THREE.Vector3]>();
  const key = (p: THREE.Vector3) => `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.z.toFixed(2)}`;

  let hitMeshCount = 0;

  GLOBAL_HEX_DATA.forEach((hex) => {
    const { wx, wy } = hex;
    const rotX = TERRAIN_ROTATION_X;

    const localVerts: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const vx = wx + HEX_SIZE * Math.cos(angle);
      const vy = wy + HEX_SIZE * Math.sin(angle);
      const vz = getCurvatureHeight(vx, vy);

      const rotatedY = vy * Math.cos(rotX) - vz * Math.sin(rotX);
      const rotatedZ = vy * Math.sin(rotX) + vz * Math.cos(rotX);
      localVerts.push(new THREE.Vector3(vx, rotatedY, rotatedZ));
    }

    const centerZ = getCurvatureHeight(wx, wy);
    const rotatedCenterY = wy * Math.cos(rotX) - centerZ * Math.sin(rotX);
    const rotatedCenterZ = wy * Math.sin(rotX) + centerZ * Math.cos(rotX);
    const centerPos = new THREE.Vector3(wx, rotatedCenterY, rotatedCenterZ);

    const hitGeo = new THREE.BufferGeometry();
    const hitPositions: number[] = [];
    for (let i = 0; i < 6; i++) {
      const v1 = localVerts[i];
      const v2 = localVerts[(i + 1) % 6];
      hitPositions.push(centerPos.x, centerPos.y, centerPos.z);
      hitPositions.push(v1.x, v1.y, v1.z);
      hitPositions.push(v2.x, v2.y, v2.z);
    }
    hitGeo.setAttribute('position', new THREE.Float32BufferAttribute(hitPositions, 3));

    const hitMat = new THREE.MeshBasicMaterial({
      visible: false,
      side: THREE.DoubleSide
    });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.userData = { hexData: hex };

    gridGroup.add(hitMesh);
    hitMeshCount++;

    const lineVerts = localVerts.map(v => new THREE.Vector3(v.x, v.y, v.z + 0.03));
    for (let i = 0; i < 6; i++) {
      const p1 = lineVerts[i];
      const p2 = lineVerts[(i + 1) % 6];
      const k1 = key(p1);
      const k2 = key(p2);
      const edgeKey = k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;

      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, [p1, p2]);
      }
    }
  });

  updatePoliticalControlGroup(controlGroup, GLOBAL_HEX_DATA);

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
    depthWrite: false,
  });

  const gridLines = new THREE.LineSegments(lineGeo, lineMat);
  gridLines.renderOrder = 2;
  gridGroup.add(gridLines);

  if (!gridGroup.children.includes(controlGroup)) {
    gridGroup.add(controlGroup);
  }

  console.log(`[HexGridLayer] Rebuilt ${hitMeshCount} aligned hex meshes from gameApi.`);
}

export function createHexGridGroup(): { gridGroup: THREE.Group; controlGroup: THREE.Group } {
  const gridGroup = new THREE.Group();
  gridGroup.name = 'HexGridLayer';

  const controlGroup = new THREE.Group();
  controlGroup.name = 'PoliticalControlLayer';
  gridGroup.add(controlGroup);

  gameApi.getRuntimeTheater().then((theaterHexes) => {
    rebuildHexGridFromData(gridGroup, controlGroup, theaterHexes);
  });

  return { gridGroup, controlGroup };
}

export function createHexHighlightMesh(q: number, r: number): THREE.LineLoop {
  const { wx, wy } = axialToWorld(q, r);
  const rotX = TERRAIN_ROTATION_X;

  const points: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const vx = wx + HEX_SIZE * Math.cos(angle);
    const vy = wy + HEX_SIZE * Math.sin(angle);
    const vz = getCurvatureHeight(vx, vy);

    const rotatedY = vy * Math.cos(rotX) - vz * Math.sin(rotX);
    const rotatedZ = vy * Math.sin(rotX) + vz * Math.cos(rotX);
    points.push(new THREE.Vector3(vx, rotatedY, rotatedZ + 0.06));
  }

  const highlightGeo = new THREE.BufferGeometry().setFromPoints(points);
  const highlightMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    linewidth: 3,
    depthWrite: false,
  });

  const highlightMesh = new THREE.LineLoop(highlightGeo, highlightMat);
  highlightMesh.renderOrder = 3;
  return highlightMesh;
}