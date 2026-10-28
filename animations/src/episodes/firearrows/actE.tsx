import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Glow, InkLine, Arrow, Bow, RocketArrow, FlyingArrow, FlameFace, QuestionMark, Crosshair, ArrowPile, CommentBubble,
  GunpowderPile, RagBall, Shield, Palisade, Wash, roundRect, circle, blob, poly, ramp, push, hitAt, absT, type ShotProps,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Sky, Stars, Ground, Mountains, Cloud, Pagoda, StrawHut, Hwacha, Rocket, Earth, Theater, Popcorn, Sunburst, SpeedLines, Smoke, Flame,
  StoneWall, RockHill, Banner, Battlement, CoalPot, Clock, Log, SiegeTower,
} from "../../kit/env";
import { NightSky, NightWall, DayField } from "./sets";
import { ARCHER, CAPTAIN, ENEMY, SONG_SOLDIER, KOREAN, JAPANESE, ASTRONAUT } from "./cast";
import { drawPose, Volley } from "./actA";

const sec = (from: number) => (s: number) => Math.round((s - from) * 30);
const pop = (t: number, at: number) => interpolate(t, [at, at + 0.12, at + 0.22], [0, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const CJK = "'WenQuanYi Zen Hei', sans-serif";

// ───────────────────────── K · China and Korea ─────────────────────────

// K1 385.3 "So, are flaming arrows a total failure?"
export const FailureShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.2, 1.3), y: -330 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <DayField horizon={-100} />
        <Wash width={4000} height={3000} color="#4a4656" alpha={0.35} z={-1} />
        <X x={-60} y={-430} rot={-0.06} s={2.6} z={1}>
          <Arrow x={-150} />
        </X>
        <FlameFace x={-50} y={-440} size={0.4} mood="sad" z={2} />
      </Stage>
      <Label text="FAILURE?" x={0.5} y={0.22} size={0.1} kind="stamp" rotate={-8} at={sec(start / 30)(387.1)} />
    </AbsoluteFill>
  );
};

// K2 388.15 "Not quite."
export const NotQuiteShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const perk = ramp(t, 388.3, 388.6, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.6 + hitAt(t, 388.5, 0.4) * 0.06, y: -330 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <DayField horizon={-100} />
        <X x={-60} y={-430} rot={-0.06} s={2.6} z={1}>
          <Arrow x={-150} />
        </X>
        <FlameFace x={-50} y={-440} size={0.4 + perk * 0.14} mood={perk > 0.2 ? "happy" : "sad"} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};

/** Chinese hills with a pagoda. */
const ChinaHills: React.FC<{ horizon?: number; children?: React.ReactNode }> = ({ horizon = -160, children }) => (
  <>
    <Sky w={5000} h={3000} y={horizon + 1400} top="#7ab0d0" bottom="#f4e2c0" z={-40} />
    <Mountains w={5000} y={horizon + 60} color="#9ab0b8" peaks={[[-1500, 420], [-900, 300], [-300, 460], [400, 340], [1100, 480], [1700, 320]]} z={-38} />
    <Mountains w={5000} y={horizon} color="#7a9a8a" peaks={[[-1300, 240], [-500, 180], [200, 260], [900, 200], [1500, 250]]} z={-37} />
    <Cloud x={-500} y={horizon + 380} w={520} seed={4} z={-36} />
    <Ground w={5000} h={1600} y={horizon} color="#8aa65a" pebbles={10} tufts={16} tuftColor="#5f7a3a" z={-30} />
    {children}
  </>
);

// K3 389.2 "Because in China, something happens that changes everything."
export const ChinaShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0), y: 80 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaHills>
          <Pagoda x={420} y={-200} tiers={4} w={380} s={1.1} z={1} />
          <Pagoda x={-620} y={-140} tiers={3} w={260} s={0.7} z={0.5} />
        </ChinaHills>
      </Stage>
      <Label text="CHINA" x={0.24} y={0.2} size={0.11} kind="title" at={6} />
    </AbsoluteFill>
  );
};

/** Workshop table (origin = floor center). */
const Table: React.FC<{ x?: number; y?: number; w?: number; z?: number }> = ({ x = 0, y = 0, w = 900, z = 0 }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(w, 36, 8)} color="#8a5a32" shade={0.2} y={260} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={roundRect(30, 260, 6)} color="#6e4a2c" shade={0.25} x={k * (w / 2 - 50)} y={130} />
    ))}
  </X>
);

// K4 392.8 "Around the year 1000, Chinese soldiers start tying small tubes of a new powder to their arrows."
export const TubesShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tie = Math.sin(frame * 0.8) * 0.12;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -80 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaHills horizon={-120}>
          <Character {...SONG_SOLDIER(0)} x={-120} y={-560} s={1.4} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.1, gaze: [0.6, -0.8] }} pose={{ armF: [0.9 + tie, 0.9], armB: [0.7 - tie, 0.9] }} />
          <Table x={60} y={-600} z={2} />
          <X x={-160} y={-300} z={3}>
            <RocketArrow s={1.8} rot={0.04} burning={0} />
          </X>
          {t > 396.6 ? <GunpowderPile x={330} y={-312} s={0.5} z={3} /> : null}
        </ChinaHills>
      </Stage>
      <Label text="~1000 AD" x={0.78} y={0.14} size={0.07} kind="box" at={sec(start / 30)(393.45)} />
    </AbsoluteFill>
  );
};

// K5 398.55 "Gunpowder."
export const GunpowderShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hitAt(t, 398.8, 0.4) * 0.06 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#7a5a32" alt="#6a4e2a" speed={1} z={-20} />
        <GunpowderPile y={-260} s={2.4} z={1} />
      </Stage>
      <Label text="GUNPOWDER" sub="火药" x={0.5} y={0.2} size={0.11} kind="title" at={sec(start / 30)(398.78)} font={`Montserrat, ${CJK}`} />
    </AbsoluteFill>
  );
};

// K6 399.45 "At first, it's the same old idea. Arrows that set things on fire."
export const SameOldIdeaShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 402.2, 403.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0), y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaHills horizon={-120}>
          {[0, 1].map((i) => (
            <Character key={i} {...SONG_SOLDIER(i)} x={-760 + i * 220} y={-560 - i * 20} s={1.0} z={1 + i * 0.01} look={0.6} expression={{ eyes: "angry", mouth: "flat", brows: -0.4 }} pose={drawPose(0.8)} holdF={<Bow rot={-1.57} draw={0.8} arrow fire />} />
          ))}
          <StrawHut x={500} y={-420} w={420} burn={burn} z={1} />
          <StrawHut x={900} y={-380} w={320} burn={burn * 0.7} seed={7} z={0.9} />
          {[0, 1, 2].map((i) => (
            <FlyingArrow key={i} from={[-500, -200]} via={[0, 300]} to={[460 + i * 60, -200]} p={(t - 401.6 - i * 0.25) / 0.6} fire={1} trail="comet" trailLen={0.15} s={0.9} z={4} seed={i} />
          ))}
        </ChinaHills>
      </Stage>
    </AbsoluteFill>
  );
};

// K7 403.5 "But over time, people notice something strange."
export const NoticeStrangeShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hiss = ramp(t, 404.6, 405.0);
  const jitter = Math.sin(frame * 2.3) * 6 * hiss;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, y: -120 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaHills horizon={-120}>
          <Character {...SONG_SOLDIER(1)} x={-420} y={-600} s={1.4} z={1} look={0.6} expression={{ eyes: hiss > 0.5 ? "wide" : "squint", mouth: hiss > 0.5 ? "o" : "flat", brows: 0.6, gaze: [0.8, -0.5] }} pose={poses.think} />
          <Table x={200} y={-620} w={700} z={2} />
          <X x={60 + jitter} y={-320} z={3}>
            <RocketArrow s={1.6} burning={hiss * 0.5} />
          </X>
          <QuestionMark x={-180} y={140} s={0.9 * pop(t, 405.4)} rot={0.15} z={4} />
        </ChinaHills>
      </Stage>
    </AbsoluteFill>
  );
};

// K8 406.4 "When the powder burns inside a tube with one open end, it pushes."
export const PushDiagramShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const f = sec(start / 30);
  const burn = ramp(t, 407.2, 407.6);
  const push2 = ramp(t, 410.1, 410.9, Easing.in(Easing.quad));
  const hit = hitAt(t, 410.18, 0.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, shake: hit * 10 }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#3a3440" alt="#2e2a34" z={-20} />
        <X x={-80 + push2 * 260} y={-40} z={1}>
          <Part shape={roundRect(760, 220, 30)} color="#c0362c" shade={0.25} />
          <Part shape={roundRect(700, 150, 20)} color="#2a1e22" flat outline={5} z={0.01} x={-20} />
          <Part shape={blob([[-150, -60], [320, -60], [320, 60], [-150, 60], [-120, 0]], 10)} color="#4a4048" flat outline={0} z={0.02} />
          {burn > 0 ? (
            <X x={-300} rot={Math.PI / 2} z={0.05}>
              <Glow rx={300 * burn} color="#ffb04a" alpha={0.5} additive />
              <Flame size={0.9 * burn} seed={3} />
            </X>
          ) : null}
        </X>
        {t > 410.0 ? (
          <X x={520 + push2 * 260} y={-40} s={pop(t, 410.1)} z={2}>
            <InkLine pts={[[-60, 0], [220, 0]]} width={50} color="#fe5649" outline={8} />
            <Part shape={poly([[200, 70], [320, 0], [200, -70]])} color="#fe5649" outline={8} flat z={0.01} />
          </X>
        ) : null}
      </Stage>
      <Label text="ONE OPEN END" x={0.22} y={0.22} size={0.06} kind="box" at={f(408.76)} />
      <Label text="PUSH!" x={0.76} y={0.28} size={0.1} color="#fe5649" at={f(410.18)} />
    </AbsoluteFill>
  );
};

// K9 410.95 "The arrow doesn't need a bow anymore."
export const NoBowShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#3a4a5a" alt="#324050" z={-20} />
        <X x={-420} y={-40} s={2.4} z={1}>
          <Bow />
        </X>
        <X x={-420} y={-40} s={1.5 * pop(t, 412.0)} z={3}>
          <InkLine pts={[[-90, 90], [90, -90]]} width={34} color="#fe5649" outline={8} />
          <InkLine pts={[[-90, -90], [90, 90]]} width={34} color="#fe5649" outline={8} />
        </X>
        <X x={240} y={-40} rot={0.5} s={2.0} z={2}>
          <RocketArrow x={-90} burning={0.3} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// K10 412.95 "It flies by itself."
export const FliesItselfShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 60 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaHills horizon={-300} />
        <FlyingArrow from={[-1200, -400]} via={[-100, 300]} to={[1300, 420]} p={(t - 413.0) / 1.6} rocket={1} trail="smoke" trailLen={0.3} s={1.6} z={3} />
      </Stage>
    </AbsoluteFill>
  );
};

// K11 414.8 "Remember the Roman problem? The faster it flies, the more the fire goes out."
export const RomanProblemShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const speed = interpolate(t, [416.5, 418.2], [30, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = ramp(t, 417.9, 418.75);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, shake: 2 + out * 2 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sky w={5000} h={3000} y={0} top="#6a8ab0" bottom="#d8c8a8" z={-30} />
        <SpeedLines w={2400} h={900} n={18} speed={speed} z={-5} />
        <X x={-200} y={-20} s={2.6} z={1}>
          <Arrow x={-150} fire={out < 0.98} fireSize={1 - out} />
        </X>
        {out > 0.4 ? <Smoke x={-220} y={0} w={60} h={-500} alpha={0.5} seed={3} speed={2} z={0.5} /> : null}
        <Wash width={4000} height={3000} color="#b89c6e" alpha={0.45} z={10} />
      </Stage>
      <Label text="THE ROMAN PROBLEM" x={0.5} y={0.14} size={0.065} kind="box" at={sec(start / 30)(415.45)} />
    </AbsoluteFill>
  );
};

// K12 419.3 "Now the fire is what makes it fly."
export const FireMakesFlyShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.4;
  const bob = Math.sin(frame * 0.3) * 10;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, shake: 3 }} light={{ dir: [-0.6, 0.8] }}>
        <Sky w={5000} h={3000} y={0} top="#4f9fd9" bottom="#d8eef6" z={-30} />
        <SpeedLines w={2400} h={900} n={20} speed={100} z={-5} />
        <X x={-120} y={-30 + bob} s={s} z={1}>
          <RocketArrow x={-90} />
        </X>
        <X x={-110} y={-30 + bob} rot={Math.PI / 2} z={0.9}>
          <FlameFace size={0.75} mood={t > 420.5 ? "laugh" : "happy"} wind={0.2} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

/** Korean mountain fortress set. */
const KoreaHills: React.FC<{ horizon?: number; children?: React.ReactNode }> = ({ horizon = -160, children }) => (
  <>
    <Sky w={5000} h={3000} y={horizon + 1400} top="#5a8ac0" bottom="#e8e0c8" z={-40} />
    <Mountains w={5000} y={horizon + 40} color="#8a9ab8" peaks={[[-1500, 380], [-800, 460], [-100, 360], [600, 440], [1300, 380]]} z={-38} />
    <Ground w={5000} h={1600} y={horizon} color="#8a9a5a" pebbles={10} tufts={16} tuftColor="#5f6a3a" z={-30} />
    {children}
  </>
);

// K13 421.4 "Korea takes this idea and builds a monster."
export const KoreaShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const roll = (t - 421.4) * 60;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <KoreaHills>
          <X x={-100 + roll} y={-560} z={1}>
            <Hwacha s={1.2} loaded={1} />
            <Part shape={blob([[-260, 120], [300, 120], [320, 380], [80, 520], [-200, 420]], 30)} color="#d8c9a6" shade={0.25} z={0.5} />
          </X>
          {[0, 1].map((i) => (
            <Character key={i} {...KOREAN(i)} x={-560 - i * 200 + roll} y={-580 - i * 10} s={1.0} z={2 + i * 0.01} look={0.5} expression={{ eyes: "squint", mouth: "smirk", brows: -0.3 }} pose={{ ...poses.walk(frame + i * 5, 0.7), armF: [1.5, 0.2], armB: [1.4, 0.3], lean: -0.15 }} />
          ))}
        </KoreaHills>
      </Stage>
      <Label text="KOREA" x={0.76} y={0.2} size={0.11} kind="title" at={4} />
    </AbsoluteFill>
  );
};

// K14 424.1 "The hwacha."
export const HwachaRevealShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hitAt(t, 424.35, 0.4) * 0.06 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#2a3a5a" alt="#24304e" speed={1.5} z={-20} />
        <Hwacha y={-420} s={1.6 * Math.max(0.01, pop(t, 424.2))} z={1} />
      </Stage>
      <Label text="HWACHA" x={0.5} y={0.16} size={0.11} kind="title" at={sec(start / 30)(424.3)} />
    </AbsoluteFill>
  );
};

/** World positions of a hwacha's 30 rocket slots and its firing direction. */
const hwachaSlots = (hx: number, hy: number, s: number, tilt = 0.45, flip = 1) => {
  const c = Math.cos(tilt);
  const sn = Math.sin(tilt);
  return Array.from({ length: 30 }, (_, i) => {
    const px = -120 + (i % 10) * 27;
    const py = 40 + Math.floor(i / 10) * 66 + 40;
    return [hx + flip * s * (40 + px * c + py * sn), hy + s * (110 - px * sn + py * c)] as [number, number];
  });
};

/** Volley of rocket arrows leaving a hwacha between t0 and t1. */
const HwachaVolley: React.FC<{ t: number; t0: number; t1: number; hx: number; hy: number; s: number; reach?: number; drop?: number; flip?: number; z?: number }> = ({
  t,
  t0,
  t1,
  hx,
  hy,
  s,
  reach = 2200,
  drop = 0,
  flip = 1,
  z = 5,
}) => {
  const slots = hwachaSlots(hx, hy, s, 0.45, flip);
  const dir: [number, number] = [flip * Math.sin(0.45), Math.cos(0.45)];
  return (
    <>
      {slots.map(([x, y], i) => {
        const at = t0 + ((i * 7) % 30) / 30 * (t1 - t0);
        const p = (t - at) / 1.1;
        const k = (i % 5) * 60;
        return (
          <FlyingArrow
            key={i}
            from={[x, y]}
            via={[x + dir[0] * reach * 0.5, y + dir[1] * reach * 0.5]}
            to={[x + dir[0] * reach + k * flip, y + dir[1] * reach * 0.3 - drop]}
            p={p}
            rocket={1}
            trail="smoke"
            trailLen={0.25}
            s={0.55 * s}
            z={z + i * 0.001}
            seed={i}
          />
        );
      })}
    </>
  );
};

// K15 425.0 "A wooden cart that can fire around a hundred rocket arrows at once."
export const HwachaFireShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fired = ramp(t, 426.2, 427.9, (x) => x);
  const hx = -420;
  const hy = -470;
  const s = 1.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -20, shake: fired > 0 && fired < 1 ? 5 : 0 }} light={{ dir: [-0.6, 0.8] }}>
        <KoreaHills>
          <Hwacha x={hx} y={hy} s={s} loaded={1 - fired} z={1} />
          <Character {...KOREAN(0)} x={-840} y={-520} s={1.0} z={2} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.5 }} pose={poses.point(frame)} />
          <HwachaVolley t={t} t0={426.2} t1={427.9} hx={hx} hy={hy} s={s} />
        </KoreaHills>
      </Stage>
      <Label text="~100 ROCKET ARROWS" x={0.68} y={0.16} size={0.065} kind="box" at={sec(start / 30)(427.0)} />
    </AbsoluteFill>
  );
};

/** Haengju fortress on its mountain. */
const Haengju: React.FC<{ x?: number; y?: number; s?: number; z?: number; defenders?: boolean; cheer?: boolean }> = ({ x = 0, y = -200, s = 1, z = 0, defenders = false, cheer = false }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} s={s} z={z}>
      <RockHill w={1500} h={460} color="#8a9a6a" steep="right" path={false} seed={9} />
      <StoneWall y={440} w={900} h={170} color="#b9b0a4" z={1} />
      {[-380, 0, 380].map((bx, i) => (
        <Banner key={bx} x={bx} y={600} pole={320} color={["#c0362c", "#2f4f8a", "#e9ba41"][i]} seed={i} s={0.8} z={1.2} />
      ))}
      {defenders
        ? Array.from({ length: 6 }, (_, i) => (
            <Character key={i} {...KOREAN(i)} x={-330 + i * 130} y={600} s={0.4} z={1.1 + i * 0.001} shadow={false} look={0.5} expression={{ eyes: cheer ? "happy" : "dot", mouth: cheer ? "grin" : "flat" }} pose={cheer ? poses.armsUp(frame + i * 4) : poses.idle(frame, i)} />
          ))
        : null}
    </X>
  );
};

// K16 428.85 "In 1593, at a mountain fortress called Haengju, …"
export const HaengjuShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.95), y: 120 }} light={{ dir: [-0.6, 0.8] }}>
        <KoreaHills>
          <Haengju x={160} y={-180} defenders />
        </KoreaHills>
      </Stage>
      <Label text="1593" x={0.22} y={0.18} size={0.09} kind="box" at={f(429.14)} />
      <Label text="HAENGJU" sub="KOREA" x={0.22} y={0.34} size={0.08} kind="title" at={f(431.58)} />
    </AbsoluteFill>
  );
};

/** Rows of tiny soldiers (crowd). */
const Crowd: React.FC<{ x: number; y: number; cols: number; rows: number; dx: number; dy: number; s: number; design: (i: number) => object; facing?: 1 | -1; scared?: number; z?: number }> = ({
  x,
  y,
  cols,
  rows,
  dx,
  dy,
  s,
  design,
  facing = 1,
  scared = 0,
  z = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} z={z}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return (
          <Character
            key={i}
            {...(design(i) as ReturnType<typeof JAPANESE>)}
            x={c * dx + (r % 2) * dx * 0.5}
            y={-r * dy}
            s={s}
            z={r * -0.01 + c * 0.0001}
            facing={facing}
            shadow={false}
            look={0.5}
            expression={{ eyes: scared > 0.5 ? "wide" : "angry", mouth: scared > 0.5 ? "o" : "flat" }}
            pose={scared > 0.5 ? poses.scared(frame + i) : poses.walk(frame + i * 3, 0.8)}
          />
        );
      })}
    </X>
  );
};

// K17 432.2 "… a few thousand Korean defenders face about 30,000 Japanese soldiers."
export const OddsShot: React.FC<ShotProps> = ({ start }) => {
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }}>
        <KoreaHills horizon={60} />
        <Part shape={roundRect(12, 1300, 0)} color="#211b20" flat outline={0} x={-300} z={8} />
        <Crowd x={-800} y={-260} cols={4} rows={2} dx={130} dy={70} s={0.42} design={(i) => KOREAN(i)} z={2} />
        <Crowd x={-160} y={-240} cols={12} rows={6} dx={95} dy={58} s={0.3} design={(i) => JAPANESE(i)} facing={-1} z={2} />
      </Stage>
      <Label text="A FEW THOUSAND" x={0.17} y={0.22} size={0.05} kind="box" at={f(432.46)} />
      <Label text="~30,000" x={0.66} y={0.22} size={0.09} color="#fe5649" kind="title" at={f(434.6)} />
    </AbsoluteFill>
  );
};

// K18 436.55 "With the help of their hwachas, …"
export const HwachaVolleyShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fired = ramp(t, 436.7, 437.8, (x) => x);
  const scatter = ramp(t, 437.6, 437.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.9, y: 0, shake: fired > 0.1 ? 6 : 0 }} light={{ dir: [-0.6, 0.8] }}>
        <KoreaHills horizon={-60}>
          <Haengju x={-900} y={-260} s={0.9} />
          <Hwacha x={-860} y={260} s={0.75} loaded={1 - fired} z={2} />
          <HwachaVolley t={t} t0={436.7} t1={437.8} hx={-860} hy={260} s={0.75} reach={1900} drop={900} />
          <Crowd x={60} y={-380} cols={10} rows={4} dx={110} dy={64} s={0.34} design={(i) => JAPANESE(i)} facing={-1} scared={scatter} z={2} />
          {[0, 1, 2, 3].map((i) => (
            <Glow key={i} x={200 + i * 260} y={-300 + (i % 2) * 60} rx={220} color="#ffb04a" alpha={0.6 * hitAt(t, 437.6 + i * 0.15, 0.4)} additive z={6} />
          ))}
        </KoreaHills>
      </Stage>
    </AbsoluteFill>
  );
};

// K19 438.3 "… the Koreans hold the fortress and win."
export const KoreansWinShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 440.22, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hit * 0.05, y: -60, shake: hit * 8 }} light={{ dir: [-0.6, 0.8] }}>
        <KoreaHills horizon={-60}>
          <Battlement y={-760} w={2600} h={420} color="#b9b0a4" merlon={150} z={10} />
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...KOREAN(i)} x={-700 + i * 350} y={-500 - (i % 2) * 30} s={1.0} z={5 + i * 0.01} facing={i % 2 ? -1 : 1} look={0.3} expression={{ eyes: t > 439.9 ? "happy" : "open", mouth: t > 439.9 ? "grin" : "smile" }} pose={t > 439.9 ? poses.armsUp(frame + i * 5) : poses.idle(frame, i)} />
          ))}
          {[-860, 0, 860].map((bx, i) => (
            <Banner key={bx} x={bx} y={-380} pole={620} color={["#c0362c", "#2f4f8a", "#e9ba41"][i]} seed={i} z={4} />
          ))}
        </KoreaHills>
      </Stage>
      <Label text="VICTORY" x={0.5} y={0.16} size={0.1} kind="stamp" rotate={-6} at={sec(start / 30)(440.22)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── L · Huojian ─────────────────────────

// L1 440.95 "And here's my favorite part."
export const FavoritePartShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#7a5a22" alt="#6a4e1c" speed={1} z={-20} />
        <FlameFace y={-230} size={1.6} mood="happy" z={1} />
      </Stage>
      <Label text="MY FAVORITE PART" x={0.5} y={0.16} size={0.075} kind="box" at={sec(start / 30)(441.4)} />
    </AbsoluteFill>
  );
};

// L2 442.5 "What do the Chinese call these arrows?"
export const ChineseCallShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -100 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaHills horizon={-120}>
          <Character {...SONG_SOLDIER(0)} x={-300} y={-620} s={1.4} z={1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={{ armF: [2.2, 0.4], armB: [-0.2, -0.1] }} holdF={<RocketArrow rot={-2.2 + Math.PI / 2} s={1.2} />} />
          <QuestionMark x={320} y={60} s={1.1 * pop(t, 443.6)} rot={0.15} z={3} />
        </ChinaHills>
      </Stage>
    </AbsoluteFill>
  );
};

// L3 444.5 "Huojian."
export const HuojianShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hitAt(t, 444.75, 0.4) * 0.05 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#7a2a22" alt="#6a221c" speed={1} z={-20} />
      </Stage>
      <Label text="火箭" x={0.5} y={0.4} size={0.3} at={sec(start / 30)(444.7)} font={CJK} />
      <Label text="HUOJIAN" x={0.5} y={0.66} size={0.07} color="#ffd27a" at={sec(start / 30)(444.8)} />
    </AbsoluteFill>
  );
};

// L4 445.6 "Fire arrow."
export const FireArrowCharsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#7a2a22" alt="#6a221c" z={-20} />
        <X x={-480} y={-260} s={1.6 * pop(t, 445.8)} z={1}>
          <Glow rx={220} color="#ffb04a" alpha={0.5} additive />
          <Flame size={0.7} y={-60} seed={2} />
        </X>
        <X x={420} y={-120} s={3.2 * pop(t, 446.2)} rot={0.15} z={1}>
          <Arrow x={-75} />
        </X>
      </Stage>
      <Label text="火 = FIRE" x={0.25} y={0.32} size={0.11} at={f(445.76)} font={`Montserrat, ${CJK}`} />
      <Label text="箭 = ARROW" x={0.7} y={0.32} size={0.11} at={f(446.15)} font={`Montserrat, ${CJK}`} />
    </AbsoluteFill>
  );
};

/** Launch pad with gantry. */
const LaunchPad: React.FC<{ children?: React.ReactNode; groundY?: number }> = ({ children, groundY = -420 }) => (
  <>
    <Sky w={5000} h={6000} y={1500} top="#050820" mid="#2b3a8a" bottom="#8ec9ee" z={-40} />
    <Stars w={4000} h={2000} y={2400} count={100} z={-39} />
    <Ground w={5000} h={1200} y={groundY} color="#8a9a6a" pebbles={0} tufts={0} z={-30} />
    <X x={-280} y={groundY} z={-10}>
      <Part shape={roundRect(70, 1100, 4)} color="#c0362c" shade={0.2} y={550} />
      {Array.from({ length: 8 }, (_, i) => (
        <InkLine key={i} pts={[[-35, 60 + i * 130], [35, 120 + i * 130]]} width={6} color="#8a2a24" outline={3} />
      ))}
      <Part shape={roundRect(160, 18, 4)} color="#8a2a24" shade={0.2} x={80} y={700} />
    </X>
    {children}
  </>
);

// L5 446.7 "And what's the Chinese word for a rocket today?"
export const RocketTodayShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 200 }} light={{ dir: [-0.6, 0.8] }}>
        <LaunchPad>
          <Rocket x={0} y={-420} h={1000} z={1} />
          <QuestionMark x={600} y={260} s={1.2 * pop(t, 448.4)} rot={0.15} z={3} />
        </LaunchPad>
      </Stage>
    </AbsoluteFill>
  );
};

// L6 449.1 "The same word. Huojian."
export const SameWordShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.35), y: 180 }} light={{ dir: [-0.6, 0.8] }}>
        <LaunchPad>
          <Rocket x={0} y={-420} h={1000} z={1} />
        </LaunchPad>
      </Stage>
      <Label text={"火\n箭"} x={0.68} y={0.36} size={0.16} at={sec(start / 30)(450.3)} font={CJK} />
      <Label text="THE SAME WORD" x={0.27} y={0.18} size={0.065} kind="box" at={sec(start / 30)(449.4)} />
    </AbsoluteFill>
  );
};

// L7 451.15 "When China sends astronauts into space, …"
export const LaunchShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const thrust = ramp(t, 451.3, 451.7);
  const rise = ramp(t, 451.7, 453.6, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.9, y: 200 + rise * 900, shake: thrust * 6 }} light={{ dir: [-0.6, 0.8] }}>
        <LaunchPad>
          <Rocket x={0} y={-420 + rise * 1500} h={1000} thrust={thrust} z={1} />
        </LaunchPad>
      </Stage>
    </AbsoluteFill>
  );
};

// L8 453.5 "… in Chinese, they're riding a fire arrow."
export const AstronautShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6} vignetteColor="#02030a">
        <Sky w={5000} h={3000} top="#02030a" bottom="#0a1030" z={-40} />
        <Stars w={4000} h={2400} count={140} z={-39} />
        <Earth x={300} y={-1250} r={1000} z={-30} />
        <X x={-260 + Math.sin(frame * 0.03) * 30} y={-180 + Math.sin(frame * 0.05) * 20} rot={0.15 + Math.sin(frame * 0.04) * 0.05} z={1}>
          <Character {...ASTRONAUT} s={1.1} shadow={false} look={0.3} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: [2.6 + Math.sin(frame * 0.4) * 0.25, 0.4], armB: [-0.5, -0.4], legF: 0.3, legB: -0.2 }} />
        </X>
        <X x={520} y={140} rot={-0.6} z={0.5}>
          <Rocket h={420} thrust={0.6} />
        </X>
      </Stage>
      <Label text="FIRE ARROW" x={0.7} y={0.18} size={0.075} kind="box" at={sec(start / 30)(455.25)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── M · Recap ─────────────────────────

// M1 456.2 "So why were flaming arrows almost never used?"
export const RecapWhyShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 20 }} light={{ pos: [-640, -100] }} shadowMul={[0.55, 0.52, 0.7]} vignette={0.7} vignetteColor="#04050f">
        <NightWall>
          <Character {...ARCHER} x={-220} y={-380} s={1.15} z={1} look={0.6} expression={{ eyes: "half", mouth: "flat", brows: 0.2 }} pose={drawPose(0.9)} holdF={<Bow rot={-1.57} draw={0.9} arrow fire s={1.05} />} />
          <QuestionMark x={460} y={180} s={pop(t, 458.3)} rot={0.15} z={12} />
        </NightWall>
      </Stage>
    </AbsoluteFill>
  );
};

// M2 459.5 "Because the fire hates flying."
export const RecapHatesFlyingShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const p = (t - 459.7) / 1.6;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7} vignetteColor="#04050f">
        <NightSky horizon={-300} />
        <FlyingArrow from={[-1200, -200]} via={[0, 360]} to={[1200, -100]} p={p} fire={1 - ramp(p, 0.35, 0.65, (x) => x)} trail={p < 0.6 ? "comet" : "smoke"} trailLen={0.2} s={1.3} z={2} />
      </Stage>
      <Label text="#1" x={0.12} y={0.14} size={0.08} kind="box" at={4} />
    </AbsoluteFill>
  );
};

// M3 461.95 "Because they're slow to light and dangerous to carry."
export const RecapSlowShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -60 }} light={{ pos: [0, -300] }} shadowMul={[0.6, 0.55, 0.62]}>
        <DayField horizon={-200} mood="warm">
          <CoalPot x={60} y={-560} s={1.4} z={1} />
          <Character {...ARCHER} x={-420} y={-600} s={1.3} z={2} look={0.6} expression={{ eyes: "half", mouth: "flat", brows: 0.4, sweat: true }} pose={{ armF: [1.2, 0.3], armB: [0.9, 0.4] }} />
          <X x={-120} y={-260} rot={-0.5} z={3}>
            <Arrow length={240} fire={frame > 40} fireSize={0.8} />
          </X>
          <Clock x={560} y={140} r={110} speed={5} z={2} />
        </DayField>
      </Stage>
      <Label text="#2" x={0.12} y={0.14} size={0.08} kind="box" at={4} />
      <Label text="SLOW" x={0.36} y={0.14} size={0.07} kind="box" at={f(462.66)} />
      <Label text="DANGEROUS" x={0.62} y={0.14} size={0.07} kind="box" color="#fe5649" at={f(463.77)} />
    </AbsoluteFill>
  );
};

// M4 465.0 "Because people don't burn like straw, …"
export const RecapPeopleShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -80 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-160}>
          <Character {...ENEMY(1)} x={-160} y={-600} s={1.35} z={1} look={0.3} expression={{ eyes: "half", mouth: "smirk", brows: -0.2 }} pose={poses.shrug(ramp(t, 465.3, 465.6))} />
          <RagBall x={180} y={-560} s={1.2} lit={1 - ramp(t, 466.0, 466.9)} z={2} />
        </DayField>
      </Stage>
      <Label text="#3" x={0.12} y={0.14} size={0.08} kind="box" at={4} />
    </AbsoluteFill>
  );
};

// M5 467.25 "… and thick walls don't burn like paper."
export const RecapWallsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const die = ramp(t, 467.9, 468.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-200}>
          <Palisade y={-620} w={2400} h={760} z={1} />
          <Part shape={blob([[-90, 0], [-40, 50], [60, 40], [100, -10], [40, -60], [-60, -50]], 10)} color="#2a2020" flat outline={0} opacity={0.85} x={60} y={-180} z={1.5} />
          <X x={-60} y={-180} rot={Math.PI - 0.3} z={2}>
            <Arrow x={-150} fire={die < 0.98} fireSize={1 - die} />
          </X>
          {die > 0.5 ? <Smoke x={50} y={-160} w={80} h={500} alpha={0.5} seed={2} speed={1.5} z={3} /> : null}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// M6 469.5 "Against a straw roof on a dry day, a fire arrow is a nightmare."
export const RecapNightmareShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 471.4, 472.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05), y: -20, shake: hitAt(t, 472.73, 0.5) * 10 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-120} mood="warm">
          {[-700, -240, 240, 700].map((x, i) => (
            <StrawHut key={x} x={x} y={-480 - (i % 2) * 40} w={400} burn={burn * (i % 2 ? 0.9 : 1.2)} seed={i} z={1 + (i % 2) * -0.1} />
          ))}
          <X z={4}>
            <Volley t={t} n={10} spread={1100} seed={4} />
          </X>
        </DayField>
      </Stage>
      <Label text="NIGHTMARE" x={0.5} y={0.18} size={0.1} kind="stamp" rotate={-6} at={sec(start / 30)(472.73)} />
    </AbsoluteFill>
  );
};

// M7 473.55 "Against an army in a field, it's a worse arrow."
export const RecapWorseShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-120}>
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...ENEMY(i)} x={-760 + i * 380} y={-560 - (i % 2) * 30} s={1.0} z={1 + i * 0.01} look={0.3} expression={{ eyes: "half", mouth: "smirk" }} pose={{ armF: [1.3, 0.4], armB: [-0.2, -0.1] }} holdF={<Shield r={120} color="#3a4a6a" emblem="#e9ba41" rot={-1.3} />} />
          ))}
          {[0, 1, 2].map((i) => (
            <X key={i} x={-500 + i * 520} y={-610} rot={0.1 * (i - 1)} z={3}>
              <Arrow x={-75} fire={t < 474.6 + i * 0.3} fireSize={0.5} seed={i} />
            </X>
          ))}
        </DayField>
      </Stage>
      <Label text="WORSE ARROW" x={0.5} y={0.18} size={0.09} kind="stamp" rotate={-5} at={sec(start / 30)(475.36)} />
    </AbsoluteFill>
  );
};

// M8 476.3 "Movies love them because they look amazing on camera, especially at night."
export const RecapMoviesShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0 }} light={{ dir: [0, 1] }} vignette={0.65} vignetteColor="#05030a">
        <Theater screenW={1300} screenH={560} screenY={140}>
          <Sky w={1300} h={560} top="#0b1030" bottom="#3a2a4a" />
          <X s={0.62} z={1}>
            <Volley t={t} n={16} />
          </X>
        </Theater>
        <Popcorn x={-560} y={-520} s={1.1} z={5} />
      </Stage>
    </AbsoluteFill>
  );
};

// M9 480.2 "Real archers only wanted to hit you."
export const RealArchersShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lock = ramp(t, 481.5, 481.95, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -80, shake: hitAt(t, 481.86, 0.4) * 10 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-160}>
          <Character {...ARCHER} x={-420} y={-620} s={1.4} z={1} look={0.7} expression={{ eyes: "angry", mouth: "flat", brows: -0.5, gaze: [0.9, 0] }} pose={drawPose(0.9)} holdF={<Bow rot={-1.57} draw={0.9} arrow s={1.1} />} />
          <Crosshair x={380} y={-80} r={180} s={interpolate(lock, [0, 1], [2.4, 1])} rot={(1 - lock) * 0.8} z={6} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── N · Outro ─────────────────────────

// N1 482.8 "But the fire arrow got the last laugh."
export const LastLaughShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 484.44, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hit * 0.06, shake: hit * 10 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#7a2a22" alt="#6a221c" speed={2} z={-20} />
        <FlameFace y={-260} size={1.9} mood={t > 484.2 ? "laugh" : "happy"} z={1} />
      </Stage>
    </AbsoluteFill>
  );
};

// N2 484.95 "It stopped needing a bow, and now it flies to space."
export const FliesToSpaceShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 486.3, 488.2, Easing.in(Easing.quad));
  const bowFall = ramp(t, 485.9, 486.8, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: rise * 1600, shake: (1 - rise) * 3 }} light={{ dir: [-0.6, 0.8] }}>
        <Sky w={5000} h={8000} y={2500} top="#02030a" mid="#2b3a8a" bottom="#8ec9ee" z={-40} />
        <Stars w={4000} h={2400} y={2600} count={120} z={-39} />
        <Ground w={4000} h={1200} y={-420} color="#8a9a6a" pebbles={0} tufts={0} z={-30} />
        <X x={-260} y={-140 - bowFall * 700} rot={bowFall * 2} s={2.2} z={1}>
          <Bow />
        </X>
        <X x={120} y={-260 + rise * 2000} rot={Math.PI / 2} s={3.6} z={2}>
          <RocketArrow x={-90} burning={1.4} />
        </X>
        <Smoke x={120} y={-340 + rise * 2000} w={70} h={-1600} alpha={0.45 * Math.min(1, rise * 4)} seed={6} speed={2} z={1.5} />
      </Stage>
    </AbsoluteFill>
  );
};

// N3 488.3 "So, commander, your castle is under attack."
export const CommanderShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-40} mood="warm">
          <SiegeTower x={620} y={-80} h={520} s={0.6} z={-5} />
          {Array.from({ length: 8 }, (_, i) => (
            <Character key={i} {...ENEMY(i)} x={200 + i * 120} y={-140 - (i % 2) * 20} s={0.35} z={-4 + i * 0.01} shadow={false} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "flat" }} pose={poses.walk(frame + i * 4, 0.7)} />
          ))}
          <Character {...CAPTAIN} x={-320} y={-470} s={1.4} z={2} look={0.15} talking={t < 491.1} expression={{ eyes: "open", mouth: "flat", brows: 0.3 }} pose={t > 489.0 ? poses.salute : poses.idle(frame)} />
          <Battlement y={-860} w={3000} h={520} merlon={150} z={10} />
        </DayField>
      </Stage>
      <Label text="UNDER ATTACK" x={0.66} y={0.18} size={0.075} kind="stamp" rotate={-6} at={sec(start / 30)(490.8)} />
    </AbsoluteFill>
  );
};

// N4 491.7 "Would you take hundred fire arrows, or three hundred normal ones?"
export const ChoiceShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <X x={-480} z={-30}>
          <Part shape={roundRect(960, 1200, 0)} color="#5a2420" flat outline={0} />
          <Glow y={-200} rx={700} color="#ff7a2a" alpha={0.25} additive />
        </X>
        <X x={480} z={-30}>
          <Part shape={roundRect(960, 1200, 0)} color="#2a3a5a" flat outline={0} />
        </X>
        <Part shape={roundRect(14, 1200, 0)} color="#211b20" flat outline={0} z={5} />
        <ArrowPile x={-480} y={-220} n={30} w={420} fire s={1.9 * Math.max(0.01, pop(t, 492.4))} z={1} />
        {[-1, 0, 1].map((k) => (
          <ArrowPile key={k} x={480 + k * 250} y={-260 + (k === 0 ? 110 : 0)} n={30} w={220} s={1.45 * Math.max(0.01, pop(t, 494.2 + (k + 1) * 0.12))} z={1 + (k === 0 ? 0.1 : 0)} />
        ))}
      </Stage>
      <Label text="100 FIRE ARROWS" x={0.25} y={0.2} size={0.065} kind="box" color="#ffb04a" at={f(492.4)} />
      <Label text="OR" x={0.5} y={0.42} size={0.09} kind="title" at={f(493.88)} />
      <Label text="300 NORMAL ARROWS" x={0.75} y={0.2} size={0.065} kind="box" at={f(494.3)} />
    </AbsoluteFill>
  );
};

// N5 495.6 "Tell me in the comments."
export const CommentsShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={22} color="#2a3a5a" alt="#24304e" speed={0.6} z={-20} />
        <Character {...ARCHER} x={-420} y={-600} s={1.4} z={1} look={0.5} talking={t < 496.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.point(frame)} />
        <CommentBubble x={380} y={60} s={1.6 * Math.max(0.01, pop(t, 496.2))} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};
