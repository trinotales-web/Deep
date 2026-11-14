import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Gradient, Wash, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, InkLine, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  BlueWhale, SpermWhale, Squid, Krill, KrillSwarm, WhaleTag, Blow, WaterFront, SurfaceFoam, ResearchBoat, WhaleCatcher, Harpoon, WhaleHeart, HeartTrace, Gauge, Bars,
  PolarMap, polarXY, WhaleTally, Thermometer, PoopCloud, PhytoBloom, IronBadge, XMark,
} from "../../kit/env";
import { sec, pop, useScr, GrowArrow } from "../../kit/shot";
import { CoastSet, DeepSet, Paper, Chips, Flash } from "./sets";
import { WHALER, YOU, MATE } from "./cast";

// Why the giants stop growing (food and the heart), whaling, krill in
// trouble, and the whale pump.

/** Bold dashed horizontal limit line (outlined dashes). */
const LimitLine: React.FC<{ y: number; w?: number; k?: number; z?: number; color?: string }> = ({ y, w = 2600, k = 1, z = 0, color = "#fe5649" }) => {
  const n = Math.floor((w * k) / 80);
  return (
    <X y={y} z={z}>
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} shape={roundRect(50, 18, 9)} color={color} shade={0.1} x={-w / 2 + 25 + i * 80} />
      ))}
    </X>
  );
};

/** Big warning triangle. */
const Warning: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={poly([[0, 200], [220, -170], [-220, -170]])} color="#f2c23a" shade={0.2} />
    <Part shape={roundRect(40, 190, 20)} color="#211b20" flat outline={0} y={30} z={0.001} />
    <Part shape={circle(24)} color="#211b20" flat outline={0} y={-110} z={0.001} />
  </X>
);

// 398.36 "So if bigger is always better, why don't blue whales get even bigger?"
export const WhyNotBiggerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const g = ramp(t, 398.6, 401.2, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.76), y: 60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={null}>
          <BlueWhale x={-100} y={-80} len={1300 + g * 900} swim={frame * 0.6} beat={0.4} z={1} />
          <LimitLine y={240 + 0} k={ramp(t, 400.4, 401.2)} z={2} />
          <QuestionMark x={1100} y={420} size={1.1 * pop(t, 401.7)} z={3} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 402.63 "In 2019, scientists tagged hundreds of whales and studied more than 10,000 feeding events."
export const TaggedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const n = Math.round(10000 * ramp(t, 406.4, 407.8, Easing.out(Easing.quad)));
  const whales: [number, number, number, string][] = [
    [-900, 300, 1100, "#5b84ad"],
    [400, 380, 900, "#545c68"],
    [-300, -60, 1300, "#5b84ad"],
    [800, -320, 1000, "#6a7480"],
    [-1100, -420, 700, "#5b84ad"],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.68) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.3} surfaceY={900}>
          {whales.map(([x, y, len, col], i) => (
            <X key={i} x={x + frame * (1.6 + i * 0.2)} y={y} z={1 + i * 0.1}>
              <BlueWhale len={len} color={col} tag swim={frame + i * 13} seed={i + 3} />
              <Glow x={(40 * len) / 1000} y={(92 * len) / 1000} rx={80} color="#ffd84a" alpha={0.35 + 0.3 * Math.sin(frame * 0.3 + i)} additive z={0.1} />
            </X>
          ))}
        </DeepSet>
      </Stage>
      <Label text="2019" x={0.08} y={0.1} size={0.06} kind="box" at={at(402.74)} />
      <Label text="HUNDREDS OF TAGGED WHALES" x={0.92} y={0.1} size={0.045} kind="box" at={at(404.75)} />
      <Label text={`${n.toLocaleString("en-US")}+ FEEDING EVENTS`} x={0.5} y={0.86} size={0.06} kind="box" at={at(406.4)} />
    </AbsoluteFill>
  );
};

// 408.94 "For toothed whales, like sperm whales, there's a limit."
export const ToothedLimitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86) }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <DeepSet depth={0.75} rays={0.3}>
          <SpermWhale x={-300 + frame * 2} y={0} len={1700} mouth={0.3} swim={frame} z={1} />
          <Squid x={760 + frame * 1.5} y={60} s={0.8} swim={frame} z={1} />
        </DeepSet>
      </Stage>
      <Label text="SPERM WHALES: THERE'S A LIMIT" x={0.08} y={0.1} size={0.045} kind="box" at={at(411.08)} />
    </AbsoluteFill>
  );
};

// 412.06 "A bigger sperm whale couldn't find enough big squid to stay alive."
export const SquidShortShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const lvl = interpolate(t, [412.2, 414.8], [0.7, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.75, 0.8) }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <DeepSet depth={0.75} rays={0.3}>
          <SpermWhale x={-300} y={60} len={2400} swim={frame * 0.6} eye="sad" z={1} />
          <Squid x={900} y={-360} s={0.45} swim={frame} z={1} />
          <Gauge x={900} y={260} r={180} level={lvl} z={2} />
        </DeepSet>
      </Stage>
      <Label text="NOT ENOUGH BIG SQUID" x={0.5} y={0.86} size={0.055} kind="box" at={at(413.99)} />
    </AbsoluteFill>
  );
};

// 415.43 "For blue whales, bigger still pays."
export const StillPaysShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const m = ramp(t, 415.5, 416.3, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), x: 200 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={700}>
          <KrillSwarm x={900} y={0} w={1000} h={600} n={260} frame={frame} eaten={ramp(t, 416.2, 417.8)} z={0.5} />
          <BlueWhale x={-300 + m * 300} y={0} len={1900} mouth={m} krill={m} eye="happy" swim={frame} z={1} />
        </DeepSet>
      </Stage>
      <Label text="BIGGER STILL PAYS" x={0.08} y={0.1} size={0.06} kind="box" at={at(417.04)} />
    </AbsoluteFill>
  );
};

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// 418.09 "The scientists think what holds them back is the krill season."
export const KrillSeasonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.95, 1.0);
  const season = ramp(t, 420.3, 421.0);
  const season0 = 0; // Dec–Mar (austral summer): indices 11, 0, 1, 2
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          {MONTHS.map((_, i) => {
            const on = [11, 0, 1, 2].includes(i) && season > 0;
            return (
              <X key={i} x={-770 + i * 140} y={0} z={0}>
                <Part shape={roundRect(124, 300, 18)} color={on ? "#f08068" : "#c8d0d6"} shade={0.15} s={on ? 1 + 0.08 * pop(t, 420.4 + (i === 11 ? 0 : i + 1) * 0.08) : 1} />
                {on ? <Krill y={20} s={0.55} swim={frame + i} z={0.01} /> : null}
              </X>
            );
          })}
          {season0 ? null : null}
        </Paper>
      </Stage>
      {MONTHS.map((m, i) => (
        <Label key={i} text={m} x={sc(-770 + i * 140, -220, zoom).x} y={sc(-770 + i * 140, -220, zoom).y} size={0.045} kind="ink" pin at={0} />
      ))}
      <Label text="THE KRILL SEASON" x={0.5} y={0.14} size={0.07} kind="title" at={at(420.46)} />
    </AbsoluteFill>
  );
};

// 421.62 "It's short, and there's only so much food."
export const OnlySoMuchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.35} surfaceY={640}>
          <KrillSwarm x={500} y={-20} w={900} h={500} n={240} frame={frame} eaten={ramp(t, 421.7, 424.2) * 0.92} z={0.5} />
          <BlueWhale x={-400} y={-60} len={1500} gaze={[1, -0.2]} eye={t > 423.4 ? "sad" : "open"} swim={frame * 0.6} z={1} />
        </DeepSet>
      </Stage>
      <Label text="ONLY SO MUCH FOOD" x={0.92} y={0.86} size={0.05} kind="box" at={at(423.0)} />
    </AbsoluteFill>
  );
};

// 424.96 "And remember that heartbeat from the start?"
export const RememberHeartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: -80 }} light={{ dir: [-0.6, 0.7] }} vignette={0.7}>
        <CoastSet horizon={220}>
          <BlueWhale x={600 - frame * 0.8} y={-420} len={2200} tag beat={0.2} swim={frame * 0.3} z={-12} />
          <WaterFront y={-330} z={-11} />
          <SurfaceFoam x={600 - frame * 0.8} y={-332} rx={700} z={-10.9} />
          <ResearchBoat x={-550} y={-470} s={1.2} bob={frame} z={-4}>
            <Character {...YOU} x={-200} y={60} s={0.62} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.8, -0.1] }} pose={poses.idle(frame, 1)} />
            <Character {...MATE} x={250} y={60} s={0.62} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.8, -0.1] }} pose={poses.point(frame)} />
          </ResearchBoat>
          <Wash width={6000} height={4000} color="#c8a06a" alpha={0.22} z={30} />
        </CoastSet>
      </Stage>
      <Label text="REMEMBER?" x={0.08} y={0.1} size={0.055} kind="box" at={at(425.2)} />
    </AbsoluteFill>
  );
};

/** ECG monitor panel. */
const EcgPanel: React.FC<{ bpm: number; t: number; window: number; beat: number; color?: string }> = ({ bpm, t, window, beat, color = "#5af07a" }) => (
  <X y={30}>
    <Part shape={roundRect(1500, 640, 40)} color="#10161e" shade={0.1} />
    <Part shape={roundRect(1420, 560, 24)} color="#0c1a18" flat outline={5} z={0.001} />
    {[-2, -1, 0, 1, 2].map((i) => (
      <Line key={i} pts={[[-700, i * 100], [700, i * 100]]} width={3} color="#1e3a30" z={0.002} />
    ))}
    <HeartTrace y={-60} w={1300} h={200} bpm={bpm} t={t} window={window} color={color} z={0.01} />
    <X x={520} y={150} s={0.2 * (1 + 0.15 * beat)} z={0.02}>
      <WhaleHeart beat={beat} />
    </X>
  </X>
);

// 427.3 "Deep down, it beat just twice a minute."
export const SlowBeatShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const tt = 60 * ramp(t, 427.0, 429.6, Easing.linear) + 28;
  const beat = Math.max(hitAt(t, 427.6, 0.6), hitAt(t, 428.93, 0.6));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0) }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <DeepSet depth={0.92} rays={0.3}>
          <EcgPanel bpm={2} t={tt} window={60} beat={beat} />
        </DeepSet>
      </Stage>
      <Label text="2 BEATS PER MINUTE" x={sc(-120, 230).x} y={sc(-120, 230).y} size={0.075} kind="hand" color="#5af07a" pin at={at(428.9)} />
    </AbsoluteFill>
  );
};

// 430.0 "After a dive, it raced up to 37 beats a minute."
export const FastBeatShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const bpm = interpolate(t, [430.2, 431.9], [6, 37], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beat = Math.max(0, Math.sin(t * Math.PI * (bpm / 60) * 2)) ** 10;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), shake: beat * 3 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.2} surfaceY={null}>
          <EcgPanel bpm={bpm} t={t} window={6} beat={beat} color="#ffd84a" />
        </DeepSet>
      </Stage>
      <Label text={`${Math.round(bpm)} BEATS PER MINUTE`} x={sc(-120, 230).x} y={sc(-120, 230).y} size={0.075} kind="hand" color="#ffd84a" pin at={at(430.3)} />
    </AbsoluteFill>
  );
};

// 433.71 "The scientists think that's close to the most its heart can do."
export const MaxHeartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const lvl = interpolate(t, [433.7, 435.4], [0.5, 0.96], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }) + Math.sin(frame * 0.8) * 0.01;
  const beat = Math.max(0, Math.sin(t * Math.PI * 1.2)) ** 8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98) }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Paper>
          <WhaleHeart x={-420} y={-20} size={0.62} beat={beat} />
          <Gauge x={480} y={40} r={300} level={lvl} low="#4fd17c" high="#e2584a" />
        </Paper>
      </Stage>
      <Label text="NEAR ITS LIMIT" x={0.75} y={0.86} size={0.06} kind="box" at={at(435.43)} />
    </AbsoluteFill>
  );
};

// 436.94 "So the heart may be another reason the blue whale is about as big as a whale can get."
export const HeartLimitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const beat = Math.max(0, Math.sin(t * Math.PI * 0.6)) ** 8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 40 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.35} surfaceY={null}>
          <BlueWhale x={0} y={-60} len={2200} swim={frame * 0.5} beat={0.3} z={1} />
          <X x={0 + 240 * 2.2 * 0.5} y={-100} s={pop(t, 437.4)} z={3}>
            <Part shape={circle(190)} color="#0e2440" flat outline={8} outlineColor="#7fe0ff" opacity={0.92} />
            <Glow rx={240} color="#ff5a5a" alpha={0.25 + 0.4 * beat} additive z={0.01} />
            <WhaleHeart size={0.38} beat={beat} y={10} z={0.02} />
          </X>
          <LimitLine y={260} k={ramp(t, 438.6, 439.6)} z={2} />
        </DeepSet>
      </Stage>
      <Label text="ABOUT AS BIG AS A WHALE CAN GET" x={0.5} y={0.14} size={0.055} kind="title" at={at(439.39)} />
    </AbsoluteFill>
  );
};

// 441.62 "So for millions of years, the system works."
export const SystemWorksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: 60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={800}>
          <PhytoBloom y={640} w={3200} h={200} n={120} k={1} z={0.2} />
          <BlueWhale x={-500 + frame * 2} y={200} len={2000} swim={frame} eye="happy" z={1} />
          <BlueWhale x={600 + frame * 2.2} y={-400} len={1100} swim={frame + 30} seed={6} z={0.9} />
          <KrillSwarm x={1300} y={100} w={700} h={400} n={160} frame={frame} z={0.5} />
        </DeepSet>
      </Stage>
      <Label text="MILLIONS OF YEARS" x={0.08} y={0.1} size={0.05} kind="box" at={at(441.9)} />
    </AbsoluteFill>
  );
};

// 444.47 "Then humans show up."
export const HumansShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 444.4, 446.0, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 40 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#2a0a10">
        <CoastSet horizon={-120} mood="dusk" coast={false}>
          <WhaleCatcher x={-200 + rise * 300} y={-150 - (1 - rise) * 200} s={0.55} bob={frame} z={-29} />
          <WaterFront y={-160} color="#3a5a7a" z={-28} foam={false} />
        </CoastSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 446.5 "In the 20th century, whaling ships with harpoon cannons hunt blue whales across the oceans."
export const WhalersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const fire = interpolate(t, [449.0, 449.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hx = interpolate(t, [449.0, 449.8], [0, 1400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), x: 100, y: 40, shake: hitAt(t, 449.0, 0.5) * 10 }} light={{ dir: [0.6, 0.5] }} vignette={0.65} vignetteColor="#2a0a10">
        <CoastSet horizon={-140} mood="dusk" coast={false}>
          <WhaleCatcher x={-420} y={-230} s={1.0} bob={frame} fire={fire} z={-12}>
            <Character {...WHALER(0)} x={470} y={250} s={0.55} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: -0.5 }} pose={{ armF: [1.4, 0.2], armB: [1.2, 0.3], lean: 0.08 }} />
            <Character {...WHALER(1)} x={40} y={130} s={0.55} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: -0.3 }} pose={poses.point(frame)} />
          </WhaleCatcher>
          {t > 449.0 ? <Harpoon x={250 + hx} y={100 - hx * 0.12} rot={-0.1} len={240} rope={Math.min(hx, 900)} z={-11} /> : null}
          <WaterFront y={-260} color="#3a5a7a" z={-11.5} foam={false} />
        </CoastSet>
      </Stage>
      <Label text="20TH CENTURY" x={0.08} y={0.1} size={0.055} kind="box" at={at(446.69)} />
    </AbsoluteFill>
  );
};

// 451.98 "Around Antarctica alone, their numbers drop from about 239,000 to around 360."
export const CountDropShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 455.4, 457.6, Easing.inOut(Easing.quad));
  const count = Math.round(interpolate(k, [0, 1], [239000, 360]) / (k < 1 ? 1000 : 1)) * (k < 1 ? 1000 : 1);
  const alive = interpolate(k, [0, 1], [1, 1 / 160]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <X x={-520}>
          <PolarMap pole="south" ppd={9} w={900} h={1200} seaIceLat={-62} />
        </X>
        <X x={480} z={1}>
          <Part shape={roundRect(1000, 1200, 0)} color="#1c2a3a" flat outline={6} />
          <WhaleTally y={-120} cols={10} rows={16} gap={84} alive={alive} color="#7fb0e0" z={0.01} />
        </X>
      </Stage>
      <Label text="AROUND ANTARCTICA" x={0.08} y={0.1} size={0.045} kind="box" at={at(452.34)} />
      <Label text={count.toLocaleString("en-US")} x={0.75} y={0.1} size={0.09} kind="title" at={at(455.13)} />
    </AbsoluteFill>
  );
};

// 458.61 "That's almost all of them, gone."
export const GoneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0) }} light={{ dir: [-0.5, 0.8] }} vignette={0.7}>
        <Gradient w={4400} h={2600} stops={[[0, "#1c2a3a"], [1, "#0c121c"]]} z={-41} />
        <WhaleTally cols={20} rows={8} gap={86} alive={1 / 160} color="#7fb0e0" />
        <Glow x={-19 * 43} y={3.5 * 86 * 0.62} rx={90} color="#7fd0ff" alpha={0.6} additive z={1} />
      </Stage>
      <Label text="ALMOST ALL GONE" x={0.5} y={0.86} size={0.07} kind="title" at={at(460.11)} />
    </AbsoluteFill>
  );
};

// 461.15 "In 1960, blue whales are finally protected from commercial hunting."
export const ProtectedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const away = ramp(t, 462.0, 465.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <CoastSet horizon={-60} mood="dawn" coast={false}>
          <WhaleCatcher x={-700 - away * 900} y={-140} s={0.5} sx={-1} bob={frame} smoke={false} z={-29} />
          <BlueWhale x={500} y={-420} len={1600} swim={frame * 0.4} beat={0.2} eye="happy" z={-12} />
          <Blow x={500 + 420} y={-300} k={ramp(t, 463.4, 465.0)} s={0.9} z={-10.5} />
          <WaterFront y={-330} z={-11} />
        </CoastSet>
      </Stage>
      <Label text="PROTECTED" x={0.7} y={0.2} size={0.09} kind="stamp" rotate={-7} at={at(463.69)} />
    </AbsoluteFill>
  );
};

// 465.63 "Today, their numbers are growing again."
export const GrowingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const alive = interpolate(t, [465.6, 467.5], [1 / 160, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Gradient w={4400} h={2600} stops={[[0, "#1c3a3a"], [1, "#0c1c1c"]]} z={-41} />
        <WhaleTally cols={20} rows={8} gap={86} alive={alive} color="#7fe0a0" />
      </Stage>
      <Label text="GROWING AGAIN" x={0.5} y={0.86} size={0.07} kind="title" at={at(466.85)} />
    </AbsoluteFill>
  );
};

// 467.92 "But they're still a small fraction of what they once were."
export const FractionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.92, 0.98);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 60 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <Bars y={-380} w={900} h={860} values={[1, 0.05]} colors={["#7fb0e0", "#4fc06a"]} k={ramp(t, 468.0, 469.0)} />
        </Paper>
      </Stage>
      <Label text="BEFORE WHALING" x={sc(-190, -460, zoom, 0, 60).x} y={sc(-190, -460, zoom, 0, 60).y} size={0.04} kind="box" pin at={at(468.0)} />
      <Label text="TODAY" x={sc(190, -460, zoom, 0, 60).x} y={sc(190, -460, zoom, 0, 60).y} size={0.04} kind="box" pin at={at(468.6)} />
      <Label text="A SMALL FRACTION" x={0.5} y={0.12} size={0.065} kind="title" at={at(468.92)} />
    </AbsoluteFill>
  );
};

// 471.19 "And there's a new problem."
export const NewProblemShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), shake: hitAt(t, 471.8, 0.4) * 5 }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <DeepSet depth={0.35} surfaceY={640}>
          <BlueWhale x={-400} y={-60} len={1500} swim={frame * 0.5} eye="wide" z={1} />
          <Warning x={620} y={60} s={pop(t, 471.6)} z={2} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 472.8 "Remember the rule? Blue whales bet everything on krill."
export const BetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const shove = ramp(t, 474.4, 475.3, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.65}>
        <Gradient w={4400} h={2600} stops={[[0, "#2f7a4a"], [1, "#1a4a2a"]]} z={-41} />
        <Part shape={roundRect(700, 900, 40)} color="#f6f0de" shade={0.15} x={440} y={20} z={0}>
          <Krill s={2.6} y={20} swim={frame} z={0.01} />
        </Part>
        {[0, 1, 2, 3, 4].map((i) => (
          <Chips key={i} x={-760 + shove * 900 + (i % 3) * 90} y={-300 + Math.floor(i / 3) * 40} n={5 + i} color={["#c8362f", "#2f5f9a", "#e9ba41"][i % 3]} z={1 + i * 0.01} />
        ))}
        <BlueWhale x={-900 + shove * 120} y={260} len={900} eye="happy" z={0.5} />
      </Stage>
      <Label text="ALL IN ON KRILL" x={0.5} y={0.12} size={0.07} kind="title" at={at(474.52)} />
    </AbsoluteFill>
  );
};

// 475.99 "And the krill are in trouble."
export const KrillTroubleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.4, 0.8] }} vignette={0.7} vignetteColor="#3a0a10">
        <DeepSet depth={0.4} surfaceY={null}>
          <Glow rx={700} color="#ff4a3a" alpha={0.25 + 0.15 * Math.sin(frame * 0.3)} additive />
          <Krill x={-60} y={-40} s={5} swim={frame} z={1} />
          <Warning x={620} y={260} s={0.6 * pop(t, 476.5)} z={2} />
        </DeepSet>
      </Stage>
      <Label text="KRILL IN TROUBLE" x={0.5} y={0.86} size={0.07} kind="title" at={at(476.86)} />
    </AbsoluteFill>
  );
};

// 477.7 "As the Southern Ocean warms and sea ice shrinks, krill around Antarctica have been moving south."
export const WarmingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const ppd = 10;
  const ice = interpolate(t, [479.4, 480.6], [-58, -66], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const south = ramp(t, 480.9, 482.6);
  const warm = ramp(t, 478.4, 479.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <PolarMap pole="south" ppd={ppd} w={2600} h={1600} seaIceLat={ice}>
          {Array.from({ length: 22 }, (_, i) => {
            const lon = -90 + i * 9;
            const lat = -55 - south * 4 + Math.sin(i * 1.3) * 1.2;
            const [x, y] = polarXY(lon, lat, "south", ppd);
            return (
              <X key={i} x={x} y={y}>
                <Glow rx={70} color="#ff8a6a" alpha={0.45} additive />
                <Part shape={circle(16)} color="#f2856a" shade={0.2} />
              </X>
            );
          })}
          <Thermometer x={-760} y={60} h={420} level={0.3 + warm * 0.55} z={1} />
        </PolarMap>
      </Stage>
      <Label text="OCEAN WARMS" x={0.08} y={0.1} size={0.045} kind="box" at={at(478.63)} />
      <Label text="SEA ICE SHRINKS" x={0.92} y={0.1} size={0.045} kind="box" at={at(479.71)} />
      <Label text="KRILL MOVE SOUTH" x={0.92} y={0.86} size={0.045} kind="box" at={at(482.0)} />
    </AbsoluteFill>
  );
};

// 483.04 "Their densest swarms are now about 440 kilometers further south than they were in the 1920s."
export const MovedSouthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const ppd = 30;
  const rot = -Math.PI / 4; // turn the -45° meridian so that "south" (toward the pole) points down
  const then = polarXY(-45, -56, "south", ppd, rot);
  const now = polarXY(-45, -60, "south", ppd, rot);
  const cx = (then[0] + now[0]) / 2;
  const cy = (then[1] + now[1]) / 2;
  const k = ramp(t, 484.4, 485.6, Easing.inOut(Easing.quad));
  const zone = (lat: number, color: string, alpha: number) =>
    Array.from({ length: 9 }, (_, i) => {
      const [x, y] = polarXY(-75 + i * 7, lat + Math.sin(i * 1.7) * 0.6, "south", ppd, rot);
      return (
        <X key={`${lat}${i}`} x={x} y={y}>
          <Glow rx={110} color={color} alpha={alpha} additive />
          <Part shape={circle(24)} color={color} shade={0.2} opacity={alpha > 0.3 ? 1 : 0.5} />
        </X>
      );
    });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), x: cx, y: cy }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <PolarMap pole="south" ppd={ppd} rot={rot} w={6000} h={5000} seaIceLat={-67}>
          {zone(-56, "#c8b8b0", 0.25)}
          {zone(-56 - 4 * k, "#f2856a", 0.5)}
          <GrowArrow pts={[[then[0] + 300, then[1]], [now[0] + 300, now[1]]]} k={k} color="#fe5649" width={30} z={1} />
        </PolarMap>
      </Stage>
      <Label text="1920s" x={sc(then[0] - 420, then[1], 1, cx, cy).x} y={sc(then[0] - 420, then[1], 1, cx, cy).y} size={0.045} kind="box" pin at={at(483.2)} />
      <Label text="440 KM FURTHER SOUTH" x={sc(now[0] + 300, now[1] - 160, 1, cx, cy).x} y={sc(now[0] + 300, now[1] - 160, 1, cx, cy).y} size={0.05} kind="box" pin at={at(485.21)} />
    </AbsoluteFill>
  );
};

// 488.85 "And here's a twist."
export const TwistShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 488.6, 489.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), rot: Math.sin(k * Math.PI) * 0.06 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.25} surfaceY={null}>
          <GrowArrow pts={Array.from({ length: 16 }, (_, i) => [Math.cos(0.3 + i * 0.36) * 420, Math.sin(0.3 + i * 0.36) * 300] as [number, number])} k={k} color="#e9ba41" width={28} z={1} />
          <BlueWhale x={-60} y={-20} len={600} eye="happy" swim={frame} z={1.5} />
        </DeepSet>
      </Stage>
      <Label text="A TWIST" x={0.5} y={0.14} size={0.08} kind="title" at={at(489.21)} />
    </AbsoluteFill>
  );
};

// 490.15 "Whales help the krill too."
export const HelpKrillShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), x: 200 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={600}>
          <BlueWhale x={-500} y={-40} len={1700} eye="happy" swim={frame * 0.4} beat={0.2} z={1} />
          <Krill x={780} y={60} s={2.2} sx={-1} swim={frame} z={1} />
          <Part shape={blob([[0, -40], [-50, 10], [-36, 50], [0, 30], [36, 50], [50, 10]], 6)} color="#fe5649" shade={0.15} x={560} y={260} s={1.6 * pop(t, 490.9)} z={2} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 492.2 "Krill are full of iron."
export const IronShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={null}>
          <Krill x={-300} y={-40} s={4.2} swim={frame} z={1} />
          <IronBadge x={560} y={40} r={130} s={pop(t, 492.9)} z={2} />
        </DeepSet>
      </Stage>
      <Label text="Fe" x={sc(560, 40, zoom).x} y={sc(560, 40, zoom).y} size={0.12} kind="hand" color="#fbf6ea" pin at={at(492.95)} />
      <Label text="IRON" x={sc(560, -150, zoom).x} y={sc(560, -150, zoom).y} size={0.05} kind="box" pin at={at(493.07)} />
    </AbsoluteFill>
  );
};

// 493.94 "Whales eat krill deep down, then poop near the surface."
export const PoopShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const rise = ramp(t, 494.9, 496.0, Easing.inOut(Easing.quad));
  const m = interpolate(t, [494.0, 494.4, 494.9], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wy = interpolate(rise, [0, 1], [-420, 260]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 0 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.45} surfaceY={640}>
          <KrillSwarm x={300} y={-520} w={900} h={300} n={150} frame={frame} eaten={ramp(t, 494.2, 494.9) * 0.4} z={0.5} />
          <BlueWhale x={-200 + rise * 200} y={wy} len={1500} mouth={m} krill={m} rot={rise > 0 && rise < 1 ? 0.25 : 0} swim={frame} z={1} />
          <PoopCloud x={-200 + rise * 200 - 820} y={wy + 40} k={ramp(t, 496.1, 497.2)} z={1.2} />
        </DeepSet>
      </Stage>
      <Label text="EAT DEEP" x={0.92} y={0.86} size={0.045} kind="box" at={at(494.3)} />
      <Label text="POOP NEAR THE SURFACE" x={0.08} y={0.1} size={0.045} kind="box" at={at(496.2)} />
    </AbsoluteFill>
  );
};

// 497.42 "That puts the iron back into the water."
export const IronBackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 100 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.15} surfaceY={460}>
          <PoopCloud x={0} y={100} k={0.6 + ramp(t, 497.3, 499.2) * 0.4} s={1.3} z={1} />
        </DeepSet>
      </Stage>
      <Label text="IRON BACK IN THE WATER" x={0.5} y={0.86} size={0.06} kind="box" at={at(497.9)} />
    </AbsoluteFill>
  );
};

/** The whale pump cycle: whale → iron → plants → krill → whale. `broken` crosses out the whale. */
const PumpCycle: React.FC<{ frame: number; t: number; k: number; broken?: number }> = ({ frame, k, broken = 0 }) => {
  const R = 330;
  const node = (a: number): [number, number] => [Math.cos(a) * R * 1.45, Math.sin(a) * R];
  const A = [Math.PI / 2, 0, -Math.PI / 2, Math.PI];
  const arc = (a0: number, a1: number): [number, number][] =>
    Array.from({ length: 8 }, (_, i) => {
      const a = a0 - 0.32 + ((a1 - a0 + 0.64) * i) / 7;
      return [Math.cos(a) * R * 1.45 * 0.8, Math.sin(a) * R * 0.8];
    });
  return (
    <X>
      {[0, 1, 2, 3].map((i) => (
        <GrowArrow key={i} pts={arc(A[i] - 0.95, A[(i + 1) % 4] + 0.95).reverse()} k={Math.min(1, Math.max(0, k * 4 - i))} color={broken > 0 && (i === 1 || i === 2) ? "#b8b2a4" : "#2f5f9a"} width={20} z={0} />
      ))}
      <X x={node(A[0])[0]} y={node(A[0])[1]} z={1} s={1 - broken * 0.4}>
        <Krill s={1.3} swim={frame} />
      </X>
      <X x={node(A[1])[0]} y={node(A[1])[1]} z={1}>
        <BlueWhale len={420} swim={frame} eye={broken > 0 ? "sad" : "happy"} />
        {broken > 0 ? <XMark size={300 * broken} color="#fe5649" z={0.1} /> : null}
      </X>
      <X x={node(A[2])[0]} y={node(A[2])[1]} z={1} s={1 - broken * 0.5}>
        <PoopCloud k={0.3} s={0.8} />
      </X>
      <X x={node(A[3])[0]} y={node(A[3])[1]} z={1} s={1 - broken * 0.5}>
        <PhytoBloom w={300} h={180} n={50} k={1} />
      </X>
    </X>
  );
};

// 499.59 "It feeds the tiny plants that krill eat."
export const FeedsPlantsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04) }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.15} surfaceY={null}>
          <PumpCycle frame={frame} t={t} k={ramp(t, 499.4, 501.4)} />
        </DeepSet>
      </Stage>
      <Label text="THE WHALE PUMP" x={0.08} y={0.1} size={0.05} kind="box" at={at(500.1)} />
    </AbsoluteFill>
  );
};

// 501.76 "So when whalers killed the whales, they may have hurt the krill as well."
export const HurtKrillShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), shake: hitAt(t, 502.5, 0.4) * 5 }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <DeepSet depth={0.35} surfaceY={null}>
          <PumpCycle frame={frame} t={t} k={1} broken={ramp(t, 502.4, 503.0)} />
        </DeepSet>
      </Stage>
      <Label text="THE CYCLE BREAKS" x={0.5} y={0.86} size={0.06} kind="title" at={at(503.9)} />
    </AbsoluteFill>
  );
};
