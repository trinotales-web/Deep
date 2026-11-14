import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Gradient, roundRect, circle, ellipse, poly, blob, path, push, hitAt, absT, ramp, InkLine, Magnifier, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  BlueWhale, Krill, KrillSwarm, Gauge, DimArrow, PolarMap, polarXY, WorldMap, worldXY, Calendar, WhaleHeart, SedanEV, XMark, Puffs,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { DeepSet, Paper, RuleBoard, BeachSet, LabSet } from "./sets";
import { LAB, KID, YOU } from "./cast";

// The krill season, migration on stored fat, calves, and busting the heart myth.

const ANCIENT = "#7a7468";
const WARM = "#4ab0c0";

/** "Fuel tank" cutaway (yellow fat) to lay over a whale body. Level 0..1. */
const FatTank: React.FC<{ x?: number; y?: number; z?: number; w?: number; h?: number; level: number }> = ({ x = 0, y = 0, z = 0, w = 420, h = 150, level }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(w, h, 30)} color="#1e2a3a" flat outline={6} />
    <Part shape={roundRect(w - 24, Math.max(8, (h - 24) * level), 18)} color="#f2c23a" shade={0.15} y={-(h - 24) / 2 + ((h - 24) * level) / 2} z={0.001} />
    {[0.25, 0.5, 0.75].map((f) => (
      <Line key={f} pts={[[w / 2 - 40, -h / 2 + 12 + (h - 24) * f], [w / 2 - 14, -h / 2 + 12 + (h - 24) * f]]} width={4} color="#e8eef2" z={0.002} />
    ))}
  </X>
);

// 325.01 "There's a catch, though."
export const CatchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={640}>
          <BlueWhale x={-300 + frame * 2} y={-60} len={1500} eye="happy" swim={frame} z={1} />
          <KrillSwarm x={700} y={60} w={500} h={300} n={90} frame={frame} z={0.5} />
        </DeepSet>
      </Stage>
      <Label text="THE CATCH" x={0.76} y={0.2} size={0.07} kind="stamp" rotate={-7} at={at(325.23)} />
    </AbsoluteFill>
  );
};

// 326.28 "Krill don't stay around all year."
export const NotAllYearShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.35} surfaceY={640}>
          <KrillSwarm x={-300} y={-40} w={1000} h={500} n={260} frame={frame} eaten={ramp(t, 326.4, 327.8)} z={0.5} />
          <X x={560} y={160} s={1.2} z={1}>
            <Calendar flip={(frame * 0.12) % 1} />
          </X>
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 328.12 "In summer, they explode in cold waters near the poles."
export const SummerPolesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const ppd = interpolate(frame, [0, dur], [9, 10]);
  const k = ramp(t, 328.8, 329.8, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <PolarMap pole="south" ppd={ppd} w={2600} h={1600} seaIceLat={-66}>
          {Array.from({ length: 28 }, (_, i) => {
            const lon = -180 + i * (360 / 28);
            const lat = -60 + Math.sin(i * 1.7) * 3;
            const [x, y] = polarXY(lon, lat, "south", ppd);
            return (
              <X key={i} x={x} y={y} s={k * (0.8 + 0.3 * Math.sin(frame * 0.15 + i))}>
                <Glow rx={110} color="#ff8a6a" alpha={0.5} additive />
                <Part shape={circle(22)} color="#f2856a" shade={0.2} />
              </X>
            );
          })}
        </PolarMap>
      </Stage>
      <Label text="SUMMER: KRILL BOOM" x={0.08} y={0.1} size={0.05} kind="box" at={at(328.3)} />
    </AbsoluteFill>
  );
};

// 331.17 "Then they become hard to find."
export const HardToFindShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95) }} light={{ dir: [-0.4, 0.8] }} vignette={0.75}>
        <DeepSet depth={0.6} surfaceY={640}>
          <BlueWhale x={-200 + frame * 1.5} y={-40} len={1400} gaze={[Math.sin(frame * 0.12), -0.3]} swim={frame} beat={0.5} z={1} />
          <Krill x={700} y={300} s={0.6} swim={frame} z={0.5} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 332.9 "So blue whales eat as much as they can for a few months."
export const EatMonthsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const lunge = Math.max(0, Math.sin((t - 332.8) * 3.2));
  const fat = ramp(t, 332.8, 336.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.85) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={700}>
          <KrillSwarm x={500} y={-40} w={1400} h={700} n={300} frame={frame} eaten={fat * 0.6} z={0.5} />
          <BlueWhale x={-300 + frame * 1.2} y={-20} len={1700} mouth={lunge * 0.8} krill={lunge} sy={1 + fat * 0.14} swim={frame} z={1} />
          <X x={-760} y={330} s={0.8} z={2}>
            <Calendar flip={(frame * 0.08) % 1} />
          </X>
        </DeepSet>
      </Stage>
      <Label text="A FEW MONTHS OF FEASTING" x={0.92} y={0.86} size={0.05} kind="box" at={at(335.2)} />
    </AbsoluteFill>
  );
};

// 336.25 "Then they swim thousands of kilometers to warmer waters to give birth."
export const MigrationShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const ppd = 5.2;
  const center: [number, number] = [-88, -24];
  const from = worldXY(-70, -62, ppd, center);
  const to = worldXY(-92, 6, ppd, center);
  const k = ramp(t, 336.5, 339.6);
  const pts: [number, number][] = Array.from({ length: 24 }, (_, i) => {
    const u = i / 23;
    return [from[0] + (to[0] - from[0]) * u - Math.sin(u * Math.PI) * 220, from[1] + (to[1] - from[1]) * u];
  });
  const n = Math.max(2, Math.round(24 * k));
  const tip = pts[n - 1];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <WorldMap ppd={ppd} center={center} w={2600} h={1600} tint={{}} />
        <Glow x={from[0]} y={from[1]} rx={260} color="#9fd8f0" alpha={0.5} z={0.5} />
        <Glow x={to[0]} y={to[1]} rx={260} color="#ffd88a" alpha={0.55 * ramp(t, 338.2, 338.8)} z={0.5} />
        {pts.slice(0, n).map((p, i) => (i % 2 === 0 && i + 1 < n ? <InkLine key={i} pts={[p, pts[i + 1]]} width={14} color="#2f5f9a" outline={4} z={0.6} /> : null))}
        <X x={tip[0]} y={tip[1]} rot={Math.atan2(to[1] - from[1], to[0] - from[0])} z={1}>
          <BlueWhale len={300} swim={frame} />
        </X>
      </Stage>
      <Label text="THOUSANDS OF KILOMETERS" x={0.08} y={0.1} size={0.045} kind="box" at={at(336.86)} />
      <Label text="WARMER WATERS" x={sc(to[0] + 200, to[1] + 40).x} y={sc(to[0] + 200, to[1] + 40).y} size={0.045} kind="box" pin at={at(338.3)} />
    </AbsoluteFill>
  );
};

// 340.3 "On that trip, they don't eat much."
export const DontEatShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.15} surfaceY={600} tint={WARM}>
          <BlueWhale x={-400 + frame * 2.5} y={-40} len={1600} swim={frame} eye="sad" z={1} />
        </DeepSet>
      </Stage>
      <Label text="NOT MUCH FOOD" x={0.92} y={0.86} size={0.05} kind="box" at={at(341.6)} />
    </AbsoluteFill>
  );
};

// 342.49 "They live on the fat they stored up."
export const FatStoreShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const lvl = interpolate(t, [342.4, 344.3], [0.9, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.15} surfaceY={600} tint={WARM}>
          <BlueWhale x={-60} y={-20} len={1700} swim={frame * 0.6} beat={0.4} z={1} />
          <FatTank x={-140} y={10} w={520} h={130} level={lvl} z={1.5} />
        </DeepSet>
      </Stage>
      <Label text="STORED FAT" x={0.5} y={0.86} size={0.06} kind="box" at={at(343.0)} />
    </AbsoluteFill>
  );
};

// 344.75 "And here, being big helps again."
export const BigHelpsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={640}>
          <BlueWhale x={-300 + frame * 2} y={280} len={600} color={ANCIENT} swim={frame * 1.4} z={1} />
          <BlueWhale x={-100 + frame * 2} y={-200} len={1700} eye="happy" swim={frame} z={1} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 347.46 "A bigger body is a bigger fuel tank."
export const FuelTankShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 347.8, 348.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={640}>
          <BlueWhale x={-200} y={300} len={700} color={ANCIENT} swim={frame * 0.8} beat={0.5} z={1} />
          <FatTank x={-230} y={300} w={180 * k + 1} h={60} level={0.85} z={1.5} />
          <BlueWhale x={0} y={-200} len={1800} swim={frame * 0.6} beat={0.3} z={1} />
          <FatTank x={-80} y={-180} w={620 * k + 1} h={150} level={0.85} z={1.5} />
        </DeepSet>
      </Stage>
      <Label text="BIGGER FUEL TANK" x={0.92} y={0.1} size={0.055} kind="box" at={at(348.84)} />
    </AbsoluteFill>
  );
};

// 349.86 "The more fat you can carry, the longer you can go without food."
export const LongerWithoutShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const small = interpolate(t, [350.0, 352.6], [0.9, 0.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const big = interpolate(t, [350.0, 353.2], [0.9, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <Gauge x={-440} y={120} r={260} level={small} z={0} />
          <Gauge x={440} y={120} r={260} level={big} z={0} />
          <BlueWhale x={-440} y={-300} len={420} color={ANCIENT} eye={small < 0.15 ? "sad" : "open"} z={1} />
          <BlueWhale x={440} y={-300} len={760} eye="happy" z={1} />
        </Paper>
      </Stage>
      <Label text="EMPTY!" x={0.27} y={0.1} size={0.06} kind="stamp" rotate={-6} at={at(352.5)} />
    </AbsoluteFill>
  );
};

// 353.44 "So the rule gets even stronger."
export const StrongerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.92, 1.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, shake: hitAt(t, 354.5, 0.4) * 5 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <RuleBoard w={1300} h={700} glow={ramp(t, 353.6, 354.6)} s={1 + 0.06 * pop(t, 354.5)} />
        </Paper>
      </Stage>
      <Label text="THE RULE" x={sc(0, 160, zoom).x} y={sc(0, 160, zoom).y} size={0.085} kind="ink" pin at={0} />
      <Label text="GETS STRONGER" x={sc(0, -40, zoom).x} y={sc(0, -40, zoom).y} size={0.065} kind="ink" pin at={sec(start)(354.24)} />
    </AbsoluteFill>
  );
};

// 355.41 "Bigger mouth, more food. Bigger body, more fuel."
export const RuleTwoLinesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.95, 1.02);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <RuleBoard w={1400} h={760} />
          <BlueWhale x={-470} y={110} len={260} mouth={0.8} krill={1} z={1} />
          <BlueWhale x={-470} y={-150} len={260} sy={1.2} z={1} />
        </Paper>
      </Stage>
      <Label text="BIGGER MOUTH" x={sc(-140, 130, zoom).x} y={sc(-140, 130, zoom).y} size={0.055} kind="ink" pin at={at(355.41)} />
      <Label text="→ MORE FOOD" x={sc(330, 130, zoom).x} y={sc(330, 130, zoom).y} size={0.055} kind="ink" color="#2f8a4a" pin at={at(356.31)} />
      <Label text="BIGGER BODY" x={sc(-140, -150, zoom).x} y={sc(-140, -150, zoom).y} size={0.055} kind="ink" pin at={at(357.29)} />
      <Label text="→ MORE FUEL" x={sc(330, -150, zoom).x} y={sc(330, -150, zoom).y} size={0.055} kind="ink" color="#2f8a4a" pin at={at(358.19)} />
    </AbsoluteFill>
  );
};

// 359.52 "That fat also feeds the babies."
export const FeedsBabiesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: 40 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.12} surfaceY={700} tint={WARM}>
          <BlueWhale x={-200 + frame * 1.4} y={160} len={2100} eye="happy" swim={frame * 0.7} beat={0.5} z={1} />
          <BlueWhale x={60 + frame * 1.4} y={-300} len={700} calf eye="happy" swim={frame * 1.2} z={2} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 361.99 "A newborn blue whale is about 7 meters long."
export const CalfLengthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.05);
  const k = ramp(t, 362.6, 363.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.12} surfaceY={560} tint={WARM}>
          <BlueWhale x={0} y={60} len={1300} calf eye="happy" swim={frame} z={1} />
          <DimArrow x={-650 + 650 * k} y={-170} len={1300 * k} width={20} z={2} />
        </DeepSet>
      </Stage>
      <Label text="7 METERS" x={sc(0, -260, zoom).x} y={sc(0, -260, zoom).y} size={0.07} kind="box" pin at={at(363.47)} />
    </AbsoluteFill>
  );
};

// 364.92 "It drinks milk that's about half fat."
export const MilkShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 365.3, 366.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -40 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.12} surfaceY={700} tint={WARM}>
          <BlueWhale x={-200} y={260} len={2000} eye="happy" swim={frame * 0.4} beat={0.2} z={1} />
          <BlueWhale x={-80} y={-230} len={760} calf eye="happy" swim={frame} rot={0.12} z={2} />
          <Puffs x={240} y={-60} s={k} puffs={[[0, 0, 40], [50, 20, 34], [-40, 26, 30], [20, 50, 28], [80, -10, 24]]} color="#fbfbf6" z={1.5} />
        </DeepSet>
      </Stage>
      <Label text="MILK: ABOUT HALF FAT" x={0.92} y={0.12} size={0.05} kind="box" at={at(366.15)} />
    </AbsoluteFill>
  );
};

// 367.28 "And it gains about 90 kilos every single day."
export const GainsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const day = Math.floor(Math.max(0, t - 367.6) / 0.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <X y={-300} z={0}>
            <Part shape={roundRect(1200, 80, 18)} color="#8a8e96" shade={0.2} />
            <BlueWhale x={-40} y={150} len={800 + day * 30} calf eye="happy" z={0.1} />
          </X>
          <Part shape={roundRect(1260, 110, 18)} color="#5a5e66" shade={0.2} y={-390} z={-0.1} />
          <X x={640} y={260} s={1.1} z={1}>
            <Calendar flip={((t - 367.6) / 0.7) % 1} />
          </X>
        </Paper>
      </Stage>
      <Label text="+90 KG A DAY" x={0.3} y={0.14} size={0.075} kind="box" at={at(368.42)} />
      <Label text="EVERY SINGLE DAY" x={0.5} y={0.88} size={0.05} kind="title" at={at(369.49)} />
    </AbsoluteFill>
  );
};

// 371.18 "Now, let's bust a myth."
export const MythShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#e8e2d0" blotch="#c8b88a">
          <WhaleHeart y={-40} size={0.7} beat={Math.max(0, Math.sin(t * 3)) ** 8} />
          <Magnifier x={-60 + Math.sin(frame * 0.1) * 120} y={60} r={170} rot={-0.4} z={1} />
        </Paper>
      </Stage>
      <Label text="MYTH?" x={0.76} y={0.2} size={0.09} kind="stamp" rotate={-8} at={at(372.31)} />
    </AbsoluteFill>
  );
};

// 373.08 "You might have heard that a blue whale's heart is the size of a car."
export const CarHeartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const grow = ramp(t, 374.6, 375.6, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <Part shape={roundRect(4000, 40, 8)} color="#b8b2a4" flat outline={5} y={-330} z={-1} />
          <SedanEV x={-460} y={-330} s={1.7} color="#d8463a" />
          <WhaleHeart x={520} y={20} size={0.25 + 0.6 * grow} beat={Math.max(0, Math.sin(t * 3)) ** 8} />
        </Paper>
      </Stage>
      <Label text="AS BIG AS A CAR?" x={0.5} y={0.12} size={0.065} kind="title" at={at(375.45)} />
    </AbsoluteFill>
  );
};

/** Kid swimming through a cut-away artery (the myth picture). */
const ArterySwim: React.FC<{ frame: number }> = ({ frame }) => (
  <X>
    <Part shape={roundRect(2600, 520, 260)} color="#b8323a" shade={0.2} z={-1} />
    <Part shape={roundRect(2500, 400, 200)} color="#6a1a22" flat outline={6} z={-0.9} />
    {Array.from({ length: 12 }, (_, i) => (
      <Part key={i} shape={ellipse(40, 24)} color="#d84a52" flat outline={4} x={-1100 + ((i * 230 + frame * 6) % 2300)} y={((i * 53) % 260) - 130} z={-0.8} />
    ))}
    <X x={-200 + Math.sin(frame * 0.05) * 60} y={-60} rot={-Math.PI / 2 + 0.1} z={0}>
      <Character {...KID} x={0} y={-180} s={0.9} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: [2.4 + Math.sin(frame * 0.3) * 0.4, 0.3], armB: [-0.6 + Math.sin(frame * 0.3 + 2) * 0.5, -0.3], legF: Math.sin(frame * 0.4) * 0.3, legB: -Math.sin(frame * 0.4) * 0.3 }} shadow={false} />
    </X>
  </X>
);

// 376.3 "And that a child could swim through its arteries."
export const ChildSwimShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#f0d8d8" blotch="#c8888a">
          <ArterySwim frame={frame} />
        </Paper>
      </Stage>
      <Label text="SWIM THROUGH ITS ARTERIES?" x={0.5} y={0.12} size={0.06} kind="title" at={at(377.43)} />
    </AbsoluteFill>
  );
};

// 379.09 "In 2014, a blue whale washed up dead in Canada."
export const CanadaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: -60 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <BeachSet shore={-160}>
          <BlueWhale x={60} y={-400} len={2300} rot={0.04} eye="closed" color="#6a86a4" z={1} />
          {[-1000, 1050].map((x, i) => (
            <Character key={x} {...LAB(i + 1)} x={x} y={-560} s={0.85} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "open", mouth: "frown", brows: 0.6 }} pose={poses.idle(frame, i)} z={2} />
          ))}
        </BeachSet>
      </Stage>
      <Label text="2014 · CANADA" x={0.08} y={0.1} size={0.055} kind="box" at={at(379.21)} />
    </AbsoluteFill>
  );
};

// 382.94 "For the first time ever, scientists saved its heart and studied it."
export const SavedHeartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 60 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <LabSet floor={-460} desk={false}>
          <Part shape={roundRect(1000, 70, 14)} color="#c8ccd2" shade={0.2} y={-170} z={-2} />
          <Part shape={roundRect(60, 300, 10)} color="#8a8e96" shade={0.2} x={-420} y={-320} z={-2.1} />
          <Part shape={roundRect(60, 300, 10)} color="#8a8e96" shade={0.2} x={420} y={-320} z={-2.1} />
          <WhaleHeart x={0} y={220} size={0.65} />
          <Character {...LAB(0)} x={-700} y={-460} s={1.0} look={0.6} expression={{ eyes: "wide", mouth: "o", gaze: [0.7, 0.2] }} pose={poses.point(frame)} z={1} />
          <Character {...LAB(3)} x={700} y={-460} s={1.0} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.7, 0.2] }} pose={poses.think} z={1} />
        </LabSet>
      </Stage>
      <Label text="FIRST TIME EVER" x={0.08} y={0.1} size={0.05} kind="box" at={at(383.4)} />
    </AbsoluteFill>
  );
};

// 386.86 "It weighed about 180 kilos."
export const HeartScaleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const k = ramp(t, 387.0, 388.0, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <X y={-330} z={0}>
            <Part shape={roundRect(900, 80, 18)} color="#8a8e96" shade={0.2} />
            <WhaleHeart x={-60} y={330} size={0.62} />
          </X>
          <Part shape={roundRect(960, 110, 18)} color="#5a5e66" shade={0.2} y={-420} z={-0.1} />
          <Gauge x={620} y={200} r={170} level={0.2 * k} z={0.5} />
        </Paper>
      </Stage>
      <Label text={`${Math.round(180 * k)} KG`} x={sc(620, -60).x} y={sc(620, -60).y} size={0.08} kind="box" pin at={at(387.2)} />
    </AbsoluteFill>
  );
};

// 389.89 "Big, but smaller than a car."
export const SmallerThanCarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <Part shape={roundRect(4000, 40, 8)} color="#b8b2a4" flat outline={5} y={-330} z={-1} />
          <SedanEV x={-300} y={-330} s={1.7} color="#d8463a" />
          <WhaleHeart x={560} y={-190} size={0.28} beat={Math.max(0, Math.sin(t * 3)) ** 8} />
        </Paper>
      </Stage>
      <Label text="SMALLER THAN A CAR" x={0.5} y={0.12} size={0.065} kind="title" at={at(390.62)} />
    </AbsoluteFill>
  );
};

/** SVG path for a flesh wall with a round hole (the aorta seen end-on). */
const holePath = (w: number, h: number, r: number) => {
  const n = 40;
  const ring = Array.from({ length: n }, (_, i) => {
    const a = -(i / n) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  });
  return `M ${-w / 2} ${-h / 2} L ${w / 2} ${-h / 2} L ${w / 2} ${h / 2} L ${-w / 2} ${h / 2} Z M ${ring.join(" L ")} Z`;
};

// 392.25 "And its biggest artery? Wide enough for a human head, barely."
export const ArteryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const push1 = ramp(t, 393.9, 394.8, Easing.out(Easing.cubic));
  const squeeze = hitAt(t, 395.4, 0.5);
  const R = 240;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Gradient w={4400} h={2600} stops={[[0, "#5a1a22"], [1, "#2a0a10"]]} z={-41} />
        <X y={-60 - 420 + push1 * 420} z={0}>
          <Character {...YOU} hat={null} x={0} y={-330} s={1.05} look={0.1} expression={{ eyes: squeeze > 0.2 ? "closed" : "wide", mouth: squeeze > 0.2 ? "wavy" : "o", brows: 0.6 }} pose={poses.idle(frame, 1)} shadow={false} />
        </X>
        <X y={-60} sx={1 - squeeze * 0.04} sy={1 + squeeze * 0.04} z={1}>
          <Part shape={path(holePath(3000, 2000, R))} color="#b8323a" shade={0.12} />
          <InkLine pts={Array.from({ length: 41 }, (_, i) => [Math.cos((i / 40) * Math.PI * 2) * (R + 22), Math.sin((i / 40) * Math.PI * 2) * (R + 22)] as [number, number])} width={40} color="#d84a52" outline={6} z={0.01} />
        </X>
      </Stage>
      <Label text="THE BIGGEST ARTERY" x={0.08} y={0.1} size={0.05} kind="box" at={at(392.56)} />
      <Label text="BARELY!" x={0.76} y={0.22} size={0.08} kind="stamp" rotate={-8} at={at(395.42)} />
    </AbsoluteFill>
  );
};

// 396.38 "Not for a swimming child."
export const NotChildShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), shake: hitAt(t, 396.6, 0.4) * 6 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper color="#f0d8d8" blotch="#c8888a">
          <ArterySwim frame={frame} />
          <XMark size={900 * pop(t, 396.5)} color="#fe5649" z={2} />
        </Paper>
      </Stage>
      <Label text="MYTH BUSTED" x={0.5} y={0.86} size={0.07} kind="title" at={at(396.9)} />
    </AbsoluteFill>
  );
};
