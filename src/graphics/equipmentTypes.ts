// src/graphics/equipmentTypes.ts

export type MobilityDomain =
  | 'AIR_ROTOR'
  | 'AIR_FIXED_WING'
  | 'SUBSURFACE'
  | 'SURFACE_NAVAL'
  | 'GROUND_TRACKED'
  | 'GROUND_WHEELED'
  | 'GROUND_INFANTRY'
  | 'STATIC_FACILITY';

export type ModMountType = 'FIXED' | 'CONFIGURABLE';

export type HardpointSlotType =
  | 'EXTERNAL_PYLON'
  | 'INTERNAL_BAY'
  | 'VLS_CELL'
  | 'TORPEDO_TUBE'
  | 'TURRET_ROOF'
  | 'TURRET_PINTLE'
  | 'CARGO_DECK_TEU'
  | 'INFANTRY_GEAR';

export type ActionPrimitiveType =
  | 'EMIT_PROJECTILE'
  | 'DEPLOY_SUB_UNIT'
  | 'SENSOR_EMIT'
  | 'ECM_JAM'
  | 'EXTEND_RANGE'
  | 'ARMOR_PROTECTION';

export interface SocketDefinition {
  socketId: string;
  localOffset: [number, number, number];
  localRotation?: [number, number, number];
}

export interface HardpointSlot {
  slotId: string;
  slotType: HardpointSlotType;
  mountType: ModMountType; // FIXED = factory welded; CONFIGURABLE = field/garage swappable
  socketId: string;
  maxWeightKg: number;
}

export interface ModuleCapability {
  primitive: ActionPrimitiveType;
  munitionVariantId?: string;
  emitSocketId?: string;
  salvoCapacity?: number;
  trajectory?: 'DIRECT_FIRE' | 'HIGH_ARC' | 'UNDERWATER_BROACH_TO_CRUISE' | 'NAP_OF_THE_EARTH';
  statModifiers?: Record<string, number>;
}

/**
 * Base platform definition (e.g., UH-60 Hull, Los Angeles Flight I Hull, T-90M Hull)
 */
export interface ChassisDef {
  chassisId: string;
  displayName: string;
  domain: MobilityDomain;
  tags: string[];
  proceduralBuilderKey: string; // Maps to builder in src/graphics/builders/
  glbAssetPath?: string; // Optional external .glb override
  baseScale: number;
  sockets: SocketDefinition[];
  hardpoints: HardpointSlot[];
}

/**
 * Attachable weapon, sensor, fuel tank, or welded armor package
 */
export interface ModuleDef {
  moduleId: string;
  displayName: string;
  mountType: ModMountType;
  compatibleSlotTypes: HardpointSlotType[];
  compatibleChassisTags: string[];
  proceduralBuilderKey?: string;
  glbAssetPath?: string;
  weightKg: number;
  sockets?: SocketDefinition[]; // Sub-sockets exposed by this module (e.g., missile tube tip)
  capabilities: ModuleCapability[];
}

export interface InstalledModule {
  slotId: string;
  moduleId: string;
  mountType: ModMountType;
  originNote?: string; // e.g., "Factory Welded 2025" or "Cmdr. Silva Field Improvisation"
}

/**
 * THE FINISHED PRODUCT:
 * Compiled in Garage / R&D / Faction Roster and stored in inventory.
 * Consumed identically by the Garage 3D Turntable and CinematicReplayManager.
 */
export interface EquipmentVariant {
  variantId: string;
  displayName: string;
  factionId: string;
  chassisId: string;
  installedModules: InstalledModule[];
  paintScheme: {
    primaryHex: string;
    secondaryHex: string;
    accentHex?: string;
  };
  computedStats: {
    totalWeightKg: number;
    rangeHexes: number;
    stealthRating: number;
    nightCapable: boolean;
  };
}