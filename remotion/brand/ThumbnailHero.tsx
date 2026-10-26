import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Defs, ellipseD, Ink, Pencil, Shade } from "../japan/draw";
import { C, INK } from "../japan/theme";
import { MarkerText, markerWidth } from "./MarkerText";
import { Petal } from "./thumbParts";

/**
 * "HISTORY OF JAPAN": a single-hero thumbnail. One big samurai portrait drawn
 * for the thumbnail (not a cast figure), a red rising-sun burst behind him,
 * chunky sticker-outlined lettering, and nothing else competing for the eye.
 */

const W = 1280;
const H = 720;
const NAVY = "#2c3a72";
const NAVY_D = "#1d2550";
const GOLD = "#f4c542";
const LACE = "#d8402f";
const DARK = "#1b2147";
const RED = "#e5392b";
const CREAM = "#fffaf0";
const HERO = { x: 944, y: 398, s: 1.46, tilt: -6 };
const SUN = { x: 935, y: 360, r: 268 };

const HeroDefs: React.FC = () => (
  <defs>
    {/* the hero: a white cut-out edge and a soft shadow, so he stands off the background */}
    <filter id="heroCut" x="-20%" y="-20%" width="140%" height="140%">
      <feMorphology in="SourceAlpha" operator="dilate" radius={9} result="grown" />
      <feFlood floodColor="#fffdf6" />
      <feComposite in2="grown" operator="in" result="edge" />
      <feGaussianBlur in="grown" stdDeviation={10} result="blur" />
      <feOffset in="blur" dx={12} dy={16} result="off" />
      <feFlood floodColor="#2a1630" floodOpacity={0.45} />
      <feComposite in2="off" operator="in" result="shadow" />
      <feMerge>
        <feMergeNode in="shadow" />
        <feMergeNode in="edge" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softShadow" x="-10%" y="-20%" width="120%" height="150%">
      <feGaussianBlur in="SourceAlpha" stdDeviation={6} result="blur" />
      <feOffset in="blur" dx={8} dy={12} result="off" />
      <feFlood floodColor="#2a1630" floodOpacity={0.5} />
      <feComposite in2="off" operator="in" result="shadow" />
      <feMerge>
        <feMergeNode in="shadow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <radialGradient id="warmBg" cx="0.72" cy="0.5" r="0.85">
      <stop offset="0" stopColor="#ffd98a" />
      <stop offset="0.5" stopColor="#f9a04a" />
      <stop offset="1" stopColor="#e2582a" />
    </radialGradient>
    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0.6" stopColor="#fff6dc" stopOpacity={0.9} />
      <stop offset="1" stopColor="#fff6dc" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="skyLeft" x1="0" y1="0" x2="1" y2="0.25">
      <stop offset="0" stopColor="#8fcde6" stopOpacity={1} />
      <stop offset="0.34" stopColor="#c9e8ef" stopOpacity={0.95} />
      <stop offset="0.46" stopColor="#fff4d8" stopOpacity={0.8} />
      <stop offset="0.62" stopColor="#ffe9b0" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="blade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#c4cede" />
      <stop offset="0.55" stopColor="#f4f7fb" />
      <stop offset="1" stopColor="#aeb9cc" />
    </linearGradient>
    <radialGradient id="edgeShade" cx="0.5" cy="0.5" r="0.78">
      <stop offset="0.65" stopColor="#3a1a10" stopOpacity={0} />
      <stop offset="1" stopColor="#3a1a10" stopOpacity={0.4} />
    </radialGradient>
  </defs>
);

/** Light rays, alternating, from the sun behind the hero. */
const SunBurst: React.FC = () => {
  const n = 18;
  const rays = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 - 0.08;
    const a1 = a0 + (Math.PI * 2) / n / 2;
    const R = 1700;
    rays.push(
      <Pencil
        key={i}
        d={`M${SUN.x},${SUN.y} L${SUN.x + Math.cos(a0) * R},${SUN.y + Math.sin(a0) * R} L${SUN.x + Math.cos(a1) * R},${SUN.y + Math.sin(a1) * R} Z`}
        fill="#ffe2a0"
        ink={false}
        off={[0, 0]}
        fillOpacity={0.5}
      />,
    );
  }
  return <g>{rays}</g>;
};

const Fuji: React.FC = () => (
  <g>
    <Pencil d="M40,760 L300,492 Q340,466 380,492 L660,760 Z" fill="#4a6fb3" sw={5} />
    <Shade d="M340,480 L660,760 L480,760 Z" fill={NAVY} opacity={0.3} />
    <Pencil d="M262,532 L300,492 Q340,466 380,492 L418,532 Q400,550 382,534 Q362,558 340,538 Q318,556 300,536 Q280,552 262,532 Z" fill={CREAM} sw={4} />
    <Shade d="M0,660 Q330,636 700,670 L700,760 L0,760 Z" fill="#fff3d6" opacity={0.5} />
  </g>
);

/** A cherry branch reaching in from the bottom-left corner, in front of everything. */
const BlossomBranch: React.FC = () => {
  const flowers: [number, number, number][] = [
    [40, 560, 1.25], [110, 600, 1.05], [176, 640, 1.2], [70, 650, 0.95], [246, 676, 1.0], [150, 700, 0.9], [20, 470, 0.9],
  ];
  return (
    <g>
      <Pencil d="M-30,740 Q60,640 150,640 Q220,640 300,700 L292,712 Q220,660 150,660 Q80,660 -10,752 Z" fill={C.darkBrown} sw={4} />
      <Pencil d="M-20,640 Q20,560 40,470 L52,474 Q36,560 -6,650 Z" fill={C.darkBrown} sw={3.5} />
      {flowers.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${s}) rotate(${i * 23})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M0,0 C-14,-10 -14,-30 -4,-36 L0,-30 L4,-36 C14,-30 14,-10 0,0 Z" fill="#f6b3c6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
            </g>
          ))}
          <path d={ellipseD(0, 0, 7)} fill="#e0547a" stroke={INK} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
};

/** The samurai, in his own units: head centred near (0, 24), feet far below the frame. */
const Samurai: React.FC = () => {
  const lames = [0, 1, 2].map((i) => {
    const yt = -10 + i * 40;
    const yb = yt + 46;
    const wt = 116 + i * 30;
    const wb = 134 + i * 30;
    return { yt, yb, wt, wb, i };
  });
  return (
    <g>
      {/* do (chest armour) */}
      <Pencil d="M-138,150 Q0,128 138,150 L170,350 L-170,350 Z" fill={NAVY} sw={5} />
      {[200, 240, 280, 320].map((y) => (
        <Ink key={y} d={`M${-138 - (y - 150) * 0.16},${y} Q0,${y - 16} ${138 + (y - 150) * 0.16},${y}`} sw={5} color={LACE} />
      ))}
      <Pencil d="M-138,150 Q0,128 138,150 L135,170 Q0,148 -135,170 Z" fill={GOLD} sw={4} />
      {/* sode (shoulder guards) */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <Pencil d={`M${sd * 110},152 L${sd * 214},168 L${sd * 236},350 L${sd * 130},344 Z`} fill={NAVY_D} sw={5} />
          <Pencil d={`M${sd * 110},152 L${sd * 214},168 L${sd * 216},184 L${sd * 112},168 Z`} fill={GOLD} sw={3.5} />
          {[214, 254, 294, 334].map((y) => (
            <Ink key={y} d={`M${sd * (118 + (y - 150) * 0.11)},${y - 12} L${sd * (220 + (y - 170) * 0.12)},${y}`} sw={4.5} color={LACE} />
          ))}
        </g>
      ))}
      {/* shikoro (neck guard), flaring out under the helmet */}
      {lames
        .slice()
        .reverse()
        .map(({ yt, yb, wt, wb, i }) => (
          <g key={i}>
            <Pencil d={`M${-wt},${yt} Q0,${yt - 38} ${wt},${yt} L${wb},${yb} Q0,${yb - 38} ${-wb},${yb} Z`} fill={i % 2 ? NAVY_D : NAVY} sw={4.5} />
            {[-1, 1].map((sd) =>
              [0.86, 0.94].map((k) => (
                <Ink key={`${sd}${k}`} d={`M${sd * wt * k},${yt + 8} L${sd * wb * k},${yb - 6}`} sw={4} color={LACE} />
              )),
            )}
          </g>
        ))}
      {/* the katana's blade, upright beside his head (hasso stance) */}
      <Pencil d="M158,72 Q150,-120 206,-336 L214,-340 Q172,-120 176,72 Z" fill="url(#blade)" sw={4} />
      <Ink d="M170,50 Q162,-120 210,-318" sw={4} color="#ffffff" opacity={0.95} />
      <Pencil d="M156,56 h22 v20 h-22 Z" fill={GOLD} sw={3} />
      {/* face */}
      <Pencil d={ellipseD(0, 24, 102, 104)} fill={C.skin} sw={5} />
      <Shade d={ellipseD(-66, 70, 19, 12)} fill={C.pink} opacity={0.85} />
      <Shade d={ellipseD(66, 70, 19, 12)} fill={C.pink} opacity={0.85} />
      {/* battle-cry: furious brows, eyes cutting toward the title, mouth wide open */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={ellipseD(sd * 40, 46, 26, 28)} fill={C.white} stroke={INK} strokeWidth={5} />
          <path d={ellipseD(sd * 40 - 10, 52, 9, 10)} fill={INK} />
          <path d={ellipseD(sd * 40 - 7, 48, 3)} fill={C.white} />
          <path d={`M${sd * 92},0 L${sd * 10},20 L${sd * 14},38 L${sd * 94},18 Z`} fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        </g>
      ))}
      <path d="M-40,80 Q0,72 40,80 L50,120 Q0,136 -50,120 Z" fill="#4a1820" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-38,84 Q0,76 38,84 L40,95 Q0,88 -40,95 Z" fill={C.white} />
      <path d={ellipseD(0, 119, 26, 10)} fill="#e86a6a" />
      <path d="M-40,80 Q0,72 40,80 L50,120 Q0,136 -50,120 Z" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* helmet bowl with ridges and rivets */}
      <Pencil d="M-112,-4 C-118,-114 -60,-148 0,-148 C60,-148 118,-114 112,-4 Q0,-42 -112,-4 Z" fill={NAVY} sw={5} />
      {[-72, -36, 0, 36, 72].map((x) => (
        <g key={x}>
          <Ink d={`M${x},${-34 - Math.abs(x) * 0.12} Q${x * 0.85},-110 ${x * 0.42},-142`} sw={3} color="#8a9ad6" opacity={0.7} />
          <path d={ellipseD(x * 0.78, -86, 4.5)} fill={GOLD} stroke={INK} strokeWidth={1.5} />
        </g>
      ))}
      {/* visor */}
      <Pencil d="M-122,-20 Q0,-64 122,-20 L116,4 Q0,-38 -116,4 Z" fill={NAVY_D} sw={5} />
      <Ink d="M-116,4 Q0,-38 116,4" sw={6} color={GOLD} />
      {/* fukigaeshi (turned-back wings) */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <Pencil d={`M${sd * 112},-36 L${sd * 180},-76 L${sd * 192},-2 L${sd * 120},8 Z`} fill={NAVY} sw={5} />
          <Ink d={`M${sd * 124},-28 L${sd * 174},-58 L${sd * 182},-12 L${sd * 128},-4 Z`} sw={3.5} color={GOLD} />
        </g>
      ))}
      {/* kuwagata: the golden horns, and the sun crest between them */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <Pencil d={`M${sd * 10},-128 C${sd * 48},-160 ${sd * 96},-232 ${sd * 104},-322 C${sd * 82},-254 ${sd * 48},-200 ${sd * 6},-160 Z`} fill={GOLD} sw={5} />
          <Ink d={`M${sd * 22},-150 C${sd * 52},-180 ${sd * 82},-230 ${sd * 94},-290`} sw={3} color="#fff4c4" opacity={0.9} />
        </g>
      ))}
      <Pencil d="M0,-166 L28,-130 L0,-96 L-28,-130 Z" fill={GOLD} sw={4.5} />
      <Pencil d={ellipseD(0, -130, 12)} fill={RED} sw={3} />
      {/* arms and hands on the katana */}
      <Pencil d="M40,200 Q100,150 160,118 L184,150 Q120,190 70,240 Z" fill={NAVY_D} sw={5} />
      <Pencil d="M70,252 Q120,196 168,166 L190,198 Q140,236 100,284 Z" fill={NAVY_D} sw={5} />
      <Pencil d="M156,84 L178,84 L186,226 L164,226 Z" fill="#24263a" sw={4} />
      {[104, 138, 172, 206].map((y) => (
        <path key={y} d={`M${168 + (y - 84) * 0.06},${y - 8} l7,8 l-7,8 l-7,-8 Z`} fill={CREAM} />
      ))}
      <Pencil d={ellipseD(166, 80, 34, 11)} fill="#b48a2c" sw={4} />
      <Pencil d={ellipseD(175, 230, 13, 8)} fill={GOLD} sw={3} />
      {[
        [170, 124],
        [176, 184],
      ].map(([hx, hy]) => (
        <g key={hy}>
          <Pencil d={ellipseD(hx, hy, 28, 26)} fill={C.skin} sw={5} />
          <Ink d={`M${hx - 18},${hy - 8} q8,-6 16,0 M${hx - 18},${hy + 4} q8,-6 16,0 M${hx - 18},${hy + 16} q8,-6 16,0`} sw={3} />
        </g>
      ))}
    </g>
  );
};

/** "HISTORY OF" over a huge "JAPAN": chunky rounded marker letters with sticker outlines. */
const Title: React.FC = () => {
  const T = 10; // letter spacing for the heavier strokes
  const line = (
    text: string,
    x: number,
    y: number,
    cap: number,
    seed: number,
    layers: { color: string; weight: number; dx?: number; dy?: number; opacity?: number }[],
  ) => {
    const cx = x + (markerWidth(text, T) * cap) / 200;
    return layers.map((l, i) => (
      <g key={`${text}${i}`} transform={`translate(${l.dx ?? 0},${l.dy ?? 0})`} opacity={l.opacity}>
        <MarkerText text={text} x={cx} y={y} cap={cap} seed={seed} color={l.color} weight={l.weight} tracking={T} jitter={0.45} />
      </g>
    ));
  };
  return (
    <g transform="rotate(-4 360 210)">
      {line("HISTORY OF", 46, 76, 90, 5, [
        { color: "#2a1630", weight: 46, dx: 6, dy: 8, opacity: 0.4 },
        { color: CREAM, weight: 46 },
        { color: DARK, weight: 27 },
      ])}
      {line("JAPAN", 34, 190, 160, 9, [
        { color: "#2a1630", weight: 58, dx: 9, dy: 12 },
        { color: DARK, weight: 58 },
        { color: CREAM, weight: 42 },
        { color: RED, weight: 26 },
      ])}
    </g>
  );
};

export const JapanThumbHero: React.FC = () => {
  useJapanAssets();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f8e3bd" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: W, height: H, objectFit: "cover" }} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={0} texScale={1 / 1.6} boil={1.6} />
        <HeroDefs />
        <rect x={0} y={0} width={W} height={H} fill="url(#warmBg)" />
        <g filter="url(#wobble)">
          <SunBurst />
        </g>
        <rect x={0} y={0} width={W} height={H} fill="url(#skyLeft)" />
        <g filter="url(#wobble)">
          <circle cx={SUN.x} cy={SUN.y} r={SUN.r + 60} fill="url(#sunGlow)" />
          <path d={ellipseD(SUN.x, SUN.y, SUN.r)} fill={RED} opacity={0.55} />
          <Pencil d={ellipseD(SUN.x, SUN.y, SUN.r)} fill={RED} sw={6} />
          <Shade d={ellipseD(SUN.x + 40, SUN.y + 40, SUN.r * 0.75)} fill="#b8241c" opacity={0.35} />
        </g>
        <g filter="url(#wobble)">
          <Fuji />
        </g>
        <g filter="url(#heroCut)">
          <g filter="url(#wobble)">
            <g transform={`translate(${HERO.x},${HERO.y}) rotate(${HERO.tilt}) scale(${HERO.s})`}>
              <Samurai />
            </g>
          </g>
        </g>
        <g filter="url(#wobble)">
          <BlossomBranch />
          {[
            [1236, 300, 2.4, 30],
            [700, 470, 2.0, 200],
            [600, 600, 2.6, 80],
            [200, 436, 2.2, 300],
            [760, 110, 1.8, 160],
          ].map(([x, y, s, r], i) => (
            <Petal key={i} x={x} y={y} s={s} rot={r} />
          ))}
          <Title />
        </g>
        <rect x={0} y={0} width={W} height={H} fill="url(#edgeShade)" />
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("japan/grain.jpg")})`,
          backgroundSize: "768px 768px",
          mixBlendMode: "multiply",
          opacity: 0.28,
        }}
      />
    </AbsoluteFill>
  );
};
