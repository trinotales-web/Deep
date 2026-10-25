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

## Part 2: gods, emperors & samurai (86 s)

| Video time | Narration | Scene |
| --- | --- | --- |
| 0.0 | (title) | `Title2` |
| 3.0 | In 538 … It was Buddhism | `BuddhismArrives` |
| 7.4 | Japan mixed the new with the old … kept both | `KeepsBoth` |
| 16.5 | Shinto for births and festivals, Buddhism for funerals | `ShrineTemple` |
| 21.0 | Even today … | `Today` |
| 25.6 | In 794, Kyoto became the capital | `Kyoto` |
| 31.1 | the emperor started losing power | `EmperorPower` |
| 34.1 | Landowners … no longer felt safe | `Landowner` |
| 38.2 | paid armed men … collect taxes | `Guards` |
| 42.8 | These guards became the samurai | `SamuraiReveal` |
| 44.8 | emperor weaker, samurai stronger | `Balance` |
| 49.0 | the Minamoto and the Taira | `War` |
| 54.4 | The Minamoto won … strange new system | `Victory` |
| 57.9 | emperor, shogun, daimyo, samurai | `Hierarchy` |
| 74.7 | bushido | `Bushido` |
| 77.9 | the long katana and the short wakizashi, then a quiet ending | `Swords` |

The parts end without a "to be continued" card.

Scene cues come from word timings (`words-part1.ts`, `words-part2.ts`). These
were made by force-aligning each script against the voiceover. `wf(i, "word")`
(Part 1) and `w2(i, "word")` (Part 2) return the frame where word *i* starts,
and they throw if the index doesn't match the expected word. The Part 2 score
reads the same timing file, so the music hits the same words as the picture.

## Rebuilding assets

```bash
python3 remotion/japan/tools/make_textures.py            # paper + pencil textures
python3 remotion/japan/music/compose_part1.py \
  --narration narration_p1.wav --out music_p1.wav       # original score, ducked under the voice
python3 remotion/japan/music/compose_part2.py \
  --narration narration_p2.wav --out music_p2.wav       # (instruments live in music/synth.py)
ffmpeg -i music_p1.wav -c:a aac -b:a 192k public/japan/music_p1.m4a
npx remotion render JapanPart1 out/japan_part1.mp4      # final videos
npx remotion render JapanPart2 out/japan_part2.mp4
```

The `JapanCast` composition is a lineup of every character type, for checking
the drawings. To review a few frames quickly, run `node remotion/japan/tools/stills.mjs <dir> <frame>...`
and then `python3 remotion/japan/tools/sheet.py`.
