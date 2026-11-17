// src/graphics/equipmentBuilder.ts
import * as THREE from 'three';
import type { EquipmentVariant, ChassisDef, ModuleDef } from './equipmentTypes';

/**
 * Registry of Chassis definitions and Module definitions.
 * Serves as the single source of truth for R&D previews, Garage Turntables, and the Replay Engine.
 */
export const CHASSIS_REGISTRY: Record<string, ChassisDef> = {
  'chassis-sub-la-flight1': {
    chassisId: 'chassis-sub-la-flight1',
    displayName: 'Los Angeles Flight I Submarine',
    domain: 'SUBSURFACE',
    tags: ['SUBSURFACE', 'ATTACK_SUB'],
    proceduralBuilderKey: 'buildSubmarineHull',
    baseScale: 1.0,
    sockets: [
      { socketId: 'vls_bow', localOffset: [0, 0.4, 0.8] },
      { socketId: 'tower_top', localOffset: [0, 0.8, 0.15] },
    ],
    hardpoints: [
      { slotId: 'vls_bow', slotType: 'VLS_CELL', mountType: 'FIXED', socketId: 'vls_bow', maxWeightKg: 15000 },
    ],
  },
  'chassis-helo-uh60': {
    chassisId: 'chassis-helo-uh60',
    displayName: 'UH-60 Utility Helicopter',
    domain: 'AIR_ROTOR',
    tags: ['AIR_ROTOR_MEDIUM', 'AIR_TRANSPORT_LIGHT'],
    proceduralBuilderKey: 'buildHelicopterHull',
    baseScale: 1.0,
    sockets: [
      { socketId: 'pylon_port', localOffset: [-0.6, -0.1, 0] },
      { socketId: 'pylon_stbd', localOffset: [0.6, -0.1, 0] },
      { socketId: 'cabin_center', localOffset: [0, 0, 0] },
    ],
    hardpoints: [
      { slotId: 'pylon_port', slotType: 'EXTERNAL_PYLON', mountType: 'CONFIGURABLE', socketId: 'pylon_port', maxWeightKg: 1200 },
      { slotId: 'pylon_stbd', slotType: 'EXTERNAL_PYLON', mountType: 'CONFIGURABLE', socketId: 'pylon_stbd', maxWeightKg: 1200 },
      { slotId: 'cabin_bay', slotType: 'INTERNAL_BAY', mountType: 'CONFIGURABLE', socketId: 'cabin_center', maxWeightKg: 2500 },
    ],
  },
  'chassis-fac-radar': {
    chassisId: 'chassis-fac-radar',
    displayName: 'P-18 Radar Mast',
    domain: 'STATIC_FACILITY',
    tags: ['FACILITY_RADAR'],
    proceduralBuilderKey: 'buildRadarMast',
    baseScale: 1.0,
    sockets: [{ socketId: 'mast_top', localOffset: [0, 1.2, 0] }],
    hardpoints: [{ slotId: 'mast_top', slotType: 'TURRET_ROOF', mountType: 'FIXED', socketId: 'mast_top', maxWeightKg: 5000 }],
  },
  'chassis-fac-sam': {
    chassisId: 'chassis-fac-sam',
    displayName: 'S-300VM Launcher TELAR',
    domain: 'STATIC_FACILITY',
    tags: ['FACILITY_SAM'],
    proceduralBuilderKey: 'buildSamLauncher',
    baseScale: 1.0,
    sockets: [{ socketId: 'erector_rack', localOffset: [0, 0.6, 0] }],
    hardpoints: [{ slotId: 'erector_rack', slotType: 'TURRET_ROOF', mountType: 'FIXED', socketId: 'erector_rack', maxWeightKg: 10000 }],
  },
};

export const MODULE_REGISTRY: Record<string, ModuleDef> = {
  'mod-vls-tomahawk-6pack': {
    moduleId: 'mod-vls-tomahawk-6pack',
    displayName: 'VLS 6-Cell Tomahawk Launcher',
    mountType: 'FIXED',
    compatibleSlotTypes: ['VLS_CELL'],
    compatibleChassisTags: ['SUBSURFACE'],
    weightKg: 4200,
    capabilities: [{ primitive: 'EMIT_PROJECTILE', salvoCapacity: 6, trajectory: 'UNDERWATER_BROACH_TO_CRUISE' }],
  },
  'mod-aux-fuel-230gal': {
    moduleId: 'mod-aux-fuel-230gal',
    displayName: '230-Gal Auxiliary Fuel Tank',
    mountType: 'CONFIGURABLE',
    compatibleSlotTypes: ['EXTERNAL_PYLON'],
    compatibleChassisTags: ['AIR_ROTOR_MEDIUM'],
    weightKg: 380,
    capabilities: [{ primitive: 'EXTEND_RANGE', statModifiers: { rangeBonusHexes: 3 } }],
  },
  'mod-hydra70-pod': {
    moduleId: 'mod-hydra70-pod',
    displayName: 'Hydra 70 Rocket Pod',
    mountType: 'CONFIGURABLE',
    compatibleSlotTypes: ['EXTERNAL_PYLON'],
    compatibleChassisTags: ['AIR_ROTOR_MEDIUM', 'GROUND_TRACKED'],
    weightKg: 270,
    capabilities: [{ primitive: 'EMIT_PROJECTILE', salvoCapacity: 19, trajectory: 'DIRECT_FIRE' }],
  },
  'mod-fastrope-rig': {
    moduleId: 'mod-fastrope-rig',
    displayName: 'Fast-Rope Insertion Rig',
    mountType: 'CONFIGURABLE',
    compatibleSlotTypes: ['INTERNAL_BAY'],
    compatibleChassisTags: ['AIR_ROTOR_MEDIUM'],
    weightKg: 150,
    capabilities: [{ primitive: 'DEPLOY_SUB_UNIT' }],
  },
  'mod-vhf-array': {
    moduleId: 'mod-vhf-array',
    displayName: 'VHF Radar Antenna Array',
    mountType: 'FIXED',
    compatibleSlotTypes: ['TURRET_ROOF'],
    compatibleChassisTags: ['FACILITY_RADAR'],
    weightKg: 1200,
    capabilities: [{ primitive: 'SENSOR_EMIT' }],
  },
  'mod-sam-4tube-canister': {
    moduleId: 'mod-sam-4tube-canister',
    displayName: '9M83 Sam Quad Canister',
    mountType: 'FIXED',
    compatibleSlotTypes: ['TURRET_ROOF'],
    compatibleChassisTags: ['FACILITY_SAM'],
    weightKg: 6500,
    capabilities: [{ primitive: 'EMIT_PROJECTILE', salvoCapacity: 4, trajectory: 'HIGH_ARC' }],
  },
};

/**
 * Procedural mesh generators for chassis and modules when external GLBs are absent.
 */
function createProceduralMesh(builderKey: string): THREE.Group {
  const group = new THREE.Group();

  switch (builderKey) {
    case 'buildSubmarineHull': {
      const hullGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.0, 16);
      hullGeo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({ color: 0x1f2b2d, metalness: 0.7, roughness: 0.3 });
      const hull = new THREE.Mesh(hullGeo, mat);

      const towerGeo = new THREE.BoxGeometry(0.25, 0.5, 0.8);
      const tower = new THREE.Mesh(towerGeo, mat);
      tower.position.set(0, 0.4, 0.15);

      group.add(hull, tower);
      break;
    }
    case 'buildHelicopterHull': {
      const fuselageGeo = new THREE.BoxGeometry(0.35, 0.3, 1.2);
      const mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 });
      const fuselage = new THREE.Mesh(fuselageGeo, mat);

      const rotorGeo = new THREE.BoxGeometry(2.2, 0.02, 0.1);
      const rotor = new THREE.Mesh(rotorGeo, new THREE.MeshStandardMaterial({ color: 0x334155 }));
      rotor.position.set(0, 0.25, 0);

      group.add(fuselage, rotor);
      break;
    }
    case 'buildRadarMast': {
      const mastGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.4, 8);
      const mat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 });
      const mast = new THREE.Mesh(mastGeo, mat);
      mast.position.y = 0.7;

      const dishGeo = new THREE.BoxGeometry(0.8, 0.4, 0.1);
      const dish = new THREE.Mesh(dishGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
      dish.position.set(0, 1.3, 0);

      group.add(mast, dish);
      break;
    }
    case 'buildSamLauncher': {
      const baseGeo = new THREE.BoxGeometry(0.9, 0.4, 1.2);
      const mat = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.6 });
      const base = new THREE.Mesh(baseGeo, mat);

      const tubesGeo = new THREE.BoxGeometry(0.7, 0.5, 0.9);
      const tubes = new THREE.Mesh(tubesGeo, new THREE.MeshStandardMaterial({ color: 0x1f2937 }));
      tubes.position.set(0, 0.45, 0);
      tubes.rotation.x = 0.35;

      group.add(base, tubes);
      break;
    }
    default: {
      const defaultGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const mesh = new THREE.Mesh(defaultGeo, new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
      group.add(mesh);
      break;
    }
  }

  return group;
}

/**
 * Assembles a finished EquipmentVariant into a fully realized THREE.Group complete with
 * chassis, attached modules mounted on named sockets, and a live socket lookup map.
 */
export function buildEquipmentModel(variant: EquipmentVariant): THREE.Group {
  const containerGroup = new THREE.Group();
  containerGroup.name = `Variant_${variant.variantId}`;

  const chassisDef = CHASSIS_REGISTRY[variant.chassisId];
  if (!chassisDef) {
    console.warn(`Chassis definition not found for ID: ${variant.chassisId}. Falling back to default box.`);
    const fallback = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    containerGroup.add(fallback);
    return containerGroup;
  }

  // 1. Instantiate Chassis Mesh
  const chassisMesh = createProceduralMesh(chassisDef.proceduralBuilderKey);
  containerGroup.add(chassisMesh);

  // Map for storing named socket world references
  const socketMap: Record<string, THREE.Object3D> = {};

  // Register chassis sockets
  chassisDef.sockets.forEach((s) => {
    const sObj = new THREE.Object3D();
    sObj.position.set(...s.localOffset);
    if (s.localRotation) {
      sObj.rotation.set(...s.localRotation);
    }
    chassisMesh.add(sObj);
    socketMap[s.socketId] = sObj;
  });

  // 2. Attach Installed Modules onto Hardpoints / Sockets
  variant.installedModules.forEach((installed) => {
    const slotDef = chassisDef.hardpoints.find((h) => h.slotId === installed.slotId);
    if (!slotDef) return;

    const targetSocket = socketMap[slotDef.socketId];
    if (!targetSocket) return;

    const moduleDef = MODULE_REGISTRY[installed.moduleId];
    if (!moduleDef) return;

    const moduleGroup = new THREE.Group();
    moduleGroup.name = `Module_${installed.moduleId}`;

    if (moduleDef.capabilities.some((c) => c.primitive === 'EMIT_PROJECTILE')) {
      const podMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.15, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
      );
      moduleGroup.add(podMesh);
    } else if (moduleDef.capabilities.some((c) => c.primitive === 'EXTEND_RANGE')) {
      const tankGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12);
      tankGeo.rotateX(Math.PI / 2);
      const tankMesh = new THREE.Mesh(tankGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
      moduleGroup.add(tankMesh);
    }

    targetSocket.add(moduleGroup);
  });

  containerGroup.userData = {
    variantId: variant.variantId,
    sockets: socketMap,
  };

  return containerGroup;
}