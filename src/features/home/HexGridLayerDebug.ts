import * as THREE from 'three';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';
import { generateHexDataMap } from './HexDataModel';
import { type HexData, type FactionControl } from './HexTypes';

console.log('🚨 [HexGridLayerDebug.ts] MODULE LOADED & EXECUTING AT TOP LEVEL 🚨');

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
  player: 0x38bdf8,  // Blue
  enemy: 0xef4444,   // Red
  neutral: 0x64748b, // Grey
  ally: 0x22c55e,    // Green
};

export function updatePoliticalControlGroup(
  controlGroup: THREE.Group,
  hexDataMap: Map<string, HexData> = GLOBAL_HEX_DATA
) {
  controlGroup.clear();

  const factionPositions: Record<string, number[]> = {
    player: [],
    enemy: [],
    neutral: [],
    ally: [],
  };

  hexDataMap.forEach((hex) => {
    const { wx, wy, controlledBy } = hex;
    
    if (controlledBy === null || !(controlledBy in factionPositions)) {
      return;
    }

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

    const targetBuffer = factionPositions[controlledBy];
    for (let i = 0; i < 6; i++) {
      const v1 = localVerts[i];
      const v2 = localVerts[(i + 1) % 6];

      targetBuffer.push(centerPos.x, centerPos.y, centerPos.z);
      targetBuffer.push(v1.x, v1.y, v1.z);
      targetBuffer.push(v2.x, v2.y, v2.z);
    }
  });

  Object.entries(factionPositions).forEach(([faction, positions]) => {
    if (positions.length === 0) return;

    const controlGeo = new THREE.BufferGeometry();
    controlGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    controlGeo.computeVertexNormals();

    const controlMat = new THREE.MeshBasicMaterial({
      color: CONTROL_COLORS[faction as NonNullable<FactionControl>],
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

export function createHexGridGroup(): { gridGroup: THREE.Group; controlGroup: THREE.Group } {
  console.log('✨ [HexGridLayerDebug] createHexGridGroup() CALLED ✨');

  const gridGroup = new THREE.Group();
  gridGroup.name = 'HexGridLayerDebug_Group';

  const controlGroup = new THREE.Group();
  controlGroup.name = 'PoliticalControlLayerDebug';

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

  console.log(`✅ [HexGridLayerDebug] Successfully injected ${hitMeshCount} pickable hit meshes.`);

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
  gridGroup.add(controlGroup);

  console.log(`📦 [HexGridLayerDebug] Final gridGroup children count:`, gridGroup.children.length);

  return { gridGroup, controlGroup };
}

export function createHexHighlightMesh(q: number, r: number): THREE.Mesh {
  const wx = HEX_WIDTH * (q + r / 2);
  const wy = (HEX_HEIGHT * 3 / 4) * r;
  const rotX = TERRAIN_ROTATION_X;

  const localVerts: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const vx = wx + (HEX_SIZE * 0.96) * Math.cos(angle);
    const vy = wy + (HEX_SIZE * 0.96) * Math.sin(angle);
    const vz = getCurvatureHeight(vx, vy);

    const rotatedY = vy * Math.cos(rotX) - vz * Math.sin(rotX);
    const rotatedZ = vy * Math.sin(rotX) + vz * Math.cos(rotX);
    localVerts.push(new THREE.Vector3(vx, rotatedY, rotatedZ + 0.05));
  }

  const centerZ = getCurvatureHeight(wx, wy);
  const rotatedCenterY = wy * Math.cos(rotX) - centerZ * Math.sin(rotX);
  const rotatedCenterZ = wy * Math.sin(rotX) + centerZ * Math.cos(rotX);
  const centerPos = new THREE.Vector3(wx, rotatedCenterY, rotatedCenterZ + 0.04);

  const highlightPositions: number[] = [];
  for (let i = 0; i < 6; i++) {
    const v1 = localVerts[i];
    const v2 = localVerts[(i + 1) % 6];
    highlightPositions.push(centerPos.x, centerPos.y, centerPos.z);
    highlightPositions.push(v1.x, v1.y, v1.z);
    highlightPositions.push(v2.x, v2.y, v2.z);
  }

  const highlightGeo = new THREE.BufferGeometry();
  highlightGeo.setAttribute('position', new THREE.Float32BufferAttribute(highlightPositions, 3));

  const highlightMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false,
  });

  const highlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
  highlightMesh.renderOrder = 99;
  return highlightMesh;
}