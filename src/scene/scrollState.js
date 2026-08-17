// src/scene/scrollState.js
import { gsap } from 'gsap';

// geteiltes Objekt – alle Module lesen scroll.y
export const scroll = { y: 0 };

let target = 0; // Zielwert, wo Scroll hin will
let enabled = false;   // erst aktiv wenn Timeline fertig

let onScrollStart = null;

const onScrollCallbacks = [];   // Array statt einzelne Variable

export function setTarget(val) {
  target = val;
}

export function onScrollEnabled(fn) { 
  onScrollCallbacks.push(fn);   // anhängen statt überschreiben
}

export function enableScroll() {
  enabled = true;
  onScrollCallbacks.forEach(fn => fn());
}

function onWheel(e) {
  if (!enabled) return;          // ignorieren wenn Animation noch läuft
  e.preventDefault();            // verhindert normales Browser-Scrollen
  target = Math.max(0, target + e.deltaY * 0.0015);   // Zielwert erhöhen
  gsap.to(scroll, {             // scroll.y träge zum Ziel bewegen
    y: target,
    duration: 1.2,
    ease: 'power3.out',
    overwrite: true,            // alten Tween überschreiben, nicht stapeln
  });
}

// Touchscreen Version zum Scrollen
function onTouchStart(e) { scroll._touchY = e.touches[0].clientY; }
function onTouchMove(e) {
  if (!enabled) return;
  const delta = scroll._touchY - e.touches[0].clientY;  // Berechnet Differenz zwischen Startpunkt und aktuellem Punkt
  scroll._touchY = e.touches[0].clientY;                // aktualisiert neuer Starpunkt
  target = Math.max(0, target + delta * 0.0015);
  gsap.to(scroll, {
    y: target,
    duration: 1.2,
    ease: 'power3.out',
    overwrite: true,
  });
}

window.addEventListener('wheel',      onWheel,      { passive: false });
window.addEventListener('touchstart', onTouchStart, { passive: true  });
window.addEventListener('touchmove',  onTouchMove,  { passive: true  });