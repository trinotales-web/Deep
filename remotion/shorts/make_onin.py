"""Build the sound and timeline for the Onin War Short (9:16):

  python3 remotion/shorts/make_onin.py

Cuts the script's lines out of the film's narration (Parts 3 and 4, the
narrator's own takes), lays them end to end with short breaths between,
writes remotion/shorts/onin.json (shots and every word's time in the Short),
scores the Short (remotion/japan/music/compose_short_onin.py), and mixes voice
and music with the film's balance (voice 200%, music 75%) to -14 LUFS:
public/shorts/onin_mix.m4a. The end card has no voice yet; record the
call-to-action line and it can go in at CTA_START.
"""
import json
import os
import subprocess
import sys

import numpy as np
from scipy.io import wavfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "remotion/japan/tools"))
import make_captions as mc  # noqa: E402  (word tables of the film)

SR = 48000
FPS = 30
OUT = os.path.join(ROOT, "public/shorts")
WORK = os.path.join(ROOT, "out/shorts_work")

# (part, from, to) in seconds of that part's narration, each cut in a pause; then the shot it belongs to.
LINES = [
    (4, 20.65, 22.75, "hook"),  # It lasted ten whole years.
    (4, 25.25, 26.50, "hook"),  # and nobody won.
    (3, 100.45, 102.85, "yoshimasa"),  # Then came a shogun named Yoshimasa.
    (3, 111.30, 115.30, "promise"),  # He had no son, so he promised the title of shogun to his younger brother.
    (3, 115.45, 119.55, "baby"),  # Then, soon after, his wife gave birth to a baby boy.
    (3, 119.90, 124.75, "seat"),  # Now two people wanted the same seat, the shogun's brother and the shogun's son.
    (3, 124.95, 129.60, "onin"),  # This started the Onin War. That's Onin, not onion.
    (4, 0.00, 2.52, "streets"),  # The war was fought right in the streets of Kyoto.
    (4, 2.55, 8.15, "leaders"),  # One side was led by ... the Red Monk. The other side was led by his own son-in-law.
    (4, 8.35, 12.17, "fire"),  # They set fire to each other's houses, temples and palaces.
    (4, 12.25, 15.98, "destroyed"),  # Slowly, the beautiful old city of Kyoto was destroyed.
    (4, 20.65, 22.75, "tenyears"),  # It lasted ten whole years.
    (4, 22.80, 26.50, "nobody"),  # And in the end, both leaders were dead, and nobody won.
]
GAP = 0.08  # extra breath between lines (each cut already keeps its own pauses)
HOOK_GAP = 0.25  # a beat between "ten whole years" and "nobody won"
AFTER_HOOK = 0.35  # and before the story starts
CTA_LEN = 3.8
VOICE, MUSIC = 2.0, 0.75
TARGET_LUFS, LIMIT_DB = -14.0, -1.5


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.float32)


def build():
    narr = {n: load(os.path.join(ROOT, f"public/japan/narration_p{n}.m4a")) for n in (3, 4)}
    words = {n: mc.words(n) for n in (3, 4)}
    t = 0.0
    pieces, shots, ws = [], [], []
    prev_shot = None
    for i, (n, a, b, shot) in enumerate(LINES):
        if i:
            t += HOOK_GAP if shot == prev_shot == "hook" else AFTER_HOOK if prev_shot == "hook" else GAP
        if shot != prev_shot:
            shots.append({"id": shot, "start": round(t, 3)})
        clip = narr[n][int(a * SR):int(b * SR)].copy()
        fade = int(0.008 * SR)
        clip[:fade] *= np.linspace(0, 1, fade)
        clip[-fade:] *= np.linspace(1, 0, fade)
        pieces.append((t, clip))
        for w, s, e in words[n]:
            if w and s >= a - 0.01 and e <= b + 0.01:
                ws.append({"w": w, "s": round(t + s - a, 3), "e": round(t + e - a, 3), "shot": shot})
            elif not w and ws and s >= a - 0.01 and e <= b + 0.01:
                ws[-1]["e"] = round(t + e - a, 3)  # a folded word ("son-in-law") ends with its last part
        t += b - a
        prev_shot = shot
    cta = round(t + 0.25, 3)
    shots.append({"id": "cta", "start": cta})
    end = cta + CTA_LEN
    for k, s in enumerate(shots):
        s["end"] = shots[k + 1]["start"] if k + 1 < len(shots) else round(end, 3)
    voice = np.zeros(int(end * SR) + 1, np.float32)
    for t0, clip in pieces:
        i0 = int(round(t0 * SR))
        voice[i0:i0 + len(clip)] += clip
    frames = int(np.ceil(end * FPS))
    return voice, {"fps": FPS, "duration": frames, "ctaStart": cta, "shots": shots, "words": ws}


def lufs(path):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=framelog=quiet", "-f", "null", "-"],
                         check=True, capture_output=True, text=True).stderr
    return float(log.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0])


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(WORK, exist_ok=True)
    voice, timeline = build()
    with open(os.path.join(os.path.dirname(__file__), "onin.json"), "w") as fh:
        json.dump(timeline, fh, indent=1)
    voice_wav = os.path.join(WORK, "onin_voice.wav")
    wavfile.write(voice_wav, SR, voice)
    music_wav = os.path.join(WORK, "onin_music.wav")
    subprocess.run([sys.executable, os.path.join(ROOT, "remotion/japan/music/compose_short_onin.py"),
                    "--narration", voice_wav, "--out", music_wav], check=True, cwd=ROOT)
    music = load(music_wav)
    music = np.pad(music, (0, max(0, len(voice) - len(music))))[:len(voice)]
    mix = VOICE * voice + MUSIC * music
    raw = os.path.join(WORK, "onin_raw.wav")
    wavfile.write(raw, SR, mix.astype(np.float32))
    gain = TARGET_LUFS - lufs(raw)
    limit = 10 ** (LIMIT_DB / 20)
    out = os.path.join(OUT, "onin_mix.m4a")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
                    f"volume={gain:.2f}dB,alimiter=limit={limit:.4f}:attack=2:release=60:level=disabled",
                    "-ac", "2", "-c:a", "aac", "-b:a", "192k", out], check=True)
    print(f"wrote {out}: {timeline['duration'] / FPS:.1f} s, {len(timeline['words'])} words, gain {gain:+.1f} dB")


if __name__ == "__main__":
    main()
