import type { CharacterProps } from "../../kit/character";

// Character designs for the First Emperor's tomb (Qin dynasty, 3rd century BC,
// plus 1974 farmers and modern archaeologists), matched to the reference short.
type Design = Omit<CharacterProps, "pose" | "expression">;

const BLACK = "#1e1a20";
const RED = "#b8322a";
export const CLAY = "#b88a62";

/** Qin Shi Huang, the First Emperor: black robe with red trim, beaded mian crown, goatee. */
export const EMPEROR: Design = {
  outfit: { top: BLACK, robe: true, trim: RED, belt: RED, collar: "wrap", collarColor: RED },
  hat: "mian",
  hatColor: BLACK,
  hatAccent: RED,
  mustache: "thin",
  mustacheColor: "#1e1a1c",
  beard: "goatee",
  beardColor: "#1e1a1c",
  seed: 300,
};

/** Ying Zheng at 13, just crowned king of Qin. */
export const BOY_KING: Design = {
  outfit: { top: BLACK, robe: true, trim: RED, belt: RED, collar: "wrap", collarColor: RED },
  hat: "mian",
  hatColor: BLACK,
  hatAccent: RED,
  seed: 301,
};

/** Huhai, the Second Emperor. */
export const HUHAI: Design = {
  outfit: { top: "#2a2430", robe: true, trim: "#c9a24a", belt: RED, collar: "wrap", collarColor: "#c9a24a" },
  hat: "mian",
  hatColor: BLACK,
  hatAccent: "#c9a24a",
  mustache: "thin",
  mustacheColor: "#1e1a1c",
  seed: 302,
};

/** Fusu, the eldest son. */
export const FUSU: Design = {
  outfit: { top: "#e8e2d4", robe: true, trim: "#5a5a6a", belt: "#5a5a6a", collar: "wrap", collarColor: "#5a5a6a" },
  hat: "guan",
  mustache: "thin",
  mustacheColor: "#1e1a1c",
  seed: 303,
};

/** Tomb worker (the "you" of the story is WORKER(0): orange head wrap). */
export const WORKER = (i = 0): Design => ({
  outfit: {
    top: ["#c9b28a", "#b8a07a", "#c2ac86", "#a8987a"][i % 4],
    bottom: "#8a7a5e",
    boots: "#c9a274",
    collar: "wrap",
    collarColor: "#a8916a",
    hem: 30,
    rope: "#7a5a3a",
    belt: null,
    patches: i % 2 ? "#9a8460" : null,
  },
  hat: "wrap",
  hatColor: ["#c8662f", "#8a8790", "#7a5a3e", "#9a8a6a"][i % 4],
  beard: "stubble",
  mustache: i % 3 === 1 ? "walrus" : null,
  mustacheColor: "#4a4040",
  seed: 310 + i,
});

/** Qin official / adviser: dark robe, black cap, thin mustache and goatee. */
export const OFFICIAL = (i = 0): Design => ({
  outfit: { top: ["#2a2430", "#4a2e4a", "#3a2a26", "#2a3438"][i % 4], robe: true, belt: ["#b8322a", "#c9a24a", "#5a6a3a", "#8a3a3a"][i % 4], collar: "wrap", collarColor: "#e8e2d4" },
  hat: "guan",
  mustache: "thin",
  mustacheColor: "#1e1a1c",
  beard: i % 2 ? "goatee" : null,
  beardColor: "#1e1a1c",
  seed: 320 + i,
});

/** Zhao Gao, the scheming eunuch adviser (no beard). */
export const ZHAO_GAO: Design = {
  outfit: { top: "#3a2a3a", robe: true, belt: "#c9a24a", collar: "wrap", collarColor: "#e8e2d4" },
  hat: "guan",
  seed: 330,
};

/** Palace guard: lamellar armour, side topknot. */
export const GUARD = (i = 0): Design => ({
  outfit: { top: "#6a3a34", bottom: "#4a3a34", boots: "#2a2220", lamellar: "#3a3438", belt: "#2a2220", buckle: "#c9a24a", collar: "round" },
  hair: "sidebun",
  hairColor: "#1e1a1c",
  mustache: i % 2 ? "thin" : null,
  mustacheColor: "#1e1a1c",
  seed: 340 + i,
});

/** Jing Ke, the assassin. */
export const JING_KE: Design = {
  outfit: { top: "#4a5a6a", robe: true, belt: "#2a2a34", collar: "wrap", collarColor: "#2a2a34" },
  hair: "topknot",
  hairColor: "#1e1a1c",
  beard: "stubble",
  mustache: "thin",
  mustacheColor: "#1e1a1c",
  seed: 350,
};

/** The court doctor who throws his medicine bag. */
export const COURT_DOCTOR: Design = {
  outfit: { top: "#7a5a3a", robe: true, belt: "#4a3a2a", collar: "wrap", collarColor: "#e8e2d4" },
  hair: "topknot",
  hairColor: "#d8d4d8",
  beard: "goatee",
  beardColor: "#e8e4e8",
  mustache: "thin",
  mustacheColor: "#e8e4e8",
  seed: 351,
};

/** Xu Fu, the sorcerer sent to find the islands of immortality. */
export const XU_FU: Design = {
  outfit: { top: "#d8e2e8", robe: true, belt: "#3a5a7a", collar: "wrap", collarColor: "#3a5a7a" },
  hair: "topknot",
  hairColor: "#e8e4e8",
  beard: "goatee",
  beardColor: "#eceaf0",
  mustache: "walrus",
  mustacheColor: "#eceaf0",
  seed: 352,
};

/** Children sent across the sea. */
export const CHILD = (i = 0): Design => ({
  outfit: { top: ["#c9b28a", "#d8a0a8", "#9ac0d8", "#c8c07a"][i % 4], bottom: "#8a7a5e", boots: "#c9a274", collar: "wrap", collarColor: "#a8916a", hem: 30, rope: "#7a5a3a", belt: null },
  hair: i % 2 ? "topknot" : "bob",
  hairColor: "#1e1a1c",
  seed: 360 + i,
});

/** Sima Qian, the Han historian. */
export const SIMA_QIAN: Design = {
  outfit: { top: "#2f3f5a", robe: true, belt: "#c9a24a", collar: "wrap", collarColor: "#e8e2d4" },
  hat: "guan",
  mustache: "thin",
  mustacheColor: "#1e1a1c",
  beard: "goatee",
  beardColor: "#1e1a1c",
  glasses: null,
  seed: 370,
};

/** The emperor's wives. */
export const WIFE = (i = 0): Design => ({
  outfit: { top: ["#8a5aa8", "#d88aa0", "#d9a441", "#6aa88a"][i % 4], robe: true, belt: ["#e9c66a", "#8a3a5a", "#8a5a2a", "#2a5a4a"][i % 4], collar: "wrap", collarColor: "#f4f1ea" },
  hair: "palace",
  hairColor: "#1e1a1c",
  seed: 380 + i,
});

/** Villagers across the empire. */
export const VILLAGER = (i = 0): Design => ({
  outfit: { top: ["#9a8a6a", "#7a8a6a", "#8a7a6a"][i % 3], bottom: "#6a5a4a", boots: "#c9a274", collar: "wrap", collarColor: "#6a5a4a", hem: 30, rope: "#5a4a3a", belt: null },
  hair: "topknot",
  hairColor: "#1e1a1c",
  beard: i % 2 ? "stubble" : null,
  seed: 390 + i,
});

/** Rebels (red head cloths). */
export const REBEL = (i = 0): Design => ({
  outfit: { top: ["#7a6a5a", "#6a5a4a"][i % 2], bottom: "#4a3a2e", boots: "#c9a274", collar: "wrap", collarColor: "#4a3a2e", hem: 34, rope: "#5a3a26", belt: null, patches: "#8a7a62" },
  hat: "wrap",
  hatColor: "#b8322a",
  beard: "stubble",
  seed: 395 + i,
});

/** 1974 farmers: blue jackets, white head towel (Shaanxi style) or cap. */
export const FARMER = (i = 0): Design => ({
  outfit: { top: ["#3f5a86", "#4a6a8a", "#5a6a7a"][i % 3], bottom: "#2f3f5a", boots: "#2a2226", collar: "high", collarColor: "#3a5078", buttons: "#2a2226", pockets: true, belt: null },
  hat: i % 2 ? "maocap" : "headband",
  hatColor: i % 2 ? "#4a5a7a" : "#f4f1ea",
  beard: "stubble",
  seed: 400 + i,
});

/** Modern archaeologist: hard hat, hi-vis vest. */
export const ARCHAEOLOGIST = (i = 0): Design => ({
  outfit: { top: ["#3a6a9a", "#f4f1ea", "#5a7a5a"][i % 3], bottom: "#2f3f5a", boots: "#4a3a2e", vest: "#f08a2a", belt: null, collar: "v", collarColor: "#2f3f5a" },
  hat: "hardhat",
  hatColor: ["#f2c84a", "#f4f1ea", "#f2c84a"][i % 3],
  glasses: i === 1 ? "#2a2226" : null,
  seed: 410 + i,
});

/** Scientist in a lab coat. */
export const SCIENTIST = (i = 0): Design => ({
  outfit: { top: "#f2efe8", bottom: "#3a3a44", boots: "#2a2226", collar: "v", collarColor: "#3a5a7a", buttons: "#d8d4cc", pockets: true, belt: null },
  hair: i % 2 ? "bob" : "short",
  hairColor: "#1e1a1c",
  glasses: "#2a2226",
  seed: 420 + i,
});

/** Modern tourists at the museum. */
export const TOURIST = (i = 0): Design => ({
  outfit: { top: ["#d9433a", "#3f8ac8", "#8a5aa8", "#f2c84a"][i % 4], bottom: ["#2f3f5a", "#4a4a52", "#2a2a34", "#5a4a3a"][i % 4], boots: "#2a2226", collar: "round", belt: null },
  hair: ["short", "bob", "long", "short"][i % 4] as Design["hair"],
  hairColor: ["#1e1a1c", "#5a3a26", "#1e1a1c", "#c9963f"][i % 4],
  hat: i % 4 === 3 ? "maocap" : null,
  hatColor: "#3f5a86",
  seed: 430 + i,
});

/** Terracotta warrior (clay head and hands). `paint` shows the original colours. */
export const TERRACOTTA = (i = 0, paint = false): Design => ({
  skin: paint ? "#f2c9b8" : CLAY,
  outfit: {
    top: paint ? ["#b8322a", "#3f8a5a", "#7a4a9a", "#2f5fa8"][i % 4] : "#a87a52",
    bottom: paint ? "#2f5fa8" : "#9a7048",
    boots: paint ? "#2a2220" : "#8a6440",
    lamellar: paint ? "#3a3438" : "#8f6a46",
    belt: null,
    collar: "round",
  },
  hair: "sidebun",
  hairColor: paint ? "#1e1a20" : "#8a6440",
  mustache: i % 2 ? "thin" : "walrus",
  mustacheColor: paint ? "#1e1a20" : "#7a5a3a",
  seed: 440 + i,
});
