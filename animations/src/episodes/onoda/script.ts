import type { Caption } from "@remotion/captions";

// Cue sheet for the demo episode. Times are in seconds unless noted.
// When the real voiceover arrives, replace PHRASES with a word-level
// transcript (see CLAUDE.md) and nudge the SFX cues to match.

export const FPS = 30;
export const TRANSITION = 9; // frames

export const SHOTS = [
  { id: "office", dur: 126 },
  { id: "closeup", dur: 84 },
  { id: "island", dur: 135 },
  { id: "night", dur: 150 },
  { id: "years", dur: 165 },
] as const;

export type ShotId = (typeof SHOTS)[number]["id"];

/** Start frame of each shot on the master timeline (transitions overlap). */
export const shotStart = (id: ShotId) => {
  let t = 0;
  for (const s of SHOTS) {
    if (s.id === id) return t;
    t += s.dur - TRANSITION;
  }
  return t;
};

export const TOTAL_FRAMES = SHOTS.reduce((a, s) => a + s.dur, 0) - TRANSITION * (SHOTS.length - 1);

// *word* = highlighted in red, like the reference captions.
export const PHRASES: [string, number, number][] = [
  ["In 1944, a young officer", 0.35, 2.0],
  ["named Hiroo Onoda", 2.0, 3.0],
  ["gets one *order.*", 3.0, 3.85],
  ["*Never* *surrender.*", 4.05, 5.2],
  ["Not even once.", 5.35, 6.35],
  ["He's sent to Lubang,", 6.65, 7.9],
  ["a tiny island", 7.9, 8.8],
  ["in the Philippines.", 8.8, 10.1],
  ["In 1945,", 10.9, 11.7],
  ["the war *ends.*", 11.7, 12.8],
  ["But nobody", 13.2, 13.9],
  ["*tells* *him.*", 13.9, 14.9],
  ["So he keeps", 15.6, 16.35],
  ["*fighting.*", 16.35, 17.1],
  ["For *29* *years.*", 17.5, 19.3],
];

/** Placeholder word timings: words spread evenly across each phrase. */
export const placeholderCaptions = (): Caption[] =>
  PHRASES.flatMap(([text, start, end]) => {
    const words = text.split(" ");
    const step = (end - start) / words.length;
    return words.map((w, i) => {
      const s = start + i * step;
      return {
        text: (i === 0 ? "" : " ") + w,
        startMs: Math.round(s * 1000),
        endMs: Math.round((s + step) * 1000),
        timestampMs: Math.round((s + step / 2) * 1000),
        confidence: null,
      };
    });
  });

/** Where each phrase (caption page) starts — used to build pages. */
export const PAGE_STARTS_MS = PHRASES.map(([, s]) => Math.round(s * 1000));
