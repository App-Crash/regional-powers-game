import * as THREE from 'three';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';

const HEX_SIZE = 1.3;
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;

export function axialToWorld(q: number, r: number): { wx: number; wy: number } {
  const wx = HEX_WIDTH * (q + r / 2);
  const wy = ((HEX_HEIGHT * 3) / 4) * r;
  return { wx, wy };
}

export function getHexCenterPosition(q: number, r: number): THREE.Vector3 {
  const { wx, wy } = axialToWorld(q, r);
  const surfaceZ = getCurvatureHeight(wx, wy);
  const rotX = TERRAIN_ROTATION_X;

  const rotatedY = wy * Math.cos(rotX) - surfaceZ * Math.sin(rotX);
  const rotatedZ = wy * Math.sin(rotX) + surfaceZ * Math.cos(rotX);

  return new THREE.Vector3(wx, rotatedY, rotatedZ);
}

export function getHexSurfaceNormal(q: number, r: number): THREE.Vector3 {
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
 * Creates a mesh positioned and rotated flush with the curved terrain surface normal.
 */
export function createTangentAlignedMesh(
  q: number,
  r: number,
  elevation: number,
  geometry: THREE.BufferGeometry,
  material: THREE.Material
): THREE.Mesh {
  const center = getHexCenterPosition(q, r);
  const normal = getHexSurfaceNormal(q, r);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    center.x + normal.x * elevation,
    center.y + normal.y * elevation,
    center.z + normal.z * elevation
  );
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  return mesh;
}