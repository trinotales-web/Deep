import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Glow } from "../../kit";
import { Character, poses } from "../../kit/character";
import { Trireme, Splash, StraitMap, PlankWall, Smoke, Sunburst, MysticSmoke, Throne, RockHill, Barricade, OldDoor } from "../../kit/env";
import { AcropolisTop, SeaSet } from "./sets";
import { XERXES, PYTHIA, SAILOR } from "./cast";
import { ramp, push, hitAt, absT, type ShotProps } from "./common";

// 74.15 "But remember the ships?"
export const RememberShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), x: frame * 3 - 100 }} light={{ dir: [-0.8, 0.6] }}>
        <SeaSet mood="day" horizon={360}>
          <Trireme x={-200 + frame * 4} y={260} len={520} seed={5} z={1} />
          <Trireme x={250 + frame * 4} y={300} len={480} seed={6} z={1.1} />
          <Trireme x={frame * 5} y={-160} len={1150} seed={1} crew={7} z={3} />
        </SeaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 75.65 "Soon after, at Salamis,"
export const MapShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 0 }} light={{ dir: [-0.6, 0.8] }}>
        <PlankWall w={2600} h={2600} color="#7a5232" plank={130} z={-10} />
        <StraitMap w={900} h={1300} t={ramp(t, 75.8, 77.7, (x) => x) * 0.5} rot={-0.02} y={60} z={1} />
      </Stage>
    </AbsoluteFill>
  );
};

// 77.70 "the Athenian fleet traps the Persian navy and smashes it."
export const RamShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const impact = 80.15;
  const approach = ramp(t, 77.7, impact, Easing.in(Easing.quad));
  const after = Math.max(0, t - impact);
  const sink = ramp(t, impact + 0.2, impact + 1.6);
  const hit = hitAt(t, impact, 0.6);
  const trapL = ramp(t, 77.8, 79.6);
  const greekX = -980 + approach * 520 - after * 30;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.78 + hit * 0.04, y: 80, shake: hit * 18 }} light={{ dir: [-0.8, 0.6] }}>
        <SeaSet mood="day" horizon={420}>
          {/* Greek ships closing the trap in the distance */}
          <Trireme x={-900 + trapL * 500} y={330} len={480} seed={7} sail={false} z={1} />
          <X x={1000 - trapL * 520} y={320} sx={-1} z={1.1}>
            <Trireme len={460} seed={8} sail={false} />
          </X>
          {/* the Persian ship (facing left) */}
          <X x={240} y={-120} sx={-1} z={3}>
            <Trireme len={1000} side="persian" seed={3} sink={sink} crack={t > impact ? 1 : 0} crew={6} sail row={t > impact ? 0 : 0.6} />
          </X>
          {/* the Athenian ram */}
          <Trireme x={greekX} y={-160} len={1000} seed={1} crew={6} sail z={4} />
          <Splash x={-60} y={-110} t={ramp(t, impact, impact + 1.0, (x) => x)} size={1.8} z={6} />
          <Splash x={260} y={-90} t={ramp(t, impact + 0.6, impact + 1.5, (x) => x)} size={1.2} seed={5} z={6} />
        </SeaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 81.10 "Xerxes watches from the shore as his ships go down."
export const WatchShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const down = ramp(t, 82.8, 84.2);
  const shock = t > 81.75;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [-0.8, 0.6] }}>
        <SeaSet mood="dusk" horizon={260}>
          {[[-200, 210, 420, 0.5], [180, 180, 380, 0.3], [420, 230, 300, 0.7]].map(([x, y, len, k], i) => (
            <X key={i} x={x} y={y} sx={-1} z={1 + i * 0.01}>
              <Trireme len={len} side="persian" sink={Math.min(1, k + down * 0.6)} crack={1} sail={false} crew={0} seed={i + 10} row={0} />
            </X>
          ))}
          <Smoke x={-200} y={240} w={140} h={900} alpha={0.45} seed={2} z={1.5} />
          <Smoke x={420} y={250} w={120} h={800} alpha={0.4} seed={3} z={1.5} />
          <X x={-120} y={-720} z={3}>
            <RockHill w={1500} h={420} steep="right" path={false} color="#b49a74" seed={6} />
          </X>
          <Throne x={-150} y={-300} s={1.15} z={4} />
          <Character
            {...XERXES}
            x={-150}
            y={-160}
            s={1.15}
            z={5}
            look={0.5}
            expression={shock ? { eyes: "wide", mouth: down > 0.3 ? "shout" : "o", brows: 0.9, sweat: down > 0.3 } : { eyes: "half", mouth: "smirk", gaze: [0.8, 0] }}
            pose={shock ? { armF: [0.9, 2.2], armB: [-0.9, -2.2], sit: true } : { ...poses.sit(frame) }}
            shadow={false}
          />
        </SeaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 84.40 "So the oracle was right."
export const RightShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 60 }} light={{ dir: [-0.5, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#4a2a5a" alt="#3a1f48" z={-20} />
        <MysticSmoke y={-1100} w={900} h={2600} z={-10} />
        <Character
          {...PYTHIA}
          y={-700}
          s={2.4}
          look={0.25}
          z={1}
          expression={{ eyes: "half", mouth: "smirk", brows: -0.2, gaze: [0.4, 0] }}
          pose={poses.handsOnHips}
          shadow={false}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// 86.50 "A wooden wall did save Athens."
export const SavedShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), x: frame * 2 }} light={{ dir: [-0.8, 0.4] }}>
        <SeaSet mood="warm" horizon={300}>
          <Glow y={500} rx={900} ry={400} color="#ffd27a" alpha={0.3} additive z={-19} />
          {[[-500, 230, 420], [-60, 260, 400], [380, 240, 420]].map(([x, y, len], i) => (
            <Trireme key={i} x={x + frame * 3} y={y} len={len} seed={i + 20} z={1 + i * 0.01} />
          ))}
          <Trireme x={-60 + frame * 4} y={-200} len={1150} seed={1} crew={0} z={3} />
          <Character
            {...SAILOR(0)}
            x={60 + frame * 4}
            y={-200 + 1150 * 0.11 * 0.9}
            s={0.9}
            z={2.9}
            look={0.4}
            shadow={false}
            expression={{ eyes: "happy", mouth: "grin", blush: true }}
            pose={poses.armsUp(frame)}
          />
        </SeaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 88.60 "Just not theirs."
export const TheirsShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 89.35, 89.75, Easing.in(Easing.quad));
  const wash = interpolate(t, [90.5, 91.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -100, shake: hitAt(t, 89.75, 0.4) * 6 }} light={{ dir: [-0.6, 0.6] }} shadowMul={[0.55, 0.5, 0.6]} vignette={0.8} vignetteColor="#05040a" wash={wash}>
        <AcropolisTop mood="dusk" burn={0.12} templeBurn={0} wallY={-440} wall={false}>
          <Barricade w={1150} h={320} y={-440} burn={0.1} char={1} seed={4} z={-5} />
          <OldDoor x={330} y={-600} w={230} h={380} char={1} rot={-fall * 1.45} z={1} />
          <Smoke x={-200} y={-120} w={160} h={1300} alpha={0.45} seed={6} z={2} />
          <Smoke x={260} y={-120} w={130} h={1200} alpha={0.35} seed={7} z={2} />
        </AcropolisTop>
      </Stage>
    </AbsoluteFill>
  );
};

