// src/features/home/HexUnitStackLayer.ts
// Planning / Garrison Layer: Renders tabletop NATO chip stacks per hex for
// formation/unit presence and selection. Units include support/command overhead
// and are distinct from animation equipment (specific hardware/platforms bound
// during battle replays or shown in garage/research views).

import * as THREE from 'three';
import { getHexCenterPosition, axialToWorld } from './HexGridLayer';
import { getCurvatureHeight } from './CurvedTerrain';
import { type CombatUnit } from '../../types/unitOrders';

export function createUnitStackMeshes(
  stackGroup: THREE.Group,
  units: CombatUnit[],
  selectedUnitId: string | null
) {
  stackGroup.clear();

  const hexMap = new Map<string, CombatUnit[]>();
  units.forEach((u) => {
    const key = `${u.q},${u.r}`;
    const list = hexMap.get(key) || [];
    list.push(u);
    hexMap.set(key, list);
  });

  hexMap.forEach((hexUnits, key) => {
    const [qStr, rStr] = key.split(',');
    const q = parseInt(qStr, 10);
    const r = parseInt(rStr, 10);
    const center = getHexCenterPosition(q, r);

    // Calculate local surface normal alignment on the curved Earth
    const { wx, wy } = axialToWorld(q, r);
    const eps = 0.1;
    const zCenter = getCurvatureHeight(wx, wy);
    const zDx = getCurvatureHeight(wx + eps, wy);
    const zDy = getCurvatureHeight(wx, wy + eps);

    const vTangentX = new THREE.Vector3(eps, 0, zDx - zCenter).normalize();
    const vTangentY = new THREE.Vector3(0, eps, zDy - zCenter).normalize();
    const surfaceNormal = new THREE.Vector3().crossVectors(vTangentX, vTangentY).normalize();

    hexUnits.forEach((unit, index) => {
      const isSelected = unit.id === selectedUnitId;
      const heightOffset = 0.45 + index * 0.15;

      const chipGeo = new THREE.BoxGeometry(0.85, 0.5, 0.08);
      const chipMat = new THREE.MeshStandardMaterial({
        color: unit.faction === 'col' ? (isSelected ? 0x38bdf8 : 0x0f172a) : 0x991b1b,
        emissive: unit.faction === 'col' ? (isSelected ? 0x0284c7 : 0x000000) : 0x450a0a,
        roughness: 0.3,
        metalness: 0.4,
      });

      const chipMesh = new THREE.Mesh(chipGeo, chipMat);

      // Position along surface normal vector
      chipMesh.position.set(
        center.x + surfaceNormal.x * heightOffset,
        center.y + surfaceNormal.y * heightOffset,
        center.z + surfaceNormal.z * heightOffset
      );

      // Align rotation matrix to surface normal
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        surfaceNormal
      );
      chipMesh.quaternion.copy(targetQuaternion);
      chipMesh.renderOrder = 25 + index;

      stackGroup.add(chipMesh);
    });
  });
}