"""Shared synthesiser and mixer for the Japan series scores.

Instruments are built from scratch with numpy/scipy: koto, shakuhachi-style
flute, string pad, bass, taiko, shime-daiko, bells and a few musical effects.
Call configure(duration) before placing notes, then render(levels, ...).
"""
import argparse
import os

import numpy as np
from scipy import signal
import soundfile as sf

SR = 44100
N = 0  # samples in the current piece, set by configure()
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
dry = np.zeros((0, 2))
send = np.zeros((0, 2))


def configure(duration):
    """Start a new piece of `duration` seconds (resets the mix buses)."""
    global N, dry, send
    N = int(SR * duration)
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


def automate(mix, levels):
    mono = mix.mean(axis=1)
    pts_t, pts_g = [], []
    for t0, t1, target in levels:
        a, b = int(t0 * SR), int(min(t1, N / SR - 1.4) * SR)
        rms = 20 * np.log10(np.sqrt(np.mean(mono[a:b] ** 2)) + 1e-9)
        g = target - rms
        pts_t += [t0 + 0.12, t1 - 0.12]
        pts_g += [g, g]
    curve_db = np.interp(np.arange(N) / SR, pts_t, pts_g)
    return mix * (10 ** (curve_db / 20))[:, None]


def render(levels, narration=None, out="music.wav"):
    """Reverb, carve + duck under the narration, mix automation, soft clip, write."""
    ir = reverb_ir()
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:N] for c in range(2)], -1)
    mix = dry + wet * 0.55
    mix = np.stack([hp(mix[:, c], 30) for c in range(2)], -1)
    if narration:
        # carve a little room for the voice, then duck under it
        mix = np.stack([peaking(mix[:, c], 2000, -3.5, 0.7) for c in range(2)], -1)
        mix *= narration_duck(narration)[:, None]
    mix = automate(mix, levels)
    # fade the very end and catch any stray peaks with a soft clipper
    tail = int(1.2 * SR)
    mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 1.5
    mix = 0.9 * np.tanh(mix / 0.9)
    sf.write(out, mix.astype(np.float32), SR, subtype="PCM_24")
    print("wrote", out)


def cli(default_out):
    ap = argparse.ArgumentParser()
    ap.add_argument("--narration", default=None, help="narration wav used for ducking")
    ap.add_argument("--out", default=default_out)
    return ap.parse_args()


# ----------------------------------------------------------------- added for Part 2
def sword(vel=0.5, length=1.6):
    """Blade drawn from its scabbard: a rising swish into a long metallic ring."""
    t = tt(length)
    n = rng.standard_normal(len(t))
    swish_env = np.clip(t / 0.12, 0, 1) * np.exp(-np.clip(t - 0.12, 0, None) / 0.05)
    sw = bp(n, 2500, 9000) * swish_env * 0.6
    ring = np.zeros_like(t)
    for f, a, tau in [(2637, 1.0, 0.9), (3951, 0.6, 0.6), (5274, 0.4, 0.4), (7040, 0.25, 0.25)]:
        ring += a * np.sin(2 * np.pi * f * t + 2 * np.sin(2 * np.pi * 5 * t)) * np.exp(-np.clip(t - 0.12, 0, None) / tau)
    ring *= np.clip((t - 0.1) / 0.02, 0, 1)
    return (sw + ring * 0.25) * vel * 0.3


def suzu(vel=0.3):
    """Shrine bells: a jingle of tiny high bells."""
    out = np.zeros(int(1.4 * SR))
    for k in range(9):
        f0 = 2400 + rng.random() * 2200
        g = glock(f0, vel * (0.4 + 0.6 * rng.random()))
        i = int((0.012 * k + rng.random() * 0.02) * SR)
        n = min(len(g), len(out) - i)
        out[i:i + n] += g[:n] * 0.5
    return out


def reed(f0, dur, vel=0.4):
    """Hichiriki-like double reed: nasal, slightly wobbly, for court music."""
    length = dur + 0.25
    t = tt(length)
    cents = -60 * np.exp(-t / 0.08) + 14 * np.sin(2 * np.pi * 4.6 * t) * np.clip((t - 0.25) / 0.4, 0, 1)
    ph = 2 * np.pi * np.cumsum(f0 * 2 ** (cents / 1200)) / SR
    tone = np.zeros_like(t)
    for k in range(1, 12):
        if f0 * k > 12000:
            break
        tone += np.sin(ph * k) / k ** 0.9
    tone = bp(tone, 700, 3800) * 1.6 + tone * 0.25
    env = np.clip(t / 0.07, 0, 1) * np.where(t < dur, 1.0, np.exp(-(t - dur) / 0.07))
    return tone * env * vel * 0.12


def bass_slide(f0, f1, dur, vel=0.4):
    """Bass note that slides from f0 to f1: the comic 'deflate' sound."""
    t = tt(dur + 0.2)
    f = f0 * (f1 / f0) ** np.clip(t / dur, 0, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    env = np.clip(t / 0.02, 0, 1) * np.where(t < dur, 1.0, np.exp(-(t - dur) / 0.06))
    return tone * env * vel * 0.32
