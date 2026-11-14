import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X } from "../context";
import { Glow, Gradient } from "../effects";
import { circle, ellipse, roundRect } from "../shapes";
import { rng } from "../random";
import { Monitor } from "./gadgets";

// Stock-market look, matched to the user's reference: a trading room with a
// big dark wall screen, a faint grid and ONE jagged, realistic price line,
// rows of desks with monitors in front and a wall clock. Titles and the big
// value are hand-lettered Labels (kind "hand") pinned over the screen in the
// shot (useScr), never text drawn in here.

export const MARKET_GREEN = "#4fd17c";
export const MARKET_RED = "#ff5a4e";
export const SCREEN_DARK = "#141518";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Jagged price path through key values (0..1, evenly spaced). Seeded,
 * correlated wiggle between the keys so it reads like a real market line;
 * the first and last points stay exactly on their keys.
 */
export const stockPath = (values: number[], n = 64, jag = 0.03, seed = 7): number[] => {
  const r = rng(seed);
  const out: number[] = [];
  let drift = 0;
  for (let i = 0; i < n; i++) {
    const u = (i / (n - 1)) * (values.length - 1);
    const a = Math.floor(u);
    const b = Math.min(values.length - 1, a + 1);
    const f = u - a;
    const base = values[a] + (values[b] - values[a]) * f;
    drift = drift * 0.45 + (r() - 0.5) * 2 * jag;
    const edge = Math.min(i, n - 1 - i);
    out.push(base + drift * Math.min(1, edge / 2));
  }
  return out;
};

/**
 * One price line on a dark screen: faint grid, the line growing left→right
 * (`k` 0..1) with a soft glow and a bright tip. Origin = centre of the plot.
 */
export const StockLine: React.FC<{
  w: number;
  h: number;
  values: number[];
  k?: number;
  color?: string;
  width?: number;
  n?: number;
  jag?: number;
  seed?: number;
  grid?: boolean;
  gridColor?: string;
  x?: number;
  y?: number;
  z?: number;
}> = ({ w, h, values, k = 1, color = MARKET_GREEN, width = 8, n = 64, jag = 0.03, seed = 7, grid = true, gridColor = "#25272c", x = 0, y = 0, z = 0 }) => {
  const frame = useCurrentFrame();
  const ys = stockPath(values, n, jag, seed);
  const px = (i: number) => -w / 2 + (i / (n - 1)) * w;
  const py = (v: number) => -h / 2 + clamp01(v) * h;
  const upto = (n - 1) * clamp01(k);
  const pts: [number, number][] = [];
  for (let i = 0; i <= Math.floor(upto); i++) pts.push([px(i), py(ys[i])]);
  const fr = upto - Math.floor(upto);
  if (fr > 0 && Math.floor(upto) < n - 1) {
    const i = Math.floor(upto);
    pts.push([px(i) + (px(i + 1) - px(i)) * fr, py(ys[i] + (ys[i + 1] - ys[i]) * fr)]);
  }
  const tip = pts[pts.length - 1];
  return (
    <X x={x} y={y} z={z}>
      {grid
        ? [
            ...[0, 1, 2, 3].map((r) => <Line key={`h${r}`} pts={[[-w / 2 - 30, -h / 2 + (r / 3) * h], [w / 2 + 30, -h / 2 + (r / 3) * h]]} width={3} color={gridColor} />),
            ...[0, 1, 2, 3, 4, 5].map((c) => <Line key={`v${c}`} pts={[[-w / 2 + (c / 5) * w, -h / 2 - 20], [-w / 2 + (c / 5) * w, h / 2 + 20]]} width={3} color={gridColor} />),
          ]
        : null}
      {pts.length > 1 ? <Line pts={pts} width={width * 3} color={color} opacity={0.16} z={0.001} /> : null}
      {pts.length > 1 ? <Line pts={pts} width={width} color={color} z={0.002} /> : null}
      {tip && k > 0.001 ? (
        <X x={tip[0]} y={tip[1]} z={0.003}>
          <Glow rx={46} color={color} alpha={0.35 + 0.12 * Math.sin(frame * 0.35)} additive />
          <Part shape={circle(width * 0.85)} color="#effff4" flat outline={0} />
        </X>
      ) : null}
    </X>
  );
};

/** Bold wall clock (thick rim, heavy ticks, chunky hands). `hour` + `minute` set the time; `run` minutes per second. */
export const WallClock: React.FC<{ x?: number; y?: number; z?: number; r?: number; hour?: number; minute?: number; run?: number }> = ({ x = 0, y = 0, z = 0, r = 170, hour = 3, minute = 58, run = 0.4 }) => {
  const frame = useCurrentFrame();
  const mins = hour * 60 + minute + (frame / 30) * run;
  const am = ((mins % 60) / 60) * Math.PI * 2;
  const ah = (((mins / 60) % 12) / 12) * Math.PI * 2;
  const hand = (a: number, len: number) => [[0, 0], [Math.sin(a) * len, Math.cos(a) * len]] as [number, number][];
  return (
    <X x={x} y={y} z={z}>
      <Part shape={circle(r)} color="#55585f" shade={0.2} outline={8} />
      <Part shape={circle(r * 0.84)} color="#f7f6f2" shade={0.1} outline={6} z={0.001} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const big = i % 3 === 0;
        const r0 = r * (big ? 0.6 : 0.66);
        return <Line key={i} pts={[[Math.sin(a) * r0, Math.cos(a) * r0], [Math.sin(a) * r * 0.76, Math.cos(a) * r * 0.76]]} width={big ? 12 : 8} color="#211b20" z={0.002} />;
      })}
      <Line pts={hand(ah, r * 0.42)} width={17} color="#211b20" z={0.003} />
      <Line pts={hand(am, r * 0.66)} width={11} color="#211b20" z={0.004} />
      <Part shape={circle(r * 0.07)} color="#211b20" flat outline={0} z={0.005} />
    </X>
  );
};

/** A row of trading desks: long counter with monitors, keyboards and mice. Origin = counter top centre. */
export const TradingDesks: React.FC<{ y: number; x0?: number; spacing?: number; n?: number; s?: number; z?: number; glow?: string }> = ({
  y,
  x0 = -1500,
  spacing = 430,
  n = 8,
  s = 1,
  z = 0,
  glow,
}) => {
  const mw = 270;
  const mh = 180;
  return (
    <X y={y} s={s} z={z}>
      <Part shape={roundRect(5200, 230, 0)} color="#5f636b" shade={0.1} y={-115 - 18} />
      <Part shape={roundRect(5200, 46, 12)} color="#a9adb4" shade={0.14} z={0.001} />
      {Array.from({ length: n }, (_, i) => {
        const mx = x0 + i * spacing;
        return (
          <X key={i} x={mx} z={0.002 + i * 0.0001}>
            <Monitor y={23 + 96 + mh / 2} w={mw} h={mh} screen={glow ?? "#18191c"} />
            <Part shape={roundRect(210, 22, 6)} color="#3b3e45" shade={0.15} x={-20} y={30} z={0.002} />
            <Part shape={ellipse(20, 12)} color="#3b3e45" shade={0.15} x={130} y={30} z={0.002} />
          </X>
        );
      })}
    </X>
  );
};

/**
 * Trading room: slate wall, big wall screen (children draw in screen space,
 * origin = screen centre), optional wall clock, `front` (characters, a bell)
 * between the wall and the desks, then 0–2 rows of desks. World origin =
 * frame centre at zoom 1.
 */
export const MarketWall: React.FC<{
  sx?: number;
  sy?: number;
  sw?: number;
  sh?: number;
  wall?: string;
  clock?: boolean;
  clockX?: number;
  clockY?: number;
  rows?: number;
  glow?: string;
  /** screen face and bezel colours (e.g. a green chalkboard in a wooden frame for older eras) */
  screen?: string;
  bezel?: string;
  front?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ sx = 230, sy = 190, sw = 1320, sh = 640, wall = "#2b3c48", clock = true, clockX = -730, clockY = 170, rows = 2, glow = MARKET_GREEN, screen = SCREEN_DARK, bezel = "#2a2b30", front, children }) => (
  <>
    <Gradient w={5200} h={3200} stops={[[0, "#1f2b33"], [0.55, wall], [1, "#334957"]]} z={-41} />
    <Part shape={roundRect(5200, 26, 0)} color="#1c262d" flat outline={5} y={sy + sh / 2 + 120} z={-40} />
    <Part shape={roundRect(5200, 1400, 0)} color="#3b4148" shade={0.08} y={-420 - 700} z={-39} />
    <Part shape={roundRect(5200, 22, 0)} color="#262b31" flat outline={5} y={-420} z={-38.9} />
    {clock ? <WallClock x={clockX} y={clockY} r={175} z={-35} /> : null}
    <X x={sx} y={sy} z={-30}>
      <Glow rx={sw * 0.75} ry={sh * 0.8} color={glow} alpha={0.06} additive z={-0.01} />
      <Part shape={roundRect(sw + 44, sh + 44, 20)} color={bezel} shade={0.12} outline={8} />
      <Part shape={roundRect(sw, sh, 8)} color={screen} flat outline={0} z={0.001} />
      <X z={0.002}>{children}</X>
    </X>
    <X z={0}>{front}</X>
    {rows >= 2 ? <TradingDesks y={-340} x0={-1340} spacing={440} n={7} z={6} /> : null}
    {rows >= 1 ? <TradingDesks y={-575} x0={-1560} spacing={470} n={8} s={1.12} z={8} /> : null}
  </>
);
