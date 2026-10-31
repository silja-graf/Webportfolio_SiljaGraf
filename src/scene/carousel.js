import { gsap } from 'gsap';
//import { scroll, onScrollEnabled } from '/src/scene/scrollState.js';
import { scroll, onScrollEnabled, scrollToValue } from '/src/scene/scrollState.js';   // NEU: scrollToValue für Kontakt-Knopf
import { onFrame } from '/src/scene/stage.js';
import { copies } from '/src/scene/blobField.js';

// --- SCROLL-SPERRE während der Intro-Animation ---
let scrollLocked = true;

function blockScroll(e) {
  if (scrollLocked) {
    e.preventDefault();
    e.stopImmediatePropagation();
//    window.dispatchEvent(new Event('skip-intro'));   // AUSKOMMENTIERT: Intro ist nicht mehr per Scroll überspringbar
  }
}

window.addEventListener('wheel', blockScroll, { passive: false, capture: true });
window.addEventListener('touchmove', blockScroll, { passive: false, capture: true });
window.addEventListener('keydown', (e) => {
  if (!scrollLocked) return;
  const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '];
  if (keys.includes(e.key)) e.preventDefault();
}, { capture: true });

// --- DOM-Referenzen ---
const scrollHint = document.getElementById('scroll-hint');
const scrollDot  = document.getElementById('scroll-dot');
const carousel   = document.getElementById('carousel');
const track      = document.getElementById('carousel-track');
const contact    = document.getElementById('contact');   // NEU: Kontaktseite nach dem Karussell

const BASE = import.meta.env.BASE_URL;

/* ALT: Titelbilder statt Videos
const PROJECTS = [
  
  { num: 'Web', 
    name: 'Varia Bella', 
    desc: 'Eine kreative und persönliche Splashpage, die dieses Webportfolio einleitet. Gebaut mit Three.js und GSAP.', 
    color: '#cdd3d8', 
    img: `${BASE}pics/Webportfolio_Titelbild.png`,
    href: `${BASE}projekte/01Webportfolio.html` },
  
  { num: 'UX', 
    name: 'HSLU Companion', 
    desc: 'Der treue Begleiter durch den Studienalltag an der HSLU.', 
    color: '#d8d3cc', 
    img: `${BASE}pics/HSLUCompanion/HSLUDash.png`,
    href: `${BASE}projekte/02HSLUCompanion.html`,
    scaleBoost: 1.5 },  

  { num: 'UX/Web', 
    name: 'Didaktikus', 
    desc: 'Ein KI-Agent für Lehrpersonen, konzipiert für die Unterrichtsplanung nach dem Lehrplan 21.', 
    color: '#d3ccd8', 
    img: `${BASE}pics/didaktikus_1024.png`,
    href: `${BASE}projekte/03Didaktikus.html` },

    { num: 'Pädagogik', 
    name: 'Lernmaterial', 
    desc: 'Unterrichtsmaterial und didaktische Konzepte, um differenzierten Unterricht auf der Sekundarstufe I zu ermöglichen.', 
    color: '#d3ccd8', 
    img: `${BASE}pics/Unterricht/muffo.png`,
    href: `${BASE}projekte/04Unterricht.html` },
];
*/

// NEU: Device-Videos wie auf den Projektseiten (kurze, komprimierte Loops in public/vid/carousel/)
//      poster = Standbild, solange das Video nicht läuft · tags = kleine Infos unter dem Namen
//      mask   = Umriss des Geräts (PNG mit Transparenz) → nur Laptop/Handy/Blatt sind sichtbar, kein Crème-Rechteck
const PROJECTS = [

  { num: 'Web',
    name: 'Varia Bella',
    desc: 'Eine kreative und persönliche Splashpage, die dieses Webportfolio einleitet. Gebaut mit Three.js und GSAP.',
//    tags: ['Three.js', 'GSAP', 'Blender', '2026'],
    tags: ['Three.js', 'GSAP', 'Blender'],
    year: '2026',                                         // NEU: Jahr steht als Text unter der Beschreibung
    video:  `${BASE}vid/carousel/carousel_variabella.mp4`,
    poster: `${BASE}vid/carousel/carousel_variabella.webp`,
    mask:   `${BASE}vid/carousel/carousel_variabella_mask.png`,      // Form des Geräts → Hintergrund wird transparent
    href: `${BASE}projekte/01Webportfolio.html` },

  { num: 'UX',
    name: 'HSLU Companion',
    desc: 'Der treue Begleiter durch den Studienalltag an der HSLU.',
//    tags: ['Figma', 'Befragung', 'Testing', '2025'],
    tags: ['Figma', 'Befragung', 'Testing'],
    year: '2025',                                         // NEU: Jahr steht als Text unter der Beschreibung
    video:  `${BASE}vid/carousel/carousel_hslu.mp4`,
    poster: `${BASE}vid/carousel/carousel_hslu.webp`,
    mask:   `${BASE}vid/carousel/carousel_hslu_mask.png`,      // Form des Geräts → Hintergrund wird transparent
    href: `${BASE}projekte/02HSLUCompanion.html` },

  { num: 'UX/Web',
    name: 'Didaktikus',
    desc: 'Ein KI-Agent für Lehrpersonen, konzipiert für die Unterrichtsplanung nach dem Lehrplan 21.',
//    tags: ['Claude', 'Bun Server', '2026'],
    tags: ['Claude', 'Bun Server'],
    year: '2026',                                         // NEU: Jahr steht als Text unter der Beschreibung
    video:  `${BASE}vid/carousel/carousel_didaktikus.mp4`,
    poster: `${BASE}vid/carousel/carousel_didaktikus.webp`,
    mask:   `${BASE}vid/carousel/carousel_didaktikus_mask.png`,      // Form des Geräts → Hintergrund wird transparent
    href: `${BASE}projekte/03Didaktikus.html` },

  { num: 'Pädagogik',
    name: 'Lernmaterial',
    desc: 'Unterrichtsmaterial und didaktische Konzepte, um differenzierten Unterricht auf der Sekundarstufe I zu ermöglichen.',
//    tags: ['OneNote', 'Canva', 'Word', '2024/25'],
    tags: ['OneNote', 'Canva', 'Word'],
    year: '2024/25',                                         // NEU: Jahr steht als Text unter der Beschreibung
//    video:  `${BASE}vid/carousel/carousel_lernmaterial.mp4`,
//    poster: `${BASE}vid/carousel/carousel_lernmaterial.webp`,
//    mask:   `${BASE}vid/carousel/carousel_lernmaterial_mask.png`,
    // NEU: statt Video wechseln drei Beispiele (jedes in seiner eigenen Form, Muffo quadratisch)
    slides: [
      `${BASE}vid/carousel/carousel_lern_variablen.webp`,
      `${BASE}vid/carousel/carousel_lern_laengen.webp`,
      `${BASE}vid/carousel/carousel_lern_muffo.webp`,
    ],
    href: `${BASE}projekte/04Unterricht.html` },
];

const N = PROJECTS.length;

// --- State ---
let isExiting = false;
let carouselAnim   = 0;
let carouselTarget = 0;
let carouselActive = false;

// --- Blob-Titel entfernen, Info-Block rechts neben der Karte ---
const infoBlock = document.createElement('div');
infoBlock.id = 'carousel-info';
carousel.appendChild(infoBlock);

// --- Scrollfortschritt-Punkte ---
const dotsWrap = document.createElement('div');
dotsWrap.id = 'carousel-dots';
carousel.appendChild(dotsWrap);
const dots = PROJECTS.map((_, i) => {
//  const d = document.createElement('div');
  const d = document.createElement('button');            // NEU: Punkte sind klickbar
  d.type = 'button';
  d.className = 'carousel-dot';
  d.setAttribute('aria-label', `Projekt ${i + 1}: ${PROJECTS[i].name}`);
  d.addEventListener('click', () => goToProject(i));     // NEU: direkt zum Projekt springen
  dotsWrap.appendChild(d);
  return d;
});

// NEU: zu einem Projekt scrollen (Projekt i liegt bei scroll.y = 1 + 0.6 · i)
function goToProject(i) {
  const idx = Math.max(0, Math.min(N - 1, i));
  scrollToValue(1 + idx * 0.6, 1.0);
}

let infoIdx = -1;                                         // NEU: Info nur neu aufbauen, wenn das Projekt wechselt
function updateInfo(idx, frac) {
  const p = PROJECTS[idx];
  infoBlock.style.opacity = String(Math.max(0, 1 - frac * 4));
  if (idx === infoIdx) return;
  infoIdx = idx;
  infoBlock.innerHTML = `
    <span class="info-num">${p.num}</span>
    <h2 class="info-name">${p.name}</h2>
    <div class="info-tags">${(p.tags || []).map(t => `<span class="info-tag">${t}</span>`).join('')}</div>
    <p class="info-desc">${p.desc}</p>
    ${p.year ? `<span class="info-year">${p.year}</span>` : ''}
  `;   // NEU: Tags direkt unter dem Titel, Jahr als Text unter der Beschreibung
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function layoutCards(ca) {
  cards.forEach((card, i) => {
    const rel = i - ca;
    const abs = Math.abs(rel);

//    if (abs > 1.2) {
    if (abs > 1.6) {                                       // NEU: Nachbarn bleiben länger sichtbar
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      setPlaying(card, false);
      return;
    }

    const boost   = PROJECTS[i].scaleBoost || 1;   // ← neu: Standard 1, falls nicht gesetzt
//    const z       = rel < 0 ? 0 : -300 * rel;
//    const scale   = (1 - Math.max(0, rel) * 0.28) * boost;   // ← boost einmultipliziert
//    const opacity = rel < 0
//      ? Math.max(0, 1 + rel * 4)
//      : Math.max(0, 1 - rel * 1.2);
//
//    card.style.transform     = `translateZ(${z}px) scale(${scale})`;
//    card.style.opacity       = String(opacity);

    // NEU: horizontal drehen – die aktive Karte dreht sich nach links weg,
    // die nächste dreht sich von rechts herein (Drehung um die senkrechte Achse)
    const w       = card.offsetWidth || 300;
//    const x       = rel * w * 0.9;                          // seitlich verschieben
//    const rotY    = -rel * 60;                              // um die senkrechte Achse drehen (Grad)
//    const z       = -Math.abs(rel) * 260;                   // nach hinten wegrücken
//    const scale   = boost;
//    const opacity = Math.max(0, 1 - abs * 1.3);             // nur während der Drehung sichtbar
    // NEU: Nachbarn schauen links und rechts hinter der aktiven Karte hervor
    const x       = rel * w * 0.7;                          // seitlich verschieben, so dass sie neben dem aktiven Device hervorschauen
    const rotY    = -rel * 50;                              // um die senkrechte Achse drehen (Grad)
    const z       = -Math.abs(rel) * 520;                   // weiter nach hinten → kleiner
    const scale   = 1;                                      // Videos haben alle denselben Rahmen → kein Boost nötig
    const opacity = abs < 1 ? 1 - abs * 0.65 : Math.max(0, 0.35 - (abs - 1) * 1.0);   // Nachbarn halb transparent

    card.style.transform     = `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
    card.style.opacity       = String(opacity);
//    card.style.pointerEvents = (carouselActive && abs < 0.3) ? 'auto' : 'none';
    card.style.pointerEvents = (carouselActive && (abs < 0.3 || Math.abs(abs - 1) < 0.3)) ? 'auto' : 'none';   // NEU: Nachbarn anklickbar
    card.classList.toggle('is-neighbour', abs >= 0.5);
    setPlaying(card, carouselActive && abs < 0.3);          // NEU: nur das aktive Video läuft
    card.style.zIndex        = String(Math.round(100 - abs * 10));
  });

  const activeIdx = Math.min(N - 1, Math.max(0, Math.round(ca)));
  const frac = Math.abs(ca - activeIdx);
  updateInfo(activeIdx, frac);
}

function playExitAnimation(href, cardElement) {
  isExiting = true;

  cards.forEach((c) => {
    c.style.pointerEvents = 'none';
    c.style.cursor = 'default';
  });

  const tl = gsap.timeline({
    onComplete: () => { window.location.href = href; }
  });

  copies.forEach((blob) => {
    tl.to(blob.position, {
      x: blob.userData.baseX + blob.userData.driftX * 6,
      y: blob.userData.baseY + blob.userData.driftY * 6,
      duration: 0.6,
      ease: 'power2.in',
    }, 0);
    tl.to(blob.scale, {
      x: 0, y: 0, z: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 0.1);

    if (blob.userData.shadow) {
      tl.to(blob.userData.shadow.position, {
        x: blob.userData.baseX + blob.userData.driftX * 6,
        y: blob.userData.baseY + blob.userData.driftY * 6,
        duration: 0.6,
        ease: 'power2.in',
      }, 0);
      tl.to(blob.userData.shadow.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.5,
        ease: 'power2.in',
      }, 0.1);
    }
  });

  tl.to(cardElement, {
    scale: 1.12, opacity: 0,
    duration: 1.0, ease: 'power2.in',
  }, 0);

  tl.to('#carousel-info', { opacity: 0, duration: 0.3 }, 0);
  tl.to('#carousel-dots', { opacity: 0, duration: 0.3 }, 0);
}

const cards = PROJECTS.map((p, i) => {
  const card = document.createElement('div');
  card.className = 'proj-card';
  card.style.pointerEvents = 'none'; 

//if (p.img) {
//    card.style.backgroundImage = `url(${p.img})`;
//} else {
//    card.style.background = p.color;
//}
// NEU: Video statt Titelbild. Quelle wird erst gesetzt, wenn man zum Karussell kommt (loadVideos)
if (p.slides) {
  // NEU: Lernmaterial – Bilder, die per CSS ineinander überblenden (styles.css: .proj-slide)
  const wrap = document.createElement('div');
  wrap.className = 'proj-slides';
  card._slides = p.slides.map((src, k) => {
    const img = document.createElement('img');
    img.className = 'proj-slide';
    img.alt = `${p.name} – Beispiel ${k + 1}`;
    img.decoding = 'async';
    wrap.appendChild(img);
    return img;
  });
  card.appendChild(wrap);
} else {
const video = document.createElement('video');
video.className = 'proj-video';
video.muted = true;
video.loop = true;
video.playsInline = true;
video.preload = 'none';
video.setAttribute('aria-label', `${p.name} – Vorschau`);
card.appendChild(video);
card._video = video;
}

card.addEventListener('click', () => {
  // NEU: Klick auf ein Nachbarprojekt dreht das Karussell dorthin
  if (Math.abs(carouselAnim - i) >= 0.3) { goToProject(i); return; }
  if (Math.abs(carouselAnim - i) < 0.3) {
    console.log('scroll.y vor Animation:', scroll.y);
    sessionStorage.setItem('scrollY', scroll.y.toString());
    playExitAnimation(p.href, card);
  }
});

  track.appendChild(card);
  return card;
});

// NEU: Videos erst laden, wenn das Karussell zum ersten Mal sichtbar wird (Titelseite bleibt schnell)
let videosLoaded = false;
function loadVideos() {
  if (videosLoaded) return;
  videosLoaded = true;
  cards.forEach((card, i) => {
    if (card._slides) {                                   // NEU: Bilder erst jetzt laden
      card._slides.forEach((img, k) => { img.src = PROJECTS[i].slides[k]; });
      return;
    }
    const v = card._video;
    // NEU: Maske in der Form des Geräts – schneidet den Crème-Hintergrund der Videos weg
    v.style.webkitMaskImage = `url(${PROJECTS[i].mask})`;
    v.style.maskImage       = `url(${PROJECTS[i].mask})`;
    v.poster = PROJECTS[i].poster;
    v.src    = PROJECTS[i].video;
  });
}

// NEU: Video nur abspielen, wenn die Karte aktiv ist
function setPlaying(card, on) {
  card.classList.toggle('is-playing', on);              // NEU: steuert auch den Bilder-Wechsel (CSS)
  const v = card._video;
  if (!v || !videosLoaded) return;
  if (on && v.paused) v.play().catch(() => {});
  if (!on && !v.paused) v.pause();
}

// NEU: Pfeiltasten – links/rechts (oder hoch/runter) wechseln das Projekt
window.addEventListener('keydown', (e) => {
  if (scrollLocked || isExiting) return;
  const next = e.key === 'ArrowRight' || e.key === 'ArrowDown';
  const prev = e.key === 'ArrowLeft'  || e.key === 'ArrowUp';
  if (!next && !prev) return;
  const contactStart = 1 + (N - 1) * 0.6 + 0.45;
  if (scroll.y > contactStart) {                         // auf der Kontaktseite: zurück zum letzten Projekt
    if (prev) { e.preventDefault(); goToProject(N - 1); }
    return;
  }
  e.preventDefault();
  if (scroll.y < 0.6) {                                  // auf der Titelseite: zum ersten Projekt
    if (next) goToProject(0);
    return;
  }
  const idx = Math.round(carouselAnim);
  if (next && idx === N - 1) { scrollToValue(contactStart + 0.45, 1.2); return; }   // nach dem letzten → Kontakt
  if (prev && idx === 0)     { scrollToValue(0, 1.2); return; }                    // vor dem ersten → Titelseite
  goToProject(idx + (next ? 1 : -1));
});

// NEU: Kontakt-Knopf oben (index.html) → weich ans Ende zur Kontaktseite scrollen
document.getElementById('contact-jump')?.addEventListener('click', (e) => {
  e.preventDefault();
  const contactEnd = 1 + (N - 1) * 0.6 + 0.45 + 0.4;   // = contactStart + volle Einblendung
  scrollToValue(contactEnd + 0.05);
});

onScrollEnabled(() => {
  scrollLocked = false;
  scrollHint?.classList.add('is-ready');

  onFrame(() => {
    if (isExiting) return;
    if (scrollDot) {
      scrollDot.style.opacity = String(Math.max(0, 1 - scroll.y * 6));
    }
    if (scrollHint) {
      scrollHint.classList.toggle('is-hidden', scroll.y > 0.02);
    }

    const carouselProgress = Math.min(1, Math.max(0, (scroll.y - 0.6) / 0.4));
    if (scroll.y > 0.3) loadVideos();                     // NEU: Videos kurz vor dem Karussell laden
//    carousel.style.opacity = String(carouselProgress);
//    carouselActive = carouselProgress > 0.1;

    // NEU: KONTAKT – nach dem letzten Projekt weiterscrollen → Karussell blendet aus, Kontakt ein
    const contactStart    = 1 + (N - 1) * 0.6 + 0.45;                                   // kurz nach dem letzten Projekt
    const contactProgress = Math.min(1, Math.max(0, (scroll.y - contactStart) / 0.4));
    carousel.style.opacity = String(carouselProgress * (1 - contactProgress));
    carouselActive = carouselProgress > 0.1 && contactProgress < 0.5;
    if (contact) {
      contact.style.opacity       = String(contactProgress);
      contact.style.transform     = `translateY(${(1 - contactProgress) * 40}px)`;
      contact.style.pointerEvents = contactProgress > 0.6 ? 'auto' : 'none';
    }

    const carouselScroll = Math.max(0, scroll.y - 1);

    const raw = carouselScroll / 0.6;
    const nearestProject = Math.round(raw);
    const distToNearest = raw - nearestProject;
    const deadZone = 1.5;

    let mapped;
    if (Math.abs(distToNearest) < deadZone) {
    mapped = nearestProject + distToNearest * 0.01;
    } else {
    const sign = distToNearest > 0 ? 1 : -1;
    mapped = nearestProject + sign * (deadZone * 0.15 + (Math.abs(distToNearest) - deadZone) * 5);
    }
    carouselTarget = Math.max(0, Math.min(N - 1, mapped));

    carouselAnim += (carouselTarget - carouselAnim) * 0.07;

    layoutCards(carouselAnim);
  });
});
