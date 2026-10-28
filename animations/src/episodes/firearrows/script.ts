import type { Caption } from "@remotion/captions";
import { FPS } from "../../kit";
import { CUTS } from "./timeline";

export const END = 499.5;
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
  "fire", "flaming", "comet", "out", "cold", "why", "hundred", "badly", "worse", "never", "space",
  "one", "two", "three", "hates", "highway", "candle", "romans", "hollow", "slowly", "hard", "closer", "heavy",
  "slow", "safe", "ten", "rains", "worse", "big", "match", "dies", "straw", "tents", "sails", "hay", "sieges",
  "wall", "burns", "killed", "ships", "felt", "skins", "hide", "hides", "water", "dirt", "bigger", "falarica",
  "terror", "show", "viking", "beautiful", "proof", "land", "naked", "backwards", "gunpowder", "itself",
  "monster", "hwacha", "huojian", "rocket", "nightmare", "laugh", "comments",
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
