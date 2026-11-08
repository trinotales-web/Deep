import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { ShotProps } from "./timing";
import { Label } from "./captions";
import { sec } from "./shot";

// Real photographs (supplied by the user, kept out of git in public/photos/<episode>).
// Large photos fill the frame with a slow Ken Burns move; small ones sit on a
// framed card over a blurred, darkened copy of themselves so they are never
// blown up past their resolution.

export type PhotoSpec = {
  src: string;
  /** Source size in px. */
  w: number;
  h: number;
  /** Crop [x0, y0, x1, y1] in source px. */
  crop?: [number, number, number, number];
  mode?: "full" | "card";
  /** Ken Burns [scale, focusX, focusY] (focus as fractions of the crop) at start/end. */
  from?: [number, number, number];
  to?: [number, number, number];
  label?: string;
  sub?: string;
  /** Absolute narration time the label pops in. */
  labelAt?: number;
  labelKind?: "title" | "box" | "stamp";
  /** Small corner tag, e.g. REAL PHOTO / ARTIST'S IMPRESSION. */
  tag?: string;
  rot?: number;
  /** Largest blow-up allowed for a card (keeps small images sharp). */
  maxScale?: number;
  /** Several framed cards side by side (each with an optional caption under it). */
  cards?: (Omit<PhotoSpec, "cards"> & { caption?: string })[];
  /** Narration time the cards start popping in (one after another). */
  cardsAt?: number;
};

const Cropped: React.FC<{ spec: PhotoSpec; dw: number; dh: number; style?: React.CSSProperties }> = ({ spec, dw, dh, style }) => {
  const [x0, y0, x1, y1] = spec.crop ?? [0, 0, spec.w, spec.h];
  const k = dw / (x1 - x0);
  return (
    <div style={{ position: "relative", width: dw, height: dh, overflow: "hidden", ...style }}>
      <Img
        src={staticFile(spec.src)}
        style={{ position: "absolute", left: -x0 * k, top: -y0 * k, width: spec.w * k, height: spec.h * k, maxWidth: "none" }}
      />
    </div>
  );
};

export const photoShot = (spec: PhotoSpec): React.FC<ShotProps> => {
  const PhotoShot: React.FC<ShotProps> = ({ start, dur }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const [x0, y0, x1, y1] = spec.crop ?? [0, 0, spec.w, spec.h];
    const cw = x1 - x0;
    const ch = y1 - y0;
    const t = interpolate(frame, [0, Math.max(1, dur)], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
    const [s0, fx0, fy0] = spec.from ?? [1.0, 0.5, 0.5];
    const [s1, fx1, fy1] = spec.to ?? [1.08, 0.5, 0.5];
    const s = s0 + (s1 - s0) * t;
    const fx = fx0 + (fx1 - fx0) * t;
    const fy = fy0 + (fy1 - fy0) * t;
    const mode = spec.mode ?? (cw >= 1400 ? "full" : "card");
    const grade: React.CSSProperties = { filter: "contrast(1.06) saturate(0.95) sepia(0.08)" };
    let content: React.ReactNode;
    if (spec.cards && spec.cards.length) {
      const n = spec.cards.length;
      const slotW = (width - 220) / n;
      const fits = spec.cards.map((c) => {
        const [a0, b0, a1, b1] = c.crop ?? [0, 0, c.w, c.h];
        return Math.min((slotW - 60) / (a1 - a0), 700 / (b1 - b0), c.maxScale ?? 2.6);
      });
      const t0 = spec.cardsAt !== undefined ? sec(start)(spec.cardsAt) : 0;
      content = (
        <>
          <div style={{ position: "absolute", inset: -60, filter: "blur(30px) brightness(0.38) saturate(0.8)" }}>
            <Cropped spec={spec.cards[0]} dw={width + 120} dh={height + 120} />
          </div>
          {spec.cards.map((c, i) => {
            const [a0, b0, a1, b1] = c.crop ?? [0, 0, c.w, c.h];
            const dw = (a1 - a0) * fits[i];
            const dh = (b1 - b0) * fits[i];
            const cx = 110 + slotW * (i + 0.5);
            const k = interpolate(frame - t0 - i * 6, [0, 5, 9], [0, 1.06, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
            const pad = 12;
            return k > 0 ? (
              <div key={i} style={{ position: "absolute", left: cx - dw / 2 - pad, top: height / 2 - dh / 2 - pad + 50, padding: pad, background: "#f4efe4", borderRadius: 6, boxShadow: "0 18px 50px rgba(0,0,0,0.55)", transform: `rotate(${c.rot ?? (i % 2 ? 1.2 : -1.2)}deg) scale(${k * (1 + (s - 1) * 0.5)})`, opacity: Math.min(1, k * 2) }}>
                <Cropped spec={c} dw={dw} dh={dh} style={grade} />
                {c.caption ? (
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 26, color: "#2a2026", textAlign: "center", paddingTop: 10, textTransform: "uppercase", letterSpacing: 1 }}>{c.caption}</div>
                ) : null}
              </div>
            ) : null;
          })}
        </>
      );
    } else if (mode === "full") {
      const cover = Math.max(width / cw, height / ch) * s;
      const dw = cw * cover;
      const dh = ch * cover;
      // place the focus point at the frame centre, clamped so the photo always covers
      const left = Math.min(0, Math.max(width - dw, width / 2 - fx * dw));
      const top = Math.min(0, Math.max(height - dh, height / 2 - fy * dh));
      content = <Cropped spec={spec} dw={dw} dh={dh} style={{ position: "absolute", left, top, ...grade }} />;
    } else {
      const fit = Math.min(1460 / cw, 760 / ch, spec.maxScale ?? 2.6);
      const dw = cw * fit;
      const dh = ch * fit;
      const pad = 16;
      content = (
        <>
          <div style={{ position: "absolute", inset: -60, filter: "blur(30px) brightness(0.42) saturate(0.8)" }}>
            <Cropped spec={spec} dw={width + 120} dh={height + 120} />
          </div>
          <div
            style={{
              position: "absolute",
              left: width / 2 - dw / 2 - pad,
              top: height / 2 - dh / 2 - pad + 40,
              padding: pad,
              background: "#f4efe4",
              borderRadius: 6,
              boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
              transform: `rotate(${spec.rot ?? -1.2}deg) scale(${1 + (s - 1) * 0.6})`,
            }}
          >
            <Cropped spec={spec} dw={dw} dh={dh} style={grade} />
          </div>
        </>
      );
    }
    return (
      <AbsoluteFill style={{ backgroundColor: "#0c0a0a", overflow: "hidden" }}>
        {content}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(10,6,8,0.55) 100%)" }} />
        {spec.tag ? <Label text={spec.tag} x={0.035 + spec.tag.length * 0.0052} y={0.07} size={0.028} kind="box" at={4} /> : null}
        {spec.label ? <Label text={spec.label} sub={spec.sub} x={0.5} y={0.085} size={0.062} kind={spec.labelKind ?? "box"} at={spec.labelAt !== undefined ? sec(start)(spec.labelAt) : 6} /> : null}
      </AbsoluteFill>
    );
  };
  return PhotoShot;
};

