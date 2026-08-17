import { gsap } from 'gsap';
import { scroll, onScrollEnabled } from '/src/scene/scrollState.js';
import { onFrame } from '/src/scene/stage.js';
import { copies } from '/src/scene/blobField.js';

// --- SCROLL-SPERRE während der Intro-Animation ---
let scrollLocked = true;

function blockScroll(e) {
  if (scrollLocked) {
    e.preventDefault();
    e.stopImmediatePropagation();
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

const PROJECTS = [
  { num: 'UX', 
    name: 'HSLU Companion', 
    desc: 'Der treue Begleiter durch den Studienalltag an der HSLU.', 
    color: '#d8d3cc', 
    img: '/pics/HSLUCompanion/HSLUDash.png',
    href: '/projekte/01HSLUCompanion.html' },


  { num: 'Web', 
    name: 'Webportfolio', 
    desc: 'Ein kreatives Webportfolio, welches als Ausstellungsraum meiner besten Arbeiten dient.', 
    color: '#cdd3d8', 
    img: 'public/pics/Webportfolio_Titelbild.png',
    href: '/projekte/02Webportfolio.html' },

  { num: 'UX/Web', 
    name: 'Didaktikus', 
    desc: 'Ein KI-Agent für Lehrpersonen, konzipiert für die Unterrichtsplanung nach dem Lehrplan 21.', 
    color: '#d3ccd8', 
    img: 'public/pics/didaktikus_1024.png',
    href: '/projekte/03Didaktikus.html' },

    { num: 'UX', 
    name: 'Sekundarstufe I', 
    desc: 'Selbsterstelltes Unterrichtsmaterial und didaktische Konzepte, um differenzierten Unterricht auf der Sekundarstufe I zu ermöglichen.', 
    color: '#d3ccd8', 
    img: 'public/pics/Unterricht/muffo.png',
    href: '/projekte/04Unterricht.html' },
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
  const d = document.createElement('div');
  d.className = 'carousel-dot';
  dotsWrap.appendChild(d);
  return d;
});

function updateInfo(idx, frac) {
  const p = PROJECTS[idx];
  infoBlock.style.opacity = String(Math.max(0, 1 - frac * 4));
  infoBlock.innerHTML = `
    <span class="info-num">${p.num}</span>
    <h2 class="info-name">${p.name}</h2>
    <p class="info-desc">${p.desc}</p>
  `;
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function layoutCards(ca) {
  cards.forEach((card, i) => {
    const rel = i - ca;
    const abs = Math.abs(rel);

    if (abs > 1.2) {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      return;
    }

    const z       = rel < 0 ? 0 : -300 * rel;
    const scale   = 1 - Math.max(0, rel) * 0.28;
    const opacity = rel < 0
      ? Math.max(0, 1 + rel * 4)
      : Math.max(0, 1 - rel * 1.2);

    card.style.transform     = `translateZ(${z}px) scale(${scale})`;
    card.style.opacity       = String(opacity);
    card.style.pointerEvents = (carouselActive && abs < 0.3) ? 'auto' : 'none';
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

if (p.img) {
    card.style.backgroundImage = `url(${p.img})`;
} else {
    card.style.background = p.color;
}

card.addEventListener('click', () => {
  if (Math.abs(carouselAnim - i) < 0.3) {
    console.log('scroll.y vor Animation:', scroll.y);
    sessionStorage.setItem('scrollY', scroll.y.toString());
    playExitAnimation(p.href, card);
  }
});

  track.appendChild(card);
  return card;
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
    carousel.style.opacity = String(carouselProgress);
    carouselActive = carouselProgress > 0.1;

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