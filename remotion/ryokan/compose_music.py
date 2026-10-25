"""Original score for the Ryōkan story, synthesized from scratch with numpy.

Every instrument is built here: a plucked koto (additive strings with
inharmonic, frequency-dependent decay), a breathy shakuhachi-style flute,
warm pads, a singing bowl, wind chimes, soft taiko and hand drum, a
woodblock and a shaker. The arrangement reads its scene boundaries and
story cues from timeline.json, the same file the animation uses, so the
music turns with the story.

    python3 remotion/ryokan/compose_music.py   # -> public/ryokan/music.m4a
"""

import json
import pathlib
import shutil
import subprocess
import wave

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
TL = json.loads((HERE / "timeline.json").read_text())
CUE = TL["cues"]

SR = 48000
DUR = float(TL["duration"])
N = int(DUR * SR)
BEAT = 60.0 / TL["bpm"]
B0 = TL["beatOffset"]
rng = np.random.default_rng(7)


def beat(b):
    return B0 + b * BEAT


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {"C": 0, "C#": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}


def m(name):
    """'F#4' -> MIDI number."""
    return 12 * (int(name[-1]) + 1) + NOTE[name[:-1]]


# ------------------------------------------------------------------ mixing

stems = {}


def stem(name):
    if name not in stems:
        stems[name] = np.zeros((2, N + SR * 4))
    return stems[name]


def put(name, x, t0, pan=0.0, gain=1.0):
    """Mix mono x into a stereo stem at time t0 with equal-power panning."""
    s = stem(name)
    i = int(round(t0 * SR))
    if i < 0:
        x = x[-i:]
        i = 0
    x = x[: s.shape[1] - i].copy()
    tail = min(len(x), int(0.03 * SR))
    x[len(x) - tail :] *= np.cos(np.linspace(0, np.pi / 2, tail)) ** 2
    a = (pan + 1) * np.pi / 4
    s[0, i : i + len(x)] += np.cos(a) * gain * x
    s[1, i : i + len(x)] += np.sin(a) * gain * x


def fft_filter(x, lo=None, hi=None, slope=1.0):
    """Gentle brickwall-free band filter in the frequency domain."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1)) ** (2 * slope))
    if hi:
        g *= 1 / (1 + (f / hi) ** (2 * slope))
    return np.fft.irfft(X * g, len(x))


def env_adsr(n, a, d, s, r, total=None):
    t = np.arange(n) / SR
    total = total if total is not None else n / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    rel_start = total - r
    e *= np.clip(1 - (t - rel_start) / max(r, 1e-4), 0, 1)
    return e


# ------------------------------------------------------------------ instruments

def koto(midi, vel=0.8, length=3.0, stacc=False, bend=0.0, bend_at=0.0, bend_time=0.2, bright=1.0):
    """Plucked koto string: inharmonic partials, faster decay up high, a
    slightly sharp attack that settles, and an optional oshide pitch bend."""
    f0 = hz(midi)
    tau1 = (0.18 if stacc else 1.9) * (330 / f0) ** 0.35
    length = min(length, tau1 * 7 + 0.05)
    n = int(length * SR)
    t = np.arange(n) / SR
    cents = 12 * np.exp(-t / 0.025)
    if bend:
        cents = cents + bend * 100 * np.clip((t - bend_at) / bend_time, 0, 1) ** 0.7
    ratio = 2 ** (cents / 1200)
    phase = 2 * np.pi * np.cumsum(f0 * ratio) / SR
    out = np.zeros(n)
    pos = 0.21
    for k in range(1, 28):
        fk = k * f0 * np.sqrt(1 + 0.00022 * k * k)
        if fk > 14000:
            break
        amp = abs(np.sin(k * np.pi * pos)) / k ** (1.15 - 0.25 * bright * vel)
        tau = tau1 / (1 + 0.42 * (k - 1) ** 1.2)
        out += amp * np.exp(-t / tau) * np.sin(phase * fk / f0 + rng.uniform(0, 6.28))
    pick = fft_filter(rng.standard_normal(n), lo=1800, hi=9000) * np.exp(-t / 0.004) * 0.25
    out = (out + pick) * np.clip(t / 0.0015, 0, 1)
    if stacc:
        out *= np.clip(1 - (t - 0.12) / 0.08, 0, 1)
    return out * vel * 0.22


def flute_phrase(notes, breath=0.10, vib=1.0, bright=1.0):
    """Shakuhachi-like voice. notes: [(t, midi, dur, dyn)] played legato with
    meri-style scoops, delayed vibrato, breath noise and soft attacks."""
    t_start = notes[0][0] - 0.05
    t_end = max(t + d for t, _, d, _ in notes) + 0.5
    n = int((t_end - t_start) * SR)
    t = np.arange(n) / SR + t_start
    pitch = np.full(n, float(notes[0][1]))
    amp = np.zeros(n)
    vib_amt = np.zeros(n)
    for i, (nt, mi, dur, dyn) in enumerate(notes):
        on = (t >= nt) & (t < nt + dur + 0.25)
        if i > 0:
            glide = np.clip((t - nt) / 0.07, 0, 1)
            prev = notes[i - 1][1]
            seg = t >= nt
            pitch[seg] = prev + (mi - prev) * glide[seg]
        scoop = -0.35 * np.exp(-np.clip(t - nt, 0, None) / 0.09)
        pitch = np.where(t >= nt, pitch + np.where(t < nt + 0.4, scoop, 0), pitch)
        local = t - nt
        a = np.clip(local / 0.11, 0, 1) ** 1.6
        a = a * (1 + 0.18 * np.exp(-((local - 0.13) / 0.06) ** 2))
        swell = 0.85 + 0.15 * np.clip(local / max(dur, 0.1), 0, 1)
        rel = np.clip(1 - (local - dur) / 0.16, 0, 1)
        e = np.where(on, a * swell * rel * dyn, 0)
        amp = np.maximum(amp, e)
        vib_amt = np.where(on, np.clip((local - 0.3) / 0.45, 0, 1) * vib, vib_amt)
    cents = vib_amt * 16 * np.sin(2 * np.pi * 5.3 * t + 0.4 * np.sin(2 * np.pi * 0.7 * t))
    f = hz(0) * 2 ** ((pitch + cents / 100) / 12)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.32 * bright * np.sin(2 * ph + 0.3) + 0.11 * bright * np.sin(3 * ph + 1.1) + 0.04 * np.sin(4 * ph)
    noise = fft_filter(rng.standard_normal(n), lo=700, hi=4200)
    noise /= np.std(noise) + 1e-9
    breath_sig = noise * (0.6 + 0.4 * np.sin(ph)) * breath
    chiff = np.zeros(n)
    for nt, _, _, dyn in notes:
        local = t - nt
        chiff += fft_filter(rng.standard_normal(n), lo=1500, hi=6000) * np.exp(-np.clip(local, 0, None) / 0.025) * (local >= 0) * 0.08 * dyn
    sig = (tone * 0.9 + breath_sig) * amp + chiff
    return sig * 0.16, t_start


def pad(midis, t0, t1, att=1.0, rel=1.0, gain=1.0, bright=1.0, name="pad"):
    """Warm additive pad: three detuned voices per note, spread in stereo."""
    length = t1 - t0 + rel
    n = int(length * SR)
    t = np.arange(n) / SR
    e = env_adsr(n, att, 1.0, 1.0, rel, total=length) ** 1.5
    for mi in midis:
        f0 = hz(mi)
        for det, pan in ((-7, -0.6), (0, 0.0), (7, 0.6)):
            f = f0 * 2 ** (det / 1200) * (1 + 0.0015 * np.sin(2 * np.pi * (0.23 + det * 0.01) * t))
            ph = 2 * np.pi * np.cumsum(f) / SR + rng.uniform(0, 6.28)
            v = np.zeros(n)
            for k in range(1, 9):
                if k * f0 > 7000:
                    break
                v += np.sin(k * ph) / k ** (2.1 - 0.5 * bright)
            put(name, v * e * 0.045 / np.sqrt(len(midis)), t0, pan, gain)


def bowl(midi, t0, length=6.0, gain=1.0, pan=0.0):
    """Singing bowl / rin: beating inharmonic partials with long decays."""
    f0 = hz(midi)
    n = int(length * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for ratio, a, tau in ((1, 1.0, 4.5), (2.71, 0.55, 2.8), (5.15, 0.3, 1.5), (8.2, 0.12, 0.8)):
        for beat_hz in (0, 1.3 * ratio):
            out += a * 0.5 * np.exp(-t / tau) * np.sin(2 * np.pi * (f0 * ratio + beat_hz) * t)
    strike = fft_filter(rng.standard_normal(n), lo=2000, hi=8000) * np.exp(-t / 0.006) * 0.3
    put("bells", (out + strike) * np.clip(t / 0.002, 0, 1) * 0.14, t0, pan, gain)


def chime(midi, t0, gain=1.0, pan=0.0):
    f0 = hz(midi)
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    out = sum(a * np.exp(-t / tau) * np.sin(2 * np.pi * f0 * r * t) for r, a, tau in ((1, 1, 1.3), (2.76, 0.35, 0.6), (5.4, 0.15, 0.3)))
    put("bells", out * np.clip(t / 0.001, 0, 1) * 0.07, t0, pan, gain)


def taiko(t0, gain=1.0, f0=72):
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    f = f0 * (1 + 1.1 * np.exp(-t / 0.025))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.32)
    skin = fft_filter(rng.standard_normal(n), hi=900) * np.exp(-t / 0.03) * 0.5
    put("drums", (body + skin) * 0.34, t0, 0.0, gain)


def pon(t0, gain=1.0, f0=260, pan=0.1, rise=False):
    """Kotsuzumi-style hand drum."""
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    bend = (1 + 0.25 * (1 - np.exp(-t / 0.06))) if rise else (1 + 0.3 * np.exp(-t / 0.04))
    ph = 2 * np.pi * np.cumsum(f0 * bend) / SR
    out = (np.sin(ph) + 0.35 * np.sin(1.52 * ph)) * np.exp(-t / 0.16)
    out += fft_filter(rng.standard_normal(n), lo=400, hi=3000) * np.exp(-t / 0.008) * 0.3
    put("drums", out * 0.16, t0, pan, gain)


def woodblock(t0, gain=1.0, pan=0.45, f0=880):
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    out = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.035) + 0.5 * np.sin(2 * np.pi * f0 * 1.63 * t) * np.exp(-t / 0.02)
    put("perc", out * np.clip(t / 0.0007, 0, 1) * 0.09, t0, pan, gain)


def shaker(t0, gain=1.0, pan=-0.3):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    out = fft_filter(rng.standard_normal(n), lo=5000, hi=12000) * np.clip(t / 0.01, 0, 1) * np.exp(-t / 0.03)
    put("perc", out * 0.05, t0, pan, gain)


def bass(midi, t0, length, gain=1.0):
    n = int((length + 0.6) * SR)
    t = np.arange(n) / SR
    f0 = hz(midi)
    ph = 2 * np.pi * f0 * t
    out = (np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)) * env_adsr(n, 0.03, 1.4, 0.55, 0.5, total=length + 0.6)
    put("bass", out * 0.2, t0, 0.0, gain)


def whoosh(t0, length=0.7, gain=1.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n)
    bands = 8
    for i in range(bands):
        lo = 300 * 2 ** (i * 0.6)
        band = fft_filter(x, lo=lo, hi=lo * 1.6)
        centre = (i + 0.5) / bands * length
        out += band * np.exp(-((t - centre) / (length / bands * 1.4)) ** 2)
    pan_curve = np.linspace(-0.2, 0.9, n)
    a = (pan_curve + 1) * np.pi / 4
    s = stem("perc")
    i0 = int(t0 * SR)
    s[0, i0 : i0 + n] += np.cos(a) * out * 0.05 * gain
    s[1, i0 : i0 + n] += np.sin(a) * out * 0.05 * gain


def k(t0, name, vel=0.8, pan=-0.2, **kw):
    put("koto", koto(m(name), vel, **kw), t0, pan)


def gliss(t0, names, step=0.045, vel0=0.4, vel1=0.85, pan0=-0.4, pan1=0.3):
    for i, nm in enumerate(names):
        x = i / max(1, len(names) - 1)
        k(t0 + i * step, nm, vel0 + (vel1 - vel0) * x, pan0 + (pan1 - pan0) * x)


def fl(notes, pan=0.22, gain=1.0, **kw):
    sig, t0 = flute_phrase([(t, m(nm), d, dyn) for t, nm, d, dyn in notes], **kw)
    put("flute", sig, t0, pan, gain)


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

def reverb_ir(seconds=2.6, rt60=2.3):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.zeros((2, n))
    for ch in range(2):
        noise = rng.standard_normal(n)
        for lo, hi, rt in ((None, 600, rt60 * 1.15), (600, 2500, rt60), (2500, 6000, rt60 * 0.65), (6000, None, rt60 * 0.35)):
            ir[ch] += fft_filter(noise, lo=lo, hi=hi) * np.exp(-6.9 * t / rt)
        ir[ch] *= np.clip((t - 0.018) / 0.01, 0, 1)
        for d, g in ((0.011, 0.5), (0.019, 0.35), (0.027, 0.3), (0.041, 0.22)):
            ir[ch, int((d + 0.003 * ch) * SR)] += g
        ir[ch] /= np.sqrt(np.sum(ir[ch] ** 2))
    return ir


def convolve(x, ir):
    L = x.shape[1] + ir.shape[1]
    nfft = 1 << (L - 1).bit_length()
    X = np.fft.rfft(x, nfft)
    H = np.fft.rfft(ir, nfft)
    return np.fft.irfft(X * H, nfft)[:, : x.shape[1]]


levels = {"koto": 1.05, "flute": 0.95, "pad": 0.75, "drone": 0.6, "bells": 0.9, "drums": 0.8, "perc": 0.9, "bass": 0.5}
sends = {"koto": 0.32, "flute": 0.42, "pad": 0.35, "drone": 0.3, "bells": 0.55, "drums": 0.15, "perc": 0.18, "bass": 0.0}
dry = sum(stems[s] * levels[s] for s in stems)
wet_in = sum(stems[s] * levels[s] * sends[s] for s in stems)
wet = convolve(wet_in, reverb_ir()) * 0.9
mix = (dry + wet)[:, :N]
mix = np.stack([fft_filter(ch, lo=32, slope=2) for ch in mix])

# Gentle bus compression for glue, then a soft limiter.
win = int(0.05 * SR)
power = np.convolve(np.mean(mix**2, axis=0), np.ones(win) / win, mode="same")
level = np.sqrt(power + 1e-12)
thr = 0.12
gain = np.where(level > thr, (thr / level) ** (1 - 1 / 2.2), 1.0)
smooth = int(0.08 * SR)
gain = np.convolve(gain, np.ones(smooth) / smooth, mode="same")
mix *= gain
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.1) / np.tanh(1.1)

t = np.arange(N) / SR
mix *= np.clip(t / 0.02, 0, 1) * np.clip((DUR - t) / 0.7, 0, 1) ** 1.5
mix *= 0.85 / np.max(np.abs(mix))

out_dir = ROOT / "public" / "ryokan"
out_dir.mkdir(parents=True, exist_ok=True)
wav_path = out_dir / "music.wav"
with wave.open(str(wav_path), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype("<i2").tobytes())

for name, (a, b) in ((k_, (v["start"], v["end"])) for k_, v in S.items()):
    seg = mix[:, int(a * SR) : int(b * SR)]
    print(f"{name:10s} rms {20 * np.log10(np.sqrt(np.mean(seg**2)) + 1e-9):6.1f} dBFS")

if shutil.which("ffmpeg"):
    m4a = out_dir / "music.m4a"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav_path), "-c:a", "aac", "-b:a", "192k", str(m4a)], check=True)
    wav_path.unlink()
    print("wrote", m4a)
else:
    print("wrote", wav_path, "(install ffmpeg to encode music.m4a)")
