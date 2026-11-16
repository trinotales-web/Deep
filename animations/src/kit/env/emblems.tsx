import React from "react";
import { Part } from "../Part";
import { X, type XProps } from "../context";
import { circle, path, poly, roundRect } from "../shapes";
import TP from "./geo/textpaths.json";

// In-canvas lettering and space-agency marks. Text outlines come from real
// fonts shaped with HarfBuzz (Montserrat, Noto Sans Devanagari, OFL) and are
// stored as SVG path data in geo/textpaths.json (em = 1000, baseline y = 0,
// y-down). Regenerate with the textpaths tool noted in CLAUDE.md.

export type TextKey = keyof typeof TP;

/** Pre-shaped text drawn as filled shapes. `size` = em height in local units; `align` anchors the baseline. */
export const TextShape: React.FC<XProps & { k: TextKey; size?: number; color?: string; align?: "left" | "center" | "right"; outline?: number }> = ({ k, size = 100, color = "#211b20", align = "center", outline = 0, ...xf }) => {
  const t = TP[k];
  const s = size / 1000;
  const dx = align === "left" ? 0 : align === "center" ? -t.w / 2 : -t.w;
  return (
    <X {...xf}>
      <X s={s} x={dx * s}>
        <Part shape={path(t.d)} color={color} flat outline={outline} />
      </X>
    </X>
  );
};

/** Vertical lettering: each glyph upright, stacked top to bottom from the origin. */
export const VerticalText: React.FC<XProps & { letters: TextKey[]; size?: number; gap?: number; color?: string }> = ({ letters, size = 60, gap = 1.0, color = "#1a2a6a", ...xf }) => (
  <X {...xf}>
    {letters.map((k, i) => (
      <TextShape key={i} k={k} size={size} color={color} y={-i * size * 0.78 * gap - size * 0.72} />
    ))}
  </X>
);

const ISRO_ORANGE = "#f07a1e";
const ISRO_BLUE = "#1f8ad6";

/**
 * ISRO emblem (simplified): the orange rising arrow with the blue solar
 * panels, "इसरो" on the left and "isro" on the right. Origin = centre of the
 * text baseline; about 600 wide and 330 tall. `plate` puts it on a white
 * rounded card, `round` on a white disc.
 */
export const IsroEmblem: React.FC<XProps & { plate?: boolean; round?: boolean; text?: boolean }> = ({ plate = false, round = false, text = true, ...xf }) => {
  const panel = (x: number, i: number) => {
    const y = Math.round(118 - 0.2 * x);
    return <Part key={i} shape={roundRect(54, 22, 3)} color={ISRO_BLUE} flat outline={0} x={x} y={y} rot={-0.2} z={0.002} />;
  };
  return (
    <X {...xf}>
      {plate ? <Part shape={roundRect(text ? 700 : 340, 400, 40)} color="#ffffff" flat outline={6} y={70} z={-0.01} /> : null}
      {round ? <Part shape={circle(text ? 360 : 200)} color="#ffffff" flat outline={6} y={70} z={-0.01} /> : null}
      <Part shape={poly([[0, 250], [-26, -30], [0, 10]])} color={ISRO_ORANGE} flat outline={0} z={0.001} />
      <Part shape={poly([[0, 250], [0, 10], [30, -40]])} color="#d8601a" flat outline={0} z={0.001} />
      {[-150, -84, 84, 150].map(panel)}
      {text ? (
        <>
          <TextShape k="isro_hi" size={150} color={ISRO_ORANGE} align="right" x={-40} y={-4} z={0.003} />
          <TextShape k="isro_en" size={170} color={ISRO_BLUE} align="left" x={40} y={-4} z={0.003} />
        </>
      ) : null}
    </X>
  );
};
