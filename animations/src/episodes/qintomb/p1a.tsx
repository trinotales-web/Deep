import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Wash, QuestionMark, Hammer, roundRect, circle, poly, ramp, push, hitAt, absT, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MoundSection, MercuryRiver, StarCeiling, OilLamp, CrossbowTrap, StoneGate, WallTorch, RedPillar, AncientShip, ImperialCarriage, FishCart,
  TerracottaPit, BurialMound, Flame,
} from "../../kit/env";
import { sec, pop, scr } from "../../kit/shot";
import { Plains, ThroneHall, TombCorridor, PalaceVault, Seascape } from "./sets";
import { EMPEROR, WORKER, OFFICIAL, ZHAO_GAO, JING_KE, CHILD } from "./cast";

/** Keep a held prop upright in world space for an arm pose [shoulder, elbow]. */
export const upright = (arm: [number, number]) => -(arm[0] + arm[1]);
const LAMP_ARM: [number, number] = [2.2, 0.6];

/** The narrator's "you": the worker with the orange head wrap holding a lamp. */
export const You: React.FC<{ x: number; y: number; s: number; z?: number; facing?: 1 | -1; expression?: React.ComponentProps<typeof Character>["expression"]; look?: number; arm?: [number, number]; talking?: boolean }> = ({
  x,
  y,
  s,
  z = 2,
  facing = 1,
  expression = { eyes: "open", mouth: "flat", brows: 0.2 },
  look = 0.5,
  arm = LAMP_ARM,
  talking = false,
}) => {
  const frame = useCurrentFrame();
  return (
    <Character
      {...WORKER(0)}
      x={x}
      y={y}
      s={s}
      z={z}
      facing={facing}
      look={look}
      talking={talking}
      expression={expression}
      pose={{ ...poses.idle(frame), armF: arm }}
      holdF={<OilLamp rot={upright(arm)} s={0.9} />}
    />
  );
};

// ───────────────────────── cold open ─────────────────────────

// 0.0 "It's autumn, 210 BC."
export const AutumnShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="autumn" horizon={-140} mound="build" moundS={1.05}>
          {Array.from({ length: 9 }, (_, i) => (
            <X key={i} x={-760 + i * 60 + frame * 1.2} y={-170 - (i % 2) * 6} s={0.22} z={2 + i * 0.001}>
              <Part shape={roundRect(60, 120, 20)} color={i % 3 === 0 ? "#f4f1ea" : "#3a2a2a"} shade={0.2} y={60} />
              <Part shape={circle(34)} color="#f6f5f8" shade={0.2} y={150} z={0.001} />
              {i % 3 === 0 ? <Line pts={[[30, 40], [30, 300]]} width={8} color="#6e4a2c" z={0.002} /> : null}
              {i % 3 === 0 ? <Part shape={roundRect(70, 120, 4)} color="#f4f1ea" shade={0.15} x={64} y={240} z={0.003} /> : null}
            </X>
          ))}
        </Plains>
      </Stage>
      <Label text="AUTUMN, 210 BC" x={0.5} y={0.16} size={0.09} kind="title" at={sec(start)(1.0)} />
    </AbsoluteFill>
  );
};

// 2.75 "You're deep under a giant hill in China, holding a lamp."
export const UnderHillShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const zoom = interpolate(frame, [0, dur], [0.95, 1.35], { easing: Easing.inOut(Easing.quad) });
  const cy = interpolate(frame, [0, dur], [0, -200], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: cy }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="dusk" horizon={160} clouds>
          <MoundSection y={160} w={1900} depth={820} stage="build" z={-20} />
          <X x={-60} y={160 - 820 * 0.55 - 240} z={5}>
            <Glow rx={160} color="#ffcf7a" alpha={0.5} additive />
            <Character {...WORKER(0)} y={-10} s={0.32} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={{ ...poses.idle(frame), armF: LAMP_ARM }} holdF={<OilLamp rot={upright(LAMP_ARM)} />} />
          </X>
        </Plains>
      </Stage>
      <Label text="YOU" {...scr(-60, 160 - 820 * 0.55 - 240 + 190, zoom, 0, cy)} size={0.05} kind="box" at={sec(start)(5.3)} />
    </AbsoluteFill>
  );
};

// 6.15 "Around you, rivers of silver shine across the floor."
export const SilverRiversShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ pos: [-200, 200] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.75} vignetteColor="#04060c">
        <PalaceVault floorY={-380}>
          <MercuryRiver y={-560} w={3200} h={110} speed={1.2} z={8} />
          <MercuryRiver y={-300} w={2600} h={50} speed={0.8} z={-5} />
          <You x={-320} y={-470} s={1.3} expression={{ eyes: "wide", mouth: "o", brows: 0.4, gaze: [0.6, -0.6] }} />
        </PalaceVault>
      </Stage>
    </AbsoluteFill>
  );
};

// 9.45 "Above you, the ceiling is full of stars."
export const StarsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: interpolate(frame, [0, dur], [-80, 60]) }} light={{ pos: [0, -300] }} vignette={0.6} vignetteColor="#04060c">
        <StarCeiling w={2600} h={1600} y={160} seed={7} z={-40} />
        <Part shape={roundRect(2600, 400, 0)} color="#1a1e2a" flat outline={0} y={-560} z={-10} />
        <You x={0} y={-520} s={1.0} expression={{ eyes: "wide", mouth: "o", brows: 0.5, gaze: [0, 1] }} look={0.2} />
      </Stage>
    </AbsoluteFill>
  );
};

// 12.25 "And hidden in the dark are crossbows, loaded and aimed at the doors."
export const CrossbowsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ pos: [-200, 200] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.8} vignetteColor="#04060c">
        <TombCorridor floorY={-420} torches={false} dark={0.5}>
          <StoneGate x={700} y={-420} w={460} h={560} drop={0} z={1} />
          {[-760, -420, -80].map((x, i) => (
            <X key={x} z={3 + i * 0.01}>
              <Glow x={x + 60} y={-180} rx={300} color="#ffcf7a" alpha={0.5 * ramp(t, 13.7 + i * 0.3, 14.0 + i * 0.3)} additive z={-0.1} />
              <CrossbowTrap x={x} y={-440 + i * 30} s={1.35} />
            </X>
          ))}
        </TombCorridor>
      </Stage>
    </AbsoluteFill>
  );
};

/** Paper plan of the tomb's traps, seen from above. */
export const TrapPlan: React.FC<{ t: number; marks: number[] }> = ({ t, marks }) => {
  const xs: [number, number][] = [[-360, 200], [320, 220], [-380, -140], [360, -150], [0, 260], [40, -40]];
  return (
    <X>
      <Part shape={roundRect(1100, 700, 8)} color="#efe2c4" shade={0.1} />
      <Line pts={[[-460, 300], [460, 300], [460, -300], [-460, -300], [-460, 300]]} width={6} color="#3a2a22" z={0.001} />
      <Line pts={[[-280, 160], [280, 160], [280, -160], [-280, -160], [-280, 160]]} width={6} color="#3a2a22" z={0.001} />
      <Line pts={[[-90, 60], [90, 60], [90, -60], [-90, -60], [-90, 60]]} width={6} color="#3a2a22" z={0.001} />
      <Line pts={[[-460, 0], [-280, 40], [-90, 0]]} width={4} color="#3a2a22" z={0.001} />
      <Line pts={[[-400, -220], [-200, -260], [0, -200], [200, -250], [400, -210]]} smooth width={5} color="#6a8aa8" z={0.001} />
      {xs.map(([x, y], i) => (
        <X key={i} x={x} y={y} s={pop(t, marks[i] ?? 99)} z={0.01}>
          <Part shape={circle(34)} color="#ffffff" flat outline={0} opacity={0} />
          <Line pts={Array.from({ length: 25 }, (_, k) => [Math.cos((k / 24) * 6.4) * 34, Math.sin((k / 24) * 6.4) * 34] as [number, number])} width={6} color="#c8262f" />
          <Line pts={[[-16, -16], [16, 16]]} width={6} color="#c8262f" />
          <Line pts={[[-16, 16], [16, -16]]} width={6} color="#c8262f" />
        </X>
      ))}
      <X y={0} z={0.02}>
        <Part shape={roundRect(70, 50, 8)} color="#c9963f" shade={0.2} />
        <Part shape={roundRect(70, 16, 4)} color="#8a6a2a" flat outline={3} y={10} z={0.001} />
      </X>
    </X>
  );
};

// 16.45 "You know where every one of them is."
export const TrapPlanShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#46585c" flat outline={0} z={-40} />
        <TrapPlan t={t} marks={[16.9, 17.0, 17.15, 17.3, 17.45, 17.6]} />
        <X x={interpolate(t, [16.5, 17.7], [-380, 380])} y={interpolate(t, [16.5, 17.7], [-460, -230])} rot={0.5} z={2}>
          <Line pts={[[0, 0], [0, 260]]} width={10} color="#6e4a2c" />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// 18.05 "You helped build them."
export const BuildTrapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const swing = Math.max(0, Math.sin(frame * 0.5));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40, shake: (Math.sin(frame * 0.5) > 0.95 ? 1 : 0) * 2 }} light={{ pos: [-300, 300] }} vignette={0.6}>
        <TombCorridor floorY={-460}>
          <CrossbowTrap x={60} y={-480} s={1.25} z={2} />
          <Character
            {...WORKER(0)}
            x={-320}
            y={-600}
            s={1.3}
            z={3}
            look={0.5}
            expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }}
            pose={{ armF: [2.0 - swing * 1.2, 0.3], armB: [0.9, 0.6] }}
            holdF={<Hammer rot={Math.PI} s={1.1} />}
          />
          <Character {...WORKER(1)} x={560} y={-600} s={1.2} z={2.5} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.handsOnHips} />
        </TombCorridor>
      </Stage>
    </AbsoluteFill>
  );
};

/** Funeral procession carrying the lacquered coffin through the tomb. */
const Procession: React.FC<{ x: number; frame: number }> = ({ x, frame }) => (
  <X x={x}>
    <X y={-210} z={2}>
      <Part shape={roundRect(520, 150, 20)} color="#1e1a20" shade={0.22} y={60} />
      <Part shape={roundRect(480, 30, 6)} color="#b8322a" flat outline={4} y={110} z={0.001} />
      <Line pts={[[-230, 70], [230, 70]]} width={5} color="#c9963f" z={0.001} />
      <Line pts={[[-340, -10], [340, -10]]} width={10} color="#6e4a2c" z={-0.01} />
    </X>
    {[-300, -100, 100, 300].map((cx, i) => (
      <Character
        key={i}
        {...(i % 2 ? WORKER(i) : OFFICIAL(i))}
        x={cx}
        y={-560 + (i % 2) * 6}
        s={0.92}
        z={i % 2 ? 1.5 : 2.5}
        look={0.5}
        expression={{ eyes: "half", mouth: "flat", brows: 0.4 }}
        pose={{ ...poses.walk(frame + i * 5, 0.6), armF: [2.8, 0.2], armB: [2.8, 0.2], armsOverHead: true }}
      />
    ))}
  </X>
);

// 19.45 "Today, China's first emperor is being buried here."
export const FuneralShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ pos: [-300, 300] }} vignette={0.65} vignetteColor="#04060c">
        <TombCorridor floorY={-460}>
          <Procession x={-500 + frame * 2.2} frame={frame} />
          {[-760, 760].map((x) => (
            <X key={x} x={x} y={-480} z={4}>
              <Line pts={[[0, 0], [0, 520]]} width={10} color="#6e4a2c" />
              <Part shape={roundRect(90, 300, 4)} color="#f4f1ea" shade={0.15} x={50} y={360} z={0.001} />
            </X>
          ))}
        </TombCorridor>
      </Stage>
    </AbsoluteFill>
  );
};

// 22.55 "You know his biggest secret, and that's a problem."
export const SecretProblemShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const worried = t > 24.6;
  const s = 2.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: hitAt(t, 24.7, 0.3) * 5 }} light={{ pos: [300, 100] }} vignette={0.7} vignetteColor="#04060c">
        <TombCorridor floorY={-700} dark={0.35} torches={false} />
        <You
          x={-120}
          y={-40 - 308 * s}
          s={s}
          arm={[2.0, 0.9]}
          look={0.35}
          expression={worried ? { eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true } : { eyes: "half", mouth: "smirk", brows: -0.4 }}
        />
      </Stage>
      <Label text="!" x={0.74} y={0.24} size={0.16} color="#fe5649" at={sec(start)(24.7)} />
    </AbsoluteFill>
  );
};

// 25.5 "Far above you, someone is deciding what to do with you."
export const DecidingShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0 }} light={{ pos: [0, 300] }} vignette={0.65} vignetteColor="#04060c">
        <Plains mood="night" horizon={140} clouds={false}>
          <MoundSection y={140} w={2000} depth={640} stage="none" z={-20} />
          <Character {...ZHAO_GAO} x={-220} y={140} s={0.85} z={3} look={0.4} expression={{ eyes: "half", mouth: "smirk", brows: -0.5, gaze: [0.4, -0.8] }} pose={poses.think} />
          <Character {...OFFICIAL(1)} x={160} y={140} s={0.85} z={3} facing={-1} look={0.4} expression={{ eyes: "half", mouth: "flat", brows: -0.3, gaze: [0.4, -0.8] }} pose={poses.idle(frame)} />
          <X x={420} y={140} z={3}>
            <Line pts={[[0, 0], [0, 260]]} width={10} color="#6e4a2c" />
            <Flame y={270} size={0.45} seed={3} z={0.01} />
            <Glow y={260} rx={260} color="#ffb35a" alpha={0.4} additive />
          </X>
          <X x={-40} y={140 - 640 * 0.55 - 150} z={5}>
            <Glow rx={120} color="#ffcf7a" alpha={0.5} additive />
            <Character {...WORKER(0)} y={-20} s={0.36} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={{ ...poses.idle(frame), armF: LAMP_ARM }} holdF={<OilLamp rot={upright(LAMP_ARM)} />} />
          </X>
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── the questions + teasers ─────────────────────────

// 29.05 "So why would a man need a whole underground world to rule after death?"
export const WhyWorldShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05), y: -20 }} light={{ pos: [0, 300] }} vignette={0.6} vignetteColor="#04060c">
        <PalaceVault floorY={-380}>
          <MercuryRiver y={-560} w={3200} h={90} z={8} />
          <Character {...EMPEROR} x={0} y={-460} s={1.25} z={3} look={0.1} expression={{ eyes: "half", mouth: "flat", brows: -0.2 }} pose={poses.handsOnHips} />
          <QuestionMark x={420} y={220} s={1.0 * pop(t, 32.2)} rot={0.12} z={10} />
        </PalaceVault>
      </Stage>
    </AbsoluteFill>
  );
};

// 32.65 "And why does someone want you to stay down here forever?"
export const StayForeverShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: -60 }} light={{ pos: [0, 200] }} vignette={0.85} vignetteColor="#020306">
        <TombCorridor floorY={-460} torches={false} dark={0.55}>
          <You x={0} y={-600} s={1.3} z={3} look={0.1} expression={{ eyes: "wide", mouth: "wavy", brows: 0.7, sweat: true, gaze: [-0.8, 0] }} />
        </TombCorridor>
        <QuestionMark x={420} y={260} s={0.9 * pop(t, 34.8)} rot={0.12} z={50} />
      </Stage>
    </AbsoluteFill>
  );
};

// 35.55 "Coming up, a king who runs for his life around a pillar."
export const TeaserPillarShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = frame * 0.11;
  const orbit = (ph: number) => ({ x: Math.cos(a + ph) * 330, z: Math.sin(a + ph) > 0 ? -0.5 : 2 });
  const k = orbit(0);
  const j = orbit(-1.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          <RedPillar x={0} y={-460} h={1100} w={120} z={1} />
          <Character {...EMPEROR} x={k.x} y={-500} s={1.0} z={1 + k.z} facing={Math.sin(a) > 0 ? -1 : 1} look={0.6} expression={{ eyes: "wide", mouth: "shout", brows: 0.8, sweat: true }} pose={poses.run(frame)} />
          <Character {...JING_KE} x={j.x} y={-500} s={1.0} z={1 + j.z} facing={Math.sin(a - 1.0) > 0 ? -1 : 1} look={0.6} expression={{ eyes: "angry", mouth: "teeth", brows: -0.8 }} pose={{ ...poses.run(frame + 7), armF: [2.4, 0.4] }} />
        </ThroneHall>
      </Stage>
      <Label text="COMING UP" x={0.86} y={0.08} size={0.05} kind="box" at={4} />
    </AbsoluteFill>
  );
};

/** Misty magic island of the immortals. */
export const MagicIsland: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Glow y={160} rx={520} ry={320} color="#fff4d0" alpha={0.5} additive z={-0.01} />
    {[[-160, 220], [40, 340], [210, 240]].map(([mx, h], i) => (
      <Part key={i} shape={poly([[mx - 140, 0], [mx, h], [mx + 140, 0]])} color={["#5aa88a", "#4f9a7a", "#6ab896"][i]} shade={0.2} z={i * 0.001} />
    ))}
    <Part shape={roundRect(560, 40, 20)} color="#e9f6f8" flat outline={0} opacity={0.7} y={60} z={0.01} />
    <Part shape={roundRect(420, 30, 15)} color="#e9f6f8" flat outline={0} opacity={0.6} x={60} y={200} z={0.01} />
  </X>
);

// 38.95 "Thousands of children sent across the sea to find a magic island."
export const TeaserIslandShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [0.6, 0.5] }}>
        <Seascape mood="dawn" horizon={-40}>
          <MagicIsland x={560} y={-40} s={0.8} z={-20} />
          {[0, 1, 2].map((i) => (
            <AncientShip key={i} x={-620 + i * 330 + frame * 1.5} y={-180 - i * 50} len={520 - i * 90} heads={5} z={2 - i * 0.1} />
          ))}
        </Seascape>
      </Stage>
    </AbsoluteFill>
  );
};

// 42.6 "A dead emperor hidden behind carts of stinking fish."
export const TeaserFishShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0 }} light={{ dir: [0.6, 0.6] }}>
        <Plains mood="day" horizon={-60}>
          <ImperialCarriage x={-200 + frame * 1.5} y={-250} s={0.75} horses={2} walk={1} z={1} />
          <FishCart x={-700 + frame * 1.5} y={-480} smell={1} s={1.1} z={2} />
          <FishCart x={300 + frame * 1.5} y={-500} smell={1} s={1.1} seed={5} z={2.1} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 45.9 "And 8,000 clay soldiers that nobody saw for over 2,000 years."
export const TeaserArmyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 80 }} light={{ dir: [-0.6, 0.8] }} vignette={0.75} vignetteColor="#04060c">
        <TerracottaPit y={-440} w={2200} rows={5} cols={9} />
        <Wash width={4000} height={3000} color="#0a0610" alpha={0.55 * (1 - ramp(t, 46.3, 47.4))} z={40} />
      </Stage>
      <Label text="8,000" x={0.5} y={0.16} size={0.1} kind="title" at={sec(start)(46.2)} />
      <Label text="2,000 YEARS" x={0.82} y={0.3} size={0.05} kind="box" at={sec(start)(49.3)} />
    </AbsoluteFill>
  );
};

// 50.65 "But first, let's meet the man in the tomb."
export const MeetManShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 40 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <ThroneHall floorY={-460}>
          <Character {...EMPEROR} x={0} y={-292} s={1.15} z={2} look={0.1} expression={{ eyes: "half", mouth: "flat", brows: -0.3 }} pose={poses.sit(frame)} />
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 53.25 "A man terrified of dying."
export const TerrifiedShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 2.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), shake: 1.5 }} light={{ pos: [400, 100] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.8} vignetteColor="#04060c">
        <ThroneHall floorY={-800} throne={false} dim={0.45} />
        <Character {...EMPEROR} x={-60} y={-60 - 308 * s} s={s} z={3} look={0.3} expression={{ eyes: "wide", mouth: "wavy", brows: 0.9, sweat: true }} pose={poses.scared(frame)} />
        <X x={520} y={-200} z={4}>
          <Part shape={roundRect(30, 160, 6)} color="#f4f1ea" shade={0.15} y={80} />
          <Flame y={165} size={0.3} seed={4} z={0.01} />
          <Glow y={170} rx={240} color="#ffb35a" alpha={0.5} additive />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

