// src/features/home/CinematicReplayManager.ts
import * as THREE from 'three';
import type { BattleReport } from '../../types/battleReport';
import type { BattleResultJson, ScriptCue } from '../../types/operationSchema';
import { buildCinematicReplayAssets } from './CinematicReplayAssets';

export interface CinematicReplayHandle {
  update: (tSec: number, camera: THREE.PerspectiveCamera, controls?: any) => void;
  cleanup: () => void;
}

/**
 * Positions the camera strictly below the water line, positioned South of the submarine
 * and facing directly North toward the hull and VLS missile tubes.
 */
function positionCameraFacingNorthBelowWater(subPos: THREE.Vector3): { targetCamPos: THREE.Vector3; targetLookAt: THREE.Vector3 } {
  // Below water line (subPos.y minus offset)
  const underwaterY = subPos.y - 1.2;
  
  // Positioned South of the submarine (-Z direction in world space if North is +Z) so it looks North
  const targetCamPos = new THREE.Vector3(subPos.x, underwaterY, subPos.z - 4.5);
  
  // Looking North toward the submarine hull and VLS hatches (+Z direction)
  const targetLookAt = new THREE.Vector3(subPos.x, subPos.y + 0.2, subPos.z + 3.0);

  return { targetCamPos, targetLookAt };
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
  const playbackDuration = 22.0;
  
  // Precise timing choreography
  const SUB_POSITIONING_SEC = 3.0;
  const MISSILE_LAUNCH_START_SEC = 5.0; // 2-second pause after camera arrives in underwater position
  const MISSILE_FLIGHT_DURATION = 5.5;
  const INSERTION_START_SEC = 17.5;

  const scriptCues: ScriptCue[] = ('scriptCues' in report && report.scriptCues) ? report.scriptCues : [];

  return {
    update: (tSec: number, camera: THREE.PerspectiveCamera, controls?: any) => {
      // --- DIRECTOR SCRIPT CUE EVALUATION ---
      const activeCue = scriptCues.find(
        (c) => tSec >= c.startSec && tSec < c.endSec
      ) || scriptCues[scriptCues.length - 1];

      if (activeCue && onTimeUpdate) {
        onTimeUpdate(activeCue.simClock, activeCue.headline, activeCue.telemetryNote);
      } else {
        const chapters = ('chapters' in report ? report.chapters : []) || [];
        const chapter = chapters.find((c: any) => tSec >= c.startSec && tSec < c.endSec) || chapters[chapters.length - 1];
        if (chapter && onTimeUpdate) {
          onTimeUpdate(chapter.simClock, chapter.headline, chapter.telemetryNote);
        }
      }

      assets.replayGroup.updateMatrixWorld(true);

      // Submarine underwater positioning & swell
      const subSwell = Math.sin(tSec * 2.2) * 0.03;
      const currentSubPos = assets.subStart.clone().add(new THREE.Vector3(0, subSwell, 0));
      assets.subGroup.position.copy(currentSubPos);
      assets.subGroup.visible = true;
      assets.subGroup.updateMatrixWorld(true);

      // --- PHASE 1: STAGGERED UNDERWATER MISSILE SALVO ---
      let sixthMissilePos: THREE.Vector3 | null = null;
      let sixthMissileTangent = new THREE.Vector3(0, 0, 1);
      let leadMissilePos: THREE.Vector3 | null = null;

      assets.missileMeshes.forEach((m, idx) => {
        const missileStartT = MISSILE_LAUNCH_START_SEC + (idx * 0.35); // Staggered launch per tube
        const missileEndT = missileStartT + MISSILE_FLIGHT_DURATION;

        if (tSec < missileStartT) {
          m.visible = false;
        } else if (tSec >= missileStartT && tSec <= missileEndT) {
          const localT = (tSec - missileStartT) / MISSILE_FLIGHT_DURATION;
          const clampedT = THREE.MathUtils.clamp(localT, 0, 1);
          const pos = assets.missileCurves[idx].getPointAt(clampedT);
          const tangent = assets.missileCurves[idx].getTangentAt(clampedT);

          m.position.copy(pos);
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

          if (clampedT >= 0.98) {
            assets.triggerImpactExplosion(idx, assets.impactTargetPos);
          }
        } else {
          m.visible = false;
        }
      });

      // --- HELICOPTER CONTINUOUS FLIGHT PROGRESS ---
      let currentHeloPos = assets.heliCurve ? assets.heliCurve.getPointAt(0) : new THREE.Vector3();
      
      if (tSec >= 0.0) {
        const heloT = THREE.MathUtils.clamp(tSec / playbackDuration, 0, 1);
        const heloPos = assets.heliCurve.getPointAt(heloT);
        const heloTan = assets.heliCurve.getTangentAt(heloT);
        
        assets.heliGroup.position.copy(heloPos);
        assets.heliGroup.lookAt(heloPos.clone().add(heloTan));
        assets.heliGroup.visible = true;
        currentHeloPos.copy(heloPos);

        if (tSec >= INSERTION_START_SEC) {
          assets.operatorsGroup.visible = true;
          const insertT = THREE.MathUtils.clamp((tSec - INSERTION_START_SEC) / 4.5, 0, 1);
          const fanOut = THREE.MathUtils.clamp(insertT, 0, 1);
          
          assets.operatorsGroup.children.forEach((op, idx) => {
            const angle = (idx - 2.5) * 0.35;
            op.position.set(Math.sin(angle) * fanOut * 1.5, 0.1, Math.cos(angle) * fanOut * 1.8);
          });
        }
      } else {
        assets.heliGroup.visible = false;
        assets.operatorsGroup.visible = false;
      }

      // Continuous smoke bubbling at impact site
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

      // --- DIRECTOR CAMERA CHOREOGRAPHY ---
      let targetCamPos = new THREE.Vector3();
      let targetLookAt = new THREE.Vector3();
      let blendFactor = 0.08;

      let activeDirectorMode = activeCue?.director?.mode || 'SUB_CHASE';
      
      // Hold underwater North-facing view until the last missile leaves the tube (~7.2s)
      const lastMissileLeaveTubeSec = MISSILE_LAUNCH_START_SEC + (5 * 0.35) + 0.4;
      if (tSec >= SUB_POSITIONING_SEC && tSec < lastMissileLeaveTubeSec) {
        activeDirectorMode = 'SUB_CHASE';
      }

      switch (activeDirectorMode) {
        case 'SUB_CHASE': {
          const underwaterCam = positionCameraFacingNorthBelowWater(currentSubPos);
          targetCamPos.copy(underwaterCam.targetCamPos);
          targetLookAt.copy(underwaterCam.targetLookAt);
          blendFactor = 0.06;
          break;
        }

        case 'MISSILE_CHASE': {
          const activeMissilePos = sixthMissilePos || leadMissilePos;
          if (activeMissilePos) {
            const camOffset = sixthMissileTangent.clone().multiplyScalar(-4.5).add(new THREE.Vector3(0, 1.2, 0));
            targetCamPos.copy(activeMissilePos).add(camOffset);
            targetLookAt.copy(activeMissilePos).add(sixthMissileTangent.clone().multiplyScalar(10.0));
            blendFactor = 0.15;
          } else {
            const underwaterCam = positionCameraFacingNorthBelowWater(currentSubPos);
            targetCamPos.copy(underwaterCam.targetCamPos);
            targetLookAt.copy(underwaterCam.targetLookAt);
          }
          break;
        }

        case 'PAN_TO_TARGET':
          targetCamPos.copy(assets.depotTarget).add(new THREE.Vector3(0, 3.5, -6.0));
          targetLookAt.copy(assets.depotTarget);
          blendFactor = 0.08;
          break;

        case 'TRACK_ACTOR':
          targetCamPos.copy(currentHeloPos).add(new THREE.Vector3(-3.0, 1.8, 3.5));
          targetLookAt.copy(currentHeloPos);
          blendFactor = 0.08;
          break;

        case 'SKY_PULLAWAY':
        case 'LANDING_LZ':
        default: {
          const pullT = THREE.MathUtils.clamp((tSec - INSERTION_START_SEC) / 4.5, 0, 1);
          targetCamPos.copy(assets.operatorsGroup.position).add(new THREE.Vector3(0, 2.0 + pullT * 12.0, 3.0 + pullT * 14.0));
          targetLookAt.copy(assets.operatorsGroup.position);
          blendFactor = 0.05;
          break;
        }
      }

      if (controls) {
        camera.position.lerp(targetCamPos, blendFactor);
        controls.target.lerp(targetLookAt, blendFactor);
        controls.update();
      } else {
        camera.position.lerp(targetCamPos, blendFactor);
        camera.up.set(0, 1, 0);
        const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
        currentLookAt.lerp(targetLookAt, blendFactor);
        camera.lookAt(currentLookAt);
      }
    },
    cleanup: () => {
      scene.remove(assets.replayGroup);
    },
  };
}