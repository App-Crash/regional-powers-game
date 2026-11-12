import * as THREE from 'three';
import { gameApi } from '../services/gameApi';
import { type RuntimeHexEntity } from '../features/home/HexTypes';
import { createEmergentHexStructures } from './proceduralCityEngine';

export async function initializeTheaterScene(sceneGroup: THREE.Group): Promise<Record<string, RuntimeHexEntity>> {
  const loadedHexRegistry: Record<string, RuntimeHexEntity> = {};

  try {
    const theaterHexes = await gameApi.getRuntimeTheater();

    theaterHexes.forEach((hex) => {
      loadedHexRegistry[hex.id] = hex;

      // Safe fallback supporting both abbreviated (infra_nodes / cat) and legacy properties
      const nodes = hex.infra_nodes || (hex as any).infrastructureNodes || [];
      const hasManufacturing = nodes.some(
        (n: any) => {
          const c = n.cat || n.category;
          return c === 'HVY_MFG' || c === 'CON_MFG' || c === 'HEAVY_MANUFACTURING' || c === 'CONSUMER_MANUFACTURING';
        }
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