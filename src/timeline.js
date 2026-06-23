import { gsap } from "gsap";

export function buildTextTimeline(varia, bel, la, blob){
////////// ANIMATION TIMELINE //////////
let timeline = gsap.timeline();
let laDisToBel = 6;

let belHorizPos = 4.8;
let varHorizPos = -6.6;
// --- REVEAL VARIA BELLA --- //
// Split Bel and Move Varia to the x and fade in LA
    timeline.to(varia.position, {   x: varHorizPos,                    duration: 1.2, delay: 1 });
    timeline.to(bel.position,   {   x: belHorizPos,                    duration: 1.2           },'<');
    timeline.to(la.position,    {   x: belHorizPos + laDisToBel,    duration: 1.2           },'<');
    timeline.to(la.material,    {   opacity: 1, duration: 1             },'<');

// // --- FIRST BOX MOVEMENT --- //
    let vertShift = 1.5;
    // Shift Varia to bottom bella to y
    timeline.to(varia.position, {   y: -vertShift, ease: "back.in", delay: 0.5})
    timeline.to(bel.position,   {   y: vertShift,  ease: "back.in"}, '<');
    timeline.to(la.position,    {   y: vertShift,  ease: "back.in"}, '<');

    let xBel = -5;
    let xLa = xBel + laDisToBel;
    // Shift to Bella Varia
    timeline.to(varia.position,{  x: 0.7,      ease: "back.inOut", duration: 0.7 })
    timeline.to(bel.position,  {  x: xBel,     ease: "back.inOut", duration: 0.7,}, '<');
    timeline.to(la.position,   {  x: xLa,      ease: "back.inOut", duration: 0.7,}, '<');

    // --- SECOND BOX MOVEMENT --- //
    // Shift Varia to the right and Bella to x
    timeline.to(bel.position,   {    x: belHorizPos,                  ease: "back.inOut",    duration: 0.7, delay: 0.5, })
    timeline.to(la.position,    {    x: belHorizPos + laDisToBel,  ease: "back.inOut",    duration: 0.7,    }, '<');
    timeline.to(varia.position, {    x: varHorizPos,  ease: "back.inOut",    duration: 0.7,    }, '<');

   //shift Bella to bottom and Varia to y
    timeline.to(varia.position, {   y: vertShift,   ease: "back.in", duration: 0.7})
    timeline.to(bel.position,   {   y: -vertShift,  ease: "back.in", duration: 0.7}, '<');
    timeline.to(la.position,    {   y: -vertShift,  ease: "back.in", duration: 0.7}, '<');

//  Shift Bella to the right and Varia to x
    timeline.to(bel.position,   {    x: -2,                  ease: "back.inOut",    duration: 0.7, })
    timeline.to(la.position,    {    x: -2 + laDisToBel,  ease: "back.inOut",    duration: 0.7, }, '<');
    timeline.to(varia.position, {    x: 0,                   ease: "back.inOut",    duration: 0.7,    }, '<');

    // --- SHIFT VARIA/BELLA TO FINAL POSITION --- //
    // Position Bella bottom right
    timeline.to(varia.position, {   y: 10,      ease: "back.in", duration: 0.5, delay:0.5})
    timeline.to(bel.position,   {   y: -10,     ease: "back.in", duration: 0.5}, '<');
    timeline.to(la.position,    {   y: -10,     ease: "back.in", duration: 0.5}, '<');

    // --- BLOB SCALE --- //
    timeline.to(blob.scale,     {   x:1 ,y:1 ,z:1,         ease: "back.in",   duration: 0.5, }, '<') 
    timeline.to(blob.scale,     {   x:0.1 ,y:0.1 ,z:0.1,   ease: "circ.in",   duration: 0.5, delay: 0.5}, )   
    timeline.to(blob.position,  {   x:5 ,y:5 , z:0,        ease: "circ.in",   duration: 0.5, },'<' ) 
    //bring varia Bella back in place
    timeline.to(varia.position,  {   x:-8 ,y:5.5 , z:0,           duration: 0.5, },'<' ) 
    timeline.to(bel.position,    {   x:5 ,y:-6 , z:0,           duration: 0.5, },'<' ) 
    timeline.to(la.position,     {   x:5 + laDisToBel ,y:-6 , z:0,           duration: 0.5, },'<' ) 

      


//     // Shift Bella to the right and Varia to x
//     timeline.to("varia.position",{
//         x: "0%",
//         //ease: "power3.out",
//         duration: 2.5,
//     }, "<2.5")
//     timeline.to(".bella",{
//         x: "67%",
//         //ease: "power3.out",
//         duration: 2.5,
//     }, "<");
}


