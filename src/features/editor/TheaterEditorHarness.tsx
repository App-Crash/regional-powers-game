import React, { useState } from 'react';
import { type RuntimeHexEntity } from '../../features/home/HexTypes';
import { buildTypeScriptChunkFiles } from './TheaterEditorEngine';

interface TheaterEditorHarnessProps {
  cities: RuntimeHexEntity[];
  fillerHexes: RuntimeHexEntity[];
  activeCityId: string | null;
  isPurgeMode: boolean;
  onSelectCityToMove: (cityId: string | null) => void;
  onTogglePurgeMode: () => void;
  onAutoFill: () => void;
  onClearFiller: () => void;
  onExport: () => void;
}

export const TheaterEditorHarness: React.FC<TheaterEditorHarnessProps> = ({
  cities,
  fillerHexes,
  activeCityId,
  isPurgeMode,
  onSelectCityToMove,
  onTogglePurgeMode,
  onAutoFill,
  onClearFiller,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-slate-900/95 border border-amber-500/80 text-amber-300 px-3 py-1.5 rounded text-xs font-mono shadow-xl hover:bg-slate-800 transition z-50 pointer-events-auto"
      >
        🛠️ Open Theater Editor (Dev Harness)
      </button>
    );
  }

  const handleDownloadAllTs = () => {
    const files = buildTypeScriptChunkFiles(cities, fillerHexes, 9);
    Object.entries(files).forEach(([filename, content], idx) => {
      setTimeout(() => {
        const blob = new Blob([content], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }, idx * 120);
    });
  };

  return (
    <div className="fixed top-4 right-4 w-80 bg-slate-900/98 border border-slate-700 text-slate-100 rounded-lg shadow-2xl p-3 font-mono text-xs space-y-3 z-50 pointer-events-auto">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <span className="font-bold text-amber-400">DEV THEATER EDITOR</span>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        • Click a city to reposition it.<br />
        • Run <span className="text-emerald-400">Auto-Fill</span> for convex hull.<br />
        • Enable <span className="text-rose-400">Purge Mode</span> to click & delete stray hexes.
      </p>

      {/* City List */}
      <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
        {cities.map((city) => {
          const isMoving = activeCityId === city.id;
          return (
            <button
              key={city.id}
              onClick={() => {
                if (isPurgeMode) onTogglePurgeMode();
                onSelectCityToMove(isMoving ? null : city.id);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded border text-left transition ${
                isMoving ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-800/80 border-slate-700'
              }`}
            >
              <div>
                <div className="font-semibold">{city.sett_name}</div>
                <div className="text-[10px] text-slate-400">Pop: {(city.population / 1_000_000).toFixed(2)}M</div>
              </div>
              <span className="px-1.5 py-0.5 bg-slate-950 rounded text-[11px] text-sky-400">
                ({city.q}, {city.r})
              </span>
            </button>
          );
        })}
      </div>

      {activeCityId && (
        <div className="bg-amber-500/10 border border-amber-500/40 text-amber-300 px-2 py-1.5 rounded text-[11px]">
          Click any map hex to snap <strong>{cities.find((c) => c.id === activeCityId)?.sett_name}</strong>.
        </div>
      )}

      {/* Purge Toggle */}
      <button
        onClick={onTogglePurgeMode}
        className={`w-full py-1.5 px-2 rounded font-semibold border transition ${
          isPurgeMode ? 'bg-rose-600/30 border-rose-500 text-rose-200' : 'bg-slate-800 border-slate-700 text-slate-300'
        }`}
      >
        {isPurgeMode ? '🔴 Purge Mode ACTIVE (Click to Erase)' : '⚪ Enable Purge Mode (Erase Hexes)'}
      </button>

      {/* Auto-Fill Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button onClick={onAutoFill} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-2 rounded transition">
          Auto-Fill ({fillerHexes.length})
        </button>
        <button onClick={onClearFiller} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 py-1.5 px-2 rounded transition">
          Clear Filler
        </button>
      </div>

      {/* Export */}
      <button onClick={handleDownloadAllTs} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-3 rounded transition shadow">
        Export ven1.ts – ven10.ts
      </button>
    </div>
  );
};