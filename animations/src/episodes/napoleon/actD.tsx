import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, roundPoly, circle, ellipse, blob, poly, push, hitAt, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  EURO, NationFlag, FieldGun, Steed, ShipOfLine, Sloop, RosettaStone, Painting, Book, Doc, Desk, Lectern, BalanceScale, WorldMap, worldXY, Sky, Sea, Smoke, Fireball, LaurelCrown, Coach,
} from "../../kit/env";
import { sec, pop } from "../../kit/shot";
import { DesertSet, IslandSea, AlpsSnow, StudySet, GallerySet, CouncilHall, MapBack, RuleBoard, PalaceRoom } from "./sets";
import { NAPOLEON, NAPOLEON_GREY, SOLDIER, OFFICER, SAVANT, MAMLUK, NELSON, REDCOAT, DEPUTY, GRENADIER, CORSICAN, ROYALIST, CARTOONIST, LETIZIA, CARLO } from "./cast";
import { atHead } from "../moon/frame";
import { HeldMusket, HeldSabre, SHOULDER_ARMS, AIM, aimPose, shoulderPose, SABRE_UP, eu, mapScr, keys } from "./util";
import { PaintingPicture } from "./actA";

// Act D: Egypt (1798–99), the Battle of the Nile, the Rosetta Stone, the
// coup of November 1799, the Alps (1800) and David's painting, the Code.

const L = { dir: [-0.6, 0.7] as [number, number] };

/** Quarterdeck of a British ship: planks, rail, mast, rigging, sea behind. */
const ShipDeck: React.FC<{ floor?: number; children?: React.ReactNode; dusk?: boolean }> = ({ floor = -420, children, dusk = false }) => {
  const frame = useCurrentFrame();
  const roll = Math.sin(frame * 0.04) * 0.012;
  return (
    <>
      <Sky w={6000} h={4000} y={floor + 1200} top={dusk ? "#3a3a6a" : "#7ab0d8"} bottom={dusk ? "#f29a6a" : "#f2f0e6"} z={-60} />
      <Sea w={6000} h={900} y={floor + 120} color={dusk ? "#2f4a7a" : "#2f7ab0"} z={-55} />
      <X rot={roll} z={-40}>
        <Part shape={roundRect(6000, 1400, 0)} color="#a8763e" flat outline={0} y={floor - 600} />
        {Array.from({ length: 14 }, (_, i) => (
          <Line key={i} pts={[[-3000, floor - 40 - i * 80], [3000, floor - 40 - i * 80]]} width={4} color="#8a5a2e" z={0.001} />
        ))}
        <Part shape={roundRect(6000, 70, 8)} color="#6a4424" shade={0.2} y={floor + 200} z={0.002} />
        {Array.from({ length: 16 }, (_, i) => (
          <Part key={`b${i}`} shape={roundRect(22, 200, 6)} color="#6a4424" shade={0.2} x={-2800 + i * 380} y={floor + 100} z={0.0015} />
        ))}
        <Part shape={roundRect(70, 2400, 10)} color="#6a4a30" shade={0.2} x={760} y={floor + 1100} z={0.003} />
        <Line pts={[[760, floor + 1600], [-1400, floor + 200]]} width={5} color="#3a2a22" z={0.0025} />
        <Line pts={[[760, floor + 1600], [2400, floor + 200]]} width={5} color="#3a2a22" z={0.0025} />
      </X>
      {children}
    </>
  );
};

/** Shovel held upright. */
const Shovel: React.FC<{ rot?: number; s?: number }> = ({ rot = 0, s = 1 }) => (
  <X rot={rot} s={s}>
    <Part shape={roundRect(16, 380, 6)} color="#8a5a32" shade={0.2} y={-120} />
    <Part shape={roundPoly([[-44, -300], [44, -300], [40, -400], [0, -430], [-40, -400]], 10)} color="#9aa0aa" shade={0.25} z={0.001} />
  </X>
);

// 263.27 "Then, in 1798, he sails to Egypt with tens of thousands of soldiers."
export const EgyptFleetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sail = (t - 263) * 60;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), x: 200, y: 260 }} light={L} vignette={0.45}>
        <IslandSea floor={-460} islandX={-4000}>
          {[0, 1, 2, 3].map((i) => (
            <ShipOfLine key={i} navy="fr" x={-1400 + i * 900 + sail} y={-60 - (i % 2) * 120} s={0.42 - (i % 2) * 0.06} seed={i * 2} z={-20 + (i % 2) * -2} />
          ))}
        </IslandSea>
      </Stage>
      <Label text="1798" x={0.5} y={0.1} size={0.08} kind="title" at={at(264.1)} />
      <Label text="TO EGYPT" x={0.94} y={0.85} size={0.05} kind="box" at={at(266.0)} />
      <Label text="TENS OF THOUSANDS OF SOLDIERS" x={0.06} y={0.85} size={0.042} kind="box" at={at(267.0)} />
    </AbsoluteFill>
  );
};

// 268.78 "The plan?"
export const PlanShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.4, 0.46, 2.0);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.55} bgBlur={3} bg={<StudySet floor={-700} />}>
        <Character {...NAPOLEON} x={a.x} y={a.y} s={2.0} facing={1} look={0.4} expression={{ eyes: "squint", mouth: "smirk", brows: -0.4 }} pose={{ armF: [2.0, 0.6], armB: [-0.2, 0.4], handF: "point" }} z={-6} />
      </DepthStage>
      <Label text="THE PLAN?" x={0.72} y={0.2} size={0.07} kind="box" at={at(268.8)} pin />
    </AbsoluteFill>
  );
};

// 269.75 "Hurt Britain by threatening its route to India."
export const IndiaRouteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 7;
  const center: [number, number] = [35, 32];
  const lon = [-0.13, 51.5] as [number, number];
  const alex = EURO.alexandria;
  const bombay: [number, number] = [72.88, 19.08];
  const toulon = EURO.toulon;
  const sE = worldXY(alex[0], alex[1], ppd, center);
  const cam = { zoom: 1.0, x: 0, y: 0 };
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.45}>
        <WorldMap ppd={ppd} center={center} w={2400} h={1400} tint={{ "United Kingdom": "#d8463a", India: "#e2b23c", Egypt: "#f2c890", France: "#3b62b8" }} tintK={0.75} z={-20}
          routes={[
            { from: lon, to: alex, k: ramp(t, 269.8, 270.6), color: "#d8463a", arc: 0.1, width: 10 },
            { from: alex, to: bombay, k: ramp(t, 270.4, 271.3), color: "#d8463a", arc: 0.12, width: 10 },
            { from: toulon, to: alex, k: ramp(t, 270.6, 271.4), color: "#2c4486", arc: -0.1, width: 14 },
          ]}
          pins={[{ at: alex, s: pop(t, 271.2), color: "#2c4486" }]}
        />
      </Stage>
      <Label text="BRITAIN" x={0.2} y={0.2} size={0.04} kind="box" at={at(270.0)} pin />
      <Label text="INDIA" x={0.83} y={0.62} size={0.04} kind="box" at={at(271.2)} pin />
      <Label text="EGYPT" x={mapScr(sE, cam).x} y={mapScr(sE, cam).y + 0.08} size={0.04} kind="box" at={at(271.3)} pin />
    </AbsoluteFill>
  );
};

// 272.05 "He also brings more than 150 scientists."
export const SavantsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 80 }} light={L} vignette={0.5}>
        <DesertSet floor={-460}>
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...SAVANT(i)} x={-840 + i * 520} y={-460 - (i % 2) * 30} s={1.15} facing={1} look={0.6} expression={{ eyes: "happy", mouth: i % 2 ? "o" : "smile", gaze: [0.5, 0.5] }} pose={i === 1 ? poses.point(frame) : { armF: [0.9, 1.0], armB: [-0.2, 0.3] }} holdF={i === 1 ? undefined : <X rot={-1.4} s={0.32}><Book cover={["#6a3a2a", "#2c4486", "#3f6a3a", "#8a6a2a"][i]} /></X>} z={-10 - i * 0.01} />
          ))}
        </DesertSet>
      </Stage>
      <Label text="150+ SCIENTISTS" x={0.5} y={0.1} size={0.08} kind="title" at={at(273.2)} />
    </AbsoluteFill>
  );
};

// 275.16 "Near the pyramids, he crushes the army that rules Egypt."
export const PyramidsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const charge = 260 * Math.min(t - 275, 1.9) - Math.max(0, t - 276.9) * 220;
  const volley = Math.max(0, Math.min(1, (t - 276.3) / 0.8));
  const broken = t > 276.9;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.77), y: 200, shake: hitAt(t, 276.35) * 10 }} light={L} vignette={0.5}>
        <DesertSet floor={-460}>
          {[0, 1, 2].map((i) => (
            <Steed key={i} x={1400 - charge + i * 300} y={-380 - (i % 2) * 60} s={0.75} walk={broken ? -1.4 : 1.6} rear={broken && i === 1 ? 0.6 : 0} color={["#8a5a3a", "#f2efe9", "#5a3a26"][i]} cloth={["#c8462f", "#2f8a6a", "#d8a93a"][i]} z={-20 - (i % 2) * 0.5}>
              <Character {...MAMLUK(i)} s={0.62} facing={-1} look={0.6} expression={{ eyes: broken ? "wide" : "angry", mouth: broken ? "o" : "shout" }} pose={{ ...poses.sit(frame), armF: SABRE_UP }} holdF={<HeldSabre arm={SABRE_UP} dir={Math.PI / 2 + 0.4} />} />
            </Steed>
          ))}
          {[0, 1, 2, 3].map((i) => (
            <Character key={`s${i}`} {...SOLDIER(i + 1)} x={-900 + (i % 2) * 180} y={-420 - (i >> 1) * 110} s={0.95} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "flat" }} pose={aimPose(frame)} holdF={<HeldMusket arm={AIM} dir={0.03} fire={volley} />} z={-12 - (i >> 1) * 0.5} />
          ))}
        </DesertSet>
      </Stage>
      <Label text="BATTLE OF THE PYRAMIDS" x={0.06} y={0.09} size={0.045} kind="box" at={at(275.4)} />
      <Label text="MAMLUKS" x={0.86} y={0.85} size={0.045} kind="box" at={at(276.9)} pin />
    </AbsoluteFill>
  );
};

// 278.39 "But days later, the British admiral Horatio Nelson"
export const NelsonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.36, 0.44, 1.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.5}>
        <ShipDeck floor={-700}>
          <Character {...NELSON} x={a.x} y={a.y} s={1.8} facing={1} look={0.55} expression={{ eyes: "squint", mouth: "smirk", brows: -0.5 }} pose={poses.point(frame)} z={-10} />
          <NationFlag kind="uk" x={-900} y={-300} w={260} pole={700} z={-30} />
        </ShipDeck>
      </Stage>
      <Label text="ADMIRAL HORATIO NELSON" x={0.94} y={0.85} size={0.045} kind="box" at={at(280.3)} />
    </AbsoluteFill>
  );
};

// 281.68 "finds the French fleet and destroys it."
export const NileShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const fire = ramp(t, 281.7, 282.9, Easing.linear);
  const boom = ramp(t, 282.9, 284.0, Easing.linear);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), x: 0, y: 220, shake: hitAt(t, 282.95, 0.8) * 18 }} light={L} vignette={0.55}>
        <IslandSea floor={-460} night islandX={-5000}>
          <ShipOfLine navy="uk" x={-900} y={-80} s={0.5} fire={fire > 0 && fire < 1 ? fire : 0} seed={1} z={-20} />
          <ShipOfLine navy="fr" x={700} y={-40} s={0.5} sx={-1} burn={ramp(t, 282.0, 282.9)} explode={boom > 0 ? boom : 0} seed={4} z={-21} />
          <ShipOfLine navy="fr" x={1500} y={-160} s={0.34} sx={-1} burn={0.4} seed={6} z={-25} />
        </IslandSea>
      </Stage>
      <Label text="BATTLE OF THE NILE · 1798" x={0.06} y={0.09} size={0.045} kind="box" at={at(281.8)} />
    </AbsoluteFill>
  );
};

// 284.14 "Remember the rule?"
export const RuleShipsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.35), y: 120 }} light={L} vignette={0.5}>
        <StudySet floor={-600} map={false}>
          <RuleBoard x={0} y={120} s={1} z={-20} />
        </StudySet>
      </Stage>
      <Label text="BE FASTER" x={0.5} y={0.4} size={0.1} kind="hand" color="#ffe27a" at={at(284.1)} pin />
    </AbsoluteFill>
  );
};

// 285.31 "Without ships, Napoleon can't move."
export const NoShipsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 100 }} light={L} vignette={0.55}>
        <IslandSea floor={-460} islandX={-5000}>
          <Smoke x={300} y={300} w={1200} h={1100} alpha={0.45} color="#5a5258" seed={2} z={-40} />
          <ShipOfLine navy="fr" x={300} y={-80} s={0.4} sail={0} burn={0.9} list={0.2} sink={0.15} seed={3} z={-42} />
          <Part shape={roundRect(6000, 800, 0)} color="#e9cc8a" flat outline={6} y={-700} z={-30} />
          <Character {...NAPOLEON} x={-600} y={-500} s={1.2} facing={1} look={0.7} expression={{ eyes: "wide", mouth: "o", brows: 0.7 }} pose={poses.idle(frame, 2)} z={-10} />
        </IslandSea>
      </Stage>
      <Label text="NO SHIPS" x={0.94} y={0.09} size={0.06} kind="stamp" rotate={-5} at={at(285.7)} />
    </AbsoluteFill>
  );
};

// 287.83 "He's trapped."
export const TrappedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.5, 2.1);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.1) }} light={L} vignette={0.65} bgBlur={3} bg={<DesertSet floor={-700} />}>
        <Character {...NAPOLEON} x={a.x} y={a.y} s={2.1} facing={1} look={0.1} expression={{ eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true }} pose={poses.scared(frame)} z={-6} />
      </DepthStage>
      <Label text="TRAPPED" x={0.76} y={0.3} size={0.09} kind="stamp" rotate={-7} at={at(288.0)} pin />
    </AbsoluteFill>
  );
};

// 289.02 "His army fights on through the desert and a plague."
export const DesertPlagueShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const sick = { eyes: "half" as const, mouth: "wavy" as const, brows: 0.7, sweat: true, eyebags: true };
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), x: frame * 1.2, y: 100 }} light={L} vignette={0.55}>
        <DesertSet floor={-460} pyramids={false}>
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...SOLDIER(i + 2)} x={-900 + i * 480} y={-460 - (i % 2) * 30} s={1.1} facing={1} look={0.4} expression={sick} pose={i === 2 ? { ...poses.walk(frame * 0.6, 0.4), lean: 0.12 } : poses.walk(frame * 0.6 + i * 8, 0.45)} skin={i === 2 ? "#d8e2c8" : undefined} z={-10 - i * 0.01} />
          ))}
        </DesertSet>
      </Stage>
      <Label text="DESERT" x={0.06} y={0.09} size={0.05} kind="box" at={at(290.2)} />
      <Label text="PLAGUE" x={0.94} y={0.09} size={0.05} kind="stamp" at={at(291.0)} />
    </AbsoluteFill>
  );
};

// 291.84 "In 1799, he sneaks back to France on a small ship,"
export const SneaksBackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.84), y: 160 }} light={L} vignette={0.65}>
        <IslandSea floor={-460} night islandX={-5000}>
          <Sloop x={-500 + (t - 291.7) * 220} y={-120} s={0.8} seed={2} z={-20} />
          <X x={-460 + (t - 291.7) * 220} y={-30} z={-19.9}>
            <Character {...NAPOLEON_GREY} s={0.55} facing={1} look={0.6} expression={{ eyes: "squint", mouth: "flat" }} pose={poses.idle(frame, 1)} shadow={false} />
          </X>
        </IslandSea>
      </Stage>
      <Label text="1799" x={0.5} y={0.1} size={0.08} kind="title" at={at(292.0)} />
    </AbsoluteFill>
  );
};

// 295.55 "leaving most of his army behind."
export const LeftBehindShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: 80 }} light={L} vignette={0.6}>
        <IslandSea floor={-460} night islandX={-5000}>
          <Sloop x={700} y={60} s={0.3} z={-40} />
          <Part shape={roundRect(6000, 800, 0)} color="#8a7a5a" flat outline={6} y={-760} z={-30} />
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...SOLDIER(i + 3)} x={-800 + i * 360} y={-460 - (i % 2) * 40} s={1.1} facing={1} look={0.7} expression={{ eyes: "sad", mouth: "o", brows: 0.8 }} pose={i % 2 ? poses.grief(frame) : { armF: [1.3, 0.2], armB: [-0.2, 0.3] }} z={-10 - i * 0.01} />
          ))}
        </IslandSea>
      </Stage>
    </AbsoluteFill>
  );
};

// 297.79 "His scientists do find something amazing, though."
export const DigShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dig = Math.sin(frame * 0.35) * 0.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 60 }} light={L} vignette={0.5}>
        <DesertSet floor={-460} pyramids={false} nile>
          {[0, 1].map((i) => (
            <Character key={i} {...SOLDIER(i + 6)} hat={null} x={-560 + i * 600} y={-470} s={1.15} facing={i ? -1 : 1} look={0.6} expression={{ eyes: "squint", mouth: "flat" }} pose={{ armF: [0.9 + dig, 0.6], armB: [0.6 + dig, 0.9] }} holdF={<Shovel rot={-(0.9 + dig) - 0.6 + 0.25} s={0.6} />} z={-10 - i * 0.01} />
          ))}
          <Character {...SAVANT(0)} x={600} y={-480} s={1.15} facing={-1} look={0.6} expression={{ eyes: t > 299 ? "wide" : "open", mouth: t > 299 ? "o" : "flat" }} pose={t > 299 ? poses.armsUp(frame) : poses.think} z={-11} />
          <Part shape={ellipse(360, 60)} color="#c9a86a" flat outline={5} y={-500} z={-12} />
        </DesertSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 300.23 "French soldiers dig up a stone with the same message written in three scripts."
export const StoneFoundShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const rise = ramp(t, 300.6, 301.6, Easing.out(Easing.quad));
  const hi = t > 303.2 ? 2 : t > 302.9 ? 1 : t > 302.5 ? 0 : null;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={L} vignette={0.5}>
        <DesertSet floor={-520} pyramids={false}>
          <RosettaStone x={0} y={-560 + rise * 130} s={1.1} hi={hi} glow={1} z={-20} />
          <Part shape={blob([[-700, 0], [-400, 60], [0, 40], [400, 70], [700, 0], [700, -300], [-700, -300]], 8)} color="#e9cc8a" shade={0.15} y={-480} z={-19} />
          {[-1, 1].map((k, i) => (
            <Character key={k} {...SOLDIER(i + 1)} hat={null} x={k * 620} y={-560} s={1.2} facing={k > 0 ? -1 : 1} look={0.6} expression={{ eyes: "wide", mouth: "o" }} pose={poses.idle(frame, i)} z={-10} />
          ))}
        </DesertSet>
      </Stage>
      <Label text="HIEROGLYPHS" x={0.5} y={0.14} size={0.04} kind="box" at={at(302.5)} pin />
      <Label text="DEMOTIC" x={0.5} y={0.27} size={0.04} kind="box" at={at(302.9)} pin />
      <Label text="GREEK" x={0.5} y={0.4} size={0.04} kind="box" at={at(303.3)} pin />
    </AbsoluteFill>
  );
};

// 304.23 "The Rosetta Stone."
export const RosettaTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2a2430" flat outline={0} z={-30} />
        <Glow rx={800} color="#ffe2a0" alpha={0.35} additive z={-29} />
        <RosettaStone x={0} y={-300} s={1.2} z={-10} />
      </Stage>
      <Label text="THE ROSETTA STONE" x={0.5} y={0.88} size={0.08} kind="title" at={at(304.3)} />
    </AbsoluteFill>
  );
};

/** Big golden key. */
const KeyIcon: React.FC<{ x?: number; y?: number; s?: number; rot?: number; z?: number }> = ({ x = 0, y = 0, s = 1, rot = 0, z = 0 }) => (
  <X x={x} y={y} s={s} rot={rot} z={z}>
    <Part shape={circle(80)} color="#e2b23c" shade={0.25} x={-160} />
    <Part shape={circle(34)} color="#2a2430" flat outline={4} x={-160} z={0.001} />
    <Part shape={roundRect(300, 36, 12)} color="#e2b23c" shade={0.25} x={40} />
    {[110, 160].map((kx) => (
      <Part key={kx} shape={roundRect(24, 60, 6)} color="#e2b23c" shade={0.25} x={kx} y={-34} z={-0.001} />
    ))}
  </X>
);

// 305.73 "It becomes the key to reading Egyptian hieroglyphs."
export const KeyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.55}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2a2430" flat outline={0} z={-30} />
        <RosettaStone x={-480} y={-300} s={1.0} hi={0} glow={ramp(t, 306.3, 306.8)} z={-10} />
        <KeyIcon x={160} y={80} s={pop(t, 306.35)} rot={-0.3 + ramp(t, 306.6, 307.4) * 0.3} z={-9} />
        <X x={600} y={80} s={pop(t, 307.3)} z={-9}>
          <Part shape={roundRect(420, 300, 20)} color="#f2e6c8" shade={0.15} />
        </X>
      </Stage>
      <Label text="A B C" x={0.81} y={0.43} size={0.07} kind="ink" at={at(307.4)} pin />
    </AbsoluteFill>
  );
};

// 308.66 "And where is it today?"
export const WhereTodayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2a2430" flat outline={0} z={-30} />
        <RosettaStone x={-200} y={-300} s={1.0} z={-10} />
        <QuestionMark x={420} y={60} size={1.6 * pop(t, 309.1)} z={-9} />
      </Stage>
    </AbsoluteFill>
  );
};

/** Museum glass case on a plinth. */
const GlassCase: React.FC<{ x?: number; y?: number; s?: number; z?: number; children?: React.ReactNode }> = ({ x = 0, y = 0, s = 1, z = 0, children }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(640, 240, 10)} color="#3a3a42" shade={0.2} y={120} />
    <X y={240} z={0.001}>{children}</X>
    <Part shape={roundRect(600, 700, 8)} color="#cfe6f2" flat outline={6} opacity={0.25} y={590} z={0.01} />
    <Line pts={[[-220, 860], [-120, 360]]} width={8} color="#ffffff" opacity={0.6} z={0.011} />
  </X>
);

// 310.13 "In London."
export const LondonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 80 }} light={L} vignette={0.5}>
        <GallerySet floor={-480}>
          <GlassCase x={0} y={-480} s={0.9} z={-20}>
            <RosettaStone s={0.95} />
          </GlassCase>
          <NationFlag kind="uk" x={-760} y={-480} w={240} pole={720} z={-25} />
        </GallerySet>
      </Stage>
      <Label text="BRITISH MUSEUM, LONDON" x={0.5} y={0.1} size={0.06} kind="title" at={at(310.2)} />
    </AbsoluteFill>
  );
};

// 311.01 "The British took it as a prize of war."
export const PrizeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const carry = (t - 310.9) * 160;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 100 }} light={L} vignette={0.5}>
        <IslandSea floor={-460} islandX={-5000}>
          <ShipOfLine navy="uk" x={1100} y={-60} s={0.42} sail={0.2} z={-40} />
          <Part shape={roundRect(6000, 800, 0)} color="#e9cc8a" flat outline={6} y={-760} z={-30} />
          {[0, 1].map((i) => (
            <Character key={i} {...REDCOAT(i)} x={-560 + carry + i * 520} y={-470} s={1.1} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.walk(frame, 0.6), armF: [1.6, 0.6], armB: [1.4, 0.8] }} z={-10 - i * 0.02} />
          ))}
          <RosettaStone x={-300 + carry} y={-180} s={0.55} rot={-Math.PI / 2} z={-9.99} />
        </IslandSea>
      </Stage>
      <Label text="PRIZE OF WAR · 1801" x={0.5} y={0.1} size={0.07} kind="title" at={at(312.0)} />
    </AbsoluteFill>
  );
};

// 313.82 "Back home, France is losing a new war, and the government is weak."
export const WeakGovShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const c = eu([6, 48]);
  const cam = { zoom: 1.0, x: c[0], y: c[1] };
  const paris = EURO.paris;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, cam.zoom, cam.zoom * 1.05), x: cam.x, y: cam.y }} light={L} vignette={0.45}>
        <MapBack islands={["corsica"]} tint={{ France: "#3b62b8" }} tintK={0.7}
          routes={[
            { pts: [[16.4, 48.2], [11.5, 48.4], [7.5, 48.5]], k: ramp(t, 314.6, 315.9), width: 26, color: "#e8e6ee" },
            { pts: [[10.5, 45.5], [8.0, 45.6], [6.8, 46.0]], k: ramp(t, 314.9, 316.0), width: 26, color: "#2f6a4a" },
            { pts: [[-1.5, 51.0], [1.5, 50.4], [3.4, 50.0]], k: ramp(t, 315.2, 316.2), width: 26, color: "#d8463a" },
          ]}
          pins={[{ at: paris, color: "#2c4486" }]} />
      </Stage>
      <Label text="LOSING A NEW WAR" x={0.06} y={0.09} size={0.045} kind="box" at={at(315.2)} />
      <Label text="WEAK GOVERNMENT" x={0.5} y={0.85} size={0.06} kind="stamp" rotate={-4} at={at(317.2)} />
    </AbsoluteFill>
  );
};

// 318.11 "In November 1799, Napoleon takes power in a coup."
export const CoupShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const enter = ramp(t, 320.0, 321.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 100, shake: hitAt(t, 321.7) * 8 }} light={L} vignette={0.55}>
        <CouncilHall floor={-460}>
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...DEPUTY(i)} x={200 + i * 300 + enter * 400} y={-460 - (i % 2) * 40} s={1.0} facing={1} look={0.7} expression={{ eyes: "wide", mouth: "o", sweat: true }} pose={enter > 0.1 ? poses.run(frame + i * 6, i) : poses.talk(frame, i)} z={-12 - (i % 2) * 0.5} />
          ))}
          <Character {...NAPOLEON} x={-500 + enter * 300} y={-470} s={1.15} facing={1} look={0.6} expression={{ eyes: "angry", mouth: "flat", brows: -0.7 }} pose={poses.point(frame)} z={-10} />
          {[0, 1].map((i) => (
            <Character key={`g${i}`} {...GRENADIER(i)} x={-900 + enter * 360 - i * 260} y={-460} s={1.1} facing={1} look={0.5} expression={{ eyes: "angry", mouth: "flat" }} pose={{ ...poses.walk(frame, 0.6), armF: AIM }} holdF={<HeldMusket arm={AIM} dir={0.05} />} z={-9 - i * 0.01} />
          ))}
        </CouncilHall>
      </Stage>
      <Label text="NOVEMBER 1799" x={0.5} y={0.1} size={0.08} kind="title" at={at(318.3)} />
      <Label text="COUP" x={0.85} y={0.3} size={0.1} kind="stamp" rotate={-8} at={at(321.7)} pin />
    </AbsoluteFill>
  );
};

// 322.44 "He's 30 years old, and he now rules France."
export const ConsulShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.5, 0.42, 1.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: cam.y }} light={L} vignette={0.5}>
        <PalaceRoom floor={-560}>
          <Character {...NAPOLEON} outfit={{ ...NAPOLEON.outfit, top: "#b8262f", lapels: "#b8262f", tails: "#b8262f", collarColor: "#e2b23c", cuffs: "#e2b23c" }} hat={null} x={a.x} y={a.y} s={1.6} facing={1} look={0.15} expression={{ eyes: "happy", mouth: "smirk" }} pose={poses.handsOnHips} z={-10} />
        </PalaceRoom>
      </Stage>
      <Label text="AGE 30" x={0.06} y={0.09} size={0.05} kind="box" at={at(322.6)} />
      <Label text="FIRST CONSUL OF FRANCE" x={0.5} y={0.88} size={0.055} kind="box" at={at(324.4)} />
    </AbsoluteFill>
  );
};

// 326.16 "The next spring, he does it again."
export const AlpsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 300 }} light={L} vignette={0.5}>
        <AlpsSnow floor={-460} snow={0.5}>
          {Array.from({ length: 12 }, (_, i) => (
            <Character key={i} {...SOLDIER(i)} x={-1400 + i * 120 + frame * 1.2} y={-470 + i * 46} s={0.35} facing={1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.walk(frame + i * 3, 0.5)} z={-20 + i * 0.01} />
          ))}
        </AlpsSnow>
      </Stage>
      <Label text="SPRING 1800" x={0.5} y={0.1} size={0.08} kind="title" at={at(326.3)} />
    </AbsoluteFill>
  );
};

// 328.33 "He leads an army over the Alps to surprise the Austrians in Italy."
export const CrossingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const haul = Math.sin(frame * 0.2) * 0.1;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), x: frame * 0.8, y: 60 }} light={L} vignette={0.5}>
        <AlpsSnow floor={-460} snow={0.7}>
          <X x={-60} y={-420} rot={0.18} z={-12}>
            <Part shape={roundRect(700, 90, 40)} color="#6a4424" shade={0.22} y={40} />
            <X y={110} x={60} s={0.75}>
              <FieldGun elev={0} />
            </X>
          </X>
          {[0, 1, 2].map((i) => (
            <Character key={i} {...SOLDIER(i + 3)} x={340 + i * 240} y={-300 + i * 44} s={1.0} facing={1} look={0.5} expression={{ eyes: "squint", mouth: "teeth", brows: 0.4, sweat: true }} pose={{ ...poses.walk(frame * 0.5 + i * 6, 0.4), armB: [-1.2 + haul, 0.2], lean: 0.18 }} z={-10 - i * 0.01} />
          ))}
          <Line pts={[[260, -60], [900, 60]]} width={7} color="#8a6a4a" z={-10.5} />
        </AlpsSnow>
      </Stage>
      <Label text="THE ALPS" x={0.06} y={0.09} size={0.05} kind="box" at={at(329.6)} />
      <Label text="SURPRISE ATTACK ON AUSTRIA" x={0.94} y={0.85} size={0.042} kind="box" at={at(330.5)} />
    </AbsoluteFill>
  );
};

// 332.09 "You've probably seen the painting."
export const GalleryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.95), y: 120 }} light={L} vignette={0.5}>
        <GallerySet floor={-480}>
          <Painting x={0} y={160} w={900} h={640} s={0.7} z={-30}>
            <PaintingPicture frame={frame} />
          </Painting>
        </GallerySet>
      </Stage>
    </AbsoluteFill>
  );
};

// 333.93 "Napoleon on a rearing horse, cape flying in the wind."
export const PaintingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.4), x: -20, y: -60 }} light={L} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#9a382f" flat outline={0} z={-30} />
        <Painting w={900} h={640} z={-10}>
          <PaintingPicture frame={frame} />
        </Painting>
      </Stage>
      <Label text="REARING HORSE" x={0.06} y={0.85} size={0.045} kind="box" at={at(334.7)} />
      <Label text="CAPE IN THE WIND" x={0.94} y={0.09} size={0.045} kind="box" at={at(335.8)} />
    </AbsoluteFill>
  );
};

// 337.50 "In real life, he crossed on a mule."
export const MuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), x: frame * 0.6, y: 80 }} light={L} vignette={0.5}>
        <AlpsSnow floor={-460} snow={0.5}>
          <Steed mule x={0 + frame * 1.5} y={-440} s={0.95} walk={0.6} color="#8c7f72" mane="#3a3230" z={-12}>
            <Character {...NAPOLEON_GREY} s={0.62} facing={1} look={0.4} expression={{ eyes: "half", mouth: "flat", eyebags: true }} pose={poses.sit(frame)} />
          </Steed>
          <Character {...CORSICAN(2)} x={520 + frame * 1.5} y={-420} s={1.0} facing={1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={{ ...poses.walk(frame, 0.6), armB: [-1.0, 0.2] }} z={-11} />
        </AlpsSnow>
      </Stage>
      <Label text="REAL LIFE: A MULE" x={0.5} y={0.1} size={0.07} kind="title" at={at(338.9)} />
    </AbsoluteFill>
  );
};

/** Wooden easel with a canvas; children paint on the canvas (origin = canvas centre). */
const Easel: React.FC<{ x?: number; y?: number; s?: number; z?: number; children?: React.ReactNode }> = ({ x = 0, y = 0, s = 1, z = 0, children }) => (
  <X x={x} y={y} s={s} z={z}>
    {[-1, 1].map((k) => (
      <Line key={k} pts={[[k * 200, 0], [k * 60, 1100]]} width={26} color="#8a5a32" />
    ))}
    <Line pts={[[0, 1100], [0, -40]]} width={22} color="#6a4424" z={-0.01} />
    <Part shape={roundRect(520, 30, 8)} color="#6a4424" shade={0.2} y={420} z={0.002} />
    <X y={700} z={0.003}>
      <Part shape={roundRect(600, 500, 6)} color="#f6eedc" shade={0.12} />
      <X z={0.001}>{children}</X>
    </X>
  </X>
);

// 340.00 "But he wanted to be painted calm on a fiery horse, so that's what the painter gave him."
export const PainterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const paint = ramp(t, 342.9, 344.0);
  const cam = { zoom: 1, y: 40 };
  const p = atHead(cam, 0.24, 0.42, 1.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: cam.y }} light={L} vignette={0.5}>
        <StudySet floor={-560} map={false}>
          <Character {...CARTOONIST} hat="beanie" hatColor="#2a2228" x={p.x} y={p.y} s={1.5} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "smile", gaze: [0.6, 0] }} pose={{ armF: [1.3, 0.4 + Math.sin(frame * 0.7) * 0.15], armB: [-0.2, 0.6] }} z={-12} />
          <Easel x={360} y={-560} s={1.0} z={-11}>
            <X s={0.85 + paint * 0.1}>
              <X x={-20} y={-230} s={0.55}>
                <Steed color="#f2efe9" mane="#c9c4cc" rear={paint} cloth="#9a1f35">
                  <Character {...NAPOLEON} outfit={{ ...NAPOLEON.outfit, cape: "#c8262f", capeWind: paint }} s={0.62} facing={1} look={0.4} expression={{ eyes: "open", mouth: "flat" }} pose={{ ...poses.sit(frame), armF: [2.5 * paint + 0.3, 0.3], handF: "point" }} />
                </Steed>
              </X>
            </X>
          </Easel>
        </StudySet>
      </Stage>
      <Label text="CALM" x={0.66} y={0.12} size={0.05} kind="box" at={at(341.1)} pin />
      <Label text="FIERY HORSE" x={0.9} y={0.12} size={0.05} kind="box" at={at(341.8)} pin />
    </AbsoluteFill>
  );
};

// 345.05 "Now, ruling France, he changes almost everything."
export const ReformsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.3, 0.42, 1.6);
  const stamp = Math.abs(Math.sin(frame * 0.5));
  const icons: [string, number][] = [["BANK OF FRANCE", 346.6], ["SCHOOLS", 347.1], ["ROADS", 347.5]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: cam.y }} light={L} vignette={0.5}>
        <StudySet floor={-560}>
          <Character {...NAPOLEON} hat={null} x={a.x} y={a.y} s={1.6} facing={1} look={0.6} expression={{ eyes: "squint", mouth: "smirk" }} pose={{ armF: [1.0 + stamp * 0.4, 0.7], armB: [-0.2, 0.4], handF: "fist" }} z={-12} />
          <Desk x={360} y={-560} w={900} z={-8} />
          {Array.from({ length: 6 }, (_, i) => (
            <X key={i} x={300 + (i % 3) * 30} y={-180 + i * 26} rot={(i % 2 ? 1 : -1) * 0.04} z={-7.9 + i * 0.001}>
              <Doc w={260} />
            </X>
          ))}
        </StudySet>
      </Stage>
      {icons.map(([txt, it], i) => (
        <Label key={i} text={txt} x={0.7} y={0.2 + i * 0.1} size={0.042} kind="box" at={at(it)} pin />
      ))}
      <Label text="CHANGES ALMOST EVERYTHING" x={0.5} y={0.88} size={0.05} kind="box" at={at(347.2)} />
    </AbsoluteFill>
  );
};

// 348.38 "He creates a new set of laws, the Napoleonic Code."
export const CodeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.55}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2c3a5e" flat outline={0} z={-30} />
        <Glow rx={800} color="#ffe2a0" alpha={0.35 * pop(t, 350.1)} additive z={-29} />
        <X y={-40} s={1.4 * pop(t, 348.6)} rot={-0.04} z={-10}>
          <Book w={420} h={560} cover="#2c4486" accent="#e2b23c" />
        </X>
      </Stage>
      <Label text="CODE CIVIL" x={0.5} y={0.42} size={0.06} kind="ink" at={at(348.9)} pin />
      <Label text="THE NAPOLEONIC CODE" x={0.5} y={0.88} size={0.07} kind="title" at={at(350.1)} />
    </AbsoluteFill>
  );
};

// 351.79 "Under it, men are equal before the law, no matter what family they're born into."
export const EqualShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const tilt = keys(t, [[351.8, -0.6], [352.9, 0]]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: 60 }} light={L} vignette={0.5}>
        <PalaceRoom floor={-520} throne={false}>
          <BalanceScale x={0} y={-240} s={1.0} tilt={tilt} z={-20}
            left={<Character {...ROYALIST(1)} hat="tricorne" s={0.5} facing={1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.handsOnHips} shadow={false} />}
            right={<Character {...CORSICAN(0)} hat={null} s={0.5} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 2)} shadow={false} />}
          />
        </PalaceRoom>
      </Stage>
      <Label text="NOBLE" x={0.21} y={0.85} size={0.045} kind="box" at={at(352.4)} pin />
      <Label text="COMMONER" x={0.79} y={0.85} size={0.045} kind="box" at={at(352.4)} pin />
      <Label text="EQUAL BEFORE THE LAW" x={0.5} y={0.1} size={0.07} kind="title" at={at(352.9)} />
    </AbsoluteFill>
  );
};

// 356.24 "Versions of it still shape the laws of many countries today."
export const CodeWorldShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const civil = ["France", "Belgium", "Luxembourg", "Netherlands", "Italy", "Spain", "Portugal", "Germany", "Switzerland", "Poland", "Romania", "Greece", "Egypt", "Lebanon", "Mexico", "Brazil", "Argentina", "Chile", "Peru", "Colombia", "Venezuela", "Bolivia", "Ecuador", "Uruguay", "Paraguay", "Cuba", "Haiti", "Dominican Rep.", "Senegal", "Mali", "Ivory Coast", "Morocco", "Algeria", "Tunisia", "Madagascar", "Cameroon", "Niger", "Chad", "Guinea", "Burkina Faso", "Benin", "Togo", "Gabon", "Congo", "Dem. Rep. Congo", "Turkey", "Japan", "Quebec"];
  const k = ramp(t, 356.3, 358.4);
  const tint = Object.fromEntries(civil.slice(0, Math.ceil(k * civil.length)).map((c) => [c, "#3b62b8"]));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={L} vignette={0.45}>
        <WorldMap ppd={5.6} center={[10, 15]} w={2600} h={1500} tint={tint} tintK={0.7} z={-20} />
      </Stage>
      <Label text="STILL SHAPES LAWS TODAY" x={0.5} y={0.88} size={0.055} kind="box" at={at(357.3)} />
    </AbsoluteFill>
  );
};

// 359.94 "But there's a dark side too."
export const DarkSideShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const dark = ramp(t, 360.0, 361.0);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.46, 1.9);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.6 + dark * 0.3} bgBlur={3} bg={<PalaceRoom floor={-700} />}>
        <Character {...NAPOLEON} x={a.x} y={a.y} s={1.9} facing={1} look={0.2} expression={{ eyes: "squint", mouth: "smirk", brows: -0.7 }} pose={poses.handsOnHips} z={-6} />
        <Part shape={roundRect(4000, 3000, 0)} color="#120c1a" flat outline={0} opacity={0.45 * dark} z={-5} />
      </DepthStage>
      <Label text="THE DARK SIDE" x={0.5} y={0.1} size={0.07} kind="title" at={at(360.5)} />
    </AbsoluteFill>
  );
};

// 361.79 "His laws treat wives as if they must obey their husbands."
export const WivesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: 60 }} light={L} vignette={0.5}>
        <PalaceRoom floor={-520} throne={false}>
          <BalanceScale x={0} y={-240} s={1.0} tilt={ramp(t, 362.4, 363.4) * -0.6} z={-20}
            left={<Character {...ROYALIST(2)} hat={null} mustache="handlebar" s={0.5} facing={1} look={0.5} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.point(frame)} shadow={false} />}
            right={<Character {...LETIZIA} s={0.5} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "frown", brows: -0.5 }} pose={poses.handsOnHips} shadow={false} />}
          />
        </PalaceRoom>
      </Stage>
      <Label text="HUSBAND" x={0.21} y={0.85} size={0.045} kind="box" at={at(362.6)} pin />
      <Label text="WIFE MUST OBEY" x={0.79} y={0.85} size={0.045} kind="box" at={at(363.4)} pin />
    </AbsoluteFill>
  );
};

export const _d = { Coach, Fireball, Smoke, Lectern, LaurelCrown, OFFICER, ROYALIST, SHOULDER_ARMS, shoulderPose, ellipse, poly, Doc };
