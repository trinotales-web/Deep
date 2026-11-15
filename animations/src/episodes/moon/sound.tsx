import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Bed, Sfx, SoundAt, licensedSrc, duckFromCaptions, type AmbName, type SfxName } from "../../kit/audio";

// Sound design for the Moon south pole story. Voice-first: no music, no
// musical stingers, no whooshes on cuts. One quiet bed per location (a low
// airless "space" rumble for space and the lunar surface, room tone for
// mission control and offices, wind at launch pads) and licensed one-shots
// (Essential Sound Effects Bundle) only for things you can see happen.
// Everything ducks under the narration; times are seconds on the tightened
// VO (public/vo/moon.tight.voice.m4a).

const E = (name: string) => licensedSrc("essential", name);

const AMB = 0.85;
const FX = 0.9;
const FX_DUCK = 0.55; // ≈ -5 dB under speech
const AMB_DUCK = 0.5; // ≈ -6 dB under speech

type BedRow = [AmbName, number, number, number];
// location beds (generated from the shot sets): [bed, from, to, gain]
const BEDS: BedRow[] = [
  ["room_tone", 0.0, 12.34, 0.3],
  ["space", 12.34, 21.19, 0.85],
  ["room_tone", 21.19, 24.71, 0.3],
  ["space", 24.71, 31.26, 0.85],
  ["room_tone", 31.26, 36.36, 0.3],
  ["space", 36.36, 81.7, 0.85],
  ["room_tone", 81.7, 83.84, 0.2],
  ["space", 83.84, 116.19, 0.85],
  ["room_tone", 116.19, 120.37, 0.2],
  ["space", 120.37, 133.98, 0.85],
  ["room_tone", 133.98, 136.17, 0.26],
  ["space", 136.17, 231.45, 0.85],
  ["room_tone", 231.45, 232.94, 0.3],
  ["space", 232.94, 235.84, 0.85],
  ["room_tone", 235.84, 238.42, 0.26],
  ["space", 238.42, 241.16, 0.85],
  ["wind", 241.16, 245.73, 0.22],
  ["space", 245.73, 276.9, 0.85],
  ["room_tone", 276.9, 277.77, 0.26],
  ["space", 277.77, 294.29, 0.85],
  ["room_tone", 294.29, 298.49, 0.26],
  ["space", 298.49, 375.49, 0.85],
  ["room_tone", 375.49, 377.3, 0.3],
  ["space", 377.3, 408.89, 0.85],
  ["wind", 408.89, 410.71, 0.22],
  ["space", 410.71, 430.4, 0.85],
  ["wind", 430.4, 432.3, 0.22],
  ["space", 432.3, 456.08, 0.85],
  ["wind", 456.08, 458.91, 0.22],
  ["wind", 458.91, 462.96, 0.3],
  ["space", 462.96, 484.41, 0.85],
  ["room_tone", 484.41, 489.74, 0.26],
  ["space", 489.74, 535.65, 0.85],
  ["room_tone", 535.65, 537.44, 0.3],
  ["space", 537.44, 543.5, 0.85],
  ["room_tone", 543.5, 548.15, 0.26],
  ["space", 548.15, 595.47, 0.85],
  ["room_tone", 595.47, 597.0, 0.26],
  ["space", 597.0, 605.4, 0.85],
];

const LBEDS: [string, number, number, number][] = [
  ["ambient-background-people-in-an-open-room", 0.0, 12.34, 0.07],
  ["ambient-background-people-in-an-open-room", 21.19, 22.95, 0.07],
  ["ambient-background-people-in-an-open-room", 31.26, 36.36, 0.07],
  ["ambient-crowd-murmur-indoors-1", 133.98, 136.17, 0.08],
  ["ambient-background-people-in-an-open-room", 231.45, 232.94, 0.07],
  ["ambient-background-people-in-an-open-room", 375.49, 377.3, 0.07],
  ["ambient-background-people-in-an-open-room", 535.65, 537.44, 0.07],
];

// extra synth beds on top of a location: [bed, from, to, gain]
const EXTRA: BedRow[] = [
  ["clock", 4.4, 7.6, 0.4],
  ["clock", 22.95, 24.71, 0.5],
  ["clock", 184.7, 187.9, 0.3],
  ["clock", 203.2, 206.4, 0.3],
  ["clock", 238.5, 241.1, 0.25],
  ["fire", 150.95, 153.85, 0.22],
  ["clock", 571.0, 574.6, 0.25],
];

// licensed loops on visible actions: [file, from, to, gain]
const ACTS: [string, number, number, number][] = [
  ["typing-2", 0.6, 2.6, 0.06],
  ["rumble-soft", 12.4, 15.7, 0.08],
  ["rumble-soft", 18.0, 19.4, 0.1],
  ["rumble-soft", 24.7, 30.5, 0.12],
  ["rumble-soft", 63.4, 69.8, 0.08],
  ["rumble-soft", 126.4, 129.8, 0.06],
  ["rumble-soft", 140.2, 141.5, 0.08],
  ["static-2", 210.2, 212.9, 0.035],
  ["static-2", 219.3, 221.8, 0.035],
  ["rumble-soft", 242.2, 245.7, 0.2],
  ["rumble-soft", 272.5, 276.8, 0.06],
  ["typing-3", 294.4, 296.4, 0.06],
  ["rumble-soft", 319.9, 322.9, 0.08],
  ["water-stream-2", 326.6, 327.8, 0.08],
  ["underwater-bubbles-3", 331.4, 333.0, 0.05],
  ["water-flowing", 334.4, 336.2, 0.06],
  ["rumble-soft", 340.0, 341.9, 0.18],
  ["rumble-soft", 377.3, 379.0, 0.12],
  ["static-2", 382.5, 385.1, 0.05],
  ["rumble-soft", 385.3, 386.8, 0.1],
  ["rumble-soft", 388.1, 392.9, 0.1],
  ["rumble-soft", 396.5, 400.2, 0.1],
  ["rumble-soft", 409.0, 410.7, 0.22],
  ["rumble-soft", 430.4, 432.3, 0.22],
  ["rumble-soft", 441.5, 444.0, 0.15],
  ["wind-2", 459.0, 462.9, 0.12],
  ["rumble-soft", 491.6, 493.3, 0.08],
  ["rumble-soft", 519.1, 522.2, 0.1],
  ["static-2", 530.3, 533.0, 0.035],
  ["rumble-soft", 590.0, 592.2, 0.07],
];

// one-shots: [time (s), bundle file, gain]
const CUES: [number, string, number][] = [
  // cold open
  [1.2, "electronic-beeps-echo", 0.05],
  [9.0, "electronic-beeps-echo", 0.05],
  [16.2, "pop-2", 0.07],
  [20.0, "explosion-2", 0.24],
  [30.5, "thump", 0.22],
  [31.45, "crowd-cheering-large-1", 0.1],
  [31.6, "applause-small-group-1", 0.08],
  [36.6, "whoosh-spacecraft", 0.06],
  [45.5, "sparkle", 0.08],
  [51.3, "explosion-distant-1", 0.2],
  [56.6, "ding-single-1", 0.06],
  [60.4, "rewind-1", 0.1],
  // the impact and the basin
  [70.4, "explosion-1", 0.28],
  [79.3, "pop-1", 0.06],
  [82.3, "pop-3", 0.07],
  [87.8, "thump", 0.16],
  [94.0, "whoosh-spacecraft", 0.05],
  [105.8, "electronic-beeps-echo", 0.04],
  [107.6, "sparkle", 0.07],
  [109.6, "zap-warbled", 0.05],
  [114.4, "impact-hit-1", 0.18],
  [114.85, "impact-hit-2", 0.18],
  [118.4, "pop-2", 0.07],
  [125.2, "ding-single-2", 0.06],
  [132.9, "thump", 0.12],
  [137.7, "thump", 0.16],
  [142.1, "pop-1", 0.07],
  [143.6, "wood-cracking", 0.1],
  [156.0, "stamp", 0.18],
  // shadows and cold traps
  [159.1, "stamp", 0.14],
  [189.5, "sparkle", 0.06],
  [196.0, "pop-2", 0.06],
  [201.6, "water-drip-single", 0.12],
  [201.95, "water-drip-single", 0.1],
  [202.3, "water-drip-single", 0.1],
  [202.1, "sparkle", 0.07],
  [207.9, "impact-hit-3", 0.22],
  [208.0, "water-impact-echo", 0.1],
  [213.7, "pop-1", 0.07],
  [214.05, "pop-2", 0.07],
  [214.4, "pop-3", 0.07],
  [225.88, "pop-5", 0.05],
  [226.45, "pop-5", 0.05],
  [227.03, "pop-5", 0.05],
  [227.6, "pop-5", 0.05],
  [229.3, "sparkle", 0.1],
  // water found
  [237.6, "stamp", 0.2],
  [238.8, "stamp", 0.14],
  [242.3, "impact-hit-launch", 0.14],
  [249.4, "electronic-beeps-echo", 0.05],
  [253.3, "sparkle", 0.09],
  [255.0, "pop-4", 0.07],
  [255.5, "pop-4", 0.07],
  [263.5, "thump", 0.14],
  [268.6, "impact-hit-2", 0.14],
  [271.7, "explosion-3", 0.28],
  [275.8, "electronic-beeps-echo", 0.04],
  [277.1, "ding-single-1", 0.07],
  [278.4, "water-drip-single", 0.12],
  [278.6, "stamp", 0.18],
  [281.0, "pop-2", 0.07],
  [284.0, "electronic-beeps-echo", 0.04],
  [286.6, "sparkle", 0.09],
  [290.4, "thump", 0.18],
  [299.4, "sparkle", 0.1],
  [312.9, "thump", 0.16],
  // why water, light and landing
  [318.2, "pop-1", 0.07],
  [318.8, "pop-2", 0.07],
  [324.6, "ding-single-2", 0.07],
  [329.2, "electrified", 0.1],
  [337.0, "pop-3", 0.06],
  [340.0, "impact-hit-launch", 0.1],
  [342.4, "ding-single-bright", 0.07],
  [345.9, "digital-glitch-2", 0.05],
  [348.5, "sparkle", 0.07],
  [353.4, "sparkle", 0.07],
  [359.9, "stamp", 0.18],
  [370.5, "sparkle", 0.07],
  [376.4, "stamp", 0.18],
  [382.6, "static-short-burst", 0.06],
  [386.9, "explosion-2", 0.26],
  [387.3, "stamp", 0.14],
  [392.9, "thump", 0.18],
  [395.6, "crash-2", 0.22],
  [400.2, "thump", 0.16],
  [401.3, "crash-3", 0.22],
  [405.0, "stamp", 0.18],
  // the new race
  [409.2, "impact-hit-launch", 0.14],
  [412.4, "whoosh-spacecraft", 0.04],
  [417.5, "whoosh-spacecraft", 0.05],
  [422.3, "thump", 0.1],
  [429.2, "pop-2", 0.07],
  [430.6, "impact-hit-launch", 0.14],
  [437.0, "pop-1", 0.06],
  [441.6, "impact-hit-launch", 0.1],
  [444.6, "whoosh-spacecraft", 0.04],
  [448.0, "pop-2", 0.06],
  [451.2, "electronic-beeps-echo", 0.04],
  [453.6, "whoosh-fast-short-low", 0.08],
  [455.6, "thump", 0.12],
  [461.7, "stamp", 0.16],
  [468.4, "thump", 0.1],
  [475.6, "sparkle", 0.06],
  // ownership and helium-3
  [481.8, "pop-1", 0.06],
  [483.65, "thump", 0.3],
  [485.3, "paper-rattling", 0.08],
  [490.6, "thump", 0.1],
  [495.3, "stamp", 0.16],
  [504.4, "sparkle", 0.09],
  [509.3, "electrified", 0.08],
  [512.6, "stamp", 0.16],
  [515.5, "pop-3", 0.06],
  [517.1, "sparkle", 0.07],
  [521.6, "pop-2", 0.06],
  [525.5, "stamp", 0.16],
  [527.2, "sparkle", 0.07],
  [529.3, "pop-4", 0.06],
  [534.6, "ding-single-bright", 0.08],
  [536.6, "stamp", 0.16],
  [542.0, "sparkle", 0.07],
  [544.0, "paper-rattling", 0.07],
  [546.4, "pop-1", 0.05],
  [546.52, "pop-2", 0.05],
  [546.64, "pop-3", 0.05],
  [551.8, "whoosh-spacecraft", 0.04],
  [555.3, "ding-single-2", 0.07],
  [558.8, "pop-4", 0.07],
  [560.6, "sparkle", 0.07],
  // the answer
  [563.8, "whoosh-spacecraft", 0.05],
  [569.6, "thump", 0.14],
  [577.6, "sparkle", 0.07],
  [584.1, "ding-single-bright", 0.09],
  [586.4, "pop-1", 0.06],
  [586.6, "pop-2", 0.06],
  [586.8, "pop-3", 0.06],
  [587.0, "pop-4", 0.06],
  [590.3, "sparkle", 0.07],
  [594.5, "pop-2", 0.06],
  [598.6, "pop-1", 0.06],
  [601.4, "pop-2", 0.05],
  [602.4, "pop-3", 0.05],
  [603.7, "pop-1", 0.07],
];

const steps = (from: number, to: number, rate: number) => {
  const out: number[] = [];
  for (let t = from; t < to; t += 1 / rate) out.push(t);
  return out;
};
const FOOT: SfxName[] = ["footstep", "footstep2", "footstep3", "footstep4"];
// [from, to, rate, gain]: visible walking
const WALK: [number, number, number, number][] = [
  [233.0, 235.8, 1.8, 0.05],
  [494.0, 495.6, 2.2, 0.05],
];
// pen on paper / calendar pages
const SYNTH: [number, SfxName, number][] = [
  [182.6, "page_flip", 0.08],
  [182.9, "page_flip2", 0.08],
  [183.2, "page_flip", 0.08],
  [183.7, "page_flip2", 0.07],
  [183.9, "page_flip", 0.07],
  [184.1, "page_flip2", 0.07],
  [184.3, "page_flip", 0.07],
  [485.4, "scribble", 0.1],
  [485.7, "scribble", 0.1],
  [486.0, "scribble", 0.1],
  [134.2, "camera_flash", 0.04],
  [538.4, "whoosh_soft", 0.05],
];

export const MoonSound: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const fxDuck = useMemo(() => duckFromCaptions(captions, fps, FX_DUCK, 0.12), [captions, fps]);
  const ambDuck = useMemo(() => duckFromCaptions(captions, fps, AMB_DUCK, 0.2), [captions, fps]);
  const onsets = useMemo(() => captions.map((c) => c.startMs / 1000), [captions]);
  const nearOnset = (t: number, before = 0.08, after = 0.12) => onsets.some((o) => t > o - before && t < o + after);
  return (
    <>
      {[...BEDS, ...EXTRA].map(([name, from, to, g], i) => (
        <Ambience key={`bed${i}`} name={name} from={from} to={to} volume={g * AMB} gainAt={ambDuck} fadeIn={0.25} fadeOut={0.3} />
      ))}
      {LBEDS.map(([f, from, to, g], i) => (
        <Bed key={`lb${i}`} src={E(f)} from={from} to={to} volume={g * AMB} gainAt={ambDuck} name={`amb:${f}`} />
      ))}
      {ACTS.map(([f, from, to, g], i) => (
        <Bed key={`act${i}`} src={E(f)} from={from} to={to} volume={g * FX} gainAt={fxDuck} fadeIn={0.1} fadeOut={0.25} name={`act:${f}`} />
      ))}
      {WALK.flatMap(([a, b, r, g], k) =>
        steps(a, b, r)
          .filter((t) => !nearOnset(t))
          .map((t, i) => <Sfx key={`w${k}-${i}`} name={FOOT[i % 4]} at={t} volume={g * FX} duck={fxDuck} />),
      )}
      {SYNTH.map(([t, n, g], i) => (
        <Sfx key={`s${i}`} name={n} at={t} volume={g * FX} duck={fxDuck} />
      ))}
      {CUES.filter(([, , g]) => g > 0).map(([t, f, g], i) => (
        <SoundAt key={`${i}-${f}`} src={E(f)} at={t} volume={g * FX} duck={fxDuck} name={f} />
      ))}
    </>
  );
};
