import * as THREE from 'three';
import { getHexCenterPosition } from '../features/home/HexGridLayer';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from '../features/home/CurvedTerrain';

export function createBorderTextureOverlay(
  textureUrl: string,
  apexQ: number = -4,
  apexR: number = 9
): THREE.Group {
  const borderGroup = new THREE.Group();
  borderGroup.name = 'InternationalBordersGroup';

  // 1. Get exact world position of northern apex [-4, 9] (Punta Gallinas)
  const apexPos = getHexCenterPosition(apexQ, apexR);

  // 📐 Current refined dimensions
  const width = 49.23;  
  const height = 61.51; 
  
  // 🧭 Current refined offsets
  const offsetX = -5.20; 
  const offsetY = -18.10; 

  const geometry = new THREE.PlaneGeometry(width, height, 32, 32);
  const posAttr = geometry.attributes.position;
  const uvAttr = geometry.attributes.uv;
  const rotX = TERRAIN_ROTATION_X;

  // 2. Apply 180-degree rotation (`x' = -x`, `y' = -y`) and invert UVs
  for (let i = 0; i < posAttr.count; i++) {
    const rawX = posAttr.getX(i);
    const rawY = posAttr.getY(i);

    // 180-degree rotation around local center
    const localX = -rawX;
    const localY = -rawY;

    const worldX = apexPos.x + localX + offsetX;
    const worldY = apexPos.y + localY + offsetY;

    // ⚖️ Raised slightly to +0.25 to prevent z-fighting with hex control meshes
    const vz = getCurvatureHeight(worldX, worldY) + 0.25;

    const rotatedY = worldY * Math.cos(rotX) - vz * Math.sin(rotX);
    const rotatedZ = worldY * Math.sin(rotX) + vz * Math.cos(rotX);

    posAttr.setXYZ(i, worldX, rotatedY, rotatedZ);

    // Invert texture coordinates to match 180° rotation
    if (uvAttr) {
      const u = uvAttr.getX(i);
      const v = uvAttr.getY(i);
      uvAttr.setXY(i, 1.0 - u, 1.0 - v);
    }
  }
  
  geometry.computeVertexNormals();

  // 🛡️ Force bounding sphere and box centered at the world apex 
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(apexPos.x, apexPos.y, 0), 200);
  geometry.boundingBox = new THREE.Box3(
    new THREE.Vector3(apexPos.x - 150, apexPos.y - 150, -50),
    new THREE.Vector3(apexPos.x + 150, apexPos.y + 150, 50)
  );

  const initialMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -8,
  });

  const borderMesh = new THREE.Mesh(geometry, initialMaterial);
  borderMesh.renderOrder = 20; // Ensure overlay renders after base terrain and hex tiles
  borderMesh.frustumCulled = false;
  borderGroup.add(borderMesh);

  // 3. Process texture: High transparency alpha cap for ghost terminal aesthetic
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = textureUrl;
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let j = 0; j < data.length; j += 4) {
      const r = data[j];
      const g = data[j + 1];
      const b = data[j + 2];
      const originalAlpha = data[j + 3];

      // Key out white background pixels completely
      if (r > 220 && g > 220 && b > 220) {
        data[j + 3] = 0; 
      } else {
        // Tint border lines to WOPR Amber (#f59e0b)
        data[j] = 245;    // R
        data[j + 1] = 158; // G
        data[j + 2] = 11;  // B
        
        // Capped at max alpha 65 for enhanced visibility without visual clutter
        data[j + 3] = Math.min(originalAlpha, 65);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;

    borderMesh.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.90,
      depthTest: true,
      depthWrite: false,          // Prevents z-fighting against terrain
      polygonOffset: true,
      polygonOffsetFactor: -4,    // Pulls overlay visually closer to camera
      polygonOffsetUnits: -8,
      side: THREE.DoubleSide,
    });
    borderMesh.renderOrder = 20;
    borderMesh.material.needsUpdate = true;
  };

  return borderGroup;
}