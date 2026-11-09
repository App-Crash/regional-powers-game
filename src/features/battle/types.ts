export interface Unit {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  type: 'DRONE' | 'MISSILE' | 'STRIKER' | 'SUPPORT';
  rangeClass: 'short' | 'mid' | 'long';
  atk: number;
  range: number;
  speed: number;
  color: string;
  reliabilityRate: number;
  stealthRating: number;
  inventoryCount: number;
}

export interface PackageAllocation {
  unitId: string;
  count: number;
}

export interface DoctrinePlan {
  id: string;
  name: string;
  doctrine: string;
  desc: string;
  strategicTradeoff: string;
  icon: any;
}

export type TargetCategory = 'logistics' | 'energy' | 'bases' | 'political' | 'manufacturing';

export interface MobileAirDefenseNode {
  id: string;
  name: string;
  x: number;
  y: number;
  detectionRadius: number;
  isConcealed: boolean;
  isRevealed: boolean;
  ammoRemaining: number; // Limited missile loadout (e.g. 2-3 engagements max)
}

export interface CampaignTarget {
  id: string;
  category: TargetCategory;
  name: string;
  x: number;
  y: number;
  airDefenseDensity: 'Low' | 'Moderate' | 'Heavy Integrated Grid';
  strategicIntent: string;
  samAlertState: 'Standard' | 'High Alert' | 'Blinded / Jammed';
  damageLevel: number;
  smokeTurnsRemaining: number;
  requiredAssetsHint: string;
}
export interface MobileAirDefenseNode {
  id: string;
  name: string;
  x: number;
  y: number;
  detectionRadius: number;
  isConcealed: boolean;
  isRevealed: boolean;
  ammoRemaining: number;
  isDestroyed?: boolean; // Add this property
}

export type TargetPriority = CampaignTarget;
export type TargetPriorityId = TargetCategory;