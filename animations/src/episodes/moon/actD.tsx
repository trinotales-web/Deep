import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, circle, ellipse, blob, push, hitAt, absT, ramp, QuestionMark, Magnifier, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MoonGlobe, LunarSurface, LunarPoleMap, poleXY, LUNAR_SITES, GroundCrater, ApolloLM, Chandrayaan1, CentaurStage, PSLV, ImpactPlume, Bullet, Pie, Monitor, BalanceScale, Box, XMark, Smoke,
  WaterMolecule, NationFlag, Ring, LaunchPadSet,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { SpaceSet, ControlRoom, DescentScreen, Office, RuleBoard, WaterDrop, GoldBars, IceBlocks, Flash } from "./sets";
import { YOU, ENGINEER, SCIENTIST, ASTRONAUT } from "./cast";
import { atHead } from "./frame";

// Apollo's "bone dry" Moon, Chandrayaan-1's water signs (2009), LCROSS at
// Cabeus, the Mini-SAR ice in northern craters, the 2018 direct proof of
// ice, and the rule: in space, water is worth more than gold.

/** The Moon seen low from orbit (limb at the bottom). */
const OrbitLow: React.FC<{ children?: React.ReactNode; lon?: number; lat?: number }> = ({ children, lon = 20, lat = 10 }) => (
  <SpaceSet>
    <MoonGlobe r={2600} y={-2900} view={{ lon, lat }} craters={160} glow={0.4} z={-20} />
    {children}
  </SpaceSet>
);

// 231.82 "Here's the funny part."
export const FunnyPartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05), x: -110, y: 60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55} bgBlur={3} bg={<Office floor={-420} logo="isro" />}>
        <Character {...YOU} x={-560} y={-480} s={1.65} facing={1} look={0.2} expression={{ eyes: "happy", mouth: "smirk", brows: -0.2 }} pose={poses.talk(frame, 3)} talking z={-2} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 233.1 "When the Apollo astronauts brought Moon rocks back to Earth,"
export const ApolloShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const walk = interpolate(t, [232.9, 235.9], [-60, 330]);
  const cam = { zoom: 0.9, y: 60 };
  const a = atHead(cam, 0.5, 0.47, 1.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.88, 0.94), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-40} sun={[-1500, 300]} seed={101} rocks={6} craters={3} earth={[860, 430, 95]}>
          <ApolloLM x={-640} y={a.y + 40} s={1.35} z={-8} />
          <Character {...ASTRONAUT(0)} x={walk} y={a.y} s={1.6} facing={1} look={0.4} expression={{ eyes: "happy", mouth: "smile", brows: 0.1 }} pose={poses.walk(frame, 0.8)} z={-5} />
          <X x={walk + 190} y={a.y + 270} z={-4.9}>
            <Box w={230} h={160} />
          </X>
        </LunarSurface>
      </Stage>
      <Label text="APOLLO · 1969–1972" x={0.08} y={0.1} size={0.045} kind="box" at={at(233.4)} />
    </AbsoluteFill>
  );
};

/** Grey moon rock sample on a lab tray. */
const RockSample: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={roundRect(420, 40, 12)} color="#c9ccd3" flat outline={5} />
    <Part shape={blob([[-130, 20], [-90, 110], [10, 140], [120, 90], [140, 20]], 8)} color="#8f8a84" shade={0.35} z={0.001} />
    {[[-60, 70], [40, 90], [80, 50]].map(([px, py], i) => (
      <Part key={i} shape={circle(10 + i * 3)} color="#6e6964" flat outline={3} x={px} y={py} z={0.002} />
    ))}
  </X>
);

// 235.96 "scientists decided the Moon was bone dry."
export const BoneDryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1.0, y: 150 };
  const a = atHead(cam, 0.14, 0.47, 1.75);
  const b = atHead(cam, 0.86, 0.47, 1.75);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <Office floor={-420}>
          <Part shape={roundRect(1500, 60, 14)} color="#8a5a32" shade={0.2} y={-200} z={-12} />
          <Part shape={roundRect(1420, 460, 10)} color="#7a4e2a" shade={0.2} y={-450} z={-12.1} />
          <X x={0} y={-170} s={1.7} z={-11}>
            <RockSample x={0} y={0} />
          </X>
          <Character {...SCIENTIST(0)} x={a.x} y={a.y} s={1.75} facing={1} look={0.6} expression={{ eyes: "squint", mouth: "flat", gaze: [0.7, -0.4], brows: -0.3 }} pose={poses.think} z={-13} />
          <Character {...SCIENTIST(2)} x={b.x} y={b.y} s={1.75} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "frown", gaze: [-0.7, -0.4], brows: 0.3 }} pose={poses.idle(frame, 2)} z={-13} />
        </Office>
      </Stage>
      <Label text="BONE DRY" x={0.62} y={0.2} size={0.09} kind="stamp" at={at(237.6)} />
    </AbsoluteFill>
  );
};

// 238.67 "For decades, that's what everyone believed."
export const DecadesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const year = Math.round(interpolate(t, [238.5, 241.0], [1972, 2008], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={380} view={{ lon: (t - 238) * 30, lat: 0 }} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text={`${year}`} x={0.5} y={0.1} size={0.08} kind="title" at={at(238.6)} />
      <Label text="DRY" x={0.62} y={0.72} size={0.09} kind="stamp" at={at(238.8)} />
    </AbsoluteFill>
  );
};

// 241.47 "Then, in 2008, India launches its first mission to the Moon,"
export const PslvShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const lift = ramp(t, 242.4, 245.7, Easing.in(Easing.quad)) * 900;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.74), y: 300 + lift * 0.4, shake: t > 242.4 ? 4 : 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <LaunchPadSet floor={-240} towerX={-560} towerH={2300} smoke={t > 242.2 ? 0.35 + 0.65 * ramp(t, 242.2, 243.6) : 0} glow={t > 242.2 ? 1 : 0}>
          <X x={0} y={-200 + lift} sx={1.35} z={-20}>
            <PSLV h={1300} thrust={t > 242.2 ? 1 : 0} />
          </X>
        </LaunchPadSet>
      </Stage>
      <Label text="2008" x={0.5} y={0.1} size={0.08} kind="title" at={at(242.1)} />
      <Label text="INDIA'S FIRST MOON MISSION" x={0.08} y={0.84} size={0.045} kind="box" at={at(244.2)} />
    </AbsoluteFill>
  );
};

// 245.87 "Chandrayaan-1."
export const Chandrayaan1Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <OrbitLow lon={20 + (t - 245) * 2}>
          <Chandrayaan1 x={-60 + (t - 245.7) * 40} y={140} s={1.0} rot={0.05} z={-5} />
        </OrbitLow>
      </Stage>
      <Label text="CHANDRAYAAN-1" x={0.5} y={0.1} size={0.07} kind="title" at={at(245.9)} />
    </AbsoluteFill>
  );
};

// 247.69 "On board is a NASA instrument that studies the Moon's surface."
export const NasaInstrumentShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.08);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <OrbitLow lon={30 + (t - 247) * 2}>
          <Chandrayaan1 x={0} y={360} s={1.1} beam={ramp(t, 249.4, 250.2)} z={-5} />
          <Ring r={80 + Math.sin(frame * 0.2) * 6} width={8} color="#ffd84a" x={0} y={360 - 140 * 1.1} z={-4} />
        </OrbitLow>
      </Stage>
      <Label text="NASA INSTRUMENT" x={sc(260, 140, zoom, 0, 40).x} y={sc(260, 140, zoom, 0, 40).y} size={0.045} kind="tag" pin at={at(248.4)} />
    </AbsoluteFill>
  );
};

// 251.43 "And in 2009, it finds signs of water."
export const SignsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={420} view={{ lon: (t - 251) * 6, lat: 0 }} water={ramp(t, 252.9, 254.0)} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="2009" x={0.5} y={0.1} size={0.08} kind="title" at={at(251.6)} />
      <Label text="SIGNS OF WATER" x={0.5} y={0.88} size={0.05} kind="title" color="#8fe3ff" at={at(253.5)} />
    </AbsoluteFill>
  );
};

// 254.85 "Not lakes or rivers."
export const NotLakesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.76), y: -280 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-20} sun={[-1500, 200]} seed={103} rocks={4} craters={2}>
          <Part shape={blob([[-560, -480], [-200, -440], [-80, -560], [-260, -700], [-640, -660]], 8)} color="#4ab0ff" flat outline={6} x={-300} z={-30} />
          <Line pts={[[260, -260], [420, -380], [340, -520], [560, -680], [760, -800]]} smooth width={60} color="#4ab0ff" z={-30} />
          <XMark x={-560} y={-560} size={380 * pop(t, 255.0)} color="#fe5649" z={-5} />
          <XMark x={520} y={-520} size={380 * pop(t, 255.5)} color="#fe5649" z={-5} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

/** Soil grains with tiny water molecules among them. */
const SoilCloseUp: React.FC<{ k: number; frame: number }> = ({ k, frame }) => (
  <X>
    <Part shape={roundRect(5000, 3000, 0)} color="#6a6560" flat outline={0} z={-0.02} />
    {Array.from({ length: 28 }, (_, i) => (
      <Part key={i} shape={ellipse(90 + (i % 5) * 18, 70 + (i % 3) * 12)} color={["#a8a39b", "#bdb8b0", "#948f88"][i % 3]} shade={0.35} x={-1300 + (i % 7) * 420 + (Math.floor(i / 7) % 2) * 180} y={-700 + Math.floor(i / 7) * 380} rot={i} z={-0.01 + i * 0.0001} />
    ))}
    {[-760, -320, 140, 580, 980, -540, 380].map((x, i) => (
      <X key={i} x={x} y={-500 + (i % 3) * 380 + 180} s={k * (0.4 + Math.sin(frame * 0.2 + i) * 0.04)} z={0.01}>
        <WaterMolecule size={40} />
      </X>
    ))}
  </X>
);

// 256.3 "Tiny amounts, locked in the soil, across much of the Moon."
export const TinyAmountsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SoilCloseUp k={ramp(t, 256.4, 257.2)} frame={frame} />
        <Magnifier x={-80} y={-260} r={180} s={1.4} rot={0.4} z={0.5} />
      </Stage>
      <Label text="TINY AMOUNTS" x={0.5} y={0.1} size={0.06} kind="title" at={at(256.5)} />
    </AbsoluteFill>
  );
};

// 260.55 "That same year, NASA tries something bold."
export const BoldShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={700} x={760} y={-560} view={{ lon: -40, lat: -60 }} z={-12} />
          <CentaurStage x={-420 + (t - 260.2) * 60} y={120} s={0.75} rot={-2.2} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="NASA · LCROSS" x={0.08} y={0.1} size={0.045} kind="box" at={at(261.6)} />
    </AbsoluteFill>
  );
};

// 263.11 "It takes a used rocket stage, weighing more than two tonnes."
export const UsedStageShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.9, 0.96);
  const sep = ramp(t, 263.4, 265.2, Easing.out(Easing.quad)) * 260;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <X rot={-Math.PI / 2 + 0.1} z={-5}>
            <CentaurStage sep={sep} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="USED ROCKET STAGE" x={sc(80, -260, zoom).x} y={sc(80, -260, zoom).y} size={0.045} kind="tag" pin at={at(263.8)} />
      <Label text="2+ TONNES" x={0.66} y={0.2} size={0.07} kind="title" at={at(265.3)} />
    </AbsoluteFill>
  );
};

// 266.31 "Then it crashes it into a dark crater near the south pole, called Cabeus."
export const CabeusShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = 70;
  const [cx, cy] = poleXY(LUNAR_SITES.cabeus[0], LUNAR_SITES.cabeus[1], ppd);
  const zoom = push(frame, dur, 1.0, 1.08);
  const k = ramp(t, 266.5, 268.6, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cx * 0.6, y: cy * 0.6 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarPoleMap ppd={ppd} w={3600} h={2400} psr={1} circles={[85]} seed={8}>
          <X x={cx} y={cy} z={-30}>
            <Ring r={130 + Math.sin(frame * 0.2) * 8} width={10} color="#fe5649" />
          </X>
          {k < 1 ? (
            <X x={interpolate(k, [0, 1], [cx + 900, cx])} y={interpolate(k, [0, 1], [cy + 700, cy])} rot={2.4} s={0.35 * (1 - k * 0.6)} z={-20}>
              <CentaurStage shepherd={false} />
            </X>
          ) : null}
          <X x={cx} y={cy} s={ramp(t, 268.6, 268.9) * (1 - ramp(t, 269.3, 270.3))} z={-19}>
            <Glow rx={260} color="#fff2c6" alpha={0.9} additive />
          </X>
          <X x={0} y={0} z={-30}>
            <Part shape={circle(16)} color="#fe5649" flat outline={4} />
          </X>
        </LunarPoleMap>
      </Stage>
      <Label text="CABEUS" x={sc(cx, cy - 170, zoom, cx * 0.6, cy * 0.6).x} y={sc(cx, cy - 170, zoom, cx * 0.6, cy * 0.6).y} size={0.05} kind="tag" pin at={at(269.5)} />
      <Label text="SOUTH POLE" x={sc(0, -50, zoom, cx * 0.6, cy * 0.6).x} y={sc(0, -50, zoom, cx * 0.6, cy * 0.6).y} size={0.04} kind="tag" pin at={at(268.5)} />
    </AbsoluteFill>
  );
};

// 270.57 "It hits as fast as a speeding bullet."
export const BulletShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 270.4, 271.7, Easing.in(Easing.quad));
  const hit = 271.7;
  const boom = ramp(t, hit, hit + 1.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 120, shake: hitAt(t, hit, 0.6) * 22 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={60} sun={[-1600, 120]} seed={105} rocks={4} craters={1}>
          <GroundCrater x={200} y={-380} r={700} sq={0.32} shadow={1} z={-30} />
          {boom < 0.02 ? (
            <X x={interpolate(k, [0, 1], [-1300, 200])} y={interpolate(k, [0, 1], [900, -380])} rot={2.3} s={0.5} z={-6}>
              <CentaurStage shepherd={false} />
            </X>
          ) : null}
          <Bullet x={interpolate(k, [0, 1], [-1300, 400]) + 300} y={interpolate(k, [0, 1], [900, -300]) + 200} rot={-0.65} s={1.0} z={-5} />
          <ImpactPlume t={boom} x={200} y={-380} size={1.2} z={-4} />
        </LunarSurface>
      </Stage>
      <Flash k={Math.max(0, 1 - Math.abs(t - hit) / 0.12) * 0.8} />
      <Label text="AS FAST AS A BULLET" x={0.5} y={0.1} size={0.05} kind="title" at={at(271.2)} />
    </AbsoluteFill>
  );
};

/** Small gold shepherding spacecraft with an instrument cone pointing down. */
const Shepherd: React.FC<{ x: number; y: number; s?: number; beam?: number; z?: number }> = ({ x, y, s = 1, beam = 0, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    {beam > 0 ? <Part shape={blob([[-20, -40], [20, -40], [160, -420], [-160, -420]], 4)} color="#7fd0ff" flat outline={0} opacity={0.25 * beam} z={-0.01} /> : null}
    <Part shape={roundRect(200, 110, 14)} color="#e2b13c" shade={0.3} />
    <Part shape={roundRect(70, 120, 6)} color="#24365f" flat outline={4} x={140} y={10} z={-0.001} />
    <Part shape={ellipse(40, 14)} color="#eef0f3" flat outline={4} x={-60} y={70} z={0.001} />
  </X>
);

// 272.68 "A second spacecraft flies through the cloud of dust it throws up, and studies it."
export const ShepherdShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const plume = interpolate(t, [272.4, 276.9], [0.3, 0.62]);
  const k = ramp(t, 272.5, 276.6, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: 200 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={-120} sun={[-1600, 0]} seed={107} rocks={4} craters={1}>
          <GroundCrater x={0} y={-500} r={700} sq={0.32} shadow={1} z={-30} />
          <ImpactPlume t={plume} x={0} y={-500} size={1.6} seed={6} z={-8} />
          <Shepherd x={interpolate(k, [0, 1], [-1300, 900])} y={interpolate(k, [0, 1], [900, 200])} s={0.8} beam={ramp(t, 275.6, 276.4)} z={-5} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 277.06 "The result?"
export const ResultShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Office floor={-420} night>
          <X y={60} z={-20}>
            <Monitor w={900} h={540} screen="#0e1a2c">
              <Line pts={Array.from({ length: 40 }, (_, i) => [-400 + i * 20, Math.sin(i * 0.7) * 30 - (i > 22 && i < 28 ? 120 : 0)] as [number, number])} width={8} color="#4ad28a" z={0.01} />
            </Monitor>
          </X>
          <QuestionMark x={560} y={300} s={0.9 * pop(t, 277.1)} z={-5} />
        </Office>
      </Stage>
    </AbsoluteFill>
  );
};

// 277.99 "The cloud has water in it."
export const CloudWaterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.75, 0.8), y: 160 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={-160} sun={[-1600, -40]} seed={107} rocks={3} craters={1}>
          <GroundCrater x={0} y={-500} r={700} sq={0.32} shadow={1} z={-30} />
          <ImpactPlume t={0.55} x={0} y={-500} size={1.6} seed={6} water={1} z={-8} />
        </LunarSurface>
      </Stage>
      <Label text="WATER!" x={0.64} y={0.2} size={0.09} kind="stamp" at={at(278.6)} />
    </AbsoluteFill>
  );
};

// 279.7 "Later studies say about 5 percent of the material was water."
export const FivePercentShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <Pie r={330} x={-240} slices={[[0.05, "#4ab0ff"], [0.95, "#a8a39b"]]} k={ramp(t, 279.8, 280.9)} pop={0} z={-5} />
          <WaterDrop x={460} y={60} s={1.4 * pop(t, 281.0)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="~5% WATER" x={0.72} y={0.82} size={0.07} kind="title" color="#8fe3ff" at={at(281.0)} />
    </AbsoluteFill>
  );
};

// 283.61 "Another NASA radar on Chandrayaan-1"
export const RadarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <OrbitLow lon={60} lat={70}>
          <Chandrayaan1 x={-40} y={340} s={1.05} beam={ramp(t, 283.9, 284.6)} beamColor="#4ad28a" z={-5} />
        </OrbitLow>
      </Stage>
      <Label text="NASA RADAR" x={0.08} y={0.1} size={0.045} kind="box" at={at(284.2)} />
    </AbsoluteFill>
  );
};

// 285.98 "finds ice in more than 40 small craters near the north pole."
export const IceCratersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.88) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarPoleMap pole="north" ppd={70} w={3600} h={2400} iceCraters={ramp(t, 286.3, 287.6)} circles={[85]} seed={12} field={200} />
      </Stage>
      <Label text="NORTH POLE" x={0.08} y={0.1} size={0.045} kind="box" at={at(288.9)} />
      <Label text="40+ CRATERS WITH ICE" x={0.5} y={0.86} size={0.05} kind="title" color="#8fe3ff" at={at(287.3)} />
    </AbsoluteFill>
  );
};

// 289.95 "At least 600 million tonnes of it."
export const SixHundredShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: 240 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-200} sun={[-1500, -100]} seed={109} rocks={3} craters={1}>
          <IceBlocks x={0} y={-640} s={ramp(t, 290.0, 290.9, Easing.out(Easing.back(1.3)))} z={-5} />
        </LunarSurface>
      </Stage>
      <Label text="600 MILLION TONNES" x={0.5} y={0.1} size={0.07} kind="title" color="#8fe3ff" at={at(290.5)} />
    </AbsoluteFill>
  );
};

// 292.94 "And in 2018,"
export const RecheckShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Chandrayaan1 x={0} y={0} s={1.2} rot={Math.sin(frame * 0.05) * 0.04} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="2018" x={0.5} y={0.12} size={0.1} kind="title" at={at(293.0)} />
    </AbsoluteFill>
  );
};

// 294.43 "scientists look at Chandrayaan-1's data again."
export const LookAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 1.0, y: 150 };
  const a = atHead(cam, 0.14, 0.5, 1.75);
  const b = atHead(cam, 0.86, 0.5, 1.75);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <Office floor={-420}>
          <X x={0} y={-262} z={-24}>
            <Part shape={roundRect(1380, 40, 10)} color="#8a6a4a" shade={0.2} />
            <Part shape={roundRect(1320, 400, 10)} color="#6e5236" shade={0.2} y={-220} z={-0.001} />
          </X>
          <X x={0} y={120} z={-22}>
            <Monitor w={900} h={540} screen="#0e1a2c">
              <MoonGlobe r={225} view={{ lon: 0, lat: -90 }} ice={ramp(t, 296.5, 298.2)} glow={0} craters={20} />
            </Monitor>
          </X>
          <Character {...SCIENTIST(4)} x={a.x} y={a.y} s={1.75} facing={1} look={0.5} expression={{ eyes: "squint", mouth: "flat", gaze: [0.6, 0.3], brows: -0.2 }} pose={poses.think} z={-10} />
          <Character {...SCIENTIST(5)} x={b.x} y={b.y} s={1.75} facing={-1} look={0.5} expression={{ eyes: t > 297.2 ? "wide" : "open", mouth: t > 297.2 ? "o" : "flat", gaze: [-0.6, 0.3], brows: t > 297.2 ? 0.6 : 0.1 }} pose={poses.point(frame)} z={-10} />
        </Office>
      </Stage>
    </AbsoluteFill>
  );
};

// 298.67 "They find the first direct proof of ice on the surface, inside the shadowed craters."
export const ProofShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarPoleMap ppd={52} w={3600} h={2400} psr={1} ice={ramp(t, 299.2, 300.6)} circles={[85, 80]} seed={5} />
      </Stage>
      <Label text="FIRST DIRECT PROOF OF ICE" x={0.5} y={0.1} size={0.055} kind="title" color="#8fe3ff" at={at(299.5)} />
      <Label text="SOUTH POLE" x={0.08} y={0.86} size={0.045} kind="box" at={at(301.9)} />
    </AbsoluteFill>
  );
};

// 303.68 "So some of the biggest clues about the Moon's water came from India's first Moon mission."
export const IndiaCluesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={560} x={520} y={-260} view={{ lon: 0, lat: -60 }} ice={1} water={0.6} z={-12} />
          <Chandrayaan1 x={-440} y={140} s={1.05} z={-6} />
          <NationFlag kind="india" x={-860} y={-540} w={260} pole={560} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="INDIA'S FIRST MOON MISSION" x={0.5} y={0.1} size={0.05} kind="title" at={at(306.4)} />
    </AbsoluteFill>
  );
};

// 308.62 "And this brings us to the rule of the new space race."
export const RuleTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <RuleBoard w={1400} h={720} glow={0.6} />
        </SpaceSet>
      </Stage>
      <Label text="THE RULE OF THE" x={0.5} y={0.36} size={0.06} kind="ink" pin at={at(309.4)} />
      <Label text="NEW SPACE RACE" x={0.5} y={0.52} size={0.08} kind="ink" color="#c8362f" pin at={at(310.0)} />
    </AbsoluteFill>
  );
};

// 311.49 "In space, water is worth more than gold."
export const WaterGoldShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const tilt = -ramp(t, 312.4, 313.4, Easing.out(Easing.back(1.6)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: -60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <BalanceScale y={-280} tilt={tilt} w={1200} left={<WaterDrop y={100} s={1.0} />} right={<GoldBars s={0.9} />} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="WATER" x={0.24} y={0.84} size={0.05} kind="box" color="#8fe3ff" at={at(312.4)} />
      <Label text="GOLD" x={0.76} y={0.84} size={0.05} kind="box" color="#f2c23a" at={at(313.3)} />
    </AbsoluteFill>
  );
};

// 314.4 "Remember it, because it explains everything that comes next."
export const RememberRuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <RuleBoard x={-260} w={1300} h={700} glow={0.5} />
          <Character {...YOU} x={830} y={-640} s={1.75} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile", brows: 0.15 }} pose={poses.point(frame)} z={-4} />
        </SpaceSet>
      </Stage>
      <Label text="IN SPACE," x={0.39} y={0.36} size={0.06} kind="ink" pin at={at(314.4)} />
      <Label text="WATER > GOLD" x={0.39} y={0.52} size={0.09} kind="ink" color="#2f6fd0" pin at={at(314.8)} />
    </AbsoluteFill>
  );
};

export { DepthStage, Glow };
