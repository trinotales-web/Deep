import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { INK } from "../style";
import { noise1, rng } from "../random";
import { Exhaust } from "./space";
import { Puffs } from "./whales";

// Moon missions kit: ISRO's Vikram lander, Russia's Luna-25, Intuitive
// Machines' Nova-C (Odysseus / Athena), NASA's GRAIL twins, Chandrayaan-1,
// the LCROSS Centaur stage, the Apollo lunar module, China's Chang'e lander
// with its ascender, the Yutu rover and the hopping probe, Orion, SLS, PSLV;
// national flags, a Moon base, and props for the fuel / helium-3 story.
// Landers: origin = ground under the centre (footpads on y=0), y up.

const GOLD = "#e2b13c";
const GOLD_D = "#b98a2a";
const SILVER = "#d9dce2";
const WHITE = "#eef0f3";
const NAVY = "#24365f";
const DARK = "#3a3a44";
const ri = (v: number) => Math.round(v);

/** Outlined strut from (x1,y1) to (x2,y2). */
const Strut: React.FC<{ a: [number, number]; b: [number, number]; w?: number; color?: string; z?: number }> = ({ a, b, w = 14, color = "#c9ccd3", z = 0 }) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return <Part shape={roundRect(ri(len + w), w, w / 2)} color={color} flat outline={4} x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2} rot={Math.atan2(b[1] - a[1], b[0] - a[0])} z={z} />;
};

/** Solar panel with a cell grid. Origin = centre. */
export const SolarPanel: React.FC<XProps & { w?: number; h?: number; cols?: number; rows?: number; color?: string }> = ({ w = 160, h = 220, cols = 3, rows = 4, color = NAVY, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 6)} color={color} flat outline={5} />
    {Array.from({ length: cols - 1 }, (_, i) => (
      <Line key={`c${i}`} pts={[[-w / 2 + ((i + 1) * w) / cols, -h / 2 + 6], [-w / 2 + ((i + 1) * w) / cols, h / 2 - 6]]} width={3} color="#5a7ab8" z={0.001} />
    ))}
    {Array.from({ length: rows - 1 }, (_, i) => (
      <Line key={`r${i}`} pts={[[-w / 2 + 6, -h / 2 + ((i + 1) * h) / rows], [w / 2 - 6, -h / 2 + ((i + 1) * h) / rows]]} width={3} color="#5a7ab8" z={0.001} />
    ))}
    <Part shape={roundRect(w * 0.3, h * 0.08, 3)} color="#9ab8ff" flat outline={0} opacity={0.5} x={-w * 0.2} y={h * 0.32} rot={0.1} z={0.002} />
  </X>
);

/** Crinkled gold foil lines over a w×h area. */
const Foil: React.FC<{ w: number; h: number; seed?: number; color?: string; n?: number }> = ({ w, h, seed = 1, color = GOLD_D, n = 9 }) => {
  const r = rng(seed);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = (r() - 0.5) * w * 0.85;
        const y = (r() - 0.5) * h * 0.8;
        const l = 14 + r() * 26;
        return <Line key={i} pts={[[ri(x - l / 2), ri(y)], [ri(x), ri(y + 6)], [ri(x + l / 2), ri(y - 2)]]} width={3} color={color} z={0.001} />;
      })}
    </>
  );
};

/** Landing dust: grey puffs spreading out along the ground, k 0..1. */
export const LandingDust: React.FC<XProps & { k: number; spread?: number; seed?: number; color?: string }> = ({ k, spread = 520, seed = 3, color = "#bdb8b0", ...xf }) => {
  if (k <= 0.01) return null;
  const r = rng(seed);
  const puffs: [number, number, number][] = Array.from({ length: 16 }, (_, i) => {
    const sd = i % 2 ? 1 : -1;
    const d = (60 + r() * spread) * Math.min(1, k * 1.2);
    return [ri(sd * d), ri(10 + r() * 40 * k), ri((22 + r() * 36) * (0.4 + 0.6 * Math.min(1, k)))];
  });
  const fade = k < 0.7 ? 1 : Math.max(0, 1 - (k - 0.7) / 0.3);
  return <Puffs puffs={puffs} color={color} opacity={fade} {...xf} />;
};

/** Small flag decal (no pole). Origin = centre. */
export const FlagDecal: React.FC<XProps & { kind: FlagKind; w?: number }> = ({ kind, w = 60, ...xf }) => (
  <X {...xf}>
    <FlagCloth kind={kind} w={w} />
  </X>
);

export type FlagKind = "india" | "china" | "russia" | "usa";

const starPts = (r: number, rot = 0): [number, number][] =>
  Array.from({ length: 10 }, (_, i) => {
    const a = rot + Math.PI / 2 + (i * Math.PI) / 5;
    const d = i % 2 ? r * 0.42 : r;
    return [Math.round(Math.cos(a) * d * 10) / 10, Math.round(Math.sin(a) * d * 10) / 10];
  });

/** Flag cloth w×(0.62w), origin = centre. */
const FlagCloth: React.FC<{ kind: FlagKind; w: number }> = ({ kind, w }) => {
  const h = Math.round(w * 0.62);
  const band = (y: number, hh: number, c: string, i: number) => <Part key={i} shape={roundRect(w - 2, hh, 0)} color={c} flat outline={0} y={y} z={0.001} />;
  return (
    <>
      <Part shape={roundRect(w, h, 4)} color={kind === "china" ? "#de2910" : "#ffffff"} flat outline={Math.max(3, w * 0.03)} />
      {kind === "india" ? (
        <>
          {band(h / 3, h / 3 - 2, "#ff9933", 0)}
          {band(-h / 3, h / 3 - 2, "#138808", 1)}
          <Line pts={Array.from({ length: 25 }, (_, i) => [Math.cos((i / 24) * Math.PI * 2) * h * 0.13, Math.sin((i / 24) * Math.PI * 2) * h * 0.13] as [number, number])} width={Math.max(2, w * 0.018)} color="#1a2a8a" z={0.002} />
          <Part shape={circle(h * 0.03)} color="#1a2a8a" flat outline={0} z={0.002} />
        </>
      ) : null}
      {kind === "russia" ? (
        <>
          {band(0, h / 3, "#0039a6", 0)}
          {band(-h / 3, h / 3 - 2, "#d52b1e", 1)}
        </>
      ) : null}
      {kind === "china" ? (
        <>
          <Part shape={poly(starPts(h * 0.17))} color="#ffde00" flat outline={0} x={-w * 0.33} y={h * 0.25} z={0.002} />
          {[
            [-0.17, 0.4],
            [-0.1, 0.3],
            [-0.1, 0.17],
            [-0.17, 0.07],
          ].map(([x, y], i) => (
            <Part key={i} shape={poly(starPts(h * 0.06, i * 0.4))} color="#ffde00" flat outline={0} x={x * w} y={y * h} z={0.002} />
          ))}
        </>
      ) : null}
      {kind === "usa" ? (
        <>
          {[0, 2, 4, 6, 8, 10, 12].map((i) => band(h / 2 - (i + 0.5) * (h / 13), h / 13, "#c8262f", i))}
          <Part shape={roundRect(w * 0.42, h * 0.54, 0)} color="#2f4f9a" flat outline={0} x={-w * 0.29} y={h * 0.23} z={0.002} />
          {Array.from({ length: 12 }, (_, i) => (
            <Part key={`s${i}`} shape={circle(w * 0.012)} color="#ffffff" flat outline={0} x={-w * 0.46 + (i % 4) * w * 0.06 + 6} y={h * 0.4 - Math.floor(i / 4) * h * 0.14} z={0.003} />
          ))}
        </>
      ) : null}
    </>
  );
};

/** National flag on a pole (origin = pole base), waving. */
export const NationFlag: React.FC<XProps & { kind: FlagKind; w?: number; pole?: number; wave?: number }> = ({ kind, w = 200, pole = 420, wave = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const h = Math.round(w * 0.62);
  return (
    <X {...xf}>
      {pole > 0 ? (
        <>
          <Part shape={roundRect(12, pole, 6)} color="#c9ccd3" flat outline={4} y={pole / 2} />
          <Part shape={circle(12)} color="#e2b13c" flat outline={4} y={pole + 8} z={0.001} />
        </>
      ) : null}
      <X x={w / 2 + 6} y={pole - h / 2 - 6} rot={Math.sin(frame * 0.12) * 0.035 * wave} sy={1 + Math.sin(frame * 0.18) * 0.03 * wave} z={0.002}>
        <FlagCloth kind={kind} w={w} />
      </X>
    </X>
  );
};

// ───────────────────────── landers ─────────────────────────

const VG = { lit: "#f6c232", sh: "#d39421", hi: "#ffe27a", top: "#ffd650", leg: "#eaaa2a", legSh: "#c98a1e", pad: "#2a2830", panel: "#2c2834", panelL: "#4c4658" };
const lerp2 = (a: [number, number], b: [number, number], k: number): [number, number] => [ri(a[0] + (b[0] - a[0]) * k), ri(a[1] + (b[1] - a[1]) * k)];

/** One landing leg: two struts to a knee, a diagonal brace from the body top, a shock-absorber tube and a black footpad. */
const VLeg: React.FC<{ a1: [number, number]; a2: [number, number]; top: [number, number]; knee: [number, number]; foot: [number, number]; s?: number; z?: number; far?: boolean; color?: [string, string] }> = ({ a1, a2, top, knee, foot, s = 1, z = 0, far = false, color }) => {
  const c = color ? color[far ? 1 : 0] : far ? VG.legSh : VG.leg;
  return (
    <X z={z}>
      <Strut a={top} b={knee} w={ri(9 * s)} color={c} />
      <Strut a={a1} b={knee} w={ri(12 * s)} color={c} z={0.001} />
      <Strut a={a2} b={knee} w={ri(10 * s)} color={c} z={0.0015} />
      <Strut a={knee} b={[foot[0], foot[1] + 18 * s]} w={ri(18 * s)} color={color ? color[1] : far ? "#b07a1c" : "#d99a22"} z={0.002} />
      <Part shape={circle(ri(10 * s))} color={VG.sh} flat outline={3} x={knee[0]} y={knee[1]} z={0.003} />
      <X x={foot[0]} y={foot[1]} s={s} z={0.004}>
        <Part shape={roundRect(70, 22, 8)} color={VG.pad} flat outline={4} y={10} />
        <Part shape={ellipse(35, 8)} color="#4a4654" flat outline={3} y={21} z={0.001} />
      </X>
    </X>
  );
};

/**
 * ISRO's Vikram lander (Chandrayaan-3) in a 3/4 view: gold-foil box with a
 * bright centre panel and a window, the black solar-panel side with gold
 * radiator tabs, top deck with the dish antenna, a fuel-tank dome and the
 * truss mast, striped engine drum with the central nozzle, four strutted
 * legs with black footpads. Origin = ground under the centre, y up.
 */
export const Vikram: React.FC<XProps & { thrust?: number; dust?: number; seed?: number; flag?: boolean }> = ({ thrust = 0, dust = 0, seed = 1, flag = true, ...xf }) => {
  const F: [number, number][] = [[-24, 140], [176, 140], [162, 334], [-14, 334]];
  const S: [number, number][] = [[-24, 140], [-14, 334], [-188, 312], [-204, 156]];
  const R: [number, number][] = [[176, 140], [204, 152], [190, 324], [162, 334]];
  const T: [number, number][] = [[-188, 312], [-14, 334], [162, 334], [190, 324], [124, 354], [-146, 342]];
  const dome: [number, number][] = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI * (i / 12);
    return [ri(-30 + Math.cos(a) * 54), ri(338 + Math.sin(a) * 40)] as [number, number];
  });
  return (
    <X {...xf}>
      {/* far legs */}
      <VLeg a1={[-196, 170]} a2={[-120, 150]} top={[-186, 296]} knee={[-190, 96]} foot={[-176, 52]} s={0.8} far z={-0.03} />
      <VLeg a1={[200, 166]} a2={[150, 148]} top={[192, 300]} knee={[206, 96]} foot={[200, 50]} s={0.8} far z={-0.03} />
      <Exhaust x={0} y={52} len={320 * thrust} w={74} k={thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.6} seed={seed} rot={0} z={-0.035} />
      {/* engine drum + nozzle */}
      <X z={-0.01}>
        <Part shape={roundRect(236, 50, 12)} color="#eceef2" flat outline={5} x={-6} y={118} />
        {[104, 130].map((y) => (
          <Part key={y} shape={roundRect(234, 10, 3)} color={VG.pad} flat outline={0} x={-6} y={y} z={0.001} />
        ))}
        <Part shape={poly([[-22, 96], [22, 96], [32, 50], [-32, 50]])} color="#d8dbe2" flat outline={5} z={0.002} />
        <Part shape={ellipse(32, 7)} color="#9a9ea8" flat outline={4} y={50} z={0.003} />
        {[-92, 80].map((x) => (
          <Part key={x} shape={poly([[x - 9, 96], [x + 9, 96], [x + 12, 76], [x - 12, 76]])} color="#3a3842" flat outline={3} z={0.002} />
        ))}
      </X>
      {/* body */}
      <Part shape={poly(S)} color={VG.panel} flat outline={6} />
      {Array.from({ length: 7 }, (_, i) => {
        const k = (i + 1) / 8;
        return <Line key={`pl${i}`} pts={[lerp2(S[0], S[1], k), lerp2(S[3], S[2], k)]} width={3} color={VG.panelL} z={0.001} />;
      })}
      <Line pts={[lerp2(S[0], S[3], 0.5), lerp2(S[1], S[2], 0.5)]} width={3} color={VG.panelL} z={0.001} />
      {[0.2, 0.42, 0.64].map((u, i) => {
        const p = lerp2(lerp2(S[0], S[3], u + 0.08), lerp2(S[1], S[2], u + 0.08), 0.22);
        return <Part key={`tab${i}`} shape={roundRect(22, 34, 3)} color={VG.lit} flat outline={3} x={p[0]} y={p[1]} rot={0.06} z={0.002} />;
      })}
      <Part shape={poly(F)} color={VG.lit} flat outline={6} z={0.003} />
      <Part shape={poly([[52, 140], [112, 140], [110, 334], [54, 334]])} color={VG.hi} flat outline={4} z={0.004} />
      {[20, 145].map((x) => (
        <Line key={`sm${x}`} pts={[[x, 144], [x - (x > 100 ? 12 : 4), 330]]} width={3} color={VG.sh} z={0.004} />
      ))}
      <Part shape={roundRect(38, 38, 4)} color={VG.sh} flat outline={4} x={82} y={248} z={0.005} />
      <Part shape={roundRect(20, 20, 3)} color="#fff0b0" flat outline={0} x={82} y={248} z={0.006} />
      <Part shape={poly([[-14, 330], [26, 334], [176, 196], [176, 158]])} color="#ffffff" flat outline={0} opacity={0.22} z={0.0055} />
      {[-2, 32, 126, 150].map((x) => (
        <Part key={`n${x}`} shape={roundRect(14, 12, 2)} color={VG.sh} flat outline={3} x={x} y={330} z={0.006} />
      ))}
      {flag ? <FlagDecal kind="india" w={42} x={14} y={292} z={0.006} /> : null}
      <Part shape={poly(R)} color={VG.sh} flat outline={5} z={0.002} />
      {[300, 266].map((y) => (
        <X key={`cam${y}`} x={204} y={y} z={0.003}>
          <Part shape={roundRect(30, 18, 4)} color={VG.pad} flat outline={3} />
          <Part shape={circle(7)} color={VG.lit} flat outline={2} x={14} z={0.001} />
        </X>
      ))}
      {/* top deck + instruments */}
      <Part shape={poly(T)} color={VG.top} flat outline={5} z={0.003} />
      <Part shape={poly(dome)} color={VG.hi} shade={0.3} z={0.004} />
      <X x={-110} y={376} rot={-0.5} z={0.0045}>
        <Line pts={[[0, -30], [0, 0]]} width={6} color={VG.sh} z={-0.001} />
        <Part shape={ellipse(60, 38)} color="#eab238" flat outline={5} />
        <Part shape={ellipse(46, 28)} color="#c88e22" flat outline={0} z={0.001} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <Line key={i} pts={[[0, 0], [ri(Math.cos(a) * 44), ri(Math.sin(a) * 27)]]} width={2} color="#9a6a18" z={0.002} />;
        })}
        <Part shape={circle(7)} color={VG.hi} flat outline={2} z={0.003} />
      </X>
      <X x={66} z={0.005}>
        <Line pts={[[-46, 340], [-16, 446]]} width={6} color={VG.leg} />
        <Line pts={[[46, 340], [16, 446]]} width={6} color={VG.leg} />
        <Line pts={[[-36, 380], [36, 380]]} width={5} color={VG.leg} />
        <Line pts={[[-28, 412], [28, 412]]} width={5} color={VG.leg} />
        <Part shape={roundRect(72, 10, 4)} color={VG.leg} flat outline={3} y={448} z={0.001} />
        {[-28, -10, 10, 28].map((x) => (
          <Part key={x} shape={roundRect(7, 24, 3)} color={VG.leg} flat outline={2} x={x} y={462} z={0.001} />
        ))}
      </X>
      <Part shape={ellipse(22, 8)} color="#eef0f3" flat outline={4} x={160} y={352} z={0.005} />
      {/* near legs */}
      <VLeg a1={[-150, 152]} a2={[-24, 140]} top={[-186, 300]} knee={[-212, 74]} foot={[-240, 0]} z={0.01} />
      <VLeg a1={[176, 146]} a2={[64, 140]} top={[194, 304]} knee={[222, 74]} foot={[238, 0]} z={0.01} />
      <LandingDust k={dust} y={0} z={0.02} seed={seed + 4} />
    </X>
  );
};

/** Russia's Luna-25: flat base, two big round tanks, gold body, dark panels on top. */
export const Luna25: React.FC<XProps & { thrust?: number; seed?: number }> = ({ thrust = 0, seed = 2, ...xf }) => (
  <X {...xf}>
    <VLeg a1={[-150, 150]} a2={[-90, 140]} top={[-150, 230]} knee={[-170, 86]} foot={[-156, 46]} s={0.8} far color={["#c9ccd3", "#9a9ea8"]} z={-0.03} />
    <VLeg a1={[150, 150]} a2={[90, 140]} top={[150, 230]} knee={[176, 86]} foot={[164, 46]} s={0.8} far color={["#c9ccd3", "#9a9ea8"]} z={-0.03} />
    <Exhaust x={0} y={110} len={280 * thrust} w={64} k={thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.6} seed={seed} z={-0.03} />
    <Part shape={poly([[-34, 134], [34, 134], [46, 104], [-46, 104]])} color="#2a2a30" flat outline={4} z={-0.004} />
    <Part shape={roundRect(370, 40, 12)} color="#cfd3da" shade={0.3} y={152} />
    {[-1, 1].map((sd) => (
      <Part key={`t${sd}`} shape={circle(68)} color="#eceef2" shade={0.35} x={sd * 108} y={232} z={0.002} />
    ))}
    <Part shape={roundRect(120, 160, 10)} color={GOLD} shade={0.3} y={250} z={0.001}>
      <Foil w={110} h={150} seed={seed + 3} n={5} />
      <FlagDecal kind="russia" w={56} y={20} z={0.003} />
      <Part shape={poly([[-58, 60], [-20, 78], [60, -20], [60, -56]])} color="#ffffff" flat outline={0} opacity={0.2} z={0.004} />
    </Part>
    <Part shape={roundRect(290, 30, 8)} color="#b9bcc4" flat outline={5} y={336} z={0.004} />
    {[-1, 1].map((sd) => (
      <SolarPanel key={`p${sd}`} w={110} h={64} cols={3} rows={2} x={sd * 88} y={378} rot={sd * -0.12} z={0.005} />
    ))}
    <Line pts={[[0, 350], [0, 430]]} width={7} color="#9a9ea8" z={0.004} />
    <Part shape={circle(12)} color={WHITE} flat outline={4} y={434} z={0.005} />
    <VLeg a1={[-170, 150]} a2={[-60, 140]} top={[-150, 240]} knee={[-212, 70]} foot={[-238, 0]} color={["#c9ccd3", "#9a9ea8"]} z={0.01} />
    <VLeg a1={[170, 150]} a2={[60, 140]} top={[150, 240]} knee={[212, 70]} foot={[238, 0]} color={["#c9ccd3", "#9a9ea8"]} z={0.01} />
  </X>
);

/** Intuitive Machines' Nova-C (Odysseus / Athena): tall hexagonal lander on six legs, blue methalox flame. */
export const NovaC: React.FC<XProps & { thrust?: number; seed?: number; variant?: "odysseus" | "athena" }> = ({ thrust = 0, seed = 3, variant = "odysseus", ...xf }) => {
  const accent = variant === "athena" ? "#e07a2a" : "#2f6fd0";
  return (
    <X {...xf}>
      <VLeg a1={[-60, 140]} a2={[-30, 132]} top={[-100, 250]} knee={[-100, 80]} foot={[-92, 44]} s={0.7} far color={["#c9ccd3", "#9a9ea8"]} z={-0.03} />
      <VLeg a1={[60, 140]} a2={[30, 132]} top={[100, 250]} knee={[100, 80]} foot={[92, 44]} s={0.7} far color={["#c9ccd3", "#9a9ea8"]} z={-0.03} />
      <Exhaust x={0} y={92} len={340 * thrust} w={56} k={thrust > 0.02 ? 1 : 0} color="#7fb0ff" glow={0.5} seed={seed} z={-0.03} />
      <Part shape={poly([[-30, 120], [30, 120], [40, 92], [-40, 92]])} color="#2a2a30" flat outline={4} z={-0.004} />
      <Part shape={roundRect(230, 30, 8)} color={GOLD} flat outline={5} y={128} z={0.001} />
      {[-1, 1].map((sd) => (
        <Part key={`sf${sd}`} shape={roundRect(58, 360, 6)} color="#b9bcc4" flat outline={5} x={sd * 84} y={318} z={0.002}>
          <SolarPanel w={42} h={150} cols={1} rows={4} y={40} z={0.001} />
        </Part>
      ))}
      <Part shape={roundRect(112, 360, 6)} color="#e6e8ec" shade={0.25} y={318} z={0.003}>
        <SolarPanel w={88} h={160} cols={2} rows={4} y={50} z={0.001} />
        <Part shape={roundRect(112, 18, 0)} color={accent} flat outline={0} y={-70} z={0.001} />
      </Part>
      <Part shape={roundRect(232, 34, 8)} color={GOLD} flat outline={5} y={506} z={0.004} />
      <Line pts={[[50, 520], [50, 570]]} width={7} color="#9a9ea8" z={0.004} />
      <Part shape={ellipse(30, 11)} color={WHITE} flat outline={4} x={50} y={574} z={0.005} />
      <Part shape={roundRect(44, 30, 6)} color="#b9bcc4" flat outline={4} x={-50} y={538} z={0.005} />
      <VLeg a1={[-100, 146]} a2={[-40, 136]} top={[-120, 270]} knee={[-152, 64]} foot={[-178, 0]} s={0.85} color={["#c9ccd3", "#9a9ea8"]} z={0.01} />
      <VLeg a1={[100, 146]} a2={[40, 136]} top={[120, 270]} knee={[152, 64]} foot={[178, 0]} s={0.85} color={["#c9ccd3", "#9a9ea8"]} z={0.01} />
    </X>
  );
};

/** NASA's GRAIL probe (Ebb / Flow): small gold box with two solar wings. Origin = centre. */
export const GrailProbe: React.FC<XProps & { glint?: number }> = ({ glint = 0, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((sd) => (
      <React.Fragment key={sd}>
        <Line pts={[[sd * 55, 0], [sd * 75, 0]]} width={10} color="#8a8e98" z={-0.002} />
        <SolarPanel w={140} h={78} cols={3} rows={2} x={sd * 142} z={-0.001} />
      </React.Fragment>
    ))}
    <Part shape={roundRect(118, 100, 12)} color={GOLD} shade={0.3}>
      <Foil w={100} h={80} n={4} />
    </Part>
    <Line pts={[[0, 50], [0, 86]]} width={6} color="#9a9ea8" z={-0.001} />
    <Part shape={circle(11)} color={WHITE} flat outline={4} y={90} z={0.001} />
    {glint > 0 ? <Glow rx={120} color="#ffffff" alpha={0.5 * glint} additive z={0.01} /> : null}
  </X>
);

/** Chandrayaan-1 orbiter in a 3/4 view: gold-foil cube with seams and a sheen, bright solar wing on a boom, gold dish antenna, instruments underneath (`beam` scans down). */
export const Chandrayaan1: React.FC<XProps & { beam?: number; beamColor?: string; flag?: boolean }> = ({ beam = 0, beamColor = "#7fd0ff", flag = true, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      {beam > 0 ? (
        <>
          <Part shape={poly([[-34, -150], [34, -150], [260, -760], [-260, -760]])} color={beamColor} flat outline={0} opacity={0.22 * beam} z={-0.01} />
          <Line pts={[[-240 + ((frame * 8) % 480), -740], [-30 + ((frame * 8) % 480) * 0.125, -160]]} width={6} color={beamColor} opacity={0.7 * beam} z={-0.009} />
        </>
      ) : null}
      {/* solar wing */}
      <Strut a={[118, 10]} b={[186, 10]} w={12} color="#b9bcc4" z={-0.003} />
      <Part shape={roundRect(186, 316, 8)} color="#c9ccd3" flat outline={5} x={272} y={10} z={-0.002} />
      <SolarPanel w={168} h={298} cols={3} rows={6} color="#2a5ec8" x={272} y={10} z={-0.001} />
      {/* dish */}
      <Strut a={[-104, 60]} b={[-168, 92]} w={10} color="#b9bcc4" z={-0.003} />
      <X x={-196} y={104} rot={-0.6} z={-0.002}>
        <Part shape={ellipse(76, 30)} color="#f2f2f4" flat outline={5} />
        <Part shape={ellipse(60, 22)} color="#d6d8de" flat outline={0} z={0.001} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <Line key={i} pts={[[0, 0], [ri(Math.cos(a) * 58), ri(Math.sin(a) * 21)]]} width={2} color="#9a9ea8" z={0.002} />;
        })}
        <Part shape={circle(8)} color={GOLD} flat outline={2} z={0.003} />
      </X>
      {/* cube */}
      <Part shape={poly([[80, -110], [124, -86], [124, 128], [80, 110]])} color="#c98e22" flat outline={5} />
      <Part shape={poly([[-110, 110], [80, 110], [124, 128], [-66, 128]])} color="#ffd650" flat outline={5} z={0.001} />
      <Part shape={roundRect(190, 220, 6)} color="#f6c232" flat outline={6} x={-15} z={0.002} />
      {[-60, 30].map((x) => (
        <Line key={x} pts={[[x, -106], [x, 106]]} width={3} color="#c98e22" z={0.003} />
      ))}
      <Line pts={[[-106, -10], [76, -10]]} width={3} color="#c98e22" z={0.003} />
      <Foil w={180} h={200} n={8} seed={5} color="#c98e22" />
      <Part shape={poly([[-106, 60], [-60, 106], [76, -40], [76, -96]])} color="#ffffff" flat outline={0} opacity={0.2} z={0.0035} />
      <Part shape={roundRect(192, 22, 6)} color={SILVER} flat outline={4} x={-15} y={84} z={0.004} />
      {flag ? <FlagDecal kind="india" w={56} x={-60} y={-52} z={0.005} /> : null}
      {/* top + bottom instruments */}
      <Part shape={roundRect(40, 26, 5)} color="#2a2830" flat outline={4} x={-40} y={140} z={0.001} />
      <Part shape={circle(10)} color="#5a8ad2" flat outline={3} x={-40} y={142} z={0.002} />
      <Part shape={roundRect(90, 46, 8)} color="#b9bcc4" flat outline={5} x={-15} y={-132} z={0.001} />
      <Part shape={roundRect(50, 30, 6)} color="#7a7e88" flat outline={4} x={55} y={-124} z={0.001} />
      <Part shape={roundRect(30, 22, 4)} color="#2a2830" flat outline={3} x={-60} y={-124} z={0.0015} />
    </X>
  );
};

/** LCROSS: the spent Centaur upper stage (silver tube, engine bell) with the gold shepherding spacecraft on top; `sep` px apart. Origin = stage centre, nose up. */
export const CentaurStage: React.FC<XProps & { shepherd?: boolean; sep?: number }> = ({ shepherd = true, sep = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={poly([[-46, -300], [46, -300], [70, -390], [-70, -390]])} color="#5a5a64" flat outline={5} z={-0.001} />
    <Part shape={roundRect(160, 600, 40)} color={SILVER} shade={0.32}>
      {[-180, -60, 60, 180].map((y) => (
        <Line key={y} pts={[[-74, y], [74, y]]} width={4} color="#9aa0aa" z={0.001} />
      ))}
      <Part shape={roundRect(162, 70, 8)} color={GOLD} flat outline={4} y={262} z={0.002} />
      <FlagDecal kind="usa" w={56} y={120} z={0.003} />
    </Part>
    {shepherd ? (
      <X y={350 + sep} z={0.01}>
        <Part shape={roundRect(200, 110, 14)} color={GOLD} shade={0.3}>
          <Foil w={180} h={90} n={5} seed={9} />
        </Part>
        <SolarPanel w={70} h={120} cols={2} rows={3} x={140} y={10} z={-0.001} />
        <Part shape={ellipse(40, 14)} color={WHITE} flat outline={4} x={-60} y={70} z={0.001} />
      </X>
    ) : null}
  </X>
);

/** Apollo lunar module: gold descent stage on four legs, grey angular ascent stage. */
export const ApolloLM: React.FC<XProps & { ascent?: boolean; flag?: boolean }> = ({ ascent = true, flag = true, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((sd) => (
      <React.Fragment key={`b${sd}`}>
        <Strut a={[sd * 80, 200]} b={[sd * 150, 24]} w={12} color="#9a9ea8" z={-0.02} />
        <Part shape={ellipse(32, 10)} color="#8a8e98" flat outline={4} x={sd * 152} y={12} z={-0.019} />
      </React.Fragment>
    ))}
    <Part shape={roundRect(300, 140, 10)} color={GOLD} shade={0.3} y={216}>
      <Foil w={280} h={120} n={9} seed={4} />
      <Part shape={roundRect(90, 140, 4)} color="#2a2a30" flat outline={4} x={-105} z={0.002} />
      <Part shape={roundRect(90, 140, 4)} color="#2a2a30" flat outline={4} x={105} z={0.002} />
      {flag ? <FlagDecal kind="usa" w={56} y={10} z={0.003} /> : null}
    </Part>
    {ascent ? (
      <X y={290} z={0.003}>
        <Part shape={roundPoly([[-130, 0], [130, 0], [140, 90], [80, 160], [-80, 160], [-140, 90]], 12)} color="#b9bcc2" shade={0.3} />
        <Part shape={poly([[-60, 70], [-20, 70], [-30, 120], [-70, 100]])} color="#2a3a5a" flat outline={4} z={0.001} />
        <Part shape={poly([[20, 70], [60, 70], [70, 100], [30, 120]])} color="#2a3a5a" flat outline={4} z={0.001} />
        <Part shape={roundRect(70, 40, 8)} color="#9aa0aa" flat outline={4} y={176} z={0.001} />
        <Line pts={[[110, 150], [150, 210]]} width={6} color="#8a8e98" z={0.001} />
        <Part shape={ellipse(30, 10)} color={WHITE} flat outline={4} x={156} y={216} rot={-0.4} z={0.002} />
      </X>
    ) : null}
    {[-1, 1].map((sd) => (
      <React.Fragment key={`f${sd}`}>
        <Strut a={[sd * 140, 200]} b={[sd * 245, 26]} w={15} z={0.01} />
        <Part shape={ellipse(40, 13)} color="#b9bcc4" flat outline={5} x={sd * 248} y={12} z={0.011} />
      </React.Fragment>
    ))}
  </X>
);

/** China's Chang'e lander (3/4 view): gold-foil base box with a silver upper deck, two angled solar wings, camera mast and dish, four strutted silver legs with pads; optional ascender on top (`lift`, `thrust`). */
export const ChangELander: React.FC<XProps & { ascender?: boolean; lift?: number; thrust?: number; flag?: boolean; dust?: number }> = ({ ascender = false, lift = 0, thrust = 0, flag = true, dust = 0, ...xf }) => {
  const LEG: [string, string] = ["#c9ccd3", "#9a9ea8"];
  return (
    <X {...xf}>
      <VLeg a1={[-170, 168]} a2={[-110, 150]} top={[-176, 280]} knee={[-180, 92]} foot={[-166, 50]} s={0.8} far color={LEG} z={-0.03} />
      <VLeg a1={[176, 164]} a2={[130, 148]} top={[180, 284]} knee={[196, 92]} foot={[190, 48]} s={0.8} far color={LEG} z={-0.03} />
      <Exhaust x={0} y={92} len={260 * (ascender ? 0 : thrust)} w={60} k={!ascender && thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.5} z={-0.035} />
      <Part shape={poly([[-26, 130], [26, 130], [36, 94], [-36, 94]])} color="#3a3842" flat outline={4} z={-0.01} />
      {[-1, 1].map((sd) => (
        <X key={`w${sd}`} x={sd * 230} y={356} rot={sd * -0.55} z={-0.005}>
          <Part shape={roundRect(84, 262, 6)} color="#d6d8de" flat outline={5} />
          <SolarPanel w={70} h={248} cols={1} rows={6} color="#2a5ec8" z={0.001} />
        </X>
      ))}
      {/* gold base box: side face + front face */}
      <Part shape={poly([[-170, 140], [-24, 132], [-24, 214], [-170, 210]])} color="#d39421" flat outline={5} />
      <Part shape={poly([[-24, 132], [176, 132], [176, 214], [-24, 214]])} color="#f6c232" flat outline={5} z={0.001} />
      <Foil w={180} h={70} n={6} seed={6} color="#c98e22" />
      <Part shape={poly([[-20, 210], [20, 214], [176, 150], [176, 136]])} color="#ffffff" flat outline={0} opacity={0.2} z={0.0015} />
      {/* silver deck */}
      <Part shape={poly([[-170, 210], [-24, 214], [-24, 318], [-160, 306]])} color="#b9bcc4" flat outline={5} z={0.002} />
      <Part shape={poly([[-24, 214], [176, 214], [168, 318], [-24, 318]])} color="#e6e7ea" flat outline={5} z={0.003} />
      <Part shape={poly([[-160, 306], [-24, 318], [168, 318], [120, 340], [-120, 332]])} color="#f2f2f4" flat outline={5} z={0.004} />
      {flag ? <FlagDecal kind="china" w={60} x={40} y={268} z={0.005} /> : null}
      <Part shape={roundRect(64, 40, 6)} color="#9aa0aa" flat outline={4} x={130} y={262} z={0.005} />
      <Part shape={circle(9)} color="#2a2a30" flat outline={2} x={130} y={262} z={0.006} />
      <Line pts={[[120, 334], [120, 430]]} width={8} color="#9a9ea8" z={0.004} />
      <Part shape={roundRect(54, 30, 6)} color="#d9dce2" flat outline={4} x={120} y={440} z={0.005} />
      {[104, 136].map((x) => (
        <Part key={x} shape={circle(7)} color="#2a2a30" flat outline={2} x={x} y={440} z={0.006} />
      ))}
      <X x={-110} y={360} rot={-0.5} z={0.005}>
        <Line pts={[[0, -24], [0, 0]]} width={6} color="#9a9ea8" z={-0.001} />
        <Part shape={ellipse(46, 18)} color="#f2f2f4" flat outline={4} />
        <Part shape={ellipse(34, 12)} color="#d6d8de" flat outline={0} z={0.001} />
      </X>
      {ascender ? (
        <X y={378 + lift} z={0.007}>
          <Exhaust y={-36} len={260 * thrust} w={44} k={thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.5} z={-0.01} />
          <Part shape={roundRect(170, 86, 12)} color="#f6c232" shade={0.3}>
            <Foil w={150} h={64} n={4} seed={7} color="#c98e22" />
          </Part>
          <Part shape={roundRect(76, 32, 6)} color={WHITE} flat outline={4} y={54} z={0.001} />
          <Part shape={poly([[-16, -42], [16, -42], [22, -60], [-22, -60]])} color="#2a2a30" flat outline={4} z={-0.001} />
        </X>
      ) : null}
      <VLeg a1={[-150, 150]} a2={[-24, 136]} top={[-166, 290]} knee={[-210, 70]} foot={[-236, 0]} color={LEG} z={0.01} />
      <VLeg a1={[176, 146]} a2={[70, 136]} top={[172, 296]} knee={[220, 70]} foot={[240, 0]} color={LEG} z={0.01} />
      <LandingDust k={dust} z={0.02} />
    </X>
  );
};

/** China's Yutu rover (3/4 view): gold body with a lit top deck, two angled solar wings, camera mast with stereo eyes, dish, six wheels on rocker-bogie links. Origin = ground centre. `roll` turns the wheels. */
export const YutuRover: React.FC<XProps & { roll?: number }> = ({ roll = 0, ...xf }) => (
  <X {...xf}>
    {[-80, 10, 100].map((x) => (
      <X key={`fw${x}`} x={x + 26} y={44} s={0.8} z={-0.006}>
        <Part shape={circle(28)} color="#3a3842" flat outline={4} />
      </X>
    ))}
    {[-1, 1].map((sd) => (
      <X key={sd} x={sd * 150} y={138} rot={sd * 0.3} z={-0.003}>
        <Part shape={roundRect(170, 34, 4)} color="#d6d8de" flat outline={4} />
        <SolarPanel w={160} h={26} cols={5} rows={1} color="#2a5ec8" z={0.001} />
      </X>
    ))}
    <Part shape={poly([[-110, 62], [-110, 122], [-80, 138], [-80, 76]])} color="#c98e22" flat outline={5} />
    <Part shape={poly([[-80, 76], [110, 76], [110, 138], [-80, 138]])} color="#f6c232" flat outline={5} z={0.001} />
    <Part shape={poly([[-110, 122], [-80, 138], [110, 138], [84, 128], [-86, 122]])} color="#ffd650" flat outline={4} z={0.0015} />
    <Foil w={170} h={50} n={4} seed={8} color="#c98e22" />
    <Part shape={poly([[-76, 132], [-40, 136], [110, 92], [110, 80]])} color="#ffffff" flat outline={0} opacity={0.18} z={0.002} />
    <Line pts={[[70, 136], [70, 206]]} width={7} color="#9a9ea8" z={0.002} />
    <Part shape={roundRect(70, 32, 8)} color="#e6e7ea" flat outline={4} x={70} y={216} z={0.003} />
    {[54, 86].map((x) => (
      <Part key={x} shape={circle(7)} color="#2a2a30" flat outline={2} x={x} y={216} z={0.004} />
    ))}
    <X x={-50} y={156} rot={-0.4} z={0.003}>
      <Part shape={ellipse(30, 12)} color="#f2f2f4" flat outline={3} />
    </X>
    <Line pts={[[-80, 40], [10, 68], [100, 40]]} width={7} color="#8a8e98" z={0.002} />
    {[-80, 10, 100].map((x) => (
      <X key={x} x={x} y={32} rot={-roll} z={0.004}>
        <Part shape={circle(30)} color="#5a5a64" flat outline={5} />
        <Part shape={circle(14)} color="#c9ccd3" flat outline={3} z={0.001} />
        {Array.from({ length: 6 }, (_, k) => {
          const a = (k / 6) * Math.PI * 2;
          return <Line key={k} pts={[[Math.round(Math.cos(a) * 17), Math.round(Math.sin(a) * 17)], [Math.round(Math.cos(a) * 27), Math.round(Math.sin(a) * 27)]]} width={3} color="#2a2a30" z={0.0005} />;
        })}
      </X>
    ))}
  </X>
);

/** Chang'e-7's hopping probe: small gold body on four legs with a thruster. */
export const Hopper: React.FC<XProps & { thrust?: number }> = ({ thrust = 0, ...xf }) => (
  <X {...xf}>
    <Exhaust y={52} len={160 * thrust} w={30} k={thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.5} z={-0.01} />
    {[-1, 1].map((sd) => (
      <React.Fragment key={sd}>
        <Strut a={[sd * 40, 70]} b={[sd * 78, 12]} w={9} z={-0.002} />
        <Part shape={ellipse(18, 6)} color="#b9bcc4" flat outline={4} x={sd * 80} y={6} z={-0.001} />
      </React.Fragment>
    ))}
    <Part shape={roundRect(130, 70, 16)} color={GOLD} shade={0.3} y={92}>
      <Foil w={110} h={50} n={3} seed={2} />
      <FlagDecal kind="china" w={34} x={-30} y={4} z={0.002} />
    </Part>
    <Part shape={roundRect(132, 16, 4)} color={NAVY} flat outline={4} y={134} z={0.001} />
    <Part shape={poly([[-14, 58], [14, 58], [18, 44], [-18, 44]])} color="#2a2a30" flat outline={3} z={0.001} />
  </X>
);

/** Orion crew capsule on its service module (four solar wings). Origin = centre, capsule toward +y. `crew` shows faces in the windows. */
export const Orion: React.FC<XProps & { thrust?: number; crew?: boolean; flag?: boolean }> = ({ thrust = 0, crew = true, flag = true, ...xf }) => (
  <X {...xf}>
    <Exhaust y={-238} len={300 * thrust} w={60} k={thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.5} z={-0.02} />
    {[-1, 1].map((sd) => (
      <React.Fragment key={sd}>
        <SolarPanel w={300} h={74} cols={4} rows={1} x={sd * 250} y={-80 + sd * 10} rot={sd * 0.35} z={-0.01} />
        <SolarPanel w={260} h={60} cols={4} rows={1} x={sd * 220} y={-110} rot={sd * -0.25} color="#1c2a4c" z={-0.012} />
      </React.Fragment>
    ))}
    <Part shape={poly([[-44, -196], [44, -196], [64, -236], [-64, -236]])} color="#5a5a64" flat outline={5} z={-0.001} />
    <Part shape={roundRect(220, 180, 12)} color={WHITE} shade={0.3} y={-100}>
      <Part shape={roundRect(222, 22, 0)} color="#2a2a30" flat outline={0} y={50} z={0.001} />
      {flag ? <FlagDecal kind="usa" w={54} x={-50} y={-20} z={0.002} /> : null}
    </Part>
    <Part shape={roundPoly([[-122, 0], [122, 0], [56, 160], [-56, 160]], 14)} color="#c9cdd3" shade={0.3} z={0.002}>
      <Line pts={[[-118, 8], [118, 8]]} width={10} color="#4a3a32" z={0.001} />
      {[-34, 34].map((x) => (
        <X key={x} x={x} y={74} z={0.002}>
          <Part shape={roundRect(34, 30, 8)} color="#2a3a5a" flat outline={4} />
          {crew ? <Part shape={circle(9)} color="#f6f5f8" flat outline={2.5} y={-2} z={0.001} /> : null}
        </X>
      ))}
    </Part>
    <Part shape={roundRect(60, 26, 6)} color="#b9bcc4" flat outline={4} y={172} z={0.003} />
  </X>
);

/** NASA's SLS rocket (orange core, two white boosters, Orion with escape tower). Origin = base centre. */
export const SLS: React.FC<XProps & { h?: number; thrust?: number; seed?: number }> = ({ h = 1400, thrust = 0, seed = 2, ...xf }) => {
  const core = h * 0.62;
  return (
    <X {...xf}>
      {thrust > 0.02 ? (
        <>
          <Exhaust y={0} len={700 * thrust} w={130} seed={seed} z={-0.02} />
          {[-1, 1].map((sd) => (
            <Exhaust key={sd} x={sd * 92} y={4} len={760 * thrust} w={90} seed={seed + sd + 3} glow={0} z={-0.021} />
          ))}
        </>
      ) : null}
      <Part shape={roundRect(116, ri(core), 10)} color="#e07a2a" shade={0.3} y={ri(h * 0.04 + core / 2)}>
        {[0.3, 0.1, -0.15, -0.38].map((k) => (
          <Line key={k} pts={[[-54, ri(core * k)], [54, ri(core * k)]]} width={4} color="#a85a1e" z={0.001} />
        ))}
      </Part>
      {[-1, 1].map((sd) => (
        <X key={sd} x={sd * 92} z={0.005}>
          <Part shape={roundRect(64, ri(h * 0.54), 8)} color={WHITE} shade={0.3} y={ri(h * 0.04 + h * 0.27)}>
            {[0.18, -0.05, -0.28].map((k) => (
              <Part key={k} shape={roundRect(66, 14, 0)} color="#2a2a30" flat outline={0} y={ri(h * 0.54 * k)} z={0.001} />
            ))}
          </Part>
          <Part shape={poly([[-32, ri(h * 0.58)], [32, ri(h * 0.58)], [0, ri(h * 0.64)]])} color={WHITE} flat outline={5} z={0.001} />
          <Part shape={poly([[-26, ri(h * 0.04)], [26, ri(h * 0.04)], [34, 0], [-34, 0]])} color="#5a5a64" flat outline={4} z={0.001} />
        </X>
      ))}
      <Part shape={poly([[-58, ri(h * 0.66)], [58, ri(h * 0.66)], [44, ri(h * 0.72)], [-44, ri(h * 0.72)]])} color={WHITE} flat outline={5} z={0.002} />
      <Part shape={roundRect(88, ri(h * 0.08), 6)} color={WHITE} shade={0.3} y={ri(h * 0.76)} z={0.002} />
      <Part shape={poly([[-50, ri(h * 0.8)], [50, ri(h * 0.8)], [20, ri(h * 0.88)], [-20, ri(h * 0.88)]])} color="#e6e8ec" shade={0.3} z={0.003} />
      <Part shape={roundRect(10, ri(h * 0.08), 4)} color="#c9cdd3" flat outline={4} y={ri(h * 0.92)} z={0.003} />
      {[-1, 0, 1].map((k) => (
        <Part key={k} shape={poly([[k * 32 - 12, ri(h * 0.045)], [k * 32 + 12, ri(h * 0.045)], [k * 32 + 16, 6], [k * 32 - 16, 6]])} color="#3a3a44" flat outline={4} z={0.001} />
      ))}
    </X>
  );
};

/** ISRO's PSLV: slim white core with six strap-on boosters (three visible), payload fairing. Origin = base centre. */
export const PSLV: React.FC<XProps & { h?: number; thrust?: number; seed?: number }> = ({ h = 1200, thrust = 0, seed = 5, ...xf }) => (
  <X {...xf}>
    {thrust > 0.02 ? <Exhaust y={0} len={620 * thrust} w={110} seed={seed} z={-0.03} /> : null}
    {[-1, 1].map((sd) => (
      <X key={sd} x={sd * 58} z={-0.01}>
        <Part shape={roundRect(40, ri(h * 0.3), 8)} color="#e9e8e2" shade={0.3} y={ri(h * 0.02 + h * 0.15)} />
        <Part shape={poly([[-20, ri(h * 0.32)], [20, ri(h * 0.32)], [0, ri(h * 0.37)]])} color="#4a4a52" flat outline={4} z={0.001} />
      </X>
    ))}
    <Part shape={roundRect(84, ri(h * 0.44), 8)} color="#f0efe9" shade={0.3} y={ri(h * 0.02 + h * 0.22)}>
      {[0.3, 0, -0.3].map((k) => (
        <Line key={k} pts={[[-40, ri(h * 0.44 * k)], [40, ri(h * 0.44 * k)]]} width={4} color="#b9b6ac" z={0.001} />
      ))}
      <FlagDecal kind="india" w={52} y={ri(h * 0.08)} z={0.002} />
    </Part>
    <X z={0.01}>
      <Part shape={roundRect(42, ri(h * 0.26), 8)} color="#e9e8e2" shade={0.3} y={ri(h * 0.02 + h * 0.13)} />
      <Part shape={poly([[-21, ri(h * 0.28)], [21, ri(h * 0.28)], [0, ri(h * 0.33)]])} color="#4a4a52" flat outline={4} z={0.001} />
    </X>
    <Part shape={roundRect(84, ri(h * 0.18), 6)} color="#c9c6bc" shade={0.3} y={ri(h * 0.46 + h * 0.09)} z={0.002} />
    <Part shape={roundRect(84, ri(h * 0.1), 6)} color="#f0efe9" shade={0.3} y={ri(h * 0.64 + h * 0.05)} z={0.002} />
    <Part shape={roundRect(116, ri(h * 0.15), 20)} color="#f6f5f0" shade={0.3} y={ri(h * 0.74 + h * 0.075)} z={0.003} />
    <Part shape={blob([[-58, ri(h * 0.885)], [58, ri(h * 0.885)], [40, ri(h * 0.94)], [0, ri(h * 0.98)], [-40, ri(h * 0.94)]], 8)} color="#f6f5f0" shade={0.3} z={0.003} />
    <Part shape={poly([[-30, ri(h * 0.02)], [30, ri(h * 0.02)], [40, 0], [-40, 0]])} color="#3a3a44" flat outline={4} z={0.004} />
  </X>
);

// ───────────────────────── base, fuel, helium-3 ─────────────────────────

/** Vertical solar mast (tracks a low Sun) on a lattice pole. Origin = foot. `turn` −1..1 turns the panel edge-on. */
export const SolarMast: React.FC<XProps & { h?: number; turn?: number }> = ({ h = 520, turn = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(22, h, 6)} color="#c9ccd3" flat outline={4} y={h / 2} />
    {Array.from({ length: Math.floor(h / 60) }, (_, i) => (
      <Line key={i} pts={[[-9, 20 + i * 60], [9, 50 + i * 60]]} width={3} color="#8a8e98" z={0.0005} />
    ))}
    <X y={h * 0.62} sx={Math.max(0.12, Math.cos(turn * 1.4))} z={0.001}>
      <Part shape={roundRect(186, ri(h * 0.62) + 16, 6)} color="#d6d8de" flat outline={5} />
      <SolarPanel w={170} h={ri(h * 0.62)} cols={3} rows={5} color="#2a5ec8" z={0.001} />
    </X>
    <Part shape={roundRect(90, 22, 6)} color="#8a8e98" flat outline={4} y={11} z={0.002} />
  </X>
);

/** Ground solar array: a tilted blue panel on two short legs. Origin = ground centre. */
export const GroundPanel: React.FC<XProps & { w?: number; h?: number }> = ({ w = 260, h = 120, ...xf }) => (
  <X {...xf}>
    <Part shape={ellipse(ri(w * 0.55), ri(h * 0.18))} color="#1c1a26" flat outline={0} opacity={0.25} x={ri(w * 0.12)} y={-4} z={-0.002} />
    {[-0.3, 0.3].map((k) => (
      <Line key={k} pts={[[ri(k * w), 0], [ri(k * w), ri(h * 0.5)]]} width={6} color="#8a8e98" z={-0.001} />
    ))}
    <X y={ri(h * 0.6)} sy={0.55} rot={-0.08}>
      <Part shape={roundRect(w + 14, h + 14, 6)} color="#d6d8de" flat outline={5} />
      <SolarPanel w={w} h={h} cols={6} rows={3} color="#2a5ec8" z={0.001} />
    </X>
  </X>
);

/** Six-wheeled pressurised Moon rover with a cabin. Origin = ground centre. `roll` turns the wheels. */
export const MoonRover: React.FC<XProps & { roll?: number; lights?: number }> = ({ roll = 0, lights = 0.6, ...xf }) => (
  <X {...xf}>
    <Part shape={ellipse(170, 18)} color="#1c1a26" flat outline={0} opacity={0.3} y={-2} z={-0.01} />
    {[-110, 0, 110].map((x, i) => (
      <X key={`fw${i}`} x={x + 30} y={52} s={0.85} z={-0.005}>
        <Part shape={circle(34)} color="#2a2830" flat outline={4} />
      </X>
    ))}
    <Part shape={roundRect(300, 70, 18)} color="#d8dbe2" shade={0.3} y={92} />
    <Part shape={poly([[-150, 120], [60, 120], [110, 190], [-130, 196]])} color="#eef0f3" shade={0.3} z={0.001} />
    <Part shape={poly([[66, 124], [138, 124], [104, 184], [72, 184]])} color="#9ad2f2" flat outline={4} z={0.002} />
    <Part shape={poly([[78, 132], [96, 132], [84, 170], [76, 170]])} color="#ffffff" flat outline={0} opacity={0.6} z={0.003} />
    {[-100, -40, 20].map((x) => (
      <Part key={x} shape={roundRect(38, 30, 6)} color="#9ad2f2" flat outline={4} x={x} y={154} z={0.002} />
    ))}
    <Part shape={roundRect(300, 12, 4)} color="#f2a23a" flat outline={0} y={104} z={0.002} />
    <Part shape={roundRect(60, 20, 4)} color="#b9bcc4" flat outline={4} x={-90} y={206} z={0.002} />
    <Line pts={[[-60, 196], [-60, 250]]} width={5} color="#9a9ea8" z={0.002} />
    <Part shape={ellipse(22, 8)} color="#eef0f3" flat outline={3} x={-60} y={254} rot={-0.3} z={0.003} />
    {lights > 0 ? <Glow rx={90} ry={40} x={150} y={96} color="#fff2c6" alpha={0.5 * lights} additive z={0.01} /> : null}
    {[-110, 0, 110].map((x, i) => (
      <X key={`w${i}`} x={x} y={40} rot={-roll} z={0.004}>
        <Part shape={circle(40)} color="#33313a" flat outline={5} />
        <Part shape={circle(20)} color="#c9ccd3" flat outline={3} z={0.001} />
        {Array.from({ length: 6 }, (_, k) => {
          const a = (k / 6) * Math.PI * 2;
          return <Line key={k} pts={[[ri(Math.cos(a) * 24), ri(Math.sin(a) * 24)], [ri(Math.cos(a) * 36), ri(Math.sin(a) * 36)]]} width={4} color="#55525e" z={0.0005} />;
        })}
      </X>
    ))}
  </X>
);

/** Ribbed habitat dome with an airlock tube. Origin = ground centre. */
const HabDome: React.FC<XProps & { r: number; lights: number; frame: number; i: number; door?: 1 | -1 }> = ({ r, lights, frame, i, door = 1, ...xf }) => {
  const shell = blob([[-r, 0], [-r * 0.92, r * 0.5], [-r * 0.5, r * 0.88], [0, r], [r * 0.5, r * 0.88], [r * 0.92, r * 0.5], [r, 0]], 8);
  return (
    <X {...xf}>
      <Part shape={ellipse(ri(r * 1.15), ri(r * 0.12))} color="#1c1a26" flat outline={0} opacity={0.28} x={ri(r * 0.2)} y={-4} z={-0.01} />
      <Part shape={shell} color="#eef0f4" shade={0.3}>
        {[-0.85, -0.55, -0.25, 0.08, 0.4, 0.7].map((k) => (
          <Line key={k} pts={Array.from({ length: 9 }, (_, j) => {
            const ph = (j / 8) * (Math.PI / 2);
            return [ri(r * k * Math.cos(ph)), ri(r * Math.sin(ph) * 0.985)] as [number, number];
          })} smooth width={4} color="#b9bcc6" z={0.001} />
        ))}
        {[0.35, 0.68].map((h) => (
          <Line key={h} pts={[[ri(-r * Math.sqrt(1 - h * h) * 0.98), ri(r * h)], [ri(r * Math.sqrt(1 - h * h) * 0.98), ri(r * h)]]} width={4} color="#b9bcc6" z={0.001} />
        ))}
        <Part shape={roundRect(ri(r * 0.5), ri(r * 0.14), 10)} color="#ffd88a" flat outline={4} x={ri(-r * 0.2)} y={ri(r * 0.52)} opacity={0.5 + 0.5 * lights} z={0.002} />
        <Part shape={circle(ri(r * 0.07))} color="#d9473a" flat outline={2} y={ri(r * 0.99)} z={0.002} />
      </Part>
      {/* airlock tube toward the viewer */}
      <X x={ri(door * r * 0.62)} y={ri(r * 0.22)} z={0.004}>
        <Part shape={roundRect(ri(r * 0.62), ri(r * 0.4), ri(r * 0.18))} color="#e2e4ea" shade={0.3} />
        {[-0.12, 0.08].map((k) => (
          <Line key={k} pts={[[ri(k * r), ri(-r * 0.2)], [ri(k * r), ri(r * 0.2)]]} width={4} color="#a9acb6" z={0.001} />
        ))}
        <Part shape={ellipse(ri(r * 0.13), ri(r * 0.2))} color="#cfd2da" flat outline={4} x={ri(door * r * 0.31)} z={0.002} />
        <Part shape={roundRect(ri(r * 0.1), ri(r * 0.2), 6)} color="#8a8e98" flat outline={3} x={ri(door * r * 0.31)} y={-ri(r * 0.02)} z={0.003} />
      </X>
      {lights > 0 ? <Glow rx={r * 0.7} ry={r * 0.3} x={ri(-r * 0.2)} y={r * 0.52} color="#ffd88a" alpha={0.25 * lights * (0.9 + 0.1 * Math.sin(frame * 0.1 + i))} additive z={0.01} /> : null}
    </X>
  );
};

/** Moon base: ribbed habitat domes with airlocks, a connecting module, solar masts and ground arrays, comms tower with dishes, a tank, a rover. Origin = ground centre. */
export const MoonBase: React.FC<XProps & { lights?: number; flag?: FlagKind | null; masts?: number; turn?: number; rover?: boolean }> = ({ lights = 0.6, flag = null, masts = 3, turn = 0, rover = true, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      {Array.from({ length: masts }, (_, i) => (
        <SolarMast key={i} x={-620 - i * 190} h={500 + (i % 2) * 80} turn={turn} z={-0.02 + i * 0.001} />
      ))}
      {/* comms tower */}
      <X x={640} z={-0.015}>
        <Part shape={poly([[-36, 0], [36, 0], [12, 420], [-12, 420]])} color="#d6d8de" shade={0.3} />
        {[80, 170, 260, 340].map((y) => (
          <Line key={y} pts={[[ri(-36 + y * 0.057), y], [ri(36 - y * 0.057), y]]} width={4} color="#9a9ea8" z={0.001} />
        ))}
        <X x={-10} y={440} rot={-0.5} z={0.002}>
          <Part shape={ellipse(78, 30)} color="#eef0f3" flat outline={5} />
          <Part shape={ellipse(60, 21)} color="#cfd2da" flat outline={0} z={0.001} />
          <Line pts={[[0, 0], [30, 40]]} width={4} color="#9a9ea8" z={0.002} />
        </X>
        <X x={40} y={330} rot={0.5} s={0.6} z={0.003}>
          <Part shape={ellipse(78, 30)} color="#eef0f3" flat outline={5} />
          <Part shape={ellipse(60, 21)} color="#cfd2da" flat outline={0} z={0.001} />
        </X>
        <Part shape={circle(9)} color="#ff5a4a" flat outline={2} y={470} opacity={0.5 + 0.5 * Math.sin(frame * 0.25)} z={0.004} />
      </X>
      {/* tank on legs */}
      <X x={480} z={-0.012}>
        {[-50, 0, 50].map((x) => (
          <Line key={x} pts={[[x, 0], [x * 0.4, 120]]} width={7} color="#9a9ea8" />
        ))}
        <Part shape={circle(74)} color="#eef0f3" shade={0.32} y={170} z={0.001} />
        <Line pts={[[-74, 170], [74, 170]]} width={4} color="#b9bcc6" z={0.002} />
      </X>
      {/* connecting module */}
      <Part shape={roundRect(440, 130, 56)} color="#e6e8ee" shade={0.3} x={40} y={72} z={-0.005}>
        {[-150, -50, 50, 150].map((x) => (
          <Line key={`rb${x}`} pts={[[x + 50, -60], [x + 50, 60]]} width={4} color="#b9bcc6" z={0.001} />
        ))}
        {[-120, -20, 80].map((x) => (
          <Part key={x} shape={roundRect(34, 28, 8)} color="#ffd88a" flat outline={4} x={x} y={8} opacity={0.5 + 0.5 * lights} z={0.002} />
        ))}
        <Part shape={roundRect(440, 12, 4)} color="#f2a23a" flat outline={0} y={-36} z={0.002} />
      </Part>
      <HabDome r={260} x={-260} lights={lights} frame={frame} i={0} door={1} z={0} />
      <HabDome r={200} x={330} lights={lights} frame={frame} i={1} door={-1} z={0.001} />
      {Array.from({ length: Math.max(0, masts - 1) }, (_, i) => (
        <GroundPanel key={`gp${i}`} x={-560 - i * 300} y={-70 - (i % 2) * 30} w={240} h={110} z={0.006 + i * 0.001} />
      ))}
      {flag ? <NationFlag kind={flag} w={150} pole={360} x={460} z={0.004} /> : null}
      {rover ? <MoonRover x={170} y={-110} s={0.62} lights={lights} z={0.008} /> : null}
    </X>
  );
};


/** Retro fuel pump with hose and nozzle. Origin = base centre. */
export const FuelPump: React.FC<XProps & { color?: string; glow?: number }> = ({ color = "#d9473a", glow = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(220, 36, 8)} color="#9aa0aa" flat outline={5} y={18} />
    <Part shape={roundRect(170, 340, 24)} color={color} shade={0.3} y={200} z={0.001}>
      <Part shape={roundRect(116, 80, 10)} color="#e8f4e8" flat outline={5} y={70} z={0.001} />
      <Line pts={[[-40, 60], [40, 60]]} width={6} color="#4a6a4a" z={0.002} />
      <Line pts={[[-40, 84], [20, 84]]} width={6} color="#4a6a4a" z={0.002} />
      <Part shape={roundRect(116, 40, 8)} color="#f4f1ea" flat outline={4} y={-40} z={0.001} />
    </Part>
    <Part shape={circle(56)} color="#f6f5f0" shade={0.3} y={418} z={0.002} />
    {glow > 0 ? <Glow rx={160} color="#fff2c6" alpha={0.4 * glow} additive y={418} z={0.01} /> : null}
    <Line pts={[[86, 230], [150, 190], [160, 120], [130, 80]]} smooth width={14} color="#2a2a30" z={0.003} />
    <Part shape={roundRect(30, 70, 8)} color="#4a4a52" flat outline={4} x={98} y={250} z={0.004} />
  </X>
);

/** Fusion reactor (tokamak): grey torus, glowing plasma ring, magnet coils. Origin = centre. */
export const Tokamak: React.FC<XProps & { plasma?: number }> = ({ plasma = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const ring = Array.from({ length: 49 }, (_, i) => [Math.cos((i / 48) * Math.PI * 2) * 300, Math.sin((i / 48) * Math.PI * 2) * 120 + 8] as [number, number]);
  return (
    <X {...xf}>
      <Part shape={roundRect(560, 60, 10)} color="#7a7e88" flat outline={5} y={-250} z={-0.01} />
      <Part shape={ellipse(420, 210)} color="#a9aeb8" shade={0.3} />
      <Part shape={ellipse(200, 76)} color="#22222c" flat outline={6} y={14} z={0.001} />
      {plasma > 0 ? (
        <>
          <Line pts={ring} width={34} color="#ff7ad8" opacity={0.85 * plasma} z={0.002} />
          <Line pts={ring} width={12} color="#ffe0f6" opacity={plasma} z={0.003} />
          <Glow rx={420} ry={200} color="#ff7ad8" alpha={0.35 * plasma * (0.85 + 0.15 * Math.sin(frame * 0.3))} additive z={0.004} />
        </>
      ) : null}
      {[-330, -170, 0, 170, 330].map((x, i) => (
        <Part key={i} shape={roundRect(50, 300 - Math.abs(x) * 0.35, 18)} color="#2f4f8a" flat outline={5} x={x} y={-30 + Math.abs(x) * 0.08} z={0.005} />
      ))}
    </X>
  );
};

/** Quantum-computer dilution fridge ("chandelier"): stacked gold plates and cables, a chip at the bottom. Origin = top centre. */
export const QuantumFridge: React.FC<XProps & { cold?: number }> = ({ cold = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const plates: [number, number][] = [
    [0, 230],
    [-150, 190],
    [-290, 150],
    [-420, 112],
    [-540, 80],
  ];
  return (
    <X {...xf}>
      <Part shape={roundRect(24, 120, 8)} color="#b9bcc4" flat outline={4} y={60} z={-0.01} />
      {plates.slice(0, -1).map(([y, w], i) => {
        const [y2, w2] = plates[i + 1];
        return [-0.7, -0.25, 0.25, 0.7].map((k) => (
          <Line key={`${i}${k}`} pts={[[k * w, y], [k * w2, y2]]} width={8} color="#c9952a" z={-0.002} />
        ));
      })}
      {[-0.45, 0.1, 0.5].map((k, i) => (
        <Line key={`cb${i}`} pts={[[k * 220, 0], [k * 180 + 20, -120], [k * 140 - 10, -300], [k * 90, -540]]} smooth width={5} color="#d97a4a" z={-0.001} />
      ))}
      {plates.map(([y, w], i) => (
        <Part key={i} shape={ellipse(w, 24)} color="#e6b23c" shade={0.3} y={y} z={i * 0.001} />
      ))}
      <Part shape={roundRect(90, 34, 6)} color="#2a2a36" flat outline={5} y={-590} z={0.01} />
      {cold > 0 ? <Glow rx={200} color="#8fe3ff" alpha={0.5 * cold * (0.85 + 0.15 * Math.sin(frame * 0.2))} additive y={-590} z={0.02} /> : null}
    </X>
  );
};

/** Gas cylinder (helium-3). Origin = base centre. */
export const GasCanister: React.FC<XProps & { color?: string; h?: number }> = ({ color = "#5a8ad2", h = 300, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(130, h, 56)} color={color} shade={0.3} y={h / 2}>
      <Part shape={roundRect(132, h * 0.24, 0)} color="#f4f1ea" flat outline={4} y={-h * 0.04} z={0.001} />
    </Part>
    <Part shape={roundRect(44, 46, 8)} color="#9aa0aa" flat outline={4} y={h + 18} z={0.001} />
    <Part shape={roundRect(80, 16, 6)} color="#7a7e88" flat outline={4} y={h + 46} z={0.002} />
  </X>
);

/** Regolith harvester: tracked rover with a turning bucket wheel and a heater tank. Origin = ground centre. */
export const Harvester: React.FC<XProps & { dig?: number; heat?: number }> = ({ dig = 1, heat = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const a = frame * 0.05 * dig;
  return (
    <X {...xf}>
      <X x={300} y={140} rot={-a} z={0.002}>
        {Array.from({ length: 8 }, (_, i) => (
          <Part key={i} shape={roundRect(60, 46, 8)} color="#e0a83a" flat outline={4} x={Math.cos((i / 8) * Math.PI * 2) * 120} y={Math.sin((i / 8) * Math.PI * 2) * 120} rot={(i / 8) * Math.PI * 2} />
        ))}
        <Part shape={circle(110)} color="#9aa0aa" flat outline={6} z={-0.001} />
        <Part shape={circle(34)} color="#5a5a64" flat outline={4} z={0.001} />
      </X>
      <Strut a={[150, 120]} b={[300, 140]} w={24} color="#7a7e88" z={0.001} />
      <Part shape={roundRect(440, 70, 30)} color="#3a3a44" flat outline={5} y={40} />
      {[-150, -50, 50, 150].map((x) => (
        <Part key={x} shape={circle(26)} color="#5a5a64" flat outline={4} x={x} y={40} z={0.001} />
      ))}
      <Part shape={roundRect(400, 90, 14)} color="#e6e7ea" shade={0.3} y={120} z={0.002} />
      <Part shape={roundRect(230, 150, 30)} color="#f4f1ea" shade={0.3} x={-40} y={235} z={0.003}>
        <Part shape={roundRect(232, 26, 0)} color="#e07a2a" flat outline={0} y={-20} z={0.001} />
      </Part>
      {heat > 0 ? <Glow rx={160} color="#ff9a3a" alpha={0.45 * heat * (0.85 + 0.15 * Math.sin(frame * 0.25))} additive x={-40} y={235} z={0.01} /> : null}
      <Line pts={[[60, 300], [60, 360]]} width={18} color="#9aa0aa" z={0.002} />
    </X>
  );
};

/** Bullet flying toward +x with speed lines. Origin = centre. */
export const Bullet: React.FC<XProps & { speed?: number }> = ({ speed = 1, ...xf }) => (
  <X {...xf}>
    {speed > 0
      ? [-24, 0, 24].map((y, i) => <Line key={i} pts={[[-120 - 260 * speed, y], [-110, y]]} width={8 - i * 1} color="#ffffff" opacity={0.6} z={-0.001} />)
      : null}
    <Part shape={roundRect(150, 62, 10)} color="#d6a13a" shade={0.3} x={-30} />
    <Part shape={blob([[40, -30], [40, 30], [90, 22], [118, 0], [90, -22]], 8)} color="#c46a3a" shade={0.3} z={0.001} />
  </X>
);

/** Thin, dashed range line between two points (GRAIL's gap). */
export const DashLink: React.FC<{ a: [number, number]; b: [number, number]; color?: string; width?: number; dash?: number; z?: number; opacity?: number }> = ({ a, b, color = "#7fe0ff", width = 8, dash = 26, z = 0, opacity = 1 }) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.floor(len / (dash * 2)));
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const k0 = (i * 2 * dash) / len;
        const k1 = Math.min(1, (i * 2 * dash + dash) / len);
        return (
          <Line key={i} pts={[[a[0] + (b[0] - a[0]) * k0, a[1] + (b[1] - a[1]) * k0], [a[0] + (b[0] - a[0]) * k1, a[1] + (b[1] - a[1]) * k1]]} width={width} color={color} opacity={opacity} z={z} />
        );
      })}
    </>
  );
};

/** Impact flash + debris plume rising from the ground, t 0..1. Origin = impact point. */
export const ImpactPlume: React.FC<XProps & { t: number; size?: number; seed?: number; water?: number }> = ({ t, size = 1, seed = 4, water = 0, ...xf }) => {
  if (t <= 0) return null;
  const r = rng(seed);
  const rise = Math.min(1, t * 1.6);
  const fade = t < 0.6 ? 1 : Math.max(0, 1 - (t - 0.6) / 0.4);
  const puffs: [number, number, number][] = Array.from({ length: 22 }, (_, i) => {
    const k = i / 21;
    const spread = (60 + k * 360) * rise;
    return [ri((r() - 0.5) * 2 * spread), ri(30 + k * 760 * rise), ri((26 + r() * 40) * (0.5 + rise * 0.6))];
  });
  const drops = water > 0 ? Array.from({ length: 14 }, () => [(r() - 0.5) * 500 * rise, 120 + r() * 600 * rise] as [number, number]) : [];
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      <Glow rx={420 * (1 - t * 0.5)} color="#fff2c6" alpha={0.8 * Math.max(0, 1 - t * 2.5)} additive />
      <Puffs puffs={puffs} color="#cbc5bb" opacity={fade} />
      {drops.map(([x, y], i) => (
        <X key={i} x={x} y={y} z={0.01} s={Math.min(1, water * 1.4)}>
          <Part shape={blob([[0, 18], [10, 0], [6, -10], [-6, -10], [-10, 0]], 6)} color="#5ac8ff" flat outline={3} opacity={fade} />
        </X>
      ))}
    </X>
  );
};

/** Small flare/noise helper for shaky things (exported for shots). */
export const jitter = (frame: number, seed: number, amp = 1) => noise1(frame * 0.6, seed) * amp;

/** Static outline circle helper (rings, targets). */
export const Ring: React.FC<XProps & { r: number; width?: number; color?: string; opacity?: number }> = ({ r, width = 8, color = INK, opacity = 1, ...xf }) => (
  <X {...xf}>
    <Line pts={Array.from({ length: 49 }, (_, i) => [Math.cos((i / 48) * Math.PI * 2) * r, Math.sin((i / 48) * Math.PI * 2) * r] as [number, number])} width={width} color={color} opacity={opacity} />
  </X>
);

export { DARK as LANDER_DARK };
