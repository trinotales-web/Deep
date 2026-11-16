import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, interpolate } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, roundPoly, circle, ellipse, blob, poly, push, hitAt, absT, ramp, QuestionMark, Quill, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  EURO, NationFlag, FieldGun, Steed, Book, Doc, Desk, Candle, XMark, BattleIcon, LaurelCrown, Lightbulb, Sabre, Painting, Rain, ShipOfLine, Cannonballs, Smoke,
} from "../../kit/env";
import { sec, pop, SpeechBubble } from "../../kit/shot";
import { HarborSet, StudySet, ParisStreet, CouncilHall, BattlefieldSet, MapBack, RuleBoard, SnowField } from "./sets";
import { NAPOLEON, NAPOLEON_YOUNG, SOLDIER, OFFICER, ROYALIST, AUSTRIAN, GRENADIER, CARTOONIST, BRIT_NAVY } from "./cast";
import { atHead } from "../moon/frame";
import { HeldMusket, HeldSabre, SHOULDER_ARMS, AIM, aimPose, shoulderPose, SABRE_UP, Hearts, eu, mapScr } from "./util";
import { HeightChart } from "./actA";

// Act C: Toulon (1793), the stalled career and the romance novel, the
// royalist revolt of October 1795, the rule, Italy, the little corporal and
// the height myth.

const L = { dir: [-0.6, 0.7] as [number, number] };
const YOUNG_GEN = NAPOLEON_YOUNG(true);

/** Dashed cannon-shot arc from a to b (bold dashes). */
const DashArc: React.FC<{ a: [number, number]; b: [number, number]; k: number; h?: number; color?: string; z?: number }> = ({ a, b, k, h = 400, color = "#c8262f", z = 0 }) => {
  const n = 18;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * h] as [number, number];
  });
  const m = Math.floor(n * Math.max(0, Math.min(1, k)));
  return (
    <X z={z}>
      {pts.slice(0, m).map((p, i) => (i % 2 === 0 && pts[i + 1] ? <Line key={i} pts={[p, pts[i + 1]]} width={16} color={color} /> : null))}
      {m >= n ? <Part shape={circle(26)} color="#3a3840" shade={0.3} x={b[0]} y={b[1]} /> : null}
    </X>
  );
};

/** Boot icon (marching). */
const BootIcon: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundPoly([[-50, 160], [30, 160], [30, 40], [110, 30], [120, -10], [-60, -10]], [10, 10, 20, 20, 10, 10])} color="#2a2228" shade={0.25} />
    <Part shape={roundRect(90, 20, 6)} color="#5a4a3a" flat outline={3.5} x={-12} y={150} z={0.001} />
  </X>
);

/** White icon card with a coloured rim (for THINK / MARCH / STRIKE etc.). */
const Card: React.FC<{ x?: number; y?: number; s?: number; z?: number; color?: string; children?: React.ReactNode }> = ({ x = 0, y = 0, s = 1, z = 0, color = "#2c4486", children }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(420, 460, 40)} color={color} shade={0.2} />
    <Part shape={roundRect(370, 410, 30)} color="#f6f2ea" flat outline={4} z={0.001} />
    <X z={0.002}>{children}</X>
  </X>
);

// 134.54 "In 1793, rebels hand the port city of Toulon to the British navy."
export const ToulonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), x: -300 + frame * 2.2, y: 160 }} light={L} vignette={0.45}>
        <HarborSet floor={-460} ships={3} />
      </Stage>
      <Label text="1793" x={0.5} y={0.1} size={0.08} kind="title" at={at(134.7)} />
      <Label text="TOULON" x={0.06} y={0.85} size={0.05} kind="box" at={at(137.6)} />
      <Label text="BRITISH NAVY" x={0.94} y={0.85} size={0.045} kind="box" at={at(138.5)} />
    </AbsoluteFill>
  );
};

// 139.54 "Napoleon, just 24, sees what older officers missed."
export const SpyglassShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const n = atHead(cam, 0.3, 0.42, 1.7);
  const o1 = atHead(cam, 0.68, 0.5, 1.35);
  const o2 = atHead(cam, 0.86, 0.52, 1.3);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<HarborSet floor={-700} />}>
        <Character {...YOUNG_GEN} x={n.x} y={n.y} s={1.7} facing={1} look={0.55} expression={{ eyes: "squint", mouth: "smirk", brows: -0.4 }} pose={poses.point(frame)} z={-6} />
        <Character {...OFFICER(0)} hairColor="#cfc9cf" x={o1.x} y={o1.y} s={1.35} facing={-1} look={0.4} expression={{ eyes: "half", mouth: "flat", eyebags: true }} pose={poses.shrug(t - 141.8)} z={-8} />
        <Character {...OFFICER(1)} hairColor="#cfc9cf" x={o2.x} y={o2.y} s={1.3} facing={-1} look={0.3} expression={{ eyes: "half", mouth: "frown", eyebags: true }} pose={poses.idle(frame, 2)} z={-8.5} />
      </DepthStage>
      <Label text="AGE 24" x={0.3} y={0.1} size={0.07} kind="title" at={at(140.6)} />
    </AbsoluteFill>
  );
};

// 143.57 "Take a small fort on a hill, and your cannons can hit the British ships in the harbor."
export const FortPlanShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const fort: [number, number] = [-1800 * 0.9 * 0 - 1620, -60];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), x: -400, y: 60 }} light={L} vignette={0.45}>
        <HarborSet floor={-460} ships={3}>
          <Part shape={circle(300)} color="#ffe27a" flat outline={0} opacity={0.25 * pop(t, 144.2)} x={fort[0]} y={fort[1]} z={-20} />
          {[0, 1, 2].map((i) => (
            <DashArc key={i} a={[fort[0] + 160, fort[1] + 140]} b={[-300 + i * 900, -120 - (i % 2) * 40]} k={ramp(t, 145.6 + i * 0.25, 146.6 + i * 0.25)} h={500 + i * 80} z={-19} />
          ))}
        </HarborSet>
      </Stage>
      <Label text="SMALL FORT" x={0.14} y={0.3} size={0.045} kind="box" at={at(144.2)} pin />
      <Label text="BRITISH SHIPS" x={0.72} y={0.75} size={0.045} kind="box" at={at(146.5)} pin />
    </AbsoluteFill>
  );
};

// 148.09 "He leads the attack himself and takes a bayonet in the thigh."
export const ChargeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const hit = t > 150.2;
  const run = (t - 147.9) * 160;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), x: 100 + run * 0.6, y: 120, shake: hitAt(t, 150.2) * 14 }} light={L} vignette={0.6}>
        <BattlefieldSet floor={-460} dusk sun={0} grass="#6f7a4a">
          <Smoke x={600} y={300} w={1400} h={900} alpha={0.4} color="#8a8690" seed={5} z={-40} />
          <Character {...YOUNG_GEN} x={-200 + run} y={-430} s={1.3} facing={1} look={0.6} expression={{ eyes: hit ? "squint" : "angry", mouth: hit ? "teeth" : "shout", brows: -0.8, sweat: hit }} pose={hit ? { ...poses.run(frame, 1), armF: SABRE_UP, armB: [-0.3, 0.6] } : { ...poses.run(frame, 1), armF: SABRE_UP }} holdF={<HeldSabre arm={SABRE_UP} dir={Math.PI / 2 + 0.6} />} z={-10} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...SOLDIER(i + 4)} hat="bicorne" x={-700 + run - i * 300} y={-400 - (i % 2) * 30} s={1.05} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "shout" }} pose={{ ...poses.run(frame + i * 5, i), armF: AIM }} holdF={<HeldMusket arm={AIM} dir={0.1} />} z={-12 - i * 0.01} />
          ))}
          {hit ? <Glow rx={900} color="#c8262f" alpha={0.25 * Math.max(0, 1 - (t - 150.2) * 2)} additive z={2} /> : null}
        </BattlefieldSet>
      </Stage>
      <Label text="BAYONET IN THE THIGH" x={0.94} y={0.85} size={0.045} kind="stamp" at={at(150.3)} />
    </AbsoluteFill>
  );
};

// 151.75 "But it works."
export const ItWorksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), x: -200, y: 80, shake: hitAt(t, 151.9) * 8 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.5}>
          <NationFlag kind="france" x={-500} y={-430} w={240} pole={600} z={-20} />
          {[0, 1].map((i) => (
            <FieldGun key={i} x={-200 + i * 520} y={-460 - i * 20} s={1.0} fire={Math.max(0, Math.min(1, (t - 151.8 - i * 0.25) / 0.8))} z={-12 - i * 0.01} />
          ))}
        </BattlefieldSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 152.75 "The British sail away,"
export const SailAwayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.74), x: 300, y: 160 }} light={L} vignette={0.45}>
        <HarborSet floor={-460} ships={3} fort={false} leaving={ramp(t, 152.5, 154.2, Easing.in(Easing.quad))} />
      </Stage>
    </AbsoluteFill>
  );
};

// 154.13 "and Napoleon is made a general at 24."
export const GeneralShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const promoted = t > 155.3;
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.52, 1.8);
  const outfit = { ...YOUNG_GEN.outfit, epaulettes: promoted ? "#e2b23c" : null, sash: promoted ? "#c8262f" : null };
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<HarborSet floor={-700} fort={false} />}>
        <Glow rx={700} color="#ffe27a" alpha={promoted ? 0.35 : 0} additive y={a.y + 300} z={-7} />
        <Character {...YOUNG_GEN} outfit={outfit} x={a.x} y={a.y} s={1.8} facing={1} look={0.3} expression={{ eyes: promoted ? "happy" : "open", mouth: promoted ? "grin" : "flat" }} pose={promoted ? poses.handsOnHips : poses.idle(frame, 1)} z={-6} />
      </DepthStage>
      <Label text="GENERAL AT 24" x={0.5} y={0.1} size={0.08} kind="title" at={at(155.5)} />
    </AbsoluteFill>
  );
};

// 157.71 "Then, his career stalls."
export const StallsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 157.6, 158.8);
  const arrow: [number, number][] = [[-700, -200], [-300, 140], [100, 160], [700, 150]];
  const m = Math.max(2, Math.ceil(k * 4));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#e8dcc0" flat outline={0} z={-30} />
        <Line pts={arrow.slice(0, m)} width={60} color="#211b20" z={-10} />
        <Line pts={arrow.slice(0, m)} width={40} color="#c8262f" z={-9.9} />
        <Character {...YOUNG_GEN} x={300} y={-560} s={1.3} facing={-1} look={0.4} expression={{ eyes: "half", mouth: "frown", brows: 0.5 }} pose={poses.sit(frame)} z={-8} />
      </Stage>
      <Label text="CAREER" x={0.06} y={0.09} size={0.05} kind="box" at={at(158.1)} />
      <Label text="STALLED" x={0.8} y={0.27} size={0.06} kind="stamp" rotate={-5} at={at(158.5)} pin />
    </AbsoluteFill>
  );
};

// 159.37 "He's given a job he doesn't want, and he refuses it."
export const RefusesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const crumple = ramp(t, 161.3, 161.8);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.36, 0.46, 1.8);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<StudySet floor={-700} />}>
        <Character {...YOUNG_GEN} x={a.x} y={a.y} s={1.8} facing={1} look={0.6} expression={{ eyes: crumple > 0 ? "angry" : "squint", mouth: crumple > 0 ? "frown" : "flat", brows: -0.6 }} pose={{ armF: [1.2, 0.5], armB: [-0.2, 0.3] }} z={-6} />
        <X x={a.x + 520} y={a.y + 380} s={1 - crumple * 0.6} rot={crumple * 1.4} z={-5}>
          <Doc w={320} />
        </X>
      </DepthStage>
      <Label text="NEW POST: INFANTRY, WEST OF FRANCE" x={0.75} y={0.18} size={0.035} kind="box" at={at(159.5)} pin />
      <Label text="NO!" x={0.72} y={0.45} size={0.1} kind="stamp" rotate={-8} at={at(161.4)} pin />
    </AbsoluteFill>
  );
};

// 162.41 "For a while, he has no command at all."
export const NoCommandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 120 }} light={L} vignette={0.6}>
        <ParisStreet floor={-460} night>
          <Character {...YOUNG_GEN} x={-200 + frame * 3} y={-480} s={1.15} facing={1} look={0.3} expression={{ eyes: "sad", mouth: "flat", brows: 0.5 }} pose={poses.walk(frame, 0.5)} z={-10} />
          <Rain w={4000} h={2400} y={200} n={140} z={-5} />
        </ParisStreet>
      </Stage>
      <Label text="NO COMMAND" x={0.06} y={0.85} size={0.05} kind="box" at={at(163.8)} />
    </AbsoluteFill>
  );
};

// 164.97 "So what does he do?"
export const WhatDoesHeDoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.42, 0.48, 2.0);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<StudySet floor={-700} night />}>
        <Character {...YOUNG_GEN} x={a.x} y={a.y} s={2.0} facing={1} look={0.4} expression={{ eyes: "squint", mouth: "wavy", gaze: [0.5, 0.7] }} pose={poses.think} z={-6} />
        <QuestionMark x={a.x + 520} y={a.y + 640} size={1.4 * pop(t, 165.3)} z={-5} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 166.46 "He writes a romance story."
export const WritesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.34, 0.4, 1.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), y: cam.y }} light={L} vignette={0.6}>
        <StudySet floor={-520} night>
          <Character {...YOUNG_GEN} hat={null} x={a.x} y={a.y} s={1.7} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "smile", blush: true, gaze: [0.6, -0.6] }} pose={{ armF: [1.0, 0.9 + Math.sin(frame * 0.6) * 0.1], armB: [-0.2, 0.4] }} holdF={<X rot={-0.6} s={0.7}><Quill /></X>} z={-12} />
          <Desk x={300} y={-520} w={760} z={-8} />
          <Candle x={540} y={-120} s={1.2} z={-7} />
          <Hearts x={260} y={-60} w={320} h={560} z={-6} />
        </StudySet>
      </Stage>
    </AbsoluteFill>
  );
};

/** Open manuscript book on a desk (pages with handwriting). */
const OpenBook: React.FC<{ x?: number; y?: number; s?: number; z?: number; children?: React.ReactNode }> = ({ x = 0, y = 0, s = 1, z = 0, children }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(1260, 820, 30)} color="#6a3a2a" shade={0.2} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={roundRect(600, 760, 16)} color="#f6eedc" shade={0.12} x={k * 304} z={0.001} />
    ))}
    <Line pts={[[0, -380], [0, 380]]} width={6} color="#c9b894" z={0.002} />
    <X z={0.003}>{children}</X>
  </X>
);

// 168.28 "It's called Clisson and Eugénie."
export const TitleBookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#5a3a26" flat outline={0} z={-30} />
        <Glow rx={900} color="#ffd98a" alpha={0.3} additive z={-29} />
        <OpenBook y={-20} s={1.0} z={-10}>
          {Array.from({ length: 9 }, (_, i) => (
            <Line key={i} pts={[[60, 200 - i * 52], [i === 8 ? 300 : 540, 200 - i * 52]]} width={6} color="#8a7a60" />
          ))}
          <Hearts x={-300} y={-300} w={300} h={500} n={4} />
        </OpenBook>
        <X x={420} y={-200} rot={-0.7} s={1.1} z={-9}>
          <Quill />
        </X>
      </Stage>
      <Label text="CLISSON ET EUGÉNIE" x={0.33} y={0.4} size={0.055} kind="ink" at={at(168.6)} pin />
    </AbsoluteFill>
  );
};

// 170.56 "The hero is a brilliant, lonely young soldier."
export const HeroShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={L} vignette={0.55}>
        <Part shape={roundRect(4000, 3000, 0)} color="#5a3a26" flat outline={0} z={-30} />
        <Painting w={1000} h={640} canvas="#f2c890" plate={false} z={-20}>
          <Part shape={blob([[-500, -320], [-500, -120], [-200, -40], [200, -100], [500, -60], [500, -320]], 8)} color="#7a8a4a" shade={0.2} z={0.002} />
          <Part shape={circle(110)} color="#ffe2a0" flat outline={4} x={300} y={120} z={0.0015} />
          <Character {...NAPOLEON_YOUNG(false)} x={-150} y={-120} s={0.9} facing={1} look={0.6} expression={{ eyes: "sad", mouth: "flat", gaze: [0.8, 0.2] }} pose={poses.idle(frame, 2)} z={0.01} />
        </Painting>
      </Stage>
      <Label text="BRILLIANT" x={0.2} y={0.88} size={0.045} kind="box" at={at(171.3)} pin />
      <Label text="LONELY" x={0.5} y={0.88} size={0.045} kind="box" at={at(172.1)} pin />
      <Label text="YOUNG SOLDIER" x={0.8} y={0.88} size={0.045} kind="box" at={at(172.6)} pin />
    </AbsoluteFill>
  );
};

// 173.80 "Sound familiar?"
export const FamiliarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.48, 2.1);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.1) }} light={L} vignette={0.6} bgBlur={3} bg={<StudySet floor={-700} night />}>
        <Character {...YOUNG_GEN} hat={null} x={a.x} y={a.y} s={2.1} facing={1} look={0.05} expression={{ eyes: "half", mouth: "smirk", brows: -0.3, blush: true }} pose={poses.idle(frame, 1)} z={-6} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 175.26 "Then, in October 1795, thousands of armed royalists march on Paris to bring back the king."
export const RoyalistsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const march = (t - 175) * 90;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), x: -100 + march * 0.8, y: 120 }} light={L} vignette={0.5}>
        <ParisStreet floor={-460}>
          {Array.from({ length: 9 }, (_, i) => {
            const row = i % 2;
            return (
              <Character key={i} {...ROYALIST(i)} x={-1500 + march + (i >> 1) * 330 + row * 160} y={-430 - row * 70} s={1.0 - row * 0.08} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "shout", brows: -0.5 }} pose={{ ...poses.walk(frame + i * 4, 0.9), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-10 - row * 0.5 - i * 0.01} />
            );
          })}
          <NationFlag kind="royal" x={-700 + march} y={-430} w={220} pole={680} z={-9.5} />
        </ParisStreet>
      </Stage>
      <Label text="OCTOBER 1795" x={0.5} y={0.1} size={0.08} kind="title" at={at(176.1)} />
      <Label text="ROYALISTS" x={0.06} y={0.85} size={0.05} kind="box" at={at(179.0)} />
    </AbsoluteFill>
  );
};

// 182.21 "The government panics,"
export const PanicShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98), y: 80, shake: 3 }} light={L} vignette={0.55}>
        <CouncilHall floor={-480}>
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...ROYALIST(i + 4)} hat={null} x={-750 + i * 500} y={-480 - (i % 2) * 30} s={1.15} facing={i % 2 ? -1 : 1} look={0.6} expression={{ eyes: "wide", mouth: "o", brows: 0.9, sweat: true }} pose={poses.scared(frame + i * 3)} z={-10 - i * 0.01} />
          ))}
        </CouncilHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 183.53 "and someone remembers the young general from Toulon."
export const RemembersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.3, 0.46, 1.7);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.55} bgBlur={3} bg={<CouncilHall floor={-700} />}>
        <Character {...ROYALIST(5)} hat={null} x={a.x} y={a.y} s={1.7} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "open" }} pose={poses.point(frame)} z={-6} />
        <Lightbulb x={a.x - 60} y={a.y + 760} s={0.8 * pop(t, 184.0)} z={-5.5} />
        <Painting x={420} y={60} w={420} h={520} canvas="#cfd8e0" plate={false} z={-7}>
          <Character {...YOUNG_GEN} y={-250} s={0.8} look={0.3} expression={{ eyes: "open", mouth: "flat" }} pose={poses.handsOnHips} shadow={false} />
        </Painting>
      </DepthStage>
      <Label text="TOULON!" x={0.72} y={0.12} size={0.07} kind="stamp" rotate={-6} at={at(185.3)} pin />
    </AbsoluteFill>
  );
};

// 186.25 "Napoleon brings in cannons and points them down the streets around the government's palace."
export const CannonsInShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const roll = ramp(t, 186.3, 188.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 140 }} light={L} vignette={0.5}>
        <ParisStreet floor={-460} palace>
          {[0, 1, 2].map((i) => (
            <FieldGun key={i} x={-900 + i * 640 - (1 - roll) * 500} y={-480 - (i % 2) * 40} s={0.95} z={-12 - i * 0.01} />
          ))}
          <Character {...YOUNG_GEN} outfit={{ ...YOUNG_GEN.outfit, epaulettes: "#e2b23c", sash: "#c8262f" }} x={700} y={-480} s={1.2} facing={-1} look={0.6} expression={{ eyes: "squint", mouth: "flat", brows: -0.5 }} pose={poses.point(frame)} talking z={-10} />
        </ParisStreet>
      </Stage>
      <Label text="THE TUILERIES PALACE" x={0.06} y={0.09} size={0.042} kind="box" at={at(189.1)} />
    </AbsoluteFill>
  );
};

// 190.35 "When the royalists attack, the cannons fire."
export const CannonsFireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fire = (i: number) => Math.max(0, Math.min(1, (t - 191.7 - i * 0.15) / 0.9));
  const charge = (t - 190.2) * 120;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.82), x: 200, y: 160, shake: hitAt(t, 191.75) * 14 }} light={L} vignette={0.55}>
        <ParisStreet floor={-460} church smoke={ramp(t, 191.8, 192.8)}>
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...ROYALIST(i)} x={600 + i * 220 - charge} y={-330 - (i % 2) * 40} s={0.8} facing={-1} look={0.6} expression={{ eyes: "angry", mouth: "shout" }} pose={{ ...poses.run(frame + i * 5, i), armF: AIM }} holdF={<HeldMusket arm={AIM} dir={0.1} />} z={-20 - (i % 2) * 0.5} />
          ))}
          {[0, 1].map((i) => (
            <FieldGun key={i} x={-900 + i * 420} y={-560 - i * 30} s={1.0} fire={fire(i)} z={-12 - i * 0.01} />
          ))}
        </ParisStreet>
      </Stage>
    </AbsoluteFill>
  );
};

// 193.08 "The attack collapses within hours."
export const CollapseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const flee = (t - 192.8) * 260;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.85), y: 140 }} light={L} vignette={0.5}>
        <ParisStreet floor={-460} smoke={0.6}>
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...ROYALIST(i + 2)} x={-200 + i * 260 + flee} y={-440 - (i % 2) * 50} s={0.95} facing={1} look={0.7} expression={{ eyes: "wide", mouth: "o", sweat: true, brows: 0.9 }} pose={poses.run(frame + i * 4, i)} z={-10 - (i % 2) * 0.5} />
          ))}
          <X x={-500} y={-520} rot={1.4} z={-11}>
            <NationFlag kind="royal" w={200} pole={400} wave={0} />
          </X>
        </ParisStreet>
      </Stage>
      <Label text="WITHIN HOURS" x={0.06} y={0.85} size={0.05} kind="box" at={at(194.2)} />
    </AbsoluteFill>
  );
};

// 195.27 "The romance writer has just saved the Revolution."
export const SavedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.48, 1.8);
  const arm: [number, number] = [2.2, 0.4];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<ParisStreet floor={-700} palace />}>
        <Character {...YOUNG_GEN} outfit={{ ...YOUNG_GEN.outfit, epaulettes: "#e2b23c", sash: "#c8262f" }} x={a.x} y={a.y} s={1.8} facing={1} look={0.3} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: arm, armB: [-0.9, 1.4], handF: "fist" }} holdF={<HeldSabre arm={arm} dir={Math.PI / 2 + 0.25} />} holdB={<X rot={1.5} s={0.35}><Book cover="#c84a6a" /></X>} z={-6} />
      </DepthStage>
      <Label text="SAVED THE REVOLUTION" x={0.5} y={0.1} size={0.07} kind="title" at={at(196.6)} />
    </AbsoluteFill>
  );
};

// 198.44 "As a reward, he gets his own army, in Italy."
export const ArmyItalyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const c = eu([8.5, 45.2]);
  const cam = { zoom: 1.4, x: c[0], y: c[1] };
  const nice: [number, number] = [7.26, 43.7];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack islands={["corsica", "sardinia"]} tint={{ Italy: "#e2b23c" }} tintK={0.5 * ramp(t, 200.5, 201.0)} routes={[{ pts: [nice, [8.3, 44.3], [9.2, 45.0], EURO.milan], k: ramp(t, 199.4, 201.0), width: 26 }]} />
      </Stage>
      <Label text="ARMY OF ITALY" x={0.5} y={0.1} size={0.07} kind="title" at={at(199.9)} />
    </AbsoluteFill>
  );
};

// 201.39 "And here we see Napoleon's rule for the first time."
export const RuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 60 }} light={L} vignette={0.5}>
        <StudySet floor={-500} map={false}>
          <RuleBoard x={260} y={120} s={0.95 * pop(t, 202.6)} z={-20} />
          <Character {...NAPOLEON} x={-640} y={-500} s={1.3} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "smirk" }} pose={poses.point(frame)} z={-10} />
        </StudySet>
      </Stage>
      <Label text="NAPOLEON'S RULE" x={0.62} y={0.38} size={0.065} kind="hand" color="#f2f2ea" at={at(202.7)} pin />
    </AbsoluteFill>
  );
};

// 204.17 "He wins by being faster than everyone else."
export const FasterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const nx = -900 + (t - 204) * 900;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 120 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.5}>
          {[0, 1, 2].map((i) => (
            <Line key={i} pts={[[nx - 240 - i * 40, -280 + i * 90], [nx - 520 - i * 80, -280 + i * 90]]} width={10} color="#ffffff" opacity={0.8} z={-11} />
          ))}
          <Character {...NAPOLEON} x={nx} y={-460} s={1.15} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "grin", brows: -0.3 }} pose={poses.run(frame * 1.6, 1)} z={-10} />
          {[0, 1].map((i) => (
            <Character key={i} {...AUSTRIAN(i)} x={300 + i * 420} y={-440 - i * 20} s={1.05} facing={1} look={0.5} expression={{ eyes: "half", mouth: "flat", eyebags: true }} pose={poses.walk(frame, 0.35)} z={-12 - i * 0.01} />
          ))}
        </BattlefieldSet>
      </Stage>
      <Label text="FASTER THAN EVERYONE ELSE" x={0.5} y={0.1} size={0.06} kind="title" at={at(205.1)} />
    </AbsoluteFill>
  );
};

// 206.84 "Faster to think, faster to march, faster to strike."
export const ThinkMarchStrikeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={L} vignette={0.45}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2c3a5e" flat outline={0} z={-30} />
        <Card x={-560} y={40} s={pop(t, 207.2)} color="#e2b23c" z={-10}>
          <Lightbulb y={-60} s={1.1} />
        </Card>
        <Card x={0} y={40} s={pop(t, 208.35)} color="#3f8a5a" z={-10}>
          <BootIcon y={-90} s={1.0} />
        </Card>
        <Card x={560} y={40} s={pop(t, 209.45)} color="#c8262f" z={-10}>
          <X rot={-0.6} y={-150} x={-40} s={0.8}>
            <Sabre />
          </X>
        </Card>
      </Stage>
      <Label text="THINK" x={0.21} y={0.78} size={0.05} kind="box" at={at(207.3)} pin />
      <Label text="MARCH" x={0.5} y={0.78} size={0.05} kind="box" at={at(208.4)} pin />
      <Label text="STRIKE" x={0.79} y={0.78} size={0.05} kind="box" at={at(209.5)} pin />
    </AbsoluteFill>
  );
};

// 210.45 "Remember this rule."
export const RememberRuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.35), y: 120 }} light={L} vignette={0.5}>
        <StudySet floor={-600} map={false}>
          <RuleBoard x={0} y={120} s={1} z={-20} />
        </StudySet>
      </Stage>
      <Label text="THE RULE:" x={0.5} y={0.3} size={0.07} kind="hand" color="#f2f2ea" at={at(210.4)} pin />
      <Label text="BE FASTER" x={0.5} y={0.47} size={0.1} kind="hand" color="#ffe27a" at={at(210.6)} pin />
    </AbsoluteFill>
  );
};

// 211.51 "It explains his greatest wins and his worst disasters."
export const WinsDisastersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.45}>
        <Part shape={roundRect(1000, 3000, 0)} color="#3f8a5a" flat outline={0} x={-500} z={-30} />
        <Part shape={roundRect(1000, 3000, 0)} color="#5a6a8a" flat outline={0} x={500} z={-30} />
        <X x={-480} y={40} s={pop(t, 212.8)} z={-10}>
          <LaurelCrown r={200} />
        </X>
        <X x={480} y={40} s={pop(t, 213.9)} z={-10}>
          <Part shape={circle(220)} color="#e8eef6" shade={0.2} />
          {Array.from({ length: 6 }, (_, i) => (
            <X key={i} rot={(i / 6) * Math.PI} z={0.001}>
              <Part shape={roundRect(26, 340, 10)} color="#7aa0d8" flat outline={4} />
            </X>
          ))}
        </X>
      </Stage>
      <Label text="GREATEST WINS" x={0.25} y={0.85} size={0.05} kind="box" at={at(212.8)} pin />
      <Label text="WORST DISASTERS" x={0.75} y={0.85} size={0.05} kind="box" at={at(213.9)} pin />
    </AbsoluteFill>
  );
};

// 215.29 "His army in Italy is hungry, unpaid, and dressed in rags."
export const RagsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const ragged = (i: number) => ({ ...SOLDIER(i), outfit: { ...SOLDIER(i).outfit, patches: "#8a7a5a", lapels: "#d8d2c4", crossbelts: null, top: "#4a5a7a" } });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 80 }} light={L} vignette={0.55}>
        <BattlefieldSet floor={-460} sun={0} grass="#a8a060">
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...ragged(i)} hat={i % 2 ? "shako" : null} x={-760 + i * 500} y={-460 - (i % 2) * 30} s={1.15} facing={i % 2 ? -1 : 1} look={0.5} expression={{ eyes: "sad", mouth: i === 1 ? "wavy" : "frown", brows: 0.6, eyebags: true }} pose={i === 2 ? poses.sit(frame) : poses.grief(frame + i * 9)} z={-10 - i * 0.01} />
          ))}
        </BattlefieldSet>
      </Stage>
      <Label text="HUNGRY" x={0.18} y={0.18} size={0.05} kind="stamp" rotate={-5} at={at(216.35)} pin />
      <Label text="UNPAID" x={0.5} y={0.14} size={0.05} kind="stamp" rotate={4} at={at(217.1)} pin />
      <Label text="RAGS" x={0.82} y={0.18} size={0.05} kind="stamp" rotate={-3} at={at(218.5)} pin />
    </AbsoluteFill>
  );
};

// 219.39 "Within weeks, he has it moving faster than the enemy can react."
export const FastMarchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const run = (t - 219.2) * 300;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.82), x: run * 0.9, y: 140 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.6}>
          <Steed x={-200 + run} y={-470} s={0.85} walk={1.6} cloth="#2c4486">
            <Character {...NAPOLEON} s={0.62} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={{ ...poses.sit(frame), armF: [1.3, 0.2], handF: "point" }} />
          </Steed>
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...SOLDIER(i + 2)} x={-700 + run - i * 260} y={-430 - (i % 2) * 40} s={0.9} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.run(frame * 1.3 + i * 5, i), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.3} />} z={-12 - (i % 2) * 0.5} />
          ))}
          {[0, 1].map((i) => (
            <Character key={`a${i}`} {...AUSTRIAN(i + 2)} x={1500 + i * 260} y={-420} s={0.9} facing={-1} look={0.6} expression={{ eyes: "wide", mouth: "o", sweat: true }} pose={poses.scared(frame)} z={-14} />
          ))}
        </BattlefieldSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 222.88 "He splits his enemies apart and beats them one by one."
export const SplitMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const c = eu([8.6, 44.6]);
  const cam = { zoom: 2.2, x: c[0], y: c[1] };
  const austr = eu([9.4, 44.75]);
  const sard = eu([7.9, 44.55]);
  const hit1 = t > 224.5;
  const hit2 = t > 225.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.04), x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack islands={["corsica"]} routes={[
          { pts: [[8.45, 44.25], [8.6, 44.6]], k: ramp(t, 222.9, 223.8), width: 12 },
          { pts: [[8.6, 44.6], [8.05, 44.56]], k: ramp(t, 224.3, 224.7), width: 10 },
          { pts: [[8.6, 44.6], [9.28, 44.73]], k: ramp(t, 224.9, 225.3), width: 10 },
        ]} />
        <X x={austr[0]} y={austr[1]} z={0.3}>
          <Part shape={circle(26)} color={hit2 ? "#9a9aa2" : "#f0ece2"} shade={0.2} outline={5} />
        </X>
        <X x={sard[0]} y={sard[1]} z={0.3}>
          <Part shape={circle(26)} color={hit1 ? "#9a9aa2" : "#5a8ad0"} shade={0.2} outline={5} />
        </X>
      </Stage>
      <Label text="AUSTRIA" x={0.66} y={0.36} size={0.045} kind="box" at={at(223.4)} pin />
      <Label text="PIEDMONT" x={0.32} y={0.36} size={0.045} kind="box" at={at(223.4)} pin />
      <Label text="1" x={0.36} y={0.58} size={0.07} kind="stamp" at={at(224.5)} pin />
      <Label text="2" x={0.64} y={0.58} size={0.07} kind="stamp" at={at(225.2)} pin />
    </AbsoluteFill>
  );
};

// 225.94 "His soldiers joke that he wins wars with their legs."
export const LegsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -60 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-560} sun={0}>
          {[0, 1].map((i) => (
            <Character key={i} {...SOLDIER(i + 5)} x={-420 + i * 840} y={-560} s={1.55} facing={i ? -1 : 1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: [0.7, -0.3], armB: [-0.3, 0.6], handF: "point", bob: Math.abs(Math.sin(frame * 0.4 + i)) * 10, lean: 0.1 }} z={-10 - i * 0.01} />
          ))}
        </BattlefieldSet>
      </Stage>
      <Label text="“HE WINS WARS WITH OUR LEGS!”" x={0.5} y={0.1} size={0.055} kind="box" at={at(226.6)} />
    </AbsoluteFill>
  );
};

// 229.25 "And they give him a nickname: the little corporal."
export const CorporalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 60 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.5}>
          <Character {...NAPOLEON} x={0} y={-460} s={1.3} facing={1} look={0.1} expression={{ eyes: "happy", mouth: "smile", blush: true }} pose={poses.handsOnHips} z={-10} />
          {[-1, 1].map((k, i) => (
            <Character key={k} {...SOLDIER(i + 7)} x={k * 620} y={-450} s={1.2} facing={k > 0 ? -1 : 1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.salute} z={-11} />
          ))}
        </BattlefieldSet>
      </Stage>
      <Label text="“LE PETIT CAPORAL”" x={0.5} y={0.1} size={0.07} kind="title" at={at(230.6)} sub="THE LITTLE CORPORAL" />
    </AbsoluteFill>
  );
};

// 232.06 "And no, that's not because he was short."
export const NotShortShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.5, 2.0);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<BattlefieldSet floor={-700} />}>
        <Character {...NAPOLEON} x={a.x} y={a.y} s={2.0} facing={1} look={0.1} expression={{ eyes: "angry", mouth: "frown", brows: -0.8 }} pose={poses.handsOnHips} z={-6} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 234.32 "Let's bust that myth right now."
export const BustMythShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), shake: hitAt(t, 235.15) * 12 }} light={L} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2c3a5e" flat outline={0} z={-30} />
        <X s={pop(t, 235.15)} z={-10}>
          <XMark s={2.2} color="#e2574a" />
        </X>
      </Stage>
      <Label text="MYTH" x={0.5} y={0.5} size={0.14} kind="stamp" rotate={-6} at={at(234.9)} pin />
    </AbsoluteFill>
  );
};

/** Height chart scene: chart at x, characters standing beside it on `floor`. */
const HeightWall: React.FC<{ floor: number; children?: React.ReactNode; mark?: number; k?: number }> = ({ floor, children, mark = 168, k = 1 }) => {
  const px = 3.2 * 1.3;
  return (
    <>
      <Part shape={roundRect(5000, 3000, 0)} color="#d8cfb8" flat outline={0} z={-30} />
      <Part shape={roundRect(5000, 1200, 0)} color="#a87a4a" flat outline={0} y={floor - 600} z={-29} />
      <X x={-40} y={floor} s={1.3} z={-25}>
        <HeightChart from={0} to={200} px={3.2} />
      </X>
      {mark > 0 ? (
        <X y={floor + mark * px} z={-24}>
          <Line pts={[[-140, 0], [-140 + 260 * k, 0]]} width={10} color="#c8262f" />
        </X>
      ) : null}
      {children}
    </>
  );
};

// 236.33 "Napoleon was about 1.68 meters tall."
export const HeightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const floor = -460;
  const s = (168 * 3.2 * 1.3) / 470;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: 60 }} light={L} vignette={0.45}>
        <HeightWall floor={floor} k={ramp(t, 237.3, 237.8)}>
          <Character {...NAPOLEON} hat={null} x={-280} y={floor} s={s} facing={1} look={0.5} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.idle(frame, 1)} z={-10} />
        </HeightWall>
      </Stage>
      <Label text="1.68 m" x={0.64} y={0.2} size={0.09} kind="title" at={at(237.4)} pin />
      <Label text="5 ft 6 in" x={0.64} y={0.32} size={0.05} kind="box" at={at(238.3)} pin />
    </AbsoluteFill>
  );
};

// 239.87 "That's average, or a bit above, for a Frenchman back then."
export const AverageShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const floor = -460;
  const s = (168 * 3.2 * 1.3) / 470;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), x: 140, y: 60 }} light={L} vignette={0.45}>
        <HeightWall floor={floor} mark={168}>
          <Character {...NAPOLEON} hat={null} x={-280} y={floor} s={s} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 1)} z={-10} />
          <Character {...SOLDIER(2)} hat={null} x={420} y={floor} s={s * (164 / 168)} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, 3)} z={-10} />
        </HeightWall>
      </Stage>
      <Label text="NAPOLEON ~1.68 m" x={0.3} y={0.85} size={0.042} kind="box" at={at(240.0)} pin />
      <Label text="AVERAGE FRENCHMAN ~1.64 m" x={0.72} y={0.85} size={0.042} kind="box" at={at(242.7)} pin />
    </AbsoluteFill>
  );
};

/** A ruler with inch ticks. */
const Ruler: React.FC<{ y: number; len: number; ticks: number; color: string }> = ({ y, len, ticks, color }) => (
  <X y={y}>
    <Part shape={roundRect(len + 40, 90, 10)} color={color} shade={0.2} x={len / 2} />
    {Array.from({ length: ticks + 1 }, (_, i) => (
      <Line key={i} pts={[[(i * len) / ticks, 45], [(i * len) / ticks, 0]]} width={6} color="#211b20" z={0.001} />
    ))}
  </X>
);

// 244.08 "The myth comes partly from old French inches, which were longer than English ones."
export const InchesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 246.6, 247.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={L} vignette={0.45}>
        <Part shape={roundRect(4000, 3000, 0)} color="#e8dcc0" flat outline={0} z={-30} />
        <X x={-700} z={-10}>
          <Ruler y={160} len={1400 * (2.707 / 2.707)} ticks={5} color="#3b62b8" />
          <Ruler y={-160} len={1400 * (2.54 / 2.707) * (1 - k) + 1400 * k * (2.54 / 2.707)} ticks={5} color="#c8262f" />
        </X>
      </Stage>
      <Label text="FRENCH INCH  2.71 cm" x={0.06} y={0.18} size={0.045} kind="box" at={at(245.5)} />
      <Label text="ENGLISH INCH  2.54 cm" x={0.06} y={0.83} size={0.045} kind="box" at={at(247.4)} />
      <Label text="“5 FT 2”" x={0.86} y={0.5} size={0.06} kind="stamp" rotate={-5} at={at(247.9)} pin />
    </AbsoluteFill>
  );
};

// 248.61 "It comes from the giant guards who stood next to him."
export const GuardsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 200 }} light={L} vignette={0.5}>
        <ParisStreet floor={-460} palace>
          <Character {...NAPOLEON} x={0} y={-470} s={1.05} facing={1} look={0.2} expression={{ eyes: "open", mouth: "flat" }} pose={poses.handsOnHips} z={-10} />
          {[-1, 1].map((k, i) => (
            <Character key={k} {...GRENADIER(i)} x={k * 360} y={-480} s={1.45} facing={k > 0 ? -1 : 1} look={0.4} expression={{ eyes: "open", mouth: "flat", brows: -0.3 }} pose={shoulderPose(frame, i)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-10.5} />
          ))}
        </ParisStreet>
      </Stage>
    </AbsoluteFill>
  );
};

/** An 1800s print sheet (cream paper, hatched border); children are the cartoon. */
const PrintSheet: React.FC<{ x?: number; y?: number; s?: number; z?: number; children?: React.ReactNode }> = ({ x = 0, y = 0, s = 1, z = 0, children }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(900, 700, 8)} color="#f2e6c8" shade={0.12} />
    <Part shape={roundRect(820, 620, 4)} color="#f6eedc" flat outline={5} z={0.001} />
    {Array.from({ length: 12 }, (_, i) => (
      <Line key={i} pts={[[-400 + i * 12, -300], [-380 + i * 12, -320]]} width={3} color="#8a7a60" z={0.002} />
    ))}
    <X z={0.003}>{children}</X>
  </X>
);

// 251.37 "And it comes from British cartoonists, who drew him as a tiny,"
export const CartoonistShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.26, 0.42, 1.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.55}>
        <StudySet floor={-560} map={false}>
          <NationFlag kind="uk" x={-900} y={-560} w={220} pole={760} z={-30} />
          <Character {...CARTOONIST} x={a.x} y={a.y} s={1.7} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "grin", gaze: [0.6, -0.6] }} pose={{ armF: [1.0, 0.8 + Math.sin(frame * 0.9) * 0.12], armB: [-0.2, 0.4] }} holdF={<X rot={-0.6} s={0.7}><Quill /></X>} z={-12} />
          <Desk x={380} y={-560} w={900} z={-8} />
          <PrintSheet x={420} y={-80} s={0.7} z={-7}>
            <Character {...NAPOLEON} x={0} y={-260} s={0.62} look={0.3} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={poses.armsUp(frame)} shadow={false} />
          </PrintSheet>
        </StudySet>
      </Stage>
    </AbsoluteFill>
  );
};

// 254.78 "angry man called Little Boney."
export const BoneyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const stomp = Math.abs(Math.sin(frame * 0.5)) * 30;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#6a4a30" flat outline={0} z={-30} />
        <PrintSheet s={1.3} z={-20}>
          <Character {...NAPOLEON} hatColor="#211d24" x={0} y={-270 + stomp} s={0.75} look={0.2} expression={{ eyes: "angry", mouth: "shout", brows: -1 }} pose={{ ...poses.armsUp(frame), bob: 0 }} shadow={false} />
          <X y={160 + stomp} s={1.6} z={0.01}>
            <Part shape={blob([[-178, -6], [-130, 24], [-70, 84], [0, 112], [70, 84], [130, 24], [178, -6], [110, 6], [0, 14], [-110, 6]], 8)} color="#211d24" shade={0.22} />
          </X>
        </PrintSheet>
      </Stage>
      <Label text="“LITTLE BONEY”" x={0.5} y={0.86} size={0.08} kind="title" at={at(256.2)} />
    </AbsoluteFill>
  );
};

// 257.69 "In about a year, he wins battle after battle, and Austria is forced to make peace."
export const PeaceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const c = eu([10.6, 45.3]);
  const cam = { zoom: 1.7, x: c[0], y: c[1] };
  const battles: [number, number, number][] = [[8.2, 44.4, 258.9], [9.5, 45.3, 259.2], [11.2, 45.4, 259.6], [10.8, 45.6, 259.95], [12.3, 45.5, 260.2]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack islands={["corsica"]} tint={{ Austria: "#f0ece2" }} tintK={0.7} />
        {battles.map(([lon, lat, bt], i) => {
          const p = eu([lon, lat]);
          return (
            <X key={i} x={p[0]} y={p[1]} s={0.9 * pop(t, bt)} z={0.3}>
              <BattleIcon />
            </X>
          );
        })}
      </Stage>
      <Label text="BATTLE AFTER BATTLE" x={0.06} y={0.09} size={0.045} kind="box" at={at(259.2)} />
      <Label text="PEACE WITH AUSTRIA · 1797" x={0.5} y={0.86} size={0.055} kind="stamp" at={at(261.9)} />
    </AbsoluteFill>
  );
};

export const _c = { interpolate, Doc, Steed, ShipOfLine, Cannonballs, SnowField, SpeechBubble, BRIT_NAVY, ellipse, poly, AIM, aimPose };
