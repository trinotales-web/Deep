// Framing helper for close-ups: place a character so its head centre lands at
// a fraction (fx, fy) of the 1920×1080 frame for a given camera. The head
// centre sits ~308 units above the character origin (at scale 1).

export const HEAD_UP = 308;

export type Cam = { zoom: number; x?: number; y?: number };

export const atHead = (cam: Cam, fx: number, fy: number, s: number, W = 1920, H = 1080) => {
  const X = (cam.x ?? 0) + (fx * W - W / 2) / cam.zoom;
  const Y = (cam.y ?? 0) + (H / 2 - fy * H) / cam.zoom;
  return { x: Math.round(X), y: Math.round(Y - HEAD_UP * s) };
};

/** World point for a frame fraction. */
export const atFrame = (cam: Cam, fx: number, fy: number, W = 1920, H = 1080) => ({
  x: Math.round((cam.x ?? 0) + (fx * W - W / 2) / cam.zoom),
  y: Math.round((cam.y ?? 0) + (H / 2 - fy * H) / cam.zoom),
});
