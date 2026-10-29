import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "./Part";
import { X, type XProps } from "./context";
import { circle, ellipse, poly, roundPoly, roundRect, blob } from "./shapes";
import { palette, shadeHex, mixHex, INK } from "./style";
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

/** Chinese rocket arrow: arrow with a paper powder tube; `burning` adds exhaust. */
export const RocketArrow: React.FC<XProps & { length?: number; burning?: number; seed?: number }> = ({ length = 180, burning = 0, seed = 2, ...xf }) => (
  <X {...xf}>
    <Arrow length={length} />
    <Part shape={roundRect(54, 22, 10)} color="#c0362c" shade={0.25} x={length - 60} z={0.004}>
      <Line pts={[[-14, -11], [-14, 11]]} width={3} color="#e9ba41" z={0.001} />
      <Line pts={[[14, -11], [14, 11]]} width={3} color="#e9ba41" z={0.001} />
    </Part>
    {burning > 0 ? (
      <X x={length - 90} z={0.003}>
        <Glow rx={70 * burning} color="#ffb04a" alpha={0.5} additive z={-0.01} />
        <X rot={Math.PI / 2} s={0.25 * burning}>
          <Flame seed={seed} />
        </X>
      </X>
    ) : null}
  </X>
);

/** Ammianus' Roman fire arrow head: hollow iron cage with holes, packed with fuel. */
export const RomanFireHead: React.FC<XProps & { fuel?: number; lit?: number; seed?: number }> = ({ fuel = 1, lit = 0, seed = 4, ...xf }) => (
  <X {...xf}>
    <InkLine pts={[[-420, 0], [-120, 0]]} width={22} color="#c9a274" outline={6} />
    <Part shape={blob([[-140, 0], [-100, 60], [60, 70], [180, 0], [60, -70], [-100, -60]], 8)} color="#6a6470" shade={0.3}>
      {fuel > 0 ? <Part shape={blob([[-90, 0], [-60, 40], [40, 46], [120, 0], [40, -46], [-60, -40]], 8)} color={mixHex("#7a4a2a", "#2a1e1a", 0.3)} flat outline={4} sx={fuel} sy={fuel} z={0.001} /> : null}
      {[[-60, 30], [0, 38], [60, 26], [-40, -28], [20, -36], [80, -20], [-80, 0], [40, 0]].map(([x, y], i) => (
        <Part key={i} shape={circle(12)} color="#1d1519" flat outline={0} x={x} y={y} z={0.002} />
      ))}
    </Part>
    <Part shape={poly([[170, 18], [260, 0], [170, -18]])} color="#5a5660" shade={0.3} z={0.01} />
    {lit > 0 ? (
      <X z={0.02}>
        <Glow rx={300 * lit} color="#ff9a3c" alpha={0.45} additive z={-0.01} />
        <Flame size={0.9 * lit} y={-20} seed={seed} />
      </X>
    ) : null}
  </X>
);

/** Falarica: heavy spear with a long iron point wrapped in fiber and pitch. Points +x; origin = grip. */
export const Falarica: React.FC<XProps & { lit?: number; seed?: number }> = ({ lit = 0, seed = 6, ...xf }) => (
  <X {...xf}>
    <InkLine pts={[[-420, 0], [120, 0]]} width={16} color="#8a5a32" outline={5} />
    <Part shape={roundRect(140, 64, 28)} color="#4a3a32" shade={0.3} x={150} z={0.01} />
    <Part shape={poly([[110, 12], [480, 4], [520, 0], [480, -4], [110, -12]])} color="#7a7480" shade={0.3} z={0.005} />
    {lit > 0 ? (
      <X x={150} z={0.02}>
        <Glow rx={260 * lit} color="#ff8a3a" alpha={0.5} additive z={-0.01} />
        <Flame size={0.75 * lit} y={10} seed={seed} />
      </X>
    ) : null}
  </X>
);

/** Ball of burning rag on an arrow tip. Origin = center. */
export const RagBall: React.FC<XProps & { lit?: number; seed?: number }> = ({ lit = 1, seed = 3, ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-40, 0], [-30, 30], [10, 40], [44, 10], [34, -30], [-10, -40]], 6)} color="#c7a86a" shade={0.3}>
      <Line pts={[[-28, -10], [10, 20], [30, 0]]} width={3} color="#8a6a3a" z={0.001} />
    </Part>
    {lit > 0 ? (
      <X z={0.01}>
        <Glow rx={130 * lit} color="#ffb04a" alpha={0.45} additive z={-0.01} />
        <Flame size={0.32 * lit} y={-8} seed={seed} />
      </X>
    ) : null}
  </X>
);

/** Long-handled ladle (Assyrian relief) — origin = grip, scoop at +x. */
export const Ladle: React.FC<XProps & { pour?: number }> = ({ pour = 0, ...xf }) => (
  <X {...xf}>
    <InkLine pts={[[-60, 0], [300, 0]]} width={10} color="#8a7a6a" outline={4} />
    <X x={320} rot={-pour * 1.6} z={0.01}>
      <Part shape={blob([[-30, 0], [30, 0], [24, -36], [0, -44], [-24, -36]], 6)} color="#8a7a6a" shade={0.3} />
    </X>
  </X>
);

/** Wooden bucket. Origin = bottom center. */
export const Bucket: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={roundPoly([[-56, 0], [56, 0], [68, 120], [-68, 120]], 6)} color="#a5764a" shade={0.25}>
      {[30, 90].map((y) => (
        <Line key={y} pts={[[-62, y], [62, y]]} width={6} color="#5a5a64" z={0.001} />
      ))}
    </Part>
    <Line pts={[[-64, 120], [0, 190], [64, 120]]} smooth width={5} />
  </X>
);

/** Quill pen. Origin = nib. */
export const Quill: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={blob([[0, 0], [20, 60], [40, 150], [10, 180], [-6, 120], [-4, 50]], 6)} color="#f4f1ea" shade={0.25} />
    <Line pts={[[0, 0], [20, 170]]} width={3} z={0.001} />
  </X>
);

const qb = (a: [number, number], c: [number, number], b: [number, number], t: number): [number, number] => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];

/**
 * Arrow flying along a quadratic curve from `from` to `to` (control `via`).
 * `p` 0..1 = progress. `trail`: "comet" (fire glow trail), "smoke" (thin grey
 * line), or none. `fire` 0..1 flame size at the tip.
 */
export const FlyingArrow: React.FC<{
  from: [number, number];
  via: [number, number];
  to: [number, number];
  p: number;
  fire?: number;
  trail?: "comet" | "smoke" | null;
  trailLen?: number;
  s?: number;
  z?: number;
  seed?: number;
  rocket?: number;
}> = ({ from, via, to, p, fire = 0, trail = null, trailLen = 0.25, s = 1, z = 0, seed = 1, rocket }) => {
  if (p <= 0) return null;
  const pp = Math.min(p, 1);
  const [x, y] = qb(from, via, to, pp);
  const [x2, y2] = qb(from, via, to, Math.min(1, pp + 0.01));
  const ang = Math.atan2(y2 - y, x2 - x);
  const n = 10;
  const pts: [number, number][] = Array.from({ length: n }, (_, i) => qb(from, via, to, Math.max(0, pp - (trailLen * i) / (n - 1))));
  return (
    <X z={z}>
      {trail === "comet"
        ? pts.map(([tx, ty], i) => (
            <Glow key={i} x={tx} y={ty} rx={(70 - i * 5) * s} color={i < 3 ? "#ffd27a" : "#ff8a3a"} alpha={0.55 * (1 - i / n) * Math.max(0.2, fire)} additive />
          ))
        : null}
      {trail === "smoke" ? <Line pts={pts.slice().reverse()} width={6 * s} color="#9a95a0" opacity={0.6} smooth /> : null}
      <X x={x} y={y} rot={ang} s={s}>
        {rocket !== undefined ? (
          <RocketArrow x={-180} burning={rocket} seed={seed} />
        ) : (
          <Arrow x={-150} fire={fire > 0.03} fireSize={Math.max(0.05, fire)} seed={seed} />
        )}
      </X>
    </X>
  );
};

/** A flame with a face — the "character" of fire. Origin = base. */
export const FlameFace: React.FC<XProps & { mood?: "sad" | "happy" | "laugh" | "angry" | "scared"; size?: number; wind?: number; seed?: number }> = ({
  mood = "happy",
  size = 1,
  wind = 0,
  seed = 1,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const shake = mood === "laugh" ? Math.sin(frame * 1.3) * 0.05 : 0;
  const eyeY = 70;
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      <Glow rx={260} color="#ffb04a" alpha={0.4} y={90} additive z={-0.01} />
      <X rot={-wind * 0.8 + shake} sx={1 + wind * 0.3} sy={1 - wind * 0.3}>
        <Flame size={1.2} seed={seed} />
        <X y={0} z={0.05}>
          {[-1, 1].map((k) => (
            <X key={k} x={k * 18} y={eyeY}>
              {mood === "laugh" || mood === "happy" ? (
                <Line pts={[[-9, -3], [0, 6], [9, -3]]} smooth width={6} />
              ) : (
                <>
                  <Part shape={ellipse(10, mood === "scared" ? 14 : 12)} color="#ffffff" flat outline={4} />
                  <Part shape={circle(4.5)} color={INK} flat outline={0} y={mood === "sad" ? -3 : 0} z={0.001} />
                </>
              )}
              {mood === "angry" ? <Line pts={[[-12 * k, 18], [12 * k, 10]]} width={5} z={0.002} /> : null}
              {mood === "sad" ? <Line pts={[[-12 * k, 12], [12 * k, 18]]} width={5} z={0.002} /> : null}
            </X>
          ))}
          <X y={44}>
            {mood === "sad" || mood === "scared" ? (
              <Line pts={[[-12, -4], [0, 4], [12, -4]]} smooth width={5} />
            ) : mood === "laugh" ? (
              <Part shape={blob([[-16, 4], [16, 4], [10, -12], [0, -16], [-10, -12]], 6)} color="#5b1d24" flat outline={4} />
            ) : (
              <Line pts={[[-12, 4], [0, -4], [12, 4]]} smooth width={5} />
            )}
          </X>
        </X>
      </X>
    </X>
  );
};

/** Leather quiver full of arrows. Origin = bottom. */
export const Quiver: React.FC<XProps & { n?: number }> = ({ n = 6, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: n }, (_, i) => (
      <X key={i} x={-26 + i * 10} y={170} rot={(i - n / 2) * 0.06} z={-0.001}>
        <Line pts={[[0, 0], [0, 50]]} width={4} color="#c9a274" />
        <Part shape={poly([[0, 46], [-8, 70], [8, 70]])} color="#e9e2d0" flat outline={3} />
      </X>
    ))}
    <Part shape={roundRect(70, 190, 24)} color="#7a5232" shade={0.25} y={95} />
    <Line pts={[[-30, 150], [30, 150]]} width={5} color="#5a3a26" z={0.001} />
  </X>
);

/** Wooden palisade of pointed logs. Origin = ground center. */
export const Palisade: React.FC<XProps & { w?: number; h?: number; char?: number }> = ({ w = 900, h = 420, char = 0, ...xf }) => {
  const n = Math.round(w / 70);
  return (
    <X {...xf}>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + (i + 0.5) * (w / n);
        const hh = h * (0.92 + ((i * 37) % 10) / 100);
        const c = mixHex(i % 2 ? "#9a6c42" : "#8a5a32", "#2e2420", char);
        return <Part key={i} shape={poly([[x - 32, 0], [x + 32, 0], [x + 32, hh], [x, hh + 50], [x - 32, hh]])} color={c} shade={0.28} z={i * 0.0001} />;
      })}
      <Part shape={roundRect(w + 20, 30, 8)} color="#6e4a2c" shade={0.25} y={h * 0.75} z={0.01} />
    </X>
  );
};

/** Pile of arrows (fire arrows get a few flames). Origin = ground center. */
export const ArrowPile: React.FC<XProps & { n?: number; fire?: boolean; w?: number }> = ({ n = 30, fire = false, w = 360, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / 10);
      const x = -w / 2 + ((i * 37) % 100) / 100 * w;
      const rot = (((i * 53) % 40) - 20) / 100;
      return (
        <X key={i} x={x} y={20 + row * 26} rot={rot} z={i * 0.0005}>
          <Arrow s={0.9} x={-80} fire={fire && i % 4 === 0} fireSize={0.7} seed={i} />
        </X>
      );
    })}
  </X>
);

/** Speech bubble with three dots (comment icon). Origin = center. */
export const CommentBubble: React.FC<XProps & { color?: string }> = ({ color = "#ffffff", ...xf }) => (
  <X {...xf}>
    <Part shape={roundPoly([[-180, -110], [-60, -110], [-110, -190], [10, -110], [180, -110], [180, 110], [-180, 110]], [30, 0, 0, 0, 30, 30, 30])} color={color} shade={0.12} />
    {[-80, 0, 80].map((x) => (
      <Part key={x} shape={circle(22)} color="#2f5f9a" flat outline={4} x={x} z={0.001} />
    ))}
  </X>
);

/** Heap of black powder with sparkles. Origin = ground center. */
export const GunpowderPile: React.FC<XProps> = (xf) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={blob([[-180, 0], [180, 0], [120, 60], [40, 110], [-40, 106], [-130, 56]], 8)} color="#2a2830" shade={0.2} />
      {[[-60, 60], [30, 90], [90, 40], [-110, 30]].map(([x, y], i) => {
        const tw = Math.max(0, Math.sin(frame * 0.5 + i * 2));
        return <Part key={i} shape={poly([[0, 14], [4, 4], [14, 0], [4, -4], [0, -14], [-4, -4], [-14, 0], [-4, 4]])} color="#fff3b0" flat outline={0} x={x} y={y} s={tw} z={0.01} />;
      })}
    </X>
  );
};

/** Shovel. Origin = grip end; blade at +x. */
export const Shovel: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <InkLine pts={[[0, 0], [360, 0]]} width={12} color={palette.wood} outline={4} />
    <Part shape={roundPoly([[350, 40], [460, 34], [480, 0], [460, -34], [350, -40]], 10)} color="#8a8790" shade={0.3} z={0.01} />
  </X>
);

/** Clods of dirt flying along an arc; t 0..1. Origin = launch point; lands at (dx, dy). */
export const DirtSpray: React.FC<XProps & { t: number; dx?: number; dy?: number }> = ({ t, dx = 500, dy = -200, ...xf }) => {
  if (t <= 0 || t >= 1.2) return null;
  return (
    <X {...xf}>
      {Array.from({ length: 14 }, (_, i) => {
        const k = Math.min(1, t * (0.8 + (i % 5) * 0.08));
        const x = dx * k + (((i * 31) % 40) - 20);
        const y = dy * k + Math.sin(k * Math.PI) * 220 + (((i * 17) % 30) - 15);
        return <Part key={i} shape={circle(10 + (i % 3) * 5)} color={i % 2 ? "#6a4a2a" : "#7a5a3a"} shade={0.3} x={x} y={y} z={i * 0.001} />;
      })}
    </X>
  );
};

/** Red target crosshair. */
export const Crosshair: React.FC<XProps & { r?: number }> = ({ r = 160, ...xf }) => (
  <X {...xf}>
    <InkLine pts={Array.from({ length: 33 }, (_, k) => [Math.cos((k / 32) * Math.PI * 2) * r, Math.sin((k / 32) * Math.PI * 2) * r] as [number, number])} width={16} color="#fe5649" outline={6} />
    <InkLine pts={[[-r * 1.3, 0], [-r * 0.5, 0]]} width={14} color="#fe5649" outline={6} />
    <InkLine pts={[[r * 0.5, 0], [r * 1.3, 0]]} width={14} color="#fe5649" outline={6} />
    <InkLine pts={[[0, -r * 1.3], [0, -r * 0.5]]} width={14} color="#fe5649" outline={6} />
    <InkLine pts={[[0, r * 0.5], [0, r * 1.3]]} width={14} color="#fe5649" outline={6} />
  </X>
);

/**
 * Magnifying glass. Origin = grip (handle end); the lens sits up the +y axis.
 * `eye` draws a giant magnified eye inside the lens (gaze -1..1 each axis).
 */
export const Magnifier: React.FC<XProps & { r?: number; eye?: boolean; gaze?: [number, number] }> = ({ r = 70, eye = false, gaze = [0, 0], ...xf }) => {
  const cy = 120 + r;
  const ring = Array.from({ length: 41 }, (_, k) => [Math.cos((k / 40) * Math.PI * 2) * r, cy + Math.sin((k / 40) * Math.PI * 2) * r] as [number, number]);
  return (
    <X {...xf}>
      <Part shape={roundRect(26, 116, 12)} color="#7a4a2a" shade={0.3} y={58} />
      <Part shape={roundRect(34, 20, 8)} color={palette.gold} shade={0.25} y={104} z={0.001} />
      <Part shape={circle(r)} color="#cfeeff" flat outline={0} opacity={0.35} y={cy} z={0.002} />
      {eye ? (
        <X y={cy} z={0.003}>
          <Part shape={circle(r * 0.72)} color="#ffffff" shade={0.15} />
          <Part shape={circle(r * 0.34)} color="#211b20" flat outline={0} x={gaze[0] * r * 0.25} y={gaze[1] * r * 0.25} z={0.001} />
          <Part shape={circle(r * 0.1)} color="#ffffff" flat outline={0} x={gaze[0] * r * 0.25 - r * 0.12} y={gaze[1] * r * 0.25 + r * 0.12} z={0.002} />
        </X>
      ) : null}
      <Part shape={ellipse(r * 0.28, r * 0.12)} color="#ffffff" flat outline={0} opacity={0.65} x={-r * 0.38} y={cy + r * 0.42} rot={0.7} z={0.004} />
      <InkLine pts={ring} width={r * 0.24} color="#5a3a26" outline={6} z={0.005} />
    </X>
  );
};

/** Protest-style placard on a stick (write on it with a Label). Origin = bottom of the stick. */
export const Placard: React.FC<XProps & { w?: number; h?: number; stick?: number; color?: string }> = ({ w = 110, h = 120, stick = 120, color = "#f8f4ea", ...xf }) => (
  <X {...xf}>
    <InkLine pts={[[0, 0], [0, stick + 10]]} width={12} color={palette.wood} outline={4} />
    <Part shape={roundRect(w, h, 10)} color={color} shade={0.14} y={stick + h / 2 - 6} z={0.001} />
  </X>
);

/** Glass syringe pointing +x. Origin = middle of the barrel (where it's held). `fill` 0..1 liquid, `push` 0..1 plunger. */
export const Syringe: React.FC<XProps & { fill?: number; push?: number; liquid?: string }> = ({ fill = 0.7, push = 0, liquid = "#e8d9a8", ...xf }) => {
  const L = 150;
  const plunger = -L / 2 - 30 + push * 70;
  return (
    <X {...xf}>
      <InkLine pts={[[plunger - 50, 0], [plunger, 0]]} width={8} color="#d9d6de" outline={3.5} />
      <Part shape={roundRect(10, 40, 4)} color="#d9d6de" shade={0.2} x={plunger - 54} z={0.001} />
      <Part shape={roundRect(L, 34, 10)} color="#e6f4fa" flat outline={5} opacity={0.75} z={0.002} />
      {fill > 0 ? <Part shape={roundRect((L - 20) * fill * (1 - push * 0.8), 22, 6)} color={liquid} flat outline={0} opacity={0.9} x={L / 2 - 10 - ((L - 20) * fill * (1 - push * 0.8)) / 2} z={0.003} /> : null}
      <Part shape={roundRect(12, 46, 4)} color="#d9d6de" shade={0.2} x={-L / 2 - 4} z={0.004} />
      {[-40, -10, 20, 50].map((x) => (
        <Line key={x} pts={[[x, 8], [x, 17]]} width={3} z={0.005} />
      ))}
      <Part shape={roundRect(22, 16, 4)} color="#c9c6ce" shade={0.2} x={L / 2 + 10} z={0.004} />
      <Line pts={[[L / 2 + 20, 0], [L / 2 + 120, 0]]} width={3.5} color="#8a8790" z={0.003} />
    </X>
  );
};

/** Small brown glass ampoule (sealed glass tube). Origin = bottom centre; `label` shows a paper band. */
export const Ampoule: React.FC<XProps & { label?: boolean; glow?: number }> = ({ label = true, glow = 0, ...xf }) => (
  <X {...xf}>
    {glow > 0 ? <Glow rx={150 * glow} y={50} color="#ffcf7a" alpha={0.4} additive z={-0.01} /> : null}
    <Part shape={roundPoly([[-20, 0], [20, 0], [20, 74], [8, 88], [8, 98], [12, 104], [3, 130], [-3, 130], [-12, 104], [-8, 98], [-8, 88], [-20, 74]], [10, 10, 10, 4, 3, 3, 3, 3, 3, 3, 4, 10])} color="#8a4a1e" shade={0.25} opacity={0.95} />
    <Part shape={ellipse(4, 22)} color="#ffffff" flat outline={0} opacity={0.6} x={-9} y={42} z={0.001} />
    {label ? <Part shape={roundRect(40, 24, 4)} color="#f2ead8" flat outline={3} y={38} z={0.002} /> : null}
  </X>
);

/** Thick chocolate stick (about 15 cm) stamped with the imperial crest; `wrap` 0..1 paper wrapper. Origin = centre, long axis on x. */
export const ChocolateStick: React.FC<XProps & { wrap?: number; crest?: boolean; bite?: boolean }> = ({ wrap = 0, crest = true, bite = false, ...xf }) => {
  const W = 300;
  return (
    <X {...xf}>
      <Part
        shape={bite ? blob([[-W / 2, -30], [W / 2 - 30, -30], [W / 2 - 10, -14], [W / 2 - 34, 0], [W / 2 - 10, 14], [W / 2 - 30, 30], [-W / 2, 30]], 6) : roundRect(W, 64, 16)}
        color="#5a3424"
        shade={0.25}
      >
        {[-90, -30, 30].map((x) => (
          <Line key={x} pts={[[x, -24], [x, 24]]} width={3} color="#3a2018" z={0.001} />
        ))}
      </Part>
      {crest ? (
        <X x={-W / 2 + 60} z={0.002}>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <Part key={i} shape={ellipse(9, 4)} color="#7a4a34" flat outline={2} x={Math.cos(a) * 15} y={Math.sin(a) * 15} rot={a} />;
          })}
          <Part shape={circle(8)} color="#7a4a34" flat outline={2} z={0.001} />
        </X>
      ) : null}
      {wrap > 0 ? <Part shape={roundRect(W * wrap + 8, 76, 10)} color="#efe6cf" shade={0.18} x={W / 2 - (W * wrap) / 2} z={0.01} /> : null}
    </X>
  );
};

/** Aluminium pill tube with a coloured label (write on it with a Label). Origin = bottom centre. */
export const PillTube: React.FC<XProps & { label?: string; h?: number }> = ({ label = "#2f4f9a", h = 170, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(56, h, 10)} color="#c9c6ce" shade={0.25} y={h / 2} />
    <Part shape={roundRect(60, h * 0.42, 4)} color={label} shade={0.2} y={h * 0.48} z={0.001} />
    <Part shape={roundRect(66, 30, 8)} color="#9a979f" shade={0.25} y={h + 6} z={0.002} />
  </X>
);

/** Round-bottomed chemistry flask with liquid; `bubbles` animates. Origin = bottom centre. */
export const LabFlask: React.FC<XProps & { liquid?: string; bubbles?: boolean }> = ({ liquid = "#9fd8c8", bubbles = true, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={circle(70)} color="#e6f4fa" flat outline={5} opacity={0.7} y={70} />
      <Part shape={blob([[-62, 60], [62, 60], [52, 24], [0, 2], [-52, 24]], 8)} color={liquid} flat outline={0} opacity={0.9} z={0.001} />
      <Part shape={roundRect(30, 90, 6)} color="#e6f4fa" flat outline={5} opacity={0.7} y={170} z={-0.001} />
      {bubbles
        ? [0, 1, 2, 3].map((i) => {
            const k = ((frame * 0.03 + i * 0.25) % 1);
            return <Part key={i} shape={circle(5 + i)} color="#ffffff" flat outline={2} x={(i - 1.5) * 16} y={20 + k * 160} z={0.002} />;
          })
        : null}
    </X>
  );
};

/** Ephedra (ma huang) in a pot: jointed green stems. Origin = bottom of the pot. */
export const Ephedra: React.FC<XProps> = (xf) => (
  <X {...xf}>
    {[-0.4, -0.2, 0, 0.2, 0.4].map((a, i) => (
      <X key={i} y={70} rot={a} z={-0.01}>
        <InkLine pts={[[0, 0], [0, 150 + (i % 2) * 40]]} width={9} color="#6f8f45" outline={3.5} />
        {[50, 100, 150].map((y) => (
          <Line key={y} pts={[[-6, y], [6, y]]} width={4} color="#3f5a2a" z={0.001} />
        ))}
      </X>
    ))}
    <Part shape={roundPoly([[-60, 0], [60, 0], [74, 80], [-74, 80]], 8)} color="#a85a3a" shade={0.25} />
  </X>
);

/** WWII bolt-action rifle (Arisaka style) pointing +x. Origin = grip. */
export const Rifle: React.FC<XProps & { bayonet?: boolean }> = ({ bayonet = false, ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-160, -18], [-60, -6], [180, -2], [180, 10], [-60, 12], [-160, 26]], 6)} color="#8a5a32" shade={0.25} />
    <Line pts={[[-40, 12], [300, 12]]} width={8} color="#3a3a42" z={0.001} />
    <Line pts={[[0, 18], [-12, 34]]} width={6} color="#3a3a42" z={0.002} />
    {bayonet ? <Part shape={poly([[296, 6], [420, 10], [296, 16]])} color="#c9c6ce" flat outline={3} z={0.003} /> : null}
  </X>
);

/** Coffee cup with steam. Origin = bottom centre. */
export const CoffeeCup: React.FC<XProps & { steam?: boolean }> = ({ steam = true, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={ellipse(110, 18)} color="#f4f1ea" shade={0.15} y={-4} z={-0.01} />
      <Part shape={roundPoly([[-64, 0], [64, 0], [76, 110], [-76, 110]], [20, 20, 6, 6])} color="#f4f1ea" shade={0.2} />
      <Part shape={ellipse(72, 14)} color="#5a3424" flat outline={4} y={106} z={0.001} />
      <InkLine pts={[[70, 86], [104, 80], [104, 40], [66, 30]]} width={12} color="#f4f1ea" outline={4} smooth z={-0.005} />
      {steam
        ? [-24, 8, 36].map((x, i) => (
            <Line key={x} pts={Array.from({ length: 6 }, (_, k) => [x + Math.sin(frame * 0.12 + k + i) * 8, 130 + k * 22] as [number, number])} smooth width={5} color="#ffffff" opacity={0.7} z={0.002} />
          ))
        : null}
    </X>
  );
};
