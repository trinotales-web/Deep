import React, { useMemo } from "react";
import * as THREE from "three";
import { X, useKit, localLightDir, lineLocal, type XProps } from "./context";
import { buildGeo, buildLine, smoothOpen, type ShapeSpec } from "./shapes";
import { INK, hexToRgb, mixHex, mulHex } from "./style";

const VERT = /* glsl */ `
uniform vec2 uOffset;
void main() {
  vec3 p = position + vec3(uOffset, 0.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(uColor, uOpacity);
}`;

export const flatMaterial = () =>
  new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uOffset: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Vector3(1, 1, 1) },
      uOpacity: { value: 1 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

const setColor = (m: THREE.ShaderMaterial, hex: string, opacity = 1) => {
  const [r, g, b] = hexToRgb(hex);
  (m.uniforms.uColor.value as THREE.Vector3).set(r, g, b);
  m.uniforms.uOpacity.value = opacity;
};

const makeShadedMaterials = (bands: number) => {
  const base = flatMaterial();
  base.stencilWrite = true;
  base.stencilRef = 1;
  base.stencilFunc = THREE.AlwaysStencilFunc;
  base.stencilZPass = THREE.ReplaceStencilOp;

  const bandMats = Array.from({ length: bands }, () => {
    const m = flatMaterial();
    m.stencilWrite = true;
    m.stencilRef = 1;
    m.stencilFunc = THREE.EqualStencilFunc;
    m.stencilZPass = THREE.KeepStencilOp;
    m.stencilFail = THREE.KeepStencilOp;
    return m;
  });

  const clear = flatMaterial();
  clear.colorWrite = false;
  clear.stencilWrite = true;
  clear.stencilRef = 0;
  clear.stencilFunc = THREE.AlwaysStencilFunc;
  clear.stencilZPass = THREE.ReplaceStencilOp;

  const outline = flatMaterial();
  return { base, bandMats, clear, outline, all: [base, ...bandMats, clear, outline] };
};

export type PartProps = XProps & {
  shape: ShapeSpec;
  color: string;
  /** Shadow tone. Defaults to color * scene shadow multiplier. */
  shadow?: string;
  /** No cel shading (fill + outline only). */
  flat?: boolean;
  /** Shadow width as a fraction of the shape thickness. */
  shade?: number;
  /** Softness of the shadow edge (fraction of shadow width). */
  soft?: number;
  bands?: number;
  /** Outline width; 0 disables the outline. */
  outline?: number;
  outlineColor?: string;
  opacity?: number;
};

/**
 * A filled, outlined vector shape with the reference cel shading:
 * a soft crescent of shadow on the side facing away from the light.
 */
export const Part: React.FC<PartProps> = ({
  shape,
  color,
  shadow,
  flat = false,
  shade,
  soft = 0.18,
  bands = 6,
  outline,
  outlineColor = INK,
  opacity = 1,
  children,
  ...xform
}) => {
  return (
    <X {...xform}>
      <PartMesh
        shape={shape}
        color={color}
        shadow={shadow}
        flat={flat}
        shade={shade}
        soft={soft}
        bands={bands}
        outline={outline}
        outlineColor={outlineColor}
        opacity={opacity}
      />
      {children}
    </X>
  );
};

type MeshProps = Pick<PartProps, "shape" | "color" | "shadow" | "flat" | "shade" | "soft" | "bands" | "outline" | "outlineColor" | "opacity">;

const PartMesh: React.FC<MeshProps> = ({
  shape,
  color,
  shadow,
  flat,
  shade,
  soft = 0.18,
  bands = 6,
  outline,
  outlineColor = INK,
  opacity = 1,
}) => {
  const kit = useKit();
  const lw = lineLocal(outline ?? kit.line, kit.ls);
  const built = buildGeo(shape, lw);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", built.geometry.getAttribute("position"));
    g.setIndex(built.geometry.index);
    g.boundingSphere = built.geometry.boundingSphere;
    let mi = 0;
    if (flat) {
      g.addGroup(0, built.fillCount, mi++);
    } else {
      g.addGroup(0, built.fillCount, mi++);
      for (let i = 0; i < bands; i++) g.addGroup(0, built.fillCount, mi++);
      g.addGroup(0, built.fillCount, mi++);
    }
    if (built.outlineCount > 0) g.addGroup(built.outlineStart, built.outlineCount, mi++);
    else mi++;
    return g;
  }, [built, flat, bands]);

  const mats = useMemo(() => {
    if (flat) {
      const fill = flatMaterial();
      const line = flatMaterial();
      return { kind: "flat" as const, fill, line, all: [fill, line] };
    }
    return { kind: "shaded" as const, ...makeShadedMaterials(bands) };
  }, [flat, bands]);

  if (mats.kind === "flat") {
    setColor(mats.fill, color, opacity);
    setColor(mats.line, outlineColor, opacity);
  } else {
    const sh = shadow ?? mulHex(color, kit.shadowMul);
    const [dx, dy] = localLightDir(kit.m, kit.light);
    const amount = (shade ?? kit.shade) * built.size;
    setColor(mats.base, sh);
    mats.bandMats.forEach((m, i) => {
      const t = bands > 1 ? i / (bands - 1) : 1;
      const f = 1 - soft + 2 * soft * t;
      (m.uniforms.uOffset.value as THREE.Vector2).set(dx * amount * f, dy * amount * f);
      setColor(m, mixHex(sh, color, (i + 1) / bands));
    });
    setColor(mats.outline, outlineColor);
  }

  return <mesh geometry={geometry} material={mats.all} frustumCulled={false} />;
};

export type LineProps = XProps & {
  pts: [number, number][];
  width?: number;
  color?: string;
  smooth?: boolean;
  opacity?: number;
};

/** An open drawn line (brows, mouths, wrinkles, wood grain...). */
export const Line: React.FC<LineProps> = ({ pts, width, color = INK, smooth = false, opacity = 1, ...xform }) => {
  return (
    <X {...xform}>
      <LineMesh pts={pts} width={width} color={color} smooth={smooth} opacity={opacity} />
    </X>
  );
};

const LineMesh: React.FC<{ pts: [number, number][]; width?: number; color: string; smooth: boolean; opacity: number }> = ({
  pts,
  width,
  color,
  smooth,
  opacity,
}) => {
  const kit = useKit();
  const w = lineLocal(width ?? kit.line * 0.8, kit.ls);
  const key = `${smooth ? "s" : "p"}:${pts.map((p) => p.map((v) => v.toFixed(2)).join(",")).join(";")}`;
  const geometry = useMemo(() => {
    const v = smooth ? smoothOpenPts(pts) : pts.map(([x, y]) => new THREE.Vector2(x, y));
    return buildLine(v, w, key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, w]);
  const mat = useMemo(() => flatMaterial(), []);
  setColor(mat, color, opacity);
  return <mesh geometry={geometry} material={mat} frustumCulled={false} />;
};

const smoothOpenPts = (pts: [number, number][]) => smoothOpen(pts, 8);
