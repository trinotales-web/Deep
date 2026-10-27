import * as THREE from "three";
import { INK } from "./materials";
import { canvas2d, toTexture } from "./paint";

type Ctx = CanvasRenderingContext2D;
type Blob =
  | { kind: "ellipse"; x: number; y: number; rx: number; ry: number; rot?: number }
  | { kind: "limb"; pts: [number, number][]; w: number };

/** Draw blobs as one inked silhouette: ink pass (expanded), then color pass on top. */
const inkBlobs = (ctx: Ctx, blobs: Blob[], fill: string, lw: number) => {
  for (const [color, grow] of [
    [INK, lw],
    [fill, 0],
  ] as const) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    for (const b of blobs) {
      if (b.kind === "ellipse") {
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.rx + grow, b.ry + grow, b.rot ?? 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.lineWidth = b.w + grow * 2;
        ctx.beginPath();
        b.pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.stroke();
      }
    }
  }
};

/** Red rampant lion (facing left), drawn into a 512×512 box at the current transform. */
export const drawLion = (ctx: Ctx, color = "#d8452f") => {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const mane: Blob[] = Array.from({ length: 9 }, (_, i) => {
    const a = -0.6 + (i / 8) * 3.6;
    return { kind: "ellipse", x: 215 + Math.cos(a) * 52, y: 140 + Math.sin(a) * 52, rx: 26, ry: 18, rot: a };
  });
  const blobs: Blob[] = [
    { kind: "limb", pts: [[330, 350], [400, 300], [410, 200], [380, 150]], w: 22 },
    { kind: "ellipse", x: 372, y: 140, rx: 24, ry: 32, rot: 0.4 },
    ...mane,
    { kind: "ellipse", x: 265, y: 285, rx: 70, ry: 118, rot: -0.35 },
    { kind: "ellipse", x: 205, y: 140, rx: 56, ry: 50 },
    { kind: "ellipse", x: 160, y: 158, rx: 32, ry: 24, rot: 0.2 },
    { kind: "limb", pts: [[235, 215], [175, 200], [125, 165]], w: 34 },
    { kind: "ellipse", x: 118, y: 158, rx: 24, ry: 20 },
    { kind: "limb", pts: [[240, 262], [180, 270], [135, 250]], w: 32 },
    { kind: "ellipse", x: 128, y: 248, rx: 22, ry: 19 },
    { kind: "limb", pts: [[280, 375], [245, 420], [205, 450]], w: 40 },
    { kind: "ellipse", x: 192, y: 455, rx: 30, ry: 18 },
    { kind: "limb", pts: [[315, 360], [345, 420], [350, 465]], w: 38 },
    { kind: "ellipse", x: 360, y: 470, rx: 30, ry: 17 },
  ];
  inkBlobs(ctx, blobs, color, 9);
  // Face details and claws
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(188, 128, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(140, 170);
  ctx.lineTo(170, 168);
  ctx.stroke();
  ctx.fillStyle = "#f6f1e6";
  for (const [x, y] of [
    [100, 150],
    [104, 166],
    [112, 240],
    [114, 256],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 14, y + 4);
    ctx.lineTo(x, y + 8);
    ctx.fill();
  }
};

/** Transparent lion texture, projected onto tabards. */
let lionTex: THREE.Texture | null = null;
export const lionTexture = () => {
  if (!lionTex) {
    const { canvas, ctx } = canvas2d(512, 512);
    ctx.translate(256, 256);
    ctx.scale(0.62, 0.62);
    ctx.translate(-256, -256);
    drawLion(ctx);
    lionTex = toTexture(canvas);
  }
  return lionTex;
};

/** Yellow heater shield with an ink rim, lower-left shading and the lion. */
export const paintHeaterShield = (fill = "#f0c43a", shade = "#d9a52a") => {
  const { canvas, ctx } = canvas2d(512, 620);
  const path = new Path2D();
  path.moveTo(40, 40);
  path.lineTo(472, 40);
  path.lineTo(472, 270);
  path.quadraticCurveTo(472, 490, 256, 590);
  path.quadraticCurveTo(40, 490, 40, 270);
  path.closePath();
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 34;
  ctx.stroke(path);
  ctx.fillStyle = fill;
  ctx.fill(path);
  ctx.save();
  ctx.clip(path);
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.ellipse(120, 420, 200, 320, 0.3, 0, Math.PI * 2);
  ctx.globalAlpha = 0.55;
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.translate(256, 300);
  ctx.scale(0.72, 0.72);
  ctx.translate(-256, -256);
  drawLion(ctx);
  ctx.restore();
  return toTexture(canvas);
};

/** Hanging banner: yellow with lion, or blue with gold fleurs. */
export const paintBanner = (kind: "lion" | "fleur") => {
  const { canvas, ctx } = canvas2d(320, 400);
  const path = new Path2D();
  path.moveTo(20, 20);
  path.lineTo(300, 20);
  path.lineTo(300, 300);
  path.lineTo(250, 380);
  path.lineTo(200, 300);
  path.lineTo(120, 300);
  path.lineTo(70, 380);
  path.lineTo(20, 300);
  path.closePath();
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 20;
  ctx.stroke(path);
  ctx.fillStyle = kind === "lion" ? "#f0c43a" : "#3f5fb0";
  ctx.fill(path);
  if (kind === "lion") {
    ctx.save();
    ctx.translate(160, 165);
    ctx.scale(0.5, 0.5);
    ctx.translate(-256, -256);
    drawLion(ctx);
    ctx.restore();
  } else {
    for (const [x, y] of [
      [90, 90],
      [230, 90],
      [160, 190],
      [90, 260],
      [230, 260],
    ]) {
      ctx.fillStyle = "#f0c43a";
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      for (const [dx, dy, rx, ry] of [
        [0, -12, 9, 20],
        [-16, 2, 14, 8],
        [16, 2, 14, 8],
      ]) {
        ctx.beginPath();
        ctx.ellipse(x + dx, y + dy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }
  return toTexture(canvas);
};

/** Dark tent opening (triangle) with an ink edge. */
export const paintTentDoor = () => {
  const { canvas, ctx } = canvas2d(256, 256);
  const path = new Path2D();
  path.moveTo(128, 20);
  path.lineTo(230, 240);
  path.lineTo(26, 240);
  path.closePath();
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 16;
  ctx.stroke(path);
  ctx.fillStyle = "#3a2a24";
  ctx.fill(path);
  return toTexture(canvas);
};
