import React from "react";
import { C, INK, rand } from "./theme";
import { blobD, ellipseD, Ink, Pencil } from "./draw";

/** A daimyo's procession: porters with boxes on poles and a palanquin. */
export const Procession: React.FC<{ x: number; y: number; n: number; s?: number; f: number; flip?: boolean }> = ({ x, y, n, s = 1, f, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    {new Array(n).fill(0).map((_, i) => {
      const px = -i * 90;
      const bob = Math.abs(Math.sin(f / 4 + i)) * 4;
      if (i === Math.floor(n / 2)) {
        // the palanquin
        return (
          <g key={i} transform={`translate(${px},${-bob})`}>
            <Ink d="M-90,-90 L90,-90" sw={6} color={C.darkBrown} />
            <Pencil d="M-40,-86 h80 v60 h-80 Z" fill="#2b2b35" sw={3} />
            <Pencil d="M-48,-96 Q0,-118 48,-96 Z" fill="#2b2b35" sw={3} />
            {[-70, 70].map((dx) => (
              <g key={dx}>
                <Pencil d={`M${dx - 8},-60 h16 v40 h-16 Z`} fill={C.indigo} sw={2} />
                <Pencil d={ellipseD(dx, -70, 9)} fill={C.skin} sw={2} />
                <Ink d={`M${dx - 4},-20 L${dx - 6},0 M${dx + 4},-20 L${dx + 6},0`} sw={3} />
              </g>
            ))}
          </g>
        );
      }
      return (
        <g key={i} transform={`translate(${px},${-bob})`}>
          <Ink d="M-30,-58 L30,-58" sw={4} color={C.darkBrown} />
          <Pencil d="M-24,-80 h24 v20 h-24 Z" fill={i % 2 ? C.red : "#2b2b35"} sw={2} />
          <Pencil d="M-8,-50 h16 v32 h-16 Z" fill={C.indigo} sw={2} />
          <Pencil d={ellipseD(0, -58, 9)} fill={C.skin} sw={2} />
          <Ink d="M-4,-18 L-6,0 M4,-18 L6,0" sw={3} />
          {i % 3 === 0 ? <Ink d="M12,-50 L20,-110" sw={3} color={C.darkBrown} /> : null}
          {i % 3 === 0 ? <Pencil d="M14,-110 h24 v40 h-24 Z" fill={C.white} sw={2} /> : null}
        </g>
      );
    })}
  </g>
);

/** A money bag; `full` shrinks it as the coins go. */
export const MoneyBag: React.FC<{ x: number; y: number; s?: number; full?: number }> = ({ x, y, s = 1, full = 1 }) => {
  const k = 0.45 + 0.55 * full;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Pencil d={`M${-70 * k},0 C${-90 * k},${-80 * k} ${-40 * k},${-120 * k} -14,${-130 * k} L14,${-130 * k} C${40 * k},${-120 * k} ${90 * k},${-80 * k} ${70 * k},0 Z`} fill={C.tan} />
      <Pencil d={`M-20,${-130 * k} L20,${-130 * k} L26,${-150 * k} L-26,${-150 * k} Z`} fill={C.brown} sw={3} />
      <Pencil d={ellipseD(0, -60 * k, 26 * k)} fill={C.yellow} sw={2.5} />
      <Pencil d={`M${-8 * k},${-68 * k} h${16 * k} v${16 * k} h${-16 * k} Z`} fill={C.tan} sw={2} />
    </g>
  );
};

/** Kabuki stage curtain (black, persimmon and green stripes), drawn open by `open`. */
export const KabukiCurtain: React.FC<{ x0: number; x1: number; y0: number; y1: number; open: number }> = ({ x0, x1, y0, y1, open }) => {
  const cols = ["#2b2b35", "#d9673c", "#2f6f4f"];
  const w = (x1 - x0) * (1 - open);
  const n = 12;
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => (
        <Pencil key={i} d={`M${x0 + (w / n) * i},${y0} h${w / n + 1} v${y1 - y0} h${-w / n - 1} Z`} fill={cols[i % 3]} ink={false} />
      ))}
      {w > 4 ? <Ink d={`M${x0 + w},${y0} L${x0 + w},${y1}`} sw={4} /> : null}
    </g>
  );
};

/** A pencilled homage to a woodblock "great wave" print, with a little Fuji. */
export const WavePrint: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-220,-160 h440 v320 h-440 Z" fill="#efe1c0" sw={5} />
    <Pencil d="M-40,90 L20,30 L80,90 Z" fill={C.white} sw={3} />
    <Pencil d="M-8,62 L20,30 L48,62 Z" fill={C.white} sw={2} />
    <Pencil d="M-210,150 C-200,40 -120,-90 20,-110 C110,-120 150,-60 120,-20 C100,10 60,0 70,-30 C40,-20 10,20 -10,90 C-40,150 -120,150 -210,150 Z" fill="#2f4f8f" />
    <Ink d="M20,-110 C80,-112 130,-80 120,-20" sw={4} color={C.white} />
    {new Array(7).fill(0).map((_, i) => (
      <Ink key={i} d={`M${30 + i * 14},${-112 + i * 4} q6,-14 12,0`} sw={3} color={C.white} />
    ))}
    <Pencil d="M60,160 C100,100 160,90 210,120 L210,150 Z" fill="#4f7fb3" sw={3} />
    <Pencil d="M150,-140 h50 v100 h-50 Z" fill={C.red} sw={2.5} />
  </g>
);

/** A steam locomotive with puffing smoke. */
export const Locomotive: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2, 3].map((i) => {
      const t = ((f * 1.5 + i * 12) % 48) / 48;
      return <Pencil key={i} d={blobD(170 - t * 260, -250 - t * 160, 26 + t * 50, 20 + t * 40, i + 2, 6, 0.18)} fill={C.white} sw={3} opacity={1 - t} />;
    })}
    <Pencil d="M-220,-40 h300 v-130 h-300 Z" fill="#2b2b35" />
    <Pencil d="M-220,-170 h120 v-70 h-120 Z" fill="#3d3d44" />
    <Pencil d="M-200,-230 h80 v40 h-80 Z" fill={C.lightIndigo} sw={3} />
    <Pencil d="M80,-160 Q200,-160 220,-100 L220,-40 L80,-40 Z" fill="#3d3d44" />
    <Pencil d="M140,-160 h40 v-90 h-40 Z M128,-250 h64 v-20 h-64 Z" fill="#2b2b35" sw={3} />
    <Pencil d="M220,-60 L270,-20 L220,-20 Z" fill={C.red} sw={3} />
    <Ink d="M-200,-100 h260" sw={3} color={C.bronze} />
    {[-170, -60, 50, 160].map((wx, i) => (
      <g key={wx} transform={`rotate(${f * 12},${wx},-20)`}>
        <Pencil d={ellipseD(wx, -20, i === 0 ? 34 : 40)} fill={C.red} />
        <Ink d={`M${wx - 30},-20 h60 M${wx},-50 v60`} sw={3} />
      </g>
    ))}
    <Ink d={`M-170,-20 L50,-20`} sw={6} color={C.gray} />
  </g>
);

/** Railway track along y from x0 to x1. */
export const Tracks: React.FC<{ x0: number; x1: number; y: number }> = ({ x0, x1, y }) => (
  <g>
    {new Array(Math.floor((x1 - x0) / 60)).fill(0).map((_, i) => (
      <Pencil key={i} d={`M${x0 + i * 60},${y + 4} h30 v16 h-30 Z`} fill={C.brown} sw={2} />
    ))}
    <Ink d={`M${x0},${y} L${x1},${y} M${x0},${y + 12} L${x1},${y + 12}`} sw={4} color={C.darkGray} />
  </g>
);

/** A modern (19th-century) rifle. */
export const Rifle: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <Pencil d="M-160,-6 L120,-6 L120,4 L-160,4 Z" fill="#3d3d44" sw={3} />
    <Pencil d="M60,-10 L190,-16 L200,22 L130,26 L60,12 Z" fill={C.brown} sw={3} />
    <Pencil d="M-170,-14 L-156,-14 L-156,4 L-170,4 Z" fill={C.gray} sw={2} />
    <Ink d="M70,10 q4,16 14,18" sw={3} />
  </g>
);

/** A waving revolution flag (blue, white, red). */
export const TricolorFlag: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Ink d="M0,0 L0,-260" sw={6} color={C.darkBrown} />
    {["#2f4f9f", C.white, "#c0392b"].map((col, k) => {
      const w = Math.sin(f / 5 + k) * 8;
      return <Pencil key={k} d={`M${k * 50},-250 L${k * 50 + 50},${-250 + w} L${k * 50 + 50},${-150 + w} L${k * 50},-150 Z`} fill={col} sw={3} />;
    })}
  </g>
);

/** A Western steam warship (a "black ship"): paddle wheel, funnel, guns. */
export const Steamship: React.FC<{ x: number; y: number; s?: number; f: number; guns?: number; flag?: "us" | "uk"; tilt?: number }> = ({
  x,
  y,
  s = 1,
  f,
  guns = 0,
  flag = "us",
  tilt = 0,
}) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${tilt})`}>
    {[0, 1, 2].map((i) => {
      const t = ((f + i * 16) % 48) / 48;
      return <Pencil key={i} d={blobD(40 - t * 200, -300 - t * 120, 30 + t * 50, 24 + t * 36, i + 3, 6, 0.18)} fill="#55555e" sw={3} opacity={1 - t} />;
    })}
    {/* masts and furled sails */}
    {[-200, 200].map((mx) => (
      <g key={mx}>
        <Pencil d={`M${mx - 5},-60 L${mx - 5},-360 L${mx + 5},-360 L${mx + 5},-60 Z`} fill={C.darkBrown} sw={3} />
        <Pencil d={`M${mx - 90},-300 h180 v14 h-180 Z M${mx - 70},-220 h140 v14 h-140 Z`} fill={C.white} sw={2.5} />
      </g>
    ))}
    <Pencil d="M20,-80 h40 v-200 h-40 Z" fill="#2b2b35" sw={3} />
    <Pencil d="M-340,-80 L330,-80 L290,40 Q0,70 -300,40 Z" fill="#2b2b35" />
    <Ink d="M-320,-50 L310,-50" sw={3} color={C.white} opacity={0.7} />
    {/* paddle wheel */}
    <Pencil d={ellipseD(80, -40, 80, 74)} fill="#3d3d44" />
    {new Array(8).fill(0).map((_, i) => {
      const a = (i / 8) * Math.PI * 2 + f / 10;
      return <Ink key={i} d={`M80,-40 L${80 + Math.cos(a) * 70},${-40 + Math.sin(a) * 66}`} sw={3} color={C.gray} />;
    })}
    {/* gun ports */}
    {[-280, -200, -120, 180, 250].map((gx, i) => (
      <g key={gx}>
        <Pencil d={`M${gx - 14},-36 h28 v22 h-28 Z`} fill={C.white} sw={2.5} />
        {guns > 0 ? <Pencil d={`M${gx - 6},-30 h${12} v10 h-12 Z M${gx - 4},-26 L${gx - 4 - 40 * guns * (i % 2 ? 1 : 0.8)},-26`} fill="#2b2b35" sw={6} /> : null}
      </g>
    ))}
    {/* flag */}
    <g transform="translate(200,-360)">
      {flag === "us" ? (
        <g>
          {new Array(6).fill(0).map((_, k) => (
            <Pencil key={k} d={`M0,${k * 10} h90 v10 h-90 Z`} fill={k % 2 ? C.white : "#c0392b"} sw={1.5} />
          ))}
          <Pencil d="M0,0 h38 v32 h-38 Z" fill="#2f4f9f" sw={2} />
          {[0, 1, 2].map((k) => (
            <path key={k} d={ellipseD(8 + k * 11, 10 + (k % 2) * 10, 2.5)} fill={C.white} />
          ))}
        </g>
      ) : (
        <Pencil d="M0,0 h90 v60 h-90 Z" fill="#2f4f9f" sw={2} />
      )}
    </g>
  </g>
);

/** A big cannon on a wheeled carriage; `fire` (0-1) flashes and smokes. */
export const Cannon: React.FC<{ x: number; y: number; s?: number; fire?: number; flip?: boolean }> = ({ x, y, s = 1, fire = 0, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    {fire > 0 && fire < 1 ? (
      <g opacity={1 - fire}>
        {[0, 1, 2].map((i) => (
          <Pencil key={i} d={blobD(260 + fire * 160 + i * 40, -110 - i * 20, 50 + fire * 60, 40 + fire * 40, i + 5, 6, 0.2)} fill={i === 0 && fire < 0.3 ? C.yellow : C.white} sw={3} />
        ))}
      </g>
    ) : null}
    <Pencil d="M-140,-80 L220,-140 L230,-100 L-130,-40 Z" fill="#3d3d44" />
    <Pencil d={ellipseD(-140, -60, 30, 34)} fill="#3d3d44" />
    <Pencil d="M-100,-40 L60,-60 L80,0 L-90,0 Z" fill={C.brown} />
    <Pencil d={ellipseD(-40, 0, 46)} fill={C.darkBrown} />
    <Ink d="M-40,-40 L-40,40 M-80,0 L0,0" sw={3} />
  </g>
);

/** A wooden puppet-control cross with strings down to points. */
export const PuppetBar: React.FC<{ x: number; y: number; to: [number, number][]; sway: number }> = ({ x, y, to, sway }) => (
  <g>
    {to.map(([tx, ty], i) => (
      <Ink key={i} d={`M${x + (i - (to.length - 1) / 2) * 60},${y + 8} L${tx + sway},${ty}`} sw={2} opacity={0.8} />
    ))}
    <Pencil d={`M${x - 30 - to.length * 30},${y - 8} h${60 + to.length * 60} v16 h${-60 - to.length * 60} Z`} fill={C.darkBrown} sw={3} />
    <Pencil d={`M${x - 8},${y - 60} h16 v120 h-16 Z`} fill={C.darkBrown} sw={3} />
  </g>
);

/** Little sparks of falling coins. */
export const Coins: React.FC<{ x: number; y: number; f: number; n?: number; on: boolean }> = ({ x, y, f, n = 8, on }) =>
  !on ? null : (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const t = ((f * 1.4 + i * 9) % 40) / 40;
        return (
          <g key={i} opacity={1 - t}>
            <path d={ellipseD(x + (rand(i) - 0.5) * 140 + t * (rand(i + 2) - 0.5) * 200, y + t * 220 - Math.sin(t * Math.PI) * 120, 12, 9)} fill={C.yellow} stroke={INK} strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
