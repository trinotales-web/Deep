import type { CharacterProps } from "../../kit/character";

// Character designs for "Spring 1945" (wartime Japan, 1893–2025).
type Design = Omit<CharacterProps, "pose" | "expression">;

/** Tokko pilot: leather flying helmet + goggles, hachimaki with the red sun, white silk scarf, flight suit. */
export const PILOT = (i = 0): Design => ({
  outfit: {
    top: ["#7a6044", "#6e5a42", "#806548"][i % 3],
    bottom: ["#6a5238", "#5e4c36", "#705840"][i % 3],
    boots: "#3a2a20",
    belt: "#3a2a20",
    buckle: "#c9a24a",
    strap: "#d9c58f",
    scarf: "#f4f1ea",
    collar: "high",
    collarColor: "#5a4430",
  },
  hat: "aviator",
  hatColor: ["#6b4a30", "#5e422c", "#74513a"][i % 3],
  hatAccent: "#c8262f",
  seed: 100 + i,
});

/** Young navy doctor (1945): white coat over navy uniform, IJN officer cap, round glasses. */
export const DOCTOR: Design = {
  outfit: { top: "#f2efe8", bottom: "#23283a", boots: "#1e1a1c", collar: "high", collarColor: "#23283a", buttons: "#d8d4cc", pockets: true, belt: null },
  hat: "officer",
  hatColor: "#23283a",
  hatAccent: "#1a1c26",
  glasses: "#3a3236",
  seed: 120,
};

/** The same doctor after the war, in civilian clothes. */
export const DOCTOR_CIVIL: Design = {
  outfit: { top: "#6a6a72", bottom: "#3a3a44", boots: "#2a2226", collar: "v", collarColor: "#f2efe8", buttons: "#2a2226", belt: null },
  hair: "short",
  hairColor: "#2a2226",
  glasses: "#3a3236",
  seed: 121,
};

/** Kambara at 100: white hair, cardigan, glasses. */
export const KAMBARA_OLD: Design = {
  outfit: { top: "#8a7a6a", bottom: "#4a4440", boots: "#3a3230", collar: "v", collarColor: "#efe6d2", buttons: "#5a4a3a", belt: null },
  hair: "sides",
  hairColor: "#e8e4e8",
  glasses: "#4a4040",
  seed: 122,
};

/** IJN officer (navy). */
export const NAVY_OFFICER = (i = 0): Design => ({
  outfit: { top: "#23283a", bottom: "#23283a", boots: "#1e1a1c", buttons: "#c9a24a", collar: "high", collarColor: "#23283a", cuffs: "#c9a24a", medals: i === 0, belt: null },
  hat: "officer",
  hatColor: "#23283a",
  hatAccent: "#1a1c26",
  mustache: i % 2 ? "thin" : null,
  mustacheColor: "#2a2226",
  seed: 130 + i,
});

/** Army general / staff officer. */
export const GENERAL = (i = 0): Design => ({
  outfit: { top: "#8f8a58", bottom: "#7f794c", boots: "#3a2a1e", belt: "#4a2f1e", buckle: "#c9a24a", buttons: "#c9a24a", collar: "high", collarColor: "#7d7849", medals: true, strap: "#4a2f1e" },
  hat: "officer",
  hatColor: "#8f8a58",
  hatAccent: "#a3302a",
  mustache: i % 2 ? "walrus" : "thin",
  mustacheColor: "#2a2226",
  glasses: i === 2 ? "#3a3236" : null,
  seed: 140 + i,
});

/** Army soldier / guard. */
export const SOLDIER = (i = 0): Design => ({
  outfit: { top: "#8f8a58", bottom: "#7f794c", boots: "#4a3524", belt: "#5a3a26", buckle: "#c9a24a", pockets: true, buttons: "#c9a24a", collar: "high", collarColor: "#7d7849" },
  hat: "fieldcap",
  hatColor: "#8f8a58",
  seed: 150 + i,
});

/** Umeda Kazuko, 14: white blouse, indigo monpe work trousers, hachimaki. */
export const UMEDA: Design = {
  outfit: { top: "#f4f1ea", bottom: "#3a4a72", boots: "#2a2226", collar: "v", collarColor: "#d8d4cc", belt: null },
  hair: "bob",
  hairColor: "#1e1a1c",
  hat: "headband",
  hatColor: "#f4f1ea",
  hatAccent: "#c8262f",
  seed: 160,
};

/** The older schoolgirls in the factory. */
export const GIRL = (i = 0): Design => ({
  outfit: { top: ["#f4f1ea", "#efe6d2", "#f2ede4"][i % 3], bottom: ["#4a3a5a", "#3a4a5a", "#5a4a3a"][i % 3], boots: "#2a2226", collar: "v", collarColor: "#d8d4cc", belt: null },
  hair: i % 2 ? "long" : "bun",
  hairColor: "#1e1a1c",
  hat: i % 3 === 2 ? "bandana" : null,
  hatColor: "#e8d8c0",
  seed: 170 + i,
});

/** Male schoolteacher in the wartime "national uniform". */
export const TEACHER: Design = {
  outfit: { top: "#7d7a56", bottom: "#6a6748", boots: "#3a2a1e", collar: "high", collarColor: "#6a6748", buttons: "#c9a24a", pockets: true },
  hair: "short",
  hairColor: "#2a2226",
  glasses: "#3a3236",
  mustache: "thin",
  mustacheColor: "#2a2226",
  seed: 180,
};

/** Umeda's father at home. */
export const FATHER: Design = {
  outfit: { top: "#5a5a62", robe: true, sash: "#3a3a44", collar: "wrap", collarColor: "#3a3a44" },
  hair: "short",
  hairColor: "#4a4448",
  mustache: "walrus",
  mustacheColor: "#3a3438",
  seed: 181,
};

/** Meiji-era chemist (1893). */
export const CHEMIST: Design = {
  outfit: { top: "#2a2a34", bottom: "#2a2a34", boots: "#1e1a1c", collar: "v", collarColor: "#f4f1ea", buttons: "#1e1a1c", belt: null },
  hair: "short",
  hairColor: "#1e1a1c",
  mustache: "walrus",
  mustacheColor: "#1e1a1c",
  seed: 190,
};

/** Factory / civilian worker in wartime Japan. */
export const WORKER = (i = 0): Design => ({
  outfit: { top: ["#7d7a56", "#6e6a52", "#5a5a4a"][i % 3], bottom: "#4a4838", boots: "#3a2a1e", pockets: true, belt: "#3a2a1e" },
  hat: i % 2 ? "fieldcap" : "bandana",
  hatColor: i % 2 ? "#6e6a52" : "#d8d0c0",
  hatAccent: "#6e6a52",
  seed: 200 + i,
});

/** Survivors in the burned-out cities (1945–50). */
export const SURVIVOR = (i = 0): Design => ({
  outfit: { top: ["#6a5a4a", "#5a5a52", "#7a6a5a", "#4a4a52"][i % 4], bottom: "#3a3632", boots: "#2a2420", patches: "#8a7a62", belt: null },
  hair: i % 3 === 1 ? "bun" : "short",
  hairColor: "#1e1a1c",
  hat: i % 4 === 0 ? "fieldcap" : null,
  hatColor: "#6d6a45",
  beard: i % 4 === 2 ? "stubble" : null,
  seed: 210 + i,
});

/** Black-market dealer. */
export const DEALER: Design = {
  outfit: { top: "#3a3438", bottom: "#2a2628", boots: "#1e1a1c", collar: "high", collarColor: "#2a2628", belt: null },
  hat: "fieldcap",
  hatColor: "#2a2628",
  beard: "stubble",
  mustache: "thin",
  mustacheColor: "#1e1a1c",
  seed: 220,
};

/** German soldier (Wehrmacht field grey, no insignia). */
export const GERMAN = (i = 0): Design => ({
  outfit: { top: "#6f7466", bottom: "#5e6256", boots: "#1e1a1c", belt: "#2a2622", buckle: "#9a9aa0", pockets: true, collar: "high", collarColor: "#3e4a3a" },
  hat: "stahlhelm",
  seed: 230 + i,
});

/** Allied bomber crewman: sheepskin flying jacket and leather helmet. */
export const AIRCREW = (i = 0): Design => ({
  outfit: { top: "#6a4a32", bottom: ["#5a5a4a", "#4a4a5a"][i % 2], boots: "#2a2220", collar: "high", collarColor: "#efe2c6", belt: null, pockets: true },
  hat: "aviator",
  hatColor: "#5a3e2a",
  mustache: i % 2 ? "walrus" : null,
  mustacheColor: "#7a4a2a",
  seed: 240 + i,
});

/** A present-day historian. */
export const RESEARCHER: Design = {
  outfit: { top: "#3a5a7a", bottom: "#2a2a34", boots: "#2a2226", collar: "v", collarColor: "#f4f1ea", belt: null },
  hair: "bob",
  hairColor: "#2a2226",
  glasses: "#2a2226",
  seed: 250,
};
