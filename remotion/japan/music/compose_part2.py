"""Original score for "Japan – Part 2: gods, emperors & samurai" (86 s).

Same instruments as Part 1 (see synth.py), so the series sounds like one
piece. Cue times come straight from the Part 2 word timings, so the music
lands on the same words as the animation.

  0.0  title          the series opening, koto + flute
  3.0  538, Buddhism  serene; temple bell, shimmering G major
  7.4  keeps both     light groove; the Jomon theme returns; shrine bells
 16.5  rites          matsuri drums for births and festivals, then a quiet
                      temple bell and wooden fish for funerals
 21.0  today          gentle, modern-feeling groove
 25.6  Kyoto          court music: reed and sho-like clusters, then a
                      suspense sting on "the story gets interesting"
 31.1  emperor        ticking clock, a sliding "deflate" as power drains
 34.1  landowners     uneasy drone, heartbeat, a sneaky bandit sting
 38.2  guards         march; coins, a chase, bales of tax rice
 42.8  samurai        riser into a heroic hit
 44.8  weaker/stronger falling line, then a rising one with drums
 49.0  war            taiko battle, clash, Minamoto and Taira motifs
 54.4  victory        fanfare, then an unresolved "strange new system"
 57.9  hierarchy      stately build, one layer per tier of the pyramid
 74.7  bushido        solo flute over a drone, temple bell
 77.9  two swords     blade rings, then a calm closing cadence (no sting)

Run from the repo root:
    python3 remotion/japan/music/compose_part2.py --narration narration_p2.wav
"""
import json
import os
import re

from synth import *  # noqa: F401,F403  (instruments, helpers, constants)
from synth import cli, configure, render

DUR = 86.0
configure(DUR)

_ts = open(os.path.join(os.path.dirname(__file__), "..", "words-part2.ts")).read()
WORDS = [(float(a), float(b)) for a, b in re.findall(r'\["[^"]*", ([\d.]+), ([\d.]+)\]', _ts)]
SPOKEN = json.loads(re.search(r"SPOKEN_P2 = (\[.*?\]);", _ts, re.S).group(1))


def cue(i, word):
    """Video time of narration word i (checked against the spoken word)."""
    assert SPOKEN[i] == word, (i, SPOKEN[i], word)
    return NARRATION_OFFSET + WORDS[i][0]


CH = {
    "G": (["G2", "D3", "G3", "B3", "D4"], ["G3", "D4", "G4", "D4", "B3", "D4", "G4", "D4"], "G2", "D3"),
    "Em": (["E2", "B2", "E3", "G3", "B3"], ["E3", "B3", "E4", "B3", "G3", "B3", "E4", "B3"], "E2", "B2"),
    "C": (["C3", "G3", "C4", "E4", "G4"], ["C4", "G4", "C5", "G4", "E4", "G4", "C5", "G4"], "C2", "G2"),
    "Am": (["A2", "E3", "A3", "C4", "E4"], ["A3", "E4", "A4", "E4", "C4", "E4", "A4", "E4"], "A2", "E2"),
    "D": (["D3", "A3", "D4", "F#4", "A4"], ["D4", "A4", "D5", "A4", "F#4", "A4", "D5", "A4"], "D2", "A2"),
    "Bm": (["B2", "F#3", "B3", "D4", "F#4"], ["B3", "F#4", "B4", "F#4", "D4", "F#4", "B4", "F#4"], "B1", "F#2"),
    "A": (["A2", "E3", "A3", "C#4", "E4"], ["A3", "E4", "A4", "E4", "C#4", "E4", "A4", "E4"], "A2", "E2"),
    "Dm": (["D3", "A3", "D4", "F4", "A4"], ["D4", "A4", "D5", "A4", "F4", "A4", "D5", "A4"], "D2", "A2"),
    "Bb": (["Bb2", "F3", "Bb3", "D4", "F4"], ["Bb3", "F4", "Bb4", "F4", "D4", "F4", "Bb4", "F4"], "Bb1", "F2"),
    "Gm": (["G2", "D3", "G3", "Bb3", "D4"], ["G3", "D4", "G4", "D4", "Bb3", "D4", "G4", "D4"], "G2", "D3"),
    "Eb": (["Eb3", "G3", "Bb3", "Eb4"], ["Eb4", "Bb4", "Eb5", "Bb4", "G4", "Bb4", "Eb5", "Bb4"], "Eb2", "Bb2"),
    "Din": (["D3", "A3", "D4"], ["D4", "A4", "D5", "A4", "Bb4", "A4", "D5", "A4"], "D2", "A2"),
}


def groove(start, end, chords, style="light", pad_vel=0.3, arp_vel=0.2):
    """Lay down pad, bass, koto arpeggio and drums for a run of chords.
    chords: list of (time, name); each lasts until the next (or `end`)."""
    times = [c[0] for c in chords[1:]] + [end]
    for (t0, name), t1 in zip(chords, times):
        chord, arp, root, fifth = CH[name]
        bright = {"battle": 1.7, "modern": 1.2, "march": 1.1}.get(style, 1.0)
        place(pad(chord, t1 - t0, pad_vel, attack=0.3, release=0.5, bright=bright), t0, rev=0.45)
        step = BEAT / (4 if style == "battle" else 2)
        arpeggio(t0, t1, arp, step, arp_vel, -0.3, dur=0.25 if style == "battle" else 0.3)
        b = 0
        while t0 + b * BEAT < t1 - 0.05:
            tb = t0 + b * BEAT
            if style == "light":
                if b % 2 == 0:
                    place(bass(hz(root if b % 4 == 0 else fifth), BEAT * 1.6, 0.36), tb)
                    place(taiko(0.2, 1.35), tb, rev=0.3)
                place(shaker(0.18), tb + BEAT / 2, 0.4)
                place(shaker(0.1), tb, 0.4)
            elif style == "modern":
                for off, n, v in [(0, root, 0.38), (0.75, root, 0.26), (1.5, fifth, 0.3)]:
                    if b % 2 == 0 and tb + off * BEAT < t1 - 0.05:
                        place(bass(hz(n), BEAT * 0.45, v), tb + off * BEAT)
                for k in range(4):
                    place(shaker(0.14 if k % 2 else 0.08), tb + k * BEAT / 4, 0.4)
                if b % 4 == 2:
                    place(woodblock(1100, 0.18), tb, 0.3)
            elif style == "march":
                place(taiko(0.32 if b % 2 == 0 else 0.22, 1.2), tb, rev=0.3)
                place(shime(0.2), tb + BEAT / 2, 0.35)
                place(bass(hz(root if b % 2 == 0 else fifth), BEAT * 0.5, 0.36), tb)
            elif style == "battle":
                for k, g in enumerate([1.0, 0, 0.6, 0.8]):
                    if g and tb + k * BEAT / 4 < t1 - 0.05:
                        place(taiko(0.5 * g, 0.95), tb + k * BEAT / 4, (-0.2 if k % 2 else 0.2), rev=0.3)
                    place(shime(0.16 + 0.08 * (k == 0)), tb + k * BEAT / 4, 0.35, rev=0.2)
                place(bass(hz(root), BEAT * 0.4, 0.4), tb)
            elif style == "stately":
                if b % 2 == 0:
                    place(taiko(0.22, 1.4), tb, rev=0.45)
                    place(bass(hz(root), BEAT * 1.8, 0.3, pluck=False), tb)
            b += 1


def sho(notes, t0, dur, vel=0.3):
    """Sho-like mouth-organ cluster: a soft bright pad that swells in."""
    place(pad(notes, dur, vel, attack=min(1.2, dur * 0.4), release=0.9, bright=0.75, width=0.3), t0, rev=0.55)


def score():
    # ---- title (0 - 3.0): the series opening
    place(taiko(0.45, 1.1), 0.05, rev=0.6)
    place(pad(["D3", "A3", "D4"], 3.2, 0.45, attack=1.6, release=1.2), 0.0, rev=0.5)
    for i, n in enumerate(["D4", "G4", "A4", "Bb4", "D5", "Eb5", "G5"]):
        place(koto(hz(n), 0.9, 0.36 + i * 0.04), 0.22 + i * 0.11, -0.4 + i * 0.12, rev=0.4)
    melody(1.05, [("A4", 0.8), ("Bb4", 0.4), ("A4", 0.4), ("D5", 0.6), ("A4", 2.6)], vel=0.42)
    place(glock(hz("D6"), 0.25), 2.25, 0.5, rev=0.6)
    place(noise_swell(0.8, 0.12, 800, 7000), 2.3, rev=0.4)

    # ---- 538: Buddhism arrives (3.0 - 7.35): serene
    year = cue(1, "five")
    arrived = cue(7, "arrived")
    buddhism = cue(12, "buddhism")
    place(bell(hz("D3"), 0.55, 6.0), year, 0.0, rev=0.6)  # temple bell for the date
    sho(["D4", "A4", "D5", "E5"], 3.0, 3.6, 0.3)
    place(bass(hz("D2"), 3.5, 0.3, pluck=False), 3.0)
    arpeggio(arrived - 0.1, buddhism - 0.1, ["D5", "A4", "E5", "A4", "B4", "A4", "D5", "A4"], BEAT / 2, 0.16, 0.3)
    melody(arrived, [("A4", 1.0), ("B4", 0.5), ("D5", 1.5), ("E5", 1.0)], vel=0.34)
    chord_track([(buddhism - 0.1, 7.45, ["G2", "D3", "G3", "B3", "D4", "A4"])], vel=0.42, attack=0.4, bright=1.1)
    for k, n in enumerate(["G5", "B5", "D6", "G6", "A6"]):
        place(glock(hz(n), 0.24), buddhism + k * 0.07, -0.3 + k * 0.15, rev=0.7)
    place(suzu(0.25), buddhism + 0.05, 0.3, rev=0.5)

    # ---- keeps both (7.35 - 16.5): light groove in G, the Jomon theme returns
    jomon = cue(18, "jomon")
    mixed = cue(20, "mixed")
    new = cue(22, "new")
    old = cue(25, "old")
    did = cue(27, "did")
    shinto = cue(34, "shinto")
    kept = cue(37, "kept")
    both = cue(38, "both")
    place(swish(), 7.15)
    groove(7.35, did - 0.05, [(7.35, "G"), (8.6, "Em"), (9.85, "C"), (11.1, "D")], "light")
    melody(jomon - 0.05, [("D5", 1), ("B4", 0.5), ("A4", 0.5), ("G4", 1), ("E4", 1)], vel=0.4, pan=-0.1)
    place(glock(hz("B5"), 0.25), new, 0.5, rev=0.6)
    place(koto(hz("G3"), 0.4, 0.4, bend=0.5), old, -0.4, rev=0.3)
    # "did not give up": two firm stops
    place(taiko(0.5, 1.2), did, rev=0.35)
    place(koto(hz("D3"), 0.2, 0.5), did, rev=0.3)
    place(taiko(0.45, 1.2), did + BEAT, rev=0.35)
    place(koto(hz("D3"), 0.2, 0.45), did + BEAT, rev=0.3)
    sho(["D4", "G4", "A4", "D5"], did + 2 * BEAT, both - did - 2 * BEAT + 0.2, 0.28)
    place(bass(hz("G2"), both - did, 0.28, pluck=False), did + 2 * BEAT)
    arpeggio(did + 2 * BEAT, kept - 0.1, ["G4", "D5", "A4", "D5"], BEAT / 2, 0.15, 0.2)
    place(suzu(0.35), shinto, -0.4, rev=0.5)
    place(glock(hz("D6"), 0.22), shinto + 0.1, -0.4, rev=0.6)
    chord_track([(kept - 0.05, 16.6, ["G2", "D3", "G3", "B3", "D4", "G4"])], vel=0.45, attack=0.25, bright=1.15)
    place(taiko(0.4, 1.2), kept, rev=0.4)
    for k, n in enumerate(["G5", "B5", "D6"]):
        place(glock(hz(n), 0.22), both + k * 0.08, -0.2 + k * 0.2, rev=0.6)
    melody(kept + 0.05, [("G5", 0.5), ("A5", 0.5), ("B5", 2.0)], vel=0.36, pan=0.15)

    # ---- rites (16.5 - 20.95): festival drums, then the temple
    births = cue(42, "births")
    festivals = cue(44, "festivals")
    bud2 = cue(46, "buddhism")
    funerals = cue(49, "funerals")
    place(swish(), 16.3)
    groove(16.5, bud2 - 0.1, [(16.5, "G"), (17.75, "C")], "light", pad_vel=0.28)
    place(glock(hz("G5"), 0.25), births + 0.1, -0.3, rev=0.6)
    place(glock(hz("B5"), 0.2), births + 0.22, -0.3, rev=0.6)
    t = festivals
    k = 0
    while t < bud2 - 0.1:  # matsuri drumming + a festive fue line
        place(taiko(0.38 if k % 2 == 0 else 0.26, 1.1), t, -0.2, rev=0.35)
        place(shime(0.3), t + BEAT / 4, 0.3)
        place(shime(0.22), t + BEAT * 0.75, 0.3)
        t += BEAT / 2
        k += 1
    melody(festivals, [("D6", 0.25), ("E6", 0.25), ("G6", 0.5), ("E6", 0.25), ("D6", 0.25), ("B5", 0.5)], vel=0.3, pan=-0.3)
    place(bell(hz("D3"), 0.5, 5.0), bud2, 0.3, rev=0.6)
    sho(["D3", "A3", "D4", "Eb4"], bud2, 20.95 - bud2 + 0.2, 0.26)
    for k in range(4):  # mokugyo, the wooden fish of temple chanting
        place(woodblock(420, 0.35), funerals + k * BEAT * 0.5, 0.35)
    place(flute(hz("A4"), 0.9, 0.3, vib=0.6), funerals + 0.1, 0.2, rev=0.5)

    # ---- today (20.95 - 25.6): gentle modern groove
    today = cue(51, "today")
    both2 = cue(56, "both")
    place(swish(), 20.75)
    groove(20.95, 25.5, [(20.95, "G"), (22.2, "D"), (23.45, "Em"), (24.7, "C")], "modern", pad_vel=0.3)
    place(glock(hz("D6"), 0.25), today, 0.3, rev=0.6)
    melody(21.9, [("B4", 0.5), ("D5", 0.5), ("E5", 1), ("D5", 0.5), ("B4", 0.5), ("A4", 1), ("G4", 2)], vel=0.32)
    place(glock(hz("G5"), 0.22), both2, -0.4, rev=0.6)
    place(glock(hz("B5"), 0.22), both2 + 0.2, 0.4, rev=0.6)

    # ---- Kyoto (25.6 - 31.1): court music, then suspense
    seven = cue(62, "seven")
    kyoto = cue(65, "kyoto")
    capital = cue(68, "capital")
    story = cue(74, "story")
    interesting = cue(76, "interesting")
    place(taiko(0.5, 1.2), seven, rev=0.5)
    place(bell(hz("A3"), 0.35, 4.0), seven, rev=0.6)
    sho(["D4", "E4", "A4", "B4", "E5"], 25.6, story - 25.6, 0.3)
    place(bass(hz("D2"), story - 25.6, 0.28, pluck=False), 25.6)
    for t0, n, d in [(kyoto - 0.1, "A4", 0.6), (kyoto + 0.55, "B4", 0.3), (kyoto + 0.9, "D5", 0.9), (capital, "E5", 0.6), (capital + 0.65, "D5", 0.4), (capital + 1.1, "B4", 0.5)]:
        place(reed(hz(n), d, 0.42), t0, 0.1, rev=0.5)
    arpeggio(capital, story - 0.1, ["D4", "E4", "A4", "B4", "D5", "E5", "A5", "B5"], BEAT / 4, 0.16, -0.3, dur=0.2)
    place(taiko(0.6, 1.3), story, rev=0.5)
    place(taiko(0.75, 1.35), interesting + 0.05, rev=0.6)
    place(pad(["D2", "A2", "D3", "Eb3"], 31.1 - story, 0.4, attack=0.3, release=0.6, bright=1.4), story, rev=0.4)
    place(glock(hz("Eb6"), 0.2), interesting + 0.4, 0.4, rev=0.7)

    # ---- the emperor loses power (31.1 - 34.05)
    over = cue(77, "over")
    losing = cue(82, "losing")
    power = cue(83, "power")
    place(swish(), 30.9)
    for k in range(int((losing - over) / (BEAT / 2))):  # tick-tock while the calendar flips
        place(woodblock(1200 if k % 2 == 0 else 900, 0.22), over + k * BEAT / 2, 0.3 if k % 2 else -0.3)
    sho(["G3", "D4", "A4", "D5"], 31.1, losing - 31.1 + 0.3, 0.26)
    place(bass(hz("G2"), losing - 31.1, 0.26, pluck=False), 31.1)
    for k, n in enumerate(["D5", "B4", "A4", "G4", "E4", "D4"]):
        place(koto(hz(n), 0.25, 0.38 - k * 0.03), losing + k * 0.14, 0.2, rev=0.3)
    place(bass_slide(hz("D3"), hz("D2"), 0.9, 0.45), power)
    place(koto(hz("A4"), 0.6, 0.35, slide=-5), power + 0.1, 0.0, rev=0.3)

    # ---- landowners feel unsafe (34.05 - 38.2)
    far = cue(87, "far")
    no = cue(91, "no")
    safe = cue(94, "safe")
    place(noise_swell(4.0, 0.08, 300, 1500, 1.0), 34.05, -0.3, rev=0.4)
    place(pad(["D3", "A3", "Bb3"], 4.2, 0.24, attack=0.6, release=0.6, bright=0.9), 34.05, rev=0.5)
    place(bass(hz("D2"), 4.0, 0.24, pluck=False), 34.05)
    arpeggio(34.1, no - 0.1, ["D4", "A4", "Bb4", "A4"], BEAT, 0.16, 0.2)
    melody(far - 0.1, [("A4", 1), ("Bb4", 0.5), ("A4", 1.5)], vel=0.28)
    t = no
    while t < safe:  # heartbeat
        place(taiko(0.28, 1.4), t, rev=0.3)
        place(taiko(0.18, 1.4), t + 0.18, rev=0.3)
        t += BEAT * 1.2
    place(koto(hz("Eb4"), 0.35, 0.45, slide=-3), safe + 0.1, 0.4, rev=0.3)  # sneaky bandit
    place(woodblock(700, 0.3), safe + 0.1, 0.4)

    # ---- guards (38.2 - 42.75): march, coins, chase, tax bales
    paid = cue(97, "paid")
    armed = cue(98, "armed")
    protect = cue(104, "protect")
    collect = cue(108, "collect")
    place(swish(), 38.0)
    groove(38.2, 42.7, [(38.2, "D"), (39.45, "G"), (40.7, "A"), (41.95, "D")], "march", pad_vel=0.28)
    for k in range(3):
        place(glock(hz(["E6", "G6", "A6"][k]), 0.2), paid + 0.13 + k * 0.13, 0.4, rev=0.4)
    place(taiko(0.45, 1.1), armed, rev=0.35)
    for k, n in enumerate(["D5", "E5", "F#5", "A5", "B5", "A5", "F#5", "E5", "D5", "A4"]):
        place(koto(hz(n), 0.07, 0.3, ring=0.35), protect + 0.1 + k * 0.08, 0.3, rev=0.25)
    for k in range(4):
        place(taiko(0.3, 1.5), collect + 0.15 + k * 0.17, rev=0.25)

    # ---- the guards became samurai (42.75 - 44.82): riser + heroic hit
    became = cue(112, "became")
    samurai = cue(114, "samurai")
    place(noise_swell(became - 42.6, 0.3, 300, 6000, 2.2), 42.6, rev=0.3)
    place(pad(["D3", "A3", "D4"], became - 42.75, 0.28, attack=0.4, release=0.3, bright=1.3), 42.75, rev=0.4)
    place(taiko(0.85, 1.25), became + 0.15, rev=0.5)
    place(crash(0.35), became + 0.15, 0.2, rev=0.5)
    chord_track([(became + 0.15, 44.95, ["D2", "A2", "D3", "F#3", "A3", "D4"])], vel=0.48, attack=0.08, release=0.6, bright=1.5)
    melody(samurai - 0.05, [("D5", 0.4), ("A5", 0.8)], vel=0.42, pan=0.0)
    place(taiko(0.6, 1.2), samurai, rev=0.4)

    # ---- weaker / stronger (44.82 - 48.95)
    weaker = cue(120, "weaker")
    stronger = cue(124, "stronger")
    sho(["D3", "A3", "D4"], 44.82, 4.2, 0.25)
    for k, n in enumerate(["A5", "G5", "E5", "D5", "B4", "A4"]):
        place(koto(hz(n), 0.3, 0.32 - k * 0.025), weaker - 0.1 + k * 0.16, -0.3, rev=0.3)
    place(bass_slide(hz("A2"), hz("D2"), 0.8, 0.35), weaker + 0.2)
    t = stronger - 1.0
    k = 0
    while t < stronger + 0.4:
        place(taiko(0.2 + 0.08 * k, 1.1), t, rev=0.3)
        t += BEAT / 2
        k += 1
    for k, n in enumerate(["D4", "E4", "F#4", "A4", "B4", "D5", "E5", "F#5", "A5"]):
        place(koto(hz(n), 0.25, 0.26 + k * 0.025), stronger - 0.6 + k * 0.1, 0.3, rev=0.3)
    chord_track([(stronger + 0.3, 49.05, ["D2", "A2", "D3", "F#3", "A3", "D4"])], vel=0.45, attack=0.05, release=0.6, bright=1.4)
    place(taiko(0.7, 1.2), stronger + 0.3, rev=0.45)

    # ---- war (48.95 - 54.4): Minamoto vs Taira
    two = cue(127, "two")
    war = cue(133, "war")
    minamoto = cue(137, "minamoto")
    taira = cue(140, "taira")
    place(swish(), 48.75)
    groove(two - 0.1, 54.35, [(two - 0.1, "Dm"), (war, "Bb"), (war + 1.25, "Gm"), (war + 2.5, "A")], "battle", pad_vel=0.34, arp_vel=0.14)
    place(rumble(war - 48.95, 0.14), 48.95, rev=0.1)
    place(noise_swell(war - (two + 0.2), 0.3, 200, 4000, 2), two + 0.2, rev=0.3)
    place(taiko(1.0, 1.3), war + 0.05, rev=0.5)
    place(crash(0.45), war + 0.05, 0.2, rev=0.5)
    place(wave_crash(0.4), war + 0.05, 0.0, rev=0.4)
    melody(minamoto, [("D6", 0.5), ("A5", 0.5), ("D6", 1.0)], vel=0.32, pan=-0.4)  # a shrill fue call
    melody(taira, [("Bb4", 0.5), ("A4", 0.5), ("D4", 1.0)], vel=0.34, pan=0.4)

    # ---- victory (54.4 - 57.9)
    won = cue(143, "won")
    strange = cue(148, "strange")
    system = cue(150, "system")
    place(taiko(0.8, 1.2), won, rev=0.5)
    place(crash(0.35), won, 0.3, rev=0.55)
    chord_track([(won, strange - 0.2, ["D3", "A3", "D4", "F#4", "A4", "D5"])], vel=0.46, attack=0.1, release=0.6, bright=1.3)
    melody(won + 0.05, [("A5", 0.5), ("B5", 0.5), ("D6", 1.0), ("A5", 0.5), ("F#5", 1.0)], vel=0.38, pan=0.1)
    place(bass(hz("D2"), strange - won, 0.38, pluck=False), won)
    sho(["G3", "C4", "D4", "A4"], strange - 0.2, 57.95 - strange + 0.4, 0.28)  # suspended, unresolved
    for k, n in enumerate(["D6", "E6", "A6"]):
        place(glock(hz(n), 0.18), system + k * 0.18, 0.3, rev=0.7)

    # ---- the hierarchy (57.9 - 74.7): stately build, one layer per tier
    emp = cue(152, "emperor")
    gods = cue(165, "gods")
    but = cue(166, "but")
    real = cue(173, "real")
    shogun = cue(183, "shogun")
    under1 = cue(184, "under")
    daimyo = cue(188, "daimyo")
    ruled = cue(191, "ruled")
    under2 = cue(195, "under")
    sam = cue(200, "samurai")
    place(swish(), 57.7)
    sho(["D4", "E4", "A4", "B4", "E5"], 57.9, but - 57.9, 0.32)
    place(bass(hz("D2"), but - 57.9, 0.26, pluck=False), 57.9)
    for t0, n, d in [(emp, "A4", 0.8), (emp + 0.9, "B4", 0.5), (emp + 1.5, "D5", 1.2), (gods - 1.2, "E5", 0.8), (gods - 0.3, "D5", 1.2)]:
        place(reed(hz(n), d, 0.36), t0, 0.15, rev=0.55)
    for k, n in enumerate(["A5", "D6", "E6", "A6", "B6"]):
        place(glock(hz(n), 0.2), gods + k * 0.08, -0.4 + k * 0.2, rev=0.7)
    place(bass_slide(hz("A2"), hz("A1"), 0.8, 0.4), but + 0.6)  # "no real power"
    place(koto(hz("D5"), 0.6, 0.4, slide=-7), but + 0.7, 0.2, rev=0.3)
    place(woodblock(800, 0.3), cue(171, "power") + 0.1, 0.3)
    groove(real, under1, [(real, "Dm"), (real + 2.5, "Bb")], "stately", pad_vel=0.32, arp_vel=0.12)
    place(taiko(0.75, 1.3), shogun, rev=0.5)
    place(pad(["D2", "A2", "D3", "F3", "A3"], 0.9, 0.45, attack=0.05, release=0.6, bright=1.6), shogun, rev=0.4)
    groove(under1, under2, [(under1, "Gm"), (under1 + 2.5, "Dm")], "march", pad_vel=0.3, arp_vel=0.14)
    place(taiko(0.65, 1.25), daimyo, rev=0.45)
    for k in range(5):
        place(glock(hz(["D6", "F6", "G6", "A6", "C7"][k]), 0.16), ruled + k * 0.15, 0.6, rev=0.6)
    groove(under2, 74.7, [(under2, "Bb"), (sam - 0.4, "A")], "battle", pad_vel=0.32, arp_vel=0.14)
    place(taiko(0.85, 1.3), sam, rev=0.5)
    place(crash(0.3), sam, 0.2, rev=0.5)

    # ---- bushido (74.7 - 77.9): solo flute over a drone
    strict = cue(205, "strict")
    bushido = cue(210, "bushido")
    place(swish(), 74.5)
    place(pad(["D3", "A3", "D4"], 3.4, 0.3, attack=0.6, release=0.8, bright=0.85), 74.7, rev=0.55)
    place(bass(hz("D2"), 3.3, 0.26, pluck=False), 74.7)
    melody(75.0, [("A4", 0.8), ("D5", 0.6), ("Eb5", 0.4), ("D5", 0.6), ("A4", 0.6), ("G4", 0.4), ("A4", 1.0)], vel=0.4, vib=1.3)
    place(koto(hz("D4"), 0.6, 0.3), strict, -0.3, rev=0.4)
    place(bell(hz("D3"), 0.5, 5.0), bushido, 0.0, rev=0.6)
    place(taiko(0.55, 1.3), bushido, rev=0.5)

    # ---- two swords (77.9 - 82.6) and a calm ending
    two2 = cue(214, "two")
    katana = cue(218, "katana")
    waki = cue(222, "wakizashi")
    place(swish(), 77.7)
    groove(77.9, 82.6, [(77.9, "G"), (79.15, "Em"), (80.4, "C"), (81.65, "D")], "light", pad_vel=0.28, arp_vel=0.16)
    place(glock(hz("G5"), 0.2), two2, 0.3, rev=0.6)
    place(glock(hz("D6"), 0.2), two2 + 0.15, 0.3, rev=0.6)
    place(sword(0.6, 1.8), katana - 0.05, 0.3, rev=0.4)
    place(sword(0.45, 1.0), waki - 0.05, 0.3, rev=0.4)
    # closing cadence: G, a breath on C, home to G — no sting, just rest
    end0 = 82.6
    place(taiko(0.4, 1.3), end0, rev=0.6)
    place(pad(["G2", "D3", "G3", "B3", "D4", "A4"], 1.5, 0.4, attack=0.2, release=0.9), end0, rev=0.55)
    place(pad(["C3", "G3", "C4", "E4", "G4", "D5"], 1.2, 0.34, attack=0.5, release=0.9), end0 + 1.25, rev=0.55)
    place(pad(["G2", "D3", "G3", "B3", "D4", "G4"], 1.8, 0.36, attack=0.6, release=1.2), end0 + 2.5, rev=0.6)
    place(bass(hz("G1"), 1.3, 0.36, pluck=False), end0)
    place(bass(hz("C2"), 1.2, 0.3, pluck=False), end0 + 1.25)
    place(bass(hz("G1"), 1.5, 0.28, pluck=False), end0 + 2.5)
    for k, n in enumerate(["G4", "A4", "B4", "D5", "E5", "G5", "A5", "B5", "D6"]):
        place(koto(hz(n), 0.8, 0.24 + k * 0.02), end0 + 0.02 + k * 0.05, -0.5 + k * 0.12, rev=0.45)
    melody(end0 + 0.4, [("D5", 1.0), ("E5", 0.5), ("D5", 0.5), ("B4", 1.0), ("G4", 2.5)], vel=0.32, pan=0.1)
    place(glock(hz("G6"), 0.22), end0 + 2.5, 0.3, rev=0.7)
    place(bell(hz("G3"), 0.28, 3.0), end0 + 2.5, 0.0, rev=0.6)


# Mix automation targets (RMS dBFS), same scheme as Part 1: ~11-13 dB under
# the voice, hotter for the battle, full level on the title and the ending.
LEVELS = [
    (0.0, 3.0, -19.0), (3.0, 7.35, -30.5), (7.35, 16.5, -31.0), (16.5, 20.95, -31.0), (20.95, 25.6, -31.0),
    (25.6, 31.1, -30.5), (31.1, 34.05, -31.5), (34.05, 38.2, -32.0), (38.2, 42.75, -30.5), (42.75, 44.82, -28.5),
    (44.82, 48.95, -30.0), (48.95, 54.4, -27.5), (54.4, 57.9, -29.0), (57.9, 74.7, -30.5), (74.7, 77.9, -31.0),
    (77.9, 82.6, -30.5), (82.6, 86.0, -21.0),
]


if __name__ == "__main__":
    args = cli(os.path.join("public", "japan", "music_p2.wav"))
    score()
    render(LEVELS, args.narration, args.out)
