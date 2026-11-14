import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";

// Set dressing that makes interiors read as real places (matched to the
// soldier-short reference: textured surfaces, props that tell the story, light
// pools, something always moving), drawn in the house flat cel style.
// Background pieces take `recede` (0..1) to fade them toward the wall colour
// so they never compete with the characters in front.

const fade = (c: string, toward: string | undefined, k: number) => (toward ? mixHex(c, toward, k) : c);

/** Lower-wall panelling: panel band with vertical seams and a chair rail. Origin = floor line centre. */
export const Wainscot: React.FC<XProps & { w?: number; h?: number; wall: string; step?: number }> = ({ w = 4400, h = 300, wall, step = 260, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 0)} color={shadeHex(wall, -0.07)} flat outline={5} y={h / 2} />
    {Array.from({ length: Math.ceil(w / step) + 1 }, (_, i) => {
      const x = -w / 2 + i * step;
      return <Part key={i} shape={roundRect(step - 46, h - 60, 8)} color={shadeHex(wall, -0.03)} flat outline={4} outlineColor={shadeHex(wall, -0.3)} x={x + step / 2} y={h / 2} z={0.001} />;
    })}
    <Part shape={roundRect(w, 24, 4)} color={shadeHex(wall, 0.18)} shade={0.3} outline={5} y={h + 6} z={0.002} />
  </X>
);

/** Venetian blinds over a window opening (`open` 0..1 lifts them). Origin = window centre. */
export const Blinds: React.FC<XProps & { w: number; h: number; open?: number; color?: string }> = ({ w, h, open = 0.45, color = "#efe9dd", ...xf }) => {
  const n = Math.round((h * (1 - open)) / 44);
  return (
    <X {...xf}>
      <Part shape={roundRect(w + 30, 30, 6)} color={shadeHex(color, -0.08)} shade={0.25} y={h / 2 - 4} z={0.003} />
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} shape={roundRect(w - 6, 20, 5)} color={color} shade={0.3} outline={3.5} y={h / 2 - 34 - i * 44} z={0.002} />
      ))}
      <Line pts={[[w * 0.42, h / 2 - 10], [w * 0.42, h / 2 - 34 - n * 44 - 60]]} width={5} color="#8a8478" z={0.0025} />
    </X>
  );
};

export type ArtKind = "chart" | "rocket" | "mars" | "map" | "landscape" | "family" | "abstract";

/** Framed picture / poster with simple art. Origin = centre. */
export const WallFrame: React.FC<XProps & { w?: number; h?: number; art?: ArtKind; frame?: string; recede?: number; wall?: string; seed?: number }> = ({
  w = 300,
  h = 220,
  art = "landscape",
  frame = "#4a3424",
  recede = 0.2,
  wall,
  seed = 1,
  ...xf
}) => {
  const f = (c: string) => fade(c, wall, recede);
  const iw = w - 56;
  const ih = h - 56;
  const r = rng(seed);
  return (
    <X {...xf}>
      <Part shape={roundRect(w + 14, h + 14, 4)} color="#000000" flat outline={0} opacity={0.12} x={8} y={-10} z={-0.001} />
      <Part shape={roundRect(w, h, 5)} color={f(frame)} shade={0.25} />
      <Part shape={roundRect(w - 26, h - 26, 2)} color={f("#f3eee2")} flat outline={3} z={0.001} />
      <X z={0.002}>
        {art === "chart" ? (
          <>
            <Part shape={roundRect(iw, ih, 2)} color={f("#ffffff")} flat outline={0} />
            {[0.3, 0.45, 0.62, 0.85].map((v, i) => (
              <Part key={i} shape={roundRect(iw * 0.16, ih * v, 3)} color={f(["#3a7ac9", "#3fa07a", "#e9ba41", "#fe5649"][i])} flat outline={3} x={-iw * 0.33 + i * iw * 0.22} y={-ih / 2 + (ih * v) / 2} z={0.001} />
            ))}
          </>
        ) : art === "rocket" ? (
          <>
            <Part shape={roundRect(iw, ih, 2)} color={f("#25365e")} flat outline={0} />
            {Array.from({ length: 7 }, (_, i) => <Part key={i} shape={circle(3)} color={f("#ffffff")} flat outline={0} x={(r() - 0.5) * iw * 0.9} y={(r() - 0.5) * ih * 0.9} z={0.001} />)}
            <Part shape={roundRect(iw * 0.12, ih * 0.62, 6)} color={f("#f2f2f4")} flat outline={3} y={-ih * 0.06} z={0.002} />
            <Part shape={poly([[-iw * 0.06, ih * 0.25], [iw * 0.06, ih * 0.25], [0, ih * 0.42]])} color={f("#d8322f")} flat outline={3} z={0.002} />
          </>
        ) : art === "mars" ? (
          <>
            <Part shape={roundRect(iw, ih, 2)} color={f("#16161c")} flat outline={0} />
            <Part shape={circle(Math.min(iw, ih) * 0.34)} color={f("#c8643a")} shade={0.3} outline={3} z={0.001} />
          </>
        ) : art === "map" ? (
          <>
            <Part shape={roundRect(iw, ih, 2)} color={f("#9fd0dc")} flat outline={0} />
            <Part shape={ellipse(iw * 0.18, ih * 0.22)} color={f("#86b65a")} flat outline={3} x={-iw * 0.22} y={ih * 0.05} z={0.001} />
            <Part shape={ellipse(iw * 0.14, ih * 0.3)} color={f("#86b65a")} flat outline={3} x={iw * 0.18} y={-ih * 0.05} z={0.001} />
          </>
        ) : art === "family" ? (
          <>
            <Part shape={roundRect(iw, ih, 2)} color={f("#e8d6b0")} flat outline={0} />
            {[-0.24, 0, 0.24].map((x, i) => (
              <X key={i} x={x * iw} y={-ih * 0.05} z={0.001}>
                <Part shape={roundRect(iw * 0.14, ih * 0.3, 6)} color={f(["#3a7ac9", "#c25a7a", "#3fa07a"][i])} flat outline={3} y={-ih * 0.18} />
                <Part shape={circle(iw * 0.075)} color={f("#f6f5f8")} flat outline={3} y={ih * 0.1} z={0.001} />
              </X>
            ))}
          </>
        ) : art === "abstract" ? (
          <>
            <Part shape={roundRect(iw, ih, 2)} color={f("#f4e7c8")} flat outline={0} />
            <Part shape={circle(ih * 0.26)} color={f("#e9ba41")} flat outline={3} x={-iw * 0.18} y={ih * 0.08} z={0.001} />
            <Part shape={roundRect(iw * 0.3, ih * 0.5, 4)} color={f("#3a7ac9")} flat outline={3} x={iw * 0.2} y={-ih * 0.08} z={0.002} />
          </>
        ) : (
          <>
            <Part shape={roundRect(iw, ih, 2)} color={f("#a9d4ee")} flat outline={0} />
            <Part shape={ellipse(iw * 0.7, ih * 0.38)} color={f("#86b65a")} flat outline={3} y={-ih * 0.42} z={0.001} />
            <Part shape={circle(ih * 0.13)} color={f("#f6d35a")} flat outline={3} x={iw * 0.25} y={ih * 0.2} z={0.001} />
          </>
        )}
      </X>
    </X>
  );
};

/** Potted plant with gently swaying leaves. Origin = pot bottom centre. */
export const PottedPlant: React.FC<XProps & { h?: number; pot?: string; leaf?: string; seed?: number }> = ({ h = 420, pot = "#c8643a", leaf = "#4f8a3c", seed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const ph = 140;
  const leaves = 7;
  return (
    <X {...xf}>
      <Part shape={ellipse(110, 18)} color="#000000" flat outline={0} opacity={0.14} y={2} z={-0.002} />
      {Array.from({ length: leaves }, (_, i) => {
        const a = (i / (leaves - 1) - 0.5) * 1.5 + Math.sin(frame * 0.045 + i * 1.3 + seed) * 0.035;
        const len = (h - ph) * (0.75 + 0.25 * Math.cos((i / (leaves - 1) - 0.5) * 3));
        return (
          <X key={i} y={ph - 10} rot={-a} z={i % 2 ? -0.001 : 0.0005}>
            <Part shape={ellipse(34, len / 2)} color={i % 2 ? shadeHex(leaf, 0.12) : leaf} shade={0.3} y={len / 2} />
          </X>
        );
      })}
      <Part shape={roundPoly([[-62, 0], [62, 0], [84, ph], [-84, ph]], 10)} color={pot} shade={0.25} y={0} z={0.001} />
      <Part shape={roundRect(190, 30, 8)} color={shadeHex(pot, 0.12)} shade={0.25} y={ph} z={0.002} />
    </X>
  );
};

/** Coffee mug with rising steam puffs (loops). Origin = mug bottom centre. */
export const Mug: React.FC<XProps & { color?: string; steam?: boolean }> = ({ color = "#d8322f", steam = true, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={circle(22)} color={color} flat outline={8} x={36} y={40} z={-0.001} />
      <Part shape={roundRect(64, 80, 10)} color={color} shade={0.25} y={40} />
      {steam
        ? [0, 1, 2].map((i) => {
            const k = ((frame / 30) * 0.55 + i / 3) % 1;
            return <Part key={i} shape={ellipse(14 + k * 12, 20 + k * 14)} color="#ffffff" flat outline={0} opacity={0.55 * (1 - k) * Math.min(1, k * 5)} x={Math.sin(k * 6 + i) * 10} y={95 + k * 120} z={0.01} />;
          })
        : null}
    </X>
  );
};

/** A stack of papers + a pen cup for desks. Origin = desk-top centre. */
export const DeskClutter: React.FC<XProps> = (xf) => (
  <X {...xf}>
    {[0, 1, 2].map((i) => (
      <Part key={i} shape={roundRect(170, 16, 3)} color={i % 2 ? "#f4f1ea" : "#e9e4d8"} shade={0.2} outline={3.5} x={(i % 2) * 6 - 3} y={9 + i * 15} rot={(i - 1) * 0.02} z={i * 0.001} />
    ))}
    <X x={150}>
      {[-12, 0, 14].map((x, i) => (
        <Line key={i} pts={[[x, 40], [x + (i - 1) * 8, 120]]} width={7} color={["#3a7ac9", "#211b20", "#d8322f"][i]} z={-0.001} />
      ))}
      <Part shape={roundRect(54, 70, 8)} color="#5a6a7a" shade={0.25} y={35} />
    </X>
  </X>
);

/** Warm light pools on a wall from ceiling lamps (additive). Origin = wall line centre. */
export const WallLights: React.FC<XProps & { xs?: number[]; color?: string; alpha?: number; ry?: number }> = ({ xs = [-1100, 0, 1100], color = "#fff1c8", alpha = 0.22, ry = 520, ...xf }) => (
  <X {...xf}>
    {xs.map((x) => (
      <Glow key={x} x={x} rx={520} ry={ry} color={color} alpha={alpha} additive />
    ))}
  </X>
);

/** Slow dust motes drifting in a light shaft (additive specks). Origin = shaft centre. */
export const DustMotes: React.FC<XProps & { w?: number; h?: number; n?: number; seed?: number; color?: string }> = ({ w = 600, h = 700, n = 14, seed = 3, color = "#fff6dc", ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <X {...xf}>
      {Array.from({ length: n }, (_, i) => {
        const x0 = (r() - 0.5) * w;
        const y0 = (r() - 0.5) * h;
        const sp = 0.3 + r() * 0.5;
        const y = ((y0 + h / 2 - frame * sp + h * 10) % h) - h / 2;
        const x = x0 + Math.sin(frame * 0.03 + i) * 18;
        return <Part key={i} shape={circle(3 + r() * 3)} color={color} flat outline={0} opacity={0.55} x={x} y={y} />;
      })}
    </X>
  );
};

/** Round deciduous tree (trunk + layered crown) with a slow sway. Origin = trunk base. */
export const ParkTree: React.FC<XProps & { h?: number; color?: string; seed?: number; recede?: number; toward?: string }> = ({ h = 520, color = "#5f9a44", seed = 1, recede = 0, toward = "#cfe6f2", ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const c = (k: string) => (recede > 0 ? mixHex(k, toward, recede) : k);
  const sway = Math.sin(frame * 0.035 + seed) * 0.015;
  const crown = Array.from({ length: 5 }, (_, i) => [(r() - 0.5) * h * 0.45, h * (0.62 + r() * 0.22), h * (0.2 + r() * 0.08)] as [number, number, number]);
  return (
    <X {...xf}>
      <Part shape={roundPoly([[-h * 0.05, 0], [h * 0.05, 0], [h * 0.035, h * 0.6], [-h * 0.035, h * 0.6]], 8)} color={c("#7a5232")} shade={0.25} />
      <X rot={sway} y={h * 0.4} z={0.001}>
        {crown.map(([x, y, rr], i) => (
          <Part key={i} shape={circle(rr)} color={c(i % 2 ? shadeHex(color, 0.1) : color)} shade={0.28} x={x} y={y - h * 0.4} z={i * 0.0002} />
        ))}
      </X>
    </X>
  );
};

/** Photo-studio softbox on a stand; `flash` 0..1 lights it up. Origin = floor under the stand. */
export const Softbox: React.FC<XProps & { flash?: number; flip?: boolean; h?: number }> = ({ flash = 0, flip = false, h = 820, ...xf }) => (
  <X {...xf}>
    <Line pts={[[-90, 0], [0, 120], [90, 0]]} width={12} color="#3a3a42" />
    <Line pts={[[0, 0], [0, h]]} width={14} color="#3a3a42" />
    <X y={h + 40} rot={flip ? 0.25 : -0.25} z={0.01}>
      <Part shape={roundRect(320, 230, 14)} color="#2a2a30" shade={0.2} />
      <Part shape={roundRect(276, 186, 10)} color={mixHex("#e8e6f0", "#ffffff", flash)} flat outline={4} z={0.001} />
      {flash > 0.02 ? <Glow rx={420} ry={320} color="#ffffff" alpha={0.55 * flash} additive z={0.002} /> : null}
    </X>
  </X>
);

/** Data-centre server rack with blinking status LEDs. Origin = rack bottom centre. */
export const ServerRack: React.FC<XProps & { h?: number; seed?: number; color?: string }> = ({ h = 1000, seed = 1, color = "#262a33", ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const units = Math.floor((h - 60) / 84);
  return (
    <X {...xf}>
      <Part shape={roundRect(290, h, 10)} color={color} shade={0.18} y={h / 2} />
      {Array.from({ length: units }, (_, i) => (
        <X key={i} y={50 + i * 84 + 36} z={0.001}>
          <Part shape={roundRect(244, 66, 5)} color={shadeHex(color, -0.25)} flat outline={3} />
          {[0, 1, 2, 3].map((k) => {
            const per = 9 + Math.floor(r() * 14);
            const on = (Math.floor(frame / per) + k + i) % 3 !== 0;
            const col = k === 3 ? "#5ab0ff" : "#4fd17c";
            return <Part key={k} shape={circle(7)} color={on ? col : shadeHex(col, -0.55)} flat outline={0} x={-86 + k * 24} y={0} z={0.001} />;
          })}
          <Part shape={roundRect(70, 10, 3)} color="#3a404c" flat outline={0} x={70} z={0.001} />
        </X>
      ))}
    </X>
  );
};

/** Car steering wheel (front view). Origin = hub. */
export const SteeringWheel: React.FC<XProps & { r?: number; color?: string }> = ({ r = 260, color = "#26262c", ...xf }) => {
  const ring = Array.from({ length: 49 }, (_, i) => [Math.cos((i / 48) * Math.PI * 2) * r, Math.sin((i / 48) * Math.PI * 2) * r] as [number, number]);
  return (
    <X {...xf}>
      <Line pts={ring} width={64} color="#211b20" />
      <Line pts={ring} width={48} color={color} z={0.001} />
      {[Math.PI * 0.5 + 0.0, Math.PI * 1.15, Math.PI * 1.85].map((a, i) => (
        <X key={i} z={0.0005}>
          <Line pts={[[0, 0], [Math.cos(a - Math.PI / 2) * r, Math.sin(a - Math.PI / 2) * r]]} width={46} color="#211b20" />
          <Line pts={[[0, 0], [Math.cos(a - Math.PI / 2) * r, Math.sin(a - Math.PI / 2) * r]]} width={32} color={color} z={0.0001} />
        </X>
      ))}
      <Part shape={circle(r * 0.28)} color={shadeHex(color, 0.15)} shade={0.25} z={0.002} />
    </X>
  );
};
