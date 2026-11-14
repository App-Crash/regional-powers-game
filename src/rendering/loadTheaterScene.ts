import * as THREE from 'three';
import { gameApi } from '../services/gameApi';
import { buildTheaterRegion } from '../services/factions';
import { type RuntimeHexEntity } from '../features/home/HexTypes';
import { createEmergentHexStructures } from './proceduralCityEngine';

export async function initializeTheaterScene(
  sceneGroup: THREE.Group,
  overrideHexes?: RuntimeHexEntity[]
): Promise<Record<string, RuntimeHexEntity>> {
  const loadedHexRegistry: Record<string, RuntimeHexEntity> = {};

  try {
    // Clear existing structures if re-initializing
    while (sceneGroup.children.length > 0) {
      sceneGroup.remove(sceneGroup.children[0]);
    }

    let theaterHexes: RuntimeHexEntity[];
    if (overrideHexes && overrideHexes.length > 0) {
      theaterHexes = overrideHexes;
    } else {
      const apiHexes = await gameApi.getRuntimeTheater().catch(() => []);
      const regionalHexes = buildTheaterRegion('SA');
      const mergedMap = new Map<string, RuntimeHexEntity>();
      for (const h of regionalHexes) mergedMap.set(h.id, h);
      for (const h of apiHexes) mergedMap.set(h.id, h);
      theaterHexes = Array.from(mergedMap.values());
    }

    theaterHexes.forEach((hex) => {
      loadedHexRegistry[hex.id] = hex;

      // Safe fallback supporting both abbreviated (infra_nodes / cat) and legacy properties
      const nodes = hex.infra_nodes || (hex as any).infrastructureNodes || [];
      const hasManufacturing = nodes.some((n: any) => {
        const c = n.cat || n.category;
        return (
          c === 'HVY_MFG' ||
          c === 'CON_MFG' ||
          c === 'HEAVY_MANUFACTURING' ||
          c === 'CONSUMER_MANUFACTURING'
        );
      });

      if (hex.population >= 100000 || hasManufacturing) {
        const hexClusterGroup = createEmergentHexStructures(hex);
        hexClusterGroup.userData.runtimeHex = hex;
        sceneGroup.add(hexClusterGroup);
      }
    });

    console.log(
      `[TheaterEngine] Successfully rendered emergent structures for ${theaterHexes.length} regional theater hexes.`
    );
  } catch (error) {
    console.error('[TheaterEngine] Error initializing theater scene:', error);
  }

  return loadedHexRegistry;
}