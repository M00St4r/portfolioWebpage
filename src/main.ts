import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//set the renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("app") as HTMLCanvasElement
});
renderer.setSize(window.innerWidth, window.innerHeight);

//load models
const gltfLoader = new GLTFLoader();

gltfLoader.load('/resources/Monkey.glb', function (gltf) {
  // gltf.scene.traverse(function (child) {
  //   if ((child as THREE.Mesh).isMesh) {
  //     const m = child as THREE.Mesh
  //     m.receiveShadow = true
  //     m.castShadow = true
  //     m.material = monkeyMat;
  //     scene.add(m);
  //   }
  // });
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.error(error);
});

//add light
//hemisphere light
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const hlIntensity = 1;
const hlLight = new THREE.HemisphereLight(skyColor, groundColor, hlIntensity);
scene.add(hlLight);
//directional Light
const dlColor = 0xFFFFFF;
const dlintensity = 1;
const dlLight = new THREE.DirectionalLight(dlColor, dlintensity);
dlLight.position.set(0, 10, 0);
dlLight.target.position.set(-5, 0, 0);
scene.add(dlLight);
scene.add(dlLight.target);

//add meshes
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);