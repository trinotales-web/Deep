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

## Part 3: ninjas, Mongols & a divine wind (136 s)

| Video time | Narration | Scene |
| --- | --- | --- |
| 0.0 | (title) | `Title3` |
| 3.0 | who were the ninjas? … secret agents | `Ninjas` |
| 7.5 | By day … farmers or monks | `ByDay` |
| 10.5 | at night … sneaked into enemy castles | `ByNight` |
| 16.0 | no enemy from outside … 1274 … the Mongols were coming | `Peace` |
| 23.4 | Kublai Khan, grandson of Genghis Khan … wanted Japan too | `Kublai` |
| 30.1 | accept him as its ruler … refused | `Letter` |
| 34.0 | the Mongols attacked … gunpowder | `Attack` |
| 39.9 | nature saved Japan … typhoon … turn back | `Typhoon1` |
| 46.0 | messengers again … the shogun had them killed | `Envoys` |
| 52.0 | stone walls along the coast | `Walls` |
| 57.3 | 1281 … 4,400 ships … 1,40,000 soldiers | `Fleet` |
| 66.1 | the walls held … attacked their ships at night | `Hold` |
| 70.4 | guess what happened? | `Guess` |
| 72.5 | another typhoon … more than half lost at sea | `Typhoon2` |
| 79.4 | kamikaze, the wind of the gods | `Kamikaze` |
| 84.1 | a new problem … rewarded with land | `Reward` |
| 89.8 | no land to give | `NoLand` |
| 94.7 | fought for nothing … power began to crack | `Crack` |
| 99.5 | local lords stopped listening | `Lords` |
| 103.5 | Yoshimasa … tea … the Silver Pavilion | `Yoshimasa` |
| 111.5 | politics … hopeless | `Hopeless` |
| 114.3 | promised the title to his younger brother | `Promised` |
| 118.5 | his wife gave birth to a baby boy | `Baby` |
| 122.9 | two people wanted the same seat | `Seat` |
| 128.0 | the Onin War … not onion | `OninWar` |

## Part 4: Kyoto burns & the warring states (54 s)

| Video time | Narration | Scene |
| --- | --- | --- |
| 0.0 | (title) | `Title4` |
| 3.0 | fought right in the streets of Kyoto | `Streets` |
| 5.6 | the Red Monk … his own son-in-law | `Leaders` |
| 11.4 | set fire to houses, temples and palaces | `Fire` |
| 15.3 | the beautiful old city of Kyoto was destroyed | `Destroyed` |
| 19.1 | how long? one year? two? five? ten whole years | `HowLong` |
| 25.9 | both leaders were dead, and nobody won | `NobodyWon` |
| 29.8 | power went to local lords … the Sengoku period | `LordsMap` |
| 34.4 | for about 150 years, civil wars | `CivilWars` |
| 38.4 | gekokujo: the low defeat the high | `Gekokujo` |
| 44.4 | your family name no longer mattered | `FamilyName` |
| 46.8 | push out your master and take his place | `PushOut` |

The parts end without a "to be continued" card.

Scene cues come from word timings (`words-part1.ts` … `words-part4.ts`). These
were made by force-aligning each script against the voiceover. `wf(i, "word")`
(Part 1) and `w2`/`w3`/`w4` (Parts 2–4) return the frame where word *i* starts,
and they throw if the index doesn't match the expected word. The Part 2–4
scores read the same timing files, so the music hits the same words as
the picture.

## Rebuilding assets

```bash
python3 remotion/japan/tools/make_textures.py            # paper + pencil textures
python3 remotion/japan/music/compose_part1.py \
  --narration narration_p1.wav --out music_p1.wav       # original score, ducked under the voice
python3 remotion/japan/music/compose_part2.py \
  --narration narration_p2.wav --out music_p2.wav       # (instruments live in music/synth.py)
python3 remotion/japan/music/compose_part3.py \
  --narration narration_p3.wav --out music_p3.wav
python3 remotion/japan/music/compose_part4.py \
  --narration narration_p4.wav --out music_p4.wav
ffmpeg -i music_p1.wav -c:a aac -b:a 192k public/japan/music_p1.m4a
npx remotion render JapanPart1 out/japan_part1.mp4      # final videos
npx remotion render JapanPart2 out/japan_part2.mp4
npx remotion render JapanPart3 out/japan_part3.mp4
npx remotion render JapanPart4 out/japan_part4.mp4
# long parts render more reliably in chunks (retries, then joins video + audio):
remotion/japan/tools/render_chunked.sh JapanPart3 4080 out/japan_part3.mp4
```

The `JapanCast` composition is a lineup of every character type, for checking
the drawings. To review a few frames quickly, run `node remotion/japan/tools/stills.mjs <dir> <frame>...`
and then `python3 remotion/japan/tools/sheet.py`.
