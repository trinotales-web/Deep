"""Original score for "Japan – Part 3: ninjas, Mongols & a divine wind" (136 s).

Same instruments as the earlier parts (synth.py). Cue times come from the
Part 3 word timings, so the music lands on the same words as the animation.

  0.0  title            the series opening
  3.0  ninjas           a samurai beat, then a sneaky spy bass
  7.5  by day           pastoral koto
 10.5  by night         tiptoe plucks, spy bass, a hush as the candle dies
 16.0  peace / 1274     a lullaby, an alarm, galloping Mongol drums
 23.4  Kublai           Mongol court reed over a low drone; greedy motif
 30.1  the letter       ticking, then a hard "NO" stamp
 34.0  attack           taiko battle, gunpowder booms
 39.9  typhoon 1        the music drops out under a rising storm
 46.0  envoys           stomps, a creeping walk, one sharp hit, ghostly bells
 52.0  walls            a working march, one thunk per course of stone
 57.3  1281 fleet       gallop and a rising count of ships and soldiers
 66.1  the walls hold   defensive march, bonks, a night raid with a boom
 70.4  guess what?      everything stops for a question
 72.5  typhoon 2        the big storm, then a lament for the lost fleet
 79.4  kamikaze         temple bell and a sacred, heroic swell
 84.1  the reward       festive, then "uh-oh"; a music-box flashback
 89.8  no land          deflating slide
 94.7  crack            grumbling minor, the crack, a cluster
 99.5  the lords        swagger, then a sing-song "la la la"
103.5  Yoshimasa        refined tea music, bells for the Silver Pavilion
111.5  hopeless         falling papers, sliding bass
114.3  brother & baby   a hopeful tune, a lullaby, an uh-oh
122.9  one seat         a tug-of-war of two notes, drums building
128.0  Onin War         war drums; a boing for the onion; a low, uneasy close

Run from the repo root:
    python3 remotion/japan/music/compose_part3.py --narration narration_p3.wav
"""
import json
import os
import re

from synth import *  # noqa: F401,F403  (instruments, helpers, constants)
from synth import cli, configure, render

DUR = 136.0
configure(DUR)

_ts = open(os.path.join(os.path.dirname(__file__), "..", "words-part3.ts")).read()
WORDS = [(float(a), float(b)) for a, b in re.findall(r'\["(?:[^"\\]|\\.)*", ([\d.]+), ([\d.]+)\]', _ts)]
SPOKEN = json.loads(re.search(r"SPOKEN_P3 = (\[.*?\]);", _ts, re.S).group(1))
assert len(WORDS) == len(SPOKEN), (len(WORDS), len(SPOKEN))


def cue(i, word):
    """Video time of narration word i (checked against the spoken word)."""
    assert SPOKEN[i] == word, (i, SPOKEN[i], word)
    return NARRATION_OFFSET + WORDS[i][0]


def spy_bass(start, end, vel=0.34):
    """Sneaky two-note bass (D / Eb) with woodblock ticks."""
    t, k = start, 0
    while t < end - 0.05:
        n = ["D2", "D2", "Eb2", "D2"][k % 4]
        place(bass(hz(n), BEAT * 0.35, vel), t)
        if k % 2 == 1:
            place(woodblock(1300, 0.14), t, 0.4)
        t += BEAT / 2
        k += 1


def gallop(start, end, vel=0.35):
    """Horse-gallop drumming (da-da-DUM) for the Mongols."""
    t = start
    while t < end - 0.05:
        for off, v in [(0, 0.55), (BEAT / 6, 0.6), (BEAT / 3, 1.0)]:
            place(taiko(vel * v, 1.15), t + off, (-0.2 if off else 0.2), rev=0.3)
        t += BEAT


def tiptoe(start, end, notes=("D4", None, "A3", None, "D4", None, "Eb4", None), vel=0.32):
    t, i = start, 0
    while t < end - 0.05:
        n = notes[i % len(notes)]
        if n:
            place(koto(hz(n), 0.08, vel, ring=0.35), t, -0.1, rev=0.25)
        t += BEAT / 2
        i += 1


def score():
    # ---- title (0 - 3.0): the series opening
    place(taiko(0.45, 1.1), 0.05, rev=0.6)
    place(pad(["D3", "A3", "D4"], 3.2, 0.45, attack=1.6, release=1.2), 0.0, rev=0.5)
    for i, n in enumerate(["D4", "G4", "A4", "Bb4", "D5", "Eb5", "G5"]):
        place(koto(hz(n), 0.9, 0.36 + i * 0.04), 0.22 + i * 0.11, -0.4 + i * 0.12, rev=0.4)
    melody(1.05, [("A4", 0.8), ("Bb4", 0.4), ("A4", 0.4), ("Eb5", 0.6), ("D5", 2.6)], vel=0.42)
    place(noise_swell(0.8, 0.12, 800, 7000), 2.3, rev=0.4)

    # ---- ninjas (3.0 - 7.5)
    samurai = cue(3, "samurai")
    army = cue(6, "army")
    ninjas = cue(10, "ninjas")
    secret = cue(15, "secret")
    for t0 in (samurai, samurai + BEAT, army):
        place(taiko(0.5, 1.2), t0, rev=0.4)
    place(pad(["D3", "A3", "D4", "F#4"], ninjas - 3.0, 0.3, attack=0.2, release=0.3, bright=1.3), 3.0, rev=0.4)
    place(koto(hz("A5"), 0.5, 0.4, slide=-12), ninjas - 0.3, 0.3, rev=0.3)  # sliding down the rope
    spy_bass(ninjas, 7.5)
    tiptoe(ninjas + BEAT, 7.5, ("A4", None, "D5", None, "Eb5", "D5", None, None), 0.28)
    place(flute(hz("D5"), 0.5, 0.3, vib=0.5), secret, 0.2, rev=0.4)
    place(flute(hz("Eb5"), 0.9, 0.3, vib=1.0), secret + 0.5, 0.2, rev=0.45)

    # ---- by day (7.5 - 10.45): pastoral
    farmers = cue(23, "farmers")
    monks = cue(25, "monks")
    place(swish(), 7.3)
    groove(7.5, 10.4, [(7.5, "G"), (8.75, "C"), (10.0, "G")], "light", pad_vel=0.28)
    melody(7.8, [("D5", 0.5), ("E5", 0.5), ("G5", 1), ("E5", 0.5), ("D5", 0.5), ("B4", 1.5)], vel=0.32)
    place(glock(hz("G6"), 0.18), farmers + 0.3, -0.4, rev=0.6)
    place(glock(hz("D6"), 0.18), monks + 0.3, 0.4, rev=0.6)

    # ---- by night (10.45 - 15.95)
    night = cue(28, "night")
    sneaked = cue(30, "sneaked")
    castles = cue(33, "castles")
    spy = cue(35, "spy")
    kill = cue(38, "kill")
    quietly = cue(40, "quietly")
    place(swish(), 10.25)
    place(pad(["D3", "A3", "Eb4"], kill - 10.45, 0.26, attack=0.5, release=0.4, bright=0.8), 10.45, rev=0.5)
    place(koto(hz("D4"), 0.4, 0.4, slide=-5), night + 0.25, 0.0, rev=0.3)  # farmer -> ninja
    spy_bass(sneaked - 0.3, kill - 0.2, 0.32)
    for k in range(6):  # hop, hop, hop
        place(koto(hz(["A4", "D5", "Eb5", "A5", "D6", "Eb6"][k]), 0.1, 0.3, ring=0.35), sneaked + k * (castles - sneaked) / 6, 0.2, rev=0.3)
    place(glock(hz("Eb6"), 0.22), spy, 0.4, rev=0.6)
    place(bass(hz("D2"), 2.0, 0.28, pluck=False), kill - 0.2)
    place(flute(hz("A4"), 0.8, 0.26, vib=0.3, breath=1.6), kill, 0.0, rev=0.5)
    place(noise_swell(0.35, 0.18, 1500, 6000, 0.6), quietly + 0.1, 0.0, rev=0.3)  # the candle goes out

    # ---- peace, 1274, the Mongols are coming (15.95 - 23.4)
    year = cue(53, "twelve")
    changed = cue(57, "changed")
    mongols = cue(59, "mongols")
    place(swish(), 15.75)
    chord_track([(15.95, 17.95, ["G2", "D3", "G3", "B3", "D4"]), (17.95, year - 0.1, ["C3", "G3", "C4", "E4"])], vel=0.32, attack=0.8)
    arpeggio(15.95, year - 0.1, ["G4", "D5", "B4", "D5", "C5", "E5", "G4", "E5"], BEAT, 0.18, 0.2)
    melody(16.3, [("B4", 1), ("A4", 0.5), ("G4", 0.5), ("E4", 1), ("D4", 1.5)], vel=0.28)
    place(taiko(0.7, 1.2), year, rev=0.5)
    place(bell(hz("D3"), 0.45, 4.0), year, rev=0.6)
    place(noise_swell(changed - year + 0.3, 0.2, 300, 3000, 1.8), year + 0.1, rev=0.3)
    place(pad(["D3", "Eb3", "A3", "D4"], 23.45 - changed, 0.36, attack=0.15, release=0.4, bright=1.4), changed, rev=0.4)
    place(taiko(0.6, 1.2), changed, rev=0.4)
    gallop(mongols - 0.1, 23.4, 0.34)
    place(reed(hz("D4"), 1.0, 0.36), mongols, -0.2, rev=0.45)
    place(reed(hz("A4"), 1.2, 0.36), mongols + 1.0, -0.2, rev=0.45)

    # ---- Kublai Khan (23.4 - 30.05)
    kublai = cue(62, "kublai")
    genghis = cue(67, "genghis")
    taken = cue(71, "taken")
    wanted = cue(76, "wanted")
    japan_too = cue(77, "japan")
    place(taiko(0.6, 1.3), kublai, rev=0.5)
    place(pad(["D2", "A2", "D3", "A3"], taken - kublai, 0.34, attack=0.4, release=0.5, bright=1.2), kublai, rev=0.5)
    for t0, n, d in [(kublai + 0.2, "D4", 0.8), (kublai + 1.1, "F4", 0.5), (kublai + 1.7, "G4", 0.6), (genghis - 0.4, "A4", 0.9)]:
        place(reed(hz(n), d, 0.38), t0, -0.1, rev=0.5)
    place(bell(hz("A2"), 0.4, 4.0), genghis, rev=0.6)
    gallop(taken - 0.1, wanted - 0.1, 0.28)
    place(pad(["D3", "A3", "D4", "F4"], wanted - taken, 0.32, attack=0.3, release=0.4, bright=1.3), taken, rev=0.45)
    for k, n in enumerate(["A5", "G#5", "G5", "F#5"]):  # greedy, creeping motif
        place(koto(hz(n), 0.3, 0.32, bend=0.3), wanted + k * 0.22, 0.3, rev=0.35)
    place(glock(hz("D6"), 0.25), japan_too, 0.3, rev=0.6)
    place(glock(hz("A6"), 0.2), japan_too + 0.12, 0.3, rev=0.6)
    place(pad(["D3", "A3", "F4"], 30.1 - japan_too, 0.28, attack=0.3, release=0.4), japan_too, rev=0.5)

    # ---- the letter (30.05 - 33.95)
    told = cue(80, "told")
    refused = cue(90, "refused")
    place(swish(), told - 0.3)
    for k in range(int((refused - told) / (BEAT / 2))):
        place(woodblock(1200 if k % 2 == 0 else 950, 0.18), told + k * BEAT / 2, 0.3 if k % 2 else -0.3)
    sho(["D4", "E4", "A4", "B4"], 30.05, refused - 30.05, 0.26)
    place(taiko(0.9, 1.25), refused, rev=0.5)
    place(crash(0.3), refused, 0.2, rev=0.5)
    place(pad(["D2", "A2", "D3", "Eb3"], 0.8, 0.5, attack=0.02, release=0.5, bright=1.8), refused, rev=0.4)

    # ---- the first attack (33.95 - 39.9)
    attacked = cue(94, "attacked")
    gunpowder = cue(100, "gunpowder")
    never = cue(104, "never")
    place(swish(), 33.75)
    groove(attacked - 0.2, 39.85, [(attacked - 0.2, "Dm"), (gunpowder, "Bb"), (gunpowder + 1.25, "Gm"), (never, "A")], "battle", pad_vel=0.32, arp_vel=0.12)
    place(boom(0.75), gunpowder, -0.1, rev=0.4)
    place(boom(0.7), gunpowder + 14 / 30, 0.2, rev=0.4)
    for k, n in enumerate(["A5", "Bb5"]):
        place(glock(hz(n), 0.22), never + 0.1 + k * 0.18, 0.4, rev=0.6)

    # ---- typhoon 1 (39.9 - 45.95): nature takes over
    nature = cue(108, "nature")
    typhoon = cue(113, "typhoon")
    destroyed = cue(114, "destroyed")
    turn = cue(124, "turn")
    place(storm(45.9 - nature, 0.42), nature, 0.0, rev=0.2)
    place(rumble(45.9 - typhoon, 0.3), typhoon, rev=0.1)
    sho(["G3", "D4", "A4", "D5"], 39.9, typhoon - 39.9, 0.3)
    place(taiko(0.9, 1.3), typhoon, rev=0.6)
    place(crash(0.35), typhoon, 0.0, rev=0.6)
    place(pad(["G2", "D3", "G3", "B3", "D4", "G4"], turn - typhoon, 0.44, attack=0.3, release=0.6, bright=1.5), typhoon, rev=0.5)
    t = typhoon + 0.5
    while t < turn:
        place(taiko(0.3, 1.1), t, rev=0.35)
        t += BEAT
    place(wave_crash(0.5), destroyed + 0.3, -0.2, rev=0.4)
    place(wave_crash(0.45), destroyed + 0.9, 0.3, rev=0.4)
    melody(turn - 0.1, [("D5", 0.5), ("B4", 0.5), ("G4", 1.5)], vel=0.34)

    # ---- envoys (45.95 - 51.95)
    give = cue(130, "give")
    sent = cue(133, "sent")
    shogun = cue(141, "shogun")
    killed = cue(144, "killed")
    place(swish(), 45.75)
    for k in range(int((sent - give + 0.2) / (BEAT / 2))):  # Kublai stomps
        place(taiko(0.32, 1.35), give - 0.2 + k * BEAT / 2, rev=0.3)
    place(pad(["D3", "A3", "D4"], killed - 45.95, 0.26, attack=0.4, release=0.3, bright=0.9), 45.95, rev=0.5)
    tiptoe(sent, shogun - 0.1, ("D4", "A3", "D4", "Eb4"), 0.28)
    place(taiko(0.9, 1.25), killed, rev=0.5)
    place(crash(0.3), killed, 0.2, rev=0.5)
    place(pad(["D2", "Ab2", "D3", "Eb3"], 0.7, 0.5, attack=0.02, release=0.5, bright=1.8), killed, rev=0.4)
    for k, n in enumerate(["A6", "E6", "C7", "G6"]):  # little souls drifting up
        place(glock(hz(n), 0.12), killed + 0.6 + k * 0.25, -0.3 + k * 0.2, rev=0.8)

    # ---- the walls (51.95 - 57.25)
    knew = cue(146, "knew")
    built = cue(154, "built")
    coast = cue(160, "coast")
    place(swish(), 51.75)
    sho(["D4", "G4", "A4", "D5"], 51.95, built - 51.95, 0.26)
    place(flute(hz("A4"), 1.2, 0.28, vib=0.8), knew, 0.0, rev=0.45)
    groove(built - 0.1, 57.2, [(built - 0.1, "Dm"), (built + 1.15, "Bb"), (coast, "C")], "march", pad_vel=0.3)
    for k in range(4):  # a thunk per course of stone
        place(taiko(0.4, 1.5), built + 0.3 + k * (coast - built + 0.6) / 4, rev=0.25)

    # ---- 1281: the fleet returns (57.25 - 66.05)
    year2 = cue(163, "twelve")
    mongols2 = cue(167, "mongols")
    four = cue(172, "four")
    ships = cue(176, "ships")
    one = cue(179, "one")
    soldiers = cue(183, "soldiers")
    place(taiko(0.75, 1.25), year2, rev=0.5)
    place(bell(hz("D3"), 0.4, 4.0), year2, rev=0.6)
    gallop(mongols2 - 0.2, 66.0, 0.3)
    place(pad(["D2", "A2", "D3", "F3", "A3"], 66.0 - mongols2, 0.36, attack=0.6, release=0.6, bright=1.4), mongols2, rev=0.45)
    count = ["D5", "E5", "F5", "G5", "A5", "C6", "D6", "E6", "F6", "A6"]
    for k, n in enumerate(count):  # ships counting up
        place(glock(hz(n), 0.14), four + k * (ships + 0.3 - four) / len(count), 0.4, rev=0.5)
    place(taiko(0.6, 1.2), ships + 0.05, rev=0.45)
    t = one
    while t < soldiers + 0.3:  # soldiers: a rising roll
        place(shime(0.15 + 0.3 * (t - one) / (soldiers + 0.3 - one)), t, 0.3)
        t += BEAT / 4
    place(taiko(0.9, 1.3), soldiers + 0.35, rev=0.5)
    place(crash(0.3), soldiers + 0.35, 0.2, rev=0.5)

    # ---- the walls hold; night raid (66.05 - 70.4)
    held = cue(186, "held")
    weeks = cue(190, "weeks")
    attacked2 = cue(194, "attacked")
    night2 = cue(198, "night")
    groove(66.05, attacked2 - 0.2, [(66.05, "Dm"), (67.3, "C")], "march", pad_vel=0.3)
    for k in range(5):
        place(woodblock(700 + 60 * k, 0.26), held + 0.1 + k * 0.4, -0.3)
    place(glock(hz("D6"), 0.16), weeks, 0.4, rev=0.5)
    spy_bass(attacked2 - 0.2, 70.4, 0.3)
    place(boom(0.55), night2, -0.3, rev=0.45)

    # ---- "guess what happened?" (70.4 - 72.45)
    guess = cue(201, "guess")
    happened = cue(203, "happened")
    place(glock(hz("A5"), 0.22), guess, 0.3, rev=0.6)
    place(glock(hz("Bb5"), 0.22), happened, 0.3, rev=0.6)
    place(koto(hz("D4"), 0.1, 0.3, ring=0.4), happened + 0.4, -0.2, rev=0.3)
    place(koto(hz("Eb4"), 0.1, 0.3, ring=0.4), happened + 0.7, -0.2, rev=0.3)

    # ---- typhoon 2 (72.45 - 79.35)
    another = cue(204, "another")
    worse = cue(211, "worse")
    first = cue(214, "first")
    half = cue(217, "half")
    lost = cue(223, "lost")
    place(storm(76.3 - another + 0.4, 0.55), another, 0.0, rev=0.2)
    place(rumble(76.6 - another, 0.38), another, rev=0.1)
    place(taiko(1.0, 1.35), another + 0.45, rev=0.6)
    place(crash(0.4), another + 0.45, 0.0, rev=0.6)
    place(pad(["D2", "A2", "D3", "Eb3", "A3"], 76.4 - another, 0.48, attack=0.2, release=0.6, bright=1.7), another + 0.4, rev=0.45)
    t = another + 0.5
    while t < 76.3:
        place(taiko(0.38, 1.0), t, rev=0.3)
        place(taiko(0.26, 1.0), t + BEAT / 4, rev=0.3)
        t += BEAT / 2
    place(noise_swell(first - worse + 0.4, 0.4, 200, 5000, 1.5), worse, rev=0.3)
    place(taiko(0.95, 1.3), first + 0.2, rev=0.6)
    # the lament
    chord_track([(76.4, 79.4, ["D3", "A3", "D4", "F4"])], vel=0.34, attack=0.5)
    melody(half - 0.2, [("A4", 1), ("F4", 0.5), ("E4", 0.5), ("D4", 2)], vel=0.34, vib=1.2)
    for k in range(5):
        place(glock(hz(["A4", "F4", "D4", "A3", "F3"][k]), 0.12), lost + k * 0.18, 0.3, rev=0.5)

    # ---- kamikaze (79.35 - 84.05)
    kamikaze = cue(231, "kamikaze")
    wind = cue(235, "wind")
    place(swish(), 79.15)
    sho(["G3", "D4", "G4", "A4", "D5"], 79.35, kamikaze - 79.35 + 0.1, 0.32)
    place(bell(hz("G3"), 0.55, 5.0), kamikaze, rev=0.6)
    place(taiko(0.9, 1.25), kamikaze, rev=0.6)
    place(crash(0.3), kamikaze, 0.2, rev=0.6)
    chord_track([(kamikaze, 84.1, ["G2", "D3", "G3", "B3", "D4", "G4"])], vel=0.46, attack=0.2, bright=1.3)
    melody(kamikaze + 0.1, [("D5", 0.5), ("G5", 0.5), ("A5", 1.0), ("B5", 0.5), ("A5", 0.5), ("G5", 2.0)], vel=0.38)
    place(storm(84.0 - wind, 0.18), wind, 0.0, rev=0.3)

    # ---- the reward problem (84.05 - 89.8)
    win = cue(241, "win")
    problem = cue(245, "problem")
    rewarded = cue(249, "rewarded")
    place(swish(), 83.85)
    groove(84.05, problem - 0.1, [(84.05, "G")], "light", pad_vel=0.3)
    place(glock(hz("G6"), 0.2), win, 0.3, rev=0.6)
    place(bass_slide(hz("G2"), hz("D2"), 0.6, 0.4), problem)
    place(koto(hz("B4"), 0.4, 0.36, slide=-4), problem + 0.1, 0.0, rev=0.3)
    # a music-box memory of the usual deal
    for k, n in enumerate(["G5", "B5", "D6", "B5", "C6", "A5", "G5", "D5"]):
        place(glock(hz(n), 0.16), rewarded - 0.3 + k * 0.32, 0.2, rev=0.6)
    place(pad(["G3", "D4", "B4"], 89.8 - rewarded, 0.22, attack=0.5, release=0.5), rewarded - 0.3, rev=0.55)

    # ---- no land to give (89.8 - 94.65)
    defend = cue(262, "defend")
    no = cue(267, "no")
    give2 = cue(270, "give")
    place(swish(), 89.6)
    groove(89.8, no - 0.1, [(89.8, "D"), (91.05, "G")], "march", pad_vel=0.28)
    place(glock(hz("D6"), 0.18), defend, -0.4, rev=0.6)
    place(bass_slide(hz("D3"), hz("D2"), 0.9, 0.42), no)
    place(koto(hz("A4"), 0.5, 0.36, slide=-7), give2, 0.0, rev=0.3)
    place(pad(["D3", "F3", "A3"], 94.7 - no, 0.24, attack=0.3, release=0.4), no, rev=0.5)

    # ---- crack (94.65 - 99.45)
    felt = cue(273, "felt")
    crack_t = cue(285, "crack")
    place(swish(), 94.45)
    chord_track([(94.65, crack_t, ["D3", "A3", "D4", "F4"])], vel=0.3, attack=0.4)
    t = felt
    while t < crack_t - 0.1:  # grumbling
        place(bass(hz("D2"), BEAT * 0.4, 0.3), t)
        place(bass(hz("Eb2"), BEAT * 0.4, 0.26), t + BEAT / 2)
        t += BEAT
    place(crack(0.8), crack_t, 0.0, rev=0.4)
    place(taiko(0.8, 1.3), crack_t, rev=0.5)
    place(pad(["D3", "Eb3", "Ab3", "A3"], 99.45 - crack_t, 0.36, attack=0.05, release=0.5, bright=1.4), crack_t, rev=0.45)

    # ---- the lords stop listening (99.45 - 103.5)
    stronger = cue(289, "stronger")
    stopped = cue(292, "stopped")
    place(swish(), 99.25)
    groove(99.45, stopped - 0.1, [(99.45, "D"), (stronger - 0.1, "A")], "march", pad_vel=0.3)
    for k, n in enumerate(["D4", "F#4", "A4", "D5"]):
        place(koto(hz(n), 0.2, 0.34), stronger + k * 0.12, 0.3, rev=0.3)
    groove(stopped - 0.1, 103.45, [(stopped - 0.1, "G")], "light", pad_vel=0.26)
    melody(stopped + 0.1, [("D5", 0.5), ("E5", 0.5), ("D5", 0.5), ("B4", 0.5), ("D5", 0.5), ("E5", 0.5), ("G5", 1.0)], vel=0.34, pan=0.3)

    # ---- Yoshimasa (103.5 - 111.45): refined tea music
    yoshimasa = cue(302, "yoshimasa")
    tea = cue(307, "tea")
    silver = cue(315, "silver")
    place(swish(), 103.3)
    sho(["G3", "D4", "A4", "B4", "D5"], 103.5, 8.0, 0.24)
    place(bass(hz("G2"), 7.9, 0.24, pluck=False), 103.5)
    for t0, n, d in [
        (yoshimasa, "B4", 0.6), (yoshimasa + 0.7, "D5", 0.4), (yoshimasa + 1.2, "E5", 0.8),
        (tea - 0.2, "G5", 0.8), (tea + 0.7, "E5", 0.5), (tea + 1.3, "D5", 1.0), (silver - 0.6, "B4", 0.5),
    ]:
        place(koto(hz(n), d, 0.34, bend=0.3), t0, 0.1, rev=0.45)
    melody(tea - 0.1, [("D5", 1.5), ("E5", 0.5), ("D5", 1.0), ("B4", 1.5)], vel=0.28, pan=-0.2)
    for k, n in enumerate(["G5", "B5", "D6", "E6", "G6", "B6"]):
        place(glock(hz(n), 0.18), silver + k * 0.1, -0.4 + k * 0.16, rev=0.7)
    place(suzu(0.22), silver + 0.6, 0.3, rev=0.6)

    # ---- hopeless (111.45 - 114.3)
    politics = cue(324, "politics")
    hopeless = cue(327, "hopeless")
    place(swish(), 111.25)
    place(pad(["G3", "D4", "B4"], 2.9, 0.22, attack=0.3, release=0.4), 111.45, rev=0.5)
    for k in range(9):  # papers landing
        place(woodblock(500 + (k % 3) * 80, 0.22), politics - 0.2 + k * 0.1, 0.3)
    place(bass_slide(hz("G2"), hz("C2"), 0.9, 0.4), hopeless)
    place(koto(hz("D4"), 0.6, 0.32, slide=-6), hopeless + 0.15, 0.0, rev=0.3)

    # ---- brother, baby (114.3 - 122.9)
    son = cue(331, "son")
    promised = cue(334, "promised")
    brother = cue(342, "brother")
    wife = cue(347, "wife")
    baby = cue(352, "baby")
    boy = cue(353, "boy")
    place(swish(), 114.1)
    place(koto(hz("A4"), 0.3, 0.32), son, 0.0, rev=0.35)
    place(koto(hz("Bb4"), 0.6, 0.32), son + 0.35, 0.0, rev=0.35)
    groove(promised - 0.2, 118.45, [(promised - 0.2, "G"), (brother - 0.3, "D")], "light", pad_vel=0.26)
    melody(promised, [("G4", 0.5), ("B4", 0.5), ("D5", 1.0), ("E5", 0.5), ("D5", 1.5)], vel=0.3)
    place(swish(), 118.3)
    chord_track([(118.5, boy + 1.0, ["G3", "D4", "G4", "B4"])], vel=0.26, attack=0.5)
    for k, n in enumerate(["G5", "D6", "B5", "D6", "G6"]):  # lullaby
        place(glock(hz(n), 0.17), wife + k * 0.3, 0.2, rev=0.6)
    place(glock(hz("G6"), 0.2), baby, 0.3, rev=0.6)
    place(glock(hz("B6"), 0.2), baby + 0.12, 0.3, rev=0.6)
    place(woodblock(650, 0.3), boy + 0.4, -0.3)
    place(koto(hz("Eb4"), 0.5, 0.38, slide=-3), boy + 0.45, -0.3, rev=0.3)

    # ---- one seat (122.9 - 128.0)
    seat = cue(360, "seat")
    son2 = cue(367, "son")
    place(swish(), 122.7)
    place(pad(["D3", "A3", "D4"], 128.0 - 122.9, 0.3, attack=0.3, release=0.3, bright=1.2), 122.9, rev=0.45)
    t, k = 122.9, 0
    while t < 127.95:  # tug of war
        place(bass(hz("D2" if k % 2 == 0 else "Eb2"), BEAT * 0.4, 0.36), t)
        place(koto(hz("D4" if k % 2 == 0 else "Eb4"), 0.1, 0.24, ring=0.4), t, (-0.5 if k % 2 == 0 else 0.5), rev=0.25)
        t += BEAT / 2 if t < seat else BEAT / 3
        k += 1
    t = seat
    while t < 127.9:
        place(taiko(0.25 + 0.25 * (t - seat) / (127.9 - seat), 1.2), t, rev=0.3)
        t += BEAT / 2
    place(taiko(0.6, 1.2), son2 + 0.2, rev=0.45)

    # ---- the Onin War (128.0 - 136.0)
    onin = cue(371, "onin")
    onion = cue(376, "onion")
    place(taiko(1.0, 1.3), onin, rev=0.6)
    place(crash(0.35), onin, 0.2, rev=0.6)
    place(pad(["D2", "A2", "D3", "F3", "A3"], onion - onin - 0.2, 0.42, attack=0.05, release=0.5, bright=1.6), onin, rev=0.45)
    t = onin + BEAT
    while t < onion - 0.6:
        place(taiko(0.4, 1.0), t, rev=0.3)
        place(taiko(0.28, 1.0), t + BEAT / 3, rev=0.3)
        t += BEAT
    place(boing(330, 0.6), onion + 0.05, 0.4, rev=0.3)  # not onion!
    place(koto(hz("G4"), 0.1, 0.3, ring=0.4), onion + 0.45, 0.4, rev=0.3)
    place(koto(hz("D5"), 0.1, 0.3, ring=0.4), onion + 0.6, 0.4, rev=0.3)
    # a low, uneasy close as Kyoto starts to burn
    end0 = onion + 1.0
    place(pad(["D2", "A2", "D3", "A3"], 136.0 - end0, 0.34, attack=0.8, release=1.2, bright=0.9), end0, rev=0.55)
    place(bass(hz("D2"), 136.0 - end0, 0.3, pluck=False), end0)
    melody(end0 + 0.3, [("A4", 1.0), ("Bb4", 0.5), ("A4", 1.0), ("D4", 3.0)], vel=0.3, vib=1.2)
    place(taiko(0.5, 1.4), end0 + 2.2, rev=0.6)
    place(bell(hz("D3"), 0.32, 4.0), end0 + 2.2, rev=0.6)


# Mix automation targets (RMS dBFS): ~11-13 dB under the voice, a little hotter
# for the battles and storms, full level on the title and the closing bars.
LEVELS = [
    (0.0, 3.0, -19.0), (3.0, 7.5, -31.0), (7.5, 10.45, -31.5), (10.45, 15.95, -31.0), (15.95, 23.4, -30.5),
    (23.4, 30.05, -30.5), (30.05, 33.95, -31.0), (33.95, 39.9, -28.5), (39.9, 45.95, -28.5), (45.95, 51.95, -30.5),
    (51.95, 57.25, -30.5), (57.25, 66.05, -29.5), (66.05, 70.4, -30.0), (70.4, 72.45, -32.0), (72.45, 79.35, -28.0),
    (79.35, 84.05, -29.0), (84.05, 89.8, -31.0), (89.8, 94.65, -31.0), (94.65, 99.45, -30.5), (99.45, 103.5, -30.5),
    (103.5, 111.45, -31.0), (111.45, 114.3, -31.0), (114.3, 122.9, -31.0), (122.9, 128.0, -30.0),
    (128.0, 133.0, -29.0), (133.0, 136.0, -22.0),
]


if __name__ == "__main__":
    args = cli(os.path.join("public", "japan", "music_p3.wav"))
    score()
    render(LEVELS, args.narration, args.out)
