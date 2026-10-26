# Japan history series (Remotion)

A hybrid of two reference styles:

- **Storybook colored pencil**: cream paper, navy ink outlines that "boil",
  grainy pencil fills printed slightly off-register, captions typed on below the art.
- **History explainer cartoon**: full scenes, pencil-drawn maps with big
  hand-lettered labels, characters with exaggerated grins and frowns, a volcano
  and Japan itself as characters, yellow speech bubbles, camera pans and zooms.

## Opening it in Remotion Studio

```bash
npm install
npm run remotion:studio        # opens http://localhost:3000
```

- **JapanFull** plays all the parts back to back (about 11½ minutes); **JapanPart1** …
  **JapanPart8** are the single parts.
- Every Japan composition has two props, shown as number fields in the Studio's
  **Props** panel: `musicVolume` and `narrationVolume` (1 = as mixed, 0.5 = half,
  0 = off). Studio can save the values back into `remotion/Root.tsx`.
- Edits to the scene files (`scenes*/`, `Props*.tsx`, `Person.tsx`) reload live.
- Render from the Studio's **Render** button, or from a terminal:

```bash
npm run japan:render           # all parts -> out/japan_full.mp4
npx remotion render JapanFull out/japan_full.mp4 --props='{"musicVolume":0.6,"narrationVolume":1}'
```

`musicVolume` scales the finished score. To change the music itself, edit
`music/compose_partN.py` and rebuild it (see "Rebuilding assets" below).

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

## Part 5: guns change everything (31.5 s)

| Video time | Narration | Scene |
| --- | --- | --- |
| 0.0 | (title) | `Title5` |
| 3.0 | In 1543, traders from Portugal … brought guns | `Portugal` |
| 8.15 | blacksmiths copied them … samurai swords | `Smiths` |
| 12.95 | more guns than any country in Europe | `MoreGuns` |
| 16.6 | war in Japan would never be the same | `NeverSame` |
| 18.55 | a whole life with a sword vs. a few days with a gun | `Duel` |
| 24.85 | with this new weapon … unite Japan, then a quiet ending | `Unite` |

## Part 6: the fool of Owari (63.5 s)

| Video time | Narration | Scene |
| --- | --- | --- |
| 0.0 | (title) | `Title6` |
| 3.0 | The first man to try it was Oda Nobunaga | `FirstMan` |
| 6.3 | barefoot, ate wherever he liked … the Fool of Owari | `Fool` |
| 13.45 | after the province where he lived | `Owari` |
| 15.55 | smarter than anyone knew | `Smarter` |
| 18.0 | a powerful warlord marched into Owari with 25,000 soldiers | `March` |
| 23.5 | Nobunaga's army was much smaller … crushed | `Odds` |
| 28.0 | a surprise attack, and he won | `Surprise` |
| 30.85 | one of the most powerful men in Japan | `Powerful` |
| 34.8 | by 1582, all of central Japan | `Central` |
| 38.4 | June 1582, staying at a temple in Kyoto | `Temple` |
| 42.9 | his most trusted general … 13,000 soldiers … fire | `Betrayal` |
| 49.3 | no way out … seppuku (the doors close; nothing graphic) | `NoWayOut` |
| 53.05 | What is seppuku? Search it, but at your own risk | `SearchIt` |
| 56.6 | why did his general turn against him? nobody knows, then a quiet ending | `Mystery` |

## Part 7: the bird that would not sing (174.5 s)

| Video time | Narration | Scene |
| --- | --- | --- |
| 0.0 | (title) | `Title7` |
| 3.0 | Hideyoshi rushed back to Kyoto and destroyed the traitor | `Rush` |
| 8.3 | finish Nobunaga's work … all of Japan | `Unify` |
| 13.0 | took weapons away from farmers and monks | `SwordHunt` |
| 15.75 | melt the weapons down … a giant Buddha statue | `Melt` |
| 19.4 | the real reason … nobody could fight back | `RealReason` |
| 23.8 | wanted more … China by going through Korea | `WantedMore` |
| 29.1 | captured Seoul in just a few weeks | `Seoul` |
| 34.4 | Admiral Yi Sun-sin's turtle ships … supply ships | `Turtle` |
| 40.6 | who would feed the soldiers? | `Hungry` |
| 43.4 | China sent a huge army to help Korea | `ChinaArmy` |
| 47.25 | six years … Hideyoshi died … army home | `Home` |
| 52.3 | a small child … Tokugawa Ieyasu | `Child` |
| 58.3 | Nobunaga was wild, but Ieyasu was patient | `Opposite` |
| 64.1 | the death of Ieyasu's son … still loyal, and waited | `Loyal` |
| 70.0 | a famous saying about these three men | `Saying` |
| 73.1 | if the bird won't sing … kills / convinces / waits | `Bird` |
| 80.8 | 1600 … Sekigahara | `Sekigahara` |
| 86.4 | thick fog … 80,000 soldiers each | `FogBattle` |
| 91.5 | for hours, nobody was winning | `NobodyWinning` |
| 93.8 | a secret deal with an enemy commander | `SecretDeal` |
| 97.7 | that commander switched sides | `Switch` |
| 100.8 | Ieyasu had won … the shogun of Japan | `Shogun` |
| 106.0 | only his own family, the Tokugawa | `Family` |
| 110.7 | the Portuguese traders … Christianity … thousands of Christians | `Christians` |
| 119.0 | obey the Pope instead of the shogun | `Pope` |
| 123.2 | Christianity banned, priests thrown out | `Banned` |
| 127.3 | Shimabara … huge taxes and cruel punishments | `Shimabara` |
| 133.4 | they fought back, led by 16-year-old Amakusa Shiro | `Shiro` |
| 138.7 | one lakh soldiers … Dutch ships | `Siege` |
| 144.0 | after three months, their castle fell | `Fell` |
| 146.5 | 37,000 people … almost every single one (non-graphic) | `Inside` |
| 153.0 | Japan shut its doors … sakoku | `Sakoku` |
| 157.7 | every foreigner thrown out, except the Dutch | `ExceptDutch` |
| 163.2 | a tiny man-made island near Nagasaki: Dejima | `DejimaScene` |
| 168.7 | not allowed to step onto Japanese land, then a quiet ending | `NoStep` |

## Part 8: 250 years of peace (88.5 s)

| Video time | Narration | Scene |
| --- | --- | --- |
| 0.0 | (title) | `Title8` |
| 3.0 | a clever way to control the daimyo (puppet strings) | `Control` |
| 5.9 | every other year in the capital, Edo | `ToEdo` |
| 9.2 | wives and children in Edo all the time | `Hostages` |
| 12.6 | turn against the shogun … family in danger | `Danger` |
| 17.3 | traveling cost so much … no daimyo could afford a war | `Cost` |
| 21.6 | about 250 years of peace, 1600 to 1868 | `Peace` |
| 26.7 | the Edo period | `EdoPeriod` |
| 29.0 | cities grew, traders got rich | `Cities` |
| 31.6 | kabuki theatre and ukiyo-e prints | `Art` |
| 36.8 | Japan stayed closed, the world raced ahead | `RacedAhead` |
| 40.4 | revolutions, steam engines, railways, rifles | `Europe` |
| 46.3 | tea ceremonies: "No, no, this is how we make tea!" | `TeaTime` |
| 53.7 | the Dutch warned … Japan did not listen | `Warned` |
| 58.0 | a single Western warship … towns along the coast | `Warship` |
| 62.7 | a samurai with a sword against cannons | `SamuraiVsCannon` |
| 66.7 | the door was closed … about to break it open | `Knock` |
| 71.2 | 1853, American warships … big guns | `BlackShips` |
| 77.0 | open your doors, or face the cannons | `Choice` |
| 82.0 | what did Japan do? (left as an open question) | `WhatNow` |

The parts end without a "to be continued" card (Part 8's own narration
points ahead, but nothing on screen does).

Scene cues come from word timings (`words-part1.ts` … `words-part8.ts`). These
were made by force-aligning each script against the voiceover. `wf(i, "word")`
(Part 1) and `w2` … `w8` (Parts 2–8) return the frame where word *i* starts,
and they throw if the index doesn't match the expected word. The Part 2–8
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
python3 remotion/japan/music/compose_part5.py \
  --narration narration_p5.wav --out music_p5.wav
python3 remotion/japan/music/compose_part6.py \
  --narration narration_p6.wav --out music_p6.wav
python3 remotion/japan/music/compose_part7.py \
  --narration narration_p7.wav --out music_p7.wav
python3 remotion/japan/music/compose_part8.py \
  --narration narration_p8.wav --out music_p8.wav
ffmpeg -i music_p1.wav -c:a aac -b:a 192k public/japan/music_p1.m4a
npx remotion render JapanPart1 out/japan_part1.mp4      # final videos
npx remotion render JapanPart2 out/japan_part2.mp4
npx remotion render JapanPart3 out/japan_part3.mp4
npx remotion render JapanPart4 out/japan_part4.mp4
npx remotion render JapanPart5 out/japan_part5.mp4
npx remotion render JapanPart6 out/japan_part6.mp4
remotion/japan/tools/render_chunked.sh JapanPart7 5235 out/japan_part7.mp4 960
remotion/japan/tools/render_chunked.sh JapanPart8 2655 out/japan_part8.mp4 960
# long parts render more reliably in chunks (retries, then joins video + audio):
remotion/japan/tools/render_chunked.sh JapanPart3 4080 out/japan_part3.mp4
```

The `JapanCast` composition is a lineup of every character type, for checking
the drawings. To review a few frames quickly, run `node remotion/japan/tools/stills.mjs <dir> <frame>...`
and then `python3 remotion/japan/tools/sheet.py`.
