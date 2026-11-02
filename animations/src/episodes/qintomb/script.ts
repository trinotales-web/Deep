import type { Caption } from "@remotion/captions";
import { FPS, type CameraAdjust } from "../../kit";

// Two videos cut from one narration (public/vo/qin-tomb-{1,2}.voice.m4a).
export const END1 = 256.2;
export const END2 = 213.7;
export const TRANSITION = 8;
/** In the single full video, part 1 is trimmed so the pause into part 2 stays ~1.3 s. */
export const FULL1 = 255.4;

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

/** Words colored red per part ("word" = every occurrence, "word#n" = nth in that part, 0-based). */
export const HIGHLIGHTS: Record<1 | 2, string[]> = {
  1: [
    "210bc", "lamp", "silver", "stars", "crossbows", "build", "buried", "secret#0", "problem", "forever#0", "pillar", "children", "island",
    "stinking", "8,000", "dying", "13", "seven", "early", "221bc", "title", "generations", "china#3", "enemies", "gifts", "traitor", "scroll",
    "dagger", "stabs", "rips", "long#0", "order#0", "back!", "death", "die#0", "xu", "fu", "japan", "2002", "looking", "herbs", "pills",
    "mercury#0", "kill", "mercury#1", "700,000", "30", "volunteers", "prisoners", "121", "mercury#2", "themselves", "76", "25-story", "sima",
    "qian", "machines", "man-fish#0", "whale", "secret#1", "treasure",
  ],
  2: [
    "dies", "closed", "49", "50", "panic", "secret", "meals", "smell", "fish", "fake", "himself", "huhai", "wives", "die#0", "everything",
    "shuts", "lamp", "drops", "ordinary", "out#1", "gone", "1974", "yang", "zhifa", "kilometers", "pottery", "head", "8,000", "real#0", "brown",
    "colors", "red", "green", "purple", "blue", "15", "minutes#0", "burn", "rebels", "fire", "opened", "mercury#0", "2020", "cracks", "real#1",
    "true", "argue", "technology", "waiting", "safe", "out#3", "dark", "comments",
  ],
};

const norm = (t: string) => t.trim().toLowerCase().replace(/[^a-z0-9'!,-]/g, "").replace(/[,.]$/, "");

export const markHighlights = (captions: Caption[], part: 1 | 2) => {
  const counts = new Map<string, number>();
  return captions.map((c) => {
    const k = norm(c.text);
    const n = counts.get(k) ?? 0;
    counts.set(k, n + 1);
    const hit = HIGHLIGHTS[part].some((h) => {
      const [w, idx] = h.split("#");
      return w === k && (idx === undefined || Number(idx) === n);
    });
    return hit ? { ...c, text: c.text.replace(c.text.trim(), `*${c.text.trim()}*`) } : c;
  });
};
