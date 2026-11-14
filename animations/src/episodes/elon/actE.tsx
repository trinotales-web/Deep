import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, InkLine, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Falcon1, Falcon9, FalconHeavy, Dragon, SpaceStation, StarlinkSat, Fireball, Exhaust, LandingPad, LaunchPad, Planet, Roadster, SedanEV, OldPhone, Cash, Banknote, MoneyBag,
  LineChart, Bars, Bell, Trophy, XmasTree, Flame, Smoke, Splash, Skyline, Room, Airliner, Globe, globeXY, Dish, WorldMap, CITY, worldXY, Book, StageSet, Cloud, Sun, Stars,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { IslandSet, SeaSet, HighSky, SpaceSet, Paper, Office, MCRoom, Flash, DashArrow, Outdoors, StormRain } from "./sets";
import { ELON_2008, ELON_TEE, ENGINEER, JUSTINE, PERSON, SUIT, STAFF, ASTRONAUT } from "./cast";
import { upright } from "./actA";
import { MarketWall, StockLine, MARKET_GREEN, MARKET_RED } from "../../kit/env/market";

// 2008: the worst year and the fourth launch; the NASA call; Tesla and SpaceX
// take off (2010–2022): Model S, Dragon, landings, Falcon Heavy, Starman, crew, Starlink.

/** Mission control engineers cheering in a row (no overlaps). */
const CheeringRoom: React.FC<{ frame: number; cheer: boolean; n?: number }> = ({ frame, cheer, n = 5 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const x = -880 + (i * 1760) / (n - 1);
      return (
        <Character
          key={i}
          {...ENGINEER(i)}
          x={x}
          y={-620 - (i % 2) * 20}
          s={1.25}
          facing={x < 0 ? 1 : -1}
          look={0.5}
          expression={{ eyes: cheer ? "happy" : "open", mouth: cheer ? "grin" : "flat", brows: cheer ? 0 : 0.5 }}
          pose={cheer ? poses.armsUp(frame + i * 7) : poses.idle(frame, i)}
          z={1 + (i % 2) * 0.1}
        />
      );
    })}
  </>
);

/** Drone ship (landing barge) at sea. Origin = deck centre. */
const DroneShip: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={poly([[-760, 0], [760, 0], [700, -150], [-700, -150]])} color="#3a3e46" shade={0.2} />
    <Part shape={roundRect(1520, 24, 4)} color="#5a5e66" flat outline={4} y={-6} z={0.001} />
    {[-700, 700].map((xx) => (
      <Part key={xx} shape={roundRect(70, 140, 6)} color="#4a4e56" shade={0.2} x={xx} y={60} z={0.002} />
    ))}
    <X sy={0.18} z={0.003}>
      <Line pts={[[-260, -260], [260, 260]]} width={40} color="#f4f1ea" />
      <Line pts={[[-260, 260], [260, -260]]} width={40} color="#f4f1ea" />
    </X>
  </X>
);

/** Green dumpster. Origin = ground. */
const Dumpster: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={poly([[-520, 0], [520, 0], [580, 420], [-580, 420]])} color="#3f7a4a" shade={0.22} />
    {[-300, 0, 300].map((xx) => (
      <Line key={xx} pts={[[xx, 30], [xx * 1.08, 390]]} width={6} color="#2f5a3a" z={0.001} />
    ))}
    <Part shape={roundRect(1200, 40, 8)} color="#2f5a3a" shade={0.2} y={430} z={0.002} />
  </X>
);

/** Floating music notes. */
const MusicNotes: React.FC<{ frame: number; x: number; y: number; z?: number }> = ({ frame, x, y, z = 0 }) => (
  <X x={x} y={y} z={z}>
    {[0, 1, 2].map((i) => {
      const ph = ((frame * 0.012 + i / 3) % 1);
      return (
        <X key={i} x={Math.sin(ph * 6 + i) * 60 + i * 50} y={ph * 380} s={0.9} rot={Math.sin(ph * 5) * 0.3}>
          <Part shape={ellipse(22, 16)} color="#f2cc5a" flat outline={4} rot={-0.4} opacity={1 - ph} />
          <Line pts={[[18, 4], [18, 80]]} width={6} color="#f2cc5a" opacity={1 - ph} />
          <Line pts={[[18, 80], [44, 64]]} width={6} color="#f2cc5a" opacity={1 - ph} />
        </X>
      );
    })}
  </X>
);

// ───────────────────────── 2008 ─────────────────────────

// 404.91 "Now, back to that island. By 2008, everything is going wrong."
export const BackIslandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.95), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7} vignetteColor="#0a0e18">
        <IslandSet mood="storm" horizon={-200} rocketX={160} rocketH={720} />
        <StormRain />
      </Stage>
      <Label text="BACK TO THE ISLAND" x={0.1} y={0.1} size={0.05} kind="box" at={at(405.0)} />
      <Label text="2008" x={0.9} y={0.1} size={0.06} kind="box" at={at(406.84)} />
      <Label text="EVERYTHING IS GOING WRONG" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(407.8)} />
    </AbsoluteFill>
  );
};

// 409.32 "Falcon 1 has failed three times."
export const ThreeFailsAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          {[-560, 0, 560].map((x, i) => (
            <React.Fragment key={x}>
              <Falcon1 x={x} y={-330} h={620} />
              <X x={x} y={0} s={pop(t, 410.3 + i * 0.25)} z={1}>
                <Line pts={[[-150, -150], [150, 150]]} width={44} color="#d8322f" />
                <Line pts={[[-150, 150], [150, -150]]} width={44} color="#d8322f" />
              </X>
            </React.Fragment>
          ))}
        </Paper>
      </Stage>
      <Label text="FALCON 1: THREE FAILURES" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(409.4)} />
    </AbsoluteFill>
  );
};

// 412.00 "Tesla is burning through money."
export const BurningMoneyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -220 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7} vignetteColor="#1a0a08">
        <Room wall="#5a5e66" floor="#3a3e46" y={-420} boards={false} z={-40} />
        <Glow y={-200} rx={900} ry={500} color="#ff8a3a" alpha={0.35} additive z={-30} />
        <Roadster x={0} y={-460} s={1.3} z={1} />
        {[-620, -380, 380, 620].map((x, i) => (
          <X key={x} x={x} y={-480} z={2}>
            <Cash w={220} n={4} />
            <Flame y={70} size={1.0 + (i % 2) * 0.2} seed={i} z={0.05} />
          </X>
        ))}
      </Stage>
      <Label text="TESLA" x={0.1} y={0.1} size={0.06} kind="box" at={at(412.0)} />
      <Label text="BURNING THROUGH MONEY" x={0.9} y={0.1} size={0.055} kind="stamp" at={at(412.8)} />
    </AbsoluteFill>
  );
};

// 413.87 "The world economy is crashing."
export const EconomyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const cx = 120;
  const cy = 110;
  const title = sc(230, 190 + 240, zoom, cx, cy);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cx, y: cy, shake: hitAt(t, 414.9, 0.4) * 6 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7}>
        <MarketWall rows={2} glow={MARKET_RED}>
          <StockLine w={1180} h={400} y={-10} values={[0.9, 0.85, 0.88, 0.8, 0.6, 0.45, 0.25, 0.08]} k={ramp(t, 414.0, 415.4)} color={MARKET_RED} seed={5} jag={0.04} />
        </MarketWall>
      </Stage>
      <Label text="STOCK MARKET" x={title.x} y={title.y} size={0.1} kind="hand" italic pin at={at(413.9)} />
      <Label text="2008 FINANCIAL CRISIS" x={0.1} y={0.1} size={0.055} kind="box" at={at(414.3)} />
    </AbsoluteFill>
  );
};

/** Heart that cracks in two (`k` 0..1). */
const BrokenHeart: React.FC<{ k: number; x?: number; y?: number; s?: number }> = ({ k, x = 0, y = 0, s = 1 }) => (
  <X x={x} y={y} s={s}>
    {[-1, 1].map((sd) => (
      <X key={sd} x={sd * k * 60} rot={sd * k * 0.25}>
        <Part
          shape={blob(sd < 0 ? [[0, -130], [-60, -60], [-130, 20], [-110, 90], [-50, 100], [0, 60], [-20, 20], [10, -30], [-10, -80]] : [[0, -130], [-10, -80], [10, -30], [-20, 20], [0, 60], [50, 100], [110, 90], [130, 20], [60, -60]], 8)}
          color="#d8322f"
          shade={0.22}
        />
      </X>
    ))}
  </X>
);

// 415.76 "His marriage ends in divorce."
export const DivorceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 416.5, 417.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7}>
        <Room wall="#6a5a6a" floor="#4a3a40" y={-420} z={-40} />
        <Character {...JUSTINE} x={-620} y={-600} s={1.6} facing={-1} look={0.3} expression={{ eyes: "sad", mouth: "frown" }} pose={poses.idle(frame, 1)} z={1} />
        <Character {...ELON_2008} x={620} y={-600} s={1.6} facing={1} look={0.3} expression={{ eyes: "sad", mouth: "flat", brows: 0.6 }} pose={poses.idle(frame, 3)} z={1} />
        <BrokenHeart k={k} y={140} s={1.2} />
      </Stage>
      <Label text="DIVORCE" x={0.5} y={0.86} size={0.065} kind="stamp" at={sec(start)(416.5)} />
    </AbsoluteFill>
  );
};

// 417.55 "Elon later calls it 'the worst year of my life.'"
export const WorstYearShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [0.6, 0.5] }} vignette={0.75} vignetteColor="#05070e" bgBlur={7} bg={<Office era="2008" night />}>
        <Character {...ELON_2008} x={-260} y={-720} s={2.4} look={0.5} expression={{ eyes: "half", mouth: "frown", eyebags: true, brows: 0.7 }} pose={poses.idle(frame, 6)} />
      </DepthStage>
      <Label text="“THE WORST YEAR OF MY LIFE”" x={0.85} y={0.86} size={0.06} kind="box" at={at(418.6)} />
    </AbsoluteFill>
  );
};

// 420.20 "Almost all his PayPal money is now inside SpaceX and Tesla."
export const MoneyInsideShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const flow = ramp(t, 421.0, 423.5, Easing.linear);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <MoneyBag x={-620} y={-260} s={1.4 - flow * 0.6} />
          <X x={420} y={140}>
            <Part shape={roundRect(520, 300, 20)} color="#2a2a32" shade={0.2} />
            <Falcon1 x={0} y={-120} h={240} z={0.01} />
          </X>
          <X x={420} y={-300}>
            <Part shape={roundRect(520, 300, 20)} color="#c8262f" shade={0.2} />
            <Roadster x={0} y={-60} s={0.6} shadow={false} z={0.01} />
          </X>
          <DashArrow from={[-420, 0]} to={[140, 150]} k={ramp(t, 421.6, 422.4)} />
          <DashArrow from={[-420, -140]} to={[140, -290]} k={ramp(t, 422.6, 423.4)} />
        </Paper>
      </Stage>
      <Label text="HIS PAYPAL MONEY" x={0.1} y={0.1} size={0.05} kind="box" at={at(420.6)} />
      <Label text="SPACEX" x={0.5 + 420 / 1920} y={0.5 - 140 / 1080 - 0.17} size={0.045} kind="box" pin at={at(422.5)} />
      <Label text="TESLA" x={0.5 + 420 / 1920} y={0.5 + 300 / 1080 + 0.17} size={0.045} kind="box" pin at={at(423.3)} />
    </AbsoluteFill>
  );
};

// 424.28 "By the end of the year, he's living on loans from friends."
export const LoansShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2008" desk={false}>
          <Character {...PERSON(1)} x={-720} y={-620} s={1.45} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.holdOut} holdF={<Banknote s={0.6} rot={upright([1.1, 0.4])} />} z={1} />
          <Character {...PERSON(4)} x={-330} y={-640} s={1.45} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.holdOut} holdF={<Banknote s={0.6} rot={upright([1.1, 0.4])} />} z={1.1} />
          <Character {...ELON_2008} x={420} y={-620} s={1.6} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "wavy", blush: true, brows: 0.5 }} pose={poses.idle(frame, 3)} z={1} />
        </Office>
      </Stage>
      <Label text="LIVING ON LOANS FROM FRIENDS" x={0.5} y={0.1} size={0.055} kind="box" at={at(425.5)} />
    </AbsoluteFill>
  );
};

// 427.40 "Then, on September 28, 2008, the fourth Falcon 1 lifts off."
export const LaunchDayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const ign = ramp(t, 431.2, 431.6);
  const lift = ramp(t, 431.75, 432.7, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05), y: 120, shake: ign * 6 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <IslandSet mood="dawn" horizon={-200} rocket={false}>
          <X y={-320} z={-19.9}>
            <TropicalIslandPad />
          </X>
          <Falcon1 x={120} y={-250 + lift * 420} h={760} thrust={ign} z={-19} />
          {ign > 0 ? <Smoke x={120} y={-320} w={600} h={300} alpha={0.55 * ign} z={-18.5} /> : null}
        </IslandSet>
      </Stage>
      <Label text="SEPTEMBER 28, 2008" x={0.5} y={0.14} size={0.085} kind="title" at={at(428.1)} />
      <Label text="FLIGHT 4" x={0.1} y={0.86} size={0.06} kind="box" at={at(430.6)} />
    </AbsoluteFill>
  );
};
/** Just the pad and tower (the rocket is drawn separately so it can lift off). */
const TropicalIslandPad: React.FC = () => <LaunchPad x={120} y={70} w={500} tower={570} towerX={140} />;

// 432.77 "And this time,"
export const ClimbShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <HighSky alt={0.4}>
          <X y={interpolate(frame, [0, dur], [-200, 60])} z={2}>
            <Falcon1 y={-430} h={860} thrust={1} />
          </X>
        </HighSky>
      </Stage>
    </AbsoluteFill>
  );
};

// 433.73 "it works."
export const ItWorksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [0.6, 0.5] }} vignette={0.65}>
        <MCRoom>
          <CheeringRoom frame={frame} cheer />
        </MCRoom>
      </Stage>
      <Label text="IT WORKS!" x={0.5} y={0.14} size={0.09} kind="title" at={at(433.8)} />
    </AbsoluteFill>
  );
};

// 434.89 "It becomes the first privately built liquid-fueled rocket to reach orbit."
export const OrbitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const a = interpolate(t, [434.7, 439.5], [-0.6, 0.3]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SpaceSet earthY={-1500} earthR={1250}>
          <Line pts={Array.from({ length: 41 }, (_, i) => [Math.cos(-1.4 + i * 0.07) * 1500, -1500 + Math.sin(-1.4 + i * 0.07) * 1500] as [number, number]).filter(([, y]) => y > -600)} width={6} color="#e9ba41" opacity={0.6} z={-20} />
          <X x={Math.sin(a) * 1500} y={-1500 + Math.cos(a) * 1500} rot={-a - Math.PI / 2} z={2}>
            <Falcon1 h={700} lower={false} y={-330} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="ORBIT!" sub="FIRST PRIVATELY BUILT LIQUID-FUELED ROCKET" x={0.5} y={0.14} size={0.085} kind="title" at={at(435.4)} />
    </AbsoluteFill>
  );
};

// 439.59 "Elon calls it 'one of the best days of my life.'"
export const BestDayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [0.6, 0.5] }} vignette={0.6}>
        <MCRoom>
          {[-760, -380, 380, 760].map((x, i) => (
            <Character key={x} {...ENGINEER(i + 1)} x={x} y={-600} s={1.15} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame + i * 5)} z={1} />
          ))}
          <Character {...ELON_2008} x={0} y={-700} s={1.65} look={0.2} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={2} />
          {Array.from({ length: 30 }, (_, i) => {
            const y = 700 - ((frame * (5 + (i % 4)) + i * 83) % 1500);
            return <Part key={i} shape={roundRect(18, 30, 3)} color={["#fe5649", "#e9ba41", "#3a7ac9", "#3fa07a"][i % 4]} flat outline={0} x={-950 + i * 65} y={y} rot={frame * 0.1 + i} z={3} />;
          })}
        </MCRoom>
      </Stage>
      <Label text="“ONE OF THE BEST DAYS OF MY LIFE”" x={0.5} y={0.1} size={0.055} kind="box" at={at(440.4)} />
    </AbsoluteFill>
  );
};

// 442.41 "Remember that engineer on the island? He just watched history."
export const EngineerHistoryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }}
        light={{ dir: [0.6, 0.5] }}
        vignette={0.6}
        bgBlur={5}
        bg={
          <IslandSet mood="dawn" horizon={-120} rocket={false}>
            <Line pts={[[-600, -150], [-500, 300], [-300, 800], [0, 1400]]} smooth width={40} color="#f4f1ea" opacity={0.7} z={-10} />
          </IslandSet>
        }
      >
        <Character {...ENGINEER(0)} x={420} y={-680} s={2.3} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "grin", gaze: [0.5, 0.9] }} pose={poses.idle(frame, 1)} />
      </DepthStage>
      <Label text="REMEMBER THE ENGINEER?" x={0.1} y={0.1} size={0.05} kind="box" at={at(442.5)} />
      <Label text="HE JUST WATCHED HISTORY" x={0.1} y={0.86} size={0.06} kind="stamp" at={at(444.6)} />
    </AbsoluteFill>
  );
};

// 446.03 "But SpaceX still needs money."
export const NeedsMoneyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <X x={-200} y={-40}>
            <Part shape={roundRect(260, 820, 30)} color="#f4ecd8" shade={0.1} outline={7} />
            <Part shape={roundRect(200, 760 * Math.max(0.03, 1 - ramp(t, 446.2, 447.8)), 20)} color="#d8322f" flat outline={0} y={-380 + (760 * Math.max(0.03, 1 - ramp(t, 446.2, 447.8))) / 2} z={0.001} />
          </X>
          <Falcon1 x={360} y={-420} h={820} />
        </Paper>
      </Stage>
      <Label text="SPACEX STILL NEEDS MONEY" x={0.5} y={0.1} size={0.055} kind="box" at={at(446.2)} />
    </AbsoluteFill>
  );
};

// 448.33 "On December 23, NASA calls."
export const NasaCallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const ring = t > 449.9 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.3, 1.4), y: -120 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#05070e">
        <Office era="2008" night desk={false}>
          {Array.from({ length: 16 }, (_, i) => (
            <Part key={i} shape={circle(10)} color={["#fe5649", "#e9ba41", "#3fa07a", "#7fd0ff"][i % 4]} flat outline={2.5} x={-900 + i * 120} y={160 + Math.sin(i * 1.3) * 30} opacity={(Math.floor(frame / 8) + i) % 3 ? 1 : 0.35} z={-5} />
          ))}
          <Part shape={roundRect(1400, 60, 10)} color="#5a3a20" shade={0.2} y={-330} z={1} />
          <X x={0} y={-180 + (ring ? Math.sin(frame * 2.2) * 4 : 0)} rot={ring ? Math.sin(frame * 2.7) * 0.06 : 0} z={2}>
            <OldPhone s={1.1} lit={ring} />
          </X>
        </Office>
      </Stage>
      <Label text="DECEMBER 23, 2008" x={0.1} y={0.1} size={0.055} kind="box" at={at(448.5)} />
      <Label text="NASA CALLING" x={0.9} y={0.1} size={0.06} kind="box" at={at(449.9)} />
    </AbsoluteFill>
  );
};

// 451.07 "SpaceX has won a 1.6-billion-dollar contract to fly cargo to the International Space Station."
export const ContractShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 451.0, 457.3, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98) }} light={{ dir: [-0.7, 0.5] }} vignette={0.6}>
        <SpaceSet earthY={-1700} earthR={1400}>
          <SpaceStation x={260} y={180} s={0.55} glint={1} z={1} />
          <X x={interpolate(k, [0, 1], [-900, -300])} y={interpolate(k, [0, 1], [-220, 60])} rot={-1.2} s={0.55} z={2}>
            <Dragon trunk wings={1} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="$1.6 BILLION CONTRACT" x={0.1} y={0.1} size={0.06} kind="box" at={at(452.3)} />
      <Label text="CARGO TO THE SPACE STATION" x={0.9} y={0.86} size={0.05} kind="box" at={at(455.2)} />
    </AbsoluteFill>
  );
};

/** Little red hearts popping around a point. */
const Hearts: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => (
  <X x={x} y={y} z={3}>
    {[0, 1, 2, 3, 4].map((i) => {
      const k = Math.max(0, Math.min(1, (t - at - i * 0.12) / 1.0));
      if (k <= 0) return null;
      const a = -0.4 + i * 0.45;
      return (
        <X key={i} x={Math.cos(a + 1.2) * 220 * k} y={Math.sin(a + 1.2) * 220 * k + k * 80} s={pop(t, at + i * 0.12) * 0.55}>
          <Part shape={blob([[0, -60], [-70, 10], [-60, 60], [-20, 70], [0, 40], [20, 70], [60, 60], [70, 10]], 8)} color="#e2484a" shade={0.2} opacity={1 - Math.max(0, k - 0.7) / 0.3} />
        </X>
      );
    })}
  </X>
);

// 457.50 "Elon is so shocked he can barely hold the phone. He blurts out that he loves them."
export const ShockedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arm: [number, number] = [1.1, 1.05 + Math.sin(frame * 1.9) * 0.06];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#05070e" bgBlur={7} bg={<Office era="2008" night />}>
        <Character {...ELON_2008} x={-200} y={-720} s={2.4} look={0.55} talking={t > 460.8 && t < 462.3} expression={{ eyes: t > 460.8 ? "happy" : "wide", mouth: t > 460.8 ? "grin" : "o", brows: t > 460.8 ? 0 : 0.8, sweat: t < 460.8 }} pose={{ ...poses.idle(frame, 2), armF: arm, bob: Math.sin(frame * 2.1) * 2 }} holdF={<OldPhone s={0.75} rot={upright(arm)} lit={1} />} />
        <Hearts t={t} at={461.6} x={420} y={140} />
      </DepthStage>
      <Label text="SHOCKED" x={0.9} y={0.1} size={0.05} kind="box" at={sec(start)(458.3)} />
    </AbsoluteFill>
  );
};

// 462.79 "Years later, he says that contract saved SpaceX."
export const SavedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.9), y: 220, rot: 0.02 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <SeaSet mood="dusk" horizon={-380}>
          <Part shape={roundRect(6000, 900, 0)} color="#c8b88a" flat outline={5} y={-830} z={-20} />
          <LaunchPad x={0} y={-380} w={700} tower={1000} towerX={260} z={1} />
          <Falcon9 x={0} y={-380} h={1250} payload="dragon" z={2} />
        </SeaSet>
      </Stage>
      <Label text="“THAT CONTRACT SAVED SPACEX”" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(465.2)} />
    </AbsoluteFill>
  );
};

// 467.01 "The next day, Christmas Eve, Tesla's investors agree to put in more money."
export const ChristmasEveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [0.6, 0.5] }} vignette={0.65}>
        <Office era="2008" night desk={false}>
          <XmasTree x={-860} y={-470} s={1.2} z={-2} />
          {[-420, 0, 420].map((x, i) => (
            <Character key={x} {...SUIT(i)} x={x} y={-560} s={1.2} facing={x > 0 ? -1 : 1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={i === 1 ? poses.talk(frame, 1) : poses.idle(frame, i)} z={-1} />
          ))}
          <Part shape={roundRect(1600, 60, 12)} color="#6e4a2c" shade={0.2} y={-330} z={1} />
          <Part shape={roundRect(1500, 260, 12)} color="#5a3a20" shade={0.2} y={-480} z={0.9} />
          <X x={240} y={-290} z={1.1}>
            <Part shape={roundRect(260, 30, 4)} color="#f8f6ee" shade={0.1} />
          </X>
        </Office>
      </Stage>
      <Label text="CHRISTMAS EVE" x={0.1} y={0.1} size={0.06} kind="box" at={at(467.6)} />
      <Label text="INVESTORS PUT IN MORE MONEY" x={0.9} y={0.86} size={0.05} kind="box" at={at(469.6)} />
    </AbsoluteFill>
  );
};

// 471.33 "Tesla survives too."
export const TeslaSurvivesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -230 }} light={{ dir: [-0.5, 0.7] }} vignette={0.65}>
        <Room wall="#5a5e66" floor="#3a3e46" y={-420} boards={false} z={-40} />
        <Roadster x={interpolate(frame, [0, dur], [-200, 140])} y={-460} s={1.45} lights={1} spin={frame * 0.4} z={1} />
      </Stage>
      <Label text="TESLA SURVIVES" x={0.5} y={0.1} size={0.07} kind="stamp" at={at(471.8)} />
    </AbsoluteFill>
  );
};

// 473.00 "In a few months, he goes from almost losing everything to saving both companies."
export const BothSavedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.88, 0.95), y: 120 }} light={{ dir: [0.6, 0.5] }} vignette={0.6}>
        <Outdoors mood="dawn" horizon={-420} ground="#8a9a6a" />
        <Falcon9 x={-640} y={-470} h={1150} payload="dragon" z={1} />
        <Roadster x={640} y={-520} s={1.3} z={1} />
        <Character {...ELON_2008} x={0} y={-640} s={1.7} look={0.2} expression={{ eyes: t > 475.9 ? "happy" : "open", mouth: t > 475.9 ? "grin" : "flat" }} pose={t > 475.9 ? poses.armsUp(frame) : poses.idle(frame, 2)} z={2} />
      </Stage>
      <Label text="SAVED BOTH COMPANIES" x={0.5} y={0.14} size={0.075} kind="title" at={at(476.0)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── things move fast ─────────────────────────

// 477.78 "From here, things move fast."
export const FastShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const off = ramp(t, 477.7, 479.6, Easing.in(Easing.cubic)) * 2600;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper>
          <InkLine pts={[[-3000, -40], [3000, -40]]} width={20} color="#6a5a4a" outline={6} />
          {Array.from({ length: 14 }, (_, i) => (
            <X key={i} x={-600 + i * 360 - off} y={-40} z={0.01}>
              <Part shape={circle(38)} color={i === 0 ? "#d8322f" : "#e9ba41"} shade={0.18} outline={8} />
            </X>
          ))}
        </Paper>
      </Stage>
      {Array.from({ length: 14 }, (_, i) => {
        const x = 0.5 + (-600 + i * 360 - off) / 1920;
        return x > -0.1 && x < 1.1 ? <Label key={i} text={`${2008 + i}`} x={x} y={0.62} size={0.062} pin kind="ink" at={0} /> : null;
      })}
      <Label text="THINGS MOVE FAST" x={0.5} y={0.14} size={0.075} kind="title" at={sec(start)(478.5)} />
    </AbsoluteFill>
  );
};

// 479.78 "In 2010, Tesla goes public."
export const IPOShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.92, 0.98);
  const title = sc(230, 190 + 240, zoom, 0, 60);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <MarketWall
          rows={0}
          clockX={-760}
          front={
            <>
              <Bell x={-440} y={-470} s={1.3} ring={t > 481.0 ? 1 : 0} z={1} />
              <Character {...ELON_TEE} x={40} y={-640} s={1.6} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={2} />
            </>
          }
        >
          <StockLine w={1180} h={380} y={60} values={[0.1, 0.13, 0.11, 0.18, 0.24, 0.3, 0.4, 0.5]} k={ramp(t, 481.1, 482.4) * 0.6} seed={3} />
        </MarketWall>
      </Stage>
      <Label text="TESLA" x={title.x} y={title.y} size={0.1} kind="hand" italic pin at={at(481.07)} />
      <Label text="2010" x={0.1} y={0.1} size={0.06} kind="box" at={at(479.9)} />
      <Label text="TESLA GOES PUBLIC" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(481.1)} />
    </AbsoluteFill>
  );
};

// 482.55 "In 2012, its Model S comes out, and a top car magazine names it Car of the Year."
export const ModelSShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7}>
        <StageSet curtain="#2a2a3a" spots={1} floor="#3a3a42" y={-420} />
        <SedanEV x={-140} y={-470} s={1.55} color="#c8262f" lights={0.6} z={2} />
        <Trophy x={720} y={-480} s={1.2 * pop(t, 487.2)} z={3} />
        {t > 487.2 ? <Glow x={720} y={-200} rx={260} color="#fff2a0" alpha={0.4} additive z={2.9} /> : null}
      </Stage>
      <Label text="2012" x={0.1} y={0.1} size={0.06} kind="box" at={at(482.7)} />
      <Label text="MODEL S" x={0.9} y={0.1} size={0.065} kind="box" at={at(484.01)} />
      <Label text="CAR OF THE YEAR" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(487.2)} />
    </AbsoluteFill>
  );
};

// 488.61 "That same year, SpaceX's Dragon becomes the first private spacecraft to reach the space station."
export const DragonISSShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 488.5, 493.6, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05) }} light={{ dir: [-0.7, 0.5] }} vignette={0.6}>
        <SpaceSet earthY={-1700} earthR={1400}>
          <SpaceStation x={120} y={240} s={0.6} glint={1} z={1} />
          <X x={interpolate(k, [0, 1], [-1000, -190])} y={interpolate(k, [0, 1], [-200, 40])} rot={-1.57} s={0.5} z={2}>
            <Dragon trunk wings={1} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="DRAGON, 2012" x={0.1} y={0.1} size={0.06} kind="box" at={at(490.4)} />
      <Label text="FIRST PRIVATE SPACECRAFT AT THE SPACE STATION" x={0.5} y={0.86} size={0.045} kind="box" at={at(491.8)} />
    </AbsoluteFill>
  );
};

// 494.84 "Then SpaceX tries something everyone says is crazy. Landing rockets."
export const CrazyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper>
          <Falcon9 x={0} y={-420} h={760} stage1 legs={1} fins={1} z={1} />
          {[-820, -520, 520, 820].map((x, i) => (
            <Character key={x} {...PERSON(i)} x={x} y={-600 - (i % 2) * 20} s={1.3} facing={x < 0 ? 1 : -1} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={i % 2 ? poses.point(frame) : { ...poses.idle(frame, i), bob: Math.abs(Math.sin(frame * 0.5 + i)) * 10 }} z={2} />
          ))}
        </Paper>
      </Stage>
      <Label text="EVERYONE SAYS IT'S CRAZY" x={0.5} y={0.1} size={0.055} kind="box" at={at(496.5)} />
      <Label text="LANDING ROCKETS" x={0.5} y={0.86} size={0.075} kind="stamp" at={at(498.1)} />
    </AbsoluteFill>
  );
};

// 499.73 "Back then, every rocket was thrown away after one flight."
export const ThrownAwayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 499.7, 501.7, Easing.in(Easing.quad));
  const hit = hitAt(t, 501.7, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0, shake: hit * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SeaSet mood="day" horizon={-300}>
          {t < 501.75 ? (
            <X x={interpolate(k, [0, 1], [-300, 200])} y={interpolate(k, [0, 1], [500, -380])} rot={0.6 + k * 1.2} z={2}>
              <Falcon9 h={800} stage1 />
            </X>
          ) : null}
          {t > 501.7 ? (
            <X x={200} y={-340} z={3}>
              {[-1, 1].map((sd) => (
                <Part key={sd} shape={blob([[0, 0], [sd * 60, 160 * (1 - Math.max(0, t - 501.7))], [sd * 160, 260 * (1 - Math.max(0, t - 501.7))], [sd * 200, 0]], 6)} color="#f4f8fc" flat outline={5} opacity={Math.max(0, 1 - (t - 501.7))} />
              ))}
            </X>
          ) : null}
        </SeaSet>
      </Stage>
      <Label text="THROWN AWAY AFTER ONE FLIGHT" x={0.5} y={0.1} size={0.055} kind="box" at={at(501.4)} />
    </AbsoluteFill>
  );
};

// 503.02 "Imagine throwing away a plane after every trip."
export const PlaneTrashShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 503.6, 504.9, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), y: 60, shake: hitAt(t, 504.9, 0.4) * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Outdoors mood="day" horizon={-420} ground="#9a9a96" />
        <X x={interpolate(k, [0, 1], [-200, 60])} y={interpolate(k, [0, 1], [500, -40])} rot={-0.15 - k * 0.5} z={1}>
          <Airliner s={0.9} />
        </X>
        <Dumpster x={80} y={-520} s={1.0} z={2} />
      </Stage>
      <Label text="IMAGINE IT WITH PLANES" x={0.5} y={0.1} size={0.055} kind="box" at={at(503.4)} />
    </AbsoluteFill>
  );
};

// 505.89 "SpaceX's first landing tries end in fireballs."
export const FireballsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const down = ramp(t, 505.8, 507.3, Easing.out(Easing.quad));
  const tip = ramp(t, 507.3, 507.9, Easing.in(Easing.quad));
  const hit = hitAt(t, 507.9, 0.45);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 60, shake: hit * 12 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SeaSet mood="day" horizon={-300}>
          <DroneShip x={0} y={-420} s={0.9} z={1} />
          {t < 507.95 ? (
            <X x={tip * 120} y={interpolate(down, [0, 1], [700, -420])} rot={-tip * 1.1} z={2}>
              <Falcon9 h={760} stage1 legs={ramp(t, 506.6, 507.2)} fins={1} soot={0.6} thrust={t < 507.4 ? 0.8 : 0} />
            </X>
          ) : null}
          <Fireball t={ramp(t, 507.9, 509.2, Easing.linear)} x={120} y={-380} s={1.1} z={3} />
        </SeaSet>
      </Stage>
      <Label text="FIRST LANDING TRIES" x={0.1} y={0.1} size={0.05} kind="box" at={at(506.6)} />
      <Label text="FIREBALLS" x={0.85} y={0.86} size={0.07} kind="stamp" at={at(507.9)} />
    </AbsoluteFill>
  );
};

// 509.01 "But on December 21, 2015, a Falcon 9 booster flies back and lands standing up."
export const LandingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const down = ramp(t, 509.0, 514.15, Easing.out(Easing.cubic));
  const landed = t > 514.15;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.92), y: interpolate(down, [0, 1], [420, 80]) }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#05070e">
        <Part shape={roundRect(5000, 4000, 0)} color="#0c1128" flat outline={0} z={-41} />
        <Stars w={5000} h={3000} y={600} count={110} z={-40} />
        <Skyline y={-420} night z={-35} color="#2a3242" hmin={120} hmax={360} />
        <Part shape={roundRect(6000, 1200, 0)} color="#2a2e36" flat outline={5} y={-1020} z={-30} />
        <LandingPad x={0} y={-440} r={520} lights={1} z={-20} />
        <X y={interpolate(down, [0, 1], [1500, -440])} z={2}>
          <Falcon9 h={1000} stage1 legs={ramp(t, 512.6, 513.4)} fins={1} soot={0.5} thrust={landed ? 0 : 0.9} />
        </X>
        {landed ? <Smoke x={0} y={-420} w={500} h={300} alpha={0.4} z={3} /> : null}
      </Stage>
      <Label text="DECEMBER 21, 2015" x={0.1} y={0.1} size={0.06} kind="box" at={at(509.25)} />
      <Label text="IT LANDS STANDING UP" x={0.5} y={0.86} size={0.065} kind="stamp" at={at(514.2)} />
    </AbsoluteFill>
  );
};

// 515.28 "In 2018, SpaceX launches its giant Falcon Heavy rocket."
export const FalconHeavyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const lift = ramp(t, 516.8, 519.1, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.78, 0.84), y: 260, shake: 5 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <SeaSet mood="day" horizon={-420}>
          <Part shape={roundRect(6000, 900, 0)} color="#b8b090" flat outline={5} y={-870} z={-20} />
          <LaunchPad x={0} y={-420} w={900} z={1} />
          <FalconHeavy x={0} y={-420 + lift * 600} h={1300} thrust={1} z={2} />
          <Smoke x={0} y={-420} w={1200} h={500} alpha={0.6} z={3} />
        </SeaSet>
      </Stage>
      <Label text="2018" x={0.1} y={0.1} size={0.06} kind="box" at={at(515.4)} />
      <Label text="FALCON HEAVY" sub="GIANT ROCKET" x={0.9} y={0.1} size={0.065} kind="box" at={at(517.94)} />
    </AbsoluteFill>
  );
};

/** Starman in the Roadster (drawn together). */
const StarmanCar: React.FC<{ frame: number; s?: number }> = ({ frame, s = 1 }) => (
  <Roadster s={s} shadow={false}>
    <Character {...ASTRONAUT(0)} x={0} y={-120} s={0.62} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={{ ...poses.sit(frame), armF: [1.4, 0.3], armB: [1.3, 0.4] }} shadow={false} />
  </Roadster>
);

// 519.29 "For the test cargo, Elon sends his own red Tesla sports car into space."
export const CargoRoadsterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const open = ramp(t, 520.2, 521.2, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05) }} light={{ dir: [-0.7, 0.5] }} vignette={0.6}>
        <SpaceSet earthY={-1600} earthR={1300}>
          {[-1, 1].map((sd) => (
            <X key={sd} x={sd * (180 + open * 520)} y={40} rot={sd * open * 0.6} z={3}>
              <Part shape={sd < 0 ? blob([[0, -260], [0, 300], [-60, 220], [-140, 40], [-140, -260]], 8) : blob([[0, -260], [0, 300], [60, 220], [140, 40], [140, -260]], 8)} color="#eef0f3" shade={0.22} />
            </X>
          ))}
          <X x={0} y={-60} s={0.9} rot={-0.05} z={2}>
            <StarmanCar frame={frame} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="THE TEST CARGO" x={0.1} y={0.1} size={0.055} kind="box" at={at(519.6)} />
      <Label text="HIS OWN RED TESLA" x={0.9} y={0.86} size={0.06} kind="stamp" at={at(521.5)} />
    </AbsoluteFill>
  );
};

// 523.99 "At the wheel is a dummy in a spacesuit. The radio plays David Bowie's 'Space Oddity.'"
export const StarmanShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.7, 1.85), y: 120, x: -40 }} light={{ dir: [-0.7, 0.5] }} vignette={0.65}>
        <SpaceSet earthY={-1200} earthR={1100}>
          <X x={0} y={-80} rot={-0.04 + Math.sin(frame * 0.03) * 0.03} z={2}>
            <StarmanCar frame={frame} />
          </X>
          <MusicNotes frame={frame} x={200} y={150} z={3} />
        </SpaceSet>
      </Stage>
      <Label text="A DUMMY IN A SPACESUIT" x={0.1} y={0.1} size={0.05} kind="box" at={at(524.7)} />
      <Label text="“SPACE ODDITY”" sub="DAVID BOWIE" x={0.9} y={0.86} size={0.06} kind="box" at={at(527.84)} />
    </AbsoluteFill>
  );
};

// 529.10 "And on the car's screen are two words: 'Don't panic.'"
export const DontPanicShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.08);
  const p = sc(0, 40, zoom, 0, 0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.6] }} vignette={0.7}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2a1e22" flat outline={0} z={-41} />
        <Part shape={roundRect(3000, 900, 60)} color="#c8262f" shade={0.2} y={-600} z={-30} />
        <X y={40} z={1}>
          <Part shape={roundRect(980, 560, 40)} color="#1f1f25" shade={0.15} />
          <Part shape={roundRect(900, 480, 20)} color={t > 531.0 ? "#0e2030" : "#141a22"} flat outline={0} z={0.001} />
          {t > 531.0 ? <Glow rx={520} ry={300} color="#4a9adf" alpha={0.3} additive z={0.002} /> : null}
        </X>
      </Stage>
      <Label text="DON'T PANIC" x={p.x} y={p.y} size={0.075} pin color="#7fd0ff" at={sec(start)(531.12)} />
      <Label text="ON THE CAR'S SCREEN" x={0.1} y={0.1} size={0.05} kind="box" at={sec(start)(529.6)} />
    </AbsoluteFill>
  );
};

/** The Guide's cover again, with the two words on a red band. */
const GuideCoverPanic: React.FC<{ frame: number }> = ({ frame }) => (
  <X>
    <Part shape={roundRect(820, 1140, 16)} color="#f4ecd8" shade={0.08} x={16} y={-16} z={-0.002} />
    <Part shape={roundRect(820, 1140, 16)} color="#1a2a5a" shade={0.15} />
    <Planet kind="earth" r={170} y={140} glow={0} z={0.002} />
    <Part shape={ellipse(300, 40)} color="#e9ba41" flat outline={5} y={140} rot={0.25} z={0.0015} opacity={0.9} />
    <Part shape={roundRect(640, 170, 30)} color="#c8262f" shade={0.15} y={-330} z={0.004} />
    <X x={260 + Math.sin(frame * 0.05) * 30} y={400} rot={-0.6} z={0.003}>
      <Part shape={roundRect(30, 120, 14)} color="#eef0f3" shade={0.2} />
    </X>
  </X>
);

// 532.50 "Remember that book he read as a kid? Those are the words on the cover of the Hitchhiker's Guide."
export const BookCallbackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const sc = useScr();
  const zoom = push(frame, dur, 0.72, 0.8);
  const p = sc(0, -330 - 30, zoom, 0, 20);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7} vignetteColor="#0a0e18">
        <Part shape={roundRect(4000, 3000, 0)} color="#20242e" flat outline={0} z={-41} />
        <Glow rx={900} color="#4a6adf" alpha={0.25} additive z={-40} />
        <GuideCoverPanic frame={frame} />
      </Stage>
      <Label text="REMEMBER THIS BOOK?" x={0.1} y={0.1} size={0.05} kind="box" at={sec(start)(532.6)} />
      <Label text="DON'T PANIC" x={p.x} y={p.y} size={0.07} pin at={sec(start)(534.6)} />
    </AbsoluteFill>
  );
};

// 537.12 "That car is still out there today, circling the Sun."
export const CirclingSunShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const a = frame * 0.03;
  const orbit = (rx: number, ry: number, n = 64) => Array.from({ length: n + 1 }, (_, i) => [Math.cos((i / n) * 6.283) * rx, Math.sin((i / n) * 6.283) * ry] as [number, number]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Part shape={roundRect(4000, 3000, 0)} color="#0a0e22" flat outline={0} z={-41} />
        <Stars w={4000} h={2400} count={90} z={-40} />
        <Line pts={orbit(420, 300)} width={9} color="#5a7ad8" opacity={0.85} />
        <Line pts={orbit(640, 440)} width={9} color="#c8643a" opacity={0.85} />
        <Line pts={orbit(560, 380).map(([x, y]) => [x + 90, y] as [number, number])} width={10} color="#e9ba41" />
        <Sun r={120} glow={1} z={1} />
        <Planet kind="earth" r={44} x={Math.cos(a * 1.3) * 420} y={Math.sin(a * 1.3) * 300} glow={0} z={2} />
        <Planet kind="mars" r={34} x={Math.cos(a * 0.7 + 2) * 640} y={Math.sin(a * 0.7 + 2) * 440} glow={0} z={2} />
        <X x={Math.cos(a + 1) * 560 + 90} y={Math.sin(a + 1) * 380} s={0.22} rot={a} z={3}>
          <Roadster shadow={false} />
        </X>
      </Stage>
      <Label text="STILL CIRCLING THE SUN" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(539.1)} />
    </AbsoluteFill>
  );
};

// 540.42 "In 2020, SpaceX becomes the first private company to fly astronauts to the space station."
export const CrewShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 160 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <SeaSet mood="day" horizon={-420}>
          <Part shape={roundRect(6000, 900, 0)} color="#b8b090" flat outline={5} y={-870} z={-20} />
          <LaunchPad x={260} y={-420} w={700} tower={1150} towerX={260} z={1} />
          <Falcon9 x={260} y={-420} h={1350} payload="dragon" z={2} />
          <Character {...ASTRONAUT(0)} x={-720} y={-470} s={1.45} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={{ ...poses.idle(frame, 1), armF: [2.3 + Math.sin(frame * 0.3) * 0.15, 0.4] }} z={3} />
          <Character {...ASTRONAUT(1)} x={-360} y={-490} s={1.45} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 4)} z={3} />
        </SeaSet>
      </Stage>
      <Label text="2020" x={0.1} y={0.1} size={0.06} kind="box" at={at(540.55)} until={at(543.0)} />
      <Label text="FIRST PRIVATE COMPANY TO FLY ASTRONAUTS" x={0.9} y={0.1} size={0.05} kind="box" at={at(543.1)} />
    </AbsoluteFill>
  );
};

// 546.28 "Today, SpaceX launches more rockets than any country on Earth."
export const MoreRocketsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const xs = [-450, 0, 450];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <Bars y={-360} w={1400} h={680} values={[1, 0.5, 0.13]} colors={["#2a2a32", "#c8262f", "#3a6ab0"]} k={ramp(t, 546.6, 548.6)} />
        </Paper>
      </Stage>
      {["SPACEX", "CHINA", "RUSSIA"].map((n, i) => (
        <Label key={n} text={n} x={0.5 + xs[i] / 1920 + (i - 1) * 0.0} y={0.88} size={0.045} kind="box" pin at={at(547.0 + i * 0.25)} />
      ))}
      <Label text="MORE LAUNCHES THAN ANY COUNTRY" x={0.5} y={0.1} size={0.055} kind="box" at={at(548.2)} />
    </AbsoluteFill>
  );
};

// 550.42 "And its Starlink satellites, thousands of them, beam internet to people all over the world."
export const StarlinkShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const n = Math.round(interpolate(t, [550.4, 553.0], [8, 34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05) }} light={{ dir: [-0.7, 0.5] }} vignette={0.65}>
        <SpaceSet earth={false}>
          <Globe r={380} lon0={-40 + frame * 0.4} lat0={20} />
          {Array.from({ length: n }, (_, i) => {
            const shell = i % 3;
            const a = (i * 2.399) + frame * (0.01 + shell * 0.003);
            const rx = 470 + shell * 70;
            const tilt = -0.5 + (i % 7) * 0.17;
            const x = Math.cos(a) * rx;
            const y = Math.sin(a) * rx * 0.35 + Math.cos(a) * rx * tilt * 0.3;
            const front = Math.sin(a) < 0;
            return (
              <X key={i} x={x} y={y} s={0.26} rot={-0.2} z={front ? 2 : -1}>
                <StarlinkSat />
              </X>
            );
          })}
          {t > 553.3
            ? [[-0.5, 0.4], [0.2, 0.3], [0.6, -0.2], [-0.2, -0.5]].map(([lx, ly], i) => {
                const ph = ((frame * 0.04 + i * 0.25) % 1);
                return <Glow key={i} x={lx * 330} y={ly * 330} rx={30 + ph * 90} color="#9fe3ff" alpha={0.55 * (1 - ph)} additive z={1.5} />;
              })
            : null}
        </SpaceSet>
      </Stage>
      <Label text="STARLINK" x={0.1} y={0.1} size={0.065} kind="box" at={at(550.75)} />
      <Label text="THOUSANDS OF SATELLITES" x={0.9} y={0.86} size={0.05} kind="box" at={at(552.2)} />
    </AbsoluteFill>
  );
};

// 555.86 "When Russia invades Ukraine in 2022, Starlink helps keep Ukraine online."
export const UkraineShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const ppd = interpolate(frame, [0, dur], [26, 30]);
  const center: [number, number] = [31, 48.5];
  const [kx, ky] = worldXY(CITY.kyiv[0], CITY.kyiv[1], ppd, center);
  const p = sc(kx, ky + 260);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <WorldMap ppd={ppd} center={center} w={2600} h={1600} tint={{ Ukraine: "#3a7ac9" }} tintK={ramp(t, 556.6, 557.2)} />
        <X x={kx} y={ky - 40} s={pop(t, 558.9) * 0.9} z={2}>
          <Dish signal={1} />
        </X>
      </Stage>
      <Label text="UKRAINE, 2022" x={p.x} y={p.y} size={0.055} kind="box" pin at={at(557.22)} />
      <Label text="KEPT ONLINE BY STARLINK" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(559.9)} />
    </AbsoluteFill>
  );
};

export const _unusedE = { Wash, Exhaust, Splash, Cloud, Sun, MoneyBag, STAFF, Book, Flash, globeXY, CITY, Planet, ELON_TEE };
