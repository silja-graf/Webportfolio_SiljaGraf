import { MeshTransmissionMaterial } from '@pmndrs/vanilla';
import * as THREE from 'three';

//Mesh Material
export const glassMaterial = new MeshTransmissionMaterial();
glassMaterial.color = new THREE.Color(0xffffff);
glassMaterial.transparent = 0;
glassMaterial.thickness = 2;                // how much it bends light through
glassMaterial.roughness = 0;                // 0 = clear, higher = frosted
glassMaterial.ior = 1.5;                    // glass ≈ 1.5
glassMaterial.chromaticAberration = 1;      // the rainbow edges
glassMaterial.anisotropicBlur = 0.5;
glassMaterial.distortion = 0.2;             // the wobble
glassMaterial.distortionScale = 0.5;
glassMaterial.temporalDistortion = 0.4;     // makes the wobble move over time