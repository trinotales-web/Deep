import React from "react";
import { C, INK, rand } from "./theme";
import { blobD, ellipseD, Ink, Pencil, Shade } from "./draw";

export type Expr = "smile" | "grin" | "happy" | "worry" | "shock" | "neutral" | "angry" | "tired" | "nervous";
export type Tribe =
  | "jomon"
  | "yayoi"
  | "nomad"
  | "monk"
  | "emperor"
  | "noble"
  | "priest"
  | "guard"
  | "samurai"
  | "shogun"
  | "daimyo"
  | "modern"
  | "bandit"
  | "ninja"
  | "mongol"
  | "khan"
  | "portuguese"
  | "smith"
  | "fool"
  | "nobunaga"
  | "general";
export type Hold =
  | "spear"
  | "rice"
  | "sickle"
  | "onigiri"
  | "paddle"
  | "fish"
  | "bundle"
  | "bow"
  | "naginata"
  | "gohei"
  | "beads"
  | "shaku"
  | "fan"
  | "coins"
  | "baby"
  | "lantern"
  | "katana"
  | "bannerWhite"
  | "bannerRed"
  | "ricebale"
  | "letter"
  | "bomb"
  | "teabowl"
  | "brush"
  | "spyglass"
  | "stone"
  | "gun"
  | "hammer"
  | "none";

export type PersonProps = {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  tribe: Tribe;
  expr?: Expr;
  f: number;
  walk?: number; // walk phase in radians, undefined = standing
  aL?: number; // arm raise (deg), positive = outward / up
  aR?: number;
  look?: [number, number];
  hold?: Hold;
  long?: boolean; // long hair variant
  skin?: string;
  cloth?: string;
  seed?: number;
  bob?: number;
  lean?: number;
  sit?: boolean;
  blinkOff?: boolean;
  beard?: boolean;
};

const HEAD_Y = -178;
const HEAD_R = 46;

const Arm: React.FC<{ sx: number; sy: number; a: number; skin: string; cloth: string; hold?: Hold; side: 1 | -1 }> = ({
  sx,
  sy,
  a,
  skin,
  cloth,
  hold,
  side,
}) => {
  const len = 58;
  return (
    <g transform={`translate(${sx},${sy}) rotate(${side === -1 ? a : -a})`}>
      {hold && hold !== "none" ? <Item kind={hold} x={0} y={len} side={side} /> : null}
      <Pencil d={`M-9,-4 Q-11,${len * 0.5} -7,${len - 4} L7,${len - 4} Q11,${len * 0.5} 9,-4 Z`} fill={cloth} sw={3.5} />
      <Pencil d={ellipseD(0, len, 10, 10)} fill={skin} sw={3.5} />
    </g>
  );
};

/** Props held in the hand; drawn in hand-local coordinates (hand at x, y). */
export const Item: React.FC<{ kind: Hold; x: number; y: number; side?: 1 | -1 }> = ({ kind, x, y }) => {
  switch (kind) {
    case "spear":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-3,-120 L3,-120 L4,70 L-4,70 Z" fill={C.brown} sw={3} />
          <Pencil d="M0,-160 L12,-122 L-12,-122 Z" fill={C.gray} sw={3.5} />
        </g>
      );
    case "paddle":
      return (
        <g transform={`translate(${x},${y}) rotate(20)`}>
          <Pencil d="M-3,-70 L3,-70 L3,40 L-3,40 Z" fill={C.brown} sw={3} />
          <Pencil d="M-10,40 Q0,30 10,40 L8,95 Q0,104 -8,95 Z" fill={C.tan} sw={3} />
        </g>
      );
    case "rice":
      return (
        <g transform={`translate(${x},${y}) rotate(-10)`}>
          <Pencil d="M-4,-10 L-10,-90 M4,-10 L8,-92 M0,-10 L-1,-96" sw={3} />
          {[-10, -1, 8].map((dx, i) => (
            <Pencil key={i} d={blobD(dx, -96 + (i % 2) * 6, 8, 22, 40 + i, 4, 0.15)} fill={C.rice} sw={3} />
          ))}
          <Pencil d="M-8,-8 L8,-8 L6,4 L-6,4 Z" fill={C.straw} sw={3} />
        </g>
      );
    case "sickle":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-4,-50 L4,-50 L4,12 L-4,12 Z" fill={C.brown} sw={3} />
          <Pencil d="M-2,-50 C30,-80 66,-60 70,-30 C56,-52 30,-58 4,-40 Z" fill={C.iron} sw={3.5} />
        </g>
      );
    case "onigiri":
      return (
        <g transform={`translate(${x},${y - 10})`}>
          <Pencil d="M0,-34 C10,-34 30,0 26,8 C22,14 -22,14 -26,8 C-30,0 -10,-34 0,-34 Z" fill={C.white} sw={3.5} />
          <Pencil d="M-14,0 L14,0 L14,13 L-14,13 Z" fill="#33463a" sw={3} />
        </g>
      );
    case "fish":
      return (
        <g transform={`translate(${x},${y + 6}) rotate(80)`}>
          <Pencil d="M-36,0 C-20,-16 18,-16 30,0 C18,16 -20,16 -36,0 Z M30,0 L48,-14 L48,14 Z" fill={C.sky} sw={3.5} />
          <path d={ellipseD(-22, -3, 3)} fill={INK} />
        </g>
      );
    case "bundle":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-4,10 L60,-110" sw={5} />
          <Pencil d={blobD(66, -110, 34, 28, 8, 5, 0.12)} fill={C.tan} sw={3.5} />
          <Ink d="M50,-128 L58,-116 M74,-130 L70,-118" sw={3} />
        </g>
      );
    case "bow":
      return (
        <g transform={`translate(${x},${y})`}>
          <Ink d="M2,-150 L2,120" sw={1.6} />
          <Ink d="M2,-150 Q-40,-20 2,120" sw={6} color={C.darkBrown} />
        </g>
      );
    case "naginata":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-3,-150 L3,-150 L4,90 L-4,90 Z" fill={C.darkBrown} sw={3} />
          <Pencil d="M-3,-150 C-6,-190 6,-222 20,-240 C16,-210 10,-180 4,-150 Z" fill="#dfe3e8" sw={3.5} />
        </g>
      );
    case "gohei":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-3,-90 L3,-90 L3,24 L-3,24 Z" fill={C.straw} sw={3} />
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <Ink d={`M0,-86 l${sd * 14},10 l${-sd * 8},8 l${sd * 14},10 l${-sd * 8},8 l${sd * 14},10`} sw={9} />
              <Ink d={`M0,-86 l${sd * 14},10 l${-sd * 8},8 l${sd * 14},10 l${-sd * 8},8 l${sd * 14},10`} sw={4.5} color={C.white} />
            </g>
          ))}
        </g>
      );
    case "beads":
      return (
        <g transform={`translate(${x},${y})`}>
          {new Array(12).fill(0).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <Pencil key={i} d={ellipseD(Math.cos(a) * 16, 22 + Math.sin(a) * 22, 4.5)} fill={C.brown} sw={2} />;
          })}
        </g>
      );
    case "shaku":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-6,-70 Q0,-76 6,-70 L5,14 L-5,14 Z" fill={C.tan} sw={3} />
        </g>
      );
    case "fan":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-4,-40 L4,-40 L4,20 L-4,20 Z" fill={C.darkBrown} sw={3} />
          <Pencil d={ellipseD(0, -80, 34, 40)} fill={C.yellow} sw={3.5} />
          <Pencil d={ellipseD(0, -80, 14)} fill={C.red} sw={2.5} />
        </g>
      );
    case "coins":
      return (
        <g transform={`translate(${x},${y + 16})`}>
          <Pencil d={blobD(0, 10, 26, 24, 7, 4, 0.1)} fill={C.tan} sw={3.5} />
          <Ink d="M-12,-10 Q0,-4 12,-10" sw={3} />
          {[[-30, -6], [26, 18]].map(([cx, cy], i) => (
            <g key={i}>
              <Pencil d={ellipseD(cx, cy, 10)} fill={C.bronze} sw={2.5} />
              <path d={`M${cx - 3},${cy - 3} h6 v6 h-6 Z`} fill={INK} />
            </g>
          ))}
        </g>
      );
    case "baby":
      return (
        <g transform={`translate(${x},${y - 6})`}>
          <Pencil d={blobD(0, 0, 40, 26, 3, 3, 0.06)} fill={C.white} sw={3.5} />
          <Pencil d={ellipseD(-22, -4, 16)} fill={C.skin} sw={3} />
          <Ink d="M-28,-6 q3,-3 6,0 M-20,-6 q3,-3 6,0" sw={2} />
          <Shade d={ellipseD(-30, 2, 4, 3)} fill={C.pink} opacity={0.8} />
        </g>
      );
    case "lantern":
      return (
        <g transform={`translate(${x},${y})`}>
          <Ink d="M0,0 L0,18" sw={3} />
          <Pencil d={ellipseD(0, 48, 24, 30)} fill={C.red} sw={3.5} />
          <Pencil d="M-14,16 L14,16 L14,22 L-14,22 Z M-14,74 L14,74 L14,80 L-14,80 Z" fill={INK} sw={2} />
          <Ink d="M-20,40 Q0,46 20,40 M-20,56 Q0,62 20,56" sw={2} opacity={0.7} />
        </g>
      );
    case "katana":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-5,-12 Q2,-110 16,-196 L23,-194 Q12,-110 6,-12 Z" fill="#e3e7ec" sw={3} />
          <Pencil d={ellipseD(0, -8, 14, 5)} fill={C.bronze} sw={3} />
          <Pencil d="M-5,-4 L5,-4 L5,38 L-5,38 Z" fill="#2b2b35" sw={3} />
          <Ink d="M-5,6 l10,8 M-5,18 l10,8 M-5,30 l10,6" sw={1.5} color={C.white} />
        </g>
      );
    case "bannerWhite":
    case "bannerRed":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-3,-230 L3,-230 L4,60 L-4,60 Z" fill={C.darkBrown} sw={3} />
          <Pencil
            d="M3,-224 L76,-224 L74,-60 L3,-60 Z"
            fill={kind === "bannerWhite" ? C.white : C.red}
            sw={3.5}
          />
          <Ink d="M3,-224 L82,-224" sw={4} />
        </g>
      );
    case "letter":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-44,-12 h88 v24 h-88 Z" fill="#f4e7c4" sw={3} />
          <Pencil d={ellipseD(-46, 0, 7, 16)} fill={C.darkBrown} sw={2.5} />
          <Pencil d={ellipseD(46, 0, 7, 16)} fill={C.darkBrown} sw={2.5} />
          <Pencil d="M-8,-12 h16 v24 h-16 Z" fill={C.red} sw={2} />
        </g>
      );
    case "bomb":
      return (
        <g transform={`translate(${x},${y - 20})`}>
          <Pencil d={ellipseD(0, 0, 26)} fill="#3d3d44" sw={3.5} />
          <Shade d={ellipseD(-8, -8, 8, 6)} fill={C.white} opacity={0.5} />
          <Ink d="M10,-22 q10,-14 22,-12" sw={3} color={C.darkBrown} />
          <Pencil d="M32,-40 l4,8 l9,1 l-7,6 l2,9 l-8,-5 l-8,5 l2,-9 l-7,-6 l9,-1 Z" fill={C.yellow} sw={2} />
        </g>
      );
    case "teabowl":
      return (
        <g transform={`translate(${x},${y - 10})`}>
          <Pencil d="M-30,-14 L30,-14 Q28,18 0,22 Q-28,18 -30,-14 Z" fill="#6b5a4a" sw={3.5} />
          <Pencil d={ellipseD(0, -14, 30, 7)} fill={C.green} sw={3} />
        </g>
      );
    case "brush":
      return (
        <g transform={`translate(${x},${y}) rotate(-30)`}>
          <Pencil d="M-4,-70 L4,-70 L4,10 L-4,10 Z" fill={C.brown} sw={3} />
          <Pencil d="M-6,-70 Q0,-100 6,-70 Z" fill={INK} sw={2.5} />
        </g>
      );
    case "spyglass":
      return (
        <g transform={`translate(${x},${y}) rotate(-70)`}>
          <Pencil d="M-8,-10 L60,-14 L60,14 L-8,10 Z" fill={C.bronze} sw={3} />
          <Pencil d="M60,-17 L84,-18 L84,18 L60,17 Z" fill={C.darkBrown} sw={3} />
        </g>
      );
    case "stone":
      return (
        <g transform={`translate(${x},${y - 40})`}>
          <Pencil d={blobD(0, 0, 46, 34, 6, 4, 0.12)} fill={C.gray} sw={3.5} />
          <Ink d="M-20,-6 l14,6 M8,10 l14,-4" sw={2} opacity={0.6} />
        </g>
      );
    case "gun":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-9,-58 L9,-58 L12,-10 Q14,10 4,18 L-4,18 Q-14,10 -12,-10 Z" fill={C.brown} sw={3} />
          <Pencil d="M-5,10 L5,10 L5,170 L-5,170 Z" fill="#3d3d44" sw={3} />
          <Pencil d="M-8,166 L8,166 L8,176 L-8,176 Z" fill={C.bronze} sw={2.5} />
          <Ink d="M10,-12 q14,-6 12,-26" sw={2.5} color={C.darkBrown} />
          <path d={ellipseD(22, -40, 3.5)} fill={C.lava} />
        </g>
      );
    case "hammer":
      return (
        <g transform={`translate(${x},${y})`}>
          <Pencil d="M-4,-10 L4,-10 L4,70 L-4,70 Z" fill={C.brown} sw={3} />
          <Pencil d="M-26,62 L26,62 L26,92 L-26,92 Z" fill={C.iron} sw={3.5} />
        </g>
      );
    case "ricebale":
      return (
        <g transform={`translate(${x - 6},${y - 40})`}>
          <Pencil d={blobD(0, 0, 44, 30, 5, 3, 0.06)} fill={C.straw} sw={3.5} />
          <Ink d="M-24,-26 Q-30,0 -24,26 M0,-30 Q-6,0 0,30 M24,-26 Q18,0 24,26" sw={3} color={C.darkBrown} />
        </g>
      );
    default:
      return null;
  }
};

const Eyes: React.FC<{ expr: Expr; look: [number, number]; blink: number }> = ({ expr, look, blink }) => {
  const ey = HEAD_Y - 2;
  if (expr === "happy" || blink > 0.5) {
    return (
      <g>
        {[-17, 17].map((ex) => (
          <Ink key={ex} d={`M${ex - 10},${ey + 2} Q${ex},${ey - 9} ${ex + 10},${ey + 2}`} sw={4} />
        ))}
      </g>
    );
  }
  const big = expr === "shock" ? 1.22 : 1;
  const pr = expr === "shock" ? 4.5 : 7.5;
  const lid = expr === "tired" ? 0.45 : 0;
  return (
    <g>
      {[-17, 17].map((ex) => {
        const rx = 11.5 * big;
        const ry = 13.5 * big;
        return (
          <g key={ex}>
            <path d={ellipseD(ex, ey, rx, ry)} fill={C.white} stroke={INK} strokeWidth={3.5} />
            <path d={ellipseD(ex + look[0] * 4, ey + 2 + look[1] * 4, pr, pr * 1.1)} fill={INK} />
            <path d={ellipseD(ex + look[0] * 4 + 2.5, ey - 1 + look[1] * 4, 2.4)} fill={C.white} />
            {lid > 0 ? (
              <path
                d={`M${ex - rx - 2},${ey - ry - 2} H${ex + rx + 2} V${ey - ry + ry * 2 * lid} H${ex - rx - 2} Z`}
                fill={C.skin}
                stroke={INK}
                strokeWidth={3}
              />
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

const Brows: React.FC<{ expr: Expr }> = ({ expr }) => {
  const y = HEAD_Y - 24;
  const tilt =
    expr === "angry" ? 7 : expr === "worry" || expr === "nervous" ? -6 : expr === "shock" ? -2 : expr === "grin" ? 3 : 0;
  const lift = expr === "shock" ? -7 : expr === "worry" ? -3 : 0;
  return (
    <g>
      <Ink d={`M-28,${y + lift - tilt * 0.4} L-9,${y + lift + tilt}`} sw={4.5} />
      <Ink d={`M28,${y + lift - tilt * 0.4} L9,${y + lift + tilt}`} sw={4.5} />
    </g>
  );
};

const Mouth: React.FC<{ expr: Expr; f: number }> = ({ expr, f }) => {
  const y = HEAD_Y + 22;
  switch (expr) {
    case "grin":
      return (
        <g>
          <path d={`M-20,${y - 4} Q0,${y - 8} 20,${y - 4} Q16,${y + 18} 0,${y + 19} Q-16,${y + 18} -20,${y - 4} Z`} fill={C.white} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
          <Ink d={`M-18,${y + 3} Q0,${y + 6} 18,${y + 3} M-7,${y - 6} V${y + 16} M7,${y - 6} V${y + 16}`} sw={2} />
        </g>
      );
    case "happy":
    case "smile":
      return <Ink d={`M-13,${y - 2} Q0,${y + 11} 13,${y - 2}`} sw={4} />;
    case "shock":
      return <path d={ellipseD(0, y + 4, 8, 11)} fill={INK} />;
    case "worry":
    case "nervous":
      return (
        <Ink
          d={`M-14,${y + 4} Q-7,${y - 2 + Math.sin(f / 3) * 1.5} 0,${y + 4} Q7,${y + 10} 14,${y + 4}`}
          sw={3.5}
        />
      );
    case "angry":
      return <Ink d={`M-13,${y + 8} Q0,${y - 3} 13,${y + 8}`} sw={4} />;
    case "tired":
      return <Ink d={`M-10,${y + 6} Q0,${y + 2} 10,${y + 6}`} sw={3.5} />;
    default:
      return <Ink d={`M-9,${y + 3} L9,${y + 3}`} sw={3.5} />;
  }
};

const Hair: React.FC<{ tribe: Tribe; long?: boolean; back?: boolean }> = ({ tribe, long, back }) => {
  const hy = HEAD_Y;
  if (back) {
    if (!long) return null;
    return <Pencil d={`M-44,${hy - 10} Q-56,${hy + 60} -40,${hy + 96} L40,${hy + 96} Q56,${hy + 60} 44,${hy - 10} Z`} fill={C.hair} sw={3.5} />;
  }
  if (tribe === "jomon") {
    return (
      <g>
        {/* top-knot bun */}
        <Pencil d={ellipseD(0, hy - 58, 20, 17)} fill={C.hair} sw={3.5} />
        <Pencil
          d={`M-47,${hy + 4} C-52,${hy - 40} -24,${hy - 52} 0,${hy - 50} C24,${hy - 52} 52,${hy - 40} 47,${hy + 4} C40,${hy - 14} 28,${hy - 24} 10,${hy - 26} L0,${hy - 18} L-8,${hy - 27} C-28,${hy - 24} -40,${hy - 14} -47,${hy + 4} Z`}
          fill={C.hair}
          sw={3.5}
        />
        {/* cord-patterned headband */}
        <Pencil d={`M-45,${hy - 20} Q0,${hy - 34} 45,${hy - 20} L44,${hy - 11} Q0,${hy - 25} -44,${hy - 11} Z`} fill={C.terracotta} sw={3} />
        <Ink d={`M-36,${hy - 18} l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6`} sw={2} />
      </g>
    );
  }
  if (tribe === "yayoi") {
    return (
      <g>
        {/* side loops (mizura) */}
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <Pencil d={ellipseD(sd * 50, hy + 8, 11, 22)} fill={C.hair} sw={3.5} />
            <Pencil d={`M${sd * 44},${hy + 22} L${sd * 56},${hy + 22} L${sd * 55},${hy + 30} L${sd * 45},${hy + 30} Z`} fill={C.white} sw={2.5} />
          </g>
        ))}
        <Pencil
          d={`M-47,${hy + 2} C-50,${hy - 44} -20,${hy - 52} 0,${hy - 51} C20,${hy - 52} 50,${hy - 44} 47,${hy + 2} C44,${hy - 18} 30,${hy - 28} 2,${hy - 30} C-30,${hy - 28} -44,${hy - 18} -47,${hy + 2} Z`}
          fill={C.hair}
          sw={3.5}
        />
        <Pencil d={`M-46,${hy - 22} Q0,${hy - 36} 46,${hy - 22} L45,${hy - 13} Q0,${hy - 27} -45,${hy - 13} Z`} fill={C.white} sw={3} />
      </g>
    );
  }
  if (tribe === "monk") {
    return <Shade d={ellipseD(-16, hy - 30, 12, 7)} fill={C.white} opacity={0.6} />;
  }
  const neat = (
    <Pencil
      d={`M-47,${hy + 2} C-50,${hy - 44} -20,${hy - 52} 0,${hy - 51} C20,${hy - 52} 50,${hy - 44} 47,${hy + 2} C44,${hy - 18} 30,${hy - 28} 2,${hy - 30} C-30,${hy - 28} -44,${hy - 18} -47,${hy + 2} Z`}
      fill={C.hair}
      sw={3.5}
    />
  );
  if (tribe === "ninja") return null;
  if (tribe === "portuguese") {
    return (
      <Pencil
        d={`M-47,${hy + 2} C-50,${hy - 44} -20,${hy - 52} 0,${hy - 51} C20,${hy - 52} 50,${hy - 44} 47,${hy + 2} C44,${hy - 18} 30,${hy - 28} 2,${hy - 30} C-30,${hy - 28} -44,${hy - 18} -47,${hy + 2} Z`}
        fill="#7a4a2a"
        sw={3.5}
      />
    );
  }
  if (tribe === "smith") {
    return (
      <Pencil
        d={`M-47,${hy + 2} C-50,${hy - 44} -20,${hy - 52} 0,${hy - 51} C20,${hy - 52} 50,${hy - 44} 47,${hy + 2} C44,${hy - 18} 30,${hy - 28} 2,${hy - 30} C-30,${hy - 28} -44,${hy - 18} -47,${hy + 2} Z`}
        fill={C.hair}
        sw={3.5}
      />
    );
  }
  if (tribe === "emperor" || tribe === "noble" || tribe === "priest" || tribe === "modern" || tribe === "mongol" || tribe === "khan") {
    return neat;
  }
  if (tribe === "fool") {
    // chasen-mage: a messy tea-whisk topknot tied with a red cord
    return (
      <g>
        {neat}
        <Pencil d={`M-8,${hy - 46} L-26,${hy - 104} L-10,${hy - 88} L-6,${hy - 118} L4,${hy - 92} L16,${hy - 116} L14,${hy - 86} L30,${hy - 98} L10,${hy - 46} Z`} fill={C.hair} sw={3} />
        <Pencil d={`M-11,${hy - 50} L11,${hy - 50} L12,${hy - 62} L-12,${hy - 62} Z`} fill={C.red} sw={2.5} />
        <Ink d={`M10,${hy - 56} q16,4 20,20 M12,${hy - 54} q10,12 6,26`} sw={3} color={C.red} />
      </g>
    );
  }
  if (tribe === "guard" || tribe === "daimyo" || tribe === "samurai" || tribe === "shogun" || tribe === "nobunaga" || tribe === "general") {
    // chonmage: shaved pate with a top-knot
    return (
      <g>
        {neat}
        <Pencil d={ellipseD(0, hy - 34, 28, 14)} fill={C.skin} sw={2.5} off={[1, 1]} />
        <Pencil d={`M-7,${hy - 40} Q-10,${hy - 70} 0,${hy - 72} Q10,${hy - 70} 7,${hy - 40} Z`} fill={C.hair} sw={3} />
      </g>
    );
  }
  // nomad / bandit: shaggy hair
  return (
    <Pencil
      d={`M-48,${hy + 6} L-52,${hy - 18} L-40,${hy - 30} L-42,${hy - 48} L-22,${hy - 46} L-12,${hy - 62} L4,${hy - 50} L20,${hy - 62} L26,${hy - 44} L44,${hy - 46} L42,${hy - 28} L54,${hy - 16} L48,${hy + 6} C40,${hy - 16} 22,${hy - 26} 0,${hy - 26} C-22,${hy - 26} -40,${hy - 16} -48,${hy + 6} Z`}
      fill={C.hair}
      sw={3.5}
    />
  );
};

const DARK = "#2b2b35";

const Hat: React.FC<{ tribe: Tribe }> = ({ tribe }) => {
  const hy = HEAD_Y;
  switch (tribe) {
    case "emperor":
      return (
        <g>
          <Pencil d={`M-7,${hy - 70} L-3,${hy - 156} L11,${hy - 156} L8,${hy - 70} Z`} fill={DARK} sw={3} />
          <Pencil d={`M-36,${hy - 26} Q-38,${hy - 76} 0,${hy - 80} Q38,${hy - 76} 36,${hy - 26} Q0,${hy - 38} -36,${hy - 26} Z`} fill={DARK} sw={3.5} />
          <Ink d={`M-34,${hy - 36} Q0,${hy - 46} 34,${hy - 36}`} sw={2.5} color={C.bronze} />
        </g>
      );
    case "noble":
    case "priest":
      return (
        <Pencil
          d={`M-34,${hy - 26} C-42,${hy - 80} -12,${hy - 130} 20,${hy - 126} C30,${hy - 96} 38,${hy - 60} 34,${hy - 26} Q0,${hy - 36} -34,${hy - 26} Z`}
          fill={DARK}
          sw={3.5}
        />
      );
    case "guard":
      return (
        <g>
          <Pencil d={`M-46,${hy - 24} Q0,${hy - 38} 46,${hy - 24} L45,${hy - 14} Q0,${hy - 28} -45,${hy - 14} Z`} fill={C.white} sw={3} />
          <Pencil d={`M44,${hy - 22} l22,-10 l-4,14 l14,8 l-22,2 Z`} fill={C.white} sw={2.5} />
        </g>
      );
    case "portuguese":
      return (
        <g>
          <Pencil d={`M-30,${hy - 40} Q-28,${hy - 96} 0,${hy - 98} Q28,${hy - 96} 30,${hy - 40} Z`} fill="#2b2b35" sw={3.5} />
          <Pencil d={`M-86,${hy - 36} Q0,${hy - 64} 86,${hy - 36} Q60,${hy - 22} 0,${hy - 30} Q-60,${hy - 22} -86,${hy - 36} Z`} fill="#2b2b35" sw={3.5} />
          <Ink d={`M24,${hy - 80} q30,-30 50,-20`} sw={5} color={C.red} />
        </g>
      );
    case "smith":
      return (
        <g>
          <Pencil d={`M-46,${hy - 24} Q0,${hy - 38} 46,${hy - 24} L45,${hy - 14} Q0,${hy - 28} -45,${hy - 14} Z`} fill={C.indigo} sw={3} />
          <Pencil d={`M44,${hy - 22} l22,-10 l-4,14 l14,8 l-22,2 Z`} fill={C.indigo} sw={2.5} />
        </g>
      );
    case "ninja":
      return (
        <g>
          <Pencil d={`M-52,${hy - 12} C-58,${hy - 74} 58,${hy - 74} 52,${hy - 12} Q0,${hy - 26} -52,${hy - 12} Z`} fill="#2f3346" sw={3.5} />
          {[-1, 1].map((sd) => (
            <Pencil key={sd} d={`M${sd * 56},${hy - 16} L${sd * 40},${hy - 16} L${sd * 40},${hy + 14} L${sd * 54},${hy + 14} Z`} fill="#2f3346" sw={3} />
          ))}
          <Pencil d={`M-50,${hy + 8} Q0,${hy + 18} 50,${hy + 8} C52,${hy + 42} 30,${hy + 54} 0,${hy + 56} C-30,${hy + 54} -52,${hy + 42} -50,${hy + 8} Z`} fill="#2f3346" sw={3.5} />
          <Pencil d={`M52,${hy - 30} q26,-6 36,8 q-14,0 -22,8 Z`} fill="#2f3346" sw={2.5} />
        </g>
      );
    case "mongol":
    case "khan": {
      const khan = tribe === "khan";
      return (
        <g>
          {khan ? (
            <g>
              <Pencil d={`M-30,${hy - 40} Q-26,${hy - 100} 0,${hy - 110} Q26,${hy - 100} 30,${hy - 40} Z`} fill={C.yellow} sw={3.5} />
              <Pencil d={ellipseD(0, hy - 76, 9, 11)} fill={C.red} sw={2.5} />
              <Ink d={`M0,${hy - 110} q-6,-24 10,-40`} sw={4} color={C.red} />
            </g>
          ) : (
            <g>
              <Pencil d={`M-36,${hy - 38} Q-22,${hy - 98} 0,${hy - 106} Q22,${hy - 98} 36,${hy - 38} Z`} fill={C.red} sw={3.5} />
              <Pencil d={ellipseD(0, hy - 108, 7)} fill={C.yellow} sw={2.5} />
            </g>
          )}
          <Pencil d={`M-54,${hy - 14} Q0,${hy - 34} 54,${hy - 14} L52,${hy - 38} Q0,${hy - 56} -52,${hy - 38} Z`} fill={khan ? "#efe6d8" : C.brown} sw={3.5} />
          <Ink d={`M-40,${hy - 30} l4,8 M-20,${hy - 36} l4,8 M0,${hy - 38} l4,8 M20,${hy - 36} l4,8 M40,${hy - 30} l4,8`} sw={2} opacity={0.6} />
        </g>
      );
    }
    case "general":
      return (
        <g>
          {[-1, 1].map((sd) => (
            <Pencil key={sd} d={`M${sd * 50},${hy - 14} L${sd * 80},${hy + 28} L${sd * 60},${hy + 40} L${sd * 44},${hy + 4} Z`} fill="#3f7f86" sw={3.5} />
          ))}
          <Pencil d={`M-54,${hy - 10} C-56,${hy - 70} -26,${hy - 86} 0,${hy - 86} C26,${hy - 86} 56,${hy - 70} 54,${hy - 10} Q0,${hy - 30} -54,${hy - 10} Z`} fill="#2f4a55" sw={4} />
          {[0, 1, 2, 3, 4].map((k) => {
            const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
            return <Pencil key={k} d={ellipseD(Math.cos(a) * 13, hy - 100 + Math.sin(a) * 13, 10, 10)} fill="#8fb4e0" sw={2.5} />;
          })}
          <Pencil d={ellipseD(0, hy - 100, 7)} fill={C.white} sw={2} />
          <Ink d={`M0,${hy - 86} L0,${hy - 76}`} sw={3} />
        </g>
      );
    case "samurai":
    case "shogun": {
      const big = tribe === "shogun";
      const bowl = big ? "#4a2a2e" : "#33406b";
      const lace = big ? C.red : C.indigo;
      return (
        <g>
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <Pencil d={`M${sd * 50},${hy - 14} L${sd * 82},${hy + 30} L${sd * 60},${hy + 42} L${sd * 44},${hy + 4} Z`} fill={lace} sw={3.5} />
              <Ink d={`M${sd * 56},${hy + 2} L${sd * 74},${hy + 22} M${sd * 50},${hy + 12} L${sd * 66},${hy + 34}`} sw={2} />
            </g>
          ))}
          <Pencil d={`M-54,${hy - 10} C-56,${hy - 70} -26,${hy - 86} 0,${hy - 86} C26,${hy - 86} 56,${hy - 70} 54,${hy - 10} Q0,${hy - 30} -54,${hy - 10} Z`} fill={bowl} sw={4} />
          <Ink d={`M-30,${hy - 22} Q-34,${hy - 60} -14,${hy - 80} M0,${hy - 24} L0,${hy - 84} M30,${hy - 22} Q34,${hy - 60} 14,${hy - 80}`} sw={2} color={C.white} opacity={0.5} />
          {/* kuwagata crest */}
          {[-1, 1].map((sd) => (
            <Pencil
              key={sd}
              d={`M${sd * 4},${hy - 50} C${sd * (big ? 40 : 30)},${hy - 80} ${sd * (big ? 58 : 42)},${hy - (big ? 150 : 124)} ${sd * (big ? 44 : 32)},${hy - (big ? 176 : 146)} C${sd * (big ? 34 : 26)},${hy - 120} ${sd * 18},${hy - 86} ${sd * -2},${hy - 62} Z`}
              fill={C.yellow}
              sw={3.5}
            />
          ))}
          <Pencil d={`M-12,${hy - 66} L12,${hy - 66} L10,${hy - 44} L-10,${hy - 44} Z`} fill={C.yellow} sw={3} />
          {big ? <Pencil d={ellipseD(0, hy - 112, 18)} fill={C.red} sw={3.5} /> : null}
        </g>
      );
    }
    default:
      return null;
  }
};

const OUTFIT: Partial<Record<Tribe, string>> = {
  jomon: C.terracotta,
  yayoi: C.white,
  nomad: C.tan,
  monk: "#6a6a74",
  emperor: "#c9902f",
  noble: "#9cc3a0",
  priest: C.white,
  guard: C.brown,
  samurai: C.indigo,
  shogun: C.red,
  daimyo: "#3f5f8f",
  modern: "#e07b5f",
  bandit: "#7d7d78",
  ninja: "#2f3346",
  mongol: "#9a4a3a",
  khan: "#c9902f",
  portuguese: "#7a2a3a",
  smith: C.white,
  fool: "#e9a23b",
  nobunaga: "#2b2b35",
  general: "#3f6f7f",
};

const LEGS: Partial<Record<Tribe, string>> = {
  monk: "#55555e",
  emperor: "#8a5a2a",
  noble: "#5f7f6a",
  priest: "#9fc4dd",
  guard: "#3a3d4f",
  samurai: "#3a3d4f",
  shogun: "#3a3d4f",
  daimyo: "#3a3d4f",
  modern: "#4a6aa0",
  ninja: "#2f3346",
  mongol: "#5a4636",
  khan: "#7a3a2a",
  portuguese: "#3a3a4a",
  smith: "#5a4636",
  nobunaga: "#3a3d4f",
  general: "#3a3d4f",
};

/** Body details drawn over the tunic for the Part 2 cast. */
const Outfit: React.FC<{ tribe: Tribe }> = ({ tribe }) => {
  switch (tribe) {
    case "monk":
      return <Pencil d="M-26,-138 L-8,-138 L40,-58 L22,-52 Z" fill={C.orange} sw={3} />;
    case "emperor":
    case "noble":
      return (
        <g>
          {[[-18, -112], [14, -100], [-10, -78], [22, -70], [-26, -62]].map(([dx, dy], i) => (
            <Ink key={i} d={ellipseD(dx, dy, 6)} sw={2} opacity={0.6} />
          ))}
          <Pencil d="M-38,-88 Q0,-80 38,-88 L39,-78 Q0,-70 -39,-78 Z" fill={tribe === "emperor" ? "#7a3a2a" : "#4f6f5a"} sw={3} />
        </g>
      );
    case "priest":
      return <Pencil d="M-39,-80 Q0,-72 39,-80 L44,-50 Q0,-42 -44,-50 Z" fill="#9fc4dd" sw={3} />;
    case "portuguese":
      return (
        <g>
          <Pencil d="M-36,-140 Q-18,-152 0,-142 Q18,-152 36,-140 Q20,-126 0,-132 Q-20,-126 -36,-140 Z" fill={C.white} sw={3} />
          {[-110, -94, -78, -62].map((by) => (
            <path key={by} d={ellipseD(0, by, 3.5)} fill={C.yellow} />
          ))}
          <Pencil d="M-40,-60 Q0,-52 40,-60 L44,-48 Q0,-40 -44,-48 Z" fill="#2b2b35" sw={3} />
        </g>
      );
    case "smith":
      return <Pencil d="M-26,-122 L26,-122 L38,-50 Q0,-44 -38,-50 Z" fill={C.brown} sw={3.5} />;
    case "fool":
      // loose robe hanging off one shoulder, a rope belt with a gourd
      return (
        <g>
          <Pencil d="M-30,-136 Q-10,-140 2,-134 L-18,-96 L-34,-100 Z" fill={C.skin} sw={3} />
          {[[-14, -112], [16, -118], [22, -70], [-24, -66]].map(([dx, dy], i) => (
            <Ink key={i} d={`M${dx - 7},${dy} l7,-7 l7,7 l-7,7 Z`} sw={2} opacity={0.6} />
          ))}
          <Ink d="M-40,-80 Q0,-70 40,-80" sw={6} color={C.straw} />
          <Ink d="M24,-77 L30,-62" sw={2.5} color={C.straw} />
          <Pencil d="M30,-62 C20,-60 20,-46 30,-44 C18,-40 18,-20 32,-18 C46,-20 46,-40 34,-44 C44,-46 42,-60 30,-62 Z" fill={C.tan} sw={2.5} />
          <Pencil d="M-20,-62 h14 v12 h-14 Z" fill={C.indigo} sw={2.5} />
        </g>
      );
    case "nobunaga":
    case "general": {
      const nob = tribe === "nobunaga";
      const rows = [-120, -106, -92, -78, -64];
      return (
        <g>
          {rows.map((ry) => (
            <Ink key={ry} d={`M${-30 - (ry + 136) * 0.16},${ry} Q0,${ry + 4} ${30 + (ry + 136) * 0.16},${ry}`} sw={2.2} color={nob ? C.yellow : C.white} opacity={0.8} />
          ))}
          {[-1, 1].map((sd) => (
            <Pencil key={sd} d={`M${sd * 24},-140 L${sd * 58},-132 L${sd * 60},-92 L${sd * 30},-98 Z`} fill={nob ? "#8a2a2e" : "#3f7f86"} sw={3.5} />
          ))}
          {nob ? (
            <g>
              {[0, 1, 2, 3, 4].map((k) => {
                const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
                return <Pencil key={k} d={ellipseD(Math.cos(a) * 9, -106 + Math.sin(a) * 9, 7, 7)} fill={C.yellow} sw={2} />;
              })}
              <path d={ellipseD(0, -106, 4)} fill={INK} />
            </g>
          ) : null}
        </g>
      );
    }
    case "ninja":
      return <Pencil d="M-38,-84 Q0,-76 38,-84 L39,-74 Q0,-66 -39,-74 Z" fill="#555a70" sw={3} />;
    case "mongol":
    case "khan":
      return (
        <g>
          <Pencil d="M-30,-136 L-8,-136 L-2,-60 L-24,-60 Z" fill={tribe === "khan" ? "#efe6d8" : C.tan} sw={3} />
          <Pencil d="M-40,-82 Q0,-74 40,-82 L41,-70 Q0,-62 -41,-70 Z" fill={tribe === "khan" ? C.yellow : C.darkBrown} sw={3} />
          {tribe === "khan" ? <Ink d="M6,-120 q10,-8 20,0 q-10,8 -20,0 M10,-100 q10,-8 20,0" sw={2.5} color={C.yellow} /> : null}
        </g>
      );
    case "guard":
    case "samurai":
    case "shogun": {
      const rows = [-120, -106, -92, -78, -64];
      return (
        <g>
          {rows.map((ry) => (
            <Ink key={ry} d={`M${-30 - (ry + 136) * 0.16},${ry} Q0,${ry + 4} ${30 + (ry + 136) * 0.16},${ry}`} sw={2.2} opacity={0.75} />
          ))}
          {[-18, 0, 18].map((dx) => (
            <Ink key={dx} d={`M${dx},-132 L${dx * 1.3},-56`} sw={1.6} color={tribe === "guard" ? C.tan : C.white} opacity={0.7} />
          ))}
          {tribe !== "guard"
            ? [-1, 1].map((sd) => (
                <Pencil
                  key={sd}
                  d={`M${sd * 24},-140 L${sd * 58},-132 L${sd * 60},-92 L${sd * 30},-98 Z`}
                  fill={tribe === "shogun" ? C.red : C.indigo}
                  sw={3.5}
                />
              ))
            : null}
          {tribe === "shogun" ? <Pencil d={ellipseD(0, -104, 13)} fill={C.yellow} sw={3} /> : null}
        </g>
      );
    }
    case "daimyo":
      return (
        <g>
          {[-1, 1].map((sd) => (
            <Pencil key={sd} d={`M${sd * 22},-138 L${sd * 70},-146 L${sd * 52},-106 L${sd * 30},-108 Z`} fill="#3f5f8f" sw={3.5} />
          ))}
          <Pencil d={ellipseD(0, -110, 11)} fill={C.white} sw={2.5} />
        </g>
      );
    case "bandit":
      return (
        <g>
          <Pencil d="M-24,-100 L-8,-100 L-8,-86 L-24,-86 Z" fill={C.tan} sw={2.5} />
          <Pencil d="M10,-72 L26,-72 L26,-58 L10,-58 Z" fill={C.darkBrown} sw={2.5} />
        </g>
      );
    default:
      return null;
  }
};

/** Katana + wakizashi worn at the left hip. */
const HipSwords: React.FC = () => (
  <g>
    <Pencil d="M-22,-76 L-74,-8 L-66,-3 L-15,-71 Z" fill={DARK} sw={3} />
    <Pencil d={ellipseD(-18, -74, 9, 4)} fill={C.bronze} sw={2.5} />
    <Pencil d="M-17,-78 L-2,-98 L5,-93 L-10,-73 Z" fill={C.white} sw={2.5} />
    <Pencil d="M-30,-62 L-62,-20 L-55,-15 L-23,-57 Z" fill="#5a2a2e" sw={3} />
    <Pencil d="M-25,-63 L-14,-78 L-7,-73 L-18,-58 Z" fill={C.white} sw={2.5} />
  </g>
);

/** A villager in the hybrid style: big storybook eyes, history-cartoon faces. */
export const Person: React.FC<PersonProps> = ({
  x,
  y,
  s = 1,
  flip,
  tribe,
  expr = "smile",
  f,
  walk,
  aL = 8,
  aR = 8,
  look = [0, 0],
  hold = "none",
  long,
  skin = C.skin,
  cloth,
  seed = 0,
  bob = 0,
  lean = 0,
  sit,
  blinkOff,
  beard,
}) => {
  const outfit = cloth ?? OUTFIT[tribe] ?? C.tan;
  const legs = LEGS[tribe] ?? skin;
  const walking = walk !== undefined;
  const swing = walking ? Math.sin(walk!) * 24 : 0;
  const lift = walking ? Math.abs(Math.cos(walk!)) * 5 : 0;
  // Blink every few seconds, staggered per character.
  const period = 95 + Math.floor(rand(seed + 3) * 40);
  const ph = (f + seed * 37) % period;
  const blink = blinkOff ? 0 : ph < 4 ? 1 : 0;
  const legY = sit ? -30 : 0;

  return (
    <g transform={`translate(${x},${y - lift - bob}) scale(${flip ? -s : s},${s})`}>
      <g transform={`rotate(${lean})`}>
        {/* Nobunaga's European-style cape hangs behind everything */}
        {tribe === "nobunaga" ? (
          <g transform={`translate(0,${legY})`}>
            <Pencil d="M-30,-140 Q0,-148 30,-140 L62,-30 Q0,-14 -62,-30 Z" fill={C.red} sw={4} />
            <Ink d="M-20,-120 L-42,-40 M20,-120 L42,-40" sw={2} opacity={0.5} />
          </g>
        ) : null}
        {/* legs */}
        {sit ? (
          <g>
            <Pencil d="M-26,-40 L30,-40 L32,-22 L-26,-22 Z" fill={legs} sw={3.5} />
            <Pencil d={ellipseD(36, -30, 12, 10)} fill={C.darkBrown} sw={3} />
          </g>
        ) : (
          [-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${sd * 13},-50) rotate(${sd * swing})`}>
              <Pencil d="M-8,0 L8,0 L7,48 L-7,48 Z" fill={legs} sw={3.5} />
              <Pencil d={ellipseD(5, 50, 13, 7)} fill={tribe === "fool" ? skin : C.darkBrown} sw={3} />
            </g>
          ))
        )}
        <g transform={`translate(0,${legY})`}>
          <Hair tribe={tribe} long={long} back />

          {/* back arm */}
          <Arm sx={-27} sy={-124} a={walking ? 8 - swing : aL} skin={skin} cloth={outfit} side={-1} />
          {/* body / tunic */}
          <Pencil d="M-30,-136 Q0,-142 30,-136 L44,-50 Q0,-42 -44,-50 Z" fill={outfit} sw={4} />
          {tribe === "jomon" ? (
            <Ink d="M-36,-70 l9,-8 l9,8 l9,-8 l9,8 l9,-8 l9,8 l9,-8 l9,8" sw={2.5} />
          ) : null}
          {tribe === "jomon" ? <Ink d="M-32,-100 l8,-7 l8,7 l8,-7 l8,7 l8,-7 l8,7 l8,-7 l8,7" sw={2} opacity={0.7} /> : null}
          {tribe === "yayoi" ? (
            <g>
              <Pencil d="M-38,-82 Q0,-74 38,-82 L40,-70 Q0,-62 -40,-70 Z" fill={C.indigo} sw={3} />
              <Ink d="M-16,-138 L0,-112 L16,-138" sw={3} />
            </g>
          ) : null}
          <Outfit tribe={tribe} />
          {tribe === "samurai" || tribe === "shogun" || tribe === "daimyo" || tribe === "nobunaga" || tribe === "general" ? <HipSwords /> : null}
          {tribe === "nomad" || tribe === "bandit" ? (
            <g>
              {[[-14, -110], [12, -96], [-20, -76], [18, -66], [0, -84]].map(([dx, dy], i) => (
                <Shade key={i} d={blobD(dx, dy, 7, 5, i + 4, 4, 0.2)} fill={C.darkBrown} opacity={0.7} />
              ))}
            </g>
          ) : null}
          {/* head */}
          <Pencil d={ellipseD(-48, HEAD_Y + 6, 9, 12)} fill={skin} sw={3.5} />
          <Pencil d={ellipseD(48, HEAD_Y + 6, 9, 12)} fill={skin} sw={3.5} />
          <Pencil d={ellipseD(0, HEAD_Y, HEAD_R, HEAD_R * 0.98)} fill={skin} sw={4} />
          <Shade d={ellipseD(-27, HEAD_Y + 18, 9, 6)} fill={C.pink} opacity={0.75} />
          <Shade d={ellipseD(27, HEAD_Y + 18, 9, 6)} fill={C.pink} opacity={0.75} />
          {tribe === "jomon" ? (
            <Ink d={`M-34,${HEAD_Y + 10} l8,6 M34,${HEAD_Y + 10} l-8,6`} sw={2.5} color={C.terracotta} />
          ) : null}
          <Hair tribe={tribe} long={long} />
          <Eyes expr={expr} look={look} blink={blink} />
          <Brows expr={expr} />
          <Mouth expr={expr} f={f} />
          <Hat tribe={tribe} />
          {tribe === "nobunaga" ? (
            <Ink d={`M-2,${HEAD_Y + 14} Q-14,${HEAD_Y + 8} -28,${HEAD_Y + 18} M2,${HEAD_Y + 14} Q14,${HEAD_Y + 8} 28,${HEAD_Y + 18}`} sw={4} color={C.hair} />
          ) : null}
          {beard ? (
            <g>
              <Pencil d={`M-30,${HEAD_Y + 34} Q-36,${HEAD_Y + 80} 0,${HEAD_Y + 96} Q36,${HEAD_Y + 80} 30,${HEAD_Y + 34} Q0,${HEAD_Y + 46} -30,${HEAD_Y + 34} Z`} fill={C.hair} sw={3} />
              <Pencil d={`M-2,${HEAD_Y + 18} Q-20,${HEAD_Y + 14} -34,${HEAD_Y + 30} Q-16,${HEAD_Y + 26} -2,${HEAD_Y + 24} Z M2,${HEAD_Y + 18} Q20,${HEAD_Y + 14} 34,${HEAD_Y + 30} Q16,${HEAD_Y + 26} 2,${HEAD_Y + 24} Z`} fill={C.hair} sw={2.5} />
            </g>
          ) : null}
          {expr === "tired" || expr === "nervous" ? (
            <Pencil d={`M54,${HEAD_Y - 30} Q62,${HEAD_Y - 14} 56,${HEAD_Y - 8} Q48,${HEAD_Y - 12} 54,${HEAD_Y - 30} Z`} fill={C.sky} sw={2.5} />
          ) : null}
          {/* front arm */}
          <Arm sx={27} sy={-124} a={walking ? 8 + swing : aR} skin={skin} cloth={outfit} side={1} hold={hold} />
        </g>
      </g>
    </g>
  );
};
