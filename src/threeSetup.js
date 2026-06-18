import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Basic Scene/Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //https://threejs.org/manual/#en/creating-a-scene
camera.position.z = 30; // Kamera positionieren

//Reference Canvas and Renderer Setup
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true }); // canvas für objekt erstellen / alpha auf true setzen, sodass opacity gesteuert wird
renderer.setClearColor(0x000000, 0); // 0 = volle Transparenz
renderer.setSize( window.innerWidth, window.innerHeight );

// Licht
scene.add(new THREE.AmbientLight(0xffffff, 0.2));      // weiches Grundlicht
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 2, 5);
scene.add(dirLight);

//Adding HDRI Environment for reflections
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

//Adding Mesh to scene
const loader = new GLTFLoader();

let blob;   // oben, vor dem loader

loader.load( '/assets/TrialBlob.glb', function ( gltf ) {

  blob = gltf.scene;
  gltf.scene.scale.setScalar(1);
  scene.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );

// Render-Schleife
function animate() {
  if (blob) {                  // erst drehen, wenn es geladen ist
    blob.rotation.y += 0.01;   // langsame Drehung um die Hochachse
  }
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
