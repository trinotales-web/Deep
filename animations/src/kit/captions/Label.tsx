import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTION_RED } from "../style";

// On-screen text in the caption font: title cards, place/date tags, stamps,
// labels on diagrams. Positions are fractions of the frame (0..1).

export type LabelProps = {
  text: string;
  x?: number;
  y?: number;
  /** Font size as a fraction of the frame height. */
  size?: number;
  color?: string;
  /** "tag" (plain), "title" (big, two-tone), "stamp" (red boxed, rotated), "box" (dark plate). */
  kind?: "tag" | "title" | "stamp" | "box";
  /** Frame (local to the shot) when the label pops in. */
  at?: number;
  /** Frame when it leaves (optional). */
  until?: number;
  rotate?: number;
  sub?: string;
  font?: string;
};

export const Label: React.FC<LabelProps> = ({
  text,
  x = 0.5,
  y = 0.15,
  size = 0.06,
  color = "#ffffff",
  kind = "tag",
  at = 0,
  until,
  rotate = 0,
  sub,
  font = "Montserrat, 'WenQuanYi Zen Hei', sans-serif",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (frame < at || (until !== undefined && frame >= until)) return null;
  const pop = interpolate(frame - at, [0, 5, 9], [0.6, 1.12, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const fs = Math.round(height * size);
  const shadow = Math.max(2, Math.round(fs * 0.07));
  const base: React.CSSProperties = {
    position: "absolute",
    left: x * width,
    top: y * height,
    transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${kind === "stamp" ? 1.6 - 0.6 * Math.min(1, (frame - at) / 5) : pop})`,
    fontFamily: font,
    fontWeight: 900,
    fontSize: fs,
    lineHeight: 1.05,
    textTransform: "uppercase",
    whiteSpace: "pre",
    textAlign: "center",
    color,
    textShadow: `0 ${shadow}px 0 #1d1519, ${shadow * 0.6}px ${shadow}px 0 #1d1519, 0 0 ${shadow * 2}px rgba(20,12,16,0.6)`,
    WebkitTextStroke: `${Math.max(1, fs * 0.025)}px #1d1519`,
    paintOrder: "stroke fill",
  };
  if (kind === "stamp") {
    Object.assign(base, {
      color: CAPTION_RED,
      border: `${Math.round(fs * 0.12)}px solid ${CAPTION_RED}`,
      borderRadius: fs * 0.15,
      padding: `${fs * 0.08}px ${fs * 0.3}px`,
      textShadow: "none",
      WebkitTextStroke: "0px",
      background: "rgba(255,255,255,0.08)",
      opacity: Math.min(1, (frame - at) / 3),
    });
  }
  if (kind === "box") {
    Object.assign(base, {
      background: "rgba(29,21,25,0.82)",
      border: `${Math.max(3, fs * 0.06)}px solid #1d1519`,
      borderRadius: fs * 0.18,
      padding: `${fs * 0.18}px ${fs * 0.42}px`,
      textShadow: "none",
      WebkitTextStroke: "0px",
    });
  }
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={base}>
        {kind === "title" ? (
          <>
            <div style={{ fontSize: fs * 0.55, color: CAPTION_RED }}>{sub}</div>
            <div>{text}</div>
          </>
        ) : (
          <>
            {text}
            {sub ? <div style={{ fontSize: fs * 0.5, opacity: 0.9 }}>{sub}</div> : null}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
