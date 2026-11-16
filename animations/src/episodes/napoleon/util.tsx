import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { X, Part, Line, Glow, roundRect, circle, ellipse, blob, poly } from "../../kit";
import type { Pose } from "../../kit/character";
import { Musket, Sabre, worldXY, euroXY, type EURO } from "../../kit/env";
import { GLOVE } from "../../kit/style";

// Shared helpers for the Napoleon shots: held-musket poses, small icons,
// the Louisiana Purchase outline and map/camera helpers.

type P = [number, number];

/** Rotation a held item needs inside the hand so it points at `world` (radians) for a given front-arm pose. */
export const heldRot = (world: number, arm: [number, number]) => world - arm[0] - arm[1];

/** Shoulder arms: musket upright against the shoulder. */
export const SHOULDER_ARMS: [number, number] = [0.12, 2.25];
/** Port arms: musket held diagonally across the chest. */
export const PORT_ARMS: [number, number] = [0.55, 1.55];
/** Aiming: front arm straight forward. */
export const AIM: [number, number] = [1.42, 0.08];

/** A musket in the hand for the front-arm pose `arm`, pointing at world angle `dir`. */
export const HeldMusket: React.FC<{ arm: [number, number]; dir: number; fire?: number; s?: number }> = ({ arm, dir, fire = 0, s = 0.42 }) => (
  <X rot={heldRot(dir, arm)} s={s} x={-30}>
    <Musket fire={fire} />
  </X>
);

/** A sabre in the hand, pointing at world angle `dir` (0 = +x, π/2 = up). */
export const HeldSabre: React.FC<{ arm: [number, number]; dir: number; s?: number }> = ({ arm, dir, s = 0.7 }) => (
  <X rot={heldRot(dir, arm) - Math.PI / 2} s={s} y={6}>
    <Sabre />
  </X>
);

/** Soldier pose with a musket at shoulder arms (slight breathing sway). */
export const shoulderPose = (frame: number, seed = 0): Pose => ({
  armF: [SHOULDER_ARMS[0] + Math.sin(frame * 0.05 + seed) * 0.02, SHOULDER_ARMS[1]],
  armB: [-0.12, 0.2],
  handF: "fist",
});

/** Aiming pose. */
export const aimPose = (frame: number, shake = 0): Pose => ({
  armF: [AIM[0] + Math.sin(frame * 1.7) * 0.01 * shake, AIM[1]],
  armB: [1.15, 0.75],
  handF: "fist",
  handB: "fist",
  lean: 0.05,
});

/** Arms spread wide (opening the coat, "here I am"). `k` 0..1. */
export const openArms = (k: number, frame = 0): Pose => ({
  armF: [0.15 + 1.05 * k + Math.sin(frame * 0.1) * 0.02 * k, 0.1 + 0.2 * k],
  armB: [-0.15 - 1.05 * k - Math.sin(frame * 0.1 + 1) * 0.02 * k, -0.1 - 0.2 * k],
  headTilt: -0.04 * k,
});

/** Raised sabre (officer giving the order). */
export const SABRE_UP: [number, number] = [2.3, 0.6];

/** Floating hearts (romance). */
export const Hearts: React.FC<{ n?: number; w?: number; h?: number; x?: number; y?: number; z?: number; seed?: number }> = ({ n = 6, w = 400, h = 500, x = 0, y = 0, z = 0, seed = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} z={z}>
      {Array.from({ length: n }, (_, i) => {
        const p = ((frame * 0.012 + i / n + seed * 0.13) % 1);
        const hx = Math.sin(i * 2.3 + seed) * w * 0.5 + Math.sin(frame * 0.08 + i) * 20;
        const s = 0.6 + (i % 3) * 0.25;
        return (
          <X key={i} x={hx} y={p * h} s={s * Math.min(1, p * 6) * (1 - Math.max(0, p - 0.8) * 5)}>
            <Part shape={blob([[0, -40], [36, -4], [40, 24], [20, 36], [0, 22], [-20, 36], [-40, 24], [-36, -4]], 8)} color="#e2574a" shade={0.2} />
          </X>
        );
      })}
    </X>
  );
};

/** Big mitten glove gripping a stock, index finger reaching forward (+x) onto a trigger. */
export const TriggerHand: React.FC<{ x?: number; y?: number; s?: number; z?: number; squeeze?: number }> = ({ x = 0, y = 0, s = 1, z = 0, squeeze = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(170, 60, 24)} color="#2c4486" shade={0.2} x={-170} y={-40} rot={-0.15} z={-0.01} />
    <Part shape={roundRect(30, 70, 10)} color="#c8262f" flat outline={4} x={-96} y={-36} rot={-0.15} z={-0.005} />
    <Part shape={blob([[-80, -90], [40, -96], [80, -50], [70, 10], [10, 30], [-70, 10]], 10)} color={GLOVE} shade={0.24} />
    <X x={56} y={-28} rot={-0.15 - squeeze * 0.45} z={0.01}>
      <Part shape={roundRect(110, 34, 17)} color={GLOVE} shade={0.24} x={50} />
    </X>
  </X>
);

/** Red heartbeat pulse ring (tension). */
export const Pulse: React.FC<{ t: number; bpm?: number; r?: number; z?: number }> = ({ t, bpm = 120, r = 900, z = 5 }) => {
  const ph = (t * bpm) / 60;
  const k = Math.pow(Math.max(0, Math.sin(ph * Math.PI * 2)), 8);
  return <Glow rx={r} color="#c8262f" alpha={0.18 * k} additive z={z} />;
};

/** Approximate Louisiana Purchase outline (lon, lat): Mississippi to the Rockies. */
export const LOUISIANA: P[] = [
  [-89.6, 29.0], [-90.6, 31.0], [-91.2, 33.0], [-90.1, 35.2], [-89.4, 37.0], [-90.4, 38.8], [-91.5, 40.6], [-91.2, 42.6], [-92.0, 44.6], [-93.5, 45.6], [-95.2, 47.3], [-95.2, 49.0],
  [-104.0, 49.0], [-113.5, 49.0], [-113.0, 47.5], [-111.5, 45.6], [-110.5, 43.5], [-107.5, 42.0], [-106.0, 40.0], [-105.5, 38.0], [-104.5, 37.0], [-103.0, 36.5],
  [-100.0, 36.5], [-100.0, 34.6], [-97.0, 33.8], [-94.0, 33.6], [-94.0, 31.0], [-93.8, 29.7], [-91.5, 29.3],
];

/** Louisiana overlay on a WorldMap with the same ppd/center. */
export const LouisianaOverlay: React.FC<{ ppd: number; center: P; k?: number; color?: string; z?: number }> = ({ ppd, center, k = 1, color = "#e2b23c", z = 0.04 }) => {
  if (k <= 0.01) return null;
  const ring = LOUISIANA.map(([lon, lat]) => worldXY(lon, lat, ppd, center));
  return (
    <X z={z}>
      <Part shape={poly(ring)} color={color} flat outline={6} opacity={Math.min(1, k) * 0.85} />
    </X>
  );
};

/** Euro place → map px for the MapBack defaults. */
export const eu = (p: P, ppd = 40, center: P = [12, 47]) => euroXY(p[0], p[1], ppd, center);

/** Smoothly eased value between keyframes [t, v]. */
export const keys = (t: number, kf: [number, number][]) =>
  interpolate(t, kf.map((k) => k[0]), kf.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Little throne icon (for "take back his throne"). */
export const ThroneIcon: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={blob([[-70, 0], [70, 0], [66, 200], [0, 230], [-66, 200]], 8)} color="#d8a93a" shade={0.25} />
    <Part shape={blob([[-46, 60], [46, 60], [42, 190], [0, 206], [-42, 190]], 8)} color="#9a1f35" shade={0.2} z={0.001} />
    <Part shape={roundRect(170, 40, 14)} color="#9a1f35" shade={0.2} y={50} z={0.002} />
  </X>
);

/** Marker for map labels: returns the screen fraction of a map point given the stage camera. */
export const mapScr = (pt: P, cam: { zoom: number; x?: number; y?: number }) => ({ x: 0.5 + ((pt[0] - (cam.x ?? 0)) * cam.zoom) / 1920, y: 0.5 - ((pt[1] - (cam.y ?? 0)) * cam.zoom) / 1080 });

export type { P as Pt };
export const _unused = { circle, ellipse, Line };
export type EuroKey = keyof typeof EURO;

/** Rough outline of the United States in 1803 (east of the Mississippi), lon/lat. */
export const US_1803: P[] = [
  [-67.0, 44.8], [-70.0, 45.3], [-71.5, 45.0], [-75.0, 45.0], [-79.0, 43.4], [-83.0, 42.0], [-82.5, 45.4], [-84.6, 46.5], [-89.0, 48.0], [-95.2, 49.0], [-95.2, 47.3],
  [-93.5, 45.6], [-92.0, 44.6], [-91.2, 42.6], [-91.5, 40.6], [-90.4, 38.8], [-89.4, 37.0], [-90.1, 35.2], [-91.2, 33.0], [-91.4, 31.0], [-88.0, 31.0], [-85.0, 31.0],
  [-82.0, 30.6], [-81.4, 30.8], [-80.8, 32.0], [-78.0, 33.9], [-75.6, 35.4], [-76.0, 37.0], [-74.0, 40.0], [-71.0, 41.4], [-70.0, 41.8], [-70.2, 43.6],
];

/** A polygon overlay on a WorldMap with the same ppd/center. */
export const WorldOverlay: React.FC<{ ring: P[]; ppd: number; center: P; k?: number; color?: string; z?: number }> = ({ ring, ppd, center, k = 1, color = "#3f8a5a", z = 0.04 }) => {
  if (k <= 0.01) return null;
  return (
    <X z={z}>
      <Part shape={poly(ring.map(([lon, lat]) => worldXY(lon, lat, ppd, center)))} color={color} flat outline={6} opacity={Math.min(1, k) * 0.85} />
    </X>
  );
};
