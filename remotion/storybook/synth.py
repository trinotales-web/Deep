"""Shared synthesizer for the storybook videos, built from scratch with numpy.

Instruments: a plucked koto (additive strings with inharmonic,
frequency-dependent decay), a breathy shakuhachi-style flute, warm pads,
a singing bowl, wind chimes, soft taiko and hand drum, a woodblock, a
shaker, a bass and a whoosh. A score calls init(), places notes, then
master() mixes, adds reverb and writes an .m4a.
"""

import pathlib
import shutil
import subprocess
import wave

import numpy as np

SR = 48000
DUR = 0.0
N = 0
rng = np.random.default_rng(7)
stems = {}


def init(duration, seed=7):
    """Start a new piece of the given length in seconds."""
    global DUR, N, rng
    DUR = float(duration)
    N = int(DUR * SR)
    rng = np.random.default_rng(seed)
    stems.clear()


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {"C": 0, "C#": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}


def m(name):
    """'F#4' -> MIDI number."""
    return 12 * (int(name[-1]) + 1) + NOTE[name[:-1]]


# ------------------------------------------------------------------ mixing

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


def master(out_path, levels, sends, sections=None, peak=0.85):
    """Mix the stems with a shared reverb, glue-compress, limit gently and
    write out_path (.m4a via ffmpeg, falling back to .wav)."""
    dry = sum(stems[s] * levels[s] for s in stems)
    wet_in = sum(stems[s] * levels[s] * sends[s] for s in stems)
    wet = convolve(wet_in, reverb_ir()) * 0.9
    mix = (dry + wet)[:, :N]
    mix = np.stack([fft_filter(ch, lo=32, slope=2) for ch in mix])

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
    mix *= peak / np.max(np.abs(mix))

    out_path = pathlib.Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    wav_path = out_path.with_suffix(".wav")
    with wave.open(str(wav_path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix.T * 32767).astype("<i2").tobytes())

    for name, (a, b) in (sections or {}).items():
        seg = mix[:, int(a * SR) : int(b * SR)]
        print(f"{name:10s} rms {20 * np.log10(np.sqrt(np.mean(seg**2)) + 1e-9):6.1f} dBFS")

    if shutil.which("ffmpeg"):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav_path), "-c:a", "aac", "-b:a", "192k", str(out_path)], check=True)
        wav_path.unlink()
        print("wrote", out_path)
    else:
        print("wrote", wav_path, "(install ffmpeg to encode", out_path.name + ")")
