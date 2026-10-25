import { makeCues } from "./theme";
import { SPOKEN_P7, WORDS_P7 } from "./words-part7";

/** Part 7 cue helpers: `w7(i, "word")` is the frame narration word i starts. */
export const P7 = makeCues(WORDS_P7, SPOKEN_P7);
export const w7 = P7.wf;
