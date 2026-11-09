import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, LightCone, QuestionMark, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Book, BookRow, Bookshelf, HospitalBed, HeartMonitor, IVStand, HomeComputer, Laptop, Magazine, Cheque, Phone, PostCard, Room, Window, Rain, House, Jacaranda,
  SpaceBack, Planet, StarlinkSat, Sun, Moon, Stars, Desk,
} from "../../kit/env";
import { sec, pop, useScr, SpeechBubble } from "../../kit/shot";
import { HomeRoom, PretoriaStreet, SchoolSet, Paper, Flash, Outdoors } from "./sets";
import { ELON_KID, ELON_SCHOOL, ELON_TEEN, MAYE, ERROL, BULLY, DOCTOR, NURSE, STAFF, PERSON } from "./cast";
import { PixelGame, upright } from "./actA";

// Childhood in Pretoria (1971–1984): reading, school, the book, the game.

/** Baby wrapped in a blanket (held in arms). */
const Baby: React.FC<{ x?: number; y?: number; s?: number; rot?: number; z?: number }> = ({ x = 0, y = 0, s = 1, rot = 0, z = 0 }) => (
  <X x={x} y={y} s={s} rot={rot} z={z}>
    <Part shape={blob([[-120, -30], [-90, 40], [10, 60], [110, 40], [130, -10], [80, -50], [-40, -60]], 8)} color="#a9d0ec" shade={0.2} />
    <Part shape={circle(46)} color="#f6f5f8" shade={0.22} x={-70} y={18} z={0.001} />
    <Line pts={[[-86, 22], [-78, 18]]} width={3.5} z={0.002} />
    <Line pts={[[-64, 24], [-56, 20]]} width={3.5} z={0.002} />
    <Part shape={ellipse(7, 4)} color="#e2707a" flat outline={2} x={-70} y={4} z={0.002} />
  </X>
);

/** Thought bubble (cloud with trailing dots toward (tx, ty)). Put content inside. */
const ThoughtBubble: React.FC<{ x: number; y: number; w?: number; h?: number; tx: number; ty: number; s?: number; z?: number; children?: React.ReactNode }> = ({ x, y, w = 560, h = 380, tx, ty, s = 1, z = 0, children }) => {
  if (s <= 0.01) return null;
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.cos(a) * w * 0.42, Math.sin(a) * h * 0.4] as [number, number];
  });
  return (
    <X z={z}>
      {[0.3, 0.55].map((k, i) => (
        <Part key={i} shape={circle(18 + i * 12)} color="#ffffff" flat outline={6} x={tx + (x - tx) * k} y={ty + (y - ty) * k} />
      ))}
      <X x={x} y={y} s={s}>
        {pts.map(([px, py], i) => (
          <Part key={i} shape={circle(Math.min(w, h) * 0.24)} color="#ffffff" flat outline={7} x={px} y={py} z={-0.002} />
        ))}
        <Part shape={ellipse(w * 0.48, h * 0.46)} color="#ffffff" flat outline={0} z={-0.001} />
        <X z={0.01}>{children}</X>
      </X>
    </X>
  );
};

/** Wall-sized 1970s supercomputer: panels of blinking lights, tape reels, a big screen. */
const GiantComputer: React.FC<{ frame: number; children?: React.ReactNode }> = ({ frame, children }) => (
  <X>
    <Part shape={roundRect(2600, 1300, 20)} color="#6a7a8a" shade={0.15} y={650} />
    {[-1000, -600, 600, 1000].map((x, i) => (
      <X key={x} x={x} y={650} z={0.001}>
        <Part shape={roundRect(320, 1100, 10)} color="#4a5866" shade={0.15} />
        {Array.from({ length: 6 }, (_, r) =>
          Array.from({ length: 4 }, (_, c) => (
            <Part
              key={`${r}${c}`}
              shape={circle(14)}
              color={["#fe5649", "#e9ba41", "#5af07a", "#7fd0ff"][(r + c + i) % 4]}
              flat
              outline={3}
              x={-90 + c * 60}
              y={380 - r * 70}
              opacity={(Math.floor(frame / 6) + r * 3 + c * 7 + i) % 5 < 3 ? 1 : 0.25}
              z={0.001}
            />
          )),
        )}
        {[-1, 1].map((k) => (
          <X key={k} x={k * 75} y={-280} z={0.001}>
            <Part shape={circle(62)} color="#2a2a30" shade={0.2} />
            <X rot={frame * 0.12 * k}>
              {[0, 1, 2].map((j) => (
                <Part key={j} shape={circle(12)} color="#8a94a0" flat outline={2.5} x={Math.cos((j * 2 * Math.PI) / 3) * 34} y={Math.sin((j * 2 * Math.PI) / 3) * 34} z={0.001} />
              ))}
            </X>
          </X>
        ))}
      </X>
    ))}
    <X y={760} z={0.002}>
      <Part shape={roundRect(760, 520, 18)} color="#2a2a30" shade={0.15} />
      <Part shape={roundRect(700, 460, 10)} color="#0e2a1e" flat outline={0} z={0.001} />
      <Glow rx={420} ry={300} color="#5af07a" alpha={0.18} additive z={0.002} />
      <X z={0.003}>{children}</X>
    </X>
  </X>
);

/** Light bulb (idea) above a head. */
const Bulb: React.FC<{ x: number; y: number; s?: number; on?: number }> = ({ x, y, s = 1, on = 1 }) =>
  s > 0.01 ? (
    <X x={x} y={y} s={s}>
      <Glow rx={160} color="#fff2a0" alpha={0.55 * on} additive z={-0.01} />
      <Part shape={circle(60)} color="#fff4b0" shade={0.15} y={30} />
      <Part shape={roundRect(54, 40, 8)} color="#b9bec6" shade={0.2} y={-40} z={0.001} />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = Math.PI * (0.15 + i * 0.175);
        return <Line key={i} pts={[[Math.cos(a) * 90, 30 + Math.sin(a) * 90], [Math.cos(a) * 130, 30 + Math.sin(a) * 130]]} width={6} color="#f2c94a" opacity={on} />;
      })}
    </X>
  ) : null;

/** Lines of code on a dark screen (green). */
const CodeLines: React.FC<{ w?: number; h?: number; frame: number }> = ({ w = 340, h = 240, frame }) => {
  const n = 7;
  const shown = Math.floor(frame / 8) % (n + 3);
  return (
    <X>
      {Array.from({ length: n }, (_, i) =>
        i < shown ? (
          <Part key={i} shape={roundRect(w * (0.3 + ((i * 37) % 50) / 100), 12, 4)} color="#7fe0b0" flat outline={0} x={-w / 2 + (w * (0.3 + ((i * 37) % 50) / 100)) / 2 + (i % 3) * 18} y={h / 2 - 30 - i * 32} />
        ) : null,
      )}
    </X>
  );
};

// ───────────────────────── born in Pretoria ─────────────────────────

// 69.67 "Elon Musk is born on June 28, 1971,"
export const BornShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const arm: [number, number] = [0.85, 1.25];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [-0.5, 0.7] }} vignette={0.6} bgBlur={6} bg={<HomeRoom shelf={false} />}>
        <Glow x={-200} y={160} rx={800} ry={600} color="#ffe2b0" alpha={0.25} additive z={-1} />
        <Character {...ERROL} x={420} y={-620} s={1.75} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile", gaze: [0.6, -0.4] }} pose={poses.idle(frame, 4)} z={-0.5} />
        <Character {...MAYE} x={-300} y={-640} s={1.95} look={0.55} expression={{ eyes: "happy", mouth: "smile", gaze: [0.5, -0.6] }} pose={{ ...poses.idle(frame, 2), armF: arm, armB: [0.7, 1.4] }} />
        <Baby x={-150} y={-330} s={1.1} rot={0.08} z={0.6} />
      </DepthStage>
      <Label text="JUNE 28, 1971" sub="ELON IS BORN" x={0.5} y={0.14} size={0.085} kind="title" at={at(70.9)} />
    </AbsoluteFill>
  );
};

// 73.41 "in Pretoria."
export const PretoriaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 100 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <PretoriaStreet mood="day" horizon={-300} />
      </Stage>
      <Label text="PRETORIA" sub="SOUTH AFRICA" x={0.1} y={0.1} size={0.06} kind="box" at={at(73.5)} />
    </AbsoluteFill>
  );
};

// 74.51 "His mother, Maye, is a model and a dietitian."
export const MayeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const flash = [74.9, 75.6, 76.2].reduce((m, a) => Math.max(m, hitAt(t, a, 0.2)), 0);
  const diet = t > 76.7;
  const arm: [number, number] = diet ? [0.95, 0.55] : [0.5, -1.9];
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }}
        light={{ dir: [0.6, 0.6] }}
        vignette={0.6}
        bgBlur={6}
        bg={
          <>
            <Room wall="#e8d8e8" floor="#c8b8c8" y={-420} boards={false} z={-40} />
            <Glow x={-600} y={300} rx={600} color="#ffffff" alpha={0.5 * flash} additive z={-30} />
          </>
        }
      >
        <Character
          {...MAYE}
          x={160}
          y={-600}
          s={1.95}
          facing={-1}
          look={0.6}
          expression={{ eyes: diet ? "open" : "happy", mouth: "smile", gaze: [0.6, 0.1] }}
          pose={{ ...poses.idle(frame, 1), armF: arm, armB: diet ? [-0.3, -0.3] : [-0.5, 1.9], headTilt: diet ? 0 : 0.06 }}
          holdF={diet ? <Part shape={circle(46)} color="#c8262f" shade={0.25} y={10} /> : null}
        />
      </DepthStage>
      <Flash k={flash * 0.35} />
      <Label text="MAYE MUSK" sub={t > 76.7 ? "MODEL & DIETITIAN" : "MODEL"} x={0.1} y={0.1} size={0.06} kind="box" at={at(75.28)} />
    </AbsoluteFill>
  );
};

// 77.84 "His father, Errol, is an engineer."
export const ErrolShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={6} bg={<HomeRoom shelf={false} />}>
        <Character {...ERROL} x={-380} y={-600} s={1.95} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.6, -0.4] }} pose={poses.point(frame)} />
        <X x={420} y={-300} rot={0.12} z={1}>
          <Part shape={roundRect(760, 520, 8)} color="#2f5f9a" shade={0.1} />
          <Line pts={[[-300, -150], [300, -150], [300, 160], [-300, 160], [-300, -150]]} width={5} color="#dbe8f6" z={0.001} />
          <Line pts={[[-300, 20], [0, 20], [0, 160]]} width={5} color="#dbe8f6" z={0.001} />
          <Part shape={circle(60)} color="#2f5f9a" flat outline={0} x={150} y={-40} z={0.001} />
          <Line pts={Array.from({ length: 25 }, (_, i) => [150 + Math.cos((i / 24) * Math.PI * 2) * 60, -40 + Math.sin((i / 24) * Math.PI * 2) * 60] as [number, number])} width={5} color="#dbe8f6" z={0.002} />
        </X>
      </DepthStage>
      <Label text="ERROL MUSK" sub="ENGINEER" x={0.9} y={0.1} size={0.06} kind="box" at={at(78.72)} />
    </AbsoluteFill>
  );
};

// 80.55 "And little Elon? He reads. All day."
export const LittleElonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const night = t > 83.45;
  const arm: [number, number] = [1.25, 0.9];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.2, 1.3), y: -140, x: 60 }} light={{ dir: [0.6, 0.5] }} vignette={0.65}>
        <HomeRoom night={night} />
        {night ? <Glow x={-300} y={0} rx={600} ry={500} color="#ffd98a" alpha={0.3} additive z={-1} /> : null}
        {[[-620, 0], [520, 1], [700, 2]].map(([x, i]) => (
          <BookRow key={x} x={x - 120} y={-470} h={70} n={5} seed={i + 4} rot={Math.PI / 2} z={1} />
        ))}
        <Character {...ELON_KID} x={0} y={-520} s={1.45} look={0.55} expression={{ eyes: "open", mouth: "smile", gaze: [0.5, -0.7] }} pose={{ ...poses.sit(frame), armF: arm, armB: [1.05, 1.0] }} holdF={<Book w={150} h={110} cover="#c8462f" accent="#e9ba41" rot={upright(arm) - 1.57} />} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};

// 84.45 "When he runs out of books, he reads the encyclopedia."
export const EncyclopediaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const pull = ramp(t, 85.9, 86.5);
  const arm: [number, number] = [1.4 - pull * 0.3, 0.6];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.25), y: -60, x: -200 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <HomeRoom shelf={false} />
        <X x={-520} y={-420} z={-10}>
          <Part shape={roundRect(640, 900, 10)} color="#8a5a32" shade={0.2} y={450} />
          {[0.15, 0.42, 0.69].map((k) => (
            <Part key={k} shape={roundRect(580, 230, 4)} color="#4a3020" flat outline={0} y={900 * k + 115} z={0.001} />
          ))}
          <BookRow x={-270} y={900 * 0.42 + 10} h={200} n={11} gold colors={["#7a2a2a"]} seed={9} z={0.002} />
        </X>
        <Character {...ELON_KID} x={60} y={-520} s={1.45} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", gaze: [0.6, 0.4] }} pose={{ ...poses.idle(frame, 2), armF: arm }} z={2} />
      </Stage>
      <Label text="THE ENCYCLOPEDIA" x={0.9} y={0.1} size={0.055} kind="box" at={at(86.5)} />
    </AbsoluteFill>
  );
};

// 87.70 "He gets so lost in his own thoughts that he doesn't hear people talking to him."
export const LostThoughtShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const talking = t > 90.0;
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const bp = sc(-430, 240, zoom, 0, 60);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <HomeRoom />
        <Character {...ELON_KID} x={260} y={-560} s={1.45} facing={-1} look={0.3} expression={{ eyes: "open", mouth: "flat", gaze: [0.6, 0.9] }} pose={poses.sit(frame)} z={2} />
        <ThoughtBubble x={420} y={330} tx={300} ty={-60} s={pop(t, 88.3)} z={4}>
          <Planet kind="mars" r={70} x={-120} y={30} glow={0} />
          <Part shape={roundRect(26, 110, 12)} color="#eef0f3" shade={0.2} x={60} y={0} rot={-0.5} />
          <Part shape={circle(10)} color="#e9ba41" flat outline={3} x={140} y={60} />
          <Part shape={circle(7)} color="#e9ba41" flat outline={3} x={-30} y={-80} />
        </ThoughtBubble>
        <Character {...MAYE} x={-640} y={-600} s={1.7} look={0.6} talking={talking} expression={{ eyes: "open", mouth: "open", brows: 0.4 }} pose={poses.talk(frame, 1)} z={3} />
        <SpeechBubble x={-430} y={240} w={300} h={170} tx={-560} ty={60} s={pop(t, 90.1)} z={4} />
      </Stage>
      <Label text="ELON?" x={bp.x} y={bp.y} size={0.045} pin kind="ink" at={sec(start)(90.2)} />
    </AbsoluteFill>
  );
};

// 92.08 "His parents even think he might be deaf."
export const DeafShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const arm: [number, number] = [1.45, 0.25];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Room wall="#dfe8ec" floor="#b8c4c8" y={-420} boards={false} z={-40} />
        <Character {...MAYE} x={-760} y={-500} s={1.3} look={0.5} expression={{ eyes: "open", mouth: "frown", brows: 0.7 }} pose={poses.idle(frame, 1)} z={1} />
        <Character {...ERROL} x={-470} y={-500} s={1.3} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.6 }} pose={poses.idle(frame, 3)} z={1.1} />
        <Character {...ELON_KID} x={60} y={-560} s={1.3} look={0.4} expression={{ eyes: "open", mouth: "flat", gaze: [-0.3, 0.2] }} pose={poses.sit(frame)} z={2} />
        <Character
          {...DOCTOR}
          x={560}
          y={-560}
          s={1.6}
          facing={-1}
          look={0.6}
          expression={{ eyes: "open", mouth: "flat", gaze: [0.6, -0.2] }}
          pose={{ ...poses.idle(frame, 6), armF: arm }}
          holdF={<Part shape={roundRect(18, 90, 8)} color="#2a2a30" shade={0.2} rot={upright(arm) + 1.2} />}
          z={3}
        />
      </Stage>
      <Label text="DEAF?" x={0.9} y={0.1} size={0.07} kind="box" at={at(93.7)} />
    </AbsoluteFill>
  );
};

// 94.53 "He isn't. He's just thinking."
export const JustThinkingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<HomeRoom />}>
        <Character {...ELON_KID} x={-420} y={-700} s={2.3} look={0.55} expression={{ eyes: "open", mouth: "smile", gaze: [0.5, 0.8] }} pose={poses.think} />
        <ThoughtBubble x={420} y={200} w={720} h={500} tx={-160} ty={80} s={pop(t, 95.6)} z={3}>
          {[0, 1, 2].map((i) => (
            <X key={i} x={-180 + i * 180} y={(i % 2) * 60 - 20} rot={frame * 0.05 * (i % 2 ? -1 : 1)}>
              <Part shape={poly(Array.from({ length: 16 }, (_, j) => {
                const a = (j / 16) * Math.PI * 2;
                const r = j % 2 ? 62 : 80;
                return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
              }))} color={["#e9ba41", "#3a7ac9", "#fe5649"][i]} shade={0.2} />
              <Part shape={circle(24)} color="#ffffff" flat outline={4} z={0.001} />
            </X>
          ))}
        </ThoughtBubble>
      </DepthStage>
      <Label text="NOT DEAF" x={0.1} y={0.1} size={0.055} kind="box" at={at(94.6)} />
      <Label text="JUST THINKING" x={0.9} y={0.86} size={0.06} kind="stamp" at={at(95.8)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── school ─────────────────────────

// 97.16 "School is a different story."
export const SchoolShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <SchoolSet horizon={-420} stairs={false}>
          {[-900, -560, 700, 1000].map((x, i) => (
            <Character key={x} {...BULLY(i)} x={x} y={-520 - (i % 2) * 40} s={0.95} facing={i < 2 ? 1 : -1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.walk(frame + i * 9, 1.0)} />
          ))}
          <Character {...ELON_SCHOOL} x={80} y={-600} s={0.85} look={0.4} expression={{ eyes: "open", mouth: "flat", brows: 0.5, gaze: [0.2, -0.5] }} pose={poses.walk(frame, 0.8)} z={2} />
        </SchoolSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 98.97 "Elon is small, shy and awkward, and the other kids notice."
export const SmallShyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const notice = t > 101.7;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SchoolSet horizon={-420} stairs={false}>
          {[-760, -420, 440, 780].map((x, i) => (
            <Character
              key={x}
              {...BULLY(i)}
              x={x}
              y={-560}
              s={1.35}
              facing={x < 0 ? 1 : -1}
              look={notice ? 0.6 : 0.2}
              expression={{ eyes: notice ? "open" : "half", mouth: notice ? "smirk" : "flat", gaze: notice ? [0.7, -0.4] : [0, 0] }}
              pose={notice && i % 2 ? poses.point(frame) : poses.idle(frame, i)}
            />
          ))}
          <Character {...ELON_SCHOOL} x={10} y={-580} s={1.0} look={0.2} expression={{ eyes: "sad", mouth: "flat", brows: 0.7, gaze: [0, -0.7], blush: true }} pose={{ ...poses.idle(frame, 5), armF: [0.7, 1.6], armB: [0.5, 1.7] }} z={2} />
        </SchoolSet>
      </Stage>
      <Label text="SMALL, SHY, AWKWARD" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(99.5)} />
    </AbsoluteFill>
  );
};

// 103.14 "One day, a group of boys throws him down a flight of concrete stairs."
export const StairsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 104.6, 106.05, Easing.in(Easing.quad));
  const hit = hitAt(t, 106.05, 0.4);
  // tumble from the top step (x≈-470, y≈+150) down to the foot of the stairs
  const fx = interpolate(fall, [0, 1], [-420, 520]);
  const fy = interpolate(fall, [0, 0.5, 1], [130, 20, -440]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.86, 0.92), y: -10, x: -180, shake: hit * 10 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SchoolSet horizon={-440} stairs>
          {[0, 1, 2].map((i) => (
            <Character key={i} {...BULLY(i)} x={-760 - i * 170} y={-440 + 8 * 64} s={0.95} look={0.6} expression={{ eyes: "angry", mouth: "grin", brows: -0.8 }} pose={i === 0 && t > 104.4 && t < 105.2 ? { armF: [1.6, 0.1], armB: [1.4, 0.2], lean: -0.15 } : poses.idle(frame, i)} z={1} />
          ))}
          <X x={fx} y={fy} rot={-fall * 6} z={2}>
            <Character {...ELON_SCHOOL} x={0} y={0} s={0.95} look={0.5} expression={{ eyes: fall > 0 ? "wide" : "open", mouth: fall > 0 ? "o" : "flat", brows: 0.8 }} pose={fall > 0 ? poses.scared(frame) : poses.idle(frame, 1)} shadow={fall === 0} />
          </X>
        </SchoolSet>
      </Stage>
      <Label text="CONCRETE STAIRS" x={0.9} y={0.1} size={0.05} kind="box" at={sec(start)(105.6)} />
    </AbsoluteFill>
  );
};

// 106.86 "They beat him until he blacks out,"
export const BlackoutShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dark = ramp(t, 107.6, 108.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.25 + dark * 0.2, y: 40, rot: Math.sin(frame * 0.08) * 0.03 }} light={{ dir: [-0.6, 0.6] }} vignette={0.9} vignetteColor="#000000" wash={dark * 0.95}>
        <SkyLookUp />
        {[0, 1, 2].map((i) => (
          <Character key={i} {...BULLY(i)} x={-560 + i * 560} y={-900} s={1.6} facing={i < 1 ? 1 : -1} look={0.4} expression={{ eyes: "angry", mouth: "teeth", brows: -0.9 }} pose={poses.idle(frame, i)} shadow={false} />
        ))}
        {Array.from({ length: 5 }, (_, i) => {
          const a = frame * 0.12 + (i * Math.PI * 2) / 5;
          return (
            <Part
              key={i}
              shape={poly(Array.from({ length: 10 }, (_, j) => {
                const aa = Math.PI / 2 + (j * Math.PI) / 5;
                const r = j % 2 ? 14 : 34;
                return [Math.cos(aa) * r, Math.sin(aa) * r] as [number, number];
              }))}
              color="#f2cc5a"
              flat
              outline={4}
              x={Math.cos(a) * 260}
              y={160 + Math.sin(a) * 90}
              z={5}
            />
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

/** Sky seen from the ground, school wall at the edges. */
const SkyLookUp: React.FC = () => (
  <>
    <Part shape={roundRect(4000, 3000, 0)} color="#9fd2f0" flat outline={0} z={-41} />
    <Part shape={roundRect(900, 3000, 0)} color="#a8543a" flat outline={6} x={-1250} rot={0.25} z={-40} />
    <Part shape={roundRect(900, 3000, 0)} color="#a8543a" flat outline={6} x={1250} rot={-0.25} z={-40} />
  </>
);

// 108.84 "and he ends up in the hospital."
export const HospitalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -80, x: -60 }} light={{ dir: [0.6, 0.6] }} vignette={0.6}>
        <Room wall="#cfe0e6" floor="#9fb4ba" y={-420} boards={false} z={-40}>
          <Window x={-760} y={1000} w={420} h={480} />
        </Room>
        <IVStand x={-560} y={-420} z={-5} />
        <HeartMonitor x={560} y={-40} s={0.9} z={-5} />
        <HospitalBed x={0} y={-460} w={900} z={1} />
        <X x={-300} y={-150} rot={-1.5} z={1.002}>
          <Character {...ELON_SCHOOL} x={0} y={-60} s={0.85} look={0.4} expression={{ eyes: "closed", mouth: "frown" }} pose={poses.idle(frame, 1)} shadow={false} />
        </X>
        <X x={-300 + 62} y={-150 + 2} rot={-1.5} z={1.01}>
          <Part shape={roundRect(176, 34, 10)} color="#ffffff" flat outline={4} y={310 * 0.85 - 60 + 30} />
        </X>
        <Part shape={roundRect(620, 80, 30)} color="#9ec6e2" shade={0.2} x={140} y={-180} z={1.02} />
      </Stage>
      <Label text="HOSPITAL" x={0.9} y={0.1} size={0.055} kind="box" at={at(109.7)} />
    </AbsoluteFill>
  );
};

// 110.65 "At home, things aren't easy either."
export const HomeHardShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 120 }} light={{ dir: [0.6, 0.5] }} vignette={0.75} vignetteColor="#0a0e18">
        <PretoriaStreet mood="storm" horizon={-420} />
        <Rain w={4000} h={2400} n={120} z={30} />
      </Stage>
    </AbsoluteFill>
  );
};

// 113.04 "His parents split up when he's young."
export const SplitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 113.3, 114.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Outdoors mood="dusk" horizon={-300} ground="#7a9a52" />
        <Line pts={[[0, -300], [-20, -420], [16, -520], [-10, -640], [12, -760]]} width={8} color="#3a2a22" z={-20} opacity={k} />
        <Character {...MAYE} x={-300 - k * 420} y={-560} s={1.35} facing={-1} look={0.5} expression={{ eyes: "sad", mouth: "frown" }} pose={poses.walk(frame, 0.8, 1)} z={1} />
        <Character {...ERROL} x={300 + k * 420} y={-560} s={1.35} facing={1} look={0.5} expression={{ eyes: "sad", mouth: "flat" }} pose={poses.walk(frame, 0.8, 2)} z={1} />
        <Character {...ELON_KID} x={0} y={-640} s={1.15} look={0.1} expression={{ eyes: "sad", mouth: "frown", brows: 0.8, gaze: [Math.sin(frame * 0.05), 0] }} pose={poses.idle(frame, 3)} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── the book ─────────────────────────

// 115.06 "As a teenager, he finds a book that changes how he sees the world."
export const BookFoundShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pull = ramp(t, 116.4, 117.1);
  const arm: [number, number] = [1.35, 0.4 - pull * 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: 0, x: -80 }} light={{ dir: [0.6, 0.5] }} vignette={0.65}>
        <Room wall="#8a6a4a" floor="#5a4030" y={-420} z={-40} />
        <Bookshelf x={-380} y={-420} w={900} h={1100} z={-10} />
        <Glow x={-140 + pull * 120} y={160} rx={240} color="#fff2a0" alpha={0.6} additive z={-5} />
        <Character {...ELON_TEEN} x={360} y={-560} s={1.55} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", gaze: [0.6, 0.3] }} pose={{ ...poses.idle(frame, 3), armF: arm }} holdF={pull > 0.05 ? <Book w={120} h={170} cover="#1e2a5a" accent="#5af07a" rot={upright(arm)} /> : null} z={2} />
      </Stage>
      <Label text="AS A TEENAGER" x={0.1} y={0.1} size={0.05} kind="box" at={sec(start)(115.1)} />
    </AbsoluteFill>
  );
};

/** The book cover (generic sci-fi paperback). */
const GuideCover: React.FC<{ frame: number; panic?: boolean }> = ({ frame, panic = false }) => (
  <X>
    <Part shape={roundRect(820, 1140, 16)} color="#f4ecd8" shade={0.08} x={16} y={-16} z={-0.002} />
    <Part shape={roundRect(820, 1140, 16)} color="#1a2a5a" shade={0.15} />
    <Glow rx={380} y={60} color="#5a7ad8" alpha={0.3} additive z={0.001} />
    <Planet kind="earth" r={190} y={40} glow={0} z={0.002} />
    <Part shape={ellipse(330, 46)} color="#e9ba41" flat outline={5} y={40} rot={0.25} z={0.0015} opacity={0.9} />
    <X x={260 + Math.sin(frame * 0.05) * 30} y={300} rot={-0.6} z={0.003}>
      <Part shape={roundRect(30, 120, 14)} color="#eef0f3" shade={0.2} />
    </X>
    {panic ? <Part shape={roundRect(620, 150, 30)} color="#c8262f" shade={0.15} y={-380} z={0.004} /> : null}
  </X>
);

// 118.69 "The Hitchhiker's Guide to the Galaxy."
export const GuideTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.86), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper color="#d8c8a8" />
        <X rot={-0.04}>
          <GuideCover frame={frame} />
        </X>
      </Stage>
      <Label text="THE HITCHHIKER'S GUIDE TO THE GALAXY" x={0.5} y={0.86} size={0.05} kind="box" at={at(118.75)} />
    </AbsoluteFill>
  );
};

// 120.67 "It's a funny science fiction story."
export const SciFiShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [1.2, 1.0];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SpaceBack />
        <Planet kind="mars" r={260} x={-640} y={240} />
        <Planet kind="moon" r={110} x={-260} y={420} />
        <X x={600 + Math.sin(frame * 0.05) * 60} y={300} rot={0.3 + Math.sin(frame * 0.07) * 0.1}>
          <Part shape={ellipse(170, 50)} color="#b9bec6" shade={0.22} />
          <Part shape={ellipse(80, 60)} color="#9fd2f0" flat outline={5} y={40} opacity={0.8} z={0.001} />
          <Glow rx={160} y={-60} color="#7fd0ff" alpha={0.4} additive z={0.002} />
        </X>
        <Character {...ELON_TEEN} x={200} y={-640} s={1.6} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.sit(frame), armF: arm, armB: [1.0, 1.1], bob: Math.abs(Math.sin(frame * 0.3)) * 8 }} holdF={<Book w={130} h={100} cover="#1a2a5a" accent="#e9ba41" rot={upright(arm) - 1.57} />} z={3} />
      </Stage>
      <Label text="FUNNY SCIENCE FICTION" x={0.9} y={0.1} size={0.05} kind="box" at={sec(start)(121.2)} />
    </AbsoluteFill>
  );
};

// 122.73 "In it, a giant computer says the answer to life, the universe and everything is 42."
export const ComputerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.62, 0.7);
  const p = sc(0, 340, zoom, 0, 360);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 360 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Room wall="#3a4250" floor="#2a2e36" y={-420} boards={false} z={-40} />
        <X y={-420} z={-10}>
          <GiantComputer frame={frame} />
        </X>
        {[-500, 0, 500].map((x, i) => (
          <Character key={x} {...STAFF(i + 1)} x={x} y={-640} s={1.1} look={0.3} expression={{ eyes: t > 127.6 ? "wide" : "open", mouth: t > 127.6 ? "o" : "flat", gaze: [0, 0.9] }} pose={poses.idle(frame, i)} z={2} />
        ))}
      </Stage>
      <Label text="THE ANSWER TO LIFE, THE UNIVERSE AND EVERYTHING" x={0.5} y={0.1} size={0.042} kind="box" at={sec(start)(124.6)} />
      <Label text="42" x={p.x} y={p.y} size={0.2} pin color="#5af07a" at={sec(start)(127.62)} />
    </AbsoluteFill>
  );
};

// 128.53 "The problem is, nobody knows what the question was."
export const QuestionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Room wall="#3a4250" floor="#2a2e36" y={-420} boards={false} z={-40} />
        {[-520, 0, 520].map((x, i) => (
          <React.Fragment key={x}>
            <Character {...STAFF(i + 1)} x={x} y={-600} s={1.3} facing={i === 2 ? -1 : 1} look={0.5} expression={{ eyes: "open", mouth: "wavy", brows: 0.7 }} pose={poses.shrug(Math.max(0, t - 129.3 - i * 0.15))} z={2} />
            <QuestionMark x={x + 40} y={240} s={0.9 * pop(t, 129.6 + i * 0.25)} z={3} />
          </React.Fragment>
        ))}
      </Stage>
      <Label text="WHAT WAS THE QUESTION?" x={0.5} y={0.86} size={0.055} kind="box" at={sec(start)(130.2)} />
    </AbsoluteFill>
  );
};

// 131.73 "Young Elon takes a lesson from it. The hardest part is often asking the right question."
export const LessonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<HomeRoom night />}>
        <Character {...ELON_TEEN} x={-80} y={-720} s={2.4} look={0.55} expression={{ eyes: "open", mouth: t > 134.5 ? "smile" : "flat", gaze: [0.5, 0.7] }} pose={poses.think} />
        <Bulb x={460} y={300} s={pop(t, 134.3) * 1.1} />
      </DepthStage>
      <Label text="THE LESSON" x={0.1} y={0.1} size={0.05} kind="box" at={at(132.6)} />
      <Label text="ASK THE RIGHT QUESTION" x={0.5} y={0.86} size={0.065} kind="stamp" at={at(135.0)} />
    </AbsoluteFill>
  );
};

// 136.57 "Remember this book. It comes back in a strange way."
export const RememberBookShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.78), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.75} vignetteColor="#0a0e18">
        <Part shape={roundRect(4000, 3000, 0)} color="#20242e" flat outline={0} z={-41} />
        <LightCone w={1500} h={2400} y={600} alpha={0.25} z={-30} />
        <X rot={0.05}>
          <GuideCover frame={frame} />
        </X>
      </Stage>
      <Label text="REMEMBER THIS BOOK" x={0.5} y={0.86} size={0.065} kind="stamp" at={at(136.7)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the coder ─────────────────────────

// 139.94 "He also teaches himself to code."
export const CodeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.25), y: 60, x: 160 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#0a0e18">
        <Room wall="#4a4a6a" floor="#3a3040" y={-460} z={-40} />
        <Glow x={380} y={60} rx={700} ry={500} color="#7fe0b0" alpha={0.2} additive z={-30} />
        <X x={420} y={-420} s={1.1} z={2}>
          <HomeComputer>
            <CodeLines frame={frame} />
          </HomeComputer>
        </X>
        <Character {...ELON_TEEN} x={-260} y={-560} s={1.85} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: -0.3, gaze: [0.8, 0.0] }} pose={{ ...poses.idle(frame, 3), armF: [1.25, 0.35 + Math.sin(frame * 1.1) * 0.08], armB: [1.1, 0.5 + Math.cos(frame * 1.3) * 0.08] }} z={3} />
      </Stage>
      <Label text="SELF-TAUGHT CODER" x={0.1} y={0.1} size={0.05} kind="box" at={sec(start)(140.3)} />
    </AbsoluteFill>
  );
};

// 141.84 "At 12, he builds a space video game called Blastar."
export const BlastarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 2.3, 2.5), y: -100 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#0a0e18">
        <Part shape={roundRect(4000, 3000, 0)} color="#2a2a3a" flat outline={0} z={-41} />
        <X y={-440}>
          <HomeComputer>
            <PixelGame frame={frame} />
          </HomeComputer>
        </X>
      </Stage>
      <Label text="AGE 12" x={0.1} y={0.1} size={0.055} kind="box" at={at(142.0)} />
      <Label text="BLASTAR" x={0.5} y={0.86} size={0.09} kind="title" at={at(144.3)} />
    </AbsoluteFill>
  );
};

// 145.24 "He sells it to a computer magazine for 500 dollars."
export const MagazineShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <Magazine x={-420} y={0} w={520} rot={-0.06} color="#2f6fa8" />
          <X x={460} y={-40} s={pop(t, 146.85) * 0.75} rot={0.05}>
            <Cheque w={900} />
          </X>
        </Paper>
      </Stage>
      <Label text="COMPUTER MAGAZINE" x={0.1} y={0.1} size={0.05} kind="box" at={at(145.9)} />
      <Label text="$500" x={0.5 + 460 / 1920 + 0.05} y={0.5 + 40 / 1080 - 0.01} size={0.07} pin kind="ink" at={at(147.0)} />
    </AbsoluteFill>
  );
};

// 148.30 "Years later, he jokes that it was 'a trivial game, but better than Flappy Bird.'"
export const FlappyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2a3242" flat outline={0} z={-41} />
        <Glow rx={900} ry={600} color="#4a6a9a" alpha={0.3} additive z={-40} />
        <PostCard y={0} w={1300} h={420} avatar="#3a3a42" s={pop(t, 148.6)} />
      </Stage>
      <Label text="YEARS LATER" x={0.1} y={0.1} size={0.05} kind="box" at={at(148.4)} />
      <Label text="“A TRIVIAL GAME… BUT BETTER THAN FLAPPY BIRD”" x={0.5} y={0.52} size={0.045} pin kind="ink" at={at(149.8)} />
    </AbsoluteFill>
  );
};

// 152.24 "You can still play it online today."
export const PlayOnlineShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Room wall="#d4d6da" floor="#9a9ea6" y={-420} boards={false} z={-40} />
        <X y={-420} z={-5}>
          <Desk w={1500} h={300} color="#8a6a4a" />
        </X>
        <Laptop x={0} y={-120} w={900} glow={0.6}>
          <X y={0} s={1.4}>
            <PixelGame frame={frame} w={380} h={230} />
          </X>
        </Laptop>
      </Stage>
      <Label text="STILL PLAYABLE ONLINE" x={0.5} y={0.1} size={0.05} kind="box" at={at(152.9)} />
    </AbsoluteFill>
  );
};

export const _unusedB = { Wash, Phone, House, Jacaranda, Sun, Moon, Stars, StarlinkSat, NURSE, PERSON, Flash };
