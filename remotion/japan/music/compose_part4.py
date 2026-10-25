"""Original score for "Japan – Part 4: Kyoto burns & the warring states" (54 s).

Same instruments as the earlier parts (synth.py); cue times come from the
Part 4 word timings.

  0.0  title           the series opening
  3.0  street war      taiko battle groove into a clash
  5.6  the leaders     a heavy Red Monk theme; an awkward sting for the in-law
 11.4  fire            crackling fire, tremolo, a hit per building
 15.3  destroyed       a lament on the flute, a temple bell
 19.1  how long?       quiz ticking, a pluck per guess, a buzz per cross,
                       a big hit for "10 whole years"
 25.9  nobody won      quiet bell and a deflating slide
 29.8  Sengoku         flags popping up, then a heavy title hit
 34.4  civil wars      fast drums; the "again and again" motif twice
 38.4  gekokujo        a lightbulb shimmer, then low note beats high note
 44.4  family name     a pompous little fanfare, struck out
 46.8  push out        a strong-man march, a shove, a crash, a happy cadence

Run from the repo root:
    python3 remotion/japan/music/compose_part4.py --narration narration_p4.wav
"""
import json
import os
import re

from synth import *  # noqa: F401,F403  (instruments, helpers, constants)
from synth import cli, configure, render

DUR = 54.0
configure(DUR)

_ts = open(os.path.join(os.path.dirname(__file__), "..", "words-part4.ts")).read()
WORDS = [(float(a), float(b)) for a, b in re.findall(r'\["(?:[^"\\]|\\.)*", ([\d.]+), ([\d.]+)\]', _ts)]
SPOKEN = json.loads(re.search(r"SPOKEN_P4 = (\[.*?\]);", _ts, re.S).group(1))
assert len(WORDS) == len(SPOKEN), (len(WORDS), len(SPOKEN))


def cue(i, word):
    """Video time of narration word i (checked against the spoken word)."""
    assert SPOKEN[i] == word, (i, SPOKEN[i], word)
    return NARRATION_OFFSET + WORDS[i][0]


def score():
    # ---- title (0 - 3.0)
    place(taiko(0.45, 1.1), 0.05, rev=0.6)
    place(pad(["D3", "A3", "D4"], 3.2, 0.45, attack=1.6, release=1.2), 0.0, rev=0.5)
    for i, n in enumerate(["D4", "G4", "A4", "Bb4", "D5", "Eb5", "G5"]):
        place(koto(hz(n), 0.9, 0.36 + i * 0.04), 0.22 + i * 0.11, -0.4 + i * 0.12, rev=0.4)
    melody(1.05, [("A4", 0.8), ("Bb4", 0.4), ("A4", 0.4), ("G4", 0.6), ("D4", 2.6)], vel=0.42)
    place(noise_swell(0.8, 0.14, 300, 5000), 2.3, rev=0.4)

    # ---- war in the streets (3.0 - 5.6)
    groove(3.0, 5.6, [(3.0, "Dm"), (4.25, "Bb")], "battle", pad_vel=0.32, arp_vel=0.12)
    place(taiko(0.8, 1.25), 5.3, rev=0.5)
    place(crash(0.3), 5.3, 0.2, rev=0.5)

    # ---- the Red Monk and his son-in-law (5.6 - 11.35)
    scary = cue(16, "scary")
    red = cue(20, "red")
    other = cue(22, "the")
    son = cue(30, "son")
    place(pad(["D2", "A2", "D3", "Eb3"], other - 5.6, 0.36, attack=0.3, release=0.4, bright=1.4), 5.6, rev=0.45)
    for t0 in (scary, scary + BEAT, red):
        place(taiko(0.55, 1.35), t0, rev=0.45)
    for t0, n, d in [(scary + 0.1, "D3", 0.8), (scary + 0.95, "Eb3", 0.5), (red, "D3", 1.2)]:
        place(reed(hz(n) * 2, d, 0.4), t0, -0.3, rev=0.45)
    place(crash(0.25), red + 0.05, -0.3, rev=0.5)
    place(pad(["G2", "D3", "G3", "Bb3"], 11.4 - other, 0.3, attack=0.3, release=0.4), other, rev=0.45)
    arpeggio(other, son, ["G4", "Bb4", "D5", "Bb4"], BEAT / 2, 0.2, 0.3)
    place(glock(hz("D6"), 0.22), son, 0.3, rev=0.6)
    place(woodblock(700, 0.32), son + 0.6, 0.3)  # awkward...
    place(koto(hz("Bb4"), 0.5, 0.36, slide=-4), son + 0.62, 0.3, rev=0.3)

    # ---- fire (11.35 - 15.25)
    fire_w = cue(35, "fire")
    houses = cue(39, "houses")
    temples = cue(40, "temples")
    palaces = cue(42, "palaces")
    place(swish(), 11.15)
    place(fire(15.4 - fire_w, 0.32), fire_w, 0.0, rev=0.2)
    place(pad(["D3", "A3", "Eb4", "A4"], 15.3 - 11.35, 0.32, attack=0.4, release=0.5, bright=1.3), 11.35, rev=0.45)
    t = fire_w
    while t < 15.2:  # nervous tremolo
        place(koto(hz("D5" if int((t - fire_w) / 0.09) % 2 else "Eb5"), 0.07, 0.12 + 0.12 * (t - fire_w) / 4, ring=0.3), t, -0.3, rev=0.3)
        t += 0.09
    for t0, sz in [(houses, 1.2), (temples, 1.25), (palaces, 1.3)]:
        place(taiko(0.6, sz), t0, rev=0.45)
        place(crash(0.18), t0, 0.3, rev=0.4)

    # ---- Kyoto destroyed (15.25 - 19.1): a lament
    slowly = cue(43, "slowly")
    destroyed = cue(51, "destroyed")
    place(swish(), 15.05)
    chord_track([(15.25, 17.0, ["D3", "A3", "D4", "F4"]), (17.0, 19.2, ["Bb2", "F3", "Bb3", "D4"])], vel=0.34, attack=0.6)
    melody(slowly, [("A4", 1.0), ("F4", 0.5), ("E4", 0.5), ("D4", 1.0), ("E4", 0.5), ("F4", 0.5), ("D4", 1.5)], vel=0.36, vib=1.2)
    place(bell(hz("D3"), 0.45, 4.0), destroyed, rev=0.6)

    # ---- how long did it last? (19.1 - 25.85): a quiz
    guess = cue(53, "guess")
    one = cue(59, "one")
    two = cue(61, "two")
    five = cue(62, "five")
    it = cue(63, "it")
    ten = cue(65, "ten")
    years = cue(67, "years")
    place(swish(), 18.9)
    for k in range(int((it - guess) / (BEAT / 2))):  # ticking clock
        place(woodblock(1300 if k % 2 == 0 else 1000, 0.2), guess + k * BEAT / 2, 0.3 if k % 2 else -0.3)
    place(pad(["G3", "D4", "A4"], it - guess, 0.24, attack=0.3, release=0.3), guess, rev=0.45)
    for t0, n in [(one, "G5"), (two, "A5"), (five, "B5")]:
        place(koto(hz(n), 0.3, 0.42, bend=0.5), t0, 0.2, rev=0.3)
    for k in range(3):  # wrong, wrong, wrong
        place(koto(hz("D4"), 0.25, 0.4, slide=-3), it + k * 4 / 30, -0.2, rev=0.25)
        place(woodblock(500, 0.28), it + k * 4 / 30, -0.2)
    place(taiko(0.9, 1.25), ten, rev=0.5)
    place(crash(0.32), ten, 0.2, rev=0.55)
    chord_track([(ten, 25.9, ["G2", "D3", "G3", "B3", "D4", "G4"])], vel=0.44, attack=0.05, bright=1.4)
    for k, n in enumerate(["G5", "B5", "D6", "G6"]):
        place(glock(hz(n), 0.22), ten + 0.05 + k * 0.07, -0.3 + k * 0.2, rev=0.6)
    for k in range(10):  # tally marks
        place(woodblock(1500, 0.14), years + k * 1.5 / 30 + k * 0.02, 0.4)

    # ---- nobody won (25.85 - 29.75)
    both = cue(72, "both")
    nobody = cue(77, "nobody")
    place(swish(), 25.65)
    place(pad(["D3", "A3", "D4"], 29.8 - 25.85, 0.26, attack=0.6, release=0.6, bright=0.8), 25.85, rev=0.55)
    place(bell(hz("A2"), 0.4, 4.0), both, rev=0.6)
    place(bell(hz("D3"), 0.3, 3.0), both + 0.6, rev=0.6)
    place(bass_slide(hz("D3"), hz("D2"), 0.9, 0.4), nobody + 0.2)
    place(koto(hz("A4"), 0.5, 0.32, slide=-5), nobody + 0.3, 0.0, rev=0.3)

    # ---- power to the local lords; the Sengoku period (29.75 - 34.4)
    local = cue(84, "local")
    sengoku = cue(91, "sengoku")
    place(swish(), 29.55)
    groove(29.75, sengoku - 0.1, [(29.75, "Dm"), (31.0, "C")], "march", pad_vel=0.28)
    for k in range(14):  # flags popping up
        place(glock(hz(["D6", "E6", "F6", "A6", "C7"][k % 5]), 0.12), local - 4 / 30 + k * 2.5 / 30 + 0.27, (-0.5 + (k % 5) * 0.25), rev=0.5)
    place(taiko(1.0, 1.35), sengoku, rev=0.6)
    place(crash(0.35), sengoku, 0.2, rev=0.6)
    place(pad(["D2", "A2", "D3", "F3", "A3"], 34.5 - sengoku, 0.46, attack=0.05, release=0.6, bright=1.6), sengoku, rev=0.45)
    place(bell(hz("D3"), 0.35, 4.0), sengoku, rev=0.6)

    # ---- 150 years of civil war (34.4 - 38.4)
    civil = cue(99, "civil")
    again1 = cue(103, "again")
    again2 = cue(105, "again")
    groove(34.4, 38.35, [(34.4, "Dm"), (35.65, "Bb"), (36.9, "A")], "battle", pad_vel=0.32, arp_vel=0.12)
    for k in range(int((38.3 - civil) / (5 / 30))):  # each clash on the map
        if k % 2 == 0:
            place(shime(0.3), civil - 4 / 30 + k * 5 / 30, (-0.4 if k % 4 else 0.4))
    melody(again1, [("D5", 0.3), ("F5", 0.3), ("A5", 0.6)], vel=0.36)
    melody(again2, [("D5", 0.3), ("F5", 0.3), ("A5", 0.6)], vel=0.4)

    # ---- gekokujo (38.4 - 44.4)
    idea = cue(108, "idea")
    spread = cue(109, "spread")
    geko = cue(114, "gekokujo")
    low = cue(118, "low")
    defeat = cue(119, "defeat")
    high = cue(121, "high")
    place(swish(), 38.2)
    sho(["D4", "E4", "A4", "B4"], 38.4, geko - 38.4, 0.26)
    place(glock(hz("A6"), 0.3), idea, 0.0, rev=0.7)
    place(glock(hz("E7"), 0.2), idea + 0.1, 0.1, rev=0.7)
    arpeggio(spread, geko - 0.1, ["A4", "B4", "D5", "E5", "A5", "B5", "D6", "E6"], BEAT / 4, 0.16, -0.3, dur=0.2)
    place(taiko(0.8, 1.3), geko, rev=0.55)
    place(pad(["D3", "A3", "D4", "E4", "A4"], low - geko, 0.38, attack=0.05, release=0.4, bright=1.2), geko, rev=0.5)
    place(bass(hz("D2"), 0.5, 0.45), low)  # low...
    place(glock(hz("D7"), 0.25), high, 0.4, rev=0.5)  # ...high
    place(taiko(0.7, 1.4), defeat + 0.3, rev=0.4)
    place(crash(0.3), high + 0.25, 0.3, rev=0.5)
    place(koto(hz("D6"), 0.6, 0.36, slide=-12), defeat + 0.1, 0.3, rev=0.3)  # the lord topples

    # ---- family name (44.4 - 46.75)
    family = cue(123, "family")
    mattered = cue(127, "mattered")
    place(swish(), 44.2)
    for t0, n, d in [(family - 0.1, "D4", 0.3), (family + 0.25, "D4", 0.3), (family + 0.6, "A4", 0.9)]:
        place(reed(hz(n), d, 0.38), t0, 0.0, rev=0.45)  # pompous fanfare
    place(taiko(0.3, 1.3), family + 0.6, rev=0.4)
    place(swish(0.25), mattered - 0.25, 0.2)
    place(woodblock(600, 0.32), mattered + 0.05, 0.2)
    place(koto(hz("A4"), 0.4, 0.34, slide=-5), mattered + 0.1, 0.2, rev=0.3)

    # ---- push out your master (46.75 - 54.0)
    strong = cue(131, "strong")
    push = cue(135, "push")
    master = cue(138, "master")
    take = cue(140, "take")
    place_w = cue(142, "place")
    place(swish(), 46.55)
    groove(46.75, push, [(46.75, "D"), (48.0, "A")], "march", pad_vel=0.3)
    for k, n in enumerate(["D4", "F#4", "A4", "D5"]):  # flex!
        place(koto(hz(n), 0.25, 0.34), strong + k * 0.1, 0.3, rev=0.3)
    place(taiko(0.9, 1.25), push + 0.1, rev=0.5)
    place(noise_swell(0.5, 0.3, 800, 8000, 0.5), push + 0.1, 0.4, rev=0.3)
    place(crash(0.35), master + 0.2, 0.5, rev=0.5)
    place(koto(hz("A5"), 0.6, 0.36, slide=-12), push + 0.2, 0.5, rev=0.3)
    # the new boss: a happy cadence, then rest
    place(taiko(0.6, 1.2), take, rev=0.5)
    chord_track([(take, place_w + 1.0, ["D3", "A3", "D4", "F#4", "A4"]), (place_w + 1.0, 52.4, ["G2", "D3", "G3", "B3", "D4"]), (52.4, 54.0, ["D3", "A3", "D4", "F#4", "A4"])], vel=0.42, attack=0.2, bright=1.2)
    for k, n in enumerate(["D4", "E4", "F#4", "A4", "B4", "D5", "E5", "F#5", "A5"]):
        place(koto(hz(n), 0.7, 0.26 + k * 0.02), take + 0.05 + k * 0.045, -0.5 + k * 0.12, rev=0.4)
    melody(place_w + 0.2, [("A5", 0.5), ("F#5", 0.5), ("E5", 0.5), ("D5", 2.5)], vel=0.34)
    place(bass(hz("D2"), 54.0 - take, 0.32, pluck=False), take)
    place(glock(hz("D6"), 0.22), 52.4, 0.3, rev=0.7)


LEVELS = [
    (0.0, 3.0, -19.0), (3.0, 5.6, -29.0), (5.6, 11.35, -30.5), (11.35, 15.25, -29.5), (15.25, 19.1, -31.0),
    (19.1, 25.85, -30.0), (25.85, 29.75, -31.5), (29.75, 34.4, -29.5), (34.4, 38.4, -29.0), (38.4, 44.4, -30.0),
    (44.4, 46.75, -31.0), (46.75, 50.6, -30.0), (50.6, 54.0, -23.0),
]


if __name__ == "__main__":
    args = cli(os.path.join("public", "japan", "music_p4.wav"))
    score()
    render(LEVELS, args.narration, args.out)
