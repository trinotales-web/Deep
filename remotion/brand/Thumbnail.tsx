import React from "react";
import { ellipseD, Ink, Pencil, Sparkle } from "../japan/draw";
import { Expr, Hold, Person, Tribe } from "../japan/Person";
import { C, rand } from "../japan/theme";
import { KatanaGrip, Petal, ThumbnailFrame, Title, TH as H, TW as W } from "./thumbParts";
const ZOOM = 2.3; // the samurai's scale
const HERO = { x: 968, y: 318 }; // centre of his head
const STRIP = 600; // top of the timeline band
const TRACK = 700; // where the little figures stand

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
      return x > 780 ? null : <Petal key={i} x={x} y={y} s={1.2 + rand(i * 3 + 63)} rot={rand(i + 7) * 360} />;
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
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fbf3e2" />
        <stop offset="1" stopColor="#f2c896" />
      </linearGradient>
    </defs>
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
          <KatanaGrip low={[-8, -74]} angle={-38} arm={C.indigo} />
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
  </ThumbnailFrame>
);

export const japanThumbnailDefaults = { kicker: "History of", title: "Japan" };
