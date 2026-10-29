import { interpolate } from "remotion";

/** Frames from the shot's start (in seconds on the VO timeline) to absolute time `s`. */
export const sec = (shotStartFrames: number) => (s: number) => Math.round(s * 30 - shotStartFrames);

/** Overshoot pop 0 → 1.15 → 1 starting at absolute time `at`. */
export const pop = (t: number, at: number) =>
  interpolate(t, [at, at + 0.12, at + 0.22], [0, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const CJK = "Montserrat, 'WenQuanYi Zen Hei', sans-serif";
