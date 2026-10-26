import { makeCues } from "./theme";
import { SPOKEN_P8, WORDS_P8 } from "./words-part8";

/** Part 8 cue helpers: `w8(i, "word")` is the frame narration word i starts. */
export const P8 = makeCues(WORDS_P8, SPOKEN_P8);
export const w8 = P8.wf;
