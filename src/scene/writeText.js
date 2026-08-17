import {scene} from './stage.js'
import {generateWordPlane} from './generateText.js';
import { buildTextTimeline } from '../timeline.js';
import {loadBlob} from './blob.js'
import * as THREE from 'three';
import { loadBlobField } from './blobField.js';
import { onFrame } from './stage.js';
import { scroll, onScrollEnabled, enableScroll, setTarget } from './scrollState.js';


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
    console.log('savedY beim Laden:', sessionStorage.getItem('scrollY'));
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
    silja.userData.baseY = 4.6;    // Startposition merken
    
    graf.position.set(8, 10, -1);
    graf.userData.baseY = -5.3; // Startposition zum kippen merken

    
    scene.add(varia, bel, la, silja, graf );

    // Wegkippen der Wörter nicht direkt onFrame registrieren, sondern warten:
    onScrollEnabled(() => {
      onFrame(() => {
        if (!silja || !graf) return;
        const s = Math.min(1, Math.max(0, scroll.y));
        // silja wegkkippen lassen
        silja.rotation.x = s * Math.PI / 2;
        silja.position.y = silja.userData.baseY + s * 2;
        silja.material.opacity = Math.max(0, 1 - s * 2);
        // graf wegkippen lassen
        graf.rotation.x  = -s * Math.PI / 2 * 0.7;
        graf.position.y  = graf.userData.baseY - s * 1.5;
        graf.material.opacity = Math.max(0, 1 - s * 2);

      });
    });
    
    const blob = await loadBlob(); //wartet bis blob geladen ist
    await loadBlobField()
        // Timeline bauen und zurückgeben
    const tl = buildTextTimeline(varia, bel, la, blob, silja, graf);

    // Von Projektseite zurückgekommen → Animation überspringen
    const savedY = sessionStorage.getItem('scrollY');
    if (savedY) {
      tl.progress(1);                        // sofort ans Ende
      tl.pause();
      enableScroll();
      const y = parseFloat(savedY);
      scroll.y = y;
      setTarget(y);
      sessionStorage.removeItem('scrollY');
    }
}

writeText();






