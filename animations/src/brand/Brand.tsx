import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, X, Part, Line, InkLine, Arrow, Bow, Magnifier, Glow, roundRect, circle, rng } from "../kit";
import { Character, poses } from "../kit/character";
import { Sky, Cloud, Ground, Hill, PalmTree, Pyramid, LeaningTower, Moai, Flame, Smoke, Sunburst, FireLine } from "../kit/env";
import { ARCHER } from "../episodes/firearrows/cast";
import { EXPLORER } from "./cast";

// "Zecten Historical" brand art, drawn with the same kit as the videos and
// rendered as Remotion stills:
//   npx remotion still ChannelBanner out/brand/banner.png --frame=20
//   npx remotion still ChannelLogo out/brand/logo.png --frame=20

export const CHANNEL = { name: "ZECTEN", sub: "HISTORICAL" };

const INK = "#1d1519";
const CORAL = "#fe5649";
const FONT = "Montserrat, sans-serif";

// arm rig (see kit/character/Character.tsx)
const SHOULDER: [number, number] = [50, 206];
const UPPER = 60;
const FORE = 56;
const GRIP = 30;
const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

/** Two-bone IK: front-arm angles so the hand's grip lands on `target` (world). */
const reach = (x: number, y: number, s: number, facing: 1 | -1, target: [number, number]): [number, number] => {
  const sx = x + facing * SHOULDER[0] * s;
  const sy = y + SHOULDER[1] * s;
  const dx = (target[0] - sx) * facing;
  const dy = target[1] - sy;
  const L1 = UPPER * s;
  const L2 = (FORE + GRIP) * s;
  const d = Math.min(Math.hypot(dx, dy), L1 + L2 - 0.01);
  const phi = Math.atan2(dx, -dy);
  const a = Math.acos(clamp1((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
  const b = Math.acos(clamp1((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2)));
  return [phi - a, Math.PI - b];
};

/** Front-eye position (world) of a character with look 0.5. */
const frontEye = (x: number, y: number, s: number, facing: 1 | -1): [number, number] => [x + facing * 46 * s, y + 310 * s];

/** Heavy outlined text in the thumbnail style. */
const BigText: React.FC<{ text: string; x: number; y: number; size: number; color: string; rotate?: number; stroke?: number }> = ({
  text,
  x,
  y,
  size,
  color,
  rotate = 0,
  stroke = 0.13,
}) => {
  const { width, height } = useVideoConfig();
  const fs = size;
  return (
    <div
      style={{
        position: "absolute",
        left: (0.5 + x / width) * width,
        top: (0.5 - y / height) * height,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: fs,
        lineHeight: 1,
        whiteSpace: "nowrap",
        color,
        WebkitTextStroke: `${fs * stroke}px ${INK}`,
        paintOrder: "stroke fill",
        textShadow: `0 ${fs * 0.08}px 0 ${INK}, ${fs * 0.045}px ${fs * 0.08}px 0 ${INK}`,
        letterSpacing: fs * 0.01,
      }}
    >
      {text}
    </div>
  );
};

// ───────────────────────── banner ─────────────────────────
//
// 2560×1440. Everything that matters sits inside YouTube's 1546×423 safe area
// (x ±773, y ±211 here): the wordmark in the middle, the host on the left, the
// guilty archer on the right. Landmarks only live outside it, at the edges.

const FEET = -205;

const Bird: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <X x={x} y={y} s={s} z={-30}>
    <Line pts={[[-18, 6], [-8, 2], [0, -4], [8, 2], [18, 6]]} smooth width={4} color={INK} />
  </X>
);

const Flowers: React.FC = () => {
  const r = rng(17);
  const cols = ["#f4a7c0", "#ffd24a", "#ffffff", "#f6b26b"];
  return (
    <X z={-14}>
      {Array.from({ length: 40 }, (_, i) => (
        <Part key={i} shape={circle(10 + r() * 5)} color={cols[i % cols.length]} shade={0.2} x={-1260 + r() * 2520} y={-250 - r() * 460} />
      ))}
    </X>
  );
};

/** Red subscribe button — with one of our fire arrows stuck in it. */
const BurningSubscribe: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <X x={x} y={y} z={6}>
    <Part shape={roundRect(420, 96, 48)} color="#e8322a" shade={0.18} />
    <Part shape={roundRect(90, 40, 20)} color="#2a1e22" flat outline={0} opacity={0.3} x={168} y={24} z={0.01} />
    <X x={168} y={24} z={0.2}>
      <Glow rx={130} color="#ffb04a" alpha={0.5} additive />
      <FireLine w={80} intensity={0.7} seed={3} />
    </X>
    <X x={176} y={6} rot={3.42} z={0.3}>
      <Arrow x={-160} length={160} />
    </X>
    <Smoke x={170} y={80} w={60} h={300} alpha={0.35} seed={5} z={0.1} />
  </X>
);

export const ChannelBanner: React.FC<{ guides?: boolean }> = ({ guides = false }) => {
  const frame = useCurrentFrame();
  // host (left), inspecting the title through his magnifying glass
  const hx = -625;
  const hs = 0.9;
  const eye = frontEye(hx, FEET, hs, 1);
  const lens = { r: 44, rot: 0.42, scale: hs };
  const lensDist = (120 + lens.r) * lens.scale;
  const grip: [number, number] = [eye[0] + Math.sin(lens.rot) * lensDist, eye[1] - Math.cos(lens.rot) * lensDist];
  // archer (right), who just shot the subscribe button
  const ax = 630;
  const as = 0.9;
  const button = { x: 0, y: -158 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#8ec9ee" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.18} grain={0.02}>
        <Sky w={3200} h={2400} y={1000} top="#4f9fd9" bottom="#d8eef6" z={-40} />
        <X y={40} z={-38}>
          <Sunburst r={1500} rays={26} color="#c4e4f6" alt="#b4dcf3" />
        </X>
        <Glow y={40} rx={700} ry={330} color="#ffffff" alpha={0.35} z={-37} />
        {/* TV-only sky */}
        <Cloud x={-560} y={420} w={420} seed={5} z={-32} />
        <Cloud x={420} y={470} w={380} seed={8} z={-32} />
        <Cloud x={-1160} y={330} w={300} seed={2} z={-32} />
        <Cloud x={1080} y={390} w={320} seed={11} z={-32} />
        <Bird x={-250} y={330} />
        <Bird x={-210} y={312} s={0.8} />
        <Bird x={760} y={300} s={0.85} />
        {/* edges: Egypt on the left, Pisa and Easter Island on the right */}
        <Hill x={-1000} y={-150} w={1100} h={60} color="#a9c98a" seed={3} z={-27} />
        <Hill x={1000} y={-150} w={1100} h={55} color="#a9c98a" seed={6} z={-27} />
        <PalmTree x={-1215} y={-158} h={300} lean={0.12} z={-22} />
        <Pyramid x={-1030} y={-150} w={380} h={250} z={-24} />
        <Pyramid x={-870} y={-160} w={210} h={140} z={-23} />
        <LeaningTower x={930} y={-152} tiers={5} w={100} z={-23} />
        <Moai x={1100} y={-162} h={200} hat z={-22} />
        <Moai x={1215} y={-168} h={160} z={-21.9} />
        <Ground w={3200} h={800} y={-150} color="#8aa65a" far="#9ab86a" pebbles={0} tufts={40} tuftColor="#5f7a3a" seed={4} z={-20} />
        <Flowers />

        {/* the host */}
        <Character
          {...EXPLORER}
          x={hx}
          y={FEET}
          s={hs}
          look={0.5}
          z={4}
          expression={{ eyes: "squint", mouth: "smirk", brows: 0.4 }}
          pose={{ ...poses.idle(frame, 1), armF: reach(hx, FEET, hs, 1, grip), armB: [-0.25, -0.15] }}
        />
        <X x={grip[0]} y={grip[1]} rot={lens.rot} s={lens.scale} z={4.5}>
          <Magnifier r={lens.r} eye gaze={[0.8, -0.1]} />
        </X>

        {/* the archer and his work */}
        <BurningSubscribe x={button.x} y={button.y} />
        <Character
          {...ARCHER}
          x={ax}
          y={FEET}
          s={as}
          facing={-1}
          look={0.45}
          z={4}
          expression={{ eyes: "wide", mouth: "wavy", brows: 1, sweat: true, gaze: [0.8, -0.5] }}
          pose={{ ...poses.idle(frame, 4), armF: [0.35, 0.15], armB: [2.75, 1.7], armsOverHead: true }}
          holdF={<Bow rot={-0.1} />}
        />

        {guides ? (
          <X z={60}>
            <InkLine pts={[[-773, -211.5], [773, -211.5], [773, 211.5], [-773, 211.5], [-773, -211.5]]} width={4} color="#ff00ff" outline={0} />
            <InkLine pts={[[-1280, -211.5], [1280, -211.5]]} width={3} color="#00ffff" outline={0} />
            <InkLine pts={[[-1280, 211.5], [1280, 211.5]]} width={3} color="#00ffff" outline={0} />
          </X>
        ) : null}
      </Stage>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <BigText text={CHANNEL.name} x={0} y={104} size={192} color="#ffffff" rotate={-2} />
        <BigText text={CHANNEL.sub} x={6} y={-28} size={102} color={CORAL} rotate={-2} />
        <BigText text="SUBSCRIBE" x={button.x - 18} y={button.y + 2} size={50} color="#ffffff" stroke={0.1} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── logo ─────────────────────────
//
// 800×800, shown as a circle. One big face filling the frame (like the best
// history channels): the host, explorer hat cropped by the circle, magnifying
// glass over one eye.

export const ChannelLogo: React.FC = () => {
  const s = 3.25;
  const headY = -30;
  const x = -30;
  const y = headY - 308 * s;
  const eye = frontEye(x, y, s, 1);
  const lens = { r: 60, rot: 0.55, scale: 1.95 };
  const lensDist = (120 + lens.r) * lens.scale;
  const grip: [number, number] = [eye[0] + Math.sin(lens.rot) * lensDist, eye[1] - Math.cos(lens.rot) * lensDist];
  return (
    <AbsoluteFill style={{ backgroundColor: "#2f86b4" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.12} grain={0.015}>
        <Part shape={roundRect(1000, 1000, 0)} color="#2f86b4" flat outline={0} z={-30} />
        <Glow y={60} rx={520} color="#7fd0f2" alpha={0.55} z={-29} />
        <Character
          {...EXPLORER}
          x={x}
          y={y}
          s={s}
          look={0.5}
          shadow={false}
          z={1}
          expression={{ eyes: "squint", mouth: "grin", brows: 0.5 }}
          pose={{ armF: [0.1, 0.1], armB: [-0.1, -0.1] }}
        />
        <X x={grip[0]} y={grip[1]} rot={lens.rot} s={lens.scale} z={3}>
          <Magnifier r={lens.r} eye gaze={[-0.15, -0.05]} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};
