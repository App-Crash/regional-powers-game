import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { type BattleReport } from '../types/battleReport';

interface BattleDirectorProps {
  report: BattleReport;
  getHexWorldPos: (hexId: string) => THREE.Vector3; // Hook into your existing hex map lookup
  orbitControlsRef: React.RefObject<any>;
  onTimeUpdate: (sec: number, simClock: string, headline: string, note: string) => void;
  onComplete: () => void;
}

export const BattleDirector: React.FC<BattleDirectorProps> = ({
  report,
  getHexWorldPos,
  orbitControlsRef,
  onTimeUpdate,
  onComplete,
}) => {
  const { camera, scene } = useThree();
  const elapsedRef = useRef(0);
  const completedRef = useRef(false);

  // Refs for animated 3D actors
  const tankGroupRef = useRef<THREE.Group>(null);
  const heliGroupRef = useRef<THREE.Group>(null);
  const missileRefs = useRef<(THREE.Mesh | null)[]>([]);
  const explosionRef = useRef<THREE.Mesh>(null);
  const operatorsRef = useRef<THREE.Group>(null);

  // Lock free camera OrbitControls during cinematic playback
  useEffect(() => {
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
    return () => {
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
      scene.fog = new THREE.FogExp2(0x0b101b, 0.012); // Restore default night fog
    };
  }, [orbitControlsRef, scene]);

  // Precompute 3D splines from your hex map coordinates
  const splines = useMemo(() => {
    const borderStart = getHexWorldPos('HEX-COL-CUCUTA-BORDER');
    const highwayMid = getHexWorldPos('HEX-VEN-TACHIRA-HIGHWAY');
    const highwayDeep = getHexWorldPos('HEX-VEN-BARINAS-ROAD');

    const subPos = getHexWorldPos('HEX-CARIBBEAN-SUB-01').clone().setY(-1.8);
    const depotPos = getHexWorldPos('HEX-VEN-MARACAY-DEPOT');

    const fobPos = getHexWorldPos('HEX-COL-ARAUCA-FOB');
    const lzPos = getHexWorldPos('HEX-VEN-CARACAS-OUTSKIRTS');

    return {
      tankColumn: new THREE.CatmullRomCurve3([borderStart, highwayMid, highwayDeep]),
      heliFlight: new THREE.CatmullRomCurve3([
        fobPos.clone().add(new THREE.Vector3(0, 0.2, 0)),
        fobPos.clone().lerp(lzPos, 0.5).add(new THREE.Vector3(0, 1.4, 0)), // Nap-of-the-earth
        lzPos.clone().add(new THREE.Vector3(0, 0.15, 0)), // Touchdown
      ]),
      missiles: Array.from({ length: 8 }, (_, i) => {
        const jitter = new THREE.Vector3((i - 3.5) * 0.25, 0, ((i % 3) - 1) * 0.25);
        return new THREE.CatmullRomCurve3([
          subPos.clone().add(jitter),
          subPos.clone().add(new THREE.Vector3(0, 2.2, 0)).add(jitter),
          subPos.clone().lerp(depotPos, 0.5).add(new THREE.Vector3(0, 1.6, 0)).add(jitter),
          depotPos.clone(),
        ]);
      }),
    };
  }, [getHexWorldPos]);

  useFrame((_, delta) => {
    if (completedRef.current) return;

    elapsedRef.current += delta;
    const tSec = elapsedRef.current;

    // Find active chapter
    const chapter =
      report.chapters.find((c) => tSec >= c.startSec && tSec < c.endSec) ||
      report.chapters[report.chapters.length - 1];

    onTimeUpdate(tSec, chapter.simClock, chapter.headline, chapter.telemetryNote);

    const chapterProgress = THREE.MathUtils.clamp(
      (tSec - chapter.startSec) / (chapter.endSec - chapter.startSec),
      0,
      1
    );

    // 1. Animate Tank Column (Chapters 1 & 4)
    if (tankGroupRef.current) {
      const tankT = THREE.MathUtils.clamp(tSec / 17.5, 0, 1);
      const pos = splines.tankColumn.getPointAt(tankT);
      const tangent = splines.tankColumn.getTangentAt(tankT);
      tankGroupRef.current.position.copy(pos);
      tankGroupRef.current.lookAt(pos.clone().add(tangent));
    }

    // 2. Animate Submarine 8-Missile Volley (Chapter 2: 5s - 10s)
    const subT = THREE.MathUtils.clamp((tSec - 5.0) / 5.0, 0, 1);
    missileRefs.current.forEach((m, idx) => {
      if (!m) return;
      m.visible = tSec >= 5.0 && tSec <= 10.2;
      const staggeredT = THREE.MathUtils.clamp((subT - idx * 0.02) / 0.84, 0, 1);
      const pos = splines.missiles[idx].getPointAt(staggeredT);
      const tangent = splines.missiles[idx].getTangentAt(staggeredT);
      m.position.copy(pos);
      m.lookAt(pos.clone().add(tangent));
    });

    // 3. Animate 3 Blackhawks (Chapters 3 & 5)
    if (heliGroupRef.current) {
      const heliT = THREE.MathUtils.clamp((tSec - 10.0) / 10.5, 0, 1);
      const pos = splines.heliFlight.getPointAt(heliT);
      const tangent = splines.heliFlight.getTangentAt(heliT);
      heliGroupRef.current.position.copy(pos);
      heliGroupRef.current.lookAt(pos.clone().add(tangent));
    }

    // 4. Special Forces Disembark (Chapter 5: 19.5s - 21.5s)
    if (operatorsRef.current) {
      operatorsRef.current.visible = tSec >= 19.5;
      const fanOut = THREE.MathUtils.clamp((tSec - 19.5) / 2.0, 0, 1);
      operatorsRef.current.children.forEach((op, idx) => {
        const angle = (idx - 2.5) * 0.35;
        op.position.set(Math.sin(angle) * fanOut * 1.2, 0.1, Math.cos(angle) * fanOut * 1.5);
      });
    }

    // 5. ATGM Tank Kill Explosion (Chapter 4: 15.2s - 17.5s)
    if (explosionRef.current && tankGroupRef.current) {
      const isHit = tSec >= 15.2 && tSec <= 17.5;
      explosionRef.current.visible = isHit;
      if (isHit) {
        explosionRef.current.position.copy(tankGroupRef.current.position).add(new THREE.Vector3(0, 0.4, 0));
        const scale = 0.5 + ((tSec - 15.2) / 2.3) * 2.2;
        explosionRef.current.scale.setScalar(scale);
      }
    }

    // 6. Camera Choreography
    const focusPos = getHexWorldPos(chapter.focusHexId);
    const offset = new THREE.Vector3(...chapter.cameraOffset);

    if (chapter.cameraMode === 'SUB_CHASE' && missileRefs.current[0]) {
      const leadPos = missileRefs.current[0].position;
      camera.position.lerp(leadPos.clone().add(new THREE.Vector3(1.5, subT < 0.25 ? -0.6 : 1.8, 3.2)), 0.12);
      camera.lookAt(leadPos);
    } else if (chapter.cameraMode === 'SKY_PULLAWAY') {
      // Dramatic high-altitude ascent leaving outcome ambiguous
      const skyPos = focusPos.clone().add(new THREE.Vector3(0, 4 + chapterProgress * 24, 6 + chapterProgress * 22));
      camera.position.lerp(skyPos, 0.08);
      camera.lookAt(focusPos);
    } else {
      // Track active unit group or target hex
      const targetLook =
        chapter.id.includes('BORDER') || chapter.id.includes('AMBUSH')
          ? tankGroupRef.current?.position || focusPos
          : chapter.id.includes('FOB') || chapter.id.includes('SPECOPS')
          ? heliGroupRef.current?.position || focusPos
          : focusPos;

      camera.position.lerp(targetLook.clone().add(offset), 0.1);
      camera.lookAt(targetLook);
    }

    // Automatic underwater teal fog vs. night atmosphere switch
    if (camera.position.y < 0) {
      scene.fog = new THREE.FogExp2(0x041e2b, 0.09);
    } else {
      scene.fog = new THREE.FogExp2(0x0b101b, 0.012);
    }

    // Trigger Newspaper Reveal at 25.0s
    if (tSec >= 25.0) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <group name="BattleReplayActors">
      {/* Mechanized Tank Column (4 hulls) */}
      <group ref={tankGroupRef}>
        {[0, -0.7, -1.4, -2.1].map((zOffset, i) => (
          <mesh key={i} position={[0, 0.15, zOffset]}>
            <boxGeometry args={[0.35, 0.22, 0.55]} />
            <meshStandardMaterial color={i === 0 && elapsedRef.current > 15.2 ? '#1f2937' : '#3f6212'} />
          </mesh>
        ))}
      </group>

      {/* 8 Submarine Cruise Missiles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (missileRefs.current[i] = el)}
          visible={false}
        >
          <coneGeometry args={[0.08, 0.45, 8]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
      ))}

      {/* 3 Blackhawk Helicopters */}
      <group ref={heliGroupRef}>
        {[
          [0, 0, 0],
          [-0.7, 0.1, -0.6],
          [0.7, -0.05, -0.6],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.25, 0.2, 0.65]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        ))}
      </group>

      {/* Special Forces Operators Fanning Out with Long Guns */}
      <group ref={operatorsRef} position={getHexWorldPos('HEX-VEN-CARACAS-OUTSKIRTS')} visible={false}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        ))}
      </group>

      {/* ATGM / Depot Explosion Sphere */}
      <mesh ref={explosionRef} visible={false}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.85} />
      </mesh>
    </group>
  );
};