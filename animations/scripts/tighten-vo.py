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
(match is on the token text, case-insensitive, punctuation included).
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
    a = ap.parse_args()

    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", a.audio, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         check=True, capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
    caps = json.load(open(a.captions))

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

    # build output with crossfades
    xf = int(0.012 * SR)
    out = []
    pos = 0
    for s, e in cuts:
        seg = x[pos:s]
        if out and len(seg) > xf:
            prev = out[-1]
            ramp = np.linspace(0, 1, xf)[:, None]
            prev[-xf:] = prev[-xf:] * (1 - ramp) + seg[:xf] * ramp
            seg = seg[xf:]
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
    print(f"removed {lens.sum():.1f}s of dead air in {len(cuts)} cuts: {len(x)/SR:.1f}s → {len(y)/SR:.1f}s")

if __name__ == "__main__":
    main()
