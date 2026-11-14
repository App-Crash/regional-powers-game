import * as THREE from 'three';
import { createHexHighlightMesh, axialToWorld, GLOBAL_HEX_DATA } from './HexGridLayer';
import { TERRAIN_ROTATION_X } from './CurvedTerrain';
import type { HexData, RuntimeHexEntity } from './HexTypes';
import { playSoundForHex, stopSectorSound } from './sectorAudio';

const HEX_SIZE = 1.3;
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;

export function setupHexSelection(
  domElement: HTMLElement,
  camera: THREE.Camera,
  scene: THREE.Scene,
  hexGridGroup: THREE.Group,
  onSelectHex: (hex: HexData | null) => void
) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentHighlight: THREE.Object3D | null = null;
  let clickStartTime = 0;
  let clickCount = 0;

  const highlightSelectedHex = (q: number, r: number) => {
    if (currentHighlight) {
      console.log(`[Diagnostic] Removing previous highlight mesh from hexGridGroup`);
      hexGridGroup.remove(currentHighlight);
    }
    try {
      currentHighlight = createHexHighlightMesh(q, r);
      hexGridGroup.add(currentHighlight);
      console.log(`[Diagnostic] ✨ Successfully created & added highlight mesh for (${q}, ${r})`, currentHighlight);
    } catch (err) {
      console.error(`[Diagnostic] ❌ Error creating highlight mesh for (${q}, ${r}):`, err);
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return;
    clickStartTime = Date.now();
  };

  const onClick = (event: MouseEvent) => {
    if (event.button !== 0) return;
    clickCount++;
    
    const duration = Date.now() - clickStartTime;
    if (duration > 300) {
      console.log(`[Diagnostic #${clickCount}] Click ignored (drag duration: ${duration}ms)`);
      return;
    }

    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    console.group(`🔍 [Diagnostic Click #${clickCount}] Mouse NDC: (${mouse.x.toFixed(2)}, ${mouse.y.toFixed(2)})`);

    const hexHitMeshes: THREE.Object3D[] = [];
    const terrainMeshes: THREE.Object3D[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.userData?.hexData || child.userData?.runtimeHex) {
          hexHitMeshes.push(child);
        } else if (child.name === 'Terrain' || child.geometry instanceof THREE.PlaneGeometry || child.geometry instanceof THREE.SphereGeometry) {
          terrainMeshes.push(child);
        }
      }
    });

    console.log(`- Hex hit meshes inspected: ${hexHitMeshes.length}, Terrain meshes: ${terrainMeshes.length}`);

    const hexIntersects = raycaster.intersectObjects(hexHitMeshes, false);
    let selectedHex: (HexData | RuntimeHexEntity) | undefined = undefined;

    if (hexIntersects.length > 0) {
      console.log(`- Hit pre-existing hex mesh intersection count: ${hexIntersects.length}`);
      let obj: THREE.Object3D | null = hexIntersects[0].object;
      while (obj) {
        if (obj.userData?.hexData) {
          selectedHex = obj.userData.hexData;
          console.log(`- Found existing hexData:`, selectedHex);
          break;
        }
        if (obj.userData?.runtimeHex) {
          selectedHex = obj.userData.runtimeHex;
          console.log(`- Found runtimeHex:`, selectedHex);
          break;
        }
        obj = obj.parent;
      }
    }

    if (!selectedHex) {
      const terrainIntersects = raycaster.intersectObjects(terrainMeshes.length > 0 ? terrainMeshes : hexHitMeshes, false);
      console.log(`- Terrain fallback intersection count: ${terrainIntersects.length}`);

      if (terrainIntersects.length > 0) {
        const point = terrainIntersects[0].point;
        const rotX = TERRAIN_ROTATION_X;

        const wx = point.x;
        const wy = point.y * Math.cos(rotX) + point.z * Math.sin(rotX);

        const r = Math.round(wy / ((HEX_HEIGHT * 3) / 4));
        const q = Math.round((wx / HEX_WIDTH) - (r / 2));

        console.log(`- Calculated dynamic q: ${q}, r: ${r} from point:`, point);

        const existingKey = `${q},${r}`;
        if (GLOBAL_HEX_DATA.has(existingKey)) {
          selectedHex = GLOBAL_HEX_DATA.get(existingKey);
          console.log(`- Resolved to existing global hex data for key ${existingKey}:`, selectedHex);
        } else {
          const worldPos = axialToWorld(q, r);
          selectedHex = {
            id: `dynamic_${q}_${r}`,
            q,
            r,
            wx: worldPos.wx,
            wy: worldPos.wy,
            terrain: 'plain',
            fac_ctl: 'neutral',
            infra: 1,
            population: 15000,
            sett_name: `Sector (${q}, ${r})`,
            elevation: 0,
            infra_nodes: [],
          } as unknown as RuntimeHexEntity;
          console.log(`- Generated dynamic runtime hex entity:`, selectedHex);
        }
      }
    }

    if (selectedHex) {
      console.log(`✅ Final Selected Hex to Highlight & Open Modal:`, { q: selectedHex.q, r: selectedHex.r, name: selectedHex.sett_name });
      onSelectHex(selectedHex);
      playSoundForHex(selectedHex);
      highlightSelectedHex(selectedHex.q, selectedHex.r);
      console.groupEnd();
      return;
    }

    console.warn(`⚠️ Click resulted in NO selected hex.`);
    onSelectHex(null);
    stopSectorSound();
    if (currentHighlight) {
      hexGridGroup.remove(currentHighlight);
      currentHighlight = null;
    }
    console.groupEnd();
  };

  domElement.addEventListener('mousedown', onMouseDown);
  domElement.addEventListener('click', onClick);

  return () => {
    domElement.removeEventListener('mousedown', onMouseDown);
    domElement.removeEventListener('click', onClick);
    stopSectorSound();
    if (currentHighlight) {
      hexGridGroup.remove(currentHighlight);
      currentHighlight = null;
    }
  };
}