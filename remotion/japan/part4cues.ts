import { makeCues } from "./theme";
import { SPOKEN_P4, WORDS_P4 } from "./words-part4";

/** Part 4 cue helpers: `w4(i, "word")` is the frame narration word i starts. */
export const P4 = makeCues(WORDS_P4, SPOKEN_P4);
export const w4 = P4.wf;
