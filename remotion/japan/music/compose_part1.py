"""Original score for "Japan – Part 1".

Everything is synthesised from scratch with numpy/scipy: a koto (plucked
additive string), a breathy shakuhachi-style flute, a soft string pad, taiko
and shime-daiko drums, bronze bells, and a few musical sound-effects.

The cue sheet follows the narration (video time, narration starts at 3.0 s):

  0.0  title          gentle koto + flute, D "In" scale
  3.0  long ago       mysterious, rippling koto, pad Dm -> Eb
  8.0  mountains      low ostinato builds, heartbeat taiko, riser
 12.9  eruption       taiko groove, rumble, tsunami swell + crash, quake
 18.3  "nope"         comic tiptoe plucks, sliding "nope" sting
 21.8  civilization   key lifts to G major, rising flute, bells
 25.0  Jomon          light walking groove, Jomon theme (low flute)
 36.0  Yayoi          brighter D major, lilting boat rhythm, Yayoi theme
 40.5  rice / metal   rising arpeggios, iron clank, bronze bell
 44.9  "what happened?" suspense: ticking, unresolved question
 46.8  standoff       tense drum roll -> warm relief chord
 49.0  one people     both themes in counterpoint, landing together on G
 53.0  again & again  motif repeats, final cadence, outro

Run from the repo root:
    python3 remotion/japan/music/compose_part1.py [--narration path.wav]
Writes public/japan/music_p1.wav (ducked under the narration if given).
"""
import argparse
import os

import numpy as np
from scipy import signal
import soundfile as sf

SR = 44100
DUR = 60.0
N = int(SR * DUR)
BEAT = 0.625  # 96 bpm
NARRATION_OFFSET = 3.0
rng = np.random.default_rng(1234)

NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6,
        "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def hz(name):
    """'D4' -> frequency."""
    p, o = name[:-1], int(name[-1])
    midi = 12 * (o + 1) + NOTE[p]
    return 440.0 * 2 ** ((midi - 69) / 12)


# ----------------------------------------------------------------- buses
dry = np.zeros((N, 2))
send = np.zeros((N, 2))


def place(sig, t, pan=0.0, gain=1.0, rev=0.25):
    """Mix a mono or stereo signal in at time t (s)."""
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)], -1)
    i0 = int(t * SR)
    if i0 >= N:
        return
    if i0 < 0:
        sig = sig[-i0:]
        i0 = 0
    n = min(len(sig), N - i0)
    dry[i0:i0 + n] += sig[:n] * gain
    send[i0:i0 + n] += sig[:n] * gain * rev


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, btype="low", fs=SR, output="sos"), x)


def hp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, btype="high", fs=SR, output="sos"), x)


# ----------------------------------------------------------------- instruments
def koto(f0, dur=0.6, vel=0.6, bend=0.0, slide=0.0, ring=1.0):
    """Plucked silk string: additive partials with frequency-dependent decay,
    a bright pluck transient and the koto's characteristic small pitch bend."""
    length = dur + 1.8 * ring
    t = tt(length)
    # pitch contour: optional press-bend at the onset, optional slide over the note
    semis = bend * (1 - np.exp(-t / 0.07)) + slide * np.clip(t / max(dur, 0.05), 0, 1) ** 1.5
    inst = f0 * 2 ** (semis / 12)
    phase = 2 * np.pi * np.cumsum(inst) / SR
    out = np.zeros_like(t)
    reg = np.clip(220 / f0, 0.45, 2.2)  # low notes ring longer
    for k in range(1, 18):
        if f0 * k > 15000:
            break
        amp = (1 / k ** 0.85) * abs(np.sin(np.pi * k * 0.19)) + 0.02
        tau = 1.4 * reg * ring / (1 + 0.32 * k ** 1.35)
        out += amp * np.sin(phase * k * (1 + 0.00035 * k * k)) * np.exp(-t / tau)
    att = 1 - np.exp(-t / 0.0015)
    pluck = bp(rng.standard_normal(len(t)), 1800, 6500) * np.exp(-t / 0.012) * 0.35
    sig = (out * att + pluck) * vel * 0.32
    # damp the string after `dur`
    rel = np.ones_like(t)
    i = int(dur * SR)
    rel[i:] = np.exp(-(t[i:] - dur) / (0.18 * ring + 0.05))
    return sig * rel


def flute(f0, dur, vel=0.5, vib=1.0, scoop=True, breath=1.0):
    """Shakuhachi-flavoured flute: soft harmonics, breath noise, scoop + vibrato."""
    length = dur + 0.35
    t = tt(length)
    cents = np.zeros_like(t)
    if scoop:
        cents += -45 * np.exp(-t / 0.06)
    vdepth = 18 * vib * np.clip((t - 0.3) / 0.5, 0, 1)
    cents += vdepth * np.sin(2 * np.pi * 5.1 * t + 0.4 * np.sin(2 * np.pi * 0.7 * t))
    inst = f0 * 2 ** (cents / 1200)
    ph = 2 * np.pi * np.cumsum(inst) / SR
    tone = np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.07 * np.sin(3 * ph) + 0.025 * np.sin(4 * ph)
    env = np.clip(t / 0.09, 0, 1) ** 1.5
    env *= np.where(t < dur, 1.0, np.exp(-(t - dur) / 0.09))
    env *= 1 + 0.12 * np.exp(-t / 0.15)  # small bloom at the attack
    noise = rng.standard_normal(len(t))
    air = bp(noise, min(f0 * 1.5, 9000), min(f0 * 4.5, 16000)) * 0.55 + hp(noise, 3500) * 0.08
    chiff = bp(noise, 1200, 5000) * np.exp(-t / 0.04) * 0.6
    sig = (tone * env + air * env * 0.35 * breath + chiff * breath * 0.5) * vel * 0.28
    return sig


def pad(notes, dur, vel=0.4, attack=0.8, release=1.2, bright=1.0, width=0.6):
    """Warm string-section pad: detuned soft saws, slow attack, stereo spread."""
    length = dur + release
    t = tt(length)
    env = np.clip(t / attack, 0, 1)
    env = 0.5 - 0.5 * np.cos(np.pi * env)
    env *= np.where(t < dur, 1.0, 0.5 + 0.5 * np.cos(np.pi * np.clip((t - dur) / release, 0, 1)))
    L = np.zeros_like(t)
    R = np.zeros_like(t)
    roll = 1.9 / bright
    for ni, name in enumerate(notes):
        f0 = hz(name) if isinstance(name, str) else name
        for vi, det in enumerate((-8, 0, 7)):
            f = f0 * 2 ** (det / 1200)
            drift = 1 + 0.0015 * np.sin(2 * np.pi * (0.13 + 0.05 * vi) * t + ni)
            ph = 2 * np.pi * np.cumsum(f * drift) / SR + rng.random() * 6.28
            v = np.zeros_like(t)
            for k in range(1, 14):
                if f * k > 9000:
                    break
                v += np.sin(ph * k) / k ** roll
            pan = (vi - 1) * width * 0.8 + (ni - len(notes) / 2) * 0.08
            a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
            L += v * np.cos(a)
            R += v * np.sin(a)
    sc = vel * 0.1 / np.sqrt(len(notes))
    return np.stack([L * env * sc, R * env * sc], -1)


def bass(f0, dur, vel=0.5, pluck=True):
    length = dur + 0.25
    t = tt(length)
    ph = 2 * np.pi * f0 * t
    tone = np.sin(ph) + 0.28 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    if pluck:
        env = np.clip(t / 0.006, 0, 1) * (0.55 + 0.45 * np.exp(-t / 0.22))
    else:
        env = np.clip(t / 0.08, 0, 1)
    env *= np.where(t < dur, 1.0, np.exp(-(t - dur) / 0.06))
    return tone * env * vel * 0.32


def taiko(vel=0.7, size=1.0):
    t = tt(1.6)
    f = 52 * size + 95 * np.exp(-t / 0.045)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / (0.42 * size))
    body += 0.3 * np.sin(1.6 * ph) * np.exp(-t / 0.18)
    skin = lp(rng.standard_normal(len(t)), 1400) * np.exp(-t / 0.028) * 0.9
    return np.tanh((body + skin) * 1.4) * vel * 0.55


def shime(vel=0.4):
    t = tt(0.35)
    f = 330 + 120 * np.exp(-t / 0.01)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / 0.07) + bp(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t / 0.012) * 0.5
    return s * vel * 0.3


def shaker(vel=0.2):
    t = tt(0.09)
    return hp(rng.standard_normal(len(t)), 5000) * (np.clip(t / 0.01, 0, 1) * np.exp(-t / 0.025)) * vel * 0.25


def woodblock(f0=900, vel=0.4):
    t = tt(0.25)
    s = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.035) + 0.5 * np.sin(2 * np.pi * f0 * 2.3 * t) * np.exp(-t / 0.02)
    return s * vel * 0.35


def glock(f0, vel=0.35):
    t = tt(2.2)
    s = (np.sin(2 * np.pi * f0 * t) * np.exp(-t / 1.1)
         + 0.32 * np.sin(2 * np.pi * f0 * 2.76 * t) * np.exp(-t / 0.35)
         + 0.1 * np.sin(2 * np.pi * f0 * 5.4 * t) * np.exp(-t / 0.12))
    s *= np.clip(t / 0.001, 0, 1)
    return s * vel * 0.3


def bell(f0, vel=0.5, length=5.0):
    """Bronze bell: inharmonic partials with slow beating."""
    t = tt(length)
    ratios = [0.5, 1.0, 1.19, 1.56, 2.0, 2.51, 3.01, 4.1]
    amps = [0.45, 1.0, 0.55, 0.45, 0.4, 0.22, 0.15, 0.08]
    taus = [3.6, 2.8, 2.2, 1.7, 1.4, 1.0, 0.8, 0.5]
    s = np.zeros_like(t)
    for r, a, tau in zip(ratios, amps, taus):
        for det in (-0.6, 0.6):
            s += a * np.sin(2 * np.pi * (f0 * r + det * r) * t + rng.random() * 6) * np.exp(-t / tau)
    s += bp(rng.standard_normal(len(t)), 2000, 7000) * np.exp(-t / 0.01) * 0.6
    return s * vel * 0.14


def anvil(vel=0.5):
    t = tt(0.9)
    s = np.zeros_like(t)
    for f, a, tau in [(1180, 1, 0.3), (2950, 0.7, 0.18), (4260, 0.5, 0.12), (5780, 0.35, 0.08), (640, 0.4, 0.2)]:
        s += a * np.sin(2 * np.pi * f * t) * np.exp(-t / tau)
    s += hp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.008)
    return s * vel * 0.18


def noise_swell(dur, vel=0.4, lo=300, hi=6000, shape=2.0):
    """Riser / wave swell: filtered noise growing toward the end."""
    t = tt(dur)
    n = rng.standard_normal(len(t))
    a = bp(n, lo, hi)
    b = hp(n, hi * 0.6)
    p = (t / dur) ** shape
    s = a * p * (1 - p * 0.3) + b * p ** 2 * 0.4
    s *= np.where(t > dur - 0.03, np.clip((dur - t) / 0.03, 0, 1), 1)
    return s * vel * 0.4


def crash(vel=0.5, length=2.5):
    t = tt(length)
    n = rng.standard_normal(len(t))
    s = hp(n, 3500) * np.exp(-t / 0.7) * 0.8 + bp(n, 600, 3000) * np.exp(-t / 0.2) * 0.6
    return s * np.clip(t / 0.002, 0, 1) * vel * 0.35


def wave_crash(vel=0.6):
    t = tt(2.5)
    n = rng.standard_normal(len(t))
    s = lp(n, 1600) * np.exp(-t / 0.5) + hp(n, 2500) * np.exp(-t / 0.25) * 0.5
    return s * np.clip(t / 0.01, 0, 1) * vel * 0.5


def rumble(dur, vel=0.4):
    t = tt(dur)
    brown = np.cumsum(rng.standard_normal(len(t)))
    brown = hp(brown, 22)
    brown = lp(brown, 140, 4)
    brown /= np.max(np.abs(brown)) + 1e-9
    mod = 0.7 + 0.3 * np.sin(2 * np.pi * 3.3 * t) * np.sin(2 * np.pi * 0.7 * t)
    sub = np.sin(2 * np.pi * 41 * t) * 0.35
    env = np.clip(t / 0.3, 0, 1) * np.clip((dur - t) / 0.6, 0, 1)
    return (brown * mod + sub) * env * vel * 0.8


def swish(vel=0.12):
    """Soft page-turn swish for scene changes."""
    t = tt(0.45)
    n = rng.standard_normal(len(t))
    env = np.sin(np.pi * np.clip(t / 0.45, 0, 1)) ** 2
    return bp(n, 1500, 7000) * env * vel


# ----------------------------------------------------------------- helpers
def arpeggio(start, end, notes, step, vel=0.3, pan=0.0, dur=0.5, accent=4, ring=0.8, rev=0.3):
    t, i = start, 0
    while t < end - 1e-6:
        v = vel * (1.15 if i % accent == 0 else 0.9)
        place(koto(hz(notes[i % len(notes)]), dur, v, ring=ring), t, pan + 0.15 * np.sin(i), rev=rev)
        t += step
        i += 1


def melody(start, phrase, inst="flute", vel=0.45, pan=0.1, rev=0.35, beat=BEAT, **kw):
    """phrase: list of (note or None, beats)."""
    t = start
    for note, beats in phrase:
        d = beats * beat
        if note:
            if inst == "flute":
                place(flute(hz(note), d * 0.97, vel, **kw), t, pan, rev=rev)
            else:
                place(koto(hz(note), d, vel, **kw), t, pan, rev=rev)
        t += d
    return t


def chord_track(chords, vel=0.35, attack=0.6, release=1.0, bright=1.0, rev=0.45):
    for t0, t1, notes in chords:
        place(pad(notes, t1 - t0, vel, attack=attack, release=release, bright=bright), t0, rev=rev)


# ----------------------------------------------------------------- the score
def score():
    # A. title (0 - 3.05): D In scale (D Eb G A Bb)
    place(taiko(0.45, 1.1), 0.05, rev=0.6)
    place(pad(["D3", "A3", "D4"], 3.2, 0.45, attack=1.6, release=1.2), 0.0, rev=0.5)
    for i, n in enumerate(["D4", "G4", "A4", "Bb4", "D5", "Eb5", "G5"]):
        place(koto(hz(n), 0.9, 0.36 + i * 0.04), 0.22 + i * 0.11, -0.4 + i * 0.12, rev=0.4)
    melody(1.05, [("A4", 0.8), ("Bb4", 0.4), ("A4", 0.4), ("G4", 0.6), ("A4", 2.6)], vel=0.42)
    place(glock(hz("D6"), 0.25), 2.25, 0.5, rev=0.6)
    place(noise_swell(0.8, 0.12, 800, 7000), 2.3, rev=0.4)

    # B. "Long ago..." (3.05 - 8.05): mysterious
    chord_track([(3.05, 5.6, ["D3", "A3", "D4"]), (5.55, 8.2, ["Eb3", "G3", "Bb3", "D4"])], vel=0.38, attack=1.0)
    place(bass(hz("D2"), 5.0, 0.35, pluck=False), 3.05, rev=0.2)
    arpeggio(3.05, 5.55, ["D4", "A4", "D5", "A4", "Bb4", "A4", "D5", "A4"], BEAT / 2, 0.24, -0.2)
    arpeggio(5.55, 8.05, ["Eb4", "Bb4", "D5", "Bb4", "G4", "Bb4", "D5", "Bb4"], BEAT / 2, 0.24, -0.2)
    melody(3.75, [("D5", 1.6), ("Eb5", 0.6), ("D5", 0.6), ("Bb4", 1.0), ("A4", 2.6)], vel=0.4)
    place(glock(hz("A5"), 0.3), 5.76, 0.4, rev=0.6)
    place(glock(hz("D6"), 0.3), 5.88, 0.5, rev=0.6)
    for k, n in enumerate(["A4", "Bb4", "D5", "Eb5"]):  # the islands bounce
        place(koto(hz(n), 0.4, 0.5, bend=0.4), 6.6 + k * 0.167, 0.3, rev=0.35)

    # C. mountains & volcanoes (8.05 - 12.85): building
    place(swish(), 7.85)
    chord_track([(8.05, 10.6, ["G2", "D3", "G3", "Bb3"]), (10.55, 12.95, ["Eb3", "G3", "Bb3", "Eb4"])], vel=0.42, attack=0.7)
    t, i = 8.05, 0
    while t < 12.8:
        v = 0.18 + 0.32 * (t - 8.05) / 4.8
        n = ["D3", "D3", "A3", "D3", "D3", "D3", "Bb3", "D3"][i % 8]
        place(koto(hz(n), 0.12, v, ring=0.4), t, -0.25, rev=0.2)
        t += BEAT / 4
        i += 1
    for k in range(int((12.85 - 9.3) / BEAT) + 1):
        tb = 9.3 + k * BEAT
        if k % 2 == 0:
            place(taiko(0.25 + 0.3 * k / 6, 0.9), tb, rev=0.35)
    for k, n in enumerate(["G4", "A4", "Bb4"]):  # mountains pop
        place(koto(hz(n), 0.3, 0.42, bend=0.6), 9.39 + k * 0.167, 0.2, rev=0.3)
    place(taiko(0.5, 1.2), 10.75, rev=0.4)
    place(taiko(0.45, 1.0), 10.98, rev=0.4)
    melody(9.6, [("D5", 1.0), ("Eb5", 1.0), ("G5", 1.5), ("A5", 1.0), ("Bb5", 2.5)], vel=0.33, vib=1.3)
    place(noise_swell(1.05, 0.45, 300, 5000, 2.5), 11.8, rev=0.3)

    # D. disaster (12.85 - 18.0)
    place(taiko(1.0, 1.25), 12.85, rev=0.5)
    place(bell(hz("D3"), 0.55, 4.5), 12.85, rev=0.5)
    place(crash(0.45), 12.85, 0.2, rev=0.4)
    place(rumble(5.4, 0.32), 12.85, rev=0.1)
    place(pad(["D2", "A2", "D3", "Eb3", "A3"], 5.0, 0.5, attack=0.2, release=0.8, bright=1.7), 12.85, rev=0.4)
    groove = [1.0, 0, 0.6, 0.8, 0, 0.7, 0, 0.6]
    t, i = 12.85, 0
    while t < 17.8:
        g = groove[i % 8]
        if g:
            place(taiko(0.55 * g, 0.95), t, (-0.2 if i % 2 else 0.2), rev=0.35)
        place(shime(0.22 + 0.1 * (i % 2 == 0)), t, 0.35, rev=0.2)
        t += BEAT / 2
        i += 1
    t, i = 13.4, 0
    while t < 15.2:  # koto tremolo
        place(koto(hz("D5" if i % 2 else "Eb5"), 0.07, 0.12 + 0.18 * (t - 13.4) / 1.8, ring=0.3), t, -0.3, rev=0.3)
        t += 0.078
        i += 1
    place(noise_swell(1.3, 0.55, 150, 2500, 1.6), 13.98, -0.3, rev=0.3)  # wave rising
    place(wave_crash(0.75), 15.28, -0.2, rev=0.5)
    place(taiko(0.95, 1.2), 15.28, rev=0.5)
    place(crash(0.35), 15.28, 0.3, rev=0.4)
    place(rumble(1.9, 0.5), 16.1, rev=0.1)  # earthquake
    t, k = 16.16, 0
    while t < 17.75:  # rolling drums
        place(taiko(0.25 + 0.35 * (k % 4 == 0), 0.85 + 0.1 * (k % 3)), t, (-0.3 if k % 2 else 0.3), rev=0.3)
        t += BEAT / 4
        k += 1
    place(taiko(1.0, 1.3), 17.85, rev=0.6)
    place(bell(hz("D3"), 0.35, 3.0), 17.85, rev=0.5)

    # E. "Nobody could imagine..." (18.3 - 21.7): comic tiptoe
    tip = ["D4", None, "A3", None, "D4", None, "Eb4", None]
    t, i = 18.42, 0
    while t < 20.35:
        n = tip[i % 8]
        if n:
            place(koto(hz(n), 0.08, 0.36, ring=0.35), t, -0.1, rev=0.25)
        if i % 4 == 0:
            place(bass(hz("D2"), 0.15, 0.3), t, rev=0.1)
        t += BEAT / 2
        i += 1
    place(glock(hz("A5"), 0.22), 19.7, 0.4, rev=0.5)
    place(glock(hz("Bb5"), 0.22), 19.86, 0.4, rev=0.5)
    place(koto(hz("D5"), 0.45, 0.6, slide=-6, ring=0.7), 20.41, 0.0, rev=0.3)  # "nope."
    place(woodblock(700, 0.35), 20.41, 0.2)
    for k, n in enumerate(["D5", "Bb4", "A4", "G4", "Eb4", "D4"]):  # paddling away
        place(koto(hz(n), 0.08, 0.4, ring=0.4), 21.0 + k * 0.08, -0.4 + k * 0.1, rev=0.25)

    # F. civilization begins (21.77 - 24.95): lift to G major
    place(noise_swell(0.7, 0.14, 1500, 9000, 3), 21.08, rev=0.5)
    place(taiko(0.55, 1.15), 21.77, rev=0.6)
    chord_track([(21.77, 23.05, ["G2", "D3", "G3", "B3", "D4"]), (23.02, 24.3, ["E3", "B3", "E4", "G4"]),
                 (24.27, 25.05, ["C3", "G3", "C4", "E4", "G4"])], vel=0.45, attack=0.5, bright=1.2)
    for t0, n, d in [(21.77, "G2", 1.25), (23.02, "E2", 1.25), (24.27, "C2", 0.7)]:
        place(bass(hz(n), d, 0.4, pluck=False), t0)
    arpeggio(21.77, 23.02, ["G4", "B4", "D5", "B4"], BEAT / 2, 0.22, 0.25)
    arpeggio(23.02, 24.27, ["E4", "G4", "B4", "G4"], BEAT / 2, 0.22, 0.25)
    arpeggio(24.27, 24.95, ["C4", "E4", "G4", "E4"], BEAT / 2, 0.22, 0.25)
    for t0, n, d in [(21.9, "D5", 0.4), (22.3, "E5", 0.3), (22.6, "G5", 0.8), (23.4, "A5", 0.4),
                     (23.8, "B5", 0.3), (24.1, "D6", 1.0)]:
        place(flute(hz(n), d, 0.42, vib=1.0), t0, 0.1, rev=0.4)
    for k, n in enumerate(["G5", "B5", "D6"]):
        place(glock(hz(n), 0.3), 23.39 + k * 0.08, 0.5, rev=0.6)
    place(glock(hz("D6"), 0.3), 24.11, 0.4, rev=0.6)
    place(glock(hz("G6"), 0.25), 24.19, 0.5, rev=0.6)

    # G. Jomon: walking groove in G (24.95 - 36.0)
    place(swish(), 24.75)
    bars = [(24.95, "G"), (27.45, "Em"), (29.95, "C"), (32.45, "Am"), (33.7, "D"), (34.95, "G")]
    harm = {
        "G": (["G2", "D3", "G3", "B3", "D4"], ["G3", "D4", "G4", "D4", "B3", "D4", "G4", "D4"], "G2", "D3"),
        "Em": (["E2", "B2", "E3", "G3", "B3"], ["E3", "B3", "E4", "B3", "G3", "B3", "E4", "B3"], "E2", "B2"),
        "C": (["C3", "G3", "C4", "E4", "G4"], ["C4", "G4", "C5", "G4", "E4", "G4", "C5", "G4"], "C2", "G2"),
        "Am": (["A2", "E3", "A3", "C4", "E4"], ["A3", "E4", "A4", "E4", "C4", "E4", "A4", "E4"], "A2", "E2"),
        "D": (["D3", "A3", "D4", "F#4", "A4"], ["D4", "A4", "D5", "A4", "F#4", "A4", "D5", "A4"], "D2", "A2"),
    }
    ends = [b[0] for b in bars[1:]] + [36.0]
    for (t0, name), t1 in zip(bars, ends):
        chord, arp, root, fifth = harm[name]
        place(pad(chord, t1 - t0, 0.3, attack=0.4, release=0.6), t0, rev=0.45)
        arpeggio(t0, t1, arp, BEAT / 2, 0.2, -0.3, dur=0.3)
        b = 0
        while t0 + b * BEAT < t1 - 0.05:
            tb = t0 + b * BEAT
            walking = 29.5 <= tb < 32.45
            if walking:
                n = [root, fifth, root, fifth][b % 4]
                place(bass(hz(n), BEAT * 0.45, 0.4), tb)
            elif b % 2 == 0:
                place(bass(hz(root if b % 4 == 0 else fifth), BEAT * 1.6, 0.38), tb)
            if tb < 32.45:
                if b % 2 == 0:
                    place(taiko(0.22, 1.35), tb, rev=0.3)
                place(shaker(0.22), tb + BEAT / 2, 0.4)
                place(shaker(0.12), tb, 0.4)
            elif b % 4 == 0:
                place(taiko(0.16, 1.4), tb, rev=0.3)
            b += 1
    # Jomon theme (low, earthy)
    melody(25.26, [("D5", 1), ("B4", 0.5), ("A4", 0.5), ("G4", 1), ("E4", 1),
                   ("G4", 0.5), ("A4", 0.5), ("B4", 1), ("A4", 2)], vel=0.42, pan=-0.05)
    # walking counter-line (koto, staccato)
    melody(29.95, [("G4", 0.5), ("B4", 0.5), ("D5", 0.5), ("B4", 0.5), ("C5", 0.5), ("B4", 0.5), ("A4", 0.5), ("G4", 0.5)],
           inst="koto", vel=0.32, pan=0.3, ring=0.4)
    melody(31.2, [("E4", 0.5), ("G4", 0.5), ("A4", 0.5), ("G4", 0.5)], inst="koto", vel=0.32, pan=0.3, ring=0.4)
    place(woodblock(800, 0.25), 31.49, 0.3)
    place(woodblock(950, 0.25), 31.85, 0.3)
    # village: settled, warm
    melody(32.6, [("E5", 1), ("D5", 0.5), ("B4", 0.5), ("A4", 1), ("B4", 0.5), ("A4", 0.5), ("G4", 3.2)], vel=0.36)
    place(glock(hz("G5"), 0.25), 34.99, 0.4, rev=0.6)
    place(glock(hz("D6"), 0.2), 35.09, 0.5, rev=0.6)
    t = 35.4
    while t < 35.92:  # small roll into the Yayoi section
        place(shime(0.15 + 0.4 * (t - 35.4)), t, 0.2)
        t += BEAT / 4

    # H. Yayoi: bright D major pentatonic, lilting boat rhythm (35.95 - 44.9)
    place(taiko(0.6, 1.1), 35.95, rev=0.5)
    place(crash(0.22), 35.95, 0.3, rev=0.5)
    ybars = [(35.95, "D"), (38.45, "Bm"), (40.95, "G"), (43.45, "A")]
    yharm = {
        "D": (["D3", "A3", "D4", "F#4", "A4"], ["D4", "F#4", "A4", "D5"], "D2"),
        "Bm": (["B2", "F#3", "B3", "D4", "F#4"], ["B3", "D4", "F#4", "B4"], "B1"),
        "G": (["G2", "D3", "G3", "B3", "D4"], ["G4", "B4", "D5", "G5"], "G2"),
        "A": (["A2", "E3", "A3", "C#4", "E4"], ["A4", "C#5", "E5", "A5"], "A2"),
    }
    yend = [b[0] for b in ybars[1:]] + [44.9]
    for (t0, name), t1 in zip(ybars, yend):
        chord, arp, root = yharm[name]
        place(pad(chord, t1 - t0, 0.34, attack=0.35, release=0.5, bright=1.25), t0, rev=0.45)
        rising = t0 >= 40.9
        arpeggio(t0, t1, arp if not rising else arp + arp[::-1][1:-1], BEAT / (4 if rising else 2), 0.2, 0.25, dur=0.3)
        bb = 0
        while t0 + bb * BEAT * 4 < t1 - 0.05:
            tb = t0 + bb * BEAT * 4
            for off, v in [(0, 0.42), (0.75, 0.3), (1.5, 0.34), (2, 0.4), (2.75, 0.3), (3.5, 0.34)]:
                if tb + off * BEAT < t1 - 0.05:
                    place(bass(hz(root), BEAT * 0.5, v), tb + off * BEAT)
            for k in range(8):
                if tb + k * BEAT / 2 < t1 - 0.05:
                    place(shime(0.18 if k % 2 else 0.26), tb + k * BEAT / 2, 0.35, rev=0.2)
                    place(shaker(0.12), tb + k * BEAT / 2 + BEAT / 4, -0.4)
            place(taiko(0.35, 1.2), tb, rev=0.35)
            place(taiko(0.25, 1.2), tb + 2 * BEAT, rev=0.35)
            bb += 1
    # Yayoi theme (bright, high)
    melody(37.2, [("A5", 0.5), ("B5", 0.5), ("D6", 1), ("B5", 0.5), ("A5", 0.5), ("F#5", 1),
                  ("E5", 0.5), ("F#5", 0.5), ("A5", 1), ("F#5", 2)], vel=0.36, pan=0.15)
    for k in range(9):  # sprouts popping
        n = ["D6", "E6", "F#6", "A6", "B6"][(k * 3) % 5]
        place(glock(hz(n), 0.14), 41.6 + k * 0.09, 0.6 - k * 0.12, rev=0.6)
    for k, n in enumerate(["D6", "F#6", "A6"]):
        place(glock(hz(n), 0.24), 42.14 + k * 0.05, 0.3, rev=0.6)
    place(woodblock(1000, 0.3), 43.19, 0.3)
    place(anvil(0.55), 43.81, 0.3, rev=0.35)
    place(bell(hz("D4"), 0.6, 6.0), 44.2, 0.1, rev=0.6)

    # I. "So what happened to the Jomon?" (44.9 - 46.75): suspense
    place(pad(["D3", "A3", "Eb4"], 3.0, 0.26, attack=0.4, release=0.6, bright=0.8), 44.9, rev=0.5)
    for k in range(3):
        place(koto(hz("A5" if k % 2 == 0 else "G5"), 0.06, 0.16, ring=0.25), 44.95 + k * BEAT, 0.4, rev=0.4)
    place(flute(hz("A4"), 0.3, 0.38, vib=0.3), 45.95, 0.0, rev=0.4)
    place(flute(hz("Bb4"), 0.75, 0.4, vib=1.2), 46.25, 0.0, rev=0.45)

    # J. standoff -> relief (46.75 - 48.95)
    t = 46.75
    while t < 47.85:
        place(taiko(0.08 + 0.22 * (t - 46.75) / 1.1, 1.1), t, (-0.2 if int(t * 10) % 2 else 0.2), rev=0.3)
        t += BEAT / 4
    place(pad(["D2", "A2", "D3", "Eb3"], 1.2, 0.3, attack=0.3, release=0.4, bright=1.5), 46.75, rev=0.3)
    place(taiko(0.7, 1.2), 47.88, rev=0.45)
    place(pad(["D2", "A2", "D3", "Eb3"], 0.35, 0.45, attack=0.02, release=0.3, bright=2.0), 47.88, rev=0.3)
    place(pad(["G2", "D3", "G3", "B3", "D4"], 0.95, 0.42, attack=0.25, release=0.5, bright=1.1), 48.28, rev=0.5)
    for k, n in enumerate(["G4", "B4", "D5", "G5"]):
        place(koto(hz(n), 0.5, 0.36), 48.3 + k * 0.1, -0.2 + k * 0.15, rev=0.35)
    place(glock(hz("B5"), 0.22), 48.55, 0.4, rev=0.6)

    # K. two peoples become one (48.95 - 53.05): both themes, landing together
    chord_track([(48.95, 50.2, ["E2", "B2", "E3", "G3", "B3"]), (50.2, 51.45, ["C3", "G3", "C4", "E4", "G4"]),
                 (51.45, 52.0, ["D3", "A3", "D4", "F#4", "A4"]), (52.0, 53.35, ["G2", "D3", "G3", "B3", "D4", "G4"])],
                vel=0.42, attack=0.45, release=0.8, bright=1.15)
    for t0, n, d in [(48.95, "E2", 1.25), (50.2, "C2", 1.25), (51.45, "D2", 0.55), (52.0, "G2", 1.3)]:
        place(bass(hz(n), d, 0.4, pluck=False), t0)
    arpeggio(48.95, 52.0, ["E4", "B4", "G4", "B4", "C4", "G4", "E4", "G4"], BEAT / 2, 0.17, 0.3, dur=0.3)
    for k in range(5):
        place(taiko(0.2, 1.3), 48.95 + k * 2 * BEAT, rev=0.4)
    # Jomon line (low flute)
    for t0, n, d in [(49.2, "D5", 0.6), (49.83, "B4", 0.3), (50.14, "A4", 0.3), (50.45, "G4", 0.6),
                     (51.08, "E4", 0.3), (51.39, "F#4", 0.3), (51.7, "A4", 0.3), (52.0, "G4", 1.3)]:
        place(flute(hz(n), d, 0.36, vib=0.8), t0, -0.35, rev=0.4)
    # Yayoi line (koto, high) joins in
    for t0, n, d in [(50.45, "A5", 0.3), (50.76, "B5", 0.3), (51.08, "D6", 0.6), (51.7, "B5", 0.3), (52.0, "G5", 1.3)]:
        place(koto(hz(n), d, 0.38, bend=0.3), t0, 0.35, rev=0.4)
    place(noise_swell(0.6, 0.18, 1500, 9000, 2.5), 51.4, rev=0.5)
    place(taiko(0.6, 1.2), 52.0, rev=0.55)
    place(crash(0.25), 52.0, 0.2, rev=0.6)
    for k, n in enumerate(["G5", "B5", "D6", "G6"]):
        place(glock(hz(n), 0.22), 52.05 + k * 0.07, -0.3 + k * 0.2, rev=0.6)

    # L. "Remember this ... again and again" (53.05 - 60)
    place(swish(), 52.85)
    place(glock(hz("D6"), 0.3), 53.25, 0.3, rev=0.6)
    place(glock(hz("G6"), 0.25), 53.33, 0.4, rev=0.6)
    lbars = [(53.05, 54.3, "G"), (54.3, 55.0, "Em"), (55.0, 55.7, "C"), (55.7, 56.34, "D")]
    for t0, t1, name in lbars:
        chord, arp, root, fifth = harm[name]
        place(pad(chord, t1 - t0, 0.3, attack=0.3, release=0.5), t0, rev=0.45)
        arpeggio(t0, t1, arp, BEAT / 2, 0.2, -0.25, dur=0.3)
        place(bass(hz(root), t1 - t0, 0.36), t0)
        tb = t0
        while tb < t1 - 0.05:
            place(shaker(0.14), tb + BEAT / 2, 0.4)
            tb += BEAT
    place(taiko(0.3, 1.3), 53.05, rev=0.4)
    place(taiko(0.25, 1.3), 54.3, rev=0.4)
    place(koto(hz("G4"), 0.3, 0.32, bend=0.5), 54.8, -0.5, rev=0.3)  # rice bowl flies in
    place(glock(hz("B5"), 0.2), 55.63, 0.3, rev=0.6)
    melody(55.71, [("G4", 0.32), ("A4", 0.32), ("B4", 0.6)], vel=0.42, pan=0.05)
    place(glock(hz("D6"), 0.2), 56.25, 0.3, rev=0.6)
    melody(56.34, [("B4", 0.32), ("D5", 0.32), ("E5", 0.5)], vel=0.44, pan=0.05)
    # final cadence on G
    place(taiko(0.75, 1.25), 56.9, rev=0.6)
    place(crash(0.28), 56.9, 0.2, rev=0.6)
    place(pad(["G2", "D3", "G3", "B3", "D4", "A4"], 1.4, 0.42, attack=0.15, release=0.9), 56.9, rev=0.5)
    place(pad(["C3", "G3", "C4", "E4", "G4", "D5"], 1.1, 0.36, attack=0.5, release=0.9), 58.0, rev=0.5)
    place(pad(["G2", "D3", "G3", "B3", "D4", "A4"], 1.4, 0.38, attack=0.6, release=1.0), 58.9, rev=0.55)
    place(bass(hz("G1"), 1.2, 0.4, pluck=False), 56.9)
    place(bass(hz("C2"), 1.0, 0.32, pluck=False), 58.0)
    place(bass(hz("G1"), 1.2, 0.3, pluck=False), 58.9)
    for k, n in enumerate(["G4", "A4", "B4", "D5", "E5", "G5", "A5", "B5", "D6"]):
        place(koto(hz(n), 0.8, 0.26 + k * 0.02), 56.92 + k * 0.045, -0.5 + k * 0.12, rev=0.4)
    melody(57.3, [("G5", 1.4), ("E5", 0.6), ("D5", 0.6), ("B4", 0.8), ("D5", 2.4)], vel=0.33, pan=0.1)
    place(glock(hz("G6"), 0.25), 58.9, 0.3, rev=0.7)
    place(bell(hz("G3"), 0.3, 3.0), 58.9, 0.0, rev=0.6)

    # soft page-turn swishes at the remaining scene changes
    for tc in [29.45, 32.45, 40.45, 44.85, 46.7, 48.9]:
        place(swish(0.08), tc - 0.2, 0.3)


def reverb_ir(seconds=2.4):
    t = tt(seconds)
    ir = np.zeros((len(t), 2))
    for ch in range(2):
        n = rng.standard_normal(len(t))
        bright = lp(n, 7000) * np.exp(-t / 0.35)
        dark = lp(n, 2200) * np.exp(-t / 0.75)
        ir[:, ch] = bright * 0.6 + dark
        # a few early reflections
        for d, g in [(0.011, 0.5), (0.019, 0.35), (0.027, 0.3), (0.041, 0.22)]:
            ir[int((d + ch * 0.003) * SR), ch] += g
    pre = int(0.018 * SR)
    ir = np.concatenate([np.zeros((pre, 2)), ir])
    ir /= np.sqrt(np.sum(ir ** 2, axis=0, keepdims=True))
    return ir


def narration_duck(path, depth_db=7.5):
    """Gain curve that dips the music while the narrator is talking."""
    v, sr = sf.read(path, always_2d=True)
    v = v.mean(axis=1)
    if sr != SR:
        v = signal.resample_poly(v, SR, sr)
    env = np.zeros(N)
    i0 = int(NARRATION_OFFSET * SR)
    n = min(len(v), N - i0)
    env[i0:i0 + n] = np.abs(v[:n])
    # envelope follower: fast attack, slow release, with a look-ahead
    win = int(0.03 * SR)
    env = np.sqrt(np.convolve(env ** 2, np.ones(win) / win, mode="same"))
    look = int(0.08 * SR)
    env = np.concatenate([env[look:], np.zeros(look)])
    db = 20 * np.log10(env + 1e-6)
    amount = np.clip((db + 42) / 14, 0, 1)
    a_att = np.exp(-1 / (0.05 * SR))
    a_rel = np.exp(-1 / (0.45 * SR))
    out = np.zeros(N)
    prev = 0.0
    # simple one-pole smoothing, decimated for speed
    step = 64
    for i in range(0, N, step):
        x = amount[i]
        a = a_att if x > prev else a_rel
        prev = x + (prev - x) * a ** step
        out[i:i + step] = prev
    out = np.convolve(out, np.ones(512) / 512, mode="same")  # no zipper noise
    return 10 ** (-depth_db * out / 20)


def peaking(x, f0, gain_db, q=0.8):
    """RBJ peaking EQ."""
    a = 10 ** (gain_db / 40)
    w = 2 * np.pi * f0 / SR
    al = np.sin(w) / (2 * q)
    b = [1 + al * a, -2 * np.cos(w), 1 - al * a]
    den = [1 + al / a, -2 * np.cos(w), 1 - al / a]
    return signal.lfilter(np.array(b) / den[0], np.array(den) / den[0], x)


# Mix automation: target loudness (RMS dBFS) per cue. The voice sits around
# -19 dB, so under narration the score stays ~11-13 dB below it, rises for the
# disaster, and plays out at full level on the title and the outro.
LEVELS = [
    (0.0, 3.05, -19.0), (3.05, 8.05, -31.0), (8.05, 12.85, -30.0), (12.85, 18.3, -27.5),
    (18.3, 21.7, -31.5), (21.7, 24.95, -29.5), (24.95, 29.5, -31.0), (29.5, 32.5, -31.0),
    (32.5, 35.95, -31.5), (35.95, 40.5, -30.0), (40.5, 44.9, -30.0), (44.9, 46.75, -32.0),
    (46.75, 48.95, -30.0), (48.95, 53.05, -29.5), (53.05, 56.9, -30.0), (56.9, 60.0, -21.0),
]


def automate(mix):
    mono = mix.mean(axis=1)
    pts_t, pts_g = [], []
    for t0, t1, target in LEVELS:
        a, b = int(t0 * SR), int(min(t1, 58.6) * SR)
        rms = 20 * np.log10(np.sqrt(np.mean(mono[a:b] ** 2)) + 1e-9)
        g = target - rms
        pts_t += [t0 + 0.12, t1 - 0.12]
        pts_g += [g, g]
    curve_db = np.interp(np.arange(N) / SR, pts_t, pts_g)
    return mix * (10 ** (curve_db / 20))[:, None]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--narration", default=None, help="narration wav used for ducking")
    ap.add_argument("--out", default=os.path.join("public", "japan", "music_p1.wav"))
    args = ap.parse_args()

    score()
    ir = reverb_ir()
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:N] for c in range(2)], -1)
    mix = dry + wet * 0.55
    mix = np.stack([hp(mix[:, c], 30) for c in range(2)], -1)
    if args.narration:
        # carve a little room for the voice, then duck under it
        mix = np.stack([peaking(mix[:, c], 2000, -3.5, 0.7) for c in range(2)], -1)
        mix *= narration_duck(args.narration)[:, None]
    mix = automate(mix)
    # fade the very end and catch any stray peaks with a soft clipper
    tail = int(1.2 * SR)
    mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 1.5
    mix = 0.9 * np.tanh(mix / 0.9)
    sf.write(args.out, mix.astype(np.float32), SR, subtype="PCM_24")
    print("wrote", args.out)


if __name__ == "__main__":
    main()
