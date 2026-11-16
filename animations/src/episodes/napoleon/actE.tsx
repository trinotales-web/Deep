import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, roundPoly, circle, ellipse, blob, poly, push, hitAt, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import { NationFlag, WorldMap, worldXY, Doc, Desk, MoneyBag, LaurelCrown, GothicNave, Smoke, Sun } from "../../kit/env";
import { sec, pop } from "../../kit/shot";
import { CaribbeanSet, StudySet, BattlefieldSet, SpainSet, RuleBoard, PalaceRoom } from "./sets";
import { NAPOLEON, NAPOLEON_GREY, NAPOLEON_CROWNED, SOLDIER, OFFICER, HAITIAN, DIPLOMAT, POPE, GUERRILLA, ROYALIST, GRENADIER } from "./cast";
import { atHead } from "../moon/frame";
import { HeldMusket, SHOULDER_ARMS, AIM, aimPose, shoulderPose, LouisianaOverlay, WorldOverlay, US_1803, keys } from "./util";

// Act E: slavery restored and the Haitian Revolution, the Louisiana Purchase,
// the coronation (1804), Austerlitz (1805), Spain (1808).

const L = { dir: [-0.6, 0.7] as [number, number] };

/** Iron chain links in a row. */
const Chain: React.FC<{ x?: number; y?: number; s?: number; z?: number; n?: number; broken?: number }> = ({ x = 0, y = 0, s = 1, z = 0, n = 6, broken = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    {Array.from({ length: n }, (_, i) => {
      const gap = i >= n / 2 ? broken * 80 : -broken * 80;
      return (
        <X key={i} x={(i - (n - 1) / 2) * 90 + gap} rot={i % 2 ? 0 : 0} z={i % 2 ? 0.01 : 0}>
          <Part shape={roundRect(120, i % 2 ? 30 : 60, 30)} color="#6a6a72" shade={0.25} />
          {i % 2 ? null : <Part shape={roundRect(70, 22, 11)} color="#2a2430" flat outline={3} z={0.001} />}
        </X>
      );
    })}
  </X>
);

// 364.89 "And in 1802, he brings back slavery in France's colonies."
export const SlaveryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 18;
  const center: [number, number] = [-68, 18];
  const pins: [number, number][] = [[-72.3, 19.0], [-61.55, 16.2], [-61.0, 14.65]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.55}>
        <WorldMap ppd={ppd} center={center} w={2400} h={1400} tint={{ Haiti: "#3b62b8" }} tintK={0.6} pins={pins.map((p, i) => ({ at: p, s: pop(t, 367.5 + i * 0.15), color: "#2c4486" }))} z={-20} />
        <Chain x={0} y={-380} s={1.3 * pop(t, 366.9)} z={-5} />
      </Stage>
      <Label text="1802" x={0.5} y={0.1} size={0.08} kind="title" at={at(365.2)} />
      <Label text="SLAVERY RESTORED" x={0.5} y={0.86} size={0.06} kind="stamp" rotate={-3} at={at(366.9)} />
    </AbsoluteFill>
  );
};

// 368.86 "In Haiti, the people fight back and beat his army."
export const HaitiFightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const push2 = (t - 368.7) * 200;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.87), x: push2 * 0.5, y: 120, shake: hitAt(t, 370.8) * 8 }} light={L} vignette={0.5}>
        <CaribbeanSet floor={-460} smoke={0.7}>
          {Array.from({ length: 4 }, (_, i) => (
            <Character key={i} {...HAITIAN(i)} x={-900 + push2 + i * 280} y={-440 - (i % 2) * 40} s={1.0} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "shout", brows: -0.6 }} pose={{ ...poses.run(frame + i * 5, i), armF: AIM }} holdF={<HeldMusket arm={AIM} dir={0.08} fire={i === 1 ? Math.max(0, Math.min(1, (t - 370.0) / 0.6)) : 0} />} z={-10 - (i % 2) * 0.5} />
          ))}
          <NationFlag kind="haiti" x={-620 + push2} y={-420} w={220} pole={640} z={-9.5} />
          {[0, 1, 2].map((i) => (
            <Character key={`f${i}`} {...SOLDIER(i + 2)} x={700 + push2 * 1.4 + i * 240} y={-430 - (i % 2) * 40} s={0.95} facing={1} look={0.7} expression={{ eyes: "wide", mouth: "o", sweat: true }} pose={poses.run(frame + i * 7, i)} z={-12 - (i % 2) * 0.5} />
          ))}
        </CaribbeanSet>
      </Stage>
      <Label text="HAITI" x={0.06} y={0.09} size={0.05} kind="box" at={at(369.0)} />
    </AbsoluteFill>
  );
};

// 371.81 "In 1804, Haiti becomes independent."
export const HaitiFreeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const rise = ramp(t, 372.8, 373.8, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 120 }} light={L} vignette={0.45}>
        <CaribbeanSet floor={-460}>
          <NationFlag kind="haiti" x={0} y={-460 - (1 - rise) * 300} w={320} pole={780} z={-15} />
          {Array.from({ length: 4 }, (_, i) => (
            <Character key={i} {...HAITIAN(i)} x={(i < 2 ? -1 : 1) * (360 + (i % 2) * 300)} y={-450 - (i % 2) * 30} s={1.05} facing={i < 2 ? 1 : -1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame + i * 7)} z={-10 - (i % 2) * 0.5} />
          ))}
        </CaribbeanSet>
      </Stage>
      <Label text="1804" x={0.5} y={0.1} size={0.08} kind="title" at={at(371.9)} />
      <Label text="HAITI: INDEPENDENT" x={0.5} y={0.88} size={0.06} kind="box" at={at(373.6)} />
    </AbsoluteFill>
  );
};

// 374.97 "Losing Haiti also wrecks his plans for America."
export const AmericaPlansShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const crumple = ramp(t, 375.9, 376.5);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.32, 0.42, 1.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: cam.y }} light={L} vignette={0.5}>
        <StudySet floor={-560}>
          <Character {...NAPOLEON} hat={null} x={a.x} y={a.y} s={1.6} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "frown", brows: -0.7 }} pose={{ armF: [1.1, 0.6], armB: [-0.2, 0.4], handF: "fist" }} z={-12} />
          <Desk x={360} y={-560} w={900} z={-8} />
          <X x={360} y={-150 + crumple * 40} s={1 - crumple * 0.7} rot={crumple * 1.6} z={-7}>
            <Part shape={roundRect(520, 360, 10)} color="#f2e6c8" shade={0.12} />
            <X z={0.001} s={0.3}>
              <WorldMap ppd={8} center={[-90, 38]} w={1600} h={1100} waves={false} />
            </X>
          </X>
        </StudySet>
      </Stage>
      <Label text="PLANS FOR AMERICA" x={0.7} y={0.15} size={0.045} kind="box" at={at(376.4)} pin />
    </AbsoluteFill>
  );
};

const NA = { ppd: 9, center: [-92, 40] as [number, number] };

// 377.57 "So in 1803, he sells a huge piece of land to the United States."
export const LouisianaMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sold = ramp(t, 379.0, 380.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1) }} light={L} vignette={0.45}>
        <WorldMap ppd={NA.ppd} center={NA.center} w={2400} h={1400} z={-20} />
        <WorldOverlay ring={US_1803} ppd={NA.ppd} center={NA.center} color="#3f8a5a" z={-19} />
        <LouisianaOverlay ppd={NA.ppd} center={NA.center} color={sold > 0.5 ? "#3f8a5a" : "#3b62b8"} k={1} z={-18.9} />
      </Stage>
      <Label text="1803" x={0.5} y={0.1} size={0.08} kind="title" at={at(377.9)} />
      <Label text="FRENCH LOUISIANA" x={0.35} y={0.42} size={0.04} kind="box" at={at(378.4)} until={at(380.2)} pin />
      <Label text="SOLD!" x={0.35} y={0.5} size={0.08} kind="stamp" rotate={-6} at={at(379.1)} pin />
      <Label text="UNITED STATES" x={0.68} y={0.5} size={0.045} kind="box" at={at(380.9)} pin />
    </AbsoluteFill>
  );
};

// 382.00 "The Louisiana Purchase."
export const PurchaseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.24, 0.44, 1.45);
  const b = atHead(cam, 0.76, 0.44, 1.45);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: cam.y }} light={L} vignette={0.5}>
        <PalaceRoom floor={-560} throne={false}>
          <Character {...DIPLOMAT(0)} x={a.x} y={a.y} s={1.45} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: [1.3, 0.3], armB: [-0.2, 0.3] }} z={-12} />
          <Character {...OFFICER(1)} hat={null} x={b.x} y={b.y} s={1.45} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={{ armF: [1.3, 0.3], armB: [-0.2, 0.3] }} z={-12} />
          <Desk x={0} y={-560} w={700} z={-10} />
          <X x={0} y={-180} rot={0.05} z={-9.9}>
            <Doc w={340} />
          </X>
          <NationFlag kind="usa" x={-820} y={-560} w={200} pole={700} z={-25} />
          <NationFlag kind="france" x={820} y={-560} w={200} pole={700} z={-25} />
        </PalaceRoom>
      </Stage>
      <Label text="THE LOUISIANA PURCHASE" x={0.5} y={0.1} size={0.075} kind="title" at={at(382.1)} />
    </AbsoluteFill>
  );
};

// 383.71 "For $15 million, the US doubles in size."
export const DoublesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 385.4, 386.2);
  const bag = worldXY(-78, 30, NA.ppd, NA.center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1) }} light={L} vignette={0.45}>
        <WorldMap ppd={NA.ppd} center={NA.center} w={2400} h={1400} z={-20} />
        <WorldOverlay ring={US_1803} ppd={NA.ppd} center={NA.center} color="#3f8a5a" z={-19} />
        <LouisianaOverlay ppd={NA.ppd} center={NA.center} color="#3f8a5a" k={0.2 + k * 0.8} z={-18.9} />
        <X x={bag[0]} y={bag[1]} s={0.9 * pop(t, 383.9)} z={-10}>
          <MoneyBag />
        </X>
      </Stage>
      <Label text="$15 MILLION" x={0.7} y={0.85} size={0.06} kind="box" at={at(384.0)} pin />
      <Label text="×2" x={0.45} y={0.38} size={0.12} kind="stamp" at={at(385.8)} pin />
    </AbsoluteFill>
  );
};

// 387.02 "It's the biggest land deal in history."
export const BiggestDealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={L} vignette={0.45}>
        <WorldMap ppd={NA.ppd} center={NA.center} w={2400} h={1400} z={-20} />
        <WorldOverlay ring={US_1803} ppd={NA.ppd} center={NA.center} color="#3f8a5a" z={-19} />
        <LouisianaOverlay ppd={NA.ppd} center={NA.center} color="#e2b23c" z={-18.9} />
      </Stage>
      <Label text="BIGGEST LAND DEAL IN HISTORY" x={0.5} y={0.5} size={0.075} kind="stamp" rotate={-4} at={at(387.3)} pin />
    </AbsoluteFill>
  );
};

/** Crowd of guests along the nave sides. */
const Guests: React.FC<{ frame: number; y: number }> = ({ frame, y }) => (
  <>
    {[-1, 1].flatMap((k) =>
      [0, 1].map((i) => (
        <Character key={`${k}${i}`} {...(i ? OFFICER(i) : ROYALIST(k > 0 ? 3 : 1))} x={k * (620 + i * 240)} y={y - i * 30} s={0.95} facing={k > 0 ? -1 : 1} look={0.6} expression={{ eyes: "open", mouth: "o" }} pose={poses.idle(frame, i + (k > 0 ? 2 : 0))} z={-14 - i * 0.5} />
      )),
    )}
  </>
);

// 389.31 "In 1804, at age 35, he becomes emperor."
export const CoronationShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const walk = ramp(t, 389.2, 392.6, Easing.linear);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 20 }} light={L} vignette={0.55}>
        <GothicNave floor={-460}>
          <Guests frame={frame} y={-430} />
          <Character {...NAPOLEON_CROWNED} x={0} y={-640 + walk * 180} s={1.15 - walk * 0.2} facing={1} look={0.1} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.walk(frame, 0.4)} z={-10} />
        </GothicNave>
      </Stage>
      <Label text="1804" x={0.5} y={0.1} size={0.08} kind="title" at={at(389.5)} />
      <Label text="AGE 35" x={0.06} y={0.85} size={0.045} kind="box" at={at(391.0)} />
      <Label text="EMPEROR" x={0.94} y={0.85} size={0.06} kind="stamp" at={at(392.5)} />
    </AbsoluteFill>
  );
};

// 393.43 "At the ceremony in Paris, the pope is there."
export const PopeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, y: 60 };
  const p = atHead(cam, 0.5, 0.42, 1.6);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: cam.y }} light={L} vignette={0.55} bgBlur={3} bg={<GothicNave floor={-700} />}>
        <Character {...POPE} x={p.x} y={p.y} s={1.6} facing={1} look={0.2} expression={{ eyes: "happy", mouth: "smile" }} pose={{ armF: [1.2, 0.5], armB: [1.0, 0.7] }} z={-6} />
        <X x={p.x + 260} y={p.y + 300} z={-5.8}>
          <LaurelCrown r={110} />
        </X>
      </DepthStage>
      <Label text="NOTRE-DAME, PARIS" x={0.06} y={0.09} size={0.042} kind="box" at={at(394.3)} />
      <Label text="THE POPE" x={0.5} y={0.88} size={0.06} kind="box" at={at(395.1)} />
    </AbsoluteFill>
  );
};

// 396.15 "But when it's time for the crown, Napoleon picks it up and puts it on his own head."
export const SelfCrownShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1, y: 40 };
  const n = atHead(cam, 0.38, 0.48, 1.6);
  const p = atHead(cam, 0.8, 0.46, 1.35);
  const grab = ramp(t, 398.3, 398.8);
  const lift = ramp(t, 399.1, 399.7);
  const on = t > 400.0;
  const headY = n.y + 308 * 1.6;
  const crownStart: [number, number] = [p.x - 170, p.y + 300];
  const hands: [number, number] = [n.x + 30, headY + 220];
  const cx = on ? n.x : crownStart[0] + (hands[0] - crownStart[0]) * grab;
  const cy = on ? headY + 110 * 1.6 : crownStart[1] + (hands[1] - crownStart[1]) * grab + lift * 60;
  const up = grab > 0.5 && !on ? 1 : 0;
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: cam.y }} light={L} vignette={0.55} bgBlur={3} bg={<GothicNave floor={-700} />}>
        <Character {...NAPOLEON_CROWNED} hat={on ? "wreath" : null} hatColor="#e2b23c" x={n.x} y={n.y} s={1.6} facing={1} look={0.25} expression={{ eyes: on ? "happy" : "squint", mouth: on ? "grin" : "smirk", brows: -0.4 }} pose={up ? poses.armsUp(0) : on ? poses.handsOnHips : { armF: [1.0 + grab * 0.4, 0.6], armB: [-0.2, 0.3] }} z={-6} />
        <Character {...POPE} x={p.x} y={p.y} s={1.35} facing={-1} look={0.4} expression={{ eyes: grab > 0.3 ? "wide" : "happy", mouth: grab > 0.3 ? "o" : "smile", brows: grab > 0.3 ? 0.8 : 0 }} pose={{ armF: [1.2 - grab * 0.8, 0.5], armB: [1.0, 0.7] }} z={-6.5} />
        {!on ? (
          <X x={cx} y={cy} z={-5.5}>
            <LaurelCrown r={95} />
          </X>
        ) : null}
        {on ? <Glow rx={520} color="#ffe27a" alpha={0.4 * Math.max(0, 1 - (t - 400.0))} additive x={n.x} y={headY + 150} z={-5} /> : null}
      </DepthStage>
      <Label text="HIS OWN HEAD!" x={0.38} y={0.1} size={0.07} kind="stamp" rotate={-5} at={at(400.0)} pin />
    </AbsoluteFill>
  );
};

// 401.18 "Exactly one year later, on December 2, 1805, he wins his greatest battle."
export const AusterlitzDawnShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: 200 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} fog={0.45} sun={ramp(t, 401, 406)} dusk>
          <NationFlag kind="france" x={-700} y={-460} w={220} pole={620} z={-12} />
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...SOLDIER(i)} x={-500 + i * 240} y={-430 - (i % 2) * 40} s={0.9} facing={1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={shoulderPose(frame, i)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-10 - (i % 2) * 0.5} />
          ))}
        </BattlefieldSet>
      </Stage>
      <Label text="DECEMBER 2, 1805" x={0.5} y={0.1} size={0.08} kind="title" at={at(402.8)} />
      <Label text="HIS GREATEST BATTLE" x={0.5} y={0.88} size={0.05} kind="box" at={at(405.2)} />
    </AbsoluteFill>
  );
};

// 406.31 "Austerlitz."
export const AusterlitzTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0), y: 260 }} light={L} vignette={0.55}>
        <BattlefieldSet floor={-460} fog={0.9} sun={1} dusk />
        <Glow rx={900} color="#ffd98a" alpha={0.45} additive x={-1000} y={300} z={-5} />
      </Stage>
      <Label text="AUSTERLITZ" x={0.5} y={0.42} size={0.12} kind="title" at={at(406.3)} />
    </AbsoluteFill>
  );
};

/** Tactical diagram of Austerlitz: parchment field, Pratzen heights, unit blocks. */
const TacticalMap: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <Part shape={roundRect(4400, 3000, 0)} color="#e8dcb4" flat outline={0} z={-30} />
    <Part shape={blob([[-500, -200], [-300, 160], [100, 260], [500, 160], [640, -200], [100, -360]], 10)} color="#cdbb86" shade={0.15} z={-29} />
    <Line pts={[[-460, -160], [-260, 120], [100, 210], [460, 130], [580, -170]]} smooth width={5} color="#a8946a" z={-28.9} />
    <Line pts={[[-1400, -620], [-900, -500], [-200, -560], [600, -480], [1400, -600]]} smooth width={26} color="#7ab0d8" z={-28.8} />
    {children}
  </>
);

/** Unit block (division) with a little flag. */
const Unit: React.FC<{ x: number; y: number; color: string; s?: number; z?: number }> = ({ x, y, color, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(180, 90, 12)} color={color} shade={0.2} />
    <Line pts={[[-60, 0], [60, 0]]} width={6} color="#211b20" z={0.001} />
  </X>
);

// 407.59 "He's outnumbered by Russian and Austrian armies."
export const OutnumberedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const allied = [[-200, 140], [60, 200], [320, 160], [-60, 40], [200, 60], [460, 30], [-340, -40], [560, -100]];
  const french = [[-900, -100], [-1000, 120], [-760, -300], [-1100, -260]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.84) }} light={L} vignette={0.45}>
        <TacticalMap>
          {allied.map(([x, y], i) => (
            <Unit key={i} x={x} y={y} color={i % 2 ? "#2f6a4a" : "#f0ece2"} s={pop(t, 408.3 + i * 0.08)} z={-20} />
          ))}
          {french.map(([x, y], i) => (
            <Unit key={`f${i}`} x={x} y={y} color="#2c4486" s={pop(t, 407.7 + i * 0.08)} z={-20} />
          ))}
        </TacticalMap>
      </Stage>
      <Label text="FRANCE ~73,000" x={0.06} y={0.85} size={0.045} kind="box" at={at(407.8)} />
      <Label text="RUSSIA + AUSTRIA ~85,000" x={0.94} y={0.85} size={0.045} kind="box" at={at(408.9)} />
      <Label text="PRATZEN HEIGHTS" x={0.6} y={0.2} size={0.04} kind="ink" at={at(408.0)} pin />
    </AbsoluteFill>
  );
};

// 410.26 "So he pretends to be weak."
export const PretendShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.48, 2.0);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.6} bgBlur={3} bg={<BattlefieldSet floor={-700} fog={0.8} dusk />}>
        <Character {...NAPOLEON_GREY} x={a.x} y={a.y} s={2.0} facing={1} look={0.15} expression={{ eyes: "half", mouth: "smirk", brows: -0.6, gaze: [0.7, 0] }} pose={poses.handsOnHips} z={-6} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 412.24 "He lets the enemy attack his weaker side."
export const WeakSideShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 412.4, 414.2);
  const allied = [[-200, 140], [60, 200], [320, 160], [-60, 40], [200, 60], [460, 30], [-340, -40], [560, -100]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.84) }} light={L} vignette={0.45}>
        <TacticalMap>
          {allied.map(([x, y], i) => {
            const goes = i >= 4;
            return <Unit key={i} x={x - (goes ? k * 700 : 0)} y={y - (goes ? k * 520 : 0)} color={i % 2 ? "#2f6a4a" : "#f0ece2"} z={-20} />;
          })}
          {[[-900, -100], [-1000, 120], [-760, -300], [-1100, -260]].map(([x, y], i) => (
            <Unit key={`f${i}`} x={x} y={y} color="#2c4486" z={-20} />
          ))}
        </TacticalMap>
      </Stage>
      <Label text="WEAK SIDE" x={0.26} y={0.85} size={0.045} kind="box" at={at(413.5)} pin />
    </AbsoluteFill>
  );
};

// 414.64 "Then his troops charge out of the morning fog"
export const FogChargeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fog = 1 - ramp(t, 414.6, 416.4) * 0.6;
  const run = (t - 414.5) * 260;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 140 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} fog={fog} sun={1} dusk>
          {Array.from({ length: 6 }, (_, i) => (
            <Character key={i} {...SOLDIER(i + 1)} x={-1000 + run + i * 260} y={-380 - (i % 2) * 60} s={0.95} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "shout", brows: -0.6 }} pose={{ ...poses.run(frame + i * 4, i), armF: AIM }} holdF={<HeldMusket arm={AIM} dir={0.1} />} z={-10 - (i % 2) * 0.5} />
          ))}
          <NationFlag kind="france" x={-700 + run} y={-400} w={220} pole={620} z={-9.5} />
        </BattlefieldSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 416.67 "and cut the enemy army in two."
export const CutInTwoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 416.7, 417.6);
  const split = ramp(t, 417.4, 418.3);
  const allied = [[-200, 140], [60, 200], [320, 160], [-60, 40], [200, 60], [460, 30], [-340, -40], [560, -100]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.84), shake: hitAt(t, 417.5) * 6 }} light={L} vignette={0.45}>
        <TacticalMap>
          {allied.map(([x, y], i) => {
            const side = x < 120 ? -1 : 1;
            return <Unit key={i} x={x + side * split * 320} y={y - side * split * 120} color={i % 2 ? "#2f6a4a" : "#f0ece2"} z={-20} />;
          })}
          <X z={-19}>
            <Line pts={[[-1100, -60], [-1100 + 1300 * k, 140 * k]]} width={70} color="#211b20" />
            <Line pts={[[-1100, -60], [-1100 + 1300 * k, 140 * k]]} width={50} color="#2c4486" z={0.001} />
            {k > 0.05 ? (
              <X x={-1100 + 1300 * k} y={140 * k} rot={Math.atan2(200, 1300)} z={0.002}>
                <Part shape={poly([[-30, 70], [90, 0], [-30, -70]])} color="#2c4486" flat outline={6} />
              </X>
            ) : null}
          </X>
        </TacticalMap>
      </Stage>
    </AbsoluteFill>
  );
};

// 418.88 "Remember the rule?"
export const RuleMarchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.35), y: 120 }} light={L} vignette={0.5}>
        <StudySet floor={-600} map={false}>
          <RuleBoard x={0} y={120} s={1} z={-20} />
        </StudySet>
      </Stage>
      <Label text="BE FASTER" x={0.5} y={0.4} size={0.1} kind="hand" color="#ffe27a" at={at(418.9)} pin />
      <Label text="TO MARCH" x={0.5} y={0.55} size={0.07} kind="hand" color="#f2f2ea" at={at(419.1)} pin />
    </AbsoluteFill>
  );
};

// 419.99 "Some of his men marched about 110 kilometers in two days just to be there in time."
export const KilometersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const km = Math.round(keys(t, [[420.6, 0], [423.0, 110]]));
  const run = (t - 419.8) * 200;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.86), x: run * 0.95, y: 120 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.4} dusk={t > 422.5}>
          {Array.from({ length: 6 }, (_, i) => (
            <Character key={i} {...SOLDIER(i + 3)} x={-800 + run - i * 220} y={-430 - (i % 2) * 40} s={0.95} facing={1} look={0.5} expression={{ eyes: "squint", mouth: "teeth", sweat: true }} pose={{ ...poses.walk(frame * 1.6 + i * 6, 1.1), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.2} />} z={-10 - (i % 2) * 0.5} />
          ))}
        </BattlefieldSet>
      </Stage>
      <Label text={`${km} km`} x={0.5} y={0.1} size={0.1} kind="title" at={at(420.6)} />
      <Label text="IN 2 DAYS" x={0.5} y={0.86} size={0.06} kind="box" at={at(423.1)} />
    </AbsoluteFill>
  );
};

// 425.82 "But slowly, the rule turns against him."
export const RuleTurnsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.32), y: 120, shake: hitAt(t, 427.3) * 6 }} light={L} vignette={0.6 + ramp(t, 426, 428) * 0.2}>
        <StudySet floor={-600} map={false}>
          <RuleBoard x={0} y={120} s={1} crack={ramp(t, 427.2, 427.9)} z={-20} />
        </StudySet>
      </Stage>
      <Label text="BE FASTER" x={0.5} y={0.4} size={0.1} kind="hand" color="#ffe27a" at={at(425.8)} pin />
    </AbsoluteFill>
  );
};

// 428.65 "In 1808, he invades Spain and gets stuck"
export const SpainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const stuck = t > 431.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 120 }} light={L} vignette={0.5}>
        <SpainSet floor={-460}>
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...SOLDIER(i)} x={-700 + i * 300 + (stuck ? 0 : (t - 428.4) * 80)} y={-440 - (i % 2) * 40} s={0.95} facing={1} look={0.5} expression={{ eyes: stuck ? "wide" : "open", mouth: stuck ? "wavy" : "flat" }} pose={stuck ? shoulderPose(frame, i) : { ...poses.walk(frame + i * 5, 0.7), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-10 - (i % 2) * 0.5} />
          ))}
        </SpainSet>
      </Stage>
      <Label text="1808 · SPAIN" x={0.5} y={0.1} size={0.08} kind="title" at={at(428.8)} />
      <Label text="STUCK" x={0.94} y={0.85} size={0.06} kind="stamp" at={at(431.4)} />
    </AbsoluteFill>
  );
};

// 431.76 "fighting guerrillas who hit and run."
export const GuerrillaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const popUp = (i: number) => Math.max(0, Math.sin(Math.min(Math.PI, Math.max(0, (t - 431.8 - i * 0.25) * 2.4))));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 100, shake: hitAt(t, 432.7) * 6 }} light={L} vignette={0.5}>
        <SpainSet floor={-460}>
          {[0, 1, 2].map((i) => {
            const k = popUp(i);
            const x = [-1100, 0, 1100][i];
            return (
              <X key={i}>
                <Character {...GUERRILLA(i)} x={x} y={-640 + k * 300} s={1.05} facing={i === 2 ? -1 : 1} look={0.6} expression={{ eyes: "angry", mouth: "grin" }} pose={aimPose(frame)} holdF={<HeldMusket arm={AIM} dir={0.05} fire={k > 0.95 ? 0.4 : 0} />} z={-30 - i * 0.01} />
                <Part shape={blob([[-300, 0], [-240, 220], [-60, 320], [140, 260], [300, 0]], 8)} color="#b08a62" shade={0.28} x={x} y={-640} s={0.9} z={-29.9 - i * 0.01} />
              </X>
            );
          })}
        </SpainSet>
      </Stage>
      <Label text="GUERRILLAS" x={0.5} y={0.1} size={0.07} kind="title" at={at(432.1)} />
      <Label text="HIT" x={0.2} y={0.32} size={0.06} kind="stamp" at={at(432.7)} pin />
      <Label text="& RUN" x={0.8} y={0.32} size={0.06} kind="stamp" at={at(432.9)} pin />
    </AbsoluteFill>
  );
};

// 433.64 "You can't win fast against an enemy who won't stand and fight."
export const CantWinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.48, 1.9);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<SpainSet floor={-700} />}>
        <Character {...SOLDIER(2)} x={a.x} y={a.y} s={1.9} facing={1} look={0.1 + Math.sin(frame * 0.12) * 0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true }} pose={shoulderPose(frame, 2)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-6} />
        <QuestionMark x={-560} y={360} size={1.2 * pop(t, 434.3)} z={-5} />
        <QuestionMark x={600} y={300} size={1.0 * pop(t, 435.4)} z={-5} />
      </DepthStage>
    </AbsoluteFill>
  );
};

export const _e = { Sun, Smoke, GRENADIER, ellipse, circle, roundPoly, Line };
