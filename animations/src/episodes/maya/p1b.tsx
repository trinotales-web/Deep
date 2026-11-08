import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, Gradient, QuestionMark, Shovel, roundRect, roundPoly, circle, ellipse, poly, blob, ramp, push, hitAt, absT, rng, mixHex, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses, reachArm } from "../../kit/character";
import {
  Globe, Asteroid, SpaceStars, Dinosaur, MesoMap, siteXY, mesoXY, Cenote, Vines, CornPlant, CornCob, Codex, MayaPyramid, Platform, LidarReveal, SurveyPlane,
  Jungle, Ceiba, LimeKiln, Stump, MayaHut, Cloud, Sunburst, Flame, Smoke, BigLeaf, Tree, Sky, Mountains, Ground,
} from "../../kit/env";
import { cloudShape } from "../../kit/env/nature";
import { sec, pop, useScr } from "../../kit/shot";
import { JungleSet, Paper, Village, PlazaSet } from "./sets";
import {
  MAYA_COMMONER, MAYA_WOMAN, MAYA_PRIEST, SCIENTIST, CREATOR_GOD, MUD_PERSON, WOOD_PERSON, CORN_PERSON, EARLY_FARMER, MAYA_KING,
} from "./cast";
import { upright } from "./p1a";

const MAP_C: [number, number] = [-89.6, 18.0];

// ───────────────────────── the asteroid ─────────────────────────

// 60.6 "Sixty six million years ago, an asteroid about ten kilometers wide slams into the Earth."
export const ImpactShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const a = ramp(t, 60.6, 64.9, Easing.in(Easing.quad));
  const flash = hitAt(t, 64.95, 0.9);
  const ring = ramp(t, 64.95, 66.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: interpolate(a, [0, 1], [1.0, 1.35]), x: interpolate(a, [0, 1], [0, -40]), y: interpolate(a, [0, 1], [0, 60]), shake: flash * 12 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SpaceStars z={-40} />
        <Globe x={0} y={-60} r={460} lon0={-88} lat0={18} z={1} />
        {t < 64.95 ? <Asteroid x={interpolate(a, [0, 1], [1100, -20])} y={interpolate(a, [0, 1], [700, 60])} r={interpolate(a, [0, 1], [60, 20])} rot={-0.55} z={2} /> : null}
        {ring > 0 ? (
          <X x={-20} y={60} z={3}>
            <Part shape={circle(40 + ring * 380)} color="#ffd36a" flat outline={0} opacity={0.5 * (1 - ring)} />
            <Glow rx={200 + ring * 500} color="#ffb35a" alpha={0.8 * (1 - ring)} additive />
          </X>
        ) : null}
      </Stage>
      {flash > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(255,248,230,${0.9 * flash})` }} /> : null}
      <Label text="66 MILLION YEARS AGO" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(61.3)} />
      <Label text="10 KM WIDE" x={0.78} y={0.82} size={0.05} kind="box" at={sec(start)(63.7)} />
    </AbsoluteFill>
  );
};

/** Prehistoric shore: ferns, cycads, a red sky as the fireball spreads. */
const Prehistoric: React.FC<{ fire: number; children?: React.ReactNode }> = ({ fire, children }) => (
  <>
    <Sky w={6000} h={3600} y={1500} top={mixHex("#7cc0e4", "#3a0e14", fire)} mid={mixHex("#e6f2ea", "#c0392b", fire)} bottom={mixHex("#f6efc8", "#ffb35a", fire)} z={-41} />
    <Mountains w={6000} y={-200} color={mixHex("#6a8a72", "#4a2a2a", fire)} outline={3} peaks={[[-2200, 300], [-1200, 460], [-300, 280], [600, 420], [1500, 300]]} z={-40} />
    <Ground w={6000} h={2000} y={-200} color={mixHex("#8aa85a", "#6a4a2a", fire * 0.6)} far={mixHex("#8aa85a", "#6a4a2a", fire * 0.6)} pebbles={6} tufts={18} seed={2} z={-30} />
    {[-1100, -600, 900, 1300].map((x, i) => (
      <X key={x} x={x} y={-200} z={-25}>
        <Line pts={[[0, 0], [10, 420 - i * 40]]} width={22} color="#7a5a3a" />
        {Array.from({ length: 6 }, (_, k) => (
          <X key={k} x={10} y={420 - i * 40} rot={-1.4 + k * 0.56}>
            <Part shape={blob([[0, 0], [60, 20], [180, 10], [220, -10], [120, -10]], 6)} color={k % 2 ? "#3f7a34" : "#4f8a3e"} shade={0.24} />
          </X>
        ))}
      </X>
    ))}
    {children}
  </>
);

// 66.3 "It wipes out the dinosaurs."
export const DinosaursShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fire = ramp(t, 66.3, 67.4);
  const wave = ramp(t, 67.2, 68.4, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60, shake: 4 + wave * 10 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#1a0a0a">
        <Prehistoric fire={fire}>
          <X x={700} y={360} z={-35}>
            <Glow rx={700} color="#ffb35a" alpha={0.6 * fire} additive />
            <Part shape={circle(160 * fire)} color="#fff2c6" flat outline={0} />
          </X>
          <Dinosaur kind="rex" x={-420} y={-560} s={1.1} scared walk={0.4} z={2} />
          <Dinosaur kind="neck" x={300} y={-460} s={0.85} scared z={1.5} />
          {wave > 0 ? <Part shape={roundRect(4000, 3000, 0)} color="#ffcf8a" flat outline={0} x={2600 - wave * 2800} z={10} opacity={0.95} /> : null}
        </Prehistoric>
      </Stage>
      <Label text="GOODBYE, DINOSAURS" x={0.24} y={0.12} size={0.05} kind="box" at={sec(start)(67.1)} />
    </AbsoluteFill>
  );
};

// 68.45 "And it lands right here, on the coast of what is now Mexico's Yucatán Peninsula."
export const YucatanCraterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 110;
  const center: [number, number] = [-89.0, 19.5];
  const [kx, ky] = mesoXY(-89.5, 21.3, ppd, center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12), x: kx * 0.3, y: ky * 0.3 }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} crater={ramp(t, 69.3, 70.3, Easing.out(Easing.back(1.4)))} />
      </Stage>
      <Label text="CHICXULUB CRATER" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(69.5)} />
      <Label text="YUCATÁN PENINSULA" x={0.62} y={0.72} size={0.05} kind="box" at={sec(start)(71.7)} />
    </AbsoluteFill>
  );
};

/** Limestone ground in cross-section with caves and holes. Origin = surface. */
const Limestone: React.FC<{ w?: number; depth?: number }> = ({ w = 4000, depth = 1200 }) => {
  const r = rng(8);
  return (
    <X>
      <Part shape={roundRect(w, depth, 0)} color="#d8ccaa" flat outline={0} y={-depth / 2} />
      {[0.18, 0.36, 0.58, 0.8].map((q) => (
        <Line key={q} pts={Array.from({ length: 20 }, (_, i) => [-w / 2 + (i / 19) * w, -depth * q + Math.sin(i * 1.3) * 10] as [number, number])} smooth width={3} color="#bfb28c" z={0.001} />
      ))}
      {Array.from({ length: 9 }, (_, i) => {
        const x = -w * 0.4 + i * (w * 0.1) + (r() - 0.5) * 80;
        const y = -depth * (0.25 + r() * 0.55);
        const s = 50 + r() * 90;
        return <Part key={i} shape={cloudShape(s * 2, s * 1.1, 4, i + 3)} color="#3a3a40" flat outline={4} x={x} y={y} z={0.002} />;
      })}
      {[-0.22, 0.14, 0.34].map((q, i) => (
        <Part key={`h${i}`} shape={roundPoly([[-40, 0], [40, 0], [30, -220], [-30, -220]], 12)} color="#3a3a40" flat outline={4} x={w * q} z={0.003} />
      ))}
      <Part shape={roundRect(w, 40, 0)} color="#7aa04a" flat outline={0} y={20} z={0.004} />
      <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={5} z={0.005} />
    </X>
  );
};

// 73.2 "The land here is soft limestone, full of caves and holes."
export const LimestoneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Sky w={6000} h={2000} y={1100} top="#7cc0e4" bottom="#e6f2ea" z={-41} />
        <X y={60} z={-10}>
          <Limestone />
        </X>
        <Character {...MAYA_COMMONER(2)} x={-420} y={80} s={0.7} z={2} look={0.6} expression={{ eyes: "wide", mouth: "o", brows: 0.5, gaze: [0.4, -1] }} pose={{ ...poses.idle(frame), lean: 0.2 }} />
      </Stage>
      <Label text="SOFT LIMESTONE" x={0.22} y={0.12} size={0.05} kind="box" at={sec(start)(74.5)} />
      <Label text="CAVES & HOLES" x={0.76} y={0.12} size={0.05} kind="box" at={sec(start)(75.8)} />
    </AbsoluteFill>
  );
};

// 77.15 "Around the edge of the buried crater, there's a ring of natural wells."
export const CenoteRingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 150;
  const center: [number, number] = [-89.4, 20.6];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} crater={1} cenotes={ramp(t, 79.1, 80.6)} />
      </Stage>
      <Label text="BURIED CRATER" x={0.24} y={0.1} size={0.05} kind="box" at={sec(start)(77.9)} />
      <Label text="RING OF WELLS" x={0.74} y={0.86} size={0.05} kind="box" at={sec(start)(79.3)} />
    </AbsoluteFill>
  );
};

/** Clay water jar on a rope. Origin = jar bottom. */
const WaterJar: React.FC<{ x?: number; y?: number; s?: number; z?: number; rope?: number }> = ({ x = 0, y = 0, s = 1, z = 0, rope = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    {rope > 0 ? <Line pts={[[0, 120], [0, 120 + rope]]} width={4} color="#8a6a3e" /> : null}
    <Part shape={blob([[-40, 0], [40, 0], [56, 60], [30, 110], [-30, 110], [-56, 60]], 8)} color="#c8784a" shade={0.26} />
    <Part shape={roundRect(44, 20, 6)} color="#b8683a" shade={0.24} y={116} z={0.001} />
    <Line pts={[[-48, 60], [48, 60]]} width={4} color="#2a2026" z={0.001} />
  </X>
);

// 81.05 "They're full of fresh water, and they're called cenotes."
export const CenoteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lower = ramp(t, 81.2, 83.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 40 }} light={{ pos: [0, 400] }} vignette={0.6}>
        <Sky w={6000} h={2000} y={1200} top="#7cc0e4" bottom="#e6f2ea" z={-41} />
        <Cenote x={0} y={200} w={1100} depth={760} z={-10} />
        <Character {...MAYA_WOMAN(0)} x={-660} y={200} s={0.8} z={2} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.5, -0.8] }} pose={{ ...poses.idle(frame), armF: [1.6, 0.4], lean: 0.15 }} />
        <WaterJar x={-420} y={200 - 140 - lower * 420} s={0.7} rope={140 + lower * 420} z={1} />
      </Stage>
      <Label text="CENOTE" sub="NATURAL WELL" x={0.78} y={0.12} size={0.07} kind="box" at={sec(start)(83.2)} />
    </AbsoluteFill>
  );
};

// 84.35 "In a land with almost no rivers, these wells mean life."
export const WellsMeanLifeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Village horizon={-200}>
          <Part shape={ellipse(420, 70)} color="#2ab0b8" shade={0.2} y={-330} z={1} />
          <Part shape={ellipse(460, 90)} color="#b8ac8a" flat outline={5} y={-336} z={0.99} />
          {[-560, -260, 300, 580].map((x, i) => (
            <Character key={x} {...(i % 2 ? MAYA_COMMONER(i) : MAYA_WOMAN(i))} x={x} y={-560} s={1.15} z={2 + i * 0.01} facing={x < 0 ? 1 : -1} look={0.45} expression={{ eyes: i % 2 ? "happy" : "open", mouth: "smile" }} pose={i === 1 ? poses.armsUp(frame) : poses.idle(frame, i)} />
          ))}
          <WaterJar x={-80} y={-560} s={0.8} z={2.1} />
        </Village>
      </Stage>
      <Label text="NO RIVERS" x={0.22} y={0.12} size={0.05} kind="box" at={sec(start)(85.7)} />
      <Label text="WELLS = LIFE" x={0.76} y={0.12} size={0.05} kind="box" at={sec(start)(87.0)} />
    </AbsoluteFill>
  );
};

// 88.75 "This is the Maya world."
export const MayaWorldShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0) }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={78} center={[-90.5, 17.8]} maya={ramp(t, 89.2, 90.0)} />
      </Stage>
      <Label text="THE MAYA WORLD" x={0.5} y={0.1} size={0.07} kind="title" at={sec(start)(89.4)} />
    </AbsoluteFill>
  );
};

// 90.45 "Southern Mexico, Guatemala, Belize, and parts of Honduras and El Salvador."
export const CountriesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const sc = useScr();
  const ppd = 78;
  const center: [number, number] = [-90.5, 17.8];
  const z = push(frame, dur, 1.0, 1.04);
  const tag = (name: string, lon: number, lat: number, at: number) => {
    const [x, y] = mesoXY(lon, lat, ppd, center);
    return <Label key={name} text={name} {...sc(x, y, z)} size={0.034} kind="box" at={sec(start)(at)} />;
  };
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: z }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} countries />
      </Stage>
      {tag("SOUTHERN MEXICO", -92.6, 17.4, 90.5)}
      {tag("GUATEMALA", -90.4, 15.6, 91.64)}
      {tag("BELIZE", -88.6, 17.3, 92.5)}
      {tag("HONDURAS", -87.0, 14.9, 93.8)}
      {tag("EL SALVADOR", -88.9, 13.6, 94.61)}
    </AbsoluteFill>
  );
};

// ───────────────────────── corn ─────────────────────────

// 95.95 "Around nine thousand years ago, people in Mexico start taming a wild grass."
export const WildGrassShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm = reachArm(-260, -820, 2.0, 1, [80, -420]);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={4} bg={<JungleSet mood="day" horizon={-200} ground="#b8b06a" />}>
        {Array.from({ length: 9 }, (_, i) => (
          <X key={i} x={-120 + i * 90} y={-560} s={0.9 + (i % 3) * 0.15} z={1 + i * 0.01}>
            <Line pts={[[0, 0], [Math.sin(i) * 20, 300]]} width={6} color="#8aaa4a" />
            <Line pts={[[0, 120], [-60, 200]]} width={4} color="#8aaa4a" />
            <X x={Math.sin(i) * 20} y={300}>
              <CornCob kind="teosinte" s={1.4} />
            </X>
          </X>
        ))}
        <Character {...EARLY_FARMER(0)} x={-260} y={-820} s={2.0} z={2} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: 0.2, gaze: [0.6, -0.4] }} pose={{ ...poses.idle(frame), armF: arm }} />
      </DepthStage>
      <Label text="9,000 YEARS AGO" x={0.22} y={0.1} size={0.055} kind="box" at={sec(start)(96.6)} />
      <Label text="WILD GRASS: TEOSINTE" x={0.72} y={0.1} size={0.045} kind="box" at={sec(start)(99.9)} />
    </AbsoluteFill>
  );
};

// 101.25 "Over thousands of years, it turns into corn."
export const BecomesCornShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 101.6, 103.6, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#ecdcae" />
        <X x={-460} y={-260} s={3.2} z={1}>
          <CornCob kind="teosinte" />
        </X>
        <Line pts={[[-280, -100], [160, -100]]} width={14} color="#c0392b" z={1} />
        <Part shape={poly([[150, -60], [220, -100], [150, -140]])} color="#c0392b" flat outline={4} z={1} />
        <X x={480} y={-400} s={0.6 + k * 2.4} z={2}>
          <CornCob len={200} color={mixHex("#a8823a", "#f2c84a", k)} />
        </X>
      </Stage>
      <Label text="TEOSINTE" x={0.26} y={0.78} size={0.045} kind="box" at={sec(start)(101.4)} />
      <Label text="CORN" x={0.74} y={0.12} size={0.07} kind="title" at={sec(start)(103.5)} />
      <Label text="THOUSANDS OF YEARS" x={0.5} y={0.42} size={0.035} kind="box" at={sec(start)(101.8)} />
    </AbsoluteFill>
  );
};

// 104.35 "And for the Maya, corn is everything."
export const CornEverythingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [2.2, 0.7];
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }}
        light={{ dir: [-0.6, 0.6] }}
        vignette={0.55}
        bgBlur={5}
        bg={
          <JungleSet mood="day" horizon={-160} ground="#b8b06a">
            {Array.from({ length: 16 }, (_, i) => (
              <CornPlant key={i} x={-1500 + i * 200} y={-200 - (i % 2) * 30} h={460} seed={i} z={1 + (i % 2) * 0.01} />
            ))}
          </JungleSet>
        }
        fg={<CornPlant x={950} y={-700} h={1200} seed={9} />}
      >
        <Character {...MAYA_COMMONER(0)} x={-200} y={-860} s={2.0} z={2} look={0.45} expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }} pose={{ ...poses.idle(frame), armF: arm, armB: [2.0, 0.8] }} holdF={<CornCob len={220} rot={upright(arm)} />} />
      </DepthStage>
      <Label text="CORN = EVERYTHING" x={0.7} y={0.12} size={0.055} kind="box" at={sec(start)(105.6)} />
    </AbsoluteFill>
  );
};

/** Cloud deck for the gods. */
const Heaven: React.FC<{ dark?: number; children?: React.ReactNode }> = ({ dark = 0, children }) => (
  <>
    <Gradient w={6000} h={4000} stops={[[0, mixHex("#8ac8ee", "#2a3050", dark)], [1, mixHex("#f6e6c0", "#4a4060", dark)]]} z={-41} />
    <Sunburst y={300} r={2400} rays={20} color={mixHex("#f8eccc", "#4a4a6a", dark)} alt={mixHex("#f2e2bc", "#424262", dark)} speed={0.3} z={-40} />
    {[-1200, -500, 300, 1100].map((x, i) => (
      <Part key={x} shape={cloudShape(900, 360, 6, i + 3)} color={mixHex("#ffffff", "#8a8aa0", dark)} shade={0.2} x={x} y={-560 - (i % 2) * 40} z={-20 + i * 0.01} />
    ))}
    {children}
  </>
);

// 107.3 "Their holy book, the Popol Vuh, says the gods tried three times to make people."
export const PopolVuhShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <Heaven>
          {[-560, 0, 560].map((x, i) => (
            <Character key={x} {...CREATOR_GOD(i)} x={x} y={-640} s={1.25} z={2 + i * 0.01} look={0.5} facing={x > 0 ? -1 : 1} expression={{ eyes: "half", mouth: "smile", brows: 0.2 }} pose={i === 1 ? poses.think : poses.idle(frame, i)} />
          ))}
          <X y={300} s={0.7} z={3}>
            <Codex pages={6} open={ramp(t, 107.5, 108.6)} />
            <Glow rx={500} color="#fff2c6" alpha={0.4} additive z={-0.01} />
          </X>
        </Heaven>
      </Stage>
      <Label text="POPOL VUH" sub="THE K'ICHE' MAYA HOLY BOOK" x={0.17} y={0.1} size={0.05} kind="box" at={sec(start)(108.5)} />
      {[0, 1, 2].map((i) => (
        <Label key={i} text={`TRY ${i + 1}`} x={0.3 + i * 0.2} y={0.9} size={0.035} kind="box" at={sec(start)(110.5 + i * 0.15)} />
      ))}
    </AbsoluteFill>
  );
};

/** God sculpting / kneading (arms forward). */
const Maker: React.FC<{ i: number; x: number; y: number; s: number; z?: number; facing?: 1 | -1; mood?: "happy" | "angry" | "worried" | "think" }> = ({ i, x, y, s, z = 2, facing = 1, mood = "think" }) => {
  const frame = useCurrentFrame();
  const knead = Math.sin(frame * 0.4) * 0.25;
  const expr = { happy: { eyes: "happy", mouth: "grin" }, angry: { eyes: "angry", mouth: "shout", brows: -0.9 }, worried: { eyes: "wide", mouth: "wavy", brows: 0.8 }, think: { eyes: "half", mouth: "flat", brows: 0.2 } }[mood] as React.ComponentProps<typeof Character>["expression"];
  return <Character {...CREATOR_GOD(i)} x={x} y={y} s={s} z={z} facing={facing} look={0.45} expression={expr} pose={{ ...poses.idle(frame), armF: [1.5 + knead, 0.6], armB: [1.3 - knead, 0.7] }} />;
};

// 112.25 "First, they made them from mud."
export const MudShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const form = ramp(t, 112.6, 113.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <Heaven>
          <Maker i={0} x={-560} y={-900} s={1.9} />
          <X x={240} y={-560} sy={0.3 + form * 0.7} z={2}>
            <Character {...MUD_PERSON(0)} s={1.5} look={0.4} expression={{ eyes: "half", mouth: "wavy" }} pose={poses.idle(frame)} />
          </X>
          <Part shape={ellipse(220, 40)} color="#6a4428" shade={0.2} x={240} y={-560} z={1.9} />
        </Heaven>
      </Stage>
      <Label text="TRY 1: MUD" x={0.74} y={0.1} size={0.055} kind="box" at={sec(start)(113.6)} />
    </AbsoluteFill>
  );
};

// 114.3 "But the mud people fell apart."
export const MudFallsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const melt = ramp(t, 114.8, 115.9, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.3, y: -280 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <Heaven>
          {[-260, 260].map((x, i) => (
            <X key={x} x={x} y={-560} sy={1 - melt * 0.62} sx={1 + melt * 0.25} rot={(x < 0 ? 1 : -1) * melt * 0.25} z={2}>
              <Character {...MUD_PERSON(i)} s={1.5} look={0.4} expression={melt > 0.2 ? { eyes: "closed", mouth: "wavy", brows: 0.9 } : { eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.scared(frame)} />
            </X>
          ))}
          {[-260, 260].map((x) => (
            <Part key={`p${x}`} shape={ellipse(160 + melt * 160, 30 + melt * 20)} color="#6a4428" shade={0.2} x={x} y={-560} z={1.9} />
          ))}
          {melt > 0
            ? Array.from({ length: 8 }, (_, i) => (
                <Part key={`d${i}`} shape={blob([[0, 0], [12, -20], [0, -40], [-12, -20]], 5)} color="#7a4e30" shade={0.2} x={-380 + i * 100} y={-200 - ((frame * 9 + i * 40) % 340)} z={2.1} />
              ))
            : null}
        </Heaven>
      </Stage>
      <Label text="FELL APART" x={0.5} y={0.12} size={0.06} kind="stamp" rotate={-5} at={sec(start)(115.2)} />
    </AbsoluteFill>
  );
};

/** Wood grain lines drawn over a character's head (character space, head radius 100). */
const Grain: React.FC = () => (
  <X y={308} z={0.4}>
    {[-60, -20, 30, 70].map((y) => (
      <Line key={y} pts={[[-80, y], [-30, y + 10], [20, y - 6], [80, y + 4]]} smooth width={3} color="#9a6a3e" />
    ))}
  </X>
);

// 116.2 "Next, they carved people from wood."
export const WoodShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const chip = Math.sin(frame * 0.5) > 0.8;
  const arm: [number, number] = [1.9 - Math.max(0, Math.sin(frame * 0.5)) * 0.6, 0.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <Heaven>
          <Character {...CREATOR_GOD(1)} x={-540} y={-900} s={1.9} z={2} look={0.45} expression={{ eyes: "half", mouth: "flat", brows: 0.2 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<X rot={Math.PI}><Line pts={[[0, -30], [0, 110]]} width={12} color="#6e4a2c" /><Part shape={roundRect(26, 60, 6)} color="#8a8790" shade={0.3} y={120} /></X>} />
          {[180, 520].map((x, i) => (
            <Character key={x} {...WOOD_PERSON(i)} x={x} y={-560} s={1.45} z={2 + i * 0.01} look={0.4} expression={{ eyes: "open", mouth: "flat" }} pose={{ armF: [0.1, 0.1], armB: [0.1, 0.1] }}>
              <Grain />
            </Character>
          ))}
          {chip ? Array.from({ length: 5 }, (_, i) => <Part key={i} shape={roundRect(18, 8, 3)} color="#c8945e" flat outline={2} x={60 + i * 30} y={-80 + i * 20} rot={i} z={3} />) : null}
        </Heaven>
      </Stage>
      <Label text="TRY 2: WOOD" x={0.74} y={0.1} size={0.055} kind="box" at={sec(start)(117.3)} />
    </AbsoluteFill>
  );
};

// 118.75 "But the wooden people had no hearts and no memory, and they forgot the gods."
export const NoHeartsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -120 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <Heaven dark={ramp(t, 121.8, 122.8) * 0.5}>
          <Character {...WOOD_PERSON(0)} x={-240} y={-800} s={2.1} z={2} look={0.1} expression={{ eyes: "half", mouth: "flat" }} pose={{ armF: [0.1, 0.1], armB: [0.1, 0.1] }}>
            <Grain />
            <X y={160} z={0.5}>
              <Part shape={roundRect(70, 64, 18)} color="#2a2026" flat outline={4} />
            </X>
          </Character>
          <Character {...CREATOR_GOD(2)} x={560} y={-700} s={1.5} z={1.9} facing={-1} look={0.45} expression={t > 122 ? { eyes: "angry", mouth: "shout", brows: -0.9 } : { eyes: "wide", mouth: "o", brows: 0.4 }} pose={t > 122 ? poses.point(frame) : poses.idle(frame)} />
          <QuestionMark x={-60} y={220} s={0.55 * pop(t, 121.0)} rot={0.1} z={3} />
        </Heaven>
      </Stage>
      <Label text="NO HEART" x={0.2} y={0.12} size={0.045} kind="box" at={sec(start)(120.2)} />
      <Label text="NO MEMORY" x={0.2} y={0.2} size={0.045} kind="box" at={sec(start)(121.2)} />
    </AbsoluteFill>
  );
};

// 123.6 "So the gods sent a flood, …"
export const FloodShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const w = ramp(t, 124.3, 125.8, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -60, shake: w * 6 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7} vignetteColor="#0a1420">
        <JungleSet mood="storm" horizon={-260}>
          {[-420, -60, 320].map((x, i) => (
            <Character key={x} {...WOOD_PERSON(i)} x={x} y={-640} s={1.3} z={2 + i * 0.01} look={0.45} expression={{ eyes: "wide", mouth: "shout", brows: 0.9 }} pose={poses.scared(frame + i * 7)}>
              <Grain />
            </Character>
          ))}
          <X x={2400 - w * 2600} y={-700} z={5}>
            <Part shape={blob([[-200, 0], [-220, 700], [-60, 1100], [200, 1000], [260, 600], [1600, 600], [1600, 0]], 10)} color="#3a7ab0" shade={0.26} />
            <Part shape={blob([[-220, 700], [-80, 1120], [120, 1060], [-40, 980], [-150, 760]], 8)} color="#e8f4ff" flat outline={4} z={0.001} />
          </X>
        </JungleSet>
      </Stage>
      <Label text="THE FLOOD" x={0.22} y={0.1} size={0.06} kind="box" at={sec(start)(124.7)} />
    </AbsoluteFill>
  );
};

/** Cartoon monkey sitting on a branch, origin = seat. */
const Monkey: React.FC<{ x: number; y: number; s?: number; z?: number; seed?: number }> = ({ x, y, s = 1, z = 0, seed = 0 }) => {
  const frame = useCurrentFrame();
  const sw = Math.sin(frame * 0.12 + seed) * 0.3;
  return (
    <X x={x} y={y} s={s} z={z}>
      <X x={-40} y={20} rot={-1.2 + sw}>
        <Line pts={[[0, 0], [-40, -60], [-20, -140], [20, -150]]} smooth width={12} color="#5a3a26" />
      </X>
      <Part shape={blob([[-50, 0], [50, 0], [44, 110], [0, 130], [-44, 110]], 8)} color="#7a5232" shade={0.26} />
      <Part shape={ellipse(30, 40)} color="#d8b88a" flat outline={3} y={60} z={0.001} />
      <X y={170} z={0.002}>
        <Part shape={circle(60)} color="#7a5232" shade={0.26} />
        {[-1, 1].map((k) => (
          <Part key={k} shape={circle(22)} color="#d8b88a" shade={0.2} x={k * 60} z={-0.001} />
        ))}
        <Part shape={ellipse(42, 36)} color="#d8b88a" flat outline={3} y={-10} z={0.001} />
        {[-14, 14].map((k) => (
          <Part key={k} shape={circle(7)} color="#211b20" flat outline={0} x={k} y={0} z={0.002} />
        ))}
        <Line pts={[[-12, -24], [0, -30], [12, -24]]} smooth width={4} z={0.002} />
      </X>
      <Line pts={[[-30, 90], [-70, 40], [-60, 0]]} smooth width={12} color="#5a3a26" z={0.003} />
      <Line pts={[[30, 90], [70, 140], [60, 200]]} smooth width={12} color="#5a3a26" z={0.003} />
    </X>
  );
};

// 126.5 "… and the few who survived became monkeys."
export const MonkeysShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: 120 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-400}>
          <Tree x={0} y={-400} h={1300} kind="green" seed={7} spread={1.3} z={-5} />
          <Monkey x={-360} y={280} s={1.2} z={2} seed={1} />
          <Monkey x={260} y={420} s={1.0} z={2} seed={2} />
          <Monkey x={-60} y={620} s={0.85} z={1.9} seed={3} />
        </JungleSet>
      </Stage>
      <Label text="...MONKEYS" x={0.78} y={0.88} size={0.055} kind="box" at={sec(start)(127.0)} />
    </AbsoluteFill>
  );
};

// 128.1 "Finally, the gods made people from corn dough."
export const CornDoughShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const form = ramp(t, 129.6, 130.8, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <Heaven>
          <Maker i={0} x={-640} y={-900} s={1.8} mood="happy" />
          <Maker i={2} x={680} y={-900} s={1.8} facing={-1} mood="happy" />
          <X y={-560} z={2}>
            <Part shape={blob([[-260, 0], [260, 0], [220, 120], [-220, 120]], 8)} color="#8a5a32" shade={0.26} />
            <Part shape={blob([[-200, 110], [-120, 190], [120, 196], [200, 110]], 8)} color="#f2d88a" shade={0.22} z={0.001} />
          </X>
          {form > 0 ? (
            <X y={-440} s={form} z={2.5}>
              <Glow y={300} rx={420} color="#fff2a0" alpha={0.5} additive />
              <Character {...CORN_PERSON(0)} s={1.3} look={0.4} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame)} />
            </X>
          ) : null}
        </Heaven>
      </Stage>
      <Label text="TRY 3: CORN DOUGH" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(129.9)} />
    </AbsoluteFill>
  );
};

// 130.9 "And it worked."
export const ItWorkedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -100 }} light={{ pos: [0, 300] }} vignette={0.55}>
        <Heaven>
          {[-480, -160, 160, 480].map((x, i) => (
            <Character key={x} {...CORN_PERSON(i)} x={x} y={-760} s={1.5} z={2 + i * 0.01} facing={x > 0 ? -1 : 1} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame + i * 5)} />
          ))}
        </Heaven>
      </Stage>
      <Label text="IT WORKED!" x={0.5} y={0.12} size={0.07} kind="title" at={sec(start)(131.6)} />
    </AbsoluteFill>
  );
};

// 132.55 "So the Maya are the people of corn."
export const PeopleOfCornShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="dawn" horizon={-200} ground="#c8b06a">
          {Array.from({ length: 12 }, (_, i) => (
            <CornPlant key={i} x={-1300 + i * 240} y={-220} h={520} seed={i} z={-5 + (i % 2) * 0.01} />
          ))}
          {[-560, -200, 180, 540].map((x, i) => (
            <Character key={x} {...(i % 2 ? MAYA_WOMAN(i) : MAYA_COMMONER(i))} x={x} y={-640} s={1.3} z={2 + i * 0.01} facing={x > 0 ? -1 : 1} look={0.45} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, i)} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="THE PEOPLE OF CORN" x={0.5} y={0.1} size={0.065} kind="title" at={sec(start)(133.9)} />
    </AbsoluteFill>
  );
};

// 135.0 "Remember that. We'll need it at the end."
export const RememberCornShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arm: [number, number] = [2.2, 0.8];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={6} bg={<JungleSet mood="dawn" horizon={-200} ground="#c8b06a" />}>
        <Character {...MAYA_COMMONER(3)} x={-120} y={-900} s={2.2} z={2} look={0.3} expression={t > 135.5 ? { eyes: "happy", mouth: "smirk", brows: -0.3 } : { eyes: "open", mouth: "smile" }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<CornCob len={220} rot={upright(arm)} />} />
      </DepthStage>
      <Label text="REMEMBER" x={0.78} y={0.12} size={0.06} kind="stamp" rotate={-6} at={sec(start)(135.1)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── building big ─────────────────────────

/** Worker carrying a basket of earth on the back with a tumpline. */
const Carrier: React.FC<{ x: number; y: number; s: number; z?: number; i?: number; walk?: boolean }> = ({ x, y, s, z = 2, i = 0, walk = true }) => {
  const frame = useCurrentFrame();
  return (
    <Character {...MAYA_COMMONER(i)} x={x} y={y} s={s} z={z} look={0.5} expression={{ eyes: "half", mouth: "wavy", brows: 0.4, sweat: i % 2 === 0 }} pose={{ ...(walk ? poses.walk(frame + i * 9, 0.6) : poses.idle(frame, i)), armF: [0.5, 1.6], armB: [0.4, 1.7], lean: 0.12 }}>
      <X x={-70} y={250} z={-0.2}>
        <Part shape={roundPoly([[-50, -60], [50, -60], [60, 60], [-60, 60]], 10)} color="#c9a24a" shade={0.22} />
        <Part shape={blob([[-56, 56], [-20, 96], [24, 92], [56, 56]], 6)} color="#a87a50" shade={0.22} z={0.001} />
        {[-20, 10, 40].map((yy) => (
          <Line key={yy} pts={[[-52, yy], [52, yy]]} width={3} color="#8a6a2a" z={0.001} />
        ))}
      </X>
    </Character>
  );
};

// 137.95 "By one thousand BC, the Maya are building big."
export const BuildingBigShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-160} ground="#c9b48a">
          <Platform x={300} y={-200} w={2400} h={260} z={-20} />
          {[-700, -380, -60].map((x, i) => (
            <Carrier key={x} x={x + ((frame * 2.4) % 120)} y={-640 + i * 20} s={1.15} i={i} z={2 - i * 0.01} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="1000 BC" x={0.2} y={0.1} size={0.07} kind="box" at={sec(start)(138.6)} />
      <Label text="BUILDING BIG" x={0.72} y={0.1} size={0.05} kind="box" at={sec(start)(140.3)} />
    </AbsoluteFill>
  );
};

// 141.3 "In 2020, scientists flying over Mexico with laser scanners …"
export const LaserPlaneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Sky w={6000} h={3000} y={600} top="#7cc0e4" bottom="#e6f2ea" z={-41} />
        <Jungle y={-560} w={6000} h={700} seed={11} z={-10} />
        <SurveyPlane x={interpolate(t, [141.3, 144.9], [-900, 500])} y={260} s={1.3} beam={ramp(t, 143.8, 144.3)} z={2} />
      </Stage>
      <Label text="2020" x={0.18} y={0.1} size={0.07} kind="box" at={sec(start)(141.5)} />
      <Label text="LASER SCANS (LiDAR)" x={0.7} y={0.9} size={0.045} kind="box" at={sec(start)(144.0)} />
    </AbsoluteFill>
  );
};

// 144.85 "… found a giant hidden platform called Aguada Fénix."
export const AguadaFenixShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Gradient w={6000} h={4000} stops={[[0, "#14201a"], [1, "#0a100c"]]} z={-41} />
        <LidarReveal w={1700} h={940} k={ramp(t, 144.9, 146.9)} platform seed={6} z={1} />
      </Stage>
      <Label text="AGUADA FÉNIX" sub="HIDDEN PLATFORM" x={0.5} y={0.08} size={0.06} kind="box" at={sec(start)(146.9)} />
    </AbsoluteFill>
  );
};

/** Jungle canopy seen from above. */
const CanopyTop: React.FC = () => {
  const r = rng(21);
  return (
    <X z={-30}>
      <Part shape={roundRect(6000, 4000, 0)} color="#3f7a34" flat outline={0} />
      {Array.from({ length: 90 }, (_, i) => (
        <Part key={i} shape={cloudShape(160 + r() * 140, 130 + r() * 100, 5, i)} color={["#4f8a3e", "#5a9a46", "#467f38"][i % 3]} shade={0.24} x={(r() - 0.5) * 3200} y={(r() - 0.5) * 1600} z={0.001 + i * 0.0001} />
      ))}
    </X>
  );
};

/** Top-down Aguada Fénix platform with a length ruler. */
const PlatformTop: React.FC<{ k: number; fields?: number }> = ({ k, fields = 0 }) => (
  <X>
    <Part shape={roundRect(1500, 220, 8)} color="#e0cfa8" shade={0.12} />
    <Part shape={roundRect(1440, 160, 6)} color="#d4c294" flat outline={3} z={0.001} />
    {k > 0 ? (
      <X y={180} z={0.01}>
        <Line pts={[[-750, 0], [-750 + 1500 * k, 0]]} width={8} color="#c0392b" />
        <Line pts={[[-750, -24], [-750, 24]]} width={8} color="#c0392b" />
        {k >= 1 ? <Line pts={[[750, -24], [750, 24]]} width={8} color="#c0392b" /> : null}
      </X>
    ) : null}
    {Array.from({ length: Math.round(fields) }, (_, i) => (
      <X key={i} x={-750 + (i + 0.5) * (1500 / 13)} y={-10} z={0.02}>
        <Part shape={roundRect(1500 / 13 - 8, 74, 4)} color="#4f9a3e" flat outline={3} />
        <Line pts={[[0, -37], [0, 37]]} width={2.5} color="#ffffff" z={0.001} />
        <Part shape={ellipse(10, 10)} color="#4f9a3e" flat outline={2.5} z={0.001} />
      </X>
    ))}
  </X>
);

// 148.25 "It's about 1,400 meters long."
export const PlatformLengthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <CanopyTop />
        <PlatformTop k={ramp(t, 148.7, 150.6)} />
      </Stage>
      <Label text="1.4 KM" x={0.5} y={0.28} size={0.08} kind="title" at={sec(start)(150.3)} />
    </AbsoluteFill>
  );
};

// 151.2 "That's longer than 13 football fields."
export const FootballFieldsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <CanopyTop />
        <PlatformTop k={1} fields={ramp(t, 151.4, 152.9) * 13} />
      </Stage>
      <Label text="13 FOOTBALL FIELDS" x={0.5} y={0.28} size={0.06} kind="box" at={sec(start)(152.6)} />
    </AbsoluteFill>
  );
};

// 153.75 "And it was built around 3,000 years ago, with stone tools and human hands."
export const StoneToolsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dig = Math.sin(frame * 0.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-160} ground="#c9b48a">
          <Platform x={600} y={-200} w={1800} h={220} z={-20} />
          <Character {...MAYA_COMMONER(1)} x={-480} y={-860} s={1.85} z={2} look={0.5} expression={{ eyes: "half", mouth: "teeth", brows: -0.4, sweat: true }} pose={{ armF: [0.9 + dig * 0.25, 0.4], armB: [0.7 + dig * 0.2, 0.5], lean: -0.1 + dig * 0.05 }} holdF={<X rot={upright([0.9 + dig * 0.25, 0.4]) - Math.PI / 2 + 0.2} s={0.6}><Shovel x={-120} /></X>} />
          <Carrier x={260 + ((frame * 2.2) % 160)} y={-860} s={1.75} i={2} z={2.1} />
        </JungleSet>
      </Stage>
      <Label text="3,000 YEARS AGO" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(154.9)} />
      <Label text="STONE TOOLS + HANDS" x={0.5} y={0.9} size={0.045} kind="box" at={sec(start)(156.5)} />
    </AbsoluteFill>
  );
};

/** El Mirador: a jungle city of plastered pyramids, La Danta rising highest. */
const MiradorCity: React.FC<{ empty?: number; overgrown?: number }> = ({ empty = 0, overgrown = 0 }) => (
  <>
    <MayaPyramid x={420} y={-140} s={1.0} w={1300} h={420} tiers={6} top={0.5} stairW={0.12} templeW={0} color="#e8dcc4" overgrown={overgrown} z={-24} />
    {[[200, 280, 0.42], [480, 300, 0.5], [760, 280, 0.42]].map(([x, y, s], i) => (
      <MayaPyramid key={i} x={x} y={y - 140} s={s} w={520} h={460} tiers={6} top={0.42} templeW={180} templeH={130} doors={1} comb={i === 1 ? 140 : 90} color={i === 1 ? "#d86a4a" : "#e8dcc4"} overgrown={overgrown} z={-23 + i * 0.01} />
    ))}
    <MayaPyramid x={-640} y={-140} s={0.6} w={700} h={500} tiers={7} top={0.42} templeW={220} templeH={150} doors={3} comb={120} color="#e8d2b0" overgrown={overgrown} z={-24} />
    {[-1100, -900, 1100].map((x) => (
      <MayaHut key={x} x={x} y={-140} w={200} z={-22} />
    ))}
    {empty > 0 ? <Wash width={6000} height={4000} color="#3a2a30" alpha={0.25 * empty} z={30} /> : null}
  </>
);

// 158.95 "A few hundred years later, a city called El Mirador rises in the jungle of northern Guatemala."
export const ElMiradorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 159.2, 161.6, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 140 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-140}>
          <X y={-900 * (1 - rise)}>
            <MiradorCity />
          </X>
          <Jungle y={-200} w={6000} h={240} seed={13} z={-20} />
        </JungleSet>
      </Stage>
      <Label text="EL MIRADOR" sub="NORTHERN GUATEMALA" x={0.22} y={0.1} size={0.065} kind="box" at={sec(start)(161.3)} />
    </AbsoluteFill>
  );
};

// 164.5 "Up to 200,000 people may live there."
export const MiradorPeopleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.round(ramp(t, 164.6, 165.9) * 60);
  const r = rng(5);
  const spots = Array.from({ length: 60 }, () => [(r() - 0.5) * 2400, -360 - r() * 280, r()] as [number, number, number]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-140} ground="#e0d2b4">
          <MiradorCity />
          {spots.slice(0, n).map(([x, y, q], i) => (
            <Character key={i} {...(i % 3 ? MAYA_COMMONER(i) : MAYA_WOMAN(i))} x={x} y={y} s={0.3 + (y + 640) * -0.0004} z={2 - y * 0.0001} facing={q > 0.5 ? 1 : -1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.walk(frame + i * 5, 0.5)} shadow={false} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="200,000 PEOPLE" x={0.5} y={0.1} size={0.07} kind="title" at={sec(start)(165.0)} />
    </AbsoluteFill>
  );
};

/** La Danta: a huge base platform carrying a triad of pyramids. */
const LaDanta: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <MayaPyramid w={1400} h={260} tiers={3} top={0.8} stairW={0.12} templeW={0} color="#e2d6bc" />
    <MayaPyramid y={260} w={1000} h={200} tiers={3} top={0.7} stairW={0.12} templeW={0} color="#e6dac0" z={0.1} />
    <MayaPyramid x={-260} y={460} w={300} h={200} tiers={4} top={0.5} templeW={0} color="#e8dcc4" z={0.2} />
    <MayaPyramid x={260} y={460} w={300} h={200} tiers={4} top={0.5} templeW={0} color="#e8dcc4" z={0.2} />
    <MayaPyramid y={460} w={420} h={300} tiers={5} top={0.42} templeW={140} templeH={110} doors={1} color="#e8dcc4" z={0.21} />
  </X>
);

// 166.5 "Its biggest pyramid, La Danta, is about 70 meters tall."
export const LaDantaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 168.8, 169.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 120 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-420}>
          <LaDanta y={-440} s={0.85} z={-20} />
          <X x={780} y={-440} z={2}>
            <Line pts={[[0, 0], [0, 980 * k]]} width={10} color="#c0392b" />
            <Line pts={[[-30, 0], [30, 0]]} width={10} color="#c0392b" />
            {k >= 1 ? <Line pts={[[-30, 980], [30, 980]]} width={10} color="#c0392b" /> : null}
          </X>
          <Jungle y={-460} w={6000} h={220} seed={14} z={-10} />
        </JungleSet>
      </Stage>
      <Label text="LA DANTA" x={0.22} y={0.1} size={0.06} kind="box" at={sec(start)(167.9)} />
      <Label text="~70 M" x={0.86} y={0.36} size={0.06} kind="title" at={sec(start)(169.4)} />
    </AbsoluteFill>
  );
};

// 170.45 "It's shorter than the Great Pyramid of Egypt, but some say it holds even more stone."
export const VsEgyptShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fill = ramp(t, 173.3, 174.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 80 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper color="#e6d6ae">
          <X x={-480} y={-400} z={1}>
            <Part shape={poly([[-380, 0], [380, 0], [0, 760]])} color="#e0c080" shade={0.24} />
            <Line pts={[[0, 0], [0, 760]]} width={3} color="#c8a868" z={0.001} />
          </X>
          <LaDanta x={420} y={-400} s={0.62} z={1} />
          {fill > 0
            ? Array.from({ length: Math.round(fill * 12) }, (_, i) => (
                <Part key={i} shape={roundRect(70, 40, 6)} color="#b9ae98" shade={0.22} x={180 + (i % 6) * 80} y={-300 + Math.floor(i / 6) * 50} z={2} />
              ))
            : null}
        </Paper>
      </Stage>
      <Label text="GREAT PYRAMID: TALLER" x={0.26} y={0.1} size={0.04} kind="box" at={sec(start)(171.4)} />
      <Label text="LA DANTA: MORE STONE?" x={0.72} y={0.1} size={0.04} kind="box" at={sec(start)(173.6)} />
    </AbsoluteFill>
  );
};

// 175.4 "Then, sometime around AD 150, El Mirador is abandoned."
export const AbandonedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.0), y: 140 }} light={{ dir: [0.6, 0.4] }} vignette={0.7} vignetteColor="#1a1218">
        <JungleSet mood="dusk" horizon={-140} ground="#b8a888">
          <MiradorCity empty={1} overgrown={ramp(t, 176, 179.5) * 0.7} />
        </JungleSet>
      </Stage>
      <Label text="AD 150" x={0.2} y={0.1} size={0.07} kind="box" at={sec(start)(176.8)} />
      <Label text="ABANDONED" x={0.74} y={0.14} size={0.06} kind="stamp" rotate={-6} at={sec(start)(179.1)} />
    </AbsoluteFill>
  );
};

// 180.1 "Why?"
export const WhyShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: 1.1, y: -40 }} light={{ dir: [0.6, 0.4] }} vignette={0.7} bgBlur={6} bg={<JungleSet mood="dusk" horizon={-140}><MiradorCity empty={1} overgrown={0.7} /></JungleSet>}>
        <Character {...SCIENTIST(2)} x={-200} y={-900} s={2.2} z={2} look={0.45} expression={{ eyes: "half", mouth: "wavy", brows: 0.6, gaze: [0.5, 0.5] }} pose={poses.think} />
        <QuestionMark x={340} y={260} s={0.8 * pop(t, 180.2)} rot={0.12} z={3} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 181.05 "One idea is that they cut down too many trees."
export const CutTreesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const swing = Math.max(0, Math.sin(frame * 0.45));
  const fall = ramp(t, 182.4, 183.6, Easing.in(Easing.quad));
  const arm: [number, number] = [2.2 - swing * 1.3, 0.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -80, shake: hitAt(t, 183.6, 0.3) * 6 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-200} ground="#c0a878">
          {[-1200, -900, 900, 1200].map((x) => (
            <Stump key={x} x={x} y={-260} w={110} z={-5} />
          ))}
          <X x={300} y={-560} rot={-fall * 1.4} z={1}>
            <Tree h={1000} kind="green" seed={5} />
          </X>
          <Character {...MAYA_COMMONER(0)} x={-200} y={-880} s={1.9} z={2} look={0.5} expression={{ eyes: "angry", mouth: "teeth", brows: -0.5 }} pose={{ ...poses.idle(frame), armF: arm, armB: [2.0 - swing * 1.2, 0.3] }} holdF={<X rot={Math.PI}><Line pts={[[0, -30], [0, 150]]} width={12} color="#6e4a2c" /><Part shape={blob([[-30, 150], [40, 170], [50, 130], [-20, 120]], 6)} color="#3a3a44" shade={0.3} /></X>} />
        </JungleSet>
      </Stage>
      <Label text="TOO MANY TREES CUT" x={0.7} y={0.1} size={0.05} kind="box" at={sec(start)(182.6)} />
    </AbsoluteFill>
  );
};

// 183.85 "To make the white plaster for their buildings, they burned huge amounts of wood."
export const PlasterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const paint = ramp(t, 184.2, 185.6);
  const brush = Math.sin(frame * 0.5) * 0.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <JungleSet mood="day" horizon={-200} ground="#c0a878">
          <X x={-420} y={-220} z={-4}>
            <MayaPyramid w={900} h={500} tiers={6} top={0.4} templeW={240} templeH={150} color={mixHex("#a89a80", "#f4ead0", paint)} />
          </X>
          <Character {...MAYA_COMMONER(2)} x={-120} y={-860} s={1.6} z={2} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "flat" }} pose={{ ...poses.idle(frame), armF: [1.8 + brush, 0.4] }} holdF={<X rot={upright([1.8 + brush, 0.4])}><Line pts={[[0, -20], [0, 120]]} width={10} color="#6e4a2c" /><Part shape={roundRect(50, 40, 10)} color="#f4f1ea" shade={0.2} y={130} /></X>} />
          <LimeKiln x={520} y={-640} s={1.4} fire={1} z={2} />
          <Smoke x={520} y={-400} w={300} h={900} alpha={0.45} seed={6} z={2.5} />
        </JungleSet>
      </Stage>
      <Label text="WHITE PLASTER" x={0.22} y={0.1} size={0.05} kind="box" at={sec(start)(184.4)} />
      <Label text="BURN WOOD → LIME" x={0.74} y={0.1} size={0.05} kind="box" at={sec(start)(186.3)} />
    </AbsoluteFill>
  );
};

// 188.15 "Without the forest, the good soil washed away."
export const ErosionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wash = ramp(t, 189.2, 190.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65} vignetteColor="#141820">
        <JungleSet mood="storm" horizon={-120} ground="#a88a5a" jungle={false}>
          <Part shape={blob([[-1600, -120], [-800, 200], [0, 320], [700, 160], [1600, -120]], 10)} color={mixHex("#8a7a4a", "#b88a5a", wash)} shade={0.24} z={-25} />
          {[-700, -300, 200, 600].map((x) => (
            <Stump key={x} x={x} y={-120 + (1 - Math.abs(x) / 1600) * 260} w={80} z={-24} />
          ))}
          {[-500, 0, 450].map((x, i) => (
            <Line key={x} pts={[[x, 220 - i * 30], [x + 60, -60], [x + 20, -300 * (0.3 + wash)], [x + 80, -600 * wash]]} smooth width={26 * (0.4 + wash)} color="#8a5a2a" z={-20} />
          ))}
          {Array.from({ length: 40 }, (_, i) => (
            <Line key={`r${i}`} pts={[[((i * 173) % 2400) - 1200, 600 - ((frame * 22 + i * 61) % 1200)], [((i * 173) % 2400) - 1220, 560 - ((frame * 22 + i * 61) % 1200)]]} width={3} color="#c8d4e0" z={5} />
          ))}
          {[-360, 360].map((x, i) => (
            <CornPlant key={x} x={x} y={-560} h={420 * (1 - wash * 0.4)} grow={0.7} seed={i} z={2} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="SOIL WASHED AWAY" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(189.6)} />
    </AbsoluteFill>
  );
};

// 191.15 "Keep that in mind. It won't be the last time a great Maya city empties."
export const KeepInMindShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 160 }} light={{ dir: [0.6, 0.3] }} vignette={0.75} vignetteColor="#1a1218">
        <JungleSet mood="dusk" horizon={-140} ground="#b8a888">
          <MiradorCity empty={1} overgrown={0.8} />
        </JungleSet>
      </Stage>
      <Label text="REMEMBER THIS" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(191.4)} />
    </AbsoluteFill>
  );
};
