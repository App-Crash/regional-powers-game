import * as THREE from 'three';

export const CURVATURE_COEFF = -0.0035;
export const TERRAIN_ROTATION_X = -Math.PI / 3;

export function getCurvatureHeight(x: number, y: number): number {
  return CURVATURE_COEFF * (x * x + y * y);
}

export function alignToSurfaceNormal(
  obj: THREE.Object3D, 
  worldX: number, 
  worldY: number
): void {
  const surfaceZ = getCurvatureHeight(worldX, worldY);
  const rotX = TERRAIN_ROTATION_X;

  // Position accounting for terrain rotation
  const rotatedY = worldY * Math.cos(rotX) - surfaceZ * Math.sin(rotX);
  const rotatedZ = worldY * Math.sin(rotX) + surfaceZ * Math.cos(rotX);
  obj.position.set(worldX, rotatedY, rotatedZ);

  // Surface normal calculation for 90-degree penetration
  const dz_dx = 2 * CURVATURE_COEFF * worldX;
  const dz_dy = 2 * CURVATURE_COEFF * worldY;
  const localNormal = new THREE.Vector3(-dz_dx, -dz_dy, 1).normalize();
  localNormal.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
  
  obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), localNormal);
}