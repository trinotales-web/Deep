#!/usr/bin/env node
// Master a rendered video's audio to match the reference uploads:
// -14 LUFS integrated, -1 dBTP, dense/compressed (LRA ≈ 3-6 LU).
//   node scripts/master.mjs out/video.mp4 [out/video-master.mp4]
// Uses the system ffmpeg when it has acompressor/alimiter, otherwise falls
// back to Remotion's bundled ffmpeg (loudness normalization only).

import { spawnSync } from "node:child_process";
import path from "node:path";

const [input, outArg] = process.argv.slice(2);
if (!input) {
  console.error("usage: node scripts/master.mjs <input.mp4> [output.mp4]");
  process.exit(1);
}
const output = outArg ?? input.replace(/(\.\w+)$/, "-master$1");

const has = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8" }).status === 0;
const systemOk =
  has("ffmpeg", ["-version"]) &&
  /acompressor/.test(spawnSync("ffmpeg", ["-hide_banner", "-filters"], { encoding: "utf8" }).stdout ?? "");
const ff = systemOk ? ["ffmpeg"] : ["npx", "remotion", "ffmpeg"];
const run = (args) => spawnSync(ff[0], [...ff.slice(1), ...args], { encoding: "utf8", maxBuffer: 1 << 26 });

const pre = systemOk
  ? "acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=3dB,alimiter=limit=0.93:attack=3:release=60:level=disabled,"
  : "";
const target = "I=-14:TP=-1.0:LRA=6";

// pass 1: measure
const m = run(["-hide_banner", "-nostats", "-i", input, "-af", `${pre}loudnorm=${target}:print_format=json`, "-f", "null", "-"]);
const json = /\{[\s\S]*?"target_offset"[\s\S]*?\}/.exec(m.stderr ?? "");
if (!json) {
  console.error(m.stderr);
  process.exit(1);
}
const meas = JSON.parse(json[0]);

// pass 2: apply (linear when possible)
const ln = `loudnorm=${target}:measured_I=${meas.input_i}:measured_TP=${meas.input_tp}:measured_LRA=${meas.input_lra}:measured_thresh=${meas.input_thresh}:offset=${meas.target_offset}:linear=true`;
// final brick-wall limiter keeps true peaks under -1 dBTP after the gain change;
// 256 kbps AAC: at 192 kbps the native encoder overshoots by up to ~4 dB on dense mixes
const post = systemOk ? ",alimiter=limit=0.78:attack=2:release=50:level=disabled" : "";
const r = run(["-hide_banner", "-y", "-i", input, "-c:v", "copy", "-af", `${pre}${ln}${post},aresample=48000`, "-c:a", "aac", "-b:a", "256k", output]);
if (r.status !== 0) {
  console.error(r.stderr);
  process.exit(1);
}
console.log(`mastered → ${path.relative(process.cwd(), output)}  (in: ${meas.input_i} LUFS, LRA ${meas.input_lra}; ${systemOk ? "system ffmpeg" : "remotion ffmpeg"})`);
