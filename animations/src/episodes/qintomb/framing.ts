import type { CameraAdjust } from "../../kit";

/**
 * Per-shot close-up framing (v2): zoom multiplier `z` and frame-centre offset
 * (`x`, `y`, world px) applied on top of each shot's own camera. Captions are off,
 * so shots can use the full frame down to the bottom edge.
 */
export const FRAMING: Record<string, CameraAdjust> = {};
