"""Original score for "Japan – Part 5: guns change everything" (31.5 s).

Same instruments as the earlier parts (synth.py); cue times come from the
Part 5 word timings.

  0.0  title           the series opening, in a brighter D major
  3.0  Portugal        a lilting Renaissance-style dance on a shawm-like reed
                       over lute plucks, a ship's bell, a "dun-dun" for the guns
  8.15 blacksmiths     an anvil on every beat (in time with the hammer on
                       screen), a sword ring for "same skill"
 12.95 more guns       a curious tiptoe, then a glock note per row of the
                       growing pile, three dull plunks for Europe
 16.6  never the same  a drum roll, a volley of shots and a heavy minor hit
 18.55 the duel        a noble flute for a lifetime of practice, then quick
                       comic plucks for the farmer, a shot, a fall
 24.85 unite Japan     a heartbeat build into a heroic theme and a resolved
                       final chord

Run from the repo root:
    python3 remotion/japan/music/compose_part5.py --narration narration_p5.wav
"""
import json
import os
import re

from synth import *  # noqa: F401,F403  (instruments, helpers, constants)
from synth import cli, configure, render

DUR = 31.5
configure(DUR)

_ts = open(os.path.join(os.path.dirname(__file__), "..", "words-part5.ts")).read()
WORDS = [(float(a), float(b)) for a, b in re.findall(r'\["(?:[^"\\]|\\.)*", ([\d.]+), ([\d.]+)\]', _ts)]
SPOKEN = json.loads(re.search(r"SPOKEN_P5 = (\[.*?\]);", _ts, re.S).group(1))
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
    place(pad(["D3", "A3", "D4", "F#4"], 3.2, 0.45, attack=1.4, release=1.2), 0.0, rev=0.5)
    for i, n in enumerate(["D4", "E4", "F#4", "A4", "B4", "D5", "E5"]):
        place(koto(hz(n), 0.9, 0.36 + i * 0.04), 0.22 + i * 0.11, -0.4 + i * 0.12, rev=0.4)
    melody(1.05, [("A4", 0.8), ("B4", 0.4), ("A4", 0.4), ("F#4", 0.6), ("D4", 2.6)], vel=0.42)
    place(noise_swell(0.8, 0.14, 300, 5000), 2.3, rev=0.4)

    # ---- traders from Portugal (3.0 - 8.15)
    portugal = cue(6, "portugal")
    landed = cue(7, "landed")
    guns = cue(13, "guns")
    place(wave_crash(0.22), 3.0, -0.4, rev=0.4)
    t, chords = 3.0, [("D", ["D4", "A4", "F#4", "A4"]), ("G", ["D4", "B4", "G4", "B4"]), ("A", ["C#4", "A4", "E4", "A4"]), ("D", ["D4", "A4", "F#4", "A4"])]
    for k, (name, lute) in enumerate(chords):
        t1 = min(3.0 + (k + 1) * 2 * BEAT, guns - 0.05)
        if t >= t1:
            break
        chord, _, root, fifth = CH[name]
        place(pad(chord, t1 - t, 0.24, attack=0.3, release=0.5, width=0.8), t, rev=0.45)
        place(bass(hz(root), BEAT * 0.9, 0.32), t)
        place(bass(hz(fifth), BEAT * 0.9, 0.24), t + BEAT)
        # lute-like plucks in a long-short galliard rhythm
        for j, (off, n) in enumerate(zip([0, 0.75, 1.0, 1.5], lute)):
            if t + off * BEAT < t1 - 0.05:
                place(koto(hz(n), 0.3, 0.24 if j else 0.3, ring=0.6), t + off * BEAT, 0.3, rev=0.35)
        place(shaker(0.1), t + BEAT / 2, -0.4)
        place(shaker(0.1), t + BEAT * 1.5, -0.4)
        t = t1
    # a shawm-like dance tune
    tune = [("A4", 0.5), ("D5", 0.75), ("E5", 0.25), ("F#5", 0.5), ("E5", 0.5), ("D5", 0.5), ("C#5", 0.5),
            ("B4", 0.5), ("C#5", 0.5), ("D5", 0.75), ("E5", 0.25), ("A4", 1.0)]
    tm = portugal - 0.4
    for n, b in tune:
        if tm + b * BEAT > guns - 0.1:
            break
        place(reed(hz(n), b * BEAT * 0.92, 0.34), tm, -0.15, rev=0.45)
        tm += b * BEAT
    place(bell(hz("A5"), 0.22, 2.5), landed + 0.15, 0.5, rev=0.6)  # ship's bell: ding-ding
    place(bell(hz("A5"), 0.18, 2.5), landed + 0.45, 0.5, rev=0.6)
    # ...and they brought guns: dun-dun!
    place(taiko(0.75, 1.3), guns, rev=0.45)
    place(reed(hz("D3") * 2, 0.35, 0.42), guns, 0.0, rev=0.4)
    place(taiko(0.85, 1.35), guns + 0.42, rev=0.5)
    place(reed(hz("Eb3") * 2, 0.6, 0.45), guns + 0.42, 0.0, rev=0.45)
    place(pad(["D3", "A3", "Eb4"], 8.2 - guns, 0.26, attack=0.05, release=0.4, bright=1.3), guns, rev=0.45)
    place(woodblock(1200, 0.2), frame(guns) + 4 / 30, 0.4)  # "?"
    place(woodblock(1500, 0.2), frame(guns) + 8 / 30, 0.5)  # "!!"

    # ---- blacksmiths copy the guns (8.15 - 12.95)
    smiths = cue(15, "blacksmiths")
    copied = cue(16, "copied")
    same = cue(20, "same")
    swords = cue(27, "swords")
    place(swish(), 7.95)
    groove(8.15, 12.95, [(8.15, "Din"), (9.4, "Gm"), (10.65, "Din"), (11.9, "A")], "light", pad_vel=0.26, arp_vel=0.16)
    t0 = frame(smiths) + 4 / 30  # the hammer on screen lands once per beat from here
    k = 0
    while t0 + k * BEAT < 12.85:
        place(anvil(0.42 if k % 2 == 0 else 0.32), t0 + k * BEAT, 0.25, rev=0.3)
        k += 1
    melody(copied, [("D5", 0.5), ("E5", 0.5), ("F5", 1.0)], inst="koto", vel=0.32, pan=-0.2)  # copy...
    place(sword(0.5), same - 0.05, 0.3, rev=0.5)  # ...with the same skill
    melody(same + 0.5, [("A5", 1.0), ("G5", 0.5), ("F5", 0.5), ("E5", 1.0)], vel=0.32, vib=1.1)
    place(glock(hz("A6"), 0.24), swords, 0.4, rev=0.7)
    place(glock(hz("E7"), 0.16), swords + 0.08, 0.5, rev=0.7)

    # ---- more guns than any country in Europe (12.95 - 16.6)
    some = cue(28, "some")
    making = cue(33, "making")
    europe = cue(40, "europe")
    place(swish(), 12.75)
    for j, n in enumerate(["A4", "C#5", "E5", "A4"]):  # tiptoe: "some say..."
        place(koto(hz(n), 0.18, 0.26, ring=0.4), some + j * BEAT / 2, 0.3 - j * 0.2, rev=0.35)
    groove(making - 0.15, 16.6, [(making - 0.15, "D"), (making - 0.15 + 2 * BEAT, "A")], "modern", pad_vel=0.24, arp_vel=0.0)
    # one glock note per finished row of Japan's pile (40 guns, 4 per row)
    a, b = frame(making) - 6 / 30, 16.6 - 10 / 30
    for r, n in enumerate(["D5", "E5", "F#5", "G5", "A5", "B5", "C#6", "D6", "E6", "F#6"]):
        place(glock(hz(n), 0.18 + r * 0.012), a + (b - a) * (4 * (r + 1) - 0.5) / 40, -0.4 + r * 0.06, rev=0.5)
    # ...while Europe's only gets three rows
    a = frame(europe) - 8 / 30
    for r in range(3):
        place(koto(hz("A3"), 0.2, 0.34, ring=0.3), a + (b - a) * (4 * (r + 1) - 0.5) / 12, 0.5, rev=0.25)
        place(woodblock(500, 0.18), a + (b - a) * (4 * (r + 1) - 0.5) / 12, 0.5)

    # ---- war would never be the same (16.6 - 18.55)
    never = cue(45, "never")
    place(swish(), 16.4)
    place(pad(["D2", "A2", "D3", "F3"], never - 16.6 + 0.1, 0.3, attack=0.2, release=0.2, bright=1.2), 16.6, rev=0.4)
    tr = 16.62
    while tr < never - 0.12:  # drum roll
        place(shime(0.12 + 0.2 * (tr - 16.6) / (never - 16.6)), tr, 0.3 if int(tr * 20) % 2 else -0.3, rev=0.2)
        tr += 0.06
    for i in range(3):  # the volley, as each gun on screen fires
        place(gunshot(0.5 - i * 0.06), frame(never) + (-6 + i * 3) / 30, 0.2 + i * 0.15, rev=0.45)
    place(taiko(0.8, 1.4), never + 0.1, rev=0.6)
    place(crash(0.2), never + 0.1, -0.2, rev=0.6)
    place(pad(["D2", "A2", "D3", "F3", "A3", "Eb4"], 18.7 - never, 0.32, attack=0.08, release=0.6, bright=1.1), never + 0.1, rev=0.5)
    place(reed(hz("D4"), 0.9, 0.26), never + 0.1, -0.2, rev=0.5)
    place(bell(hz("D3"), 0.32, 3.5), never + 0.15, rev=0.6)

    # ---- a whole life with a sword (18.55 - 21.3)
    trained = cue(51, "trained")
    now = cue(60, "now")
    place(swish(), 18.35)
    chord_track([(18.55, 20.0, ["D3", "A3", "D4", "F4"]), (20.0, now, ["Bb2", "F3", "Bb3", "D4"])], vel=0.3, attack=0.5, release=0.4)
    melody(trained - 0.2, [("A4", 1.0), ("D5", 0.5), ("E5", 0.5), ("F5", 1.0), ("E5", 0.5), ("C5", 0.5)], vel=0.36, vib=1.2)
    for k in range(int((now - trained) / (BEAT / 2))):  # the years ticking by
        place(woodblock(1300 if k % 2 == 0 else 1050, 0.1), trained + k * BEAT / 2, 0.35)
    place(bass(hz("D2"), now - 18.55, 0.3, pluck=False), 18.55)

    # ---- a farmer with a few days of training (21.3 - 24.85)
    farmer = cue(62, "farmer")
    days = cue(66, "days")
    shoot = cue(70, "shoot")
    place(woodblock(800, 0.3), now, 0.0)  # record scratch: now...
    place(koto(hz("D5"), 0.3, 0.34, slide=-5), now + 0.02, 0.0, rev=0.25)
    tp = farmer - 0.1
    for k, n in enumerate(["D5", "F#5", "A5", "F#5", "G5", "B5", "A5", "F#5"]):  # quick comic plucks
        if tp + k * BEAT / 2 > days - 0.05:
            break
        place(koto(hz(n), 0.14, 0.28, ring=0.3), tp + k * BEAT / 2, 0.3 - 0.1 * (k % 3), rev=0.25)
        if k % 2 == 0:
            place(bass(hz("D2" if k % 4 == 0 else "A2"), BEAT * 0.4, 0.3), tp + k * BEAT / 2)
    for k in range(3):  # 3 days: bip bip bip
        place(glock(hz("A6"), 0.2), frame(days) - 2 / 30 + k * 0.13, 0.4, rev=0.45)
    tr = days + 0.4
    while tr < shoot - 0.12:  # tension before the shot
        place(koto(hz("A4" if int((tr - days) / 0.08) % 2 else "Bb4"), 0.07, 0.14, ring=0.3), tr, -0.2, rev=0.3)
        tr += 0.08
    place(gunshot(0.6), frame(shoot), 0.3, rev=0.55)
    fall_end = frame(shoot) + 16 / 30
    place(koto(hz("D5"), 0.4, 0.34, slide=-12), frame(shoot) + 4 / 30, -0.3, rev=0.3)  # he topples...
    place(taiko(0.5, 1.2), fall_end, -0.3, rev=0.4)  # ...thud
    for k, n in enumerate(["E6", "G6", "E6", "G6"]):  # dizzy stars
        place(glock(hz(n), 0.12), fall_end + 0.15 + k * 0.14, -0.4 + 0.25 * (k % 2), rev=0.5)
    place(pad(["D3", "A3", "D4"], 24.9 - shoot - 0.3, 0.22, attack=0.4, release=0.5), shoot + 0.3, rev=0.5)

    # ---- the time had come to unite Japan (24.85 - 31.5)
    weapon = cue(77, "weapon")
    unite = cue(83, "unite")
    flag = frame(unite) + 24 / 30  # the single banner pops up
    place(swish(), 24.65)
    for k in range(int((flag - 24.85) / BEAT)):  # heartbeat build
        tb = 24.85 + k * BEAT
        g = 0.3 + 0.4 * k / max(1, (flag - 24.85) / BEAT)
        place(taiko(g, 1.3), tb, rev=0.4)
        place(taiko(g * 0.6, 1.3), tb + 0.18, rev=0.4)
    chord_track([(24.85, weapon + 0.5, ["D3", "A3", "D4"]), (weapon + 0.5, unite, ["G2", "D3", "G3", "B3"]), (unite, flag, ["A2", "E3", "A3", "C#4", "E4"])], vel=0.32, attack=0.4, release=0.3, bright=1.2)
    arpeggio(weapon, flag - 0.05, ["D4", "A4", "D5", "E5", "F#5", "A5"], BEAT / 4, 0.14, -0.3, dur=0.2)
    place(noise_swell(flag - unite, 0.2, 400, 7000), unite, rev=0.4)
    # the banner: a big, resolved D major
    place(taiko(1.0, 1.35), flag, rev=0.6)
    place(crash(0.32), flag, 0.2, rev=0.6)
    place(bell(hz("D3"), 0.32, 4.0), flag, rev=0.6)
    chord_track([(flag, 31.5, ["D2", "A2", "D3", "F#3", "A3", "D4", "F#4"])], vel=0.46, attack=0.05, release=1.0, bright=1.4)
    place(bass(hz("D2"), 31.5 - flag, 0.36, pluck=False), flag)
    for k, n in enumerate(["D4", "F#4", "A4", "D5", "F#5", "A5", "D6"]):
        place(koto(hz(n), 0.8, 0.28 + k * 0.02), flag + 0.05 + k * 0.06, -0.5 + k * 0.15, rev=0.45)
    melody(flag + 0.25, [("A5", 0.5), ("B5", 0.5), ("A5", 0.5), ("F#5", 0.5), ("D5", 3.0)], vel=0.36, vib=1.1)
    place(glock(hz("D6"), 0.2), 30.0, 0.3, rev=0.7)


LEVELS = [
    (0.0, 3.0, -19.0), (3.0, 8.15, -29.5), (8.15, 12.95, -30.0), (12.95, 16.6, -30.5), (16.6, 18.55, -31.5),
    (18.55, 21.3, -31.0), (21.3, 24.85, -30.0), (24.85, 28.0, -29.5), (28.0, 31.5, -23.0),
]


if __name__ == "__main__":
    args = cli(os.path.join("public", "japan", "music_p5.wav"))
    score()
    render(LEVELS, args.narration, args.out)
