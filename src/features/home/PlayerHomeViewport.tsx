import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { CurvedEarthMap } from './CurvedEarthMap';
import type { RuntimeHexEntity } from './HexTypes';
import { TheaterViewport } from './TheaterViewport';
import { playSoundForHex, stopSectorSound } from './sectorAudio';
import { buildTheaterRegion } from '../../services/factions';
import { getEraThemeConfig } from '../../services/theater/eraConfig';
import type { useTheaterEditor } from '../editor/TheaterEditorState';
import { type BattleReport } from '../../types/battleReport';
import { MOCK_CARACAS_REPORT } from '../../data/mockOperationCaracas';
import { useUnitOrders } from '../orders/useUnitOrders';
import { UnitStatsHUD } from '../orders/UnitStatsHUD';

interface PlayerHomeViewportProps {
  editor: ReturnType<typeof useTheaterEditor>;
  onLaunchCampaign: (viewportBoundsOrReport: any) => void;
  activeBattleReport: BattleReport | null;
  onBattleComplete: () => void;
  onTimeUpdate: (simClock: string, headline: string, note: string) => void;
}

export const PlayerHomeViewport: React.FC<PlayerHomeViewportProps> = ({
  editor,
  onLaunchCampaign,
  activeBattleReport,
  onBattleComplete,
  onTimeUpdate,
}) => {
  const theater = useMemo(() => new TheaterViewport(), []);
  const orbitControlsRef = useRef<any>(null);
  const orders = useUnitOrders();

  const era = 'cold_war_1983';
  const theme = useMemo(() => getEraThemeConfig(era), [era]);

  const [regionalHexes] = useState<RuntimeHexEntity[]>(() => buildTheaterRegion('SA'));
  const [layers, setLayers] = useState({
    hexGrid: true,
    topology: true,
    resources: true,
    econ: true,
    milUnits: true,
    politicalControl: true,
    borders: true,
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Diagnostic refs to verify bounding boxes
  const telemetryRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (telemetryRef.current) {
      const rect = telemetryRef.current.getBoundingClientRect();
      console.log(`[Layout Diagnostic] Telemetry Menu Rect:`, { top: rect.top, right: rect.right, width: rect.width, height: rect.height });
    }
  }, [activeDropdown]);

  useEffect(() => {
    if (dossierRef.current && orders.inspectedHex) {
      const rect = dossierRef.current.getBoundingClientRect();
      console.log(`[Layout Diagnostic] Sector Dossier Rect:`, { top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }
  }, [orders.inspectedHex]);

  useEffect(() => {
    console.log(`[State Diagnostic] orders.activeUnit changed:`, orders.activeUnit);
  }, [orders.activeUnit]);

  useEffect(() => {
    console.log(`[State Diagnostic] orders.inspectedHex changed:`, orders.inspectedHex);
  }, [orders.inspectedHex]);

  useEffect(() => {
    const handleExecute = () => {
      if (onLaunchCampaign) {
        onLaunchCampaign(MOCK_CARACAS_REPORT);
      }
    };
    window.addEventListener('execute-scenario', handleExecute as EventListener);
    return () => {
      window.removeEventListener('execute-scenario', handleExecute as EventListener);
    };
  }, [onLaunchCampaign]);

  const handleSelectHex = (hex: RuntimeHexEntity | null) => {
    if (!hex) {
      console.log(`[Layout Diagnostics] Sector Dossier closed (null hex).`);
      orders.inspectHex(null);
      stopSectorSound();
      return;
    }

    console.log(`[Layout Diagnostics] Sector Dossier opening for hex:`, { q: hex.q, r: hex.r, name: hex.sett_name });
    playSoundForHex(hex);

    if (editor.mode === 'player' && orders.phase !== 'IDLE' && orders.activeUnit) {
      if (orders.handleDestinationClick(hex)) {
        return;
      }
    }

    orders.inspectHex(hex);
  };

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getHexWorldPos = useCallback((hexId: string): THREE.Vector3 => {
    const coordinateMap: Record<string, [number, number, number]> = {
      'HEX-COL-CUCUTA-BORDER': [-4.2, 0.4, 1.2],
      'HEX-VEN-TACHIRA-HIGHWAY': [-2.8, 0.5, 1.0],
      'HEX-VEN-BARINAS-ROAD': [-1.2, 0.6, 0.5],
      'HEX-CARIBBEAN-SUB-01': [-3.0, -1.8, -3.5],
      'HEX-VEN-MARACAY-DEPOT': [0.5, 0.8, -0.2],
      'HEX-COL-ARAUCA-FOB': [-3.8, 0.4, 2.2],
      'HEX-VEN-CARACAS-OUTSKIRTS': [0.2, 0.7, -0.8],
      'HEX-VEN-MIRAFLORES-COMPOUND': [0.4, 0.75, -1.0],
    };
    const coords = coordinateMap[hexId];
    return coords ? new THREE.Vector3(...coords) : new THREE.Vector3(0, 0.5, 0);
  }, []);

  const resolvedBattleReport: BattleReport | null = activeBattleReport ? activeBattleReport : null;
  const handleBattleCompleteSafe = (): void => {
    if (onBattleComplete) {
      onBattleComplete();
    }
  };
  const handleTimeUpdateSafe = (simClock: string, headline: string, note: string): void => {
    if (onTimeUpdate) {
      onTimeUpdate(simClock, headline, note);
    }
  };

  const activeTiles = theater.getActiveTiles();
  const hexUnits = orders.inspectedHex ? orders.getUnitsAtHex(orders.inspectedHex.q, orders.inspectedHex.r) : [];

  return (
    <div className={`w-full h-full overflow-hidden relative ${theme.containerClasses}`}>
      {/* Background 3D Map Viewport (Fills entire screen) */}
      <div className="absolute inset-0 w-full h-full bg-black z-0">
        <CurvedEarthMap
          activeRegion="SA"
          layers={layers}
          editor={editor}
          onSelectHex={handleSelectHex}
          activeBattleReport={resolvedBattleReport}
          onBattleComplete={handleBattleCompleteSafe}
          onTimeUpdate={handleTimeUpdateSafe}
          getHexWorldPos={getHexWorldPos}
          orbitControlsRef={orbitControlsRef}
          unitMarkerPos={orders.activeUnit ? { q: orders.activeUnit.q, r: orders.activeUnit.r } : null}
          haloHexes={orders.haloHexes}
          selectedDestPos={orders.destinationHex ? { q: orders.destinationHex.q, r: orders.destinationHex.r } : null}
          allUnits={orders.units}
          selectedUnitId={orders.activeUnit ? orders.activeUnit.id : null}
        />
      </div>

      {/* Foreground UI Layer (CSS Grid Overlay with pointer-events-none, panels re-enable pointer-events-auto) */}
      <div className="absolute inset-0 z-30 pointer-events-none grid grid-cols-12 grid-rows-12 p-4 gap-4 select-none">

        {/* 1. TOP-RIGHT TELEMETRY LAYERS MENU (Row 1, Cols 9-12) */}
        <div ref={telemetryRef} className="col-start-9 col-span-4 row-start-1 flex items-start justify-end gap-3 text-xs md:text-sm tracking-wider font-mono pointer-events-auto">
          <div className={`hidden lg:flex items-center gap-1.5 bg-black/80 backdrop-blur px-3 py-1.5 rounded border ${theme.borderAccent} h-fit`}>
            <span className="opacity-70">GRID:</span>
            <span>{activeTiles.length + regionalHexes.length} TILES</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'layers' ? null : 'layers')}
              className={`px-3 py-1.5 bg-black/80 hover:bg-black rounded transition border ${theme.borderAccent} cursor-pointer font-bold shadow-lg`}
            >
              [ TELEMETRY LAYERS ▾ ]
            </button>
            {activeDropdown === 'layers' && (
              <div className={`absolute top-full right-0 mt-1 w-56 bg-slate-950 border-2 ${theme.borderAccent} rounded shadow-2xl py-1 z-50 flex flex-col text-sm`}>
                {(Object.keys(layers) as Array<keyof typeof layers>).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleLayer(key)}
                    className="px-4 py-2 text-left hover:bg-white/5 flex items-center justify-between uppercase cursor-pointer"
                  >
                    <span>{key}</span>
                    <span className={layers[key] ? 'font-bold text-emerald-400' : 'text-slate-600'}>
                      {layers[key] ? 'ACTIVE' : 'STANDBY'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. BOTTOM-LEFT SECTOR INSPECTOR DOSSIER (Row 4-12, Cols 1-4) */}
        {orders.inspectedHex && !activeBattleReport && (
          <div ref={dossierRef} className="col-start-1 col-span-4 row-start-4 row-span-8 self-end w-80 bg-black/90 backdrop-blur-md px-4 py-3 shadow-2xl flex flex-col gap-2.5 font-mono text-xs text-slate-200 pointer-events-auto border-l-2 border-sky-500 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold tracking-widest text-sky-400">
                SECTOR DOSSIER [{orders.inspectedHex.q}, {orders.inspectedHex.r}]
              </span>

              <button
                onClick={() => {
                  console.log(`[Layout Diagnostics] Sector Dossier closed by user.`);
                  orders.inspectHex(null);
                }}
                className="text-[10px] px-2 py-0.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-200 transition cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {orders.inspectedHex.sett_name && (
                <div className="flex justify-between py-1 px-2 bg-white/5">
                  <span className="opacity-60">DESIGNATION:</span>
                  <span className="font-bold text-white uppercase">{orders.inspectedHex.sett_name}</span>
                </div>
              )}
              <div className="flex justify-between py-1 px-2 bg-white/5">
                <span className="opacity-60">FACTION:</span>
                <span className="font-bold text-sky-300 uppercase">{orders.inspectedHex.fac_ctl ? orders.inspectedHex.fac_ctl : 'UNCLAIMED'}</span>
              </div>
              <div className="flex justify-between py-1 px-2 bg-white/5">
                <span className="opacity-60">TERRAIN:</span>
                <span className="font-bold uppercase">{orders.inspectedHex.terrain}</span>
              </div>
              <div className="flex justify-between py-1 px-2 bg-white/5">
                <span className="opacity-60">INFRASTRUCTURE:</span>
                <span className="font-bold text-emerald-400">TIER {orders.inspectedHex.infra} / 9</span>
              </div>
              <div className="flex justify-between py-1 px-2 bg-white/5">
                <span className="opacity-60">POPULATION:</span>
                <span>{orders.inspectedHex.population.toLocaleString()}</span>
              </div>
            </div>

            {/* Stationed Units Roster summary inside Sector Inspector */}
            <div className="border-t border-white/10 pt-2 flex flex-col gap-1.5">
              <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                Garrisoned Forces ({hexUnits.length})
              </div>
              {hexUnits.length === 0 ? (
                <div className="text-[10px] text-slate-500 italic">No military units garrisoned.</div>
              ) : (
                hexUnits.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`[Diagnostic] Garrison unit button clicked:`, unit);

                      // 1. Select the unit to update activeUnit state and open UnitStatsHUD
                      orders.selectUnit(unit.id);

                      // 2. Retain the exact current inspectedHex so the dossier modal stays intact
                      if (orders.inspectedHex) {
                        orders.inspectHex(orders.inspectedHex);
                      }
                    }}
                    className={`w-full py-1.5 px-2 text-left bg-slate-900/80 hover:bg-slate-800 flex justify-between items-center transition cursor-pointer ${
                      orders.activeUnit && orders.activeUnit.id === unit.id ? 'border-l-2 border-sky-400 text-sky-200' : 'text-slate-300'
                    }`}
                  >
                    <span className="font-bold">{unit.name}</span>
                    <span className="text-[10px] text-emerald-400">{unit.readiness}% RDY</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. BOTTOM-RIGHT UNIT SUMMARY & ORDERS CARD (Row 8-12, Cols 9-12) */}
        {editor.mode === 'player' && !activeBattleReport && (
          <div className="col-start-9 col-span-4 row-start-8 row-span-5 self-end justify-self-end pointer-events-auto">
            <UnitStatsHUD orders={orders} />
          </div>
        )}

      </div>
    </div>
  );
};