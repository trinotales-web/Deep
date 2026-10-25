"""Original score for the kimono story, synthesized from scratch with numpy.

Instruments come from remotion/storybook/synth.py; scene boundaries and
story cues come from timeline.json, the same file the animation uses.
G major pentatonic at 120 bpm, so every scene starts on a beat.

    python3 remotion/kimono/compose_music.py   # -> public/kimono/music.m4a
"""

import json
import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE.parent / "storybook"))

from synth import *  # noqa: E402,F403
import synth  # noqa: E402

TL = json.loads((HERE / "timeline.json").read_text())
CUE = TL["cues"]
S = TL["scenes"]
DUR = float(TL["duration"])
BEAT = 60.0 / TL["bpm"]
synth.init(DUR, seed=11)


def beat(b):
    return TL["beatOffset"] + b * BEAT


def clank(t0, gain=1.0):
    """Wrench on metal: short inharmonic ring plus a bright tick."""
    n = int(0.5 * synth.SR)
    t = np.arange(n) / synth.SR
    out = sum(a * np.exp(-t / tau) * np.sin(2 * np.pi * f * t) for f, a, tau in ((1250, 1, 0.09), (2930, 0.6, 0.05), (4710, 0.35, 0.03)))
    put("perc", out * 0.06, t0, 0.15, gain)
    woodblock(t0, 0.5 * gain, 0.1, 1500)


def crash(t0, gain=1.0):
    """Soft tumble of boxes: low thump and a short burst of filtered noise."""
    taiko(t0, 0.9 * gain, f0=64)
    n = int(0.6 * synth.SR)
    t = np.arange(n) / synth.SR
    noise = fft_filter(synth.rng.standard_normal(n), lo=200, hi=2500) * np.exp(-t / 0.12)
    put("perc", noise * 0.05, t0, 0.3, gain)
    for i, f in enumerate((620, 760, 540)):
        woodblock(t0 + 0.06 + i * 0.07, 0.5 * gain, 0.2 + 0.2 * i, f)


# 1. Think of a traditional kimono: elegant and calm.
pad([m("G3"), m("D4"), m("A4"), m("B4")], 0.0, S["fit"]["end"], att=0.9, rel=0.8, gain=0.85)
bass(m("G2"), 0.0, 3.8, 0.8)
gliss(CUE["kimonoDrop"], ["G4", "A4", "B4", "D5", "E5", "G5"], step=0.06, vel0=0.4, vel1=0.8)
for i, nm in enumerate(["B4", "D5", "G5", "D5", "E5", "D5"]):
    k(beat(1.5) + i * BEAT / 2, nm, 0.5 if i % 2 else 0.6, -0.3)
chime(m("G6"), CUE["kimonoDrop"] + 0.6, 0.5, 0.4)

# 2. Made to the wearer's height: the tape climbs, one note per tick.
rise = ["G4", "A4", "B4", "D5", "E5", "G5"]
for i, nm in enumerate(rise):
    k(CUE["tapeStart"] + i * (CUE["tapeTop"] - CUE["tapeStart"]) / len(rise), nm, 0.45 + 0.05 * i, 0.3, stacc=i < len(rise) - 1)
chime(m("D6"), CUE["tapeTop"], 0.7, 0.4)
chime(m("G6"), CUE["tapeTop"] + 0.08, 0.6, 0.5)
pon(CUE["tapeTop"], 0.5, f0=280)
fl([(CUE["tapeTop"] + 0.15, "B5", 0.22, 0.7), (CUE["tapeTop"] + 0.4, "A5", 0.22, 0.65), (CUE["tapeTop"] + 0.62, "G5", 0.32, 0.7)], vib=0.6)

# 3. Too long: a bouncy walk, then a tumble.
pad([m("G3"), m("B3"), m("D4")], S["long"]["start"] - 0.05, S["long"]["end"], att=0.3, rel=0.5, gain=0.55)
for i, nm in enumerate(["G4", "B4", "D5", "B4", "A4", "B4", "D5"]):
    ts = S["long"]["start"] + i * BEAT / 2 * 0.9
    if ts < CUE["trip"] - 0.05:
        k(ts, nm, 0.55, -0.2, stacc=True)
        woodblock(ts + BEAT / 4, 0.25, 0.4, 1150)
gliss(CUE["trip"], ["G6", "E6", "D6", "B5", "A5", "G5", "E5", "D5"], step=0.035, vel0=0.6, vel1=0.4, pan0=0.4, pan1=-0.2)
taiko(CUE["trip"] + 0.18, 0.6)
pon(CUE["trip"] + 0.08, 0.6, f0=320, rise=True)
k(CUE["trip"] + 0.6, "D5", 0.4, -0.2)
k(CUE["trip"] + 0.85, "G4", 0.45, -0.2)

# 4. Too short: awkward, hesitant plucks.
pad([m("E3"), m("B3"), m("E4")], S["short"]["start"] - 0.05, S["short"]["end"], att=0.4, rel=0.5, gain=0.5, bright=0.6)
k(S["short"]["start"] + 0.05, "E5", 0.5, 0.2, stacc=True)
k(S["short"]["start"] + 0.3, "G5", 0.4, 0.2, stacc=True)
for i in range(3):
    woodblock(CUE["tug"] + i * 0.12, 0.35, 0.3, 900 + 80 * i)
k(CUE["sweat"], "A5", 0.55, 0.3, bend=-1, bend_at=0.05, bend_time=0.3)
k(CUE["sweat"] + 0.45, "E5", 0.35, 0.3, stacc=True)

# 5. Everything bigger than you: weight arrives.
b0 = S["bigger"]["start"]
taiko(b0, 0.9)
taiko(CUE["reveal"], 0.7, f0=60)
pad([m("C3"), m("G3"), m("E4"), m("B4")], b0 - 0.05, S["bigger"]["end"], att=0.6, rel=0.6, gain=0.95)
bass(m("C2"), b0, 2.0, 0.9)
fl([(CUE["reveal"] + 0.1, "E5", 0.9, 0.85), (CUE["reveal"] + 1.0, "D5", 0.6, 0.7)], vib=1.0)
for d in CUE["dust"]:
    shaker(d, 1.4, 0.2)
    shaker(d + 0.08, 1.0, 0.25)

# 6-7. The house and the car: a busy, sweeping ostinato.
h0 = S["house"]["start"]
c0 = S["car"]["start"]
ost = ["E4", "G4", "A4", "G4", "D5", "A4", "G4", "A4"]
for i in range(int((S["car"]["end"] - h0) / (BEAT / 2))):
    ts = h0 + i * BEAT / 2
    k(ts, ost[i % len(ost)], 0.5 if i % 2 == 0 else 0.38, -0.3, stacc=i % 4 != 0)
    shaker(ts + BEAT / 4, 0.7)
pad([m("E3"), m("B3"), m("D4"), m("G4")], h0 - 0.05, c0, att=0.3, rel=0.4, gain=0.6)
pad([m("A2"), m("E3"), m("A3"), m("D4")], c0 - 0.05, c0 + 1.25, att=0.2, rel=0.4, gain=0.6)
pad([m("C3"), m("G3"), m("B3"), m("E4")], c0 + 1.2, S["car"]["end"], att=0.2, rel=0.4, gain=0.6)
bass(m("E2"), h0, 2.5, 0.8)
bass(m("A2"), c0, 1.25, 0.8)
bass(m("C3"), c0 + 1.25, 1.25, 0.8)
for i, at in enumerate(CUE["dustBunnies"]):
    k(at, ["B5", "D6", "A5", "E6"][i], 0.45, 0.4, stacc=True)
    woodblock(at + 0.02, 0.3, 0.45, 1300)
for at in CUE["clank"]:
    clank(at)
for i, nm in enumerate(["D7", "B6", "A6", "G6", "E6", "D6", "B5"]):
    chime(m(nm), CUE["coins"] + i * 0.07, 0.45, 0.5 - 0.12 * i)

# 8. A lifestyle built to impress: it climbs, wobbles, slips.
l0 = S["lifestyle"]["start"]
for i in range(int((CUE["stopFeeding"] - l0) / BEAT)):
    taiko(l0 + i * BEAT, 0.35 + 0.08 * i, f0=78)
pad([m("G3"), m("D4"), m("A4")], l0 - 0.05, CUE["stopFeeding"], att=0.2, rel=0.3, gain=0.7)
bass(m("G2"), l0, 1.8, 0.8)
for i, at in enumerate(CUE["feed"]):
    k(at + 0.25, ["G4", "B4", "D5", "G5"][i], 0.6 + 0.05 * i, 0.2)
    pon(at + 0.25, 0.45, f0=240 + 30 * i)
for i in range(6):
    ts = CUE["wobble"] + i * 0.09
    k(ts, "D5" if i % 2 else "E5", 0.3 + 0.03 * i, 0.3, bend=(-0.5 if i % 2 else 0.5), bend_at=0.02, bend_time=0.08, stacc=True)
gliss(CUE["slip"], ["G5", "E5", "D5", "B4", "A4", "G4", "E4"], step=0.045, vel0=0.5, vel1=0.45, pan0=0.3, pan1=0.5)
crash(CUE["crash"])

# 9. Is this my size? A warm, reflective close.
q0 = S["choice"]["start"]
pad([m("G3"), m("B3"), m("D4"), m("A4")], q0 - 0.1, CUE["pick"] + 0.2, att=0.8, rel=0.6, gain=0.85)
bass(m("G2"), q0, 1.6, 0.8)
bass(m("E2"), q0 + 1.0, 1.0, 0.7)
for i, nm in enumerate(["B4", "D5", "A4", "D5"]):
    k(q0 + 0.25 + i * BEAT, nm, 0.45, -0.3)
fl([(q0 + 0.3, "D5", 0.6, 0.75), (q0 + 0.95, "B4", 0.3, 0.7), (q0 + 1.3, "A4", 0.55, 0.7)], vib=0.9)
chime(m("A5"), CUE["wonder"], 0.5, -0.3)
k(CUE["turn"], "E5", 0.4, 0.2)
p0 = CUE["pick"]
pad([m("C3"), m("G3"), m("B3"), m("D4"), m("E4")], p0 - 0.05, p0 + 1.0, att=0.3, rel=0.6, gain=0.85)
pad([m("G2"), m("D3"), m("B3"), m("D4"), m("A4"), m("E5")], p0 + 0.95, DUR - 0.3, att=0.6, rel=1.0, gain=0.85)
bass(m("C2"), p0, 1.0, 0.8)
bass(m("G2"), p0 + 1.0, 1.2, 0.8)
gliss(p0, ["G4", "A4", "B4", "D5", "E5", "G5", "A5"], step=0.05, vel0=0.4, vel1=0.65)
chime(m("G6"), p0 + 0.12, 0.55, 0.45)
fl([(p0 + 0.5, "G5", 0.3, 0.7), (p0 + 0.8, "A5", 0.3, 0.75), (p0 + 1.1, "B5", 0.45, 0.8), (p0 + 1.6, "D5", 0.9, 0.6)], vib=0.9)
bowl(m("G5"), p0 + 1.0, 3.0, 0.5, 0.1)

synth.master(
    ROOT / "public" / "kimono" / "music.m4a",
    levels={"koto": 1.05, "flute": 0.95, "pad": 0.75, "drone": 0.6, "bells": 0.9, "drums": 0.8, "perc": 0.9, "bass": 0.5},
    sends={"koto": 0.3, "flute": 0.4, "pad": 0.35, "drone": 0.3, "bells": 0.55, "drums": 0.15, "perc": 0.18, "bass": 0.0},
    sections={k_: (v["start"], v["end"]) for k_, v in S.items()},
)
