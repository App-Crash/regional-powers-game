import { useState } from 'react';
import { buildTypeScriptChunkFiles } from './TheaterEditorEngine';
import { useNationRoster } from './useNationRoster';
import { useHexMutation } from './useHexMutation';

export type { UnplacedSeed } from './editorTypes';

export function useTheaterEditor() {
  const [mode, setMode] = useState<'dev' | 'player'>('dev');
  const roster = useNationRoster();
  const mutation = useHexMutation({
    activeNationCode: roster.activeNationCode,
    cities: roster.cities,
    setCities: roster.setCities,
    nationSeeds: roster.nationSeeds,
  });

  const handleSaveAndExport = () => {
    const files = buildTypeScriptChunkFiles(
      roster.cities,
      mutation.fillerHexes,
      roster.activeNationCode,
      roster.activeNationMeta.name,
      roster.activeRegion,
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
    activeRegion: roster.activeRegion,
    setActiveRegion: roster.setActiveRegion,
    availableNations: roster.availableNations,
    activeNationCode: roster.activeNationCode,
    setActiveNationCode: roster.setActiveNationCode,
    cities: roster.cities,
    unplacedSeeds: roster.unplacedSeeds,
    ...mutation,
    handleSaveAndExport,
  };
}