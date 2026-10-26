// Render frame ranges of one composition as silent clips, bundling only once:
//   node remotion/japan/tools/render_ranges.mjs <outDir> <from-to> [from-to...]
// COMP picks the composition (default JapanStory); "to" is inclusive.
// Clips that already exist are kept, so a rerun picks up where it stopped.
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [outDir, ...ranges] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({ entryPoint: path.resolve("remotion/index.ts") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "JapanStory", browserExecutable });
fs.mkdirSync(outDir, { recursive: true });
for (const range of ranges) {
  const [a, b] = range.split("-").map(Number);
  const outputLocation = path.join(outDir, `clip_${a}-${b}.mp4`);
  if (fs.existsSync(outputLocation)) continue;
  for (let attempt = 1; ; attempt++) {
    try {
      await renderMedia({
        composition,
        serveUrl,
        codec: "h264",
        crf: 10,
        muted: true,
        frameRange: [a, b],
        outputLocation: outputLocation + ".tmp.mp4",
        browserExecutable,
        concurrency: 3,
        timeoutInMilliseconds: 120000,
      });
      fs.renameSync(outputLocation + ".tmp.mp4", outputLocation);
      console.log("wrote", outputLocation);
      break;
    } catch (e) {
      if (attempt >= 3) throw e;
      console.log(`range ${range} failed (attempt ${attempt}), retrying`);
    }
  }
}
