import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Line, InkLine, Glow, Wash, QuestionMark, Syringe, Ampoule, CommentBubble,
  roundRect, roundPoly, circle, blob, poly, ellipse, ramp, push, hitAt, absT, rng, type ShotProps,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  ZeroFighter, Sunburst, Ground, Cloud, Sea, Sky, Ruins, MarketStall, Flame, Smoke, SakuraTree, Petals, Hinomaru, HangingLamp, LowTable, Sun, Stars, Moon,
} from "../../kit/env";
import { Airfield, Backdrop, Barracks, ObjectBack, TatamiRoom } from "./sets";
import { PILOT, DOCTOR, KAMBARA_OLD, SOLDIER, SURVIVOR, DEALER, WORKER, GIRL, NAVY_OFFICER } from "./cast";
import { sec, pop, scr } from "./common";
import { HiroponBox } from "./actA";

// ───────────────────────── H · the second war ─────────────────────────

// H1 245.8 "But Japan's story has one more twist."
export const TwistShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 247.6, 248.4);
  const pts = Array.from({ length: 60 }, (_, i) => {
    const q = i / 59;
    const a = q * Math.PI * 3.2;
    return [interpolate(q, [0, 1], [-640, 520]) + Math.sin(a) * 40, Math.cos(a) * 160 * (1 - q * 0.4) + 40] as [number, number];
  }).slice(0, Math.max(2, Math.round(k * 60)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#5a4a6a" alt="#52435f" speed={0.6} z={-40} />
        <Ampoule x={0} y={-260} s={2.6} glow={0.7} rot={Math.sin(frame * 0.08) * 0.12} z={1} />
        {k > 0 ? <InkLine pts={pts} width={30} color="#fe5649" outline={7} z={2} /> : null}
      </Stage>
      <Label text="ONE MORE TWIST" x={0.5} y={0.14} size={0.08} kind="title" at={sec(start)(247.56)} />
    </AbsoluteFill>
  );
};

/** 1940s cabinet radio. Origin = bottom centre. */
const Radio: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundPoly([[-120, 0], [120, 0], [120, 200], [80, 260], [-80, 260], [-120, 200]], [10, 10, 40, 30, 30, 40])} color="#7a4a2a" shade={0.25} y={0} />
    <Part shape={roundRect(160, 120, 30)} color="#c9a274" flat outline={5} y={150} z={0.001} />
    {[-50, -25, 0, 25, 50].map((lx) => (
      <Line key={lx} pts={[[lx, 100], [lx, 200]]} width={4} color="#7a5232" z={0.002} />
    ))}
    {[-50, 50].map((kx) => (
      <Part key={kx} shape={circle(16)} color="#3a2a20" shade={0.2} x={kx} y={50} z={0.002} />
    ))}
  </X>
);

// H2 248.7 "When the war ends in August 1945, …"
export const WarEndsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [0, 300] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.65}>
        <TatamiRoom floorY={-300} light={0.25}>
          <LowTable x={0} y={-480} w={380} z={2} />
          <Radio x={0} y={-300} s={1.1} z={2.1} />
          {[[-560, SURVIVOR(1)], [-300, WORKER(0)], [320, GIRL(1)], [580, SURVIVOR(3)]].map(([x, c], i) => (
            <Character
              key={i}
              {...(c as ReturnType<typeof SURVIVOR>)}
              x={x as number}
              y={-470}
              s={1.05}
              z={3 + i * 0.01}
              facing={(x as number) < 0 ? 1 : -1}
              look={0.4}
              expression={{ eyes: t > 250.0 ? "closed" : "half", mouth: "flat", brows: 0.6, gaze: [0.4, -0.6] }}
              pose={{ ...poses.sit(frame), headTilt: -0.12 }}
            />
          ))}
        </TatamiRoom>
      </Stage>
      <Label text="AUGUST 1945" sub="THE WAR ENDS" x={0.5} y={0.14} size={0.085} kind="title" at={sec(start)(249.84)} />
    </AbsoluteFill>
  );
};

/** Wooden military warehouse interior with stacked crates. */
const Warehouse: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Barracks floorY={-460} light="#ffe2a8">
    {children}
  </Barracks>
);

// H3 251.45 "… the military has warehouses full of Hiropon."
export const WarehouseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03), y: -20 }} light={{ pos: [420, 300] }}>
        <Warehouse>
          {Array.from({ length: 18 }, (_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            const appear = pop(t, 252.45 + (col + row) * 0.06);
            return <HiroponBox key={i} x={-760 + col * 300} y={-470 + row * 210} s={0.78 * appear} z={1 + row * -0.01 + col * 0.001} />;
          })}
          <Character {...SOLDIER(0)} x={760} y={-560} s={1.2} z={3} facing={-1} look={0.4} expression={{ eyes: "open", mouth: "flat", brows: -0.2 }} pose={poses.handsOnHips} />
        </Warehouse>
      </Stage>
      <Label text="WAREHOUSES FULL" x={0.5} y={0.12} size={0.075} kind="box" at={sec(start)(252.45)} />
    </AbsoluteFill>
  );
};

// H4 254.25 "Instead of being destroyed, …"
export const NotDestroyedShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const walk = ramp(t, 254.3, 255.8, (x) => x);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -20 }} light={{ pos: [-300, -200] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.7} vignetteColor="#04050f">
        <Backdrop mood="night" horizon={-300} kaimon={false} />
        <X y={-300} z={-30}>
          <Ground w={5000} h={1600} color="#2e3a26" far="#34422c" pebbles={0} tufts={8} />
        </X>
        <Glow x={-420} y={-300} rx={600} ry={360} color="#ff9a4a" alpha={0.3} additive z={-5} />
        <X x={-420} y={-520} z={1}>
          <Part shape={roundRect(200, 230, 14)} color="#5a5a64" shade={0.25} y={115} />
          <Flame y={220} size={1.2} seed={5} z={0.01} />
          <Smoke y={380} w={260} h={600} alpha={0.45} z={-0.1} />
        </X>
        <Character
          {...SOLDIER(2)}
          x={interpolate(walk, [0, 1], [-60, 900])}
          y={-560}
          s={1.15}
          z={2}
          look={0.6}
          expression={{ eyes: "open", mouth: "smirk", brows: -0.3, gaze: [-0.8, 0] }}
          pose={{ ...poses.walk(frame, 1.0), armF: [1.5, 0.6], armB: [1.4, 0.7] }}
          holdF={<HiroponBox s={0.5} rot={-1.5} />}
        />
      </Stage>
      <Label text="NOT DESTROYED" x={0.24} y={0.14} size={0.065} kind="stamp" rotate={-8} at={sec(start)(255.06)} />
    </AbsoluteFill>
  );
};

/** Postwar black-market street among the ruins. */
const RuinStreet: React.FC<{ mood?: "dusk" | "day" | "night"; children?: React.ReactNode }> = ({ mood = "dusk", children }) => (
  <>
    <Backdrop mood={mood} horizon={-200} kaimon={false} clouds={mood !== "night"} />
    <X y={-200} z={-30}>
      <Ground w={5000} h={1600} color={mood === "night" ? "#3a342e" : "#8a7a66"} far={mood === "night" ? "#423a32" : "#9a8a74"} pebbles={20} tufts={0} />
    </X>
    <Ruins x={-200} y={-200} w={2400} seed={4} z={-25} />
    {children}
  </>
);

// H5 255.75 "… much of it ends up on the black market."
export const BlackMarketShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [0.6, 0.6] }}>
        <RuinStreet mood="dusk">
          <MarketStall x={120} y={-560} w={760} z={1} />
          <Character {...DEALER} x={140} y={-470} s={1.1} z={0.9} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.4 }} pose={{ armF: [1.6, 0.3], armB: [-0.2, -0.1] }} holdF={<Ampoule s={0.6} rot={-Math.PI / 2 - 0.2} />} />
          {[-120, -40, 40, 120, 200, 280, 360].map((ax, i) => (
            <Ampoule key={ax} x={ax} y={-450} s={0.55} label={false} z={1.1 + i * 0.001} />
          ))}
          <Character {...SURVIVOR(0)} x={-480} y={-560} s={1.15} z={2} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.3 }} pose={poses.idle(frame)} />
        </RuinStreet>
      </Stage>
      <Label text="BLACK MARKET" x={0.5} y={0.13} size={0.085} kind="title" at={sec(start)(256.93)} />
    </AbsoluteFill>
  );
};

// H6 257.8 "Soldiers, workers, people trying to survive in burned-out cities."
export const SurvivorsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const who = [
    { c: SOLDIER(3), at: 257.95, x: -560 },
    { c: WORKER(1), at: 258.78, x: -40 },
    { c: SURVIVOR(2), at: 259.68, x: 440 },
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0 }} light={{ dir: [0.6, 0.6] }} vignette={0.6}>
        <RuinStreet mood="day">
          {who.map(({ c, at, x }, i) => {
            const p = ramp(t, at - 0.3, at + 0.3, Easing.out(Easing.cubic));
            return (
              <Character key={i} {...c} x={x + (1 - p) * -200} y={-520} s={1.1 * (p > 0 ? 1 : 0.0001)} z={2 + i * 0.01} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.5, eyebags: true }} pose={poses.walk(frame + i * 5, 0.6)} />
            );
          })}
        </RuinStreet>
      </Stage>
      {who.map(({ at }, i) => (
        <Label key={i} text={["SOLDIERS", "WORKERS", "SURVIVORS"][i]} x={0.5 + (who[i].x) / 1920} y={0.14} size={0.05} kind="box" at={sec(start)(at)} />
      ))}
    </AbsoluteFill>
  );
};

// H7 262.4 "They all want it."
export const AllWantItShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const reach = ramp(t, 262.6, 263.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -20 }} light={{ dir: [0.6, 0.6] }}>
        <RuinStreet mood="dusk">
          <Character {...DEALER} x={560} y={-560} s={1.25} z={2} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.4 }} pose={{ armF: [1.7, 0.2], armB: [-0.2, -0.1] }} holdF={<Ampoule s={0.7} rot={-Math.PI / 2 - 0.3} glow={0.6} />} />
          {[0, 1, 2, 3].map((i) => (
            <Character
              key={i}
              {...[SOLDIER(1), WORKER(2), SURVIVOR(1), SURVIVOR(3)][i]}
              x={-640 + i * 260}
              y={-560 + (i % 2) * 20}
              s={1.1}
              z={3 - (i % 2) * 0.1 + i * 0.001}
              look={0.6}
              expression={{ eyes: "wide", mouth: "o", brows: 0.4, eyebags: true }}
              pose={{ armF: [interpolate(reach, [0, 1], [0.4, 1.7 + (i % 2) * 0.2]), 0.1], armB: [-0.2, -0.1], lean: -0.1 * reach }}
            />
          ))}
        </RuinStreet>
      </Stage>
    </AbsoluteFill>
  );
};

// H8 263.75 "By one estimate, around two million Japanese try it in the ten years after the war."
export const TwoMillionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.round(ramp(t, 265.0, 266.1, Easing.out(Easing.cubic)) * 2000000);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={22} color="#6a3a3a" alt="#5e3434" speed={0.6} z={-40} />
        {Array.from({ length: 36 }, (_, i) => {
          const col = i % 12;
          const row = Math.floor(i / 12);
          const sc = 1 - row * 0.15;
          return (
            <X key={i} x={(-825 + col * 150 + (row % 2) * 75) * sc} y={-250 + row * 90} s={sc * pop(t, 265.2 + i * 0.025)} z={1 - row * 0.1 + col * 0.001}>
              <Part shape={roundRect(84, 90, 34)} color={["#6a5a4a", "#5a5a52", "#7a6a5a", "#4a4a52"][(i + row) % 4]} shade={0.2} y={0} />
              <Part shape={circle(34)} color="#f6f5f8" shade={0.2} y={72} z={0.01} />
            </X>
          );
        })}
      </Stage>
      <Label text={n.toLocaleString("en-US")} sub="JAPANESE TRY IT" x={0.5} y={0.2} size={0.12} kind="title" at={sec(start)(265.0)} />
      <Label text="1945 – 1955" x={0.5} y={0.4} size={0.06} kind="box" at={sec(start)(267.38)} />
    </AbsoluteFill>
  );
};

// H9 268.85 "About 200,000 get hooked."
export const HookedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ pos: [0, 300] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.75} vignetteColor="#04050f">
        <RuinStreet mood="night">
          {[0, 1, 2].map((i) => (
            <Character
              key={i}
              {...SURVIVOR(i + 4)}
              x={-480 + i * 480}
              y={-470}
              s={1.15}
              z={2 + i * 0.01}
              look={0.3}
              expression={{ eyes: "half", mouth: "wavy", brows: 0.6, eyebags: true, sweat: i === 1 }}
              pose={{ ...poses.sit(frame + i * 9), headTilt: -0.1, armF: [0.3, 1.2] }}
            />
          ))}
        </RuinStreet>
      </Stage>
      <Label text="200,000" sub="ADDICTED" x={0.5} y={0.18} size={0.12} kind="title" at={sec(start)(269.3)} />
    </AbsoluteFill>
  );
};

// H10 270.95 "In 1951, Japan finally bans it."
export const BannedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), shake: hitAt(t, 273.6, 0.4) * 10 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <ObjectBack color="#2a2430" glow="#ffcf7a">
          <HiroponBox y={-340} s={1.8} z={1} />
        </ObjectBack>
      </Stage>
      <Label text="1951" x={0.16} y={0.13} size={0.08} kind="box" at={sec(start)(271.19)} />
      <Label text="BANNED" x={0.5} y={0.45} size={0.18} kind="stamp" rotate={-12} at={sec(start)(273.58)} />
    </AbsoluteFill>
  );
};

// H11 274.55 "The drug made to fight one war came home and started another."
export const AnotherWarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const right = ramp(t, 276.4, 276.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: -20 }} light={{ dir: [0.6, 0.6] }} vignette={0.6}>
        <X x={-480} z={-50}>
          <Backdrop mood="dusk" horizon={-240} kaimon={false} />
          <ZeroFighter x={0} y={120} s={0.6} gear={false} spin={1} z={20} />
        </X>
        <X x={480} z={-20}>
          <Part shape={roundRect(960, 1300, 0)} color="#0b1030" flat outline={0} z={-1} />
          <Ruins x={0} y={-260} w={1000} seed={6} smoke={false} z={0} />
          <Character {...DEALER} x={-100} y={-540} s={1.05} z={1} look={0.4} expression={{ eyes: "half", mouth: "smirk", brows: -0.4 }} pose={poses.idle(frame)} holdF={<Ampoule s={0.6} rot={-Math.PI / 2} />} />
          <Character {...SURVIVOR(6)} x={200} y={-540} s={1.05} z={1} facing={-1} look={0.4} expression={{ eyes: "half", mouth: "wavy", brows: 0.5, eyebags: true }} pose={poses.idle(frame, 2)} />
        </X>
        <Wash width={1920} height={2000} color="#04050f" alpha={0.55 * (1 - right)} z={30} />
        <Line pts={[[0, -700], [0, 700]]} width={14} z={31} />
        <Ampoule x={0} y={-120} s={2.2} glow={0.8} z={32} />
      </Stage>
      <Label text="WAR #1" x={0.25} y={0.13} size={0.07} kind="box" at={sec(start)(275.64)} />
      <Label text="WAR #2" x={0.75} y={0.13} size={0.07} kind="stamp" rotate={-6} at={sec(start)(277.38)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── I · Kambara's wish ─────────────────────────

/** Postwar home: shoji, tatami, warm evening light. */
const Home: React.FC<{ light?: number; children?: React.ReactNode }> = ({ light = 0.35, children }) => (
  <TatamiRoom floorY={-300} light={light}>
    {children}
  </TatamiRoom>
);

// I1 278.95 "And Kambara?"
export const OldKambaraShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [500, 200] }}>
        <Home>
          <Character {...KAMBARA_OLD} x={-120} y={-470} s={1.35} z={2} look={0.4} expression={{ eyes: "half", mouth: "flat", brows: 0.3 }} pose={{ ...poses.sit(frame), headTilt: 0.04 }} />
          <LowTable x={300} y={-480} w={420} z={3} />
          <X x={300} y={-290} z={3.1}>
            <Part shape={roundRect(70, 80, 10)} color="#e9e4d8" shade={0.15} y={40} />
            <Part shape={ellipse(26, 8)} color="#7a5a3a" flat outline={3} y={80} z={0.001} />
          </X>
        </Home>
      </Stage>
      <Label text="KAMBARA" sub="DECADES LATER" x={0.72} y={0.16} size={0.075} kind="title" at={sec(start)(279.33)} />
    </AbsoluteFill>
  );
};

/** Faded old photo of three young pilots. */
const OldPhoto: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <X s={s}>
    <Part shape={roundRect(260, 190, 4)} color="#f2ead8" shade={0.1} />
    <Part shape={roundRect(230, 150, 2)} color="#b8a07a" flat outline={3} y={10} z={0.001} />
    {[-70, 0, 70].map((x) => (
      <X key={x} x={x} y={10} z={0.002}>
        <Part shape={circle(22)} color="#e9dcc0" flat outline={3} y={20} />
        <Part shape={roundRect(44, 18, 8)} color="#7a6040" flat outline={3} y={36} z={0.001} />
        <Part shape={roundRect(44, 50, 10)} color="#8a7050" flat outline={3} y={-30} z={-0.001} />
      </X>
    ))}
  </X>
);

// I2 280.1 "He regretted those shots for the rest of his life."
export const RegretShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.14), y: -20 }} light={{ pos: [500, 200] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.6}>
        <Home light={0.25}>
          <Character {...KAMBARA_OLD} x={-220} y={-470} s={1.45} z={2} look={0.5} expression={{ eyes: "sad", mouth: "frown", brows: 0.7, gaze: [0.7, -0.5] }} pose={{ ...poses.sit(frame), armF: [1.25, 0.5] }} />
          <X x={190} y={-140} rot={-0.12} z={3}>
            <OldPhoto s={1.25} />
          </X>
        </Home>
      </Stage>
    </AbsoluteFill>
  );
};

// I3 282.75 '"I did a terrible thing," he said.'
export const TerribleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.4;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [500, 200] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.65}>
        <Home light={0.2} />
        <Character {...KAMBARA_OLD} x={60} y={-10 - 308 * s} s={s} z={2} look={0.3} talking={t < 284.1} expression={{ eyes: "sad", mouth: "frown", brows: 0.8 }} pose={poses.idle(frame)} />
      </Stage>
    </AbsoluteFill>
  );
};

// I4 284.9 "In March 2025, he died at the age of 101."
export const EmptySeatShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ pos: [500, 200] }} vignette={0.6}>
        <Home light={0.45}>
          <X x={-60} y={-300} z={1}>
            <Part shape={roundRect(360, 60, 24)} color="#8a3a3a" shade={0.2} y={-140} />
          </X>
          <LowTable x={240} y={-480} w={420} z={3} />
          <X x={240} y={-268} z={3.1}>
            {[-34, 34].map((gx) => (
              <Part key={gx} shape={circle(26)} color="#dff2fa" flat outline={6} x={gx} y={18} opacity={0.9} />
            ))}
            <Line pts={[[-8, 18], [8, 18]]} width={6} z={0.001} />
            <Line pts={[[-60, 20], [-110, 6]]} width={6} z={0.001} />
            <Line pts={[[60, 20], [110, 6]]} width={6} z={0.001} />
          </X>
          <Petals w={2000} h={1200} n={10} seed={3} speed={0.4} z={20} />
        </Home>
      </Stage>
      <Label text="MARCH 2025" x={0.2} y={0.13} size={0.07} kind="box" at={sec(start)(285.53)} />
      <Label text="AGE 101" x={0.78} y={0.13} size={0.07} kind="box" at={sec(start)(287.85)} />
    </AbsoluteFill>
  );
};

/** Hanging-scroll poem: brush strokes in vertical columns (not readable text). */
const PoemPaper: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <X>
    <Part shape={roundRect(520, 760, 6)} color="#f4ecd8" shade={0.08} />
    <Part shape={roundRect(560, 30, 10)} color="#5a3a26" shade={0.2} y={395} z={0.001} />
    <Part shape={roundRect(560, 30, 10)} color="#5a3a26" shade={0.2} y={-395} z={0.001} />
    {[170, 60, -50, -160].map((cx, c) =>
      Array.from({ length: 6 }, (_, i) => {
        const idx = c * 6 + i;
        if (idx / 24 > k) return null;
        const y = 290 - i * 105;
        const r = rng(idx * 13 + 5);
        const n = 2 + Math.floor(r() * 3);
        return (
          <X key={`${c}-${i}`} x={cx} y={y} z={0.002}>
            {Array.from({ length: n }, (_, k) => {
              const a = r() * Math.PI * 2;
              const len = 18 + r() * 26;
              const ox = (r() - 0.5) * 30;
              const oy = (r() - 0.5) * 50;
              const bend = (r() - 0.5) * 24;
              return (
                <Line
                  key={k}
                  pts={[[ox - Math.cos(a) * len, oy - Math.sin(a) * len], [ox + bend, oy - bend], [ox + Math.cos(a) * len, oy + Math.sin(a) * len]]}
                  width={5 + r() * 6}
                  color="#211b20"
                  smooth
                />
              );
            })}
          </X>
        );
      }),
    )}
  </X>
);

// I5 289.05 "He left behind a short poem."
export const PoemShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ pos: [500, 300] }} vignette={0.6}>
        <Home light={0.4} />
        <Wash width={4000} height={3000} color="#2a2020" alpha={0.25} z={-5} />
        <X y={40} rot={0.02} z={1}>
          <PoemPaper k={ramp(t, 289.3, 290.6, (x) => x)} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// I6 290.85 'It roughly means, "Life is as short as morning dew.'
export const DewShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 293.5, 294.1, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Sky w={5000} h={3000} y={600} top="#f2c6a8" mid="#f8dcc0" bottom="#fdf0dc" z={-40} />
        <Glow x={-500} y={200} rx={900} ry={700} color="#fff3d6" alpha={0.5} additive z={-30} />
        <X x={-80} y={-60} rot={-0.18} z={1}>
          <Part shape={blob([[-560, 0], [-300, 110], [100, 140], [480, 40], [560, 0], [480, -40], [100, -120], [-300, -100]], 10)} color="#6aa24a" shade={0.22} />
          <Line pts={[[-560, 0], [520, 0]]} width={8} color="#4a7a32" z={0.001} />
        </X>
        <X x={260} y={interpolate(fall, [0, 1], [40, -700])} s={1 - fall * 0.2} z={2}>
          <Part shape={blob([[0, 60], [34, 10], [40, -20], [20, -44], [-20, -44], [-40, -20], [-34, 10]], 8)} color="#cfeeff" shade={0.18} opacity={0.85} />
          <Part shape={ellipse(8, 14)} color="#ffffff" flat outline={0} x={-14} y={-6} rot={0.4} z={0.001} />
        </X>
      </Stage>
      <Label text="MORNING DEW" x={0.5} y={0.14} size={0.08} kind="title" at={sec(start)(293.33)} />
    </AbsoluteFill>
  );
};

/** Origami crane (orizuru). Origin = body centre, facing +x. */
const PaperCrane: React.FC<{ x?: number; y?: number; s?: number; rot?: number; flap?: number; z?: number; color?: string }> = ({ x = 0, y = 0, s = 1, rot = 0, flap = 0, z = 0, color = "#f4f1ea" }) => (
  <X x={x} y={y} s={s} rot={rot} z={z}>
    <Part shape={poly([[-160, 10], [0, -40], [150, 10], [0, 30]])} color={color} shade={0.2} />
    <Part shape={poly([[120, 0], [180, 120], [200, 110], [150, 0]])} color={color} shade={0.2} z={0.001} />
    <Part shape={poly([[180, 120], [230, 110], [200, 104]])} color={color} shade={0.2} z={0.002} />
    <Part shape={poly([[-120, 0], [-210, 90], [-150, 0]])} color={color} shade={0.2} z={0.001} />
    <X sy={1 - flap * 0.6} z={0.003}>
      <Part shape={poly([[-60, 10], [60, 10], [-20, 220]])} color="#e8e2d6" shade={0.2} />
    </X>
  </X>
);

// I7 294.2 "I leave behind one wish."
export const WishShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <Sunburst r={2600} rays={20} color="#f2d8b0" alt="#ecd0a4" speed={0.3} z={-40} />
        <Glow rx={800} ry={600} color="#fff6e0" alpha={0.5} additive z={-39} />
        <PaperCrane x={-40} y={-60 + Math.sin(frame * 0.08) * 16} s={1.5 * pop(t, 294.5)} flap={(Math.sin(frame * 0.2) + 1) / 2} z={1} />
      </Stage>
      <Label text="ONE WISH" x={0.5} y={0.16} size={0.085} kind="title" at={sec(start)(295.19)} />
    </AbsoluteFill>
  );
};

// I8 296.05 '"No more war."'
export const NoMoreWarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.7] }}>
        <Sky w={5000} h={3000} y={1400 - 200} top="#7fa6d6" mid="#e9c3b4" bottom="#fbe1c4" z={-40} />
        <Sun x={0} y={-160} r={160} z={-35} />
        <Sea w={5000} h={1400} y={-200} color="#5a8ab8" z={-30} />
        <SakuraTree x={-760} y={-260} h={520} seed={4} z={-5} />
        <SakuraTree x={820} y={-280} h={480} seed={8} z={-5} />
        <Petals w={2400} h={1400} n={24} seed={11} speed={0.6} z={20} />
        <PaperCrane x={260} y={220 + Math.sin(frame * 0.07) * 20} s={0.5} flap={(Math.sin(frame * 0.25) + 1) / 2} z={5} />
      </Stage>
      <Label text="NO MORE WAR" x={0.5} y={0.2} size={0.12} kind="title" at={sec(start)(296.19)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── J · outro ─────────────────────────

// J1 297.4 "So, what do you think?"
export const WhatThinkShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="dawn" planes>
          <Character {...PILOT(0)} x={-300} y={-580} s={1.35} z={2} look={0.1} expression={{ eyes: "open", mouth: "flat", brows: 0.3 }} pose={poses.idle(frame)} />
          <Character {...DOCTOR} x={300} y={-580} s={1.35} z={2} facing={-1} look={0.1} expression={{ eyes: "open", mouth: "flat", brows: 0.3 }} pose={{ armF: [1.4, 0.5], armB: [-0.2, -0.1] }} holdF={<Ampoule s={0.6} rot={-Math.PI / 2 + 0.2} />} />
          <QuestionMark x={0} y={260} s={1.0 * pop(t, 298.44)} rot={0.1} z={5} />
        </Airfield>
      </Stage>
    </AbsoluteFill>
  );
};

// J2 298.95 "If you were that young doctor, would you have asked what was inside the brown glass?"
export const WouldYouAskShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <ObjectBack color="#2a2430" glow="#ffcf7a">
          <Character {...DOCTOR} x={-360} y={-60 - 308 * s} s={s} z={1} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.5, gaze: [0.7, -0.2] }} pose={{ armF: [1.6, 0.6], armB: [-0.2, -0.1] }} />
          <Ampoule x={380} y={-300} s={3.0} glow={t > 302.2 ? 1 : 0.4} z={2} />
          <QuestionMark x={560} y={240} s={0.9 * pop(t, 302.54)} rot={0.15} z={3} />
        </ObjectBack>
      </Stage>
      <Label text="WOULD YOU HAVE ASKED?" x={0.5} y={0.12} size={0.07} kind="box" at={sec(start)(301.07)} />
    </AbsoluteFill>
  );
};

// J3 303.3 "Tell me in the comments."
export const CommentsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={22} color="#e9c98a" alt="#e1bd7a" speed={0.6} z={-40} />
        {[[-560, 160, -0.1], [0, 260, 0.05], [560, 140, 0.12]].map(([x, y, r], i) => (
          <CommentBubble key={i} x={x} y={y + Math.sin(frame * 0.1 + i) * 10} rot={r} s={0.9 * pop(t, 303.6 + i * 0.2)} z={2 + i * 0.01} />
        ))}
        <Character {...PILOT(1)} x={-300} y={-600} s={1.15} z={3} look={0.1} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame)} />
        <Character {...DOCTOR} x={300} y={-600} s={1.15} z={3} facing={-1} look={0.1} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 3)} />
      </Stage>
      <Label text="TELL ME IN THE COMMENTS" x={0.5} y={0.12} size={0.07} kind="box" at={sec(start)(303.6)} />
    </AbsoluteFill>
  );
};
