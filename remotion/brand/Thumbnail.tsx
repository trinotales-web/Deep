import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Defs, ellipseD, Ink, Pencil } from "../japan/draw";
import { Expr, Person, Tribe } from "../japan/Person";
import { CherryTree, Pagoda, Torii } from "../japan/Props2";
import { Castle } from "../japan/Props3";
import { C, INK, rand } from "../japan/theme";
import { MarkerText } from "./MarkerText";

const W = 1280;
const H = 720;
const ZOOM = 2.6; // the hero's scale
const HERO = { x: 640, y: 470 }; // centre of the hero's head

/** A white cut-out edge round the hero, so he lifts off the background like a sticker. */
const StickerDefs: React.FC = () => (
  <defs>
    {[
      ["sticker", 9],
      ["stickerThin", 5],
    ].map(([id, r]) => (
      <filter key={id} id={String(id)} x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="dilate" radius={r} result="grown" />
        <feFlood floodColor="#ffffff" />
        <feComposite in2="grown" operator="in" result="edge" />
        <feMerge>
          <feMergeNode in="edge" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    ))}
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fffdf7" stopOpacity={0.92} />
      <stop offset="0.45" stopColor="#fffdf7" stopOpacity={0.55} />
      <stop offset="1" stopColor="#fffdf7" stopOpacity={0.35} />
    </linearGradient>
  </defs>
);

/** A cherry blossom petal, notched at the tip. */
const Petal: React.FC<{ x: number; y: number; s: number; rot: number; opacity?: number }> = ({ x, y, s, rot, opacity = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    <path d="M0,10 Q-9,2 -7,-6 Q-4,-11 -1,-8 L0,-5 L1,-8 Q4,-11 7,-6 Q9,2 0,10 Z" fill={C.pink} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M0,6 L0,-2" stroke="#d98a8a" strokeWidth={1.2} />
  </g>
);

const Petals: React.FC<{ n: number; seed: number; front?: boolean }> = ({ n, seed, front }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = rand(seed + i * 3) * W;
      const y = 60 + rand(seed + i * 3 + 1) * (H - 120);
      // keep the hero's face clear
      if (Math.hypot(x - HERO.x, y - HERO.y) < 170) return null;
      return <Petal key={i} x={x} y={y} s={front ? 1.6 + rand(seed + i * 3 + 2) : 1 + rand(seed + i * 3 + 2) * 0.7} rot={rand(seed + i) * 360} opacity={front ? 1 : 0.75} />;
    })}
  </g>
);

/** A stopwatch, for the speedrun. */
const Stopwatch: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <Pencil d={`M${x - 5},${y - 27} L${x + 5},${y - 27} L${x + 5},${y - 20} L${x - 5},${y - 20} Z`} fill={C.bronze} sw={2.5} />
    <Pencil d={ellipseD(x, y - 31, 8, 4)} fill={C.bronze} sw={2.5} />
    <Pencil d={ellipseD(x, y, 21)} fill={C.yellow} sw={3.5} />
    <path d={ellipseD(x, y, 15)} fill={C.white} stroke={INK} strokeWidth={2} />
    {[0, 90, 180, 270].map((a) => (
      <Ink key={a} d={`M${x + Math.sin((a * Math.PI) / 180) * 11},${y - Math.cos((a * Math.PI) / 180) * 11} L${x + Math.sin((a * Math.PI) / 180) * 14},${y - Math.cos((a * Math.PI) / 180) * 14}`} sw={1.6} />
    ))}
    <Ink d={`M${x},${y} L${x + 7},${y - 10}`} sw={2.5} color={C.red} />
    <path d={ellipseD(x, y, 2)} fill={INK} />
  </g>
);

/** An arm thrown up in a V (longer than a Person's, which would hide behind the helmet flaps). */
const RaisedArm: React.FC<{ side: 1 | -1; color: string; children?: React.ReactNode }> = ({ side, color, children }) => {
  const [sx, sy, hx, hy] = [side * 30, -126, side * 104, -236];
  const a = (Math.atan2(hy - sy, hx - sx) * 180) / Math.PI - 90;
  const len = Math.hypot(hx - sx, hy - sy);
  return (
    <g>
      <g transform={`translate(${sx},${sy}) rotate(${a})`}>
        <Pencil d={`M-10,-4 Q-12,${len * 0.5} -8,${len - 4} L8,${len - 4} Q12,${len * 0.5} 10,-4 Z`} fill={color} sw={3.5} />
      </g>
      {children}
      <Pencil d={ellipseD(hx, hy, 12, 12)} fill={C.skin} sw={3.5} />
    </g>
  );
};

/** Japan's history, crowding in along the bottom edge. */
const CROWD: { tribe: Tribe; expr: Expr; x: number; row: 0 | 1; up?: boolean; beard?: boolean }[] = [
  { tribe: "jomon", expr: "grin", x: 40, row: 0, up: true },
  { tribe: "emperor", expr: "smile", x: 170, row: 0 },
  { tribe: "mongol", expr: "shock", x: 300, row: 0 },
  { tribe: "portuguese", expr: "grin", x: 425, row: 0, up: true },
  { tribe: "hideyoshi", expr: "grin", x: 858, row: 0, up: true },
  { tribe: "kabuki", expr: "happy", x: 985, row: 0 },
  { tribe: "american", expr: "shock", x: 1110, row: 0 },
  { tribe: "lady", expr: "happy", x: 1240, row: 0, up: true },
  { tribe: "yayoi", expr: "happy", x: 100, row: 1, up: true },
  { tribe: "ninja", expr: "grin", x: 245, row: 1 },
  { tribe: "nobunaga", expr: "angry", x: 390, row: 1, up: true },
  { tribe: "monk", expr: "smile", x: 520, row: 1 },
  { tribe: "ieyasu", expr: "smile", x: 765, row: 1 },
  { tribe: "fool", expr: "grin", x: 895, row: 1, up: true },
  { tribe: "merchant", expr: "grin", x: 1035, row: 1 },
  { tribe: "dutch", expr: "smile", x: 1180, row: 1, up: true },
];

/**
 * Video thumbnail (1280x720) in the series' pencil style, built the way the
 * niche's best thumbnails are: one line of fat marker lettering across the
 * top, one hero in close-up with a white sticker edge, a faded backdrop that
 * mirrors left and right, and a crowd piled along the bottom.
 */
export const JapanThumbnail: React.FC<{ title: string }> = ({ title }) => {
  useJapanAssets();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: W, height: H, objectFit: "cover" }} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={0} texScale={1 / 2.2} />
        <StickerDefs />

        {/* backdrop: Japan on both sides, then faded back */}
        <g filter="url(#wobble)">
          <CherryTree x={70} y={560} s={1.25} />
          <Castle x={270} y={600} s={0.95} />
          <Torii x={1265} y={600} s={0.9} />
          <Pagoda x={1035} y={600} s={1.05} />
          <CherryTree x={1210} y={560} s={1.25} />
          <Petals n={26} seed={40} />
        </g>
        <rect x={0} y={0} width={W} height={H} fill="url(#haze)" />

        {/* the red sun behind the hero */}
        <g filter="url(#wobble)">
          <Pencil d={ellipseD(HERO.x, HERO.y + 6, 272)} fill="#e0573a" sw={5} />
        </g>

        {/* the hero: a samurai who just finished all of Japanese history */}
        <g filter="url(#sticker)">
          <g filter="url(#wobble)">
            <g transform={`translate(${HERO.x},${HERO.y + 178 * ZOOM}) scale(${ZOOM})`}>
              <Person x={0} y={0} tribe="samurai" expr="grin" f={0} blinkOff aL={4} aR={4} />
              <RaisedArm side={-1} color={C.indigo} />
              <RaisedArm side={1} color={C.indigo}>
                <Stopwatch x={110} y={-262} />
              </RaisedArm>
            </g>
          </g>
        </g>

        {/* the crowd */}
        <g filter="url(#stickerThin)">
          <g filter="url(#wobble)">
            {CROWD.filter((c) => c.row === 0).map((c, i) => (
              <Person key={i} x={c.x} y={650 + 178 * 0.95} s={0.95} tribe={c.tribe} expr={c.expr} f={0} blinkOff aL={c.up ? 150 : 14} aR={c.up ? 150 : 14} beard={c.beard} />
            ))}
            {CROWD.filter((c) => c.row === 1).map((c, i) => (
              <Person key={i} x={c.x} y={712 + 178 * 1.1} s={1.1} tribe={c.tribe} expr={c.expr} f={0} blinkOff aL={c.up ? 150 : 14} aR={c.up ? 150 : 14} beard={c.beard} />
            ))}
          </g>
        </g>
        <g filter="url(#wobble)">
          <Petals n={9} seed={90} front />
        </g>

        {/* the title, in marker */}
        <g filter="url(#wobble)">
          <MarkerText text={title} x={W / 2} y={34} cap={170} maxWidth={1210} seed={3} />
        </g>
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("japan/grain.jpg")})`,
          backgroundSize: "768px 768px",
          mixBlendMode: "multiply",
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};

export const japanThumbnailDefaults = { title: "Japan speedrun" };
