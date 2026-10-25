import React from "react";
import { spring, staticFile } from "remotion";
import { C, FONT_HAND, FONT_LABEL, FPS, INK, ip, rand } from "./theme";

export type Pt = [number, number];

/** Catmull-Rom spline through points, as an SVG path. */
export const smooth = (pts: Pt[], closed = true, t = 1): string => {
  const n = pts.length;
  const p = (i: number) =>
    closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * t, p1[1] + ((p2[1] - p0[1]) / 6) * t];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * t, p2[1] - ((p3[1] - p1[1]) / 6) * t];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? d + " Z" : d;
};

export const ellipseD = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 ${-rx * 2},0 Z`;

/** Scalloped, hand-wobbled blob around a center (clouds, bushes, puffs). */
export const blobD = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  lumps = 7,
  amt = 0.18,
) => {
  const pts: Pt[] = [];
  const k = 40;
  const ph = rand(seed) * Math.PI;
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2;
    // |sin| gives rounded bumps meeting in soft cusps, like a drawn cloud edge
    const scallop = Math.abs(Math.sin((a * lumps) / 2 + ph));
    const jitter = (rand(seed * 13 + Math.floor((a * lumps) / Math.PI)) - 0.5) * amt * 0.6;
    const r = 1 - amt * 0.5 + amt * scallop + jitter;
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return smooth(pts, true);
};

/** Shared SVG definitions: pencil grain and the line-boil wobble filter. */
export const Defs: React.FC<{ frame: number; boil?: number }> = ({ frame, boil = 2.6 }) => {
  // Lines "boil" at ~7.5 fps like hand-redrawn animation frames.
  const seed = Math.floor(frame / 4) % 9;
  return (
    <defs>
      <pattern id="tex" width="512" height="512" patternUnits="userSpaceOnUse">
        <image href={staticFile("japan/pencil.png")} width="512" height="512" />
      </pattern>
      <filter id="wobble" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={boil * 2} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
  );
};

type PencilProps = {
  d: string;
  fill?: string;
  ink?: string | false;
  sw?: number;
  off?: Pt;
  opacity?: number;
  fillOpacity?: number;
  dash?: string;
};

/** A shape coloured with pencil (slightly mis-registered) and outlined in ink. */
export const Pencil: React.FC<PencilProps> = ({
  d,
  fill,
  ink = INK,
  sw = 4,
  off = [3, 2],
  opacity = 1,
  fillOpacity = 1,
  dash,
}) => (
  <g opacity={opacity}>
    {fill ? (
      <g transform={`translate(${off[0]},${off[1]})`} opacity={fillOpacity}>
        <path d={d} fill={fill} />
        <path d={d} fill="url(#tex)" />
      </g>
    ) : null}
    {ink ? (
      <path
        d={d}
        fill="none"
        stroke={ink}
        strokeWidth={sw}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={dash}
      />
    ) : null}
  </g>
);

/** Pencil shading with no outline (shadows, blush, hatching areas). */
export const Shade: React.FC<{ d: string; fill: string; opacity?: number }> = ({ d, fill, opacity = 0.6 }) => (
  <g opacity={opacity}>
    <path d={d} fill={fill} />
    <path d={d} fill="url(#tex)" />
  </g>
);

export const Ink: React.FC<{ d: string; sw?: number; color?: string; dash?: string; opacity?: number }> = ({
  d,
  sw = 4,
  color = INK,
  dash,
  opacity = 1,
}) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={dash}
    opacity={opacity}
  />
);

/** An ink line that draws itself on as `p` goes 0 -> 1. */
export const DrawOn: React.FC<{ d: string; p: number; sw?: number; color?: string; dotted?: boolean }> = ({
  d,
  p,
  sw = 4,
  color = INK,
  dotted,
}) => {
  if (p <= 0) return null;
  if (dotted) {
    // Dotted travel path (storybook butterfly trail): reveal via mask.
    return (
      <g>
        <mask id={`m${d.length}${Math.round(sw * 10)}`}>
          <path
            d={d}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={sw * 4}
            strokeDasharray="1 1"
            strokeDashoffset={1 - p}
          />
        </mask>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`0.1 ${sw * 3.2}`}
          mask={`url(#m${d.length}${Math.round(sw * 10)})`}
        />
      </g>
    );
  }
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1 1"
      strokeDashoffset={1 - Math.min(1, p)}
    />
  );
};

/** Springy pop-in scale for something appearing at frame `at`. */
export const pop = (f: number, at: number, stiff = 170, damping = 11) =>
  f < at ? 0 : spring({ frame: f - at, fps: FPS, config: { damping, stiffness: stiff, mass: 0.7 } });

/** Group scaled around (x, y) – the anchor stays put. */
export const Pop: React.FC<{ s: number; x: number; y: number; children: React.ReactNode; rot?: number }> = ({
  s,
  x,
  y,
  rot = 0,
  children,
}) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s}) translate(${-x},${-y})`}>{children}</g>
  );

/** Hand-lettered label. `p` (0-1) types the letters on. */
export const Label: React.FC<{
  x: number;
  y: number;
  text: string;
  size?: number;
  color?: string;
  p?: number;
  rot?: number;
  font?: string;
  anchor?: "start" | "middle" | "end";
  halo?: boolean;
  weight?: number;
}> = ({ x, y, text, size = 56, color = INK, p = 1, rot = 0, font = FONT_LABEL, anchor = "middle", halo = true }) => {
  const n = Math.round(text.length * Math.max(0, Math.min(1, p)));
  if (n <= 0) return null;
  const shown = text.slice(0, n);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {halo ? (
        <text
          fontFamily={font}
          fontSize={size}
          textAnchor={anchor}
          fill="none"
          stroke={C.white}
          strokeWidth={size * 0.22}
          strokeLinejoin="round"
          opacity={0.85}
        >
          {shown}
        </text>
      ) : null}
      <text fontFamily={font} fontSize={size} textAnchor={anchor} fill={color}>
        {shown}
      </text>
    </g>
  );
};

/** Speech / thought bubble in yellow pencil (history-explainer style). */
export const Bubble: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  s: number;
  tail: Pt;
  size?: number;
  fill?: string;
  thought?: boolean;
  textP?: number;
}> = ({ x, y, w, h, text, s, tail, size = 46, fill = C.yellow, thought, textP = 1 }) => {
  if (s <= 0.001) return null;
  const r = Math.min(26, h / 2);
  const body = thought
    ? blobD(x, y, w / 2, h / 2, 31, 8, 0.12)
    : `M${x - w / 2 + r},${y - h / 2} H${x + w / 2 - r} Q${x + w / 2},${y - h / 2} ${x + w / 2},${y - h / 2 + r} V${y + h / 2 - r} Q${x + w / 2},${y + h / 2} ${x + w / 2 - r},${y + h / 2} H${x + 24} L${tail[0]},${tail[1]} L${x - 12},${y + h / 2} H${x - w / 2 + r} Q${x - w / 2},${y + h / 2} ${x - w / 2},${y + h / 2 - r} V${y - h / 2 + r} Q${x - w / 2},${y - h / 2} ${x - w / 2 + r},${y - h / 2} Z`;
  return (
    <Pop s={s} x={tail[0]} y={tail[1]}>
      <Pencil d={body} fill={fill} sw={4} />
      {thought ? (
        <>
          <Pencil d={ellipseD((x + tail[0]) / 2, (y + h / 2 + tail[1]) / 2, 13, 10)} fill={fill} sw={3.5} />
          <Pencil d={ellipseD(tail[0], tail[1], 7, 6)} fill={fill} sw={3} />
        </>
      ) : null}
      {text.split("\n").map((line, i, arr) => (
        <Label
          key={i}
          x={x}
          y={y + size * 0.35 + (i - (arr.length - 1) / 2) * size * 1.05}
          text={line}
          size={size}
          font={FONT_HAND}
          halo={false}
          p={textP}
        />
      ))}
    </Pop>
  );
};

/** Storybook sun: pencil disc with little ink rays. */
export const Sun: React.FC<{ x: number; y: number; r?: number; f: number; color?: string }> = ({
  x,
  y,
  r = 60,
  f,
  color = C.sun,
}) => {
  const rays = [];
  const spin = f * 0.15;
  for (let i = 0; i < 12; i++) {
    const a = ((i * 30 + spin) * Math.PI) / 180;
    const r1 = r + 16;
    const r2 = r + (i % 2 ? 34 : 44);
    rays.push(
      <Ink
        key={i}
        d={`M${x + Math.cos(a) * r1},${y + Math.sin(a) * r1} L${x + Math.cos(a) * r2},${y + Math.sin(a) * r2}`}
        sw={4}
      />,
    );
  }
  return (
    <g>
      <Pencil d={ellipseD(x, y, r)} fill={color} />
      <Shade d={ellipseD(x + r * 0.15, y + r * 0.15, r * 0.7)} fill={C.orange} opacity={0.35} />
      {rays}
    </g>
  );
};

export const Cloud: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; fill?: string; opacity?: number }> = ({
  x,
  y,
  w,
  h,
  seed = 1,
  fill = C.white,
  opacity = 1,
}) => <Pencil d={blobD(x, y, w / 2, h / 2, seed, 6, 0.22)} fill={fill} opacity={opacity} sw={3.5} />;

/** Little "~" birds flapping. */
export const Birds: React.FC<{ x: number; y: number; f: number; n?: number; dx?: number }> = ({ x, y, f, n = 3, dx = 0.8 }) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const bx = x + i * 46 + f * dx + Math.sin(i * 3) * 10;
      const by = y + (i % 2) * 26 + Math.sin(f / 9 + i) * 6;
      const flap = Math.sin(f / 3 + i * 2) * 8;
      return (
        <Ink
          key={i}
          sw={3}
          d={`M${bx - 14},${by - flap * 0.3} Q${bx - 7},${by - 8 - flap} ${bx},${by} Q${bx + 7},${by - 8 - flap} ${bx + 14},${by - flap * 0.3}`}
        />
      );
    })}
  </g>
);

export const Sparkle: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = INK }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Ink d="M0,-18 L0,18 M-18,0 L18,0" sw={4} color={color} />
      <Ink d="M-8,-8 L8,8 M-8,8 L8,-8" sw={2.5} color={color} />
    </g>
  );

export const Heart: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = C.pink }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Pencil
        d="M0,14 C-26,-4 -18,-24 -6,-20 C-2,-19 0,-15 0,-12 C0,-15 2,-19 6,-20 C18,-24 26,-4 0,14 Z"
        fill={color}
        sw={3}
        off={[2, 1]}
      />
    </g>
  );

/** "!!" surprise marks (storybook style). */
export const Bang: React.FC<{ x: number; y: number; s: number; n?: number }> = ({ x, y, s, n = 2 }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {new Array(n).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${(i - (n - 1) / 2) * 16},0) rotate(${(i - (n - 1) / 2) * 10})`}>
          <Ink d="M0,-34 L0,-6" sw={6} />
          <path d={ellipseD(0, 6, 3.6)} fill={INK} />
        </g>
      ))}
    </g>
  );

export const Question: React.FC<{ x: number; y: number; s: number; size?: number; rot?: number }> = ({
  x,
  y,
  s,
  size = 80,
  rot = 0,
}) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Label x={0} y={size * 0.35} text="?" size={size} font={FONT_HAND} />
    </g>
  );

/** Puff of dust/smoke made of a few pencil blobs. */
export const Puff: React.FC<{ x: number; y: number; p: number; size?: number; fill?: string; seed?: number }> = ({
  x,
  y,
  p,
  size = 60,
  fill = C.gray,
  seed = 3,
}) => {
  if (p <= 0 || p >= 1) return null;
  const o = ip(p, [0.5, 1], [1, 0]);
  return (
    <g opacity={o}>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + seed;
        const d = p * size * 1.1;
        const r = size * (0.35 + 0.35 * p) * (0.7 + rand(seed + i) * 0.5);
        return (
          <Pencil
            key={i}
            d={blobD(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.5 - p * size * 0.6, r, r * 0.85, seed + i, 5, 0.16)}
            fill={fill}
            sw={3}
          />
        );
      })}
    </g>
  );
};

export type Cam = { x: number; y: number; z: number; r?: number };

/** Camera: (x, y) in world space is placed at the frame centre. */
export const Camera: React.FC<{ cam: Cam; shake?: [number, number]; children: React.ReactNode }> = ({
  cam,
  shake = [0, 0],
  children,
}) => (
  <g
    transform={`translate(${960 + shake[0]},${540 + shake[1]}) rotate(${cam.r ?? 0}) scale(${cam.z}) translate(${-cam.x},${-cam.y})`}
  >
    {children}
  </g>
);

/** Ease a camera through keyframes [frame, cam]. */
export const camAt = (f: number, keys: [number, Cam][]): Cam => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, c0] = keys[i];
    const [f1, c1] = keys[i + 1];
    if (f <= f1) {
      const t = ip(f, [f0, f1], [0, 1]);
      return {
        x: c0.x + (c1.x - c0.x) * t,
        y: c0.y + (c1.y - c0.y) * t,
        z: c0.z * Math.pow(c1.z / c0.z, t),
        r: (c0.r ?? 0) + ((c1.r ?? 0) - (c0.r ?? 0)) * t,
      };
    }
  }
  return keys[keys.length - 1][1];
};

/** Earthquake-style shake, strength 0..1. */
export const shakeAt = (f: number, strength: number): [number, number] =>
  strength <= 0
    ? [0, 0]
    : [
        (rand(Math.floor(f / 2) * 1.7) - 0.5) * 28 * strength,
        (rand(Math.floor(f / 2) * 3.1 + 5) - 0.5) * 22 * strength,
      ];
