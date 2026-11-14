import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Gradient, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, InkLine, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  BlueWhale, ProtoWhale, Dolphin, SpermWhale, Squid, KrillSwarm, BalanceScale, CrownProp, Newspaper, BaleenRow, Sieve, Drops, Gauge, Sky, Hill, Ground, Cloud, Sun, Krill,
} from "../../kit/env";
import { sec, pop, useScr, GrowArrow } from "../../kit/shot";
import { DeepSet, PressSet, PressLectern, LabSet, Paper, Flash, Finger, spark } from "./sets";
import { LAB, REPORTER } from "./cast";
import { Fish } from "./actB";

// Perucetus (2023) and the recheck (2024), the split into toothed and baleen
// whales, and how baleen works.

const PERU = (props: React.ComponentProps<typeof ProtoWhale>) => <ProtoWhale k={1} fat={1.9} color="#7a7a82" {...props} />;

/** A huge fossil vertebra (Perucetus had very heavy bones). Origin = centre. */
const Vertebra: React.FC<{ x?: number; y?: number; z?: number; s?: number; rot?: number }> = ({ x = 0, y = 0, z = 0, s = 1, rot = 0 }) => (
  <X x={x} y={y} z={z} s={s} rot={rot}>
    <Part shape={blob([[-30, 60], [30, 60], [40, 200], [10, 230], [-20, 200]], 6)} color="#d8c49a" shade={0.2} z={-0.01} />
    <Part shape={blob([[-90, 10], [-200, 30], [-210, 0], [-100, -20]], 5)} color="#d8c49a" shade={0.2} z={-0.01} />
    <Part shape={blob([[90, 10], [200, 30], [210, 0], [100, -20]], 5)} color="#d8c49a" shade={0.2} z={-0.01} />
    <Part shape={roundRect(220, 160, 60)} color="#e6d6b0" shade={0.22}>
      <Part shape={ellipse(40, 30)} color="#8a7458" flat outline={4} y={50} z={0.001} />
      <Line pts={[[-80, -30], [-20, -50], [60, -20]]} smooth width={5} color="#b8a07a" z={0.001} />
    </Part>
  </X>
);

/** Peruvian desert dig site (Ica-like dunes). Ground at y=ground. */
const DesertDig: React.FC<{ ground?: number; children?: React.ReactNode }> = ({ ground = -200, children }) => (
  <>
    <X z={-41}>
      <Sky w={6000} h={3600} y={ground + 1800} top="#6fb0e0" mid="#bfe0f0" bottom="#f6e6c0" />
      <Sun x={900} y={ground + 900} r={90} glow={0.8} />
      <Cloud x={-700} y={ground + 900} w={380} seed={4} />
    </X>
    <Hill w={3600} h={300} x={-1200} y={ground + 80} color="#e2b878" seed={2} z={-39} />
    <Hill w={3400} h={240} x={1300} y={ground + 80} color="#d8a868" seed={6} z={-38.5} />
    <Ground w={6000} h={2000} y={ground} color="#e6c48a" far="#ecd09a" pebbles={10} tufts={0} seed={3} z={-30} />
    {/* dig pit */}
    <Part shape={blob([[-900, 0], [-600, -120], [0, -160], [600, -120], [900, 0], [600, 40], [0, 50], [-600, 40]], 8)} color="#c8a06a" shade={0.12} y={ground - 260} z={-29} />
    {children}
  </>
);

/** Green chalkboard covered in bold chalk math. */
const Chalkboard: React.FC<{ x?: number; y?: number; z?: number; k?: number }> = ({ x = 0, y = 0, z = 0, k = 1 }) => {
  const rows: [number, number][][] = [
    [[-480, 200], [-380, 230], [-300, 180], [-200, 230], [-100, 190]],
    [[-480, 80], [-420, 110], [-340, 60], [-240, 110], [-120, 70], [0, 100], [120, 60]],
    [[-480, -40], [-380, -10], [-260, -60], [-140, -10], [-40, -50]],
    [[-480, -160], [-360, -130], [-240, -170], [-120, -140]],
  ];
  return (
    <X x={x} y={y} z={z}>
      <Part shape={roundRect(1260, 640, 16)} color="#8a5a32" shade={0.2} />
      <Part shape={roundRect(1180, 560, 8)} color="#2f5a48" flat outline={5} z={0.001} />
      {rows.map((r, i) => (k > i * 0.2 ? <Line key={i} pts={r} smooth width={9} color="#eef4ee" opacity={0.92} z={0.002} /> : null))}
      {k > 0.8 ? <InkLine pts={[[160, -80], [420, -80]]} width={10} color="#f2e27a" outline={0} z={0.003} /> : null}
      {k > 0.85 ? <Part shape={circle(90)} color="#2f5a48" flat outline={8} outlineColor="#fe5649" x={290} y={-170} z={0.003} /> : null}
    </X>
  );
};

// 118.11 "And some of them are big."
export const SomeBigShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.9), y: 0, shake: hitAt(t, 119.1, 0.4) * 6 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.35} surfaceY={640}>
          <PERU x={-700 + frame * 6} y={-20} s={2.3} swim={frame} z={1} />
          {Array.from({ length: 10 }, (_, i) => (
            <Fish key={i} x={500 + (i % 5) * 80 + frame * (2 + i * 0.3)} y={260 - Math.floor(i / 5) * 90 + Math.sin(frame * 0.2 + i) * 14} s={0.55} swim={frame * 2 + i} color={i % 2 ? "#e9ba41" : "#f2a03a"} z={0.5} />
          ))}
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 120.01 "In 2023,"
export const Year2023Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const flash = Math.max(spark(frame, at(120.3)), spark(frame, at(120.8)) * 0.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <PressSet floor={-460}>
          <Character {...LAB(0)} x={0} y={-460} s={1.4} look={0.3} expression={{ eyes: "open", mouth: "grin", gaze: [0, 0.2] }} pose={poses.talk(frame, 1)} talking z={0} />
          <PressLectern x={0} y={-460} s={0.75} z={0.6} />
          {[-760, -560, 560, 760].map((x, i) => (
            <Character key={x} {...REPORTER(i)} x={x} y={-700} s={0.95} facing={x < 0 ? 1 : -1} look={0.4} expression={{ eyes: "open", mouth: "o" }} pose={poses.idle(frame, i)} z={2} />
          ))}
        </PressSet>
      </Stage>
      <Flash k={flash * 0.6} />
      <Label text="2023" x={0.5} y={0.14} size={0.1} kind="title" at={at(120.16)} />
    </AbsoluteFill>
  );
};

// 121.32 "scientists announced a 39-million-year-old fossil whale from Peru,"
export const PeruFossilShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const reveal = ramp(t, 121.4, 124.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.94), y: -40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <DesertDig ground={-160}>
          {[-560, -220, 120, 460].map((x, i) => (
            <Vertebra key={x} x={x} y={-420 + (1 - Math.min(1, reveal * 1.4 - i * 0.1)) * -120} s={0.9} rot={(i - 1.5) * 0.08} z={-28} />
          ))}
          <Character {...LAB(1)} x={-860} y={-360} s={0.95} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.6, -0.5] }} pose={poses.point(frame)} z={1} />
          <Character {...LAB(3)} x={820} y={-360} s={0.95} facing={-1} look={0.6} expression={{ eyes: "wide", mouth: "o", gaze: [0.6, -0.5] }} pose={poses.idle(frame, 3)} z={1} />
        </DesertDig>
      </Stage>
      <Label text="39 MILLION YEARS OLD" x={0.5} y={0.14} size={0.065} kind="title" at={at(122.6)} />
      <Label text="PERU" x={0.08} y={0.1} size={0.055} kind="box" at={at(125.11)} />
    </AbsoluteFill>
  );
};

// 125.86 "called Perucetus."
export const PerucetusShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: 20 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={560} seabedY={-600}>
          <PERU x={-80 + frame * 2} y={-40} s={1.8} swim={frame} z={1} />
        </DeepSet>
      </Stage>
      <Label text="PERUCETUS" x={0.5} y={0.14} size={0.1} kind="title" at={at(126.16)} />
    </AbsoluteFill>
  );
};

// 127.29 "They said it might have been even heavier than a blue whale."
export const HeavierClaimShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tilt = interpolate(t, [127.2, 128.5, 129.0], [0, 1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 40, shake: hitAt(t, 128.5, 0.4) * 6 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <BalanceScale y={-60} w={1700} tilt={tilt} left={<BlueWhale len={700} y={60} eye={t > 128.4 ? "sad" : "open"} />} right={<PERU s={0.62} y={80} eye={t > 128.4 ? "happy" : "open"} />} />
        </Paper>
      </Stage>
    </AbsoluteFill>
  );
};

// 129.97 "Headlines everywhere said the blue whale had lost its crown."
export const HeadlinesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.9, 0.98);
  const fall = ramp(t, 132.3, 133.0, Easing.in(Easing.quad));
  const papers: [number, number, number, number][] = [
    [-640, 120, 0.18, 130.0],
    [640, 60, -0.15, 130.5],
    [0, -20, -0.04, 131.0],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 0 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#d8d2c4" blotch="#a89a7a">
          {papers.map(([x, y, rot, a], i) => {
            const k = ramp(t, a, a + 0.35, Easing.out(Easing.back(1.4)));
            return (
              <X key={i} x={x} y={y + (1 - k) * 900} rot={rot + (1 - k) * 1.2} s={0.6 + 0.4 * k} z={i}>
                <Newspaper
                  w={i === 2 ? 720 : 620}
                  photo={
                    <X s={0.6}>
                      <BlueWhale len={460} eye={t > 132.4 ? "sad" : "open"} />
                      <CrownProp x={60 + fall * 120} y={60 - fall * 160} w={90} rot={fall * 1.4} z={0.1} />
                    </X>
                  }
                />
              </X>
            );
          })}
        </Paper>
      </Stage>
      <Label text="BLUE WHALE DETHRONED?" x={sc(0, 250, zoom).x} y={sc(0, 250, zoom).y} size={0.04} kind="ink" pin at={at(131.2)} />
    </AbsoluteFill>
  );
};

// 133.55 "Then, a year later, two other scientists checked the math."
export const CheckMathShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 60 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <LabSet floor={-460} desk={false}>
          <Chalkboard x={0} y={260} k={ramp(t, 134.8, 136.8)} z={-10} />
          <Character {...LAB(2)} x={-620} y={-460} s={1.0} look={0.5} expression={{ eyes: "open", mouth: "flat", gaze: [0.5, 0.5], brows: -0.3 }} pose={poses.point(frame)} z={0} />
          <Character {...LAB(4)} x={600} y={-460} s={1.0} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "wavy", gaze: [0.5, 0.5], brows: 0.3 }} pose={poses.think} z={0} />
        </LabSet>
      </Stage>
      <Label text="A YEAR LATER" x={0.08} y={0.1} size={0.05} kind="box" at={at(134.1)} />
    </AbsoluteFill>
  );
};

// 137.45 "Their answer?"
export const AnswerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.5, 1.6), y: -40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <LabSet floor={-460} desk={false}>
          <Chalkboard x={0} y={260} k={1} z={-10} />
          <Character {...LAB(2)} x={-260} y={-460} s={1.0} look={0.2} expression={{ eyes: "open", mouth: "smile", gaze: [0, -0.1] }} pose={poses.idle(frame, 2)} z={0} />
          <Character {...LAB(4)} x={260} y={-460} s={1.0} facing={-1} look={0.2} expression={{ eyes: "open", mouth: "smile", gaze: [0, -0.1] }} pose={poses.idle(frame, 4)} z={0} />
        </LabSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 138.61 "Perucetus probably weighed around 60 to 70 tonnes."
export const SixtySeventyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const k = ramp(t, 139.6, 140.9, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.5}>
        <Paper>
          <X y={-300} z={0}>
            <Part shape={roundRect(1500, 90, 20)} color="#8a8e96" shade={0.2} />
            <PERU x={-60} y={190} s={1.15} eye="open" z={0.1} />
          </X>
          <Part shape={roundRect(1560, 120, 20)} color="#5a5e66" shade={0.2} y={-400} z={-0.1} />
          <Gauge x={640} y={300} r={170} level={0.45 * k} z={0.5} />
        </Paper>
      </Stage>
      <Label text="60–70 TONNES" x={sc(-300, 360).x} y={sc(-300, 360).y} size={0.08} kind="box" pin at={at(140.27)} />
    </AbsoluteFill>
  );
};

// 142.1 "Big, but nowhere near a blue whale."
export const NowhereNearShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tilt = interpolate(t, [141.9, 142.9, 143.4], [0.6, -1.15, -1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 40, shake: hitAt(t, 142.9, 0.4) * 6 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <BalanceScale y={-60} w={1700} tilt={tilt} left={<BlueWhale len={700} y={60} eye={t > 142.8 ? "happy" : "open"} />} right={<PERU s={0.62} y={80} eye={t > 142.8 ? "sad" : "open"} />} />
        </Paper>
      </Stage>
    </AbsoluteFill>
  );
};

// 144.35 "The crown stays where it is."
export const CrownStaysShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const drop = ramp(t, 144.4, 144.95, Easing.out(Easing.bounce));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), x: 200, y: 60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={700}>
          <BlueWhale x={-100} y={-80} len={1700} eye={t > 144.95 ? "happy" : "open"} gaze={[0.3, 1]} swim={frame * 0.4} beat={0.3} z={1} />
          <CrownProp x={-100 + 400} y={-80 + 210 + (1 - drop) * 600} w={200} rot={-0.12} z={2} />
          {t > 144.95 ? <Glow x={300} y={140} rx={260} color="#fff1a8" alpha={0.5 * hitAt(t, 144.95, 1.2)} additive z={2.1} /> : null}
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 146.57 "Around 34 million years ago, the whale family splits in two."
export const SplitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const trunk = ramp(t, 146.4, 148.6);
  const fork = ramp(t, 149.2, 150.2);
  const lerpPts = (pts: [number, number][], k: number): [number, number][] => {
    if (k <= 0) return [pts[0], pts[0]];
    const n = pts.length - 1;
    const f = k * n;
    const i = Math.min(n - 1, Math.floor(f));
    const q = f - i;
    return [...pts.slice(0, i + 1), [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * q, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * q]];
  };
  const left: [number, number][] = [[0, -60], [-200, 60], [-460, 160], [-620, 220]];
  const right: [number, number][] = [[0, -60], [200, 60], [460, 160], [620, 220]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <InkLine pts={lerpPts([[0, -420], [0, -260], [0, -60]], trunk)} width={60} color="#8a6a42" outline={7} z={0} />
          <X x={0} y={-430} s={pop(t, 146.5)} z={0.3}>
            <Part shape={circle(150)} color="#f6f0de" flat outline={6} />
            <ProtoWhale k={1} s={0.32} z={0.01} />
          </X>
          {fork > 0 ? <InkLine pts={lerpPts(left, fork)} smooth width={46} color="#8a6a42" outline={7} z={0.01} /> : null}
          {fork > 0 ? <InkLine pts={lerpPts(right, fork)} smooth width={46} color="#8a6a42" outline={7} z={0.01} /> : null}
          <Part shape={circle(56)} color="#e9ba41" shade={0.2} y={-60} s={pop(t, 149.3)} z={0.1} />
          <X x={-700} y={330} s={pop(t, 150.0)} z={0.2}>
            <Dolphin s={0.75} swim={frame} />
          </X>
          <X x={700} y={330} s={pop(t, 150.1)} z={0.2}>
            <BlueWhale len={560} swim={frame} />
          </X>
        </Paper>
      </Stage>
      <Label text="34 MILLION YEARS AGO" x={0.08} y={0.1} size={0.05} kind="box" at={at(146.91)} />
    </AbsoluteFill>
  );
};

// 150.63 "On one side are the toothed whales, like dolphins and sperm whales."
export const ToothedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: 20 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.4} surfaceY={680}>
          <SpermWhale x={-200 + frame * 1.2} y={-200} len={1600} swim={frame} mouth={0.2} z={1} />
          <Dolphin x={-700 + frame * 3} y={330} s={0.95} swim={frame} z={2} />
          <Dolphin x={-300 + frame * 3} y={400} s={0.8} swim={frame + 10} z={2} />
        </DeepSet>
      </Stage>
      <Label text="TOOTHED WHALES" x={0.08} y={0.1} size={0.055} kind="box" at={at(151.64)} />
    </AbsoluteFill>
  );
};

// 154.6 "They hunt one animal at a time."
export const OneAtATimeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const chase = ramp(t, 154.4, 156.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.35} surfaceY={600}>
          <Dolphin x={-900 + chase * 900} y={-20} s={1.25} swim={frame * 1.5} eye="open" z={1} />
          <Fish x={200 + chase * 600} y={20 + Math.sin(frame * 0.4) * 30} s={1.2} swim={frame * 3} color="#f2a03a" z={1} />
        </DeepSet>
      </Stage>
      <Label text="ONE AT A TIME" x={0.92} y={0.86} size={0.055} kind="box" at={at(155.01)} />
    </AbsoluteFill>
  );
};

// 156.54 "On the other side are the baleen whales."
export const BaleenWhalesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 0 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={760}>
          <BlueWhale x={-200 + frame * 2} y={180} len={2200} swim={frame} z={1} />
          <BlueWhale x={500 + frame * 2.4} y={-380} len={1500} color="#5a6270" swim={frame + 30} seed={8} z={0.8} />
          <KrillSwarm x={1300} y={-60} w={700} h={400} n={120} frame={frame} z={0.5} />
        </DeepSet>
      </Stage>
      <Label text="BALEEN WHALES" x={0.92} y={0.1} size={0.055} kind="box" at={at(157.97)} />
    </AbsoluteFill>
  );
};

// 159.12 "Instead of teeth, they grow plates of baleen."
export const BaleenPlatesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const grow = ramp(t, 160.1, 161.0, Easing.out(Easing.back(1.2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03), y: 40 }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <Gradient w={4400} h={2600} stops={[[0, "#6a2a34"], [1, "#2a0e14"]]} z={-41} />
        {/* upper jaw (outside) */}
        <Part shape={blob([[-1300, 380], [1300, 380], [1300, 1000], [-1300, 1000]], 4)} color="#5b84ad" shade={0.15} y={0} z={-1} />
        <BaleenRow y={380} w={1900} h={480 * grow} n={24} sway={frame * 0.08} z={0} />
        {/* lower jaw + tongue */}
        <Part shape={blob([[-1300, -360], [-600, -300], [0, -280], [600, -300], [1300, -360], [1300, -900], [-1300, -900]], 6)} color="#c86a76" shade={0.18} z={1} />
        <Part shape={blob([[-1300, -420], [1300, -420], [1300, -1000], [-1300, -1000]], 4)} color="#dfe6ec" shade={0.15} z={1.1} />
      </Stage>
      <Label text="NO TEETH" x={0.08} y={0.86} size={0.05} kind="stamp" rotate={-6} at={at(159.57)} />
      <Label text="BALEEN PLATES" x={0.5} y={0.5} size={0.075} kind="title" at={at(160.6)} />
    </AbsoluteFill>
  );
};

// 162.03 "It's made of keratin, the same stuff as your fingernails."
export const KeratinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98) }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <X x={-480} y={160} z={0}>
            <BaleenRow w={420} h={520} n={4} sway={frame * 0.08} />
          </X>
          <X s={pop(t, 163.3)} z={1}>
            <Part shape={roundRect(150, 30, 15)} color="#fe5649" shade={0.15} y={26} />
            <Part shape={roundRect(150, 30, 15)} color="#fe5649" shade={0.15} y={-26} z={0.001} />
          </X>
          <Finger x={560} y={-40} s={0.9} rot={-0.2} nailGlow={ramp(t, 164.0, 164.4)} z={0} />
        </Paper>
      </Stage>
      <Label text="KERATIN" x={0.5} y={0.14} size={0.09} kind="title" at={at(162.46)} />
    </AbsoluteFill>
  );
};

// 165.07 "Baleen works like a giant sieve."
export const SieveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), x: 120 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <X x={-140} y={60} rot={-0.08 + Math.sin(frame * 0.12) * 0.04} z={0}>
            <Sieve r={330} />
            {Array.from({ length: 9 }, (_, i) => (
              <Krill key={i} x={-220 + i * 55} y={-80 - (i % 3) * 40} s={0.55} rot={i * 0.7} swim={frame} z={0.01} />
            ))}
          </X>
          <Drops x={-140} y={-240} w={560} fall={380} n={14} k={(frame * 0.035) % 1} z={-0.1} />
        </Paper>
      </Stage>
      <Label text="A GIANT SIEVE" x={0.92} y={0.12} size={0.06} kind="box" at={at(166.03)} />
    </AbsoluteFill>
  );
};

// 167.22 "The whale takes in water full of food, pushes the water out, and keeps the food."
export const FilterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const open = interpolate(t, [167.1, 167.9, 169.0, 169.6], [0, 0.55, 0.55, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inK = ramp(t, 167.6, 168.6);
  const outK = ramp(t, 169.2, 170.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), x: 300, y: 0 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={640}>
          <BlueWhale x={-300} y={60} len={2000} mouth={open} krill={t > 167.9 ? 1 : 0} z={1} />
          <KrillSwarm x={1050 - inK * 300} y={20} w={500} h={300} n={90} frame={frame} eaten={inK} z={0.5} />
          <GrowArrow pts={[[1250, 300], [900, 120], [620, 40]]} k={inK} color="#3a7ac9" width={30} z={2} />
          {outK > 0
            ? [0, 1, 2].map((i) => <GrowArrow key={i} pts={[[540 + i * 70, -20], [600 + i * 90, -260], [700 + i * 110, -420]]} k={outK} color="#7ac8f0" width={22} z={2} />)
            : null}
        </DeepSet>
      </Stage>
      <Label text="WATER IN" x={0.92} y={0.14} size={0.05} kind="box" at={at(167.9)} />
      <Label text="WATER OUT" x={0.92} y={0.86} size={0.05} kind="box" at={at(169.5)} />
      <Label text="FOOD STAYS" x={0.08} y={0.86} size={0.05} kind="box" at={at(170.6)} />
    </AbsoluteFill>
  );
};
