#!/usr/bin/env python3
"""Tighten a narration's pacing using its word-aligned captions.

Removes dead air between words (never cuts speech), keeping natural pauses:
  mid-phrase ≤ 0.12 s, after commas ≤ 0.20 s, sentence ends ≤ 0.30 s,
  questions ≤ 0.40 s, paragraph breaks ≤ 0.55 s, plus optional dramatic beats.
Cuts are made in the middle of each silence with 12 ms crossfades.
Outputs the edited audio (48 kHz WAV) and the captions JSON remapped to it.

  python3 scripts/tighten-vo.py vo.mp3 captions.json script.txt out.wav out.json \\
      [--beat "out.=0.6"] [--beat "right?=0.55"]

--beat "word=seconds" sets the pause after every caption token equal to `word`
(match is on the token text, case-insensitive, punctuation included). A beat
longer than the recorded pause inserts room tone (silence) to reach it.
Needs numpy and ffmpeg.
"""
import argparse, json, re, subprocess, wave
import numpy as np

SR = 48000

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio"); ap.add_argument("captions"); ap.add_argument("script")
    ap.add_argument("out_audio"); ap.add_argument("out_captions")
    ap.add_argument("--beat", action="append", default=[])
    ap.add_argument("--mid", type=float, default=0.12)
    ap.add_argument("--comma", type=float, default=0.20)
    ap.add_argument("--sentence", type=float, default=0.30)
    ap.add_argument("--question", type=float, default=0.40)
    ap.add_argument("--paragraph", type=float, default=0.55)
    ap.add_argument("--refine", type=float, default=None, help="refine each gap from the audio: silence = RMS below this dBFS (e.g. -45)")
    a = ap.parse_args()

    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", a.audio, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         check=True, capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
    caps = json.load(open(a.captions))

    # optional: frame RMS (20 ms window, 5 ms hop) to find the real silence
    # around each gap, since aligner word boundaries often swallow some of it
    hop = int(0.005 * SR)
    if a.refine is not None:
        mono = x.mean(axis=1)
        win = int(0.02 * SR)
        n = (len(mono) - win) // hop
        idx = np.arange(n)[:, None] * hop + np.arange(win)[None, :]
        rms = np.sqrt((mono[idx] ** 2).mean(axis=1) + 1e-12)
        db = 20 * np.log10(rms)
    def quiet(t):
        k = int(t * SR / hop)
        return 0 <= k < len(db) and db[k] < a.refine

    # paragraph-final tokens: count tokens per script paragraph
    paras = [p for p in open(a.script, encoding="utf8").read().split("\n") if p.strip()]
    beats = {}
    for b in a.beat:
        w, v = b.rsplit("=", 1)
        beats[w.strip().lower()] = float(v)

    para_end_text = set()
    for p in paras:
        last = p.split()[-1].strip().lower()
        para_end_text.add(last)

    # walk the captions and decide each gap's target length
    # paragraph ends are located by matching the last token of each paragraph in order
    para_lasts = [p.split()[-1].strip().lower() for p in paras]
    pi = 0
    cuts = []  # (start_sample, end_sample) to remove
    for i in range(len(caps) - 1):
        a_tok = caps[i]["text"].strip()
        t = a_tok.lower()
        is_para_end = pi < len(para_lasts) and t == para_lasts[pi] and i + 1 < len(caps)
        gap0 = caps[i]["endMs"] / 1000
        gap1 = caps[i + 1]["startMs"] / 1000
        if a.refine is not None:
            lo = caps[i]["startMs"] / 1000 + 0.06
            hi = caps[i + 1]["endMs"] / 1000 - 0.06
            L = min(gap0, gap1)
            R = max(gap0, gap1)
            if quiet(L) or quiet(R) or quiet((L + R) / 2):
                while L - 0.005 > lo and quiet(L - 0.005):
                    L -= 0.005
                while R + 0.005 < hi and quiet(R):
                    R += 0.005
                # keep 30 ms of air next to the speech on both sides
                gap0, gap1 = min(L + 0.03, R), max(R - 0.03, L)
        gap = gap1 - gap0
        if t in beats:
            target = beats[t]
        elif is_para_end:
            target = a.paragraph
        elif re.search(r"\?\"?$", t):
            target = a.question
        elif re.search(r"[.!]\"?$", t):
            target = a.sentence
        elif t.endswith(","):
            target = a.comma
        else:
            target = a.mid
        if is_para_end:
            pi += 1
        if gap > target + 0.02:
            remove = gap - target
            mid = (gap0 + gap1) / 2
            cuts.append((int((mid - remove / 2) * SR), int((mid + remove / 2) * SR)))
        elif t in beats and gap < target - 0.02:
            # dramatic beat longer than the take: insert silence mid-gap
            mid = (gap0 + gap1) / 2
            cuts.append((int(mid * SR), int(mid * SR) - int((target - gap) * SR)))

    # build output with crossfades
    xf = int(0.012 * SR)
    out = []
    pos = 0
    after_insert = False
    for s, e in cuts:
        if e < s:
            # insertion of (s - e) samples of silence at s (no crossfade needed:
            # it sits inside a pause)
            out.append(x[pos:s].copy())
            out.append(np.zeros((s - e, 2), dtype=np.float32))
            pos = s
            after_insert = True
            continue
        seg = x[pos:s]
        if out and len(seg) > xf and not after_insert:
            prev = out[-1]
            ramp = np.linspace(0, 1, xf)[:, None]
            prev[-xf:] = prev[-xf:] * (1 - ramp) + seg[:xf] * ramp
            seg = seg[xf:]
        after_insert = False
        out.append(seg.copy())
        # the next piece starts xf samples early: its head overlaps (crossfades
        # with) this piece's tail, so each cut removes exactly e - s samples
        pos = max(s, e - xf)
    out.append(x[pos:].copy())
    y = np.concatenate(out)

    # time remap for captions
    starts = np.array([c[0] for c in cuts]) / SR
    lens = np.array([c[1] - c[0] for c in cuts]) / SR
    def remap(t):
        k = np.searchsorted(starts, t, side="right")
        return t - lens[:k].sum()
    new_caps = []
    for c in caps:
        s = remap(c["startMs"] / 1000); e = remap(c["endMs"] / 1000)
        new_caps.append({**c, "startMs": round(s * 1000), "endMs": round(e * 1000), "timestampMs": round((s + e) * 500)})
    json.dump(new_caps, open(a.out_captions, "w"), indent=1)

    pcm = (np.clip(y, -1, 1) * 32767).astype("<i2")
    with wave.open(a.out_audio, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    removed = lens[lens > 0].sum()
    added = -lens[lens < 0].sum()
    print(f"removed {removed:.1f}s of dead air in {(lens > 0).sum()} cuts, added {added:.1f}s in {(lens < 0).sum()} beats: {len(x)/SR:.1f}s → {len(y)/SR:.1f}s")

if __name__ == "__main__":
    main()
