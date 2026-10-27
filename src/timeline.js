import { gsap } from "gsap";
import { blobGroup } from "./scene/blobField";
import {enableScroll} from "./scene/scrollState.js";
import { camera } from "./scene/stage.js";   // NEU: für das Endlayout (Bildschirmbreite in 3D-Einheiten)

// =====================================================================
//  INTRO-TIMELINE (aktuelle Version)
//  Ablauf: VARIABEL → VARIA BELLA → VARIA BELLA versetzt
//          → VARIA über BELLA → rausfliegen → SILJA / GRAF versetzt + Slogan, rechts Bild mit Blob
//  Dauer ca. 5,5 s. Die ursprüngliche Timeline steht unten auskommentiert.
// =====================================================================

export function buildTextTimeline(varia, bel, la, blob, silja, graf, photo){   // NEU: photo = dein Bild rechts

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

// NEUES ENDLAYOUT: SILJA über GRAF, linksbündig gestapelt; der Blob sitzt an der rechten Kante
// und bricht das A und das F; der Slogan (index.html) blendet darunter ein.
// Die alten Zeilen stehen auskommentiert darüber.

/*  ALT (feste Werte, nur für 16:10 richtig) – ersetzt durch computeTitleLayout() unten in dieser Datei
    // linker Rand + Breite des Namens in 3D-Einheiten (Wörter und Bild liegen bei z = -1, Kamera bei z = 9)
    const halfH      = Math.tan((camera.fov / 2) * Math.PI / 180) * 10;
    const halfW      = halfH * camera.aspect;
    const nameScale  = 0.6;                                                   // Grösse der Namen (vorher 0.94)
    const nameW      = silja.geometry.parameters.width * nameScale * 0.89;    // Breite von SILJA (ohne Rand)
    const grafW      = graf.geometry.parameters.width  * nameScale * 0.89;    // Breite von GRAF
    const sideMargin  = 0.10;                                                 // NEU: Abstand Text zum Rand (vorher 5.5 %) → zentrierter
    const photoMargin = 0.09;                                                 // NEU: Abstand Bild zum Rand (vorher 7.5 %)
    const siljaX     = -halfW + halfW * 2 * sideMargin + nameW / 2;           // SILJA linksbündig
    const grafX      = -halfW + halfW * 2 * sideMargin + 2.4 + grafW / 2;     // GRAF versetzt nach rechts
    const siljaY     = 2.6;                                                   // SILJA oben
    const grafY      = -0.4;                                                  // GRAF darunter

    // Bild rechts
    const photoH     = 9.6;                                                   // Höhe des Bildes
    const photoX     = halfW - halfW * 2 * photoMargin - (photoH * 0.8) / 2;  // rechtsbündig
    const photoY     = 0.2;

    // Blob an der unteren linken Kante des Bildes (bricht den Bildrand)
    const blobX      = (photoX - photoH * 0.4) * 0.9 + 0.3;
    const blobY      = -2.6;
    const blobScale  = 0.2;

*/
    // NEU: RESPONSIVE – alle Werte kommen aus computeTitleLayout() (unten), passend zum Bildschirmformat
    const L = computeTitleLayout(silja, graf);
    const { nameScale, siljaX, grafX, siljaY, grafY, photoH, photoX, photoY, blobX, blobY, blobScale } = L;

    silja.userData.baseY = siljaY;          // Ausgangshöhe fürs Wegkippen (writeText.js)
    graf.userData.baseY  = grafY;
    blob.userData.endX   = blobX;           // Ausgangspunkt fürs Wegrollen (writeText.js)

    //blob wieder verkleinern und nach oben rechts schieben
//    timeline.to(blob.scale,     {   x: 0.1, y: 0.15, z: 0.15,      ease: "circ.in", duration: 0.7, delay: 0.3 });
    timeline.to(blob.scale,     {   x: blobScale, y: blobScale, z: blobScale, ease: "power2.inOut", duration: 0.7, delay: 0.3 });   // NEU
    //Namen einfliegen
//    timeline.to(silja.position, {   x: -5.6, y: 4.6,  z: 0,                         duration: 0.7 }, '<');
//    timeline.to(graf.position,  {   x: 5.6,  y: -5.3, z: 0,                         duration: 0.7 }, '<');
    timeline.to(silja.position, {   x: siljaX, y: siljaY, z: -1,                    duration: 0.7 }, '<');   // NEU
    timeline.to(graf.position,  {   x: grafX,  y: grafY,  z: -1,                    duration: 0.7 }, '<');   // NEU: versetzt
    timeline.to(silja.scale,    {   x: nameScale, y: nameScale,                     duration: 0.7 }, '<');   // NEU: kleiner
    timeline.to(graf.scale,     {   x: nameScale, y: nameScale,                     duration: 0.7 }, '<');   // NEU
//    timeline.to(blob.position,  {   x: 16,   y: 8.7,  z: 0,        ease: "back.in", duration: 0.4 }, '<');
    timeline.to(blob.position,  {   x: blobX, y: blobY, z: 0,      ease: "power2.inOut", duration: 0.7 }, '<');   // NEU
    //Bild einblenden (liegt hinter dem Blob → wird an der Kante gebrochen)
    if (photo) {
      photo.position.set(photoX, photoY - 0.6, -1);
      photo.scale.setScalar(photoH);
      photo.userData.baseY = photoY;    // fürs Wegscrollen (writeText.js)
      photo.userData.ready = true;
      timeline.to(photo.material, { opacity: 1,                                     duration: 0.7 }, '<0.2');   // NEU
      timeline.to(photo.position, { y: photoY,                 ease: "power2.out", duration: 0.7 }, '<');      // NEU
    }
    //Slogan einblenden
    timeline.fromTo('#slogan',  {   opacity: 0, y: 14 }, { opacity: 1, y: 0,         duration: 0.5 }, '>-0.3');   // NEU
    //About-me-Knopf oben mittig einblenden
//    timeline.fromTo('#about-btn', { opacity: 0, y: -10 }, { opacity: 1, y: 0,       duration: 0.5 }, '<');      // NEU
    timeline.fromTo('#role-line', { opacity: 0, y: 10 }, { opacity: 1, y: 0,        duration: 0.5 }, '<');      // NEU: Rollen-Zeile über SILJA
    timeline.fromTo('#top-nav',   { opacity: 0, y: -10 }, { opacity: 1, y: 0,       duration: 0.5 }, '<');      // NEU: About me + Kontakt


// --- 7. SCROLLEN AKTIVIEREN --- //
    timeline.call(() => {
        enableScroll();
        document.getElementById('scroll-hint')?.classList.add('is-ready');
//        document.getElementById('about-btn')?.classList.add('is-ready');   // NEU: Knopf wird klickbar
        document.getElementById('top-nav')?.classList.add('is-ready');     // NEU: Knöpfe werden klickbar
        // NEU: RESPONSIVE – bei Grössenänderung des Fensters das Endlayout neu berechnen
        window.addEventListener('resize', () => applyTitleLayout(silja, graf, blob, photo));
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


// ===================================================================================
// NEU: RESPONSIVE ENDLAYOUT DER TITELSEITE
// Die 3D-Szene skaliert mit der Fensterhöhe. Damit es auf allen Desktop-Formaten passt:
//  - k:    bei schmalen Formaten (4:3, 5:4) wird alles kleiner, damit Name und Bild sich nicht überlappen
//  - effW: bei sehr breiten Formaten (Ultrawide) bleibt das Layout zusammen statt an die Ränder zu wandern
// Gleiche Formeln wie im CSS (styles.css: --u und --lw) → Slogan und Rollen-Zeile passen immer zum Namen.
// Referenz ist 16:10 (z. B. 1440×900): dort ist k = 1 und alles wie vorher.
// ===================================================================================
const REF_ASPECT = 1.6;   // ab hier schmaler → verkleinern   (CSS: 0.625vw = 1vh / 1.6)
const MAX_ASPECT = 1.8;   // ab hier breiter → Layout nicht weiter auseinanderziehen (CSS: 180vh)

export function computeTitleLayout(silja, graf) {
    const aspect     = window.innerWidth / window.innerHeight;
    const halfH      = Math.tan((camera.fov / 2) * Math.PI / 180) * 10;   // Wörter und Bild liegen bei z = -1, Kamera bei z = 9
    const halfW      = halfH * aspect;
    const k          = Math.min(1, aspect / REF_ASPECT);                  // Verkleinerung bei schmalen Formaten
    const effW       = Math.min(halfW, halfH * MAX_ASPECT);               // genutzte halbe Breite

    const nameScale  = 0.6 * k;                                           // Grösse der Namen
    const nameW      = silja.geometry.parameters.width * nameScale * 0.89;   // Breite von SILJA (ohne Rand)
    const grafW      = graf.geometry.parameters.width  * nameScale * 0.89;   // Breite von GRAF
    const left       = -effW + effW * 2 * 0.10;                           // linker Rand: 10 % der Layoutbreite
    const siljaX     = left + nameW / 2;                                  // SILJA linksbündig
    const grafX      = left + 2.4 * k + grafW / 2;                        // GRAF versetzt nach rechts
    const siljaY     = 2.6 * k;
    const grafY      = -0.4 * k;

    const photoH     = 9.6 * k;                                           // Höhe des Bildes
    const photoX     = effW - effW * 2 * 0.09 - (photoH * 0.8) / 2;       // rechtsbündig: 9 % Rand
    const photoY     = 0.2 * k;

    const blobX      = photoX - photoH * 0.4 + 0.06 * k;                  // an der linken Bildkante
    const blobY      = -2.6 * k;
    const blobScale  = 0.2 * k;

    return { nameScale, siljaX, grafX, siljaY, grafY, photoH, photoX, photoY, blobX, blobY, blobScale };
}

// setzt das Endlayout sofort (ohne Animation) – z. B. nach Grössenänderung des Fensters
export function applyTitleLayout(silja, graf, blob, photo) {
    const L = computeTitleLayout(silja, graf);
    silja.scale.set(L.nameScale, L.nameScale, 1);
    graf.scale.set(L.nameScale, L.nameScale, 1);
    silja.position.x = L.siljaX;   silja.userData.baseY = L.siljaY;   // y setzt writeText.js beim Scrollen
    graf.position.x  = L.grafX;    graf.userData.baseY  = L.grafY;
    blob.scale.setScalar(L.blobScale);
    blob.position.y  = L.blobY;
    blob.userData.endX = L.blobX;                                      // x setzt writeText.js beim Scrollen
    if (photo) {
      photo.scale.setScalar(L.photoH);
      photo.position.x = L.photoX;
      photo.userData.baseY = L.photoY;
    }
}
