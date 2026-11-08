import type { Pose } from "./Character";

// Pose helpers. All angles in radians (CCW). Front arm = facing side.
// Rules that keep hands readable: raised arms open outward (a V beside the head)
// and stay behind the head layer, so a hand never covers the face; gestures ease
// in and out instead of snapping (see `blendAt`).

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** Standing idle with breathing, a slow weight shift and loose arms. */
export const idle = (frame: number, seed = 0): Pose => {
  const t = frame * 0.06 + seed;
  return {
    armF: [0.16 + Math.sin(t) * 0.05, 0.16 + Math.sin(t * 1.3 + 1) * 0.06],
    armB: [-0.16 - Math.sin(t + 0.7) * 0.05, -0.16 - Math.sin(t * 1.2 + 2) * 0.06],
    lean: Math.sin(t * 0.5 + seed) * 0.012,
    headTilt: Math.sin(t * 0.7 + seed * 2) * 0.02,
  };
};

/** Walk cycle. `speed` in cycles per second at 30fps. */
export const walk = (frame: number, speed = 1.1, seed = 0): Pose => {
  const p = (frame / 30) * speed * Math.PI * 2 + seed;
  const sw = Math.sin(p);
  return {
    legF: sw * 0.42,
    legB: -sw * 0.42,
    armF: [-sw * 0.38 + 0.08, 0.3 + Math.max(0, -sw) * 0.15],
    armB: [sw * 0.38 - 0.08, -0.3 - Math.max(0, sw) * 0.15],
    bob: Math.abs(Math.cos(p)) * 9,
    lean: -0.04,
    headTilt: Math.sin(p * 2) * 0.012,
  };
};

export const run = (frame: number, seed = 0): Pose => {
  const p = (frame / 30) * 2.2 * Math.PI * 2 + seed;
  const sw = Math.sin(p);
  return {
    legF: sw * 0.75,
    legB: -sw * 0.75,
    armF: [-sw * 0.9 + 0.2, 1.2],
    armB: [sw * 0.9 + 0.2, 1.2],
    bob: Math.abs(Math.cos(p)) * 18,
    lean: -0.14,
    handF: "fist",
    handB: "fist",
  };
};

/** Pointing ahead with the index finger, arm slightly below horizontal. */
export const point = (frame: number): Pose => ({
  armF: [1.32 + Math.sin(frame * 0.15) * 0.03, 0.16],
  armB: [-0.16 - Math.sin(frame * 0.06) * 0.03, -0.16],
  handF: "point",
  lean: -0.02,
});

export const salute: Pose = { armF: [2.75, 0.95], armB: [-0.08, -0.05], armsOverHead: true };

/** Cheering: arms open in a V beside the head (never over the face). */
export const armsUp = (frame: number): Pose => ({
  armF: [2.05 + Math.sin(frame * 0.4) * 0.1, 0.55 + Math.sin(frame * 0.4) * 0.08],
  armB: [-2.05 - Math.sin(frame * 0.4 + 1) * 0.1, -0.55 - Math.sin(frame * 0.4 + 1) * 0.08],
  bob: Math.abs(Math.sin(frame * 0.4)) * 10,
});

export const handsOnHips: Pose = { armF: [0.7, -2.0], armB: [-0.7, 2.0], handF: "fist", handB: "fist" };

export const shrug = (t: number): Pose => {
  const k = ease(Math.max(0, Math.min(1, t * 3)));
  return { armF: [0.9 * k, -1.9 * k], armB: [-0.9 * k, 1.9 * k], headTilt: 0.08 * k };
};

export const holdOut: Pose = { armF: [1.1, 0.4], armB: [-0.2, -0.2] };

export const think: Pose = { armF: [0.5, 2.5], armB: [-0.4, 1.6], headTilt: 0.06, handF: "fist" };

export const sit = (frame: number): Pose => ({
  sit: true,
  armF: [0.5, 0.6],
  armB: [-0.1, 0.8],
  bob: Math.sin(frame * 0.08) * 1.5,
});

/** Startled: hands up beside the chest, palms out, a small tremble. */
export const scared = (frame: number): Pose => ({
  armF: [0.78 + Math.sin(frame * 1.7) * 0.04, 1.7],
  armB: [-0.78 - Math.sin(frame * 1.9) * 0.04, -1.7],
  bob: Math.sin(frame * 2.1) * 2,
  headTilt: Math.sin(frame * 2.3) * 0.02,
  lean: 0.05,
});

/** Kneeling/sitting reverence: arms raised forward, palms up, below the face. */
export const worship = (frame: number): Pose => ({
  sit: true,
  armF: [1.75 + Math.sin(frame * 0.12) * 0.08, 0.55],
  armB: [1.55 + Math.sin(frame * 0.12 + 0.6) * 0.08, 0.55],
  lean: -0.06 + Math.sin(frame * 0.12) * 0.03,
  headTilt: -0.05,
});

/** Hands together in front of the chest. */
export const pray = (frame: number): Pose => ({
  armF: [0.95, 1.6],
  armB: [0.65, 1.75],
  headTilt: -0.06 + Math.sin(frame * 0.05) * 0.01,
});

/** Grief: head down, one hand raised to the brow, shoulders dropped. */
export const grief = (frame: number): Pose => ({
  armF: [1.05, 2.0],
  armB: [-0.2, -0.3],
  headTilt: -0.12 + Math.sin(frame * 0.08) * 0.015,
  lean: 0.04,
  handF: "fist",
});

/** Talking: beat gestures with the front hand, the back arm relaxed. */
export const talk = (frame: number, seed = 0): Pose => {
  const ph = frame / 30 / 1.3 + seed * 0.37;
  const k = ph - Math.floor(ph);
  const beat = ease(Math.min(1, k * 3)) * (1 - ease(Math.max(0, (k - 0.55) * 2.2)));
  const big = Math.floor(ph) % 3 === 1 ? 1 : 0.6;
  const t = frame * 0.06 + seed;
  return {
    armF: [0.35 + beat * 0.75 * big, 0.45 + beat * 0.65 * big],
    armB: [-0.18 - Math.sin(t) * 0.04, -0.22],
    headTilt: beat * 0.04 * big - 0.01,
    lean: Math.sin(t * 0.5) * 0.01,
  };
};

/** Blend two poses (numbers only). */
export const mix = (a: Pose, b: Pose, t: number): Pose => {
  const n = (x = 0, y = 0) => x + (y - x) * t;
  const arr = (x: [number, number] = [0, 0], y: [number, number] = [0, 0]): [number, number] => [n(x[0], y[0]), n(x[1], y[1])];
  return {
    ...a,
    ...(t > 0.5 ? b : {}),
    armF: arr(a.armF ?? [0.14, 0.1], b.armF ?? [0.14, 0.1]),
    armB: arr(a.armB ?? [-0.14, -0.1], b.armB ?? [-0.14, -0.1]),
    legF: n(a.legF, b.legF),
    legB: n(a.legB, b.legB),
    lean: n(a.lean, b.lean),
    headTilt: n(a.headTilt, b.headTilt),
    bob: n(a.bob, b.bob),
  };
};

/** Ease from pose `a` to pose `b` starting at time `at` (seconds), over `dur`. */
export const blendAt = (t: number, at: number, a: Pose, b: Pose, dur = 0.35): Pose => {
  const k = ease((t - at) / dur);
  return k <= 0 ? a : k >= 1 ? b : mix(a, b, k);
};
