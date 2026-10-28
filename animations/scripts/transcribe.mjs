#!/usr/bin/env node
// Voiceover → word-level captions (Remotion Caption[] JSON) with whisper.cpp.
//   node scripts/transcribe.mjs public/vo/onoda.mp3 [public/captions/onoda.json]
// First run downloads whisper.cpp + the model into ./whisper.cpp (gitignored).

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { downloadWhisperModel, installWhisperCpp, transcribe, toCaptions } from "@remotion/install-whisper-cpp";

const [input, outArg] = process.argv.slice(2);
if (!input) {
  console.error("usage: node scripts/transcribe.mjs <voiceover.(mp3|wav|m4a)> [out.json]");
  process.exit(1);
}
const name = path.basename(input).replace(/\.\w+$/, "");
const output = outArg ?? path.join("public", "captions", `${name}.json`);
const MODEL = process.env.WHISPER_MODEL ?? "medium.en";
const VERSION = "1.5.5";
const to = path.join(process.cwd(), "whisper.cpp");

await installWhisperCpp({ to, version: VERSION });
await downloadWhisperModel({ model: MODEL, folder: to });

const wav = path.join(to, `${name}.16k.wav`);
const conv = spawnSync("npx", ["remotion", "ffmpeg", "-y", "-i", input, "-ar", "16000", "-ac", "1", wav], { stdio: "inherit" });
if (conv.status !== 0) process.exit(conv.status ?? 1);

const whisperCppOutput = await transcribe({
  model: MODEL,
  whisperPath: to,
  whisperCppVersion: VERSION,
  inputPath: wav,
  tokenLevelTimestamps: true,
});
const { captions } = toCaptions({ whisperCppOutput });
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(captions, null, 2));
console.log(`${captions.length} words → ${output}`);
