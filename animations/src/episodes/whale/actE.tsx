import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Gradient, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { BlueWhale, Krill, KrillSwarm, Burger, Gauge, Bars, SpeedLines, Clock, Sun, Drops, WhaleTag } from "../../kit/env";
import { sec, pop, useScr, GrowArrow } from "../../kit/shot";
import { DeepSet, Paper, RuleBoard, Finger } from "./sets";

// Lunge feeding: the rorqual gulp, the energy it pays, and krill.

const FIN = "#545c68";
const MINKE = "#6a7480";

// 252.25 "The blue whale belongs to a group called rorquals."
export const RorqualsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 0 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={780}>
          <BlueWhale x={-300 + frame * 2.2} y={380} len={2100} swim={frame} z={1} />
          <BlueWhale x={600 + frame * 2.4} y={-80} len={1600} color={FIN} swim={frame + 20} seed={5} z={0.9} />
          <BlueWhale x={-700 + frame * 2.8} y={-460} len={850} color={MINKE} swim={frame + 40} seed={7} z={0.8} />
        </DeepSet>
      </Stage>
      <Label text="RORQUALS" x={0.08} y={0.1} size={0.065} kind="box" at={at(254.29)} />
    </AbsoluteFill>
  );
};

// 255.44 "They feed in a way called lunge feeding."
export const LungeTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const go = ramp(t, 256.6, 257.6, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={700}>
          {go > 0 ? <SpeedLines w={3000} h={900} n={18} speed={40 + go * 60} color="#cfeef8" z={0.5} /> : null}
          <BlueWhale x={-300 + go * 500} y={-60} len={1700} swim={frame * (1 + go * 2)} beat={1 + go} z={1} />
        </DeepSet>
      </Stage>
      <Label text="LUNGE FEEDING" x={0.5} y={0.14} size={0.1} kind="title" at={at(256.93)} />
    </AbsoluteFill>
  );
};

// 258.13 "The whale speeds toward a cloud of food"
export const SpeedsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 258.0, 260.3, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.7), x: interpolate(k, [0, 1], [-200, 500]) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={820}>
          <SpeedLines w={4000} h={1200} n={22} speed={70} color="#cfeef8" z={0.4} />
          <KrillSwarm x={1500} y={40} w={900} h={600} n={260} frame={frame} z={0.5} />
          <BlueWhale x={-900 + k * 1500} y={0} len={1900} swim={frame * 2} beat={1.4} z={1} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 260.41 "and opens its mouth wide."
export const OpensShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const m = ramp(t, 260.5, 261.4, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), x: 560 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={700}>
          <KrillSwarm x={1250} y={-40} w={700} h={600} n={200} frame={frame} z={0.5} />
          <BlueWhale x={-100 + frame * 3} y={0} len={1900} mouth={m * 0.65} krill={m} swim={frame * 2} beat={0.8} eye="wide" z={1} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 262.1 "Its lower jaw swings open,"
export const JawShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const m = interpolate(t, [262.0, 263.3], [0.3, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.55, 1.62), x: 720, y: -140 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.25} surfaceY={600}>
          <BlueWhale x={0} y={0} len={1900} mouth={m} krill={1} swim={frame} beat={0.4} eye="wide" z={1} />
          <GrowArrow pts={[[1060, -40], [1080, -200], [980, -340]]} k={ramp(t, 262.3, 263.0)} color="#fe5649" width={22} z={2} />
        </DeepSet>
      </Stage>
      <Label text="LOWER JAW" x={0.92} y={0.86} size={0.05} kind="box" at={at(262.6)} />
    </AbsoluteFill>
  );
};

// 263.88 "and its throat has long folds that stretch like a balloon."
export const BalloonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const m = interpolate(t, [263.8, 266.6], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const b = pop(t, 266.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), x: 300, y: -160 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={600}>
          <BlueWhale x={0} y={60} len={1900} mouth={m} krill={1} swim={frame * 0.5} beat={0.3} z={1} />
          <X x={1060} y={-280} s={b} z={2}>
            <Line pts={[[0, -120], [-10, -220], [10, -300]]} smooth width={5} color="#211b20" z={-0.01} />
            <Part shape={blob([[0, 120], [90, 70], [100, -20], [40, -110], [0, -120], [-40, -110], [-100, -20], [-90, 70]], 8)} color="#fe5649" shade={0.22} />
          </X>
        </DeepSet>
      </Stage>
      <Label text="THROAT FOLDS" x={0.08} y={0.86} size={0.05} kind="box" at={at(265.06)} />
    </AbsoluteFill>
  );
};

// 267.23 "In one gulp, it can take in a volume of water about as big as its own body."
export const GulpVolumeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const blobK = ramp(t, 268.8, 269.8, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: 40 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={900}>
          <BlueWhale x={-200} y={420} len={1900} mouth={1} krill={1} z={1} />
          <X x={-200} y={-460} s={blobK} z={1}>
            <BlueWhale len={1900} color="#7ac8f0" eye="closed" />
            <Glow rx={900} ry={260} color="#cfeef8" alpha={0.4} />
          </X>
          <X x={-1300} y={-20} s={pop(t, 270.2)} z={2}>
            <Part shape={roundRect(160, 34, 17)} color="#fe5649" shade={0.15} y={30} />
            <Part shape={roundRect(160, 34, 17)} color="#fe5649" shade={0.15} y={-30} z={0.001} />
          </X>
        </DeepSet>
      </Stage>
      <Label text="AS MUCH WATER AS ITS OWN BODY" x={0.5} y={0.12} size={0.055} kind="title" at={at(270.24)} />
    </AbsoluteFill>
  );
};

// 271.7 "Then it closes its mouth, pushes the water out through its baleen, and swallows the food."
export const PushOutShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const m = interpolate(t, [271.6, 272.6, 274.6, 275.2], [1, 0.55, 0.12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const squirt = ramp(t, 272.8, 273.4) * (1 - ramp(t, 274.6, 275.0));
  const gulp = hitAt(t, 274.9, 0.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), x: 380, y: -60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={640}>
          <BlueWhale x={0} y={40} len={1900} mouth={m} krill={1} eye={gulp > 0.2 ? "happy" : "open"} sy={1 + gulp * 0.05} z={1} />
          {squirt > 0
            ? [0, 1, 2, 3].map((i) => <GrowArrow key={i} pts={[[680 + i * 70, -40], [720 + i * 90, -260], [780 + i * 120, -420]]} k={squirt} color="#7ac8f0" width={22} z={2} />)
            : null}
          {squirt > 0 ? <Drops x={820} y={-200} w={360} fall={260} n={12} k={(frame * 0.05) % 1} color="#cfeef8" z={2.1} /> : null}
        </DeepSet>
      </Stage>
      <Label text="WATER OUT THROUGH THE BALEEN" x={0.5} y={0.86} size={0.05} kind="box" at={at(273.0)} />
    </AbsoluteFill>
  );
};

// 276.45 "Each lunge costs a lot of energy."
export const CostShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const lvl = interpolate(t, [276.6, 277.9], [0.85, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.3} surfaceY={640}>
          <BlueWhale x={-300} y={-120} len={1400} mouth={0.2} swim={frame * 1.5} beat={1.3} eye="closed" z={1} />
          <Gauge x={620} y={180} r={200} level={lvl} z={2} />
        </DeepSet>
      </Stage>
      <Label text="ENERGY" x={0.8} y={0.86} size={0.05} kind="box" at={at(277.0)} />
    </AbsoluteFill>
  );
};

// 278.74 "But scientists worked out that a single blue whale mouthful can hold up to about 443,000 calories."
export const CaloriesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.85, 0.92);
  const n = Math.round(443000 * ramp(t, 282.6, 284.6, Easing.out(Easing.quad)) / 1000) * 1000;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: 120 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={700}>
          <BlueWhale x={-380} y={-60} len={1700} mouth={1} krill={1} swim={frame * 0.4} beat={0.2} z={1} />
          <X x={720} y={160} s={pop(t, 282.6)} z={2}>
            <Glow rx={260} color="#ffb84a" alpha={0.55 + 0.2 * Math.sin(frame * 0.3)} additive />
            <Part shape={blob([[0, -120], [90, -40], [70, 60], [20, 140], [0, 60], [-30, 120], [-80, 40], [-90, -40]], 8)} color="#ff9a2a" shade={0.2} />
            <Part shape={blob([[0, -90], [50, -30], [30, 40], [0, 10], [-40, 40], [-50, -30]], 6)} color="#ffd84a" flat outline={0} z={0.001} />
          </X>
        </DeepSet>
      </Stage>
      <Label text={n > 0 ? `${n.toLocaleString("en-US")} CALORIES` : "ONE MOUTHFUL"} x={sc(720, -120, zoom, 120).x} y={sc(720, -120, zoom, 120).y} size={0.07} kind="box" pin at={at(279.0)} />
    </AbsoluteFill>
  );
};

// 285.58 "That's about 240 times more energy than the whale spends to take it."
export const TimesMoreShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.92, 0.98);
  const k = ramp(t, 286.0, 287.2, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 60 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <Bars y={-380} w={900} h={860} values={[0.02, 1]} colors={["#fe5649", "#4fc06a"]} k={k} />
        </Paper>
      </Stage>
      <Label text="SPENT" x={sc(-190, -460, zoom, 0, 60).x} y={sc(-190, -460, zoom, 0, 60).y} size={0.045} kind="box" pin at={at(285.8)} />
      <Label text="GAINED" x={sc(190, -460, zoom, 0, 60).x} y={sc(190, -460, zoom, 0, 60).y} size={0.045} kind="box" pin at={at(286.2)} />
      <Label text="×240" x={sc(190, 560, zoom, 0, 60).x} y={sc(190, 560, zoom, 0, 60).y} size={0.1} kind="title" pin at={at(286.5)} />
    </AbsoluteFill>
  );
};

// 289.18 "Or, if you like, the same energy as about 800 burgers."
export const BurgersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const pile = ramp(t, 289.4, 292.6);
  const n = Math.round(800 * ramp(t, 290.4, 292.0));
  const items = Array.from({ length: 70 }, (_, i) => {
    const row = Math.floor(Math.sqrt(i * 2));
    const col = i - (row * (row + 1)) / 2;
    return [(col - row / 2) * 150, -380 + (12 - row) * 0, row, i] as [number, number, number, number];
  });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper color="#f2e6c8" blotch="#d8b878">
          {items.map(([x, , row, i]) => {
            const land = 289.3 + (i / 70) * 2.6;
            const k = ramp(t, land, land + 0.35, Easing.in(Easing.quad));
            if (k <= 0) return null;
            const yy = -420 + (11 - row) * 70;
            return <Burger key={i} x={x} y={yy + (1 - k) * 900} size={0.62} rot={(i % 5 - 2) * 0.08} z={i * 0.01} />;
          })}
          <Part shape={roundRect(2400, 60, 10)} color="#c8a06a" shade={0.15} y={-470} z={-1} />
        </Paper>
      </Stage>
      <Label text={`${n} BURGERS`} x={0.08} y={0.1} size={0.07} kind="box" at={at(290.4)} />
      {pile > 0 ? null : null}
    </AbsoluteFill>
  );
};

// 293.39 "In one bite."
export const OneBiteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const m = interpolate(t, [293.1, 293.5, 293.9], [0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.25), x: 450, shake: hitAt(t, 293.9, 0.3) * 8 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={600}>
          <BlueWhale x={0} y={0} len={1800} mouth={m} krill={1} eye={t > 293.9 ? "happy" : "open"} z={1} />
        </DeepSet>
      </Stage>
      <Label text="IN ONE BITE" x={0.5} y={0.14} size={0.09} kind="title" at={at(293.51)} />
    </AbsoluteFill>
  );
};

// 294.71 "And what's in that bite?"
export const WhatsInShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1) }} light={{ dir: [-0.4, 0.8] }} vignette={0.75}>
        <Gradient w={4400} h={2600} stops={[[0, "#7a2f3a"], [1, "#2a0e14"]]} z={-41} />
        <KrillSwarm x={0} y={-40} w={1100} h={500} n={120} frame={frame} glow={0.3} z={0} />
        <QuestionMark x={0} y={40} size={1.6 * pop(t, 295.2)} z={1} />
      </Stage>
    </AbsoluteFill>
  );
};

// 296.25 "Krill."
export const KrillTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.35} surfaceY={null}>
          <Krill x={-80} y={-60} s={6 * (0.85 + 0.15 * pop(t, 296.25))} swim={frame} glow={0.6} z={1} />
        </DeepSet>
      </Stage>
      <Label text="KRILL" x={0.5} y={0.16} size={0.12} kind="title" at={at(296.25)} />
    </AbsoluteFill>
  );
};

// 296.98 "Blue whales eat almost nothing else."
export const NothingElseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.95, 1.02);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <RuleBoard x={-240} w={1000} h={760} />
          <BlueWhale x={640} y={-260} len={700} eye="happy" sx={-1} z={1} />
          {[0, 1, 2].map((i) => (
            <Krill key={i} x={-460} y={130 - i * 170} s={0.9} swim={frame + i * 7} z={0.5} />
          ))}
        </Paper>
      </Stage>
      <Label text="MENU" x={sc(-240, 290, zoom).x} y={sc(-240, 290, zoom).y} size={0.065} kind="ink" pin at={0} />
      {["KRILL", "KRILL", "KRILL"].map((s, i) => (
        <Label key={i} text={s} x={sc(-120, 130 - i * 170, zoom).x} y={sc(-120, 130 - i * 170, zoom).y} size={0.055} kind="ink" pin at={at(297.1 + i * 0.35)} />
      ))}
    </AbsoluteFill>
  );
};

// 298.98 "Krill are small, shrimp-like animals, about the size of your little finger."
export const FingerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const fin = ramp(t, 301.5, 302.3, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <Krill x={-140} y={200} s={4.4} swim={frame} z={1} />
          <Finger x={-1500 + fin * 1250} y={-240} s={1.05} z={0.5} />
        </Paper>
      </Stage>
      <Label text="SHRIMP-LIKE" x={0.92} y={0.1} size={0.05} kind="box" at={at(300.17)} />
      <Label text="ABOUT THE SIZE OF YOUR LITTLE FINGER" x={0.5} y={0.88} size={0.045} kind="box" at={at(302.4)} />
    </AbsoluteFill>
  );
};

// 303.56 "So here's the funny part."
export const FunnyPartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), x: 300 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={600}>
          <BlueWhale x={-400} y={-80} len={2200} eye="happy" swim={frame * 0.3} beat={0.2} z={1} />
          <Krill x={820} y={120 + Math.sin(frame * 0.2) * 20} s={1.6} rot={Math.sin(frame * 0.3) * 0.2} swim={frame} sx={-1} z={2} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 304.83 "The biggest animal that has ever lived survives by eating one of the smallest."
export const BiggestSmallestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const out = ramp(t, 306.0, 308.4, Easing.inOut(Easing.cubic));
  const zoom = interpolate(out, [0, 1], [2.6, 0.62]);
  const camX = interpolate(out, [0, 1], [430, 0]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: camX, y: 0 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={null}>
          <BlueWhale x={-900} y={0} len={2400} gaze={[1, 0]} swim={frame * 0.2} beat={0.1} z={1} />
          <Krill x={560} y={20} s={0.7} sx={-1} swim={frame} z={2} />
        </DeepSet>
      </Stage>
      <Label text="THE BIGGEST" x={0.08} y={0.1} size={0.055} kind="box" at={at(308.4)} />
      <Label text="ONE OF THE SMALLEST" x={sc(560, -60, zoom, camX).x} y={sc(560, -60, zoom, camX).y + 0.04} size={0.045} kind="box" pin at={at(308.6)} />
    </AbsoluteFill>
  );
};

// 310.01 "But krill come in huge swarms, packed tightly together."
export const HugeSwarmsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 1.0) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.3} surfaceY={700}>
          <KrillSwarm x={0} y={-20} w={1900} h={760} n={520} frame={frame} z={1} />
        </DeepSet>
      </Stage>
      <Label text="PACKED TIGHTLY" x={0.08} y={0.86} size={0.055} kind="box" at={at(312.6)} />
    </AbsoluteFill>
  );
};

// 313.77 "And remember the rule?"
export const RuleAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <RuleBoard w={1300} h={700} glow={hitAt(t, 314.0, 1.0)} s={0.9 + 0.1 * pop(t, 313.8)} />
        </Paper>
      </Stage>
      <Label text="BIGGER WHALE" x={sc(0, 120, zoom).x} y={sc(0, 120, zoom).y} size={0.075} kind="ink" pin at={0} />
      <Label text="= MORE FOOD PER GULP" x={sc(0, -60, zoom).x} y={sc(0, -60, zoom).y} size={0.065} kind="ink" pin at={0} />
    </AbsoluteFill>
  );
};

// 315.07 "The bigger the mouth, the more krill in every gulp."
export const BiggerMouthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const m = ramp(t, 315.0, 315.9, Easing.out(Easing.cubic));
  const go = ramp(t, 315.0, 317.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.68), x: go * 400 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={820}>
          <KrillSwarm x={700} y={0} w={1600} h={760} n={460} frame={frame} eaten={ramp(t, 315.8, 317.6)} z={0.5} />
          <BlueWhale x={-900 + go * 900} y={0} len={2100} mouth={m} krill={m} swim={frame * 1.5} beat={0.8} z={1} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

/** Pink mound of krill. */
const KrillPile: React.FC<{ x?: number; y?: number; z?: number; s?: number; frame: number }> = ({ x = 0, y = 0, z = 0, s = 1, frame }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={blob([[-520, 0], [-380, 160], [-120, 300], [100, 320], [360, 180], [520, 0]], 8)} color="#f08068" shade={0.22} />
    {Array.from({ length: 22 }, (_, i) => (
      <Krill key={i} x={-380 + (i % 8) * 105 + (Math.floor(i / 8) % 2) * 50} y={50 + Math.floor(i / 8) * 80} s={0.55} rot={(i * 1.7) % 6} swim={frame + i} z={0.01 + i * 0.001} />
    ))}
  </X>
);

// 318.11 "A 2021 study found that a blue whale can eat up to 16 tonnes of krill."
export const SixteenTonnesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.85, 0.92);
  const grow = ramp(t, 320.4, 321.8, Easing.out(Easing.back(1.2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 40, shake: hitAt(t, 321.25, 0.4) * 5 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <X y={-330} z={0}>
            <Part shape={roundRect(1500, 90, 20)} color="#8a8e96" shade={0.2} />
            <KrillPile y={45} s={Math.max(0.05, grow)} frame={frame} z={0.1} />
          </X>
          <Part shape={roundRect(1560, 120, 20)} color="#5a5e66" shade={0.2} y={-430} z={-0.1} />
          <Gauge x={640} y={300} r={160} level={grow * 0.9} z={0.5} />
          <BlueWhale x={-520} y={300} len={620} eye="happy" z={0.4} />
        </Paper>
      </Stage>
      <Label text="2021 STUDY" x={0.08} y={0.1} size={0.05} kind="box" at={at(318.2)} />
      <Label text="16 TONNES OF KRILL" x={sc(0, 100, zoom, 0, 40).x} y={sc(0, 100, zoom, 0, 40).y} size={0.07} kind="box" pin at={at(321.25)} />
    </AbsoluteFill>
  );
};

// 323.31 "In a single day."
export const SingleDayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const arc = ramp(t, 323.0, 324.6, Easing.linear);
  const a = Math.PI * (1 - arc);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Gradient w={4400} h={2600} stops={[[0, "#8fc8ee"], [1, "#f6d8a0"]]} z={-41} />
        <Sun x={Math.cos(a) * 760} y={-200 + Math.sin(a) * 520} r={110} glow={0.9} z={-30} />
        <Clock x={0} y={-60} r={240} speed={18} z={0} />
      </Stage>
      <Label text="IN ONE DAY" x={0.5} y={0.86} size={0.09} kind="title" at={at(323.4)} />
    </AbsoluteFill>
  );
};
