import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, camera, renderer, onFrame } from './stage.js';
import { glassMaterial } from './materials.js';

//Adding Mesh to scene
const loader = new GLTFLoader();

let blob;   // oben, vor dem loader

loader.load( '/assets/GlassBlob.glb', function ( gltf ) {

  blob = gltf.scene;
  blob.scale.setScalar(0.5);
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
//Unsichtbare Canvas zum rendern
const fbo = new THREE.WebGLRenderTarget(512, 512);

//Lädt AnimationLoop in update List --> Buffer
onFrame((time) => {
  if (!blob) return;

  // Glas-Material leicht animieren → Illusion einer flüssigen Masse
  glassMaterial.time = time * 0.001;

  // Szene hinter dem Glas "abfotografieren" – 
  blob.visible = false;
  // heller Hintergrund, damit der schwarze Text sichtbar wird
  scene.background = bgColor;
  
  //Canvas hinter dem Blob, wo Foto der Brechung entsteht
  renderer.setRenderTarget(fbo);
  renderer.render(scene, camera);

  // dieses Foto dem Glas geben, dann wieder transparent für den echten Render
  glassMaterial.buffer = fbo.texture;
  blob.visible = true;
  scene.background = null;
  renderer.setRenderTarget(null);
});