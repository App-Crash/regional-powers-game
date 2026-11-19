import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { initScene } from './SceneSetup';
import { createHexGridGroup, rebuildHexGridFromData } from './HexGridLayer';
import { setupHexSelection } from './HexSelectionManager';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';
import { TheaterViewport } from './TheaterViewport';
import { initializeTheaterScene } from '../../rendering/loadTheaterScene';
import { createBorderTextureOverlay } from '../../rendering/CurvedBorderOverlay';
import { stopSectorSound } from './sectorAudio';
import type { HexData, RuntimeHexEntity } from './HexTypes';
import { buildTheaterRegion, type TheaterRegion } from '../../services/factions/index';
import type { useTheaterEditor } from '../editor/TheaterEditorState';
import type { BattleReport } from '../../types/battleReport';
import { initCinematicReplay } from './CinematicReplayManager';
import { renderUnitAndHaloLayer, type HaloHexEntry } from '../orders/hexRangeMath';
import { renderStationedUnitChips } from './HexUnitChipRenderer';
import { type CombatUnit } from '../../types/unitOrders';

interface CurvedEarthMapProps {
  activeRegion: TheaterRegion;
  layers: {
    hexGrid: boolean;
    topology: boolean;
    resources: boolean;
    econ: boolean;
    milUnits: boolean;
    politicalControl: boolean;
    borders: boolean;
  };
  editor: ReturnType<typeof useTheaterEditor>;
  onSelectHex: (hex: HexData | RuntimeHexEntity | null) => void;
  activeBattleReport: BattleReport | null;
  onBattleComplete: () => void;
  onTimeUpdate: (simClock: string, headline: string, note: string) => void;
  getHexWorldPos: (hexId: string) => THREE.Vector3;
  orbitControlsRef: React.RefObject<any>;
  unitMarkerPos: { q: number; r: number } | null;
  haloHexes: HaloHexEntry[];
  selectedDestPos: { q: number; r: number } | null;
  allUnits: CombatUnit[];
  selectedUnitId: string | null;
}

export const CurvedEarthMap: React.FC<CurvedEarthMapProps> = ({
  activeRegion,
  layers,
  editor,
  onSelectHex,
  activeBattleReport,
  onBattleComplete,
  onTimeUpdate,
  unitMarkerPos,
  haloHexes,
  selectedDestPos,
  allUnits,
  selectedUnitId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef(layers);
  layersRef.current = layers;

  const gridGroupRef = useRef<THREE.Group | null>(null);
  const controlGroupRef = useRef<THREE.Group | null>(null);
  const structuresGroupRef = useRef<THREE.Group | null>(null);
  const haloGroupRef = useRef<THREE.Group | null>(null);
  const unitStackGroupRef = useRef<THREE.Group | null>(null);
  const bordersGroupRef = useRef<THREE.Group | null>(null);

  const editorRef = useRef(editor);
  editorRef.current = editor;

  const onSelectHexRef = useRef(onSelectHex);
  onSelectHexRef.current = onSelectHex;

  const getCombinedTheater = () => {
    const baseRegionalHexes = buildTheaterRegion(activeRegion);
    return [...baseRegionalHexes, ...editor.cities, ...editor.fillerHexes];
  };

  useEffect(() => {
    if (!gridGroupRef.current || !controlGroupRef.current) return;
    const combinedTheater = getCombinedTheater();
    rebuildHexGridFromData(gridGroupRef.current, controlGroupRef.current, combinedTheater);
    if (structuresGroupRef.current) {
      initializeTheaterScene(structuresGroupRef.current, combinedTheater);
    }
  }, [editor.cities, editor.fillerHexes, activeRegion]);

  // Re-render halos and unit markers instantly when unit markers, halo hexes, destinations, or selected unit changes
  useEffect(() => {
    if (!haloGroupRef.current) return;
    renderUnitAndHaloLayer(haloGroupRef.current, unitMarkerPos, haloHexes, selectedDestPos);
  }, [unitMarkerPos, haloHexes, selectedDestPos, selectedUnitId]);

  useEffect(() => {
    if (!unitStackGroupRef.current) return;
    renderStationedUnitChips(unitStackGroupRef.current, allUnits, selectedUnitId);
  }, [allUnits, selectedUnitId]);

  const handleSelectHex = (hex: HexData | RuntimeHexEntity | null) => {
    if (!hex) {
      stopSectorSound();
      if (onSelectHexRef.current) onSelectHexRef.current(null);
      return;
    }

    console.log(`[CurvedEarthMap] Hex clicked: (${hex.q}, ${hex.r}) — opening sector inspection modal.`);
    stopSectorSound();

    if (onSelectHexRef.current) {
      onSelectHexRef.current(hex);
    }

    const { mode, activeCityId, selectedSeedId, isPurgeMode } = editorRef.current;
    if (mode !== 'player') {
      if (isPurgeMode) {
        editorRef.current.handlePurgeHex(hex.q, hex.r);
      } else if (selectedSeedId) {
        editorRef.current.handlePlaceSeed(hex.q, hex.r);
      } else if (activeCityId) {
        editorRef.current.handleMoveCity(hex.q, hex.r);
      }
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

    const textureLoader = new THREE.TextureLoader();
    const totalCols = 16;
    const totalRows = 16;
    const subWidth = planeWidth / totalCols;
    const subHeight = planeHeight / totalRows;
    const rotX = TERRAIN_ROTATION_X;

    activeTiles.forEach(({ col, row, path }) => {
      const tileTexture = textureLoader.load(
        path,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
        },
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

      tileMapGroup.add(new THREE.Mesh(subGeo, subMat));
    });

    scene.add(tileMapGroup);

    const structuresGroup = new THREE.Group();
    structuresGroup.name = 'TheaterStructures';
    structuresGroupRef.current = structuresGroup;
    scene.add(structuresGroup);

    const initialTheater = getCombinedTheater();
    initializeTheaterScene(structuresGroup, initialTheater);

    // Use stable border stencil helper
    const bordersGroup = createBorderTextureOverlay('/assets/colombia_border_stencil.png', -4, 9);
    bordersGroupRef.current = bordersGroup;
    scene.add(bordersGroup);

    const { gridGroup, controlGroup } = createHexGridGroup();
    gridGroupRef.current = gridGroup;
    controlGroupRef.current = controlGroup;
    scene.add(gridGroup);

    rebuildHexGridFromData(gridGroup, controlGroup, initialTheater);

    const haloGroup = new THREE.Group();
    haloGroup.name = 'UnitRangeHaloLayer';
    haloGroupRef.current = haloGroup;
    scene.add(haloGroup);
    renderUnitAndHaloLayer(haloGroup, unitMarkerPos, haloHexes, selectedDestPos);

    const unitStackGroup = new THREE.Group();
    unitStackGroup.name = 'UnitStackLayer';
    unitStackGroupRef.current = unitStackGroup;
    scene.add(unitStackGroup);
    renderStationedUnitChips(unitStackGroup, allUnits, selectedUnitId);

    const cleanupSelection = setupHexSelection(
      renderer.domElement,
      camera,
      gridGroup,
      (hex) => handleSelectHex(hex)
    );

    let replayHandle: any = null;
    const clock = new THREE.Clock();

    if (activeBattleReport) {
      replayHandle = initCinematicReplay(scene, activeBattleReport, onTimeUpdate, onBattleComplete);
    }

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      structuresGroup.visible = layersRef.current.milUnits || layersRef.current.econ;
      if (bordersGroupRef.current) {
        bordersGroupRef.current.visible =
          typeof layersRef.current.borders === 'boolean'
            ? layersRef.current.borders
            : layersRef.current.politicalControl;
      }
      gridGroup.visible = layersRef.current.hexGrid;
      controlGroup.visible = layersRef.current.politicalControl;
      tileMapGroup.visible = layersRef.current.topology || layersRef.current.hexGrid;

      if (replayHandle) {
        replayHandle.update(clock.getElapsedTime(), camera as THREE.PerspectiveCamera, controls);
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
    <div className="relative w-full h-full bg-slate-950 select-none overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};