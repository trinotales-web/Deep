import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTION_RED } from "../style";

// On-screen text in the caption font: title cards, place/date tags, stamps,
// labels on diagrams. Positions are fractions of the frame (0..1).
//
// Layout (broadcast style): unless `pin` is set, box/title/stamp labels in the
// top or bottom band snap to a fixed grid — left / centre / right columns with
// constant margins, and fixed rows — so text never floats at random spots.
// Labels attached to something on screen (map pins, items in a row) use `pin`.

export type LabelProps = {
  text: string;
  x?: number;
  y?: number;
  /** Font size as a fraction of the frame height. */
  size?: number;
  color?: string;
  /** "tag" (plain), "title" (big, two-tone), "stamp" (red plate, tilted), "box" (dark plate). */
  kind?: "tag" | "title" | "stamp" | "box";
  /** Frame (local to the shot) when the label appears. */
  at?: number;
  /** Frame when it leaves (optional). */
  until?: number;
  rotate?: number;
  sub?: string;
  font?: string;
  /** Keep the exact x/y (attached to an object on screen). */
  pin?: boolean;
};

const MARGIN = 0.045;
const INK = "#1d1519";

type Slot = { x: number; y: number; align: "left" | "center" | "right" };

const snap = (x: number, y: number, kind: LabelProps["kind"]): Slot | null => {
  const top = y <= 0.32;
  const bottom = y >= 0.8;
  if (!top && !bottom) return null;
  const align: Slot["align"] = kind === "title" ? "center" : x < 0.38 ? "left" : x > 0.62 ? "right" : "center";
  const sx = align === "left" ? MARGIN : align === "right" ? 1 - MARGIN : 0.5;
  const sy = top ? (y < 0.15 ? 0.085 : y < 0.245 ? 0.18 : 0.27) : y > 0.88 ? 0.915 : 0.83;
  return { x: sx, y: sy, align };
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
  pin = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (frame < at || (until !== undefined && frame >= until)) return null;
  const slot = !pin && kind !== "tag" ? snap(x, y, kind) : null;
  const px = slot ? slot.x : x;
  const py = slot ? slot.y : y;
  const align = slot ? slot.align : "center";
  // entrance: slide + fade (no bounce); exit before `until`
  const kIn = interpolate(frame - at, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const kOut = until !== undefined ? interpolate(until - frame, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const k = Math.min(kIn, kOut);
  const fs = Math.round(height * Math.min(0.075, size));
  const dx = (1 - kIn) * (align === "left" ? -28 : align === "right" ? 28 : 0);
  const dy = (1 - kIn) * (align === "center" ? (py > 0.5 ? 16 : -16) : 0);
  const tx = align === "left" ? "0%" : align === "right" ? "-100%" : "-50%";
  const shadow = Math.max(2, Math.round(fs * 0.07));
  const base: React.CSSProperties = {
    position: "absolute",
    left: px * width,
    top: py * height,
    transform: `translate(calc(${tx} + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotate}deg) scale(${0.96 + 0.04 * kIn})`,
    opacity: k,
    fontFamily: font,
    fontWeight: 900,
    fontSize: fs,
    lineHeight: 1.05,
    textTransform: "uppercase",
    whiteSpace: "pre",
    textAlign: align,
    color,
    letterSpacing: "0.01em",
    textShadow: `0 ${shadow}px 0 ${INK}, ${shadow * 0.6}px ${shadow}px 0 ${INK}, 0 0 ${shadow * 2}px rgba(20,12,16,0.6)`,
    WebkitTextStroke: `${Math.max(1, fs * 0.025)}px ${INK}`,
    paintOrder: "stroke fill",
  };
  if (kind === "stamp") {
    const slam = interpolate(frame - at, [0, 4, 7], [1.35, 0.97, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
    Object.assign(base, {
      color: "#ffffff",
      background: CAPTION_RED,
      borderRadius: fs * 0.12,
      padding: `${fs * 0.14}px ${fs * 0.36}px`,
      boxShadow: `0 ${fs * 0.08}px 0 ${INK}, 0 ${fs * 0.2}px ${fs * 0.5}px rgba(0,0,0,0.35)`,
      textShadow: "none",
      WebkitTextStroke: "0px",
      transform: `translate(${tx}, -50%) rotate(${rotate ? Math.sign(rotate) * Math.min(4, Math.abs(rotate)) : -3}deg) scale(${slam})`,
      opacity: Math.min(1, (frame - at) / 2) * kOut,
    });
  }
  if (kind === "box") {
    const bar = Math.max(5, Math.round(fs * 0.13));
    Object.assign(base, {
      background: "rgba(22,17,21,0.86)",
      borderRadius: fs * 0.12,
      padding: `${fs * 0.2}px ${fs * 0.42}px`,
      borderLeft: align === "left" ? `${bar}px solid ${CAPTION_RED}` : undefined,
      borderRight: align === "right" ? `${bar}px solid ${CAPTION_RED}` : undefined,
      borderBottom: align === "center" ? `${bar}px solid ${CAPTION_RED}` : undefined,
      boxShadow: `0 ${fs * 0.12}px ${fs * 0.4}px rgba(0,0,0,0.3)`,
      textShadow: "none",
      WebkitTextStroke: "0px",
      fontWeight: 800,
    });
  }
  if (kind === "title") {
    Object.assign(base, {
      padding: `${fs * 0.12}px ${fs * 0.5}px`,
      background: "radial-gradient(ellipse at center, rgba(20,14,18,0.5) 0%, rgba(20,14,18,0.28) 55%, rgba(20,14,18,0) 75%)",
    });
  }
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={base}>
        {kind === "title" ? (
          <>
            {sub ? <div style={{ fontSize: fs * 0.5, color: CAPTION_RED }}>{sub}</div> : null}
            <div>{text}</div>
          </>
        ) : (
          <>
            {text}
            {sub ? (
              <div style={{ fontSize: fs * 0.48, fontWeight: 700, color: kind === "box" ? "#f2c9a0" : undefined, opacity: 0.95, marginTop: fs * 0.06, letterSpacing: "0.04em" }}>{sub}</div>
            ) : null}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
