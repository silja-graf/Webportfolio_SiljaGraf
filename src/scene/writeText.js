import {scene} from './stage.js'
import {generateWordPlane} from './generateText.js';
import { buildTextTimeline } from '../timeline.js';
import {loadBlob} from './blob.js'
import * as THREE from 'three';
import { loadBlobField } from './blobField.js';

export let varia = null;          // export notwendig, um sie danach animieren zu können
export let bel = null;
export let la = null;
export let silja = null;
export let graf = null;
export let about = null;

async function makeRayWord(text, sharpHeight) {
  const sharp = await generateWordPlane(text, 'Outfit', sharpHeight, '#000000');
  sharp.material.opacity = 0;                 // scharfe Schrift unsichtbar starten

  const rayHeight = sharpHeight * 2.6;        // Faktor ggf. nachjustieren (Text gleich groß wie scharf)
  const ray = await generateRayPlane(text, 'Outfit', rayHeight);

  const group = new THREE.Group();
  ray.position.z = -0.3;
  sharp.position.z = 0;
  group.add(ray, sharp);
  group.userData.sharp = sharp;               // Referenzen für die Timeline
  group.userData.ray = ray;
  return group;
}

async function writeText(){
    // VARIA BELLA //
    // wartet durch await auf den return und führt dann aus
    varia = await generateWordPlane('VARIA', 'Outfit', 5, '#000000');
    bel   = await generateWordPlane('BEL', 'Outfit', 5, '#000000');
    la    = await generateWordPlane('LA', 'Outfit', 5, '#000000');
    // wörter Positionieren
    bel.position.set( 5.8, 0, -1);
    la.position.set(11.8, 0, -1);
    la.material.opacity = 0;    // LA startet unsichtbar – wird in der Animation eingeblendet
    // Startpositionen (x, y, z) definieren
    varia.position.set(-3.6, 0, -1);
    varia.renderOrder = 10;            // wird zuletzt gezeichnet → liegt optisch oben

    // SILJA GRAF //
    silja = await generateWordPlane('SILJA','Outfit', 7,'#000000');   // text, sharpHeight, angleDeg(°)
    graf  = await generateWordPlane('GRAF','Outfit', 7,'#000000');   // andere Richtung
    silja.position.set(-8,-10, -1);
    graf.position.set(8, 10, -1);

    // // ABOUT //
    // about = await generateWordPlane('ABOUT','Barlow', 1.5,'#505050');  
    // about.position.set(-12.6,-4, -1);
    // about.opacity = 0;
    
    scene.add(varia, bel, la, silja, graf, about);
    
    const blob = await loadBlob(); //wartet bis blob geladen ist
    await loadBlobField()
    buildTextTimeline(varia, bel, la, blob, silja, graf, about);   // jetzt existieren die Wörter garantiert
} 
 writeText();






