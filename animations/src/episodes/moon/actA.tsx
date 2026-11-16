import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, circle, push, hitAt, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MoonGlobe, Globe, moonProj, LunarSurface, CraterSection, GroundCrater, Vikram, Luna25, CentaurStage, ImpactPlume, GasCanister, NationFlag, SpaceRock, Fireball, Clock, Calendar,
  GoldCoin, Planet, IceFlake, LandingDust,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { ControlRoom, Console, DescentScreen, SpaceSet, Flash } from "./sets";
import { atHead } from "./frame";
import { YOU, ENGINEER } from "./cast";

// Cold open (ISRO mission control, 23 August 2023: Luna-25 crashed four days
// earlier; Vikram lands near the south pole) and the "coming up" hook.
// Times are seconds on public/vo/moon.tight.voice.m4a (captions/moon.json).

type Look = Partial<React.ComponentProps<typeof Character>>;

/** A standing console with an engineer to its right, looking at the monitors. Origin = floor. */
export const Station: React.FC<{ x?: number; y?: number; z?: number; s?: number; i?: number; frame: number; who?: Look }> = ({ x = 0, y = 0, z = 0, s = 1, i = 0, frame, who }) => (
  <X x={x} y={y} z={z} s={s}>
    <Console x={-200} w={420} screens={["#1d4a6a", "#24604a"]} frameOff={i * 11} />
    <Character {...ENGINEER(i)} x={150} facing={-1} look={0.45} expression={{ eyes: "open", mouth: "flat", gaze: [-0.8, 0.1] }} pose={poses.idle(frame, i)} z={-0.01} {...who} />
  </X>
);

// 0.11 "Imagine you're an engineer at ISRO's mission control in Bengaluru, India."
export const ControlRoomShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 0.76, y: 220 };
  const you = atHead(cam, 0.27, 0.46, 2.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.74, 0.8), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <ControlRoom floor={-420} screen={<DescentScreen k={0.12} />}>
          <Station x={-1300} y={-420} s={0.95} i={1} frame={frame} z={-12} />
          <Station x={700} y={-420} s={0.95} i={3} frame={frame} z={-12} />
          <Character {...YOU} x={you.x} y={you.y} s={2.4} facing={1} look={0.55} expression={{ eyes: "open", mouth: t > 1.5 ? "smile" : "flat", gaze: [0.5, 0.4], brows: 0.15 }} pose={poses.idle(frame, 1)} z={-4} />
          <NationFlag kind="india" x={1380} y={-640} w={240} pole={760} z={-5} />
        </ControlRoom>
      </Stage>
      <Label text="ISRO MISSION CONTROL" x={0.6} y={0.74} size={0.045} kind="box" at={at(1.4)} />
      <Label text="BENGALURU, INDIA" x={0.6} y={0.83} size={0.036} kind="box" at={at(2.9)} />
      <Label text="YOU" x={0.27} y={0.2} size={0.05} kind="tag" pin at={at(0.4)} until={at(2.6)} />
    </AbsoluteFill>
  );
};

// 4.57 "It's August 23, 2023."
export const DateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6} bgBlur={8} bg={<ControlRoom floor={-620} screen={<DescentScreen k={0.15} />} />}>
        <X x={-380} y={60} s={1.6} rot={-0.05}>
          <Calendar circled={ramp(t, 5.1, 5.4) > 0.5 ? 16 : null} crossed={15} />
        </X>
        <X x={420} y={80} s={1.1}>
          <Clock r={190} speed={3} />
        </X>
      </DepthStage>
      <Label text="AUGUST 23, 2023" x={0.62} y={0.78} size={0.07} kind="title" at={at(4.9)} />
    </AbsoluteFill>
  );
};

// 7.87 "On your screen, a small lander called Vikram is falling toward the Moon."
export const ScreenShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = interpolate(t, [7.6, 12.3], [0.18, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = useScr();
  const zoom = push(frame, dur, 0.82, 0.9);
  const cam = { zoom: 0.86, y: 380 };
  const you = atHead(cam, 0.16, 0.6, 1.9);
  const eng = atHead(cam, 0.85, 0.6, 1.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <ControlRoom floor={-420} screen={<DescentScreen k={k} />} consoles={false}>
          <Character {...YOU} x={you.x} y={you.y} s={1.9} facing={1} look={0.75} expression={{ eyes: "wide", mouth: "flat", gaze: [0.6, 0.7], brows: 0.4 }} pose={poses.idle(frame, 2)} z={-4} />
          <Character {...ENGINEER(4)} x={eng.x} y={eng.y} s={1.8} facing={-1} look={0.75} expression={{ eyes: "open", mouth: "o", gaze: [-0.6, 0.7], brows: 0.3 }} pose={poses.point(frame)} z={-4} />
        </ControlRoom>
      </Stage>
      <Label text="VIKRAM" x={sc(-640 + k * 1080, 520 + 260 - 420 * k ** 1.6 + 70, zoom, 0, 380).x} y={sc(0, 520 + 260 - 420 * k ** 1.6 + 90, zoom, 0, 380).y} size={0.045} kind="tag" pin at={at(10.0)} />
    </AbsoluteFill>
  );
};

// 12.57 "Four days ago, Russia's lander, Luna-25,"
export const LunaFliesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.95, 1.02);
  const x = interpolate(t, [12.3, 15.8], [-560, 220]);
  const y = interpolate(t, [12.3, 15.8], [80, -60]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={1500} y={-1650} view={{ lon: 40, lat: -45, roll: 20 }} craters={120} glow={0.3} z={-20} />
          <Luna25 x={x} y={y} s={0.8} rot={0.5} thrust={0.35} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="4 DAYS EARLIER" x={0.08} y={0.1} size={0.045} kind="box" at={at(12.6)} />
      <Label text="LUNA-25 · RUSSIA" x={sc(x, y - 90, zoom).x} y={sc(x, y - 90, zoom).y} size={0.045} kind="tag" pin at={at(14.4)} />
    </AbsoluteFill>
  );
};

// 15.85 "tried to reach this same part of the Moon."
export const LunaTargetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const zoom = push(frame, dur, 1.0, 1.06);
  const k = ramp(t, 16.0, 17.4, Easing.out(Easing.cubic));
  const tp = moonProj(43.5, -69.5, { lon: 20, lat: -55 });
  const tgt: [number, number] = [-80 + tp[0] * 420, -40 + tp[1] * 420];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={420} x={-80} y={-40} view={{ lon: 20, lat: -55 }} pins={[{ lon: 43.5, lat: -69.5, color: "#e2453a", r: 20 }, { lon: 32.3, lat: -69.4, color: "#ff9933", r: 20 }]} z={-10} />
          <X x={600} y={160} s={0.42} rot={0.3} z={-5}>
            <Luna25 />
          </X>
          <Line pts={[[540, 200], [540 + (tgt[0] - 540) * k, 200 + (tgt[1] - 200) * k]]} width={12} color="#fe5649" z={-4} />
        </SpaceSet>
      </Stage>
      <Label text="SOUTH POLE REGION" x={0.08} y={0.84} size={0.045} kind="box" at={at(16.7)} />
    </AbsoluteFill>
  );
};

// 18.2 "It lost control and smashed into the surface."
export const LunaCrashShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const fall = ramp(t, 18.3, 20.0, Easing.in(Easing.quad));
  const boom = ramp(t, 20.0, 21.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: 60, shake: hitAt(t, 20.0, 0.7) * 22 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarSurface horizon={-120} sun={[-1300, 40]} seed={5} rocks={7} craters={5}>
          {boom < 0.05 ? (
            <X x={interpolate(fall, [0, 1], [-700, 260])} y={interpolate(fall, [0, 1], [760, -380])} rot={fall * 7 + Math.sin(frame * 0.6) * 0.2} s={0.6} z={-5}>
              <Luna25 y={-220} thrust={t < 18.9 ? 0.5 : 0} />
            </X>
          ) : null}
          <Fireball t={boom} x={260} y={-360} size={1.2} seed={7} z={-4} />
          <ImpactPlume t={boom} x={260} y={-400} size={1.2} z={-4.5} />
        </LunarSurface>
      </Stage>
      <Flash k={Math.max(0, 1 - Math.abs(t - 20.05) / 0.15) * 0.8} />
      <Label text="CRASHED" x={0.62} y={0.2} size={0.08} kind="stamp" at={at(20.3)} />
    </AbsoluteFill>
  );
};

// 21.47 "Now it's India's turn."
export const IndiaTurnShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 80 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6} bgBlur={8} bg={<ControlRoom floor={-700} screen={<DescentScreen k={0.55} />} />}>
        <NationFlag kind="india" x={420} y={-560} w={420} pole={1050} z={-6} />
        <Character {...YOU} x={-300} y={-560} s={1.55} facing={1} look={0.5} expression={{ eyes: "open", mouth: t > 22.0 ? "flat" : "smile", gaze: [0.4, 0.4], brows: 0.5, sweat: t > 22.1 }} pose={poses.idle(frame, 1)} z={-2} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 23.17 "The room goes quiet."
export const QuietShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.7} bgBlur={8} bg={<ControlRoom floor={-700} screen={<DescentScreen k={0.6} />} />}>
        {[0, 2, 5].map((i, n) => (
          <Character key={i} {...ENGINEER(i)} x={-660 + n * 660} y={-700} s={1.4} facing={n === 2 ? -1 : 1} look={0.7} expression={{ eyes: "wide", mouth: "flat", gaze: [n === 2 ? -0.3 : 0.3, 0.8], brows: 0.6, sweat: n !== 1 }} pose={n === 1 ? poses.pray(frame) : poses.idle(frame, i)} z={-2 - n * 0.1} />
        ))}
        <X x={0} y={420} s={0.9} z={-3}>
          <Clock r={120} speed={6} />
        </X>
      </DepthStage>
    </AbsoluteFill>
  );
};

// 25.12 "The lander slows down."
export const SlowsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const y = interpolate(t, [24.7, 26.6], [80, -60], { easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 0, shake: 2 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-60} sun={[-1500, 20]} seed={9} earth={[1100, 520, 80]}>
          <Vikram x={0} y={y} s={0.95} thrust={0.9} seed={3} z={-4} />
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 26.79 "It turns upright."
export const UprightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 26.8, 27.8, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: 160 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-200} sun={[-1500, -100]} seed={11} rocks={6}>
          <X x={60} y={260} rot={(1 - k) * -1.35} z={-4}>
            <Vikram y={-230} thrust={0.8} seed={4} />
          </X>
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 28.29 "And at 6:04 in the evening, it touches down."
export const TouchdownShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const land = 30.5;
  const y = t < land ? interpolate(t, [28.0, land], [330, 0], { easing: Easing.out(Easing.quad) }) : 0;
  const dust = ramp(t, 29.4, 31.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: -160, shake: hitAt(t, land, 0.4) * 6 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-40} sun={[-1500, 60]} seed={13} rocks={8} craters={4}>
          <Vikram x={0} y={-420 + y} s={1.05} thrust={t < land + 0.2 ? 0.75 : 0} seed={5} z={-4} />
          <LandingDust k={dust} y={-420} spread={700} s={1.1} z={-3} />
        </LunarSurface>
      </Stage>
      <Label text="6:04 PM" x={0.08} y={0.1} size={0.06} kind="title" at={at(28.6)} />
      <Label text="TOUCHDOWN" x={0.6} y={0.2} size={0.07} kind="stamp" at={at(30.5)} />
    </AbsoluteFill>
  );
};

// 31.68 "India becomes the first country ever to land near the Moon's south pole."
export const CelebrateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cheer = (i: number) => (t > 31.5 + i * 0.12 ? poses.armsUp(frame + i * 7) : poses.idle(frame, i));
  const cam = { zoom: 0.92, y: 330 };
  const back = [0.31, 0.69].map((fx, n) => ({ ...atHead(cam, fx, 0.36, 1.15), i: n + 2 }));
  const front = [
    { ...atHead(cam, 0.13, 0.64, 1.75), i: 0, f: 1 as const },
    { ...atHead(cam, 0.87, 0.64, 1.75), i: 1, f: -1 as const },
  ];
  const you = atHead(cam, 0.5, 0.6, 2.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <ControlRoom floor={-420} screen={<DescentScreen k={1} upright={1} done={1} />} consoles={false}>
          {back.map((p) => (
            <Character key={p.i} {...ENGINEER(p.i)} x={p.x} y={p.y} s={1.15} facing={p.i % 2 ? -1 : 1} look={0.4} expression={{ eyes: "happy", mouth: "open", blush: true }} pose={cheer(p.i)} z={-8} />
          ))}
          {front.map((p) => (
            <Character key={p.i} {...ENGINEER(p.i)} x={p.x} y={p.y} s={1.75} facing={p.f} look={0.4} expression={{ eyes: "happy", mouth: p.i % 2 ? "grin" : "open", blush: true }} pose={cheer(p.i)} z={-5} />
          ))}
          <Character {...YOU} x={you.x} y={you.y} s={2.0} facing={1} look={0.3} expression={{ eyes: "happy", mouth: "grin", blush: true }} pose={cheer(9)} z={-3} />
          <NationFlag kind="india" x={1400} y={-500} w={300} pole={900} z={-9} />
        </ControlRoom>
      </Stage>
      <Label text="FIRST NEAR THE SOUTH POLE" x={0.5} y={0.1} size={0.05} kind="title" at={at(34.6)} />
    </AbsoluteFill>
  );
};

/** Small rocket icon (with a flag) heading in `rot`. */
const FlagRocket: React.FC<{ x: number; y: number; rot: number; kind: "india" | "china" | "russia" | "usa"; s?: number; z?: number }> = ({ x, y, rot, kind, s = 1, z = 0 }) => (
  <X x={x} y={y} rot={rot} s={s} z={z}>
    <Part shape={roundRect(70, 200, 34)} color="#eef0f3" shade={0.3} />
    <Part shape={circle(16)} color="#2a3a5a" flat outline={4} y={40} z={0.001} />
    <NationFlag kind={kind} w={80} pole={0} x={-40} y={-24} wave={0} z={0.002} />
    <Part shape={roundRect(110, 26, 12)} color="#c8462f" flat outline={4} y={-86} z={-0.001} />
    <Glow rx={50} ry={90} y={-150} color="#ffb04a" alpha={0.7} additive z={-0.002} />
    <Part shape={roundRect(30, 60, 14)} color="#ffd84a" flat outline={0} y={-126} z={-0.001} />
  </X>
);

// 36.8 "So why are so many countries racing to the same spot?"
export const RaceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 36.4, 39.4, Easing.out(Easing.quad));
  const ships: [number, number, "india" | "china" | "russia" | "usa"][] = [
    [-1.0, 1, "india"],
    [0.4, 1, "usa"],
    [2.2, 1, "china"],
    [3.6, 1, "russia"],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={380} view={{ lon: 0, lat: -90 }} pins={[{ lon: 0, lat: -90, color: "#fe5649", r: 22 }]} z={-10} />
          {ships.map(([a, , kind], i) => {
            const d = interpolate(k, [0, 1], [980, 470]);
            return <FlagRocket key={kind} kind={kind} x={Math.cos(a) * d} y={Math.sin(a) * d} rot={a + Math.PI / 2} s={0.8} z={-5 + i * 0.01} />;
          })}
        </SpaceSet>
      </Stage>
      <Label text="SAME SPOT" x={0.5} y={0.88} size={0.05} kind="title" at={at(38.6)} />
    </AbsoluteFill>
  );
};

// 39.7 "The darkest, coldest, most dangerous part of the Moon?"
export const DarkestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.9), y: -80 }} light={{ dir: [-0.9, 0.3] }} vignette={0.75}>
        <LunarSurface horizon={180} sun={[-1700, 210]} seed={21} rocks={10} craters={2}>
          <GroundCrater x={140} y={-260} r={760} sq={0.32} shadow={0.97} z={-30} />
        </LunarSurface>
      </Stage>
      <Label text="DARKEST" x={0.08} y={0.1} size={0.045} kind="box" at={at(39.8)} />
      <Label text="COLDEST" x={0.08} y={0.19} size={0.045} kind="box" at={at(40.6)} />
      <Label text="MOST DANGEROUS" x={0.08} y={0.28} size={0.045} kind="box" color="#fe5649" at={at(41.6)} />
    </AbsoluteFill>
  );
};

// 43.3 "Coming up, a giant mystery buried under the Moon."
export const TeaserMassShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={400} view={{ lon: 180, lat: -35 }} xray={ramp(t, 44.6, 45.4)} mass={ramp(t, 45.2, 46.0)} grid={ramp(t, 44.6, 45.4)} basin={1} z={-10} />
          <QuestionMark x={520} y={240} s={1.1 * pop(t, 45.6)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="COMING UP" x={0.08} y={0.1} size={0.045} kind="box" at={at(43.3)} />
    </AbsoluteFill>
  );
};

// 46.95 "Craters that haven't seen sunlight in billions of years."
export const TeaserCratersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.5, 0.54), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <CraterSection y={-120} sun={[-1750, 40]} rays={ramp(t, 46.8, 47.8)} ice={ramp(t, 48.4, 49.6)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="NO SUNLIGHT" x={0.5} y={0.3} size={0.05} kind="title" at={at(48.1)} />
    </AbsoluteFill>
  );
};

// 50.12 "A rocket smashed into the Moon on purpose."
export const TeaserRocketShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = 51.3;
  const k = ramp(t, 49.9, hit, Easing.in(Easing.quad));
  const boom = ramp(t, hit, hit + 1.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.75), y: 120, shake: hitAt(t, hit, 0.6) * 20 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <LunarSurface horizon={0} sun={[-1500, 60]} seed={31}>
          <GroundCrater x={120} y={-360} r={620} sq={0.3} shadow={0.95} z={-30} />
          {boom < 0.02 ? (
            <X x={interpolate(k, [0, 1], [-800, 120])} y={interpolate(k, [0, 1], [1100, -330])} rot={2.5} s={0.55} z={-5}>
              <CentaurStage shepherd={false} />
            </X>
          ) : null}
          <ImpactPlume t={boom} x={120} y={-360} size={1.3} z={-4} />
        </LunarSurface>
      </Stage>
      <Flash k={Math.max(0, 1 - Math.abs(t - hit) / 0.14) * 0.85} />
    </AbsoluteFill>
  );
};

// 52.64 "Mountains where the Sun almost never sets."
export const TeaserPeaksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sx = interpolate(t, [52.4, 56.1], [-1600, 1500]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.66), y: 160 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-40} sun={[sx, 90 + Math.sin((t - 52.4) * 0.8) * 20]} seed={41} ridges={1.6} rocks={5} craters={3}>
          {[-900, 0, 900].map((x, i) => (
            <Glow key={x} rx={300} ry={160} x={x + 40} y={200 + i * 30} color="#ffe27a" alpha={0.25 + 0.1 * Math.sin(frame * 0.1 + i)} additive z={-0.24} />
          ))}
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 56.19 "And a 'trillion-dollar fuel' that might not be the real prize at all."
export const TeaserFuelShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.04) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <Glow rx={500} color="#ffd84a" alpha={0.25} additive y={0} z={-11} />
          <GasCanister x={0} y={-330} s={1.6} color="#e0a83a" z={-10} />
          {Array.from({ length: 10 }, (_, i) => {
            const ph = (t * 0.45 + i * 0.137) % 1;
            return <GoldCoin key={i} x={-760 + i * 170} y={620 - ph * 1300} rot={ph * 6 + i} s={0.7} z={-9 + i * 0.01} />;
          })}
          <QuestionMark x={520} y={180} s={1.0 * pop(t, 58.2)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="HELIUM-3" x={0.5} y={0.7} size={0.045} kind="box" at={at(56.5)} />
      <Label text="TRILLION-DOLLAR FUEL" x={0.5} y={0.1} size={0.05} kind="title" at={at(56.4)} />
    </AbsoluteFill>
  );
};

// 60.2 "But first, we go back about 4 billion years,"
export const BackInTimeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const spin = ramp(t, 59.8, 63.0, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12), rot: -spin * 0.3 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet seed={9}>
          <MoonGlobe r={360} view={{ lon: 180 - spin * 260, lat: -10 }} craters={Math.round(70 - spin * 50)} z={-10} />
          {Array.from({ length: 8 }, (_, i) => (
            <Line key={i} pts={Array.from({ length: 12 }, (_, k) => [Math.cos(i * 0.8 + k * 0.12 - spin * 4) * (520 + i * 40), Math.sin(i * 0.8 + k * 0.12 - spin * 4) * (520 + i * 40)] as [number, number])} width={6} color="#9ab8ff" opacity={0.35 * spin} z={-11} />
          ))}
        </SpaceSet>
      </Stage>
      <Label text="4 BILLION YEARS AGO" x={0.5} y={0.86} size={0.06} kind="title" at={at(61.9)} />
    </AbsoluteFill>
  );
};

// 63.48 "to the day something huge hit the Moon."
export const ApproachShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 63.3, 66.0, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet seed={9}>
          <MoonGlobe r={520} x={-380} y={-140} view={{ lon: 180, lat: -20 }} craters={25} z={-10} />
          <SpaceRock x={interpolate(k, [0, 1], [900, 120])} y={interpolate(k, [0, 1], [500, 60])} size={interpolate(k, [0, 1], [90, 180])} rot={t * 0.6} seed={3} z={-5} />
          <Globe r={60} x={820} y={-380} lon0={62} lat0={12} glow={1.2} z={-12} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

export { IceFlake };
