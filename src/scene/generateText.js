import * as THREE from 'three';
import { renderer } from './stage.js';

// --- REGISTER FONTS--- //
const FONTS = {
    Outfit: {url: '/fonts/outfit-v15-latin-900.woff2', weight: '900'},
    Barlow: {url: '/fonts/barlow-condensed-v13-latin-regular.woff2', weight:'300'}   
};

// --- LOAD FONTS --- //
const loaded = new Set(); //speichert alle geladenen fonts in einem Set
async function ensureFont(family) {
    if (loaded.has(family)) return;
    const f = FONTS[family];
    try{
        const font = new FontFace(family, `url(${f.url})`, { weight: f.weight });
        await font.load();
        document.fonts.add(font);
        loaded.add(family);
    } catch (e){
        console.warn(`Schrift "${family}" konnte nicht geladen werden:`, e);
    }
}

// --- CREATE WORD PLANE --- //
export async function generateWordPlane(text, fontFamily, worldHeight, fontColor) {
  
    await ensureFont(fontFamily);          // wartet bis die Schriftart geladen ist

    // --- FONT SETTINGS --- //
    const fontPx = 180;
    const padding = 30;
    const scalePx = 3;                  //Faktor um welchen Pixel hochskalliert werden für Scharfe Kanten. Überabtastung --> höhere Auflösung als notwendig
    
    // --- CANVA/PINSEL ERSTELLEN --- //
    const measure = document.createElement('canvas').getContext('2d');      // Erst messen, wie breit der Text wird
    measure.font = `900 ${fontPx}px ${fontFamily}`;
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
    brush.fillStyle = fontColor;                      //Füllfarbe setzen
    brush.font = `900 ${fontPx}px ${fontFamily}`;
    brush.textAlign = 'center';
    brush.textBaseline = 'middle';
    brush.fillText(text, logicalW / 2, logicalH / 2);   //durch Faktor 2 dividieren, da der Text eingemittet werden soll

    // --- MESH/MATERIAL/TEXTUR ZUSAMMENSETZEN ---//
    // Plane mit demselben Seitenverhältnis wie das Canvas
    const texture = new THREE.CanvasTexture(canvas);                                        // generiert textur aus canvas
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });      // nimmt Canvas als Oberflächenmaterial. Setzt es auf transparent, sodass nur Textur (Schrift) sichtbar ist.
    const worldWidth = worldHeight * (canvas.width / canvas.height);                        //Verhältnis von worldHeight zu wordWith ist dasselbe wie jenes der canvas sodass nichts verzogen wird.
    const geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);                      //erstellt ein Rechteck mit den berechneten Massen
    const plane = new THREE.Mesh(geometry, material);                                       //generiert Mesh indem es Form und Material zusmmenbringt.
    
    return plane;
}


