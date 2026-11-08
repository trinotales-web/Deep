import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, QuestionMark, Spear, roundRect, circle, poly, blob, ramp, push, hitAt, absT, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses, reachArm } from "../../kit/character";
import {
  Canoe, Paddle, Ripples, SpanishGalley, Cannon, SpanishFlag, IslandCity, BigLeaf, MayaPyramid, MesoMap, siteXY, StingraySpine, ThornRope, BallCourt, RubberBall,
  Horse, Codex, Flame, Smoke, Globe, Asteroid, SpaceStars, Jungle, Sunburst, PakalLid, Stars,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { LakeSet, JungleSet, PalaceRoom, Paper } from "./sets";
import { ITZA_WARRIOR, SPANISH_SOLDIER, CORTES, MAYA_KING, MAYA_QUEEN, BALLPLAYER, GUERRERO, FRIAR, MAYA_PRIEST } from "./cast";

/** Keep a held prop upright in world space for an arm pose [shoulder, elbow]. */
export const upright = (arm: [number, number]) => -(arm[0] + arm[1]);

/** Paddling arm pose for frame f. */
const paddleArm = (f: number, ph = 0): [number, number] => [1.2 + Math.sin(f * 0.18 + ph) * 0.45, 0.5 + Math.cos(f * 0.18 + ph) * 0.2];

/** An Itza warrior kneeling in a canoe and paddling. Origin = canoe waterline centre. */
export const CanoeWarrior: React.FC<{ x: number; y: number; s: number; z?: number; i?: number; look?: number; paddle?: boolean; expression?: React.ComponentProps<typeof Character>["expression"]; facing?: 1 | -1; ph?: number; canoe?: boolean }> = ({
  x,
  y,
  s,
  z = 0,
  i = 0,
  look = 0.5,
  paddle = true,
  expression = { eyes: "open", mouth: "flat", brows: -0.3 },
  facing = 1,
  ph = 0,
  canoe = true,
}) => {
  const frame = useCurrentFrame();
  const arm = paddle ? paddleArm(frame, ph) : ([0.6, 0.6] as [number, number]);
  return (
    <X x={x} y={y} s={s} z={z} sx={facing}>
      <Character
        {...ITZA_WARRIOR(i)}
        y={-40}
        s={1}
        look={look}
        facing={1}
        expression={expression}
        pose={{ ...poses.sit(frame), armF: arm, armB: [arm[0] - 0.3, arm[1]] }}
        holdF={paddle ? <Paddle rot={upright(arm) + 0.5} s={1.1} /> : null}
      />
      {canoe ? <Canoe y={-20} len={760} z={0.5} /> : null}
    </X>
  );
};

// ───────────────────────── cold open ─────────────────────────

// 0.0 "Imagine you're a warrior of the Itza Maya, in a canoe deep in the jungle of Guatemala."
export const WarriorCanoeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame * 0.08) * 6;
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -60 }}
        light={{ dir: [-0.5, 0.6] }}
        vignette={0.7}
        vignetteColor="#0e1418"
        bgBlur={5}
        bg={<LakeSet mood="dawn" horizon={60} islandX={-560} islandW={900} />}
        fg={
          <>
            <BigLeaf x={1020} y={-620} len={720} rot={0.6} color="#2f6a34" />
            <BigLeaf x={-1050} y={-650} len={640} rot={-0.7} color="#2f6a34" seed={3} />
          </>
        }
      >
        <CanoeWarrior x={220} y={-500 + bob} s={1.95} expression={{ eyes: "open", mouth: "flat", brows: -0.35, gaze: [0.4, 0] }} />
        <Ripples x={220} y={-520} r={500} />
      </DepthStage>
      <Label text="ITZA MAYA" sub="WARRIOR" x={0.2} y={0.12} size={0.06} kind="box" at={sec(start)(1.5)} />
      <Label text="GUATEMALA" x={0.8} y={0.08} size={0.04} kind="box" at={sec(start)(4.0)} />
    </AbsoluteFill>
  );
};

// 4.85 "It's March 1697."
export const March1697Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 80 }} light={{ dir: [-0.6, 0.5] }} vignette={0.6} vignetteColor="#1a1218">
        <LakeSet mood="dawn" horizon={0} islandX={420} islandW={900}>
          {[-520, -180].map((x, i) => (
            <CanoeWarrior key={x} x={x} y={-260 - i * 40} s={0.55 - i * 0.06} i={i + 1} ph={i * 1.3} z={2 + i * 0.1} />
          ))}
          <CanoeWarrior x={-60} y={-380} s={0.7} z={3} />
        </LakeSet>
      </Stage>
      <Label text="MARCH 1697" x={0.5} y={0.14} size={0.1} kind="title" at={sec(start)(5.3)} />
    </AbsoluteFill>
  );
};

// 6.85 "Behind you is your city, on a small island in a lake."
export const IslandRevealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = interpolate(frame, [0, dur], [0, 1], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: interpolate(k, [0, 1], [1.25, 1.05]), x: interpolate(k, [0, 1], [-200, 40]), y: 40 }}
        light={{ dir: [-0.6, 0.5] }}
        vignette={0.6}
        bgBlur={0}
        bg={<LakeSet mood="dawn" horizon={-40} islandX={60} islandW={1500} />}
        fg={<CanoeWarrior x={-760} y={-760} s={1.9} paddle={false} look={0.1} facing={1} canoe={false} />}
        fgBlur={9}
      >
        {null}
      </DepthStage>
      <Label text="NOJPETÉN" sub="ITZA CAPITAL" x={0.62} y={0.12} size={0.06} kind="box" at={sec(start)(8.9)} />
    </AbsoluteFill>
  );
};

// 10.15 "Its temples rise over the water."
export const TemplesRiseShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, dur], [0, 1], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 2.0, x: 60, y: interpolate(k, [0, 1], [40, 240]) }} light={{ dir: [-0.6, 0.5] }} vignette={0.55}>
        <LakeSet mood="dawn" horizon={-40} islandX={60} islandW={1300} />
      </Stage>
    </AbsoluteFill>
  );
};

// 12.1 "In front of you, a big Spanish warship is coming across the lake."
export const WarshipComingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const gx = interpolate(t, [12.1, 15.8], [700, 260]);
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 20 }}
        light={{ dir: [0.6, 0.5] }}
        vignette={0.65}
        bgBlur={0}
        bg={
          <LakeSet mood="day" horizon={40} island={false}>
            <SpanishGalley x={gx} y={-140} s={0.8} sx={-1} z={2} />
            <Ripples x={gx} y={-150} r={420} z={1.9} />
          </LakeSet>
        }
        fg={<CanoeWarrior x={-760} y={-760} s={1.9} paddle={false} look={0.5} canoe={false} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} />}
        fgBlur={7}
      >
        {null}
      </DepthStage>
      <Label text="SPANISH WARSHIP" x={0.62} y={0.12} size={0.055} kind="box" at={sec(start)(13.9)} />
    </AbsoluteFill>
  );
};

// 15.75 "It's full of soldiers, and it has cannons."
export const SoldiersCannonsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cannonK = ramp(t, 17.5, 17.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: interpolate(cannonK, [0, 1], [1.05, 1.5]), x: interpolate(cannonK, [0, 1], [-100, 360]), y: interpolate(cannonK, [0, 1], [-80, -180]) }} light={{ dir: [0.6, 0.5] }} vignette={0.6}>
        <LakeSet mood="day" horizon={260} island={false}>
          <Part shape={roundRect(2400, 120, 10)} color="#5a3a26" shade={0.26} y={-620} z={1} />
          <Part shape={roundRect(2400, 22, 6)} color="#b8322a" flat outline={4} y={-560} z={1.01} />
          {[-820, -440, -60].map((x, i) => (
            <Character
              key={x}
              {...SPANISH_SOLDIER(i)}
              x={x}
              y={-720}
              s={1.3}
              z={1.5 + i * 0.01}
              look={0.5}
              expression={{ eyes: i % 2 ? "angry" : "half", mouth: i % 2 ? "smirk" : "flat", brows: -0.5 }}
              pose={{ ...poses.idle(frame, i), armF: [0.4, 0.4] }}
              holdF={<Spear rot={upright([0.4, 0.4])} length={720} tip="#c9ced6" />}
            />
          ))}
          <Cannon x={560} y={-560} len={360} s={1.3} z={2} fire={0} />
          <Glow x={760} y={-470} rx={160} color="#ffffff" alpha={0.5 * hitAt(t, 17.75, 0.5)} additive z={3} />
        </LakeSet>
      </Stage>
      <Label text="SOLDIERS" x={0.2} y={0.1} size={0.05} kind="box" at={sec(start)(16.3)} />
      <Label text="CANNONS" x={0.78} y={0.12} size={0.06} kind="stamp" rotate={-6} at={sec(start)(17.7)} />
    </AbsoluteFill>
  );
};

const KINGDOM_PINS = ["champoton", "chetumal", "mani", "chichen", "mayapan", "uxmal", "quetzaltenango", "cozumel", "copan"] as const;

/** Map of Spanish conquest: kingdoms falling one by one, Nojpetén last. */
export const ConquestMap: React.FC<{ t: number; t0: number; step: number; zoom: number; cx: number; cy: number; last?: number }> = ({ t, t0, step, zoom, cx, cy, last = 0 }) => {
  const ppd = 120;
  const center: [number, number] = [-89.5, 18.2];
  return (
    <Stage camera={{ zoom, x: cx, y: cy }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
      <MesoMap ppd={ppd} center={center} maya={1} countries pins={["nojpeten"]} highlight={last > 0 ? ["nojpeten"] : []} />
      {KINGDOM_PINS.map((name, i) => {
        const [x, y] = siteXY(name, ppd, center);
        const k = ramp(t, t0 + i * step, t0 + i * step + 0.25, Easing.out(Easing.back(2)));
        return (
          <X key={name} x={x} y={y} z={1 + i * 0.01}>
            <Part shape={circle(26)} color="#3fa07a" flat outline={4} s={1 - k * 0.2} />
            {k > 0 ? <SpanishFlag x={-6} y={110} w={90} s={k} z={0.01} /> : null}
            {k > 0 ? <Line pts={[[-6, 0], [-6, 110 * k]]} width={6} color="#4a3220" z={0.009} /> : null}
          </X>
        );
      })}
      {last > 0 ? <Glow {...(() => { const [x, y] = siteXY("nojpeten", ppd, center); return { x, y }; })()} rx={260} color="#9affc0" alpha={0.45 * last} additive z={2} /> : null}
    </Stage>
  );
};

// 18.55 "For more than 170 years, the Spanish have been taking Maya lands, one kingdom after another."
export const KingdomsFallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <ConquestMap t={t} t0={20.6} step={0.36} zoom={push(frame, dur, 0.95, 1.02)} cx={0} cy={0} />
      <Label text="170+ YEARS" x={0.18} y={0.12} size={0.07} kind="box" at={sec(start)(19.5)} />
      <Label text="ONE KINGDOM AFTER ANOTHER" x={0.62} y={0.9} size={0.04} kind="box" at={sec(start)(22.8)} />
    </AbsoluteFill>
  );
};

// 24.25 "Yours is the last one still free."
export const LastFreeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const [nx, ny] = siteXY("nojpeten", 120, [-89.5, 18.2]);
  const k = ramp(t, 24.4, 26.2, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <ConquestMap t={t + 100} t0={0} step={0} zoom={interpolate(k, [0, 1], [1.0, 2.2])} cx={nx * k} cy={ny * k} last={ramp(t, 25.5, 26.0)} />
      <Label text="THE LAST FREE MAYA KINGDOM" x={0.5} y={0.13} size={0.055} kind="box" at={sec(start)(25.6)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the questions ─────────────────────────

// 27.2 "So how did the Maya end up here?"
export const HowEndUpShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -40 }}
        light={{ dir: [0.6, 0.5] }}
        vignette={0.7}
        bgBlur={7}
        bg={
          <LakeSet mood="day" horizon={-60} island={false}>
            <SpanishGalley x={420} y={-220} s={0.55} sx={-1} z={2} />
          </LakeSet>
        }
      >
        <CanoeWarrior x={-300} y={-560} s={2.1} paddle={false} canoe={false} look={0.45} expression={{ eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true }} />
        <QuestionMark x={180} y={360} s={0.8 * pop(t, 28.2)} rot={0.1} z={5} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 29.2 "One island against a whole empire?"
export const IslandVsEmpireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const grow = ramp(t, 29.9, 30.9, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 60 }} light={{ dir: [-0.6, 0.5] }} vignette={0.6}>
        <LakeSet mood="dusk" horizon={-120} island={false}>
          <IslandCity x={-560} y={-160} w={600} z={1} />
          <X x={380} y={-160} s={0.3 + grow * 0.5} z={2}>
            <Line pts={[[0, 0], [0, 900]]} width={22} color="#4a3220" />
            <SpanishFlag x={0} y={900} w={700} />
          </X>
        </LakeSet>
      </Stage>
      <Label text="ONE ISLAND" x={0.22} y={0.16} size={0.05} kind="box" at={sec(start)(29.4)} />
      <Label text="A WHOLE EMPIRE" x={0.72} y={0.08} size={0.05} kind="box" at={sec(start)(30.4)} />
    </AbsoluteFill>
  );
};

/** Tenochtitlan's Templo Mayor: one pyramid with twin shrines (Aztec). */
export const TemploMayor: React.FC<{ x?: number; y?: number; s?: number; z?: number; fall?: number }> = ({ x = 0, y = 0, s = 1, z = 0, fall = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <MayaPyramid w={900} h={420} tiers={5} top={0.5} stairW={0.0} templeW={0} color="#d8ccb0" />
    {[-1, 1].map((k) => (
      <Part key={`s${k}`} shape={poly([[k * 40, 0], [k * 120, 0], [k * 110, 420], [k * 50, 420]])} color="#e8dcc4" flat outline={3} z={0.01} />
    ))}
    {[-1, 1].map((k) => (
      <X key={k} x={k * 120} y={420} z={0.02}>
        <Part shape={roundRect(170, 130, 6)} color={k < 0 ? "#2f6fa8" : "#c0392b"} shade={0.22} y={65} />
        <Part shape={roundRect(44, 70, 4)} color="#2a2026" flat outline={3} y={35} z={0.001} />
        <Part shape={poly([[-96, 130], [96, 130], [0, 220]])} color={k < 0 ? "#3a8ac9" : "#d0503a"} shade={0.22} z={0.001} />
      </X>
    ))}
    {fall > 0 ? (
      <X y={680} z={0.05}>
        <Line pts={[[0, -120], [0, 200]]} width={14} color="#4a3220" />
        <SpanishFlag x={0} y={200} w={220} s={fall} />
      </X>
    ) : null}
  </X>
);

// 31.45 "And how did they last this long, when the mighty Aztecs fell in just two years?"
export const AztecsFellShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 34.4, 34.9, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20, shake: hitAt(t, 34.5, 0.3) * 6 }} light={{ dir: [-0.6, 0.5] }} vignette={0.6}>
        <JungleSet mood={fall > 0 ? "dusk" : "day"} horizon={-380} jungle={false} ground="#c9b48a">
          <TemploMayor y={-380} s={0.95} z={1} fall={fall} />
          {fall > 0 ? <Smoke x={-500} y={-380} w={300} h={700} alpha={0.45} seed={3} z={2} /> : null}
        </JungleSet>
      </Stage>
      <Label text="AZTECS" sub="TENOCHTITLAN" x={0.2} y={0.12} size={0.06} kind="box" at={sec(start)(33.9)} />
      <Label text="2 YEARS" x={0.78} y={0.14} size={0.08} kind="stamp" rotate={-6} at={sec(start)(35.3)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── coming up ─────────────────────────

const ComingUp: React.FC<{ start: number }> = ({ start }) => <Label text="COMING UP" x={0.1} y={0.93} size={0.035} kind="box" at={sec(start)(36.7)} />;

// 36.6 "Coming up, kings and queens who cut themselves for the gods."
export const TeaserBloodShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const armK: [number, number] = [1.6, 1.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [300, 200] }} vignette={0.7} vignetteColor="#140a10">
        <PalaceRoom floorY={-760} dim={0.25} throne={false}>
          <Character {...MAYA_KING(0)} x={-380} y={-900} s={2.0} z={2} look={0.45} expression={{ eyes: t > 38.5 ? "closed" : "open", mouth: "wavy", brows: 0.6 }} pose={{ ...poses.idle(frame), armF: armK }} holdF={<StingraySpine rot={upright(armK) + 2.6} len={200} />} />
          <Character {...MAYA_QUEEN(0)} x={420} y={-900} s={1.95} z={2} facing={-1} look={0.45} expression={{ eyes: "half", mouth: "o", brows: 0.5 }} pose={{ ...poses.idle(frame, 2), armF: [1.9, 0.9] }} holdF={<ThornRope len={420} rot={0.2} />} />
        </PalaceRoom>
      </Stage>
      <ComingUp start={start} />
    </AbsoluteFill>
  );
};

// 40.1 "A ball game with a ball that can break your bones."
export const TeaserBallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = ramp(t, 41.6, 42.0);
  const bx = interpolate(t, [40.1, 41.7, 42.6], [-900, -120, 600], { extrapolateRight: "clamp" });
  const by = interpolate(t, [40.1, 41.7, 42.6], [300, -260, 200], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, y: -100, shake: hitAt(t, 41.75, 0.3) * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-300} ground="#c9b48a" jungle={false}>
          <BallCourt y={-300} w={2400} h={700} z={-20} />
          <Character {...BALLPLAYER(0)} x={-140} y={-760} s={1.9} z={2} look={0.5} expression={hit > 0 ? { eyes: "wide", mouth: "shout", brows: 0.9 } : { eyes: "angry", mouth: "teeth", brows: -0.6 }} pose={{ ...poses.run(frame * 0.6), lean: -0.2 }} />
          <RubberBall x={bx} y={by} r={60} z={3} />
        </JungleSet>
      </Stage>
      <ComingUp start={start} />
      <Label text="CRACK!" x={0.76} y={0.2} size={0.08} kind="stamp" rotate={-10} at={sec(start)(41.8)} />
    </AbsoluteFill>
  );
};

// 42.9 "A king some people think was an astronaut."
export const TeaserAstronautShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.6] }} vignette={0.7}>
        <SpaceStars z={-40} />
        <X x={-200} y={-500 + Math.sin(frame * 0.06) * 30} rot={Math.sin(frame * 0.04) * 0.15} z={2}>
          <Character {...MAYA_KING(1)} hat="astronaut" s={1.7} look={0.5} expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }} pose={poses.armsUp(frame)} />
        </X>
        <PakalLid x={560} y={0} w={420} h={640} rocket={ramp(t, 43.6, 44.6)} z={1} />
      </Stage>
      <ComingUp start={start} />
      <Label text="ASTRONAUT?" x={0.22} y={0.12} size={0.06} kind="box" at={sec(start)(44.5)} />
    </AbsoluteFill>
  );
};

// 45.4 "A Spanish sailor who joins the Maya and fights against Spain."
export const TeaserGuerreroShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arm: [number, number] = [0.6, 0.5];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-400}>
          <Character {...GUERRERO} x={-380} y={-920} s={2.0} z={2} look={0.45} expression={{ eyes: "angry", mouth: "shout", brows: -0.8 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<Spear rot={upright(arm)} length={820} tip="#2a2228" />} />
          <Character {...SPANISH_SOLDIER(2)} x={460} y={-920} s={1.9} z={1.9} facing={-1} look={0.45} expression={{ eyes: "wide", mouth: "o", brows: 0.7 }} pose={poses.scared(frame)} />
        </JungleSet>
      </Stage>
      <ComingUp start={start} />
      <Label text="SPANISH SAILOR → MAYA WARRIOR" x={0.4} y={0.14} size={0.045} kind="box" at={sec(start)(46.6)} />
    </AbsoluteFill>
  );
};

// 48.85 "A horse that becomes a god."
export const TeaserHorseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 20 }} light={{ pos: [0, 400] }} vignette={0.7} vignetteColor="#140a10">
        <PalaceRoom floorY={-460} dim={0.2} throne={false}>
          <Sunburst y={100} r={1600} rays={18} color="#e8c88a" alt="#e0bc78" speed={0.3} z={-33} />
          <Part shape={roundRect(560, 120, 10)} color="#cbbf9e" shade={0.22} y={-400} z={1} />
          <Horse x={-140} y={-340} s={0.95} color="#b8b0a0" mane="#8a8070" clay z={2} />
          <Glow y={0} rx={600} color="#fff2c6" alpha={0.35} additive z={1.5} />
          {[-680, 680].map((x, i) => (
            <Character key={x} {...MAYA_PRIEST(i)} x={x} y={-560} s={1.3} z={3} facing={x < 0 ? 1 : -1} look={0.4} expression={{ eyes: "closed", mouth: "smile" }} pose={poses.worship(frame + i * 9)} />
          ))}
        </PalaceRoom>
      </Stage>
      <ComingUp start={start} />
      <Label text="A HORSE GOD" x={0.5} y={0.14} size={0.06} kind="box" at={sec(start)(49.6)} />
    </AbsoluteFill>
  );
};

// 50.8 "And a priest who burns Maya books, and ends up helping us read them."
export const TeaserLandaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const burn = ramp(t, 51.6, 53.0);
  const arm: [number, number] = [1.5, 0.6];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ pos: [200, -100] }} vignette={0.7} vignetteColor="#140a10">
        <JungleSet mood="dusk" horizon={-380}>
          <Character {...FRIAR(0)} x={-380} y={-900} s={2.0} z={2} look={0.45} expression={{ eyes: "angry", mouth: "flat", brows: -0.7 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<X rot={upright(arm)}><Line pts={[[0, -40], [0, 180]]} width={12} color="#6e4a2c" /><Flame y={190} size={0.7} seed={2} /></X>} />
          <X x={360} y={-520} z={2}>
            <Codex pages={6} open={1} burn={burn} s={0.9} />
            {burn > 0 ? <Flame y={-40} size={1.5 * burn} seed={4} z={0.1} /> : null}
            {burn > 0 ? <Glow rx={420} color="#ff9a4a" alpha={0.4 * burn} additive z={0.05} /> : null}
          </X>
        </JungleSet>
      </Stage>
      <ComingUp start={start} />
      <Label text="BURNS THE BOOKS..." x={0.68} y={0.14} size={0.045} kind="box" at={sec(start)(51.9)} />
      <Label text="...HELPS US READ THEM?" x={0.68} y={0.24} size={0.045} kind="box" at={sec(start)(53.6)} />
    </AbsoluteFill>
  );
};

// 54.85 "But first, we go way back."
export const WayBackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const spin = interpolate(t, [54.85, 57.3], [0, -24], { easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: interpolate(t, [54.85, 57.3], [1.0, 1.5], { easing: Easing.in(Easing.cubic) }), rot: spin * 0.02 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7}>
        <Paper color="#e2d2a8" />
        <Sunburst r={2400} rays={24} color="#d8c494" alt="#cfb986" speed={-3} z={-39} />
        <X z={1}>
          <Part shape={circle(300)} color="#f4ead0" shade={0.2} />
          <Part shape={circle(270)} color="#efe2c4" flat outline={5} z={0.001} />
          {Array.from({ length: 12 }, (_, i) => (
            <Line key={i} pts={[[Math.cos((i / 12) * 6.283) * 220, Math.sin((i / 12) * 6.283) * 220], [Math.cos((i / 12) * 6.283) * 255, Math.sin((i / 12) * 6.283) * 255]]} width={8} z={0.002} />
          ))}
          <X rot={spin} z={0.003}>
            <Line pts={[[0, 0], [0, 210]]} width={14} color="#c0392b" />
          </X>
          <X rot={spin / 12} z={0.003}>
            <Line pts={[[0, 0], [150, 0]]} width={18} />
          </X>
          <Part shape={circle(22)} color="#2a2026" flat outline={0} z={0.004} />
        </X>
      </Stage>
      <Label text="WAY BACK..." x={0.5} y={0.86} size={0.06} kind="box" at={sec(start)(56.0)} />
    </AbsoluteFill>
  );
};

// 57.25 "To the day a rock from space hit this land."
export const RockFromSpaceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const a = interpolate(t, [57.25, 60.6], [0, 1]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SpaceStars z={-40} />
        <Globe x={-260} y={-120} r={430} lon0={-82} lat0={14} highlight={null} z={1} />
        <Asteroid x={interpolate(a, [0, 1], [1100, 420])} y={interpolate(a, [0, 1], [620, 260])} r={70} rot={-0.45} z={2} />
      </Stage>
    </AbsoluteFill>
  );
};
