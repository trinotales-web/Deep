import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, Gradient, QuestionMark, Spear, roundRect, circle, ellipse, poly, blob, ramp, push, hitAt, absT, rng, mixHex, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MesoMap, mesoXY, siteXY, TikalTemple, ElCastillo, MayaPyramid, MayaHut, Cenote, Canoe, Jungle, Vines, Sunburst, Sun, Cloud, Smoke, Flame, CornPlant, Stump,
  SedimentCore, DnaHelix, CalendarGear, Rain, Candle, Lake, Ceiba,
} from "../../kit/env";
import { sec, pop, useScr, GrowArrow } from "../../kit/shot";
import { JungleSet, LakeSet, PlazaSet, Paper, Underworld, Village } from "./sets";
import {
  MAYA_KING, MAYA_PRIEST, MAYA_COMMONER, MAYA_WOMAN, JAGUAR_WARRIOR, SCIENTIST, HUNAHPU, XBALANQUE, MAYA_QUEEN,
} from "./cast";
import { CanoeWarrior, upright } from "./p1a";
import { KingdomsMap } from "./p1c";

// Second video, part A: why the southern cities emptied (drought), the move north,
// Chichén Itzá, El Castillo and the sacred cenote. Seconds on maya-2.voice.m4a.

type P = [number, number];

/** Dry, cracked earth (top edge at y=0). */
const CrackedGround: React.FC<{ w?: number; h?: number; z?: number; seed?: number }> = ({ w = 4400, h = 1400, z = -30, seed = 3 }) => {
  const r = rng(seed);
  const cracks = Array.from({ length: 34 }, () => {
    const x = (r() - 0.5) * w * 0.9;
    const y = -40 - r() * (h - 120);
    return [[x, y], [x + (r() - 0.5) * 160, y - 40 - r() * 60], [x + (r() - 0.5) * 220, y - 90 - r() * 80]] as P[];
  });
  return (
    <X z={z}>
      <Gradient w={w} h={h} y={-h / 2} stops={[[0, "#e2c48a"], [1, "#c8a46a"]]} />
      <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={6} z={0.01} />
      {cracks.map((pts, i) => (
        <Line key={i} pts={pts} width={5} color="#8a6a42" z={0.02} />
      ))}
    </X>
  );
};

/** A small pictogram child (DNA-study grid). Origin = feet. */
const KidIcon: React.FC<{ x?: number; y?: number; s?: number; color: string; z?: number; ring?: number }> = ({ x = 0, y = 0, s = 1, color, z = 0, ring = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    {ring > 0 ? <Glow y={60} rx={110} color="#fff2c6" alpha={0.6 * ring} additive z={-0.01} /> : null}
    <Part shape={roundRect(70, 80, 30)} color={color} shade={0.2} y={40} />
    <Part shape={circle(30)} color="#f6f5f8" shade={0.24} y={112} z={0.001} />
  </X>
);

// 0.0 "So what happened?"
export const SoWhatShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.12, 1.2), y: 60 }} light={{ dir: [0.6, 0.3] }} vignette={0.8} vignetteColor="#0a0a10" bgBlur={5} bg={<JungleSet mood="dusk" horizon={-300}><TikalTemple x={-60} y={-300} s={1.25} overgrown={0.85} z={-20} /></JungleSet>}>
        <QuestionMark x={430} y={180} s={1.0 * pop(t, 0.75)} rot={0.12} z={5} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 1.7 "Scientists studying the mud at the bottom of a lake in Mexico found part of the answer."
export const LakeCoreShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lift = ramp(t, 2.4, 4.6, Easing.out(Easing.cubic));
  const bob = Math.sin(frame * 0.07) * 6;
  const armA: [number, number] = [2.3, 0.35];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -80 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={4} bg={<LakeSet mood="day" horizon={140} island={false} />}>
        <X y={-520 + bob} z={1}>
          <Character {...SCIENTIST(1)} x={-330} y={40} s={1.55} z={0.5} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={{ ...poses.sit(frame), armF: [1.4, 0.9] }} />
          <Character {...SCIENTIST(0)} x={170} y={60} s={1.7} z={0.6} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "open", brows: 0.4 }} pose={{ ...poses.idle(frame), armF: armA, armB: [2.1, 0.4], armsOverHead: false }} />
          <SedimentCore x={300} y={-240 + lift * 640} w={92} h={700} z={0.55} />
          <Canoe y={-10} len={1100} color="#e8e2d4" paint="#f08a2a" z={0.7} />
        </X>
        <Part shape={roundRect(4000, 520, 0)} color="#4aa0b0" flat outline={0} opacity={0.0} y={-900} />
      </DepthStage>
      <Label text="LAKE CHICHANCANAB" sub="YUCATÁN, MEXICO" x={0.3} y={0.1} size={0.05} kind="box" at={sec(start)(3.9)} />
      <Label text="LAKE MUD" x={0.78} y={0.16} size={0.045} kind="box" at={sec(start)(2.8)} />
    </AbsoluteFill>
  );
};

// 6.2 "Drought."
export const DroughtCoreShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.45), rot: 0.0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7}>
        <Gradient w={6000} h={4000} stops={[[0, "#2a3a44"], [1, "#141c22"]]} z={-41} />
        <SedimentCore x={0} y={0} w={150} h={1000} rot={Math.PI / 2} mark={ramp(t, 6.35, 6.6)} z={1} />
      </Stage>
      <Label text="DROUGHT" x={0.5} y={0.22} size={0.12} kind="stamp" rotate={-6} at={sec(start)(6.42)} />
    </AbsoluteFill>
  );
};

/** Rainfall bars AD 600–1200 with the drought dip. */
const RainChart: React.FC<{ t: number; drop: number; worst: number }> = ({ t, drop, worst }) => {
  const years = Array.from({ length: 13 }, (_, i) => 600 + i * 50);
  const base = 420;
  return (
    <X y={-300}>
      <Line pts={[[-800, 0], [820, 0]]} width={8} />
      <Line pts={[[-800, 0], [-800, 560]]} width={8} />
      {years.map((yr, i) => {
        const inDrought = yr >= 750 && yr <= 1050;
        const isWorst = yr === 900;
        const k = inDrought ? (isWorst ? 1 - drop * 0.5 - worst * 0.2 : 1 - drop * 0.5) : 1;
        const h = base * k * (0.92 + ((i * 37) % 10) / 100);
        const x = -720 + i * 122;
        return (
          <X key={yr} x={x} z={0.01 + i * 0.001}>
            <Part shape={roundRect(78, h, 10)} color={inDrought ? mixHex("#3a9ac9", "#d9864a", drop * 0.7 + (isWorst ? worst * 0.3 : 0)) : "#3a9ac9"} shade={0.22} y={h / 2} />
            <Part shape={blob([[0, 30], [16, 4], [10, -14], [-10, -14], [-16, 4]], 6)} color="#8fd0f0" flat outline={3} y={h + 34} s={inDrought ? 1 - drop * 0.6 : 1} z={0.001} />
          </X>
        );
      })}
      {drop > 0 ? (
        <Part shape={roundRect(122 * 7, 600, 20)} color="#d9864a" flat outline={0} opacity={0.15 * drop} x={-720 + 122 * 6} y={280} z={-0.01} />
      ) : null}
    </X>
  );
};

// 7.1 "Between about 750 and 1050, rainfall drops by about half."
export const RainfallChartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper color="#e9dcbc">
          <RainChart t={t} drop={ramp(t, 10.0, 11.2)} worst={0} />
        </Paper>
      </Stage>
      <Label text="RAINFALL" x={0.17} y={0.1} size={0.045} kind="box" at={sec(start)(7.3)} />
      <Label text="AD 750 – 1050" x={0.55} y={0.1} size={0.06} kind="box" at={sec(start)(8.1)} />
      <Label text="−50%" x={0.55} y={0.33} size={0.09} kind="stamp" rotate={-5} at={sec(start)(11.2)} />
      <Label text="600" x={0.13} y={0.86} size={0.03} kind="tag" at={0} />
      <Label text="900" x={0.5} y={0.86} size={0.03} kind="tag" at={0} />
      <Label text="1200" x={0.88} y={0.86} size={0.03} kind="tag" at={0} />
    </AbsoluteFill>
  );
};

// 11.95 "At its worst, by up to 70%."
export const WorstShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wilt = ramp(t, 12.4, 13.8);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60, shake: hitAt(t, 13.45, 0.35) * 6 }} light={{ dir: [0.5, 0.6] }} vignette={0.6} vignetteColor="#2a140a" bgBlur={4}
        bg={
          <>
            <Gradient w={6000} h={4000} y={1400} stops={[[0, "#f6c46a"], [0.6, "#f2dca0"], [1, "#f6e8c0"]]} z={-41} />
            <Sun x={520} y={330} r={130} glow={1} z={-40} />
            <Glow x={520} y={330} rx={900} color="#ffe6a0" alpha={0.5} additive z={-39} />
            <CrackedGround z={-30} />
          </>
        }
      >
        {[-560, -220, 130, 470].map((x, i) => (
          <X key={x} x={x} y={-420 - (i % 2) * 40} z={1 + i * 0.01} rot={wilt * (i % 2 ? 0.2 : -0.15)}>
            <CornPlant h={520} grow={1} seed={i + 2} dry={0.3 + wilt * 0.7} />
          </X>
        ))}
      </DepthStage>
      <Label text="UP TO −70%" x={0.5} y={0.14} size={0.09} kind="stamp" rotate={-5} at={sec(start)(13.45)} />
    </AbsoluteFill>
  );
};

// 14.5 "The holy king's job is to keep the rain coming."
export const RainKingJobShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65} vignetteColor="#0e1418">
        <JungleSet mood="storm" horizon={-420}>
          {[-700, -150, 450].map((x, i) => (
            <Cloud key={x} x={x} y={620 + (i % 2) * 60} w={620} seed={i + 11} color="#6a7480" shadow="#4a5260" z={-38} />
          ))}
          <Rain y={140} w={2600} h={1200} n={110} z={-37} />
          <MayaPyramid x={0} y={-420} w={1100} h={400} tiers={6} top={0.46} templeW={0} color="#e6dcc4" z={-25} />
          <Character {...MAYA_KING(0)} x={0} y={-20} s={1.25} z={2} look={0.3} expression={{ eyes: "closed", mouth: "open", brows: 0.2 }} pose={poses.armsUp(frame)} />
        </JungleSet>
      </Stage>
      <Label text="HOLY LORD" x={0.2} y={0.1} size={0.05} kind="box" at={sec(start)(15.0)} />
      <Label text="JOB: BRING THE RAIN" x={0.72} y={0.1} size={0.045} kind="box" at={sec(start)(16.2)} />
    </AbsoluteFill>
  );
};

// 17.25 "And the rain stops."
export const RainStopsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const clear = ramp(t, 17.5, 18.2);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.2, 1.3), y: -120 }} light={{ dir: [0.5, 0.6] }} vignette={0.7} bgBlur={5}
        bg={
          <>
            <Gradient w={6000} h={4000} y={1400} stops={[[0, mixHex("#5a6470", "#f2c46a", clear)], [1, mixHex("#8a929c", "#f6e2b0", clear)]]} z={-41} />
            <Sun x={560} y={360} r={120} glow={clear} s={clear} z={-40} />
            <CrackedGround z={-30} />
          </>
        }
      >
        <Character {...MAYA_KING(0)} x={-120} y={-860} s={2.0} z={2} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.9, sweat: clear > 0.5, gaze: [0.5, 0.6] }} pose={{ ...poses.idle(frame), armF: [2.4 - clear * 1.2, 0.4], armB: [2.2 - clear * 1.4, 0.4] }} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 18.6 "Wars get worse."
export const WarsWorseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const charge = ramp(t, 18.6, 19.8);
  const arm: [number, number] = [1.5, 0.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.08, 1.15), y: -40, shake: hitAt(t, 19.25, 0.3) * 8 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#1a0a0a">
        <JungleSet mood="dusk" horizon={-240}>
          <Smoke x={-200} y={-240} w={500} h={900} alpha={0.4} seed={4} z={-20} />
          <Smoke x={600} y={-240} w={400} h={800} alpha={0.35} seed={7} z={-20} />
          {[0, 1].map((i) => (
            <Character key={`a${i}`} {...JAGUAR_WARRIOR(i)} x={-640 - i * 300 + charge * 160} y={-600 - i * 20} s={1.3 - i * 0.12} z={2 - i * 0.1} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ ...poses.run(frame + i * 5), armF: arm }} holdF={<Spear rot={upright(arm) - 0.5} length={560} tip="#2a2228" />} />
          ))}
          {[0, 1].map((i) => (
            <Character key={`b${i}`} {...MAYA_COMMONER(i + 1)} hat="plume" hatColor="#2f6fa8" marks="paint" x={560 + i * 300 - charge * 140} y={-610 - i * 20} s={1.25 - i * 0.1} z={1.8 - i * 0.1} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "teeth", brows: -0.8 }} pose={{ ...poses.run(frame + 9 + i * 4), armF: arm }} holdF={<Spear rot={upright(arm) - 0.5} length={540} tip="#2a2228" />} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="MORE WAR" x={0.5} y={0.12} size={0.065} kind="box" at={sec(start)(19.2)} />
    </AbsoluteFill>
  );
};

// 19.85 "There are too many people, too few trees, and not enough rain."
export const TooManyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cx = interpolate(t, [19.85, 21.0, 21.9, 23.4], [-1250, -1250, 0, 1250], { easing: Easing.inOut(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r = rng(31);
  const crowd = Array.from({ length: 22 }, () => [-1250 + (r() - 0.5) * 900, -420 - r() * 280] as P).sort((a, b) => b[1] - a[1]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, x: cx, y: -120 }} light={{ dir: [0.5, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-200} ground="#c8b07a" jungle={false}>
          {crowd.map(([x, y], i) => (
            <Character key={i} {...(i % 3 ? MAYA_COMMONER(i) : MAYA_WOMAN(i))} x={x} y={y} s={0.55 + (-420 - y) * 0.0004} z={1 + i * 0.001} facing={i % 2 ? 1 : -1} look={0.5} expression={{ eyes: i % 4 ? "half" : "open", mouth: i % 3 ? "flat" : "wavy", brows: 0.4 }} pose={poses.idle(frame, i)} shadow={false} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <Stump key={i} x={-380 + i * 95 + ((i * 53) % 40)} y={-300 - (i % 3) * 90} w={70 + (i % 3) * 18} z={1 + i * 0.01} />
          ))}
          <X x={1250} y={-200} z={0.5}>
            <CrackedGround w={2600} h={800} z={0} seed={8} />
            {[-260, 0, 260].map((x, i) => (
              <X key={x} x={x} y={-100 - (i % 2) * 60} rot={(i - 1) * 0.3} z={1 + i * 0.01}>
                <CornPlant h={420} grow={1} seed={i + 5} dry={1} />
              </X>
            ))}
            <Sun x={300} y={760} r={110} glow={1} z={-1} />
          </X>
        </JungleSet>
      </Stage>
      <Label text="TOO MANY PEOPLE" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(20.3)} until={sec(start)(21.4)} />
      <Label text="TOO FEW TREES" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(21.4)} until={sec(start)(22.6)} />
      <Label text="NOT ENOUGH RAIN" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(22.6)} />
    </AbsoluteFill>
  );
};

// 23.5 "People lose faith in their kings,"
export const LoseFaithShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const turn = t > 24.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -80 }} light={{ dir: [0.5, 0.6] }} vignette={0.6}>
        <PlazaSet mood="dusk" horizon={-240}>
          <MayaPyramid x={560} y={-380} w={800} h={300} tiers={4} top={0.6} templeW={0} color="#e6dcc4" z={0} />
          <Character {...MAYA_KING(1)} x={560} y={-80} s={0.95} z={2} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "open", brows: 0.8, sweat: true }} pose={poses.armsUp(frame)} />
          {[-820, -560, -300, -60].map((x, i) => (
            <Character key={x} {...(i % 2 ? MAYA_WOMAN(i) : MAYA_COMMONER(i))} x={x} y={-760 - (i % 2) * 40} s={1.3} z={3 + i * 0.01} facing={turn ? -1 : 1} look={0.5} expression={turn ? { eyes: "half", mouth: "frown", brows: -0.6 } : { eyes: "open", mouth: "flat", brows: 0.3 }} pose={turn ? { ...poses.idle(frame, i), armF: [0.9, -1.9], armB: [-0.9, 1.9] } : poses.idle(frame, i)} />
          ))}
        </PlazaSet>
      </Stage>
      <Label text="NO RAIN = NO FAITH" x={0.3} y={0.12} size={0.05} kind="box" at={sec(start)(24.2)} />
    </AbsoluteFill>
  );
};

/** A family walking away with bundles on their backs (facing −x). */
export const Leavers: React.FC<{ x: number; y: number; s?: number; seed?: number; facing?: 1 | -1 }> = ({ x, y, s = 1, seed = 0, facing = -1 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} z={2}>
      {[0, 1, 2].map((i) => (
        <X key={i} x={i * 230 * -facing} y={-i * 14} z={-i * 0.1}>
          <Character {...(i === 1 ? MAYA_WOMAN(seed + i) : MAYA_COMMONER(seed + i))} s={s * (i === 2 ? 0.75 : 1)} facing={facing} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.5 }} pose={poses.walk(frame + i * 7, 0.7)} />
          <Part shape={roundRect(150, 170, 40)} color={["#c8a878", "#d9b07a", "#b8986a"][i]} shade={0.24} x={-facing * 60 * s} y={300 * s} s={s * (i === 2 ? 0.75 : 1)} z={-0.05} />
        </X>
      ))}
    </X>
  );
};

// 25.3 "and they leave."
export const TheyLeaveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const walk = frame * 4;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -60 }} light={{ dir: [0.5, 0.5] }} vignette={0.65} vignetteColor="#140a10">
        <PlazaSet mood="dusk" horizon={-240} overgrown={0.2}>
          <Leavers x={-100 - walk} y={-640} s={1.15} seed={2} />
        </PlazaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 26.25 "But here's what most people get wrong."
export const MostWrongShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: hitAt(t, 27.75, 0.3) * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e2d2a8">
          <X rot={-0.04} z={1}>
            <Part shape={roundRect(1300, 760, 14)} color="#f4ecd8" shade={0.16} />
            <Part shape={roundRect(1220, 26, 6)} color="#2a2026" flat outline={0} y={290} z={0.001} />
            <Part shape={roundRect(520, 380, 8)} color="#d8ccb0" flat outline={4} x={-320} y={-60} z={0.001} />
            <X x={-320} y={-230} s={0.42} z={0.002}>
              <TikalTemple overgrown={0.6} />
            </X>
            {Array.from({ length: 7 }, (_, i) => (
              <Line key={i} pts={[[60, 120 - i * 52], [560 - (i % 3) * 60, 120 - i * 52]]} width={10} color="#b8ac94" z={0.001} />
            ))}
          </X>
        </Paper>
      </Stage>
      <Label text="THE MAYA VANISHED!" x={0.5} y={0.17} size={0.06} kind="box" at={sec(start)(26.3)} />
      <Label text="WRONG" x={0.62} y={0.55} size={0.13} kind="stamp" rotate={-10} at={sec(start)(27.72)} />
    </AbsoluteFill>
  );
};

// 28.35 "The Maya don't vanish."
export const DontVanishShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -100 }} light={{ dir: [-0.6, 0.5] }} vignette={0.55} bgBlur={6}
        bg={<Village mood="dawn" horizon={-260}><Sunburst y={-100} r={2400} rays={20} color="#f6d890" alt="#f0cc7a" speed={0.3} z={-39.5} /></Village>}
      >
        <Character {...MAYA_COMMONER(0)} x={-430} y={-880} s={1.75} z={2} look={0.45} expression={{ eyes: "happy", mouth: "smile", brows: -0.2 }} pose={poses.handsOnHips} />
        <Character {...MAYA_WOMAN(1)} x={70} y={-900} s={1.8} z={2.1} look={0.45} expression={{ eyes: "open", mouth: "smile", brows: -0.1 }} pose={poses.idle(frame, 2)} />
        <Character {...MAYA_COMMONER(5)} x={480} y={-860} s={1.3} z={2.2} facing={-1} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} />
      </DepthStage>
      <Label text="THEY DON'T VANISH" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(28.9)} />
    </AbsoluteFill>
  );
};

// 30.05 "Remember the rule? There's no empire to collapse."
export const NoEmpireAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 100;
  const center: [number, number] = [-89.8, 17.6];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <KingdomsMap ppd={ppd} center={center} k={ramp(t, 30.2, 31.2)} crowns={ramp(t, 30.6, 31.0)} />
      </Stage>
      <Label text="THE RULE" sub="NEVER ONE KING" x={0.2} y={0.12} size={0.06} kind="box" at={sec(start)(30.25)} />
      <Label text="NO EMPIRE TO COLLAPSE" x={0.5} y={0.9} size={0.06} kind="box" at={sec(start)(32.3)} />
    </AbsoluteFill>
  );
};

// 33.25 "When the southern cities die, the people walk away and start again."
export const WalkAwayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cx = interpolate(t, [33.25, 36.9], [-500, 700], { easing: Easing.inOut(Easing.quad) });
  const hut = pop(t, 36.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.12, x: cx, y: -80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-240}>
          <TikalTemple x={-1100} y={-240} s={0.9} overgrown={0.7} z={-20} />
          <Leavers x={interpolate(t, [33.25, 36.9], [-500, 380])} y={-660} s={1.0} seed={4} facing={1} />
          <MayaHut x={1180} y={-300} w={300} s={hut} z={1} />
          <MayaHut x={1560} y={-280} w={260} s={pop(t, 36.2)} z={0.9} />
        </JungleSet>
      </Stage>
      <Label text="START AGAIN" x={0.72} y={0.12} size={0.055} kind="box" at={sec(start)(36.0)} />
    </AbsoluteFill>
  );
};

// 36.9 "Many head north, to the Yucatán."
export const HeadNorthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = 95;
  const center: [number, number] = [-89.6, 18.4];
  const z = push(frame, dur, 1.0, 1.05);
  const arrows: [number, number][][] = [
    [[-90.0, 16.8], [-89.9, 18.3], [-89.4, 20.0]],
    [[-89.2, 16.6], [-88.6, 18.4], [-88.3, 20.0]],
    [[-91.4, 17.0], [-91.0, 18.6], [-90.4, 19.9]],
  ];
  const [yx, yy] = mesoXY(-89.0, 20.6, ppd, center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: z }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} />
        {arrows.map((a, i) => (
          <GrowArrow key={i} pts={a.map(([lo, la]) => mesoXY(lo, la, ppd, center))} k={ramp(t, 37.2 + i * 0.2, 38.4 + i * 0.2)} color="#c0392b" width={20} z={1 + i * 0.01} />
        ))}
      </Stage>
      <Label text="SOUTH" x={0.5} y={0.86} size={0.04} kind="box" at={sec(start)(37.0)} />
      <Label text="YUCATÁN" {...sc(yx, yy + 60, z)} size={0.06} kind="title" at={sec(start)(38.25)} />
    </AbsoluteFill>
  );
};

/** Chichén Itzá: El Castillo on a plaza with the Temple of the Warriors and a crowd. */
const ChichenSet: React.FC<{ mood?: "day" | "dawn" | "dusk"; horizon?: number; equinox?: number; crowd?: number; children?: React.ReactNode }> = ({ mood = "day", horizon = -300, equinox = 0, crowd = 0, children }) => {
  const frame = useCurrentFrame();
  const r = rng(77);
  const people = Array.from({ length: Math.round(crowd) }, () => [(r() - 0.5) * 2600, horizon - 160 - r() * 260] as P).sort((a, b) => b[1] - a[1]);
  return (
    <JungleSet mood={mood} horizon={horizon} ground="#e2d6b8" jungle>
      <X z={-28}>
        <MayaPyramid x={-1150} y={horizon} s={0.55} w={1100} h={260} tiers={4} top={0.7} templeW={520} templeH={160} doors={5} color="#ddd0b2" />
        {[-1450, -1350, -1250, -1150, -1050, -950, -850].map((x) => (
          <Part key={x} shape={roundRect(26, 140, 4)} color="#cfc2a4" shade={0.2} x={x} y={horizon + 70} />
        ))}
      </X>
      <ElCastillo x={0} y={horizon} s={1.0} equinox={equinox} z={-24} />
      {people.map(([x, y], i) => (
        <Character key={i} {...(i % 3 ? MAYA_COMMONER(i) : MAYA_WOMAN(i))} x={x} y={y} s={0.42} z={1 + i * 0.001} facing={i % 2 ? 1 : -1} look={0.4} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} shadow={false} />
      ))}
      {children}
    </JungleSet>
  );
};

// 39.45 "And there, a new city becomes the star."
export const NewStarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const star = pop(t, 41.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <ChichenSet mood="dawn" crowd={18}>
          <Sunburst y={180} r={2400} rays={22} color="#f6d890" alt="#f0cc7a" speed={0.4} z={-39.5} />
          <X x={0} y={430} s={star} z={3}>
            <Part shape={poly(Array.from({ length: 10 }, (_, i) => [Math.cos((i / 10) * 6.283 + Math.PI / 2) * (i % 2 ? 60 : 140), Math.sin((i / 10) * 6.283 + Math.PI / 2) * (i % 2 ? 60 : 140)] as P))} color="#f2c84a" shade={0.2} />
            <Glow rx={320} color="#fff2c6" alpha={0.6} additive z={-0.01} />
          </X>
        </ChichenSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 42.35 "Chichén Itzá."
export const ChichenTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.45, 1.55), y: 30 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <ChichenSet mood="day" crowd={0} />
      </Stage>
      <Label text="CHICHÉN ITZÁ" x={0.5} y={0.14} size={0.1} kind="title" at={sec(start)(42.45)} />
    </AbsoluteFill>
  );
};

// 43.75 "Its name means 'at the mouth of the well of the Itza.'"
export const NameMeansShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -160 }} light={{ pos: [0, 600] }} vignette={0.65}>
        <JungleSet mood="day" horizon={260} jungle>
          <Cenote x={0} y={260} w={1100} depth={760} z={-20} />
        </JungleSet>
      </Stage>
      <Label text="CHI'" sub="MOUTH" x={0.24} y={0.12} size={0.06} kind="box" at={sec(start)(45.1)} />
      <Label text="CH'E'EN" sub="WELL" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(45.72)} />
      <Label text="ITZÁ" sub="THE ITZA" x={0.76} y={0.12} size={0.06} kind="box" at={sec(start)(46.3)} />
    </AbsoluteFill>
  );
};

// 47.0 "Yes, the same Itza from our island."
export const SameItzaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame * 0.08) * 6;
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65} vignetteColor="#0e1418" bgBlur={5} bg={<LakeSet mood="dawn" horizon={60} islandX={-480} islandW={900} />}>
        <CanoeWarrior x={220} y={-500 + bob} s={1.95} paddle={false} expression={{ eyes: "happy", mouth: "grin", brows: -0.2, gaze: [0.4, 0] }} />
      </DepthStage>
      <Label text="THE SAME ITZA!" x={0.28} y={0.12} size={0.06} kind="box" at={sec(start)(48.2)} />
    </AbsoluteFill>
  );
};

// 49.75 "Their own stories say their ancestors came from here."
export const AncestorsRouteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = 120;
  const center: [number, number] = [-89.4, 18.9];
  const z = push(frame, dur, 1.0, 1.05);
  const [cx, cy] = siteXY("chichen", ppd, center);
  const [nx, ny] = siteXY("nojpeten", ppd, center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: z }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} pins={["chichen", "nojpeten"]} route={[[-88.57, 20.68], [-88.9, 19.6], [-89.5, 18.4], [-89.88, 16.93]]} routeK={ramp(t, 50.7, 52.4)} />
      </Stage>
      <Label text="CHICHÉN ITZÁ" {...sc(cx, cy + 80, z)} size={0.04} kind="box" at={sec(start)(49.9)} />
      <Label text="THE ITZA ISLAND" {...sc(nx, ny - 70, z)} size={0.04} kind="box" at={sec(start)(52.0)} />
      <Label text="THEIR STORIES" x={0.2} y={0.1} size={0.045} kind="box" at={sec(start)(50.2)} />
    </AbsoluteFill>
  );
};

// 53.0 "Its main pyramid, El Castillo, is a giant calendar."
export const GiantCalendarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const g = ramp(t, 55.4, 56.0, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <ChichenSet mood="day" crowd={0}>
          {g > 0.01 ? (
            <X y={260} s={g} z={-24.5}>
              <CalendarGear r={620} teeth={36} label="months" rot={frame * 0.006} color="#e8d2a0" />
            </X>
          ) : null}
        </ChichenSet>
      </Stage>
      <Label text="EL CASTILLO" sub="KUKULKAN'S TEMPLE" x={0.2} y={0.1} size={0.05} kind="box" at={sec(start)(54.3)} />
      <Label text="A GIANT CALENDAR" x={0.72} y={0.1} size={0.05} kind="box" at={sec(start)(55.6)} />
    </AbsoluteFill>
  );
};

/** El Castillo from above: nine square tiers, a stair on each side, temple on top. */
const CastilloTop: React.FC<{ glowTop?: number; stairs?: number }> = ({ glowTop = 0, stairs = 1 }) => (
  <X>
    {Array.from({ length: 9 }, (_, i) => {
      const w = 1000 - i * 80;
      return <Part key={i} shape={roundRect(w, w, 6)} color={i % 2 ? "#e2d6bc" : "#d8caa8"} shade={0.12} z={i * 0.001} />;
    })}
    {[0, 1, 2, 3].map((k) => (
      <X key={k} rot={(k * Math.PI) / 2} z={0.02}>
        <Part shape={poly([[-70, 280], [70, 280], [80, 500 + 20 * stairs], [-80, 500 + 20 * stairs]])} color="#f0e6d0" flat outline={4} />
        {Array.from({ length: 10 }, (_, j) => (
          <Line key={j} pts={[[-72 - j, 300 + j * 21], [72 + j, 300 + j * 21]]} width={2.5} color="#b8ac90" z={0.001} />
        ))}
      </X>
    ))}
    <Part shape={roundRect(300, 300, 8)} color={mixHex("#e8dcc0", "#fff2c6", glowTop)} shade={0.2} z={0.03} />
    {glowTop > 0 ? <Glow rx={420} color="#fff2c6" alpha={0.6 * glowTop} additive z={0.04} /> : null}
  </X>
);

// 56.85 "Each of its four sides has 91 steps."
export const FourSidesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), rot: push(frame, dur, 0, 0.12) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Gradient w={6000} h={4000} stops={[[0, "#6a9a4a"], [1, "#4a7a3a"]]} z={-41} />
        <CastilloTop />
      </Stage>
      <Label text="91" x={0.5} y={0.06} size={0.065} kind="box" at={sec(start)(58.25)} />
      <Label text="91" x={0.5} y={0.94} size={0.065} kind="box" at={sec(start)(58.35)} />
      <Label text="91" x={0.22} y={0.5} size={0.065} kind="box" at={sec(start)(58.45)} />
      <Label text="91" x={0.78} y={0.5} size={0.065} kind="box" at={sec(start)(58.55)} />
      <Label text="4 SIDES" x={0.12} y={0.1} size={0.045} kind="box" at={sec(start)(57.4)} />
    </AbsoluteFill>
  );
};

// 59.7 "Add the step at the top, and you get 365."
export const Add365Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Gradient w={6000} h={4000} stops={[[0, "#6a9a4a"], [1, "#4a7a3a"]]} z={-41} />
        <CastilloTop glowTop={ramp(t, 60.1, 60.5)} />
      </Stage>
      <Label text="91 × 4 = 364" x={0.5} y={0.08} size={0.06} kind="box" at={sec(start)(59.8)} />
      <Label text="+1" x={0.5} y={0.5} size={0.09} kind="stamp" at={sec(start)(60.3)} />
      <Label text="= 365" x={0.5} y={0.9} size={0.09} kind="title" at={sec(start)(61.4)} />
    </AbsoluteFill>
  );
};

// 62.55 "One for every day of the year."
export const EveryDayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 62.6, 64.0);
  const n = 73;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e9dcbc">
          {Array.from({ length: n }, (_, i) => {
            const a = Math.PI / 2 - (i / n) * Math.PI * 2;
            const on = i / n < k;
            return <Part key={i} shape={roundRect(26, 60, 8)} color={on ? "#d9a441" : "#d8ccb0"} flat outline={3} x={Math.cos(a) * 400} y={Math.sin(a) * 400} rot={a - Math.PI / 2} z={0.01 + i * 0.0001} />;
          })}
          <Sun r={150} glow={0.8} z={1} />
        </Paper>
      </Stage>
      <Label text="365 DAYS" x={0.5} y={0.5} size={0.075} kind="title" at={sec(start)(63.3)} />
      <Label text="1 STEP = 1 DAY" x={0.5} y={0.94} size={0.045} kind="box" at={sec(start)(62.8)} />
    </AbsoluteFill>
  );
};

// 64.25 "And at the spring and autumn equinoxes, the afternoon sun casts a shadow on the stairs."
export const EquinoxShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sunK = ramp(t, 66.4, 67.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 40 }} light={{ dir: [-0.8, 0.35] }} vignette={0.6}>
        <ChichenSet mood="dusk" crowd={26} equinox={ramp(t, 67.9, 69.1)}>
          <Sun x={-820} y={interpolate(sunK, [0, 1], [520, 300])} r={110} glow={0.9} z={-39} />
          <Glow x={-820} y={300} rx={1000} ry={500} color="#ffd8a0" alpha={0.3} additive z={38} />
        </ChichenSet>
      </Stage>
      <Label text="SPRING & AUTUMN EQUINOX" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(65.3)} />
      <Label text="AFTERNOON SUN" x={0.2} y={0.22} size={0.04} kind="box" at={sec(start)(66.6)} />
    </AbsoluteFill>
  );
};

// 69.25 "It looks like a giant snake sliding down the pyramid."
export const SnakeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 69.6, 71.8);
  const sw = 1000 * 0.18;
  const xx = -(sw / 2 + 6);
  const body = Array.from({ length: 24 }, (_, i) => {
    const q = i / 23;
    const y = 440 - q * 400 * k;
    return [xx - 26 + Math.sin(q * 12 + frame * 0.12) * 14 + ((sw / 2 - sw * 0.42) * y) / 440, y] as P;
  });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 2.3, x: -110, y: -60 }} light={{ dir: [-0.8, 0.35] }} vignette={0.65}>
        <ChichenSet mood="dusk" crowd={0} equinox={0.3 + k * 0.7}>
          <X y={-300} z={-23}>
            {k > 0.02 ? <Line pts={body} smooth width={30} color="#fff2c6" opacity={0.55} /> : null}
          </X>
          <Glow x={-130} y={-260} rx={260} color="#fff2c6" alpha={0.35 * k} additive z={-22} />
        </ChichenSet>
      </Stage>
      <Label text="KUKULKAN" sub="THE FEATHERED SERPENT" x={0.72} y={0.14} size={0.055} kind="box" at={sec(start)(70.4)} />
    </AbsoluteFill>
  );
};

// 72.7 "The city is built next to a huge cenote,"
export const SacredCenoteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={20}>
          <ElCastillo x={-760} y={20} s={0.55} z={-26} />
          <Cenote x={300} y={20} w={1100} depth={640} z={-20} />
        </JungleSet>
      </Stage>
      <Label text="THE SACRED CENOTE" x={0.6} y={0.1} size={0.055} kind="box" at={sec(start)(74.2)} />
    </AbsoluteFill>
  );
};

// 75.0 "and people threw offerings into it. Gold, jade, and sometimes humans."
export const OfferingsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const drop = (t0: number) => ramp(t, t0, t0 + 1.1, Easing.in(Easing.quad));
  const arm: [number, number] = [2.2 - hitAt(t, 76.7, 0.5) * 0.8 - hitAt(t, 77.3, 0.5) * 0.8, 0.3];
  const items: [number, string, number][] = [
    [76.75, "gold", 120],
    [77.35, "jade", 260],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.22), x: 120, y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <JungleSet mood="day" horizon={-260}>
          <Cenote x={520} y={-260} w={900} depth={760} beam={0.6} z={-20} />
          <Character {...MAYA_PRIEST(1)} x={-420} y={-260} s={1.35} z={2} look={0.5} expression={{ eyes: "closed", mouth: "o", brows: 0.2 }} pose={{ ...poses.idle(frame), armF: arm, armB: [2.2, 0.3] }} />
          {items.map(([t0, kind, dx], i) => {
            const k = drop(t0);
            if (k <= 0 || k >= 1) return null;
            const x = -220 + dx + k * 380;
            const y = 180 + Math.sin(k * Math.PI) * 140 - k * 900;
            return (
              <X key={i} x={x} y={y} rot={k * 6} z={3}>
                {kind === "gold" ? (
                  <>
                    <Part shape={circle(46)} color="#f2c84a" shade={0.28} />
                    <Part shape={circle(28)} color="#e0b03a" flat outline={3} z={0.001} />
                  </>
                ) : (
                  [0, 1, 2, 3].map((j) => <Part key={j} shape={circle(18)} color="#3fa07a" shade={0.26} x={j * 34 - 50} y={Math.sin(j) * 10} z={j * 0.001} />)
                )}
              </X>
            );
          })}
          {t > 78.4 ? <Smoke x={560} y={-840} w={260} h={300} alpha={0.25 * (1 - ramp(t, 79.0, 79.4))} color="#ffffff" seed={2} z={1} /> : null}
        </JungleSet>
      </Stage>
      <Label text="GOLD" x={0.36} y={0.14} size={0.055} kind="box" at={sec(start)(76.8)} />
      <Label text="JADE" x={0.56} y={0.14} size={0.055} kind="box" at={sec(start)(77.4)} />
      <Label text="…AND HUMANS" x={0.78} y={0.26} size={0.05} kind="box" at={sec(start)(78.7)} />
    </AbsoluteFill>
  );
};

// 79.4 "For a long time, people believed the Maya mostly sacrificed young women here."
export const OldStoryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7} vignetteColor="#2a1a10">
        <Paper color="#d8c08a">
          <X rot={0.02} z={1}>
            <Part shape={roundRect(1500, 900, 12)} color="#5a3a24" shade={0.2} />
            <Part shape={roundRect(1420, 820, 8)} color="#e8d4a8" flat outline={4} z={0.001} />
          </X>
          <X z={2} y={-380}>
            <Cenote x={420} y={0} w={560} depth={360} beam={0} />
            <Character {...MAYA_QUEEN(1)} x={-60} y={0} s={1.0} z={1} look={0.5} expression={{ eyes: "sad", mouth: "frown", brows: 0.8 }} pose={poses.idle(frame)} />
            <Character {...MAYA_PRIEST(0)} x={-430} y={0} s={1.0} z={0.9} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.4 }} pose={poses.point(frame)} />
          </X>
          <Wash width={1420} height={820} color="#a8803a" alpha={0.3} z={3} />
        </Paper>
      </Stage>
      <Label text="THE OLD STORY" x={0.5} y={0.08} size={0.05} kind="box" at={sec(start)(79.6)} />
      <Label text="YOUNG WOMEN?" x={0.5} y={0.92} size={0.05} kind="box" at={sec(start)(82.6)} />
    </AbsoluteFill>
  );
};

// 84.0 "But in 2024, scientists tested the DNA of 64 children."
export const DnaTestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60 }} light={{ dir: [0.5, 0.6] }} vignette={0.55} bgBlur={6}
        bg={<><Gradient w={6000} h={4000} stops={[[0, "#e8eef2"], [1, "#c8d4dc"]]} z={-41} /><Part shape={roundRect(6000, 30, 0)} color="#9aa8b4" flat outline={0} y={-200} z={-40} /></>}
      >
        <Character {...SCIENTIST(3)} x={-420} y={-880} s={1.85} z={2} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: 0.2, gaze: [0.6, 0.4] }} pose={poses.point(frame)} />
        <DnaHelix x={420} y={40} h={760} r={110} s={pop(t, 86.5)} z={1} />
      </DepthStage>
      <Label text="2024" x={0.18} y={0.1} size={0.07} kind="box" at={sec(start)(84.5)} />
      <Label text="DNA" x={0.72} y={0.1} size={0.06} kind="box" at={sec(start)(86.6)} />
      <Label text="64 CHILDREN" x={0.72} y={0.9} size={0.06} kind="box" at={sec(start)(87.5)} />
    </AbsoluteFill>
  );
};

// 88.7 "They were buried in an underground chamber near the sacred cenote."
export const ChamberShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const reveal = ramp(t, 89.4, 90.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} y={2000} stops={[[0, "#8ac8e0"], [1, "#d8eef2"]]} z={-41} />
        <Jungle y={300} w={6000} h={160} seed={12} z={-36} />
        <Cenote x={480} y={300} w={760} depth={640} beam={0.5} z={-20} />
        <X x={-480} y={-20} z={-10}>
          <Part shape={blob([[-300, 0], [-260, -180], [0, -230], [260, -180], [300, 0], [200, 120], [-200, 120]], 10)} color="#3a2a26" flat outline={6} opacity={reveal} />
          <Line pts={[[0, 120], [0, 320]]} width={60} color="#3a2a26" opacity={reveal} z={0.001} />
          {Array.from({ length: 12 }, (_, i) => (
            <Part key={i} shape={ellipse(40, 18)} color="#e8e0cc" shade={0.2} x={-200 + (i % 6) * 80} y={-160 + Math.floor(i / 6) * 50} opacity={reveal} z={0.002 + i * 0.0001} />
          ))}
          <Glow rx={340} ry={200} color="#fff2c6" alpha={0.25 * reveal} additive z={0.01} />
        </X>
      </Stage>
      <Label text="UNDERGROUND CHAMBER" x={0.25} y={0.84} size={0.045} kind="box" at={sec(start)(89.8)} />
      <Label text="SACRED CENOTE" x={0.75} y={0.84} size={0.045} kind="box" at={sec(start)(90.9)} />
    </AbsoluteFill>
  );
};

const GRID = Array.from({ length: 64 }, (_, i) => [(i % 16) - 7.5, Math.floor(i / 16) - 1.5] as P);

// 92.0 "Every one of them was a boy."
export const AllBoysShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper color="#e9dcbc">
          {GRID.map(([gx, gy], i) => {
            const k = ramp(t, 92.6 + (i % 16) * 0.02 + Math.floor(i / 16) * 0.05, 92.8 + (i % 16) * 0.02 + Math.floor(i / 16) * 0.05);
            return <KidIcon key={i} x={gx * 110} y={-gy * 190 - 120} s={0.9} color={mixHex("#b8ac94", "#3a9ac9", k)} z={1 + i * 0.001} />;
          })}
        </Paper>
      </Stage>
      <Label text="64 CHILDREN" x={0.2} y={0.08} size={0.05} kind="box" at={sec(start)(92.1)} />
      <Label text="ALL BOYS" x={0.75} y={0.08} size={0.07} kind="stamp" rotate={-5} at={sec(start)(93.05)} />
    </AbsoluteFill>
  );
};

// 93.7 "Most were between 3 and 6 years old."
export const AgesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper color="#e9dcbc">
          <Line pts={[[-700, -400], [700, -400]]} width={8} z={0.5} />
          {[3, 4, 5, 6].map((age, i) => (
            <KidIcon key={age} x={-450 + i * 300} y={-400} s={1.6 + i * 0.35} color="#3a9ac9" ring={ramp(t, 94.4, 94.9)} z={1 + i * 0.01} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <Line key={i} pts={[[-450 + i * 300 - 60, -420], [-450 + i * 300 + 60, -420]]} width={4} color="#8a7a5a" z={0.6} />
          ))}
        </Paper>
      </Stage>
      <Label text="AGE 3" x={0.27} y={0.82} size={0.04} kind="box" at={sec(start)(94.5)} />
      <Label text="AGE 6" x={0.74} y={0.82} size={0.04} kind="box" at={sec(start)(94.9)} />
      <Label text="MOSTLY 3–6 YEARS OLD" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(94.4)} />
    </AbsoluteFill>
  );
};

// 95.85 "And among them were two pairs of identical twins."
export const TwinsDnaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hi = ramp(t, 96.6, 97.2);
  const pairs: [number, number][] = [[18, 19], [44, 45]];
  const pairIdx = new Set(pairs.flat());
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper color="#e9dcbc">
          {GRID.map(([gx, gy], i) => (
            <KidIcon key={i} x={gx * 110} y={-gy * 190 - 120} s={0.9} color={pairIdx.has(i) ? mixHex("#3a9ac9", "#fe5649", hi) : mixHex("#3a9ac9", "#c8bca4", hi * 0.6)} ring={pairIdx.has(i) ? hi : 0} z={1 + i * 0.001} />
          ))}
          {pairs.map(([a], k) => {
            const [gx, gy] = GRID[a];
            return hi > 0 ? <Part key={k} shape={roundRect(250, 200, 30)} color="#000000" flat outline={7} opacity={0} x={gx * 110 + 55} y={-gy * 190 - 40} z={2} /> : null;
          })}
        </Paper>
      </Stage>
      <Label text="2 PAIRS OF IDENTICAL TWINS" x={0.5} y={0.08} size={0.055} kind="box" at={sec(start)(97.6)} />
    </AbsoluteFill>
  );
};

// 98.95 "Remember the Hero Twins?"
export const HeroTwinsAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper color="#e2c890">
          <Sunburst y={0} r={2400} rays={20} color="#f2d890" alt="#e8c878" speed={0.4} z={-39} />
          <Character {...HUNAHPU} x={-300} y={-860} s={2.0} z={2} look={0.45} expression={{ eyes: "happy", mouth: "smirk", brows: -0.4 }} pose={poses.handsOnHips} />
          <Character {...XBALANQUE} x={300} y={-860} s={2.0} z={2} facing={-1} look={0.45} expression={{ eyes: "happy", mouth: "grin", brows: -0.3 }} pose={poses.armsUp(frame)} />
        </Paper>
      </Stage>
      <Label text="THE HERO TWINS" x={0.5} y={0.08} size={0.07} kind="title" at={sec(start)(99.4)} />
    </AbsoluteFill>
  );
};

// 100.4 "Some researchers think these boys were sacrificed in rituals linked to the twins' story."
export const TwinsRitualShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ghost = ramp(t, 101.2, 102.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -40 }} light={{ pos: [0, -100] }} vignette={0.75} vignetteColor="#0a0610">
        <Underworld floorY={-460}>
          <Part shape={roundRect(700, 160, 12)} color="#8a7e6a" shade={0.24} y={-380} z={1} />
          {[-260, -90, 90, 260].map((x, i) => (
            <Candle key={x} x={x} y={-300} s={0.9} seed={i + 1} z={1.1} />
          ))}
          <Glow y={-260} rx={600} ry={260} color="#ffb35a" alpha={0.35} additive z={1.2} />
          <X z={0.5}>
            <Character {...HUNAHPU} x={-380} y={-140} s={1.3} look={0.45} expression={{ eyes: "closed", mouth: "flat" }} pose={poses.idle(frame)} shadow={false} />
            <Character {...XBALANQUE} x={380} y={-140} s={1.3} facing={-1} look={0.45} expression={{ eyes: "closed", mouth: "flat" }} pose={poses.idle(frame, 2)} shadow={false} />
            <Wash width={2400} height={1600} color="#3a2a50" alpha={0.55 * (1 - ghost * 0.5)} z={1} />
          </X>
        </Underworld>
      </Stage>
      <Label text="SOME RESEARCHERS THINK…" x={0.5} y={0.1} size={0.045} kind="box" at={sec(start)(100.9)} />
      <Label text="RITUALS OF THE TWINS' STORY" x={0.5} y={0.9} size={0.05} kind="box" at={sec(start)(103.6)} />
    </AbsoluteFill>
  );
};
