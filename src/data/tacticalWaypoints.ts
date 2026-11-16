import * as THREE from 'three';

/**
 * OP-MIDNIGHT-LANCE Tactical Waypoints & Coordinate Registry
 * Spatial Guide for 3D Theater:
 * - X: West (-) to East (+) [Scaled for wide 20+ hex span]
 * - Y: Elevation (+) for surface/water level (avoid deep negative values)
 * - Z: North (-) to South (+) [Large negative Z pushes deep into the Caribbean]
 */
export const TACTICAL_WAYPOINTS: Record<string, [number, number, number]> = {
  // 1. Submarine (Caribbean Sea, 20+ hexes North at Z: -18.5, Y: 0.15 just at water level)
  'HEX-CARIBBEAN-SUB-01': [5.2, 0.15, -18.5],

  // 2. Supply Depot (Target at Grid [3, 5], sea-level elevation)
  'HEX-VEN-MARACAY-DEPOT': [2.2, 0.2, -4.5],

  // 3. Staging & Border Crossings (Western border area)
  'HEX-COL-CUCUTA-BORDER': [-6.5, 0.4, 2.5],
  'HEX-COL-ARAUCA-FOB': [-5.8, 0.4, 4.2],

  // 4. Ground Transit & Highway Corridors
  'HEX-VEN-TACHIRA-HIGHWAY': [-4.2, 0.5, 2.0],
  'HEX-VEN-BARINAS-ROAD': [-1.5, 0.6, 0.8],

  // 5. Caracas Theater Hub Reference
  'HEX-VEN-CARACAS-OUTSKIRTS': [1.8, 0.7, -6.2],
  'HEX-VEN-MIRAFLORES-COMPOUND': [2.0, 0.75, -6.8],
};

/**
 * Helper utility to resolve any waypoint ID into a THREE.Vector3 instance.
 * Provides a safe default fallback if an ID is unregistered.
 */
export function getWaypointPosition(waypointId: string): THREE.Vector3 {
  const coords = TACTICAL_WAYPOINTS[waypointId];
  if (coords) {
    return new THREE.Vector3(...coords);
  }
  console.warn(`[TacticalWaypoints] Waypoint ID "${waypointId}" not found. Defaulting to origin.`);
  return new THREE.Vector3(0, 0.5, 0);
}