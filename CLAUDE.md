# CLAUDE.md

## 3D animations — required stack

Whenever we create 3D animations or videos in this project, use exactly this stack. Do not swap in alternatives such as framer-motion, CSS keyframes, Babylon or `useFrame` loops for this work.

| Job | Tool | Package(s) |
| --- | --- | --- |
| 3D scenes, meshes, lights, cameras | **Three.js** via React Three Fiber | `three`, `@react-three/fiber` (v8, since the app is on React 18), `@remotion/three` |
| Timeline, rendering, captions, audio | **Remotion** | `remotion`, `@remotion/cli`, `@remotion/captions`, `@remotion/media` |
| Easing and motion choreography | **GSAP** | `gsap` |

### Where things live

- `remotion/index.ts`: entry point (`registerRoot`)
- `remotion/Root.tsx`: register every `<Composition>` here
- `remotion/compositions/`: one file per video/scene (`HeroScene.tsx` is the reference example)
- `remotion/components/Captions.tsx`: reusable word-highlighted captions (loads a `Caption[]` JSON)
- `remotion/lib/useGsapTimeline.ts`: frame-driven GSAP hook
- `public/animations/`: captions JSON, audio and other assets (load with `staticFile()`)

### Rules

1. **3D**: wrap all 3D content in `<ThreeCanvas width={width} height={height}>` from `@remotion/three`, and always add lights. Never use R3F `useFrame()`, and never let shaders or models animate on their own.
2. **Motion**: build motion with GSAP through `useGsapTimeline(initialState, (tl, state) => { tl.to(state, {...}) })`. The timeline is paused and seeked to `frame / fps` on every render, so it stays deterministic. Never call `tl.play()`, and never use GSAP's ticker or animate DOM nodes directly.
3. **Captions**: store captions as `Caption[]` JSON (`@remotion/captions`) in `public/animations/`, and render them with `<Captions src="animations/…json" />`.
4. **Audio**: use `<Audio src={staticFile(...)} />` from `@remotion/media`.
5. Follow the `remotion-best-practices` skill (`.agents/skills/remotion-best-practices/`) for everything else, especially `rules/3d.md`, `rules/subtitles.md` and `rules/audio.md`.

### Commands

```bash
npm run anim:studio                               # open Remotion Studio (live preview)
npm run anim:render -- HeroScene out/hero.mp4     # render a video
npm run anim:still  -- HeroScene out/f.png --frame=60
```

When rendering headless in a cloud container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --gl=swangle`.
