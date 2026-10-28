import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Bed, Sfx, SoundAt, licensedSrc, duckFromCaptions, type SfxName } from "../../kit/audio";
import { CUTS } from "./timeline";
import { END } from "./script";

// Sound design for "Why Fire Arrows Almost Never Worked".
// Voice-first: no music. One-shots come from the licensed Essential Sound
// Effects Bundle (node scripts/import-sfx.mjs <bundle.zip>), beds from the
// synthesized library (npm run audio). Everything ducks under the narration.

const E = (name: string) => licensedSrc("essential", name);

const AMB = 0.35;
const FX = 0.75;
const FX_DUCK = 0.55; // -5 dB under speech
const AMB_DUCK = 0.5; // -6 dB under speech

// [time (s), bundle file, gain]
const CUES: [number, string, number][] = [
  // ── cold open: night on the wall
  [0.2, "wind-1", 0.45],
  [2.85, "drums-1", 0.2],
  [6.9, "sizzle", 0.25],
  [8.36, "hit-single", 0.45],
  [10.8, "paper-rattling", 0.45],
  [12.9, "sizzle", 0.45],
  [12.95, "whoosh-fast-short", 0.25],
  [13.9, "creak-short", 0.4],
  [15.3, "whoosh-sizzling", 0.45],
  [18.18, "twang-2", 0.8],
  [18.25, "whoosh-sizzling", 0.5],
  [19.4, "fly-by-low", 0.3],
  [23.2, "air-blowing", 0.45],
  [23.77, "hit-fade-out", 0.35],
  [26.06, "whoosh-fast-short-low", 0.3],
  [27.9, "thump", 0.45],
  // ── movies vs history
  [30.9, "whoosh-sizzling", 0.3],
  [31.5, "whoosh-sizzling", 0.25],
  [33.42, "explosion-distant-1", 0.22],
  [34.4, "scream-group", 0.18],
  [38.75, "pop-2", 0.25],
  [39.7, "pop-3", 0.35],
  [41.3, "twang-1", 0.5],
  [41.35, "whoosh-sizzling", 0.45],
  [42.2, "whiz-hit", 0.55],
  [42.3, "scream-male-short", 0.25],
  // ── coming up
  [48.9, "twang-3", 0.45],
  [48.95, "whoosh-fast-short-muffled", 0.35],
  [51.6, "water-impact-echo", 0.4],
  [51.95, "explosion-launch-hit-sizzle", 0.3],
  [53.93, "stamp", 0.55],
  [55.6, "whoosh-sizzling", 0.45],
  [57.0, "rumble-soft", 0.6],
  [57.05, "sonic-launch", 0.35],
  // ── problem 1: the fire hates flying
  [59.3, "swoosh-sharp-hit", 0.4],
  [61.3, "hit-dull", 0.35],
  [63.3, "fly-by-low", 0.45],
  [64.2, "whoosh-fast-sharp-short", 0.4],
  [67.4, "wind-2", 0.5],
  [67.6, "air-blowing", 0.4],
  [70.0, "pop-1", 0.3],
  [71.7, "air-blowing", 0.55],
  [72.46, "hit-fade-out", 0.35],
  [73.4, "hit-single", 0.4],
  [74.8, "page-turning", 0.5],
  [79.85, "pop-2", 0.25],
  [81.8, "pop-4", 0.25],
  [84.8, "pop-1", 0.25],
  [85.84, "pop-2", 0.25],
  [86.68, "pop-3", 0.3],
  [87.2, "whoosh-sizzling", 0.4],
  [88.85, "hit-single", 0.35],
  [91.0, "twang-3", 0.4],
  [91.1, "whoosh-low-distant", 0.35],
  [93.15, "twang-2", 0.7],
  [93.2, "whoosh-fast-short", 0.45],
  [94.4, "air-blowing", 0.45],
  [98.2, "whoosh-fast-sharp-short", 0.35],
  [98.6, "whoosh-fast-sharp-short", 0.3],
  [100.5, "whoosh-low-distant", 0.35],
  [105.3, "whiz-hit", 0.5],
  [105.45, "gasp-male-1", 0.5],
  [108.4, "fly-by-wobbly", 0.5],
  // ── problem 2: lighting the thing
  [111.6, "swoosh-sharp-hit", 0.4],
  [120.95, "pop-1", 0.25],
  [121.76, "pop-2", 0.25],
  [123.15, "pop-3", 0.25],
  [124.6, "wind-1", 0.65],
  [126.4, "hit-dull", 0.3],
  [129.19, "twang-1", 0.3],
  [129.81, "twang-3", 0.3],
  [130.44, "twang-1", 0.3],
  [131.06, "twang-3", 0.3],
  [133.1, "sizzle", 0.3],
  [134.55, "whoosh-sizzling", 0.35],
  [135.4, "creak-short", 0.4],
  [136.5, "sizzle", 0.3],
  [139.4, "pop-1", 0.25],
  [140.4, "pop-3", 0.25],
  [143.4, "sizzle", 0.45],
  // ── problem 3: what are you shooting at?
  [144.7, "swoosh-sharp-hit", 0.4],
  [149.1, "whoosh-sizzling", 0.3],
  [149.8, "scream-male-short", 0.25],
  [151.6, "whoosh-fast-short", 0.35],
  [152.25, "hit-dull", 0.45],
  [154.7, "whoosh-fast-short-low", 0.25],
  [155.6, "sizzle", 0.3],
  [157.9, "deflating", 0.3],
  [159.4, "whoosh-fast-sharp-short", 0.4],
  [159.9, "slice-impact-woosh", 0.45],
  [162.1, "whoosh-fast-short-muffled", 0.35],
  [167.9, "knocking-on-door", 0.4],
  [171.8, "snap", 0.4],
  [172.9, "sizzle", 0.25],
  [174.6, "whoosh-sizzling", 0.3],
  [177.0, "whoosh-sizzling", 0.35],
  [177.1, "rumble-soft", 0.4],
  [180.6, "thump", 0.45],
  [182.2, "sizzle", 0.3],
  [185.5, "click-single", 0.4],
  [188.0, "whoosh-sizzling", 0.35],
  [189.55, "whoosh-sizzling", 0.3],
  [190.75, "whoosh-sizzling", 0.3],
  [191.55, "whoosh-sizzling", 0.3],
  [192.45, "whoosh-sizzling", 0.3],
  [194.0, "twang-1", 0.3],
  [195.0, "twang-2", 0.3],
  [197.8, "explosion-distant-2", 0.25],
  // ── Athens
  [200.7, "drums-1", 0.25],
  [203.3, "wind-1", 0.6],
  [207.26, "pop-1", 0.25],
  [210.2, "pop-3", 0.35],
  [211.0, "shimmer-creepy", 0.4],
  [215.5, "wood-cracking-2", 0.35],
  [215.6, "shimmer-bright", 0.5],
  [217.6, "water-ocean-wave", 0.6],
  [220.28, "stamp", 0.55],
  [221.2, "pounding-three-hits", 0.7],
  [222.4, "pounding-three-hits", 0.7],
  [223.2, "creak-short", 0.5],
  [224.4, "cricket-chirp-single", 0.5],
  [225.3, "drums-2", 0.25],
  [227.6, "page-turning-2", 0.6],
  [229.6, "paper-rattling", 0.9],
  [230.9, "whoosh-fast-short", 0.3],
  [231.4, "sizzle", 0.5],
  [232.35, "twang-1", 0.5],
  [232.45, "twang-3", 0.45],
  [232.55, "twang-2", 0.4],
  [232.5, "whoosh-sizzling", 0.4],
  [232.8, "whoosh-sizzling", 0.35],
  [233.25, "whiz-hit", 0.5],
  [233.5, "whiz-hit", 0.45],
  [234.54, "pop-1", 0.25],
  [235.46, "pop-2", 0.25],
  [236.6, "whoosh-fast-short-muffled", 0.3],
  [237.0, "click-single", 0.45],
  [238.0, "impact-hit-2", 0.55],
  [238.0, "wood-cracking", 0.35],
  [239.4, "grunt", 0.4],
  [240.6, "hit-fade-out", 0.6],
  [241.8, "explosion-distant-1", 0.18],
  [242.5, "rumble-soft", 0.5],
  [245.9, "water-ocean-wave", 0.8],
  [247.6, "hit-single", 0.45],
  [248.4, "drums-1", 0.25],
  [250.6, "crash-2", 0.55],
  [250.62, "explosion-1", 0.3],
  [250.62, "wood-cracking", 0.55],
  [250.7, "water-impact-echo", 0.55],
  [251.4, "underwater-bubbles", 0.3],
  [253.2, "shimmer-bright", 0.9],
  [253.95, "ding-single-bright", 0.3],
  [255.62, "hit-dull", 0.5],
  [255.95, "pop-2", 0.3],
  // ── defending the wall
  [256.95, "whoosh-rebound", 0.45],
  [259.9, "whoosh-sizzling", 0.4],
  [260.4, "whiz-hit", 0.5],
  [260.6, "whiz-hit", 0.45],
  [260.8, "whiz-hit", 0.4],
  [261.1, "gasp-male-2", 0.6],
  [262.3, "page-turning", 0.5],
  [265.85, "paper-rattling", 0.6],
  [268.5, "pop-1", 0.25],
  [272.45, "whoosh-sizzling", 0.35],
  [272.95, "thump", 0.45],
  [273.0, "sizzle", 0.4],
  [274.8, "water-drip-single", 0.5],
  [275.6, "water-drip-single", 0.45],
  [276.8, "floor-creak-low", 0.4],
  [278.5, "floor-creak-low", 0.35],
  [279.5, "whiz-hit", 0.4],
  [279.6, "sizzle", 0.3],
  [280.2, "whiz-hit", 0.4],
  [280.9, "whiz-hit", 0.35],
  [282.1, "rumble-soft", 0.5],
  [282.2, "grating-1", 0.3],
  [288.0, "whoosh-fast-short-low", 0.3],
  [288.35, "whoosh-fast-short-low", 0.3],
  [288.7, "whoosh-fast-short-low", 0.3],
  [288.8, "whoosh-sizzling", 0.3],
  [291.9, "water-flowing", 0.5],
  [292.5, "sizzle", 0.45],
  [294.6, "hit-dull", 0.3],
  [295.85, "rewind-1", 0.3],
  [297.2, "shimmer-creepy", 0.35],
  [300.5, "whoosh-fast-short", 0.35],
  [301.1, "water-impact-echo", 0.45],
  [301.2, "explosion-launch-hit-sizzle", 0.35],
  [302.02, "impact-hit-1", 0.4],
  [303.9, "grating-2", 0.35],
  [304.3, "rattle", 0.3],
  [304.66, "pop-2", 0.25],
  [304.8, "sizzle", 0.4],
  [305.0, "exhale", 0.3],
  [308.75, "pop-3", 0.3],
  [310.0, "whoosh-powerful", 0.4],
  [310.4, "impact-hit-launch", 0.5],
  // ── Saguntum: the falarica
  [311.2, "wind-1", 0.5],
  [313.9, "drums-2", 0.25],
  [314.2, "grunt", 0.3],
  [316.95, "swoosh-sharp-hit", 0.4],
  [318.15, "hit-dull", 0.5],
  [319.21, "pop-1", 0.25],
  [320.14, "pop-2", 0.25],
  [320.9, "tape-packing-tape", 0.3],
  [322.1, "paper-rattling", 0.6],
  [324.0, "whoosh-sizzling", 0.4],
  [324.9, "grunt", 0.35],
  [325.15, "whoosh-powerful", 0.5],
  [326.15, "whoosh-sizzling", 0.4],
  [326.75, "impact-hit-3", 0.6],
  [326.78, "hit-double", 0.4],
  [327.7, "whoosh-sizzling", 0.35],
  [330.3, "whoosh-fast-short-low", 0.4],
  [332.6, "whoosh-sizzling", 0.35],
  [332.7, "gasp-male-3", 0.5],
  [334.2, "page-turning", 0.5],
  [337.11, "impact-hit-4", 0.5],
  [337.12, "stamp", 0.5],
  [338.1, "pop-1", 0.25],
  [339.1, "whoosh-sizzling", 0.3],
  [340.02, "pop-2", 0.3],
  [340.4, "pop-4", 0.3],
  [342.95, "applause-small-group-1", 0.25],
  // ── the Viking funeral
  [347.3, "horn-steady", 0.2],
  [348.9, "water-ocean-wave-2", 0.5],
  [352.2, "creak-short", 0.4],
  [353.05, "twang-2", 0.6],
  [353.1, "whoosh-sizzling", 0.4],
  [353.8, "whoosh-sizzling", 0.3],
  [354.3, "explosion-launch-hit-sizzle", 0.4],
  [354.35, "whoosh-sizzling", 0.3],
  [357.4, "dj-record-scratch", 0.45],
  [357.93, "stamp", 0.5],
  [360.0, "page-turning-2", 0.4],
  [363.97, "pop-1", 0.25],
  [371.3, "hit-dull", 0.45],
  [372.5, "grunt", 0.4],
  [372.6, "floor-creak-low", 0.4],
  [373.3, "grunt", 0.35],
  [373.6, "creak-short", 0.35],
  [375.0, "hit-dull", 0.4],
  [379.0, "censor-bleep", 0.25],
  [379.55, "rewind-2", 0.35],
  [380.7, "whoosh-sizzling", 0.3],
  [383.45, "whoosh-sizzling", 0.45],
  [383.5, "rumble-soft", 0.4],
  // ── gunpowder: China and Korea
  [385.6, "deflating", 0.35],
  [387.1, "stamp", 0.45],
  [388.35, "sparkle", 0.4],
  [389.4, "shimmer-bright", 0.35],
  [394.0, "tape-packing-tape", 0.35],
  [393.45, "pop-1", 0.25],
  [398.7, "sparkle", 0.4],
  [398.78, "impact-hit-1", 0.35],
  [401.5, "twang-1", 0.4],
  [401.65, "whoosh-sizzling", 0.35],
  [402.2, "whoosh-sizzling", 0.3],
  [404.6, "sizzle", 0.5],
  [405.4, "pop-3", 0.3],
  [407.2, "sizzle", 0.45],
  [410.1, "sonic-launch", 0.45],
  [410.18, "impact-hit-launch", 0.4],
  [412.0, "hit-dull", 0.45],
  [413.0, "whoosh-spacecraft", 0.45],
  [414.9, "rewind-3", 0.3],
  [417.8, "air-blowing", 0.45],
  [418.75, "hit-fade-out", 0.3],
  [419.35, "sonic-launch", 0.35],
  [421.6, "drums-2", 0.22],
  [421.8, "floor-creak-low", 0.35],
  [424.25, "swoosh-sharp-hit", 0.45],
  [424.3, "impact-hit-2", 0.4],
  [426.2, "sonic-launch", 0.3],
  [426.25, "explosion-launch-hit-sizzle", 0.3],
  [426.5, "whoosh-sizzling", 0.3],
  [426.8, "whoosh-sizzling", 0.3],
  [427.1, "whoosh-sizzling", 0.3],
  [427.4, "whoosh-sizzling", 0.3],
  [429.14, "pop-1", 0.25],
  [431.58, "swoosh-sharp-hit", 0.35],
  [432.46, "pop-2", 0.25],
  [433.0, "drums-1", 0.25],
  [434.6, "impact-hit-4", 0.35],
  [436.7, "sonic-launch", 0.35],
  [436.8, "whoosh-sizzling", 0.3],
  [437.2, "whoosh-sizzling", 0.3],
  [437.65, "explosion-2", 0.3],
  [437.8, "scream-group", 0.2],
  [437.9, "explosion-distant-2", 0.3],
  [439.9, "crowd-cheering-large-2", 0.3],
  [440.22, "stamp", 0.45],
  // ── huojian
  [441.1, "sparkle", 0.35],
  [443.6, "pop-3", 0.3],
  [444.7, "impact-hit-2", 0.45],
  [444.72, "shimmer-bright", 0.5],
  [445.8, "pop-1", 0.3],
  [446.2, "pop-2", 0.3],
  [448.4, "pop-3", 0.3],
  [450.3, "impact-hit-1", 0.4],
  [451.2, "rumble-soft", 0.9],
  [451.6, "sonic-launch", 0.5],
  [451.7, "explosion-launch-hit-sizzle", 0.4],
  [452.6, "whoosh-spacecraft", 0.4],
  [453.6, "whoosh-spacecraft-2", 0.3],
  [455.25, "pop-1", 0.25],
  // ── recap
  [456.6, "creak-short", 0.3],
  [458.3, "pop-3", 0.3],
  [459.7, "whoosh-sizzling", 0.4],
  [460.6, "air-blowing", 0.35],
  [461.0, "hit-fade-out", 0.25],
  [462.2, "sizzle", 0.3],
  [462.66, "pop-1", 0.3],
  [463.77, "hit-single", 0.35],
  [465.3, "whoosh-fast-short-muffled", 0.2],
  [466.0, "sizzle", 0.3],
  [467.35, "thump", 0.45],
  [467.9, "sizzle", 0.3],
  [469.8, "twang-1", 0.35],
  [470.4, "whoosh-sizzling", 0.35],
  [471.4, "whoosh-sizzling", 0.45],
  [472.73, "impact-hit-2", 0.5],
  [472.75, "stamp", 0.45],
  [475.36, "stamp", 0.45],
  [476.8, "whoosh-sizzling", 0.3],
  [478.0, "whoosh-sizzling", 0.3],
  [480.4, "creak-short", 0.35],
  [481.5, "click-single", 0.4],
  [481.86, "impact-hit-3", 0.45],
  // ── outro
  [484.44, "impact-hit-1", 0.35],
  [485.9, "whoosh-fast-short-low", 0.3],
  [486.3, "sonic-launch", 0.45],
  [486.9, "whoosh-spacecraft", 0.4],
  [488.5, "drums-1", 0.22],
  [489.0, "swish-1", 0.35],
  [490.8, "stamp", 0.45],
  [490.82, "impact-hit-4", 0.35],
  [492.4, "whoosh-sizzling", 0.3],
  [492.42, "pop-2", 0.3],
  [493.88, "hit-single", 0.3],
  [494.2, "pop-1", 0.25],
  [494.32, "pop-3", 0.25],
  [494.44, "pop-4", 0.25],
  [496.2, "pop-5", 0.4],
];

// a whoosh on every slide transition (alternating files), slightly ahead of the cut
const WHOOSHES = ["whoosh-1", "whoosh-2", "whoosh-3", "whoosh-5", "swoosh-fast-1"];
const WHOOSH_GAIN: Record<string, number> = { "whoosh-1": 0.7, "whoosh-2": 0.6, "whoosh-3": 0.6, "whoosh-5": 0.5, "swoosh-fast-1": 0.9 };

const steps = (from: number, to: number, rate: number) => {
  const out: number[] = [];
  for (let t = from; t < to; t += 1 / rate) out.push(t);
  return out;
};
const FOOT: SfxName[] = ["footstep", "footstep2", "footstep3", "footstep4"];

// Location beds: [synth bed, from, to, gain]
const BEDS: [Parameters<typeof Ambience>[0]["name"], number, number, number][] = [
  ["wind", 0, 28.9, 0.4],
  ["battle_distant", 2.75, 8.2, 0.3],
  ["fire", 5.1, 17.65, 0.35],
  ["fire", 17.65, 18.75, 0.5],
  ["room_tone", 28.85, 35.3, 0.5],
  ["battle_distant", 28.85, 35.3, 0.3],
  ["wind", 35.3, 52.6, 0.35],
  ["waves", 52.6, 54.7, 0.5],
  ["wind", 54.7, 62.55, 0.35],
  ["wind", 69.85, 74.65, 0.35],
  ["room_tone", 74.65, 89.7, 0.55],
  ["wind", 89.7, 113.95, 0.35],
  ["fire", 113.95, 124.65, 0.3],
  ["wind", 124.65, 127.3, 0.5],
  ["clock", 127.3, 131.55, 0.45],
  ["fire", 131.55, 138.65, 0.3],
  ["wind", 138.65, 142.6, 0.35],
  ["rain", 142.6, 144.6, 0.55],
  ["wind", 144.55, 169.6, 0.35],
  ["fire", 169.6, 183.5, 0.3],
  ["wind", 183.5, 200.6, 0.35],
  ["wind", 203.25, 210.85, 0.35],
  ["room_tone", 210.85, 217.4, 0.55],
  ["waves", 217.4, 219.2, 0.5],
  ["wind", 219.2, 237.7, 0.35],
  ["fire", 237.7, 245.8, 0.45],
  ["waves", 245.8, 253.1, 0.5],
  ["room_tone", 253.1, 254.55, 0.55],
  ["wind", 254.55, 257.95, 0.35],
  ["fire", 257.95, 262.2, 0.3],
  ["room_tone", 262.2, 269.4, 0.55],
  ["wind", 269.4, 293.9, 0.35],
  ["fire", 293.9, 305.7, 0.35],
  ["wind", 305.7, 334.05, 0.35],
  ["battle_distant", 313.8, 334.05, 0.25],
  ["room_tone", 334.05, 337.95, 0.55],
  ["room_tone", 343.4, 347.05, 0.5],
  ["waves", 347.05, 359.3, 0.45],
  ["fire", 353.75, 359.3, 0.35],
  ["wind", 359.3, 385.3, 0.3],
  ["fire", 382.5, 385.3, 0.35],
  ["wind", 385.3, 451.15, 0.33],
  ["battle_distant", 432.2, 440.95, 0.3],
  ["room_tone", 453.5, 456.2, 0.4],
  ["wind", 456.2, 482.8, 0.35],
  ["clock", 461.95, 465.0, 0.4],
  ["fire", 469.5, 473.55, 0.4],
  ["battle_distant", 476.3, 480.2, 0.3],
  ["wind", 482.8, END, 0.35],
  ["battle_distant", 488.3, 491.7, 0.25],
];

export const FireArrowsSound: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const fxDuck = useMemo(() => duckFromCaptions(captions, fps, FX_DUCK, 0.12), [captions, fps]);
  const ambDuck = useMemo(() => duckFromCaptions(captions, fps, AMB_DUCK, 0.2), [captions, fps]);
  const slides = CUTS.filter((c) => c.into === "slide-left" || c.into === "slide-up");
  // hard cuts get a soft swish unless a cue already lands right there
  const hardCuts = CUTS.filter((c) => c.into === "cut" && c.at > 0 && !CUES.some(([t]) => Math.abs(t - c.at) < 0.35));
  return (
    <>
      {/* location beds */}
      {BEDS.map(([name, from, to, g], i) => (
        <Ambience key={`bed${i}`} name={name} from={from} to={to} volume={g * AMB} gainAt={ambDuck} fadeIn={0.3} fadeOut={0.4} />
      ))}
      <Bed src={E("crickets-chirping-country-night")} from={0} to={28.9} volume={0.25 * AMB} gainAt={ambDuck} name="amb:crickets" />
      <Bed src={E("crickets-chirping-country-night")} from={456.2} to={461.95} volume={0.25 * AMB} gainAt={ambDuck} name="amb:crickets" />
      <Bed src={E("ambient-crowd-murmur-1")} from={200.6} to={203.25} volume={0.4 * AMB} gainAt={ambDuck} name="amb:crowd" />
      <Bed src={E("ambient-crowd-murmur-2")} from={115.75} to={120.55} volume={0.35 * AMB} gainAt={ambDuck} name="amb:crowd" />
      <Bed src={E("ambient-city-street-1")} from={62.55} to={69.85} volume={0.4 * AMB} gainAt={ambDuck} name="amb:traffic" />
      <Bed src={E("water-stream")} from={359.3} to={382.5} volume={0.3 * AMB} gainAt={ambDuck} name="amb:river" />

      {/* footsteps */}
      {steps(5.2, 8.1, 2.2).map((t, i) => (
        <Sfx key={`s1${t}`} name={FOOT[i % 4]} at={t} volume={0.16 * FX} duck={fxDuck} />
      ))}
      {steps(102.0, 104.8, 2.4).map((t, i) => (
        <Sfx key={`s2${t}`} name={FOOT[i % 4]} at={t} volume={0.16 * FX} duck={fxDuck} />
      ))}
      {steps(238.8, 240.4, 3).map((t, i) => (
        <Sfx key={`s3${t}`} name={FOOT[i % 4]} at={t} volume={0.12 * FX} duck={fxDuck} />
      ))}
      {steps(376.1, 379.4, 1.6).map((t, i) => (
        <Sfx key={`s4${t}`} name={FOOT[i % 4]} at={t} volume={0.12 * FX} duck={fxDuck} />
      ))}

      {/* transitions */}
      {slides.map((c, i) => {
        const f = WHOOSHES[i % WHOOSHES.length];
        return <SoundAt key={`w${c.id}`} src={E(f)} at={c.at - 0.18} volume={WHOOSH_GAIN[f] * FX} duck={fxDuck} name={`whoosh:${c.id}`} />;
      })}
      {hardCuts.map((c) => (
        <Sfx key={`c${c.id}`} name="whoosh_soft" at={c.at - 0.08} volume={0.22 * FX} duck={fxDuck} />
      ))}

      {/* cue sheet */}
      {CUES.map(([t, f, g], i) => (
        <SoundAt key={`${i}-${f}`} src={E(f)} at={t} volume={g * FX} duck={fxDuck} name={f} />
      ))}
    </>
  );
};
