import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { JapanAudioProps, JapanPartProps } from "./audioProps";
import { JapanPart1 } from "./Part1";
import { JapanPart2 } from "./Part2";
import { JapanPart3 } from "./Part3";
import { JapanPart4 } from "./Part4";
import { JapanPart5 } from "./Part5";
import { JapanPart6 } from "./Part6";
import { JapanPart7 } from "./Part7";
import { JapanPart8 } from "./Part8";
import timeline from "./storyTimeline.json";

const PARTS: React.FC<JapanPartProps>[] = [JapanPart1, JapanPart2, JapanPart3, JapanPart4, JapanPart5, JapanPart6, JapanPart7, JapanPart8];

export const STORY_DURATION = timeline.duration;

/** Fades a segment in over the overlap, so each join is a short crossfade. */
const FadeIn: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: frames ? Math.min(1, f / frames) : 1 }}>{children}</AbsoluteFill>;
};

/**
 * All eight parts as one film: the opening title only once, no part intros,
 * each part picking up where the last one's narration ends (storyTimeline.json).
 */
export const JapanStory: React.FC<JapanAudioProps> = (props) => (
  <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
    {timeline.segments.map((seg, i) => {
      const Part = PARTS[seg.part - 1];
      return (
        <Sequence key={seg.part} from={seg.at} durationInFrames={seg.to - seg.from} name={`Part ${seg.part}`}>
          <FadeIn frames={i ? timeline.overlap : 0}>
            <Sequence from={-seg.from} layout="none">
              <Part
                {...props}
                skipTitle={i > 0}
                seamless={i < timeline.segments.length - 1}
                musicWindow={[seg.from, seg.to]}
                captionsClearBy={i < timeline.segments.length - 1 ? seg.to - timeline.overlap : undefined}
                introSubtitle={i === 0 ? "the entire history of Japan" : undefined}
              />
            </Sequence>
          </FadeIn>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
