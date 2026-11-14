import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Glow, Gradient, Wash, roundRect, circle, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import { BlueWhale, ProtoWhale, Sauropod, KrillSwarm, Krill, WhaleHeart, HeartTrace, Blow, WaterFront, SurfaceFoam, ResearchBoat, Sky, Mountains, Ground } from "../../kit/env";
import { sec, pop, useScr, SpeechBubble } from "../../kit/shot";
import { CoastSet, DeepSet, Paper, RuleBoard, Chips, Riverbank } from "./sets";
import { YOU, MATE, VIEWER } from "./cast";

// The answer, the journey from Pakicetus to the giant, and the question for the viewer.

// 505.69 "So why is the blue whale so big?"
export const WhySoBigShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.66), y: 60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={820} seabedY={-950}>
          <BlueWhale x={900 - frame * 3.2} y={20} len={2700} swim={frame} z={1} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 508.19 "Remember the rule?"
export const RuleFinalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <RuleBoard w={1300} h={700} glow={hitAt(t, 508.5, 0.9)} s={0.92 + 0.08 * pop(t, 508.2)} />
        </Paper>
      </Stage>
      <Label text="THE RULE" x={sc(0, 30, zoom).x} y={sc(0, 30, zoom).y} size={0.11} kind="ink" pin at={0} />
    </AbsoluteFill>
  );
};

// 509.38 "For a filter feeder, bigger means more food in every mouthful and more fuel for the long trips."
export const SummaryRuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const m = ramp(t, 510.4, 511.4, Easing.out(Easing.cubic));
  const tank = ramp(t, 512.8, 513.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={null}>
          <Part shape={roundRect(12, 1400, 6)} color="#e8eef2" flat outline={0} opacity={0.6} z={0.1} />
          <X x={-490} z={1}>
            <KrillSwarm x={260} y={-40} w={420} h={300} n={110} frame={frame} eaten={m * 0.8} />
            <BlueWhale x={-120} y={-30} len={900} mouth={m} krill={m} swim={frame} z={0.1} />
          </X>
          <X x={490} z={1}>
            <BlueWhale x={0} y={-30} len={900} sy={1 + tank * 0.1} swim={frame} z={0.1} />
            <X x={-40} y={-20} z={0.2}>
              <Part shape={roundRect(300, 90, 26)} color="#1e2a3a" flat outline={5} />
              <Part shape={roundRect(276, 66 * tank + 1, 18)} color="#f2c23a" shade={0.15} y={-33 + 33 * tank} z={0.001} />
            </X>
          </X>
        </DeepSet>
      </Stage>
      <Label text="MORE FOOD PER MOUTHFUL" x={0.25} y={0.86} size={0.04} kind="box" at={at(510.46)} />
      <Label text="MORE FUEL FOR LONG TRIPS" x={0.75} y={0.86} size={0.04} kind="box" at={at(512.88)} />
    </AbsoluteFill>
  );
};

// 514.77 "Then the Ice Ages packed the oceans with dense swarms of krill."
export const IcePackedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.72), y: 60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.3} surfaceY={640}>
          {[-1400, -900, -300, 300, 900, 1400].map((x, i) => (
            <Part key={x} shape={blob([[-260, 40], [260, 50], [280, -60], [180, -140], [-200, -120]], 6)} color="#f4fafe" shade={0.15} x={x + Math.sin(frame * 0.04 + i) * 10} y={660} z={0.2} />
          ))}
          <KrillSwarm x={-600} y={-100} w={1200} h={600} n={300} frame={frame} z={1} />
          <KrillSwarm x={800} y={-300} w={1100} h={500} n={260} frame={frame + 40} seed={5} z={1} />
          <KrillSwarm x={300} y={300} w={800} h={300} n={140} frame={frame + 20} seed={8} z={1} />
        </DeepSet>
      </Stage>
      <Label text="ICE AGES: DENSE KRILL SWARMS" x={0.08} y={0.1} size={0.045} kind="box" at={at(515.4)} />
    </AbsoluteFill>
  );
};

// 518.07 "And the blue whale went all in."
export const AllInShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const shove = ramp(t, 518.6, 519.4, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.65}>
        <Gradient w={4400} h={2600} stops={[[0, "#2f7a4a"], [1, "#1a4a2a"]]} z={-41} />
        <Part shape={roundRect(700, 900, 40)} color="#f6f0de" shade={0.15} x={480} y={20} z={0}>
          <Krill s={2.6} y={20} swim={frame} z={0.01} />
        </Part>
        {Array.from({ length: 9 }, (_, i) => (
          <Chips key={i} x={-860 + shove * 1000 + (i % 3) * 90} y={-320 + Math.floor(i / 3) * 40} n={6 + (i % 4)} color={["#c8362f", "#2f5f9a", "#e9ba41"][i % 3]} z={1 + i * 0.01} />
        ))}
        <BlueWhale x={-900 + shove * 150} y={280} len={900} eye="happy" z={0.5} />
      </Stage>
      <Label text="ALL IN" x={0.5} y={0.12} size={0.1} kind="title" at={at(519.3)} />
    </AbsoluteFill>
  );
};

// 520.34 "A wolf-sized hunter on a riverbank in Pakistan became a 150-tonne giant."
export const JourneyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const pan = ramp(t, 520.4, 524.4, Easing.inOut(Easing.cubic));
  const camX = interpolate(pan, [0, 1], [-1700, 1500]);
  const zoom = interpolate(pan, [0, 1], [1.0, 0.62]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: camX, y: interpolate(pan, [0, 1], [-80, 60]) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <X z={-41}>
          <Sky w={9000} h={4000} y={1600} top="#7ab8d8" mid="#cfe2c8" bottom="#f4e2b0" />
        </X>
        <Mountains w={9000} y={-60} color="#a8b88a" outline={4} peaks={[[-3800, 220], [-2800, 300], [-1900, 200]]} z={-39} />
        <Ground w={4200} h={2000} x={-2900} y={-60} color="#9aa65a" far="#b0b468" pebbles={6} tufts={12} tuftColor="#6a7a3a" seed={7} z={-32} />
        <Part shape={blob([[-900, -60], [-400, -200], [600, -320], [5000, -340], [5000, -3000], [-900, -3000]], 6)} color="#3a8cb4" flat outline={6} z={-31} />
        <Part shape={roundRect(9000, 60, 0)} color="#9fd8ea" flat outline={5} x={2500} y={-90} z={-31.5} />
        <ProtoWhale x={-1900} y={-300} s={1.0} k={0} walk={frame} z={1} />
        <ProtoWhale x={-700} y={-430} s={0.85} k={0.4} swim={frame} z={1} />
        <ProtoWhale x={300} y={-560} s={0.85} k={0.8} swim={frame} z={1} />
        <ProtoWhale x={1200} y={-620} s={0.8} k={1} swim={frame} z={1} />
        <BlueWhale x={3000} y={-760} len={2600} swim={frame} eye="happy" z={1} />
      </Stage>
      <Label text="WOLF-SIZED HUNTER" x={0.08} y={0.1} size={0.05} kind="box" at={at(520.6)} until={at(522.6)} />
      <Label text="150-TONNE GIANT" x={0.92} y={0.1} size={0.06} kind="box" at={at(523.46)} />
    </AbsoluteFill>
  );
};

// 525.38 "A giant with a heart that beats twice a minute."
export const HeartFinalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const beat = Math.max(hitAt(t, 526.1, 0.7), hitAt(t, 527.13, 0.7));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0), x: 120 }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <DeepSet depth={0.6} rays={0.4}>
          <BlueWhale x={-100} y={0} len={1700} swim={frame * 0.4} beat={0.3} tag z={1} />
          <X x={-100 + 240} y={-40} z={3}>
            <Part shape={circle(210)} color="#0e2440" flat outline={8} outlineColor="#7fe0ff" opacity={0.92} />
            <Glow rx={260} color="#ff5a5a" alpha={0.25 + 0.5 * beat} additive z={0.01} />
            <WhaleHeart size={0.42 * (1 + 0.08 * beat)} beat={beat} y={10} z={0.02} />
          </X>
          <HeartTrace x={0} y={-400} w={1400} h={120} bpm={2} t={60 * ramp(t, 525.2, 528.3, Easing.linear) + 10} window={60} z={3} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 528.68 "The age of giants didn't end with the dinosaurs."
export const AgeOfGiantsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const fade = ramp(t, 529.6, 530.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e6d8b8" blotch="#b89a6a">
          <X x={-560} y={-60} z={0}>
            <Sauropod s={0.42} eye="open" walk={frame} />
            <Wash width={1400} height={1400} color="#e6d8b8" alpha={fade * 0.6} z={1} />
          </X>
          <X x={560} y={60} s={0.6 + 0.4 * ramp(t, 529.9, 530.9, Easing.out(Easing.back(1.3)))} z={2}>
            <Part shape={circle(420)} color="#3f8fb8" flat outline={8} />
            <BlueWhale len={700} swim={frame} eye="happy" z={0.1} />
          </X>
        </Paper>
      </Stage>
      <Label text="THE AGE OF GIANTS" x={0.5} y={0.12} size={0.075} kind="title" at={at(528.86)} />
    </AbsoluteFill>
  );
};

// 531.76 "It's happening right now."
export const RightNowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={700}>
          <BlueWhale x={-300 + frame * 3} y={60} len={2200} swim={frame} eye="happy" z={1} />
          <BlueWhale x={200 + frame * 3} y={-360} len={700} calf swim={frame * 1.3} eye="happy" z={1.1} />
        </DeepSet>
      </Stage>
      <Label text="RIGHT NOW" x={0.92} y={0.1} size={0.06} kind="box" at={at(532.33)} />
    </AbsoluteFill>
  );
};

// 533.33 "And whether it continues is now up to us."
export const UpToUsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: -60 }} light={{ dir: [0.6, 0.5] }} vignette={0.6}>
        <CoastSet horizon={60} mood="dusk">
          <BlueWhale x={480 - frame * 0.6} y={-420} len={1900} swim={frame * 0.3} beat={0.2} eye="happy" z={-12} />
          <Blow x={480 - frame * 0.6 + 498} y={-290} k={ramp(t, 534.0, 535.8)} s={1.1} z={-10.5} />
          <WaterFront y={-330} color="#3a5a7a" z={-11} />
          <SurfaceFoam x={480 - frame * 0.6} y={-332} rx={700} z={-10.9} />
          <ResearchBoat x={-700} y={-470} s={1.2} bob={frame} z={-4}>
            <Character {...YOU} x={-200} y={60} s={0.62} look={0.6} expression={{ eyes: "happy", mouth: "smile", gaze: [0.8, -0.1] }} pose={poses.idle(frame, 1)} />
            <Character {...MATE} x={250} y={60} s={0.62} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.8, -0.1] }} pose={poses.idle(frame, 2)} />
          </ResearchBoat>
        </CoastSet>
      </Stage>
    </AbsoluteFill>
  );
};

/** Framed window onto another world (portal), content drawn inside. */
const Portal: React.FC<{ x: number; y: number; z?: number; color: string; s?: number; children: React.ReactNode }> = ({ x, y, z = 0, color, s = 1, children }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={roundRect(720, 620, 40)} color="#8a5a32" shade={0.2} />
    <Part shape={roundRect(640, 540, 24)} color={color} flat outline={5} z={0.001} />
    <X z={0.002}>{children}</X>
  </X>
);

// 537.15 "So, if you could see one giant from Earth's history up close, which would you pick?"
export const PickShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const look = Math.sin(frame * 0.07);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <Portal x={-620} y={120} color="#cfe2b0" s={pop(t, 537.6)}>
            <Sauropod x={-40} y={-80} s={0.24} walk={frame} />
          </Portal>
          <Portal x={620} y={120} color="#4a9ec8" s={pop(t, 537.9)}>
            <BlueWhale len={500} swim={frame} eye="happy" />
          </Portal>
          <Character {...VIEWER} x={0} y={-500} s={1.05} facing={look > 0 ? 1 : -1} look={0.6} expression={{ eyes: "open", mouth: "wavy", gaze: [0.8, 0.4], brows: 0.4 }} pose={poses.think} z={1} />
        </Paper>
      </Stage>
      <Label text="WHICH WOULD YOU PICK?" x={0.5} y={0.88} size={0.06} kind="title" at={at(540.2)} />
    </AbsoluteFill>
  );
};

// 541.38 "The biggest dinosaur, or a living blue whale? Tell me in the comments."
export const VersusShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.85, 0.9);
  const bubble = pop(t, 543.95);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <Part shape={roundRect(1080, 1500, 0)} color="#cfe2b0" flat outline={6} x={-560} z={-1} />
          <Part shape={roundRect(1080, 1500, 0)} color="#4a9ec8" flat outline={6} x={560} z={-1} />
          <Sauropod x={-640} y={-260} s={0.4 * (0.8 + 0.2 * pop(t, 541.5))} walk={frame} />
          <BlueWhale x={600} y={-40} len={880 * (0.8 + 0.2 * pop(t, 542.8))} swim={frame} eye="happy" />
          <X s={pop(t, 542.6)} z={2}>
            <Part shape={circle(130)} color="#fe5649" shade={0.2} />
          </X>
          <SpeechBubble x={0} y={330} w={760} h={190} tx={-80} ty={140} s={bubble} z={3} />
        </Paper>
      </Stage>
      <Label text="VS" x={sc(0, 0, zoom).x} y={sc(0, 0, zoom).y} size={0.09} kind="ink" color="#ffffff" pin at={at(542.6)} />
      <Label text="TELL ME IN THE COMMENTS" x={sc(0, 330, zoom).x} y={sc(0, 330, zoom).y} size={0.045} kind="ink" pin at={at(544.0)} />
    </AbsoluteFill>
  );
};
