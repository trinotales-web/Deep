"""Build the seamless film from the part renders:

  python3 remotion/japan/tools/build_story.py [outDir]

Needs out/japan_part1..8.mp4 (the full-quality part renders) and the audio
stems in public/japan. Only the opening title and the seven joins are rendered
again, from the JapanStory composition; every other frame comes from the part
renders. The sound is mixed from the stems with the voice at 200% and the music
at 75%, brought to -14 LUFS under a -1.5 dBTP limiter, and the film gets the
chapter marks from storyTimeline.json. Set REMOTION_BROWSER to use a specific
Chromium.
"""
import json
import os
import subprocess
import sys

import numpy as np
from scipy.io import wavfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
TL = json.load(open(os.path.join(ROOT, "remotion/japan/storyTimeline.json")))
FPS, XF, SEGS = TL["fps"], TL["overlap"], TL["segments"]
OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "out", TL["title"]))
WORK = os.path.join(ROOT, "out", "story_work")
SR = 48000
VOICE, MUSIC = 2.0, 0.75
TARGET_LUFS, LIMIT_DB = -14.0, -1.5
CHECK = 4  # frames each join clip overlaps the part renders by, to check they match
INTRO_END = 120  # the opening title (with the film's subtitle) is re-rendered up to here


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, cwd=ROOT, **kw)


def part_mp4(n):
    return os.path.join(ROOT, "out", f"japan_part{n}.mp4")


def join_from(seg):
    """Part frame where a segment's ending starts to differ from its plain render."""
    return min(seg["stripHideFrom"], seg["to"] - XF - 8)


def plan():
    """The film as a list of (source, first frame, end frame) pieces, and the clips to render."""
    clips = [(0, INTRO_END + CHECK - 1)]
    pieces = [("clip", 0, 0, INTRO_END)]
    pos = INTRO_END
    for i, seg in enumerate(SEGS):
        start = INTRO_END if i == 0 else seg["from"] + XF
        end = join_from(seg) if i < len(SEGS) - 1 else seg["to"]
        pieces.append((seg["part"], start, end, None))
        pos += end - start
        if i < len(SEGS) - 1:
            nxt = SEGS[i + 1]
            a = seg["at"] + end - seg["from"]
            b = nxt["at"] + XF
            assert a == pos
            clips.append((a - CHECK, b + CHECK - 1))
            pieces.append(("clip", len(clips) - 1, CHECK, CHECK + b - a))
            pos = b
    assert pos == TL["duration"], (pos, TL["duration"])
    return clips, pieces


def clip_path(c):
    return os.path.join(WORK, f"clip_{c[0]}-{c[1]}.mp4")


def render_clips(clips):
    todo = [c for c in clips if not os.path.exists(clip_path(c))]
    if todo:
        run(["node", "remotion/japan/tools/render_ranges.mjs", WORK, *[f"{a}-{b}" for a, b in todo]])


def frames(path, start, count, w=480, h=270):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", f"select='between(n,{start},{start + count - 1})',scale={w}:{h}",
         "-vsync", "0", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32)


def check_joins(clips):
    """The re-rendered frames either side of each cut should match the part renders."""
    worst = 0.0
    for k, c in enumerate(clips):
        clip = clip_path(c)
        n_clip = c[1] - c[0] + 1
        checks = []
        if k == 0:
            checks.append((frames(clip, INTRO_END, CHECK), frames(part_mp4(1), INTRO_END, CHECK)))
        else:
            seg, nxt = SEGS[k - 1], SEGS[k]
            checks.append((frames(clip, 0, CHECK), frames(part_mp4(seg["part"]), join_from(seg) - CHECK, CHECK)))
            checks.append((frames(clip, n_clip - CHECK, CHECK), frames(part_mp4(nxt["part"]), nxt["from"] + XF, CHECK)))
        for new, old in checks:
            d = np.abs(new - old).mean(axis=3)
            worst = max(worst, float(np.percentile(d, 99.9)))
            print(f"  join {k}: mean diff {d.mean():.2f}, 99.9th pct {np.percentile(d, 99.9):.1f}")
    if worst > 24:
        sys.exit("A join doesn't match its part render; re-render that part first.")


def build_video(clips, pieces, out):
    inputs, chains, labels = [], [], []
    for n in range(1, 9):
        inputs += ["-i", part_mp4(n)]
    for c in clips:
        inputs += ["-i", clip_path(c)]
    for j, (src, a, b, c) in enumerate(pieces):
        idx = 8 + a if src == "clip" else src - 1
        first, last = (b, c) if src == "clip" else (a, b)
        chains.append(f"[{idx}:v]trim=start_frame={first}:end_frame={last},setpts=PTS-STARTPTS[v{j}]")
        labels.append(f"[v{j}]")
    graph = ";".join(chains) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=1:a=0,format=yuv420p[v]"
    run(["ffmpeg", "-v", "error", "-stats", "-y", *inputs, "-filter_complex", graph, "-map", "[v]", "-r", str(FPS),
         "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-tune", "animation", out])


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)


def build_audio(out):
    """The JapanStory mix, done here so the voice can sit at 200% without clipping."""
    spf = SR // FPS
    mix = np.zeros((TL["duration"] * spf, 2), np.float32)
    for seg in SEGS:
        n = seg["part"]
        music = load(os.path.join(ROOT, f"public/japan/music_p{n}.m4a"))
        voice = load(os.path.join(ROOT, f"public/japan/narration_p{n}.m4a"))
        a, b = seg["from"] * spf, seg["to"] * spf
        idx = np.arange(a, b)
        fr = idx / spf
        gain = np.clip(np.minimum((fr - seg["from"]) / XF, (seg["to"] - fr) / 30), 0, 1)[:, None]
        m = np.zeros((b - a, 2), np.float32)
        have = max(0, min(b, len(music)) - a)
        m[:have] = music[a:a + have]
        v = np.zeros((b - a, 2), np.float32)
        vi = idx - 3 * SR  # the narration starts 3 s into each part
        ok = (vi >= 0) & (vi < len(voice))
        v[ok] = voice[vi[ok]]
        at = seg["at"] * spf
        mix[at:at + b - a] += MUSIC * gain * m + VOICE * v
    raw = os.path.join(WORK, "mix_raw.wav")
    wavfile.write(raw, SR, mix)
    # Measure, set the loudness, and let a limiter catch the peaks.
    meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", raw, "-af", "ebur128=framelog=quiet", "-f", "null", "-"],
                          check=True, capture_output=True, text=True).stderr
    lufs = float(meas.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0])
    gain_db = TARGET_LUFS - lufs
    print(f"  raw mix {lufs:.1f} LUFS, gain {gain_db:+.1f} dB")
    limit = 10 ** (LIMIT_DB / 20)
    run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
         f"volume={gain_db:.2f}dB,alimiter=limit={limit:.4f}:attack=2:release=60:level=disabled,aresample=48000",
         "-c:a", "aac", "-b:a", "256k", out])


def clock(frame):
    s = round(frame / FPS)
    return f"{s // 60}:{s % 60:02d}"


def chapters():
    starts = [SEGS[c["part"] - 1]["at"] for c in TL["chapters"]] + [TL["duration"]]
    meta = [";FFMETADATA1", f"title={TL['title']}"]
    text = []
    for c, a, b in zip(TL["chapters"], starts, starts[1:]):
        ms = lambda f: round(f * 1000 / FPS)
        meta += ["[CHAPTER]", "TIMEBASE=1/1000", f"START={ms(a)}", f"END={ms(b) - 1}", f"title={c['title']}"]
        text.append(f"{clock(a)} {c['title']}")
    return "\n".join(meta) + "\n", "\n".join(text) + "\n"


def main():
    os.makedirs(WORK, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    clips, pieces = plan()
    print("1/4 rendering the title and the joins")
    render_clips(clips)
    check_joins(clips)
    video = os.path.join(WORK, "video.mp4")
    if not os.path.exists(video):
        print("2/4 joining the video")
        build_video(clips, pieces, video + ".tmp.mp4")
        os.rename(video + ".tmp.mp4", video)
    print("3/4 mixing the sound")
    audio = os.path.join(WORK, "audio.m4a")
    build_audio(audio)
    print("4/4 putting it together")
    meta, text = chapters()
    with open(os.path.join(WORK, "chapters.ffmeta"), "w") as fh:
        fh.write(meta)
    with open(os.path.join(OUT, "chapters.txt"), "w") as fh:
        fh.write(text)
    film = os.path.join(OUT, f"{TL['title']}.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-i", video, "-i", audio, "-i", os.path.join(WORK, "chapters.ffmeta"),
         "-map", "0:v", "-map", "1:a", "-map_metadata", "2", "-map_chapters", "2", "-c", "copy",
         "-movflags", "+faststart", film])
    print("wrote", film)


if __name__ == "__main__":
    main()
