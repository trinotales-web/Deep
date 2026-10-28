# 2D animation studio (Three.js + Remotion)

Flat, outlined, cel-shaded "history cartoon" shorts and videos.
Visuals are drawn with **Three.js** through the house style kit (`src/kit`);
**Remotion** handles the timeline, transitions, captions and audio.

```bash
npm install            # also generates the sound library (public/audio/lib)
npm run studio         # preview: Onoda/OnodaShort, Onoda/OnodaVideo, Dev/KitTest
npm run render:short   # 1080x1920 → out/onoda-short-master.mp4 (mastered to -14 LUFS)
npm run render:video   # 1920x1080 → out/onoda-video-master.mp4
```

## Licensed sound effects

```bash
node scripts/import-sfx.mjs path/to/Essential-Sound-Effects-Bundle.zip   # → public/audio/licensed/essential (gitignored)
```
The bundle's license allows use inside videos but not sharing the files, so
they are never committed. Re-run the import on each new machine.

## Adding the voiceover

1. Put the file in `public/vo/` (e.g. `public/vo/onoda.mp3`).
2. With the exact script: `python3 scripts/align-captions.py public/vo/onoda.mp3 script.txt public/captions/onoda.json`
   (forced alignment, `pip install pocketsphinx`). Without a script:
   `node scripts/transcribe.mjs public/vo/onoda.mp3` (whisper.cpp; downloads a model).
3. In `src/Root.tsx` set `voiceover: "vo/onoda.mp3"` and
   `captionsFile: "captions/onoda.json"`. Music ducks under the voice
   automatically; captions follow the real word timings.
4. Nudge shot durations (`script.ts`) and SFX cues (`sound.tsx`) to the read.

## Layout

| Path | What |
| --- | --- |
| `src/kit/` | Style kit: `Stage`, `Part` (cel-shaded shapes), effects, `character/`, `env/`, `captions/`, `audio/` |
| `src/episodes/woodenwall/` | "The Wooden Wall" short (real VO, 38 shots) — main template |
| `src/episodes/onoda/` | Small demo episode |
| `src/dev/KitTest.tsx` | Character style sheet (all expressions / hats / hair) |
| `scripts/synth-audio.mjs` | Procedural SFX, ambience and music library |
| `scripts/master.mjs` | Loudness mastering (-14 LUFS / -1 dBTP) |
| `scripts/transcribe.mjs` | Voiceover → captions JSON (whisper.cpp) |
| `scripts/align-captions.py` | Voiceover + exact script → captions JSON (forced alignment) |
| `scripts/import-sfx.mjs` | Import a licensed SFX bundle (gitignored) |
| `scripts/stills.mjs` | Contact sheet of stills from one bundle |

Style rules and conventions: see `../CLAUDE.md`.
