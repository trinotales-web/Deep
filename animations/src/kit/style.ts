// Style constants measured from the reference videos (1080x1920 shorts).
// Heads: lit #f6f5f8, shadow #bdb6c4. Outline: warm near-black #211b20.
// Shadow tones are the lit color multiplied by a cool tint (~0.74, 0.72, 0.78).

export const INK = "#211b20";
export const SKIN = "#f6f5f8";
export const SKIN_SHADOW = "#bdb6c4";
export const GLOVE = "#f6f5f8";
export const CAPTION_RED = "#fe5649";

export const DEFAULT_SHADOW_MUL: [number, number, number] = [0.74, 0.72, 0.79];

export const palette = {
  ink: INK,
  skin: SKIN,
  blush: "#f2a7b0",
  freckle: "#c98a6e",
  mouth: "#5b1d24",
  tongue: "#e2707a",
  hairBrown: "#7a4a2a",
  hairDark: "#2a2226",
  hairGrey: "#cfc9cf",
  olive: "#7e8469",
  oliveLight: "#8a8f6f",
  armyGreen: "#5f7a3a",
  khaki: "#c8a978",
  navy: "#2a3358",
  red: "#c0362c",
  gold: "#e9ba41",
  wood: "#a0703f",
  woodDark: "#6e4a2c",
  leather: "#6b4a2f",
  boot: "#5a3a26",
  paper: "#efe4c8",
  stone: "#8a8790",
  sky: "#8ec9ee",
  skyTop: "#4f9fd9",
  sea: "#2f8fc4",
  jungle: "#4f8f3a",
  jungleDark: "#356b2a",
  sand: "#e6cf98",
  night: "#18203d",
  nightTop: "#0c1128",
  fire: "#ffb22e",
  fireCore: "#fff1a8",
  fireRed: "#e8562a",
} as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const rgbToHex = ([r, g, b]: [number, number, number]) =>
  "#" +
  [r, g, b]
    .map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0"))
    .join("");

export const mixHex = (a: string, b: string, t: number) => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex([0, 1, 2].map((i) => ca[i] + (cb[i] - ca[i]) * t) as [number, number, number]);
};

export const mulHex = (hex: string, mul: [number, number, number]) => {
  const c = hexToRgb(hex);
  return rgbToHex([c[0] * mul[0], c[1] * mul[1], c[2] * mul[2]]);
};

/** Darken (amount > 0) or lighten (amount < 0) a color. */
export const shadeHex = (hex: string, amount: number) =>
  amount >= 0 ? mixHex(hex, "#000000", amount) : mixHex(hex, "#ffffff", -amount);
