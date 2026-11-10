import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { initScene } from './SceneSetup';
import { createDetailedBuilding } from './BuildingModels';
import { createHexGridGroup, getHexCenterPosition } from './HexGridLayer';
import { setupHexSelection } from './HexSelectionManager';
import { TERRAIN_ROTATION_X } from './CurvedTerrain';
import type { HexData } from './HexDataModel';

interface CurvedEarthMapProps {
  layers: {
    hexGrid: boolean;
    topology: boolean;
    resources: boolean;
    econ: boolean;
    milUnits: boolean;
    politicalControl: boolean;
  };
  onSelectHex: (hex: HexData | null) => void;
}

export const CurvedEarthMap: React.FC<CurvedEarthMapProps> = ({ layers, onSelectHex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef(layers);
  layersRef.current = layers;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scene, camera, renderer, controls } = initScene(container);

    const textureLoader = new THREE.TextureLoader();
    const satelliteTexture = textureLoader.load('/regional-power-map.png', undefined, undefined, () => {
      console.warn('Satellite underlay texture /regional-power-map.png not found.');
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
    backgroundPlane.position.set(0, -0.1, 0);
    scene.add(backgroundPlane);

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

    const { gridGroup, controlGroup } = createHexGridGroup();
    scene.add(gridGroup);

    const cleanupSelection = setupHexSelection(
      renderer.domElement,
      camera,
      scene,
      gridGroup,
      (hex) => onSelectHex(hex)
    );

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      structuresGroup.visible = layersRef.current.milUnits || layersRef.current.econ;
      gridGroup.visible = layersRef.current.hexGrid;
      controlGroup.visible = layersRef.current.politicalControl;
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