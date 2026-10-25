import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { C, Defs, PaperOverlay, clamp } from "./style";

loadFont({ family: "Patrick Hand", url: staticFile("storybook/fonts/patrick-hand.woff2") });
loadFont({ family: "Klee One", url: staticFile("storybook/fonts/klee-one-haiku.woff2"), weight: "600" });

const FADE = 10;

// Absolute story time (seconds) inside a <Sequence>.
export const useStoryTime = (start) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return start + frame / fps;
};

export const zoomTo = (s, cx, cy) => `translate(540 540) scale(${s}) translate(${-cx} ${-cy})`;

// A full-frame paper sheet with a camera transform for the drawing.
export const Frame = ({ children, camera = "" }) => (
  <AbsoluteFill>
    <svg viewBox="0 0 1080 1080" width="100%" height="100%">
      <rect width="1080" height="1080" fill={C.paper} />
      <g transform={camera}>{children}</g>
    </svg>
  </AbsoluteFill>
);

const FadeIn = ({ enabled, children }) => {
  const frame = useCurrentFrame();
  const opacity = enabled ? interpolate(frame, [0, FADE], [0, 1], clamp) : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// Lowercase storybook captions that type themselves out, laid out at their
// full width from the first letter like the reference.
const Captions = ({ captions, speed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cap = captions.find((c) => t >= c.start && t < c.end);
  if (!cap) return null;
  const typed = (t - cap.start) * speed;
  const out = interpolate(t, [cap.end - 0.16, cap.end], [1, 0], clamp);
  // long lines shrink a little so they stay inside the frame
  const fontSize = Math.max(40, 46 - Math.max(0, cap.text.length - 40) * 0.55);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 92 }}>
      <div style={{ fontFamily: "Patrick Hand", fontSize, color: C.ink, opacity: out, letterSpacing: 0.5, whiteSpace: "pre" }}>
        {[...cap.text].map((ch, i) => (
          <span key={i} style={{ opacity: interpolate(typed - i, [0, 1.5], [0, 1], clamp) }}>{ch}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// scenes: [[id, Component]] in timeline order; each scene crossfades in over
// the previous one and receives its start time in seconds.
export const Story = ({ timeline, scenes, music }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Defs />
      {scenes.map(([id, Scene], i) => {
        const { start, end } = timeline.scenes[id];
        const last = i === scenes.length - 1;
        return (
          <Sequence key={id} name={id} from={Math.round(start * fps)} durationInFrames={Math.round((end - start) * fps) + (last ? 0 : FADE)}>
            <FadeIn enabled={i > 0}>
              <Scene start={start} />
            </FadeIn>
          </Sequence>
        );
      })}
      <Captions captions={timeline.captions} speed={timeline.typeSpeed ?? 32} />
      <PaperOverlay />
      {music && <Audio src={staticFile(music)} />}
    </AbsoluteFill>
  );
};
