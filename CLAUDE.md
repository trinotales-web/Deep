# Project notes for Claude

## 2D animations — required stack

Whenever we create a 2D animation, use **exactly** this stack. Do not substitute
other animation libraries (no framer-motion, GSAP, Lottie, CSS animations, canvas
2D, etc.) for animation work:

1. **Three.js** (via `@react-three/fiber` + `@remotion/three`) — draws all the
   2D visuals.
2. **Remotion** — timeline and rendering, plus **captions** (`@remotion/captions`)
   and **audio** (`<Audio>` from `@remotion/media`).

All animation code lives in `animations/`, which has its own `package.json`. It
is separate from the Next.js app at the repo root and is excluded from the root
`tsconfig.json`.

Before you write Remotion code, load the `remotion-best-practices` skill. Its
`rules/3d.md`, `rules/display-captions.md` and `rules/audio.md` files apply
directly to this stack.

### Conventions
- Start from `animations/src/Animation2D.tsx`. Layer Three.js visuals
  (`Scene2D`) at the bottom, captions (`Captions`) above them, and `<Audio>`.
  Register each new video as a `<Composition>` in `animations/src/Root.tsx`.
- 2D in Three.js: `<ThreeCanvas orthographic flat camera={{ position: [0, 0, 100], zoom: 1 }}>`.
  1 unit = 1 px, origin at the center of the frame, shapes on the z=0 plane, and
  `meshBasicMaterial` (no lights needed). `flat` keeps hex colors exact.
- Drive every motion from `useCurrentFrame()` (with `interpolate` and `spring`).
  **Never** use R3F's `useFrame()`, and nothing may animate on its own.
- A `<Sequence>` inside `<ThreeCanvas>` must have `layout="none"`.
- Captions are JSON arrays in the `Caption` type, stored in
  `animations/public/captions/`. Audio files go in `animations/public/audio/`.
  Reference them with `staticFile()`.

### Commands (run from `animations/`)
- `npm run studio`: open the preview in Remotion Studio
- `npx remotion render Animation2D out/video.mp4`: render the video
- `npm run typecheck`
- In a cloud container with no GPU or internet, add
  `--gl=swangle --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
