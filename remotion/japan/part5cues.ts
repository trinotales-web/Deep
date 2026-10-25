import { makeCues } from "./theme";
import { SPOKEN_P5, WORDS_P5 } from "./words-part5";

/** Part 5 cue helpers: `w5(i, "word")` is the frame narration word i starts. */
export const P5 = makeCues(WORDS_P5, SPOKEN_P5);
export const w5 = P5.wf;
