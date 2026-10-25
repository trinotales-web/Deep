import React from "react";
import { C, INK } from "./theme";
import { blobD, ellipseD, Ink, Pencil, Pt, Shade } from "./draw";

/** Jomon pit dwelling (tateana): a thatched cone over a sunken floor. */
export const PitHouse: React.FC<{ x: number; y: number; s?: number; smoke?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Shade d={ellipseD(0, 4, 160, 18)} fill={C.darkBrown} opacity={0.35} />
    <Pencil d="M-140,0 C-118,-60 -46,-176 -6,-196 L6,-196 C46,-176 118,-60 140,0 Q0,14 -140,0 Z" fill={C.straw} />
    <Shade d="M20,-190 C60,-160 110,-70 132,-4 Q70,6 30,8 C40,-60 34,-140 20,-190 Z" fill={C.brown} opacity={0.35} />
    {[-90, -55, -20, 15, 50, 85].map((dx, i) => (
      <Ink key={i} d={`M${dx * 0.18},-170 Q${dx * 0.6},-90 ${dx},-12`} sw={2.5} opacity={0.6} />
    ))}
    <Ink d="M-112,-40 Q0,-30 112,-40 M-80,-90 Q0,-82 80,-90" sw={2.5} opacity={0.6} />
    <Pencil d="M-14,-196 L0,-222 L14,-196 Z" fill={C.darkBrown} sw={3} />
    <Pencil d="M-30,2 Q-30,-64 0,-66 Q30,-64 30,2 Z" fill="#4a3426" sw={3.5} />
  </g>
);

/** Yayoi raised-floor granary (takakura). */
export const Granary: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-62, -22, 22, 62].map((dx) => (
      <Pencil key={dx} d={`M${dx - 7},0 L${dx - 6},-96 L${dx + 6},-96 L${dx + 7},0 Z`} fill={C.brown} sw={3} />
    ))}
    {[-62, 62].map((dx) => (
      <Pencil key={dx} d={`M${dx - 16},-92 L${dx + 16},-92 L${dx + 12},-100 L${dx - 12},-100 Z`} fill={C.darkBrown} sw={2.5} />
    ))}
    <Pencil d="M-92,-96 L92,-96 L92,-110 L-92,-110 Z" fill={C.tan} sw={3.5} />
    <Pencil d="M-78,-110 L78,-110 L74,-196 L-74,-196 Z" fill={C.tan} sw={3.5} />
    {[-50, -20, 10, 40].map((dx) => (
      <Ink key={dx} d={`M${dx},-112 L${dx + 1},-194`} sw={2} opacity={0.55} />
    ))}
    <Pencil d="M-120,-180 L-40,-300 L40,-300 L120,-180 Q0,-170 -120,-180 Z" fill={C.straw} />
    <Pencil d="M-48,-300 L-60,-322 L60,-322 L48,-300 Z" fill={C.brown} sw={3} />
    <Ink d="M-90,-200 L-28,-292 M-50,-196 L-8,-292 M0,-192 L12,-292 M50,-196 L32,-292 M90,-200 L44,-292" sw={2.5} opacity={0.55} />
    <Pencil d="M100,0 L132,-104 M120,0 L152,-104" sw={4} />
    {[0, 1, 2, 3].map((i) => (
      <Ink key={i} d={`M${104 + i * 8},${-16 - i * 24} l20,0`} sw={3.5} />
    ))}
  </g>
);

/** Jomon "flame-style" pottery with cord-mark pattern. */
export const JomonPot: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-30,0 C-40,-40 -46,-80 -40,-110 L40,-110 C46,-80 40,-40 30,0 Z" fill={C.terracotta} />
    <Pencil d="M-48,-108 C-56,-130 -40,-150 -30,-136 C-24,-156 -6,-158 -4,-138 C4,-160 24,-156 26,-136 C38,-152 56,-132 48,-108 Z" fill={C.terracotta} />
    <Ink d="M-38,-90 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8 l8,-8" sw={2.5} />
    <Ink d="M-34,-56 q10,-12 20,0 q10,12 20,0 q10,-12 20,0" sw={2.5} />
    <Ink d="M-28,-24 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8" sw={2.5} />
  </g>
);

/** Bronze dotaku bell. */
export const Dotaku: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-22,-62 C-22,-100 22,-100 22,-62 L12,-62 C12,-86 -12,-86 -12,-62 Z" fill={C.bronze} sw={3.5} />
    <Pencil d="M-46,62 L-30,-58 Q0,-70 30,-58 L46,62 Q0,72 -46,62 Z" fill={C.bronze} />
    <Shade d="M10,-60 L28,-56 L42,60 L18,66 Z" fill={C.patina} opacity={0.6} />
    <Ink d="M-38,-10 L38,-10 M-40,14 L40,14 M-42,38 L42,38 M0,-60 L0,-10" sw={2.5} />
    <Ink d="M-30,26 q8,-8 16,0 q8,8 16,0 q8,-8 16,0" sw={2} />
  </g>
);

/** Bronze mirror. */
export const Mirror: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d={ellipseD(0, 0, 56)} fill={C.bronze} />
    <Shade d={ellipseD(14, 14, 34)} fill={C.patina} opacity={0.5} />
    <Ink d={ellipseD(0, 0, 40)} sw={2.5} />
    <Pencil d={ellipseD(0, 0, 10)} fill={C.bronze} sw={3} />
    {new Array(8).fill(0).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <Ink key={i} d={`M${Math.cos(a) * 16},${Math.sin(a) * 16} L${Math.cos(a) * 36},${Math.sin(a) * 36}`} sw={2} />;
    })}
  </g>
);

/** Iron hoe / axe head on a handle. */
export const IronAxe: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(-20)`}>
    <Pencil d="M-5,-80 L5,-80 L6,80 L-6,80 Z" fill={C.brown} sw={3} />
    <Pencil d="M-4,-80 L-4,-46 L-44,-30 C-58,-50 -58,-90 -44,-104 Z" fill={C.iron} sw={3.5} />
  </g>
);

export const IronSickle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(15)`}>
    <Pencil d="M-5,-10 L5,-10 L6,90 L-6,90 Z" fill={C.brown} sw={3} />
    <Pencil d="M-2,-10 C34,-56 82,-36 92,6 C74,-24 40,-30 6,8 Z" fill={C.iron} sw={3.5} />
  </g>
);

export const Bush: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; shake?: number }> = ({
  x,
  y,
  w,
  h,
  seed = 3,
  shake = 0,
}) => (
  <g transform={`rotate(${shake},${x},${y})`}>
    <Pencil d={blobD(x - w * 0.22, y - h * 0.45, w * 0.32, h * 0.42, seed, 5, 0.18)} fill={C.darkGreen} />
    <Pencil d={blobD(x + w * 0.2, y - h * 0.5, w * 0.34, h * 0.48, seed + 1, 5, 0.18)} fill={C.darkGreen} />
    <Pencil d={blobD(x, y - h * 0.32, w * 0.5, h * 0.36, seed + 2, 6, 0.16)} fill={C.green} />
    <Ink d={`M${x - w * 0.3},${y - h * 0.35} q10,-8 20,0 M${x + w * 0.1},${y - h * 0.55} q10,-8 20,0`} sw={2.5} opacity={0.6} />
  </g>
);

export const RoundTree: React.FC<{ x: number; y: number; s?: number; seed?: number; sway?: number }> = ({
  x,
  y,
  s = 1,
  seed = 1,
  sway = 0,
}) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${sway})`}>
    <Pencil d="M-9,0 L-6,-80 L6,-80 L9,0 Z" fill={C.brown} sw={3.5} />
    <Pencil d={blobD(0, -130, 70, 64, seed, 6, 0.16)} fill={seed % 2 ? C.darkGreen : C.green} />
  </g>
);

/** Campfire with flickering flame. */
export const Campfire: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => {
  const fl = Math.sin(f / 2.3) * 4;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Pencil d="M-40,-4 L40,-16 L42,-6 L-38,6 Z" fill={C.brown} sw={3} />
      <Pencil d="M-40,-16 L40,-4 L38,6 L-42,-6 Z" fill={C.darkBrown} sw={3} />
      <Pencil d={`M-24,-10 C-30,-40 -10,-50 ${-4 + fl},-${82 + fl} C6,-56 30,-50 24,-10 Z`} fill={C.lava} sw={3.5} />
      <Pencil d={`M-10,-12 C-12,-30 -2,-36 ${2 - fl},-${52 - fl} C8,-34 14,-30 10,-12 Z`} fill={C.yellow} sw={3} />
    </g>
  );
};

export const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];
export const quadD = (a: Pt, c: Pt, b: Pt) => `M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}`;

export const Arrowhead: React.FC<{ at: Pt; from: Pt; s: number; color?: string }> = ({ at, from, s, color = INK }) => {
  if (s <= 0.01) return null;
  const a = Math.atan2(at[1] - from[1], at[0] - from[0]);
  const l = 26 * s;
  const p1: Pt = [at[0] - Math.cos(a - 0.5) * l, at[1] - Math.sin(a - 0.5) * l];
  const p2: Pt = [at[0] - Math.cos(a + 0.5) * l, at[1] - Math.sin(a + 0.5) * l];
  return <Ink d={`M${p1[0]},${p1[1]} L${at[0]},${at[1]} L${p2[0]},${p2[1]}`} sw={5} color={color} />;
};
