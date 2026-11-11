import React, { useState, useMemo } from 'react';
import { CurvedEarthMap } from './CurvedEarthMap';
import type { HexData } from './HexTypes';
import { TheaterViewport } from './TheaterViewport';

interface PlayerHomeViewportProps {
  onLaunchCampaign?: (viewportBounds: any) => void;
}

export const PlayerHomeViewport: React.FC<PlayerHomeViewportProps> = ({ onLaunchCampaign }) => {
  // Initialize the Theater Viewport controller (full 16x16 grid by default)
  const theater = useMemo(() => new TheaterViewport(), []);

  const [layers, setLayers] = useState({
    hexGrid: true,
    topology: true,
    resources: true,
    econ: true,
    milUnits: true,
    politicalControl: true,
    borders: true, // 🌐 International borders telemetry layer
  });

  const [selectedHex, setSelectedHex] = useState<HexData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getControlBadge = (control: HexData['controlledBy']) => {
    switch (control) {
      case 'player':
        return <span className="text-wargames-amber font-bold tracking-widest">[FRIENDLY // US]</span>;
      case 'enemy':
        return <span className="text-red-500 font-bold tracking-widest">[HOSTILE // SOVIET]</span>;
      case 'ally':
        return <span className="text-emerald-400 font-bold tracking-widest">[ALLIED COALITION]</span>;
      case 'neutral':
        return <span className="text-amber-600 font-bold tracking-widest">[NEUTRAL SECTOR]</span>;
      case null:
      default:
        return <span className="text-slate-500 font-bold tracking-widest">[INTERNATIONAL WATERS]</span>;
    }
  };

  const activeTiles = theater.getActiveTiles();

  const handleLaunchCampaign = () => {
    const bounds = theater.getBounds();
    console.log("Launching campaign with viewport bounds:", bounds);
    if (onLaunchCampaign) {
      onLaunchCampaign(bounds);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black flex flex-col font-wargames select-none crt-scanlines">
      
      {/* Top WOPR Command Header */}
      <header className="h-[10%] min-h-[56px] bg-slate-950 border-b-2 border-amber-500/40 px-6 flex items-center justify-between z-20 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse"></span>
            <h1 className="wargames-amber tracking-widest text-lg md:text-xl font-bold">
              NORAD // REGIONAL COMMAND THEATER [WOPR v1.83]
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'layers' ? null : 'layers')}
                className="px-3 py-1 text-sm font-wargames text-amber-400 bg-amber-950/40 hover:bg-amber-900/50 rounded transition border border-amber-500/60 shadow-[0_0_5px_rgba(245,158,11,0.2)] cursor-pointer"
              >
                [ TELEMETRY LAYERS ▾ ]
              </button>
              {activeDropdown === 'layers' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-slate-950 border-2 border-amber-500/60 rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] py-1 z-50 flex flex-col font-wargames text-base">
                  <button onClick={() => toggleLayer('hexGrid')} className="px-4 py-2 text-left text-amber-300 hover:bg-amber-950/60 flex items-center justify-between">
                    <span>HEX GRID MESH</span>
                    <span className={layers.hexGrid ? 'text-amber-400 font-bold' : 'text-slate-600'}>{layers.hexGrid ? 'ACTIVE' : 'STANDBY'}</span>
                  </button>
                  <button onClick={() => toggleLayer('politicalControl')} className="px-4 py-2 text-left text-amber-300 hover:bg-amber-950/60 flex items-center justify-between">
                    <span>POLITICAL CONTROL</span>
                    <span className={layers.politicalControl ? 'text-amber-400 font-bold' : 'text-slate-600'}>{layers.politicalControl ? 'ACTIVE' : 'STANDBY'}</span>
                  </button>
                  <button onClick={() => toggleLayer('borders')} className="px-4 py-2 text-left text-amber-300 hover:bg-amber-950/60 flex items-center justify-between">
                    <span>INTERNATIONAL BORDERS</span>
                    <span className={layers.borders ? 'text-amber-400 font-bold' : 'text-slate-600'}>{layers.borders ? 'ACTIVE' : 'STANDBY'}</span>
                  </button>
                  <button onClick={() => toggleLayer('topology')} className="px-4 py-2 text-left text-amber-300 hover:bg-amber-950/60 flex items-center justify-between">
                    <span>TOPOLOGY UNDERLAY</span>
                    <span className={layers.topology ? 'text-amber-400 font-bold' : 'text-slate-600'}>{layers.topology ? 'ACTIVE' : 'STANDBY'}</span>
                  </button>
                  <button onClick={() => toggleLayer('econ')} className="px-4 py-2 text-left text-amber-300 hover:bg-amber-950/60 flex items-center justify-between">
                    <span>ECONOMIC NODES</span>
                    <span className={layers.econ ? 'text-amber-400 font-bold' : 'text-slate-600'}>{layers.econ ? 'ACTIVE' : 'STANDBY'}</span>
                  </button>
                  <button onClick={() => toggleLayer('milUnits')} className="px-4 py-2 text-left text-amber-300 hover:bg-amber-950/60 flex items-center justify-between">
                    <span>MILITARY DEPLOYMENTS</span>
                    <span className={layers.milUnits ? 'text-amber-400 font-bold' : 'text-slate-600'}>{layers.milUnits ? 'ACTIVE' : 'STANDBY'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm tracking-wider text-amber-400/90">
          <div className="hidden lg:flex items-center gap-1.5 bg-black px-3 py-1 rounded border border-amber-500/40">
            <span className="text-amber-600">GRID:</span>
            <span className="text-amber-300">{activeTiles.length} TILES</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 bg-black px-3 py-1 rounded border border-amber-500/40">
            <span className="text-amber-600">SCALE:</span>
            <span className="text-amber-300">1 HEX = 50 KM</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black px-3 py-1 rounded border border-amber-500/40">
            <span className="text-amber-600">RESOURCES:</span>
            <span className="text-amber-300 font-bold">12,450 CR</span>
          </div>

          {/* Launch Campaign Action Button */}
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
        <CurvedEarthMap layers={layers} onSelectHex={setSelectedHex} />

        {selectedHex && (
          <div className="absolute top-4 left-4 z-30 w-80 min-w-[280px] bg-slate-950 border-2 border-amber-500/70 rounded shadow-[0_0_20px_rgba(245,158,11,0.25)] p-4 text-amber-400 flex flex-col gap-3 select-none">
            <div className="flex items-center justify-between border-b border-amber-500/40 pb-2">
              <span className="font-bold tracking-widest text-amber-300">
                SECTOR [{selectedHex.q}, {selectedHex.r}]
              </span>
              <button 
                onClick={() => setSelectedHex(null)}
                className="text-amber-500 hover:text-amber-300 text-xs px-2 py-0.5 rounded bg-black border border-amber-500/40 transition cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>
            
            <div className="flex flex-col gap-2 text-sm text-amber-400/90">
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-amber-500/20">
                <span className="text-amber-600">STATUS:</span>
                <span>{getControlBadge(selectedHex.controlledBy)}</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-amber-500/20">
                <span className="text-amber-600">TERRAIN:</span>
                <span className="font-bold uppercase text-amber-300">{selectedHex.terrain}</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-amber-500/20">
                <span className="text-amber-600">INFRASTRUCTURE:</span>
                <span className="font-bold text-amber-300">TIER {selectedHex.infrastructure} / 9</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-amber-500/20">
                <span className="text-amber-600">POPULATION:</span>
                <span className="text-amber-300">{selectedHex.population.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-black/60 border border-amber-500/20">
                <span className="text-amber-600">ELEVATION:</span>
                <span className="text-amber-300">{selectedHex.elevation} M</span>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};