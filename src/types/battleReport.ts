export interface BattleChapter {
  id: string;
  startSec: number;
  endSec: number;
  simClock: string; // e.g., "01:00 AM"
  cameraMode: 'TRACK_ACTOR' | 'SUB_CHASE' | 'SKY_PULLAWAY';
  focusHexId: string;
  secondaryHexId?: string;
  cameraOffset: [number, number, number];
  headline: string;
  telemetryNote: string;
}

export interface BattleReport {
  operationId: string;
  newspaperHeadline: string;
  newspaperSubhead: string;
  outcomeCode: 'DECAPITATION_SUCCESS' | 'REPELLED';
  chapters: BattleChapter[];
  aarSummary: {
    casualties: { attacker: string; defender: string };
    keyEvents: string[];
    rewards: string[];
  };
}