import { useState, useEffect } from 'react';
import {
  type RuntimeHexEntity,
  type TerrainType,
  type FactionCode,
} from '../home/HexTypes';
import { generateInteriorFillerHexes } from './TheaterEditorEngine';
import { type UnplacedSeed } from './editorTypes';

interface UseHexMutationProps {
  activeNationCode: string;
  cities: RuntimeHexEntity[];
  setCities: React.Dispatch<React.SetStateAction<RuntimeHexEntity[]>>;
  nationSeeds: UnplacedSeed[];
}

export function useHexMutation({
  activeNationCode,
  cities,
  setCities,
  nationSeeds,
}: UseHexMutationProps) {
  const [fillerHexes, setFillerHexes] = useState<RuntimeHexEntity[]>([]);
  const [activeCityId, setActiveCityId] = useState<string | null>(null);
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);
  const [isPurgeMode, setIsPurgeMode] = useState<boolean>(false);

  useEffect(() => {
    setSelectedSeedId(null);
    setActiveCityId(null);
    setFillerHexes([]);
  }, [activeNationCode]);

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
    const existingCityIndex = cities.findIndex((c) => c.q === q && c.r === r);
    if (existingCityIndex >= 0) {
      setCities((prev) => prev.filter((_, idx) => idx !== existingCityIndex));
      return;
    }

    const existingFillerIndex = fillerHexes.findIndex(
      (h) => h.q === q && h.r === r
    );

    if (existingFillerIndex >= 0) {
      setFillerHexes((prev) => {
        const target = prev[existingFillerIndex];
        const nextFaction =
          target.fac_ctl === activeNationCode
            ? (undefined as unknown as FactionCode)
            : (activeNationCode as FactionCode);

        const updated = [...prev];
        updated[existingFillerIndex] = { ...target, fac_ctl: nextFaction };
        return updated;
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

  return {
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
  };
}