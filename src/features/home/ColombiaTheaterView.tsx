import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { initializeTheaterScene } from '../../rendering/loadTheaterScene';
import { type RuntimeHexEntity } from '../../features/home/HexTypes';
import { AssetDetailsModal } from '../../components/AssetDetailsModal';

export const ColombiaTheaterView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedHex, setSelectedHex] = useState<RuntimeHexEntity | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera & Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 background

    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    // Position camera overhead angled down toward Colombia coordinates
    camera.position.set(-5, 18, 14);
    camera.lookAt(-5, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 25, 10);
    scene.add(dirLight);

    // 3. Theater Root Group
    const theaterGroup = new THREE.Group();
    scene.add(theaterGroup);

    // 4. Initialize Emergent Theater Scene (Colombia 10 Major Hubs)
    let hexRegistryMap: Record<string, RuntimeHexEntity> = {};
    initializeTheaterScene(theaterGroup).then((registry) => {
      hexRegistryMap = registry;
      setIsLoaded(true);
      console.log('[ColombiaTheaterView] Theater scene loaded with registry:', registry);
    });

    // 5. Raycasting for Hex / City Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(theaterGroup.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        // Traverse up to find the group holding the runtimeHex data
        while (obj && !obj.userData?.runtimeHex) {
          obj = obj.parent;
        }

        if (obj && obj.userData?.runtimeHex) {
          const clickedHex: RuntimeHexEntity = obj.userData.runtimeHex;
          setSelectedHex(clickedHex);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 7. Window Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* Three.js Viewport Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Indicator */}
      {!isLoaded && (
        <div className="absolute top-6 left-6 bg-slate-900/80 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg backdrop-blur text-sm font-mono animate-pulse">
          Initializing Colombia Theater & Emergent Cities...
        </div>
      )}

      {/* Asset Details Modal (Displays when a hex/city is clicked) */}
      <AssetDetailsModal 
        hexData={selectedHex} 
        onClose={() => setSelectedHex(null)} 
      />
    </div>
  );
};