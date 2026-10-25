"""Original score for "Japan – Part 6: the fool of Owari" (63.5 s).

Same instruments as the earlier parts (synth.py); cue times come from the
Part 6 word timings.

  0.0  title           the series opening, in a bright yo-scale G
  3.0  first to try    an unanswered question, then a fanfare for Nobunaga
  6.3  the fool        a cheeky tiptoe walk, "nom nom" blips, a wonky sting
 13.45 Owari           a soft map pad and a ping for the province
 15.55 smarter         a lightbulb shimmer and a clever little cadence
 18.0  the invasion    a low drum march that swells to a 25,000-man hit
 23.5  the odds        tremolo tension and a heavy "crushed?" hit
 28.0  surprise attack rain, then a fast battle groove and a winning chord
 30.85 powerful        a rising triumphant theme
 34.8  central Japan   the theme in full, a pop for each flag
 38.4  the temple      a calm night: soft plucks, flute, a temple bell
 42.9  betrayal        a warm motif that turns sour, drums, fire
 49.3  no way out      a dissonant stab, then a quiet, respectful ending
                       for Nobunaga under a single bell
 53.05 search it       typing clicks, a click, an "uh-oh"
 56.6  the mystery     a sho cluster, a cracking heart, an open last chord

Run from the repo root:
    python3 remotion/japan/music/compose_part6.py --narration narration_p6.wav
"""
import json
import os
import re

from synth import *  # noqa: F401,F403  (instruments, helpers, constants)
from synth import cli, configure, render

DUR = 63.5
configure(DUR)

_ts = open(os.path.join(os.path.dirname(__file__), "..", "words-part6.ts")).read()
WORDS = [(float(a), float(b)) for a, b in re.findall(r'\["(?:[^"\\]|\\.)*", ([\d.]+), ([\d.]+)\]', _ts)]
SPOKEN = json.loads(re.search(r"SPOKEN_P6 = (\[.*?\]);", _ts, re.S).group(1))
assert len(WORDS) == len(SPOKEN), (len(WORDS), len(SPOKEN))


def cue(i, word):
    """Video time of narration word i (checked against the spoken word)."""
    assert SPOKEN[i] == word, (i, SPOKEN[i], word)
    return NARRATION_OFFSET + WORDS[i][0]


def frame(t):
    """Snap a time to the video frame the picture uses for it."""
    return round(t * 30) / 30


def score():
    # ---- title (0 - 3.0)
    place(taiko(0.45, 1.1), 0.05, rev=0.6)
    place(pad(["G3", "D4", "G4", "B4"], 3.2, 0.45, attack=1.4, release=1.2), 0.0, rev=0.5)
    for i, n in enumerate(["G4", "A4", "B4", "D5", "E5", "G5", "A5"]):
        place(koto(hz(n), 0.9, 0.36 + i * 0.04), 0.22 + i * 0.11, -0.4 + i * 0.12, rev=0.4)
    melody(1.05, [("D5", 0.8), ("E5", 0.4), ("D5", 0.4), ("B4", 0.6), ("G4", 2.6)], vel=0.42)
    place(noise_swell(0.8, 0.14, 300, 5000), 2.3, rev=0.4)

    # ---- the first man to try it (3.0 - 6.3)
    first = cue(1, "first")
    oda = cue(7, "oda")
    nob = cue(8, "nobunaga")
    place(pad(["G3", "D4", "A4"], oda - 3.0, 0.26, attack=0.4, release=0.4), 3.0, rev=0.5)
    for k, n in enumerate(["G4", "A4", "D5", "E5"]):  # who will unite Japan? (no answer yet)
        place(koto(hz(n), 0.4, 0.3), 3.05 + k * BEAT / 2, 0.2, rev=0.4)
    place(glock(hz("A5"), 0.2), first, 0.3, rev=0.5)
    place(taiko(0.6, 1.25), frame(oda) - 0.02, rev=0.5)
    for t0, n, d in [(oda, "D4", 0.25), (oda + 0.3, "D4", 0.25), (nob, "G4", 0.5), (nob + 0.5, "B4", 0.5), (nob + 1.0, "D5", 1.2)]:
        place(reed(hz(n), d, 0.27), t0, 0.0, rev=0.45)  # fanfare
    place(crash(0.18), nob, 0.2, rev=0.5)
    chord_track([(nob, 6.4, ["G2", "D3", "G3", "B3", "D4"])], vel=0.38, attack=0.05, bright=1.3)

    # ---- the fool of Owari (6.3 - 13.45)
    young = cue(11, "young")
    ate = cue(18, "ate")
    people = cue(22, "people")
    fool = cue(26, "fool")
    owari = cue(28, "owari")
    place(swish(), 6.1)
    t = 6.3
    k = 0
    walk = ["G2", "D3", "A2", "D3", "B2", "D3", "A2", "D3"]
    while t < people - 0.05:  # tiptoe bass and plucks
        place(koto(hz(walk[k % 8]), 0.16, 0.36, ring=0.35), t, -0.2, rev=0.2)
        if k % 2 == 1:
            place(koto(hz(["B4", "D5", "C5", "D5"][(k // 2) % 4]), 0.12, 0.24, ring=0.3), t, 0.35, rev=0.25)
            place(woodblock(1400, 0.12), t, 0.4)
        t += BEAT / 2
        k += 1
    melody(young + 0.3, [("D5", 0.5), ("E5", 0.25), ("D5", 0.25), ("B4", 0.5), ("G4", 0.5), ("A4", 0.5), ("B4", 0.5), ("A4", 1.0)], vel=0.3, vib=0.6)
    for j in range(4):  # nom nom
        place(glock(hz(["E6", "G6"][j % 2]), 0.14), frame(ate) + 0.25 + j * 0.16, 0.3, rev=0.4)
    place(shaker(0.16), people, 0.4)  # whisper, whisper
    place(shaker(0.12), people + 0.2, -0.4)
    place(pad(["G3", "C4", "E4"], fool - people, 0.2, attack=0.3, release=0.3), people, rev=0.45)
    place(taiko(0.5, 1.2), fool - 0.05, rev=0.4)
    for t0, n, d in [(fool, "D4", 0.3), (fool + 0.32, "C#4", 0.3), (owari, "C4", 0.9)]:
        place(reed(hz(n), d, 0.34), t0, 0.0, rev=0.4)  # a wonky "fool" sting
    place(boing(300, 0.3), owari + 0.45, 0.3)

    # ---- his home province (13.45 - 15.55)
    province = cue(31, "province")
    place(swish(), 13.25)
    sho(["G4", "A4", "D5", "E5"], 13.45, 2.2, 0.24)
    place(glock(hz("D6"), 0.24), frame(province) - 4 / 30, 0.2, rev=0.6)
    place(glock(hz("A6"), 0.16), frame(province), 0.3, rev=0.6)

    # ---- smarter than anyone knew (15.55 - 18.0)
    smarter = cue(39, "smarter")
    anyone = cue(41, "anyone")
    place(swish(), 15.35)
    place(pad(["E3", "B3", "E4", "G4"], smarter - 15.55, 0.22, attack=0.3, release=0.3), 15.55, rev=0.45)
    place(woodblock(900, 0.2), 15.6, 0.3)
    place(woodblock(1100, 0.2), 15.6 + BEAT / 2, 0.3)
    for k, n in enumerate(["D5", "G5", "B5", "D6", "G6", "B6"]):  # the lightbulb
        place(glock(hz(n), 0.16 + k * 0.02), frame(smarter) + 0.1 + k * 0.05, -0.3 + k * 0.12, rev=0.6)
    chord_track([(smarter, anyone, ["C3", "G3", "C4", "E4"]), (anyone, 18.1, ["G2", "D3", "G3", "B3", "D4"])], vel=0.32, attack=0.1, release=0.5)
    melody(anyone, [("B4", 0.5), ("C5", 0.5), ("D5", 1.5)], inst="koto", vel=0.32, pan=0.2)

    # ---- a powerful warlord marches in with 25,000 soldiers (18.0 - 23.5)
    warlord = cue(47, "warlord")
    marched = cue(48, "marched")
    twenty = cue(52, "twenty")
    place(swish(), 17.8)
    place(pad(["D2", "A2", "D3"], 23.55 - 18.0, 0.3, attack=0.6, release=0.4, bright=0.9), 18.0, rev=0.5)
    b = 0
    while 18.0 + b * BEAT < 23.45:  # a march that grows as they come
        tb = 18.0 + b * BEAT
        g = 0.2 + 0.4 * min(1, max(0, (tb - 18.0) / (twenty - 18.0)))
        place(taiko(g, 1.35), tb, rev=0.35)
        if tb > marched:
            place(shime(0.14 + 0.1 * g), tb + BEAT / 2, 0.3)
        b += 1
    for t0, n, d in [(warlord, "D3", 0.6), (warlord + 0.65, "Eb3", 0.6), (marched + 0.4, "D3", 0.6), (marched + 1.05, "F3", 0.8)]:
        place(reed(hz(n) * 2, d, 0.36), t0, -0.2, rev=0.45)
    place(noise_swell(twenty - marched, 0.16, 300, 4000), marched, rev=0.4)
    place(taiko(0.8, 1.45), twenty, rev=0.6)
    place(crash(0.2), twenty, 0.2, rev=0.6)
    place(pad(["D2", "A2", "D3", "F3", "A3", "Eb4"], 23.55 - twenty, 0.3, attack=0.05, release=0.5, bright=1.4), twenty, rev=0.5)
    place(bell(hz("D3"), 0.3, 3.5), twenty + 0.05, rev=0.6)

    # ---- the odds (23.5 - 28.0)
    smaller = cue(60, "smaller")
    thought = cue(63, "thought")
    crushed = cue(67, "crushed")
    place(swish(), 23.3)
    place(koto(hz("A4"), 0.4, 0.3, slide=-2), smaller, 0.3, rev=0.3)  # small...
    place(pad(["D3", "A3", "Eb4"], crushed - 23.5, 0.24, attack=0.4, release=0.2), 23.5, rev=0.45)
    tr = 23.55
    while tr < crushed - 0.1:  # tremolo tension
        v = 0.08 + 0.14 * (tr - 23.5) / (crushed - 23.5)
        place(koto(hz("D5" if int((tr - 23.5) / 0.09) % 2 else "Eb5"), 0.07, v, ring=0.3), tr, -0.3, rev=0.3)
        tr += 0.09
    for k in range(int((crushed - 23.5) / BEAT)):
        place(taiko(0.26, 1.45), 23.5 + k * BEAT, rev=0.4)
    place(woodblock(700, 0.2), thought, 0.3)
    place(taiko(0.75, 1.45), frame(crushed), rev=0.6)
    place(crash(0.2), frame(crushed), -0.2, rev=0.6)
    place(bass_slide(hz("D3"), hz("D2"), 0.7, 0.4), crushed + 0.1)
    place(pad(["D2", "A2", "D3", "F3"], 28.05 - crushed, 0.3, attack=0.05, release=0.4), crushed, rev=0.5)

    # ---- the surprise attack, and he won (28.0 - 30.85)
    surprise = cue(72, "surprise")
    attack = cue(73, "attack")
    won = cue(76, "won")
    place(storm(won - 27.9, 0.16), 27.9, 0.0, rev=0.2)
    groove(surprise - 0.1, won, [(surprise - 0.1, "Dm"), (attack + 0.3, "Bb")], "battle", pad_vel=0.3, arp_vel=0.12)
    place(taiko(0.9, 1.2), frame(surprise) + 2 / 30, rev=0.5)
    place(crash(0.3), frame(attack), 0.3, rev=0.5)
    place(sword(0.4), attack + 0.1, -0.3, rev=0.4)
    place(taiko(1.0, 1.3), frame(won), rev=0.6)
    place(crash(0.32), frame(won), 0.2, rev=0.6)
    chord_track([(won, 30.95, ["D3", "A3", "D4", "F#4", "A4"])], vel=0.44, attack=0.05, bright=1.4)
    for k, n in enumerate(["D5", "F#5", "A5", "D6"]):
        place(glock(hz(n), 0.2), won + 0.05 + k * 0.07, -0.3 + k * 0.2, rev=0.6)

    # ---- one of the most powerful men in Japan (30.85 - 34.8)
    suddenly = cue(77, "suddenly")
    powerful = cue(87, "powerful")
    place(noise_swell(0.4, 0.1, 800, 8000), suddenly - 0.3, rev=0.3)
    place(taiko(0.3, 1.2), suddenly + 0.2, rev=0.5)
    groove(30.85, 34.8, [(30.85, "D"), (32.1, "G"), (33.35, "A")], "stately", pad_vel=0.3, arp_vel=0.16)
    for k, n in enumerate(["D5", "E5", "F#5", "G5", "A5", "B5", "C#6", "D6"]):  # the power meter fills
        place(glock(hz(n), 0.12 + k * 0.012), suddenly + 0.6 + k * (powerful + 0.4 - suddenly - 0.6) / 8, 0.3, rev=0.5)
    melody(powerful - 0.3, [("A4", 0.5), ("D5", 0.5), ("F#5", 1.0), ("E5", 0.5), ("A5", 1.5)], inst="flute", vel=0.34)
    place(crash(0.22), powerful + 0.4, 0.2, rev=0.6)

    # ---- central Japan (34.8 - 38.4)
    year = cue(92, "fifteen")
    controlled = cue(96, "controlled")
    central = cue(99, "central")
    groove(34.8, 38.45, [(34.8, "D"), (36.05, "Bm"), (37.3, "G")], "march", pad_vel=0.3)
    place(taiko(0.6, 1.3), frame(year), rev=0.5)
    for k in range(6):  # each lord's flag turns Oda yellow
        place(glock(hz(["D6", "E6", "F#6", "A6", "B6", "D7"][k]), 0.14), frame(controlled) + 0.25 + k * 0.12, -0.4 + k * 0.16, rev=0.5)
    melody(central - 0.2, [("D5", 0.5), ("E5", 0.5), ("F#5", 0.5), ("A5", 0.5), ("B5", 1.0), ("A5", 1.0)], vel=0.32)

    # ---- the temple in Kyoto, June 1582 (38.4 - 42.9)
    june = cue(102, "june")
    temple = cue(111, "temple")
    place(swish(), 38.2)
    chord_track([(38.4, 40.6, ["G2", "D3", "G3", "B3"]), (40.6, 42.95, ["C3", "G3", "C4", "E4"])], vel=0.26, attack=0.8, release=0.6)
    arpeggio(38.45, 42.85, ["G4", "B4", "D5", "B4", "E5", "D5"], BEAT / 2, 0.14, 0.3, dur=0.4)
    melody(june + 0.2, [("D5", 1.0), ("B4", 0.5), ("A4", 0.5), ("G4", 1.5), ("E4", 0.5), ("G4", 1.5)], vel=0.28, vib=0.9)
    place(bell(hz("G3"), 0.26, 4.0), temple, 0.0, rev=0.6)
    for k in range(10):  # night insects
        place(shaker(0.05), 38.6 + k * 0.42, 0.6 if k % 2 else -0.6)

    # ---- the most trusted general turns (42.9 - 49.3)
    trusted = cue(118, "trusted")
    surrounded = cue(120, "surrounded")
    thirteen = cue(124, "thirteen")
    then = cue(127, "then")
    fire_w = cue(132, "fire")
    place(swish(), 42.7)
    place(pad(["G3", "B3", "D4"], surrounded - 42.9, 0.24, attack=0.3, release=0.2), 42.9, rev=0.45)
    melody(trusted - 0.1, [("B4", 0.5), ("D5", 0.5), ("G5", 1.0)], inst="koto", vel=0.3)  # warm...
    place(koto(hz("G5"), 0.6, 0.32, slide=-1), surrounded - 0.05, 0.2, rev=0.3)  # ...gone sour
    place(pad(["D2", "A2", "D3", "Eb3", "A3"], then - surrounded, 0.32, attack=0.3, release=0.3, bright=1.2), surrounded, rev=0.5)
    for k in range(int((then - surrounded) / (BEAT / 2))):
        place(taiko(0.28 if k % 2 == 0 else 0.18, 1.4), surrounded + k * BEAT / 2, rev=0.35)
    for k in range(10):  # soldiers appearing all round the temple
        place(woodblock(1200 + (k % 3) * 150, 0.1), frame(surrounded) + (4 + 3 * k) / 30, -0.4 + (k % 5) * 0.2)
    place(taiko(0.7, 1.4), frame(thirteen), rev=0.55)
    place(crash(0.16), frame(thirteen), 0.2, rev=0.55)
    for t0, n in [(then, "D3"), (then + 0.5, "Eb3")]:
        place(reed(hz(n) * 2, 0.45, 0.4), t0, -0.2, rev=0.45)
    place(fire(49.6 - then, 0.32), then + 0.3, 0.0, rev=0.2)
    place(taiko(0.65, 1.35), frame(fire_w), rev=0.6)
    place(crash(0.2), frame(fire_w), -0.2, rev=0.6)
    tr = fire_w + 0.1
    while tr < 49.3:  # tremolo over the flames
        place(koto(hz("A4" if int((tr - fire_w) / 0.08) % 2 else "Bb4"), 0.07, 0.16, ring=0.3), tr, 0.3, rev=0.3)
        tr += 0.08
    place(pad(["D2", "A2", "D3", "F3", "Bb3"], 49.35 - fire_w, 0.34, attack=0.1, release=0.4, bright=1.3), fire_w, rev=0.5)

    # ---- no way out (49.3 - 53.05): then a quiet, respectful end for Nobunaga
    no = cue(137, "no")
    so = cue(140, "so")
    seppuku = cue(143, "seppuku")
    place(fire(so - 49.3 + 0.6, 0.2), 49.3, 0.0, rev=0.2)
    place(pad(["D3", "A3", "Eb4"], no - 49.3, 0.22, attack=0.3, release=0.2), 49.3, rev=0.45)
    place(woodblock(800, 0.2), frame(no), -0.4)
    place(woodblock(800, 0.2), frame(no) + 3 / 30, 0.4)
    place(pad(["D3", "Ab3", "Eb4", "A4"], so - no, 0.3, attack=0.05, release=0.3, bright=1.2), no, rev=0.5)  # the stab
    place(taiko(0.6, 1.4), frame(no), rev=0.5)
    place(bass(hz("D2"), 53.1 - so, 0.26, pluck=False), so)
    place(pad(["D3", "A3", "D4"], 53.1 - so, 0.22, attack=0.8, release=0.8, bright=0.7), so, rev=0.6)
    melody(so + 0.2, [("A4", 1.0), ("G4", 0.5), ("F4", 0.5), ("D4", 2.0)], vel=0.26, vib=1.1)
    place(bell(hz("D3"), 0.32, 4.5), frame(seppuku) + 16 / 30, 0.0, rev=0.7)  # the doors close

    # ---- search it, at your own risk (53.05 - 56.6)
    what = cue(144, "what")
    sep2 = cue(146, "seppuku")
    search = cue(147, "search")
    but = cue(149, "but")
    risk = cue(153, "risk")
    t0, t1 = frame(what), frame(sep2) + 18 / 30
    for k in range(7):  # one click per letter typed
        place(woodblock(2200 + (k % 2) * 300, 0.12), t0 + (k + 0.5) / 7 * (t1 - t0), 0.3)
    place(pad(["G3", "D4", "A4"], but - 53.05, 0.18, attack=0.3, release=0.3), 53.05, rev=0.45)
    for k, n in enumerate(["G4", "A4", "B4", "D5"]):
        place(koto(hz(n), 0.2, 0.24, ring=0.4), 53.1 + k * BEAT, 0.2, rev=0.3)
    place(woodblock(1600, 0.3), frame(search) + 6 / 30, 0.2)  # click
    place(glock(hz("E6"), 0.2), frame(search) + 7 / 30, 0.2, rev=0.4)
    for t0, n in [(but, "D4"), (but + 0.35, "B3")]:  # uh-oh
        place(reed(hz(n), 0.32, 0.36), t0, 0.0, rev=0.4)
    place(boing(220, 0.32), risk + 0.1, 0.3)

    # ---- why? nobody knows for sure (56.6 - 63.5)
    why = cue(155, "why")
    turn = cue(159, "turn")
    even = cue(162, "even")
    nobody = cue(164, "nobody")
    place(swish(), 56.4)
    sho(["D4", "E4", "A4", "B4"], 56.6, 7.0, 0.26)
    place(koto(hz("A4"), 0.5, 0.32, bend=0.6), why, 0.0, rev=0.4)
    place(koto(hz("E5"), 0.8, 0.3, bend=0.6), why + 0.45, 0.2, rev=0.4)
    place(crack(0.4), frame(turn) + 0.05, 0.0, rev=0.4)  # the heart breaks
    place(bass(hz("D2"), 63.5 - turn, 0.26, pluck=False), turn)
    for k, n in enumerate(["E5", "D5", "B4", "A4"]):  # the historians shrug
        place(koto(hz(n), 0.3, 0.24, ring=0.6), even + 0.3 + k * BEAT / 2, -0.2 + k * 0.15, rev=0.4)
    place(taiko(0.4, 1.3), frame(nobody), rev=0.5)
    place(woodblock(900, 0.24), frame(nobody), 0.2)
    # an open, unresolved chord that rings into silence
    chord_track([(nobody + 0.4, 63.5, ["D3", "A3", "E4", "A4", "B4"])], vel=0.32, attack=0.6, release=1.0, bright=0.9)
    melody(nobody + 0.6, [("B4", 1.0), ("A4", 1.0), ("E5", 3.0)], vel=0.26, vib=0.9)
    place(glock(hz("E6"), 0.16), 62.2, 0.3, rev=0.7)


LEVELS = [
    (0.0, 3.0, -19.0), (3.0, 6.3, -29.5), (6.3, 13.45, -30.5), (13.45, 15.55, -31.0), (15.55, 18.0, -30.5),
    (18.0, 23.5, -29.5), (23.5, 28.0, -30.0), (28.0, 30.85, -29.0), (30.85, 34.8, -29.5), (34.8, 38.4, -29.5),
    (38.4, 42.9, -31.0), (42.9, 49.3, -29.5), (49.3, 53.05, -31.0), (53.05, 56.6, -31.0), (56.6, 61.2, -31.0),
    (61.2, 63.5, -25.0),
]


if __name__ == "__main__":
    args = cli(os.path.join("public", "japan", "music_p6.wav"))
    score()
    render(LEVELS, args.narration, args.out)
