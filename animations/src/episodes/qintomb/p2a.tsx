import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Wash, QuestionMark, Spear, Shovel, roundRect, circle, blob, poly, ellipse, ramp, push, hitAt, absT, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  ChinaMap, chinaXY, PLACES, Ribbon, Sunburst, StoneGate, ImperialCarriage, FishCart, BambooSlips, TreasureChest, JadeDisc, Coin, Ding, OilLamp,
  BurialMound, RoundTree, Flame, Smoke, Banner, Mountains, Sky, StoneWall, MapScroll,
} from "../../kit/env";
import { sec, pop, scr, useScr, RibbonText, SpeechBubble } from "../../kit/shot";
import { Plains, ThroneHall, TombCorridor } from "./sets";
import { EMPEROR, HUHAI, FUSU, WORKER, OFFICIAL, ZHAO_GAO, GUARD, WIFE, SIMA_QIAN, REBEL } from "./cast";
import { upright, You } from "./p1a";

/** Travel tent interior at night (the emperor's last journey). */
export const Tent: React.FC<{ dim?: number; children?: React.ReactNode }> = ({ dim = 0.35, children }) => (
  <>
    <Part shape={roundRect(5000, 3000, 0)} color="#4a3a2e" flat outline={0} z={-41} />
    {Array.from({ length: 9 }, (_, i) => (
      <Line key={i} pts={[[-1200 + i * 300, 600], [-1100 + i * 280, -500]]} width={5} color="#3a2c22" z={-40} />
    ))}
    <Part shape={roundRect(5000, 600, 0)} color="#3a2c24" flat outline={0} y={-760} z={-36} />
    <Line pts={[[-2500, -460], [2500, -460]]} width={6} z={-35} />
    {children}
    {dim > 0 ? <Wash width={5000} height={3000} color="#0a0610" alpha={dim} z={40} /> : null}
  </>
);

/** Low writing desk with a candle. Origin = floor centre. */
export const WritingDesk: React.FC<{ x?: number; y?: number; lit?: number; z?: number }> = ({ x = 0, y = 0, lit = 1, z = 0 }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(560, 30, 8)} color="#3a2420" shade={0.2} y={200} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={roundRect(30, 190, 6)} color="#2a1a18" shade={0.2} x={k * 240} y={95} z={-0.01} />
    ))}
    <X x={200} y={215} z={0.01}>
      <Part shape={roundRect(24, 80, 6)} color="#f4f1ea" shade={0.15} y={40} />
      {lit > 0 ? <Flame y={86} size={0.22 * lit} seed={5} /> : null}
      {lit > 0 ? <Glow y={90} rx={260} color="#ffb35a" alpha={0.45 * lit} additive /> : null}
    </X>
  </X>
);

// ───────────────────────── the death ─────────────────────────

// 0.0 "Then the emperor suddenly dies …"
export const EmperorDiesShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const slump = ramp(t, 1.4, 1.9, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -60, shake: hitAt(t, 1.9, 0.3) * 4 }} light={{ pos: [300, 100] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.75} vignetteColor="#04060c">
        <Tent dim={0.3}>
          <Character {...EMPEROR} x={-80} y={-560} s={1.3} z={1} look={0.4} expression={slump > 0.5 ? { eyes: "closed", mouth: "o", brows: 0.4 } : { eyes: "half", mouth: "flat", brows: 0.3, eyebags: true }} pose={{ ...poses.sit(frame), armF: [1.3, 0.6], armB: [1.1, 0.6], lean: -0.5 * slump, headTilt: -0.4 * slump }} />
          <WritingDesk x={60} y={-560} lit={1 - ramp(t, 1.6, 2.1)} z={2} />
          <BambooSlips x={230} y={-345} n={6} s={0.4} rot={1.5} z={2.1} />
        </Tent>
      </Stage>
    </AbsoluteFill>
  );
};

// 2.2 "… and the tomb has to be closed forever."
export const MustCloseShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: -20, shake: hitAt(t, 3.9, 0.4) * 8 }} light={{ pos: [-300, 300] }} vignette={0.7} vignetteColor="#04060c">
        <TombCorridor floorY={-460}>
          <StoneGate x={0} y={-460} w={620} h={700} drop={ramp(t, 2.6, 3.9, Easing.in(Easing.quad))} z={2} />
        </TombCorridor>
      </Stage>
      <Label text="FOREVER" x={0.5} y={0.08} size={0.065} kind="stamp" rotate={-6} at={sec(start)(3.9)} />
    </AbsoluteFill>
  );
};

// 4.45 "It's 210 BC, and he's far from home, on a trip across his empire."
export const LastTripShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 40;
  const center: [number, number] = [114, 33.5];
  const zoom = push(frame, dur, 0.95, 1.02);
  const route: [number, number][] = [PLACES.xianyang, [113, 31.2], [117.5, 30.2], [120.6, 30.0], [120.9, 33.0], PLACES.langya, [117.6, 36.6], PLACES.shaqiu];
  const [hx, hy] = chinaXY(...PLACES.xianyang, ppd, center);
  const [sx, sy] = chinaXY(...PLACES.shaqiu, ppd, center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={ppd} center={center} kingdoms conquered={["qin", "han", "zhao", "wei", "chu", "yan", "qi"]} route={route} routeK={ramp(t, 5.0, 9.2)} routeColor="#e9c66a" dots={[PLACES.xianyang]} />
        <Ribbon x={hx} y={hy - 90} w={220} h={56} z={5} />
        {t > 9.2 ? <Part shape={circle(16)} color="#fe5649" flat outline={4} x={sx} y={sy} s={pop(t, 9.2)} z={6} /> : null}
      </Stage>
      <RibbonText text="HOME" x={hx} y={hy - 90} zoom={zoom} size={0.036} />
      <Label text="210 BC" x={0.16} y={0.13} size={0.08} kind="box" at={sec(start)(4.8)} />
    </AbsoluteFill>
  );
};

/** Framed portrait of the emperor with a candle (memorial). */
const EmperorPortrait: React.FC<{ s?: number; dark?: boolean }> = ({ s = 1, dark = false }) => {
  const frame = useCurrentFrame();
  return (
    <X s={s}>
      <Part shape={roundRect(420, 520, 10)} color="#3a2420" shade={0.2} />
      <Part shape={roundRect(360, 460, 4)} color={dark ? "#2a2a34" : "#e9dcc0"} flat outline={4} z={0.001} />
      <Character {...EMPEROR} y={-380} s={0.82} z={0.01} look={0.2} expression={{ eyes: "half", mouth: "flat", brows: 0 }} pose={poses.idle(frame)} />
      <Part shape={roundRect(370, 150, 0)} color="#3a2420" flat outline={0} y={-310} z={0.05} />
    </X>
  );
};

// 9.65 "He's 49."
export const FortyNineShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [300, 100] }} vignette={0.7} vignetteColor="#04060c">
        <Part shape={roundRect(4000, 3000, 0)} color="#2a1a18" flat outline={0} z={-40} />
        <EmperorPortrait s={1.1} />
      </Stage>
      <Label text="49" x={0.78} y={0.4} size={0.16} kind="title" at={sec(start)(10.0)} />
    </AbsoluteFill>
  );
};

// 10.95 "The man who wanted to live forever doesn't even make it to 50."
export const NotFiftyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#3a2a30" alt="#33252a" speed={0.3} z={-40} />
        <Part shape={roundRect(200, 26, 8)} color="#f4f1ea" shade={0.15} x={-200} y={-250} rot={1.2} z={1} />
        <X x={140} y={-260} rot={-0.5} z={1}>
          <Part shape={blob([[-90, 50], [90, 50], [60, 0], [-60, 0]], 8)} color="#8a6a3a" shade={0.22} />
        </X>
        {[-60, 0, 60, 110, 170].map((x, i) => (
          <Part key={i} shape={circle(13)} color="#4a3a32" shade={0.25} x={x + 140} y={-330 - (i % 2) * 12} z={1.1} />
        ))}
      </Stage>
      <Label text="FOREVER?" x={0.5} y={0.16} size={0.07} kind="box" at={sec(start)(12.1)} />
      <Label text="50" x={0.5} y={0.42} size={0.18} kind="title" at={sec(start)(13.4)} />
      <Label text="✕" x={0.5} y={0.42} size={0.26} color="#fe5649" at={sec(start)(13.7)} />
    </AbsoluteFill>
  );
};

// 14.35 "His closest advisers panic."
export const AdvisersPanicShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -40, shake: 2 }} light={{ pos: [300, 100] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.7} vignetteColor="#04060c">
        <Tent dim={0.2}>
          <Character {...EMPEROR} x={0} y={-560} s={1.0} z={1} look={0.3} expression={{ eyes: "closed", mouth: "o" }} pose={{ ...poses.sit(frame), lean: -0.5, headTilt: -0.4 }} />
          <WritingDesk x={120} y={-560} z={1.5} />
          <Character {...ZHAO_GAO} x={-460} y={-600} s={1.25} z={3} look={0.5} expression={{ eyes: "wide", mouth: "shout", brows: 0.9, sweat: true }} pose={poses.scared(frame)} />
          <Character {...OFFICIAL(0)} x={480} y={-600} s={1.25} z={3} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.9, sweat: true }} pose={poses.armsUp(frame)} />
        </Tent>
      </Stage>
      <Label text="PANIC!" x={0.5} y={0.12} size={0.07} kind="stamp" rotate={-6} at={sec(start)(15.7)} />
    </AbsoluteFill>
  );
};

// 16.35 "If the news gets out, the empire could fall apart."
export const EmpireCracksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 17.6, 18.9);
  const cracks: [number, number][][] = [
    [[-60, 40], [-160, 120], [-260, 140], [-380, 260]],
    [[-60, 40], [40, -60], [80, -200], [200, -320]],
    [[-60, 40], [120, 80], [260, 60], [360, 180]],
    [[-60, 40], [-140, -80], [-300, -160]],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), shake: k > 0 && k < 1 ? 3 : 0 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={44} center={[113.5, 34]} kingdoms conquered={["qin", "han", "zhao", "wei", "chu", "yan", "qi"]} />
        {cracks.map((c, i) => {
          const n = Math.max(2, Math.round(c.length * k));
          return k > 0 ? <Line key={i} pts={c.slice(0, n)} width={10} color="#f4e2b0" z={4} /> : null;
        })}
        {k > 0.5
          ? [[-300, -120], [200, 140], [320, -220]].map(([x, y], i) => (
              <X key={i} x={x} y={y} s={pop(t, 18.3 + i * 0.15)} z={5}>
                <Flame size={0.5} seed={i + 3} />
              </X>
            ))
          : null}
      </Stage>
    </AbsoluteFill>
  );
};

// 19.15 "So they keep it secret."
export const KeepSecretShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const s = 1.9;
  const shh: [number, number] = [2.75, 2.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [300, 100] }} vignette={0.7} vignetteColor="#04060c">
        <Tent dim={0.25} />
        <Character {...ZHAO_GAO} x={-300} y={-40 - 308 * s} s={s} z={2} look={0.4} expression={{ eyes: "half", mouth: "smirk", brows: -0.6 }} pose={{ armF: shh, armB: [-0.2, -0.1], armsOverHead: true }} />
        <Character {...OFFICIAL(0)} x={400} y={-60 - 308 * s} s={s * 0.9} z={1.9} facing={-1} look={0.4} expression={{ eyes: "wide", mouth: "flat", brows: 0.5, sweat: true }} pose={{ armF: shh, armB: [-0.2, -0.1], armsOverHead: true }} />
      </Stage>
      <Label text="SHHH..." x={0.5} y={0.08} size={0.065} kind="box" at={sec(start)(19.8)} />
    </AbsoluteFill>
  );
};

/** Dusty road for the funeral caravan. */
export const Road: React.FC<{ mood?: "day" | "dusk"; children?: React.ReactNode }> = ({ mood = "day", children }) => (
  <Plains mood={mood} horizon={-40}>
    <Part shape={roundRect(5000, 220, 0)} color="#c9a274" flat outline={0} y={-470} z={-25} />
    {children}
  </Plains>
);

// 20.55 "They leave his body inside his carriage and keep bringing him meals, as if he's still alive."
export const MealsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const walk = ramp(t, 22.4, 24.6, (x) => x);
  const arm: [number, number] = [1.5, 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [0.6, 0.6] }}>
        <Road>
          <ImperialCarriage x={200} y={-470} s={1.0} horses={2} z={1} />
          <Character
            {...WORKER(3)}
            x={interpolate(walk, [0, 1], [-900, -20])}
            y={-560}
            s={1.1}
            z={3}
            look={0.5}
            expression={{ eyes: "happy", mouth: "smile" }}
            pose={walk < 1 ? { ...poses.walk(frame, 0.8), armF: arm, armB: arm } : { armF: arm, armB: arm }}
            holdF={
              <X rot={upright(arm)} y={10}>
                <Part shape={roundRect(180, 16, 6)} color="#5a3a26" shade={0.2} />
                <Part shape={blob([[-50, 8], [50, 8], [36, 50], [-36, 50]], 6)} color="#f4f1ea" shade={0.2} x={-40} z={0.01} />
                <Part shape={ellipse(30, 18)} color="#c8662f" shade={0.2} x={-40} y={52} z={0.02} />
                <Part shape={ellipse(34, 14)} color="#7a9a46" shade={0.2} x={50} y={24} z={0.02} />
              </X>
            }
          />
        </Road>
      </Stage>
      <Label text="AS IF ALIVE" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(24.3)} />
    </AbsoluteFill>
  );
};

// 25.45 "Officials keep handing in their reports, and someone hidden inside answers them."
export const ReportsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const sc = useScr();
  const t = absT(start, frame);
  const b = pop(t, 28.9);
  const arm: [number, number] = [1.6, 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.2), x: 120, y: -60 }} light={{ dir: [0.6, 0.6] }}>
        <Road>
          <ImperialCarriage x={420} y={-470} s={1.25} horses={0} z={1} />
          <Character {...OFFICIAL(2)} x={-260} y={-560} s={1.25} z={3} look={0.5} expression={{ eyes: "closed", mouth: "smile", brows: 0.2 }} pose={{ armF: arm, armB: [1.2, 1.6], lean: -0.15 }} holdF={<BambooSlips rot={upright(arm)} n={6} s={0.45} />} />
          <X x={360} y={-80} z={2}>
            <Glow rx={80} color="#ffcf7a" alpha={0.3} additive />
            <Part shape={circle(26)} color="#ffffff" flat outline={4} x={-30} />
          </X>
          <SpeechBubble x={540} y={300} w={480} h={200} tx={380} ty={-40} s={b} z={10} />
        </Road>
      </Stage>
      {b > 0 ? <Label text="VERY GOOD." {...sc(540, 300 + 30, 1.2, 120, -60)} size={0.05} color="#211b20" at={0} /> : null}
    </AbsoluteFill>
  );
};

/** Buzzing flies around a point. */
export const Flies: React.FC<{ x: number; y: number; n?: number; r?: number; z?: number }> = ({ x, y, n = 6, r = 120, z = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} z={z}>
      {Array.from({ length: n }, (_, i) => {
        const a = frame * (0.15 + i * 0.03) + i * 1.3;
        return (
          <X key={i} x={Math.cos(a) * r * (0.6 + (i % 3) * 0.2)} y={Math.sin(a * 1.3) * r * 0.5}>
            <Part shape={circle(7)} color="#211b20" flat outline={0} />
            <Part shape={ellipse(8, 5)} color="#dff2fa" flat outline={2} opacity={0.8} y={7} x={-4} rot={Math.sin(frame * 2 + i)} z={0.01} />
          </X>
        );
      })}
    </X>
  );
};

// 29.85 "But it's summer, and soon the carriage starts to smell."
export const SummerSmellShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pinch: [number, number] = [2.5, 2.0];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [0.3, 0.9] }}>
        <Road>
          <Glow x={-600} y={420} rx={500} color="#fff3b0" alpha={0.5} additive z={-20} />
          <Part shape={circle(110)} color="#ffe27a" flat outline={0} x={-600} y={420} z={-20} />
          <ImperialCarriage x={220} y={-470} s={1.0} horses={2} z={1} />
          <Flies x={220} y={-120} n={8} r={180} z={3} />
          {[0, 1, 2].map((i) => {
            const k = ((frame * 0.02 + i / 3) % 1);
            return (
              <Line key={i} pts={Array.from({ length: 8 }, (_, j) => [120 + i * 90 + Math.sin(j * 1.2 + frame * 0.1) * 16, 20 + k * 200 + j * 26] as [number, number])} smooth width={8} color="#7aa64a" opacity={1 - k} z={3} />
            );
          })}
          <Character {...OFFICIAL(1)} x={-560} y={-560} s={1.15} z={3} look={0.5} expression={{ eyes: "closed", mouth: "wavy", brows: 0.8 }} pose={{ armF: pinch, armB: [-0.3, -0.1], armsOverHead: true }} />
        </Road>
      </Stage>
    </AbsoluteFill>
  );
};

// 32.95 "So they load the carts around him with salted fish to cover it up."
export const FishCoverShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [0.6, 0.6] }}>
        <Road>
          <ImperialCarriage x={80} y={-430} s={0.85} horses={2} z={1} />
          <FishCart x={-620} y={-520} s={1.15} smell={0.6} z={2} />
          <FishCart x={480} y={-540} s={1.2} smell={0.6} seed={6} z={2.1} />
          <FishCart x={-60} y={-600} s={1.0} smell={0.4} seed={9} z={2.2} />
        </Road>
      </Stage>
      <Label text="SALTED FISH" x={0.5} y={0.12} size={0.07} kind="box" at={sec(start)(34.7)} />
    </AbsoluteFill>
  );
};

/** Imperial seal (square jade stamp). */
const Seal: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(90, 70, 8)} color="#4fa07a" shade={0.22} />
    <Part shape={blob([[-30, 30], [0, 70], [30, 30]], 6)} color="#4fa07a" shade={0.22} y={10} z={0.01} />
  </X>
);

// 36.75 "And on the way home, they fake a letter from the emperor."
export const FakeLetterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const down = interpolate(t, [38.3, 38.6, 38.9, 39.2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60, shake: hitAt(t, 38.6, 0.3) * 6 }} light={{ pos: [300, 100] }} vignette={0.7} vignetteColor="#04060c">
        <Tent dim={0.25}>
          <Character {...ZHAO_GAO} x={-380} y={-560} s={1.3} z={1} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.7 }} pose={{ ...poses.sit(frame), armF: [1.3 + Math.sin(frame * 0.4) * 0.1, 0.6] }} />
          <WritingDesk x={60} y={-560} z={2} />
          <BambooSlips x={-40} y={-330} n={8} s={0.5} rot={Math.PI / 2} z={2.1} />
          <Seal x={60} y={interpolate(down, [0, 1], [-120, -300])} s={1.0} z={2.2} />
          {t > 38.6 ? <Part shape={roundRect(60, 50, 4)} color="#c8262f" flat outline={3} x={60} y={-330} z={2.15} /> : null}
        </Tent>
      </Stage>
      <Label text="FAKE" x={0.66} y={0.2} size={0.08} kind="stamp" rotate={-8} at={sec(start)(38.7)} />
    </AbsoluteFill>
  );
};

/** Northern frontier: mountains with a section of rammed-earth wall. */
export const Frontier: React.FC<{ mood?: "day" | "dusk"; children?: React.ReactNode }> = ({ mood = "day", children }) => (
  <Plains mood={mood} horizon={-80}>
    <X y={-80} z={-26}>
      <Part shape={roundRect(5000, 120, 0)} color="#a8906a" shade={0.15} y={60} />
      {Array.from({ length: 30 }, (_, i) => (
        <Part key={i} shape={roundRect(60, 40, 2)} color="#a8906a" shade={0.15} x={-2400 + i * 160} y={140} z={0.001} />
      ))}
    </X>
    {children}
  </Plains>
);

// 40.2 "It orders his eldest son to kill himself."
export const FusuReadsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const shock = t > 42.0;
  const arm: [number, number] = [1.6, 0.6];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -40 }} light={{ dir: [0.6, 0.5] }}>
        <Frontier>
          <Character {...FUSU} x={-160} y={-560} s={1.35} z={2} look={0.5} expression={shock ? { eyes: "wide", mouth: "o", brows: 0.9, sweat: true } : { eyes: "open", mouth: "flat", brows: 0.2, gaze: [0.6, -0.6] }} pose={{ armF: arm, armB: arm }} holdF={<BambooSlips rot={upright(arm)} n={6} s={0.5} />} />
          <Character {...GUARD(2)} x={520} y={-560} s={1.1} z={1.5} facing={-1} look={0.4} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame)} holdF={<Spear rot={-0.1} />} />
        </Frontier>
      </Stage>
      <Label text="FUSU" sub="ELDEST SON" x={0.22} y={0.14} size={0.07} kind="title" at={sec(start)(40.6)} />
    </AbsoluteFill>
  );
};

// 42.95 "And he does."
export const HeDoesShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -40 }} light={{ dir: [0.6, 0.4] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.7}>
        <Frontier mood="dusk">
          <X x={-60} y={-470} rot={-0.08} z={2}>
            <Part shape={roundRect(400, 16, 6)} color="#d6dade" shade={0.15} />
            <Part shape={roundRect(70, 22, 6)} color="#2a2026" shade={0.2} x={-230} z={0.01} />
          </X>
          <BambooSlips x={300} y={-480} n={5} s={0.4} rot={1.5} z={2} />
          <Banner x={-560} y={-560} pole={520} color="#e8e2d4" z={1} />
        </Frontier>
      </Stage>
    </AbsoluteFill>
  );
};

// 44.55 "So a younger son, Huhai, becomes the Second Emperor."
export const HuhaiShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460}>
          <Character {...HUHAI} x={0} y={-292} s={1.0} z={2} look={0.1} expression={{ eyes: "half", mouth: "grin", brows: -0.4 }} pose={poses.sit(frame)} />
          <Character {...ZHAO_GAO} x={-560} y={-560} s={1.05} z={3} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.6 }} pose={poses.idle(frame)} />
        </ThroneHall>
      </Stage>
      <Label text="HUHAI" sub="THE SECOND EMPEROR" x={0.75} y={0.18} size={0.08} kind="title" at={sec(start)(45.9)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the funeral ─────────────────────────

// 48.55 "Now the funeral begins."
export const FuneralBeginsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 20 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="autumn" horizon={-100} mound="build" moundX={480} moundS={0.9}>
          {Array.from({ length: 6 }, (_, i) => (
            <Character
              key={i}
              {...(i % 2 ? OFFICIAL(i) : WORKER(i))}
              x={-900 + i * 200 + frame * 2}
              y={-520 - (i % 2) * 20}
              s={0.85}
              z={2 + (i % 2 ? -0.1 : 0) + i * 0.001}
              look={0.5}
              expression={{ eyes: "closed", mouth: "flat", brows: 0.4 }}
              pose={poses.walk(frame + i * 5, 0.5)}
            />
          ))}
          {[-700, -300, 100].map((x, i) => (
            <Banner key={x} x={x + frame * 2} y={-520} pole={540} color="#f4f1ea" seed={i} z={2.5} />
          ))}
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 50.25 "First, his son orders that the emperor's wives who have no children must die, too."
export const WivesOrderShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const scared = t > 53.6;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 20 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460}>
          <Character {...HUHAI} x={0} y={-292} s={0.95} z={2} look={0.3} talking={t > 51.0 && t < 54.0} expression={{ eyes: "half", mouth: "flat", brows: -0.5 }} pose={poses.point(frame)} />
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...WIFE(i)} x={-760 + i * 180} y={-600 + (i % 2) * 20} s={0.95} z={3 - (i % 2) * 0.1} look={0.5} expression={scared ? { eyes: "sad", mouth: "wavy", brows: 0.9, blush: true } : { eyes: "open", mouth: "o", brows: 0.6 }} pose={scared ? { armF: [1.0, 1.8], armB: [0.8, 1.8] } : poses.idle(frame, i)} />
          ))}
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 54.75 "Sima Qian says a great many of them die."
export const ManyDieShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ pos: [0, 200] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.75} vignetteColor="#04060c">
        <ThroneHall floorY={-460} throne={false} dim={0.45}>
          {Array.from({ length: 7 }, (_, i) => (
            <X key={i} x={-720 + i * 240} y={-520} z={2}>
              <Part shape={roundRect(150, 40, 14)} color="#5a2a3a" shade={0.2} y={20} />
              <X x={0} y={60}>
                <Part shape={roundRect(18, 70, 5)} color="#f4f1ea" shade={0.15} y={35} />
                <Flame y={76} size={0.18} seed={i} />
                <Glow y={78} rx={120} color="#ffb35a" alpha={0.4} additive />
              </X>
            </X>
          ))}
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 57.7 "Then, someone warns him about the workers."
export const WarnsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [0, 300] }} vignette={0.6}>
        <ThroneHall floorY={-760} throne={false} dim={0.2} />
        <Character {...HUHAI} x={300} y={-40 - 308 * s} s={s} z={2} facing={-1} look={0.4} expression={{ eyes: "wide", mouth: "o", brows: 0.4, gaze: [-0.8, 0] }} pose={poses.idle(frame)} />
        <Character {...ZHAO_GAO} x={-300} y={-60 - 308 * s} s={s} z={2.1} look={0.6} talking expression={{ eyes: "half", mouth: "smirk", brows: -0.5 }} pose={{ armF: [2.4, 2.2], armB: [-0.2, -0.1] }} />
      </Stage>
    </AbsoluteFill>
  );
};

// 60.45 "They could tell grave robbers everything."
export const GraveRobbersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ pos: [0, 200] }} vignette={0.7} vignetteColor="#04060c">
        <Plains mood="night" horizon={-60} mound="done" moundX={420} moundS={0.9}>
          <Character {...WORKER(0)} x={-480} y={-560} s={1.15} z={2} look={0.5} talking expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: [1.5, 0.3], armB: [-0.2, -0.1] }} holdF={<MapScroll open={1} w={200} rot={upright([1.5, 0.3])} s={0.5} />} />
          {[0, 1].map((i) => (
            <Character key={i} {...REBEL(i)} hatColor="#2a2226" x={-60 + i * 260} y={-560} s={1.1} z={2 - i * 0.01} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "grin", brows: -0.6 }} pose={i ? { armF: [2.4, 0.3], armB: [-0.2, -0.1] } : poses.think} holdF={i ? <X rot={upright([2.4, 0.3])}><Line pts={[[0, 0], [0, 140]]} width={10} color="#6e4a2c" /><Flame y={150} size={0.4} seed={4} /></X> : undefined} />
          ))}
        </Plains>
      </Stage>
      <Label text="GRAVE ROBBERS" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(61.2)} />
    </AbsoluteFill>
  );
};

// 62.65 "So, after the burial, while the workers are still deep inside, the inner gate shuts."
export const InnerGateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const drop = ramp(t, 66.6, 67.3, Easing.in(Easing.quad));
  const shut = t > 67.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20, shake: hitAt(t, 67.3, 0.6) * 14 }} light={{ pos: [-300, 300] }} vignette={0.7} vignetteColor="#04060c">
        <TombCorridor floorY={-460}>
          <StoneGate x={620} y={-460} w={460} h={620} drop={drop} z={1} />
          <TreasureChest x={-300} y={-480} w={240} z={2} />
          <JadeDisc x={-420} y={-290} r={30} z={2.1} />
          <Character {...WORKER(0)} x={-640} y={-580} s={1.1} z={3} look={0.5} expression={shut ? { eyes: "wide", mouth: "o", brows: 0.9, gaze: [1, 0] } : { eyes: "happy", mouth: "grin" }} pose={shut ? poses.scared(frame) : poses.armsUp(frame)} />
          <Character {...WORKER(1)} x={0} y={-580} s={1.1} z={3} look={0.5} expression={shut ? { eyes: "wide", mouth: "shout", brows: 0.9, gaze: [1, 0] } : { eyes: "happy", mouth: "grin" }} pose={shut ? poses.scared(frame + 4) : { armF: [2.6, 0.4], armB: [2.4, 0.4], armsOverHead: true }} />
          {shut ? <Smoke x={620} y={-460} w={500} h={300} alpha={0.5} seed={4} z={4} /> : null}
        </TombCorridor>
      </Stage>
      <Label text="BOOM" x={0.78} y={0.3} size={0.09} kind="stamp" rotate={-8} at={sec(start)(67.3)} />
    </AbsoluteFill>
  );
};

// 68.3 "Remember you, holding that lamp?"
export const RememberYouShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ pos: [0, 200] }} vignette={0.85} vignetteColor="#020306">
        <TombCorridor floorY={-460} torches={false} dark={0.55}>
          <You x={0} y={-580} s={1.3} z={3} facing={t > 69.4 ? -1 : 1} look={0.3} expression={{ eyes: "wide", mouth: "o", brows: 0.7 }} />
        </TombCorridor>
      </Stage>
    </AbsoluteFill>
  );
};

// 70.65 "That's the sound you hear."
export const SoundYouHearShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.4;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: 2 }} light={{ pos: [300, 100] }} vignette={0.85} vignetteColor="#020306">
        <TombCorridor floorY={-700} dark={0.55} torches={false} />
        <You x={-80} y={-40 - 308 * s} s={s} arm={[2.0, 0.9]} look={0.3} expression={{ eyes: "wide", mouth: "wavy", brows: 0.9, sweat: true }} />
        {[0, 1, 2].map((i) => {
          const k = ((frame * 0.03 + i / 3) % 1);
          return <Line key={i} pts={Array.from({ length: 13 }, (_, j) => [480 + k * 200 + Math.cos((j / 12) * 2.4 - 1.2) * (80 + k * 160), 120 + Math.sin((j / 12) * 2.4 - 1.2) * (80 + k * 160)] as [number, number])} smooth width={8} color="#f4f1ea" opacity={1 - k} z={5} />;
        })}
      </Stage>
    </AbsoluteFill>
  );
};

/** Tomb entrance ramp seen from outside. */
const TombEntrance: React.FC<{ drop: number }> = ({ drop }) => (
  <X>
    <Part shape={poly([[-900, -540], [900, -540], [520, 260], [-520, 260]])} color="#b8875a" shade={0.15} z={-1} />
    <StoneGate x={0} y={-160} w={520} h={420} drop={drop} />
  </X>
);

// 72.15 "Then, the outer gate drops …"
export const OuterGateShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const drop = ramp(t, 72.9, 73.5, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 40, shake: hitAt(t, 73.5, 0.5) * 12 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={260}>
          <TombEntrance drop={drop} />
          {t > 73.5 ? <Smoke x={0} y={-160} w={700} h={300} alpha={0.45} seed={2} z={3} /> : null}
          {[-640, 640].map((x, i) => (
            <Character key={x} {...GUARD(i)} x={x} y={-480} s={1.1} z={2} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: -0.3 }} pose={poses.idle(frame, i)} holdF={<Spear rot={-0.1} />} />
          ))}
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 74.05 "… and trees are planted on top, so it looks like an ordinary hill."
export const PlantTreesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const green = ramp(t, 74.6, 76.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 40 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-160}>
          <BurialMound y={-162} w={1300} h={480} stage="build" z={-28} />
          <X y={-162} sy={Math.max(0.001, green)} z={-27}>
            <BurialMound w={1360} h={500} stage="done" />
          </X>
          {[-460, -160, 160, 460].map((x, i) => (
            <RoundTree key={x} x={x} y={-162 + Math.sqrt(1 - Math.pow(x / 680, 2)) * 480 * green - 10} h={120} seed={i + 4} s={Math.max(0.001, pop(t, 74.7 + i * 0.2))} z={-26} />
          ))}
          {[-640, 640].map((x, i) => (
            <Character key={x} {...WORKER(i + 1)} x={x} y={-560} s={1.0} z={2} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "half", mouth: "flat" }} pose={{ armF: [0.9 + Math.sin(frame * 0.3 + i) * 0.25, 0.4], armB: [0.7, 0.5], lean: -0.1 }} holdF={<X rot={upright([0.9 + Math.sin(frame * 0.3 + i) * 0.25, 0.4]) - Math.PI / 2 + 0.2} s={0.6}><Shovel x={-120} /></X>} />
          ))}
        </Plains>
      </Stage>
      <Label text="AN ORDINARY HILL" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(76.4)} />
    </AbsoluteFill>
  );
};

// 77.45 "Not one of them gets out."
export const NotOneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const out = ramp(t, 78.2, 78.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60 }} light={{ pos: [0, 200] }} vignette={0.9} vignetteColor="#010203">
        <TombCorridor floorY={-460} torches={false} dark={0.45}>
          {[-420, 0, 420].map((x, i) => (
            <Character key={x} {...WORKER(i)} x={x} y={-580} s={1.15} z={3} look={0.3} expression={{ eyes: "half", mouth: "frown", brows: 0.8, sweat: i === 1 }} pose={{ ...poses.sit(frame + i * 9), headTilt: -0.15 }} />
          ))}
          <X x={0} y={-340} z={4}>
            <OilLamp lit={out < 0.95} s={1.2} />
          </X>
        </TombCorridor>
        <Wash width={4000} height={3000} color="#000000" alpha={out * 0.9} z={60} />
      </Stage>
    </AbsoluteFill>
  );
};

// 78.85 "And the empire that was supposed to last ten thousand generations?"
export const SupposedToLastShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.min(9, 1 + Math.floor(Math.max(0, t - 79.2) / 0.3));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.94) }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          {Array.from({ length: n }, (_, i) => {
            const k = Math.pow(0.78, i);
            return <Character key={i} {...(i === 0 ? EMPEROR : HUHAI)} x={-620 + (1 - k) * 1500} y={-560 + (1 - k) * 400} s={1.2 * k} z={10 - i} look={0.2} expression={{ eyes: "half", mouth: "smirk" }} pose={poses.handsOnHips} />;
          })}
        </ThroneHall>
      </Stage>
      <Label text="× 10,000?" x={0.8} y={0.16} size={0.08} kind="title" at={sec(start)(81.0)} />
    </AbsoluteFill>
  );
};

// 82.75 "Within four years, it's gone."
export const GoneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.95), shake: hitAt(t, 84.3, 0.5) * 8 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false} dim={ramp(t, 84.0, 85.0) * 0.5}>
          {Array.from({ length: 9 }, (_, i) => {
            const k = Math.pow(0.78, i);
            const fall = ramp(t, 83.6 + i * 0.08, 84.0 + i * 0.08, Easing.in(Easing.quad));
            return (
              <X key={i} x={-620 + (1 - k) * 1500} y={-560 + (1 - k) * 400} rot={-fall * 1.5} z={10 - i}>
                <Character {...(i === 0 ? EMPEROR : HUHAI)} s={1.2 * k} look={0.2} expression={fall > 0 ? { eyes: "dead", mouth: "o" } : { eyes: "half", mouth: "smirk" }} pose={poses.handsOnHips} />
              </X>
            );
          })}
        </ThroneHall>
      </Stage>
      <Label text="4 YEARS" x={0.5} y={0.14} size={0.09} kind="title" at={sec(start)(83.2)} />
      <Label text="GONE" x={0.5} y={0.36} size={0.12} kind="stamp" rotate={-8} at={sec(start)(84.4)} />
    </AbsoluteFill>
  );
};

