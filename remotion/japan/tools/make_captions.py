"""Write the film's English captions as an SRT file, ready to upload to YouTube:

  python3 remotion/japan/tools/make_captions.py [out.srt]

One cue per on-screen caption phrase, timed from the forced-aligned narration
(words-partN.ts) and placed on the film's timeline (storyTimeline.json), so the
captions match the voice-over word for word, names and all. Indian digit
grouping ("1,40,000", "one lakh") is written the international way, since the
captions are also what YouTube translates for viewers in other languages.
"""
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
JP = os.path.join(ROOT, "remotion/japan")
TL = json.load(open(os.path.join(JP, "storyTimeline.json")))
FPS, XF = TL["fps"], TL["overlap"]
OFFSET = 3.0  # the narration starts 3 s into each part
LEAD = 0.12  # a caption appears just before its first word, as on screen
LINGER = 1.0  # and stays up this long after its last word, unless the next one starts
MAX_LINE = 42

ROW = re.compile(r'\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]')
PAIR = re.compile(r"\[\s*(\d+)\s*,\s*(\d+)\s*\]")


def table(path, name, rx):
    src = open(path).read()
    start = src.index("= [", src.index(name)) + 2
    return rx.findall(src[start : src.index("];", start)])


def words(n):
    return [(w.replace('\\"', '"'), float(a), float(b)) for w, a, b in table(os.path.join(JP, f"words-part{n}.ts"), f"WORDS_P{n}", ROW)]


def phrases(n):
    path, name = (os.path.join(JP, "Stage.tsx"), "P1_PHRASES") if n == 1 else (os.path.join(JP, f"Part{n}.tsx"), f"PHRASES_P{n}")
    return [(int(a), int(b)) for a, b in table(path, name, PAIR)]


def film_time(seg, part_seconds):
    """Seconds into the film for a moment `part_seconds` into one part."""
    return (seg["at"] - seg["from"]) / FPS + part_seconds


def international(text):
    text = re.sub(r"\bone lakh\b", "100,000", text)
    return re.sub(r"\b(\d{1,2}),(\d\d),(\d{3})\b", lambda m: f"{int(m[1] + m[2]):,},{m[3]}", text)


def wrap(text):
    """One line, or two balanced lines broken at the space nearest the middle."""
    if len(text) <= MAX_LINE:
        return text
    spaces = [i for i, ch in enumerate(text) if ch == " "]
    cut = min(spaces, key=lambda i: abs(i - len(text) / 2))
    return text[:cut] + "\n" + text[cut + 1 :]


def cues():
    out = []
    for i, seg in enumerate(TL["segments"]):
        n = seg["part"]
        ws, ph = words(n), phrases(n)
        last = i == len(TL["segments"]) - 1
        seg_end = film_time(seg, (seg["to"] - (0 if last else XF)) / FPS)
        for k, (a, b) in enumerate(ph):
            text = international(" ".join(w for w, _, _ in ws[a : b + 1] if w))
            start = film_time(seg, OFFSET + ws[a][1] - LEAD)
            end = film_time(seg, OFFSET + ws[b][2] + LINGER)
            if k + 1 < len(ph):
                end = min(end, film_time(seg, OFFSET + ws[ph[k + 1][0]][1] - LEAD))
            out.append((start, min(end, seg_end), text))
    # A part's first words can land inside the previous part's crossfade.
    return [(s, min(e, out[k + 1][0]) if k + 1 < len(out) else e, t) for k, (s, e, t) in enumerate(out)]


def stamp(t):
    ms = round(t * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "out", TL["title"], f"{TL['title']} - English captions.srt")
    items = cues()
    for (s0, e0, _), (s1, _, _) in zip(items, items[1:]):
        assert s0 < e0 <= s1 + 1e-6, (s0, e0, s1)
    with open(path, "w", encoding="utf-8") as fh:
        for k, (start, end, text) in enumerate(items, 1):
            fh.write(f"{k}\n{stamp(start)} --> {stamp(end)}\n{wrap(text)}\n\n")
    print(f"wrote {path} ({len(items)} captions, ends {stamp(items[-1][1])})")


if __name__ == "__main__":
    main()
