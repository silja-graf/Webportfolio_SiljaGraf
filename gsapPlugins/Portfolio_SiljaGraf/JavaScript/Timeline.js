////////// ANIMATION TIMELINE //////////

let timeline = gsap.timeline();

// Split hinter dem "a"
timeline.to(".char5", {
    marginRight: 50,
    duration: 1,
    delay: 2
});

// Opacity von "la"
timeline.to(la, {
    opacity: 1,
    duration: 2
}, "<");

// Rechter Split
timeline.to(".char10", {
    marginRight: 50,
    duration: 1
});


// ===== AUSBLENDEN =====
timeline.to(".char", {
    opacity: 0,
    duration: 1,
});


// ===== POSITION IM VERBORGENEN ÄNDERN =====
timeline.call(() => {
    doFlip(0);
});


// ===== WIEDER EINBLENDEN =====
timeline.to(".char", {
    opacity: 1,
    duration: 1,
    delay: 1
});

// ===== AUSBLENDEN =====
timeline.to(".char", {
    opacity: 0,
    duration: 0,
});
    