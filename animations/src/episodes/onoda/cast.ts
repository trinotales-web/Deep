import type { CharacterProps } from "../../kit/character";

// Reusable character designs for this episode.

export const ONODA: Omit<CharacterProps, "pose" | "expression"> = {
  outfit: {
    top: "#8f8a58",
    bottom: "#7f794c",
    boots: "#4a3524",
    belt: "#5a3a26",
    buckle: "#c9a24a",
    pockets: true,
    buttons: "#c9a24a",
    collar: "high",
    collarColor: "#7d7849",
  },
  hat: "fieldcap",
  hatColor: "#8f8a58",
  hair: null,
  freckles: false,
  seed: 3,
};

export const MAJOR: Omit<CharacterProps, "pose" | "expression"> = {
  outfit: {
    top: "#6d6a45",
    bottom: "#5f5c3c",
    boots: "#3a2a1e",
    belt: "#4a2f1e",
    buckle: "#c9a24a",
    buttons: "#c9a24a",
    collar: "high",
    collarColor: "#5f5c3c",
    medals: true,
    strap: "#4a2f1e",
  },
  hat: "fieldcap",
  hatColor: "#6d6a45",
  hatAccent: "#e9ba41",
  mustache: "thin",
  seed: 11,
};
