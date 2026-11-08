import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, Gradient, QuestionMark, Spear, roundRect, circle, ellipse, poly, blob, ramp, push, hitAt, absT, rng, mixHex, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MesoMap, mesoXY, MayaPyramid, MayaHut, Sunburst, Smoke, Flame, Caravel, TradeCanoe, CacaoBean, CacaoPod, Sea, Sky, Cloud, PalmTree, Rain, Ripples,
} from "../../kit/env";
import { ChocolateStick, CoffeeCup, Scroll, Plank } from "../../kit/props";
import { sec, pop, useScr, SpeechBubble } from "../../kit/shot";
import { JungleSet, PlazaSet, Village } from "./sets";
import {
  MAYA_KING, MAYA_COMMONER, MAYA_WOMAN, ITZA_WARRIOR, JAGUAR_WARRIOR, COLUMBUS, GUERRERO, GUERRERO_SAILOR, AGUILAR, CORTES, SPANISH_SOLDIER, MAYA_QUEEN,
} from "./cast";
import { upright, TemploMayor } from "./p1a";

// Second video, part B: Mayapán, the 1502 trading canoe, the 1511 shipwreck,
// Aguilar and Gonzalo Guerrero. Seconds on maya-2.voice.m4a.

type P = [number, number];

/** Beach: sea at the back, sand in front, palms. Waterline at `horizon`. */
const BeachSet: React.FC<{ horizon?: number; mood?: "day" | "storm" | "dusk"; children?: React.ReactNode }> = ({ horizon = -80, mood = "day", children }) => {
  const sky = mood === "storm" ? ["#4a5260", "#6a7480", "#8a929c"] : mood === "dusk" ? ["#e08a5a", "#f2b47a", "#f6d8a8"] : ["#6ab8e0", "#9ad0ea", "#d8eef2"];
  return (
    <>
      <X z={-41}>
        <Sky w={6000} h={3600} y={horizon + 1700} top={sky[0]} mid={sky[1]} bottom={sky[2]} />
        {mood !== "storm" ? <Cloud x={-700} y={horizon + 560} w={440} seed={4} /> : null}
      </X>
      <Sea w={6000} h={600} y={horizon + 300} color={mood === "storm" ? "#3a6a7a" : "#3aa0b8"} z={-38} />
      <Part shape={blob([[-3000, horizon], [-1000, horizon + 30], [1000, horizon - 10], [3000, horizon + 20], [3000, -3000], [-3000, -3000]], 6)} color="#ead8a8" flat outline={5} z={-30} />
      <Line pts={[[-3000, horizon - 30], [-1200, horizon - 10], [0, horizon - 36], [1400, horizon - 14], [3000, horizon - 30]]} smooth width={8} color="#ffffff" opacity={0.7} z={-29.9} />
      <PalmTree x={-1050} y={horizon - 100} h={760} lean={0.22} seed={2} z={-25} />
      <PalmTree x={1100} y={horizon - 140} h={680} lean={-0.2} seed={5} z={-25} />
      {children}
    </>
  );
};

/** Lightning bolt from the top; `k` 0..1 flash. */
const Bolt: React.FC<{ x: number; y: number; k: number; z?: number }> = ({ x, y, k, z = 0 }) =>
  k > 0 ? (
    <X x={x} y={y} z={z}>
      <Part shape={poly([[0, 0], [-60, -220], [10, -230], [-70, -480], [110, -180], [30, -170], [90, 0]])} color="#fff6c8" flat outline={4} opacity={k} />
      <Glow y={-200} rx={500} color="#fff6c8" alpha={0.5 * k} additive z={-0.01} />
    </X>
  ) : null;

// 105.7 "Later, a city called Mayapán rules the north."
export const MayapanShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-260} ground="#d8caa8">
          <MayaPyramid x={0} y={-260} s={0.8} w={900} h={380} tiers={9} top={0.32} templeW={220} templeH={130} doors={3} color="#d8caa8" serpents z={-24} />
          {[-760, -520, 520, 780].map((x, i) => (
            <MayaHut key={x} x={x} y={-280} w={220} z={-23 + i * 0.01} />
          ))}
          <X y={-420} z={-10}>
            <Part shape={roundRect(3200, 90, 8)} color="#cbbf9e" shade={0.24} y={45} />
            {Array.from({ length: 22 }, (_, i) => (
              <Line key={i} pts={[[-1600 + i * 150, 10], [-1560 + i * 150, 80]]} width={3} color="#a89c7c" z={0.001} />
            ))}
          </X>
        </JungleSet>
      </Stage>
      <Label text="MAYAPÁN" x={0.5} y={0.1} size={0.08} kind="title" at={sec(start)(107.15)} />
      <Label text="RULES THE NORTH" x={0.5} y={0.21} size={0.045} kind="box" at={sec(start)(107.9)} />
      <Label text="CITY WALL" x={0.85} y={0.8} size={0.035} kind="box" at={sec(start)(106.4)} />
    </AbsoluteFill>
  );
};

// 108.9 "But in the 1400s, its own leading families tear it apart."
export const FamiliesTearShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 111.6, 112.6);
  const swing = Math.sin(frame * 0.35);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -80, shake: hitAt(t, 111.8, 0.3) * 6 }} light={{ dir: [0.5, 0.5] }} vignette={0.65} vignetteColor="#1a0a0a">
        <PlazaSet mood="dusk" horizon={-240}>
          {burn > 0 ? (
            <X z={-20}>
              <Flame x={-420} y={-60} size={2.2 * burn} seed={3} />
              <Flame x={560} y={-120} size={1.8 * burn} seed={5} />
              <Smoke x={-420} y={100} w={300} h={900} alpha={0.45 * burn} seed={4} />
              <Glow x={0} y={0} rx={1400} ry={600} color="#ff8a3a" alpha={0.3 * burn} additive />
            </X>
          ) : null}
          <Character {...MAYA_KING(0)} x={-360} y={-860} s={1.8} z={2} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ ...poses.idle(frame), armF: [1.3 + swing * 0.25, 0.3] }} holdF={<Spear rot={upright([1.3 + swing * 0.25, 0.3]) - 1.57} length={420} tip="#2a2228" />} />
          <Character {...MAYA_KING(2)} x={380} y={-860} s={1.8} z={2} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "teeth", brows: -0.9 }} pose={{ ...poses.idle(frame, 3), armF: [1.3 - swing * 0.25, 0.3] }} holdF={<Spear rot={upright([1.3 - swing * 0.25, 0.3]) - 1.57} length={420} tip="#2a2228" />} />
        </PlazaSet>
      </Stage>
      <Label text="1400s" x={0.5} y={0.1} size={0.07} kind="box" at={sec(start)(109.4)} />
      <Label text="COCOM" x={0.22} y={0.24} size={0.045} kind="box" at={sec(start)(110.7)} />
      <Label text="XIU" x={0.78} y={0.24} size={0.045} kind="box" at={sec(start)(111.0)} />
    </AbsoluteFill>
  );
};

/** The northern Maya provinces after Mayapán fell (approximate centres). */
const PROVINCES: [string, number, number][] = [
  ["Ah Canul", -90.3, 20.6], ["Chakan", -89.6, 20.95], ["Ceh Pech", -89.25, 21.15], ["Ah Kin Chel", -88.85, 21.1], ["Chikinchel", -88.0, 21.25], ["Ecab", -87.3, 21.1],
  ["Cupul", -88.3, 20.75], ["Tases", -87.75, 20.55], ["Sotuta", -88.9, 20.55], ["Hocaba", -89.2, 20.75], ["Mani", -89.6, 20.25], ["Can Pech", -90.35, 19.8],
  ["Champoton", -90.65, 19.25], ["Cochuah", -88.3, 19.8], ["Uaymil", -88.15, 19.05], ["Chetumal", -88.35, 18.45],
];
const PCOL = ["#c0392b", "#3a9ac9", "#d9a441", "#8a5aa8", "#3fa07a", "#e07a3a", "#2f6fa8", "#b8643a"];

// 112.85 "The north breaks into more than a dozen small kingdoms."
export const NorthBreaksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 150;
  const center: [number, number] = [-88.9, 20.0];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} pins={["mayapan"]} />
        {PROVINCES.map(([name, lo, la], i) => {
          const [x, y] = mesoXY(lo, la, ppd, center);
          const k = ramp(t, 113.4 + i * 0.1, 113.7 + i * 0.1, Easing.out(Easing.back(2)));
          return k > 0 ? (
            <X key={name} x={x} y={y} s={k} z={1 + i * 0.001}>
              <Part shape={circle(30)} color={PCOL[i % PCOL.length]} flat outline={4} />
              <Part shape={poly([[-20, 24], [20, 24], [24, 50], [10, 38], [0, 56], [-10, 38], [-24, 50]])} color="#f2c84a" flat outline={3} z={0.001} />
            </X>
          ) : null;
        })}
      </Stage>
      <Label text="16 SMALL KINGDOMS" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(114.5)} />
    </AbsoluteFill>
  );
};

/** Spyglass held in the hand (points along +x of the hand). */
const Spyglass: React.FC<{ rot?: number }> = ({ rot = 0 }) => (
  <X rot={rot}>
    <Part shape={roundRect(34, 170, 8)} color="#a8823a" shade={0.28} y={60} />
    <Part shape={roundRect(42, 30, 8)} color="#5a3a26" flat outline={3} y={150} z={0.001} />
  </X>
);

// 116.25 "In 1502 on his last voyage, Christopher Columbus"
export const Columbus1502Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const roll = Math.sin(frame * 0.05) * 0.02;
  const arm: [number, number] = [2.2, 0.9];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60, rot: roll }} light={{ dir: [-0.5, 0.6] }} vignette={0.6} bgBlur={5}
        bg={
          <>
            <Sky w={6000} h={3600} y={1800} top="#6ab8e0" mid="#9ad0ea" bottom="#d8eef2" z={-41} />
            <Cloud x={-600} y={520} w={480} seed={3} z={-40} />
            <Sea w={6000} h={2000} y={100} color="#3a90b0" z={-38} />
            <Caravel x={-700} y={120} s={0.35} z={-30} />
          </>
        }
      >
        <X z={0}>
          <Part shape={roundRect(3000, 260, 0)} color="#6e4a2c" shade={0.24} y={-560} />
          <Line pts={[[-1500, -430], [1500, -430]]} width={16} color="#4a3220" z={0.001} />
          {Array.from({ length: 12 }, (_, i) => (
            <Line key={i} pts={[[-1400 + i * 260, -430], [-1400 + i * 260, -680]]} width={10} color="#5a3a26" z={0.001} />
          ))}
        </X>
        <Character {...COLUMBUS} x={-120} y={-900} s={2.0} z={-0.5} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.2 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<Spyglass rot={upright(arm) - 1.5} />} />
      </DepthStage>
      <Label text="1502" x={0.17} y={0.1} size={0.07} kind="box" at={sec(start)(116.5)} />
      <Label text="CHRISTOPHER COLUMBUS" sub="HIS LAST VOYAGE" x={0.7} y={0.1} size={0.045} kind="box" at={sec(start)(117.6)} />
    </AbsoluteFill>
  );
};

// 119.2 "meets a big Maya trading canoe off Honduras."
export const TradeCanoeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const x = interpolate(t, [119.2, 122.3], [-300, 120]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.5, 0.6] }} vignette={0.55}>
        <Sky w={6000} h={3600} y={1800} top="#6ab8e0" mid="#9ad0ea" bottom="#d8eef2" z={-41} />
        <Cloud x={500} y={520} w={440} seed={6} z={-40} />
        <Sea w={6000} h={2000} y={160} color="#3a90b0" z={-38} />
        <Caravel x={680} y={170} s={0.45} sx={-1} z={-30} />
        <TradeCanoe x={x} y={-240} len={1500} paddlers={8} z={1} />
        <Ripples x={x} y={-250} r={700} z={0.9} />
      </Stage>
      <Label text="MAYA TRADING CANOE" x={0.3} y={0.1} size={0.05} kind="box" at={sec(start)(120.4)} />
      <Label text="OFF HONDURAS" x={0.75} y={0.9} size={0.04} kind="box" at={sec(start)(121.3)} />
    </AbsoluteFill>
  );
};

// 122.25 "On board are goods to sell, including cacao beans."
export const CargoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const r = rng(9);
  const beans = Array.from({ length: 26 }, () => [(r() - 0.5) * 300, r() * 90, r() * 6] as [number, number, number]);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: -40 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6} bgBlur={6}
        bg={<><Sky w={6000} h={3600} y={1800} top="#6ab8e0" mid="#9ad0ea" bottom="#d8eef2" z={-41} /><Sea w={6000} h={2000} y={60} color="#3a90b0" z={-38} /></>}
      >
        <X y={-520} z={1}>
          <Part shape={roundRect(2600, 220, 40)} color="#7a4e2c" shade={0.26} y={-60} />
          <Line pts={[[-1300, 30], [1300, 30]]} width={8} color="#c0392b" z={0.001} />
          {[[-620, "#f1ead8", 220], [-420, "#3a9ac9", 180], [520, "#c0392b", 200]].map(([x, c, h], i) => (
            <Part key={i} shape={roundRect(180, h as number, 30)} color={c as string} shade={0.22} x={x as number} y={30 + (h as number) / 2} z={0.01 + i * 0.001} />
          ))}
          <X x={-130} y={40} z={0.02}>
            <Part shape={blob([[-180, 0], [180, 0], [210, 120], [150, 170], [-150, 170], [-210, 120]], 8)} color="#c8a25a" shade={0.24} />
            {beans.map(([bx, by, br], i) => (
              <CacaoBean key={i} x={bx} y={150 + by * 0.4} rot={br} size={46} z={0.001 + i * 0.0001} />
            ))}
          </X>
          <CacaoPod x={230} y={160} len={240} rot={0.4} z={0.03} />
          <CacaoPod x={340} y={140} len={220} rot={-0.3} color="#c8502a" z={0.031} />
          <X x={760} y={40} z={0.02}>
            {[0, 1, 2].map((k) => (
              <X key={k} x={k * 70} rot={0.2} z={k * 0.001}>
                <Line pts={[[0, 0], [0, 200]]} width={14} color="#6e4a2c" />
                <Part shape={poly([[-10, 170], [60, 190], [70, 240], [-10, 230]])} color="#c87a4a" shade={0.3} z={0.001} />
              </X>
            ))}
          </X>
        </X>
      </DepthStage>
      <Label text="GOODS TO SELL" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(122.9)} />
      <Label text="CACAO BEANS" x={0.42} y={0.36} size={0.06} kind="box" at={sec(start)(124.5)} />
      <Label text="COPPER AXES" x={0.84} y={0.36} size={0.035} kind="box" at={sec(start)(123.5)} />
      <Label text="COTTON" x={0.14} y={0.36} size={0.035} kind="box" at={sec(start)(123.3)} />
    </AbsoluteFill>
  );
};

// 125.55 "Columbus thinks they're almonds."
export const AlmondsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arm: [number, number] = [1.5, 1.0];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6} bgBlur={6}
        bg={<><Sky w={6000} h={3600} y={1600} top="#6ab8e0" mid="#9ad0ea" bottom="#d8eef2" z={-41} /><Sea w={6000} h={2000} y={-100} color="#3a90b0" z={-38} /></>}
      >
        <Character {...COLUMBUS} x={-380} y={-900} s={2.0} z={1} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: 0.2, gaze: [0.7, 0.2] }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<CacaoBean size={60} y={20} />} />
        <SpeechBubble x={360} y={160} w={460} h={320} tx={0} ty={-120} s={pop(t, 126.0)} z={2} />
        {t > 126.05 ? (
          <X x={360} y={170} s={pop(t, 126.2)} z={2.1}>
            <CacaoBean almond size={110} x={-80} rot={0.3} />
            <CacaoBean almond size={100} x={80} rot={-0.4} />
          </X>
        ) : null}
      </DepthStage>
      <Label text="ALMONDS?" x={0.69} y={0.12} size={0.06} kind="box" at={sec(start)(126.6)} />
    </AbsoluteFill>
  );
};

// 127.4 "He has no idea he's looking at chocolate."
export const ChocolateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [-0.5, 0.6] }} vignette={0.55}>
        <Gradient w={6000} h={4000} stops={[[0, "#8a5a3a"], [1, "#4a2a1a"]]} z={-41} />
        <Sunburst r={2400} rays={20} color="#9a6a42" alt="#8a5a3a" speed={0.5} z={-40} />
        <Character {...COLUMBUS} x={-520} y={-900} s={1.75} z={1} look={0.5} expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }} pose={poses.shrug(t - 127.6)} />
        <X x={330} y={-120} s={pop(t, 128.9)} z={2}>
          <CoffeeCup x={-170} y={-140} s={1.6} />
          <ChocolateStick x={170} y={60} rot={0.5} s={1.0} />
        </X>
        <CacaoBean x={330} y={260} size={110} s={1 - ramp(t, 128.8, 129.0)} z={2} />
      </Stage>
      <Label text="CHOCOLATE!" x={0.66} y={0.12} size={0.075} kind="title" at={sec(start)(129.1)} />
    </AbsoluteFill>
  );
};

// 130.3 "Then, in 1511, a Spanish ship sinks off the coast of the Yucatán."
export const Shipwreck1511Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sink = ramp(t, 133.3, 135.4, Easing.in(Easing.quad));
  const bolt = hitAt(t, 132.9, 0.35) + hitAt(t, 134.6, 0.3);
  const heave = Math.sin(frame * 0.09) * 30;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40, shake: bolt * 5 }} light={{ dir: [0.5, 0.6] }} vignette={0.75} vignetteColor="#0a1018">
        <Sky w={6000} h={3600} y={1500} top="#2a3240" mid="#4a5260" bottom="#6a7480" z={-41} />
        {[-700, 0, 700].map((x, i) => (
          <Cloud key={x} x={x} y={460 + (i % 2) * 70} w={700} seed={i + 21} color="#4a525e" shadow="#323842" z={-40} />
        ))}
        <Bolt x={620} y={520} k={Math.min(1, bolt)} z={-39} />
        <Caravel x={-40} y={-160 + heave} s={0.85} rot={Math.sin(frame * 0.07) * 0.06} sink={sink} broken={t > 133.0} z={-20} />
        <Sea w={6000} h={1400} y={-160} color="#2f5a6a" z={-10} />
        {[-900, -300, 300, 900].map((x, i) => (
          <Part key={x} shape={blob([[x - 240, -150], [x - 80, -40 + Math.sin(frame * 0.1 + i) * 30], [x + 60, -60], [x + 240, -150]], 8)} color="#3a7080" flat outline={5} z={-9} />
        ))}
        <Rain y={200} w={2600} h={1400} n={120} color="#c8d8e8" z={5} />
        <Wash width={6000} height={4000} color="#ffffff" alpha={0.35 * Math.min(1, bolt)} z={20} />
      </Stage>
      <Label text="1511" x={0.17} y={0.1} size={0.07} kind="box" at={sec(start)(131.2)} />
      <Label text="SHIPWRECK" x={0.75} y={0.12} size={0.06} kind="box" at={sec(start)(133.5)} />
    </AbsoluteFill>
  );
};

/** A survivor lying on the sand (rotated character). */
const Lying: React.FC<{ design: React.ComponentProps<typeof Character>; x: number; y: number; s: number; z?: number; dir?: 1 | -1; lift?: number }> = ({ design, x, y, s, z = 0, dir = 1, lift = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} rot={dir * (Math.PI / 2 - lift * 1.2)} z={z}>
      <Character {...design} s={s} look={0.5} pose={{ ...poses.idle(frame), armF: [2.6, 0.2], armB: [2.4, 0.3] }} shadow={false} />
    </X>
  );
};

// 135.5 "A few survivors wash ashore,"
export const WashAshoreShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.16), y: -160 }} light={{ dir: [0.5, 0.6] }} vignette={0.65}>
        <BeachSet horizon={-60} mood="dusk">
          <Lying design={{ ...GUERRERO_SAILOR }} x={-560} y={-380} s={1.1} z={2} dir={-1} lift={ramp(t, 136.4, 137.2) * 0.3} />
          <Lying design={{ ...AGUILAR }} x={180} y={-470} s={1.15} z={2.1} dir={1} />
          <Lying design={{ ...SPANISH_SOLDIER(1), hat: null }} x={760} y={-330} s={0.9} z={1.9} dir={-1} />
          <Plank x={-120} y={-250} w={300} rot={0.2} z={1.5} />
          <Plank x={460} y={-200} w={220} rot={-0.4} z={1.5} />
        </BeachSet>
      </Stage>
      <Label text="A FEW SURVIVORS" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(135.9)} />
    </AbsoluteFill>
  );
};

// 137.4 "and the Maya capture them."
export const CapturedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const step = ramp(t, 137.4, 138.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.16), y: -100 }} light={{ dir: [0.5, 0.6] }} vignette={0.65}>
        <BeachSet horizon={-40} mood="dusk">
          <Character {...GUERRERO_SAILOR} x={-60} y={-760} s={1.5} z={2} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.8, sweat: true }} pose={poses.armsUp(frame)} />
          <Character {...AGUILAR} x={-380} y={-800} s={1.45} z={2.1} facing={1} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.9 }} pose={poses.armsUp(frame + 4)} />
          {[0, 1, 2].map((i) => {
            const arm: [number, number] = [1.6, 0.2];
            return (
              <Character key={i} {...ITZA_WARRIOR(i + 1)} x={900 - i * 180 - step * 160} y={-720 - i * 40} s={1.35 - i * 0.08} z={1.9 - i * 0.1} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "flat", brows: -0.7 }} pose={{ ...poses.idle(frame, i), armF: arm }} holdF={<Spear rot={upright(arm) - 0.35} length={620} tip="#2a2228" />} />
            );
          })}
        </BeachSet>
      </Stage>
      <Label text="CAPTURED" x={0.3} y={0.12} size={0.065} kind="box" at={sec(start)(138.1)} />
    </AbsoluteFill>
  );
};

// 138.95 "Most of them die."
export const MostDieShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const designs = [SPANISH_SOLDIER(0), AGUILAR, SPANISH_SOLDIER(2), SPANISH_SOLDIER(1), GUERRERO_SAILOR, SPANISH_SOLDIER(3)];
  const keep = new Set([1, 4]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ dir: [0.5, 0.6] }} vignette={0.8} vignetteColor="#0a0a10">
        <Gradient w={6000} h={4000} stops={[[0, "#2a2430"], [1, "#141018"]]} z={-41} />
        {designs.map((d, i) => {
          const gone = keep.has(i) ? 0 : ramp(t, 139.3 + i * 0.07, 139.7 + i * 0.07);
          return (
            <X key={i} z={1 + i * 0.01}>
              <Character {...d} hat={keep.has(i) ? d.hat : null} x={-750 + i * 300} y={-640} s={1.05} look={0.5} expression={{ eyes: "half", mouth: "frown", brows: 0.7 }} pose={poses.idle(frame, i)} />
              {gone > 0 ? <Wash width={5000} height={4000} color="#141018" alpha={0} /> : null}
              {gone > 0 ? <Part shape={roundRect(280, 900, 40)} color="#1a1520" flat outline={0} opacity={gone} x={-750 + i * 300} y={-180} z={0.5} /> : null}
            </X>
          );
        })}
      </Stage>
      <Label text="MOST DIE" x={0.5} y={0.12} size={0.065} kind="box" at={sec(start)(139.6)} />
    </AbsoluteFill>
  );
};

// 140.2 "But two survive for years."
export const TwoSurviveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6} bgBlur={6} bg={<Village mood="day" horizon={-240} />}>
        <Character {...AGUILAR} x={-330} y={-880} s={1.8} z={2} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.4, eyebags: true }} pose={{ ...poses.idle(frame), armF: [0.5, 1.6] }} holdF={<Part shape={roundRect(120, 70, 20)} color="#c8a25a" shade={0.24} y={30} />} />
        <Character {...GUERRERO_SAILOR} x={340} y={-880} s={1.8} z={2.1} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: -0.1 }} pose={{ ...poses.idle(frame, 3), armF: [1.2, 0.8] }} holdF={<Part shape={roundRect(160, 40, 10)} color="#8a5a32" shade={0.24} rot={0.3} />} />
      </DepthStage>
      <Label text="2 SURVIVE" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(140.5)} />
      <Label text="FOR YEARS" x={0.5} y={0.21} size={0.045} kind="box" at={sec(start)(141.3)} />
    </AbsoluteFill>
  );
};

// 142.05 "A priest named Gerónimo de Aguilar,"
export const AguilarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [0.9, 1.7];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -120 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65} bgBlur={7} bg={<Village mood="day" horizon={-200} />}>
        <Character {...AGUILAR} x={-200} y={-960} s={2.2} z={2} look={0.5} expression={{ eyes: "closed", mouth: "flat", brows: 0.3 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<X><Line pts={[[0, -10], [0, 70]]} width={8} color="#5a3a26" /><Line pts={[[-24, 44], [24, 44]]} width={8} color="#5a3a26" /></X>} />
      </DepthStage>
      <Label text="GERÓNIMO DE AGUILAR" sub="PRIEST" x={0.7} y={0.16} size={0.05} kind="box" at={sec(start)(143.2)} />
    </AbsoluteFill>
  );
};

// 144.7 "and a sailor named Gonzalo Guerrero."
export const GuerreroSailorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -120 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65} bgBlur={7} bg={<Village mood="day" horizon={-200} />}>
        <Character {...GUERRERO_SAILOR} x={220} y={-960} s={2.2} z={2} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smirk", brows: -0.3 }} pose={poses.handsOnHips} />
      </DepthStage>
      <Label text="GONZALO GUERRERO" sub="SAILOR" x={0.3} y={0.16} size={0.05} kind="box" at={sec(start)(146.0)} />
    </AbsoluteFill>
  );
};

// 147.7 "Guerrero does something nobody expects."
export const NobodyExpectsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65} bgBlur={6} bg={<Village mood="dusk" horizon={-240} />}>
        <Character {...GUERRERO_SAILOR} x={-300} y={-880} s={1.85} z={2} look={0.5} expression={{ eyes: "happy", mouth: "grin", brows: -0.4 }} pose={poses.think} />
        <Character {...AGUILAR} x={380} y={-880} s={1.8} z={1.9} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.9 }} pose={poses.scared(frame)} />
        <QuestionMark x={380} y={260} s={0.7 * pop(t, 148.8)} rot={-0.1} z={3} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 149.95 "He becomes Maya."
export const BecomesMayaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const flip = t > 150.45;
  const flash = hitAt(t, 150.42, 0.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: -80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <Village mood="day" horizon={-240}>
          <Sunburst y={-60} r={2400} rays={20} color="#f6d890" alt="#f0cc7a" speed={0.6} z={-29} />
          <Character {...(flip ? GUERRERO : GUERRERO_SAILOR)} x={0} y={-900} s={2.0} z={2} look={0.45} expression={flip ? { eyes: "happy", mouth: "grin", brows: -0.3 } : { eyes: "open", mouth: "smile" }} pose={flip ? poses.armsUp(frame) : poses.idle(frame)} />
          <Wash width={6000} height={4000} color="#ffffff" alpha={0.8 * flash} z={30} />
        </Village>
      </Stage>
      <Label text="HE BECOMES MAYA" x={0.5} y={0.1} size={0.07} kind="title" at={sec(start)(150.5)} />
    </AbsoluteFill>
  );
};

/** Guerrero's Maya wife (daughter of a lord). */
const WIFE = { ...MAYA_QUEEN(0), hat: null, seed: 760 } as const;
const KIDS = [MAYA_COMMONER(7), MAYA_WOMAN(4), MAYA_COMMONER(8)];

// 151.2 "He marries the daughter of a Maya lord and has three children."
export const MarriesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <Village mood="day" horizon={-240}>
          <Character {...MAYA_KING(2)} x={-760} y={-640} s={1.2} z={1.5} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.armsUp(frame)} />
          <Character {...GUERRERO} x={-260} y={-780} s={1.55} z={2} look={0.5} expression={{ eyes: "happy", mouth: "smile", brows: -0.2 }} pose={{ ...poses.idle(frame), armF: [0.9, 0.3] }} />
          <Character {...WIFE} x={150} y={-790} s={1.5} z={2.1} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile", blush: true }} pose={{ ...poses.idle(frame, 2), armF: [0.9, 0.3] }} />
          {KIDS.map((d, i) => (
            <Character key={i} {...d} x={460 + i * 190} y={-760 - (i % 2) * 20} s={0.8 * pop(t, 153.45 + i * 0.12)} z={2.2 + i * 0.01} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.idle(frame, i + 4)} />
          ))}
        </Village>
      </Stage>
      <Label text="DAUGHTER OF A MAYA LORD" x={0.3} y={0.1} size={0.045} kind="box" at={sec(start)(152.0)} />
      <Label text="3 CHILDREN" x={0.78} y={0.1} size={0.055} kind="box" at={sec(start)(153.7)} />
    </AbsoluteFill>
  );
};

// 154.4 "He tattoos his face, pierces his ears, and becomes a war captain."
export const TattooShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const out = ramp(t, 157.1, 157.9, Easing.inOut(Easing.cubic));
  const arm: [number, number] = [1.6, 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: interpolate(out, [0, 1], [2.6, 1.05]), x: interpolate(out, [0, 1], [-20, 0]), y: interpolate(out, [0, 1], [-330, -60]) }} light={{ dir: [-0.5, 0.6] }} vignette={0.65}>
        <JungleSet mood="day" horizon={-240}>
          <Character
            {...GUERRERO}
            hat={out > 0.3 ? "plume" : null}
            marks={t > 155.1 ? "tattoo" : null}
            earspool={t > 156.3 ? GUERRERO.earspool : null}
            x={0}
            y={-940}
            s={2.0}
            z={2}
            look={0.5}
            expression={out > 0.5 ? { eyes: "angry", mouth: "shout", brows: -0.8 } : { eyes: "half", mouth: "flat", brows: -0.2 }}
            pose={out > 0.5 ? { ...poses.idle(frame), armF: arm } : poses.idle(frame)}
            holdF={out > 0.5 ? <Spear rot={upright(arm)} length={820} tip="#2a2228" /> : null}
          />
          {out > 0.5
            ? [0, 1, 2, 3].map((i) => (
                <Character key={i} {...ITZA_WARRIOR(i + 1)} x={(i < 2 ? -1 : 1) * (560 + (i % 2) * 260)} y={-720 - (i % 2) * 40} s={1.1} z={1.5 - (i % 2) * 0.1} facing={i < 2 ? 1 : -1} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.7 }} pose={poses.armsUp(frame + i * 5)} />
              ))
            : null}
          <Glow x={0} y={-330} rx={240} color="#fff2c6" alpha={0.4 * (hitAt(t, 155.15, 0.4) + hitAt(t, 156.35, 0.4))} additive z={3} />
        </JungleSet>
      </Stage>
      <Label text="TATTOOED FACE" x={0.22} y={0.14} size={0.045} kind="box" at={sec(start)(155.2)} until={sec(start)(157.1)} />
      <Label text="PIERCED EARS" x={0.78} y={0.14} size={0.045} kind="box" at={sec(start)(156.4)} until={sec(start)(157.1)} />
      <Label text="WAR CAPTAIN" x={0.5} y={0.1} size={0.07} kind="title" at={sec(start)(157.8)} />
    </AbsoluteFill>
  );
};

// 159.0 "In 1519, Hernán Cortés lands nearby and sends for the two Spaniards."
export const Cortes1519Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hand = ramp(t, 162.6, 163.2);
  const arm: [number, number] = [1.3 + hand * 0.2, 0.4];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [0.5, 0.6] }} vignette={0.6}>
        <BeachSet horizon={-80} mood="day">
          <Caravel x={-500} y={60} s={0.4} z={-37} />
          <Caravel x={300} y={80} s={0.32} z={-37.5} />
          <Caravel x={900} y={70} s={0.36} sx={-1} z={-37.2} />
          <Character {...CORTES} x={-300} y={-760} s={1.6} z={2} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.5 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={hand > 0 && hand < 1 ? <Scroll open={1} w={130} rot={0.3} /> : null} />
          {[0, 1].map((i) => (
            <Character key={i} {...SPANISH_SOLDIER(i)} x={-760 - i * 200} y={-700 - i * 30} s={1.3} z={1.8 - i * 0.1} look={0.4} expression={{ eyes: "half", mouth: "flat" }} pose={{ ...poses.idle(frame, i), armF: [0.4, 0.4] }} holdF={<Spear rot={upright([0.4, 0.4])} length={680} tip="#c9ced6" />} />
          ))}
          <Character {...MAYA_COMMONER(2)} x={300 - hand * 40} y={-760} s={1.4} z={2.1} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.3 }} pose={{ ...poses.idle(frame, 2), armF: [1.3 * hand, 0.4] }} holdF={hand >= 1 ? <Scroll open={0.3} w={120} rot={0.3} /> : null} />
        </BeachSet>
      </Stage>
      <Label text="1519" x={0.15} y={0.1} size={0.07} kind="box" at={sec(start)(159.5)} />
      <Label text="HERNÁN CORTÉS" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(160.8)} />
      <Label text="COZUMEL" x={0.85} y={0.1} size={0.04} kind="box" at={sec(start)(161.6)} />
    </AbsoluteFill>
  );
};

// 164.55 "Aguilar comes running."
export const AguilarRunsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cx = frame * 22;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, x: cx, y: -120 }} light={{ dir: [0.5, 0.6] }} vignette={0.6}>
        <BeachSet horizon={-80} mood="day">
          <Character {...AGUILAR} x={cx - 100} y={-760} s={1.6} z={2} look={0.5} expression={{ eyes: "happy", mouth: "shout", brows: 0.4, sweat: true }} pose={{ ...poses.run(frame * 1.3), lean: -0.25 }} />
          {[0, 1, 2].map((i) => (
            <Line key={i} pts={[[cx - 520 - i * 40, -360 + i * 110], [cx - 300 - i * 40, -360 + i * 110]]} width={8} color="#ffffff" opacity={0.7} z={3} />
          ))}
        </BeachSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 166.05 "He becomes Cortés's translator, and helps him conquer the Aztecs."
export const TranslatorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const az = ramp(t, 168.4, 169.0);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6} bgBlur={4}
        bg={
          <JungleSet mood={az > 0.5 ? "dusk" : "day"} horizon={-300} jungle={false} ground="#c9b48a">
            <TemploMayor y={-300} s={0.75} z={-20} fall={ramp(t, 169.2, 169.6, Easing.out(Easing.back(2)))} />
          </JungleSet>
        }
      >
        <Character {...CORTES} x={-520} y={-880} s={1.75} z={2} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.4 }} pose={poses.handsOnHips} />
        <Character {...AGUILAR} outfit={{ ...AGUILAR.outfit, patches: null }} x={60} y={-900} s={1.75} z={2.1} look={0.5} talking={t < 168.0} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={poses.point(frame)} />
        <SpeechBubble x={520} y={240} w={380} h={200} tx={200} ty={-80} s={pop(t, 166.9)} z={3} />
      </DepthStage>
      <Label text="TRANSLATOR" x={0.775} y={0.215} size={0.04} kind="tag" color="#2a2026" at={sec(start)(167.2)} />
      <Label text="CONQUEST OF THE AZTECS" x={0.5} y={0.1} size={0.045} kind="box" at={sec(start)(168.8)} />
    </AbsoluteFill>
  );
};

// 170.15 "But Guerrero says no."
export const SaysNoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const shake = Math.sin(frame * 0.6) * 0.3 * ramp(t, 170.9, 171.2);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.15, 1.22), y: -160 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65} bgBlur={7} bg={<Village mood="day" horizon={-200} />}>
        <Character {...GUERRERO} x={0} y={-960} s={2.2} z={2} look={0.5 + shake} expression={{ eyes: "half", mouth: "flat", brows: -0.6 }} pose={{ ...poses.handsOnHips, headTilt: shake * 0.2 }} />
      </DepthStage>
      <Label text="NO." x={0.78} y={0.2} size={0.12} kind="stamp" rotate={-8} at={sec(start)(171.3)} />
    </AbsoluteFill>
  );
};

// 171.8 "'Brother Aguilar,' he says, 'I am married and have three children.'"
export const BrotherAguilarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <Village mood="day" horizon={-240}>
          <Character {...AGUILAR} x={-700} y={-780} s={1.5} z={2} look={0.5} expression={{ eyes: "sad", mouth: "o", brows: 0.8 }} pose={poses.idle(frame)} />
          <Character {...GUERRERO} x={-120} y={-780} s={1.55} z={2.1} facing={-1} look={0.5} talking={t > 172.0 && t < 175.4} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={{ ...poses.idle(frame, 2), armF: [1.1, 0.5] }} />
          <Character {...WIFE} x={260} y={-790} s={1.45} z={2.05} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 3)} />
          {KIDS.map((d, i) => (
            <Character key={i} {...d} x={520 + i * 170} y={-760 - (i % 2) * 20} s={0.8} z={2.2 + i * 0.01} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, i + 6)} />
          ))}
        </Village>
      </Stage>
      <Label text="“BROTHER AGUILAR…”" x={0.3} y={0.1} size={0.045} kind="box" at={sec(start)(172.0)} />
      <Label text="“I AM MARRIED AND HAVE THREE CHILDREN.”" x={0.5} y={0.2} size={0.04} kind="box" at={sec(start)(173.8)} />
    </AbsoluteFill>
  );
};

// 175.9 "'My face is tattooed and my ears are pierced.'"
export const FaceTattooedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arm: [number, number] = t > 177.1 ? [1.6, 1.9] : [1.4, 2.1];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.5, 1.6), y: -260 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65} bgBlur={8} bg={<Village mood="day" horizon={-200} />}>
        <Character {...GUERRERO} x={60} y={-1000} s={2.2} z={2} look={0.5} talking={t < 177.9} expression={{ eyes: "open", mouth: "smile", brows: -0.2 }} pose={{ ...poses.idle(frame), armF: arm }} />
      </DepthStage>
      <Label text="“MY FACE IS TATTOOED…”" x={0.5} y={0.1} size={0.045} kind="box" at={sec(start)(176.2)} />
      <Label text="“…AND MY EARS ARE PIERCED.”" x={0.5} y={0.9} size={0.045} kind="box" at={sec(start)(177.3)} />
    </AbsoluteFill>
  );
};

// 178.55 "He stays, and he fights the Spanish for years."
export const FightsSpanishShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const charge = ramp(t, 179.4, 181.4);
  const arm: [number, number] = [1.7, 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.16), y: -80, shake: hitAt(t, 180.3, 0.3) * 7 }} light={{ dir: [0.5, 0.6] }} vignette={0.65}>
        <JungleSet mood="day" horizon={-260}>
          <Smoke x={600} y={-260} w={400} h={700} alpha={0.35} seed={5} z={-20} />
          <Character {...GUERRERO} x={-420 + charge * 200} y={-820} s={1.6} z={2.2} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ ...poses.run(frame), armF: arm }} holdF={<Spear rot={upright(arm) - 1.2} length={720} tip="#2a2228" />} />
          {[0, 1].map((i) => (
            <Character key={i} {...ITZA_WARRIOR(i + 1)} x={-760 - i * 180 + charge * 200} y={-760 - i * 30} s={1.3} z={2 - i * 0.1} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.8 }} pose={{ ...poses.run(frame + 6 + i * 4), armF: arm }} holdF={<Spear rot={upright(arm) - 1.2} length={640} tip="#2a2228" />} />
          ))}
          {[0, 1].map((i) => (
            <Character key={`s${i}`} {...SPANISH_SOLDIER(i + 1)} x={620 + i * 220} y={-780 - i * 30} s={1.35} z={1.9 - i * 0.1} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.8 }} pose={poses.scared(frame + i * 3)} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="AGAINST SPAIN" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(180.3)} />
    </AbsoluteFill>
  );
};

// 181.65 "In 1536 he dies in battle in Honduras, on the Maya side."
export const DiesInBattleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 183.2, 183.9, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: -100 }} light={{ dir: [0.6, 0.4] }} vignette={0.75} vignetteColor="#140a10">
        <JungleSet mood="dusk" horizon={-260}>
          <Smoke x={-500} y={-260} w={500} h={900} alpha={0.4} seed={3} z={-20} />
          <Smoke x={500} y={-260} w={400} h={800} alpha={0.35} seed={8} z={-20} />
          <X x={200} y={-420} rot={fall * (Math.PI / 2 - 0.1)} z={2}>
            <Character {...GUERRERO} s={1.5} look={0.5} expression={fall > 0.5 ? { eyes: "closed", mouth: "flat" } : { eyes: "angry", mouth: "shout", brows: -0.8 }} pose={{ ...poses.idle(frame), armF: [1.4 + fall, 0.3] }} shadow={false} />
          </X>
          <Spear x={420} y={-440} rot={1.45} length={720} tip="#2a2228" z={1.9} />
        </JungleSet>
      </Stage>
      <Label text="1536" x={0.17} y={0.1} size={0.07} kind="box" at={sec(start)(182.0)} />
      <Label text="HONDURAS" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(184.0)} />
      <Label text="ON THE MAYA SIDE" x={0.5} y={0.9} size={0.055} kind="box" at={sec(start)(185.2)} />
    </AbsoluteFill>
  );
};
