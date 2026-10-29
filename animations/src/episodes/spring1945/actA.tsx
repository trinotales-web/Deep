import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Line, InkLine, Glow, Wash, QuestionMark, Syringe, Ampoule, ChocolateStick, LabFlask, Ephedra, CoffeeCup, Crosshair,
  roundRect, roundPoly, circle, blob, poly, ellipse, ramp, push, hitAt, absT, type ShotProps,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses, reachArm } from "../../kit/character";
import {
  ZeroFighter, Warship, JapanMap, Sunburst, Ruins, Kikumon, ShopFront, Ground, Sky, PlankWall, Flag, Stars, Moon, WatchTower, Clock, HangingLamp,
  Smoke, Flame, SpeedLines, Hill, Sea,
} from "../../kit/env";
import { Airfield, OkinawaSea, Barracks, ObjectBack, Backdrop } from "./sets";
import { PILOT, DOCTOR, SOLDIER, CHEMIST, WORKER, GENERAL, NAVY_OFFICER, DEALER } from "./cast";
import { sec, pop, CJK } from "./common";

/** Loose bomb (same shape as the Zero's). Origin = centre, nose +x. */
const Bomb: React.FC<{ x: number; y: number; s?: number; rot?: number; z?: number }> = ({ x, y, s = 1, rot = 0, z = 0 }) => (
  <X x={x} y={y} s={s} rot={rot} z={z}>
    <Part shape={blob([[-90, 0], [-40, 26], [70, 24], [110, 0], [70, -24], [-40, -26]], 10)} color="#3e3d40" shade={0.25} />
    <Part shape={poly([[-86, 0], [-128, 34], [-112, 0], [-128, -34]])} color="#34333a" shade={0.2} z={-0.001} />
  </X>
);

/** Point on the Kyushu → Okinawa route of JapanMap (map units) and its heading. */
export const routeAt = (k: number): [number, number, number] => {
  const a = [-60, 90];
  const b = [-430, -330];
  const p = (q: number) => [a[0] + (b[0] - a[0]) * q + Math.sin(q * Math.PI) * 60, a[1] + (b[1] - a[1]) * q];
  const [x, y] = p(k);
  const [x2, y2] = p(Math.min(1, k + 0.01));
  return [x, y, Math.atan2(y2 - y, x2 - x)];
};

// ───────────────────────── A · cold open ─────────────────────────

// A1 0.0 "It's spring 1945."
export const SpringShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="dawn">
          {[0, 1, 2].map((i) => (
            <Character key={i} {...PILOT(i)} x={-120 + i * 110} y={-250 - (i % 2) * 10} s={0.42} z={2 + i * 0.01} look={0.4} expression={{ eyes: "half", mouth: "flat" }} pose={poses.idle(frame, i)} />
          ))}
        </Airfield>
      </Stage>
      <Label text="SPRING 1945" sub="SOUTHERN JAPAN" x={0.5} y={0.18} size={0.1} kind="title" at={6} />
    </AbsoluteFill>
  );
};

// A2 2.15 "You're 19 years old, standing on an airfield in the south of Japan."
export const PilotStandShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="dawn" planes={false}>
          <ZeroFighter x={480} y={-200} s={0.95} z={1} />
          <Character {...PILOT(0)} x={-280} y={-560} s={1.35} z={3} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.3, gaze: [0.8, 0.1] }} pose={poses.idle(frame)} />
        </Airfield>
      </Stage>
      <Label text="19 YEARS OLD" x={0.22} y={0.16} size={0.06} kind="box" at={sec(start)(2.42)} />
    </AbsoluteFill>
  );
};

// A3 6.1 "In a few hours, you'll fly a plane loaded with a bomb …"
export const BombLoadShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 7.2, 8.8, Easing.inOut(Easing.cubic));
  const attached = t > 8.8;
  const s = 1.1;
  const zx = 60;
  const zy = -40;
  const target: [number, number] = [zx + 30 * s, zy - 78 * s];
  const bx = interpolate(k, [0, 1], [-640, target[0]]);
  const by = interpolate(k, [0, 1], [-420, target[1]]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -40, shake: hitAt(t, 8.85, 0.3) * 6 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="dawn" planes={false}>
          <ZeroFighter x={zx} y={zy} s={s} bomb={attached} z={1} />
          {!attached ? <Bomb x={bx} y={by} s={s} z={2} /> : null}
          {[0, 1].map((i) => (
            <Character
              key={i}
              {...SOLDIER(i)}
              x={(attached ? target[0] : bx) - 260 - i * 150}
              y={-560}
              s={0.95}
              z={3 + i * 0.01}
              look={0.5}
              expression={{ eyes: "squint", mouth: "teeth", brows: -0.3 }}
              pose={{ ...poses.walk(frame + i * 5, attached ? 0 : 0.8), armF: [1.4, 0.2], armB: [1.3, 0.3], lean: -0.15 }}
            />
          ))}
        </Airfield>
      </Stage>
    </AbsoluteFill>
  );
};

// A4 9.2 "… into an American warship."
export const WarshipShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.02), y: 60 }} light={{ dir: [-0.7, 0.6] }}>
        <OkinawaSea horizon={60}>
          <Warship kind="destroyer" x={-640} y={110} len={520} z={1} />
          <Warship kind="destroyer" x={720} y={100} len={480} z={1} />
          <Warship x={60 + frame * 0.6} y={-120 + Math.sin(frame * 0.08) * 4} len={1500} z={2} />
        </OkinawaSea>
      </Stage>
    </AbsoluteFill>
  );
};

// A5 10.8 "There's no plan to come back."
export const OneWayShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const route = ramp(t, 10.95, 11.8);
  const [px, py, ang] = routeAt(Math.max(0.02, route));
  const mx = 280;
  const my = 110;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, x: 60, y: 0 }} light={{ dir: [-0.6, 0.8] }}>
        <JapanMap x={mx} y={my} route={route} />
        <X x={mx + px} y={my + py} rot={ang} s={0.16} z={2}>
          <ZeroFighter gear={false} spin={1} />
        </X>
      </Stage>
      <Label text="KYUSHU" x={0.5 + (mx - 60) / 1920} y={0.5 - (my + 330) / 1080} size={0.04} at={0} />
      <Label text="OKINAWA" x={0.5 + (mx - 420 - 140) / 1920} y={0.5 - (my - 360) / 1080} size={0.04} at={0} />
      <Label text="ONE WAY" x={0.36} y={0.42} size={0.08} kind="stamp" rotate={-10} at={sec(start)(11.82)} />
    </AbsoluteFill>
  );
};

// A6 12.55 "Before you climb in, a young doctor rolls up your sleeve …"
export const DoctorArrivesShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const walk = ramp(t, 12.6, 13.8, (x) => x);
  const dx = interpolate(walk, [0, 1], [760, 300]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -20 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="dawn" planes={false}>
          <ZeroFighter x={-60} y={-160} s={0.8} bomb z={1} />
          <Character {...PILOT(0)} x={-300} y={-560} s={1.25} z={3} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.2 }} pose={{ ...poses.idle(frame), armF: [1.25, 0.1] }} />
          <Character
            {...DOCTOR}
            x={dx}
            y={-560}
            s={1.25}
            z={3.1}
            facing={-1}
            look={0.5}
            expression={{ eyes: "open", mouth: "flat", brows: 0.1 }}
            pose={walk < 1 ? poses.walk(frame, 1.0) : { armF: [1.1, 0.4], armB: [0.6, 0.6] }}
            holdB={<Syringe s={0.6} rot={-1.4} />}
          />
        </Airfield>
      </Stage>
    </AbsoluteFill>
  );
};

/** Close-up of a forearm (sleeve rolled up) across the frame, hand to the left. */
const Forearm: React.FC<{ x?: number; y?: number; s?: number; sleeve?: string; z?: number }> = ({ x = 0, y = 0, s = 1, sleeve = "#7a6044", z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(900, 190, 90)} color={sleeve} shade={0.22} x={560} />
    <Part shape={roundRect(120, 210, 40)} color={sleeve} shade={0.2} x={150} z={0.01}>
      {[-50, 0, 50].map((yy) => (
        <Line key={yy} pts={[[-50, yy], [50, yy + 6]]} width={4} color="#4a3a2a" z={0.001} />
      ))}
    </Part>
    <Part shape={roundRect(560, 150, 75)} color="#f6f5f8" shade={0.22} x={-160} z={0.005} />
    <Part shape={blob([[-500, 0], [-470, 70], [-400, 96], [-330, 70], [-320, 0], [-330, -70], [-400, -96], [-470, -70]], 8)} color="#f6f5f8" shade={0.22} z={0.006} />
  </X>
);

// A7 14.4 "… and gives you a shot."
export const InjectionCloseShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const inn = ramp(t, 14.6, 15.3, Easing.out(Easing.cubic));
  const press = ramp(t, 15.45, 15.95);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, shake: hitAt(t, 15.36, 0.3) * 3 }} light={{ dir: [-0.6, 0.8] }}>
        <Airfield mood="dawn" planes={false} petals={false} />
        <Wash width={4000} height={3000} color="#f2d8c8" alpha={0.45} z={-5} />
        <Forearm x={-160} y={-80} s={1.15} z={1} />
        <X x={interpolate(inn, [0, 1], [760, 330])} y={-60 + (1 - inn) * 30} rot={Math.PI - 0.22} s={2.0} z={3}>
          <Syringe fill={0.75} push={press} />
        </X>
        {/* the doctor's gloved hands */}
        <X x={interpolate(inn, [0, 1], [760, 330]) + 70} y={-40} z={3.1}>
          <Part shape={blob([[-40, -30], [40, -36], [56, 0], [40, 36], [-40, 30]], 8)} color="#ffffff" shade={0.2} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// A8 16.0 '"This will wake you up," he says.'
export const WakeUpShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="dawn" planes={false} />
        <Wash width={4000} height={3000} color="#f2d8c8" alpha={0.25} z={-5} />
        <Character
          {...DOCTOR}
          x={220}
          y={40 - 308 * s}
          s={s}
          z={2}
          facing={-1}
          look={0.35}
          talking={t < 17.6}
          expression={{ eyes: "open", mouth: "smile", brows: 0.1 }}
          pose={{ armF: [2.2, 0.9], armB: [-0.2, -0.1] }}
          holdF={<Syringe s={0.9} rot={-2.2 - 0.9 + Math.PI / 2} fill={0.2} />}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// A9 18.0 "Neither of you knows what's inside."
export const NeitherKnowsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -100 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="dawn" planes={false} />
        <Character {...PILOT(0)} x={-330} y={-640} s={1.4} z={2} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: 0.5, gaze: [0.8, -0.2] }} pose={poses.idle(frame)} />
        <Character {...DOCTOR} x={330} y={-640} s={1.4} z={2} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: 0.5, gaze: [0.6, -0.4] }} pose={{ armF: [1.5, 0.5], armB: [-0.2, -0.1] }} holdF={<Ampoule s={0.8} rot={-2.0 + Math.PI / 2} />} />
        <QuestionMark x={-430} y={300} s={0.7 * pop(t, 19.2)} rot={-0.15} z={5} />
        <QuestionMark x={430} y={300} s={0.7 * pop(t, 19.4)} rot={0.15} z={5} />
      </Stage>
    </AbsoluteFill>
  );
};

// A10 19.95 "It's meth."
export const ItsMethShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 20.27, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hit * 0.06, shake: hit * 10 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <ObjectBack color="#3a1e22" glow="#ff9a6a">
          <Ampoule y={-200} s={2.8} glow={1} z={1} />
        </ObjectBack>
      </Stage>
      <Label text="METH" x={0.66} y={0.36} size={0.13} kind="stamp" rotate={-10} at={sec(start)(20.27)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── B · the question ─────────────────────────

// B1 21.2 "So were Japan's kamikaze pilots drugged to make them brave enough to die?"
export const DruggedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), x: -40, y: 80 }} light={{ dir: [0.6, 0.6] }}>
        <Backdrop mood="dusk" horizon={-260} />
        <Sea w={5000} h={1400} y={-262} color="#4a6a9a" z={-30} />
        <ZeroFighter
          x={-260}
          y={-200}
          s={2.3}
          gear={false}
          z={1}
          pilot={<Character {...PILOT(1)} y={-78} s={0.38} shadow={false} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.4, gaze: [0.9, 0] }} pose={{ armF: [0.6, 0.6], armB: [-0.2, -0.1] }} />}
        />
        <QuestionMark x={560} y={220} s={1.2 * pop(t, 24.9)} rot={0.15} z={4} />
      </Stage>
    </AbsoluteFill>
  );
};

// B2 25.5 "Or is the real story stranger?"
export const StrangerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [0.6, 0.6] }} vignette={0.7}>
        <Airfield mood="dusk" planes={false}>
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...PILOT(i)} x={-560 + i * 280} y={-520} s={0.95} z={2 + i * 0.01} look={0.3} expression={{ eyes: "half", mouth: "flat" }} pose={poses.idle(frame, i)} />
          ))}
        </Airfield>
        <Wash width={4000} height={3000} color="#2a1430" alpha={0.35} z={8} />
        <QuestionMark y={180} s={1.6 * pop(t, 26.2)} z={10} />
      </Stage>
    </AbsoluteFill>
  );
};

// B3 27.55 "Coming up, a chocolate bar stamped with the emperor's symbol."
export const TeaserChocolateShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <ObjectBack color="#2a2018" glow="#e9ba41">
          <Kikumon r={380} color="#8a6a2a" z={-10} />
          <ChocolateStick y={-40} s={2.6} rot={-0.12} z={1} />
        </ObjectBack>
      </Stage>
      <Label text="COMING UP" x={0.16} y={0.1} size={0.05} kind="box" at={4} />
    </AbsoluteFill>
  );
};

// B4 30.7 "A doctor who didn't know what he was injecting."
export const TeaserDoctorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60 }} light={{ pos: [420, 0] }} shadowMul={[0.6, 0.55, 0.62]}>
        <Barracks>
          <Character {...DOCTOR} x={-120} y={-620} s={1.5} z={2} look={0.5} expression={{ eyes: "open", mouth: "wavy", brows: 0.8, gaze: [0.7, 0.4] }} pose={{ armF: [2.0, 0.7], armB: [-0.2, -0.1] }} holdF={<Syringe s={0.8} rot={-2.7 + Math.PI / 2} />} />
          <QuestionMark x={380} y={200} s={0.9 * pop(t, 31.6)} rot={0.15} z={4} />
        </Barracks>
      </Stage>
    </AbsoluteFill>
  );
};

// B5 32.9 "And a drug that outlived the war."
export const TeaserOutlivedShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -60 }} light={{ dir: [0.6, 0.6] }} vignette={0.6}>
        <Backdrop mood="dusk" horizon={-180} kaimon={false} />
        <X y={-180} z={-30}>
          <Ground w={5000} h={1600} color="#5a4a40" far="#6a5a4a" pebbles={20} tufts={0} />
        </X>
        <Ruins y={-200} w={2200} z={-10} />
        <Ampoule x={0} y={-420} s={2.2} glow={0.8} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};

// B6 34.9 "But first, the drug itself."
export const DrugItselfShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#5a2a24" alt="#4a221e" speed={0.6} z={-20} />
        <Ampoule y={-220} s={2.6} rot={Math.sin(frame * 0.05) * 0.06} glow={0.6} z={1} />
      </Stage>
      <Label text="THE DRUG" x={0.5} y={0.14} size={0.08} kind="title" at={sec(start)(35.9)} />
    </AbsoluteFill>
  );
};

// B7 37.0 "Because it starts in Japan."
export const StartsInJapanShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 1.0), x: 200, y: 200 }} light={{ dir: [-0.6, 0.8] }}>
        <JapanMap />
        <Glow x={200} y={300} rx={700} color="#ffd27a" alpha={0.3} additive z={5} />
      </Stage>
      <Label text="JAPAN" x={0.5} y={0.16} size={0.09} kind="title" at={sec(start)(38.2)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── C · the drug ─────────────────────────

/** Meiji-era laboratory: dark panelling, shelves of jars, a workbench. */
const Lab: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <PlankWall w={4000} h={2400} y={600} color="#5a4030" z={-40} />
    {[180, 380].map((y, row) => (
      <X key={y} y={y} z={-38}>
        <Part shape={roundRect(1500, 20, 4)} color="#3a2a20" shade={0.2} />
        {Array.from({ length: 11 }, (_, i) => (
          <Part key={i} shape={roundRect(60, 90 + ((i + row) % 3) * 20, 10)} color={["#7a3a1a", "#2f6f6a", "#c9963f", "#8a8790"][(i + row) % 4]} shade={0.25} x={-650 + i * 130} y={55 + ((i + row) % 3) * 10} z={0.001} />
        ))}
      </X>
    ))}
    <Glow x={-200} y={0} rx={900} color="#ffcf7a" alpha={0.22} additive z={-37} />
    <Part shape={roundRect(4000, 600, 0)} color="#3e2a20" flat outline={0} y={-760} z={-30} />
    {children}
  </>
);

/** Lab workbench (top at y). */
const Bench: React.FC<{ y: number; w?: number; x?: number; z?: number }> = ({ y, w = 1100, x = 0, z = 1 }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(w, 40, 8)} color="#6e4a2c" shade={0.2} />
    <Part shape={roundRect(w - 40, 400, 6)} color="#5a3a26" shade={0.2} y={-220} z={-0.01} />
  </X>
);

// C1 38.95 "In 1893, a Japanese chemist studying a plant used in Chinese medicine …"
export const ChemistShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [-200, 200] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.6}>
        <Lab>
          <Character {...CHEMIST} x={-360} y={-640} s={1.4} z={2} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.3, gaze: [0.9, -0.3] }} pose={{ armF: [1.3, 0.5], armB: [0.4, 0.8] }} />
          <Bench y={-330} x={180} w={900} z={3} />
          <LabFlask x={60} y={-310} s={1.1} z={4} />
          <Ephedra x={380} y={-310} s={0.9} z={4} />
          <X x={60} y={-310} z={3.9}>
            <Flame size={0.25} y={-6} seed={2} />
          </X>
        </Lab>
      </Stage>
      <Label text="1893" x={0.18} y={0.14} size={0.08} kind="box" at={sec(start)(39.22)} />
    </AbsoluteFill>
  );
};

// C2 42.05 "… a plant used in Chinese medicine …"
export const EphedraShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ pos: [-300, 300] }} vignette={0.6}>
        <Lab>
          <Bench y={-420} w={1600} z={1} />
          <Ephedra x={-120} y={-400} s={2.2} z={2} />
          {[300, 470].map((x, i) => (
            <X key={x} x={x} y={-400} z={2}>
              <Part shape={roundPoly([[-70, 0], [70, 0], [80, 160], [40, 200], [-40, 200], [-80, 160]], 14)} color={i ? "#c9a274" : "#8a9a7a"} shade={0.25} />
              <Part shape={roundRect(70, 80, 6)} color="#f2ead8" flat outline={3} y={90} z={0.001} />
            </X>
          ))}
        </Lab>
      </Stage>
      <Label text="麻黄" x={0.5 + 300 / 1920} y={0.5 - (-310 * 1.04) / 1080} size={0.035} color="#3a2a22" at={0} font={CJK} />
      <Label text="EPHEDRA" sub="CHINESE MEDICINE" x={0.5} y={0.14} size={0.075} kind="title" at={sec(start)(42.4)} />
    </AbsoluteFill>
  );
};

// C3 43.95 "… makes a new chemical."
export const NewChemicalShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const spark = pop(t, 44.55);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, y: -60 }} light={{ pos: [-200, 200] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.6}>
        <Lab>
          <Character {...CHEMIST} x={-380} y={-660} s={1.45} z={2} look={0.6} expression={t > 44.5 ? { eyes: "wide", mouth: "grin", brows: 0.6 } : { eyes: "open", mouth: "flat", brows: 0.3 }} pose={{ armF: [1.6, 0.3], armB: [0.4, 0.8] }} />
          <Bench y={-340} x={220} w={900} z={3} />
          <LabFlask x={160} y={-320} s={1.5} liquid="#d8f0ec" z={4} />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <Part key={i} shape={poly([[0, 16], [4, 4], [16, 0], [4, -4], [0, -16], [-4, -4], [-16, 0], [-4, 4]])} color="#fff3b0" flat outline={3} x={160 + Math.cos(a) * 170} y={-60 + Math.sin(a) * 120} s={spark * (1 + Math.sin(frame * 0.4 + i) * 0.2)} z={5} />
            );
          })}
        </Lab>
      </Stage>
    </AbsoluteFill>
  );
};

// C4 45.25 "Nobody pays much attention."
export const NobodyCaresShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.94), y: -40 }} light={{ pos: [-200, 200] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.7}>
        <Lab>
          <Character {...CHEMIST} x={0} y={-600} s={1.2} z={2} look={0.1} expression={{ eyes: "half", mouth: "frown", brows: 0.6 }} pose={{ armF: [2.4, 0.4], armB: [-0.2, -0.1] }} holdF={<LabFlask s={0.5} rot={-2.8} bubbles={false} />} />
        </Lab>
      </Stage>
    </AbsoluteFill>
  );
};

/** Prewar Japanese street with the pharmacy. */
const PharmacyStreet: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <Backdrop mood="day" horizon={-200} kaimon={false} />
    <X y={-200} z={-30}>
      <Ground w={5000} h={1600} color="#b9ab92" far="#c9bba2" pebbles={14} tufts={0} />
    </X>
    <ShopFront x={-760} y={-180} w={420} h={340} wall="#a8825a" noren="#6a2a2a" z={-12} />
    <ShopFront x={0} y={-200} w={720} h={480} z={-10} />
    <ShopFront x={760} y={-180} w={420} h={340} wall="#9a7a5a" noren="#2a4a3a" z={-12} />
    {children}
  </>
);

// C5 46.9 "Then, in 1941, a Japanese company starts selling it in pharmacies."
export const PharmacyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03), y: 40 }} light={{ dir: [-0.6, 0.8] }}>
        <PharmacyStreet>
          {[0, 1].map((i) => (
            <Character key={i} {...WORKER(i)} x={-520 + i * 140 + frame * 2} y={-470 - i * 10} s={0.85} z={2 + i * 0.01} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.walk(frame + i * 6, 0.9)} />
          ))}
        </PharmacyStreet>
      </Stage>
      <Label text="薬" x={0.5} y={0.5 - (-200 + 480 * 0.82 - 40) / 1080} size={0.06} color="#f4efe2" at={0} font={CJK} />
      <Label text="1941" x={0.82} y={0.14} size={0.08} kind="box" at={sec(start)(47.79)} />
    </AbsoluteFill>
  );
};

/** Retro Hiropon box with ampoules. Origin = bottom centre. */
const HiroponBox: React.FC<{ x?: number; y?: number; s?: number; z?: number; rot?: number }> = ({ x = 0, y = 0, s = 1, z = 0, rot = 0 }) => (
  <X x={x} y={y} s={s} z={z} rot={rot}>
    <Part shape={roundRect(360, 230, 12)} color="#f2e6c4" shade={0.2} y={115} />
    <Part shape={roundRect(360, 70, 6)} color="#c8262f" flat outline={4} y={180} z={0.001} />
    <Part shape={roundRect(300, 20, 4)} color="#2f4f9a" flat outline={3} y={60} z={0.001} />
    {[-100, -50, 0, 50, 100].map((ax) => (
      <Ampoule key={ax} x={ax} y={230} s={0.55} label={false} z={-0.01} />
    ))}
  </X>
);

// C6 51.8 "They call it Hiropon."
export const HiroponShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hitAt(t, 52.7, 0.4) * 0.04 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={22} color="#c9963f" alt="#b9862f" speed={0.8} z={-20} />
        <HiroponBox y={-360} s={1.8} z={1} />
      </Stage>
      <Label text="ヒロポン" x={0.5} y={0.5 - (-360 + 180 * 1.8) / 1080} size={0.07} color="#ffffff" at={0} font={CJK} />
      <Label text="HIROPON" x={0.5} y={0.16} size={0.12} kind="title" at={sec(start)(52.65)} />
    </AbsoluteFill>
  );
};

// C7 53.5 'The name comes from a Greek word that means "love of work."'
export const GreekShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={22} color="#2f4f7a" alt="#284670" speed={0.6} z={-20} />
        <Character {...WORKER(0)} x={0} y={-560} s={1.3} z={1} look={0.2} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} />
        <X x={0} y={260} s={pop(t, 55.6)} z={2}>
          <Part shape={blob([[0, -70], [70, 0], [90, 50], [50, 80], [0, 50], [-50, 80], [-90, 50], [-70, 0]], 12)} color="#e8322a" shade={0.2} />
        </X>
      </Stage>
      <Label text="PHILOPONOS" sub="GREEK" x={0.25} y={0.3} size={0.07} kind="title" at={sec(start)(54.4)} />
      <Label text={"“LOVE\nOF WORK”"} x={0.76} y={0.3} size={0.075} color="#ffd27a" at={sec(start)(55.5)} />
    </AbsoluteFill>
  );
};

// C8 56.55 "The ads promise it will chase away tiredness and sleep."
export const AdPosterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const chase = ramp(t, 57.6, 58.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#6a4a3a" flat outline={0} z={-30} />
        <X z={-10}>
          <Part shape={roundRect(1000, 900, 10)} color="#f2e6c4" shade={0.12} />
          <Part shape={roundRect(940, 220, 6)} color="#c8262f" flat outline={4} y={300} z={0.001} />
          <Part shape={roundRect(940, 560, 6)} color="#f8d878" flat outline={4} y={-120} z={0.001} />
        </X>
        <Character {...WORKER(2)} x={-150} y={-390} s={1.05} z={2} look={0.5} expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }} pose={{ armF: [1.6 + chase * 0.2, -0.1], armB: [2.6, 1.4], armsOverHead: true }} />
        <X x={interpolate(chase, [0, 1], [210, 560])} y={-40 + chase * 120} rot={chase * 0.5} s={1 - chase * 0.4} z={3}>
          <Part shape={blob([[-120, -20], [-80, 50], [0, 70], [90, 50], [130, -10], [80, -60], [-60, -60]], 14)} color="#9a98aa" shade={0.2} />
        </X>
      </Stage>
      <Label text="ヒロポン" x={0.5} y={0.5 - 300 / 1080} size={0.09} color="#ffffff" at={0} font={CJK} />
      <Label text="Zzz" x={0.5 + interpolate(chase, [0, 1], [210, 560]) / 1920} y={0.5 - (-40 + chase * 120) / 1080} size={0.05} color="#ffffff" at={0} rotate={chase * -25} />
    </AbsoluteFill>
  );
};

// C9 59.75 "So in wartime Japan, meth isn't a street drug."
export const NotStreetDrugShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }}>
        <X x={-480} z={-30}>
          <Part shape={roundRect(960, 1200, 0)} color="#2a2430" flat outline={0} />
          <Part shape={roundRect(260, 700, 0)} color="#3a3440" flat outline={6} x={-260} y={-50} z={0.01} />
        </X>
        <Character {...DEALER} x={-470} y={-480} s={1.1} z={1} look={0.4} expression={{ eyes: "half", mouth: "smirk" }} pose={{ armF: [1.3, 0.4], armB: [-0.2, -0.1] }} holdF={<Ampoule s={0.6} rot={-1.7 + Math.PI / 2} label={false} />} />
        <X x={480} z={-30}>
          <Part shape={roundRect(960, 1200, 0)} color="#e8dcc0" flat outline={0} />
        </X>
        {[0, 1, 2].map((r) => (
          <X key={r} x={480} y={-260 + r * 230} z={1}>
            <Part shape={roundRect(700, 20, 4)} color="#8a5a32" shade={0.2} />
            {[-240, -80, 80, 240].map((x) => (
              <HiroponBox key={x} x={x} y={10} s={0.35} z={0.01} />
            ))}
          </X>
        ))}
        <Part shape={roundRect(14, 1200, 0)} color="#211b20" flat outline={0} z={5} />
        <X x={-480} y={0} s={pop(t, 62.6)} z={6}>
          <InkLine pts={[[-140, 140], [140, -140]]} width={40} color="#fe5649" outline={8} />
          <InkLine pts={[[-140, -140], [140, 140]]} width={40} color="#fe5649" outline={8} />
        </X>
      </Stage>
      <Label text="STREET DRUG" x={0.25} y={0.12} size={0.05} kind="box" at={sec(start)(62.3)} />
      <Label text="PHARMACY PRODUCT" x={0.75} y={0.12} size={0.05} kind="box" at={sec(start)(60.4)} />
    </AbsoluteFill>
  );
};

// C10 63.45 "It's a product, like a much stronger cup of coffee."
export const CoffeeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={22} color="#5a3a26" alt="#4e321f" speed={0.6} z={-20} />
        <CoffeeCup x={-380} y={-260} s={1.6} z={1} />
        <X x={380} y={-280} s={2.4 * (0.4 + 0.6 * pop(t, 65.1))} z={1}>
          <Ampoule glow={0.8} />
        </X>
      </Stage>
      <Label text="<" x={0.5} y={0.5} size={0.18} color="#ffffff" at={sec(start)(65.0)} />
      <Label text="MUCH STRONGER" x={0.7} y={0.16} size={0.06} kind="box" at={sec(start)(65.1)} />
    </AbsoluteFill>
  );
};

// C11 66.75 "And the army and navy love it."
export const ArmyNavyShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <Barracks floorY={-460}>
          <Flag x={0} y={-460} pole={760} z={-5} />
          <Character {...GENERAL(0)} x={-330} y={-600} s={1.3} z={2} look={0.4} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: [1.2, 0.5], armB: [1.0, 0.6] }} holdF={<HiroponBox s={0.4} rot={-1.7} />} />
          <Character {...NAVY_OFFICER(0)} x={330} y={-600} s={1.3} z={2} facing={-1} look={0.4} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: [1.2, 0.5], armB: [1.0, 0.6] }} holdF={<HiroponBox s={0.4} rot={-1.7} />} />
        </Barracks>
      </Stage>
    </AbsoluteFill>
  );
};

// C12 68.7 "Pilots take it on long flights."
export const PilotsNightShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [0.6, 0.6] }} vignette={0.6} vignetteColor="#04050f">
        <Backdrop mood="night" horizon={-420} kaimon={false} />
        <SpeedLines w={2400} h={900} n={14} speed={50} color="#8fa6d6" z={-10} />
        <ZeroFighter
          x={-60}
          y={-20 + Math.sin(frame * 0.06) * 10}
          s={1.6}
          gear={false}
          spin={1}
          z={1}
          pilot={<Character {...PILOT(2)} y={-78} s={0.38} shadow={false} look={0.5} expression={{ eyes: "wide", mouth: "flat", brows: -0.2 }} pose={{ armF: [0.6, 0.6], armB: [-0.2, -0.1] }} />}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// C13 70.5 "Guards take it on night watch."
export const GuardShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sweep = Math.sin(frame * 0.04) * 0.5;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 160 }} light={{ pos: [0, 400] }} vignette={0.7} vignetteColor="#04050f">
        <Backdrop mood="night" horizon={-260} kaimon={false} />
        <X y={-260} z={-30}>
          <Ground w={5000} h={1600} color="#2e3a26" far="#34422c" pebbles={0} tufts={10} />
        </X>
        <WatchTower x={0} y={-420} h={420} z={1} />
        <Character {...SOLDIER(2)} x={-30} y={30} s={0.75} z={1.005} look={0.4} expression={{ eyes: "wide", mouth: "flat", brows: -0.3 }} pose={{ armF: [1.4, 0.4], armB: [-0.2, -0.1] }} />
        <X x={60} y={170} rot={-0.9 + sweep} z={1.01}>
          <Part shape={poly([[0, 0], [1600, 260], [1600, -260]])} color="#fff6c8" flat outline={0} opacity={0.18} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// C14 72.1 "Factory workers take it to get through night shifts."
export const FactoryShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ pos: [0, 300] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.65} vignetteColor="#0a0610">
        <Barracks floorY={-460} light="#9ab0ff">
          <HangingLamp x={-200} y={540} cord={160} color="#3f4a5a" cone={900} coneW={700} z={4} />
          <Clock x={600} y={260} r={90} speed={0.5} z={-20} />
          {[-560, -120, 320].map((x, i) => (
            <X key={x} x={x} y={-470} z={1 + i * 0.01}>
              <Part shape={roundRect(260, 260, 12)} color="#5a5a64" shade={0.25} y={130} />
              <Part shape={circle(50)} color="#3a3a42" shade={0.25} y={170} z={0.01} rot={frame * 0.2} />
              <Character
                {...WORKER(i)}
                x={150}
                y={-30}
                s={0.95}
                z={0.02}
                facing={-1}
                look={0.4}
                expression={{ eyes: "wide", mouth: "flat", brows: -0.2, eyebags: true }}
                pose={{ armF: [1.4 + Math.sin(frame * 0.5 + i) * 0.2, 0.4], armB: [1.2, 0.5] }}
              />
            </X>
          ))}
        </Barracks>
      </Stage>
      <Label text="NIGHT SHIFT" x={0.18} y={0.14} size={0.05} kind="box" at={8} />
    </AbsoluteFill>
  );
};

export { HiroponBox, Bench, Lab, Forearm, Bomb, PharmacyStreet };
