import React from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Sfx, SoundAt, licensedSrc, duckFromCaptions, type SfxName } from "../../kit/audio";
import { CUTS, END } from "./script";

// Sound design for "The Wooden Wall".
// One-shots come from the licensed Essential Sound Effects Bundle
// (node scripts/import-sfx.mjs <bundle.zip>); beds come from the synthesized
// library (npm run audio). Gains were set from each file's measured level
// (mean volume) so hits sit just under the voice.

const E = (name: string) => licensedSrc("essential", name);

// Voice-first mix: no music bed. Effects and ambience sit well under the
// processed narration (public/vo/*.voice.m4a, -16 LUFS) and duck further
// while a word is being spoken. Target: whole bed ≥ 10 dB under the voice
// (measure with WoodenWallAudioOnly, withVoice: false).
const AMB = 0.35;
const FX = 0.75;
const FX_DUCK = 0.55; // -5 dB under speech
const AMB_DUCK = 0.5; // -6 dB under speech

// [time (s), bundle file, gain]
const CUES: [number, string, number][] = [
  // hook / killed
  [3.12, "impact-hit-1", 0.4],
  [3.98, "braam-1", 0.25],
  [3.2, "wood-cracking", 0.2],
  // army marching on Athens
  [4.9, "drums-2", 0.22],
  [6.95, "drums-1", 0.3],
  [8.8, "drums-2", 0.25],
  // Xerxes
  [10.12, "braam-2", 0.12],
  [10.12, "impact-hit-4", 0.38],
  // Delphi
  [11.05, "shimmer-creepy", 0.4],
  [13.9, "harp-glissando-horror", 1.0],
  [15.7, "page-turning", 0.6],
  [16.12, "pop-1", 0.25],
  // question
  [18.8, "pop-3", 0.35],
  // ships idea
  [21.05, "ding-single-bright", 0.3],
  // empty city
  [24.1, "wind-1", 0.9],
  // stay / literal
  [27.75, "hit-single", 0.45],
  [30.12, "hit-dull", 0.7],
  // build: hammer hits + door
  [35.18, "pounding-three-hits", 0.75],
  [36.83, "pounding-three-hits", 0.75],
  [36.0, "creak-short", 0.5],
  [37.4, "door-closing-1", 0.5],
  // Persians across
  [38.2, "drums-1", 0.45],
  [39.4, "ambient-crowd-murmur-1", 0.7],
  // fire arrows: draw, release, flight
  [40.6, "creak-short", 0.35],
  [41.55, "twang-2", 0.8],
  [41.6, "whoosh-sizzling", 0.6],
  [42.9, "whoosh-sizzling", 0.6],
  [43.35, "air-blowing", 0.6],
  [44.55, "whoosh-sizzling", 0.55],
  [45.25, "whiz-hit", 0.8],
  [45.55, "sizzle", 0.35],
  [45.85, "hit-double", 0.5],
  // dry wall
  [46.6, "creak-short", 0.55],
  [47.9, "wood-cracking-2", 0.3],
  // wrap + light + shoot
  [49.6, "paper-rattling", 1.0],
  [51.85, "sizzle", 0.5],
  [51.9, "whoosh-fast-short", 0.35],
  [52.86, "twang-1", 0.5],
  [52.92, "twang-3", 0.4],
  [52.98, "twang-2", 0.35],
  [53.0, "whoosh-sizzling", 0.4],
  [53.15, "whoosh-sizzling", 0.3],
  // the wooden wall burns
  [53.7, "whiz-hit", 0.6],
  [53.85, "whiz-hit", 0.5],
  [54.39, "impact-hit-2", 0.6],
  [54.39, "braam-1", 0.32],
  [54.6, "wood-cracking", 0.35],
  // don't give up
  [55.5, "drums-2", 0.25],
  [56.1, "grunt", 0.5],
  // rocks
  [57.2, "rumble-soft", 1.0],
  [58.0, "scream-group", 0.35],
  [58.75, "crash-1", 0.6],
  [59.65, "crash-4", 0.55],
  // the cliff
  [61.6, "wind-2", 0.7],
  // nobody guarded it
  [65.3, "pop-2", 0.3],
  // they see enemies
  [66.74, "impact-hit-4", 0.7],
  [66.76, "gasp-male-1", 0.9],
  // jump / run
  [68.25, "whoosh-powerful", 0.45],
  [69.4, "footsteps-fast", 1.0],
  [70.3, "door-slam-2", 0.55],
  // the Acropolis burns
  [71.2, "hit-fade-out", 0.7],
  [72.9, "explosion-distant-1", 0.18],
  // remember the ships
  [74.0, "whoosh-4", 0.45],
  [74.4, "water-ocean-wave", 1.0],
  [75.7, "page-turning-2", 1.0],
  // Salamis: ram and smash
  [77.8, "drums-1", 0.28],
  [79.0, "drums-2", 0.25],
  [80.12, "crash-2", 0.55],
  [80.15, "explosion-1", 0.35],
  [80.15, "wood-cracking", 0.6],
  [80.25, "water-impact-echo", 0.6],
  [80.9, "underwater-bubbles", 0.35],
  // Xerxes watches
  [81.8, "gasp-male-2", 0.9],
  [83.35, "underwater-bubbles", 0.3],
  [83.4, "hit-dull", 0.4],
  // the oracle was right
  [84.45, "harp-glissando", 0.6],
  [84.6, "shimmer-bright", 1.0],
  // saved Athens
  [86.6, "crowd-cheering-large-1", 0.35],
  // just not theirs
  [89.75, "hit-dull", 0.9],
  [89.75, "wood-cracking-2", 0.4],
];

// a whoosh on every slide transition (alternating files), slightly ahead of the cut
const WHOOSHES = ["whoosh-1", "whoosh-2", "whoosh-3", "whoosh-5", "swoosh-fast-1"];
const WHOOSH_GAIN: Record<string, number> = { "whoosh-1": 0.7, "whoosh-2": 0.6, "whoosh-3": 0.6, "whoosh-5": 0.5, "swoosh-fast-1": 0.9 };

// synth footsteps for walking/climbing shots
const steps = (from: number, to: number, rate: number) => {
  const out: number[] = [];
  for (let t = from; t < to; t += 1 / rate) out.push(t);
  return out;
};

export const WoodenWallSound: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const fxDuck = duckFromCaptions(captions, fps, FX_DUCK, 0.12);
  const ambDuck = duckFromCaptions(captions, fps, AMB_DUCK, 0.2);
  const slides = CUTS.filter((c) => c.into !== "cut" && c.at > 0);
  return (
    <>

      {/* location beds */}
      <Ambience name="wind" from={0} to={3.2} volume={0.35 * AMB} gainAt={ambDuck} />
      <Ambience name="fire" from={3.1} to={4.9} volume={0.7 * AMB} gainAt={ambDuck} fadeIn={0.05} />
      <Ambience name="wind" from={4.85} to={9.5} volume={0.4 * AMB} gainAt={ambDuck} />
      <Ambience name="room_tone" from={11.0} to={17.9} volume={0.6 * AMB} gainAt={ambDuck} />
      <Ambience name="waves" from={19.5} to={24.15} volume={0.55 * AMB} gainAt={ambDuck} />
      <Ambience name="wind" from={24.1} to={38.1} volume={0.35 * AMB} gainAt={ambDuck} />
      <Ambience name="wind" from={38.05} to={53.6} volume={0.3 * AMB} gainAt={ambDuck} />
      <Ambience name="fire" from={51.3} to={52.7} volume={0.4 * AMB} gainAt={ambDuck} />
      <Ambience name="fire" from={53.6} to={57.0} volume={0.5 * AMB} gainAt={ambDuck} />
      <Ambience name="fire" from={57.0} to={60.6} volume={0.3 * AMB} gainAt={ambDuck} />
      <Ambience name="wind" from={60.5} to={66.0} volume={0.45 * AMB} gainAt={ambDuck} />
      <Ambience name="fire" from={65.9} to={74.3} volume={0.6 * AMB} gainAt={ambDuck} />
      <Ambience name="battle_distant" from={71.1} to={74.3} volume={0.35 * AMB} gainAt={ambDuck} />
      <Ambience name="waves" from={74.1} to={75.7} volume={0.6 * AMB} gainAt={ambDuck} />
      <Ambience name="waves" from={77.7} to={88.7} volume={0.5 * AMB} gainAt={ambDuck} />
      <Ambience name="wind" from={88.6} to={END} volume={0.4 * AMB} gainAt={ambDuck} fadeOut={1.4} />

      {/* footsteps */}
      {steps(5.0, 9.4, 2.4).map((t, i) => (
        <Sfx key={`a${t}`} name={(["footstep", "footstep2", "footstep3", "footstep4"] as SfxName[])[i % 4]} at={t} volume={0.18 * FX} duck={fxDuck} />
      ))}
      {steps(22.3, 24.0, 2.6).map((t, i) => (
        <Sfx key={`b${t}`} name={(["footstep", "footstep2", "footstep3", "footstep4"] as SfxName[])[i % 4]} at={t} volume={0.16 * FX} duck={fxDuck} />
      ))}
      {steps(31.3, 34.7, 2.8).map((t, i) => (
        <Sfx key={`c${t}`} name={(["footstep", "footstep2", "footstep3", "footstep4"] as SfxName[])[i % 4]} at={t} volume={0.1 * FX} duck={fxDuck} />
      ))}

      {/* transitions */}
      {slides.map((c, i) => {
        const f = WHOOSHES[i % WHOOSHES.length];
        return <SoundAt key={`w${c.at}`} src={E(f)} at={c.at - 0.18} volume={WHOOSH_GAIN[f] * FX} duck={fxDuck} name={`whoosh:${c.id}`} />;
      })}

      {/* cue sheet */}
      {CUES.map(([t, f, g], i) => (
        <SoundAt key={`${i}-${f}`} src={E(f)} at={t} volume={g * FX} duck={fxDuck} name={f} />
      ))}
    </>
  );
};
