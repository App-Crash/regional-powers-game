// src/features/weapons/WeaponAssetBuilder.ts
import * as THREE from 'three';

export type WeaponAssetKind = 'atgm' | 's300' | 'cruise_missile';

export type WeaponLaunchPhase = 'STOWED' | 'EJECTION' | 'DEPLOYMENT' | 'CRUISE';

export interface WeaponAssetRig {
  group: THREE.Group;
  setLaunchPhase: (phase: WeaponLaunchPhase) => void;
  setWingDeployment: (progress: number) => void;
  dispose: () => void;
}

export function createWeaponAsset(weaponType: WeaponAssetKind): WeaponAssetRig {
  const group = new THREE.Group();
  group.name = `weapon_asset_${weaponType}`;

  const bodyGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 12);
  bodyGeo.rotateX(Math.PI / 2);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: weaponType === 's300' ? 0x475569 : weaponType === 'atgm' ? 0x3f6212 : 0xe2e8f0,
    metalness: 0.65,
    roughness: 0.35,
  });

  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.name = `weapon_body_${weaponType}`;
  group.add(bodyMesh);

  const leftWingGeo = new THREE.BoxGeometry(0.24, 0.012, 0.14);
  const rightWingGeo = new THREE.BoxGeometry(0.24, 0.012, 0.14);
  const leftWing = new THREE.Mesh(leftWingGeo, bodyMat);
  const rightWing = new THREE.Mesh(rightWingGeo, bodyMat);
  leftWing.position.set(-0.14, 0, 0);
  rightWing.position.set(0.14, 0, 0);
  leftWing.scale.set(0.001, 1, 1);
  rightWing.scale.set(0.001, 1, 1);
  group.add(leftWing, rightWing);

  const setWingDeployment = (progress: number): void => {
    const clamped = THREE.MathUtils.clamp(progress, 0, 1);
    const wingScale = THREE.MathUtils.lerp(0.001, 1.0, clamped);
    leftWing.scale.set(wingScale, 1, 1);
    rightWing.scale.set(wingScale, 1, 1);
  };

  const setLaunchPhase = (phase: WeaponLaunchPhase): void => {
    group.userData.launchPhase = phase;
    if (phase === 'STOWED' || phase === 'EJECTION') {
      setWingDeployment(0);
    } else if (phase === 'CRUISE') {
      setWingDeployment(1);
    }
  };

  const dispose = (): void => {
    bodyGeo.dispose();
    leftWingGeo.dispose();
    rightWingGeo.dispose();
    bodyMat.dispose();
  };

  return {
    group,
    setLaunchPhase,
    setWingDeployment,
    dispose,
  };
}