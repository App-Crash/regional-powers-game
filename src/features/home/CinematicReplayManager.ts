import * as THREE from 'three';
import { getWaypointPosition } from '../../data/tacticalWaypoints';
import type { BattleReport } from '../../types/battleReport';

export interface CinematicReplayHandle {
  update: (tSec: number, camera: THREE.PerspectiveCamera, controls: any) => void;
  cleanup: () => void;
}

export function initCinematicReplay(
  scene: THREE.Scene,
  report: BattleReport,
  onTimeUpdate?: (simClock: string, headline: string, note: string) => void,
  onComplete?: () => void
): CinematicReplayHandle {
  console.log('[CinematicReplay DEBUG] initCinematicReplay called with report:', report);

  const replayGroup = new THREE.Group();
  replayGroup.name = 'TacticalCinematicReplayGroup';
  scene.add(replayGroup);

  // --- 1. ATMOSPHERIC & ENVIRONMENTAL SETUP ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  replayGroup.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xaaccff, 1.5);
  dirLight.position.set(20, 40, 20);
  replayGroup.add(dirLight);

  // --- 2. CORRECTED ELEVATIONS ---
  const rawDepotPos = getWaypointPosition ? getWaypointPosition('HEX-VEN-MARACAY-DEPOT') : null;
  const rawSubPos = getWaypointPosition ? getWaypointPosition('HEX-CARIBBEAN-SUB-01') : null;

  console.log('[CinematicReplay DEBUG] rawSubPos from registry:', rawSubPos);
  console.log('[CinematicReplay DEBUG] rawDepotPos from registry:', rawDepotPos);

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

  console.log('[CinematicReplay DEBUG] Final subStart:', subStart);
  console.log('[CinematicReplay DEBUG] Final depotTarget:', depotTarget);

  // Flight waypoints arching from sub to depot
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

  // Initial camera position placed directly BELOW the submarine looking up at the hull
  const initialCamPos = subStart.clone().add(new THREE.Vector3(0.0, -3.5, 2.5));
  const initialLookTarget = subStart.clone().add(new THREE.Vector3(0, 0.5, 0)); // Center on hull / tower

  // Director Cinematic Camera Spline Path (starts after the 1s hold)
  const cameraCurve = new THREE.CatmullRomCurve3([
    subStart.clone().add(new THREE.Vector3(0.5, 2.5, 5.0)),
    mountainWaypoint.clone().add(new THREE.Vector3(0, 4.0, 6.0)),
    depotTarget.clone().add(new THREE.Vector3(2.0, 5.0, 8.0))
  ]);

  // --- 4. DETAILED 3D ASSETS ---
  // Submarine
  const subGroup = new THREE.Group();
  const hullGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 16);
  hullGeo.rotateX(Math.PI / 2);
  const subMat = new THREE.MeshStandardMaterial({ color: 0x1f2b2d, metalness: 0.7, roughness: 0.3 });
  const hull = new THREE.Mesh(hullGeo, subMat);

  const towerGeo = new THREE.BoxGeometry(0.18, 0.35, 0.6);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x152224, metalness: 0.6, roughness: 0.4 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(0, 0.3, 0.15);

  subGroup.add(hull, tower);
  subGroup.position.copy(subStart);
  replayGroup.add(subGroup);

  // Target Depot Complex
  const depotGroup = new THREE.Group();
  
  const bunker = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.5, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.3 })
  );
  bunker.position.y = 0.25;

  const commsTower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.08, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 })
  );
  commsTower.position.set(0.25, 0.55, 0.25);

  depotGroup.add(bunker, commsTower);
  depotGroup.position.copy(depotTarget);
  replayGroup.add(depotGroup);

  // Detailed Cruise Missiles
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

    group.add(body, nose);
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
  const LAUNCH_DELAY_SEC = 1.0; // Exact 1-second hold looking up at the sub before launch

  return {
    update: (tSec: number, camera: THREE.PerspectiveCamera, controls: any) => {
      const chapters = report.chapters || [];
      const chapter = 
        chapters.find((c: any) => tSec >= c.startSec && tSec < c.endSec) || 
        chapters[chapters.length - 1];

      if (chapter && onTimeUpdate) {
        onTimeUpdate(chapter.simClock, chapter.headline, chapter.telemetryNote);
      }

      // --- 5. CINEMATIC DIRECTOR CAMERA & 1-SEC HOLD ---
      if (tSec < LAUNCH_DELAY_SEC) {
        // Forcefully hold camera below sub, looking straight up at the hull
        const currentSubPos = subStart.clone().add(new THREE.Vector3(0, Math.sin(tSec * 2.2) * 0.03, 0));
        const currentCamPos = currentSubPos.clone().add(new THREE.Vector3(0.0, -3.5, 2.5));
        const currentLookTarget = currentSubPos.clone().add(new THREE.Vector3(0, 0.5, 0));

        camera.position.copy(currentCamPos);
        if (controls && controls.target) {
          controls.target.copy(currentLookTarget);
        } else {
          camera.lookAt(currentLookTarget);
        }
      } else {
        const effectiveTSec = tSec - LAUNCH_DELAY_SEC;
        const effectiveDuration = playbackDuration - LAUNCH_DELAY_SEC;
        const currentT = THREE.MathUtils.clamp(effectiveTSec / effectiveDuration, 0, 1);

        const camPos = cameraCurve.getPointAt(currentT);
        camera.position.lerp(camPos, 0.12);

        const lookTarget = currentT < 0.85 && missileMeshes[0].visible ? missileMeshes[0].position : impactTargetPos;
        if (controls && controls.target) {
          controls.target.lerp(lookTarget, 0.12);
        } else {
          camera.lookAt(lookTarget);
        }
      }

      const subSwell = Math.sin(tSec * 2.2) * 0.03;
      subGroup.position.copy(subStart).add(new THREE.Vector3(0, subSwell, 0));

      // --- 6. STAGGERED MISSILE LAUNCH & FLIGHT ---
      if (tSec < LAUNCH_DELAY_SEC) {
        missileMeshes.forEach(m => { m.visible = false; });
      } else {
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
            
            if (localT >= 0.98) {
              triggerImpactExplosion(idx, impactTargetPos);
            }
          } else {
            m.visible = false;
          }
        });
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