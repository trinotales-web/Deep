import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Bed, Sfx, SoundAt, licensedSrc, duckFromCaptions, type AmbName, type SfxName } from "../../kit/audio";

// Sound design for the blue whale story. Voice-first: no music, no musical
// stingers, no whooshes on cuts, no birdsong. One quiet bed per location
// (sea, underwater, rooms, wind) and licensed one-shots (Essential Sound
// Effects Bundle) only for things you can see happen, plus soft accents on
// reveals. Everything ducks under the narration; times are seconds on the
// tightened VO (public/vo/whale.tight.voice.m4a).

const E = (name: string) => licensedSrc("essential", name);

const AMB = 0.85;
const FX = 0.9;
const FX_DUCK = 0.55; // ≈ -5 dB under speech
const AMB_DUCK = 0.5; // ≈ -6 dB under speech

type BedRow = [AmbName, number, number, number];
// location beds (generated from the shot locations): [bed, from, to, gain]
const BEDS: BedRow[] = [
  ["waves", 0.0, 10.12, 0.3],
  ["room_tone", 10.12, 12.78, 0.28],
  ["waves", 12.78, 19.2, 0.3],
  ["underwater", 19.2, 24.63, 0.8],
  ["waves", 24.63, 29.35, 0.3],
  ["underwater", 29.35, 38.96, 0.8],
  ["room_tone", 38.96, 40.99, 0.2],
  ["room_tone", 40.99, 43.81, 0.28],
  ["underwater", 43.81, 46.76, 0.8],
  ["room_tone", 46.76, 52.39, 0.2],
  ["underwater", 52.39, 56.25, 0.8],
  ["wind", 56.25, 59.82, 0.14],
  ["room_tone", 56.25, 59.82, 0.18],
  ["room_tone", 59.82, 63.91, 0.2],
  ["underwater", 63.91, 66.56, 0.8],
  ["waves", 66.56, 69.41, 0.26],
  ["wind", 66.56, 69.41, 0.14],
  ["room_tone", 69.41, 75.14, 0.2],
  ["wind", 75.14, 84.71, 0.14],
  ["room_tone", 75.14, 84.71, 0.18],
  ["room_tone", 84.71, 86.5, 0.2],
  ["wind", 86.5, 88.96, 0.14],
  ["room_tone", 86.5, 88.96, 0.18],
  ["room_tone", 88.96, 92.44, 0.28],
  ["room_tone", 92.44, 95.25, 0.2],
  ["room_tone", 95.25, 97.6, 0.28],
  ["room_tone", 97.6, 102.8, 0.2],
  ["wind", 102.8, 107.31, 0.14],
  ["room_tone", 102.8, 107.31, 0.18],
  ["underwater", 107.31, 119.83, 0.8],
  ["room_tone", 119.83, 121.17, 0.24],
  ["wind", 121.17, 125.73, 0.24],
  ["underwater", 125.73, 127.14, 0.8],
  ["room_tone", 127.14, 133.28, 0.2],
  ["room_tone", 133.28, 138.36, 0.28],
  ["room_tone", 138.36, 144.2, 0.2],
  ["underwater", 144.2, 146.19, 0.8],
  ["room_tone", 146.19, 150.49, 0.2],
  ["underwater", 150.49, 161.85, 0.8],
  ["room_tone", 161.85, 167.06, 0.2],
  ["underwater", 167.06, 171.69, 0.8],
  ["room_tone", 171.69, 173.48, 0.28],
  ["room_tone", 173.48, 177.11, 0.2],
  ["underwater", 177.11, 180.14, 0.8],
  ["room_tone", 180.14, 183.22, 0.2],
  ["underwater", 183.22, 185.41, 0.8],
  ["room_tone", 185.41, 191.28, 0.28],
  ["room_tone", 191.28, 195.62, 0.2],
  ["room_tone", 195.62, 197.54, 0.28],
  ["room_tone", 197.54, 209.6, 0.2],
  ["room_tone", 209.6, 214.01, 0.28],
  ["underwater", 214.01, 215.46, 0.8],
  ["wind", 215.46, 216.73, 0.24],
  ["room_tone", 216.73, 220.22, 0.2],
  ["underwater", 220.22, 228.44, 0.8],
  ["room_tone", 228.44, 231.63, 0.2],
  ["underwater", 231.63, 237.08, 0.8],
  ["room_tone", 237.08, 240.49, 0.2],
  ["underwater", 240.49, 243.76, 0.8],
  ["room_tone", 243.76, 248.42, 0.2],
  ["underwater", 248.42, 285.44, 0.8],
  ["room_tone", 285.44, 293.13, 0.2],
  ["underwater", 293.13, 296.84, 0.8],
  ["room_tone", 296.84, 303.41, 0.2],
  ["underwater", 303.41, 313.64, 0.8],
  ["room_tone", 313.64, 314.91, 0.2],
  ["underwater", 314.91, 317.92, 0.8],
  ["room_tone", 317.92, 324.64, 0.2],
  ["underwater", 324.64, 327.94, 0.8],
  ["room_tone", 327.94, 331.0, 0.2],
  ["underwater", 331.0, 336.12, 0.8],
  ["room_tone", 336.12, 340.16, 0.2],
  ["underwater", 340.16, 349.69, 0.8],
  ["room_tone", 349.69, 359.12, 0.2],
  ["underwater", 359.12, 367.13, 0.8],
  ["room_tone", 367.13, 378.86, 0.2],
  ["wind", 378.86, 382.77, 0.24],
  ["room_tone", 382.77, 386.71, 0.28],
  ["room_tone", 386.71, 397.99, 0.2],
  ["underwater", 397.99, 417.96, 0.8],
  ["room_tone", 417.96, 421.45, 0.2],
  ["underwater", 421.45, 424.63, 0.8],
  ["waves", 424.63, 427.09, 0.3],
  ["underwater", 427.09, 433.55, 0.8],
  ["room_tone", 433.55, 436.77, 0.2],
  ["underwater", 436.77, 444.31, 0.8],
  ["waves", 444.31, 451.81, 0.26],
  ["wind", 444.31, 451.81, 0.14],
  ["room_tone", 451.81, 460.84, 0.2],
  ["waves", 460.84, 465.45, 0.3],
  ["room_tone", 465.45, 470.81, 0.2],
  ["underwater", 470.81, 472.55, 0.8],
  ["room_tone", 472.55, 475.81, 0.2],
  ["underwater", 475.81, 477.53, 0.8],
  ["room_tone", 477.53, 488.52, 0.2],
  ["underwater", 488.52, 507.95, 0.8],
  ["room_tone", 507.95, 509.2, 0.2],
  ["underwater", 509.2, 517.9, 0.8],
  ["room_tone", 517.9, 520.12, 0.2],
  ["wind", 520.12, 525.21, 0.14],
  ["room_tone", 520.12, 525.21, 0.18],
  ["underwater", 525.21, 528.32, 0.8],
  ["room_tone", 528.32, 531.62, 0.2],
  ["underwater", 531.62, 533.09, 0.8],
  ["waves", 533.09, 536.11, 0.3],
  ["room_tone", 536.11, 545.6, 0.2],
];

const LBEDS: [string, number, number, number][] = [
  ["machinery-1", 66.56, 69.41, 0.05],
  ["ambient-crowd-murmur-indoors-1", 119.83, 121.17, 0.12],
  ["machinery-1", 444.31, 451.81, 0.05],
];

// extra beds layered on a location: [bed, from, to, gain]
const EXTRA: BedRow[] = [
  ["wind", 225.6, 228.4, 0.12],
  ["clock", 323.06, 324.64, 0.45],
];

// licensed loops placed on visible actions: [file, from, to, gain]
const ACTS: [string, number, number, number][] = [
  ["typing-2", 27.6, 28.9, 0.1],
  ["footsteps-water", 83.1, 84.6, 0.12],
  ["water-running", 165.0, 167.0, 0.1],
  ["water-flowing", 167.6, 168.7, 0.14],
  ["water-stream-2", 169.2, 170.5, 0.12],
  ["water-flowing", 256.6, 257.9, 0.14],
  ["water-stream", 258.0, 260.3, 0.1],
  ["water-stream-2", 272.8, 274.6, 0.08],
  ["water-flowing", 315.2, 317.6, 0.12],
  ["water-flowing", 376.5, 378.6, 0.08],
  ["heartbeat", 430.2, 433.4, 0.1],
  ["heartbeat", 433.8, 436.6, 0.08],
];

// one-shots: [time (s), bundle file, gain]
const CUES: [number, string, number][] = [
  // cold open: California, 2018
  [6.4, "water-ocean-wave", 0.2],
  [7.05, "air-blowing", 0.22],
  [8.22, "air-blowing", 0.08],
  [9.3, "water-ocean-wave-3", 0.2],
  [17.05, "ding-suction", 0.3],
  [19.6, "electronic-beeps-echo", 0.07],
  [22.85, "heartbeat-single-lub-dub", 0.3],
  [25.1, "air-blowing", 0.22],
  [27.2, "water-impact-echo", 0.2],
  [31.5, "heartbeat-single-lub-dub", 0.08],
  [32.81, "heartbeat-single-lub-dub", 0.08],
  [33.8, "heartbeat-single-lub-dub", 0.24],
  [39.3, "thump", 0.3],
  [39.4, "ratcheting", 0.12],
  [48.3, "sparkle", 0.12],
  [50.9, "thump", 0.28],
  // coming up
  [61.3, "thump", 0.2],
  [63.22, "stamp", 0.24],
  [63.65, "thump", 0.24],
  [64.6, "water-flowing", 0.14],
  [65.0, "pop-1", 0.05],
  [65.12, "pop-2", 0.05],
  [65.24, "pop-1", 0.05],
  [65.36, "pop-2", 0.05],
  [65.48, "pop-1", 0.05],
  [66.8, "horn-boat", 0.08],
  [67.95, "gunshot-large", 0.12],
  [69.6, "rewind-1", 0.12],
  [73.8, "pop-3", 0.12],
  // Pakicetus
  [82.0, "growl", 0.16],
  [82.1, "scurry", 0.14],
  [85.7, "pop-2", 0.12],
  [87.25, "stamp", 0.24],
  [89.4, "sparkle", 0.12],
  [94.3, "pop-1", 0.1],
  [98.3, "ding-single-bright", 0.12],
  [100.5, "pop-2", 0.12],
  [101.8, "pop-3", 0.14],
  [102.1, "pop-1", 0.1],
  [105.5, "water-flowing", 0.12],
  [112.8, "air-blowing", 0.15],
  [115.0, "underwater-bubbles-2", 0.1],
  // Perucetus
  [119.1, "rumble-soft", 0.25],
  [120.3, "camera-1", 0.18],
  [120.8, "camera-2", 0.16],
  [124.0, "hit-dull", 0.12],
  [128.5, "thump", 0.26],
  [130.0, "paper-rattling", 0.16],
  [130.5, "page-turning", 0.14],
  [131.0, "page-turning-2", 0.14],
  [132.6, "pop-1", 0.12],
  [139.6, "thump", 0.26],
  [139.9, "ratcheting", 0.1],
  [142.9, "thump", 0.26],
  [144.95, "ding-single-1", 0.16],
  [145.0, "sparkle", 0.12],
  // toothed and baleen
  [146.5, "pop-2", 0.1],
  [149.3, "pop-1", 0.1],
  [150.0, "pop-2", 0.1],
  [150.1, "pop-3", 0.1],
  [155.0, "underwater-bubbles-2", 0.1],
  [159.57, "stamp", 0.06],
  [163.3, "pop-1", 0.1],
  [164.1, "sparkle", 0.12],
  // a time of giants
  [179.34, "stamp", 0.06],
  [180.4, "pop-1", 0.1],
  [182.4, "pop-2", 0.1],
  [184.5, "pop-2", 0.12],
  [188.6, "ratcheting", 0.1],
  [191.7, "ratcheting", 0.1],
  [193.3, "pop-4", 0.1],
  [207.6, "page-turning", 0.16],
  [208.67, "stamp", 0.24],
  [214.6, "pop-2", 0.12],
  [215.5, "wood-cracking-2", 0.2],
  [217.0, "rumble-soft", 0.2],
  [229.1, "pop-1", 0.08],
  [229.4, "pop-2", 0.08],
  [229.7, "pop-1", 0.08],
  [230.0, "pop-2", 0.08],
  [230.4, "page-turning", 0.12],
  [231.8, "sparkle", 0.12],
  [237.9, "thump", 0.2],
  [245.0, "pop-1", 0.08],
  [247.65, "thump", 0.12],
  // lunge feeding
  [260.5, "creak-short", 0.14],
  [262.3, "creak-short", 0.16],
  [263.7, "underwater-bubbles-4", 0.07],
  [268.9, "pop-3", 0.12],
  [270.2, "pop-1", 0.1],
  [274.9, "hit-dull", 0.18],
  [276.6, "ratcheting", 0.1],
  [286.0, "pop-1", 0.1],
  ...Array.from({ length: 10 }, (_, i) => [289.5 + i * 0.25, ["pop-1", "pop-2", "pop-4", "pop-5"][i % 4], 0.07] as [number, string, number]),
  [293.9, "hit-dull", 0.2],
  [294.0, "underwater-bubbles-3", 0.12],
  [295.2, "pop-2", 0.12],
  [295.98, "pop-3", 0.08],
  [297.1, "pop-1", 0.08],
  [297.45, "pop-1", 0.08],
  [297.8, "pop-1", 0.08],
  [314.0, "thump", 0.12],
  [320.6, "ratcheting", 0.08],
  [321.25, "thump", 0.26],
  // seasons, migration, calves
  [325.23, "stamp", 0.22],
  [326.4, "page-turning", 0.1],
  [327.0, "page-turning-2", 0.1],
  [328.9, "sparkle", 0.12],
  [333.5, "water-flowing", 0.1],
  [342.6, "deflating", 0.12],
  [347.8, "pop-1", 0.1],
  [350.0, "ratcheting", 0.08],
  [352.5, "buzzer-1", 0.06],
  [354.5, "thump", 0.2],
  [365.3, "underwater-bubbles-2", 0.1],
  ...Array.from({ length: 5 }, (_, i) => [367.6 + i * 0.7, i % 2 ? "page-turning-2" : "page-turning", 0.1] as [number, string, number]),
  // the heart myth
  [372.31, "stamp", 0.24],
  [374.6, "pop-4", 0.12],
  [377.0, "laughter-kid", 0.08],
  [387.0, "thump", 0.24],
  [394.8, "creak-short", 0.12],
  [395.4, "pop-4", 0.1],
  [396.5, "buzzer-2", 0.12],
  [396.9, "stamp", 0.2],
  // limits
  [401.7, "pop-2", 0.12],
  [404.4, "electronic-beeps-echo", 0.08],
  [416.2, "water-flowing", 0.06],
  [420.4, "pop-1", 0.06],
  [420.5, "pop-2", 0.06],
  [420.6, "pop-1", 0.06],
  [420.7, "pop-2", 0.06],
  [427.6, "heartbeat-single-lub-dub", 0.14],
  [428.93, "heartbeat-single-lub-dub", 0.08],
  [433.8, "ratcheting", 0.08],
  [437.4, "heartbeat-single-lub-dub", 0.1],
  // whaling
  [444.2, "horn-boat", 0.08],
  [449.0, "gunshot-large", 0.12],
  [455.4, "rumble-soft", 0.2],
  [463.4, "air-blowing", 0.1],
  [463.69, "stamp", 0.12],
  [466.0, "sparkle", 0.1],
  [468.0, "pop-1", 0.08],
  // krill in trouble, the whale pump
  [471.6, "pop-3", 0.12],
  [474.4, "rattle", 0.22],
  [476.5, "pop-2", 0.1],
  [479.5, "wood-cracking", 0.16],
  [490.9, "pop-1", 0.1],
  [492.9, "pop-3", 0.12],
  [494.2, "water-flowing", 0.1],
  [496.1, "underwater-bubbles-4", 0.16],
  [497.5, "underwater-bubbles-2", 0.1],
  [499.6, "sparkle", 0.1],
  [502.4, "buzzer-2", 0.06],
  // the answer
  [508.2, "thump", 0.16],
  [510.5, "water-flowing", 0.1],
  [518.6, "rattle", 0.22],
  [526.1, "heartbeat-single-lub-dub", 0.1],
  [534.0, "air-blowing", 0.1],
  [537.6, "pop-2", 0.1],
  [537.9, "pop-3", 0.1],
  [542.6, "pop-4", 0.12],
  [543.95, "pop-1", 0.12],
];

const steps = (from: number, to: number, rate: number) => {
  const out: number[] = [];
  for (let t = from; t < to; t += 1 / rate) out.push(t);
  return out;
};
const FOOT: SfxName[] = ["footstep", "footstep2", "footstep3", "footstep4"];
// [from, to, rate, gain]: visible walking (people, and Pakicetus' soft paws)
const WALK: [number, number, number, number][] = [
  [75.2, 76.3, 3.2, 0.05],
  [77.0, 78.7, 2.6, 0.05],
  [185.5, 188.0, 1.8, 0.09],
];
// chalk on the board while the math is checked
const SCRIBBLE = [134.85, 135.45, 136.05];

export const WhaleSound: React.FC<{ captions: Caption[] }> = ({ captions }) => {
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
      {SCRIBBLE.map((t, i) => (
        <Sfx key={`s${i}`} name="scribble" at={t} volume={0.12 * FX} duck={fxDuck} />
      ))}
      {CUES.filter(([, , g]) => g > 0).map(([t, f, g], i) => (
        <SoundAt key={`${i}-${f}`} src={E(f)} at={t} volume={g * FX} duck={fxDuck} name={f} />
      ))}
    </>
  );
};
