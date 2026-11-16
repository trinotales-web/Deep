import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Bed, Sfx, SoundAt, licensedSrc, duckFromCaptions, type AmbName, type SfxName } from "../../kit/audio";

// Sound design for the Napoleon story. Voice-first: no music, no musical
// stingers, no whooshes on cuts. One quiet bed per location (mountain wind on
// the Grenoble road and in the Alps, room tone indoors and under maps, sea
// waves at Toulon, Egypt and the islands, a distant battle under fighting,
// fire in Moscow, rain at Waterloo) and licensed one-shots (Essential Sound
// Effects Bundle) only for things you can see happen. Everything ducks under
// the narration; times are seconds on the tightened VO
// (public/vo/napoleon.tight.voice.m4a).

const E = (name: string) => licensedSrc("essential", name);

const AMB = 0.85;
const FX = 0.9;
const FX_DUCK = 0.55; // ≈ -5 dB under speech
const AMB_DUCK = 0.5; // ≈ -6 dB under speech

type BedRow = [AmbName, number, number, number];
// location beds (generated from the shot sets): [bed, from, to, gain]
const BEDS: BedRow[] = [
  ["wind", 0.0, 10.54, 0.22],
  ["room_tone", 10.54, 17.39, 0.14],
  ["wind", 17.39, 34.11, 0.22],
  ["waves", 34.11, 36.64, 0.2],
  ["room_tone", 36.64, 38.93, 0.14],
  ["room_tone", 38.93, 41.01, 0.3],
  ["room_tone", 41.01, 42.63, 0.14],
  ["waves", 42.63, 44.81, 0.3],
  ["room_tone", 44.81, 54.61, 0.3],
  ["room_tone", 54.61, 62.23, 0.14],
  ["waves", 62.23, 65.29, 0.2],
  ["room_tone", 65.29, 69.14, 0.14],
  ["waves", 69.14, 82.04, 0.2],
  ["room_tone", 82.04, 90.61, 0.3],
  ["room_tone", 90.61, 94.07, 0.14],
  ["wind", 94.07, 95.36, 0.22],
  ["room_tone", 95.36, 102.39, 0.3],
  ["wind", 102.39, 103.73, 0.22],
  ["room_tone", 103.73, 110.59, 0.3],
  ["battle_distant", 110.59, 113.44, 0.3],
  ["room_tone", 113.44, 116.45, 0.3],
  ["room_tone", 116.45, 118.88, 0.14],
  ["room_tone", 118.88, 124.26, 0.12],
  ["room_tone", 124.26, 125.95, 0.3],
  ["room_tone", 125.95, 127.4, 0.12],
  ["wind", 127.4, 129.75, 0.22],
  ["room_tone", 129.75, 134.22, 0.14],
  ["waves", 134.22, 147.93, 0.3],
  ["battle_distant", 147.93, 152.62, 0.3],
  ["waves", 152.62, 157.38, 0.3],
  ["room_tone", 157.38, 159.24, 0.14],
  ["room_tone", 159.24, 162.26, 0.3],
  ["rain", 162.26, 164.84, 0.4],
  ["room_tone", 164.84, 168.04, 0.3],
  ["room_tone", 168.04, 173.62, 0.14],
  ["room_tone", 173.62, 174.9, 0.3],
  ["room_tone", 174.9, 182.04, 0.12],
  ["room_tone", 182.04, 186.01, 0.3],
  ["room_tone", 186.01, 198.05, 0.12],
  ["room_tone", 198.05, 201.23, 0.14],
  ["room_tone", 201.23, 204.0, 0.3],
  ["wind", 204.0, 206.71, 0.22],
  ["room_tone", 206.71, 210.21, 0.14],
  ["room_tone", 210.21, 211.48, 0.3],
  ["room_tone", 211.48, 214.92, 0.14],
  ["wind", 214.92, 222.73, 0.22],
  ["room_tone", 222.73, 225.76, 0.14],
  ["wind", 225.76, 234.16, 0.22],
  ["room_tone", 234.16, 236.17, 0.14],
  ["room_tone", 236.17, 243.91, 0.3],
  ["room_tone", 243.91, 248.49, 0.14],
  ["room_tone", 248.49, 251.19, 0.12],
  ["room_tone", 251.19, 254.66, 0.3],
  ["room_tone", 254.66, 262.95, 0.14],
  ["waves", 262.95, 268.64, 0.3],
  ["room_tone", 268.64, 269.54, 0.3],
  ["room_tone", 269.54, 271.86, 0.14],
  ["wind", 271.86, 275.0, 0.18],
  ["battle_distant", 275.0, 278.24, 0.3],
  ["waves", 278.24, 283.9, 0.3],
  ["room_tone", 283.9, 285.15, 0.3],
  ["waves", 285.15, 287.69, 0.3],
  ["wind", 287.69, 291.68, 0.18],
  ["waves", 291.68, 297.45, 0.3],
  ["wind", 297.45, 304.08, 0.18],
  ["room_tone", 304.08, 309.91, 0.14],
  ["room_tone", 309.91, 310.84, 0.3],
  ["waves", 310.84, 313.46, 0.3],
  ["room_tone", 313.46, 317.96, 0.14],
  ["room_tone", 317.96, 325.82, 0.3],
  ["wind", 325.82, 331.92, 0.45],
  ["room_tone", 331.92, 337.27, 0.3],
  ["wind", 337.27, 339.74, 0.45],
  ["room_tone", 339.74, 348.22, 0.3],
  ["room_tone", 348.22, 351.61, 0.14],
  ["room_tone", 351.61, 356.08, 0.3],
  ["room_tone", 356.08, 359.63, 0.14],
  ["room_tone", 359.63, 364.76, 0.3],
  ["room_tone", 364.76, 368.72, 0.14],
  ["battle_distant", 368.72, 371.66, 0.3],
  ["waves", 371.66, 374.71, 0.3],
  ["room_tone", 374.71, 377.39, 0.3],
  ["room_tone", 377.39, 381.86, 0.14],
  ["room_tone", 381.86, 383.49, 0.3],
  ["room_tone", 383.49, 389.0, 0.14],
  ["room_tone", 389.0, 400.77, 0.3],
  ["wind", 400.77, 407.34, 0.22],
  ["room_tone", 407.34, 410.13, 0.14],
  ["wind", 410.13, 412.09, 0.22],
  ["room_tone", 412.09, 414.48, 0.14],
  ["battle_distant", 414.48, 416.64, 0.3],
  ["room_tone", 416.64, 418.63, 0.14],
  ["room_tone", 418.63, 419.8, 0.3],
  ["wind", 419.8, 425.47, 0.22],
  ["room_tone", 425.47, 428.39, 0.3],
  ["wind", 428.39, 436.94, 0.18],
  ["room_tone", 436.94, 439.25, 0.3],
  ["room_tone", 439.25, 440.16, 0.14],
  ["wind", 440.16, 445.53, 0.22],
  ["fire", 445.53, 447.81, 0.28],
  ["room_tone", 447.81, 450.07, 0.14],
  ["wind", 450.07, 452.09, 0.22],
  ["fire", 452.09, 453.9, 0.28],
  ["room_tone", 453.9, 458.01, 0.3],
  ["room_tone", 458.01, 460.77, 0.14],
  ["wind", 460.77, 463.96, 0.45],
  ["room_tone", 463.96, 466.25, 0.14],
  ["wind", 466.25, 468.43, 0.45],
  ["room_tone", 468.43, 473.84, 0.3],
  ["room_tone", 473.84, 485.69, 0.14],
  ["room_tone", 485.69, 490.95, 0.12],
  ["room_tone", 490.95, 494.44, 0.14],
  ["waves", 494.44, 504.59, 0.3],
  ["wind", 504.59, 518.02, 0.22],
  ["room_tone", 518.02, 521.85, 0.12],
  ["rain", 521.85, 523.4, 0.4],
  ["room_tone", 523.4, 527.82, 0.14],
  ["wind", 527.82, 530.62, 0.22],
  ["room_tone", 530.62, 532.95, 0.14],
  ["rain", 532.95, 535.75, 0.4],
  ["wind", 535.75, 538.61, 0.22],
  ["room_tone", 538.61, 541.16, 0.3],
  ["rain", 541.16, 543.13, 0.4],
  ["battle_distant", 543.13, 548.18, 0.3],
  ["wind", 548.18, 553.39, 0.22],
  ["waves", 553.39, 556.16, 0.3],
  ["room_tone", 556.16, 560.65, 0.14],
  ["room_tone", 560.65, 564.12, 0.3],
  ["waves", 564.12, 565.59, 0.3],
  ["room_tone", 565.59, 573.49, 0.3],
  ["room_tone", 573.49, 581.41, 0.14],
  ["room_tone", 581.41, 589.49, 0.3],
  ["room_tone", 589.49, 593.8, 0.14],
  ["room_tone", 593.8, 594.91, 0.3],
  ["wind", 594.91, 596.84, 0.22],
  ["room_tone", 596.84, 609.82, 0.14],
  ["waves", 609.82, 611.34, 0.3],
  ["wind", 611.34, 617.41, 0.22],
  ["room_tone", 617.41, 619.7, 0.14],
];

const LBEDS: [string, number, number, number][] = [
  ["ambient-crowd-murmur-1", 118.88, 124.26, 0.08],
  ["ambient-crowd-murmur-1", 125.95, 127.4, 0.08],
  ["ambient-crowd-murmur-1", 174.9, 182.04, 0.08],
  ["ambient-crowd-murmur-1", 186.01, 198.05, 0.08],
  ["ambient-crowd-murmur-1", 248.49, 251.19, 0.08],
  ["ambient-crowd-murmur-1", 485.69, 490.95, 0.08],
  ["ambient-crowd-murmur-1", 518.02, 521.85, 0.08],
];

// extra synth beds on top of a location: [bed, from, to, gain]
const EXTRA: BedRow[] = [
  ["clock", 56.8, 59.6, 0.35],
  ["fire", 445.6, 447.8, 0.25],
  ["clock", 453.9, 456.4, 0.3],
  ["clock", 538.6, 539.9, 0.55],
  ["battle_distant", 414.5, 418.6, 0.18],
  ["battle_distant", 543.1, 548.2, 0.2],
];

// licensed loops on visible actions: [file, from, to, gain]
const ACTS: [string, number, number, number][] = [
  ["heartbeat", 31.9, 34.1, 0.22],
  ["ambient-crowd-murmur-indoors-1", 389.0, 400.7, 0.08],
  ["ambient-crowd-murmur-indoors-2", 182.0, 183.4, 0.08],
  ["footsteps-fast", 440.4, 443.6, 0.05],
  ["wind-2", 460.8, 462.5, 0.12],
  ["heartbeat", 507.4, 510.0, 0.2],
  ["heartbeat", 614.8, 616.2, 0.2],
  ["rain-1", 162.3, 164.8, 0.08],
  ["thunderstorm-2", 533.0, 535.7, 0.08],
  ["crowd-cheering-children", 46.3, 47.8, 0.035],
  ["ambient-crowd-murmur-2", 120.0, 124.2, 0.07],
];

// one-shots: [time (s), bundle file, gain]
const CUES: [number, string, number][] = [
  // cold open
  [41.9, "hit-dull", 0.22],
  [57.2, "rewind-1", 0.08],
  // Corsica and childhood
  [70.1, "gunshot-crisp", 0.12],
  [70.45, "gunshot-crisp", 0.1],
  [100.3, "laughter-kid", 0.05],
  [112.45, "explosion-distant-1", 0.2],
  [125.8, "hit-dull", 0.14],
  [126.82, "impact-hit-1", 0.16],
  // Toulon and Paris
  [150.2, "impact-hit-2", 0.16],
  [151.8, "explosion-distant-2", 0.2],
  [152.05, "explosion-distant-3", 0.18],
  [161.35, "paper-rattling", 0.12],
  [168.3, "page-turning", 0.1],
  [191.72, "explosion-1", 0.2],
  [191.88, "explosion-distant-4", 0.18],
  [192.1, "scream-group", 0.04],
  [235.15, "impact-hit-3", 0.15],
  // Egypt
  [276.35, "gunshot-large", 0.14],
  [276.5, "gunshot-large-2", 0.12],
  [281.95, "explosion-distant-1", 0.16],
  [282.3, "explosion-distant-2", 0.16],
  [282.95, "explosion-4", 0.26],
  [301.0, "wood-cracking", 0.05],
  [320.2, "door-slam-2", 0.14],
  [321.7, "gasp-male-2", 0.06],
  // empire
  [348.7, "page-turning-2", 0.1],
  [370.0, "gunshot-crisp", 0.12],
  [375.9, "paper-rattling", 0.12],
  [400.15, "applause-large-crowd-1", 0.06],
  [417.5, "impact-hit-4", 0.12],
  [432.72, "gunshot-crisp", 0.12],
  [432.95, "gunshot-9mm-single-2", 0.08],
  // Russia
  [452.6, "explosion-distant-3", 0.14],
  [489.2, "page-turning", 0.06],
  // return and Waterloo
  [510.85, "gasp-male-1", 0.05],
  [515.0, "crowd-cheering-large-1", 0.12],
  [522.75, "thunderstorm-1", 0.12],
  [544.2, "gunshots-rapid-fire", 0.05],
  [547.4, "explosion-distant-4", 0.12],
  // the end
  [605.0, "impact-hit-1", 0.12],
];

const steps = (from: number, to: number, rate: number) => {
  const out: number[] = [];
  for (let t = from; t < to; t += 1 / rate) out.push(t);
  return out;
};
const FOOT: SfxName[] = ["footstep", "footstep2", "footstep3", "footstep4"];
// [from, to, rate, gain]: visible walking
const WALK: [number, number, number, number][] = [
  [17.5, 19.4, 1.8, 0.1],
  [19.5, 20.6, 1.6, 0.08],
  [20.5, 20.95, 1.8, 0.1],
  [162.4, 164.8, 1.6, 0.08],
  [454.0, 456.3, 1.3, 0.08],
  [504.7, 507.3, 1.6, 0.08],
  [517.1, 518.0, 2.2, 0.1],
];
// visible small actions (synth library)
const SYNTH: [number, SfxName, number][] = [
  [29.9, "clang", 0.1],
  [48.3, "scribble", 0.12],
  [84.4, "ding", 0.1],
  [88.9, "stamp", 0.2],
  [104.73, "page_flip", 0.12],
  [105.43, "page_flip2", 0.12],
  [106.9, "page_flip", 0.12],
  [166.6, "scribble", 0.14],
  [184.0, "ding", 0.1],
  [195.4, "clang", 0.1],
  [207.2, "pop", 0.08],
  [208.35, "pop", 0.08],
  [209.45, "pop", 0.08],
  [345.4, "stamp", 0.16],
  [346.2, "stamp", 0.16],
  [347.0, "stamp", 0.16],
  [382.4, "scribble", 0.12],
  [510.6, "clang", 0.1],
  [597.5, "pop", 0.07],
  [598.95, "pop", 0.07],
  [600.1, "pop", 0.07],
];

export const NapoleonSound: React.FC<{ captions: Caption[] }> = ({ captions }) => {
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
