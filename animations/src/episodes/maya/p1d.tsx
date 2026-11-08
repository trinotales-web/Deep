import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, Gradient, QuestionMark, Spear, roundRect, roundPoly, circle, ellipse, poly, blob, ramp, push, hitAt, absT, rng, mixHex, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses, reachArm } from "../../kit/character";
import {
  BallCourt, RubberBall, Codex, MesoMap, mesoXY, Glyph, MayaNumber, TikalTemple, MayaPyramid, InscriptionsTemple, Stela, WarGodLitter, JadeMask, PakalLid, Sarcophagus,
  Tree, Sun, Moon, Stars, Flame, Smoke, Jungle, Vines, Ceiba, Sunburst, MayaHut, Cloud,
} from "../../kit/env";
import { cloudShape } from "../../kit/env/nature";
import { sec, pop, useScr } from "../../kit/shot";
import { JungleSet, PlazaSet, PalaceRoom, Underworld, Paper } from "./sets";
import {
  BALLPLAYER, HUNAHPU, XBALANQUE, XIBALBA_LORD, MAYA_KING, MAYA_PRIEST, MAYA_COMMONER, MAYA_WOMAN, JAGUAR_WARRIOR, ITZA_WARRIOR, SCIENTIST, RUZ, WRITER,
} from "./cast";
import { upright } from "./p1a";

// ───────────────────────── the ball game ─────────────────────────

// 332.1 "And for fun? The Maya play ball."
export const PlayBallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const bx = Math.sin(frame * 0.09) * 520;
  const by = -160 + Math.abs(Math.cos(frame * 0.09)) * 360;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-300} ground="#c9b48a" jungle>
          <BallCourt y={-300} w={2400} h={720} z={-20} />
          {[-560, 560].map((x, i) => (
            <Character key={x} {...BALLPLAYER(i)} x={x} y={-760} s={1.35} z={2} facing={x < 0 ? 1 : -1} look={0.45} expression={{ eyes: "angry", mouth: "teeth", brows: -0.5 }} pose={{ ...poses.run(frame * 0.5 + i * 7), lean: -0.15 }} />
          ))}
          <RubberBall x={bx} y={by} r={46} z={3} />
        </JungleSet>
      </Stage>
      <Label text="PITZ · THE BALL GAME" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(333.7)} />
    </AbsoluteFill>
  );
};

// 334.8 "The ball is solid rubber."
export const SolidRubberShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const bounce = Math.abs(Math.sin(frame * 0.18)) * 160;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -100 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-300} ground="#c9b48a">
          <BallCourt y={-300} w={2600} h={760} z={-20} />
          <RubberBall x={0} y={-440 + bounce} r={150} z={2} />
          <Part shape={ellipse(140 - bounce * 0.2, 24)} color="#000000" flat outline={0} opacity={0.25} y={-590} z={1.9} />
        </JungleSet>
      </Stage>
      <Label text="SOLID RUBBER" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(335.5)} />
    </AbsoluteFill>
  );
};

// 336.55 "A ball can weigh up to 3.5 kilos, heavy enough to break bones."
export const HeavyBallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tip = ramp(t, 337.0, 337.8, Easing.out(Easing.back(1.6)));
  const crack = ramp(t, 339.4, 339.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), shake: hitAt(t, 339.5, 0.3) * 6 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e6d6ae">
          {/* hanging scale */}
          <X x={-420} y={-40} z={1}>
            <Line pts={[[0, 480], [0, 300]]} width={6} color="#5a3a26" />
            <X y={300} rot={-0.25 + tip * 0.25}>
              <Line pts={[[-280, 0], [280, 0]]} width={10} color="#6e4a2c" />
              <X x={-260}>
                <Line pts={[[-50, -120], [0, 0], [50, -120]]} width={3} color="#5a3a26" />
                <Part shape={roundRect(140, 18, 6)} color="#8a5a32" shade={0.2} y={-124} />
                <RubberBall y={-60} r={60} z={0.01} />
              </X>
              <X x={260}>
                <Line pts={[[-50, -120], [0, 0], [50, -120]]} width={3} color="#5a3a26" />
                <Part shape={roundRect(140, 18, 6)} color="#8a5a32" shade={0.2} y={-124} />
                <Part shape={roundRect(70, 50, 8)} color="#8a8790" shade={0.25} y={-90} z={0.01} />
              </X>
            </X>
          </X>
          {/* bone */}
          <X x={460} y={0} rot={0.3} z={1}>
            <X x={-crack * 30} rot={-crack * 0.3}>
              <Part shape={blob([[-210, -24], [-10, -20], [-10, 20], [-210, 24], [-240, 40], [-260, 0], [-240, -40]], 8)} color="#f2ead4" shade={0.2} />
            </X>
            <X x={crack * 30} rot={crack * 0.3}>
              <Part shape={blob([[10, -20], [210, -24], [240, -40], [260, 0], [240, 40], [210, 24], [10, 20]], 8)} color="#f2ead4" shade={0.2} />
            </X>
            {crack > 0 ? <Line pts={[[-10, 30], [10, 0], [-10, -30]]} width={6} color="#2a2026" z={0.01} /> : null}
          </X>
        </Paper>
      </Stage>
      <Label text="UP TO 3.5 KG" x={0.28} y={0.14} size={0.06} kind="box" at={sec(start)(338.0)} />
      <Label text="CRACK!" x={0.76} y={0.2} size={0.08} kind="stamp" rotate={-8} at={sec(start)(339.6)} />
    </AbsoluteFill>
  );
};

// 340.6 "You can't use your hands."
export const NoHandsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const x = ramp(t, 341.0, 341.3);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={6} bg={<JungleSet mood="day" horizon={-300} ground="#c9b48a"><BallCourt y={-300} w={2400} h={720} z={-20} /></JungleSet>}>
        <Character {...BALLPLAYER(0)} x={-60} y={-980} s={2.4} z={2} look={0.2} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.armsUp(frame)} />
        {x > 0 ? (
          <X y={60} z={3}>
            <Line pts={[[-260, -260], [-260 + 520 * x, -260 + 520 * x]]} width={34} color="#c0392b" />
            <Line pts={[[260, -260], [260 - 520 * x, -260 + 520 * x]]} width={34} color="#c0392b" />
          </X>
        ) : null}
      </DepthStage>
      <Label text="NO HANDS" x={0.78} y={0.12} size={0.06} kind="box" at={sec(start)(341.1)} />
    </AbsoluteFill>
  );
};

// 342.1 "You hit it with your hips."
export const HipsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = 342.75;
  const bx = t < hit ? interpolate(t, [342.1, hit], [-900, -80]) : interpolate(t, [hit, 343.5], [-80, 900]);
  const by = t < hit ? interpolate(t, [342.1, hit], [-120, -380]) : interpolate(t, [hit, 343.5], [-380, 200]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.2, y: -260, shake: hitAt(t, hit, 0.3) * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-300} ground="#c9b48a">
          <BallCourt y={-300} w={2600} h={760} z={-20} />
          <Character {...BALLPLAYER(1)} x={40} y={-760} s={1.5} z={2} facing={-1} look={0.45} expression={{ eyes: "angry", mouth: "teeth", brows: -0.6 }} pose={{ armF: [-0.6, 0.6], armB: [0.8, 0.6], lean: t > hit - 0.2 && t < hit + 0.3 ? -0.35 : -0.1, legF: 0.4, legB: -0.3 }} />
          <RubberBall x={bx} y={by} r={46} z={3} />
          {Math.abs(t - hit) < 0.25 ? <Glow x={-80} y={-380} rx={160} color="#ffffff" alpha={0.6} additive z={3.1} /> : null}
        </JungleSet>
      </Stage>
      <Label text="HIPS!" x={0.3} y={0.2} size={0.08} kind="stamp" rotate={-8} at={sec(start)(342.8)} />
    </AbsoluteFill>
  );
};

// 343.5 "And on some courts, the goal is a stone ring high up on the wall."
export const StoneRingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tilt = ramp(t, 343.6, 345.6, Easing.inOut(Easing.cubic));
  const through = ramp(t, 346.0, 346.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: interpolate(tilt, [0, 1], [1.0, 1.7]), x: interpolate(tilt, [0, 1], [0, -760]), y: interpolate(tilt, [0, 1], [-100, 180]) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-300} ground="#c9b48a">
          <BallCourt y={-300} w={2400} h={720} z={-20} />
          {through > 0 ? <RubberBall x={interpolate(through, [0, 1], [-300, -1020])} y={-300 + 720 * 0.72 + Math.sin(through * Math.PI) * 60} r={30} z={-19} /> : null}
        </JungleSet>
      </Stage>
      <Label text="STONE RING" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(345.8)} />
    </AbsoluteFill>
  );
};

// 347.65 "The game has its own legend."
export const LegendShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.6] }} vignette={0.7}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a2a3a"], [1, "#140a14"]]} z={-41} />
        <Codex pages={6} open={ramp(t, 347.8, 348.8)} s={1.2} z={1} />
        <Glow rx={700} color="#fff2c6" alpha={0.35} additive z={0.5} />
      </Stage>
      <Label text="THE LEGEND" sub="POPOL VUH" x={0.5} y={0.12} size={0.065} kind="box" at={sec(start)(348.5)} />
    </AbsoluteFill>
  );
};

// 349.65 "In the Popol Vuh, two brothers play ball so loudly that they annoy the lords of the underworld."
export const LoudBrothersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const thump = Math.abs(Math.sin(frame * 0.35));
  const quake = t > 352.4 ? 4 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), shake: quake }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <X y={80} z={-5}>
          <Gradient w={6000} h={1400} y={700} stops={[[0, "#7cc0e4"], [1, "#e6f2ea"]]} />
          <Part shape={roundRect(6000, 60, 0)} color="#c9b48a" flat outline={4} y={-30} z={0.01} />
          {[-1, 1].map((k) => (
            <Character key={k} {...(k < 0 ? HUNAHPU : XBALANQUE)} hat="plume" marks={null} x={k * 340} y={0} s={0.85} z={1} facing={k < 0 ? 1 : -1} look={0.45} expression={{ eyes: "happy", mouth: "shout" }} pose={poses.run(frame * 0.6 + k * 8)} />
          ))}
          <RubberBall x={Math.sin(frame * 0.12) * 260} y={60 + thump * 220} r={32} z={2} />
        </X>
        <X y={-220} z={-6}>
          <Gradient w={6000} h={1200} y={-300} stops={[[0, "#3a2030"], [1, "#0e0a14"]]} />
          {[-420, 0, 420].map((x, i) => (
            <Character key={x} {...XIBALBA_LORD(i)} x={x} y={-520} s={0.9} z={1} look={0.4} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ armF: [2.7, 1.6], armB: [2.6, 1.6], armsOverHead: true }} />
          ))}
        </X>
        <Line pts={[[-3000, 50], [3000, 50]]} width={8} z={-4} />
        {[-300, 120, 360].map((x, i) => (
          <Line key={i} pts={[[x, 50], [x + 30, -10], [x - 20, -70]]} width={5} color="#5a3a26" z={-3.9} />
        ))}
      </Stage>
      <Label text="TWO BROTHERS" x={0.2} y={0.08} size={0.045} kind="box" at={sec(start)(351.0)} />
      <Label text="LORDS OF THE UNDERWORLD" x={0.5} y={0.94} size={0.045} kind="box" at={sec(start)(353.6)} />
    </AbsoluteFill>
  );
};

// 355.1 "That's a dark place called Xibalba."
export const XibalbaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ pos: [0, 200] }} vignette={0.8} vignetteColor="#0a0408">
        <Underworld floorY={-460}>
          {[-560, 0, 560].map((x, i) => (
            <Character key={x} {...XIBALBA_LORD(i)} x={x} y={-640} s={1.15} z={2} facing={x > 0 ? -1 : 1} look={0.4} expression={{ eyes: "half", mouth: "smirk", brows: -0.8 }} pose={i === 1 ? poses.handsOnHips : poses.idle(frame, i)} />
          ))}
        </Underworld>
      </Stage>
      <Label text="XIBALBA" sub="THE UNDERWORLD" x={0.5} y={0.1} size={0.08} kind="title" at={sec(start)(356.8)} />
    </AbsoluteFill>
  );
};

// 357.65 "The lords invite them down for a game, trick them, and kill them."
export const TrickKillShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dead = t > 360.8;
  const fall = ramp(t, 360.8, 361.3, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40, shake: hitAt(t, 360.85, 0.3) * 6 }} light={{ pos: [0, 200] }} vignette={0.8} vignetteColor="#0a0408">
        <Underworld floorY={-460}>
          {[-560, 540].map((x, i) => (
            <Character key={x} {...XIBALBA_LORD(i)} x={x} y={-700} s={1.3} z={2} facing={x > 0 ? -1 : 1} look={0.4} expression={{ eyes: "angry", mouth: t > 359.6 ? "grin" : "smirk", brows: -0.9 }} pose={t > 359.6 ? poses.point(frame) : poses.idle(frame, i)} />
          ))}
          {[-150, 150].map((x, i) => (
            <X key={x} x={x} y={-640} rot={dead ? (i ? -1 : 1) * fall * 1.4 : 0} z={2.1}>
              <Character {...(i ? XBALANQUE : HUNAHPU)} hat="plume" marks={null} s={1.2} facing={i ? -1 : 1} look={0.4} expression={dead ? { eyes: "dead", mouth: "o" } : t > 359.6 ? { eyes: "wide", mouth: "shout", brows: 0.9, sweat: true } : { eyes: "happy", mouth: "smile" }} pose={dead ? { armF: [0.4, 0.3], armB: [0.3, 0.3] } : t > 359.6 ? poses.scared(frame) : poses.idle(frame, i)} />
            </X>
          ))}
        </Underworld>
      </Stage>
      <Label text="INVITE" x={0.2} y={0.1} size={0.045} kind="box" at={sec(start)(358.1)} />
      <Label text="TRICK" x={0.5} y={0.1} size={0.045} kind="box" at={sec(start)(359.7)} />
      <Label text="KILL" x={0.8} y={0.1} size={0.05} kind="stamp" rotate={-6} at={sec(start)(360.8)} />
    </AbsoluteFill>
  );
};

/** Calabash tree of Xibalba with gourds and one brother's head among them. Origin = base. */
const CalabashTree: React.FC<{ x?: number; y?: number; s?: number; z?: number; head?: number }> = ({ x = 0, y = 0, s = 1, z = 0, head = 1 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Tree h={900} kind="bare" seed={3} bark="#3a2e2a" spread={1.4} />
    {[[-200, 700], [160, 760], [-60, 820], [260, 640], [-300, 600]].map(([gx, gy], i) => (
      <X key={i} x={gx} y={gy} z={0.05}>
        <Line pts={[[0, 0], [0, 40]]} width={4} color="#3a2e2a" />
        <Part shape={circle(34)} color="#8aa04a" shade={0.26} />
      </X>
    ))}
    {head > 0 ? (
      <X x={40} y={640} s={head} z={0.06}>
        <Line pts={[[0, 50], [0, 110]]} width={4} color="#3a2e2a" />
        <Part shape={circle(54)} color="#d8d4c4" shade={0.26} />
        <Part shape={ellipse(12, 6)} color="#2a2026" flat outline={0} x={-18} y={8} z={0.001} />
        <Part shape={ellipse(12, 6)} color="#2a2026" flat outline={0} x={18} y={8} z={0.001} />
        <Line pts={[[-14, -22], [14, -22]]} width={4} z={0.001} />
        <Part shape={blob([[-50, 30], [-30, 60], [30, 60], [50, 30], [0, 50]], 6)} color="#2a2228" flat outline={3} z={0.002} />
      </X>
    ) : null}
  </X>
);

// 361.6 "They cut off one brother's head and hang it in a tree."
export const HeadInTreeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 140 }} light={{ pos: [0, 200] }} vignette={0.8} vignetteColor="#0a0408">
        <Underworld floorY={-460}>
          <CalabashTree x={0} y={-460} s={1.0} head={ramp(t, 362.7, 363.5, Easing.out(Easing.back(1.6)))} z={1} />
        </Underworld>
      </Stage>
      <Label text="THE CALABASH TREE" x={0.5} y={0.92} size={0.045} kind="box" at={sec(start)(363.0)} />
    </AbsoluteFill>
  );
};

// 364.85 "Years later, his twin sons go down to the underworld to play the same lords."
export const TwinsDescendShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = interpolate(t, [364.85, 369.5], [0, 1]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [0, 400] }} vignette={0.75} vignetteColor="#0a0408">
        <Gradient w={6000} h={4000} stops={[[0, "#5a4a5a"], [1, "#0e0a14"]]} z={-41} />
        {Array.from({ length: 12 }, (_, i) => (
          <Part key={i} shape={roundRect(1200, 60, 4)} color={mixHex("#8a7a6a", "#2a2028", i / 11)} shade={0.2} x={-200 + i * 80} y={540 - i * 90} z={-20 + i * 0.01} />
        ))}
        {[0, 1].map((i) => {
          const q = k - i * 0.08;
          return (
            <Character key={i} {...(i ? XBALANQUE : HUNAHPU)} x={-500 + q * 900 + i * 140} y={560 - q * 980 - i * 40} s={1.15} z={2 + i * 0.01} look={0.45} expression={{ eyes: "angry", mouth: "smirk", brows: -0.5 }} pose={poses.walk(frame + i * 10, 0.6)} />
          );
        })}
      </Stage>
      <Label text="THE TWIN SONS" x={0.22} y={0.1} size={0.05} kind="box" at={sec(start)(366.0)} />
    </AbsoluteFill>
  );
};

// 369.55 "These are the Hero Twins."
export const HeroTwinsShot: React.FC<ShotProps> = ({ start, dur }) => {
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
      <Label text="THE HERO TWINS" x={0.5} y={0.08} size={0.07} kind="title" at={sec(start)(370.6)} />
      <Label text="HUNAHPU" x={0.3} y={0.92} size={0.04} kind="box" at={sec(start)(370.8)} />
      <Label text="XBALANQUE" x={0.7} y={0.92} size={0.04} kind="box" at={sec(start)(371.0)} />
    </AbsoluteFill>
  );
};

/** Bat (House of Bats). */
const Bat: React.FC<{ x: number; y: number; s?: number; z?: number; seed?: number }> = ({ x, y, s = 1, z = 0, seed = 0 }) => {
  const frame = useCurrentFrame();
  const flap = Math.sin(frame * 0.8 + seed) * 0.5;
  return (
    <X x={x} y={y} s={s} z={z}>
      {[-1, 1].map((k) => (
        <X key={k} rot={k * flap}>
          <Part shape={blob([[0, 0], [k * 60, 30], [k * 110, 10], [k * 90, -10], [k * 70, 6], [k * 50, -10], [k * 30, 6]], 6)} color="#2a2232" shade={0.2} />
        </X>
      ))}
      <Part shape={ellipse(22, 28)} color="#3a2e40" shade={0.24} z={0.001} />
      {[-1, 1].map((k) => (
        <Part key={`e${k}`} shape={circle(4)} color="#ff5a3a" flat outline={0} x={k * 8} y={6} z={0.002} />
      ))}
    </X>
  );
};

// 372.4 "They survive every trap and beat the lords with clever tricks."
export const TrapsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const beat = t > 373.9;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ pos: [0, 200] }} vignette={0.75} vignetteColor="#0a0408">
        <Underworld floorY={-460}>
          {Array.from({ length: 9 }, (_, i) => (
            <Bat key={i} x={((i * 263 + frame * 9) % 2400) - 1200} y={120 + ((i * 97) % 360)} s={0.9} seed={i} z={3} />
          ))}
          <Character {...HUNAHPU} x={-460} y={-760} s={1.5} z={2} look={0.45} expression={{ eyes: beat ? "happy" : "wide", mouth: beat ? "grin" : "o" }} pose={beat ? poses.armsUp(frame) : { ...poses.run(frame * 0.6), lean: -0.2 }} />
          <Character {...XBALANQUE} x={-120} y={-760} s={1.5} z={2.01} look={0.45} expression={{ eyes: beat ? "happy" : "angry", mouth: beat ? "grin" : "teeth" }} pose={beat ? poses.armsUp(frame + 6) : { ...poses.run(frame * 0.6 + 5), lean: -0.2 }} />
          {[340, 640].map((x, i) => (
            <Character key={x} {...XIBALBA_LORD(i)} x={x} y={-700} s={1.3} z={1.9} facing={-1} look={0.4} expression={beat ? { eyes: "dead", mouth: "o" } : { eyes: "angry", mouth: "shout", brows: -0.9 }} pose={beat ? poses.scared(frame) : poses.point(frame)} />
          ))}
        </Underworld>
      </Stage>
      <Label text="EVERY TRAP" x={0.22} y={0.1} size={0.05} kind="box" at={sec(start)(373.0)} />
      <Label text="LORDS BEATEN" x={0.76} y={0.1} size={0.05} kind="box" at={sec(start)(374.4)} />
    </AbsoluteFill>
  );
};

// 375.85 "Then they rise into the sky as the sun and the moon."
export const SunMoonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 376.0, 377.8, Easing.inOut(Easing.cubic));
  const sun = ramp(t, 377.6, 378.1);
  const moon = ramp(t, 378.3, 378.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: rise * 300 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="dawn" horizon={-360}>
          <X x={-300} y={-500 + rise * 900} z={2}>
            {sun < 1 ? <Character {...HUNAHPU} s={1.0 * (1 - sun)} look={0.4} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} /> : null}
            {sun > 0 ? <Sun y={300} r={130 * sun} glow={sun} /> : null}
          </X>
          <X x={300} y={-500 + rise * 860} z={2}>
            {moon < 1 ? <Character {...XBALANQUE} s={1.0 * (1 - moon)} facing={-1} look={0.4} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame + 5)} /> : null}
            {moon > 0 ? <Moon y={300} r={100 * moon} /> : null}
          </X>
        </JungleSet>
      </Stage>
      <Label text="THE SUN" x={0.32} y={0.88} size={0.05} kind="box" at={sec(start)(377.8)} />
      <Label text="THE MOON" x={0.68} y={0.88} size={0.05} kind="box" at={sec(start)(378.5)} />
    </AbsoluteFill>
  );
};

// 379.15 "Remember those twins."
export const RememberTwinsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="dusk" horizon={-360}>
          <Sun x={-420} y={300} r={130} glow={0.8} z={-39} />
          <Moon x={420} y={360} r={100} z={-39} />
        </JungleSet>
      </Stage>
      <Label text="REMEMBER THE TWINS" x={0.5} y={0.86} size={0.055} kind="box" at={sec(start)(379.3)} />
    </AbsoluteFill>
  );
};

/** Rack of skulls (tzompantli) beside a court. Origin = base centre. */
const SkullRack: React.FC<{ x?: number; y?: number; s?: number; z?: number; w?: number }> = ({ x = 0, y = 0, s = 1, z = 0, w = 700 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(w, 80, 6)} color="#b9ae98" shade={0.22} y={40} />
    {[0, 1, 2].map((r) => (
      <React.Fragment key={r}>
        <Line pts={[[-w / 2 + 20, 140 + r * 90], [w / 2 - 20, 140 + r * 90]]} width={8} color="#6e4a2c" />
        {Array.from({ length: Math.floor(w / 80) }, (_, i) => (
          <X key={i} x={-w / 2 + 50 + i * 80} y={120 + r * 90} z={0.01}>
            <Part shape={circle(28)} color="#ece4cf" shade={0.24} />
            <Part shape={ellipse(7, 9)} color="#2a2026" flat outline={0} x={-9} y={4} z={0.001} />
            <Part shape={ellipse(7, 9)} color="#2a2026" flat outline={0} x={9} y={4} z={0.001} />
          </X>
        ))}
      </React.Fragment>
    ))}
  </X>
);

// 381.0 "So were real games life or death?"
export const LifeOrDeathShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [0.6, 0.4] }} vignette={0.75} vignetteColor="#140a10">
        <JungleSet mood="dusk" horizon={-300} ground="#b8a080">
          <BallCourt y={-300} w={2400} h={720} z={-20} />
          <SkullRack x={0} y={-560} s={1.0} z={1} />
          <QuestionMark x={560} y={200} s={0.8 * pop(t, 382.3)} rot={0.1} z={3} />
        </JungleSet>
      </Stage>
      <Label text="LIFE OR DEATH?" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(382.4)} />
    </AbsoluteFill>
  );
};

// 383.45 "You might have heard that the winners were sacrificed, as an honor."
export const WinnersMythShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [0.6, 0.4] }} vignette={0.7} vignetteColor="#140a10">
        <JungleSet mood="dusk" horizon={-300} ground="#b8a080">
          <BallCourt y={-300} w={2400} h={720} z={-20} />
          <Character {...BALLPLAYER(0)} x={-200} y={-760} s={1.6} z={2} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} />
          <Character {...MAYA_PRIEST(1)} x={360} y={-760} s={1.5} z={2} facing={-1} look={0.45} expression={{ eyes: "half", mouth: "smirk", brows: -0.5 }} pose={{ ...poses.idle(frame), armF: [1.6, 0.4] }} />
        </JungleSet>
      </Stage>
      <Label text="WINNERS SACRIFICED?" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(384.6)} />
    </AbsoluteFill>
  );
};

// 386.8 "There's no good evidence for that."
export const NoEvidenceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={6} bg={<Paper color="#e6d6ae" />}>
        <Character {...SCIENTIST(0)} x={-200} y={-940} s={2.3} z={2} look={0.45} expression={{ eyes: "half", mouth: "flat", brows: -0.2 }} pose={poses.handsOnHips} />
      </DepthStage>
      <Label text="NO GOOD EVIDENCE" x={0.72} y={0.3} size={0.07} kind="stamp" rotate={-8} at={sec(start)(387.4)} />
    </AbsoluteFill>
  );
};

/** War captive: arms tied behind, rope collar. */
const Captive: React.FC<{ x: number; y: number; s: number; z?: number; i?: number; facing?: 1 | -1; kneel?: boolean; expression?: React.ComponentProps<typeof Character>["expression"] }> = ({ x, y, s, z = 2, i = 0, facing = 1, kneel = false, expression }) => {
  const frame = useCurrentFrame();
  return (
    <Character {...MAYA_COMMONER(i)} hat={null} x={x} y={y} s={s} z={z} facing={facing} look={0.4} expression={expression ?? { eyes: "half", mouth: "wavy", brows: 0.9 }} pose={{ ...(kneel ? poses.sit(frame) : poses.walk(frame + i * 7, 0.3)), armF: [-0.4, 0.9], armB: [-0.5, 0.9], headTilt: -0.12 }}>
      <X y={226} z={0.5}>
        <Line pts={[[-40, 0], [0, -10], [40, 0]]} smooth width={8} color="#c8a878" />
      </X>
    </Character>
  );
};

// 388.4 "But prisoners of war were sometimes forced to play."
export const PrisonersPlayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [0.9, 0.5];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [0.6, 0.4] }} vignette={0.7} vignetteColor="#140a10">
        <JungleSet mood="dusk" horizon={-300} ground="#b8a080">
          <BallCourt y={-300} w={2400} h={720} z={-20} />
          <Captive x={-160} y={-740} s={1.45} i={1} />
          <Captive x={160} y={-740} s={1.45} i={2} />
          <Character {...JAGUAR_WARRIOR(0)} x={-560} y={-760} s={1.55} z={2.1} look={0.45} expression={{ eyes: "angry", mouth: "flat", brows: -0.8 }} pose={{ ...poses.walk(frame, 0.3), armF: arm }} holdF={<Spear rot={upright(arm)} length={720} tip="#2a2228" />} />
        </JungleSet>
      </Stage>
      <Label text="PRISONERS OF WAR" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(389.0)} />
    </AbsoluteFill>
  );
};

// 391.15 "And for them, losing could mean death."
export const LosingDeathShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dark = ramp(t, 392.4, 393.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: -80 }} light={{ dir: [0.6, 0.4] }} vignette={0.8} vignetteColor="#0a0406" wash={dark * 0.55}>
        <JungleSet mood="dusk" horizon={-300} ground="#a89070">
          <BallCourt y={-300} w={2400} h={720} z={-20} />
          <SkullRack x={480} y={-560} s={0.9} z={1} />
          <Captive x={-260} y={-840} s={1.9} i={1} kneel expression={{ eyes: "closed", mouth: "wavy", brows: 0.95, sweat: true }} />
          <RubberBall x={160} y={-560} r={46} z={2} />
        </JungleSet>
      </Stage>
      <Label text="LOSING = DEATH" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(392.7)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── superpowers ─────────────────────────

const KMAP_C: [number, number] = [-90.2, 17.2];
const KPPD = 160;

/** Map of the rivals with emblem banners. */
const RivalsMap: React.FC<{ tikal?: number; calakmul?: number; links?: number; attack?: number; others?: number }> = ({ tikal = 0, calakmul = 0, links = 0, attack = 0, others = 1 }) => {
  const at = (lon: number, lat: number) => mesoXY(lon, lat, KPPD, KMAP_C);
  const T = at(-89.62, 17.22);
  const K = at(-89.81, 18.1);
  const allies: [number, number][] = [at(-89.12, 16.76), at(-89.25, 17.13), at(-90.18, 16.44), at(-90.97, 16.9)];
  return (
    <>
      <MesoMap ppd={KPPD} center={KMAP_C} maya={1} />
      {others > 0
        ? [[-92.05, 17.48], [-89.14, 14.84], [-91.26, 17.17], [-90.06, 16.51], [-89.63, 17.39], [-90.23, 19.6]].map(([lo, la], i) => {
            const [x, y] = at(lo, la);
            return <Part key={i} shape={circle(24)} color="#b9ae98" flat outline={3.5} x={x} y={y} z={1} />;
          })
        : null}
      {allies.map(([x, y], i) => (
        <Part key={`a${i}`} shape={circle(26)} color={links > 0 ? "#3fa07a" : "#b9ae98"} flat outline={3.5} x={x} y={y} z={1.05} />
      ))}
      {links > 0
        ? allies.map(([x, y], i) => (
            <Line key={`l${i}`} pts={[K, [K[0] + (x - K[0]) * links, K[1] + (y - K[1]) * links]]} width={8} color="#2f8a5a" z={1.04} />
          ))
        : null}
      {attack > 0 ? (
        <Line pts={[allies[0], [allies[0][0] + (T[0] - allies[0][0]) * attack, allies[0][1] + (T[1] - allies[0][1]) * attack]]} width={16} color="#c0392b" z={1.06} />
      ) : null}
      <X x={T[0]} y={T[1]} s={0.6 + tikal * 0.6} z={1.1}>
        <Part shape={circle(46)} color="#c0392b" flat outline={4} />
        {tikal > 0 ? <Glyph kind="tikal" size={110} y={120} paint="#f2e2c0" /> : null}
      </X>
      <X x={K[0]} y={K[1]} s={0.6 + calakmul * 0.6} z={1.1}>
        <Part shape={circle(46)} color="#2f8a5a" flat outline={4} />
        {calakmul > 0 ? <Glyph kind="snake" size={110} y={120} paint="#f2e2c0" /> : null}
      </X>
    </>
  );
};

// 394.2 "Now, remember the rule? No empire. Only kingdoms."
export const RuleAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <RivalsMap others={1} />
      </Stage>
      <Label text="THE RULE" x={0.2} y={0.1} size={0.05} kind="box" at={sec(start)(394.7)} />
      <Label text="NO EMPIRE" x={0.5} y={0.1} size={0.05} kind="stamp" rotate={-5} at={sec(start)(395.8)} />
      <Label text="ONLY KINGDOMS" x={0.8} y={0.1} size={0.05} kind="box" at={sec(start)(396.9)} />
    </AbsoluteFill>
  );
};

// 398.3 "But by the 500s, two of them become superpowers."
export const SuperpowersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const g = ramp(t, 400.0, 401.2, Easing.out(Easing.back(1.5)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <RivalsMap tikal={g} calakmul={g} others={1} />
      </Stage>
      <Label text="AD 500s" x={0.18} y={0.1} size={0.06} kind="box" at={sec(start)(399.1)} />
      <Label text="TWO SUPERPOWERS" x={0.7} y={0.1} size={0.05} kind="box" at={sec(start)(400.9)} />
    </AbsoluteFill>
  );
};

// 402.0 "Tikal, in the jungles of Guatemala."
export const TikalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 120 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-300}>
          <TikalTemple x={-260} y={-300} s={1.15} z={-20} />
          <MayaPyramid x={560} y={-300} s={0.8} w={600} h={520} tiers={8} top={0.44} templeW={200} templeH={150} doors={1} comb={150} color="#e8dcc4" z={-21} />
          <Jungle y={-320} w={6000} h={220} seed={16} z={-15} />
        </JungleSet>
      </Stage>
      <Label text="TIKAL" sub="GUATEMALA" x={0.2} y={0.1} size={0.07} kind="box" at={sec(start)(402.1)} />
    </AbsoluteFill>
  );
};

/** Snake banner (Kaanul) on a pole. */
const SnakeBanner: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} s={s} z={z}>
      <Line pts={[[0, 0], [0, 520]]} width={12} color="#6e4a2c" />
      <X y={500} rot={Math.sin(frame * 0.1) * 0.05}>
        <Part shape={roundRect(220, 280, 10)} color="#2f8a5a" shade={0.2} x={110} y={-140} />
        <Glyph kind="snake" size={150} paint="#f2e2c0" x={110} y={-140} z={0.01} />
      </X>
    </X>
  );
};

// 404.55 "And Calakmul, the Snake Kingdom, in what is now Mexico."
export const CalakmulShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 100 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-300}>
          <MayaPyramid x={160} y={-300} s={1.0} w={1300} h={560} tiers={7} top={0.36} stairW={0.14} templeW={300} templeH={160} doors={3} comb={0} color="#e2d6bc" z={-20} />
          <SnakeBanner x={-700} y={-560} s={1.1} z={2} />
          <SnakeBanner x={880} y={-560} s={0.9} z={2} />
          <Jungle y={-320} w={6000} h={200} seed={17} z={-15} />
        </JungleSet>
      </Stage>
      <Label text="CALAKMUL" sub="THE SNAKE KINGDOM" x={0.5} y={0.1} size={0.07} kind="box" at={sec(start)(405.0)} />
    </AbsoluteFill>
  );
};

// 408.4 "Calakmul is clever. It makes friends with Tikal's neighbors."
export const MakesFriendsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <RivalsMap tikal={1} calakmul={1} links={ramp(t, 410.0, 411.4)} />
      </Stage>
      <Label text="CLEVER" x={0.2} y={0.1} size={0.05} kind="box" at={sec(start)(409.1)} />
      <Label text="ALLIES AROUND TIKAL" x={0.72} y={0.92} size={0.045} kind="box" at={sec(start)(411.0)} />
    </AbsoluteFill>
  );
};

// 411.95 "And in 562, one of those friends, a city called Caracol, attacks Tikal with Calakmul's help."
export const CaracolAttacksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const a: [number, number] = [0.9, 0.5];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40, shake: t > 416.3 ? 4 : 0 }} light={{ dir: [0.6, 0.4] }} vignette={0.65}>
        <JungleSet mood="dusk" horizon={-260}>
          <TikalTemple x={700} y={-260} s={0.7} z={-20} />
          {Array.from({ length: 6 }, (_, i) => (
            <Character key={i} {...(i % 2 ? JAGUAR_WARRIOR(i) : ITZA_WARRIOR(i + 1))} x={-900 + i * 180 + ramp(t, 415.8, 417.8) * 300} y={-660 + (i % 2) * 30} s={1.0 - (i % 2) * 0.08} z={2 - (i % 2) * 0.1} look={0.45} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ ...poses.run(frame * 0.6 + i * 5), armF: a }} holdF={<Spear rot={upright(a)} length={600} tip="#2a2228" />} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="AD 562" x={0.16} y={0.1} size={0.065} kind="box" at={sec(start)(412.3)} />
      <Label text="CARACOL ATTACKS TIKAL" x={0.62} y={0.1} size={0.05} kind="box" at={sec(start)(415.4)} />
    </AbsoluteFill>
  );
};

// 418.65 "Experts call it a 'star war,' after the sign the Maya carved for it."
export const StarWarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Gradient w={6000} h={4000} stops={[[0, "#1a1a3a"], [1, "#0a0a18"]]} z={-41} />
        <Stars w={4000} h={2400} count={120} z={-40} />
        <Glyph kind="star" size={460 * pop(t, 419.5)} color="#e8dcc0" z={1} />
        <Glow rx={600} color="#ffe8a0" alpha={0.3} additive z={0.5} />
      </Stage>
      <Label text="“STAR WAR”" x={0.5} y={0.1} size={0.08} kind="title" at={sec(start)(419.7)} />
      <Label text="THE GLYPH" x={0.5} y={0.9} size={0.045} kind="box" at={sec(start)(421.0)} />
    </AbsoluteFill>
  );
};

// 423.05 "Tikal loses."
export const TikalLosesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 423.3, 424.0, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40, shake: hitAt(t, 424.0, 0.3) * 6 }} light={{ dir: [0.6, 0.4] }} vignette={0.7}>
        <JungleSet mood="dusk" horizon={-260}>
          <TikalTemple x={0} y={-260} s={0.9} z={-20} />
          <X x={-500} y={-560} rot={fall * 1.4} z={2}>
            <Line pts={[[0, 0], [0, 520]]} width={12} color="#6e4a2c" />
            <Part shape={roundRect(220, 280, 10)} color="#c0392b" shade={0.2} x={110} y={360} />
            <Glyph kind="tikal" size={150} paint="#f2e2c0" x={110} y={360} z={0.01} />
          </X>
          <Smoke x={200} y={-260} w={300} h={700} alpha={0.4} seed={4} z={1} />
        </JungleSet>
      </Stage>
      <Label text="TIKAL LOSES" x={0.66} y={0.12} size={0.06} kind="box" at={sec(start)(423.8)} />
    </AbsoluteFill>
  );
};

// 424.7 "Its king is probably captured and sacrificed."
export const KingCapturedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const knife = ramp(t, 426.6, 427.2);
  const arm: [number, number] = [2.6 - knife * 0.2, 0.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [0.6, 0.4] }} vignette={0.8} vignetteColor="#100608" wash={ramp(t, 427.0, 427.7) * 0.4}>
        <JungleSet mood="dusk" horizon={-260}>
          <Character {...MAYA_KING(1)} hat={null} x={-200} y={-860} s={1.8} z={2} look={0.45} expression={{ eyes: "closed", mouth: "wavy", brows: 0.9 }} pose={{ ...poses.sit(frame), armF: [-0.4, 0.9], armB: [-0.5, 0.9], headTilt: -0.15 }} />
          {knife > 0 ? (
            <Character {...JAGUAR_WARRIOR(1)} x={360} y={-820} s={1.7} z={1.9} facing={-1} look={0.45} expression={{ eyes: "angry", mouth: "flat", brows: -0.9 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<X rot={upright(arm)}><Line pts={[[0, -10], [0, 60]]} width={10} color="#6e4a2c" /><Part shape={poly([[-14, 60], [14, 60], [0, 170]])} color="#1e1a20" shade={0.3} /></X>} />
          ) : null}
        </JungleSet>
      </Stage>
      <Label text="CAPTURED" x={0.22} y={0.1} size={0.055} kind="box" at={sec(start)(425.8)} />
      <Label text="SACRIFICED" x={0.78} y={0.1} size={0.055} kind="box" at={sec(start)(426.8)} />
    </AbsoluteFill>
  );
};

// 427.8 "And for about 130 years, Tikal goes quiet."
export const TikalQuietShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.06, 1.0), y: 120 }} light={{ dir: [0.6, 0.4] }} vignette={0.75} vignetteColor="#0a0a18">
        <JungleSet mood="night" horizon={-300}>
          <TikalTemple x={0} y={-300} s={1.1} overgrown={ramp(t, 428, 431) * 0.6} z={-20} />
        </JungleSet>
      </Stage>
      <Label text="130 YEARS OF SILENCE" x={0.5} y={0.88} size={0.05} kind="box" at={sec(start)(429.0)} />
    </AbsoluteFill>
  );
};

// 431.4 "No new monuments. No big buildings."
export const NoMonumentsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ dir: [0.6, 0.4] }} vignette={0.65}>
        <PlazaSet mood="dusk" horizon={-200} overgrown={0.5}>
          <Part shape={roundRect(260, 60, 6)} color="#b9ae98" shade={0.22} x={-300} y={-370} z={1} />
          <Stela x={300} y={-400} h={360} z={1} />
          <Character {...MAYA_COMMONER(2)} x={-620} y={-760} s={1.5} z={2} look={0.45} expression={{ eyes: "half", mouth: "flat", brows: 0.4 }} pose={poses.sit(frame)} />
        </PlazaSet>
      </Stage>
      <Label text="NO NEW MONUMENTS" x={0.3} y={0.1} size={0.045} kind="box" at={sec(start)(431.6)} />
      <Label text="NO BIG BUILDINGS" x={0.72} y={0.18} size={0.045} kind="box" at={sec(start)(432.9)} />
    </AbsoluteFill>
  );
};

// 433.9 "But Tikal doesn't forget."
export const DoesntForgetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: 1.3, y: -10 }} light={{ dir: [0.6, 0.4] }} vignette={0.75} vignetteColor="#100608" bgBlur={8} bg={<JungleSet mood="dusk" horizon={-300}><TikalTemple x={300} y={-300} s={0.9} z={-20} /></JungleSet>}>
        <Character {...JAGUAR_WARRIOR(2)} x={-120} y={-1000} s={2.5} z={2} look={0.3} expression={{ eyes: "angry", mouth: "flat", brows: -0.9 }} pose={poses.idle(frame)} />
      </DepthStage>
      <Label text="TIKAL DOESN'T FORGET" x={0.76} y={0.14} size={0.045} kind="box" at={sec(start)(434.7)} />
    </AbsoluteFill>
  );
};

// 435.75 "In 690, a new Tikal king named Jasaw Chan K'awiil marches against Calakmul."
export const JasawMarchesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const a: [number, number] = [0.9, 0.5];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-260}>
          <Character {...MAYA_KING(0)} x={-200 + frame * 1.2} y={-860} s={1.8} z={3} look={0.45} expression={{ eyes: "angry", mouth: "smirk", brows: -0.6 }} pose={{ ...poses.walk(frame, 0.6), armF: a }} holdF={<Spear rot={upright(a)} length={760} tip="#2a2228" />} />
          {Array.from({ length: 7 }, (_, i) => (
            <Character key={i} {...(i % 2 ? JAGUAR_WARRIOR(i) : ITZA_WARRIOR(i + 1))} x={-1100 + i * 140 + frame * 1.2} y={-600 + (i % 2) * 20} s={0.75} z={2 - i * 0.01} look={0.45} expression={{ eyes: "angry", mouth: "flat", brows: -0.6 }} pose={{ ...poses.walk(frame + i * 6, 0.6), armF: a }} holdF={<Spear rot={upright(a)} length={600} tip="#2a2228" />} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="JASAW CHAN K'AWIIL" sub="KING OF TIKAL" x={0.72} y={0.1} size={0.05} kind="box" at={sec(start)(438.7)} />
    </AbsoluteFill>
  );
};

// 441.9 "He beats Calakmul's king, a man called Fire Claw, and carries home Calakmul's giant war god statue."
export const FireClawShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const won = t > 442.6;
  const carry = t > 445.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40, shake: hitAt(t, 442.6, 0.3) * 6 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-260}>
          {!carry ? (
            <>
              <Character {...MAYA_KING(0)} x={-300} y={-860} s={1.8} z={2} look={0.45} expression={won ? { eyes: "happy", mouth: "grin" } : { eyes: "angry", mouth: "shout", brows: -0.9 }} pose={won ? poses.armsUp(frame) : { ...poses.run(frame * 0.6), armF: [1.6, 0.2] }} />
              <X x={360} y={-820} rot={won ? -0.9 * ramp(t, 442.6, 443.0) : 0} z={1.9}>
                <Character {...MAYA_KING(1)} s={1.7} facing={-1} look={0.45} expression={won ? { eyes: "dead", mouth: "o" } : { eyes: "angry", mouth: "teeth", brows: -0.8 }} pose={won ? poses.scared(frame) : { ...poses.idle(frame), armF: [1.6, 0.2] }} />
              </X>
            </>
          ) : (
            <>
              <X x={-200 + (t - 445.3) * 120} y={-380} z={2}>
                <Line pts={[[-420, 0], [420, 0]]} width={16} color="#6e4a2c" />
                <Part shape={roundRect(460, 50, 8)} color="#8a5a32" shade={0.25} y={34} />
                <Character {...JAGUAR_WARRIOR(2)} y={60} s={1.25} look={0.4} expression={{ eyes: "angry", mouth: "teeth", brows: -0.9 }} pose={{ ...poses.sit(0), armF: [1.4, 0.6], armB: [1.2, 0.7] }} z={0.01} />
                <Glow y={400} rx={360} color="#ffd36a" alpha={0.25} additive z={0.005} />
              </X>
              {[-560, 140].map((x, i) => (
                <Character key={x} {...JAGUAR_WARRIOR(i)} x={x + (t - 445.3) * 120} y={-700} s={1.2} z={1.9} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.walk(frame + i * 8, 0.5), armF: [2.9, 0.1], armB: [2.9, 0.1], armsOverHead: true }} />
              ))}
            </>
          )}
        </JungleSet>
      </Stage>
      <Label text="FIRE CLAW" sub="KING OF CALAKMUL" x={0.76} y={0.1} size={0.045} kind="box" at={sec(start)(444.3)} until={sec(start)(445.3)} />
      <Label text="THE WAR GOD STATUE" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(446.6)} />
    </AbsoluteFill>
  );
};

// 448.5 "Today, Jasaw lies buried under Tikal's most famous pyramid, the Temple of the Great Jaguar."
export const GreatJaguarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cut = ramp(t, 449.4, 450.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 160 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-360}>
          <TikalTemple x={0} y={-360} s={1.2} z={-20} />
          {cut > 0 ? (
            <X y={-300} z={-15}>
              <Part shape={roundRect(360 * cut, 180 * cut, 10)} color="#2a2026" flat outline={5} y={60} />
              {cut > 0.8 ? (
                <>
                  <Part shape={roundRect(260, 30, 6)} color="#ece4cf" flat outline={3} y={20} z={0.01} />
                  <Part shape={circle(22)} color="#ece4cf" flat outline={3} x={-110} y={30} z={0.011} />
                  {[-60, 0, 60].map((x) => (
                    <Part key={x} shape={circle(14)} color="#3fa07a" flat outline={2.5} x={x} y={60} z={0.012} />
                  ))}
                </>
              ) : null}
            </X>
          ) : null}
        </JungleSet>
      </Stage>
      <Label text="TEMPLE OF THE GREAT JAGUAR" x={0.5} y={0.08} size={0.05} kind="box" at={sec(start)(452.7)} />
      <Label text="JASAW'S TOMB" x={0.78} y={0.82} size={0.045} kind="box" at={sec(start)(450.0)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Pakal ─────────────────────────

/** Palenque: the Temple of the Inscriptions and the palace tower in the jungle hills. */
const Palenque: React.FC<{ overgrown?: number }> = ({ overgrown = 0 }) => (
  <>
    <InscriptionsTemple x={-320} y={-300} s={0.9} overgrown={overgrown} z={-20} />
    <X x={560} y={-300} z={-21}>
      <MayaPyramid w={700} h={160} tiers={2} top={0.9} stair={false} templeW={0} color="#e6dcc4" />
      <X y={160}>
        {[0, 1, 2, 3].map((k) => (
          <X key={k} y={k * 90} z={k * 0.001}>
            <Part shape={roundRect(150 - k * 18, 90, 4)} color="#e8dfc8" shade={0.22} y={45} />
            <Part shape={roundRect(30, 46, 3)} color="#2a2026" flat outline={3} y={40} z={0.001} />
          </X>
        ))}
      </X>
    </X>
  </>
);

// 454.85 "Meanwhile, the city of Palenque has its own star."
export const PalenqueShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="dawn" horizon={-300}>
          <Palenque />
          <Jungle y={-320} w={6000} h={200} seed={18} z={-15} />
        </JungleSet>
      </Stage>
      <Label text="PALENQUE" sub="CHIAPAS, MEXICO" x={0.2} y={0.1} size={0.065} kind="box" at={sec(start)(456.1)} />
    </AbsoluteFill>
  );
};

const PAKAL = MAYA_KING(2);

// 457.95 "K'inich Janaab Pakal."
export const PakalPortraitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<JungleSet mood="dawn" horizon={-300}><Palenque /></JungleSet>}>
        <Character {...PAKAL} x={-120} y={-1000} s={2.5} z={2} look={0.3} expression={{ eyes: "half", mouth: "smirk", brows: -0.3 }} pose={poses.idle(frame)} />
      </DepthStage>
      <Label text="K'INICH JANAAB PAKAL" sub="KING OF PALENQUE" x={0.74} y={0.12} size={0.05} kind="box" at={sec(start)(458.2)} />
    </AbsoluteFill>
  );
};

// 459.7 "He becomes king at twelve, and he rules for sixty eight years."
export const PakalReignShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const age = ramp(t, 461.2, 463.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <PalaceRoom floorY={-560} throne>
          <Character {...PAKAL} x={0} y={-470} s={0.95 + age * 0.65} z={2} look={0.15} expression={age > 0.7 ? { eyes: "half", mouth: "smile", brows: 0.3, eyebags: true } : { eyes: "open", mouth: "smile" }} pose={poses.sit(frame)} />
        </PalaceRoom>
      </Stage>
      <Label text="KING AT 12" x={0.22} y={0.1} size={0.055} kind="box" at={sec(start)(460.5)} />
      <Label text="68 YEARS" x={0.78} y={0.1} size={0.065} kind="title" at={sec(start)(462.4)} />
    </AbsoluteFill>
  );
};

/** Temple of the Inscriptions in cross-section: inner stairway down to the crypt. */
const InscriptionsSection: React.FC<{ rubble?: number; open?: number; crypt?: boolean }> = ({ rubble = 0, open = 0, crypt = true }) => {
  const r = rng(4);
  const steps: [number, number][] = Array.from({ length: 16 }, (_, i) => [-240 + i * 30, 560 - i * 34]);
  const shown = Math.round(rubble * 40);
  return (
    <X>
      <MayaPyramid y={0} w={1300} h={560} tiers={9} top={0.46} stairW={0.14} templeW={520} templeH={210} doors={5} color="#e8dfc8" />
      <Part shape={poly([[-560, 0], [560, 0], [300, 560], [-300, 560]])} color="#9a8e72" flat outline={4} opacity={0.75} z={0.05} />
      <Line pts={[[-240, 580], [260, 40]]} width={40} color="#3a3236" z={0.06} />
      {steps.map(([x, y], i) => (
        <Line key={i} pts={[[x - 20, y], [x + 20, y]]} width={4} color="#6a5e58" z={0.061} />
      ))}
      {crypt ? (
        <X y={-40} x={240} z={0.06}>
          <Part shape={roundRect(360, 200, 10)} color="#2a2026" flat outline={5} />
          <Part shape={roundRect(240, 60, 6)} color="#bcb19a" shade={0.2} y={-40} z={0.001} />
          {open > 0 ? <Glow rx={260} color="#7ae0b0" alpha={0.4 * open} additive z={0.002} /> : null}
        </X>
      ) : null}
      {Array.from({ length: shown }, (_, i) => {
        const q = i / 40;
        const x = -240 + q * 500 + (r() - 0.5) * 20;
        const y = 580 - q * 540 + (r() - 0.5) * 20;
        return <Part key={`r${i}`} shape={blob([[-12, -8], [12, -10], [14, 8], [-10, 10]], 5)} color={i % 2 ? "#b9ae98" : "#a89e86"} shade={0.2} x={x} y={y} z={0.07 + i * 0.0001} />;
      })}
    </X>
  );
};

// 463.4 "When he dies at eighty, he's buried deep inside a pyramid."
export const PakalDiesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const toTomb = ramp(t, 464.8, 465.6, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      {toTomb < 1 ? (
        <Stage camera={{ zoom: 1.2, y: -120 }} light={{ pos: [0, 300] }} vignette={0.75} vignetteColor="#100608" wash={toTomb}>
          <PalaceRoom floorY={-460} dim={0.35} throne={false}>
            <X y={-200} rot={Math.PI / 2} x={160} z={2}>
              <Character {...PAKAL} s={1.4} look={0.3} shadow={false} expression={{ eyes: "closed", mouth: "flat", eyebags: true }} pose={{ armF: [0.1, 0.1], armB: [0.1, 0.1] }} />
            </X>
            <Part shape={roundRect(1000, 120, 10)} color="#cbbf9e" shade={0.22} y={-260} z={1.9} />
            {[-560, 560].map((x, i) => (
              <Flame key={x} x={x} y={-200} size={0.6} seed={i} z={2.2} />
            ))}
          </PalaceRoom>
        </Stage>
      ) : (
        <Stage camera={{ zoom: 1.0, y: 200 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
          <JungleSet mood="day" horizon={-160}>
            <X y={-160} z={-10}>
              <InscriptionsSection />
            </X>
          </JungleSet>
        </Stage>
      )}
      <Label text="DIES AT 80" x={0.24} y={0.1} size={0.055} kind="box" at={sec(start)(464.1)} until={sec(start)(465.4)} />
      <Label text="DEEP INSIDE" x={0.76} y={0.86} size={0.05} kind="box" at={sec(start)(465.5)} />
    </AbsoluteFill>
  );
};

// 466.8 "Then the Maya fill the stairway to his tomb with rubble, so nobody can get in."
export const RubbleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: 260, x: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-160}>
          <X y={-160} z={-10}>
            <InscriptionsSection rubble={ramp(t, 467.4, 470.0)} />
          </X>
        </JungleSet>
      </Stage>
      <Label text="STAIRWAY FILLED WITH RUBBLE" x={0.5} y={0.08} size={0.045} kind="box" at={sec(start)(468.9)} />
    </AbsoluteFill>
  );
};

// 471.05 "It works for almost 1,300 years."
export const ThirteenHundredShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 471.1, 474.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood={k > 0.5 ? "dusk" : "day"} horizon={-300}>
          <Palenque overgrown={k} />
          <Jungle y={-320} w={6000} h={200 + k * 200} seed={18} z={-15} />
        </JungleSet>
      </Stage>
      <Label text={`AD ${Math.round(683 + k * 1266)}`} x={0.5} y={0.1} size={0.07} kind="box" at={0} />
      <Label text="~1,300 YEARS" x={0.5} y={0.88} size={0.05} kind="box" at={sec(start)(472.4)} />
    </AbsoluteFill>
  );
};

// 474.3 "In 1949, a Mexican archaeologist named Alberto Ruz finds a hidden stairway under the temple floor."
export const RuzFindsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lift = ramp(t, 479.0, 480.4);
  const arm: [number, number] = [1.0 + lift * 0.6, 0.6];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -120 }} light={{ pos: [-300, 300] }} vignette={0.7} vignetteColor="#140a10">
        <PalaceRoom floorY={-460} dim={0.3} throne={false}>
          <X x={260} y={-470} z={1}>
            <Part shape={roundRect(420, 30, 6)} color="#2a2026" flat outline={4} opacity={lift} />
            <X x={-lift * 120} y={lift * 160} rot={-lift * 1.2}>
              <Part shape={roundRect(420, 40, 6)} color="#cbbf9e" shade={0.22} />
              {[-140, -50, 40, 130].map((x) => (
                <Part key={x} shape={circle(10)} color="#2a2026" flat outline={0} x={x} z={0.001} />
              ))}
            </X>
            {lift > 0.5 ? <Glow y={-40} rx={260} color="#ffd36a" alpha={0.3 * lift} additive z={0.01} /> : null}
          </X>
          <Character {...RUZ} x={-360} y={-860} s={1.75} z={2} look={0.45} expression={lift > 0.4 ? { eyes: "wide", mouth: "o", brows: 0.7 } : { eyes: "half", mouth: "flat", brows: 0.3 }} pose={{ ...poses.idle(frame), armF: arm, lean: 0.1 }} />
        </PalaceRoom>
      </Stage>
      <Label text="1949" x={0.16} y={0.1} size={0.065} kind="box" at={sec(start)(474.6)} />
      <Label text="ALBERTO RUZ" sub="ARCHAEOLOGIST" x={0.74} y={0.1} size={0.05} kind="box" at={sec(start)(477.4)} />
    </AbsoluteFill>
  );
};

/** The crypt: carved walls, the sarcophagus. */
const Crypt: React.FC<{ lid?: number; glow?: number; children?: React.ReactNode }> = ({ lid = 0, glow = 0, children }) => (
  <>
    <Gradient w={6000} h={4000} stops={[[0, "#3a3238"], [1, "#16121a"]]} z={-41} />
    {[-700, -350, 350, 700].map((x, i) => (
      <X key={x} x={x} y={120} z={-39}>
        <Part shape={roundRect(180, 480, 10)} color="#5a5250" shade={0.2} />
        <Part shape={circle(40)} color="#4a4240" flat outline={3} y={120} z={0.001} />
        <Part shape={roundRect(80, 160, 20)} color="#4a4240" flat outline={3} y={-40} z={0.001} />
      </X>
    ))}
    <Part shape={roundRect(6000, 1400, 0)} color="#2a2428" flat outline={0} y={-1160} z={-35} />
    <Line pts={[[-3000, -460], [3000, -460]]} width={6} z={-34.9} />
    <Sarcophagus x={0} y={-460} w={900} lid={lid} glow={glow} z={1} />
    {children}
  </>
);

// 481.4 "Then, in 1952, they lift a huge stone, and there he is."
export const LiftStoneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lid = ramp(t, 483.8, 485.4, Easing.inOut(Easing.cubic));
  const arm: [number, number] = [1.3, 0.8];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -100 }} light={{ pos: [0, 300] }} vignette={0.75} vignetteColor="#0a0608">
        <Crypt lid={lid} glow={ramp(t, 484.6, 485.6)}>
          {[-640, 640].map((x, i) => (
            <Character key={x} {...(i ? SCIENTIST(1) : RUZ)} x={x} y={-820} s={1.45} z={2} facing={x < 0 ? 1 : -1} look={0.45} expression={lid > 0.6 ? { eyes: "wide", mouth: "o", brows: 0.8 } : { eyes: "half", mouth: "teeth", brows: 0.4, sweat: true }} pose={{ ...poses.idle(frame, i), armF: arm, lean: 0.12 }} />
          ))}
        </Crypt>
      </Stage>
      <Label text="1952" x={0.16} y={0.1} size={0.065} kind="box" at={sec(start)(482.2)} />
      <Label text="THERE HE IS" x={0.74} y={0.1} size={0.055} kind="box" at={sec(start)(485.4)} />
    </AbsoluteFill>
  );
};

// 486.45 "Pakal, covered in jade, wearing a mask made of jade pieces."
export const JadeMaskShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12) }} light={{ pos: [0, 200] }} vignette={0.7} vignetteColor="#04100a">
        <Gradient w={6000} h={4000} stops={[[0, "#1a2a22"], [1, "#081008"]]} z={-41} />
        <JadeMask size={2.0 * pop(t, 486.6)} glow={1} z={1} />
        {Array.from({ length: 12 }, (_, i) => (
          <Part key={i} shape={circle(16)} color="#3fa07a" flat outline={3} x={Math.cos(i * 0.52) * 520} y={Math.sin(i * 0.52) * 420 - 40} z={0.5} />
        ))}
      </Stage>
      <Label text="COVERED IN JADE" x={0.22} y={0.1} size={0.05} kind="box" at={sec(start)(487.8)} />
      <Label text="JADE MOSAIC MASK" x={0.78} y={0.9} size={0.05} kind="box" at={sec(start)(489.0)} />
    </AbsoluteFill>
  );
};

// 490.85 "His stone coffin lid shows Pakal leaning back, surrounded by strange shapes."
export const LidShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), rot: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3238"], [1, "#1a1418"]]} z={-41} />
        <X rot={Math.PI / 2} z={1}>
          <PakalLid w={760} h={1500} />
        </X>
      </Stage>
      <Label text="THE SARCOPHAGUS LID" x={0.5} y={0.08} size={0.05} kind="box" at={sec(start)(491.5)} />
    </AbsoluteFill>
  );
};

// 496.0 "In the 1960s, a writer claimed it shows an astronaut flying a rocket."
export const AstronautClaimShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3238"], [1, "#1a1418"]]} z={-41} />
        <PakalLid x={340} y={60} w={600} h={980} rocket={ramp(t, 498.6, 500.0)} z={1} />
        <Character {...WRITER} x={-520} y={-820} s={1.8} z={2} look={0.45} expression={{ eyes: "wide", mouth: "grin", brows: 0.5 }} pose={poses.point(frame)} />
      </Stage>
      <Label text="1960s" x={0.14} y={0.1} size={0.06} kind="box" at={sec(start)(496.4)} />
      <Label text="AN ASTRONAUT?" x={0.32} y={0.22} size={0.05} kind="box" at={sec(start)(498.7)} />
    </AbsoluteFill>
  );
};

// 500.55 "But today, experts can read Maya symbols."
export const ExpertsReadShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper color="#e6d6ae">
          <GlyphColumn t={t} />
          <Character {...SCIENTIST(3)} x={-520} y={-860} s={1.8} z={2} look={0.45} expression={{ eyes: "open", mouth: "smile", brows: 0.2, gaze: [0.6, 0] }} pose={{ ...poses.idle(frame), armF: [1.5, 0.3] }} />
        </Paper>
      </Stage>
      <Label text="WE CAN READ IT NOW" x={0.62} y={0.1} size={0.05} kind="box" at={sec(start)(501.9)} />
    </AbsoluteFill>
  );
};
const GlyphColumn: React.FC<{ t: number }> = ({ t }) => (
  <X x={360} y={-40} z={1}>
    {Array.from({ length: 8 }, (_, i) => {
      const hi = ramp(t, 501.0 + i * 0.2, 501.2 + i * 0.2);
      return (
        <X key={i} x={(i % 2) * 150 - 75} y={240 - Math.floor(i / 2) * 150} z={i * 0.001}>
          <Glyph seed={i + 300} size={130} paint={mixHex("#e8dcc0", "#f6e6a0", hi)} />
          {hi > 0 ? <Glow rx={100} color="#fff2a0" alpha={0.3 * hi} additive z={-0.01} /> : null}
        </X>
      );
    })}
  </X>
);

// 503.4 "It shows Pakal at the moment of death, sinking into the underworld."
export const SinkingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sink = ramp(t, 505.6, 507.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ pos: [0, 200] }} vignette={0.75} vignetteColor="#0a0408">
        <Underworld floorY={-200}>
          <Part shape={blob([[-600, -200], [-400, 40], [0, 120], [400, 40], [600, -200]], 8)} color="#3a1a2a" shade={0.2} z={1} />
          {[-300, -100, 100, 300].map((x) => (
            <Part key={x} shape={poly([[x - 40, 60], [x, -60], [x + 40, 60]])} color="#ece4cf" flat outline={3} y={60} z={1.01} />
          ))}
          <X x={0} y={160 - sink * 360} rot={0.6} z={1.005}>
            <Character {...PAKAL} s={1.1} look={0.4} shadow={false} expression={{ eyes: "closed", mouth: "o", brows: 0.4 }} pose={{ armF: [1.6, 0.4], armB: [1.2, 0.4] }} />
          </X>
        </Underworld>
      </Stage>
      <Label text="THE MOMENT OF DEATH" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(504.6)} />
      <Label text="INTO THE UNDERWORLD" x={0.5} y={0.9} size={0.05} kind="box" at={sec(start)(506.3)} />
    </AbsoluteFill>
  );
};

// 507.35 "Above him rises the tree of life."
export const TreeOfLifeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3238"], [1, "#1a1418"]]} z={-41} />
        <PakalLid w={620} h={1000} highlight={ramp(t, 508.3, 509.2)} z={1} />
      </Stage>
      <Label text="THE TREE OF LIFE" x={0.78} y={0.2} size={0.05} kind="box" at={sec(start)(508.6)} />
    </AbsoluteFill>
  );
};

// 509.9 "Not a rocket. A tree."
export const NotRocketShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rocket = 1 - ramp(t, 510.4, 510.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3238"], [1, "#1a1418"]]} z={-41} />
        <PakalLid w={620} h={1000} rocket={rocket} highlight={ramp(t, 511.4, 511.9)} z={1} />
        <Ceiba x={680} y={-520} h={760} s={pop(t, 511.5)} z={2} />
      </Stage>
      <Label text="NOT A ROCKET" x={0.22} y={0.12} size={0.055} kind="stamp" rotate={-6} at={sec(start)(510.0)} />
      <Label text="A TREE." x={0.78} y={0.12} size={0.07} kind="title" at={sec(start)(511.5)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── collapse begins ─────────────────────────

// 512.8 "And then, in the 800s, it all starts to fall apart."
export const FallApartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const crack = ramp(t, 515.8, 516.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40, shake: crack > 0 && crack < 1 ? 5 : 0 }} light={{ dir: [0.6, 0.4] }} vignette={0.7} vignetteColor="#140a10">
        <PlazaSet mood="storm" horizon={-200}>
          <X x={0} y={-420} z={1}>
            <Stela h={720} />
            {crack > 0 ? <Line pts={[[-40, 700], [20, 520 - 0 * crack], [-30, 380], [30, 700 - 600 * crack]]} width={10} color="#2a2026" z={0.05} /> : null}
          </X>
        </PlazaSet>
      </Stage>
      <Label text="AD 800s" x={0.2} y={0.1} size={0.065} kind="box" at={sec(start)(514.1)} />
      <Label text="FALLING APART" x={0.76} y={0.12} size={0.055} kind="box" at={sec(start)(516.0)} />
    </AbsoluteFill>
  );
};

// 517.05 "In the south, one great city after another stops building."
export const CitiesStopShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 130;
  const center: [number, number] = [-90.0, 17.0];
  const south: [number, number][] = [[-89.62, 17.22], [-89.81, 18.1], [-92.05, 17.48], [-89.14, 14.84], [-89.12, 16.76], [-90.97, 16.9], [-91.26, 17.17], [-90.18, 16.44], [-89.25, 17.13], [-90.06, 16.51]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <MesoMap ppd={ppd} center={center} maya={1} />
        {south.map(([lo, la], i) => {
          const [x, y] = mesoXY(lo, la, ppd, center);
          const off = ramp(t, 517.8 + i * 0.22, 518.0 + i * 0.22);
          return <Part key={i} shape={circle(26)} color={mixHex("#3fa07a", "#5a5250", off)} flat outline={3.5} x={x} y={y} s={1 - off * 0.2} z={1 + i * 0.001} />;
        })}
      </Stage>
      <Label text="THE SOUTH GOES DARK" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(518.3)} />
    </AbsoluteFill>
  );
};

// 520.65 "The last known Long Count date is carved in the year 909."
export const LastDateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tap = Math.max(0, Math.sin(frame * 0.6));
  const arm: [number, number] = [1.6 - tap * 0.4, 0.5];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [0.6, 0.4] }} vignette={0.7} vignetteColor="#140a10" bgBlur={6} bg={<PlazaSet mood="dusk" horizon={-200} overgrown={0.3} />}>
        <X x={300} y={-640} z={1}>
          <Stela h={760} />
          {[0, 1, 2, 3, 4].map((i) => (
            <MayaNumber key={i} n={[10, 4, 0, 0, 0][i]} size={0.35 * pop(t, 521.6 + i * 0.3)} y={620 - i * 110} color="#6a5e48" z={0.1} />
          ))}
        </X>
        <Character {...MAYA_COMMONER(3)} x={-300} y={-900} s={1.9} z={2} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.5 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<X rot={Math.PI / 2}><Line pts={[[0, -20], [0, 90]]} width={10} color="#6e4a2c" /><Part shape={poly([[-10, 90], [10, 90], [0, 130]])} color="#3a3a44" flat outline={3} /></X>} />
      </DepthStage>
      <Label text="THE LAST LONG COUNT DATE" x={0.3} y={0.1} size={0.045} kind="box" at={sec(start)(521.5)} />
      <Label text="AD 909" x={0.78} y={0.1} size={0.07} kind="title" at={sec(start)(523.8)} />
    </AbsoluteFill>
  );
};

// 525.0 "Then, silence."
export const SilenceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 40 }} light={{ dir: [0.6, 0.3] }} vignette={0.85} vignetteColor="#0a0a10">
        <PlazaSet mood="dusk" horizon={-200} overgrown={0.4} />
      </Stage>
    </AbsoluteFill>
  );
};

// 527.4 "Cities like Tikal and Palenque slowly empty, and the jungle swallows them."
export const JungleSwallowsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const grow = ramp(t, 529.2, 532.4, Easing.inOut(Easing.quad));
  const fade = ramp(t, 532.4, 533.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 0.95), y: 140 }} light={{ dir: [0.6, 0.3] }} vignette={0.75} vignetteColor="#0a0a10" wash={fade}>
        <JungleSet mood="dusk" horizon={-300}>
          <TikalTemple x={-360} y={-300} s={1.1} overgrown={0.3 + grow * 0.7} z={-20} />
          <InscriptionsTemple x={520} y={-300} s={0.55} overgrown={0.3 + grow * 0.7} z={-21} />
          <Jungle y={-320} w={6000} h={200 + grow * 900} seed={19} z={-15} />
          <X y={700} z={5}>
            <Vines w={2400} n={14} len={200 + grow * 700} seed={7} />
          </X>
        </JungleSet>
      </Stage>
      <Label text="TIKAL" x={0.3} y={0.86} size={0.04} kind="box" at={sec(start)(528.0)} />
      <Label text="PALENQUE" x={0.72} y={0.86} size={0.04} kind="box" at={sec(start)(528.8)} />
    </AbsoluteFill>
  );
};
