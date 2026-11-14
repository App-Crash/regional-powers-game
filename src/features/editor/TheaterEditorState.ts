import { useState, useEffect } from 'react';
import { type RuntimeHexEntity, type TerrainType, type FactionCode } from '../../features/home/HexTypes';
import { 
  getRegisteredNations, 
  buildTheaterNationByCode, 
  type TheaterRegion, 
  type NationMeta 
} from '../../services/factions';
import { UNPLACED_VENEZUELA_SEEDS } from '../../services/factions/ven/ven-seed';
import { generateInteriorFillerHexes, buildTypeScriptChunkFiles } from './TheaterEditorEngine';

export interface UnplacedSeed {
  id: string;
  sett_name: string;
  population: number;
  infra: number;
  elevation: number;
  terrain: TerrainType;
  fac_ctl: FactionCode;
  infra_nodes: any[];
}

export function useTheaterEditor() {
  const [mode, setMode] = useState<'dev' | 'player'>('dev');
  
  // Region & Nation Selection State
  const [activeRegion, setActiveRegion] = useState<TheaterRegion>('SA');
  const availableNations = getRegisteredNations(activeRegion);
  const [activeNationCode, setActiveNationCode] = useState<string>('ven');

  const activeNationMeta: NationMeta = availableNations.find((n) => n.code === activeNationCode) || {
    code: activeNationCode,
    region: 'SA',
    name: activeNationCode.toUpperCase(),
  };

  // Load active nation's theater entities
  const [cities, setCities] = useState<RuntimeHexEntity[]>(() => buildTheaterNationByCode(activeNationCode));

  // Switch active nation theater when nation selection changes
  useEffect(() => {
    setCities(buildTheaterNationByCode(activeNationCode));
    setSelectedSeedId(null);
    setActiveCityId(null);
    setFillerHexes([]);
  }, [activeNationCode]);

  // Track unplaced seeds dynamically based on active nation
  const getSeedsForNation = (code: string): UnplacedSeed[] => {
    if (code === 'ven') return UNPLACED_VENEZUELA_SEEDS;
    // Fallback for nations without separate seed files yet (e.g. Colombia)
    return [];
  };

  const nationSeeds = getSeedsForNation(activeNationCode);
  const placedIds = new Set(cities.map((c) => c.id));
  const unplacedSeeds: UnplacedSeed[] = nationSeeds.filter(
    (seed) => !placedIds.has(seed.id)
  );

  const [fillerHexes, setFillerHexes] = useState<RuntimeHexEntity[]>([]);
  const [activeCityId, setActiveCityId] = useState<string | null>(null);
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);
  const [isPurgeMode, setIsPurgeMode] = useState<boolean>(false);

  const handleAutoFill = () => {
    const filled = generateInteriorFillerHexes(cities, activeNationCode);
    setFillerHexes(filled);
  };

  const handleClearFiller = () => {
    setFillerHexes([]);
  };

  const handlePurgeHex = (q: number, r: number) => {
    setFillerHexes((prev) => prev.filter((h) => !(h.q === q && h.r === r)));
  };

  const handleMoveCity = (q: number, r: number) => {
    if (!activeCityId) return;
    setCities((prev) =>
      prev.map((c) => (c.id === activeCityId ? { ...c, q, r } : c))
    );
    setActiveCityId(null);
  };

  const handlePlaceSeed = (q: number, r: number) => {
    if (!selectedSeedId) return;
    const seedTemplate = nationSeeds.find((s) => s.id === selectedSeedId);
    if (!seedTemplate) return;

    const newCityEntity: RuntimeHexEntity = {
      ...seedTemplate,
      q,
      r,
      wx: 0,
      wy: 0,
    };

    setCities((prev) => [...prev, newCityEntity]);
    setSelectedSeedId(null);
  };

  const handleToggleHexControl = (q: number, r: number) => {
    const existingFillerIndex = fillerHexes.findIndex((h) => h.q === q && h.r === r);

    if (existingFillerIndex >= 0) {
      setFillerHexes((prev) => {
        const target = prev[existingFillerIndex];
        if (target.fac_ctl === activeNationCode) {
          return prev.filter((_, idx) => idx !== existingFillerIndex);
        } else {
          const updated = [...prev];
          updated[existingFillerIndex] = { ...target, fac_ctl: activeNationCode as FactionCode };
          return updated;
        }
      });
    } else {
      const newHex: RuntimeHexEntity = {
        id: `${activeNationCode}-paint-${q}-${r}`,
        q,
        r,
        terrain: 'plain' as TerrainType,
        infra: 1,
        population: 15000,
        elevation: 200,
        wx: 0,
        wy: 0,
        fac_ctl: activeNationCode as FactionCode,
        sett_name: `Sector ${q},${r}`,
        infra_nodes: [],
      };
      setFillerHexes((prev) => [...prev, newHex]);
    }
  };

  const handleSaveAndExport = () => {
    const files = buildTypeScriptChunkFiles(
      cities, 
      fillerHexes, 
      activeNationCode, 
      activeNationMeta.name, 
      activeRegion, 
      250
    );
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

  return {
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
    handlePurgeHex,
    handleMoveCity,
    handlePlaceSeed,
    handleToggleHexControl,
    handleSaveAndExport,
  };
}