import { makeCues } from "./theme";
import { SPOKEN_P2, WORDS_P2 } from "./words-part2";

/** Part 2 cue helpers: `w2(i, "word")` is the frame narration word i starts. */
export const P2 = makeCues(WORDS_P2, SPOKEN_P2);
export const w2 = P2.wf;
