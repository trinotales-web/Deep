import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, QuestionMark, Shovel, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  SmallPlane, Airliner, WorldMap, CITY, worldXY, BunkBed, Calendar, HomeComputer, Monitor, Futon, Supercar, Cheque, Banknote, Cash, Box, XMark, Room, Window, Skyline,
  StageSet, Smoke, SpeedLines, LineChart, PalmTree, Sea, Hill, Ground, USFlag, Desk, Sun,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { HomeRoom, CampusSet, Office, RoadSet, ChipsTable, Paper, SkyBack, Outdoors, DashArrow, SeaSet } from "./sets";
import { ELON_YOUNG, ELON_ZIP2, ELON_SUIT, ERROL, KIMBAL, THIEL, SUIT, BACKPACKER, PERSON, MAYE } from "./cast";
import { upright } from "./actA";
import { MarketWall, StockLine, MARKET_GREEN, MARKET_RED } from "../../kit/env/market";

// Emerald myth, emigration (1989), university, Zip2 (1995–99), the McLaren, the rule.

/** Cut emerald. */
const Gem: React.FC<{ x?: number; y?: number; s?: number; z?: number; rot?: number }> = ({ x = 0, y = 0, s = 1, z = 0, rot = 0 }) => (
  <X x={x} y={y} s={s} z={z} rot={rot}>
    <Part shape={poly([[-30, 0], [-18, 26], [18, 26], [30, 0], [0, -34]])} color="#2fb06a" shade={0.25} outline={4} />
    <Part shape={poly([[-18, 26], [0, 10], [18, 26]])} color="#7ae0a8" flat outline={2.5} z={0.001} />
  </X>
);

/** A hillside mine entrance with timber frame, rails and a cart of glowing emeralds. */
const EmeraldMine: React.FC<{ frame: number; glow?: number }> = ({ frame, glow = 1 }) => (
  <X>
    <Part shape={blob([[-1400, 0], [-1100, 520], [-500, 820], [200, 860], [900, 640], [1400, 260], [1500, 0]], 10)} color="#9a7a5a" shade={0.2} z={-0.01} />
    <Part shape={roundPoly4([[-260, 0], [260, 0], [220, 420], [-220, 420]])} color="#2a1e18" flat outline={7} />
    <Part shape={roundRect(60, 460, 6)} color="#8a5a32" shade={0.2} x={-250} y={230} z={0.001} />
    <Part shape={roundRect(60, 460, 6)} color="#8a5a32" shade={0.2} x={250} y={230} z={0.001} />
    <Part shape={roundRect(640, 70, 8)} color="#8a5a32" shade={0.2} y={450} z={0.002} />
    <Line pts={[[-180, 0], [-600, -400]]} width={10} color="#5a5a62" z={0.003} />
    <Line pts={[[180, 0], [-60, -400]]} width={10} color="#5a5a62" z={0.003} />
    <X x={-250} y={-260} z={0.01}>
      <Part shape={roundPoly4([[-170, 0], [170, 0], [200, 160], [-200, 160]])} color="#6a6e76" shade={0.2} />
      {[-60, 60].map((x) => (
        <Part key={x} shape={circle(34)} color="#2a2a30" shade={0.2} x={x * 2} y={-6} z={0.002} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <Gem key={i} x={-140 + (i % 5) * 70} y={170 + Math.floor(i / 5) * 40} s={1.1} rot={i * 0.4} z={0.001 + i * 0.0001} />
      ))}
      <Glow rx={260} y={190} color="#5af0a0" alpha={0.4 * glow * (0.8 + 0.2 * Math.sin(frame * 0.2))} additive z={0.01} />
    </X>
  </X>
);
const roundPoly4 = (pts: [number, number][]) => poly(pts);

/** Suitcase (held by the handle at the origin). */
const Suitcase: React.FC<{ rot?: number; s?: number }> = ({ rot = 0, s = 1 }) => (
  <X rot={rot} s={s}>
    <Line pts={[[-24, 0], [-24, -20], [24, -20], [24, 0]]} width={8} color="#3a2a22" />
    <Part shape={roundRect(180, 130, 14)} color="#8a3a2a" shade={0.22} y={-86} z={0.001} />
    <Part shape={roundRect(180, 14, 4)} color="#5a2a1a" flat outline={0} y={-86} z={0.002} />
  </X>
);

/** Stack of newspapers. */
const Newspapers: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    {[0, 1, 2, 3].map((i) => (
      <X key={i} y={i * 24} rot={(i % 2 ? 1 : -1) * 0.03} z={i * 0.001}>
        <Part shape={roundRect(320, 26, 4)} color="#efe9dc" shade={0.12} />
      </X>
    ))}
    <X y={110} z={0.01}>
      <Part shape={roundRect(320, 220, 6)} color="#f4efe4" shade={0.1} y={110} />
      <Part shape={roundRect(260, 30, 4)} color="#2a2a30" flat outline={0} y={190} z={0.001} />
      {[140, 110, 80, 50].map((yy) => (
        <Part key={yy} shape={roundRect(260, 10, 4)} color="#a8a090" flat outline={0} y={yy} z={0.001} />
      ))}
    </X>
  </X>
);

/** A city map with pins (Zip2 screen). Screen space ±w/2. */
const CityMap: React.FC<{ w?: number; h?: number; frame: number }> = ({ w = 340, h = 240, frame }) => (
  <X>
    <Part shape={roundRect(w, h, 4)} color="#e8e2c8" flat outline={0} />
    {[-0.3, 0, 0.3].map((k) => (
      <Line key={`v${k}`} pts={[[k * w, -h / 2], [k * w, h / 2]]} width={8} color="#f8f4ea" z={0.001} />
    ))}
    {[-0.25, 0.15].map((k) => (
      <Line key={`h${k}`} pts={[[-w / 2, k * h], [w / 2, k * h]]} width={8} color="#f8f4ea" z={0.001} />
    ))}
    <Part shape={roundRect(w * 0.2, h * 0.25, 4)} color="#a8d08a" flat outline={0} x={-w * 0.15} y={h * 0.3} z={0.0005} />
    {[[-0.36, 0.1], [0.16, -0.06], [0.4, 0.3], [-0.06, -0.36]].map(([px, py], i) => (
      <X key={i} x={px * w} y={py * h} s={0.5 * Math.min(1, Math.max(0, (frame - i * 8) / 6))} z={0.002}>
        <Part shape={blob([[0, 0], [-16, 28], [-14, 44], [0, 54], [14, 44], [16, 28]], 8)} color="#d8322f" shade={0.2} outline={3} />
      </X>
    ))}
  </X>
);

// ───────────────────────── the emerald myth ─────────────────────────

// 154.56 "Now, you might have heard that Elon grew up rich, thanks to his father's emerald mine."
export const RichMythShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.9), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SkyBack mood="day" horizon={-300} />
        <X y={-300} z={-20}>
          <EmeraldMine frame={frame} />
        </X>
        <Ground w={6000} h={2000} y={-300} color="#b89a6a" far="#c4a676" pebbles={10} tufts={6} seed={3} z={-30} />
        <Character {...ERROL} x={620} y={-520} s={1.4} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.point(frame)} z={2} />
      </Stage>
      <Label text="THE STORY YOU'VE HEARD" x={0.1} y={0.1} size={0.05} kind="box" at={at(154.9)} />
      <Label text="AN EMERALD MINE?" x={0.5} y={0.86} size={0.06} kind="box" at={at(158.1)} />
    </AbsoluteFill>
  );
};

// 159.26 "His biographer says there was no mine."
export const NoMineShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const hit = hitAt(t, 160.85, 0.35);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: 160, shake: hit * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SkyBack mood="day" horizon={-300} />
        <X y={-300} z={-20}>
          <EmeraldMine frame={frame} glow={t > 160.85 ? 0.2 : 1} />
        </X>
        <Ground w={6000} h={2000} y={-300} color="#b89a6a" far="#c4a676" pebbles={10} tufts={6} seed={3} z={-30} />
        <XMark x={-100} y={60} size={720 * pop(t, 160.85)} color="#d8322f" z={5} />
      </Stage>
      <Label text="HIS BIOGRAPHER SAYS" x={0.1} y={0.1} size={0.05} kind="box" at={at(159.5)} />
      <Label text="NO MINE" x={0.5} y={0.86} size={0.08} kind="stamp" at={at(160.9)} />
    </AbsoluteFill>
  );
};

// 161.84 "In the 1980s, his father traded a small plane for some emeralds,"
export const PlaneTradeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 164.4, 165.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Outdoors mood="day" horizon={-300} ground="#c8b07a" />
        <SmallPlane x={-480} y={-460} s={1.5} prop={frame * 0.1} z={1} />
        <Character {...ERROL} x={120} y={-560} s={1.35} facing={1} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.holdOut} z={3} />
        <Character {...SUIT(3)} x={720} y={-560} s={1.35} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.holdOut} z={3} />
        {Array.from({ length: 5 }, (_, i) => (
          <Gem key={i} x={interpolate(k, [0, 1], [620, 260]) + (i % 3) * 30} y={-150 + Math.floor(i / 3) * 30 + Math.sin(k * Math.PI) * 120} s={1.1} rot={i} z={4} />
        ))}
        <DashArrow from={[60, 260]} to={[-320, 120]} k={ramp(t, 164.0, 164.6)} z={5} />
      </Stage>
      <Label text="1980s" x={0.1} y={0.1} size={0.055} kind="box" at={at(162.0)} />
      <Label text="PLANE → EMERALDS" x={0.9} y={0.1} size={0.05} kind="box" at={at(165.0)} />
    </AbsoluteFill>
  );
};

// 166.10 "and that business later fell apart."
export const FellApartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const cx = 120;
  const cy = 110;
  const k = ramp(t, 166.3, 167.6);
  const title = sc(230, 190 + 240, zoom, cx, cy);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cx, y: cy }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        {/* 1980s: the "screen" is a chalkboard in a wooden frame */}
        <MarketWall rows={0} wall="#4a5a4e" screen="#25392d" bezel="#7a5232" glow={MARKET_RED}>
          <StockLine w={1180} h={400} y={-10} values={[0.8, 0.85, 0.78, 0.7, 0.5, 0.35, 0.18, 0.06]} k={k} color={MARKET_RED} gridColor="#2f4637" seed={9} />
        </MarketWall>
      </Stage>
      <Label text="THE EMERALD BUSINESS" x={title.x} y={title.y} size={0.085} kind="hand" italic pin at={at(166.2)} />
      <Label text="FELL APART" x={0.5} y={0.86} size={0.065} kind="stamp" at={at(167.1)} />
    </AbsoluteFill>
  );
};

// 168.10 "When Elon leaves South Africa at 17, he has about 4,000 dollars."
export const Leaves17Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const arm: [number, number] = [0.1, 0.05];
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }}
        light={{ dir: [-0.6, 0.6] }}
        vignette={0.6}
        bgBlur={5}
        bg={
          <>
            <Room wall="#c9d4dc" floor="#8f969e" y={-420} boards={false} z={-40}>
              <Window x={0} y={1000} w={1800} h={760} />
            </Room>
            <Airliner x={160} y={360} s={0.9} z={-30} />
          </>
        }
      >
        <Character {...ELON_YOUNG} x={-220} y={-640} s={2.0} look={0.6} expression={{ eyes: "open", mouth: "smile", brows: 0.2 }} pose={{ ...poses.idle(frame, 2), armF: [2.2 + Math.sin(frame * 0.3) * 0.15, 0.4], armB: arm }} holdB={<Suitcase s={1.2} rot={upright(arm)} />} />
      </DepthStage>
      <Label text="AGE 17" x={0.9} y={0.1} size={0.055} kind="box" at={at(169.75)} />
      <Label text="ABOUT $4,000" x={0.9} y={0.86} size={0.065} kind="stamp" at={at(171.26)} />
    </AbsoluteFill>
  );
};

// 172.99 "It's 1989, and he flies to Canada, where his mother was born."
export const CanadaFlightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const ppd = interpolate(frame, [0, dur], [5.4, 6.0]);
  const center: [number, number] = [-30, 18];
  const [mx, my] = worldXY(CITY.montreal[0], CITY.montreal[1], ppd, center);
  const p = sc(mx, my + 120);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <WorldMap
          ppd={ppd}
          center={center}
          w={2600}
          h={1600}
          tint={{ Canada: "#c8462f", "South Africa": "#e2a04a" }}
          tintK={ramp(t, 175.0, 175.5)}
          routes={[{ from: CITY.pretoria, to: CITY.montreal, k: ramp(t, 173.4, 175.3), plane: true, arc: 0.22 }]}
          pins={[{ at: CITY.pretoria, s: 1 }, { at: CITY.montreal, s: pop(t, 175.2), glow: true }]}
        />
      </Stage>
      <Label text="1989" x={0.1} y={0.1} size={0.06} kind="box" at={at(173.2)} />
      <Label text="CANADA" sub="WHERE HIS MOTHER WAS BORN" x={p.x} y={p.y - 0.06} size={0.05} kind="box" pin at={at(175.16)} />
    </AbsoluteFill>
  );
};

// 177.39 "He sleeps in a youth hostel, sharing a room with five strangers,"
export const HostelShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: 120 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Room wall="#c8b89a" floor="#8a6a4a" y={-420} z={-40}>
          <Window x={0} y={1000} w={480} h={480} night />
        </Room>
        <BunkBed x={-700} y={-420} w={620} z={-5} />
        <BunkBed x={700} y={-420} w={620} z={-5} />
        <X x={-700} y={-420 + 380 + 60} rot={-1.5} z={-4.5}>
          <Character {...BACKPACKER(0)} s={0.8} expression={{ eyes: "closed", mouth: "open" }} pose={poses.idle(frame, 1)} shadow={false} />
        </X>
        <X x={700} y={-420 + 380 + 60} rot={-1.5} z={-4.5}>
          <Character {...BACKPACKER(1)} s={0.8} expression={{ eyes: "closed", mouth: "flat" }} pose={poses.idle(frame, 2)} shadow={false} />
        </X>
        {[-1150, 1150].map((x, i) => (
          <Character key={x} {...BACKPACKER(i + 2)} x={x} y={-560} s={1.25} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i + 4)} z={2} />
        ))}
        <Character {...BACKPACKER(4)} x={360} y={-620} s={1.3} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "flat" }} pose={poses.idle(frame, 7)} z={2} />
        <Character {...ELON_YOUNG} x={-220} y={-620} s={1.35} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: 0.4 }} pose={poses.idle(frame, 3)} z={2.1} />
      </Stage>
      <Label text="YOUTH HOSTEL" x={0.1} y={0.1} size={0.05} kind="box" at={at(178.0)} />
      <Label text="5 STRANGERS" x={0.9} y={0.1} size={0.05} kind="box" at={at(179.75)} />
    </AbsoluteFill>
  );
};

// 180.77 "and takes odd jobs."
export const OddJobsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const sw = Math.sin(frame * 0.35);
  const arm: [number, number] = [0.75 + sw * 0.3, 0.7];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.2, 1.28), y: -40 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#1a0e08">
        <Room wall="#6a4a3a" floor="#3a2a22" y={-420} boards={false} z={-40} />
        <Glow x={500} y={-100} rx={600} ry={400} color="#ff9a4a" alpha={0.35} additive z={-30} />
        <Part shape={roundRect(500, 520, 30)} color="#4a4a52" shade={0.2} x={600} y={-160} z={-10} />
        <Part shape={roundRect(200, 140, 20)} color="#ff7a2a" flat outline={6} x={600} y={-200} z={-9} />
        <Part shape={ellipse(260, 60)} color="#2a2a30" flat outline={0} x={-300} y={-450} z={-8} />
        <Character {...ELON_YOUNG} x={-80} y={-560} s={1.6} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: 0.3, sweat: true }} pose={{ ...poses.idle(frame, 2), armF: arm, armB: [arm[0] - 0.2, arm[1] + 0.2], lean: -0.1 - sw * 0.05 }} holdF={<Shovel rot={upright(arm) - 0.85} s={0.9} />} z={2} />
      </Stage>
      <Label text="ODD JOBS" x={0.1} y={0.1} size={0.055} kind="box" at={sec(start)(181.15)} />
    </AbsoluteFill>
  );
};

// 182.16 "He studies at Queen's University in Canada."
export const QueensShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.72), y: 160 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <CampusSet kind="stone" horizon={-360}>
          <Character {...ELON_YOUNG} x={interpolate(frame, [0, dur], [-520, -220])} y={-760} s={1.75} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.walk(frame, 1.0)} z={2} />
          <Character {...PERSON(1)} x={620} y={-800} s={1.6} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.walk(frame, 0.9, 2)} z={2} />
        </CampusSet>
      </Stage>
      <Label text="QUEEN'S UNIVERSITY" sub="CANADA" x={0.1} y={0.1} size={0.055} kind="box" at={at(182.75)} />
    </AbsoluteFill>
  );
};

// 184.62 "Then he moves to the University of Pennsylvania in the US, to study physics and economics."
export const PennShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const board = t > 188.0;
  return (
    <AbsoluteFill>
      {!board ? (
        <Stage camera={{ zoom: push(frame, dur, 0.66, 0.74), y: 160 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
          <CampusSet kind="brick" horizon={-360}>
            <USFlag x={1250} y={700} w={340} z={-20} />
            <Character {...ELON_YOUNG} x={-300} y={-780} s={1.8} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, 3)} z={2} />
          </CampusSet>
        </Stage>
      ) : (
        <Stage camera={{ zoom: 1.0, y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
          <Room wall="#c8b89a" floor="#8a6a4a" y={-460} z={-40} />
          <Part shape={roundRect(1700, 820, 16)} color="#6e4a2c" shade={0.15} y={100} z={-20} />
          <Part shape={roundRect(1620, 740, 8)} color="#2f4a3a" flat outline={0} y={100} z={-19} />
          <Line pts={[[-680, 320], [-520, 160], [-380, 320]]} width={8} color="#f4f1ea" z={-18} />
          <Line pts={[[-280, 260], [-120, 260]]} width={8} color="#f4f1ea" z={-18} />
          <Line pts={[[120, 340], [260, 120], [400, 260], [560, 60], [680, 160]]} width={8} color="#f4f1ea" z={-18} />
          <Line pts={[[-700, -120], [-300, -120]]} width={8} color="#f4f1ea" z={-18} />
          <Part shape={circle(70)} color="#2f4a3a" flat outline={0} x={300} y={-150} z={-18} />
          <Line pts={Array.from({ length: 21 }, (_, i) => [300 + Math.cos((i / 20) * 6.283) * 70, -150 + Math.sin((i / 20) * 6.283) * 70] as [number, number])} width={8} color="#f4f1ea" z={-17} />
          <Character {...ELON_YOUNG} x={-560} y={-700} s={1.7} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.6, 0.4] }} pose={poses.point(frame)} z={2} />
        </Stage>
      )}
      <Label text="UNIVERSITY OF PENNSYLVANIA" sub="USA" x={0.1} y={0.1} size={0.05} kind="box" at={at(185.6)} until={board ? undefined : undefined} />
      <Label text="PHYSICS + ECONOMICS" x={0.9} y={0.86} size={0.055} kind="box" at={at(188.4)} />
    </AbsoluteFill>
  );
};

// 190.04 "In 1995, he gets into Stanford to do a PhD."
export const StanfordShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.72), y: 160 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <CampusSet kind="sandstone" horizon={-360}>
          {[-1150, 1150].map((x) => (
            <PalmTree key={x} x={x} y={-380} h={1000} z={-25} />
          ))}
          <Character {...ELON_YOUNG} x={-120} y={-780} s={1.85} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={2} />
        </CampusSet>
      </Stage>
      <Label text="STANFORD, 1995" x={0.1} y={0.1} size={0.055} kind="box" at={at(190.2)} />
      <Label text="PhD" x={0.9} y={0.1} size={0.06} kind="box" at={at(192.71)} />
    </AbsoluteFill>
  );
};

// 193.75 "He quits after two days."
export const QuitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <CampusSet kind="sandstone" horizon={-360}>
          <Calendar x={-600} y={160} s={1.5} crossed={t > 194.6 ? 2 : 1} z={1} />
          <Character {...ELON_YOUNG} x={interpolate(t, [193.6, 195.4], [200, 620])} y={-640} s={1.4} look={0.6} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.walk(frame, 1.2)} z={2} />
        </CampusSet>
      </Stage>
      <Label text="QUITS AFTER 2 DAYS" x={0.5} y={0.86} size={0.065} kind="stamp" at={sec(start)(194.6)} />
    </AbsoluteFill>
  );
};

// 195.53 "The internet is exploding, and he wants to be part of it."
export const InternetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const burst = ramp(t, 195.9, 196.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Part shape={roundRect(4000, 3000, 0)} color="#1a2238" flat outline={0} z={-41} />
        <Glow rx={900} ry={600} y={80} color="#4a8adf" alpha={0.35 * burst} additive z={-40} />
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const d = 200 + burst * 620 + (i % 3) * 60;
          const icon = i % 3;
          return (
            <X key={i} x={Math.cos(a) * d} y={120 + Math.sin(a) * d * 0.6} s={burst} rot={Math.sin(frame * 0.05 + i) * 0.2} z={1}>
              {icon === 0 ? (
                <>
                  <Part shape={circle(46)} color="#3a8adf" shade={0.2} />
                  <Line pts={[[-46, 0], [46, 0]]} width={4} color="#bfe0ff" z={0.001} />
                  <Part shape={ellipse(22, 46)} color="#3a8adf" flat outline={4} z={0.0005} />
                </>
              ) : icon === 1 ? (
                <Part shape={roundRect(90, 70, 8)} color="#e8eef4" shade={0.15} />
              ) : (
                <Part shape={roundRect(80, 56, 8)} color="#f2cc5a" shade={0.15} />
              )}
            </X>
          );
        })}
        <X y={-440} z={2}>
          <HomeComputer s={0.9} />
        </X>
        <Character {...ELON_YOUNG} x={-560} y={-620} s={1.5} look={0.6} expression={{ eyes: "wide", mouth: "grin", gaze: [0.6, 0.3] }} pose={poses.armsUp(frame)} z={3} />
      </Stage>
      <Label text="THE INTERNET BOOM" x={0.5} y={0.1} size={0.055} kind="box" at={at(196.1)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Zip2 ─────────────────────────

// 198.78 "With his younger brother Kimbal, he starts a company called Zip2."
export const KimbalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="1995" deskX={760}>
          <Character {...KIMBAL} x={-560} y={-640} s={1.7} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.idle(frame, 1)} z={2} />
          <Character {...ELON_ZIP2} x={-40} y={-640} s={1.75} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.talk(frame, 2)} talking z={2} />
        </Office>
      </Stage>
      <Label text="KIMBAL MUSK" sub="YOUNGER BROTHER" x={0.1} y={0.1} size={0.05} kind="box" at={at(199.5)} />
      <Label text="ZIP2" sub="1995" x={0.9} y={0.1} size={0.07} kind="box" at={at(201.7)} />
    </AbsoluteFill>
  );
};

// 202.80 "It puts maps and business listings online for newspapers."
export const Zip2MapsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper>
          <X x={-260} y={-460} s={1.3}>
            <HomeComputer screen="#e8e2c8">
              <CityMap frame={frame} />
            </HomeComputer>
          </X>
          <Newspapers x={560} y={-300} s={1.2} z={2} />
        </Paper>
      </Stage>
      <Label text="MAPS + LISTINGS ONLINE" x={0.1} y={0.1} size={0.05} kind="box" at={at(203.2)} />
      <Label text="FOR NEWSPAPERS" x={0.9} y={0.86} size={0.05} kind="box" at={at(205.3)} />
    </AbsoluteFill>
  );
};

// 206.38 "Money is so tight that Elon lives in the office…"
export const OfficeLifeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -120 }} light={{ dir: [0.6, 0.5] }} vignette={0.75} vignetteColor="#0a0e18">
        <Office era="1995" night deskX={420}>
          <Futon x={-520} y={-470} w={700} z={1} />
          <X x={-640} y={-300} rot={-1.5} z={1.5}>
            <Character {...ELON_ZIP2} s={0.95} expression={{ eyes: "closed", mouth: "open" }} pose={poses.idle(frame, 1)} shadow={false} />
          </X>
          <Part shape={roundRect(560, 90, 30)} color="#7a8ab0" shade={0.2} x={-420} y={-330} z={1.6} />
        </Office>
      </Stage>
      <Label text="LIVES IN THE OFFICE" x={0.1} y={0.1} size={0.05} kind="box" at={at(207.8)} />
    </AbsoluteFill>
  );
};

// 209.17 "…and showers at the local YMCA."
export const YmcaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.75, 0.8);
  const p = sc(0, 690, zoom, 0, 160);
  const arm: [number, number] = [0.3, 2.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 160 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <SkyBack mood="dawn" horizon={-360} />
        <X y={-360} z={-30}>
          <Part shape={roundRect(2200, 1200, 6)} color="#c9b8a0" shade={0.18} y={600} />
          {[-700, -350, 350, 700].map((x) =>
            [350, 750].map((y) => <Part key={`${x}${y}`} shape={roundRect(200, 220, 6)} color="#6f9ac2" flat outline={5} x={x} y={y} z={0.001} />),
          )}
          <Part shape={roundRect(260, 380, 10)} color="#6e4a2c" shade={0.2} y={190} z={0.001} />
          <Part shape={roundRect(700, 170, 10)} color="#2a4a8a" flat outline={6} y={1050} z={0.002} />
        </X>
        <Ground w={6000} h={2000} y={-360} color="#a8a49a" far="#b4b0a6" pebbles={4} tufts={0} seed={2} z={-25} />
        <Character {...ELON_ZIP2} x={interpolate(frame, [0, dur], [-760, -420])} y={-700} s={1.75} look={0.6} expression={{ eyes: "half", mouth: "flat" }} pose={{ ...poses.walk(frame, 0.9), armF: arm }} holdF={<Part shape={roundRect(60, 200, 14)} color="#f4f1ea" shade={0.15} y={-60} />} z={2} />
      </Stage>
      <Label text="YMCA" x={p.x} y={p.y} size={0.07} pin at={at(209.5)} />
      <Label text="SHOWERS AT THE YMCA" x={0.9} y={0.86} size={0.05} kind="box" at={at(209.9)} />
    </AbsoluteFill>
  );
};

// 211.50 "Then, in 1999, the computer giant Compaq buys Zip2 for more than 300 million dollars."
export const CompaqShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.95, 1.05);
  const cp = sc(-60, 262, zoom, 0, 40);
  const shake = t > 214.8 && t < 215.6;
  const armE: [number, number] = [1.3, 0.25 + (shake ? Math.sin(frame * 1.2) * 0.12 : 0)];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2000" desk={false}>
          <X x={0} y={260} s={pop(t, 216.4) * 0.75} z={-5}>
            <Cheque w={1100} />
          </X>
          <Character {...ELON_ZIP2} x={-380} y={-620} s={1.6} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.idle(frame, 1), armF: armE }} z={2} />
          <Character {...SUIT(0)} x={380} y={-620} s={1.6} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={{ ...poses.idle(frame, 3), armF: armE }} z={2} />
        </Office>
      </Stage>
      <Label text="1999" x={0.1} y={0.1} size={0.055} kind="box" at={at(211.9)} />
      <Label text="COMPAQ" sub="COMPUTER GIANT" x={0.9} y={0.1} size={0.055} kind="box" at={at(214.1)} />
      <Label text="$300+ MILLION" x={cp.x} y={cp.y} size={0.06} pin kind="ink" at={at(216.6)} />
    </AbsoluteFill>
  );
};

// 218.34 "Elon's share? 22 million. He's 27 years old."
export const ShareShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2000" desk={false}>
          {Array.from({ length: 14 }, (_, i) => {
            const y = 700 - (((frame * (6 + (i % 4))) + i * 97) % 1500);
            return <Banknote key={i} x={-900 + i * 140} y={y} rot={frame * 0.05 + i} s={0.7} z={4} />;
          })}
          <Character {...ELON_ZIP2} x={0} y={-640} s={2.0} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={2} />
        </Office>
      </Stage>
      <Label text="ELON'S SHARE" x={0.1} y={0.1} size={0.05} kind="box" at={at(218.5)} />
      <Label text="$22 MILLION" x={0.5} y={0.86} size={0.08} kind="stamp" at={at(219.62)} />
      <Label text="AGE 27" x={0.9} y={0.1} size={0.055} kind="box" at={at(220.94)} />
    </AbsoluteFill>
  );
};

// 222.69 "So what does he buy?"
export const WhatBuyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<Office era="2000" desk={false} />}>
        <Character {...ELON_ZIP2} x={-260} y={-720} s={2.4} look={0.55} expression={{ eyes: "open", mouth: "smirk", gaze: [0.6, 0.6] }} pose={poses.think} />
        <QuestionMark x={420} y={200} s={1.3 * pop(t, 222.9)} z={3} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 223.91 "A McLaren F1, one of the fastest cars on Earth, for about a million dollars."
export const McLarenShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7}>
        <StageSet curtain="#2a2a32" spots={1} floor="#3a3a42" y={-420} />
        <Supercar x={330} y={-470} s={1.45} z={2} />
        <Character {...ELON_ZIP2} x={-470} y={-560} s={1.55} look={0.6} expression={{ eyes: "wide", mouth: "grin", gaze: [0.7, -0.2] }} pose={poses.point(frame)} z={3} />
      </Stage>
      <Label text="McLAREN F1" sub="ONE OF THE FASTEST CARS ON EARTH" x={0.9} y={0.1} size={0.055} kind="box" at={at(224.0)} />
      <Label text="ABOUT $1 MILLION" x={0.9} y={0.86} size={0.06} kind="stamp" at={at(227.5)} />
    </AbsoluteFill>
  );
};

/** The McLaren driving with two heads in the cabin. */
const CarWithTwo: React.FC<{ frame: number; wreck?: number }> = ({ frame, wreck = 0 }) => (
  <X>
    <X x={-60} y={150} z={-0.7}>
      <Character {...THIEL} x={-60} y={-300 * 0.5 + 6} s={0.48} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, 2)} shadow={false} />
      <Character {...ELON_ZIP2} x={60} y={-300 * 0.5 + 6} s={0.48} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.idle(frame, 3)} shadow={false} />
    </X>
    <Supercar spin={frame * 0.6} wreck={wreck} shadow={false} glass={0.45} />
  </X>
);

// 228.71 "A year later, he's driving it with a friend named Peter Thiel."
export const ThielRideShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <X x={-((frame * 40) % 400)}>
          <RoadSet horizon={-160} />
        </X>
        <X x={0} y={-470} s={1.4} z={5}>
          <CarWithTwo frame={frame} />
        </X>
        <SpeedLines x={-700} y={-300} w={900} h={400} n={8} z={4} />
      </Stage>
      <Label text="A YEAR LATER" x={0.1} y={0.1} size={0.05} kind="box" at={at(228.8)} />
      <Label text="PETER THIEL" sub="FRIEND" x={0.9} y={0.1} size={0.055} kind="box" at={at(231.36)} />
    </AbsoluteFill>
  );
};

/** Inside the car: windscreen frame, dash and steering wheel; two people. */
const CarInterior: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const floored = t > 236.75;
  const arm: [number, number] = [1.25, 0.55];
  return (
    <>
      <Part shape={roundRect(4000, 3000, 0)} color="#8ec9ee" flat outline={0} z={-41} />
      <X x={floored ? -((frame * 160) % 800) : -((frame * 30) % 800)} z={-40}>
        {[-1600, -800, 0, 800, 1600, 2400].map((x) => (
          <Part key={x} shape={blob([[-400, -200], [-200, 120], [100, 160], [400, -200]], 6)} color="#8ab45a" flat outline={4} x={x} y={-200} />
        ))}
      </X>
      <Part shape={roundRect(4000, 900, 0)} color="#2a2a32" flat outline={6} y={-900} z={-10} />
      <Line pts={[[-1300, 900], [-900, -400]]} width={60} color="#3a3a42" z={-9} />
      <Line pts={[[1300, 900], [900, -400]]} width={60} color="#3a3a42" z={-9} />
      <Character {...THIEL} x={-420} y={-760} s={2.0} look={0.6} talking={t < 234.4} expression={{ eyes: floored ? "wide" : "open", mouth: floored ? "o" : "open", brows: floored ? 0.8 : 0.2 }} pose={floored ? poses.scared(frame) : poses.talk(frame, 2)} z={-5} />
      <Character {...ELON_ZIP2} x={420} y={-760} s={2.0} facing={-1} look={0.4} talking={t > 235.7 && t < 236.4} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.idle(frame, 3), armF: arm, armB: [1.1, 0.7] }} z={-5} />
      <X x={600} y={-560} z={-2}>
        <Part shape={ellipse(170, 170)} color="#2a2a30" flat outline={0} opacity={0} />
        <Line pts={Array.from({ length: 33 }, (_, i) => [Math.cos((i / 32) * 6.283) * 160, Math.sin((i / 32) * 6.283) * 160] as [number, number])} width={26} color="#2a2a30" />
        <Line pts={[[-150, 0], [150, 0]]} width={20} color="#2a2a30" />
      </X>
    </>
  );
};

// 232.47 "Thiel asks what the car can do. Elon says, 'Watch this.' He floors it."
export const ThielAsksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const floored = t > 236.75;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0, shake: floored ? 6 : 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <CarInterior frame={frame} t={t} />
        {floored ? <SpeedLines y={300} w={2200} h={700} n={14} z={1} /> : null}
      </Stage>
      <Label text="“WATCH THIS.”" x={0.9} y={0.1} size={0.06} kind="box" at={at(235.74)} />
    </AbsoluteFill>
  );
};

/** A dirt bank beside the road. */
const Embankment: React.FC<{ x: number; y: number; z?: number }> = ({ x, y, z = 0 }) => (
  <X x={x} y={y} z={z}>
    <Part shape={blob([[-420, 0], [-200, 200], [100, 260], [420, 120], [520, 0]], 8)} color="#9a7a4a" shade={0.2} />
    {[-200, 0, 200].map((xx) => (
      <Line key={xx} pts={[[xx, 120], [xx + 20, 150]]} width={6} color="#6a8a3a" z={0.001} />
    ))}
  </X>
);

// 237.66 "The car spins and hits a bank of earth."
export const SpinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 237.7, 238.65, Easing.in(Easing.quad));
  const hit = hitAt(t, 238.65, 0.4);
  const x = interpolate(k, [0, 1], [-700, 260]);
  const rot = t < 238.65 ? Math.sin(t * 9) * 0.25 * k : -0.35;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: -40, shake: hit * 12 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <RoadSet horizon={-160}>
          <Embankment x={760} y={-470} z={4} />
          <X x={x} y={-470} rot={rot} sx={t < 238.2 ? 1 : -1} z={3}>
            <CarWithTwo frame={frame} />
          </X>
          {t > 238.65 ? <Smoke x={560} y={-420} w={300} h={500} alpha={0.5} z={5} /> : null}
        </RoadSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 239.81 "It flies into the air and lands back on the road, wrecked."
export const FlyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 239.8, 241.3, Easing.linear);
  const hit = hitAt(t, 241.3, 0.45);
  const x = interpolate(k, [0, 1], [-600, 300]);
  const y = -470 + Math.sin(k * Math.PI) * 620;
  const rot = k * Math.PI * 2 * (t < 241.3 ? 1 : 1);
  const wreck = ramp(t, 241.3, 242.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 60, shake: hit * 14 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <RoadSet horizon={-160}>
          <X x={x} y={y} rot={t < 241.3 ? rot : 0.06} z={3}>
            <Supercar s={1.3} spin={frame * 0.5} wreck={wreck} shadow={t >= 241.3} />
          </X>
          {t > 241.3 ? <Smoke x={300} y={-420} w={360} h={600} alpha={0.55} z={5} /> : null}
        </RoadSet>
      </Stage>
      <Label text="WRECKED" x={0.5} y={0.86} size={0.07} kind="stamp" at={sec(start)(242.35)} />
    </AbsoluteFill>
  );
};

// 243.06 "Nobody's hurt. And the insurance? There isn't any."
export const NobodyHurtShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <RoadSet horizon={-160}>
          <Supercar x={340} y={-500} s={1.3} wreck={1} z={2} />
          <Smoke x={340} y={-420} w={300} h={600} alpha={0.45} z={3} />
          <Character {...THIEL} x={-700} y={-560} s={1.4} look={0.6} expression={{ eyes: "wide", mouth: "wavy", brows: 0.6 }} pose={poses.idle(frame, 2)} z={4} />
          <Character {...ELON_ZIP2} x={-330} y={-560} s={1.4} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "wavy", brows: 0.7, sweat: true }} pose={poses.shrug(Math.max(0, (frame - 30) / 30))} z={4} />
        </RoadSet>
      </Stage>
      <Label text="NOBODY HURT" x={0.1} y={0.1} size={0.055} kind="box" at={at(243.2)} />
      <Label text="NO INSURANCE" x={0.5} y={0.86} size={0.08} kind="stamp" at={at(245.4)} />
    </AbsoluteFill>
  );
};

// 246.53 "But here's the strange part. Most people with 22 million dollars would relax."
export const StrangePartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <SeaSet mood="day" horizon={-60}>
          <Part shape={roundRect(6000, 900, 0)} color="#ead39a" flat outline={5} y={-560} z={-20} />
          <PalmTree x={-900} y={-500} h={900} z={-10} />
          <PalmTree x={900} y={-500} h={860} lean={-0.1} z={-10} />
          <Line pts={[[-820, 200], [-420, -60], [0, -120], [420, -60], [820, 200]]} smooth width={10} color="#6e4a2c" z={-5} />
          <Part shape={blob([[-560, 40], [-300, -120], [0, -170], [300, -120], [560, 40], [0, -60]], 8)} color="#e86a4a" shade={0.2} z={-4} />
          <X x={0} y={-150} rot={-0.05} z={-3}>
            <Character {...PERSON(4)} s={1.2} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={{ ...poses.sit(frame), armB: [2.6, 1.5], armsOverHead: false }} shadow={false} glasses="#2a2228" />
          </X>
          <Sun x={600} y={600} r={110} z={-35} />
        </SeaSet>
      </Stage>
      <Label text="$22 MILLION?" x={0.1} y={0.1} size={0.055} kind="box" at={at(249.0)} />
      <Label text="MOST PEOPLE WOULD RELAX" x={0.5} y={0.86} size={0.055} kind="box" at={at(249.6)} />
    </AbsoluteFill>
  );
};

// 251.11 "Elon puts 10 million of it into his next company."
export const TenMillionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 252.0, 253.3);
  const arm: [number, number] = [1.3 - k * 0.2, 0.4];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2000" desk={false}>
          <Box x={360} y={-640} w={520} h={360} z={1} />
          <X x={interpolate(k, [0, 1], [-60, 360])} y={interpolate(k, [0, 0.6, 1], [-300, -140, -460])} z={k > 0.85 ? 0.9 : 3}>
            <Cash w={300} n={6} />
          </X>
          <Character {...ELON_SUIT} x={-460} y={-640} s={1.7} look={0.6} expression={{ eyes: "open", mouth: "smirk", brows: -0.3 }} pose={{ ...poses.idle(frame, 2), armF: arm }} z={2} />
        </Office>
      </Stage>
      <Label text="$10 MILLION" x={0.1} y={0.1} size={0.06} kind="box" at={at(251.72)} />
      <Label text="NEXT COMPANY" x={0.5 + 360 / 1920} y={0.86} size={0.05} kind="box" pin at={at(253.1)} />
    </AbsoluteFill>
  );
};

// 254.22 "And this becomes his rule. Whenever he wins, he bets it all again."
export const RuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 256.9, 257.9);
  const pushArm: [number, number] = [0.55 + k * 0.55, 0.5 - k * 0.35];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -150 }} light={{ dir: [-0.4, 0.8] }} vignette={0.7}>
        <ChipsTable push={k} y={-640}>
          <Character {...ELON_SUIT} x={-420} y={-520} s={1.7} look={0.6} expression={{ eyes: "open", mouth: "smirk", brows: -0.4, gaze: [0.6, -0.5] }} pose={{ ...poses.idle(frame, 2), armF: pushArm, armB: [pushArm[0] - 0.2, pushArm[1] + 0.1] }} />
        </ChipsTable>
      </Stage>
      <Label text="HIS RULE" x={0.1} y={0.1} size={0.06} kind="box" at={at(255.05)} />
      <Label text="WIN → BET IT ALL AGAIN" x={0.5} y={0.86} size={0.065} kind="stamp" at={at(257.1)} />
    </AbsoluteFill>
  );
};

// 258.23 "Remember it, because it explains almost everything he does."
export const RememberRuleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [0.6, 0.6] }} vignette={0.7} bgBlur={7} bg={<ChipsTable push={1} y={-640} />}>
        <Character {...ELON_SUIT} x={-220} y={-720} s={2.45} look={0.55} expression={{ eyes: "open", mouth: "smirk", brows: -0.4, gaze: [0.4, 0.1] }} pose={poses.idle(frame, 4)} />
      </DepthStage>
      <Label text="REMEMBER THE RULE" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(258.3)} />
    </AbsoluteFill>
  );
};

export const _unusedC = { Wash, Line, Monitor, Skyline, Sea, Hill, Desk, MAYE, Airliner };
