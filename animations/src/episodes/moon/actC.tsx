import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, roundRect, circle, ellipse, push, absT, ramp, rng, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MoonGlobe, LunarSurface, GroundCrater, CraterSection, IceFlake, WaterMolecule, Comet, ImpactPlume, Globe, Thermometer, Calendar, Clock, MetalLump, XMark, Ring,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { SpaceSet, Pluto, AxisLine, Flash } from "./sets";
import { ASTRONAUT } from "./cast";

// Why the poles hold ice: the Moon's tiny tilt, the low Sun, craters that
// never see sunlight, cold traps, and where the water comes from.

const ICE = "#8fe3ff";

/** Low-sun crater cross-section framed for the cold-trap shots. */
const Trap: React.FC<{ ice?: number; rays?: number; sunX?: number; peaks?: number }> = ({ ice = 0, rays = 0, sunX = -1750, peaks = 0 }) => (
  <CraterSection y={-120} sun={[sunX, 40]} rays={rays} ice={ice} peaks={peaks} z={-10} />
);

// 158.29 "But the metal isn't why countries are racing here."
export const NotMetalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <X x={-320} y={0} z={-10}>
            <Glow rx={420} ry={280} color="#ffb04a" alpha={0.3} additive />
            <MetalLump w={620} h={340} z={0.001} />
          </X>
          <XMark x={-320} y={0} size={420 * pop(t, 159.1)} color="#fe5649" z={-5} />
          <MoonGlobe r={220} x={560} y={-120} view={{ lon: 0, lat: -70 }} pins={[{ lon: 0, lat: -90, r: 18 }]} z={-9} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 161.37 "The real reason is hiding in the shadows."
export const ShadowsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const glint = ramp(t, 162.9, 163.5) * (0.7 + 0.3 * Math.sin(frame * 0.3));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 1.0), y: -200 }} light={{ dir: [-0.9, 0.2] }} vignette={0.8}>
        <LunarSurface horizon={160} sun={[-1800, 180]} seed={61} rocks={9} craters={1}>
          <GroundCrater x={60} y={-300} r={820} sq={0.34} shadow={1} z={-30} />
          {[-200, 40, 230].map((x, i) => (
            <X key={x} x={x} y={-300 + (i - 1) * 40} s={0.6 + glint * 0.4} z={-29}>
              <Glow rx={60} color={ICE} alpha={0.6 * glint} additive />
              <IceFlake size={14} />
            </X>
          ))}
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 164.66 "Earth is tilted, which is why we have seasons."
export const EarthTiltShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const tilt = 0.41 * ramp(t, 164.6, 165.4, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.9, 0.2] }} vignette={0.55}>
        <SpaceSet>
          <X x={-1100} y={0} z={-15}>
            <Glow rx={600} color="#ffd27a" alpha={0.5} additive />
            <Part shape={circle(220)} color="#ffd84a" flat outline={6} />
          </X>
          <X x={260} rot={-tilt} z={-10}>
            <Globe r={330} lon0={-30 + frame * 0.6} lat0={20} />
          </X>
          <AxisLine x={260} tilt={-tilt} len={960} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="23.5° TILT" x={0.62} y={0.1} size={0.05} kind="title" at={at(165.3)} />
      <Label text="SEASONS" x={0.62} y={0.86} size={0.045} kind="box" at={at(166.4)} />
    </AbsoluteFill>
  );
};

// 167.44 "But the Moon is hardly tilted at all. Just about one and a half degrees."
export const MoonTiltShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const tilt = 0.026;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03) }} light={{ dir: [-0.9, 0.2] }} vignette={0.55}>
        <SpaceSet>
          <X x={-1100} y={0} z={-15}>
            <Glow rx={600} color="#ffd27a" alpha={0.5} additive />
            <Part shape={circle(220)} color="#ffd84a" flat outline={6} />
          </X>
          <X x={260} rot={-tilt} z={-10}>
            <MoonGlobe r={330} view={{ lon: frame * 0.6, lat: 0 }} sunDir={[-0.95, 0.15]} />
          </X>
          <AxisLine x={260} tilt={-tilt} len={960} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="1.5°" x={0.62} y={0.1} size={0.08} kind="title" at={at(170.2)} />
    </AbsoluteFill>
  );
};

/** Astronaut standing on the surface with a long shadow away from a low Sun on the left. */
const StandingAstronaut: React.FC<{ x: number; y: number; s?: number; frame: number; pose?: ReturnType<typeof poses.idle>; expression?: React.ComponentProps<typeof Character>["expression"]; z?: number }> = ({ x, y, s = 1, frame, pose, expression, z = -6 }) => (
  <>
    <Part shape={ellipse(900 * s, 50 * s)} color="#1c1a26" flat outline={0} opacity={0.5} x={x + 900 * s} y={y + 6} z={z - 0.5} />
    <Character {...ASTRONAUT(0)} x={x} y={y} s={s} facing={-1} look={0.5} expression={expression ?? { eyes: "open", mouth: "smile", gaze: [-0.6, 0.2] }} pose={pose ?? poses.idle(frame, 2)} z={z} />
  </>
);

// 171.68 "So at the Moon's poles, the Sun never climbs high in the sky."
export const LowSunShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 172.8, 175.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.74, 0.78), y: 60 }} light={{ dir: [-0.95, 0.15] }} vignette={0.55}>
        <LunarSurface horizon={-60} sun={[-900, 60]} seed={71} rocks={6} craters={3}>
          <Line pts={Array.from({ length: 20 }, (_, i) => [-1500 + i * 160 * k, 70 + Math.sin((i / 19) * Math.PI) * 60] as [number, number])} width={8} color="#ffd84a" opacity={0.7} z={-30} />
          <StandingAstronaut x={300} y={-560} s={1.35} frame={frame} />
        </LunarSurface>
      </Stage>
      <Label text="MOON'S POLES" x={0.08} y={0.1} size={0.045} kind="box" at={at(172.3)} />
      <Label text="SUN STAYS LOW" x={0.62} y={0.1} size={0.05} kind="title" at={at(174.0)} />
    </AbsoluteFill>
  );
};

// 175.44 "It just slides along the horizon."
export const SlidesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sx = interpolate(t, [175.3, 177.9], [-1400, 1300]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: 100 }} light={{ dir: [sx < 0 ? -0.95 : 0.95, 0.15] }} vignette={0.55}>
        <LunarSurface horizon={-40} sun={[sx, 70]} seed={73} rocks={7} craters={3}>
          <Line pts={[[-1600, 260], [1600, 260]]} width={8} color="#ffd84a" opacity={0.45} z={-30} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 178.06 "That means the bottoms of some deep craters never get any sunlight at all."
export const NeverSunShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.5, 0.55), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <Trap rays={ramp(t, 178.3, 179.4)} />
        </SpaceSet>
      </Stage>
      <Label text="NEVER ANY SUNLIGHT" x={0.5} y={0.86} size={0.05} kind="title" at={at(180.5)} />
    </AbsoluteFill>
  );
};

// 182.53 "Not for a day."
export const NotDayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <X s={1.8} y={20} rot={-0.04} z={-5}>
            <Calendar crossed={Math.min(21, Math.floor(frame / 2))} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="NOT FOR A DAY" x={0.5} y={0.86} size={0.06} kind="title" at={at(182.6)} />
    </AbsoluteFill>
  );
};

// 183.69 "Not for a year."
export const NotYearShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          {Array.from({ length: 6 }, (_, i) => (
            <X key={i} x={-620 + i * 250} y={((frame * 6 + i * 40) % 160) - 40} s={0.9} rot={-0.15 + i * 0.06} z={-5 + i * 0.01}>
              <Calendar crossed={21} />
            </X>
          ))}
        </SpaceSet>
      </Stage>
      <Label text="NOT FOR A YEAR" x={0.5} y={0.86} size={0.06} kind="title" at={at(183.7)} />
    </AbsoluteFill>
  );
};

// 184.81 "Some of them haven't seen the Sun in billions of years."
export const BillionsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.92), y: -160, rot: frame * 0.0006 }} light={{ dir: [-0.9, 0.2] }} vignette={0.75}>
        <LunarSurface horizon={140} sun={null} seed={81} rocks={8} craters={1} stars={160}>
          <GroundCrater x={0} y={-320} r={860} sq={0.33} shadow={1} z={-30} />
          <X x={760} y={420} s={0.8} z={-30}>
            <Clock r={110} speed={30} />
          </X>
        </LunarSurface>
      </Stage>
      <Label text="BILLIONS OF YEARS" x={0.5} y={0.1} size={0.06} kind="title" at={at(186.5)} />
    </AbsoluteFill>
  );
};

/** Thermometer with frost creeping in. */
const ColdGauge: React.FC<{ level: number; frost: number; x?: number; y?: number; s?: number }> = ({ level, frost, x = 0, y = 0, s = 1 }) => {
  const r = rng(5);
  return (
    <X x={x} y={y} s={s}>
      <Thermometer h={560} level={level} />
      {Array.from({ length: 10 }, (_, i) => (
        <X key={i} x={(r() - 0.5) * 520} y={(r() - 0.5) * 700} s={Math.min(1, frost * 1.6 - i * 0.08)} rot={i} z={0.01}>
          {frost * 1.6 - i * 0.08 > 0 ? <IceFlake size={22 + r() * 16} /> : null}
        </X>
      ))}
    </X>
  );
};

// 188.25 "And without sunlight, they get cold."
export const GetColdShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 188.3, 190.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <Part shape={circle(900)} color="#1c2a48" flat outline={0} opacity={0.4 * k} z={-20} />
          <ColdGauge level={interpolate(k, [0, 1], [0.55, 0.22])} frost={k} y={20} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 190.47 "Unbelievably cold."
export const UnbelievablyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const shiver = Math.sin(frame * 2.4) * 6;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -220 }} light={{ dir: [-0.9, 0.3] }} vignette={0.65}>
        <LunarSurface horizon={-40} sun={null} seed={83} rocks={5} craters={2}>
          <X x={shiver} z={-6}>
            <Character {...ASTRONAUT(1)} x={0} y={-560} s={1.35} facing={1} look={0.2} expression={{ eyes: "wide", mouth: "wavy", brows: 0.7 }} pose={poses.scared(frame)} />
          </X>
          {Array.from({ length: 8 }, (_, i) => (
            <X key={i} x={-600 + i * 170} y={300 + ((frame * 4 + i * 90) % 900) * -1 + 300} rot={frame * 0.05 + i} s={0.9} z={-5}>
              <IceFlake size={20} />
            </X>
          ))}
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 192.25 "Some of these craters drop below minus 230 degrees Celsius."
export const MinusShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 192.6, 194.4, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <Part shape={circle(900)} color="#1c2a48" flat outline={0} opacity={0.5} z={-20} />
          <ColdGauge level={interpolate(k, [0, 1], [0.22, 0.03])} frost={1} x={-420} y={20} />
        </SpaceSet>
      </Stage>
      <Label text="−230 °C" x={0.66} y={0.45} size={0.12} kind="title" color="#8fe3ff" at={at(194.0)} />
    </AbsoluteFill>
  );
};

// 195.78 "That's colder than the surface of Pluto."
export const PlutoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Pluto x={-460} y={40} r={250} z={-10} />
          <X x={460} y={40} z={-10}>
            <Part shape={circle(250)} color="#1c2036" flat outline={7} />
            <Glow rx={300} color={ICE} alpha={0.35 * ramp(t, 196.2, 196.8)} additive z={0.001} />
            {[-90, 0, 80, -30, 60].map((x, i) => (
              <IceFlake key={i} x={x} y={((i * 53) % 140) - 70} size={18} z={0.002} />
            ))}
          </X>
        </SpaceSet>
      </Stage>
      <Label text="PLUTO" x={0.26} y={0.82} size={0.05} kind="box" at={at(197.0)} />
      <Label text="MOON CRATER" x={0.74} y={0.82} size={0.05} kind="box" at={at(195.9)} />
      <Label text="COLDER" x={0.74} y={0.2} size={0.06} kind="title" color="#8fe3ff" at={at(196.1)} />
    </AbsoluteFill>
  );
};

// 198.04 "Scientists call them cold traps."
export const ColdTrapsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.6), y: -60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <Trap />
        </SpaceSet>
      </Stage>
      <Label text="COLD TRAPS" x={0.5} y={0.14} size={0.08} kind="title" color="#8fe3ff" at={at(199.1)} />
    </AbsoluteFill>
  );
};

// 200.34 "Because anything that falls in, stays in."
export const StaysInShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const drops = [0, 1, 2].map((i) => {
    const k = ramp(t, 200.5 + i * 0.35, 201.6 + i * 0.35, Easing.in(Easing.quad));
    return { x: -200 + i * 200, y: interpolate(k, [0, 1], [700, -640 + (i % 2) * 30]), k };
  });
  const freeze = ramp(t, 202.0, 202.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.6), y: -80 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <Trap ice={freeze * 0.6} />
          {drops.map((d, i) => (
            <X key={i} x={d.x} y={d.y} z={-5}>
              {freeze < 0.5 ? <WaterMolecule size={34} /> : <IceFlake size={36} />}
            </X>
          ))}
        </SpaceSet>
      </Stage>
      <Label text="STAYS IN" x={0.5} y={0.14} size={0.07} kind="title" at={at(202.1)} />
    </AbsoluteFill>
  );
};

// 203.52 "And over billions of years, a lot has fallen in."
export const FallenInShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.6), y: -60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <Trap ice={ramp(t, 203.6, 206.2)} />
          <X x={760} y={500} z={-5}>
            <Clock r={120} speed={40} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="BILLIONS OF YEARS" x={0.08} y={0.1} size={0.045} kind="box" at={at(203.9)} />
    </AbsoluteFill>
  );
};

// 206.56 "Comets and asteroids crash into the Moon, bringing water with them."
export const CometsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const hit = 207.9;
  const k = ramp(t, 206.3, hit, Easing.in(Easing.quad));
  const boom = ramp(t, hit, hit + 2.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 160, shake: Math.max(0, 1 - Math.abs(t - hit) / 0.5) * 16 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-80} sun={[-1500, 60]} seed={91} rocks={5} craters={3}>
          {boom < 0.02 ? <Comet x={interpolate(k, [0, 1], [-1200, 100])} y={interpolate(k, [0, 1], [1100, -360])} size={90} tail={900} rot={2.1} z={-5} /> : null}
          <ImpactPlume t={boom} x={100} y={-380} size={1.1} water={1} z={-4} />
        </LunarSurface>
      </Stage>
      <Flash k={Math.max(0, 1 - Math.abs(t - hit) / 0.14) * 0.7} />
      <Label text="COMETS & ASTEROIDS" x={0.08} y={0.1} size={0.045} kind="box" at={at(206.8)} />
    </AbsoluteFill>
  );
};

/** Stream of small particles flowing along +x from x0 to x1 (looping). */
const Particles: React.FC<{ x0: number; x1: number; y: number; h: number; n?: number; color?: string; speed?: number; seed?: number; z?: number }> = ({ x0, x1, y, h, n = 40, color = "#ffe27a", speed = 1, seed = 3, z = 0 }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <X z={z}>
      {Array.from({ length: n }, (_, i) => {
        const ph = (r() + frame * 0.012 * speed) % 1;
        const yy = y + (r() - 0.5) * h;
        return <Part key={i} shape={circle(7 + r() * 5)} color={color} flat outline={2.5} x={x0 + (x1 - x0) * ph} y={yy} />;
      })}
    </X>
  );
};

// 210.29 "The Sun also blasts the Moon with tiny particles."
export const SolarWindShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.9, 0.2] }} vignette={0.55}>
        <SpaceSet>
          <X x={-1050} y={0} z={-15}>
            <Glow rx={700} color="#ffd27a" alpha={0.6} additive />
            <Part shape={circle(380)} color="#ffd84a" flat outline={6} />
          </X>
          <Particles x0={-660} x1={420} y={0} h={600} n={60} speed={1.6} z={-12} />
          <MoonGlobe r={300} x={620} y={0} view={{ lon: 20, lat: 0 }} sunDir={[-0.95, 0.1]} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="TINY PARTICLES" x={0.5} y={0.86} size={0.05} kind="title" at={at(211.9)} />
    </AbsoluteFill>
  );
};

// 213.11 "Some of them help make water in the soil."
export const SoilWaterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const r = rng(12);
  const grains = Array.from({ length: 14 }, (_, i) => [-900 + (i % 7) * 300 + r() * 80, -300 - Math.floor(i / 7) * 260 + r() * 60, 110 + r() * 60] as [number, number, number]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: -120 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <Part shape={roundRect(4000, 1400, 0)} color="#6a6560" flat outline={0} y={-700} z={-15} />
          {grains.map(([x, y, s], i) => (
            <Part key={i} shape={ellipse(s, s * 0.8)} color={["#a8a39b", "#bdb8b0", "#948f88"][i % 3]} shade={0.35} x={x} y={y} rot={i} z={-12 + i * 0.01} />
          ))}
          <Particles x0={-1200} x1={600} y={420} h={300} n={26} speed={1.4} seed={7} z={-11} />
          {[-520, -40, 420].map((x, i) => (
            <X key={x} x={x} y={-130 + (i % 2) * 40} s={pop(t, 213.7 + i * 0.35) * 0.9} z={-5}>
              <WaterMolecule size={46} />
            </X>
          ))}
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

/** Earth's magnetic field lines: compressed on the Sun side (left), long tail to the right. */
const Magnetosphere: React.FC<{ r?: number; k?: number }> = ({ r = 200, k = 1 }) => (
  <X>
    {[1.8, 2.6, 3.6, 4.8].map((L, j) => {
      const pts: [number, number][] = [];
      for (let i = 0; i <= 60; i++) {
        const th = (i / 60) * Math.PI;
        const rr = L * r * Math.sin(th) ** 2;
        pts.push([rr * Math.sin(th), rr * Math.cos(th)]);
      }
      const day = pts.map(([x, y]) => [-x * 0.7, y] as [number, number]);
      const tail = pts.map(([x, y]) => [x * (1.6 + j * 0.9), y * (j > 1 ? 0.75 : 1)] as [number, number]);
      return (
        <React.Fragment key={L}>
          <Line pts={day} smooth width={7} color="#9ad8ff" opacity={0.6 * k} />
          <Line pts={tail} smooth width={7} color="#9ad8ff" opacity={0.6 * k} />
        </React.Fragment>
      );
    })}
  </X>
);

// 215.32 "A 2023 study even suggests that Earth itself may be helping,"
export const EarthHelpsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.75), x: 300 }} light={{ dir: [-0.9, 0.2] }} vignette={0.55}>
        <SpaceSet>
          <Globe r={200} x={-500} y={0} lon0={-40 + frame * 0.5} lat0={10} z={-10} />
          <X x={-500} z={-11}>
            <Magnetosphere r={200} k={ramp(t, 216.4, 217.6)} />
          </X>
          <MoonGlobe r={110} x={interpolate(t, [215, 219.2], [900, 1220])} y={-60} view={{ lon: 0, lat: 0 }} sunDir={[-0.95, 0.1]} z={-9} />
        </SpaceSet>
      </Stage>
      <Label text="2023 STUDY" x={0.08} y={0.1} size={0.045} kind="box" at={at(215.5)} />
      <Label text="EARTH" x={0.26} y={0.72} size={0.045} kind="tag" pin at={at(217.6)} />
    </AbsoluteFill>
  );
};

// 219.29 "with particles from our planet's magnetic field."
export const MagnetoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.9, 0.2] }} vignette={0.55}>
        <SpaceSet>
          {[-180, -60, 60, 180].map((y) => (
            <Line key={y} pts={[[-1400, y * 1.4], [1400, y * 0.9]]} width={8} color="#9ad8ff" opacity={0.45} z={-12} />
          ))}
          <Particles x0={-1100} x1={160} y={0} h={520} n={50} color="#b48aff" speed={1.3} seed={9} z={-11} />
          <MoonGlobe r={300} x={420} y={0} view={{ lon: 160, lat: 0 }} sunDir={[-0.95, 0.1]} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="MAGNETIC FIELD" x={0.5} y={0.88} size={0.05} kind="title" at={at(220.6)} />
    </AbsoluteFill>
  );
};

/** Water molecule hopping across the ground in arcs (k 0..1 over `hops`). */
const hopPos = (k: number, pts: [number, number][], h = 260): [number, number] => {
  const n = pts.length - 1;
  const u = Math.min(n - 1e-6, Math.max(0, k * n));
  const i = Math.floor(u);
  const f = u - i;
  const [ax, ay] = pts[i];
  const [bx, by] = pts[i + 1];
  return [ax + (bx - ax) * f, ay + (by - ay) * f + Math.sin(f * Math.PI) * h];
};

// 222.04 "Most of this water quickly escapes into space."
export const EscapesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 200 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-260} sun={[-1500, -200]} seed={95} rocks={6} craters={3}>
          {Array.from({ length: 7 }, (_, i) => {
            const k = ramp(t, 222.0 + i * 0.25, 224.6 + i * 0.1, Easing.in(Easing.quad));
            return (
              <X key={i} x={-900 + i * 300 + k * (i - 3) * 60} y={-420 + k * 1500} s={0.9 - k * 0.4} rot={k * 3} z={-5}>
                <WaterMolecule size={36} />
              </X>
            );
          })}
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 224.81 "But some of it bounces around the Moon until it lands in a cold trap."
export const HopsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pts: [number, number][] = [[-1200, -360], [-760, -400], [-300, -380], [180, -420], [620, -520]];
  const k = ramp(t, 225.3, 227.6, Easing.inOut(Easing.quad));
  const [x, y] = hopPos(k, pts);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 120 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={-40} sun={[-1600, 30]} seed={97} rocks={4} craters={1}>
          <GroundCrater x={640} y={-520} r={420} sq={0.32} shadow={1} z={-30} />
          <Line pts={Array.from({ length: 40 }, (_, i) => hopPos((i / 39) * k, pts))} width={6} color="#8fe3ff" opacity={0.5} z={-6} />
          <X x={x} y={y + 40} rot={k * 12} z={-5}>
            <WaterMolecule size={40} />
          </X>
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 228.44 "And there, it freezes. Maybe forever."
export const FreezesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const f = ramp(t, 229.2, 229.8, Easing.out(Easing.back(1.5)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12) }} light={{ dir: [-0.6, 0.7] }} vignette={0.75}>
        <Part shape={roundRect(6000, 4000, 0)} color="#0c1020" flat outline={0} z={-20} />
        <Glow rx={420 * f + 1} color={ICE} alpha={0.45 * f} additive z={-6} />
        {f < 0.5 ? <WaterMolecule size={80} z={-5} /> : <IceFlake size={150 * f} z={-5} />}
        <Ring r={260 + Math.sin(frame * 0.1) * 10} width={6} color={ICE} opacity={0.4 * f} z={-5.5} />
      </Stage>
      <Label text="MAYBE FOREVER" x={0.5} y={0.86} size={0.06} kind="title" color="#8fe3ff" at={at(230.4)} />
    </AbsoluteFill>
  );
};

export { MetalLump, useScr };
