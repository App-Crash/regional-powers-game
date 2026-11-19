// src/models/modelRegistry.ts
// Single 3D Model Registry under src/models/.
// Maps modelKey identifiers to Three.js model builders for equipment, units,
// and installations/defenses (including named sub-parts such as radome vs. pad_rebar).

import * as THREE from 'three';
import type { StructuralPartState } from '../types/battleReport';

export type ModelPartMap = Record<string, THREE.Object3D>;

export interface BuiltModelInstance {
  root: THREE.Group;
  parts: ModelPartMap;
  dispose: () => void;
}

export type ModelBuilderFn = (modelKey: string) => BuiltModelInstance;

function disposeObjectTree(root: THREE.Object3D): void {
  root.traverse((obj: THREE.Object3D) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat: THREE.Material) => mat.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  });
}

function createPlaceholderModel(modelKey: string): BuiltModelInstance {
  const root = new THREE.Group();
  root.name = `model_${modelKey}`;

  const geo = new THREE.BoxGeometry(0.6, 0.4, 0.6);
  const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6 });
  const body = new THREE.Mesh(geo, mat);
  body.position.y = 0.2;
  root.add(body);

  return {
    root,
    parts: {
      hull: body,
    },
    dispose: () => disposeObjectTree(root),
  };
}

function createHilltopRadarModel(modelKey: string): BuiltModelInstance {
  const root = new THREE.Group();
  root.name = `model_${modelKey}`;

  // Surviving civil / hilltop support base (concrete supports, rebar, access pad)
  const padGeo = new THREE.CylinderGeometry(0.75, 0.9, 0.16, 16);
  const padMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
  const padMesh = new THREE.Mesh(padGeo, padMat);
  padMesh.position.y = 0.08;
  root.add(padMesh);

  // Active / vulnerable radome superstructure
  const radomeGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const radomeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25 });
  const radomeMesh = new THREE.Mesh(radomeGeo, radomeMat);
  radomeMesh.position.y = 0.46;
  root.add(radomeMesh);

  return {
    root,
    parts: {
      pad_rebar: padMesh,
      radome: radomeMesh,
    },
    dispose: () => disposeObjectTree(root),
  };
}

function createSamBatteryModel(modelKey: string): BuiltModelInstance {
  const root = new THREE.Group();
  root.name = `model_${modelKey}`;

  const chassisGeo = new THREE.BoxGeometry(0.8, 0.25, 0.45);
  const chassisMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
  chassisMesh.position.y = 0.125;
  root.add(chassisMesh);

  const launcherGeo = new THREE.BoxGeometry(0.55, 0.25, 0.32);
  const launcherMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.5 });
  const launcherMesh = new THREE.Mesh(launcherGeo, launcherMat);
  launcherMesh.position.set(0, 0.35, 0);
  launcherMesh.rotation.x = -0.55;
  root.add(launcherMesh);

  return {
    root,
    parts: {
      chassis: chassisMesh,
      launcher: launcherMesh,
    },
    dispose: () => disposeObjectTree(root),
  };
}

export class ModelRegistry {
  private builders: Map<string, ModelBuilderFn>;

  constructor() {
    this.builders = new Map<string, ModelBuilderFn>();
    this.registerDefaultModels();
  }

  private registerDefaultModels(): void {
    this.register('infra_radar_hilltop', createHilltopRadarModel);
    this.register('def_sam_s300', createSamBatteryModel);
    this.register('plat_sub_attack', createPlaceholderModel);
    this.register('wpn_cruise_missile', createPlaceholderModel);
    this.register('air_blackhawk', createPlaceholderModel);
    this.register('unit_specops', createPlaceholderModel);
    this.register('unit_logistics', createPlaceholderModel);
  }

  public register(modelKey: string, builder: ModelBuilderFn): void {
    this.builders.set(modelKey, builder);
  }

  public has(modelKey: string): boolean {
    return this.builders.has(modelKey);
  }

  public build(modelKey: string): BuiltModelInstance {
    const builder = this.builders.get(modelKey);
    if (builder) {
      return builder(modelKey);
    }
    return createPlaceholderModel(modelKey);
  }
}

export function applyPartStateToObject(obj: THREE.Object3D, state: StructuralPartState): void {
  if (state === 'intact') {
    obj.visible = true;
    obj.scale.set(1, 1, 1);
  } else if (state === 'damaged') {
    obj.visible = true;
    obj.scale.set(0.95, 0.7, 0.95);
  } else if (state === 'destroyed') {
    obj.visible = false;
  }
}

export const defaultModelRegistry = new ModelRegistry();