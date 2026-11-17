// src/features/weapons/WeaponRig.ts
import * as THREE from 'three';
import { createWeaponAsset, type WeaponAssetRig } from './WeaponAssetBuilder';

export interface LaunchProfile {
  ejectionSpeed: number;     // Initial burst velocity
  gravityDropFactor: number; // The "dip" severity (high for ATGM drop, low for cruise missile)
  sustainerDelay: number;    // Seconds before main motor ignites
  deployDuration: number;    // Duration of wing snap-out
}

export const PROFILES: Record<string, LaunchProfile> = {
  atgm: { ejectionSpeed: 3.5, gravityDropFactor: 4.2, sustainerDelay: 0.8, deployDuration: 0.3 },
  s300: { ejectionSpeed: 5.0, gravityDropFactor: 1.5, sustainerDelay: 1.2, deployDuration: 0.4 },
  cruise_missile: { ejectionSpeed: 4.2, gravityDropFactor: 0.5, sustainerDelay: 1.0, deployDuration: 0.35 },
};

export class WeaponRigController {
  public asset: WeaponAssetRig;
  private profile: LaunchProfile;

  constructor(weaponType: 'atgm' | 's300' | 'cruise_missile') {
    this.asset = createWeaponAsset(weaponType);
    this.profile = PROFILES[weaponType];
  }

  /**
   * Evaluates position, rotation, and lifecycle state given local elapsed time (tLocal in seconds).
   * Perfect for Garage scrubbers, Laboratory test benches, and Movie cutscenes alike.
   */
  public evaluateKinematics(tLocal: number): { position: THREE.Vector3; state: string } {
    const pos = new THREE.Vector3();

    if (tLocal <= 0) {
      this.asset.setLaunchPhase('STOWED');
      return { position: pos, state: 'STOWED' };
    }

    if (tLocal < this.profile.sustainerDelay) {
      // PHASE 1: COLD-LAUNCH EJECTION & INERTIAL DIP
      this.asset.setLaunchPhase('EJECTION');
      const p = tLocal / this.profile.sustainerDelay;
      
      // Upward burst minus gravity pull (creates the realistic drop before motor kicks in)
      const upward = p * this.profile.ejectionSpeed;
      const dip = Math.pow(p, 2) * this.profile.gravityDropFactor;
      pos.set(0, upward - dip, p * 0.8);

      return { position: pos, state: 'EJECTION' };
    } 
    
    if (tLocal < this.profile.sustainerDelay + this.profile.deployDuration) {
      // PHASE 2: APOGEE DEPLOYMENT & WING SNAP-OUT
      this.asset.setLaunchPhase('DEPLOYMENT');
      const deployP = (tLocal - this.profile.sustainerDelay) / this.profile.deployDuration;
      
      this.asset.setWingDeployment(deployP);
      pos.set(0, this.profile.ejectionSpeed - this.profile.gravityDropFactor + (deployP * 0.5), 0.8 + (deployP * 0.4));

      return { position: pos, state: 'DEPLOYMENT' };
    } 
    
    // PHASE 3: SUSTAINER CRUISE FLIGHT
    this.asset.setLaunchPhase('CRUISE');
    const cruiseT = tLocal - (this.profile.sustainerDelay + this.profile.deployDuration);
    pos.set(0, 2.0 + (cruiseT * 3.0), 1.2 + (cruiseT * 6.0));

    return { position: pos, state: 'CRUISE' };
  }
}