import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Bed, Sfx, SoundAt, licensedSrc, duckFromCaptions, type SfxName } from "../../kit/audio";
import { CUTS } from "./timeline";
import { END } from "./script";

// Sound design for "Spring 1945".
// Voice-first: no music, no musical stingers. One-shots come from the licensed
// Essential Sound Effects Bundle (node scripts/import-sfx.mjs <bundle.zip>),
// beds from the synthesized library (npm run audio). Everything ducks under the
// narration. The kamikaze/death beats stay nearly dry on purpose.

const E = (name: string) => licensedSrc("essential", name);

const AMB = 0.42;
const FX = 0.9;
const FX_DUCK = 0.55; // -5 dB under speech
const AMB_DUCK = 0.5; // -6 dB under speech

// [time (s), bundle file, gain]
const CUES: [number, string, number][] = [
  // ── A · cold open: the airfield
  [0.2, "wind-1", 0.35],
  [7.4, "ratcheting", 0.3],
  [8.85, "thump", 0.5],
  [8.9, "gun-loading", 0.25],
  [9.4, "water-ocean-wave", 0.35],
  [9.9, "horn-boat", 0.15],
  [11.0, "swish-1", 0.3],
  [11.82, "stamp", 0.55],
  [14.6, "swish-2", 0.25],
  [15.45, "press", 0.4],
  [19.2, "pop-2", 0.25],
  [19.4, "pop-3", 0.25],
  [20.27, "hit-single", 0.55],
  [20.3, "stamp", 0.45],
  // ── B · the question
  [21.3, "rumble-soft", 0.4],
  [24.9, "pop-1", 0.3],
  [28.4, "paper-rattling", 0.3],
  [31.6, "pop-2", 0.25],
  [35.2, "impact-hit-1", 0.3],
  [37.1, "swoosh", 0.3],
  // ── C · the drug
  [39.0, "page-turning", 0.4],
  [39.22, "pop-1", 0.25],
  [42.4, "pop-3", 0.25],
  [44.55, "sparkle", 0.45],
  [45.6, "cricket-chirp-single", 0.5],
  [47.79, "pop-2", 0.25],
  [52.65, "impact-hit-2", 0.4],
  [54.4, "pop-2", 0.25],
  [57.3, "yawn", 0.3],
  [58.6, "whoosh-rattle", 0.3],
  [61.5, "ding-single-1", 0.2],
  [64.6, "pop-1", 0.25],
  [68.8, "fly-by-low", 0.35],
  [70.7, "creak-short", 0.3],
  // ── D · the tokko
  [75.3, "page-turning-2", 0.4],
  [77.8, "whoosh-low-distant", 0.4],
  [78.43, "stamp", 0.45],
  [78.5, "explosion-distant-1", 0.2],
  [81.1, "thump", 0.6],
  [81.12, "stamp", 0.35],
  [82.69, "pop-1", 0.3],
  [83.25, "pop-2", 0.3],
  [84.2, "swoosh", 0.3],
  [85.07, "pop-3", 0.3],
  [85.45, "explosion-distant-2", 0.3],
  [86.2, "wind-2", 0.45],
  [92.05, "snap", 0.25],
  [95.58, "pop-1", 0.2],
  [95.83, "pop-2", 0.2],
  [96.08, "pop-3", 0.2],
  [96.33, "pop-4", 0.2],
  [97.9, "fly-by-wobbly", 0.45],
  [100.3, "fly-by-low", 0.25],
  [101.68, "pop-2", 0.25],
  [103.33, "pop-1", 0.3],
  [106.0, "yawn", 0.3],
  [107.39, "stamp", 0.55],
  [107.4, "hit-dull", 0.3],
  [109.2, "pop-3", 0.3],
  // ── E · clue 1: the chocolate
  [110.77, "stamp", 0.5],
  [112.31, "pop-1", 0.2],
  [112.76, "pop-2", 0.25],
  [114.5, "pop-3", 0.2],
  [116.06, "pop-1", 0.2],
  [122.73, "pop-2", 0.25],
  [127.1, "paper-rattling", 0.4],
  [127.8, "crumple", 0.2],
  [130.0, "swish-3", 0.3],
  [132.4, "stamp", 0.6],
  [132.42, "thump", 0.3],
  [133.07, "sparkle", 0.35],
  [136.5, "laughter-female-2", 0.15],
  [139.5, "snap", 0.4],
  [141.25, "whoosh-powerful", 0.35],
  [144.7, "pop-2", 0.25],
  [147.4, "pop-1", 0.2],
  [149.0, "whoosh-low-distant", 0.3],
  [155.31, "pop-1", 0.3],
  [155.4, "shimmer-creepy", 0.18],
  [156.4, "page-turning", 0.35],
  [156.9, "stamp", 0.55],
  [159.1, "page-turning-2", 0.2],
  // ── F · clue 2: the needle
  [164.59, "stamp", 0.5],
  [166.06, "sparkle", 0.3],
  [167.52, "pop-3", 0.2],
  [169.26, "pop-1", 0.2],
  [170.82, "pop-2", 0.2],
  [172.6, "fly-by-low", 0.2],
  [175.4, "explosion-distant-1", 0.35],
  [175.6, "gunshots-machine-gun", 0.1],
  [175.9, "explosion-distant-3", 0.3],
  [176.5, "explosion-distant-2", 0.3],
  [178.09, "stamp", 0.45],
  [178.15, "snap", 0.2],
  [180.0, "press", 0.3],
  [182.6, "pop-5", 0.18],
  [182.84, "pop-5", 0.18],
  [183.08, "pop-5", 0.18],
  [185.0, "pop-2", 0.25],
  [186.9, "swish-1", 0.25],
  [187.3, "press", 0.4],
  [192.79, "hit-single", 0.45],
  [204.64, "pop-1", 0.2],
  [208.45, "impact-hit-3", 0.5],
  // ── G · the myth
  [211.37, "swish-2", 0.3],
  [211.97, "pop-2", 0.25],
  [213.5, "stamp", 0.6],
  [213.52, "hit-double", 0.3],
  [215.74, "pop-1", 0.2],
  [216.1, "swish-slicing", 0.35],
  [217.66, "pop-3", 0.2],
  [217.75, "snap", 0.5],
  [217.8, "twang-1", 0.25],
  [219.08, "pop-1", 0.25],
  [219.76, "pop-2", 0.25],
  [220.57, "impact-hit-1", 0.35],
  [223.1, "whoosh-powerful", 0.35],
  [223.3, "thump", 0.4],
  [225.95, "pop-1", 0.2],
  [227.12, "pop-2", 0.2],
  [230.19, "pop-3", 0.2],
  [230.88, "pop-1", 0.2],
  [232.2, "fly-by-low", 0.3],
  [233.55, "pop-3", 0.3],
  [238.75, "rattle", 0.4],
  [239.8, "fly-by-low", 0.3],
  [241.53, "rattle", 0.35],
  [242.5, "whoosh-powerful", 0.35],
  [244.74, "stamp", 0.5],
  [244.8, "impact-hit-2", 0.35],
  // ── H · the second war
  [247.6, "whoosh-rebound", 0.35],
  [249.84, "pop-1", 0.2],
  [252.45, "pop-1", 0.2],
  [252.7, "pop-2", 0.2],
  [252.95, "pop-3", 0.2],
  [255.06, "stamp", 0.5],
  [256.93, "pop-2", 0.25],
  [257.95, "pop-1", 0.2],
  [258.78, "pop-2", 0.2],
  [259.68, "pop-3", 0.2],
  [265.0, "ratcheting", 0.25],
  [267.38, "pop-1", 0.2],
  [269.3, "hit-dull", 0.35],
  [271.19, "pop-2", 0.25],
  [273.58, "stamp", 0.6],
  [273.6, "hit-single", 0.45],
  [275.6, "explosion-distant-3", 0.2],
  [277.4, "whistle-referee-1", 0.2],
  [277.45, "stamp", 0.35],
  // ── I · Kambara's wish
  [285.53, "pop-1", 0.15],
  [287.85, "pop-2", 0.15],
  [289.2, "paper-rattling", 0.25],
  [294.05, "water-drip-single", 0.5],
  [294.5, "swish-3", 0.15],
  // ── J · outro
  [298.44, "pop-2", 0.25],
  [301.07, "pop-1", 0.2],
  [302.54, "pop-3", 0.25],
  [303.6, "pop-1", 0.3],
  [303.8, "pop-2", 0.3],
  [304.0, "pop-3", 0.3],
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
  ["wind", 0, 9.2, 0.35],
  ["waves", 9.2, 10.8, 0.5],
  ["wind", 10.8, 25.5, 0.38],
  ["room_tone", 25.5, 38.95, 0.3],
  ["room_tone", 38.95, 46.9, 0.5],
  ["clock", 38.95, 46.9, 0.25],
  ["room_tone", 51.8, 68.7, 0.4],
  ["wind", 68.7, 72.1, 0.4],
  ["clock", 74.85, 77.55, 0.4],
  ["battle_distant", 77.55, 79.45, 0.3],
  ["room_tone", 79.45, 86.1, 0.5],
  ["wind", 86.1, 104.7, 0.4],
  ["waves", 104.7, 108.65, 0.4],
  ["room_tone", 108.65, 115.8, 0.45],
  ["wind", 115.8, 121.35, 0.3],
  ["room_tone", 121.35, 150.72, 0.45],
  ["wind", 150.72, 154.6, 0.35],
  ["room_tone", 154.6, 161.15, 0.4],
  ["fire", 161.15, 163.95, 0.4],
  ["room_tone", 163.95, 172.3, 0.45],
  ["wind", 172.3, 175.0, 0.35],
  ["battle_distant", 175.0, 176.85, 0.5],
  ["waves", 175.0, 176.85, 0.35],
  ["room_tone", 176.85, 178.65, 0.45],
  ["wind", 178.65, 181.5, 0.35],
  ["room_tone", 181.5, 187.95, 0.4],
  ["wind", 187.95, 190.85, 0.3],
  ["room_tone", 190.85, 198.4, 0.4],
  ["wind", 198.4, 204.15, 0.35],
  ["room_tone", 204.15, 209.6, 0.4],
  ["clock", 204.15, 208.3, 0.3],
  ["room_tone", 209.6, 222.2, 0.35],
  ["wind", 222.2, 234.75, 0.35],
  ["room_tone", 234.75, 236.7, 0.35],
  ["wind", 236.7, 242.4, 0.35],
  ["room_tone", 242.4, 254.25, 0.4],
  ["fire", 254.25, 255.75, 0.4],
  ["wind", 255.75, 263.75, 0.35],
  ["room_tone", 263.75, 268.85, 0.35],
  ["wind", 268.85, 270.95, 0.3],
  ["room_tone", 270.95, 290.85, 0.38],
  ["clock", 278.95, 284.9, 0.25],
  ["wind", 290.85, 296.05, 0.25],
  ["waves", 296.05, 297.4, 0.45],
  ["wind", 297.4, 298.95, 0.3],
  ["room_tone", 298.95, END, 0.3],
];

export const Spring1945Sound: React.FC<{ captions: Caption[] }> = ({ captions }) => {
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
      <Bed src={E("bird-singing")} from={0} to={9.2} volume={0.18 * AMB} gainAt={ambDuck} name="amb:birds" />
      <Bed src={E("bird-singing")} from={115.8} to={121.35} volume={0.25 * AMB} gainAt={ambDuck} name="amb:birds" />
      <Bed src={E("bird-singing")} from={172.3} to={175.0} volume={0.2 * AMB} gainAt={ambDuck} name="amb:birds" />
      <Bed src={E("bird-chirping")} from={278.95} to={284.9} volume={0.15 * AMB} gainAt={ambDuck} name="amb:birds" />
      <Bed src={E("bird-singing")} from={290.85} to={297.4} volume={0.2 * AMB} gainAt={ambDuck} name="amb:birds" />
      <Bed src={E("ambient-crowd-murmur-1")} from={46.9} to={51.8} volume={0.35 * AMB} gainAt={ambDuck} name="amb:street" />
      <Bed src={E("crickets-chirping-country-night")} from={68.7} to={72.1} volume={0.25 * AMB} gainAt={ambDuck} name="amb:crickets" />
      <Bed src={E("machinery-1")} from={72.1} to={74.85} volume={0.3 * AMB} gainAt={ambDuck} name="amb:factory" />
      <Bed src={E("machinery-2")} from={123.55} to={126.5} volume={0.22 * AMB} gainAt={ambDuck} name="amb:factory" />
      <Bed src={E("ambient-crowd-murmur-indoors-1")} from={123.55} to={135.5} volume={0.22 * AMB} gainAt={ambDuck} name="amb:girls" />
      <Bed src={E("crickets-chirping-country-night")} from={161.15} to={163.95} volume={0.25 * AMB} gainAt={ambDuck} name="amb:crickets" />
      <Bed src={E("footsteps-fast")} from={226.55} to={227.85} volume={0.25 * AMB} gainAt={ambDuck} name="amb:drill" />
      <Bed src={E("crowd-cheering-large-1")} from={227.85} to={231.85} volume={0.2 * AMB} gainAt={ambDuck} name="amb:sendoff" />
      <Bed src={E("static-1")} from={248.7} to={251.45} volume={0.2 * AMB} gainAt={ambDuck} name="amb:radio" />
      <Bed src={E("crickets-chirping-country-night")} from={254.25} to={255.75} volume={0.25 * AMB} gainAt={ambDuck} name="amb:crickets" />
      <Bed src={E("ambient-crowd-murmur-2")} from={255.75} to={263.75} volume={0.3 * AMB} gainAt={ambDuck} name="amb:market" />
      <Bed src={E("crickets-chirping-country-night")} from={268.85} to={270.95} volume={0.22 * AMB} gainAt={ambDuck} name="amb:crickets" />
      <Bed src={E("water-ocean-wave")} from={296.05} to={297.4} volume={0.3 * AMB} gainAt={ambDuck} name="amb:sea" />

      {/* footsteps */}
      {steps(12.6, 13.8, 2.2).map((t, i) => (
        <Sfx key={`s1${t}`} name={FOOT[i % 4]} at={t} volume={0.16 * FX} duck={fxDuck} />
      ))}
      {steps(116.0, 120.6, 2.0).map((t, i) => (
        <Sfx key={`s2${t}`} name={FOOT[i % 4]} at={t} volume={0.12 * FX} duck={fxDuck} />
      ))}
      {steps(235.8, 236.3, 3).map((t, i) => (
        <Sfx key={`s3${t}`} name={FOOT[i % 4]} at={t} volume={0.14 * FX} duck={fxDuck} />
      ))}
      {steps(236.7, 239.6, 2.6).map((t, i) => (
        <Sfx key={`s4${t}`} name={FOOT[i % 4]} at={t} volume={0.14 * FX} duck={fxDuck} />
      ))}
      {steps(254.3, 255.75, 2.2).map((t, i) => (
        <Sfx key={`s5${t}`} name={FOOT[i % 4]} at={t} volume={0.12 * FX} duck={fxDuck} />
      ))}
      {/* "again and again": a plunger press on every beat */}
      {steps(188.13, 190.8, 1 / 0.42).map((t, i) => (
        <SoundAt key={`p${i}`} src={E("press")} at={t} volume={0.18 * FX} duck={fxDuck} name="press" />
      ))}
      {/* tally marks */}
      {steps(191.1, 192.8, 4).map((t) => (
        <Sfx key={`sc${t}`} name="scribble" at={t} volume={0.18 * FX} duck={fxDuck} />
      ))}
      {/* brush strokes of the poem */}
      {steps(289.3, 290.6, 3).map((t) => (
        <Sfx key={`br${t}`} name="scribble" at={t} volume={0.12 * FX} duck={fxDuck} />
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
