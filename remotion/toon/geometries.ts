import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const cache = new Map<string, THREE.BufferGeometry>();
const cached = <T extends THREE.BufferGeometry>(key: string, make: () => T): T => {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g as T;
};

/** Smooth-normal geometries only: the inverted-hull outline needs continuous normals. */
export const geo = {
  sphere: () => cached("sphere", () => new THREE.SphereGeometry(1, 40, 28)),
  sphereLo: () => cached("sphereLo", () => new THREE.SphereGeometry(1, 18, 12)),
  /** Top cap of a unit sphere, used for caps and helmets. */
  dome: (theta = 1.2) =>
    cached(`dome${theta}`, () => new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, theta)),
  capsule: (r: number, len: number) =>
    cached(`cap${r}|${len}`, () => new THREE.CapsuleGeometry(r, len, 8, 20)),
  torus: (r: number, tube: number) =>
    cached(`torus${r}|${tube}`, () => new THREE.TorusGeometry(r, tube, 12, 48)),
  box: (w: number, h: number, d: number, r: number) =>
    cached(`box${w}|${h}|${d}|${r}`, () => new RoundedBoxGeometry(w, h, d, 4, r)),
  plane: (w: number, h: number) => cached(`plane${w}|${h}`, () => new THREE.PlaneGeometry(w, h)),
};
