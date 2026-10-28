import React from "react";
import { AbsoluteFill, staticFile, type CalculateMetadataFunction } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { SHOTS, TRANSITION, PAGE_STARTS_MS, placeholderCaptions } from "./script";
import { StyledCaptions } from "../../kit/captions";
import { OnodaSound } from "./sound";
import { OfficeShot, CloseUpShot, IslandShot, NightShot, YearsShot } from "./shots";

const COMPONENTS = {
  office: OfficeShot,
  closeup: CloseUpShot,
  island: IslandShot,
  night: NightShot,
  years: YearsShot,
} as const;

// Transition into each shot (index = shot index). Reference videos use quick
// push-slides between shots and the occasional dip for a time jump.
const INTO: ("slide-left" | "slide-up" | "fade")[] = ["slide-left", "slide-left", "slide-left", "fade", "slide-up"];

export const OnodaVisuals: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <TransitionSeries>
      {SHOTS.flatMap((shot, i) => {
        const C = COMPONENTS[shot.id];
        const seq = (
          <TransitionSeries.Sequence key={shot.id} durationInFrames={shot.dur} premountFor={15}>
            <C dur={shot.dur} />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        const kind = INTO[i];
        const presentation =
          kind === "fade" ? fade() : slide({ direction: kind === "slide-up" ? "from-bottom" : "from-right" });
        return [
          <TransitionSeries.Transition key={`t${i}`} presentation={presentation} timing={linearTiming({ durationInFrames: TRANSITION })} />,
          seq,
        ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);

export type OnodaProps = {
  /** Voiceover path inside public/, e.g. "vo/onoda.mp3". Null = no VO yet. */
  voiceover: string | null;
  /** Word-level captions JSON inside public/ (from scripts/transcribe.mjs). Null = placeholder timings. */
  captionsFile: string | null;
  /** Filled in by calculateMetadata from `captionsFile`. */
  captions?: Caption[] | null;
  /** Extra words to color red. */
  highlights: string[];
};

export const calculateOnodaMetadata: CalculateMetadataFunction<OnodaProps> = async ({ props }) => {
  if (!props.captionsFile) return { props: { ...props, captions: null } };
  const res = await fetch(staticFile(props.captionsFile));
  const captions = (await res.json()) as Caption[];
  return { props: { ...props, captions } };
};

export const OnodaEpisode: React.FC<OnodaProps> = ({ voiceover, captions, highlights }) => {
  const words = captions ?? placeholderCaptions();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OnodaVisuals />
      <StyledCaptions captions={words} pageStartsMs={captions ? undefined : PAGE_STARTS_MS} highlights={highlights} />
      <OnodaSound captions={words} voiceover={Boolean(voiceover)} />
      {voiceover ? <Audio src={staticFile(voiceover)} /> : null}
    </AbsoluteFill>
  );
};
