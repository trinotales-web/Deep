import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, LightCone, roundRect, circle, ellipse, blob, push, hitAt, absT, ramp, QuestionMark, Quill, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  EURO, NationFlag, Musket, FieldGun, Guillotine, Coach, Lightbulb, BabyBundle, Book, Doc, Desk, Candle, StoneHouse, Palace, Tower, Smoke, Sky, Ground,
} from "../../kit/env";
import { sec, pop, SpeechBubble } from "../../kit/shot";
import { CorsicaSet, MapBack, ClassroomSet, StudySet, ParisStreet, PalaceRoom, LongwoodRoom, BattlefieldSet } from "./sets";
import { CARLO, CARLO_REBEL, LETIZIA, NAPOLEON_BOY, NAPOLEON, NAPOLEON_YOUNG, SCHOOLBOY, CORSICAN, FR_ROYAL, FRIAR, GOVERNOR, KING, REVOLUTIONARY, OFFICER } from "./cast";
import { atHead } from "../moon/frame";
import { HeldMusket, SHOULDER_ARMS, AIM, aimPose, shoulderPose, eu, mapScr } from "./util";

// Act B: Corsica, the birth, the father's switch, school at Brienne,
// artillery officer at 16, the father's death, the Revolution.

const L = { dir: [-0.6, 0.7] as [number, number] };

// 62.61 "Corsica is a rocky island in the Mediterranean."
export const CorsicaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), x: -300 + frame * 1.2, y: 20 }} light={L} vignette={0.45}>
        <CorsicaSet floor={-460} />
      </Stage>
      <Label text="CORSICA" x={0.06} y={0.09} size={0.05} kind="box" at={at(62.7)} />
      <Label text="MEDITERRANEAN SEA" x={0.94} y={0.09} size={0.04} kind="box" at={at(64.3)} />
    </AbsoluteFill>
  );
};

// 65.46 "In 1768, the city of Genoa sells it to France."
export const GenoaSellsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const genoa: [number, number] = [8.93, 44.41];
  const sold = ramp(t, 67.8, 68.4);
  const c = eu([8.6, 43.4]);
  const cam = { zoom: 1.6, x: c[0], y: c[1] };
  const sg = mapScr(eu(genoa), cam);
  const sc = mapScr(eu(EURO.ajaccio), cam);
  const tint = { "island:corsica": sold > 0.5 ? "#3b62b8" : "#d8463a", France: "#3b62b8" };
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack islands={["corsica", "sardinia"]} tint={tint} tintK={0.75} pins={[{ at: genoa, dot: true, color: "#d8463a" }]} routes={[{ pts: [genoa, [9.4, 43.6]], k: ramp(t, 66.9, 67.9), width: 18, color: "#d8463a" }]} />
      </Stage>
      <Label text="1768" x={0.5} y={0.1} size={0.08} kind="title" at={at(65.6)} />
      <Label text="GENOA" x={sg.x + 0.06} y={sg.y - 0.02} size={0.045} kind="box" at={at(67.3)} pin />
      <Label text="SOLD TO FRANCE" x={sc.x - 0.05} y={sc.y + 0.12} size={0.06} kind="stamp" rotate={-6} at={at(68.2)} pin />
    </AbsoluteFill>
  );
};

// 69.30 "The Corsicans fight back."
export const FightBackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 80, shake: hitAt(t, 70.1) * 6 }} light={L} vignette={0.5}>
        <CorsicaSet floor={-460} village={false}>
          {[0, 1, 2].map((i) => {
            const fire = i === 1 ? Math.max(0, Math.min(1, (t - 70.05) / 0.6)) : i === 0 ? Math.max(0, Math.min(1, (t - 70.4) / 0.6)) : 0;
            return <Character key={i} {...CORSICAN(i)} x={-760 + i * 330} y={-420 + (i % 2) * 30} s={1.05} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "shout", brows: -0.7 }} pose={aimPose(frame)} holdF={<HeldMusket arm={AIM} dir={0.02} fire={fire} />} z={-10 - i * 0.01} />;
          })}
          {[0, 1, 2].map((i) => (
            <Character key={`f${i}`} {...FR_ROYAL(i)} x={620 + i * 260} y={-300 - i * 20} s={0.75} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o" }} pose={shoulderPose(frame, i)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-20 - i * 0.01} />
          ))}
        </CorsicaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 71.13 "Among the rebels is a young couple, Carlo and Letizia Buonaparte."
export const CoupleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, y: 40 };
  const c = atHead(cam, 0.36, 0.44, 1.6);
  const l = atHead(cam, 0.64, 0.46, 1.5);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40 }} light={L} vignette={0.5} bgBlur={3} bg={<CorsicaSet floor={-700} />}>
        <Character {...CARLO_REBEL} x={c.x} y={c.y} s={1.6} facing={1} look={0.5} expression={{ eyes: "open", mouth: "smile", gaze: [0.6, 0] }} pose={shoulderPose(frame, 1)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-6} />
        <Character {...LETIZIA} x={l.x} y={l.y} s={1.5} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile", gaze: [-0.6, 0] }} pose={poses.idle(frame, 2)} z={-6.5} />
      </DepthStage>
      <Label text="CARLO" x={0.36} y={0.84} size={0.05} kind="box" at={at(72.95)} pin />
      <Label text="LETIZIA" x={0.64} y={0.84} size={0.05} kind="box" at={at(73.6)} pin />
      <Label text="BUONAPARTE" x={0.5} y={0.1} size={0.07} kind="title" at={at(74.15)} />
    </AbsoluteFill>
  );
};

// 75.14 "Letizia is pregnant."
export const PregnantShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const s = 1.9;
  const a = atHead(cam, 0.46, 0.4, s);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.5} bgBlur={3} bg={<CorsicaSet floor={-700} />}>
        <Character {...LETIZIA} x={a.x} y={a.y} s={s} facing={1} look={0.55} expression={{ eyes: "happy", mouth: "smile", blush: true }} pose={{ armF: [0.55, 1.9], armB: [-0.3, 1.2] }} z={-6} />
        <Part shape={ellipse(60 * s * 0.6, 60 * s * 0.7)} color={LETIZIA.outfit.top} shade={0.25} x={a.x + 50 * s} y={a.y + 120 * s} z={-6 + 0.15} />
        <X x={a.x + 300} y={a.y + 560} s={pop(t, 75.9)} z={-5}>
          <Part shape={blob([[0, -40], [36, -4], [40, 24], [20, 36], [0, 22], [-20, 36], [-40, 24], [-36, -4]], 8)} color="#e2574a" shade={0.2} />
        </X>
      </DepthStage>
    </AbsoluteFill>
  );
};

// 76.76 "But the French win,"
export const FrenchWinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 76.7, 77.6, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 120 }} light={L} vignette={0.5}>
        <CorsicaSet floor={-460} village={false}>
          <Part shape={blob([[-320, 0], [-260, 160], [0, 230], [240, 150], [320, 0]], 8)} color="#a8a49a" shade={0.25} x={120} y={-470} z={-15} />
          <NationFlag kind="royal" x={140} y={-260 - (1 - rise) * 200} w={260} pole={520} z={-14} />
          {[0, 1].map((i) => (
            <Character key={i} {...FR_ROYAL(i)} x={-120 + i * 520} y={-420} s={1.1} facing={i ? -1 : 1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={shoulderPose(frame, i)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-12 - i * 0.01} />
          ))}
          <Character {...CORSICAN(1)} x={-700} y={-520} s={1.2} facing={1} look={0.4} expression={{ eyes: "sad", mouth: "frown", brows: 0.6 }} pose={poses.grief(frame)} z={-8} />
        </CorsicaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 77.95 "and on August 15, 1769, she gives birth to a boy."
export const BirthNightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.15), x: -260, y: -60 }} light={L} vignette={0.6}>
        <CorsicaSet floor={-460} village={false} night>
          <StoneHouse x={-300} y={-420} s={1.4} lit wall="#cdb894" z={-20} />
          <Glow rx={260} color="#ffd98a" alpha={0.5} additive x={-300 - 0.22 * 300 * 1.4} y={-420 + 260 * 0.62 * 1.4} z={-19} />
        </CorsicaSet>
      </Stage>
      <Label text="AUGUST 15, 1769" x={0.5} y={0.1} size={0.08} kind="title" at={at(78.3)} />
      <Label text="AJACCIO, CORSICA" x={0.06} y={0.85} size={0.042} kind="box" at={at(79.6)} />
    </AbsoluteFill>
  );
};

// 82.28 "Napoleon."
export const BabyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.42, 0.36, 1.7);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.6} bgBlur={3} bg={<LongwoodRoom floor={-700} bed={false} />}>
        <Character {...LETIZIA} x={a.x} y={a.y} s={1.7} facing={1} look={0.55} expression={{ eyes: "happy", mouth: "smile", gaze: [0.4, -0.6] }} pose={{ armF: [1.0, 1.0], armB: [0.7, 1.3] }} z={-6} />
        <BabyBundle x={a.x + 260} y={a.y + 230} s={1.5} rot={0.25} z={-5.7} />
        <Candle x={620} y={-420} s={1.4} z={-7} />
      </DepthStage>
      <Label text="NAPOLEON" x={0.5} y={0.86} size={0.09} kind="title" at={at(82.3)} />
    </AbsoluteFill>
  );
};

// 83.66 "His father makes a smart move."
export const SmartMoveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.42, 0.48, 1.9);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<StudySet floor={-700} map={false} />}>
        <Character {...CARLO} x={a.x} y={a.y} s={1.9} facing={1} look={0.5} expression={{ eyes: t > 84.3 ? "happy" : "squint", mouth: t > 84.3 ? "grin" : "flat", gaze: [0.5, 0.6] }} pose={t > 84.3 ? poses.point(frame) : poses.think} z={-6} />
        <Lightbulb x={a.x + 420} y={a.y + 700} s={pop(t, 84.4)} on={t > 84.3 ? 1 : 0} z={-5} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 85.38 "He switches sides and makes friends with the French."
export const SwitchSidesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const shake = ramp(t, 86.4, 86.8);
  const cam = { zoom: 1, y: 40 };
  const c = atHead(cam, 0.33, 0.46, 1.6);
  const g = atHead(cam, 0.67, 0.44, 1.6);
  const hand: [number, number] = [1.35 + Math.sin(frame * 0.8) * 0.06 * shake, 0.1];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40 }} light={L} vignette={0.5}>
        <PalaceRoom floor={-560} throne={false}>
          <NationFlag kind="royal" x={0} y={-560} w={240} pole={700} z={-30} />
          <Character {...CARLO} x={c.x} y={c.y} s={1.6} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: hand, armB: [-0.2, 0.3] }} z={-10} />
          <Character {...GOVERNOR} x={g.x} y={g.y} s={1.6} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={{ armF: hand, armB: [-0.2, 0.3] }} z={-10.5} />
        </PalaceRoom>
      </Stage>
      <Label text="FRIENDS WITH THE FRENCH" x={0.5} y={0.88} size={0.05} kind="box" at={at(86.6)} />
    </AbsoluteFill>
  );
};

/** Patent of nobility with a red wax seal and a little coat of arms. */
const Patent: React.FC<{ x?: number; y?: number; s?: number; z?: number; seal?: number }> = ({ x = 0, y = 0, s = 1, z = 0, seal = 1 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(520, 660, 14)} color="#f2e6c8" shade={0.15} />
    {[200, 150, 100, 50, 0, -50].map((ly, i) => (
      <Line key={i} pts={[[-200, ly], [i === 5 ? 60 : 200, ly]]} width={6} color="#8a7a60" z={0.001} />
    ))}
    <X y={-200} z={0.002}>
      <Part shape={blob([[-70, 70], [70, 70], [66, -20], [0, -80], [-66, -20]], 8)} color="#2c4486" shade={0.2} />
      <Part shape={roundRect(80, 16, 4)} color="#e2b23c" flat outline={3} y={10} z={0.001} />
    </X>
    <X x={170} y={-250} s={seal} z={0.003}>
      <Part shape={circle(56)} color="#b8262f" shade={0.25} />
      <Part shape={circle(30)} color="#8a1a22" flat outline={3} z={0.001} />
    </X>
  </X>
);

// 87.89 "That gets the family a place among the lower nobility."
export const NobilityShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const c = atHead(cam, 0.68, 0.46, 1.6);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<PalaceRoom floor={-700} throne={false} />}>
        <Patent x={-420} y={-40} s={0.95} seal={pop(t, 88.9)} z={-5} />
        <Character {...CARLO} x={c.x} y={c.y} s={1.6} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "grin", blush: true }} pose={{ armF: [0.6, 0.4], armB: [-0.4, 0.2], lean: 0.12 }} z={-6} />
      </DepthStage>
      <Label text="LOWER NOBILITY" x={0.5} y={0.1} size={0.07} kind="title" at={at(89.5)} />
    </AbsoluteFill>
  );
};

// 90.78 "So when Napoleon is nine, he's sent to school in France."
export const SentToSchoolShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const brienne = EURO.brienne;
  const c = eu([6.5, 45.5]);
  const cam = { zoom: 1.05, x: c[0], y: c[1] };
  const sb = mapScr(eu(brienne), cam);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack islands={["corsica", "sardinia"]} pins={[{ at: EURO.ajaccio, dot: true }, { at: brienne, s: pop(t, 93.2) }]} routes={[{ pts: [EURO.ajaccio, [8.2, 43.2], [5.3, 43.3], [4.8, 45.8], brienne], k: ramp(t, 92.4, 93.6), width: 20 }]} />
      </Stage>
      <Label text="AGE 9" x={0.5} y={0.1} size={0.08} kind="title" at={at(91.9)} />
      <Label text="BRIENNE MILITARY SCHOOL" x={sb.x + 0.02} y={sb.y - 0.06} size={0.04} kind="box" at={at(93.3)} pin />
    </AbsoluteFill>
  );
};

// 94.22 "There's one problem."
export const OneProblemShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 0.95, y: 100 };
  const b = atHead(cam, 0.5, 0.5, 1.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.06), y: cam.y }} light={L} vignette={0.5}>
        <Sky w={5000} h={3000} y={800} z={-60} />
        <Palace x={0} y={-200} s={0.75} flag="royal" z={-55} />
        <Ground w={6000} h={1200} y={-200} color="#c9b48a" z={-50} />
        <Character {...NAPOLEON_BOY} x={b.x} y={b.y} s={1.4} facing={1} look={0.15} expression={{ eyes: "wide", mouth: "wavy", brows: 0.6, sweat: true }} pose={poses.idle(frame, 3)} z={-10} />
        <QuestionMark x={b.x + 360} y={b.y + 640} size={1.2 * pop(t, 94.6)} z={-9} />
      </Stage>
    </AbsoluteFill>
  );
};

// 95.55 "He barely speaks French."
export const NoFrenchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, y: 40 };
  const f = atHead(cam, 0.28, 0.42, 1.6);
  const b = atHead(cam, 0.74, 0.55, 1.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: cam.y }} light={L} vignette={0.5}>
        <ClassroomSet floor={-560}>
          <Character {...FRIAR} x={f.x} y={f.y} s={1.6} facing={1} look={0.5} expression={{ eyes: "open", mouth: "open" }} pose={poses.talk(frame, 2)} talking z={-10} />
          <Character {...NAPOLEON_BOY} x={b.x} y={b.y} s={1.4} facing={-1} look={0.3} expression={{ eyes: "dot", mouth: "flat", brows: 0.4 }} pose={poses.idle(frame, 1)} z={-10.5} />
          <SpeechBubble x={-60} y={360} w={620} h={220} tx={-300} ty={200} z={-8} />
        </ClassroomSet>
      </Stage>
      <Label text="BONJOUR, MESSIEURS!" x={0.47} y={0.17} size={0.05} kind="ink" at={at(95.6)} pin />
    </AbsoluteFill>
  );
};

// 97.22 "He grew up speaking Corsican and Italian."
export const CorsicanItalianShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const b = atHead(cam, 0.5, 0.55, 1.7);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<ClassroomSet floor={-700} />}>
        <Character {...NAPOLEON_BOY} x={b.x} y={b.y} s={1.7} facing={1} look={0.4} expression={{ eyes: "happy", mouth: "open" }} pose={poses.talk(frame, 1)} talking z={-6} />
        <X s={pop(t, 98.05)} x={-560} y={260} z={-4}>
          <SpeechBubble x={0} y={0} w={460} h={200} tx={300} ty={-160} />
        </X>
        <X s={pop(t, 98.8)} x={560} y={300} z={-4}>
          <SpeechBubble x={0} y={0} w={420} h={200} tx={-300} ty={-180} />
        </X>
      </DepthStage>
      <Label text="BONGHJORNU!" x={0.21} y={0.26} size={0.045} kind="ink" at={at(98.1)} pin />
      <Label text="BUONGIORNO!" x={0.79} y={0.22} size={0.045} kind="ink" at={at(98.85)} pin />
      <Label text="CORSICAN" x={0.21} y={0.84} size={0.04} kind="box" at={at(98.1)} pin />
      <Label text="ITALIAN" x={0.79} y={0.84} size={0.04} kind="box" at={at(98.85)} pin />
    </AbsoluteFill>
  );
};

// 99.67 "The other boys laugh at his accent and his strange name."
export const LaughShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 0.95, y: 60 };
  const b = atHead(cam, 0.2, 0.5, 1.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), y: cam.y }} light={L} vignette={0.5}>
        <ClassroomSet floor={-520}>
          <Character {...NAPOLEON_BOY} x={b.x} y={b.y} s={1.4} facing={1} look={0.5} expression={{ eyes: "sad", mouth: "frown", brows: 0.7 }} pose={poses.idle(frame, 2)} z={-10} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...SCHOOLBOY(i + 2)} x={b.x + 560 + i * 330} y={b.y + 10 - (i % 2) * 20} s={1.25} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }} pose={{ armF: [1.25, 0.15], armB: [-0.3, 1.2], handF: "point", bob: Math.abs(Math.sin(frame * 0.45 + i)) * 10 }} z={-11 - i * 0.01} />
          ))}
        </ClassroomSet>
      </Stage>
      <Label text="“NAPOLIONE!”" x={0.66} y={0.18} size={0.06} kind="stamp" rotate={-5} at={at(101.4)} pin />
      <Label text="HA HA HA!" x={0.84} y={0.33} size={0.045} kind="box" at={at(100.3)} pin />
    </AbsoluteFill>
  );
};

// 102.56 "He has few friends."
export const FewFriendsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 80 }} light={L} vignette={0.55}>
        <BattlefieldSet floor={-460} sun={0} grass="#8a9a62">
          <Palace x={600} y={60} s={0.45} flag="royal" z={-53} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...SCHOOLBOY(i)} x={420 + i * 170} y={-160} s={0.55} facing={i % 2 ? -1 : 1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.run(frame + i * 7, i)} z={-40} />
          ))}
          <Character {...NAPOLEON_BOY} x={-460} y={-470} s={1.25} facing={1} look={0.6} expression={{ eyes: "sad", mouth: "flat", gaze: [0.8, 0] }} pose={poses.sit(frame)} z={-10} />
        </BattlefieldSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 103.88 "So he reads: history, math, and the lives of great generals."
export const ReadsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const b = atHead(cam, 0.3, 0.42, 1.5);
  const books: [number, string, number][] = [[104.73, "#8a2a35", 0], [105.43, "#2c4486", 1], [106.9, "#3f6a3a", 2]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.6}>
        <StudySet floor={-560} night map={false}>
          <Character {...NAPOLEON_BOY} x={b.x} y={b.y} s={1.5} facing={1} look={0.6} expression={{ eyes: "open", mouth: "flat", gaze: [0.6, -0.5] }} pose={{ armF: [1.0, 1.0], armB: [0.7, 1.2] }} holdF={<X rot={-1.6} s={0.4}><Book cover="#6a4a30" /></X>} z={-12} />
          <Desk x={360} y={-560} w={820} z={-8} />
          <Candle x={130} y={-180} s={1.3} z={-7} />
          {books.map(([bt, col, i]) => (
            <X key={i} x={330 + i * 190} y={-60 + Math.sin(frame * 0.05 + i) * 8} s={0.55 * pop(t, bt)} rot={0.06 - i * 0.05} z={-7.5}>
              <Book cover={col} />
            </X>
          ))}
        </StudySet>
      </Stage>
      <Label text="HISTORY" x={0.6} y={0.3} size={0.04} kind="box" at={at(104.75)} pin />
      <Label text="MATH" x={0.73} y={0.3} size={0.04} kind="box" at={at(105.45)} pin />
      <Label text="GREAT GENERALS" x={0.87} y={0.3} size={0.04} kind="box" at={at(106.9)} pin />
    </AbsoluteFill>
  );
};

// 107.86 "He keeps his Corsican accent for the rest of his life."
export const AccentShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.36, 0.48, 1.8);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<StudySet floor={-700} />}>
        <Character {...NAPOLEON} x={a.x} y={a.y} s={1.8} facing={1} look={0.5} expression={{ eyes: "open", mouth: "open", brows: -0.2 }} pose={poses.talk(frame, 4)} talking z={-6} />
        <SpeechBubble x={520} y={300} w={600} h={240} tx={-280} ty={-180} z={-4} />
      </DepthStage>
      <Label text="“ALLONS-Y!”" x={0.77} y={0.22} size={0.06} kind="ink" at={at(108.0)} pin />
      <Label text="CORSICAN ACCENT · FOR LIFE" x={0.5} y={0.88} size={0.045} kind="box" at={at(109.4)} />
    </AbsoluteFill>
  );
};

// 110.86 "At 16, he becomes an artillery officer."
export const ArtilleryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const fire = Math.max(0, Math.min(1, (t - 112.4) / 0.9));
  const cam = { zoom: 0.95, y: 80 };
  const n = atHead(cam, 0.3, 0.42, 1.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), y: cam.y, shake: hitAt(t, 112.45) * 10 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.6}>
          <Character {...NAPOLEON_YOUNG(false)} x={n.x} y={n.y} s={1.4} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "smile", brows: -0.2 }} pose={poses.point(frame)} z={-10} />
          <FieldGun x={380} y={-470} s={1.45} fire={fire} z={-12} />
        </BattlefieldSet>
      </Stage>
      <Label text="AGE 16 · 1785" x={0.5} y={0.1} size={0.07} kind="title" at={at(111.0)} />
      <Label text="ARTILLERY OFFICER" x={0.94} y={0.85} size={0.045} kind="box" at={at(112.4)} />
    </AbsoluteFill>
  );
};

// 113.62 "That same year, his father dies of stomach cancer."
export const FatherDiesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const dim = ramp(t, 115.0, 115.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), x: 260, y: 40 }} light={L} vignette={0.6 + dim * 0.15}>
        <LongwoodRoom floor={-560}>
          <X x={440} y={-60} rot={Math.PI / 2 - 0.05} z={-25}>
            <Character {...CARLO} hat={null} x={0} y={0} s={0.9} facing={1} look={0.1} expression={{ eyes: dim > 0.5 ? "closed" : "half", mouth: "frown", brows: 0.6, eyebags: true }} pose={{ armF: [0.1, 0.3], armB: [-0.1, -0.2] }} shadow={false} />
          </X>
          <Part shape={roundRect(520, 130, 40)} color="#d8d2c4" shade={0.2} x={540} y={-80} z={-24} />
          <Candle x={-160} y={-300} s={1.4} out={dim} z={-20} />
        </LongwoodRoom>
      </Stage>
      <Label text="1785" x={0.06} y={0.09} size={0.05} kind="box" at={at(113.7)} />
      <Label text="STOMACH CANCER" x={0.5} y={0.86} size={0.06} kind="box" at={at(115.6)} />
    </AbsoluteFill>
  );
};

// 116.66 "Remember that. It matters at the end."
export const RememberThatShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.55}>
        <Part shape={roundRect(4000, 3000, 0)} color="#b08a5a" flat outline={0} z={-30} />
        {Array.from({ length: 30 }, (_, i) => (
          <Part key={i} shape={circle(6 + (i % 3) * 3)} color="#9a764a" flat outline={0} x={-900 + ((i * 263) % 1800)} y={-500 + ((i * 197) % 1000)} z={-29} />
        ))}
        <X x={-200} y={40} rot={-0.05} z={-10}>
          <Part shape={roundRect(520, 620, 10)} color="#d8a93a" shade={0.2} />
          <Part shape={roundRect(450, 550, 6)} color="#e8dcc0" flat outline={4} z={0.001} />
          <X y={-250} z={0.002}>
            <Character {...CARLO} s={0.85} look={0.4} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, 1)} shadow={false} />
          </X>
        </X>
        <X x={380} y={120} rot={0.08} s={pop(t, 116.7)} z={-9}>
          <Part shape={roundRect(420, 300, 6)} color="#ffe27a" shade={0.15} />
          <Part shape={circle(26)} color="#c8262f" shade={0.25} y={130} z={0.001} />
        </X>
      </Stage>
      <Label text="REMEMBER THIS" x={0.69} y={0.43} size={0.05} kind="ink" rotate={4} at={at(116.75)} pin />
      <Label text="IT MATTERS AT THE END" x={0.5} y={0.88} size={0.045} kind="box" at={at(117.6)} />
    </AbsoluteFill>
  );
};

// 119.22 "Then, in 1789, everything changes."
export const Year1789Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 160, shake: hitAt(t, 121.5) * 6 }} light={L} vignette={0.5}>
        <ParisStreet floor={-460} smoke={ramp(t, 120.5, 122.5)}>
          {[-1, 1].map((k) => (
            <Tower key={k} x={k * 420} y={-200} w={260} h={900} color="#9a948a" z={-45} />
          ))}
          <Part shape={roundRect(840, 600, 6)} color="#a8a294" shade={0.2} y={100} z={-45.5} />
          {Array.from({ length: 6 }, (_, i) => (
            <Character key={i} {...REVOLUTIONARY(i)} x={-900 + i * 360} y={-420 - (i % 2) * 40} s={0.95} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "shout", brows: -0.6 }} pose={i % 2 ? poses.armsUp(frame + i * 5) : poses.run(frame + i * 4, i)} z={-10 - (i % 2) * 0.5} />
          ))}
          <NationFlag kind="france" x={-600} y={-420} w={260} pole={700} z={-9} />
        </ParisStreet>
      </Stage>
      <Label text="1789" x={0.5} y={0.1} size={0.1} kind="title" at={at(120.1)} />
      <Label text="THE BASTILLE, PARIS" x={0.06} y={0.85} size={0.04} kind="box" at={at(120.6)} />
    </AbsoluteFill>
  );
};

// 122.94 "The French Revolution."
export const RevolutionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.5} bgBlur={3} bg={<ParisStreet floor={-700} smoke={0.5} />}>
        {[0, 1, 2].map((i) => {
          const a = atHead({ zoom: 1 }, 0.2 + i * 0.3, 0.48 + (i % 2) * 0.04, 1.5);
          return <Character key={i} {...REVOLUTIONARY(i + 1)} x={a.x} y={a.y} s={1.5} facing={i === 2 ? -1 : 1} look={0.5} expression={{ eyes: "happy", mouth: "shout" }} pose={poses.armsUp(frame + i * 6)} z={-6 - i * 0.01} />;
        })}
      </DepthStage>
      <Label text="THE FRENCH REVOLUTION" x={0.5} y={0.1} size={0.075} kind="title" at={at(123.0)} />
    </AbsoluteFill>
  );
};

// 124.44 "The king loses his throne,"
export const KingThroneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 125.0, 125.8, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: 80 }} light={L} vignette={0.55}>
        <PalaceRoom floor={-460}>
          <Character {...KING} hat={fall > 0.02 ? null : "crown"} x={-60 + fall * 260} y={-300 - fall * 120} s={1.25} facing={1} look={0.5} expression={{ eyes: fall > 0 ? "wide" : "happy", mouth: fall > 0 ? "o" : "smile", brows: fall > 0 ? 0.8 : 0 }} pose={fall > 0 ? poses.scared(frame) : poses.sit(frame)} z={-20} />
          {fall > 0.02 ? (
            <X x={-60 + fall * 120} y={160 - fall * 560} rot={fall * 2.4} z={-19}>
              <Part shape={roundRect(140, 70, 10)} color="#e2b23c" shade={0.25} />
              {[-50, 0, 50].map((cx) => (
                <Part key={cx} shape={blob([[cx - 18, 30], [cx + 18, 30], [cx, 80]], 4)} color="#e2b23c" shade={0.25} z={-0.001} />
              ))}
            </X>
          ) : null}
        </PalaceRoom>
      </Stage>
    </AbsoluteFill>
  );
};

// 126.06 "and later his head."
export const GuillotineShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const blade = ramp(t, 126.5, 126.8, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.9), y: 260, shake: hitAt(t, 126.8) * 12 }} light={L} vignette={0.65}>
        <Sky w={5000} h={3000} y={900} top="#4a2a3a" bottom="#d86a4a" z={-60} />
        <Ground w={6000} h={1400} y={-300} color="#5a4a44" z={-50} />
        <Guillotine x={0} y={-320} s={1.0} blade={blade} z={-30} />
        {Array.from({ length: 7 }, (_, i) => (
          <Character key={i} {...REVOLUTIONARY(i)} x={-900 + i * 300} y={-640 - (i % 2) * 40} s={1.2} facing={i < 3 ? 1 : -1} look={0.8} expression={{ eyes: t > 126.85 ? "wide" : "open", mouth: t > 126.85 ? "o" : "flat" }} pose={poses.idle(frame, i)} z={-5 - (i % 2) * 0.5} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// 127.69 "Many noble officers flee the country."
export const NoblesFleeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const run = (t - 127.4) * 420;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.84), x: 200, y: 160 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.4}>
          <Coach x={-1100 + run} y={-420} s={0.9} walk={1.4} color="#2a3a5a" z={-20} />
          {[0, 1].map((i) => (
            <Character key={i} {...OFFICER(i)} outfit={{ ...OFFICER(i).outfit, top: "#f0ece2", lapels: "#f0ece2", tails: "#f0ece2" }} hat="tricorne" x={-200 + run * 1.05 + i * 260} y={-460} s={1.0} facing={1} look={0.6} expression={{ eyes: "wide", mouth: "o", sweat: true }} pose={poses.run(frame + i * 8, i)} z={-12 - i * 0.01} />
          ))}
          <X x={1200} y={-420} z={-25}>
            <Part shape={roundRect(24, 360, 6)} color="#6a4a30" flat outline={4} y={180} />
            <Part shape={roundRect(360, 110, 10)} color="#f2ead8" shade={0.15} y={340} z={0.001} />
          </X>
        </BattlefieldSet>
      </Stage>
      <Label text="EXIT FRANCE →" x={0.915} y={0.69} size={0.032} kind="ink" at={at(127.5)} pin />
      <Label text="NOBLE OFFICERS FLEE" x={0.06} y={0.85} size={0.045} kind="box" at={at(128.3)} />
    </AbsoluteFill>
  );
};

// 129.93 "Suddenly, a talented young officer from Corsica has a chance."
export const ChanceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const step = ramp(t, 130.6, 131.8);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.42, 1.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.06) }} light={L} vignette={0.75}>
        <Part shape={roundRect(4000, 3000, 0)} color="#1f1a28" flat outline={0} z={-30} />
        <LightCone x={0} y={900} w={900 * (0.5 + step * 0.5)} h={1900} color="#ffe9b0" alpha={0.35 + step * 0.25} z={-20} />
        <Part shape={ellipse(420, 70)} color="#ffe9b0" flat outline={0} opacity={0.4 * step} y={a.y + 10} z={-19} />
        <Character {...NAPOLEON_YOUNG(false)} x={a.x - (1 - step) * 300} y={a.y} s={1.7} facing={1} look={0.3} expression={{ eyes: step > 0.6 ? "happy" : "open", mouth: step > 0.6 ? "smirk" : "flat", brows: -0.3 }} pose={step < 1 ? poses.walk(frame, 0.7) : poses.handsOnHips} z={-10} />
      </Stage>
      <Label text="A CHANCE" x={0.5} y={0.1} size={0.08} kind="title" at={at(133.1)} />
    </AbsoluteFill>
  );
};

export const _b = { Musket, Doc, Quill, Smoke, circle, Line, NAPOLEON };
