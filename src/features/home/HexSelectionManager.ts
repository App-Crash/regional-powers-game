import * as THREE from 'three';
import { createHexHighlightMesh } from './HexGridLayer';

export interface HexMetadata {
  id: string;
  q: number;
  r: number;
  title: string;
  brigade: string;
  resource: string;
  terrain: string;
}

export function setupHexSelection(
  domElement: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  hexGridGroup: THREE.Group,
  onSelectHex: (hex: HexMetadata) => void
): () => void {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentHighlight: THREE.Object3D | null = null;

  const handleMouseDown = (event: MouseEvent) => {
    // Reversal: Left-Click Selection Protocol (button === 0)
    if (event.button !== 0) return;

    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hexGridGroup.children, true);
    const hexHit = intersects.find(i => i.object.userData && i.object.userData.type === 'hex');

    if (hexHit) {
      const { id, q, r } = hexHit.object.userData;

      if (currentHighlight) {
        scene.remove(currentHighlight);
      }

      const highlight = createHexHighlightMesh(q, r);
      scene.add(highlight);
      currentHighlight = highlight;

      onSelectHex({
        id,
        q,
        r,
        title: `Sector [${q}, ${r}]`,
        brigade: (q === 4 && r === -3) ? 'Forward Air Brigade' : (q === 0 && r === 0) ? 'Command Staff HQ' : '54th Mechanized Infantry',
        resource: (q === -3 && r === 2) ? 'Manufacturing Hub' : 'Rare Earths Deposit',
        terrain: (q > 3) ? 'Coastal Delta' : 'Mountainous Sector',
      });
    }
  };

  domElement.addEventListener('mousedown', handleMouseDown, { capture: true });

  return () => {
    domElement.removeEventListener('mousedown', handleMouseDown, { capture: true });
    if (currentHighlight) scene.remove(currentHighlight);
  };
}