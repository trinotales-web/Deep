import type { CharacterProps } from "../../kit/character";

// Characters for the Moon south pole story. House style: white heads and
// white mitten gloves; Indian engineers get warm brown skin (white gloves).
type Design = Omit<CharacterProps, "pose" | "expression">;

const TONES = ["#c98e62", "#b97c52", "#d39c6e", "#a96d48", "#8a5a3c"];
const GLOVES = "#f6f5f8";
const tone = (i: number) => ({ skin: TONES[((i % TONES.length) + TONES.length) % TONES.length], gloves: GLOVES });
const HAIRS = ["#2a2226", "#3a2a22", "#1f1a1e", "#5a3a26", "#7a4a2a", "#c8a05a"];

/** "You": an ISRO engineer (light-blue shirt, ID lanyard). */
export const YOU: Design = {
  outfit: { top: "#8fb8e0", bottom: "#2f3a52", boots: "#2a2228", collar: "v", pockets: true, buttons: "#f4f4f2", strap: "#c8462f" },
  hair: "parted",
  hairColor: "#1f1a1e",
  ...tone(1),
  seed: 1,
};

/** ISRO mission control engineers. */
export const ENGINEER = (i = 0): Design => ({
  outfit: {
    top: ["#f4f4f2", "#c9a0d8", "#e8d27a", "#a8d0b8", "#f2b8a0", "#9ab8e8"][i % 6],
    bottom: ["#2f3a52", "#3a3a42", "#5a4a3a", "#2a3358"][i % 4],
    boots: "#2a2228",
    collar: (["v", "round", "high"] as const)[i % 3],
    pockets: i % 2 === 0,
    strap: ["#c8462f", "#2f6fd0", "#e0a83a"][i % 3],
  },
  hair: (["bun", "short", "long", "parted", "sides", "curly", "bob"] as const)[i % 7],
  hairColor: HAIRS[i % 3],
  glasses: i % 3 === 0 ? "#2a2228" : null,
  mustache: i % 4 === 1 ? "thin" : null,
  mustacheColor: "#2a2226",
  ...tone(i),
  seed: 10 + i,
});

/** Scientists in white coats (NASA, Baylor, labs). */
export const SCIENTIST = (i = 0): Design => ({
  outfit: { top: "#f4f4f2", bottom: ["#2f3a52", "#5a4a3a", "#3a3e48", "#4a5a6a"][i % 4], boots: "#2a2228", collar: "v", pockets: true, buttons: "#c8ccd2", shirt: ["#cfe0f0", "#f2d0d0", "#d8ecd0"][i % 3] },
  hair: (["parted", "bun", "short", "curly", "bob", "sides"] as const)[i % 6],
  hairColor: ["#3a2a22", "#7a4a2a", "#c8a05a", "#2a2226", "#9a6a3a", "#cfc9cf"][i % 6],
  glasses: i % 2 === 0 ? "#2a2228" : null,
  beard: i === 2 ? "full" : null,
  beardColor: "#5a4a3a",
  ...(i % 3 === 1 ? tone(i + 2) : {}),
  seed: 30 + i,
});

/** Astronaut in a white suit (NASA / Apollo / Artemis). */
export const ASTRONAUT = (i = 0): Design => ({
  outfit: { top: "#f2f2f4", bottom: "#f2f2f4", boots: "#c9ccd3", sleeves: "#f2f2f4", belt: "#9aa0aa", collar: "high", collarColor: "#c9ccd3", badge: ["#2f4f9a", "#c8262f", "#2f4f9a", "#e0a83a"][i % 4] },
  hat: "astronaut",
  hair: "short",
  hairColor: HAIRS[(i + 3) % HAIRS.length],
  ...(i % 2 === 1 ? tone(i + 1) : {}),
  seed: 50 + i,
});

/** Chinese astronaut (white suit, red accents). */
export const TAIKONAUT = (i = 0): Design => ({
  outfit: { top: "#f2f2f4", bottom: "#f2f2f4", boots: "#c8262f", sleeves: "#f2f2f4", belt: "#c8262f", collar: "high", collarColor: "#c8262f", badge: "#de2910" },
  hat: "astronaut",
  hair: "short",
  hairColor: "#1f1a1e",
  seed: 60 + i,
});

/** Russian controllers (Luna-25). */
export const RUSSIAN = (i = 0): Design => ({
  outfit: { top: ["#3a3e48", "#4a5a6a"][i % 2], shirt: "#f4f4f2", tie: "#2a3a5a", bottom: "#2a2a32", boots: "#18181c" },
  hair: (["short", "sides"] as const)[i % 2],
  hairColor: ["#7a4a2a", "#cfc9cf"][i % 2],
  mustache: i % 2 ? "walrus" : null,
  mustacheColor: "#9a8a7a",
  seed: 70 + i,
});

/** Viewer at the end. */
export const VIEWER: Design = {
  outfit: { top: "#8a5ab0", bottom: "#2f3a52", boots: "#f2f2f2", collar: "round" },
  hair: "swoop",
  hairColor: "#3a2a22",
  ...tone(2),
  seed: 80,
};

/** Officials / lawyers (treaty, contracts). */
export const OFFICIAL = (i = 0): Design => ({
  outfit: { top: ["#2a2a32", "#3a3e48", "#4a3a32", "#2a3358"][i % 4], shirt: "#f4f4f2", tie: ["#8a2a2a", "#2a4a8a", "#5a2a6a", "#2a5a3a"][i % 4], bottom: "#2a2a32", boots: "#18181c" },
  hair: (["parted", "sides", "short", "bun"] as const)[i % 4],
  hairColor: HAIRS[(i * 2) % HAIRS.length],
  glasses: i % 2 ? "#2a2228" : null,
  ...(i % 3 === 2 ? tone(i) : {}),
  seed: 90 + i,
});
