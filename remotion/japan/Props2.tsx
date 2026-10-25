import React from "react";
import { C, INK, rand } from "./theme";
import { blobD, ellipseD, Ink, Pencil, Shade } from "./draw";

const VERMILION = "#d8573a";
const ROOF = "#4b4f5c";
const DARK = "#2b2b35";

/** Shinto torii gate (feet at y). */
export const Torii: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-1, 1].map((sd) => (
      <Pencil key={sd} d={`M${sd * 92 - 13},0 L${sd * 86 - 11},-250 L${sd * 86 + 11},-250 L${sd * 92 + 13},0 Z`} fill={VERMILION} />
    ))}
    <Pencil d="M-128,-206 L128,-206 L124,-186 L-124,-186 Z" fill={VERMILION} />
    <Pencil d="M-10,-250 L10,-250 L10,-206 L-10,-206 Z" fill={VERMILION} sw={3} />
    <Pencil d="M-160,-268 Q0,-256 160,-268 L156,-246 Q0,-236 -156,-246 Z" fill={VERMILION} />
    <Pencil d="M-170,-286 Q0,-270 170,-286 L162,-264 Q0,-252 -162,-264 Z" fill={DARK} />
  </g>
);

/** Small Shinto shrine with crossed chigi beams on the roof. */
export const Shrine: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-130,0 L130,0 L130,-26 L-130,-26 Z" fill={C.gray} />
    <Pencil d="M-40,0 L40,0 L32,-26 L-32,-26 Z" fill={C.tan} sw={3} />
    {[-96, -30, 30, 96].map((dx) => (
      <Pencil key={dx} d={`M${dx - 7},-26 L${dx - 7},-130 L${dx + 7},-130 L${dx + 7},-26 Z`} fill={C.brown} sw={3} />
    ))}
    <Pencil d="M-104,-40 L104,-40 L104,-120 L-104,-120 Z" fill={C.tan} />
    <Pencil d="M-26,-40 L26,-40 L26,-110 L-26,-110 Z" fill={C.darkBrown} sw={3} />
    <Pencil d="M-160,-118 L0,-208 L160,-118 L140,-104 L0,-178 L-140,-104 Z" fill={C.darkBrown} />
    <Pencil d="M-150,-112 L0,-196 L150,-112 Z" fill={C.brown} />
    {[-1, 1].map((sd) => (
      <Pencil key={sd} d={`M${sd * 132},-128 L${sd * 166},-226 L${sd * 154},-230 L${sd * 120},-132 Z`} fill={C.darkBrown} sw={3} />
    ))}
    {[-60, -20, 20, 60].map((dx) => (
      <Pencil key={dx} d={ellipseD(dx * 0.7, -186 + Math.abs(dx) * 0.55, 13, 7)} fill={C.tan} sw={2.5} />
    ))}
    {/* shimenawa rope with paper streamers */}
    <Ink d="M-104,-118 Q0,-96 104,-118" sw={7} color={C.straw} />
    {[-50, 0, 50].map((dx) => (
      <Ink key={dx} d={`M${dx},-108 l6,10 l-6,8 l6,10`} sw={3.5} color={C.white} />
    ))}
  </g>
);

/** Five-storey Buddhist pagoda. */
export const Pagoda: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const tiers = [0, 1, 2, 3, 4];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Pencil d="M-100,0 L100,0 L92,-22 L-92,-22 Z" fill={C.gray} />
      {tiers.map((i) => {
        const w = 70 - i * 9;
        const y0 = -22 - i * 78;
        return (
          <g key={i}>
            <Pencil d={`M${-w},${y0} L${w},${y0} L${w},${y0 - 46} L${-w},${y0 - 46} Z`} fill={VERMILION} sw={3.5} />
            <Pencil d={`M${-w * 0.35},${y0} L${w * 0.35},${y0} L${w * 0.35},${y0 - 36} L${-w * 0.35},${y0 - 36} Z`} fill={C.white} sw={2.5} />
            <Pencil
              d={`M${-w - 52},${y0 - 40} Q${-w - 20},${y0 - 52} ${-w + 6},${y0 - 72} L${w - 6},${y0 - 72} Q${w + 20},${y0 - 52} ${w + 52},${y0 - 40} Q0,${y0 - 50} ${-w - 52},${y0 - 40} Z`}
              fill={ROOF}
            />
          </g>
        );
      })}
      <Pencil d="M-5,-412 L5,-412 L5,-540 L-5,-540 Z" fill={C.bronze} sw={3} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Pencil key={i} d={ellipseD(0, -424 - i * 18, 13 - i, 4)} fill={C.bronze} sw={2.5} />
      ))}
      <Pencil d={ellipseD(0, -548, 9)} fill={C.yellow} sw={2.5} />
    </g>
  );
};

/** Seated golden Buddha on a lotus, with a halo. */
export const Buddha: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {glow > 0 ? (
      <g opacity={glow}>
        <path d={ellipseD(0, -170, 150)} fill="#f8dc84" opacity={0.45} filter="url(#soft)" />
        {new Array(16).fill(0).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <Ink
              key={i}
              d={`M${Math.cos(a) * 118},${-170 + Math.sin(a) * 118} L${Math.cos(a) * 150},${-170 + Math.sin(a) * 150}`}
              sw={4}
              color={C.sun}
            />
          );
        })}
      </g>
    ) : null}
    <Pencil d={ellipseD(0, -170, 106)} fill="#f4d98a" sw={3.5} />
    {/* lotus */}
    {[-90, -54, -18, 18, 54, 90].map((dx, i) => (
      <Pencil key={i} d={`M${dx - 30},0 Q${dx - 26},-44 ${dx},-58 Q${dx + 26},-44 ${dx + 30},0 Z`} fill={C.pink} sw={3} />
    ))}
    <Pencil d="M-118,0 Q0,22 118,0 L110,14 Q0,34 -110,14 Z" fill={C.green} sw={3} />
    {/* body */}
    <Pencil d="M-96,-30 C-96,-80 -60,-96 -46,-150 L46,-150 C60,-96 96,-80 96,-30 Q0,-6 -96,-30 Z" fill={C.yellow} />
    <Shade d="M20,-150 C40,-100 80,-80 90,-34 L40,-24 Z" fill={C.bronze} opacity={0.4} />
    <Ink d="M-60,-52 Q0,-30 60,-52 M-40,-150 Q-20,-100 -50,-60" sw={2.5} opacity={0.7} />
    <Pencil d={ellipseD(0, -58, 34, 14)} fill={C.yellow} sw={3} />
    {/* head */}
    <Pencil d={ellipseD(-50, -196, 10, 26)} fill={C.yellow} sw={3} />
    <Pencil d={ellipseD(50, -196, 10, 26)} fill={C.yellow} sw={3} />
    <Pencil d={ellipseD(0, -200, 50, 54)} fill={C.yellow} />
    <Pencil d={ellipseD(0, -262, 26, 20)} fill={C.bronze} sw={3} />
    <Pencil d="M-48,-226 Q0,-270 48,-226 Q0,-244 -48,-226 Z" fill={C.bronze} sw={3} />
    <Ink d="M-30,-198 q11,7 22,0 M8,-198 q11,7 22,0" sw={3.5} />
    <Ink d="M-12,-170 Q0,-162 12,-170" sw={3} />
    <path d={ellipseD(0, -222, 4)} fill={C.red} />
  </g>
);

/** Incense burner with curling smoke. */
export const Incense: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-12, 0, 12].map((dx) => (
      <Ink key={dx} d={`M${dx},-40 L${dx * 1.3},-96`} sw={3} color={C.brown} />
    ))}
    {[0, 1].map((k) => {
      const t = ((f + k * 30) % 60) / 60;
      return (
        <Ink
          key={k}
          d={`M0,-100 q${14 + t * 10},-30 0,-60 q${-14 - t * 10},-30 0,-60`}
          sw={3}
          color={C.gray}
          opacity={0.7 * (1 - Math.abs(t - 0.5) * 1.4)}
        />
      );
    })}
    <Pencil d="M-46,-40 L46,-40 Q40,0 0,4 Q-40,0 -46,-40 Z" fill={C.bronze} />
    <Pencil d="M-30,0 L-36,14 M30,0 L36,14" sw={5} />
  </g>
);

/** String of festival lanterns. */
export const Lanterns: React.FC<{ x0: number; x1: number; y: number; f: number; n?: number }> = ({ x0, x1, y, f, n = 6 }) => (
  <g>
    <Ink d={`M${x0},${y} Q${(x0 + x1) / 2},${y + 50} ${x1},${y}`} sw={3} />
    {new Array(n).fill(0).map((_, i) => {
      const t = (i + 0.5) / n;
      const lx = x0 + (x1 - x0) * t;
      const ly = y + Math.sin(t * Math.PI) * 50 * 0.98;
      const sw = Math.sin(f / 10 + i) * 4;
      return (
        <g key={i} transform={`rotate(${sw},${lx},${ly})`}>
          <Ink d={`M${lx},${ly} L${lx},${ly + 12}`} sw={2.5} />
          <Pencil d={ellipseD(lx, ly + 40, 20, 27)} fill={i % 2 ? C.red : C.white} sw={3} />
          <Pencil d={`M${lx - 12},${ly + 12} h24 v6 h-24 Z M${lx - 12},${ly + 64} h24 v6 h-24 Z`} fill={INK} sw={1.5} />
        </g>
      );
    })}
  </g>
);

/** Festival taiko drum on a stand. */
export const FestivalDrum: React.FC<{ x: number; y: number; s?: number; hit?: number }> = ({ x, y, s = 1, hit = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-60,0 L-40,-70 M60,0 L40,-70" sw={6} />
    <Pencil d="M-56,-150 Q0,-170 56,-150 L56,-60 Q0,-40 -56,-60 Z" fill={VERMILION} />
    <Pencil d={ellipseD(0, -106, 42, 46 * (1 - hit * 0.05))} fill={C.white} sw={3.5} />
    <Ink d="M-56,-140 Q0,-158 56,-140 M-56,-70 Q0,-52 56,-70" sw={2} />
  </g>
);

/** Bird's-eye plan of Heian-kyo (Kyoto): a grid city with the palace to the north. */
export const CityGrid: React.FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) => {
  const lines = [];
  const cols = 9;
  const rows = 10;
  for (let i = 0; i <= cols; i++) {
    const lx = x + (i / cols) * w;
    const k = Math.min(1, Math.max(0, p * 2 - i / cols));
    lines.push(<path key={`c${i}`} d={`M${lx},${y} L${lx},${y + h * k}`} stroke={INK} strokeWidth={i === Math.floor(cols / 2) || i === Math.ceil(cols / 2) ? 4 : 2.5} fill="none" strokeLinecap="round" />);
  }
  for (let j = 0; j <= rows; j++) {
    const ly = y + (j / rows) * h;
    const k = Math.min(1, Math.max(0, p * 2 - 0.3 - j / rows));
    lines.push(<path key={`r${j}`} d={`M${x},${ly} L${x + w * k},${ly}`} stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />);
  }
  const fill = Math.min(1, Math.max(0, p * 1.6 - 0.6));
  const cx = x + w / 2;
  return (
    <g>
      <g opacity={fill}>
        <Shade d={`M${x},${y} h${w} v${h} h${-w} Z`} fill={C.tan} opacity={0.55} />
        {new Array(cols * rows).fill(0).map((_, i) => {
          const cxi = i % cols;
          const cyi = Math.floor(i / cols);
          if (cyi < 2 && cxi >= 3 && cxi <= 5) return null;
          if (rand(i * 7) < 0.45) return null;
          const bx = x + ((cxi + 0.5) / cols) * w;
          const by = y + ((cyi + 0.5) / rows) * h;
          return <Pencil key={i} d={`M${bx - 14},${by + 8} L${bx + 14},${by + 8} L${bx + 14},${by - 4} L${bx},${by - 14} L${bx - 14},${by - 4} Z`} fill={C.brown} sw={2} />;
        })}
        <Shade d={`M${cx - 16},${y + (2 / rows) * h} h32 v${h * 0.8} h-32 Z`} fill={C.white} opacity={0.7} />
        <Pencil d={`M${x + (3 / cols) * w + 6},${y + 6} h${(3 / cols) * w - 12} v${(2 / rows) * h - 12} h${-((3 / cols) * w - 12)} Z`} fill={VERMILION} sw={3.5} />
        <Pencil d={`M${cx - 30},${y + h - 6} h60 v-24 h-60 Z`} fill={VERMILION} sw={3} />
      </g>
      {lines}
    </g>
  );
};

/** Pencil "power" bar. */
export const PowerMeter: React.FC<{ x: number; y: number; level: number; w?: number; h?: number; label?: string; color?: string }> = ({
  x,
  y,
  level,
  w = 60,
  h = 260,
}) => {
  const l = Math.max(0, Math.min(1, level));
  const col = l > 0.6 ? C.green : l > 0.3 ? C.yellow : C.red;
  return (
    <g>
      <Pencil d={`M${x - w / 2},${y} h${w} v${-h} h${-w} Z`} fill={C.white} sw={4} />
      {l > 0.01 ? <Pencil d={`M${x - w / 2 + 6},${y - 6} h${w - 12} v${-(h - 12) * l} h${-(w - 12)} Z`} fill={col} ink={false} /> : null}
      <Pencil d={`M${x - w / 2},${y} h${w} v${-h} h${-w} Z`} ink={INK} sw={4} />
      <Ink d={`M${x - w / 2},${y - h * 0.25} h12 M${x - w / 2},${y - h * 0.5} h16 M${x - w / 2},${y - h * 0.75} h12`} sw={3} />
    </g>
  );
};

/** Low wooden throne dais with a canopy. */
export const Throne: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-170,0 L170,0 L160,-40 L-160,-40 Z" fill={C.darkBrown} />
    <Pencil d="M-150,-40 L150,-40 L150,-60 L-150,-60 Z" fill="#c9902f" sw={3} />
    {[-140, 140].map((dx) => (
      <Pencil key={dx} d={`M${dx - 8},-60 L${dx - 8},-380 L${dx + 8},-380 L${dx + 8},-60 Z`} fill={C.darkBrown} sw={3} />
    ))}
    <Pencil d="M-190,-380 Q0,-430 190,-380 L170,-350 Q0,-392 -170,-350 Z" fill={VERMILION} />
    {[-120, -60, 0, 60, 120].map((dx) => (
      <Ink key={dx} d={`M${dx},-362 L${dx * 1.04},-250`} sw={3} color={C.white} opacity={0.8} />
    ))}
    <Ink d="M-140,-250 Q0,-236 140,-250" sw={3} color={C.yellow} />
  </g>
);

/** Countryside manor with a fence. */
export const Manor: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-150,0 L150,0 L150,-120 L-150,-120 Z" fill={C.tan} />
    {[-100, -40, 40, 100].map((dx) => (
      <Pencil key={dx} d={`M${dx - 22},-20 h44 v-70 h-44 Z`} fill={C.white} sw={3} />
    ))}
    <Pencil d="M-200,-110 L-120,-230 L120,-230 L200,-110 Q0,-100 -200,-110 Z" fill={C.straw} />
    <Ink d="M-160,-130 L-100,-222 M-80,-118 L-40,-224 M0,-114 L0,-226 M80,-118 L40,-224 M160,-130 L100,-222" sw={2.5} opacity={0.5} />
    {new Array(14).fill(0).map((_, i) => (
      <Pencil key={i} d={`M${-260 + i * 40},30 l0,-60 l8,-10 l8,10 l0,60 Z`} fill={C.brown} sw={2.5} />
    ))}
    <Ink d="M-266,0 L300,0 M-266,-20 L300,-20" sw={3} />
  </g>
);

export const Signpost: React.FC<{ x: number; y: number; text: string; s?: number; font: string }> = ({ x, y, text, s = 1, font }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-6,0 L-5,-170 L5,-170 L6,0 Z" fill={C.brown} sw={3.5} />
    <Pencil d="M-150,-220 L130,-220 L160,-185 L130,-150 L-150,-150 Z" fill={C.tan} sw={4} />
    <text x={-5} y={-172} fontFamily={font} fontSize={40} textAnchor="middle" fill={INK}>
      {text}
    </text>
  </g>
);

export const RiceBales: React.FC<{ x: number; y: number; n: number; s?: number }> = ({ x, y, n, s = 1 }) => {
  const pos: [number, number][] = [[0, 0], [90, 0], [180, 0], [45, -60], [135, -60], [90, -120]];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {pos.slice(0, n).map(([dx, dy], i) => (
        <g key={i}>
          <Pencil d={blobD(dx, dy - 30, 46, 30, i + 2, 3, 0.05)} fill={C.straw} sw={3.5} />
          <Ink d={`M${dx - 24},${dy - 56} Q${dx - 30},${dy - 30} ${dx - 24},${dy - 4} M${dx + 24},${dy - 56} Q${dx + 18},${dy - 30} ${dx + 24},${dy - 4}`} sw={3} color={C.darkBrown} />
        </g>
      ))}
    </g>
  );
};

/** Tall nobori war banner on a pole. */
export const Banner: React.FC<{ x: number; y: number; color: string; s?: number; wave?: number; crest?: boolean }> = ({
  x,
  y,
  color,
  s = 1,
  wave = 0,
  crest = true,
}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-4,0 L-4,-330 L4,-330 L4,0 Z" fill={C.darkBrown} sw={3} />
    <Ink d="M4,-320 L90,-320" sw={5} />
    <Pencil d={`M4,-318 L88,-318 Q${92 + wave},-220 86,-110 L4,-110 Z`} fill={color} />
    {crest ? <Ink d={ellipseD(46, -270, 20)} sw={3.5} color={color === C.white ? INK : C.white} /> : null}
  </g>
);

/** Parchment scroll; `p` unrolls it. */
export const Scroll: React.FC<{ x: number; y: number; w: number; h: number; p: number; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  p,
  children,
}) => {
  const ww = w * Math.max(0.02, p);
  return (
    <g>
      <Pencil d={`M${x - ww / 2},${y - h / 2} h${ww} v${h} h${-ww} Z`} fill="#f4e7c4" />
      {p > 0.95 ? children : null}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <Pencil d={`M${x + (sd * ww) / 2 - 14},${y - h / 2 - 24} h28 v${h + 48} h-28 Z`} fill={C.darkBrown} sw={3.5} />
          <Pencil d={ellipseD(x + (sd * ww) / 2, y - h / 2 - 28, 18, 8)} fill={C.bronze} sw={3} />
          <Pencil d={ellipseD(x + (sd * ww) / 2, y + h / 2 + 28, 18, 8)} fill={C.bronze} sw={3} />
        </g>
      ))}
    </g>
  );
};

/** Big display sword: katana (long) or wakizashi (short). */
export const BigSword: React.FC<{ x: number; y: number; len: number; s?: number; rot?: number; sheath?: number }> = ({
  x,
  y,
  len,
  s = 1,
  rot = 0,
  sheath = 0,
}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {/* handle */}
    <Pencil d="M-150,-12 L0,-14 L0,14 L-150,12 Z" fill={DARK} />
    {new Array(7).fill(0).map((_, i) => (
      <Ink key={i} d={`M${-140 + i * 20},-11 l10,22 M${-130 + i * 20},-11 l-10,22`} sw={2} color={C.white} opacity={0.85} />
    ))}
    <Pencil d={ellipseD(6, 0, 12, 36)} fill={C.bronze} sw={3.5} />
    {/* blade */}
    <Pencil d={`M16,-12 Q${len * 0.6},-22 ${len},-34 Q${len - 30},-4 ${len * 0.55},10 L16,12 Z`} fill="#e3e7ec" sw={3.5} />
    <Ink d={`M30,4 Q${len * 0.6},-2 ${len - 40},-22`} sw={2} opacity={0.6} />
    {/* scabbard sliding off */}
    {sheath > 0 ? (
      <g transform={`translate(${(1 - sheath) * len * 0.9},0)`}>
        <Pencil d={`M16,-16 Q${len * 0.6},-26 ${len + 6},-38 L${len + 10},-24 Q${len * 0.55},14 16,16 Z`} fill="#3a2226" />
      </g>
    ) : null}
  </g>
);

/** Falling cherry-blossom petals. */
export const Petals: React.FC<{ f: number; n?: number; w?: number; h?: number }> = ({ f, n = 18, w = 1920, h = 1080 }) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const speed = 1.2 + rand(i) * 1.6;
      const px = ((rand(i + 3) * w + f * (1.5 + rand(i + 9))) % (w + 100)) - 50;
      const py = ((rand(i + 5) * h + f * speed) % (h + 100)) - 50;
      const r = f * 3 + i * 40;
      return (
        <g key={i} transform={`translate(${px},${py}) rotate(${r})`}>
          <Pencil d="M0,-9 C8,-9 10,4 0,10 C-10,4 -8,-9 0,-9 Z" fill={C.pink} sw={2} off={[1, 1]} />
        </g>
      );
    })}
  </g>
);

export const CherryTree: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-14,0 C-10,-60 -20,-120 -40,-170 L-24,-176 C-6,-140 6,-120 10,-90 C20,-130 40,-150 60,-170 L72,-160 C44,-130 24,-90 16,0 Z" fill={C.darkBrown} />
    {[[-60, -200, 70], [30, -220, 80], [100, -180, 60], [-110, -160, 55], [-10, -270, 60]].map(([cx, cy, r], i) => (
      <Pencil key={i} d={blobD(cx, cy, r, r * 0.8, i + 20, 7, 0.18)} fill="#ee9fb4" />
    ))}
  </g>
);

/** A few modern buildings, for "even today". */
export const ModernCity: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[
      [-420, 260, 120, C.lightIndigo],
      [-280, 380, 140, C.gray],
      [-120, 300, 110, C.sky],
      [10, 440, 130, C.lightIndigo],
      [160, 330, 120, C.gray],
      [300, 260, 140, C.sky],
    ].map(([bx, bh, bw, col], i) => (
      <g key={i}>
        <Pencil d={`M${bx},0 h${bw} v${-(bh as number)} h${-(bw as number)} Z`} fill={col as string} />
        {new Array(Math.floor((bh as number) / 50)).fill(0).map((_, r) => (
          <g key={r}>
            {[0, 1, 2].map((c) => (
              <path
                key={c}
                d={`M${(bx as number) + 14 + c * ((bw as number) - 28) / 3},${-30 - r * 50} h${((bw as number) - 40) / 3} v-18 h${-((bw as number) - 40) / 3} Z`}
                fill={C.white}
                stroke={INK}
                strokeWidth={2}
                opacity={0.9}
              />
            ))}
          </g>
        ))}
      </g>
    ))}
    <Pencil d="M100,-440 L104,-520 L108,-440 Z" fill={C.red} sw={2.5} />
  </g>
);

/** Little warship for the sea battle. */
export const WarBoat: React.FC<{ x: number; y: number; s?: number; color: string; tilt?: number }> = ({ x, y, s = 1, color, tilt = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${s})`}>
    <Pencil d="M-6,-40 L-6,-260 L6,-260 L6,-40 Z" fill={C.darkBrown} sw={3} />
    <Pencil d="M10,-250 L120,-250 L118,-90 L10,-90 Z" fill={color} />
    <Pencil d="M-180,-30 Q0,50 180,-30 L160,-60 L-160,-60 Z" fill={C.brown} />
    <Ink d="M-150,-44 L150,-44" sw={2.5} opacity={0.6} />
  </g>
);

export const Coin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d={ellipseD(0, 0, 22)} fill={C.bronze} sw={3} />
    <path d="M-6,-6 h12 v12 h-12 Z" fill={INK} />
  </g>
);
