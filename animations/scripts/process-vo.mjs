#!/usr/bin/env node
// Broadcast-style voiceover chain (run once per VO, before rendering):
//   node scripts/process-vo.mjs public/vo/<name>.mp3 [public/vo/<name>.voice.m4a]
// high-pass 80 Hz → cut boxiness (250 Hz) → presence (+3.5 kHz) → air (10 kHz)
// → de-esser → gentle compression → limiter → two-pass loudnorm to -16 LUFS.
// Uses the system ffmpeg (needs deesser/acompressor/alimiter).

import { spawnSync } from "node:child_process";

const [input, outArg] = process.argv.slice(2);
if (!input) {
  console.error("usage: node scripts/process-vo.mjs <voiceover> [out.m4a]");
  process.exit(1);
}
const output = outArg ?? input.replace(/\.\w+$/, ".voice.m4a");
const run = (args) => spawnSync("ffmpeg", args, { encoding: "utf8", maxBuffer: 1 << 26 });

const chain = [
  "highpass=f=80:poles=2",
  "equalizer=f=250:t=q:w=1.0:g=-2.5",
  "equalizer=f=3500:t=q:w=1.2:g=2.5",
  "highshelf=f=10000:g=1.5",
  "deesser=i=0.45:m=0.5:f=0.5",
  "acompressor=threshold=-24dB:ratio=3:attack=6:release=90:knee=4:makeup=2dB",
  "alimiter=limit=0.9:attack=3:release=40:level=disabled",
].join(",");
const target = "I=-16:TP=-1.5:LRA=6";

const m = run(["-hide_banner", "-nostats", "-i", input, "-af", `${chain},loudnorm=${target}:print_format=json`, "-f", "null", "-"]);
const json = /\{[\s\S]*?"target_offset"[\s\S]*?\}/.exec(m.stderr ?? "");
if (!json) {
  console.error(m.stderr);
  process.exit(1);
}
const v = JSON.parse(json[0]);
const ln = `loudnorm=${target}:measured_I=${v.input_i}:measured_TP=${v.input_tp}:measured_LRA=${v.input_lra}:measured_thresh=${v.input_thresh}:offset=${v.target_offset}:linear=true`;
const r = run(["-hide_banner", "-y", "-i", input, "-af", `${chain},${ln},aresample=48000`, "-ac", "2", "-c:a", "aac", "-b:a", "256k", output]);
if (r.status !== 0) {
  console.error(r.stderr);
  process.exit(1);
}
console.log(`voice → ${output} (in ${v.input_i} LUFS)`);
