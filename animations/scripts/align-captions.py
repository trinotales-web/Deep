#!/usr/bin/env python3
"""Forced-align a voiceover to its exact script → Remotion Caption[] JSON.

Use this when you have the script text (more accurate than transcription and
needs no model download):

    pip install pocketsphinx          # bundles the English acoustic model
    python3 scripts/align-captions.py public/vo/<name>.mp3 script.txt public/captions/<name>.json

Spoken numbers ("four eighty four") can be shown as digits with --merge, e.g.
    --merge "four eighty four=484"
Needs ffmpeg on PATH (or set FFMPEG=/path/to/ffmpeg).
"""
import argparse
import json
import os
import re
import subprocess
import sys

from pocketsphinx import Decoder


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("script")
    ap.add_argument("out")
    ap.add_argument("--merge", action="append", default=[], help='"spoken words=Display" (repeatable)')
    a = ap.parse_args()

    ffmpeg = os.environ.get("FFMPEG", "ffmpeg")
    raw = subprocess.run(
        [ffmpeg, "-loglevel", "error", "-i", a.audio, "-ar", "16000", "-ac", "1", "-f", "s16le", "-"],
        check=True, capture_output=True,
    ).stdout

    text = open(a.script, encoding="utf8").read()
    tokens = text.split()
    words = [w.lower() for w in re.findall(r"[A-Za-z']+", text)]

    dec = Decoder(samprate=16000, bestpath=False, loglevel="ERROR")
    dec.set_align_text(" ".join(words))
    dec.start_utt()
    dec.process_raw(raw, full_utt=True)
    dec.end_utt()
    segs = [
        (re.sub(r"\(\d+\)$", "", s.word), s.start_frame / 100.0, (s.end_frame + 1) / 100.0)
        for s in dec.seg()
        if s.word not in ("<s>", "</s>", "<sil>", "[NOISE]")
    ]
    if len(segs) != len(words):
        sys.exit(f"alignment failed: {len(segs)} of {len(words)} words aligned (check spelling / dictionary words)")

    caps, i = [], 0
    for tok in tokens:
        n = len(re.findall(r"[A-Za-z']+", tok))
        if n == 0:
            continue
        ws = segs[i : i + n]
        i += n
        caps.append({"text": tok, "startMs": round(ws[0][1] * 1000), "endMs": round(ws[-1][2] * 1000)})

    for rule in a.merge:
        spoken, shown = rule.split("=", 1)
        parts = spoken.split()
        out, k = [], 0
        while k < len(caps):
            window = [re.sub(r"[^\w']", "", c["text"]).lower() for c in caps[k : k + len(parts)]]
            if window == [p.lower() for p in parts]:
                tail = re.sub(r"[\w']+$", "", caps[k + len(parts) - 1]["text"])  # keep trailing punctuation
                out.append({"text": shown + tail, "startMs": caps[k]["startMs"], "endMs": caps[k + len(parts) - 1]["endMs"]})
                k += len(parts)
            else:
                out.append(caps[k])
                k += 1
        caps = out

    result = [
        {
            "text": (" " if j else "") + c["text"],
            "startMs": c["startMs"],
            "endMs": c["endMs"],
            "timestampMs": (c["startMs"] + c["endMs"]) // 2,
            "confidence": None,
        }
        for j, c in enumerate(caps)
    ]
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    json.dump(result, open(a.out, "w"), indent=1)
    print(f"{len(result)} words → {a.out}")


if __name__ == "__main__":
    main()
