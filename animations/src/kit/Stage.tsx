import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { X, type Light } from "./context";
import { Vignette, Wash } from "./effects";

export type Camera = {
  /** World point at the center of the frame. */
  x?: number;
  y?: number;
  zoom?: number;
  rot?: number;
  /** Camera shake amplitude in px (deterministic, frame-driven). */
  shake?: number;
};

export type StageProps = {
  camera?: Camera;
  light?: Light;
  shadowMul?: [number, number, number];
  /** Outline width for characters/props at scale 1. */
  line?: number;
  vignette?: number;
  vignetteColor?: string;
  grain?: number;
  /** 0..1 fade to black (or `washColor`). */
  wash?: number;
  washColor?: string;
  /** Transparent canvas (for layering a sharp foreground over a blurred background). */
  transparent?: boolean;
  children: React.ReactNode;
};

const noise = (t: number, seed: number) =>
  Math.sin(t * 1.7 + seed) * 0.5 + Math.sin(t * 3.1 + seed * 2.3) * 0.3 + Math.sin(t * 5.9 + seed * 0.7) * 0.2;

/**
 * One shot. Orthographic Three.js canvas where 1 unit = 1 px and (0, 0) is the
 * center of the frame. Everything inside is drawn in painter's order:
 * higher `z` on top, equal `z` in JSX order.
 */
export const Stage: React.FC<StageProps> = ({
  camera = {},
  light,
  shadowMul,
  line,
  vignette = 0.5,
  vignetteColor = "#1a1012",
  grain = 0.035,
  wash = 0,
  washColor = "#000000",
  transparent = false,
  children,
}) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const { x = 0, y = 0, zoom = 1, rot = 0, shake = 0 } = camera;
  const sx = shake * noise(frame * 0.9, 1.3);
  const sy = shake * noise(frame * 0.9, 7.1);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      orthographic
      linear
      flat
      gl={{ stencil: true, antialias: true, alpha: transparent, premultipliedAlpha: false }}
      camera={{ position: [0, 0, 500], zoom: 1, near: 0.1, far: 2000 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <X
        camera
        s={zoom}
        rot={rot}
        x={-x * zoom + sx}
        y={-y * zoom + sy}
        light={light}
        shadowMul={shadowMul}
        line={line}
      >
        {children}
      </X>
      {vignette > 0 || grain > 0 ? (
        <Vignette width={width} height={height} strength={vignette} color={vignetteColor} grain={grain} seed={frame % 97} />
      ) : null}
      {wash > 0 ? <Wash width={width} height={height} color={washColor} alpha={wash} /> : null}
    </ThreeCanvas>
  );
};
