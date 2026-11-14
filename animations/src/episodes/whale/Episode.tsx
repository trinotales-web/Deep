import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, type CalculateMetadataFunction } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { CameraAdjustContext, type CameraAdjust } from "../../kit";
import { shotTimeline, TRANSITION, END } from "./script";
import { CUTS } from "./timeline";
import { WhaleSound } from "./sound";

// Why is the blue whale so big? One 16:9 video (no on-screen captions;
// subtitles ship as .srt).

/** Per-shot camera on top of each shot's own move: a gentle extra push-in and hard punch-in cuts. */
const ShotCam: React.FC<{ cam?: CameraAdjust; dur: number; start: number; punch?: [number, number, number, number][]; children: React.ReactNode }> = ({ cam, dur, start, punch, children }) => {
  const frame = useCurrentFrame();
  const t = (start + frame) / 30;
  const k = Math.min(1, frame / Math.max(1, dur));
  let z = (cam?.z ?? 1) * (1 + 0.05 * k * k * (3 - 2 * k));
  let x = cam?.x ?? 0;
  let y = cam?.y ?? 0;
  const active = (punch ?? []).filter(([at]) => t >= at).pop();
  if (active && active[1] !== 1) {
    const [, pz, fx, fy] = active;
    const zs = 1.05 * (cam?.z ?? 1);
    x += ((fx - 0.5) * 1920 * 0.8) / zs;
    y += ((0.5 - fy) * 1080 * 0.8) / zs;
    z *= pz;
  }
  return <CameraAdjustContext.Provider value={{ z, x, y }}>{children}</CameraAdjustContext.Provider>;
};

export const WhaleVisuals: React.FC = () => {
  const timeline = shotTimeline(CUTS, END);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {timeline.flatMap((shot, i) => {
          const C = shot.C;
          const seq = (
            <TransitionSeries.Sequence key={shot.id} durationInFrames={Math.max(1, shot.dur)} premountFor={20} name={shot.id}>
              <ShotCam cam={shot.cam} dur={shot.dur} start={shot.from} punch={shot.punch}>
                <C dur={shot.dur} start={shot.from} />
              </ShotCam>
            </TransitionSeries.Sequence>
          );
          if (i === 0 || shot.into !== "fade") return [seq];
          return [<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />, seq];
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export type WhaleProps = { captions?: Caption[] | null; visuals?: boolean; audio?: boolean; withVoice?: boolean };

export const calculateWhaleMetadata: CalculateMetadataFunction<WhaleProps> = async ({ props }) => {
  const res = await fetch(staticFile("captions/whale.json"));
  return { props: { ...props, captions: (await res.json()) as Caption[] } };
};

export const Whale: React.FC<WhaleProps> = ({ captions, visuals = true, audio = true, withVoice = true }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {visuals ? <WhaleVisuals /> : null}
    {audio ? <WhaleSound captions={captions ?? []} /> : null}
    {audio && withVoice ? <Audio src={staticFile("vo/whale.tight.voice.m4a")} /> : null}
  </AbsoluteFill>
);
