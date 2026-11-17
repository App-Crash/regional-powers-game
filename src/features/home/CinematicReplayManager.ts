// src/features/home/CinematicReplayManager.ts
import * as THREE from 'three';
import type { BattleReport } from '../../types/battleReport';
import type { BattleResultJson } from '../../types/operationSchema';
import { buildCinematicReplayAssets } from './CinematicReplayAssets';

export interface CinematicReplayHandle {
  update: (tSec: number, camera: THREE.PerspectiveCamera, controls?: any) => void;
  cleanup: () => void;
}

export function initCinematicReplay(
  scene: THREE.Scene,
  report: BattleReport | BattleResultJson,
  onTimeUpdate?: (simClock: string, headline: string, note: string) => void,
  onComplete?: () => void
): CinematicReplayHandle {
  const assets = buildCinematicReplayAssets(report);
  scene.add(assets.replayGroup);

  let hasCompleted = false;
  const playbackDuration = 20.0;
  const LAUNCH_DELAY_SEC = 3.5;

  return {
    update: (tSec: number, camera: THREE.PerspectiveCamera, controls?: any) => {
      // Extract chapters safely from either BattleReport or BattleResultJson
      const chapters = ('chapters' in report ? report.chapters : []) || [];
      const chapter =
        chapters.find((c: any) => tSec >= c.startSec && tSec < c.endSec) ||
        chapters[chapters.length - 1];

      if (chapter && onTimeUpdate) {
        onTimeUpdate(chapter.simClock, chapter.headline, chapter.telemetryNote);
      }

      assets.replayGroup.updateMatrixWorld(true);

      // Submarine subtle swell
      const subSwell = Math.sin(tSec * 2.2) * 0.03;
      const currentSubPos = assets.subStart.clone().add(new THREE.Vector3(0, subSwell, 0));
      assets.subGroup.position.copy(currentSubPos);
      assets.subGroup.updateMatrixWorld(true);

      // Continuous smoke bubbling
      if (assets.isDepotDestroyed) {
        assets.smokeParticles.forEach((sp) => {
          sp.position.y += 0.006;
          sp.scale.addScalar(0.0035);
          const mat = sp.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.max(0, mat.opacity - 0.0025);
          if (sp.position.y > 1.4) {
            sp.position.y = 0.25;
            sp.position.x = (Math.random() - 0.5) * 0.4;
            sp.position.z = (Math.random() - 0.5) * 0.4;
            sp.scale.set(1, 1, 1);
            mat.opacity = 0.65;
          }
        });
      }

      if (tSec >= playbackDuration) {
        if (!hasCompleted) {
          hasCompleted = true;
          if (controls) controls.enabled = true;
          if (onComplete) onComplete();
        }
        return;
      }

      if (controls) {
        controls.enabled = false;
      }

      // --- MISSILE SALVO ANIMATION (Exact Legacy Math & Timing) ---
      let sixthMissilePos: THREE.Vector3 | null = null;
      let sixthMissileTangent = new THREE.Vector3(0, 0, 1);
      let leadMissilePos: THREE.Vector3 | null = null;

      if (tSec >= LAUNCH_DELAY_SEC) {
        const effectiveTSec = tSec - LAUNCH_DELAY_SEC;
        const effectiveDuration = playbackDuration - LAUNCH_DELAY_SEC;
        const effectiveT = THREE.MathUtils.clamp(effectiveTSec / effectiveDuration, 0, 1);

        assets.missileMeshes.forEach((m, idx) => {
          const localT = THREE.MathUtils.clamp((effectiveT - idx * 0.04) / (1 - 6 * 0.04), 0, 1);
          const pos = assets.missileCurves[idx].getPointAt(localT);
          const tangent = assets.missileCurves[idx].getTangentAt(localT);

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
              assets.triggerImpactExplosion(idx, assets.impactTargetPos);
            }
          } else {
            m.visible = false;
          }
        });
      } else {
        assets.missileMeshes.forEach((m) => {
          m.visible = false;
        });
      }

      // --- EXACT WORKING LEGACY CAMERA POSITION & ORIENTATION ---
      let targetCamPos = new THREE.Vector3();
      let targetLookAt = new THREE.Vector3();

      const vectorToDepot = assets.depotTarget.clone().sub(currentSubPos).normalize();

      if (tSec < LAUNCH_DELAY_SEC) {
        targetCamPos.copy(currentSubPos).sub(vectorToDepot.clone().multiplyScalar(4.5));
        targetLookAt.copy(currentSubPos);
      } else {
        const effectiveTSec = tSec - LAUNCH_DELAY_SEC;
        const effectiveDuration = playbackDuration - LAUNCH_DELAY_SEC;

        const activeMissilePos = sixthMissilePos || leadMissilePos;

        if (activeMissilePos) {
          const camOffset = sixthMissileTangent.clone().multiplyScalar(-3.5).add(new THREE.Vector3(0, 1.2, 0));
          targetCamPos.copy(activeMissilePos).add(camOffset);
          targetLookAt.copy(activeMissilePos).add(sixthMissileTangent.clone().multiplyScalar(5.0));
        } else {
          const fallbackT = THREE.MathUtils.clamp(effectiveTSec / effectiveDuration, 0, 1);
          targetCamPos.copy(currentSubPos).lerp(assets.impactTargetPos, fallbackT).add(new THREE.Vector3(0, 3.0, -4.0));
          targetLookAt.copy(assets.impactTargetPos);
        }
      }

      if (controls) {
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
    },
    cleanup: () => {
      scene.remove(assets.replayGroup);
    },
  };
}