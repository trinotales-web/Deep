import type { Caption } from "@remotion/captions";
import { FPS } from "./common";

// "The Wooden Wall" — 1080x1920 short, timed to public/vo/wooden-wall.mp3.
// Cut times (seconds) come from the forced-aligned voiceover
// (public/captions/wooden-wall.json); every cut sits in a breath between phrases.

export type Into = "cut" | "slide-left" | "slide-up" | "fade";

export const CUTS: { id: string; at: number; into: Into }[] = [
  { id: "hook", at: 0, into: "cut" },
  { id: "killed", at: 3.1, into: "cut" },
  { id: "army", at: 4.85, into: "slide-left" },
  { id: "xerxes", at: 9.45, into: "cut" },
  { id: "delphi", at: 11.0, into: "slide-left" },
  { id: "strange", at: 13.85, into: "cut" },
  { id: "prophecy", at: 15.65, into: "cut" },
  { id: "question", at: 17.85, into: "slide-up" },
  { id: "ships", at: 19.55, into: "slide-left" },
  { id: "boarding", at: 22.25, into: "cut" },
  { id: "empty", at: 24.1, into: "cut" },
  { id: "stay", at: 25.1, into: "slide-left" },
  { id: "literal", at: 28.95, into: "cut" },
  { id: "climb", at: 31.25, into: "slide-up" },
  { id: "build", at: 34.8, into: "cut" },
  { id: "areopagus", at: 38.05, into: "slide-left" },
  { id: "now", at: 40.4, into: "cut" },
  { id: "physics", at: 42.8, into: "cut" },
  { id: "drywall", at: 46.45, into: "slide-left" },
  { id: "wrap", at: 48.85, into: "cut" },
  { id: "light", at: 51.35, into: "cut" },
  { id: "shoot", at: 52.6, into: "cut" },
  { id: "burns", at: 53.6, into: "cut" },
  { id: "giveup", at: 55.4, into: "cut" },
  { id: "rocks", at: 56.95, into: "slide-left" },
  { id: "cliff", at: 60.5, into: "slide-up" },
  { id: "unguarded", at: 63.45, into: "cut" },
  { id: "see", at: 65.95, into: "cut" },
  { id: "jump", at: 67.85, into: "cut" },
  { id: "temple", at: 69.35, into: "cut" },
  { id: "fallen", at: 71.15, into: "fade" },
  { id: "remember", at: 74.15, into: "slide-left" },
  { id: "map", at: 75.65, into: "cut" },
  { id: "ram", at: 77.7, into: "slide-left" },
  { id: "watch", at: 81.1, into: "cut" },
  { id: "right", at: 84.4, into: "slide-left" },
  { id: "saved", at: 86.5, into: "cut" },
  { id: "theirs", at: 88.6, into: "slide-up" },
];

export const END = 91.5;
export const TRANSITION = 8; // frames for slides/fades
export const TOTAL_FRAMES = Math.round(END * FPS);

/**
 * TransitionSeries durations so that every shot is fully on screen at its
 * cut time: d_i = (c_{i+1} - c_i) + T_i/2 + T_{i+1}/2.
 */
export const shotTimeline = () => {
  const cutF = CUTS.map((c) => Math.round(c.at * FPS));
  return CUTS.map((c, i) => {
    const tIn = i > 0 && c.into !== "cut" ? TRANSITION : 0;
    const next = CUTS[i + 1];
    const tOut = next && next.into !== "cut" ? TRANSITION : 0;
    const endF = next ? cutF[i + 1] : TOTAL_FRAMES;
    const dur = endF - cutF[i] + tIn / 2 + tOut / 2;
    return { ...c, from: cutF[i] - tIn / 2, dur, tIn };
  });
};

/** Words colored red. "word" = every occurrence, "word#n" = nth (0-based). */
export const HIGHLIGHTS = [
  "wooden", "wall", "killed", "xerxes", "strange", "ships", "empty", "word", "acropolis",
  "fire", "burns", "rocks", "steepest", "nobody", "survives", "salamis", "smashes", "right#1", "theirs",
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
