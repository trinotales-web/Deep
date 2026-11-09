import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { shadeHex } from "../style";
import { noise1, rng } from "../random";
import { Smoke } from "./fire";

// Spaceflight kit for the modern-history episodes: SpaceX rockets (Falcon 1,
// Falcon 9 with legs and grid fins, Falcon Heavy, Starship / Super Heavy), the
// launch tower with its catch arms, Dragon, the space station, Starlink
// satellites, engine plumes, fireballs, planets and landing pads.
// Rockets: origin = centre of the base (engine plane), y up.

const WHITE = "#eef0f3";
const BLACK = "#2a2a30";
const STEEL = "#cfd4db";

/** Engine plume: white core, yellow, orange; flickers. Origin = nozzle exit, plume points down. */
export const Exhaust: React.FC<XProps & { len?: number; w?: number; k?: number; seed?: number; glow?: number; color?: string }> = ({
  len = 420,
  w = 90,
  k = 1,
  seed = 1,
  glow = 1,
  color = "#ff9a3a",
  ...xf
}) => {
  const frame = useCurrentFrame();
  if (k <= 0.01) return null;
  const fl = (o: number) => 1 + noise1(frame * 0.45 + o, seed + o) * 0.12;
  const shape = (L: number, W: number) =>
    blob([[-W * 0.5, 0], [W * 0.5, 0], [W * 0.62, -L * 0.25], [W * 0.38, -L * 0.62], [0, -L], [-W * 0.38, -L * 0.62], [-W * 0.62, -L * 0.25]], 8);
  const L = len * k;
  return (
    <X {...xf}>
      {glow > 0 ? <Glow rx={w * 3.2} ry={L * 0.7} y={-L * 0.35} color="#ffb04a" alpha={0.45 * glow * k} additive z={-0.02} /> : null}
      <X sy={fl(1)} sx={fl(2)}>
        <Part shape={shape(L, w)} color={color} flat outline={5} />
      </X>
      <X sy={fl(3) * 0.78} sx={0.7} z={0.01}>
        <Part shape={shape(L, w)} color="#ffd84a" flat outline={0} />
      </X>
      <X sy={fl(5) * 0.5} sx={0.42} z={0.02}>
        <Part shape={shape(L, w)} color="#fff8e0" flat outline={0} />
      </X>
    </X>
  );
};

/** Round fireball with smoke and debris; `t` 0..1 through the blast. */
export const Fireball: React.FC<XProps & { t: number; size?: number; seed?: number; debris?: boolean }> = ({ t, size = 1, seed = 3, debris = true, ...xf }) => {
  if (t <= 0) return null;
  const r = rng(seed);
  const grow = Math.min(1, Math.sin(Math.min(1, t * 2.2) * Math.PI * 0.5));
  const fade = 1 - Math.max(0, (t - 0.55) / 0.45);
  const puffs = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + r() * 0.4;
    const d = 70 + r() * 70;
    return [Math.cos(a) * d, Math.sin(a) * d * 0.85, 80 + r() * 60] as [number, number, number];
  });
  const bits = Array.from({ length: 12 }, () => [r() * Math.PI * 2, 0.6 + r() * 0.8, r() * 6, 8 + r() * 14] as [number, number, number, number]);
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      <Glow rx={520 * grow} color="#ffb04a" alpha={0.65 * fade} additive z={-0.03} />
      <X s={grow}>
        {puffs.map(([x, y, rr], i) => (
          <Part key={`o${i}`} shape={circle(rr)} color={i % 3 ? "#f07a2a" : "#e2552a"} flat outline={6} x={x} y={y} opacity={fade} z={i * 0.0001} />
        ))}
        <Part shape={circle(150)} color="#ffb03a" flat outline={0} opacity={fade} z={0.01} />
        <Part shape={circle(100)} color="#ffe27a" flat outline={0} opacity={fade} z={0.011} />
        <Part shape={circle(55)} color="#fff8e0" flat outline={0} opacity={fade * (1 - t)} z={0.012} />
      </X>
      <Smoke y={60} w={260} h={900} alpha={0.55 * Math.min(1, t * 2)} seed={seed} z={-0.02} />
      {debris
        ? bits.map(([a, sp, rot, sz], i) => {
            const d = t * 900 * sp;
            return (
              <X key={`d${i}`} x={Math.cos(a) * d} y={Math.sin(a) * d - t * t * 500} rot={rot + t * 8} z={0.02}>
                <Part shape={roundRect(sz * 2, sz, 2)} color={i % 2 ? "#4a4a52" : WHITE} flat outline={3} opacity={fade} />
              </X>
            );
          })
        : null}
    </X>
  );
};

const seams = (w: number, ys: number[], color: string, z = 0.002) =>
  ys.map((y, i) => <Line key={`s${i}`} pts={[[-w / 2 + 3, y], [w / 2 - 3, y]]} width={3} color={color} z={z} />);

/** Tiny US flag decal. */
const FlagDecal: React.FC<XProps & { w?: number }> = ({ w = 34, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, w * 0.6, 2)} color="#f4f1ea" flat outline={2.5} />
    {[0, 2, 4].map((i) => (
      <Part key={i} shape={roundRect(w - 2, w * 0.08, 0)} color="#c8262f" flat outline={0} y={w * 0.24 - i * w * 0.12} z={0.001} />
    ))}
    <Part shape={roundRect(w * 0.42, w * 0.32, 0)} color="#2f4f9a" flat outline={0} x={-w * 0.29} y={w * 0.14} z={0.002} />
  </X>
);

/** Ogive nose cone of width w and height h, base at y=0. */
const nose = (w: number, h: number) =>
  blob([[-w / 2, 0], [w / 2, 0], [w * 0.47, h * 0.35], [w * 0.32, h * 0.72], [0, h], [-w * 0.32, h * 0.72], [-w * 0.47, h * 0.35]], 8);

/**
 * Falcon 1: skinny two-stage rocket. `split` separates the upper stage by that
 * many px (stage recontact on flight 3), `tilt2` turns it; `thrust` lights the engine.
 */
export const Falcon1: React.FC<XProps & { h?: number; thrust?: number; split?: number; tilt2?: number; seed?: number; upper?: boolean; lower?: boolean }> = ({
  h = 820,
  thrust = 0,
  split = 0,
  tilt2 = 0,
  seed = 1,
  upper = true,
  lower = true,
  ...xf
}) => {
  const w = h * 0.085;
  const s1 = h * 0.58;
  const inter = h * 0.05;
  const s2 = h * 0.17;
  const fair = h * 0.2;
  return (
    <X {...xf}>
      {lower ? (
        <>
          <Part shape={poly([[-w * 0.36, 0], [w * 0.36, 0], [w * 0.5, -h * 0.05], [-w * 0.5, -h * 0.05]])} color="#4a4a52" shade={0.2} z={-0.01} />
          <Part shape={roundRect(w, s1, 4)} color={WHITE} shade={0.18} y={s1 / 2}>
            {seams(w, [s1 * 0.25, s1 * 0.55, s1 * 0.82], "#c9ccd2")}
          </Part>
          <FlagDecal y={s1 * 0.62} z={0.005} w={w * 0.5} />
          <Part shape={roundRect(w, inter, 2)} color={BLACK} shade={0.15} y={s1 + inter / 2} z={0.004} />
          <Exhaust y={-h * 0.05} len={h * 0.55} w={w * 1.1} k={thrust} seed={seed} z={-0.02} />
        </>
      ) : null}
      {upper ? (
        <X y={s1 + inter + split} rot={tilt2}>
          <Part shape={roundRect(w, s2, 4)} color={WHITE} shade={0.18} y={s2 / 2} z={0.001}>
            {seams(w, [s2 * 0.5], "#c9ccd2")}
          </Part>
          <Part shape={nose(w, fair)} color={WHITE} shade={0.2} y={s2} z={0.002} />
          <Line pts={[[-w / 2 + 3, s2 + 4], [w / 2 - 3, s2 + 4]]} width={3} color="#c9ccd2" z={0.003} />
        </X>
      ) : null}
    </X>
  );
};

/**
 * Falcon 9. `stage1` draws the booster alone (landing / recovery); `payload`
 * picks the top; `legs` 0..1 deploys the landing legs, `fins` 0..1 the grid fins;
 * `soot` 0..1 darkens a flown booster; `thrust` lights the engines.
 */
export const Falcon9: React.FC<
  XProps & { h?: number; thrust?: number; legs?: number; fins?: number; soot?: number; stage1?: boolean; payload?: "fairing" | "dragon" | "none"; seed?: number; noseCone?: boolean }
> = ({ h = 1150, thrust = 0, legs = 0, fins = 0, soot = 0, stage1 = false, payload = "fairing", seed = 2, noseCone = false, ...xf }) => {
  const w = h * 0.055;
  const s1 = h * 0.62;
  const inter = h * 0.06;
  const s2 = h * 0.17;
  const fair = h * 0.15;
  const body = soot > 0 ? shadeHex(WHITE, 0.08 + soot * 0.22) : WHITE;
  const r = rng(seed);
  const smudges = Array.from({ length: 7 }, () => [(r() - 0.5) * w * 0.7, r() * s1 * 0.9 + s1 * 0.05, 8 + r() * 14] as [number, number, number]);
  const legA = legs * 0.62;
  return (
    <X {...xf}>
      {/* octaweb + engines */}
      <Part shape={roundRect(w * 1.02, h * 0.02, 3)} color="#3a3a42" shade={0.15} y={h * 0.01} z={0.001} />
      {[-0.3, 0, 0.3].map((k) => (
        <Part key={k} shape={poly([[-w * 0.1, 0], [w * 0.1, 0], [w * 0.14, -h * 0.022], [-w * 0.14, -h * 0.022]])} color="#55555e" flat outline={3} x={k * w} z={-0.002} />
      ))}
      <Part shape={roundRect(w, s1, 4)} color={body} shade={0.18} y={s1 / 2 + h * 0.02}>
        {seams(w, [s1 * 0.2, s1 * 0.45, s1 * 0.7], "#c9ccd2")}
      </Part>
      {soot > 0
        ? smudges.map(([x, y, rr], i) => <Part key={`sm${i}`} shape={ellipse(rr * 0.6, rr * 2)} color="#6a6670" flat outline={0} opacity={soot * 0.55} x={x} y={y} z={0.002} />)
        : null}
      <FlagDecal y={s1 * 0.55} w={w * 0.5} z={0.004} />
      {/* black interstage with grid fins */}
      <Part shape={roundRect(w, inter, 2)} color={BLACK} shade={0.15} y={s1 + h * 0.02 + inter / 2} z={0.005} />
      {[-1, 1].map((sd) => (
        <X key={sd} x={(sd * w) / 2} y={s1 + h * 0.02 + inter * 0.45} rot={sd * (1 - fins) * 1.2} z={0.006}>
          <X x={(sd * w * 0.34) / 1} rot={0}>
            <Part shape={roundRect(w * 0.62, w * 0.5, 3)} color="#3c3c44" flat outline={3.5} />
            {[-1, 0, 1].map((k) => (
              <Line key={k} pts={[[-w * 0.28, k * w * 0.13], [w * 0.28, k * w * 0.13]]} width={2.5} color="#8a8a94" z={0.001} />
            ))}
          </X>
        </X>
      ))}
      {/* landing legs: hinge high on the booster, foot swings out */}
      {[-1, 1].map((sd) => (
        <X key={`leg${sd}`} x={(sd * w) / 2 - sd * w * 0.06} y={h * 0.2} rot={-sd * legA} z={sd > 0 ? 0.007 : -0.004}>
          <Part shape={roundPoly([[-w * 0.13, 0], [w * 0.13, 0], [w * 0.09, -h * 0.21], [-w * 0.09, -h * 0.21]], 4)} color="#2c2c34" shade={0.15} />
          <Part shape={roundRect(w * 0.42, w * 0.13, 4)} color="#3a3a42" flat outline={3} y={-h * 0.21} z={0.001} />
        </X>
      ))}
      {!stage1 ? (
        <X y={s1 + h * 0.02 + inter}>
          <Part shape={roundRect(w, s2, 4)} color={WHITE} shade={0.18} y={s2 / 2} z={0.001}>
            {seams(w, [s2 * 0.5], "#c9ccd2")}
          </Part>
          {payload === "fairing" ? (
            <>
              <Part shape={roundRect(w * 1.3, fair * 0.4, 4)} color={WHITE} shade={0.2} y={s2 + fair * 0.2} z={0.002} />
              <Part shape={nose(w * 1.3, fair * 0.9)} color={WHITE} shade={0.2} y={s2 + fair * 0.4} z={0.003} />
              <Line pts={[[0, s2 + 4], [0, s2 + fair * 1.25]]} width={3} color="#c9ccd2" z={0.004} />
            </>
          ) : payload === "dragon" ? (
            <Dragon y={s2} s={(w * 1.05) / 240} z={0.002} trunk />
          ) : null}
        </X>
      ) : noseCone ? (
        <Part shape={nose(w, h * 0.09)} color={WHITE} shade={0.2} y={s1 + h * 0.02 + inter} z={0.004} />
      ) : null}
      <Exhaust y={-h * 0.02} len={h * 0.42} w={w * 1.4} k={thrust} seed={seed} z={-0.03} />
    </X>
  );
};

/** Falcon Heavy: Falcon 9 centre core with fairing and two side boosters with nose cones. */
export const FalconHeavy: React.FC<XProps & { h?: number; thrust?: number; split?: number; payload?: "fairing" | "dragon" | "none" }> = ({ h = 1150, thrust = 0, split = 0, payload = "fairing", ...xf }) => {
  const w = h * 0.055;
  return (
    <X {...xf}>
      {[-1, 1].map((sd) => (
        <Falcon9 key={sd} h={h * 0.86} stage1 noseCone x={sd * (w * 1.04 + split)} y={-split * 0.4} rot={-sd * split * 0.0012} thrust={thrust} seed={sd + 5} z={-0.05} />
      ))}
      <Falcon9 h={h} thrust={thrust} payload={payload} z={0} />
    </X>
  );
};

const steelRings = (w: number, h0: number, h1: number, step: number) => {
  const out: React.ReactNode[] = [];
  for (let y = h0 + step; y < h1 - step * 0.5; y += step) out.push(<Line key={`r${y}`} pts={[[-w / 2 + 3, y], [w / 2 - 3, y]]} width={2.5} color="#aeb4bd" z={0.002} />);
  return out;
};

/** Super Heavy booster (stainless steel). `thrust` lights its engines; `fins` grid fins. */
export const SuperHeavy: React.FC<XProps & { h?: number; thrust?: number; seed?: number; glow?: number }> = ({ h = 760, thrust = 0, seed = 4, glow = 0, ...xf }) => {
  const w = h * 0.126;
  return (
    <X {...xf}>
      <Part shape={roundRect(w * 0.96, h * 0.02, 4)} color="#45454e" shade={0.15} y={h * 0.01} z={0.001} />
      <Part shape={roundRect(w, h * 0.92, 6)} color={STEEL} shade={0.22} y={h * 0.02 + h * 0.46}>
        {steelRings(w, -h * 0.46, h * 0.46, h * 0.06)}
      </Part>
      {glow > 0 ? <Glow rx={w * 1.2} ry={h * 0.2} y={h * 0.1} color="#ff8a4a" alpha={0.35 * glow} additive z={0.003} /> : null}
      {/* vented hot-staging ring */}
      <Part shape={roundRect(w, h * 0.06, 4)} color="#9aa0aa" shade={0.2} y={h * 0.97} z={0.004}>
        {[-0.3, -0.1, 0.1, 0.3].map((k) => (
          <Part key={k} shape={roundRect(w * 0.12, h * 0.03, 3)} color="#2a2a30" flat outline={0} x={k * w} z={0.001} />
        ))}
      </Part>
      {/* grid fins */}
      {[-1, 1].map((sd) => (
        <X key={sd} x={(sd * w) / 2 + sd * w * 0.12} y={h * 0.88} z={0.005}>
          <Part shape={roundRect(w * 0.28, w * 0.34, 3)} color="#45454e" flat outline={3.5} />
          {[-1, 0, 1].map((k) => (
            <Line key={k} pts={[[-w * 0.12, k * w * 0.09], [w * 0.12, k * w * 0.09]]} width={2.5} color="#9a9aa4" z={0.001} />
          ))}
        </X>
      ))}
      <Exhaust y={0} len={h * 0.5} w={w * 1.1} k={thrust} seed={seed} z={-0.03} />
    </X>
  );
};

/** Starship upper stage (stainless steel, black heat-shield tiles on one side, flaps). */
export const Starship: React.FC<XProps & { h?: number; thrust?: number; seed?: number; tiles?: boolean }> = ({ h = 540, thrust = 0, seed = 5, tiles = true, ...xf }) => {
  const w = h * 0.173;
  const cyl = h * 0.74;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, cyl, 6)} color={STEEL} shade={0.22} y={cyl / 2}>
        {steelRings(w, -cyl / 2, cyl / 2, h * 0.08)}
      </Part>
      <Part shape={nose(w, h * 0.26)} color={STEEL} shade={0.22} y={cyl} z={0.001} />
      {tiles ? (
        <Part
          shape={poly([[-w / 2 + 3, 6], [-2, 6], [-2, cyl], [-w * 0.16, cyl + h * 0.18], [-w * 0.3, cyl + h * 0.09], [-w / 2 + 3, cyl - 4]])}
          color="#2f2f36"
          flat
          outline={0}
          z={0.003}
        />
      ) : null}
      {/* forward and aft flaps */}
      {[-1, 1].map((sd) => (
        <React.Fragment key={sd}>
          <Part shape={roundPoly([[0, 0], [sd * w * 0.32, -h * 0.02], [sd * w * 0.28, -h * 0.12], [0, -h * 0.13]], 6)} color="#3c3c44" shade={0.2} x={(sd * w) / 2} y={cyl + h * 0.13} z={0.004} />
          <Part shape={roundPoly([[0, 0], [sd * w * 0.45, -h * 0.04], [sd * w * 0.4, -h * 0.2], [0, -h * 0.22]], 6)} color="#3c3c44" shade={0.2} x={(sd * w) / 2} y={h * 0.24} z={0.004} />
        </React.Fragment>
      ))}
      <Exhaust y={0} len={h * 0.45} w={w * 0.9} k={thrust} seed={seed} z={-0.03} />
    </X>
  );
};

/** Full Starship stack (Super Heavy + ship). */
export const StarshipStack: React.FC<XProps & { h?: number; thrust?: number; sep?: number }> = ({ h = 1300, thrust = 0, sep = 0, ...xf }) => (
  <X {...xf}>
    <SuperHeavy h={h * 0.58} thrust={thrust} />
    <Starship h={h * 0.42} y={h * 0.58 + sep} z={0.01} />
  </X>
);

/**
 * Launch tower with the "chopsticks" catch arms. Origin = tower base centre.
 * Arms point to -x; `close` 0..1 pinches them together at height `armY`.
 */
export const LaunchTower: React.FC<XProps & { h?: number; armY?: number; close?: number; armLen?: number }> = ({ h = 1400, armY = 900, close = 0, armLen = 420, ...xf }) => {
  const tw = h * 0.1;
  const open = (1 - close) * 0.28;
  const bays = 12;
  return (
    <X {...xf}>
      <Part shape={roundRect(tw, h, 2)} color="#6e737c" shade={0.18} y={h / 2}>
        {Array.from({ length: bays }, (_, i) => {
          const y0 = -h / 2 + (i * h) / bays;
          const y1 = y0 + h / bays;
          return (
            <React.Fragment key={i}>
              <Line pts={[[-tw / 2 + 6, y0], [tw / 2 - 6, y1]]} width={3.5} color="#3e424a" z={0.001} />
              <Line pts={[[tw / 2 - 6, y0], [-tw / 2 + 6, y1]]} width={3.5} color="#3e424a" z={0.001} />
              <Line pts={[[-tw / 2 + 3, y0], [tw / 2 - 3, y0]]} width={3.5} color="#3e424a" z={0.001} />
            </React.Fragment>
          );
        })}
      </Part>
      <Part shape={roundRect(tw * 1.5, h * 0.04, 4)} color="#5a5e66" shade={0.2} y={h + h * 0.02} z={0.002} />
      {/* carriage */}
      <Part shape={roundRect(tw * 1.3, tw * 0.9, 6)} color="#4a4e56" shade={0.2} y={armY} z={0.02} />
      {[1, -1].map((sd, i) => (
        <X key={sd} x={-tw * 0.55} y={armY + sd * 22} rot={sd * open} z={i ? 0.5 : -0.5}>
          <Part shape={roundRect(armLen, 46, 10)} color={i ? "#7a7f88" : "#5e626b"} shade={0.2} x={-armLen / 2}>
            {Array.from({ length: 7 }, (_, k) => (
              <Line key={k} pts={[[-armLen / 2 + 20 + k * (armLen / 7), -18], [-armLen / 2 + 50 + k * (armLen / 7), 18]]} width={3} color="#3e424a" z={0.001} />
            ))}
          </Part>
          <Part shape={roundRect(40, 60, 8)} color="#e8c84a" shade={0.2} x={-armLen + 18} z={0.001} />
        </X>
      ))}
    </X>
  );
};

/** Dragon capsule (cargo, 2012 look). Origin = base centre (of the trunk when `trunk`). `wings` 0..1 opens the solar arrays. */
export const Dragon: React.FC<XProps & { trunk?: boolean; wings?: number }> = ({ trunk = false, wings = 0, ...xf }) => {
  const ty = trunk ? 170 : 0;
  return (
    <X {...xf}>
      {trunk ? (
        <Part shape={roundRect(236, 170, 6)} color={WHITE} shade={0.18} y={85}>
          <Line pts={[[-114, 30], [114, 30]]} width={3} color="#c9ccd2" z={0.001} />
        </Part>
      ) : null}
      {trunk && wings > 0
        ? [-1, 1].map((sd) => (
            <X key={sd} x={sd * 118} y={90} z={-0.002}>
              <Part shape={roundRect(280 * wings, 96, 4)} color="#2c3e6a" shade={0.15} x={sd * 140 * wings}>
                {[-1, 0, 1].map((k) => (
                  <Line key={k} pts={[[k * 70 * wings, -42], [k * 70 * wings, 42]]} width={3} color="#6a7fa8" z={0.001} />
                ))}
              </Part>
            </X>
          ))
        : null}
      <X y={ty}>
        <Part shape={roundRect(250, 30, 8)} color="#4a4048" shade={0.2} y={15} z={0.001} />
        <Part shape={roundPoly([[-125, 28], [125, 28], [70, 250], [-70, 250]], [10, 10, 24, 24])} color={WHITE} shade={0.22} z={0.002}>
          <Part shape={roundRect(30, 30, 6)} color="#3a4a6a" flat outline={4} x={-30} y={150} z={0.001} />
          <Part shape={roundRect(30, 30, 6)} color="#3a4a6a" flat outline={4} x={30} y={150} z={0.001} />
        </Part>
        <Part shape={roundRect(150, 40, 18)} color="#d8dadf" shade={0.2} y={262} z={0.003} />
      </X>
    </X>
  );
};

/** International Space Station (side-on, simplified). Origin = centre. */
export const SpaceStation: React.FC<XProps & { glint?: number }> = ({ glint = 0, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      {/* main truss */}
      <Part shape={roundRect(1500, 34, 6)} color="#9aa0aa" shade={0.2}>
        {Array.from({ length: 24 }, (_, i) => (
          <Line key={i} pts={[[-740 + i * 62, -14], [-710 + i * 62, 14]]} width={2.5} color="#5a5e66" z={0.001} />
        ))}
      </Part>
      {/* solar array wings (4 pairs) */}
      {[-690, -520, 520, 690].map((x, i) => (
        <React.Fragment key={x}>
          {[-1, 1].map((sd) => (
            <Part key={sd} shape={roundRect(130, 360, 4)} color="#b8893a" shade={0.12} x={x} y={sd * 200} z={-0.002}>
              {[-1, 0, 1].map((k) => (
                <Line key={k} pts={[[k * 40, -170], [k * 40, 170]]} width={2.5} color="#7a5a24" z={0.001} />
              ))}
              {[-120, -40, 40, 120].map((y) => (
                <Line key={y} pts={[[-60, y], [60, y]]} width={2.5} color="#7a5a24" z={0.001} />
              ))}
            </Part>
          ))}
          {i === 1 ? <Glow rx={160} color="#fff2c6" alpha={0.3 * glint * (0.6 + 0.4 * Math.sin(frame * 0.2))} additive x={x} y={200} z={0.01} /> : null}
        </React.Fragment>
      ))}
      {/* radiators */}
      {[-250, 250].map((x) => (
        <Part key={x} shape={roundRect(70, 240, 4)} color="#f1f2f4" shade={0.15} x={x} y={-150} z={-0.001} />
      ))}
      {/* pressurized modules */}
      <Part shape={roundRect(520, 90, 40)} color={WHITE} shade={0.22} y={70} z={0.003} />
      <Part shape={roundRect(90, 300, 40)} color={WHITE} shade={0.22} x={-60} y={70} z={0.002} />
      <Part shape={circle(52)} color="#e3e5ea" shade={0.22} x={-60} y={70} z={0.004} />
      <Part shape={roundRect(200, 70, 30)} color="#e3e5ea" shade={0.22} x={330} y={70} z={0.002} />
    </X>
  );
};

/** Starlink satellite: flat body with one long solar wing. */
export const StarlinkSat: React.FC<XProps & { glint?: number }> = ({ glint = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(110, 40, 6)} color="#8e939c" shade={0.2} />
    <Line pts={[[55, 0], [90, 0]]} width={6} color="#5a5e66" />
    <Part shape={roundRect(300, 70, 4)} color="#2c3e6a" shade={0.12} x={240} z={-0.001}>
      {[-90, -30, 30, 90].map((x) => (
        <Line key={x} pts={[[x, -30], [x, 30]]} width={2.5} color="#6a7fa8" z={0.001} />
      ))}
    </Part>
    {glint > 0 ? <Glow rx={60} color="#ffffff" alpha={0.5 * glint} additive x={240} z={0.01} /> : null}
  </X>
);

/** Planet disc: Mars (default) or the Moon, with craters and an optional polar cap. */
export const Planet: React.FC<XProps & { r?: number; kind?: "mars" | "moon" | "earth"; glow?: number; seed?: number }> = ({ r = 300, kind = "mars", glow = 0.6, seed = 4, ...xf }) => {
  const col = kind === "mars" ? "#c8643a" : kind === "moon" ? "#b9b6b0" : "#2f7fd0";
  const crater = kind === "mars" ? "#a24e2c" : "#8f8c88";
  const rr = rng(seed);
  const cr = Array.from({ length: 9 }, () => {
    const a = rr() * Math.PI * 2;
    const d = Math.sqrt(rr()) * r * 0.7;
    return [Math.cos(a) * d, Math.sin(a) * d, r * (0.05 + rr() * 0.1)] as [number, number, number];
  });
  return (
    <X {...xf}>
      {glow > 0 ? <Glow rx={r * 1.3} color={kind === "mars" ? "#ff9a6a" : kind === "moon" ? "#e8eef8" : "#7fbfff"} alpha={0.3 * glow} additive z={-0.01} /> : null}
      <Part shape={circle(r)} color={col} shade={0.3} light={{ dir: [-0.7, 0.6] }}>
        {kind !== "earth"
          ? cr.map(([x, y, s], i) => <Part key={i} shape={ellipse(s, s * 0.85)} color={crater} flat outline={3} x={x} y={y} z={0.001} />)
          : null}
        {kind === "mars" ? <Part shape={ellipse(r * 0.35, r * 0.1)} color="#f6f1ea" flat outline={3} y={r * 0.88} z={0.002} /> : null}
        {kind === "earth" ? (
          <>
            <Part shape={blob([[-r * 0.6, r * 0.5], [-r * 0.2, r * 0.62], [r * 0.05, r * 0.3], [-r * 0.1, -r * 0.1], [-r * 0.35, -r * 0.45], [-r * 0.6, -r * 0.1]], 8)} color="#5fa84a" flat outline={4} z={0.001} />
            <Part shape={blob([[r * 0.25, r * 0.55], [r * 0.6, r * 0.45], [r * 0.7, r * 0.05], [r * 0.4, -r * 0.3], [r * 0.15, -r * 0.05]], 8)} color="#6ab04a" flat outline={4} z={0.001} />
            <Part shape={ellipse(r * 0.45, r * 0.08)} color="#ffffff" flat outline={0} opacity={0.55} x={-r * 0.1} y={r * 0.15} rot={0.2} z={0.002} />
          </>
        ) : null}
        {kind === "mars"
          ? [-0.3, 0.1].map((k) => <Line key={k} pts={[[-r * 0.6, k * r], [-r * 0.1, k * r + r * 0.12], [r * 0.5, k * r - r * 0.05]]} smooth width={6} color="#b0552f" z={0.001} />)
          : null}
      </Part>
    </X>
  );
};

/** Concrete landing pad with the big X and a yellow ring (top view squashed for a low angle). */
export const LandingPad: React.FC<XProps & { r?: number; squash?: number; lights?: number }> = ({ r = 520, squash = 0.22, lights = 0, ...xf }) => (
  <X {...xf} sy={(xf.sy ?? 1) * squash}>
    <Part shape={circle(r)} color="#9a9a9e" flat outline={6} />
    <Part shape={circle(r * 0.8)} color="#e8c84a" flat outline={0} z={0.001} />
    <Part shape={circle(r * 0.74)} color="#9a9a9e" flat outline={0} z={0.002} />
    <Line pts={[[-r * 0.45, -r * 0.45], [r * 0.45, r * 0.45]]} width={36} color="#f4f1ea" z={0.003} />
    <Line pts={[[-r * 0.45, r * 0.45], [r * 0.45, -r * 0.45]]} width={36} color="#f4f1ea" z={0.003} />
    {lights > 0 ? <Glow rx={r * 1.2} color="#fff2c6" alpha={0.25 * lights} additive z={0.004} /> : null}
  </X>
);

/** Launch pad block with a small lattice tower (Falcon 1 / Falcon 9 era). Origin = deck centre. */
export const LaunchPad: React.FC<XProps & { w?: number; tower?: number; towerX?: number }> = ({ w = 700, tower = 0, towerX = 220, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, 90, 6)} color="#a9a7a2" shade={0.2} y={-45} />
    <Part shape={roundRect(w * 0.3, 70, 4)} color="#4a464a" flat outline={4} y={-50} z={0.001} />
    {tower > 0 ? (
      <Part shape={roundRect(60, tower, 2)} color="#b9502f" shade={0.18} x={towerX} y={tower / 2} z={-0.01}>
        {Array.from({ length: Math.floor(tower / 70) }, (_, i) => (
          <Line key={i} pts={[[-24, -tower / 2 + i * 70], [24, -tower / 2 + i * 70 + 70]]} width={3} color="#6a2a1a" z={0.001} />
        ))}
      </Part>
    ) : null}
  </X>
);

/** A starry dark-blue space backdrop with a soft band of light. */
export const SpaceBack: React.FC<XProps & { w?: number; h?: number; seed?: number }> = ({ w = 4400, h = 2600, seed = 6, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const stars = Array.from({ length: 170 }, () => [(r() - 0.5) * w, (r() - 0.5) * h, 1.5 + r() * 3.2, r() * 6.28] as [number, number, number, number]);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color="#0a0e22" flat outline={0} z={-0.2} />
      <Glow rx={w * 0.45} ry={h * 0.18} rot={-0.35} color="#3a3a7a" alpha={0.35} additive z={-0.19} />
      {stars.map(([x, y, s, ph], i) => (
        <Part key={i} shape={circle(s)} color="#ffffff" flat outline={0} x={x} y={y} opacity={0.55 + 0.45 * Math.sin(frame * 0.08 + ph)} z={-0.18} />
      ))}
    </X>
  );
};
