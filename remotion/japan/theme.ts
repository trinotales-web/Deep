import { Easing, interpolate } from "remotion";
import { WORDS_P1 } from "./words-part1";

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// Narration starts after the title card.
export const NARRATION_OFFSET = 3.0;

export const INK = "#1f2a55";
export const PAPER = "#f3ede0";

// Colored-pencil palette (storybook reference) tuned toward the warmer,
// richer tones of the history-explainer reference.
export const C = {
  orange: "#e7984a",
  tan: "#d9a96c",
  straw: "#dcbc78",
  brown: "#9a6a45",
  darkBrown: "#6e4a32",
  green: "#8db66b",
  darkGreen: "#5f8f4d",
  moss: "#a7b96a",
  sky: "#a9c9e2",
  sea: "#6f9fcb",
  deepSea: "#4f7fb3",
  foam: "#f6f3ea",
  gray: "#9a9a96",
  darkGray: "#6f6f6c",
  red: "#d95a3c",
  lava: "#f2832e",
  yellow: "#f2cb55",
  sun: "#f0b23c",
  pink: "#eea6a0",
  skin: "#f1c9a2",
  skinDark: "#dca57c",
  terracotta: "#c86f47",
  indigo: "#4f63a8",
  lightIndigo: "#9fb0dd",
  bronze: "#c98f3e",
  patina: "#7fa891",
  iron: "#8b8f97",
  hair: "#3a2c28",
  white: "#fbf8f0",
  rice: "#e8d27a",
};

export const FONT_HAND = "PatrickHand";
export const FONT_LABEL = "GochiHand";
export const FONT_TITLE = "KalamBold";

export const sec = (s: number) => Math.round(s * FPS);

/** Video time (seconds) at which narration word `i` starts. */
export const wStart = (i: number) => NARRATION_OFFSET + WORDS_P1[i][1];
/** Video time (seconds) at which narration word `i` ends. */
export const wEnd = (i: number) => NARRATION_OFFSET + WORDS_P1[i][2];
/** Frame at which narration word `i` starts. `word` guards against index slips. */
export const wf = (i: number, word?: string) => {
  if (word && WORDS_P1[i][0].toLowerCase().replace(/[^a-z]/g, "") !== word) {
    throw new Error(`Cue ${i} is "${WORDS_P1[i][0]}", expected "${word}"`);
  }
  return sec(wStart(i));
};

const ease = Easing.bezier(0.45, 0, 0.25, 1);

/** Clamped, eased interpolation over frames. */
export const ip = (
  f: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = ease,
) =>
  // A window that collapses (e.g. a cue landing after the scene ends) acts as a step.
  input[1] <= input[0]
    ? f < input[0]
      ? output[0]
      : output[1]
    : interpolate(f, input, output, {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing,
      });

/** Multi-stop clamped interpolation. */
export const ipm = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Words = [string, number, number][];

/** Cue helpers for a part's narration: `wf(i, "word")` is the frame word i starts. */
export const makeCues = (words: Words, spoken?: string[], offset = NARRATION_OFFSET) => ({
  wf: (i: number, word?: string) => {
    const said = spoken ? spoken[i] : words[i][0].toLowerCase().replace(/[^a-z]/g, "");
    if (word && said !== word) {
      throw new Error(`Cue ${i} is "${said}", expected "${word}"`);
    }
    return sec(offset + words[i][1]);
  },
  start: (i: number) => offset + words[i][1],
  end: (i: number) => offset + words[i][2],
});
