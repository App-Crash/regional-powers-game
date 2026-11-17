// src/features/home/CinematicReplayAssets.ts
import * as THREE from 'three';
import { getWaypointPosition } from '../../data/tacticalWaypoints';
import type { BattleReport } from '../../types/battleReport';

export interface ReplaySceneAssets {
  replayGroup: THREE.Group;
  subGroup: THREE.Group;
  depotGroup: THREE.Group;
  heliGroup: THREE.Group;
  operatorsGroup: THREE.Group;
  tankGroup: THREE.Group;
  missileMeshes: THREE.Group[];
  missileCurves: THREE.CatmullRomCurve3[];
  heliCurve: THREE.CatmullRomCurve3;
  subStart: THREE.Vector3;
  depotTarget: THREE.Vector3;
  impactTargetPos: THREE.Vector3;
  smokeParticles: THREE.Mesh[];
  intactBunker: THREE.Mesh;
  roofSlab1: THREE.Mesh;
  roofSlab2: THREE.Mesh;
  smokeGroup: THREE.Group;
  isDepotDestroyed: boolean;
  triggerImpactExplosion: (missileIdx: number, impactPos: THREE.Vector3) => void;
}

export function buildCinematicReplayAssets(report: BattleReport): ReplaySceneAssets {
  const replayGroup = new THREE.Group();
  replayGroup.name = 'TacticalCinematicReplayGroup';

  // --- 1. ATMOSPHERIC & ENVIRONMENTAL SETUP ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  replayGroup.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xaaccff, 1.8);
  dirLight.position.set(20, 40, 20);
  replayGroup.add(dirLight);

  // --- 2. WAYPOINTS & ELEVATIONS ---
  const rawDepotPos = getWaypointPosition ? getWaypointPosition('HEX-VEN-MARACAY-DEPOT') : null;
  const rawSubPos = getWaypointPosition ? getWaypointPosition('HEX-CARIBBEAN-SUB-01') : null;
  const rawFobPos = getWaypointPosition ? getWaypointPosition('HEX-COL-ARAUCA-FOB') : null;
  const rawLzPos = getWaypointPosition ? getWaypointPosition('HEX-VEN-CARACAS-OUTSKIRTS') : null;
  const rawHighwayPos = getWaypointPosition ? getWaypointPosition('HEX-VEN-TACHIRA-HIGHWAY') : null;

  const fallbackDepot = new THREE.Vector3(2.2, 2.5, -4.5);
  const fallbackSub = new THREE.Vector3(5.2, 12.5, -18.5);
  const fallbackFob = new THREE.Vector3(-4.0, 0.5, 4.0);
  const fallbackLz = new THREE.Vector3(1.5, 0.5, -2.5);
  const fallbackHighway = new THREE.Vector3(-1.0, 0.5, 0.0);

  const depotBase = rawDepotPos ? rawDepotPos.clone() : fallbackDepot;
  const subBase = rawSubPos ? rawSubPos.clone() : fallbackSub;
  const fobPos = rawFobPos ? rawFobPos.clone() : fallbackFob;
  const lzPos = rawLzPos ? rawLzPos.clone() : fallbackLz;
  const highwayPos = rawHighwayPos ? rawHighwayPos.clone() : fallbackHighway;

  const SUB_WORLD_Y = 12.5;
  const DEPOT_WORLD_Y = 2.5;
  const NORTH_Z_OFFSET = -15.0;

  const depotTarget = depotBase.clone().setY(DEPOT_WORLD_Y);
  const subStart = new THREE.Vector3(subBase.x, SUB_WORLD_Y, subBase.z + NORTH_Z_OFFSET);

  const coastalWaypoint = subStart.clone().lerp(depotTarget, 0.35).setY(13.5);
  const mountainWaypoint = subStart.clone().lerp(depotTarget, 0.65).setY(10.0);

  // --- 3. 8 STAGGERED MISSILE FLIGHT SPLINES ---
  const missileCurves = Array.from({ length: 8 }, (_, i) => {
    const spread = new THREE.Vector3((i - 3.5) * 0.18, 0, ((i % 2) - 0.5) * 0.18);
    const pts = [
      subStart.clone().add(spread),
      subStart.clone().add(new THREE.Vector3(0, 1.2, 0)).add(spread),
      coastalWaypoint.clone().add(spread),
      mountainWaypoint.clone().add(spread),
      depotTarget.clone().add(spread.multiplyScalar(0.25)),
    ];
    return new THREE.CatmullRomCurve3(pts);
  });

  // --- 4. HELICOPTER NAP-OF-THE-EARTH SPLINE ---
  const heliCurve = new THREE.CatmullRomCurve3([
    fobPos.clone().add(new THREE.Vector3(0, 0.2, 0)),
    fobPos.clone().lerp(lzPos, 0.5).add(new THREE.Vector3(0, 1.2, 0)),
    lzPos.clone().add(new THREE.Vector3(0, 0.2, 0)),
  ]);

  // --- 5. SUBMARINE HULL ---
  const subGroup = new THREE.Group();
  const hullGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.0, 16);
  hullGeo.rotateX(Math.PI / 2);
  const subMat = new THREE.MeshStandardMaterial({ color: 0x1f2b2d, metalness: 0.7, roughness: 0.3 });
  const hull = new THREE.Mesh(hullGeo, subMat);

  const towerGeo = new THREE.BoxGeometry(0.25, 0.5, 0.8);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x152224, metalness: 0.6, roughness: 0.4 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(0, 0.4, 0.15);
  subGroup.add(hull, tower);
  subGroup.position.copy(subStart);
  replayGroup.add(subGroup);

  // --- 6. TARGET DEPOT COMPLEX ---
  const depotGroup = new THREE.Group();
  const intactBunker = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.5, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.3 })
  );
  intactBunker.position.y = 0.25;
  depotGroup.add(intactBunker);

  const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.2 });
  const roofSlab1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.9), rubbleMat);
  roofSlab1.position.set(-0.2, 0.15, 0);
  roofSlab1.rotation.z = 0.35;
  roofSlab1.rotation.x = 0.2;
  roofSlab1.visible = false;

  const roofSlab2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.9), rubbleMat);
  roofSlab2.position.set(0.2, 0.15, 0);
  roofSlab2.rotation.z = -0.35;
  roofSlab2.rotation.x = -0.15;
  roofSlab2.visible = false;

  depotGroup.add(roofSlab1, roofSlab2);

  const smokeGroup = new THREE.Group();
  smokeGroup.visible = false;
  const smokeParticles: THREE.Mesh[] = [];
  for (let p = 0; p < 6; p++) {
    const smokeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.65 })
    );
    smokeMesh.position.set((Math.random() - 0.5) * 0.4, 0.3 + p * 0.18, (Math.random() - 0.5) * 0.4);
    smokeGroup.add(smokeMesh);
    smokeParticles.push(smokeMesh);
  }
  depotGroup.add(smokeGroup);
  depotGroup.position.copy(depotTarget);
  replayGroup.add(depotGroup);

  // --- 7. DETAILED MISSILE MESH ---
  const createMissileMesh = () => {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), bodyMat);
    body.rotation.x = Math.PI / 2;

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.15, 8),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 })
    );
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 0.32;

    const mainWingHoriz = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.015, 0.18), bodyMat);
    mainWingHoriz.position.set(0, 0, 0.0);

    const tailFinHoriz = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.01, 0.08), bodyMat);
    tailFinHoriz.position.set(0, 0, -0.2);

    const tailFinVertTop = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.125, 0.08), bodyMat);
    tailFinVertTop.position.set(0, 0.0625, -0.2);

    const flameGeo = new THREE.ConeGeometry(0.05, 0.3, 8);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.z = -0.35;

    const innerFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.025, 0.2, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1.0 })
    );
    innerFlame.rotateX(-Math.PI / 2);
    innerFlame.position.z = -0.3;

    group.add(body, nose, mainWingHoriz, tailFinHoriz, tailFinVertTop, flame, innerFlame);
    return group;
  };

  const missileMeshes = missileCurves.map(() => {
    const m = createMissileMesh();
    m.visible = false;
    replayGroup.add(m);
    return m;
  });

  // --- 8. HELICOPTERS & OPERATORS ---
  const heliGroup = new THREE.Group();
  heliGroup.name = 'BlackhawkSquadron';
  [
    [0, 0, 0],
    [-0.8, 0.1, -0.7],
    [0.8, -0.05, -0.7],
  ].forEach(([x, y, z]) => {
    const heloMesh = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.3, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5 })
    );
    heloMesh.add(body);
    heloMesh.position.set(x, y, z);
    heliGroup.add(heloMesh);
  });
  heliGroup.position.copy(fobPos);
  replayGroup.add(heliGroup);

  const operatorsGroup = new THREE.Group();
  operatorsGroup.name = 'SpecialForcesOperators';
  operatorsGroup.position.copy(lzPos);
  operatorsGroup.visible = false;
  Array.from({ length: 6 }).forEach(() => {
    const opMesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.05, 0.2, 4, 8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    operatorsGroup.add(opMesh);
  });
  replayGroup.add(operatorsGroup);

  const tankGroup = new THREE.Group();
  tankGroup.position.copy(highwayPos);
  const tankMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.3, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.6 })
  );
  tankGroup.add(tankMesh);
  replayGroup.add(tankGroup);

  const impactTargetPos = depotTarget.clone().add(new THREE.Vector3(0, 0.5, 0));
  const explodedMissiles = new Set<number>();
  let isDepotDestroyed = false;

  const triggerImpactExplosion = (missileIdx: number, impactPos: THREE.Vector3) => {
    if (explodedMissiles.has(missileIdx)) return;
    explodedMissiles.add(missileIdx);

    if (!isDepotDestroyed) {
      isDepotDestroyed = true;
      intactBunker.visible = false;
      roofSlab1.visible = true;
      roofSlab2.visible = true;
      smokeGroup.visible = true;
    }

    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.95 })
    );
    flash.position.copy(impactPos);
    replayGroup.add(flash);

    let scale = 0.5;
    const expandInterval = setInterval(() => {
      scale += 0.35;
      flash.scale.set(scale, scale, scale);
      const mat = flash.material as THREE.MeshBasicMaterial;
      mat.opacity -= 0.12;
      if (scale >= 4.5) {
        clearInterval(expandInterval);
        replayGroup.remove(flash);
        flash.geometry.dispose();
        mat.dispose();
      }
    }, 35);
  };

  return {
    replayGroup,
    subGroup,
    depotGroup,
    heliGroup,
    operatorsGroup,
    tankGroup,
    missileMeshes,
    missileCurves,
    heliCurve,
    subStart,
    depotTarget,
    impactTargetPos,
    smokeParticles,
    intactBunker,
    roofSlab1,
    roofSlab2,
    smokeGroup,
    get isDepotDestroyed() { return isDepotDestroyed; },
    triggerImpactExplosion,
  };
}