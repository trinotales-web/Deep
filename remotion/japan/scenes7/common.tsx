import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK } from "../theme";
import { Cam, ellipseD, Ink, Label, Pencil, Pop, Pt } from "../draw";
import { proj } from "../MapArt";

export type SceneProps = { f: number; from: number; to: number };

// Side colours for Part 7.
export const HIDE = "#c9902f"; // Hideyoshi's gold
export const TOKU = C.darkGreen; // Tokugawa green
export const WEST = "#7a5aa0"; // Ieyasu's enemies at Sekigahara
export const KOREA = "#2f4f9f";
export const MING = "#c0392b";

export const SEOUL = proj(126.98, 37.57);
export const BUSAN = proj(129.07, 35.18);
export const BEIJING = proj(116.4, 39.9);
export const HIZEN = proj(129.87, 33.53); // where the army sailed from
export const KYOTO7 = proj(135.76, 35.01);
export const SEKI = proj(136.47, 35.37);
export const EDO = proj(139.69, 35.69);
export const OSAKA = proj(135.5, 34.7);
export const NAGASAKI = proj(129.87, 32.75);
export const SHIMABARA = proj(130.33, 32.79);

/** World point -> screen point for a camera. */
export const scr = (cam: Cam, [x, y]: Pt): Pt => [960 + (x - cam.x) * cam.z, 540 + (y - cam.y) * cam.z];

/** A small pennant planted on the map. */
export const Pennant: React.FC<{ x: number; y: number; s: number; color: string; h?: number }> = ({ x, y, s, color, h = 60 }) =>
  s <= 0.01 ? null : (
    <Pop s={s} x={x} y={y}>
      <Ink d={`M${x},${y} l0,${-h}`} sw={3.5} />
      <Pencil d={`M${x},${y - h} l40,9 l-40,11 Z`} fill={color} sw={3} />
    </Pop>
  );

/** A tear-off calendar card: a big number/word and a small caption. */
export const CalendarCard: React.FC<{ x: number; y: number; s: number; big: string; small: string; color?: string; w?: number }> = ({
  x,
  y,
  s,
  big,
  small,
  color = C.red,
  w = 240,
}) =>
  s <= 0.01 ? null : (
    <Pop s={s} x={x} y={y}>
      <Pencil d={`M${x - w / 2},${y - 110} h${w} v230 h${-w} Z`} fill={C.white} sw={4} />
      <Pencil d={`M${x - w / 2},${y - 110} h${w} v56 h${-w} Z`} fill={color} sw={4} />
      {[-0.3, 0.3].map((k) => (
        <Pencil key={k} d={ellipseD(x + k * w, y - 112, 8, 14)} fill={C.gray} sw={2.5} />
      ))}
      <Label x={x} y={y + 40} text={big} size={86} font={FONT_TITLE} halo={false} />
      <Label x={x} y={y + 96} text={small} size={38} font={FONT_HAND} halo={false} />
    </Pop>
  );

/** A clock face whose hands spin (for "for hours"). */
export const ClockFace: React.FC<{ x: number; y: number; r: number; f: number; speed: number }> = ({ x, y, r, f, speed }) => (
  <g>
    <Pencil d={ellipseD(x, y, r)} fill={C.white} sw={5} />
    {new Array(12).fill(0).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <Ink key={i} d={`M${x + Math.cos(a) * r * 0.8},${y + Math.sin(a) * r * 0.8} L${x + Math.cos(a) * r * 0.9},${y + Math.sin(a) * r * 0.9}`} sw={3} />;
    })}
    <Ink d={`M${x},${y} L${x + Math.sin(f * speed * 0.08) * r * 0.5},${y - Math.cos(f * speed * 0.08) * r * 0.5}`} sw={6} />
    <Ink d={`M${x},${y} L${x + Math.sin(f * speed) * r * 0.75},${y - Math.cos(f * speed) * r * 0.75}`} sw={4} color={C.red} />
    <path d={ellipseD(x, y, 6)} fill={INK} />
  </g>
);

/** A name card that pops in. */
export const NameCard: React.FC<{ x: number; y: number; s: number; text: string; sub?: string; fill?: string; w?: number; rot?: number }> = ({
  x,
  y,
  s,
  text,
  sub,
  fill = C.white,
  w = 600,
  rot = -3,
}) =>
  s <= 0.01 ? null : (
    <Pop s={s} x={x} y={y} rot={rot}>
      <Pencil d={`M${x - w / 2},${y - 60} h${w} v${sub ? 150 : 110} h${-w} Z`} fill={fill} sw={5} />
      <Label x={x} y={y + 18} text={text} size={68} font={FONT_TITLE} color={INK} halo={false} />
      {sub ? <Label x={x} y={y + 72} text={sub} size={40} font={FONT_HAND} halo={false} /> : null}
    </Pop>
  );

/** A tear on a character's cheek (character at x,y with scale s). */
export const Tear: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) =>
  t <= 0 ? null : (
    <path d={ellipseD(x + 26 * s, y - 160 * s + t * 30 * s, 5 * s, 8 * s)} fill={C.sky} stroke={INK} strokeWidth={2} opacity={t < 0.9 ? 1 : (1 - t) * 10} />
  );

/** A pencilled sea with a few waves. */
export const Sea: React.FC<{ f: number; y: number; color?: string }> = ({ f, y, color = C.sea }) => (
  <g>
    <Pencil d={`M-800,${y} Q960,${y - 20} 3000,${y} L3000,1700 L-800,1700 Z`} fill={color} />
    {new Array(10).fill(0).map((_, i) => (
      <Ink key={i} d={`M${-400 + i * 300 + Math.sin(f / 14 + i) * 12},${y + 50 + (i % 3) * 40} q14,-11 28,0 q14,11 28,0`} sw={3} opacity={0.6} />
    ))}
  </g>
);
