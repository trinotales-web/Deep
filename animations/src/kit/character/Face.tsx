import React from "react";
import * as THREE from "three";
import { Part, Line } from "../Part";
import { X } from "../context";
import { circle, ellipse, blob, type ShapeSpec } from "../shapes";
import { INK, palette } from "../style";

// Faces are authored for a head of radius 100 (scale the head group to resize).

export type EyeKind = "dot" | "open" | "wide" | "half" | "closed" | "happy" | "angry" | "sad" | "squint" | "dead";
export type MouthKind = "smile" | "grin" | "open" | "o" | "flat" | "frown" | "wavy" | "teeth" | "smirk" | "shout" | "tongue";

export type Expression = {
  eyes?: EyeKind;
  mouth?: MouthKind;
  /** -1 angry .. 0 neutral .. 1 worried */
  brows?: number;
  showBrows?: boolean;
  /** Pupil direction, each -1..1. */
  gaze?: [number, number];
  blush?: boolean;
  sweat?: boolean;
  eyebags?: boolean;
};

export type FaceProps = {
  expression: Expression;
  /** 0..1 how far the face is turned toward the facing direction. */
  look: number;
  /** 0..1 eyelid closure from blinking. */
  blink: number;
  /** 0..1 mouth openness while talking (0 = use expression mouth). */
  talk: number;
  freckles?: boolean;
  mustache?: "walrus" | "thin" | "handlebar" | null;
  mustacheColor?: string;
  beard?: "goatee" | "full" | "stubble" | null;
  beardColor?: string;
};

const EYE_RX = 17;
const EYE_RY = 21;

/** Ellipse clipped by an eyelid line: y <= lid + tilt * x (local units). */
const lidEye = (rx: number, ry: number, lid: number, tilt: number, side: number): ShapeSpec => {
  const key = `lideye:${rx}:${ry}:${lid.toFixed(2)}:${tilt.toFixed(3)}:${side}`;
  return {
    key,
    build: () => {
      const pts: THREE.Vector2[] = [];
      const N = 48;
      const lidY = (x: number) => lid + tilt * side * x;
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2;
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry;
        pts.push(new THREE.Vector2(x, Math.min(y, lidY(x))));
      }
      return { shapes: [new THREE.Shape(pts)], contours: [pts] };
    },
  };
};

const Eye: React.FC<{ kind: EyeKind; side: -1 | 1; blink: number; gaze: [number, number]; brows: number }> = ({
  kind,
  side,
  blink,
  gaze,
  brows,
}) => {
  const lw = 5.5;
  const effective: EyeKind = blink > 0.85 && kind !== "closed" && kind !== "happy" && kind !== "squint" && kind !== "dead" ? "closed" : kind;

  if (effective === "closed") {
    return <Line pts={[[-15, 2], [-7, -5], [7, -5], [15, 2]]} smooth width={lw} />;
  }
  if (effective === "happy") {
    return <Line pts={[[-15, -6], [-8, 6], [8, 6], [15, -6]]} smooth width={lw} />;
  }
  if (effective === "squint") {
    const s = side;
    return <Line pts={[[-12 * s, 10], [10 * s, 0], [-12 * s, -10]]} width={lw} />;
  }
  if (effective === "dead") {
    return (
      <>
        <Line pts={[[-11, 11], [11, -11]]} width={lw} />
        <Line pts={[[-11, -11], [11, 11]]} width={lw} />
      </>
    );
  }
  if (effective === "dot") {
    const sy = 1 - blink;
    return <Part shape={ellipse(7.5, 10)} color={INK} flat outline={0} sy={Math.max(0.12, sy)} x={gaze[0] * 3} y={gaze[1] * 3} />;
  }

  // Sclera eyes with lids.
  const wide = effective === "wide";
  const rx = wide ? 22 : EYE_RX;
  const ry = wide ? 24 : EYE_RY;
  let lid = ry;
  let tilt = 0;
  if (effective === "half") lid = 3;
  // tilt > 0 lowers the lid toward the nose (angry), < 0 toward the temple (sad)
  if (effective === "angry") {
    lid = 7;
    tilt = 0.42;
  }
  if (effective === "sad") {
    lid = 9;
    tilt = -0.32;
  }
  // blinking pulls the lid down
  lid = lid - (lid + ry) * blink;
  const pr = wide ? 5 : 7.5;
  const px = gaze[0] * (rx - pr - 3);
  const lidAtPx = lid + tilt * side * px;
  const py = Math.min(gaze[1] * (ry - pr - 3) - (effective === "half" ? 6 : 0), lidAtPx - pr * 0.6);
  return (
    <>
      <Part shape={lidEye(rx, ry, lid, tilt, side)} color="#ffffff" flat outline={lw} />
      {lid > -ry + 6 ? <Part shape={circle(pr)} color={INK} flat outline={0} x={px} y={Math.max(py, -ry + pr)} z={0.001} /> : null}
      {effective === "half" || effective === "angry" || effective === "sad" ? (
        <Line pts={[[-rx - 2, lid - tilt * side * (rx + 2)], [rx + 2, lid + tilt * side * (rx + 2)]]} width={lw * 1.1} z={0.002} />
      ) : null}
      {brows !== 0 || effective === "angry" ? null : null}
    </>
  );
};

const Brow: React.FC<{ side: -1 | 1; brows: number; kind: EyeKind }> = ({ side, brows, kind }) => {
  const b = kind === "angry" ? Math.min(brows, -0.7) : brows;
  // inner end is toward the face center (x = -side * ...)
  const inner: [number, number] = [-side * 2, 34 + b * 12];
  const outer: [number, number] = [side * 22, 36 - b * 6];
  const mid: [number, number] = [side * 10, 40 + Math.abs(b) * 2];
  return <Line pts={side > 0 ? [inner, mid, outer] : [outer, mid, inner]} smooth width={6} />;
};

const Mouth: React.FC<{ kind: MouthKind; talk: number }> = ({ kind, talk }) => {
  const lw = 5.5;
  if (talk > 0.05 && kind !== "teeth") {
    const h = 4 + talk * 16;
    return (
      <>
        <Part shape={blob([[-14, 2], [0, 4], [14, 2], [10, -h], [0, -h - 3], [-10, -h]], 6)} color={palette.mouth} flat outline={lw} />
        {talk > 0.4 ? <Part shape={ellipse(7, 3.5)} color={palette.tongue} flat outline={0} y={-h + 3} z={0.001} /> : null}
      </>
    );
  }
  switch (kind) {
    case "smile":
      return <Line pts={[[-15, 3], [-7, -4], [7, -4], [15, 3]]} smooth width={lw} />;
    case "smirk":
      return <Line pts={[[-12, -2], [0, -3], [10, 0], [16, 6]]} smooth width={lw} />;
    case "flat":
      return <Line pts={[[-12, 0], [12, 0]]} width={lw} />;
    case "frown":
      return <Line pts={[[-14, -5], [-6, 2], [6, 2], [14, -5]]} smooth width={lw} />;
    case "wavy":
      return <Line pts={[[-16, 0], [-10, 4], [-4, -2], [2, 4], [8, -2], [14, 3]]} smooth width={lw * 0.9} />;
    case "o":
      return <Part shape={ellipse(8, 10)} color={palette.mouth} flat outline={lw} />;
    case "grin":
    case "tongue":
      return (
        <>
          <Part shape={blob([[-20, 4], [0, 6], [20, 4], [14, -12], [0, -18], [-14, -12]], 8)} color={palette.mouth} flat outline={lw} />
          <Part shape={ellipse(9, 5)} color={palette.tongue} flat outline={0} y={-11} z={0.001} />
        </>
      );
    case "shout":
      return (
        <>
          <Part shape={blob([[-18, 8], [0, 10], [18, 8], [16, -16], [0, -26], [-16, -16]], 8)} color={palette.mouth} flat outline={lw} />
          <Part shape={ellipse(10, 6)} color={palette.tongue} flat outline={0} y={-18} z={0.001} />
        </>
      );
    case "teeth":
      return (
        <>
          <Part shape={blob([[-22, 8], [22, 8], [24, -8], [-24, -8]], 4)} color="#ffffff" flat outline={lw} />
          <Line pts={[[-21, 0], [21, 0]]} width={3.5} z={0.001} />
          {[-12, -4, 4, 12].map((x) => (
            <Line key={x} pts={[[x, 8], [x, -8]]} width={3} z={0.001} />
          ))}
        </>
      );
    case "open":
    default:
      return (
        <>
          <Part shape={ellipse(12, 10)} color={palette.mouth} flat outline={lw} />
          <Part shape={ellipse(7, 3.5)} color={palette.tongue} flat outline={0} y={-5} z={0.001} />
        </>
      );
  }
};

export const Face: React.FC<FaceProps> = ({
  expression,
  look,
  blink,
  talk,
  freckles,
  mustache,
  mustacheColor = palette.hairDark,
  beard,
  beardColor = palette.hairDark,
}) => {
  const {
    eyes = "open",
    mouth = "smile",
    brows = 0,
    showBrows = eyes === "angry" || brows !== 0,
    gaze = [0.25, -0.1],
    blush = false,
    sweat = false,
    eyebags = false,
  } = expression;
  const fx = look * 34; // features shift toward the facing direction
  const eyeY = 2;
  const eyeDX = 31;
  return (
    <X x={fx}>
      {([-1, 1] as const).map((side) => (
        <X key={side} x={side * eyeDX + side * (side > 0 ? -look * 4 : look * 4)} y={eyeY} z={0.02}>
          <Eye kind={eyes} side={side} blink={blink} gaze={gaze} brows={brows} />
          {showBrows ? <Brow side={side} brows={brows} kind={eyes} /> : null}
          {eyebags ? <Line pts={[[-12, -26], [0, -30], [12, -26]]} smooth width={3.5} color="#8f8899" /> : null}
        </X>
      ))}
      {blush ? (
        <>
          <Part shape={ellipse(15, 9)} color={palette.blush} flat outline={0} opacity={0.75} x={-40} y={-30} z={0.01} />
          <Part shape={ellipse(15, 9)} color={palette.blush} flat outline={0} opacity={0.75} x={40} y={-30} z={0.01} />
        </>
      ) : null}
      {freckles
        ? [-1, 1].flatMap((side) =>
            [
              [36, -28],
              [46, -34],
              [42, -22],
            ].map(([x, y], i) => (
              <Part key={`${side}${i}`} shape={circle(2.6)} color={palette.freckle} flat outline={0} x={side * x} y={y} z={0.011} />
            )),
          )
        : null}
      {beard === "full" ? (
        <Part
          shape={blob([[-62, -10], [-50, -50], [-24, -82], [0, -90], [24, -82], [50, -50], [62, -10], [36, -28], [0, -36], [-36, -28]], 8)}
          color={beardColor}
          shade={0.3}
          z={0.015}
        />
      ) : null}
      {beard === "stubble"
        ? [-30, -18, -6, 6, 18, 30, -24, -12, 0, 12, 24].map((x, i) => (
            <Part key={i} shape={circle(1.8)} color="#8f8899" flat outline={0} x={x} y={i < 6 ? -62 : -72} z={0.011} />
          ))
        : null}
      <X y={-44} z={0.03}>
        <Mouth kind={mouth} talk={talk} />
      </X>
      {beard === "goatee" ? (
        <Part shape={blob([[-8, 0], [8, 0], [4, -26], [0, -32], [-4, -26]], 6)} color={beardColor} flat y={-58} z={0.031} />
      ) : null}
      {mustache === "walrus" ? (
        <Part
          shape={blob([[-36, -18], [-30, -4], [-12, 4], [0, 0], [12, 4], [30, -4], [36, -18], [18, -14], [0, -10], [-18, -14]], 8)}
          color={mustacheColor}
          shade={0.2}
          y={-22}
          z={0.04}
        />
      ) : null}
      {mustache === "thin" ? (
        <Part shape={blob([[-24, -8], [-12, 2], [0, -2], [12, 2], [24, -8], [0, -6]], 8)} color={mustacheColor} flat y={-28} z={0.04} />
      ) : null}
      {mustache === "handlebar" ? (
        <Part
          shape={blob([[-34, 0], [-26, -8], [-12, 0], [0, -2], [12, 0], [26, -8], [34, 0], [30, -12], [12, -10], [0, -8], [-12, -10], [-30, -12]], 6)}
          color={mustacheColor}
          flat
          y={-24}
          z={0.04}
        />
      ) : null}
      {sweat ? (
        <Part shape={blob([[0, 14], [7, 0], [5, -8], [0, -10], [-5, -8], [-7, 0]], 6)} color="#bfe6ff" flat outline={3.5} x={78} y={52} z={0.05} />
      ) : null}
    </X>
  );
};
