import { makeCues } from "./theme";
import { SPOKEN_P6, WORDS_P6 } from "./words-part6";

/** Part 6 cue helpers: `w6(i, "word")` is the frame narration word i starts. */
export const P6 = makeCues(WORDS_P6, SPOKEN_P6);
export const w6 = P6.wf;
