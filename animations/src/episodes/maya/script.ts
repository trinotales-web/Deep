import { FPS, type CameraAdjust } from "../../kit";

// The Maya story: one narration (public/vo/maya.mp3), tightened and processed
// (maya.tight.voice.m4a) and split into two videos at the cities emptying:
//   1 → maya-1.voice.m4a (ends "…and the jungle swallows them.")
//   2 → maya-2.voice.m4a (opens "So what happened?")
export const END1 = 533.4;
export const END2 = 458.3;
export const TRANSITION = 8;

export type Into = "cut" | "slide-left" | "slide-up" | "fade";
export type Cut = { id: string; at: number; into: Into; C: React.FC<{ dur: number; start: number }>; cam?: CameraAdjust };

/** TransitionSeries durations: every shot is fully on screen at its cut time. */
export const shotTimeline = (cuts: Cut[], end: number) => {
  const total = Math.round(end * FPS);
  const cutF = cuts.map((c) => Math.round(c.at * FPS));
  return cuts.map((c, i) => {
    const tIn = i > 0 && c.into !== "cut" ? TRANSITION : 0;
    const next = cuts[i + 1];
    const tOut = next && next.into !== "cut" ? TRANSITION : 0;
    const endF = next ? cutF[i + 1] : total;
    return { ...c, from: cutF[i] - tIn / 2, dur: endF - cutF[i] + tIn / 2 + tOut / 2, tIn };
  });
};
