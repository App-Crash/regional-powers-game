import React, { useState, useMemo } from 'react';
import { CurvedEarthMap } from './CurvedEarthMap';
import type { RuntimeHexEntity, TerrainType } from './HexTypes';
import { TheaterViewport } from './TheaterViewport';
import { playSoundForHex, stopSectorSound } from './sectorAudio';
import { buildTheaterRegion } from '../../services/factions';
import { getEraThemeConfig, type EraMode } from '../../services/theater/eraConfig';

interface PlayerHomeViewportProps {
  onLaunchCampaign?: (viewportBounds: any) => void;
}

const TERRAIN_CYCLE: TerrainType[] = [
  'plain',
  'hills',
  'mountain',
  'forest',
  'jungle',
  'marsh',
  'coastal',
  'port',
  'urban',
];

export const PlayerHomeViewport: React.FC<PlayerHomeViewportProps> = ({ onLaunchCampaign }) => {
  const theater = useMemo(() => new TheaterViewport(), []);

  const [era, setEra] = useState<EraMode>('cold_war_1983');
  const [devBrushActive, setDevBrushActive] = useState<boolean>(false);
  const theme = useMemo(() => getEraThemeConfig(era), [era]);

  const [regionalHexes, setRegionalHexes] = useState<RuntimeHexEntity[]>(() =>
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

  const handleEraChange = (nextEra: EraMode) => {
    setEra(nextEra);
    setRegionalHexes(buildTheaterRegion('SA'));
  };

  const handleSelectHex = (hex: RuntimeHexEntity | null) => {
    if (!hex) {
      setSelectedHex(null);
      stopSectorSound();
      return;
    }

    playSoundForHex(hex);

    if (devBrushActive) {
      const nextTerrain =
        TERRAIN_CYCLE[(TERRAIN_CYCLE.indexOf(hex.terrain) + 1) % TERRAIN_CYCLE.length];
      const updatedHex: RuntimeHexEntity = { ...hex, terrain: nextTerrain };
      setSelectedHex(updatedHex);
      setRegionalHexes((prev) =>
        prev.map((item) => (item.q === hex.q && item.r === hex.r ? updatedHex : item))
      );
      return;
    }

    setSelectedHex(hex);
  };

  const handleExportRegionalJson = () => {
    const payload = JSON.stringify(regionalHexes, null, 2);
    navigator.clipboard?.writeText(payload);
    console.log('EXPORTED REGIONAL THEATER JSON:', payload);
    alert(`Copied ${regionalHexes.length} South America regional hexes (${era}) to clipboard & console.`);
  };

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const handleLaunchCampaign = () => {
    const bounds = theater.getBounds();
    console.log('Launching campaign with viewport bounds:', bounds, 'Era:', era);
    if (onLaunchCampaign) {
      onLaunchCampaign(bounds);
    }
  };

  return (
    <div className={`w-screen h-screen overflow-hidden flex flex-col select-none ${theme.containerClasses}`}>
      {/* Top Command Header */}
      <header className={`h-[10%] min-h-[56px] px-6 flex items-center justify-between z-20 shadow-lg ${theme.headerClasses}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse"></span>
            <h1 className="tracking-widest text-lg md:text-xl font-bold">
              {theme.hudTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Telemetry Layers Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'layers' ? null : 'layers')}
                className={`px-3 py-1 text-sm bg-black/50 hover:bg-black/80 rounded transition border ${theme.borderAccent} cursor-pointer`}
              >
                [ TELEMETRY LAYERS ▾ ]
              </button>
              {activeDropdown === 'layers' && (
                <div className={`absolute top-full left-0 mt-1 w-56 bg-slate-950 border-2 ${theme.borderAccent} rounded shadow-xl py-1 z-50 flex flex-col text-base`}>
                  {(Object.keys(layers) as Array<keyof typeof layers>).map((key) => (
                    <button
                      key={key}
                      onClick={() => toggleLayer(key)}
                      className="px-4 py-2 text-left hover:bg-white/5 flex items-center justify-between uppercase"
                    >
                      <span>{key}</span>
                      <span className={layers[key] ? 'font-bold' : 'text-slate-600'}>
                        {layers[key] ? 'ACTIVE' : 'STANDBY'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Era Mode Selector */}
            <button
              onClick={() => handleEraChange(era === 'cold_war_1983' ? 'modern_2026' : 'cold_war_1983')}
              className={`px-3 py-1 text-sm bg-black/50 hover:bg-black/80 rounded transition border ${theme.borderAccent} cursor-pointer`}
            >
              [ ERA: {theme.label} ]
            </button>

            {/* Dev Terrain Brush Toggle */}
            <button
              onClick={() => setDevBrushActive((prev) => !prev)}
              className={`px-3 py-1 text-sm rounded transition border cursor-pointer ${
                devBrushActive
                  ? 'bg-amber-500 text-black font-bold border-amber-300'
                  : 'bg-black/50 text-slate-400 border-slate-700 hover:text-amber-300'
              }`}
            >
              [ DEV BRUSH: {devBrushActive ? 'ON' : 'OFF'} ]
            </button>

            {devBrushActive && (
              <button
                onClick={handleExportRegionalJson}
                className="px-3 py-1 text-sm bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 rounded border border-emerald-500/60 cursor-pointer"
              >
                [ EXPORT REGION JSON ]
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm tracking-wider">
          <div className={`hidden lg:flex items-center gap-1.5 bg-black px-3 py-1 rounded border ${theme.borderAccent}`}>
            <span className="opacity-70">GRID:</span>
            <span>{activeTiles.length + regionalHexes.length} TILES</span>
          </div>
          <div className={`hidden lg:flex items-center gap-1.5 bg-black px-3 py-1 rounded border ${theme.borderAccent}`}>
            <span className="opacity-70">SA SECTORS:</span>
            <span>{regionalHexes.length}</span>
          </div>

          <button
            onClick={handleLaunchCampaign}
            className="px-4 py-1.5 text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 rounded transition shadow-[0_0_12px_rgba(245,158,11,0.6)] tracking-widest cursor-pointer"
          >
            EXECUTE SCENARIO
          </button>
        </div>
      </header>

      {/* Main Map Viewport */}
      <main className="relative h-[90%] w-full overflow-hidden bg-black">
        <CurvedEarthMap activeRegion="SA" layers={layers} onSelectHex={handleSelectHex} />

        {selectedHex && (
          <div className={`absolute top-4 left-4 z-30 w-80 min-w-[280px] bg-slate-950 border-2 ${theme.borderAccent} rounded shadow-2xl p-4 flex flex-col gap-3 select-none`}>
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