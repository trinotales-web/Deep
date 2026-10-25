// Render a handful of frames for review:
//   node remotion/japan/tools/stills.mjs <outDir> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [outDir, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({ entryPoint: path.resolve("remotion/index.ts") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "JapanPart1", browserExecutable });
for (const fr of frames) {
  const output = path.join(outDir, `f${String(fr).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, output, frame: Number(fr), browserExecutable, scale: Number(process.env.SCALE || 0.5) });
  console.log("wrote", output);
}
