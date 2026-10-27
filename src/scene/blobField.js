import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {scene} from './stage.js';
import {glassMaterial} from './materials.js';
import { makeBlobShadow } from './blobShadow.js';
import { scroll, onScrollEnabled } from './scrollState.js';
import { onFrame } from './stage.js';

// ALTE POSITIONEN (auskommentiert)
/*
const BLOBS = [
// --- BLOB LINKS --- //
  { x: -7.5,   y:  2.8, scale: 0.15, rotY:  20, rotZ: 80,  squashX: 1.1,  squashY: 0.9 },    //mittler blob oben 
  { x:  -11.5, y:  1,   scale: 0.05, rotY: 180, rotZ: 0,  squashX: 0.8,  squashY: 0.8 },     //mini blob bildrand
  { x: -8.5,   y: -5,   scale: 0.25, rotY:  40, rotZ: -15, squashX: 1.7,  squashY: 1.3 },    //fetter Blob unten
  { x:  -2.8, y:  -3,   scale: 0.1, rotY: -80, rotZ: 0,  squashX: 1.0,  squashY: 1.0 },      //kleiner blob unten

// --- BLOB RECHTS ---//
  { x: 8,   y:  0.5, scale: 0.03, rotY:  20, rotZ: -30,  squashX: 1.1,  squashY: 0.9 },     //mittler blob oben links
  { x:  6, y: -2, scale: 0.18, rotY: 120, rotZ: 5,   squashX: 1, squashY: 1 },              //grosser Blob unten rechts
  { x:  11, y:  5.7,   scale: 0.15, rotY: 0, rotZ: 0,  squashX: 1.0,  squashY: 1.0 },       //kleiner blob unten
];
*/

// NEU: dezent und nur am Rand – kein kleiner Blob liegt auf SILJA, GRAF oder dem Slogan
const BLOBS = [
// --- BLOB LINKS --- //
  { x: -9.6,  y:  4.9, scale: 0.04, rotY: 180, rotZ: 0,   squashX: 0.8,  squashY: 0.8 },    //mini Blob oben links in der Ecke
  { x: -9.3,  y: -5.8, scale: 0.12, rotY:  40, rotZ: -15, squashX: 1.4,  squashY: 1.1 },    //Blob unten links, halb am Rand (unter dem Slogan)
  { x: -4.5,  y: -5.4, scale: 0.05, rotY: -80, rotZ: 0,   squashX: 1.0,  squashY: 1.0 },    //kleiner Blob ganz unten
  { x:  3.6,  y: -5.3, scale: 0.06, rotY:  20, rotZ: -30, squashX: 1.1,  squashY: 0.9 },    //kleiner Blob unten Mitte

// --- BLOB RECHTS ---//
  { x:  6.9,  y:  3.7, scale: 0.03, rotY:  20, rotZ: -30, squashX: 1.1,  squashY: 0.9 },    //mini Blob oben rechts
  { x:  8.7,  y: -4.9, scale: 0.14, rotY: 120, rotZ: 5,   squashX: 1,    squashY: 1 },      //Blob unten rechts, halb am Rand
  { x:  8.8,  y:  5.1, scale: 0.10, rotY: 0,   rotZ: 0,   squashX: 1.0,  squashY: 1.0 },    //Blob oben rechts, halb am Rand
];

const loader = new GLTFLoader();
export const blobGroup = new THREE.Group();
export const copies = [];   // nur Blob-Kopien, kein Schatten

export async function loadBlobField(){
    blobGroup.visible = false;
    scene.add(blobGroup);

    //Model laden
const modell = await loader.loadAsync(`${import.meta.env.BASE_URL}assets/GlassBlob.glb`);
    const original = modell.scene;

    BLOBS.forEach((dimensions) => { 
        //Kopie erstellen
        const copy = original.clone(true)

        //Glass-Material überall hinzufügen
        copy.traverse((child) => {
            if (child.isMesh) child.material = glassMaterial
        })

        //Masse/Position/Rotation setzen
        copy.position.set(dimensions.x, dimensions.y, 1.5);
        copy.scale.set(
            dimensions.scale * dimensions.squashX,
            dimensions.scale * dimensions.squashY,
            dimensions.scale
        );
        copy.rotation.y = dimensions.rotY * Math.PI / 180;              //wandelt Grad in RAD um
        copy.rotation.z = dimensions.rotZ * Math.PI / 180;

        // Grösse des Blobs messen und Radius berecnen
        const box = new THREE.Box3().setFromObject(copy);
        const size = new THREE.Vector3();
        box.getSize(size);
        const blobRadius = Math.max(size.x, size.y) / 2;                // halbe Breite/Höhe = Radius
        
        // chromatischen Schatten dazu
        const shadow = makeBlobShadow(blobRadius * 1.15);               // 1.15 = Saum ragt etwas über den Rand
        shadow.position.set(dimensions.x, dimensions.y, 1.1);
        shadow.scale.set(dimensions.squashX, dimensions.squashY, 1);    //gleicher scale wie blob anwenden

        copy.userData.shadow = shadow;
        
        blobGroup.add(copy);
        blobGroup.add(shadow);
        copies.push(copy);   // nur Blob-Kopie merken, nicht Schatten
    }); 

    // Basis-Positionen merken (für den Offset beim Scrollen)
    copies.forEach((blob, i) => {
        blob.userData.baseX = BLOBS[i].x;
        blob.userData.baseY = BLOBS[i].y;

        // Richtung vom Zentrum (0,0) zum Blob → normalisiert
        const len = Math.sqrt(BLOBS[i].x ** 2 + BLOBS[i].y ** 2) || 1;
        blob.userData.driftX = (BLOBS[i].x / len) * (1.5 + i * 0.2);   // stärker je weiter aussen
        blob.userData.driftY = (BLOBS[i].y / len) * (1.5 + i * 0.2);
        blob.userData.dirX   = BLOBS[i].x / len;   // NEU: reine Richtung nach aussen (für den Kontakt)
        blob.userData.dirY   = BLOBS[i].y / len;
    });

    onScrollEnabled(() => {
    onFrame(() => {
        const s = Math.min(1, Math.max(0, scroll.y));

        // NEU: beim Kontakt fliegen die Blobs ganz aus dem Bild
        // (gleicher Startpunkt wie contactStart in carousel.js: 1 + (Projekte - 1) * 0.6 + 0.45)
        const contactStart    = 1 + (4 - 1) * 0.6 + 0.45;
        const contactProgress = Math.min(1, Math.max(0, (scroll.y - contactStart) / 0.4));
        const out = contactProgress * contactProgress * 14;      // Strecke nach aussen (beschleunigt)
        // NEU: RESPONSIVE – x-Positionen mit dem Bildschirmformat mitziehen, damit die Blobs immer am Rand sitzen
        // (Referenz 16:10; bei 4:3 rücken sie nach innen, bei Ultrawide nach aussen)
        const xf = (window.innerWidth / window.innerHeight) / 1.6;

        copies.forEach((blob) => {
//        const newX = blob.userData.baseX + blob.userData.driftX * s * 2;
//        const newY = blob.userData.baseY + blob.userData.driftY * s * 2;
//        const newX = blob.userData.baseX + blob.userData.driftX * s * 2 + blob.userData.dirX * out;
//        const newY = blob.userData.baseY + blob.userData.driftY * s * 2 + blob.userData.dirY * out;
        // NEU: beim Karussell nur leicht nach aussen (bleiben am Rand sichtbar), erst beim Kontakt ganz weg
//        const newX = blob.userData.baseX + blob.userData.driftX * s * 0.35 + blob.userData.dirX * out;
        const newX = blob.userData.baseX * xf + blob.userData.driftX * s * 0.35 + blob.userData.dirX * out;   // NEU: * xf
        const newY = blob.userData.baseY + blob.userData.driftY * s * 0.35 + blob.userData.dirY * out;

        blob.position.x = newX;
        blob.position.y = newY;

        // Schatten mitbewegen (gleiche x/y, z bleibt wie gesetzt)
        if (blob.userData.shadow) {
            blob.userData.shadow.position.x = newX;
            blob.userData.shadow.position.y = newY;
        }
        });
    });
    });

    return blobGroup;   //gibt Group zurück
}