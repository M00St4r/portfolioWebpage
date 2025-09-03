
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
//import { previewSnippets } from './projects.ts';
//import { projectSnippets } from './projects.ts';


//#region HTML Stuff
//html "windows"
const startScreen: HTMLDivElement = document.querySelector("#start-screen")!;
const contactWindow: HTMLDivElement = document.querySelector("#contact")!;
//html buttons
const contactButton: HTMLButtonElement = document.querySelector("#contact-button")!;
const closeContactButton: HTMLButtonElement = document.querySelector("#close-contact")!;
const emailButton: HTMLParagraphElement = document.querySelector("#email")!;

//make start screen disapear when clicked
startScreen.addEventListener("click", (_ev) => {
  startScreen.style.display = "none";
});
//contact window
let isContact: boolean = false;
contactWindow.style.display = "none";

contactButton.addEventListener("click", (_ev) => {
  //console.log("clicked on contact button")
  if (isContact) {
    contactWindow.style.display = "none";
  } else {
    contactWindow.style.display = "flex";
  }
  isContact = !isContact;
});

closeContactButton.addEventListener("click", (_ev) => {
  if (isContact) {
    contactWindow.style.display = "none";
    isContact = false;
  }
});

//reveal email
emailButton.addEventListener("click", async (_ev) => {
  //copy email to clipboard
  const textToCopy: string = "bjoern.martens@posteo.de";

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      //alert("Copied the text: " + textToCopy);
      console.log("copied email");
    })
    .catch(err => {
      console.error("Failed to copy text: ", err);
    });

  emailButton.innerText = "copied!";
  await setInterval(() => emailButton.innerText = "bjoern.martens@posteo.de", 2000);
});


//Bio
const brand: HTMLSpanElement = document.querySelector("#brand")!;
const name: HTMLSpanElement = document.querySelector("#name")!;
const bio: HTMLDivElement = document.querySelector("#bio")!;
const closeBioButton: HTMLButtonElement = document.querySelector("#close-bio")!;

let isBio: boolean = false;
bio.style.display = "none";

brand.addEventListener("mouseenter", (_ev) => {
  name.innerText = "Get to know me!";
});

brand.addEventListener("mouseleave", (_ev) => {
  name.innerText = "Björn Martens";
});

brand.addEventListener("click", (_ev) => {
  bio.style.display = "flex";
  isBio = true;
});

closeBioButton.addEventListener("click", (_ev) => {
  if (isBio) {
    bio.style.display = "none";
  } else {
    bio.style.display = "flex";
  }
  isBio = !isBio;
});

//projects
const projects: HTMLDivElement = document.querySelector("#projects")!;
const projectsDisplay: HTMLDivElement = document.querySelector("#projects-content")!;
const projectPreview: HTMLDivElement = document.querySelector("#project-preview")!;
projects.style.display = "none";
let projectSelector: number = 0;

// the current project and the last
let display: HTMLDivElement = document.createElement("div");
let last: HTMLDivElement = document.createElement("div");
// current preview and last preview
let displayPrev: HTMLDivElement = document.createElement("div");
let lastPrev: HTMLDivElement = document.createElement("div");

// Project Preview Window
projectPreview.addEventListener("click", (_ev) => {
  projects.style.display = "flex";
  isProject = true;
  //console.log("clicked on project preview")
});

// Project Display Window
let isProjectHover: boolean = false;
let isProject: boolean = false;

projectsDisplay.addEventListener("mouseenter", (_ev) => {
  isProjectHover = true;
  //console.log("project enter");
});

projectsDisplay.addEventListener("mouseleave", (_ev) => {
  isProjectHover = false;
  //console.log("project leave");
})

projects.addEventListener("click", (_ev) => {
  if (isProject && !isProjectHover) {
    //hide project
    isProject = false;
    projects.style.display = "none";
  }
});

function frac(x: number) { return x - Math.floor(x); }

function updateProjectPreview(theta: number) {
  const t = frac(theta * 4 / Math.PI);
  const projectWindowSize = 2 * Math.abs(t - 0.5); // triangle wave from 0 to 1
  projectPreview.style.transform = `scale(${projectWindowSize})`;
  projectPreview.style.transformOrigin = "center 110%";
  projectPreview.style.opacity = projectWindowSize.toString();

  displayPrev = projectPreview.children[projectSelector] as HTMLDivElement;
  lastPrev.style.display = "none";
  displayPrev.style.display = "block";
  lastPrev = displayPrev;

  display = projectsDisplay.children[projectSelector] as HTMLDivElement;
  last.style.display = "none";
  display.style.display = "block";
  last = display;
  //projectPreview.innerHTML = previewSnippets[projectSelector];
  //projectsDisplay.innerHTML = projectSnippets[projectSelector];

  if (projectWindowSize == 1) {
    projectPreview.style.pointerEvents = "all";
  } else {
    projectPreview.style.pointerEvents = "none";
  }
}

//#endregion
//#region 3D Stuff
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotateX(-15 * Math.PI / 180);

//set the renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("app") as HTMLCanvasElement
});
renderer.setSize(window.innerWidth, window.innerHeight);

//load models
const gltfLoader = new GLTFLoader();

let isleOffset: THREE.Vector3 = new THREE.Vector3(0, -1, 0);

//let island: THREE.Group<THREE.Object3DEventMap>;
gltfLoader.load('/models/Island.glb', function (gltf) {
  // gltf.scene.traverse(function (child) {
  //   if ((child as THREE.Mesh).isMesh) {
  //     const m = child as THREE.Mesh
  //     m.receiveShadow = true
  //     m.castShadow = true
  //     m.material = monkeyMat;
  //     scene.add(m);
  //   }
  // });
  //island = gltf.scene;
  scene.add(gltf.scene);
  gltf.scene.translateY(isleOffset.y);
}, undefined, function (error) {
  console.error(error);
});

gltfLoader.load('/models/ButtonRing.glb', function (gltf) {
  // gltf.scene.traverse(function (child) {
  //   if ((child as THREE.Mesh).isMesh) {
  //     const m = child as THREE.Mesh
  //     m.receiveShadow = true
  //     m.castShadow = true
  //     m.material = monkeyMat;
  //     scene.add(m);
  //   }
  // });
  //island = gltf.scene;
  scene.add(gltf.scene);
  gltf.scene.translateY(isleOffset.y);
}, undefined, function (error) {
  console.error(error);
});

//scene.add(island);

//add light
//hemisphere light
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const hlIntensity = 1;
const hlLight = new THREE.HemisphereLight(skyColor, groundColor, hlIntensity);
scene.add(hlLight);
//directional Light
const dlColor = 0xFFFFFF;
const dlintensity = 5;
const dlLight = new THREE.DirectionalLight(dlColor, dlintensity);
dlLight.position.set(0, 10, 0);
dlLight.target.position.set(-5, 0, 0);
scene.add(dlLight);
scene.add(dlLight.target);

camera.translateZ(-5);

//#region Mouse Controls
let mousePosX: number = 0;
//let mousePosY: number = 0;
let isMouseDown: boolean = false;
let snapping = false;
let targetTheta = 0;

let canvas: HTMLCanvasElement = document.getElementById("app") as HTMLCanvasElement;

canvas.addEventListener("mousedown", (_ev) => {
  isMouseDown = true;
  mousePosX = _ev.clientX / canvas.clientWidth;
  //mousePosY = _ev.clientY / canvas.clientHeight;
  //console.log("mouse Down on canvas");
});

// Camera orbit parameters
let radius = 5;   // distance from center
let theta = 0;    // left/right angle
let phi = Math.PI / 2; // up/down angle

function updateCamera() {
  if (snapping && !isMouseDown) {
    const snapSpeed = 0.1; // adjust (0.05 = slower, 0.2 = faster)
    theta = THREE.MathUtils.lerp(theta, targetTheta, snapSpeed);

    // if close enough, stop snapping
    if (Math.abs(theta - targetTheta) < 0.001) {
      theta = targetTheta;
      snapping = false;
    }

    // snap points every 45°
    const step = Math.PI / 4;
    targetTheta = Math.round(theta / step) * step;

    // update the project selector to show the correct project
    projectSelector = angleToSelector(targetTheta, step);
  }

  updateProjectPreview(theta);

  // Convert spherical to Cartesian
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  camera.position.set(x, y, z);
  camera.lookAt(0, -0.5, 0);
}

// Mouse handling
canvas.addEventListener("mousemove", (_ev) => {
  if (isMouseDown) {
    let xDiff = (_ev.clientX / canvas.clientWidth) - mousePosX;
    //let yDiff = (_ev.clientY / canvas.clientHeight) - mousePosY;

    theta += xDiff * Math.PI; // horizontal rotation
    //phi -= yDiff * Math.PI;       // vertical rotation

    //phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

    mousePosX = _ev.clientX / canvas.clientWidth;
    //mousePosY = _ev.clientY / canvas.clientHeight;

    // update the project selector to show the correct project
    projectSelector = angleToSelector(theta, Math.PI / 4);
    updateProjectPreview(theta);
  }
});

canvas.addEventListener("mouseup", (_ev) => {
  isMouseDown = false;

  snapping = true;
});

function angleToSelector(targetTheta: number, step: number): number {

  let angle = ((targetTheta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  let selector = Math.round(angle / step) % (2 * Math.PI / step);

  //console.log("selector: ", selector)
  return selector;
}

// ---- Touch Controls ----
let touchStartX = 0;

canvas.addEventListener("touchstart", (ev) => {
  if (ev.touches.length === 1) {
    touchStartX = ev.touches[0].clientX / canvas.clientWidth;
  }
});

canvas.addEventListener("touchmove", (ev) => {
  if (ev.touches.length === 1) {
    let currentX = ev.touches[0].clientX / canvas.clientWidth;
    let xDiff = currentX - touchStartX;
    theta += xDiff * Math.PI; // same as mouse
    touchStartX = currentX;

    // update the project selector to show the correct project
    projectSelector = angleToSelector(theta, Math.PI / 4);
    updateProjectPreview(theta);
  }
});

canvas.addEventListener("touchend", () => {
  // snap points every 45°
  const step = Math.PI / 4;
  targetTheta = Math.round(theta / step) * step;

  // update the project selector to show the correct project
  projectSelector = angleToSelector(targetTheta, step);

  snapping = true;
});
//#endregion

//#region Environment Texture
let exrBackground: THREE.Texture;

new EXRLoader().load('/textures/kloofendal_48d_partly_cloudy_puresky_2k.exr', function (texture) {

  texture.mapping = THREE.EquirectangularReflectionMapping;

  //exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
  exrBackground = texture;

});

//

function animate() {
  //scene.getObjectById
  updateCamera();
  scene.background = exrBackground;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);