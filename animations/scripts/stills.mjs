#!/usr/bin/env node
// Render several stills from one composition with a single bundle, then tile
// them into a contact sheet:  node scripts/stills.mjs <compId> <out.png> <frame,frame,...> [cols]
// Extra Chromium flags for headless containers come from env STILL_GL / STILL_BROWSER.

import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [id, out, framesArg, colsArg] = process.argv.slice(2);
const frames = framesArg.split(",").map(Number);
const cols = Number(colsArg ?? 4);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const chromiumOptions = process.env.STILL_GL ? { gl: process.env.STILL_GL } : {};
const browserExecutable = process.env.STILL_BROWSER ?? null;
const composition = await selectComposition({ serveUrl, id, chromiumOptions, browserExecutable });
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stills-"));
const files = [];
for (const frame of frames) {
  const f = path.join(dir, `${String(frame).padStart(5, "0")}.png`);
  await renderStill({ composition, serveUrl, output: f, frame, chromiumOptions, browserExecutable, scale: 0.4 });
  files.push(f);
  process.stdout.write(`${frame} `);
}
const rows = Math.ceil(files.length / cols);
const args = ["-loglevel", "error", "-y", ...files.flatMap((f) => ["-i", f])];
const filter =
  files.map((_, i) => `[${i}]`).join("") + `xstack=inputs=${files.length}:layout=` +
  files.map((_, i) => `${(i % cols) === 0 ? "0" : Array.from({ length: i % cols }, () => "w0").join("+")}_${Math.floor(i / cols) === 0 ? "0" : Array.from({ length: Math.floor(i / cols) }, () => "h0").join("+")}`).join("|") +
  `:fill=black`;
spawnSync("ffmpeg", [...args, "-filter_complex", files.length > 1 ? filter : "null", out], { stdio: "inherit" });
console.log(`\n→ ${out} (${rows}x${cols})`);
