import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Glow, Line, Arrow, Bow, RagBall, FlyingArrow, QuestionMark, Letterbox, InkLine, FlameFace, Quiver, Palisade,
  RomanFireHead, Crosshair, Shield, roundRect, circle, ellipse, blob, poly, ramp, push, hitAt, absT, type ShotProps,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  CoalPot, Car, Road, SpeedLines, Candle, Smoke, FireLine, Kindling, Log, Rain, Cloud, Clock, StrawHut, HayStack, Tent, Trireme,
  Sea, Town, CastleFar, Battlement, Sunburst, Ground, Sky, Flame, Match,
} from "../../kit/env";
import { NightSky, DayField } from "./sets";
import { ARCHER, ENEMY, ROMAN, AMMIANUS } from "./cast";
import { drawPose } from "./actA";

/** Problem title card: sunburst + flame character + big title. */
const ProblemCard: React.FC<ShotProps & { n: string; title: string; mood: "sad" | "angry" | "scared" | "happy"; wind?: number }> = ({ dur, n, title, mood, wind = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#6a2a22" alt="#561f1c" z={-20} />
        <FlameFace mood={mood} size={1.9} y={-380} x={-520} wind={wind} />
      </Stage>
      <Label text={title} sub={n} x={0.6} y={0.42} size={0.1} kind="title" at={4} />
    </AbsoluteFill>
  );
};

// D1 59.15 "Problem number one. The fire hates flying."
export const P1TitleShot: React.FC<ShotProps> = (p) => <ProblemCard {...p} n="PROBLEM #1" title={"THE FIRE\nHATES FLYING"} mood="sad" wind={0.4} />;

// D2 62.55 "A war arrow leaves the bow faster than a car on a highway."
export const CarRaceShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ax = interpolate(t, [63.3, 65.6], [-1400, 1400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.9, y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-120} />
        <Road y={-420} w={5000} h={260} speed={45} z={1} />
        <Car x={-120} y={-430} s={1.1} speed={2} z={2} />
        <SpeedLines y={-200} h={600} speed={70} z={3} />
        <X x={ax} y={60} z={4}>
          <Arrow s={2.2} x={-150} />
        </X>
      </Stage>
      <Label text="~200 KM/H" x={0.5} y={0.12} size={0.06} kind="box" at={45} />
    </AbsoluteFill>
  );
};

// D3 66.05 "Now imagine holding a candle out of a car window at that speed."
export const CandleWindowShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wind = 0.3 + ramp(t, 67.5, 68.5) * 0.7;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.5, x: 120, y: -200 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-260} />
        <Road y={-560} w={5000} h={260} speed={60} z={1} />
        <Car x={-60} y={-560} s={1.1} speed={3} z={2} />
        <X x={60} y={-560 + 210 * 1.1} z={3}>
          <InkLine pts={[[0, 0], [120, 40], [190, 70]]} width={30} color="#2f5f9a" outline={6} smooth />
          <Part shape={circle(22)} color="#f6f5f8" shade={0.2} x={196} y={74} z={0.01} />
          <Candle x={196} y={64} s={0.55} wind={wind} z={0.02} />
        </X>
        <SpeedLines y={-200} h={700} speed={80} z={4} />
      </Stage>
    </AbsoluteFill>
  );
};

// D4 69.85 "That's your fire arrow."
export const BentFlameShot: React.FC<ShotProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [0, 1] }} vignette={0.7} vignetteColor="#04050f">
        <NightSky horizon={-500} />
        <SpeedLines h={900} speed={90} color="#9fb4ff" z={1} />
        <X y={Math.sin(frame * 0.2) * 10} z={2}>
          <Arrow s={3.0} x={-180} fire fireSize={1.0} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// D5 71.45 "The wind blows it out."
export const BlowOutShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const out = ramp(t, 72.1, 72.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.2 }} light={{ dir: [0, 1] }} vignette={0.7} vignetteColor="#04050f">
        <NightSky horizon={-500} />
        <SpeedLines h={900} speed={90} color="#9fb4ff" z={1} />
        <X z={2}>
          <Arrow s={3.0} x={-180} fire={out < 0.95} fireSize={Math.max(0.05, 1 - out)} />
        </X>
        {out > 0.3 ? <Smoke x={240} y={10} w={80} h={420} alpha={0.6} puffs={6} seed={2} z={3} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};

// D6 73.25 "The Romans knew this."
export const RomansKnewShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-140} mood="warm">
          {[-420, 0, 420].map((x, i) => (
            <Character key={x} {...ROMAN} seed={20 + i} x={x} y={-520 - (i === 1 ? 20 : 0)} s={1.25} z={1 + i * 0.01} facing={i === 2 ? -1 : 1} look={0.3} expression={{ eyes: "half", mouth: "smirk", brows: -0.2 }} pose={{ ...poses.handsOnHips, headTilt: Math.max(0, Math.sin(frame * 0.35 + i)) * 0.07 }} />
          ))}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

/** Writer's table with scroll, quill pot and candle. Origin = floor center. */
const WriterDesk: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={roundRect(520, 30, 8)} color="#8a5a32" shade={0.2} y={230} />
    {[-220, 220].map((lx) => (
      <Part key={lx} shape={roundRect(26, 230, 6)} color="#6e4a2c" shade={0.25} x={lx} y={115} />
    ))}
    <Part shape={roundRect(260, 16, 6)} color="#efe4c8" shade={0.15} y={252} x={-40} z={0.01} />
    <Candle x={180} y={245} s={0.5} z={0.02} />
  </X>
);

const Interior: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <X z={-30}>
      <Part shape={roundRect(5000, 3000, 0)} color="#5a4436" flat outline={0} />
    </X>
    <Glow x={300} y={0} rx={900} color="#ffcf7a" alpha={0.25} additive z={-29} />
    <X y={-540} z={-28}>
      <Part shape={roundRect(5000, 500, 0)} color="#3e2e26" flat outline={0} />
    </X>
    {children}
  </>
);

// D7 74.65 "Ammianus Marcellinus was a Roman soldier who wrote a history of his own time, about 1,600 years ago."
export const AmmianusShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const write = Math.sin(frame * 0.6) * 0.15;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 20 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.65}>
        <Interior>
          <Character {...AMMIANUS} x={-140} y={-540} s={1.5} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", gaze: [0.5, -0.8] }} pose={{ armF: [1.0 + write, 0.6], armB: [0.4, 0.8] }} />
          <WriterDesk x={60} y={-560} s={1.2} z={2} />
        </Interior>
      </Stage>
      <Label text="AMMIANUS MARCELLINUS" sub="ROMAN SOLDIER & HISTORIAN" x={0.5} y={0.12} size={0.06} kind="box" at={8} />
      <Label text="~1,600 YEARS AGO" x={0.8} y={0.42} size={0.055} kind="tag" color="#fe5649" at={Math.round((79.85 - 74.65) * 30)} />
    </AbsoluteFill>
  );
};

// D8 81.6 "He describes a Roman fire arrow."
export const DescribeShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 20 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.65}>
        <Interior>
          <Character {...AMMIANUS} x={-380} y={-560} s={1.6} z={1} look={0.5} talking expression={{ eyes: "open", mouth: "flat", brows: 0.2 }} pose={poses.holdOut} />
          <RomanFireHead x={260} y={40} s={0.9} rot={0.2} lit={0.6} z={2} />
        </Interior>
      </Stage>
    </AbsoluteFill>
  );
};

// D9 83.85 "Its iron head is hollow, full of holes, and packed with burning fuel."
export const HeadDiagramShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fuel = ramp(t, 86.6, 87.2);
  const lit = ramp(t, 87.2, 87.6);
  const f = (s: number) => Math.round((s - 83.85) * 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.5, x: 40 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#3a3440" alt="#2e2a34" z={-20} />
        <RomanFireHead fuel={fuel} lit={lit} s={1.0} z={1} />
      </Stage>
      <Label text="HOLLOW" x={0.32} y={0.2} size={0.06} at={f(84.8)} />
      <Label text="HOLES" x={0.55} y={0.2} size={0.06} at={f(85.84)} />
      <Label text="FUEL" x={0.76} y={0.2} size={0.06} color="#fe5649" at={f(86.68)} />
    </AbsoluteFill>
  );
};

// D10 88.25 "And he gives one rule."
export const OneRuleShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: 140 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.65}>
        <Interior>
          <Character {...AMMIANUS} x={0} y={-720} s={2.2} z={1} look={0.25} expression={{ eyes: "angry", mouth: "flat", brows: -0.4 }} pose={{ armF: [2.55, 0.4], armB: [-0.2, -0.1], armsOverHead: true }} />
        </Interior>
      </Stage>
      <Label text="ONE RULE" x={0.78} y={0.25} size={0.07} kind="box" at={6} />
    </AbsoluteFill>
  );
};

/** Roman archer shooting: `power` 0..1 (bow draw), flight from the bow. */
const RomanShoot: React.FC<{ t: number; power: number; release: number; outAt?: number; frame: number }> = ({ t, power, release, outAt, frame }) => {
  const drawn = t < release ? ramp(t, release - 1.4, release - 0.4) * power : 0;
  const p = ramp(t, release, release + (power > 0.7 ? 0.9 : 2.0), (x) => x);
  const out = outAt ? ramp(t, outAt - 0.2, outAt + 0.2) : 0;
  return (
    <>
      <Character {...ROMAN} x={-700} y={-430} s={1.0} z={1} look={0.6} expression={{ eyes: power > 0.7 ? "angry" : "half", mouth: power > 0.7 ? "teeth" : "smirk" }} pose={drawPose(drawn)} holdF={<Bow rot={-1.57} draw={drawn} arrow={t < release} fire s={1.1} />} />
      <FlyingArrow
        from={[-500, -230]}
        via={power > 0.7 ? [200, 100] : [-150, 120]}
        to={power > 0.7 ? [1100, -150] : [150, -400]}
        p={p}
        fire={1 - out}
        trail={out > 0.5 ? "smoke" : "comet"}
        trailLen={0.15}
        s={1.0}
        z={2}
      />
      {outAt && out > 0.4 && out < 1 ? <Smoke x={300} y={30} w={60} h={300} alpha={0.5} puffs={5} seed={frame % 3} z={3} /> : null}
    </>
  );
};

// D11 89.7 "You have to shoot it slowly, from a loose bow."
export const SlowShotShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.95, y: 30 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-160} mood="warm">
          <RomanShoot t={t} power={0.35} release={91.0} frame={frame} />
        </DayField>
      </Stage>
      <Label text="SLOW + LOOSE" x={0.5} y={0.12} size={0.065} kind="box" at={Math.round((90.6 - 89.7) * 30)} />
    </AbsoluteFill>
  );
};

// D12 92.65 "Shoot it hard, and the fire goes out."
export const HardShotShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.95, y: 30, shake: hitAt(t, 93.2, 0.3) * 6 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-160} mood="warm">
          <RomanShoot t={t} power={1} release={93.15} outAt={94.4} frame={frame} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// D13 95.45 "Think about what that means."
export const ThinkShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: 80 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-200}>
          <Character {...ARCHER} x={0} y={-640} s={2.0} z={1} look={0.3} expression={{ eyes: "half", mouth: "flat", brows: 0.4, gaze: [0.5, 0.6] }} pose={poses.think} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

/** Two archers facing off with range arcs. */
const RangeDuel: React.FC<{ t: number; frame: number; youX?: number; showYours?: number; showTheirs?: number; danger?: number }> = ({
  t,
  frame,
  youX = -760,
  showYours = 1,
  showTheirs = 1,
  danger = 0,
}) => {
  const cycle = (k: number) => ((t * 0.7 + k) % 1.0);
  return (
    <>
      <Character {...ARCHER} x={youX} y={-430} s={0.85} z={1} look={0.6} expression={danger > 0.5 ? { eyes: "wide", mouth: "wavy", sweat: true, brows: 0.8 } : { eyes: "angry", mouth: "flat" }} pose={youX > -700 ? poses.walk(frame, 1.0) : drawPose(0.6)} holdF={<Bow rot={youX > -700 ? -0.3 : -1.57} draw={0.6} />} />
      <Character {...ENEMY(1)} x={760} y={-430} s={0.85} z={1} facing={-1} look={0.6} expression={{ eyes: "half", mouth: "smirk" }} pose={drawPose(0.8)} holdF={<Bow rot={-1.57} draw={0.8} />} />
      {showTheirs > 0
        ? [0, 0.33, 0.66].map((k, i) => <FlyingArrow key={`e${i}`} from={[620, -240]} via={[0, 360]} to={[-1000, -380]} p={cycle(k)} s={0.8} z={2 + i * 0.01} />)
        : null}
      {showYours > 0
        ? [0, 0.5].map((k, i) => <FlyingArrow key={`y${i}`} from={[youX + 180, -240]} via={[youX + 420, 80]} to={[youX + 700, -420]} p={cycle(k + 0.2)} fire={1} trail="comet" trailLen={0.15} s={0.8} z={3 + i * 0.01} />)
        : null}
    </>
  );
};

// D14 96.9 "Your enemy's normal arrows fly fast and far. Yours have to fly slow and short."
export const RangeShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.9, y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-150}>
          <RangeDuel t={t} frame={frame} showYours={t > 99.6 ? 1 : 0} />
        </DayField>
      </Stage>
      <Label text="FAST & FAR" x={0.66} y={0.14} size={0.06} kind="box" at={Math.round((97.8 - 96.9) * 30)} />
      <Label text="SLOW & SHORT" x={0.26} y={0.24} size={0.06} kind="box" color="#fe5649" at={Math.round((100.4 - 96.9) * 30)} />
    </AbsoluteFill>
  );
};

// D15 101.8 "So to hit him with fire, you have to walk closer, right into the range of his arrows."
export const WalkCloserShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const youX = interpolate(t, [102.6, 105.8], [-760, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const danger = ramp(t, 104.8, 105.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.9, y: 40, x: youX * 0.2 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-150}>
          <Glow x={-300} y={-300} rx={700} ry={260} color="#fe5649" alpha={0.25 * danger} z={0.5} />
          <RangeDuel t={t} frame={frame} youX={youX} showYours={0} danger={danger} />
        </DayField>
      </Stage>
      <Label text="DANGER ZONE" x={0.36} y={0.16} size={0.06} kind="stamp" rotate={-6} at={Math.round((105.3 - 101.8) * 30)} />
    </AbsoluteFill>
  );
};

// D16 106.6 "And all that fuel makes the front of your arrow heavy, so it doesn't fly straight either."
export const WobbleShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const p = ramp(t, 108.4, 110.9, (x) => x);
  const x = -900 + p * 1700;
  const y = 120 + Math.sin(p * Math.PI) * 120 - p * p * 420;
  const wob = Math.sin(p * 22) * 0.45 * p - p * 0.9;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 0 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-260} />
        <X x={p > 0 ? x : -300} y={p > 0 ? y : 60} rot={p > 0 ? wob : 0} z={2}>
          <Arrow s={2.0} x={-150} />
          <RomanFireHead x={0} s={0.42} lit={0.5} z={0.01} />
        </X>
      </Stage>
      <Label text="HEAVY" x={0.5} y={0.16} size={0.065} color="#fe5649" at={Math.round((108.6 - 106.6) * 30)} />
    </AbsoluteFill>
  );
};

// E1 111.4 "Problem number two. Lighting the thing."
export const P2TitleShot: React.FC<ShotProps> = (p) => <ProblemCard {...p} n="PROBLEM #2" title={"LIGHTING\nTHE THING"} mood="scared" />;

// E2 113.95 "You need a fire right next to you."
export const FireNextToYouShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: 0 }} light={{ pos: [200, -400] }} shadowMul={[0.62, 0.56, 0.64]}>
        <DayField horizon={-200} mood="warm">
          <Character {...ARCHER} x={-160} y={-560} s={1.6} z={1} look={0.5} expression={{ eyes: "open", mouth: "wavy", gaze: [0.6, 0.6], sweat: true }} pose={poses.idle(frame)} holdF={<Bow rot={-0.3} />} />
          <CoalPot x={260} y={-560} s={1.2} z={2} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// E3 115.75 "In a line of thousands of archers, that means pots of burning coals every few steps."
export const ArcherLineShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const camX = interpolate(frame, [0, dur], [-200, 600]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.8, x: camX, y: 60 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-120} mood="warm">
          {Array.from({ length: 12 }, (_, i) => (
            <React.Fragment key={i}>
              <Character {...ARCHER} seed={i + 3} freckles={i % 3 === 0} x={-1100 + i * 230} y={-480 + (i % 2) * 20} s={0.85} z={1 + i * 0.01} look={0.5} expression={{ eyes: i % 4 ? "half" : "open", mouth: "flat" }} pose={poses.idle(frame, i)} holdF={<Bow rot={-0.3} />} />
              {i % 2 ? <CoalPot x={-1100 + i * 230 + 115} y={-500} s={0.7} seed={i} z={1.5 + i * 0.01} /> : null}
            </React.Fragment>
          ))}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

/** Embers drifting with the wind. */
const Embers: React.FC<{ x0: number; y0: number; n?: number; wind?: number }> = ({ x0, y0, n = 16, wind = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const t = ((frame * 1.5 + i * 23) % 90) / 90;
        return <Part key={i} shape={circle(6 + (i % 3) * 2)} color={i % 2 ? "#ffd06a" : "#ff7a2a"} flat outline={0} opacity={1 - t} x={x0 + t * 600 * wind + Math.sin(i + frame * 0.2) * 20} y={y0 + t * 200 + Math.sin(i * 1.7 + t * 6) * 40} z={5 + i * 0.001} />;
      })}
    </>
  );
};

// E4 120.55 "Next to wooden bows, bags of arrows, and men dressed in wool and linen."
export const FlammablesShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const f = (s: number) => Math.round((s - 120.55) * 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0 }} light={{ pos: [-400, -300] }} shadowMul={[0.62, 0.56, 0.64]}>
        <DayField horizon={-200} mood="warm">
          <CoalPot x={-560} y={-520} s={1.1} z={1} />
          <Embers x0={-560} y0={-380} wind={1.2} />
          <Bow x={-120} y={-200} rot={-1.2} s={1.6} z={2} />
          <Quiver x={180} y={-560} s={1.3} z={2} />
          <Character {...ARCHER} x={560} y={-560} s={1.3} z={2} facing={-1} look={0.4} expression={{ eyes: "open", mouth: "flat", gaze: [0.6, 0.2] }} pose={poses.idle(frame)} />
        </DayField>
      </Stage>
      <Label text="WOOD" x={0.42} y={0.18} size={0.055} at={f(120.95)} />
      <Label text="ARROWS" x={0.58} y={0.24} size={0.055} at={f(121.76)} />
      <Label text="WOOL & LINEN" x={0.78} y={0.18} size={0.055} at={f(123.15)} />
    </AbsoluteFill>
  );
};

// E5 124.65 "In the wind."
export const WindShot: React.FC<ShotProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -60 }} light={{ pos: [-400, -300] }} shadowMul={[0.62, 0.56, 0.64]}>
        <DayField horizon={-200} mood="warm">
          <CoalPot x={-500} y={-520} s={1.2} z={1} />
          <Embers x0={-500} y0={-370} n={24} wind={2} />
          <SpeedLines y={-100} h={700} speed={50} color="#ffffff" z={6} />
          <Character {...ARCHER} x={420} y={-560} s={1.4} z={2} facing={-1} look={0.4} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.idle(frame)} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// E6 125.6 "Sounds safe, right?"
export const SafeRightShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.25), y: 60 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-200} mood="warm">
          <Character {...ARCHER} x={0} y={-660} s={2.0} z={1} look={0.15} expression={{ eyes: "happy", mouth: "teeth", sweat: true }} pose={{ armF: [0.5, 1.4], armB: [-0.3, -0.2] }} />
          <FireLine x={-150} y={-660 + 160 * 2} w={80} intensity={0.5} seed={2} z={2} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// E7 127.3 "And it's slow."
export const SlowShot: React.FC<ShotProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-200} mood="warm">
          <Character {...ARCHER} x={-300} y={-600} s={1.6} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", gaze: [0.7, 0.5] }} pose={poses.think} />
          <Clock x={420} y={100} r={170} speed={3} z={2} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// E8 128.75 "A good archer can shoot around ten arrows a minute."
export const TenPerMinuteShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cyc = (t * 1.6) % 1;
  const drawn = cyc < 0.7 ? cyc / 0.7 : 0;
  const shot = Math.floor(t * 1.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.95, y: 30 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-160}>
          <Character {...ARCHER} x={-650} y={-430} s={1.05} z={1} look={0.6} expression={{ eyes: "angry", mouth: "flat" }} pose={drawPose(drawn)} holdF={<Bow rot={-1.57} draw={drawn} arrow={cyc < 0.7} s={1.1} />} />
          {[0, 1, 2].map((k) => {
            const p = ((t * 1.6 - (shot - k)) - 0.7) / 0.9;
            return p > 0 && p < 1.1 ? <FlyingArrow key={shot - k} from={[-470, -220]} via={[100, 200]} to={[1100, -260]} p={p} s={0.9} z={2 + k * 0.01} /> : null;
          })}
        </DayField>
      </Stage>
      <Label text="10 / MIN" x={0.68} y={0.18} size={0.09} kind="box" at={Math.round((130.24 - 128.75) * 30)} />
    </AbsoluteFill>
  );
};

// E9 131.55 "Now add this." + E10 132.9 "Dip the arrow. Wait for it to catch."
export const DipWaitShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dip = ramp(t, 133.0, 133.6);
  const lift = ramp(t, 134.5, 135.0);
  const lit = ramp(t, 134.55, 134.85);
  const f = (s: number) => Math.round((s - 131.55) * 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.2, y: -100 }} light={{ pos: [0, -300] }} shadowMul={[0.6, 0.55, 0.62]}>
        <DayField horizon={-260} mood="warm">
          <CoalPot y={-520} s={1.6} z={1} />
          <X x={interpolate(dip, [0, 1], [500, 80])} y={interpolate(dip - lift, [0, 1], [60, -300])} rot={-0.7 + lift * 0.4} z={2}>
            <Arrow s={2.0} x={-160} />
            <RagBall x={-160 * 2 + 150 * 2 - 6} s={1.1} lit={lit} />
          </X>
          <Clock x={-560} y={60} r={110} speed={4} z={2} />
        </DayField>
      </Stage>
      <Label text="1. DIP" x={0.36} y={0.1} size={0.055} kind="box" at={f(133.0)} />
      <Label text="2. WAIT…" x={0.62} y={0.1} size={0.055} kind="box" at={f(134.06)} />
    </AbsoluteFill>
  );
};

// E11 135.25 "Then pull back the string with a flame a few centimeters from your hand."
export const HandFlameShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const draw = ramp(t, 135.4, 136.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, x: 140, y: 40 }} light={{ pos: [400, 100] }} shadowMul={[0.55, 0.5, 0.62]}>
        <DayField horizon={-400} mood="warm">
          <Character {...ARCHER} x={-220} y={-820} s={2.4} z={1} look={0.55} expression={{ eyes: "wide", mouth: "teeth", brows: 0.6, sweat: true, gaze: [0.9, 0] }} pose={drawPose(draw)} holdF={<Bow rot={-1.57} draw={draw} arrow fire s={1.15} />} shadow={false} />
        </DayField>
      </Stage>
      <Label text="FEW CM!" x={0.72} y={0.2} size={0.07} kind="stamp" rotate={-8} at={Math.round((137.17 - 135.25) * 30)} />
    </AbsoluteFill>
  );
};

// E12 138.65 "Every fire arrow you shoot is two or three normal arrows you didn't."
export const TradeoffShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pop = (s: number) => ramp(t, s, s + 0.25, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }}>
        <Sunburst r={2600} rays={22} color="#3a4a6a" alt="#33415e" z={-20} />
        <X x={-560} y={0} s={pop(138.8) * 2.2} rot={0.4} z={1}>
          <Arrow x={-75} fire fireSize={1} />
        </X>
        {[0, 1, 2].map((k) => (
          <X key={k} x={300 + k * 200} y={-80 + k * 80} s={pop(140.4 + k * 0.25) * 2.2} rot={0.4} z={2 + k * 0.01}>
            <Arrow x={-75} />
          </X>
        ))}
      </Stage>
      <Label text="1" x={0.21} y={0.75} size={0.1} at={Math.round((139.0 - 138.65) * 30)} color="#fe5649" />
      <Label text="=" x={0.43} y={0.48} size={0.12} at={Math.round((140.16 - 138.65) * 30)} />
      <Label text="2-3" x={0.72} y={0.78} size={0.1} at={Math.round((140.8 - 138.65) * 30)} />
    </AbsoluteFill>
  );
};

// E13 142.6 "And if it rains? Forget it."
export const RainShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const out = ramp(t, 143.4, 143.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: 40 }} light={{ dir: [-0.4, 0.8] }} shadowMul={[0.62, 0.6, 0.7]}>
        <X z={-40}>
          <Sky w={5000} h={3000} y={1200} top="#4a5464" bottom="#8a96a6" />
        </X>
        <Ground w={5000} h={1600} y={-200} color="#5a6a4a" pebbles={8} tufts={10} tuftColor="#3a4a2a" z={-30} />
        <Cloud x={0} y={430} w={1400} color="#7a8494" shadow="#5a6474" drift={0} z={-10} />
        <Character {...ARCHER} x={-260} y={-560} s={1.5} z={1} look={0.3} expression={{ eyes: "half", mouth: "flat", brows: 0.4 }} pose={poses.idle(frame)} holdF={<X rot={-0.3}><Arrow x={-150} fire={out < 0.9} fireSize={1 - out} /></X>} />
        <CoalPot x={300} y={-560} s={1.0} glow={1 - out} z={2} />
        {out > 0.3 ? <Smoke x={300} y={-460} w={80} h={400} color="#d8dde6" alpha={0.5} puffs={6} z={3} /> : null}
        <Rain w={2600} h={1500} n={120} z={6} />
      </Stage>
    </AbsoluteFill>
  );
};

// F1 144.55 "Problem number three, and this is the big one. What are you shooting at?"
export const P3TitleShot: React.FC<ShotProps> = (p) => <ProblemCard {...p} n="PROBLEM #3" title={"WHAT ARE YOU\nSHOOTING AT?"} mood="angry" />;

// F2 148.9 "People don't catch fire like in the movies."
export const MovieBurnShot: React.FC<ShotProps> = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 40 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <NightSky horizon={-260} />
        <Ground w={5000} h={1600} y={-260} color="#2a3a24" pebbles={0} tufts={10} z={-30} />
        <Character {...ENEMY(0)} x={interpolate(frame, [0, 80], [-400, 400])} y={-560} s={1.4} z={1} look={0.6} expression={{ eyes: "wide", mouth: "shout", brows: 0.9 }} pose={poses.run(frame)} />
        <FireLine x={interpolate(frame, [0, 80], [-400, 400])} y={-560 + 200 * 1.4} w={260} intensity={1.2} seed={3} z={2} />
        <Letterbox width={width} height={height} />
      </Stage>
      <Label text="MOVIES" x={0.12} y={0.2} size={0.05} kind="box" at={0} />
    </AbsoluteFill>
  );
};

// F3 151.35 "A burning rag hits a soldier, and most of the time, it falls off or goes out."
export const RagFallsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fly = ramp(t, 151.6, 152.25, (x) => x);
  const hit = t > 152.25;
  const fall = ramp(t, 154.7, 155.6, Easing.in(Easing.quad));
  const out = ramp(t, 155.6, 156.1);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 20 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-200}>
          <Character {...ENEMY(2)} x={260} y={-560} s={1.5} z={1} facing={-1} look={0.6} expression={hit ? { eyes: fall > 0.5 ? "half" : "wide", mouth: fall > 0.5 ? "smirk" : "o" } : { eyes: "open", mouth: "flat" }} pose={fall > 0.5 ? poses.shrug(1) : poses.idle(frame)} holdF={<Shield rot={-0.2} r={80} />} />
          {!hit ? <FlyingArrow from={[-900, -100]} via={[-300, 120]} to={[150, -60]} p={fly} fire={1} trail="comet" s={1.2} z={2} /> : null}
          {hit ? (
            <X x={150 - fall * 80} y={-60 - fall * 480} rot={-0.5 - fall * 1.2} z={2}>
              <Arrow s={1.2} x={-150} />
              <RagBall x={0} s={1.0} lit={1 - out} />
            </X>
          ) : null}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// F4 156.65 "And the rag makes your point worse."
export const RagPointShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.6, 1.8), x: 260 }} light={{ dir: [-0.6, 0.8] }}>
        <Sunburst r={2600} rays={20} color="#3a3440" alt="#2e2a34" z={-20} />
        <Arrow s={3} x={-150} />
        <RagBall x={-150 * 3 + 150 * 3 - 10} s={2.2} lit={1} z={1} />
      </Stage>
    </AbsoluteFill>
  );
};

// F5 158.8 "A sharp steel point goes through cloth and skin. A ball of burning rag doesn't."
export const PointVsRagShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const a1 = ramp(t, 159.4, 159.9, (x) => x);
  const a2 = ramp(t, 162.1, 162.6, (x) => x);
  const bounce = ramp(t, 162.6, 163.3, Easing.out(Easing.quad));
  const Target: React.FC<{ x: number }> = ({ x }) => (
    <X x={x} y={-80}>
      <Part shape={roundRect(70, 420, 10)} color="#efe2c4" shade={0.2} />
      <Part shape={roundRect(70, 140, 10)} color="#c96a4a" flat outline={4} y={60} z={0.001} />
    </X>
  );
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }}>
        <Sunburst r={2600} rays={20} color="#3a4a3a" alt="#334234" z={-20} />
        <Target x={-160} />
        <Target x={760} />
        <X x={-700 + a1 * 560} y={-20} z={1}>
          <Arrow s={2.0} x={-150} />
        </X>
        <X x={200 + a2 * 480 - bounce * 260} y={-40 + Math.sin(bounce * Math.PI) * 120} rot={bounce * 0.8} z={1}>
          <Arrow s={2.0} x={-150} />
          <RagBall x={0} s={1.4} lit={1} />
        </X>
      </Stage>
      <Label text="✔ STEEL" x={0.23} y={0.16} size={0.06} kind="box" at={Math.round((159.36 - 158.8) * 30)} />
      <Label text="✘ RAG" x={0.72} y={0.16} size={0.06} kind="box" color="#fe5649" at={Math.round((161.88 - 158.8) * 30)} />
    </AbsoluteFill>
  );
};

// F6 163.7 "So against people, a fire arrow is a worse arrow."
export const WorseArrowShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-200}>
          <Character {...ARCHER} x={-160} y={-640} s={1.9} z={1} look={0.4} expression={{ eyes: "half", mouth: "frown", brows: 0.5, gaze: [0.6, 0.2] }} pose={poses.holdOut} holdF={<X rot={-1.1}><Arrow x={-150} fire fireSize={0.8} /></X>} />
        </DayField>
      </Stage>
      <Label text="WORSE ARROW" x={0.75} y={0.2} size={0.07} kind="stamp" rotate={-7} at={Math.round((166.26 - 163.7) * 30)} />
    </AbsoluteFill>
  );
};

// F7 167.6 "OK, so what about wooden walls?"
export const WoodenWallsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-160}>
          <Palisade x={300} y={-460} w={1100} h={460} z={1} />
          <Character {...ARCHER} x={-620} y={-520} s={1.2} z={2} look={0.6} expression={{ eyes: "squint", mouth: "flat", brows: 0.5 }} pose={poses.think} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

/** Campfire lesson set (dusk). */
const Camp: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <X z={-40}>
      <Sky w={5000} h={3000} y={1200} top="#3f4a86" mid="#c9708a" bottom="#f3b07a" />
    </X>
    <Ground w={5000} h={1600} y={-160} color="#7a7a52" pebbles={10} tufts={14} tuftColor="#4a5a32" z={-30} />
    {children}
  </>
);

// F8 169.6 "Think about lighting a campfire."
export const CampfireShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <Camp>
          <Log x={-120} y={-480} w={520} r={70} z={1} />
          <Kindling x={300} y={-480} s={1.2} z={2} />
          <Character {...ARCHER} x={-700} y={-500} s={1.2} z={3} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame)} />
        </Camp>
      </Stage>
    </AbsoluteFill>
  );
};

// F9 171.6 "You don't hold a match to a big log."
export const MatchLogShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const out = ramp(t, 172.9, 173.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.3, y: -260 }} light={{ dir: [-0.6, 0.8] }}>
        <Camp>
          <Log x={0} y={-560} w={900} r={130} mark={out * 0.6} z={1} />
          <X x={-60} y={-330} rot={-0.35} z={2}>
            <Match lit={out < 0.95} />
          </X>
          {out > 0.3 ? <Smoke x={-40} y={-140} w={40} h={240} alpha={0.5} puffs={5} z={3} /> : null}
        </Camp>
      </Stage>
      <Label text="✘" x={0.7} y={0.2} size={0.12} color="#fe5649" at={Math.round((173.1 - 171.6) * 30)} />
    </AbsoluteFill>
  );
};

// F10 173.75 "You start with dry grass and small sticks."
export const KindlingShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 174.6, 175.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.4, y: -260 }} light={{ pos: [0, -200] }}>
        <Camp>
          <Kindling y={-480} s={1.6} burn={burn} z={1} />
          <X x={-60} y={-420} rot={-0.35} z={2}>
            <Match lit />
          </X>
        </Camp>
      </Stage>
      <Label text="✔" x={0.7} y={0.2} size={0.12} color="#7fd06a" at={Math.round((175.3 - 173.75) * 30)} />
    </AbsoluteFill>
  );
};

// F11 176.4 "Thick wood needs a big, hot fire before it burns."
export const BigFireShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const grow = 0.5 + ramp(t, 177.0, 178.6) * 1.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -160 }} light={{ pos: [0, -300] }}>
        <Camp>
          <Log x={0} y={-500} w={700} r={90} mark={0.4} z={1} />
          <Kindling y={-500} s={1.4} burn={1} z={1.5} />
          <FireLine y={-430} w={600} intensity={grow} seed={6} z={2} />
        </Camp>
      </Stage>
      <Label text="BIG + HOT" x={0.5} y={0.14} size={0.065} kind="box" at={Math.round((177.3 - 176.4) * 30)} />
    </AbsoluteFill>
  );
};

// F12 179.5 "A little flame on an arrow makes a black mark, and then it dies."
export const BlackMarkShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const mark = ramp(t, 180.8, 181.6);
  const die = ramp(t, 182.2, 182.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.6, x: 100, y: -80 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-500}>
          <Palisade x={120} y={-560} w={900} h={700} z={1} />
          <Part shape={ellipse(70 * mark, 46 * mark)} color="#2a2020" flat outline={0} opacity={0.85} x={140} y={60} z={1.5} />
          <X x={140} y={60} rot={Math.PI - 0.25} z={2}>
            <Arrow s={1.6} x={-150} fire={die < 0.9} fireSize={0.8 * (1 - die)} />
          </X>
          {die > 0.3 ? <Smoke x={150} y={90} w={50} h={260} alpha={0.45} puffs={5} z={3} /> : null}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// F13 183.5 "So fire arrows only work on one kind of target. Dry, thin things that burn easily."
export const DryThinShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-260} mood="warm">
          <Crosshair x={0} y={-80} r={200} s={ramp(t, 185.5, 185.8, Easing.out(Easing.back(2)))} z={3} />
          <HayStack x={0} y={-340} w={420} burn={ramp(t, 188.0, 188.6)} z={1} />
        </DayField>
      </Stage>
      <Label text="DRY + THIN" x={0.5} y={0.12} size={0.07} kind="box" at={Math.round((186.69 - 183.5) * 30)} />
    </AbsoluteFill>
  );
};

/** Quick target card: one burnable thing catching fire. */
const TargetCard: React.FC<{ start: number; kind: "roof" | "tent" | "sail" | "hay"; label: string }> = ({ start, kind, label }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, start / 30 + 0.15, start / 30 + 0.55);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -100 }} light={{ dir: [-0.6, 0.8] }}>
        {kind === "sail" ? (
          <>
            <X z={-40}>
              <Sky w={5000} h={3000} y={1200} top="#4f9fd9" bottom="#d8eef6" />
            </X>
            <Sea w={5000} h={1600} y={-300} z={-30} />
            <Trireme y={-330} len={1100} sail z={1} />
            <FireLine y={-330 + 1100 * 0.11 * 2.2} w={500} intensity={burn} seed={7} z={2} />
          </>
        ) : (
          <DayField horizon={-260} mood="warm">
            {kind === "roof" ? <StrawHut y={-420} w={520} burn={burn} z={1} /> : null}
            {kind === "tent" ? (
              <>
                <Tent y={-420} w={560} h={420} z={1} />
                <FireLine y={-200} w={300} intensity={burn} seed={3} z={2} />
              </>
            ) : null}
            {kind === "hay" ? <HayStack y={-420} w={560} burn={burn} z={1} /> : null}
          </DayField>
        )}
      </Stage>
      <Label text={label} x={0.5} y={0.14} size={0.08} kind="box" at={0} />
    </AbsoluteFill>
  );
};

// F14–F17 189.4 / 190.6 / 191.4 / 192.3
export const RoofShot: React.FC<ShotProps> = ({ start }) => <TargetCard start={start} kind="roof" label="STRAW ROOFS" />;
export const TentShot: React.FC<ShotProps> = ({ start }) => <TargetCard start={start} kind="tent" label="TENTS" />;
export const SailShot: React.FC<ShotProps> = ({ start }) => <TargetCard start={start} kind="sail" label="SAILS" />;
export const HayShot: React.FC<ShotProps> = ({ start }) => <TargetCard start={start} kind="hay" label="HAY" />;

// F18 193.65 "And that's exactly where history uses them. Not in open battles. In sieges."
export const SiegesShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 196.5, 197.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0), y: -180 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-120} mood="warm">
          <Town x={300} y={-60} w={1600} burn={burn} seed={3} s={0.8} z={1} />
          <Battlement x={300} y={-420} w={1700} h={360} z={2} />
          {[-760, -620, -480].map((x, i) => (
            <Character key={x} {...ENEMY(i)} x={x} y={-500 + i * 10} s={0.8} z={3 + i * 0.01} look={0.6} expression={{ eyes: "angry", mouth: "flat" }} pose={drawPose(0.8)} holdF={<Bow rot={-1.57} draw={0.8} arrow fire />} />
          ))}
          {[0, 0.3, 0.6].map((k, i) => (
            <FlyingArrow key={i} from={[-560, -280]} via={[0, 280]} to={[500, -40]} p={((t - start / 30) * 0.8 + k) % 1.1} fire={1} trail="comet" trailLen={0.15} s={0.8} z={4 + i * 0.01} />
          ))}
        </DayField>
      </Stage>
      <Label text="SIEGES" x={0.5} y={0.12} size={0.08} kind="box" color="#fe5649" at={Math.round((197.7 - 193.65) * 30)} />
    </AbsoluteFill>
  );
};

