import React from "react";
import { C, INK, rand } from "./theme";
import { blobD, ellipseD, Ink, Pencil, Pt, Shade, smooth } from "./draw";

const ROOF = "#4b4f5c";
const DARK = "#2b2b35";
const SILVER = "#b9bcc4";

/** Japanese castle keep on a stone base (feet at y). */
export const Castle: React.FC<{ x: number; y: number; s?: number; night?: boolean; lit?: boolean }> = ({ x, y, s = 1, lit }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-260,0 L260,0 L210,-150 L-210,-150 Z" fill={C.gray} />
    {new Array(5).fill(0).map((_, r) =>
      new Array(7).fill(0).map((__, c) => (
        <Ink key={`${r}-${c}`} d={`M${-230 + c * 70 + (r % 2) * 35 + r * 8},${-20 - r * 28} l40,0`} sw={2} opacity={0.5} />
      )),
    )}
    {[0, 1, 2].map((i) => {
      const w = 180 - i * 45;
      const y0 = -150 - i * 120;
      return (
        <g key={i}>
          <Pencil d={`M${-w},${y0} L${w},${y0} L${w},${y0 - 80} L${-w},${y0 - 80} Z`} fill={C.white} />
          {[-1, 0, 1].map((k) => (
            <Pencil
              key={k}
              d={`M${k * w * 0.55 - 16},${y0 - 22} h32 v-34 h-32 Z`}
              fill={lit && (i + k) % 2 === 0 ? C.yellow : DARK}
              sw={2.5}
            />
          ))}
          <Pencil
            d={`M${-w - 60},${y0 - 70} Q${-w - 20},${y0 - 84} ${-w + 10},${y0 - 120} L${w - 10},${y0 - 120} Q${w + 20},${y0 - 84} ${w + 60},${y0 - 70} Q0,${y0 - 86} ${-w - 60},${y0 - 70} Z`}
            fill={ROOF}
          />
        </g>
      );
    })}
    <Pencil d="M-30,-510 L30,-510 L22,-540 L-22,-540 Z" fill={C.bronze} sw={3} />
  </g>
);

export const Moon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 70 }) => (
  <g>
    <path d={ellipseD(x, y, r * 1.8)} fill="#f6ecc0" opacity={0.18} filter="url(#soft)" />
    <Pencil d={`M${x - r * 0.4},${y - r * 0.92} A${r},${r} 0 1,0 ${x + r * 0.9},${y + r * 0.5} A${r * 0.78},${r * 0.78} 0 1,1 ${x - r * 0.4},${y - r * 0.92} Z`} fill="#f4e6a6" />
  </g>
);

export const Candle: React.FC<{ x: number; y: number; lit: number; f: number }> = ({ x, y, lit, f }) => (
  <g transform={`translate(${x},${y})`}>
    <Pencil d="M-26,0 h52 v-14 h-52 Z" fill={C.bronze} sw={3} />
    <Pencil d="M-12,-14 h24 v-70 h-24 Z" fill={C.white} sw={3} />
    {lit > 0 ? (
      <g opacity={lit}>
        <path d={ellipseD(0, -108, 60)} fill="#f8d67a" opacity={0.3} filter="url(#soft)" />
        <Pencil d={`M0,-86 C-12,-100 -6,-120 ${Math.sin(f / 2) * 3},-134 C8,-120 12,-100 0,-86 Z`} fill={C.lava} sw={2.5} />
      </g>
    ) : (
      <Ink d={`M0,-90 q-10,-20 0,-40 q10,-20 0,-40`} sw={3} color={C.gray} opacity={0.6} />
    )}
  </g>
);

/** Mongol (Yuan) war junk with battened sails. */
export const MongolShip: React.FC<{ x: number; y: number; s?: number; tilt?: number; broken?: boolean; flag?: string }> = ({
  x,
  y,
  s = 1,
  tilt = 0,
  broken,
  flag = C.red,
}) => (
  <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${s})`}>
    {[-60, 60].map((mx, i) =>
      broken && i === 1 ? (
        <Pencil key={mx} d={`M${mx - 5},-40 L${mx + 40},-180 L${mx + 50},-176 L${mx + 5},-40 Z`} fill={C.darkBrown} sw={3} />
      ) : (
        <g key={mx}>
          <Pencil d={`M${mx - 5},-40 L${mx - 5},-${i ? 230 : 280} L${mx + 5},-${i ? 230 : 280} L${mx + 5},-40 Z`} fill={C.darkBrown} sw={3} />
          <Pencil d={`M${mx - 55},-${i ? 210 : 260} L${mx + 55},-${i ? 214 : 264} L${mx + 62},-70 L${mx - 62},-66 Z`} fill={broken ? "#c9b48a" : "#d9b979"} />
          {[0, 1, 2, 3].map((k) => (
            <Ink key={k} d={`M${mx - 58},-${(i ? 210 : 260) - 36 - k * 36} L${mx + 60},-${(i ? 214 : 264) - 36 - k * 36}`} sw={2.5} />
          ))}
        </g>
      ),
    )}
    <Pencil d={`M-5,-280 L-5,-320 L40,-306 L-5,-292 Z`} fill={flag} sw={2.5} />
    <Pencil d="M-200,-60 L200,-60 L170,10 Q0,30 -170,10 Z" fill={C.brown} />
    <Pencil d="M120,-60 L210,-110 L220,-56 Z" fill={C.darkBrown} sw={3} />
    <Ink d="M-170,-30 L170,-30" sw={2.5} opacity={0.6} />
    {[-120, -60, 0, 60].map((sx) => (
      <Pencil key={sx} d={ellipseD(sx, -45, 10, 8)} fill={C.white} sw={2} />
    ))}
  </g>
);

/** Explosion burst for the gunpowder bombs. */
export const Boom: React.FC<{ x: number; y: number; p: number; size?: number; seed?: number }> = ({ x, y, p, size = 120, seed = 1 }) => {
  if (p <= 0 || p >= 1) return null;
  const r = size * (0.4 + p * 0.8);
  const o = p < 0.6 ? 1 : 1 - (p - 0.6) / 0.4;
  const pts: Pt[] = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const k = i % 2 ? 0.55 : 1 + rand(seed + i) * 0.25;
    pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]);
  }
  const inner = pts.map(([px, py]) => [x + (px - x) * 0.55, y + (py - y) * 0.55] as Pt);
  return (
    <g opacity={o}>
      <Pencil d={smooth(pts, true, 0.3)} fill={C.lava} sw={4} />
      <Pencil d={smooth(inner, true, 0.3)} fill={C.yellow} sw={3} />
      <Pencil d={blobD(x, y - r * 0.9, r * 0.6, r * 0.4, seed + 9, 6, 0.2)} fill={C.darkGray} sw={3} opacity={p} />
    </g>
  );
};

/** A typhoon with a face: the wind god blowing out a storm. */
export const Typhoon: React.FC<{ x: number; y: number; s?: number; f: number; puff?: number; grin?: boolean }> = ({
  x,
  y,
  s = 1,
  f,
  puff = 1,
  grin,
}) => {
  const spin = f * 4;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <g transform={`rotate(${spin})`}>
        {[0, 1, 2, 3].map((k) => (
          <Pencil
            key={k}
            d={blobD(Math.cos((k / 4) * Math.PI * 2) * 140, Math.sin((k / 4) * Math.PI * 2) * 140, 150, 110, k + 5, 7, 0.18)}
            fill={k % 2 ? C.darkGray : C.gray}
            sw={4}
          />
        ))}
        {[0, 1, 2].map((k) => (
          <Ink key={k} d={`M${-200 + k * 40},0 A${200 - k * 40},${200 - k * 40} 0 0,1 0,${-200 + k * 40}`} sw={5} color={C.white} opacity={0.6} />
        ))}
      </g>
      <Pencil d={ellipseD(0, 0, 150, 140)} fill={C.gray} sw={4.5} />
      {/* face: puffed cheeks blowing */}
      {[-50, 50].map((dx) => (
        <g key={dx}>
          <path d={ellipseD(dx, -30, 22, 26)} fill={C.white} stroke={INK} strokeWidth={4} />
          <path d={ellipseD(dx + 8, -26, 10, 12)} fill={INK} />
        </g>
      ))}
      <Ink d="M-84,-74 L-26,-60 M84,-74 L26,-60" sw={6} />
      <Shade d={ellipseD(-80, 30, 26 * puff, 20 * puff)} fill={C.pink} opacity={0.8} />
      <Shade d={ellipseD(80, 30, 26 * puff, 20 * puff)} fill={C.pink} opacity={0.8} />
      {grin ? (
        <g>
          <path d="M-50,30 Q0,26 50,30 Q44,74 0,76 Q-44,74 -50,30 Z" fill={C.white} stroke={INK} strokeWidth={4} />
          <Ink d="M-46,46 Q0,52 46,46" sw={2.5} />
        </g>
      ) : (
        <Pencil d={ellipseD(0, 48, 22 * puff, 20 * puff)} fill={DARK} sw={3.5} />
      )}
    </g>
  );
};

/** Gusts of wind drawn as curling streaks. */
export const Gusts: React.FC<{ x: number; y: number; f: number; n?: number; dir?: 1 | -1; spread?: number }> = ({
  x,
  y,
  f,
  n = 6,
  dir = 1,
  spread = 420,
}) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const t = ((f * 0.04 + i / n) % 1);
      const gx = x + dir * t * 900;
      const gy = y + (i - n / 2) * (spread / n) + Math.sin(f / 6 + i) * 10;
      return (
        <Ink
          key={i}
          d={`M${gx},${gy} q${dir * 60},-20 ${dir * 120},0 q${dir * 40},20 ${dir * 30},-20`}
          sw={5}
          color={C.white}
          opacity={Math.sin(t * Math.PI)}
        />
      );
    })}
  </g>
);

/** Stone defence wall along the shore (genko borui); `p` builds it row by row. */
export const StoneWall: React.FC<{ x0: number; x1: number; y: number; h: number; p: number }> = ({ x0, x1, y, h, p }) => {
  const rows = 4;
  const bw = 70;
  const bh = h / rows;
  const blocks = [];
  for (let r = 0; r < rows; r++) {
    const rowP = Math.max(0, Math.min(1, p * rows - r));
    const n = Math.floor(((x1 - x0) / bw) * rowP);
    for (let c = 0; c < n; c++) {
      const bx = x0 + c * bw + (r % 2) * (bw / 2);
      if (bx + bw > x1 + bw / 2) continue;
      blocks.push(
        <Pencil key={`${r}-${c}`} d={blobD(bx + bw / 2, y - r * bh - bh / 2, bw / 2 - 2, bh / 2 - 2, r * 31 + c, 4, 0.06)} fill={(r + c) % 3 ? C.gray : "#b0aca4"} sw={3} />,
      );
    }
  }
  return <g>{blocks}</g>;
};

/** Ginkaku-ji, the Silver Pavilion. */
export const SilverPavilion: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-220,0 L220,0 L220,-24 L-220,-24 Z" fill={C.gray} />
    <Pencil d="M-170,-24 L170,-24 L170,-150 L-170,-150 Z" fill={C.tan} />
    {[-120, -60, 0, 60, 120].map((dx) => (
      <Pencil key={dx} d={`M${dx - 22},-34 h44 v-90 h-44 Z`} fill={C.white} sw={2.5} />
    ))}
    <Pencil d="M-240,-140 Q-150,-160 -110,-190 L110,-190 Q150,-160 240,-140 Q0,-170 -240,-140 Z" fill={ROOF} />
    <Pencil d="M-110,-190 L110,-190 L110,-290 L-110,-290 Z" fill={SILVER} />
    {[-60, 0, 60].map((dx) => (
      <Pencil key={dx} d={`M${dx - 20},-205 h40 v-70 h-40 Z`} fill={C.white} sw={2.5} />
    ))}
    <Pencil d="M-170,-280 Q-90,-300 -40,-350 L40,-350 Q90,-300 170,-280 Q0,-310 -170,-280 Z" fill={ROOF} />
    <Pencil d="M-10,-350 L10,-350 L10,-372 L-10,-372 Z" fill={C.bronze} sw={2.5} />
    <Pencil d="M-26,-372 Q0,-410 30,-386 Q12,-392 4,-376 Z" fill={C.bronze} sw={3} />
  </g>
);

/** Tea ceremony set: bowl, whisk, kettle. */
export const TeaSet: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-150,0 L150,0 L150,-16 L-150,-16 Z" fill={C.brown} sw={3} />
    <Pencil d="M-110,-16 C-140,-30 -140,-100 -90,-110 L-50,-110 C0,-100 0,-30 -30,-16 Z" fill={DARK} />
    <Ink d="M-96,-110 Q-70,-140 -44,-110" sw={4} />
    <Ink d={`M-70,-120 q-8,-14 0,-28 q8,-14 0,-28`} sw={3} color={C.gray} opacity={0.5 + 0.3 * Math.sin(f / 8)} />
    <Pencil d="M20,-16 L80,-16 Q80,-56 50,-58 Q20,-56 20,-16 Z" fill="#6b5a4a" sw={3} />
    <Pencil d={ellipseD(50, -52, 30, 7)} fill={C.green} sw={2.5} />
    <Pencil d="M108,-16 L132,-16 L126,-60 L114,-60 Z" fill={C.straw} sw={2.5} />
    <Pencil d="M116,-60 L124,-60 L124,-110 L116,-110 Z" fill={C.tan} sw={2.5} />
  </g>
);

/** Hanging ink painting of mountains. */
export const InkPainting: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-80,0 h160 v260 h-160 Z" fill="#f4e7c4" sw={3.5} />
    <Pencil d="M-90,-8 h180 v12 h-180 Z M-90,256 h180 v12 h-180 Z" fill={C.darkBrown} sw={3} />
    <Shade d="M-60,200 L-20,90 L10,150 L40,70 L64,200 Z" fill={C.darkGray} opacity={0.6} />
    <Ink d="M-60,200 L-20,90 L10,150 L40,70 L64,200" sw={2.5} />
    <Pencil d={ellipseD(40, 40, 12)} fill={C.red} sw={2} />
  </g>
);

export const Cradle: React.FC<{ x: number; y: number; s?: number; baby?: boolean }> = ({ x, y, s = 1, baby }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-90,-20 Q0,30 90,-20 L80,-70 L-80,-70 Z" fill={C.straw} />
    <Ink d="M-70,-50 Q0,-30 70,-50" sw={2.5} opacity={0.6} />
    <Pencil d="M-100,0 Q0,24 100,0" sw={6} />
    {baby ? (
      <g>
        <Pencil d={blobD(0, -74, 50, 24, 3, 3, 0.06)} fill={C.white} sw={3} />
        <Pencil d={ellipseD(-28, -84, 18)} fill={C.skin} sw={3} />
      </g>
    ) : null}
  </g>
);

/** The onion, who is not the Onin War. */
export const Onion: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${Math.sin(f / 6) * 6})`}>
    {[-14, 0, 14].map((dx, i) => (
      <Pencil key={i} d={`M${dx},-140 Q${dx + (i - 1) * 20},-200 ${dx + (i - 1) * 34},-226`} sw={6} ink={C.darkGreen} />
    ))}
    <Pencil d="M0,-150 C70,-140 110,-60 80,-10 C60,20 -60,20 -80,-10 C-110,-60 -70,-140 0,-150 Z" fill="#d9a6c8" />
    <Ink d="M0,-148 C30,-110 34,-40 10,10 M0,-148 C-30,-110 -34,-40 -10,10" sw={3} opacity={0.6} />
    <Ink d="M-12,14 l-6,14 M0,16 l0,16 M12,14 l6,14" sw={3} />
    {[-28, 28].map((dx) => (
      <g key={dx}>
        <path d={ellipseD(dx, -76, 13, 15)} fill={C.white} stroke={INK} strokeWidth={3.5} />
        <path d={ellipseD(dx + 3, -73, 6, 7)} fill={INK} />
      </g>
    ))}
    <Ink d="M-20,-44 Q0,-28 20,-44" sw={4} />
    <Shade d={ellipseD(-50, -52, 10, 7)} fill={C.pink} opacity={0.9} />
    <Shade d={ellipseD(50, -52, 10, 7)} fill={C.pink} opacity={0.9} />
  </g>
);

/** Framed portrait (for grandpa Genghis). */
export const Frame: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <g>
    <Pencil d={`M${x - w / 2 - 18},${y - h / 2 - 18} h${w + 36} v${h + 36} h${-w - 36} Z`} fill={C.bronze} />
    <Pencil d={`M${x - w / 2},${y - h / 2} h${w} v${h} h${-w} Z`} fill="#efe1c0" sw={3} />
    {children}
  </g>
);

/** Round red stamp with a word on it ("NO!"). */
export const Stamp: React.FC<{ x: number; y: number; s: number; text: string; font: string; rot?: number }> = ({ x, y, s, text, font, rot = -12 }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <path d={ellipseD(0, 0, 130, 100)} fill="none" stroke={C.red} strokeWidth={12} />
      <path d={ellipseD(0, 0, 112, 84)} fill="none" stroke={C.red} strokeWidth={4} />
      <text x={0} y={40} fontFamily={font} fontSize={120} textAnchor="middle" fill={C.red}>
        {text}
      </text>
    </g>
  );

/** Tiny ship and soldier icons for counting the fleet. */
export const ShipIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-30,0 L30,0 L22,12 L-22,12 Z" fill={C.brown} sw={2.5} />
    <Pencil d="M-2,0 L-2,-40 M-20,-36 L18,-38 L20,-6 L-22,-6 Z" fill="#d9b979" sw={2.5} />
  </g>
);

export const SoldierIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-10,0 L10,0 L8,-26 L-8,-26 Z" fill="#9a4a3a" sw={2} />
    <Pencil d={ellipseD(0, -34, 9)} fill={C.skin} sw={2} />
    <Pencil d="M-9,-38 L0,-52 L9,-38 Z" fill={C.red} sw={2} />
  </g>
);

/** Rain streaks. */
export const Rain: React.FC<{ f: number; n?: number; slant?: number; w?: number; h?: number; x0?: number; y0?: number }> = ({
  f,
  n = 60,
  slant = 30,
  w = 2400,
  h = 1200,
  x0 = -240,
  y0 = -100,
}) => (
  <g opacity={0.55}>
    {new Array(n).fill(0).map((_, i) => {
      const x = x0 + ((rand(i) * w + f * 14) % w);
      const y = y0 + ((rand(i + 7) * h + f * 38) % h);
      return <Ink key={i} d={`M${x},${y} l${-slant * 0.6},50`} sw={2.5} color={C.white} />;
    })}
  </g>
);
