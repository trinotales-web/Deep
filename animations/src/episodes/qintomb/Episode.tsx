import React from "react";
import { AbsoluteFill, staticFile, type CalculateMetadataFunction } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { StyledCaptions } from "../../kit/captions";
import { shotTimeline, TRANSITION, markHighlights, END1, END2 } from "./script";
import { CUTS1 } from "./timeline1";
import { CUTS2 } from "./timeline2";
import { QinTombSound } from "./sound";

export const QinTombVisuals: React.FC<{ part: 1 | 2 }> = ({ part }) => {
  const timeline = shotTimeline(part === 1 ? CUTS1 : CUTS2, part === 1 ? END1 : END2);
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

export type QinTombProps = { part: 1 | 2; voiceover: string; captionsFile: string; captions?: Caption[] | null; withVoice?: boolean };

export const calculateQinTombMetadata: CalculateMetadataFunction<QinTombProps> = async ({ props }) => {
  const res = await fetch(staticFile(props.captionsFile));
  const captions = markHighlights((await res.json()) as Caption[], props.part);
  return { props: { ...props, captions } };
};

export const QinTomb: React.FC<QinTombProps> = ({ part, voiceover, captions }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <QinTombVisuals part={part} />
    <StyledCaptions captions={captions ?? []} maxWords={4} size={0.055} />
    <QinTombSound captions={captions ?? []} part={part} />
    <Audio src={staticFile(voiceover)} />
  </AbsoluteFill>
);

/** Sound only (voiceover + mix) for mix checks and stems. */
export const QinTombAudio: React.FC<QinTombProps> = ({ part, voiceover, captions, withVoice = true }) => (
  <AbsoluteFill>
    <QinTombSound captions={captions ?? []} part={part} />
    {withVoice ? <Audio src={staticFile(voiceover)} /> : null}
  </AbsoluteFill>
);
