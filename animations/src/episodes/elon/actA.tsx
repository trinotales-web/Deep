import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Falcon1, Fireball, Flame, Smoke, Splash, WorldMap, CITY, worldXY, Roadster, Supercar, SpeedLines, HomeComputer, Bird, Chainsaw, StageSet, LineChart, Room, OldPhone, Sea,
  XMark, Cash, Banknote, Cloud, LaunchPad, Desk, Monitor,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { IslandSet, SeaSet, HighSky, SpaceSet, Paper, Office, MCRoom, ChipsTable, SchoolSet, RoadSet, Flash, usd } from "./sets";
import { ELON_2008, ELON_SCHOOL, ELON_TEEN, ELON_X, ELON_ZIP2, ENGINEER, BULLY, JUSTINE, ASTRONAUT, PERSON } from "./cast";

// Cold open (the island, 2008) and the "coming up" hook. Times are seconds on
// public/vo/elon.tight.voice.m4a (see public/captions/elon.json).

/** Keep a held prop upright in world space for an arm pose [shoulder, elbow]. */
export const upright = (arm: [number, number]) => -(arm[0] + arm[1]);

/** The little space shooter on a computer screen (Blastar-style), screen space ±W/2. */
export const PixelGame: React.FC<{ w?: number; h?: number; frame: number; z?: number }> = ({ w = 360, h = 270, frame, z = 0 }) => {
  const px = Math.max(6, w / 40);
  const shipX = Math.sin(frame * 0.07) * w * 0.3;
  const aliens = [-3, -1, 1, 3].map((i) => [i * w * 0.1 + Math.sin(frame * 0.05) * w * 0.08, h * 0.28] as [number, number]);
  const shot = (frame * 9) % (h * 0.9);
  return (
    <X z={z}>
      {aliens.map(([x, y], i) => (
        <X key={i} x={x} y={y}>
          <Part shape={roundRect(px * 3, px * 2, 1)} color={i % 2 ? "#e2584a" : "#f2c94a"} flat outline={0} />
          <Part shape={roundRect(px, px, 0)} color="#10202a" flat outline={0} y={-px * 0.2} x={-px * 0.6} z={0.001} />
          <Part shape={roundRect(px, px, 0)} color="#10202a" flat outline={0} y={-px * 0.2} x={px * 0.6} z={0.001} />
        </X>
      ))}
      <X x={shipX} y={-h * 0.36}>
        <Part shape={poly([[-px * 2, 0], [px * 2, 0], [0, px * 3]])} color="#7fe0b0" flat outline={0} />
      </X>
      <Part shape={roundRect(px * 0.6, px * 1.6, 0)} color="#ffffff" flat outline={0} x={shipX} y={-h * 0.3 + shot * 0.6} z={0.002} />
      {Array.from({ length: 12 }, (_, i) => (
        <Part key={i} shape={circle(1.5)} color="#ffffff" flat outline={0} x={((i * 97) % w) - w / 2} y={((i * 53 + frame * 2) % h) - h / 2} opacity={0.6} z={-0.001} />
      ))}
    </X>
  );
};

/** Framed photo of two people (wedding picture), cracking with `crack` 0..1. */
const PhotoFrame: React.FC<{ crack: number; frame: number }> = ({ crack, frame }) => (
  <X>
    <Part shape={roundRect(760, 560, 18)} color="#a0703f" shade={0.22} />
    <Part shape={roundRect(660, 460, 8)} color="#cfe4f2" flat outline={5} z={0.001} />
    <X z={0.002}>
      <Character {...ELON_2008} x={-120} y={-230} s={0.8} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 2)} shadow={false} />
      <Character {...JUSTINE} x={130} y={-230} s={0.8} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 5)} shadow={false} />
    </X>
    {crack > 0 ? (
      <X z={0.01}>
        <Line pts={[[-330, 180], [-120, 60], [-40, 110], [80, -20], [200, 10], [330, -150]]} width={6} color="#ffffff" opacity={Math.min(1, crack * 2)} />
        <Line pts={[[-40, 110], [-10, 230]]} width={5} color="#ffffff" opacity={Math.min(1, crack * 2)} />
        <Line pts={[[80, -20], [60, -230]]} width={5} color="#ffffff" opacity={Math.min(1, crack * 2)} />
      </X>
    ) : null}
  </X>
);

// ───────────────────────── cold open ─────────────────────────

// 0.12 "Imagine you're a SpaceX engineer…"
export const EngineerIntroShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }}
        light={{ dir: [-0.5, 0.7] }}
        vignette={0.6}
        bgBlur={6}
        bg={<IslandSet mood="day" horizon={-60} rocketX={-520} rocketH={700} />}
      >
        <Character {...ENGINEER(0)} x={520} y={-560} s={2.2} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "flat", gaze: [0.6, 0.35], brows: 0.2 }} pose={poses.idle(frame, 1)} />
      </DepthStage>
      <Label text="SPACEX ENGINEER" sub="THAT'S YOU" x={0.1} y={0.1} size={0.05} kind="box" at={at(0.9)} />
    </AbsoluteFill>
  );
};

// 2.02 "…on a tiny island in the Pacific Ocean,"
export const IslandWideShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.56), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <IslandSet mood="day" horizon={260} islandW={1500} rocketH={380} rocketX={80} />
        <Cloud x={-900} y={700} w={500} seed={12} z={-20} />
      </Stage>
      <Label text="PACIFIC OCEAN" x={0.9} y={0.1} size={0.05} kind="box" at={at(3.15)} />
    </AbsoluteFill>
  );
};

// 4.27 "…in the Marshall Islands."
export const MarshallMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sc = useScr();
  const ppd = interpolate(frame, [0, dur], [5.5, 9], { easing: Easing.inOut(Easing.quad) });
  const center: [number, number] = [172, 12];
  const [px, py] = worldXY(CITY.kwajalein[0], CITY.kwajalein[1], ppd, center);
  const p = sc(px, py + 110);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <WorldMap ppd={ppd} center={center} w={2600} h={1600} wrap pins={[{ at: CITY.kwajalein, s: pop(t, 4.4) * 1.3, glow: true }]} tint={{ Australia: "#d8b46a" }} tintK={0.3} />
      </Stage>
      <Label text="MARSHALL ISLANDS" x={p.x} y={p.y - 0.06} size={0.045} kind="box" pin at={sec(start)(4.45)} />
    </AbsoluteFill>
  );
};

// 5.69 "It's September 28, 2008."
export const LaunchDateShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05), y: 120, x: 120 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <IslandSet mood="dawn" horizon={-160} rocketH={760} rocketX={200} />
      </Stage>
      <Label text="SEPTEMBER 28, 2008" sub="OMELEK ISLAND" x={0.5} y={0.14} size={0.085} kind="title" at={at(5.9)} />
    </AbsoluteFill>
  );
};

// 8.15 "In front of you is a skinny rocket called Falcon 1."
export const Falcon1LowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 140, rot: 0.03 }}
        light={{ dir: [-0.6, 0.5] }}
        vignette={0.6}
        bgBlur={3}
        bg={<HighSky mood="dawn" />}
        fg={
          <>
            <BigFrond x={-1000} y={-700} rot={0.7} />
            <BigFrond x={1020} y={-640} rot={-0.6} flip />
          </>
        }
        fgBlur={9}
      >
        <LaunchPad x={140} y={-700} w={700} tower={1250} towerX={230} />
        <Falcon1 x={140} y={-700} h={1500} />
      </DepthStage>
      <Label text="FALCON 1" sub="SPACEX'S FIRST ROCKET" x={0.12} y={0.12} size={0.06} kind="box" at={at(10.2)} />
    </AbsoluteFill>
  );
};

/** A big palm frond for blurred foregrounds. */
const BigFrond: React.FC<{ x: number; y: number; rot: number; flip?: boolean }> = ({ x, y, rot, flip = false }) => (
  <X x={x} y={y} rot={rot} sx={flip ? -1 : 1}>
    <Part shape={blob([[0, 0], [180, 70], [420, 60], [640, -20], [430, 10], [200, 0]], 8)} color="#3f8f3a" shade={0.2} />
    <Part shape={blob([[60, -30], [260, -40], [520, -120], [300, -60]], 6)} color="#4fa04a" shade={0.2} z={0.001} />
  </X>
);

// 11.38 "It has already failed three times."
export const ThreeFailsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const xs = [-560, 0, 560];
  const times = [11.95, 12.36, 12.76];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.45}>
        <Paper>
          {xs.map((x, i) => (
            <React.Fragment key={x}>
              <Falcon1 x={x} y={-330} h={620} />
              <XMark x={x} y={0} size={340 * pop(t, times[i])} color="#d8322f" z={1} />
            </React.Fragment>
          ))}
        </Paper>
      </Stage>
      {["2006", "2007", "2008"].map((y, i) => (
        <Label key={y} text={y} x={0.5 + xs[i] / 1920} y={0.86} size={0.05} kind="box" pin at={at(times[i])} />
      ))}
    </AbsoluteFill>
  );
};

// 13.61 "The first one caught fire and crashed."
export const Fail1Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 13.7, 15.1, Easing.in(Easing.quad));
  const y = interpolate(k, [0, 1], [180, -620]);
  const rot = interpolate(k, [0, 1], [0.15, 1.1]);
  const hit = hitAt(t, 15.1, 0.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.9, y: -60, shake: hit * 10 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SeaSet mood="day" horizon={-420}>
          {t < 15.15 ? (
            <X x={interpolate(k, [0, 1], [-200, 260])} y={y} rot={rot} z={2}>
              <Falcon1 h={640} thrust={t < 14.6 ? 0.8 : 0.25} />
              {t > 14.3 ? <Flame x={-30} y={60} size={1.1} seed={3} z={0.05} /> : null}
            </X>
          ) : null}
          {t > 14.3 && t < 15.15 ? <Smoke x={interpolate(k, [0, 1], [-200, 260])} y={y} w={140} h={600} alpha={0.45} z={1.5} /> : null}
          <Fireball t={ramp(t, 15.1, 16.4, Easing.linear)} x={260} y={-560} s={0.9} z={3} />
        </SeaSet>
      </Stage>
      <Label text="FLIGHT 1" sub="2006" x={0.1} y={0.1} size={0.05} kind="box" at={at(13.7)} />
    </AbsoluteFill>
  );
};

// 15.94 "The second one started spinning and shut down too early."
export const Fail2Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const spin = ramp(t, 16.6, 18.6, Easing.in(Easing.quad));
  const on = t < 17.5 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <HighSky alt={0.7}>
          <X y={interpolate(t, [15.9, 18.7], [-120, 60])} rot={Math.sin(t * 9 * spin) * 0.5 * spin} z={2}>
            <Falcon1 y={-430} h={860} thrust={on} />
          </X>
          {t > 17.5 && t < 18.2 ? <Smoke x={0} y={-320} w={90} h={300} alpha={0.4} z={1} /> : null}
        </HighSky>
      </Stage>
      <Label text="FLIGHT 2" sub="2007" x={0.1} y={0.1} size={0.05} kind="box" at={at(16.0)} />
    </AbsoluteFill>
  );
};

// 18.89 "On the third, the two halves of the rocket smashed into each other."
export const Fail3Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sepK = ramp(t, 19.75, 20.6, Easing.out(Easing.quad));
  const bump = ramp(t, 20.55, 20.95, Easing.in(Easing.quad));
  const hit = hitAt(t, 20.9, 0.4);
  const split = sepK * 140 - bump * 110;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.25), y: 200, shake: hit * 12 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <HighSky alt={0.95}>
          <X y={-260} z={2}>
            <Falcon1 h={760} upper={false} thrust={t < 19.7 ? 1 : 0} y={-sepK * 40 + bump * 30} rot={t > 20.9 ? (t - 20.9) * 0.6 : 0} />
            <Falcon1 h={760} lower={false} split={split} tilt2={t > 20.9 ? -(t - 20.9) * 0.9 : 0} />
          </X>
          <Fireball t={ramp(t, 20.9, 21.9, Easing.linear)} y={250} s={0.45} debris z={3} />
        </HighSky>
      </Stage>
      <Flash k={hitAt(t, 20.9, 0.25) * 0.6} />
      <Label text="FLIGHT 3" sub="2008" x={0.1} y={0.1} size={0.05} kind="box" at={at(19.0)} />
    </AbsoluteFill>
  );
};

// 22.39 "Your boss knows a fourth failure would be game over."
export const BossKnowsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [0.7, 0.3] }} vignette={0.7} vignetteColor="#0a0e18" bgBlur={7} bg={<MCRoom />}>
        <Glow x={700} y={200} rx={900} ry={700} color="#4a9adf" alpha={0.22} additive z={-1} />
        <Character
          {...ELON_2008}
          x={-260}
          y={-600}
          s={2.3}
          look={0.55}
          expression={{ eyes: t > 24.4 ? "wide" : "open", mouth: t > 24.4 ? "o" : "flat", brows: 0.6, gaze: [0.6, 0.1], sweat: t > 23.6 }}
          pose={poses.idle(frame, 3)}
        />
      </DepthStage>
      <Label text="GAME OVER" x={0.85} y={0.86} size={0.075} kind="stamp" at={at(24.5)} />
    </AbsoluteFill>
  );
};

// 25.69 "And your boss is in deep trouble."
export const DeepTroubleShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.55, 1.65), y: -70, x: -40 }} light={{ dir: [0.5, 0.6] }} vignette={0.75} vignetteColor="#0a0e18">
        <Office era="2008" night desk={false}>
          <Glow x={220} y={-40} rx={500} ry={300} color="#6ab0ff" alpha={0.2} additive z={-5} />
          <Character {...ELON_2008} x={-80} y={-300} s={1.1} look={0.4} expression={{ eyes: "sad", mouth: "frown", brows: 0.8, eyebags: true }} pose={{ ...poses.grief(frame), sit: true }} z={-2} />
          <X x={60} y={-420} z={5}>
            <Desk w={900} h={300} color="#3a3e46" />
            <Monitor x={300} y={460} w={380} h={240} screen="#1e3a5a" />
          </X>
        </Office>
      </Stage>
    </AbsoluteFill>
  );
};

// 27.72 "His car company is running out of money."
export const CarCompanyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const drain = ramp(t, 28.4, 29.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [-0.5, 0.7] }} vignette={0.65}>
        <Room wall="#9aa0aa" floor="#6a6e76" y={-420} boards={false} z={-40} />
        <Glow x={0} y={300} rx={900} ry={500} color="#fff2c6" alpha={0.18} additive z={-30} />
        <Roadster x={-60} y={-420} s={1.4} z={2} />
        {[-520, -380, 360, 520].map((x, i) => (
          <Cash key={x} x={x} y={-420} s={Math.max(0.02, 1 - drain * (1 + i * 0.2))} z={3} />
        ))}
        {Array.from({ length: 6 }, (_, i) => {
          const k = Math.max(0, Math.min(1, drain * 1.6 - i * 0.12));
          return k > 0 ? <Banknote key={i} x={-300 + i * 140 + k * 300} y={-200 + k * 700} rot={k * 3 + i} s={0.6} z={4} /> : null;
        })}
      </Stage>
      <Label text="TESLA" sub="HIS CAR COMPANY" x={0.1} y={0.1} size={0.055} kind="box" at={at(27.85)} />
      <Label text="RUNNING OUT OF MONEY" x={0.9} y={0.85} size={0.045} kind="box" at={at(29.0)} />
    </AbsoluteFill>
  );
};

// 29.91 "His marriage is ending."
export const MarriageShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 30.8, 0.35);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 30, shake: hit * 6 }} light={{ dir: [0.5, 0.6] }} vignette={0.75} vignetteColor="#120a10">
        <Room wall="#8a6a5a" floor="#5a3a2a" y={-460} z={-40} />
        <Glow x={-500} y={300} rx={700} ry={500} color="#ffcf8a" alpha={0.18} additive z={-30} />
        <Part shape={roundRect(1600, 60, 8)} color="#6e4a2c" shade={0.2} y={-430} z={-5} />
        <X y={-100} rot={-0.03}>
          <PhotoFrame crack={ramp(t, 30.8, 31.0, Easing.linear)} frame={frame} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// 31.70 "He has put almost everything he owns into this rocket and those cars."
export const AllInShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 32.1, 33.9);
  const pushArm: [number, number] = [0.55 + k * 0.55, 0.5 - k * 0.35];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -150 }} light={{ dir: [-0.4, 0.8] }} vignette={0.7}>
        <ChipsTable
          push={k}
          y={-640}
          front={
            <>
              <Falcon1 x={420} y={-10} h={460} z={0.02} />
              <Roadster x={820} y={-30} s={0.45} z={0.02} shadow={false} />
            </>
          }
        >
          <Character
            {...ELON_2008}
            x={-420}
            y={-520}
            s={1.7}
            look={0.6}
            expression={{ eyes: "open", mouth: "flat", brows: -0.3, gaze: [0.6, -0.5] }}
            pose={{ ...poses.idle(frame, 2), armF: pushArm, armB: [pushArm[0] - 0.2, pushArm[1] + 0.1], lean: -0.06 * k }}
            z={0}
          />
        </ChipsTable>
      </Stage>
      <Label text="EVERYTHING HE OWNS" x={0.5} y={0.1} size={0.05} kind="box" at={sec(start)(32.5)} />
    </AbsoluteFill>
  );
};

// 35.53 "He's 37 years old."
export const Age37Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.6, 0.5] }} vignette={0.65} bgBlur={7} bg={<IslandSet mood="dusk" horizon={-100} rocketX={-520} rocketH={760} />}>
        <Character {...ELON_2008} x={300} y={-620} s={2.35} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.3, gaze: [0.3, 0.2] }} pose={poses.idle(frame, 4)} />
      </DepthStage>
      <Label text="37 YEARS OLD" x={0.1} y={0.1} size={0.055} kind="box" at={at(35.75)} />
    </AbsoluteFill>
  );
};

// 37.16 "His name is Elon Musk."
export const NameRevealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0), y: 60, rot: -0.025 }} light={{ dir: [0.7, 0.3] }} vignette={0.7}>
        <IslandSet mood="dusk" horizon={-320} rocketX={420} rocketH={1250} rocketY={-80}>
          <Character {...ELON_2008} x={-420} y={-560} s={2.0} look={0.55} expression={{ eyes: "open", mouth: "smirk", brows: -0.2, gaze: [0.5, 0.5] }} pose={poses.idle(frame, 5)} z={10} />
        </IslandSet>
      </Stage>
      <Label text="ELON MUSK" sub="SPACEX FOUNDER" x={0.5} y={0.14} size={0.11} kind="title" at={at(37.85)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the hook ─────────────────────────

// 39.55 "So how does a bullied kid from South Africa end up here,"
export const BulliedKidShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }}
        light={{ dir: [-0.6, 0.6] }}
        vignette={0.65}
        bgBlur={6}
        bg={
          <SchoolSet horizon={-560}>
            {[0, 1, 2].map((i) => (
              <Character key={i} {...BULLY(i)} x={-640 + i * 260} y={-560 + 8 * 64} s={1.0} facing={1} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={i === 1 ? poses.point(frame) : poses.idle(frame, i)} />
            ))}
          </SchoolSet>
        }
      >
        <Character {...ELON_SCHOOL} x={380} y={-560 + 2 * 64} s={1.6} facing={-1} look={0.3} expression={{ eyes: "sad", mouth: "frown", brows: 0.8, gaze: [-0.2, -0.4] }} pose={poses.sit(frame)} />
      </DepthStage>
      <Label text="SOUTH AFRICA" x={0.9} y={0.1} size={0.05} kind="box" at={at(40.95)} />
    </AbsoluteFill>
  );
};

// 42.98 "betting everything on one rocket?"
export const BettingRocketShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 100 }}
        light={{ dir: [-0.7, 0.4] }}
        vignette={0.7}
        bgBlur={4}
        bg={<IslandSet mood="dusk" horizon={-260} rocketX={-380} rocketH={1100} />}
      >
        <Character {...ELON_2008} x={640} y={-860} s={2.7} facing={-1} look={0.35} expression={{ eyes: "open", mouth: "flat", brows: 0.4, gaze: [0.5, 0.9] }} pose={poses.idle(frame, 6)} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 45.35 "And how does he go from almost broke to the first trillionaire in history?"
export const BrokeToTrillionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 46.6, 48.4, Easing.in(Easing.cubic));
  const v = t < 46.6 ? 0 : Math.pow(10, 3 + k * 9) * (k > 0.999 ? 1 : 1);
  const vals = [0.04, 0.03, 0.05, 0.04, 0.08, 0.12, 0.2, 0.35, 0.6, 0.95];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.45}>
        <Paper>
          <LineChart y={-40} w={1500} h={760} values={vals} k={ramp(t, 45.6, 48.6, Easing.inOut(Easing.quad))} color="#2fa05a" />
        </Paper>
      </Stage>
      <Label text={t < 46.6 ? "$0" : k >= 0.999 ? "$1,000,000,000,000" : usd(v)} x={0.5} y={0.1} size={0.07} kind="title" at={at(45.5)} />
      <Label text="FIRST TRILLIONAIRE IN HISTORY" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(48.1)} />
    </AbsoluteFill>
  );
};

// 49.97 "Coming up, a 12-year-old who sells his own video game."
export const TeaserGameShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: 40, x: 120 }} light={{ dir: [0.6, 0.5] }} vignette={0.7} vignetteColor="#0a0e18">
        <Room wall="#4a4a6a" floor="#3a3040" y={-460} z={-40} />
        <Glow x={360} y={60} rx={700} ry={500} color="#7fe0b0" alpha={0.2} additive z={-30} />
        <X x={420} y={-420} s={1.1} z={2}>
          <HomeComputer>
            <PixelGame frame={frame} />
          </HomeComputer>
        </X>
        <Character {...ELON_TEEN} x={-280} y={-560} s={1.85} look={0.6} expression={{ eyes: "wide", mouth: "grin", gaze: [0.8, 0.1] }} pose={{ ...poses.idle(frame, 3), armF: [1.25, 0.35 + Math.sin(frame * 0.9) * 0.08], armB: [1.1, 0.5] }} z={3} />
      </Stage>
      <Label text="COMING UP" x={0.1} y={0.1} size={0.05} kind="box" at={at(49.98)} />
      <Label text="AGE 12" sub="HIS OWN VIDEO GAME" x={0.9} y={0.1} size={0.05} kind="box" at={at(50.8)} />
    </AbsoluteFill>
  );
};

// 53.27 "A million-dollar car crash with no insurance."
export const TeaserCrashShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <RoadSet horizon={-120}>
          <X x={interpolate(t, [53.1, 56], [-200, 120])} y={interpolate(t, [53.1, 56], [-40, 60])} rot={0.5 + (t - 53.1) * 0.35} z={5}>
            <Supercar s={1.25} spin={frame * 0.4} wreck={0.2} shadow={false} />
          </X>
          <Smoke x={-500} y={-420} w={300} h={500} alpha={0.35} z={4} />
        </RoadSet>
      </Stage>
      <Label text="$1 MILLION CAR" x={0.1} y={0.1} size={0.05} kind="box" at={at(53.4)} />
      <Label text="NO INSURANCE" x={0.5} y={0.86} size={0.07} kind="stamp" at={at(55.15)} />
    </AbsoluteFill>
  );
};

// 56.10 "A man fired on his honeymoon."
export const TeaserFiredShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const arm: [number, number] = [1.15, 1.25];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <SeaSet mood="day" horizon={-60}>
          <Part shape={roundRect(6000, 900, 0)} color="#ead39a" flat outline={5} y={-560} z={-20} />
          <Part shape={roundPoly4()} color="#e86a4a" shade={0.2} x={-60} y={-430} z={1} />
          <Character
            {...ELON_ZIP2}
            x={-60}
            y={-390}
            s={1.6}
            look={0.6}
            expression={{ eyes: t > 56.5 ? "wide" : "happy", mouth: t > 56.5 ? "o" : "smile", brows: t > 56.5 ? 0.7 : 0, gaze: [0.6, -0.6] }}
            pose={{ ...poses.sit(frame), armF: arm }}
            holdF={<OldPhone s={0.55} rot={upright(arm)} lit={1} />}
            z={2}
          />
        </SeaSet>
      </Stage>
      <Label text="FIRED" x={0.5} y={0.86} size={0.09} kind="stamp" at={at(56.55)} />
    </AbsoluteFill>
  );
};

/** Beach-chair seat shape. */
const roundPoly4 = () => roundRect(420, 60, 20);

// 57.98 "A car sent into space with a dummy at the wheel."
export const TeaserCarSpaceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 0 }} light={{ dir: [-0.8, 0.4] }} vignette={0.6}>
        <SpaceSet earthY={-1500} earthR={1300}>
          <X x={interpolate(t, [57.8, 61], [-120, 120])} y={60} rot={-0.12 + Math.sin(t * 0.6) * 0.05} z={5}>
            <Roadster s={1.25} shadow={false}>
              <Character {...ASTRONAUT(0)} x={0} y={-120} s={0.62} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={{ ...poses.sit(frame), armF: [1.4, 0.3], armB: [1.3, 0.4] }} shadow={false} />
            </Roadster>
          </X>
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 60.96 "A 44-billion-dollar website."
export const TeaserTwitterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7}>
        <StageSet curtain="#2a3a6a" spots={1} y={-420} />
        <Part shape={roundRect(420, 300, 12)} color="#e8e2d8" shade={0.2} y={-270} z={2} />
        <Bird x={-10} y={40} s={1.5 * pop(t, 61.0) + 0.01} flap={Math.max(0, Math.sin(frame * 0.5)) * 0.5} z={3} />
        <Glow x={0} y={80} rx={500} color="#ffe9a0" alpha={0.3} additive z={2.5} />
      </Stage>
      <Label text="$44 BILLION" x={0.5} y={0.86} size={0.08} kind="stamp" at={at(61.15)} />
    </AbsoluteFill>
  );
};

// 63.34 "And a chainsaw on a stage."
export const TeaserChainsawShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const raise = ramp(t, 63.5, 63.9);
  const arm: [number, number] = [0.6 + raise * 1.6, 0.4 - raise * 0.25];
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
    </AbsoluteFill>
  );
};

// 65.61 "But first, we go back to South Africa, 1971."
export const BackToSAShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const ppd = interpolate(frame, [0, dur], [4.2, 11], { easing: Easing.inOut(Easing.quad) });
  const center: [number, number] = [26, -18];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <WorldMap ppd={ppd} center={center} w={2600} h={1600} tint={{ "South Africa": "#e2a04a" }} tintK={ramp(t, 66.9, 67.4)} pins={[{ at: CITY.pretoria, s: pop(t, 67.0) * 1.2, glow: true }]} />
      </Stage>
      <Label text="SOUTH AFRICA, 1971" x={0.5} y={0.14} size={0.08} kind="title" at={at(68.0)} />
    </AbsoluteFill>
  );
};

// keep tree-shaking quiet for helpers used later
export const _unused = { Splash, SpeedLines, Sea, PERSON, ellipse, Wash, Line };
