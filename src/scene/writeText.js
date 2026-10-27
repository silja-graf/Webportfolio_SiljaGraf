import {scene} from './stage.js'
import {generateWordPlane} from './generateText.js';
import { buildTextTimeline } from '../timeline.js';
import {loadBlob} from './blob.js'
import * as THREE from 'three';
import { loadBlobField } from './blobField.js';
import { onFrame } from './stage.js';
import { scroll, onScrollEnabled, enableScroll, setTarget } from './scrollState.js';
import { setProgress, finishLoading } from './loadingScreen.js';   // NEU: Ladeanzeige


export let varia = null;          // export notwendig, um sie danach animieren zu können
export let bel = null;
export let la = null;
export let silja = null;
export let graf = null;
export let about = null;
export let photo = null;          // NEU: dein Bild rechts auf der Titelseite (3D-Ebene, damit der Blob es brechen kann)
const slogan = document.getElementById('slogan');   // NEU: Slogan unter dem Namen (index.html)
//const aboutBtn = document.getElementById('about-btn');   // NEU: About-me-Knopf oben mittig (index.html)
const aboutBtn = document.getElementById('top-nav');     // NEU: About me + Kontakt oben mittig (index.html)
const roleLine = document.getElementById('role-line');   // NEU: Rollen-Zeile über SILJA (index.html)


async function makeRayWord(text, sharpHeight) {
  const sharp = await generateWordPlane(text, 'Outfit', sharpHeight, '#000000');
  sharp.material.opacity = 0;                 // scharfe Schrift unsichtbar starten

  const rayHeight = sharpHeight * 2.6;        // Faktor ggf. nachjustieren (Text gleich groß wie scharf)
  const ray = await generateRayPlane(text, 'Outfit', rayHeight);

  const group = new THREE.Group();
  ray.position.z = -0.3;
  sharp.position.z = 0;
  group.add(ray, sharp);
  group.userData.sharp = sharp;               // Referenzen für die Timeline
  group.userData.ray = ray;
  return group;
}

// NEU: Bild als 3D-Ebene mit weicher Blob-Form (Ellipse) – Breite 0.8, Höhe 1 → wird in timeline.js skaliert
async function makePhotoPlane(url) {
  const img = await new Promise((resolve) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => resolve(null);
    i.src = url;
  });
  const cv = document.createElement('canvas');
  cv.width = 720; cv.height = 900;
  const g = cv.getContext('2d');
  if (img) {
    g.beginPath();
    g.ellipse(360, 450, 352, 442, 0, 0, Math.PI * 2);   // organische Form wie auf der Kontaktseite
    g.clip();
    g.drawImage(img, 0, 0, 720, 900);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 1),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0 })   // startet unsichtbar
  );
  mesh.position.set(20, 0, -1);   // ausserhalb, bis die Timeline es einblendet
  return mesh;
}

async function writeText(){
    console.log('savedY beim Laden:', sessionStorage.getItem('scrollY'));
    // VARIA BELLA //
    // wartet durch await auf den return und führt dann aus
    setProgress(0.05);   // NEU: Ladeanzeige – Schrift wird geladen
    varia = await generateWordPlane('VARIA', 'Outfit', 5, '#000000');
    bel   = await generateWordPlane('BEL', 'Outfit', 5, '#000000');
    la    = await generateWordPlane('LA', 'Outfit', 5, '#000000');
    // wörter Positionieren
    bel.position.set( 5.8, 0, -1);
    la.position.set(11.8, 0, -1);
    la.material.opacity = 0;    // LA startet unsichtbar – wird in der Animation eingeblendet
    // Startpositionen (x, y, z) definieren
    varia.position.set(-3.6, 0, -1);
    varia.renderOrder = 10;            // wird zuletzt gezeichnet → liegt optisch oben

    // SILJA GRAF //
    silja = await generateWordPlane('SILJA','Outfit', 7,'#000000');   // text, sharpHeight, angleDeg(°)
    graf  = await generateWordPlane('GRAF','Outfit', 7,'#000000');   // andere Richtung
    silja.position.set(-8,-10, -1);
    silja.userData.baseY = 4.6;    // Startposition merken
    
    graf.position.set(8, 10, -1);
    graf.userData.baseY = -5.3; // Startposition zum kippen merken

    
    scene.add(varia, bel, la, silja, graf );
    setProgress(0.15);   // NEU: Ladeanzeige – Wörter sind bereit

    // NEU: Bild laden und mit organischer Blob-Form ausschneiden
    photo = await makePhotoPlane(`${import.meta.env.BASE_URL}pics/SiljaGraf_Portrait.webp`);
    scene.add(photo);

    // Wegkippen der Wörter nicht direkt onFrame registrieren, sondern warten:
    onScrollEnabled(() => {
      onFrame(() => {
        if (!silja || !graf) return;
        const s = Math.min(1, Math.max(0, scroll.y));
        // silja wegkkippen lassen
        silja.rotation.x = s * Math.PI / 2;
        silja.position.y = silja.userData.baseY + s * 2;
        silja.material.opacity = Math.max(0, 1 - s * 2);
        // graf wegkippen lassen
        graf.rotation.x  = -s * Math.PI / 2 * 0.7;
        graf.position.y  = graf.userData.baseY - s * 1.5;
        graf.material.opacity = Math.max(0, 1 - s * 2);

        // NEU: Slogan blendet beim Scrollen aus
        if (slogan) slogan.style.opacity = String(Math.max(0, 1 - s * 2.5));
        if (roleLine) roleLine.style.opacity = String(Math.max(0, 1 - s * 2.5));   // NEU
        // NEU: About-me-Knopf blendet mit dem Slogan aus und ist dann nicht mehr klickbar
        if (aboutBtn) {
          aboutBtn.style.opacity = String(Math.max(0, 1 - s * 2.5));
          aboutBtn.classList.toggle('is-hidden', s > 0.3);
        }
        // NEU: Bild blendet beim Scrollen aus und gleitet leicht nach oben
        if (photo && photo.userData.ready) {
          photo.material.opacity = Math.max(0, 1 - s * 2.5);
          photo.position.y = photo.userData.baseY + s * 1.5;
        }

      });
    });
    
    const blob = await loadBlob(); //wartet bis blob geladen ist

    // NEU: beim Scrollen rollt der Blob nach rechts aus dem Bild (Endposition kommt aus timeline.js)
    onScrollEnabled(() => {
      onFrame(() => {
        const s = Math.min(1, Math.max(0, scroll.y));
        const startX = blob.userData.endX ?? blob.position.x;
        blob.position.x = startX + s * 14;
        blob.rotation.z = -s * 2.5;          // rollen
      });
    });
    await loadBlobField()
    setProgress(1);              // NEU: alles geladen
    await finishLoading();       // NEU: Ladeanzeige ausblenden, erst danach startet die Animation
        // Timeline bauen und zurückgeben
//  const tl = buildTextTimeline(varia, bel, la, blob, silja, graf);
    const tl = buildTextTimeline(varia, bel, la, blob, silja, graf, photo);   // NEU: mit Bild

    // Intro gilt als gesehen, sobald es fertig ist (pro Besuch = pro Browser-Tab)
    tl.eventCallback('onComplete', () => sessionStorage.setItem('introSeen', '1'));

    // Intro beenden: springt ans Ende → die call()-Befehle in der Timeline laufen dabei mit
    // (Blob-Feld einblenden, enableScroll, Scroll-Hinweis)
    function skipIntro() {
      removeSkipListeners();
      if (tl.progress() < 1) tl.progress(1);
      tl.pause();
    }
    function removeSkipListeners() {
      window.removeEventListener('skip-intro', skipIntro);
    }

    // Von Projektseite zurückgekommen → Animation überspringen
    const savedY = sessionStorage.getItem('scrollY');
    // Intro in diesem Besuch schon gesehen → ebenfalls überspringen
    const introSeen = sessionStorage.getItem('introSeen');

    if (savedY) {
      skipIntro();                           // sofort ans Ende
//      tl.progress(1);                        // sofort ans Ende
//      tl.pause();
//      enableScroll();                        // nicht mehr nötig: läuft schon über timeline.call() → sonst doppelt
      const y = parseFloat(savedY);
      scroll.y = y;
      setTarget(y);
      sessionStorage.removeItem('scrollY');
    } else if (introSeen) {
      skipIntro();
    } else {
      // Intro läuft normal ab (nicht mehr per Scroll überspringbar)
//      window.addEventListener('skip-intro', skipIntro);   // AUSKOMMENTIERT: Überspringen per Scroll entfernt
      tl.eventCallback('onComplete', () => {
        sessionStorage.setItem('introSeen', '1');
        removeSkipListeners();
      });
    }
}

writeText();






