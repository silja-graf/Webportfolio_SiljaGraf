# Webportfolio – Silja Graf

Ein animiertes Webportfolio, gebaut mit **Three.js**, **GSAP** und **Vite**.

🔗 **Live:** [siljagraf.ch](https://siljagraf.ch)

---

## Voraussetzungen

- [Node.js](https://nodejs.org) (Version 18 oder höher)
- npm (wird mit Node.js mitinstalliert)

## Installation

```bash
git clone https://github.com/silja-graf/Webportfolio_SiljaGraf.git
cd Webportfolio_SiljaGraf
npm install
```

## Lokal starten

```bash
npm run dev
```

Die Seite ist danach unter `http://localhost:5173` erreichbar.

## Build erstellen

```bash
npm run build
```

Der fertige Build landet im Ordner `dist/`.

---

## Tech Stack

- **Three.js** – 3D-Rendering, Glas-Material, Blob-Animation
- **GSAP** – Timeline-Animationen, Scroll-Choreografie
- **Vite** – Build-Tool & Dev-Server

## Struktur

```
├── public/           # statische Assets (Bilder, Fonts, Projektseiten)
│   ├── pics/
│   ├── fonts/
│   ├── vid/
│   └── projekte/     # einzelne Projekt-Unterseiten
├── src/
│   ├── scene/         # Three.js-Module (Blob, Text, Scroll)
│   ├── carousel.js     # Karussell-Logik
│   ├── timeline.js      # GSAP-Intro-Timeline
│   └── main.js
└── index.html
```

---

## Deployment

Die Seite wird automatisch via **GitHub Actions** auf **GitHub Pages** deployed, sobald auf `main` gepusht wird. Die eigene Domain ist über eine `CNAME`-Datei in `public/` verknüpft.
