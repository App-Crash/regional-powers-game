// src/features/home/sectorAudio.ts
import type { HexData, TerrainType } from './HexTypes';

// null = no sound recorded yet (nothing is requested, no 404 in the console)
const TERRAIN_SOUND_FILES: Record<TerrainType, string | null> = {
  'deep water': null,   // later: 'deep-water.mp4'
  coastal: null,
  port: null,
  urban: 'urban.mp3',   // proof of concept
  suburban: null,
  plains: null,
  farmland: null,
  forest: null,
  desert: null,
  jungle: null,
  hills: null,
  mountainous: null,
};

let currentSound: HTMLAudioElement | null = null;

export function stopSectorSound(): void {
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
    currentSound = null;
  }
}

export function playSoundForHex(hex: Pick<HexData, 'terrain'>): void {
  stopSectorSound(); // selecting a new hex always cuts the previous sound

  const file = TERRAIN_SOUND_FILES[hex.terrain];
  if (!file) return; // no sound for this terrain yet

  const audio = new Audio(`/sounds/${file}`);
  audio.volume = 0.5;
  currentSound = audio;

  audio.play().catch((err) => {
    console.warn(`SECTOR AUDIO UNAVAILABLE FOR "${hex.terrain}":`, err);
  });
}