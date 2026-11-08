import { rng } from "./random";

// Crowd placement without overlapping people: rows from far (small, high) to
// near (big, low), evenly spaced slots with a little jitter, alternate rows
// staggered by half a slot so back-row heads show between front-row heads.
// Returned far → near (draw in this order / use the index for z).

export type CrowdSpot = { x: number; y: number; s: number; i: number; row: number };

export const crowdSpots = (o: {
  n: number;
  x0: number;
  x1: number;
  /** Feet y of the far and near rows. */
  yFar: number;
  yNear: number;
  sFar: number;
  sNear: number;
  rows?: number;
  seed?: number;
  /** Person width in units of head diameter (2.6 ≈ shoulder to shoulder with a margin). */
  width?: number;
}): CrowdSpot[] => {
  const r = rng(o.seed ?? 1);
  const rows = o.rows ?? Math.max(1, Math.min(5, Math.round(Math.sqrt(o.n / 3))));
  const caps: number[] = [];
  for (let k = 0; k < rows; k++) {
    const q = rows === 1 ? 1 : k / (rows - 1);
    const s = o.sFar + (o.sNear - o.sFar) * q;
    caps.push(Math.max(1, Math.floor((o.x1 - o.x0) / (100 * s * (o.width ?? 2.6)))));
  }
  const total = caps.reduce((a, b) => a + b, 0);
  const counts = caps.map((c) => Math.min(c, Math.round((o.n * c) / total)));
  const out: CrowdSpot[] = [];
  let i = 0;
  counts.forEach((m, k) => {
    const q = rows === 1 ? 1 : k / (rows - 1);
    const s = o.sFar + (o.sNear - o.sFar) * q;
    const y = o.yFar + (o.yNear - o.yFar) * q;
    const slot = (o.x1 - o.x0) / Math.max(1, m);
    for (let j = 0; j < m; j++) {
      const stagger = k % 2 ? 0.5 : 0.25;
      const x = o.x0 + slot * (j + stagger) + (r() - 0.5) * slot * 0.18;
      out.push({ x, y: y + (r() - 0.5) * 14 * s, s: s * (0.95 + r() * 0.1), i: i++, row: k });
    }
  });
  return out;
};
