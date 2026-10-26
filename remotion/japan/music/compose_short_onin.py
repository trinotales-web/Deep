"""Original score for the Onin War Short (9:16, about 50 s).

Same instruments as the film (synth.py). Cue times come from the Short's own
timeline (remotion/shorts/onin.json, written by make_onin.py), so every hit
lands on its word, and the music ducks under the Short's voice track.

  hook        fire crackle and a drone; a big hit on "nobody won"
  yoshimasa   an elegant koto and flute line for the art-loving shogun
  promise     a question pluck for "no son", a swish as the scroll is passed
  baby        sparkles for the baby boy, then an "uh-oh" slide
  seat        a tug-of-war tremolo building to a clash
  onin        a heavy title hit; a comic boing for "onion"
  streets     the taiko battle groove from Part 4
  leaders     the Red Monk's heavy reed; an awkward woodblock for the in-law
  fire        crackling fire, tremolo, one hit per burning building
  destroyed   a lament on the flute and a temple bell
  ten years   a big hit and a ticking clock
  nobody won  a hollow bell and a deflating slide
  end card    a swell into a bright little sign-off

Run make_onin.py rather than this script; it passes the voice track:
    python3 remotion/shorts/make_onin.py
"""
import json
import os
import re

import synth
from synth import *  # noqa: F401,F403  (instruments, helpers, constants)
from synth import cli, configure, render

TL = json.load(open(os.path.join(os.path.dirname(__file__), "..", "..", "shorts", "onin.json")))
SHOT = {s["id"]: (s["start"], s["end"]) for s in TL["shots"]}
DUR = TL["duration"] / TL["fps"]
synth.NARRATION_OFFSET = 0.0  # the voice track starts with the Short
configure(DUR)


def w(text, shot, k=0):
    """Time of the k-th `text` spoken in `shot`."""
    hits = [x["s"] for x in TL["words"] if x["shot"] == shot and re.sub(r"[^a-z-]", "", x["w"].lower()) == text]
    return hits[k]


def score():
    # ---- hook: "It lasted ten whole years ... and nobody won."
    a, b = SHOT["hook"]
    place(taiko(0.85, 1.3), a + 0.02, rev=0.5)
    place(crash(0.3), a + 0.02, 0.2, rev=0.5)
    place(fire(b - a, 0.22), a, 0.0, rev=0.2)
    place(pad(["D2", "A2", "D3", "Eb3"], b - a + 0.3, 0.36, attack=0.2, release=0.5, bright=1.3), a, rev=0.45)
    t = a + 0.2
    while t < w("nobody", "hook") - 0.1:  # nervous tremolo
        place(koto(hz("D5" if int((t - a) / 0.09) % 2 else "Eb5"), 0.07, 0.14, ring=0.3), t, -0.3, rev=0.3)
        t += 0.09
    nobody = w("nobody", "hook")
    place(taiko(1.0, 1.4), nobody, rev=0.55)
    place(boom(0.35), nobody, 0.0, rev=0.3)
    place(koto(hz("D5"), 0.9, 0.38, slide=-12), w("won", "hook") + 0.1, 0.2, rev=0.35)

    # ---- Yoshimasa: art and tea
    a, b = SHOT["yoshimasa"]
    place(swish(), a - 0.15)
    chord_track([(a, b, ["D3", "A3", "D4", "F#4", "A4"])], vel=0.3, attack=0.3)
    arpeggio(a, b, ["D5", "E5", "F#5", "A5", "B5", "A5", "F#5", "E5"], BEAT / 4, 0.18, -0.3, dur=0.3)
    place(glock(hz("A6"), 0.3), w("yoshimasa", "yoshimasa"), 0.3, rev=0.6)
    melody(a + 0.3, [("F#5", 0.5), ("A5", 0.5), ("B5", 1.0), ("A5", 1.5)], vel=0.3, vib=0.8)

    # ---- no son, so the brother gets the title
    a, b = SHOT["promise"]
    place(swish(), a - 0.15)
    place(pad(["G2", "D3", "G3", "B3"], b - a, 0.28, attack=0.3, release=0.5), a, rev=0.45)
    place(koto(hz("B4"), 0.5, 0.36, bend=0.6), w("son", "promise") - 0.05, -0.2, rev=0.3)  # ...?
    place(swish(0.2), w("promised", "promise"), 0.2)
    for k, n in enumerate(["G4", "B4", "D5", "G5"]):
        place(koto(hz(n), 0.4, 0.28), w("brother", "promise") + k * 0.08, 0.3, rev=0.35)
    place(glock(hz("G6"), 0.24), w("brother", "promise") + 0.35, 0.3, rev=0.6)

    # ---- a baby boy (uh-oh)
    a, b = SHOT["baby"]
    place(swish(), a - 0.15)
    chord_track([(a, b, ["C3", "G3", "C4", "E4", "G4"])], vel=0.26, attack=0.4)
    for k, n in enumerate(["C6", "E6", "G6", "C7"]):
        place(glock(hz(n), 0.24), w("baby", "baby") + k * 0.07, -0.2 + k * 0.15, rev=0.6)
    place(bell(hz("G5"), 0.3, 2.0), w("boy", "baby"), 0.2, rev=0.6)
    place(woodblock(700, 0.3), b - 0.45, -0.2)
    place(koto(hz("E4"), 0.5, 0.34, slide=-5), b - 0.42, -0.2, rev=0.3)

    # ---- two people, one seat
    a, b = SHOT["seat"]
    place(swish(), a - 0.15)
    place(pad(["D3", "A3", "D4", "Eb4"], b - a, 0.3, attack=0.3, release=0.4, bright=1.3), a, rev=0.45)
    t, k = a + 0.1, 0
    while t < b - 0.2:  # tug of war
        place(koto(hz("A4" if k % 2 else "Bb4"), 0.12, 0.12 + 0.14 * (t - a) / (b - a), ring=0.4), t, 0.3 if k % 2 else -0.3, rev=0.3)
        if k % 4 == 0:
            place(taiko(0.3 + 0.3 * (t - a) / (b - a), 1.25), t, rev=0.35)
        t += BEAT / 4
        k += 1
    place(crash(0.3), w("son", "seat") + 0.3, 0.0, rev=0.5)
    place(taiko(0.8, 1.2), w("son", "seat") + 0.3, rev=0.5)

    # ---- the Onin War (not onion)
    a, b = SHOT["onin"]
    onin = w("onin", "onin")
    place(noise_swell(0.6, 0.2, 300, 6000), onin - 0.6, rev=0.4)
    place(taiko(1.0, 1.4), onin, rev=0.6)
    place(crash(0.4), onin, 0.0, rev=0.6)
    place(pad(["D2", "A2", "D3", "F3", "A3"], b - onin, 0.4, attack=0.05, release=0.6, bright=1.3), onin, rev=0.5)
    place(bass(hz("D2"), 1.6, 0.45, pluck=False), onin)
    onion = w("onion", "onin")
    place(boing(330, 0.42), onion - 0.05, 0.2, rev=0.3)
    place(woodblock(900, 0.3), onion + 0.4, 0.2)

    # ---- war in the streets of Kyoto
    a, b = SHOT["streets"]
    place(swish(), a - 0.15)
    groove(a, b, [(a, "Dm"), (a + (b - a) / 2, "Bb")], "battle", pad_vel=0.3, arp_vel=0.12)
    place(crash(0.3), b - 0.25, 0.0, rev=0.5)

    # ---- the Red Monk and his son-in-law
    a, b = SHOT["leaders"]
    scary, red = w("scary", "leaders"), w("red", "leaders")
    other = w("other", "leaders") - 0.2
    son = w("son-in-law", "leaders")
    place(pad(["D2", "A2", "D3", "Eb3"], other - a, 0.36, attack=0.2, release=0.4, bright=1.4), a, rev=0.45)
    for t0 in (scary, scary + BEAT, red):
        place(taiko(0.6, 1.35), t0, rev=0.45)
    for t0, n, d in [(scary + 0.1, "D3", 0.8), (scary + 0.95, "Eb3", 0.5), (red, "D3", 1.2)]:
        place(reed(hz(n) * 2, d, 0.42), t0, -0.3, rev=0.45)
    place(crash(0.25), red + 0.05, -0.3, rev=0.5)
    place(pad(["G2", "D3", "G3", "Bb3"], b - other, 0.28, attack=0.3, release=0.4), other, rev=0.45)
    arpeggio(other, son, ["G4", "Bb4", "D5", "Bb4"], BEAT / 2, 0.18, 0.3)
    place(glock(hz("D6"), 0.22), son, 0.3, rev=0.6)
    place(woodblock(700, 0.32), son + 0.55, 0.3)  # awkward...
    place(koto(hz("Bb4"), 0.5, 0.36, slide=-4), son + 0.57, 0.3, rev=0.3)

    # ---- fire: houses, temples and palaces
    a, b = SHOT["fire"]
    place(swish(), a - 0.15)
    place(fire(b - a + 0.6, 0.3), a, 0.0, rev=0.2)
    place(pad(["D3", "A3", "Eb4", "A4"], b - a, 0.3, attack=0.3, release=0.5, bright=1.3), a, rev=0.45)
    t = a + 0.1
    while t < b - 0.1:
        place(koto(hz("D5" if int((t - a) / 0.09) % 2 else "Eb5"), 0.07, 0.1 + 0.12 * (t - a) / (b - a), ring=0.3), t, -0.3, rev=0.3)
        t += 0.09
    for word, sz in [("houses", 1.2), ("temples", 1.25), ("palaces", 1.3)]:
        place(taiko(0.6, sz), w(word, "fire"), rev=0.45)
        place(crash(0.18), w(word, "fire"), 0.3, rev=0.4)

    # ---- Kyoto destroyed: a lament
    a, b = SHOT["destroyed"]
    chord_track([(a, a + (b - a) / 2, ["D3", "A3", "D4", "F4"]), (a + (b - a) / 2, b + 0.3, ["Bb2", "F3", "Bb3", "D4"])], vel=0.32, attack=0.5)
    melody(w("slowly", "destroyed"), [("A4", 1.0), ("F4", 0.5), ("E4", 0.5), ("D4", 1.0), ("E4", 0.5), ("D4", 1.5)], vel=0.34, vib=1.2)
    place(bell(hz("D3"), 0.45, 3.5), w("destroyed", "destroyed"), rev=0.6)

    # ---- ten whole years
    a, b = SHOT["tenyears"]
    ten = w("ten", "tenyears")
    place(taiko(0.95, 1.25), ten, rev=0.5)
    place(crash(0.32), ten, 0.2, rev=0.55)
    chord_track([(ten, b, ["G2", "D3", "G3", "B3", "D4", "G4"])], vel=0.4, attack=0.05, bright=1.3)
    for k in range(int((b - ten) / (BEAT / 2))):  # time ticking away
        place(woodblock(1300 if k % 2 == 0 else 1000, 0.18), ten + 0.3 + k * BEAT / 2, 0.3 if k % 2 else -0.3)

    # ---- nobody won
    a, b = SHOT["nobody"]
    place(pad(["D3", "A3", "D4", "F4"], b - a + 0.2, 0.26, attack=0.4, release=0.6, bright=0.8), a, rev=0.55)
    place(bell(hz("A3"), 0.35, 3.0), w("dead", "nobody"), rev=0.6)
    place(koto(hz("D5"), 1.0, 0.36, slide=-14), w("won", "nobody") + 0.05, 0.2, rev=0.35)

    # ---- end card: what came next was even worse...
    a, b = SHOT["cta"]
    place(noise_swell(0.7, 0.25, 300, 7000), a - 0.6, rev=0.4)
    place(taiko(0.9, 1.3), a, rev=0.55)
    place(crash(0.35), a, 0.0, rev=0.55)
    groove(a + 0.05, b - 0.6, [(a + 0.05, "Dm"), (a + 1.3, "Bb"), (a + 2.5, "A")], "battle", pad_vel=0.3, arp_vel=0.14)
    place(taiko(0.9, 1.3), b - 0.6, rev=0.6)
    place(crash(0.3), b - 0.6, 0.0, rev=0.6)
    place(pad(["D3", "A3", "D4", "F#4", "A4"], 0.7, 0.36, attack=0.02, release=0.6), b - 0.6, rev=0.5)


def levels():
    out = []
    for s in TL["shots"]:
        target = {"hook": -27.0, "cta": -20.0}.get(s["id"], -30.0)
        out.append((s["start"], s["end"], target))
    return out


if __name__ == "__main__":
    args = cli(os.path.join("out", "shorts_work", "onin_music.wav"))
    score()
    render(levels(), args.narration, args.out)
