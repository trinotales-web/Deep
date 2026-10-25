"""Generate the paper and colored-pencil textures used by the Japan series.

Run from the repo root:  python3 remotion/japan/tools/make_textures.py
Writes PNGs into public/japan/.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join("public", "japan")
rng = np.random.default_rng(7)
PAPER = np.array([243, 237, 224], dtype=np.float32)


def tile_noise(size, scale, octaves=4, seed=0):
    """Tileable value noise built from wrapped, upsampled random grids."""
    r = np.random.default_rng(seed)
    acc = np.zeros((size, size), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        cells = max(2, int(size / scale) * (2 ** o))
        grid = r.random((cells, cells)).astype(np.float32)
        img = Image.fromarray((grid * 255).astype(np.uint8))
        # wrap-pad so bicubic upsampling tiles seamlessly
        big = np.pad(np.array(img), 2, mode="wrap")
        up = Image.fromarray(big).resize(
            (size * (cells + 4) // cells, size * (cells + 4) // cells), Image.BICUBIC
        )
        off = size * 2 // cells
        layer = np.array(up, np.float32)[off:off + size, off:off + size] / 255.0
        acc += layer * amp
        total += amp
        amp *= 0.5
    return acc / total


def pencil_texture(size=512):
    """Paper-coloured speckle overlay: where alpha is high, paper shows through
    the pigment, giving the grainy, hatched look of coloured pencil."""
    img = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(img)
    # dense diagonal strokes (pigment density), drawn 3x3 for seamless wrap
    for _ in range(5200):
        x, y = rng.random() * size, rng.random() * size
        ang = np.deg2rad(-58 + rng.normal(0, 6))
        ln = rng.uniform(18, 70)
        dx, dy = np.cos(ang) * ln, np.sin(ang) * ln
        w = int(rng.choice([1, 1, 2, 2, 3]))
        v = int(rng.uniform(90, 255))
        for ox in (-size, 0, size):
            for oy in (-size, 0, size):
                d.line([(x + ox, y + oy), (x + dx + ox, y + dy + oy)], fill=v, width=w)
    strokes = np.array(img.filter(ImageFilter.GaussianBlur(0.6)), np.float32) / 255.0
    grain = tile_noise(size, 3, octaves=2, seed=3)          # paper tooth
    mottle = tile_noise(size, 90, octaves=3, seed=5)        # uneven pressure
    pigment = np.clip(strokes * 0.75 + mottle * 0.55 - 0.15, 0, 1)
    pigment = pigment * np.clip(grain * 1.6 - 0.15, 0, 1)
    alpha = np.clip(1.0 - pigment * 1.35, 0, 1) * 0.78
    rgba = np.zeros((size, size, 4), np.uint8)
    rgba[..., :3] = PAPER.astype(np.uint8)
    rgba[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def paper(w=1920, h=1080):
    base = np.ones((h, w, 3), np.float32) * PAPER
    big = tile_noise(1024, 160, octaves=4, seed=11)
    big = np.array(Image.fromarray((big * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255.0
    fine = rng.normal(0, 1, (h, w)).astype(np.float32)
    fine = np.array(Image.fromarray(np.clip(fine * 40 + 128, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), np.float32) / 255.0 - 0.5
    # fibres
    fib = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(fib)
    for _ in range(2600):
        x, y = rng.random() * w, rng.random() * h
        a = rng.random() * np.pi
        ln = rng.uniform(4, 22)
        d.line([(x, y), (x + np.cos(a) * ln, y + np.sin(a) * ln)], fill=int(rng.uniform(20, 70)), width=1)
    fib = np.array(fib.filter(ImageFilter.GaussianBlur(0.5)), np.float32) / 255.0
    yy, xx = np.mgrid[0:h, 0:w]
    vig = ((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2
    shade = 1.0 - 0.035 * (big - 0.5) * 2 + fine * 0.035 - fib * 0.05 - 0.05 * np.clip(vig - 0.35, 0, None)
    out = np.clip(base * shade[..., None], 0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGB")


def grain_overlay(size=768):
    """Neutral multiply grain laid over the whole frame to unify everything."""
    n = tile_noise(size, 2, octaves=2, seed=21)
    m = tile_noise(size, 120, octaves=3, seed=22)
    v = np.clip(255 - (1 - n) * 38 - (1 - m) * 14, 0, 255).astype(np.uint8)
    return Image.fromarray(np.stack([v, v, v], -1), "RGB")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    pencil_texture().save(os.path.join(OUT, "pencil.png"), optimize=True)
    paper().save(os.path.join(OUT, "paper.jpg"), quality=90)
    grain_overlay().save(os.path.join(OUT, "grain.jpg"), quality=88)
    print("textures written to", OUT)
