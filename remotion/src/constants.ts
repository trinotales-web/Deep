export const FPS = 30;
export const SCENE_DURATION = 15 * FPS; // 450 frames = 15 seconds per scene
export const TRANSITION_DURATION = 1 * FPS; // 30 frames = 1 second
export const NUM_SCENES = 6;
export const TOTAL_FRAMES =
  NUM_SCENES * SCENE_DURATION - (NUM_SCENES - 1) * TRANSITION_DURATION; // 2550

export const COLORS = {
  bg: "#1c1a17",       // Deep charcoal-brown
  paper: "#ede8d8",    // Aged paper cream
  mist: "#c8bfad",     // Morning mist
  gold: "#c9a227",     // Kintsugi gold
  sage: "#7a8c6e",     // Weathered sage
  cherry: "#d4688c",   // Cherry blossom pink
  stone: "#9b8e82",    // River stone grey
  dark: "#0f0e0c",     // Near-black ink
} as const;
