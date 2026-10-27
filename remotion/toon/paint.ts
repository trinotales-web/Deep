import * as THREE from "three";
import { INK } from "./materials";

/** Deterministic PRNG (mulberry32): identical paintings on every render. */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const canvas2d = (w: number, h: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  return { canvas, ctx };
};

export const toTexture = (canvas: HTMLCanvasElement, repeat = 1) => {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (repeat !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
  }
  return tex;
};

type Ctx = CanvasRenderingContext2D;

/** Ink-rimmed union of sub-paths: wide ink stroke first, then the fill covers the inner half. */
export const inkUnion = (ctx: Ctx, path: Path2D, fill: string, lw: number) => {
  ctx.strokeStyle = INK;
  ctx.lineWidth = lw * 2;
  ctx.stroke(path);
  ctx.fillStyle = fill;
  ctx.fill(path);
};

/** Shade the lower part of a painted shape (clipped to its path). */
const shadeBelow = (ctx: Ctx, path: Path2D, y: number, color: string) => {
  ctx.save();
  ctx.clip(path);
  ctx.fillStyle = color;
  ctx.fillRect(0, y, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
};

export const paintCloud = (
  ctx: Ctx,
  cx: number,
  cy: number,
  w: number,
  rand: () => number,
  colors: { fill: string; shade: string },
  lw = 5,
) => {
  const n = 4 + Math.floor(rand() * 3);
  const path = new Path2D();
  const h = w * 0.32;
  path.roundRect(cx - w / 2, cy - h * 0.45, w, h * 0.6, h * 0.3);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const mid = 1 - Math.abs(t - 0.5) * 1.3;
    const r = (w / n) * (0.55 + rand() * 0.25) * (0.75 + mid * 0.7);
    const x = cx - w / 2 + w * t + (rand() - 0.5) * r * 0.3;
    path.moveTo(x + r, cy - r * 0.55);
    path.arc(x, cy - r * 0.55, r, 0, Math.PI * 2);
  }
  inkUnion(ctx, path, colors.fill, lw);
  // Clipped to the interior, so the outer half of the ink rim stays intact.
  shadeBelow(ctx, path, cy - h * 0.05, colors.shade);
};

/** Transparent canvas with a row of outlined puffy clouds. */
export const paintCloudBank = (
  w: number,
  h: number,
  seed: number,
  colors: { fill: string; shade: string },
  count = 5,
) => {
  const { canvas, ctx } = canvas2d(w, h);
  const rand = rng(seed);
  for (let i = 0; i < count; i++) {
    const cw = w * (0.18 + rand() * 0.16);
    const cx = Math.min(w - cw * 0.62, Math.max(cw * 0.62, (w * (i + 0.5)) / count + (rand() - 0.5) * w * 0.08));
    const cy = h * (0.35 + rand() * 0.45);
    paintCloud(ctx, cx, cy, cw, rand, colors, Math.max(3, w / 450));
  }
  return toTexture(canvas);
};

/** Hills whose ridge is a canopy of bumps (jungle treeline), ink-outlined, shaded at the base. */
export const paintTreeline = (
  w: number,
  h: number,
  seed: number,
  colors: { fill: string; shade: string; dots?: string },
  opts: { ridge: number; amp: number; bump: number; lw: number },
) => {
  const { canvas, ctx } = canvas2d(w, h);
  const rand = rng(seed);
  const path = new Path2D();
  const ridgeY = (x: number) =>
    h * opts.ridge -
    opts.amp * (Math.sin((x / w) * Math.PI * 2.2 + seed) * 0.6 + Math.sin((x / w) * Math.PI * 5.3 + seed * 2) * 0.4);
  path.moveTo(-10, h + 10);
  for (let x = -10; x <= w + 10; x += 8) path.lineTo(x, ridgeY(x) + opts.bump * 0.4);
  path.lineTo(w + 10, h + 10);
  path.closePath();
  let x = -opts.bump;
  while (x < w + opts.bump) {
    const r = opts.bump * (0.6 + rand() * 0.6);
    const y = ridgeY(x) + r * 0.3;
    path.moveTo(x + r, y);
    path.arc(x, y, r, 0, Math.PI * 2);
    x += r * (0.9 + rand() * 0.4);
  }
  inkUnion(ctx, path, colors.fill, opts.lw);
  ctx.save();
  ctx.clip(path);
  const g = ctx.createLinearGradient(0, h * opts.ridge - opts.amp, 0, h);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, colors.shade);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  if (colors.dots) {
    ctx.fillStyle = colors.dots;
    for (let i = 0; i < w / 6; i++) {
      const dx = rand() * w;
      const dy = ridgeY(dx) + opts.bump + rand() * (h - ridgeY(dx));
      ctx.beginPath();
      ctx.ellipse(dx, dy, opts.bump * (0.2 + rand() * 0.3), opts.bump * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  return toTexture(canvas);
};

/** Seamless ground tile: mottled base, specks, pebbles and inked grass tufts. */
export const paintGroundTile = (
  size: number,
  seed: number,
  colors: { base: string; light: string; dark: string; tuft: string },
) => {
  const { canvas, ctx } = canvas2d(size, size);
  const rand = rng(seed);
  ctx.fillStyle = colors.base;
  ctx.fillRect(0, 0, size, size);
  const wrapped = (draw: (ox: number, oy: number) => void) => {
    for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) draw(ox, oy);
  };
  for (let i = 0; i < 60; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = size * (0.03 + rand() * 0.08);
    const c = rand() < 0.5 ? colors.light : colors.dark;
    wrapped((ox, oy) => {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.ellipse(x + ox, y + oy, r, r * 0.6, rand() * 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.globalAlpha = 1;
  for (let i = 0; i < size * 1.2; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1 + rand() * 2.5;
    ctx.fillStyle = rand() < 0.6 ? "rgba(43,35,32,0.28)" : "rgba(255,248,225,0.25)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 26; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 6 + rand() * 10;
    wrapped((ox, oy) => {
      ctx.fillStyle = colors.dark;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x + ox, y + oy, r, r * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }
  for (let i = 0; i < 90; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const s = 10 + rand() * 14;
    wrapped((ox, oy) => {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      for (const a of [-0.5, 0, 0.45]) {
        ctx.moveTo(x + ox, y + oy);
        ctx.lineTo(x + ox + Math.sin(a) * s, y + oy - Math.cos(a) * s);
      }
      ctx.stroke();
      ctx.strokeStyle = colors.tuft;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });
  }
  return toTexture(canvas);
};

const leafPath = (len: number, wid: number) => {
  const p = new Path2D();
  p.moveTo(0, 0);
  p.bezierCurveTo(wid, -len * 0.15, wid * 0.9, -len * 0.8, 0, -len);
  p.bezierCurveTo(-wid * 0.9, -len * 0.8, -wid, -len * 0.15, 0, 0);
  return p;
};

/** Big out-of-focus foreground leaves (fake depth of field). */
export const paintForegroundLeaves = (w: number, h: number, seed: number, blur: number) => {
  const { canvas, ctx } = canvas2d(w, h);
  const rand = rng(seed);
  ctx.filter = `blur(${blur}px)`;
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.translate(w * (0.25 + rand() * 0.5), h * (0.85 + rand() * 0.1));
    ctx.rotate(-0.8 + i * 0.5 + (rand() - 0.5) * 0.3);
    const len = h * (0.6 + rand() * 0.3);
    const p = leafPath(len, len * 0.22);
    inkUnion(ctx, p, i % 2 ? "#3f6a2c" : "#4d7b33", 6);
    ctx.strokeStyle = "#6f9a48";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len * 0.92);
    ctx.stroke();
    ctx.restore();
  }
  return toTexture(canvas);
};

/** Soft, blurred jungle wall for close-up backgrounds. */
export const paintJungleWall = (w: number, h: number, seed: number) => {
  const { canvas, ctx } = canvas2d(w, h);
  const rand = rng(seed);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#efc98d");
  sky.addColorStop(0.6, "#f4dcaa");
  sky.addColorStop(1, "#c9c48a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.filter = "blur(14px)";
  for (let layer = 0; layer < 3; layer++) {
    const tint = ["#8fa86f", "#6c8f4c", "#4f7536"][layer];
    for (let i = 0; i < 7; i++) {
      const x = rand() * w;
      const top = h * (0.15 + layer * 0.12 + rand() * 0.1);
      ctx.fillStyle = "#7a5f45";
      ctx.fillRect(x - 10, top, 20 + layer * 6, h);
      for (let f = 0; f < 7; f++) {
        ctx.save();
        ctx.translate(x, top);
        ctx.rotate((f / 7) * Math.PI * 2 + rand());
        ctx.fillStyle = tint;
        ctx.fill(leafPath(h * 0.16, h * 0.035));
        ctx.restore();
      }
    }
    ctx.fillStyle = tint;
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      ctx.arc(rand() * w, h * (0.62 + layer * 0.12) + rand() * 40, 60 + rand() * 90, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return toTexture(canvas);
};

/** Surrender leaflet: cream paper, ink border, headline and a red stamp. */
export const paintLeaflet = (front: boolean) => {
  const w = 512;
  const h = 700;
  const { canvas, ctx } = canvas2d(w, h);
  ctx.fillStyle = "#f2e6c8";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(180,150,100,0.25)";
  const rand = rng(front ? 11 : 12);
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(rand() * w, rand() * h, 2 + rand() * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = INK;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, w - 14, h - 14);
  if (front) {
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.font = "900 92px Montserrat";
    ctx.fillText("THE WAR", w / 2, 170);
    ctx.fillText("IS OVER!", w / 2, 270);
    ctx.font = "800 34px Montserrat";
    ctx.fillText("COME OUT  ·  1945", w / 2, 340);
    ctx.lineWidth = 8;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(70, 400 + i * 40);
      ctx.lineTo(w - 70 - (i % 2) * 80, 400 + i * 40);
      ctx.stroke();
    }
    ctx.strokeStyle = "#c8372d";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(w - 120, h - 110, 62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#c8372d";
    ctx.font = "900 30px Montserrat";
    ctx.fillText("OFFICIAL", w - 120, h - 99);
  }
  return toTexture(canvas);
};

/** Order paper held by the commander. */
export const paintOrder = () => {
  const { canvas, ctx } = canvas2d(400, 520);
  ctx.fillStyle = "#f6edd6";
  ctx.fillRect(0, 0, 400, 520);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, 386, 506);
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.font = "900 64px Montserrat";
  ctx.fillText("ORDER", 200, 110);
  ctx.lineWidth = 8;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(55, 180 + i * 45);
    ctx.lineTo(345 - (i % 3) * 40, 180 + i * 45);
    ctx.stroke();
  }
  ctx.fillStyle = "#c8372d";
  ctx.beginPath();
  ctx.arc(300, 450, 34, 0, Math.PI * 2);
  ctx.fill();
  return toTexture(canvas);
};

/** Dirt path strip (laid flat on the ground), ink-edged with pebbles. */
export const paintPath = (w: number, h: number, seed: number) => {
  const { canvas, ctx } = canvas2d(w, h);
  const rand = rng(seed);
  const edge = (side: 1 | -1) =>
    Array.from({ length: 41 }, (_, i) => {
      const y = (i / 40) * h;
      const half = w * (0.36 + 0.04 * Math.sin(i * 0.7 + seed)) ;
      return [w / 2 + side * half + Math.sin(i * 0.35) * w * 0.05, y] as [number, number];
    });
  const left = edge(-1);
  const right = edge(1).reverse();
  const path = new Path2D();
  [...left, ...right].forEach(([x, y], i) => (i === 0 ? path.moveTo(x, y) : path.lineTo(x, y)));
  path.closePath();
  inkUnion(ctx, path, "#c9a46e", 4);
  ctx.save();
  ctx.clip(path);
  for (let i = 0; i < 160; i++) {
    ctx.fillStyle = rand() < 0.5 ? "rgba(140,105,65,0.45)" : "rgba(235,210,160,0.5)";
    ctx.beginPath();
    ctx.ellipse(rand() * w, rand() * h, 3 + rand() * 6, 2 + rand() * 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return toTexture(canvas);
};
