import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { initScene } from './SceneSetup';
import { createHexGridGroup, rebuildHexGridFromData } from './HexGridLayer';
import { setupHexSelection } from './HexSelectionManager';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';
import { TheaterViewport } from './TheaterViewport';
import { initializeTheaterScene } from '../../rendering/loadTheaterScene';
import { createBorderTextureOverlay } from '../../rendering/CurvedBorderOverlay';
import { HexDetailsModal } from '../../components/HexDetailsModal';
import { stopSectorSound } from './sectorAudio';
import type { HexData, RuntimeHexEntity } from './HexTypes';
import { buildTheaterRegion, type TheaterRegion } from '../../services/factions/index';
import type { useTheaterEditor } from '../editor/TheaterEditorState';
import type { BattleReport } from '../../types/battleReport';
import { initCinematicReplay } from './CinematicReplayManager';

interface CurvedEarthMapProps {
  activeRegion?: TheaterRegion;
  layers: {
    hexGrid: boolean;
    topology: boolean;
    resources: boolean;
    econ: boolean;
    milUnits: boolean;
    politicalControl: boolean;
    borders?: boolean;
  };
  editor: ReturnType<typeof useTheaterEditor>;
  onSelectHex?: (hex: HexData | RuntimeHexEntity | null) => void;
  activeBattleReport?: BattleReport | null;
  onBattleComplete?: () => void;
  onTimeUpdate?: (simClock: string, headline: string, note: string) => void;
  getHexWorldPos?: (hexId: string) => THREE.Vector3;
  orbitControlsRef?: React.RefObject<any>;
}

export const CurvedEarthMap: React.FC<CurvedEarthMapProps> = ({
  activeRegion = 'SA',
  layers,
  editor,
  onSelectHex,
  activeBattleReport,
  onBattleComplete,
  onTimeUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef(layers);
  layersRef.current = layers;

  const gridGroupRef = useRef<THREE.Group | null>(null);
  const controlGroupRef = useRef<THREE.Group | null>(null);
  const structuresGroupRef = useRef<THREE.Group | null>(null);

  const [selectedHex, setSelectedHex] = useState<HexData | RuntimeHexEntity | null>(null);

  const editorRef = useRef(editor);
  editorRef.current = editor;

  const getCombinedTheater = () => {
    const baseRegionalHexes = buildTheaterRegion(activeRegion);
    return [
      ...baseRegionalHexes,
      ...editor.cities,
      ...editor.fillerHexes,
    ];
  };

  useEffect(() => {
    if (!gridGroupRef.current || !controlGroupRef.current) return;
    const combinedTheater = getCombinedTheater();
    rebuildHexGridFromData(gridGroupRef.current, controlGroupRef.current, combinedTheater);
    if (structuresGroupRef.current) {
      initializeTheaterScene(structuresGroupRef.current, combinedTheater);
    }
  }, [editor.cities, editor.fillerHexes, activeRegion]);

  const handleSelectHex = (hex: HexData | RuntimeHexEntity | null) => {
    if (!hex) {
      setSelectedHex(null);
      stopSectorSound();
      if (onSelectHex) onSelectHex(null);
      return;
    }

    const { mode, activeCityId, selectedSeedId, isPurgeMode } = editorRef.current;

    if (mode === 'player') {
      setSelectedHex(hex);
      stopSectorSound();
      if (onSelectHex) {
        onSelectHex(hex);
      }
      return;
    }

    if (isPurgeMode) {
      editorRef.current.handlePurgeHex(hex.q, hex.r);
      return;
    }
    if (selectedSeedId) {
      editorRef.current.handlePlaceSeed(hex.q, hex.r);
      return;
    }
    if (activeCityId) {
      editorRef.current.handleMoveCity(hex.q, hex.r);
      return;
    }

    editorRef.current.handleToggleHexControl(hex.q, hex.r);
  };

  // Unified Scene Initialization and Render Loop
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

    const structuresGroup = new THREE.Group();
    structuresGroup.name = 'TheaterStructures';
    structuresGroupRef.current = structuresGroup;
    scene.add(structuresGroup);

    const initialTheater = getCombinedTheater();

    initializeTheaterScene(structuresGroup, initialTheater).then((registry) => {
      console.log('[CurvedEarthMap] Theater structures initialized:', Object.keys(registry).length, 'hubs loaded.');
    });

    const bordersGroup = createBorderTextureOverlay('/assets/colombia_border_stencil.png', -4, 9);
    scene.add(bordersGroup);

    const { gridGroup, controlGroup } = createHexGridGroup();
    gridGroupRef.current = gridGroup;
    controlGroupRef.current = controlGroup;
    scene.add(gridGroup);

    rebuildHexGridFromData(gridGroup, controlGroup, initialTheater);

    const cleanupSelection = setupHexSelection(
      renderer.domElement,
      camera,
      scene,
      gridGroup,
      (hex) => handleSelectHex(hex)
    );

    // Initialize Cinematic Replay Manager if battle report is active
    let replayHandle: any = null;
    const clock = new THREE.Clock();

    if (activeBattleReport) {
      replayHandle = initCinematicReplay(scene, activeBattleReport, onTimeUpdate, onBattleComplete);
    }

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Layer visibility states
      structuresGroup.visible = layersRef.current.milUnits || layersRef.current.econ;
      bordersGroup.visible = layersRef.current.borders ?? layersRef.current.politicalControl;
      gridGroup.visible = layersRef.current.hexGrid;
      controlGroup.visible = layersRef.current.politicalControl;
      tileMapGroup.visible = layersRef.current.topology || layersRef.current.hexGrid;

      if (replayHandle) {
        const tSec = clock.getElapsedTime();
        replayHandle.update(tSec, camera as THREE.PerspectiveCamera, controls);
      }

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
      if (replayHandle) replayHandle.cleanup();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeBattleReport]);

  return (
    <div className="relative w-full h-screen bg-slate-950 select-none overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

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