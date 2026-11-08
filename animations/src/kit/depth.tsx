import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage, type StageProps } from "./Stage";

/**
 * Depth-of-field shot (reference look): the scene split into a blurred
 * background, a sharp middle layer and an optionally blurred foreground, all
 * through the same camera. Each layer is its own canvas, so use it for close-ups
 * that need the cinematic separation, not for every shot.
 */
export const DepthStage: React.FC<
  Omit<StageProps, "children" | "transparent"> & {
    bg: React.ReactNode;
    children: React.ReactNode;
    fg?: React.ReactNode;
    /** Blur radius in px for the background / foreground layers. */
    bgBlur?: number;
    fgBlur?: number;
  }
> = ({ bg, children, fg, bgBlur = 6, fgBlur = 10, vignette = 0.5, vignetteColor, grain = 0.035, wash, washColor, ...stage }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: `blur(${bgBlur}px)`, transform: "scale(1.02)" }}>
      <Stage {...stage} vignette={0} grain={0}>
        {bg}
      </Stage>
    </AbsoluteFill>
    <AbsoluteFill>
      <Stage {...stage} transparent vignette={fg ? 0 : vignette} vignetteColor={vignetteColor} grain={fg ? 0 : grain} wash={fg ? 0 : wash} washColor={washColor}>
        {children}
      </Stage>
    </AbsoluteFill>
    {fg ? (
      <>
        <AbsoluteFill style={{ filter: `blur(${fgBlur}px)` }}>
          <Stage {...stage} transparent vignette={0} grain={0}>
            {fg}
          </Stage>
        </AbsoluteFill>
        <AbsoluteFill>
          <Stage {...stage} transparent vignette={vignette} vignetteColor={vignetteColor} grain={grain} wash={wash} washColor={washColor}>
            {null}
          </Stage>
        </AbsoluteFill>
      </>
    ) : null}
  </AbsoluteFill>
);
