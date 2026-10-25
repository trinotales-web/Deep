"""Original score for "Japan – Part 7: the bird that would not sing" (174.5 s).

Same instruments as the earlier parts (synth.py); cue times come from the
Part 7 word timings.

    0.0  title         the series opening, in A
    3.0  the rush      a battle groove and a hit as the traitor falls
    8.3  all of Japan  a march; a chime for every flag that turns gold
   13.0  sword hunt    pizzicato and a clank for every weapon handed over
   15.75 melt          a roaring fire, then a glowing chord for the Buddha
   19.4  real reason   a sly, sneaky reed; a radish "boing"
   23.8  wanted more   a greedy rising line that opens onto China
   29.1  Seoul         a fast march, a ticking clock for "a few weeks"
   34.4  turtle ships  a heroic theme for Admiral Yi, cannon and sinking ships
   40.6  hungry        a thin, sad tune and rumbling stomachs
   43.4  China         heavy drums and low reeds for the huge army
   47.25 home          a bell for Hideyoshi, then a soft sail home
   52.3  the child     a music box for the boy, a calm theme for Ieyasu
   58.3  opposites     wild drums against a patient flute
   64.1  loyal         a sad minor line that warms to major; a ticking wait
   70.0  the saying    a storyteller's plucks and a chime for each man
   73.1  the bird      silence, a sword, a sweet coax, a long wait, birdsong
   80.8  Sekigahara    an ominous march to the battlefield
   86.4  fog           a misty pad, distant drums, "80,000" hits
   91.5  nobody wins   drums pushing left and right, a ticking clock
   93.8  secret deal   sneaky low plucks in the candlelight
   97.7  switch        rising tension and a big turn
  100.8  shogun        a fanfare and a stately groove
  106.0  the family    the stately theme, a chime for each generation
  110.7  Christians    the Portuguese dance returns, then a church-bell glow
  119.0  the Pope      an uneasy pair of chords
  123.2  banned        a stamp and a sad departing reed
  127.3  Shimabara     a dark drone, rain and heavy drums
  133.4  Amakusa Shiro a rising, defiant theme
  138.7  siege         a big march; cannon from the Dutch ships
  144.0  the fall      a crash and a falling line
  146.5  37,000        near silence, a few soft bells, a single low bell
  153.0  sakoku        the doors boom shut; a solemn chord
  157.7  the Dutch     a shoo for the foreigners, a merry trade tune
  163.2  Dejima        a small music-box tune by the sea
  168.7  no step       tiptoes, a "NO!", and a gentle final cadence

Run from the repo root:
    python3 remotion/japan/music/compose_part7.py --narration narration_p7.wav
"""
import json
import os
import re

from synth import *  # noqa: F401,F403  (instruments, helpers, constants)
from synth import cli, configure, render

DUR = 174.5
configure(DUR)

_ts = open(os.path.join(os.path.dirname(__file__), "..", "words-part7.ts")).read()
WORDS = [(float(a), float(b)) for a, b in re.findall(r'\["(?:[^"\\]|\\.)*", ([\d.]+), ([\d.]+)\]', _ts)]
SPOKEN = json.loads(re.search(r"SPOKEN_P7 = (\[.*?\]);", _ts, re.S).group(1))
assert len(WORDS) == len(SPOKEN), (len(WORDS), len(SPOKEN))

# Scene starts (video seconds), as in Part7.tsx.
T = dict(rush=3.0, unify=8.3, swordhunt=13.0, melt=15.75, reason=19.4, wantedmore=23.8, seoul=29.1, turtle=34.4,
         hungry=40.6, chinaarmy=43.4, home=47.25, child=52.3, opposite=58.3, loyal=64.1, saying=70.0, bird=73.1,
         sekigahara=80.8, fog=86.4, nobodywin=91.5, secret=93.8, switch=97.7, shogun=100.8, family=106.0,
         christians=110.7, pope=119.0, banned=123.2, shimabara=127.3, shiro=133.4, siege=138.7, fell=144.0,
         inside=146.5, sakoku=153.0, exceptdutch=157.7, dejima=163.2, nostep=168.7, out=174.5)


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
    place(pad(["A2", "E3", "A3", "C4"], 3.2, 0.45, attack=1.4, release=1.2), 0.0, rev=0.5)
    for i, n in enumerate(["A3", "C4", "D4", "E4", "G4", "A4", "C5"]):
        place(koto(hz(n), 0.9, 0.36 + i * 0.04), 0.22 + i * 0.11, -0.4 + i * 0.12, rev=0.4)
    melody(1.05, [("E5", 0.8), ("G5", 0.4), ("E5", 0.4), ("D5", 0.6), ("A4", 2.6)], vel=0.42)
    for k, n in enumerate(["E6", "G6", "E6"]):  # a little birdsong
        place(glock(hz(n), 0.12), 1.8 + k * 0.12, 0.5, rev=0.5)
    place(noise_swell(0.8, 0.14, 300, 5000), 2.3, rev=0.4)

    # ---- the rush to Kyoto (3.0 - 8.3)
    destroyed = cue(10, "destroyed")
    groove(3.0, destroyed, [(3.0, "Dm"), (4.25, "Bb"), (5.5, "Dm"), (6.75, "A")], "battle", pad_vel=0.3, arp_vel=0.12)
    hit(frame(destroyed), 0.9, 0.28)
    place(boom(0.3), frame(destroyed), 0.3, rev=0.4)
    chord_track([(destroyed, 8.35, ["D3", "A3", "D4", "F#4", "A4"])], vel=0.36, attack=0.05)

    # ---- all of Japan (8.3 - 13.0)
    brought = cue(21, "brought")
    control = cue(27, "control")
    place(swish(), 8.1)
    groove(8.3, 13.0, [(8.3, "D"), (9.55, "G"), (10.8, "A"), (12.05, "D")], "march", pad_vel=0.28)
    for i in range(14):  # every lord's flag turns gold
        place(glock(hz(["D6", "E6", "F#6", "A6", "B6"][i % 5]), 0.12), frame(brought) + i * 2 / 30, -0.5 + (i % 5) * 0.25, rev=0.5)
    melody(control - 0.3, [("A5", 0.5), ("B5", 0.5), ("D6", 1.5)], vel=0.3)
    place(crash(0.18), control, 0.2, rev=0.6)

    # ---- the sword hunt (13.0 - 15.75)
    farmers = cue(34, "farmers")
    monks = cue(36, "monks")
    place(swish(), 12.8)
    place(pad(["E3", "B3", "E4"], 2.8, 0.22, attack=0.2, release=0.3), 13.0, rev=0.45)
    for k in range(int(2.7 / (BEAT / 2))):
        place(koto(hz(["E4", "G4", "A4", "B4"][k % 4]), 0.12, 0.24, ring=0.3), 13.0 + k * BEAT / 2, 0.3, rev=0.25)
    for t0 in (farmers, farmers + 4 / 30, monks, monks + 4 / 30):  # clank into the pile
        place(anvil(0.3), frame(t0) + 14 / 30, -0.2, rev=0.3)

    # ---- melt them down for a giant Buddha (15.75 - 19.4)
    melt = cue(42, "melt")
    build = cue(47, "build")
    buddha = cue(50, "buddha")
    place(fire(19.5 - melt, 0.26), melt, 0.0, rev=0.2)
    place(pad(["E3", "B3", "E4", "G4"], build - 15.75, 0.24, attack=0.3, release=0.3), 15.75, rev=0.45)
    sho(["E4", "F#4", "B4", "C#5", "E5"], build, 19.5 - build, 0.3)
    place(bell(hz("E3"), 0.3, 4.0), buddha, rev=0.65)
    for k, n in enumerate(["B5", "E6", "G#6", "B6"]):
        place(glock(hz(n), 0.16), buddha + 0.1 + k * 0.08, -0.3 + k * 0.2, rev=0.6)

    # ---- the real reason (19.4 - 23.8)
    simple = cue(57, "simple")
    nobody = cue(60, "nobody")
    fight = cue(62, "fight")
    place(swish(), 19.2)
    place(pad(["A2", "E3", "G3", "C4"], 23.85 - 19.4, 0.2, attack=0.3, release=0.3), 19.4, rev=0.45)
    tm = simple - 0.1
    for n, b in [("E4", 0.5), ("D#4", 0.5), ("E4", 0.5), ("C4", 1.0), (None, 0.5), ("A3", 0.5), ("B3", 0.5), ("C4", 1.0)]:
        if n:
            place(reed(hz(n), b * BEAT * 0.85, 0.34), tm, -0.1, rev=0.35)  # a sneaky little tune
        tm += b * BEAT
    for k in range(int((23.7 - 19.4) / BEAT)):
        place(koto(hz("A2" if k % 2 == 0 else "E3"), 0.14, 0.3, ring=0.3), 19.4 + k * BEAT, -0.2, rev=0.2)
    place(woodblock(900, 0.22), nobody, 0.3)
    place(boing(260, 0.3), fight + 0.35, 0.3)

    # ---- he wanted more: China, through Korea (23.8 - 29.1)
    more = cue(67, "more")
    china = cue(73, "china")
    korea = cue(77, "korea")
    place(swish(), 23.6)
    for k, n in enumerate(["A3", "C4", "E4", "A4", "C5", "E5"]):  # greedy rising line
        place(koto(hz(n), 0.25, 0.26 + k * 0.02), more - 0.6 + k * 0.1, 0.2, rev=0.3)
    place(taiko(0.6, 1.3), frame(more), rev=0.5)
    chord_track([(23.8, china, ["A2", "E3", "A3", "C4"]), (china, korea, ["F2", "C3", "F3", "A3", "C4"]), (korea, 29.15, ["G2", "D3", "G3", "B3", "D4"])], vel=0.3, attack=0.3, release=0.4)
    place(bell(hz("F3"), 0.24, 3.0), china, rev=0.6)
    melody(china + 0.2, [("C5", 1.0), ("A4", 0.5), ("G4", 0.5), ("F4", 1.0)], vel=0.28)
    for k in range(4):
        place(taiko(0.22 + k * 0.05, 1.35), korea + k * BEAT / 2, rev=0.35)

    # ---- fast to Seoul, in a few weeks (29.1 - 34.4)
    moved = cue(82, "moved")
    seoul = cue(86, "seoul")
    few = cue(90, "few")
    place(swish(), 28.9)
    groove(29.1, 34.4, [(29.1, "Am"), (30.35, "G"), (31.6, "Am"), (32.85, "Em")], "battle", pad_vel=0.26, arp_vel=0.12)
    place(noise_swell(0.5, 0.14, 1000, 8000), moved - 0.3, 0.2, rev=0.3)
    place(glock(hz("E6"), 0.22), frame(seoul) + 4 / 30, 0.3, rev=0.5)
    place(glock(hz("A6"), 0.18), frame(seoul) + 8 / 30, 0.4, rev=0.5)
    for k in range(6):  # tick tock: just a few weeks
        place(woodblock(1400 if k % 2 == 0 else 1100, 0.16), few + k * 0.18, 0.4)

    # ---- Admiral Yi and the turtle ships (34.4 - 40.6)
    yi = cue(96, "yi")
    turtle = cue(102, "turtle")
    destroy = cue(105, "destroy")
    supply = cue(107, "supply")
    place(swish(), 34.2)
    chord_track([(34.4, turtle, ["D3", "A3", "D4", "E4"]), (turtle, 40.65, ["G2", "D3", "G3", "A3", "D4"])], vel=0.3, attack=0.3, release=0.4)
    hit(frame(yi), 0.7, 0.16)
    melody(yi + 0.2, [("D5", 0.5), ("E5", 0.5), ("G5", 1.0), ("A5", 0.5), ("G5", 0.5), ("E5", 1.0)], vel=0.32)  # heroic, pentatonic
    for k in range(int((40.5 - turtle) / BEAT)):
        place(taiko(0.36 if k % 2 == 0 else 0.24, 1.3), turtle + k * BEAT, rev=0.35)
        place(shime(0.16), turtle + k * BEAT + BEAT / 2, 0.3)
    place(boom(0.4), frame(destroy), 0.3, rev=0.4)
    for i in range(3):  # each supply ship goes down
        place(wave_crash(0.22), frame(supply) + i * 6 / 30 + 0.5, 0.2 + i * 0.2, rev=0.3)
        place(bass_slide(hz("A2") * (1 - i * 0.06), hz("D2"), 0.6, 0.26), frame(supply) + i * 6 / 30 + 0.3)

    # ---- who would feed the soldiers? (40.6 - 43.4)
    supplies = cue(111, "supplies")
    who = cue(112, "who")
    place(swish(), 40.4)
    place(pad(["A2", "E3", "A3"], 43.45 - 40.6, 0.2, attack=0.5, release=0.4, bright=0.7), 40.6, rev=0.5)
    melody(supplies, [("C5", 0.5), ("B4", 0.5), ("A4", 1.0), ("E4", 2.0)], inst="koto", vel=0.26, pan=0.2)
    for i in range(3):  # rumbling stomachs
        place(bass_slide(hz("E2"), hz("C2"), 0.45, 0.24), frame(supplies) + i * 6 / 30 + 0.1)
    place(woodblock(800, 0.18), who, 0.3)

    # ---- China sends a huge army (43.4 - 47.25)
    china2 = cue(121, "china")
    huge = cue(124, "huge")
    help_ = cue(127, "help")
    place(swish(), 43.2)
    place(pad(["D2", "A2", "D3", "F3"], 47.3 - 43.4, 0.3, attack=0.4, release=0.4, bright=1.2), 43.4, rev=0.5)
    for k in range(int((47.2 - china2) / (BEAT / 2))):
        place(taiko(0.34 if k % 2 == 0 else 0.2, 1.4), china2 + k * BEAT / 2, (-0.3 if k % 2 else 0.3), rev=0.35)
    for t0, n, d in [(china2, "D3", 0.6), (china2 + 0.65, "F3", 0.6), (huge, "A3", 1.0)]:
        place(reed(hz(n), d, 0.34), t0, -0.1, rev=0.45)
    hit(frame(huge), 0.8, 0.2)
    place(glock(hz("D6"), 0.18), help_, 0.3, rev=0.5)

    # ---- Hideyoshi dies; the army comes home (47.25 - 52.3)
    died = cue(135, "died")
    home = cue(141, "home")
    place(swish(), 47.05)
    place(pad(["A2", "E3", "A3", "C4"], died - 47.25, 0.22, attack=0.5, release=0.4), 47.25, rev=0.5)
    for k in range(6):  # six years
        place(woodblock(1200, 0.14), 47.4 + k * 0.17, 0.3)
    place(bell(hz("A2"), 0.34, 4.5), died, rev=0.7)
    melody(died + 0.4, [("E5", 1.0), ("D5", 0.5), ("C5", 0.5), ("A4", 1.5)], vel=0.28, vib=1.1)
    chord_track([(died + 0.5, 52.35, ["F2", "C3", "F3", "A3", "C4"])], vel=0.24, attack=0.8, release=0.6)
    arpeggio(home - 1.0, 52.3, ["F4", "A4", "C5", "A4"], BEAT / 2, 0.14, 0.3, dur=0.4)

    # ---- the child, and Tokugawa Ieyasu (52.3 - 58.3)
    child = cue(148, "child")
    powerful = cue(152, "powerful")
    toku = cue(158, "tokugawa")
    place(swish(), 52.1)
    for k, n in enumerate(["C6", "E6", "G6", "E6", "D6", "F6", "A6", "F6", "E6", "G6", "C7"]):  # music box
        place(glock(hz(n), 0.12), 52.4 + k * 0.24, 0.3, rev=0.5)
    place(pad(["C3", "G3", "C4", "E4"], powerful - 52.3, 0.18, attack=0.4, release=0.4), 52.3, rev=0.45)
    place(glock(hz("G6"), 0.16), child, 0.4, rev=0.5)
    sho(["G3", "D4", "A4", "B4"], powerful - 0.2, 58.4 - powerful, 0.3)
    place(taiko(0.35, 1.4), frame(toku), rev=0.5)
    melody(toku + 0.3, [("D5", 1.0), ("B4", 0.5), ("A4", 0.5), ("G4", 2.0)], vel=0.3, vib=0.8)
    place(bass(hz("G2"), 58.35 - toku, 0.26, pluck=False), toku)

    # ---- wild vs patient (58.3 - 64.1)
    opposite = cue(163, "opposite")
    wild = cue(168, "wild")
    patient = cue(172, "patient")
    place(swish(), 58.1)
    place(pad(["G3", "D4", "A4"], wild - 58.3, 0.2, attack=0.3, release=0.2), 58.3, rev=0.45)
    place(woodblock(1000, 0.2), opposite, 0.0)
    t = wild - 0.1
    k = 0
    while t < patient - 0.2:  # wild!
        place(taiko(0.3 + 0.2 * (k % 3 == 0), 1.0), t, (-0.4 if k % 2 else 0.4), rev=0.3)
        t += BEAT / 4 * (1 + (k % 3 == 2))
        k += 1
    place(reed(hz("D4"), 0.4, 0.34), wild, -0.4, rev=0.4)
    place(reed(hz("Eb4"), 0.5, 0.34), wild + 0.45, -0.4, rev=0.4)
    sho(["G4", "D5", "E5"], patient, 64.2 - patient, 0.22)
    melody(patient + 0.1, [("D5", 1.5), ("E5", 0.5), ("G5", 2.0)], vel=0.26, vib=0.6)

    # ---- the son, and still loyal (64.1 - 70.0)
    ordered = cue(176, "ordered")
    son = cue(181, "son")
    loyal = cue(186, "loyal")
    waited = cue(188, "waited")
    place(swish(), 63.9)
    chord_track([(64.1, son, ["D3", "A3", "D4", "F4"]), (son, loyal, ["Bb2", "F3", "Bb3", "D4"]), (loyal, 70.05, ["F2", "C3", "F3", "A3", "C4"])], vel=0.26, attack=0.6, release=0.5)
    place(woodblock(700, 0.2), ordered, -0.2)
    melody(son, [("A4", 1.0), ("G4", 0.5), ("F4", 0.5), ("E4", 1.0), ("D4", 1.0)], vel=0.28, vib=1.2)
    place(glock(hz("A6"), 0.1), son + 0.5, 0.3, rev=0.6)  # a tear
    melody(loyal, [("C5", 0.5), ("D5", 0.5), ("F5", 1.5)], inst="koto", vel=0.28, pan=0.2)
    for k in range(int((70.0 - waited) / 0.5)):  # waiting...
        place(woodblock(1300 if k % 2 == 0 else 1050, 0.1), waited + k * 0.5, 0.4)

    # ---- a famous saying about three men (70.0 - 73.1)
    famous = cue(194, "famous")
    three = cue(198, "three")
    place(swish(), 69.8)
    for k, n in enumerate(["A4", "C5", "D5", "E5", "D5", "C5", "A4"]):  # storyteller
        place(koto(hz(n), 0.2, 0.26, ring=0.5), famous - 0.4 + k * BEAT / 2, 0.2, rev=0.3)
    place(pad(["A3", "E4"], 73.15 - 70.0, 0.18, attack=0.4, release=0.3), 70.0, rev=0.45)
    for i, n in enumerate(["E5", "A5", "C6"]):  # one, two, three men
        place(bell(hz(n), 0.16, 2.0), frame(three) + (i * 5 - 10) / 30, -0.4 + i * 0.4, rev=0.5)

    # ---- if the bird won't sing... (73.1 - 80.8)
    nob = cue(205, "nobunaga")
    kills = cue(206, "kills")
    hide = cue(208, "hideyoshi")
    sing2 = cue(212, "sing")
    iey = cue(214, "ieyasu")
    waits = cue(215, "waits")
    sings = cue(218, "sings")
    place(pad(["A3", "E4", "B4"], nob - 73.1, 0.16, attack=0.6, release=0.3), 73.1, rev=0.5)  # a silent bird
    place(taiko(0.4, 1.2), frame(nob), rev=0.4)
    place(sword(0.32), kills - 0.1, -0.3, rev=0.4)
    place(reed(hz("D4"), 0.5, 0.34), kills, -0.3, rev=0.4)
    for k, n in enumerate(["G5", "A5", "C6", "A5"]):  # Hideyoshi coaxes
        place(koto(hz(n), 0.2, 0.24, ring=0.5), hide + 0.1 + k * BEAT / 2, 0.0, rev=0.3)
    for k in range(6):  # the bird sings for him
        place(glock(hz(["E6", "G6", "A6", "G6", "E6", "D6"][k]), 0.12), frame(sing2) + 0.05 + k * 0.1, 0.1, rev=0.4)
    place(pad(["E3", "B3", "E4"], sings - iey, 0.16, attack=0.8, release=0.2), iey, rev=0.5)
    for k in range(int((sings - waits) / 0.45)):  # Ieyasu waits...
        place(woodblock(1200 if k % 2 == 0 else 950, 0.08), waits + k * 0.45, 0.4)
    for k in range(9):  # ...and at last it sings
        place(glock(hz(["E6", "G6", "A6", "B6", "A6", "G6", "E6", "G6", "A6"][k]), 0.14), frame(sings) + 0.05 + k * 0.09, 0.4, rev=0.45)
    chord_track([(sings, 80.85, ["A2", "E3", "A3", "C#4", "E4"])], vel=0.3, attack=0.1)

    # ---- Sekigahara, 1600 (80.8 - 86.4)
    year = cue(220, "sixteen")
    seki = cue(231, "sekigahara")
    place(swish(), 80.6)
    place(pad(["D2", "A2", "D3"], 86.45 - 80.8, 0.28, attack=0.5, release=0.4, bright=0.9), 80.8, rev=0.5)
    hit(frame(year), 0.7, 0.16)
    b = 0
    while 81.3 + b * BEAT < 86.3:
        place(taiko(0.22 + 0.2 * (b / 9), 1.4), 81.3 + b * BEAT, rev=0.35)
        b += 1
    for t0, n, d in [(year + 0.8, "D3", 0.6), (year + 1.45, "F3", 0.6), (year + 2.1, "E3", 1.0)]:
        place(reed(hz(n) * 2, d, 0.3), t0, -0.2, rev=0.45)
    hit(frame(seki), 0.85, 0.24)

    # ---- the battle in the fog (86.4 - 91.5)
    fog = cue(237, "fog")
    eighty = cue(243, "eighty")
    sho(["D4", "E4", "A4", "B4"], 86.4, 91.55 - 86.4, 0.24)
    place(noise_swell(91.4 - 86.4, 0.1, 200, 1500, shape=1.0), 86.4, rev=0.6)
    for k in range(8):
        place(taiko(0.16, 1.5), 86.6 + k * BEAT, (-0.5 if k % 2 else 0.5), rev=0.6)  # distant drums
    place(bell(hz("D3"), 0.2, 3.0), fog, rev=0.7)
    hit(frame(eighty) - 2 / 30, 0.6, 0.0, -0.4)
    hit(frame(eighty) + 1 / 30, 0.6, 0.14, 0.4)

    # ---- nobody winning (91.5 - 93.8)
    place(pad(["D3", "A3", "Eb4"], 93.85 - 91.5, 0.2, attack=0.2, release=0.2), 91.5, rev=0.45)
    for k in range(int(2.3 / (BEAT / 2))):
        place(taiko(0.26, 1.2), 91.5 + k * BEAT / 2, (-0.6 if k % 2 else 0.6), rev=0.3)
        place(woodblock(1300 if k % 2 else 1000, 0.12), 91.5 + k * BEAT / 2 + BEAT / 4, 0.0)

    # ---- the secret deal (93.8 - 97.7)
    secret = cue(256, "secret")
    deal = cue(257, "deal")
    place(swish(), 93.6)
    place(pad(["C3", "G3", "Bb3", "Eb4"], 97.75 - 93.8, 0.2, attack=0.4, release=0.3, bright=0.7), 93.8, rev=0.5)
    for k in range(int(3.8 / (BEAT / 2))):  # sneaky low plucks
        place(koto(hz(["C3", "Eb3", "G3", "F#3"][k % 4]), 0.12, 0.26, ring=0.3), 93.85 + k * BEAT / 2, -0.2, rev=0.25)
    place(noise_swell(0.35, 0.12, 3000, 9000), deal + 0.3, 0.3)  # shh
    place(glock(hz("G6"), 0.12), secret, 0.4, rev=0.6)

    # ---- the commander switches sides (97.7 - 100.8)
    switched = cue(272, "switched")
    tremolo(97.7, switched - 0.1, "D4", "Eb4", 0.1, 0.24)
    place(noise_swell(switched - 97.7, 0.16, 400, 6000), 97.7, rev=0.4)
    hit(frame(switched), 0.95, 0.3)
    chord_track([(switched, 100.85, ["G2", "D3", "G3", "B3", "D4"])], vel=0.4, attack=0.05, bright=1.3)
    melody(switched + 0.3, [("D5", 0.5), ("G5", 0.5), ("B5", 1.0)], vel=0.3)

    # ---- Ieyasu wins and becomes shogun (100.8 - 106.0)
    won = cue(279, "won")
    shogun = cue(285, "shogun")
    place(swish(), 100.6)
    groove(100.8, 106.0, [(100.8, "G"), (102.05, "C"), (103.3, "D"), (104.55, "G")], "stately", pad_vel=0.28, arp_vel=0.14)
    for t0, n, d in [(won, "G4", 0.3), (won + 0.32, "G4", 0.3), (won + 0.64, "D5", 0.9)]:
        place(reed(hz(n), d, 0.3), t0, 0.0, rev=0.45)
    hit(frame(shogun), 0.7, 0.2)
    melody(shogun + 0.2, [("B4", 0.5), ("D5", 0.5), ("G5", 2.0)], vel=0.3)

    # ---- only the Tokugawa family (106.0 - 110.7)
    family = cue(295, "family")
    rule = cue(299, "rule")
    groove(106.0, 110.7, [(106.0, "G"), (107.25, "Em"), (108.5, "C"), (109.75, "D")], "stately", pad_vel=0.26, arp_vel=0.12)
    for k, t0 in enumerate([family, family + 4 / 30, rule - 4 / 30, rule, rule + 4 / 30, rule + 8 / 30]):  # each generation
        place(glock(hz(["G5", "B5", "D6", "E6", "G6", "B6"][k]), 0.14), frame(t0), -0.4 + k * 0.16, rev=0.5)

    # ---- Christianity comes (110.7 - 119.0)
    remember = cue(303, "remember")
    xianity = cue(311, "christianity")
    thousands = cue(313, "thousands")
    place(swish(), 110.5)
    tm = remember - 0.2
    for n, bt in [("A4", 0.5), ("D5", 0.75), ("E5", 0.25), ("F#5", 0.5), ("E5", 0.5), ("D5", 1.0)]:  # Part 5's dance
        place(reed(hz(n), bt * BEAT * 0.9, 0.3), tm, -0.15, rev=0.45)
        tm += bt * BEAT
    for k in range(int((xianity - 110.7) / BEAT)):
        place(koto(hz(["D4", "A4", "F#4", "A4"][k % 4]), 0.3, 0.2, ring=0.6), 110.7 + k * BEAT, 0.3, rev=0.35)
    sho(["D4", "F#4", "A4", "D5"], xianity - 0.2, 119.05 - xianity, 0.28)
    place(bell(hz("D4"), 0.26, 3.5), xianity, rev=0.7)
    place(bell(hz("A3"), 0.2, 3.5), xianity + 0.8, rev=0.7)
    for k in range(12):  # people becoming Christians
        place(glock(hz(["D6", "F#6", "A6", "B6"][k % 4]), 0.1), thousands + k * 3 / 30 + 0.05, -0.5 + (k % 6) * 0.2, rev=0.5)

    # ---- the Pope or the shogun? (119.0 - 123.2)
    pope = cue(327, "pope")
    shogun2 = cue(331, "shogun")
    place(swish(), 118.8)
    chord_track([(119.0, pope, ["D3", "A3", "D4", "F4"]), (pope, shogun2, ["D3", "A3", "D4", "F#4", "A4"]), (shogun2, 123.25, ["D3", "Ab3", "D4", "F4"])], vel=0.26, attack=0.3, release=0.3)
    place(bell(hz("A4"), 0.18, 2.5), pope, 0.5, rev=0.7)
    place(taiko(0.35, 1.4), frame(shogun2), -0.4, rev=0.4)

    # ---- banned; priests thrown out (123.2 - 127.3)
    banned = cue(335, "banned")
    thrown = cue(340, "thrown")
    place(swish(), 123.0)
    place(pad(["A2", "E3", "A3", "C4"], 127.35 - 123.2, 0.22, attack=0.3, release=0.4), 123.2, rev=0.45)
    place(taiko(0.8, 1.2), frame(banned), rev=0.4)
    place(woodblock(500, 0.3), frame(banned), 0.0)
    melody(thrown, [("E4", 1.0), ("D4", 0.5), ("C4", 0.5), ("A3", 2.0)], vel=0.28, vib=1.0)

    # ---- Shimabara: taxes and punishments (127.3 - 133.4)
    shima = cue(346, "shimabara")
    taxes = cue(352, "taxes")
    cruel = cue(354, "cruel")
    place(swish(), 127.1)
    place(pad(["D2", "A2", "D3", "Eb3"], 133.45 - 127.3, 0.28, attack=0.6, release=0.4, bright=0.8), 127.3, rev=0.5)
    place(glock(hz("D6"), 0.14), shima, 0.4, rev=0.6)
    for k in range(int((133.3 - taxes) / BEAT)):  # heavy steps
        place(taiko(0.3, 1.5), taxes + k * BEAT, rev=0.4)
    place(storm(133.4 - cruel, 0.16), cruel - 0.2, 0.0, rev=0.2)
    place(reed(hz("D4"), 0.8, 0.3), cruel, -0.2, rev=0.45)
    place(reed(hz("C#4"), 1.2, 0.3), cruel + 0.85, -0.2, rev=0.45)

    # ---- Amakusa Shiro (133.4 - 138.7)
    fought = cue(358, "fought")
    shiro = cue(369, "shiro")
    place(swish(), 133.2)
    groove(133.4, 138.75, [(133.4, "Dm"), (134.65, "Bb"), (135.9, "C"), (137.15, "Dm")], "march", pad_vel=0.28)
    hit(frame(fought), 0.7, 0.16)
    melody(fought + 0.4, [("D5", 0.5), ("F5", 0.5), ("A5", 1.0), ("G5", 0.5), ("F5", 0.5), ("E5", 1.0)], vel=0.3)
    hit(frame(shiro) - 6 / 30, 0.6, 0.14)

    # ---- the siege; the Dutch ships fire (138.7 - 144.0)
    lakh = cue(376, "lakh")
    help2 = cue(385, "help")
    place(swish(), 138.5)
    groove(138.7, 144.05, [(138.7, "Dm"), (139.95, "Bb"), (141.2, "Gm"), (142.45, "A")], "battle", pad_vel=0.28, arp_vel=0.1)
    hit(frame(lakh), 0.8, 0.2)
    for i in range(3):
        place(boom(0.32 - i * 0.04), frame(help2) + (4 + i * 8) / 30, -0.3 + i * 0.2, rev=0.4)

    # ---- after three months, the castle fell (144.0 - 146.5)
    three = cue(387, "three")
    fell = cue(391, "fell")
    for k in range(3):  # three months
        place(woodblock(1000, 0.18), three + k * 0.2, 0.3)
    place(pad(["D2", "A2", "D3", "F3"], 146.55 - 144.0, 0.26, attack=0.2, release=0.4), 144.0, rev=0.5)
    hit(frame(fell), 0.9, 0.3)
    place(rumble(1.6, 0.3), frame(fell), rev=0.3)
    place(bass_slide(hz("D3"), hz("D2"), 1.0, 0.3), fell + 0.1)

    # ---- 37,000 people; almost every single one (146.5 - 153.0)
    guess = cue(400, "guess")
    almost = cue(405, "almost")
    place(pad(["D3", "A3", "D4"], 153.05 - 146.5, 0.18, attack=1.0, release=0.8, bright=0.6), 146.5, rev=0.6)
    for k in range(4):
        place(bell(hz(["A4", "F4", "D4", "A3"][k]), 0.1, 3.0), 146.8 + k * 0.7, -0.3 + k * 0.2, rev=0.7)
    for k in range(int((almost - guess) / 0.45)):  # a hushed tick while you guess
        place(woodblock(1100, 0.07), guess + k * 0.45, 0.3)
    place(bell(hz("D2"), 0.3, 6.0), almost + 0.1, rev=0.8)
    melody(almost + 0.8, [("A4", 1.0), ("F4", 1.0), ("D4", 3.0)], vel=0.2, vib=0.8)

    # ---- sakoku: the doors shut (153.0 - 157.7)
    shut = cue(412, "shut")
    world = cue(417, "world")
    sakoku = cue(421, "sakoku")
    place(rumble(world + 0.2 - shut, 0.22), shut, rev=0.3)
    place(taiko(0.7, 1.5), frame(world) + 4 / 30, rev=0.6)
    place(boom(0.2), frame(world) + 4 / 30, 0.0, rev=0.5)
    chord_track([(world + 0.2, 157.75, ["D2", "A2", "D3", "E3", "A3"])], vel=0.34, attack=0.1, release=0.5, bright=0.9)
    place(bell(hz("A2"), 0.28, 4.0), frame(sakoku), rev=0.7)

    # ---- everyone out, except the Dutch (157.7 - 163.2)
    thrown2 = cue(426, "thrown")
    dutch = cue(430, "dutch")
    trade = cue(436, "trade")
    for k in range(4):  # shoo, shoo
        place(woodblock(1500 - k * 120, 0.18), thrown2 + k * 0.15, 0.3)
    place(swish(0.16), thrown2 + 0.4, -0.4)
    groove(dutch - 0.2, 163.25, [(dutch - 0.2, "G"), (dutch + 1.05, "D"), (dutch + 2.3, "G")], "light", pad_vel=0.22, arp_vel=0.12)
    tm = dutch
    for n, bt in [("D5", 0.5), ("G5", 0.5), ("B5", 0.5), ("A5", 0.5), ("G5", 0.5), ("F#5", 0.5), ("G5", 1.0)]:  # a merry Dutch tune
        place(flute(hz(n), bt * BEAT * 0.9, 0.3), tm, 0.1, rev=0.35)
        tm += bt * BEAT
    for k in range(5):  # coins
        place(glock(hz(["B6", "D7", "G6", "B6", "E7"][k]), 0.12), trade + k * 0.08, 0.4, rev=0.4)

    # ---- tiny Dejima (163.2 - 168.7)
    tiny = cue(446, "tiny")
    dejima = cue(453, "dejima")
    place(swish(), 163.0)
    place(wave_crash(0.16), 163.3, -0.3, rev=0.4)
    place(pad(["G3", "D4", "G4"], 168.75 - 163.2, 0.2, attack=0.6, release=0.5), 163.2, rev=0.5)
    for k, n in enumerate(["G5", "B5", "D6", "B5", "A5", "C6", "E6", "C6", "B5", "D6", "G6", "D6"]):  # small and sweet
        place(glock(hz(n), 0.11), 163.4 + k * 0.3, 0.2, rev=0.45)
    place(glock(hz("G6"), 0.16), tiny, 0.5, rev=0.5)
    place(bell(hz("G4"), 0.2, 2.5), dejima, 0.0, rev=0.6)

    # ---- not one step (168.7 - 174.5): and a quiet ending
    not_ = cue(456, "not")
    all_ = cue(464, "all")
    for k in range(int((not_ - 168.7) / 0.18)):  # tiptoes
        place(koto(hz(["D5", "E5"][k % 2]), 0.08, 0.2, ring=0.3), 168.75 + k * 0.18, 0.3, rev=0.2)
    place(taiko(0.4, 1.2), frame(not_), rev=0.4)
    place(woodblock(500, 0.28), frame(not_), 0.0)
    place(boing(240, 0.26), all_ + 0.4, 0.3)
    chord_track([(all_ + 0.5, 174.5, ["G2", "D3", "G3", "B3", "D4"])], vel=0.32, attack=0.5, release=1.0)
    melody(all_ + 0.7, [("D5", 1.0), ("B4", 0.5), ("A4", 0.5), ("G4", 3.0)], vel=0.28, vib=0.8)
    place(bass(hz("G2"), 174.5 - all_ - 0.5, 0.26, pluck=False), all_ + 0.5)
    place(glock(hz("G6"), 0.14), 173.0, 0.3, rev=0.7)


_SECT = list(T.values())
LEVELS = [(0.0, 3.0, -19.0)] + [(a, b, -30.0) for a, b in zip(_SECT, _SECT[1:])]
# quieter, sombre and dialogue-heavy moments; a little more under the big hits
_ADJ = {"inside": -33.0, "loyal": -31.5, "home": -31.0, "hungry": -31.0, "shimabara": -31.0, "bird": -31.0,
        "secret": -31.0, "child": -30.5, "melt": -30.5, "dejima": -30.5, "chinaarmy": -31.5, "fog": -31.5,
        "switch": -31.5, "banned": -31.5, "sakoku": -31.5, "turtle": -30.5, "nostep": -30.5}
_names = list(T.keys())
LEVELS = [(0.0, 3.0, -19.0)] + [(a, b, _ADJ.get(n, -30.0)) for n, a, b in zip(_names, _SECT, _SECT[1:])]
LEVELS[-1] = (LEVELS[-1][0], 172.0, LEVELS[-1][2])
LEVELS.append((172.0, 174.5, -25.0))


if __name__ == "__main__":
    args = cli(os.path.join("public", "japan", "music_p7.wav"))
    score()
    render(LEVELS, args.narration, args.out)
