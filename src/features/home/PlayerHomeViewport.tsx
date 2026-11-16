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

interface PlayerHomeViewportProps {
  editor: ReturnType<typeof useTheaterEditor>;
  onLaunchCampaign?: (viewportBoundsOrReport: any) => void;
  activeBattleReport?: BattleReport | null;
  onBattleComplete?: () => void;
  onTimeUpdate?: (simClock: string, headline: string, note: string) => void;
}

export const PlayerHomeViewport: React.FC<PlayerHomeViewportProps> = ({ 
  editor, 
  onLaunchCampaign,
  activeBattleReport,
  onBattleComplete,
  onTimeUpdate
}) => {
  const theater = useMemo(() => new TheaterViewport(), []);
  const orbitControlsRef = useRef<any>(null);

  const era = 'cold_war_1983';
  const theme = useMemo(() => getEraThemeConfig(era), [era]);

  const [regionalHexes] = useState<RuntimeHexEntity[]>(() =>
    buildTheaterRegion('SA')
  );

  const [layers, setLayers] = useState({
    hexGrid: true,
    topology: true,
    resources: true,
    econ: true,
    milUnits: true,
    politicalControl: true,
    borders: true,
  });

  const [selectedHex, setSelectedHex] = useState<RuntimeHexEntity | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleExecute = () => {
      if (onLaunchCampaign) {
        // Launch the mock Caracas 3D cinematic battle report scenario
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
      setSelectedHex(null);
      stopSectorSound();
      return;
    }

    playSoundForHex(hex);
    setSelectedHex(hex);
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
    if (coords) {
      return new THREE.Vector3(...coords);
    }
    
    return new THREE.Vector3(0, 0.5, 0);
  }, []);

  const getControlBadge = (control: RuntimeHexEntity['fac_ctl']) => {
    switch (control) {
      case 'ven':
      case 'col':
        return <span className={`${theme.accentText} font-bold tracking-widest uppercase`}>[{control}]</span>;
      case 'bra':
        return <span className="text-cyan-400 font-bold tracking-widest">[REGIONAL // BRA]</span>;
      case null:
      default:
        return <span className="text-slate-500 font-bold tracking-widest">[DEEP WATER / UNCLAIMED]</span>;
    }
  };

  const activeTiles = theater.getActiveTiles();

  return (
    <div className={`w-full h-full overflow-hidden flex flex-col select-none relative ${theme.containerClasses}`}>
      
      {/* Floating Telemetry & Grid Stats Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3 text-xs md:text-sm tracking-wider font-mono pointer-events-auto">
        <div className={`hidden lg:flex items-center gap-1.5 bg-black/80 backdrop-blur px-3 py-1.5 rounded border ${theme.borderAccent}`}>
          <span className="opacity-70">GRID:</span>
          <span>{activeTiles.length + regionalHexes.length} TILES</span>
        </div>
        <div className={`hidden lg:flex items-center gap-1.5 bg-black/80 backdrop-blur px-3 py-1.5 rounded border ${theme.borderAccent}`}>
          <span className="opacity-70">SA SECTORS:</span>
          <span>{regionalHexes.length}</span>
        </div>

        {/* Telemetry Layers Dropdown */}
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

      {/* Main Map Viewport */}
      <main className="relative w-full h-full overflow-hidden bg-black">
        <CurvedEarthMap 
          activeRegion="SA" 
          layers={layers} 
          editor={editor} 
          onSelectHex={handleSelectHex} 
          activeBattleReport={activeBattleReport}
          onBattleComplete={onBattleComplete}
          onTimeUpdate={onTimeUpdate}
          getHexWorldPos={getHexWorldPos}
          orbitControlsRef={orbitControlsRef}
        />

        {selectedHex && !activeBattleReport && (
          <div className={`absolute top-4 left-4 z-30 w-80 min-w-[280px] bg-slate-950 border-2 ${theme.borderAccent} rounded shadow-2xl p-4 flex flex-col gap-3 select-none font-mono`}>
            <div className={`flex items-center justify-between border-b ${theme.borderAccent} pb-2`}>
              <span className="font-bold tracking-widest">
                SECTOR [{selectedHex.q}, {selectedHex.r}]
              </span>
              <button
                onClick={() => setSelectedHex(null)}
                className={`text-xs px-2 py-0.5 rounded bg-black border ${theme.borderAccent} transition cursor-pointer`}
              >
                [CLOSE]
              </button>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              {selectedHex.sett_name && (
                <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-white/10">
                  <span className="opacity-70">DESIGNATION:</span>
                  <span className="font-bold uppercase">{selectedHex.sett_name}</span>
                </div>
              )}
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-white/10">
                <span className="opacity-70">STATUS:</span>
                <span>{getControlBadge(selectedHex.fac_ctl)}</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-white/10">
                <span className="opacity-70">TERRAIN:</span>
                <span className="font-bold uppercase">{selectedHex.terrain}</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-white/10">
                <span className="opacity-70">INFRASTRUCTURE:</span>
                <span className="font-bold">TIER {selectedHex.infra} / 9</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-white/10">
                <span className="opacity-70">POPULATION:</span>
                <span>{selectedHex.population.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};