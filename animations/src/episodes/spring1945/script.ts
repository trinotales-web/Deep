import type { Caption } from "@remotion/captions";
import { FPS } from "../../kit";
import { CUTS } from "./timeline";

export const END = 307.0;
export const TRANSITION = 8;
export const TOTAL_FRAMES = Math.round(END * FPS);

/** TransitionSeries durations: every shot is fully on screen at its cut time. */
export const shotTimeline = () => {
  const cutF = CUTS.map((c) => Math.round(c.at * FPS));
  return CUTS.map((c, i) => {
    const tIn = i > 0 && c.into !== "cut" ? TRANSITION : 0;
    const next = CUTS[i + 1];
    const tOut = next && next.into !== "cut" ? TRANSITION : 0;
    const endF = next ? cutF[i + 1] : TOTAL_FRAMES;
    return { ...c, from: cutF[i] - tIn / 2, dur: endF - cutF[i] + tIn / 2 + tOut / 2, tIn };
  });
};

/** Words colored red ("word" = every occurrence, "word#n" = nth, 0-based). */
export const HIGHLIGHTS = [
  "1945", "19", "bomb", "back", "shot", "meth", "kamikaze", "brave", "stranger", "emperor's", "injecting", "outlived",
  "japan#1", "1893", "new", "nobody", "1941", "hiropon", "work", "tiredness", "street", "coffee", "love",
  "1944", "losing", "desperate", "crash", "gods", "tokko", "teenagers", "barely", "sleepy", "sharp",
  "14", "umeda", "kazuko", "factory", "chocolate#1", "chrysanthemum", "hot", "rush", "soldiers", "darker", "die#1",
  "record", "accident", "needle", "kambara", "hiroshi", "inject", "brown#0", "wake", "200", "quiet", "lucky",
  "answer", "myth", "control", "awake", "alert", "pumped", "pushed", "emperor", "asleep", "pervitin", "benzedrine",
  "speed", "twist", "warehouses", "black", "million", "hooked", "200000", "bans", "another", "regretted", "terrible",
  "101", "poem", "dew", "wish", "war#9", "comments",
];

export const markHighlights = (captions: Caption[]) => {
  const counts = new Map<string, number>();
  return captions.map((c) => {
    const k = c.text.trim().toLowerCase().replace(/[^a-z0-9']/g, "");
    const n = counts.get(k) ?? 0;
    counts.set(k, n + 1);
    const hit = HIGHLIGHTS.some((h) => {
      const [w, idx] = h.split("#");
      return w === k && (idx === undefined || Number(idx) === n);
    });
    return hit ? { ...c, text: c.text.replace(c.text.trim(), `*${c.text.trim()}*`) } : c;
  });
};
