import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Bed, Sfx, SoundAt, licensedSrc, duckFromCaptions, type AmbName, type SfxName } from "../../kit/audio";
import { CUTS1 } from "./timeline1";
import { CUTS2 } from "./timeline2";
import { END1, END2 } from "./script";

// Sound design for the First Emperor's tomb (two parts).
// Voice-first: no music, no musical stingers, no birds. One-shots come from the
// licensed Essential Sound Effects Bundle (node scripts/import-sfx.mjs), beds
// from the synthesized library (npm run audio). Everything ducks under speech.
// Cue times sit on the narration's word times from the aligned captions.

const E = (name: string) => licensedSrc("essential", name);

const AMB = 0.42;
const FX = 0.9;
const FX_DUCK = 0.55; // -5 dB under speech
const AMB_DUCK = 0.5; // -6 dB under speech

// [time (s), bundle file, gain]
const CUES1: [number, string, number][] = [
  [0.2, "wind-1", 0.3],
  [3.08, "rumble-soft", 0.35],
  [11.47, "sparkle", 0.3],
  [13.84, "ratcheting", 0.3],
  [15.39, "twang-1", 0.3],
  [17.04, "pop-1", 0.22],
  [17.34, "pop-2", 0.22],
  [17.64, "pop-3", 0.22],
  [18.75, "pounding-three-hits", 0.28],
  [21.75, "rumble-soft", 0.3],
  [24.67, "impact-hit-1", 0.45],
  [27.23, "paper-rattling", 0.3],
  [31.21, "whoosh-low-distant", 0.25],
  [34.91, "rumble-soft", 0.3],
  [34.91, "thump", 0.6],
  [37.03, "footsteps-fast", 0.3],
  [40.81, "water-ocean-wave", 0.3],
  [44.28, "creak-short", 0.3],
  [44.86, "deflating", 0.22],
  [46.2, "impact-hit-2", 0.45],
  [51.0, "swish-1", 0.28],
  [53.79, "heartbeat-single-lub-dub", 0.5],
  [58.21, "stamp", 0.45],
  [61.88, "pop-1", 0.2],
  [62.0, "pop-2", 0.2],
  [62.12, "pop-3", 0.2],
  [62.24, "pop-4", 0.2],
  [62.36, "pop-1", 0.2],
  [62.48, "pop-2", 0.2],
  [62.6, "pop-3", 0.2],
  [63.42, "explosion-distant-2", 0.2],
  [70.8, "pop-2", 0.25],
  [73.73, "explosion-distant-1", 0.3],
  [78.25, "impact-hit-3", 0.5],
  [80.63, "swish-2", 0.3],
  [82.21, "impact-hit", 0.3],
  [82.21, "stamp", 0.55],
  [84.91, "pop-1", 0.28],
  [86.26, "pop-2", 0.28],
  [88.72, "sparkle", 0.25],
  [92.95, "stamp", 0.4],
  [95.69, "hit-dull", 0.4],
  [101.18, "footsteps", 0.22],
  [102.74, "thump", 0.4],
  [105.28, "paper-rattling", 0.3],
  [106.53, "page-turning", 0.35],
  [109.22, "swish-slicing", 0.45],
  [109.27, "impact-hit-1", 0.35],
  [111.84, "slice-impact-woosh", 0.5],
  [113.22, "tape-packing-tape", 0.35],
  [114.54, "whoosh-fast-short", 0.3],
  [116.1, "swish-3", 0.3],
  [124.7, "footsteps-fast", 0.32],
  [126.88, "whoosh-fast-short-muffled", 0.35],
  [128.59, "hit-dull", 0.45],
  [133.6, "swish-slicing", 0.4],
  [135.11, "slice-impact-woosh", 0.55],
  [135.46, "thump", 0.5],
  [136.01, "exhale", 0.35],
  [139.24, "heartbeat-single-lub-dub", 0.4],
  [141.58, "whoosh-echo", 0.25],
  [145.68, "sparkle", 0.25],
  [147.97, "horn-boat", 0.18],
  [150.77, "water-ocean-wave-3", 0.3],
  [152.36, "wind-2", 0.3],
  [153.21, "swish-2", 0.3],
  [157.61, "paper-rattling", 0.3],
  [162.42, "stamp", 0.45],
  [163.36, "stamp", 0.35],
  [166.98, "water-drip-single", 0.4],
  [169.58, "page-turning-2", 0.3],
  [171.98, "paper-rattling", 0.25],
  [174.02, "rattle", 0.35],
  [178.45, "water-drip-single", 0.35],
  [182.15, "water-drip-single", 0.3],
  [186.18, "impact-hit-2", 0.5],
  [186.78, "heartbeat-single-lub-dub", 0.4],
  [187.43, "water-drip-single", 0.3],
  [188.65, "whoosh-reverse-struggling", 0.28],
  [191.24, "pounding-three-hits", 0.28],
  [192.81, "impact-hit-3", 0.5],
  [196.6, "hit-dull", 0.3],
  [197.89, "rattle", 0.35],
  [200.66, "thump", 0.45],
  [202.4, "thump", 0.35],
  [205.58, "pop-1", 0.3],
  [207.16, "impact-hit-1", 0.45],
  [211.64, "rumble-soft", 0.35],
  [214.29, "ratcheting", 0.3],
  [215.58, "twang-2", 0.45],
  [215.83, "whiz-hit", 0.4],
  [221.59, "impact-hit-2", 0.45],
  [224.57, "impact-hit", 0.35],
  [227.28, "whoosh-low-distant", 0.3],
  [234.52, "sparkle", 0.3],
  [240.41, "machine", 0.18],
  [245.02, "sizzle", 0.2],
  [246.77, "pop-3", 0.3],
  [249.51, "water-impact-echo", 0.3],
  [250.69, "impact-hit-1", 0.45],
  [250.79, "rumble-soft", 0.35],
  [253.67, "sparkle", 0.3],
];
const CUES2: [number, string, number][] = [
  [1.53, "impact-hit-2", 0.5],
  [3.79, "door-slam-large-metal", 0.45],
  [8.17, "creak-short", 0.3],
  [9.99, "stamp", 0.45],
  [13.48, "hit-dull", 0.4],
  [15.69, "gasp-male-1", 0.3],
  [18.57, "wood-cracking", 0.35],
  [19.89, "pop-2", 0.25],
  [23.46, "knocking-on-door", 0.3],
  [26.87, "paper-rattling", 0.3],
  [29.09, "page-turning", 0.3],
  [32.38, "deflating", 0.25],
  [35.12, "slap", 0.35],
  [35.42, "slap-single", 0.3],
  [38.76, "paper-rattling", 0.3],
  [39.49, "stamp", 0.45],
  [42.19, "heartbeat-single-lub-dub", 0.4],
  [43.84, "hit-fade-out", 0.45],
  [44.24, "thump", 0.4],
  [47.89, "stamp", 0.45],
  [49.07, "rumble-soft", 0.3],
  [53.88, "hit-fade-out", 0.45],
  [56.55, "hit-dull", 0.35],
  [59.66, "hit-single", 0.3],
  [61.45, "footsteps-creepy", 0.25],
  [67.26, "door-slam-large-metal", 0.6],
  [67.26, "thump", 0.6],
  [67.36, "rumble-soft", 0.45],
  [70.06, "sizzle", 0.15],
  [72.03, "door-slam-large-metal", 0.45],
  [72.08, "rumble-soft", 0.4],
  [73.44, "thump", 0.65],
  [73.49, "crash-2", 0.3],
  [78.4, "heartbeat-single-lub-dub", 0.35],
  [78.6, "hit-fade-out", 0.3],
  [84.52, "wood-cracking-2", 0.4],
  [84.62, "crash-1", 0.3],
  [89.77, "impact-hit-1", 0.4],
  [91.4, "stamp", 0.45],
  [98.08, "whoosh-high", 0.2],
  [100.5, "grating-2", 0.2],
  [102.18, "thump", 0.45],
  [103.87, "footsteps-fast", 0.35],
  [105.75, "gasp-male-2", 0.3],
  [107.11, "impact-hit-2", 0.5],
  [109.36, "pop-1", 0.25],
  [109.93, "pop-2", 0.25],
  [110.6, "pop-3", 0.25],
  [111.37, "pop-4", 0.25],
  [113.65, "impact-hit-3", 0.4],
  [116.3, "pop-2", 0.25],
  [118.89, "swish-1", 0.28],
  [119.93, "buzzer-1", 0.18],
  [121.96, "sparkle", 0.35],
  [122.91, "pop-1", 0.22],
  [123.12, "pop-2", 0.22],
  [123.49, "pop-3", 0.22],
  [124.01, "pop-4", 0.22],
  [124.54, "pop-5", 0.22],
  [125.28, "pop-1", 0.22],
  [128.83, "crumple", 0.3],
  [132.58, "crumple", 0.3],
  [135.28, "sizzle", 0.3],
  [138.26, "pop-3", 0.3],
  [139.29, "impact-hit-1", 0.4],
  [143.89, "explosion-launch-hit-sizzle", 0.35],
  [146.61, "rumble-soft", 0.35],
  [148.71, "water-drip-single", 0.3],
  [150.8, "electronic-beeps-echo", 0.2],
  [154.14, "alert-tense", 0.18],
  [155.06, "stamp", 0.4],
  [158.23, "air-blowing", 0.25],
  [162.12, "impact-hit-2", 0.45],
  [164.56, "pop-2", 0.3],
  [169.22, "impact-hit-1", 0.4],
  [170.8, "swish-2", 0.3],
  [175.62, "crumple", 0.3],
  [175.72, "rumble-soft", 0.25],
  [177.97, "electronic-beeps-echo", 0.2],
  [181.62, "rumble-soft", 0.3],
  [183.94, "heartbeat-single-lub-dub", 0.35],
  [186.38, "sparkle", 0.25],
  [187.72, "stamp", 0.45],
  [191.02, "pop-1", 0.2],
  [191.14, "pop-2", 0.2],
  [191.26, "pop-3", 0.2],
  [191.38, "pop-4", 0.2],
  [193.15, "impact-hit-2", 0.4],
  [193.45, "hit-dull", 0.25],
  [193.6, "hit-dull", 0.2],
  [193.75, "hit-dull", 0.16],
  [193.9, "hit-dull", 0.12],
  [195.87, "wood-cracking", 0.35],
  [196.11, "crash-1", 0.4],
  [196.11, "rumble-soft", 0.45],
  [197.59, "impact-hit-1", 0.45],
  [200.51, "stamp", 0.5],
  [203.47, "door-slam-large-metal", 0.3],
  [205.86, "rumble-soft", 0.3],
  [207.97, "air-blowing", 0.2],
  [209.09, "pop-1", 0.3],
  [209.34, "pop-2", 0.3],
  [209.59, "pop-3", 0.3],
];

type BedRow = [AmbName, number, number, number];

const BEDS1: BedRow[] = [
  ["wind", 0, 2.75, 0.4],
  ["room_tone", 2.75, 19.45, 0.5],
  ["wind", 19.45, 25.5, 0.35],
  ["room_tone", 25.5, 38.95, 0.45],
  ["waves", 38.95, 42.6, 0.4],
  ["wind", 42.6, 50.65, 0.35],
  ["room_tone", 50.65, 59.05, 0.45],
  ["wind", 59.05, 61.45, 0.3],
  ["battle_distant", 61.45, 63.85, 0.35],
  ["wind", 63.85, 72.0, 0.35],
  ["battle_distant", 72.0, 75.45, 0.45],
  ["room_tone", 75.45, 142.15, 0.45],
  ["waves", 142.15, 156.65, 0.4],
  ["wind", 156.65, 173.4, 0.35],
  ["room_tone", 173.4, 189.2, 0.45],
  ["wind", 189.2, 209.0, 0.38],
  ["room_tone", 209.0, 217.65, 0.5],
  ["wind", 217.65, 226.35, 0.38],
  ["room_tone", 226.35, 248.95, 0.45],
  ["waves", 248.95, 250.15, 0.4],
  ["room_tone", 250.15, END1, 0.5],
];

const BEDS2: BedRow[] = [
  ["room_tone", 0, 4.45, 0.45],
  ["wind", 4.45, 9.65, 0.38],
  ["room_tone", 9.65, 20.55, 0.45],
  ["wind", 20.55, 36.75, 0.38],
  ["room_tone", 36.75, 48.55, 0.45],
  ["wind", 48.55, 62.65, 0.35],
  ["room_tone", 62.65, 72.15, 0.55],
  ["wind", 72.15, 77.45, 0.38],
  ["room_tone", 77.45, 85.5, 0.45],
  ["wind", 85.5, 106.3, 0.38],
  ["room_tone", 106.3, 138.65, 0.45],
  ["fire", 138.65, 144.65, 0.5],
  ["wind", 144.65, 162.75, 0.38],
  ["room_tone", 162.75, 176.4, 0.45],
  ["wind", 176.4, 178.85, 0.35],
  ["room_tone", 178.85, 198.45, 0.45],
  ["wind", 198.45, 201.2, 0.38],
  ["room_tone", 201.2, END2, 0.45],
];

// licensed beds: [file, from, to, gain]
const LBEDS1: [string, number, number, number][] = [
  ["water-stream", 6.15, 9.45, 0.3],
  ["ambient-crowd-murmur-1", 19.45, 22.55, 0.25],
  ["water-stream", 209.0, 213.55, 0.25],
  ["water-stream", 235.25, 241.25, 0.25],
];
const LBEDS2: [string, number, number, number][] = [
  ["ambient-crowd-murmur-1", 48.55, 54.75, 0.22],
  ["water-stream", 154.75, 162.75, 0.22],
  ["water-stream", 173.95, 176.4, 0.22],
  ["water-stream", 178.85, 184.8, 0.2],
];

const steps = (from: number, to: number, rate: number) => {
  const out: number[] = [];
  for (let t = from; t < to; t += 1 / rate) out.push(t);
  return out;
};
const FOOT: SfxName[] = ["footstep", "footstep2", "footstep3", "footstep4"];

// [from, to, rate]: walking footsteps and digging thuds
const WALK1: [number, number, number][] = [[97.0, 101.5, 1.8]];
const DIG1: [number, number, number][] = [[65.8, 69.0, 1.2], [189.5, 192.0, 1.4], [200.4, 203.6, 1.0]];
const WALK2: [number, number, number][] = [[4.7, 9.4, 1.6], [102.9, 105.5, 3.0]];
const DIG2: [number, number, number][] = [[85.7, 90.8, 1.2], [93.0, 96.8, 1.2]];

// a whoosh on every slide transition (alternating files), slightly ahead of the cut
const WHOOSHES = ["whoosh-1", "whoosh-2", "whoosh-3", "whoosh-5", "swoosh-fast-1"];
const WHOOSH_GAIN: Record<string, number> = { "whoosh-1": 0.7, "whoosh-2": 0.6, "whoosh-3": 0.6, "whoosh-5": 0.5, "swoosh-fast-1": 0.9 };

export const QinTombSound: React.FC<{ captions: Caption[]; part: 1 | 2 }> = ({ captions, part }) => {
  const { fps } = useVideoConfig();
  const fxDuck = useMemo(() => duckFromCaptions(captions, fps, FX_DUCK, 0.12), [captions, fps]);
  const ambDuck = useMemo(() => duckFromCaptions(captions, fps, AMB_DUCK, 0.2), [captions, fps]);
  const cuts = part === 1 ? CUTS1 : CUTS2;
  const cues = part === 1 ? CUES1 : CUES2;
  const beds = part === 1 ? BEDS1 : BEDS2;
  const lbeds = part === 1 ? LBEDS1 : LBEDS2;
  const walk = part === 1 ? WALK1 : WALK2;
  const dig = part === 1 ? DIG1 : DIG2;
  const slides = cuts.filter((c) => c.into === "slide-left");
  // hard cuts get a soft swish unless a cue already lands right there
  const hardCuts = cuts.filter((c) => c.into === "cut" && c.at > 0 && !cues.some(([t]) => Math.abs(t - c.at) < 0.35));
  return (
    <>
      {beds.map(([name, from, to, g], i) => (
        <Ambience key={`bed${i}`} name={name} from={from} to={to} volume={g * AMB} gainAt={ambDuck} fadeIn={0.3} fadeOut={0.4} />
      ))}
      {lbeds.map(([f, from, to, g], i) => (
        <Bed key={`lb${i}`} src={E(f)} from={from} to={to} volume={g * AMB} gainAt={ambDuck} name={`amb:${f}`} />
      ))}

      {walk.flatMap(([a, b, r], k) =>
        steps(a, b, r).map((t, i) => <Sfx key={`w${k}-${i}`} name={FOOT[i % 4]} at={t} volume={0.14 * FX} duck={fxDuck} />),
      )}
      {dig.flatMap(([a, b, r], k) =>
        steps(a, b, r).map((t, i) => <Sfx key={`d${k}-${i}`} name="thud" at={t} volume={0.2 * FX} duck={fxDuck} />),
      )}

      {slides.map((c, i) => {
        const f = WHOOSHES[i % WHOOSHES.length];
        return <SoundAt key={`wh${c.id}`} src={E(f)} at={c.at - 0.18} volume={WHOOSH_GAIN[f] * FX} duck={fxDuck} name={`whoosh:${c.id}`} />;
      })}
      {hardCuts.map((c) => (
        <Sfx key={`c${c.id}`} name="whoosh_soft" at={c.at - 0.08} volume={0.22 * FX} duck={fxDuck} />
      ))}

      {cues.map(([t, f, g], i) => (
        <SoundAt key={`${i}-${f}`} src={E(f)} at={t} volume={g * FX} duck={fxDuck} name={f} />
      ))}
    </>
  );
};
