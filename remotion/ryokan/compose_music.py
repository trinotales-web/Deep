"""Original score for the Ryōkan story, synthesized from scratch with numpy.

The instruments live in remotion/storybook/synth.py. The arrangement reads
its scene boundaries and story cues from timeline.json, the same file the
animation uses, so the music turns with the story.

    python3 remotion/ryokan/compose_music.py   # -> public/ryokan/music.m4a
"""

import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE.parent / "storybook"))

from synth import *  # noqa: E402,F403
import synth  # noqa: E402

TL = json.loads((HERE / "timeline.json").read_text())
CUE = TL["cues"]
DUR = float(TL["duration"])
BEAT = 60.0 / TL["bpm"]
B0 = TL["beatOffset"]
synth.init(DUR, seed=7)


def beat(b):
    return B0 + b * BEAT


# ------------------------------------------------------------------ the score

S = TL["scenes"]

# 1. Mountain morning: D major pentatonic, open and calm.
pad([m("D3"), m("A3"), m("E4"), m("F#4")], 0.0, S["mountain"]["end"], att=1.4, rel=1.2, gain=0.9)
bass(m("D2"), beat(0), 1.8)
bass(m("B1"), beat(3), 1.2, 0.9)
bass(m("G1"), beat(5), 1.0, 0.9)
gliss(beat(0), ["D4", "E4", "F#4", "A4", "B4", "D5", "E5"], step=0.05)
arp = ["A4", "D5", "F#5", "D5", "B4", "D5", "F#5", "D5", "B4", "D5"]
for i, nm in enumerate(arp):
    k(beat(1) + i * BEAT / 2, nm, 0.5 if i % 2 else 0.62, -0.3 + 0.06 * (i % 3))
fl([(beat(2), "A4", 0.85, 0.75), (beat(3.5), "B4", 0.28, 0.8), (beat(4), "D5", 1.05, 0.9), (beat(5.75), "B4", 0.3, 0.6)])
chime(m("D6"), CUE["ryokanWave"], 0.7, 0.4)
chime(m("A6"), CUE["ryokanWave"] + 0.3, 0.45, 0.5)

# 2. He owned almost nothing: sparse plucks and space.
pad([m("D3"), m("A3")], S["nothing"]["start"] - 0.1, S["nothing"]["end"], att=0.6, rel=0.8, gain=0.55)
k(beat(6), "D5", 0.7)
k(beat(6) + 0.6, "A4", 0.45)
pon(CUE["matPop"], 0.7, f0=230)
woodblock(CUE["bowlPop"], 0.8, pan=0.3, f0=760)
k(CUE["bowlPop"], "E6", 0.35, 0.3, bright=0.4)
k(beat(8) - 0.3, "F#5", 0.5)
k(CUE["spiderDrop"], "B5", 0.55, 0.45, bend=-5, bend_at=0.03, bend_time=0.42)
k(CUE["spiderDrop"] + 0.7, "F#5", 0.45, 0.45, bend=1, bend_at=0.02, bend_time=0.08, stacc=True)
k(beat(9.5), "A4", 0.45)
k(beat(9.5) + 0.3, "D5", 0.4)

# 3. The thief: miyako-bushi (D Eb G A Bb), tiptoe plucks on his steps.
thief_t0 = S["night"]["start"]
pad([m("D2"), m("A2"), m("D3")], thief_t0 - 0.15, CUE["eyeOpen"] + 0.4, att=0.5, rel=0.9, gain=0.8, bright=0.4, name="drone")
for i, tb in enumerate((0, 1.2)):
    taiko(thief_t0 + tb, 0.8 if i == 0 else 0.55)
steps = ["D4", "A3", "Eb4", "A3", "D4"]
for i, nm in enumerate(steps):
    ts = CUE["thiefEnter"] + i * BEAT / 2
    k(ts, nm, 0.7, 0.35, stacc=True)
    k(ts, "D3" if i % 2 == 0 else "A2", 0.4, 0.0, stacc=True)
    woodblock(ts + BEAT / 4, 0.35, pan=0.6, f0=1100)
k(CUE["thiefStop"], "G4", 0.65, 0.3)
woodblock(CUE["thiefStop"] + 0.12, 0.5, 0.5, 980)
woodblock(CUE["thiefStop"] + 0.22, 0.4, 0.6, 1040)
rummage = ["D4", "Eb4", "G4", "A4", "Bb4", "A4", "G4", "Eb4"]
for i, nm in enumerate(rummage):
    k(CUE["bowlLift"] + i * BEAT / 4, nm, 0.42 + 0.03 * (i % 2), 0.4, stacc=True)
for i in range(8):
    woodblock(CUE["bowlShake"] + 0.04 * i, 0.22 + 0.04 * (i % 2), 0.45, 700 + 60 * (i % 3))
k(CUE["question"], "A4", 0.75, 0.35, bend=1, bend_at=0.08, bend_time=0.22)
pon(CUE["question"] + 0.02, 0.55, f0=300, rise=True)
chime(m("A5"), CUE["eyeOpen"], 0.55, -0.2)
k(CUE["eyeOpen"] + 0.3, "D5", 0.4, -0.25)

# 4. The gift: warm and tender.
g0 = CUE["robeOffer"]
pad([m("G3"), m("B3"), m("D4"), m("F#4"), m("A4")], g0 - 0.2, g0 + 1.25, att=0.5, rel=0.6, gain=0.95)
pad([m("A3"), m("D4"), m("E4"), m("B4")], g0 + 1.15, g0 + 2.3, att=0.3, rel=0.6, gain=0.9)
pad([m("D3"), m("A3"), m("F#4"), m("E5")], g0 + 2.2, S["moon"]["start"] + 0.4, att=0.3, rel=0.8, gain=0.8)
bass(m("G2"), g0, 1.2)
bass(m("A2"), g0 + 1.2, 1.0)
bass(m("D2"), g0 + 2.2, 1.0)
for i, nm in enumerate(["G3", "D4", "A4", "B4"]):
    k(g0 + i * BEAT / 2, nm, 0.5, -0.3)
k(g0 + 0.05, "A5", 0.4, 0.45, bright=0.5)
fl([(g0 + 0.1, "F#5", 0.55, 0.8), (g0 + 0.7, "E5", 0.28, 0.7), (g0 + 1.0, "D5", 0.4, 0.75), (g0 + 1.45, "B4", 0.7, 0.8), (g0 + 2.2, "A4", 0.4, 0.55)], vib=0.8)
chime(m("D6"), CUE["robeTaken"], 0.6, 0.2)
gliss(CUE["thiefRun"], ["D4", "E4", "F#4", "A4", "B4", "D5", "E5", "F#5", "A5", "B5", "D6"], step=0.035, vel0=0.35, vel1=0.6, pan0=-0.1, pan1=0.9)
whoosh(CUE["thiefRun"], 0.75, 0.9)
k(CUE["goodbyeWave"] + 0.2, "F#5", 0.42, -0.2)
k(CUE["goodbyeWave"] + 0.5, "A5", 0.38, -0.2)

# 5. The moon in my window: still, shimmering, the flute sings.
mo = S["moon"]["start"]
bowl(m("D5"), CUE["rin"], 8.0, 0.9, 0.0)
pad([m("D3"), m("A3"), m("E4"), m("F#4"), m("A4")], mo - 0.1, S["moon"]["end"], att=1.6, rel=1.4, gain=0.85, bright=1.2)
pad([m("A5"), m("E6")], mo + 0.8, S["moon"]["end"], att=2.0, rel=1.2, gain=0.25, bright=0.4)
bass(m("D2"), mo, 4.4, 0.8)
for ct, nm in zip(CUE["haikuColumns"], ["A4", "D5", "F#5"]):
    k(ct, nm, 0.62, -0.25)
    k(ct + 0.18, nm[:-1] + str(int(nm[-1]) + 1), 0.22, 0.35, bright=0.3)
for i, (dt, nm) in enumerate([(0.3, "D6"), (0.9, "A6"), (1.7, "E6"), (2.6, "B6"), (3.1, "F#6"), (3.8, "D7"), (4.2, "A6")]):
    chime(m(nm), mo + dt, 0.42, -0.5 + 0.17 * i)
fl([(CUE["translation"] - 0.2, "A4", 0.6, 0.7), (CUE["translation"] + 0.4, "B4", 0.3, 0.75), (CUE["translation"] + 0.7, "D5", 1.0, 0.9), (CUE["translation"] + 1.7, "E5", 0.35, 0.8), (CUE["translation"] + 2.05, "D5", 0.45, 0.6)], vib=1.1, breath=0.13)
k(CUE["haikuColumns"][2] + 0.55, "D3", 0.45, -0.1)

# 6. Lightness: bright, buoyant; a hand drum on every temari bounce.
l0 = S["lightness"]["start"]
fin = CUE["finale"]
chords = [
    (l0, beat(30), ["D3", "F#3", "A3", "E4"], "D2", ["D5", "A4", "E5", "A4", "F#5", "A4", "E5", "A4"]),
    (beat(30), beat(32), ["B2", "F#3", "A3", "D4"], "B1", ["D5", "F#4", "B4", "F#4", "D5", "F#4", "E5", "F#4"]),
    (beat(32), beat(33), ["G2", "D3", "B3", "F#4"], "G1", ["B4", "D4", "A4", "D4"]),
    (beat(33), fin, ["A2", "E3", "A3", "D4", "E4"], "A1", ["E5", "A4", "D5", "A4"]),
]
for c0, c1, voicing, root, figure in chords:
    pad([m(v) for v in voicing], c0 - 0.05, c1, att=0.25, rel=0.5, gain=0.75)
    bass(m(root) + 12, c0, c1 - c0, 0.9)
    for i, nm in enumerate(figure):
        k(c0 + i * BEAT / 2, nm, 0.55 if i % 2 == 0 else 0.42, -0.35 + 0.1 * (i % 2))
bounce = CUE["ballFirstBounce"]
while bounce < fin - 0.01:
    pon(bounce, 0.75, f0=240)
    shaker(bounce + BEAT / 2, 0.8)
    shaker(bounce + BEAT / 4, 0.4)
    shaker(bounce + 3 * BEAT / 4, 0.4)
    bounce += BEAT
fl([(l0 + 0.3, "D5", 0.28, 0.7), (l0 + 0.6, "E5", 0.28, 0.75), (l0 + 0.9, "F#5", 0.55, 0.85), (l0 + 1.5, "A5", 0.28, 0.85), (l0 + 1.8, "F#5", 0.28, 0.75), (l0 + 2.1, "E5", 0.28, 0.75),
    (l0 + 2.4, "D5", 0.28, 0.7), (l0 + 2.7, "E5", 0.28, 0.75), (l0 + 3.0, "F#5", 0.28, 0.8), (l0 + 3.3, "E5", 0.28, 0.75), (fin, "D5", 1.2, 0.8)], vib=0.9, bright=1.1)
pad([m("D3"), m("A3"), m("D4"), m("F#4"), m("A4"), m("E5")], fin - 0.05, DUR - 0.3, att=0.15, rel=1.0, gain=0.9)
bass(m("D2"), fin, 1.3)
gliss(fin, ["D4", "F#4", "A4", "B4", "D5", "E5", "F#5", "A5", "D6"], step=0.04, vel0=0.45, vel1=0.75, pan0=-0.5, pan1=0.5)
bowl(m("D5"), fin + 0.05, 3.0, 0.6, 0.15)
chime(m("A6"), fin + 0.4, 0.5, 0.5)
chime(m("D7"), fin + 0.75, 0.35, -0.4)

# ------------------------------------------------------------------ mixdown

synth.master(
    ROOT / "public" / "ryokan" / "music.m4a",
    levels={"koto": 1.05, "flute": 0.95, "pad": 0.75, "drone": 0.6, "bells": 0.9, "drums": 0.8, "perc": 0.9, "bass": 0.5},
    sends={"koto": 0.32, "flute": 0.42, "pad": 0.35, "drone": 0.3, "bells": 0.55, "drums": 0.15, "perc": 0.18, "bass": 0.0},
    sections={k_: (v["start"], v["end"]) for k_, v in S.items()},
)
