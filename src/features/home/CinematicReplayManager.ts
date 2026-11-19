// src/features/home/CinematicReplayManager.ts
import * as THREE from 'three';
import type { BattleReport } from '../../types/battleReport';
import type { BattleResultJson, ScriptCue } from '../../types/operationSchema';
import { buildCinematicReplayAssets } from './CinematicReplayAssets';

export interface CinematicReplayHandle {
  update: (tSec: number, camera: THREE.PerspectiveCamera, controls: any) => void;
  cleanup: () => void;
}

export type ReplayTimeUpdateCallback = (simClock: string, headline: string, note: string) => void;
export type ReplayCompleteCallback = () => void;

interface ReplayChapterEntry {
  startSec: number;
  endSec: number;
  simClock: string;
  headline: string;
  telemetryNote: string;
}

function positionCameraFacingNorthBelowWater(subPos: THREE.Vector3): {
  targetCamPos: THREE.Vector3;
  targetLookAt: THREE.Vector3;
} {
  const underwaterY = subPos.y - 1.2;
  const targetCamPos = new THREE.Vector3(subPos.x, underwaterY, subPos.z - 4.5);
  const targetLookAt = new THREE.Vector3(subPos.x, subPos.y + 0.2, subPos.z + 3.0);
  return { targetCamPos, targetLookAt };
}

export function initCinematicReplay(
  scene: THREE.Scene,
  report: BattleReport | BattleResultJson,
  onTimeUpdate: ReplayTimeUpdateCallback | undefined,
  onComplete: ReplayCompleteCallback | undefined
): CinematicReplayHandle {
  const assets = buildCinematicReplayAssets(report);
  scene.add(assets.replayGroup);

  let hasCompleted = false;
  const playbackDuration = 26.0;

  const SUB_POSITIONING_SEC = 3.0;
  const MISSILE_LAUNCH_START_SEC = 5.0;
  const MISSILE_FLIGHT_DURATION = 8.5;
  const INSERTION_START_SEC = 19.0;

  const reportAsRecord = report as unknown as Record<string, unknown>;
  const rawCues = reportAsRecord.scriptCues;
  const scriptCues: ScriptCue[] = Array.isArray(rawCues) ? (rawCues as ScriptCue[]) : [];

  const rawChapters = reportAsRecord.chapters;
  const chapters: ReplayChapterEntry[] = Array.isArray(rawChapters)
    ? (rawChapters as ReplayChapterEntry[])
    : [];

  return {
    update: (tSec: number, camera: THREE.PerspectiveCamera, controls: any) => {
      // --- DIRECTOR SCRIPT CUE EVALUATION ---
      const matchedCue = scriptCues.find((c: ScriptCue) => tSec >= c.startSec && tSec < c.endSec);
      const fallbackCue = scriptCues.length > 0 ? scriptCues[scriptCues.length - 1] : undefined;
      const activeCue = matchedCue || fallbackCue;

      if (activeCue && onTimeUpdate) {
        onTimeUpdate(activeCue.simClock, activeCue.headline, activeCue.telemetryNote);
      } else {
        const matchedChapter = chapters.find(
          (c: ReplayChapterEntry) => tSec >= c.startSec && tSec < c.endSec
        );
        const fallbackChapter =
          chapters.length > 0 ? chapters[chapters.length - 1] : undefined;
        const chapter = matchedChapter || fallbackChapter;
        if (chapter && onTimeUpdate) {
          onTimeUpdate(chapter.simClock, chapter.headline, chapter.telemetryNote);
        }
      }

      assets.replayGroup.updateMatrixWorld(true);

      const currentSubPos = assets.subStart.clone();
      assets.subGroup.position.copy(currentSubPos);
      assets.subGroup.rotation.set(0.04, 0, 0.02);
      assets.subGroup.visible = true;
      assets.subGroup.updateMatrixWorld(true);

      // --- PHASE 1: UNIFIED SINGLE-FILE MISSILE SALVO WITH ACCELERATION MATH ---
      let sixthMissilePos: THREE.Vector3 | null = null;
      let leadMissilePos: THREE.Vector3 | null = null;
      let latestActiveMissilePos: THREE.Vector3 | null = null;

      assets.missileMeshes.forEach((m, idx) => {
        const missileStartT = MISSILE_LAUNCH_START_SEC + idx * 0.5;
        const missileEndT = missileStartT + MISSILE_FLIGHT_DURATION;

        if (tSec < missileStartT) {
          m.visible = false;
        } else if (tSec >= missileStartT && tSec <= missileEndT) {
          const tLocal = tSec - missileStartT;
          const localNormalizedT = tLocal / MISSILE_FLIGHT_DURATION;
          const clampedT = THREE.MathUtils.clamp(localNormalizedT, 0, 1);

          const acceleratedT = Math.pow(clampedT, 1.8);

          const curve = assets.missileCurves[idx];
          const pos = curve.getPointAt(acceleratedT);
          const tangent = curve.getTangentAt(acceleratedT);

          const leftWingPivot = m.userData.leftWingPivot as THREE.Group;
          const rightWingPivot = m.userData.rightWingPivot as THREE.Group;
          const stage1SmokeGroup = m.userData.stage1SmokeGroup as THREE.Group;
          const sustainerFlame = m.userData.sustainerFlame as THREE.Mesh;

          if (clampedT < 0.22) {
            // STAGE 1: COLD-LAUNCH (Wings fully collapsed/recessed inside fuselage scale.x = 0.001)
            if (leftWingPivot) leftWingPivot.scale.set(0.001, 1, 1);
            if (rightWingPivot) rightWingPivot.scale.set(0.001, 1, 1);
            if (stage1SmokeGroup) {
              stage1SmokeGroup.visible = true;
              const puffScale = THREE.MathUtils.lerp(0.5, 1.6, clampedT / 0.22);
              stage1SmokeGroup.scale.set(puffScale, puffScale, puffScale);
            }
            if (sustainerFlame) sustainerFlame.visible = false;
          } else if (clampedT >= 0.22 && clampedT < 0.35) {
            // STAGE 2: APOGEE & WING DEPLOYMENT (Wings scale out from 0.001 to 1.0)
            const snapProgress = (clampedT - 0.22) / 0.13;
            const wingScale = THREE.MathUtils.lerp(0.001, 1.0, snapProgress * snapProgress);
            if (leftWingPivot) leftWingPivot.scale.set(wingScale, 1, 1);
            if (rightWingPivot) rightWingPivot.scale.set(wingScale, 1, 1);
            if (stage1SmokeGroup) stage1SmokeGroup.visible = false;
            if (sustainerFlame) sustainerFlame.visible = true;
          } else {
            // STAGE 3: SUSTAINER FLIGHT ARC
            if (leftWingPivot) leftWingPivot.scale.set(1, 1, 1);
            if (rightWingPivot) rightWingPivot.scale.set(1, 1, 1);
            if (stage1SmokeGroup) stage1SmokeGroup.visible = false;
            if (sustainerFlame) sustainerFlame.visible = true;
          }

          m.position.copy(pos);
          m.visible = true;
          m.lookAt(pos.clone().add(tangent));
          m.updateMatrixWorld(true);

          latestActiveMissilePos = pos.clone();

          if (!leadMissilePos) {
            leadMissilePos = pos.clone();
          }

          if (idx === 5) {
            sixthMissilePos = pos.clone();
          }

          if (clampedT >= 0.98) {
            assets.triggerImpactExplosion(idx, assets.impactTargetPos);
          }
        } else {
          m.visible = false;
        }
      });

      // --- HELICOPTER CONTINUOUS FLIGHT PROGRESS ---
      const currentHeloPos = assets.heliCurve ? assets.heliCurve.getPointAt(0) : new THREE.Vector3();

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
            op.position.set(
              Math.sin(angle) * fanOut * 1.5,
              0.1,
              Math.cos(angle) * fanOut * 1.8
            );
          });
        }
      } else {
        assets.heliGroup.visible = false;
        assets.operatorsGroup.visible = false;
      }

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
      const targetCamPos = new THREE.Vector3();
      const targetLookAt = new THREE.Vector3();
      let blendFactor = 0.08;

      const cueDirector = activeCue && activeCue.director ? activeCue.director : undefined;
      let activeDirectorMode = cueDirector && cueDirector.mode ? cueDirector.mode : 'SUB_CHASE';

      // Explicit timeline window: Switch camera to track the missile pop-up and deployment phase
      const launchPhaseStart = MISSILE_LAUNCH_START_SEC - 0.2;
      const launchPhaseEnd = MISSILE_LAUNCH_START_SEC + 4.5;
      const isLaunchPhaseActive = tSec >= launchPhaseStart && tSec < launchPhaseEnd;

      if (tSec >= SUB_POSITIONING_SEC && tSec < launchPhaseStart) {
        activeDirectorMode = 'SUB_CHASE';
      } else if (isLaunchPhaseActive || activeDirectorMode === 'MISSILE_CHASE') {
        activeDirectorMode = 'MISSILE_CHASE';
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
          const activeMissilePos = latestActiveMissilePos || sixthMissilePos || leadMissilePos;
          if (activeMissilePos) {
            // Track directly behind and slightly above the active rising/deploying missile cluster
            const camOffset = new THREE.Vector3(0, 1.5, -4.8);
            targetCamPos.copy(activeMissilePos).add(camOffset);
            targetLookAt.copy(activeMissilePos).add(new THREE.Vector3(0, 0.4, 2.0));
            blendFactor = 0.12;
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
          targetCamPos
            .copy(assets.operatorsGroup.position)
            .add(new THREE.Vector3(0, 2.0 + pullT * 12.0, 3.0 + pullT * 14.0));
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
        const currentLookAt = new THREE.Vector3(0, 0, -1)
          .applyQuaternion(camera.quaternion)
          .add(camera.position);
        currentLookAt.lerp(targetLookAt, blendFactor);
        camera.lookAt(currentLookAt);
      }
    },
    cleanup: () => {
      scene.remove(assets.replayGroup);
    },
  };
}