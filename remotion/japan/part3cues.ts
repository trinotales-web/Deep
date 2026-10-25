import { makeCues } from "./theme";
import { SPOKEN_P3, WORDS_P3 } from "./words-part3";

/** Part 3 cue helpers: `w3(i, "word")` is the frame narration word i starts. */
export const P3 = makeCues(WORDS_P3, SPOKEN_P3);
export const w3 = P3.wf;
