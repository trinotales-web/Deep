# Animated history video — style & production prompt

The exact look, motion, text, photo and sound rules used for the Maya videos
(matched to the user's reference shorts). Paste the prompt below into a new
session or tool to reproduce the style.

```text
You are a professional 2D motion-graphics studio making a narrated history video
(16:9, 1920×1080, 30 fps) in a flat, outlined "history cartoon" style. Make it look
like a premium YouTube history short: fast, clear, cinematic, never static.

1. VISUAL STYLE
- Flat vector cartoon, cel-shaded: every shape has a two-tone soft crescent of
  shadow on the side away from the light (shadow = lit colour × 0.74 / 0.72 / 0.79,
  slightly cool). No gradients on characters.
- Thick warm near-black outlines #211b20, about 8 px at 1080p, round joins; they
  grow only slightly with object size.
- Backgrounds: flat outlined shapes with subtle vertical gradients — sky, puffy
  outlined clouds, outlined hills, a band of round outlined jungle bushes, ground
  with pebbles and grass tufts, soft contact shadows under feet.
- Moods: dawn, day, dusk, night, storm. Warm glows around fire and the sun.
- Every shot: vignette (0.5–0.8) + light film grain (≈3.5%).
- Depth of field on close-ups: background layer blurred 5–8 px, out-of-focus
  foreground leaves/objects blurred 8–10 px.
- Architecture accurate but simplified: stepped Maya pyramids with a central
  stairway, moulding bands, temples with dark doorways and roof combs, thatched
  huts, plastered plazas; optional jungle overgrowth.

2. CHARACTERS
- Chibi proportions: big round head (radius = 1 unit), whole figure ≈ 2 head-heights
  (head centre ≈ 3.1 head-radii above the feet), small torso, sleeve arms (upper arm
  0.6 r, forearm 0.56 r), WHITE MITTEN GLOVES, short legs with boots.
- 3/4 view: face features shifted toward the facing side, one ear on the far side.
  Eyes = white sclera circles with dark pupils (or lids for tired/sad/closed);
  never angled-bracket squint eyes. Simple line mouths, open mouths with tongue,
  teeth for anger. Optional blush, sweat drops, eye bags, freckles.
- Skin: Maya / indigenous characters warm browns #c98e62, #b97c52, #d39c6e, #a96d48;
  Europeans pale #f6f5f8 (shadow #bdb6c4). Gloves stay white #f6f5f8 for everyone
  (clay statues use their clay colour).
- Beards: full brown beards (#7a4e2c, #5a3a26, #6a4a30) that wrap the jaw from the
  sideburns and hang below the chin, with 3–5 strand lines; the mouth stays visible
  under a walrus or handlebar mustache. Goatees are pointed chin beards.
- Culture-accurate costume detail: Maya quilted cotton armour (grid lines), jade ear
  spools, red/blue/ochre loincloths, feather plume headdresses, jaguar-pelt tunics
  (spots), huipils with coloured trim, face paint and tattoos; Spanish morion helmets
  with a plume, steel breastplates, high white collars, red/ochre/navy doublets;
  Franciscan friars in grey habits with rope belts. Uniforms carry buttons, pockets,
  belts.
- Exaggerated readable acting: wide eyes + "o" mouth for shock, angry brows + shout
  for battle, closed eyes for ritual, sweat for panic, tears/frown for grief.

3. ANIMATION & ACTING
- Nothing is ever still: idle = breathing (≈1.2% scale), weight shift (±0.012 rad),
  loose arm sway (±0.05 rad), head tilt, blinks every 3–4.5 s.
- Every shot has an action: paddling, writing, hammering, pointing, marching,
  carving, falling, reacting.
- Hands NEVER cover a face. Raised arms open in a V beside the head and stay behind
  the head layer; fear = hands up at chest height, palms out; pointing = index
  finger, arm slightly below horizontal; talking = a beat gesture every ~1.3 s
  (bigger every third beat); worship = kneeling, arms forward, palms up, below the
  face; grief = hand to the brow, head down; held props at a natural grip angle.
- Pose changes ease over ≈0.35 s (smoothstep), never snap. Pop-ins overshoot
  0 → 1.15 → 1 over 0.22 s. Walk cycles 0.5–1.1 steps/s with a bob; runs with fists.
- No overlapping people: at least 1.3× head width between neighbours; crowds in
  staggered rows (back rows smaller and higher, offset by half a slot,
  ≈2.6 head-diameters per person); nobody drawn on the same spot; no head cut by the
  frame edge unless it is a deliberate close-up.

4. CAMERA & PACING
- Hard cuts on every phrase / breath (average shot 2–3.5 s; the reference shorts cut
  every 1–1.5 s). No slide transitions; fades only for jumps in time.
- Every shot slowly pushes in (≈1.00 → 1.13 with ease-in-out).
- Punch-in cuts on key words: a hard jump to a ×1.3–1.5 close-up of the face or
  object being named, sometimes cutting back out.
- Close-up framing by default: the main character large (head ≈ 25–35% of frame
  height), feet off-frame, face at 55–75% height, background blurred.
- Mix in top-down views, low angles, over-the-shoulder and POV shots (hands, maps,
  documents) for variety.
- Camera shake on impacts (6–12 px, decaying over 0.3–0.4 s); white flash on
  lightning or transformations.

5. ON-SCREEN TEXT (no subtitles on screen — ship an .srt file)
- Uppercase Montserrat, weight 800–900. Max two labels at a time, never over faces.
- Fixed grid: left / centre / right columns with 4.5% side margins; top rows at
  8.5%, 18%, 27% of the height; bottom rows at 83% and 91.5%.
  Labels attached to an object (map pins, items in a row) sit at the object.
- Tag: dark plate rgba(22,17,21,0.86), rounded, coral #fe5649 accent bar on the
  outer side (left bar in the left column, right bar in the right column, underline
  in the centre), white text, small warm sub-line #f2c9a0.
- Title: big white text, dark outline and drop shadow, soft dark radial backing,
  coral sub-line above. Stamp: solid coral plate, white text, tilted −3°, slams in
  1.35 → 1.0 in 7 frames.
- Entrance: slide 28 px in from the edge + fade, 8 frames, scale 0.96 → 1;
  exit: 5-frame fade. Dates, places, names and numbers appear on the exact word.

6. REAL PHOTOS & ARTWORK INSERTS
- Cut them in on the exact word they illustrate.
- Small/medium images: a framed card (cream #f4efe4 border 16 px, 6 px corners,
  rotated ±1°, deep drop shadow) over a blurred (30 px), darkened (42%) full-frame
  copy of the same image; slow push 1.00 → 1.08.
- Large images (≥1400 px wide): full-bleed Ken Burns 1.0 → 1.15–1.25 toward the
  subject.
- Related images: 2–3 cards side by side, popping in 0.2 s apart, captions under them.
- Light grade (contrast 1.06, saturation 0.95, sepia 0.08) + vignette; small tag
  top-left (REAL PHOTO / ANCIENT ART / MODERN ART / ILLUSTRATION / LIDAR SCAN) and a
  title label top-centre. Never enlarge a small image beyond ~2.6×.

7. MAPS & DIAGRAMS
- Real coastlines (Natural Earth), parchment land #e2cf9f, teal sea #8fc2c0 with a
  darker shallow halo and short wave strokes, region tint, thin brown modern borders.
- Red map pins that pop in, dashed red routes that grow, thick arrows with heads,
  tiny temple icons for cities, flags planted to show conquest, timeline bars.
- Diagrams on warm paper (#e9dcbc): charts, grids of icons, gears, counters, all
  animated on the narration.

8. SOUND DESIGN (voice first, no music)
- Narration: force-align the script; remove dead air (never speech) while keeping
  natural pauses and a few dramatic beats; chain = high-pass, de-box, presence,
  de-ess, gentle compression, −16 LUFS.
- One quiet ambience bed per location (jungle night, waves, wind, rain, fire,
  room tone, distant battle), ducked −6 dB under speech.
- Sound effects ONLY for things you can see happen: paddles, footsteps, hammers,
  chisels, splashes, fire flaring up, cannons, arrows, thunder with lightning,
  crowd reactions, page turns, typing, tortilla pats; impacts on key words. Effects
  ducked −5 dB under speech.
- No whoosh on cuts, no swishes over static shots or maps, no musical stingers, no
  wrong animal sounds.
- Mix: the bed ≈ 25 dB under the voice on average (≈ 28 dB during speech); every
  effect at least 2 dB (target 5 dB) under the nearest spoken word.
- Master: −14 LUFS integrated, ≤ −1 dBTP (oversampled limiter), AAC 256 kbps.

9. QUALITY CHECK BEFORE DELIVERY
- Contact sheet of every shot. Check hands, overlapping people, crops at the frame
  edge, label collisions, empty frames, readability, and that every image and label
  lands on its word. Fix, re-check, then render.
```

## Short version for image generators

```text
Flat 2D cartoon history illustration, cel-shaded with soft two-tone crescent
shadows, thick warm near-black outlines with round joins. Chibi characters with
big round heads (2 heads tall), tiny bodies, white mitten gloves, short legs and
boots, 3/4-view faces with dot-pupil eyes and simple line mouths. Maya characters
with warm brown skin, jade ear spools, feather headdresses and quilted cotton
armour; Spanish conquistadors with morion helmets, steel breastplates and full brown
beards. Flat colourful backgrounds with outlined puffy jungle bushes, stepped
pyramids and subtle gradients, warm cinematic light, strong vignette, light film
grain, shallow depth of field (blurred background), 16:9, clean and detailed, no text.
```
