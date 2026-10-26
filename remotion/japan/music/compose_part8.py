"""Original score for "Japan – Part 8: 250 years of peace" (88.5 s).

Same instruments as the earlier parts (synth.py); cue times come from the
Part 8 word timings.

   0.0  title          the series opening, in G
   3.0  control        sly plucks; a bulb "ding"; wobbly puppet bends
   5.9  to Edo         a travelling march; a chime as Edo appears
   9.2  hostages       a tender music box
  12.6  danger         rising tremolo and a "danger" hit
  17.3  the cost       a procession walk; coins draining away; a deflate
  21.6  peace          a pastoral flute tune with birdsong
  26.7  Edo period     a festival groove and a title chord
  29.0  cities         a busy little groove; coins for the rich
  31.6  art            kabuki clappers and plucks; a wave swell; applause
  36.8  raced ahead    a sleepy Japan, then a brisk Western gallop
  40.4  Europe         a march with a reed fanfare; a chugging engine; a shot
  46.3  tea            a calm tea room; "No, no!" stings; frantic whisking
  53.7  warned         a warning call, a "la la la" ignored
  58.0  warship        a dark drone and cannon booms
  62.7  samurai        a brave motif cut short by a cannon
  66.7  the door       hushed suspense and five knocks
  71.2  black ships    a heavy, ominous march; a hit for the big guns
  77.0  the choice     two chords pulling either way, a ticking clock
  82.0  what now?      a suspended, unresolved close

Run from the repo root:
    python3 remotion/japan/music/compose_part8.py --narration narration_p8.wav
"""
import json
import os
import re

from synth import *  # noqa: F401,F403  (instruments, helpers, constants)
from synth import cli, configure, render

DUR = 88.5
configure(DUR)

_ts = open(os.path.join(os.path.dirname(__file__), "..", "words-part8.ts")).read()
WORDS = [(float(a), float(b)) for a, b in re.findall(r'\["(?:[^"\\]|\\.)*", ([\d.]+), ([\d.]+)\]', _ts)]
SPOKEN = json.loads(re.search(r"SPOKEN_P8 = (\[.*?\]);", _ts, re.S).group(1))
assert len(WORDS) == len(SPOKEN), (len(WORDS), len(SPOKEN))

# Scene starts (video seconds), as in Part8.tsx.
T = dict(control=3.0, toedo=5.9, hostages=9.2, danger=12.6, cost=17.3, peace=21.6, edoperiod=26.7, cities=29.0, art=31.6,
         raced=36.8, europe=40.4, tea=46.3, warned=53.7, warship=58.0, samurai=62.7, knock=66.7, blackships=71.2,
         choice=77.0, whatnow=82.0, out=88.5)


def cue(i, word):
    """Video time of narration word i (checked against the spoken word)."""
    assert SPOKEN[i] == word, (i, SPOKEN[i], word)
    return NARRATION_OFFSET + WORDS[i][0]


def frame(t):
    """Snap a time to the video frame the picture uses for it."""
    return round(t * 30) / 30


def hit(t, vel=0.8, crash_vel=0.2, pan=0.0):
    """A drum hit on a spoken word: kept a little under the voice."""
    place(taiko(vel * 0.7, 1.35), t, rev=0.55)
    if crash_vel:
        place(crash(crash_vel * 0.7), t, pan, rev=0.55)


def tremolo(t0, t1, a, b, vel0=0.1, vel1=0.2, step=0.09, pan=-0.3):
    t = t0
    while t < t1:
        v = vel0 + (vel1 - vel0) * (t - t0) / max(0.01, t1 - t0)
        place(koto(hz(a if int((t - t0) / step) % 2 else b), step * 0.8, v, ring=0.3), t, pan, rev=0.3)
        t += step


def score():
    # ---- title (0 - 3.0)
    place(taiko(0.45, 1.1), 0.05, rev=0.6)
    place(pad(["G2", "D3", "G3", "B3"], 3.2, 0.45, attack=1.4, release=1.2), 0.0, rev=0.5)
    for i, n in enumerate(["G3", "A3", "B3", "D4", "E4", "G4", "A4"]):
        place(koto(hz(n), 0.9, 0.36 + i * 0.04), 0.22 + i * 0.11, -0.4 + i * 0.12, rev=0.4)
    melody(1.05, [("D5", 0.8), ("E5", 0.4), ("D5", 0.4), ("B4", 0.6), ("G4", 2.6)], vel=0.42)
    place(noise_swell(0.8, 0.14, 300, 5000), 2.3, rev=0.4)

    # ---- a clever way to control the daimyo (3.0 - 5.9)
    clever = cue(5, "clever")
    daimyo = cue(10, "daimyo")
    place(pad(["E3", "B3", "D4", "G4"], 2.95, 0.2, attack=0.3, release=0.3), 3.0, rev=0.45)
    for k in range(int(2.8 / (BEAT / 2))):  # sly plucks
        place(koto(hz(["E3", "G3", "B3", "A#3"][k % 4]), 0.14, 0.26, ring=0.3), 3.05 + k * BEAT / 2, -0.2, rev=0.25)
    place(glock(hz("E6"), 0.24), clever, 0.3, rev=0.6)
    place(glock(hz("B6"), 0.16), clever + 0.08, 0.4, rev=0.6)
    for k in range(3):  # wobbly puppets
        place(koto(hz(["D4", "F4", "A4"][k]), 0.4, 0.26, bend=-1.5, slide=1.5), daimyo + k * 0.2, -0.3 + k * 0.3, rev=0.3)

    # ---- every other year to Edo (5.9 - 9.2)
    edo = cue(21, "edo")
    place(swish(), 5.7)
    groove(5.9, 9.2, [(5.9, "D"), (7.15, "G"), (8.4, "A")], "march", pad_vel=0.24)
    melody(6.2, [("A4", 0.5), ("B4", 0.5), ("D5", 1.0), ("E5", 0.5), ("D5", 0.5), ("B4", 1.0)], vel=0.26)
    place(bell(hz("D5"), 0.2, 2.5), edo, 0.3, rev=0.6)

    # ---- wives and children stay in Edo (9.2 - 12.6)
    wives = cue(24, "wives")
    place(swish(), 9.0)
    chord_track([(9.2, 12.65, ["G3", "D4", "G4", "B4"])], vel=0.22, attack=0.5, release=0.4)
    for k, n in enumerate(["B5", "D6", "G6", "D6", "C6", "E6", "A6", "E6", "B5", "D6", "G6"]):  # music box
        place(glock(hz(n), 0.11), wives - 0.2 + k * 0.28, 0.2, rev=0.5)

    # ---- danger (12.6 - 17.3)
    turned = cue(39, "turned")
    danger = cue(48, "danger")
    place(swish(), 12.4)
    place(pad(["D3", "A3", "Eb4"], danger - 12.6, 0.22, attack=0.3, release=0.2), 12.6, rev=0.45)
    tremolo(turned, danger - 0.1, "D4", "Eb4", 0.08, 0.2)
    place(taiko(0.5, 1.4), frame(turned), rev=0.4)
    hit(frame(danger), 0.85, 0.24)
    place(pad(["D2", "A2", "D3", "F3", "Ab3"], 17.35 - danger, 0.3, attack=0.05, release=0.4, bright=1.3), danger, rev=0.5)

    # ---- the cost of travelling (17.3 - 21.6)
    money = cue(56, "money")
    no = cue(58, "no")
    war = cue(63, "war")
    place(swish(), 17.1)
    groove(17.3, no, [(17.3, "C"), (18.55, "G")], "stately", pad_vel=0.24, arp_vel=0.12)
    for k in range(8):  # the money drains away
        place(glock(hz(["C7", "B6", "A6", "G6", "F6", "E6", "D6", "C6"][k]), 0.12), money - 0.3 + k * 0.14, 0.3, rev=0.4)
    place(bass_slide(hz("C3"), hz("C2"), 0.8, 0.32), no + 0.2)
    place(koto(hz("G4"), 0.5, 0.3, slide=-5), war, 0.0, rev=0.3)
    place(pad(["C3", "G3", "C4"], 21.65 - no, 0.18, attack=0.3, release=0.4, bright=0.7), no, rev=0.45)

    # ---- 250 years of peace (21.6 - 26.7)
    peace = cue(72, "peace")
    place(swish(), 21.4)
    chord_track([(21.6, 23.5, ["G2", "D3", "G3", "B3", "D4"]), (23.5, 25.0, ["C3", "G3", "C4", "E4"]), (25.0, 26.75, ["D3", "A3", "D4", "F#4"])], vel=0.26, attack=0.8, release=0.6)
    arpeggio(21.65, 26.6, ["G4", "B4", "D5", "B4", "E5", "D5"], BEAT / 2, 0.14, 0.3, dur=0.4)
    melody(peace - 0.6, [("D5", 1.0), ("E5", 0.5), ("G5", 1.5), ("A5", 0.5), ("G5", 0.5), ("E5", 1.0), ("D5", 2.0)], vel=0.3, vib=0.8)
    for k in range(5):  # birdsong
        place(glock(hz(["E7", "G7", "E7", "D7", "G7"][k]), 0.08), 22.2 + k * 0.11, 0.5, rev=0.5)

    # ---- the Edo period (26.7 - 29.0)
    edo2 = cue(85, "edo")
    place(swish(), 26.5)
    groove(26.7, 29.0, [(26.7, "G"), (27.95, "D")], "light", pad_vel=0.24, arp_vel=0.14)
    for k in range(8):  # festival
        place(shime(0.16 + 0.08 * (k % 2 == 0)), 26.75 + k * BEAT / 2, 0.3)
    hit(frame(edo2), 0.6, 0.16)
    place(bell(hz("G4"), 0.2, 2.5), edo2, 0.2, rev=0.6)

    # ---- cities grew, traders got rich (29.0 - 31.6)
    rich = cue(92, "rich")
    groove(29.0, 31.6, [(29.0, "G"), (30.25, "C")], "modern", pad_vel=0.22, arp_vel=0.14)
    for k in range(5):
        place(glock(hz(["B6", "D7", "G6", "B6", "E7"][k]), 0.12), rich + k * 0.08, 0.4, rev=0.4)

    # ---- kabuki and ukiyo-e (31.6 - 36.8)
    kabuki = cue(98, "kabuki")
    ukiyoe = cue(101, "ukiyoe")
    popular = cue(104, "popular")
    place(swish(), 31.4)
    place(pad(["A3", "E4", "B4"], 36.85 - 31.6, 0.18, attack=0.5, release=0.4), 31.6, rev=0.45)
    t = kabuki - 0.9
    gap = 0.22
    while t < kabuki:  # tsuke clappers speeding up into the pose
        place(woodblock(1800, 0.2), t, 0.3)
        t += gap
        gap *= 0.8
    place(woodblock(1500, 0.34), kabuki, 0.0)
    place(woodblock(1500, 0.34), kabuki + 0.12, 0.0)
    for k, n in enumerate(["E4", "A4", "B4", "E5", "B4", "A4", "E4", "B3"]):  # shamisen-ish riff
        place(koto(hz(n), 0.14, 0.3, ring=0.4), kabuki + 0.3 + k * BEAT / 2, -0.3, rev=0.3)
    place(noise_swell(0.9, 0.14, 400, 5000), ukiyoe - 0.6, 0.3, rev=0.4)
    place(wave_crash(0.16), ukiyoe + 0.25, 0.3, rev=0.4)
    for k in range(10):  # applause
        place(shaker(0.12), popular + k * 0.06 + (k % 3) * 0.01, -0.5 + (k % 5) * 0.25)
    chord_track([(popular, 36.85, ["A2", "E3", "A3", "C#4", "E4"])], vel=0.26, attack=0.1)

    # ---- Japan stays closed; the world races ahead (36.8 - 40.4)
    raced = cue(115, "raced")
    place(swish(), 36.6)
    place(reed(hz("G3"), 0.8, 0.24), 37.0, -0.3, rev=0.4)  # a sleepy yawn
    place(reed(hz("D3"), 1.0, 0.22), 37.9, -0.3, rev=0.4)
    groove(raced - 0.3, 40.4, [(raced - 0.3, "C"), (raced + 0.95, "G")], "march", pad_vel=0.24)
    for k in range(int((40.35 - raced) / (BEAT / 4))):  # a brisk gallop
        place(koto(hz(["C5", "E5", "G5", "E5"][k % 4]), 0.08, 0.2, ring=0.3), raced + k * BEAT / 4, 0.3, rev=0.2)

    # ---- Europe: revolutions, engines, railways, rifles (40.4 - 46.3)
    revolutions = cue(120, "revolutions")
    steam = cue(124, "steam")
    rifles = cue(129, "rifles")
    place(swish(), 40.2)
    groove(40.4, 46.3, [(40.4, "C"), (41.65, "F"), (42.9, "G"), (44.15, "C"), (45.4, "G")], "march", pad_vel=0.26)
    for t0, n, d in [(revolutions, "C4", 0.3), (revolutions + 0.32, "E4", 0.3), (revolutions + 0.64, "G4", 0.8)]:
        place(reed(hz(n), d, 0.3), t0, -0.2, rev=0.4)  # fanfare
    t = steam
    while t < rifles - 0.2:  # chug-chug
        place(shaker(0.18), t, 0.4)
        place(shaker(0.1), t + BEAT / 4, 0.4)
        t += BEAT / 2
    place(flute(hz("C6"), 0.6, 0.24, vib=0.0, scoop=False), steam + 0.3, 0.4, rev=0.4)  # whistle
    place(flute(hz("A5"), 0.4, 0.2, vib=0.0, scoop=False), steam + 0.95, 0.4, rev=0.4)
    place(gunshot(0.4), frame(rifles) + 0.25, 0.3, rev=0.4)

    # ---- tea ceremonies (46.3 - 53.7)
    holding = cue(135, "holding")
    no1 = cue(144, "no")
    this2 = cue(146, "this")
    place(swish(), 46.1)
    place(woodblock(900, 0.18), 46.6, 0.0)
    sho(["G4", "A4", "D5", "E5"], holding - 0.2, no1 - holding, 0.22)
    for k in range(int((no1 - holding) / BEAT)):  # calm, slow plucks
        place(koto(hz(["D5", "B4", "A4", "G4"][k % 4]), 0.6, 0.2, ring=1.0), holding + k * BEAT, 0.2, rev=0.45)
    place(woodblock(700, 0.26), frame(no1), -0.3)  # "No, no!"
    place(woodblock(700, 0.26), frame(no1) + 0.55, -0.3)
    place(boing(280, 0.24), no1 + 0.2, 0.3)
    t = this2
    while t < 53.6:  # frantic whisking
        place(shaker(0.14), t, 0.4)
        t += 0.09
    chord_track([(no1, 53.75, ["G3", "C4", "D4", "F4"])], vel=0.2, attack=0.1, release=0.3)

    # ---- the Dutch warn; Japan doesn't listen (53.7 - 58.0)
    warned = cue(154, "warned")
    again1 = cue(156, "again")
    again2 = cue(158, "again")
    not_ = cue(162, "not")
    place(swish(), 53.5)
    place(pad(["A3", "E4", "A4"], 58.05 - 53.7, 0.18, attack=0.3, release=0.3), 53.7, rev=0.45)
    for t0 in (warned, again1, again2):  # a warning call
        for k in range(3):
            place(reed(hz("A4"), 0.12, 0.28), t0 + k * 0.16, -0.3, rev=0.3)
    for k, n in enumerate(["C6", "E6", "G6", "E6", "C6"]):  # la la la...
        place(glock(hz(n), 0.12), not_ + 0.2 + k * 0.18, 0.4, rev=0.4)

    # ---- one warship could destroy towns (58.0 - 62.7)
    destroy = cue(170, "destroy")
    place(swish(), 57.8)
    place(pad(["D2", "A2", "D3", "Eb3"], 62.75 - 58.0, 0.28, attack=0.5, release=0.4, bright=0.8), 58.0, rev=0.5)
    for k in range(int((62.6 - 58.0) / BEAT)):
        place(taiko(0.2, 1.5), 58.0 + k * BEAT, rev=0.5)
    for i in range(3):
        place(boom(0.3 - i * 0.04), frame(destroy) + i * 5 / 30, 0.3 - i * 0.2, rev=0.4)
    place(fire(62.7 - destroy, 0.18), destroy + 0.4, -0.3, rev=0.2)

    # ---- a sword against cannons (62.7 - 66.7)
    samurai = cue(177, "samurai")
    nothing = cue(183, "nothing")
    place(swish(), 62.5)
    for t0, n, d in [(samurai, "D4", 0.3), (samurai + 0.32, "G4", 0.3), (samurai + 0.64, "A4", 0.6)]:
        place(reed(hz(n), d, 0.3), t0, 0.0, rev=0.4)  # brave...
    place(taiko(0.5, 1.2), samurai, rev=0.4)
    place(sword(0.3), samurai + 0.6, -0.3, rev=0.4)
    place(boom(0.45), frame(nothing), 0.3, rev=0.4)  # ...BOOM
    place(bass_slide(hz("A3"), hz("A2"), 0.7, 0.3), nothing + 0.3)
    place(pad(["D3", "A3", "D4"], 66.75 - nothing, 0.18, attack=0.4, release=0.4, bright=0.7), nothing + 0.3, rev=0.45)

    # ---- the door was closed... knock knock (66.7 - 71.2)
    someone = cue(191, "someone")
    brk = cue(195, "break")
    open_ = cue(197, "open")
    place(pad(["D3", "A3", "Eb4", "Bb4"], 71.25 - 66.7, 0.22, attack=0.6, release=0.3, bright=0.8), 66.7, rev=0.5)
    for t0 in (someone + 6 / 30, someone + 18 / 30, brk - 6 / 30, brk + 2 / 30, open_):
        place(taiko(0.4, 1.6), frame(t0), rev=0.35)
        place(woodblock(400, 0.2), frame(t0), 0.0)
    place(noise_swell(open_ + 0.3 - 68.5, 0.14, 300, 4000), 68.5, rev=0.4)
    hit(frame(open_) + 0.2, 0.7, 0.2)

    # ---- the black ships (71.2 - 77.0)
    year = cue(199, "eighteen")
    american = cue(202, "american")
    big = cue(211, "big")
    groove(71.2, 77.0, [(71.2, "Dm"), (72.45, "Bb"), (73.7, "Gm"), (74.95, "A")], "march", pad_vel=0.3)
    hit(frame(year), 0.6, 0.14)
    for t0, n, d in [(american, "D3", 0.5), (american + 0.55, "F3", 0.5), (american + 1.1, "A3", 0.5), (american + 1.65, "G#3", 1.0)]:
        place(reed(hz(n) * 2, d, 0.32), t0, -0.2, rev=0.45)
    hit(frame(big), 0.85, 0.24)
    place(boom(0.22), frame(big) + 0.1, 0.3, rev=0.4)

    # ---- the choice (77.0 - 82.0)
    choice = cue(218, "choice")
    open2 = cue(219, "open")
    face = cue(223, "face")
    place(swish(), 76.8)
    chord_track([(77.0, open2, ["D3", "A3", "D4", "F4"]), (open2, face, ["G3", "D4", "G4", "B4"]), (face, 82.05, ["D3", "Ab3", "D4", "F4"])], vel=0.26, attack=0.2, release=0.3)
    for k in range(int((82.0 - choice) / 0.5)):  # tick, tock
        place(woodblock(1300 if k % 2 == 0 else 1000, 0.12), choice + k * 0.5, 0.3)
    place(glock(hz("G6"), 0.18), frame(open2), -0.4, rev=0.5)
    place(taiko(0.45, 1.4), frame(face), 0.4, rev=0.4)

    # ---- what did Japan do? (82.0 - 88.5): left hanging
    what = cue(226, "what")
    place(swish(), 81.8)
    chord_track([(82.0, 88.5, ["D3", "A3", "E4", "G4", "B4"])], vel=0.28, attack=0.6, release=1.0, bright=0.8)
    for k, n in enumerate(["A4", "B4", "D5", "E5"]):  # a question, unanswered
        place(koto(hz(n), 0.5, 0.26, bend=0.6 if k == 3 else 0.0), what + 0.2 + k * 0.32, 0.2, rev=0.45)
    place(bell(hz("A3"), 0.2, 4.0), what + 1.8, rev=0.7)
    place(glock(hz("E6"), 0.14), 86.4, 0.3, rev=0.7)


_names = list(T.keys())
_SECT = list(T.values())
_ADJ = {"hostages": -31.0, "peace": -30.5, "tea": -30.5, "knock": -31.0, "danger": -31.0, "blackships": -30.5, "warship": -31.0,
        "whatnow": -31.8, "choice": -30.8, "warned": -30.5}
LEVELS = [(0.0, 3.0, -19.0)] + [(a, b, _ADJ.get(n, -30.0)) for n, a, b in zip(_names, _SECT, _SECT[1:])]
LEVELS[-1] = (LEVELS[-1][0], 86.0, LEVELS[-1][2])
LEVELS.append((86.0, 88.5, -25.0))


if __name__ == "__main__":
    args = cli(os.path.join("public", "japan", "music_p8.wav"))
    score()
    render(LEVELS, args.narration, args.out)
