import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Wash, LightCone, Shovel, roundRect, roundPoly, circle, ellipse, blob, poly, ramp, push, hitAt, absT, rng, mixHex, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses, reachArm } from "../../kit/character";
import { BurialMound, MercuryBowl, BambooSlips, ImperialCarriage, OilLamp, Flame, Smoke, Tree, StarCeiling, Sunburst, Jian } from "../../kit/env";
import { sec, pop, CJK } from "../../kit/shot";
import { Plains, ThroneHall } from "./sets";
import { EMPEROR, WORKER, ARCHAEOLOGIST, SCIENTIST, ARCH74, TERRACOTTA, CLAY, FUSU, GUARD, WIFE } from "./cast";
import { upright } from "./p1a";
import { Bones } from "./p1c";
import { Tent, WritingDesk, Flies, Road, Frontier } from "./p2a";
import { terra, PitFloor, Stopwatch, Gauge, Vapor, Flakes } from "./p2b";

// Re-made scenes (v2): closer framing, richer staging.

// ───────────────────────── paint peeling off a terracotta warrior ─────────────────────────

// [x, y, size] in the character's own space (origin between the feet, head centre at y 308)
const FACE_PATCHES: [number, number, number][] = [[-15, 372, 22], [40, 382, 18], [-62, 292, 19], [-58, 246, 17], [80, 300, 13], [2, 228, 15], [-78, 340, 14]];
const BODY_PATCHES: [number, number, number][] = [[-30, 168, 24], [26, 136, 25], [-8, 100, 21], [36, 186, 17], [-44, 120, 17], [12, 160, 15]];

const flakeShape = (sz: number, seed: number) => {
  const r = rng(seed);
  return blob(Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2;
    const rr = sz * (0.7 + r() * 0.5);
    return [Math.cos(a) * rr, Math.sin(a) * rr * 0.8] as [number, number];
  }), 5);
};

/**
 * Paint lifting and flaking off a painted warrior drawn at (x, y, s): `k` 0..1 lifts
 * the flakes (bare clay shows under them), `fall` 0..1 drops them.
 */
const PaintPeel: React.FC<{ i: number; x: number; y: number; s: number; k: number; fall: number; z?: number }> = ({ i, x, y, s, k, fall, z = 0 }) => {
  const paint = TERRACOTTA(i, true);
  const patches = [
    ...FACE_PATCHES.map(([px, py, sz]) => [px, py, sz, paint.skin as string] as const),
    ...BODY_PATCHES.map(([px, py, sz], j) => [px, py, sz, j % 2 ? (paint.outfit.lamellar as string) : (paint.outfit.top as string)] as const),
  ];
  const n = patches.length;
  return (
    <X x={x} y={y} s={s} z={z}>
      {patches.map(([px, py, sz, col], j) => {
        const q = (((j * 7) % n) / n) * 0.75;
        const p = Math.min(1, Math.max(0, (k - q) / 0.25));
        const f = Math.min(1, Math.max(0, (fall - q * 0.7) / 0.35));
        if (p <= 0) return null;
        const side = j % 2 ? 1 : -1;
        return (
          <X key={j} x={px} y={py} z={j * 0.001}>
            {/* bare clay underneath, growing as the flake lifts */}
            <X s={0.35 + 0.65 * p}>
              <Part shape={flakeShape(sz, j + 3)} color={CLAY} shade={0.15} outline={2.5} />
            </X>
            {f < 1 ? (
              <X x={side * f * 90} y={-f * f * 520} rot={side * (p * 0.5 + f * 5)} sy={1 - p * 0.35} z={0.0005}>
                <Part shape={flakeShape(sz * 1.05, j + 3)} color={col} shade={0.2} outline={2.5} />
                {/* pale curled underside */}
                <Part shape={ellipse(sz * 0.8, sz * 0.22 * p)} color={mixHex(col, "#ffffff", 0.45)} flat outline={2} y={-sz * 0.55} z={0.0002} />
              </X>
            ) : null}
          </X>
        );
      })}
    </X>
  );
};

/** Gusts of dry air (curly wind lines) drifting across. */
const AirGust: React.FC<{ x: number; y: number; k: number; z?: number }> = ({ x, y, k, z = 0 }) => {
  const frame = useCurrentFrame();
  if (k <= 0) return null;
  return (
    <X x={x} y={y} z={z}>
      {[0, 1, 2].map((i) => {
        const ox = ((frame * 9 + i * 260) % 900) - 450;
        return (
          <Line
            key={i}
            pts={Array.from({ length: 9 }, (_, j) => [ox + j * 30, i * 90 + Math.sin(j * 0.8 + frame * 0.2) * 14] as [number, number])}
            smooth
            width={6}
            color="#f6f1e6"
            opacity={0.75 * k}
          />
        );
      })}
    </X>
  );
};

// 126.15 "But once the dry air touches them, the paint starts to curl in 15 seconds."
export const CurlRedoShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const curl = ramp(t, 128.0, 130.4);
  const s = 2.45;
  const cx = -300;
  const cy = -820;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.55}>
        <PitFloor>
          <Glow x={cx} y={-60} rx={700} color="#fff2c6" alpha={0.25} additive z={-10} />
          <Character {...terra(1, 1 - curl * 0.12)} x={cx} y={cy} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: curl > 0.4 ? "wavy" : "flat", brows: curl * 0.7 }} pose={poses.idle(frame)} />
          <PaintPeel i={1} x={cx} y={cy} s={s} k={curl} fall={0} z={3} />
          <AirGust x={-200} y={-80} k={ramp(t, 126.6, 127.2) * (1 - ramp(t, 129.5, 130.4))} z={6} />
          <Stopwatch x={560} y={110} s={1.25} k={ramp(t, 127.0, 130.0)} z={4} />
        </PitFloor>
      </Stage>
      <Label text="15 SEC" x={0.5 + 560 / 1920} y={0.5 - (110 - 200) / 1080} size={0.075} kind="title" at={sec(start)(129.3)} />
    </AbsoluteFill>
  );
};

// 130.6 "In about four minutes, much of it falls off."
export const FallsOffRedoShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 131.2, 133.3, Easing.in(Easing.quad));
  const s = 2.45;
  const cx = -300;
  const cy = -820;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.55}>
        <PitFloor>
          <Character {...terra(1, 0.88 - fall * 0.83)} x={cx} y={cy} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: "frown", brows: 0.6 }} pose={poses.idle(frame)} />
          <PaintPeel i={1} x={cx} y={cy} s={s} k={1} fall={fall} z={3} />
          <Character {...ARCH74(0)} x={600} y={-700} s={1.9} z={2} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "shout", brows: 0.9, sweat: true }} pose={poses.scared(frame)} />
        </PitFloor>
      </Stage>
      <Label text="4 MIN" x={0.74} y={0.14} size={0.09} kind="title" at={sec(start)(131.1)} />
    </AbsoluteFill>
  );
};

// 171.3 "Remember the paint that disappeared in four minutes?"
export const PaintCallbackRedoShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 171.5, 172.5);
  const fall = ramp(t, 172.3, 173.8, Easing.in(Easing.quad));
  const s = 2.45;
  const cx = -180;
  const cy = -820;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.55}>
        <PitFloor>
          <Character {...terra(2, 1 - k * 0.1 - fall * 0.8)} x={cx} y={cy} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: "frown", brows: 0.5 }} pose={poses.idle(frame)} />
          <PaintPeel i={2} x={cx} y={cy} s={s} k={k} fall={fall} z={3} />
          <Stopwatch x={620} y={60} s={1.1} k={ramp(t, 171.4, 173.6)} z={4} />
        </PitFloor>
      </Stage>
      <Label text="4 MIN" x={0.5 + 620 / 1920} y={0.5 - (60 - 200) / 1080} size={0.075} kind="title" at={sec(start)(172.9)} />
    </AbsoluteFill>
  );
};

// 173.95 "Now imagine opening a whole palace."
export const WholePalaceRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const air = ramp(t, 174.4, 174.9);
  const sweep = ramp(t, 174.9, 176.3, Easing.inOut(Easing.quad));
  const floor = -560;
  const front = -2200 + sweep * 4400;
  const r = rng(31);
  const murals: [number, string, string][] = [[-600, "#2f7a6a", "#e9ba41"], [0, "#2f5fa8", "#f4c04a"], [600, "#7a3a8a", "#f08a2a"]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60, shake: sweep > 0 && sweep < 1 ? 2 : 0 }} light={{ pos: [-600, 200] }} vignette={0.7} vignetteColor="#04060c">
        <ThroneHall floorY={floor} throne>
          {/* painted murals on the walls */}
          {murals.map(([x, c, gold], i) => (
            <X key={i} x={x} y={floor + 520} z={-38.5}>
              <Part shape={roundRect(330, 560, 8)} color={c} shade={0.12} />
              <Line pts={[[-120, -150], [-40, -80], [40, -160], [120, -90]]} smooth width={10} color={gold} z={0.001} />
              <Part shape={circle(60)} color={gold} shade={0.15} y={110} z={0.001} />
              <Part shape={circle(36)} color={c} flat outline={4} y={110} z={0.002} />
              <Line pts={Array.from({ length: 12 }, (_, j) => [-130 + j * 24, 20 + Math.sin(j) * 18] as [number, number])} smooth width={7} color="#f4f1ea" z={0.001} />
            </X>
          ))}
          {/* the doorway opens: light and air rush in */}
          <LightCone x={-900} y={floor + 600} w={900} h={1300} top={0.3} color="#fff2c6" alpha={0.25 * air} rot={-0.9} z={20} />
          <AirGust x={-700} y={-200} k={air * (1 - sweep * 0.8)} z={22} />
          {/* colours drain from left to right */}
          <X x={(front - 2200) / 2} z={30}>
            <Part shape={roundRect(Math.max(1, front + 2200), 3000, 0)} color="#7d7166" flat outline={0} opacity={0.62} />
          </X>
          {sweep > 0 && sweep < 1
            ? Array.from({ length: 26 }, (_, i) => {
                const fy = 500 - ((frame * 14 + i * 97) % 1100);
                return (
                  <X key={i} x={front - 80 + r() * 160} y={fy} rot={frame * 0.2 + i} z={31}>
                    <Part shape={flakeShape(10 + (i % 4) * 4, i)} color={["#b8322a", "#2f7a6a", "#e9ba41", "#2f5fa8", "#7a3a8a"][i % 5]} flat outline={2} />
                  </X>
                );
              })
            : null}
          <Character
            {...ARCHAEOLOGIST(0)}
            x={-600}
            y={floor - 180}
            s={1.95}
            z={35}
            look={0.45}
            expression={sweep > 0.15 ? { eyes: "wide", mouth: "o", brows: 0.9, sweat: true } : { eyes: "wide", mouth: "smile", brows: 0.3 }}
            pose={sweep > 0.15 ? poses.scared(frame) : { ...poses.idle(frame), armF: [1.4, 0.4] }}
          />
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── the emperor's search ─────────────────────────

// 139.65 "So he goes looking for a way to never die."
export const NeverDieRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arm: [number, number] = [1.15, 0.9];
  const obsessed = t > 141.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ pos: [500, -100] }} vignette={0.75} vignetteColor="#04060c">
        <ThroneHall floorY={-760} throne={false} dim={0.45}>
          {/* piles of scrolls and a candle */}
          {[[480, -470], [620, -500], [560, -420], [700, -455]].map(([x, y], i) => (
            <X key={i} x={x} y={y} rot={(i % 2 ? 0.2 : -0.15)} z={4 + i * 0.01}>
              <Part shape={roundRect(170, 46, 20)} color={i % 2 ? "#d9c49a" : "#c9b07a"} shade={0.2} />
              <Line pts={[[-60, 0], [60, 0]]} width={4} color="#b8322a" z={0.001} />
            </X>
          ))}
          <X x={380} y={-560} z={4.5}>
            <Part shape={roundRect(30, 120, 8)} color="#f4f1ea" shade={0.15} y={60} />
            <Flame y={128} size={0.32} seed={4} z={0.01} />
            <Glow y={130} rx={620} color="#ffb35a" alpha={0.55} additive />
          </X>
          <Character
            {...EMPEROR}
            x={-260}
            y={-800}
            s={2.25}
            z={3}
            look={0.55}
            expression={obsessed ? { eyes: "wide", mouth: "grin", brows: -0.5, eyebags: true } : { eyes: "open", mouth: "flat", brows: 0.3, eyebags: true, gaze: [0.5, -0.6] }}
            pose={{ ...poses.idle(frame), armF: arm, armB: [1.0, 1.0] }}
            holdF={
              <X rot={upright(arm)} x={30}>
                <BambooSlips open={1} n={10} s={1.05} />
              </X>
            }
          />
        </ThroneHall>
      </Stage>
      <Label text="長生不死" sub="NEVER DIE" x={0.5} y={0.13} size={0.1} kind="title" font={CJK} at={sec(start)(141.2)} />
    </AbsoluteFill>
  );
};

// 176.45 "Some historians think those pills had mercury in them."
export const PillMercuryRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const open = ramp(t, 177.4, 178.2, Easing.out(Easing.back(1.6)));
  const arm = reachArm(-520, -820, 2.3, 1, [-520 + 62 * 2.3, -820 + 250 * 2.3]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ pos: [300, 200] }} vignette={0.7} vignetteColor="#04060c">
        <ThroneHall floorY={-760} throne={false} dim={0.35}>
          <Character
            {...EMPEROR}
            x={-520}
            y={-820}
            s={2.3}
            z={3}
            look={0.5}
            expression={{ eyes: "open", mouth: "o", brows: -0.2, gaze: [0.6, 0.3] }}
            pose={{ ...poses.idle(frame), armF: arm, armB: [0.4, 0.5] }}
            holdF={
              <X rot={upright(arm)} y={20}>
                <Part shape={circle(16)} color="#c9cfd6" shade={0.25} />
                <Glow rx={50} color="#ffffff" alpha={0.4} additive />
              </X>
            }
          />
          {/* the pill, cut open: shining mercury inside */}
          <X x={420} y={-40} z={5}>
            <Glow rx={420} color="#dfe8f2" alpha={0.18 + 0.2 * open} additive z={-0.1} />
            <X rot={open * 0.9} x={open * 40} y={open * 40}>
              <Part shape={poly(Array.from({ length: 19 }, (_, i) => [Math.cos((i / 18) * Math.PI) * 190, Math.sin((i / 18) * Math.PI) * 190] as [number, number]))} color="#6a4a32" shade={0.24} />
            </X>
            <Part shape={poly(Array.from({ length: 19 }, (_, i) => [Math.cos(Math.PI + (i / 18) * Math.PI) * 190, Math.sin(Math.PI + (i / 18) * Math.PI) * 190] as [number, number]))} color="#5e4030" shade={0.24} z={0.01} />
            {open > 0.2
              ? [[-70, -30, 46], [40, -60, 36], [70, 10, 28], [-10, 20, 30], [-90, 30, 20]].map(([x, y, r], i) => (
                  <X key={i} x={x} y={y + Math.sin(frame * 0.2 + i) * 4} s={Math.min(1, (open - 0.2) * 1.4)} z={0.02 + i * 0.001}>
                    <Part shape={circle(r)} color="#c9d2dc" shade={0.3} />
                    <Part shape={ellipse(r * 0.35, r * 0.2)} color="#ffffff" flat outline={0} x={-r * 0.3} y={r * 0.35} z={0.001} />
                  </X>
                ))
              : null}
          </X>
        </ThroneHall>
      </Stage>
      <Label text="Hg" sub="MERCURY" x={0.72} y={0.16} size={0.1} kind="title" at={sec(start)(178.2)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── building the tomb ─────────────────────────

/** Excavation trench: layered earth walls, ladders, a rope hoist with a basket. */
const Excavation: React.FC<{ floor: number; frame: number; children?: React.ReactNode }> = ({ floor, frame, children }) => {
  const layers = ["#c49a66", "#b8895a", "#a87a50", "#9a6e48", "#8a6240"];
  const hoist = ((frame * 0.012) % 1);
  return (
    <>
      <Part shape={roundRect(5000, 3000, 0)} color="#e8cfa0" flat outline={0} y={1500 + floor + 980} z={-41} />
      {layers.map((c, i) => (
        <Part key={i} shape={roundRect(5000, 220, 0)} color={c} flat outline={0} y={floor + 980 - 110 - i * 200} z={-40 + i * 0.01} />
      ))}
      {layers.map((_, i) => (
        <Line key={`l${i}`} pts={Array.from({ length: 30 }, (_, j) => [-2500 + j * 172, floor + 980 - i * 200 - 4 + Math.sin(j * 1.7 + i) * 6] as [number, number])} width={4} color="#7a5638" z={-39.5} />
      ))}
      <Part shape={roundRect(5000, 600, 0)} color="#8a6440" flat outline={0} y={floor - 300} z={-36} />
      <Line pts={[[-2500, floor], [2500, floor]]} width={6} z={-35.9} />
      {/* ladder against the wall */}
      <X x={-120} y={floor} z={-34}>
        {[-26, 26].map((k) => (
          <Line key={k} pts={[[k, 0], [k + 60, 980]]} width={9} color="#6e4a2c" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <Line key={i} pts={[[-26 + i * 6, 40 + i * 92], [26 + i * 6, 40 + i * 92]]} width={7} color="#6e4a2c" />
        ))}
      </X>
      {/* hoist: rope from the top with a basket going up */}
      <X x={420} y={floor} z={-33}>
        <Line pts={[[0, 980], [0, 80 + hoist * 860]]} width={4} color="#3a2a22" />
        <X y={hoist * 860}>
          <Part shape={roundPoly([[-40, 0], [40, 0], [52, 60], [-52, 60]], 6)} color="#c9a24a" shade={0.2} />
          <Part shape={blob([[-44, 58], [-10, 84], [30, 80], [46, 58]], 6)} color="#a87a50" shade={0.2} z={-0.001} />
        </X>
      </X>
      {children}
    </>
  );
};

// 189.2 "Meanwhile, the work on his tomb never stops."
export const WorkNeverStopsRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const floor = -560;
  const dig = Math.sin(frame * 0.3);
  const walkX = -900 + frame * 4.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.12, 1.2), y: -40 }} light={{ dir: [-0.5, 0.7] }} vignette={0.5}>
        <Excavation floor={floor} frame={frame}>
          {/* workers up on the rim */}
          {Array.from({ length: 7 }, (_, i) => (
            <Character key={i} {...WORKER(i)} x={-900 + i * 300 + ((frame * (i % 2 ? 1 : -1)) % 60)} y={floor + 980} s={0.42} z={-38} look={0.5} expression={{ eyes: "half", mouth: "flat" }} pose={poses.walk(frame + i * 7, 0.7)} />
          ))}
          {/* foreground: a digger and a basket carrier */}
          <Character
            {...WORKER(1)}
            x={260}
            y={floor - 260}
            s={1.75}
            z={4}
            facing={-1}
            look={0.5}
            expression={{ eyes: "half", mouth: "teeth", brows: -0.4, sweat: true }}
            pose={{ armF: [0.9 + dig * 0.25, 0.4], armB: [0.7 + dig * 0.2, 0.5], lean: -0.1 + dig * 0.05 }}
            holdF={<X rot={upright([0.9 + dig * 0.25, 0.4]) - Math.PI / 2 + 0.2} s={0.9}><Shovel x={-120} /></X>}
          />
          <Smoke x={200} y={floor - 260} w={300} h={160} alpha={0.25} color="#c9a87a" seed={2} z={4.5} />
          <Character
            {...WORKER(2)}
            x={walkX}
            y={floor - 300}
            s={1.85}
            z={5}
            look={0.5}
            expression={{ eyes: "half", mouth: "wavy", brows: 0.4, sweat: true }}
            pose={{ ...poses.walk(frame, 0.6), armF: reachArm(walkX, floor - 300, 1.85, 1, [walkX + 150, floor - 300 + 1.85 * 214]), armB: [0.5, 0.6] }}
          />
          <X x={walkX} y={floor - 300 + 1.85 * 214} z={5.5}>
            <Line pts={[[-280, 0], [280, 0]]} width={12} color="#6e4a2c" />
            {[-1, 1].map((k) => (
              <X key={k} x={k * 250} y={0}>
                <Line pts={[[-30, -110], [0, 0], [30, -110]]} width={3} color="#3a2a22" />
                <Part shape={roundPoly([[-50, -170], [50, -170], [40, -110], [-40, -110]], 6)} color="#c9a24a" shade={0.2} />
                <Part shape={blob([[-46, -112], [-10, -86], [30, -90], [46, -112]], 6)} color="#a87a50" shade={0.2} z={0.001} />
              </X>
            ))}
          </X>
        </Excavation>
      </Stage>
    </AbsoluteFill>
  );
};

// 203.75 "Archaeologists have found some of those pits."
export const FoundPitsRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const brush = Math.sin(frame * 0.6) * 0.25;
  const flash = hitAt(t, 205.3, 0.15);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.5, 0.8] }} vignette={0.55}>
        <Plains mood="day" horizon={260} clouds={false}>
          {/* the pit: earth walls, floor with bones, a string grid */}
          <Part shape={roundPoly([[-1500, 260], [1500, 260], [1300, -200], [-1300, -200]], 10)} color="#9a6e48" shade={0.15} z={-20} />
          {[0, 1, 2].map((i) => (
            <Line key={i} pts={[[-1450 + i * 60, 200 - i * 120], [1450 - i * 60, 200 - i * 120]]} width={4} color="#7a5638" z={-19.9} />
          ))}
          <Part shape={roundRect(4000, 1400, 0)} color="#a87a50" flat outline={0} y={-900} z={-19} />
          <Line pts={[[-2000, -200], [2000, -200]]} width={6} z={-18.9} />
          {[[-120, -330, 0.1], [200, -420, -0.3], [-260, -470, 0.25]].map(([x, y, r], i) => (
            <Bones key={i} x={x} y={y} s={1.7} rot={r} z={-18 + i * 0.01} />
          ))}
          {[-700, -230, 240, 700].map((x) => (
            <Line key={x} pts={[[x, -220], [x + (x > 0 ? 80 : -80), -900]]} width={3} color="#f4f1ea" z={-17} />
          ))}
          {[-380, -620].map((y) => (
            <Line key={y} pts={[[-1300, y], [1300, y]]} width={3} color="#f4f1ea" z={-17} />
          ))}
          <Character
            {...ARCHAEOLOGIST(1)}
            x={-500}
            y={-700}
            s={1.75}
            z={3}
            look={0.45}
            expression={{ eyes: "open", mouth: "flat", brows: 0.4, gaze: [0.4, -0.9] }}
            pose={{ ...poses.sit(frame), armF: [1.0 + brush, 0.9], armB: [0.6, 0.8], lean: -0.15 }}
            holdF={
              <X rot={upright([1.0 + brush, 0.9])}>
                <Line pts={[[0, -20], [0, 90]]} width={10} color="#c9a24a" />
                <Part shape={roundRect(40, 50, 8)} color="#5a3a26" shade={0.2} y={-40} z={0.001} />
              </X>
            }
          />
          <Character
            {...ARCHAEOLOGIST(2)}
            x={560}
            y={-680}
            s={1.75}
            z={3}
            facing={-1}
            look={0.45}
            expression={{ eyes: "open", mouth: "o", brows: 0.6 }}
            pose={{ armF: [1.6, 1.2], armB: [1.5, 1.3] }}
            holdF={
              <X rot={upright([1.6, 1.2])} y={10}>
                <Part shape={roundRect(110, 70, 10)} color="#2a2a30" shade={0.2} />
                <Part shape={circle(24)} color="#5a6a7a" flat outline={4} z={0.001} />
              </X>
            }
          />
        </Plains>
      </Stage>
      {flash > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${0.5 * flash})` }} /> : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── the last journey ─────────────────────────

// 9.65 "He's 49."
export const FortyNineRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cough = hitAt(t, 10.3, 0.25) + hitAt(t, 10.6, 0.25);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: cough * 4 }} light={{ pos: [500, 0] }} vignette={0.8} vignetteColor="#04060c">
        <Tent dim={0.25}>
          <X x={520} y={-300} z={2}>
            <OilLamp s={1.6} />
          </X>
          <Character
            {...EMPEROR}
            skin="#e6ece0"
            x={-240}
            y={-860}
            s={2.35}
            z={3}
            look={0.45}
            expression={{ eyes: "half", mouth: cough > 0.2 ? "o" : "wavy", brows: 0.8, sweat: true, eyebags: true }}
            pose={{ ...poses.idle(frame), armF: [0.6, 1.9], armB: [0.2, 0.6], headTilt: -0.08 }}
          />
        </Tent>
      </Stage>
      <Label text="49" x={0.76} y={0.38} size={0.2} kind="title" at={sec(start)(9.9)} />
    </AbsoluteFill>
  );
};

// 10.95 "The man who wanted to live forever doesn't even make it to 50."
export const NotFiftyRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 12.7, 13.2, Easing.in(Easing.quad));
  const out = ramp(t, 13.2, 13.5);
  const dead = fall > 0.5;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: -60, shake: hitAt(t, 13.2, 0.3) * 5 }} light={{ pos: [500, 0] }} vignette={0.8} vignetteColor="#04060c">
        <Tent dim={0.2 + out * 0.3}>
          <WritingDesk x={120} y={-700} lit={1 - out} z={2} />
          {out > 0 ? <Smoke x={320} y={-400} w={80} h={300} alpha={0.5 * (1 - ramp(t, 13.8, 14.3))} seed={6} z={2.5} /> : null}
          <X x={-100 + fall * 60} y={-340 - fall * 60} rot={-fall * 0.6} z={2.2}>
            <MercuryBowl s={1.4} pills />
          </X>
          {fall > 0.6
            ? [0, 1, 2, 3].map((i) => (
                <Part key={i} shape={circle(12)} color="#4a3a32" shade={0.25} x={-20 + i * 60 + fall * i * 30} y={-490} z={2.3} />
              ))
            : null}
          <Character
            {...EMPEROR}
            skin="#e6ece0"
            x={-330}
            y={-700}
            s={2.2}
            z={3}
            look={0.45}
            expression={dead ? { eyes: "dead", mouth: "o" } : { eyes: "half", mouth: "wavy", brows: 0.8, sweat: true }}
            pose={{ ...poses.sit(frame), armF: [1.4 - fall * 0.6, 0.4], armB: [1.0, 0.4], lean: -0.15 - fall * 0.55, headTilt: -fall * 0.45 }}
          />
        </Tent>
      </Stage>
      <Label text="FOREVER?" x={0.72} y={0.14} size={0.07} kind="box" at={sec(start)(11.9)} />
      <Label text="50" x={0.78} y={0.42} size={0.18} kind="title" at={sec(start)(13.3)} />
      <Label text="✕" x={0.78} y={0.42} size={0.2} color="#fe5649" at={sec(start)(13.6)} />
    </AbsoluteFill>
  );
};

// 20.55 "They leave his body inside his carriage and keep bringing him meals, as if he's still alive."
export const MealsRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arrive = ramp(t, 21.6, 23.0, Easing.out(Easing.quad));
  const arm: [number, number] = [1.55, 0.15];
  const cs = 1.85;
  const cx = 260;
  const cy = -720;
  // carriage window (from ImperialCarriage: box at y 230, window at (70, 240) in its space)
  const wx = cx + 70 * cs;
  const wy = cy + 240 * cs;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ dir: [0.6, 0.6] }} vignette={0.55}>
        <Road>
          <ImperialCarriage x={cx} y={cy} s={cs} horses={2} z={1} />
          {/* the dead emperor slumped at the window */}
          <X x={wx - 10} y={wy - 230} rot={0.3} z={1.5}>
            <Character {...EMPEROR} skin="#d9e2c8" s={0.66} look={0.4} shadow={false} expression={{ eyes: "dead", mouth: "o" }} pose={{ armF: [0.2, 0.3], armB: [0.2, 0.3] }} />
          </X>
          <Part shape={roundPoly([[wx - 100, wy + 64], [wx - 50, wy + 64], [wx - 74, wy - 64], [wx - 100, wy - 64]], 6)} color="#7a1e1e" shade={0.2} z={1.6} />
          <Flies x={wx} y={wy + 30} n={5} r={110} z={1.7} />
          <Character
            {...WORKER(3)}
            x={interpolate(arrive, [0, 1], [-1200, -520])}
            y={-900}
            s={2.0}
            z={3}
            look={0.5}
            expression={{ eyes: "happy", mouth: "smile", brows: 0.2 }}
            pose={arrive < 1 ? { ...poses.walk(frame, 0.8), armF: arm, armB: arm } : { armF: arm, armB: arm, lean: 0.12 }}
            holdF={
              <X rot={upright(arm)} y={10}>
                <Part shape={roundRect(200, 18, 6)} color="#5a3a26" shade={0.2} />
                <Part shape={blob([[-50, 8], [50, 8], [36, 50], [-36, 50]], 6)} color="#f4f1ea" shade={0.2} x={-45} z={0.01} />
                <Part shape={ellipse(30, 18)} color="#c8662f" shade={0.2} x={-45} y={52} z={0.02} />
                <Part shape={ellipse(34, 14)} color="#7a9a46" shade={0.2} x={55} y={24} z={0.02} />
                {[0, 1].map((i) => (
                  <Line key={i} pts={Array.from({ length: 6 }, (_, j) => [-60 + i * 30 + Math.sin(j + frame * 0.15) * 8, 80 + j * 22] as [number, number])} smooth width={4} color="#f4f1ea" opacity={0.6} z={0.03} />
                ))}
              </X>
            }
          />
        </Road>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── mercury ─────────────────────────

// 154.75 "In 2020, a study found mercury vapor still leaking out through cracks."
export const VaporRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = 0.12 + ramp(t, 156.4, 157.6, Easing.out(Easing.back(2))) * 0.8 + Math.sin(frame * 0.7) * 0.012;
  const arm: [number, number] = [1.45, 0.45];
  const cracks: [number, number][][] = [
    [[-200, -380], [-150, -440], [-220, -500], [-160, -560]],
    [[180, -360], [250, -430], [190, -500], [260, -580]],
    [[560, -400], [520, -470], [600, -540]],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [0.6, 0.5] }} vignette={0.5}>
        <Plains mood="day" horizon={-60} mound="done" moundX={260} moundS={1.7}>
          <Part shape={roundRect(5000, 900, 0)} color="#7a6a3e" flat outline={0} y={-560} z={-10} />
          <Line pts={[[-2500, -110], [2500, -110]]} width={5} z={-9.9} />
          {cracks.map((c, i) => (
            <X key={i} z={-9}>
              <Line pts={c} width={9} color="#2e2418" />
              {t > 156.2 ? <Vapor x={c[0][0]} y={c[0][1]} h={760} seed={i} z={0.1} /> : null}
            </X>
          ))}
          <Character
            {...SCIENTIST(1)}
            x={-560}
            y={-840}
            s={1.95}
            z={3}
            look={0.5}
            expression={k > 0.7 ? { eyes: "wide", mouth: "o", brows: 0.8, sweat: true } : { eyes: "open", mouth: "flat", brows: 0.2, gaze: [0.6, -0.4] }}
            pose={{ ...poses.idle(frame), armF: arm, armB: [-0.1, 0.2] }}
            holdF={<X rot={upright(arm)} s={0.55}><Gauge x={0} y={90} k={k} /></X>}
          />
        </Plains>
      </Stage>
      <Label text="2020" x={0.16} y={0.13} size={0.08} kind="box" at={sec(start)(155.0)} />
      <Label text="MERCURY VAPOR" x={0.62} y={0.13} size={0.065} kind="box" at={sec(start)(157.3)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── deaths, shown ─────────────────────────

// 42.95 "And he does."
export const HeDoesRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const s = 1.55;
  const ground = -560;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -200 }} light={{ dir: [0.6, 0.4] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.75}>
        <Frontier mood="dusk">
          <Part shape={roundRect(5000, 700, 0)} color="#8a6a4a" flat outline={0} y={ground - 350} z={-5} />
          {/* the prince lies dead, his sword beside him */}
          <X x={330} y={ground + 62 * s} rot={Math.PI / 2} z={2}>
            <Character {...FUSU} s={s} look={0.3} shadow={false} expression={{ eyes: "dead", mouth: "flat" }} pose={{ armF: [0.1, 0.1], armB: [0.1, 0.1] }} />
          </X>
          <X x={120} y={ground + 20} rot={-1.45} z={2.5}>
            <Jian len={320} />
          </X>
          <Part shape={ellipse(150, 18)} color="#5a2a2a" flat outline={0} opacity={0.55} x={-40} y={ground + 6} z={1.9} />
          {/* a loyal soldier kneels beside him */}
          <Character
            {...GUARD(1)}
            x={-470}
            y={ground - 40}
            s={1.6}
            z={3}
            look={0.45}
            expression={{ eyes: "closed", mouth: "wavy", brows: 0.9 }}
            pose={{ ...poses.sit(frame), armF: [0.9, 1.4], armB: [0.6, 1.2], headTilt: -0.2, lean: -0.15 }}
          />
        </Frontier>
      </Stage>
    </AbsoluteFill>
  );
};

/** A body under a white funeral shroud on a mat. Origin = floor centre. */
const Shroud: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(360, 30, 8)} color="#7a5a3a" shade={0.2} y={10} />
    <Part shape={blob([[-170, 20], [-150, 70], [-80, 82], [60, 74], [110, 92], [150, 84], [172, 48], [170, 20]], 8)} color="#f2efe8" shade={0.24} z={0.001} />
    <Line pts={[[-60, 72], [-40, 50], [-20, 72]]} smooth width={3} color="#c9c4ba" z={0.002} />
  </X>
);

// 54.75 "Sima Qian says a great many of them die."
export const ManyDieRedoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const floor = -520;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.07), y: -120 }} light={{ pos: [0, 200] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.75} vignetteColor="#04060c">
        <ThroneHall floorY={floor} throne={false} dim={0.4}>
          {[[-620, 0], [-140, 0], [340, 0], [820, 0], [-380, -120], [100, -120], [580, -120]].map(([x, dy], i) => (
            <X key={i} z={2 + (dy < 0 ? 0.5 : 0) + i * 0.01}>
              <Shroud x={x} y={floor + dy} s={dy < 0 ? 1.0 : 0.85} />
              <X x={x + 150} y={floor + dy + 20}>
                <Part shape={roundRect(16, 60, 5)} color="#f4f1ea" shade={0.15} y={30} />
                <Flame y={66} size={0.16} seed={i} />
                <Glow y={68} rx={140} color="#ffb35a" alpha={0.4} additive />
              </X>
            </X>
          ))}
          <Character
            {...WIFE(1)}
            x={-560}
            y={floor - 330}
            s={1.75}
            z={5}
            look={0.45}
            expression={{ eyes: "closed", mouth: "wavy", brows: 0.95 }}
            pose={{ ...poses.idle(frame), armF: [1.9, 1.4], armB: [1.6, 1.5], headTilt: -0.12 }}
          />
        </ThroneHall>
      </Stage>
      <Label text="SIMA QIAN" sub="RECORDS OF THE GRAND HISTORIAN" x={0.7} y={0.13} size={0.05} kind="box" at={sec(start)(55.0)} />
    </AbsoluteFill>
  );
};
