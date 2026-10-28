import type { CharacterProps } from "../../kit/character";

// Character designs for "Why Fire Arrows Almost Never Worked" (16:9).
type Design = Omit<CharacterProps, "pose" | "expression">;

export const ARCHER: Design = {
  outfit: { top: "#8a7454", bottom: "#5a4a3a", boots: "#4a3524", hem: 32, quilt: "#6a5640", belt: "#4a2f1e", buckle: "#c9a24a" },
  hat: "kettle",
  freckles: true,
  seed: 1,
};

export const CAPTAIN: Design = {
  outfit: { top: "#7a2a2a", bottom: "#4a3a3a", boots: "#3a2a1e", hem: 32, quilt: "#5a1c1c", belt: "#3a2a1e", buckle: "#e9ba41" },
  hat: "kettle",
  hatAccent: "#c0362c",
  mustache: "walrus",
  mustacheColor: "#5a3a26",
  seed: 2,
};

export const ENEMY = (i = 0): Design => ({
  outfit: { top: ["#3a4a6a", "#4a3a5a", "#2a4a4a"][i % 3], bottom: "#2a2a34", hem: 32, quilt: "#22283a", belt: "#2a1e1a" },
  hat: "kettle",
  hatColor: "#7a7e88",
  beard: i % 2 ? "stubble" : null,
  seed: 10 + i,
});

export const ROMAN: Design = {
  outfit: { top: "#b8322a", bottom: "#8a2a24", boots: "#5a3a26", hem: 28, armor: "#a9aeb8", belt: "#5a3a26", buckle: "#c9a24a" },
  hat: "corinthian",
  hatColor: "#b5b9c2",
  hatAccent: "#c0362c",
  beard: "stubble",
  seed: 20,
};

export const AMMIANUS: Design = {
  ...ROMAN,
  hat: null,
  hair: "short",
  hairColor: "#3a2a22",
  beard: "full",
  beardColor: "#3a2a22",
  seed: 21,
};

export const GREEK_WRITER: Design = {
  outfit: { top: "#e9e1cf", robe: true, trim: "#2f5f9a", rope: "#c9963f", sash: "#2f5f9a" },
  hair: "sides",
  hairColor: "#cfc9cf",
  beard: "full",
  beardColor: "#cfc9cf",
  seed: 30,
};

export const HANNIBAL: Design = {
  outfit: { top: "#7a2a5a", bottom: "#4a2a3a", hem: 28, armor: "#c9963f", sash: "#3a1a2a", belt: "#3a2a1e" },
  hat: "corinthian",
  hatColor: "#c9963f",
  hatAccent: "#5a1a5a",
  beard: "full",
  beardColor: "#2a2226",
  seed: 31,
};

export const IBERIAN = (i = 0): Design => ({
  outfit: { top: ["#e9dcc0", "#d8c9a6"][i % 2], hem: 28, belt: "#7a2a2a", trim: "#7a2a2a" },
  hair: i % 2 ? "spiky" : "short",
  hairColor: "#2a2226",
  beard: i % 2 ? "full" : "stubble",
  beardColor: "#2a2226",
  seed: 32 + i,
});

export const LIVY: Design = {
  outfit: { top: "#f4f1ea", robe: true, trim: "#6b2f7a", sash: "#f4f1ea" },
  hat: "wreath",
  hair: "sides",
  hairColor: "#9a8a8a",
  seed: 35,
};

export const VIKING = (i = 0): Design => ({
  outfit: { top: ["#5a6a3a", "#6a4a3a", "#3a5a6a"][i % 3], bottom: "#4a3a2a", hem: 30, belt: "#3a2a1e", buckle: "#c9a24a", collar: "high", collarColor: "#8a6a4a" },
  hat: "viking",
  beard: "full",
  beardColor: ["#c9732a", "#e0c06a", "#7a4a2a"][i % 3],
  mustache: "walrus",
  mustacheColor: ["#c9732a", "#e0c06a", "#7a4a2a"][i % 3],
  seed: 40 + i,
});

export const IBN_FADLAN: Design = {
  outfit: { top: "#2f6f6a", robe: true, trim: "#e9ba41", sash: "#efe6d2" },
  hat: "turban",
  hatAccent: "#2f6f6a",
  beard: "full",
  beardColor: "#2a2226",
  seed: 45,
};

export const SONG_SOLDIER = (i = 0): Design => ({
  outfit: { top: ["#8a2a2a", "#7a3a2a"][i % 2], bottom: "#3a2a2a", hem: 30, armor: "#6a5a4a", belt: "#2a1e1a" },
  hat: "song",
  mustache: i % 2 ? "thin" : null,
  seed: 50 + i,
});

export const KOREAN = (i = 0): Design => ({
  outfit: { top: ["#2f4f8a", "#3a5a8a"][i % 2], bottom: "#2a2a3a", hem: 30, belt: "#c0362c" },
  hat: "joseon",
  mustache: i % 2 ? "thin" : null,
  seed: 55 + i,
});

export const JAPANESE = (i = 0): Design => ({
  outfit: { top: "#2a2a34", bottom: "#3a2a2a", hem: 30, armor: ["#7a2a2a", "#3a3a4a"][i % 2], belt: "#2a1e1a" },
  hat: "kabuto",
  seed: 60 + i,
});

export const ASTRONAUT: Design = {
  outfit: { top: "#efefef", bottom: "#e2e2e6", boots: "#b8b8c0", belt: "#c0362c", pockets: true, cuffs: "#c0362c" },
  hat: "astronaut",
  seed: 70,
};
