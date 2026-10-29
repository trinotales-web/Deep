import React from "react";
import { interpolate } from "remotion";
import { X, Part, InkLine, poly, ellipse } from "../../kit";

/** Frames from the shot's start (in seconds on the VO timeline) to absolute time `s`. */
export const sec = (shotStartFrames: number) => (s: number) => Math.round(s * 30 - shotStartFrames);

/** Overshoot pop 0 → 1.15 → 1 starting at absolute time `at`. */
export const pop = (t: number, at: number) =>
  interpolate(t, [at, at + 0.12, at + 0.22], [0, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const CJK = "Montserrat, 'WenQuanYi Zen Hei', sans-serif";

/** World point → Label position (fractions of a 1920×1080 frame) for a camera (zoom, x, y). */
export const scr = (x: number, y: number, zoom = 1, cx = 0, cy = 0) => ({ x: 0.5 + ((x - cx) * zoom) / 1920, y: 0.5 - ((y - cy) * zoom) / 1080 });

/** Thick map arrow that grows along `pts` (k 0..1) with a head at the tip. */
export const GrowArrow: React.FC<{ pts: [number, number][]; k: number; color?: string; width?: number; z?: number }> = ({ pts, k, color = "#2f5f9a", width = 26, z = 0 }) => {
  if (k <= 0.001) return null;
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let left = total * Math.min(1, k);
  const out: [number, number][] = [pts[0]];
  let ang = 0;
  for (let i = 0; i < seg.length && left > 0; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const q = Math.min(1, left / seg[i]);
    out.push([ax + (bx - ax) * q, ay + (by - ay) * q]);
    ang = Math.atan2(by - ay, bx - ax);
    left -= seg[i];
  }
  const tip = out[out.length - 1];
  return (
    <X z={z}>
      {out.length > 1 ? <InkLine pts={out} width={width} color={color} outline={7} /> : null}
      <X x={tip[0]} y={tip[1]} rot={ang} z={0.01}>
        <Part shape={poly([[width * 1.6, 0], [-width * 0.6, width * 1.3], [-width * 0.6, -width * 1.3]])} color={color} shade={0.15} />
      </X>
    </X>
  );
};

/** White speech bubble (write in it with a Label). Origin = bubble centre, tail toward (tx, ty). */
export const SpeechBubble: React.FC<{ x: number; y: number; w?: number; h?: number; tx: number; ty: number; s?: number; z?: number }> = ({ x, y, w = 420, h = 200, tx, ty, s = 1, z = 0 }) => {
  if (s <= 0.001) return null;
  const a = Math.atan2(ty - y, tx - x);
  const n: [number, number] = [-Math.sin(a), Math.cos(a)];
  return (
    <X x={x} y={y} s={s} z={z}>
      <Part shape={ellipse(w / 2, h / 2)} color="#ffffff" flat outline={8} />
      <Part
        shape={poly([[n[0] * 40, n[1] * 40], [(tx - x) / s, (ty - y) / s], [-n[0] * 40, -n[1] * 40]])}
        color="#ffffff"
        flat
        outline={8}
        z={-0.001}
      />
    </X>
  );
};
