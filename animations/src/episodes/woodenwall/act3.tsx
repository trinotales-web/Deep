import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Glow, InkLine, Arrow, Bow, Boulder, Spear, blob, poly, palette } from "../../kit";
import { Character, poses } from "../../kit/character";
import { Ground, Barricade, Tent, Banner, Brazier, Smoke, StoneWall, FireLine, RockHill } from "../../kit/env";
import { AcropolisTop, Backdrop } from "./sets";
import { DEFENDERS, TEMPLE_KEEPER, PERSIAN } from "./cast";
import { ramp, push, hitAt, absT, type ShotProps } from "./common";
import { Defenders } from "./act1";

/** Persian camp backdrop on the Areopagus. */
const PersianCamp: React.FC<{ groundY: number; mood?: "warm" | "dusk" | "fire" }> = ({ groundY, mood = "warm" }) => (
  <>
    <Backdrop mood={mood} horizon={groundY + 260} />
    <Ground w={4000} h={1600} y={groundY + 260} color={mood === "warm" ? "#cdb48a" : "#a07a56"} pebbles={10} tufts={6} z={-20} />
    {[-420, -60, 330].map((x, i) => (
      <Tent key={x} x={x} y={groundY + 250} w={300} h={220} z={-18 + i * 0.01} />
    ))}
    {[-250, 160, 470].map((x, i) => (
      <Banner key={x} x={x} y={groundY + 240} pole={480} seed={i} z={-17 + i * 0.01} />
    ))}
  </>
);

/** Archer pose for a right-facing character: both arms forward, `draw` 0..1. */
const archerPose = (draw: number) => ({ armF: [1.5, 0.05] as [number, number], armB: [1.45 - draw * 0.3, 0.2 + draw * 0.9] as [number, number] });

// 40.40 "Now, fire arrows almost never work."
export const NowShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const draw = ramp(t, 40.6, 41.4);
  const released = t > 41.55;
  const fly = Math.max(0, t - 41.55);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.8, 0.6] }}>
        <PersianCamp groundY={-560} />
        <Character
          {...PERSIAN(0)}
          x={-200}
          y={-640}
          s={1.45}
          z={2}
          look={0.7}
          expression={{ eyes: released ? "half" : "angry", mouth: released ? "smirk" : "flat", brows: -0.5, gaze: [0.9, 0] }}
          pose={archerPose(released ? 0 : draw)}
          holdF={<Bow rot={-1.57} draw={released ? 0 : draw} arrow={!released} fire s={1.1} />}
        />
        {released ? <Arrow fire x={-30 + fly * 2600} y={-640 + 205 * 1.45 + fly * 260} rot={0.12} s={1.4} z={3} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};

// 42.80 "The flame blows out in the air, and thick walls don't catch fire."
export const PhysicsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const groundY = -620;
  // arrow 1: flies through the air, its flame dies
  const a1 = ramp(t, 42.85, 44.3, (x) => x);
  const x1 = -620 + a1 * 1100;
  const y1 = 260 + Math.sin(a1 * Math.PI) * 260 - a1 * 200;
  const ang1 = Math.atan2(Math.cos(a1 * Math.PI) * Math.PI * 260 - 200, 1100);
  const flame1 = 1 - ramp(t, 43.3, 43.8);
  // arrow 2: hits the stone wall and drops
  const a2 = ramp(t, 44.55, 45.25, (x) => x);
  const stuck = t > 45.25;
  const drop = ramp(t, 45.55, 45.95, Easing.in(Easing.quad));
  const x2 = stuck ? 170 : -620 + a2 * 790;
  const y2 = stuck ? 60 - drop * 600 : -60 + Math.sin(a2 * Math.PI) * 180 + a2 * 120;
  const flame2 = stuck ? 1 - ramp(t, 45.5, 45.85) : 1;
  const wallIn = ramp(t, 44.45, 44.75, Easing.out(Easing.back(1.4)));
  const cross = ramp(t, 45.85, 46.05, Easing.out(Easing.back(2.5)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -40 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="day" horizon={groundY + 200} />
        <Ground w={4000} h={1600} y={groundY + 200} color="#d4bb8e" pebbles={10} tufts={6} z={-20} />
        {t < 44.45 ? (
          <>
            <X x={x1} y={y1} rot={ang1} z={2}>
              <Arrow fire={flame1 > 0.05} fireSize={Math.max(0.05, flame1)} s={2.6} x={-200} />
            </X>
            {flame1 < 0.95 ? <Smoke x={-620 + 0.42 * 1100 + 60} y={260 + Math.sin(0.42 * Math.PI) * 260 - 84} w={60} h={300} alpha={0.5 * (1 - ramp(t, 43.9, 44.4))} puffs={5} seed={3} z={1} /> : null}
          </>
        ) : (
          <>
            <X x={300 + (1 - wallIn) * 700} y={groundY + 120} z={1}>
              <StoneWall w={380} h={900} />
            </X>
            <X x={x2} y={y2} rot={stuck ? -0.2 - drop * 1.2 : 0.05} z={2}>
              <Arrow fire={flame2 > 0.05} fireSize={Math.max(0.05, flame2)} s={1.6} x={-230} />
            </X>
            {cross > 0.01 ? (
              <X x={300} y={240} s={cross} z={5}>
                <InkLine pts={[[-180, 180], [180, -180]]} width={46} color={palette.red} outline={9} />
                <InkLine pts={[[-180, -180], [180, 180]]} width={46} color={palette.red} outline={9} z={0.01} />
              </X>
            ) : null}
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

// 46.45 "But this wall is made of dry planks and doors."
export const DryWallShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.2, 1.32), y: -160 }} light={{ dir: [-0.8, 0.6] }}>
        <AcropolisTop mood="warm" wallY={-560} wallW={1300} wallH={420}>
          {[-300, 0, 300].map((x, i) => (
            <Character
              key={x}
              {...[DEFENDERS[0], TEMPLE_KEEPER, DEFENDERS[1]][i]}
              x={x}
              y={-560 + Math.max(0, Math.sin(t * 3 + i)) * 12}
              s={1.3}
              z={-6}
              facing={i === 2 ? -1 : 1}
              look={0.2}
              expression={{ eyes: "open", mouth: "wavy", brows: 0.7, sweat: i !== 1, gaze: [0.2 * (i - 1), 0.3] }}
              pose={{ armF: [2.4, 0.6], armB: [-2.4, -0.6] }}
              shadow={false}
            />
          ))}
        </AcropolisTop>
      </Stage>
    </AbsoluteFill>
  );
};

// 48.85 "So the Persians wrap their arrows in plant fiber,"
export const WrapShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wrap = ramp(t, 49.6, 50.9);
  const twist = Math.sin(frame * 0.7) * 0.15 * (wrap > 0 && wrap < 1 ? 1 : 0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [-0.8, 0.6] }}>
        <PersianCamp groundY={-560} />
        <Character
          {...PERSIAN(2)}
          x={330}
          y={-700}
          s={1.15}
          z={1}
          facing={-1}
          look={0.5}
          expression={{ eyes: "half", mouth: "smirk", brows: -0.3, gaze: [0.6, 0.3] }}
          pose={{ armF: [1.1, 0.4], armB: [-0.2, -0.1] }}
          holdF={
            <X rot={-1.1}>
              <Part shape={blob([[-40, 0], [40, 0], [50, 50], [0, 80], [-50, 50]], 6)} color="#c7a86a" shade={0.3} />
            </X>
          }
        />
        <Character
          {...PERSIAN(0)}
          x={-200}
          y={-760}
          s={1.6}
          z={2}
          look={0.5}
          expression={{ eyes: "half", mouth: "flat", brows: -0.4, gaze: [0.7, -0.6] }}
          pose={{ armF: [1.25, 0.25 + twist], armB: [1.1, 0.7 - twist] }}
        />
        <X x={60} y={-760 + 210 * 1.6} rot={0.05} z={3}>
          <Arrow s={1.7} x={-200} />
          <X x={-200 + 150 * 1.7 - 14} z={0.01}>
            <Part shape={blob([[-26, 0], [-20, 16], [20, 18], [28, 0], [20, -18], [-20, -16]], 6)} color="#c7a86a" shade={0.3} s={0.2 + wrap * 1.2} rot={frame * 0.2 * (wrap < 1 ? 1 : 0)} />
          </X>
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// 51.35 "set them on fire,"
export const LightShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dip = ramp(t, 51.4, 51.75);
  const lit = t > 51.85;
  const lift = ramp(t, 51.9, 52.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.3), y: -200 }} light={{ pos: [120, -380] }} shadowMul={[0.6, 0.52, 0.6]} vignette={0.7}>
        <PersianCamp groundY={-560} mood="dusk" />
        <Brazier x={140} y={-760} s={1.6} z={1} />
        <Character
          {...PERSIAN(1)}
          x={-280}
          y={-820}
          s={1.6}
          z={2}
          look={0.6}
          expression={{ eyes: lit ? "angry" : "half", mouth: lit ? "grin" : "flat", brows: -0.6, gaze: [0.8, 0.5] }}
          pose={{ armF: [1.35 - dip * 0.3 + lift * 0.5, 0.2], armB: [-0.3, -0.2] }}
          holdF={<Arrow fire={lit} fireSize={1.3} rot={-1.4} s={1.5} x={-60} />}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// 52.60 "and shoot."
export const ShootShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const released = t > 52.86;
  const fly = Math.max(0, t - 52.86);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 40, shake: released ? hitAt(t, 52.86, 0.35) * 8 : 0 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="dusk" horizon={-360} />
        <Ground w={4000} h={1600} y={-360} color="#a07a56" pebbles={0} tufts={0} z={-6} />
        <X x={400} y={-640} z={-5}>
          <RockHill w={1400} h={300} steep="left" path={false} seed={9} />
        </X>
        {[0, 1, 2, 3].map((i) => {
          const x = 120 + i * 140;
          const y = -340 + i * 18;
          return (
            <React.Fragment key={i}>
              <Character
                {...PERSIAN(i)}
                x={x}
                y={y}
                s={0.62}
                z={1 + i * 0.01}
                facing={-1}
                look={0.6}
                shadow={false}
                expression={{ eyes: "angry", mouth: "flat", brows: -0.6 }}
                pose={{ armF: [2.0, 0.05], armB: [1.9, released ? 0.2 : 1.1] }}
                holdF={<Bow rot={-1.57} draw={released ? 0 : 1} arrow={!released} fire s={1.1} />}
              />
              {released ? (
                <Arrow fire x={x - 140 - fly * 1700} y={y + 300 + fly * 900 - fly * fly * 300} rot={Math.PI - 0.55 + fly * 0.4} s={0.9} seed={i} z={3 + i * 0.01} />
              ) : null}
            </React.Fragment>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// 53.60 "The wooden wall burns."
export const BurnsShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = 0.25 + 0.75 * ramp(t, 53.65, 54.45);
  const hit = hitAt(t, 54.39, 0.5);
  const stuck: [number, number, number][] = [
    [-320, -260, 0.5],
    [-80, -180, 0.6],
    [180, -300, 0.45],
    [380, -200, 0.55],
    [40, -360, 0.5],
  ];
  return (
    <AbsoluteFill>
      <Stage
        camera={{ zoom: push(frame, dur, 1.05, 1.15) + hit * 0.03, y: -140, shake: hit * 14 }}
        light={{ pos: [0, -200] }}
        shadowMul={[0.62, 0.5, 0.55]}
        vignette={0.7}
        vignetteColor="#1a0606"
      >
        <AcropolisTop mood="fire" burn={burn} wallY={-520} wallW={1250} wallH={400}>
          {stuck.map(([x, y, r], i) => (
            <X key={i} x={x} y={y} rot={Math.PI - r} z={1 + i * 0.01}>
              <Arrow s={1.1} x={-150} fire fireSize={0.6} seed={i} />
            </X>
          ))}
        </AcropolisTop>
      </Stage>
    </AbsoluteFill>
  );
};

// 55.40 "The men still don't give up."
export const GiveUpShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -60 }} light={{ pos: [0, 600] }} shadowMul={[0.62, 0.5, 0.55]} vignette={0.7} vignetteColor="#1a0606">
        <Backdrop mood="fire" horizon={-260} mountains={false} />
        <FireLine w={1600} y={-300} intensity={1.3} seed={21} z={-5} />
        <Smoke y={0} w={700} h={1600} alpha={0.5} seed={9} z={-4} />
        <X y={-900} z={1}>
          <Defenders y={0} s={1.5} spread={300} t={t} frame={frame} mood="angry" />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// 56.95 "They roll giant rocks down on anyone who comes near the gate."
export const RocksShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  // slope from top-left to bottom-right
  const top: [number, number] = [-360, 300];
  const bottom: [number, number] = [520, -560];
  const rock = (t0: number, r: number, k: number) => {
    const f = ramp(t, t0, t0 + 1.5, Easing.in(Easing.quad));
    const x = top[0] + 60 + (bottom[0] - top[0]) * f;
    const y = top[1] + (bottom[1] - top[1]) * f + r * 1.05 + Math.abs(Math.sin(f * 14)) * 20 * f;
    return { x, y, rot: -(f * 1400) / r, f, k };
  };
  const rocks = [rock(57.25, 110, 1), rock(58.15, 80, 2), rock(58.9, 95, 3)];
  const panic = t > 57.9;
  const camY = interpolate(t, [56.95, 60.5], [40, -140]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.85, x: 60, y: camY, shake: hitAt(t, 58.75, 0.4) * 10 + hitAt(t, 59.65, 0.4) * 8 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="dusk" horizon={-300} />
        <Part
          shape={poly([[-1600, top[1]], [top[0], top[1]], [bottom[0], bottom[1]], [1600, bottom[1]], [1600, -2400], [-1600, -2400]])}
          color="#b8936a"
          shade={0.1}
          z={-10}
        />
        <X x={top[0] - 140} y={top[1]} s={0.6} z={-9}>
          <Barricade w={700} h={300} burn={0.6} char={0.7} />
        </X>
        {[0, 1].map((i) => (
          <Character
            key={i}
            {...DEFENDERS[i]}
            x={top[0] - 210 + i * 120}
            y={top[1]}
            s={0.7}
            z={-8 + i * 0.01}
            look={0.6}
            expression={{ eyes: "angry", mouth: "teeth", brows: -0.7 }}
            pose={{ armF: [1.4, 0.2], armB: [1.3, 0.3], lean: -0.15 }}
          />
        ))}
        {rocks.map((r, i) =>
          r.f > 0 || i === 0 ? <Boulder key={i} x={r.f === 0 ? top[0] + 60 : r.x} y={r.f === 0 ? top[1] + 115 : r.y} r={[110, 80, 95][i]} rot={r.rot} seed={r.k} z={2 + i * 0.01} /> : null,
        )}
        {[0, 1, 2, 3].map((i) => {
          const baseX = 300 + i * 110;
          const baseY = -380 - i * 70;
          const runX = panic ? (t - 57.9) * (260 + i * 30) : 0;
          return (
            <Character
              key={`p${i}`}
              {...PERSIAN(i)}
              x={baseX + runX}
              y={baseY + (panic ? 0 : 0)}
              s={0.7}
              z={1 + i * 0.01}
              facing={panic ? 1 : -1}
              look={0.6}
              expression={panic ? { eyes: "wide", mouth: "shout", brows: 0.9 } : { eyes: "angry", mouth: "flat", brows: -0.5 }}
              pose={panic ? poses.run(frame + i * 5) : poses.walk(frame + i * 4, 0.9)}
              holdF={<Spear rot={panic ? -0.6 : -0.1} length={380} />}
            />
          );
        })}
        <Glow x={0} y={-200} rx={1200} ry={500} color="#e8b07a" alpha={0.12} z={9} />
      </Stage>
    </AbsoluteFill>
  );
};

