import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { initScene } from './SceneSetup';
import { createDetailedBuilding } from './BuildingModels';
import { createHexGridGroup, getHexCenterPosition } from './HexGridLayer';
import { setupHexSelection } from './HexSelectionManager';
import { TERRAIN_ROTATION_X } from './CurvedTerrain';
import type { HexMetadata } from './HexSelectionManager';

interface CurvedEarthMapProps {
  layers: {
    hexGrid: boolean;
    topology: boolean;
    resources: boolean;
    econ: boolean;
    milUnits: boolean;
  };
  onSelectHex: (hex: HexMetadata | null) => void;
}

export const CurvedEarthMap: React.FC<CurvedEarthMapProps> = ({ layers, onSelectHex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef(layers);
  layersRef.current = layers;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Initialize Scene & Camera Controls
    const { scene, camera, renderer, controls } = initScene(container);

    // 2. Custom Satellite Background Plane (1345x722 screenshot scaled to 71.25 x 38.25 world units)
    const textureLoader = new THREE.TextureLoader();
    const satelliteTexture = textureLoader.load('/regional-power-map.png', undefined, undefined, () => {
      console.warn('Satellite underlay texture /regional-power-map.png not found. Falling back to procedural terrain.');
    });

    const planeWidth = 71.25;
    const planeHeight = 38.25;
    const planeGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
    const planeMat = new THREE.MeshBasicMaterial({
      map: satelliteTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const backgroundPlane = new THREE.Mesh(planeGeo, planeMat);
    backgroundPlane.rotation.x = TERRAIN_ROTATION_X;
    backgroundPlane.position.set(0, -0.1, 0); // Positioned right beneath the hex grid
    scene.add(backgroundPlane);

    // 3. Structure & Hex Layer Groups (~30x30 Grid)
    const structuresGroup = new THREE.Group();
    scene.add(structuresGroup);

    const capPos = getHexCenterPosition(0, 0);
    structuresGroup.add(createDetailedBuilding('n1', capPos.x, capPos.y, 'CAPITAL'));

    const mfgPos = getHexCenterPosition(-4, 3);
    structuresGroup.add(createDetailedBuilding('n2', mfgPos.x, mfgPos.y, 'MANUFACTURING'));

    const milPos = getHexCenterPosition(5, -4);
    structuresGroup.add(createDetailedBuilding('n3', milPos.x, milPos.y, 'MILITARY_BASE'));

    const portPos = getHexCenterPosition(6, 5);
    structuresGroup.add(createDetailedBuilding('n4', portPos.x, portPos.y, 'PORT'));

    const hexGridGroup = createHexGridGroup();
    scene.add(hexGridGroup);

    // 4. Right-Click Hex Selection Setup
    const cleanupSelection = setupHexSelection(
      renderer.domElement,
      camera,
      scene,
      hexGridGroup,
      (hex) => onSelectHex(hex)
    );

    // 5. Render & Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      structuresGroup.visible = layersRef.current.milUnits || layersRef.current.econ;
      hexGridGroup.visible = layersRef.current.hexGrid;
      backgroundPlane.visible = layersRef.current.topology || layersRef.current.hexGrid;
      controls.update();
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
      cleanupSelection();
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectHex]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-slate-950 select-none overflow-hidden" />
  );
};