import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, circle, ellipse, poly, push, hitAt, absT, ramp, rng, QuestionMark, Magnifier, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MoonGlobe, LunarSurface, LunarPoleMap, GroundCrater, MoonBase, NationFlag, Vikram, ChangELander, NovaC, GasCanister, Tokamak, QuantumFridge, Harvester, Doc, Gavel, Globe, Banknote, GoldCoin, XMark,
  CrownProp, Ring, Orion,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { SpaceSet, ControlRoom, DescentScreen, Office, WaterDrop, Flash } from "./sets";
import { YOU, ASTRONAUT, TAIKONAUT, OFFICIAL } from "./cast";
import { atHead } from "./frame";

// Who owns the Moon (the 1967 treaty, bases and safe distances, "first come,
// first served"), the helium-3 fact check, and the twist: quantum computers.

const HE3 = "#ffd84a";

// 481.26 "So who owns the Moon?"
export const WhoOwnsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={400} x={-160} view={{ lon: (t - 480) * 10, lat: 0 }} z={-10} />
          <QuestionMark x={480} y={60} s={1.3 * pop(t, 481.8)} z={-5} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 482.9 "Legally, nobody."
export const NobodyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const swing = ramp(t, 483.3, 483.65, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40, shake: hitAt(t, 483.65, 0.35) * 14 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Part shape={roundRect(1300, 70, 16)} color="#7a4e2a" shade={0.2} y={-300} z={-8} />
          <X x={-60} y={-180} s={1.6} z={-5}>
            <Gavel swing={1 - swing} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="NOBODY" x={0.62} y={0.2} size={0.1} kind="stamp" at={at(483.7)} />
    </AbsoluteFill>
  );
};

// 484.68 "A treaty signed in 1967 says no country can claim the Moon or any part of it."
export const TreatyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1.0, y: 150 };
  const a = atHead(cam, 0.15, 0.47, 1.7);
  const b = atHead(cam, 0.85, 0.47, 1.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <Office floor={-420}>
          <Part shape={roundRect(1500, 60, 14)} color="#8a5a32" shade={0.2} y={-200} z={-12} />
          <Part shape={roundRect(1420, 460, 10)} color="#7a4e2a" shade={0.2} y={-450} z={-12.1} />
          <X x={0} y={60} rot={-0.04} s={1.3} z={-11}>
            <Doc w={340} lines={8} />
            {[-90, 0, 90].map((x, i) => (
              <Line key={i} pts={[[x - 40, -190], [x - 10, -170], [x + 10, -195], [x + 40, -175]]} smooth width={5} color="#2a3a8a" opacity={ramp(t, 485.3 + i * 0.3, 485.6 + i * 0.3)} z={0.002} />
            ))}
          </X>
          <Character {...OFFICIAL(0)} x={a.x} y={a.y} s={1.7} facing={1} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={poses.idle(frame, 0)} z={-13} />
          <Character {...OFFICIAL(2)} x={b.x} y={b.y} s={1.7} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={poses.idle(frame, 2)} z={-13} />
        </Office>
      </Stage>
      <Label text="OUTER SPACE TREATY · 1967" x={0.5} y={0.1} size={0.05} kind="title" at={at(485.5)} />
      <Label text="NO COUNTRY CAN CLAIM THE MOON" x={0.5} y={0.86} size={0.045} kind="box" at={at(487.9)} />
    </AbsoluteFill>
  );
};

/** Dashed safety-zone ring on the ground (squashed). */
const Zone: React.FC<{ x: number; y: number; r: number; k?: number; color?: string; z?: number }> = ({ x, y, r, k = 1, color = "#ffd84a", z = 0 }) => (
  <X x={x} y={y} sy={0.3} z={z}>
    {Array.from({ length: 36 }, (_, i) =>
      i % 2 || i / 36 > k ? null : (
        <Line
          key={i}
          pts={[
            [Math.cos((i / 36) * Math.PI * 2) * r, Math.sin((i / 36) * Math.PI * 2) * r],
            [Math.cos(((i + 1) / 36) * Math.PI * 2) * r, Math.sin(((i + 1) / 36) * Math.PI * 2) * r],
          ]}
          width={14}
          color={color}
        />
      ),
    )}
  </X>
);

// 489.87 "But a country can build a base,"
export const BuildBaseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: 160 }} light={{ dir: [-0.9, 0.3] }} vignette={0.55}>
        <LunarSurface horizon={-140} sun={[-1700, -40]} seed={171} rocks={4} craters={2}>
          <MoonBase x={0} y={-640} s={0.9 * ramp(t, 489.9, 490.8, Easing.out(Easing.back(1.3)))} lights={0.8} masts={3} flag="usa" z={-6} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 491.67 "and ask others to keep a safe distance."
export const SafeDistanceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 491.8, 492.8);
  const y = interpolate(t, [491.6, 493.4], [500, -560], { easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.45, 0.48), y: 200 }} light={{ dir: [-0.9, 0.3] }} vignette={0.55}>
        <LunarSurface horizon={-100} sun={[-2000, 0]} seed={173} rocks={4} craters={2} w={6000}>
          <MoonBase x={-500} y={-700} s={0.7} lights={0.8} masts={3} flag="usa" z={-6} />
          <Zone x={-500} y={-660} r={1300} k={k} z={-30} />
          <ChangELander x={1500} y={y - 140} s={0.6} thrust={t < 493.3 ? 0.6 : 0} z={-5} />
        </LunarSurface>
      </Stage>
      <Label text="SAFE DISTANCE" x={0.5} y={0.1} size={0.06} kind="title" color="#ffd84a" at={at(492.9)} />
    </AbsoluteFill>
  );
};

// 494.12 "And if the best spot is already taken, you can't exactly ask them to move."
export const TakenShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const walk = interpolate(t, [494.0, 495.6], [1500, 640], { extrapolateRight: "clamp" });
  const cam = { zoom: 0.8, y: 120 };
  const a = atHead(cam, 0.8, 0.5, 1.55);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.82), y: cam.y }} light={{ dir: [-0.9, 0.3] }} vignette={0.55}>
        <LunarSurface horizon={-100} sun={[-1900, 20]} seed={175} rocks={3} craters={1}>
          <GroundCrater x={-1300} y={-700} r={480} sq={0.3} shadow={1} ice={1} z={-30} />
          <MoonBase x={-330} y={-430} s={0.82} lights={0.8} masts={2} flag="usa" z={-6} />
          <Character {...TAIKONAUT(0)} x={walk} y={a.y} s={1.55} facing={-1} look={0.4} expression={t > 495.9 ? { eyes: "half", mouth: "wavy", brows: 0.5, sweat: true } : { eyes: "open", mouth: "smile", brows: 0.1 }} pose={t < 495.6 ? poses.walk(frame) : poses.shrug(t - 495.9)} z={-5} />
          <NationFlag kind="china" x={walk + 230} y={a.y} w={200} pole={460} z={-5.1} />
        </LunarSurface>
      </Stage>
      <Label text="TAKEN" x={0.3} y={0.2} size={0.08} kind="stamp" at={at(495.3)} />
    </AbsoluteFill>
  );
};

// 498.1 "So some experts worry this could turn into a race of 'first come, first served.'"
export const FirstComeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const flags: ["usa" | "china" | "russia" | "india", number, number][] = [
    ["usa", -2.5, 0.92],
    ["china", -0.7, 1.0],
    ["russia", 0.8, 0.8],
    ["india", 2.3, 0.86],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.95) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarPoleMap ppd={60} w={3600} h={2400} psr={1} ice={1} glowPeaks={1} seed={5}>
          <X z={-30}>
            <Ring r={200} width={12} color="#fe5649" />
          </X>
          {flags.map(([kind, a, sp], i) => {
            const k = ramp(t, 498.3, 498.3 + 3.6 / sp, Easing.inOut(Easing.quad));
            const d = interpolate(k, [0, 1], [1100, 150]);
            return <NationFlag key={kind} kind={kind} x={Math.cos(a) * d} y={Math.sin(a) * d - 100} w={140} pole={230} z={-20 + i * 0.01} />;
          })}
        </LunarPoleMap>
      </Stage>
      <Label text="FIRST COME," x={0.5} y={0.08} size={0.06} kind="title" at={at(501.1)} />
      <Label text="FIRST SERVED" x={0.5} y={0.88} size={0.06} kind="title" color="#fe5649" at={at(502.0)} />
    </AbsoluteFill>
  );
};

/** Helium-3 canister with a glow. */
const He3Can: React.FC<{ x?: number; y?: number; z?: number; s?: number; glow?: number }> = ({ x = 0, y = 0, z = 0, s = 1, glow = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} z={z} s={s}>
      <Glow rx={300} ry={360} y={180} color={HE3} alpha={0.3 * glow * (0.85 + 0.15 * Math.sin(frame * 0.15))} additive />
      <GasCanister color="#e0a83a" z={0.001} />
    </X>
  );
};

// 503.75 "Now, you might have heard that the real prize on the Moon is helium-3."
export const Helium3Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98), y: 60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={900} y={-1300} view={{ lon: 0, lat: 0 }} craters={60} z={-12} />
          <He3Can x={0} y={-460} s={1.4 * pop(t, 504.4)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="HELIUM-3" x={0.5} y={0.1} size={0.08} kind="title" color={HE3} at={at(506.8)} />
    </AbsoluteFill>
  );
};

// 508.14 "A rare gas that could power fusion reactors, worth trillions of dollars."
export const FusionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Tokamak x={-120} y={-60} s={1.1} plasma={ramp(t, 509.2, 509.9)} z={-8} />
          {t > 510.5
            ? Array.from({ length: 12 }, (_, i) => {
                const ph = ((t - 510.5) * 0.5 + i * 0.083) % 1;
                return i % 2 ? (
                  <Banknote key={i} x={-860 + i * 160} y={640 - ph * 1300} rot={ph * 5 + i} s={0.6} z={-5} />
                ) : (
                  <GoldCoin key={i} x={-860 + i * 160} y={640 - ph * 1300} rot={ph * 5} s={0.8} z={-5} />
                );
              })
            : null}
        </SpaceSet>
      </Stage>
      <Label text="FUSION POWER" x={0.08} y={0.1} size={0.045} kind="box" at={at(509.5)} />
      <Label text="$ TRILLIONS" x={0.5} y={0.86} size={0.07} kind="title" color={HE3} at={at(510.9)} />
    </AbsoluteFill>
  );
};

// 512.45 "Let's check that."
export const CheckShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <He3Can x={-120} y={-330} s={1.1} z={-6} />
          <Magnifier x={160} y={-200} r={170} s={1.3} rot={0.5} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="FACT CHECK" x={0.62} y={0.2} size={0.08} kind="stamp" at={at(512.6)} />
    </AbsoluteFill>
  );
};

/** Two bars (Moon vs Earth) with labels drawn by the shot. */
const CompareBars: React.FC<{ a: number; b: number; k: number }> = ({ a, b, k }) => (
  <X>
    <Part shape={roundRect(1500, 14, 6)} color="#c9ccd3" flat outline={0} y={-360} />
    <Part shape={roundRect(280, Math.max(10, a * k), 16)} color={HE3} shade={0.2} x={-330} y={-360 + (a * k) / 2} z={0.001} />
    <Part shape={roundRect(280, Math.max(10, b * k), 16)} color="#5a8ad2" shade={0.2} x={330} y={-360 + (b * k) / 2} z={0.001} />
  </X>
);

// 513.59 "Helium-3 is real, and the Moon has more of it than Earth."
export const RealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <CompareBars a={640} b={40} k={ramp(t, 515.4, 516.4, Easing.out(Easing.back(1.2)))} />
          <MoonGlobe r={110} x={-330} y={-500} craters={20} z={0.01} />
          <Globe r={110} x={330} y={-500} lon0={78} lat0={18} z={0.01} />
        </SpaceSet>
      </Stage>
      <Label text="REAL ✓" x={0.08} y={0.1} size={0.05} kind="box" color="#4ad28a" at={at(514.6)} />
      <Label text="MOON" x={0.33} y={0.95} size={0.04} kind="tag" pin at={at(515.3)} />
      <Label text="EARTH" x={0.67} y={0.95} size={0.04} kind="tag" pin at={at(515.3)} />
    </AbsoluteFill>
  );
};

/** Dusty soil close-up with a few glowing helium-3 specks. */
const DustySoil: React.FC<{ specks: number; frame: number }> = ({ specks, frame }) => {
  const r = rng(31);
  return (
    <X>
      <Part shape={roundRect(5000, 3000, 0)} color="#7a756e" flat outline={0} z={-0.02} />
      {Array.from({ length: 70 }, (_, i) => (
        <Part key={i} shape={circle(8 + r() * 20)} color={["#a8a39b", "#948f88", "#bdb8b0"][i % 3]} flat outline={3} x={(r() - 0.5) * 2200} y={(r() - 0.5) * 1300} z={-0.01 + i * 0.0001} />
      ))}
      {[[-520, 220], [380, -160], [760, 300], [-200, -340]].map(([x, y], i) => (
        <X key={`h${i}`} x={x} y={y} s={specks * (0.9 + 0.1 * Math.sin(frame * 0.2 + i))} z={0.01}>
          <Glow rx={60} color={HE3} alpha={0.8} additive />
          <Part shape={circle(11)} color={HE3} flat outline={3} z={0.001} />
        </X>
      ))}
    </X>
  );
};

// 516.74 "But it's spread thin in the dusty soil."
export const SpreadThinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <DustySoil specks={ramp(t, 517.0, 517.8)} frame={frame} />
      </Stage>
      <Label text="SPREAD THIN" x={0.5} y={0.1} size={0.06} kind="title" color={HE3} at={at(517.5)} />
    </AbsoluteFill>
  );
};

/** Big heap of moon dirt. */
const DirtHeap: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={poly([[-700, 0], [-420, 260], [-120, 420], [180, 400], [480, 230], [720, 0]])} color="#a8a39b" shade={0.3} />
    {[[-300, 120], [100, 260], [360, 100], [-80, 60]].map(([px, py], i) => (
      <Part key={i} shape={circle(26 + i * 6)} color="#8f8a84" flat outline={4} x={px} y={py} z={0.001} />
    ))}
  </X>
);

// 519.14 "You'd have to dig up and heat huge amounts of moon dirt to get a little."
export const DigShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.58), y: 160 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-60} sun={[-1600, 40]} seed={177} rocks={3} craters={1}>
          <DirtHeap x={-900} y={-700} s={1.3} z={-8} />
          <Harvester x={200} y={-700} s={1.2} heat={ramp(t, 520.0, 520.8)} z={-6} />
          <He3Can x={1150} y={-700} s={0.45 * pop(t, 521.6)} z={-5} />
        </LunarSurface>
      </Stage>
      <Label text="HUGE AMOUNTS" x={0.08} y={0.1} size={0.045} kind="box" at={at(520.3)} />
      <Label text="A LITTLE" x={0.82} y={0.42} size={0.045} kind="tag" pin at={at(521.7)} />
    </AbsoluteFill>
  );
};

// 522.38 "And the fusion power plants that could burn it? They don't exist yet."
export const NoPlantsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <Tokamak x={0} y={-40} s={1.1} plasma={0} z={-8} />
          <QuestionMark x={640} y={240} s={0.9 * pop(t, 524.4)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="NOT BUILT YET" x={0.62} y={0.8} size={0.08} kind="stamp" at={at(525.5)} />
    </AbsoluteFill>
  );
};

// 526.57 "Plus, helium-3 isn't mainly a south pole thing."
export const NotPoleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={420} view={{ lon: 0, lat: -30 }} he3={ramp(t, 527.0, 528.0)} z={-10} />
          <XMark x={0} y={-330} size={160 * pop(t, 529.3)} color="#fe5649" z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="HELIUM-3" x={0.08} y={0.1} size={0.045} kind="box" color={HE3} at={at(527.4)} />
      <Label text="NOT A POLE THING" x={0.5} y={0.88} size={0.05} kind="title" at={at(529.3)} />
    </AbsoluteFill>
  );
};

// 530.41 "It builds up in soil that gets hit by sunlight."
export const SunlitSoilShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const r = rng(41);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 180 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-200} sun={[-1300, 700]} seed={179} rocks={4} craters={2}>
          {Array.from({ length: 34 }, (_, i) => {
            const ph = (r() + frame * 0.015) % 1;
            const sx = -1300 + r() * 200;
            const tx = -900 + r() * 2200;
            return <Part key={i} shape={circle(8)} color={HE3} flat outline={2.5} x={sx + (tx - sx) * ph} y={700 + (-560 - 700) * ph} opacity={0.9} z={-6} />;
          })}
          {Array.from({ length: 16 }, (_, i) => (
            <Part key={`g${i}`} shape={circle(9)} color={HE3} flat outline={2.5} x={-900 + i * 140} y={-600 - (i % 3) * 40} opacity={ramp(t, 530.6 + i * 0.08, 531.0 + i * 0.08)} z={-5} />
          ))}
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 533.26 "The south pole's prize is still water."
export const PrizeWaterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={360} x={-460} view={{ lon: 0, lat: -90 }} ice={1} z={-10} />
          <WaterDrop x={420} y={-40} s={2.0} z={-6} />
          <CrownProp x={420} y={260} w={240} s={pop(t, 534.6)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="THE PRIZE: WATER" x={0.62} y={0.86} size={0.05} kind="title" color="#8fe3ff" at={at(534.7)} />
    </AbsoluteFill>
  );
};

// 536.01 "But there's a twist."
export const TwistShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6} bgBlur={8} bg={<ControlRoom floor={-700} screen={<DescentScreen k={1} upright={1} />} />}>
        <Character {...YOU} x={-200} y={-640} s={1.55} facing={1} look={0.3} expression={{ eyes: "wide", mouth: "smirk", brows: 0.3 }} pose={poses.point(frame)} z={-2} />
      </DepthStage>
      <Label text="A TWIST" x={0.62} y={0.2} size={0.08} kind="stamp" at={at(536.6)} />
    </AbsoluteFill>
  );
};

// 537.65 "Helium-3 might matter for a different reason."
export const DifferentReasonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 538.4, 539.8, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Tokamak x={-1000} y={-60} s={0.7} plasma={0} z={-8} />
          <XMark x={-1000} y={-60} size={300} color="#fe5649" z={-7} />
          <QuantumFridge x={1000} y={520} s={0.75} cold={k} z={-8} />
          <He3Can x={interpolate(k, [0, 1], [-560, 560])} y={-300 + Math.sin(k * Math.PI) * 220} s={0.9} z={-5} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 540.48 "Quantum computers need it to get extremely cold."
export const QuantumShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <QuantumFridge x={0} y={620} s={1.0} cold={ramp(t, 541.8, 542.8)} z={-8} />
        </SpaceSet>
      </Stage>
      <Label text="QUANTUM COMPUTER" x={0.08} y={0.1} size={0.045} kind="box" at={at(540.9)} />
      <Label text="EXTREMELY COLD" x={0.5} y={0.88} size={0.06} kind="title" color="#8fe3ff" at={at(542.2)} />
    </AbsoluteFill>
  );
};

// 543.68 "In 2025, the US government agreed to buy three liters of helium-3"
export const ContractShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1.0, y: 150 };
  const a = atHead(cam, 0.15, 0.47, 1.75);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.05), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <Office floor={-420}>
          <NationFlag kind="usa" x={880} y={-300} w={240} pole={900} z={-20} />
          <Part shape={roundRect(1500, 60, 14)} color="#8a5a32" shade={0.2} y={-200} z={-12} />
          <Part shape={roundRect(1420, 460, 10)} color="#7a4e2a" shade={0.2} y={-450} z={-12.1} />
          <X x={-120} y={60} rot={-0.05} s={1.2} z={-11}>
            <Doc w={340} lines={8} />
          </X>
          {[0, 1, 2].map((i) => (
            <He3Can key={i} x={300 + i * 180} y={-170} s={0.5 * pop(t, 546.4 + i * 0.12)} z={-10.9 + i * 0.01} />
          ))}
          <Character {...OFFICIAL(1)} x={a.x} y={a.y} s={1.75} facing={1} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={poses.idle(frame, 1)} z={-13} />
        </Office>
      </Stage>
      <Label text="2025" x={0.5} y={0.1} size={0.08} kind="title" at={at(543.8)} />
      <Label text="US GOVERNMENT" x={0.08} y={0.86} size={0.045} kind="box" at={at(545.0)} />
      <Label text="3 LITERS" x={0.7} y={0.36} size={0.06} kind="title" color={HE3} at={at(546.4)} />
    </AbsoluteFill>
  );
};

// 548.18 "from a company called Interlune."
export const InterluneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 160 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-160} sun={[-1600, 40]} seed={181} rocks={3} craters={2}>
          <Harvester x={0} y={-640} s={1.3} z={-6} />
        </LunarSurface>
      </Stage>
      <Label text="INTERLUNE" x={0.5} y={0.1} size={0.07} kind="title" at={at(548.9)} />
    </AbsoluteFill>
  );
};

// 550.05 "It's supposed to be harvested from the Moon and delivered by 2029."
export const DeliveryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 551.6, 553.6, Easing.inOut(Easing.quad));
  const path = (u: number): [number, number] => [380 - u * 1100, -40 + Math.sin(u * Math.PI) * 320];
  const [px, py] = path(k);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={240} x={640} y={-120} craters={30} he3={1} z={-12} />
          <Globe r={260} x={-780} y={-140} lon0={-95} lat0={30} z={-12} />
          <Line pts={Array.from({ length: 30 }, (_, i) => path((i / 29) * k))} width={6} color={HE3} opacity={0.5} z={-8} />
          <He3Can x={px} y={py - 80} s={0.35} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="BY 2029" x={0.5} y={0.86} size={0.07} kind="title" at={at(552.6)} />
    </AbsoluteFill>
  );
};

// 553.88 "The company says it sells for about 20 million dollars a kilo."
export const PriceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <He3Can x={-380} y={-360} s={1.2} z={-6} />
          <X x={300} y={60} rot={-0.12} s={pop(t, 555.3)} z={-5}>
            <Part shape={roundRect(640, 260, 26)} color="#f6f0de" shade={0.2} />
            <Part shape={circle(22)} color="#3a3a44" flat outline={0} x={-270} z={0.001} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="$20 MILLION / KG" x={0.66} y={0.44} size={0.06} kind="ink" color="#2a8a4a" pin at={at(555.5)} />
    </AbsoluteFill>
  );
};

// 557.3 "So helium-3 may not power the world."
export const NotWorldShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Globe r={400} x={-120} y={0} lon0={-40 + frame * 0.4} lat0={20} z={-10} />
          <He3Can x={520} y={-330} s={0.9} glow={0.4} z={-6} />
          <XMark x={600} y={-60} size={300 * pop(t, 558.8)} color="#fe5649" z={-5} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 560.07 "But it might help power the next generation of computers."
export const ComputersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.5, 0.54), y: 80 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          {[-1200, -400, 400, 1200].map((x, i) => (
            <QuantumFridge key={x} x={x} y={620} s={0.8} cold={ramp(t, 560.4 + i * 0.25, 561.0 + i * 0.25)} z={-8 + i * 0.01} />
          ))}
        </SpaceSet>
      </Stage>
      <Label text="NEXT-GEN COMPUTERS" x={0.5} y={0.88} size={0.06} kind="title" color="#8fe3ff" at={at(561.6)} />
    </AbsoluteFill>
  );
};

export { Vikram, NovaC, ASTRONAUT, Orion, ellipse, Flash, useScr };
