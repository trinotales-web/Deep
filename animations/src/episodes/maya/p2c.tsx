import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, Gradient, QuestionMark, Spear, roundRect, circle, ellipse, poly, blob, ramp, push, hitAt, absT, rng, mixHex, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { crowdSpots } from "../../kit/crowd";
import { Character, poses } from "../../kit/character";
import {
  MesoMap, mesoXY, siteXY, MayaPyramid, MayaHut, Sunburst, Smoke, MysticSmoke, Flame, Campfire, Caravel, Horse, Quetzal, Codex, ClayIdol, GlyphPanel, Glyph,
  Sky, Cloud, Mountains, Lake, Jungle, Ground, SpanishFlag, Desk, HangingLamp, Cat, Candle, PlankWall, Floorboards, BlindsWindow, Ceiba,
} from "../../kit/env";
import { Quill, Boulder } from "../../kit/props";
import { sec, pop, useScr, SpeechBubble } from "../../kit/shot";
import { JungleSet, LakeSet, PlazaSet, PalaceRoom, Paper, Village } from "./sets";
import {
  MAYA_KING, MAYA_PRIEST, MAYA_COMMONER, MAYA_WOMAN, ITZA_WARRIOR, SPANISH_SOLDIER, CORTES, ALVARADO, FRIAR, KAN_EK, TECUN_UMAN, KNOROZOV,
} from "./cast";
import { upright, TemploMayor, ConquestMap } from "./p1a";
import { KingdomsMap } from "./p1c";

// Second video, part C: the Spanish conquest, Tecún Umán, Cortés's horse and
// Tzimin Chac, Landa's bonfire at Maní, and Knorozov. Seconds on maya-2.voice.m4a.

type P = [number, number];

/** A rider sitting on a horse (facing +x). Origin = ground under the horse. */
const Rider: React.FC<{ design: React.ComponentProps<typeof Character>; s?: number; walk?: number; arm?: [number, number]; hold?: React.ReactNode; expression?: React.ComponentProps<typeof Character>["expression"]; color?: string; z?: number; x?: number; y?: number }> = ({
  design, s = 1, walk = 0, arm = [0.8, 0.6], hold, expression = { eyes: "half", mouth: "smirk", brows: -0.5 }, color = "#6e4a32", z = 0, x = 0, y = 0,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.abs(Math.sin(frame * 0.16 * walk)) * 10;
  return (
    <X x={x} y={y} s={s} z={z}>
      <Horse color={color} walk={walk} z={0} />
      <Character {...design} x={-10} y={196 + bob} s={0.78} z={0.02} look={0.5} expression={expression} pose={{ ...poses.sit(frame), armF: arm, legF: 0.9, legB: 0.7 }} holdF={hold} />
      <Part shape={roundRect(150, 26, 10)} color="#8a2a2a" flat outline={3} x={-10} y={286} z={0.03} />
    </X>
  );
};

/** Lightning bolt from the top; `k` 0..1 flash. */
const Bolt: React.FC<{ x: number; y: number; k: number; z?: number; s?: number }> = ({ x, y, k, z = 0, s = 1 }) =>
  k > 0 ? (
    <X x={x} y={y} z={z} s={s}>
      <Part shape={poly([[0, 0], [-60, -220], [10, -230], [-70, -480], [110, -180], [30, -170], [90, 0]])} color="#fff6c8" flat outline={4} opacity={k} />
      <Glow y={-200} rx={500} color="#fff6c8" alpha={0.5 * k} additive z={-0.01} />
    </X>
  ) : null;

// 186.7 "Then the Spanish come for real."
export const ForRealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const march = frame * 3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [0.5, 0.6] }} vignette={0.65}>
        <JungleSet mood="day" horizon={-200}>
          {[0, 1, 2, 3].map((i) => {
            const arm: [number, number] = [0.4, 0.4];
            return (
              <Character key={i} {...SPANISH_SOLDIER(i)} x={-960 + i * 400 + march} y={-640 - (i % 2) * 40} s={1.15} z={2 + (i % 2) * 0.1} look={0.4} expression={{ eyes: "half", mouth: "flat", brows: -0.5 }} pose={{ ...poses.walk(frame + i * 5, 0.5), armF: arm }} holdF={<Spear rot={upright(arm)} length={700} tip="#c9ced6" />} />
            );
          })}
          <X x={-1100 + march} y={-280} z={1.5}>
            <Line pts={[[0, 0], [0, 680]]} width={12} color="#4a3220" />
            <SpanishFlag x={0} y={680} w={260} />
          </X>
        </JungleSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 188.45 "And here, the rule changes everything."
export const RuleChangesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.round(ramp(t, 188.6, 189.8) * 5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -60 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <PalaceRoom floorY={-460} throne={false}>
          {Array.from({ length: n }, (_, i) => (
            <Character key={i} {...MAYA_KING(i)} x={-760 + i * 380} y={-700} s={0.92} z={2 + i * 0.01} facing={i < 3 ? 1 : -1} look={0.4} expression={{ eyes: i % 2 ? "half" : "open", mouth: i % 2 ? "smirk" : "flat", brows: -0.3 }} pose={i % 3 === 0 ? poses.handsOnHips : poses.idle(frame, i)} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="THE RULE" sub="NEVER ONE KING" x={0.5} y={0.12} size={0.07} kind="box" at={sec(start)(189.4)} />
    </AbsoluteFill>
  );
};

// 190.9 "The Aztecs have one capital, Tenochtitlan."
export const OneCapitalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.6, 0.5] }} vignette={0.55}>
        <LakeSet mood="day" horizon={-60} island={false}>
          <Part shape={blob([[-900, -60], [-700, 30], [0, 60], [700, 30], [900, -60], [0, -110]], 8)} color="#d8caa8" shade={0.2} y={-120} z={-24} />
          <TemploMayor y={-110} s={0.7} z={-23} />
          {[-1, 1].map((k) => (
            <Part key={k} shape={roundRect(1200, 26, 6)} color="#cbbf9e" shade={0.2} x={k * 1300} y={-150} z={-24.5} />
          ))}
          {[-640, -480, 480, 640].map((x, i) => (
            <MayaHut key={x} x={x} y={-110} w={150} wall="#efe4cc" thatch="#c8a25a" z={-23.5 + i * 0.001} />
          ))}
        </LakeSet>
      </Stage>
      <Label text="TENOCHTITLAN" sub="AZTEC CAPITAL" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(192.7)} />
      <Label text="ONE CAPITAL" x={0.2} y={0.88} size={0.05} kind="box" at={sec(start)(191.8)} />
    </AbsoluteFill>
  );
};

// 193.9 "Cortés takes it in 1521, and the whole empire falls in about two years."
export const Cortes1521Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 194.6, 195.1, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40, shake: hitAt(t, 194.7, 0.3) * 6 }} light={{ dir: [-0.6, 0.5] }} vignette={0.65} bgBlur={3}
        bg={
          <JungleSet mood={fall > 0.5 ? "dusk" : "day"} horizon={-300} jungle={false} ground="#c9b48a">
            <TemploMayor y={-300} s={0.85} z={-20} fall={fall} />
            {fall > 0 ? <Smoke x={-560} y={-300} w={300} h={800} alpha={0.45} seed={3} z={-19} /> : null}
            {fall > 0 ? <Smoke x={620} y={-300} w={260} h={700} alpha={0.4} seed={6} z={-19} /> : null}
          </JungleSet>
        }
      >
        <Character {...CORTES} x={-560} y={-920} s={1.9} z={2} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.6 }} pose={poses.point(frame)} />
      </DepthStage>
      <Label text="1521" x={0.78} y={0.1} size={0.08} kind="box" at={sec(start)(194.9)} />
      <Label text="WHOLE EMPIRE FALLS" x={0.6} y={0.22} size={0.05} kind="box" at={sec(start)(196.7)} />
      <Label text="~2 YEARS" x={0.84} y={0.34} size={0.05} kind="box" at={sec(start)(197.9)} />
    </AbsoluteFill>
  );
};

// 198.95 "But the Maya have no capital to take."
export const NoCapitalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 100;
  const center: [number, number] = [-89.8, 17.6];
  const sx = Math.sin(t * 2.2) * 380;
  const sy = Math.cos(t * 1.7) * 260;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <KingdomsMap ppd={ppd} center={center} k={1} />
        <X x={sx} y={sy} z={3}>
          <Part shape={circle(150)} color="#fff2c6" flat outline={8} opacity={0.25} />
          <Glow rx={200} color="#fff2c6" alpha={0.4} additive z={0.01} />
        </X>
        <QuestionMark x={560} y={240} s={0.7 * pop(t, 199.9)} rot={0.1} z={4} />
      </Stage>
      <Label text="NO CAPITAL" x={0.5} y={0.1} size={0.07} kind="box" at={sec(start)(200.0)} />
    </AbsoluteFill>
  );
};

// 201.25 "Dozens of kingdoms."
export const DozensShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.3, 1.4), y: -60 }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <KingdomsMap ppd={130} center={[-90.0, 17.2]} k={1} crowns={ramp(t, 201.3, 201.8)} />
      </Stage>
      <Label text="DOZENS OF KINGDOMS" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(201.4)} />
    </AbsoluteFill>
  );
};

// 202.7 "Each one has to be beaten, one at a time."
export const OneAtATimeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <ConquestMap t={t} t0={203.3} step={0.17} zoom={push(frame, dur, 0.95, 1.02)} cx={0} cy={0} />
      <Label text="ONE AT A TIME" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(204.3)} />
    </AbsoluteFill>
  );
};

// 205.3 "Diseases like smallpox often arrive before the soldiers, and they kill huge numbers of people."
export const SmallpoxShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const miasma = ramp(t, 205.6, 207.0);
  const sick = (i: number) => ramp(t, 208.6 + i * 0.25, 209.2 + i * 0.25);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -80 }} light={{ dir: [0.5, 0.5] }} vignette={0.75} vignetteColor="#0a140a">
        <Village mood="dusk" horizon={-240}>
          {[-700, -100, 500].map((x, i) => (
            <Smoke key={x} x={x} y={-300} w={260} h={700} alpha={0.28 * miasma} color="#7a9a5a" seed={i + 6} z={0.5} />
          ))}
          <Wash width={6000} height={4000} color="#3a5a2a" alpha={0.12 * miasma} z={1.1} />
          {[-620, -220, 200, 600].map((x, i) => {
            const k = sick(i);
            return (
              <X key={x} x={x} y={-640} rot={(i % 2 ? -1 : 1) * k * (Math.PI / 2 - 0.15)} z={2 + i * 0.01}>
                <Character {...(i % 2 ? MAYA_WOMAN(i) : MAYA_COMMONER(i))} s={1.1} look={0.5} expression={{ eyes: k > 0.5 ? "closed" : "half", mouth: "wavy", brows: 0.8, sweat: true }} pose={poses.idle(frame, i)} shadow={false} />
              </X>
            );
          })}
          {t > 207.4
            ? [0, 1].map((i) => (
                <Character key={`s${i}`} {...SPANISH_SOLDIER(i)} x={1400 - i * 160 - ramp(t, 207.4, 210.8) * 260} y={-300 - i * 20} s={0.55} z={0.5} facing={-1} look={0.4} expression={{ eyes: "half", mouth: "flat" }} pose={poses.walk(frame + i * 5, 0.5)} />
              ))
            : null}
        </Village>
      </Stage>
      <Label text="SMALLPOX" x={0.25} y={0.1} size={0.07} kind="box" at={sec(start)(206.2)} />
      <Label text="BEFORE THE SOLDIERS" x={0.72} y={0.1} size={0.045} kind="box" at={sec(start)(207.6)} />
      <Label text="HUGE NUMBERS DIE" x={0.5} y={0.9} size={0.05} kind="box" at={sec(start)(209.3)} />
    </AbsoluteFill>
  );
};

/** Highland volcano cone with a smoke plume. Origin = base centre. */
const Volcano: React.FC<{ x: number; y: number; s?: number; z?: number; color?: string }> = ({ x, y, s = 1, z = 0, color = "#5a6a7a" }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={poly([[-700, 0], [-120, 760], [120, 760], [700, 0]])} color={color} shade={0.22} />
    <Part shape={poly([[-200, 600], [-120, 760], [120, 760], [200, 600], [80, 640], [0, 600], [-90, 650]])} color="#e8eef2" flat outline={3} z={0.001} />
    <Smoke y={780} w={160} h={500} alpha={0.3} color="#c8ccd4" seed={2} z={0.002} />
  </X>
);

// 210.85 "In 1524, a Spanish captain named Pedro de Alvarado invades the highlands of Guatemala."
export const Alvarado1524Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ride = interpolate(t, [210.85, 217.3], [-500, 60]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <X z={-41}>
          <Sky w={6000} h={3600} y={1500} top="#7ab8d8" mid="#a8d0e0" bottom="#e2eef0" />
          <Cloud x={600} y={420} w={420} seed={7} />
        </X>
        <Volcano x={-620} y={-120} s={0.85} z={-40} />
        <Volcano x={500} y={-120} s={0.7} color="#6a7a88" z={-40.1} />
        <Mountains w={6000} y={-120} color="#6a9a5a" outline={3} peaks={[[-2200, 200], [-1200, 320], [-200, 180], [700, 280], [1700, 210]]} z={-38} />
        <Ground w={6000} h={2000} y={-180} color="#9ab86a" far="#8aa85a" pebbles={8} tufts={12} tuftColor="#6a8a3a" seed={6} z={-30} />
        {[0, 1, 2].map((i) => (
          <Character key={i} {...SPANISH_SOLDIER(i + 1)} x={ride - 520 - i * 220} y={-560 - (i % 2) * 30} s={1.0} z={1 + i * 0.01} look={0.4} expression={{ eyes: "half", mouth: "flat" }} pose={{ ...poses.walk(frame + i * 6, 0.5), armF: [0.4, 0.4] }} holdF={<Spear rot={upright([0.4, 0.4])} length={620} tip="#c9ced6" />} />
        ))}
        <Rider design={ALVARADO} x={ride} y={-620} s={1.15} walk={0.7} z={2} arm={[1.0, 0.5]} />
      </Stage>
      <Label text="1524" x={0.15} y={0.1} size={0.07} kind="box" at={sec(start)(211.3)} />
      <Label text="PEDRO DE ALVARADO" x={0.55} y={0.1} size={0.055} kind="box" at={sec(start)(214.2)} />
      <Label text="HIGHLANDS OF GUATEMALA" x={0.55} y={0.9} size={0.045} kind="box" at={sec(start)(215.8)} />
    </AbsoluteFill>
  );
};

// 217.3 "Legend says a K'iche' prince named Tecún Umán fights him face to face."
export const TecunUmanShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const clash = hitAt(t, 220.9, 0.4);
  const arm: [number, number] = [1.7 + clash * 0.6, 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -40, shake: clash * 8 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65}>
        <JungleSet mood="dusk" horizon={-260} jungle={false} ground="#9ab86a">
          <Volcano x={0} y={-260} s={0.6} z={-39} />
          <Character {...TECUN_UMAN} x={-460} y={-760} s={1.65} z={2} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<Spear rot={upright(arm) - 0.9} length={760} tip="#2a2228" />} />
          <Rider design={ALVARADO} x={420} y={-720} s={1.2} z={1.9} expression={{ eyes: "angry", mouth: "teeth", brows: -0.8 }} arm={[1.5, 0.3]} hold={<Spear rot={upright([1.5, 0.3]) - 1.3} length={700} tip="#c9ced6" />} />
        </JungleSet>
      </Stage>
      <Label text="LEGEND" x={0.12} y={0.1} size={0.045} kind="box" at={sec(start)(217.5)} />
      <Label text="TECÚN UMÁN" sub="K'ICHE' PRINCE" x={0.3} y={0.22} size={0.055} kind="box" at={sec(start)(219.1)} />
      <Label text="FACE TO FACE" x={0.72} y={0.1} size={0.05} kind="box" at={sec(start)(220.6)} />
    </AbsoluteFill>
  );
};

// 221.65 "When he falls, a quetzal bird lands on his chest."
export const QuetzalLandsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fly = ramp(t, 222.4, 223.5, Easing.out(Easing.quad));
  const qx = interpolate(fly, [0, 1], [900, 120]);
  const qy = interpolate(fly, [0, 1], [400, -440]) + Math.sin(fly * Math.PI) * 120;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.25), y: -420 }} light={{ dir: [-0.5, 0.6] }} vignette={0.75} vignetteColor="#140a10">
        <JungleSet mood="dusk" horizon={-260} jungle={false} ground="#8aa85a">
          <X x={420} y={-560} rot={Math.PI / 2} z={2}>
            <Character {...TECUN_UMAN} s={1.3} look={0.5} expression={{ eyes: "closed", mouth: "flat" }} pose={{ ...poses.idle(frame), armF: [0.3, 0.1], armB: [0.2, 0.1] }} shadow={false} />
          </X>
          <Quetzal x={qx} y={qy} s={1.1} sx={-1} flap={1 - ramp(t, 223.3, 223.6)} rot={(1 - fly) * 0.2} z={3} />
        </JungleSet>
      </Stage>
      <Label text="A QUETZAL LANDS ON HIS CHEST" x={0.5} y={0.12} size={0.05} kind="box" at={sec(start)(223.4)} />
    </AbsoluteFill>
  );
};

// 224.55 "That, the story goes, is why the quetzal's chest is red."
export const RedChestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.8, 2.0), y: 40 }} light={{ dir: [-0.5, 0.6] }} vignette={0.7} bgBlur={8}
        bg={<JungleSet mood="day" horizon={-300}><Ceiba x={-300} y={-300} h={900} z={-28} /></JungleSet>}
      >
        <Line pts={[[-700, -40], [500, 20]]} width={26} color="#6e4a2c" z={0} />
        <Quetzal x={0} y={-20} s={1.2} z={1} />
        <Glow x={18} y={20} rx={110} color="#ff6a5a" alpha={0.5 * ramp(t, 227.1, 227.6)} additive z={2} />
      </DepthStage>
      <Label text="WHY ITS CHEST IS RED" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(227.2)} />
      <Label text="THE QUETZAL" sub="GUATEMALA'S NATIONAL BIRD" x={0.25} y={0.86} size={0.045} kind="box" at={sec(start)(225.3)} />
    </AbsoluteFill>
  );
};

// 228.25 "In the north, it takes the Spanish about 20 years just to take the Yucatán."
export const TwentyYearsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 120;
  const center: [number, number] = [-89.0, 19.8];
  const k = ramp(t, 229.2, 232.4);
  const year = Math.round(1527 + k * 20);
  const pins: [number, number][] = [[-90.53, 19.85], [-89.62, 20.97], [-88.2, 20.7], [-90.7, 19.35], [-87.6, 20.3], [-88.3, 19.6], [-89.4, 20.4], [-88.4, 18.5]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} />
        {pins.map(([lo, la], i) => {
          const q = ramp(t, 229.4 + i * 0.36, 229.7 + i * 0.36, Easing.out(Easing.back(2)));
          const [x, y] = mesoXY(lo, la, ppd, center);
          return q > 0 ? (
            <X key={i} x={x} y={y} z={1 + i * 0.01}>
              <Line pts={[[0, 0], [0, 100 * q]]} width={6} color="#4a3220" />
              <SpanishFlag x={0} y={100} w={80} s={q} z={0.001} />
            </X>
          ) : null;
        })}
        <X y={-440} z={2}>
          <Part shape={roundRect(1200, 40, 20)} color="#efe4cc" flat outline={5} />
          <Part shape={roundRect(Math.max(40, 1190 * k), 30, 15)} color="#c0392b" flat outline={0} x={-595 + Math.max(40, 1190 * k) / 2} z={0.001} />
        </X>
      </Stage>
      {Array.from({ length: 21 }, (_, i) => 1527 + i).map((y) => (
        <Label key={y} text={`${y}`} x={0.5} y={0.82} size={0.05} kind="box" at={y === year ? 0 : 99999} />
      ))}
      <Label text="~20 YEARS FOR THE YUCATÁN" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(230.6)} />
    </AbsoluteFill>
  );
};

// 233.0 "And in 1525, on a long march through the jungle, Cortés passes the island city of the Itza."
export const CortesMarchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = 110;
  const center: [number, number] = [-90.0, 17.3];
  const z = push(frame, dur, 1.0, 1.05);
  const [nx, ny] = siteXY("nojpeten", ppd, center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: z }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} countries pins={["nojpeten"]} highlight={t > 237.6 ? ["nojpeten"] : []}
          route={[[-92.9, 18.2], [-91.6, 17.8], [-90.6, 17.2], [-89.88, 16.93], [-89.2, 16.3], [-88.7, 15.6], [-87.5, 15.6], [-86.0, 15.9]]}
          routeK={ramp(t, 234.4, 238.9)}
        />
      </Stage>
      <Label text="1525" x={0.15} y={0.1} size={0.07} kind="box" at={sec(start)(233.4)} />
      <Label text="CORTÉS'S MARCH TO HONDURAS" x={0.6} y={0.1} size={0.045} kind="box" at={sec(start)(234.6)} />
      <Label pin text="THE ITZA ISLAND" {...sc(nx, ny + 70, z)} size={0.04} kind="box" at={sec(start)(237.7)} />
    </AbsoluteFill>
  );
};

/** Horse with a bandaged front leg, limping when `limp` > 0. */
const LameHorse: React.FC<{ x?: number; y?: number; s?: number; z?: number; limp?: number; color?: string; clay?: boolean }> = ({ x = 0, y = 0, s = 1, z = 0, limp = 0, color = "#8a5a3a", clay = false }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y + Math.max(0, Math.sin(frame * 0.2)) * 8 * limp} rot={Math.sin(frame * 0.2) * 0.02 * limp} s={s} z={z}>
      <Horse color={color} clay={clay} />
      {!clay ? <Part shape={roundRect(40, 50, 8)} color="#efe6d0" shade={0.2} x={110} y={70} z={0.03} /> : null}
    </X>
  );
};

// 239.35 "He leaves behind a lame horse, and promises to come back for it."
export const LameHorseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <LakeSet mood="day" horizon={-80} islandX={500} islandW={900}>
          <Character {...CORTES} x={-640} y={-760} s={1.45} z={2} look={0.5} talking={t > 241.2 && t < 242.8} expression={{ eyes: "half", mouth: "smile", brows: -0.2 }} pose={poses.blendAt(t, 241.1, { ...poses.idle(frame), armF: [1.2, 0.4] }, poses.talk(frame, 3))} />
          <LameHorse x={-120} y={-760} s={1.05} limp={1} z={1.9} />
          <Character {...KAN_EK} x={520} y={-760} s={1.45} z={2.1} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.idle(frame, 2)} />
        </LakeSet>
      </Stage>
      <Label text="A LAME HORSE" x={0.4} y={0.1} size={0.055} kind="box" at={sec(start)(240.5)} />
      <Label text="“I'LL COME BACK FOR IT.”" x={0.3} y={0.22} size={0.045} kind="box" at={sec(start)(241.6)} />
    </AbsoluteFill>
  );
};

// 243.1 "The Itza have never seen a horse."
export const NeverSeenShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -100 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6} bgBlur={6} bg={<Village mood="day" horizon={-240} />}>
        <LameHorse x={260} y={-700} s={1.2} z={1} />
        {[0, 1, 2].map((i) => (
          <Character key={i} {...(i === 1 ? MAYA_WOMAN(i) : ITZA_WARRIOR(i))} x={-800 + i * 340} y={-780 - (i % 2) * 30} s={1.35 - i * 0.08} z={2 - i * 0.05} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.9, gaze: [0.6, 0] }} pose={i === 2 ? poses.scared(frame) : poses.idle(frame, i)} />
        ))}
        <QuestionMark x={-60} y={130} s={0.55 * pop(t, 244.0)} z={3} />
      </DepthStage>
      <Label text="NEVER SEEN A HORSE" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(244.0)} />
    </AbsoluteFill>
  );
};

// 245.1 "So they treat it like a god."
export const LikeAGodShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 20 }} light={{ pos: [0, 400] }} vignette={0.7} vignetteColor="#140a10">
        <PalaceRoom floorY={-460} dim={0.1} throne={false}>
          <Sunburst y={100} r={1600} rays={18} color="#e8c88a" alt="#e0bc78" speed={0.5} z={-33} />
          <Part shape={roundRect(640, 120, 10)} color="#cbbf9e" shade={0.22} y={-400} z={1} />
          <LameHorse x={-80} y={-340} s={0.95} z={2} />
          <Glow y={0} rx={600} color="#fff2c6" alpha={0.35} additive z={1.5} />
          {[-700, 700].map((x, i) => (
            <Character key={x} {...MAYA_PRIEST(i)} x={x} y={-560} s={1.3} z={3} facing={x < 0 ? 1 : -1} look={0.4} expression={{ eyes: "closed", mouth: "smile" }} pose={poses.worship(frame + i * 9)} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="A GOD" x={0.5} y={0.12} size={0.08} kind="title" at={sec(start)(245.9)} />
    </AbsoluteFill>
  );
};

// 246.65 "They feed it birds, meat and flowers."
export const FeedItShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const plate = (x: number, at: number, kids: React.ReactNode) => (
    <X x={x} y={-560} s={pop(t, at)} z={3}>
      <Part shape={ellipse(150, 40)} color="#d9864a" shade={0.24} />
      <X y={30} z={0.01}>{kids}</X>
    </X>
  );
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -160 }} light={{ pos: [0, 400] }} vignette={0.65}>
        <PalaceRoom floorY={-560} throne={false}>
          <LameHorse x={-60} y={-560} s={1.0} z={1} />
          {plate(-560, 247.25, <Part shape={blob([[-70, 0], [70, 0], [90, 50], [40, 90], [-60, 80], [-90, 40]], 8)} color="#c8783a" shade={0.26} />)}
          {plate(0, 247.85, <Part shape={blob([[-80, 0], [80, 0], [60, 60], [-60, 70]], 8)} color="#b8432f" shade={0.26} />)}
          {plate(560, 248.45, <>{[-60, 0, 60].map((x, i) => <Part key={x} shape={circle(34)} color={["#f2c84a", "#e07a9a", "#f4f1ea"][i]} flat outline={3} x={x} y={40 + (i % 2) * 20} />)}</>)}
        </PalaceRoom>
      </Stage>
      <Label pin text="BIRDS" x={0.2} y={0.88} size={0.045} kind="box" at={sec(start)(247.3)} />
      <Label pin text="MEAT" x={0.5} y={0.88} size={0.045} kind="box" at={sec(start)(247.9)} />
      <Label pin text="FLOWERS" x={0.8} y={0.88} size={0.045} kind="box" at={sec(start)(248.5)} />
    </AbsoluteFill>
  );
};

// 249.25 "The horse dies."
export const HorseDiesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.2), y: -200 }} light={{ pos: [0, 400] }} vignette={0.8} vignetteColor="#0a0a10">
        <PalaceRoom floorY={-460} dim={0.35} throne={false}>
          <X x={-40} y={-640} rot={-0.06} z={1}>
            <Horse color="#8a5a3a" />
          </X>
          <Part shape={roundRect(6000, 1400, 0)} color="#c9b994" flat outline={0} y={-460 - 700} z={1.2} />
          <Line pts={[[-3000, -460], [3000, -460]]} width={6} z={1.21} />
          <Part shape={circle(30)} color="#e07a9a" flat outline={3} x={-300} y={-420} z={2} />
        </PalaceRoom>
      </Stage>
    </AbsoluteFill>
  );
};

// 250.5 "Afraid of being blamed for killing a god, the Itza make a statue of it and worship it."
export const StatueShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const build = ramp(t, 252.9, 254.2);
  const tap = Math.max(0, Math.sin(frame * 0.7));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -120 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <PalaceRoom floorY={-560} throne={false}>
          <Part shape={roundRect(640, 100, 10)} color="#b9ae98" shade={0.22} y={-510} z={1} />
          <X y={-460} z={1.5}>
            <X s={0.9}>
              <Horse color="#b8b0a0" mane="#8a8070" clay />
            </X>
            <Part shape={roundRect(700, 460 * (1 - build), 12)} color="#a8a090" shade={0.2} y={250 + (460 * build) / 2} opacity={1} z={0.1} />
          </X>
          <Character {...MAYA_COMMONER(3)} x={-560} y={-700} s={1.4} z={2} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.9, sweat: true }} pose={{ ...poses.idle(frame), armF: [1.4 - tap * 0.4, 0.4] }} holdF={<Line pts={[[0, -20], [0, 120]]} width={12} color="#6e4a2c" rot={1.2} />} />
          <Character {...MAYA_COMMONER(6)} x={580} y={-700} s={1.4} z={2.1} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.9, sweat: true }} pose={{ ...poses.idle(frame, 2), armF: [1.4 - Math.max(0, Math.sin(frame * 0.7 + 1.5)) * 0.4, 0.4] }} holdF={<Line pts={[[0, -20], [0, 120]]} width={12} color="#6e4a2c" rot={1.2} />} />
        </PalaceRoom>
      </Stage>
      <Label text="AFRAID OF THE BLAME" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(251.4)} />
      <Label text="A STATUE" x={0.5} y={0.21} size={0.05} kind="box" at={sec(start)(253.5)} />
    </AbsoluteFill>
  );
};

/** Tzimin Chac on its altar inside the island temple. */
const TziminChac: React.FC<{ y?: number; s?: number; z?: number; shatter?: number }> = ({ y = -460, s = 1, z = 1, shatter = 0 }) => {
  const r = rng(5);
  const shards = Array.from({ length: 14 }, () => [(r() - 0.5) * 500, 100 + r() * 300, (r() - 0.5) * 2, r()] as [number, number, number, number]);
  return (
    <X y={y} s={s} z={z}>
      <Part shape={roundRect(640, 100, 10)} color="#b9ae98" shade={0.22} y={-50} />
      {shatter <= 0 ? (
        <X s={0.9}>
          <Horse color="#b8b0a0" mane="#8a8070" clay />
        </X>
      ) : (
        shards.map(([sx, sy, vx, q], i) => (
          <Part
            key={i}
            shape={poly([[-40, -30], [50, -24], [30, 40], [-30, 34]])}
            color={i % 2 ? "#b8b0a0" : "#a8a090"}
            shade={0.22}
            x={sx + vx * 600 * shatter}
            y={sy + 500 * shatter * (0.6 + q) - 900 * shatter * shatter}
            rot={vx * 6 * shatter}
            s={0.8 + q}
            z={i * 0.001}
          />
        ))
      )}
    </X>
  );
};

// 255.1 "They call it Tzimin Chac."
export const TziminChacShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -120 }} light={{ pos: [0, 400] }} vignette={0.7} vignetteColor="#140a10">
        <PalaceRoom floorY={-560} dim={0.15} throne={false}>
          <Sunburst y={-100} r={1800} rays={18} color="#e8c88a" alt="#e0bc78" speed={0.4} z={-33} />
          <TziminChac y={-460} />
          {[-300, 300].map((x, i) => (
            <Candle key={x} x={x} y={-500} s={0.9} seed={i + 2} z={2} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="TZIMIN CHAC" x={0.5} y={0.12} size={0.09} kind="title" at={sec(start)(255.9)} />
    </AbsoluteFill>
  );
};

// 256.9 "The thunder horse."
export const ThunderHorseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = hitAt(t, 257.25, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.3, 1.36), y: -100, shake: k * 6 }} light={{ pos: [0, 400] }} vignette={0.75} vignetteColor="#0a0a18">
        <Gradient w={6000} h={4000} stops={[[0, "#2a2a4a"], [1, "#141428"]]} z={-41} />
        <Bolt x={-320} y={520} k={Math.min(1, k * 1.5)} s={1.1} z={-30} />
        <Bolt x={380} y={540} k={Math.min(1, k * 1.2)} s={0.9} z={-30} />
        <TziminChac y={-460} />
        <Wash width={6000} height={4000} color="#ffffff" alpha={0.3 * k} z={20} />
      </Stage>
      <Label text="THE THUNDER HORSE" x={0.5} y={0.12} size={0.07} kind="title" at={sec(start)(257.1)} />
    </AbsoluteFill>
  );
};

// 258.0 "Almost a hundred years later, in 1618, two Spanish friars visit and find the statue."
export const Friars1618Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const walk = ramp(t, 260.8, 262.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -120 }} light={{ pos: [200, 400] }} vignette={0.7} vignetteColor="#140a10">
        <PalaceRoom floorY={-560} dim={0.15} throne={false}>
          <TziminChac y={-460} s={0.85} z={1} />
          {[0, 1].map((i) => (
            <Character key={i} {...FRIAR(i)} x={-1000 - i * 220 + walk * 500} y={-760 - i * 20} s={1.35} z={2 - i * 0.05} look={0.5} expression={t > 262.6 ? { eyes: "wide", mouth: "o", brows: 0.7 } : { eyes: "half", mouth: "flat", brows: -0.2 }} pose={walk < 1 && walk > 0 ? poses.walk(frame + i * 6, 0.6) : poses.idle(frame, i)} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="ALMOST 100 YEARS LATER" x={0.3} y={0.1} size={0.045} kind="box" at={sec(start)(258.3)} />
      <Label text="1618" x={0.75} y={0.1} size={0.07} kind="box" at={sec(start)(259.8)} />
      <Label text="2 SPANISH FRIARS" x={0.25} y={0.88} size={0.045} kind="box" at={sec(start)(261.2)} />
    </AbsoluteFill>
  );
};

// 263.6 "One of them smashes it to pieces."
export const SmashShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = 264.4;
  const swing = t < hit ? ramp(t, 263.7, hit, Easing.in(Easing.quad)) : 1;
  const arm: [number, number] = [2.9 - swing * 1.8, 0.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.22), y: -160, shake: hitAt(t, hit, 0.4) * 12 }} light={{ pos: [200, 400] }} vignette={0.7} vignetteColor="#140a10">
        <PalaceRoom floorY={-560} dim={0.1} throne={false}>
          <TziminChac y={-460} s={0.85} z={1} shatter={ramp(t, hit, hit + 0.9, Easing.out(Easing.quad))} />
          <Character {...FRIAR(0)} x={-620} y={-760} s={1.5} z={2} look={0.5} expression={{ eyes: "angry", mouth: "teeth", brows: -0.9 }} pose={{ ...poses.idle(frame), armF: arm, armsOverHead: swing < 0.5 }} holdF={<Boulder r={60} y={30} seed={3} />} />
          <Glow x={0} y={-300} rx={400} color="#fff2c6" alpha={0.6 * hitAt(t, hit, 0.4)} additive z={3} />
        </PalaceRoom>
      </Stage>
      <Label text="SMASH!" x={0.7} y={0.2} size={0.1} kind="stamp" rotate={-8} at={sec(start)(hit)} />
    </AbsoluteFill>
  );
};

// 265.65 "Not a great way to make friends."
export const NotFriendsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -100 }} light={{ pos: [200, 400] }} vignette={0.65}>
        <PalaceRoom floorY={-560} throne={false}>
          <Character {...FRIAR(0)} x={-560} y={-780} s={1.5} z={2} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.9, sweat: true }} pose={poses.shrug(0.3)} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...(i === 1 ? KAN_EK : ITZA_WARRIOR(i + 1))} x={120 + i * 340} y={-760 - (i % 2) * 30} s={1.3} z={2.1 - i * 0.05} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "frown", brows: -0.9 }} pose={i === 1 ? poses.handsOnHips : poses.idle(frame, i)} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="NOT GREAT FOR FRIENDSHIP" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(266.0)} />
    </AbsoluteFill>
  );
};

const LANDA = { ...FRIAR(0), seed: 735 };

// 267.7 "Meanwhile, in the north, a Spanish priest named Diego de Landa wants to wipe out the old religion."
export const LandaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -100 }} light={{ dir: [0.5, 0.5] }} vignette={0.65} bgBlur={6}
        bg={<PlazaSet mood="dusk" horizon={-240} />}
      >
        <Character {...LANDA} x={-260} y={-940} s={2.1} z={2} look={0.5} expression={t > 272.3 ? { eyes: "angry", mouth: "teeth", brows: -0.9 } : { eyes: "half", mouth: "flat", brows: -0.5 }} pose={t > 272.3 ? poses.point(frame) : poses.idle(frame)} />
      </DepthStage>
      <Label text="DIEGO DE LANDA" sub="FRANCISCAN PRIEST" x={0.72} y={0.12} size={0.055} kind="box" at={sec(start)(271.4)} />
      <Label text="WIPE OUT THE OLD RELIGION" x={0.72} y={0.3} size={0.04} kind="box" at={sec(start)(272.8)} />
    </AbsoluteFill>
  );
};

/** Franciscan church façade with a bell gable (espadaña). Origin = ground centre. */
const Church: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(900, 620, 6)} color="#efe8d8" shade={0.22} y={310} />
    <Part shape={poly([[-260, 620], [260, 620], [200, 820], [-200, 820]])} color="#efe8d8" shade={0.22} z={0.001} />
    {[-90, 90].map((bx) => (
      <X key={bx} x={bx} y={700} z={0.002}>
        <Part shape={roundRect(90, 110, 40)} color="#2a2026" flat outline={4} />
        <Part shape={blob([[-26, -20], [26, -20], [20, 20], [0, 30], [-20, 20]], 6)} color="#c8a24a" shade={0.24} y={-6} z={0.001} />
      </X>
    ))}
    <Line pts={[[0, 820], [0, 900]]} width={10} color="#4a3220" z={0.002} />
    <Line pts={[[-30, 875], [30, 875]]} width={10} color="#4a3220" z={0.002} />
    <Part shape={roundRect(180, 300, 80)} color="#6e4a2c" shade={0.24} y={150} z={0.002} />
    <Part shape={circle(56)} color="#9ac0d8" flat outline={4} y={450} z={0.002} />
  </X>
);

// 274.4 "In July 1562, in the town of Maní,"
export const ManiShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [0.5, 0.5] }} vignette={0.6}>
        <JungleSet mood="dusk" horizon={-260} ground="#e2d6b8">
          <Church x={-180} y={-260} s={0.8} z={-24} />
          {[-900, 640, 980].map((x, i) => (
            <MayaHut key={x} x={x} y={-280} w={220} z={-23 + i * 0.01} />
          ))}
          {[-600, -300, 200, 500].map((x, i) => (
            <Character key={x} {...(i % 2 ? MAYA_WOMAN(i) : MAYA_COMMONER(i))} x={x} y={-640 - (i % 2) * 30} s={0.9} z={2 + i * 0.01} facing={i % 2 ? -1 : 1} look={0.4} expression={{ eyes: "half", mouth: "flat", brows: 0.5 }} pose={poses.idle(frame, i)} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="JULY 1562" x={0.2} y={0.1} size={0.065} kind="box" at={sec(start)(274.7)} />
      <Label text="MANÍ" sub="YUCATÁN" x={0.78} y={0.1} size={0.065} kind="box" at={sec(start)(276.9)} />
    </AbsoluteFill>
  );
};

/** Landa's bonfire: idols and codices piled on a burning heap. Origin = base centre. */
const Bonfire: React.FC<{ burn: number; idols?: number; books?: number; z?: number; x?: number; y?: number; s?: number }> = ({ burn, idols = 1, books = 1, z = 0, x = 0, y = 0, s = 1 }) => (
  <X x={x} y={y} s={s} z={z}>
    {Array.from({ length: 9 }, (_, i) => (
      <ClayIdol key={i} x={-340 + i * 85} y={(i % 3) * 30} s={0.7 * idols} seed={i} char={burn * 0.6} rot={(i % 2 ? 1 : -1) * 0.2} z={i * 0.001} />
    ))}
    {[-220, 0, 220].map((bx, i) => (
      <Codex key={bx} x={bx} y={260 + (i % 2) * 40} s={0.38 * books} pages={5} open={0.8} burn={burn * 0.8} seed={i + 3} rot={(i - 1) * 0.3} z={0.02 + i * 0.001} />
    ))}
    {burn > 0 ? (
      <>
        <Flame x={-160} y={60} size={2.2 * burn} seed={2} z={0.05} />
        <Flame x={140} y={40} size={2.6 * burn} seed={5} z={0.05} />
        <Flame x={0} y={120} size={2.0 * burn} seed={8} z={0.06} />
        <Glow y={200} rx={900} ry={600} color="#ff9a4a" alpha={0.45 * burn} additive z={0.07} />
        <Smoke y={500} w={500} h={1200} alpha={0.45 * burn} seed={4} z={0.04} />
      </>
    ) : null}
  </X>
);

// 277.6 "he burns thousands of Maya idols and 27 Maya books."
export const BonfireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -80 }} light={{ pos: [0, -200] }} vignette={0.75} vignetteColor="#1a0a08">
        <JungleSet mood="night" horizon={-200} ground="#c8b48a">
          <Church x={-900} y={-200} s={0.55} z={-24} />
          <Bonfire y={-560} burn={ramp(t, 277.7, 278.6)} z={1} />
          <Character {...LANDA} x={760} y={-760} s={1.4} z={2} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "smirk", brows: -0.8 }} pose={poses.point(frame)} />
        </JungleSet>
      </Stage>
      <Label text="THOUSANDS OF IDOLS" x={0.25} y={0.1} size={0.05} kind="box" at={sec(start)(279.0)} />
      <Label text="27 BOOKS" x={0.75} y={0.1} size={0.065} kind="box" at={sec(start)(280.4)} />
    </AbsoluteFill>
  );
};

// 281.4 "Landa later wrote, 'We burned them all, which they regretted to an amazing degree.'"
export const QuoteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -100 }} light={{ pos: [0, -100] }} vignette={0.75} vignetteColor="#1a0a08" bgBlur={7}
        bg={<JungleSet mood="night" horizon={-200} ground="#c8b48a"><Bonfire y={-420} burn={1} s={0.8} z={1} /></JungleSet>}
      >
        {[0, 1, 2].map((i) => (
          <Character key={i} {...(i === 1 ? MAYA_WOMAN(i + 2) : MAYA_PRIEST(i))} x={-640 + i * 420} y={-900 - (i % 2) * 30} s={1.7} z={2 + i * 0.01} facing={i === 2 ? -1 : 1} look={0.4} expression={{ eyes: "sad", mouth: "frown", brows: 1.0 }} pose={i === 1 ? poses.grief(frame) : poses.idle(frame, i)} />
        ))}
      </DepthStage>
      <Label text="LANDA WROTE:" x={0.5} y={0.08} size={0.04} kind="box" at={sec(start)(281.6)} />
      <Label text="“WE BURNED THEM ALL…”" x={0.5} y={0.18} size={0.055} kind="box" at={sec(start)(282.6)} />
      <Label text="“…WHICH THEY REGRETTED TO AN AMAZING DEGREE.”" x={0.5} y={0.3} size={0.038} kind="box" at={sec(start)(283.8)} />
    </AbsoluteFill>
  );
};

// 286.1 "Centuries of Maya knowledge, gone in smoke."
export const GoneInSmokeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 286.6, 289.0);
  const r = rng(11);
  const glyphs = Array.from({ length: 12 }, () => [(r() - 0.5) * 900, r() * 300, r()] as [number, number, number]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ pos: [0, -200] }} vignette={0.75} vignetteColor="#140a08">
        <Gradient w={6000} h={4000} stops={[[0, "#6a4a32"], [1, "#3a2418"]]} z={-41} />
        <Codex y={-300} s={1.0} pages={6} open={1} burn={k * 0.85} seed={6} z={1} />
        <Flame y={-360} size={1.6 * Math.min(1, k * 2)} seed={4} z={1.5} />
        <Glow y={-200} rx={700} ry={400} color="#ff9a4a" alpha={0.4 * Math.min(1, k * 2)} additive z={1.4} />
        <Smoke y={-100} w={600} h={1200} alpha={0.5 * k} color="#6a6060" seed={3} z={2} />
        {glyphs.map(([gx, gy, q], i) => {
          const f = Math.max(0, Math.min(1, k * 3 - q)) * Math.max(0, 1 - k * 1.1 + q * 0.3);
          return f > 0.02 ? <Glyph key={i} x={gx * (0.6 + k)} y={-200 + gy + k * (500 + q * 500)} s={f} size={90} seed={i + 4} paint="#f2e8d0" z={3 + i * 0.001} /> : null;
        })}
      </Stage>
      <Label text="CENTURIES OF KNOWLEDGE" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(286.5)} />
      <Label text="GONE IN SMOKE" x={0.5} y={0.9} size={0.06} kind="box" at={sec(start)(287.9)} />
    </AbsoluteFill>
  );
};

// 289.25 "Today, only four Maya books survive in the whole world."
export const FourBooksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const names = ["DRESDEN", "MADRID", "PARIS", "MEXICO"];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [0, 400] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3a48"], [1, "#1e1e28"]]} z={-41} />
        <Part shape={roundRect(6000, 700, 0)} color="#2a2a34" flat outline={0} y={-650} z={-40} />
        {names.map((n, i) => (
          <X key={n} x={-660 + i * 440} y={-80} s={pop(t, 290.4 + i * 0.18)} z={1 + i * 0.01}>
            <Part shape={roundRect(360, 420, 12)} color="#cfe6ea" flat outline={5} opacity={0.25} />
            <Codex s={0.42} pages={5} open={0.9} seed={i * 3 + 1} z={0.01} />
            <Glow y={260} rx={220} ry={120} color="#fff2c6" alpha={0.35} additive z={-0.01} />
            <Part shape={roundRect(380, 40, 6)} color="#5a4a3a" shade={0.2} y={-230} z={0.02} />
          </X>
        ))}
      </Stage>
      {names.map((n, i) => (
        <Label pin key={n} text={n} x={0.157 + i * 0.229} y={0.8} size={0.035} kind="box" at={sec(start)(290.5 + i * 0.18)} />
      ))}
      <Label text="ONLY 4 SURVIVE" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(290.3)} />
    </AbsoluteFill>
  );
};

// 293.3 "But here's the twist."
export const TwistShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.5, 1.65), y: -330, rot: interpolate(t, [293.3, 294.75], [-0.04, 0.04]) }} light={{ dir: [0.5, 0.5] }} vignette={0.7}>
        <Paper color="#e2d2a8">
          <Sunburst y={-300} r={2400} rays={20} color="#e8d4a0" alt="#dcc490" speed={1.2} z={-39} />
          <Character {...LANDA} x={0} y={-960} s={2.0} z={2} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.idle(frame)} />
        </Paper>
      </Stage>
      <Label text="THE TWIST" x={0.5} y={0.12} size={0.08} kind="title" at={sec(start)(293.8)} />
    </AbsoluteFill>
  );
};

/** A writing desk scene with a book; `writing` animates the quill hand. */
const WritingDesk: React.FC<{ design: React.ComponentProps<typeof Character>; t: number; x?: number; book?: React.ReactNode }> = ({ design, x = 0, book }) => {
  const frame = useCurrentFrame();
  const scrib = Math.sin(frame * 0.9) * 0.08;
  const arm: [number, number] = [1.2 + scrib, 1.0];
  return (
    <X x={x}>
      <Character {...design} x={-240} y={-760} s={1.5} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.3, gaze: [0.4, -0.6] }} pose={{ ...poses.sit(frame), armF: arm }} holdF={<Quill rot={0.6} />} />
      <Desk x={160} y={-760} w={760} h={320} z={1.5} />
      <X x={180} y={-420} z={1.6}>
        <Part shape={roundRect(420, 60, 8)} color="#f2e8d0" shade={0.15} rot={0.02} />
        {book}
      </X>
    </X>
  );
};

// 294.75 "Years later, Landa writes a book about the Maya."
export const LandaWritesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -300 }} light={{ pos: [400, 200] }} vignette={0.7} vignetteColor="#140a08">
        <PlankWall w={6000} h={3000} y={600} color="#8a6a4a" z={-41} />
        <Floorboards w={6000} h={1400} y={-760} color="#6e4a2c" z={-40} />
        <Candle x={460} y={-400} s={1.1} seed={3} z={2} />
        <Glow x={460} y={-200} rx={700} color="#ffd38a" alpha={0.35} additive z={2.1} />
        <WritingDesk design={LANDA} t={t} />
      </Stage>
      <Label text="LANDA'S BOOK ON THE MAYA" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(296.4)} />
      <Label text="c. 1566" x={0.84} y={0.22} size={0.04} kind="box" at={sec(start)(296.9)} />
    </AbsoluteFill>
  );
};

/** Landa's "alphabet" page: Latin letters next to Maya signs. */
const AlphabetPage: React.FC<{ wrong?: number; sounds?: number; s?: number; y?: number; z?: number }> = ({ wrong = 0, sounds = 0, s = 1, y = 0, z = 0 }) => (
  <X y={y} s={s} z={z}>
    <Part shape={roundRect(900, 640, 10)} color="#f2e8d0" shade={0.15} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <X key={i} x={-300 + (i % 3) * 300} y={130 - Math.floor(i / 3) * 260} z={0.01}>
        <Glyph x={60} size={100} seed={i * 5 + 2} paint="#e8d8b8" />
        <Part shape={roundRect(70, 70, 10)} color={mixHex("#efe4cc", "#d9a441", sounds)} flat outline={3} x={-70} />
      </X>
    ))}
    {wrong > 0 ? (
      <X z={0.1} s={wrong}>
        <Line pts={[[-360, -260], [360, 260]]} width={36} color="#c0392b" />
        <Line pts={[[-360, 260], [360, -260]]} width={36} color="#c0392b" />
      </X>
    ) : null}
  </X>
);

// 297.95 "In it, with help from a Maya noble, he tries to write down a Maya 'alphabet.'"
export const AlphabetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ pos: [400, 200] }} vignette={0.65} vignetteColor="#140a08">
        <PlankWall w={6000} h={3000} y={600} color="#8a6a4a" z={-41} />
        <Floorboards w={6000} h={1400} y={-760} color="#6e4a2c" z={-40} />
        <Character {...LANDA} x={-700} y={-820} s={1.45} z={2} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.2 }} pose={poses.point(frame)} />
        <Character {...MAYA_PRIEST(2)} hat="headband" x={720} y={-820} s={1.45} z={2} facing={-1} look={0.5} talking={t > 298.6 && t < 300.2} expression={{ eyes: "open", mouth: "flat", brows: 0.3 }} pose={t < 300.2 ? poses.talk(frame, 4) : poses.blendAt(t, 300.2, poses.talk(frame, 4), poses.idle(frame, 2))} />
        <AlphabetPage y={40} s={pop(t, 300.4) * 0.85} z={1} />
      </Stage>
      <Label text="WITH A MAYA NOBLE" x={0.78} y={0.1} size={0.045} kind="box" at={sec(start)(299.5)} />
      <Label text="A MAYA “ALPHABET”" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(301.9)} />
      {["A", "B", "C"].map((l, i) => (
        <Label pin key={l} text={l} x={0.36 + i * 0.133} y={0.39} size={0.04} kind="tag" color="#2a2026" at={sec(start)(300.6 + i * 0.1)} />
      ))}
    </AbsoluteFill>
  );
};

// 303.2 "It's mostly wrong."
export const MostlyWrongShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.2), y: 0, shake: hitAt(t, 303.9, 0.3) * 6 }} light={{ pos: [400, 200] }} vignette={0.6}>
        <PlankWall w={6000} h={3000} y={600} color="#8a6a4a" z={-41} />
        <AlphabetPage y={0} wrong={ramp(t, 303.8, 304.0, Easing.out(Easing.back(2)))} z={1} />
      </Stage>
      <Label text="MOSTLY WRONG" x={0.5} y={0.86} size={0.07} kind="box" at={sec(start)(303.9)} />
    </AbsoluteFill>
  );
};

// 304.7 "But in the 1950s, a Russian scholar named Yuri Knorozov looks again."
export const KnorozovShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -160 }} light={{ pos: [300, 300] }} vignette={0.7} vignetteColor="#0e0a10" bgBlur={5}
        bg={
          <>
            <PlankWall w={6000} h={3000} y={600} color="#6a6a78" z={-41} />
            <BlindsWindow x={-600} y={260} w={520} h={520} z={-40} />
            <Floorboards w={6000} h={1400} y={-760} color="#5a4a3a" z={-39} />
          </>
        }
      >
        <HangingLamp x={160} y={540} cord={160} cone={0.6} coneW={700} z={-10} />
        <Character {...KNOROZOV} x={-260} y={-920} s={1.8} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.4, gaze: [0.5, -0.4] }} pose={{ ...poses.sit(frame), armF: [1.3, 1.1] }} />
        <Desk x={340} y={-920} w={900} h={360} z={1.5} />
        <X x={320} z={1.6}><AlphabetPage y={-530} s={0.4} /></X>
        <Cat x={700} y={-560} s={0.95} look={-0.6} z={1.7} />
      </DepthStage>
      <Label text="1950s · USSR" x={0.2} y={0.1} size={0.055} kind="box" at={sec(start)(305.3)} />
      <Label text="YURI KNOROZOV" x={0.68} y={0.1} size={0.06} kind="box" at={sec(start)(307.6)} />
      <Label text="(AND HIS CAT, ASYA)" x={0.82} y={0.22} size={0.035} kind="box" at={sec(start)(308.4)} />
    </AbsoluteFill>
  );
};

// 309.25 "He realizes that Landa's alphabet is a list of sounds."
export const SoundsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.16), y: 0 }} light={{ pos: [300, 300] }} vignette={0.6}>
        <PlankWall w={6000} h={3000} y={600} color="#6a6a78" z={-41} />
        <AlphabetPage y={0} sounds={ramp(t, 310.9, 311.6)} z={1} />
      </Stage>
      {["BA", "KA", "KU", "MA", "NA", "TU"].map((l, i) => (
        <Label pin key={l} text={l} x={0.344 + (i % 3) * 0.156} y={0.38 + Math.floor(i / 3) * 0.24} size={0.035} kind="box" at={sec(start)(311.0 + i * 0.08)} />
      ))}
      <Label text="NOT LETTERS — SOUNDS" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(311.8)} />
    </AbsoluteFill>
  );
};

/** Golden key (origin = bow centre, blade along +x). */
const Key: React.FC<{ x?: number; y?: number; rot?: number; s?: number; z?: number }> = ({ x = 0, y = 0, rot = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} rot={rot} s={s} z={z}>
    <Part shape={circle(70)} color="#f2c84a" shade={0.28} />
    <Part shape={circle(30)} color="#3a2a26" flat outline={4} z={0.001} />
    <Part shape={roundRect(260, 36, 10)} color="#f2c84a" shade={0.28} x={180} z={-0.001} />
    {[0, 1].map((k) => (
      <Part key={k} shape={roundRect(30, 60, 6)} color="#f2c84a" shade={0.28} x={250 - k * 60} y={-40} z={-0.002} />
    ))}
  </X>
);

// 312.6 "That's the key. It helps unlock Maya writing."
export const KeyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const turn = ramp(t, 313.6, 314.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper color="#e2d2a8">
          <GlyphPanel x={160} y={-40} cols={4} rows={3} size={150} seed={13} reveal={ramp(t, 314.0, 315.3)} z={1} />
          <Key x={-660} y={-40} rot={turn * -Math.PI / 2} s={pop(t, 312.9)} z={2} />
          <Glow x={160} y={-40} rx={800} ry={500} color="#fff2c6" alpha={0.35 * ramp(t, 314.0, 314.6)} additive z={1.5} />
        </Paper>
      </Stage>
      <Label text="THE KEY" x={0.2} y={0.12} size={0.07} kind="title" at={sec(start)(313.1)} />
      <Label text="MAYA WRITING UNLOCKED" x={0.6} y={0.9} size={0.05} kind="box" at={sec(start)(314.5)} />
    </AbsoluteFill>
  );
};

// 315.55 "So the man who burned the Maya books also helped us read them."
export const BurnedHelpedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a1a14"], [1, "#1a0a08"]]} x={-1500} z={-41} />
        <Gradient w={3000} h={4000} stops={[[0, "#e9dcbc"], [1, "#d4c49c"]]} x={1500} z={-40.9} />
        <Line pts={[[0, -2000], [0, 2000]]} width={10} z={-40} />
        <X x={-480} y={-420} z={1}>
          <Codex s={0.6} pages={5} open={1} burn={ramp(t, 315.8, 317.0)} seed={8} />
          <Flame y={-30} size={1.4} seed={3} z={0.1} />
          <Glow rx={420} color="#ff9a4a" alpha={0.4} additive z={0.05} />
        </X>
        <GlyphPanel x={480} y={-360} cols={3} rows={2} size={130} seed={21} reveal={ramp(t, 317.4, 318.4)} z={1} />
        <Character {...LANDA} x={0} y={-920} s={1.6} z={2} look={0.3} expression={{ eyes: "half", mouth: "smirk", brows: 0.4 }} pose={poses.shrug(t - 316.9)} />
      </Stage>
      <Label text="BURNED THEM" x={0.25} y={0.1} size={0.055} kind="box" at={sec(start)(316.3)} />
      <Label text="HELPED US READ THEM" x={0.75} y={0.1} size={0.055} kind="box" at={sec(start)(317.6)} />
    </AbsoluteFill>
  );
};
