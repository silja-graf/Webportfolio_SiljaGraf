gsap.registerPlugin(Flip);

//////////  FLIP ANIMATION  //////////
const wordSegments = gsap.utils.toArray(".variaFlip");
// Given an Array of two siblings, append the one that's first so it's last (swap)
function swap([a, b]) {
  a.parentNode.children[0] === a ? a.parentNode.appendChild(a) : a.parentNode.appendChild(b);
}
//Funktion erstellen welche elemente Wechselt
function doFlip(delayTime){
    //Anfangsposition ermitteln
    const state = Flip.getState(wordSegments);
    swap(wordSegments);
  // Animate from the initial state to the end state
  timeline.to(Flip.from(state, {delay: delayTime, ease: "power1.inOut"}));
}








