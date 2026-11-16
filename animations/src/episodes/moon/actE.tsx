import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, circle, ellipse, blob, poly, push, hitAt, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MoonGlobe, LunarSurface, LunarPoleMap, poleXY, LUNAR_SITES, GroundCrater, CraterSection, MoonRock, Vikram, Luna25, NovaC, Fireball, ImpactPlume, LandingDust, WaterMolecule, GasCanister, SLS, Starship,
  FuelPump, MoonBase, SolarMast, Globe, Banknote, Ring, Orion, IceFlake,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { SpaceSet, ControlRoom, DescentScreen, WaterDrop, Flash } from "./sets";
import { YOU, ASTRONAUT } from "./cast";

// Why water is the prize (drink, breathe, rocket fuel, a gas station in low
// gravity), the peaks of (almost) eternal light, and why landing at the
// south pole is so hard: Luna-25, Odysseus, Athena — and Vikram upright.

/** Plastic water bottle. Origin = bottom centre. */
const Bottle: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={roundRect(170, 420, 50)} color="#9ad8ff" shade={0.25} y={210} />
    <Part shape={roundRect(172, 120, 0)} color="#2f6fd0" flat outline={5} y={200} z={0.001} />
    <Part shape={roundRect(70, 60, 16)} color="#2f6fd0" flat outline={5} y={450} z={0.001} />
    <Part shape={roundRect(30, 300, 15)} color="#ffffff" flat outline={0} opacity={0.5} x={-50} y={230} z={0.002} />
  </X>
);

// 318.1 "Why is water so valuable?"
export const WhyValuableShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <WaterDrop x={-220} y={20} s={2.2 * pop(t, 318.2)} z={-6} />
          <QuestionMark x={330} y={60} s={1.2 * pop(t, 318.8)} z={-5} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 319.81 "Because sending anything from Earth to the Moon is expensive."
export const ExpensiveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 319.9, 322.9, Easing.inOut(Easing.quad));
  const path = (u: number): [number, number] => [-560 + u * 1150, -60 + Math.sin(u * Math.PI) * 330];
  const [px, py] = path(k);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Globe r={300} x={-780} y={-160} lon0={78} lat0={18} z={-12} />
          <MoonGlobe r={190} x={760} y={-80} craters={30} z={-12} />
          <X x={px} y={py} rot={-1.2 + k * 2.2} s={0.32} z={-5}>
            <SLS h={900} thrust={0.6} />
          </X>
          {Array.from({ length: 7 }, (_, i) => {
            const u = Math.max(0, k - 0.06 - i * 0.05);
            const [bx, by] = path(u);
            return u > 0 ? <Banknote key={i} x={bx} y={by - 40 - (i % 2) * 60} s={0.5} rot={frame * 0.05 + i} z={-6} /> : null;
          })}
        </SpaceSet>
      </Stage>
      <Label text="EXPENSIVE" x={0.5} y={0.86} size={0.06} kind="title" color="#f2c23a" at={at(322.1)} />
    </AbsoluteFill>
  );
};

// 323.18 "Every bottle of water you carry costs a fortune."
export const BottleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <Bottle x={-160} y={-260} s={1.15} z={-6} />
          <X x={240} y={140} rot={-0.2} s={pop(t, 324.6)} z={-5}>
            <Part shape={roundRect(360, 170, 20)} color="#f6f0de" shade={0.2} />
            <Part shape={circle(16)} color="#3a3a44" flat outline={0} x={-150} z={0.001} />
            <Line pts={[[-150, 0], [-330, 60]]} width={5} color="#3a3a44" z={-0.001} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="$$$$$" x={0.6} y={0.38} size={0.07} kind="ink" color="#2a8a4a" pin at={at(324.7)} />
    </AbsoluteFill>
  );
};

// 326.0 "But if you can find water on the Moon, you can drink it."
export const DrinkShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 326.6, 327.6, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: -100 }} light={{ dir: [-0.9, 0.3] }} vignette={0.55}>
        <LunarSurface horizon={120} sun={[-1600, 200]} seed={111} rocks={4} craters={1}>
          <GroundCrater x={-380} y={-480} r={560} sq={0.32} shadow={1} ice={1} z={-30} />
          <WaterDrop x={-380} y={-420 + rise * 280} s={0.9 * rise} z={-6} />
          <Character {...ASTRONAUT(0)} x={440} y={-600} s={1.7} facing={-1} look={0.4} expression={{ eyes: "happy", mouth: "grin", gaze: [-0.6, 0.2], brows: 0.1 }} pose={t > 327.9 ? poses.armsUp(frame) : poses.idle(frame, 2)} z={-5} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 328.96 "You can split it into hydrogen and oxygen."
export const SplitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 329.3, 330.4, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          {k < 0.05 ? (
            <WaterMolecule size={140} z={-5} />
          ) : (
            <>
              <X x={-420 * k} y={40} z={-5}>
                {[-1, 1].map((sd) => (
                  <Part key={sd} shape={circle(80)} color="#f4f6fa" shade={0.3} x={sd * 70} />
                ))}
              </X>
              <X x={420 * k} y={40} z={-5}>
                {[-1, 1].map((sd) => (
                  <Part key={sd} shape={circle(120)} color="#e2453a" shade={0.3} x={sd * 100} />
                ))}
              </X>
            </>
          )}
          {t > 329.2 && t < 329.8 ? <Glow rx={300} color="#ffffff" alpha={0.8} additive z={-4} /> : null}
        </SpaceSet>
      </Stage>
      <Label text="HYDROGEN" x={0.3} y={0.78} size={0.05} kind="box" at={at(329.9)} />
      <Label text="OXYGEN" x={0.72} y={0.78} size={0.05} kind="box" color="#fe5649" at={at(330.6)} />
    </AbsoluteFill>
  );
};

// 331.48 "The oxygen lets you breathe."
export const BreatheShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <GasCanister x={-420} y={-420} s={1.4} color="#e9ecf2" z={-6} />
          <Character {...ASTRONAUT(1)} x={300} y={-480} s={1.75} facing={-1} look={0.3} expression={{ eyes: "happy", mouth: "o", brows: -0.2 }} pose={poses.idle(frame, 3)} z={-5} />
          {Array.from({ length: 6 }, (_, i) => {
            const ph = (frame * 0.02 + i / 6) % 1;
            return <Part key={i} shape={circle(16 + i * 2)} color="#bfefff" flat outline={3} x={-200 + ph * 300} y={80 + Math.sin(ph * 6 + i) * 30} opacity={1 - ph} z={-4} />;
          })}
        </SpaceSet>
      </Stage>
      <Label text="OXYGEN" x={0.22} y={0.18} size={0.06} kind="title" color="#fe5649" at={at(331.6)} />
    </AbsoluteFill>
  );
};

// 333.21 "And hydrogen and oxygen together make rocket fuel."
export const FuelShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const flow = ramp(t, 334.4, 335.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: 160 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <LunarSurface horizon={-300} sun={[-1600, -100]} seed={113} rocks={3} craters={2}>
          <GasCanister x={-900} y={-700} s={1.6} color="#5a8ad2" z={-6} />
          <GasCanister x={-480} y={-700} s={1.6} color="#e9ecf2" z={-6} />
          <Line pts={[[-900, -150], [-900, 0], [-200, 0], [-60, -80]]} width={22} color="#7a7e88" z={-7} />
          <Line pts={[[-480, -150], [-480, -60], [-60, -60]]} width={22} color="#7a7e88" z={-7} />
          {flow > 0
            ? [0, 1, 2, 3].map((i) => {
                const ph = (frame * 0.03 + i / 4) % 1;
                return <Part key={i} shape={circle(14)} color={i % 2 ? "#5ac8ff" : "#ff8a6a"} flat outline={3} x={-900 + ph * 820} y={ph < 0.2 ? -150 + ph * 750 : 0} opacity={flow} z={-6.5} />;
              })
            : null}
          <SLS x={220} y={-700} h={1200} z={-5} />
        </LunarSurface>
      </Stage>
      <Label text="H₂" x={0.2} y={0.62} size={0.06} kind="tag" pin at={at(333.4)} />
      <Label text="O₂" x={0.35} y={0.62} size={0.06} kind="tag" pin at={at(334.1)} />
      <Label text="ROCKET FUEL" x={0.62} y={0.1} size={0.06} kind="title" at={at(335.4)} />
    </AbsoluteFill>
  );
};

/** Bold gravity arrow pointing down, its tip at (x, y). */
const GravArrow: React.FC<{ x: number; y: number; len: number; z?: number }> = ({ x, y, len, z = 0 }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(44, Math.max(10, len), 14)} color="#fe5649" shade={0.15} y={80 + len / 2} />
    <Part shape={poly([[-60, 80], [60, 80], [0, 0]])} color="#fe5649" shade={0.15} z={0.001} />
  </X>
);

// 336.5 "The Moon's gravity is only about one sixth of Earth's."
export const GravityShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 336.9, 337.9, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <Globe r={330} x={-480} y={-140} lon0={78} lat0={18} z={-10} />
          <MoonGlobe r={190} x={520} y={-200} craters={30} z={-10} />
          <GravArrow x={-480} y={210} len={180 * k} z={-5} />
          <GravArrow x={520} y={0} len={50 * k} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="EARTH" x={0.25} y={0.12} size={0.05} kind="box" at={at(338.7)} />
      <Label text="1/6" x={0.77} y={0.18} size={0.1} kind="title" color="#fe5649" at={at(338.1)} />
    </AbsoluteFill>
  );
};

// 339.64 "So it's much easier to launch a rocket from there."
export const EasyLaunchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const lift = ramp(t, 340.0, 341.9, Easing.in(Easing.quad)) * 700;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.58), y: 300 + lift * 0.3 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <LunarSurface horizon={-300} sun={[-1600, -120]} seed={115} rocks={4} craters={2}>
          <Starship x={0} y={-640 + lift} h={1200} thrust={t > 339.9 ? 0.45 : 0} tiles={false} z={-5} />
          <LandingDust k={ramp(t, 339.9, 341.9)} y={-640} spread={900} s={1.4} z={-4} />
        </LunarSurface>
      </Stage>
      <Label text="EASIER LAUNCH" x={0.62} y={0.1} size={0.05} kind="title" at={at(340.4)} />
    </AbsoluteFill>
  );
};

// 342.06 "The Moon could become a gas station for space."
export const GasStationShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.62, 0.66);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 200 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <LunarSurface horizon={-240} sun={[-1600, -80]} seed={117} rocks={3} craters={2} earth={[1100, 760, 110]}>
          <Part shape={roundRect(1500, 40, 10)} color="#d9473a" flat outline={6} x={-500} y={480} z={-8} />
          {[-1100, 100].map((x) => (
            <Part key={x} shape={roundRect(30, 1060, 8)} color="#9aa0aa" flat outline={5} x={x} y={-60} z={-8.1} />
          ))}
          <FuelPump x={-500} y={-600} s={1.5} glow={1} z={-6} />
          <Starship x={500} y={-640} h={1100} tiles={false} z={-7} />
          <Line pts={[[-370, -260], [80, -360], [440, -300]]} smooth width={16} color="#2a2a30" z={-6.5} />
        </LunarSurface>
      </Stage>
      <Label text="SPACE FUEL" x={sc(-500, 480, zoom, 0, 200).x} y={sc(-500, 480, zoom, 0, 200).y} size={0.05} kind="ink" color="#ffffff" pin at={at(342.4)} />
      <Label text="GAS STATION FOR SPACE" x={0.5} y={0.88} size={0.05} kind="title" at={at(343.2)} />
    </AbsoluteFill>
  );
};

/** Battery icon with a charge level. */
const Battery: React.FC<{ x?: number; y?: number; z?: number; level: number; s?: number }> = ({ x = 0, y = 0, z = 0, level, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={roundRect(300, 160, 26)} color="#f4f4f2" shade={0.2} />
    <Part shape={roundRect(30, 70, 10)} color="#f4f4f2" flat outline={5} x={168} z={-0.001} />
    <Part shape={roundRect(Math.max(10, 250 * level), 110, 14)} color={level < 0.3 ? "#fe5649" : "#4ad28a"} flat outline={0} x={-125 + (250 * level) / 2} z={0.001} />
  </X>
);

// 345.05 "But a base also needs power."
export const PowerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const flick = t > 345.9 ? (Math.sin(frame * 1.7) > 0.3 ? 0.4 : 0) : 0.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 100 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarSurface horizon={-150} sun={null} seed={119} rocks={4} craters={2}>
          <MoonBase x={0} y={-560} s={0.95} lights={flick} masts={0} z={-6} />
          <Battery x={0} y={460} level={Math.max(0.12, 0.6 - ramp(t, 345.2, 346.6) * 0.48)} s={1.2} z={-4} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 347.28 "And here, the south pole has another trick."
export const TrickShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.95) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarPoleMap ppd={52} w={3600} h={2400} psr={1} glowPeaks={ramp(t, 348.4, 349.2)} circles={[85]} seed={5} />
      </Stage>
    </AbsoluteFill>
  );
};

// 349.92 "Remember how the Sun slides along the horizon?"
export const SlideAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sx = interpolate(t, [349.7, 352.3], [-1400, 1300]);
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

// 352.46 "Some high crater rims and peaks near the south pole get sunlight most of the time."
export const RimsLitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.52, 0.56), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <CraterSection y={-120} sun={[-1750, 40]} rays={1} peaks={ramp(t, 353.2, 354.2)} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="SUNLIT RIMS" x={0.5} y={0.18} size={0.05} kind="title" color="#ffd84a" at={at(353.6)} />
      <Label text="SUN MOST OF THE TIME" x={0.5} y={0.86} size={0.045} kind="box" at={at(355.3)} />
    </AbsoluteFill>
  );
};

/** Glowing summit on the landscape (sunlit peak). */
const LitPeak: React.FC<{ x: number; y: number; k: number; z?: number }> = ({ x, y, k, z = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} z={z}>
      <Part shape={blob([[-700, 0], [-260, 420], [-60, 640], [80, 600], [300, 380], [720, 0]], 8)} color="#5a5664" flat outline={6} />
      <Part shape={blob([[-560, 60], [-240, 420], [-60, 630], [20, 560], [-120, 300], [-300, 60]], 8)} color="#e9e2cc" flat outline={0} opacity={0.3 + 0.7 * k} z={0.001} />
      <Glow rx={420} ry={300} y={480} color="#ffe27a" alpha={0.55 * k * (0.9 + 0.1 * Math.sin(frame * 0.1))} additive z={0.002} />
    </X>
  );
};

// 356.71 "People call them the 'peaks of eternal light.'"
export const EternalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.66), y: 200 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={-200} sun={[-1600, -120]} seed={121} rocks={4} craters={2} ridges={0.6}>
          <LitPeak x={200} y={-210} k={1} z={-30} />
        </LunarSurface>
      </Stage>
      <Label text="PEAKS OF ETERNAL LIGHT" x={0.5} y={0.86} size={0.06} kind="title" color="#ffd84a" at={at(357.6)} />
    </AbsoluteFill>
  );
};

// 359.29 "That's not quite true."
export const NotQuiteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 200 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={-200} sun={[-1600, -120]} seed={121} rocks={4} craters={2} ridges={0.6}>
          <LitPeak x={200} y={-210} k={1} z={-30} />
        </LunarSurface>
      </Stage>
      <Label text="ETERNAL?" x={0.5} y={0.86} size={0.07} kind="title" color="#ffd84a" at={at(359.3)} />
      <Label text="NOT QUITE" x={0.62} y={0.2} size={0.08} kind="stamp" at={at(359.9)} />
    </AbsoluteFill>
  );
};

// 361.08 "Even the best spots get dark sometimes."
export const DarkSometimesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dark = ramp(t, 361.6, 362.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 200 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6 + 0.2 * dark}>
        <LunarSurface horizon={-200} sun={dark > 0.9 ? null : [-1600, -120 - dark * 260]} seed={121} rocks={4} craters={2} ridges={0.6}>
          <LitPeak x={200} y={-210} k={1 - dark} z={-30} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 363.31 "But they're sunny most of the time, which makes them perfect for solar panels."
export const PanelsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const turn = interpolate(t, [363.2, 367.1], [-0.6, 0.2]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 160 }} light={{ dir: [-0.9, 0.3] }} vignette={0.55}>
        <LunarSurface horizon={-120} sun={[-1600, 0]} seed={123} rocks={4} craters={1}>
          {[-700, -380, -60, 260, 580].map((x, i) => (
            <SolarMast key={x} x={x} y={-640 + (i % 2) * 30} h={620} turn={turn + i * 0.04} z={-6 + i * 0.01} />
          ))}
          <Glow rx={900} ry={300} x={-200} y={-200} color="#ffe27a" alpha={0.18} additive z={-5} />
        </LunarSurface>
      </Stage>
      <Label text="SOLAR PANELS" x={0.62} y={0.1} size={0.05} kind="title" at={at(366.2)} />
    </AbsoluteFill>
  );
};

// 367.24 "So right next to the darkest, iciest craters,"
export const SideMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const sc = useScr();
  const ppd = 140;
  const [x, y] = poleXY(LUNAR_SITES.shackleton[0], LUNAR_SITES.shackleton[1], ppd);
  const zoom = push(frame, dur, 1.0, 1.08);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x, y }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarPoleMap ppd={ppd} w={4400} h={3000} psr={1} ice={1} seed={5} field={160}>
          <X x={x} y={y} z={-30}>
            <Ring r={260 + Math.sin(frame * 0.2) * 8} width={10} color="#8fe3ff" />
          </X>
        </LunarPoleMap>
      </Stage>
      <Label text="DARKEST, ICIEST" x={sc(x, y - 320, zoom, x, y).x} y={sc(x, y - 320, zoom, x, y).y} size={0.05} kind="tag" pin at={at(368.3)} />
    </AbsoluteFill>
  );
};

// 370.12 "you have some of the sunniest spots on the Moon."
export const SunniestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 140;
  const [x, y] = poleXY(LUNAR_SITES.shackleton[0], LUNAR_SITES.shackleton[1], ppd);
  const [gx, gy] = poleXY(LUNAR_SITES.deGerlache[0], LUNAR_SITES.deGerlache[1], ppd);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), x: (x + gx) / 2, y: (y + gy) / 2 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarPoleMap ppd={ppd} w={4400} h={3000} psr={1} ice={1} glowPeaks={ramp(t, 370.4, 371.2)} seed={5} field={160} />
      </Stage>
      <Label text="SUNNIEST SPOTS" x={0.5} y={0.1} size={0.06} kind="title" color="#ffd84a" at={at(370.8)} />
    </AbsoluteFill>
  );
};

// 372.88 "Water and power, side by side."
export const WaterPowerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.58, 0.62), y: 160 }} light={{ dir: [-0.9, 0.3] }} vignette={0.55}>
        <LunarSurface horizon={-140} sun={[-1600, -40]} seed={125} rocks={3} craters={1}>
          <GroundCrater x={-900} y={-600} r={600} sq={0.3} shadow={1} ice={1} z={-30} />
          <MoonBase x={300} y={-620} s={0.75} lights={0.8} masts={4} flag={null} z={-6} />
        </LunarSurface>
      </Stage>
      <Label text="WATER" x={0.18} y={0.84} size={0.05} kind="box" color="#8fe3ff" at={at(373.0)} />
      <Label text="POWER" x={0.62} y={0.12} size={0.05} kind="box" color="#ffd84a" at={at(373.5)} />
    </AbsoluteFill>
  );
};

// 375.86 "There's just one problem."
export const ProblemShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6} bgBlur={8} bg={<ControlRoom floor={-700} screen={<DescentScreen k={0.5} />} />}>
        <Character {...YOU} x={-200} y={-470} s={1.6} facing={1} look={0.3} expression={{ eyes: "half", mouth: "wavy", brows: 0.6 }} pose={poses.idle(frame, 4)} z={-2} />
      </DepthStage>
      <Label text="ONE PROBLEM" x={0.62} y={0.2} size={0.08} kind="stamp" at={at(376.4)} />
    </AbsoluteFill>
  );
};

/** Rough polar ground: tilted slabs and big boulders. */
const RoughGround: React.FC<{ seed?: number }> = ({ seed = 3 }) => (
  <>
    <Part shape={poly([[-3000, -100], [-800, 60], [400, -160], [3000, 120], [3000, -2000], [-3000, -2000]])} color="#9a958e" flat outline={6} z={-32} />
    <Part shape={poly([[200, -150], [900, 380], [1300, 420], [2200, 60], [3000, 100], [3000, -500], [200, -500]])} color="#7e7a74" flat outline={6} z={-31.9} />
    <Part shape={poly([[900, 380], [1300, 420], [1100, -60], [700, -120]])} color="#c9c4bc" flat outline={0} z={-31.85} />
    {[-1500, -1150, -800, -500, -150, 150, 450, 750, -950, -300, 300, 1050].map((x, i) => (
      <MoonRock key={`${x}${i}`} x={x} y={-280 - (i % 4) * 120 - (i > 7 ? 260 : 0)} size={60 + ((i * 37) % 5) * 28} seed={seed + i} z={-31 + i * 0.01 - (i > 7 ? 0 : 0.2)} />
    ))}
  </>
);

// 377.48 "Landing there is hard."
export const LandingHardShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const sway = Math.sin(frame * 0.12) * 0.12;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.76), y: 60 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={120} sun={[-1600, 160]} seed={127} rocks={0} craters={0}>
          <RoughGround seed={4} />
          <X x={Math.sin(frame * 0.07) * 60} y={260} rot={sway} z={-5}>
            <Vikram y={-240} thrust={0.7} flag={false} />
          </X>
        </LunarSurface>
      </Stage>
      <Label text="HARD TO LAND" x={0.08} y={0.1} size={0.045} kind="box" at={at(377.6)} />
    </AbsoluteFill>
  );
};

// 379.2 "The ground is rough, full of boulders and steep slopes."
export const RoughShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -280, rot: -0.05 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={160} sun={[-1600, 220]} seed={129} rocks={0} craters={0}>
          <RoughGround seed={9} />
        </LunarSurface>
      </Stage>
      <Label text="BOULDERS" x={0.08} y={0.1} size={0.045} kind="box" at={at(380.7)} />
      <Label text="STEEP SLOPES" x={0.08} y={0.19} size={0.045} kind="box" at={at(381.3)} />
    </AbsoluteFill>
  );
};

// 382.44 "And the long shadows make it hard for cameras to see."
export const CameraShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const corner = (sx: number, sy: number) => (
    <Line key={`${sx}${sy}`} pts={[[sx * 760, sy * 300], [sx * 820, sy * 300], [sx * 820, sy * 360]].map(([x, y]) => [x, y] as [number, number])} width={10} color="#ffffff" opacity={0.8} z={0.5} />
  );
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 0 }} light={{ dir: [-0.9, 0.3] }} vignette={0.85}>
        <LunarSurface horizon={300} sun={null} seed={131} rocks={0} craters={0}>
          <RoughGround seed={11} />
          {[-700, -100, 500].map((x, i) => (
            <Part key={x} shape={ellipse(420, 160)} color="#0a0a12" flat outline={0} opacity={0.85} x={x} y={-260 - i * 60} z={-30} />
          ))}
          {[corner(-1, 1), corner(1, 1), corner(-1, -1), corner(1, -1)]}
          <Part shape={circle(16)} color="#fe5649" flat outline={0} x={-760} y={240} opacity={Math.sin(frame * 0.3) > 0 ? 1 : 0} z={0.5} />
        </LunarSurface>
      </Stage>
      <Label text="LANDER CAMERA" x={0.08} y={0.1} size={0.045} kind="box" at={at(382.6)} />
    </AbsoluteFill>
  );
};

// 385.37 "Russia's Luna-25 crashed."
export const LunaReplayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const fall = ramp(t, 385.3, 386.9, Easing.in(Easing.quad));
  const boom = ramp(t, 386.9, 388.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: 60, shake: hitAt(t, 386.9, 0.6) * 20 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarSurface horizon={-120} sun={[-1300, 40]} seed={5} rocks={7} craters={5}>
          {boom < 0.05 ? (
            <X x={interpolate(fall, [0, 1], [-700, 200])} y={interpolate(fall, [0, 1], [700, -380])} rot={fall * 6} s={0.6} z={-5}>
              <Luna25 y={-220} />
            </X>
          ) : null}
          <Fireball t={boom} x={200} y={-360} size={1.1} seed={9} z={-4} />
        </LunarSurface>
      </Stage>
      <Label text="LUNA-25 · 2023" x={0.08} y={0.1} size={0.045} kind="box" at={at(385.5)} />
      <Label text="CRASHED" x={0.62} y={0.2} size={0.08} kind="stamp" at={at(387.3)} />
    </AbsoluteFill>
  );
};

// 388.21 "In 2024, an American company's lander, Odysseus,"
export const OdysseusShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.85, 0.9);
  const y = interpolate(t, [388, 392], [260, 60]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 120 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-260} sun={[-1500, -160]} seed={133} rocks={5} craters={3}>
          <NovaC x={0} y={y - 300} s={0.85} thrust={0.6} z={-5} />
        </LunarSurface>
      </Stage>
      <Label text="2024" x={0.5} y={0.1} size={0.08} kind="title" at={at(388.4)} />
      <Label text="ODYSSEUS · USA" x={sc(330, y + 100, zoom, 0, 120).x} y={sc(330, y + 100, zoom, 0, 120).y} size={0.045} kind="tag" pin at={at(391.2)} />
    </AbsoluteFill>
  );
};

// 392.13 "touches down near the south pole."
export const OdyTouchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const land = 392.9;
  const y = t < land ? interpolate(t, [392.0, land], [180, 0]) : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 60, shake: hitAt(t, land, 0.4) * 6 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-150} sun={[-1500, -60]} seed={135} rocks={5} craters={2}>
          <NovaC x={0} y={-520 + y} s={0.9} thrust={t < land ? 0.6 : 0} z={-5} />
          <LandingDust k={ramp(t, 392.2, 394.0)} y={-520} spread={600} z={-4} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 394.16 "Then it tips over onto its side."
export const TipsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const tip = ramp(t, 394.7, 395.6, Easing.in(Easing.quad));
  const fall = Math.min(1, tip) * 1.35 + (t > 395.6 ? Math.sin((t - 395.6) * 18) * Math.max(0, 0.06 - (t - 395.6) * 0.1) : 0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 60, shake: hitAt(t, 395.6, 0.5) * 14 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-150} sun={[-1500, -60]} seed={135} rocks={5} craters={2}>
          <X x={150} y={-520} rot={-fall} z={-5}>
            <NovaC x={-150} s={0.9} />
          </X>
          <LandingDust k={ramp(t, 395.5, 396.5)} x={350} y={-520} spread={500} z={-4} />
        </LunarSurface>
      </Stage>
      <Label text="TIPPED OVER" x={0.62} y={0.2} size={0.07} kind="stamp" at={at(395.8)} />
    </AbsoluteFill>
  );
};

// 396.6 "In 2025, another one, Athena,"
export const AthenaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.85, 0.9);
  const y = interpolate(t, [396.4, 399.5], [260, 80]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 120 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={-260} sun={[-1600, -200]} seed={137} rocks={5} craters={3}>
          <NovaC x={0} y={y - 300} s={0.85} thrust={0.6} variant="athena" z={-5} />
        </LunarSurface>
      </Stage>
      <Label text="2025" x={0.5} y={0.1} size={0.08} kind="title" at={at(396.7)} />
      <Label text="ATHENA · USA" x={sc(330, y + 100, zoom, 0, 120).x} y={sc(330, y + 100, zoom, 0, 120).y} size={0.045} kind="tag" pin at={at(398.8)} />
    </AbsoluteFill>
  );
};

// 399.65 "lands in a crater and falls over too."
export const AthenaFallsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const land = 400.2;
  const y = t < land ? interpolate(t, [399.5, land], [160, 0]) : 0;
  const fall = ramp(t, 400.6, 401.3, Easing.in(Easing.quad)) * 1.4;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: -60, shake: hitAt(t, 401.3, 0.5) * 14 }} light={{ dir: [-0.9, 0.3] }} vignette={0.65}>
        <LunarSurface horizon={160} sun={[-1600, 200]} seed={139} rocks={3} craters={0}>
          <GroundCrater x={0} y={-500} r={900} sq={0.36} shadow={0.85} z={-30} />
          <X x={-160} y={-560 + y} rot={fall} z={-5}>
            <NovaC x={160} s={0.85} thrust={t < land ? 0.6 : 0} variant="athena" />
          </X>
          <LandingDust k={ramp(t, 401.2, 402.0)} x={-300} y={-560} spread={500} z={-4} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 402.12 "So when Vikram landed upright in 2023, it was a big deal."
export const BigDealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const spot = ramp(t, 402.4, 403.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.74, 0.78), y: -120 }} light={{ dir: [-0.6, 0.7] }} vignette={0.65}>
        <LunarSurface horizon={-120} sun={null} seed={141} rocks={3} craters={1}>
          <X x={-1000} y={-640} z={-8}>
            <Part shape={blob([[-180, 0], [-120, 90], [40, 120], [190, 40], [160, 0]], 6)} color="#4a4a52" flat outline={6} />
            <Part shape={circle(60)} color="#eceef2" shade={0.3} x={-40} y={90} z={0.001} />
            <Part shape={roundRect(90, 40, 8)} color="#e2b13c" flat outline={4} x={90} y={70} rot={0.6} z={0.002} />
          </X>
          <X x={-500} y={-640} rot={-1.4} z={-8}>
            <NovaC x={-160} s={0.7} />
          </X>
          <X x={880} y={-640} rot={1.4} z={-8}>
            <NovaC x={160} s={0.7} variant="athena" />
          </X>
          <Glow rx={520} ry={700} x={180} y={-120} color="#fff2c6" alpha={0.35 * spot} additive z={-7} />
          <Vikram x={180} y={-660} s={1.1} z={-6} />
        </LunarSurface>
      </Stage>
      <Label text="LUNA-25" x={0.12} y={0.86} size={0.04} kind="tag" pin at={at(402.3)} />
      <Label text="ODYSSEUS" x={0.3} y={0.86} size={0.04} kind="tag" pin at={at(402.3)} />
      <Label text="ATHENA" x={0.86} y={0.86} size={0.04} kind="tag" pin at={at(402.3)} />
      <Label text="VIKRAM · UPRIGHT" x={0.58} y={0.24} size={0.05} kind="tag" pin at={at(403.2)} />
      <Label text="BIG DEAL" x={0.62} y={0.1} size={0.08} kind="stamp" at={at(405.0)} />
    </AbsoluteFill>
  );
};

export { Orion, IceFlake, Flash };
