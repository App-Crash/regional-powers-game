import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { initScene } from './SceneSetup';
import { createDetailedBuilding } from './BuildingModels';
import { createHexGridGroup, getHexCenterPosition } from './HexGridLayer';
import { setupHexSelection } from './HexSelectionManager';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';
import { TheaterViewport } from './TheaterViewport';
import type { HexData } from './HexTypes';

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

    const theater = new TheaterViewport();
    const activeTiles = theater.getActiveTiles();

    // 🔑 Generous map plane sizing ensuring the image is strictly larger than the hex mesh
    const planeWidth = 350;
    const planeHeight = 350;
    
    const tileMapGroup = new THREE.Group();
    tileMapGroup.rotation.x = TERRAIN_ROTATION_X;
    tileMapGroup.position.set(0, -0.1, 0);

    const textureLoader = new THREE.TextureLoader();
    const totalCols = 16;
    const totalRows = 16;

    const subWidth = planeWidth / totalCols;
    const subHeight = planeHeight / totalRows;

    activeTiles.forEach(({ col, row, path }) => {
      const tileTexture = textureLoader.load(
        path,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
        },
        undefined,
        () => console.warn(`Tile texture ${path} not found.`)
      );

      const subGeo = new THREE.PlaneGeometry(subWidth, subHeight, 8, 8);
      const subPos = subGeo.attributes.position;

      const xOffset = (col - totalCols / 2 + 0.5) * subWidth;
      const yOffset = (totalRows / 2 - 0.5 - row) * subHeight;

      for (let i = 0; i < subPos.count; i++) {
        const vx = subPos.getX(i) + xOffset;
        const vy = subPos.getY(i) + yOffset;
        subPos.setZ(i, getCurvatureHeight(vx, vy));
      }
      subGeo.computeVertexNormals();

      const subMat = new THREE.MeshStandardMaterial({
        map: tileTexture,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });

      const tileMesh = new THREE.Mesh(subGeo, subMat);
      tileMesh.position.set(xOffset, yOffset, 0);
      tileMapGroup.add(tileMesh);
    });

    scene.add(tileMapGroup);

    // Structures & Nodes locked to your simulation scale
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
      tileMapGroup.visible = layersRef.current.topology || layersRef.current.hexGrid;
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