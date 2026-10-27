import { gsap } from "gsap";
import { blobGroup } from "./scene/blobField";
import {enableScroll} from "./scene/scrollState.js";

// =====================================================================
//  INTRO-TIMELINE (aktuelle Version)
//  Ablauf: VARIABEL → VARIA BELLA → VARIA BELLA versetzt
//          → VARIA über BELLA → rausfliegen → SILJA GRAF
//  Dauer ca. 5,5 s. Die ursprüngliche Timeline steht unten auskommentiert.
// =====================================================================

export function buildTextTimeline(varia, bel, la, blob, silja, graf){

let timeline = gsap.timeline();

// --- POSITIONEN --- //
let laDisToBel  = 6;        // Abstand BEL → LA (bilden zusammen BELLA)
let belHorizPos = 5;        // x von BEL in "VARIA BELLA" (eine Zeile)
let varHorizPos = -6.8;     // x von VARIA in "VARIA BELLA" (eine Zeile)
let vertShift   = 1.5;      // wie weit VARIA hoch / BELLA runter geht

let variaOffsetX = -3.5;    // x von VARIA in der versetzten Position (oben links)
let belOffsetX   = 0;       // x von BEL in der versetzten Position (unten rechts)

let variaEndX = 0;          // x von VARIA in der Endposition (VARIA über BELLA)
let belEndX   = -2;         // x von BEL in der Endposition

let deg10 = 10 * Math.PI / 180;     // 10° in RAD umgerechnet


// --- 1. VARIABEL → VARIA BELLA --- //
// VARIABEL steht kurz (delay), dann geht das Wort auseinander und LA blendet ein
    timeline.to(varia.position, {   x: varHorizPos,               duration: 0.8, delay: 0.6 });
    timeline.to(bel.position,   {   x: belHorizPos,               duration: 0.8 }, '<');
    timeline.to(la.position,    {   x: belHorizPos + laDisToBel,  duration: 0.8 }, '<');
    timeline.to(la.material,    {   opacity: 1,                   duration: 0.6 }, '<');
    //blob
    timeline.to(blob.rotation,  {   y: deg10,                     duration: 0.7 }, '<');


// --- 2. VARIA HOCH, BELLA RUNTER --- //
    timeline.to(varia.position, {   y: vertShift,   ease: "back.in", duration: 0.5, delay: 0.45 });   // delay = Lesepause "VARIA BELLA"
    timeline.to(bel.position,   {   y: -vertShift,  ease: "back.in", duration: 0.5 }, '<');
    timeline.to(la.position,    {   y: -vertShift,  ease: "back.in", duration: 0.5 }, '<');
    //blob
    timeline.to(blob.rotation,  {   x: deg10,                        duration: 0.4 }, '<');


// --- 3. VARIA BELLA VERSETZT --- //
// VARIA oben links, BELLA unten rechts
    timeline.to(varia.position, {   x: variaOffsetX,               ease: "back.inOut", duration: 0.7 });
    timeline.to(bel.position,   {   x: belOffsetX,                 ease: "back.inOut", duration: 0.7 }, '<');
    timeline.to(la.position,    {   x: belOffsetX + laDisToBel,    ease: "back.inOut", duration: 0.7 }, '<');
    //blob: kurz strecken, dann elastisch zurückfedern
    timeline.to(blob.scale,     {   x: 0.35,                       ease: "power2.out", duration: 0.2 }, '<');
    timeline.to(blob.scale,     {   x: 0.3, y: 0.3, z: 0.3,        ease: "elastic.out(1, 0.3)", duration: 1, delay: 0.2 }, '<');


// --- 4. ENDPOSITION: VARIA ÜBER BELLA --- //
// delay zählt ab Start des Blob-Federns (Zeile oben) → kurze Lesepause in der versetzten Position
    timeline.to(bel.position,   {   x: belEndX,                    ease: "back.inOut", duration: 0.5, delay: 0.95 }, '<');
    timeline.to(la.position,    {   x: belEndX + laDisToBel,       ease: "back.inOut", duration: 0.5 }, '<');
    timeline.to(varia.position, {   x: variaEndX,                  ease: "back.inOut", duration: 0.5 }, '<');
    //blob: nur strecken, KEIN Nachfedern → sonst stockt er beim Wachsen in Schritt 5
    timeline.to(blob.scale,     {   x: 0.33,                       ease: "power2.out", duration: 0.15 }, '<');


// --- 5. VARIA/BELLA RAUSFLIEGEN, BLOB WÄCHST --- //
// delay 0.5 = Dauer von Schritt 4 → fliegt raus, sobald die Endposition erreicht ist (keine Wartezeit)
    timeline.to(varia.position, {   y: 10,                         ease: "back.in", duration: 0.6, delay: 0.5 }, '<');
    timeline.to(bel.position,   {   y: -10,                        ease: "back.in", duration: 0.6 }, '<');
    timeline.to(la.position,    {   y: -10,                        ease: "back.in", duration: 0.6 }, '<');
    //blob
    timeline.to(blob.scale,     {   x: 1, y: 1, z: 1,              ease: "back.in", duration: 0.4 }, '<');


// --- 6. BLOB-FELD + SILJA GRAF --- //
    timeline.call(() => { blobGroup.visible = true; });

    //blob wieder verkleinern und nach oben rechts schieben
    timeline.to(blob.scale,     {   x: 0.1, y: 0.15, z: 0.15,      ease: "circ.in", duration: 0.7, delay: 0.3 });
    //Namen einfliegen
    timeline.to(silja.position, {   x: -5.6, y: 4.6,  z: 0,                         duration: 0.7 }, '<');
    timeline.to(graf.position,  {   x: 5.6,  y: -5.3, z: 0,                         duration: 0.7 }, '<');
    timeline.to(blob.position,  {   x: 16,   y: 8.7,  z: 0,        ease: "back.in", duration: 0.4 }, '<');


// --- 7. SCROLLEN AKTIVIEREN --- //
    timeline.call(() => {
        enableScroll();
        document.getElementById('scroll-hint')?.classList.add('is-ready');
    });

    return timeline;
}



// =====================================================================
//  URSPRÜNGLICHE TIMELINE (Archiv, nicht aktiv)
//  Ablauf: VARIABEL → VARIA BELLA → BELLA VARIA → VARIA BELLA → rausfliegen
//  Dauer ca. 10,3 s
// =====================================================================
/*

export function buildTextTimeline(varia, bel, la, blob, silja, graf){

// --- ANIMATION TIMELINE --- //
let timeline = gsap.timeline();

let laDisToBel = 6;
let belHorizPos = 5;
let varHorizPos = -6.8;

// --- REVEAL VARIA BELLA --- //
// Split Bel and Move Varia to the x and fade in LA
    //words
    timeline.to(varia.position, {   x: varHorizPos,                    duration: 1.2, delay: 1 });
    timeline.to(bel.position,   {   x: belHorizPos,                    duration: 1.2           },'<');
    timeline.to(la.position,    {   x: belHorizPos + laDisToBel,       duration: 1.2           },'<');
    timeline.to(la.material,    {   opacity: 1, duration: 1             },'<');
    //blob
    timeline.to(blob.rotation, { y: 10 * Math.PI / 180, duration: 1 },'<'); //Umrechnung von RAD zu GRAD durch Pi/180

    
// --- FIRST BOX MOVEMENT --- //
    let vertShift = 1.5;
    // Shift Varia to bottom bella to y
        //words
        timeline.to(varia.position, {   y: -vertShift, ease: "back.in", delay: 0.5})
        timeline.to(bel.position,   {   y: vertShift,  ease: "back.in"}, '<');
        timeline.to(la.position,    {   y: vertShift,  ease: "back.in"}, '<');
        //blob
        timeline.to(blob.rotation, { x: 10 * Math.PI / 180},'<'); 

    let xBel = -5;
    let xLa = xBel + laDisToBel;
    // Shift to Bella Varia
        //word
        timeline.to(varia.position,{  x: 0.7,      ease: "back.inOut", duration: 0.7 })
        timeline.to(bel.position,  {  x: xBel,     ease: "back.inOut", duration: 0.7,}, '<');
        timeline.to(la.position,   {  x: xLa,      ease: "back.inOut", duration: 0.7,}, '<');
        //blob
        timeline.to(blob.scale, { x: 0.35,         duration: 0.3, ease: "power2.out" }, '<'); //schnelle Streckung
        timeline.to(blob.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 1.4, ease: "elastic.out(1, 0.3)", delay: 0.3 },'<'); // elastisch zurück auf die Ausgangsgröße bouncen

// --- SECOND BOX MOVEMENT --- //
    // Shift Varia to the right and Bella to x
        //word
        timeline.to(bel.position,   {    x: belHorizPos,               ease: "back.inOut",    duration: 0.7, delay: 1 },'<')
        timeline.to(la.position,    {    x: belHorizPos + laDisToBel,  ease: "back.inOut",    duration: 0.7,    }, '<');
        timeline.to(varia.position, {    x: varHorizPos,               ease: "back.inOut",    duration: 0.7,    }, '<');
        //blob
        timeline.to(blob.scale, { x: 0.2,                 duration: 0.4, ease: "power2.out" }, '<'); //schnelle Streckung
        timeline.to(blob.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 1.4, ease: "elastic.out(1, 0.3)", delay: 0.3 },'<'); // elastisch zurück auf die Ausgangsgröße bouncen

   //shift Bella to bottom and Varia to y
        timeline.to(varia.position, {   y: vertShift,   ease: "back.in", duration: 0.7, delay: 1},'<')
        timeline.to(bel.position,   {   y: -vertShift,  ease: "back.in", duration: 0.7}, '<');
        timeline.to(la.position,    {   y: -vertShift,  ease: "back.in", duration: 0.7}, '<');

    //  Shift Bella to the right and Varia to x
        //word
        timeline.to(bel.position,   {    x: -2,                  ease: "back.inOut",    duration: 0.7, delay: 0.7},'<')
        timeline.to(la.position,    {    x: -2 + laDisToBel,     ease: "back.inOut",    duration: 0.7, }, '<');
        timeline.to(varia.position, {    x: 0,                   ease: "back.inOut",    duration: 0.7,    }, '<');
        //blob
        timeline.to(blob.scale, { x: 0.33,                duration: 0.2, ease: "power2.out" }, '<'); //schnelle Streckung
        timeline.to(blob.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 1.4, ease: "elastic.out(1, 0.3)", delay: 0.3 },'<'); // elastisch zurück auf die Ausgangsgröße bouncen


    //--- SHIFT VARIA/BELLA TO FINAL POSITION --- //
        //Varia and bella out of Screen
        timeline.to(varia.position, {   y: 10,      ease: "back.in", duration: 1, delay: 1},'<');
        timeline.to(bel.position,   {   y: -10,     ease: "back.in", duration: 1}, '<');
        timeline.to(la.position,    {   y: -10,     ease: "back.in", duration: 1}, '<');

        // --- BLOB SCALE --- //
        timeline.to(blob.scale,     {   x:1 ,   y:1 ,     z:1,       ease: "back.in",   duration: 0.5, }, '<');
    
        
        // --- BLOB FIELD --- //
        timeline.call(() => {    blobGroup.visible = true;},); 

        //blob wieder verkleinern und positionieren
        timeline.to(blob.scale,      {  x:0.1 ,  y:0.15 ,   z:0.15,  ease: "circ.in",   duration: 1, delay: 0.5}, ); 

        // namen einblenden
        timeline.to(silja.position,  {  x:-5.6,  y:4.6 ,    z:0,                        duration: 1, },'<' );
        timeline.to(graf.position,   {  x:5.6,   y:-5.3 ,   z:0,                        duration: 1, },'<' );
        timeline.to(blob.position,   {  x:16 ,   y:8.7 ,    z:0,   ease: "back.in",  duration: 0.5, },'<' );

        // scrollen aktivieren
        timeline.call(() => {
        enableScroll();
        document.getElementById('scroll-hint')?.classList.add('is-ready');
        });

        return timeline;
}
*/
