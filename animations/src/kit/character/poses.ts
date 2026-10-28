import type { Pose } from "./Character";

// Pose helpers. All angles in radians (CCW). Front arm = facing side.

export const idle = (frame: number, seed = 0): Pose => {
  const t = frame * 0.08 + seed;
  return {
    armF: [0.14 + Math.sin(t) * 0.03, 0.12],
    armB: [-0.14 - Math.sin(t) * 0.03, -0.12],
  };
};

/** Walk cycle. `speed` in cycles per second at 30fps. */
export const walk = (frame: number, speed = 1.1, seed = 0): Pose => {
  const p = (frame / 30) * speed * Math.PI * 2 + seed;
  const sw = Math.sin(p);
  return {
    legF: sw * 0.42,
    legB: -sw * 0.42,
    armF: [-sw * 0.38 + 0.08, 0.25],
    armB: [sw * 0.38 - 0.08, 0.25],
    bob: Math.abs(Math.cos(p)) * 9,
    lean: -0.04,
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
  };
};

export const point = (frame: number): Pose => ({
  armF: [1.5 + Math.sin(frame * 0.2) * 0.04, 0.12],
  armB: [-0.16, -0.12],
});

export const salute: Pose = { armF: [2.75, 0.95], armB: [-0.08, -0.05], armsOverHead: true };

export const armsUp = (frame: number): Pose => ({
  armF: [2.7 + Math.sin(frame * 0.4) * 0.12, 0.3],
  armB: [-2.7 - Math.sin(frame * 0.4 + 1) * 0.12, -0.3],
  armsOverHead: true,
  bob: Math.abs(Math.sin(frame * 0.4)) * 10,
});

export const handsOnHips: Pose = { armF: [0.7, -2.0], armB: [-0.7, 2.0] };

export const shrug = (t: number): Pose => ({
  armF: [0.9 * t, -1.9 * t],
  armB: [-0.9 * t, 1.9 * t],
  headTilt: 0.08 * t,
});

export const holdOut: Pose = { armF: [1.1, 0.4], armB: [-0.2, -0.2] };

export const think: Pose = { armF: [0.5, 2.5], armB: [-0.4, 1.6], headTilt: 0.06 };

export const sit = (frame: number): Pose => ({
  sit: true,
  armF: [0.5, 0.6],
  armB: [-0.1, 0.8],
  bob: Math.sin(frame * 0.08) * 1.5,
});

export const scared = (frame: number): Pose => ({
  armF: [0.9 + Math.sin(frame * 1.7) * 0.05, 2.1],
  armB: [-0.9 - Math.sin(frame * 1.9) * 0.05, -2.1],
  bob: Math.sin(frame * 2.1) * 2,
  headTilt: Math.sin(frame * 2.3) * 0.02,
});

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
