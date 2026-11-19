// src/models/replayEventDriver.ts
// Applies BattleReport timeline events to a BoundReplayCast under src/models/
// so sub-part and actor visibility states stay deterministic across time scrubs.

import type { BattleReport, ReplayEvent, StructuralPartState } from '../types/battleReport';
import type { BoundReplayActor, BoundReplayCast } from './replayCastBinder';

export interface ReplayCastEventDriver {
  applyAtTime: (tSec: number) => void;
  reset: () => void;
}

function isValidPartState(value: string): value is StructuralPartState {
  return value === 'intact' || value === 'damaged' || value === 'destroyed';
}

function applySingleEventToCast(boundCast: BoundReplayCast, event: ReplayEvent): void {
  if (!event.actorId) {
    return;
  }

  const actor: BoundReplayActor | undefined = boundCast.actorsById.get(event.actorId);
  if (!actor) {
    return;
  }

  if (event.type === 'actor_state') {
    actor.instance.root.visible = Boolean(event.visible);
  }

  if (event.partKey && isValidPartState(event.partState)) {
    actor.setPartState(event.partKey, event.partState);
  }

  if (event.type === 'impact' && event.partKey && isValidPartState(event.partState)) {
    actor.setPartState(event.partKey, event.partState);
  }
}

export function createReplayCastEventDriver(
  report: BattleReport,
  boundCast: BoundReplayCast
): ReplayCastEventDriver {
  const rawEvents = Array.isArray(report.events) ? report.events : [];
  const sortedEvents = [...rawEvents].sort(
    (a: ReplayEvent, b: ReplayEvent) => a.time - b.time
  );

  const reset = (): void => {
    boundCast.applyInitialStates();
  };

  const applyAtTime = (tSec: number): void => {
    boundCast.applyInitialStates();

    for (const event of sortedEvents) {
      if (event.time <= tSec) {
        applySingleEventToCast(boundCast, event);
      } else {
        break;
      }
    }
  };

  return {
    applyAtTime,
    reset,
  };
}