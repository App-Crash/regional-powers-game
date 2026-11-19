import * as THREE from 'three';
import { createHexHighlightMesh, GLOBAL_HEX_DATA } from './HexGridLayer';
import type { HexData } from './HexTypes';
import { playSoundForHex, stopSectorSound } from './sectorAudio';

export function setupHexSelection(
  domElement: HTMLElement,
  camera: THREE.Camera,
  hexGridGroup: THREE.Group,
  onSelectHex: (hex: HexData | null) => void
) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentHighlight: THREE.Object3D | null = null;
  let clickStartTime = 0;

  const onMouseDown = () => {
    clickStartTime = Date.now();
  };

  const onClick = (event: MouseEvent) => {
    if (event.button !== 0) return;
    if (Date.now() - clickStartTime > 300) return;

    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hitMeshes: THREE.Object3D[] = [];
    hexGridGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData?.hexData) {
        hitMeshes.push(child);
      }
    });

    console.log(`[HexSelectionManager Diagnostics] Raycasting against ${hitMeshes.length} hex hit meshes in hexGridGroup.`);

    const intersects = raycaster.intersectObjects(hitMeshes, false);
    if (intersects.length > 0) {
      const hitHex = intersects[0].object.userData.hexData as HexData;
      if (hitHex) {
        console.log(`[HexSelectionManager Diagnostics] ✅ Successfully intersected hex (${hitHex.q}, ${hitHex.r}) named "${hitHex.sett_name}". Triggering onSelectHex.`);
        onSelectHex(hitHex);
        playSoundForHex(hitHex);

        if (currentHighlight) hexGridGroup.remove(currentHighlight);
        currentHighlight = createHexHighlightMesh(hitHex.q, hitHex.r);
        hexGridGroup.add(currentHighlight);
        return;
      }
    }

    console.warn(`[HexSelectionManager Diagnostics] ⚠️ Raycast missed all hex hit meshes. Total GLOBAL_HEX_DATA entries: ${GLOBAL_HEX_DATA.size}`);
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
    if (currentHighlight) hexGridGroup.remove(currentHighlight);
  };
}