import * as THREE from 'three';
import { getHexCenterPosition, axialToWorld } from '../home/HexGridLayer';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from '../home/CurvedTerrain';

export interface HaloHexEntry {
  q: number;
  r: number;
  cost: number;
  isWithinOrganic: boolean;
}

/**
 * Computes axial distance between two hexes.
 */
export function axialDistance(q1: number, r1: number, q2: number, r2: number): number {
  return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
}

/**
 * Computes all reachable hexes within organic and total range.
 */
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

/**
 * Renders range halos and unit markers flush with the curved terrain using correct hex sizing
 * and analytical height gradients.
 */
export function renderUnitAndHaloLayer(
  haloGroup: THREE.Group,
  unitMarkerPos: { q: number; r: number } | null,
  haloHexes: HaloHexEntry[],
  selectedDestPos: { q: number; r: number } | null
) {
  // Thoroughly dispose of previous meshes, geometries, and materials to prevent stale highlights
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

  // Compute exact surface normal matching CurvedTerrain geometry transformation
  const getCurvedSurfaceNormal = (q: number, r: number) => {
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
  };

  // 1. Render Range Halo Hexes (Corrected hex-proportioned sizing: 0.75 - 0.95)
  haloHexes.forEach((hex) => {
    const center = getHexCenterPosition(hex.q, hex.r);
    const normal = getCurvedSurfaceNormal(hex.q, hex.r);
    const elevation = 0.08;

    const geo = new THREE.RingGeometry(0.75, 0.95, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: hex.isWithinOrganic ? 0x38bdf8 : 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      center.x + normal.x * elevation,
      center.y + normal.y * elevation,
      center.z + normal.z * elevation
    );
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    haloGroup.add(mesh);
  });

  // 2. Render Active Unit Marker (Corrected sizing: 0.85 - 1.05)
  if (unitMarkerPos) {
    const center = getHexCenterPosition(unitMarkerPos.q, unitMarkerPos.r);
    const normal = getCurvedSurfaceNormal(unitMarkerPos.q, unitMarkerPos.r);
    const elevation = 0.1;

    const geo = new THREE.RingGeometry(0.85, 1.05, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      center.x + normal.x * elevation,
      center.y + normal.y * elevation,
      center.z + normal.z * elevation
    );
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    haloGroup.add(mesh);
  }

  // 3. Render Selected Destination Ring (Corrected sizing: 0.85 - 1.05)
  if (selectedDestPos) {
    const center = getHexCenterPosition(selectedDestPos.q, selectedDestPos.r);
    const normal = getCurvedSurfaceNormal(selectedDestPos.q, selectedDestPos.r);
    const elevation = 0.12;

    const geo = new THREE.RingGeometry(0.85, 1.05, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      center.x + normal.x * elevation,
      center.y + normal.y * elevation,
      center.z + normal.z * elevation
    );
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    haloGroup.add(mesh);
  }
}