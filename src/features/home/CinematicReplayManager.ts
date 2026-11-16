import * as THREE from 'three';
import { getWaypointPosition } from '../../data/tacticalWaypoints';
import type { BattleReport } from '../../types/battleReport';

export interface CinematicReplayHandle {
  update: (tSec: number, camera: THREE.PerspectiveCamera, controls?: any) => void;
  cleanup: () => void;
}

export function initCinematicReplay(
  scene: THREE.Scene,
  report: BattleReport,
  onTimeUpdate?: (simClock: string, headline: string, note: string) => void,
  onComplete?: () => void
): CinematicReplayHandle {
  const replayGroup = new THREE.Group();
  replayGroup.name = 'TacticalCinematicReplayGroup';
  scene.add(replayGroup);

  // --- 1. ATMOSPHERIC & ENVIRONMENTAL SETUP ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  replayGroup.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xaaccff, 1.5);
  dirLight.position.set(20, 40, 20);
  replayGroup.add(dirLight);

  // --- 2. WAYPOINTS & ELEVATIONS ---
  const rawDepotPos = getWaypointPosition ? getWaypointPosition('HEX-VEN-MARACAY-DEPOT') : null;
  const rawSubPos = getWaypointPosition ? getWaypointPosition('HEX-CARIBBEAN-SUB-01') : null;

  const fallbackDepot = new THREE.Vector3(2.2, 2.5, -4.5);
  const fallbackSub = new THREE.Vector3(5.2, 12.5, -18.5);

  const depotBase = rawDepotPos ? rawDepotPos.clone() : fallbackDepot;
  const subBase = rawSubPos ? rawSubPos.clone() : fallbackSub;

  const SUB_WORLD_Y = 12.5;
  const DEPOT_WORLD_Y = 2.5;
  const NORTH_Z_OFFSET = -15.0;

  const depotTarget = depotBase.clone().setY(DEPOT_WORLD_Y);
  const subStart = new THREE.Vector3(
    subBase.x,
    SUB_WORLD_Y,
    subBase.z + NORTH_Z_OFFSET
  );

  const coastalWaypoint = subStart.clone().lerp(depotTarget, 0.35).setY(13.5);
  const mountainWaypoint = subStart.clone().lerp(depotTarget, 0.65).setY(10.0);

  // --- 3. 6 STAGGERED MISSILE FLIGHT SPLINES ---
  const missileCurves = Array.from({ length: 6 }, (_, i) => {
    const spread = new THREE.Vector3((i - 2.5) * 0.2, 0, ((i % 2) - 0.5) * 0.2);
    const pts = [
      subStart.clone().add(spread),
      subStart.clone().add(new THREE.Vector3(0, 1.0, 0)).add(spread),
      coastalWaypoint.clone().add(spread),
      mountainWaypoint.clone().add(spread),
      depotTarget.clone().add(spread.multiplyScalar(0.2))
    ];
    return new THREE.CatmullRomCurve3(pts);
  });

  // --- 4. 3D ASSETS ---
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

  const depotGroup = new THREE.Group();
  const bunker = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.5, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.3 })
  );
  bunker.position.y = 0.25;
  depotGroup.add(bunker);
  depotGroup.position.copy(depotTarget);
  replayGroup.add(depotGroup);

  // Detailed Cruise Missiles with Blue/White Exhaust Plume
  const createMissileMesh = () => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 })
    );
    body.rotation.x = Math.PI / 2;

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.15, 8),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 })
    );
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 0.32;

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

    group.add(body, nose, flame, innerFlame);
    return group;
  };

  const missileMeshes = missileCurves.map(() => {
    const m = createMissileMesh();
    m.visible = false;
    replayGroup.add(m);
    return m;
  });

  const impactTargetPos = depotTarget.clone().add(new THREE.Vector3(0, 0.5, 0));
  const explodedMissiles = new Set<number>();
  const triggerImpactExplosion = (missileIdx: number, impactPos: THREE.Vector3) => {
    if (explodedMissiles.has(missileIdx)) return;
    explodedMissiles.add(missileIdx);

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

  let hasCompleted = false;
  const playbackDuration = 15.0;
  const LAUNCH_DELAY_SEC = 2.8;

  return {
    update: (tSec: number, camera: THREE.PerspectiveCamera, controls?: any) => {
      const chapters = report.chapters || [];
      const chapter = 
        chapters.find((c: any) => tSec >= c.startSec && tSec < c.endSec) || 
        chapters[chapters.length - 1];

      if (chapter && onTimeUpdate) {
        onTimeUpdate(chapter.simClock, chapter.headline, chapter.telemetryNote);
      }

      replayGroup.updateMatrixWorld(true);

      const subSwell = Math.sin(tSec * 2.2) * 0.03;
      const currentSubPos = subStart.clone().add(new THREE.Vector3(0, subSwell, 0));
      subGroup.position.copy(currentSubPos);
      subGroup.updateMatrixWorld(true);

      // --- 5. STAGGERED MISSILE FLIGHT & 6TH MISSILE TRACKING ---
      let sixthMissilePos: THREE.Vector3 | null = null;
      let sixthMissileTangent = new THREE.Vector3(0, 0, 1);
      let leadMissilePos: THREE.Vector3 | null = null;

      if (tSec >= LAUNCH_DELAY_SEC) {
        const effectiveTSec = tSec - LAUNCH_DELAY_SEC;
        const effectiveDuration = playbackDuration - LAUNCH_DELAY_SEC;
        const effectiveT = THREE.MathUtils.clamp(effectiveTSec / effectiveDuration, 0, 1);

        missileMeshes.forEach((m, idx) => {
          const localT = THREE.MathUtils.clamp((effectiveT - idx * 0.04) / (1 - 6 * 0.04), 0, 1);
          const pos = missileCurves[idx].getPointAt(localT);
          const tangent = missileCurves[idx].getTangentAt(localT);

          m.position.copy(pos);
          if (localT > 0 && localT < 1) {
            m.visible = true;
            m.lookAt(pos.clone().add(tangent));
            m.updateMatrixWorld(true);

            if (!leadMissilePos) {
              leadMissilePos = pos.clone();
            }

            if (idx === 5) {
              sixthMissilePos = pos.clone();
              sixthMissileTangent = tangent.clone();
            }

            if (localT >= 0.98) {
              triggerImpactExplosion(idx, impactTargetPos);
            }
          } else {
            m.visible = false;
          }
        });
      } else {
        missileMeshes.forEach(m => { m.visible = false; });
      }

      // --- 6. VECTOR-BASED CINEMATIC CAMERA (NORTH LOOKING SOUTH TOWARD DEPOT) ---
      let targetCamPos = new THREE.Vector3();
      let targetLookAt = new THREE.Vector3();

      // Compute vector from sub to depot (South / forward path)
      const vectorToDepot = depotTarget.clone().sub(currentSubPos).normalize();

      if (tSec < LAUNCH_DELAY_SEC) {
        // Pre-launch hold: Positioned North (backward along the path away from depot) looking South at the sub
        targetCamPos.copy(currentSubPos).sub(vectorToDepot.clone().multiplyScalar(4.5));
        targetLookAt.copy(currentSubPos);
      } else {
        // Flight phase: smooth transition behind the missiles
        const effectiveTSec = tSec - LAUNCH_DELAY_SEC;
        const effectiveDuration = playbackDuration - LAUNCH_DELAY_SEC;
        const flightT = THREE.MathUtils.clamp(effectiveTSec / effectiveDuration, 0, 1);

        const activeMissilePos = sixthMissilePos || leadMissilePos;

        if (activeMissilePos) {
          const camOffset = sixthMissileTangent.clone().multiplyScalar(-3.5).add(new THREE.Vector3(0, 1.2, 0));
          targetCamPos.copy(activeMissilePos).add(camOffset);
          targetLookAt.copy(activeMissilePos).add(sixthMissileTangent.clone().multiplyScalar(5.0));
        } else {
          targetCamPos.copy(currentSubPos).lerp(impactTargetPos, flightT).add(new THREE.Vector3(0, 3.0, -4.0));
          targetLookAt.copy(impactTargetPos);
        }
      }

      // Smooth interpolation
      if (controls) {
        controls.enabled = false;
        camera.position.lerp(targetCamPos, 0.15);
        controls.target.lerp(targetLookAt, 0.15);
        controls.update();
      } else {
        camera.position.lerp(targetCamPos, 0.15);
        camera.up.set(0, 1, 0);
        const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
        currentLookAt.lerp(targetLookAt, 0.15);
        camera.lookAt(currentLookAt);
      }

      if (tSec >= playbackDuration && !hasCompleted) {
        hasCompleted = true;
        if (onComplete) onComplete();
      }
    },
    cleanup: () => {
      scene.remove(replayGroup);
    }
  };
}