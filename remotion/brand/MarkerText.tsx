import React from "react";
import { rand } from "../japan/theme";

/**
 * Thick round-tipped marker capitals, the hand-lettered look of history
 * thumbnails. Each glyph is a centreline on a 100-unit cap height, drawn as a
 * fat stroke with round caps, so it reads like one pass of a marker. Letters
 * get a little random tilt, bounce and size so no two look stamped.
 */
const GLYPHS: Record<string, [number, string]> = {
  A: [56, "M0,100 L28,0 L56,100 M12,64 L44,64"],
  B: [48, "M0,100 L0,0 L24,0 Q46,0 46,24 Q46,48 22,48 L0,48 M22,48 Q48,48 48,74 Q48,100 22,100 L0,100"],
  C: [50, "M50,16 Q42,0 26,0 Q0,0 0,50 Q0,100 26,100 Q42,100 50,84"],
  D: [50, "M0,0 L0,100 L18,100 Q50,100 50,50 Q50,0 18,0 Z"],
  E: [44, "M44,0 L0,0 L0,100 L44,100 M0,50 L36,50"],
  F: [44, "M44,0 L0,0 L0,100 M0,50 L36,50"],
  G: [52, "M50,16 Q42,0 26,0 Q0,0 0,50 Q0,100 28,100 Q52,100 52,62 L30,62"],
  H: [50, "M0,0 L0,100 M50,0 L50,100 M0,50 L50,50"],
  I: [0, "M0,0 L0,100"],
  J: [44, "M44,0 L44,70 Q44,100 22,100 Q4,100 0,82"],
  K: [48, "M0,0 L0,100 M46,0 L0,60 M14,44 L48,100"],
  L: [42, "M0,0 L0,100 L42,100"],
  M: [64, "M0,100 L6,0 L32,64 L58,0 L64,100"],
  N: [50, "M0,100 L0,0 L50,100 L50,0"],
  O: [56, "M28,0 Q0,0 0,50 Q0,100 28,100 Q56,100 56,50 Q56,0 28,0 Z"],
  P: [46, "M0,100 L0,0 L22,0 Q46,0 46,27 Q46,54 22,54 L0,54"],
  Q: [58, "M28,0 Q0,0 0,50 Q0,100 28,100 Q56,100 56,50 Q56,0 28,0 Z M36,74 L58,104"],
  R: [48, "M0,100 L0,0 L22,0 Q46,0 46,27 Q46,54 22,54 L0,54 M22,54 L48,100"],
  S: [46, "M44,14 Q36,0 22,0 Q2,0 2,24 Q2,44 24,50 Q46,56 46,76 Q46,100 22,100 Q6,100 0,84"],
  T: [56, "M0,0 L56,0 M28,0 L28,100"],
  U: [50, "M0,0 L0,68 Q0,100 25,100 Q50,100 50,68 L50,0"],
  V: [54, "M0,0 L27,100 L54,0"],
  W: [72, "M0,0 L16,100 L36,34 L56,100 L72,0"],
  X: [50, "M0,0 L50,100 M50,0 L0,100"],
  Y: [54, "M0,0 L27,50 L54,0 M27,50 L27,100"],
  Z: [50, "M2,0 L50,0 L0,100 L50,100"],
  "0": [46, "M23,0 Q0,0 0,50 Q0,100 23,100 Q46,100 46,50 Q46,0 23,0 Z"],
  "1": [22, "M0,16 L22,0 L22,100"],
  "2": [46, "M2,20 Q8,0 24,0 Q46,0 46,26 Q46,48 0,100 L46,100"],
  "3": [46, "M0,14 Q8,0 22,0 Q44,0 44,25 Q44,48 20,50 Q46,52 46,76 Q46,100 22,100 Q6,100 0,86"],
  "4": [50, "M38,100 L38,0 L0,68 L50,68"],
  "5": [46, "M44,0 L6,0 L2,46 Q12,40 24,40 Q46,40 46,70 Q46,100 22,100 Q6,100 0,86"],
  "6": [46, "M42,8 Q34,0 24,0 Q0,0 0,56 Q0,100 23,100 Q46,100 46,72 Q46,46 23,46 Q4,46 0,62"],
  "7": [46, "M0,0 L46,0 L14,100"],
  "8": [46, "M23,0 Q2,0 2,24 Q2,48 23,48 Q44,48 44,24 Q44,0 23,0 Z M23,48 Q0,48 0,74 Q0,100 23,100 Q46,100 46,74 Q46,48 23,48 Z"],
  "9": [46, "M4,92 Q12,100 22,100 Q46,100 46,44 Q46,0 23,0 Q0,0 0,28 Q0,54 23,54 Q42,54 46,38"],
  "?": [40, "M0,18 Q6,0 20,0 Q40,0 40,22 Q40,40 22,48 L20,70 M20,97 L20,98"],
  "!": [0, "M0,0 L0,68 M0,97 L0,98"],
  ".": [0, "M0,97 L0,98"],
  ",": [6, "M6,92 L0,108"],
  "-": [30, "M0,55 L30,55"],
  "'": [0, "M0,0 L0,24"],
  ":": [0, "M0,38 L0,39 M0,92 L0,93"],
  "(": [20, "M20,-4 Q-6,48 20,104"],
  ")": [20, "M0,-4 Q26,48 0,104"],
};

const STROKE = 18; // marker width on the 100-unit cap height
const GAP = 4; // between the inked edges of neighbouring letters
const SPACE = 30;

const advance = (ch: string, tracking = 0) => (ch === " " ? SPACE : (GLYPHS[ch]?.[0] ?? 40) + STROKE + GAP) + tracking;

/** Width of a line in cap-height units (multiply by the cap height in px / 100). `tracking` adds space between letters. */
export const markerWidth = (text: string, tracking = 0) =>
  text
    .toUpperCase()
    .split("")
    .reduce((w, ch) => w + advance(ch, tracking), 0) -
  GAP -
  tracking;

export const MarkerText: React.FC<{
  text: string;
  /** Centre of the line. */
  x: number;
  /** Top of the capitals. */
  y: number;
  /** Cap height in px; shrunk if the line would be wider than maxWidth. */
  cap: number;
  maxWidth?: number;
  color?: string;
  seed?: number;
  /** How hand-made it looks: 0 is ruler-straight. */
  jitter?: number;
  /** Stroke width on the 100-unit cap height; a wider pass under the letters makes an outline. */
  weight?: number;
  /** Extra space between letters (cap units), for heavier weights. */
  tracking?: number;
}> = ({ text, x, y, cap, maxWidth = Infinity, color = "#15161d", seed = 1, jitter = 1, weight = STROKE, tracking = 0 }) => {
  const upper = text.toUpperCase();
  const width = markerWidth(upper, tracking);
  const k = Math.min(cap, (maxWidth * 100) / width) / 100;
  let pen = x - (width * k) / 2;
  const letters: React.ReactNode[] = [];
  upper.split("").forEach((ch, i) => {
    const glyph = GLYPHS[ch];
    if (glyph) {
      const [w, d] = glyph;
      const r = (n: number) => rand(seed * 101 + i * 7 + n) - 0.5;
      const rot = r(1) * 7 * jitter;
      const dy = r(2) * 10 * jitter;
      const sc = 1 + r(3) * 0.1 * jitter;
      const cx = pen + ((w + STROKE) / 2) * k;
      letters.push(
        <g key={i} transform={`translate(${cx},${y + 50 * k + dy * k}) rotate(${rot}) scale(${k * sc}) translate(${-w / 2},-50)`}>
          <path d={d} fill="none" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" />
        </g>,
      );
    }
    pen += advance(ch, tracking) * k;
  });
  return <g>{letters}</g>;
};
