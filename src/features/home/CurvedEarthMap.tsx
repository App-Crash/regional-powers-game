import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { initScene } from './SceneSetup';
import { createHexGridGroup } from './HexGridLayerDebug';
import { setupHexSelection } from './HexSelectionManager';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';
import { TheaterViewport } from './TheaterViewport';
import { initializeTheaterScene } from '../../rendering/loadTheaterScene';
import { createBorderTextureOverlay } from '../../rendering/CurvedBorderOverlay';
import { HexDetailsModal } from '../../components/HexDetailsModal';
import type { HexData, RuntimeHexEntity } from './HexTypes';

interface CurvedEarthMapProps {
  layers: {
    hexGrid: boolean;
    topology: boolean;
    resources: boolean;
    econ: boolean;
    milUnits: boolean;
    politicalControl: boolean;
    borders?: boolean;
  };
  onSelectHex?: (hex: HexData | RuntimeHexEntity | null) => void;
}

export const CurvedEarthMap: React.FC<CurvedEarthMapProps> = ({ layers, onSelectHex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef(layers);
  layersRef.current = layers;

  const [selectedHex, setSelectedHex] = useState<HexData | RuntimeHexEntity | null>(null);

  const handleSelectHex = (hex: HexData | RuntimeHexEntity | null) => {
    setSelectedHex(hex);
    if (onSelectHex) {
      onSelectHex(hex);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scene, camera, renderer, controls } = initScene(container);

    const theater = new TheaterViewport();
    const activeTiles = theater.getActiveTiles();

    const planeWidth = 350;
    const planeHeight = 350;
    
    const tileMapGroup = new THREE.Group();
    tileMapGroup.name = 'TileMapGroup';
    tileMapGroup.position.set(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    const totalCols = 16;
    const totalRows = 16;

    const subWidth = planeWidth / totalCols;
    const subHeight = planeHeight / totalRows;
    const rotX = TERRAIN_ROTATION_X;

    activeTiles.forEach(({ col, row, path }) => {
      const tileTexture = textureLoader.load(
        path,
        (tex) => { tex.colorSpace = THREE.SRGBColorSpace; },
        undefined,
        () => console.warn(`Tile texture ${path} not found.`)
      );

      const subGeo = new THREE.PlaneGeometry(subWidth, subHeight, 16, 16);
      const subPos = subGeo.attributes.position;

      const xOffset = (col - totalCols / 2 + 0.5) * subWidth;
      const yOffset = (totalRows / 2 - 0.5 - row) * subHeight;

      for (let i = 0; i < subPos.count; i++) {
        const vx = subPos.getX(i) + xOffset;
        const vy = subPos.getY(i) + yOffset;
        const vz = getCurvatureHeight(vx, vy);

        const rotatedY = vy * Math.cos(rotX) - vz * Math.sin(rotX);
        const rotatedZ = vy * Math.sin(rotX) + vz * Math.cos(rotX);

        subPos.setXYZ(i, vx, rotatedY, rotatedZ);
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
      tileMapGroup.add(tileMesh);
    });

    scene.add(tileMapGroup);

    // 🏙️ Emergent Colombia Theater Structures Group
    const structuresGroup = new THREE.Group();
    structuresGroup.name = 'ColombiaTheaterStructures';
    scene.add(structuresGroup);

    initializeTheaterScene(structuresGroup).then((registry) => {
      console.log('[CurvedEarthMap] Colombia theater structures initialized:', Object.keys(registry).length, 'hubs loaded.');
    });

    // 🌐 International Borders Texture Overlay Group
    const bordersGroup = createBorderTextureOverlay('/assets/colombia_border_stencil.png', -4, 9);
    scene.add(bordersGroup);

    const { gridGroup, controlGroup } = createHexGridGroup();
    scene.add(gridGroup);

    const cleanupSelection = setupHexSelection(
      renderer.domElement,
      camera,
      scene,
      gridGroup,
      (hex) => handleSelectHex(hex)
    );

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      structuresGroup.visible = layersRef.current.milUnits || layersRef.current.econ;
      bordersGroup.visible = layersRef.current.borders ?? layersRef.current.politicalControl;
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
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-950 select-none overflow-hidden">
      {/* 3D WebGL Viewport Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* UI Overlay Layer with correct pointer-events stacking */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="pointer-events-auto">
          <HexDetailsModal 
            selectedHex={selectedHex} 
            onClose={() => handleSelectHex(null)} 
          />
        </div>
      </div>
    </div>
  );
};