import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Glow, Line, InkLine, Arrow, Bow, Spear, Plank, Hammer, Scroll, Quill, Ladle, Bucket, Shovel, DirtSpray, HandTorch,
  RagBall, FlyingArrow, QuestionMark, FlameFace, RomanFireHead, Crosshair, Palisade, Wash, roundRect, ellipse, blob, poly, ramp, push, hitAt, absT,
  type ShotProps,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Ground, City, GreekHouse, OldDoor, Barricade, Tent, Banner, Brazier, Smoke, FireLine, MysticSmoke, Tripod, Trireme, Splash, Sunburst,
  Battlement, Tower, Hide, SiegeTower, BatteringRam, Flame,
} from "../../kit/env";
import { Backdrop, AcropolisTop, AthensWide, TempleInterior, SeaSet } from "../woodenwall/sets";
import { DEFENDERS, TEMPLE_KEEPER, PERSIAN, PYTHIA, ENVOY } from "../woodenwall/cast";
import { DayField } from "./sets";
import { ARCHER, ENEMY, GREEK_WRITER, AMMIANUS, ROMAN } from "./cast";
import { drawPose } from "./actA";
import { WriterDesk, Interior } from "./actB";

const HERODOTUS = { ...GREEK_WRITER, outfit: { ...GREEK_WRITER.outfit, trim: "#a3302a", sash: "#a3302a" }, hairColor: "#3a2a22", beardColor: "#3a2a22", seed: 33 };

/** Assyrian soldier for the stone-relief shots (long square beard). */
const ASSYRIAN = (i = 0) => ({
  outfit: { top: ["#a08a64", "#8f7a56"][i % 2], hem: 30, belt: "#6e5a3e", trim: "#6e5a3e" },
  hair: "long" as const,
  hairColor: "#3a2e26",
  beard: "royal" as const,
  beardColor: "#3a2e26",
  seed: 80 + i,
});

const sec = (from: number) => (s: number) => Math.round((s - from) * 30);

/** Red "✗" and green "✓" marks. */
const Cross: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 30 }) => (
  <X x={x} y={y} s={s} z={z}>
    <InkLine pts={[[-90, 90], [90, -90]]} width={34} color="#fe5649" outline={8} />
    <InkLine pts={[[-90, -90], [90, 90]]} width={34} color="#fe5649" outline={8} />
  </X>
);
const Check: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 30 }) => (
  <X x={x} y={y} s={s} z={z}>
    <InkLine pts={[[-90, 0], [-30, -70], [100, 90]]} width={34} color="#5fbf4a" outline={8} />
  </X>
);

/** Pop-in scale (overshoot) for marks and props. */
const pop = (t: number, at: number) => interpolate(t, [at, at + 0.12, at + 0.22], [0, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ───────────────────────── G · Athens ─────────────────────────

// G1 198.45 "Athens, 484 BC."
export const AthensTitleShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.76, 0.82), y: 10 }} light={{ dir: [-0.8, 0.6] }}>
        <AthensWide mood="warm" rockX={260} />
      </Stage>
      <Label text="ATHENS" sub="ANCIENT GREECE" x={0.24} y={0.2} size={0.1} kind="title" at={6} />
    </AbsoluteFill>
  );
};

// G2 200.6 "A huge Persian army marches into the city."
export const PersianMarchShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const groundY = -420;
  const rows = [
    { y: groundY + 210, s: 0.5, n: 14, z: 1 },
    { y: groundY + 80, s: 0.66, n: 11, z: 2 },
    { y: groundY - 70, s: 0.85, n: 9, z: 3 },
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ x: interpolate(frame, [0, dur], [160, -160]), zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="warm" horizon={groundY + 300} />
        <Ground w={6000} h={1600} y={groundY + 300} color="#d6b986" far="#e3c999" pebbles={30} tufts={12} tuftColor="#8a8a52" z={-20} />
        <City w={4400} y={groundY + 280} scale={0.9} rows={2} seed={8} z={-15} />
        {rows.map((r, ri) => (
          <X key={ri} z={r.z}>
            {Array.from({ length: r.n }, (_, i) => (
              <Character
                key={i}
                {...PERSIAN(i + ri)}
                x={-1500 + i * 300 * (r.s / 0.66) + ri * 90 - frame * 3.2 * r.s}
                y={r.y}
                s={r.s}
                z={i * 0.001}
                facing={-1}
                look={0.6}
                shadow={ri === 2}
                expression={{ eyes: i % 3 === 0 ? "angry" : "half", mouth: "flat", brows: -0.5 }}
                pose={poses.walk(frame + i * 3 + ri * 11, 1.2)}
                holdF={<Spear rot={-0.1} length={460} />}
              />
            ))}
            {ri === 1 ? [-700, 100, 900].map((x, k) => <Banner key={k} x={x - frame * 2.1} y={r.y + 20} pole={420} seed={k} z={0.5} />) : null}
          </X>
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// G3 203.25 "Most Athenians have already left."
export const EmptyCityShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const groundY = -380;
  const walk = frame * 5;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 30 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="warm" horizon={groundY + 200} mountains={false} />
        <City w={3600} y={groundY + 170} scale={0.8} rows={1} seed={21} z={-14} />
        <Ground w={5000} h={1600} y={groundY + 160} color="#dcc79e" pebbles={14} tufts={4} z={-12} />
        {[-760, -280, 280, 760].map((x, i) => (
          <GreekHouse key={x} x={x} y={groundY + 60} w={400} h={300} window={i % 2 === 0} z={-10 + i * 0.01} />
        ))}
        <X x={-120} y={groundY - 20} rot={0.3} z={-2}>
          <Scroll s={0.9} open={0} />
        </X>
        {[0, 1].map((i) => (
          <Character
            key={i}
            {...ENVOY(i)}
            x={-420 - i * 220 - walk}
            y={groundY - 120 - i * 20}
            s={0.9}
            z={1 + i * 0.01}
            facing={-1}
            look={i === 1 ? -0.4 : 0.5}
            expression={{ eyes: i === 1 ? "sad" : "half", mouth: "frown", brows: 0.6 }}
            pose={poses.walk(frame + i * 7, 1.1)}
          />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// G4 205.3 "But a small group stays behind on the Acropolis, the rocky hill in the middle of the city."
export const AcropolisStayShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 205.6, 209.6, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: interpolate(k, [0, 1], [0.84, 1.55]), y: interpolate(k, [0, 1], [80, 390]), x: interpolate(k, [0, 1], [0, -140]) }} light={{ dir: [-0.8, 0.6] }}>
        <AthensWide mood="warm">
          {DEFENDERS.map((d, i) => (
            <Character key={i} {...d} x={-250 + i * 70} y={326} s={0.2} z={-17 + i * 0.01} shadow={false} facing={i % 2 ? -1 : 1} expression={{ eyes: "dot", mouth: "flat" }} pose={poses.idle(frame, i)} />
          ))}
        </AthensWide>
      </Stage>
      <Label text="ACROPOLIS" x={0.5} y={0.12} size={0.065} kind="box" at={sec(start / 30)(207.26)} />
    </AbsoluteFill>
  );
};

// G5 210.0 "Why?"
export const WhyStayShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.25 + hitAt(t, 210.2, 0.4) * 0.05, y: -120 }} light={{ dir: [-0.8, 0.6] }}>
        <AcropolisTop wall={false} />
        <Character {...DEFENDERS[2]} x={-160} y={-560} s={1.3} z={1} look={0.2} expression={{ eyes: "open", mouth: "o", brows: 0.8 }} pose={poses.shrug(ramp(t, 210.05, 210.3))} />
        <QuestionMark x={260} y={40} s={1.3 * pop(t, 210.2)} rot={0.15} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};

// G6 210.85 "Because of a prophecy. Before the war, the oracle at Delphi told the Athenians …"
export const OracleShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const floorY = -520;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ pos: [240, -60] }} shadowMul={[0.6, 0.55, 0.7]} vignette={0.7} vignetteColor="#0d0610">
        <TempleInterior floorY={floorY}>
          <MysticSmoke x={240} y={floorY + 260} w={360} h={1100} z={1} />
          <Tripod x={240} y={floorY} h={260} s={1.1} z={2} />
          <Character {...PYTHIA} x={250} y={floorY + 230} s={1.15} facing={-1} look={0.35} z={3} talking={t > 213.4 && t < 215.2} expression={{ eyes: t > 213.4 ? "half" : "closed", mouth: "flat" }} pose={poses.sit(frame)} shadow={false} />
          <Glow x={240} y={floorY + 380} rx={600} color="#b98cff" alpha={0.25} additive z={4} />
          {[0, 1].map((i) => (
            <Character key={i} {...ENVOY(i)} x={-260 - i * 190} y={floorY - 40 - i * 30} s={1.05} z={5 + i * 0.1} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: 0.5, gaze: [0.8, 0.4] }} pose={i === 0 ? poses.holdOut : poses.think} />
          ))}
        </TempleInterior>
      </Stage>
      <Label text="DELPHI" sub="THE ORACLE" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start / 30)(213.67)} />
    </AbsoluteFill>
  );
};

// G7 215.4 "… that a wooden wall would keep them safe."
export const ProphecyWallShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 215.5, 215.95, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#4a2a5a" alt="#3e2250" z={-20} />
        <MysticSmoke y={-300} w={1600} h={900} z={-10} />
        <Glow y={-120} rx={900} ry={420} color="#ffd27a" alpha={0.35 * rise} additive z={-5} />
        <X y={-330} sy={rise} z={1}>
          <Barricade w={1100} h={340} />
        </X>
      </Stage>
      <Label text="“A WOODEN WALL”" x={0.5} y={0.16} size={0.08} kind="title" at={sec(start / 30)(215.61)} />
    </AbsoluteFill>
  );
};

// G8 217.4 "Most of them thought it meant ships."
export const ShipsMeantShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.8, 0.6] }}>
        <SeaSet mood="day" horizon={60}>
          {[-260, 340, 860].map((x, i) => (
            <Trireme key={x} x={x + frame * 1.5} y={-20 - i * 30} len={560 - i * 40} seed={i + 2} crew={4} z={1 + i * 0.01} />
          ))}
          <X y={-560} z={3}>
            <Part shape={roundRect(1500, 140, 8)} color="#8a5a32" shade={0.2} x={-560} />
          </X>
          {[0, 1].map((i) => (
            <Character
              key={i}
              {...ENVOY(i)}
              x={-720 + i * 200}
              y={-500 - i * 10}
              s={1.15}
              z={4 + i * 0.01}
              look={0.6}
              talking={i === 0 && t > 218.0}
              expression={{ eyes: "happy", mouth: "grin", gaze: [0.8, 0.2] }}
              pose={i === 0 ? poses.point(frame) : poses.handsOnHips}
            />
          ))}
        </SeaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// G9 219.2 "But these men take it literally."
export const LiterallyShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const nod = t > 220.2 ? Math.max(0, Math.sin((t - 220.2) * 9)) * 0.08 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -80 }} light={{ dir: [-0.8, 0.6] }}>
        <AcropolisTop wall={false} />
        <Character {...DEFENDERS[1]} x={-320} y={-600} s={1.3} z={1} look={0.4} expression={{ eyes: "angry", mouth: "smirk", brows: -0.4 }} pose={{ armF: [0.25, 0.1], armB: [-0.3, -0.2], headTilt: -nod }} holdF={<Plank w={380} rot={0.1} y={-10} />} />
        <OldDoor x={360} y={-640} w={260} h={440} z={1.5} />
        <Character {...DEFENDERS[3]} x={160} y={-620} s={1.3} z={2} facing={-1} look={0.4} expression={{ eyes: "half", mouth: "smirk", brows: -0.3 }} pose={{ armF: [1.2, 0.3], armB: [-0.2, -0.1], headTilt: -nod }} />
      </Stage>
      <Label text="LITERALLY" x={0.5} y={0.16} size={0.07} kind="stamp" rotate={-6} at={sec(start / 30)(220.28)} />
    </AbsoluteFill>
  );
};

// G10 220.95 "So they block the way up with wooden planks and doors, …"
export const BlockWayShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const build = Math.ceil(ramp(t, 221.2, 223.4, (x) => x) * 6) / 6;
  const swing = Math.sin(frame * 0.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -40, shake: Math.max(0, swing) * 2 }} light={{ dir: [-0.8, 0.6] }}>
        <AcropolisTop wall={false}>
          <X y={-380} sy={Math.max(0.02, build)} z={-5}>
            <Barricade w={1000} h={320} />
          </X>
          <Character {...DEFENDERS[0]} x={-700} y={-520} s={1.05} z={1} look={0.5} expression={{ eyes: "angry", mouth: "teeth", brows: -0.5 }} pose={{ armF: [1.6 + swing * 0.5, 0.6], armB: [0.9, 0.4] }} holdF={<Hammer rot={-0.4} />} />
          <Character {...DEFENDERS[2]} x={640} y={-540} s={1.05} z={1} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.2 }} pose={poses.walk(frame, 0.6)} holdF={<Plank w={320} rot={0.05} y={-10} />} />
        </AcropolisTop>
      </Stage>
    </AbsoluteFill>
  );
};

// G11 223.85 "… and they wait."
export const WaitShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -200 }} light={{ dir: [-0.8, 0.5] }}>
        <AcropolisTop mood="dusk">
          {DEFENDERS.map((d, i) => (
            <Character key={i} {...d} x={-480 + i * 320} y={-600 - (i % 2) * 20} s={1.0} z={1 + i * 0.01} facing={i < 2 ? 1 : -1} look={0.3} expression={{ eyes: i === 1 ? "half" : "open", mouth: "flat", gaze: [0.6, 0] }} pose={poses.sit(frame + i * 9)} />
          ))}
        </AcropolisTop>
      </Stage>
    </AbsoluteFill>
  );
};

// G12 225.1 "The Persians take a hill right across from them."
export const PersianHillShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 225.2, 227.0, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ x: interpolate(k, [0, 1], [-420, 420]), y: interpolate(k, [0, 1], [180, 160]), zoom: interpolate(k, [0, 1], [1.0, 1.25]) }} light={{ dir: [-0.8, 0.6] }}>
        <AthensWide mood="warm" persians rockX={-520} />
      </Stage>
      <Label text="PERSIANS" x={0.62} y={0.22} size={0.06} kind="box" at={sec(start / 30)(225.6)} />
    </AbsoluteFill>
  );
};

// G13 227.45 "Then, Herodotus says, …"
export const HerodotusShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const write = Math.sin(frame * 0.6) * 0.15;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 20 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.65}>
        <Interior>
          <Character {...HERODOTUS} x={-140} y={-540} s={1.5} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", gaze: [0.5, -0.8] }} pose={{ armF: [1.0 + write, 0.6], armB: [0.4, 0.8] }} holdF={<Quill rot={2.4} s={0.6} />} />
          <WriterDesk x={60} y={-560} s={1.2} z={2} />
        </Interior>
      </Stage>
      <Label text="HERODOTUS" sub="GREEK HISTORIAN" x={0.5} y={0.12} size={0.06} kind="box" at={6} />
    </AbsoluteFill>
  );
};

/** Persian camp backdrop for close-ups. */
const PersianCamp: React.FC<{ horizon?: number; children?: React.ReactNode }> = ({ horizon = -160, children }) => (
  <>
    <Backdrop mood="warm" horizon={horizon} />
    <Ground w={5000} h={1600} y={horizon} color="#cdb48a" pebbles={10} tufts={6} z={-20} />
    {[-700, -260, 300, 760].map((x, i) => (
      <Tent key={x} x={x} y={horizon - 10} w={320} h={230} z={-18 + i * 0.01} />
    ))}
    {[-480, 80, 560].map((x, i) => (
      <Banner key={x} x={x} y={horizon - 20} pole={460} seed={i} z={-17 + i * 0.01} />
    ))}
    {children}
  </>
);

// G14 229.1 "… they wrap their arrows in plant fiber and set them on fire."
export const WrapFiberShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wrap = ramp(t, 229.6, 230.9);
  const dip = ramp(t, 230.9, 231.3);
  const lit = ramp(t, 231.4, 231.7);
  const ax = interpolate(dip, [0, 1], [-130, 0]);
  const ay = interpolate(dip, [0, 1], [-300, -262]);
  const ar = interpolate(dip, [0, 1], [0.35, -0.12]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.8, 0.6] }}>
        <PersianCamp>
          <Character {...PERSIAN(1)} x={-420 + dip * 100} y={-640} s={1.55} z={1} look={0.6} expression={{ eyes: "half", mouth: "smirk", brows: -0.4, gaze: [0.9, -0.2] }} pose={{ armF: [1.35, 0.25], armB: [1.1 + Math.sin(frame * 0.9) * 0.15 * (1 - dip), 0.6] }} />
          <X x={ax} y={ay} rot={ar} z={2}>
            <Arrow length={320} />
            <RagBall x={300} s={0.35 + wrap * 0.6} lit={lit} />
          </X>
          <Part shape={roundRect(240, 144, 10)} color="#a9a3a0" shade={0.2} x={300} y={-568} z={1.4} />
          <Brazier x={300} y={-496} s={1.4} z={1.5} />
        </PersianCamp>
      </Stage>
    </AbsoluteFill>
  );
};

// G15 232.2 "And they shoot them at the wooden wall."
export const VolleyShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 220, x: -120 }} light={{ dir: [-0.8, 0.6] }}>
        <AthensWide mood="warm" persians rockX={-520} />
        {Array.from({ length: 9 }, (_, i) => (
          <FlyingArrow
            key={i}
            from={[420 + (i % 3) * 70, 190]}
            via={[-180, 620 + (i % 4) * 30]}
            to={[-900 + (i % 5) * 28, 300 + (i % 3) * 22]}
            p={(t - 232.35 - i * 0.11) / 0.85}
            fire={1}
            trail="comet"
            trailLen={0.2}
            s={0.45}
            z={5 + i * 0.01}
            seed={i}
          />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

/** Close view of the Acropolis barricade from the outside, with stuck burning arrows. */
const BarricadeClose: React.FC<{ burn?: number; arrows?: number; mood?: "warm" | "fire" | "dusk"; children?: React.ReactNode }> = ({ burn = 0, arrows = 0, mood = "warm", children }) => (
  <AcropolisTop mood={mood} wallY={-430} wallW={1700} wallH={420} burn={burn}>
    {Array.from({ length: arrows }, (_, i) => (
      <X key={i} x={-600 + i * 260 + (i % 2) * 40} y={-200 + (i % 3) * 70} rot={Math.PI - 0.35 + (i % 3) * 0.08} z={2 + i * 0.01}>
        <Arrow x={-150} fire fireSize={0.9} seed={i} />
      </X>
    ))}
    {children}
  </AcropolisTop>
);

// G16 233.9 "A wall of dry planks and old doors."
export const DryPlanksShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -140 }} light={{ dir: [-0.8, 0.6] }}>
        <BarricadeClose />
      </Stage>
      <Label text="DRY PLANKS" x={0.3} y={0.2} size={0.065} kind="box" at={f(234.54)} />
      <Label text="OLD DOORS" x={0.7} y={0.2} size={0.065} kind="box" at={f(235.46)} />
    </AbsoluteFill>
  );
};

// G17 236.5 "The perfect target."
export const PerfectTargetShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lock = ramp(t, 236.6, 237.0, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.12, y: -140 }} light={{ dir: [-0.8, 0.6] }}>
        <BarricadeClose />
        <Crosshair y={-200} r={220} s={interpolate(lock, [0, 1], [2.6, 1])} rot={(1 - lock) * 0.8} z={20} />
      </Stage>
    </AbsoluteFill>
  );
};

// G18 237.7 "It burns."
export const ItBurnsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 237.8, 238.3);
  const hit = hitAt(t, 238.0, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.08 + hit * 0.05, y: -140, shake: hit * 12 }} light={{ dir: [-0.8, 0.6] }} shadowMul={[0.6, 0.52, 0.6]}>
        <BarricadeClose burn={burn} arrows={5} mood="dusk" />
        <Glow y={-200} rx={1200} ry={500} color="#ff6a2a" alpha={0.3 * burn} additive z={15} />
      </Stage>
    </AbsoluteFill>
  );
};

// G19 238.7 "The Persians climb up the hill, …"
export const ClimbShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const slope = (x: number) => -260 + x * 0.42;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0, rot: -0.04 }} light={{ dir: [-0.6, 0.8] }}>
        <Backdrop mood="dusk" horizon={-100} />
        <Glow x={700} y={500} rx={900} color="#ff6a2a" alpha={0.35} additive z={-25} />
        <Smoke x={760} y={300} w={400} h={1400} alpha={0.5} seed={4} z={-24} />
        <Part shape={blob([[-1400, -900], [1400, -900], [1400, slope(1400)], [700, slope(700) + 30], [0, slope(0) - 10], [-700, slope(-700) + 20], [-1400, slope(-1400)]], 30)} color="#c9b18c" shade={0.2} z={-5} />
        {Array.from({ length: 6 }, (_, i) => {
          const x = -1000 + i * 330 + frame * 2.2;
          return (
            <Character
              key={i}
              {...PERSIAN(i)}
              x={x}
              y={slope(x) - 30}
              s={0.95}
              z={1 + i * 0.01}
              look={0.6}
              expression={{ eyes: "angry", mouth: i % 2 ? "teeth" : "flat", brows: -0.6 }}
              pose={{ ...poses.walk(frame + i * 5, 1.1), lean: -0.18 }}
              holdF={<Spear rot={-0.25} length={460} />}
            />
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// G20 240.4 "… and the men on the Acropolis are killed."
export const KilledShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -120 }} light={{ dir: [-0.6, 0.8] }} shadowMul={[0.55, 0.48, 0.55]} vignette={0.8} vignetteColor="#120404">
        <AcropolisTop mood="fire" burn={1} templeBurn={0.6} wallY={-430} wallW={1700} wallH={420}>
          <Smoke x={-300} y={-100} w={500} h={1600} alpha={0.55} seed={3} z={4} />
          <X x={-260} y={-590} rot={Math.PI / 2 - 0.08} z={6}>
            <Spear length={520} />
          </X>
          <Plank x={340} y={-600} w={300} rot={0.15} z={6} />
        </AcropolisTop>
        <Glow y={-100} rx={1400} ry={700} color="#ff4a2a" alpha={0.25} additive z={10} />
      </Stage>
    </AbsoluteFill>
  );
};

// G21 242.4 "The wooden wall that was supposed to save them goes up in flames."
export const WallFlamesShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.15), y: 230, x: -60 }} light={{ dir: [-0.6, 0.8] }} shadowMul={[0.55, 0.48, 0.55]} vignette={0.75} vignetteColor="#120404">
        <AthensWide mood="fire" burn={1} />
        <Glow y={300} rx={1400} ry={700} color="#ff5a2a" alpha={0.2} additive z={10} />
      </Stage>
    </AbsoluteFill>
  );
};

// G22 245.8 "And the other wooden wall? The ships."
export const OtherWallShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 247.6, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0) + hit * 0.05, x: frame * 1.5, y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <SeaSet mood="day" horizon={260}>
          {[[-700, 200, 420], [-100, 220, 440], [520, 190, 420], [-420, 20, 640], [380, 0, 640], [-80, -260, 900]].map(([x, y, len], i) => (
            <Trireme key={i} x={x + frame * (i < 3 ? 2 : 3)} y={y} len={len} seed={i + 4} crew={i < 3 ? 3 : 5} z={i < 3 ? 1 + i * 0.01 : 2 + i * 0.1} />
          ))}
        </SeaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// G23 248.3 "Soon after, the Athenian fleet crushes the Persians at Salamis."
export const SalamisShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const impact = 250.6;
  const approach = ramp(t, 248.4, impact, Easing.in(Easing.quad));
  const after = Math.max(0, t - impact);
  const sink = ramp(t, impact + 0.2, impact + 1.8);
  const hit = hitAt(t, impact, 0.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.8 + hit * 0.04, y: 60, shake: hit * 18 }} light={{ dir: [-0.8, 0.6] }}>
        <SeaSet mood="day" horizon={420}>
          <Trireme x={-1000 + approach * 300} y={320} len={460} seed={7} sail={false} z={1} />
          <X x={1100 - approach * 300} y={310} sx={-1} z={1.1}>
            <Trireme len={440} seed={8} sail={false} />
          </X>
          <X x={340} y={-120} sx={-1} z={3}>
            <Trireme len={1000} side="persian" seed={3} sink={sink} crack={t > impact ? 1 : 0} crew={6} sail row={t > impact ? 0 : 0.6} />
          </X>
          <Trireme x={-1080 + approach * 620 - after * 30} y={-160} len={1000} seed={1} crew={6} sail z={4} />
          <Splash x={40} y={-110} t={ramp(t, impact, impact + 1.0, (x) => x)} size={1.8} z={6} />
          <Splash x={360} y={-90} t={ramp(t, impact + 0.6, impact + 1.5, (x) => x)} size={1.2} seed={5} z={6} />
        </SeaSet>
      </Stage>
      <Label text="SALAMIS" x={0.5} y={0.12} size={0.07} kind="box" at={sec(start / 30)(251.9)} />
    </AbsoluteFill>
  );
};

// G24 253.1 "So the oracle was right."
export const OracleRightShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const floorY = -560;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.22), y: -80, x: 120 }} light={{ pos: [240, -60] }} shadowMul={[0.6, 0.55, 0.7]} vignette={0.7} vignetteColor="#0d0610">
        <TempleInterior floorY={floorY}>
          <MysticSmoke x={240} y={floorY + 260} w={360} h={1100} z={1} />
          <Tripod x={240} y={floorY} h={260} s={1.1} z={2} />
          <Character {...PYTHIA} x={250} y={floorY + 230} s={1.15} facing={-1} look={0.6} z={3} expression={{ eyes: "half", mouth: "smirk", brows: -0.3 }} pose={{ ...poses.sit(frame), armF: [0.9, -1.9], armB: [-0.9, 1.9] }} shadow={false} />
          <Check x={-260} y={60} s={1.2 * pop(t, 253.95)} z={10} />
        </TempleInterior>
      </Stage>
    </AbsoluteFill>
  );
};

// G25 254.55 "Those men picked the wrong wall."
export const WrongWallShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.8, 0.6] }}>
        <X x={-480} z={-30}>
          <Part shape={roundRect(960, 1200, 0)} color="#3e2a2a" flat outline={0} />
          <Glow y={-200} rx={700} color="#ff6a2a" alpha={0.25} additive />
          <Smoke y={-200} w={300} h={1200} alpha={0.5} seed={9} z={0.5} />
          <Barricade y={-330} w={720} h={300} char={1} burn={0.35} z={1} />
        </X>
        <X x={480} z={-30}>
          <Part shape={roundRect(960, 1200, 0)} color="#4f9fd9" flat outline={0} />
          <Part shape={roundRect(960, 600, 0)} color="#2f6f9a" flat outline={0} y={-300} z={0.1} />
          <Trireme y={-150} len={700} seed={5} crew={4} z={1} />
        </X>
        <Part shape={roundRect(14, 1200, 0)} color="#211b20" flat outline={0} z={5} />
        <Cross x={-480} y={150} s={1.1 * pop(t, 255.62)} />
        <Check x={480} y={150} s={1.1 * pop(t, 255.95)} />
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── H · Defending the wall ─────────────────────────

// H1 256.6 "Now switch sides."
export const SwitchSidesShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 256.95, 257.5, Easing.inOut(Easing.cubic));
  const arc = Math.sin(k * Math.PI) * 160;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#2a3a5a" alt="#24304e" speed={k * 2} z={-20} />
        <Character {...ARCHER} x={interpolate(k, [0, 1], [-420, 420])} y={-420 + arc} s={1.2} z={1} facing={k < 0.5 ? 1 : -1} look={0.5} expression={{ eyes: "wide", mouth: "o" }} pose={poses.idle(frame)} holdF={<Bow rot={-0.2} />} />
        <Character {...ENEMY(0)} x={interpolate(k, [0, 1], [420, -420])} y={-420 - arc * 0.5} s={1.2} z={1.1} facing={k < 0.5 ? -1 : 1} look={0.5} expression={{ eyes: "angry", mouth: "flat", brows: -0.5 }} pose={poses.idle(frame, 3)} />
      </Stage>
      <Label text="SWITCH SIDES" x={0.5} y={0.14} size={0.075} kind="box" at={sec(start / 30)(256.85)} />
    </AbsoluteFill>
  );
};

// H2 257.95 "You're defending the wall, and the enemy is shooting fire at it."
export const DefendWallShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-60}>
          <Character {...ARCHER} x={-260} y={-420} s={1.3} z={2} look={0.6} expression={{ eyes: t > 260.2 ? "wide" : "open", mouth: t > 260.2 ? "o" : "flat", brows: 0.4, gaze: [0.9, 0] }} pose={poses.holdOut} holdF={<Bow rot={-0.4} />} />
          <Palisade y={-640} w={2600} h={520} z={3} />
          {Array.from({ length: 5 }, (_, i) => (
            <FlyingArrow key={i} from={[1300, 180 + i * 30]} via={[700, 320]} to={[-500 + i * 300, -330 + (i % 2) * 60]} p={(t - 259.85 - i * 0.18) / 0.55} fire={1} trail="comet" trailLen={0.12} s={0.9} z={4 + i * 0.01} seed={i} />
          ))}
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// H3 261.05 "What do you do?"
export const WhatDoYouDoShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.35, y: -40, shake: 3 }} light={{ pos: [600, -300] }} shadowMul={[0.6, 0.52, 0.6]}>
        <DayField horizon={-60}>
          <Character {...ARCHER} x={-160} y={-560} s={1.3} z={2} look={0.3} expression={{ eyes: "wide", mouth: "wavy", brows: 1, sweat: true, gaze: [0.6, -0.2] }} pose={poses.scared(frame)} />
          <Palisade y={-760} w={2600} h={520} z={3} />
          <FireLine x={500} y={-300} w={500} intensity={1} seed={3} z={4} />
          <QuestionMark x={300} y={130} s={pop(t, 261.25)} rot={0.15} z={6} />
        </DayField>
      </Stage>
    </AbsoluteFill>
  );
};

// H4 262.2 "Around 350 BC, a Greek writer named Aeneas …"
export const AeneasShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const write = Math.sin(frame * 0.6) * 0.15;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 20 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.65}>
        <Interior>
          <Character {...GREEK_WRITER} x={-140} y={-540} s={1.5} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", gaze: [0.5, -0.8] }} pose={{ armF: [1.0 + write, 0.6], armB: [0.4, 0.8] }} holdF={<Quill rot={2.4} s={0.6} />} />
          <WriterDesk x={60} y={-560} s={1.2} z={2} />
        </Interior>
      </Stage>
      <Label text="AENEAS" sub="GREEK WRITER" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start / 30)(265.13)} />
      <Label text="~350 BC" x={0.8} y={0.4} size={0.06} color="#fe5649" at={sec(start / 30)(262.75)} />
    </AbsoluteFill>
  );
};

// H5 265.75 "… wrote a whole handbook on how to survive a siege."
export const HandbookShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const open = ramp(t, 265.85, 266.4, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#6a4a2a" alt="#5a3e24" z={-20} />
        <X y={330} s={3.6} z={1}>
          <Scroll w={240} open={open} />
        </X>
      </Stage>
      <Label text={"HOW TO SURVIVE\nA SIEGE"} x={0.5} y={0.47} size={0.07} color="#3a2a22" kind="tag" at={sec(start / 30)(266.5)} />
    </AbsoluteFill>
  );
};

// H6 268.3 "His advice?"
export const AdviceShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.3, 1.36), y: -40 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.65}>
        <Interior>
          <Character {...GREEK_WRITER} x={-60} y={-640} s={1.5} z={1} look={0.25} talking expression={{ eyes: "open", mouth: "flat", brows: -0.2 }} pose={{ armF: [2.5, 0.7], armB: [-0.2, -0.1] }} />
        </Interior>
      </Stage>
    </AbsoluteFill>
  );
};

// H7 269.4 "Cover the top of your walls with felt or raw animal skins, so they can't catch fire."
export const CoverWallsShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const f = sec(start / 30);
  const merlonX = [-900, -600, -300, 0, 300, 600, 900];
  const fizz = ramp(t, 273.0, 273.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-260}>
          <Battlement y={-700} w={2100} h={620} merlon={150} z={1} />
          {merlonX.map((x, i) => {
            const at = 269.8 + i * 0.32;
            const drop = ramp(t, at, at + 0.25, Easing.out(Easing.back(1.6)));
            return drop > 0 ? <Hide key={x} x={x} y={-80 + (1 - drop) * 300} w={170} h={240} color={i < 3 ? "#9a969c" : "#8a5a3a"} seed={i} z={2 + i * 0.01} /> : null;
          })}
          <FlyingArrow from={[1300, 300]} via={[700, 260]} to={[220, -150]} p={(t - 272.45) / 0.5} fire={1 - fizz} trail="comet" trailLen={0.12} z={4} />
          {t > 273.0 ? <Smoke x={200} y={-150} w={90} h={500} alpha={0.6 * (1 - ramp(t, 273.8, 274.3))} seed={6} speed={1.6} z={5} /> : null}
        </DayField>
      </Stage>
      <Label text="FELT" x={0.3} y={0.14} size={0.065} kind="box" at={f(270.91)} />
      <Label text="RAW SKINS" x={0.7} y={0.14} size={0.065} kind="box" at={f(271.79)} />
    </AbsoluteFill>
  );
};

// H8 274.3 "Fresh hide doesn't burn easily."
export const FreshHideShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={22} color="#3a4a3a" alt="#324032" z={-20} />
        <Hide y={460} w={900} h={900} seed={3} z={1} />
        <X x={60} y={20} rot={Math.PI - 0.3} z={2}>
          <Arrow x={-150} s={2.2} />
        </X>
        <Smoke x={60} y={20} w={120} h={700} alpha={0.55} seed={2} speed={1.4} z={3} />
        {[[-260, 200], [180, 320], [300, -120], [-120, -200]].map(([x, y], i) => {
          const d = ((frame / 30) * 0.9 + i * 0.27) % 1;
          return <Part key={i} shape={blob([[0, 26], [14, 0], [8, -12], [-8, -12], [-14, 0]], 6)} color="#7ac0f0" shade={0.25} x={x} y={y - d * 260} z={2.5} s={1 - d * 0.3} />;
        })}
      </Stage>
      <Label text="FRESH HIDE" x={0.5} y={0.12} size={0.07} kind="box" at={sec(start / 30)(274.55)} />
    </AbsoluteFill>
  );
};

// H9 276.45 "Attackers learned the same trick, and covered their siege towers and battering rams in fresh hides too."
export const AttackerHidesShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const roll = (t - 276.45) * 50;
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.85, y: -60, x: roll - 100 }} light={{ dir: [-0.6, 0.8] }}>
        <DayField horizon={-180}>
          <SiegeTower x={-560 + roll} y={-520} h={760} hides z={2} />
          <BatteringRam x={260 + roll} y={-540} hides z={3} />
          {[0, 1, 2].map((i) => {
            const p = (t - 279.0 - i * 0.7) / 0.5;
            const tx = (i === 1 ? 300 : -560) + roll;
            const ty = i === 1 ? -230 : -120 + i * 60;
            return <FlyingArrow key={i} from={[tx + 900, 260]} via={[tx + 400, 240]} to={[tx + 60, ty]} p={p} fire={1 - ramp(p, 1, 1.6, (x) => x)} trail="comet" trailLen={0.12} z={5} seed={i} />;
          })}
          {Array.from({ length: 4 }, (_, i) => (
            <Character key={i} {...ENEMY(i)} x={-120 + roll + i * 150} y={-560 - (i % 2) * 20} s={0.7} z={2.5 + i * 0.01} look={0.5} expression={{ eyes: "angry", mouth: "teeth" }} pose={{ ...poses.walk(frame + i * 4, 0.6), armF: [1.4, 0.2], armB: [1.3, 0.3] }} />
          ))}
        </DayField>
      </Stage>
      <Label text="SIEGE TOWERS" x={0.3} y={0.14} size={0.06} kind="box" at={f(279.2)} />
      <Label text="BATTERING RAMS" x={0.7} y={0.14} size={0.06} kind="box" at={f(280.03)} />
    </AbsoluteFill>
  );
};

/** Stone relief panel: everything inside is toned to sandstone; `glow` children stay in color. */
const Relief: React.FC<{ children?: React.ReactNode; color?: React.ReactNode }> = ({ children, color }) => {
  const { width, height } = { width: 1920, height: 1080 };
  return (
    <>
      <X z={-30}>
        <Part shape={roundRect(5000, 3000, 0)} color="#cdb48c" flat outline={0} />
        {[-520, 520].map((y) => (
          <Part key={y} shape={roundRect(5000, 40, 0)} color="#b39a72" flat outline={6} y={y} z={0.01} />
        ))}
      </X>
      {children}
      <Wash width={width * 2} height={height * 2} color="#c7ab7e" alpha={0.62} z={40} />
      <X z={41}>{color}</X>
    </>
  );
};

// H10 282.0 "There's even a stone carving from ancient Assyria, almost 3,000 years old."
export const AssyriaShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const f = sec(start / 30);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.88), y: 40 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Relief>
          <Tower x={720} y={-480} w={360} h={820} window={false} z={1} />
          <Battlement x={1120} y={-480} w={500} h={520} z={0.9} />
          <BatteringRam x={260} y={-480} z={2} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...ASSYRIAN(i)} x={-760 + i * 230} y={-480} s={0.8} z={3 + i * 0.01} look={0.5} expression={{ eyes: "dot", mouth: "flat" }} pose={drawPose(0.8)} holdF={<Bow rot={-1.57} draw={0.8} arrow />} />
          ))}
          {[0, 1].map((i) => (
            <Character key={i} {...ASSYRIAN(i + 1)} x={640 + i * 150} y={340} s={0.55} z={1.5} facing={-1} look={0.4} expression={{ eyes: "dot", mouth: "flat" }} pose={poses.holdOut} />
          ))}
        </Relief>
      </Stage>
      <Label text="ASSYRIA" sub="STONE CARVING" x={0.32} y={0.14} size={0.065} kind="box" at={6} />
      <Label text="~3,000 YEARS OLD" x={0.32} y={0.3} size={0.05} color="#fe5649" at={f(285.3)} />
    </AbsoluteFill>
  );
};

// H11 286.8 "It shows defenders dropping torches onto a battering ram."
export const TorchesDropShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 80, x: 200 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Relief
          color={
            <>
              {[0, 1, 2].map((i) => {
                const k = ramp(t, 288.0 + i * 0.35, 288.8 + i * 0.35, Easing.in(Easing.quad));
                return k > 0 && k < 1 ? <HandTorch key={i} x={520 + i * 60 - k * 120} y={300 - k * 560} rot={k * 2.5 + i} s={0.8} seed={i} /> : null;
              })}
              <FireLine x={260} y={-260} w={360} intensity={ramp(t, 288.75, 289.4)} seed={4} />
            </>
          }
        >
          <Tower x={720} y={-560} w={420} h={900} window={false} z={1} />
          <BatteringRam x={220} y={-560} s={1.1} z={2} />
          {[0, 1].map((i) => (
            <Character key={i} {...ASSYRIAN(i)} x={600 + i * 200} y={340} s={0.7} z={1.5} facing={-1} look={0.4} expression={{ eyes: "dot", mouth: "flat" }} pose={{ armF: [1.9 - ramp(t, 288.0 + i * 0.35, 288.3 + i * 0.35) * 0.8, 0.3], armB: [-0.2, -0.1] }} />
          ))}
        </Relief>
      </Stage>
    </AbsoluteFill>
  );
};

// H12 290.0 "And right below, soldiers pour water on the ram with long ladles."
export const LadlesShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pour = ramp(t, 291.9, 292.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0, x: 0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Relief
          color={
            <>
              <FireLine x={60} y={-180} w={360} intensity={1 - ramp(t, 292.5, 293.6)} seed={4} />
              {pour > 0.5
                ? Array.from({ length: 10 }, (_, i) => {
                    const d = ((frame / 30) * 2.2 + i * 0.1) % 1;
                    return <Part key={i} shape={ellipse(12, 20)} color="#7ac0f0" shade={0.25} x={-110 + (i % 2) * 300 + d * 30} y={40 - d * 240} />;
                  })
                : null}
            </>
          }
        >
          <BatteringRam x={60} y={-560} s={1.2} z={2} />
          {[0, 1].map((i) => (
            <Character
              key={i}
              {...ASSYRIAN(i)}
              x={-620 + i * 1240}
              y={-560}
              s={0.95}
              z={3}
              facing={i ? -1 : 1}
              look={0.5}
              expression={{ eyes: "dot", mouth: "flat" }}
              pose={{ armF: [2.1, 0.2], armB: [1.9, 0.3] }}
              holdF={<Ladle rot={-2.0} pour={pour} s={1.2} />}
            />
          ))}
        </Relief>
      </Stage>
    </AbsoluteFill>
  );
};

/** Burning wooden wall with a defender (for the water / dirt beats). */
const FireYard: React.FC<{ fire: number; children?: React.ReactNode }> = ({ fire, children }) => (
  <DayField horizon={-120}>
    <Palisade x={420} y={-560} w={1300} h={560} char={0.4} z={1} />
    {fire > 0 ? <FireLine x={420} y={-420} w={1100} intensity={fire} seed={7} z={2} /> : null}
    {fire > 0 ? <Glow x={420} y={-300} rx={900} ry={500} color="#ff7a2a" alpha={0.25 * Math.min(1, fire)} additive z={1.5} /> : null}
    {children}
  </DayField>
);

// H13 293.9 "But water isn't always the answer."
export const WaterNotAnswerShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <FireYard fire={0.7}>
          <Character {...ARCHER} x={-500} y={-600} s={1.3} z={3} look={t > 294.6 ? 0.05 : 0.6} expression={t > 294.6 ? { eyes: "half", mouth: "flat", brows: 0.6, gaze: [0, 0] } : { eyes: "open", mouth: "flat" }} pose={{ armF: [1.3, 0.6], armB: [1.1, 0.8] }} holdF={<Bucket rot={-1.0} s={0.9} />} />
        </FireYard>
      </Stage>
    </AbsoluteFill>
  );
};

// H14 295.8 "Remember Ammianus?"
export const RememberAmmianusShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.2), y: 0 }} light={{ pos: [300, 0] }} shadowMul={[0.6, 0.55, 0.62]} vignette={0.65}>
        <Interior>
          <Character {...AMMIANUS} x={-140} y={-560} s={1.5} z={1} look={0.15} expression={{ eyes: "happy", mouth: "smile" }} pose={{ armF: [2.5 + Math.sin(frame * 0.5) * 0.2, 0.4], armB: [0.4, 0.8] }} />
          <WriterDesk x={60} y={-580} s={1.2} z={2} />
        </Interior>
      </Stage>
      <Label text="AMMIANUS" x={0.5} y={0.12} size={0.06} kind="box" at={4} />
    </AbsoluteFill>
  );
};

// H15 297.1 "He says his Roman fire arrow had a nasty trick."
export const NastyTrickShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), x: 60 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#3a2440" alt="#301e36" z={-20} />
        <RomanFireHead s={1.4} x={80} fuel={1} lit={0} z={1} />
        <FlameFace x={130} y={20} size={1.05} mood={t > 298.9 ? "laugh" : "angry"} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};

// H16 299.95 "Throw water on it, and the fire gets worse."
export const WaterWorseShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const throwK = ramp(t, 300.5, 301.1, (x) => x);
  const flare = ramp(t, 301.2, 301.9);
  const hit = hitAt(t, 302.0, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hit * 0.05, y: -40, shake: hit * 14 }} light={{ dir: [-0.6, 0.8] }}>
        <FireYard fire={0.6 + flare * 1.2}>
          <Character
            {...ARCHER}
            x={-560}
            y={-600}
            s={1.3}
            z={3}
            look={0.6}
            expression={flare > 0.3 ? { eyes: "wide", mouth: "shout", brows: 1, sweat: true } : { eyes: "angry", mouth: "teeth", brows: -0.4 }}
            pose={flare > 0.3 ? poses.scared(frame) : { armF: [1.3 + throwK * 0.9, 0.6 - throwK * 0.4], armB: [1.1 + throwK * 0.9, 0.8 - throwK * 0.5] }}
            holdF={flare > 0.3 ? undefined : <Bucket rot={-1.0 - throwK * 1.2} s={0.9} />}
          />
          {throwK > 0 && throwK < 1
            ? Array.from({ length: 8 }, (_, i) => {
                const k = Math.min(1, throwK * (1 + i * 0.05));
                return <Part key={i} shape={blob([[-30, 0], [0, 24], [30, 0], [0, -24]], 10)} color="#7ac0f0" shade={0.25} x={-300 + k * 700 + i * 12} y={-60 + Math.sin(k * Math.PI) * 180 - k * 260 + (i % 3) * 14} z={5} />;
              })
            : null}
          {flare > 0 ? <Smoke x={420} y={-200} w={500} h={1400} alpha={0.45 * flare} seed={5} z={4} /> : null}
        </FireYard>
      </Stage>
    </AbsoluteFill>
  );
};

// H17 302.7 "The only way to put it out is to throw dirt on it."
export const DirtShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dig = ramp(t, 303.9, 304.5);
  const out = ramp(t, 304.6, 305.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <FireYard fire={0.9 * (1 - out)}>
          <X x={-420} y={-600} z={2.5}>
            <Part shape={blob([[-180, 0], [180, 0], [120, 70], [0, 110], [-120, 70]], 10)} color="#7a5a3a" shade={0.25} />
          </X>
          <Character {...ARCHER} x={-660} y={-600} s={1.3} z={3} look={0.6} expression={{ eyes: "angry", mouth: "teeth", brows: -0.4 }} pose={{ armF: [0.9 + dig * 0.9, 0.3], armB: [0.7 + dig * 0.9, 0.5] }} holdF={<Shovel rot={-1.4 + dig * 0.6} s={0.8} />} />
          <DirtSpray x={-300} y={-380} t={ramp(t, 304.2, 304.9, (x) => x)} dx={700} dy={-60} z={5} />
          {out > 0 ? <Smoke x={420} y={-420} w={700} h={1200} alpha={0.55 * out * (1 - ramp(t, 305.2, 305.7))} seed={8} z={4} /> : null}
        </FireYard>
      </Stage>
      <Label text="DIRT" x={0.5} y={0.14} size={0.07} kind="box" at={sec(start / 30)(304.66)} />
    </AbsoluteFill>
  );
};

// H18 305.7 "So if fire on an arrow is so weak, how do you make fire scary?"
export const MakeScaryShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#2a2a3a" alt="#242434" z={-20} />
        <X x={60} y={-120} s={2.6} z={1}>
          <Arrow length={300} x={-300} />
        </X>
        <FlameFace x={20} y={-120} size={0.8} mood={t > 308.2 ? "scared" : "sad"} wind={0.3} z={2} />
        <QuestionMark x={420} y={60} s={1.2 * pop(t, 308.75)} rot={0.15} z={3} />
      </Stage>
    </AbsoluteFill>
  );
};

// H19 309.85 "You make it bigger."
export const BiggerShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const grow = ramp(t, 310.0, 310.5, Easing.out(Easing.back(1.5)));
  const hit = hitAt(t, 310.4, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hit * 0.06, shake: hit * 14 }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Sunburst r={2600} rays={22} color="#7a2a22" alt="#6a221c" speed={2} z={-20} />
        <FlameFace y={-420} size={interpolate(grow, [0, 1], [0.45, 2.3])} mood="angry" z={2} />
      </Stage>
    </AbsoluteFill>
  );
};
