import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, Glow, X, Part, roundRect, ellipse, palette } from "../../kit";
import { Character, poses } from "../../kit/character";
import {
  PlankWall,
  Floorboards,
  BlindsWindow,
  HangingLamp,
  Desk,
  Poster,
  Clock,
  Flag,
  Calendar,
  Sky,
  Cloud,
  Mountains,
  Hill,
  Sea,
  Ground,
  Bush,
  PalmTree,
  Sun,
  Moon,
  Stars,
  Campfire,
  Sunburst,
} from "../../kit/env";
import { ONODA, MAJOR } from "./cast";

// Years shot timing (local frames) — shared with the sound cue sheet.
export const FLIP_START = 10;
export const FLIP_END = 80;
export const FLIP_PAGES = 28;
export const YEARS_HIT = 84;

const useFormat = () => {
  const { width, height } = useVideoConfig();
  return { wide: width > height, W: width, H: height };
};

const ease = Easing.bezier(0.45, 0, 0.55, 1);
/** Slow push-in over the shot, like the reference camera work. */
const push = (frame: number, dur: number, from = 1, to = 1.08) =>
  interpolate(frame, [0, dur], [from, to], { easing: ease, extrapolateRight: "clamp" });

// ---------------------------------------------------------------------------

export const OfficeShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { wide } = useFormat();
  const floorY = wide ? -300 : -470;
  const salute = interpolate(frame, [22, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const onodaPose = poses.mix(poses.idle(frame, 1), poses.salute, salute);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur), y: wide ? 0 : -60 }} light={{ pos: [0, 700] }}>
        <PlankWall w={2600} h={2400} y={floorY + 1200} rail={wide ? -170 : -260} z={-10} />
        <Poster x={wide ? -620 : -300} y={wide ? 160 : 290} z={-9} rot={-0.03} />
        <Clock x={wide ? 40 : 60} y={wide ? 300 : 560} z={-9} />
        <BlindsWindow x={wide ? 560 : 340} y={wide ? 180 : 330} w={wide ? 360 : 300} h={wide ? 280 : 300} z={-9} />
        <Flag x={wide ? 700 : 300} y={floorY} pole={wide ? 520 : 640} z={-8} />
        <Floorboards w={2600} h={1400} y={floorY} z={-7} />
        <HangingLamp x={wide ? -80 : -20} y={wide ? 560 : 980} cord={wide ? 60 : 150} z={5} />
        {/* the Major behind his desk */}
        <Character
          {...MAJOR}
          x={wide ? 330 : 190}
          y={floorY + 70}
          s={wide ? 1.05 : 1.3}
          facing={-1}
          z={1}
          talking={frame > 6 && frame < 70}
          expression={{ eyes: "half", mouth: "flat", brows: -0.3, eyebags: true, gaze: [0.6, 0] }}
          pose={poses.point(frame)}
          shadow={false}
        />
        <Desk x={wide ? 330 : 190} y={floorY - 40} w={wide ? 470 : 560} h={wide ? 230 : 270} z={2} />
        <X x={wide ? 260 : 120} y={floorY - 40 + (wide ? 230 : 270)} z={2.5}>
          <Part shape={roundRect(140, 12, 3)} color={palette.paper} shade={0.15} rot={0.05} y={6} />
          <Part shape={roundRect(110, 12, 3)} color="#f4ead2" shade={0.15} rot={-0.04} y={16} z={0.001} />
        </X>
        <Character
          {...ONODA}
          x={wide ? -360 : -250}
          y={floorY - (wide ? 90 : 130)}
          s={wide ? 1.0 : 1.25}
          z={3}
          expression={{ eyes: salute > 0.5 ? "angry" : "open", mouth: "flat", brows: -0.4, gaze: [0.7, 0.1] }}
          pose={onodaPose}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

export const CloseUpShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { wide } = useFormat();
  const hit = interpolate(frame, [4, 7, 18], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.02, 1.14), shake: hit * 14 }} light={{ dir: [-0.8, 0.6] }} vignette={0.65}>
        <Sunburst r={2400} rays={20} color="#86302a" alt="#6c2420" z={-10} />
        <Glow rx={900} color="#ffb070" alpha={0.18} additive z={-9} />
        <Character
          {...ONODA}
          x={wide ? 0 : 0}
          y={wide ? -1150 : -1330}
          s={wide ? 2.9 : 3.5}
          look={0.15}
          z={1}
          talking={false}
          expression={{ eyes: "angry", mouth: frame > 40 ? "teeth" : "flat", brows: -0.8, gaze: [0, 0] }}
          pose={{ armF: [0.1, 0.1], armB: [-0.1, -0.1] }}
          shadow={false}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

export const IslandShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { wide } = useFormat();
  const horizon = wide ? 60 : 120;
  const groundY = wide ? -200 : -420;
  const walkX = interpolate(frame, [0, dur], wide ? [-560, 120] : [-330, 60]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), x: walkX * 0.35 }} light={{ dir: [-0.85, 0.5] }}>
        <Sky w={3200} h={2400} y={horizon + 900} top="#3f93d6" bottom="#cdeaf6" z={-20} />
        <Sun x={wide ? -650 : -330} y={wide ? 380 : 760} z={-19} />
        <Cloud x={wide ? -420 : -260} y={wide ? 360 : 640} w={340} seed={2} z={-18} />
        <Cloud x={wide ? 380 : 260} y={wide ? 420 : 820} w={420} seed={5} z={-18} />
        <Cloud x={wide ? 820 : 520} y={wide ? 250 : 480} w={260} seed={8} z={-18} />
        <Mountains w={3000} y={horizon} color="#8fa8c4" peaks={[[-900, 120], [-520, 230], [-300, 140], [260, 190], [700, 110], [1100, 160]]} z={-17} />
        <Sea w={3200} h={700} y={horizon} z={-16} />
        <Hill x={wide ? 640 : 420} y={horizon - 40} w={wide ? 900 : 760} h={wide ? 300 : 360} color="#4f9a3d" seed={4} z={-15} />
        <Bush x={wide ? 470 : 280} y={horizon + 150} w={260} color="#3f8a35" seed={3} z={-14.5} />
        <PalmTree x={wide ? 760 : 520} y={horizon + 40} h={wide ? 360 : 420} lean={-0.15} seed={2} z={-14} />
        <Ground w={3200} h={1200} y={groundY + 220} color={palette.sand} far="#efdcae" pebbles={18} tufts={12} tuftColor="#6b9a45" z={-12} />
        <PalmTree x={wide ? -780 : -470} y={groundY + 60} h={wide ? 560 : 760} lean={0.2} seed={7} z={-6} />
        <Bush x={wide ? -620 : -400} y={groundY + 80} w={340} color="#3d8a33" seed={9} z={-5} />
        <Character
          {...ONODA}
          x={walkX}
          y={groundY}
          s={wide ? 0.95 : 1.15}
          z={2}
          expression={{ eyes: "open", mouth: "flat", brows: -0.2, gaze: [0.8, 0] }}
          pose={poses.walk(frame, 1.1)}
        />
        <Bush x={wide ? 820 : 470} y={groundY - 180} w={420} color="#357a2e" seed={12} z={6} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

export const NightShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { wide } = useFormat();
  const groundY = wide ? -260 : -420;
  const fire: [number, number] = [wide ? 120 : 140, groundY - 40];
  const realize = interpolate(frame, [95, 102], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage
        camera={{ zoom: push(frame, dur, 1.0, 1.1), y: wide ? 0 : -80 }}
        light={{ pos: [fire[0], fire[1] + 120] }}
        shadowMul={[0.5, 0.5, 0.68]}
        vignette={0.7}
        vignetteColor="#05060f"
      >
        <Sky w={3200} h={2600} y={300} top="#0b1030" bottom="#2b3a63" z={-20} />
        <Stars w={2400} h={1400} y={700} count={80} z={-19} />
        <Moon x={wide ? -620 : -300} y={wide ? 340 : 720} z={-18} />
        <Hill x={-500} y={groundY + 180} w={1800} h={380} color="#1f3a2e" seed={6} z={-15} />
        <Hill x={700} y={groundY + 160} w={1600} h={300} color="#22402f" seed={8} z={-14} />
        <PalmTree x={wide ? 780 : 470} y={groundY + 100} h={620} lean={-0.2} seed={4} frond="#25502c" z={-12} />
        <Bush x={wide ? -760 : -430} y={groundY + 100} w={420} color="#1d4026" seed={5} z={-11} />
        <Ground w={3200} h={1200} y={groundY + 120} color="#4a4a3c" far="#3c4034" pebbles={10} tufts={10} tuftColor="#2f3a28" z={-10} />
        <Campfire x={fire[0]} y={fire[1]} size={wide ? 0.9 : 1.05} z={1} />
        <X x={wide ? -230 : -200} y={groundY + 6} s={wide ? 1.0 : 1.2} z={1.5}>
          <Part shape={roundRect(220, 56, 26)} color="#6e4a2c" shade={0.3} y={26} />
          <Part shape={ellipse(22, 24)} color="#b08a5a" shade={0.2} x={-98} y={26} z={0.001} />
        </X>
        <Character
          {...ONODA}
          x={wide ? -230 : -200}
          y={groundY + 30}
          s={wide ? 1.0 : 1.2}
          z={2}
          look={0.55}
          expression={
            realize > 0.5
              ? { eyes: "wide", mouth: "wavy", brows: 0.6, gaze: [0.4, 0], sweat: true }
              : { eyes: "half", mouth: "flat", brows: 0.2, gaze: [0.8, -0.3] }
          }
          pose={poses.sit(frame)}
        />
        <Glow x={fire[0]} y={fire[1] + 150} rx={1300} ry={900} color="#ff8a3a" alpha={0.12} additive z={9} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

export const YearsShot: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { wide } = useFormat();
  // pages flip faster and faster, then stop on the big hit
  const flipT = interpolate(frame, [FLIP_START, FLIP_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const pages = Math.floor(flipT * FLIP_PAGES);
  const flip = (flipT * FLIP_PAGES) % 1;
  const hitAt = YEARS_HIT;
  const hit = interpolate(frame, [hitAt, hitAt + 3, hitAt + 16], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(frame, [hitAt - 2, hitAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12) + hit * 0.04, shake: hit * 18 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <PlankWall w={2600} h={2600} color="#7d5a3a" plank={110} z={-10} />
        <Glow rx={900} color="#ffe0a0" alpha={0.18} y={wide ? 100 : 300} additive z={-9} />
        <Calendar
          x={wide ? -330 : 0}
          y={wide ? 70 : 330}
          s={wide ? 1.55 : 1.9}
          crossed={Math.min(21, (pages * 3) % 22 + (frame > hitAt ? 21 : 0))}
          circled={frame > hitAt ? 20 : null}
          flip={frame < hitAt ? flip : 0}
          z={1}
          rot={-0.03}
        />
        <Character
          {...ONODA}
          hair="sides"
          hairColor="#d3cdd2"
          beard="stubble"
          x={wide ? 420 : 40}
          y={(wide ? -700 : -1060) + rise * (wide ? 300 : 420)}
          s={wide ? 1.7 : 2.1}
          look={0.3}
          z={3}
          expression={{ eyes: "angry", mouth: "teeth", brows: -0.7, eyebags: true, gaze: [-0.3, 0.2] }}
          pose={{ armF: [0.3, 0.2], armB: [-0.3, -0.2] }}
          shadow={false}
        />
      </Stage>
    </AbsoluteFill>
  );
};
