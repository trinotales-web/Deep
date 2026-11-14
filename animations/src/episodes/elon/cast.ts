import type { CharacterProps } from "../../kit/character";

// Character designs for the Elon Musk story (1971–2026). House style: white
// heads and white mitten gloves; crowds mix in warm brown skin tones.
type Design = Omit<CharacterProps, "pose" | "expression">;

export const ELON_HAIR = "#4a3226";
const TONES = ["#c98e62", "#b97c52", "#d39c6e", "#a96d48", "#8a5a3c"];
const GLOVES = "#f6f5f8";
/** Every other crowd member gets a brown skin tone. */
const mixTone = (i: number) => (i % 3 === 1 ? { skin: TONES[i % TONES.length], gloves: GLOVES } : {});
const HAIRS = ["#3a2a22", "#7a4a2a", "#c8a05a", "#2a2226", "#9a6a3a", "#5a3a26"];

/** Little Elon (Pretoria, 1970s): striped shirt, light-brown hair. */
export const ELON_KID: Design = {
  outfit: { top: "#4a7ac9", bottom: "#c8a978", boots: "#f2f2f2", collar: "round", print: "#f4f4f2", printKind: "bar" },
  hair: "short",
  hairColor: "#9a6a3a",
  seed: 1,
};

/** Schoolboy Elon (1980s): white shirt, school tie, grey trousers. */
export const ELON_SCHOOL: Design = {
  outfit: { top: "#f4f4f2", bottom: "#6a6e76", boots: "#2a2228", tie: "#7a2a3a", tieTip: 120, collar: null },
  hair: "parted",
  hairColor: "#7a5434",
  seed: 2,
};

/** Teenage Elon at home (coding, reading): green tee. */
export const ELON_TEEN: Design = {
  outfit: { top: "#4f8a5a", bottom: "#3a4a6a", boots: "#e8e8e8", collar: "round" },
  hair: "parted",
  hairColor: "#7a5434",
  seed: 3,
};

/** Elon at 17–24 (emigrating, Canada, university): denim jacket look. */
export const ELON_YOUNG: Design = {
  outfit: { top: "#5a7aa8", shirt: "#e8e2d0", bottom: "#2f3a5a", boots: "#5a3a26", collar: null },
  hair: "parted",
  hairColor: "#6a4a30",
  seed: 4,
};

/** Zip2 founder (1995–99): blue shirt, khakis. */
export const ELON_ZIP2: Design = {
  outfit: { top: "#6a8ab8", bottom: "#b8a07a", boots: "#4a3226", collar: "v", buttons: "#f4f1ea", pockets: true },
  hair: "parted",
  hairColor: ELON_HAIR,
  seed: 5,
};

/** PayPal-era Elon (1999–2002): navy suit, white shirt, red tie. */
export const ELON_SUIT: Design = {
  outfit: { top: "#2a3358", shirt: "#f4f4f2", tie: "#8a2a3a", bottom: "#2a3358", boots: "#2a2228" },
  hair: "parted",
  hairColor: ELON_HAIR,
  seed: 6,
};

/** SpaceX-founding Elon (2002–2008): black jacket over an open white shirt. */
export const ELON_2008: Design = {
  outfit: { top: "#2a2a32", shirt: "#f4f4f2", bottom: "#2a2a32", boots: "#1e1e22" },
  hair: "parted",
  hairColor: ELON_HAIR,
  seed: 7,
};

/** Tesla/SpaceX boss (2010s): black tee, dark jeans. */
export const ELON_TEE: Design = {
  outfit: { top: "#26262c", bottom: "#2f3a52", boots: "#1e1e22", collar: "round" },
  hair: "parted",
  hairColor: "#3a2a22",
  seed: 8,
};

/** Elon in the 2020s: black tee, black cap (optional). */
export const ELON_X = (cap = false): Design => ({
  outfit: { top: "#1f1f25", bottom: "#26262c", boots: "#1e1e22", collar: "round", print: "#f4f4f6", printKind: "x" },
  hair: cap ? "short" : "parted",
  hairColor: "#3a2a22",
  hat: cap ? "cap" : null,
  hatColor: "#18181c",
  seed: 9,
});

/** Elon in a dark suit, open collar (politics, ceremonies). */
export const ELON_FORMAL: Design = {
  outfit: { top: "#1f1f25", shirt: "#f4f4f2", bottom: "#1f1f25", boots: "#18181c" },
  hair: "parted",
  hairColor: "#3a2a22",
  seed: 10,
};

/** Maye Musk in the 1970s: model and dietitian, blonde bob, teal dress. */
export const MAYE: Design = {
  outfit: { top: "#4fb0a8", robe: true, bottom: "#4fb0a8", boots: "#e8e2d0", collar: "v", belt: "#f4f1ea" },
  hair: "bob",
  hairColor: "#e8c46a",
  seed: 20,
};

/** Errol Musk in the 1970s: engineer, short-sleeve shirt and tie. */
export const ERROL: Design = {
  outfit: { top: "#e8e2d0", tie: "#4a5a8a", tieTip: 120, bottom: "#6a5038", boots: "#3a2a20", pockets: true },
  hair: "short",
  hairColor: "#3a2a22",
  mustache: "thin",
  mustacheColor: "#3a2a22",
  seed: 21,
};

/** Kimbal Musk (Zip2 years): curly brown hair, green polo. */
export const KIMBAL: Design = {
  outfit: { top: "#3f7a5a", bottom: "#b8a07a", boots: "#4a3226", collar: "v" },
  hair: "curly",
  hairColor: "#6a4a30",
  seed: 22,
};

/** Peter Thiel (2000): grey suit, light-blue shirt. */
export const THIEL: Design = {
  outfit: { top: "#5a5e66", shirt: "#bcd6ec", bottom: "#4a4e56", boots: "#2a2228" },
  hair: "slick",
  hairColor: "#a08060",
  seed: 23,
};

/** Justine (honeymoon, 2000). */
export const JUSTINE: Design = {
  outfit: { top: "#e86a6a", robe: true, bottom: "#e86a6a", boots: "#e8e2d0", collar: "v" },
  hair: "long",
  hairColor: "#3a2420",
  seed: 24,
};

/** Board members / investors / bankers in suits. */
export const SUIT = (i = 0): Design => ({
  outfit: {
    top: ["#3a3e48", "#2a3358", "#4a4e56", "#5a4a3a"][i % 4],
    shirt: ["#f4f4f2", "#cfe0f0", "#f4f4f2"][i % 3],
    tie: ["#8a2a3a", "#2f4f9a", "#6a6a2a", "#3a6a5a"][i % 4],
    bottom: ["#3a3e48", "#2a3358", "#4a4e56", "#5a4a3a"][i % 4],
    boots: "#2a2228",
  },
  hair: (["short", "sides", "slick", "parted"] as const)[i % 4],
  hairColor: ["#9a9a9a", "#5a4a3a", "#c8c4c0", "#2a2226"][i % 4],
  glasses: i % 3 === 2 ? "#2a2228" : null,
  mustache: i % 4 === 3 ? "walrus" : null,
  mustacheColor: "#7a6a5a",
  ...mixTone(i),
  seed: 40 + i,
});

/** Martin Eberhard (Tesla co-founder): grey beard, glasses. */
export const EBERHARD: Design = {
  outfit: { top: "#6a7a8a", bottom: "#4a4e56", boots: "#2a2228", collar: "v" },
  hair: "short",
  hairColor: "#a8a4a0",
  beard: "full",
  beardColor: "#a8a4a0",
  glasses: "#2a2228",
  seed: 30,
};

/** Marc Tarpenning (Tesla co-founder): glasses, blue shirt. */
export const TARPENNING: Design = {
  outfit: { top: "#4a6a9a", bottom: "#b8a07a", boots: "#3a2a20", collar: "v", buttons: "#f4f1ea" },
  hair: "short",
  hairColor: "#7a5a3a",
  glasses: "#2a2228",
  seed: 31,
};

/** Cybertruck designer: bald, dark beard, black tee. */
export const DESIGNER: Design = {
  outfit: { top: "#26262c", bottom: "#2f3a52", boots: "#1e1e22", collar: "round" },
  hair: "sides",
  hairColor: "#3a3a3a",
  beard: "full",
  beardColor: "#3a3a3a",
  seed: 32,
};

/** Noland Arbaugh (2024): dark hair and beard, grey hoodie. */
export const NOLAND: Design = {
  outfit: { top: "#7a7f88", bottom: "#3a4a6a", boots: "#e8e8e8", collar: "round" },
  hair: "short",
  hairColor: "#3a2a22",
  beard: "stubble",
  beardColor: "#3a2a22",
  seed: 33,
};

/** Donald Trump: blond swept hair, navy suit, long red tie. */
export const TRUMP: Design = {
  outfit: { top: "#232a4a", shirt: "#f4f4f2", tie: "#c8262f", tieTip: 62, bottom: "#232a4a", boots: "#18181c" },
  hair: "swoop",
  hairColor: "#ecd07a",
  seed: 34,
};

/** Argentina's president (2025): untamed hair, leather jacket. */
export const MILEI: Design = {
  outfit: { top: "#2a2228", shirt: "#f4f4f2", bottom: "#2a2228", boots: "#18181c" },
  hair: "wild",
  hairColor: "#3a2a22",
  seed: 35,
};

/** SpaceX engineer (2008): dark polo, ID badge, headset. */
export const ENGINEER = (i = 0, headset = true): Design => ({
  outfit: { top: ["#2a2a32", "#2f4a7a", "#3a3a42", "#4a5a6a"][i % 4], bottom: ["#3a4a6a", "#b8a07a", "#2a2a32"][i % 3], boots: "#2a2228", collar: "v", badge: "#f4f4f2" },
  hair: (["short", "parted", "curly", "slick", "bob"] as const)[i % 5],
  hairColor: HAIRS[i % HAIRS.length],
  hat: headset ? "headset" : null,
  glasses: i % 4 === 2 ? "#2a2228" : null,
  ...mixTone(i),
  seed: 50 + i,
});

/** Factory worker (Tesla): grey work shirt, badge. */
export const WORKER = (i = 0): Design => ({
  outfit: { top: ["#6a6e76", "#4a5a6a", "#5a5e66"][i % 3], bottom: "#2f3a52", boots: "#2a2228", collar: "v", badge: "#f4f4f2", pockets: true },
  hair: (["short", "curly", "parted", "bob"] as const)[i % 4],
  hairColor: HAIRS[(i + 2) % HAIRS.length],
  glasses: i % 2 ? "#3a3a42" : null,
  ...mixTone(i),
  seed: 60 + i,
});

/** Office / tech staff (Twitter): hoodies and tees. */
export const STAFF = (i = 0): Design => ({
  outfit: { top: ["#4a7ac9", "#c86a4a", "#5a9a7a", "#8a6ab0", "#e0b04a", "#5a5e66"][i % 6], bottom: ["#2f3a52", "#3a3a42", "#6a5a4a"][i % 3], boots: ["#e8e8e8", "#2a2228"][i % 2], collar: "round" },
  hair: (["curly", "bob", "short", "long", "parted", "bun"] as const)[i % 6],
  hairColor: HAIRS[i % HAIRS.length],
  glasses: i % 3 === 0 ? "#2a2228" : null,
  ...mixTone(i),
  seed: 70 + i,
});

/** Fans / protesters / voters: casual, mixed. */
export const PERSON = (i = 0): Design => ({
  outfit: { top: ["#c8462f", "#3a6ab0", "#e0b04a", "#4a8a5a", "#8a5ab0", "#e86a8a", "#5a5e66"][i % 7], bottom: ["#2f3a52", "#3a3a42", "#6a5a4a", "#4a4e56"][i % 4], boots: ["#e8e8e8", "#2a2228", "#6a4a2a"][i % 3], collar: "round" },
  hair: (["short", "long", "curly", "bob", "parted", "bun", "slick"] as const)[i % 7],
  hairColor: HAIRS[(i * 2) % HAIRS.length],
  hat: i % 5 === 3 ? "cap" : i % 7 === 5 ? "beanie" : null,
  hatColor: ["#c8262f", "#2a3358", "#3c6aa0"][i % 3],
  glasses: i % 4 === 2 ? "#2a2228" : null,
  ...mixTone(i),
  seed: 80 + i,
});

/** School bullies (uniform shirts, angry). */
export const BULLY = (i = 0): Design => ({
  outfit: { top: "#f4f4f2", bottom: "#6a6e76", boots: "#2a2228", tie: "#7a2a3a", tieTip: 120 },
  hair: (["spiky", "short", "curly"] as const)[i % 3],
  hairColor: ["#c8a05a", "#3a2a22", "#9a5a2a"][i % 3],
  ...mixTone(i + 2),
  seed: 90 + i,
});

/** Doctor (white coat) and nurse (teal scrubs). */
export const DOCTOR: Design = { outfit: { top: "#f4f6f8", bottom: "#4a5a6a", boots: "#2a2228", collar: "v", pockets: true, badge: "#2f6fa8" }, hair: "short", hairColor: "#5a4a3a", glasses: "#2a2228", seed: 100 };
export const NURSE: Design = { outfit: { top: "#4fa8a0", bottom: "#4fa8a0", boots: "#f2f2f2", collar: "v", pockets: true }, hair: "bun", hairColor: "#2a2226", skin: TONES[1], gloves: GLOVES, seed: 101 };

/** Russian officials in fur hats. */
export const RUSSIAN = (i = 0): Design => ({
  outfit: { top: ["#3a3e48", "#4a3a32"][i % 2], shirt: "#f4f4f2", tie: ["#5a2a2a", "#2a3a5a"][i % 2], bottom: "#2a2a32", boots: "#18181c" },
  hat: "ushanka",
  hatColor: ["#6a5240", "#5a5a5e"][i % 2],
  mustache: i % 2 ? "walrus" : null,
  mustacheColor: "#6a5a4a",
  seed: 110 + i,
});

/** Astronaut in a white suit (Crew Dragon / Starman). */
export const ASTRONAUT = (i = 0): Design => ({
  outfit: { top: "#f2f2f4", bottom: "#f2f2f4", boots: "#2a2a32", sleeves: "#f2f2f4", belt: "#2a2a32", collar: "high", collarColor: "#2a2a32" },
  hat: "astronaut",
  ...(i === 1 ? { skin: TONES[2], gloves: GLOVES } : {}),
  seed: 120 + i,
});

/** Backpacker in the youth hostel. */
export const BACKPACKER = (i = 0): Design => ({
  outfit: { top: ["#c86a4a", "#4a8a5a", "#e0b04a", "#5a7aa8", "#8a5ab0"][i % 5], bottom: ["#3a4a6a", "#6a5a4a"][i % 2], boots: "#5a3a26", collar: "round", strap: "#6a4a2a" },
  hair: (["long", "curly", "short", "bun", "spiky"] as const)[i % 5],
  hairColor: HAIRS[(i + 1) % HAIRS.length],
  ...mixTone(i),
  seed: 130 + i,
});

/** Judge in a black robe (white hair, glasses). */
export const JUDGE: Design = {
  ...SUIT(2),
  outfit: { top: "#1c1a20", shirt: "#f4f4f2", bottom: "#1c1a20", boots: "#2a2228" },
  hair: "sides",
  hairColor: "#dcd8d2",
  glasses: "#2a2228",
  seed: 77,
};
