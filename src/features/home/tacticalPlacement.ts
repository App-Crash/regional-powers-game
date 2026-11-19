// src/features/home/tacticalPlacement.ts
import * as THREE from 'three';
import { getHexCenterPosition, axialToWorld } from './HexGridLayer';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';

/**
 * Computes the exact surface normal for any axial hex coordinate
 * using your map's curvature and terrain rotation math.
 */
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
 * Places any 3D object/asset onto a specific hex at a given sea-level / altitude offset.
 * Fully encapsulated black-box helper utilizing your exact map projection math.
 */
export function placeAssetAtHex(
  object: THREE.Object3D,
  q: number,
  r: number,
  altitudeOffset: number = 0.0,
  parentContainer?: THREE.Object3D
): THREE.Vector3 {
  if (parentContainer && object.parent !== parentContainer) {
    parentContainer.add(object);
  }

  // 1. Get exact hex center position
  const rawCenter = getHexCenterPosition(q, r);
  const centerPos = new THREE.Vector3(rawCenter.x, rawCenter.y, rawCenter.z);

  // 2. Get surface normal and apply altitude offset along it
  const normal = getHexSurfaceNormal(q, r);
  const finalPos = centerPos.clone().addScaledVector(normal, altitudeOffset);

  object.position.copy(finalPos);

  // 3. Align 3D model's local Z-up (or Y-up) to match surface normal
  // (Using the exact unit vector alignment from your pushHexVerticesToBuffer logic)
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  object.updateMatrixWorld(true);
  return object.position;
}