import React from "react";
import { C, FONT_TITLE, INK, rand } from "./theme";
import { blobD, ellipseD, Ink, Pencil } from "./draw";

/** Admiral Yi's turtle ship (geobukseon): dragon head, spiked roof, oars. */
export const TurtleShip: React.FC<{ x: number; y: number; s?: number; f: number; fire?: number; flip?: boolean }> = ({ x, y, s = 1, f, fire = 0, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${Math.sin(f / 10) * 1.5})`}>
    {/* oars */}
    {new Array(7).fill(0).map((_, i) => (
      <Ink key={i} d={`M${-200 + i * 62},10 l${-14 + Math.sin(f / 4 + i) * 12},60`} sw={5} color={C.darkBrown} />
    ))}
    <Pencil d="M-300,-30 L300,-30 Q290,30 230,40 L-230,40 Q-290,30 -300,-30 Z" fill="#8a5a3a" />
    <Pencil d="M-280,-20 L280,-20 L276,0 L-276,0 Z" fill={C.red} sw={3} />
    {/* the armoured, spiked roof */}
    <Pencil d="M-260,-30 Q-250,-150 0,-160 Q250,-150 260,-30 Z" fill="#6f8a6a" />
    {new Array(6).fill(0).map((_, r) =>
      new Array(9).fill(0).map((__, c) => {
        const t = (c + 0.5) / 9;
        const px = -230 + t * 460;
        const py = -40 - Math.sin(t * Math.PI) * (100 - r * 18) * 1.1;
        return r % 2 === 0 || c % 2 === 0 ? <Ink key={`${r}-${c}`} d={`M${px},${py} l-4,-14 M${px},${py} l6,-12`} sw={2.5} /> : null;
      }),
    )}
    <Ink d="M-240,-40 Q0,-160 240,-40" sw={3} opacity={0.4} />
    {/* gun ports */}
    {[-180, -100, -20, 60, 140].map((px) => (
      <Pencil key={px} d={ellipseD(px, -10, 9, 7)} fill="#2b2b35" sw={2.5} />
    ))}
    {/* dragon head */}
    <Pencil d="M280,-40 C320,-90 370,-110 400,-96 C420,-86 410,-60 380,-56 L392,-40 C360,-30 320,-24 290,-20 Z" fill={C.yellow} />
    <path d={ellipseD(372, -84, 6)} fill={INK} />
    <Ink d="M392,-56 L372,-50 M330,-104 l-6,-22 M348,-108 l2,-22" sw={3} />
    {fire > 0 && fire < 1 ? (
      <g opacity={1 - fire}>
        {[0, 1, 2].map((i) => (
          <Pencil key={i} d={blobD(420 + fire * 140 + i * 30, -60 - i * 12, 30 + fire * 40, 22 + fire * 30, i + 2, 6, 0.2)} fill={i ? C.gray : C.lava} sw={3} />
        ))}
      </g>
    ) : null}
  </g>
);

/** A Japanese supply ship loaded with rice bales; `sink` (0-1) tilts it under. */
export const SupplyShip: React.FC<{ x: number; y: number; s?: number; f: number; sink?: number }> = ({ x, y, s = 1, f, sink = 0 }) => (
  <g transform={`translate(${x},${y + sink * 120}) scale(${s}) rotate(${Math.sin(f / 9) * 2 + sink * 30})`} opacity={1 - Math.max(0, sink - 0.7) / 0.3}>
    <Pencil d="M-170,-20 L170,-20 L140,30 L-140,30 Z" fill={C.brown} />
    <Pencil d="M-4,-20 L-4,-200 L4,-200 L4,-20 Z" fill={C.darkBrown} sw={3} />
    <Pencil d="M-80,-190 L80,-190 L84,-70 L-84,-70 Z" fill="#e8dcc0" />
    {[-60, -20, 20, 60].map((bx) => (
      <Ink key={bx} d={`M${bx},-190 L${bx},-70`} sw={2} opacity={0.5} />
    ))}
    {[-110, -60, 60, 110].map((bx) => (
      <g key={bx}>
        <Pencil d={blobD(bx, -38, 24, 18, 5, 3, 0.06)} fill={C.straw} sw={2.5} />
        <Ink d={`M${bx - 12},-52 Q${bx - 16},-38 ${bx - 12},-24 M${bx + 10},-52 Q${bx + 6},-38 ${bx + 10},-24`} sw={2} color={C.darkBrown} />
      </g>
    ))}
  </g>
);

/** Big cauldron over a fire, for melting the weapons. */
export const Cauldron: React.FC<{ x: number; y: number; s?: number; f: number; glow?: number }> = ({ x, y, s = 1, f, glow = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-1, 0, 1].map((k) => {
      const h = 70 + Math.sin(f / 2.5 + k * 2) * 12;
      return <Pencil key={k} d={`M${k * 60 - 34},0 C${k * 60 - 40},${-h * 0.5} ${k * 60 - 8},${-h * 0.7} ${k * 60},${-h} C${k * 60 + 8},${-h * 0.7} ${k * 60 + 40},${-h * 0.5} ${k * 60 + 34},0 Z`} fill={C.lava} sw={3} />;
    })}
    <Pencil d="M-170,-60 L170,-60 Q160,60 0,70 Q-160,60 -170,-60 Z" fill="#3d3d44" />
    <Pencil d="M-180,-74 h360 v18 h-360 Z" fill="#55555e" sw={3.5} />
    <path d={ellipseD(0, -72, 160, 14)} fill={C.lava} opacity={0.7 * glow} />
    <path d={ellipseD(0, -90, 150, 50)} fill="#f8a24a" opacity={0.35 * glow} filter="url(#soft)" />
  </g>
);

/** A heap of swords and spears; `n` of them. */
export const WeaponPile: React.FC<{ x: number; y: number; n: number; s?: number }> = ({ x, y, n, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {new Array(n).fill(0).map((_, i) => {
      const a = (rand(i + 3) - 0.5) * 70;
      const dx = (rand(i + 9) - 0.5) * 160;
      const dy = -Math.floor(i / 5) * 16;
      const spear = i % 3 === 1;
      return (
        <g key={i} transform={`translate(${dx},${dy}) rotate(${a})`}>
          {spear ? (
            <g>
              <Pencil d="M-110,-3 L90,-3 L90,3 L-110,3 Z" fill={C.brown} sw={2.5} />
              <Pencil d="M90,-8 L124,0 L90,8 Z" fill={C.gray} sw={2.5} />
            </g>
          ) : (
            <g>
              <Pencil d="M-40,-4 L100,-6 Q110,0 100,4 L-40,4 Z" fill="#dfe3e8" sw={2.5} />
              <Pencil d="M-80,-5 L-40,-5 L-40,5 L-80,5 Z" fill="#2b2b35" sw={2.5} />
              <Pencil d="M-44,-11 L-36,-11 L-36,11 L-44,11 Z" fill={C.bronze} sw={2} />
            </g>
          )}
        </g>
      );
    })}
  </g>
);

/** Seoul's great south gate: stone base with an arch and a two-tier roof. */
export const CityGate: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-260,0 L-240,-170 L240,-170 L260,0 Z" fill={C.gray} />
    {[-130, 0, 130].map((bx) => (
      <Ink key={bx} d={`M${bx - 120},-60 h240 M${bx - 120},-120 h240`} sw={2} opacity={0.4} />
    ))}
    <Pencil d="M-60,0 L-60,-90 Q0,-150 60,-90 L60,0 Z" fill="#3d3434" />
    <Pencil d="M-220,-170 h440 v-70 h-440 Z" fill={C.red} sw={3.5} />
    <Pencil d="M-300,-230 Q0,-250 300,-230 L250,-280 L-250,-280 Z" fill="#4b4f5c" />
    <Pencil d="M-170,-280 h340 v-50 h-340 Z" fill={C.red} sw={3.5} />
    <Pencil d="M-240,-320 Q0,-340 240,-320 L190,-370 L-190,-370 Z" fill="#4b4f5c" />
  </g>
);

/** Drifting fog banks. */
export const Fog: React.FC<{ f: number; opacity: number; y?: number; n?: number }> = ({ f, opacity, y = 700, n = 9 }) =>
  opacity <= 0.01 ? null : (
    <g opacity={opacity}>
      {new Array(n).fill(0).map((_, i) => {
        const fx = ((rand(i) * 2600 + f * (1.2 + rand(i + 4))) % 2800) - 500;
        const fy = y - 260 + rand(i + 2) * 480;
        return <path key={i} d={blobD(fx, fy, 260 + rand(i + 5) * 160, 70 + rand(i + 6) * 40, i + 1, 7, 0.14)} fill={C.white} opacity={0.75} filter="url(#soft)" />;
      })}
    </g>
  );

/** A little cuckoo (hototogisu). `sing` opens the beak, `scared` ruffles it. */
export const Songbird: React.FC<{ x: number; y: number; s?: number; f: number; sing?: boolean; scared?: boolean; flip?: boolean }> = ({
  x,
  y,
  s = 1,
  f,
  sing,
  scared,
  flip,
}) => {
  const hop = sing ? Math.abs(Math.sin(f / 4)) * 6 : 0;
  return (
    <g transform={`translate(${x},${y - hop}) scale(${flip ? -s : s},${s})`}>
      <Pencil d="M-40,-30 L-86,-14 L-80,-2 L-36,-14 Z" fill="#6f7680" sw={3} />
      <Pencil d={ellipseD(0, -34, 46, 34)} fill="#8a919b" />
      <Pencil d="M-10,-30 Q10,4 40,-26 Q30,-6 0,-4 Z" fill={C.white} sw={2.5} />
      {[0, 1, 2].map((k) => (
        <Ink key={k} d={`M${6 + k * 8},${-18 + k * 3} l8,-2`} sw={2} opacity={0.6} />
      ))}
      <Pencil d={ellipseD(30, -66, 24, 22)} fill="#8a919b" />
      <path d={ellipseD(38, -70, scared ? 7 : 5, scared ? 8 : 5)} fill={C.white} stroke={INK} strokeWidth={2} />
      <path d={ellipseD(39, -69, 2.5)} fill={INK} />
      {sing ? (
        <Pencil d="M50,-66 L74,-74 L60,-62 L76,-52 L50,-58 Z" fill={C.yellow} sw={2.5} />
      ) : (
        <Pencil d="M50,-66 L72,-62 L50,-58 Z" fill={C.yellow} sw={2.5} />
      )}
      <Ink d="M-6,0 l-4,14 M10,0 l4,14" sw={3} color={C.darkBrown} />
      {scared ? <Ink d="M12,-104 l-6,-18 M30,-104 l0,-20 M46,-100 l8,-16" sw={3} /> : null}
    </g>
  );
};

/** Music notes floating up (drawn, since the fonts lack the glyph). */
export const Notes: React.FC<{ x: number; y: number; f: number; on: boolean; color?: string }> = ({ x, y, f, on, color = INK }) =>
  !on ? null : (
    <g>
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 12) % 36) / 36;
        const nx = x + i * 34 + Math.sin(t * 6 + i) * 10;
        const ny = y - t * 120;
        return (
          <g key={i} opacity={t < 0.8 ? 1 : (1 - t) / 0.2} transform={`translate(${nx},${ny})`}>
            <path d={ellipseD(0, 0, 10, 8)} fill={color} />
            <Ink d="M9,-2 L9,-38 Q18,-30 24,-30" sw={3.5} color={color} />
          </g>
        );
      })}
    </g>
  );

/** A tree branch for the bird to sit on. */
export const Branch: React.FC<{ x0: number; x1: number; y: number }> = ({ x0, x1, y }) => (
  <g>
    <Pencil d={`M${x0},${y + 8} Q${(x0 + x1) / 2},${y - 10} ${x1},${y} L${x1},${y + 14} Q${(x0 + x1) / 2},${y + 6} ${x0},${y + 22} Z`} fill={C.darkBrown} sw={3} />
    {[0.25, 0.7].map((t) => (
      <Pencil key={t} d={blobD(x0 + (x1 - x0) * t, y - 20, 26, 14, t * 10, 5, 0.15)} fill={C.green} sw={2.5} />
    ))}
  </g>
);

/** Hourglass; `p` is how much sand has fallen. */
export const Hourglass: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-50,-110 h100 v14 h-100 Z M-50,96 h100 v14 h-100 Z" fill={C.darkBrown} sw={3} />
    <Pencil d="M-40,-96 L40,-96 Q40,-30 6,0 Q40,30 40,96 L-40,96 Q-40,30 -6,0 Q-40,-30 -40,-96 Z" fill="#eef4f8" sw={3.5} />
    <path d={`M${-34 * (1 - p)},${-90 + 84 * p} L${34 * (1 - p)},${-90 + 84 * p} L0,-4 Z`} fill={C.sun} opacity={1 - p * 0.98} />
    <path d={`M-36,92 L36,92 L${30 - 26 * p},${92 - 70 * p} L${-30 + 26 * p},${92 - 70 * p} Z`} fill={C.sun} opacity={Math.min(1, p * 3)} />
    {p > 0 && p < 1 ? <Ink d="M0,-2 L0,88" sw={2} color={C.sun} /> : null}
  </g>
);

/** Tokugawa crest: three hollyhock leaves in a ring. */
export const TokugawaCrest: React.FC<{ x: number; y: number; r: number; color?: string }> = ({ x, y, r, color = C.darkGreen }) => (
  <g>
    <Pencil d={ellipseD(x, y, r)} fill={C.white} sw={Math.max(2, r * 0.07)} />
    {[0, 1, 2].map((k) => {
      const a = (k / 3) * Math.PI * 2 - Math.PI / 2;
      const cx = x + Math.cos(a) * r * 0.42;
      const cy = y + Math.sin(a) * r * 0.42;
      const rot = (a * 180) / Math.PI + 90;
      return (
        <g key={k} transform={`rotate(${rot},${cx},${cy})`}>
          <Pencil d={`M${cx},${cy + r * 0.36} C${cx - r * 0.5},${cy} ${cx - r * 0.3},${cy - r * 0.42} ${cx},${cy - r * 0.2} C${cx + r * 0.3},${cy - r * 0.42} ${cx + r * 0.5},${cy} ${cx},${cy + r * 0.36} Z`} fill={color} sw={Math.max(1.5, r * 0.05)} />
        </g>
      );
    })}
  </g>
);

/** A simple Christian cross. */
export const Cross: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.bronze }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-7,-60 h14 v120 h-14 Z M-36,-30 h72 v14 h-72 Z" fill={color} sw={3} />
  </g>
);

/** A rubber stamp with a word in a rectangle ("BANNED"). */
export const RectStamp: React.FC<{ x: number; y: number; s: number; text: string; rot?: number; w?: number }> = ({ x, y, s, text, rot = -10, w = 520 }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={0.92}>
      <path d={`M${-w / 2},-80 h${w} v160 h${-w} Z`} fill="none" stroke={C.red} strokeWidth={12} />
      <path d={`M${-w / 2 + 16},-64 h${w - 32} v128 h${-w + 32} Z`} fill="none" stroke={C.red} strokeWidth={4} />
      <text x={0} y={40} fontFamily={FONT_TITLE} fontSize={110} textAnchor="middle" fill={C.red}>
        {text}
      </text>
    </g>
  );

/** A grid of tiny people icons; the last `gone` fraction are greyed out. */
export const PeopleGrid: React.FC<{ x: number; y: number; cols: number; rows: number; shown: number; gone?: number; gap?: number }> = ({
  x,
  y,
  cols,
  rows,
  shown,
  gone = 0,
  gap = 34,
}) => {
  const total = cols * rows;
  const n = Math.round(total * Math.max(0, Math.min(1, shown)));
  const keep = Math.round(total * (1 - gone));
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const px = x + (c - (cols - 1) / 2) * gap;
        const py = y + r * gap * 1.15;
        const out = rand(i * 1.7) * total >= keep;
        return (
          <g key={i} opacity={out ? 0.22 : 1}>
            <path d={ellipseD(px, py - 18, 7)} fill={out ? C.gray : C.skin} stroke={INK} strokeWidth={2} />
            <path d={`M${px - 9},${py + 4} Q${px},${py - 14} ${px + 9},${py + 4} Z`} fill={out ? C.gray : C.white} stroke={INK} strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
};

/** Two great wooden doors closing over the screen; p: 0 open, 1 shut. */
export const BigDoors: React.FC<{ p: number; w?: number; h?: number }> = ({ p, w = 1920, h = 1080 }) =>
  p <= 0 ? null : (
    <g>
      {[-1, 1].map((sd) => {
        const dw = (w / 2) * p;
        const x0 = sd < 0 ? 0 : w - dw;
        return (
          <g key={sd}>
            <Pencil d={`M${x0},-20 h${dw} v${h + 40} h${-dw} Z`} fill="#8a5a3a" sw={6} />
            {[0.2, 0.5, 0.8].map((t) => (
              <Pencil key={t} d={`M${x0},${h * t - 18} h${dw} v36 h${-dw} Z`} fill="#3d3d44" sw={3} />
            ))}
            {[0.2, 0.5, 0.8].map((t) =>
              new Array(Math.max(0, Math.floor(dw / 90))).fill(0).map((_, k) => (
                <path key={`${t}-${k}`} d={ellipseD(x0 + 45 + k * 90, h * t, 7)} fill={C.bronze} stroke={INK} strokeWidth={2} />
              )),
            )}
            {new Array(Math.max(0, Math.floor(dw / 120))).fill(0).map((_, k) => (
              <Ink key={k} d={`M${x0 + 60 + k * 120},0 L${x0 + 60 + k * 120},${h}`} sw={2} opacity={0.35} />
            ))}
          </g>
        );
      })}
      {p > 0.98 ? <Pencil d={`M${w / 2 - 70},${h * 0.5 - 30} h140 v60 h-140 Z`} fill={C.bronze} sw={4} /> : null}
    </g>
  );

/** Dejima: a small fan-shaped artificial island with warehouses and a bridge. */
export const Dejima: React.FC<{ x: number; y: number; s?: number; f: number; flag?: boolean }> = ({ x, y, s = 1, f, flag = true }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-360,0 Q0,-120 360,0 L300,150 Q0,70 -300,150 Z" fill="#c9b48a" />
    <Ink d="M-340,10 Q0,-104 340,10" sw={3} opacity={0.4} />
    {[-220, -110, 0, 110, 220].map((bx, i) => (
      <g key={bx} transform={`translate(${bx},${40 - Math.cos((bx / 360) * 1.4) * 40})`}>
        <Pencil d="M-44,0 h88 v-60 h-88 Z" fill={i % 2 ? C.white : "#e8dcc0"} sw={3} />
        <Pencil d="M-54,-56 L0,-90 L54,-56 Z" fill="#4b4f5c" sw={3} />
      </g>
    ))}
    {flag ? (
      <g transform="translate(250,-40)">
        <Ink d="M0,0 L0,-150" sw={5} />
        {["#c0392b", C.white, "#2f4f9f"].map((col, k) => (
          <Pencil key={k} d={`M0,${-150 + k * 22} q40,${-6 + Math.sin(f / 5 + k) * 4} 80,0 v22 q-40,${-6 + Math.sin(f / 5 + k) * 4} -80,0 Z`} fill={col} sw={2.5} />
        ))}
      </g>
    ) : null}
    {/* the one narrow bridge to the mainland */}
    <Pencil d="M-30,90 h60 v220 h-60 Z" fill={C.brown} sw={3.5} />
    {[110, 150, 190, 230, 270].map((by) => (
      <Ink key={by} d={`M-30,${by} h60`} sw={2} opacity={0.6} />
    ))}
  </g>
);

/** A wooden trade crate. */
export const Crate: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-50,0 h100 v-80 h-100 Z" fill={C.tan} />
    <Ink d="M-50,-80 L50,0 M50,-80 L-50,0" sw={3} opacity={0.6} />
  </g>
);

/** Soft dark vignette for sombre moments. */
export const Vignette: React.FC<{ opacity: number }> = ({ opacity }) =>
  opacity <= 0.01 ? null : (
    <path
      d="M-200,-200 H2120 V1280 H-200 Z M60,540 a900,520 0 1,0 1800,0 a900,520 0 1,0 -1800,0 Z"
      fill="#2b2b35"
      fillRule="evenodd"
      opacity={opacity}
      filter="url(#soft)"
    />
  );
