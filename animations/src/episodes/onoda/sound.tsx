import React from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Sfx, Ambience, Music, duckFromCaptions, type SfxName } from "../../kit/audio";
import { FPS, TOTAL_FRAMES, shotStart } from "./script";
import { FLIP_END, FLIP_PAGES, FLIP_START, YEARS_HIT } from "./shots";

// Sound design cue sheet. Layering follows the references: a constant music
// bed, a room/ambience bed per location, whooshes on every cut, hits on the
// key words, small foley on character actions.

const s = (frame: number) => frame / FPS;

export const OnodaSound: React.FC<{ captions: Caption[]; voiceover: boolean }> = ({ captions, voiceover }) => {
  const { fps } = useVideoConfig();
  const end = s(TOTAL_FRAMES);
  const tOffice = s(shotStart("office"));
  const tClose = s(shotStart("closeup"));
  const tIsland = s(shotStart("island"));
  const tNight = s(shotStart("night"));
  const tYears = s(shotStart("years"));
  const hit = tYears + s(YEARS_HIT);

  // page flips accelerate (same curve as the visuals)
  const flips: number[] = [];
  for (let k = 1; k <= FLIP_PAGES; k++) flips.push(tYears + s(FLIP_START + (FLIP_END - FLIP_START) * Math.sqrt(k / FLIP_PAGES)));

  // footsteps while walking on the beach (2.2 steps / s)
  const steps: number[] = [];
  for (let t = tIsland + 0.15; t < tNight - 0.2; t += 1 / 2.2) steps.push(t);

  const duck = voiceover ? duckFromCaptions(captions, fps, 0.4) : undefined;
  // dramatic drop-out: "But nobody tells him."
  const automation = (f: number) => {
    const t = f / fps;
    if (t > 13.0 && t < hit - 2.2) return 0.15;
    if (t >= hit - 2.2 && t < hit) return 0.15 + 0.85 * ((t - (hit - 2.2)) / 2.2);
    return 1;
  };

  return (
    <>
      <Music name="tension" from={0} to={end} volume={voiceover ? 0.32 : 0.26} fadeIn={0.2} fadeOut={1.4} duck={duck} automation={automation} />

      {/* office */}
      <Ambience name="clock" from={tOffice} to={tClose + 0.3} volume={0.55} fadeIn={0.1} fadeOut={0.3} />
      <Sfx name="swish" at={tOffice + 0.72} volume={0.35} />
      <Sfx name="pop" at={tOffice + 0.95} volume={0.25} />
      <Sfx name="stamp" at={tOffice + 3.45} volume={0.45} />

      {/* close-up: NEVER SURRENDER */}
      <Sfx name="whoosh_fast" at={tClose - 0.12} volume={0.55} />
      <Sfx name="impact" at={tClose + 0.13} volume={0.85} />
      <Sfx name="braam" at={tClose + 0.13} volume={0.55} />

      {/* island */}
      <Sfx name="whoosh" at={tIsland - 0.2} volume={0.5} />
      <Ambience name="waves" from={tIsland} to={tNight + 0.4} volume={0.7} fadeIn={0.3} fadeOut={0.4} />
      <Ambience name="wind" from={tIsland} to={tNight + 0.4} volume={0.25} />
      {steps.map((t, i) => (
        <Sfx key={t} name={(["footstep", "footstep2", "footstep3", "footstep4"] as SfxName[])[i % 4]} at={t} volume={0.22} />
      ))}

      {/* night */}
      <Sfx name="whoosh_soft" at={tNight - 0.25} volume={0.4} />
      <Ambience name="jungle_night" from={tNight} to={tYears + 0.3} volume={0.7} fadeIn={0.5} fadeOut={0.3} />
      <Ambience name="fire" from={tNight} to={tYears + 0.3} volume={0.6} fadeIn={0.5} fadeOut={0.3} />
      <Sfx name="thud" at={12.45} volume={0.35} />
      <Sfx name="sting" at={tNight + s(95)} volume={0.65} />

      {/* years */}
      <Sfx name="whoosh" at={tYears - 0.2} volume={0.5} />
      <Ambience name="room_tone" from={tYears} to={end} volume={0.6} />
      {flips.map((t, i) => (
        <Sfx key={t} name={i % 2 ? "page_flip2" : "page_flip"} at={t} volume={0.32} rate={1 + (i / FLIP_PAGES) * 0.25} />
      ))}
      <Sfx name="riser" at={hit - 2.2} volume={0.5} />
      <Sfx name="impact2" at={hit} volume={0.95} />
      <Sfx name="braam" at={hit} volume={0.6} />
      <Sfx name="stamp" at={hit} volume={0.5} />
    </>
  );
};
