////////// ANIMATION TIMELINE //////////

let timeline = gsap.timeline();

// --- REVEAL VARIA BELLA --- //
// Split Bel and Move Varia to the Left and fade in LA
timeline.to(".varia", {
    left: "21.8%",
    duration: 1.2,
    delay: 1,
});
timeline.to(".bella", {
    left: "57.4%",
    duration: 1.2,
},"<");
timeline.to(".la", {
    opacity: 1,
    duration: 1,
},"<");

// --- FIRST BOX MOVEMENT --- //
// Shift Varia to bottom bella to top
timeline.to(".varia",{
    top: "41%",
    ease: "back.in",
    delay: 0.5,
})
timeline.to(".bella",{
    top: "24%",
    ease: "back.in",
}, "<");

// Shift to Bella Varia
timeline.to(".varia",{
    left: "40%",
    ease: "back.inOut",
    duration: 0.7,
})
timeline.to(".bella",{
    left: "31%",
    ease: "back.inOut",
    duration: 0.7,
}, "<");

// --- SECOND BOX MOVEMENT --- //
// Shift Varia to the right and Bella to left
timeline.to(".varia",{
    left: "24.8%",
    ease: "back.inOut",
    duration: 0.7,
    delay: 0.5,
})
timeline.to(".bella",{
    left: "56.1%",
    ease: "back.inOut",
    duration: 0.7,
}, "<");

//shift Bella to bottom and Varia to top
timeline.to(".varia",{
    top: "24%",
    ease: "back.inOut",
    duration: 0.7,
})
timeline.to(".bella",{
    top: "41%",
    ease: "back.inOut",
    duration: 0.7,
    //May be changed
    //delay: 0.2,
}, "<");

// Shift Bella to the right and Varia to left
timeline.to(".varia",{
    left: "35%",
    ease: "back.inOut",
    duration: 0.7,
})
timeline.to(".bella",{
    left: "35%",
    ease: "back.inOut",
    duration: 0.7,
}, "<");

// --- SHIFT VARIA/BELLA TO FINAL POSITION --- //
// Position Bella bottom right
timeline.to(".bella",{
    top: "81%",
    //circ ease can change depending on middle picture
    ease: "circ.out",
    duration: 2.5,
    delay: 0.5,
})
// Position Varia top left
timeline.to(".varia",{
    top: "-6%",
    ease: "circ.out",
    duration: 2.5,
},"<")


// Shift Bella to the right and Varia to left
timeline.to(".varia",{
    left: "0%",
    //ease: "power3.out",
    duration: 2.5,
})
timeline.to(".bella",{
    left: "67%",
    //ease: "power3.out",
    duration: 2.5,
}, "<");

