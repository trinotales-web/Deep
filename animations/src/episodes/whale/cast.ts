import type { CharacterProps } from "../../kit/character";

// Characters for the blue whale story. House style: white heads and white
// mitten gloves; teams mix in warm brown skin tones.
type Design = Omit<CharacterProps, "pose" | "expression">;

const TONES = ["#c98e62", "#b97c52", "#d39c6e", "#a96d48", "#8a5a3c"];
const GLOVES = "#f6f5f8";
const tone = (i: number) => ({ skin: TONES[i % TONES.length], gloves: GLOVES });
const HAIRS = ["#3a2a22", "#7a4a2a", "#c8a05a", "#2a2226", "#9a6a3a", "#5a3a26"];

/** "You": field scientist in a red float jacket and cap. */
export const YOU: Design = {
  outfit: { top: "#e2443a", bottom: "#2f3a52", boots: "#2a2228", collar: "high", pockets: true, buttons: "#f4f4f2" },
  hair: "short",
  hairColor: "#5a3a26",
  hat: "cap",
  hatColor: "#2a3358",
  seed: 1,
};

/** Your teammate with the tagging pole: yellow float jacket, beanie, brown skin. */
export const MATE: Design = {
  outfit: { top: "#f2c23a", bottom: "#2f3a52", boots: "#2a2228", collar: "high", pockets: true, buttons: "#2a2228" },
  hair: "bob",
  hairColor: "#2a2226",
  hat: "beanie",
  hatColor: "#2f6f9a",
  ...tone(1),
  seed: 2,
};

/** Boat driver. */
export const DRIVER: Design = {
  outfit: { top: "#3a6ab0", bottom: "#2f3a52", boots: "#2a2228", collar: "high", pockets: true },
  hair: "curly",
  hairColor: "#3a2a22",
  beard: "stubble",
  beardColor: "#3a2a22",
  seed: 3,
};

/** Museum / lab scientists in white coats. */
export const LAB = (i = 0): Design => ({
  outfit: { top: "#f4f4f2", bottom: ["#2f3a52", "#5a4a3a", "#3a3e48", "#4a5a6a"][i % 4], boots: "#2a2228", collar: "v", pockets: true, buttons: "#c8ccd2", shirt: ["#cfe0f0", "#f2d0d0", "#d8ecd0"][i % 3] },
  hair: (["parted", "bun", "short", "curly", "bob"] as const)[i % 5],
  hairColor: HAIRS[(i * 2 + 1) % HAIRS.length],
  glasses: i % 2 === 0 ? "#2a2228" : null,
  beard: i === 2 ? "full" : null,
  beardColor: "#5a4a3a",
  ...(i % 3 === 1 ? tone(i) : {}),
  seed: 20 + i,
});

/** Whalers (1900s–1950s): wool jumpers, caps, beards. */
export const WHALER = (i = 0): Design => ({
  outfit: { top: ["#3a3e48", "#5a4a3a", "#2a3358"][i % 3], bottom: "#3a3a42", boots: "#2a2228", collar: "high", patches: i % 2 ? "#6a5a4a" : null },
  hair: "short",
  hairColor: ["#3a2a22", "#9a6a3a", "#c8c4c0"][i % 3],
  hat: i % 2 ? "beanie" : "cap",
  hatColor: ["#2a2a32", "#6a2a2a", "#3a3e48"][i % 3],
  beard: i % 2 ? "full" : null,
  mustache: i % 2 ? null : "walrus",
  beardColor: "#5a4a3a",
  mustacheColor: "#5a4a3a",
  seed: 40 + i,
});

/** A kid (the "swim through an artery" myth). */
export const KID: Design = {
  outfit: { top: "#4fc0a0", bottom: "#3a6ab0", boots: "#f2f2f2", collar: "round", print: "#f4f4f2", printKind: "bar" },
  hair: "short",
  hairColor: "#c8a05a",
  seed: 60,
};

/** Viewer at the end. */
export const VIEWER: Design = {
  outfit: { top: "#8a5ab0", bottom: "#2f3a52", boots: "#f2f2f2", collar: "round" },
  hair: "swoop",
  hairColor: "#3a2a22",
  ...tone(2),
  seed: 70,
};

/** Reporters at the 2023 announcement. */
export const REPORTER = (i = 0): Design => ({
  outfit: { top: ["#c8462f", "#3a6ab0", "#e0b04a", "#4a8a5a"][i % 4], bottom: ["#2f3a52", "#3a3a42"][i % 2], boots: "#2a2228", collar: "round" },
  hair: (["short", "long", "curly", "bob"] as const)[i % 4],
  hairColor: HAIRS[(i * 3) % HAIRS.length],
  ...(i % 2 === 1 ? tone(i + 2) : {}),
  seed: 80 + i,
});
