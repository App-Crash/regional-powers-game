// src/models/replayCastBinder.ts
// Centralizes instantiating BattleReport cast actors from the modelRegistry
// under src/models/ and applying structural sub-part damage states.

import * as THREE from 'three';
import type { BattleReport, ReplayActorSpec, StructuralPartState } from '../types/battleReport';
import {
  applyPartStateToObject,
  defaultModelRegistry,
  type BuiltModelInstance,
  type ModelRegistry,
} from './modelRegistry';

export interface BoundReplayActor {
  spec: ReplayActorSpec;
  instance: BuiltModelInstance;
  setPartState: (partKey: string, state: StructuralPartState) => void;
}

export interface BoundReplayCast {
  rootGroup: THREE.Group;
  actorsById: Map<string, BoundReplayActor>;
  applyInitialStates: () => void;
  dispose: () => void;
}

export function bindReplayCastFromReport(
  report: BattleReport,
  registry: ModelRegistry = defaultModelRegistry
): BoundReplayCast {
  const rootGroup = new THREE.Group();
  rootGroup.name = `replay_cast_${report.id}`;

  const actorsById = new Map<string, BoundReplayActor>();
  const castList = Array.isArray(report.cast) ? report.cast : [];

  for (const spec of castList) {
    const instance = registry.build(spec.modelKey);
    instance.root.name = `actor_${spec.id}`;

    if (spec.placement && spec.placement.position) {
      instance.root.position.set(
        spec.placement.position.x,
        spec.placement.position.y,
        spec.placement.position.z
      );
    }

    if (spec.placement && typeof spec.placement.yaw === 'number') {
      instance.root.rotation.y = spec.placement.yaw;
    }

    instance.root.visible = Boolean(spec.initialVisible);
    rootGroup.add(instance.root);

    const setPartState = (partKey: string, state: StructuralPartState): void => {
      const targetPart = instance.parts[partKey];
      if (targetPart) {
        applyPartStateToObject(targetPart, state);
      }
    };

    const boundActor: BoundReplayActor = {
      spec,
      instance,
      setPartState,
    };

    actorsById.set(spec.id, boundActor);
  }

  const applyInitialStates = (): void => {
    actorsById.forEach((boundActor: BoundReplayActor) => {
      boundActor.instance.root.visible = Boolean(boundActor.spec.initialVisible);
      const partStates = boundActor.spec.partStates;
      if (partStates) {
        Object.keys(partStates).forEach((partKey: string) => {
          const state = partStates[partKey];
          if (state) {
            boundActor.setPartState(partKey, state);
          }
        });
      }
    });
  };

  applyInitialStates();

  const dispose = (): void => {
    actorsById.forEach((boundActor: BoundReplayActor) => {
      boundActor.instance.dispose();
    });
    actorsById.clear();
    rootGroup.clear();
  };

  return {
    rootGroup,
    actorsById,
    applyInitialStates,
    dispose,
  };
}