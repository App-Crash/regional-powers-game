import * as THREE from 'three';
import { gameApi, type RuntimeHexEntity } from '../services/gameApi';
import { createEmergentHexStructures } from './proceduralCityEngine';

export async function initializeTheaterScene(sceneGroup: THREE.Group): Promise<Record<string, RuntimeHexEntity>> {
  const loadedHexRegistry: Record<string, RuntimeHexEntity> = {};

  try {
    const theaterHexes = await gameApi.getRuntimeTheater();

    theaterHexes.forEach((hex) => {
      loadedHexRegistry[hex.id] = hex;

      const hasManufacturing = hex.infrastructureNodes.some(
        n => n.category === 'HEAVY_MANUFACTURING' || n.category === 'CONSUMER_MANUFACTURING'
      );
      
      if (hex.population >= 100000 || hasManufacturing) {
        const hexClusterGroup = createEmergentHexStructures(hex);
        hexClusterGroup.userData.runtimeHex = hex;
        sceneGroup.add(hexClusterGroup);
      }
    });

    console.log(`[TheaterEngine] Successfully rendered emergent structures for ${theaterHexes.length} Colombia theater hexes.`);
  } catch (error) {
    console.error('[TheaterEngine] Error initializing theater scene:', error);
  }

  return loadedHexRegistry;
}