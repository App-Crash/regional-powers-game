import { BattleReport } from '../src/types/battleReport';

export const MOCK_CARACAS_REPORT: BattleReport = {
  operationId: 'OP-MIDNIGHT-LANCE-83',
  newspaperHeadline: 'VENEZUELAN LEADER, MADURO, CAPTURED IN DARING RAID',
  newspaperSubhead: 'SPECIAL FORCES STORM COMPOUND AT DAWN AS BORDER ARMOR DRAWS FIRE',
  outcomeCode: 'DECAPITATION_SUCCESS',
  chapters: [
    {
      id: 'CH-1-BORDER-CROSSING',
      startSec: 0.0,
      endSec: 5.0,
      simClock: '01:00 AM',
      cameraMode: 'TRACK_ACTOR',
      focusHexId: 'HEX-COL-CUCUTA-BORDER',
      secondaryHexId: 'HEX-VEN-TACHIRA-HIGHWAY',
      cameraOffset: [0, 3.2, 5.5],
      headline: '01:00 AM — 2ND MECHANIZED BRIGADE CROSSES BORDER',
      telemetryNote: 'Armored column breaches Táchira checkpoint and pushes onto Venezuelan highway.'
    },
    {
      id: 'CH-2-SUB-SALVO',
      startSec: 5.0,
      endSec: 10.0,
      simClock: '01:45 AM',
      cameraMode: 'SUB_CHASE',
      focusHexId: 'HEX-CARIBBEAN-SUB-01',
      secondaryHexId: 'HEX-VEN-MARACAY-DEPOT',
      cameraOffset: [2.0, -0.8, 3.5],
      headline: '01:45 AM — SUBMARINE VOLLEY LAUNCHED',
      telemetryNote: '8 cruise missiles breach Caribbean surface, weaving past errant SAM fire to strike inland depot.'
    },
    {
      id: 'CH-3-FOB-TAKEOFF',
      startSec: 10.0,
      endSec: 13.5,
      simClock: '02:30 AM',
      cameraMode: 'TRACK_ACTOR',
      focusHexId: 'HEX-COL-ARAUCA-FOB',
      secondaryHexId: 'HEX-VEN-CARACAS-OUTSKIRTS',
      cameraOffset: [-2.5, 2.2, 4.0],
      headline: '02:30 AM — BLACKHAWKS DEPART BORDER FOB',
      telemetryNote: 'Hot-refueling complete; 3 Blackhawk chalks lift off flying nap-of-the-earth.'
    },
    {
      id: 'CH-4-HIGHWAY-AMBUSH',
      startSec: 13.5,
      endSec: 17.5,
      simClock: '03:15 AM',
      cameraMode: 'TRACK_ACTOR',
      focusHexId: 'HEX-VEN-TACHIRA-HIGHWAY',
      secondaryHexId: 'HEX-VEN-BARINAS-ROAD',
      cameraOffset: [3.0, 2.5, 4.5],
      headline: '03:15 AM — ATGM AMBUSH ON HIGHWAY COLUMN',
      telemetryNote: 'Organized resistance fires anti-tank guided missiles from ridge; 1 lead tank destroyed.'
    },
    {
      id: 'CH-5-SPECOPS-INSERTION',
      startSec: 17.5,
      endSec: 21.5,
      simClock: '04:10 AM',
      cameraMode: 'TRACK_ACTOR',
      focusHexId: 'HEX-VEN-CARACAS-OUTSKIRTS',
      secondaryHexId: 'HEX-VEN-MIRAFLORES-COMPOUND',
      cameraOffset: [1.8, 1.6, 3.0],
      headline: '04:10 AM — UNOPPOSED INSERTION AT TARGET',
      telemetryNote: '3 Blackhawks touch down without taking fire; Special Forces operators breach perimeter with long guns ready.'
    },
    {
      id: 'CH-6-SKY-PULLAWAY',
      startSec: 21.5,
      endSec: 25.0,
      simClock: '04:45 AM',
      cameraMode: 'SKY_PULLAWAY',
      focusHexId: 'HEX-VEN-MIRAFLORES-COMPOUND',
      cameraOffset: [0, 18.0, 22.0],
      headline: '04:45 AM — COMMS BLACKOUT OVER CARACAS',
      telemetryNote: 'Satellite link cuts out as compound perimeter goes dark. Awaiting confirmation...'
    }
  ],
  aarSummary: {
    casualties: { attacker: '1 MBT Destroyed (ATGM), 0 Aircraft', defender: 'Ammo Depot Destroyed, Garrison Surrendered' },
    keyEvents: [
      '01:00 AM: Border crossing achieved surprise.',
      '01:45 AM: 8/8 SLCMs bypassed coastal air defenses.',
      '03:15 AM: Venezuelan ATGM team scored 1 tank kill before withdrawing.',
      '04:10 AM: SpecOps inserted cleanly; target leadership secured.'
    ],
    rewards: ['+20% Resource Siphon (24h)', 'Cmdr. Vance Promoted', 'Enemy ATGM Team Flagged for Hero Promotion']
  }
};