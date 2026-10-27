// =====================================================================
//  LADEANZEIGE vor der Intro-Animation
//  Kreis füllt sich mit dem Ladefortschritt, Prozent in der Mitte.
//  setProgress(0…1) melden die Lade-Schritte, finishLoading() blendet aus.
// =====================================================================

const loader = document.getElementById('loader');
const ring   = loader?.querySelector('.loader-ring-progress');
const label  = loader?.querySelector('.loader-percent');

const RADIUS = 54;                          // muss zu r="54" im SVG (index.html) passen
const LENGTH = 2 * Math.PI * RADIUS;        // Umfang des Kreises

let target   = 0;      // gemeldeter Fortschritt
let shown    = 0;      // angezeigter Fortschritt (läuft weich hinterher)
let finished = false;
let resolveHidden = null;

if (ring) {
  ring.style.strokeDasharray  = LENGTH;
  ring.style.strokeDashoffset = LENGTH;
}

// Fortschritt melden (0 bis 1) – geht nie rückwärts
export function setProgress(p) {
  target = Math.max(target, Math.min(1, p));
}

// Laden fertig → Kreis auf 100 %, dann ausblenden. Promise ist erfüllt, wenn die Anzeige weg ist.
export function finishLoading() {
  target = 1;
  finished = true;
  if (!loader) return Promise.resolve();
  return new Promise((resolve) => { resolveHidden = resolve; });
}

function tick() {
  shown += (target - shown) * 0.12;
  if (target - shown < 0.002) shown = target;

  const percent = Math.round(shown * 100);
  if (ring)  ring.style.strokeDashoffset = String(LENGTH * (1 - shown));
  if (label) label.textContent = `${percent}%`;
  loader?.setAttribute('aria-valuenow', String(percent));

  if (finished && shown >= 1) {
    loader?.classList.add('is-done');               // CSS blendet in 0.5 s aus
    setTimeout(() => {
      loader?.remove();
      resolveHidden?.();
    }, 500);
    return;
  }
  requestAnimationFrame(tick);
}

if (loader) requestAnimationFrame(tick);
