import * as THREE from 'three';
import { scene, renderer } from './stage.js';

const FONT_URL = '/fonts/outfit-v15-latin-900.woff2';
const WORD_HEIGHT = 1;            // ein Regler für alle Wörter

export let varia = null;          // für Schritt „Animation" exportiert
export let bella = null;
export let la = null;

function generateWordPlane(text) {
    // --- FONT SETTINGS --- //
    const fontPx = 180;
    const padding = 30;
    const scalePx = 3;                  //Faktor um welchen Pixel hochskalliert werden für Scharfe Kanten. Überabtastung --> höhere Auflösung als notwendig
    
    // --- CANVA/PINSEL ERSTELLEN --- //
    const measure = document.createElement('canvas').getContext('2d');      // Erst messen, wie breit der Text wird
    measure.font = `900 ${fontPx}px Outfit`;
    const textWidth = Math.ceil(measure.measureText(text).width);
    
    // Legt Pixelanzahl der Canvas, auf welcher gearbeitet wird fest
    const logicalW = textWidth + padding * 2;                               //Factor two as padding is on both sides of text
    const logicalH = fontPx + padding * 2;

    // Canvas exakt auf den Text dimensionieren und für Schärfe mit Faktor S Pixel aufskallieren
    const canvas = document.createElement('canvas');
    canvas.width = logicalW * scalePx;
    canvas.height = logicalH * scalePx;
    const brush = canvas.getContext('2d');                            //zeichnet nachfolgenden Inhalt auf Canvas
    brush.scale (scalePx, scalePx);                                   //Mit ursprünlichem scale multiplizieren, sodass Schrift in richtiger grösse gezeichnet wird

    // --- TEXT SCHREIBEN --- //
    brush.fillStyle = '#000000';                      //Füllfarbe setzen
    brush.font = `900 ${fontPx}px Outfit`;
    brush.textAlign = 'center';
    brush.textBaseline = 'middle';
    brush.fillText(text, logicalW / 2, logicalH / 2);   //durch Faktor 2 dividieren, da der Text eingemittet werden soll

    // --- MESH/MATERIAL/TEXTUR ZUSAMMENSETZEN ---//
    // Plane mit demselben Seitenverhältnis wie das Canvas
    const texture = new THREE.CanvasTexture(canvas);                                        // generiert textur aus canvas
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });      // nimmt Canvas als Oberflächenmaterial. Setzt es auf transparent, sodass nur Textur (Schrift) sichtbar ist.
    const worldHeight = 3;
    const worldWidth = worldHeight * (canvas.width / canvas.height);                        //Verhältnis von worldHeight zu wordWith ist dasselbe wie jenes der canvas sodass nichts verzogen wird.
    const geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);                      //erstellt ein Rechteck mit den berechneten Massen
    const plane = new THREE.Mesh(geometry, material);                                       //generiert Mesh indem es Form und Material zusmmenbringt.
    
    return plane;
}

async function initText() {
    try{
        // Schrift sicher laden, BEVOR wir zeichnen
        const font = new FontFace('Outfit', `url(${FONT_URL})`, { weight: '900' });
        await font.load();
        document.fonts.add(font);
    } catch (e) {
        console.warn('Outfit konnte nicht geladen werden:', e);
  }

  // Funktion für jedes Wort aufrufen
  varia = generateWordPlane('VARIA');
  bella = generateWordPlane('BELLA');
  la    = generateWordPlane('LA');

  // Startpositionen (x, y, z) definieren
  varia.position.set(-4, 0, -1);
  bella.position.set( 4, 0, -1);
  la.position.set(0, 0, -1);

  // LA startet unsichtbar – wird in der Animation eingeblendet
  la.material.opacity = 0;

  //zur scene hinzufügen
  scene.add(varia, bella, la);
}

  


initText();

