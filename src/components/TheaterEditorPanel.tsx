import React, { useState } from 'react';
import { type RuntimeHexEntity } from '../features/home/HexTypes';
import { buildTypeScriptChunkFiles } from '../services/theater/TheaterEditorEngine';

interface TheaterEditorPanelProps {
  cities: RuntimeHexEntity[];
  fillerHexes: RuntimeHexEntity[];
  activeCityId: string | null;
  onSelectCityToMove: (cityId: string | null) => void;
  onAutoFill: () => void;
  onClearFiller: () => void;
}

export const TheaterEditorPanel: React.FC<TheaterEditorPanelProps> = ({
  cities,
  fillerHexes,
  activeCityId,
  onSelectCityToMove,
  onAutoFill,
  onClearFiller,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [exportedPreview, setExportedPreview] = useState<string | null>(null);

  const handleDownloadAllTs = () => {
    const files = buildTypeScriptChunkFiles(cities, fillerHexes, 9);
    // Download each generated TS file cleanly
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
    setExportedPreview(files['ven1.ts']);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-slate-900/90 border border-amber-500/60 text-amber-300 px-3 py-1.5 rounded text-xs font-mono shadow-lg hover:bg-slate-800"
      >
        Open VEN Theater Editor
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-80 bg-slate-900/95 border border-slate-700 text-slate-100 rounded-lg shadow-2xl p-3 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <span className="font-bold text-amber-400">VEN THEATER EDITOR (8 HUBS)</span>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        1. Select a city below.<br />
        2. Click its true spot on the 3D map to move it.<br />
        3. Run <span className="text-emerald-400">Auto-Fill</span> to populate interior hexes.
      </p>

      {/* City Selector List */}
      <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
        {cities.map((city) => {
          const isMoving = activeCityId === city.id;
          return (
            <button
              key={city.id}
              onClick={() => onSelectCityToMove(isMoving ? null : city.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded border text-left transition ${
                isMoving
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div>
                <div className="font-semibold">{city.sett_name}</div>
                <div className="text-[10px] text-slate-400">
                  Pop: {(city.population / 1_000_000).toFixed(2)}M • {city.terrain}
                </div>
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
          Click any hex on the map to snap{' '}
          <strong>{cities.find((c) => c.id === activeCityId)?.sett_name}</strong> there.
        </div>
      )}

      {/* Interior Auto-Fill Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onAutoFill}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-2 rounded transition"
        >
          Auto-Fill ({fillerHexes.length})
        </button>
        <button
          onClick={onClearFiller}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 py-1.5 px-2 rounded transition"
        >
          Cities Only
        </button>
      </div>

      {/* Export TS Chunks */}
      <button
        onClick={handleDownloadAllTs}
        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-3 rounded transition"
      >
        Export ven1.ts – ven10.ts
      </button>

      {exportedPreview && (
        <div className="text-[10px] text-emerald-400">
          ✓ Downloaded ven1.ts through ven10.ts + index.ts!
        </div>
      )}
    </div>
  );
};