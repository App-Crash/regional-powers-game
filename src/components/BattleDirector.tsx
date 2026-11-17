// src/components/BattleDirector.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { type BattleReport } from '../types/battleReport';
import { type BattleResultJson } from '../types/operationSchema';
import { initCinematicReplay, type CinematicReplayHandle } from '../features/home/CinematicReplayManager';

interface BattleDirectorProps {
  report: BattleReport | BattleResultJson;
  getHexWorldPos: (hexId: string) => THREE.Vector3;
  orbitControlsRef: React.RefObject<any>;
  onTimeUpdate: (sec: number, simClock: string, headline: string, note: string) => void;
  onComplete: () => void;
}

export const BattleDirector: React.FC<BattleDirectorProps> = ({
  report,
  orbitControlsRef,
  onTimeUpdate,
  onComplete,
}) => {
  const { camera, scene } = useThree();
  const elapsedRef = useRef(0);
  const completedRef = useRef(false);
  const replayHandleRef = useRef<CinematicReplayHandle | null>(null);

  // Lock free camera OrbitControls during cinematic playback
  useEffect(() => {
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
    
    // Initialize our modular cinematic replay harness
    replayHandleRef.current = initCinematicReplay(
      scene,
      report,
      (simClock, headline, note) => {
        onTimeUpdate(elapsedRef.current, simClock, headline, note);
      },
      () => {
        completedRef.current = true;
        onComplete();
      }
    );

    return () => {
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
      if (replayHandleRef.current) {
        replayHandleRef.current.cleanup();
      }
      scene.fog = new THREE.FogExp2(0x0b101b, 0.012);
    };
  }, [orbitControlsRef, scene, report, onComplete, onTimeUpdate]);

  useFrame((_, delta) => {
    if (completedRef.current) return;

    elapsedRef.current += delta;
    const tSec = elapsedRef.current;

    // Delegate per-frame update to our modular CinematicReplayHandle
    if (replayHandleRef.current) {
      replayHandleRef.current.update(tSec, camera as THREE.PerspectiveCamera, orbitControlsRef.current);
    }

    // Automatic underwater teal fog vs. night atmosphere switch
    if (camera.position.y < 0) {
      scene.fog = new THREE.FogExp2(0x041e2b, 0.09);
    } else {
      scene.fog = new THREE.FogExp2(0x0b101b, 0.012);
    }
  });

  return null; // All actors and meshes are managed via the CinematicReplayGroup attached directly to the scene
};