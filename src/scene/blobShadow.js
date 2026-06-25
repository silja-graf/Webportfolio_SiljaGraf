import * as THREE from 'three';

// --- EINSTELLUNGSWERTE ---//
const SETTINGS = {
  lightAngleDeg: 100,   // woher das Licht kommt (135 = oben-links) → Schatten gegenüber
  offset:        0.07,  // wie weit der Schatten versetzt ist
  chroma:        1.7,   // chromatische Aufspaltung (höher = farbiger)
  softness:      0.35,  // Weichheit/Verlauf
  intensity:     0.8,   // Deckkraft (subtil halten)
  sizeFactor:    1,     // Größe der Schatten-Plane relativ zum Blob-Radius
};

// Schatten-Richtung: entgegengesetzt zum Licht (einmal berechnet, geteilt)
const lightA = SETTINGS.lightAngleDeg * Math.PI / 180;
const shadowDir = new THREE.Vector2(-Math.cos(lightA), -Math.sin(lightA));

// erzeugt eine chromatische Schatten-Plane für einen Blob mit Radius r
export function makeBlobShadow(r) {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uDir:       { value: shadowDir.clone() },
      uOffset:    { value: SETTINGS.offset },
      uChroma:    { value: SETTINGS.chroma },
      uSoftness:  { value: SETTINGS.softness },
      uIntensity: { value: 1 },   // startet unsichtbar → Timeline blendet ein
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
    `,
    fragmentShader: `
      uniform vec2 uDir; uniform float uOffset; uniform float uChroma;
      uniform float uSoftness; uniform float uIntensity;
      varying vec2 vUv;
      float disc(vec2 p, float soft){
        float d = length(p);
        return smoothstep(0.28, 0.28 - soft, d);
      }
      void main(){
        vec2 p = vUv - 0.5;
        vec2 sh = uDir * uOffset;
        float r = disc(p - sh * (1.0 + uChroma), uSoftness);
        float g = disc(p - sh, uSoftness);
        float b = disc(p - sh * (1.0 - uChroma), uSoftness);
        float body = disc(p, uSoftness * 0.5);
        vec3 col = vec3(r, g, b) * (1.0 - body);
        float a = max(col.r, max(col.g, col.b)) * uIntensity;
        gl_FragColor = vec4(col, a);
      }
    `,
  });

  const size = r * SETTINGS.sizeFactor * 2.5;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  mesh.position.z = -0.2;   // leicht hinter dem Blob
  return mesh;
}

export const shadowTargetIntensity = SETTINGS.intensity;   // Hilfswert fürs Einblenden