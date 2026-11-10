import React, { useState } from 'react';
import { CurvedEarthMap } from './CurvedEarthMap';
import type { HexData } from './HexDataModel';

export const PlayerHomeViewport: React.FC = () => {
  const [layers, setLayers] = useState({
    hexGrid: true,
    topology: true,
    resources: true,
    econ: true,
    milUnits: true,
    politicalControl: true,
  });

  const [selectedHex, setSelectedHex] = useState<HexData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getControlBadge = (control: HexData['controlledBy']) => {
    switch (control) {
      case 'player':
        return <span className="text-sky-400 font-semibold">Friendly (Player)</span>;
      case 'enemy':
        return <span className="text-red-400 font-semibold">Enemy Hostile</span>;
      case 'ally':
        return <span className="text-emerald-400 font-semibold">Allied Coalition</span>;
      case 'neutral':
        return <span className="text-slate-400 font-semibold">Neutral Territory</span>;
      case null:
      default:
        return <span className="text-slate-500 font-semibold">N/A (International Waters)</span>;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-sans select-none">
      
      {/* Top Command Header */}
      <header className="h-[10%] min-h-[56px] bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500"></span>
            <h1 className="font-semibold text-slate-100 tracking-wide text-sm md:text-base">
              REGIONAL COMMAND THEATER
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'layers' ? null : 'layers')}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700"
              >
                Telemetry Layers ▾
              </button>
              {activeDropdown === 'layers' && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded shadow-xl py-1 z-50 flex flex-col">
                  <button onClick={() => toggleLayer('hexGrid')} className="px-4 py-2 text-xs text-left text-slate-300 hover:bg-slate-800 flex items-center justify-between">
                    <span>Hex Grid</span>
                    <span className={layers.hexGrid ? 'text-sky-400 font-bold' : 'text-slate-600'}>{layers.hexGrid ? 'ON' : 'OFF'}</span>
                  </button>
                  <button onClick={() => toggleLayer('politicalControl')} className="px-4 py-2 text-xs text-left text-slate-300 hover:bg-slate-800 flex items-center justify-between">
                    <span>Political Control</span>
                    <span className={layers.politicalControl ? 'text-sky-400 font-bold' : 'text-slate-600'}>{layers.politicalControl ? 'ON' : 'OFF'}</span>
                  </button>
                  <button onClick={() => toggleLayer('topology')} className="px-4 py-2 text-xs text-left text-slate-300 hover:bg-slate-800 flex items-center justify-between">
                    <span>Topology Underlay</span>
                    <span className={layers.topology ? 'text-sky-400 font-bold' : 'text-slate-600'}>{layers.topology ? 'ON' : 'OFF'}</span>
                  </button>
                  <button onClick={() => toggleLayer('econ')} className="px-4 py-2 text-xs text-left text-slate-300 hover:bg-slate-800 flex items-center justify-between">
                    <span>Economic Nodes</span>
                    <span className={layers.econ ? 'text-sky-400 font-bold' : 'text-slate-600'}>{layers.econ ? 'ON' : 'OFF'}</span>
                  </button>
                  <button onClick={() => toggleLayer('milUnits')} className="px-4 py-2 text-xs text-left text-slate-300 hover:bg-slate-800 flex items-center justify-between">
                    <span>Military Units</span>
                    <span className={layers.milUnits ? 'text-sky-400 font-bold' : 'text-slate-600'}>{layers.milUnits ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-500">Scale:</span>
            <span className="text-slate-200 font-mono">1 Hex = 50 km</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-500">Treasury:</span>
            <span className="text-emerald-400 font-mono font-medium">12,450 Cr</span>
          </div>
        </div>
      </header>

      {/* Main Map Viewport */}
      <main className="relative h-[90%] w-full overflow-hidden">
        <CurvedEarthMap layers={layers} onSelectHex={setSelectedHex} />

        {selectedHex && (
          <div className="absolute top-4 left-4 z-30 w-80 min-w-[280px] bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-4 text-slate-100 flex flex-col gap-3 select-none">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-sm tracking-wide text-sky-400">
                Sector [{selectedHex.q}, {selectedHex.r}]
              </span>
              <button 
                onClick={() => setSelectedHex(null)}
                className="text-slate-400 hover:text-slate-100 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
            
            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 px-2 rounded bg-slate-950/50">
                <span className="text-slate-400">Control Status:</span>
                <span>{getControlBadge(selectedHex.controlledBy)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 rounded bg-slate-950/50">
                <span className="text-slate-400">Terrain:</span>
                <span className="font-medium text-slate-200 capitalize">{selectedHex.terrain}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 rounded bg-slate-950/50">
                <span className="text-slate-400">Infrastructure Tier:</span>
                <span className="font-mono text-amber-400 font-bold">{selectedHex.infrastructure} / 9</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 rounded bg-slate-950/50">
                <span className="text-slate-400">Population:</span>
                <span className="font-mono text-emerald-400">{selectedHex.population.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 rounded bg-slate-950/50">
                <span className="text-slate-400">Elevation:</span>
                <span className="font-mono text-slate-200">{selectedHex.elevation} m</span>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};