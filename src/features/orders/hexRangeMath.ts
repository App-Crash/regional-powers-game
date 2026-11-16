import * as THREE from 'three';
import { getHexCenterPosition, axialToWorld } from '../home/HexGridLayer';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from '../home/CurvedTerrain';

const HEX_SIZE = 1.3;

export interface HaloHexEntry {
  q: number;
  r: number;
  cost: number;
  isWithinOrganic: boolean;
}

export function axialDistance(q1: number, r1: number, q2: number, r2: number): number {
  return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
}

export function computeRangeHaloHexes(
  unitQ: number,
  unitR: number,
  organicRange: number,
  totalRange: number
): HaloHexEntry[] {
  const results: HaloHexEntry[] = [];
  const visited = new Set<string>();
  const queue: Array<{ q: number; r: number; dist: number }> = [{ q: unitQ, r: unitR, dist: 0 }];

  visited.add(`${unitQ},${unitR}`);

  const directions = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr.dist > 0) {
      results.push({
        q: curr.q,
        r: curr.r,
        cost: curr.dist,
        isWithinOrganic: curr.dist <= organicRange,
      });
    }

    if (curr.dist < totalRange) {
      for (const d of directions) {
        const nq = curr.q + d.q;
        const nr = curr.r + d.r;
        const key = `${nq},${nr}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ q: nq, r: nr, dist: curr.dist + 1 });
        }
      }
    }
  }

  return results;
}

// Compute exact surface normal matching HexGridLayer's tangent alignment
function getHexSurfaceNormal(q: number, r: number): THREE.Vector3 {
  const { wx, wy } = axialToWorld(q, r);
  const eps = 0.05;
  const h0 = getCurvatureHeight(wx, wy);
  const hX = getCurvatureHeight(wx + eps, wy);
  const hY = getCurvatureHeight(wx, wy + eps);

  const dHx = (hX - h0) / eps;
  const dHy = (hY - h0) / eps;

  const nx = -dHx;
  const ny = -dHy;
  const nz = 1.0;

  const rotX = TERRAIN_ROTATION_X;
  const cosR = Math.cos(rotX);
  const sinR = Math.sin(rotX);

  const rx = nx;
  const ry = ny * cosR - nz * sinR;
  const rz = ny * sinR + nz * cosR;

  return new THREE.Vector3(rx, ry, rz).normalize();
}

/**
 * Appends world-space triangle vertex positions for a single hex into a target position array,
 * exactly matching how HexGridLayer builds political control and hit meshes.
 */
function pushHexVerticesToBuffer(
  q: number,
  r: number,
  elevation: number,
  targetBuffer: number[]
) {
  const rawCenter = getHexCenterPosition(q, r);
  const centerPos = new THREE.Vector3(rawCenter.x, rawCenter.y, rawCenter.z);
  const normal = getHexSurfaceNormal(q, r);
  const centerLifted = centerPos.clone().addScaledVector(normal, elevation);

  const qRot = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  const localVerts: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const vx = (HEX_SIZE * 0.92) * Math.cos(angle);
    const vy = (HEX_SIZE * 0.92) * Math.sin(angle);
    const offset = new THREE.Vector3(vx, vy, 0).applyQuaternion(qRot);
    localVerts.push(centerPos.clone().add(offset).addScaledVector(normal, elevation));
  }

  for (let i = 0; i < 6; i++) {
    const v1 = localVerts[i];
    const v2 = localVerts[(i + 1) % 6];
    targetBuffer.push(centerLifted.x, centerLifted.y, centerLifted.z);
    targetBuffer.push(v1.x, v1.y, v1.z);
    targetBuffer.push(v2.x, v2.y, v2.z);
  }
}

export function renderUnitAndHaloLayer(
  haloGroup: THREE.Group,
  unitMarkerPos: { q: number; r: number } | null,
  haloHexes: HaloHexEntry[],
  selectedDestPos: { q: number; r: number } | null
) {
  haloGroup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
  haloGroup.clear();

  // Separate buffers for organic range, extended range, unit marker, and destination ring
  const organicPositions: number[] = [];
  const extendedPositions: number[] = [];
  const markerPositions: number[] = [];
  const destPositions: number[] = [];

  // 1. Populate Range Halo Hexes
  haloHexes.forEach((hex) => {
    if (hex.isWithinOrganic) {
      pushHexVerticesToBuffer(hex.q, hex.r, 0.08, organicPositions);
    } else {
      pushHexVerticesToBuffer(hex.q, hex.r, 0.08, extendedPositions);
    }
  });

  // 2. Populate Active Unit Marker
  if (unitMarkerPos) {
    pushHexVerticesToBuffer(unitMarkerPos.q, unitMarkerPos.r, 0.10, markerPositions);
  }

  // 3. Populate Selected Destination Ring
  if (selectedDestPos) {
    pushHexVerticesToBuffer(selectedDestPos.q, selectedDestPos.r, 0.12, destPositions);
  }

  // Helper to build and attach consolidated meshes (matching HexGridLayer architecture)
  const createLayerMesh = (positions: number[], color: number, opacity: number, renderOrder: number) => {
    if (positions.length === 0) return;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();

    const mat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity,
      depthWrite: false,
      depthTest: true,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = renderOrder;
    mesh.frustumCulled = false; // Prevents camera rotation culling
    haloGroup.add(mesh);
  };

  createLayerMesh(organicPositions, 0x38bdf8, 0.55, 5);
  createLayerMesh(extendedPositions, 0xfbbf24, 0.55, 5);
  createLayerMesh(markerPositions, 0x0284c7, 0.85, 6);
  createLayerMesh(destPositions, 0x22c55e, 0.90, 7);
}