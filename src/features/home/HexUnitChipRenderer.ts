import * as THREE from 'three';
import { getHexCenterPosition } from './HexGridLayer';
import { type CombatUnit } from '../../types/unitOrders';

// Procedural Canvas generator for NATO symbols on tabletop game chips
function createNatoSymbolTexture(domain: string, isSelected: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Background chip fill
    ctx.fillStyle = isSelected ? '#38bdf8' : '#1e293b';
    ctx.fillRect(0, 0, 256, 128);

    // Outer NATO frame border
    ctx.strokeStyle = isSelected ? '#bae6fd' : '#64748b';
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 244, 116);

    // NATO Symbol Icon based on domain (X for infantry/mechanized, Air foil, etc.)
    ctx.strokeStyle = isSelected ? '#0369a1' : '#f8fafc';
    ctx.fillStyle = isSelected ? '#0369a1' : '#f8fafc';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';

    if (domain === 'air') {
      // Air wing chevron / wings
      ctx.beginPath();
      ctx.moveTo(64, 85);
      ctx.lineTo(128, 45);
      ctx.lineTo(192, 85);
      ctx.stroke();
    } else {
      // Ground division / mechanized cross (X inside frame)
      ctx.beginPath();
      ctx.moveTo(60, 35);
      ctx.lineTo(196, 95);
      ctx.moveTo(196, 35);
      ctx.lineTo(60, 95);
      ctx.stroke();
    }

    // XX echelon indicator (Division size) on top of frame
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('XX', 128, 28);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function renderStationedUnitChips(
  stackGroup: THREE.Group,
  units: CombatUnit[],
  selectedUnitId: string | null
) {
  stackGroup.clear();

  const hexMap = new Map<string, CombatUnit[]>();
  units.forEach((u) => {
    const key = `${u.q},${u.r}`;
    const list = hexMap.get(key) || [];
    list.push(u);
    hexMap.set(key, list);
  });

  hexMap.forEach((hexUnits, key) => {
    const [qStr, rStr] = key.split(',');
    const q = parseInt(qStr, 10);
    const r = parseInt(rStr, 10);
    const center = getHexCenterPosition(q, r);

    // Compute exact surface normal vector at hex center
    const pCenter = new THREE.Vector3(center.x, center.y, center.z);
    const pRight = getHexCenterPosition(q + 1, r);
    const pTop = getHexCenterPosition(q, r + 1);

    const vRight = new THREE.Vector3(pRight.x, pRight.y, pRight.z).sub(pCenter);
    const vTop = new THREE.Vector3(pTop.x, pTop.y, pTop.z).sub(pCenter);
    const normal = new THREE.Vector3().crossVectors(vRight, vTop).normalize();

    // Reorder units so the selected unit is always sorted to the end (top of stack)
    const sortedUnits = [...hexUnits].sort((a, b) => {
      if (a.id === selectedUnitId) return 1;
      if (b.id === selectedUnitId) return -1;
      return 0;
    });

    sortedUnits.forEach((unit, index) => {
      const isSelected = unit.id === selectedUnitId;
      // Increased size (1.4 x 0.8) and height offset to avoid z-fighting with infrastructure 3D models
      const elevation = 0.35 + index * 0.12;

      const geo = new THREE.PlaneGeometry(1.4, 0.8);
      const texture = createNatoSymbolTexture(unit.domain, isSelected);

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        pCenter.x + normal.x * elevation,
        pCenter.y + normal.y * elevation,
        pCenter.z + normal.z * elevation
      );

      // Align rotation matrix so the plane lies flush with the curved terrain normal
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      mesh.renderOrder = 60 + index;

      stackGroup.add(mesh);
    });
  });
}