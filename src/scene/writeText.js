import {scene} from './stage.js'
import {generateWordPlane} from './generateText.js';
import { buildTextTimeline } from '../timeline.js';
import {loadBlob} from './blob.js'

export let varia = null;          // export notwendig, um sie danach animieren zu können
export let bel = null;
export let la = null;
export let silja = null;
export let graf = null;

async function writeText(){
    // wartet durch await auf den return und führt dann aus
    varia = await generateWordPlane('VARIA', 'Outfit', 5);
    bel = await generateWordPlane('BEL', 'Outfit', 5);
    la    = await generateWordPlane('LA', 'Outfit', 5);
    silja   = await generateWordPlane('SILJA', 'Outfit', 7);
    graf   = await generateWordPlane('GRAF','Outfit', 7);


    // Startpositionen (x, y, z) definieren
    varia.position.set(-3.6, 0, -1);
    varia.renderOrder = 10;            // wird zuletzt gezeichnet → liegt optisch oben
    //varia.material.depthTest = false;  // ignoriert die Tiefe des Blobs → nie verdeckt
    
    // wörter Positionieren
    bel.position.set( 5.8, 0, -1);
    la.position.set(11.8, 0, -1);
    la.material.opacity = 0;    // LA startet unsichtbar – wird in der Animation eingeblendet
    silja.position.set(-8,-10);
    graf.position.set();

    scene.add(varia, bel, la, silja, graf);
    
    const blob = await loadBlob(); //wartet bis blob geladen ist
    buildTextTimeline(varia, bel, la, blob, silja, graf);   // jetzt existieren die Wörter garantiert
} 
 writeText();






