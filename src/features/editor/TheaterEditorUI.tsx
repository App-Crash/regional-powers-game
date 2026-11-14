import React from 'react';
import type { useTheaterEditor } from './TheaterEditorState';

type EditorStateReturn = ReturnType<typeof useTheaterEditor>;

export const TheaterEditorUI: React.FC<EditorStateReturn> = ({
  mode,
  setMode,
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
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isPurgeMode) setIsPurgeMode(false);
    if (selectedSeedId) setSelectedSeedId(null);
    setActiveCityId(e.currentTarget.value ? e.currentTarget.value : null);
  };

  const handleSeedSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isPurgeMode) setIsPurgeMode(false);
    if (activeCityId) setActiveCityId(null);
    setSelectedSeedId(e.currentTarget.value ? e.currentTarget.value : null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeCityId) setActiveCityId(null);
    if (selectedSeedId) setSelectedSeedId(null);
    setIsPurgeMode(e.currentTarget.checked);
  };

  const regions: { code: 'SA' | 'NA' | 'EU' | 'AP' | 'AF' | 'GLOBAL'; label: string; enabled: boolean }[] = [
    { code: 'SA', label: 'South America (SA)', enabled: true },
    { code: 'NA', label: 'North America (NA)', enabled: false },
    { code: 'EU', label: 'Europe (EU)', enabled: false },
    { code: 'AP', label: 'Asia-Pacific (AP)', enabled: false },
    { code: 'AF', label: 'Africa (AF)', enabled: false },
    { code: 'GLOBAL', label: 'Global (WW3)', enabled: false },
  ];

  return (
    <div className="absolute top-2 left-4 right-4 flex flex-col xl:flex-row items-center justify-between bg-slate-950/95 border border-amber-500/50 rounded-lg px-4 py-2 shadow-2xl z-50 pointer-events-auto font-mono text-xs text-slate-200 gap-2">
      
      {/* Mode Switcher & Dev Selectors */}
      <div className="flex items-center space-x-3 flex-wrap gap-y-2">
        <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
          <button
            onClick={() => setMode('dev')}
            className={`px-3 py-1 rounded transition text-xs font-semibold ${
              mode === 'dev' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛠️ Dev Editor
          </button>
          <button
            onClick={() => setMode('player')}
            className={`px-3 py-1 rounded transition text-xs font-semibold ${
              mode === 'player' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎮 Player View
          </button>
        </div>

        {/* Region & Nation Selectors (Visible ONLY in Dev Mode) */}
        {mode === 'dev' && (
          <>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 text-[11px]">Region:</span>
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.currentTarget.value as any)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
              >
                {regions.map((reg) => (
                  <option key={reg.code} value={reg.code} disabled={!reg.enabled}>
                    {reg.label} {!reg.enabled ? '(Soon)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-slate-400 text-[11px]">Nation:</span>
              <select
                value={activeNationCode}
                onChange={(e) => setActiveNationCode(e.currentTarget.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-sky-300 focus:outline-none focus:border-sky-500"
              >
                {availableNations.map((nat) => (
                  <option key={nat.code} value={nat.code}>
                    {nat.name} ({nat.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[11px] text-amber-400/90 font-medium hidden 2xl:inline">
              {activeCityId 
                ? `Repositioning Hub (Click map)` 
                : selectedSeedId
                ? `Placing Seed (Click map)`
                : isPurgeMode 
                ? 'Purge Mode Active' 
                : `Hubs: ${cities.length}`}
            </span>
          </>
        )}
      </div>

      {/* Dev Controls (Visible ONLY in Dev Mode) */}
      {mode === 'dev' && (
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          
          {/* Seed selector always visible in dev mode; shows unplaced seeds or notice if all placed */}
          <div className="flex items-center space-x-1">
            <span className="text-emerald-400 text-[11px]">Spawn Seed:</span>
            <select
              value={selectedSeedId || ''}
              onChange={handleSeedSelectChange}
              className="bg-slate-900 border border-emerald-700/80 rounded px-2 py-1 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 max-w-[150px]"
            >
              <option value="">
                {unplacedSeeds.length > 0 ? '-- Select Seed --' : '-- All Seeds Placed --'}
              </option>
              {unplacedSeeds.map((seed) => (
                <option key={seed.id} value={seed.id}>
                  {seed.sett_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400 text-[11px]">Move Hub:</span>
            <select
              value={activeCityId || ''}
              onChange={handleSelectChange}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-sky-300 focus:outline-none focus:border-amber-500 max-w-[140px]"
            >
              <option value="">-- Placed Hub --</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.sett_name} ({city.q}, {city.r})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center space-x-1 cursor-pointer bg-slate-900 border border-slate-800 px-2 py-1 rounded hover:border-slate-700 transition">
            <input
              type="checkbox"
              checked={isPurgeMode}
              onChange={handleCheckboxChange}
              className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0 cursor-pointer"
            />
            <span className={isPurgeMode ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
              Purge
            </span>
          </label>

          <div className="flex items-center space-x-1.5 border-l border-slate-800 pl-2">
            <button
              onClick={handleAutoFill}
              disabled={cities.length < 3}
              className={`px-2.5 py-1 rounded transition text-xs font-medium ${
                cities.length < 3
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                  : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow'
              }`}
            >
              Auto-Fill ({cities.length}/3) {fillerHexes.length > 0 ? `(${fillerHexes.length})` : ''}
            </button>
            <button
              onClick={handleClearFiller}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded transition text-xs"
            >
              Clear
            </button>
            <button
              onClick={handleSaveAndExport}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-2.5 py-1 rounded transition shadow text-xs"
            >
              💾 Save
            </button>
          </div>

        </div>
      )}
    </div>
  );
};