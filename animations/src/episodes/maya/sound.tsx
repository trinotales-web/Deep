import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Bed, Sfx, SoundAt, licensedSrc, duckFromCaptions, type AmbName, type SfxName } from "../../kit/audio";
import { CUTS1 } from "./timeline1";
import { END1 } from "./script";

// Sound design for the Maya story. Voice-first: no music, no musical stingers,
// no birdsong. Licensed one-shots (Essential Sound Effects Bundle) on the key
// words, synthesized beds per location, whooshes on transitions, foley for
// paddling, footsteps and digging. Everything ducks under the narration; cue
// times come from the aligned captions.

const E = (name: string) => licensedSrc("essential", name);

const AMB = 0.55;
const FX = 0.9;
const FX_DUCK = 0.55; // -5 dB under speech
const AMB_DUCK = 0.5; // -6 dB under speech

// [time (s), bundle file, gain]
const CUES1: [number, string, number][] = [
  [0.14, "water-ocean-wave-2", 0.18],
  [2.57, "water-drip-single", 0.3],
  [5.53, "swish-1", 0.2],
  [6.65, "impact-hit-1", 0.3],
  [8.97, "water-drip-single", 0.2],
  [10.42, "whoosh-low-distant", 0.16],
  [13.86, "creak-short", 0.35],
  [14.26, "horn-boat", 0.14],
  [16.3, "gun-loading", 0.22],
  [18.46, "explosion-distant-1", 0.35],
  [19.4, "drum-hit-single", 0.18],
  [22.98, "stamp", 0.18],
  [23.36, "stamp", 0.16],
  [23.88, "stamp", 0.16],
  [26.37, "impact-hit-2", 0.4],
  [26.37, "rumble-soft", 0.3],
  [28.66, "pop-2", 0.18],
  [30.63, "impact-hit-1", 0.25],
  [33.86, "explosion-distant-2", 0.25],
  [36.13, "stamp", 0.32],
  [39.24, "heartbeat-single-lub-dub", 0.25],
  [42.15, "hit-single", 0.32],
  [44.48, "laser", 0.12],
  [48.13, "swish-slicing", 0.22],
  [48.99, "animals-donkey", 0.06],
  [50.12, "sparkle", 0.22],
  [51.77, "sizzle", 0.18],
  [55.96, "rewind-1", 0.22],
  [59.81, "whoosh-powerful", 0.25],
  [62.84, "whoosh-reverse-struggling", 0.2],
  [64.87, "explosion-6", 0.55],
  [64.92, "rumble-soft", 0.45],
  [67.12, "growl", 0.18],
  [67.95, "explosion-launch-hit-sizzle", 0.35],
  [69.4, "impact-hit-3", 0.3],
  [76.28, "water-drip-single", 0.2],
  [80.25, "pop-1", 0.16],
  [83.2, "water-drip-single", 0.28],
  [88.14, "sparkle", 0.16],
  [89.68, "swish-2", 0.2],
  [90.84, "pop-1", 0.15],
  [91.64, "pop-2", 0.15],
  [92.5, "pop-3", 0.15],
  [93.8, "pop-4", 0.15],
  [94.8, "pop-5", 0.15],
  [100.36, "grating-1", 0.08],
  [103.53, "sparkle", 0.22],
  [106.36, "pop-2", 0.16],
  [108.42, "page-turning", 0.28],
  [110.53, "pop-1", 0.15],
  [113.7, "slap", 0.18],
  [115.41, "deflating", 0.25],
  [118.07, "hit-dull", 0.22],
  [120.18, "heartbeat-single-lub-dub", 0.2],
  [123.41, "rumble-soft", 0.28],
  [124.67, "water-impact-echo", 0.38],
  [124.97, "crash-1", 0.15],
  [127.04, "laughter-silly-critter", 0.12],
  [130.35, "sparkle", 0.22],
  [132.12, "alert-positive-correct", 0.12],
  [135.08, "pop-3", 0.15],
  [140.69, "pounding-three-hits", 0.22],
  [144.32, "electronic-beeps-echo", 0.13],
  [147.38, "impact-hit-1", 0.28],
  [150.64, "swish-1", 0.18],
  [152.98, "pop-1", 0.15],
  [157.8, "thump", 0.22],
  [161.34, "rumble-soft", 0.28],
  [169.82, "impact-hit-2", 0.3],
  [174.38, "hit-dull", 0.25],
  [179.14, "impact-hit-1", 0.3],
  [180.16, "pop-2", 0.2],
  [183.73, "wood-cracking", 0.35],
  [186.22, "sizzle", 0.18],
  [195.06, "rumble-soft", 0.3],
  [197.61, "shimmer-bright", 0.16],
  [201.53, "pop-1", 0.15],
  [202.4, "pop-2", 0.15],
  [203.32, "pop-3", 0.15],
  [204.26, "pop-4", 0.15],
  [205.19, "pop-5", 0.15],
  [208.71, "electronic-beeps-echo", 0.12],
  [211.12, "impact-hit-1", 0.25],
  [216.9, "impact-hit-3", 0.25],
  [221.57, "pop-2", 0.15],
  [223.7, "stamp", 0.35],
  [224.17, "slice-impact-woosh", 0.2],
  [225.14, "slice-impact-woosh", 0.2],
  [227.01, "pop-1", 0.15],
  [230.11, "pop-2", 0.14],
  [231.07, "chimes-hi-lo-ding-dong", 0.08],
  [232.94, "swish-slicing", 0.2],
  [235.44, "drum-hit-single", 0.25],
  [238.05, "stamp", 0.28],
  [241.68, "hit-dull", 0.2],
  [244.23, "shimmer-bright", 0.14],
  [249.16, "heartbeat-single-lub-dub", 0.3],
  [250.77, "impact-hit-2", 0.3],
  [252.99, "slice-impact-woosh", 0.2],
  [256.42, "hit-dull", 0.2],
  [259.81, "gasp-female-1", 0.12],
  [262.39, "sizzle", 0.15],
  [268.29, "pop-3", 0.18],
  [270.72, "page-turning-2", 0.22],
  [275.02, "pop-1", 0.15],
  [276.89, "pop-2", 0.15],
  [278.48, "hit-dull", 0.18],
  [279.32, "pop-3", 0.15],
  [280.73, "page-turning", 0.2],
  [282.87, "pop-1", 0.15],
  [286.33, "pop-2", 0.15],
  [287.81, "pop-1", 0.18],
  [289.19, "pop-2", 0.18],
  [291.6, "pop-4", 0.2],
  [294.71, "sparkle", 0.2],
  [296.77, "ratcheting", 0.18],
  [299.66, "pop-1", 0.15],
  [302.61, "pop-2", 0.15],
  [306.23, "ratcheting", 0.2],
  [309.94, "ratcheting", 0.15],
  [316.43, "impact-hit-2", 0.35],
  [318.36, "scream-group", 0.1],
  [320.39, "explosion-distant-3", 0.25],
  [322.32, "record-scratch-short", 0.25],
  [325.75, "ratcheting", 0.25],
  [327.37, "shimmer-bright", 0.14],
  [331.42, "pop-2", 0.15],
  [334.03, "thump", 0.2],
  [338.13, "thump", 0.25],
  [339.85, "wood-cracking-2", 0.35],
  [341.33, "buzzer-1", 0.1],
  [342.79, "hit-dull", 0.4],
  [346.64, "whoosh-fast-short", 0.2],
  [348.88, "page-turning", 0.22],
  [352.2, "thump", 0.25],
  [354.21, "rumble-soft", 0.3],
  [356.76, "monster-exhale-short", 0.2],
  [359.71, "whoosh-fast-short-muffled", 0.2],
  [360.75, "slice-impact-woosh", 0.3],
  [364.06, "hit-fade-out", 0.3],
  [367.29, "rumble-soft", 0.22],
  [371.03, "shimmer-bright", 0.2],
  [373.3, "swish-slicing", 0.2],
  [375.03, "pop-3", 0.15],
  [377.79, "shimmer-bright", 0.2],
  [378.46, "sparkle", 0.2],
  [383.26, "heartbeat-single-lub-dub", 0.28],
  [384.76, "hit-dull", 0.2],
  [388.15, "stamp", 0.3],
  [393.46, "hit-fade-out", 0.35],
  [396.05, "stamp", 0.25],
  [400.89, "impact-hit-3", 0.32],
  [402.04, "drum-hit-single", 0.2],
  [405.86, "rattle", 0.14],
  [411.13, "pop-1", 0.15],
  [419.98, "shimmer-harsh", 0.2],
  [423.77, "crash-2", 0.25],
  [427.62, "slice-impact-woosh", 0.3],
  [430.93, "wind-2", 0.2],
  [435.56, "drum-hit-single", 0.3],
  [440.23, "footsteps-fast", 0.18],
  [444.65, "swish-slicing", 0.25],
  [447.59, "thump", 0.3],
  [453.67, "growl", 0.18],
  [457.24, "shimmer-bright", 0.18],
  [460.51, "pop-2", 0.15],
  [462.61, "pop-3", 0.15],
  [463.71, "heartbeat-single-lub-dub", 0.25],
  [465.99, "rumble-soft", 0.25],
  [468.97, "crash-3", 0.22],
  [473.44, "whoosh-low-distant", 0.2],
  [478.07, "stamp", 0.2],
  [479.35, "grating-2", 0.22],
  [484.42, "grating-1", 0.3],
  [485.75, "shimmer-bright", 0.22],
  [487.76, "sparkle", 0.22],
  [491.88, "hit-dull", 0.22],
  [499.69, "whoosh-spacecraft", 0.2],
  [502.58, "pop-2", 0.15],
  [506.47, "rumble-soft", 0.25],
  [508.86, "sparkle", 0.2],
  [510.47, "record-scratch-short", 0.2],
  [512.03, "shimmer-bright", 0.2],
  [516.21, "wood-cracking", 0.3],
  [519.88, "hit-fade-out", 0.25],
  [523.7, "hit-dull", 0.25],
  [525.71, "wind-1", 0.18],
  [532.12, "rumble-soft", 0.3],
];

type BedRow = [AmbName, number, number, number];

// Location beds (synthesized library): [bed, from, to, gain]
const BEDS1: BedRow[] = [
  ["waves", 0, 27.15, 0.32],
  ["jungle_night", 0, 31.4, 0.22],
  ["battle_distant", 31.4, 36.55, 0.3],
  ["room_tone", 36.55, 60.6, 0.4],
  ["room_tone", 60.6, 66.3, 0.35],
  ["battle_distant", 66.3, 68.4, 0.45],
  ["wind", 68.4, 95.95, 0.3],
  ["wind", 95.95, 107.3, 0.32],
  ["wind", 107.3, 123.6, 0.22],
  ["rain", 123.6, 126.5, 0.55],
  ["jungle_night", 126.5, 128.1, 0.3],
  ["wind", 128.1, 141.3, 0.25],
  ["wind", 141.3, 188.1, 0.28],
  ["rain", 188.1, 191.1, 0.45],
  ["wind", 191.1, 195.8, 0.3],
  ["room_tone", 195.8, 248.4, 0.35],
  ["rain", 247.3, 248.4, 0.45],
  ["fire", 248.4, 265.0, 0.3],
  ["room_tone", 248.4, 332.1, 0.38],
  ["clock", 295.75, 307.1, 0.25],
  ["wind", 332.1, 349.6, 0.25],
  ["room_tone", 349.6, 381.0, 0.4],
  ["wind", 381.0, 394.2, 0.32],
  ["room_tone", 394.2, 411.9, 0.35],
  ["battle_distant", 411.9, 418.6, 0.4],
  ["room_tone", 418.6, 427.8, 0.35],
  ["jungle_night", 427.8, 435.7, 0.35],
  ["battle_distant", 435.7, 448.45, 0.25],
  ["wind", 448.45, 463.35, 0.28],
  ["room_tone", 463.35, 512.75, 0.4],
  ["wind", 512.75, 527.35, 0.3],
  ["jungle_night", 527.35, END1, 0.3],
];

// licensed beds: [file, from, to, gain]
const LBEDS1: [string, number, number, number][] = [
  ["footsteps-water", 0.4, 4.6, 0.12],
  ["water-stream", 81.0, 88.7, 0.25],
  ["ambient-crowd-murmur-1", 164.5, 166.5, 0.22],
  ["ambient-crowd-murmur-1", 195.8, 200.9, 0.2],
  ["ambient-crowd-murmur-2", 214.5, 220.1, 0.22],
  ["crowd-cheering-large-1", 332.1, 334.8, 0.12],
];

const steps = (from: number, to: number, rate: number) => {
  const out: number[] = [];
  for (let t = from; t < to; t += 1 / rate) out.push(t);
  return out;
};
const FOOT: SfxName[] = ["footstep", "footstep2", "footstep3", "footstep4"];
// [from, to, rate]: walking / marching footsteps, digging thuds
const WALK1: [number, number, number][] = [[137.95, 141.3, 2.0], [153.75, 158.95, 1.6], [364.85, 369.5, 1.8], [435.7, 441.85, 2.4], [445.3, 448.45, 1.8]];
const DIG1: [number, number, number][] = [[153.9, 158.8, 1.2], [181.1, 183.7, 1.4]];
// paddle strokes in the canoe shots
const PADDLE1: [number, number, number][] = [[0.3, 6.8, 0.55]];

const WHOOSHES = ["whoosh-1", "whoosh-2", "whoosh-3", "whoosh-5", "swoosh-fast-1"];
const WHOOSH_GAIN: Record<string, number> = { "whoosh-1": 0.7, "whoosh-2": 0.6, "whoosh-3": 0.6, "whoosh-5": 0.5, "swoosh-fast-1": 0.9 };

export const MayaSound: React.FC<{ captions: Caption[]; part: 1 | 2 }> = ({ captions, part }) => {
  const { fps } = useVideoConfig();
  const fxDuck = useMemo(() => duckFromCaptions(captions, fps, FX_DUCK, 0.12), [captions, fps]);
  const ambDuck = useMemo(() => duckFromCaptions(captions, fps, AMB_DUCK, 0.2), [captions, fps]);
  const onsets = useMemo(() => captions.map((c) => c.startMs / 1000), [captions]);
  const nearOnset = (t: number, before = 0.08, after = 0.12) => onsets.some((o) => t > o - before && t < o + after);
  const intoSpeech = (t: number) => {
    const next = onsets.find((o) => o >= t);
    const gap = next === undefined ? 9 : next - t;
    return gap < 0.25 ? 0.3 : gap < 0.5 ? 0.5 : 1;
  };
  if (part !== 1) return null;
  const cuts = CUTS1;
  const cues = CUES1;
  const slides = cuts.filter((c) => c.into === "slide-left");
  const hardCuts = cuts.filter((c) => c.into === "cut" && c.at > 0 && !cues.some(([t]) => Math.abs(t - c.at) < 0.35));
  return (
    <>
      {BEDS1.map(([name, from, to, g], i) => (
        <Ambience key={`bed${i}`} name={name} from={from} to={to} volume={g * AMB} gainAt={ambDuck} fadeIn={0.3} fadeOut={0.4} />
      ))}
      {LBEDS1.map(([f, from, to, g], i) => (
        <Bed key={`lb${i}`} src={E(f)} from={from} to={to} volume={g * AMB} gainAt={ambDuck} name={`amb:${f}`} />
      ))}
      {WALK1.flatMap(([a, b, r], k) =>
        steps(a, b, r)
          .filter((t) => !nearOnset(t))
          .map((t, i) => <Sfx key={`w${k}-${i}`} name={FOOT[i % 4]} at={t} volume={0.1 * FX} duck={fxDuck} />),
      )}
      {DIG1.flatMap(([a, b, r], k) =>
        steps(a, b, r)
          .filter((t) => !nearOnset(t))
          .map((t, i) => <Sfx key={`d${k}-${i}`} name="thud" at={t} volume={0.12 * FX} duck={fxDuck} />),
      )}
      {PADDLE1.flatMap(([a, b, r], k) =>
        steps(a, b, r).map((t, i) => <SoundAt key={`p${k}-${i}`} src={E("water-drip-single")} at={t} volume={0.12 * FX} duck={fxDuck} name="paddle" />),
      )}
      {slides.map((c, i) => {
        const f = WHOOSHES[i % WHOOSHES.length];
        return <SoundAt key={`wh${c.id}`} src={E(f)} at={c.at - 0.18} volume={WHOOSH_GAIN[f] * FX * intoSpeech(c.at - 0.18)} duck={fxDuck} name={`whoosh:${c.id}`} />;
      })}
      {hardCuts.map((c) => (
        <Sfx key={`c${c.id}`} name="whoosh_soft" at={c.at - 0.08} volume={0.2 * FX * intoSpeech(c.at - 0.08)} duck={fxDuck} />
      ))}
      {cues.map(([t, f, g], i) => (
        <SoundAt key={`${i}-${f}`} src={E(f)} at={t} volume={g * FX} duck={fxDuck} name={f} />
      ))}
    </>
  );
};
