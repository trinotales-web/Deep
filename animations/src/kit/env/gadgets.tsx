import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, GroundShadow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";

// Modern props: phones and social posts, screens, an 80s home computer,
// charts, money, documents, trophies, the sink, the chainsaw, books, brain
// implant, a humanoid robot, hospital gear, furniture and small icons.
// Text never goes in here: put Labels over these in the shots.

const INKC = "#211b20";

/** Smartphone, portrait. `children` draw in screen space (origin = screen centre). */
export const Phone: React.FC<XProps & { w?: number; screen?: string; glow?: number; children?: React.ReactNode }> = ({ w = 260, screen = "#f7f8fa", glow = 0.4, children, ...xf }) => {
  const h = w * 2.05;
  return (
    <X {...xf}>
      {glow > 0 ? <Glow rx={w * 1.1} ry={h * 0.7} color="#cfe6ff" alpha={0.25 * glow} additive z={-0.01} /> : null}
      <Part shape={roundRect(w, h, w * 0.14)} color="#1f1f26" shade={0.15} />
      <Part shape={roundRect(w * 0.88, h * 0.9, w * 0.08)} color={screen} flat outline={0} z={0.001} />
      <Part shape={roundRect(w * 0.3, w * 0.07, w * 0.035)} color="#1f1f26" flat outline={0} y={h * 0.43} z={0.002} />
      <X z={0.003}>{children}</X>
    </X>
  );
};

/** 2008-era candybar phone with a small screen and keypad. */
export const OldPhone: React.FC<XProps & { lit?: number }> = ({ lit = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(120, 240, 22)} color="#2a2a32" shade={0.2} />
    <Part shape={roundRect(92, 80, 8)} color={lit > 0 ? mixHex("#5a7a9a", "#bfe4ff", lit) : "#5a7a9a"} flat outline={4} y={60} z={0.001} />
    {[0, 1, 2].flatMap((r) => [-1, 0, 1].map((c) => <Part key={`${r}${c}`} shape={roundRect(22, 14, 5)} color="#55555f" flat outline={2.5} x={c * 30} y={-20 - r * 26} z={0.001} />))}
    {lit > 0 ? <Glow rx={120} y={60} color="#bfe4ff" alpha={0.35 * lit} additive z={0.002} /> : null}
  </X>
);

/** Flat monitor on a stand. `children` in screen space. */
export const Monitor: React.FC<XProps & { w?: number; h?: number; screen?: string; stand?: boolean; children?: React.ReactNode }> = ({ w = 640, h = 380, screen = "#1e2a3a", stand = true, children, ...xf }) => (
  <X {...xf}>
    {stand ? (
      <>
        <Part shape={roundRect(40, 90, 6)} color="#3a3a42" shade={0.2} y={-h / 2 - 40} z={-0.002} />
        <Part shape={roundRect(200, 20, 8)} color="#3a3a42" shade={0.2} y={-h / 2 - 86} z={-0.001} />
      </>
    ) : null}
    <Part shape={roundRect(w, h, 14)} color="#26262e" shade={0.15} />
    <Part shape={roundRect(w - 28, h - 28, 6)} color={screen} flat outline={0} z={0.001} />
    <X z={0.002}>{children}</X>
  </X>
);

/** Early-80s home computer: chunky monitor on top of a keyboard unit. `children` in screen space. */
export const HomeComputer: React.FC<XProps & { screen?: string; children?: React.ReactNode }> = ({ screen = "#10202a", children, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(560, 120, 16)} color="#8a6a4a" shade={0.2} y={60} />
    {Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 10 }, (_, c) => <Part key={`${r}${c}`} shape={roundRect(36, 18, 4)} color="#3a3034" flat outline={2} x={-216 + c * 48 + (r % 2) * 10} y={98 - r * 24} z={0.001} />),
    )}
    <Part shape={roundRect(480, 380, 30)} color="#d8cdb4" shade={0.2} y={330} z={0.002} />
    <Part shape={roundRect(380, 290, 30)} color={screen} flat outline={6} y={340} z={0.003} />
    <Glow rx={260} ry={200} y={340} color="#7fe0b0" alpha={0.18} additive z={0.004} />
    <X y={340} z={0.005}>{children}</X>
  </X>
);

/** Social media post card (avatar, name bar, text lines). Put the words on with a Label. */
export const PostCard: React.FC<XProps & { w?: number; h?: number; avatar?: string; dark?: boolean; lines?: number; likes?: number }> = ({
  w = 760,
  h = 300,
  avatar = "#6a6f7a",
  dark = false,
  lines = 0,
  likes = 0,
  ...xf
}) => {
  const bg = dark ? "#15181d" : "#ffffff";
  const ink = dark ? "#e8eaee" : "#2a2d33";
  const sub = dark ? "#71767b" : "#9aa0a8";
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 22)} color={bg} shade={0.06} outline={6} />
      <Part shape={circle(38)} color={avatar} shade={0.15} outline={4} x={-w / 2 + 64} y={h / 2 - 60} z={0.001} />
      <Part shape={roundRect(170, 18, 9)} color={ink} flat outline={0} x={-w / 2 + 200} y={h / 2 - 46} z={0.001} />
      <Part shape={roundRect(120, 14, 7)} color={sub} flat outline={0} x={-w / 2 + 176} y={h / 2 - 76} z={0.001} />
      {Array.from({ length: lines }, (_, i) => (
        <Part key={i} shape={roundRect(w - 120 - (i === lines - 1 ? 180 : 0), 16, 8)} color={sub} flat outline={0} x={-(i === lines - 1 ? 90 : 0)} y={h / 2 - 130 - i * 34} z={0.001} />
      ))}
      {likes > 0
        ? [0, 1, 2].map((i) => <Part key={`l${i}`} shape={circle(10)} color={sub} flat outline={0} x={-w / 2 + 70 + i * 120} y={-h / 2 + 34} z={0.001} />)
        : null}
    </X>
  );
};

/** Line chart with a growing line (`k` 0..1), filled area and end dot. Values 0..1. */
export const LineChart: React.FC<XProps & { w?: number; h?: number; values: number[]; k?: number; color?: string; paper?: string; grid?: boolean }> = ({
  w = 900,
  h = 520,
  values,
  k = 1,
  color = "#2fa05a",
  paper = "#f4ecd8",
  grid = true,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const n = values.length;
  const px = (i: number) => -w / 2 + 50 + (i / (n - 1)) * (w - 100);
  const py = (v: number) => -h / 2 + 50 + v * (h - 100);
  const upto = Math.max(1, (n - 1) * Math.max(0, Math.min(1, k)));
  const pts: [number, number][] = [];
  for (let i = 0; i <= Math.floor(upto); i++) pts.push([px(i), py(values[i])]);
  const fr = upto - Math.floor(upto);
  if (fr > 0 && Math.floor(upto) < n - 1) {
    const i = Math.floor(upto);
    pts.push([px(i) + (px(i + 1) - px(i)) * fr, py(values[i] + (values[i + 1] - values[i]) * fr)]);
  }
  const tip = pts[pts.length - 1];
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 18)} color={paper} shade={0.08} outline={6} />
      {grid
        ? [0.25, 0.5, 0.75].map((g) => <Line key={g} pts={[[-w / 2 + 40, py(g)], [w / 2 - 40, py(g)]]} width={2.5} color={shadeHex(paper, 0.12)} z={0.001} />)
        : null}
      <Line pts={[[-w / 2 + 44, -h / 2 + 44], [w / 2 - 40, -h / 2 + 44]]} width={4} color="#6a5a4a" z={0.002} />
      <Line pts={[[-w / 2 + 44, -h / 2 + 44], [-w / 2 + 44, h / 2 - 40]]} width={4} color="#6a5a4a" z={0.002} />
      {pts.length > 1 ? (
        <Part shape={poly([[pts[0][0], py(0) - 6], ...pts, [tip[0], py(0) - 6]])} color={mixHex(paper, color, 0.3)} flat outline={0} z={0.003} />
      ) : null}
      {pts.length > 1 ? <Line pts={pts} width={9} color={color} z={0.004} /> : null}
      {tip ? (
        <X x={tip[0]} y={tip[1]} z={0.005}>
          <Glow rx={40} color={color} alpha={0.3 + 0.2 * Math.sin(frame * 0.3)} additive />
          <Part shape={circle(12)} color={color} flat outline={4} />
        </X>
      ) : null}
    </X>
  );
};

/** Vertical bar chart: values 0..1 with colours; `k` grows the bars. Origin = baseline centre. */
export const Bars: React.FC<XProps & { values: number[]; colors?: string[]; w?: number; h?: number; k?: number; gap?: number }> = ({
  values,
  colors = ["#fe5649", "#3a7ac9", "#e9ba41", "#3fa07a"],
  w = 900,
  h = 600,
  k = 1,
  gap = 0.35,
  ...xf
}) => {
  const n = values.length;
  const bw = w / (n + (n + 1) * gap);
  return (
    <X {...xf}>
      <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={6} color="#4a3a32" z={0.01} />
      {values.map((v, i) => {
        const hh = Math.max(4, v * h * Math.min(1, Math.max(0, k * 1.2 - i * 0.05)));
        return <Part key={i} shape={roundRect(bw, hh, 8)} color={colors[i % colors.length]} shade={0.18} x={-w / 2 + gap * bw + bw / 2 + i * bw * (1 + gap)} y={hh / 2} />;
      })}
    </X>
  );
};

/** Pie chart from [fraction, colour] slices; `k` 0..1 reveals clockwise from the top. */
export const Pie: React.FC<XProps & { r?: number; slices: [number, string][]; k?: number; pop?: number }> = ({ r = 260, slices, k = 1, pop = -1, ...xf }) => {
  let a0 = Math.PI / 2;
  const total = Math.PI * 2 * Math.max(0, Math.min(1, k));
  let used = 0;
  return (
    <X {...xf}>
      {slices.map(([f, col], i) => {
        const span = Math.min(f * Math.PI * 2, Math.max(0, total - used));
        used += f * Math.PI * 2;
        if (span <= 0.001) return null;
        const n = Math.max(3, Math.ceil(span / 0.12));
        const pts: [number, number][] = [[0, 0]];
        for (let j = 0; j <= n; j++) {
          const a = a0 - (span * j) / n;
          pts.push([Math.cos(a) * r, Math.sin(a) * r]);
        }
        const mid = a0 - span / 2;
        a0 -= f * Math.PI * 2;
        const off = i === pop ? r * 0.12 : 0;
        return <Part key={i} shape={poly(pts)} color={col} shade={0.12} x={Math.cos(mid) * off} y={Math.sin(mid) * off} z={i * 0.001} />;
      })}
    </X>
  );
};

/** One banknote (flat, slightly rotated by the caller). */
export const Banknote: React.FC<XProps & { w?: number }> = ({ w = 220, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, w * 0.45, 6)} color="#8fc28a" shade={0.15} outline={4} />
    <Part shape={roundRect(w * 0.84, w * 0.32, 4)} color="#a9d6a2" flat outline={2.5} z={0.001} />
    <Part shape={circle(w * 0.11)} color="#6fa86a" flat outline={2.5} z={0.002} />
  </X>
);

/** Stack of cash (bundled notes). */
export const Cash: React.FC<XProps & { w?: number; n?: number }> = ({ w = 240, n = 5, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: n }, (_, i) => (
      <X key={i} y={i * 14} z={i * 0.001}>
        <Part shape={roundRect(w, 26, 5)} color={i % 2 ? "#86ba80" : "#93c78c"} shade={0.15} outline={4} y={13} />
      </X>
    ))}
    <Part shape={roundRect(40, n * 14 + 14, 3)} color="#e9ba41" flat outline={3.5} y={(n * 14) / 2 + 6} z={0.01} />
  </X>
);

/** Money bag with a dollar sign. Origin = bottom. */
export const MoneyBag: React.FC<XProps & { color?: string }> = ({ color = "#c9a66a", ...xf }) => (
  <X {...xf}>
    <GroundShadow w={260} y={2} z={-0.01} />
    <Part shape={blob([[-120, 20], [-130, 120], [-70, 210], [-30, 236], [30, 236], [70, 210], [130, 120], [120, 20], [0, 0]], 10)} color={color} shade={0.24} />
    <Part shape={blob([[-40, 236], [-60, 290], [-20, 270], [0, 300], [20, 270], [60, 290], [40, 236]], 6)} color={color} shade={0.24} z={0.001} />
    <Part shape={roundRect(100, 18, 8)} color={shadeHex(color, 0.35)} flat outline={3} y={238} z={0.002} />
    <Line pts={[[30, 150], [-10, 162], [-30, 140], [20, 112], [26, 86], [-20, 82], [-34, 96]]} smooth width={10} color="#2f7a3a" z={0.003} />
    <Line pts={[[0, 176], [0, 66]]} width={9} color="#2f7a3a" z={0.003} />
  </X>
);

/** Gold coin, face-on (`edge` 0..1 squashes it for a spin). */
export const GoldCoin: React.FC<XProps & { r?: number; edge?: number }> = ({ r = 60, edge = 1, ...xf }) => (
  <X {...xf} sx={(xf.sx ?? 1) * Math.max(0.08, edge)}>
    <Part shape={circle(r)} color="#e9ba41" shade={0.22} />
    <Part shape={circle(r * 0.72)} color="#f2cc5a" flat outline={3} z={0.001} />
  </X>
);

/** Big presentation cheque. Write the amount with a Label. */
export const Cheque: React.FC<XProps & { w?: number }> = ({ w = 900, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, w * 0.42, 14)} color="#f6f1e2" shade={0.1} outline={7} />
    <Part shape={roundRect(w * 0.94, 20, 4)} color="#8fc2c0" flat outline={0} y={w * 0.17} z={0.001} />
    <Line pts={[[-w * 0.4, -w * 0.02], [w * 0.1, -w * 0.02]]} width={4} color="#9a8f7a" z={0.001} />
    <Line pts={[[w * 0.15, -w * 0.12], [w * 0.42, -w * 0.12]]} width={4} color="#9a8f7a" z={0.001} />
    <Line pts={[[w * 0.18, -w * 0.1], [w * 0.24, -w * 0.06], [w * 0.28, -w * 0.12], [w * 0.33, -w * 0.07], [w * 0.38, -w * 0.11]]} smooth width={4} color="#2a3a6a" z={0.002} />
    <Part shape={roundRect(w * 0.3, w * 0.09, 8)} color="#ffffff" flat outline={4} x={w * 0.28} y={w * 0.04} z={0.001} />
  </X>
);

/** Gold trophy cup on a base. Origin = bottom. */
export const Trophy: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={roundRect(180, 40, 8)} color="#4a3a32" shade={0.2} y={20} />
    <Part shape={roundRect(60, 80, 8)} color="#e9ba41" shade={0.22} y={80} z={0.001} />
    <Part shape={blob([[-110, 300], [110, 300], [96, 220], [50, 150], [-50, 150], [-96, 220]], 8)} color="#e9ba41" shade={0.24} y={0} z={0.002} />
    {[-1, 1].map((sd) => (
      <Line key={sd} pts={[[sd * 100, 280], [sd * 150, 260], [sd * 140, 200], [sd * 80, 190]]} smooth width={14} color="#d8a832" z={0.001} />
    ))}
    <Part shape={roundRect(70, 30, 6)} color="#f2cc5a" flat outline={3} y={40} z={0.003} />
  </X>
);

/** Medal on a ribbon (hangs from the origin). */
export const Medal: React.FC<XProps & { ribbon?: string }> = ({ ribbon = "#2f4f9a", ...xf }) => (
  <X {...xf}>
    <Part shape={poly([[-26, 0], [26, 0], [12, -90], [-12, -90]])} color={ribbon} flat outline={4} />
    <Part shape={circle(46)} color="#e9ba41" shade={0.25} y={-128} z={0.001} />
    <Part
      shape={poly(Array.from({ length: 10 }, (_, i) => {
        const a = Math.PI / 2 + (i * Math.PI) / 5;
        const r = i % 2 ? 11 : 26;
        return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
      }))}
      color="#f8dc7a"
      flat
      outline={3}
      y={-128}
      z={0.002}
    />
  </X>
);

/** Judge's gavel resting on its block. */
export const Gavel: React.FC<XProps & { swing?: number }> = ({ swing = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={ellipse(80, 22)} color="#6e4a2c" shade={0.2} y={10} />
    <X x={-40} y={40} rot={0.4 + swing} z={0.01}>
      <Part shape={roundRect(220, 16, 7)} color="#8a5a32" shade={0.2} x={-70} />
      <Part shape={roundRect(54, 96, 16)} color="#6e4a2c" shade={0.24} x={40} />
    </X>
  </X>
);

/** White bathroom basin with tap (carried in two hands). Origin = bottom centre. */
export const Sink: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={blob([[-150, 120], [150, 120], [140, 70], [90, 10], [-90, 10], [-140, 70]], 8)} color="#f4f6f8" shade={0.24} />
    <Part shape={ellipse(120, 18)} color="#d8dde4" flat outline={4} y={118} z={0.001} />
    <Part shape={roundRect(24, 50, 8)} color="#b9bec6" shade={0.2} x={0} y={140} z={0.002} />
    <Part shape={roundRect(70, 16, 8)} color="#b9bec6" shade={0.2} x={20} y={164} z={0.003} />
  </X>
);

/** Chainsaw pointing +x (handle at the origin). */
export const Chainsaw: React.FC<XProps & { run?: number }> = ({ run = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const jit = run > 0 ? Math.sin(frame * 2.3) * 2 * run : 0;
  return (
    <X {...xf} y={(xf.y ?? 0) + jit}>
      <Part shape={roundRect(360, 54, 26)} color="#b9bec6" shade={0.2} x={250} />
      {Array.from({ length: 14 }, (_, i) => (
        <Part key={i} shape={poly([[0, 0], [10, 10], [20, 0]])} color="#6a6e76" flat outline={2} x={90 + i * 24 + ((frame * run * 6) % 24)} y={27} z={0.001} />
      ))}
      <Part shape={roundRect(170, 120, 26)} color="#e2702a" shade={0.24} x={10} z={0.002} />
      <Line pts={[[-60, 40], [-40, 90], [40, 92], [60, 50]]} smooth width={14} color="#2a2a30" z={0.003} />
      <Part shape={roundRect(60, 30, 8)} color="#2a2a30" flat outline={3} x={-40} y={-20} z={0.003} />
    </X>
  );
};

/** Closed book seen from the front. Title via Label. */
export const Book: React.FC<XProps & { w?: number; h?: number; cover?: string; accent?: string }> = ({ w = 300, h = 420, cover = "#2f6fa8", accent = "#e9ba41", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w + 18, h, 10)} color="#f4ecd8" shade={0.1} x={8} y={-6} z={-0.001} />
    <Part shape={roundRect(w, h, 10)} color={cover} shade={0.2} />
    <Part shape={roundRect(26, h - 12, 6)} color={shadeHex(cover, 0.25)} flat outline={0} x={-w / 2 + 18} z={0.001} />
    <Part shape={roundRect(w * 0.7, h * 0.36, 8)} color={accent} flat outline={4} y={h * 0.12} z={0.001} />
  </X>
);

/** A shelf-row of book spines (e.g. an encyclopedia). Origin = bottom-left. */
export const BookRow: React.FC<XProps & { n?: number; colors?: string[]; h?: number; gold?: boolean; seed?: number }> = ({ n = 10, colors = ["#7a2a2a", "#2a4a7a", "#2f6a3a", "#6a4a2a"], h = 220, gold = false, seed = 3, ...xf }) => {
  const r = rng(seed);
  let x = 0;
  return (
    <X {...xf}>
      {Array.from({ length: n }, (_, i) => {
        const bw = 36 + r() * 16;
        const bh = h * (0.82 + r() * 0.18);
        const c = colors[i % colors.length];
        x += bw;
        return (
          <X key={i} x={x - bw / 2} y={bh / 2} z={i * 0.001}>
            <Part shape={roundRect(bw, bh, 5)} color={c} shade={0.18} />
            {gold ? (
              <>
                <Line pts={[[-bw / 2 + 6, bh * 0.3], [bw / 2 - 6, bh * 0.3]]} width={3} color="#e9ba41" z={0.001} />
                <Line pts={[[-bw / 2 + 6, -bh * 0.3], [bw / 2 - 6, -bh * 0.3]]} width={3} color="#e9ba41" z={0.001} />
              </>
            ) : null}
          </X>
        );
      })}
    </X>
  );
};

/** Magazine cover (colour blocks); title via Label. */
export const Magazine: React.FC<XProps & { w?: number; color?: string }> = ({ w = 380, color = "#c8262f", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, w * 1.32, 8)} color="#f6f1e6" shade={0.1} />
    <Part shape={roundRect(w - 20, w * 0.26, 4)} color={color} flat outline={0} y={w * 0.5} z={0.001} />
    <Part shape={roundRect(w * 0.6, w * 0.5, 6)} color="#1e2a3a" flat outline={4} y={-w * 0.05} z={0.001} />
    {[-0.4, -0.5].map((k) => (
      <Part key={k} shape={roundRect(w * 0.7, 12, 6)} color="#9a9488" flat outline={0} y={w * k} z={0.001} />
    ))}
  </X>
);

/** Handheld microphone (head up). */
export const Mic: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={roundRect(26, 120, 10)} color="#2a2a30" shade={0.2} y={-30} />
    <Part shape={circle(28)} color="#9aa0aa" shade={0.24} y={46} z={0.001} />
  </X>
);

/** Simple blue bird icon (social network before the rename). */
export const Bird: React.FC<XProps & { color?: string; flap?: number }> = ({ color = "#3aa0e8", flap = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-90, 0], [-60, -50], [20, -60], [80, -20], [96, 30], [70, 60], [20, 40], [-40, 30]], 8)} color={color} shade={0.2} />
    <X x={-10} y={10} rot={-0.3 - flap * 0.8} z={0.001}>
      <Part shape={blob([[0, 0], [-90, 40], [-120, 90], [-40, 60], [20, 20]], 6)} color={shadeHex(color, 0.12)} shade={0.15} />
    </X>
    <Part shape={circle(34)} color={color} shade={0.2} x={78} y={52} z={0.002} />
    <Part shape={poly([[104, 58], [140, 48], [106, 40]])} color="#e9ba41" flat outline={3} z={0.003} />
    <Part shape={circle(6)} color={INKC} flat outline={0} x={88} y={60} z={0.003} />
  </X>
);

/** Bold letter X mark (two crossing strokes). */
export const XMark: React.FC<XProps & { size?: number; color?: string }> = ({ size = 300, color = "#f4f4f6", ...xf }) => (
  <X {...xf}>
    <Part shape={roundPoly([[-size / 2, size / 2], [-size / 2 + size * 0.22, size / 2], [size / 2, -size / 2], [size / 2 - size * 0.22, -size / 2]], 6)} color={color} shade={0.12} />
    <Part shape={roundPoly([[size / 2, size / 2], [size / 2 - size * 0.14, size / 2], [-size / 2, -size / 2], [-size / 2 + size * 0.14, -size / 2]], 6)} color={color} shade={0.12} z={0.001} />
  </X>
);

/** Pink brain (side view) with folds. */
export const Brain: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={blob([[-170, 0], [-160, 90], [-90, 150], [10, 160], [110, 130], [170, 60], [160, -30], [90, -70], [0, -60], [-80, -80], [-150, -50]], 10)} color="#f2a7b8" shade={0.22} />
    {[
      [[-120, 40], [-80, 80], [-30, 60], [10, 100]],
      [[-60, -20], [-10, 20], [40, -10], [90, 30]],
      [[30, 120], [60, 80], [120, 90]],
      [[-130, -20], [-90, -40], [-60, -10]],
    ].map((pts, i) => (
      <Line key={i} pts={pts as [number, number][]} smooth width={5} color="#c8708a" z={0.001} />
    ))}
  </X>
);

/** Coin-sized brain implant with hair-thin threads. */
export const Implant: React.FC<XProps & { glow?: number }> = ({ glow = 0, ...xf }) => (
  <X {...xf}>
    {glow > 0 ? <Glow rx={90} color="#7fd0ff" alpha={0.45 * glow} additive z={-0.01} /> : null}
    {[-0.9, -0.5, -0.1, 0.3].map((a, i) => (
      <Line key={i} pts={[[0, 0], [Math.cos(a - 1.6) * 60, Math.sin(a - 1.6) * 90], [Math.cos(a - 1.5) * 90, Math.sin(a - 1.5) * 140]]} smooth width={2.5} color="#b9bec6" z={-0.002} />
    ))}
    <Part shape={circle(46)} color="#d8dde4" shade={0.25} />
    <Part shape={circle(26)} color="#9aa0aa" flat outline={3} z={0.001} />
  </X>
);

/** Humanoid robot (Optimus-style): white shell, black face plate. Joints like the Character rig. */
export const Humanoid: React.FC<XProps & { armF?: [number, number]; armB?: [number, number]; legF?: number; legB?: number; lean?: number; headTilt?: number; bob?: number; costume?: boolean }> = ({
  armF = [0.1, 0.1],
  armB = [-0.1, -0.1],
  legF = 0,
  legB = 0,
  lean = 0,
  headTilt = 0,
  bob = 0,
  costume = false,
  ...xf
}) => {
  const shell = costume ? "#f2f2f4" : "#eceef2";
  const dark = "#26262e";
  const arm = (a: [number, number], sd: 1 | -1, z: number) => (
    <X x={sd * 62} y={330} rot={a[0]} z={z}>
      <Part shape={roundRect(40, 110, 18)} color={sd > 0 ? shell : shadeHex(shell, 0.1)} shade={0.2} y={-50} />
      <X y={-104} rot={a[1]} z={0.01}>
        <Part shape={roundRect(34, 100, 16)} color={dark} shade={0.2} y={-46} />
        <Part shape={roundRect(38, 40, 14)} color={shell} shade={0.2} y={-104} z={0.01} />
      </X>
    </X>
  );
  const leg = (a: number, sd: 1 | -1, z: number) => (
    <X x={sd * 30} y={170} rot={a} z={z}>
      <Part shape={roundRect(46, 100, 18)} color={shell} shade={0.2} y={-46} />
      <Part shape={roundRect(40, 90, 16)} color={dark} shade={0.2} y={-130} z={0.01} />
      <Part shape={roundRect(70, 26, 10)} color={dark} shade={0.2} x={sd * 0 + 14} y={-170} z={0.02} />
    </X>
  );
  return (
    <X {...xf}>
      <GroundShadow w={180} y={2} z={-0.05} />
      <X y={bob}>
        {leg(legB, -1, 0.01)}
        {leg(legF, 1, 0.02)}
        <X y={170} rot={lean}>
          <X y={-170}>
            {arm(armB, -1, 0.03)}
            <Part shape={roundPoly([[-70, 150], [70, 150], [80, 350], [-80, 350]], [20, 20, 30, 30])} color={shell} shade={0.22} z={0.05}>
              <Part shape={roundRect(110, 60, 16)} color={dark} flat outline={0} y={-30} z={0.001} />
              {costume ? <Line pts={[[0, 100], [0, -90]]} width={3} color="#c8ccd4" z={0.002} /> : null}
            </Part>
            {arm(armF, 1, 0.08)}
            <X y={380} rot={headTilt} z={0.07}>
              <Part shape={roundRect(28, 30, 8)} color={dark} flat outline={3} y={-6} />
              <Part shape={ellipse(62, 70)} color={shell} shade={0.22} y={50} z={0.001} />
              <Part shape={roundPoly([[-10, 30], [60, 26], [62, 80], [-6, 84]], 14)} color={dark} flat outline={3} y={0} z={0.002} />
              <Part shape={ellipse(24, 6)} color="#5a7aa0" flat outline={0} opacity={0.6} x={32} y={66} z={0.003} />
            </X>
          </X>
        </X>
      </X>
    </X>
  );
};

/** Chess board seen at a low angle, with a few pieces. Origin = centre. */
export const ChessBoard: React.FC<XProps & { w?: number; move?: number }> = ({ w = 520, move = 0, ...xf }) => {
  const c = w / 8;
  return (
    <X {...xf}>
      <X sy={0.5}>
        <Part shape={roundRect(w + 30, w + 30, 10)} color="#6e4a2c" shade={0.15} />
        {Array.from({ length: 64 }, (_, i) => {
          const r = Math.floor(i / 8);
          const col = i % 8;
          return (r + col) % 2 ? <Part key={i} shape={roundRect(c, c, 0)} color="#4a3428" flat outline={0} x={-w / 2 + c / 2 + col * c} y={-w / 2 + c / 2 + r * c} z={0.001} /> : null;
        })}
        <Part shape={roundRect(w, w, 0)} color="#f0dcb4" flat outline={4} z={0.0005} />
      </X>
      {([[-1.5, -1.5, "#f4f1ea"], [0.5, -2.5, "#f4f1ea"], [1.5, 1.5, "#2a2228"], [-0.5, 2.5, "#2a2228"]] as [number, number, string][]).map(([gx, gy, col], i) => {
        const mx = i === 0 ? move * c * 2 : 0;
        return (
          <X key={i} x={gx * c + mx} y={gy * c * 0.5 + 10} z={0.01 - gy * 0.001}>
            <Part shape={ellipse(c * 0.32, c * 0.12)} color={col} shade={0.2} />
            <Part shape={roundPoly([[-c * 0.22, 0], [c * 0.22, 0], [c * 0.1, c * 0.6], [-c * 0.1, c * 0.6]], 6)} color={col} shade={0.22} z={0.001} />
            <Part shape={circle(c * 0.18)} color={col} shade={0.22} y={c * 0.7} z={0.002} />
          </X>
        );
      })}
    </X>
  );
};

/** Starlink user dish on a short mast, with signal arcs (`signal` 0..1). Origin = ground. */
export const Dish: React.FC<XProps & { signal?: number }> = ({ signal = 0, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <GroundShadow w={160} y={2} z={-0.01} />
      <Line pts={[[0, 0], [0, 130]]} width={12} color="#9aa0aa" />
      <X y={150} rot={0.35}>
        <Part shape={roundRect(220, 150, 14)} color="#f2f3f5" shade={0.22} z={0.001} />
      </X>
      {signal > 0
        ? [0, 1, 2].map((i) => {
            const ph = ((frame * 0.04 + i / 3) % 1) * signal;
            const r = 60 + ph * 220;
            const pts = Array.from({ length: 13 }, (_, j) => {
              const a = 0.9 + (j / 12) * 1.3;
              return [Math.cos(a) * r - 20, 210 + Math.sin(a) * r * 0.9] as [number, number];
            });
            return <Line key={i} pts={pts} smooth width={6} color="#7fd0ff" opacity={1 - ph} z={0.01} />;
          })
        : null}
    </X>
  );
};

/** Ballot box with a paper going in (`drop` 0..1). Origin = bottom. */
export const BallotBox: React.FC<XProps & { drop?: number }> = ({ drop = 0, ...xf }) => (
  <X {...xf}>
    <GroundShadow w={300} y={2} z={-0.01} />
    <Part shape={roundRect(260, 220, 10)} color="#2f4f9a" shade={0.22} y={110} />
    <Part shape={roundRect(140, 14, 6)} color="#1a2238" flat outline={3} y={210} z={0.001} />
    <Part shape={roundRect(110, 40, 8)} color="#f4f1ea" flat outline={3.5} y={110} z={0.001} />
    {drop < 1 ? (
      <X y={330 - drop * 120} z={drop > 0.6 ? -0.001 : 0.002}>
        <Part shape={roundRect(110, 150, 6)} color="#f8f6ee" shade={0.1} />
        <Line pts={[[-30, 0], [-12, -20], [26, 26]]} width={8} color="#c8262f" z={0.001} />
      </X>
    ) : null}
  </X>
);

/** Paper document with text lines. */
export const Doc: React.FC<XProps & { w?: number; lines?: number; color?: string }> = ({ w = 320, lines = 7, color = "#f8f6ee", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, w * 1.3, 8)} color={color} shade={0.1} />
    {Array.from({ length: lines }, (_, i) => (
      <Part key={i} shape={roundRect(w * (i === 0 ? 0.5 : i % 3 === 2 ? 0.6 : 0.78), 12, 6)} color={i === 0 ? "#5a5250" : "#a8a090"} flat outline={0} x={i === 0 ? -w * 0.1 : -w * 0.03} y={w * 0.48 - i * w * 0.14} z={0.001} />
    ))}
  </X>
);

/** Cardboard box (for an office clear-out). Origin = bottom. */
export const Box: React.FC<XProps & { w?: number; h?: number }> = ({ w = 240, h = 170, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 6)} color="#c99a5c" shade={0.22} y={h / 2} />
    <Part shape={roundRect(w * 0.3, 18, 6)} color="#8a6a3a" flat outline={3} y={h * 0.62} z={0.001} />
  </X>
);

/** Brass bell on a stand (market open). `ring` 0..1 swings it. */
export const Bell: React.FC<XProps & { ring?: number }> = ({ ring = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const sw = Math.sin(frame * 0.9) * 0.25 * ring;
  return (
    <X {...xf}>
      <Line pts={[[-140, 0], [-140, 320], [140, 320], [140, 0]]} width={14} color="#6e4a2c" />
      <X y={316} rot={sw} z={0.01}>
        <Part shape={blob([[-90, -170], [90, -170], [80, -120], [50, -30], [0, -10], [-50, -30], [-80, -120]], 8)} color="#d8a832" shade={0.26} />
        <Part shape={circle(16)} color="#8a6a2a" flat outline={3} y={-180} z={0.001} />
      </X>
      {ring > 0 ? <Glow rx={260} y={220} color="#fff2c6" alpha={0.2 * ring} additive z={0.02} /> : null}
    </X>
  );
};

/** Podium / lectern with a round seal. Origin = bottom. */
export const Lectern: React.FC<XProps & { color?: string; seal?: string }> = ({ color = "#6e4a2c", seal = "#2f4f9a", ...xf }) => (
  <X {...xf}>
    <GroundShadow w={300} y={2} z={-0.01} />
    <Part shape={roundPoly([[-110, 0], [110, 0], [130, 300], [-130, 300]], 10)} color={color} shade={0.22} />
    <Part shape={roundRect(300, 40, 8)} color={shadeHex(color, -0.1)} shade={0.2} y={310} z={0.001} />
    <Part shape={circle(56)} color={seal} flat outline={4} y={180} z={0.001} />
    <Part shape={circle(38)} color="#e9ba41" flat outline={3} y={180} z={0.002} />
  </X>
);

/** Hospital bed (side view, head to -x) with rail and pillow. Origin = floor under the middle. */
export const HospitalBed: React.FC<XProps & { w?: number; blanket?: string }> = ({ w = 900, blanket = "#9ec6e2", ...xf }) => (
  <X {...xf}>
    <GroundShadow w={w} y={2} z={-0.05} />
    {[-w / 2 + 60, w / 2 - 60].map((x) => (
      <Line key={x} pts={[[x, 0], [x, 220]]} width={12} color="#9aa0aa" />
    ))}
    <Part shape={roundRect(w, 40, 10)} color="#b9bec6" shade={0.2} y={220} z={0.001} />
    <Part shape={roundRect(w - 40, 60, 20)} color="#f4f6f8" shade={0.15} y={260} z={0.002} />
    <Part shape={roundRect(w * 0.62, 70, 26)} color={blanket} shade={0.2} x={w * 0.17} y={276} z={0.004} />
    <Part shape={roundRect(170, 70, 30)} color="#ffffff" shade={0.15} x={-w / 2 + 120} y={306} z={0.003} />
    <Line pts={[[-w / 2 + 10, 230], [-w / 2 + 10, 420]]} width={12} color="#9aa0aa" z={-0.001} />
  </X>
);

/** IV drip stand. Origin = floor. */
export const IVStand: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Line pts={[[0, 0], [0, 620]]} width={8} color="#9aa0aa" />
    <Line pts={[[-60, 10], [60, 10]]} width={8} color="#9aa0aa" />
    <Line pts={[[-50, 620], [50, 620]]} width={6} color="#9aa0aa" />
    <Part shape={roundRect(70, 110, 20)} color="#dff0f6" shade={0.15} x={30} y={540} z={0.001} />
    <Line pts={[[30, 486], [40, 300], [-120, 200]]} smooth width={3} color="#c8d6dc" z={-0.001} />
  </X>
);

/** Heart monitor with a moving ECG trace (`flat` turns it into a flat line). */
export const HeartMonitor: React.FC<XProps & { flat?: number }> = ({ flat = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const pts: [number, number][] = Array.from({ length: 40 }, (_, i) => {
    const ph = (i + frame * 0.8) % 20;
    const beat = ph > 8 && ph < 12 ? [0, 50, -30, 20][Math.floor(ph - 8)] : 0;
    return [-130 + i * 6.7, beat * (1 - flat)];
  });
  return (
    <X {...xf}>
      <Part shape={roundRect(320, 220, 16)} color="#3a3a42" shade={0.18} />
      <Part shape={roundRect(280, 160, 8)} color="#0e1a14" flat outline={0} y={10} z={0.001} />
      <Line pts={pts} width={4} color="#5af07a" y={10} z={0.002} />
      <Glow rx={160} ry={90} y={10} color="#5af07a" alpha={0.12} additive z={0.003} />
    </X>
  );
};

/** Double bunk bed. Origin = floor centre. */
export const BunkBed: React.FC<XProps & { w?: number; sheets?: string }> = ({ w = 560, sheets = "#c9d6e2", ...xf }) => (
  <X {...xf}>
    {[-w / 2, w / 2].map((x) => (
      <Line key={x} pts={[[x, 0], [x, 560]]} width={14} color="#8a6a4a" />
    ))}
    {[120, 380].map((y) => (
      <React.Fragment key={y}>
        <Part shape={roundRect(w, 30, 6)} color="#8a6a4a" shade={0.2} y={y} z={0.001} />
        <Part shape={roundRect(w - 30, 44, 16)} color={sheets} shade={0.18} y={y + 36} z={0.002} />
        <Part shape={roundRect(110, 40, 16)} color="#ffffff" shade={0.15} x={-w / 2 + 80} y={y + 70} z={0.003} />
      </React.Fragment>
    ))}
  </X>
);

/** Bookshelf full of spines. Origin = floor centre. */
export const Bookshelf: React.FC<XProps & { w?: number; h?: number }> = ({ w = 520, h = 760, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 8)} color="#8a5a32" shade={0.22} y={h / 2} />
    {[0.04, 0.29, 0.54, 0.79].map((k, i) => (
      <React.Fragment key={k}>
        <Part shape={roundRect(w - 40, h * 0.22, 4)} color="#4a3020" flat outline={0} y={h * k + h * 0.12} z={0.001} />
        <BookRow x={-w / 2 + 26} y={h * k + 14} h={h * 0.18} n={Math.floor((w - 60) / 46)} seed={i + 2} gold={i === 1} z={0.002} />
      </React.Fragment>
    ))}
  </X>
);

/** Office chair (side view). Origin = floor. */
export const OfficeChair: React.FC<XProps & { color?: string }> = ({ color = "#2a2a32", ...xf }) => (
  <X {...xf}>
    <Line pts={[[-60, 10], [60, 10]]} width={10} color="#5a5a62" />
    <Line pts={[[0, 10], [0, 120]]} width={12} color="#5a5a62" />
    <Part shape={roundRect(160, 34, 14)} color={color} shade={0.2} y={136} z={0.001} />
    <Part shape={roundRect(40, 200, 16)} color={color} shade={0.2} x={-70} y={240} rot={0.1} z={-0.001} />
  </X>
);

/** Futon / low couch (side). Origin = floor. */
export const Futon: React.FC<XProps & { w?: number; color?: string }> = ({ w = 560, color = "#5a6a8a", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, 40, 8)} color="#8a6a4a" shade={0.2} y={50} />
    <Part shape={roundRect(w - 20, 70, 26)} color={color} shade={0.2} y={100} z={0.001} />
    <Part shape={roundRect(w - 20, 140, 30)} color={shadeHex(color, 0.08)} shade={0.2} y={190} z={-0.001} />
  </X>
);

/** Cylindrical battery cell (18650-style), standing. Origin = bottom. */
export const BatteryCell: React.FC<XProps & { color?: string; charge?: number }> = ({ color = "#3a8a5a", charge = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(70, 200, 14)} color={color} shade={0.24} y={100} />
    <Part shape={roundRect(70, 30, 10)} color="#c9ced6" shade={0.2} y={190} z={0.001} />
    <Part shape={roundRect(24, 14, 4)} color="#b9bec6" flat outline={3} y={210} z={0.002} />
    {charge > 0 ? <Glow rx={70} ry={130} y={100} color="#7af0a0" alpha={0.3 * charge} additive z={0.003} /> : null}
  </X>
);

/** Grid of battery cells seen from above. */
export const BatteryGrid: React.FC<XProps & { cols?: number; rows?: number; k?: number; r?: number }> = ({ cols = 14, rows = 8, k = 1, r = 22, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(cols * r * 2.2 + 40, rows * r * 2.2 + 40, 16)} color="#3a3a42" shade={0.15} />
    {Array.from({ length: cols * rows }, (_, i) => {
      if (i / (cols * rows) > k) return null;
      const c = i % cols;
      const rr = Math.floor(i / cols);
      return (
        <X key={i} x={(c - (cols - 1) / 2) * r * 2.2} y={(rr - (rows - 1) / 2) * r * 2.2} z={0.001}>
          <Part shape={circle(r)} color="#3a8a5a" flat outline={3} />
          <Part shape={circle(r * 0.45)} color="#c9ced6" flat outline={0} z={0.001} />
        </X>
      );
    })}
  </X>
);

/** Glass dome greenhouse with plants (on Mars). Origin = ground centre. */
export const Greenhouse: React.FC<XProps & { r?: number; grow?: number }> = ({ r = 260, grow = 1, ...xf }) => (
  <X {...xf}>
    <GroundShadow w={r * 2.2} y={2} z={-0.01} />
    {[-0.6, -0.2, 0.2, 0.6].map((k, i) => (
      <X key={i} x={k * r} y={0} s={Math.max(0.01, grow)} z={0.001}>
        <Line pts={[[0, 0], [0, 80]]} width={6} color="#3f7a3a" />
        <Part shape={ellipse(36, 22)} color="#4fa04a" shade={0.2} x={-20} y={60} rot={0.4} />
        <Part shape={ellipse(36, 22)} color="#4fa04a" shade={0.2} x={20} y={80} rot={-0.4} />
      </X>
    ))}
    <Part shape={roundRect(r * 2, 30, 6)} color="#9aa0aa" shade={0.2} y={10} z={0.002} />
    <Part
      shape={poly(Array.from({ length: 25 }, (_, i) => [Math.cos((i / 24) * Math.PI) * r, 20 + Math.sin((i / 24) * Math.PI) * r * 0.9] as [number, number]))}
      color="#bfe6ff"
      flat
      outline={6}
      opacity={0.35}
      z={0.003}
    />
    {[-0.5, 0, 0.5].map((k) => (
      <Line key={k} pts={[[k * r, 20], [k * r * 0.8, 20 + r * 0.9 * Math.cos(k * 1.2)]]} width={3} color="#e8f4ff" z={0.004} />
    ))}
  </X>
);

/** Christmas tree with baubles and a star. Origin = floor. */
export const XmasTree: React.FC<XProps & { lights?: number }> = ({ lights = 1, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={roundRect(50, 60, 6)} color="#6e4a2c" shade={0.2} y={30} />
      {[0, 1, 2].map((i) => (
        <Part key={i} shape={roundPoly([[-180 + i * 40, 60 + i * 120], [180 - i * 40, 60 + i * 120], [0, 260 + i * 130]], 14)} color="#2f7a3a" shade={0.22} z={0.001 + i * 0.001} />
      ))}
      {([[-90, 120, "#c8262f"], [80, 150, "#e9ba41"], [-40, 230, "#3a7ac9"], [50, 280, "#c8262f"], [-20, 360, "#e9ba41"]] as [number, number, string][]).map(([x, y, c], i) => (
        <Part key={`b${i}`} shape={circle(16)} color={c} shade={0.2} outline={3} x={x} y={y} z={0.01} opacity={0.6 + 0.4 * (Math.sin(frame * 0.2 + i) > 0 ? lights : 0.4)} />
      ))}
      <Part
        shape={poly(Array.from({ length: 10 }, (_, i) => {
          const a = Math.PI / 2 + (i * Math.PI) / 5;
          const r = i % 2 ? 16 : 36;
          return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
        }))}
        color="#f2cc5a"
        flat
        outline={4}
        y={470}
        z={0.02}
      />
      <Glow rx={80} y={470} color="#fff2c6" alpha={0.5 * lights} additive z={0.021} />
    </X>
  );
};

/** Mosquito (side view). */
export const Mosquito: React.FC<XProps & { flap?: number }> = ({ flap = 0, ...xf }) => (
  <X {...xf}>
    {[0, 1].map((i) => (
      <Part key={i} shape={ellipse(40, 14)} color="#dfe8f0" flat outline={3} opacity={0.75} x={-10 + i * 6} y={30} rot={0.6 + flap * (i ? 1 : -1) * 0.4} z={-0.001} />
    ))}
    <Part shape={ellipse(48, 12)} color="#5a4a42" shade={0.2} x={-30} rot={-0.15} />
    <Part shape={circle(16)} color="#4a3a32" shade={0.2} x={24} y={6} z={0.001} />
    <Line pts={[[36, 4], [90, -14]]} width={3} color="#3a2a22" z={0.002} />
    {[-20, -6, 8].map((x) => (
      <Line key={x} pts={[[x, -6], [x - 16, -40], [x - 30, -60]]} width={2.5} color="#3a2a22" z={0.001} />
    ))}
  </X>
);

/** Shiba dog face badge (the DOGE team mascot). */
export const DogeBadge: React.FC<XProps & { r?: number }> = ({ r = 160, ...xf }) => (
  <X {...xf}>
    <Part shape={circle(r)} color="#f2cc5a" shade={0.18} outline={7} />
    <X s={r / 160} z={0.001}>
      {[-1, 1].map((sd) => (
        <Part key={sd} shape={poly([[sd * 40, 60], [sd * 100, 130], [sd * 104, 40]])} color="#d8923a" shade={0.2} />
      ))}
      <Part shape={blob([[-100, 30], [-90, 90], [-40, 110], [40, 110], [90, 90], [100, 30], [70, -60], [0, -80], [-70, -60]], 8)} color="#d8923a" shade={0.2} z={0.001} />
      <Part shape={blob([[-60, -20], [-50, -70], [0, -84], [50, -70], [60, -20], [0, 0]], 8)} color="#f6efe2" flat outline={3.5} z={0.002} />
      <Part shape={ellipse(16, 12)} color={INKC} flat outline={0} y={-30} z={0.003} />
      {[-1, 1].map((sd) => (
        <Part key={`e${sd}`} shape={ellipse(9, 11)} color={INKC} flat outline={0} x={sd * 38} y={28} z={0.003} />
      ))}
    </X>
  </X>
);

/** Small acacia (savanna) tree with a flat crown. Origin = ground. */
export const Acacia: React.FC<XProps & { h?: number; seed?: number }> = ({ h = 420, seed = 2, ...xf }) => (
  <X {...xf}>
    <Line pts={[[0, 0], [-10, h * 0.5], [-40, h * 0.8]]} smooth width={22} color="#6e4a2c" />
    <Line pts={[[-8, h * 0.45], [40, h * 0.78]]} width={14} color="#6e4a2c" />
    <Part shape={blob([[-200, h * 0.8], [-150, h * 0.96], [-40, h], [80, h * 0.98], [170, h * 0.9], [190, h * 0.8], [0, h * 0.74]], 8 + (seed % 3))} color="#6f9a3a" shade={0.24} z={0.001} />
  </X>
);

/** Jacaranda tree (purple blossom, Pretoria). Origin = ground. */
export const Jacaranda: React.FC<XProps & { h?: number; seed?: number }> = ({ h = 620, seed = 3, ...xf }) => {
  const r = rng(seed);
  const blobs = Array.from({ length: 9 }, (_, i) => [(i / 8 - 0.5) * h * 0.85 + (r() - 0.5) * 40, h * (0.66 + r() * 0.24) - Math.abs(i / 8 - 0.5) * h * 0.18, h * (0.2 + r() * 0.08)] as [number, number, number]);
  return (
    <X {...xf}>
      <Line pts={[[0, 0], [10, h * 0.4], [-20, h * 0.7]]} smooth width={30} color="#6e4a2c" />
      <Line pts={[[6, h * 0.4], [h * 0.2, h * 0.66]]} width={18} color="#6e4a2c" />
      {blobs.map(([x, y, rr], i) => (
        <Part key={i} shape={circle(rr)} color={i % 2 ? "#9a7ad8" : "#8a6ac8"} shade={0.22} x={x} y={y} z={0.001 + i * 0.0001} />
      ))}
    </X>
  );
};
