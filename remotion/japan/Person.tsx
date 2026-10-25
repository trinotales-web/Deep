import React from "react";
import { C, INK, rand } from "./theme";
import { blobD, ellipseD, Ink, Pencil, Shade } from "./draw";

export type Expr = "smile" | "grin" | "happy" | "worry" | "shock" | "neutral" | "angry" | "tired" | "nervous";
export type Tribe = "jomon" | "yayoi" | "nomad";
export type Hold = "spear" | "rice" | "sickle" | "onigiri" | "paddle" | "fish" | "bundle" | "none";

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
  // nomad: shaggy hair
  return (
    <Pencil
      d={`M-48,${hy + 6} L-52,${hy - 18} L-40,${hy - 30} L-42,${hy - 48} L-22,${hy - 46} L-12,${hy - 62} L4,${hy - 50} L20,${hy - 62} L26,${hy - 44} L44,${hy - 46} L42,${hy - 28} L54,${hy - 16} L48,${hy + 6} C40,${hy - 16} 22,${hy - 26} 0,${hy - 26} C-22,${hy - 26} -40,${hy - 16} -48,${hy + 6} Z`}
      fill={C.hair}
      sw={3.5}
    />
  );
};

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
}) => {
  const outfit = cloth ?? (tribe === "jomon" ? C.terracotta : tribe === "yayoi" ? C.white : C.tan);
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
        {/* legs */}
        {sit ? (
          <g>
            <Pencil d="M-26,-40 L30,-40 L32,-22 L-26,-22 Z" fill={C.skin} sw={3.5} />
            <Pencil d={ellipseD(36, -30, 12, 10)} fill={C.darkBrown} sw={3} />
          </g>
        ) : (
          [-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${sd * 13},-50) rotate(${sd * swing})`}>
              <Pencil d="M-8,0 L8,0 L7,48 L-7,48 Z" fill={skin} sw={3.5} />
              <Pencil d={ellipseD(5, 50, 13, 7)} fill={C.darkBrown} sw={3} />
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
          {tribe === "nomad" ? (
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
