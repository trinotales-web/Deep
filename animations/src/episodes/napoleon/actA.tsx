import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, circle, blob, push, hitAt, absT, ramp, QuestionMark, Quill, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import { Musket, Steed, Painting, LaurelCrown, IslandRock, Sea, Sky, MoneyBag, WorldMap, worldXY, EURO, EMPIRE_1812, Doc, Clock, Calendar, Candle, Desk } from "../../kit/env";
import { sec, pop, SpeechBubble } from "../../kit/shot";
import { AlpsRoad, MapBack, CorsicaSet, ClassroomSet, StudySet } from "./sets";
import { YOU, SOLDIER, OFFICER, NAPOLEON_GREY, NAPOLEON, NAPOLEON_BOY, NAPOLEON_YOUNG, SCHOOLBOY } from "./cast";
import { atHead } from "../moon/frame";
import { HeldMusket, HeldSabre, SHOULDER_ARMS, PORT_ARMS, shoulderPose, openArms, SABRE_UP, Hearts, TriggerHand, Pulse, LouisianaOverlay, eu, keys, ThroneIcon, mapScr } from "./util";

// Act A: the cold open on the road near Grenoble (7 March 1815), the hook
// and the teasers, then back to Corsica, 1769.

const L = { dir: [-0.6, 0.7] as [number, number] };

/** The regiment's line across the road: soldiers at shoulder arms, seen from the side. */
const SoldierLine: React.FC<{ n?: number; x0?: number; dx?: number; y?: number; s?: number; z?: number; facing?: 1 | -1; aim?: number; lower?: number; cheer?: number }> = ({ n = 5, x0 = -600, dx = 240, y = -420, s = 1, z = -10, facing = 1, aim = 0, lower = 0, cheer = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a: [number, number] = cheer > 0 ? [2.2 - (i % 2) * 0.2, 0.4] : aim > 0 ? [SHOULDER_ARMS[0] + (1.42 - SHOULDER_ARMS[0]) * aim, SHOULDER_ARMS[1] * (1 - aim) + 0.08 * aim] : lower > 0 ? [SHOULDER_ARMS[0] + 0.3 * lower, SHOULDER_ARMS[1] - 1.2 * lower] : SHOULDER_ARMS;
        const dir = cheer > 0 ? Math.PI / 2 + 0.15 : aim > 0 ? (Math.PI / 2 - 0.12) * (1 - aim) : Math.PI / 2 - 0.12 - lower * 1.0;
        return (
          <Character
            key={i}
            {...SOLDIER(i + 1)}
            x={x0 + i * dx}
            y={y - (i % 2) * 8}
            s={s}
            facing={facing}
            look={0.5}
            expression={{ eyes: cheer > 0 ? "happy" : "open", mouth: cheer > 0 ? "shout" : "flat", brows: aim > 0 ? -0.3 : 0 }}
            pose={{ ...shoulderPose(frame, i), armF: a, armB: aim > 0 ? [1.1, 0.7] : [-0.12, 0.2] }}
            holdF={<HeldMusket arm={a} dir={dir} />}
            z={z - i * 0.01}
          />
        );
      })}
    </>
  );
};

// 0.09 "Imagine you're a French soldier on a mountain road near Grenoble."
export const RoadShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.86, 0.92), x: 60, y: 60 }} light={L} vignette={0.5}>
        <AlpsRoad floor={-460}>
          <SoldierLine n={4} x0={180} dx={230} y={-380} s={0.86} z={-14} />
          <Character {...YOU} x={-520} y={-500} s={1.3} facing={1} look={0.55} expression={{ eyes: "open", mouth: "flat", gaze: [0.6, 0], brows: 0.2 }} pose={shoulderPose(frame, 9)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-6} />
        </AlpsRoad>
      </Stage>
      <Label text="NEAR GRENOBLE · FRANCE" x={0.06} y={0.85} size={0.042} kind="box" at={at(1.4)} />
    </AbsoluteFill>
  );
};

// 3.56 "It's March 7, 1815."
export const DateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, x: 0, y: 0 };
  const a = atHead(cam, 0.42, 0.62, 1.75);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), x: 0, y: 0 }} light={L} vignette={0.55} bgBlur={3} bg={<AlpsRoad floor={-700} />}>
        <Character {...YOU} x={a.x} y={a.y} s={1.75} facing={1} look={0.35} expression={{ eyes: "open", mouth: "flat", gaze: [0.8, 0.1], brows: 0.3 }} pose={shoulderPose(frame, 3)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-4} />
      </DepthStage>
      <Label text="MARCH 7, 1815" x={0.5} y={0.1} size={0.08} kind="title" at={at(3.75)} />
    </AbsoluteFill>
  );
};

// 6.11 "Your musket is loaded, and your orders are clear."
export const MusketShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const y = atHead(cam, 0.3, 0.42, 1.7);
  const o = atHead(cam, 0.78, 0.46, 1.3);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.55} bgBlur={3} bg={<AlpsRoad floor={-800} />}>
        <Character {...YOU} x={y.x} y={y.y} s={1.7} facing={1} look={0.5} expression={{ eyes: "open", mouth: "flat", gaze: [0.4, -0.5], brows: 0.3 }} pose={{ armF: PORT_ARMS, armB: [0.9, 1.2], handF: "fist", handB: "fist" }} holdF={<HeldMusket arm={PORT_ARMS} dir={0.95} />} z={-4} />
        <Character {...OFFICER(0)} x={o.x} y={o.y} s={1.3} facing={-1} look={0.5} expression={{ eyes: "squint", mouth: "flat", brows: -0.3 }} pose={{ armF: [1.1, 0.9], armB: [-0.1, 0.2] }} holdF={<X rot={-0.4}><Doc w={120} /></X>} talking z={-8} />
      </DepthStage>
      <Label text="LOADED" x={0.06} y={0.85} size={0.05} kind="box" at={at(6.8)} />
      <Label text="ORDERS" x={0.94} y={0.85} size={0.05} kind="box" at={at(7.8)} />
    </AbsoluteFill>
  );
};

// 9.15 "Stop Napoleon."
export const OrdersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.36, 0.45, 2.0);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.6} bgBlur={3} bg={<AlpsRoad floor={-700} />}>
        <Character {...OFFICER(0)} x={a.x} y={a.y} s={2.0} facing={1} look={0.55} expression={{ eyes: "angry", mouth: "shout", brows: -0.8 }} pose={{ armF: [1.3, 0.2], armB: [-0.2, 0.3], handF: "point" }} talking z={-4} />
      </DepthStage>
      <Label text="STOP NAPOLEON" x={0.7} y={0.45} size={0.085} kind="stamp" rotate={-6} at={at(9.3)} pin />
    </AbsoluteFill>
  );
};

/** Western Mediterranean map shot used by the escape and march shots. */
const MedMap: React.FC<{ t: number; frame: number; dur: number; route?: [number, number][]; k?: number; pins?: { at: [number, number]; s?: number; color?: string; dot?: boolean }[]; children?: React.ReactNode; cam: { zoom: number; x: number; y: number } }> = ({ route, k = 0, pins = [], children, cam, frame, dur }) => (
  <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), x: cam.x, y: cam.y }} light={L} vignette={0.45}>
    <MapBack routes={route ? [{ pts: route, k, width: 24 }] : []} pins={pins} islands={["corsica", "elba"]} />
    {children}
  </Stage>
);

// 10.91 "Just over a week ago, he escaped from the island where he was being kept."
export const EscapeMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const elba = eu(EURO.elba);
  const cannes = eu(EURO.cannes);
  const k = ramp(t, 12.2, 14.2);
  const cam = { zoom: 2.0, x: (elba[0] + cannes[0]) / 2, y: (elba[1] + cannes[1]) / 2 + 20 };
  const se = mapScr(elba, cam);
  return (
    <AbsoluteFill>
      <MedMap t={t} frame={frame} dur={dur} cam={cam} route={[EURO.portoferraio, [9.2, 43.1], [8.0, 43.4], [7.08, 43.55]]} k={k} pins={[{ at: EURO.elba, dot: true, color: "#2f4f9a" }, { at: EURO.cannes, dot: true, s: pop(t, 14.0) }]} />
      <Label text="ELBA" x={se.x + 0.03} y={se.y + 0.07} size={0.045} kind="box" at={at(11.0)} pin />
      <Label text="ESCAPED!" x={0.5} y={0.18} size={0.07} kind="stamp" rotate={-5} at={at(12.4)} />
    </AbsoluteFill>
  );
};

// 14.74 "Now he's marching on Paris to take back his throne."
export const MarchMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 14.8, 16.8, Easing.inOut(Easing.cubic));
  const paris = eu(EURO.paris);
  const gre = eu(EURO.grenoble);
  const cam = { zoom: 1.25, x: (paris[0] + gre[0]) / 2 + 60, y: (paris[1] + eu(EURO.cannes)[1]) / 2 };
  const sp = mapScr(paris, cam);
  const sg = mapScr(gre, cam);
  return (
    <AbsoluteFill>
      <MedMap t={t} frame={frame} dur={dur} cam={cam} route={[EURO.cannes, [6.2, 44.4], EURO.grenoble, [4.8, 46.6], [3.5, 47.8], EURO.paris]} k={k} pins={[{ at: EURO.grenoble, dot: true }, { at: EURO.paris, s: pop(t, 16.4) }]}>
        <ThroneIcon x={paris[0] + 150} y={paris[1] - 60} s={0.8 * pop(t, 16.7)} z={0.2} />
      </MedMap>
      <Label text="GRENOBLE" x={sg.x + 0.08} y={sg.y + 0.02} size={0.04} kind="box" at={at(15.4)} pin />
      <Label text="PARIS" x={sp.x - 0.08} y={sp.y + 0.02} size={0.05} kind="box" at={at(15.7)} pin />
    </AbsoluteFill>
  );
};

// 17.56 "And he's walking straight toward you."
export const WalkingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 17.3, 19.5, Easing.linear);
  const s = 0.35 + k * 0.35;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 160 }} light={L} vignette={0.55}>
        <AlpsRoad floor={-460}>
          <Character {...NAPOLEON_GREY} x={30} y={-20 - k * 300} s={s} facing={1} look={0.1} expression={{ eyes: "open", mouth: "flat", brows: -0.2 }} pose={poses.walk(frame, 0.7)} z={-20} />
          {[-1, 1].map((sd) => (
            <Character key={sd} {...SOLDIER(sd > 0 ? 2 : 3)} x={sd * 760} y={-900} s={1.9} facing={sd > 0 ? -1 : 1} look={0.7} expression={{ eyes: "wide", mouth: "o" }} pose={shoulderPose(frame, sd)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-2} />
          ))}
        </AlpsRoad>
      </Stage>
    </AbsoluteFill>
  );
};

// 19.56 "Alone."
export const AloneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.62), y: 300 }} light={L} vignette={0.6}>
        <AlpsRoad floor={-460}>
          <Character {...NAPOLEON_GREY} x={0} y={-260} s={0.62} facing={1} look={0.1} expression={{ eyes: "open", mouth: "flat" }} pose={poses.walk(frame, 0.6)} z={-20} />
        </AlpsRoad>
      </Stage>
      <Label text="ALONE" x={0.5} y={0.1} size={0.07} kind="title" at={at(19.6)} />
    </AbsoluteFill>
  );
};

// 20.74 "He stops in front of your line and opens his coat."
export const CoatShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const open = ramp(t, 22.3, 23.0);
  const cam = { zoom: 0.9, y: 60 };
  const n = atHead(cam, 0.62, 0.38, 1.55);
  const outfit = open > 0.4 ? { ...NAPOLEON_GREY.outfit, shirt: "#2c4486", buttons: null } : NAPOLEON_GREY.outfit;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), y: cam.y }} light={L} vignette={0.55}>
        <AlpsRoad floor={-480}>
          <Character {...NAPOLEON_GREY} outfit={outfit} x={n.x} y={n.y} s={1.55} facing={-1} look={0.45} expression={{ eyes: "open", mouth: "flat", brows: -0.1 }} pose={openArms(open, frame)} z={-10} />
          <SoldierLine n={2} x0={-1020} dx={330} y={-760} s={1.5} z={-4} />
        </AlpsRoad>
      </Stage>
    </AbsoluteFill>
  );
};

// 23.65 "'Soldiers,' he calls out."
export const SoldiersCallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.46, 2.1);
  const outfit = { ...NAPOLEON_GREY.outfit, shirt: "#2c4486", buttons: null };
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<AlpsRoad floor={-800} />}>
        <Character {...NAPOLEON_GREY} outfit={outfit} x={a.x} y={a.y} s={2.1} facing={-1} look={0.25} expression={{ eyes: "open", mouth: "open", brows: 0.1 }} pose={openArms(1, frame)} talking z={-4} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 25.55 "'If there is one among you who wants to kill his emperor, here I am.'"
export const HereIAmShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.55, 0.42, 1.8);
  const outfit = { ...NAPOLEON_GREY.outfit, shirt: "#2c4486", buttons: null };
  const chest = ramp(t, 28.2, 28.6);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.04), x: 0, y: 0 }} light={L} vignette={0.6} bgBlur={3} bg={<AlpsRoad floor={-800} />}>
        <Character {...NAPOLEON_GREY} outfit={outfit} x={a.x} y={a.y} s={1.8} facing={-1} look={0.2} expression={{ eyes: chest > 0.5 ? "open" : "squint", mouth: chest > 0.5 ? "smirk" : "open", brows: -0.4 }} pose={{ ...openArms(1, frame), lean: -0.06 * chest }} talking={t < 28.9} z={-4} />
      </DepthStage>
      <Label text="“HERE I AM.”" x={0.26} y={0.6} size={0.06} kind="box" at={at(28.3)} pin />
    </AbsoluteFill>
  );
};

// 29.64 "An officer shouts, 'Fire!'"
export const FireOrderShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.6, 0.46, 1.9);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), shake: hitAt(t, 30.86) * 10 }} light={L} vignette={0.6} bgBlur={3} bg={<AlpsRoad floor={-800} />}>
        <Character {...OFFICER(1)} x={a.x} y={a.y} s={1.9} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ armF: SABRE_UP, armB: [-0.3, 0.4], handF: "fist" }} holdF={<HeldSabre arm={SABRE_UP} dir={Math.PI / 2 + 0.3} />} talking z={-4} />
      </DepthStage>
      <Label text="FIRE!" x={0.27} y={0.38} size={0.12} kind="stamp" rotate={-8} at={at(30.9)} pin />
    </AbsoluteFill>
  );
};

// 32.06 "Your finger is on the trigger."
export const TriggerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tremble = Math.sin(frame * 1.9) * 3;
  const squeeze = ramp(t, 32.6, 33.8);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.12), x: 0, y: 0 }} light={L} vignette={0.75} bgBlur={6} bg={<AlpsRoad floor={-1200} />}>
        <X x={tremble} y={tremble * 0.6} s={3.0} z={-4}>
          <Musket />
        </X>
        <TriggerHand x={-270 + tremble} y={4 + tremble * 0.6} s={1.7} squeeze={squeeze} z={-3.9} />
        <Pulse t={t} bpm={140} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 34.53 "So how does a boy from a small island"
export const IslandBoyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 0.9, y: 120 };
  const b = atHead(cam, 0.5, 0.48, 1.1);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.06), y: cam.y }} light={L} vignette={0.5}>
        <CorsicaSet floor={-460} village={false}>
          <Part shape={blob([[-260, 0], [-220, 120], [-40, 170], [180, 120], [260, 0]], 8)} color="#a8a49a" shade={0.25} x={b.x} y={b.y - 60} z={-12} />
          <Character {...NAPOLEON_BOY} x={b.x} y={b.y + 60} s={1.1} facing={1} look={0.6} expression={{ eyes: "open", mouth: "flat", gaze: [0.9, 0.2] }} pose={poses.sit(frame)} z={-10} />
        </CorsicaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 36.70 "become the most powerful man in Europe?"
export const PowerfulShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 36.7, 38.4);
  const tint = Object.fromEntries(EMPIRE_1812.map((c) => [c, c === "France" ? "#3b62b8" : "#8aa8de"]));
  const paris = eu(EURO.paris);
  const c = eu([14, 50]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), x: c[0], y: c[1] }} light={L} vignette={0.45}>
        <MapBack tint={tint} tintK={k * 0.85} />
        <X x={paris[0]} y={paris[1] + 130} z={0.3}>
          <LaurelCrown r={120} s={pop(t, 37.4)} />
        </X>
      </Stage>
      <Label text="THE MOST POWERFUL MAN IN EUROPE" x={0.5} y={0.88} size={0.05} kind="box" at={at(37.4)} />
    </AbsoluteFill>
  );
};

// 39.10 "A boy who barely spoke French?"
export const BarelyFrenchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.36, 0.5, 2.0);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<ClassroomSet floor={-700} />}>
        <Character {...NAPOLEON_BOY} x={a.x} y={a.y} s={2.0} facing={1} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.7, sweat: true }} pose={poses.shrug(t)} z={-4} />
        <X x={520} y={220} z={-3}>
          <SpeechBubble x={0} y={0} w={560} h={240} tx={-380} ty={-140} />
        </X>
        <QuestionMark x={700} y={-160} size={1.3 * pop(t, 40.3)} z={-2} />
      </DepthStage>
      <Label text="BON... JOUR?" x={0.77} y={0.29} size={0.06} kind="ink" at={at(39.7)} pin />
    </AbsoluteFill>
  );
};

// 41.22 "And how does he lose it all?"
export const LoseAllShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 41.2, 41.9, Easing.in(Easing.quad));
  const bounce = t > 41.9 ? Math.abs(Math.sin((t - 41.9) * 9)) * 60 * Math.exp(-(t - 41.9) * 4) : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: hitAt(t, 41.9) * 8 }} light={L} vignette={0.7}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2a2230" flat outline={0} z={-30} />
        <Part shape={roundRect(4000, 600, 0)} color="#4a4050" flat outline={0} y={-560} z={-29} />
        <Glow rx={800} color="#ffd98a" alpha={0.3} additive y={-160} z={-28} />
        <X x={0} y={700 - fall * 900 + bounce} rot={fall * 0.5} z={-5}>
          <LaurelCrown r={300} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// 42.83 "Not once, but twice."
export const TwiceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 60 }} light={L} vignette={0.5}>
        <Sky w={5000} h={3000} z={-60} />
        <Sea w={5000} h={1200} y={-500} z={-55} />
        <X x={-520} y={-80} s={0.5 * pop(t, 43.0)} z={-20}>
          <IslandRock kind="elba" />
        </X>
        <X x={520} y={-80} s={0.5 * pop(t, 43.9)} z={-20}>
          <IslandRock kind="helena" />
        </X>
      </Stage>
      <Label text="ELBA · 1814" x={0.24} y={0.83} size={0.045} kind="box" at={at(43.1)} pin />
      <Label text="SAINT HELENA · 1815" x={0.74} y={0.83} size={0.045} kind="box" at={at(43.95)} pin />
      <Label text="×2" x={0.5} y={0.18} size={0.1} kind="stamp" at={at(44.0)} pin />
    </AbsoluteFill>
  );
};

// 45.15 "Coming up: a schoolboy mocked for his accent,"
export const TeaserSchoolShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 0.95, y: 80 };
  const b = atHead(cam, 0.5, 0.48, 1.35);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), y: cam.y }} light={L} vignette={0.5}>
        <ClassroomSet floor={-480}>
          <Character {...NAPOLEON_BOY} x={b.x} y={b.y} s={1.35} facing={1} look={0.2} expression={{ eyes: "sad", mouth: "frown", brows: 0.6 }} pose={poses.idle(frame, 1)} z={-10} />
          {[-1, 1].map((sd, i) => (
            <Character key={sd} {...SCHOOLBOY(i)} x={b.x + sd * 560} y={b.y + 20} s={1.2} facing={sd > 0 ? -1 : 1} look={0.6} expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }} pose={{ armF: [1.2 + Math.sin(frame * 0.5 + i) * 0.05, 0.2], armB: [-0.2, 0.9], handF: "point", bob: Math.abs(Math.sin(frame * 0.4 + i)) * 8 }} z={-11} />
          ))}
        </ClassroomSet>
      </Stage>
      <Label text="COMING UP" x={0.06} y={0.09} size={0.045} kind="box" at={at(45.2)} />
      <Label text="HA HA!" x={0.2} y={0.32} size={0.06} kind="stamp" rotate={-8} at={at(46.6)} pin />
    </AbsoluteFill>
  );
};

// 47.95 "a general who almost became a romance writer,"
export const TeaserRomanceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.38, 0.4, 1.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), y: cam.y }} light={L} vignette={0.55}>
        <StudySet floor={-520} night>
          <Character {...NAPOLEON_YOUNG(true)} x={a.x} y={a.y} s={1.7} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "smile", blush: true }} pose={{ armF: [1.0, 0.9 + Math.sin(frame * 0.5) * 0.08], armB: [-0.2, 0.4] }} holdF={<X rot={-0.6} s={0.7}><Quill /></X>} z={-12} />
          <Desk x={300} y={-520} w={760} z={-8} />
          <Candle x={540} y={-120} s={1.2} z={-7} />
          <Hearts x={280} y={-120} w={300} h={560} z={-6} />
        </StudySet>
      </Stage>
    </AbsoluteFill>
  );
};

/** A rearing white horse with Napoleon and a flying red cape (the David painting, in our style). */
export const PaintingPicture: React.FC<{ frame: number }> = ({ frame }) => (
  <X>
    <Part shape={roundRect(900, 640, 0)} color="#8ea6c4" flat outline={0} z={0.001} />
    <Part shape={blob([[-450, 60], [-300, 220], [-120, 120], [60, 300], [260, 140], [450, 260], [450, -320], [-450, -320]], 8)} color="#b8c4d4" shade={0.2} z={0.0015} />
    <Part shape={blob([[-450, -320], [-450, -150], [-200, -90], [80, -160], [450, -100], [450, -320]], 8)} color="#6a5a4a" shade={0.2} z={0.002} />
    <X x={-40} y={-300} s={0.95} z={0.01}>
      <Steed color="#f2efe9" mane="#c9c4cc" rear={1} cloth="#9a1f35">
        <Character {...NAPOLEON} outfit={{ ...NAPOLEON.outfit, cape: "#c8262f", capeWind: 1 }} s={0.62} facing={1} look={0.4} expression={{ eyes: "open", mouth: "flat", brows: -0.3 }} pose={{ ...poses.sit(frame), armF: [2.5, 0.3], handF: "point" }} />
      </Steed>
    </X>
  </X>
);

// 50.53 "a famous painting with a secret mule,"
export const TeaserPaintingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const peek = ramp(t, 51.5, 51.95, Easing.out(Easing.back(1.6)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 40 }} light={L} vignette={0.55}>
        <Part shape={roundRect(4000, 3000, 0)} color="#9a382f" flat outline={0} z={-30} />
        <Painting w={900} h={640} z={-10}>
          <PaintingPicture frame={frame} />
        </Painting>
        <X x={560 + (1 - peek) * 300} y={-420} s={0.75} z={-12}>
          <Steed mule color="#8c7f72" mane="#3a3230" />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

/** Wall height chart with metric marks (centimetres) beside a character. */
export const HeightChart: React.FC<{ x?: number; y?: number; z?: number; px?: number; from?: number; to?: number }> = ({ x = 0, y = 0, z = 0, px = 3.2, from = 140, to = 200 }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(140, (to - from) * px + 60, 10)} color="#f2ead8" shade={0.15} y={((to - from) * px) / 2} />
    {Array.from({ length: (to - from) / 5 + 1 }, (_, i) => {
      const cm = from + i * 5;
      const yy = (cm - from) * px;
      return <Line key={i} pts={[[-60, yy], [cm % 10 === 0 ? 10 : -20, yy]]} width={4} color="#5a4a3a" z={0.001} />;
    })}
  </X>
);

// 52.54 "a short emperor who wasn't short,"
export const TeaserShortShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 0.9, y: 40 };
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), y: cam.y }} light={L} vignette={0.5}>
        <StudySet floor={-460} map={false}>
          <HeightChart x={200} y={-300} z={-20} />
          <Character {...NAPOLEON} x={-40} y={-460} s={1.25} facing={1} look={0.5} expression={{ eyes: t > 53.7 ? "squint" : "open", mouth: t > 53.7 ? "smirk" : "frown", brows: -0.4 }} pose={poses.handsOnHips} z={-10} />
          <QuestionMark x={-400} y={300} size={1.1 * pop(t, 52.8)} z={-5} />
        </StudySet>
      </Stage>
      <Label text="SHORT?" x={0.24} y={0.24} size={0.06} kind="stamp" rotate={-6} at={at(52.7)} pin />
    </AbsoluteFill>
  );
};

// 54.73 "and the biggest land sale in history."
export const TeaserLandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 9;
  const center: [number, number] = [-96, 40];
  const k = ramp(t, 55.0, 55.9);
  const bag = worldXY(-78, 34, ppd, center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.45}>
        <WorldMap ppd={ppd} center={center} w={2400} h={1400} tint={{ "United States of America": "#cfd8b0" }} tintK={0.6} z={-20} />
        <LouisianaOverlay ppd={ppd} center={center} k={k} z={-19} />
        <X x={bag[0]} y={bag[1]} s={0.8 * pop(t, 55.5)} z={-10}>
          <MoneyBag />
        </X>
      </Stage>
      <Label text="BIGGEST LAND SALE IN HISTORY" x={0.5} y={0.88} size={0.05} kind="box" at={at(55.3)} />
    </AbsoluteFill>
  );
};

// 57.02 "But first, we go back to where it all began."
export const BackInTimeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const year = Math.round(keys(t, [[57.2, 1815], [59.4, 1769]]));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2f2a3a" flat outline={0} z={-30} />
        <Glow rx={900} color="#e2b23c" alpha={0.18} additive z={-29} />
        <X rot={-frame * 0.12} z={-10}>
          {Array.from({ length: 12 }, (_, i) => (
            <Part key={i} shape={roundRect(20, 60, 6)} color="#e2b23c" flat outline={4} x={Math.cos((i / 12) * Math.PI * 2) * 360} y={Math.sin((i / 12) * Math.PI * 2) * 360} rot={(i / 12) * Math.PI * 2 + Math.PI / 2} />
          ))}
        </X>
        <Clock s={2.2} speed={-30} z={-9} />
      </Stage>
      <Label text={`${year}`} x={0.5} y={0.86} size={0.09} kind="title" at={at(57.1)} />
    </AbsoluteFill>
  );
};

// 59.78 "Corsica, 1769."
export const Corsica1769Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const c = eu([9.05, 42.15]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 2.3, 2.6), x: c[0], y: c[1] }} light={L} vignette={0.5}>
        <MapBack islands={["corsica", "sardinia"]} pins={[{ at: EURO.ajaccio, dot: true }]} />
      </Stage>
      <Label text="CORSICA, 1769" x={0.5} y={0.1} size={0.08} kind="title" at={at(59.8)} />
    </AbsoluteFill>
  );
};

export const _a = { interpolate, PORT_ARMS, circle, Calendar, Steed };
