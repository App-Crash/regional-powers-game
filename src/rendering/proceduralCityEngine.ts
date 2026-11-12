import * as THREE from 'three';
import { type RuntimeHexEntity, type InfraNode } from '../features/home/HexTypes';
import { getHexCenterPosition } from '../features/home/HexGridLayerDebug';
import { alignToSurfaceNormal } from '../features/home/CurvedTerrain';

const HEX_SIZE = 1.3;
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;

const matUrbanTower = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.4 });
const matUrbanMid = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.3 });
const matFactory = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.5 });
const matStack = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.8 });
const matBase = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
const matRuins = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });

export function createEmergentHexStructures(hex: RuntimeHexEntity): THREE.Group {
  const hexGroup = new THREE.Group();
  // Bind both identifier fields and the full runtimeHex object for bulletproof raycasting
  hexGroup.userData = { 
    hexId: hex.id, 
    q: hex.q, 
    r: hex.r, 
    type: 'hex_structure_cluster',
    runtimeHex: hex 
  };

  const pop = hex.population;
  const isGreyZone = hex.ctrl === null || pop < 500;
  
  const nodes = hex.infra_nodes || (hex as any).infrastructureNodes || [];
  const industrialTierSum = nodes
    .filter((n: InfraNode & { cat?: string; category?: string }) => {
      const c = n.cat || n.category;
      return (c === 'HVY_MFG' || c === 'CON_MFG') && n.state === 'online';
    })
    .reduce((acc: number, n: InfraNode & { cap?: number; capacity?: number }) => {
      const capacityVal = n.cap ?? n.capacity ?? 100;
      return acc + (n.tier * (capacityVal / 100));
    }, 0);

  const baseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.08, 12);
  const baseMesh = new THREE.Mesh(baseGeo, matBase);
  baseMesh.position.y = 0.04;
  hexGroup.add(baseMesh);

  if (isGreyZone) {
    const ruinGeo = new THREE.BoxGeometry(0.4, 0.15, 0.3);
    const ruinMesh = new THREE.Mesh(ruinGeo, matRuins);
    ruinMesh.position.set(0, 0.15, 0);
    hexGroup.add(ruinMesh);
  } else {
    if (pop >= 1000000) {
      const mainTowerGeo = new THREE.BoxGeometry(0.35, 1.1, 0.35);
      const mainTower = new THREE.Mesh(mainTowerGeo, matUrbanTower);
      mainTower.position.set(0, 0.6, 0);
      hexGroup.add(mainTower);

      const offsets = [[-0.3, -0.25], [0.32, -0.2], [-0.25, 0.3], [0.28, 0.28]];
      offsets.forEach(([ox, oz], idx) => {
        const height = 0.4 + (idx % 3) * 0.15;
        const bldgGeo = new THREE.BoxGeometry(0.22, height, 0.22);
        const bldg = new THREE.Mesh(bldgGeo, matUrbanMid);
        bldg.position.set(ox, height / 2 + 0.08, oz);
        hexGroup.add(bldg);
      });
    } else if (pop >= 100000) {
      const offsets = [[-0.18, -0.18], [0.2, -0.15], [0, 0.22]];
      offsets.forEach(([ox, oz], idx) => {
        const height = 0.45 + idx * 0.1;
        const bldgGeo = new THREE.BoxGeometry(0.28, height, 0.28);
        const bldg = new THREE.Mesh(bldgGeo, matUrbanTower);
        bldg.position.set(ox, height / 2 + 0.08, oz);
        hexGroup.add(bldg);
      });
    }

    if (industrialTierSum > 0) {
      const factoryWidth = Math.min(0.7, 0.3 + industrialTierSum * 0.04);
      const factoryGeo = new THREE.BoxGeometry(factoryWidth, 0.3, 0.4);
      const factory = new THREE.Mesh(factoryGeo, matFactory);
      
      const factoryZOffset = pop > 500000 ? -0.35 : 0;
      factory.position.set(0, 0.23, factoryZOffset);
      hexGroup.add(factory);

      const stackCount = Math.min(3, Math.ceil(industrialTierSum / 4));
      for (let i = 0; i < stackCount; i++) {
        const stackGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.55 + i * 0.1, 8);
        const stack = new THREE.Mesh(stackGeo, matStack);
        stack.position.set(-0.2 + i * 0.15, 0.35 + i * 0.05, factoryZOffset + 0.15);
        hexGroup.add(stack);
      }
    }
  }

  const center = getHexCenterPosition(hex.q, hex.r);
  hexGroup.position.set(center.x, center.y, center.z);

  const wx = HEX_WIDTH * (hex.q + hex.r / 2);
  const wy = (HEX_HEIGHT * 3 / 4) * hex.r;
  alignToSurfaceNormal(hexGroup, wx, wy);

  return hexGroup;
}