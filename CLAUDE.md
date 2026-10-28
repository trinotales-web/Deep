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

- Final mix: **-14 LUFS integrated, -1 dBTP, dense (LRA ≈ 2–6)**. Always run
  `node scripts/master.mjs <render>` after rendering.
- Layers: VO on top; a continuous music bed ducked under the VO
  (`duckFromCaptions`); an ambience bed per location; a whoosh on every cut;
  impacts/braams/risers on key words; small foley (pops, swishes, steps, page
  flips) on character actions. Drop the music out for dramatic beats.
- The library is synthesized by `scripts/synth-audio.mjs` into
  `public/audio/lib/{sfx,amb,music}` (generated on `npm install`, gitignored).
  Use the typed helpers in `src/kit/audio` (`Sfx`, `Ambience`, `Music`).
  Licensed music/SFX can be dropped into `public/audio/` and used with `Bed`.

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
- `captions/` — `StyledCaptions`. `audio/` — sound helpers.

Rules: drive every motion from `useCurrentFrame()` (never R3F `useFrame()`),
keep randomness seeded (`rng`, `noise1`), `<Sequence layout="none">` inside a
canvas. Add new props/characters to the kit, not to episodes, when reusable.

## Making an episode (see `src/episodes/onoda/` as the template)

1. `script.ts` — shot list with durations, narration phrases (`*word*` = red),
   transition length.
2. `cast.ts` — character designs. 3. `shots.tsx` — one `Stage` per shot.
4. `sound.tsx` — cue sheet (music, ambiences, whooshes, hits, foley).
5. `Episode.tsx` — `TransitionSeries` + `StyledCaptions` + sound + VO.
6. Register Short + Video compositions in `src/Root.tsx`.
7. Voiceover: put it in `public/vo/`, run
   `node scripts/transcribe.mjs public/vo/<name>.mp3` (whisper.cpp → word-level
   captions), set `voiceover` + `captionsFile` props, re-time shots/cues to it.

### Commands (run from `animations/`)
- `npm run studio` — preview in Remotion Studio
- `npm run render:short` / `npm run render:video` — render + master the demo
- `npm run audio` — regenerate the sound library
- `npm run typecheck`
- In a cloud container with no GPU or internet, add
  `--gl=swangle --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
