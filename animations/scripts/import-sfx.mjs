#!/usr/bin/env node
// Import a licensed sound-effects bundle into public/audio/licensed/<name>/.
//   node scripts/import-sfx.mjs <bundle.zip | extracted-folder> [name=essential]
// Files are renamed to slugs ("Whoosh - Sizzling.MP3" → "whoosh-sizzling.mp3").
// The folder is gitignored: licensed files are used in renders but never
// committed or redistributed (most SFX licenses forbid sharing the files).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const [src, name = "essential"] = process.argv.slice(2);
if (!src) {
  console.error("usage: node scripts/import-sfx.mjs <bundle.zip | folder> [name]");
  process.exit(1);
}

let dir = src;
if (src.toLowerCase().endsWith(".zip")) {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "sfx-"));
  const r = spawnSync("unzip", ["-q", "-o", src, "-d", dir], { stdio: "inherit" });
  if (r.status !== 0) {
    console.error("unzip failed — extract the bundle manually and pass the folder instead.");
    process.exit(1);
  }
}

const out = path.join("public", "audio", "licensed", name);
fs.mkdirSync(out, { recursive: true });

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const slug = (f) =>
  path
    .basename(f)
    .replace(/(\.(mp3|wav|ogg|m4a|aac|flac))+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

let n = 0;
const seen = new Set();
for (const f of walk(dir)) {
  const ext = path.extname(f).toLowerCase();
  if (![".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"].includes(ext)) continue;
  const s = slug(f);
  if (seen.has(s)) continue;
  seen.add(s);
  fs.copyFileSync(f, path.join(out, `${s}${ext}`));
  n++;
}
console.log(`imported ${n} files → ${out}`);
