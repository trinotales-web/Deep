import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Defs, ellipseD, Ink, Pencil, Pt, Sparkle } from "../japan/draw";
import { Expr, Hold, Person, Tribe } from "../japan/Person";
import { C, INK, rand } from "../japan/theme";
import { MarkerText, markerWidth } from "./MarkerText";

const W = 1280;
const H = 720;
const ZOOM = 2.3; // the samurai's scale
const HERO = { x: 968, y: 318 }; // centre of his head
const STRIP = 600; // top of the timeline band
const TRACK = 700; // where the little figures stand

const ThumbDefs: React.FC = () => (
  <defs>
    {[
      ["sticker", 8, "#fffdf6"],
      ["stickerThin", 4, "#fffdf6"],
    ].map(([id, r, color]) => (
      <filter key={String(id)} id={String(id)} x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="dilate" radius={Number(r)} result="grown" />
        <feFlood floodColor={String(color)} />
        <feComposite in2="grown" operator="in" result="edge" />
        <feMerge>
          <feMergeNode in="edge" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    ))}
    {/* a soft light halo behind the lettering */}
    <filter id="halo" x="-5%" y="-20%" width="110%" height="140%">
      <feMorphology in="SourceAlpha" operator="dilate" radius={7} result="grown" />
      <feGaussianBlur in="grown" stdDeviation={3} result="soft" />
      <feFlood floodColor="#fffaf0" />
      <feComposite in2="soft" operator="in" result="edge" />
      <feMerge>
        <feMergeNode in="edge" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fbf3e2" />
      <stop offset="1" stopColor="#f2c896" />
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.62" stopColor="#5a3a22" stopOpacity={0} />
      <stop offset="1" stopColor="#5a3a22" stopOpacity={0.34} />
    </radialGradient>
  </defs>
);

/** "HISTORY OF" over a big red "JAPAN", left-aligned, in marker. */
const Title: React.FC<{ kicker: string; title: string; x: number; y: number }> = ({ kicker, title, x, y }) => {
  const capK = 104;
  const capT = 196;
  return (
    <g filter="url(#halo)">
      <MarkerText text={kicker} x={x + (markerWidth(kicker.toUpperCase()) * capK) / 200} y={y} cap={capK} seed={5} />
      <MarkerText text={title} x={x + (markerWidth(title.toUpperCase()) * capT) / 200} y={y + capK + 30} cap={capT} seed={9} color="#d3302a" />
    </g>
  );
};

/** An arm from shoulder to hand, in the cast's style but any length. */
const Limb: React.FC<{ from: Pt; to: Pt; color: string }> = ({ from, to, color }) => {
  const a = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI - 90;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  return (
    <g transform={`translate(${from[0]},${from[1]}) rotate(${a})`}>
      <Pencil d={`M-10,-4 Q-12,${len * 0.5} -8,${len} L8,${len} Q12,${len * 0.5} 10,-4 Z`} fill={color} sw={3.5} />
    </g>
  );
};

/** The katana in both hands, angled up and out of the frame. Units are the cast's, from the feet. */
const SwordGrip: React.FC = () => {
  const dir: Pt = [Math.cos((38 * Math.PI) / 180), -Math.sin((38 * Math.PI) / 180)];
  const low: Pt = [-8, -74]; // lower hand
  const high: Pt = [low[0] + dir[0] * 30, low[1] + dir[1] * 30]; // upper hand
  const guard: Pt = [low[0] + dir[0] * 44, low[1] + dir[1] * 44];
  const tip: Pt = [guard[0] + dir[0] * 260, guard[1] + dir[1] * 260];
  const n: Pt = [-dir[1], dir[0]]; // across the blade
  const at = (p: Pt, d: number, w: number): Pt => [p[0] + dir[0] * d + n[0] * w, p[1] + dir[1] * d + n[1] * w];
  const poly = (pts: Pt[]) => `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L")} Z`;
  const handleStart = at(low, -16, 0);
  return (
    <g>
      {/* arms first, so the hands close over the grip */}
      <Limb from={[-30, -126]} to={low} color={C.indigo} />
      <Limb from={[30, -126]} to={high} color={C.indigo} />
      {/* blade, with a bright edge */}
      <Pencil d={poly([at(guard, 0, -6), at(guard, 0, 6), at(tip, -30, 4), at(tip, 0, -1), at(tip, -10, -6)])} fill="#e9edf2" sw={3} />
      <Ink d={`M${at(guard, 8, -2).join(",")} L${at(tip, -40, -2).join(",")}`} sw={2.5} color="#ffffff" opacity={0.9} />
      {/* handle and guard */}
      <Pencil d={poly([at(handleStart, 0, -6), at(handleStart, 0, 6), at(guard, -2, 6), at(guard, -2, -6)])} fill="#2b2b35" sw={3} />
      {[0.2, 0.45, 0.7].map((k) => (
        <Ink key={k} d={`M${at(handleStart, 60 * k, -6).join(",")} L${at(handleStart, 60 * k + 8, 6).join(",")}`} sw={1.6} color={C.white} />
      ))}
      <Pencil d={ellipseD(guard[0], guard[1], 5, 13)} fill={C.bronze} sw={2.5} />
      {/* hands */}
      <Pencil d={ellipseD(low[0], low[1], 11, 11)} fill={C.skin} sw={3.5} />
      <Pencil d={ellipseD(high[0], high[1], 11, 11)} fill={C.skin} sw={3.5} />
    </g>
  );
};

/** Japan's eras, marching left to right: ancient, classical, medieval, Sengoku, Edo, modern. */
const PARADE: { tribe: Tribe; expr: Expr; hold?: Hold }[] = [
  { tribe: "jomon", expr: "grin", hold: "spear" },
  { tribe: "yayoi", expr: "happy", hold: "rice" },
  { tribe: "emperor", expr: "smile", hold: "shaku" },
  { tribe: "noble", expr: "happy", hold: "fan" },
  { tribe: "monk", expr: "smile", hold: "beads" },
  { tribe: "guard", expr: "grin", hold: "bow" },
  { tribe: "ninja", expr: "happy" },
  { tribe: "nobunaga", expr: "angry", hold: "fan" },
  { tribe: "hideyoshi", expr: "grin" },
  { tribe: "ieyasu", expr: "smile", hold: "fan" },
  { tribe: "kabuki", expr: "grin", hold: "fan" },
  { tribe: "european", expr: "smile" },
  { tribe: "modern", expr: "grin", hold: "phone" },
];

const Timeline: React.FC = () => {
  const n = PARADE.length;
  const x0 = 54;
  const step = (W - 2 * x0) / (n - 1);
  return (
    <g>
      <Pencil d={`M-20,${STRIP} Q${W / 2},${STRIP - 10} ${W + 20},${STRIP} L${W + 20},${H + 20} L-20,${H + 20} Z`} fill="#efe1c3" sw={4.5} />
      {/* the arrow of time */}
      <Ink d={`M18,${TRACK + 6} L${W - 30},${TRACK + 6}`} sw={7} />
      <Ink d={`M${W - 58},${TRACK - 14} L${W - 22},${TRACK + 6} L${W - 58},${TRACK + 26}`} sw={7} />
      {PARADE.map((p, i) => (
        <Person key={i} x={x0 + i * step} y={TRACK} s={0.5} tribe={p.tribe} expr={p.expr} f={0} blinkOff walk={i * 1.7} hold={p.hold ?? "none"} seed={i} />
      ))}
    </g>
  );
};

/** A faint Mt Fuji to fill the sky under the title. */
const Fuji: React.FC = () => (
  <g opacity={0.55}>
    <Pencil d={`M60,${STRIP + 4} L290,420 Q310,406 330,420 L600,${STRIP + 4} Z`} fill="#a9b5cf" sw={3.5} />
    <Pencil d="M262,446 L290,420 Q310,406 330,420 L360,448 Q344,460 330,450 Q312,466 296,452 Q280,462 262,446 Z" fill={C.white} sw={3} />
  </g>
);

const Petals: React.FC = () => (
  <g>
    {Array.from({ length: 12 }, (_, i) => {
      const x = 40 + rand(i * 3 + 61) * (W - 80);
      const y = 380 + rand(i * 3 + 62) * 150;
      if (x > 780) return null;
      return (
        <g key={i} transform={`translate(${x},${y}) rotate(${rand(i + 7) * 360}) scale(${1.2 + rand(i * 3 + 63)})`}>
          <path d="M0,10 Q-9,2 -7,-6 Q-4,-11 -1,-8 L0,-5 L1,-8 Q4,-11 7,-6 Q9,2 0,10 Z" fill={C.pink} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      );
    })}
  </g>
);

/**
 * Video thumbnail (1280x720) in the series' colored-pencil style: the title in
 * marker on the left, a samurai in close-up on the right with his katana up,
 * and below them Japan's eras marching along the arrow of time, from the
 * Jomon to today.
 */
export const JapanThumbnail: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => (
  <ThumbnailFrame>
    <rect x={0} y={0} width={W} height={H} fill="url(#sky)" opacity={0.8} />
    <g filter="url(#wobble)">
      <Fuji />
      <Pencil d={ellipseD(HERO.x + 10, HERO.y + 20, 262)} fill="#e0573a" sw={5} />
    </g>

    {/* the samurai */}
    <g filter="url(#sticker)">
      <g filter="url(#wobble)">
        <g transform={`translate(${HERO.x},${HERO.y + 178 * ZOOM}) scale(${ZOOM})`}>
          <Person x={0} y={0} tribe="samurai" expr="grin" f={0} blinkOff noArms look={[-0.55, 0.15]} />
          <SwordGrip />
        </g>
      </g>
    </g>
    <g filter="url(#wobble)">
      <Sparkle x={1226} y={316} s={1.5} color={C.white} />
      <Sparkle x={1226} y={316} s={0.95} />
      <Petals />
    </g>

    {/* the eras */}
    <g filter="url(#stickerThin)">
      <g filter="url(#wobble)">
        <Timeline />
      </g>
    </g>

    <g filter="url(#wobble)">
      <Title kicker={kicker} title={title} x={40} y={34} />
    </g>
    <rect x={0} y={0} width={W} height={H} fill="url(#vignette)" />
  </ThumbnailFrame>
);

/** Paper, pencil texture, filters and grain shared by the thumbnails. */
const ThumbnailFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useJapanAssets();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: W, height: H, objectFit: "cover" }} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={0} texScale={1 / 2} />
        <ThumbDefs />
        {children}
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

export const japanThumbnailDefaults = { kicker: "History of", title: "Japan" };
