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

  // --- 3. UNIFIED SINGLE-FILE MISSILE SPLINES ---
  const missileCurves = Array.from({ length: 6 }, (_, i: number) => {
    const deckOffset = new THREE.Vector3(0, 0, (i - 2.5) * 0.28);
    const tubeExitPos = subStart.clone().add(deckOffset);
    const verticalApogeePos = subStart.clone().add(new THREE.Vector3(0, 4.5, 0)).add(deckOffset);

    const pts = [
      tubeExitPos,
      verticalApogeePos,
      coastalWaypoint.clone().add(deckOffset),
      mountainWaypoint.clone().add(deckOffset),
      depotTarget.clone().add(deckOffset.multiplyScalar(0.2)),
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

  // --- 7. DETAILED MISSILE MESH (Pivot-nested wings for 100% recessed in-tube stowing) ---
  const createMissileMesh = (): THREE.Group => {
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

    // Left Wing Pivot & Mesh (Stowed scale.x = 0.001 fully collapsed inside body hull)
    const leftWingPivot = new THREE.Group();
    leftWingPivot.position.set(-0.03, 0, 0);
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 0.16), bodyMat);
    leftWing.position.set(-0.13, 0, 0);
    leftWingPivot.add(leftWing);

    // Right Wing Pivot & Mesh
    const rightWingPivot = new THREE.Group();
    rightWingPivot.position.set(0.03, 0, 0);
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 0.16), bodyMat);
    rightWing.position.set(0.13, 0, 0);
    rightWingPivot.add(rightWing);

    // Stage 1 Cold-Launch Large Opaque Gray Smoke Bubbles
    const stage1SmokeGroup = new THREE.Group();
    stage1SmokeGroup.position.set(0, 0, -0.35);
    const smokeMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.9, metalness: 0.1, transparent: true, opacity: 0.95 });
    
    const bubble1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), smokeMat);
    bubble1.position.set(0, 0, -0.05);
    const bubble2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), smokeMat);
    bubble2.position.set(0.06, 0.04, -0.12);
    const bubble3 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), smokeMat);
    bubble3.position.set(-0.06, -0.04, -0.15);
    stage1SmokeGroup.add(bubble1, bubble2, bubble3);
    stage1SmokeGroup.name = 'stage1SmokeGroup';

    // Stage 3 Sustainer Main Motor Flame
    const sustainerFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.35, 8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.95 })
    );
    sustainerFlame.rotateX(-Math.PI / 2);
    sustainerFlame.position.z = -0.38;
    sustainerFlame.visible = false;

    group.add(body, nose, leftWingPivot, rightWingPivot, stage1SmokeGroup, sustainerFlame);
    group.userData = { leftWingPivot, rightWingPivot, stage1SmokeGroup, sustainerFlame };
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
  ].forEach(([x, y, z]: number[]) => {
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