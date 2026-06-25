import { gsap } from "gsap";
import { blobGroup } from "./scene/blobField";

export function buildTextTimeline(varia, bel, la, blob, silja, graf){

    // --- ANIMATION TIMELINE --- //
let timeline = gsap.timeline();
let laDisToBel = 6;


let belHorizPos = 5;
let varHorizPos = -5.6;

// --- REVEAL VARIA BELLA --- //
// Split Bel and Move Varia to the x and fade in LA
    //words
    timeline.to(varia.position, {   x: varHorizPos,                    duration: 1.2, delay: 1 });
    timeline.to(bel.position,   {   x: belHorizPos,                    duration: 1.2           },'<');
    timeline.to(la.position,    {   x: belHorizPos + laDisToBel,       duration: 1.2           },'<');
    timeline.to(la.material,    {   opacity: 1, duration: 1             },'<');
    //blob
    timeline.to(blob.rotation, { y: 10 * Math.PI / 180, duration: 1 },'<'); //Umrechnung von RAD zu GRAD durch Pi/180

    
// // --- FIRST BOX MOVEMENT --- //
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
        //word
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
    timeline.to(varia.position, {   y: 10,      ease: "back.in", duration: 1, delay: 1},'<')
    timeline.to(bel.position,   {   y: -10,     ease: "back.in", duration: 1}, '<');
    timeline.to(la.position,    {   y: -10,     ease: "back.in", duration: 1}, '<');

    // --- BLOB SCALE --- //
    timeline.to(blob.scale,     {   x:1 ,   y:1 ,     z:1,     ease: "back.in",   duration: 0.5, }, '<') 
    // --- BLOB FIELD --- //
    timeline.call(() => {    blobGroup.visible = true;},); 

    //blob wieder verkleinern und positionieren
    timeline.to(blob.scale,     {   x:0.1 , y:0.15 ,   z:0.15,   ease: "circ.in",   duration: 1, delay: 0.5}, ) 
    

    timeline.to(blob.position,   {  x:12 ,   y:5.7 ,    z:0,     ease: "circ.in",   duration: 0.5, },'<' )

    // bring in Names
    timeline.to(silja.position,  {  x:-5.6, y:4.6 ,   z:0,     duration: 1, },'<' ) 
    timeline.to(graf.position,   {  x:5.6,  y:-5.3 ,  z:0,     duration: 1, },'<' )

}


