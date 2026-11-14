import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, InkLine, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  PostCard, BallotBox, Cash, Banknote, Bars, DogeBadge, Chainsaw, Doc, Box, StoreFront, LineChart, SedanEV, USFlag, Medal, Lectern, Falcon1, Falcon9, FalconHeavy, StarshipStack,
  Starship, SuperHeavy, LaunchTower, LaunchPad, Fireball, Smoke, Planet, Robotaxi, Bell, XMark, Phone, Magazine, GoldCoin, CourtroomSet, OvalOfficeSet, StageSet, Skyline,
  Calendar, Room, Stars, Exhaust, MoneyBag, Bird, LandingPad,
} from "../../kit/env";
import { sec, pop, useScr, GrowArrow } from "../../kit/shot";
import { IslandSet, SeaSet, HighSky, SpaceSet, Paper, Office, ChipsTable, SchoolSet, Outdoors, SkyBack, DashArrow, RoadSet, Flash, usdFull } from "./sets";
import { ELON_X, ELON_2008, ELON_SCHOOL, ELON_FORMAL, TRUMP, SUIT, STAFF, PERSON, ENGINEER, ASTRONAUT, WORKER } from "./cast";
import { upright } from "./actA";
import { MarketWall, StockLine, MARKET_GREEN, MARKET_RED } from "../../kit/env/market";

// Politics (2024–2026), Starship and the catch, the trillion-dollar year, the
// jury, Mars → Moon, and the ending: the rule, the bets, the question.

/** Capitol-style domed building (generic). Origin = ground centre. */
const DomeBuilding: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(2000, 360, 6)} color="#efe9dc" shade={0.15} y={180} />
    {Array.from({ length: 13 }, (_, i) => (
      <Part key={i} shape={roundRect(34, 260, 6)} color="#f8f4ea" shade={0.15} x={-780 + i * 130} y={180} z={0.001} />
    ))}
    <Part shape={roundRect(900, 200, 6)} color="#efe9dc" shade={0.15} y={460} z={0.002} />
    <Part shape={poly(Array.from({ length: 25 }, (_, i) => [Math.cos((i / 24) * Math.PI) * 360, 560 + Math.sin((i / 24) * Math.PI) * 330] as [number, number]))} color="#f4efe2" shade={0.24} z={0.003} />
    <Part shape={roundRect(70, 120, 10)} color="#efe9dc" shade={0.2} y={950} z={0.004} />
  </X>
);

/** Rally stage with flags and a crowd of heads in front. */
const RallySet: React.FC<{ frame: number; children?: React.ReactNode }> = ({ frame, children }) => (
  <>
    <SkyBack mood="day" horizon={-300} />
    <Part shape={roundRect(3000, 900, 8)} color="#2a3358" shade={0.12} y={150} z={-30} />
    {[-1100, -400, 400, 1100].map((x) => (
      <USFlag key={x} x={x} y={430} w={300} z={-29} />
    ))}
    <Part shape={roundRect(6000, 300, 0)} color="#5a4a3a" flat outline={5} y={-300} z={-25} />
    {children}
    {Array.from({ length: 9 }, (_, i) => (
      <Part key={i} shape={circle(130)} color={["#2a2228", "#3a2e2a", "#2e2a30"][i % 3]} flat outline={0} x={-1200 + i * 300} y={-640 + (i % 2) * 40 + Math.abs(Math.sin(frame * 0.2 + i)) * 10} z={5} />
    ))}
  </>
);

/** Big scissors (open amount `k`). */
const Scissors: React.FC<{ k?: number; x?: number; y?: number; s?: number; rot?: number; z?: number }> = ({ k = 0.5, x = 0, y = 0, s = 1, rot = 0, z = 0 }) => (
  <X x={x} y={y} s={s} rot={rot} z={z}>
    {[-1, 1].map((sd) => (
      <X key={sd} rot={sd * k * 0.35}>
        <Part shape={poly([[0, -8], [360, -4], [360, 4], [0, 8]])} color="#c9ced6" shade={0.25} />
        <Part shape={ellipse(60, 40)} color="#c8262f" shade={0.2} x={-90} y={sd * 40} />
        <Part shape={ellipse(32, 20)} color="#e8e2d8" flat outline={3} x={-90} y={sd * 40} z={0.001} />
      </X>
    ))}
    <Part shape={circle(14)} color="#5a5e66" flat outline={3} z={0.01} />
  </X>
);

/** Flag / banner for a new party (stars on stripes, no text). */
const PartyBanner: React.FC<{ droop?: number; frame: number }> = ({ droop = 0, frame }) => (
  <X rot={-droop * 0.6} y={-droop * 300}>
    <Line pts={[[-560, -420], [-560, 520]]} width={18} color="#8a6a4a" />
    <X x={-550} y={500} rot={Math.sin(frame * 0.1) * 0.02}>
      <Part shape={roundRect(1000, 560, 10)} color="#f4f1ea" shade={0.15} x={500} y={-280} />
      {[0, 1, 2].map((i) => (
        <Part key={i} shape={roundRect(1000, 90, 0)} color="#c8262f" flat outline={0} x={500} y={-100 - i * 180} z={0.001} />
      ))}
      <Part shape={roundRect(360, 300, 6)} color="#2a3358" flat outline={4} x={190} y={-160} z={0.002} />
      {Array.from({ length: 9 }, (_, i) => (
        <Part key={i} shape={circle(14)} color="#f4f1ea" flat outline={0} x={80 + (i % 3) * 110} y={-70 - Math.floor(i / 3) * 90} z={0.003} />
      ))}
    </X>
  </X>
);

/** A 20-storey tower block (for scale). Origin = ground centre. */
const Tower20: React.FC<{ h?: number; x?: number; y?: number; z?: number }> = ({ h = 1000, x = 0, y = 0, z = 0 }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(360, h, 6)} color="#8a9ab0" shade={0.18} y={h / 2} />
    {Array.from({ length: 20 }, (_, i) =>
      [-1, 0, 1].map((c) => <Part key={`${i}${c}`} shape={roundRect(60, (h / 20) * 0.5, 3)} color="#cfe0f0" flat outline={0} x={c * 100} y={(h / 20) * (i + 0.5)} z={0.001} />),
    )}
  </X>
);

/** Big round button (for the final question). */
const BigButton: React.FC<{ color: string; s?: number; x?: number; y?: number; press?: number }> = ({ color, s = 1, x = 0, y = 0, press = 0 }) =>
  s > 0.01 ? (
    <X x={x} y={y} s={s}>
      <Part shape={ellipse(300, 110)} color="#2a2a30" shade={0.2} y={-40} />
      <Part shape={ellipse(240, 90)} color={color} shade={0.25} y={10 - press * 30} z={0.001} />
      <Part shape={roundRect(480, 80, 0)} color={color} shade={0.2} y={-30 - press * 15} z={0.0005} opacity={0.0} />
    </X>
  ) : null;

// ───────────────────────── politics ─────────────────────────

// 700.96 "Then he goes all in on something new. Politics."
export const PoliticsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 160 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <SkyBack mood="dusk" horizon={-420} sunX={-900} />
        <DomeBuilding y={-420} s={0.9} z={-30} />
        <Part shape={roundRect(6000, 1200, 0)} color="#7a8a6a" flat outline={5} y={-1020} z={-25} />
        <Character {...ELON_X(true)} x={interpolate(frame, [0, dur], [-1300, -700])} y={-880} s={1.9} look={0.6} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.walk(frame, 0.9)} z={2} />
      </Stage>
      <Label text="SOMETHING NEW" x={0.1} y={0.1} size={0.05} kind="box" at={at(702.6)} />
      <Label text="POLITICS" x={0.5} y={0.86} size={0.09} kind="stamp" at={at(703.75)} />
    </AbsoluteFill>
  );
};

// 704.96 "In July 2024, minutes after someone tries to kill Donald Trump at a rally,"
export const RallyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <RallySet frame={frame}>
          <Lectern x={0} y={-300} s={1.1} z={1} />
          <Character {...TRUMP} x={-60} y={-300} s={1.5} look={0.4} expression={{ eyes: "open", mouth: "teeth", brows: -0.6 }} pose={{ ...poses.idle(frame, 2), armF: [2.5, 0.45], handF: "fist" }} z={0.5} />
          {[-520, 460].map((x, i) => (
            <Character key={x} {...SUIT(i)} outfit={{ top: "#1f1f25", shirt: "#f4f4f2", tie: "#1f1f25", bottom: "#1f1f25", boots: "#18181c" }} glasses="#1a1a1a" x={x} y={-300} s={1.35} facing={x < 0 ? 1 : -1} look={0.4} expression={{ eyes: "open", mouth: "flat", brows: -0.5 }} pose={poses.idle(frame, i)} z={0.4} />
          ))}
        </RallySet>
      </Stage>
      <Label text="JULY 2024" x={0.1} y={0.1} size={0.06} kind="box" at={at(705.1)} />
      <Label text="AN ATTEMPT ON TRUMP'S LIFE" x={0.9} y={0.1} size={0.05} kind="box" at={at(707.6)} />
    </AbsoluteFill>
  );
};

// 709.60 "Musk endorses him."
export const EndorseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Part shape={roundRect(4000, 3000, 0)} color="#15181d" flat outline={0} z={-41} />
        <PostCard w={1300} h={420} avatar="#1f1f25" dark lines={3} s={pop(t, 709.6)} />
      </Stage>
      <Label text="MUSK ENDORSES TRUMP" x={0.5} y={0.86} size={0.065} kind="stamp" at={sec(start)(709.7)} />
    </AbsoluteFill>
  );
};

// 710.98 "He spends about 277 million dollars to help elect Trump and other Republicans."
export const DonateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper>
          {/* box raised and smaller so the bottom label band stays clear */}
          <BallotBox x={320} y={-270} s={1.4} drop={(t * 1.5) % 1} z={1} />
          {Array.from({ length: 10 }, (_, i) => {
            const k = ((frame * 0.03 + i / 10) % 1);
            return <Banknote key={i} x={interpolate(k, [0, 1], [-390, 300])} y={interpolate(k, [0, 0.5, 1], [-360, 300, 30])} rot={k * 4 + i} s={0.6} z={2} />;
          })}
          {/* x -650 keeps the whole head in frame through the push-in */}
          <Character {...ELON_X(true)} x={-650} y={-620} s={1.5} look={0.6} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.holdOut} z={3} />
        </Paper>
      </Stage>
      <Label text="ABOUT $277 MILLION" x={0.1} y={0.1} size={0.065} kind="box" at={at(711.8)} />
      <Label text="TO ELECT TRUMP AND OTHER REPUBLICANS" x={0.9} y={0.86} size={0.05} kind="box" at={at(714.5)} />
    </AbsoluteFill>
  );
};

// 716.97 "That makes him the biggest donor of the 2024 election."
export const BiggestDonorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <Bars y={-380} w={1500} h={760} values={[1, 0.38, 0.3, 0.22, 0.15]} colors={["#c8262f", "#9aa0aa", "#9aa0aa", "#9aa0aa", "#9aa0aa"]} k={ramp(t, 717.0, 718.6)} />
        </Paper>
      </Stage>
      <Label text="MUSK" x={0.5 - 0.31} y={0.9} size={0.045} kind="box" pin at={at(717.5)} />
      <Label text="THE BIGGEST DONOR OF THE 2024 ELECTION" x={0.5} y={0.1} size={0.055} kind="box" at={at(718.2)} />
    </AbsoluteFill>
  );
};

// 720.64 "After Trump wins, Musk is put in charge of a new team called DOGE."
export const DogeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <OvalOfficeSet y={-420}>
          <Character {...TRUMP} x={-460} y={-160} s={1.55} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.point(frame)} z={0.5} />
          <Character {...ELON_X(true)} x={300} y={-160} s={1.55} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.idle(frame, 3)} z={0.5} />
          <DogeBadge x={-80} y={640} r={150 * pop(t, 724.05)} z={1} />
        </OvalOfficeSet>
      </Stage>
      <Label text="AFTER TRUMP WINS" x={0.1} y={0.1} size={0.05} kind="box" at={at(720.8)} />
      <Label text="DOGE" x={0.9} y={0.1} size={0.07} kind="box" at={at(724.1)} />
    </AbsoluteFill>
  );
};

// 724.83 "That's short for the Department of Government Efficiency. Its job is to cut government spending."
export const DepartmentShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const cut = ramp(t, 728.9, 729.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper>
          <DogeBadge x={-560} y={140} r={230} />
          <X x={420} y={-80}>
            <X x={0} y={cut * 30} rot={-cut * 0.1} z={0.01}>
              <Doc w={420} lines={8} y={0} />
            </X>
            <Scissors x={-60} y={-120 + cut * 260} rot={-1.4} k={0.6 - Math.abs(Math.sin(frame * 0.5)) * 0.5 * Math.min(1, cut * 3)} s={1.1} z={0.02} />
          </X>
        </Paper>
      </Stage>
      <Label text="DEPARTMENT OF GOVERNMENT EFFICIENCY" x={0.5} y={0.1} size={0.05} kind="box" at={at(725.8)} />
      <Label text="CUT GOVERNMENT SPENDING" x={0.85} y={0.86} size={0.06} kind="stamp" at={at(728.95)} />
    </AbsoluteFill>
  );
};

// 730.56 "At first, he talks about saving 2 trillion dollars. Later, he lowers that goal."
export const TwoTrillionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const grow = ramp(t, 731.95, 732.7, Easing.out(Easing.cubic));
  const lower = ramp(t, 734.1, 735.0, Easing.out(Easing.cubic));
  const H = 700;
  const base = -440;
  const h = Math.max(8, H * grow * (1 - lower * 0.72));
  const tag = sc(0, base + H + 70, zoom);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <InkLine pts={[[-1100, base], [1100, base]]} width={14} color="#6a5a4a" outline={5} z={0.5} />
          {lower > 0 ? <Part shape={roundRect(460, H, 14)} color="#cfe3d2" flat outline={6} y={base + H / 2} z={0.1} /> : null}
          <Part shape={roundRect(460, h, 14)} color="#3fa07a" shade={0.18} y={base + h / 2} z={0.2} />
          {lower > 0 ? <GrowArrow pts={[[330, base + H - 20], [330, base + H * 0.3]]} k={lower} color="#d8322f" width={30} z={0.6} /> : null}
        </Paper>
      </Stage>
      <Label text="$2,000,000,000,000" x={tag.x} y={tag.y} size={0.085} kind="hand" color="#2a2026" pin at={at(732.2)} />
      <Label text="GOAL: SAVE $2 TRILLION" x={0.1} y={0.1} size={0.055} kind="box" at={at(731.97)} />
      <Label text="LATER: A LOWER GOAL" x={0.9} y={0.86} size={0.055} kind="stamp" at={at(734.2)} />
    </AbsoluteFill>
  );
};

// 735.42 "At a conference in February 2025, he waves a chainsaw on stage, a gift from Argentina's president."
export const ChainsawShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const raise = ramp(t, 737.9, 738.4);
  const wave = Math.sin(frame * 0.35) * 0.18 * raise;
  const arm: [number, number] = [0.6 + raise * 1.6 + wave, 0.4 - raise * 0.25];
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 80 }}
        light={{ dir: [-0.4, 0.8] }}
        vignette={0.7}
        bgBlur={5}
        bg={<StageSet curtain="#1e2a4a" spots={1} y={-500} />}
        fg={
          <>
            {[-800, -420, 0, 420, 800].map((x, i) => (
              <Part key={x} shape={circle(170)} color="#141018" flat outline={0} x={x} y={-640 + (i % 2) * 30} />
            ))}
          </>
        }
        fgBlur={10}
      >
        <Character
          {...ELON_X(true)}
          x={-40}
          y={-520}
          s={1.75}
          look={0.6}
          expression={{ eyes: "happy", mouth: "grin" }}
          pose={{ ...poses.idle(frame, 2), armF: arm, armB: [-0.5, -0.4], handF: "fist" }}
          holdF={<Chainsaw s={0.62} rot={upright(arm) + 0.9} run={raise} />}
        />
      </DepthStage>
      <Label text="FEBRUARY 2025" x={0.1} y={0.1} size={0.06} kind="box" at={at(736.2)} />
      <Label text="A CHAINSAW ON STAGE" x={0.9} y={0.1} size={0.05} kind="box" at={at(738.3)} />
      <Label text="A GIFT FROM ARGENTINA'S PRESIDENT" x={0.5} y={0.86} size={0.05} kind="box" at={at(740.0)} />
    </AbsoluteFill>
  );
};

// 741.87 "DOGE cancels contracts and cuts thousands of government jobs."
export const CancelsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const arm: [number, number] = [0.9, 1.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Outdoors mood="day" horizon={-300} ground="#a8a49a" />
        <DomeBuilding y={-300} s={0.55} x={600} z={-30} />
        {[-700, -280, 140].map((x, i) => (
          <Character key={x} {...WORKER(i)} x={x + interpolate(t, [741.8, 745.4], [0, -260])} y={-620} s={1.4} facing={-1} look={0.5} expression={{ eyes: "sad", mouth: "frown" }} pose={{ ...poses.walk(frame + i * 7, 0.8), armF: arm, armB: [arm[0] - 0.1, arm[1]] }} holdF={<X rot={upright(arm)}><Box w={200} h={140} y={-110} /></X>} z={2} />
        ))}
        {[0, 1, 2].map((i) => (
          <X key={i} x={-760 + i * 320} y={220} s={pop(t, 742.3 + i * 0.2) * 0.75} rot={(i - 1) * 0.08} z={3}>
            <Doc w={300} lines={6} />
          </X>
        ))}
      </Stage>
      {[0, 1, 2].map((i) => (
        <Label key={i} text="CANCELLED" x={0.5 + (-760 + i * 320) / 1920 / 1.0} y={0.5 - 220 / 1080} size={0.035} kind="stamp" pin at={sec(start)(742.4 + i * 0.2)} />
      ))}
      <Label text="THOUSANDS OF JOBS CUT" x={0.9} y={0.86} size={0.05} kind="box" at={at(743.9)} />
    </AbsoluteFill>
  );
};

/** A cheering (or frowning) crowd in two staggered rows. */
const Crowd: React.FC<{ frame: number; cheer?: boolean; x0?: number; x1?: number; seed?: number; n?: number; mood?: "cheer" | "frown" }> = ({ frame, x0 = -900, x1 = 900, seed = 0, n = 7, mood = "cheer" }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const row = i % 2;
      const x = x0 + ((i + 0.5) / n) * (x1 - x0);
      return (
        <Character
          key={i}
          {...PERSON(i + seed)}
          x={x}
          y={row ? -500 : -640}
          s={row ? 1.05 : 1.25}
          facing={x < (x0 + x1) / 2 ? 1 : -1}
          look={0.4}
          expression={mood === "cheer" ? { eyes: "happy", mouth: "grin" } : { eyes: "angry", mouth: "frown", brows: -0.7 }}
          pose={mood === "cheer" ? poses.armsUp(frame + i * 9) : poses.handsOnHips}
          z={row ? 0.5 : 1}
        />
      );
    })}
  </>
);

// 745.54 "His fans cheer."
export const FansCheerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Outdoors mood="day" horizon={-300} ground="#8a9a6a" />
        <Crowd frame={frame} n={8} />
      </Stage>
      <Label text="HIS FANS CHEER" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(745.6)} />
    </AbsoluteFill>
  );
};

// 746.78 "Protesters gather outside Tesla stores, and Tesla's sales drop."
export const ProtestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const arm: [number, number] = [2.4, 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Outdoors mood="day" horizon={-420} ground="#a8a49a" />
        <StoreFront y={-420} w={2200} h={1000} z={-30}>
          <SedanEV x={0} y={0} s={1.1} color="#c8262f" />
        </StoreFront>
        {Array.from({ length: 6 }, (_, i) => {
          const x = -1100 + i * 440;
          return (
            <Character
              key={i}
              {...PERSON(i + 2)}
              x={x}
              y={-700 + (i % 2) * 40}
              s={1.3}
              facing={i % 2 ? -1 : 1}
              look={0.4}
              expression={{ eyes: "angry", mouth: "shout", brows: -0.6 }}
              pose={{ ...poses.idle(frame, i), armF: [arm[0] + Math.sin(frame * 0.3 + i) * 0.1, arm[1]], bob: Math.abs(Math.sin(frame * 0.25 + i)) * 8 }}
              holdF={<X rot={upright(arm)}><Line pts={[[0, 0], [0, 200]]} width={10} color="#a0703f" /><Part shape={roundRect(170, 120, 8)} color="#f8f4ea" shade={0.12} y={250} /></X>}
              z={2 + (i % 2) * 0.1}
            />
          );
        })}
        <X x={620} y={360} s={pop(t, 749.5) * 0.55} z={4}>
          <Part shape={roundRect(944, 564, 20)} color="#2a2b30" shade={0.12} outline={8} />
          <Part shape={roundRect(900, 520, 8)} color="#141518" flat outline={0} z={0.001} />
          <StockLine w={760} h={360} values={[0.8, 0.82, 0.7, 0.55, 0.42, 0.3]} k={ramp(t, 749.5, 750.6)} color={MARKET_RED} width={12} seed={6} z={0.002} />
        </X>
      </Stage>
      <Label text="PROTESTS AT TESLA STORES" x={0.1} y={0.1} size={0.05} kind="box" at={at(747.4)} />
      <Label text="SALES DROP" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(749.7)} />
    </AbsoluteFill>
  );
};

// 751.08 "At the end of May 2025, he leaves DOGE."
export const LeavesDogeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const arm: [number, number] = [0.9, 1.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 40 }} light={{ dir: [0.6, 0.5] }} vignette={0.6}>
        <SkyBack mood="dusk" horizon={-420} sunX={800} />
        <DomeBuilding y={-420} s={0.75} x={-300} z={-30} />
        <Part shape={roundRect(6000, 1200, 0)} color="#8a8a80" flat outline={5} y={-1020} z={-25} />
        <Character {...ELON_X(true)} x={interpolate(frame, [0, dur], [-100, 520])} y={-720} s={1.7} look={0.6} expression={{ eyes: "half", mouth: "flat" }} pose={{ ...poses.walk(frame, 0.9), armF: arm, armB: [arm[0] - 0.1, arm[1]] }} holdF={<X rot={upright(arm)}><Box w={220} h={150} y={-110} /><DogeBadge r={46} y={-30} /></X>} z={2} />
      </Stage>
      <Label text="END OF MAY 2025" x={0.1} y={0.1} size={0.06} kind="box" at={at(751.4)} />
      <Label text="HE LEAVES DOGE" x={0.9} y={0.86} size={0.06} kind="stamp" at={at(753.2)} />
    </AbsoluteFill>
  );
};

/** One half of a split screen (left/right) drawn as its own stage. */
const Half: React.FC<{ side: "left" | "right"; children: React.ReactNode; bg: string }> = ({ side, children, bg }) => (
  <AbsoluteFill style={{ clipPath: side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}>
    <Stage camera={{ zoom: 1, x: side === "left" ? 0 : 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
      <Part shape={roundRect(4000, 3000, 0)} color={bg} flat outline={0} z={-41} />
      {children}
    </Stage>
  </AbsoluteFill>
);

// 754.38 "Days later, he and Trump have a huge public fight over Trump's big spending bill."
export const FightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const armT: [number, number] = [1.15, 1.0 + Math.sin(frame * 0.9) * 0.08];
  const armE: [number, number] = [1.15, 1.0 + Math.cos(frame * 0.8) * 0.08];
  return (
    <AbsoluteFill>
      <Half side="left" bg="#c8462f">
        <Character {...TRUMP} x={-560} y={-620} s={1.7} look={0.6} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={{ ...poses.idle(frame, 1), armF: armT }} holdF={<Phone w={110} rot={upright(armT)} glow={0.4} />} z={1} />
      </Half>
      <Half side="right" bg="#2a3a6a">
        <Character {...ELON_X(true)} x={560} y={-620} s={1.7} facing={-1} look={0.6} expression={{ eyes: "angry", mouth: "teeth", brows: -0.9 }} pose={{ ...poses.idle(frame, 2), armF: armE }} holdF={<Phone w={110} rot={upright(armE)} glow={0.4} />} z={1} />
      </Half>
      <AbsoluteFill>
        <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0} grain={0} transparent>
          <Line pts={[[0, -600], [0, 600]]} width={14} color="#f4f1ea" />
          {[0, 1, 2, 3].map((i) => {
            const k = ((frame * 0.03 + i / 4) % 1);
            const dir = i % 2 ? 1 : -1;
            return <PostCard key={i} x={dir * interpolate(k, [0, 1], [-500, 500])} y={200 + (i - 1.5) * 120} w={300} h={110} dark={dir > 0} s={0.8} rot={dir * 0.05} />;
          })}
        </Stage>
      </AbsoluteFill>
      <Label text="A HUGE PUBLIC FIGHT" x={0.5} y={0.1} size={0.06} kind="box" at={at(756.6)} />
      <Label text="OVER TRUMP'S BIG SPENDING BILL" x={0.5} y={0.86} size={0.05} kind="box" at={at(757.6)} />
    </AbsoluteFill>
  );
};

// 759.07 "Trump threatens to cancel SpaceX's government contracts."
export const ThreatShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const shake = t > 760.3 ? Math.sin(frame * 2.5) * 0.04 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <OvalOfficeSet y={-420}>
          <Character {...TRUMP} x={-460} y={-160} s={1.6} look={0.6} expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={poses.point(frame)} z={0.5} />
          <X x={460} y={420} rot={shake} z={1}>
            <Doc w={420} lines={7} />
          </X>
        </OvalOfficeSet>
      </Stage>
      <Label text="SPACEX CONTRACTS" x={0.5 + 460 / 1920} y={0.86} size={0.045} kind="box" pin at={at(760.3)} />
      <Label text="TRUMP THREATENS TO CANCEL" x={0.1} y={0.1} size={0.05} kind="box" at={at(759.4)} />
    </AbsoluteFill>
  );
};

// 762.39 "Musk says Trump wouldn't have won without him."
export const WouldntWonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65} bgBlur={7} bg={<Office era="2020" />}>
        <Character {...ELON_X(true)} x={-260} y={-720} s={2.4} look={0.5} talking expression={{ eyes: "half", mouth: "smirk", brows: -0.5 }} pose={poses.talk(frame, 2)} />
      </DepthStage>
      <Label text="MUSK: TRUMP WOULDN'T HAVE WON WITHOUT HIM" x={0.85} y={0.86} size={0.045} kind="box" at={at(762.7)} />
    </AbsoluteFill>
  );
};

// 764.78 "Musk even announces his own political party, the America Party. But it never gets going."
export const AmericaPartyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SkyBack mood="day" horizon={-420} />
        <Part shape={roundRect(6000, 1200, 0)} color="#8a9a6a" flat outline={5} y={-1020} z={-25} />
        <X y={-200} s={pop(t, 765.05)}>
          <PartyBanner droop={ramp(t, 768.4, 769.4, Easing.in(Easing.quad))} frame={frame} />
        </X>
      </Stage>
      <Label text="THE AMERICA PARTY" x={0.5} y={0.1} size={0.065} kind="box" at={at(767.3)} />
      <Label text="IT NEVER GETS GOING" x={0.85} y={0.86} size={0.06} kind="stamp" at={at(768.7)} />
    </AbsoluteFill>
  );
};

// 769.70 "By 2026, he's back."
export const BackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <RallySet frame={frame}>
          <Character {...ELON_X(true)} x={0} y={-300} s={1.6} look={0.2} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={0.5} />
        </RallySet>
      </Stage>
      <Label text="2026" x={0.1} y={0.1} size={0.06} kind="box" at={at(769.85)} />
      <Label text="HE'S BACK" x={0.9} y={0.1} size={0.07} kind="box" at={at(771.1)} />
    </AbsoluteFill>
  );
};

// 772.04 "In the midterm elections, he's once again the biggest single donor, backing Republicans."
export const MidtermsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper>
          <BallotBox x={-340} y={-460} s={1.5} drop={(t * 1.3) % 1} z={1} />
          <Bars x={520} y={-420} w={700} h={620} values={[1, 0.32, 0.2]} colors={["#c8262f", "#9aa0aa", "#9aa0aa"]} k={ramp(t, 773.6, 774.9)} />
        </Paper>
      </Stage>
      <Label text="THE MIDTERM ELECTIONS" x={0.1} y={0.1} size={0.055} kind="box" at={at(772.3)} />
      <Label text="BIGGEST SINGLE DONOR" x={0.9} y={0.1} size={0.055} kind="box" at={at(774.3)} />
      <Label text="BACKING REPUBLICANS" x={0.85} y={0.86} size={0.055} kind="stamp" at={at(775.7)} />
    </AbsoluteFill>
  );
};

// 777.01 "And in October, Trump gives him the National Medal of Science."
export const MedalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const put = ramp(t, 778.2, 779.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <OvalOfficeSet y={-420}>
          <Character {...TRUMP} x={-380} y={-160} s={1.6} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={{ ...poses.idle(frame, 1), armF: [1.3 - put * 0.2, 0.35] }} z={0.5} />
          <Character {...ELON_FORMAL} x={260} y={-160} s={1.6} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 3)} z={0.5}>
            {put > 0.9 ? <X x={0} y={200} z={0.5}><Medal y={0} s={0.55} /></X> : null}
          </Character>
          {put <= 0.9 ? <Medal x={interpolate(put, [0, 1], [-140, 250])} y={interpolate(put, [0, 1], [500, 520])} s={0.9} z={1} /> : null}
        </OvalOfficeSet>
      </Stage>
      <Label text="OCTOBER 2026" x={0.1} y={0.1} size={0.06} kind="box" at={at(777.3)} />
      <Label text="NATIONAL MEDAL OF SCIENCE" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(779.0)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Starship ─────────────────────────

// 780.91 "Meanwhile, the rockets keep getting bigger."
export const BiggerRocketsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 200 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <Line pts={[[-1300, -440], [1300, -440]]} width={8} color="#4a3a32" />
          <X s={pop(t, 781.0)}><Falcon1 x={-900} y={-440} h={420} /></X>
          <X s={pop(t, 781.5)}><Falcon9 x={-450} y={-440} h={700} /></X>
          <X s={pop(t, 782.0)}><FalconHeavy x={60} y={-440} h={700} /></X>
          <X s={pop(t, 782.5)}><StarshipStack x={700} y={-440} h={1240} /></X>
        </Paper>
      </Stage>
      <Label text="THE ROCKETS KEEP GETTING BIGGER" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(781.7)} />
    </AbsoluteFill>
  );
};

// 783.43 "Starship is the biggest rocket ever built, made to one day carry people to Mars."
export const StarshipBiggestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.68), y: 380, rot: 0.02 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <SeaSet mood="dusk" horizon={-420}>
          <Planet kind="mars" r={110} x={-900} y={900} z={-35} />
          <Part shape={roundRect(6000, 900, 0)} color="#c8b88a" flat outline={5} y={-870} z={-20} />
          <LaunchTower x={520} y={-420} h={1650} armY={1200} close={0} armLen={360} z={1} />
          <StarshipStack x={0} y={-420} h={1500} z={2} />
        </SeaSet>
      </Stage>
      <Label text="STARSHIP" sub="THE BIGGEST ROCKET EVER BUILT" x={0.1} y={0.1} size={0.065} kind="box" at={at(783.5)} />
      <Label text="MADE FOR MARS" x={0.85} y={0.86} size={0.06} kind="stamp" at={at(787.2)} />
    </AbsoluteFill>
  );
};

// 788.13 "Its first test flight, in 2023, ends in a huge explosion."
export const FirstFlightShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const tumble = ramp(t, 789.8, 791.3, Easing.in(Easing.quad));
  const boom = t > 791.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.72, 0.78), y: 160, shake: hitAt(t, 791.3, 0.5) * 14 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <HighSky alt={0.5}>
          {!boom ? (
            <X x={tumble * 200} y={interpolate(t, [788.0, 791.3], [-500, -200])} rot={tumble * 2.4} z={2}>
              <StarshipStack h={1200} y={-600} thrust={0.9} />
            </X>
          ) : null}
          <Fireball t={ramp(t, 791.3, 792.6, Easing.linear)} x={200} y={-200} s={1.8} z={3} />
        </HighSky>
      </Stage>
      <Flash k={hitAt(t, 791.3, 0.3) * 0.6} />
      <Label text="FIRST TEST FLIGHT, 2023" x={0.1} y={0.1} size={0.055} kind="box" at={at(788.6)} />
      <Label text="A HUGE EXPLOSION" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(791.5)} />
    </AbsoluteFill>
  );
};

// 792.62 "SpaceX calls it a 'rapid unscheduled disassembly.' But they keep trying."
export const RudShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const back = t > 795.9;
  return (
    <AbsoluteFill>
      {!back ? (
        <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
          <HighSky alt={0.5}>
            <Fireball t={0.5 + ramp(t, 792.6, 795.9, Easing.linear) * 0.45} x={0} y={0} s={1.6} z={2} />
          </HighSky>
        </Stage>
      ) : (
        <Stage camera={{ zoom: 1.0, y: -40 }} light={{ dir: [0.6, 0.5] }} vignette={0.6}>
          <FactoryLineup frame={frame} />
        </Stage>
      )}
      <Label text="“RAPID UNSCHEDULED DISASSEMBLY”" x={0.5} y={0.86} size={0.055} kind="box" at={at(793.7)} until={at(795.9)} />
      <Label text="THEY KEEP TRYING" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(796.1)} />
    </AbsoluteFill>
  );
};
/** Engineers back at work beside a new Starship. */
const FactoryLineup: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <Outdoors mood="day" horizon={-420} ground="#b8b090" />
    <Starship x={300} y={-420} h={1100} z={1} />
    {[-760, -420].map((x, i) => (
      <Character key={x} {...ENGINEER(i + 2, false)} hat="hardhat" x={x} y={-620} s={1.4} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={i ? poses.point(frame) : poses.idle(frame, i)} z={2} />
    ))}
  </>
);

// 797.31 "In October 2024, its giant booster comes back from the edge of space."
export const BoosterReturnShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <HighSky alt={interpolate(t, [797.2, 802.4], [1, 0.3])}>
          <X y={interpolate(t, [797.2, 802.4], [80, -420])} z={2}>
            <SuperHeavy h={900} y={0} glow={1} thrust={t > 799.5 ? 1 : 0.35} />
          </X>
        </HighSky>
      </Stage>
      <Label text="OCTOBER 2024" x={0.1} y={0.1} size={0.06} kind="box" at={at(797.5)} />
      <Label text="BACK FROM THE EDGE OF SPACE" x={0.85} y={0.86} size={0.055} kind="box" at={at(800.5)} />
    </AbsoluteFill>
  );
};

// 802.56 "It's as tall as a 20-story building."
export const TwentyStoryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 160 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <Line pts={[[-1300, -440], [1300, -440]]} width={8} color="#4a3a32" />
          <SuperHeavy x={-300} y={-440} h={1050} />
          <X s={pop(t, 803.2)}><Tower20 x={300} y={-440} h={1050} /></X>
        </Paper>
      </Stage>
      <Label text="AS TALL AS A 20-STORY BUILDING" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(803.3)} />
    </AbsoluteFill>
  );
};

// 804.73 "Two huge metal arms on the launch tower catch it in midair. Engineers call them the chopsticks."
export const ChopsticksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const down = ramp(t, 804.6, 806.8, Easing.out(Easing.quad));
  const close = ramp(t, 806.6, 807.2);
  const caught = t > 807.15;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.68), y: 420, shake: hitAt(t, 807.15, 0.4) * 8 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <SeaSet mood="dusk" horizon={-420}>
          <Part shape={roundRect(6000, 900, 0)} color="#c8b88a" flat outline={5} y={-870} z={-20} />
          <LaunchTower x={560} y={-420} h={1650} armY={1250} close={close} armLen={420} z={1} />
          <X y={caught ? 0 : interpolate(down, [0, 1], [1500, 0])} z={1.5}>
            <SuperHeavy x={0} y={-420 + 780} h={900} thrust={caught ? 0 : 0.8} glow={0.6} />
          </X>
        </SeaSet>
      </Stage>
      <Label text="CAUGHT IN MIDAIR" x={0.1} y={0.1} size={0.06} kind="box" at={at(807.2)} />
      <Label text="“THE CHOPSTICKS”" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(809.1)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the trillion-dollar year ─────────────────────────

// 810.72 "In 2025, Tesla starts testing robotaxis, cars with no driver, in Austin, Texas."
export const RobotaxiShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <X x={-((frame * 30) % 400)}>
          <RoadSet horizon={-160} />
        </X>
        <Skyline y={-160} z={-36} hmin={160} hmax={520} />
        <Robotaxi x={0} y={-470} s={1.6} spin={frame * 0.5} lights={0.5} z={5} />
      </Stage>
      <Label text="2025" x={0.1} y={0.1} size={0.06} kind="box" at={at(810.85)} />
      <Label text="ROBOTAXIS: NO DRIVER" x={0.9} y={0.1} size={0.055} kind="box" at={at(813.1)} />
      <Label text="AUSTIN, TEXAS" x={0.85} y={0.86} size={0.06} kind="stamp" at={at(815.6)} />
    </AbsoluteFill>
  );
};

// 816.93 "That November, Tesla's shareholders approve a new pay deal for him."
export const PayDealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -40 }} light={{ dir: [-0.5, 0.7] }} vignette={0.6}>
        <StageSet curtain="#2a2a3a" spots={1} y={-420} />
        {Array.from({ length: 8 }, (_, i) => {
          const row = i % 2;
          const x = -980 + i * 280;
          return (
            <Character
              key={i}
              {...(i % 3 ? SUIT(i) : PERSON(i))}
              x={x}
              y={row ? -480 : -640}
              s={row ? 1.05 : 1.25}
              facing={x < 0 ? 1 : -1}
              look={0.4}
              expression={{ eyes: "happy", mouth: "smile" }}
              pose={poses.blendAt(t, 819.3 + (i % 4) * 0.08, poses.idle(frame, i), { armF: [2.5, 0.4], armB: [-0.2, -0.2] })}
              z={row ? 0.5 : 1}
            />
          );
        })}
      </Stage>
      <Label text="NOVEMBER 2025" x={0.1} y={0.1} size={0.06} kind="box" at={at(817.1)} />
      <Label text="SHAREHOLDERS APPROVE A NEW PAY DEAL" x={0.5} y={0.86} size={0.05} kind="stamp" at={at(819.5)} />
    </AbsoluteFill>
  );
};

// 820.80 "It could give him Tesla shares worth about a trillion dollars. But only if Tesla grows to be worth 8.5 trillion."
export const TrillionSharesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const grow = ramp(t, 821.0, 823.2);
  const target = ramp(t, 824.4, 826.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <Line pts={[[-1200, -440], [1200, -440]]} width={8} color="#4a3a32" />
          <Part shape={roundRect(360, Math.max(6, 300 * grow), 10)} color="#e9ba41" shade={0.2} x={-500} y={-440 + Math.max(6, 300 * grow) / 2} />
          <Part shape={roundRect(360, Math.max(6, 1100 * target), 10)} color="#c8262f" shade={0.2} x={300} y={-440 + Math.max(6, 1100 * target) / 2} opacity={0.85} />
          <SedanEV x={300} y={-440 + 1100 * target + 10} s={0.45 * target + 0.01} color="#e8e8ea" shadow={false} />
        </Paper>
      </Stage>
      <Label text="SHARES WORTH ~$1 TRILLION" x={0.1} y={0.1} size={0.05} kind="box" at={at(822.6)} />
      <Label text="ONLY IF TESLA IS WORTH $8.5 TRILLION" x={0.85} y={0.86} size={0.05} kind="stamp" at={at(826.0)} />
    </AbsoluteFill>
  );
};

// 827.61 "In February 2026, SpaceX merges with xAI, which already owns X. So now his rocket company also owns his social media app."
export const MergerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 829.6, 830.8, Easing.inOut(Easing.cubic));
  const merged = t > 830.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper>
          {!merged ? (
            <>
              <X x={interpolate(k, [0, 1], [-560, -10])} z={1}>
                <Part shape={roundRect(480, 380, 30)} color="#1f1f25" shade={0.2} />
                <Falcon9 h={300} y={-150} stage1={false} z={0.01} />
              </X>
              <X x={interpolate(k, [0, 1], [560, 10])} z={1}>
                <Part shape={roundRect(480, 380, 30)} color="#2a3a6a" shade={0.2} />
                <XMark size={180} color="#f4f4f6" z={0.01} />
              </X>
            </>
          ) : (
            <X s={pop(t, 830.8)} z={1}>
              <Part shape={roundRect(900, 420, 40)} color="#1f1f25" shade={0.2} />
              <Falcon9 h={300} x={-200} y={-150} z={0.01} />
              <XMark size={180} color="#f4f4f6" x={200} z={0.01} />
            </X>
          )}
        </Paper>
      </Stage>
      <Label text="FEBRUARY 2026" x={0.1} y={0.1} size={0.06} kind="box" at={at(827.9)} />
      <Label text="SPACEX + xAI" x={0.9} y={0.1} size={0.06} kind="box" at={at(830.6)} />
      <Label text="…WHICH ALREADY OWNS X" x={0.5} y={0.86} size={0.05} kind="box" at={at(832.4)} />
      <Label text="ROCKETS + SOCIAL MEDIA" x={0.5} y={0.86} size={0.05} kind="stamp" at={at(834.5)} />
    </AbsoluteFill>
  );
};

/** Stock exchange floor: dark wall with tickers, a bell. */
const IPO_LINE = [0.1, 0.14, 0.12, 0.2, 0.26, 0.38, 0.5, 0.66, 0.8, 0.95];

/** Stock exchange: the trading room with the big market screen; Elon and the bell stand on the floor in front. */
const Exchange: React.FC<{ frame: number; ring?: number; line?: number; children?: React.ReactNode }> = ({ ring = 0, line = 0, children }) => (
  <MarketWall rows={0} clockX={-760} front={<><Bell x={-440} y={-470} s={1.3} ring={ring} z={1} />{children}</>}>
    <StockLine w={1180} h={380} y={60} values={IPO_LINE} k={line} seed={21} />
  </MarketWall>
);

// 837.21 "Then, on June 12, 2026, SpaceX starts selling shares on the stock market."
export const SpaceXIPOShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.92, 0.98);
  const title = sc(230, 190 + 240, zoom, 0, 60);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Exchange frame={frame} ring={t > 840.1 ? 1 : 0} line={ramp(t, 840.2, 842.6, Easing.inOut(Easing.quad)) * 0.45}>
          <Character {...ELON_X(false)} x={40} y={-640} s={1.6} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={t > 840.1 ? poses.armsUp(frame) : poses.idle(frame, 2)} z={2} />
        </Exchange>
      </Stage>
      <Label text="SPACEX" x={title.x} y={title.y} size={0.1} kind="hand" italic pin at={at(840.1)} />
      <Label text="JUNE 12, 2026" x={0.1} y={0.1} size={0.06} kind="box" at={at(838.0)} />
      <Label text="SPACEX GOES PUBLIC" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(840.6)} />
    </AbsoluteFill>
  );
};

// 842.88 "It's the biggest stock market debut in history."
export const BiggestIPOShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.86, 0.92);
  const title = sc(230, 190 + 240, zoom, 0, 40);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <MarketWall rows={2}>
          <StockLine w={1180} h={400} y={-10} values={IPO_LINE} k={0.45 + ramp(t, 842.9, 845.3, Easing.inOut(Easing.quad)) * 0.4} seed={21} />
        </MarketWall>
        {Array.from({ length: 26 }, (_, i) => {
          const y = 760 - ((frame * (7 + (i % 4)) + i * 97) % 1700);
          return <Part key={i} shape={roundRect(30, 50, 5)} color={["#fe5649", "#e9ba41", "#3a7ac9", "#3fa07a"][i % 4]} shade={0.15} outline={4} x={-1150 + i * 92} y={y} rot={frame * 0.08 + i} z={12} />;
        })}
      </Stage>
      <Label text="SPACEX" x={title.x} y={title.y} size={0.1} kind="hand" italic pin at={0} />
      <Label text="THE BIGGEST STOCK MARKET DEBUT IN HISTORY" x={0.5} y={0.86} size={0.055} kind="stamp" at={sec(start)(843.3)} />
    </AbsoluteFill>
  );
};

// 845.56 "It raises 75 billion dollars, and by the end of the day, SpaceX is worth about 2.1 trillion."
export const RaisesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.1, 1.16);
  const cx = 200;
  const cy = 130;
  const v = 1.77e12 + (2.1e12 - 1.77e12) * ramp(t, 846.4, 850.5, Easing.inOut(Easing.cubic));
  const title = sc(230, 190 + 240, zoom, cx, cy);
  const sub = sc(230, 190 + 160, zoom, cx, cy);
  const val = sc(470, 10, zoom, cx, cy);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cx, y: cy }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <MarketWall rows={2}>
          <StockLine w={1180} h={400} y={-10} values={IPO_LINE} k={0.85 + ramp(t, 845.6, 850.6, Easing.inOut(Easing.quad)) * 0.15} seed={21} />
        </MarketWall>
      </Stage>
      <Label text="SPACEX" x={title.x} y={title.y} size={0.1} kind="hand" italic pin at={0} />
      <Label text="MARKET CAP" x={sub.x} y={sub.y} size={0.075} kind="hand" italic pin at={at(845.9)} />
      <Label text={usdFull(Math.round(v / 1e9) * 1e9)} x={val.x} y={val.y} size={0.095} kind="hand" color={MARKET_GREEN} pin at={at(846.2)} />
      <Label text="$75 BILLION RAISED" x={0.1} y={0.1} size={0.06} kind="box" at={at(846.4)} />
    </AbsoluteFill>
  );
};

// 851.73 "Forbes says Elon Musk is now worth about 1.1 trillion dollars. The first trillionaire ever."
export const TrillionaireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0), y: 60 }} light={{ dir: [-0.5, 0.7] }} vignette={0.65}>
        <StageSet curtain="#3a2a12" spots={1} floor="#4a3a22" y={-420} />
        <X y={-420} z={1}>
          {Array.from({ length: 22 }, (_, i) => {
            const row = Math.floor(i / 6);
            return <GoldCoin key={i} x={-500 + (i % 6) * 200 + row * 60 - row * 0} y={40 + row * 70} r={70} edge={0.35} z={i * 0.001} />;
          })}
        </X>
        <Character {...ELON_X(false)} x={0} y={-140} s={1.5} look={0.2} expression={{ eyes: "happy", mouth: "grin" }} pose={t > 855.9 ? poses.armsUp(frame) : poses.idle(frame, 2)} z={2} />
        <Magazine x={-720} y={140} w={380} rot={-0.08} color="#c8262f" z={3} />
      </Stage>
      <Label text="FORBES" x={0.1} y={0.1} size={0.06} kind="box" at={at(851.8)} />
      <Label text="WORTH ABOUT $1.1 TRILLION" x={0.9} y={0.1} size={0.055} kind="box" at={at(854.1)} />
      <Label text="THE FIRST TRILLIONAIRE EVER" x={0.5} y={0.86} size={0.075} kind="stamp" at={at(856.0)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the jury, Mars, the Moon ─────────────────────────

// 857.90 "The same year, a jury finds that two of his tweets during the Twitter deal misled investors."
export const JuryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <CourtroomSet y={-420}>
          {Array.from({ length: 8 }, (_, i) => {
            const row = Math.floor(i / 4);
            return <Character key={i} {...PERSON(i + 1)} x={-1000 + (i % 4) * 230 + row * 115} y={row ? 60 : -60} s={0.95} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.2 }} pose={poses.sit(frame)} z={row ? -0.2 : 0.2} />;
          })}
          <Part shape={roundRect(1150, 200, 10)} color="#6e4426" shade={0.2} x={-640} y={-150} z={0.3} />
          <X x={760} y={500} z={0.5}>
            <PostCard w={560} h={190} avatar="#1f1f25" y={110} />
            <PostCard w={560} h={190} avatar="#1f1f25" y={-110} />
          </X>
        </CourtroomSet>
      </Stage>
      <Label text="A JURY" x={0.1} y={0.1} size={0.06} kind="box" at={at(858.98)} />
      <Label text="TWO TWEETS MISLED INVESTORS" x={0.85} y={0.86} size={0.055} kind="stamp" at={at(861.8)} />
    </AbsoluteFill>
  );
};

// 863.33 "His lawyers say he'll appeal."
export const AppealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <CourtroomSet y={-420}>
          {[-320, 120].map((x, i) => (
            <Character key={x} {...SUIT(i + 1)} x={x} y={-160} s={1.5} look={0.5} talking={i === 0} expression={{ eyes: "open", mouth: "flat", brows: -0.3 }} pose={i === 0 ? poses.talk(frame, 2) : poses.idle(frame, i)} z={0.5} />
          ))}
        </CourtroomSet>
      </Stage>
      <Label text="HIS LAWYERS: WE'LL APPEAL" x={0.5} y={0.1} size={0.055} kind="box" at={at(863.6)} />
    </AbsoluteFill>
  );
};

// 865.33 "And Mars? He wanted to send the first Starships there by the end of 2026. That plan has slipped."
export const MarsSlipShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const slip = ramp(t, 870.2, 871.3, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SpaceSet earth={false}>
          <Planet kind="earth" r={180} x={-760} y={-200} />
          <Planet kind="mars" r={130 - slip * 50} x={560 + slip * 300} y={180 + slip * 120} />
          <X x={-300 + ramp(t, 866.5, 869.5) * 500} y={-60 + ramp(t, 866.5, 869.5) * 160} rot={-1.1} s={0.7} z={2}>
            <Starship h={500} thrust={0.6} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="AND MARS?" x={0.1} y={0.1} size={0.06} kind="box" at={at(865.5)} />
      <Label text="THE PLAN: END OF 2026" x={0.9} y={0.1} size={0.05} kind="box" at={at(868.9)} />
      <Label text="IT HAS SLIPPED" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(870.6)} />
    </AbsoluteFill>
  );
};

// 871.82 "For now, SpaceX is aiming for the Moon first. NASA has already picked Starship to land its astronauts there."
export const MoonFirstShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 160 }} light={{ dir: [-0.7, 0.5] }} vignette={0.65}>
        <Part shape={roundRect(5000, 4000, 0)} color="#05070e" flat outline={0} z={-41} />
        <Stars w={5000} h={3000} y={600} count={120} z={-40} />
        <Planet kind="earth" r={160} x={-760} y={720} z={-35} />
        <Part shape={blob([[-2600, -440], [-1200, -380], [-300, -460], [800, -390], [2600, -450], [2600, -1600], [-2600, -1600]], 8)} color="#b9b6b0" shade={0.12} z={-30} />
        {[[-900, -560, 90], [500, -700, 70], [1200, -520, 50]].map(([x, y, r], i) => (
          <Part key={i} shape={ellipse(r, r * 0.3)} color="#8f8c88" flat outline={4} x={x} y={y} z={-29} />
        ))}
        <Starship x={260} y={-480} h={1150} z={1} />
        {[-500, -230].map((x, i) => (
          <Character key={x} {...ASTRONAUT(i)} x={x} y={-640} s={1.2} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={i ? poses.point(frame) : poses.idle(frame, i)} z={2} />
        ))}
      </Stage>
      <Label text="THE MOON FIRST" x={0.1} y={0.1} size={0.065} kind="box" at={at(873.8)} />
      <Label text="NASA PICKED STARSHIP" sub="TO LAND ITS ASTRONAUTS" x={0.9} y={0.86} size={0.055} kind="box" at={at(876.1)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the ending ─────────────────────────

// 878.56 "So how does a bullied kid from Pretoria become the richest person in history?"
export const HowDoesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Half side="left" bg="#a8543a">
        <Character {...ELON_SCHOOL} x={-480} y={-440} s={1.6} look={0.3} expression={{ eyes: "sad", mouth: "frown", brows: 0.8 }} pose={poses.sit(frame)} z={1} />
      </Half>
      <Half side="right" bg="#2a2a3a">
        <X y={-560}>
          {Array.from({ length: 12 }, (_, i) => (
            <GoldCoin key={i} x={300 + (i % 4) * 150 + Math.floor(i / 4) * 40} y={Math.floor(i / 4) * 60} r={60} edge={0.35} z={i * 0.001} />
          ))}
        </X>
        <Character {...ELON_X(false)} x={520} y={-400} s={1.6} facing={-1} look={0.3} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.idle(frame, 3)} z={1} />
      </Half>
      <AbsoluteFill>
        <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0} grain={0} transparent>
          <Line pts={[[0, -600], [0, 600]]} width={14} color="#f4f1ea" />
        </Stage>
      </AbsoluteFill>
      <Label text="A BULLIED KID FROM PRETORIA" x={0.1} y={0.1} size={0.045} kind="box" at={at(879.3)} />
      <Label text="THE RICHEST PERSON IN HISTORY" x={0.9} y={0.86} size={0.045} kind="box" at={at(881.2)} />
    </AbsoluteFill>
  );
};

// 882.91 "Remember the rule? He goes all in."
export const RuleAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 884.2, 885.1);
  const pushArm: [number, number] = [0.55 + k * 0.55, 0.5 - k * 0.35];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -150 }} light={{ dir: [-0.4, 0.8] }} vignette={0.7}>
        <ChipsTable push={k} y={-640} n={12}>
          <Character {...ELON_X(false)} x={-420} y={-520} s={1.7} look={0.6} expression={{ eyes: "open", mouth: "smirk", brows: -0.4, gaze: [0.6, -0.5] }} pose={{ ...poses.idle(frame, 2), armF: pushArm, armB: [pushArm[0] - 0.2, pushArm[1] + 0.1] }} />
        </ChipsTable>
      </Stage>
      <Label text="REMEMBER THE RULE?" x={0.1} y={0.1} size={0.055} kind="box" at={at(883.0)} />
      <Label text="ALL IN" x={0.5} y={0.86} size={0.09} kind="stamp" at={at(884.6)} />
    </AbsoluteFill>
  );
};

/** One "bet" row: icon → icon, with labels placed by the shot. */
const BetRow: React.FC<{ y: number; k: number; left: React.ReactNode; right: React.ReactNode }> = ({ y, k, left, right }) =>
  k > 0.01 ? (
    <X y={y}>
      <X x={-520} s={Math.min(1, k * 1.6)}>{left}</X>
      <DashArrow from={[-300, 0]} to={[240, 0]} k={Math.max(0, k * 1.6 - 0.4)} />
      <X x={520} s={Math.max(0, Math.min(1, k * 1.6 - 0.6))}>{right}</X>
    </X>
  ) : null;

// 885.59 "Zip2 money into X.com. PayPal money into rockets and electric cars. 44 billion dollars into Twitter. Hundreds of millions into politics."
export const BetsChainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const rows: [number, number][] = [[885.6, 330], [888.0, 110], [890.85, -110], [893.17, -330]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <BetRow y={330} k={ramp(t, 885.6, 886.6)} left={<Cash w={260} n={4} y={-40} />} right={<XMark size={170} color="#2a4a9a" />} />
          <BetRow y={110} k={ramp(t, 888.0, 889.0)} left={<Cash w={260} n={5} y={-40} />} right={<X><Falcon1 x={-90} y={-90} h={190} /><Part shape={roundRect(150, 50, 16)} color="#c8262f" shade={0.2} x={80} y={-50} /></X>} />
          <BetRow y={-110} k={ramp(t, 890.85, 891.85)} left={<MoneyBag s={0.55} y={-80} />} right={<Bird s={0.8} />} />
          <BetRow y={-330} k={ramp(t, 893.17, 894.17)} left={<Cash w={260} n={5} y={-40} />} right={<BallotBox s={0.6} y={-80} />} />
        </Paper>
      </Stage>
      {[
        ["ZIP2 MONEY", "X.COM", 0],
        ["PAYPAL MONEY", "ROCKETS + CARS", 1],
        ["$44 BILLION", "TWITTER", 2],
        ["HUNDREDS OF MILLIONS", "POLITICS", 3],
      ].map(([a, b, i]) => {
        const [tt, y] = rows[i as number];
        return (
          <React.Fragment key={a as string}>
            <Label text={a as string} x={0.5 - 520 / 1920 / 1.05} y={0.5 - (y + 0) / 1080 / 1.05 + 0.065} size={0.036} kind="box" pin at={at(tt + 0.1)} />
            <Label text={b as string} x={0.5 + 520 / 1920 / 1.05} y={0.5 - (y + 0) / 1080 / 1.05 + 0.065} size={0.036} kind="box" pin at={at(tt + 0.6)} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// 895.30 "Some of those bets go wrong. Some make history."
export const WrongHistoryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const land = ramp(t, 896.8, 898.3, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Half side="left" bg="#3a2a2a">
        <Fireball t={0.25 + ramp(t, 895.3, 898.0, Easing.linear) * 0.6} x={-480} y={0} s={1.0} />
      </Half>
      <Half side="right" bg="#0c1128">
        <LandingPad x={480} y={-440} r={320} lights={1} />
        <X x={480} y={interpolate(land, [0, 1], [700, -440])}>
          <Falcon9 h={760} stage1 legs={land} fins={1} soot={0.4} thrust={land < 0.99 ? 0.8 : 0} />
        </X>
      </Half>
      <AbsoluteFill>
        <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0} grain={0} transparent>
          <Line pts={[[0, -600], [0, 600]]} width={14} color="#f4f1ea" />
        </Stage>
      </AbsoluteFill>
      <Label text="SOME GO WRONG" x={0.1} y={0.1} size={0.055} kind="box" at={at(895.5)} />
      <Label text="SOME MAKE HISTORY" x={0.9} y={0.1} size={0.055} kind="box" at={at(897.6)} />
    </AbsoluteFill>
  );
};

// 898.95 "His fans call him a genius. His critics call him reckless."
export const GeniusRecklessShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Half side="left" bg="#3a6a4a">
        <Crowd frame={frame} x0={-940} x1={-60} n={4} />
      </Half>
      <Half side="right" bg="#6a2a2a">
        <Crowd frame={frame} x0={60} x1={940} n={4} seed={4} mood="frown" />
      </Half>
      <AbsoluteFill>
        <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0} grain={0} transparent>
          <Line pts={[[0, -600], [0, 600]]} width={14} color="#f4f1ea" />
        </Stage>
      </AbsoluteFill>
      <Label text="FANS: “GENIUS”" x={0.1} y={0.1} size={0.06} kind="box" at={at(899.96)} />
      <Label text="CRITICS: “RECKLESS”" x={0.9} y={0.1} size={0.06} kind="box" at={at(902.14)} />
    </AbsoluteFill>
  );
};

// 903.04 "But almost everyone agrees on one thing. He never bets small."
export const NeverSmallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 60 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} bgBlur={7} bg={<ChipsTable push={1} y={-640} n={12} />}>
        <Character {...ELON_X(false)} x={-240} y={-720} s={2.45} look={0.55} expression={{ eyes: "open", mouth: "smirk", brows: -0.5, gaze: [0.3, 0.1] }} pose={poses.idle(frame, 4)} />
      </DepthStage>
      <Label text="ONE THING EVERYONE AGREES ON" x={0.9} y={0.1} size={0.045} kind="box" at={at(903.6)} />
      <Label text="HE NEVER BETS SMALL" x={0.85} y={0.86} size={0.075} kind="stamp" at={at(905.5)} />
    </AbsoluteFill>
  );
};

// 907.39 "Remember that engineer on the island in 2008? One more failure, and none of this would have happened."
export const IslandCallbackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }}
        light={{ dir: [0.6, 0.4] }}
        vignette={0.7}
        bgBlur={5}
        bg={<IslandSet mood="dusk" horizon={-120} rocketX={-480} rocketH={760} />}
      >
        <Character {...ENGINEER(0)} x={420} y={-680} s={2.3} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: 0.4, gaze: [0.6, 0.4] }} pose={poses.idle(frame, 1)} />
      </DepthStage>
      <Label text="THE ISLAND, 2008" x={0.1} y={0.1} size={0.055} kind="box" at={at(907.6)} />
      <Label text="ONE MORE FAILURE…" x={0.85} y={0.86} size={0.06} kind="stamp" at={at(910.3)} />
    </AbsoluteFill>
  );
};

// 913.17 "So, imagine you're Elon Musk in 2008. You have one last rocket and almost no money left."
export const LastRocketShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 100 }}
        light={{ dir: [-0.7, 0.4] }}
        vignette={0.75}
        vignetteColor="#05070e"
        bgBlur={4}
        bg={<IslandSet mood="night" horizon={-260} rocketX={-380} rocketH={1100} />}
      >
        <Character {...ELON_2008} x={600} y={-860} s={2.7} facing={-1} look={0.35} expression={{ eyes: "open", mouth: "flat", brows: 0.5, gaze: [0.5, 0.9], eyebags: true }} pose={poses.idle(frame, 6)} />
      </DepthStage>
      <Label text="YOU ARE ELON MUSK, 2008" x={0.1} y={0.1} size={0.05} kind="box" at={at(914.0)} />
      <Label text="ONE LAST ROCKET" x={0.1} y={0.86} size={0.055} kind="box" at={at(916.5)} />
      <Label text="ALMOST NO MONEY" x={0.9} y={0.86} size={0.055} kind="stamp" at={at(917.7)} />
    </AbsoluteFill>
  );
};

// 918.88 "Would you launch it? Or walk away? Tell me in the comments."
export const ChoiceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.04);
  const pa = sc(-460, -60, zoom, 0, 0);
  const pb = sc(460, -60, zoom, 0, 0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.6] }} vignette={0.7} vignetteColor="#05070e">
        <Part shape={roundRect(4000, 3000, 0)} color="#141a2a" flat outline={0} z={-41} />
        <Falcon1 x={0} y={-500} h={900} z={-5} />
        <Glow x={0} y={-60} rx={1100} ry={500} color="#4a6adf" alpha={0.15} additive z={-6} />
        <BigButton color="#d8322f" x={-460} y={-140} s={pop(t, 919.1)} />
        <BigButton color="#7a8090" x={460} y={-140} s={pop(t, 920.1)} />
      </Stage>
      <Label text="LAUNCH IT" x={pa.x} y={pa.y + 0.13} size={0.06} kind="box" pin at={at(919.2)} />
      <Label text="WALK AWAY" x={pb.x} y={pb.y + 0.13} size={0.06} kind="box" pin at={at(920.2)} />
      <Label text="TELL ME IN THE COMMENTS" x={0.5} y={0.14} size={0.075} kind="title" at={at(921.1)} />
    </AbsoluteFill>
  );
};

export const _unusedG = { Wash, Line, Medal, Lectern, Room, Calendar, SchoolSet, LaunchPad, Smoke, Phone, Robotaxi, USFlag, OvalOfficeSet, Glow, STAFF };
