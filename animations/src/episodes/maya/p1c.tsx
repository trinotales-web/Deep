import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, Gradient, QuestionMark, Spear, roundRect, roundPoly, circle, ellipse, poly, blob, ramp, push, hitAt, absT, rng, mixHex, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { crowdSpots } from "../../kit/crowd";
import { Character, poses, reachArm } from "../../kit/character";
import {
  MesoMap, mesoXY, siteXY, LidarReveal, MayaPyramid, TikalTemple, Stela, Glyph, GlyphPanel, MayaNumber, MayaShell, Codex, CalendarGear, LongCount, StingraySpine,
  ThornRope, MayaBowl, StonePanel, Flame, Smoke, Sunburst, Cloud, CornPlant, Globe, SpaceStars, Sun, Jungle,
} from "../../kit/env";
import { cloudShape } from "../../kit/env/nature";
import { sec, pop, useScr } from "../../kit/shot";
import { JungleSet, PlazaSet, PalaceRoom, Paper, Village } from "./sets";
import { MAYA_KING, MAYA_QUEEN, MAYA_PRIEST, MAYA_COMMONER, MAYA_WOMAN, JAGUAR_WARRIOR, ITZA_WARRIOR, SCIENTIST } from "./cast";
import { upright } from "./p1a";

// ───────────────────────── golden age ─────────────────────────

/** Classic Maya kingdoms at their real sites (lon, lat). */
export const KINGDOMS: [string, number, number][] = [
  ["tikal", -89.62, 17.22], ["calakmul", -89.81, 18.1], ["palenque", -92.05, 17.48], ["copan", -89.14, 14.84], ["caracol", -89.12, 16.76],
  ["yaxchilan", -90.97, 16.9], ["piedras", -91.26, 17.17], ["naranjo", -89.25, 17.13], ["dospilas", -90.18, 16.44], ["quirigua", -89.04, 15.27],
  ["tonina", -92.01, 16.9], ["bonampak", -91.07, 16.7], ["uaxactun", -89.63, 17.39], ["seibal", -90.06, 16.51], ["holmul", -89.27, 17.31],
  ["edzna", -90.23, 19.6], ["becan", -89.47, 18.52], ["coba", -87.73, 20.49], ["uxmal", -89.77, 20.36], ["ekbalam", -88.13, 20.89],
  ["lamanai", -88.65, 17.76], ["altunha", -88.35, 17.76], ["machaquila", -89.95, 16.27], ["cancuen", -90.03, 15.99], ["xunantunich", -89.14, 17.09],
];
const KCOL = ["#c0392b", "#3a9ac9", "#d9a441", "#8a5aa8", "#3fa07a", "#e07a3a"];

export const KingdomsMap: React.FC<{ ppd: number; center: [number, number]; k?: number; crowns?: number; pins?: string[] }> = ({ ppd, center, k = 1, crowns = 0, pins = [] }) => (
  <>
    <MesoMap ppd={ppd} center={center} maya={1} pins={pins} />
    {KINGDOMS.map(([name, lon, lat], i) => {
      const [x, y] = mesoXY(lon, lat, ppd, center);
      const q = Math.min(1, Math.max(0, k * KINGDOMS.length - i));
      return q > 0 ? (
        <X key={name} x={x} y={y} s={q} z={1 + i * 0.001}>
          <Part shape={circle(ppd * 0.16)} color={KCOL[i % KCOL.length]} flat outline={3.5} />
          {crowns > 0 ? (
            <X y={ppd * 0.16} s={crowns * (ppd / 120)} z={0.001}>
              <Part shape={poly([[-26, 0], [26, 0], [30, 34], [14, 18], [0, 40], [-14, 18], [-30, 34]])} color="#f2c84a" flat outline={3} />
            </X>
          ) : null}
        </X>
      ) : null;
    })}
  </>
);

// 195.8 "After that, the Maya enter their golden age, from around AD 250 to 900."
export const GoldenAgeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <PlazaSet mood="dawn" horizon={-260}>
          <Sunburst y={500} r={2400} rays={22} color="#f6d890" alt="#f0cc7a" speed={0.3} z={-39.5} />
          {[-600, -280, 120, 460].map((x, i) => (
            <Character key={x} {...(i % 2 ? MAYA_WOMAN(i) : MAYA_COMMONER(i))} x={x} y={-600} s={1.0} z={2 + i * 0.01} facing={i % 2 ? -1 : 1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.walk(frame + i * 6, 0.6)} />
          ))}
        </PlazaSet>
      </Stage>
      <Label text="THE GOLDEN AGE" x={0.5} y={0.1} size={0.07} kind="title" at={sec(start)(197.6)} />
      <Label text="AD 250 – 900" x={0.5} y={0.21} size={0.05} kind="box" at={sec(start)(199.1)} />
    </AbsoluteFill>
  );
};

// 200.9 "Cities like Tikal, Calakmul, Palenque, Copán and Caracol grow huge."
export const CitiesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = 150;
  const center: [number, number] = [-90.4, 16.6];
  const z = push(frame, dur, 1.0, 1.04);
  const cities: [string, string, number, number, number][] = [
    ["tikal", "TIKAL", 201.53, -89.62, 17.22], ["calakmul", "CALAKMUL", 202.4, -89.81, 18.1], ["palenque", "PALENQUE", 203.32, -92.05, 17.48],
    ["copan", "COPÁN", 204.26, -89.14, 14.84], ["caracol", "CARACOL", 205.19, -89.12, 16.76],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: z }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} />
        {cities.map(([key, , at, lon, lat], i) => {
          const [x, y] = mesoXY(lon, lat, ppd, center);
          const k = ramp(t, at - 0.1, at + 0.2, Easing.out(Easing.back(2)));
          return k > 0 ? (
            <X key={key} x={x} y={y} s={0.22 * k} z={1 + i * 0.01}>
              <TikalTemple color={i % 2 ? "#e8d2b0" : "#efe4cc"} />
            </X>
          ) : null;
        })}
      </Stage>
      {cities.map(([key, name, at, lon, lat]) => {
        const [x, y] = mesoXY(lon, lat, ppd, center);
        return <Label pin key={key} text={name} {...sc(x, y - 40, z)} size={0.034} kind="box" at={sec(start)(at)} />;
      })}
    </AbsoluteFill>
  );
};

// 207.1 "In 2018, laser scans over Guatemala found more than 60,000 hidden houses, walls and roads."
export const Lidar2018Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Gradient w={6000} h={4000} stops={[[0, "#14201a"], [1, "#0a100c"]]} z={-41} />
        <LidarReveal w={1700} h={940} k={ramp(t, 207.6, 211.5)} city seed={9} z={1} />
      </Stage>
      <Label text="2018" x={0.14} y={0.08} size={0.06} kind="box" at={sec(start)(207.4)} />
      <Label text="60,000+ HIDDEN STRUCTURES" x={0.6} y={0.08} size={0.05} kind="box" at={sec(start)(210.7)} />
    </AbsoluteFill>
  );
};

// 214.5 "Scientists now think 10 to 15 million people may have lived in the Maya lowlands."
export const MillionsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const spots = crowdSpots({ n: 56, x0: -1300, x1: 1300, yFar: -250, yNear: -640, sFar: 0.3, sNear: 0.6, rows: 4, seed: 17 });
  const r = rng(17);
  const order = spots.map(() => r());
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -100 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <PlazaSet mood="day" horizon={-160}>
          {spots.filter((p) => order[p.i] < ramp(t, 215.0, 218.6)).map(({ x, y, s, i }) => (
            <Character key={i} {...(i % 3 ? MAYA_COMMONER(i) : MAYA_WOMAN(i))} x={x} y={y} s={s} z={2 + i * 0.001} facing={i % 2 ? 1 : -1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} shadow={false} />
          ))}
        </PlazaSet>
      </Stage>
      <Label text="10–15 MILLION PEOPLE" x={0.5} y={0.1} size={0.065} kind="title" at={sec(start)(216.0)} />
    </AbsoluteFill>
  );
};

// 220.1 "But here's the strange part."
export const StrangePartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65} bgBlur={6} bg={<PlazaSet mood="day" horizon={-160} />}>
        <Character {...MAYA_PRIEST(0)} x={-60} y={-920} s={2.3} z={2} look={0.3} expression={{ eyes: "half", mouth: "smirk", brows: 0.7 }} pose={poses.think} />
      </DepthStage>
      <Label text="THE STRANGE PART" x={0.78} y={0.12} size={0.05} kind="box" at={sec(start)(220.7)} />
    </AbsoluteFill>
  );
};

// 221.8 "There is no Maya empire."
export const NoEmpireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 100;
  const center: [number, number] = [-89.8, 17.6];
  const k = ramp(t, 222.0, 222.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} />
        {k > 0 ? (
          <Line pts={Array.from({ length: 40 }, (_, i) => {
            const a = (i / 39) * Math.PI * 2 * k;
            return [Math.cos(a) * 460, Math.sin(a) * 520 - 40] as [number, number];
          })} width={12} color="#c0392b" z={1} />
        ) : null}
      </Stage>
      <Label text="NO EMPIRE" x={0.5} y={0.5} size={0.12} kind="stamp" rotate={-8} at={sec(start)(222.9)} />
    </AbsoluteFill>
  );
};

// 223.9 "No emperor. No capital."
export const NoEmperorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const x1 = ramp(t, 224.3, 224.6);
  const x2 = ramp(t, 225.2, 225.5);
  const Cross: React.FC<{ k: number; x: number; y: number }> = ({ k, x, y }) =>
    k > 0 ? (
      <X x={x} y={y} z={5}>
        <Line pts={[[-180, -180], [-180 + 360 * k, -180 + 360 * k]]} width={30} color="#c0392b" />
        <Line pts={[[180, -180], [180 - 360 * k, -180 + 360 * k]]} width={30} color="#c0392b" />
      </X>
    ) : null;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: -40 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <PalaceRoom floorY={-420} throne>
          <X x={-420} y={-60} z={1}>
            <Part shape={poly([[-120, 0], [120, 0], [150, 120], [80, 70], [0, 160], [-80, 70], [-150, 120]])} color="#f2c84a" shade={0.24} />
            {[-80, 0, 80].map((xx) => (
              <Part key={xx} shape={circle(16)} color="#3fa07a" flat outline={3} x={xx} y={40} z={0.001} />
            ))}
          </X>
          <Cross k={x1} x={-420} y={10} />
          <X x={420} y={-60} z={1}>
            <Part shape={poly(Array.from({ length: 10 }, (_, i) => {
              const a = Math.PI / 2 + (i * Math.PI) / 5;
              const rr = i % 2 ? 60 : 150;
              return [Math.cos(a) * rr, Math.sin(a) * rr] as [number, number];
            }))} color="#c0392b" shade={0.24} />
          </X>
          <Cross k={x2} x={420} y={-60} />
        </PalaceRoom>
      </Stage>
      <Label text="NO EMPEROR" x={0.28} y={0.12} size={0.055} kind="box" at={sec(start)(224.2)} />
      <Label text="NO CAPITAL" x={0.72} y={0.12} size={0.055} kind="box" at={sec(start)(225.2)} />
    </AbsoluteFill>
  );
};

// 225.95 "Just dozens of kingdoms, each with its own holy king."
export const DozensKingdomsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <KingdomsMap ppd={120} center={[-89.9, 17.4]} k={ramp(t, 226.2, 227.6)} crowns={ramp(t, 228.6, 229.2)} />
      </Stage>
      <Label text="DOZENS OF KINGDOMS" x={0.5} y={0.08} size={0.055} kind="box" at={sec(start)(226.4)} />
      <Label text="EACH WITH A HOLY KING" x={0.5} y={0.92} size={0.045} kind="box" at={sec(start)(228.7)} />
    </AbsoluteFill>
  );
};

// 229.9 "They trade, they marry each other's daughters, and they fight all the time."
export const TradeMarryFightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const p1 = ramp(t, 230.0, 230.3);
  const p2 = ramp(t, 230.95, 231.25);
  const p3 = ramp(t, 232.8, 233.1);
  const panel = (k: number, x: number, children: React.ReactNode, bg: string) =>
    k > 0 ? (
      <X x={x} y={-20} s={0.9 + k * 0.1} z={1}>
        <Part shape={roundRect(600, 880, 20)} color={bg} shade={0.12} />
        <X z={0.01}>{children}</X>
      </X>
    ) : null;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper color="#e6d6ae" />
        {panel(p1, -640, (
          <>
            <Character {...MAYA_KING(0)} x={-150} y={-380} s={0.8} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={{ ...poses.idle(frame), armF: [1.5, 0.3] }} />
            <Character {...MAYA_KING(1)} x={150} y={-380} s={0.8} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={{ ...poses.idle(frame, 2), armF: [1.5, 0.3] }} />
            {Array.from({ length: 6 }, (_, i) => (
              <Part key={i} shape={ellipse(14, 10)} color="#6a3a22" shade={0.25} x={-20 + (i % 3) * 20} y={-130 + Math.floor(i / 3) * 16} z={0.5} />
            ))}
          </>
        ), "#f2e6c4")}
        {panel(p2, 0, (
          <>
            <Character {...MAYA_KING(2)} x={-160} y={-380} s={0.8} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.idle(frame)} />
            <Character {...MAYA_QUEEN(1)} x={20} y={-380} s={0.72} look={0.5} expression={{ eyes: "closed", mouth: "smile", blush: true }} pose={poses.idle(frame, 3)} />
            <Character {...MAYA_KING(0)} x={180} y={-380} s={0.8} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 4)} />
            <Part shape={blob([[0, 0], [-20, 20], [-20, 40], [0, 30], [20, 40], [20, 20]], 6)} color="#e8574a" flat outline={3} y={220} s={1.4} z={0.5} />
          </>
        ), "#f6e2d0")}
        {panel(p3, 640, (
          <>
            <Character {...JAGUAR_WARRIOR(0)} x={-150} y={-380} s={0.8} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ ...poses.idle(frame), armF: [1.8, 0.2] }} holdF={<Spear rot={upright([1.8, 0.2])} length={500} tip="#2a2228" />} />
            <Character {...ITZA_WARRIOR(1)} x={150} y={-380} s={0.8} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "teeth", brows: -0.9 }} pose={{ ...poses.idle(frame, 2), armF: [1.8, 0.2] }} holdF={<Spear rot={upright([1.8, 0.2])} length={500} tip="#2a2228" />} />
          </>
        ), "#f2d6c4")}
      </Stage>
      <Label text="TRADE" x={0.17} y={0.1} size={0.05} kind="box" at={sec(start)(230.1)} />
      <Label text="MARRY" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(231.1)} />
      <Label text="FIGHT" x={0.83} y={0.1} size={0.05} kind="box" at={sec(start)(232.9)} />
    </AbsoluteFill>
  );
};

// 234.45 "So here's the rule. The Maya never have one king."
export const TheRuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.round(ramp(t, 236.4, 237.8) * 5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -60 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <PalaceRoom floorY={-460} throne={false}>
          {Array.from({ length: n }, (_, i) => (
            <Character key={i} {...MAYA_KING(i)} x={-760 + i * 380} y={-700} s={0.92} z={2 + i * 0.01} facing={i < 3 ? 1 : -1} look={0.4} expression={{ eyes: i % 2 ? "half" : "open", mouth: i % 2 ? "smirk" : "flat", brows: -0.3 }} pose={i % 3 === 0 ? poses.handsOnHips : poses.idle(frame, i)} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="THE RULE" x={0.5} y={0.1} size={0.08} kind="title" at={sec(start)(235.4)} />
      <Label text="NEVER ONE KING" x={0.5} y={0.22} size={0.055} kind="box" at={sec(start)(237.1)} />
    </AbsoluteFill>
  );
};

// 238.85 "Remember it, because it changes everything later."
export const RememberRuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tap = Math.max(0, Math.sin(frame * 0.6));
  const arm: [number, number] = [1.7 - tap * 0.5, 0.5];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={5} bg={<PlazaSet mood="day" horizon={-160} />}>
        <X x={300} y={-640} z={1}>
          <Stela h={760} />
          <X y={420} z={0.1}>
            {Array.from({ length: Math.round(ramp(t, 239.0, 241.0) * 6) }, (_, i) => (
              <Glyph key={i} seed={i + 70} size={90} color="#cbbf9e" ink="#6a5e48" x={(i % 2 ? 1 : -1) * 55} y={140 - Math.floor(i / 2) * 110} z={i * 0.001} />
            ))}
          </X>
        </X>
        <Character {...MAYA_COMMONER(1)} x={-380} y={-900} s={1.9} z={2} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.2 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<X rot={Math.PI / 2}><Line pts={[[0, -20], [0, 90]]} width={10} color="#6e4a2c" /><Part shape={poly([[-10, 90], [10, 90], [0, 130]])} color="#3a3a44" flat outline={3} /></X>} />
      </DepthStage>
      <Label text="REMEMBER THE RULE" x={0.24} y={0.1} size={0.05} kind="box" at={sec(start)(239.0)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── holy kings and blood ─────────────────────────

// 242.35 "Each king is called a holy lord."
export const HolyLordShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <PalaceRoom floorY={-560} throne>
          <Character {...MAYA_KING(0)} x={0} y={-460} s={1.7} z={2} look={0.15} expression={{ eyes: "half", mouth: "smirk", brows: -0.3 }} pose={poses.sit(frame)} />
          {[-760, 760].map((x, i) => (
            <Character key={x} {...MAYA_PRIEST(i)} x={x} y={-760} s={1.4} z={3} facing={x < 0 ? 1 : -1} look={0.4} expression={{ eyes: "closed", mouth: "smile" }} pose={{ ...poses.sit(frame), headTilt: -0.2, armF: [1.0, 1.6], armB: [0.8, 1.6] }} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="K'UHUL AJAW" sub="HOLY LORD" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(243.9)} />
    </AbsoluteFill>
  );
};

// 244.9 "People believe he talks to the gods and keeps the rain coming."
export const RainKingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rain = ramp(t, 247.3, 247.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 120 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood={rain > 0.5 ? "storm" : "day"} horizon={-420} ground="#a8b86a">
          <MayaPyramid x={0} y={-420} w={900} h={500} tiers={6} top={0.42} templeW={0} color="#efe4cc" z={-10} />
          <Character {...MAYA_KING(0)} x={0} y={80} s={0.95} z={-5} look={0.1} expression={{ eyes: "closed", mouth: "o", brows: 0.2 }} pose={poses.armsUp(frame)} />
          {[-600, 0, 600].map((x, i) => (
            <Part key={x} shape={cloudShape(620, 240, 6, i + 2)} color={mixHex("#ffffff", "#7a8494", rain)} shade={0.2} x={x} y={820 - (1 - rain) * 200} z={-6} />
          ))}
          {rain > 0
            ? Array.from({ length: 70 }, (_, i) => (
                <Line key={i} pts={[[((i * 173) % 2600) - 1300, 760 - ((frame * 24 + i * 67) % 1400)], [((i * 173) % 2600) - 1320, 720 - ((frame * 24 + i * 67) % 1400)]]} width={3.5} color="#c8d8e8" z={5} />
              ))
            : null}
          {[-900, 900].map((x, i) => (
            <Character key={x} {...MAYA_COMMONER(i)} x={x} y={-760} s={1.3} z={3} facing={x < 0 ? 1 : -1} look={0.4} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame + i * 7)} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="TALKS TO THE GODS" x={0.22} y={0.1} size={0.045} kind="box" at={sec(start)(245.6)} />
      <Label text="BRINGS THE RAIN" x={0.78} y={0.1} size={0.045} kind="box" at={sec(start)(247.4)} />
    </AbsoluteFill>
  );
};

/** Vision serpent rising from smoke (Maya bloodletting imagery). Origin = smoke base. */
const VisionSerpent: React.FC<{ k: number; z?: number }> = ({ k, z = 0 }) => {
  const frame = useCurrentFrame();
  const pts: [number, number][] = Array.from({ length: 12 }, (_, i) => [Math.sin(i * 0.8 + frame * 0.06) * 110 * (i / 11), i * 42 * k]);
  const head = pts[pts.length - 1];
  return (
    <X z={z}>
      <Line pts={pts} smooth width={90} color="#3fa07a" />
      <Line pts={pts} smooth width={36} color="#f2c84a" z={0.001} />
      <X x={head[0]} y={head[1]} s={1.5} z={0.002}>
        <Part shape={blob([[-50, -30], [60, -40], [110, 0], [70, 40], [-40, 50]], 8)} color="#3fa07a" shade={0.24} />
        <Part shape={circle(14)} color="#ffffff" flat outline={3} x={30} y={14} z={0.001} />
        <Part shape={circle(6)} color="#211b20" flat outline={0} x={34} y={14} z={0.002} />
        {Array.from({ length: 5 }, (_, i) => (
          <X key={i} x={-40} y={20} rot={1.6 + i * 0.3} z={-0.001}>
            <Part shape={blob([[0, 0], [-10, 50], [0, 110], [10, 50]], 6)} color={i % 2 ? "#3a9ac9" : "#3fa07a"} shade={0.2} />
          </X>
        ))}
      </X>
    </X>
  );
};

// 248.4 "And the gods need blood. Royal blood."
export const GodsNeedBloodShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: 80 }} light={{ pos: [0, -100] }} vignette={0.8} vignetteColor="#100608">
        <PalaceRoom floorY={-460} dim={0.55} throne={false}>
          <MayaBowl x={0} y={-460} w={340} papers z={2} />
          <Flame x={0} y={-330} size={1.0} seed={3} z={2.1} />
          <Smoke x={0} y={-260} w={260} h={900} alpha={0.5} color="#6a5a68" seed={4} z={2.2} />
          <X y={-200} z={2.3}>
            <VisionSerpent k={ramp(t, 249.0, 250.6)} />
          </X>
          <Glow y={-380} rx={600} color="#ff7a4a" alpha={0.35} additive z={2.05} />
        </PalaceRoom>
      </Stage>
      <Label text="THE GODS NEED BLOOD" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(248.6)} />
      <Label text="ROYAL BLOOD" x={0.78} y={0.3} size={0.06} kind="box" at={sec(start)(250.0)} />
    </AbsoluteFill>
  );
};

// 250.95 "Kings pierce their own bodies with stingray spines."
export const StingrayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wince = t > 251.9;
  const arm: [number, number] = [1.25, 1.2];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60 }} light={{ pos: [300, 200] }} vignette={0.7} vignetteColor="#140a10" bgBlur={6} bg={<PalaceRoom floorY={-560} dim={0.35} throne={false} />}>
        <Character {...MAYA_KING(0)} x={-160} y={-940} s={2.3} z={2} look={0.45} expression={wince ? { eyes: "closed", mouth: "teeth", brows: 0.8, sweat: true } : { eyes: "open", mouth: "flat", brows: 0.3 }} pose={{ ...poses.idle(frame), armF: arm, armB: [0.6, 0.5] }} holdF={<StingraySpine rot={upright(arm) + 2.8} len={220} />} />
        <MayaBowl x={460} y={-560} w={300} papers z={2.1} />
      </DepthStage>
      <Label text="STINGRAY SPINE" x={0.78} y={0.12} size={0.05} kind="box" at={sec(start)(252.6)} />
    </AbsoluteFill>
  );
};

/** Design tinted to carved stone (for reliefs). */
type D = Omit<React.ComponentProps<typeof Character>, "pose" | "expression">;
const stone = (d: D): D => ({
  ...d,
  skin: "#c8bea6",
  hatColor: "#b8ae96",
  hatAccent: "#b8ae96",
  hairColor: "#a89e86",
  earspool: d.earspool ? "#b8ae96" : null,
  outfit: {
    ...d.outfit,
    top: "#bfb59c",
    bottom: d.outfit.bottom ? "#b8ae96" : undefined,
    boots: "#b0a68e",
    belt: d.outfit.belt ? "#b0a68e" : d.outfit.belt,
    beads: d.outfit.beads ? "#b0a68e" : null,
    spots: d.outfit.spots ? "#a89e86" : null,
    trim: d.outfit.trim ? "#b0a68e" : null,
    loin: d.outfit.loin ? "#b0a68e" : null,
    collarColor: "#b0a68e",
  },
});

// 253.9 "One famous carving shows a queen named Lady Xook."
export const LintelShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3238"], [1, "#1a1418"]]} z={-41} />
        <StonePanel w={1300} h={820} color="#c8bea6" z={1}>
          <Character {...stone(MAYA_KING(0))} x={-260} y={-380} s={1.0} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={{ ...poses.idle(frame), armF: [2.6, 0.4] }} holdF={<X rot={upright([2.6, 0.4])}><Line pts={[[0, -40], [0, 160]]} width={14} color="#a89e86" /><Part shape={blob([[-20, 160], [0, 230], [24, 160]], 6)} color="#b0a68e" flat outline={3} /></X>} />
          <Character {...stone(MAYA_QUEEN(0))} x={260} y={-380} s={0.95} facing={-1} look={0.5} expression={{ eyes: "closed", mouth: "o" }} pose={{ ...poses.sit(frame), armF: [1.6, 0.6] }} />
          {Array.from({ length: 6 }, (_, i) => (
            <Glyph key={i} seed={i + 90} size={80} color="#c8bea6" ink="#8a806a" x={-560 + (i % 2) * 90} y={300 - Math.floor(i / 2) * 90} z={0.01} />
          ))}
        </StonePanel>
      </Stage>
      <Label text="LADY XOOK" sub="YAXCHILAN LINTEL 24, AD 709" x={0.5} y={0.08} size={0.05} kind="box" at={sec(start)(256.4)} />
    </AbsoluteFill>
  );
};

// 257.0 "She's pulling a rope covered in thorns through her own tongue."
export const ThornRopeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pull = ramp(t, 257.3, 259.8);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -60 }} light={{ pos: [400, 100] }} vignette={0.75} vignetteColor="#140a10" bgBlur={6} bg={<PalaceRoom floorY={-560} dim={0.4} throne={false} />}>
        <Character {...MAYA_QUEEN(0)} x={-80} y={-960} s={2.4} z={2} look={0.45} expression={{ eyes: "closed", mouth: "o", brows: 0.9, sweat: true }} pose={{ ...poses.sit(frame), armF: [2.2, 0.5], armB: [0.8, 0.8] }} />
        <X x={-80 + 2.4 * 58} y={-960 + 2.4 * 270} z={2.5}>
          <ThornRope len={420 + pull * 140} />
        </X>
        <MayaBowl x={300} y={-560} w={320} papers z={2.1} />
      </DepthStage>
      <Label text="A ROPE OF THORNS" x={0.78} y={0.12} size={0.05} kind="box" at={sec(start)(258.4)} />
    </AbsoluteFill>
  );
};

// 260.55 "Her husband, the king, holds a torch for her."
export const TorchForHerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [2.5, 0.4];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ pos: [-300, 300] }} vignette={0.75} vignetteColor="#140a10">
        <PalaceRoom floorY={-560} dim={0.35} throne={false}>
          <Character {...MAYA_KING(1)} x={-380} y={-900} s={1.9} z={2} look={0.45} expression={{ eyes: "happy", mouth: "grin", brows: 0.2 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<X rot={upright(arm)}><Line pts={[[0, -40], [0, 170]]} width={14} color="#6e4a2c" /><Flame y={180} size={0.8} seed={3} /><Glow y={190} rx={420} color="#ffb35a" alpha={0.5} additive /></X>} />
          <Character {...MAYA_QUEEN(0)} x={420} y={-940} s={1.9} z={2} facing={-1} look={0.45} expression={{ eyes: "closed", mouth: "o", brows: 0.9 }} pose={{ ...poses.sit(frame), armF: [2.2, 0.5] }} />
        </PalaceRoom>
      </Stage>
      <Label text="THE KING HOLDS THE TORCH" x={0.5} y={0.1} size={0.045} kind="box" at={sec(start)(262.1)} />
    </AbsoluteFill>
  );
};

// 263.5 "Romantic."
export const RomanticShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: 1.25, y: -20 }} light={{ pos: [-300, 300] }} vignette={0.75} vignetteColor="#140a10" bgBlur={8} bg={<PalaceRoom floorY={-560} dim={0.35} throne={false} />}>
        <Character {...MAYA_QUEEN(0)} x={0} y={-940} s={2.5} z={2} look={0.05} expression={{ eyes: "half", mouth: "flat", brows: -0.2 }} pose={poses.sit(frame)} />
      </DepthStage>
      <Label text="ROMANTIC." x={0.78} y={0.14} size={0.07} kind="title" at={sec(start)(263.7)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── writing and math ─────────────────────────

/** Scribe's desk with bark paper and a shell ink pot. */
const ScribeDesk: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(700, 40, 10)} color="#8a5a32" shade={0.24} y={180} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={roundRect(40, 180, 8)} color="#6e4a2c" shade={0.24} x={k * 300} y={90} z={-0.01} />
    ))}
    <Part shape={roundRect(300, 14, 4)} color="#f2e8d0" flat outline={3} y={208} rot={-0.04} z={0.01} />
    <MayaShell x={220} y={214} size={70} z={0.02} />
  </X>
);

// 265.0 "And when they're not bleeding or fighting, the Maya are doing math."
export const DoingMathShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <PalaceRoom floorY={-560} throne={false}>
          <ScribeDesk x={80} y={-560} s={1.2} z={2} />
          <Character {...MAYA_PRIEST(1)} x={-60} y={-700} s={2.0} z={1.9} look={0.45} expression={{ eyes: "half", mouth: "flat", brows: 0.3, gaze: [0.5, -0.7] }} pose={{ ...poses.sit(frame), armF: [1.4, 0.8] }} />
          {[[-460, 260, 3], [380, 300, 8], [560, 120, 13]].map(([x, y, n], i) => (
            <MayaNumber key={i} n={n} size={0.8 * pop(t, 267.6 + i * 0.25)} x={x} y={y} color="#c0392b" z={3} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="MATH" x={0.5} y={0.1} size={0.07} kind="title" at={sec(start)(268.3)} />
    </AbsoluteFill>
  );
};

// 269.1 "They have one of the most advanced writing systems of the ancient Americas."
export const WritingSystemShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#4a4038"], [1, "#2a2420"]]} z={-41} />
        <GlyphPanel cols={6} rows={4} size={120} seed={3} reveal={ramp(t, 269.3, 272.6)} z={1} />
      </Stage>
      <Label text="MAYA WRITING" x={0.5} y={0.08} size={0.06} kind="box" at={sec(start)(270.7)} />
    </AbsoluteFill>
  );
};

/** Jaguar-head logogram (B'ALAM). */
const JaguarGlyph: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(260, 260, 60)} color="#ecdcb4" shade={0.18} />
    <Part shape={blob([[-90, -60], [80, -70], [110, 10], [70, 80], [-60, 90], [-100, 20]], 8)} color="#e0a83a" shade={0.24} z={0.001} />
    {[[-50, 40], [10, 60], [-20, -20], [50, 0], [-60, -40]].map(([xx, yy], i) => (
      <Part key={i} shape={ellipse(14, 11)} color="#2a2228" flat outline={0} x={xx} y={yy} z={0.002} />
    ))}
    {[-1, 1].map((k) => (
      <Part key={k} shape={circle(26)} color="#e0a83a" shade={0.24} x={k * 60} y={90} z={0} />
    ))}
    <Part shape={circle(16)} color="#ffffff" flat outline={3} x={40} y={20} z={0.003} />
    <Part shape={circle(7)} color="#211b20" flat outline={0} x={44} y={20} z={0.004} />
    {[50, 70, 90].map((xx) => (
      <Part key={xx} shape={poly([[xx - 7, -52], [xx, -70], [xx + 7, -52]])} color="#ffffff" flat outline={2.5} z={0.004} />
    ))}
  </X>
);

// 273.2 "Some signs stand for whole words, others for sounds."
export const WordsSoundsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e6d6ae" />
        <JaguarGlyph x={-480} y={20} s={1.3 * pop(t, 274.4)} z={1} />
        {[0, 1, 2].map((i) => (
          <Glyph key={i} seed={i + 200} size={180} paint="#ecdcb4" x={220 + i * 220} y={20} s={pop(t, 276.0 + i * 0.25)} z={1} />
        ))}
        <Line pts={[[-180, 20], [80, 20]]} width={6} color="#8a7a5a" z={0.5} />
      </Stage>
      <Label text="WORD: JAGUAR" x={0.25} y={0.78} size={0.045} kind="box" at={sec(start)(275.0)} />
      <Label text="SOUNDS: BA – LA – M(A)" x={0.73} y={0.78} size={0.045} kind="box" at={sec(start)(276.5)} />
    </AbsoluteFill>
  );
};

// 277.95 "They write on stone, on pots, and in folding books made of bark paper."
export const StonePotsBooksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e6d6ae" />
        <X x={-620} y={-440} s={pop(t, 278.45)} z={1}>
          <Stela h={760} />
        </X>
        <X x={0} y={-300} s={1.5 * pop(t, 279.3)} z={1}>
          <MayaBowl w={260} color="#e0a070" />
          <Glyph seed={11} size={50} paint="#f2e2c0" y={50} z={0.01} />
        </X>
        <X x={620} y={-40} s={0.9 * pop(t, 280.7)} z={1}>
          <Codex pages={4} open={ramp(t, 280.8, 281.6)} />
        </X>
      </Stage>
      <Label text="STONE" x={0.18} y={0.1} size={0.05} kind="box" at={sec(start)(278.5)} />
      <Label text="POTS" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(279.3)} />
      <Label text="BARK-PAPER BOOKS" x={0.8} y={0.1} size={0.045} kind="box" at={sec(start)(280.7)} />
    </AbsoluteFill>
  );
};

// 282.3 "They count in twenties, not tens, probably because they count fingers and toes."
export const Base20Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.min(20, Math.round(ramp(t, 284.6, 286.6) * 20));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -80 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e6d6ae">
          <Character {...MAYA_COMMONER(0)} x={-360} y={-700} s={1.7} z={1} look={0.1} expression={{ eyes: "open", mouth: "smile", gaze: [0, -0.6] }} pose={{ ...poses.sit(frame), armF: [1.2, -0.6], armB: [1.1, -0.6] }} />
          <X x={480} y={0} z={1}>
            <MayaNumber n={n} size={1.2} color="#2a2026" />
          </X>
        </Paper>
      </Stage>
      <Label text="BASE 20" x={0.5} y={0.1} size={0.07} kind="title" at={sec(start)(282.9)} />
      <Label text="FINGERS + TOES" x={0.25} y={0.9} size={0.045} kind="box" at={sec(start)(285.7)} />
      <Label text={`${n}`} x={0.75} y={0.72} size={0.07} kind="title" at={sec(start)(284.6)} />
    </AbsoluteFill>
  );
};

// 287.05 "A dot means one. A bar means five. And a shell means zero."
export const DotBarShellShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e6d6ae">
          <MayaNumber n={1} size={2.2 * pop(t, 287.2)} x={-560} y={60} color="#2a2026" z={1} />
          <MayaNumber n={5} size={1.4 * pop(t, 288.62)} x={0} y={60} color="#2a2026" z={1} />
          <MayaShell size={300 * pop(t, 290.38)} x={560} y={60} z={1} />
        </Paper>
      </Stage>
      <Label text="1" x={0.21} y={0.72} size={0.09} kind="title" at={sec(start)(287.8)} />
      <Label text="5" x={0.5} y={0.72} size={0.09} kind="title" at={sec(start)(289.2)} />
      <Label text="0" x={0.79} y={0.72} size={0.09} kind="title" color="#fe5649" at={sec(start)(291.6)} />
    </AbsoluteFill>
  );
};

// 292.75 "They're one of the first people on Earth to use zero."
export const FirstZeroShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SpaceStars z={-40} />
        <Globe x={-280} y={-40} r={420} lon0={-80} lat0={15} highlight={[-89.5, 17.5]} z={1} />
        <MayaShell size={340 * pop(t, 293.4)} x={520} y={60} z={2} />
        <Glow x={520} y={60} rx={360} color="#fff2c6" alpha={0.4} additive z={1.9} />
      </Stage>
      <Label text="ONE OF THE FIRST TO USE ZERO" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(294.5)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── time ─────────────────────────

// 295.75 "And they're obsessed with time."
export const ObsessedTimeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60 }} light={{ pos: [0, 300] }} vignette={0.65}>
        <Paper color="#e2d2a8">
          <CalendarGear x={-520} y={260} r={280} teeth={20} rot={frame * 0.01} color="#d9c49a" z={-2} />
          <CalendarGear x={560} y={300} r={220} teeth={18} rot={-frame * 0.013} color="#c8a878" z={-2} />
          <Character {...MAYA_PRIEST(2)} x={0} y={-920} s={2.3} z={2} look={0.2} expression={{ eyes: "wide", mouth: "grin", brows: -0.4 }} pose={poses.armsUp(frame)} />
        </Paper>
      </Stage>
      <Label text="OBSESSED WITH TIME" x={0.5} y={0.08} size={0.05} kind="box" at={sec(start)(296.6)} />
    </AbsoluteFill>
  );
};

// 297.55 "They have a 260-day calendar for rituals, and a 365-day calendar for the seasons."
export const TwoCalendarsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e2d2a8">
          {pop(t, 298.0) > 0.01 && <X x={-440} y={40} s={pop(t, 298.0)} z={1}><CalendarGear r={300} teeth={20} label="numbers" rot={frame * 0.012} color="#d9c49a" /></X>}
          {pop(t, 300.7) > 0.01 && <X x={440} y={40} s={pop(t, 300.7)} z={1}><CalendarGear r={330} teeth={24} label="months" rot={-frame * 0.01} color="#c8a878" /></X>}
        </Paper>
      </Stage>
      <Label pin text="260 DAYS" sub="RITUALS" x={0.27} y={0.88} size={0.05} kind="box" at={sec(start)(298.5)} />
      <Label pin text="365 DAYS" sub="SEASONS" x={0.73} y={0.88} size={0.05} kind="box" at={sec(start)(301.4)} />
    </AbsoluteFill>
  );
};

// 303.55 "Put them together, and they repeat every 52 years."
export const FiftyTwoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const mesh = ramp(t, 303.6, 304.5, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e2d2a8">
          <CalendarGear x={-440 + mesh * 160} y={40} r={300} teeth={20} label="numbers" rot={frame * 0.03} color="#d9c49a" z={1} />
          <CalendarGear x={440 - mesh * 140} y={40} r={330} teeth={24} label="months" rot={-frame * 0.025} color="#c8a878" z={1.01} />
        </Paper>
      </Stage>
      <Label text="EVERY 52 YEARS" x={0.5} y={0.1} size={0.07} kind="title" at={sec(start)(305.6)} />
    </AbsoluteFill>
  );
};

// 307.1 "They also have a much longer count of days, called the Long Count."
export const LongCountShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const r = Math.floor(frame / 3);
  const v = [9, 12 + (r % 2), (r * 7) % 20, (r * 3) % 18, (r * 11) % 20];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3238"], [1, "#1a1418"]]} z={-41} />
        <LongCount value={v} roll={(frame % 3) / 3} s={1.2} z={1} />
      </Stage>
      <Label text="THE LONG COUNT" x={0.5} y={0.12} size={0.065} kind="box" at={sec(start)(309.6)} />
    </AbsoluteFill>
  );
};

// 310.65 "And that's where a famous myth comes from."
export const FamousMythShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15) }} light={{ dir: [-0.6, 0.6] }} vignette={0.75}>
        <Gradient w={6000} h={4000} stops={[[0, "#5a1a1a"], [1, "#1a0a0a"]]} z={-41} />
        <Sunburst r={2400} rays={16} color="#6a2020" alt="#5a1a1a" speed={1.2} z={-40} />
        <X y={-40} s={1 + Math.sin(frame * 0.3) * 0.02} z={1}>
          <Part shape={roundRect(900, 380, 30)} color="#2a1a1a" shade={0.2} />
        </X>
      </Stage>
      <Label text="2012" x={0.5} y={0.47} size={0.2} kind="title" color="#fe5649" at={sec(start)(311.0)} />
      <Label text="THE MYTH" x={0.5} y={0.14} size={0.05} kind="box" at={sec(start)(311.6)} />
    </AbsoluteFill>
  );
};

// 312.75 "One big cycle of the Long Count ends on December 21, 2012."
export const CycleEndsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const done = t > 315.8;
  const r = Math.floor(frame / 2);
  const v = done ? [13, 0, 0, 0, 0] : [12, 19, 19, 17, (r * 7) % 20];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: hitAt(t, 315.85, 0.3) * 6 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3238"], [1, "#1a1418"]]} z={-41} />
        <LongCount value={v} roll={done ? 0 : (frame % 2) / 2} s={1.2} z={1} />
        {done ? <Glow rx={900} ry={300} color="#ffd36a" alpha={0.35} additive z={2} /> : null}
      </Stage>
      <Label text="13.0.0.0.0" x={0.5} y={0.14} size={0.065} kind="box" at={sec(start)(315.8)} />
      <Label text="DECEMBER 2012" x={0.5} y={0.86} size={0.06} kind="title" at={sec(start)(314.8)} />
    </AbsoluteFill>
  );
};

// 317.25 "So people around the world panic."
export const PanicShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [2.4, 0.4];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -80, shake: 3 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <JungleSet mood="storm" horizon={-200} jungle={false} ground="#8a8a8a">
          {[-660, -220, 220, 660].map((x, i) => (
            <Character key={x} {...SCIENTIST(i)} x={x} y={-700} s={1.15} z={2 + i * 0.01} facing={i % 2 ? -1 : 1} look={0.45} expression={{ eyes: "wide", mouth: "shout", brows: 0.9, sweat: true }} pose={poses.scared(frame + i * 5)} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="PANIC!" x={0.2} y={0.1} size={0.07} kind="stamp" rotate={-6} at={sec(start)(318.3)} />
    </AbsoluteFill>
  );
};

// 319.2 "The Maya predicted the end of the world!"
export const EndOfWorldShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), shake: 6 }} light={{ dir: [-0.6, 0.6] }} vignette={0.75} vignetteColor="#1a0a0a">
        <SpaceStars z={-40} />
        <Globe x={0} y={-80} r={420} lon0={-60} lat0={10} z={1} />
        <X x={interpolate(t, [319.2, 321.0], [900, 300])} y={interpolate(t, [319.2, 321.0], [600, 200])} z={2}>
          <Part shape={circle(60)} color="#6a5a52" shade={0.3} />
          <Glow rx={240} color="#ff7a3a" alpha={0.6} additive />
        </X>
      </Stage>
      <Label text="THE END OF THE WORLD?!" x={0.5} y={0.1} size={0.06} kind="title" color="#fe5649" at={sec(start)(320.1)} />
    </AbsoluteFill>
  );
};

// 321.1 "Except they didn't."
export const TheyDidntShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: 1.2, y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={6} bg={<PlazaSet mood="day" horizon={-160} />}>
        <Character {...MAYA_PRIEST(2)} x={0} y={-940} s={2.4} z={2} look={0.05} expression={{ eyes: "half", mouth: "flat", brows: -0.1 }} pose={poses.handsOnHips} />
      </DepthStage>
      <Label text="NOPE." x={0.78} y={0.14} size={0.08} kind="title" at={sec(start)(321.9)} />
    </AbsoluteFill>
  );
};

/** Car odometer rolling from 99999 to 00000. */
const Odometer: React.FC<{ k: number }> = ({ k }) => (
  <X>
    <Part shape={roundRect(1200, 340, 40)} color="#2a2228" shade={0.2} />
    {Array.from({ length: 5 }, (_, i) => {
      const roll = Math.min(1, Math.max(0, k * 5 - (4 - i) * 0.6));
      return (
        <X key={i} x={(i - 2) * 220} z={0.01 + i * 0.001}>
          <Part shape={roundRect(180, 240, 16)} color="#f4f1ea" shade={0.15} />
          <Part shape={roundRect(180, 6, 2)} color="#c8c4bc" flat outline={0} y={-120 + roll * 240} z={0.001} />
        </X>
      );
    })}
  </X>
);

// 322.55 "To the Maya, it's like a car's odometer rolling over to all zeros."
export const OdometerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 324.6, 325.9);
  const digits = k >= 0.98 ? "0 0 0 0 0" : "9 9 9 9 9";
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Gradient w={6000} h={4000} stops={[[0, "#3a3a44"], [1, "#1a1a20"]]} z={-41} />
        <Odometer k={k} />
      </Stage>
      {digits.split(" ").map((d, i) => (
        <Label pin key={i} text={d} x={0.5 + ((i - 2) * 220 * push(frame, dur, 1.0, 1.05)) / 1920} y={0.5} size={0.13} kind="tag" color="#2a2026" at={0} />
      ))}
      <Label text="ODOMETER" x={0.5} y={0.14} size={0.05} kind="box" at={sec(start)(324.4)} />
    </AbsoluteFill>
  );
};

// 326.65 "A new cycle begins, and life goes on."
export const NewCycleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 326.7, 328.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.5] }} vignette={0.55}>
        <Village horizon={-160} mood="dawn">
          <Sun x={300} y={-160 + rise * 420} r={120} glow={0.9} z={-39} />
          {[-300, 120].map((x, i) => (
            <Character key={x} {...(i ? MAYA_WOMAN(1) : MAYA_COMMONER(0))} x={x} y={-640} s={1.25} z={2} facing={i ? -1 : 1} look={0.45} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.walk(frame + i * 8, 0.6)} />
          ))}
        </Village>
      </Stage>
      <Label text="A NEW CYCLE" x={0.5} y={0.1} size={0.065} kind="title" at={sec(start)(327.1)} />
    </AbsoluteFill>
  );
};

// 329.55 "And yes, we're still here."
export const StillHereShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-200} jungle={false} ground="#a8b0a0">
          {[-660, -220, 220, 660].map((x, i) => (
            <Character key={x} {...SCIENTIST(i)} x={x} y={-680} s={1.15} z={2 + i * 0.01} facing={i % 2 ? -1 : 1} look={0.45} expression={{ eyes: "half", mouth: "smirk", brows: 0.3 }} pose={i % 2 ? poses.shrug(frame) : poses.idle(frame, i)} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="21 DEC 2012 → 22 DEC 2012" x={0.5} y={0.1} size={0.045} kind="box" at={sec(start)(330.0)} />
      <Label text="STILL HERE" x={0.5} y={0.22} size={0.06} kind="title" at={sec(start)(330.8)} />
    </AbsoluteFill>
  );
};
