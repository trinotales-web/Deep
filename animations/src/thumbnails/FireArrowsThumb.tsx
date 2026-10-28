import React from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Stage, X, Part, Glow, InkLine, Arrow, RagBall, Quiver, Palisade, FlyingArrow, blob, circle } from "../kit";
import { Character, reachArm } from "../kit/character";
import { Sky, Cloud, Mountains, Ground, Tent, Flame, Smoke } from "../kit/env";
import { ARCHER } from "../episodes/firearrows/cast";

// Thumbnail for "Why Flaming Arrows Were Almost Never Used in History".
//   npx remotion still ThumbFireArrows out/thumbs/fire-arrows.png
// Close-up house style: sharp foreground over a softly blurred background,
// chunky white title with an ink outline and a dark drop shadow.

const TITLE_FONT = "Lilita One";
loadFont({ family: TITLE_FONT, url: staticFile("fonts/lilita-one-latin-400-normal.woff2"), weight: "400" });

const INK = "#1d1519";
const SIGN_RED = "#e3262d";

/** Big thumbnail word: white fill, thick ink outline, solid drop shadow. */
export const ThumbText: React.FC<{ text: string; x: number; y: number; size: number; color?: string; rotate?: number }> = ({
  text,
  x,
  y,
  size,
  color = "#ffffff",
  rotate = 0,
}) => {
  const { width, height } = useVideoConfig();
  const depth = Math.round(size * 0.07);
  const shadow = Array.from({ length: depth }, (_, i) => `${(i + 1) * 0.6}px ${i + 1}px 0 ${INK}`).join(", ");
  return (
    <div
      style={{
        position: "absolute",
        left: (0.5 + x / width) * width,
        top: (0.5 - y / height) * height,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        fontFamily: `'${TITLE_FONT}', sans-serif`,
        fontSize: size,
        lineHeight: 1,
        whiteSpace: "nowrap",
        color,
        letterSpacing: size * 0.01,
        WebkitTextStroke: `${size * 0.11}px ${INK}`,
        paintOrder: "stroke fill",
        textShadow: shadow,
      }}
    >
      {text}
    </div>
  );
};

/** Red "no" sign. */
const NoSign: React.FC<{ x: number; y: number; r: number; z?: number }> = ({ x, y, r, z = 5 }) => {
  const ring = Array.from({ length: 65 }, (_, k) => [Math.cos((k / 64) * Math.PI * 2) * r, Math.sin((k / 64) * Math.PI * 2) * r] as [number, number]);
  const k = r * 0.7071;
  return (
    <X x={x} y={y} z={z}>
      <InkLine pts={ring} width={r * 0.2} color={SIGN_RED} outline={9} />
      <InkLine pts={[[-k, k], [k, -k]]} width={r * 0.2} color={SIGN_RED} outline={9} z={0.01} />
    </X>
  );
};

/** The softly blurred siege behind everything. */
const Backdrop: React.FC = () => (
  <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.35} grain={0.02}>
    <Sky w={2000} h={1400} y={500} top="#6fb3e3" bottom="#d6edf7" z={-40} />
    <Cloud x={-420} y={250} w={420} seed={4} z={-35} />
    <Cloud x={260} y={300} w={360} seed={9} z={-35} />
    <Mountains w={2200} y={-70} color="#a9bfd2" peaks={[[-900, 150], [-400, 220], [100, 160], [600, 230], [1000, 150]]} z={-33} />
    <Ground w={2200} h={700} y={-70} color="#8db35e" far="#a3c473" pebbles={6} tufts={14} tuftColor="#5f7a3a" z={-30} />
    {[-90, 160].map((x, i) => (
      <Tent key={x} x={x} y={-80} w={210} h={160} z={-28 + i * 0.01} />
    ))}
    {/* the wooden wall: fire arrows stuck in it, making black marks and going out */}
    <Palisade x={-380} y={-90} w={760} h={330} z={-26} />
    {[[-560, 110, 3.3], [-420, 60, 3.0], [-260, 140, 3.45], [-150, 70, 3.15]].map(([x, y, r], i) => (
      <X key={i} z={-25 + i * 0.01}>
        <Part shape={blob([[-30, 0], [-12, 24], [22, 18], [30, -6], [6, -24], [-22, -18]], 8)} color="#2a2020" flat outline={0} opacity={0.8} x={x} y={y} />
        <X x={x} y={y} rot={r}>
          <Arrow x={-120} length={150} />
        </X>
        <Smoke x={x} y={y} w={40} h={260} alpha={0.45} seed={i + 2} />
      </X>
    ))}
    {/* a volley fizzling out in the sky */}
    {[0.35, 0.55, 0.75].map((p, i) => (
      <FlyingArrow key={i} from={[700, -40]} via={[200, 420]} to={[-300, 120]} p={p} fire={0.15 + i * 0.1} trail="smoke" trailLen={0.35} s={0.8} z={-20} seed={i} />
    ))}
  </Stage>
);

export const ThumbFireArrows: React.FC = () => {
  // archer close-up on the right, facing the sign
  const s = 2.35;
  const ax = 420;
  const ay = 20 - 308 * s;
  const grip: [number, number] = [150, -160];
  const sign = { x: -335, y: -115, r: 192 };
  // the flaming arrow inside the sign (pointing up-right)
  const fa = { rot: 0.68, s: 3.4, len: 120 };
  const tip: [number, number] = [sign.x + Math.cos(fa.rot) * fa.len * fa.s * 0.5, sign.y + Math.sin(fa.rot) * fa.len * fa.s * 0.5];
  // the archer's own arrow: went out, still smoking
  const dead = { rot: 3.38, s: 2.2, len: 140, grip: 0.22 };
  const deadTip: [number, number] = [
    grip[0] + Math.cos(dead.rot) * dead.len * dead.s * (1 - dead.grip),
    grip[1] + Math.sin(dead.rot) * dead.len * dead.s * (1 - dead.grip),
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#8ec9ee" }}>
      <AbsoluteFill style={{ filter: "blur(5px)", transform: "scale(1.03)" }}>
        <Backdrop />
      </AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0} grain={0} transparent>
        {/* flaming arrow + no sign */}
        <X x={sign.x} y={sign.y} rot={fa.rot} s={fa.s} z={2}>
          <Arrow x={-fa.len * 0.5} length={fa.len} />
        </X>
        <X x={tip[0] - 18} y={tip[1] - 12} z={2.2}>
          <Glow rx={300} color="#ffb04a" alpha={0.6} additive />
          <RagBall s={1.6} lit={0} rot={fa.rot} />
          <Flame size={1.35} y={6} seed={5} z={0.1} />
          <Flame size={0.6} x={-46} y={-20} seed={9} z={0.09} />
        </X>
        <Smoke x={tip[0]} y={tip[1] + 120} w={60} h={360} alpha={0.35} seed={8} z={2.1} />
        <NoSign x={sign.x} y={sign.y} r={sign.r} />

        {/* the archer */}
        <Quiver x={590} y={-260} rot={-0.35} s={2.1} n={5} z={0.5} />
        <Character
          {...ARCHER}
          x={ax}
          y={ay}
          s={s}
          facing={-1}
          look={0.5}
          shadow={false}
          z={1}
          expression={{ eyes: "half", mouth: "frown", brows: 0.35, sweat: true, eyebags: true, gaze: [0.8, -0.45] }}
          pose={{ armF: reachArm(ax, ay, s, -1, grip), armB: [-0.15, -0.1] }}
        />
        <X x={grip[0]} y={grip[1]} rot={dead.rot} s={dead.s} z={1.5}>
          <Arrow x={-dead.len * dead.grip} length={dead.len} />
        </X>
        <X x={deadTip[0]} y={deadTip[1]} z={1.6}>
          <RagBall s={1.0} lit={0} rot={dead.rot} />
          <Part shape={blob([[-30, -4], [-18, 20], [10, 26], [30, 6], [22, -20], [-8, -26]], 8)} color="#3a2c26" flat outline={0} opacity={0.6} x={-4} y={2} z={0.01} />
        </X>
        {/* it went out: a sad little trail of smoke */}
        {[
          [10, 58, 58],
          [-8, 118, 80],
          [16, 190, 104],
        ].map(([dx, dy, w], i) => (
          <Cloud key={i} x={deadTip[0] + dx} y={deadTip[1] + dy} w={w} h={w * 0.82} color="#d4d1d8" shadow="#aaa6b2" seed={i + 3} z={1.7 + i * 0.01} />
        ))}
        {/* sweat drop */}
        <Part shape={blob([[0, 30], [10, 6], [12, -8], [0, -16], [-12, -8], [-10, 6]], 6)} color="#8fd3ff" shade={0.25} x={585} y={92} z={2} />
      </Stage>
      <ThumbText text="USELESS." x={-250} y={250} size={182} rotate={-2} />
    </AbsoluteFill>
  );
};
