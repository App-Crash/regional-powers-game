import * as THREE from 'three';
import { createHexHighlightMesh } from './HexGridLayer';
import type { HexData, RuntimeHexEntity } from './HexTypes';
import { playSoundForHex, stopSectorSound } from './sectorAudio';

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
  let clickCounter = 0;

  const onMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return;
    clickStartTime = Date.now();
  };

  const onClick = (event: MouseEvent) => {
    if (event.button !== 0) return;
    
    clickCounter++;
    const duration = Date.now() - clickStartTime;
    if (duration > 300) return; // Ignore drags

    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Collect pickable hit targets from both the grid layer and the entire scene (structures, etc.)
    const hitTargets: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Check if this mesh or any parent group holds hexData or runtimeHex
        let p: THREE.Object3D | null = child;
        let hasData = false;
        while (p) {
          if (p.userData?.hexData || p.userData?.runtimeHex) {
            hasData = true;
            break;
          }
          p = p.parent;
        }
        if (hasData) {
          hitTargets.push(child);
        }
      }
    });

    const intersects = raycaster.intersectObjects(hitTargets, false);

    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      let selectedHex: (HexData | RuntimeHexEntity) | undefined = undefined;

      // Traverse up to find hexData or runtimeHex
      while (obj) {
        if (obj.userData?.hexData) {
          selectedHex = obj.userData.hexData;
          break;
        }
        if (obj.userData?.runtimeHex) {
          selectedHex = obj.userData.runtimeHex;
          break;
        }
        obj = obj.parent;
      }

      console.log(`--- CLICK DIAGNOSTIC #${clickCounter} (SUCCESS) ---`, {
        hitHex: selectedHex ? { q: selectedHex.q, r: selectedHex.r, sett_name: selectedHex.sett_name } : null,
        hitPoint3D: { 
          x: intersects[0].point.x.toFixed(2), 
          y: intersects[0].point.y.toFixed(2), 
          z: intersects[0].point.z.toFixed(2) 
        }
      });

      if (selectedHex) {
        onSelectHex(selectedHex);
        playSoundForHex(selectedHex);
        
        // Remove previous highlight
        if (currentHighlight) {
          hexGridGroup.remove(currentHighlight);
        }

        // Add new highlight to grid group
        currentHighlight = createHexHighlightMesh(selectedHex.q, selectedHex.r);
        hexGridGroup.add(currentHighlight);
        return;
      }
    } else {
      console.warn(`[CLICK #${clickCounter}] Raycast missed all valid hex and structure hit targets.`);
    }

    onSelectHex(null);
    stopSectorSound();
    if (currentHighlight) {
      hexGridGroup.remove(currentHighlight);
      currentHighlight = null;
    }
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