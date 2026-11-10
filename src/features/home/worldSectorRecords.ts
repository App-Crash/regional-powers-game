import type { SectorRecord } from './HexTypes';

export const WORLD_SECTOR_RECORDS: Record<string, SectorRecord> = {
  // --- CAPITAL
  "0,0":   { terrain: 'urban', controlledBy: 'player', elevation: 2000, infrastructure: 8, population: 2500000 },

  // --- WESTERN COASTLINE SEGMENTS (-12,2 through -8,8 and -4,7 through -2,8) ---
  "-12,2": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-11,1": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-10,0": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-10,1": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-10,2": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-10,3": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-10,4": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-10,5": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-10,6": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-10,7": { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-9,7":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-9,8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-8,8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 0, population: 0 },
  "0,7":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-4,7":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-5,7":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-6,8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-4,8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-3,8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-2,8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-1,8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
// --- pacific coast colombia
  "-9,-3":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-9,-4":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-8,-5":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-8,-6":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-7,-7":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-6,-8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-7,-8":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },
  "-6,-9":  { terrain: 'coastal', controlledBy: 'player', elevation: 0, infrastructure: 4, population: 14000 },

  // --- enemy coast (venezuala)
    "1,6":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
    "2,6":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  "3,6":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  "4,6":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  "5,5":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  "6,5":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  "7,5":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  "7,6":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  "7,7":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  "8,6":  { terrain: 'coastal', controlledBy: 'enemy', elevation: 0, infrastructure: 4, population: 14000 },
  // --- Allied boarder (with Panama)
    "-11, 1":  { terrain: 'coastal', controlledBy: 'ally', elevation: 0, infrastructure: 4, population: 14000 },
    "-11, 0":  { terrain: 'jungle', controlledBy: 'ally', elevation: 110, infrastructure: 4, population: 14000 },

};