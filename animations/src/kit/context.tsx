import React, { createContext, useContext } from "react";
import { DEFAULT_SHADOW_MUL } from "./style";

// 2D affine: world = [a c tx; b d ty] * local
export type Affine = [number, number, number, number, number, number];

export type Light =
  | { dir: [number, number] } // direction TOWARD the light, world space
  | { pos: [number, number] }; // point light position, world space

export type KitContext = {
  m: Affine;
  /** Outline width in local units. */
  line: number;
  light: Light;
  /** Multiplier that turns a lit color into its shadow tone. */
  shadowMul: [number, number, number];
  /** Shadow size as a fraction of the shape's thickness. */
  shade: number;
  /** Accumulated object scale (camera excluded) used to keep outlines even. */
  ls: number;
};

const IDENTITY: Affine = [1, 0, 0, 1, 0, 0];

export const Ctx = createContext<KitContext>({
  m: IDENTITY,
  line: 8,
  light: { dir: [-0.9, 0.42] },
  shadowMul: DEFAULT_SHADOW_MUL,
  shade: 0.22,
  ls: 1,
});

/**
 * Outline widths are given at scale 1. Like the reference art, lines grow only
 * a little when an object is drawn bigger (screen width ∝ scale^0.35).
 */
export const lineLocal = (w: number, ls: number) => Math.round(w * Math.pow(ls, -0.65) * 4) / 4;

export const useKit = () => useContext(Ctx);

export const compose = (p: Affine, x: number, y: number, rot: number, sx: number, sy: number): Affine => {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const la = cos * sx;
  const lb = sin * sx;
  const lc = -sin * sy;
  const ld = cos * sy;
  return [
    p[0] * la + p[2] * lb,
    p[1] * la + p[3] * lb,
    p[0] * lc + p[2] * ld,
    p[1] * lc + p[3] * ld,
    p[0] * x + p[2] * y + p[4],
    p[1] * x + p[3] * y + p[5],
  ];
};

export type XProps = {
  x?: number;
  y?: number;
  z?: number;
  rot?: number;
  s?: number;
  sx?: number;
  sy?: number;
  /** Override outline width for everything inside. */
  line?: number;
  light?: Light;
  shadowMul?: [number, number, number];
  shade?: number;
  visible?: boolean;
  /** Camera transforms don't count toward outline scaling. */
  camera?: boolean;
  children?: React.ReactNode;
};

/**
 * Transform group. Use this (not a bare <group>) so lighting and outline
 * settings stay correct for rotated / scaled / flipped parts.
 */
export const X: React.FC<XProps> = ({
  x = 0,
  y = 0,
  z = 0,
  rot = 0,
  s = 1,
  sx = 1,
  sy = 1,
  line,
  light,
  shadowMul,
  shade,
  visible = true,
  camera = false,
  children,
}) => {
  const parent = useKit();
  // a zero scale (e.g. a pop-in at its first frame) would make the outline math divide by zero
  if (s * sx === 0 || s * sy === 0) return null;
  const scl = Math.sqrt(Math.abs(s * sx * s * sy));
  const value: KitContext = {
    m: compose(parent.m, x, y, rot, s * sx, s * sy),
    line: line ?? parent.line,
    light: light ?? parent.light,
    shadowMul: shadowMul ?? parent.shadowMul,
    shade: shade ?? parent.shade,
    ls: camera ? parent.ls : parent.ls * scl,
  };
  return (
    <group position={[x, y, z]} rotation={[0, 0, rot]} scale={[s * sx, s * sy, 1]} visible={visible}>
      <Ctx.Provider value={value}>{children}</Ctx.Provider>
    </group>
  );
};

/** Unit direction toward the light, expressed in the local space of `m`. */
export const localLightDir = (m: Affine, light: Light): [number, number] => {
  let wx: number;
  let wy: number;
  if ("dir" in light) {
    [wx, wy] = light.dir;
  } else {
    wx = light.pos[0] - m[4];
    wy = light.pos[1] - m[5];
  }
  // inverse of the linear part
  const det = m[0] * m[3] - m[2] * m[1] || 1e-9;
  const lx = (m[3] * wx - m[2] * wy) / det;
  const ly = (-m[1] * wx + m[0] * wy) / det;
  const len = Math.hypot(lx, ly) || 1;
  return [lx / len, ly / len];
};
