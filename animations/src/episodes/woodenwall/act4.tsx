import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Glow, Line, Spear, roundPoly, rng, shadeHex } from "../../kit";
import { Character, poses } from "../../kit/character";
import { Ground, GreekTemple, Barricade, Smoke, FireLine } from "../../kit/env";
import { AthensWide, Backdrop } from "./sets";
import { DEFENDERS, TEMPLE_KEEPER, PERSIAN } from "./cast";
import { ramp, push, hitAt, absT, type ShotProps } from "./common";

const ROCK = "#b9a17c";

/** Vertical cliff face on the left half of the frame. Right edge is jagged. */
const CliffFace: React.FC<{ edgeX?: number; top?: number; seed?: number }> = ({ edgeX = 120, top = 1400, seed = 4 }) => {
  const r = rng(seed);
  const pts: [number, number][] = [[-1400, -2400]];
  for (let y = -2400; y <= top; y += 200) pts.push([edgeX + (r() - 0.5) * 120, y]);
  pts.push([-1400, top]);
  return (
    <>
      <Part shape={roundPoly(pts, 30)} color={ROCK} shade={0.08} light={{ dir: [1, 0.3] }} />
      {Array.from({ length: 16 }, (_, i) => {
        const y = -2200 + i * 230 + r() * 60;
        const x0 = -900 + r() * 300;
        return <Line key={i} pts={[[x0, y], [x0 + 300, y + 30], [edgeX - 60, y + 10]]} smooth width={4} color={shadeHex(ROCK, 0.3)} z={0.001} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const x = -800 + r() * 800;
        const y = -2200 + r() * 3400;
        return <Line key={`c${i}`} pts={[[x, y], [x + 14, y - 50], [x - 6, y - 110]]} width={4} color={shadeHex(ROCK, 0.35)} z={0.002} />;
      })}
    </>
  );
};

// 60.50 "Then a few Persians climb the steepest cliff of the hill."
export const CliffShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const camY = interpolate(t, [60.5, 63.45], [-420, 260], { easing: Easing.inOut(Easing.quad), extrapolateRight: "clamp" });
  const climbers = [
    { y0: -1000, x: 170, s: 0.95 },
    { y0: -620, x: 210, s: 0.9 },
    { y0: -260, x: 165, s: 0.85 },
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ y: camY, zoom: 1.0 }} light={{ dir: [0.6, 0.8] }}>
        <Backdrop mood="dusk" horizon={-1200} mountains={false} />
        <X z={-5}>
          <CliffFace />
        </X>
        {climbers.map((c, i) => {
          const ph = frame * 0.35 + i * 2;
          const y = c.y0 + (t - 60.5) * 70 + Math.max(0, Math.sin(ph)) * 10;
          return (
            <Character
              key={i}
              {...PERSIAN(i + 1)}
              x={c.x}
              y={y}
              s={c.s}
              z={1 + i * 0.01}
              facing={-1}
              look={0.75}
              shadow={false}
              expression={{ eyes: "angry", mouth: "teeth", brows: -0.5, gaze: [0.2, 0.9] }}
              pose={{
                armF: [2.5 + Math.sin(ph) * 0.35, 0.3],
                armB: [2.5 - Math.sin(ph) * 0.35, 0.3],
                armsOverHead: true,
                legF: Math.sin(ph) * 0.5 + 0.4,
                legB: -Math.sin(ph) * 0.5 + 0.4,
              }}
            />
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// 63.45 "It's so steep, nobody thought to guard it."
export const UnguardedShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const peek = ramp(t, 65.1, 65.5, Easing.out(Easing.back(1.8)));
  const edgeY = -520;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="dusk" horizon={edgeY + 200} />
        <Ground w={4000} h={1600} y={edgeY + 200} color="#b8936a" far="#c4a27a" pebbles={8} tufts={4} z={-20} />
        <X x={-260} y={edgeY + 200} s={0.42} z={-15}>
          <GreekTemple w={980} colH={430} cols={7} />
          <Barricade w={900} h={260} x={-700} y={-60} burn={0.7} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...DEFENDERS[i]} x={-860 + i * 160} y={-120} s={0.8} z={1} facing={-1} look={0.8} expression={{ eyes: "angry", mouth: "flat" }} pose={poses.idle(frame, i)} />
          ))}
        </X>
        <Smoke x={-560} y={edgeY + 260} w={200} h={1200} alpha={0.4} seed={4} z={-14} />
        {/* the unguarded cliff edge, foreground right */}
        <X x={560} y={edgeY} z={2}>
          <Part shape={roundPoly([[-420, 0], [-120, 20], [200, -10], [400, 0], [400, -900], [-380, -900]], 30)} color={ROCK} shade={0.12} />
          <Line pts={[[-300, -120], [-200, -110], [-60, -150]]} smooth width={4} color={shadeHex(ROCK, 0.3)} z={0.001} />
        </X>
        {peek > 0.01 ? (
          <X x={430} y={edgeY - 360 + peek * 300} z={1.5}>
            <Character
              {...PERSIAN(3)}
              s={1.0}
              facing={-1}
              look={0.6}
              shadow={false}
              expression={{ eyes: "half", mouth: "smirk", brows: -0.4, gaze: [0.6, 0] }}
              pose={{ armF: [2.6, 0.2], armB: [2.4, 0.3], armsOverHead: true }}
            />
          </X>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};

// 65.95 "When the defenders see enemies on top,"
export const SeeShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const turn = t > 66.55;
  const hit = hitAt(t, 66.74, 0.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15) + hit * 0.04, y: -60, shake: hit * 8 }} light={{ pos: [500, 300] }} shadowMul={[0.6, 0.52, 0.6]} vignette={0.7}>
        <Backdrop mood="fire" horizon={-200} mountains={false} />
        <Ground w={4000} h={1600} y={-200} color="#8a5a3a" pebbles={6} tufts={0} z={-20} />
        {[0, 1, 2].map((i) => (
          <Character
            key={`p${i}`}
            {...PERSIAN(i)}
            x={300 + i * 140}
            y={-240 + i * 20}
            s={0.75}
            z={-10 + i * 0.01}
            facing={-1}
            look={0.6}
            expression={{ eyes: "angry", mouth: "smirk", brows: -0.6 }}
            pose={i === 1 ? poses.point(frame) : poses.idle(frame, i)}
            holdF={i !== 1 ? <Spear rot={-0.1} length={460} /> : undefined}
          />
        ))}
        {[DEFENDERS[0], TEMPLE_KEEPER, DEFENDERS[1]].map((d, i) => (
          <Character
            key={i}
            {...d}
            x={-360 + i * 250}
            y={-760 - (i === 1 ? 30 : 0)}
            s={1.35}
            z={1 + i * 0.01}
            facing={turn ? 1 : -1}
            look={turn ? 0.6 : 0.3}
            expression={turn ? { eyes: "wide", mouth: "o", brows: 0.9, sweat: true } : { eyes: "angry", mouth: "flat", brows: -0.5 }}
            pose={turn ? poses.scared(frame + i * 4) : poses.idle(frame, i)}
          />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// 67.85 "some jump off the walls."
export const JumpShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wallTop = -380;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 60, shake: hitAt(t, 68.3, 0.4) * 6 }} light={{ pos: [0, -600] }} shadowMul={[0.6, 0.5, 0.55]} vignette={0.75} vignetteColor="#120404">
        <Backdrop mood="fire" horizon={-700} mountains={false} />
        <Glow y={-500} rx={1400} ry={700} color="#ff6a2a" alpha={0.3} additive z={-19} />
        <X y={wallTop - 600} z={-2}>
          <Barricade w={1300} h={600} burn={0.9} seed={14} />
        </X>
        {[0, 1].map((i) => {
          const t0 = 68.25 + i * 0.35;
          const f = ramp(t, t0, t0 + 0.9, (x) => x);
          const x = -200 + i * 360 + f * (i ? 700 : -700);
          const y = wallTop + Math.sin(f * Math.PI * 0.85) * 520 - f * f * 200;
          return (
            <Character
              key={i}
              {...DEFENDERS[i + 2]}
              x={x}
              y={y}
              s={0.95}
              z={1 + i * 0.01}
              facing={i ? 1 : -1}
              look={0.5}
              shadow={false}
              expression={{ eyes: "closed", mouth: "teeth", brows: -0.6 }}
              pose={f > 0 ? { ...poses.armsUp(frame), legF: 0.6, legB: -0.5 } : poses.scared(frame)}
            />
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// 69.35 "The rest run into the temple."
export const TempleRunShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const floorY = -520;
  const doorX = 230;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.9, y: 120 }} light={{ pos: [-600, 200] }} shadowMul={[0.6, 0.52, 0.6]} vignette={0.65}>
        <Backdrop mood="fire" horizon={floorY + 200} mountains={false} />
        <Ground w={4000} h={1600} y={floorY + 20} color="#8a6a4a" pebbles={8} tufts={0} z={-20} />
        <GreekTemple x={doorX} w={1100} colH={520} cols={6} y={floorY + 20} door z={-10} />
        <Smoke x={-500} y={floorY + 200} w={300} h={1600} alpha={0.5} seed={8} z={-9} />
        <FireLine x={-620} w={500} y={floorY + 40} intensity={1} seed={3} z={-8} />
        {[0, 1, 2].map((i) => {
          const start0 = 69.35 + i * 0.12;
          const p = ramp(t, start0, start0 + 1.4, (x) => x);
          const x = -560 + p * (doorX + 560) - i * 140;
          const inside = x > doorX - 30;
          return inside ? null : (
            <Character
              key={i}
              {...[TEMPLE_KEEPER, DEFENDERS[0], DEFENDERS[3]][i]}
              x={x}
              y={floorY + 40 + i * 6}
              s={0.95}
              z={1 + i * 0.01}
              look={0.7}
              expression={{ eyes: "wide", mouth: "shout", brows: 0.9, sweat: true }}
              pose={poses.run(frame + i * 6)}
            />
          );
        })}
        {[0, 1].map((i) => {
          const x = -900 + (t - 69.6) * 520 - i * 180;
          return (
            <Character
              key={`p${i}`}
              {...PERSIAN(i)}
              x={x}
              y={floorY + 30}
              s={1.0}
              z={2 + i * 0.01}
              look={0.6}
              expression={{ eyes: "angry", mouth: "shout", brows: -0.8 }}
              pose={poses.run(frame + i * 8)}
              holdF={<Spear rot={-1.0} length={460} />}
            />
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// 71.15 "Not one of them survives, and the Acropolis burns."
export const FallenShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.15), y: 220 }} light={{ dir: [-0.6, 0.8] }} shadowMul={[0.55, 0.48, 0.55]} vignette={0.75} vignetteColor="#120404">
        <AthensWide mood="fire" burn={1} groundY={-420} />
        <Glow y={300} rx={1200} ry={700} color="#ff5a2a" alpha={0.2} additive z={10} />
      </Stage>
    </AbsoluteFill>
  );
};
