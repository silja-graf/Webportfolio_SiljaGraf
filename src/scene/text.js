import { Text } from 'troika-three-text';
import { scene } from './stage.js';

//Loading text into the scene
const text = new Text();
text.text = 'VARIA BELLA';
text.font = '/fonts/Outfit-Black.ttf';  // load font
text.fontSize = 4;
text.position.set(0, 0, -12);   // behind the blob's back (blob reaches ~ -11)
text.color = 0x000000;
text.anchorX = 'center';
text.anchorY = 'middle';
text.position.set(0, 0, -1);   // behind the blob (blob is at z = 0)
text.sync();                   // builds the text — must call after setting props
scene.add(text);
text.sdfGlyphSize = 128;   // default 64 → schärfere Kanten
text.sync();