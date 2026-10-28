import { Easing, interpolate } from "remotion";

export const FPS = 30;

/** 0..1 progress between absolute times a and b (seconds), eased. */
export const ramp = (t: number, a: number, b: number, easing: (x: number) => number = Easing.inOut(Easing.quad)) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** Slow push-in over a shot (reference camera move). */
export const push = (frame: number, dur: number, from = 1, to = 1.08) =>
  interpolate(frame, [0, dur], [from, to], { easing: Easing.bezier(0.45, 0, 0.55, 1), extrapolateRight: "clamp" });

/** Quick bump that decays (for hits/shakes): 0 → 1 → 0 around time `at`. */
export const hitAt = (t: number, at: number, len = 0.45) =>
  interpolate(t, [at, at + 0.06, at + len], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export type ShotProps = { dur: number; start: number };

/** Absolute timeline seconds for a frame inside a shot. */
export const absT = (start: number, frame: number) => (start + frame) / FPS;
