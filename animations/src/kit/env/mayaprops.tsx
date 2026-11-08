import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";
import { Flame } from "./fire";

// Maya objects: glyphs, numbers, calendars, codices, ritual objects, corn,
// Pakal's tomb, and the deep-time props (asteroid, globe, dinosaurs, LiDAR).

type P = [number, number];
const INK = "#2a2026";
const JADE = "#3fa07a";

// ───────────────────────── writing & numbers ─────────────────────────

/**
 * One Maya glyph block: a rounded cartouche with a procedural "main sign"
 * (face, hand, cross-hatch, dots) and affixes. `kind` picks the special signs:
 * "tikal" (Mutul hair-knot), "snake" (Kaanul serpent head), "star" (star-war
 * Venus over earth), "zero" (shell).
 */
export const Glyph: React.FC<XProps & { size?: number; seed?: number; color?: string; ink?: string; kind?: "tikal" | "snake" | "star" | "zero" | null; paint?: string | null }> = ({
  size = 120,
  seed = 1,
  color = "#e8dcc0",
  ink = INK,
  kind = null,
  paint = null,
  ...xf
}) => {
  const r = rng(seed * 7 + 3);
  const s = size / 120;
  const fill = paint ?? color;
  const variant = Math.floor(r() * 4);
  return (
    <X {...xf} s={(xf.s ?? 1) * s}>
      <Part shape={roundRect(116, 116, 30)} color={fill} shade={0.18} />
      {/* prefix bar on the left */}
      <Part shape={roundRect(26, 92, 12)} color={mixHex(fill, "#ffffff", 0.15)} flat outline={3} x={-40} z={0.001} />
      {[-24, 0, 24].map((y) => (
        <Part key={y} shape={circle(5)} color={ink} flat outline={0} x={-40} y={y} z={0.002} />
      ))}
      <X x={12} z={0.003}>
        {kind === "tikal" ? (
          <>
            <Part shape={roundRect(70, 80, 20)} color={fill} flat outline={4} />
            <Line pts={[[-22, -20], [0, 0], [22, -20]]} width={6} color={ink} z={0.001} />
            <Line pts={[[-22, 20], [0, 0], [22, 20]]} width={6} color={ink} z={0.001} />
            <Part shape={circle(10)} color={ink} flat outline={0} z={0.002} />
          </>
        ) : kind === "snake" ? (
          <>
            <Part shape={blob([[-34, -28], [30, -32], [40, 6], [22, 34], [-24, 34], [-36, 6]], 8)} color={mixHex(fill, JADE, 0.5)} shade={0.2} />
            <Part shape={circle(9)} color={ink} flat outline={0} x={6} y={10} z={0.001} />
            <Line pts={[[-28, -14], [-8, -6], [12, -16], [30, -8]]} width={4} color={ink} z={0.001} />
            <Part shape={poly([[18, -26], [24, -42], [30, -26]])} color="#ffffff" flat outline={2.5} z={0.002} />
          </>
        ) : kind === "star" ? (
          <>
            <Part shape={roundRect(70, 40, 10)} color={fill} flat outline={4} y={22} />
            <Part shape={circle(10)} color={ink} flat outline={0} x={-14} y={24} z={0.001} />
            <Part shape={circle(10)} color={ink} flat outline={0} x={14} y={24} z={0.001} />
            {Array.from({ length: 4 }, (_, k) => (
              <Line key={k} pts={[[0, -10], [Math.cos(k * 1.57) * 26, -10 + Math.sin(k * 1.57) * 26]]} width={5} color={ink} z={0.001} />
            ))}
            <Part shape={circle(12)} color={fill} flat outline={4} y={-10} z={0.002} />
            {Array.from({ length: 6 }, (_, k) => (
              <Part key={`d${k}`} shape={circle(4)} color="#4a8acb" flat outline={0} x={-30 + k * 12} y={-40 - (k % 2) * 6} z={0.002} />
            ))}
          </>
        ) : kind === "zero" ? (
          <MayaShell size={70} />
        ) : variant === 0 ? (
          <>
            <Part shape={circle(34)} color={fill} flat outline={4} />
            <Part shape={circle(8)} color={ink} flat outline={0} x={10} y={8} z={0.001} />
            <Line pts={[[-16, -14], [0, -20], [18, -12]]} smooth width={5} color={ink} z={0.001} />
            <Line pts={[[-24, 20], [-8, 26]]} width={4} color={ink} z={0.001} />
          </>
        ) : variant === 1 ? (
          <>
            <Part shape={roundRect(68, 70, 14)} color={fill} flat outline={4} />
            {[-14, 4, 22].map((y) => (
              <Line key={y} pts={[[-26, y], [26, y]]} width={4} color={ink} z={0.001} />
            ))}
            <Line pts={[[-12, -30], [-12, 30]]} width={4} color={ink} z={0.001} />
          </>
        ) : variant === 2 ? (
          <>
            <Part shape={blob([[-30, -30], [30, -30], [36, 20], [10, 36], [-26, 30]], 7)} color={fill} flat outline={4} />
            {[[-10, -8], [10, -8], [0, 12]].map(([x, y], k) => (
              <Part key={k} shape={circle(6)} color={ink} flat outline={0} x={x} y={y} z={0.001} />
            ))}
          </>
        ) : (
          <>
            <Part shape={roundRect(70, 70, 34)} color={fill} flat outline={4} />
            <Line pts={[[-22, -22], [22, 22]]} width={4} color={ink} z={0.001} />
            <Line pts={[[-22, 22], [22, -22]]} width={4} color={ink} z={0.001} />
            <Part shape={circle(12)} color={fill} flat outline={4} z={0.002} />
          </>
        )}
      </X>
      {/* superfix */}
      <Part shape={roundRect(70, 18, 8)} color={mixHex(fill, "#ffffff", 0.15)} flat outline={3} x={12} y={46} z={0.004} />
    </X>
  );
};

/** Glyph text panel: double columns of glyph blocks (stone or painted). Origin = centre. */
export const GlyphPanel: React.FC<XProps & { cols?: number; rows?: number; size?: number; seed?: number; color?: string; frame?: string; reveal?: number }> = ({
  cols = 4,
  rows = 4,
  size = 110,
  seed = 1,
  color = "#d8ccb0",
  frame = "#b9ae98",
  reveal = 1,
  ...xf
}) => {
  const gap = size * 1.08;
  const n = cols * rows;
  return (
    <X {...xf}>
      <Part shape={roundRect(cols * gap + 50, rows * gap + 50, 16)} color={frame} shade={0.22} />
      {Array.from({ length: n }, (_, i) => {
        const c = i % cols;
        const rr = Math.floor(i / cols);
        const order = Math.floor(c / 2) * rows * 2 + rr * 2 + (c % 2);
        if (order / n >= reveal) return null;
        return <Glyph key={i} seed={seed * 31 + i} size={size} color={color} x={(c - (cols - 1) / 2) * gap} y={((rows - 1) / 2 - rr) * gap} z={0.001 + i * 0.0001} />;
      })}
    </X>
  );
};

/** Shell sign for zero. */
export const MayaShell: React.FC<XProps & { size?: number; color?: string }> = ({ size = 80, color = "#f4ead0", ...xf }) => (
  <X {...xf} s={(xf.s ?? 1) * (size / 80)}>
    <Part shape={blob([[-50, -10], [-30, 26], [10, 34], [46, 18], [52, -12], [20, -28], [-24, -26]], 8)} color={color} shade={0.24} />
    {[-24, -6, 12, 30].map((x) => (
      <Line key={x} pts={[[x, -20], [x + 6, 22]]} smooth width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
    ))}
    <Part shape={ellipse(10, 6)} color={shadeHex(color, 0.3)} flat outline={2.5} x={40} y={2} z={0.002} />
  </X>
);

/** Maya numeral 0–19: bars (5) stacked under dots (1), or the shell for 0. Origin = centre. */
export const MayaNumber: React.FC<XProps & { n: number; size?: number; color?: string }> = ({ n, size = 1, color = INK, ...xf }) => {
  if (n === 0) return <MayaShell {...xf} size={110 * size} />;
  const bars = Math.floor(n / 5);
  const dots = n % 5;
  const rows = bars + (dots ? 1 : 0);
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      {/* dots sit on top, bars stack below */}
      {Array.from({ length: bars }, (_, k) => (
        <Part key={`b${k}`} shape={roundRect(170, 30, 15)} color={color} shade={0.2} y={((rows - 1) / 2 - (k + (dots ? 1 : 0))) * 44} />
      ))}
      {Array.from({ length: dots }, (_, k) => (
        <Part key={`d${k}`} shape={circle(17)} color={color} shade={0.2} x={(k - (dots - 1) / 2) * 42} y={((rows - 1) / 2) * 44} />
      ))}
    </X>
  );
};

/** Folding-screen codex of bark paper, painted with glyphs, numbers and figures. `open` 0..1 unfolds it. Origin = centre. */
export const Codex: React.FC<XProps & { pages?: number; open?: number; burn?: number; seed?: number }> = ({ pages = 6, open = 1, burn = 0, seed = 2, ...xf }) => {
  const pw = 150;
  const ph = 230;
  const r = rng(seed);
  return (
    <X {...xf}>
      {Array.from({ length: pages }, (_, i) => {
        const x = (i - (pages - 1) / 2) * pw * open;
        const tilt = (i % 2 ? 1 : -1) * (1 - open) * 0.3;
        const charred = burn > i / pages;
        return (
          <X key={i} x={x} rot={tilt} z={i * 0.001}>
            <Part shape={roundRect(pw - 4, ph, 6)} color={charred ? "#3a2a26" : "#f2e8d0"} shade={0.18} />
            {!charred ? (
              <>
                <Line pts={[[-pw / 2 + 10, ph / 2 - 20], [pw / 2 - 10, ph / 2 - 20]]} width={4} color="#c0392b" z={0.001} />
                <Glyph seed={seed + i} size={46} paint={["#f2e8d0", "#e8c890", "#bfe0d0"][i % 3]} x={-30} y={50} z={0.002} />
                <Glyph seed={seed + i + 9} size={46} paint="#f2e8d0" x={30} y={50} z={0.002} />
                {i % 2 ? (
                  <MayaNumber n={1 + Math.floor(r() * 18)} size={0.2} color="#c0392b" y={-10} z={0.002} />
                ) : (
                  <X y={-40} z={0.002}>
                    <Part shape={circle(26)} color="#f4f1ea" shade={0.2} y={40} />
                    <Part shape={roundRect(50, 60, 12)} color="#3a9ac9" shade={0.2} />
                    <Part shape={roundRect(66, 12, 6)} color="#c0392b" flat outline={3} y={62} z={0.001} />
                  </X>
                )}
                <Line pts={[[-pw / 2 + 10, -ph / 2 + 20], [pw / 2 - 10, -ph / 2 + 20]]} width={4} color="#c0392b" z={0.001} />
              </>
            ) : (
              <Part shape={blob([[-pw / 2, ph / 2], [pw / 2, ph / 2], [pw / 2 - 20, ph / 2 - 60], [-pw / 2 + 30, ph / 2 - 40]], 6)} color="#1e1416" flat outline={0} z={0.001} />
            )}
          </X>
        );
      })}
    </X>
  );
};

/** Calendar gear: ring of `teeth` with numbers or day signs; turns with `rot`. Origin = centre. */
export const CalendarGear: React.FC<XProps & { r?: number; teeth?: number; color?: string; label?: "numbers" | "signs" | "months" }> = ({ r = 200, teeth = 20, color = "#d9c49a", label = "signs", ...xf }) => (
  <X {...xf}>
    {Array.from({ length: teeth }, (_, i) => {
      const a = (i / teeth) * Math.PI * 2;
      return (
        <X key={i} x={Math.cos(a) * r} y={Math.sin(a) * r} rot={a - Math.PI / 2} z={-0.001}>
          <Part shape={roundRect((Math.PI * 2 * r) / teeth * 0.55, r * 0.16, 4)} color={shadeHex(color, 0.1)} shade={0.2} y={r * 0.06} />
        </X>
      );
    })}
    <Part shape={circle(r)} color={color} shade={0.22} />
    <Part shape={circle(r * 0.72)} color={shadeHex(color, 0.06)} flat outline={4} z={0.001} />
    {Array.from({ length: Math.min(teeth, 20) }, (_, i) => {
      const a = (i / Math.min(teeth, 20)) * Math.PI * 2;
      return label === "numbers" ? (
        <MayaNumber key={i} n={(i % 13) + 1} size={r / 1800} x={Math.cos(a) * r * 0.86} y={Math.sin(a) * r * 0.86} rot={a - Math.PI / 2} z={0.002} />
      ) : (
        <Part key={i} shape={roundRect(r * 0.12, r * 0.12, r * 0.04)} color={shadeHex(color, -0.1)} flat outline={2.5} x={Math.cos(a) * r * 0.86} y={Math.sin(a) * r * 0.86} rot={a} z={0.002} />
      );
    })}
    <Part shape={circle(r * 0.2)} color={shadeHex(color, 0.2)} shade={0.25} z={0.003} />
  </X>
);

/** Long Count display (baktun.katun.tun.winal.kin) as five Maya-number columns that roll. Origin = centre. */
export const LongCount: React.FC<XProps & { value: number[]; roll?: number }> = ({ value, roll = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(1120, 340, 40)} color="#2a2228" shade={0.2} />
    {value.map((n, i) => (
      <X key={i} x={(i - 2) * 210} z={0.001 + i * 0.001}>
        <Part shape={roundRect(180, 260, 20)} color="#f2e8d0" shade={0.15} />
        <X y={roll * 120 * (i === 0 ? 0.3 : 1)} z={0.001}>
          <MayaNumber n={n} size={0.6} color="#2a2228" />
        </X>
      </X>
    ))}
  </X>
);

// ───────────────────────── ritual & royalty ─────────────────────────

/** Stingray spine (bloodletter). Origin = base. */
export const StingraySpine: React.FC<XProps & { len?: number }> = ({ len = 180, ...xf }) => (
  <X {...xf}>
    <Part shape={poly([[-8, 0], [8, 0], [0, len]])} color="#e8dcc0" shade={0.25} />
    {Array.from({ length: 6 }, (_, k) => (
      <Line key={k} pts={[[-5 + k * 0.8, len * (0.15 + k * 0.13)], [-12, len * (0.1 + k * 0.13)]]} width={3} z={0.001} />
    ))}
  </X>
);

/** Rope studded with thorns, hanging in a loop (Lady Xook's rite). */
export const ThornRope: React.FC<XProps & { len?: number; k?: number }> = ({ len = 500, k = 1, ...xf }) => {
  const pts: P[] = Array.from({ length: 14 }, (_, i) => [Math.sin((i / 13) * Math.PI) * 60, -(i / 13) * len * k]);
  return (
    <X {...xf}>
      <Line pts={pts} smooth width={10} color="#8a6a3e" />
      {pts.slice(1).map(([x, y], i) => (
        <Part key={i} shape={poly([[x - 6, y], [x + (i % 2 ? 18 : -18), y + 6], [x + 6, y]])} color="#e8dcc0" flat outline={2.5} z={0.001} />
      ))}
    </X>
  );
};

/** Pottery bowl (offering / bark paper). Origin = base. */
export const MayaBowl: React.FC<XProps & { w?: number; color?: string; papers?: boolean }> = ({ w = 220, color = "#d9864a", papers = false, ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-w / 2, w * 0.36], [w / 2, w * 0.36], [w * 0.4, w * 0.08], [0, 0], [-w * 0.4, w * 0.08]], 8)} color={color} shade={0.26} />
    <Line pts={[[-w * 0.44, w * 0.26], [w * 0.44, w * 0.26]]} width={4} color="#2a2026" z={0.001} />
    {[-0.3, -0.1, 0.1, 0.3].map((q) => (
      <Part key={q} shape={roundRect(12, 12, 3)} color="#2a2026" flat outline={0} x={w * q} y={w * 0.18} z={0.001} />
    ))}
    {papers
      ? [-0.2, 0, 0.2].map((q, i) => (
          <Part key={i} shape={roundRect(w * 0.18, w * 0.36, 4)} color="#f2e8d0" shade={0.15} x={w * q} y={w * 0.46} rot={q * 0.6} z={-0.001}>
            {[0.1, -0.05].map((dy) => (
              <Part key={dy} shape={ellipse(w * 0.05, w * 0.03)} color="#a8322a" flat outline={0} y={w * dy} z={0.001} />
            ))}
          </Part>
        ))
      : null}
  </X>
);

/** Carved limestone relief frame (lintel / panel) — wraps any content; tints it to stone. */
export const StonePanel: React.FC<XProps & { w?: number; h?: number; color?: string; children?: React.ReactNode }> = ({ w = 900, h = 600, color = "#c8bea6", children, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w + 60, h + 60, 18)} color={shadeHex(color, 0.1)} shade={0.24} />
    <Part shape={roundRect(w, h, 10)} color={color} flat outline={5} z={0.001} />
    <X z={0.002}>{children}</X>
  </X>
);

/** Jade mosaic death mask (Pakal). Origin = centre. */
export const JadeMask: React.FC<XProps & { size?: number; glow?: number }> = ({ size = 1, glow = 0, ...xf }) => {
  const r = rng(11);
  const tiles: [number, number, number, number][] = [];
  for (let y = -150; y <= 150; y += 34) {
    for (let x = -110; x <= 110; x += 34) {
      if ((x / 115) ** 2 + (y / 160) ** 2 < 1) tiles.push([x + (r() - 0.5) * 8, y + (r() - 0.5) * 8, 14 + r() * 6, r()]);
    }
  }
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      {glow > 0 ? <Glow rx={300} color="#7ae0b0" alpha={0.35 * glow} additive z={-0.01} /> : null}
      <Part shape={ellipse(122, 168)} color="#2f7a5a" shade={0.24} />
      {tiles.map(([x, y, s, q], i) => (
        <Part key={i} shape={roundPoly([[-s, -s * 0.8], [s * 0.9, -s], [s, s * 0.85], [-s * 0.85, s]], 3)} color={mixHex("#3fa07a", "#7ad0a8", q * 0.6)} flat outline={2} x={x} y={y} z={0.001 + i * 0.00001} />
      ))}
      {[-44, 44].map((x) => (
        <X key={x} x={x} y={30} z={0.01}>
          <Part shape={ellipse(30, 16)} color="#f4f1ea" flat outline={3.5} />
          <Part shape={circle(10)} color="#211b20" flat outline={0} z={0.001} />
        </X>
      ))}
      <Part shape={roundRect(70, 18, 8)} color="#c9a87a" flat outline={3} y={-70} z={0.01} />
      <Part shape={poly([[-10, 20], [10, 20], [16, -30], [-16, -30]])} color="#34886a" flat outline={2.5} z={0.009} />
    </X>
  );
};

/**
 * Pakal's sarcophagus lid relief, simplified: the king reclining on the maw of
 * the underworld, the cross-shaped world tree with a bird on top rising above,
 * glyph border. `rocket` 0..1 overlays the "ancient astronaut" reading.
 */
export const PakalLid: React.FC<XProps & { w?: number; h?: number; rocket?: number; highlight?: number }> = ({ w = 700, h = 1050, rocket = 0, highlight = 0, ...xf }) => {
  const stone = "#c9bea2";
  const carve = "#7a6e58";
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 16)} color={stone} shade={0.22} />
      <Part shape={roundRect(w - 90, h - 90, 8)} color={shadeHex(stone, 0.04)} flat outline={4} z={0.001} />
      {Array.from({ length: 10 }, (_, k) => (
        <React.Fragment key={k}>
          <Glyph seed={k + 40} size={38} color={stone} ink={carve} x={-w / 2 + 24} y={-h / 2 + 90 + k * ((h - 180) / 9)} z={0.002} />
          <Glyph seed={k + 60} size={38} color={stone} ink={carve} x={w / 2 - 24} y={-h / 2 + 90 + k * ((h - 180) / 9)} z={0.002} />
        </React.Fragment>
      ))}
      {/* underworld maw at the bottom */}
      <X y={-h * 0.33} z={0.003}>
        <Part shape={blob([[-w * 0.36, -60], [-w * 0.3, 40], [0, 70], [w * 0.3, 40], [w * 0.36, -60], [0, -90]], 8)} color={shadeHex(stone, 0.1)} flat outline={4} />
        {[-w * 0.2, -w * 0.07, w * 0.07, w * 0.2].map((x) => (
          <Part key={x} shape={poly([[x - 14, 40], [x, 0], [x + 14, 40]])} color={stone} flat outline={3} z={0.001} />
        ))}
      </X>
      {/* the king leaning back */}
      <X y={-h * 0.14} rot={0.5} z={0.004}>
        <Part shape={roundRect(90, 220, 30)} color={shadeHex(stone, 0.06)} flat outline={4} />
        <Part shape={circle(52)} color={shadeHex(stone, 0.06)} flat outline={4} y={150} z={0.001} />
        <Line pts={[[30, 60], [110, 110], [150, 80]]} width={10} color={carve} z={0.001} />
        <Line pts={[[-30, -90], [60, -150]]} width={10} color={carve} z={0.001} />
      </X>
      {/* world tree: cross with serpent-bar arms, quetzal on top */}
      <X y={h * 0.08} z={0.005}>
        <Part shape={roundRect(44, h * 0.44, 10)} color={highlight ? mixHex(shadeHex(stone, 0.06), "#5ab07a", highlight) : shadeHex(stone, 0.06)} flat outline={4} y={h * 0.18} />
        <Part shape={roundRect(w * 0.56, 40, 14)} color={highlight ? mixHex(shadeHex(stone, 0.06), "#5ab07a", highlight) : shadeHex(stone, 0.06)} flat outline={4} y={h * 0.26} z={0.001} />
        {[-1, 1].map((k) => (
          <Part key={k} shape={blob([[0, -20], [k * 50, -30], [k * 70, 0], [k * 50, 30], [0, 20]], 6)} color={shadeHex(stone, 0.06)} flat outline={4} x={k * w * 0.3} y={h * 0.26} z={0.002} />
        ))}
        <X y={h * 0.43} z={0.003}>
          <Part shape={blob([[-40, 0], [0, 30], [50, 10], [70, 40], [30, 60], [-20, 46]], 7)} color={shadeHex(stone, 0.06)} flat outline={4} />
        </X>
      </X>
      {rocket > 0 ? (
        <X z={0.02}>
          <Line pts={[[-w * 0.08, -h * 0.25], [-w * 0.1, h * 0.36], [0, h * 0.46], [w * 0.1, h * 0.36], [w * 0.08, -h * 0.25]]} width={10} color="#fe5649" opacity={rocket} />
          {[-1, 1].map((k) => (
            <Line key={k} pts={[[k * w * 0.08, -h * 0.15], [k * w * 0.2, -h * 0.3], [k * w * 0.08, -h * 0.28]]} width={10} color="#fe5649" opacity={rocket} />
          ))}
          {[0, 1, 2].map((i) => (
            <Line key={`f${i}`} pts={[[-w * 0.05 + i * w * 0.05, -h * 0.3], [-w * 0.05 + i * w * 0.05, -h * 0.42]]} width={8} color="#ffb35a" opacity={rocket} />
          ))}
        </X>
      ) : null}
    </X>
  );
};

/** Stone sarcophagus box (Pakal), side view; `lid` 0..1 slides the lid off. Origin = floor centre. */
export const Sarcophagus: React.FC<XProps & { w?: number; lid?: number; glow?: number }> = ({ w = 900, lid = 0, glow = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, 220, 12)} color="#bcb19a" shade={0.24} y={110} />
    {[-0.3, 0, 0.3].map((q) => (
      <Part key={q} shape={roundRect(w * 0.16, 120, 8)} color="#b2a690" flat outline={3} x={w * q} y={110} z={0.001} />
    ))}
    {glow > 0 ? <Glow y={230} rx={w * 0.5} ry={120} color="#7ae0b0" alpha={0.4 * glow} additive z={0.002} /> : null}
    <X x={lid * w * 0.55} y={232 + lid * 30} rot={lid * 0.12} z={0.003}>
      <Part shape={roundRect(w + 30, 40, 8)} color="#c9bea2" shade={0.22} />
      <Line pts={[[-w * 0.4, 0], [w * 0.4, 0]]} width={3} color="#9a8e72" z={0.001} />
    </X>
  </X>
);

// ───────────────────────── corn ─────────────────────────

/** Ear of corn in its husk. Origin = base. `kind` "corn" (big ripe ear) or "teosinte" (the tiny wild ancestor). */
export const CornCob: React.FC<XProps & { len?: number; kind?: "corn" | "teosinte"; color?: string }> = ({ len = 200, kind = "corn", color = "#f2c84a", ...xf }) => {
  if (kind === "teosinte") {
    return (
      <X {...xf}>
        {Array.from({ length: 7 }, (_, k) => (
          <Part key={k} shape={roundPoly([[-8, 0], [8, 0], [6, 14], [-6, 14]], 3)} color={k % 2 ? "#a8823a" : "#8a6a3a"} shade={0.25} y={k * 13} rot={(k % 2 ? 1 : -1) * 0.12} />
        ))}
      </X>
    );
  }
  const rows = 7;
  return (
    <X {...xf}>
      <Part shape={blob([[-len * 0.18, 0], [len * 0.18, 0], [len * 0.2, len * 0.6], [0, len], [-len * 0.2, len * 0.6]], 8)} color={color} shade={0.26} />
      {Array.from({ length: rows }, (_, k) => (
        <Line key={k} pts={[[-len * 0.16, len * (0.1 + k * 0.12)], [len * 0.16, len * (0.1 + k * 0.12)]]} width={3} color={shadeHex(color, 0.3)} z={0.001} />
      ))}
      <Line pts={[[0, 6], [0, len * 0.92]]} width={3} color={shadeHex(color, 0.3)} z={0.001} />
      {[-1, 1].map((k) => (
        <Part key={k} shape={blob([[0, 0], [k * len * 0.28, len * 0.2], [k * len * 0.24, len * 0.6], [k * len * 0.06, len * 0.5]], 7)} color="#7ab04a" shade={0.24} z={0.002} />
      ))}
    </X>
  );
};

/** Maize plant: stalk, long leaves, an ear, tassel on top. Origin = base. `grow` 0..1. */
/** `dry` 0..1 browns the plant and droops its leaves (drought). */
export const CornPlant: React.FC<XProps & { h?: number; grow?: number; seed?: number; dry?: number }> = ({ h = 520, grow = 1, seed = 1, dry = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.05 + seed) * 0.05 * (1 - dry);
  const hh = h * grow;
  const tint = (c: string) => mixHex(c, "#b8954a", dry * 0.85);
  return (
    <X {...xf}>
      <Line pts={[[0, 0], [sway * hh * 0.4 + dry * 40, hh * (1 - dry * 0.12)]]} smooth={false} width={12} color={tint("#6a9a3a")} />
      {[0.25, 0.42, 0.58, 0.74].map((q, i) => (
        <X key={q} x={sway * hh * 0.4 * q} y={hh * q} rot={(i % 2 ? -1 : 1) * (0.9 + dry * 1.1) + sway} z={0.001}>
          <Part shape={blob([[0, 0], [hh * 0.12, 16], [hh * 0.34, 4], [hh * 0.46, -26], [hh * 0.3, -6], [hh * 0.1, -4]], 7)} color={tint(i % 2 ? "#5a9a3a" : "#6aaa4a")} shade={0.24} sx={i % 2 ? -1 : 1} />
        </X>
      ))}
      {grow > 0.6 && dry < 0.5 ? <CornCob x={10 + sway * hh * 0.2} y={hh * 0.45} len={hh * 0.22} rot={-0.4} z={0.002} /> : null}
      {grow > 0.85
        ? [-0.4, 0, 0.4].map((a) => (
            <Line key={a} pts={[[sway * hh * 0.4, hh], [sway * hh * 0.4 + Math.sin(a) * 40, hh + 50]]} width={4} color="#d9b84e" z={0.003} />
          ))
        : null}
    </X>
  );
};

/** Corn tortilla on a clay griddle (comal). Origin = centre. */
export const Tortilla: React.FC<XProps & { r?: number; comal?: boolean }> = ({ r = 90, comal = true, ...xf }) => (
  <X {...xf}>
    {comal ? <Part shape={ellipse(r * 1.6, r * 0.5)} color="#6a4a3a" shade={0.24} y={-10} /> : null}
    <Part shape={ellipse(r, r * 0.32)} color="#f2dc9a" shade={0.2} z={0.001} />
    {[[-0.3, 0.05], [0.2, -0.08], [0.45, 0.1], [-0.05, -0.1]].map(([x, y], i) => (
      <Part key={i} shape={ellipse(r * 0.1, r * 0.05)} color="#c89a4a" flat outline={0} x={r * x} y={r * y} z={0.002} />
    ))}
  </X>
);

// ───────────────────────── deep time & science ─────────────────────────

/** Asteroid with a fiery entry trail along −x (it flies toward +x). Origin = rock centre. */
export const Asteroid: React.FC<XProps & { r?: number; trail?: number; seed?: number }> = ({ r = 90, trail = 1, seed = 3, ...xf }) => {
  const frame = useCurrentFrame();
  const rr = rng(seed);
  const pts: P[] = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2;
    const k = 0.78 + rr() * 0.3;
    return [Math.cos(a) * r * k, Math.sin(a) * r * k];
  });
  return (
    <X {...xf}>
      {trail > 0 ? (
        <X z={-0.01}>
          <Part shape={blob([[0, r * 0.9], [-r * 7 * trail, r * 0.25], [-r * 9 * trail, 0], [-r * 7 * trail, -r * 0.25], [0, -r * 0.9]], 8)} color="#ff8a3a" flat outline={0} opacity={0.75} />
          <Part shape={blob([[0, r * 0.6], [-r * 4.5 * trail, r * 0.12], [-r * 5.5 * trail, 0], [-r * 4.5 * trail, -r * 0.12], [0, -r * 0.6]], 8)} color="#ffe08a" flat outline={0} opacity={0.9} z={0.001} />
          <Glow rx={r * 3} color="#ffb35a" alpha={0.55} additive z={0.002} />
        </X>
      ) : null}
      <X rot={frame * 0.03}>
        <Part shape={blob(pts, 10)} color="#6a5a52" shade={0.3} />
        {[[0.3, 0.2, 0.22], [-0.35, -0.1, 0.18], [0.05, -0.4, 0.14]].map(([x, y, s], i) => (
          <Part key={i} shape={circle(r * s)} color="#4a3e3a" flat outline={3} x={r * x} y={r * y} z={0.001} />
        ))}
      </X>
    </X>
  );
};

/** Cartoon dinosaurs: "rex" (T. rex) or "neck" (sauropod), facing +x. Origin = between the feet. */
export const Dinosaur: React.FC<XProps & { kind?: "rex" | "neck"; color?: string; scared?: boolean; walk?: number }> = ({ kind = "rex", color = "#6aa05a", scared = false, walk = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const leg = (k: number) => Math.sin(frame * 0.25 * walk + k) * 0.3 * walk;
  const eye = (
    <>
      <Part shape={circle(16)} color="#ffffff" flat outline={3.5} />
      <Part shape={circle(scared ? 5 : 8)} color="#211b20" flat outline={0} x={4} z={0.001} />
    </>
  );
  if (kind === "neck") {
    return (
      <X {...xf}>
        {[-120, 110].map((x, i) => (
          <X key={x} x={x} y={150} rot={leg(i * 3)}>
            <Part shape={roundRect(60, 160, 26)} color={shadeHex(color, 0.12)} shade={0.24} y={-70} />
          </X>
        ))}
        <Part shape={blob([[-260, 160], [-180, 300], [80, 320], [220, 250], [200, 140], [-120, 120], [-330, 130]], 10)} color={color} shade={0.26} z={0.001} />
        <Part shape={blob([[160, 240], [230, 420], [300, 600], [340, 600], [270, 400], [220, 220]], 8)} color={color} shade={0.26} z={0.002} />
        <X x={330} y={610} z={0.003}>
          <Part shape={ellipse(60, 34)} color={color} shade={0.26} />
          <X x={20} y={10} z={0.001}>{eye}</X>
          {scared ? <Part shape={ellipse(12, 8)} color="#211b20" flat outline={0} x={46} y={-12} z={0.001} /> : null}
        </X>
        {[-90, 140].map((x, i) => (
          <X key={`f${x}`} x={x} y={150} rot={leg(i * 3 + 1.5)} z={0.004}>
            <Part shape={roundRect(64, 170, 28)} color={color} shade={0.24} y={-74} />
          </X>
        ))}
      </X>
    );
  }
  return (
    <X {...xf}>
      <X x={-40} y={150} rot={leg(0)}>
        <Part shape={roundPoly([[-30, 0], [30, 0], [24, -150], [50, -160], [-20, -160]], 10)} color={shadeHex(color, 0.12)} shade={0.24} />
      </X>
      <Part shape={blob([[-320, 180], [-150, 260], [20, 300], [120, 300], [140, 200], [40, 130], [-160, 160]], 10)} color={color} shade={0.26} z={0.001} />
      <X x={140} y={300} rot={scared ? 0.3 : 0} z={0.002}>
        <Part shape={blob([[-40, -40], [-30, 60], [80, 90], [190, 60], [200, 10], [120, -10], [40, -50]], 8)} color={color} shade={0.26} />
        <X x={80} y={50} z={0.001}>{eye}</X>
        <Line pts={[[60, 0], [190, 10]]} width={4} z={0.001} />
        {[90, 120, 150, 180].map((x) => (
          <Part key={x} shape={poly([[x - 7, 10], [x, -6], [x + 7, 10]])} color="#ffffff" flat outline={2.5} y={2} z={0.001} />
        ))}
      </X>
      <Line pts={[[110, 210], [150, 190], [170, 170]]} width={12} color={shadeHex(color, 0.1)} z={0.002} />
      <X x={30} y={150} rot={leg(3)} z={0.003}>
        <Part shape={roundPoly([[-34, 0], [34, 0], [28, -150], [56, -160], [-24, -160]], 10)} color={color} shade={0.24} />
      </X>
    </X>
  );
};

/**
 * LiDAR reveal: a jungle canopy (top) and the bare-earth scan beneath, coloured by
 * height, with hidden structures (house mounds, causeways, a platform) appearing
 * as the scan line passes (`k` 0..1). Origin = centre; w×h.
 */
export const LidarReveal: React.FC<XProps & { w?: number; h?: number; k?: number; seed?: number; platform?: boolean; city?: boolean }> = ({ w = 1600, h = 900, k = 1, seed = 4, platform = false, city = false, ...xf }) => {
  const r = rng(seed);
  const sx = -w / 2 + k * w;
  const mounds = Array.from({ length: 70 }, () => [(r() - 0.5) * w * 0.92, (r() - 0.5) * h * 0.86, 10 + r() * 18] as [number, number, number]);
  const roads: P[][] = [
    [[-w * 0.45, -h * 0.2], [-w * 0.1, -h * 0.05], [w * 0.2, h * 0.1], [w * 0.45, h * 0.3]],
    [[-w * 0.3, h * 0.4], [-w * 0.15, h * 0.1], [-w * 0.05, -h * 0.4]],
  ];
  const revealed = (x: number) => x < sx;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 10)} color="#1c3a2a" flat outline={5} />
      {Array.from({ length: 16 }, (_, i) => (
        <Line key={`c${i}`} pts={Array.from({ length: 24 }, (_, j) => [-w / 2 + (j / 23) * w, -h / 2 + (i + 0.5) * (h / 16) + Math.sin(j * 0.7 + i) * 8] as P)} smooth width={2.5} color="#2f5a3a" z={0.0005} />
      ))}
      <X z={0.001}>
        <Part shape={roundRect(Math.max(1, sx + w / 2), h - 10, 6)} color="#1a2230" flat outline={0} x={(sx - w / 2) / 2} />
        {Array.from({ length: 14 }, (_, i) => (
          <Line key={`t${i}`} pts={Array.from({ length: 20 }, (_, j) => [-w / 2 + (j / 19) * w, -h / 2 + (i + 0.5) * (h / 14) + Math.sin(j * 0.5 + i * 0.7) * 14] as P).filter(([x]) => revealed(x))} smooth width={2.5} color={["#2a6a8a", "#3a8a7a", "#6aaa5a", "#c8b04a"][i % 4]} z={0.0005} />
        ))}
        {roads.map((rd, i) => {
          const pts = rd.filter(([x]) => revealed(x));
          return pts.length > 1 ? <Line key={`r${i}`} pts={pts} width={10} color="#f2c84a" z={0.001} /> : null;
        })}
        {mounds.map(([x, y, s], i) =>
          revealed(x) ? <Part key={`m${i}`} shape={roundRect(s * 2, s * 1.4, 4)} color={city ? "#ff8a4a" : "#f2a04a"} flat outline={2} x={x} y={y} z={0.002} /> : null,
        )}
        {platform && revealed(0) ? (
          <Part shape={roundRect(w * 0.7, h * 0.12, 6)} color="#ff5a4a" flat outline={4} y={h * 0.05} z={0.003} />
        ) : null}
        {city && revealed(w * 0.1)
          ? [[w * 0.1, 0, 90], [w * 0.2, h * 0.1, 60], [w * 0.05, h * 0.18, 50]].map(([x, y, s], i) => (
              <Part key={`p${i}`} shape={roundRect(s, s, 6)} color="#ff4a3a" flat outline={4} x={x} y={y} z={0.003} />
            ))
          : null}
      </X>
      {k > 0 && k < 1 ? (
        <X x={sx} z={0.004}>
          <Line pts={[[0, -h / 2], [0, h / 2]]} width={6} color="#7affd0" />
          <Glow rx={60} ry={h * 0.6} color="#7affd0" alpha={0.4} additive />
        </X>
      ) : null}
    </X>
  );
};

/** Small survey plane with a downward LiDAR fan. Facing +x. Origin = fuselage centre. */
export const SurveyPlane: React.FC<XProps & { beam?: number }> = ({ beam = 1, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      {beam > 0 ? <Part shape={poly([[0, -10], [-160, -520], [160, -520]])} color="#7affd0" flat outline={0} opacity={0.18 * beam * (0.8 + 0.2 * Math.sin(frame * 0.6))} z={-0.01} /> : null}
      <Part shape={roundPoly([[-150, -20], [130, -24], [170, 0], [130, 24], [-150, 20], [-190, 46], [-210, 40], [-170, 0]], 10)} color="#f4f1ea" shade={0.26} />
      <Part shape={roundRect(70, 22, 10)} color="#3a6a9a" flat outline={3} x={90} y={6} z={0.001} />
      <Part shape={roundPoly([[-40, -6], [40, -6], [10, -120], [-24, -120]], 8)} color="#e8e2d4" shade={0.24} z={-0.001} />
      <Part shape={roundRect(28, 28, 8)} color="#2a2228" flat outline={3} y={-24} z={0.002} />
    </X>
  );
};

/** Lime kiln: a pit of burning logs with limestone on top (white plaster). Origin = ground centre. */
export const LimeKiln: React.FC<XProps & { fire?: number }> = ({ fire = 1, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: 8 }, (_, k) => (
      <Part key={k} shape={roundRect(260, 30, 14)} color="#6e4a2c" shade={0.24} y={20 + (k % 3) * 22} rot={((k * 37) % 7 - 3) * 0.05} x={(k % 2 ? -1 : 1) * 20} z={k * 0.0005} />
    ))}
    {Array.from({ length: 7 }, (_, k) => (
      <Part key={`s${k}`} shape={roundPoly([[-34, 0], [30, 0], [26, 40], [-30, 44]], 8)} color="#e6dcc4" shade={0.24} x={-120 + k * 40} y={92 + (k % 2) * 20} z={0.01 + k * 0.0005} />
    ))}
    {fire > 0 ? (
      <X y={60} z={0.02}>
        {[-80, 0, 80].map((x, i) => (
          <Flame key={x} x={x} size={0.9 * fire} seed={i + 3} />
        ))}
        <Glow y={60} rx={320} color="#ffb35a" alpha={0.45 * fire} additive />
      </X>
    ) : null}
  </X>
);

/** Tree stump. Origin = ground. */
export const Stump: React.FC<XProps & { w?: number }> = ({ w = 90, ...xf }) => (
  <X {...xf}>
    <Part shape={roundPoly([[-w / 2, 0], [w / 2, 0], [w * 0.4, w * 0.6], [-w * 0.4, w * 0.6]], 6)} color="#7a5232" shade={0.26} />
    <Part shape={ellipse(w * 0.4, w * 0.12)} color="#c9a26a" flat outline={3} y={w * 0.6} z={0.001} />
    <Part shape={ellipse(w * 0.18, w * 0.05)} color="#9a7a4a" flat outline={0} y={w * 0.6} z={0.002} />
  </X>
);

/** Stone war-god effigy on a carried litter (palanquin). Origin = litter base. */
export const WarGodLitter: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Line pts={[[-380, 0], [380, 0]]} width={16} color="#6e4a2c" />
    <Part shape={roundRect(420, 40, 8)} color="#8a5a32" shade={0.25} y={30} />
    <X y={50} z={0.001}>
      <Part shape={blob([[-120, 0], [120, 0], [130, 200], [60, 320], [-60, 320], [-130, 200]], 8)} color="#e0a83a" shade={0.26} />
      {[[-60, 80], [40, 120], [-20, 200], [70, 230], [-80, 250]].map(([x, y], i) => (
        <Part key={i} shape={ellipse(16, 12)} color="#2a2228" flat outline={0} x={x} y={y} z={0.001} />
      ))}
      <Part shape={circle(26)} color="#ffffff" flat outline={4} x={50} y={260} z={0.002} />
      <Part shape={circle(12)} color="#211b20" flat outline={0} x={54} y={260} z={0.003} />
      {[20, 50, 80].map((x) => (
        <Part key={x} shape={poly([[x - 10, 200], [x, 170], [x + 10, 200]])} color="#ffffff" flat outline={2.5} z={0.002} />
      ))}
      {Array.from({ length: 5 }, (_, k) => (
        <X key={`f${k}`} x={-40 + k * 20} y={320} rot={-0.6 + k * 0.3} z={-0.001}>
          <Part shape={blob([[0, 0], [-12, 60], [0, 150], [12, 60]], 6)} color={k % 2 ? "#2f9a5a" : "#3a9ac9"} shade={0.22} />
        </X>
      ))}
    </X>
  </X>
);

/** Quetzal bird (Tecun Uman legend). Facing +x. Origin = feet. */
export const Quetzal: React.FC<XProps & { flap?: number }> = ({ flap = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const w = Math.sin(frame * 0.6) * 0.5 * flap;
  return (
    <X {...xf}>
      <Part shape={blob([[-30, 30], [-120, -10], [-260, -40], [-140, 10], [-40, 10]], 8)} color="#1f8a5a" shade={0.24} z={-0.002} />
      <Part shape={blob([[-50, 10], [30, 0], [60, 40], [40, 90], [-10, 100], [-50, 60]], 8)} color="#2fb070" shade={0.26} />
      <Part shape={blob([[-20, 10], [40, 10], [50, 50], [10, 60], [-20, 40]], 6)} color="#d8322a" shade={0.24} z={0.001} />
      <X x={-20} y={70} rot={-0.4 + w} z={0.002}>
        <Part shape={blob([[0, 0], [-90, 20], [-120, 0], [-60, -20]], 6)} color="#1f8a5a" shade={0.24} />
      </X>
      <X x={40} y={96} z={0.003}>
        <Part shape={circle(28)} color="#2fb070" shade={0.26} />
        <Part shape={blob([[-20, 20], [0, 50], [16, 24]], 5)} color="#2fb070" shade={0.24} z={-0.001} />
        <Part shape={circle(7)} color="#211b20" flat outline={0} x={10} y={4} z={0.001} />
        <Part shape={poly([[24, -2], [44, -8], [24, -14]])} color="#f2c84a" flat outline={2.5} z={0.001} />
      </X>
      <Line pts={[[0, 0], [-6, 12]]} width={4} />
    </X>
  );
};

// ───────────────────────── collapse & contact props ─────────────────────────

/**
 * Lake-sediment core in a clear tube (the drought evidence): stacked mud layers
 * with pale gypsum bands that form when lake water evaporates. `mark` 0..1
 * highlights the drought band. Origin = centre; vertical.
 */
export const SedimentCore: React.FC<XProps & { w?: number; h?: number; mark?: number; seed?: number }> = ({ w = 150, h = 900, mark = 0, seed = 5, ...xf }) => {
  const r = rng(seed);
  const n = 22;
  const layers = Array.from({ length: n }, (_, i) => {
    const drought = i >= 9 && i <= 12;
    const c = drought ? (i % 2 ? "#efe6cf" : "#e2d6b4") : ["#6e5038", "#5a4030", "#7a5a3e", "#4a3628", "#8a6a48"][Math.floor(r() * 5)];
    return { c, hh: (h / n) * (0.6 + r() * 0.8), drought };
  });
  const total = layers.reduce((a, l) => a + l.hh, 0);
  let y = -h / 2;
  const iw = w - 18;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h + 30, w * 0.18)} color="#cfe6ea" flat outline={5} opacity={0.55} />
      {layers.map((l, i) => {
        const hh = (l.hh / total) * h;
        const yc = y + hh / 2;
        y += hh;
        return <Part key={i} shape={roundRect(iw, hh + 1, 2)} color={l.c} flat outline={0} y={yc} z={0.001 + i * 0.00001} />;
      })}
      {mark > 0 ? (
        <X z={0.004}>
          <Glow y={h * 0.0} rx={w * 1.4} ry={h * 0.16} color="#fff2c6" alpha={0.55 * mark} additive />
          <Part shape={roundRect(w + 30, h * 0.2, 10)} color="#000000" flat outline={6} opacity={0} y={-h * 0.01} s={0.8 + 0.2 * mark} />
        </X>
      ) : null}
      <Part shape={roundRect(w * 0.16, h * 0.9, w * 0.08)} color="#ffffff" flat outline={0} opacity={0.35} x={-w * 0.28} z={0.003} />
    </X>
  );
};

/** Cacao pod: ridged yellow-orange pod (origin = centre, long axis vertical). */
export const CacaoPod: React.FC<XProps & { len?: number; color?: string; open?: boolean }> = ({ len = 260, color = "#e0902a", open = false, ...xf }) => {
  const w = len * 0.46;
  return (
    <X {...xf}>
      <Part shape={blob([[0, -len / 2], [w / 2, -len * 0.28], [w / 2 + 6, len * 0.1], [w * 0.3, len * 0.42], [0, len / 2], [-w * 0.3, len * 0.42], [-w / 2 - 6, len * 0.1], [-w / 2, -len * 0.28]], 10)} color={color} shade={0.26} />
      {[-0.5, -0.2, 0.15, 0.45].map((q) => (
        <Line key={q} pts={[[q * w * 0.7, -len * 0.4], [q * w * 0.85, 0], [q * w * 0.6, len * 0.4]]} smooth width={4} color={shadeHex(color, 0.3)} z={0.001} />
      ))}
      <Line pts={[[0, len / 2 - 4], [0, len / 2 + 30]]} width={9} color="#6e4a2c" z={-0.001} />
      {open ? <Part shape={blob([[-w * 0.3, -len * 0.25], [w * 0.3, -len * 0.25], [w * 0.34, len * 0.2], [-w * 0.34, len * 0.2]], 8)} color="#f4ecd8" shade={0.18} z={0.002} /> : null}
    </X>
  );
};

/** One cacao bean (brown, with a crease) or, with `almond`, an almond. */
export const CacaoBean: React.FC<XProps & { size?: number; almond?: boolean }> = ({ size = 60, almond = false, ...xf }) => {
  const c = almond ? "#c99a62" : "#6a3a24";
  return (
    <X {...xf}>
      {almond ? (
        <Part shape={blob([[0, size * 0.7], [size * 0.42, size * 0.2], [size * 0.36, -size * 0.4], [0, -size * 0.62], [-size * 0.36, -size * 0.4], [-size * 0.42, size * 0.2]], 8)} color={c} shade={0.26} />
      ) : (
        <Part shape={ellipse(size * 0.44, size * 0.62)} color={c} shade={0.26} />
      )}
      {almond ? (
        [-0.15, 0.12].map((q) => <Line key={q} pts={[[q * size, size * 0.4], [q * size * 1.3, 0], [q * size, -size * 0.4]]} smooth width={2.5} color={shadeHex(c, 0.3)} z={0.001} />)
      ) : (
        <Line pts={[[0, -size * 0.45], [size * 0.06, 0], [0, size * 0.45]]} smooth width={3} color={shadeHex(c, 0.4)} z={0.001} />
      )}
    </X>
  );
};

/** Small clay effigy idol (the figures Landa burned): squat body, big face, feather crest. Origin = base. */
export const ClayIdol: React.FC<XProps & { size?: number; seed?: number; char?: number }> = ({ size = 1, seed = 1, char = 0, ...xf }) => {
  const cols = ["#c9784a", "#b8643a", "#d9905a", "#a8804a"];
  const base = mixHex(cols[seed % 4], "#2a2026", char * 0.75);
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      <Part shape={roundRect(120, 110, 30)} color={base} shade={0.26} y={55} />
      <Part shape={roundRect(150, 130, 40)} color={base} shade={0.26} y={170} z={0.001} />
      <Part shape={roundRect(120, 26, 8)} color={mixHex(["#3a9ac9", "#3fa07a", "#c0392b", "#f2c84a"][seed % 4], "#2a2026", char * 0.75)} flat outline={3} y={232} z={0.002} />
      {[-30, 30].map((x) => (
        <Part key={x} shape={circle(16)} color={mixHex("#f4ead0", "#2a2026", char * 0.6)} flat outline={3} x={x} y={182} z={0.002} />
      ))}
      {[-30, 30].map((x) => (
        <Part key={`p${x}`} shape={circle(6)} color="#211b20" flat outline={0} x={x} y={182} z={0.003} />
      ))}
      <Part shape={roundRect(54, 14, 7)} color="#211b20" flat outline={0} y={140} z={0.002} />
      <Part shape={blob([[-60, 240], [-30, 300], [0, 270], [30, 300], [60, 240]], 6)} color={mixHex("#3fa07a", "#2a2026", char * 0.75)} shade={0.2} z={-0.001} />
    </X>
  );
};
