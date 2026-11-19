// src/types/battleReport.ts
// Pure type definitions for reading and writing battle reports.
// Contains no runtime logic or scene/renderer dependencies.

export type BattleSide = 'attacker' | 'defender' | 'neutral';

export type StructuralPartState = 'intact' | 'damaged' | 'destroyed';

export type BattleOutcomeWinner = BattleSide | 'draw' | 'inconclusive';

export type ReplayEventMetaValue = string | number | boolean;

export type ReplayEventType =
  | 'launch'
  | 'intercept'
  | 'impact'
  | 'part_state'
  | 'actor_state'
  | 'camera_focus';

export interface ReplayWorldPoint {
  x: number;
  y: number;
  z: number;
}

export interface ReplayHexAnchor {
  hexId: string;
  q: number;
  r: number;
}

export interface ReplayActorPlacement {
  hex: ReplayHexAnchor;
  position: ReplayWorldPoint;
  yaw: number;
}

export interface ReplayAttachmentSpec {
  slot: string;
  modelKey: string;
}

export interface ReplayActorSpec {
  id: string;
  label: string;
  side: BattleSide;
  modelKey: string;
  attachments: ReplayAttachmentSpec[];
  placement: ReplayActorPlacement;
  partStates: Record<string, StructuralPartState>;
  initialVisible: boolean;
}

export interface ReplayTrackKeyframe {
  time: number;
  position: ReplayWorldPoint;
  hex: ReplayHexAnchor;
  elevationOffset: number;
  visible: boolean;
}

export interface ReplayTrack {
  id: string;
  actorId: string;
  startTime: number;
  endTime: number;
  points: ReplayWorldPoint[];
  keyframes: ReplayTrackKeyframe[];
  orientAlongPath: boolean;
}

export interface ReplayEvent {
  id: string;
  time: number;
  type: ReplayEventType;
  actorId: string;
  targetActorId: string;
  partKey: string;
  partState: StructuralPartState;
  visible: boolean;
  position: ReplayWorldPoint;
  hex: ReplayHexAnchor;
  meta: Record<string, ReplayEventMetaValue>;
}

export interface BattleOutcomeSummary {
  winner: BattleOutcomeWinner;
  objectiveAchieved: boolean;
  notes: string;
}

export interface BattleChapter {
  id: string;
  startSec: number;
  endSec: number;
  simClock: string;
  headline: string;
  telemetryNote: string;
}

export interface BattleCasualtiesSummary {
  attacker: string;
  defender: string;
}

export interface BattleAarSummary {
  casualties: BattleCasualtiesSummary;
  keyEvents: string[];
  rewards: string[];
}

export interface BattleReport {
  id: string;
  operationId: string;
  title: string;
  newspaperHeadline: string;
  newspaperSubhead: string;
  outcomeCode: string;
  aarSummary: BattleAarSummary;
  chapters: BattleChapter[];
  durationSeconds: number;
  cast: ReplayActorSpec[];
  tracks: ReplayTrack[];
  events: ReplayEvent[];
  outcome: BattleOutcomeSummary;
}