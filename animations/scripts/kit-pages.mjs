#!/usr/bin/env node
// Render pages of a kit review composition (prop `page`) with one bundle:
//   node scripts/kit-pages.mjs <compId> <outDir> <page,page,...> [frame]
// Extra Chromium flags for headless containers come from env STILL_GL / STILL_BROWSER.
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [id, outDir, pagesArg, frameArg] = process.argv.slice(2);
const pages = pagesArg.split(",").map(Number);
const frame = Number(frameArg ?? 10);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const chromiumOptions = process.env.STILL_GL ? { gl: process.env.STILL_GL } : {};
const browserExecutable = process.env.STILL_BROWSER ?? null;
for (const page of pages) {
  const inputProps = { page };
  const composition = await selectComposition({ serveUrl, id, inputProps, chromiumOptions, browserExecutable });
  const f = path.join(outDir, `page${String(page).padStart(2, "0")}.png`);
  await renderStill({ composition, serveUrl, output: f, frame, inputProps, chromiumOptions, browserExecutable, scale: 0.5 });
  process.stdout.write(`${page} `);
}
console.log("done");
