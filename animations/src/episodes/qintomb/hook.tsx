import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Wash, Hammer, Spear, roundRect, roundPoly, circle, poly, blob, ramp, push, hitAt, absT, rng, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Sky, Sun, Mountains, Ground, BurialMound, MercuryRiver, StarCeiling, OilLamp, CrossbowTrap, StoneGate, TombWall, StoneFloor, WallTorch, Flame, Tree,
  FallingLeaves, ChineseHall,
} from "../../kit/env";
import { sec, pop } from "../../kit/shot";
import { TombCorridor, PalaceVault } from "./sets";
import { WORKER, OFFICIAL, GUARD, ZHAO_GAO } from "./cast";
import { upright, You, TrapPlan } from "./p1a";

// The cold open (0–29 s), rebuilt as close, lamp-lit, cinematic shots.

/** Four-point glint. */
const Glint: React.FC<{ x: number; y: number; k: number; size?: number; z?: number }> = ({ x, y, k, size = 26, z = 0 }) => {
  if (k <= 0) return null;
  const s = size * k;
  return (
    <X x={x} y={y} z={z}>
      <Glow rx={s * 2.2} color="#ffffff" alpha={0.35 * k} additive />
      <Part shape={poly([[0, s], [s * 0.18, 0], [0, -s], [-s * 0.18, 0]])} color="#ffffff" flat outline={0} />
      <Part shape={poly([[s * 0.7, 0], [0, s * 0.14], [-s * 0.7, 0], [0, -s * 0.14]])} color="#ffffff" flat outline={0} z={0.001} />
    </X>
  );
};
const twinkle = (frame: number, i: number, rate = 0.11) => Math.max(0, Math.sin(frame * rate + i * 2.1)) ** 3;

/** Lacquered funeral coffin: black lacquer, red bands, gold cloud scrolls. Origin = bottom centre. */
const Coffin: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundPoly([[-300, 0], [300, 0], [310, 150], [270, 200], [-270, 200], [-310, 150]], 14)} color="#1e1a20" shade={0.24} />
    <Part shape={roundRect(560, 26, 6)} color="#b8322a" shade={0.15} y={34} z={0.001} />
    <Part shape={roundRect(520, 22, 6)} color="#b8322a" shade={0.15} y={168} z={0.001} />
    {[-180, 0, 180].map((cx) => (
      <X key={cx} x={cx} y={100} z={0.002}>
        <Part shape={circle(34)} color="#c9963f" shade={0.2} />
        <Part shape={circle(18)} color="#1e1a20" flat outline={3} z={0.001} />
        <Line pts={Array.from({ length: 14 }, (_, i) => [Math.cos(i * 0.6) * (6 + i * 0.9), Math.sin(i * 0.6) * (6 + i * 0.9)] as [number, number])} width={3} color="#c9963f" z={0.002} />
      </X>
    ))}
    {[-90, 90].map((cx) => (
      <Line key={cx} pts={[[cx - 50, 100], [cx - 20, 120], [cx + 20, 80], [cx + 50, 100]]} smooth width={5} color="#c9963f" z={0.002} />
    ))}
    <Line pts={[[-460, -20], [460, -20]]} width={14} color="#6e4a2c" z={-0.01} />
  </X>
);

// ───────────────────────── 0.0 "It's autumn, 210 BC." ─────────────────────────
export const AutumnHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const g = -190;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12), x: interpolate(frame, [0, dur], [-40, 30]) }} light={{ dir: [-0.5, 0.6] }} vignette={0.7} vignetteColor="#1a0c10">
        <Sky w={5000} h={3200} y={1400} top="#2b2048" mid="#c4513a" bottom="#f5b062" z={-41} />
        <Sun x={-430} y={g + 110} r={115} color="#ffe2a0" glow={1} z={-40.5} />
        <Mountains w={5000} y={g + 20} color="#8a4e66" outline={3} peaks={[[-1500, 180], [-900, 320], [-300, 200], [300, 280], [900, 210], [1500, 260]]} z={-40} />
        <Mountains w={5000} y={g} color="#5e3a52" outline={3} peaks={[[-1400, 120], [-700, 200], [0, 90], [800, 170], [1400, 110]]} z={-39.5} />
        <Ground w={5000} h={1600} y={g} color="#7a5a3c" far="#8f6a46" pebbles={8} tufts={10} tuftColor="#5a4a2a" seed={3} z={-35} />
        <BurialMound x={170} y={g - 2} w={1250} h={430} stage="build" seed={5} z={-30} />
        {/* the tunnel mouth glowing at the foot of the mound */}
        <X x={150} y={g - 2} z={-29}>
          <Glow y={70} rx={260} ry={160} color="#ffb35a" alpha={0.55} additive />
          <Part shape={roundRect(150, 180, 70)} color="#1a1012" flat outline={6} y={70} />
          <Glow y={50} rx={70} ry={80} color="#ffcf7a" alpha={0.5} additive z={0.01} />
        </X>
        {/* torch procession heading into the tomb */}
        {Array.from({ length: 12 }, (_, i) => {
          const x = -820 + i * 72 + frame * 1.8;
          if (x > 110) return null;
          return (
            <X key={i} x={x} y={g - 24 - (i % 2) * 8} s={0.24} z={-28 + i * 0.001}>
              <Part shape={roundRect(60, 120, 20)} color={i % 3 === 0 ? "#f4f1ea" : "#2a1e22"} shade={0.2} y={60} />
              <Part shape={circle(34)} color="#f6f5f8" shade={0.2} y={150} z={0.001} />
              {i % 2 === 0 ? (
                <X x={44} y={180} z={0.002}>
                  <Line pts={[[0, -60], [0, 40]]} width={8} color="#5a3a26" />
                  <Flame y={50} size={0.9} seed={i} z={0.001} />
                  <Glow y={60} rx={120} color="#ffb35a" alpha={0.45} additive />
                </X>
              ) : null}
            </X>
          );
        })}
        {/* foreground: a guard watching, an autumn tree framing the right */}
        <Character
          {...GUARD(0)}
          x={-700}
          y={-800}
          s={1.85}
          z={6}
          facing={1}
          look={0.15}
          expression={{ eyes: "half", mouth: "flat", brows: -0.3 }}
          pose={{ ...poses.idle(frame), armF: [0.5, 0.9] }}
          holdF={<Spear rot={upright([0.5, 0.9])} length={900} />}
        />
        <Tree x={1000} y={-700} h={1250} kind="autumn" seed={4} spread={1.1} z={5} />
        <FallingLeaves w={2600} h={1400} count={30} seed={5} z={8} />
      </Stage>
      <Label text="210 BC" sub="AUTUMN" x={0.56} y={0.12} size={0.12} kind="title" at={sec(start)(0.9)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 2.75 "You're deep under a giant hill in China, holding a lamp." ─────────────────────────
export const DiveHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dive = ramp(t, 2.95, 3.75, Easing.inOut(Easing.cubic));
  const close = ramp(t, 3.7, 6.1, Easing.out(Easing.quad));
  const camY = interpolate(dive, [0, 1], [1620, -40]) + close * -230;
  const zoom = interpolate(dive, [0, 1], [0.95, 1.05]) * (1 + close * 1.05);
  const surface = 1400;
  const strata = ["#8a6240", "#7a5536", "#6e4a30", "#5e3f2a", "#4e3424"];
  const r = rng(11);
  const speed = Math.sin(Math.PI * dive);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: camY, shake: speed * 6 }} light={{ pos: [140, -120] }} vignette={0.8} vignetteColor="#05040a">
        {/* surface at dusk */}
        <Sky w={5000} h={1800} y={surface + 900} top="#2b2048" mid="#c4513a" bottom="#f5b062" z={-41} />
        <BurialMound x={0} y={surface} w={1500} h={480} stage="build" seed={5} z={-30} />
        {/* earth layers */}
        {strata.map((c, i) => (
          <Part key={i} shape={roundRect(5000, 260, 0)} color={c} flat outline={0} y={surface - 130 - i * 250} z={-34 + i * 0.01} />
        ))}
        {Array.from({ length: 40 }, (_, i) => (
          <Part key={`st${i}`} shape={blob([[-14, 0], [0, 10], [16, 2], [6, -10]], 4)} color="#3e2c22" shade={0.2} x={(r() - 0.5) * 2400} y={surface - 40 - r() * 1150} z={-33} />
        ))}
        <Line pts={[[-2500, surface], [2500, surface]]} width={6} z={-33} />
        {/* the chamber */}
        <TombWall y={-640} w={5000} h={850} z={-32} />
        <StoneFloor y={-640} w={5000} h={600} z={-31} />
        <X y={-300} z={-20}>
          <Wash width={5000} height={2000} color="#04060c" alpha={0.62} z={0} />
        </X>
        <X x={-40} y={-640} z={2}>
          <Glow y={420} rx={720} ry={560} color="#ffcf7a" alpha={0.42 + Math.sin(frame * 0.4) * 0.03} additive />
          <You
            x={0}
            y={0}
            s={1.05}
            arm={[2.3, 0.5]}
            look={0.45}
            expression={{ eyes: "open", mouth: "flat", brows: 0.35, gaze: [Math.sin(frame * 0.12) * 0.8, 0.1] }}
          />
        </X>
        {/* speed lines during the dive */}
        {speed > 0.05
          ? Array.from({ length: 14 }, (_, i) => (
              <Line key={`sp${i}`} pts={[[-900 + i * 140, camY - 300 + ((i * 97) % 400)], [-900 + i * 140, camY + 200 + ((i * 97) % 400)]]} width={4} color="#f6e7c8" z={30} />
            ))
          : null}
      </Stage>
      <Label text="YOU" x={0.63} y={0.22} size={0.06} kind="box" at={sec(start)(4.55)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 6.15 "Around you, rivers of silver shine across the floor." ─────────────────────────
export const SilverHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, dur], [0, 1], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: interpolate(k, [0, 1], [1.45, 1.18]), x: interpolate(k, [0, 1], [-330, 160]), y: interpolate(k, [0, 1], [-210, -170]) }} light={{ pos: [-300, -100] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.75} vignetteColor="#04060c">
        <PalaceVault floorY={-300}>
          <MercuryRiver y={-210} w={4200} h={90} speed={1.3} z={-6} />
          <MercuryRiver y={-470} w={4200} h={170} speed={1.6} z={-4} />
          {Array.from({ length: 10 }, (_, i) => (
            <Glint key={i} x={-900 + i * 260 + ((frame * 3 + i * 70) % 260)} y={i % 2 ? -460 : -205} k={twinkle(frame, i, 0.16)} size={i % 2 ? 26 : 16} z={-3} />
          ))}
          <Glow x={-420} y={-470} rx={420} ry={120} color="#ffe2a8" alpha={0.35} additive z={-3.5} />
          <You x={-560} y={-920} s={1.75} z={2} look={0.5} arm={[1.7, 0.6]} expression={{ eyes: "wide", mouth: "o", brows: 0.5, gaze: [0.7, -0.7] }} />
        </PalaceVault>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── 9.45 "Above you, the ceiling is full of stars." ─────────────────────────
export const StarsHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, dur], [0, 1], { easing: Easing.inOut(Easing.quad) });
  const r = rng(21);
  const pearls = Array.from({ length: 16 }, () => [(r() - 0.5) * 2600, 80 + r() * 900] as [number, number]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: interpolate(k, [0, 1], [1.12, 1.0]), y: interpolate(k, [0, 1], [-250, 60]) }} light={{ pos: [0, -400] }} vignette={0.7} vignetteColor="#04060c">
        <StarCeiling w={3200} h={2000} y={640} seed={7} z={-40} />
        {pearls.map(([x, y], i) => (
          <X key={i} x={x} y={y} z={-39}>
            <Glow rx={70} color="#fff2c6" alpha={0.25 + 0.35 * twinkle(frame, i, 0.09)} additive />
            <Part shape={circle(9)} color="#fff6dc" flat outline={0} />
          </X>
        ))}
        {/* vault edge and the worker looking up */}
        <Part shape={roundPoly([[-2000, -1400], [2000, -1400], [2000, -330], [1300, -260], [-1300, -260], [-2000, -330]], 30)} color="#141a33" flat outline={6} z={-30} />
        <X x={140} y={-1130} z={2}>
          <Glow y={760} rx={520} color="#ffcf7a" alpha={0.4} additive />
          <You x={0} y={0} s={2.55} arm={[2.7, 0.3]} look={0.25} expression={{ eyes: "wide", mouth: "o", brows: 0.6, gaze: [0.05, 1] }} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── 12.25 "And hidden in the dark are crossbows, loaded and aimed at the doors." ─────────────────────────
export const CrossbowHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const camX = interpolate(t, [12.25, 16.45], [-760, 640], { easing: Easing.inOut(Easing.quad) });
  const bows = [-820, -230, 360];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.32, x: camX, y: -150 }} light={{ pos: [camX - 200, -100] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.85} vignetteColor="#04060c">
        <TombCorridor floorY={-560} torches={false} dark={0.72}>
          <StoneGate x={1150} y={-560} w={520} h={620} drop={0} z={1} />
          {bows.map((x, i) => (
            <X key={x} x={x} y={-330} z={3 + i * 0.01}>
              <Part shape={roundRect(300, 40, 6)} color="#4a5254" shade={0.2} y={-30} />
              <CrossbowTrap s={1.7} />
            </X>
          ))}
        </TombCorridor>
        {/* the lamp light travelling with you reveals them */}
        <Glow x={camX - 260} y={-260} rx={560} ry={440} color="#ffcf7a" alpha={0.5} additive z={41} />
        {bows.map((x, i) => (
          <Glint key={i} x={x + 230} y={-262} k={ramp(t, 13.0 + i * 0.85, 13.3 + i * 0.85) * (0.6 + 0.4 * twinkle(frame, i, 0.25))} size={28} z={42} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── 16.45 "You know where every one of them is." ─────────────────────────
export const KnowWhereHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dart = Math.sign(Math.sin(frame * 0.35)) * 0.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [-200, -200] }} vignette={0.8} vignetteColor="#04060c">
        <TombWall y={-700} w={4000} h={1600} z={-40} />
        <Wash width={4000} height={3000} color="#04060c" alpha={0.6} z={-30} />
        <Glow x={-420} y={-120} rx={700} color="#ffcf7a" alpha={0.42} additive z={-20} />
        <You x={-470} y={-940} s={2.7} arm={[1.9, 0.7]} look={0.4} expression={{ eyes: "open", mouth: "smirk", brows: -0.3, gaze: [dart, 0.2] }} />
        <X x={470} y={40} s={0.66} rot={-0.04} z={4}>
          <TrapPlan t={t} marks={[16.75, 16.95, 17.15, 17.35, 17.55, 17.75]} />
        </X>
        {[0, 1, 2].map((i) => (
          <Part key={i} shape={circle(10 + i * 6)} color="#efe2c4" shade={0.1} x={-150 + i * 70} y={160 + i * 40} z={3} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── 18.05 "You helped build them." ─────────────────────────
export const BuildHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const swing = Math.max(0, Math.sin(frame * 0.55));
  const hit = Math.sin(frame * 0.55) > 0.96;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: hit ? 4 : 0 }} light={{ pos: [-300, 200] }} vignette={0.7} vignetteColor="#04060c">
        <TombCorridor floorY={-640} dark={0.35}>
          <Part shape={roundRect(760, 380, 10)} color="#4a5254" shade={0.22} x={300} y={-640} z={1} />
          <CrossbowTrap x={300} y={-450} s={2.1} z={2} />
          <Character
            {...WORKER(0)}
            x={-430}
            y={-1020}
            s={2.3}
            z={3}
            look={0.5}
            expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }}
            pose={{ armF: [1.35 - swing * 0.75, 0.55], armB: [0.9, 0.7] }}
            holdF={<Hammer rot={Math.PI} s={1.05} />}
          />
          {hit
            ? Array.from({ length: 7 }, (_, i) => {
                const a = -0.6 + i * 0.25;
                return <Line key={i} pts={[[40 + Math.cos(a) * 30, -330 + Math.sin(a) * 30], [40 + Math.cos(a) * 110, -330 + Math.sin(a) * 110]]} width={6} color="#ffd36a" z={5} />;
              })
            : null}
        </TombCorridor>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── 19.45 "Today, China's first emperor is being buried here." ─────────────────────────
export const FuneralHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cx = -380 + frame * 3.2;
  const floor = -620;
  const s = 1.3;
  const poleY = floor + 372 * s;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.12, x: cx + 60, y: -120 }} light={{ pos: [cx, 300] }} vignette={0.75} vignetteColor="#04060c">
        <TombCorridor floorY={floor} dark={0.25}>
          {[-900, -200, 500, 1200, 1900].map((x, i) => (
            <WallTorch key={x} x={x} y={floor + 820} seed={i + 4} z={-34} />
          ))}
          <Coffin x={cx} y={poleY + 14} s={0.95} z={4} />
          {[-300, -100, 100, 300].map((dx, i) => (
            <Character
              key={i}
              {...(i % 2 ? WORKER(i + 1) : OFFICIAL(i))}
              x={cx + dx * 1.15}
              y={floor + (i % 2) * 6}
              s={s}
              z={i % 2 ? 3 : 5}
              look={0.5}
              expression={{ eyes: "half", mouth: "flat", brows: 0.5 }}
              pose={{ ...poses.walk(frame + i * 5, 0.55), armF: [2.85, 0.15], armB: [2.85, 0.15], armsOverHead: true }}
            />
          ))}
          {/* mourner with a white banner leading the way */}
          <Character
            {...OFFICIAL(2)}
            x={cx + 680}
            y={floor}
            s={s}
            z={4.5}
            look={0.5}
            expression={{ eyes: "closed", mouth: "flat", brows: 0.6 }}
            pose={{ ...poses.walk(frame + 3, 0.55), armF: [1.2, 0.8] }}
            holdF={
              <X rot={upright([1.2, 0.8])}>
                <Line pts={[[0, -80], [0, 520]]} width={9} color="#6e4a2c" />
                <Part shape={roundRect(120, 300, 6)} color="#f4f1ea" shade={0.15} x={64} y={360} z={0.001} />
              </X>
            }
          />
        </TombCorridor>
        {/* a guard's spear sweeping past the lens */}
        <X x={cx - 520 + frame * 2} y={floor - 200} z={20}>
          <Spear length={1500} rot={0.08} s={1.6} />
        </X>
      </Stage>
      <Label text="FIRST EMPEROR" x={0.5} y={0.14} size={0.06} kind="box" at={sec(start)(20.6)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 25.5 "Far above you, someone is deciding what to do with you." ─────────────────────────
export const DecidingHookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const ground = -10;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ pos: [0, 400] }} vignette={0.7} vignetteColor="#04060c">
        <Sky w={4000} h={1400} y={ground + 700} top="#0b1030" bottom="#2b3a63" z={-41} />
        <Ground w={4000} h={300} y={ground} color="#3a3428" far="#423a2e" pebbles={4} tufts={6} seed={2} z={-35} />
        {/* night: the plotters by a torch */}
        <Character {...ZHAO_GAO} x={-330} y={ground - 10} s={1.28} z={3} look={0.35} expression={{ eyes: "half", mouth: "smirk", brows: -0.6, gaze: [0.3, -0.9] }} pose={poses.think} />
        <Character {...OFFICIAL(1)} x={170} y={ground - 10} s={1.28} z={3} facing={-1} look={0.35} expression={{ eyes: "half", mouth: "flat", brows: -0.4, gaze: [0.3, -0.9] }} pose={poses.idle(frame)} />
        <X x={520} y={ground} z={2}>
          <Line pts={[[0, 0], [0, 300]]} width={10} color="#6e4a2c" />
          <Flame y={310} size={0.55} seed={3} z={0.01} />
          <Glow y={300} rx={360} color="#ffb35a" alpha={0.45} additive />
        </X>
        {/* the earth between, and you below */}
        <Part shape={roundRect(4000, 240, 0)} color="#5e3f2a" flat outline={0} y={ground - 120} z={-20} />
        <Line pts={[[-2000, ground - 240], [2000, ground - 240]]} width={6} z={-19} />
        <TombWall y={-1200} w={4000} h={960} z={-25} />
        <X y={-740} z={-18}>
          <Wash width={4000} height={1000} color="#04060c" alpha={0.55} z={0} />
        </X>
        <X x={-60} y={-930} z={4}>
          <Glow y={720} rx={520} ry={360} color="#ffcf7a" alpha={0.42} additive />
          <You x={0} y={0} s={1.9} arm={[2.2, 0.5]} look={0.3} expression={{ eyes: "wide", mouth: "wavy", brows: 0.8, gaze: [0.2, 1] }} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};
