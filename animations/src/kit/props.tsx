import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "./Part";
import { X, type XProps } from "./context";
import { circle, ellipse, poly, roundRect, blob } from "./shapes";
import { palette, shadeHex, INK } from "./style";
import { Flame } from "./env/fire";
import { Glow } from "./effects";
import { noise1 } from "./random";

// Hand-held and small props. Origin = grip point unless noted, so they can be
// passed to Character `holdF` / `holdB` (use `rot` to keep them upright).

/** Thick stroke with an ink outline (for glyphs, ropes, shafts). */
export const InkLine: React.FC<XProps & { pts: [number, number][]; width: number; color: string; outline?: number; smooth?: boolean }> = ({
  pts,
  width,
  color,
  outline = 7,
  smooth = false,
  ...xf
}) => (
  <X {...xf}>
    <Line pts={pts} width={width + outline * 2} color={INK} smooth={smooth} />
    <Line pts={pts} width={width} color={color} smooth={smooth} z={0.001} />
  </X>
);

export const Spear: React.FC<XProps & { length?: number; tip?: string }> = ({ length = 420, tip = "#c9963f", ...xf }) => (
  <X {...xf}>
    <InkLine pts={[[0, -length * 0.25], [0, length * 0.75]]} width={9} color={palette.wood} outline={4.5} />
    <Part shape={blob([[0, 0], [14, 22], [0, 70], [-14, 22]], 6)} color={tip} shade={0.3} y={length * 0.75 - 6} z={0.002} />
  </X>
);

/** Bow held at the grip; `draw` 0..1 pulls the string back (toward -x). */
export const Bow: React.FC<XProps & { size?: number; draw?: number; arrow?: boolean; fire?: boolean }> = ({
  size = 1,
  draw = 0,
  arrow = false,
  fire = false,
  ...xf
}) => {
  const h = 150 * size;
  const pull = -draw * 70 * size;
  const arc: [number, number][] = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12 - 0.5;
    return [Math.cos(t * Math.PI) * 34 * size - 10 * size, t * h];
  });
  return (
    <X {...xf}>
      <Line pts={[[arc[0][0], arc[0][1]], [pull - 10 * size, 0], [arc[12][0], arc[12][1]]]} width={3} color="#e9e2d0" />
      <InkLine pts={arc} width={9 * size} color="#7a4a2a" outline={4} smooth />
      {arrow ? <Arrow x={pull - 6} fire={fire} s={size * 0.9} z={0.01} /> : null}
    </X>
  );
};

/** Arrow pointing +x, origin at the nock. `fire` wraps a flame on the head. */
export const Arrow: React.FC<XProps & { length?: number; fire?: boolean; fireSize?: number; seed?: number }> = ({
  length = 150,
  fire = false,
  fireSize = 1,
  seed = 0,
  ...xf
}) => (
  <X {...xf}>
    <InkLine pts={[[0, 0], [length, 0]]} width={5} color="#c9a274" outline={3.5} />
    <Part shape={poly([[0, 0], [-6, 10], [24, 4], [24, -4], [-6, -10]])} color="#e9e2d0" flat outline={3} x={4} z={0.001} />
    <Part shape={poly([[0, 8], [22, 0], [0, -8]])} color="#8a8790" outline={3.5} flat x={length - 2} z={0.002} />
    {fire ? (
      <X x={length - 12} z={0.003}>
        <Part shape={ellipse(16, 9)} color="#c7a86a" outline={3.5} shade={0.3} />
        <Glow rx={70 * fireSize} color="#ffb04a" alpha={0.5} additive z={-0.01} />
        <Flame size={0.28 * fireSize} rot={1.35} x={-4} seed={seed} z={0.01} />
      </X>
    ) : null}
  </X>
);

export const Shield: React.FC<XProps & { r?: number; color?: string; emblem?: string }> = ({ r = 70, color = "#c9963f", emblem = "#c0362c", ...xf }) => (
  <X {...xf}>
    <Part shape={circle(r)} color={color} shade={0.25} outline={7}>
      <Part shape={circle(r * 0.8)} color={shadeHex(color, 0.08)} flat outline={4} z={0.001} />
      <Part shape={poly([[0, r * 0.5], [r * 0.42, -r * 0.3], [-r * 0.42, -r * 0.3]])} color={emblem} flat outline={4} z={0.002} />
    </Part>
  </X>
);

/** Persian wicker shield (spara). */
export const WickerShield: React.FC<XProps & { w?: number; h?: number }> = ({ w = 110, h = 190, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 18)} color="#c49a5a" shade={0.25}>
      {Array.from({ length: Math.floor(h / 22) }, (_, i) => (
        <Line key={i} pts={[[-w / 2 + 6, -h / 2 + 14 + i * 22], [w / 2 - 6, -h / 2 + 14 + i * 22]]} width={3} color="#8a6a3a" z={0.001} />
      ))}
      <Line pts={[[0, -h / 2 + 6], [0, h / 2 - 6]]} width={5} color="#6e4a2c" z={0.002} />
    </Part>
  </X>
);

export const Scroll: React.FC<XProps & { open?: number; w?: number }> = ({ open = 1, w = 150, ...xf }) => {
  const h = 30 + open * 150;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 6)} color={palette.paper} shade={0.12} y={-h / 2} />
      {open > 0.4
        ? [0, 1, 2, 3].map((i) => (
            <Line key={i} pts={[[-w / 2 + 22, -40 - i * 28], [w / 2 - 22 - (i % 2) * 30, -40 - i * 28]]} width={5} color="#8a7a5a" z={0.001} />
          ))
        : null}
      <Part shape={roundRect(w + 26, 24, 12)} color="#e2d3ae" shade={0.25} z={0.002} />
      <Part shape={roundRect(w + 26, 24, 12)} color="#e2d3ae" shade={0.25} y={-h} z={0.002} />
    </X>
  );
};

export const Hammer: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <InkLine pts={[[0, -30], [0, 120]]} width={11} color={palette.wood} outline={4} />
    <Part shape={roundRect(70, 32, 6)} color="#8a8790" shade={0.3} y={124} z={0.002} />
  </X>
);

/** Wooden plank carried in the hands; origin at its center. */
export const Plank: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 260, h = 34, color = "#b98a54", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 4)} color={color} shade={0.25}>
      <Line pts={[[-w / 2 + 20, 4], [w / 2 - 60, 6]]} width={3} color={shadeHex(color, 0.35)} z={0.001} />
      <Part shape={circle(4)} color="#4a4a52" flat outline={0} x={-w / 2 + 14} z={0.002} />
      <Part shape={circle(4)} color="#4a4a52" flat outline={0} x={w / 2 - 14} z={0.002} />
    </Part>
  </X>
);

export const HandTorch: React.FC<XProps & { seed?: number }> = ({ seed = 3, ...xf }) => {
  const frame = useCurrentFrame();
  const flick = 1 + noise1(frame / 4, seed) * 0.1;
  return (
    <X {...xf}>
      <Glow rx={220 * flick} color="#ffb04a" alpha={0.35} y={130} additive z={-0.2} />
      <InkLine pts={[[0, -20], [0, 110]]} width={14} color={palette.woodDark} outline={4} />
      <Part shape={roundRect(30, 24, 8)} color="#c7a86a" shade={0.3} y={112} z={0.001} />
      <Flame size={0.42} y={118} seed={seed} z={0.01} />
    </X>
  );
};

export const Staff: React.FC<XProps & { length?: number }> = ({ length = 380, ...xf }) => (
  <X {...xf}>
    <InkLine pts={[[0, -length * 0.3], [4, length * 0.5], [-6, length * 0.7]]} width={11} color="#8a5a32" outline={4} smooth />
  </X>
);

/** Big outlined "?" (centered). */
export const QuestionMark: React.FC<XProps & { color?: string; size?: number }> = ({ color = "#fe5649", size = 1, ...xf }) => (
  <X {...xf} s={(xf.s ?? 1) * size}>
    <InkLine pts={[[-60, 70], [-50, 110], [0, 130], [50, 110], [60, 70], [30, 30], [0, 0], [0, -30]]} width={34} color={color} outline={8} smooth />
    <Part shape={circle(22)} color={color} flat outline={8} y={-90} />
  </X>
);

/** Rolling boulder; set `rot` from the frame for rolling. */
export const Boulder: React.FC<XProps & { r?: number; seed?: number; color?: string }> = ({ r = 90, seed = 1, color = "#a99c8a", ...xf }) => {
  const pts: [number, number][] = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    const k = 0.86 + ((Math.sin(seed * 91.7 + i * 12.9) + 1) / 2) * 0.22;
    return [Math.cos(a) * r * k, Math.sin(a) * r * k];
  });
  return (
    <X {...xf}>
      <Part shape={blob(pts, 6)} color={color} shade={0.3} light={{ dir: [-0.7, 0.7] }}>
        <Line pts={[[-r * 0.3, r * 0.2], [-r * 0.05, 0], [r * 0.1, r * 0.3]]} width={4} z={0.001} />
        <Line pts={[[r * 0.2, -r * 0.35], [r * 0.45, -r * 0.2]]} width={4} z={0.001} />
      </Part>
    </X>
  );
};
