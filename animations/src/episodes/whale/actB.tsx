import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, Magnifier, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { BlueWhale, ProtoWhale, Hippo, Blow, DimArrow, Sunburst, WaterFront } from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { DeepSet, Riverbank, MuseumSet, Paper, TimeBar } from "./sets";

// Pakicetus on the riverbank (Pakistan, ~50 million years ago), the ear-bone
// evidence, the hippo, and the long walk back into the sea.

/** Small furry mammal (prey) that scurries. Facing +x. */
const Critter: React.FC<{ x?: number; y?: number; z?: number; s?: number; hop?: number; facing?: 1 | -1 }> = ({ x = 0, y = 0, z = 0, s = 1, hop = 0, facing = 1 }) => (
  <X x={x} y={y + Math.abs(Math.sin(hop)) * 40} z={z} s={s} sx={facing}>
    <Line pts={[[-60, 10], [-110, 30], [-140, 20]]} smooth width={8} color="#8a6a4a" z={-0.01} />
    <Part shape={blob([[60, 10], [40, 44], [-10, 50], [-60, 30], [-66, 0], [-30, -16], [30, -14]], 6)} color="#a8865e" shade={0.22}>
      <Part shape={circle(7)} color="#211b20" flat outline={0} x={42} y={22} z={0.001} />
      <Part shape={circle(5)} color="#f2a0a8" flat outline={2} x={64} y={12} z={0.001} />
    </Part>
    <Part shape={ellipse(14, 20)} color="#a8865e" shade={0.2} x={22} y={52} rot={-0.3} z={-0.005} />
  </X>
);

/** Shallow water in front of a wading animal: translucent band with ripples. Top edge at y=0. */
const Shallows: React.FC<{ y?: number; z?: number; w?: number; frame: number }> = ({ y = 0, z = 0, w = 6000, frame }) => (
  <X y={y} z={z}>
    <Part shape={roundRect(w, 900, 0)} color="#5a9ec0" flat outline={6} opacity={0.82} y={-450} />
    {Array.from({ length: 14 }, (_, i) => {
      const x = -w / 2 + ((i * 431) % w) + Math.sin(frame * 0.05 + i) * 20;
      return <Line key={i} pts={[[x - 50, -30 - (i % 4) * 60], [x + 50, -30 - (i % 4) * 60]]} width={6} color="#d8f0f8" opacity={0.7} z={0.01} />;
    })}
  </X>
);

/** Pakicetus skull, side view (fossil bone), facing +x. The ear region glows with `ear`. */
const PakiSkull: React.FC<{ x?: number; y?: number; z?: number; s?: number; ear?: number }> = ({ x = 0, y = 0, z = 0, s = 1, ear = 0 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={blob([[-300, 40], [-220, 130], [-60, 150], [120, 100], [330, 40], [420, 14], [420, -10], [200, -20], [-40, -40], [-200, -90], [-300, -60]], 8)} color="#e8d8b4" shade={0.2}>
      <Part shape={ellipse(60, 46)} color="#5a4a3a" flat outline={5} x={-60} y={70} z={0.001} />
      <Part shape={ellipse(40, 26)} color="#7a6a5a" flat outline={4} x={-200} y={40} z={0.001} />
      {Array.from({ length: 8 }, (_, i) => (
        <Part key={i} shape={poly([[100 + i * 38, -14], [124 + i * 38, -14], [112 + i * 38, -50]])} color="#fbf6ea" flat outline={3} z={0.002} />
      ))}
    </Part>
    <X x={-60} y={-60} z={-0.01} rot={-0.12}>
      <Part shape={blob([[-240, 20], [380, -10], [380, -50], [0, -70], [-220, -40]], 6)} color="#dccaa4" shade={0.2} />
    </X>
    <X x={-230} y={-70} z={0.02}>
      {ear > 0 ? <Glow rx={150} color="#ffd84a" alpha={0.6 * ear} additive /> : null}
      <Part shape={blob([[-50, 0], [-30, 40], [30, 44], [56, 6], [30, -36], [-30, -34]], 6)} color={ear > 0 ? "#f2c84a" : "#d8c49a"} shade={0.22} />
      <Line pts={[[-20, 0], [10, 20], [30, 0]]} smooth width={5} color="#8a6a3a" z={0.001} />
    </X>
  </X>
);

// 75.54 "Meet Pakicetus."
export const MeetPakicetusShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const walk = ramp(t, 75.1, 76.3, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={-60}>
          <ProtoWhale x={-900 + walk * 800} y={-230} s={1.3} k={0} walk={walk < 1 ? frame : undefined} gaze={t > 76.2 ? [-0.3, -0.4] : [0.6, 0.2]} z={1} />
        </Riverbank>
      </Stage>
      <Label text="PAKICETUS" x={0.5} y={0.14} size={0.09} kind="title" at={at(75.97)} />
    </AbsoluteFill>
  );
};

// 77.15 "It's about the size of a wolf."
export const WolfSizeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.05);
  const k = ramp(t, 77.4, 78.1);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={40} river={false}>
          <ProtoWhale x={-160 + frame * 1.2} y={-150} s={1.5} k={0} walk={frame} z={1} />
          <DimArrow x={-30 + frame * 1.2} y={180} len={1000 * k} width={20} z={2} />
        </Riverbank>
      </Stage>
      <Label text="ABOUT THE SIZE OF A WOLF" x={sc(0, 300, zoom, 0, 40).x} y={sc(0, 300, zoom, 0, 40).y - 0.04} size={0.055} kind="box" pin at={sec(start)(78.03)} />
    </AbsoluteFill>
  );
};

// 78.88 "It has four legs, a long tail, and sharp teeth."
export const FeaturesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.05, 1.1);
  const S = 1.7;
  const px = 60;
  const py = -40;
  const glow = (a: number) => hitAt(t, a, 0.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={260} river={false}>
          <Glow x={px + 0} y={py - 300} rx={420} ry={160} color="#ffe27a" alpha={0.5 * glow(79.21)} additive z={0.5} />
          <Glow x={px - 560} y={py - 60} rx={260} ry={140} color="#ffe27a" alpha={0.5 * glow(80.42)} additive z={0.5} />
          <Glow x={px + 420} y={py + 40} rx={220} ry={110} color="#ffe27a" alpha={0.5 * glow(81.24)} additive z={0.5} />
          <ProtoWhale x={px} y={py} s={S} k={0} walk={frame * 0.6} mouth={t > 81.0 ? 0.6 : 0} z={1} />
        </Riverbank>
      </Stage>
      <Label text="4 LEGS" x={sc(px, py - 330, zoom).x} y={sc(px, py - 330, zoom).y + 0.06} size={0.05} kind="box" pin at={at(79.21)} />
      <Label text="LONG TAIL" x={sc(px - 600, py + 40, zoom).x} y={sc(px - 600, py + 40, zoom).y - 0.12} size={0.05} kind="box" pin at={at(80.42)} />
      <Label text="SHARP TEETH" x={sc(px + 430, py + 140, zoom).x} y={sc(px + 430, py + 140, zoom).y - 0.12} size={0.05} kind="box" pin at={at(81.24)} />
    </AbsoluteFill>
  );
};

// 81.98 "It hunts on land,"
export const HuntsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lunge = ramp(t, 82.0, 82.45, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0, shake: hitAt(t, 82.45, 0.3) * 6 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={120} river={false}>
          <ProtoWhale x={-500 + lunge * 360} y={-200} s={1.4} k={0} walk={frame * 1.5} mouth={lunge} eye="wide" rot={-0.05 * lunge} z={1} />
          <Critter x={260 + t * 0} y={-330} s={1.3} hop={frame * 0.4} z={1.5} />
        </Riverbank>
      </Stage>
    </AbsoluteFill>
  );
};

// 83.1 "and it hangs around near water."
export const NearWaterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: -20 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={180} river={false}>
          <Part shape={roundRect(6000, 700, 0)} color="#5a9ec0" flat outline={6} y={-500} z={-29} />
          <ProtoWhale x={-100 + frame * 1.5} y={-250} s={1.3} k={0} walk={frame} gaze={[0.3, -0.8]} z={1} />
          <Shallows y={-430} frame={frame} z={2} />
        </Riverbank>
      </Stage>
    </AbsoluteFill>
  );
};

// 84.86 "It doesn't look anything like a whale."
export const NotLikeWhaleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Paper>
          <Part shape={roundRect(1000, 1100, 30)} color="#cfe0b0" flat outline={6} x={-560} z={-1} />
          <Part shape={roundRect(1000, 1100, 30)} color="#7fb6d8" flat outline={6} x={560} z={-1} />
          <ProtoWhale x={-560} y={-20} s={1.15} k={0} walk={frame} z={1} />
          <BlueWhale x={560} y={0} len={880} swim={frame} z={1} />
          <X s={pop(t, 85.7)} z={2}>
            <Part shape={roundRect(180, 34, 17)} color="#fe5649" shade={0.15} y={34} />
            <Part shape={roundRect(180, 34, 17)} color="#fe5649" shade={0.15} y={-34} z={0.001} />
            <Part shape={roundRect(30, 200, 15)} color="#fe5649" shade={0.15} rot={-0.5} z={0.002} />
          </X>
        </Paper>
      </Stage>
    </AbsoluteFill>
  );
};

// 86.73 "But it is one."
export const IsOneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={200} river={false}>
          <ProtoWhale x={-60} y={-160} s={1.8} k={0} eye="happy" z={1} />
        </Riverbank>
      </Stage>
      <Label text="WHALE ✓" x={0.72} y={0.2} size={0.08} kind="stamp" rotate={-8} at={at(87.25)} />
    </AbsoluteFill>
  );
};

// 88.17 "How do we know?"
export const HowKnowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const mx = interpolate(t, [87.9, 88.9], [-500, 250], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={200} river={false}>
          <ProtoWhale x={-120} y={-160} s={1.6} k={0} eye="wide" gaze={[0.2, 0.9]} z={1} />
          <Magnifier x={mx} y={0} r={130} rot={-0.5} z={2} />
        </Riverbank>
      </Stage>
    </AbsoluteFill>
  );
};

// 89.17 "Its ear bones have a special shape that only whales have."
export const EarBonesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.08);
  const ear = ramp(t, 89.3, 89.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: -40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <MuseumSet floor={-480} skeleton={false}>
          <Part shape={roundRect(1500, 80, 14)} color="#5a3a24" shade={0.2} y={-330} z={-5} />
          <PakiSkull x={60} y={-90} s={1.6} ear={ear} z={0} />
        </MuseumSet>
      </Stage>
      <Label text="EAR BONES" x={sc(60 - 230 * 1.6, -90 - 70 * 1.6, zoom, -40).x} y={sc(60 - 230 * 1.6, -90 - 70 * 1.6, zoom, -40).y + 0.12} size={0.055} kind="box" pin at={at(89.4)} />
      <Label text="ONLY WHALES HAVE THIS SHAPE" x={0.5} y={0.12} size={0.05} kind="title" at={at(91.2)} />
    </AbsoluteFill>
  );
};

// 92.62 "Pakicetus is one of the earliest whales we know of."
export const EarliestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.95, 1.0);
  const k = ramp(t, 92.6, 94.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Paper>
          <TimeBar y={-200} w={1600} k={k} ticks={[0.02, 0.3, 0.55, 0.98]} />
          <ProtoWhale x={-780} y={60} s={0.7} k={0} z={1} />
          <ProtoWhale x={-300} y={20} s={0.55} k={0.5} z={1} />
          {k > 0.55 ? <ProtoWhale x={120} y={0} s={0.45} k={1} z={1} /> : null}
          {k > 0.95 ? <BlueWhale x={640} y={40} len={560} eye="happy" z={1} /> : null}
          <Glow x={-780} y={60} rx={260} color="#ffe27a" alpha={0.5 * hitAt(t, 93.8, 1.2)} additive z={0.5} />
        </Paper>
      </Stage>
      <Label text="50 MILLION YEARS AGO" x={sc(-640, -300, zoom).x} y={sc(-800, -300, zoom).y} size={0.04} kind="box" pin at={at(92.7)} />
      <Label text="TODAY" x={sc(760, -300, zoom).x} y={sc(760, -300, zoom).y} size={0.04} kind="box" pin at={at(94.3)} />
      <Label text="ONE OF THE EARLIEST WHALES" x={0.5} y={0.12} size={0.055} kind="title" at={at(93.82)} />
    </AbsoluteFill>
  );
};

// 95.42 "The great-grandfather of the giants."
export const GrandfatherShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.92, 0.98);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <MuseumSet floor={-500} skeleton={false}>
          <X x={-380} y={180} z={0}>
            <Part shape={roundRect(860, 660, 30)} color="#c9963f" shade={0.22} />
            <Part shape={roundRect(740, 540, 12)} color="#cfe0b0" flat outline={6} z={0.001} />
            <X z={0.002}>
              <ProtoWhale x={0} y={-30} s={1.0} k={0} eye="happy" />
            </X>
            <Part shape={roundRect(420, 80, 10)} color="#e8d6a0" shade={0.15} y={-380} z={0.003} />
          </X>
          <BlueWhale x={640} y={-200} len={900} eye="happy" gaze={[-0.6, 0.3]} sx={-1} z={0.5} />
        </MuseumSet>
      </Stage>
      <Label text="GREAT-GRANDFATHER" x={sc(-380, 180 - 380, zoom, 0, 40).x} y={sc(-380, 180 - 380, zoom, 0, 40).y} size={0.036} kind="ink" pin at={at(95.6)} />
    </AbsoluteFill>
  );
};

// 97.91 "And here's a fun fact."
export const FunFactShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <Paper color="#f2e2b8" blotch="#d8b878">
          <Sunburst r={1400} rays={18} color="#f2c84a" alt="#f8dc78" speed={0.4} z={0} />
          <X s={pop(t, 98.3)} z={1}>
            <Glow rx={300} color="#fff6c8" alpha={0.7} additive />
          </X>
        </Paper>
      </Stage>
      <Label text="FUN FACT" x={0.5} y={0.5} size={0.11} kind="title" at={at(98.27)} />
    </AbsoluteFill>
  );
};

// 99.2 "The closest living cousin of whales today?"
export const CousinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <Paper>
          <BlueWhale x={-420} y={60} len={1000} eye="open" gaze={[1, 0]} swim={frame * 0.5} beat={0.3} z={1} />
          <Hippo x={600} y={-60} s={0.9} sx={-1} color="#2a2630" eye="closed" z={1} />
          <Part shape={roundRect(140, 160, 30)} color="#fe5649" flat outline={0} x={600} y={340} opacity={0} />
          <X x={600} y={330} s={1.3 * pop(t, 100.5)} z={2}>
            <Glow rx={160} color="#ffffff" alpha={0.5} />
            <QuestionMark size={1.4} z={0.01} />
          </X>
        </Paper>
      </Stage>
    </AbsoluteFill>
  );
};

// 101.75 "The hippo."
export const HippoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0), y: 40, shake: hitAt(t, 101.9, 0.3) * 5 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Paper color="#e8e4d8">
          <BlueWhale x={-460} y={80} len={1000} eye="happy" swim={frame * 0.5} beat={0.3} z={1} />
          <Hippo x={560} y={-80} s={0.95 * (0.8 + 0.2 * pop(t, 101.8))} sx={-1} eye="happy" mouth={0.5} z={1} />
          <Part shape={blob([[0, -30], [-40, 10], [-30, 40], [0, 24], [30, 40], [40, 10]], 6)} color="#fe5649" shade={0.15} x={80} y={250} s={1.6 * pop(t, 102.1)} z={2} />
        </Paper>
      </Stage>
      <Label text="HIPPO" x={0.78} y={0.82} size={0.07} kind="box" at={at(101.91)} />
    </AbsoluteFill>
  );
};

// 103.16 "Over millions of years, Pakicetus's family moves deeper into the water."
export const DeeperShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 103.0, 107.3, Easing.inOut(Easing.quad));
  const x = interpolate(k, [0, 1], [-1200, 900]);
  const sink = interpolate(k, [0, 0.45, 1], [0, 20, 90]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.74), x: interpolate(k, [0, 1], [-700, 650]), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={100} river={false}>
          {/* the shore slopes into a lagoon on the right */}
          <Part shape={blob([[-400, 0], [200, -80], [800, -220], [3000, -260], [3000, -1600], [-400, -1600]], 6)} color="#4a8cb4" flat outline={6} y={-180} z={-29} />
          <ProtoWhale x={x} y={-330 - sink} s={1.0} k={k * 0.55} walk={k < 0.6 ? frame : undefined} swim={k >= 0.6 ? frame : undefined} z={1} />
          <Part shape={blob([[-400, 0], [200, -80], [800, -220], [3000, -260], [3000, -1600], [-400, -1600]], 6)} color="#5a9ec0" flat outline={6} opacity={0.42} y={-180} z={2} />
        </Riverbank>
      </Stage>
      <Label text="MILLIONS OF YEARS" x={0.08} y={0.1} size={0.045} kind="box" at={at(103.4)} />
    </AbsoluteFill>
  );
};

// 107.46 "Their legs shrink."
export const LegsShrinkShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = interpolate(t, [107.3, 108.5], [0.3, 0.68], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.2, 1.26), y: -80 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.1} surfaceY={420} tint="#4aa8b8">
          <ProtoWhale x={-40} y={0} s={1.5} k={k} swim={frame} z={1} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 108.72 "Their bodies get longer."
export const LongerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = interpolate(t, [108.6, 110.0], [0.6, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const L = interpolate(k, [0.6, 0.9], [1050, 1380]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.15} surfaceY={460} tint="#4aa8b8">
          <ProtoWhale x={60} y={0} s={1.25} k={k} swim={frame} z={1} />
          <DimArrow x={60} y={-260} len={L} width={20} z={2} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 110.3 "Their nostrils move to the top of their heads and become blowholes."
export const BlowholeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const k = interpolate(t, [110.3, 112.4], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const zoom = push(frame, dur, 1.5, 1.58);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: 380, y: 80 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <DeepSet depth={0.05} surfaceY={300} tint="#4aa8b8">
          <ProtoWhale x={0} y={40} s={1.3} k={k} showNostril swim={frame * 0.5} z={1} />
          <Blow x={330 + 120} y={290} k={ramp(t, 112.8, 113.9)} s={0.7} z={3} />
        </DeepSet>
      </Stage>
      <Label text="BLOWHOLE" x={0.7} y={0.16} size={0.055} kind="box" at={at(112.77)} />
    </AbsoluteFill>
  );
};

/** Small fish (school filler). */
export const Fish: React.FC<{ x?: number; y?: number; z?: number; s?: number; color?: string; swim?: number; facing?: 1 | -1 }> = ({ x = 0, y = 0, z = 0, s = 1, color = "#e9ba41", swim = 0, facing = 1 }) => (
  <X x={x} y={y} z={z} s={s} sx={facing}>
    <X x={-40} rot={Math.sin(swim * 0.3) * 0.3}>
      <Part shape={poly([[0, 0], [-40, 26], [-40, -26]])} color={color} shade={0.2} />
    </X>
    <Part shape={ellipse(50, 26)} color={color} shade={0.22} z={0.001}>
      <Part shape={circle(6)} color="#211b20" flat outline={0} x={28} y={6} z={0.001} />
    </Part>
  </X>
);

// 113.67 "By about 40 million years ago, some whales live only in the sea."
export const SeaOnlyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 40 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.3} surfaceY={600} seabedY={-700}>
          <ProtoWhale x={-300 + frame * 2.4} y={20} s={1.5} k={1} swim={frame} z={1} />
          {Array.from({ length: 9 }, (_, i) => (
            <Fish key={i} x={700 - frame * 1.5 + (i % 3) * 90} y={260 + Math.floor(i / 3) * 70 + Math.sin(frame * 0.1 + i) * 10} s={0.6} facing={-1} swim={frame + i} color={i % 2 ? "#e9ba41" : "#f2a03a"} z={0.5} />
          ))}
        </DeepSet>
      </Stage>
      <Label text="40 MILLION YEARS AGO" x={0.08} y={0.1} size={0.05} kind="box" at={at(114.08)} />
    </AbsoluteFill>
  );
};
