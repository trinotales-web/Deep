import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, circle, ellipse, blob, push, hitAt, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import { EURO, NationFlag, Steed, LogHut, Flame, Smoke, Louse, Microscope, DnaHelix, Desk, Doc, Tent, Calendar, Sea, Sky, IslandRock } from "../../kit/env";
import { sec, pop } from "../../kit/shot";
import { MapBack, StudySet, SnowField, MoscowSet, KremlinRoom, PalaceRoom, LabSet, ParisStreet, IslandSea, BattlefieldSet, RuleBoard } from "./sets";
import { NAPOLEON, NAPOLEON_GREY, SOLDIER, RUSSIAN, COSSACK, TSAR, SCIENTIST, PRUSSIAN, AUSTRIAN, REDCOAT } from "./cast";
import { atHead } from "../moon/frame";
import { HeldMusket, SHOULDER_ARMS, shoulderPose, eu, mapScr, keys, ThroneIcon } from "./util";

// Act F: Russia (1812), Moscow burning, the retreat and the snow, the 2025
// DNA study, the shrinking army, 1814 and Elba.

const L = { dir: [-0.6, 0.7] as [number, number] };
const RUSSIA_ROUTE: [number, number][] = [[23.9, 54.9], [27.6, 54.6], [30.4, 54.6], [32.05, 54.78], [35.0, 55.4], EURO.borodino, EURO.moscow];
const BACK_ROUTE: [number, number][] = [EURO.moscow, [35.0, 55.0], [32.05, 54.6], [30.0, 54.4], [28.5, 54.3], [26.0, 54.6], [23.9, 54.85]];

// 437.26 "And then comes his biggest mistake."
export const MistakeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.3, 0.42, 1.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: cam.y }} light={L} vignette={0.6}>
        <StudySet floor={-560}>
          <Character {...NAPOLEON} x={a.x} y={a.y} s={1.6} facing={1} look={0.6} expression={{ eyes: "squint", mouth: "smirk", brows: -0.5, gaze: [0.6, 0.3] }} pose={poses.point(frame)} z={-12} />
        </StudySet>
      </Stage>
      <Label text="HIS BIGGEST MISTAKE" x={0.5} y={0.88} size={0.06} kind="stamp" rotate={-3} at={at(438.3)} />
    </AbsoluteFill>
  );
};

// 439.44 "Russia."
export const RussiaTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const c = eu([34, 54]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.95), x: c[0], y: c[1] }} light={L} vignette={0.45}>
        <MapBack tint={{ Russia: "#3f8a5a", Belarus: "#3f8a5a", Ukraine: "#3f8a5a", Lithuania: "#3f8a5a", Latvia: "#3f8a5a", Estonia: "#3f8a5a" }} tintK={0.6} />
      </Stage>
      <Label text="RUSSIA" x={0.5} y={0.45} size={0.13} kind="title" at={at(439.4)} />
    </AbsoluteFill>
  );
};

// 440.46 "In June 1812, he invades with around 600,000 men."
export const NiemenShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const n = Math.round(keys(t, [[442.3, 0], [443.2, 600000]]) / 1000) * 1000;
  const march = (t - 440.2) * 70;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 260 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.8}>
          <Part shape={roundRect(9000, 260, 0)} color="#4f8fc0" flat outline={6} y={-140} z={-45} />
          <Part shape={roundRect(260, 1200, 6)} color="#a87a4a" shade={0.15} x={0} y={-140} rot={0.0} z={-44} />
          {Array.from({ length: 6 }, (_, i) => (
            <Line key={i} pts={[[-130, -720 + i * 200], [130, -720 + i * 200]]} width={5} color="#7a5a32" z={-43.9} />
          ))}
          {Array.from({ length: 18 }, (_, i) => {
            const row = i % 3;
            const col = Math.floor(i / 3);
            return (
              <Character key={i} {...SOLDIER(i)} x={-1500 + col * 300 + row * 80 + march} y={-560 + row * 160 - (col % 2) * 20} s={0.62} facing={1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={{ ...poses.walk(frame + i * 4, 0.6), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-20 + row * -0.5 - i * 0.001} />
            );
          })}
          {[0, 1, 2].map((i) => (
            <NationFlag key={i} kind="france" x={-1100 + i * 800 + march} y={-420 + (i % 2) * 120} w={160} pole={420} z={-19} />
          ))}
        </BattlefieldSet>
      </Stage>
      <Label text="JUNE 1812" x={0.5} y={0.1} size={0.08} kind="title" at={at(440.6)} />
      <Label text={`${n.toLocaleString("en-US")} MEN`} x={0.5} y={0.86} size={0.07} kind="box" at={at(442.3)} />
    </AbsoluteFill>
  );
};

// 443.92 "The Russians don't stand and fight."
export const RetreatRussShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const go = (t - 443.7) * 160;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), x: go * 0.5, y: 120 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.3} grass="#9aa060">
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...RUSSIAN(i)} x={-400 + go + i * 260} y={-430 - (i % 2) * 40} s={0.95} facing={1} look={0.15} expression={{ eyes: "open", mouth: "smirk" }} pose={{ ...poses.walk(frame + i * 5, 0.8), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-10 - (i % 2) * 0.5} />
          ))}
          <Steed x={-800 + go} y={-480} s={0.8} walk={0.9} color="#5a3a26" cloth="#2a3a6a" z={-9}>
            <Character {...COSSACK(0)} s={0.62} facing={1} look={0.1} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.sit(frame)} />
          </Steed>
        </BattlefieldSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 445.67 "They pull back and burn the land behind them."
export const ScorchedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const burn = ramp(t, 446.3, 447.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.85), y: 140 }} light={L} vignette={0.6}>
        <BattlefieldSet floor={-460} sun={0} dusk grass="#8a8a50">
          {[-900, -200, 600].map((x, i) => (
            <X key={i}>
              <LogHut x={x} y={-300 - (i % 2) * 60} s={0.8} burnt={burn} z={-30 - i * 0.01} />
              {burn > 0 ? (
                <X x={x} y={-160 - (i % 2) * 60} s={1.8 * burn} z={-29.9 - i * 0.01}>
                  <Flame size={2} seed={i} />
                </X>
              ) : null}
            </X>
          ))}
          {burn > 0 ? <Smoke x={0} y={400} w={3000} h={1400} alpha={0.5 * burn} color="#4a3e40" seed={3} z={-28} /> : null}
          <Character {...RUSSIAN(2)} x={900} y={-470} s={1.1} facing={1} look={0.2} expression={{ eyes: "squint", mouth: "flat" }} pose={{ ...poses.walk(frame, 0.7), armF: [1.6, 0.4] }} holdF={<X rot={1.0} s={0.8}><Part shape={roundRect(16, 160, 6)} color="#6a4424" shade={0.2} y={-60} /><X y={30} s={0.6}><Flame seed={2} /></X></X>} z={-10} />
        </BattlefieldSet>
      </Stage>
      <Label text="SCORCHED EARTH" x={0.06} y={0.09} size={0.05} kind="box" at={at(446.5)} />
    </AbsoluteFill>
  );
};

/** Russia map stage with the advance (and optional retreat) arrows. */
const RussiaMap: React.FC<{ frame: number; dur: number; k: number; back?: number; snow?: number; children?: React.ReactNode; zoom?: number }> = ({ frame, dur, k, back = 0, snow = 0, children, zoom = 1.5 }) => {
  const c = eu([30, 55.2]);
  return (
    <Stage camera={{ zoom: push(frame, dur, zoom, zoom * 1.05), x: c[0], y: c[1] }} light={L} vignette={0.45}>
      <MapBack snow={snow} routes={[{ pts: RUSSIA_ROUTE, k, width: 50, color: "#d8a85a" }, ...(back > 0 ? [{ pts: BACK_ROUTE, k: back, width: 14, color: "#211b20" }] : [])]} pins={[{ at: EURO.moscow, color: "#3f8a5a", s: k > 0.95 ? 1 : 0 }]} />
      {children}
    </Stage>
  );
};

// 447.98 "Napoleon chases them deeper and deeper."
export const DeeperMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <RussiaMap frame={frame} dur={dur} k={ramp(t, 448.0, 449.9)} />
      <Label text="DEEPER AND DEEPER" x={0.06} y={0.85} size={0.045} kind="box" at={at(449.0)} />
    </AbsoluteFill>
  );
};

// 450.24 "In September, he reaches Moscow."
export const MoscowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.7, 0.75), y: 300 }} light={L} vignette={0.5}>
        <MoscowSet floor={-460}>
          {Array.from({ length: 4 }, (_, i) => (
            <Character key={i} {...SOLDIER(i + 1)} x={-900 + i * 240} y={-560 - (i % 2) * 40} s={0.9} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "o" }} pose={shoulderPose(frame, i)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-10 - (i % 2) * 0.5} />
          ))}
          <Character {...NAPOLEON_GREY} x={-1250} y={-560} s={1.0} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "smirk" }} pose={poses.point(frame)} z={-9} />
        </MoscowSet>
      </Stage>
      <Label text="SEPTEMBER 1812" x={0.5} y={0.1} size={0.07} kind="title" at={at(450.4)} />
      <Label text="MOSCOW" x={0.94} y={0.85} size={0.06} kind="box" at={at(451.4)} />
    </AbsoluteFill>
  );
};

// 452.25 "Soon, the city is on fire."
export const MoscowFireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.68, 0.74), y: 380 }} light={L} vignette={0.6}>
        <MoscowSet floor={-460} fire={ramp(t, 452.1, 453.4)} night />
      </Stage>
    </AbsoluteFill>
  );
};

// 454.11 "He waits five weeks for the Tsar to surrender."
export const WaitsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const pace = Math.sin(frame * 0.05) * 260;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: 60 }} light={L} vignette={0.55}>
        <KremlinRoom floor={-520} fire={0.7}>
          <Character {...NAPOLEON_GREY} x={-100 + pace} y={-520} s={1.3} facing={Math.cos(frame * 0.05) > 0 ? 1 : -1} look={0.4} expression={{ eyes: "half", mouth: "flat", brows: 0.3, eyebags: true }} pose={poses.walk(frame, 0.4)} z={-10} />
        </KremlinRoom>
      </Stage>
      <Label text={`WEEK ${Math.min(5, 1 + Math.floor(keys(t, [[454.2, 0], [456.2, 4.99]])))}`} x={0.06} y={0.09} size={0.05} kind="box" at={at(454.3)} />
    </AbsoluteFill>
  );
};

// 456.55 "The Tsar never does."
export const TsarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.48, 1.9);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<PalaceRoom floor={-700} />}>
        <Character {...TSAR} x={a.x} y={a.y} s={1.9} facing={1} look={0.15 + Math.sin(frame * 0.4) * 0.15} expression={{ eyes: "angry", mouth: "frown", brows: -0.7 }} pose={poses.handsOnHips} z={-6} />
      </DepthStage>
      <Label text="TSAR ALEXANDER I" x={0.06} y={0.85} size={0.045} kind="box" at={at(456.6)} />
      <Label text="NO SURRENDER" x={0.78} y={0.25} size={0.07} kind="stamp" rotate={-6} at={at(457.0)} pin />
    </AbsoluteFill>
  );
};

// 458.29 "So in October, Napoleon turns back."
export const TurnsBackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <RussiaMap frame={frame} dur={dur} k={1} back={ramp(t, 459.3, 460.6)} />
      <Label text="OCTOBER 1812" x={0.5} y={0.1} size={0.07} kind="title" at={at(458.5)} />
      <Label text="TURNS BACK" x={0.94} y={0.85} size={0.05} kind="box" at={at(459.9)} />
    </AbsoluteFill>
  );
};

/** Freezing soldiers trudging through snow. */
const Trudge: React.FC<{ frame: number; n?: number; x0?: number; y?: number; s?: number; z?: number; dx?: number }> = ({ frame, n = 5, x0 = -900, y = -460, s = 1, z = -10, dx = 360 }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <Character key={i} {...SOLDIER(i + 2)} outfit={{ ...SOLDIER(i + 2).outfit, patches: "#8a7a5a", scarf: i % 2 ? "#8a3a3a" : "#5a6a8a" }} hat={i % 3 === 0 ? "ushanka" : "shako"} x={x0 + i * dx + frame * 0.8} y={y - (i % 2) * 30} s={s} facing={1} look={0.3} expression={{ eyes: "half", mouth: "wavy", brows: 0.8, eyebags: true }} pose={{ ...poses.walk(frame * 0.5 + i * 7, 0.35), lean: 0.12 }} z={z - (i % 2) * 0.5 - i * 0.01} />
    ))}
  </>
);

// 460.94 "Then the snow comes."
export const SnowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 120 }} light={L} vignette={0.6}>
        <SnowField floor={-460} snow={ramp(t, 460.8, 461.6)}>
          <Trudge frame={frame} />
        </SnowField>
      </Stage>
    </AbsoluteFill>
  );
};

// 462.92 "But here's a myth."
export const MythSnowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 120 }} light={L} vignette={0.6}>
        <SnowField floor={-460} snow={0.8}>
          <Trudge frame={frame} n={4} x0={-700} />
        </SnowField>
      </Stage>
      <Label text="MYTH" x={0.5} y={0.42} size={0.13} kind="stamp" rotate={-6} at={at(463.4)} pin />
    </AbsoluteFill>
  );
};

/** Big snowflake icon. */
const Snowflake: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    {Array.from({ length: 3 }, (_, i) => (
      <X key={i} rot={(i / 3) * Math.PI}>
        <Part shape={roundRect(30, 420, 14)} color="#dfeaf8" shade={0.15} />
        {[-1, 1].map((k) => (
          <X key={k} y={k * 130}>
            <X rot={0.7}><Part shape={roundRect(18, 110, 8)} color="#dfeaf8" flat outline={4} /></X>
            <X rot={-0.7}><Part shape={roundRect(18, 110, 8)} color="#dfeaf8" flat outline={4} /></X>
          </X>
        ))}
      </X>
    ))}
  </X>
);

// 464.11 "The winter didn't destroy his army on its own."
export const NotWinterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2c3a5e" flat outline={0} z={-30} />
        <Snowflake x={-420} y={60} s={pop(t, 464.2)} z={-10} />
        <QuestionMark x={420} y={60} size={1.8 * pop(t, 465.6)} z={-10} />
      </Stage>
      <Label text="WINTER" x={0.28} y={0.85} size={0.05} kind="box" at={at(464.3)} pin />
      <Label text="+ ?" x={0.72} y={0.85} size={0.05} kind="box" at={at(465.6)} pin />
    </AbsoluteFill>
  );
};

// 466.41 "Disease killed huge numbers too."
export const DiseaseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 100 }} light={L} vignette={0.6}>
        <SnowField floor={-460} snow={0.4}>
          <Tent x={-200} y={-420} w={900} h={560} a="#c9bfa8" b="#a89e88" z={-20} />
          {[0, 1, 2].map((i) => (
            <X key={i} x={-560 + i * 380} y={-360} rot={Math.PI / 2 - 0.05} z={-12 - i * 0.01}>
              <Character {...SOLDIER(i + 4)} hat={null} s={0.8} look={0.1} expression={{ eyes: "closed", mouth: "wavy", sweat: true, eyebags: true }} pose={{ armF: [0.1, 0.2], armB: [-0.1, -0.1] }} skin="#dfe8d0" shadow={false} />
            </X>
          ))}
          {[0, 1, 2].map((i) => (
            <Part key={`b${i}`} shape={roundRect(260, 70, 30)} color="#8a7a6a" shade={0.2} x={-420 + i * 380} y={-360} z={-11.9 - i * 0.01} />
          ))}
        </SnowField>
      </Stage>
      <Label text="DISEASE" x={0.5} y={0.1} size={0.08} kind="title" at={at(466.5)} />
    </AbsoluteFill>
  );
};

// 468.62 "In 2025, scientists studied DNA from soldiers buried in a mass grave in Lithuania."
export const DnaLabShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.26, 0.42, 1.5);
  const b = atHead(cam, 0.76, 0.44, 1.45);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: cam.y }} light={L} vignette={0.5}>
        <LabSet floor={-560}>
          <Character {...SCIENTIST(0)} x={a.x} y={a.y} s={1.5} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "smile", gaze: [0.6, 0] }} pose={poses.point(frame)} z={-12} />
          <Character {...SCIENTIST(1)} x={b.x} y={b.y} s={1.45} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "o" }} pose={poses.think} z={-12} />
          <DnaHelix x={60} y={60} h={620} r={90} z={-11} />
        </LabSet>
      </Stage>
      <Label text="2025" x={0.5} y={0.1} size={0.08} kind="title" at={at(468.8)} />
      <Label text="DNA" x={0.5} y={0.85} size={0.05} kind="box" at={at(470.7)} pin />
      <Label text="MASS GRAVE · VILNIUS, LITHUANIA" x={0.06} y={0.85} size={0.04} kind="box" at={at(472.2)} />
    </AbsoluteFill>
  );
};

/** Water droplet icon (dirty water). */
const Drop: React.FC<{ x?: number; y?: number; s?: number; z?: number; dirty?: boolean }> = ({ x = 0, y = 0, s = 1, z = 0, dirty = true }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={blob([[0, 160], [-70, 40], [-90, -40], [-50, -110], [0, -126], [50, -110], [90, -40], [70, 40]], 10)} color={dirty ? "#8a8a5a" : "#5ab0e8"} shade={0.24} />
    {dirty ? [[-30, -30], [20, 10], [10, -70]].map(([px, py], i) => <Part key={i} shape={circle(12)} color="#5a5a3a" flat outline={0} x={px} y={py} z={0.001} />) : null}
  </X>
);

// 474.00 "They found fevers spread by dirty water and by lice."
export const LiceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#24304a" flat outline={0} z={-30} />
        <Microscope x={-640} y={-420} s={1.1} z={-12} />
        <Drop x={-60} y={40} s={pop(t, 475.6)} z={-10} />
        <X x={520} y={40} z={-10}>
          <Part shape={circle(300)} color="#e8f2e8" flat outline={10} s={pop(t, 476.2)} />
          <Louse x={0} y={0} s={1.5 * pop(t, 476.45)} walk={1} z={0.01} />
        </X>
      </Stage>
      <Label text="FEVERS" x={0.5} y={0.1} size={0.07} kind="title" at={at(474.4)} />
      <Label text="DIRTY WATER" x={0.47} y={0.83} size={0.045} kind="box" at={at(475.6)} pin />
      <Label text="LICE" x={0.77} y={0.83} size={0.045} kind="box" at={at(476.5)} pin />
    </AbsoluteFill>
  );
};

// 477.49 "Of the roughly 600,000 men who marched into Russia, only a small fraction came home."
export const MinardShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const back = ramp(t, 479.8, 482.0, Easing.linear);
  const c = eu([30, 55]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.5, 1.56), x: c[0], y: c[1] }} light={L} vignette={0.45}>
        <MapBack snow={0.7} routes={[{ pts: RUSSIA_ROUTE, k: 1, width: 70, color: "#d8a85a", taper: 0.45 }, { pts: BACK_ROUTE, k: back, width: 24, color: "#211b20", taper: 0.25 }]} pins={[{ at: EURO.moscow, color: "#3f8a5a" }]} />
      </Stage>
      <Label text="600,000 IN" x={0.06} y={0.09} size={0.05} kind="box" at={at(478.0)} />
      <Label text="A SMALL FRACTION CAME HOME" x={0.5} y={0.86} size={0.05} kind="box" at={at(481.0)} />
    </AbsoluteFill>
  );
};

// 483.32 "After that, all of Europe turns on him."
export const EuropeTurnsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = (i: number) => ramp(t, 483.6 + i * 0.25, 485.0 + i * 0.25);
  const c = eu([10, 50]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), x: c[0], y: c[1] }} light={L} vignette={0.45}>
        <MapBack tint={{ France: "#3b62b8" }} tintK={0.7} routes={[
          { pts: [[30, 55], [20, 53], [12, 51.5], [6.5, 49.5]], k: k(0), width: 30, color: "#3f8a5a" },
          { pts: [[13.4, 52.5], [9, 51], [6.6, 50]], k: k(1), width: 26, color: "#211b20" },
          { pts: [[16.4, 48.2], [11, 48], [7.4, 47.8]], k: k(2), width: 26, color: "#e8e6ee" },
          { pts: [[-1.0, 52.0], [1.0, 51.2], [2.6, 50.6]], k: k(3), width: 26, color: "#d8463a" },
          { pts: [[18.0, 59.3], [12, 56], [8, 52.6]], k: k(4), width: 22, color: "#e2b23c" },
        ]} />
      </Stage>
      <Label text="ALL OF EUROPE" x={0.5} y={0.1} size={0.07} kind="title" at={at(484.1)} />
    </AbsoluteFill>
  );
};

// 485.87 "In 1814, his enemies take Paris, and he's forced to give up his throne."
export const AbdicateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const inside = t > 488.75;
  const march = (t - 485.7) * 150;
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.36, 0.42, 1.6);
  return (
    <AbsoluteFill>
      {!inside ? (
        <Stage camera={{ zoom: push(frame, dur, 0.8, 0.84), y: 160 }} light={L} vignette={0.5}>
          <ParisStreet floor={-460} palace>
            {[0, 1, 2, 3, 4].map((i) => {
              const d = [RUSSIAN(i), PRUSSIAN(i), AUSTRIAN(i), RUSSIAN(i + 1), PRUSSIAN(i + 1)][i];
              return <Character key={i} {...d} x={-1300 + march + i * 280} y={-460 - (i % 2) * 40} s={0.95} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.walk(frame + i * 5, 0.7), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-10 - (i % 2) * 0.5} />;
            })}
            <NationFlag kind="russia" x={-1100 + march} y={-420} w={180} pole={560} z={-9.5} />
            <NationFlag kind="prussia" x={-500 + march} y={-420} w={180} pole={560} z={-9.5} />
          </ParisStreet>
        </Stage>
      ) : (
        <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: cam.y }} light={L} vignette={0.6}>
          <StudySet floor={-560}>
            <Character {...NAPOLEON} x={a.x} y={a.y} s={1.6} facing={1} look={0.6} expression={{ eyes: "sad", mouth: "frown", brows: 0.6, eyebags: true }} pose={{ armF: [1.1, 0.7], armB: [-0.2, 0.3] }} z={-12} />
            <Desk x={380} y={-560} w={800} z={-8} />
            <X x={360} y={-170} rot={0.05} z={-7.9}>
              <Doc w={320} />
            </X>
          </StudySet>
        </Stage>
      )}
      <Label text="1814" x={0.5} y={0.1} size={0.08} kind="title" at={at(486.0)} until={at(488.7)} />
      <Label text="ENEMIES TAKE PARIS" x={0.06} y={0.85} size={0.045} kind="box" at={at(487.4)} until={at(488.7)} />
      <Label text="ABDICATION" x={0.74} y={0.2} size={0.07} kind="stamp" rotate={-5} at={at(489.7)} pin />
    </AbsoluteFill>
  );
};

// 491.11 "They send him to Elba, a small island off Italy."
export const ElbaMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const elba = eu(EURO.elba);
  const zoom = keys(t, [[491.0, 1.0], [493.5, 2.4]]);
  const cam = { zoom, x: elba[0] - 40, y: elba[1] };
  const se = mapScr(elba, cam);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack islands={["corsica", "elba", "sardinia"]} tint={{ Italy: "#e8d8a0" }} tintK={0.5} pins={[{ at: EURO.elba, color: "#2c4486", s: pop(t, 491.7) }]} />
      </Stage>
      <Label text="ELBA" x={se.x + 0.08} y={se.y - 0.02} size={0.06} kind="box" at={at(491.8)} pin />
      <Label text="ITALY" x={0.8} y={0.25} size={0.045} kind="box" at={at(493.6)} pin />
    </AbsoluteFill>
  );
};

// 494.61 "He even gets to keep the title of emperor."
export const IslandEmperorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.46, 1.8);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<IslandSea floor={-600} kind="elba" islandX={600} />}>
        <Character {...NAPOLEON} x={a.x} y={a.y} s={1.8} facing={1} look={0.15} expression={{ eyes: "happy", mouth: "smirk", blush: true }} pose={poses.handsOnHips} z={-6} />
      </DepthStage>
      <Label text="“EMPEROR”" x={0.5} y={0.1} size={0.08} kind="title" at={at(496.1)} />
    </AbsoluteFill>
  );
};

// 497.03 "Of an island."
export const OfAnIslandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const zoom = keys(t, [[496.9, 1.2], [498.2, 0.55]]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 100 }} light={L} vignette={0.5}>
        <Sky w={8000} h={5000} y={1200} z={-60} />
        <Sea w={8000} h={4000} y={-1600} color="#2f7ab0" z={-55} />
        <IslandRock kind="elba" x={0} y={0} w={700} s={0.8} z={-20} />
        <X x={40} y={240} z={-19}>
          <Character {...NAPOLEON} s={0.4} look={0.2} expression={{ eyes: "happy", mouth: "smirk" }} pose={poses.handsOnHips} shadow={false} />
        </X>
      </Stage>
      <Label text="OF AN ISLAND" x={0.5} y={0.86} size={0.07} kind="box" at={at(497.3)} />
    </AbsoluteFill>
  );
};

export const _f = { Calendar, Glow, Line, ellipse, hitAt, REDCOAT, RuleBoard, ThroneIcon };
