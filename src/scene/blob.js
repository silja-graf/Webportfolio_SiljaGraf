import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, camera, renderer, onFrame } from './stage.js';
import { glassMaterial } from './materials.js';
import { varia } from './writeText.js';   // oben ergänzen

//Adding Mesh to scene
const loader = new GLTFLoader();
export let blob;   // oben, vor dem loader

export async function loadBlob(){
    const gltf = await loader.loadAsync('/assets/GlassBlob.glb');   // wartet bis Asset wirklich geladen ist
  blob = gltf.scene;
  blob.scale.setScalar(0.3);
  //traverse goes through every object inseide the loaded model
  blob.traverse((child) => {
    if (child.isMesh) {
      child.material = glassMaterial
    }
  });

  scene.add( gltf.scene );
  return blob

}

// Render-Schleife
const bgColor = new THREE.Color(0xfefef5);   // match your CSS page background
//Unsichtbare Canvas zum rendern
const fbo = new THREE.WebGLRenderTarget(512, 512);

//Lädt AnimationLoop in update List --> Buffer
onFrame((time) => {
  if (!blob) return;
  glassMaterial.time = time * 0.001;
  
  const t = time * 0.001;               // ms → Sekunden (gleiche Umrechnung wie bei glassMaterial.time)
  blob.position.y = Math.sin(t * 1) * 0.08;   // sanft auf/ab

  // --- Buffer-Pass: nur fotografieren, was GEBROCHEN werden soll ---
  blob.visible = false;
  //if (varia) varia.visible = false;   // VARIA NICHT mitfotografieren → keine Brechung
  scene.background = bgColor;
  renderer.setRenderTarget(fbo);
  renderer.render(scene, camera);
  glassMaterial.buffer = fbo.texture;

  // --- für den Haupt-Pass alles wiederherstellen ---
  blob.visible = true;
  if (varia) varia.visible = true;    // VARIA wieder sichtbar (wird oben drauf gezeichnet)
  scene.background = null;
  renderer.setRenderTarget(null);
});