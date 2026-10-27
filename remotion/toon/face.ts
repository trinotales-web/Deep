import * as THREE from "three";
import { INK as DEFAULT_INK } from "./materials";

// Feature ink for the face currently being painted (set per paintFace call).
let INK = DEFAULT_INK;

export type Expression =
  | "neutral"
  | "suspicious"
  | "surprised"
  | "worried"
  | "determined"
  | "smile"
  | "sad";

export type FaceSpec = {
  expression: Expression;
  blink?: boolean;
  /** Pupil offset, -1..1. */
  lookX?: number;
  lookY?: number;
  freckles?: boolean;
  mustache?: string;
  glasses?: boolean;
  /** Tear progress 0..1 (0 = none). */
  tear?: number;
  /** Sweat drop on the forehead. */
  sweat?: boolean;
  /** Pink blush under the eyes (instead of / with freckles). */
  blush?: boolean;
  /** Line color for features; defaults to the cartoon ink. */
  ink?: string;
};

const SIZE = 512;
const px = (x: number) => (x + 1) * (SIZE / 2);
const py = (y: number) => (1 - y) * (SIZE / 2);
const u = (l: number) => l * (SIZE / 2);

const EYE_X = 0.27;
const EYE_Y = 0.06;
const FRECKLES: [number, number][] = [
  [-0.05, 0.02],
  [0.0, 0.05],
  [0.05, 0.015],
  [-0.025, -0.03],
  [0.03, -0.035],
];

type Ctx = CanvasRenderingContext2D;

const line = (ctx: Ctx, pts: [number, number][], w: number, color = INK) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = u(w);
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(px(x), py(y)) : ctx.lineTo(px(x), py(y))));
  ctx.stroke();
};

const curve = (
  ctx: Ctx,
  a: [number, number],
  c: [number, number],
  b: [number, number],
  w: number,
  color = INK,
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = u(w);
  ctx.beginPath();
  ctx.moveTo(px(a[0]), py(a[1]));
  ctx.quadraticCurveTo(px(c[0]), py(c[1]), px(b[0]), py(b[1]));
  ctx.stroke();
};

const disc = (ctx: Ctx, x: number, y: number, r: number, color: string, ry = r) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(px(x), py(y), u(r), u(ry), 0, 0, Math.PI * 2);
  ctx.fill();
};

const dotEye = (ctx: Ctx, x: number, y: number, r = 0.075) => {
  disc(ctx, x, y, r, INK);
  disc(ctx, x + r * 0.3, y + r * 0.35, r * 0.28, "#ffffff");
};

/** Brow from inner to outer end; `inner`/`outer` are y offsets above the eye. */
const brow = (ctx: Ctx, side: 1 | -1, inner: number, outer: number, w = 0.05) => {
  const x = side * EYE_X;
  line(
    ctx,
    [
      [x - side * 0.075, EYE_Y + inner],
      [x + side * 0.085, EYE_Y + outer],
    ],
    w,
  );
};

const paintFace = (spec: FaceSpec) => {
  INK = spec.ink ?? DEFAULT_INK;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const lx = (spec.lookX ?? 0) * 0.04;
  const ly = (spec.lookY ?? 0) * 0.03;

  if (spec.freckles !== false) {
    for (const side of [-1, 1] as const) {
      for (const [fx, fy] of FRECKLES) {
        disc(ctx, side * 0.41 + fx, -0.12 + fy, 0.017, "rgba(196,112,74,0.85)");
      }
    }
  }

  if (spec.blush) {
    for (const side of [-1, 1]) disc(ctx, side * 0.42, -0.14, 0.11, "rgba(236,150,150,0.45)", 0.06);
  }

  const eyes = (draw: (x: number, side: 1 | -1) => void) => {
    draw(-EYE_X, -1);
    draw(EYE_X, 1);
  };

  const e = spec.expression;
  if (spec.blink && e !== "smile") {
    eyes((x) => curve(ctx, [x - 0.08, EYE_Y], [x, EYE_Y - 0.05], [x + 0.08, EYE_Y], 0.04));
  } else if (e === "surprised") {
    eyes((x) => {
      disc(ctx, x, EYE_Y, 0.135, "#ffffff");
      ctx.strokeStyle = INK;
      ctx.lineWidth = u(0.035);
      ctx.beginPath();
      ctx.arc(px(x), py(EYE_Y), u(0.135), 0, Math.PI * 2);
      ctx.stroke();
      disc(ctx, x + lx, EYE_Y + ly, 0.055, INK);
    });
  } else if (e === "suspicious") {
    eyes((x, side) => {
      dotEye(ctx, x + lx, EYE_Y + ly, 0.08);
      // Lower lid: erase the top half of the pupil, then draw the heavy lid line.
      const lidY = EYE_Y + 0.01 + (side === -1 ? 0.01 : -0.01);
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(px(x - 0.15), py(lidY + 0.2), u(0.3), u(0.2));
      ctx.restore();
      line(ctx, [[x - 0.12, lidY], [x + 0.12, lidY]], 0.04);
    });
  } else if (e === "smile") {
    eyes((x) => curve(ctx, [x - 0.08, EYE_Y - 0.02], [x, EYE_Y + 0.08], [x + 0.08, EYE_Y - 0.02], 0.045));
  } else {
    eyes((x) => dotEye(ctx, x + lx, EYE_Y + ly));
  }

  switch (e) {
    case "suspicious":
      brow(ctx, -1, 0.17, 0.21);
      brow(ctx, 1, 0.13, 0.12);
      break;
    case "surprised":
      brow(ctx, -1, 0.27, 0.26);
      brow(ctx, 1, 0.27, 0.26);
      break;
    case "worried":
    case "sad":
      brow(ctx, -1, 0.24, 0.15);
      brow(ctx, 1, 0.24, 0.15);
      break;
    case "determined":
      brow(ctx, -1, 0.11, 0.2, 0.055);
      brow(ctx, 1, 0.11, 0.2, 0.055);
      break;
    case "smile":
      brow(ctx, -1, 0.21, 0.2);
      brow(ctx, 1, 0.21, 0.2);
      break;
    default:
      brow(ctx, -1, 0.19, 0.19);
      brow(ctx, 1, 0.19, 0.19);
  }

  const my = -0.33;
  switch (e) {
    case "surprised":
      disc(ctx, 0, my, 0.06, INK, 0.08);
      disc(ctx, 0, my - 0.03, 0.035, "#b5524a", 0.03);
      break;
    case "smile":
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.moveTo(px(-0.12), py(my + 0.03));
      ctx.quadraticCurveTo(px(0), py(my - 0.18), px(0.12), py(my + 0.03));
      ctx.closePath();
      ctx.fill();
      disc(ctx, 0, my - 0.07, 0.045, "#c45a4e", 0.025);
      break;
    case "sad":
    case "worried":
      curve(ctx, [-0.08, my - 0.02], [0, my + 0.05], [0.08, my - 0.02], 0.04);
      break;
    case "suspicious":
      line(ctx, [[-0.07, my + 0.01], [0.08, my - 0.02]], 0.04);
      break;
    case "determined":
      line(ctx, [[-0.08, my], [0.08, my]], 0.045);
      break;
    default:
      curve(ctx, [-0.07, my + 0.01], [0, my - 0.03], [0.07, my + 0.01], 0.04);
  }

  if (spec.mustache) {
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(px(side * 0.085), py(-0.2));
      ctx.rotate(side * -0.25);
      ctx.fillStyle = spec.mustache;
      ctx.strokeStyle = INK;
      ctx.lineWidth = u(0.02);
      ctx.beginPath();
      ctx.ellipse(0, 0, u(0.1), u(0.045), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  if (spec.glasses) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = u(0.03);
    for (const side of [-1, 1]) {
      disc(ctx, side * EYE_X, EYE_Y, 0.14, "rgba(220,235,245,0.18)");
      ctx.beginPath();
      ctx.arc(px(side * EYE_X), py(EYE_Y), u(0.14), 0, Math.PI * 2);
      ctx.stroke();
    }
    line(ctx, [[-0.13, EYE_Y + 0.02], [0.13, EYE_Y + 0.02]], 0.03);
  }

  if (spec.tear && spec.tear > 0) {
    const t = spec.tear;
    const tx = EYE_X + 0.05;
    const ty = EYE_Y - 0.1 - t * 0.28;
    line(ctx, [[tx, EYE_Y - 0.08], [tx, ty]], 0.03, "rgba(150,205,235,0.8)");
    ctx.fillStyle = "#a9daf2";
    ctx.strokeStyle = INK;
    ctx.lineWidth = u(0.016);
    ctx.beginPath();
    ctx.moveTo(px(tx), py(ty + 0.07));
    ctx.quadraticCurveTo(px(tx + 0.05), py(ty - 0.01), px(tx), py(ty - 0.035));
    ctx.quadraticCurveTo(px(tx - 0.05), py(ty - 0.01), px(tx), py(ty + 0.07));
    ctx.fill();
    ctx.stroke();
  }

  if (spec.sweat) {
    ctx.fillStyle = "#bfe3f5";
    ctx.strokeStyle = INK;
    ctx.lineWidth = u(0.02);
    ctx.beginPath();
    ctx.moveTo(px(0.5), py(0.52));
    ctx.quadraticCurveTo(px(0.58), py(0.36), px(0.5), py(0.33));
    ctx.quadraticCurveTo(px(0.42), py(0.36), px(0.5), py(0.52));
    ctx.fill();
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
};

const cache = new Map<string, THREE.Texture>();

const q = (n: number | undefined, step: number) => Math.round((n ?? 0) / step) * step;

/** Painted face texture for a head; cached so identical expressions share one texture. */
export const faceTexture = (spec: FaceSpec): THREE.Texture => {
  const norm: FaceSpec = {
    ...spec,
    lookX: q(spec.lookX, 0.1),
    lookY: q(spec.lookY, 0.1),
    tear: q(spec.tear, 0.04),
  };
  const key = JSON.stringify(norm);
  let tex = cache.get(key);
  if (!tex) {
    tex = paintFace(norm);
    cache.set(key, tex);
  }
  return tex;
};
