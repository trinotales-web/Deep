import React from "react";
import { AbsoluteFill, staticFile, type CalculateMetadataFunction } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { CameraAdjustContext } from "../../kit";
import { shotTimeline, TRANSITION, END1, END2 } from "./script";
import { CUTS1 } from "./timeline1";
import { CUTS2 } from "./timeline2";
import { MayaSound } from "./sound";

// The Maya story in two videos (no on-screen captions; subtitles ship as .srt).

export const MayaVisuals: React.FC<{ part: 1 | 2 }> = ({ part }) => {
  const timeline = shotTimeline(part === 1 ? CUTS1 : CUTS2, part === 1 ? END1 : END2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {timeline.flatMap((shot, i) => {
          const C = shot.C;
          const seq = (
            <TransitionSeries.Sequence key={shot.id} durationInFrames={Math.max(1, shot.dur)} premountFor={20} name={shot.id}>
              <CameraAdjustContext.Provider value={shot.cam ?? {}}>
                <C dur={shot.dur} start={shot.from} />
              </CameraAdjustContext.Provider>
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

export type MayaProps = { part: 1 | 2; captions?: Caption[] | null; visuals?: boolean; audio?: boolean; withVoice?: boolean };

export const calculateMayaMetadata: CalculateMetadataFunction<MayaProps> = async ({ props }) => {
  const res = await fetch(staticFile(`captions/maya-${props.part}.json`));
  return { props: { ...props, captions: (await res.json()) as Caption[] } };
};

export const Maya: React.FC<MayaProps> = ({ part, captions, visuals = true, audio = true, withVoice = true }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {visuals ? <MayaVisuals part={part} /> : null}
    {audio ? <MayaSound captions={captions ?? []} part={part} /> : null}
    {audio && withVoice ? <Audio src={staticFile(`vo/maya-${part}.voice.m4a`)} /> : null}
  </AbsoluteFill>
);
