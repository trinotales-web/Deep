import { FPS, type CameraAdjust } from "../../kit";

// The Maya story: one narration (public/vo/maya.mp3), tightened and processed
// (maya.tight.voice.m4a) and split into two videos at the cities emptying:
//   1 → maya-1.voice.m4a (ends "…and the jungle swallows them.")
//   2 → maya-2.voice.m4a (opens "So what happened?")
export const END1 = 533.4;
export const END2 = 458.3;
export const TRANSITION = 8;

export type Into = "cut" | "slide-left" | "slide-up" | "fade";
/**
 * `punch`: hard punch-in cuts inside a shot, as in the reference shorts —
 * [narration time, extra zoom, focus x, focus y] with the focus as a fraction of
 * the frame (0..1, y down). A zoom of 1 cuts back out.
 */
export type Cut = { id: string; at: number; into: Into; C: React.FC<{ dur: number; start: number }>; cam?: CameraAdjust; punch?: [number, number, number, number][] };

/** TransitionSeries durations: every shot is fully on screen at its cut time. */
export const shotTimeline = (cuts: Cut[], end: number) => {
  const total = Math.round(end * FPS);
  const cutF = cuts.map((c) => Math.round(c.at * FPS));
  return cuts.map((c, i) => {
    // Hard cuts everywhere except fades (time jumps), as in the reference shorts.
    const tIn = i > 0 && c.into === "fade" ? TRANSITION : 0;
    const next = cuts[i + 1];
    const tOut = next && next.into === "fade" ? TRANSITION : 0;
    const endF = next ? cutF[i + 1] : total;
    return { ...c, from: cutF[i] - tIn / 2, dur: endF - cutF[i] + tIn / 2 + tOut / 2, tIn };
  });
};
