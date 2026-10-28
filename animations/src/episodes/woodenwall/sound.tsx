import React from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Music, Sfx, SoundAt, licensedSrc, duckFromCaptions, type SfxName } from "../../kit/audio";
import { CUTS, END } from "./script";

// Sound design for "The Wooden Wall".
// One-shots come from the licensed Essential Sound Effects Bundle
// (node scripts/import-sfx.mjs <bundle.zip>); beds come from the synthesized
// library (npm run audio). Gains were set from each file's measured level
// (mean volume) so hits sit just under the voice.

const E = (name: string) => licensedSrc("essential", name);

// Bus gains: keep the narration ~9 dB above the whole bed (measured with
// the WoodenWallAudioOnly composition, withVoice: false).
const MUSIC = 0.5;
const AMB = 0.4;
const FX = 0.55;

// [time (s), bundle file, gain]
const CUES: [number, string, number][] = [
  // hook / killed
  [0.05, "dramatic-buildup-whip-1", 0.35],
  [3.12, "impact-hit-1", 0.6],
  [3.98, "braam-1", 0.45],
  [3.2, "wood-cracking", 0.35],
  // army marching on Athens
  [4.9, "drums-2", 0.4],
  [6.95, "drums-1", 0.45],
  [8.8, "drums-2", 0.38],
  // Xerxes
  [10.12, "braam-2", 0.22],
  [10.12, "impact-hit-4", 0.6],
  // Delphi
  [11.05, "shimmer-creepy", 0.6],
  [13.9, "harp-glissando-horror", 1.0],
  [14.85, "mystery", 0.45],
  [15.7, "page-turning", 0.6],
  [16.1, "reveal-strings", 1.0],
  [16.12, "pop-1", 0.25],
  // question
  [18.8, "pop-3", 0.35],
  [18.85, "dramatic-cue-1", 0.35],
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
  [52.86, "twang-1", 0.8],
  [52.92, "twang-3", 0.7],
  [52.98, "twang-2", 0.6],
  [53.0, "whoosh-sizzling", 0.7],
  [53.15, "whoosh-sizzling", 0.5],
  // the wooden wall burns
  [53.7, "whiz-hit", 0.6],
  [53.85, "whiz-hit", 0.5],
  [54.39, "impact-hit-2", 0.8],
  [54.39, "braam-1", 0.32],
  [54.6, "wood-cracking", 0.35],
  // don't give up
  [55.5, "drums-2", 0.45],
  [56.1, "grunt", 0.5],
  // rocks
  [57.2, "rumble-soft", 1.0],
  [58.0, "scream-group", 0.35],
  [58.75, "crash-1", 0.6],
  [59.65, "crash-4", 0.55],
  // the cliff
  [60.55, "suspense", 0.3],
  [61.6, "wind-2", 0.7],
  // nobody guarded it
  [65.15, "mystery", 0.5],
  [65.3, "pop-2", 0.3],
  // they see enemies
  [66.74, "impact-hit-4", 0.7],
  [66.76, "gasp-male-1", 0.9],
  [66.8, "dramatic-cue-2", 0.4],
  // jump / run
  [68.25, "whoosh-powerful", 0.45],
  [69.4, "footsteps-fast", 1.0],
  [70.3, "door-slam-2", 0.55],
  // the Acropolis burns
  [71.2, "hit-fade-out", 0.7],
  [72.9, "explosion-distant-1", 0.35],
  // remember the ships
  [74.0, "whoosh-4", 0.45],
  [74.4, "water-ocean-wave", 1.0],
  [75.7, "page-turning-2", 1.0],
  [76.6, "drumroll-1", 0.3],
  // Salamis: ram and smash
  [77.8, "drums-1", 0.42],
  [79.0, "drums-2", 0.42],
  [80.12, "crash-2", 0.8],
  [80.15, "explosion-1", 0.5],
  [80.15, "wood-cracking", 0.6],
  [80.25, "water-impact-echo", 0.6],
  [80.9, "underwater-bubbles", 0.35],
  // Xerxes watches
  [81.8, "gasp-male-2", 0.9],
  [83.35, "underwater-bubbles", 0.3],
  [83.4, "hit-dull", 0.6],
  // the oracle was right
  [84.45, "harp-glissando", 0.6],
  [84.6, "shimmer-bright", 1.0],
  // saved Athens
  [86.6, "crowd-cheering-large-1", 0.35],
  // just not theirs
  [89.4, "stinger-2", 0.9],
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
  const duck = duckFromCaptions(captions, fps, 0.42);
  const slides = CUTS.filter((c) => c.into !== "cut" && c.at > 0);
  return (
    <>
      {/* music beds (ducked under the voice) */}
      <Music name="tension" from={0} to={71.6} volume={0.24 * MUSIC} fadeIn={0.2} fadeOut={1.0} duck={duck} />
      <Music name="somber" from={71.0} to={74.5} volume={0.3 * MUSIC} fadeIn={0.6} fadeOut={0.5} duck={duck} />
      <Music name="epic" from={74.1} to={88.8} volume={0.22 * MUSIC} fadeIn={0.3} fadeOut={1.2} duck={duck} />
      <Music name="somber" from={88.4} to={END} volume={0.3 * MUSIC} fadeIn={0.4} fadeOut={1.4} duck={duck} />

      {/* location beds */}
      <Ambience name="wind" from={0} to={3.2} volume={0.35 * AMB} />
      <Ambience name="fire" from={3.1} to={4.9} volume={0.7 * AMB} fadeIn={0.05} />
      <Ambience name="wind" from={4.85} to={9.5} volume={0.4 * AMB} />
      <Ambience name="room_tone" from={11.0} to={17.9} volume={0.6 * AMB} />
      <Ambience name="waves" from={19.5} to={24.15} volume={0.55 * AMB} />
      <Ambience name="wind" from={24.1} to={38.1} volume={0.35 * AMB} />
      <Ambience name="wind" from={38.05} to={53.6} volume={0.3 * AMB} />
      <Ambience name="fire" from={51.3} to={52.7} volume={0.4 * AMB} />
      <Ambience name="fire" from={53.6} to={57.0} volume={0.5 * AMB} />
      <Ambience name="fire" from={57.0} to={60.6} volume={0.3 * AMB} />
      <Ambience name="wind" from={60.5} to={66.0} volume={0.45 * AMB} />
      <Ambience name="fire" from={65.9} to={74.3} volume={0.6 * AMB} />
      <Ambience name="battle_distant" from={71.1} to={74.3} volume={0.35 * AMB} />
      <Ambience name="waves" from={74.1} to={75.7} volume={0.6 * AMB} />
      <Ambience name="waves" from={77.7} to={88.7} volume={0.5 * AMB} />
      <Ambience name="wind" from={88.6} to={END} volume={0.4 * AMB} fadeOut={1.4} />

      {/* footsteps */}
      {steps(5.0, 9.4, 2.4).map((t, i) => (
        <Sfx key={`a${t}`} name={(["footstep", "footstep2", "footstep3", "footstep4"] as SfxName[])[i % 4]} at={t} volume={0.18 * FX} />
      ))}
      {steps(22.3, 24.0, 2.6).map((t, i) => (
        <Sfx key={`b${t}`} name={(["footstep", "footstep2", "footstep3", "footstep4"] as SfxName[])[i % 4]} at={t} volume={0.16 * FX} />
      ))}
      {steps(31.3, 34.7, 2.8).map((t, i) => (
        <Sfx key={`c${t}`} name={(["footstep", "footstep2", "footstep3", "footstep4"] as SfxName[])[i % 4]} at={t} volume={0.1 * FX} />
      ))}

      {/* transitions */}
      {slides.map((c, i) => {
        const f = WHOOSHES[i % WHOOSHES.length];
        return <SoundAt key={`w${c.at}`} src={E(f)} at={c.at - 0.18} volume={WHOOSH_GAIN[f] * FX} name={`whoosh:${c.id}`} />;
      })}

      {/* cue sheet */}
      {CUES.map(([t, f, g], i) => (
        <SoundAt key={`${i}-${f}`} src={E(f)} at={t} volume={g * FX} name={f} />
      ))}
    </>
  );
};
