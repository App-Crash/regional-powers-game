import React, { useState } from 'react';
import type { useTheaterEditor } from './TheaterEditorState';
import { THEATER_REGIONS } from './editorTypes';

type EditorStateReturn = ReturnType<typeof useTheaterEditor>;
type DevTab = 'territory' | 'hubs' | 'export';

export const TheaterEditorUI: React.FC<EditorStateReturn> = ({
  mode,
  activeRegion,
  setActiveRegion,
  availableNations,
  activeNationCode,
  setActiveNationCode,
  cities,
  unplacedSeeds,
  fillerHexes,
  activeCityId,
  setActiveCityId,
  selectedSeedId,
  setSelectedSeedId,
  isPurgeMode,
  setIsPurgeMode,
  handleAutoFill,
  handleClearFiller,
  handleSaveAndExport,
}) => {
  const [activeTab, setActiveTab] = useState<DevTab>('territory');

  if (mode !== 'dev') return null;

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPurgeMode(false);
    setSelectedSeedId(null);
    setActiveCityId(e.currentTarget.value || null);
  };

  const handleSeedSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPurgeMode(false);
    setActiveCityId(null);
    setSelectedSeedId(e.currentTarget.value || null);
  };

  const handlePurgeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveCityId(null);
    setSelectedSeedId(null);
    setIsPurgeMode(e.currentTarget.checked);
  };

  return (
    <div className="flex items-center gap-3 font-mono text-xs text-slate-200">
      {/* Domain Tabs inside Top 10% Header */}
      <div className="flex bg-slate-900/90 border border-slate-700 rounded p-0.5">
        {(['territory', 'hubs', 'export'] as DevTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2.5 py-1 rounded uppercase tracking-wider text-[11px] font-semibold transition cursor-pointer ${
              activeTab === tab
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Territory & Nation Context */}
      {activeTab === 'territory' && (
        <div className="flex items-center gap-2">
          <select
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.currentTarget.value as any)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-300 focus:outline-none focus:border-amber-500"
          >
            {THEATER_REGIONS.map((reg) => (
              <option key={reg.code} value={reg.code} disabled={!reg.enabled}>
                {reg.label} {!reg.enabled ? '(Soon)' : ''}
              </option>
            ))}
          </select>

          <select
            value={activeNationCode}
            onChange={(e) => setActiveNationCode(e.currentTarget.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sky-300 focus:outline-none focus:border-sky-500"
          >
            {availableNations.map((nat) => (
              <option key={nat.code} value={nat.code}>
                {nat.name} ({nat.code.toUpperCase()})
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-900 border border-slate-700 px-2.5 py-1 rounded hover:border-slate-600">
            <input
              type="checkbox"
              checked={isPurgeMode}
              onChange={handlePurgeToggle}
              className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0 cursor-pointer"
            />
            <span className={isPurgeMode ? 'text-rose-400 font-bold' : 'text-slate-300'}>
              Purge
            </span>
          </label>
        </div>
      )}

      {/* Tab 2: Seeds & Hub Placement */}
      {activeTab === 'hubs' && (
        <div className="flex items-center gap-2">
          <select
            value={selectedSeedId || ''}
            onChange={handleSeedSelect}
            className="bg-slate-900 border border-emerald-700/80 rounded px-2 py-1 text-emerald-300 focus:outline-none max-w-[160px]"
          >
            <option value="">
              {unplacedSeeds.length > 0 ? `+ Spawn Seed (${unplacedSeeds.length})` : 'All Seeds Placed'}
            </option>
            {unplacedSeeds.map((seed) => (
              <option key={seed.id} value={seed.id}>
                {seed.sett_name}
              </option>
            ))}
          </select>

          <select
            value={activeCityId || ''}
            onChange={handleCitySelect}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sky-300 focus:outline-none max-w-[160px]"
          >
            <option value="">Move Hub ({cities.length})</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.sett_name} ({city.q},{city.r})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tab 3: Auto-Fill & Export */}
      {activeTab === 'export' && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoFill}
            disabled={cities.length < 3}
            className={`px-2.5 py-1 rounded font-medium transition ${
              cities.length < 3
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-emerald-600/90 hover:bg-emerald-500 text-white cursor-pointer'
            }`}
          >
            Auto-Fill ({cities.length}/3) {fillerHexes.length > 0 ? `[${fillerHexes.length}]` : ''}
          </button>

          <button
            onClick={handleClearFiller}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded transition cursor-pointer"
          >
            Clear
          </button>

          <button
            onClick={handleSaveAndExport}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1 rounded transition cursor-pointer"
          >
            💾 Export TS
          </button>
        </div>
      )}
    </div>
  );
};