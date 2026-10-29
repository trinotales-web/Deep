import React from "react";
import { AbsoluteFill, staticFile, type CalculateMetadataFunction } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { StyledCaptions } from "../../kit/captions";
import { shotTimeline, TRANSITION, markHighlights } from "./script";
import { Spring1945Sound } from "./sound";

export const Spring1945Visuals: React.FC = () => {
  const timeline = shotTimeline();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {timeline.flatMap((shot, i) => {
          const C = shot.C;
          const seq = (
            <TransitionSeries.Sequence key={shot.id} durationInFrames={shot.dur} premountFor={20} name={shot.id}>
              <C dur={shot.dur} start={shot.from} />
            </TransitionSeries.Sequence>
          );
          if (i === 0 || shot.into === "cut") return [seq];
          const presentation = shot.into === "fade" ? fade() : slide({ direction: shot.into === "slide-up" ? "from-bottom" : "from-right" });
          return [<TransitionSeries.Transition key={`t${i}`} presentation={presentation} timing={linearTiming({ durationInFrames: TRANSITION })} />, seq];
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export type Spring1945Props = { voiceover: string; captionsFile: string; captions?: Caption[] | null; withVoice?: boolean };

export const calculateSpring1945Metadata: CalculateMetadataFunction<Spring1945Props> = async ({ props }) => {
  const res = await fetch(staticFile(props.captionsFile));
  const captions = markHighlights((await res.json()) as Caption[]);
  return { props: { ...props, captions } };
};

export const Spring1945: React.FC<Spring1945Props> = ({ voiceover, captions }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Spring1945Visuals />
    <StyledCaptions captions={captions ?? []} maxWords={4} size={0.055} />
    <Spring1945Sound captions={captions ?? []} />
    <Audio src={staticFile(voiceover)} />
  </AbsoluteFill>
);

/** Sound only (voiceover + mix) for fast mix checks. */
export const Spring1945Audio: React.FC<Spring1945Props> = ({ voiceover, captions, withVoice = true }) => (
  <AbsoluteFill>
    <Spring1945Sound captions={captions ?? []} />
    {withVoice ? <Audio src={staticFile(voiceover)} /> : null}
  </AbsoluteFill>
);
