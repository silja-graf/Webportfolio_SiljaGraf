import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Basic Scene/Camera Setup
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //https://threejs.org/manual/#en/creating-a-scene
camera.position.z = 9; // Kamera positionieren

//Reference Canvas and Renderer Setup
const canvas = document.querySelector('#three-canvas');
export const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true }); // canvas für objekt erstellen / alpha auf true setzen, sodass opacity gesteuert wird
renderer.setClearColor(0x000000, 0); // 0 = volle Transparenz
renderer.setSize( window.innerWidth, window.innerHeight );

// Höhere Auflösung dynamisch auf die Bildschirmgrösse anpassen
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
addEventListener('resize', () => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

// Licht
scene.add(new THREE.AmbientLight(0xffffff, 0.2));      // weiches Grundlicht
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 2, 5);
scene.add(dirLight);

//Adding HDRI Environment for reflections
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// Renderer Loop
const updaters = [];
export function onFrame(fn) { updaters.push(fn); }

renderer.setAnimationLoop((time) => {
  for (const fn of updaters) fn(time);
  renderer.render(scene, camera);
});
