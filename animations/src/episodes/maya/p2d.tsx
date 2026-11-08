import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, Gradient, QuestionMark, Spear, roundRect, circle, ellipse, poly, blob, ramp, push, hitAt, absT, rng, mixHex, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { crowdSpots } from "../../kit/crowd";
import { Character, poses } from "../../kit/character";
import {
  MesoMap, mesoXY, siteXY, TikalTemple, MayaPyramid, MayaHut, Sunburst, Smoke, Flame, Campfire, Candle, SpanishGalley, SpanishFlag, IslandCity, Canoe, Ripples, BigLeaf,
  Jungle, Vines, Ceiba, LidarReveal, SurveyPlane, CalendarGear, Tortilla, StingraySpine, BallCourt, RubberBall, Laptop, Mountains, Sky, Cloud, Ground, Cat,
  PlankWall, Floorboards, Desk, HangingLamp, Codex,
} from "../../kit/env";
import { Arrow, Rifle, CommentBubble, Hammer } from "../../kit/props";
import { sec, pop, useScr, SpeechBubble } from "../../kit/shot";
import { JungleSet, LakeSet, PlazaSet, PalaceRoom, Paper, Village } from "./sets";
import {
  MAYA_KING, MAYA_QUEEN, MAYA_COMMONER, MAYA_WOMAN, ITZA_WARRIOR, SPANISH_SOLDIER, KAN_EK, CASTE_REBEL, MODERN_MAYA_MAN, MODERN_MAYA_WOMAN, DAYKEEPER,
  STUDENT, CORN_PERSON, BALLPLAYER,
} from "./cast";
import { CanoeWarrior, upright, ConquestMap, TemploMayor } from "./p1a";
import { KingdomsMap } from "./p1c";
import { Leavers } from "./p2a";

// Second video, part D: the fall of the Itza island (1697), the Caste War,
// Guatemala's civil war, Valeriana, and the Maya today. Seconds on maya-2.voice.m4a.

type P = [number, number];

// 318.9 "Now, back to that island."
export const BackToIslandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 60 }} light={{ dir: [-0.6, 0.5] }} vignette={0.6}>
        <LakeSet mood="dawn" horizon={-40} islandX={60} islandW={1500} />
      </Stage>
      <Label text="NOJPETÉN" sub="THE ITZA ISLAND" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(319.7)} />
    </AbsoluteFill>
  );
};

// 320.6 "By the 1690s, the Itza kingdom is the last free Maya kingdom."
export const LastFreeAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const [nx, ny] = siteXY("nojpeten", 120, [-89.5, 18.2]);
  const k = ramp(t, 322.6, 324.4, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <ConquestMap t={t + 100} t0={0} step={0} zoom={interpolate(k, [0, 1], [1.0, 2.0])} cx={nx * k} cy={ny * k} last={ramp(t, 323.9, 324.5)} />
      <Label text="1690s" x={0.15} y={0.1} size={0.07} kind="box" at={sec(start)(321.1)} />
      <Label text="THE LAST FREE MAYA KINGDOM" x={0.5} y={0.88} size={0.055} kind="box" at={sec(start)(324.0)} />
    </AbsoluteFill>
  );
};

// 325.4 "Hidden in the jungle behind a lake, it has kept the Spanish out for over 170 years."
export const HiddenLakeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.5, 0.6] }} vignette={0.65} bgBlur={5}
        bg={<LakeSet mood="day" horizon={40} islandX={300} islandW={700} />}
        fg={
          <>
            <BigLeaf x={-1050} y={-650} len={760} rot={-0.5} color="#2f6a34" seed={3} />
            <BigLeaf x={1080} y={-640} len={700} rot={0.6} color="#2f6a34" />
            <BigLeaf x={-900} y={560} len={600} rot={-2.6} color="#2f6a34" seed={5} />
            <BigLeaf x={950} y={600} len={640} rot={2.5} color="#2f6a34" seed={7} />
          </>
        }
        fgBlur={8}
      >
        {[0, 1].map((i) => (
          <Character key={i} {...SPANISH_SOLDIER(i + 2)} x={-560 + i * 520} y={-900 - i * 30} s={1.55} z={2 - i * 0.1} facing={i ? -1 : 1} look={0.5} expression={{ eyes: "half", mouth: "wavy", brows: 0.8, sweat: true, eyebags: true }} pose={i ? poses.shrug(0.3) : poses.scared(frame)} />
        ))}
      </DepthStage>
      <Label text="HIDDEN BEHIND A LAKE" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(326.4)} />
      <Label text="170+ YEARS FREE" x={0.5} y={0.21} size={0.055} kind="box" at={sec(start)(329.3)} />
    </AbsoluteFill>
  );
};

// 330.5 "Then the Spanish bring a big warship to the edge of the lake."
export const BuildWarshipShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const tap = Math.max(0, Math.sin(frame * 0.8));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [0.6, 0.5] }} vignette={0.6}>
        <LakeSet mood="day" horizon={-60} islandX={900} islandW={500}>
          <SpanishGalley x={-120} y={-200} s={0.9} row={0} soldiers={0} z={1} />
          {[0, 1].map((i) => (
            <Character key={i} {...SPANISH_SOLDIER(i)} hat={null} x={-640 + i * 920} y={-640} s={1.25} z={2 + i * 0.01} facing={i ? -1 : 1} look={0.5} expression={{ eyes: "angry", mouth: "teeth", brows: -0.5 }} pose={{ ...poses.idle(frame, i), armF: [1.8 - (i ? Math.max(0, Math.sin(frame * 0.8 + 1)) : tap) * 0.6, 0.4] }} holdF={<Hammer rot={0.4} />} />
          ))}
        </LakeSet>
      </Stage>
      <Label text="A WARSHIP ON THE LAKE" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(331.9)} />
    </AbsoluteFill>
  );
};

// 333.45 "On March 13, 1697, it sails toward the island with its cannons."
export const March13Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const gx = interpolate(t, [333.45, 338.65], [-700, -180]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [0.6, 0.5] }} vignette={0.6}>
        <LakeSet mood="dawn" horizon={0} islandX={620} islandW={900}>
          <SpanishGalley x={gx} y={-260} s={0.8} fire={ramp(t, 337.7, 338.4)} z={2} />
          <Ripples x={gx} y={-270} r={460} z={1.9} />
        </LakeSet>
      </Stage>
      <Label text="MARCH 13, 1697" x={0.3} y={0.1} size={0.07} kind="title" at={sec(start)(333.9)} />
    </AbsoluteFill>
  );
};

// 338.65 "The Itza paddle out in more than 300 canoes."
export const ThreeHundredCanoesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const canoes = crowdSpots({ n: 24, x0: -1400, x1: 1400, yFar: -130, yNear: -470, sFar: 0.22, sNear: 0.52, rows: 4, seed: 41, width: 8.2 });
  const adv = ramp(t, 338.65, 341.8) * 120;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <LakeSet mood="dawn" horizon={60} islandX={-600} islandW={700}>
          {canoes.map(({ x, y, s, i }) => {
            return <CanoeWarrior key={i} x={x + adv * (i % 2 ? 1 : 0.7)} y={y} s={s} i={(i % 3) + 1} ph={i * 0.7} z={1 + i * 0.01} />;
          })}
        </LakeSet>
      </Stage>
      <Label text="300+ CANOES" x={0.5} y={0.1} size={0.07} kind="box" at={sec(start)(340.6)} />
    </AbsoluteFill>
  );
};

// 341.8 "But arrows can't stop cannons."
export const ArrowsCannonsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fire = ramp(t, 342.85, 343.5);
  const arrows = [0, 1, 2, 3, 4].map((i) => {
    const k = ramp(t, 341.9 + i * 0.12, 342.4 + i * 0.12);
    const bounce = ramp(t, 342.4 + i * 0.12, 342.9 + i * 0.12);
    return { k, bounce, i };
  });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -60, shake: hitAt(t, 342.95, 0.4) * 10 }} light={{ dir: [0.6, 0.5] }} vignette={0.65}>
        <LakeSet mood="day" horizon={260} island={false}>
          <SpanishGalley x={300} y={-160} s={1.0} sx={-1} fire={fire} row={0.3} z={2} />
          {arrows.map(({ k, bounce, i }) =>
            k > 0 && bounce < 1 ? (
              <Arrow
                key={i}
                x={interpolate(k, [0, 1], [-1100, -40]) + bounce * -200}
                y={interpolate(k, [0, 1], [-120 + i * 60, 40 + i * 40]) - bounce * 260}
                rot={bounce > 0 ? -2.4 - bounce * 3 : 0.15}
                length={160}
                z={3}
              />
            ) : null,
          )}
        </LakeSet>
      </Stage>
      <Label text="ARROWS" x={0.2} y={0.1} size={0.055} kind="box" at={sec(start)(342.1)} />
      <Label text="VS CANNONS" x={0.72} y={0.1} size={0.055} kind="box" at={sec(start)(343.0)} />
    </AbsoluteFill>
  );
};

// 343.85 "Within a few hours, the city falls."
export const CityFallsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const flag = ramp(t, 344.7, 345.3, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.6, 1.7), y: 120 }} light={{ dir: [0.6, 0.4] }} vignette={0.7} vignetteColor="#1a0a08">
        <LakeSet mood="dusk" horizon={-40} islandX={60} islandW={1300} burn={0.5}>
          <X x={90} y={150} s={flag} z={-20}>
            <Line pts={[[0, -120], [0, 220]]} width={10} color="#4a3220" />
            <SpanishFlag x={0} y={220} w={140} />
          </X>
        </LakeSet>
      </Stage>
      <Label text="A FEW HOURS" x={0.5} y={0.88} size={0.065} kind="box" at={sec(start)(344.3)} />
    </AbsoluteFill>
  );
};

// 345.95 "The Spanish burn the temples, and soon they capture the king, Kan Ek'."
export const BurnTemplesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cap = ramp(t, 347.9, 348.5);
  const arm: [number, number] = [0.4, 0.4];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [0.6, 0.4] }} vignette={0.75} vignetteColor="#1a0a08" bgBlur={4}
        bg={<LakeSet mood="night" horizon={0} islandX={0} islandW={1600} burn={ramp(t, 346.3, 347.2)} />}
      >
        {cap > 0 ? (
          <X z={2}>
            <Character {...KAN_EK} x={0} y={-900} s={1.75} look={0.5} expression={{ eyes: "sad", mouth: "frown", brows: 0.9 }} pose={{ ...poses.idle(frame), armF: [0.3, 1.2], armB: [-0.3, 1.2] }} />
            {[-1, 1].map((k) => (
              <Character key={k} {...SPANISH_SOLDIER(k > 0 ? 1 : 2)} x={k * (900 - cap * 360)} y={-880} s={1.65} z={-0.1} facing={k > 0 ? -1 : 1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.5 }} pose={{ ...poses.idle(frame, k + 2), armF: arm }} holdF={<Spear rot={upright(arm)} length={760} tip="#c9ced6" />} />
            ))}
          </X>
        ) : null}
      </DepthStage>
      <Label text="TEMPLES BURNED" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(346.7)} until={sec(start)(348.6)} />
      <Label text="KAN EK'" sub="THE LAST ITZA KING" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(348.9)} />
    </AbsoluteFill>
  );
};

// 350.25 "Remember that warrior in his canoe?"
export const RememberWarriorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame * 0.08) * 6;
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.5, 0.6] }} vignette={0.7} vignetteColor="#0e1418" bgBlur={5}
        bg={<LakeSet mood="dawn" horizon={60} islandX={-560} islandW={900} />}
        fg={<><BigLeaf x={1020} y={-620} len={720} rot={0.6} color="#2f6a34" /><BigLeaf x={-1050} y={-650} len={640} rot={-0.7} color="#2f6a34" seed={3} /></>}
      >
        <CanoeWarrior x={220} y={-500 + bob} s={1.95} expression={{ eyes: "open", mouth: "flat", brows: -0.35, gaze: [0.4, 0] }} />
        <Ripples x={220} y={-520} r={500} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 352.1 "Now you know why he's the last."
export const WhyLastShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60 }} light={{ dir: [0.6, 0.4] }} vignette={0.75} vignetteColor="#140a08" bgBlur={6}
        bg={<LakeSet mood="dusk" horizon={40} islandX={420} islandW={1000} burn={1} />}
      >
        <CanoeWarrior x={-380} y={-520} s={1.95} paddle={false} look={0.2} facing={1} canoe expression={{ eyes: "sad", mouth: "frown", brows: 0.9, gaze: [0.6, 0.1] }} />
      </DepthStage>
      <Label text="THE LAST FREE MAYA" x={0.7} y={0.1} size={0.055} kind="box" at={sec(start)(353.3)} />
    </AbsoluteFill>
  );
};

// 354.85 "But that's not the end of the Maya."
export const NotTheEndShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [-0.5, 0.5] }} vignette={0.6}>
        <Village mood="dawn" horizon={-240}>
          <Sunburst y={-100} r={2400} rays={22} color="#f6d890" alt="#f0cc7a" speed={0.4} z={-39.5} />
          {[-500, 0, 480].map((x, i) => (
            <Character key={x} {...(i === 1 ? MAYA_WOMAN(i) : MAYA_COMMONER(i + 2))} x={x} y={-660} s={1.1 + (i === 1 ? 0.1 : 0)} z={2 + i * 0.01} facing={i === 2 ? -1 : 1} look={0.45} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, i)} />
          ))}
        </Village>
      </Stage>
      <Label text="NOT THE END" x={0.5} y={0.12} size={0.075} kind="title" at={sec(start)(355.5)} />
    </AbsoluteFill>
  );
};

// 356.65 "Not even close."
export const NotEvenCloseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.3, 1.4), y: -240 }} light={{ dir: [-0.5, 0.5] }} vignette={0.6}>
        <Paper color="#e8c890">
          <Sunburst y={-300} r={2400} rays={22} color="#f2d890" alt="#e8c878" speed={1.2} z={-39} />
          <Character {...MODERN_MAYA_WOMAN(0)} x={-260} y={-980} s={1.9} z={2} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} />
          <Character {...MODERN_MAYA_MAN(1)} x={280} y={-960} s={1.85} z={2.1} facing={-1} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.handsOnHips} />
        </Paper>
      </Stage>
      <Label text="NOT EVEN CLOSE" x={0.5} y={0.12} size={0.08} kind="title" at={sec(start)(356.8)} />
    </AbsoluteFill>
  );
};

/** Machete held in the hand. */
const Machete: React.FC<{ rot?: number }> = ({ rot = 0 }) => (
  <X rot={rot}>
    <Part shape={roundRect(26, 70, 8)} color="#5a3a26" shade={0.24} y={20} />
    <Part shape={blob([[-14, 50], [14, 50], [26, 200], [10, 250], [-12, 230]], 6)} color="#c9ced6" shade={0.3} z={0.001} />
  </X>
);

// 357.9 "In 1847, the Maya of the Yucatán rise up against their rulers."
export const CasteWarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 360.9, 361.6, Easing.out(Easing.back(1.5)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -60 }} light={{ dir: [-0.5, 0.5] }} vignette={0.65}>
        <Village mood="dusk" horizon={-240}>
          {[0, 1, 2, 3].map((i) => {
            const arm: [number, number] = [1.2 + rise * 1.6, 0.2];
            return (
              <Character key={i} {...CASTE_REBEL(i)} x={-840 + i * 560} y={-640 - (i % 2) * 40} s={1.2} z={2 - (i % 2) * 0.1} facing={i < 2 ? 1 : -1} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.8 }} pose={{ ...poses.idle(frame, i), armF: arm }} holdF={i % 2 ? <Rifle rot={upright(arm) + 1.4} /> : <Machete rot={upright(arm) + 0.2} />} />
            );
          })}
        </Village>
      </Stage>
      <Label text="1847" x={0.15} y={0.1} size={0.07} kind="box" at={sec(start)(358.4)} />
      <Label text="THE MAYA OF THE YUCATÁN" x={0.62} y={0.1} size={0.045} kind="box" at={sec(start)(359.6)} />
      <Label text="RISE UP" x={0.5} y={0.24} size={0.065} kind="box" at={sec(start)(361.2)} />
    </AbsoluteFill>
  );
};

const CASTE_CENTER: P = [-88.7, 19.9];

// 362.95 "It's called the Caste War."
export const CasteWarTitleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 140;
  const fires: P[] = [[-88.2, 20.7], [-88.05, 19.6], [-87.7, 20.2], [-88.6, 20.3], [-89.0, 20.9], [-88.4, 19.1]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <MesoMap ppd={ppd} center={CASTE_CENTER} maya={1} />
        {fires.map(([lo, la], i) => {
          const [x, y] = mesoXY(lo, la, ppd, CASTE_CENTER);
          return <Flame key={i} x={x} y={y} size={0.7 * pop(t, 363.2 + i * 0.15)} seed={i + 2} z={1 + i * 0.01} />;
        })}
      </Stage>
      <Label text="THE CASTE WAR" sub="1847 – 1901" x={0.5} y={0.12} size={0.08} kind="title" at={sec(start)(363.9)} />
    </AbsoluteFill>
  );
};

// 365.0 "For more than 50 years, they run their own land in the jungle,"
export const OwnLandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = 140;
  const z = push(frame, dur, 1.0, 1.05);
  const [cx, cy] = mesoXY(-88.05, 19.58, ppd, CASTE_CENTER);
  const k = ramp(t, 365.6, 367.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: z }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <MesoMap ppd={ppd} center={CASTE_CENTER} maya={1} />
        <Part shape={blob([[-0.9, -1.4], [0.6, -1.6], [0.8, 0.2], [0.4, 1.4], [-0.6, 1.2], [-1.0, 0.0]].map(([a, b]) => [cx + a * ppd * 0.9, cy + b * ppd * 0.9] as P), 8)} color="#c0392b" flat outline={5} opacity={0.45 * k} z={0.5} />
        <X x={cx} y={cy} s={pop(t, 367.1)} z={1}>
          <Part shape={circle(26)} color="#c0392b" flat outline={4} />
        </X>
      </Stage>
      <Label text="50+ YEARS" x={0.2} y={0.1} size={0.065} kind="box" at={sec(start)(365.7)} />
      <Label pin text="CHAN SANTA CRUZ" sub="MAYA-RUN LAND" {...sc(cx + 40, cy - 120, z)} size={0.04} kind="box" at={sec(start)(367.2)} />
    </AbsoluteFill>
  );
};

// 368.35 "guided by a 'talking cross.'"
export const TalkingCrossShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: -80 }} light={{ pos: [0, 200] }} vignette={0.75} vignetteColor="#0a0a10">
        <JungleSet mood="night" horizon={-260}>
          <MayaHut x={0} y={-260} w={700} door={false} z={-20} />
          <X y={-120} z={-19}>
            <Part shape={roundRect(60, 520, 10)} color="#5a3a26" shade={0.24} y={260} />
            <Part shape={roundRect(280, 56, 10)} color="#5a3a26" shade={0.24} y={340} z={0.001} />
            <Glow y={240} rx={420} color="#fff2c6" alpha={0.45 + 0.1 * Math.sin(frame * 0.3)} additive z={0.01} />
          </X>
          <SpeechBubble x={420} y={400} w={300} h={160} tx={80} ty={200} s={pop(t, 368.9)} z={1} />
          {[-1, 1].map((k) => (
            <Character key={k} {...CASTE_REBEL(k > 0 ? 1 : 2)} x={k * 520} y={-520} s={1.1} z={2} facing={k > 0 ? -1 : 1} look={0.45} expression={{ eyes: "closed", mouth: "o" }} pose={poses.worship(frame + k * 9)} />
          ))}
        </JungleSet>
      </Stage>
      <Label text="THE “TALKING CROSS”" x={0.5} y={0.88} size={0.06} kind="box" at={sec(start)(368.9)} />
    </AbsoluteFill>
  );
};

// 370.15 "In the 1980s, during Guatemala's civil war, the army attacks hundreds of Maya villages."
export const CivilWarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const smoke = ramp(t, 373.5, 374.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [0.5, 0.4] }} vignette={0.8} vignetteColor="#0a0a10">
        <X z={-41}>
          <Sky w={6000} h={3600} y={1500} top="#4a4a58" mid="#6a6a74" bottom="#8a8a90" />
        </X>
        <Mountains w={6000} y={-160} color="#4a5a4a" outline={3} peaks={[[-2200, 380], [-1200, 520], [-200, 340], [700, 480], [1700, 360]]} z={-40} />
        <Ground w={6000} h={2000} y={-200} color="#7a8a5a" far="#6a7a4a" pebbles={6} tufts={10} tuftColor="#5a6a3a" seed={9} z={-30} />
        {[-760, -300, 200, 680].map((x, i) => (
          <X key={x} z={-20 + i * 0.01}>
            <MayaHut x={x} y={-220 - (i % 2) * 30} w={240} />
            {smoke > 0 ? <Smoke x={x} y={-80} w={200} h={800} alpha={0.5 * smoke} color="#4a4448" seed={i + 3} /> : null}
          </X>
        ))}
        {[0, 1, 2].map((i) => (
          <Character key={i} {...(i === 1 ? MODERN_MAYA_WOMAN(i) : MODERN_MAYA_MAN(i * 2))} x={-200 + i * 220 - ramp(t, 374.2, 376) * 300} y={-620 - (i % 2) * 20} s={0.95} z={2 + i * 0.01} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.9 }} pose={t > 374.2 ? poses.run(frame + i * 5) : poses.idle(frame, i)} />
        ))}
        <Wash width={6000} height={4000} color="#1a1420" alpha={0.25} z={30} />
      </Stage>
      <Label text="1980s" x={0.15} y={0.1} size={0.065} kind="box" at={sec(start)(370.6)} />
      <Label text="GUATEMALA'S CIVIL WAR" x={0.6} y={0.1} size={0.05} kind="box" at={sec(start)(371.9)} />
      <Label text="HUNDREDS OF MAYA VILLAGES ATTACKED" x={0.5} y={0.9} size={0.045} kind="box" at={sec(start)(374.2)} />
    </AbsoluteFill>
  );
};

// 376.0 "A truth commission later says the government committed acts of genocide against Maya people."
export const TruthCommissionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ pos: [0, 300] }} vignette={0.8} vignetteColor="#0a0a10">
        <Gradient w={6000} h={4000} stops={[[0, "#2a2630"], [1, "#141218"]]} z={-41} />
        <Part shape={roundRect(6000, 700, 0)} color="#3a3038" flat outline={0} y={-700} z={-40} />
        <X y={-120} rot={-0.04} z={1}>
          <Part shape={roundRect(620, 820, 10)} color="#f2ece0" shade={0.15} />
          <Part shape={roundRect(520, 120, 6)} color="#2f4f7a" flat outline={3} y={260} z={0.001} />
          {Array.from({ length: 8 }, (_, i) => (
            <Line key={i} pts={[[-230, 100 - i * 50], [230 - (i % 3) * 50, 100 - i * 50]]} width={8} color="#b8b0a4" z={0.001} />
          ))}
        </X>
        {[-560, -420, 420, 560].map((x, i) => (
          <Candle key={x} x={x} y={-420} s={1.1} seed={i + 4} z={2} />
        ))}
        {[-480, 480].map((x, i) => (
          <X key={x} x={x} y={-470} z={1.9}>
            {[0, 1, 2].map((k) => (
              <Part key={k} shape={circle(26)} color={["#f2c84a", "#e07a9a", "#f4f1ea"][k]} flat outline={3} x={(k - 1) * 50} y={(k % 2) * 20} />
            ))}
          </X>
        ))}
        <Glow y={-300} rx={900} ry={400} color="#ffd38a" alpha={0.25} additive z={3} />
      </Stage>
      <Label text="TRUTH COMMISSION · 1999" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(376.3)} />
      <Label text="“ACTS OF GENOCIDE” AGAINST MAYA PEOPLE" x={0.5} y={0.9} size={0.045} kind="box" at={sec(start)(378.5)} />
      <Label text="MEMORIA DEL SILENCIO" x={0.5} y={0.29} size={0.032} kind="tag" color="#ffffff" at={sec(start)(376.5)} />
    </AbsoluteFill>
  );
};

// 380.8 "And the old cities are still hiding secrets."
export const SecretsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.12), y: 80 }} light={{ dir: [0.5, 0.4] }} vignette={0.75} vignetteColor="#0a100a" bgBlur={4}
        bg={
          <JungleSet mood="dusk" horizon={-300}>
            <TikalTemple x={0} y={-300} s={1.1} overgrown={1} z={-20} />
            <Jungle y={-300} w={6000} h={700} seed={19} z={-15} />
          </JungleSet>
        }
        fg={<><BigLeaf x={-1000} y={-600} len={760} rot={-0.5} color="#2a5a2e" seed={4} /><BigLeaf x={1020} y={-620} len={720} rot={0.6} color="#2a5a2e" /></>}
        fgBlur={8}
      >
        <QuestionMark x={460} y={260} s={0.6 * pop(t, 382.6)} rot={0.1} z={3} />
      </DepthStage>
      <Label text="STILL HIDING SECRETS" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(382.5)} />
    </AbsoluteFill>
  );
};

/** Student's room at night: desk, lamp, laptop. */
const StudentRoom: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <PlankWall w={6000} h={3000} y={600} color="#3a4a5a" z={-41} />
    <Floorboards w={6000} h={1400} y={-760} color="#4a3a2e" z={-40} />
    {children}
  </>
);

// 383.85 "In 2024, a student named Luke Auld-Thomas was searching online."
export const StudentShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const type = Math.sin(frame * 1.1) * 0.06;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -200 }} light={{ pos: [400, 0] }} vignette={0.75} vignetteColor="#0a0e14">
        <StudentRoom>
          <Character {...STUDENT} x={-330} y={-860} s={1.9} z={1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.2, gaze: [0.6, -0.3], eyebags: true }} pose={{ ...poses.sit(frame), armF: [1.4 + type, 1.2], armB: [1.3 - type, 1.2] }} />
          <Desk x={260} y={-800} w={900} h={330} z={1.5} />
          <Laptop x={300} y={-470} w={520} z={1.6} />
          <Part shape={roundRect(90, 110, 20)} color="#c0392b" shade={0.24} x={640} y={-410} z={1.7} />
          <Glow x={300} y={-260} rx={600} ry={400} color="#cfe6ff" alpha={0.3} additive z={2} />
        </StudentRoom>
      </Stage>
      <Label text="2024" x={0.15} y={0.1} size={0.07} kind="box" at={sec(start)(384.4)} />
      <Label text="LUKE AULD-THOMAS" sub="PhD STUDENT" x={0.65} y={0.1} size={0.055} kind="box" at={sec(start)(386.3)} />
    </AbsoluteFill>
  );
};

// 388.9 "On 'something like page 16 of Google,'"
export const Page16Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const scroll = ramp(t, 389.0, 390.6) * 120;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.9, 2.0), y: -10 }} light={{ pos: [0, 0] }} vignette={0.7} vignetteColor="#0a0e14">
        <StudentRoom>
          <Laptop x={0} y={-300} w={760}>
            {Array.from({ length: 6 }, (_, i) => (
              <X key={i} y={150 - i * 60 + scroll} z={0.001}>
                {Math.abs(150 - i * 60 + scroll) < 190 ? (
                  <>
                    <Line pts={[[-300, 10], [-60 + (i % 3) * 40, 10]]} width={10} color="#3a6ac9" />
                    <Line pts={[[-300, -12], [200 - (i % 2) * 80, -12]]} width={6} color="#9aa0a8" />
                  </>
                ) : null}
              </X>
            ))}
          </Laptop>
        </StudentRoom>
      </Stage>
      <Label text="“SOMETHING LIKE PAGE 16 OF GOOGLE”" x={0.5} y={0.1} size={0.045} kind="box" at={sec(start)(389.3)} />
      <Label text="PAGE 16" x={0.5} y={0.88} size={0.06} kind="box" at={sec(start)(390.2)} />
    </AbsoluteFill>
  );
};

// 391.25 "he found laser scans made for a forest survey."
export const ForestSurveyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const px = interpolate(t, [391.25, 394.3], [-700, 500]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 80 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-300}>
          <Jungle y={-300} w={6000} h={600} seed={23} z={-15} />
          <SurveyPlane x={px} y={420} s={1.2} beam={1} z={2} />
        </JungleSet>
      </Stage>
      <Label text="LASER SCANS" x={0.25} y={0.1} size={0.06} kind="box" at={sec(start)(391.8)} />
      <Label text="FOR A FOREST SURVEY" x={0.7} y={0.1} size={0.045} kind="box" at={sec(start)(393.1)} />
    </AbsoluteFill>
  );
};

// 394.3 "Hidden inside was a lost Maya city, with pyramids, plazas and a ball court."
export const LostCityShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Gradient w={6000} h={4000} stops={[[0, "#14201a"], [1, "#0a100c"]]} z={-41} />
        <LidarReveal w={1700} h={940} k={ramp(t, 394.6, 396.6)} city seed={31} z={1} />
      </Stage>
      <Label text="A LOST MAYA CITY" x={0.5} y={0.08} size={0.06} kind="box" at={sec(start)(395.7)} />
      <Label pin text="PYRAMIDS" x={0.2} y={0.92} size={0.045} kind="box" at={sec(start)(396.9)} />
      <Label pin text="PLAZAS" x={0.5} y={0.92} size={0.045} kind="box" at={sec(start)(397.7)} />
      <Label pin text="BALL COURT" x={0.8} y={0.92} size={0.045} kind="box" at={sec(start)(398.6)} />
    </AbsoluteFill>
  );
};

// 399.6 "More than 6,000 structures."
export const SixThousandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.round(ramp(t, 399.7, 401.0) * 6000);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 0.95) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Gradient w={6000} h={4000} stops={[[0, "#14201a"], [1, "#0a100c"]]} z={-41} />
        <LidarReveal w={1700} h={940} k={1} city seed={31} z={1} />
      </Stage>
      <Label text={`${n.toLocaleString("en-US")}+`} x={0.5} y={0.5} size={0.12} kind="title" at={0} />
      <Label text="STRUCTURES" x={0.5} y={0.64} size={0.05} kind="box" at={sec(start)(400.9)} />
    </AbsoluteFill>
  );
};

// 401.95 "Nobody knew it was there. It's now called Valeriana."
export const ValerianaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = 110;
  const center: [number, number] = [-89.8, 19.0];
  const z = push(frame, dur, 1.0, 1.06);
  const [vx, vy] = siteXY("valeriana", ppd, center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: z }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <MesoMap ppd={ppd} center={center} maya={1} countries pins={t > 403.5 ? ["valeriana"] : []} highlight={["valeriana"]} />
      </Stage>
      <Label text="NOBODY KNEW" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(402.3)} />
      <Label pin text="VALERIANA" sub="CAMPECHE, MEXICO" {...sc(vx, vy - 90, z)} size={0.055} kind="box" at={sec(start)(404.3)} />
    </AbsoluteFill>
  );
};

// 405.8 "So how did the Maya last so long against the Spanish?"
export const HowLastShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 406.3, 408.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper color="#e9dcbc">
          <X y={-60} z={1}>
            <Part shape={roundRect(1500, 50, 25)} color="#efe4cc" flat outline={5} />
            <Part shape={roundRect(Math.max(50, 1490 * k), 40, 20)} color="#c0392b" flat outline={0} x={-745 + Math.max(50, 1490 * k) / 2} z={0.001} />
          </X>
          <QuestionMark x={0} y={260} s={0.8 * pop(t, 407.6)} z={2} />
        </Paper>
      </Stage>
      <Label text="1524" x={0.12} y={0.62} size={0.05} kind="box" at={sec(start)(406.1)} />
      <Label text="1697" x={0.88} y={0.62} size={0.05} kind="box" at={sec(start)(408.2)} />
      <Label text="HOW DID THEY LAST SO LONG?" x={0.5} y={0.1} size={0.055} kind="box" at={sec(start)(406.6)} />
    </AbsoluteFill>
  );
};

// 409.1 "Remember the rule?" + 410.3 "The Maya never had one king."
export const RuleAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.round(ramp(t, 409.1, 409.9) * 5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <PalaceRoom floorY={-460} throne={false}>
          {Array.from({ length: n }, (_, i) => (
            <Character key={i} {...MAYA_KING(i)} x={-760 + i * 380} y={-700} s={0.92} z={2 + i * 0.01} facing={i < 3 ? 1 : -1} look={0.4} expression={{ eyes: i % 2 ? "half" : "open", mouth: i % 2 ? "smirk" : "flat", brows: -0.3 }} pose={i % 3 === 0 ? poses.handsOnHips : poses.idle(frame, i)} />
          ))}
        </PalaceRoom>
      </Stage>
      <Label text="THE RULE" x={0.5} y={0.1} size={0.08} kind="title" at={sec(start)(409.3)} />
      <Label text="NEVER ONE KING" x={0.5} y={0.22} size={0.055} kind="box" at={sec(start)(411.0)} />
    </AbsoluteFill>
  );
};

// 412.15 "The Aztecs had one capital. Take it, and you take everything."
export const TakeEverythingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 414.2, 414.7, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20, shake: hitAt(t, 414.3, 0.3) * 6 }} light={{ dir: [-0.6, 0.5] }} vignette={0.6}>
        <JungleSet mood={fall > 0.5 ? "dusk" : "day"} horizon={-380} jungle={false} ground="#c9b48a">
          <TemploMayor y={-380} s={0.95} z={1} fall={fall} />
        </JungleSet>
      </Stage>
      <Label text="ONE CAPITAL" x={0.2} y={0.12} size={0.055} kind="box" at={sec(start)(413.0)} />
      <Label text="TAKE IT = TAKE EVERYTHING" x={0.68} y={0.12} size={0.05} kind="box" at={sec(start)(414.9)} />
    </AbsoluteFill>
  );
};

// 416.05 "The Maya had dozens of kingdoms."
export const DozensAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.2, 1.3), y: -40 }} light={{ dir: [-0.6, 0.8] }} vignette={0.45}>
        <KingdomsMap ppd={120} center={[-90.0, 17.3]} k={ramp(t, 416.1, 417.3)} crowns={ramp(t, 416.6, 417.2)} />
      </Stage>
      <Label text="DOZENS OF KINGDOMS" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(416.8)} />
    </AbsoluteFill>
  );
};

// 418.1 "The Spanish had to beat them one by one, for more than 170 years."
export const OneByOneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <ConquestMap t={t} t0={418.6} step={0.3} zoom={push(frame, dur, 0.95, 1.02)} cx={0} cy={0} />
      <Label text="ONE BY ONE" x={0.25} y={0.1} size={0.06} kind="box" at={sec(start)(419.2)} />
      <Label text="170+ YEARS" x={0.75} y={0.1} size={0.06} kind="box" at={sec(start)(421.0)} />
    </AbsoluteFill>
  );
};

// 422.15 "And that's also why the Maya never disappeared."
export const NeverDisappearedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -100 }} light={{ dir: [-0.6, 0.5] }} vignette={0.55} bgBlur={6}
        bg={<Village mood="dawn" horizon={-260}><Sunburst y={-100} r={2400} rays={20} color="#f6d890" alt="#f0cc7a" speed={0.3} z={-39.5} /></Village>}
      >
        <Character {...MODERN_MAYA_MAN(2)} x={-420} y={-880} s={1.75} z={2} look={0.45} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.handsOnHips} />
        <Character {...MODERN_MAYA_WOMAN(1)} x={80} y={-900} s={1.8} z={2.1} look={0.45} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, 2)} />
        <Character {...MAYA_COMMONER(5)} x={480} y={-860} s={1.3} z={2.2} facing={-1} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} />
      </DepthStage>
      <Label text="NEVER DISAPPEARED" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(423.4)} />
    </AbsoluteFill>
  );
};

// 424.6 "When their cities fell, the people moved on."
export const MovedOnShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -60 }} light={{ dir: [0.5, 0.5] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-240}>
          <TikalTemple x={-700} y={-240} s={0.95} overgrown={0.8} z={-20} />
          <Leavers x={interpolate(t, [424.6, 427.1], [-200, 360])} y={-660} s={1.05} seed={6} facing={1} />
        </JungleSet>
      </Stage>
      <Label text="CITIES FELL" x={0.25} y={0.1} size={0.05} kind="box" at={sec(start)(425.0)} />
      <Label text="PEOPLE MOVED ON" x={0.72} y={0.1} size={0.05} kind="box" at={sec(start)(426.2)} />
    </AbsoluteFill>
  );
};

// 427.1 "When their kingdoms fell, the families stayed."
export const FamiliesStayedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -80 }} light={{ dir: [-0.5, 0.5] }} vignette={0.6}>
        <Village mood="day" horizon={-240}>
          <MayaHut x={0} y={-300} w={520} z={-10} />
          <Character {...MAYA_COMMONER(2)} x={-420} y={-760} s={1.4} z={2} look={0.45} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.handsOnHips} />
          <Character {...MAYA_WOMAN(2)} x={-60} y={-780} s={1.4} z={2.1} look={0.45} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 1)} />
          <Character {...MAYA_COMMONER(8)} x={260} y={-740} s={0.85} z={2.2} facing={-1} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} />
          <Character {...MAYA_WOMAN(5)} x={520} y={-760} s={1.2} z={2.15} facing={-1} look={0.45} expression={{ eyes: "closed", mouth: "smile" }} pose={poses.idle(frame, 3)} />
        </Village>
      </Stage>
      <Label text="KINGDOMS FELL" x={0.25} y={0.1} size={0.05} kind="box" at={sec(start)(427.5)} />
      <Label text="FAMILIES STAYED" x={0.72} y={0.1} size={0.05} kind="box" at={sec(start)(428.6)} />
    </AbsoluteFill>
  );
};

// 430.0 "Today, around 7 million people speak about 30 Mayan languages."
export const SevenMillionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const crowd = crowdSpots({ n: 15, x0: -1150, x1: 1150, yFar: -380, yNear: -700, sFar: 0.55, sNear: 0.82, rows: 3, seed: 53 });
  const words = ["K'ICHE'", "YUCATEC", "Q'EQCHI'", "MAM", "TZELTAL", "KAQCHIKEL"];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.5, 0.5] }} vignette={0.55}>
        <Village mood="day" horizon={-200}>
          {crowd.map(({ x, y, s, i }) => (
            <Character key={i} {...(i % 2 ? MODERN_MAYA_WOMAN(i) : MODERN_MAYA_MAN(i))} x={x} y={y} s={s} z={1 + i * 0.001} facing={i % 2 ? 1 : -1} look={0.45} talking={i % 3 === 0} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, i)} shadow={false} />
          ))}
        </Village>
      </Stage>
      <Label text="~7 MILLION" x={0.25} y={0.1} size={0.07} kind="box" at={sec(start)(431.3)} />
      <Label text="~30 MAYAN LANGUAGES" x={0.72} y={0.1} size={0.05} kind="box" at={sec(start)(432.8)} />
      {words.map((w, i) => (
        <Label pin key={w} text={w} x={0.14 + i * 0.145} y={0.27 + (i % 2) * 0.07} size={0.03} kind="box" at={sec(start)(432.9 + i * 0.12)} />
      ))}
    </AbsoluteFill>
  );
};

// 434.35 "In the mountains of Guatemala, some day-keepers still count the 260-day calendar."
export const DaykeeperShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const g = ramp(t, 437.4, 438.0, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ pos: [0, -200] }} vignette={0.7} vignetteColor="#140a10" bgBlur={5}
        bg={
          <>
            <Sky w={6000} h={3600} y={1500} top="#4a5a8a" mid="#8a8ab0" bottom="#e0b090" z={-41} />
            <Mountains w={6000} y={-200} color="#4a6a5a" outline={3} peaks={[[-2200, 420], [-1200, 560], [-200, 380], [700, 520], [1700, 400]]} z={-40} />
            <Ground w={6000} h={2000} y={-240} color="#7a9a5a" far="#6a8a4a" pebbles={6} tufts={10} tuftColor="#5a7a3a" seed={11} z={-30} />
            {g > 0.01 ? (
              <X y={300} s={g} z={-29}>
                <CalendarGear r={420} teeth={20} label="numbers" rot={frame * 0.008} color="#e8d2a0" />
              </X>
            ) : null}
          </>
        }
      >
        <Character {...DAYKEEPER} x={-420} y={-760} s={1.7} z={2} look={0.5} expression={{ eyes: "closed", mouth: "o", brows: 0.2 }} pose={{ ...poses.sit(frame), armF: [1.4, 0.6] }} />
        <X x={300} y={-500} z={2.1}>
          <Campfire size={1.1} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <Candle key={i} x={Math.cos(a) * 280} y={Math.sin(a) * 60 - 20} s={0.7} seed={i + 1} z={Math.sin(a) < 0 ? 0.1 : -0.1} />;
          })}
        </X>
      </DepthStage>
      <Label text="THE MOUNTAINS OF GUATEMALA" x={0.5} y={0.08} size={0.04} kind="box" at={sec(start)(435.1)} />
      <Label text="DAY-KEEPER" sub="AJ Q'IJ" x={0.2} y={0.2} size={0.055} kind="box" at={sec(start)(436.3)} />
      <Label text="260-DAY CALENDAR" x={0.72} y={0.2} size={0.05} kind="box" at={sec(start)(438.0)} />
    </AbsoluteFill>
  );
};

// 439.35 "And every day, millions of Maya families sit down to eat corn tortillas."
export const TortillasShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pat = Math.sin(frame * 0.6) * 0.15;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -260 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <PlankWall w={6000} h={3000} y={600} color="#c8a878" z={-41} />
        <Floorboards w={6000} h={1400} y={-760} color="#8a6a4a" z={-40} />
        <Character {...MODERN_MAYA_WOMAN(2)} x={-560} y={-820} s={1.5} z={1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={{ ...poses.idle(frame), armF: [1.6 + pat, 1.4], armB: [1.6 - pat, 1.4] }} />
        <Character {...MODERN_MAYA_MAN(0)} x={560} y={-820} s={1.45} z={1} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.sit(frame), armF: [1.4, 0.6] }} />
        <Character {...MAYA_COMMONER(8)} x={180} y={-800} s={0.95} z={1.05} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "tongue" }} pose={poses.sit(frame)} />
        <Part shape={roundRect(1300, 60, 10)} color="#8a5a32" shade={0.24} y={-580} z={1.5} />
        {[-260, 0, 260].map((x, i) => (
          <Tortilla key={x} x={x} y={-530} r={80} comal={i === 1} s={pop(t, 440.0 + i * 0.25)} z={1.6 + i * 0.01} />
        ))}
      </Stage>
      <Label text="EVERY DAY" x={0.2} y={0.1} size={0.05} kind="box" at={sec(start)(439.7)} />
      <Label text="CORN TORTILLAS" x={0.7} y={0.1} size={0.06} kind="box" at={sec(start)(442.8)} />
    </AbsoluteFill>
  );
};

// 444.1 "Remember the people of corn?"
export const PeopleOfCornAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -100 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <Paper color="#f0d890">
          <Sunburst y={-200} r={2400} rays={22} color="#f6e0a0" alt="#ecd088" speed={0.5} z={-39} />
          {[-420, 0, 420].map((x, i) => (
            <Character key={x} {...CORN_PERSON(i)} x={x} y={-760} s={1.5} z={2 + i * 0.01} facing={i === 2 ? -1 : 1} look={0.45} expression={{ eyes: "happy", mouth: "smile" }} pose={i === 1 ? poses.armsUp(frame) : poses.idle(frame, i)} />
          ))}
        </Paper>
      </Stage>
      <Label text="THE PEOPLE OF CORN" x={0.5} y={0.1} size={0.065} kind="title" at={sec(start)(444.6)} />
    </AbsoluteFill>
  );
};

// 445.85 "They're still here."
export const StillHereShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.16), y: -100 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <Village mood="dawn" horizon={-260}>
          <Sunburst y={-200} r={2400} rays={22} color="#f6d890" alt="#f0cc7a" speed={0.4} z={-39.5} />
          {[-420, 0, 420].map((x, i) => (
            <Character key={x} {...(i === 1 ? MODERN_MAYA_WOMAN(3) : MODERN_MAYA_MAN(i + 1))} x={x} y={-760} s={1.5} z={2 + i * 0.01} facing={i === 2 ? -1 : 1} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={i === 1 ? poses.armsUp(frame) : poses.idle(frame, i)} />
          ))}
        </Village>
      </Stage>
      <Label text="STILL HERE" x={0.5} y={0.1} size={0.08} kind="title" at={sec(start)(446.1)} />
    </AbsoluteFill>
  );
};

// 447.4 "So, would you rather be a Maya king, and pierce your tongue for the gods?"
export const RatherKingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arm: [number, number] = [2.2, 1.5];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: -160 }} light={{ pos: [300, 200] }} vignette={0.7} vignetteColor="#140a10" bgBlur={6} bg={<PalaceRoom floorY={-560} dim={0.15} />}>
        <Character {...MAYA_KING(1)} x={0} y={-980} s={2.1} z={2} look={0.5} expression={t > 450.4 ? { eyes: "closed", mouth: "tongue", brows: 0.9, sweat: true } : { eyes: "half", mouth: "smirk", brows: -0.3 }} pose={{ ...poses.idle(frame), armF: arm }} holdF={<StingraySpine rot={upright(arm) + 2.6} len={200} />} />
      </DepthStage>
      <Label text="WOULD YOU RATHER…" x={0.5} y={0.08} size={0.06} kind="title" at={sec(start)(447.9)} />
      <Label text="A MAYA KING" x={0.2} y={0.24} size={0.055} kind="box" at={sec(start)(449.2)} />
      <Label text="PIERCE YOUR TONGUE" x={0.78} y={0.24} size={0.045} kind="box" at={sec(start)(450.5)} />
    </AbsoluteFill>
  );
};

// 452.35 "Or a ballplayer, hitting a 3-kilo rubber ball with your hips?"
export const RatherBallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = 455.7;
  const bx = interpolate(t, [452.4, hit, hit + 0.9], [-900, -60, 700], { extrapolateRight: "clamp" });
  const by = interpolate(t, [452.4, hit, hit + 0.9], [300, -380, 220], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, y: -100, shake: hitAt(t, hit, 0.3) * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <JungleSet mood="day" horizon={-300} ground="#c9b48a" jungle={false}>
          <BallCourt y={-300} w={2400} h={700} z={-20} />
          <Character {...BALLPLAYER(1)} x={-100} y={-780} s={1.9} z={2} look={0.5} expression={t > hit ? { eyes: "wide", mouth: "shout", brows: 0.9 } : { eyes: "angry", mouth: "teeth", brows: -0.6 }} pose={{ ...poses.run(frame * 0.6), lean: -0.2 }} />
          <RubberBall x={bx} y={by} r={60} z={3} />
        </JungleSet>
      </Stage>
      <Label text="OR A BALLPLAYER?" x={0.5} y={0.08} size={0.06} kind="title" at={sec(start)(452.6)} />
      <Label text="3 KG RUBBER BALL" x={0.22} y={0.22} size={0.045} kind="box" at={sec(start)(454.3)} />
      <Label text="WITH YOUR HIPS!" x={0.76} y={0.22} size={0.05} kind="box" at={sec(start)(hit)} />
    </AbsoluteFill>
  );
};

// 456.6 "Tell me in the comments."
export const CommentsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -60 }} light={{ dir: [-0.5, 0.6] }} vignette={0.6}>
        <Gradient w={3000} h={4000} stops={[[0, "#8a3a3a"], [1, "#4a1a1a"]]} x={-1500} z={-41} />
        <Gradient w={3000} h={4000} stops={[[0, "#3a6a8a"], [1, "#1a3a4a"]]} x={1500} z={-40.9} />
        <Line pts={[[0, -2000], [0, 2000]]} width={12} z={-40} />
        <Character {...MAYA_KING(1)} x={-520} y={-740} s={1.5} z={2} look={0.45} expression={{ eyes: "happy", mouth: "smirk" }} pose={poses.handsOnHips} />
        <Character {...BALLPLAYER(0)} x={520} y={-740} s={1.5} z={2} facing={-1} look={0.45} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} />
        <X y={-40} s={pop(t, 456.75)} z={3}>
          <Part shape={circle(110)} color="#f2c84a" shade={0.24} />
        </X>
        <CommentBubble x={0} y={330} s={0.8 * pop(t, 457.0)} z={3} />
      </Stage>
      <Label text="VS" x={0.5} y={0.54} size={0.08} kind="title" at={sec(start)(456.75)} />
      <Label text="TELL ME IN THE COMMENTS" x={0.5} y={0.9} size={0.055} kind="box" at={sec(start)(456.9)} />
    </AbsoluteFill>
  );
};
