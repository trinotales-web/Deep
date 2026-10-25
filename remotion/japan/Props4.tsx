import React from "react";
import { C, INK, rand } from "./theme";
import { blobD, ellipseD, Ink, Pencil, Shade } from "./draw";

const ROOF = "#4b4f5c";

/** Kyoto townhouse (machiya): wooden front, lattice, tiled roof. `burnt` greys it into a ruin. */
export const Townhouse: React.FC<{ x: number; y: number; s?: number; seed?: number; burnt?: number }> = ({
  x,
  y,
  s = 1,
  seed = 1,
  burnt = 0,
}) => {
  const w = 150 + (seed % 3) * 20;
  const h = 150 + (seed % 2) * 30;
  const wood = burnt > 0.5 ? "#6b5a4a" : C.tan;
  if (burnt >= 1) {
    return (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <Pencil d={`M${-w / 2},0 L${-w / 2 + 10},${-h * 0.4} L${-w / 4},${-h * 0.25} L0,${-h * 0.5} L${w / 4},${-h * 0.3} L${w / 2 - 6},${-h * 0.45} L${w / 2},0 Z`} fill="#4a4248" />
        <Ink d={`M${-w / 3},-4 L${-w / 3 + 20},${-h * 0.32} M${w / 5},-4 L${w / 5 - 14},${-h * 0.38}`} sw={4} color="#2b2b35" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Pencil d={`M${-w / 2},0 L${w / 2},0 L${w / 2},${-h} L${-w / 2},${-h} Z`} fill={wood} />
      {new Array(6).fill(0).map((_, i) => (
        <Ink key={i} d={`M${-w / 2 + 14 + i * ((w - 28) / 5)},-10 L${-w / 2 + 14 + i * ((w - 28) / 5)},${-h * 0.55}`} sw={2.5} opacity={0.7} />
      ))}
      <Pencil d={`M${-w / 4},0 h${w / 2} v${-h * 0.5} h${-w / 2} Z`} fill={burnt > 0.3 ? "#3a2f2a" : C.darkBrown} sw={3} />
      <Pencil d={`M${-w / 2 - 30},${-h + 10} Q0,${-h - 40} ${w / 2 + 30},${-h + 10} L${w / 2 + 10},${-h - 20} Q0,${-h - 70} ${-w / 2 - 10},${-h - 20} Z`} fill={ROOF} />
      <Pencil d={`M${-w / 2 - 20},${-h * 0.62} h${w + 40} v-14 h${-w - 40} Z`} fill={ROOF} sw={3} />
      {burnt > 0 ? <Shade d={`M${-w / 2},0 L${w / 2},0 L${w / 2},${-h} L${-w / 2},${-h} Z`} fill="#2b2b35" opacity={burnt * 0.55} /> : null}
    </g>
  );
};

/** Flickering flames (base at y). */
export const Flames: React.FC<{ x: number; y: number; s: number; f: number; seed?: number }> = ({ x, y, s, f, seed = 1 }) => {
  if (s <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[-40, 0, 40].map((dx, i) => {
        const h = 120 + rand(seed + i) * 60 + Math.sin(f / 2.2 + i * 2 + seed) * 18;
        const sway = Math.sin(f / 3 + i + seed) * 10;
        return (
          <g key={i}>
            <Pencil d={`M${dx - 36},0 C${dx - 46},${-h * 0.4} ${dx - 10},${-h * 0.6} ${dx + sway},${-h} C${dx + 14},${-h * 0.6} ${dx + 46},${-h * 0.4} ${dx + 36},0 Z`} fill={C.lava} sw={3.5} />
            <Pencil d={`M${dx - 18},0 C${dx - 22},${-h * 0.3} ${dx - 4},${-h * 0.4} ${dx + sway * 0.6},${-h * 0.62} C${dx + 6},${-h * 0.4} ${dx + 22},${-h * 0.3} ${dx + 18},0 Z`} fill={C.yellow} sw={2.5} />
          </g>
        );
      })}
    </g>
  );
};

/** Rising smoke column for fires. */
export const SmokeColumn: React.FC<{ x: number; y: number; f: number; s?: number; seed?: number; opacity?: number }> = ({
  x,
  y,
  f,
  s = 1,
  seed = 0,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    {[0, 1, 2, 3, 4].map((k) => {
      const t = ((f + k * 14 + seed * 9) % 70) / 70;
      return (
        <Pencil
          key={k}
          d={blobD(x + t * 60 * s + Math.sin(t * 5 + k) * 18, y - t * 380 * s, (26 + t * 56) * s, (22 + t * 46) * s, k + seed * 5, 6, 0.18)}
          fill={C.darkGray}
          sw={3}
          opacity={ip01(t)}
        />
      );
    })}
  </g>
);
const ip01 = (t: number) => (t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : 1);

/** Simple stone grave marker with a hat resting on it. */
export const Grave: React.FC<{ x: number; y: number; s?: number; hat?: "monk" | "lord" }> = ({ x, y, s = 1, hat }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-70,0 h140 v-24 h-140 Z" fill={C.darkGray} />
    <Pencil d="M-44,-24 L44,-24 L40,-190 Q0,-214 -40,-190 Z" fill={C.gray} />
    <Ink d="M0,-170 L0,-60 M-16,-140 L16,-140" sw={3} opacity={0.6} />
    {hat === "monk" ? <Pencil d="M-52,-196 Q0,-262 52,-196 Z" fill={C.red} sw={3.5} /> : null}
    {hat === "lord" ? (
      <g>
        <Pencil d="M-48,-200 C-50,-250 -20,-266 0,-266 C20,-266 50,-250 48,-200 Q0,-216 -48,-200 Z" fill="#33406b" sw={3.5} />
        <Pencil d="M-4,-250 C-24,-280 -30,-310 -22,-326 C-14,-300 -6,-280 6,-256 Z M4,-250 C24,-280 30,-310 22,-326 C14,-300 6,-280 -6,-256 Z" fill={C.yellow} sw={3} />
      </g>
    ) : null}
  </g>
);

/** Game-show style answer card. */
export const AnswerCard: React.FC<{ x: number; y: number; s: number; text: string; font: string; crossed: number; color?: string }> = ({
  x,
  y,
  s,
  text,
  font,
  crossed,
  color = C.white,
}) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Pencil d="M-150,-90 h300 v180 h-300 Z" fill={color} sw={5} />
      <text x={0} y={30} fontFamily={font} fontSize={92} textAnchor="middle" fill={INK}>
        {text}
      </text>
      {crossed > 0 ? (
        <g>
          <path d="M-130,-70 L130,70" pathLength={1} stroke={C.red} strokeWidth={16} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, crossed * 2)} fill="none" />
          <path d="M130,-70 L-130,70" pathLength={1} stroke={C.red} strokeWidth={16} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, Math.min(1, crossed * 2 - 1))} fill="none" />
        </g>
      ) : null}
    </g>
  );

/** Lightbulb for "a new idea". */
export const Bulb: React.FC<{ x: number; y: number; s: number; glow: number }> = ({ x, y, s, glow }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {glow > 0 ? <path d={ellipseD(0, -20, 150)} fill="#f8e08a" opacity={0.45 * glow} filter="url(#soft)" /> : null}
      <Pencil d="M-60,-40 C-60,-110 60,-110 60,-40 C60,0 30,10 26,40 L-26,40 C-30,10 -60,0 -60,-40 Z" fill={glow > 0.3 ? C.yellow : C.white} />
      <Pencil d="M-26,40 h52 v16 h-52 Z M-22,56 h44 v14 h-44 Z" fill={C.gray} sw={3} />
      <Ink d="M-14,30 L-8,-30 L0,-10 L8,-30 L14,30" sw={3} />
      {glow > 0.3
        ? new Array(8).fill(0).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <Ink key={i} d={`M${Math.cos(a) * 90},${-40 + Math.sin(a) * 90} L${Math.cos(a) * 120},${-40 + Math.sin(a) * 120}`} sw={5} color={C.sun} />;
          })
        : null}
    </g>
  );

/** Stone pedestal for the high-ranking lord. */
export const Pedestal: React.FC<{ x: number; y: number; h: number; tilt?: number }> = ({ x, y, h, tilt = 0 }) => (
  <g transform={`rotate(${tilt},${x + 80},${y})`}>
    <Pencil d={`M${x - 90},${y} h180 v-24 h-180 Z`} fill={C.darkGray} />
    <Pencil d={`M${x - 70},${y - 24} h140 v${-h} h-140 Z`} fill={C.gray} />
    <Pencil d={`M${x - 90},${y - 24 - h} h180 v-24 h-180 Z`} fill={C.darkGray} />
  </g>
);

/** Little crossed-swords battle marker for maps. */
export const ClashIcon: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={ellipseD(0, 0, 46)} fill={C.lava} opacity={0.35} />
      <Ink d="M-34,34 L34,-34 M-34,-34 L34,34" sw={9} color={INK} />
      <Ink d="M-34,34 L34,-34 M-34,-34 L34,34" sw={5} color={C.white} />
      <Ink d="M-30,18 l12,12 M18,30 l12,-12" sw={6} color={C.darkBrown} />
    </g>
  );
