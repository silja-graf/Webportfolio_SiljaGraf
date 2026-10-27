# Kürzel – Zusammenarbeit mit Claude

Format: **`[ORT] [BEFEHL]: Details`**
Beispiele: `P2 TEXT: Absatz 2 kürzen` · `BLOB ANIM −` · `P* MOBIL FIX: Bilder zu breit`

## Orte (wo)

| Kürzel | Bedeutung | Datei(en) |
|---|---|---|
| START | Startseite / Gerüst | `index.html`, `src/main.js` |
| SCROLL | Scroll-Ablauf, Timing | `src/timeline.js`, `src/scene/scrollState.js` |
| BÜHNE | Kamera, Licht, Renderer | `src/scene/stage.js`, `src/scene/materials.js` |
| BLOB | Glas-Blob (einzeln) | `src/scene/blob.js`, `public/assets/GlassBlob.glb` |
| FELD | mehrere Blobs | `src/scene/blobField.js` |
| SCHATTEN | Blob-Schatten | `src/scene/blobShadow.js` |
| KARUSSELL | Projekt-Auswahl | `src/scene/carousel.js` |
| 3DTEXT | Schrift in der Szene | `src/scene/generateText.js`, `src/scene/writeText.js` |
| STIL | globales CSS | `src/styles/styles.css` |
| P1 | Webportfolio | `public/projekte/01Webportfolio.*` |
| P2 | HSLU Companion | `public/projekte/02HSLUCompanion.*` |
| P3 | Didaktikus | `public/projekte/03Didaktikus.*` |
| P4 | Unterricht | `public/projekte/04Unterricht.*` |
| P* | alle Projektseiten | |
| RAHMEN | gemeinsames Layout aller P | `public/projekte/00Frame.css` |
| VORLAGE | Projekt-Template | `public/projekte/00Vorolage.html` |

## Befehle (was)

- **FIX** – etwas ist kaputt
- **NEU** – hinzufügen
- **WEG** – entfernen
- **TEXT** – Inhalt ändern
- **LOOK** – Aussehen (Farbe, Grösse, Abstand, Schrift)
- **ANIM** – Bewegung, Timing
- **MEDIA** – Bild/Video einfügen oder tauschen
- **MOBIL** – nur Handy
- **?** – nur erklären, nichts ändern
- **CHECK** – prüfen, Probleme melden

## Zusätze

- **+ / −** – mehr / weniger (`BLOB ANIM −` = langsamer)
- **wie P3** – wie Projektseite 3 machen
- **!** – dringend, nur das, sonst nichts anfassen

## Claudes Antworten

- ✅ erledigt + geänderte Dateien
- ⚠️ Rückfrage
- 🧪 bitte lokal testen (`npm run dev`), bevor du pushst

## Ablauf

1. Claude ändert Dateien lokal – committet und pusht nie.
2. Du prüfst in VS Code / lokal (`npm run dev`).
3. Du committest und pushst in GitHub Desktop → geht online.
