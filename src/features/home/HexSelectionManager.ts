import * as THREE from 'three';
import { GLOBAL_HEX_DATA, createHexHighlightMesh } from './HexGridLayer';
import type { HexData } from './HexDataModel';

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

  const onClick = (event: MouseEvent) => {
    if (event.button !== 0) return; // Left-click only

    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const raycastPlane = hexGridGroup.getObjectByName('HexRaycastPlane');
    if (!raycastPlane) return;

    const intersects = raycaster.intersectObject(raycastPlane);

    if (intersects.length > 0) {
      const hitPoint = intersects[0].point;

      // Reverse the terrain rotation on the hit point to evaluate flat axial space accurately
      // rotX is ~ -0.35 rad
      const rotX = -0.35; 
      const unrotatedY = hitPoint.y * Math.cos(rotX) + hitPoint.z * Math.sin(rotX);
      const unrotatedX = hitPoint.x;

      // Inverse axial coordinate conversion from cartesian (unrotatedX, unrotatedY)
      const qFloat = (unrotatedX * Math.sqrt(3) / 3 - unrotatedY / 3) / HEX_SIZE;
      const rFloat = (unrotatedX * 0 + unrotatedY * 2 / 3) / HEX_SIZE;

      // Round axial coordinates to nearest valid integer hex grid coordinate
      const q = Math.round(qFloat);
      const r = Math.round(rFloat);
      const s = -q - r;

      // Validate against our map bounds (-17 to 17)
      const hexKey = `hex_${q}_${r}`;
      let selectedHex: HexData | undefined = GLOBAL_HEX_DATA.get(hexKey);

      // Fallback: nearest neighbor search if edge boundary rounding drifts slightly
      if (!selectedHex) {
        let minDist = Infinity;
        GLOBAL_HEX_DATA.forEach((hex) => {
          const dist = Math.hypot(hex.wx - unrotatedX, hex.wy - unrotatedY);
          if (dist < minDist) {
            minDist = dist;
            selectedHex = hex;
          }
        });
      }

      if (selectedHex) {
        onSelectHex(selectedHex);

        if (currentHighlight) {
          scene.remove(currentHighlight);
        }
        currentHighlight = createHexHighlightMesh(selectedHex.q, selectedHex.r);
        scene.add(currentHighlight);
        return;
      }
    }

    onSelectHex(null);
    if (currentHighlight) {
      scene.remove(currentHighlight);
      currentHighlight = null;
    }
  };

  domElement.addEventListener('click', onClick);

  return () => {
    domElement.removeEventListener('click', onClick);
    if (currentHighlight) {
      scene.remove(currentHighlight);
    }
  };
}