import type { CharacterProps } from "../kit/character";
import { palette } from "../kit";

// Channel mascots for "Zecten Historical" brand art.
type Design = Omit<CharacterProps, "pose" | "expression">;

/** The channel's host: a history explorer with a magnifying glass. */
export const EXPLORER: Design = {
  outfit: { top: "#c9a86a", bottom: "#7a5a3e", boots: "#5a3a26", pockets: true, belt: "#5a3a26", buckle: palette.gold, collar: "v", collarColor: "#b08e56", strap: "#7a4a2a" },
  hat: "explorer",
  mustache: "handlebar",
  mustacheColor: "#6a3e22",
  freckles: true,
  seed: 101,
};

export const PHARAOH: Design = {
  outfit: { top: "#f4efe0", bottom: "#f4efe0", boots: "#c9963f", hem: 30, belt: palette.gold, collar: "round", collarColor: palette.gold, cuffs: palette.gold },
  hat: "nemes",
  beard: "goatee",
  beardColor: "#2a2226",
  seed: 102,
};

export const NAPOLEON: Design = {
  outfit: { top: "#2a3a6a", bottom: "#f4f1ea", boots: "#1e1a1c", buttons: palette.gold, collar: "high", collarColor: "#c0362c", cuffs: "#c0362c", belt: null },
  hat: "bicorne",
  hair: "short",
  hairColor: "#2a2226",
  seed: 103,
};
