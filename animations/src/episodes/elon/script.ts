import { FPS, type CameraAdjust } from "../../kit";

// The Elon Musk story: one narration (public/vo/elon.mp3), tightened and
// processed into elon.tight.voice.m4a; word times in public/captions/elon.json.
export const END = 922.42;
export const TRANSITION = 8;

export type Into = "cut" | "fade";
/**
 * `punch`: hard punch-in cuts inside a shot (reference-style pacing):
 * [narration time, extra zoom, focus x, focus y], focus as a fraction of the
 * frame (0..1, y down). A zoom of 1 cuts back out.
 */
export type Cut = { id: string; at: number; into: Into; C: React.FC<{ dur: number; start: number }>; cam?: CameraAdjust; punch?: [number, number, number, number][] };

/** TransitionSeries durations: every shot is fully on screen at its cut time. */
export const shotTimeline = (cuts: Cut[], end: number) => {
  const total = Math.round(end * FPS);
  const cutF = cuts.map((c) => Math.round(c.at * FPS));
  return cuts.map((c, i) => {
    const tIn = i > 0 && c.into === "fade" ? TRANSITION : 0;
    const next = cuts[i + 1];
    const tOut = next && next.into === "fade" ? TRANSITION : 0;
    const endF = next ? cutF[i + 1] : total;
    return { ...c, from: cutF[i] - tIn / 2, dur: endF - cutF[i] + tIn / 2 + tOut / 2, tIn };
  });
};
