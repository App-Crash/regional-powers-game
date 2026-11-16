import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// --- TypeScript Interfaces ---
interface SubmarineSalvoDirectorProps {
  onComplete?: () => void;
  playbackDuration?: number; // default 15 seconds
}

export const SubmarineSalvoDirector: React.FC<SubmarineSalvoDirectorProps> = ({
  onComplete,
  playbackDuration = 15.0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'director' | 'free'>('director');
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b101b);
    scene.fog = new THREE.FogExp2(0x0b101b, 0.02);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- 2. LIGHTING & ENVIRONMENT ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xaaccff, 1.2);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Ocean surface plane at y = 0 (North of Caracas / Caribbean Sea)
    const waterGeo = new THREE.PlaneGeometry(300, 300, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x052b3d,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0;
    scene.add(water);

    // Venezuelan Coastal Range & Inland Terrain (South of coastline)
    const terrainGeo = new THREE.PlaneGeometry(150, 150, 16, 16);
    const terrainMat = new THREE.MeshStandardMaterial({ color: 0x1c2b18, roughness: 0.9 });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.set(0, -0.1, -50); // Positioned inland relative to sub
    scene.add(terrain);

    // Target Inland Command Node / Depot (South of Caracas)
    const depotGeo = new THREE.BoxGeometry(4, 2, 4);
    const depotMat = new THREE.MeshStandardMaterial({ color: 0x883333 });
    const depot = new THREE.Mesh(depotGeo, depotMat);
    depot.position.set(0, 1, -55);
    scene.add(depot);

    // --- 3. GEOGRAPHIC ANCHORS (NORTH OF CARACAS) ---
    // Submarine positioned off the coast in the Caribbean (North)
    const subPos = new THREE.Vector3(0, -3.5, 12); 
    // Target inland south of the coastal ridge
    const targetPos = new THREE.Vector3(0, 1, -55); 
    
    // Waypoints ensuring low-altitude nap-of-the-earth flight over mountains
    const waypoints: THREE.Vector3[] = [
      new THREE.Vector3(0, 0.5, 2),    // Surface breach point (La Guaira Coast)
      new THREE.Vector3(1.5, 3.5, -15), // Surmounting the coastal range (Ávila ridge)
      new THREE.Vector3(-1, 2.5, -35)   // Caracas valley descent approach
    ];

    // Submarine Hull Mesh
    const subGroup = new THREE.Group();
    const hullGeo = new THREE.CylinderGeometry(1.2, 1.2, 12, 16);
    hullGeo.rotateX(Math.PI / 2);
    const subMat = new THREE.MeshStandardMaterial({ color: 0x1f2b2d, metalness: 0.7, roughness: 0.3 });
    const hull = new THREE.Mesh(hullGeo, subMat);
    subGroup.add(hull);
    subGroup.position.copy(subPos);
    scene.add(subGroup);

    // --- 4. MISSILES & FLIGHT SPLINES ---
    const missileGroup = new THREE.Group();
    scene.add(missileGroup);

    const missiles: THREE.Mesh[] = [];
    const curves: THREE.CatmullRomCurve3[] = [];

    for (let i = 0; i < 8; i++) {
      const spread = new THREE.Vector3(
        (Math.random() - 0.5) * 2.0,
        0,
        (Math.random() - 0.5) * 2.0
      );

      const pts: THREE.Vector3[] = [
        subPos.clone().add(new THREE.Vector3((i - 3.5) * 0.3, 0, 0)),
        subPos.clone().add(new THREE.Vector3(0, 2.5, 0)).add(spread),
        ...waypoints.map((wp) => wp.clone().add(spread)),
        targetPos.clone().add(spread.multiplyScalar(0.3))
      ];

      curves.push(new THREE.CatmullRomCurve3(pts));

      const mGeo = new THREE.ConeGeometry(0.2, 1.2, 8);
      mGeo.rotateX(Math.PI / 2);
      const mMat = new THREE.MeshBasicMaterial({ color: 0xffaa44 });
      const missileMesh = new THREE.Mesh(mGeo, mMat);
      missileGroup.add(missileMesh);
      missiles.push(missileMesh);
    }

    // Director Cinematic Camera Spline Path
    const cameraCurve = new THREE.CatmullRomCurve3([
      subPos.clone().add(new THREE.Vector3(3.0, -1.5, 5.0)), // Underwater look-up beside hull
      subPos.clone().add(new THREE.Vector3(1.2, 3.0, 7.0)),  // Surface breach chase
      waypoints[1].clone().add(new THREE.Vector3(0, 2.0, 4.0)), // Mountain ridge chase
      targetPos.clone().add(new THREE.Vector3(7.0, 10.0, 10.0)) // High overwatch pull-back for impact
    ]);

    // --- 5. ANIMATION & RENDER LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let currentT = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (isPlaying) {
        currentT += delta / playbackDuration;
        if (currentT >= 1.0) {
          currentT = 1.0;
          if (onComplete) onComplete();
        }
        setTime(currentT * playbackDuration);
      }

      // Update Missiles Staggered Positions
      missiles.forEach((mesh, idx) => {
        const localT = THREE.MathUtils.clamp((currentT - idx * 0.015) / (1 - 8 * 0.015), 0, 1);
        const pos = curves[idx].getPointAt(localT);
        const tangent = curves[idx].getTangentAt(localT);

        mesh.position.copy(pos);
        if (localT > 0 && localT < 1) {
          mesh.visible = true;
          mesh.lookAt(pos.clone().add(tangent));
        } else {
          mesh.visible = false;
        }
      });

      // Director Camera Tracking
// Director Camera Tracking
      if (cameraMode === 'director') {
        const camPos = cameraCurve.getPointAt(currentT);
        camera.position.lerp(camPos, 0.1);

        const lookTarget = currentT < 0.85 ? missiles[0].position : depot.position;
        camera.lookAt(lookTarget);

        // Dynamic Atmospheric Fog Swap (Underwater vs Air)
        if (scene.fog) {
          const fog = scene.fog as THREE.FogExp2;
          if (camera.position.y < 0) {
            fog.color.setHex(0x041e2b);
            fog.density = 0.08;
          } else {
            fog.color.setHex(0x0b101b);
            fog.density = 0.025;
          }
        }
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cameraMode, isPlaying, playbackDuration, onComplete]);

  return (
    <div className="relative w-full h-[650px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* CRT HUD Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/90 border border-emerald-500/40 p-3 rounded text-emerald-400 font-mono text-xs pointer-events-none backdrop-blur">
        <div className="font-bold tracking-wider text-emerald-300">OP-IRON-CONDOR // NORTH CARACAS SALVO</div>
        <div className="mt-1">STATUS: {isPlaying ? 'PLAYING' : 'PAUSED'}</div>
        <div>CAM: {cameraMode.toUpperCase()}</div>
        <div>TIME: {time.toFixed(1)}s / {playbackDuration}s</div>
      </div>

      {/* Playback Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-full flex items-center gap-4 text-white text-sm shadow-lg backdrop-blur">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded font-semibold transition"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => { setTime(0); }}
          className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition"
        >
          Restart
        </button>
        <div className="h-4 w-px bg-slate-700" />
        <button
          onClick={() => setCameraMode(cameraMode === 'director' ? 'free' : 'director')}
          className={`px-3 py-1 rounded font-medium transition ${cameraMode === 'director' ? 'bg-indigo-600' : 'bg-slate-700'}`}
        >
          Cam: {cameraMode === 'director' ? 'Director Chase' : 'Free 3D'}
        </button>
      </div>
    </div>
  );
};

export default SubmarineSalvoDirector;