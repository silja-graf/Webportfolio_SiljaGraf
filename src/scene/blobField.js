import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {scene} from './stage.js';
import {glassMaterial} from './materials.js';
import { makeBlobShadow } from './blobShadow.js';

// --- BLOBS PLATZIEREN --- //
const BLOBS = [
// --- BLOB LINKS --- //
  { x: -7.5,   y:  2.8, scale: 0.15, rotY:  20, rotZ: 80,  squashX: 1.1,  squashY: 0.9 },     //mittler blob oben 
  { x:  -11.5, y:  1,   scale: 0.05, rotY: 180, rotZ: 0,  squashX: 0.8,  squashY: 0.8 },      //mini blob bildrand
  { x: -8.5,   y: -5,   scale: 0.25, rotY:  40, rotZ: -15, squashX: 1.7,  squashY: 1.3 },     //fetter Blob unten
  { x:  -2.8, y:  -3,   scale: 0.1, rotY: -80, rotZ: 40,  squashX: 1.0,  squashY: 1.0 },      //kleiner blob unten

// --- BLOB RECHTS ---//
  { x: 8,   y:  0.5, scale: 0.03, rotY:  20, rotZ: -30,  squashX: 1.1,  squashY: 0.9 },     //mittler blob oben links
  { x:  6, y: -2, scale: 0.18, rotY: 120, rotZ: 5,   squashX: 1, squashY: 1 },          //grosser Blob unten rechts
];

const loader = new GLTFLoader();
export const blobGroup = new THREE.Group();

export async function loadBlobField(){
    blobGroup.visible = false;
    scene.add(blobGroup);

    //Model laden
    const modell = await loader.loadAsync('/assets/GlassBlob.glb');
    const original = modell.scene;

    BLOBS.forEach((dimensions) =>    { 
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
        copy.rotation.y = dimensions.rotY * Math.PI / 180; //wandelt Grad in RAD um
        copy.rotation.z = dimensions.rotZ * Math.PI / 180;

        // Grösse des Blobs messen und Radius berecnen
        const box = new THREE.Box3().setFromObject(copy);
        const size = new THREE.Vector3();
        box.getSize(size);
        const blobRadius = Math.max(size.x, size.y) / 2;   // halbe Breite/Höhe = Radius
        
        // chromatischen Schatten dazu (Radius 1, weil die Group/Plane mit copy.scale mitskaliert)
        const shadow = makeBlobShadow(blobRadius * 1.15);   // 1.15 = Saum ragt etwas über den Rand
        shadow.position.set(dimensions.x, dimensions.y, 1.1);
        shadow.scale.set(dimensions.squashX, dimensions.squashY, 1); //gleicher scale wie blob anwenden

        // Schatten separat, passend zur echten Größe, leicht größer als der Blob
        copy.userData.shadow = shadow;
        
        blobGroup.add(copy);
        blobGroup.add(shadow);
    }); 
    return blobGroup   //gibt Array zurück
}