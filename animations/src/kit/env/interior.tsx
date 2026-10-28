import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Gradient, Glow, LightCone } from "../effects";
import { circle, roundRect, roundPoly, poly } from "../shapes";
import { palette, shadeHex, mixHex } from "../style";
import { noise1 } from "../random";

/** Vertical wooden plank wall with a wainscot rail. Origin = center. */
export const PlankWall: React.FC<
  XProps & { w: number; h: number; color?: string; plank?: number; rail?: number | null }
> = ({ w, h, color = "#a67b4e", plank = 96, rail = null, ...xf }) => {
  const n = Math.ceil(w / plank) + 1;
  const dark = shadeHex(color, 0.22);
  return (
    <X {...xf}>
      <Gradient w={w} h={h} stops={[[0, shadeHex(color, 0.2)], [0.5, color], [1, shadeHex(color, 0.1)]]} />
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + i * plank;
        return <Line key={i} pts={[[x, -h / 2], [x, h / 2]]} width={4} color={dark} z={0.001} />;
      })}
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + i * plank + plank * 0.5;
        const y = ((i * 137) % 300) - 150;
        return <Line key={`k${i}`} pts={[[x - 10, y], [x, y + 6], [x + 10, y]]} smooth width={3} color={dark} opacity={0.6} z={0.001} />;
      })}
      {rail !== null ? (
        <>
          <Part shape={roundRect(w + 20, 28, 4)} color={shadeHex(color, 0.15)} y={rail} z={0.002} />
          <Gradient w={w} h={h / 2 + rail - 14} y={(-h / 2 + rail - 14) / 2} stops={[[0, shadeHex(color, 0.28)], [1, shadeHex(color, 0.38)]]} z={0.0015} />
        </>
      ) : null}
    </X>
  );
};

/** Wooden floor. Top edge at y=0. */
export const Floorboards: React.FC<XProps & { w: number; h: number; color?: string }> = ({ w, h, color = "#6e4a2c", ...xf }) => {
  const rows = 6;
  return (
    <X {...xf}>
      <Gradient w={w} h={h} y={-h / 2} stops={[[0, shadeHex(color, 0.15)], [1, shadeHex(color, 0.05)]]} />
      <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={7} z={0.01} />
      {Array.from({ length: rows }, (_, i) => {
        const y = -Math.pow((i + 1) / rows, 1.6) * h;
        return <Line key={i} pts={[[-w / 2, y], [w / 2, y]]} width={3.5} color={shadeHex(color, 0.35)} z={0.005} />;
      })}
      {Array.from({ length: 14 }, (_, i) => {
        const x = -w / 2 + ((i * 211) % w);
        const r = i % rows;
        const y0 = -Math.pow(r / rows, 1.6) * h;
        const y1 = -Math.pow((r + 1) / rows, 1.6) * h;
        return <Line key={`v${i}`} pts={[[x, y0], [x, y1]]} width={3.5} color={shadeHex(color, 0.35)} z={0.005} />;
      })}
    </X>
  );
};

/** Window with blinds and daylight glow. Origin = center. */
export const BlindsWindow: React.FC<XProps & { w: number; h: number; light?: string }> = ({ w, h, light = "#f6dc9c", ...xf }) => (
  <X {...xf}>
    <Glow rx={w * 0.9} ry={h * 0.8} color={light} alpha={0.25} additive />
    <Part shape={roundRect(w + 28, h + 28, 6)} color="#8a5e38" />
    <Part shape={roundRect(w, h, 2)} color={light} flat z={0.001} />
    {Array.from({ length: Math.floor(h / 22) }, (_, i) => (
      <Line key={i} pts={[[-w / 2, h / 2 - 14 - i * 22], [w / 2, h / 2 - 14 - i * 22]]} width={4} color={shadeHex(light, 0.25)} z={0.002} />
    ))}
    <Line pts={[[0, -h / 2], [0, h / 2]]} width={8} z={0.003} />
  </X>
);

/** Hanging lamp with cord, shade, bulb and light cone. Origin = ceiling point. */
export const HangingLamp: React.FC<XProps & { cord?: number; color?: string; cone?: number; coneW?: number }> = ({
  cord = 120,
  color = "#3f6b45",
  cone = 900,
  coneW = 760,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const flick = 1 + noise1(frame / 6, 3) * 0.04;
  return (
    <X {...xf}>
      <Line pts={[[0, 0], [0, -cord]]} width={5} />
      <X y={-cord}>
        <LightCone w={coneW} h={cone} top={0.22} alpha={0.2 * flick} y={-40} z={-0.5} />
        <Glow rx={120} color="#fff1c2" alpha={0.5 * flick} y={-44} additive z={0.01} />
        <Part shape={circle(16)} color="#fff7d6" flat outline={4} y={-44} z={0.02} />
        <Part shape={roundPoly([[-34, 0], [34, 0], [96, -46], [-96, -46]], [10, 10, 6, 6])} color={color} shade={0.3} light={{ dir: [-0.5, 1] }} z={0.03} />
      </X>
    </X>
  );
};

/** Office desk seen from the front. Origin = floor center under the desk. */
export const Desk: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 560, h = 270, color = "#9d6e3c", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h - 24, 8)} color={shadeHex(color, 0.08)} y={(h - 24) / 2} />
    {[-1, 1].map((s) =>
      [0, 1, 2].map((r) => (
        <X key={`${s}${r}`} x={s * w * 0.25} y={h - 70 - r * 72} z={0.001}>
          <Part shape={roundRect(w * 0.42, 60, 6)} color={color} shade={0.18} />
          <Part shape={roundRect(34, 9, 4)} color={palette.gold} flat outline={3.5} z={0.001} />
        </X>
      )),
    )}
    <Part shape={roundRect(w + 50, 28, 8)} color={mixHex(color, "#ffffff", 0.08)} y={h - 8} z={0.002} />
  </X>
);

/** Wall calendar with crossed-out days. Origin = center. */
export const Calendar: React.FC<XProps & { crossed?: number; circled?: number | null; flip?: number }> = ({
  crossed = 0,
  circled = null,
  flip = 0,
  ...xf
}) => {
  const W = 300;
  const H = 280;
  return (
    <X {...xf}>
      <Part shape={roundRect(W, H, 10)} color={palette.paper} shade={0.12} />
      <Part shape={roundRect(W, 70, 10)} color={palette.red} y={H / 2 - 35} z={0.001} />
      {[-90, -30, 30, 90].map((x) => (
        <Part key={x} shape={circle(9)} color="#ffffff" flat outline={4} x={x} y={H / 2 + 4} z={0.002} />
      ))}
      {Array.from({ length: 21 }, (_, i) => {
        const c = i % 7;
        const r = Math.floor(i / 7);
        const x = -W / 2 + 26 + c * 41;
        const y = H / 2 - 100 - r * 56;
        return (
          <X key={i} x={x} y={y} z={0.003}>
            <Part shape={roundRect(32, 40, 4)} color="#ffffff" flat outline={3} />
            {i < crossed ? (
              <>
                <Line pts={[[-11, 13], [11, -13]]} width={5} color={palette.red} z={0.001} />
                <Line pts={[[-11, -13], [11, 13]]} width={5} color={palette.red} z={0.001} />
              </>
            ) : null}
            {circled === i ? (
              <Line
                pts={Array.from({ length: 25 }, (_, k) => {
                  const a = (k / 24) * Math.PI * 2 + 0.4;
                  return [Math.cos(a) * 24, Math.sin(a) * 27] as [number, number];
                })}
                width={5}
                color={palette.red}
                z={0.002}
              />
            ) : null}
          </X>
        );
      })}
      {flip > 0 ? (
        // a page flipping up over the top
        <X y={H / 2 - 70} sy={Math.cos(flip * Math.PI)} z={0.01}>
          <Part shape={roundRect(W, H - 70, 8)} color={mixHex(palette.paper, "#ffffff", 0.3)} y={-(H - 70) / 2} flat />
        </X>
      ) : null}
    </X>
  );
};

/** Simple flag on a pole. `kind` "japan" | "stripes". Origin = pole base. */
export const Flag: React.FC<XProps & { kind?: "japan" | "stripes"; pole?: number }> = ({ kind = "japan", pole = 420, ...xf }) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame * 0.12) * 0.04;
  return (
    <X {...xf}>
      <Part shape={roundRect(12, pole, 6)} color="#c9a24a" y={pole / 2} />
      <Part shape={circle(13)} color={palette.gold} y={pole + 8} />
      <X x={6} y={pole - 10} rot={wave} z={0.01}>
        <Part shape={roundPoly([[0, 0], [190, 8], [194, -112], [0, -120]], 6)} color="#f6f2ea" shade={0.15} />
        {kind === "japan" ? (
          <Part shape={circle(34)} color="#c8262f" flat outline={0} x={96} y={-58} z={0.001} />
        ) : (
          [0, 1, 2].map((i) => (
            <Part key={i} shape={poly([[2, -20 - i * 40], [190, -14 - i * 40], [192, -34 - i * 40], [2, -40 - i * 40]])} color={palette.red} flat outline={0} z={0.001} />
          ))
        )}
      </X>
    </X>
  );
};

/** Wall clock with frame-driven hands. */
export const Clock: React.FC<XProps & { r?: number; speed?: number }> = ({ r = 70, speed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const m = (frame * 0.06 * speed) % (Math.PI * 2);
  return (
    <X {...xf}>
      <Part shape={circle(r)} color="#f4efe2" shade={0.15} outline={7} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <Line key={i} pts={[[Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78], [Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9]]} width={4} z={0.001} />
        );
      })}
      <Line pts={[[0, 0], [Math.sin(-m) * r * 0.7, Math.cos(-m) * r * 0.7]]} width={5} z={0.002} />
      <Line pts={[[0, 0], [Math.sin(-m / 12) * r * 0.45, Math.cos(-m / 12) * r * 0.45]]} width={6} z={0.002} />
    </X>
  );
};

/** A framed poster (no text): colored panel with a simple soldier silhouette. */
export const Poster: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 230, h = 300, color = palette.red, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 4)} color={palette.paper} shade={0.1} />
    <Part shape={roundRect(w - 30, h - 90, 2)} color={color} flat y={28} z={0.001} />
    <Part shape={circle(42)} color="#f6f5f8" flat y={50} z={0.002} />
    <Part shape={roundPoly([[-70, -60], [70, -60], [56, 10], [-56, 10]], 18)} color="#26305a" flat y={-24} z={0.0015} />
    {[0, 1].map((i) => (
      <Line key={i} pts={[[-w / 2 + 30, -h / 2 + 46 - i * 22], [w / 2 - 30 - i * 40, -h / 2 + 46 - i * 22]]} width={8} color={i ? palette.red : "#26305a"} z={0.002} />
    ))}
  </X>
);
