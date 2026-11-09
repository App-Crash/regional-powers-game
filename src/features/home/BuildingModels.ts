import * as THREE from 'three';
import { alignToSurfaceNormal } from './CurvedTerrain';

export type BuildingType = 'CAPITAL' | 'MANUFACTURING' | 'MILITARY_BASE' | 'PORT';

export function createDetailedBuilding(
  id: string,
  worldX: number,
  worldY: number,
  type: BuildingType
): THREE.Group {
  const buildingGroup = new THREE.Group();
  buildingGroup.userData = { id, type: 'structure' };

  const primaryBlue = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4, metalness: 0.2 });
  const accentDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const metalAcc = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });

  // Base platform (radius 0.8)
  const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.15, 16);
  const base = new THREE.Mesh(baseGeo, accentDark);
  base.position.y = 0.075;
  buildingGroup.add(base);

  if (type === 'CAPITAL') {
    const towerGeo = new THREE.BoxGeometry(0.4, 1.2, 0.4);
    const tower = new THREE.Mesh(towerGeo, primaryBlue);
    tower.position.y = 0.75;
    buildingGroup.add(tower);

    const spireGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.6, 8);
    const spire = new THREE.Mesh(spireGeo, metalAcc);
    spire.position.y = 1.6;
    buildingGroup.add(spire);
  } else if (type === 'MANUFACTURING') {
    const factoryGeo = new THREE.BoxGeometry(1.0, 0.5, 0.7);
    const factory = new THREE.Mesh(factoryGeo, primaryBlue);
    factory.position.y = 0.4;
    buildingGroup.add(factory);

    // Off-center stack 1
    const stack1Geo = new THREE.CylinderGeometry(0.05, 0.07, 0.8, 8);
    const stack1 = new THREE.Mesh(stack1Geo, metalAcc);
    stack1.position.set(-0.3, 0.75, -0.15);
    buildingGroup.add(stack1);

    // Off-center stack 2
    const stack2Geo = new THREE.CylinderGeometry(0.04, 0.06, 0.6, 8);
    const stack2 = new THREE.Mesh(stack2Geo, metalAcc);
    stack2.position.set(-0.15, 0.65, 0.2);
    buildingGroup.add(stack2);
  } else if (type === 'MILITARY_BASE') {
    const bunkerGeo = new THREE.BoxGeometry(0.9, 0.4, 0.9);
    const bunker = new THREE.Mesh(bunkerGeo, primaryBlue);
    bunker.position.y = 0.3;
    buildingGroup.add(bunker);

    // Radome Dome
    const radomeGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const radomeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2 });
    const radome = new THREE.Mesh(radomeGeo, radomeMat);
    radome.position.set(0.25, 0.62, 0.25);
    buildingGroup.add(radome);

    // Antenna Mast
    const mastGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.8, 8);
    const mast = new THREE.Mesh(mastGeo, metalAcc);
    mast.position.set(-0.25, 0.7, -0.25);
    buildingGroup.add(mast);
  } else if (type === 'PORT') {
    const dockGeo = new THREE.BoxGeometry(1.2, 0.2, 0.6);
    const dock = new THREE.Mesh(dockGeo, primaryBlue);
    dock.position.y = 0.15;
    buildingGroup.add(dock);

    const craneGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const crane = new THREE.Mesh(craneGeo, metalAcc);
    crane.position.set(0.3, 0.6, 0);
    buildingGroup.add(crane);
  }

  alignToSurfaceNormal(buildingGroup, worldX, worldY);
  return buildingGroup;
}