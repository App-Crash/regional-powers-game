import { useState, useEffect } from 'react';
import { type RuntimeHexEntity } from '../home/HexTypes';
import {
  getRegisteredNations,
  buildTheaterNationByCode,
  type TheaterRegion,
  type NationMeta,
} from '../../services/factions';
import { UNPLACED_VENEZUELA_SEEDS } from '../../services/factions/ven/ven-seed';
import { type UnplacedSeed } from './editorTypes';

export function useNationRoster() {
  const [activeRegion, setActiveRegion] = useState<TheaterRegion>('SA');
  const availableNations = getRegisteredNations(activeRegion);
  const [activeNationCode, setActiveNationCode] = useState<string>('ven');

  const fallbackRegion: NationMeta['region'] =
    activeRegion === 'GLOBAL' ? 'SA' : activeRegion;

  const activeNationMeta: NationMeta = availableNations.find(
    (n) => n.code === activeNationCode
  ) || {
    code: activeNationCode,
    region: fallbackRegion,
    name: activeNationCode.toUpperCase(),
  };

  const [cities, setCities] = useState<RuntimeHexEntity[]>(() =>
    buildTheaterNationByCode(activeNationCode)
  );

  useEffect(() => {
    setCities(buildTheaterNationByCode(activeNationCode));
  }, [activeNationCode]);

  const getSeedsForNation = (code: string): UnplacedSeed[] => {
    if (code === 'ven') return UNPLACED_VENEZUELA_SEEDS;
    return [];
  };

  const nationSeeds = getSeedsForNation(activeNationCode);
  const placedIds = new Set(cities.map((c) => c.id));
  const unplacedSeeds: UnplacedSeed[] = nationSeeds.filter(
    (seed) => !placedIds.has(seed.id)
  );

  return {
    activeRegion,
    setActiveRegion,
    availableNations,
    activeNationCode,
    setActiveNationCode,
    activeNationMeta,
    cities,
    setCities,
    nationSeeds,
    unplacedSeeds,
  };
}