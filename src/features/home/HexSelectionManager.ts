import * as THREE from 'three';
import { createHexHighlightMesh } from './HexGridLayerDebug';
import type { HexData } from './HexTypes';

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

    const hitTargets: THREE.Object3D[] = [];
    hexGridGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData && child.userData.hexData) {
        hitTargets.push(child);
      }
    });

    const intersects = raycaster.intersectObjects(hitTargets, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const selectedHex = hitMesh.userData?.hexData as HexData | undefined;

      console.log(`--- CLICK DIAGNOSTIC #${clickCounter} (SUCCESS) ---`, {
        hitHex: selectedHex ? { q: selectedHex.q, r: selectedHex.r } : null,
        hitPoint3D: { 
          x: intersects[0].point.x.toFixed(2), 
          y: intersects[0].point.y.toFixed(2), 
          z: intersects[0].point.z.toFixed(2) 
        }
      });

      if (selectedHex) {
        onSelectHex(selectedHex);
        
        // 🔑 Remove previous highlight from hexGridGroup
        if (currentHighlight) {
          hexGridGroup.remove(currentHighlight);
        }

        // 🔑 Add new highlight directly to hexGridGroup so it matches local space & curvature
        currentHighlight = createHexHighlightMesh(selectedHex.q, selectedHex.r);
        hexGridGroup.add(currentHighlight);
        return;
      }
    } else {
      console.warn(`[CLICK #${clickCounter}] Raycast missed all hex hit meshes.`);
    }

    onSelectHex(null);
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
    if (currentHighlight) {
      hexGridGroup.remove(currentHighlight);
      currentHighlight = null;
    }
  };
}