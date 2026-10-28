# Project notes for Claude

## 2D animations — required stack

Whenever we create a 2D animation, use **exactly** this stack. Do not substitute
other animation libraries (no framer-motion, GSAP, Lottie, CSS animations, canvas
2D, etc.) for animation work:

1. **Three.js** (via `@react-three/fiber` + `@remotion/three`) — draws all the
   2D visuals, through the house style kit in `animations/src/kit/`.
2. **Remotion** — timeline, transitions and rendering, plus **captions**
   (`@remotion/captions`) and **audio** (`<Audio>` from `@remotion/media`).

All animation code lives in `animations/` (own `package.json`, separate from the
Next.js app, excluded from the root `tsconfig.json`).

Before writing Remotion code, load the `remotion-best-practices` skill
(`rules/3d.md`, `rules/display-captions.md`, `rules/audio.md` apply directly).

## House art style (matched to the reference uploads)

The look is the flat, outlined "history cartoon" style of the reference shorts.
Measured values live in `animations/src/kit/style.ts`; keep to them.

- **Characters**: big round white heads (`#f6f5f8`), ~2 head-heights tall, small
  bodies, sleeve arms with **white mitten gloves**, short legs with boots, ears
  on the far side, features shifted toward the facing direction (3/4 view).
  Faces: sclera eyes w/ pupils or lids, simple line mouths, optional freckles,
  blush, mustache/beard, eyebags. Uniforms carry buttons, pockets, belts.
- **Outlines**: warm near-black `#211b20`, ~8 px at 1080 wide, round joins.
  They grow only slightly with object size (handled by `lineLocal`).
- **Shading**: two-tone cel shading with a *soft crescent* of shadow on the side
  away from the light. Shadow tone = lit color × ~(0.74, 0.72, 0.79)
  (head `#f6f5f8` → `#bdb6c4`). Implemented with stencil buffers in `Part`:
  never fake it with gradients.
- **Scenes**: flat colored backgrounds with outlines, subtle vertical gradients,
  soft contact shadows under feet, warm light cones/glows, strong vignette
  + light grain on every shot (`Stage` does this).
- **Camera**: slow push-in on every shot (≈1.0 → 1.08), shake on hits, cuts
  every 2–4 s, quick push-slide transitions; fades only for time jumps.
- **Captions**: uppercase Montserrat Black, white, hard dark drop shadow, the
  phrase builds word by word with a small pop, keywords in coral red `#fe5649`,
  centered at ~70 % height on shorts (84 % on 16:9). Use `StyledCaptions`.
- **Formats**: Shorts 1080×1920 and videos 1920×1080, both 30 fps. Shots read
  `useVideoConfig()` and re-frame for each format.

## Sound design (matched to the references)

- Final mix: **-14 LUFS integrated, -1 dBTP**. Always run
  `node scripts/master.mjs <render>` after rendering (256 kbps AAC — at 192 kbps
  the encoder overshoots the peak ceiling).
- **Voice-first mix (user preference): no background music** unless the user
  asks for it. The narration carries the video; sound effects support it.
- **Process every voiceover first**: `node scripts/process-vo.mjs public/vo/<name>.mp3`
  → `<name>.voice.m4a` (high-pass, de-box, presence, de-ess, gentle compression,
  -16 LUFS). Use the processed file as the episode's `voiceover`.
- **Tighten long reads before processing**: align the raw VO first, then
  `python3 scripts/tighten-vo.py <vo.mp3> <captions.json> <script.txt> <out.wav> <out.json> [--beat "out.=0.6"]`
  removes dead air (never speech), keeps natural pauses and chosen dramatic
  beats, and remaps the captions. Process `out.wav` and use `out.json`.
- Layers under the voice: an ambience bed per location (quiet), a whoosh on
  every cut, impacts on key words, small foley on character actions. Every
  effect and ambience ducks under speech (`duck` / `gainAt` with
  `duckFromCaptions`, about -5 dB for FX, -6 dB for ambience).
- Mix targets (check with the episode's `…AudioOnly` composition,
  `withVoice: false`, against the processed VO): whole bed **~15 dB under the
  voice**, ~20 dB during speech, impacts peaking ~10 dB below voice peaks, and
  no effect within ~5 dB of a spoken word. Musical stingers (drumrolls,
  suspense/strings cues) count as music — leave them out.
- The library is synthesized by `scripts/synth-audio.mjs` into
  `public/audio/lib/{sfx,amb,music}` (generated on `npm install`, gitignored).
  Use the typed helpers in `src/kit/audio` (`Sfx`, `Ambience`, `Music`).
- **Licensed SFX bundles** (e.g. the user's "Essential Sound Effects Bundle"):
  import with `node scripts/import-sfx.mjs <bundle.zip> [name]` into
  `public/audio/licensed/<name>/` (slugged names, gitignored) and play with
  `SoundAt` + `licensedSrc(name, file)`. **Never commit or redistribute these
  files** — the license only allows using them inside videos. Prefer the bundle
  for hits/whooshes/foley; use the synth library for loopable ambience beds.
- Set bus gains (`AMB`, `FX`, `*_DUCK`) in the episode's `sound.tsx` and render
  the `…AudioOnly` composition (`--codec=wav`) for the mix check above.

## Kit map (`animations/src/kit`)

- `Stage` — one shot: ortho Three.js canvas (1 unit = 1 px, origin center,
  y up), camera (`x, y, zoom, rot, shake`), scene light, vignette/grain/wash.
- `X` — transform group (`x y z rot s sx sy`). Always use it (not `<group>`)
  so light direction and outline widths stay correct. Painter's order: higher
  `z` on top, equal `z` in JSX order.
- `Part` — outlined, cel-shaded shape. Shapes: `circle`, `ellipse`,
  `roundRect`, `roundPoly`, `limb`, `poly`, `blob` (smooth), `path` (SVG `d`,
  y-down). `flat` disables shading; `Line` draws open strokes.
- Effects: `Gradient`, `Glow`, `GroundShadow`, `LightCone`, `Vignette`, `Wash`.
- `character/` — `Character` (outfit, hat, hair, mustache/beard, expression,
  pose, talking, facing, look, held props), `poses` (idle, walk, run, point,
  salute, armsUp, handsOnHips, shrug, think, sit, scared, mix).
- `env/` — `Sky`, `Cloud`, `Mountains`, `Hill`, `Sea`, `Ground`, `Bush`,
  `PalmTree`, `Sun`, `Moon`, `Stars`, `Sunburst`, `PlankWall`, `Floorboards`,
  `BlindsWindow`, `HangingLamp`, `Desk`, `Calendar`, `Flag`, `Clock`, `Poster`,
  `Flame`, `Campfire`, `Torch`.
- Ancient world (`env/ancient`, `env/sea`, `props`): `GreekTemple`, `RockHill`,
  `Barricade` (planks + doors, `burn`/`char`), `OldDoor`, `StoneWall`,
  `GreekHouse`, `City`, `OliveTree`, `Tent`, `Banner`, `Throne`, `Tripod`,
  `Brazier`, `FireLine`, `Smoke`, `MysticSmoke`, `Trireme` (`sink`, `crack`,
  rowing), `Splash`, `StraitMap`; hand props `Spear`, `Bow` (draw + fire arrow),
  `Arrow` (`fire`), `Shield`, `WickerShield`, `Scroll`, `Hammer`, `Plank`,
  `HandTorch`, `Staff`, `Boulder`, `QuestionMark`, `InkLine`.
  Hats add `persian`, `crown`, `veil`, `wreath`, `corinthian`, `hood`; beards add
  `royal`; outfits add `hem`, `patches`, `trim`, `sash`, `rope`, `armor`.
- `captions/` — `StyledCaptions`. `audio/` — sound helpers.

Rules: drive every motion from `useCurrentFrame()` (never R3F `useFrame()`),
keep randomness seeded (`rng`, `noise1`), `<Sequence layout="none">` inside a
canvas. Add new props/characters to the kit, not to episodes, when reusable.

## Making an episode (templates: `src/episodes/woodenwall/` — real VO, ~90 s
short, 38 shots; `src/episodes/firearrows/` — 16:9 long video, ~8 min, ~180
shots in act files `actA…actE.tsx` with the cut list in `timeline.ts`;
`src/episodes/onoda/` — small demo)

1. `script.ts` — shot list with durations, narration phrases (`*word*` = red),
   transition length.
2. `cast.ts` — character designs. 3. `shots.tsx` — one `Stage` per shot.
4. `sound.tsx` — cue sheet (music, ambiences, whooshes, hits, foley).
5. `Episode.tsx` — `TransitionSeries` + `StyledCaptions` + sound + VO.
6. Register Short + Video compositions in `src/Root.tsx`.
7. Voiceover: put it in `public/vo/`. If the exact script is available (usual
   case), save it as `script.txt` and force-align — more accurate than
   transcription and needs no model download:
   `pip install pocketsphinx && python3 scripts/align-captions.py public/vo/<name>.mp3 <script.txt> public/captions/<name>.json [--merge "four eighty four=484"]`.
   Otherwise `node scripts/transcribe.mjs public/vo/<name>.mp3` (whisper.cpp).
   Then cut shots in the breaths between phrases (print word times from the
   JSON) and put hits on the key words.
8. Review with contact sheets: `node scripts/stills.mjs <compId> out.png <f1,f2,…> [cols]`
   (one bundle, many stills). Keep faces out of the caption band (~70 % height).

### Commands (run from `animations/`)
- `npm run studio` — preview in Remotion Studio
- `npm run render:short` / `npm run render:video` — render + master the demo
- `npx remotion render WoodenWallShort out/wooden-wall.mp4 && node scripts/master.mjs out/wooden-wall.mp4`
- `npm run audio` — regenerate the sound library
- `npm run typecheck`
- Long videos: render the muted video in chunks (`--frames=a-b --muted`), concat
  with ffmpeg, render the `…AudioOnly` mix (`--codec=wav`), mux, then master.
- In a cloud container with no GPU or internet, add
  `--gl=swangle --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
