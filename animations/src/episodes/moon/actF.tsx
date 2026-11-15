import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, roundRect, circle, poly, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MoonGlobe, moonProj, LunarSurface, LunarPoleMap, poleXY, LUNAR_SITES, GroundCrater, SLS, Orion, Starship, ChangELander, YutuRover, Hopper, MoonBase, NationFlag, FlagDecal, Globe, Calendar,
  Typhoon, WorldMap, worldXY, Smoke, Exhaust, LandingDust, Ring, Chandrayaan1, DashLink,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { SpaceSet, RuleBoard, Flash } from "./sets";
import { ASTRONAUT, TAIKONAUT } from "./cast";

// The new race: Artemis II (April 2026), NASA's landers and 2028 plan,
// China's far-side landings, Chang'e-7 and its hopper, the 2027 delay, a
// China–Russia base — and everyone wanting the same small area.

/** Long March-style rocket: white core, two visible boosters, Chinese flag. Origin = base centre. */
const LongMarch: React.FC<{ x?: number; y?: number; z?: number; h?: number; thrust?: number }> = ({ x = 0, y = 0, z = 0, h = 1200, thrust = 0 }) => {
  const r = Math.round;
  return (
    <X x={x} y={y} z={z}>
      {thrust > 0.02 ? <Exhaust len={620 * thrust} w={120} z={-0.03} /> : null}
      {[-1, 1].map((sd) => (
        <X key={sd} x={sd * 64} z={-0.01}>
          <Part shape={roundRect(46, r(h * 0.36), 10)} color="#eef0f3" shade={0.3} y={r(h * 0.02 + h * 0.18)} />
          <Part shape={poly([[-23, r(h * 0.38)], [23, r(h * 0.38)], [0, r(h * 0.45)]])} color="#eef0f3" flat outline={4} z={0.001} />
        </X>
      ))}
      <Part shape={roundRect(92, r(h * 0.62), 10)} color="#f4f4f6" shade={0.3} y={r(h * 0.02 + h * 0.31)}>
        <FlagDecal kind="china" w={60} y={r(h * 0.12)} z={0.002} />
        <Part shape={roundRect(94, 16, 0)} color="#c8262f" flat outline={0} y={-r(h * 0.12)} z={0.001} />
      </Part>
      <Part shape={roundRect(120, r(h * 0.18), 30)} color="#f6f6f8" shade={0.3} y={r(h * 0.64 + h * 0.09)} z={0.002} />
      <Part shape={poly([[-60, r(h * 0.82)], [60, r(h * 0.82)], [0, r(h * 0.95)]])} color="#f6f6f8" flat outline={5} z={0.002} />
    </X>
  );
};

/** Launch pad scene (green ground, tower, sky) with a rocket child; `lift` raises the rocket. */
const PadScene: React.FC<{ children?: React.ReactNode; sky?: string }> = ({ children, sky = "#6fa8d8" }) => (
  <>
    <Part shape={roundRect(6000, 4000, 0)} color={sky} flat outline={0} y={1400} z={-41} />
    <Part shape={roundRect(6000, 800, 0)} color="#9ac0e0" flat outline={0} y={0} z={-40.9} />
    <Part shape={roundRect(6000, 1600, 0)} color="#7a9a5a" flat outline={6} y={-1000} z={-40} />
    <Part shape={roundRect(420, 1500, 10)} color="#9aa0aa" shade={0.2} x={-420} y={150} z={-30} />
    <Part shape={roundRect(900, 120, 10)} color="#8a8a90" shade={0.2} y={-260} z={-29} />
    {children}
  </>
);

// 406.36 "Now, the big players are getting ready."
export const PlayersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 100 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-200} sun={[-1500, -80]} seed={151} rocks={3} craters={2} earth={[0, 620, 120]}>
          <NationFlag kind="usa" x={-1050} y={-620} w={260} pole={700} z={-8} />
          <Character {...ASTRONAUT(0)} x={-500} y={-640} s={1.2} facing={1} look={0.4} expression={{ eyes: "angry", mouth: "smirk" }} pose={poses.idle(frame, 1)} z={-6} />
          <Character {...TAIKONAUT(0)} x={500} y={-640} s={1.2} facing={-1} look={0.4} expression={{ eyes: "angry", mouth: "smirk" }} pose={poses.idle(frame, 2)} z={-6} />
          <NationFlag kind="china" x={850} y={-620} w={260} pole={700} z={-8} />
        </LunarSurface>
      </Stage>
      <Label text="THE BIG PLAYERS" x={0.5} y={0.1} size={0.06} kind="title" at={at(407.0)} />
    </AbsoluteFill>
  );
};

// 409.04 "In April 2026,"
export const Artemis2Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const lift = ramp(t, 409.3, 410.9, Easing.in(Easing.quad)) * 600;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.58), y: 360 + lift * 0.4, shake: 4 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <PadScene sky="#3a5a8a">
          <SLS x={0} y={-200 + lift} h={1400} thrust={1} z={-20} />
          <Smoke x={0} y={-180} w={1000} h={520} alpha={0.75} seed={6} z={-19} />
        </PadScene>
      </Stage>
      <Label text="APRIL 2026" x={0.5} y={0.1} size={0.08} kind="title" at={at(409.1)} />
    </AbsoluteFill>
  );
};

// 410.83 "NASA's Artemis II flies four astronauts around the Moon."
export const AroundMoonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 410.8, 414.0);
  const ang = Math.PI * 0.9 - k * Math.PI * 1.6;
  const ox = 320 + Math.cos(ang) * 470;
  const oy = Math.sin(ang) * 360;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Globe r={150} x={-860} y={-60} lon0={-80} lat0={20} z={-12} />
          <Line pts={Array.from({ length: 50 }, (_, i) => { const a = Math.PI * 0.9 - (i / 49) * Math.PI * 1.6; return [320 + Math.cos(a) * 470, Math.sin(a) * 360] as [number, number]; })} width={6} color="#9ad8ff" opacity={0.4} z={-11} />
          <MoonGlobe r={300} x={320} y={0} craters={40} z={Math.sin(ang) < -0.2 && Math.cos(ang) > -0.2 ? -9 : -10} />
          <Orion x={ox} y={oy} s={0.5} rot={ang + Math.PI} z={-9.5} />
        </SpaceSet>
      </Stage>
      <Label text="ARTEMIS II" x={0.5} y={0.1} size={0.07} kind="title" at={at(411.3)} />
      <Label text="4 ASTRONAUTS" x={0.08} y={0.86} size={0.045} kind="box" at={at(412.4)} />
    </AbsoluteFill>
  );
};

// 414.2 "They travel farther from Earth than any humans ever have."
export const FartherShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 414.3, 416.6, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Globe r={110} x={-860} y={-200} lon0={-80} lat0={20} z={-12} />
          <MoonGlobe r={90} x={300} y={-200} craters={20} z={-12} />
          <DashLink a={[-740, -200]} b={[-740 + 1450 * k, -200]} color="#ffd84a" width={10} z={-10} />
          <Orion x={-740 + 1450 * k + 80} y={-200} s={0.35} rot={-Math.PI / 2} z={-9} />
          <X x={0} y={260} s={1.1} z={-8}>
            <Orion rot={-Math.PI / 2} s={1.0} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="FARTHEST HUMANS EVER" x={0.5} y={0.1} size={0.06} kind="title" color="#ffd84a" at={at(415.4)} />
    </AbsoluteFill>
  );
};

// 417.46 "But nobody lands."
export const NobodyLandsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 200 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-240} sun={[-1500, -100]} seed={153} rocks={5} craters={3}>
          <Orion x={interpolate(t, [417.3, 419], [-900, 900])} y={700} s={0.55} rot={-Math.PI / 2} z={-6} />
        </LunarSurface>
      </Stage>
      <Label text="NO LANDING" x={0.62} y={0.8} size={0.07} kind="stamp" at={at(418.2)} />
    </AbsoluteFill>
  );
};

// 419.19 "NASA now plans to test its landers in Earth orbit in 2027."
export const OrbitTestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 419.4, 422.4, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: 60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Globe r={2400} y={-2900} lon0={-60 + frame * 0.05} lat0={10} z={-20} />
          <X x={-200} y={180} rot={-Math.PI / 2} z={-8}>
            <Starship h={1100} tiles={false} />
          </X>
          <Orion x={interpolate(k, [0, 1], [1100, 520])} y={180} s={0.7} rot={Math.PI / 2} z={-7} />
        </SpaceSet>
      </Stage>
      <Label text="2027 · TEST IN EARTH ORBIT" x={0.5} y={0.1} size={0.05} kind="title" at={at(420.2)} />
    </AbsoluteFill>
  );
};

// 423.25 "Then, in 2028, it wants to put astronauts back on the Moon."
export const BackOnMoonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: 260 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-260} sun={[-1500, -120]} seed={155} rocks={4} craters={2} earth={[1150, 900, 110]}>
          <Starship x={-700} y={-700} h={1250} tiles={false} z={-9} />
          <Character {...ASTRONAUT(2)} x={60} y={-720} s={1.2} facing={1} look={0.4} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={-6} />
          <Character {...ASTRONAUT(3)} x={520} y={-700} s={1.15} facing={-1} look={0.4} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 3)} z={-6.1} />
          <NationFlag kind="usa" x={850} y={-700} w={260} pole={600} z={-7} />
        </LunarSurface>
      </Stage>
      <Label text="2028" x={0.5} y={0.1} size={0.08} kind="title" at={at(423.9)} />
    </AbsoluteFill>
  );
};

// 427.44 "And where does it want to go? The south pole."
export const WhereShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 427.6, 429.3, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={420} view={{ lon: 0, lat: -90 * k }} pins={k > 0.95 ? [{ lon: 0, lat: -89.9, r: 24 }] : []} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="THE SOUTH POLE" x={0.5} y={0.88} size={0.06} kind="title" color="#fe5649" at={at(429.2)} />
    </AbsoluteFill>
  );
};

// 430.75 "China is moving fast too."
export const ChinaFastShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lift = ramp(t, 430.6, 432.3, Easing.in(Easing.quad)) * 700;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.58, 0.62), y: 300 + lift * 0.4, shake: 4 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <PadScene>
          <LongMarch x={0} y={-200 + lift} h={1300} thrust={1} z={-20} />
          <Smoke x={0} y={-180} w={900} h={480} alpha={0.75} seed={7} z={-19} />
        </PadScene>
      </Stage>
    </AbsoluteFill>
  );
};

// 432.45 "In 2019, it lands the first spacecraft ever on the Moon's far side,"
export const FarSideShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const roll = ramp(t, 433.4, 436.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.74), y: -120 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-220} sun={[-1500, 120]} seed={157} rocks={5} craters={3}>
          <ChangELander x={-300} y={-640} s={1.0} z={-8} />
          <YutuRover x={260 + roll * 420} y={-660} s={1.15} roll={roll * 8} z={-6} />
        </LunarSurface>
      </Stage>
      <Label text="2019" x={0.5} y={0.1} size={0.08} kind="title" at={at(432.6)} />
      <Label text="FIRST ON THE FAR SIDE" x={0.08} y={0.86} size={0.045} kind="box" at={at(434.6)} />
    </AbsoluteFill>
  );
};

// 436.79 "inside the South Pole-Aitken basin."
export const InsideBasinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={430} view={{ lon: -169, lat: -53 }} basinTint={1} basin={1} pins={[{ lon: 177.6, lat: -45.4, color: "#ffd84a", r: 22 }]} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="SOUTH POLE–AITKEN BASIN" x={0.5} y={0.1} size={0.055} kind="title" at={at(437.2)} />
    </AbsoluteFill>
  );
};

// 439.06 "In 2024, its Chang'e-6"
export const Change6Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: -160 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-200} sun={[-1500, 60]} seed={159} rocks={4} craters={2}>
          <ChangELander x={0} y={-620} s={1.1} ascender z={-6} />
        </LunarSurface>
      </Stage>
      <Label text="2024" x={0.5} y={0.1} size={0.08} kind="title" at={at(439.2)} />
      <Label text="CHANG'E-6" x={0.08} y={0.86} size={0.05} kind="box" at={at(440.5)} />
    </AbsoluteFill>
  );
};

// 441.32 "mission brings back the first rocks from the far side."
export const RocksBackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const lift = ramp(t, 441.6, 444.2, Easing.in(Easing.quad)) * 900;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.74), y: -120 + lift * 0.45, shake: t > 441.6 ? 3 : 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-200} sun={[-1500, 60]} seed={159} rocks={4} craters={2}>
          <ChangELander x={0} y={-620} s={1.1} ascender lift={lift} thrust={t > 441.5 ? 0.9 : 0} z={-6} />
          <LandingDust k={ramp(t, 441.5, 443.5)} y={-620} spread={600} z={-5} />
        </LunarSurface>
      </Stage>
      <Label text="FIRST FAR-SIDE ROCKS" x={0.5} y={0.88} size={0.05} kind="title" at={at(442.8)} />
    </AbsoluteFill>
  );
};

// 444.4 "Its next mission, Chang'e-7,"
export const Change7Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={900} x={600} y={-760} view={{ lon: 0, lat: -70 }} craters={80} z={-12} />
          <ChangELander x={interpolate(t, [444.2, 446.6], [-600, -260])} y={interpolate(t, [444.2, 446.6], [200, 60])} s={0.75} rot={0.4} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="CHANG'E-7" x={0.5} y={0.1} size={0.07} kind="title" at={at(445.5)} />
    </AbsoluteFill>
  );
};

// 446.68 "is going to the edge of Shackleton, a crater near the south pole."
export const ShackletonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = 140;
  const [x, y] = poleXY(LUNAR_SITES.shackleton[0], LUNAR_SITES.shackleton[1], ppd);
  const rim: [number, number] = [x + 270, y + 120];
  const zoom = push(frame, dur, 0.95, 1.05);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x, y }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarPoleMap ppd={ppd} w={4400} h={3000} psr={1} ice={0.6} seed={5} field={160}>
          <X x={x} y={y} z={-30}>
            <Ring r={300} width={10} color="#ffd84a" opacity={ramp(t, 447.3, 447.9)} />
          </X>
          <X x={rim[0]} y={rim[1]} s={0.22 * pop(t, 448.0)} z={-20}>
            <ChangELander y={-200} />
          </X>
        </LunarPoleMap>
      </Stage>
      <Label text="SHACKLETON CRATER" x={sc(x, y - 360, zoom, x, y).x} y={sc(x, y - 360, zoom, x, y).y} size={0.05} kind="tag" pin at={at(447.7)} />
    </AbsoluteFill>
  );
};

// 450.61 "Its job is to hunt for ice."
export const HuntIceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 100 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={0} sun={[-1600, 80]} seed={161} rocks={3} craters={0}>
          <GroundCrater x={420} y={-480} r={760} sq={0.32} shadow={1} ice={ramp(t, 451.2, 452.0)} z={-30} />
          <ChangELander x={-760} y={-420} s={0.9} z={-6} />
          <Part shape={poly([[-640, -100], [-600, -100], [380, -520], [100, -520]])} color="#7fd0ff" flat outline={0} opacity={0.22} z={-6.5} />
        </LunarSurface>
      </Stage>
      <Label text="HUNT FOR ICE" x={0.62} y={0.1} size={0.06} kind="title" color="#8fe3ff" at={at(451.4)} />
    </AbsoluteFill>
  );
};

// 452.5 "It even carries a small robot that can hop into dark craters."
export const HopperShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 453.6, 455.6, Easing.inOut(Easing.quad));
  const hx = interpolate(k, [0, 1], [-560, 380]);
  const hy = -440 + Math.sin(k * Math.PI) * 520 - k * 120;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 60 }} light={{ dir: [-0.9, 0.3] }} vignette={0.6}>
        <LunarSurface horizon={0} sun={[-1600, 80]} seed={161} rocks={3} craters={0}>
          <GroundCrater x={420} y={-560} r={760} sq={0.32} shadow={1} ice={1} z={-30} />
          <ChangELander x={-900} y={-420} s={0.75} z={-7} />
          <Hopper x={hx} y={hy} s={1.3} thrust={k > 0.02 && k < 0.98 ? 0.8 : 0} z={-6} />
        </LunarSurface>
      </Stage>
      <Label text="HOPPING ROBOT" x={0.08} y={0.1} size={0.045} kind="box" at={at(453.4)} />
    </AbsoluteFill>
  );
};

// 456.25 "It was supposed to launch in August 2026."
export const SupposedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 240 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <PadScene>
          <LongMarch x={0} y={-200} h={1300} z={-20} />
          <X x={760} y={500} s={1.4} rot={0.05} z={-10}>
            <Calendar circled={10} crossed={9} />
          </X>
        </PadScene>
      </Stage>
      <Label text="AUGUST 2026" x={0.66} y={0.1} size={0.06} kind="title" at={at(457.4)} />
    </AbsoluteFill>
  );
};

// 459.05 "But a typhoon and a tricky landing schedule pushed it back to 2027."
export const TyphoonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 60;
  const c: [number, number] = [112, 21];
  const [wx, wy] = worldXY(110.95, 19.6, ppd, c);
  const k = ramp(t, 459.1, 461.0, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <WorldMap ppd={ppd} center={c} w={4400} h={2600} tint={{ China: "#e2a04a" }} pins={[{ at: [110.95, 19.6], color: "#fe5649", glow: true }]} z={-20} />
        <Typhoon x={interpolate(k, [0, 1], [wx + 900, wx + 140])} y={interpolate(k, [0, 1], [wy - 500, wy - 80])} size={360} z={-5} />
      </Stage>
      <Label text="TYPHOON" x={0.08} y={0.1} size={0.045} kind="box" at={at(459.3)} />
      <Label text="DELAYED → 2027" x={0.62} y={0.8} size={0.06} kind="stamp" at={at(461.7)} />
    </AbsoluteFill>
  );
};

// 463.13 "China says it wants to land its own astronauts before 2030."
export const TaikonautsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 160 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-220} sun={[-1500, -80]} seed={163} rocks={4} craters={2} earth={[-1100, 720, 100]}>
          <Character {...TAIKONAUT(0)} x={-260} y={-680} s={1.2} facing={1} look={0.4} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={-6} />
          <Character {...TAIKONAUT(1)} x={260} y={-660} s={1.15} facing={-1} look={0.4} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 2)} z={-6.1} />
          <NationFlag kind="china" x={600} y={-660} w={280} pole={640} z={-7} />
        </LunarSurface>
      </Stage>
      <Label text="BEFORE 2030" x={0.5} y={0.1} size={0.07} kind="title" at={at(465.5)} />
    </AbsoluteFill>
  );
};

// 466.81 "And with Russia, it plans to build a research base near the south pole."
export const IlrsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.58), y: 120 }} light={{ dir: [-0.9, 0.3] }} vignette={0.55}>
        <LunarSurface horizon={-140} sun={[-1700, -40]} seed={165} rocks={4} craters={2}>
          <MoonBase x={0} y={-640} s={0.95 * ramp(t, 467.9, 469.0, Easing.out(Easing.back(1.2)))} lights={0.8} masts={3} z={-6} />
          <NationFlag kind="china" x={-1350} y={-620} w={260} pole={640} z={-7} />
          <NationFlag kind="russia" x={-1050} y={-640} w={260} pole={640} z={-7.1} />
        </LunarSurface>
      </Stage>
      <Label text="CHINA + RUSSIA" x={0.08} y={0.1} size={0.045} kind="box" at={at(467.3)} />
      <Label text="RESEARCH BASE" x={0.62} y={0.1} size={0.06} kind="title" at={at(469.0)} />
    </AbsoluteFill>
  );
};

// 471.65 "Remember the rule? Water is worth more than gold."
export const RuleAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <RuleBoard w={1400} h={720} glow={0.6} />
        </SpaceSet>
      </Stage>
      <Label text="IN SPACE," x={0.5} y={0.36} size={0.06} kind="ink" pin at={at(471.8)} />
      <Label text="WATER > GOLD" x={0.5} y={0.52} size={0.09} kind="ink" color="#2f6fd0" pin at={at(472.8)} />
    </AbsoluteFill>
  );
};

// 474.92 "And there aren't many places where ice and sunlight sit this close together."
export const CloseTogetherShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 60;
  const spots = [LUNAR_SITES.shackleton, LUNAR_SITES.deGerlache, LUNAR_SITES.malapertPeak].map(([lon, lat]) => poleXY(lon, lat, ppd));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarPoleMap ppd={ppd} w={3600} h={2400} psr={1} ice={1} glowPeaks={1} circles={[85]} seed={5}>
          {spots.map(([x, y], i) => (
            <X key={i} x={x} y={y} z={-30}>
              <Ring r={110 + Math.sin(frame * 0.2 + i) * 6} width={9} color="#ffd84a" opacity={ramp(t, 475.4 + i * 0.4, 476.0 + i * 0.4)} />
            </X>
          ))}
        </LunarPoleMap>
      </Stage>
      <Label text="ICE + SUNLIGHT" x={0.5} y={0.1} size={0.06} kind="title" at={at(476.4)} />
    </AbsoluteFill>
  );
};

// 478.36 "That's why everyone wants the same small area."
export const SameAreaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 60;
  const k = ramp(t, 478.4, 480.4, Easing.out(Easing.quad));
  const flags: ["usa" | "china" | "russia" | "india", number][] = [
    ["usa", -2.4],
    ["china", -0.6],
    ["russia", 0.9],
    ["india", 2.4],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarPoleMap ppd={ppd} w={3600} h={2400} psr={1} ice={1} glowPeaks={1} seed={5}>
          <X z={-30}>
            <Ring r={220} width={12} color="#fe5649" />
          </X>
          {flags.map(([kind, a], i) => {
            const d = interpolate(k, [0, 1], [1000, 260]);
            return <NationFlag key={kind} kind={kind} x={Math.cos(a) * d} y={Math.sin(a) * d - 120} w={150} pole={240} z={-20 + i * 0.01} />;
          })}
        </LunarPoleMap>
      </Stage>
      <Label text="SAME SMALL AREA" x={0.5} y={0.88} size={0.06} kind="title" color="#fe5649" at={at(479.4)} />
    </AbsoluteFill>
  );
};

export { moonProj, hitAt, Flash, circle, Glow, Chandrayaan1 };
