import React from "react";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, poly, roundRect, limb } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";
import { InkLine } from "../props";

// Ocean animals for the blue whale story, all facing +x (flip with sx={-1}).
// Sizes are in px at s=1. The blue whale is the hero rig: swimming tail beat,
// lunge-feeding jaw with a ballooning pleated throat, blow, tag and calf mode.

const INKC = "#211b20";
type P = [number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
/** Round points so animated shapes reuse cached geometry more often. */
const rp = (pts: P[]): P[] => pts.map(([x, y]) => [Math.round(x * 2) / 2, Math.round(y * 2) / 2]);
const rotAbout = ([x, y]: P, [cx, cy]: P, a: number): P => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};
const qbez = (a: P, q: P, b: P, t: number): P => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * q[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * q[1] + t * t * b[1],
];

export type AnimalEyeKind = "open" | "happy" | "closed" | "wide" | "sad";

/** Small cartoon animal eye (sclera, pupil, lid) at the origin. */
export const AnimalEye: React.FC<XProps & { r?: number; kind?: AnimalEyeKind; gaze?: P; lid?: number }> = ({ r = 16, kind = "open", gaze = [0.4, 0.1], lid = 0, ...xf }) => {
  if (kind === "closed" || kind === "happy") {
    const up = kind === "happy" ? 1 : 0.25;
    return (
      <X {...xf}>
        <Line pts={[[-r, 0], [-r * 0.4, r * 0.55 * up], [r * 0.4, r * 0.55 * up], [r, 0]]} smooth width={Math.max(3, r * 0.32)} color={INKC} />
      </X>
    );
  }
  const big = kind === "wide" ? 1.18 : 1;
  const pr = r * (kind === "wide" ? 0.42 : 0.55);
  return (
    <X {...xf}>
      <Part shape={circle(r * big)} color="#fbfbfd" flat outline={Math.max(3, r * 0.22)} />
      <Part shape={circle(pr)} color={INKC} flat outline={0} x={gaze[0] * (r * big - pr) * 0.9} y={gaze[1] * (r * big - pr) * 0.9} z={0.001} />
      <Part shape={circle(pr * 0.32)} color="#ffffff" flat outline={0} x={gaze[0] * (r * big - pr) * 0.9 + pr * 0.35} y={gaze[1] * (r * big - pr) * 0.9 + pr * 0.35} z={0.002} />
      {kind === "sad" || lid > 0 ? (
        <Part
          shape={poly([[-r * 1.3, r * 1.3], [r * 1.3, r * 1.3], [r * 1.3, r * (1.05 - (kind === "sad" ? 0.55 : lid) * 1.6)], [-r * 1.3, r * (1.05 - (kind === "sad" ? 0.35 : lid) * 1.6)]])}
          color="#4f6f92"
          flat
          outline={0}
          z={0.003}
        />
      ) : null}
    </X>
  );
};

// ───────────────────────── blue whale ─────────────────────────

/** Body contour at L=1000 (facing right, snout at +500). */
const BW_TOP: P[] = [[500, 2], [470, 30], [400, 56], [300, 72], [180, 82], [40, 84], [-100, 74], [-220, 56], [-320, 38], [-400, 24], [-470, 13]];
const BW_BELLY: P[] = [[-470, -8], [-400, -22], [-300, -40], [-160, -60], [-40, -68]];
const HINGE: P = [330, -14];
const CHIN: P = [506, -6];
const NAVEL: P = [-40, -66];
const interpY = (pts: P[], x: number) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if ((x <= x0 && x >= x1) || (x >= x0 && x <= x1)) return lerp(y0, y1, (x - x0) / (x1 - x0 || 1));
  }
  return 0;
};

export type BlueWhaleProps = XProps & {
  /** Body length in px. */
  len?: number;
  /** 0 closed … 1 full lunge (jaw dropped ~65°, throat ballooned). */
  mouth?: number;
  /** Swim phase in frames (tail beat); omit to hold still. */
  swim?: number;
  /** Tail beat amplitude multiplier. */
  beat?: number;
  color?: string;
  eye?: AnimalEyeKind;
  gaze?: P;
  /** Suction-cup sensor tag on the back. */
  tag?: boolean;
  /** 0..1 spout from the blowhole. */
  blow?: number;
  /** Rounder calf proportions. */
  calf?: boolean;
  /** Flipper wave (radians). */
  flip?: number;
  /** Draw the krill-filled mouth water (during the lunge). */
  krill?: number;
  seed?: number;
};

export const BlueWhale: React.FC<BlueWhaleProps> = ({
  len = 1000,
  mouth = 0,
  swim,
  beat = 1,
  color = "#5b84ad",
  eye = "open",
  gaze = [0.5, 0.1],
  tag = false,
  blow = 0,
  calf = false,
  flip = 0,
  krill = 0,
  seed = 3,
  ...xf
}) => {
  const ph = swim === undefined ? 0 : swim * 0.11;
  const tail = swim === undefined ? 0 : Math.sin(ph) * 0.2 * beat;
  const bodyRot = swim === undefined ? 0 : Math.sin(ph + 1.2) * 0.012 * beat;
  const m = clamp01(mouth);
  const a = -1.12 * smooth(m);
  const C = rotAbout(CHIN, HINGE, a);
  const lipMid = rotAbout([420, -10], HINGE, a);
  // throat bottom: quadratic from the chin back to the navel, ballooning with the mouth
  const mid: P = [(C[0] + NAVEL[0]) / 2, (C[1] + NAVEL[1]) / 2];
  const Q: P = [mid[0] + 40 * m, mid[1] - 72 - 400 * m];
  const bottom: P[] = Array.from({ length: 9 }, (_, i) => qbez(C, Q, NAVEL, (i + 1) / 10));
  const throat = rp([HINGE, lipMid, C, ...bottom, NAVEL, [60, -48], [200, -30]]);
  const body = rp([...BW_TOP, ...BW_BELLY, NAVEL, [60, -50], [200, -32], HINGE, [420, -8], [490, -4]]);
  const light = mixHex(color, "#ffffff", 0.3);
  const belly = mixHex(color, "#e8eef2", 0.72);
  const throatCol = "#dfe6ec";
  const pleatCol = mixHex("#9fb2c4", "#c77a84", m);
  const r = rng(seed);
  const mottles = Array.from({ length: 46 }, () => {
    const x = -430 + r() * 820;
    const top = interpY(BW_TOP, x) - 10;
    const bot = x < -40 ? interpY(BW_BELLY, x) + 34 : lerp(-50, -14, (x + 40) / 380) + 26;
    return [x, lerp(bot, top, r()), 5 + r() * 11, r() * 3] as [number, number, number, number];
  }).filter(([x, y, rr]) => y - rr > interpY(BW_BELLY, x) + 18 || x > -40);
  // upper top of the open mouth: visible interior between the rostrum and the jaw
  const interior = rp([[498, -2], HINGE, ...[0.25, 0.5, 0.75].map((t) => qbez(HINGE, [440, -40], C, t)), C]);
  const baleen = Array.from({ length: 13 }, (_, i) => {
    const t = (i + 0.5) / 13;
    const x = lerp(338, 488, t);
    const y = lerp(-13, -3, t);
    return [x, y] as P;
  });
  const fluke = (
    <X x={-462} y={2} rot={tail} z={-0.02}>
      <Part shape={blob(rp([[10, 10], [-50, 30], [-130, 92], [-178, 104], [-160, 66], [-110, 24], [-60, 4], [10, -6]]), 8)} color={shadeHex(color, 0.1)} shade={0.25} />
      <Part shape={blob(rp([[10, 8], [-60, -2], [-120, -44], [-176, -86], [-150, -96], [-84, -54], [-30, -24], [10, -12]]), 8)} color={color} shade={0.25} z={0.01} />
      <Part shape={roundRect(70, 30, 14)} color={color} flat outline={0} x={-6} y={1} z={0.02} />
    </X>
  );
  return (
    <X {...xf}>
      <X s={len / 1000} sy={calf ? 1.22 : 1} rot={bodyRot}>
        {fluke}
        {/* dorsal fin (base hidden by the back) */}
        <Part shape={blob([[-290, 30], [-320, 62], [-348, 72], [-352, 56], [-372, 26]], 6)} color={shadeHex(color, 0.06)} shade={0.25} z={-0.01} />
        {/* mouth interior + baleen, under the jaw */}
        {m > 0.02 ? (
          <X z={-0.005}>
            <Part shape={poly(interior)} color="#7a2f3a" flat outline={5} />
            {baleen.map(([x, y], i) => (
              <Part key={i} shape={poly([[x - 5, y], [x + 5, y], [x + 3, y - 34 - m * 30], [x - 6, y - 30 - m * 26]])} color="#4a4048" flat outline={0} z={0.001} />
            ))}
            <Line pts={rp([[336, -12], [488, -2]])} width={8} color="#3a3038" z={0.002} />
            {krill > 0
              ? Array.from({ length: 16 }, (_, i) => {
                  const p = qbez(HINGE, [440, -60], C, (i % 8) / 8 + 0.06);
                  return <Part key={`k${i}`} shape={ellipse(9, 4)} color="#f08068" flat outline={0} opacity={krill} x={p[0] - 30 + (i % 3) * 10} y={p[1] + 18 + Math.floor(i / 8) * 14} rot={i} z={0.003} />;
                })
              : null}
          </X>
        ) : null}
        {/* lower jaw + pleated throat */}
        <X z={0}>
          <Part shape={blob(throat, 6)} color={throatCol} shade={0.22} />
          {m > 0.02 ? <InkLine pts={rp([HINGE, lipMid, C])} width={22} color={shadeHex(color, 0.04)} outline={5} z={0.002} /> : null}
          {[0.38, 0.5, 0.62, 0.74, 0.86].map((v, i) => {
            const pts: P[] = Array.from({ length: 10 }, (_, j) => {
              const u = 0.06 + (j / 9) * 0.86;
              const b = qbez(C, Q, NAVEL, u);
              const t: P = u < 0.3 ? [lerp(C[0], HINGE[0], u / 0.3), lerp(C[1], HINGE[1], u / 0.3)] : [lerp(HINGE[0], NAVEL[0], (u - 0.3) / 0.7), lerp(HINGE[1], NAVEL[1] + 14, (u - 0.3) / 0.7)];
              return [lerp(t[0], b[0], v), lerp(t[1], b[1], v)];
            });
            return <Line key={i} pts={rp(pts)} smooth width={4 + m * 2} color={pleatCol} z={0.001} />;
          })}
        </X>
        {/* body */}
        <Part shape={blob(body, 6)} color={color} shade={0.2} z={0.01}>
          {/* countershaded belly */}
          <Part shape={blob(rp([[-40, -60], [-160, -52], [-300, -32], [-410, -12], [-440, 0], [-380, -6], [-260, -16], [-120, -28], [-30, -36]]), 6)} color={belly} flat outline={0} z={0.001} />
          {mottles.map(([x, y, rr, rot], i) => (
            <Part key={i} shape={ellipse(rr * 1.4, rr)} color={light} flat outline={0} opacity={0.55} x={x} y={y} rot={rot} z={0.002} />
          ))}
          {/* blowhole splash guard + nostrils */}
          <Part shape={ellipse(46, 14)} color={color} shade={0.2} x={262} y={76} z={0.003} />
          <Line pts={[[246, 82], [272, 85]]} width={5} color={INKC} z={0.004} />
          <Line pts={[[250, 76], [276, 79]]} width={5} color={INKC} z={0.004} />
          {/* mouth line (closed) */}
          {m < 0.02 ? <Line pts={rp([[496, -4], [430, -10], [372, -10], [338, -16]])} smooth width={6} color={INKC} z={0.004} /> : null}
          <AnimalEye x={364} y={8} r={calf ? 19 : 16} kind={eye} gaze={gaze} z={0.005} />
          {tag ? <WhaleTag x={40} y={92} z={0.006} /> : null}
        </Part>
        {/* near flipper */}
        <X x={250} y={-40} rot={-0.15 + flip + (swim === undefined ? 0 : Math.sin(ph * 0.5) * 0.08)} z={0.03}>
          <Part shape={blob([[16, 8], [-30, -6], [-120, -52], [-196, -88], [-206, -76], [-150, -40], [-40, 10]], 6)} color={shadeHex(color, 0.04)} shade={0.3} />
        </X>
        {blow > 0 ? <Blow x={262} y={92} k={blow} z={0.05} /> : null}
      </X>
    </X>
  );
};

/** Suction-cup sensor tag (camera, heart sensor, antenna). Origin = cups. */
export const WhaleTag: React.FC<XProps & { glow?: number }> = ({ glow = 0, ...xf }) => (
  <X {...xf}>
    {glow > 0 ? <Glow rx={70} color="#ffd84a" alpha={0.5 * glow} additive z={-0.01} /> : null}
    {[-26, 26].map((x) => (
      <Part key={x} shape={ellipse(16, 7)} color="#3a3a42" flat outline={3} x={x} y={2} />
    ))}
    <Part shape={roundRect(84, 30, 10)} color="#f08a2a" shade={0.2} y={20} z={0.001} />
    <Part shape={circle(7)} color="#2a3a52" flat outline={3} x={26} y={22} z={0.002} />
    <Line pts={[[-30, 32], [-44, 64]]} width={4} color={INKC} z={0.002} />
  </X>
);

/**
 * Merged puffs: circles drawn twice (outlined base, borderless fill on top) so
 * only the outer silhouette is outlined — clouds, spray, foam.
 */
export const Puffs: React.FC<XProps & { puffs: [number, number, number][]; color?: string; shadow?: string; outline?: number; opacity?: number }> = ({
  puffs,
  color = "#f4f8fb",
  shadow,
  outline = 4,
  opacity = 1,
  ...xf
}) => (
  <X {...xf}>
    {puffs.map(([x, y, r], i) => (r > 0.5 ? <Part key={`o${i}`} shape={circle(r)} color={color} flat outline={outline} opacity={opacity} x={x} y={y} z={0} /> : null))}
    {shadow
      ? puffs.map(([x, y, r], i) => (r > 0.5 ? <Part key={`s${i}`} shape={circle(r)} color={shadow} flat outline={0} opacity={opacity} x={x} y={y} z={0.001} /> : null))
      : null}
    {puffs.map(([x, y, r], i) =>
      r > 0.5 ? <Part key={`f${i}`} shape={circle(r * (shadow ? 0.8 : 1))} color={color} flat outline={0} opacity={opacity} x={x + (shadow ? -r * 0.12 : 0)} y={y + (shadow ? r * 0.14 : 0)} z={0.002} /> : null,
    )}
  </X>
);

/** Whale spout: a bushy column of spray rising from the blowhole, k 0..1 (rise, hang, drift away). */
export const Blow: React.FC<XProps & { k: number; seed?: number }> = ({ k, seed = 4, ...xf }) => {
  const r = rng(seed);
  const h = 420 * Math.min(1, k * 1.7);
  const fade = k < 0.6 ? 1 : Math.max(0, 1 - (k - 0.6) / 0.4);
  if (h < 4 || fade <= 0.02) return null;
  const puffs: [number, number, number][] = Array.from({ length: 18 }, (_, i) => {
    const t = (i + 1) / 18;
    const rr = (16 + t * 58 + r() * 12) * (0.4 + 0.6 * fade);
    return [Math.sin(i * 1.7 + seed) * t * 70 + (1 - fade) * 60 * t, t * h, rr];
  });
  return (
    <X {...xf}>
      <Glow rx={110 + h * 0.3} ry={h * 0.62} y={h * 0.55} color="#ffffff" alpha={0.45 * fade} />
      <Puffs puffs={puffs} shadow="#d4e2ec" outline={4} opacity={Math.min(1, fade * 1.5)} />
    </X>
  );
};

// ───────────────────────── early whales ─────────────────────────

/**
 * Early whale that morphs from Pakicetus (k=0: wolf-sized, four legs, long
 * tail, teeth, eyes on top) through walking-swimming forms to a sea whale like
 * Dorudon (k=1: long body, flippers, tiny hind legs, flukes, blowhole on top).
 * Origin at the body centre; feet at y ≈ -legH - bodyH/2.
 */
export const ProtoWhale: React.FC<
  XProps & { k?: number; walk?: number; swim?: number; fat?: number; eye?: AnimalEyeKind; gaze?: P; mouth?: number; color?: string; showNostril?: boolean }
> = ({ k = 0, walk, swim, fat = 1, eye = "open", gaze = [0.5, 0.2], mouth = 0, color, showNostril = false, ...xf }) => {
  const e = smooth(k);
  const L = lerp(300, 640, e);
  const H = lerp(118, 116, e) * fat;
  const headL = lerp(160, 210, e);
  const legF = lerp(108, 0, smooth(k / 0.7));
  const legH = lerp(116, 10, smooth(k / 0.9));
  const fin = smooth((k - 0.35) / 0.45);
  const flukes = smooth((k - 0.55) / 0.4);
  const col = color ?? mixHex("#a97a4e", "#6c8aa6", e);
  const belly = mixHex(col, "#f2e6d0", 0.55);
  const wph = walk === undefined ? 0 : walk * 0.16;
  const sph = swim === undefined ? 0 : swim * 0.11;
  const legSwing = (o: number) => (walk === undefined ? 0 : Math.sin(wph + o) * 0.45);
  const bob = walk === undefined ? 0 : Math.abs(Math.sin(wph)) * 6;
  const tailWave = (swim === undefined ? 0 : Math.sin(sph) * 0.16) + (walk === undefined ? 0 : Math.sin(wph * 0.5) * 0.06);
  const body: P[] = rp([
    [L / 2, 0.24 * H], [0.36 * L, 0.52 * H], [0.05 * L, 0.56 * H], [-0.3 * L, 0.48 * H], [-L / 2, 0.22 * H],
    [-L / 2, -0.2 * H], [-0.3 * L, -0.48 * H], [0, -0.52 * H], [0.32 * L, -0.44 * H], [L / 2, -0.2 * H],
  ]);
  const tailL = lerp(250, 300, e);
  const tw0 = 0.36 * H;
  const tw1 = lerp(10, 26, e) * fat ** 0.3;
  const tailPts: P[] = rp([
    [30, tw0], [-tailL * 0.35, tw0 * 0.75 + 8 * (1 - e)], [-tailL * 0.7, tw1 * 1.6 + 20 * (1 - e)], [-tailL, tw1 + 26 * (1 - e)],
    [-tailL, -tw1 + 26 * (1 - e)], [-tailL * 0.7, -tw1 * 1.6 + 16 * (1 - e)], [-tailL * 0.35, -tw0 * 0.75], [30, -tw0],
  ]);
  const head: P[] = rp([
    [-30, 0.42 * H], [0.35 * headL, 0.4 * H], [0.7 * headL, 0.2 * H], [headL, 0.06 * H], [headL + 6, -0.06 * H],
    [0.7 * headL, -0.14 * H], [0.3 * headL, -0.36 * H], [-30, -0.36 * H],
  ]);
  const jawY = -0.05 * H;
  const teeth = k < 0.95 ? Array.from({ length: 7 }, (_, i) => 0.35 * headL + i * ((0.6 * headL) / 7)) : [];
  const nostrilU = lerp(0.97, 0.36, e);
  const nostril: P = [nostrilU * headL, lerp(0.02, 0.43, e) * H];
  const legW = lerp(40, 22, e);
  /** Two-segment leg (thigh/upper arm + shin/forearm with a paw); hind legs bend back at the hock. */
  const leg = (x: number, len: number, o: number, far: boolean, hind: boolean) => {
    if (len <= 3) return null;
    const sw = legSwing(o);
    const base = hind ? 0.38 : -0.12;
    const lift = walk === undefined ? 0 : Math.max(0, Math.sin(wph + o + 1.4)) * 0.35;
    const c = far ? shadeHex(col, 0.18) : col;
    const up = len * 0.52;
    const lo = len * 0.56;
    return (
      <X key={`${x}${far}`} x={x} y={-0.26 * H} rot={base + sw} z={far ? -0.03 : 0.02}>
        <Part shape={limb(up, legW * 1.3, legW)} color={c} shade={0.25} />
        <X y={-up} rot={-base * 1.9 - sw * 0.6 + (hind ? -lift : lift)} z={0.001}>
          <Part shape={limb(lo, legW * 0.95, legW * 0.75)} color={c} shade={0.25} />
          <Part shape={ellipse(legW * 0.82, legW * 0.42)} color={far ? shadeHex(col, 0.28) : shadeHex(col, 0.12)} shade={0.2} x={legW * 0.3} y={-lo} z={0.001} />
        </X>
      </X>
    );
  };
  return (
    <X {...xf}>
      <X y={bob}>
        {leg(0.28 * L, legF, 0, true, false)}
        {leg(-0.3 * L, legH, Math.PI, true, true)}
        {/* tail with flukes */}
        <X x={-L / 2 + 20} y={0} rot={tailWave + lerp(0.3, 0, e)} z={-0.02}>
          <Part shape={blob(tailPts, 6)} color={col} shade={0.25} />
          {flukes > 0.02 ? (
            <X x={-tailL + 8} y={(26 * (1 - e))} s={flukes}>
              <Part shape={blob([[10, 6], [-40, 30], [-96, 64], [-112, 50], [-60, 6]], 6)} color={shadeHex(col, 0.1)} shade={0.2} z={-0.01} />
              <Part shape={blob([[10, -6], [-40, -30], [-96, -64], [-112, -50], [-60, -6]], 6)} color={col} shade={0.2} z={0.01} />
            </X>
          ) : null}
        </X>
        <Part shape={blob(body, 6)} color={col} shade={0.22} z={0}>
          <Part shape={blob(rp([[0.38 * L, -0.3 * H], [0, -0.42 * H], [-0.36 * L, -0.34 * H], [-0.2 * L, -0.2 * H], [0.2 * L, -0.2 * H]]), 6)} color={belly} flat outline={0} z={0.001} />
          {k < 0.35 ? (
            // fur stripes
            [-0.25, -0.05, 0.15].map((u, i) => <Line key={i} pts={[[u * L, 0.5 * H], [u * L - 16, 0.28 * H]]} width={5} color={shadeHex(col, 0.22)} z={0.002} />)
          ) : null}
        </Part>
        {/* head */}
        <X x={L / 2 - 26} y={(0.12 + lerp(0.2, 0, e)) * H} rot={lerp(0.1, 0, e)} z={0.01}>
          <Part shape={blob(head, 6)} color={col} shade={0.22} />
          {/* lower jaw */}
          <X x={0.2 * headL} y={jawY} rot={-0.35 * mouth} z={-0.01}>
            <Part shape={blob(rp([[0, 0.05 * H], [0.8 * headL, 0.04 * H], [0.78 * headL, -0.08 * H], [0.1 * headL, -0.22 * H]]), 6)} color={shadeHex(col, 0.06)} shade={0.2} />
          </X>
          <Line pts={rp([[0.2 * headL, jawY], [0.6 * headL, jawY + 2], [headL, jawY + 0.04 * H]])} smooth width={5} color={INKC} z={0.002} />
          {teeth.map((tx, i) => (
            <Part key={i} shape={poly([[tx - 7, jawY + 1], [tx + 7, jawY + 1], [tx, jawY - 14 + (i % 2) * 4]])} color="#fbf6ea" flat outline={3} z={0.003} />
          ))}
          {k < 0.45 ? <Part shape={blob([[-36, 0.36 * H], [-50, 0.62 * H], [-20, 0.44 * H]], 4)} color={shadeHex(col, 0.1)} shade={0.2} z={-0.005} /> : null}
          <AnimalEye x={lerp(0.36, 0.3, e) * headL} y={lerp(0.36, 0.16, e) * H} r={lerp(15, 13, e)} kind={eye} gaze={gaze} z={0.004} />
          {showNostril || k > 0.05 ? (
            <X x={nostril[0]} y={nostril[1]} z={0.005}>
              {showNostril ? <Glow rx={30} color="#ffe27a" alpha={0.6} additive /> : null}
              <Part shape={ellipse(8, 4.5)} color={INKC} flat outline={0} rot={-0.2} />
            </X>
          ) : null}
        </X>
        {/* near legs / flipper */}
        {leg(0.28 * L + 18, legF, Math.PI, false, false)}
        {fin > 0.02 ? (
          <X x={0.3 * L} y={-0.32 * H} rot={-0.5 + (swim === undefined ? 0 : Math.sin(sph * 0.6) * 0.1)} s={fin} z={0.03}>
            <Part shape={blob([[12, 6], [-20, -10], [-70, -60], [-92, -66], [-74, -34], [-20, 12]], 6)} color={shadeHex(col, 0.06)} shade={0.25} />
          </X>
        ) : null}
        {leg(-0.3 * L + 18, legH, 0, false, true)}
      </X>
    </X>
  );
};

/** Hippo, the whales' closest living cousin. Feet at y ≈ -150. */
export const Hippo: React.FC<XProps & { walk?: number; mouth?: number; eye?: AnimalEyeKind; gaze?: P; color?: string }> = ({ walk, mouth = 0, eye = "open", gaze = [0.5, 0.1], color = "#9a8aa6", ...xf }) => {
  const wph = walk === undefined ? 0 : walk * 0.14;
  const sw = (o: number) => (walk === undefined ? 0 : Math.sin(wph + o) * 0.3);
  const leg = (x: number, o: number, far: boolean) => (
    <X x={x} y={-40} rot={sw(o)} z={far ? -0.02 : 0.02}>
      <Part shape={limb(110, 62, 58)} color={far ? shadeHex(color, 0.18) : color} shade={0.25} />
    </X>
  );
  return (
    <X {...xf}>
      {leg(120, 0, true)}
      {leg(-130, Math.PI, true)}
      <Part shape={blob([[230, 40], [170, 130], [0, 150], [-170, 130], [-250, 40], [-240, -50], [-150, -90], [40, -96], [190, -70]], 8)} color={color} shade={0.22}>
        <Part shape={blob([[180, -60], [40, -86], [-150, -80], [-60, -50], [120, -40]], 6)} color={mixHex(color, "#f0c8c8", 0.4)} flat outline={0} z={0.001} />
      </Part>
      <Part shape={blob([[-250, 40], [-290, 70], [-276, 50]], 4)} color={color} shade={0.2} z={-0.01} />
      {/* head */}
      <X x={230} y={40} z={0.02}>
        <Part shape={blob([[-40, 90], [40, 104], [110, 80], [150, 30], [170, -30], [140, -70], [60, -60], [-20, -50], [-50, 20]], 8)} color={color} shade={0.22} />
        <X x={30} y={-40} rot={-0.5 * mouth} z={-0.01}>
          <Part shape={blob([[0, 10], [130, 0], [130, -40], [20, -50]], 6)} color={shadeHex(color, 0.06)} shade={0.2} />
          {mouth > 0.1 ? <Part shape={poly([[100, -2], [116, -2], [108, 26]])} color="#fbf6ea" flat outline={3} z={0.002} /> : null}
        </X>
        <Part shape={ellipse(12, 7)} color={INKC} flat outline={0} x={146} y={10} z={0.003} />
        <AnimalEye x={40} y={86} r={18} kind={eye} gaze={gaze} z={0.003} />
        <Part shape={ellipse(16, 22)} color={color} shade={0.2} x={-14} y={104} rot={0.4} z={-0.005} />
        <Part shape={ellipse(30, 18)} color="#f0a0a8" flat outline={0} opacity={0.6} x={70} y={20} z={0.002} />
      </X>
      {leg(140, Math.PI, false)}
      {leg(-110, 0, false)}
    </X>
  );
};

/** Bottlenose dolphin (toothed whale). */
export const Dolphin: React.FC<XProps & { swim?: number; eye?: AnimalEyeKind; color?: string }> = ({ swim, eye = "happy", color = "#8a9cb0", ...xf }) => {
  const ph = swim === undefined ? 0 : swim * 0.18;
  return (
    <X {...xf}>
      <X x={-200} rot={Math.sin(ph) * 0.25} z={-0.01}>
        <Part shape={blob([[20, 10], [-40, 14], [-90, 60], [-100, 40], [-80, 0], [-100, -40], [-90, -60], [-40, -14], [20, -10]], 6)} color={shadeHex(color, 0.08)} shade={0.25} />
      </X>
      <Part shape={blob([[-30, 60], [-60, 110], [-80, 116], [-80, 70]], 4)} color={shadeHex(color, 0.08)} shade={0.25} z={-0.005} />
      <Part shape={blob([[260, -4], [200, 18], [150, 50], [40, 72], [-120, 50], [-210, 14], [-210, -10], [-100, -40], [60, -50], [180, -30], [262, -14]], 8)} color={color} shade={0.22}>
        <Part shape={blob([[240, -14], [150, -36], [0, -44], [-140, -26], [-40, -18], [120, -14]], 6)} color={mixHex(color, "#f4f6f8", 0.7)} flat outline={0} z={0.001} />
        <Line pts={[[262, -8], [220, -12], [190, -6]]} smooth width={5} color={INKC} z={0.002} />
        <AnimalEye x={170} y={8} r={13} kind={eye} z={0.003} />
      </Part>
      <X x={60} y={-40} rot={-0.6} z={0.02}>
        <Part shape={blob([[10, 6], [-50, -30], [-70, -40], [-50, -10]], 4)} color={shadeHex(color, 0.06)} shade={0.25} />
      </X>
    </X>
  );
};

/** Sperm whale (toothed): huge boxy head, narrow toothed lower jaw, wrinkled skin. */
export const SpermWhale: React.FC<XProps & { len?: number; swim?: number; mouth?: number; eye?: AnimalEyeKind; gaze?: P; color?: string }> = ({ len = 1000, swim, mouth = 0, eye = "open", gaze = [0.5, 0], color = "#6f6672", ...xf }) => {
  const ph = swim === undefined ? 0 : swim * 0.1;
  return (
    <X {...xf}>
      <X s={len / 1000}>
        <X x={-470} y={10} rot={Math.sin(ph) * 0.18} z={-0.02}>
          <Part shape={blob([[10, 10], [-60, 40], [-130, 100], [-160, 96], [-110, 20], [-160, -60], [-130, -80], [-60, -20], [10, -10]], 6)} color={shadeHex(color, 0.08)} shade={0.25} />
        </X>
        <Part shape={blob([[500, 120], [480, 150], [300, 160], [100, 130], [-100, 90], [-300, 50], [-470, 20], [-470, 0], [-300, -40], [-100, -80], [100, -100], [300, -60], [420, -40], [500, -10]], 6)} color={color} shade={0.22}>
          {Array.from({ length: 9 }, (_, i) => (
            <Line key={i} pts={[[-380 + i * 70, 30 + (i % 3) * 10], [-360 + i * 70, 0 + (i % 2) * 14]]} width={4} color={shadeHex(color, 0.2)} z={0.002} />
          ))}
          <AnimalEye x={300} y={10} r={14} kind={eye} gaze={gaze} z={0.004} />
        </Part>
        <X x={180} y={-50} rot={-0.4 * mouth} z={-0.01}>
          <Part shape={blob([[0, 10], [300, 4], [300, -16], [0, -26]], 6)} color={mixHex(color, "#e8e2e6", 0.5)} shade={0.2} />
          {Array.from({ length: 8 }, (_, i) => (
            <Part key={i} shape={poly([[40 + i * 32, 6], [54 + i * 32, 6], [47 + i * 32, 26]])} color="#fbf6ea" flat outline={3} z={0.002} />
          ))}
        </X>
        <X x={200} y={-70} rot={-0.4} z={0.02}>
          <Part shape={blob([[10, 6], [-50, -20], [-90, -40], [-70, -10]], 4)} color={shadeHex(color, 0.06)} shade={0.25} />
        </X>
      </X>
    </X>
  );
};

/** Squid (sperm whale prey). Facing right (mantle tip at -x). */
export const Squid: React.FC<XProps & { swim?: number; color?: string; size?: number; eye?: AnimalEyeKind }> = ({ swim = 0, color = "#d8573e", size = 1, eye = "wide", ...xf }) => {
  const ph = swim * 0.15;
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      <Part shape={blob([[-160, 0], [-130, 40], [-60, 50], [30, 44], [60, 0], [30, -44], [-60, -50], [-130, -40]], 8)} color={color} shade={0.22}>
        {[[-120, 10], [-80, -20], [-40, 20], [0, -10]].map(([x, y], i) => (
          <Part key={i} shape={circle(7)} color={shadeHex(color, 0.2)} flat outline={0} x={x} y={y} z={0.001} />
        ))}
      </Part>
      <Part shape={blob([[-170, 0], [-200, 40], [-150, 20]], 4)} color={shadeHex(color, 0.1)} shade={0.2} z={-0.01} />
      <Part shape={blob([[-170, 0], [-200, -40], [-150, -20]], 4)} color={shadeHex(color, 0.1)} shade={0.2} z={-0.01} />
      <AnimalEye x={44} y={6} r={16} kind={eye} z={0.01} />
      {Array.from({ length: 8 }, (_, i) => {
        const y0 = -28 + i * 8;
        const L = i === 2 || i === 5 ? 300 : 190;
        const pts: P[] = Array.from({ length: 7 }, (_, j) => [60 + (j / 6) * L, y0 * (1 + j * 0.25) + Math.sin(ph + j * 0.9 + i) * 12 * (j / 6)]);
        return <Line key={i} pts={rp(pts)} smooth width={i === 2 || i === 5 ? 9 : 12} color={shadeHex(color, i % 2 ? 0.08 : 0)} z={-0.005 + i * 0.0001} />;
      })}
    </X>
  );
};

/** Long-necked sauropod (Argentinosaurus-like). Feet at y ≈ -330. */
export const Sauropod: React.FC<XProps & { walk?: number; color?: string; eye?: AnimalEyeKind }> = ({ walk, color = "#8aa56a", eye = "open", ...xf }) => {
  const wph = walk === undefined ? 0 : walk * 0.08;
  const sw = (o: number) => (walk === undefined ? 0 : Math.sin(wph + o) * 0.18);
  const leg = (x: number, o: number, far: boolean) => (
    <X x={x} y={-80} rot={sw(o)} z={far ? -0.02 : 0.02}>
      <Part shape={limb(260, 110, 100)} color={far ? shadeHex(color, 0.18) : color} shade={0.25} />
    </X>
  );
  return (
    <X {...xf}>
      {leg(200, 0, true)}
      {leg(-220, Math.PI, true)}
      <Part shape={blob([[-250, 110], [-560, 40], [-820, -40], [-960, -90], [-820, -70], [-560, -50], [-280, -90]], 8)} color={color} shade={0.22} z={-0.01} />
      <Part shape={blob([[330, 70], [260, 230], [0, 290], [-270, 220], [-360, 60], [-290, -120], [0, -170], [280, -120]], 8)} color={color} shade={0.22}>
        <Part shape={blob([[240, -100], [0, -140], [-250, -100], [0, -90]], 6)} color={mixHex(color, "#f0ecd0", 0.45)} flat outline={0} z={0.001} />
        {[[-120, 150], [20, 170], [150, 140], [-40, 100]].map(([x, y], i) => (
          <Part key={i} shape={circle(18 + (i % 2) * 8)} color={shadeHex(color, 0.15)} flat outline={0} x={x} y={y} z={0.002} />
        ))}
      </Part>
      <Part shape={blob([[160, 200], [360, 440], [520, 680], [610, 790], [690, 770], [640, 640], [520, 400], [340, 120], [260, 0]], 8)} color={color} shade={0.22} z={0.005} />
      <X x={690} y={790} z={0.01}>
        <Part shape={blob([[-50, -20], [-40, 30], [30, 40], [90, 10], [80, -20], [0, -30]], 6)} color={color} shade={0.22} />
        <AnimalEye x={10} y={14} r={11} kind={eye} z={0.002} />
        <Line pts={[[50, -8], [88, -2]]} width={4} color={INKC} z={0.002} />
      </X>
      {leg(230, Math.PI, false)}
      {leg(-190, 0, false)}
    </X>
  );
};

/** Antarctic krill: curved shrimp body, big black eye, antennae, paddling legs. ~120 px long. */
export const Krill: React.FC<XProps & { swim?: number; color?: string; glow?: number }> = ({ swim = 0, color = "#f2856a", glow = 0, ...xf }) => {
  const ph = swim * 0.5;
  return (
    <X {...xf}>
      {glow > 0 ? <Glow rx={90} color="#ff9a7a" alpha={0.4 * glow} additive z={-0.02} /> : null}
      {Array.from({ length: 6 }, (_, i) => {
        const x = 30 - i * 11;
        const a = Math.sin(ph + i * 0.7) * 0.35;
        return <Line key={i} pts={[[x, -2], [x - 6 + a * 10, -20], [x - 10 + a * 18, -30]]} width={3} color={shadeHex(color, 0.2)} z={-0.01} />;
      })}
      <Part shape={blob([[54, 4], [42, 18], [10, 22], [-22, 18], [-44, 8], [-58, -6], [-60, -20], [-50, -16], [-36, -4], [-14, 0], [12, 0], [38, -4], [52, -4]], 6)} color={color} shade={0.22} opacity={0.96}>
        {[-6, -22, -36].map((x, i) => (
          <Line key={i} pts={[[x, 20 - i * 2], [x - 4, 2 - i * 2]]} width={3} color={shadeHex(color, 0.18)} z={0.001} />
        ))}
        <Part shape={circle(8)} color={INKC} flat outline={0} x={40} y={10} z={0.002} />
        <Part shape={circle(2.6)} color="#ffffff" flat outline={0} x={42} y={12} z={0.003} />
      </Part>
      <Part shape={blob([[-56, -18], [-76, -8], [-80, -26], [-66, -34]], 4)} color={shadeHex(color, 0.06)} shade={0.2} z={-0.005} />
      <Line pts={rp([[52, 10], [84, 18 + Math.sin(ph) * 3], [118, 12]])} smooth width={2.6} color={shadeHex(color, 0.28)} z={0.005} />
      <Line pts={rp([[52, 8], [88, 26 + Math.sin(ph + 1) * 3], [120, 34]])} smooth width={2.6} color={shadeHex(color, 0.28)} z={0.005} />
    </X>
  );
};

/** Dense krill swarm: many tiny krill (cheap flat sprites) in a soft cloud, drifting. */
export const KrillSwarm: React.FC<XProps & { w?: number; h?: number; n?: number; frame?: number; seed?: number; color?: string; glow?: number; eaten?: number }> = ({
  w = 900,
  h = 420,
  n = 160,
  frame = 0,
  seed = 9,
  color = "#f2856a",
  glow = 0.5,
  eaten = 0,
  ...xf
}) => {
  const r = rng(seed);
  const items = Array.from({ length: n }, () => {
    // gaussian-ish blob
    const u = r() + r() + r() - 1.5;
    const v = r() + r() + r() - 1.5;
    return { x: (u / 1.5) * (w / 2), y: (v / 1.5) * (h / 2), a: r() * 6.28, s: 0.7 + r() * 0.6, ph: r() * 6.28, cut: r() };
  });
  return (
    <X {...xf}>
      {glow > 0 ? <Glow rx={w * 0.62} ry={h * 0.62} color="#ff8a6a" alpha={0.22 * glow * (1 - eaten)} /> : null}
      {items.map((it, i) =>
        it.cut < eaten ? null : (
          <X key={i} x={it.x + Math.sin(frame * 0.05 + it.ph) * 10} y={it.y + Math.cos(frame * 0.04 + it.ph) * 8} rot={it.a * 0.15 + Math.sin(frame * 0.08 + it.ph) * 0.2} s={it.s} z={i * 0.00001}>
            <Part shape={ellipse(13, 5)} color={color} flat outline={0} />
            <Part shape={circle(2.6)} color={INKC} flat outline={0} x={10} y={1} z={0.001} />
          </X>
        ),
      )}
    </X>
  );
};
