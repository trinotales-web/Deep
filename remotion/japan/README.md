# Japan history series (Remotion)

A hybrid of two reference styles:

- **Storybook colored pencil**: cream paper, navy ink outlines that "boil",
  grainy pencil fills printed slightly off-register, captions typed on below the art.
- **History explainer cartoon**: full scenes, pencil-drawn maps with big
  hand-lettered labels, characters with exaggerated grins and frowns, a volcano
  and Japan itself as characters, yellow speech bubbles, camera pans and zooms.

## Part 1: where it all began (60 s)

| Video time | Narration | Scene |
| --- | --- | --- |
| 0.0 | (title) | `TitleScene` |
| 3.0 | Long ago … chain of islands | `MapIntro` |
| 8.0 | mountains, volcanoes, eruption, tsunami, quake, "nope.", civilization | `LandScene` |
| 25.0 | The first people … the Jomon | `MapJomon` |
| 29.5 | Most early humans kept moving | `Walk` |
| 32.5 | The Jomon built villages | `Village` |
| 36.0 | After them came the Yayoi | `MapYayoi` |
| 40.5 | rice, iron and bronze | `Rice` |
| 44.9 | So what happened to the Jomon? | `Peek` |
| 46.8 | The Yayoi did not destroy them | `Meet` |
| 49.0 | the two groups mixed … one people | `Mix` |
| 53.0 | Remember this … again and again | `Finale` |

Scene cues come from word timings (`words-part1.ts`). These were made by
force-aligning the script against the voiceover. `wf(i, "word")` returns the
frame where word *i* starts, and it throws if the index doesn't match the
expected word.

## Rebuilding assets

```bash
python3 remotion/japan/tools/make_textures.py            # paper + pencil textures
python3 remotion/japan/music/compose_part1.py \
  --narration narration_p1.wav --out music_p1.wav       # original score, ducked under the voice
ffmpeg -i music_p1.wav -c:a aac -b:a 192k public/japan/music_p1.m4a
npx remotion render JapanPart1 out/japan_part1.mp4      # final video
```

To review a few frames quickly, run `node remotion/japan/tools/stills.mjs <dir> <frame>...`
and then `python3 remotion/japan/tools/sheet.py`.
