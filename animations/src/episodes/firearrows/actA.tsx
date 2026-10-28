import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Glow, Line, Arrow, Bow, RagBall, FlyingArrow, QuestionMark, Letterbox, Bucket, Spear, InkLine,
  roundRect, circle, blob, ramp, push, hitAt, absT, type ShotProps, palette,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  CoalPot, TorchArmy, Theater, Popcorn, CastleFar, Battlement, Ground, Smoke, FireLine, Kindling, Splash, Longship, Sea, Rocket,
  Stars, Moon, Sky, Earth,
} from "../../kit/env";
import { NightWall, NightField, NightSky, DayField } from "./sets";
import { ARCHER, CAPTAIN, ENEMY, ROMAN } from "./cast";

const W = () => useVideoConfig();

/** Archer pose facing right: both arms forward, `draw` 0..1. */
export const drawPose = (draw: number) => ({ armF: [1.5, 0.05] as [number, number], armB: [1.45 - draw * 0.3, 0.2 + draw * 0.9] as [number, number] });
/** Carry something heavy in the front hand (arm down). */
const carry = { armF: [0.25, 0.1] as [number, number], armB: [-0.2, -0.1] as [number, number] };

// A1 0.00 "It's night, and you're an archer on a castle wall."
export const NightOpenShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 20 }} light={{ pos: [-640, -100] }} shadowMul={[0.55, 0.52, 0.7]} vignette={0.7} vignetteColor="#04050f">
        <NightWall>
          <Character {...ARCHER} x={-120} y={-360} s={1.1} z={2} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: 0.3, gaze: [0.8, -0.4] }} pose={poses.idle(frame)} holdF={<Bow rot={-0.3} s={1} />} />
          {[-700, 520].map((x, i) => (
            <Character key={x} {...ENEMY(i)} hat="kettle" hatColor="#9aa0aa" outfit={ARCHER.outfit} x={x} y={-380} s={0.9} z={1} look={0.5} facing={i ? -1 : 1} expression={{ eyes: "half", mouth: "flat" }} pose={poses.idle(frame, i + 3)} />
          ))}
        </NightWall>
      </Stage>
    </AbsoluteFill>
  );
};

// A2 2.75 "Down below, the enemy army is moving closer."
export const ArmyBelowShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.12), y: 60 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7} vignetteColor="#04050f">
        <NightField horizon={260}>
          <TorchArmy y={120} x={-500} w={2600} rows={3} n={20} speed={-0.8} s={0.75} z={1} />
          <TorchArmy y={-120} x={-300} w={2800} rows={2} n={16} speed={-1.0} s={1.0} seed={8} z={2} />
          <Battlement y={-760} w={3000} h={380} color="#4e4a56" merlon={150} z={10} />
        </NightField>
      </Stage>
    </AbsoluteFill>
  );
};

// A3 5.12 "Your captain walks along the wall with a pot of burning coals."
export const CaptainWalkShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, dur], [-760, 160]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, x: x * 0.4, y: 20 }} light={{ pos: [x + 120, -260] }} shadowMul={[0.55, 0.52, 0.7]} vignette={0.7} vignetteColor="#04050f">
        <NightWall torches={[-1100, 900]}>
          {[-420, 260, 760].map((ax, i) => (
            <Character key={ax} {...ARCHER} seed={i + 4} freckles={i === 1} x={ax} y={-370} s={0.95} z={1 + i * 0.01} look={0.4} facing={-1} expression={{ eyes: "open", mouth: "flat", gaze: [0.6, 0] }} pose={poses.idle(frame, i)} holdF={<Bow rot={-0.3} />} />
          ))}
          <Character
            {...CAPTAIN}
            x={x}
            y={-350}
            s={1.1}
            z={2}
            look={0.5}
            talking={false}
            expression={{ eyes: "angry", mouth: "flat", brows: -0.5 }}
            pose={{ ...poses.walk(frame, 1.0), ...carry }}
            holdF={<CoalPot s={0.55} y={-90} rot={-0.35} />}
          />
        </NightWall>
      </Stage>
    </AbsoluteFill>
  );
};

// A4 8.20 '"Fire arrows!" he shouts.'
export const ShoutShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 8.36, 0.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15) + hit * 0.05, y: 60, shake: hit * 14 }} light={{ pos: [260, -500] }} shadowMul={[0.5, 0.48, 0.66]} vignette={0.75} vignetteColor="#04050f">
        <NightSky horizon={-300} moonX={-700} />
        <Character
          {...CAPTAIN}
          x={-120}
          y={-880}
          s={2.3}
          z={1}
          look={0.35}
          expression={{ eyes: "angry", mouth: t > 8.3 && t < 9.45 ? "shout" : "flat", brows: -0.9 }}
          pose={{ armF: [t > 8.3 ? 2.6 : 0.3, 0.2], armB: [-0.2, -0.1], armsOverHead: t > 8.3 }}
          talking={t > 9.6}
          shadow={false}
        />
        <Glow x={300} y={-500} rx={700} color="#ff8a3a" alpha={0.3} additive z={2} />
      </Stage>
    </AbsoluteFill>
  );
};

// A5 10.50 "You dip your arrow in, and the rag on the tip catches."
export const DipShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dip = ramp(t, 10.7, 11.5);
  const out = ramp(t, 12.4, 12.95, Easing.out(Easing.quad));
  const lit = ramp(t, 12.9, 13.15);
  const ax = interpolate(dip - out * 0.4, [0, 1], [700, 60]);
  const ay = interpolate(dip - out, [0, 1], [180, -190]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -40 }} light={{ pos: [0, -200] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.8} vignetteColor="#04050f">
        <NightSky horizon={-700} />
        <Battlement y={-900} w={3000} h={380} color="#5e5866" merlon={150} z={-5} />
        <CoalPot y={-430} s={2.2} z={1} />
        <X x={ax} y={ay} rot={-0.75 + out * 0.5} z={2}>
          <Arrow s={2.4} x={-160} />
          <RagBall x={-160 * 2.4 + 150 * 2.4 - 6} s={1.3} lit={lit} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// A6 13.70 "You pull back the string, and the flame roars right next to your face."
export const DrawShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const draw = ramp(t, 13.9, 14.9);
  const roar = ramp(t, 15.3, 15.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12), x: 120, y: 60, shake: roar * 3 }} light={{ pos: [420, 120] }} shadowMul={[0.5, 0.46, 0.62]} vignette={0.8} vignetteColor="#04050f">
        <NightSky horizon={-400} moonX={-800} />
        <Character
          {...ARCHER}
          x={-160}
          y={-860}
          s={2.6}
          z={1}
          look={0.55}
          expression={{ eyes: roar > 0.5 ? "wide" : "angry", mouth: roar > 0.5 ? "teeth" : "flat", brows: roar > 0.5 ? 0.6 : -0.6, sweat: roar > 0.5, gaze: [0.9, 0] }}
          pose={drawPose(draw)}
          holdF={<Bow rot={-1.57} draw={draw} arrow fire s={1.15} />}
          shadow={false}
        />
        <Glow x={360} y={-80} rx={520 + roar * 260} color="#ff9a3c" alpha={0.25 + roar * 0.2} additive z={3} />
      </Stage>
    </AbsoluteFill>
  );
};

// A7 17.65 "You let go."
export const ReleaseShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const released = t > 18.18;
  const fly = Math.max(0, t - 18.18);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, x: 80, y: 40, shake: hitAt(t, 18.2, 0.3) * 6 }} light={{ pos: [420, 120] }} shadowMul={[0.5, 0.46, 0.62]} vignette={0.8} vignetteColor="#04050f">
        <NightSky horizon={-400} moonX={-800} />
        <Character
          {...ARCHER}
          x={-260}
          y={-760}
          s={2.2}
          z={1}
          look={0.55}
          expression={{ eyes: "angry", mouth: released ? "o" : "teeth", brows: -0.5, gaze: [0.9, -0.3] }}
          pose={drawPose(released ? 0.1 : 1)}
          holdF={<Bow rot={-1.57} draw={released ? Math.max(0, 0.3 - fly * 3) * Math.sin(fly * 60) : 1} arrow={!released} fire s={1.15} />}
          shadow={false}
        />
        {released ? <FlyingArrow from={[240, 0]} via={[700, 300]} to={[1400, 700]} p={fly / 0.7} fire={1} trail="comet" s={1.6} z={3} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};

// A8 18.75 "The arrow climbs into the dark sky like a tiny comet."
export const CometShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const p = ramp(t, 18.75, 22.05, (x) => x);
  const from: [number, number] = [-900, -500];
  const via: [number, number] = [-100, 500];
  const to: [number, number] = [900, 700];
  const camX = interpolate(p, [0, 1], [-500, 400]);
  const camY = interpolate(p, [0, 1], [-200, 300]);
  return (
    <AbsoluteFill>
      <Stage camera={{ x: camX, y: camY, zoom: 1.0 }} light={{ dir: [0, 1] }} vignette={0.75} vignetteColor="#04050f">
        <Sky w={6000} h={4000} y={600} top="#050820" bottom="#1a2448" />
        <Stars w={5000} h={3000} y={600} count={160} />
        <Moon x={600} y={500} r={60} />
        <FlyingArrow from={from} via={via} to={to} p={p * 0.85} fire={1} trail="comet" trailLen={0.3} s={1.2} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};

// A9 22.05 "And halfway there, it goes out."
export const GoesOutShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const p = 0.5 + ramp(t, 22.05, 24.3, (x) => x) * 0.12;
  const flicker = 1 - ramp(t, 23.2, 23.8);
  const sputter = flicker * (0.75 + 0.25 * Math.sin(frame * 1.7));
  const from: [number, number] = [-1100, -700];
  const via: [number, number] = [-100, 500];
  const to: [number, number] = [900, 300];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.6, x: 0, y: 160 }} light={{ dir: [0, 1] }} vignette={0.75} vignetteColor="#04050f">
        <Sky w={6000} h={4000} y={600} top="#050820" bottom="#1a2448" />
        <Stars w={5000} h={3000} y={600} count={160} />
        <FlyingArrow from={from} via={via} to={to} p={p} fire={sputter} trail={flicker > 0.2 ? "comet" : "smoke"} trailLen={0.15} s={1.1} z={2} />
        {t > 23.75 ? <Smoke x={-80} y={240} w={60} h={260} alpha={0.55 * (1 - ramp(t, 23.8, 24.3))} puffs={5} seed={6} z={3} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};

// A10 24.30 "A thin line of smoke, and it drops, cold, into the grass."
export const DropShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const p = ramp(t, 24.35, 27.9, Easing.in(Easing.quad));
  const from: [number, number] = [-700, 520];
  const via: [number, number] = [-100, 560];
  const to: [number, number] = [300, -330];
  const camY = interpolate(p, [0, 1], [260, -150]);
  const stuck = t > 27.9;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: camY, x: interpolate(p, [0, 1], [-300, 200]), shake: hitAt(t, 27.9, 0.25) * 4 }} light={{ dir: [-0.4, 0.8] }} shadowMul={[0.55, 0.52, 0.7]} vignette={0.75} vignetteColor="#04050f">
        <NightField horizon={-300} />
        {stuck ? (
          <X x={300} y={-330} rot={-1.05} z={2}>
            <Arrow s={1.3} x={-150} />
          </X>
        ) : (
          <FlyingArrow from={from} via={via} to={to} p={p} trail="smoke" trailLen={0.4} s={1.3} z={2} />
        )}
        <X y={-360} z={4}>
          {Array.from({ length: 40 }, (_, i) => (
            <Line key={i} pts={[[-1500 + i * 80, 0], [-1500 + i * 80 + ((i * 37) % 30) - 15, 80 + ((i * 53) % 60)]]} width={8} color={i % 2 ? "#2a3a24" : "#34462c"} />
          ))}
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

/** A volley of fire arrows across a night sky (used inside "movie" shots). */
const Volley: React.FC<{ t: number; n?: number; dir?: 1 | -1; spread?: number; seed?: number; fire?: boolean }> = ({ t, n = 14, dir = 1, spread = 900, seed = 1, fire = true }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const off = ((i * 0.37 + seed * 0.13) % 1) * 1.2;
      const p = ((t * 0.55 + off) % 1.2) / 1.0;
      const y0 = -300 + ((i * 97) % 200);
      return (
        <FlyingArrow
          key={i}
          from={[-dir * spread, y0]}
          via={[0, y0 + 520]}
          to={[dir * spread, y0 - 120]}
          p={p}
          fire={fire ? 1 : 0}
          trail={fire ? "comet" : null}
          trailLen={0.12}
          s={0.6}
          seed={i}
          z={i * 0.001}
        />
      );
    })}
  </>
);

// B1 28.85 "Watch almost any medieval movie, and the sky is full of flaming arrows."
export const MovieShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [0, 1] }} vignette={0.65} vignetteColor="#05030a">
        <Theater screenW={1300} screenH={560} screenY={140}>
          <Sky w={1300} h={560} top="#0b1030" bottom="#3a2a4a" />
          <CastleFar y={-280} s={0.45} z={0.5} />
          <X s={0.62} z={1}>
            <Volley t={t} n={16} />
          </X>
        </Theater>
        <Popcorn x={-560} y={-520} s={1.1} z={5} />
      </Stage>
    </AbsoluteFill>
  );
};

// B2 33.00 "Every siege."
export const MovieSiegeShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const { width, height } = W();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, 33, 1.0, 1.06) }} light={{ dir: [0, 1] }} vignette={0.6}>
        <NightSky horizon={-260} />
        <CastleFar x={300} y={-300} s={1.0} z={1} />
        <X z={2}>
          <Volley t={t} n={18} dir={1} spread={1100} seed={3} />
        </X>
        <Letterbox width={width} height={height} />
      </Stage>
    </AbsoluteFill>
  );
};

// B3 34.10 "Every big battle."
export const MovieBattleShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const { width, height } = W();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <NightField horizon={0}>
          <TorchArmy y={-150} x={500} w={1600} rows={2} n={10} speed={0} s={1} seed={5} />
          <X z={2}>
            <Volley t={t + 3} n={20} dir={1} spread={1100} seed={7} />
          </X>
        </NightField>
        <Letterbox width={width} height={height} />
      </Stage>
    </AbsoluteFill>
  );
};

// B4 35.30 "But in real history, fire arrows show up far less than you'd think."
export const RealHistoryShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-120} castle>
          <X z={2}>
            {Array.from({ length: 22 }, (_, i) => {
              const off = (i * 0.29) % 1;
              const p = ((t * 0.5 + off) % 1.1) / 1.0;
              const y0 = -380 + ((i * 61) % 160);
              return <FlyingArrow key={i} from={[-1100, y0]} via={[0, y0 + 460]} to={[1100, y0 - 80]} p={p} s={0.95} z={i * 0.001} />;
            })}
            <FlyingArrow from={[-1100, -250]} via={[0, 260]} to={[1100, -300]} p={((t * 0.5 + 0.5) % 1.1) / 1.0} fire={0.8} s={0.95} z={0.1} />
          </X>
        </DayField>
      </Stage>
      <Label text="REAL HISTORY" x={0.5} y={0.12} size={0.07} kind="box" at={6} />
    </AbsoluteFill>
  );
};

// B5 39.20 "So why?"
export const SoWhyShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const q = ramp(t, 39.7, 39.95, Easing.out(Easing.back(2.5)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-200}>
          <Character {...ARCHER} x={-200} y={-560} s={1.6} z={1} look={0.4} expression={{ eyes: "squint", mouth: "wavy", brows: 0.7 }} pose={poses.shrug(1)} holdF={<Bow rot={-0.3} />} />
          {q > 0.01 ? <QuestionMark x={300} y={120} s={q * 1.6} rot={Math.sin(frame * 0.15) * 0.08} z={3} /> : null}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// B6 40.70 "Imagine setting your enemy on fire from a hundred meters away."
export const HundredMetersShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fly = ramp(t, 41.3, 42.2, (x) => x);
  const burning = t > 42.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.9, y: 20 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-120}>
          <Character {...ARCHER} x={-760} y={-420} s={0.95} z={1} look={0.6} expression={{ eyes: "half", mouth: "smirk" }} pose={drawPose(fly > 0 ? 0 : 1)} holdF={<Bow rot={-1.57} draw={fly > 0 ? 0 : 1} arrow={fly === 0} fire s={1.1} />} />
          <Character
            {...ENEMY(0)}
            x={760}
            y={-420}
            s={0.95}
            z={1}
            facing={-1}
            look={0.6}
            expression={burning ? { eyes: "wide", mouth: "shout", brows: 0.9 } : { eyes: "open", mouth: "flat" }}
            pose={burning ? poses.run(frame) : poses.idle(frame)}
          />
          {burning ? <FireLine x={760} y={-420 + 300 * 0.95} w={120} intensity={0.8} seed={4} z={2} /> : null}
          <FlyingArrow from={[-560, -200]} via={[0, 240]} to={[700, -150]} p={fly} fire={1} trail="comet" trailLen={0.15} s={0.8} z={3} />
          <X y={330} z={4}>
            <Line pts={[[-640, 0], [640, 0]]} width={6} color="#ffffff" />
            <Line pts={[[-640, -30], [-640, 30]]} width={6} color="#ffffff" />
            <Line pts={[[640, -30], [640, 30]]} width={6} color="#ffffff" />
          </X>
        </DayField>
      </Stage>
      <Label text="100 M" x={0.5} y={0.14} size={0.07} at={10} />
    </AbsoluteFill>
  );
};

// B7 44.20 "Why wouldn't you do that every time?"
export const EveryTimeShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: 80 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-200}>
          <Character {...ARCHER} x={0} y={-640} s={2.0} z={1} look={0.3} expression={{ eyes: "half", mouth: "smirk", brows: 0.3, gaze: [0.4, 0.6] }} pose={poses.think} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// C1 46.05 "Coming up, the Roman soldier who explains why you have to shoot them badly."
export const TeaserRomanShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fly = ramp(t, 48.9, 49.9, (x) => x);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 20 }} light={{ dir: [-0.8, 0.6] }}>
        <DayField horizon={-160} mood="warm">
          <Character {...ROMAN} x={-380} y={-520} s={1.5} z={1} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: 0.2 }} pose={drawPose(t > 48.9 ? 0 : 0.35)} holdF={<Bow rot={-1.57} draw={t > 48.9 ? 0 : 0.35} arrow={t <= 48.9} fire s={1.1} />} />
          <FlyingArrow from={[-40, -130]} via={[150, 40]} to={[360, -480]} p={fly} fire={1} s={1.0} z={2} />
        </DayField>
      </Stage>
      <Label text="COMING UP" x={0.5} y={0.1} size={0.065} kind="box" at={0} color="#fe5649" />
    </AbsoluteFill>
  );
};

// C2 50.00 "The fire that gets worse when you throw water on it."
export const TeaserWaterShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const splash = ramp(t, 51.6, 52.3, (x) => x);
  const flare = 0.6 + ramp(t, 51.9, 52.4) * 1.0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40, shake: hitAt(t, 52.0, 0.5) * 8 }} light={{ pos: [200, -200] }} shadowMul={[0.6, 0.55, 0.65]} vignette={0.7}>
        <NightSky horizon={-260} />
        <Ground w={4000} h={1200} y={-260} color="#3a3a30" pebbles={6} tufts={4} z={-10} />
        <FireLine x={200} y={-380} w={420} intensity={flare} seed={3} z={1} />
        <Character {...ROMAN} x={-460} y={-470} s={1.2} z={2} look={0.6} expression={splash > 0.5 ? { eyes: "wide", mouth: "o", brows: 0.9, sweat: true } : { eyes: "angry", mouth: "teeth" }} pose={{ armF: [1.2 - splash * 0.6, 0.3], armB: [1.0 - splash * 0.5, 0.4] }} holdF={<Bucket s={0.8} rot={-1.2 - splash} />} />
        <Splash x={180} y={-380} t={splash} size={1.3} z={3} />
      </Stage>
    </AbsoluteFill>
  );
};

// C3 52.60 "The Viking funeral that never happened."
export const TeaserVikingShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sky w={5000} h={3000} y={1000} top="#3f4a86" mid="#c9708a" bottom="#f3b07a" />
        <Sea w={5000} h={1600} y={-60} color="#4a6a9a" z={1} />
        <Longship x={0} y={-160} len={1100} burn={1} z={2} />
      </Stage>
      <Label text="MYTH" x={0.62} y={0.3} size={0.12} kind="stamp" rotate={-12} at={40} />
    </AbsoluteFill>
  );
};

// C4 54.70 "And how the fire arrow didn't die."
export const TeaserAliveShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const relight = ramp(t, 55.6, 56.1, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.2, 1.35), y: -160 }} light={{ dir: [-0.6, 0.8] }} vignette={0.75} vignetteColor="#04050f">
        <NightField horizon={-100} />
        <X x={0} y={-300} rot={-0.15} z={2}>
          <Arrow s={2.0} x={-150} fire={relight > 0.05} fireSize={relight * 1.4} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// C5 56.80 "It changed its name and went to space."
export const TeaserSpaceShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 57.0, 59.2, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: rise * 500, shake: (1 - rise) * 4 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sky w={5000} h={6000} y={1500} top="#050820" mid="#2b3a8a" bottom="#8ec9ee" />
        <Stars w={4000} h={2000} y={2200} count={100} />
        <Ground w={4000} h={1200} y={-420} color="#8a9a6a" pebbles={0} tufts={0} z={-5} />
        <Rocket x={0} y={-420 + rise * 1400} h={700} thrust={1} z={2} />
      </Stage>
      <Label text="火箭" x={0.78} y={0.3} size={0.14} at={30} font="'WenQuanYi Zen Hei', sans-serif" />
    </AbsoluteFill>
  );
};


