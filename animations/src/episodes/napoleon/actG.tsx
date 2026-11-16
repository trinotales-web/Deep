import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, roundPoly, circle, ellipse, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import { EURO, NationFlag, Steed, Coach, ShipOfLine, Sloop, FieldGun, WorldMap, worldXY, Clock, Musket, Cloud, Sky, Sea, IslandRock, Candle } from "../../kit/env";
import { sec, pop } from "../../kit/shot";
import { AlpsRoad, IslandSea, ParisStreet, MudField, MapBack, RuleBoard, LongwoodRoom, StudySet, BattlefieldSet } from "./sets";
import { NAPOLEON, NAPOLEON_GREY, NAPOLEON_OLD, YOU, SOLDIER, OFFICER, GRENADIER, KING_OLD, WELLINGTON, REDCOAT, PRUSSIAN, DOCTOR } from "./cast";
import { atHead } from "../moon/frame";
import { HeldMusket, HeldSabre, SHOULDER_ARMS, AIM, aimPose, shoulderPose, SABRE_UP, TriggerHand, Pulse, eu, mapScr, keys } from "./util";
import { SoldierLine } from "./actA";

// Act G: the escape from Elba (1815), the regiment near Grenoble, the Hundred
// Days, Waterloo, Saint Helena and his death (1821).

const L = { dir: [-0.6, 0.7] as [number, number] };

// 498.64 "Ten months later, he escapes."
export const EscapeNightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.84), y: 160 }} light={L} vignette={0.65}>
        <IslandSea floor={-460} night kind="elba" islandX={-900} islandS={0.8}>
          <Sloop x={-300 + (t - 498.3) * 260} y={-140} s={0.75} seed={3} z={-20} />
          <X x={-260 + (t - 498.3) * 260} y={-50} z={-19.9}>
            <Character {...NAPOLEON_GREY} s={0.5} facing={1} look={0.6} expression={{ eyes: "squint", mouth: "smirk" }} pose={poses.idle(frame, 1)} shadow={false} />
          </X>
        </IslandSea>
      </Stage>
      <Label text="FEBRUARY 1815" x={0.5} y={0.1} size={0.07} kind="title" at={at(498.8)} />
      <Label text="ESCAPE!" x={0.94} y={0.85} size={0.06} kind="stamp" at={at(499.9)} />
    </AbsoluteFill>
  );
};

// 500.94 "He lands in France with about 1,000 men and heads for Paris."
export const LandingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const walk = (t - 500.8) * 120;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.83), y: 150 }} light={L} vignette={0.5}>
        <IslandSea floor={-460} kind="corsica" islandX={-5000}>
          <Sloop x={-1200} y={40} s={0.55} z={-40} />
          <Sloop x={-500} y={80} s={0.4} z={-41} />
          <Part shape={roundRect(7000, 900, 0)} color="#e9d8a8" flat outline={6} y={-760} z={-30} />
          <Character {...NAPOLEON_GREY} x={-200 + walk} y={-470} s={1.1} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "smirk" }} pose={poses.walk(frame, 0.7)} z={-10} />
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...GRENADIER(i)} x={-560 + walk - i * 260} y={-440 - (i % 2) * 40} s={1.0} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.walk(frame + i * 5, 0.7), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-11 - (i % 2) * 0.5} />
          ))}
        </IslandSea>
      </Stage>
      <Label text="~1,000 MEN" x={0.06} y={0.09} size={0.05} kind="box" at={at(502.3)} />
      <Label text="TO PARIS →" x={0.94} y={0.85} size={0.05} kind="box" at={at(503.5)} />
    </AbsoluteFill>
  );
};

// 504.74 "And near Grenoble, he meets that regiment."
export const RegimentShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 504.6, 507.3, Easing.linear);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), x: 60, y: 120 }} light={L} vignette={0.55}>
        <AlpsRoad floor={-460}>
          <SoldierLine n={5} x0={-760} dx={240} y={-500} s={0.95} z={-8} facing={1} />
          <Character {...NAPOLEON_GREY} x={1200 - k * 500} y={-300 + k * 40} s={0.6 + k * 0.25} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.walk(frame, 0.5)} z={-20} />
        </AlpsRoad>
      </Stage>
      <Label text="LAFFREY, NEAR GRENOBLE" x={0.06} y={0.09} size={0.045} kind="box" at={at(505.1)} />
    </AbsoluteFill>
  );
};

// 507.59 "Remember the soldier with his finger on the trigger?"
export const RememberSoldierShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.36, 0.48, 1.7);
  const arm: [number, number] = [AIM[0] + Math.sin(frame * 1.7) * 0.01, AIM[1]];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.1) }} light={L} vignette={0.7} bgBlur={3} bg={<AlpsRoad floor={-800} />}>
        <Character {...YOU} x={a.x} y={a.y} s={1.7} facing={1} look={0.6} expression={{ eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true, gaze: [0.8, 0] }} pose={{ ...aimPose(frame, 1), armF: arm }} holdF={<HeldMusket arm={arm} dir={0.02} />} z={-6} />
        <Pulse t={t} bpm={150} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 510.35 "The order to fire comes."
export const OrderFireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.6, 0.46, 1.9);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), shake: hitAt(t, 510.85) * 10 }} light={L} vignette={0.6} bgBlur={3} bg={<AlpsRoad floor={-800} />}>
        <Character {...OFFICER(1)} x={a.x} y={a.y} s={1.9} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ armF: SABRE_UP, armB: [-0.3, 0.4], handF: "fist" }} holdF={<HeldSabre arm={SABRE_UP} dir={Math.PI / 2 + 0.3} />} talking z={-4} />
      </DepthStage>
      <Label text="FIRE!" x={0.27} y={0.38} size={0.12} kind="stamp" rotate={-8} at={at(510.85)} pin />
    </AbsoluteFill>
  );
};

// 512.32 "Nobody fires."
export const NobodyFiresShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.96), x: -100, y: 100 }} light={L} vignette={0.6}>
        <AlpsRoad floor={-460}>
          <SoldierLine n={4} x0={-900} dx={300} y={-460} s={1.1} z={-8} aim={1 - ramp(t, 512.9, 513.5) * 0.4} />
          <Character {...NAPOLEON_GREY} outfit={{ ...NAPOLEON_GREY.outfit, shirt: "#2c4486", buttons: null }} x={760} y={-470} s={1.2} facing={-1} look={0.4} expression={{ eyes: "open", mouth: "flat" }} pose={{ armF: [1.1, 0.25], armB: [-1.1, -0.25] }} z={-9} />
        </AlpsRoad>
      </Stage>
      <Label text="NOBODY FIRES" x={0.5} y={0.1} size={0.08} kind="title" at={at(512.4)} />
    </AbsoluteFill>
  );
};

// 513.87 "Instead, the soldiers shout, 'Long live the Emperor!'"
export const VivaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cheer = t > 514.6 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 100 }} light={L} vignette={0.5}>
        <AlpsRoad floor={-460}>
          <SoldierLine n={5} x0={-1000} dx={300} y={-460} s={1.05} z={-8} cheer={cheer} lower={1 - cheer} />
          <Character {...NAPOLEON_GREY} x={760} y={-470} s={1.15} facing={-1} look={0.4} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={-9} />
        </AlpsRoad>
      </Stage>
      <Label text="“VIVE L'EMPEREUR!”" x={0.5} y={0.1} size={0.075} kind="title" at={at(515.1)} sub="LONG LIVE THE EMPEROR!" />
    </AbsoluteFill>
  );
};

// 517.15 "and join him."
export const JoinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const walk = (t - 517.0) * 200;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.88), x: walk * 0.8, y: 100 }} light={L} vignette={0.5}>
        <AlpsRoad floor={-460} road={false}>
          <Character {...NAPOLEON_GREY} x={300 + walk} y={-470} s={1.05} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.walk(frame, 0.8)} z={-9} />
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...SOLDIER(i + 1)} x={-100 + walk - i * 250} y={-450 - (i % 2) * 40} s={1.0} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.walk(frame + i * 5, 0.8), armF: SHOULDER_ARMS }} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-10 - (i % 2) * 0.5} />
          ))}
        </AlpsRoad>
      </Stage>
    </AbsoluteFill>
  );
};

// 518.21 "Within weeks, he's back in Paris, and the king has fled."
export const KingFledShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const flee = (t - 518.0) * 170;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.75, 0.8), y: 200 }} light={L} vignette={0.5}>
        <ParisStreet floor={-460} palace>
          <Coach x={-150 - flee} y={-480} s={0.85} walk={1.5} color="#2a3a6a" sx={-1} z={-12}>
            <X y={-60} x={20} s={1}>
              <Character {...KING_OLD} s={0.35} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", sweat: true }} pose={poses.scared(frame)} shadow={false} />
            </X>
          </Coach>
          <Steed x={800} y={-480} s={0.85} cloth="#2c4486" z={-10}>
            <Character {...NAPOLEON} s={0.62} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.sit(frame), armF: [2.2, 0.3] }} />
          </Steed>
        </ParisStreet>
      </Stage>
      <Label text="BACK IN PARIS" x={0.94} y={0.85} size={0.05} kind="box" at={at(519.7)} />
      <Label text="THE KING FLEES" x={0.06} y={0.85} size={0.05} kind="box" at={at(520.6)} />
    </AbsoluteFill>
  );
};

// 522.23 "But it doesn't last."
export const DoesntLastShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const flash = hitAt(t, 522.75, 0.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 260 }} light={L} vignette={0.65}>
        <Sky w={6000} h={4000} y={800} top="#2a2a3a" bottom="#6a6a7a" z={-60} />
        {[-1200, -200, 900].map((x, i) => (
          <Cloud key={i} w={1300} x={x + frame * (0.6 + i * 0.2)} y={900 + (i % 2) * 120} seed={i + 3} color="#5a5a6a" shadow="#3a3a48" z={-58} />
        ))}
        <Part shape={roundRect(6000, 3000, 0)} color="#ffffff" flat outline={0} opacity={0.5 * flash} z={-57} />
        <ParisStreet floor={-460} palace night />
      </Stage>
    </AbsoluteFill>
  );
};

// 523.57 "On June 18, 1815, near a Belgian village called Waterloo,"
export const WaterlooMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const w = eu(EURO.waterloo);
  const zoom = keys(t, [[523.4, 1.1], [527.6, 2.6]]);
  const cam = { zoom, x: w[0], y: w[1] };
  const sw = mapScr(w, cam);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack tint={{ Belgium: "#e2b23c", France: "#3b62b8" }} tintK={0.55} pins={[{ at: EURO.waterloo, s: pop(t, 526.9) }, { at: EURO.paris, dot: true }]} />
      </Stage>
      <Label text="JUNE 18, 1815" x={0.5} y={0.1} size={0.08} kind="title" at={at(523.8)} />
      <Label text="WATERLOO" x={sw.x + 0.09} y={sw.y + 0.02} size={0.06} kind="box" at={at(527.1)} pin />
    </AbsoluteFill>
  );
};

// 527.93 "he faces a British army under the Duke of Wellington."
export const WellingtonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.32, 0.42, 1.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: cam.y }} light={L} vignette={0.55}>
        <MudField floor={-560} rain={0}>
          {Array.from({ length: 6 }, (_, i) => (
            <Character key={i} {...REDCOAT(i)} x={160 + (i % 3) * 230} y={-330 + Math.floor(i / 3) * 70} s={0.8} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={shoulderPose(frame, i)} holdF={<HeldMusket arm={SHOULDER_ARMS} dir={Math.PI / 2 - 0.12} />} z={-20 - Math.floor(i / 3) * 0.5 - i * 0.01} />
          ))}
          <NationFlag kind="uk" x={900} y={-330} w={200} pole={560} z={-19} />
          <Steed x={a.x} y={-560} s={1.0} color="#6a4a30" cloth="#2a2e3a" z={-10}>
            <Character {...WELLINGTON} s={0.62} facing={1} look={0.4} expression={{ eyes: "squint", mouth: "flat", brows: -0.5 }} pose={poses.sit(frame)} />
          </Steed>
        </MudField>
      </Stage>
      <Label text="DUKE OF WELLINGTON" x={0.06} y={0.09} size={0.045} kind="box" at={at(529.5)} />
    </AbsoluteFill>
  );
};

// 530.78 "And a Prussian army is on its way to help them."
export const PrussiansComingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const w = eu(EURO.waterloo);
  const cam = { zoom: 3.2, x: w[0] + 60, y: w[1] };
  const wavre: [number, number] = [4.6, 50.72];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.04), x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack tint={{ Belgium: "#e2b23c", France: "#3b62b8" }} tintK={0.55} routes={[{ pts: [[5.4, 50.7], [5.0, 50.72], wavre, [4.45, 50.69]], k: ramp(t, 530.9, 532.5), width: 10, color: "#211b20" }]} pins={[{ at: EURO.waterloo }]} />
      </Stage>
      <Label text="PRUSSIANS" x={0.8} y={0.36} size={0.05} kind="box" at={at(531.0)} pin />
    </AbsoluteFill>
  );
};

// 533.14 "It rained all night, and the ground is mud."
export const RainMudShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 60 }} light={L} vignette={0.6}>
        <MudField floor={-460} rain={1}>
          <FieldGun x={-120} y={-520} s={1.1} rot={0.08} z={-12} />
          <Part shape={ellipse(240, 40)} color="#4a3a2a" flat outline={4} x={-120} y={-520} z={-11.9} />
          {[0, 1].map((i) => (
            <Character key={i} {...SOLDIER(i + 3)} x={480 + i * 300} y={-480} s={1.1} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "frown", sweat: true }} pose={{ armF: [1.3, 0.4], armB: [1.1, 0.6], lean: 0.25 }} z={-11 - i * 0.01} />
          ))}
        </MudField>
      </Stage>
      <Label text="MUD" x={0.94} y={0.09} size={0.07} kind="stamp" at={at(535.2)} />
    </AbsoluteFill>
  );
};

/** Pocket watch held up. */
const PocketWatch: React.FC<{ s?: number; spin?: number }> = ({ s = 1, spin = 0 }) => (
  <X s={s}>
    <Part shape={circle(60)} color="#e2b23c" shade={0.25} />
    <Part shape={circle(48)} color="#f6f2ea" flat outline={4} z={0.001} />
    <Line pts={[[0, 0], [Math.sin(spin) * 34, Math.cos(spin) * 34]]} width={5} z={0.002} />
    <Line pts={[[0, 0], [Math.sin(spin / 12) * 22, Math.cos(spin / 12) * 22]]} width={6} z={0.002} />
    <Part shape={circle(10)} color="#e2b23c" flat outline={3} y={66} z={-0.001} />
  </X>
);

// 535.91 "Napoleon waits for it to dry before he attacks."
export const WaitsDryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.4, 0.46, 1.9);
  const arm: [number, number] = [1.15, 1.0];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.6} bgBlur={3} bg={<MudField floor={-700} rain={0.3} />}>
        <Character {...NAPOLEON_GREY} x={a.x} y={a.y} s={1.9} facing={1} look={0.5} expression={{ eyes: "half", mouth: "flat", gaze: [0.6, -0.4], eyebags: true }} pose={{ armF: arm, armB: [-0.2, 0.3] }} holdF={<X x={10} y={-20}><PocketWatch s={0.7} spin={frame * 0.3} /></X>} z={-6} />
      </DepthStage>
      <Label text="WAITING FOR THE GROUND TO DRY" x={0.5} y={0.88} size={0.045} kind="box" at={at(536.9)} />
    </AbsoluteFill>
  );
};

// 538.76 "Hours pass."
export const HoursPassShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#3a3a4a" flat outline={0} z={-30} />
        <Clock s={2.4} speed={60} z={-10} />
      </Stage>
      <Label text="HOURS PASS" x={0.5} y={0.88} size={0.06} kind="box" at={at(538.8)} />
    </AbsoluteFill>
  );
};

// 540.16 "Remember the rule?"
export const RuleSlowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.35), y: 120 }} light={L} vignette={0.55}>
        <StudySet floor={-600} map={false}>
          <RuleBoard x={0} y={120} s={1} crack={1} z={-20} />
        </StudySet>
      </Stage>
      <Label text="BE FASTER" x={0.5} y={0.4} size={0.1} kind="hand" color="#ffe27a" at={at(540.2)} pin />
    </AbsoluteFill>
  );
};

/** Snail wearing a bicorne. */
const Snail: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => {
  const frame = useCurrentFrame();
  const stretch = 1 + Math.sin(frame * 0.15) * 0.05;
  return (
    <X x={x} y={y} s={s} z={z}>
      <X sx={stretch}>
        <Part shape={blob([[-260, 0], [200, 0], [300, 40], [320, 160], [260, 200], [220, 70], [-200, 40]], 10)} color="#c9b07a" shade={0.24} />
      </X>
      <X x={-40} y={170} z={0.01}>
        <Part shape={circle(170)} color="#b86a3a" shade={0.26} />
        <Line pts={Array.from({ length: 30 }, (_, i) => { const a = i * 0.45; const r = 140 - i * 4.4; return [Math.cos(a) * r, Math.sin(a) * r] as [number, number]; })} smooth width={8} color="#8a4a2a" z={0.001} />
      </X>
      <X x={290} y={200} z={0.02}>
        <Part shape={circle(16)} color="#ffffff" flat outline={4} />
        <Part shape={circle(7)} color="#211b20" flat outline={0} x={4} z={0.001} />
        <X y={40} s={0.55}>
          <Part shape={blob([[-178, -6], [-130, 24], [-70, 84], [0, 112], [70, 84], [130, 24], [178, -6], [110, 6], [0, 14], [-110, 6]], 8)} color="#211d24" shade={0.22} />
        </X>
      </X>
    </X>
  );
};

// 541.34 "This time, he's slow."
export const SlowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40 }} light={L} vignette={0.55}>
        <MudField floor={-460} rain={0.4}>
          <Snail x={-200 + frame * 0.6} y={-420} s={1.2} z={-10} />
        </MudField>
      </Stage>
      <Label text="SLOW" x={0.5} y={0.1} size={0.1} kind="stamp" rotate={-5} at={at(542.3)} />
    </AbsoluteFill>
  );
};

// 543.33 "And those hours let the Prussians arrive."
export const PrussiansArriveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const rise = ramp(t, 543.3, 544.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 140 }} light={L} vignette={0.55}>
        <MudField floor={-460} rain={0} dusk>
          {Array.from({ length: 6 }, (_, i) => (
            <Character key={i} {...PRUSSIAN(i)} x={-1000 + i * 340 + rise * 200} y={-80 - (i % 2) * 40 - (1 - rise) * 300} s={0.9} facing={1} look={0.5} expression={{ eyes: "angry", mouth: "shout" }} pose={{ ...poses.run(frame + i * 4, i), armF: AIM }} holdF={<HeldMusket arm={AIM} dir={0.1} />} z={-30 - (i % 2) * 0.5} />
          ))}
          <NationFlag kind="prussia" x={-700 + rise * 200} y={-100 - (1 - rise) * 300} w={200} pole={560} z={-29} />
        </MudField>
      </Stage>
      <Label text="THE PRUSSIANS ARRIVE" x={0.5} y={0.88} size={0.055} kind="box" at={at(544.3)} />
    </AbsoluteFill>
  );
};

// 545.45 "By evening, his army is broken."
export const BrokenShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const run = (t - 545.3) * 220;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 140 }} light={L} vignette={0.6}>
        <MudField floor={-460} rain={0} dusk>
          {Array.from({ length: 5 }, (_, i) => (
            <Character key={i} {...(i % 2 ? GRENADIER(i) : SOLDIER(i))} x={600 - run - i * 280} y={-440 - (i % 2) * 40} s={0.95} facing={-1} look={0.7} expression={{ eyes: "wide", mouth: "o", sweat: true, brows: 0.9 }} pose={poses.run(frame + i * 6, i)} z={-10 - (i % 2) * 0.5} />
          ))}
          <X x={200} y={-520} rot={1.3} z={-12}>
            <NationFlag kind="france" w={180} pole={400} wave={0} />
          </X>
        </MudField>
      </Stage>
      <Label text="BROKEN" x={0.5} y={0.1} size={0.09} kind="stamp" rotate={-4} at={at(547.4)} />
    </AbsoluteFill>
  );
};

// 548.49 "Wellington later calls it 'the nearest run thing you ever saw in your life.'"
export const NearestRunShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.3, 0.48, 1.9);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<MudField floor={-700} rain={0} dusk />}>
        <Character {...WELLINGTON} x={a.x} y={a.y} s={1.9} facing={1} look={0.4} expression={{ eyes: "half", mouth: "open", brows: 0.3, eyebags: true }} pose={poses.talk(frame, 3)} talking z={-6} />
      </DepthStage>
      <Label text="“THE NEAREST RUN THING" x={0.68} y={0.36} size={0.055} kind="box" at={at(549.9)} pin />
      <Label text="YOU EVER SAW IN YOUR LIFE.”" x={0.68} y={0.46} size={0.055} kind="box" at={at(551.3)} pin />
    </AbsoluteFill>
  );
};

// 553.76 "This time, the British take no chances."
export const NoChancesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: 260 }} light={L} vignette={0.5}>
        <IslandSea floor={-460} islandX={-5000}>
          <ShipOfLine navy="uk" x={-300 + (t - 553.4) * 120} y={-60} s={0.6} z={-20} />
        </IslandSea>
      </Stage>
      <Label text="HMS NORTHUMBERLAND" x={0.06} y={0.85} size={0.042} kind="box" at={at(554.0)} />
      <Label text="NO CHANCES" x={0.94} y={0.09} size={0.06} kind="stamp" at={at(555.2)} />
    </AbsoluteFill>
  );
};

// 556.32 "They send him to Saint Helena, a tiny island in the middle of the South Atlantic."
export const HelenaMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 6;
  const center: [number, number] = [0, 10];
  const helena: [number, number] = [-5.71, -15.96];
  const h = worldXY(helena[0], helena[1], ppd, center);
  const zoom = keys(t, [[556.2, 0.9], [560.4, 1.5]]);
  const cam = { zoom, x: h[0] * (zoom - 0.9) / 0.6, y: h[1] * (zoom - 0.9) / 0.6 };
  const sh = mapScr(h, cam);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <WorldMap ppd={ppd} center={center} w={3000} h={2000} pins={[{ at: helena, s: pop(t, 557.3), color: "#d8322f" }]} routes={[{ from: [-1.5, 50.5], to: helena, k: ramp(t, 556.4, 558.2), arc: 0.08, color: "#d8322f", width: 8 }]} z={-20} />
      </Stage>
      <Label text="SAINT HELENA" x={sh.x + 0.1} y={sh.y - 0.04} size={0.05} kind="box" at={at(557.4)} pin />
      <Label text="SOUTH ATLANTIC" x={0.06} y={0.85} size={0.045} kind="box" at={at(559.6)} />
    </AbsoluteFill>
  );
};

// 560.87 "He dies there on May 5, 1821."
export const DeathShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const dim = ramp(t, 562.0, 563.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), x: 260, y: 40 }} light={L} vignette={0.6 + dim * 0.15}>
        <LongwoodRoom floor={-560}>
          <X x={440} y={-60} rot={Math.PI / 2 - 0.05} z={-25}>
            <Character {...NAPOLEON_OLD} x={0} y={0} s={0.9} facing={1} look={0.1} expression={{ eyes: dim > 0.5 ? "closed" : "half", mouth: "flat", brows: 0.5, eyebags: true }} pose={{ armF: [0.1, 0.3], armB: [-0.1, -0.2] }} shadow={false} />
          </X>
          <Part shape={roundRect(520, 130, 40)} color="#d8d2c4" shade={0.2} x={540} y={-80} z={-24} />
          <Candle x={-160} y={-300} s={1.4} out={dim} z={-20} />
        </LongwoodRoom>
      </Stage>
      <Label text="MAY 5, 1821" x={0.5} y={0.1} size={0.08} kind="title" at={at(561.9)} />
    </AbsoluteFill>
  );
};

// 564.41 "He's 51."
export const FiftyOneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={L} vignette={0.6}>
        <IslandSea floor={-460} kind="helena" islandX={-5000}>
          <Part shape={roundRect(6000, 900, 0)} color="#6a8a4a" flat outline={6} y={-800} z={-30} />
          <X y={-460} z={-10}>
            <Part shape={roundRect(520, 140, 10)} color="#c9c4bc" shade={0.2} y={60} />
            <Part shape={roundPoly([[-180, 120], [180, 120], [180, 560], [0, 660], [-180, 560]], 30)} color="#d8d2c8" shade={0.22} z={0.001} />
          </X>
        </IslandSea>
      </Stage>
      <Label text="1769 – 1821" x={0.5} y={0.42} size={0.06} kind="ink" at={at(564.2)} pin />
      <Label text="AGE 51" x={0.5} y={0.1} size={0.08} kind="title" at={at(564.6)} />
    </AbsoluteFill>
  );
};

export const _g = { Musket, Sea, Sky, IslandRock, Glow, TriggerHand, DOCTOR, BattlefieldSet, NAPOLEON, OFFICER, Coach };
