import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, camera, renderer, onFrame } from './stage.js';
import { glassMaterial } from './materials.js';
import { varia } from './writeText.js';   // oben ergänzen

//Adding Mesh to scene
const loader = new GLTFLoader();
export let blob;   // oben, vor dem loader

export async function loadBlob(){
  const gltf = await loader.loadAsync(`${import.meta.env.BASE_URL}assets/GlassBlob.glb`);  blob = gltf.scene;
  blob.scale.setScalar(0.3);
  blob.position.set(0,0,0);
  //traverse goes through every object inseide the loaded model
  blob.traverse((child) => {
    if (child.isMesh) {
      child.material = glassMaterial
    }

  scene.add(blob);
  return blob;
  });

  scene.add( gltf.scene );
  return blob

}

// Render-Schleife
const bgLight = new THREE.Color(0xfefef5);   // Helle Hintergrundfarbe

//Unsichtbare Canvas zum rendern
const fbo = new THREE.WebGLRenderTarget(512, 512);

//Lädt AnimationLoop in update List --> Buffer
onFrame((time) => {
  if (!blob) return; //Wenn kein Blob in der Szene gfunden wird
  
  // Materialanimation
  glassMaterial.time = time * 0.001;
  
   //Hintergrund je nach Phase setzen
  scene.background = bgLight;

  // --- Buffer-Pass: nur fotografieren, was GEBROCHEN werden soll ---
  blob.visible = false;
  
  renderer.setRenderTarget(fbo);
  renderer.render(scene, camera);
  glassMaterial.buffer = fbo.texture;

  // --- für den Haupt-Pass alles wiederherstellen ---
  blob.visible = true;
  scene.background = null;
  renderer.setRenderTarget(null);
});