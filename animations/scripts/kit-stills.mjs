#!/usr/bin/env node
// Kit review sheets: render frame F of a dev composition for several `page` props
// with one bundle and tile them:  node scripts/kit-stills.mjs <compId> <out.png> <page,page,...> [cols] [frame]
// Chromium flags for headless containers come from env STILL_GL / STILL_BROWSER;
// STILL_BUNDLE=<dir> reuses a prebuilt bundle.
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [id, out, pagesArg, colsArg, frameArg] = process.argv.slice(2);
const pages = pagesArg.split(",").map(Number);
const cols = Number(colsArg ?? 2);
const frame = Number(frameArg ?? 30);
const reuse = process.env.STILL_BUNDLE;
const serveUrl = reuse ? path.resolve(reuse) : await bundle({ entryPoint: path.resolve("src/index.ts") });
const chromiumOptions = process.env.STILL_GL ? { gl: process.env.STILL_GL } : {};
const browserExecutable = process.env.STILL_BROWSER ?? null;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kitstills-"));
const files = [];
for (const page of pages) {
  const inputProps = { page };
  const composition = await selectComposition({ serveUrl, id, inputProps, chromiumOptions, browserExecutable });
  const f = path.join(dir, `${String(page).padStart(3, "0")}.png`);
  await renderStill({ composition, serveUrl, output: f, frame, inputProps, chromiumOptions, browserExecutable, scale: 0.5 });
  files.push(f);
  process.stdout.write(`${page} `);
}
const args = ["-loglevel", "error", "-y", ...files.flatMap((f) => ["-i", f])];
const filter =
  files.map((_, i) => `[${i}]`).join("") + `xstack=inputs=${files.length}:layout=` +
  files.map((_, i) => `${(i % cols) === 0 ? "0" : Array.from({ length: i % cols }, () => "w0").join("+")}_${Math.floor(i / cols) === 0 ? "0" : Array.from({ length: Math.floor(i / cols) }, () => "h0").join("+")}`).join("|") +
  `:fill=black`;
spawnSync("ffmpeg", [...args, "-filter_complex", files.length > 1 ? filter : "null", out], { stdio: "inherit" });
console.log(`\n→ ${out}`);
fs.rmSync(dir, { recursive: true, force: true });
if (!reuse) fs.rmSync(serveUrl, { recursive: true, force: true });
