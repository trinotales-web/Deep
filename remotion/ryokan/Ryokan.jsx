import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import tl from "./timeline.json";
import { C, Defs, PaperOverlay, clamp } from "./style";
import { SceneMountain, SceneNothing, SceneNight, SceneMoon, SceneLightness } from "./scenes";

loadFont({ family: "Patrick Hand", url: staticFile("ryokan/fonts/patrick-hand.woff2") });
loadFont({ family: "Klee One", url: staticFile("ryokan/fonts/klee-one-haiku.woff2"), weight: "600" });

const FADE = 10;

const SCENES = [
  ["mountain", SceneMountain],
  ["nothing", SceneNothing],
  ["night", SceneNight],
  ["moon", SceneMoon],
  ["lightness", SceneLightness],
];

const FadeIn = ({ enabled, children }) => {
  const frame = useCurrentFrame();
  const opacity = enabled ? interpolate(frame, [0, FADE], [0, 1], clamp) : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// Lowercase storybook captions that type themselves out, laid out at their
// full width from the first letter like the reference.
const Captions = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cap = tl.captions.find((c) => t >= c.start && t < c.end);
  if (!cap) return null;
  const typed = (t - cap.start) * 32;
  const out = interpolate(t, [cap.end - 0.16, cap.end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 92 }}>
      <div style={{ fontFamily: "Patrick Hand", fontSize: 46, color: C.ink, opacity: out, letterSpacing: 0.5, whiteSpace: "pre" }}>
        {[...cap.text].map((ch, i) => (
          <span key={i} style={{ opacity: interpolate(typed - i, [0, 1.5], [0, 1], clamp) }}>{ch}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const RyokanStory = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Defs />
      {SCENES.map(([id, Scene], i) => {
        const { start, end } = tl.scenes[id];
        const last = i === SCENES.length - 1;
        return (
          <Sequence key={id} name={id} from={Math.round(start * fps)} durationInFrames={Math.round((end - start) * fps) + (last ? 0 : FADE)}>
            <FadeIn enabled={i > 0}>
              <Scene start={start} />
            </FadeIn>
          </Sequence>
        );
      })}
      <Captions />
      <PaperOverlay />
      <Audio src={staticFile("ryokan/music.m4a")} />
    </AbsoluteFill>
  );
};
