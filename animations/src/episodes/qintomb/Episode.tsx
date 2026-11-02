import React from "react";
import { AbsoluteFill, Series, staticFile, type CalculateMetadataFunction } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { CameraAdjustContext } from "../../kit";
import { StyledCaptions } from "../../kit/captions";
import { shotTimeline, TRANSITION, markHighlights, END1, END2, FULL1 } from "./script";
import { CUTS1 } from "./timeline1";
import { CUTS2 } from "./timeline2";
import { QinTombSound } from "./sound";
import { FRAMING } from "./framing";

// The First Emperor's tomb. One narration, built as two halves (part 1 ends on
// "…every trap and every treasure is.") and delivered as one full video with no
// on-screen captions (subtitles ship as an .srt).

export const QinTombVisuals: React.FC<{ part: 1 | 2 }> = ({ part }) => {
  const timeline = shotTimeline(part === 1 ? CUTS1 : CUTS2, part === 1 ? END1 : END2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {timeline.flatMap((shot, i) => {
          const C = shot.C;
          const seq = (
            <TransitionSeries.Sequence key={shot.id} durationInFrames={shot.dur} premountFor={20} name={shot.id}>
              <CameraAdjustContext.Provider value={shot.cam ?? FRAMING[shot.id] ?? {}}>
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

const loadCaptions = async (file: string, part: 1 | 2) => {
  const res = await fetch(staticFile(file));
  return markHighlights((await res.json()) as Caption[], part);
};

export type QinTombProps = {
  part: 1 | 2;
  voiceover: string;
  captionsFile: string;
  captions?: Caption[] | null;
  withVoice?: boolean;
  /** Burned-in captions (off: the user wants none on screen). */
  showCaptions?: boolean;
};

export const calculateQinTombMetadata: CalculateMetadataFunction<QinTombProps> = async ({ props }) => ({
  props: { ...props, captions: await loadCaptions(props.captionsFile, props.part) },
});

export const QinTomb: React.FC<QinTombProps> = ({ part, voiceover, captions, showCaptions = false }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <QinTombVisuals part={part} />
    {showCaptions ? <StyledCaptions captions={captions ?? []} maxWords={4} size={0.055} /> : null}
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

// ───────────────────────── the full video ─────────────────────────

export const FULL_FRAMES = { p1: Math.round(FULL1 * 30), p2: Math.round(END2 * 30) };

export type QinTombFullProps = {
  captions1?: Caption[] | null;
  captions2?: Caption[] | null;
  visuals?: boolean;
  audio?: boolean;
  withVoice?: boolean;
};

export const calculateQinTombFullMetadata: CalculateMetadataFunction<QinTombFullProps> = async ({ props }) => ({
  props: {
    ...props,
    captions1: await loadCaptions("captions/qin-tomb-1.json", 1),
    captions2: await loadCaptions("captions/qin-tomb-2.json", 2),
  },
});

const Half: React.FC<{ part: 1 | 2; captions: Caption[]; visuals: boolean; audio: boolean; withVoice: boolean }> = ({ part, captions, visuals, audio, withVoice }) => (
  <>
    {visuals ? <QinTombVisuals part={part} /> : null}
    {audio ? <QinTombSound captions={captions} part={part} /> : null}
    {audio && withVoice ? <Audio src={staticFile(`vo/qin-tomb-${part}.voice.m4a`)} /> : null}
  </>
);

export const QinTombFull: React.FC<QinTombFullProps> = ({ captions1, captions2, visuals = true, audio = true, withVoice = true }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence durationInFrames={FULL_FRAMES.p1} name="first half">
        <Half part={1} captions={captions1 ?? []} visuals={visuals} audio={audio} withVoice={withVoice} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={FULL_FRAMES.p2} name="second half">
        <Half part={2} captions={captions2 ?? []} visuals={visuals} audio={audio} withVoice={withVoice} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
