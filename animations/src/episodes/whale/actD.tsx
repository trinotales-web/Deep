import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Gradient, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, InkLine, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import { BlueWhale, KrillSwarm, Krill, WhaleSkull, DimArrow, PolarMap, polarXY, PhytoBloom, Calendar, Bars, Sunburst } from "../../kit/env";
import { sec, pop, useScr, GrowArrow } from "../../kit/shot";
import { DeepSet, MuseumSet, Paper, RuleBoard, TimeBar } from "./sets";
import { LAB } from "./cast";

// Baleen whales stayed small for most of their history; the 2017 skull study;
// the Ice Ages pack the oceans with krill; the rule that made the giants.

const ANCIENT = "#7a7468";

/** Whale seen from above (head toward +x), body length `len`. */
const WhaleTop: React.FC<{ x?: number; y?: number; z?: number; len?: number; color?: string; opacity?: number }> = ({ x = 0, y = 0, z = 0, len = 1000, color = "#5b84ad", opacity = 1 }) => (
  <X x={x} y={y} z={z} s={len / 1000}>
    <Part shape={blob([[500, 0], [440, 80], [260, 120], [0, 110], [-260, 70], [-430, 26], [-470, 0], [-430, -26], [-260, -70], [0, -110], [260, -120], [440, -80]], 8)} color={color} shade={0.18} opacity={opacity} />
    <Part shape={blob([[-460, 0], [-560, 120], [-600, 150], [-560, 40], [-560, -40], [-600, -150], [-560, -120]], 6)} color={color} shade={0.18} opacity={opacity} z={-0.01} />
    {[-1, 1].map((sd) => (
      <Part key={sd} shape={blob([[200, sd * 90], [120, sd * 240], [80, sd * 260], [140, sd * 110]], 5)} color={color} shade={0.18} opacity={opacity} z={-0.01} />
    ))}
  </X>
);

/** Bold dashed line (outlined dashes) from (x0,y) to (x1,y). */
const DashLine: React.FC<{ x0: number; x1: number; y: number; z?: number; color?: string; k?: number }> = ({ x0, x1, y, z = 0, color = "#fe5649", k = 1 }) => {
  const L = (x1 - x0) * Math.max(0, Math.min(1, k));
  const n = Math.max(0, Math.floor(L / 70));
  return (
    <X y={y} z={z}>
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} shape={roundRect(44, 16, 8)} color={color} shade={0.1} x={x0 + 22 + i * 70} />
      ))}
    </X>
  );
};

/** Max body length of baleen whales through time (Mya, metres): small for ages, then giants. */
const SIZE_DATA: [number, number][] = [
  [31, 5], [29, 6], [27, 4.5], [25, 7], [23, 5.5], [21, 8], [19, 6.5], [17, 7.5], [15, 6], [13, 8.5], [11, 7], [9, 8], [7.5, 9], [6, 8.5],
  [4.5, 11], [4, 12.5], [3.5, 14], [3, 18], [2.5, 21], [2, 25], [1.2, 26], [0.3, 30],
];
const CX = (mya: number) => 700 - (mya / 32) * 1400;
const CY = (m: number) => -340 + (m / 32) * 700;

/** Bold chart: whale size through time on a dark screen. `upTo` Mya shown (32 → 0), `line` 0..1 draws the 10 m line. */
const SizeChart: React.FC<{ upTo: number; line: number; giants?: number }> = ({ upTo, line, giants = 0 }) => (
  <X>
    <Part shape={roundRect(1700, 920, 30)} color="#2a2c34" shade={0.12} y={40} />
    <Part shape={roundRect(1600, 820, 18)} color="#151a22" flat outline={5} y={40} z={0.001} />
    <InkLine pts={[[-720, 400], [-720, -360], [740, -360]]} width={14} color="#e8eef2" outline={0} z={0.002} />
    <DashLine x0={-720} x1={740} y={CY(10)} k={line} z={0.003} />
    {SIZE_DATA.filter(([mya]) => mya >= upTo).map(([mya, m], i) => {
      const big = m >= 10;
      return (
        <X key={i} x={CX(mya)} y={CY(m)} z={0.01 + i * 0.001}>
          {big && giants > 0 ? <Glow rx={70} color="#7fd0ff" alpha={0.5 * giants} additive /> : null}
          <BlueWhale len={130 + m * 12} color={big ? "#6a9ac8" : "#b8a88a"} eye="closed" />
        </X>
      );
    })}
  </X>
);

// 172.06 "Now here's the strange part."
export const StrangePartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6} bgBlur={6} bg={<MuseumSet floor={-700} />}>
        <Character {...LAB(0)} x={-60} y={-760} s={2.0} look={0.3} expression={{ eyes: "open", mouth: "wavy", gaze: [0.2, -0.2], brows: 0.6 }} pose={poses.think} />
        <QuestionMark x={460} y={260} size={1.1} rot={Math.sin(frame * 0.12) * 0.1} z={1} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 173.68 "Baleen whales have been around for more than 30 million years."
export const ThirtyMillionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 173.6, 176.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Paper>
          <TimeBar y={-160} w={1600} k={k} ticks={[0.02, 0.98]} />
          {Array.from({ length: 6 }, (_, i) => {
            const u = 0.08 + i * 0.16;
            return u <= k ? <BlueWhale key={i} x={-800 + u * 1600} y={20 + Math.sin(frame * 0.08 + i) * 10} len={220} color={ANCIENT} swim={frame + i * 9} z={1} /> : null;
          })}
        </Paper>
      </Stage>
      <Label text="30+ MILLION YEARS" x={0.5} y={0.16} size={0.075} kind="title" at={at(175.59)} />
    </AbsoluteFill>
  );
};

// 177.22 "But for most of that time, they aren't giants."
export const NotGiantsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={600} tint="#4a9ab0">
          {[[-500, 200, 0], [200, -100, 20], [700, 260, 40], [-200, -320, 60]].map(([x, y, ph], i) => (
            <BlueWhale key={i} x={x + frame * 1.6} y={y} len={460} color={ANCIENT} swim={frame + ph} z={1 + i * 0.1} />
          ))}
        </DeepSet>
      </Stage>
      <Label text="NOT GIANTS" x={0.76} y={0.18} size={0.07} kind="stamp" rotate={-7} at={at(179.34)} />
    </AbsoluteFill>
  );
};

// 180.3 "Most of them are much smaller than the whales we see today."
export const SmallerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.9, 0.96);
  const big = ramp(t, 181.6, 182.4, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <BlueWhale x={-660} y={-180} len={420} color={ANCIENT} swim={frame} z={1} />
          <X x={260} y={120} s={big} z={1}>
            <BlueWhale len={1500} swim={frame} beat={0.3} eye="happy" />
          </X>
        </Paper>
      </Stage>
      <Label text="THEN" x={sc(-660, -330, zoom).x} y={sc(-660, -330, zoom).y} size={0.05} kind="box" pin at={at(180.4)} />
      <Label text="TODAY" x={sc(260, -120, zoom).x} y={sc(260, -120, zoom).y} size={0.05} kind="box" pin at={at(182.4)} />
    </AbsoluteFill>
  );
};

// 183.4 "So when did they become huge?"
export const WhenHugeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.35} surfaceY={640}>
          <X x={180} y={140} z={0.5}>
            <BlueWhale len={1900} color="#2a4058" eye="closed" />
          </X>
          <BlueWhale x={-560} y={-300} len={420} color={ANCIENT} gaze={[0.6, 1]} swim={frame} z={1} />
          <QuestionMark x={-180} y={-120} size={0.9 * pop(t, 184.5)} z={2} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 185.78 "In 2017, a team of scientists measured fossil whale skulls in a museum in Washington."
export const MuseumShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: 260 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <MuseumSet floor={-420}>
          {[-700, -200, 400].map((x, i) => (
            <Character key={x} {...LAB(i)} x={x + frame * (i === 1 ? 1.5 : 0)} y={-420} s={0.9} facing={i === 2 ? -1 : 1} look={0.4} expression={{ eyes: "open", mouth: "smile", gaze: [0.3, -0.9] }} pose={i === 1 ? poses.walk(frame) : poses.idle(frame, i)} z={1} />
          ))}
        </MuseumSet>
      </Stage>
      <Label text="2017" x={0.5} y={0.14} size={0.1} kind="title" at={at(185.91)} />
    </AbsoluteFill>
  );
};

// 187.09 "…measured fossil whale skulls in a museum in Washington."
export const MeasureSkullsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <MuseumSet floor={-480} skeleton={false}>
          <Part shape={roundRect(1500, 70, 14)} color="#5a3a24" shade={0.2} y={-210} z={-2} />
          <Part shape={roundRect(60, 280, 10)} color="#4a2e1c" shade={0.2} x={-650} y={-350} z={-2.1} />
          <Part shape={roundRect(60, 280, 10)} color="#4a2e1c" shade={0.2} x={650} y={-350} z={-2.1} />
          <WhaleSkull x={-80} y={-60} w={620} measure={ramp(t, 188.5, 189.4)} rot={0.05} z={0} />
          <Character {...LAB(1)} x={-760} y={-480} s={1.05} look={0.6} expression={{ eyes: "open", mouth: "flat", gaze: [0.7, -0.6] }} pose={poses.point(frame)} z={1} />
          <Character {...LAB(2)} x={660} y={-480} s={1.05} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "o", gaze: [0.7, -0.6] }} pose={poses.think} z={1} />
        </MuseumSet>
      </Stage>
      <Label text="MUSEUM IN WASHINGTON, D.C." x={0.08} y={0.1} size={0.045} kind="box" at={at(190.4)} />
    </AbsoluteFill>
  );
};

// 191.47 "The width of a whale's skull tells you roughly how long the whole whale was."
export const SkullWidthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const body = ramp(t, 193.2, 194.4, Easing.out(Easing.cubic));
  const zoom = interpolate(body, [0, 1], [1.25, 0.72]);
  const skullX = 520;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: interpolate(body, [0, 1], [skullX, 0]) }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          {body > 0 ? <WhaleTop x={skullX - 1520 * body + 760 * body} y={0} len={2050 * Math.max(0.3, body)} opacity={0.55} z={-0.5} /> : null}
          <WhaleSkull x={skullX + 300} y={0} w={560} measure={ramp(t, 191.7, 192.5)} z={0} />
          {body > 0.6 ? <DimArrow x={skullX - 260} y={-340} len={2050 * ramp(t, 194.2, 194.9)} width={22} color="#2f5f9a" z={1} /> : null}
        </Paper>
      </Stage>
      <Label text="SKULL WIDTH" x={sc(skullX + 140, 210, zoom, interpolate(body, [0, 1], [skullX, 0])).x} y={sc(skullX + 140, 210, zoom, interpolate(body, [0, 1], [skullX, 0])).y} size={0.045} kind="box" pin at={at(191.9)} until={at(193.2)} />
      <Label text="BODY LENGTH" x={0.5} y={0.12} size={0.055} kind="box" at={at(194.5)} />
    </AbsoluteFill>
  );
};

// 195.77 "And what they found surprised them."
export const SurprisedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wow = t > 196.5;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.45, 1.55), y: -60, shake: hitAt(t, 196.56, 0.3) * 4 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <MuseumSet floor={-480} skeleton={false}>
          <Character {...LAB(1)} x={-250} y={-480} s={1.0} look={0.3} expression={wow ? { eyes: "wide", mouth: "o", brows: 0.8 } : { eyes: "open", mouth: "flat" }} pose={wow ? poses.scared(frame) : poses.idle(frame, 1)} z={1} />
          <Character {...LAB(2)} x={260} y={-480} s={1.0} facing={-1} look={0.3} expression={wow ? { eyes: "wide", mouth: "shout", brows: 0.8 } : { eyes: "open", mouth: "flat" }} pose={wow ? poses.armsUp(frame) : poses.idle(frame, 2)} z={1} />
        </MuseumSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 197.79 "Whales longer than 10 meters only start to appear about 4.5 million years ago."
export const TenMetersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.98, 1.02);
  const upTo = interpolate(t, [197.6, 200.6, 201.5], [32, 5.5, 4.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <SizeChart upTo={upTo} line={ramp(t, 198.6, 199.3)} giants={ramp(t, 200.8, 201.4)} />
        </Paper>
      </Stage>
      <Label text="10 M" x={sc(-640, CY(10) + 50, zoom).x} y={sc(-640, CY(10) + 50, zoom).y} size={0.05} kind="hand" color="#fe5649" pin at={at(198.8)} />
      <Label text="4.5 MILLION YEARS AGO" x={sc(CX(4.5), 360, zoom).x - 0.06} y={sc(CX(4.5), 360, zoom).y} size={0.04} kind="box" pin at={at(200.74)} />
      <Label text="LENGTH" x={sc(-690, 430, zoom).x} y={sc(-690, 430, zoom).y} size={0.035} kind="hand" color="#e8eef2" pin at={0} />
      <Label text="TIME →" x={sc(560, -410, zoom).x} y={sc(560, -410, zoom).y} size={0.035} kind="hand" color="#e8eef2" pin at={0} />
    </AbsoluteFill>
  );
};

// 202.98 "The true giants arrive even later, around 2 to 3 million years ago."
export const TrueGiantsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.25, 1.3);
  const cx = CX(2.5);
  const upTo = interpolate(t, [203.0, 205.6, 206.5], [4.0, 2.0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cx - 260, y: 60 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <SizeChart upTo={upTo} line={1} giants={1} />
        </Paper>
      </Stage>
      <Label text="2–3 MILLION YEARS AGO" x={sc(cx, -420, zoom, cx - 260, 60).x} y={sc(cx, -420, zoom, cx - 260, 60).y - 0.04} size={0.05} kind="box" pin at={at(205.44)} />
      <Label text="THE TRUE GIANTS" x={0.08} y={0.1} size={0.05} kind="box" at={at(203.33)} />
    </AbsoluteFill>
  );
};

// 207.18 "In whale history, that's yesterday."
export const YesterdayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <X s={1.9} y={-40} z={0}>
            <Calendar flip={ramp(t, 207.6, 208.4)} />
          </X>
        </Paper>
      </Stage>
      <Label text="YESTERDAY" x={0.5} y={0.5} size={0.11} kind="stamp" rotate={-6} at={at(208.67)} />
    </AbsoluteFill>
  );
};

// 209.87 "As one of the scientists put it, "We live in a time of giants.""
export const TimeOfGiantsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6} bgBlur={6} bg={<MuseumSet floor={-700} />}>
        <Character {...LAB(2)} x={-480} y={-760} s={2.0} look={0.25} expression={{ eyes: "open", mouth: "smile", gaze: [0.2, 0] }} pose={poses.talk(frame, 2)} talking={t > 211.4 && t < 213.6} />
      </DepthStage>
      <Label text="“WE LIVE IN A TIME OF GIANTS.”" x={0.68} y={0.5} size={0.06} kind="title" at={at(211.44)} />
    </AbsoluteFill>
  );
};

// 214.38 "So what changed?"
export const WhatChangedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.25} surfaceY={600}>
          <BlueWhale x={-200} y={-60} len={1600} gaze={[0.4, 1]} swim={frame * 0.5} beat={0.3} z={1} />
          <QuestionMark x={560} y={260} size={1.1 * pop(t, 214.6)} z={2} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 215.74 "The Ice Ages."
export const IceAgesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 215.5, 216.6, Easing.out(Easing.cubic));
  const shards: [number, number, number][] = [[-960, 540, 0], [960, 540, 1], [-960, -540, 2], [960, -540, 3], [0, 560, 4], [0, -560, 5]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <Gradient w={4400} h={2600} stops={[[0, "#9fd0ec"], [1, "#3a6a9a"]]} z={-41} />
        {shards.map(([x, y, i]) => (
          <X key={i} x={x} y={y} s={k * 1.2} rot={i * 0.9} z={i * 0.01}>
            {Array.from({ length: 6 }, (_, j) => (
              <Part key={j} shape={poly([[0, 0], [60 + j * 30, 300 + j * 50], [-40 - j * 10, 260 + j * 40]])} color={j % 2 ? "#f4fafe" : "#dcecf6"} shade={0.15} rot={j * 1.05} />
            ))}
          </X>
        ))}
        <Glow rx={700} ry={400} color="#ffffff" alpha={0.4 * k} />
      </Stage>
      <Label text="THE ICE AGES" x={0.5} y={0.5} size={0.11} kind="title" at={at(215.88)} />
    </AbsoluteFill>
  );
};

// 216.91 "As giant ice sheets grow in the north, the oceans change."
export const IceSheetsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const ppd = interpolate(frame, [0, dur], [11, 12.5]);
  const [lx, ly] = polarXY(-95, 58, "north", ppd);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <PolarMap pole="north" ppd={ppd} w={2600} h={1600} rot={0.35} sheets={ramp(t, 217.0, 218.8)} />
      </Stage>
      <Label text="ICE SHEETS" x={0.08} y={0.1} size={0.05} kind="box" at={at(217.68)} />
    </AbsoluteFill>
  );
};

/** Evenly scattered food (tiny plankton and a few krill) across an ocean cross-section. */
const ThinFood: React.FC<{ frame: number; n?: number; w?: number; h?: number; seed?: number }> = ({ frame, n = 60, w = 3000, h = 1600, seed = 4 }) => (
  <X>
    {Array.from({ length: n }, (_, i) => {
      const x = (((i * 7919 + seed * 131) % 1000) / 1000 - 0.5) * w;
      const y = (((i * 104729 + seed * 17) % 1000) / 1000 - 0.5) * h;
      return i % 4 === 0 ? (
        <Krill key={i} x={x + Math.sin(frame * 0.04 + i) * 14} y={y} s={0.35} rot={i} swim={frame} />
      ) : (
        <Part key={i} shape={circle(8)} color="#7ac85a" flat outline={3} x={x + Math.sin(frame * 0.03 + i) * 10} y={y + Math.cos(frame * 0.03 + i) * 8} />
      );
    })}
  </X>
);

// 220.33 "Before, food was spread out fairly evenly across the sea."
export const EvenFoodShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.82) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.3} surfaceY={640}>
          <ThinFood frame={frame} n={70} />
          <BlueWhale x={-400 + frame * 1.5} y={-140} len={900} color={ANCIENT} gaze={[1, -0.2]} swim={frame} z={1} />
        </DeepSet>
      </Stage>
      <Label text="BEFORE: FOOD SPREAD THIN" x={0.08} y={0.1} size={0.045} kind="box" at={at(220.4)} />
    </AbsoluteFill>
  );
};

// 224.09 "Now, melting ice and strong winds bring nutrients up to the surface."
export const UpwellingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const wind = ramp(t, 225.8, 226.6);
  const up = ramp(t, 226.5, 227.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.82), y: 120 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.35} surfaceY={300}>
          {/* sky strip above the surface */}
          <Gradient w={4000} h={800} y={700} stops={[[0, "#9fd0ec"], [1, "#e6f3f8"]]} z={-30} />
          {/* melting ice floes */}
          {[-1300, -1000, -760].map((x, i) => (
            <Part key={x} shape={blob([[-120, 30], [120, 40], [140, -10], [90, -60], [-110, -50]], 5)} color="#f4fafe" shade={0.15} x={x + Math.sin(frame * 0.05 + i) * 10} y={300 + Math.sin(frame * 0.07 + i) * 6} s={1 - ramp(t, 224.6, 226.8) * 0.3} z={-0.2} />
          ))}
          {wind > 0
            ? [0, 1, 2].map((i) => <GrowArrow key={i} pts={[[-500 + i * 300, 520 - i * 40], [0 + i * 300, 500 - i * 40], [400 + i * 300, 470 - i * 30]]} k={wind} color="#f4fafe" width={22} z={1} />)
            : null}
          {up > 0
            ? [-600, 0, 600].map((x, i) => <GrowArrow key={i} pts={[[x, -600], [x + 80, -250], [x - 40, 180]]} k={up} color="#7ac85a" width={26} z={1} />)
            : null}
          {Array.from({ length: 24 }, (_, i) => {
            const x = -900 + (i % 8) * 260 + Math.sin(i) * 40;
            const y0 = -650 + Math.floor(i / 8) * 80;
            const y = y0 + up * (900 - Math.floor(i / 8) * 60);
            return <Part key={i} shape={circle(9)} color="#9ad85a" flat outline={3} x={x} y={y} z={0.8} />;
          })}
        </DeepSet>
      </Stage>
      <Label text="NOW" x={0.08} y={0.1} size={0.05} kind="box" at={at(224.1)} />
      <Label text="NUTRIENTS RISE" x={0.92} y={0.86} size={0.05} kind="box" at={at(227.0)} />
    </AbsoluteFill>
  );
};

// 228.6 "It happens in certain places, at certain times of year."
export const HotspotsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const ppd = 11;
  const spots: [number, number, number][] = [[-60, -62, 229.1], [-38, -54, 229.4], [170, -73, 229.7], [75, -66, 230.0], [-120, -70, 230.3]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <PolarMap pole="south" ppd={ppd} w={2600} h={1600} seaIceLat={-64}>
          {spots.map(([lon, lat, a], i) => {
            const [x, y] = polarXY(lon, lat, "south", ppd);
            const p = pop(t, a);
            return (
              <X key={i} x={x} y={y} s={p}>
                <Glow rx={130 + 20 * Math.sin(frame * 0.2 + i)} color="#7ad85a" alpha={0.55} additive />
                <Part shape={circle(26)} color="#7ad85a" shade={0.2} />
              </X>
            );
          })}
          <X x={620} y={-300} s={0.9} z={1}>
            <Calendar flip={ramp(t, 230.3, 231.2)} />
          </X>
        </PolarMap>
      </Stage>
      <Label text="CERTAIN PLACES" x={0.08} y={0.1} size={0.045} kind="box" at={at(229.2)} />
      <Label text="CERTAIN TIMES" x={0.92} y={0.86} size={0.045} kind="box" at={at(230.5)} />
    </AbsoluteFill>
  );
};

// 231.81 "Tiny plants bloom."
export const BloomShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 120 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.15} surfaceY={420}>
          <PhytoBloom y={200} w={2400} h={500} n={220} k={ramp(t, 231.6, 232.9)} z={1} />
        </DeepSet>
      </Stage>
      <Label text="PLANKTON BLOOM" x={0.08} y={0.86} size={0.05} kind="box" at={at(232.2)} />
    </AbsoluteFill>
  );
};

// 233.22 "And the animals that eat them gather in enormous, crowded swarms."
export const SwarmsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.8) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={700}>
          <PhytoBloom y={520} w={3000} h={300} n={120} k={1} z={0.2} />
          <KrillSwarm x={-500} y={-60} w={1500} h={700} n={380} frame={frame} z={1} />
          <KrillSwarm x={900} y={120} w={900} h={500} n={200} frame={frame + 30} seed={4} z={1.1} />
        </DeepSet>
      </Stage>
      <Label text="ENORMOUS SWARMS" x={0.92} y={0.86} size={0.055} kind="box" at={at(234.76)} />
    </AbsoluteFill>
  );
};

// 237.4 "And this brings us to the rule that made the giants."
export const RuleTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.85, 0.92);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <Sunburst r={1500} rays={16} color="#f2d888" alt="#f8e8b0" speed={0.2} z={-1} />
          <RuleBoard y={0} w={1300} h={700} s={pop(t, 237.9)} glow={hitAt(t, 238.5, 1.4)} z={0} />
        </Paper>
      </Stage>
      <Label text="THE RULE" x={sc(0, 140, zoom).x} y={sc(0, 140, zoom).y} size={0.1} kind="ink" pin at={at(238.5)} />
      <Label text="THAT MADE THE GIANTS" x={sc(0, -80, zoom).x} y={sc(0, -80, zoom).y} size={0.055} kind="ink" pin at={at(239.4)} />
    </AbsoluteFill>
  );
};

// 240.69 "For a whale that eats by filtering, size pays."
export const SizePaysShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const m = ramp(t, 241.2, 242.2, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={700}>
          <KrillSwarm x={760} y={300} w={600} h={300} n={120} frame={frame} eaten={m * 0.25} z={0.5} />
          <KrillSwarm x={900} y={-300} w={900} h={460} n={200} frame={frame} eaten={m * 0.85} seed={3} z={0.5} />
          <BlueWhale x={-100 + m * 120} y={300} len={700} color={ANCIENT} mouth={m * 0.8} krill={m * 0.4} swim={frame} z={1} />
          <BlueWhale x={-300 + m * 160} y={-300} len={1600} mouth={m} krill={m} swim={frame} z={1} />
        </DeepSet>
      </Stage>
      <Label text="SIZE PAYS" x={0.08} y={0.1} size={0.07} kind="box" at={at(242.53)} />
    </AbsoluteFill>
  );
};

// 243.97 "The bigger you are, the more food you get from every mouthful."
export const MoreFoodShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 245.0, 246.4, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 60 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <Bars y={-300} w={1100} h={720} values={[1, 6]} colors={["#c8a06a", "#3a7ac9"]} k={k} />
          <BlueWhale x={-240} y={-420} len={260} color={ANCIENT} z={1} />
          <BlueWhale x={240} y={-420} len={520} z={1} />
        </Paper>
      </Stage>
      <Label text="FOOD PER MOUTHFUL" x={0.5} y={0.12} size={0.06} kind="title" at={at(244.3)} />
    </AbsoluteFill>
  );
};

// 247.32 "Remember this rule."
export const RememberRuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.05, 1.12);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <RuleBoard y={0} w={1300} h={700} glow={hitAt(t, 247.7, 1.0)} z={0} />
        </Paper>
      </Stage>
      <Label text="BIGGER WHALE" x={sc(0, 130, zoom).x} y={sc(0, 130, zoom).y} size={0.075} kind="ink" pin at={0} />
      <Label text="= MORE FOOD PER GULP" x={sc(0, -60, zoom).x} y={sc(0, -60, zoom).y} size={0.065} kind="ink" pin at={at(247.5)} />
    </AbsoluteFill>
  );
};

// 248.6 "It explains almost everything about the blue whale."
export const ExplainsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.72), y: 60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={760} seabedY={-900}>
          <BlueWhale x={500 - frame * 2.4} y={40} len={2400} swim={frame} z={1} />
          <KrillSwarm x={-1300} y={-300} w={600} h={300} n={120} frame={frame} z={0.5} />
        </DeepSet>
      </Stage>
      <Label text="BIGGER = MORE FOOD" x={0.92} y={0.1} size={0.045} kind="box" at={at(248.7)} />
    </AbsoluteFill>
  );
};
