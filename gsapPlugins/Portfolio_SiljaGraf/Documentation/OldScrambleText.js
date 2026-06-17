gsap.registerPlugin(ScrambleTextPlugin)
//////// SCRAMBLE TEXT ////////////
//use the defaults

gsap.to(element, {
  duration: 1, 
  scrambleText: {
    speed: 0.01,
    revealDelay: 0.5, 
    newClass: "reliabel",
    rightToLeft: true,
    chars: lowerCase,
  }
})