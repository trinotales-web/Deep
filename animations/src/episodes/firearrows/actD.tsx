import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Glow, InkLine, Arrow, Bow, Shield, Scroll, Quill, HandTorch, Falarica, FlyingArrow, FlameFace, Wash, LightCone,
  roundRect, poly, ramp, push, hitAt, absT, type ShotProps,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Sky, Sun, Sea, Ground, Hill, RockHill, StoneWall, Town, Smoke, Sunburst, Longship, Tent, Hide, Flame, Theater, Popcorn, Cloud, Mountains,
} from "../../kit/env";
import { DayField } from "./sets";
import { HANNIBAL, IBERIAN, LIVY, VIKING, IBN_FADLAN } from "./cast";
import { drawPose } from "./actA";
import { WriterDesk, Interior } from "./actB";

const sec = (from: number) => (s: number) => Math.round((s - from) * 30);
const pop = (t: number, at: number) => interpolate(t, [at, at + 0.12, at + 0.22], [0, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Cross: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 30 }) =>
  s > 0 ? (
    <X x={x} y={y} s={s} z={z}>
      <InkLine pts={[[-90, 90], [90, -90]]} width={34} color="#fe5649" outline={8} />
      <InkLine pts={[[-90, -90], [90, 90]]} width={34} color="#fe5649" outline={8} />
    </X>
  ) : null;

const CARTHAGE = (i = 0) => ({
  outfit: { top: ["#6a2a5a", "#5a2a4a", "#7a3a5a"][i % 3], bottom: "#3a2a34", hem: 28, armor: "#b08a4a", belt: "#3a2a1e" },
  hat: "corinthian" as const,
  hatColor: "#b08a4a",
  hatAccent: "#5a1a5a",
  beard: i % 2 ? ("full" as const) : ("stubble" as const),
  beardColor: "#2a2226",
  seed: 90 + i,
});

/** Hand position (world) of a right-facing character's front arm, for props that leave the hand. */
const handAt = (x: number, y: number, s: number, a: number, facing = 1): [number, number] => [
  x + facing * (50 + 140 * Math.sin(a)) * s,
  y + (206 - 140 * Math.cos(a)) * s,
];

// ───────────────────────── I · Saguntum and the falarica ─────────────────────────

/** Saguntum on its rock: walls and roofs. */
const SaguntumHill: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = -140, s = 1, z = -10 }) => (
  <X x={x} y={y} s={s} z={z}>
    <RockHill w={1900} h={360} steep="left" path={false} seed={5} />
    <Town y={350} w={1100} s={0.75} seed={6} z={1} />
    <StoneWall y={330} x={-560} w={160} h={300} z={2} />
    <StoneWall y={330} x={540} w={160} h={300} z={2} />
    <StoneWall y={330} w={1000} h={150} color="#b9b0a4" z={2.1} />
  </X>
);

// I1 311.0 "Saguntum, Spain, 200 BC."
export const SaguntumTitleShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98), y: 40 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-120} mood="warm">
          <SaguntumHill x={380} y={-160} s={0.68} />
        </DayField>
      </Stage>
      <Label text="SAGUNTUM" sub="SPAIN" x={0.26} y={0.2} size={0.1} kind="title" at={6} />
    </AbsoluteFill>
  );
};

// I2 313.8 "Hannibal is attacking the city."
export const HannibalShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-120} mood="warm">
          <SaguntumHill x={760} y={-130} s={0.6} />
          {Array.from({ length: 7 }, (_, i) => (
            <Character key={i} {...CARTHAGE(i)} x={-900 + i * 170} y={-330 - (i % 2) * 30} s={0.55} z={1 + i * 0.01} look={0.5} expression={{ eyes: "angry", mouth: "flat" }} pose={poses.idle(frame, i)} />
          ))}
          <Character {...HANNIBAL} x={-260} y={-620} s={1.45} z={3} look={0.4} expression={{ eyes: "angry", mouth: "shout", brows: -0.7 }} pose={poses.point(frame)} />
        </DayField>
      </Stage>
      <Label text="HANNIBAL" x={0.24} y={0.12} size={0.065} kind="box" at={4} />
    </AbsoluteFill>
  );
};

/** On the walls of Saguntum: stone parapet in front, field below. */
const SaguntumWall: React.FC<{ children?: React.ReactNode; wallTop?: number }> = ({ children, wallTop = -360 }) => (
  <>
    <DayField horizon={-40} mood="warm" />
    {children}
    <StoneWall y={wallTop - 600} w={3400} h={600} color="#b9b0a4" z={10} />
  </>
);

// I3 315.5 "The defenders have a weapon called the falarica."
export const FalaricaWeaponShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0 }} light={{ dir: [-0.6, 0.8] }}>
        <SaguntumWall>
          <Character {...IBERIAN(1)} x={-200} y={-560} s={1.4} z={1} look={0.4} expression={{ eyes: "angry", mouth: "smirk", brows: -0.4 }} pose={{ armF: [0.6, 1.2], armB: [-0.2, -0.1] }} holdF={<Falarica rot={Math.PI / 2 - 1.8} s={0.85} />} />
          <Character {...IBERIAN(0)} x={420} y={-540} s={1.2} z={0.9} facing={-1} look={0.3} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame, 2)} />
        </SaguntumWall>
      </Stage>
      <Label text="FALARICA" x={0.5} y={0.14} size={0.09} kind="title" at={sec(start / 30)(316.95)} />
    </AbsoluteFill>
  );
};

// I4 317.75 "It's not an arrow."
export const NotArrowShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#3a3440" alt="#2e2a34" z={-20} />
        <X s={3.0} x={-230}>
          <Arrow length={150} />
        </X>
        <Cross s={1.6 * pop(t, 318.15)} />
      </Stage>
    </AbsoluteFill>
  );
};

// I5 318.85 "It's a heavy spear with an iron point about a meter long."
export const SpearDiagramShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const f = sec(start / 30);
  const dim = ramp(t, 320.9, 321.3);
  const s = 1.45;
  const x0 = -100;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#3a3440" alt="#2e2a34" z={-20} />
        <Falarica x={x0} y={-60} s={s} z={1} />
        {dim > 0 ? (
          <X y={60} z={2}>
            <InkLine pts={[[x0 + 110 * s, 0], [x0 + 110 * s + (410 * s) * dim, 0]]} width={10} color="#fe5649" outline={5} />
            <InkLine pts={[[x0 + 110 * s, -30], [x0 + 110 * s, 30]]} width={10} color="#fe5649" outline={5} />
            {dim > 0.98 ? <InkLine pts={[[x0 + 520 * s, -30], [x0 + 520 * s, 30]]} width={10} color="#fe5649" outline={5} /> : null}
          </X>
        ) : null}
      </Stage>
      <Label text="HEAVY SPEAR" x={0.22} y={0.3} size={0.06} kind="box" at={f(319.21)} />
      <Label text="IRON POINT" x={0.7} y={0.62} size={0.055} at={f(320.14)} />
      <Label text="~1 METER" x={0.72} y={0.3} size={0.07} color="#fe5649" at={f(321.04)} />
    </AbsoluteFill>
  );
};

// I6 321.8 "They wrap it in fiber and pitch, set it on fire, and throw it."
export const WrapThrowShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lit = ramp(t, 324.0, 324.4);
  const windup = ramp(t, 324.5, 325.0);
  const released = t > 325.15;
  const fly = Math.max(0, t - 325.15);
  const cx = -380;
  const cy = -560;
  const s = 1.3;
  const a = released ? 1.3 : interpolate(windup, [0, 1], [1.5, 2.7]);
  const [hx, hy] = handAt(cx, cy, s, 2.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, x: released ? fly * 300 : 0, shake: hitAt(t, 325.15, 0.4) * 6 }} light={{ dir: [-0.6, 0.8] }}>
        <SaguntumWall>
          <Character
            {...IBERIAN(1)}
            x={cx}
            y={cy}
            s={s}
            z={1}
            look={0.6}
            expression={released ? { eyes: "angry", mouth: "shout", brows: -0.6 } : { eyes: "half", mouth: "smirk", brows: -0.3 }}
            pose={{ armF: [a, released ? -0.1 : 0.3], armB: released ? [1.0, 0.3] : [0.9 - windup * 0.6, 0.5] }}
            holdF={released ? undefined : <Falarica rot={0.25 - a - (released ? 0 : 0.3)} s={0.7} lit={lit} />}
          />
          <Character {...IBERIAN(0)} x={160} y={-540} s={1.15} z={0.9} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={{ armF: [1.4 - lit * 0.2, 0.5], armB: [-0.2, -0.1] }} holdF={<HandTorch rot={-1.9 + lit * 0.2} s={0.8} />} />
          {released ? <Falarica x={hx + fly * 2600} y={hy + 60 + fly * 200 - fly * fly * 300} rot={0.15 - fly * 0.2} s={0.9} lit={1} z={5} /> : null}
        </SaguntumWall>
      </Stage>
    </AbsoluteFill>
  );
};

/** Carthaginian soldier with a big round shield held in front (world-space shield). */
const ShieldBearer: React.FC<{ x: number; y: number; s: number; t: number; shieldOff?: number; burn?: number; stuck?: boolean; scared?: boolean; z?: number }> = ({
  x,
  y,
  s,
  t,
  shieldOff = 0,
  burn = 0,
  stuck = false,
  scared = false,
  z = 1,
}) => {
  const frame = useCurrentFrame();
  const sx = x - 170 * s + shieldOff * 900;
  const sy = y + 190 * s + shieldOff * 700 - shieldOff * shieldOff * 200;
  return (
    <>
      <Character
        {...CARTHAGE(1)}
        x={x}
        y={y}
        s={s}
        z={z}
        facing={-1}
        look={0.5}
        expression={scared ? { eyes: "wide", mouth: "wavy", brows: 1, sweat: true } : burn > 0 ? { eyes: "wide", mouth: "o", brows: 0.8 } : { eyes: "angry", mouth: "flat", brows: -0.4 }}
        pose={scared ? poses.scared(frame) : { armF: [1.3, 0.4], armB: [-0.2, -0.1] }}
      />
      <X x={sx} y={sy} rot={shieldOff * 6} z={z + 0.1}>
        <Shield r={150 * s} color="#a3302a" emblem="#e9ba41" />
        {stuck ? (
          <X rot={0.12} z={0.05}>
            <Falarica x={-520 * 0.8} s={0.8} lit={0.6} />
          </X>
        ) : null}
        {burn > 0 ? (
          <X z={0.1}>
            <Glow rx={300 * burn} color="#ff8a3a" alpha={0.5} additive />
            <Flame size={0.9 * burn} y={-40} seed={4} />
          </X>
        ) : null}
      </X>
    </>
  );
};

// I7 325.85 "Even if it only hits a shield, the shield starts to burn."
export const ShieldBurnShot: React.FC<ShotProps> = ({ start }) => {
  const t = absT(start, useCurrentFrame());
  const hitT = 326.75;
  const fly = ramp(t, 326.15, hitT, (x) => x);
  const hit = hitAt(t, hitT, 0.5);
  const burn = ramp(t, 327.7, 328.4);
  const s = 1.4;
  const x = 380;
  const y = -580;
  const sx = x - 170 * s;
  const sy = y + 190 * s;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hit * 0.05, shake: hit * 14 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-160} mood="warm">
          <ShieldBearer x={x} y={y} s={s} t={t} stuck={t >= hitT} burn={burn} />
          {t < hitT ? <Falarica x={interpolate(fly, [0, 1], [-1500, sx - 520 * 0.8])} y={sy + (1 - fly) * 80} rot={0.12} s={0.8} lit={1} z={5} /> : null}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// I8 329.15 "So the soldier has to throw his shield away, and now he's open to the next spear."
export const OpenToSpearShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const off = ramp(t, 330.3, 331.2, (x) => x);
  const next = ramp(t, 332.6, 334.1, (x) => x);
  const zoom = interpolate(t, [331.8, 332.7], [1.0, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: (zoom - 1) * 800, y: (zoom - 1) * -200 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-160} mood="warm">
          <ShieldBearer x={380} y={-580} s={1.4} t={t} shieldOff={off} burn={1} scared={off > 0.3} />
          {next > 0 ? <Falarica x={-1600 + next * 1300} y={-120} rot={0.05} s={0.8} lit={1} z={5} /> : null}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// I9 334.05 "The Roman historian Livy says it caused terror."
export const LivyShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const write = Math.sin(frame * 0.6) * 0.15;
  const scare = t > 337.0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 20, shake: hitAt(t, 337.11, 0.4) * 8 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.65}>
        <Interior>
          <Character {...LIVY} x={-140} y={-540} s={1.5} z={1} look={scare ? 0.1 : 0.5} expression={scare ? { eyes: "wide", mouth: "o", brows: 1 } : { eyes: "half", mouth: "flat", gaze: [0.5, -0.8] }} pose={scare ? poses.scared(frame) : { armF: [1.0 + write, 0.6], armB: [0.4, 0.8] }} holdF={scare ? undefined : <Quill rot={2.4} s={0.6} />} />
          <WriterDesk x={60} y={-560} s={1.2} z={2} />
        </Interior>
      </Stage>
      <Label text="LIVY" sub="ROMAN HISTORIAN" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start / 30)(335.18)} />
      <Label text="TERROR" x={0.76} y={0.36} size={0.1} kind="stamp" rotate={-10} at={sec(start / 30)(337.11)} />
    </AbsoluteFill>
  );
};

// I10 337.95 "See the pattern?"
export const PatternShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#3a3440" alt="#2e2a34" z={-20} />
        <X x={-520} y={60} s={1.8} rot={0.1} z={1}>
          <Arrow x={-150} fire fireSize={0.4} />
        </X>
        <Falarica x={140} y={-40} s={1.0} rot={0.1} lit={1.3} z={1} />
        <Part shape={roundRect(10, 600, 4)} color="#8a8790" flat outline={0} x={-280} z={0.5} />
      </Stage>
    </AbsoluteFill>
  );
};

// I11 338.95 "Fire works when it's big and heavy."
export const BigHeavyShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#7a2a22" alt="#6a221c" speed={1} z={-20} />
        <Falarica x={-200} y={-60} s={1.5} rot={0.12} lit={1.6} z={1} />
      </Stage>
      <Label text="BIG" x={0.3} y={0.2} size={0.09} kind="box" at={f(340.02)} />
      <Label text="HEAVY" x={0.7} y={0.2} size={0.09} kind="box" at={f(340.4)} />
    </AbsoluteFill>
  );
};

// I12 340.9 "On a little arrow, it's mostly a show."
export const ShowShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -60 }} light={{ dir: [0, 1] }} vignette={0.75} vignetteColor="#05030a">
        <Part shape={roundRect(5000, 3000, 0)} color="#1a1220" flat outline={0} z={-30} />
        <Part shape={roundRect(5000, 500, 0)} color="#5a3a2a" shade={0.2} y={-650} z={-20} />
        {[-1, 1].map((k) => (
          <Part key={k} shape={curtain(k)} color="#a3202a" shade={0.3} z={-10} />
        ))}
        <LightCone y={700} w={700} h={1300} alpha={0.28} z={-5} />
        <X y={-460} rot={Math.PI / 2} s={2.6} z={1}>
          <Arrow x={0} length={150} />
        </X>
        <FlameFace y={-90} size={0.6} mood="happy" z={2} />
      </Stage>
      <Label text="SHOW" x={0.5} y={0.16} size={0.09} kind="box" at={sec(start / 30)(342.86)} />
    </AbsoluteFill>
  );
};

const curtain = (k: number) =>
  poly([
    [k * 980, 700],
    [k * 560, 700],
    [k * 620, 200],
    [k * 700, -700],
    [k * 980, -700],
  ]);

// ───────────────────────── J · The Viking funeral ─────────────────────────

/** Sunset over the sea. */
const SunsetSea: React.FC<{ horizon?: number; sunX?: number; children?: React.ReactNode }> = ({ horizon = -60, sunX = 300, children }) => (
  <>
    <Sky w={5000} h={3000} y={horizon + 1400} top="#3f4a86" mid="#c9708a" bottom="#f3b07a" z={-40} />
    <Sun x={sunX} y={horizon + 60} r={120} color="#ffd98a" glow={0.8} z={-39} />
    <Cloud x={-600} y={horizon + 520} w={480} color="#d98a8a" shadow="#a86a7a" seed={3} z={-38} />
    <Sea w={5000} h={1800} y={horizon} color="#4a6a9a" z={-30} />
    <Glow x={sunX} y={horizon - 200} rx={160} ry={500} color="#ffcf8a" alpha={0.35} additive z={-29} />
    {children}
  </>
);

// J1 343.4 "Which brings us to a scene you've probably seen a hundred times."
export const SceneSeenShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [0, 1] }} vignette={0.65} vignetteColor="#05030a">
        <Theater screenW={1300} screenH={560} screenY={140}>
          <Sky w={1300} h={560} top="#3f4a86" mid="#c9708a" bottom="#f3b07a" />
          <Sun x={260} y={-120} r={60} color="#ffd98a" z={0.1} />
          <Sea w={1300} h={300} y={-130} color="#4a6a9a" z={0.2} />
          <Longship x={-80 + frame * 1.2} y={-180} len={520} burn={1} z={0.5} />
        </Theater>
        <Popcorn x={560} y={-520} s={1.1} z={5} />
      </Stage>
    </AbsoluteFill>
  );
};

// J2 347.05 "The Viking funeral."
export const VikingFuneralTitleShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [0.6, 0.6] }}>
        <SunsetSea>
          <Longship x={-120 + frame * 0.8} y={-180} len={1100} z={1} />
        </SunsetSea>
      </Stage>
      <Label text={"THE VIKING\nFUNERAL"} x={0.5} y={0.18} size={0.09} kind="title" at={4} />
    </AbsoluteFill>
  );
};

/** The dead king lying in state on the deck (head to the right). */
const DeadKing: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} z={z} rot={-Math.PI / 2} s={s}>
    <Character {...VIKING(1)} hat="crown" y={-200} shadow={false} look={0} expression={{ eyes: "closed", mouth: "flat" }} pose={{ armF: [0.3, 1.9], armB: [-0.3, -1.9] }} />
  </X>
);

// J3 348.75 "A dead king lies in his ship on the water."
export const DeadKingShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.35), y: -40 }} light={{ dir: [0.6, 0.6] }}>
        <SunsetSea horizon={120} sunX={-500}>
          <Part shape={roundRect(620, 60, 10)} color="#6e4a2c" shade={0.25} y={-30} z={0.4} />
          <DeadKing y={60} s={0.75} z={0.5} />
          <Longship y={-200} len={1300} sail={false} z={1} />
        </SunsetSea>
      </Stage>
    </AbsoluteFill>
  );
};

// J4 352.0 "An archer shoots a burning arrow, …"
export const VikingArcherShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const draw = ramp(t, 352.2, 352.9);
  const released = t > 353.05;
  const fly = Math.max(0, t - 353.05);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 0 }} light={{ dir: [0.6, 0.6] }}>
        <SunsetSea horizon={-80} sunX={600}>
          <Ground w={2400} h={900} x={-900} y={-300} color="#6a5a3a" pebbles={4} tufts={6} z={-10} />
          <Character
            {...VIKING(0)}
            x={-520}
            y={-560}
            s={1.4}
            z={1}
            look={0.6}
            expression={{ eyes: released ? "half" : "angry", mouth: "flat", brows: -0.4, gaze: [0.9, 0.2] }}
            pose={drawPose(released ? 0 : draw)}
            holdF={<Bow rot={-1.57} draw={released ? 0 : draw} arrow={!released} fire s={1.1} />}
          />
          {released ? <Arrow fire x={-300 + fly * 2400} y={-560 + 205 * 1.4 + fly * 380 - fly * fly * 200} rot={0.15 - fly * 0.2} s={1.3} z={3} /> : null}
        </SunsetSea>
      </Stage>
    </AbsoluteFill>
  );
};

// J5 353.75 "… and the ship bursts into flames as it drifts out to sea."
export const ShipBurstsShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 354.15, 354.8, Easing.out(Easing.cubic));
  const hit = hitAt(t, 354.3, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.9), y: 40, shake: hit * 10 }} light={{ dir: [0.6, 0.6] }}>
        <SunsetSea>
          <FlyingArrow from={[-1200, 0]} via={[-500, 260]} to={[-20, -60]} p={(t - 353.8) / 0.45} fire={1} trail="comet" trailLen={0.15} z={3} />
          <Longship x={frame * 2.4} y={-200} len={1100} burn={burn} z={1} />
        </SunsetSea>
      </Stage>
    </AbsoluteFill>
  );
};

/** Wide sunset with the burning ship far out. */
const FarFuneral: React.FC<{ frame: number }> = ({ frame }) => (
  <SunsetSea horizon={-40} sunX={120}>
    <Longship x={-80 + frame * 0.6} y={-120} len={460} burn={1} z={1} />
    <Glow x={-80 + frame * 0.6} y={-180} rx={120} ry={300} color="#ff9a3c" alpha={0.3} additive z={0.5} />
  </SunsetSea>
);

// J6 356.45 "Beautiful."
export const BeautifulShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 60 }} light={{ dir: [0.6, 0.6] }}>
        <FarFuneral frame={frame} />
      </Stage>
    </AbsoluteFill>
  );
};

// J7 357.3 "And there's no proof it ever happened."
export const NoProofShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const gray = ramp(t, 357.4, 357.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: 60, shake: hitAt(t, 357.45, 0.35) * 8 }} light={{ dir: [0.6, 0.6] }}>
        <FarFuneral frame={Math.min(frame, 4) + 25} />
        <Wash width={4000} height={3000} color="#5a5660" alpha={0.55 * gray} z={50} />
      </Stage>
      <Label text="NO PROOF" x={0.5} y={0.3} size={0.12} kind="stamp" rotate={-8} at={sec(start / 30)(357.93)} />
    </AbsoluteFill>
  );
};

/** Riverbank of the Volga: river band, far bank, tents. */
const Volga: React.FC<{ children?: React.ReactNode; land?: boolean }> = ({ children, land = true }) => (
  <>
    <Sky w={5000} h={3000} y={1300} top="#6a8ac0" bottom="#e8d9c0" z={-40} />
    <Mountains w={5000} y={-20} color="#9aa6b8" peaks={[[-1600, 120], [-800, 180], [0, 110], [800, 170], [1600, 120]]} z={-38} />
    <Ground w={5000} h={200} y={0} color="#7a9a5a" pebbles={0} tufts={10} z={-36} />
    <Sea w={5000} h={260} y={-200} color="#4a7aaa" z={-34} />
    {land ? <Ground w={5000} h={1400} y={-430} color="#9a8a5a" pebbles={14} tufts={14} tuftColor="#6a7a3a" z={-32} /> : null}
    {children}
  </>
);

// J8 359.3 "The best eyewitness we have is an Arab traveler named Ibn Fadlan."
export const IbnFadlanShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const write = Math.sin(frame * 0.6) * 0.12;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.6, 0.8] }}>
        <Volga>
          <Tent x={500} y={-440} w={420} h={300} z={-20} />
          <Character {...IBN_FADLAN} x={-200} y={-640} s={1.5} z={1} look={t > 361.2 ? 0.2 : 0.6} expression={{ eyes: "open", mouth: "smile", brows: 0.2 }} pose={{ armF: [1.0 + write, 0.7], armB: [0.8, 0.6] }} />
          <X x={60} y={-430} rot={0.15} z={2}>
            <Scroll s={1.1} w={170} />
          </X>
        </Volga>
      </Stage>
      <Label text="IBN FADLAN" sub="ARAB TRAVELER" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start / 30)(362.1)} />
    </AbsoluteFill>
  );
};

// J9 363.2 "Around the year 922, he watched the funeral of a Rus chief."
export const Year922Shot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03), y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <Volga>
          <Longship x={240} y={-330} len={900} sail={false} onLand z={-10} />
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...VIKING(i)} x={-120 + i * 170} y={-490 - (i % 2) * 20} s={0.7} z={1 + i * 0.01} facing={i < 3 ? 1 : -1} look={0.3} expression={{ eyes: "sad", mouth: "flat" }} pose={poses.idle(frame, i)} />
          ))}
          <Character {...IBN_FADLAN} x={-720} y={-620} s={1.15} z={2} look={0.6} expression={{ eyes: "open", mouth: "o", brows: 0.6, gaze: [0.9, 0] }} pose={poses.think} />
        </Volga>
      </Stage>
      <Label text="922 AD" x={0.78} y={0.14} size={0.075} kind="box" at={sec(start / 30)(363.97)} />
    </AbsoluteFill>
  );
};

// J10 367.25 "These were Scandinavian traders living on the Volga River."
export const VolgaShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), x: frame * 0.8, y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <Volga>
          <Longship x={-500 + frame * 1.5} y={-250} len={600} z={-33} />
          <Longship x={600 + frame * 1.0} y={-240} len={500} seed={4} z={-33.5} />
          {[-700, 300].map((x, i) => (
            <Tent key={x} x={x} y={-470} w={300} h={220} a="#c9b48e" b="#8a6a4a" z={-20 + i * 0.01} />
          ))}
          <Hide x={-260} y={-420} w={140} h={160} z={-15} />
          <Hide x={-150} y={-430} w={120} h={140} color="#6a4a3a" seed={5} z={-15} />
          {[0, 1].map((i) => (
            <Character key={i} {...VIKING(i)} x={-420 + i * 640} y={-620} s={1.05} z={1 + i * 0.01} facing={i ? -1 : 1} look={0.5} talking expression={{ eyes: "happy", mouth: "smile" }} pose={i ? poses.holdOut : poses.point(frame)} />
          ))}
        </Volga>
      </Stage>
      <Label text="VOLGA RIVER" x={0.5} y={0.12} size={0.065} kind="box" at={sec(start / 30)(369.42)} />
    </AbsoluteFill>
  );
};

// J11 370.3 "And the ship wasn't on the water."
export const NotOnWaterShot: React.FC<ShotProps> = ({ start }) => {
  const t = absT(start, useCurrentFrame());
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 0 }} light={{ dir: [0.6, 0.6] }}>
        <SunsetSea>
          <Longship y={-200} len={1000} z={1} />
        </SunsetSea>
        <Cross y={0} s={2.2 * pop(t, 371.3)} />
      </Stage>
    </AbsoluteFill>
  );
};

// J12 372.25 "They pulled it up onto the land."
export const PulledLandShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pull = ramp(t, 372.4, 374.2, (x) => x);
  const shipX = 380 - pull * 260;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.95, y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Volga>
          <Longship x={shipX} y={-330} len={900} sail={false} onLand z={-10} />
          <InkLine pts={[[shipX - 560, -230], [-600, -330]]} width={8} color="#c9a274" outline={3} z={0} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...VIKING(i)} x={-560 - i * 190} y={-580 - (i % 2) * 20} s={0.95} z={1 + i * 0.01} facing={-1} look={0.3} expression={{ eyes: "squint", mouth: "teeth", brows: -0.5 }} pose={{ armF: [1.5, 0.2], armB: [1.4, 0.3], lean: 0.25 + Math.sin(frame * 0.4 + i) * 0.04 }} />
          ))}
        </Volga>
      </Stage>
    </AbsoluteFill>
  );
};

// J13 374.3 "And nobody shot an arrow."
export const NobodyShotShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -60 }} light={{ dir: [-0.6, 0.8] }}>
        <Volga>
          <Character {...VIKING(0)} x={-160} y={-620} s={1.4} z={1} look={0.2} expression={{ eyes: "half", mouth: "flat", brows: 0.4 }} pose={poses.shrug(ramp(t, 374.5, 374.8))} holdF={<Bow rot={0.2} />} />
          <X x={300} y={-80} rot={0.2} s={2.0} z={2}>
            <Arrow x={-75} length={150} fire />
          </X>
          <Cross x={300} y={-80} s={1.1 * pop(t, 375.0)} />
        </Volga>
      </Stage>
    </AbsoluteFill>
  );
};

/** The dead man's relative — no clothes, one censor bar. */
const RELATIVE = {
  ...VIKING(2),
  hat: null,
  hair: "long" as const,
  hairColor: "#c9732a",
  outfit: { top: "#f6f5f8", bottom: "#f6f5f8", boots: "#f6f5f8", belt: null },
};
const Relative: React.FC<{ x: number; y: number; s: number; facing: 1 | -1; frame: number; z?: number; torch?: boolean; walk?: boolean }> = ({ x, y, s, facing, frame, z = 1, torch = false, walk = true }) => (
  <>
    <Character
      {...RELATIVE}
      x={x}
      y={y}
      s={s}
      z={z}
      facing={facing}
      look={0.5}
      expression={{ eyes: "half", mouth: "flat", brows: -0.2 }}
      pose={walk ? { ...poses.walk(frame, 0.8), ...(torch ? { armF: [1.5, 0.5] as [number, number] } : {}) } : { armF: [1.5, 0.5], armB: [-0.2, -0.1] }}
      holdF={torch ? <HandTorch rot={-2.0} s={0.8} /> : undefined}
    />
    <Part shape={roundRect(170, 70, 6)} color="#111014" flat outline={0} x={x} y={y + 95 * s} s={s} z={z + 0.5} />
  </>
);

// J14 376.0 "The dead man's closest relative walked up to the ship naked."
export const NakedRelativeShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const x = -700 + (t - 376.0) * 120;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <Volga>
          <Longship x={520} y={-330} len={900} sail={false} onLand z={-10} />
          <Relative x={x} y={-600} s={1.1} facing={1} frame={frame} />
        </Volga>
      </Stage>
      <Label text="CENSORED" x={0.5} y={0.14} size={0.06} kind="stamp" rotate={-4} at={sec(start / 30)(378.86)} />
    </AbsoluteFill>
  );
};

// J15 379.5 "Backwards."
export const BackwardsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const x = -280 + (t - 379.5) * 120;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, y: -80, shake: hitAt(t, 379.6, 0.3) * 6 }} light={{ dir: [-0.6, 0.8] }}>
        <Volga>
          <Longship x={520} y={-330} len={900} sail={false} onLand z={-10} />
          <Relative x={x} y={-600} s={1.1} facing={-1} frame={-frame} />
        </Volga>
      </Stage>
      <Label text="◀◀ BACKWARDS" x={0.5} y={0.16} size={0.075} kind="box" at={sec(start / 30)(379.69)} />
    </AbsoluteFill>
  );
};

// J16 380.6 "Holding a burning piece of wood."
export const BurningWoodShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.7}>
        <SunsetSea horizon={-300} sunX={-600} />
        <Character {...RELATIVE} x={-120} y={-820} s={2.4} z={1} facing={-1} look={0.3} expression={{ eyes: "half", mouth: "flat", brows: -0.3 }} pose={{ armF: [1.3, 0.6], armB: [-0.2, -0.1] }} holdF={<HandTorch rot={-1.9} s={0.9} />} />
      </Stage>
    </AbsoluteFill>
  );
};

// J17 382.5 "Then he set the ship on fire himself."
export const SetFireHimselfShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 383.4, 384.4, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.92), y: 0 }} light={{ dir: [-0.6, 0.8] }} shadowMul={[0.6, 0.55, 0.62]}>
        <Volga>
          <Glow x={300} y={-200} rx={1100} ry={600} color="#ff7a2a" alpha={0.3 * burn} additive z={-25} />
          <Longship x={300} y={-330} len={1000} sail={false} onLand burn={burn} z={-10} />
          <Relative x={-380} y={-600} s={1.0} facing={-1} frame={frame} torch walk={false} />
        </Volga>
      </Stage>
    </AbsoluteFill>
  );
};

export { CARTHAGE };
