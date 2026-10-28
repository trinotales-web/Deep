// Rig geometry helpers (numbers match Character.tsx: head radius 100, origin
// between the feet). Use them to put a hand or a prop exactly where you want it.

const SHOULDER: [number, number] = [50, 206];
const UPPER = 60;
const FORE = 56;
/** From the wrist to the middle of the fist, where held props sit. */
const GRIP = 30;

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Two-bone IK for the front arm: [shoulder, elbow] angles that put the hand's
 * grip on `target` (world). Elbow bends down/back, like a natural reach.
 */
export const reachArm = (x: number, y: number, s: number, facing: 1 | -1, target: [number, number]): [number, number] => {
  const sx = x + facing * SHOULDER[0] * s;
  const sy = y + SHOULDER[1] * s;
  const dx = (target[0] - sx) * facing;
  const dy = target[1] - sy;
  const L1 = UPPER * s;
  const L2 = (FORE + GRIP) * s;
  const d = Math.min(Math.hypot(dx, dy), L1 + L2 - 0.01);
  const phi = Math.atan2(dx, -dy);
  const a = Math.acos(clamp1((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
  const b = Math.acos(clamp1((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2)));
  return [phi - a, Math.PI - b];
};

/** World position of the front eye (for `look` ≈ 0.5, no head tilt). */
export const frontEye = (x: number, y: number, s: number, facing: 1 | -1): [number, number] => [x + facing * 46 * s, y + 310 * s];

/** World position of the head centre (no head tilt). */
export const headCenter = (x: number, y: number, s: number): [number, number] => [x, y + 308 * s];
