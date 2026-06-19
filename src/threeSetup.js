import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshTransmissionMaterial } from '@pmndrs/vanilla';
import { Text } from 'troika-three-text';

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

//Loading text into the scene
const text = new Text();
text.text = 'VARIA BELLA';
text.font = '/fonts/outfit-v15-latin-900.woff2';  // your font in /public/fonts
text.fontSize = 8;
text.position.set(0, 0, -12);   // behind the blob's back (blob reaches ~ -11)
text.color = 0x000000;
text.anchorX = 'center';
text.anchorY = 'middle';
text.position.set(0, 0, -1);   // behind the blob (blob is at z = 0)
text.sync();                   // builds the text — must call after setting props
scene.add(text);

//Mesh Material
const glassMaterial = new MeshTransmissionMaterial();
glassMaterial.thickness = 1;            // how much it bends light through
glassMaterial.roughness = 0;            // 0 = clear, higher = frosted
glassMaterial.ior = 1.5;                // glass ≈ 1.5
glassMaterial.chromaticAberration = 0.1; // the rainbow edges
glassMaterial.anisotropicBlur = 0.1;
glassMaterial.distortion = 0.5;          // the wobble
glassMaterial.distortionScale = 0.5;
glassMaterial.temporalDistortion = 0.2;  // makes the wobble move over time

//Adding HDRI Environment for reflections
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;


//Adding Mesh to scene
const loader = new GLTFLoader();

let blob;   // oben, vor dem loader

loader.load( '/assets/GlassBlob.glb', function ( gltf ) {

  blob = gltf.scene;
  blob.scale.setScalar(1);
  //traverse goes through every object inseide the loaded model
  blob.traverse((child) => {
    if (child.isMesh) {
      child.material = glassMaterial
    }
  });

  scene.add( gltf.scene );
  console.log('blob size:', new THREE.Box3().setFromObject(blob).getSize(new THREE.Vector3()));

}, undefined, function ( error ) {

  console.error( error );

} );

// Render-Schleife
const bgColor = new THREE.Color(0xe8e8e8);   // match your CSS page background
const fbo = new THREE.WebGLRenderTarget(512, 512);

function animate(time) {
  if (blob) {
    glassMaterial.time = time * 0.001;

    // photograph the scene behind the glass — on a light bg so black text shows
    blob.visible = false;
    scene.background = bgColor;
    renderer.setRenderTarget(fbo);
    renderer.render(scene, camera);

    // give that photo to the glass, go transparent again for the real render
    glassMaterial.buffer = fbo.texture;
    blob.visible = true;
    scene.background = null;
    renderer.setRenderTarget(null);
  }
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

