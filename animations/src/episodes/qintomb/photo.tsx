import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { sec } from "../../kit/shot";

// Real photographs (supplied by the user, kept out of git in public/photos/qin).
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
    if (mode === "full") {
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

const REAL = "REAL PHOTO";

export const CarriagePhoto = photoShot({
  src: "photos/qin/bronze-carriage.jpg", w: 2560, h: 1610, mode: "full",
  from: [1.0, 0.5, 0.5], to: [1.35, 0.42, 0.24], tag: REAL, label: "THE EMPEROR'S CARRIAGE", sub: "BRONZE MODEL FROM THE TOMB", labelAt: 27.9,
});
export const CrossbowPhoto = photoShot({
  src: "photos/qin/crossbows-illustration.jpg", w: 575, h: 533, mode: "card", rot: 1.2,
  from: [1.0, 0.5, 0.5], to: [1.08, 0.5, 0.5], tag: "ARTIST'S IMPRESSION",
});
export const AerialPhoto = photoShot({
  src: "photos/qin/mausoleum-collage.jpg", w: 400, h: 304, crop: [0, 0, 400, 150], mode: "card",
  tag: REAL, label: "76 M", sub: "THE MOUND TODAY", labelAt: 221.6,
});
export const ExcavationPhoto = photoShot({
  src: "photos/qin/excavation-1974.png", w: 945, h: 747, mode: "card", rot: -1.5,
  tag: REAL, label: "1974", labelAt: 103.2,
});
export const PitPhoto = photoShot({
  src: "photos/qin/pit-1.jpg", w: 1600, h: 1274, mode: "full",
  from: [1.0, 0.5, 0.4], to: [1.28, 0.5, 0.62], tag: REAL, label: "8,000+", sub: "PIT 1", labelAt: 107.1,
});
export const ArchersPhoto = photoShot({
  src: "photos/qin/kneeling-archers.jpg", w: 700, h: 467, mode: "card", rot: 1.0,
  tag: REAL, label: "ARCHERS", labelAt: 109.4,
});
export const FacesPhoto = photoShot({
  src: "photos/qin/warriors-horses.jpg", w: 1024, h: 824, mode: "card", rot: -1.0,
  tag: REAL, label: "EVERY FACE IS DIFFERENT", labelAt: 114.6,
});
export const BrokenPhoto = photoShot({
  src: "photos/qin/broken-warrior.jpg", w: 1500, h: 1000, mode: "full",
  from: [1.0, 0.5, 0.5], to: [1.22, 0.7, 0.62], tag: REAL, label: "SMASHED AND BURNED", labelAt: 135.3,
});
export const MoundPhoto = photoShot({
  src: "photos/qin/mound-today.jpg", w: 768, h: 413, mode: "card", rot: -0.8,
  tag: REAL, label: "NEVER OPENED", labelKind: "stamp", labelAt: 146.3,
});
export const ReconstructionPhoto = photoShot({
  src: "photos/qin/mound-reconstruction.jpg", w: 480, h: 270, mode: "card", rot: 0.8, maxScale: 2.7,
  from: [1.0, 0.5, 0.5], to: [1.1, 0.5, 0.5], tag: "3D RECONSTRUCTION", label: "A HUGE MAN-MADE HILL", labelAt: 209.5,
});
