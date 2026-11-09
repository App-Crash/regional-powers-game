import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import sampleMapUrl from '../../assets/regional-power-map.png';
import { getCurvatureHeight, TERRAIN_ROTATION_X } from './CurvedTerrain';

export interface SceneSceneBundle {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
}

export function initScene(container: HTMLDivElement): SceneSceneBundle {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#020617');

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 16, 20);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.2;
  controls.minDistance = 10;
  controls.maxDistance = 30;
  
  // Reversal: Right-click rotates map, Left-click is disabled for orbit (used for hex selection)
  controls.mouseButtons = {
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  };

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
  dirLight.position.set(15, 25, 15);
  scene.add(dirLight);

  // Curved Terrain Mesh
  const planeWidth = 50;
  const planeHeight = 35;
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 64, 64);
  const pos = geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, getCurvatureHeight(x, y));
  }
  geometry.computeVertexNormals();

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(sampleMapUrl, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.rotation.x = TERRAIN_ROTATION_X;
    scene.add(terrainMesh);
  });

  return { scene, camera, renderer, controls };
}