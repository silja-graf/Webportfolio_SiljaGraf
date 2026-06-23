import {scene} from './stage.js'
import {generateWordPlane} from './generateText.js';
import { buildTextTimeline } from '../timeline.js';
import {loadBlob} from './blob.js'

export let varia = null;          // export notwendig, um sie danach animieren zu können
export let bel = null;
export let la = null;

async function writeText(){
    // wartet durch await auf den return und führt dann aus
    varia = await generateWordPlane('VARIA', 'Outfit', 5);
    bel = await generateWordPlane('BEL', 'Outfit', 5);
    la    = await generateWordPlane('LA', 'Outfit', 5);

    // Startpositionen (x, y, z) definieren
    varia.position.set(-3.6, 0, -1);
    bel.position.set( 5.8, 0, -1);
    la.position.set(11.8, 0, -1);
    la.material.opacity = 0;    // LA startet unsichtbar – wird in der Animation eingeblendet

    scene.add(varia, bel, la);
    
    const blob = await loadBlob(); //wartet bis blob geladen ist
    buildTextTimeline(varia, bel, la, blob);   // jetzt existieren die Wörter garantiert
} 
 writeText();






