import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, mixHex, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  BlueWhale, ProtoWhale, Dolphin, SpermWhale, Sauropod, KrillSwarm, Krill, WhaleTag, Blow, WaterFront, SurfaceFoam, ResearchBoat, TagPole, WhaleCatcher, Harpoon,
  WhaleHeart, HeartTrace, BalanceScale, Burger, CrownProp, DimArrow, Gauge, Laptop, WorldMap, Calendar, Drops,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { CoastSet, DeepSet, GymSet, LabSet, Riverbank, Paper, Podium, Flash } from "./sets";
import { YOU, MATE, DRIVER, KID } from "./cast";

// Cold open (California, 2018: tagging a blue whale's heartbeat), the size
// facts, and the "coming up" hook. Times are seconds on
// public/vo/whale.tight.voice.m4a (see public/captions/whale.json).

/** Keep a held prop at a world angle for an arm pose [shoulder, elbow]. */
export const heldAt = (arm: [number, number], worldAngle = 0) => -(arm[0] + arm[1]) + worldAngle;
const POLE_ARM: [number, number] = [1.05, 0.25];
const poleLean = (frame: number) => ({ armF: POLE_ARM, armB: [0.75, 0.45] as [number, number], lean: 0.12 + Math.sin(frame * 0.05) * 0.01, handF: "fist" as const });

/** Boat crew for the cold open (in ResearchBoat coordinates). */
const Crew: React.FC<{ frame: number; you?: Partial<React.ComponentProps<typeof Character>>; mate?: Partial<React.ComponentProps<typeof Character>>; driver?: boolean }> = ({ frame, you, mate, driver = true }) => (
  <>
    {driver ? <Character {...DRIVER} x={40} y={60} s={0.6} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, 3)} z={-0.2} /> : null}
    <Character {...YOU} x={-240} y={60} s={0.62} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.6, 0.1] }} pose={poses.idle(frame, 1)} {...you} />
    <Character {...MATE} x={250} y={60} s={0.62} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.6, 0] }} pose={poses.idle(frame, 2)} {...mate} />
  </>
);

// ───────────────────────── cold open ─────────────────────────

// 0.16 "Imagine you're a scientist in a small boat off the coast of California."
export const BoatIntroShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0), y: -60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <CoastSet horizon={-20}>
          <Blow x={1150} y={-10} k={((frame / 60) % 1)} s={0.25} z={-29} />
          <ResearchBoat x={-80} y={-250} bob={frame} z={-5}>
            <Crew frame={frame} you={{ expression: { eyes: "open", mouth: "smile", gaze: [-0.3, 0.2] }, facing: -1 }} />
          </ResearchBoat>
        </CoastSet>
      </Stage>
      <Label text="OFF THE COAST OF CALIFORNIA" x={0.08} y={0.1} size={0.045} kind="box" at={at(2.46)} />
      <Label text="YOU" x={0.3} y={0.33} size={0.05} kind="tag" pin at={at(0.6)} until={at(2.4)} />
    </AbsoluteFill>
  );
};

// 3.88 "It's 2018."
export const YearShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6} bgBlur={7} bg={<CoastSet horizon={-140} />}>
        <ResearchBoat x={300} y={-640} s={2.2} bob={frame}>
          <Crew frame={frame} driver={false} you={{ expression: { eyes: "open", mouth: "smile", gaze: [0.7, 0.2], brows: 0.3 } }} mate={{ x: 420 }} />
        </ResearchBoat>
      </DepthStage>
      <Label text="2018" x={0.72} y={0.2} size={0.12} kind="title" at={at(4.07)} />
    </AbsoluteFill>
  );
};

// 5.38 "Next to you, a dark back rises out of the water."
export const BackRisesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 6.2, 8.2, Easing.out(Easing.cubic));
  const surprised = t > 6.6;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -80, shake: hitAt(t, 6.4, 0.6) * 5 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <CoastSet horizon={60}>
          <BlueWhale x={520 - frame * 1.2} y={-420 + rise * 150} len={1700} swim={frame * 0.6} beat={0.3} z={-12} />
          {rise > 0.05 ? <Blow x={520 - frame * 1.2 + 445} y={-270 + rise * 30} k={ramp(t, 7.0, 8.4)} s={0.9} z={-10.5} /> : null}
          <WaterFront y={-280} z={-11} color="#3f8fb8" />
          <SurfaceFoam x={520 - frame * 1.2} y={-282} rx={600 * rise + 40} k={rise} z={-10.9} />
          <ResearchBoat x={-900} y={-420} s={1.6} bob={frame} z={-4}>
            <Crew
              frame={frame}
              driver={false}
              you={{ x: 180, facing: 1, expression: surprised ? { eyes: "wide", mouth: "o", gaze: [0.9, 0.1], brows: 0.6 } : { eyes: "open", mouth: "smile", gaze: [0.6, 0] }, pose: surprised ? poses.scared(frame) : poses.idle(frame, 1) }}
              mate={{ x: -160 }}
            />
          </ResearchBoat>
        </CoastSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 8.48 "And it keeps rising."
export const KeepsRisingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 8.3, 10.3, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: -120 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <CoastSet horizon={140}>
          <BlueWhale x={interpolate(k, [0, 1], [1700, -300])} y={-330} len={2600} swim={frame * 0.4} beat={0.2} z={-12} />
          <Blow x={interpolate(k, [0, 1], [1700, -300]) + 680} y={-230} k={ramp(t, 8.4, 10.2)} s={1.2} z={-10.5} />
          <WaterFront y={-250} z={-11} />
          <SurfaceFoam x={interpolate(k, [0, 1], [1700, -300])} y={-252} rx={1200} z={-10.9} />
          <ResearchBoat x={1150} y={-380} s={0.9} bob={frame} z={-4}>
            <Crew frame={frame} driver={false} you={{ facing: -1, expression: { eyes: "wide", mouth: "o", gaze: [0.8, 0.2] } }} mate={{ facing: -1, expression: { eyes: "wide", mouth: "open", gaze: [0.8, 0.2] } }} />
          </ResearchBoat>
        </CoastSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 10.4 "It's almost as long as a basketball court."
export const CourtShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.98, 1.04);
  const arrow = ramp(t, 11.5, 12.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <X s={0.58}>
          <GymSet floor={-640} len={2800}>
            <BlueWhale x={0} y={120 + Math.sin(frame * 0.05) * 14} len={2500} swim={frame * 0.4} beat={0.4} eye="happy" z={-10} />
            <Character {...KID} x={-420} y={-640} s={0.9} look={0.4} expression={{ eyes: "wide", mouth: "o", gaze: [0.3, 1] }} pose={poses.armsUp(frame)} z={-5} />
            <Character {...KID} hair="bob" hairColor="#3a2a22" outfit={{ ...KID.outfit, top: "#e86a8a" }} x={320} y={-640} s={0.85} facing={-1} look={0.4} expression={{ eyes: "open", mouth: "grin", gaze: [0.2, 1] }} pose={poses.idle(frame, 4)} z={-5} />
            <DimArrow x={0} y={-760} len={2800 * arrow} color="#fe5649" width={22} z={1} />
          </GymSet>
        </X>
      </Stage>
      <Label text="BASKETBALL COURT · 28 M" x={sc(0, -560 * 0.58, zoom).x} y={sc(0, -560 * 0.58, zoom).y + 0.08} size={0.042} kind="box" pin at={sec(start)(12.0)} />
    </AbsoluteFill>
  );
};

// 13.04 "Your teammate leans out with a long pole."
export const PoleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const reach = ramp(t, 13.4, 14.8);
  const arm: [number, number] = [POLE_ARM[0] - 0.2 + reach * 0.2, POLE_ARM[1]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: -100, x: 120 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <CoastSet horizon={220}>
          <BlueWhale x={1250 - frame * 0.6} y={-400} len={2200} swim={frame * 0.3} beat={0.2} z={-12} />
          <WaterFront y={-330} z={-11} />
          <SurfaceFoam x={1250 - frame * 0.6} y={-332} rx={700} z={-10.9} />
          <ResearchBoat x={-450} y={-470} s={1.3} bob={frame} z={-4}>
            <Character {...YOU} x={-200} y={60} s={0.62} look={0.6} expression={{ eyes: "open", mouth: "open", gaze: [0.8, -0.1], brows: 0.4 }} pose={poses.point(frame)} z={-0.1} />
            <Character
              {...MATE}
              x={250}
              y={60}
              s={0.62}
              look={0.7}
              expression={{ eyes: "open", mouth: "flat", gaze: [0.8, -0.3], brows: -0.2 }}
              pose={{ ...poleLean(frame), armF: arm, lean: 0.06 + reach * 0.16 }}
              holdF={<TagPole len={760} rot={heldAt(arm, -0.32)} />}
            />
          </ResearchBoat>
        </CoastSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 15.38 "With suction cups,"
export const SuctionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.08);
  const dx = interpolate(t, [15.25, 16.5], [-60, 40]);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom }} light={{ dir: [-0.6, 0.7] }} vignette={0.6} bgBlur={8} bg={<CoastSet horizon={600} coast={false} />}>
        <BlueWhale x={-200} y={-560} len={5200} beat={0} z={-5} />
        <X x={dx + 120} y={20} rot={-0.5} s={3.2} z={0}>
          <TagPole x={-520} len={470} />
        </X>
      </DepthStage>
      <Label text="SUCTION CUPS" x={sc(dx + 160, 20, zoom).x} y={sc(dx + 160, 20, zoom).y + 0.2} size={0.045} kind="box" pin at={sec(start)(15.6)} />
    </AbsoluteFill>
  );
};

// 16.58 "they stick a small sensor onto the animal's back."
export const TagStickShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.35, 1.42);
  const k = ramp(t, 16.6, 17.05, Easing.in(Easing.quad));
  const back = ramp(t, 17.3, 18.2);
  const stuck = t >= 17.05;
  const tagX = 120;
  const tagY = -168;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: 60, y: -60, shake: hitAt(t, 17.05, 0.3) * 4 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <CoastSet horizon={520} coast={false}>
          <BlueWhale x={-80 - frame * 0.4} y={-420} len={3000} beat={0} tag={false} z={-12} />
          <WaterFront y={-330} z={-11} />
          {stuck ? (
            <X x={tagX - frame * 0.4 + (17.05 * 30 - start) * 0.4} y={tagY} z={-10}>
              <WhaleTag s={2} glow={hitAt(t, 17.05, 1.0)} />
              <Part shape={circle(60 + (t - 17.05) * 300)} color="#ffffff" flat outline={6} opacity={Math.max(0, 1 - (t - 17.05) * 2)} z={-0.01} />
            </X>
          ) : null}
          <X x={tagX - 1400 * (1 - k) * 0.5 - back * 500} y={tagY + 30 + 900 * (1 - k) * 0.5 + back * 400} rot={-0.95} s={2.4} z={-9}>
            <TagPole x={-560} len={520} tag={!stuck} />
          </X>
        </CoastSet>
      </Stage>
      <Label text="SENSOR TAG" x={sc(tagX, tagY + 80, zoom, 60, -60).x} y={sc(tagX, tagY + 80, zoom, 60, -60).y - 0.1} size={0.045} kind="box" pin at={at(17.4)} />
    </AbsoluteFill>
  );
};

// 19.41 "It's going to do something nobody has ever done before."
export const WorldFirstShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.97), y: 40 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.2} surfaceY={470}>
          <BlueWhale x={200 - frame * 0.8} y={40} len={1800} swim={frame} tag gaze={[0.2, 0.9]} eye="open" z={1} />
          <Glow x={200 - frame * 0.8 + 72} y={40 + 166} rx={120} color="#ffd84a" alpha={0.35 + 0.25 * Math.sin(frame * 0.3)} additive z={2} />
        </DeepSet>
      </Stage>
      <Label text="A WORLD FIRST" x={0.75} y={0.2} size={0.06} kind="stamp" rotate={-6} at={at(20.4)} />
    </AbsoluteFill>
  );
};

// 22.36 "Record the heartbeat of a blue whale."
export const HeartbeatTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const beat = Math.max(0, Math.sin(t * Math.PI * 1.2)) ** 6;
  const lens = pop(t, 22.6);
  const hx = 240;
  const hy = -40;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05), x: 120 }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <DeepSet depth={0.45}>
          <BlueWhale x={-100} y={0} len={1700} swim={frame * 0.6} beat={0.4} tag z={1} />
          <X x={-100 + hx} y={hy} s={lens} z={3}>
            <Part shape={circle(210)} color="#0e2440" flat outline={8} outlineColor="#7fe0ff" opacity={0.92} />
            <Glow rx={260} color="#ff5a5a" alpha={0.25 + 0.4 * beat} additive z={0.01} />
            <WhaleHeart size={0.42 * (1 + 0.06 * beat)} beat={beat} y={10} z={0.02} />
          </X>
        </DeepSet>
      </Stage>
      <Label text="THE HEARTBEAT OF A BLUE WHALE" x={0.5} y={0.13} size={0.06} kind="title" at={at(22.8)} />
    </AbsoluteFill>
  );
};

// 24.95 "The whale breathes,"
export const BreathesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: -40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <CoastSet horizon={80}>
          <BlueWhale x={-200 - frame} y={-360} len={2000} beat={0.2} swim={frame * 0.3} tag z={-12} />
          <Blow x={-200 - frame + 524} y={-210} k={ramp(t, 25.0, 26.3)} s={1.6} z={-10.5} />
          <WaterFront y={-260} z={-11} />
          <SurfaceFoam x={-200 - frame} y={-262} rx={900} z={-10.9} />
          <ResearchBoat x={900} y={-300} s={0.6} bob={frame} z={-20}>
            <Crew frame={frame} driver={false} you={{ facing: -1 }} mate={{ facing: -1 }} />
          </ResearchBoat>
        </CoastSet>
      </Stage>
    </AbsoluteFill>
  );
};

/** Tail flukes rising out of the water for a dive (front view of the flukes). Origin = waterline. */
const FlukeUp: React.FC<{ k: number; frame: number; color?: string }> = ({ k, frame, color = "#5b84ad" }) => {
  // k: 0 hidden → 0.5 fully up → 1 gone
  const h = Math.sin(Math.min(1, Math.max(0, k)) * Math.PI) * 620 - 120;
  const tilt = (k - 0.5) * 0.5;
  return (
    <X y={h} rot={tilt}>
      <Part shape={blob([[-70, -500], [-60, -100], [-40, 120], [40, 120], [60, -100], [70, -500]], 6)} color={color} shade={0.24} />
      <Part shape={blob([[0, 140], [-160, 190], [-380, 300], [-470, 270], [-360, 170], [-120, 80], [0, 90]], 8)} color={color} shade={0.22} z={0.01} />
      <Part shape={blob([[0, 140], [160, 190], [380, 300], [470, 270], [360, 170], [120, 80], [0, 90]], 8)} color={color} shade={0.22} z={0.01} />
      <Part shape={blob([[0, 120], [-220, 170], [-300, 220], [-100, 120], [0, 110], [100, 120], [300, 220], [220, 170]], 6)} color={mixHex(color, "#ffffff", 0.25)} flat outline={0} opacity={0.5} z={0.012} />
      <Drops y={180} w={800} fall={420} k={(frame * 0.04) % 1} n={10} color="#e8f6ff" z={0.02} />
    </X>
  );
};

// 26.21 "then dives."
export const DivesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 26.0, 27.5, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <CoastSet horizon={-60}>
          <X x={60} y={-320} z={-12}>
            <FlukeUp k={k} frame={frame} />
          </X>
          <WaterFront y={-320} z={-11} />
          <SurfaceFoam x={60} y={-322} rx={500} k={Math.min(1, k * 2)} z={-10.9} />
        </CoastSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 27.46 "Hours later, you look at the data."
export const DataShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [0.6, 0.5] }} vignette={0.6} bgBlur={7} bg={<CoastSet horizon={-160} mood="dusk" />}>
        <ResearchBoat x={-200} y={-700} s={1.9} bob={frame * 0.5}>
          <Character {...YOU} x={-120} y={60} s={0.62} look={0.6} expression={{ eyes: "open", mouth: t > 28.6 ? "o" : "flat", gaze: [0.6, -0.5], brows: 0.4 }} pose={poses.think} />
        </ResearchBoat>
        <Laptop x={420} y={-230} w={620} glow={0.8} z={2}>
          <HeartTrace w={480} h={110} bpm={8} t={t} window={8} />
        </Laptop>
      </DepthStage>
      <Label text="HOURS LATER" x={0.08} y={0.1} size={0.05} kind="box" at={at(27.5)} />
    </AbsoluteFill>
  );
};

// 29.56 "Deep underwater,"
export const DeepShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: -frame * 2 }} light={{ dir: [-0.2, 1] }} vignette={0.75}>
        <DeepSet depth={0.88} rays={0.6}>
          <BlueWhale x={-120 + frame * 2} y={-frame * 3} rot={-0.32} len={1500} swim={frame * 0.6} beat={0.5} tag z={1} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 30.8 "its giant heart is beating just twice a minute."
export const TwiceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  // two beats inside a one-minute window, the second lands on "twice"
  const tt = 60 * ramp(t, 30.7, 33.3, Easing.linear) + 28;
  const beat = Math.max(hitAt(t, 31.5, 0.6), hitAt(t, 32.81, 0.6));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.4, 0.8] }} vignette={0.65}>
        <DeepSet depth={0.92} rays={0.3}>
          <X y={30} z={1}>
            <Part shape={roundRect(1500, 640, 40)} color="#10161e" shade={0.1} />
            <Part shape={roundRect(1420, 560, 24)} color="#0c1a18" flat outline={5} z={0.001} />
            {[-2, -1, 0, 1, 2].map((i) => (
              <Line key={i} pts={[[-700, i * 100], [700, i * 100]]} width={3} color="#1e3a30" z={0.002} />
            ))}
            <HeartTrace y={-60} w={1300} h={200} bpm={2} t={tt} window={60} z={0.01} />
            <X x={520} y={150} s={0.2 * (1 + 0.15 * beat)} z={0.02}>
              <WhaleHeart beat={beat} />
            </X>
          </X>
        </DeepSet>
      </Stage>
      <Label text="2 BEATS PER MINUTE" x={sc(-120, 230).x} y={sc(-120, 230).y} size={0.075} kind="hand" color="#5af07a" pin at={at(32.8)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the biggest animal ─────────────────────────

// 34.51 "This is the biggest animal on Earth."
export const BiggestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.68), y: 60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.2} surfaceY={760} seabedY={-900}>
          <BlueWhale x={600 - frame * 3} y={0} len={2600} swim={frame} z={1} />
          <KrillSwarm x={-1300} y={-500} w={500} h={240} n={90} frame={frame} z={0.5} />
        </DeepSet>
      </Stage>
      <Label text="BLUE WHALE" sub="BIGGEST ANIMAL ON EARTH" x={0.08} y={0.1} size={0.06} kind="box" at={at(34.92)} />
    </AbsoluteFill>
  );
};

// 36.74 "It can grow to about 33 meters long"
export const LengthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.98, 1.03);
  const k = ramp(t, 37.0, 38.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={500}>
          <BlueWhale x={0} y={60} len={1640} swim={frame * 0.5} beat={0.4} z={1} />
          <DimArrow x={-820 + 820 * k} y={-170} len={1640 * k} width={20} z={2} />
          <Character {...YOU} hat="cap" x={760} y={-420} s={0.32} look={0.5} expression={{ eyes: "wide", mouth: "o", gaze: [-0.5, 0.6] }} pose={poses.idle(frame, 1)} shadow={false} z={2} />
        </DeepSet>
      </Stage>
      <Label text="33 METERS" x={sc(0, -260, zoom).x} y={sc(0, -260, zoom).y} size={0.07} kind="box" pin at={sec(start)(37.65)} />
    </AbsoluteFill>
  );
};

/** Platform scale with a whale on it and a big dial. */
// 39.06 "and weigh around 150 tonnes."
export const WeightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const k = ramp(t, 39.3, 40.4, Easing.out(Easing.back(1.4)));
  const tonnes = Math.round(150 * ramp(t, 39.3, 40.3, Easing.out(Easing.quad)));
  const sink = hitAt(t, 39.3, 0.5) * 30;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 40, shake: hitAt(t, 39.3, 0.5) * 8 }} light={{ dir: [-0.5, 0.8] }} vignette={0.5}>
        <Paper>
          <X y={-300 - sink} z={0}>
            <Part shape={roundRect(1700, 90, 20)} color="#8a8e96" shade={0.2} />
            <Part shape={roundRect(1600, 40, 12)} color="#c8ccd2" flat outline={5} y={50} z={0.001} />
            <BlueWhale x={40} y={160} len={1380} eye="happy" z={0.1} />
          </X>
          <Part shape={roundRect(1760, 120, 20)} color="#5a5e66" shade={0.2} y={-400} z={-0.1} />
          <Gauge x={620} y={300} r={170} level={Math.min(1, k)} z={0.5} />
        </Paper>
      </Stage>
      <Label text={`${tonnes} TONNES`} x={sc(-300, 330).x} y={sc(-300, 330).y} size={0.08} kind="box" pin at={sec(start)(39.3)} />
    </AbsoluteFill>
  );
};

// 41.16 "Its heart alone weighs about 180 kilos."
export const HeartWeightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.95, 1.02);
  const beat = Math.max(0, Math.sin(t * Math.PI * 0.7)) ** 8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <LabSet floor={-420} desk={false}>
          <X x={-160} y={-420} z={0}>
            <Part shape={roundRect(640, 60, 12)} color="#8a8e96" shade={0.2} y={30} />
            <WhaleHeart x={0} y={360} size={0.82} beat={beat} />
          </X>
          <Character {...YOU} hat={null} x={520} y={-420} s={1.05} facing={-1} look={0.6} expression={{ eyes: "wide", mouth: "o", gaze: [-0.7, 0.2], brows: 0.6 }} pose={poses.scared(frame)} z={1} />
        </LabSet>
      </Stage>
      <Label text="180 KG" x={sc(-160, 700, zoom, 0, 40).x} y={sc(-160, 700, zoom, 0, 40).y} size={0.075} kind="box" pin at={sec(start)(42.44)} />
    </AbsoluteFill>
  );
};

// 43.97 "Even a newborn baby weighs about 2.5 tonnes."
export const NewbornShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: 20 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.22} surfaceY={700}>
          <BlueWhale x={-300 + frame * 1.2} y={260} len={2300} swim={frame * 0.7} beat={0.4} eye="happy" z={1} />
          <BlueWhale x={60 + frame * 1.2} y={-260} len={720} calf swim={frame * 1.2} eye="happy" z={2} />
        </DeepSet>
      </Stage>
      <Label text="NEWBORN: 2.5 TONNES" x={0.92} y={0.86} size={0.05} kind="box" at={at(45.52)} />
    </AbsoluteFill>
  );
};

// 46.91 "As far as we know, it's the heaviest animal that has ever lived."
export const HeaviestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const crown = ramp(t, 48.2, 48.8, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.9), y: 60 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <Paper color="#dde6ea">
          <Glow y={150} rx={900} ry={600} color="#fff6c8" alpha={0.45} />
          <Podium x={0} y={-460} w={1300} h={300} />
          <Podium x={-900} y={-460} w={520} h={170} color="#c8ccd2" />
          <Sauropod x={-860} y={-180} s={0.32} />
          <BlueWhale x={0} y={20 + Math.sin(frame * 0.06) * 8} len={1300} eye="happy" swim={frame * 0.3} beat={0.3} z={1} />
          <CrownProp x={330} y={150 + (1 - crown) * 500} w={150} rot={-0.12} z={2} />
        </Paper>
      </Stage>
      <Label text="HEAVIEST ANIMAL EVER" x={0.5} y={0.12} size={0.065} kind="title" at={at(48.23)} />
    </AbsoluteFill>
  );
};

// 50.42 "Heavier than any dinosaur."
export const DinoScaleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tilt = interpolate(t, [50.3, 50.9, 51.4], [0.2, -1.1, -1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 40, shake: hitAt(t, 50.9, 0.4) * 6 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <BalanceScale y={-60} w={1700} tilt={tilt} left={<BlueWhale len={700} y={60} eye="happy" />} right={<Sauropod s={0.3} y={100} eye="wide" />} />
        </Paper>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── the hook ─────────────────────────

// 52.77 "So how did an animal get this big?"
export const HowBigShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), x: 300 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3} surfaceY={600}>
          <BlueWhale x={-500} y={-120} len={3000} eye="open" gaze={[1, 0.2]} swim={frame * 0.3} beat={0.2} z={1} />
          <QuestionMark x={760} y={160} size={1.6 * pop(t, 53.8)} rot={Math.sin(frame * 0.1) * 0.08} z={2} />
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 55.02 "And why this one?"
export const WhyThisOneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const spot = ramp(t, 55.4, 55.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 0 }} light={{ dir: [-0.4, 0.8] }} vignette={0.6}>
        <DeepSet depth={0.3 + spot * 0.25} surfaceY={900}>
          <Dolphin x={-1150 + frame * 2} y={420} s={0.9} swim={frame} />
          <SpermWhale x={-900 + frame * 1.5} y={-420} len={1200} swim={frame} />
          <BlueWhale x={600 + frame} y={60} len={1500} swim={frame} z={1} />
          <Dolphin x={1100 + frame * 2} y={-420} s={0.7} swim={frame + 20} />
          {spot > 0 ? <Glow x={600 + frame} y={60} rx={1000} ry={500} color="#fff6c8" alpha={0.45 * spot} additive z={0.5} /> : null}
        </DeepSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 56.52 "Coming up, a whale that walks on four legs."
export const TeaserLegsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <Riverbank horizon={-60}>
          <ProtoWhale x={-560 + frame * 3.2} y={-110} s={1.25} k={0} walk={frame} z={1} />
        </Riverbank>
      </Stage>
      <Label text="COMING UP" x={0.08} y={0.1} size={0.05} kind="box" at={at(56.52)} />
      <Label text="A WHALE ON FOUR LEGS" x={0.5} y={0.86} size={0.06} kind="title" at={at(58.75)} />
    </AbsoluteFill>
  );
};

// 60.03 "A fossil that was supposed to beat the blue whale, until someone checked the math."
export const TeaserFossilShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const tilt = interpolate(t, [60.0, 61.3, 63.1, 63.7], [0, 1, 1, -1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 40, shake: hitAt(t, 63.6, 0.4) * 6 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Paper>
          <BalanceScale y={-60} w={1700} tilt={tilt} left={<BlueWhale len={700} y={60} eye={t > 63.4 ? "happy" : "sad"} />} right={<ProtoWhale k={1} fat={1.9} s={0.62} y={80} eye={t > 63.4 ? "wide" : "happy"} />} />
        </Paper>
      </Stage>
      <Label text="RECHECKED" x={0.78} y={0.22} size={0.06} kind="stamp" rotate={-8} at={at(63.22)} />
    </AbsoluteFill>
  );
};

// 64.11 "A mouthful worth half a million calories."
export const TeaserMouthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const m = ramp(t, 64.1, 64.9, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.88), x: 200 }} light={{ dir: [-0.4, 0.8] }} vignette={0.55}>
        <DeepSet depth={0.25} surfaceY={650}>
          <KrillSwarm x={700} y={-60} w={900} h={500} n={180} frame={frame} eaten={ramp(t, 64.6, 65.6)} z={0.5} />
          <BlueWhale x={-200 + m * 220} y={40} len={1900} mouth={m} krill={m} swim={frame} beat={0.6} z={1} />
          {[0, 1, 2, 3, 4].map((i) => (
            <Burger key={i} x={-600 + i * 330} y={380 + Math.sin(frame * 0.1 + i) * 20} size={0.55 * pop(t, 65.0 + i * 0.12)} z={2} />
          ))}
        </DeepSet>
      </Stage>
      <Label text="½ MILLION CALORIES" x={0.92} y={0.86} size={0.06} kind="box" at={at(65.04)} />
    </AbsoluteFill>
  );
};

// 66.75 "And the hunters who almost wiped the giants out."
export const TeaserHuntersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fire = interpolate(t, [67.95, 68.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hx = interpolate(t, [67.95, 68.6], [0, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 40, shake: hitAt(t, 67.95, 0.5) * 10 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#2a0a10">
        <CoastSet horizon={-120} mood="dusk" coast={false}>
          <WhaleCatcher x={-560} y={-210} s={1.0} bob={frame} fire={fire} z={-12} />
          {t > 67.95 ? <Harpoon x={110 + hx} y={80 - hx * 0.15} rot={-0.12} len={220} rope={hx * 0.9} z={-11} /> : null}
          <BlueWhale x={1200} y={-300} len={1600} swim={frame} beat={0.6} eye="wide" z={-13} />
          <WaterFront y={-230} color="#3a5a7a" z={-11.5} />
        </CoastSet>
        <Wash width={6000} height={4000} color="#5a0a14" alpha={0.18} z={30} />
      </Stage>
    </AbsoluteFill>
  );
};

// 69.62 "But first, we go back 50 million years,"
export const BackInTimeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const spin = frame * 0.06;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.25), rot: frame * 0.004 }} light={{ dir: [-0.4, 0.8] }} vignette={0.7}>
        <Paper color="#e8d8b8" blotch="#b89a6a">
          {Array.from({ length: 9 }, (_, i) => (
            <X key={i} rot={spin * (i % 2 ? 1 : -1) + i}>
              <Part shape={circle(160 + i * 130)} color={i % 2 ? "#e8b84a" : "#d88a3a"} flat outline={6} opacity={0.18} />
            </X>
          ))}
          {Array.from({ length: 8 }, (_, i) => {
            const a = i * 0.8 + frame * 0.05;
            const r = 300 + ((frame * 6 + i * 90) % 700);
            return (
              <X key={`c${i}`} x={Math.cos(a) * r} y={Math.sin(a) * r} rot={a} s={0.5} z={1 + i * 0.01}>
                <Calendar flip={(frame * 0.2 + i) % 1} />
              </X>
            );
          })}
          <X s={1.4 * pop(t, 71.0)} z={2}>
            <Glow rx={400} color="#fff1c8" alpha={0.6} additive />
          </X>
        </Paper>
      </Stage>
      <Label text="50 MILLION YEARS AGO" x={0.5} y={0.5} size={0.08} kind="title" at={at(71.08)} />
    </AbsoluteFill>
  );
};

// 72.56 "to a riverbank in what is now Pakistan."
export const PakistanMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = interpolate(frame, [0, dur], [7, 12], { easing: Easing.inOut(Easing.quad) });
  const center: [number, number] = [69, 28];
  const pk: [number, number] = [70.5, 30.5];
  const [px, py] = [(pk[0] - center[0]) * ppd, 0];
  const p = sc(px, py + 60);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <WorldMap ppd={ppd} center={center} w={2600} h={1600} tint={{ Pakistan: "#e2a04a" }} tintK={ramp(t, 73.6, 74.2)} pins={[{ at: pk, s: pop(t, 73.8) * 1.4, glow: true }]} />
      </Stage>
      <Label text="PAKISTAN" x={p.x} y={p.y - 0.08} size={0.05} kind="box" pin at={sec(start)(74.0)} />
    </AbsoluteFill>
  );
};
