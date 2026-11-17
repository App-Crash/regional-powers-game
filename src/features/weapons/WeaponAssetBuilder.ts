// src/features/weapons/WeaponAssetBuilder.ts
import * as THREE from 'three';

export interface WeaponAssetRig {
  rootGroup: THREE.Group;
  leftWingPivot: THREE.Group;
  rightWingPivot: THREE.Group;
  coldLaunchVapor: THREE.Mesh;
  sustainerFlame: THREE.Mesh;
  setWingDeployment: (alpha: number) => void; // 0 = fully stowed (flush), 1 = fully deployed
  setLaunchPhase: (phase: 'STOWED' | 'EJECTION' | 'DEPLOYMENT' | 'CRUISE') => void;
}

export function createWeaponAsset(weaponType: 'atgm' | 's300' | 'cruise_missile'): WeaponAssetRig {
  const rootGroup = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });

  // Fuselage body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), bodyMat);
  body.rotation.x = Math.PI / 2;

  // Warhead / Nose cone
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.04, 0.15, 8),
    new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 })
  );
  nose.rotation.x = Math.PI / 2;
  nose.position.z = 0.32;

  // Articulated Wing Pivots (Allows folding flush inside tube/rail)
  const leftWingPivot = new THREE.Group();
  leftWingPivot.position.set(-0.02, 0, 0.05);
  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 0.16), bodyMat);
  leftWing.position.set(-0.16, 0, 0);
  leftWingPivot.add(leftWing);

  const rightWingPivot = new THREE.Group();
  rightWingPivot.position.set(0.02, 0, 0.05);
  const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 0.16), bodyMat);
  rightWing.position.set(0.16, 0, 0);
  rightWingPivot.add(rightWing);

  // Cold-launch expulsion gas (White vapor puff for Stage 1)
  const coldLaunchVapor = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.45, 8),
    new THREE.MeshBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.9 })
  );
  coldLaunchVapurRotate(coldLaunchVapor);

  // Sustainer motor flame (Blue/white core for Stage 3)
  const sustainerFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.38, 8),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.95 })
  );
  sustainerFlame.rotateX(-Math.PI / 2);
  sustainerFlame.position.z = -0.38;
  sustainerFlame.visible = false;

  rootGroup.add(body, nose, leftWingPivot, rightWingPivot, coldLaunchVapor, sustainerFlame);

  // Helper function to handle wing rotation smoothly
  const setWingDeployment = (alpha: number) => {
    // alpha 0 = folded 90 deg flush; alpha 1 = deployed 0 deg flat
    const angle = THREE.MathUtils.lerp(Math.PI / 2, 0, alpha);
    leftWingPivot.rotation.z = angle;
    rightWingPivot.rotation.z = -angle;
  };

  const setLaunchPhase = (phase: 'STOWED' | 'EJECTION' | 'DEPLOYMENT' | 'CRUISE') => {
    switch (phase) {
      case 'STOWED':
        setWingDeployment(0);
        coldLaunchVapor.visible = false;
        sustainerFlame.visible = false;
        break;
      case 'EJECTION':
        setWingDeployment(0); // Stowed inside tube/rail
        coldLaunchVapor.visible = true;
        sustainerFlame.visible = false;
        break;
      case 'DEPLOYMENT':
        setWingDeployment(0.5); // Mid-snap
        coldLaunchVapor.visible = false;
        sustainerFlame.visible = true;
        break;
      case 'CRUISE':
        setWingDeployment(1.0); // Fully locked
        coldLaunchVapor.visible = false;
        sustainerFlame.visible = true;
        break;
    }
  };

  return {
    rootGroup,
    leftWingPivot,
    rightWingPivot,
    coldLaunchVapor,
    sustainerFlame,
    setWingDeployment,
    setLaunchPhase,
  };
}

function coldLaunchVapurRotate(mesh: THREE.Mesh) {
  mesh.rotateX(-Math.PI / 2);
  mesh.position.z = -0.4;
}