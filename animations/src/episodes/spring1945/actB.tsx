import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Line, Glow, Wash, Gradient, QuestionMark, Ampoule, ChocolateStick, Magnifier,
  roundRect, roundPoly, circle, blob, poly, ellipse, ramp, push, hitAt, absT, type ShotProps,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  ZeroFighter, Warship, JapanMap, Sunburst, Kikumon, Ground, Sky, Cloud, Calendar, Clock, PlankWall, Floorboards, Desk, Flag,
  SpeedLines, WoodenSchool, SakuraTree, Petals, Flame, Smoke, Burst, Hinomaru, LowTable, Sea,
} from "../../kit/env";
import { Airfield, OkinawaSea, Backdrop, ObjectBack, WarRoom, TatamiRoom } from "./sets";
import { PILOT, GENERAL, NAVY_OFFICER, SOLDIER, UMEDA, GIRL, TEACHER, FATHER, RESEARCHER } from "./cast";
import { sec, pop, CJK, scr, GrowArrow, SpeechBubble } from "./common";
import { Bomb, routeAt } from "./actA";

// ───────────────────────── D · the tokko ─────────────────────────

// D1 74.85 "Now jump to the end of 1944."
export const EndOf1944Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const flipping = t > 75.3 && t < 76.3;
  const flip = flipping ? ((t - 75.3) * 5) % 1 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ pos: [-300, 400] }} vignette={0.6}>
        <PlankWall w={4000} h={2400} y={600} color="#6e5240" z={-40} />
        <Glow x={-200} y={200} rx={900} color="#ffcf7a" alpha={0.18} additive z={-38} />
        <Calendar y={60} s={2.0} crossed={t > 76.3 ? 20 : Math.floor(ramp(t, 75.3, 76.3) * 20)} flip={flip} z={1} />
      </Stage>
      {t > 76.3 ? <Label text="DECEMBER 1944" x={0.5} y={0.5 - (60 + 210 - 40) / 1080} size={0.045} at={0} /> : null}
      <Label text="END OF 1944" x={0.5} y={0.12} size={0.085} kind="title" at={sec(start)(76.27)} />
    </AbsoluteFill>
  );
};

// D2 77.55 "Japan is losing the war."
export const LosingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const mx = 120;
  const my = 120;
  const isl: [number, number][] = [[-200, -10], [-250, -90], [-310, -170], [-430, -330]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), x: 0, y: 120 }} light={{ dir: [-0.6, 0.8] }}>
        <Part shape={roundRect(5000, 3000, 0)} color="#7fb6d6" flat outline={0} z={-1} />
        <JapanMap x={mx} y={my} />
        {isl.map(([x, y], i) => {
          const fall = ramp(t, 78.2 + i * 0.18, 78.5 + i * 0.18, Easing.in(Easing.quad));
          return (
            <X key={i} x={mx + x + 20} y={my + y + 10} rot={-fall * 1.5} z={2}>
              <Line pts={[[0, 0], [0, 90]]} width={6} z={0} />
              <X x={34} y={74} z={0.01}>
                <Part shape={roundRect(70, 46, 3)} color="#ffffff" flat outline={4} />
                <Part shape={circle(12)} color="#c8262f" flat outline={0} z={0.001} />
              </X>
            </X>
          );
        })}
        <GrowArrow pts={[[1000, -560], [600, -420], [mx - 330, my - 380]]} k={ramp(t, 77.8, 78.9)} z={3} />
        <GrowArrow pts={[[1100, -100], [700, -60], [mx + 60, my - 30]]} k={ramp(t, 78.2, 79.2)} z={3} />
      </Stage>
      <Label text="LOSING" x={0.76} y={0.18} size={0.08} kind="stamp" rotate={-8} at={sec(start)(78.43)} />
    </AbsoluteFill>
  );
};

// D3 79.45 "So its commanders turn to a desperate idea."
export const DesperateShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const slam = hitAt(t, 81.1, 0.5);
  const raise = ramp(t, 80.6, 81.0) * (1 - ramp(t, 81.0, 81.12));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05 + slam * 0.04, y: -40, shake: slam * 10 }} light={{ pos: [0, 300] }} shadowMul={[0.55, 0.5, 0.6]} vignette={0.7}>
        <WarRoom swing={Math.sin(frame * 0.12) * 0.05 + slam * 0.2}>
          <Character {...GENERAL(1)} x={-470} y={-440} s={1.2} z={1} look={0.5} expression={{ eyes: "open", mouth: "frown", brows: 0.7, sweat: true }} pose={poses.think} />
          <Character
            {...GENERAL(0)}
            x={0}
            y={-400}
            s={1.3}
            z={1.01}
            look={0.1}
            expression={t > 81.0 ? { eyes: "angry", mouth: "teeth", brows: -0.8 } : { eyes: "open", mouth: "frown", brows: 0.6, sweat: true }}
            pose={{ armF: [1.2 + raise * 1.2 - slam * 0.3, 0.9], armB: [-0.3, -0.2] }}
          />
          <Character {...NAVY_OFFICER(1)} x={470} y={-440} s={1.2} z={1} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "wavy", brows: 0.7, sweat: true }} pose={poses.handsOnHips} />
        </WarRoom>
      </Stage>
      <Label text="DESPERATE" x={0.5} y={0.14} size={0.08} kind="stamp" rotate={-6} at={sec(start)(81.1)} />
    </AbsoluteFill>
  );
};

/** Classroom / briefing blackboard. Origin = centre. */
const Blackboard: React.FC<{ w?: number; h?: number; y?: number; z?: number }> = ({ w = 1700, h = 860, y = 40, z = -10 }) => (
  <X y={y} z={z}>
    <Part shape={roundRect(w + 60, h + 60, 10)} color="#7a5232" shade={0.2} />
    <Part shape={roundRect(w, h, 4)} color="#2f4a3a" flat outline={6} z={0.001} />
    <Glow x={-w * 0.2} y={h * 0.1} rx={w * 0.4} ry={h * 0.4} color="#6a8a76" alpha={0.25} z={0.002} />
  </X>
);

// D4 82.2 "Fill planes with bombs, and crash them into enemy ships."
export const PlanDiagramShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const boom = t > 85.45 ? (t - 85.45) / 0.7 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), shake: hitAt(t, 85.45, 0.4) * 8 }} light={{ dir: [-0.6, 0.8] }}>
        <PlankWall w={4000} h={2400} y={600} color="#5e4a3a" z={-40} />
        <Blackboard />
        <X x={-560} y={140} s={0.55 * pop(t, 82.69)} z={1}>
          <ZeroFighter gear={false} />
        </X>
        <Line pts={[[-320, 140], [-240, 140]]} width={12} color="#f4f1ea" z={1} opacity={t > 83.1 ? 1 : 0} />
        <Line pts={[[-280, 100], [-280, 180]]} width={12} color="#f4f1ea" z={1} opacity={t > 83.1 ? 1 : 0} />
        <Bomb x={-90} y={140} s={0.9 * pop(t, 83.25)} z={1} />
        <GrowArrow pts={[[-480, -40], [-160, -160], [260, -150]]} k={ramp(t, 84.2, 84.9)} color="#fe5649" width={20} z={2} />
        <X x={500} y={-120} s={pop(t, 85.07)} z={1}>
          <Warship kind="destroyer" len={420} hit={t > 85.45 ? 1 : 0} />
        </X>
        {boom > 0 && boom < 1.6 ? <Burst x={430} y={-60} t={boom} size={1.1} z={3} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};

/** Spiral of wind streaks. */
const WindSwirl: React.FC<{ x?: number; y?: number; s?: number; rot?: number; color?: string; z?: number }> = ({ x = 0, y = 0, s = 1, rot = 0, color = "#ffffff", z = 0 }) => (
  <X x={x} y={y} s={s} rot={rot} z={z}>
    {[0, 1, 2].map((i) => (
      <Line
        key={i}
        pts={Array.from({ length: 30 }, (_, k) => {
          const a = (k / 29) * Math.PI * 1.6 + i * ((Math.PI * 2) / 3);
          const r = 40 + k * 7;
          return [Math.cos(a) * r, Math.sin(a) * r * 0.6] as [number, number];
        })}
        width={10}
        color={color}
        opacity={0.75}
        smooth
      />
    ))}
  </X>
);

// D5 86.1 'The world calls these pilots kamikaze, the "wind of the gods."'
export const KamikazeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [0.6, 0.6] }} vignette={0.6}>
        <Backdrop mood="dusk" horizon={-300} kaimon={false} clouds={false} />
        <Sea w={5000} h={1400} y={-300} color="#4a5a8a" z={-30} />
        <Cloud x={-700} y={280} w={520} seed={2} color="#e8a8a8" z={-20} />
        <Cloud x={720} y={360} w={460} seed={6} color="#e8a8a8" z={-20} />
        <SpeedLines w={2600} h={1000} n={16} speed={30} color="#f6d2c0" z={-12} />
        <WindSwirl x={-560} y={60} s={1.4} rot={-frame * 0.03} color="#fbe1d4" z={-11} />
        <WindSwirl x={620} y={-60} s={1.0} rot={-frame * 0.04 + 1} color="#fbe1d4" z={-11} />
        {[0, 1, 2].map((i) => (
          <X key={i} x={-200 + i * 260 + frame * 1.5} y={-80 + i * 70} s={0.28} z={1}>
            <ZeroFighter gear={false} spin={1} />
          </X>
        ))}
      </Stage>
      <Label text="KAMIKAZE" x={0.5} y={0.16} size={0.1} kind="title" at={sec(start)(87.75)} />
      <Label text="神風" sub="WIND OF THE GODS" x={0.5} y={0.42} size={0.13} color="#ffffff" at={sec(start)(88.96)} font={CJK} />
    </AbsoluteFill>
  );
};

// D6 90.45 "In Japan, they're called tokko, special attack units."
export const TokkoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 20 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="day" planes>
          {[0, 1, 2, 3, 4].map((i) => {
            const salute = t > 92.0 + i * 0.08;
            return (
              <Character
                key={i}
                {...PILOT(i)}
                x={-560 + i * 280}
                y={-560}
                s={1.05}
                z={2 + i * 0.01}
                look={0.25}
                expression={{ eyes: "open", mouth: "flat", brows: -0.1 }}
                pose={salute ? poses.salute : poses.idle(frame, i)}
              />
            );
          })}
        </Airfield>
      </Stage>
      <Label text="特攻" sub="TOKKO · SPECIAL ATTACK UNITS" x={0.5} y={0.17} size={0.12} color="#ffffff" at={sec(start)(92.12)} font={CJK} />
    </AbsoluteFill>
  );
};

// D7 94.45 "Most of the pilots are teenagers or in their early twenties."
export const TeenagersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ages = ["17", "18", "19", "22"];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="day" planes={false} trees={false} />
        {ages.map((_, i) => (
          <Character
            key={i}
            {...PILOT(i)}
            x={-630 + i * 420}
            y={-60 - 308 * 1.55}
            s={1.55}
            z={2 + i * 0.01}
            look={0.3}
            facing={i < 2 ? 1 : -1}
            expression={{ eyes: i === 2 ? "half" : "open", mouth: i === 1 ? "smile" : "flat", brows: 0.2 * i }}
            pose={poses.idle(frame, i)}
          />
        ))}
      </Stage>
      {ages.map((a, i) => (
        <Label key={a} text={a} x={0.5 + (-630 + i * 420) / 1920} y={0.13} size={0.07} kind="box" at={sec(start)(95.58 + i * 0.25)} />
      ))}
    </AbsoluteFill>
  );
};

// D8 97.8 "Many have barely learned to fly."
export const BarelyFlyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wob = 0.12 + ramp(t, 98.4, 98.9) * 0.18;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40 }} light={{ dir: [-0.6, 0.8] }}>
        <Backdrop mood="day" horizon={-380} kaimon={false} />
        <X y={-380} z={-30}>
          <Ground w={5000} h={1600} color="#8db35e" far="#a3c473" pebbles={0} tufts={10} />
        </X>
        <ZeroFighter
          x={40 + Math.sin(frame * 0.07) * 60}
          y={20 + Math.sin(frame * 0.11) * 50}
          rot={Math.sin(frame * 0.17) * wob}
          s={1.5}
          gear
          spin={1}
          z={1}
          pilot={<Character {...PILOT(2)} y={-78} s={0.38} shadow={false} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true }} pose={{ armF: [0.6, 0.6], armB: [-0.2, -0.1] }} />}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// D9 99.9 "And the flight to Okinawa, where the American fleet is waiting, takes two hours or more."
export const FlightTimeShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const route = ramp(t, 100.3, 103.3, (x) => x);
  const [px, py, ang] = routeAt(Math.max(0.02, route));
  const mx = 230;
  const my = 200;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, x: 0, y: 0 }} light={{ dir: [-0.6, 0.8] }}>
        <JapanMap x={mx} y={my} route={route} />
        {[[-80, -60], [80, -110], [-20, -170]].map(([fx, fy], i) => (
          <X key={i} x={mx - 430 + fx} y={my - 330 + fy} s={pop(t, 101.68 + i * 0.12)} z={1.5}>
            <Warship kind={i === 1 ? "carrier" : "destroyer"} len={i === 1 ? 260 : 170} />
          </X>
        ))}
        <X x={mx + px} y={my + py} rot={ang} s={0.16} z={2}>
          <ZeroFighter gear={false} spin={1} />
        </X>
        <Clock x={560} y={160} r={110} speed={6} z={2} s={pop(t, 103.33)} />
      </Stage>
      <Label text="OKINAWA" {...scr(mx - 430 - 190, my - 330 + 40)} size={0.04} at={sec(start)(100.6)} />
      <Label text="2+ HOURS" x={0.5 + 560 / 1920} y={0.5 - (160 - 190) / 1080} size={0.065} kind="box" at={sec(start)(103.6)} />
    </AbsoluteFill>
  );
};

// D10 104.7 "For the generals, a sleepy pilot means a wasted plane."
export const SleepyPilotShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const nod = ramp(t, 105.9, 106.8);
  const grey = ramp(t, 107.4, 107.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), x: -200, y: 40, shake: hitAt(t, 107.4, 0.4) * 6 }} light={{ dir: [-0.6, 0.8] }}>
        <OkinawaSea mood="day" horizon={-200} />
        <ZeroFighter
          x={-260}
          y={-120 + Math.sin(frame * 0.05) * 8}
          s={2.3}
          gear={false}
          spin={1}
          z={1}
          pilot={
            <Character
              {...PILOT(0)}
              y={-78}
              s={0.38}
              shadow={false}
              look={0.5}
              expression={{ eyes: nod > 0.6 ? "closed" : "half", mouth: nod > 0.3 ? "o" : "flat", brows: 0.4, eyebags: true }}
              pose={{ armF: [0.6, 0.6], armB: [-0.2, -0.1], headTilt: -nod * 0.35 }}
            />
          }
        />
        <Wash width={4000} height={3000} color="#4a4a54" alpha={grey * 0.45} z={20} />
      </Stage>
      {nod > 0.5 ? <Label text="Zzz" x={0.36} y={0.2} size={0.07} rotate={-12} at={0} /> : null}
      <Label text="WASTED" x={0.76} y={0.6} size={0.13} kind="stamp" rotate={-10} at={sec(start)(107.39)} />
    </AbsoluteFill>
  );
};

// D11 108.65 "So how do they keep them sharp?"
export const KeepSharpShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.12, y: -20 }} light={{ pos: [0, 300] }} shadowMul={[0.55, 0.5, 0.6]} vignette={0.7}>
        <WarRoom swing={Math.sin(frame * 0.1) * 0.04}>
          <Character {...GENERAL(2)} x={-260} y={-420} s={1.3} z={1} look={0.5} expression={{ eyes: "squint", mouth: "flat", brows: -0.3, gaze: [0.6, 0] }} pose={poses.think} />
          <Character {...NAVY_OFFICER(0)} x={280} y={-420} s={1.3} z={1} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smirk", brows: -0.2 }} pose={poses.think} />
          <QuestionMark x={10} y={260} s={1.1 * pop(t, 109.2)} rot={0.1} z={20} />
        </WarRoom>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── E · clue 1: the chocolate ─────────────────────────

/** Warm paper card background with a soft sunburst. */
const CardBack: React.FC<{ color?: string; alt?: string }> = ({ color = "#e9c98a", alt = "#e1bd7a" }) => (
  <>
    <Sunburst r={2600} rays={20} color={color} alt={alt} speed={0.4} z={-40} />
    <Glow rx={800} ry={600} color="#fff3d6" alpha={0.3} additive z={-39} />
  </>
);

// E1 110.25 "The first clue comes from a schoolgirl, only about 14."
export const ClueOneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <CardBack />
        <Character {...UMEDA} x={-80} y={-600} s={1.3} z={2} look={0.4} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={poses.idle(frame)} />
        <X x={420} y={140} s={pop(t, 112.31)} z={3}>
          <Magnifier r={120} rot={-0.5} />
        </X>
      </Stage>
      <Label text="CLUE #1" x={0.2} y={0.14} size={0.08} kind="stamp" rotate={-8} at={sec(start)(110.77)} />
      <Label text="AGE 14" x={0.72} y={0.34} size={0.07} kind="box" at={sec(start)(112.76)} />
    </AbsoluteFill>
  );
};

// E2 113.75 "Her name is Umeda Kazuko."
export const UmedaNameShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const s = 2.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <CardBack color="#d9b0a0" alt="#d0a494" />
        <Character {...UMEDA} x={-380} y={10 - 308 * s} s={s} z={2} look={0.45} expression={{ eyes: "open", mouth: "smile", brows: 0.1, blush: true }} pose={poses.idle(frame)} />
      </Stage>
      <Label text="UMEDA KAZUKO" sub="SCHOOLGIRL · 14" x={0.66} y={0.36} size={0.075} kind="title" at={sec(start)(114.5)} />
    </AbsoluteFill>
  );
};

/** Girls' school in Ibaraki, February 1945 (plum trees). */
const SchoolYard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <Backdrop mood="day" horizon={-160} kaimon={false} />
    <X y={-160} z={-30}>
      <Ground w={5000} h={1600} color="#c2b08a" far="#cfc09a" pebbles={12} tufts={4} tuftColor="#8a8a5a" />
    </X>
    <WoodenSchool x={140} y={-150} w={1500} h={330} z={-20} />
    <SakuraTree x={-760} y={-200} h={380} seed={7} bloom="#f8e8ee" z={-18} />
    <SakuraTree x={900} y={-210} h={340} seed={3} bloom="#f8e8ee" z={-18} />
    {children}
  </>
);

// E3 115.8 "In February 1945, she moves to a girls' school in Ibaraki, near Osaka."
export const SchoolShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const walk = ramp(t, 116.0, 120.6, (x) => x);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, x: interpolate(walk, [0, 1], [-120, 60]), y: 40 }} light={{ dir: [-0.7, 0.6] }}>
        <SchoolYard>
          <Character
            {...UMEDA}
            x={interpolate(walk, [0, 1], [-820, 120])}
            y={-520}
            s={0.95}
            z={2}
            look={0.5}
            expression={{ eyes: "open", mouth: "smile" }}
            pose={walk < 1 ? { ...poses.walk(frame, 0.9), armB: [0.3, 0.6] } : poses.idle(frame)}
            holdB={<Part shape={roundRect(110, 90, 20)} color="#8a3a4a" shade={0.2} y={-40} />}
          />
        </SchoolYard>
      </Stage>
      <Label text="FEB 1945" x={0.18} y={0.13} size={0.07} kind="box" at={sec(start)(116.06)} />
      <Label text="IBARAKI" sub="NEAR OSAKA" x={0.78} y={0.14} size={0.07} kind="title" at={sec(start)(119.55)} />
    </AbsoluteFill>
  );
};

/** School desk with bench (small). Origin = floor centre. */
const SchoolDesk: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(260, 24, 6)} color="#9d6e3c" shade={0.2} y={150} />
    <Part shape={roundRect(20, 150, 4)} color="#7a5232" shade={0.2} x={-100} y={75} z={-0.01} />
    <Part shape={roundRect(20, 150, 4)} color="#7a5232" shade={0.2} x={100} y={75} z={-0.01} />
  </X>
);

/** Classroom: plank wall, blackboard, floor. */
const Classroom: React.FC<{ floorY?: number; children?: React.ReactNode; dim?: number }> = ({ floorY = -460, children, dim = 0 }) => (
  <>
    <PlankWall w={4000} h={2400} y={floorY + 1200} color="#a07a52" z={-40} />
    <X x={-80} y={floorY + 620} z={-39}>
      <Part shape={roundRect(1060, 420, 6)} color="#6e4a2c" shade={0.2} />
      <Part shape={roundRect(1000, 360, 4)} color="#2f4a3a" flat outline={5} z={0.001} />
    </X>
    <X x={760} y={floorY + 640} z={-39}>
      <Part shape={roundRect(300, 340, 6)} color="#d9eef4" flat outline={8} />
      <Line pts={[[0, -170], [0, 170]]} width={7} z={0.001} />
      <Line pts={[[-150, 0], [150, 0]]} width={7} z={0.001} />
    </X>
    <Glow x={760} y={floorY + 300} rx={900} ry={700} color="#fff1c8" alpha={0.25} additive z={-38} />
    <Floorboards w={4000} h={1400} y={floorY} color="#8a6440" z={-36} />
    {children}
    {dim > 0 ? <Wash width={4000} height={3000} color="#1a1420" alpha={dim} z={30} /> : null}
  </>
);

// E4 121.35 "But there are almost no lessons."
export const NoLessonsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ pos: [700, 300] }}>
        <Classroom>
          {[-560, -160, 240].map((x, i) => (
            <SchoolDesk key={x} x={x} y={-600} s={1.1} z={3 + i * 0.01} />
          ))}
          <Character {...UMEDA} x={560} y={-560} s={1.15} z={2} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "wavy", brows: 0.7, gaze: [0.8, 0.3] }} pose={poses.shrug(ramp(t, 122.5, 122.9))} />
          <QuestionMark x={420} y={260} s={0.8 * pop(t, 122.73)} rot={-0.12} z={5} />
        </Classroom>
      </Stage>
      <Label text="NO LESSONS" x={0.42} y={0.5 - (-460 + 620 + 40 + 40) / 1080} size={0.06} color="#f4f1ea" at={sec(start)(122.53)} />
    </AbsoluteFill>
  );
};

/** Ration crate stamped with the rising sun. Origin = bottom centre. */
const Crate: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(220, 150, 8)} color="#b98a54" shade={0.2} y={75} />
    <Line pts={[[-110, 75], [110, 75]]} width={5} color="#7a5232" z={0.001} />
    <Hinomaru y={75} r={30} z={0.002} />
  </X>
);

/** Long work table. Origin = floor centre. */
const WorkTable: React.FC<{ x?: number; y?: number; w?: number; z?: number }> = ({ x = 0, y = 0, w = 1200, z = 0 }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(w, 34, 6)} color="#c9a274" shade={0.2} y={230} />
    <Part shape={roundRect(w - 60, 210, 4)} color="#8a6440" shade={0.25} y={110} z={-0.01} />
  </X>
);

// E5 123.55 "The school has been turned into a food factory for the army."
export const FoodFactoryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -40 }} light={{ pos: [700, 300] }}>
        <Classroom>
          <X x={-80} y={420} z={-37}>
            <Part shape={roundRect(300, 200, 4)} color="#f6f2ea" shade={0.12} />
            <Hinomaru r={56} rim={false} z={0.01} />
          </X>
          {[0, 1, 2].map((i) => (
            <Character
              key={i}
              {...(i === 1 ? UMEDA : GIRL(i))}
              x={-520 + i * 330}
              y={-520}
              s={1.0}
              z={1 + i * 0.01}
              look={0.3}
              expression={{ eyes: "half", mouth: "flat", brows: 0.2 }}
              pose={{ armF: [1.3 + Math.sin(frame * 0.4 + i) * 0.15, 0.5], armB: [1.1, 0.6] }}
            />
          ))}
          <WorkTable x={-200} y={-640} w={1300} z={4} />
          {[-560, -260, 40].map((x, i) => (
            <ChocolateStick key={x} x={x} y={-380} s={0.6} wrap={i === 1 ? 1 : 0} z={4.1} />
          ))}
          <Character {...SOLDIER(1)} x={700} y={-560} s={1.15} z={2} facing={-1} look={0.4} expression={{ eyes: "squint", mouth: "flat", brows: -0.4 }} pose={poses.handsOnHips} />
          {[0, 1, 2].map((i) => (
            <Crate key={i} x={600 + (i % 2) * 230 - 110} y={-620 + Math.floor(i / 2) * 150} s={1} z={5 + i * 0.01} />
          ))}
        </Classroom>
      </Stage>
      <Label text="ARMY FOOD FACTORY" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(125.3)} />
    </AbsoluteFill>
  );
};

// E6 126.5 "Her job is to wrap chocolate."
export const WrapChocolateShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wrap = ramp(t, 127.0, 128.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.25, y: -80 }} light={{ pos: [700, 300] }}>
        <Classroom>
          <Character {...UMEDA} x={-80} y={-640} s={1.3} z={1} look={0.15} expression={{ eyes: "open", mouth: "flat", brows: 0.1, gaze: [0.2, -0.8] }} pose={{ armF: [1.1 + Math.sin(frame * 0.6) * 0.1, 0.9], armB: [-1.1, -0.9] }} />
          <WorkTable x={0} y={-640} w={1400} z={4} />
          <ChocolateStick x={-60} y={-370} s={1.1} wrap={wrap} z={4.1} />
          {[0, 1, 2].map((i) => (
            <ChocolateStick key={i} x={430} y={-375 + i * 26} s={0.8} wrap={1} z={4.1 + i * 0.01} />
          ))}
        </Classroom>
      </Stage>
    </AbsoluteFill>
  );
};

// E7 128.25 "Each piece is a thick stick about 15 centimeters long."
export const FifteenCmShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const measure = ramp(t, 130.0, 130.6);
  const s = 3.6;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#8a6440" flat outline={0} z={-40} />
        {Array.from({ length: 8 }, (_, i) => (
          <Line key={i} pts={[[-2000, -500 + i * 150], [2000, -480 + i * 150]]} width={4} color="#7a5634" z={-39} />
        ))}
        <ChocolateStick y={60} s={s} crest={false} z={1} />
        <X y={-150} z={1}>
          <Part shape={roundRect(1200, 90, 8)} color="#e9c66a" shade={0.15} />
          {Array.from({ length: 31 }, (_, i) => (
            <Line key={i} pts={[[-540 + i * 36, 45], [-540 + i * 36, i % 5 === 0 ? 5 : 22]]} width={4} z={0.001} />
          ))}
        </X>
        <X x={-540} y={-60} z={2}>
          <Line pts={[[0, -30], [0, 30]]} width={8} color="#fe5649" />
        </X>
        <X x={-540 + 1080 * measure} y={-60} z={2}>
          <Line pts={[[0, -30], [0, 30]]} width={8} color="#fe5649" />
        </X>
        {measure > 0 ? <Line pts={[[-540, -60], [-540 + 1080 * measure, -60]]} width={8} color="#fe5649" z={2} /> : null}
      </Stage>
      <Label text="15 CM" x={0.5} y={0.18} size={0.1} kind="title" at={sec(start)(130.11)} />
      <Label text="THICK" x={0.8} y={0.32} size={0.06} kind="box" rotate={8} at={sec(start)(129.19)} />
    </AbsoluteFill>
  );
};

// E8 131.62 "And each one is stamped with the emperor's symbol, a chrysanthemum flower."
export const StampShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const down = interpolate(t, [132.1, 132.4, 132.7, 133.0], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stamped = t > 132.4;
  const crest = pop(t, 133.07);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: hitAt(t, 132.4, 0.3) * 6 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <ObjectBack color="#3a2418" glow="#e9ba41">
          <X y={140} s={crest} z={-10}>
            <Kikumon r={300} color="#e9ba41" />
            <Glow rx={500} color="#ffd27a" alpha={0.3} additive z={0.1} />
          </X>
          <ChocolateStick y={-180} s={3.2} crest={stamped} z={1} />
          {/* hand stamp */}
          <X x={-288} y={interpolate(down, [0, 1], [380, -110])} z={2} visible={t < 133.3}>
            <Part shape={roundRect(110, 40, 6)} color="#7a3a1a" shade={0.2} />
            <Part shape={roundRect(44, 160, 18)} color="#9d6e3c" shade={0.2} y={100} z={-0.01} />
            <Part shape={circle(46)} color="#9d6e3c" shade={0.2} y={190} z={-0.005} />
          </X>
        </ObjectBack>
      </Stage>
      <Label text="EMPEROR'S SYMBOL" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(133.07)} />
      <Label text="菊" sub="CHRYSANTHEMUM" x={0.79} y={0.36} size={0.11} color="#ffffff" at={sec(start)(134.21)} font={CJK} />
    </AbsoluteFill>
  );
};

// E9 135.5 "One day, the older girls tell her to try a piece."
export const OlderGirlsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const offer = ramp(t, 137.3, 137.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -60 }} light={{ pos: [700, 300] }}>
        <Classroom>
          <Character {...UMEDA} x={-420} y={-580} s={1.1} z={2} look={0.5} expression={{ eyes: "open", mouth: "o", brows: 0.6, gaze: [0.8, 0.3] }} pose={poses.idle(frame)} />
          <Character
            {...GIRL(0)}
            x={160}
            y={-580}
            s={1.35}
            z={2}
            facing={-1}
            look={0.5}
            talking={t > 136.3 && t < 138.4}
            expression={{ eyes: "happy", mouth: "smirk", brows: -0.2 }}
            pose={{ armF: [interpolate(offer, [0, 1], [0.3, 1.45]), interpolate(offer, [0, 1], [0.4, 0.15])], armB: [-0.2, -0.1] }}
            holdF={<ChocolateStick s={0.3} rot={Math.PI / 2} crest={false} />}
          />
          <Character {...GIRL(1)} x={480} y={-580} s={1.35} z={1.9} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "grin", brows: -0.1 }} pose={poses.handsOnHips} />
        </Classroom>
      </Stage>
    </AbsoluteFill>
  );
};

// E10 138.62 '"The moment I ate it," she said later, "I felt a hot rush."'
export const HotRushShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rush = ramp(t, 141.2, 141.5);
  const bitten = t > 139.5;
  const s = 2.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + rush * 0.06, shake: hitAt(t, 141.25, 0.5) * 10 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <CardBack color={rush > 0 ? "#f08a5a" : "#d9b0a0"} alt={rush > 0 ? "#e6744a" : "#d0a494"} />
        {rush > 0 ? <Glow y={200} rx={900} color="#ff6a3a" alpha={0.4 * rush} additive z={-30} /> : null}
        <Character
          {...UMEDA}
          x={-40}
          y={20 - 308 * s}
          s={s}
          z={2}
          look={0.3}
          expression={rush > 0 ? { eyes: "wide", mouth: "o", brows: 0.6, blush: true, sweat: true } : bitten ? { eyes: "closed", mouth: "flat", blush: false } : { eyes: "open", mouth: "o", brows: 0.2 }}
          pose={{ armF: [bitten ? 1.0 : 2.4, bitten ? 0.5 : 0.9], armB: [-0.2, -0.1] }}
          holdF={<ChocolateStick s={0.6} rot={Math.PI / 2} crest={false} bite={bitten} />}
        />
        {[0, 1].map((i) => {
          const k = ((frame * 0.03 + i * 0.5) % 1) * rush;
          return <Part key={i} shape={circle(40 + k * 50)} color="#ffffff" flat outline={6} x={(i ? 1 : -1) * (280 + k * 60)} y={680 + k * 160} opacity={rush * (1 - k)} z={3} />;
        })}
      </Stage>
      <Label text="HOT RUSH!" x={0.78} y={0.2} size={0.08} kind="stamp" rotate={-8} at={sec(start)(141.25)} />
    </AbsoluteFill>
  );
};

// E11 142.1 'When she tells her father, he says, "There's probably Hiropon in it."'
export const FatherShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const bubble = pop(t, 144.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -40 }} light={{ pos: [0, 300] }}>
        <TatamiRoom floorY={-300}>
          <Character {...UMEDA} x={-480} y={-460} s={1.15} z={2} look={0.5} talking={t < 143.4} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={poses.sit(frame)} />
          <Character {...FATHER} x={480} y={-460} s={1.35} z={2} facing={-1} look={0.5} talking={t > 144.1 && t < 145.6} expression={{ eyes: t > 143.4 ? "half" : "open", mouth: "frown", brows: 0.4 }} pose={poses.sit(frame)} />
          <LowTable x={0} y={-480} w={560} z={3} />
          <SpeechBubble x={180} y={300} w={540} h={220} tx={360} ty={90} s={bubble} z={10} />
        </TatamiRoom>
      </Stage>
      {bubble > 0 ? <Label text="ヒロポン!" x={0.5 + 180 * 1.05 / 1920} y={0.5 - (300 + 40) * 1.05 / 1080} size={0.06} color="#c8262f" at={0} font={CJK} /> : null}
    </AbsoluteFill>
  );
};

// E12 145.92 "The teachers say the chocolate is a gift for soldiers."
export const TeachersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ pos: [700, 300] }}>
        <Classroom>
          <Character {...TEACHER} x={-420} y={-560} s={1.3} z={2} look={0.5} talking expression={{ eyes: "open", mouth: "smile", brows: -0.1 }} pose={poses.point(frame)} />
          {[0, 1, 2].map((i) => (
            <Crate key={i} x={180 + (i % 2) * 230} y={-620 + Math.floor(i / 2) * 150} s={1} z={3 + i * 0.01} />
          ))}
          <Character {...UMEDA} x={620} y={-600} s={1.0} z={4} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: 0 }} pose={poses.idle(frame)} />
        </Classroom>
      </Stage>
      <Label text="FOR THE SOLDIERS" x={0.6} y={0.14} size={0.065} kind="box" at={sec(start)(147.4)} />
    </AbsoluteFill>
  );
};

// E13 148.62 "The older girls say something darker."
export const DarkerShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dim = ramp(t, 149.0, 150.2) * 0.55;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, y: -60 }} light={{ pos: [-600, 200] }} shadowMul={[0.55, 0.5, 0.6]}>
        <Classroom dim={dim}>
          <Character {...GIRL(2)} x={-360} y={-580} s={1.3} z={2} look={0.6} talking={t > 149.0} expression={{ eyes: "half", mouth: "flat", brows: 0.4 }} pose={{ armF: [2.3, 2.2], armB: [-0.2, -0.1], lean: -0.1 }} />
          <Character {...UMEDA} x={60} y={-600} s={1.1} z={2} facing={-1} look={0.4} expression={{ eyes: "wide", mouth: "o", brows: 0.7 }} pose={poses.idle(frame)} />
          <Character {...GIRL(0)} x={460} y={-580} s={1.3} z={1.9} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.5 }} pose={poses.idle(frame, 2)} />
        </Classroom>
      </Stage>
    </AbsoluteFill>
  );
};

// E14 150.72 "It's for the special attack pilots, to eat before they die."
export const BeforeTheyDieShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -40 }} light={{ dir: [0.7, 0.4] }} shadowMul={[0.6, 0.55, 0.65]} vignette={0.7}>
        <Airfield mood="dusk" planes trees>
          <Character
            {...PILOT(1)}
            x={-120}
            y={-560}
            s={1.3}
            z={2}
            look={0.3}
            expression={{ eyes: "half", mouth: "flat", brows: 0.5, gaze: [0.4, -0.6] }}
            pose={{ ...poses.sit(frame), armF: [1.3, 0.8] }}
            holdF={<ChocolateStick s={0.35} rot={Math.PI / 2} crest />}
          />
        </Airfield>
      </Stage>
    </AbsoluteFill>
  );
};

// E15 154.6 "And here's the strange part."
export const StrangePartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1) }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <ObjectBack color="#2a2430" glow="#b98aff">
          <ChocolateStick y={-160} s={2.4} rot={Math.sin(frame * 0.05) * 0.06} z={1} />
          <QuestionMark x={0} y={200} s={1.3 * pop(t, 155.31)} rot={Math.sin(frame * 0.08) * 0.1} z={2} />
        </ObjectBack>
      </Stage>
    </AbsoluteFill>
  );
};

/** Archive shelves of file boxes. */
const Archive: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <Part shape={roundRect(5000, 3000, 0)} color="#4a4a52" flat outline={0} z={-41} />
    {[-700, 0, 700].map((x) => (
      <X key={x} x={x} y={-480} z={-38}>
        <Part shape={roundRect(600, 1200, 6)} color="#6a5a4a" shade={0.2} y={600} />
        {[0, 1, 2, 3].map((r) => (
          <X key={r} y={120 + r * 270} z={0.001}>
            <Part shape={roundRect(560, 20, 3)} color="#3a2e26" flat outline={4} />
            {Array.from({ length: 6 }, (_, i) => (
              <Part key={i} shape={roundRect(78, 180, 4)} color={["#c9b98a", "#b9a27a", "#a8a08a"][(i + r) % 3]} shade={0.2} x={-225 + i * 90} y={100} z={0.001} />
            ))}
          </X>
        ))}
      </X>
    ))}
    <Glow y={200} rx={900} ry={700} color="#fff1c8" alpha={0.18} additive z={-36} />
    {children}
  </>
);

// E16 156.2 "No written record of this chocolate has been found."
export const NoRecordShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [0, 400] }} vignette={0.6}>
        <Archive>
          <Desk y={-620} w={1300} h={300} color="#7a5232" z={2} />
          <X y={-280} z={3}>
            <Part shape={roundPoly([[-440, -10], [0, -30], [440, -10], [420, 40], [0, 20], [-420, 40]], 10)} color="#c9a274" shade={0.15} />
            <Part shape={roundRect(380, 40, 4)} color="#f4f1ea" shade={0.1} x={-210} y={30} rot={0.03} z={0.01} />
            <Part shape={roundRect(380, 40, 4)} color="#f4f1ea" shade={0.1} x={210} y={30} rot={-0.03} z={0.01} />
          </X>
        </Archive>
      </Stage>
      <Label text="NO RECORD" x={0.5} y={0.36} size={0.13} kind="stamp" rotate={-9} at={sec(start)(156.9)} />
    </AbsoluteFill>
  );
};

// E17 158.85 "One researcher thinks that's no accident."
export const ResearcherShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sly = t > 160.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -40 }} light={{ pos: [0, 400] }} vignette={0.6}>
        <Archive>
          <Character
            {...RESEARCHER}
            x={-60}
            y={-480}
            s={1.4}
            z={1}
            look={0.5}
            expression={sly ? { eyes: "squint", mouth: "smirk", brows: -0.5 } : { eyes: "open", mouth: "flat", brows: 0.2, gaze: [0.6, -0.4] }}
            pose={sly ? poses.point(frame) : { armF: [1.2, 0.8], armB: [-0.2, -0.1] }}
            holdF={sly ? undefined : <Magnifier r={60} rot={-1.2} />}
          />
          <Desk y={-620} w={1300} h={300} color="#7a5232" z={2} />
        </Archive>
      </Stage>
    </AbsoluteFill>
  );
};

// E18 161.15 "After the war, nobody wanted to talk about it."
export const SilenceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ pos: [0, -200] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.75} vignetteColor="#04050f">
        <Backdrop mood="night" horizon={-300} kaimon={false} />
        <X y={-300} z={-30}>
          <Ground w={5000} h={1600} color="#2e3a26" far="#34422c" pebbles={0} tufts={8} />
        </X>
        <Glow y={-280} rx={700} ry={400} color="#ff9a4a" alpha={0.35} additive z={-5} />
        <X y={-520} z={2}>
          <Part shape={roundRect(220, 260, 14)} color="#5a5a64" shade={0.25} y={130} />
          <Line pts={[[-110, 80], [110, 80]]} width={5} z={0.001} />
          <Line pts={[[-110, 190], [110, 190]]} width={5} z={0.001} />
          <Flame y={250} size={1.4} seed={3} z={0.01} />
          <Smoke y={420} w={300} h={700} alpha={0.5} z={-0.1} />
        </X>
        <Character {...NAVY_OFFICER(1)} x={-380} y={-540} s={1.2} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.3, gaze: [0.6, -0.5] }} pose={{ armF: [1.3, 0.3], armB: [-0.2, -0.1] }} holdF={<Part shape={roundRect(90, 120, 4)} color="#f4f1ea" shade={0.1} />} />
        <Character {...GENERAL(1)} x={380} y={-540} s={1.2} z={1} facing={-1} look={0.5} expression={{ eyes: "closed", mouth: "flat", brows: 0.4 }} pose={poses.idle(frame)} />
      </Stage>
      <Label text="1945" x={0.14} y={0.12} size={0.06} kind="box" at={6} />
    </AbsoluteFill>
  );
};
