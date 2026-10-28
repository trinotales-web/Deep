import type { CharacterProps } from "../../kit/character";

// Character designs for "The Wooden Wall" (Athens, 480s BC).
type Design = Omit<CharacterProps, "pose" | "expression">;

const tunic = (top: string, extra: Partial<NonNullable<Design["outfit"]>> = {}) => ({
  top,
  bottom: "#e9d6b4",
  boots: "#7a5232",
  hem: 26,
  rope: "#8a6a3a",
  ...extra,
});

// --- the few men who stayed behind (poor men + temple keepers)
export const DEFENDERS: Design[] = [
  { outfit: tunic("#b9a27a", { patches: "#8f7a56" }), hair: "short", hairColor: "#3a2a22", beard: "stubble", seed: 1 },
  { outfit: tunic("#9a8a6a", { patches: "#c2ae86" }), hair: "spiky", hairColor: "#2a2226", beard: "full", beardColor: "#2a2226", seed: 2 },
  { outfit: tunic("#c7b48e", { patches: "#9a8562" }), hair: "sides", hairColor: "#cfc9cf", beard: "full", beardColor: "#cfc9cf", seed: 3 },
  { outfit: tunic("#a58e66"), hair: "short", hairColor: "#5a3a26", freckles: true, seed: 4 },
];

export const TEMPLE_KEEPER: Design = {
  outfit: { top: "#f1ece0", robe: true, trim: "#2f5f9a", rope: "#c9963f", sash: "#e2d6be" },
  hat: "wreath",
  hair: "sides",
  hairColor: "#d8d2cc",
  beard: "full",
  beardColor: "#d8d2cc",
  seed: 5,
};

// --- Persians
export const PERSIAN = (i = 0): Design => {
  const robes = ["#6b3f7a", "#2f5f9a", "#c08a2a", "#7a2a2a"];
  const caps = ["#e6d3a3", "#efe2c4", "#d9c48e"];
  return {
    outfit: {
      top: robes[i % robes.length],
      bottom: "#5a4a6a",
      boots: "#4a3524",
      hem: 30,
      trim: "#e9ba41",
      belt: "#4a2f1e",
      cuffs: "#e9ba41",
    },
    hat: "persian",
    hatColor: caps[i % caps.length],
    beard: "full",
    beardColor: "#1f1a1c",
    seed: 20 + i,
  };
};

export const XERXES: Design = {
  outfit: { top: "#6b2f7a", robe: true, trim: "#e9ba41", cuffs: "#e9ba41", belt: "#e9ba41", buckle: "#c0362c", sash: "#8e3a9a" },
  hat: "crown",
  beard: "royal",
  beardColor: "#33262a",
  mustache: "handlebar",
  mustacheColor: "#1f1a1c",
  seed: 40,
};

export const PYTHIA: Design = {
  outfit: { top: "#f4efe6", robe: true, trim: "#c9963f", rope: "#c9963f" },
  hat: "veil",
  hatColor: "#6e4a8f",
  hatAccent: "#e9ba41",
  hair: "long",
  hairColor: "#2a2226",
  seed: 50,
};

// --- Athenians
export const ENVOY = (i = 0): Design => ({
  outfit: tunic(["#d8c9a6", "#c9b48a"][i % 2], { sash: ["#2f5f9a", "#a3302a"][i % 2] }),
  hair: i % 2 ? "spiky" : "short",
  hairColor: "#3a2a22",
  beard: "full",
  beardColor: "#3a2a22",
  seed: 60 + i,
});

export const GENERAL: Design = {
  outfit: tunic("#c4a26a", { armor: "#c9963f", sash: "#a3302a", rope: null }),
  hat: "corinthian",
  beard: "full",
  beardColor: "#3a2a22",
  seed: 70,
};

export const CITIZEN = (i = 0): Design => {
  const women = i % 3 === 1;
  const kid = i % 3 === 2;
  const tops = ["#c96a4a", "#5f8fb0", "#d9b45a", "#8a6aa5", "#6f9a6a"];
  return {
    outfit: women ? { top: tops[i % tops.length], robe: true, rope: "#e9ba41" } : tunic(tops[i % tops.length]),
    hair: women ? (i % 2 ? "bun" : "long") : kid ? "spiky" : "short",
    hairColor: ["#3a2a22", "#5a3a26", "#2a2226"][i % 3],
    beard: !women && !kid && i % 2 ? "full" : null,
    beardColor: "#3a2a22",
    freckles: kid,
    seed: 80 + i,
  };
};

export const SAILOR = (i = 0): Design => ({
  outfit: tunic(["#d8c9a6", "#b9a27a"][i % 2]),
  hat: "corinthian",
  hatAccent: ["#2f5f9a", "#c0362c"][i % 2],
  beard: "full",
  beardColor: "#3a2a22",
  seed: 90 + i,
});
