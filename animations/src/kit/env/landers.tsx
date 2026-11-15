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

/** ISRO's Vikram (Chandrayaan-3): gold box, solar panel face, four splayed legs. `thrust` engines, `dust` on touchdown. */
export const Vikram: React.FC<XProps & { thrust?: number; dust?: number; seed?: number; flag?: boolean }> = ({ thrust = 0, dust = 0, seed = 1, flag = true, ...xf }) => (
  <X {...xf}>
    {/* back legs */}
    {[-1, 1].map((sd) => (
      <React.Fragment key={`b${sd}`}>
        <Strut a={[sd * 70, 160]} b={[sd * 140, 20]} w={12} color="#9a9ea8" z={-0.02} />
        <Part shape={ellipse(30, 9)} color="#8a8e98" flat outline={4} x={sd * 142} y={10} z={-0.019} />
      </React.Fragment>
    ))}
    <Exhaust x={0} y={102} len={300 * thrust} w={70} k={thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.6} seed={seed} rot={0} z={-0.03} />
    {/* engine skirt + nozzles */}
    <Part shape={poly([[-115, 152], [115, 152], [92, 118], [-92, 118]])} color="#5a5a64" flat outline={5} z={-0.005} />
    {[-60, -20, 20, 60].map((x) => (
      <Part key={x} shape={poly([[x - 11, 120], [x + 11, 120], [x + 15, 98], [x - 15, 98]])} color="#2a2a30" flat outline={4} z={-0.004} />
    ))}
    {/* body */}
    <Part shape={roundRect(340, 190, 16)} color={GOLD} shade={0.3} y={245}>
      <Foil w={160} h={170} seed={seed} />
      <SolarPanel w={150} h={158} cols={3} rows={3} x={78} z={0.002} />
      {flag ? <FlagDecal kind="india" w={58} x={-100} y={30} z={0.003} /> : null}
    </Part>
    <Part shape={roundRect(344, 24, 8)} color={SILVER} flat outline={5} y={336} z={0.004} />
    {/* top instruments */}
    <Part shape={roundRect(54, 54, 10)} color={WHITE} shade={0.3} x={-100} y={372} z={0.003} />
    <Part shape={roundRect(80, 26, 6)} color="#b9bcc4" flat outline={4} x={-15} y={360} z={0.003} />
    <Line pts={[[70, 346], [70, 386]]} width={8} color="#9a9ea8" z={0.002} />
    <Part shape={ellipse(42, 14)} color={WHITE} flat outline={5} x={70} y={392} z={0.003} />
    {/* front legs */}
    {[-1, 1].map((sd) => (
      <React.Fragment key={`f${sd}`}>
        <Strut a={[sd * 160, 175]} b={[sd * 252, 22]} w={16} z={0.01} />
        <Strut a={[sd * 115, 140]} b={[sd * 244, 30]} w={10} z={0.009} />
        <Part shape={ellipse(42, 12)} color="#b9bcc4" flat outline={5} x={sd * 255} y={10} z={0.011} />
      </React.Fragment>
    ))}
    <LandingDust k={dust} y={0} z={0.02} seed={seed + 4} />
  </X>
);

/** Russia's Luna-25: flat base, two big round tanks, gold body, dark panels on top. */
export const Luna25: React.FC<XProps & { thrust?: number; seed?: number }> = ({ thrust = 0, seed = 2, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((sd) => (
      <React.Fragment key={`b${sd}`}>
        <Strut a={[sd * 80, 150]} b={[sd * 150, 18]} w={12} color="#9a9ea8" z={-0.02} />
        <Part shape={ellipse(30, 9)} color="#8a8e98" flat outline={4} x={sd * 152} y={10} z={-0.019} />
      </React.Fragment>
    ))}
    <Exhaust x={0} y={110} len={280 * thrust} w={64} k={thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.6} seed={seed} z={-0.03} />
    <Part shape={poly([[-34, 134], [34, 134], [46, 104], [-46, 104]])} color="#2a2a30" flat outline={4} z={-0.004} />
    <Part shape={roundRect(370, 40, 12)} color="#cfd3da" shade={0.3} y={152} />
    {[-1, 1].map((sd) => (
      <Part key={`t${sd}`} shape={circle(68)} color="#eceef2" shade={0.35} x={sd * 108} y={232} z={0.002} />
    ))}
    <Part shape={roundRect(120, 160, 10)} color={GOLD} shade={0.3} y={250} z={0.001}>
      <Foil w={110} h={150} seed={seed + 3} n={5} />
      <FlagDecal kind="russia" w={56} y={20} z={0.003} />
    </Part>
    <Part shape={roundRect(290, 30, 8)} color="#b9bcc4" flat outline={5} y={336} z={0.004} />
    {[-1, 1].map((sd) => (
      <SolarPanel key={`p${sd}`} w={110} h={64} cols={3} rows={2} x={sd * 88} y={378} rot={sd * -0.12} z={0.005} />
    ))}
    <Line pts={[[0, 350], [0, 430]]} width={7} color="#9a9ea8" z={0.004} />
    <Part shape={circle(12)} color={WHITE} flat outline={4} y={434} z={0.005} />
    {[-1, 1].map((sd) => (
      <React.Fragment key={`f${sd}`}>
        <Strut a={[sd * 170, 160]} b={[sd * 240, 22]} w={15} z={0.01} />
        <Part shape={ellipse(40, 12)} color="#b9bcc4" flat outline={5} x={sd * 243} y={10} z={0.011} />
      </React.Fragment>
    ))}
  </X>
);

/** Intuitive Machines' Nova-C (Odysseus / Athena): tall hexagonal lander on six legs, blue methalox flame. */
export const NovaC: React.FC<XProps & { thrust?: number; seed?: number; variant?: "odysseus" | "athena" }> = ({ thrust = 0, seed = 3, variant = "odysseus", ...xf }) => {
  const accent = variant === "athena" ? "#e07a2a" : "#2f6fd0";
  return (
    <X {...xf}>
      {[-1, 1].map((sd) => (
        <React.Fragment key={`b${sd}`}>
          <Strut a={[sd * 40, 130]} b={[sd * 80, 18]} w={11} color="#9a9ea8" z={-0.02} />
          <Part shape={ellipse(24, 8)} color="#8a8e98" flat outline={4} x={sd * 82} y={9} z={-0.019} />
        </React.Fragment>
      ))}
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
      {[-1, 1].map((sd) => (
        <React.Fragment key={`f${sd}`}>
          <Strut a={[sd * 100, 150]} b={[sd * 175, 20]} w={14} z={0.01} />
          <Part shape={ellipse(34, 11)} color="#b9bcc4" flat outline={5} x={sd * 178} y={10} z={0.011} />
        </React.Fragment>
      ))}
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

/** Chandrayaan-1 orbiter: gold cube, solar panel on a boom, dish antenna; `beam` instrument cone below. Origin = centre. */
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
      <Line pts={[[110, 0], [170, 0]]} width={12} color="#8a8e98" z={-0.002} />
      <SolarPanel w={170} h={300} cols={3} rows={5} x={260} z={-0.001} />
      <Line pts={[[-110, 50], [-170, 80]]} width={10} color="#8a8e98" z={-0.002} />
      <Part shape={ellipse(72, 24)} color={WHITE} shade={0.3} x={-190} y={92} rot={-0.6} z={-0.001} />
      <Part shape={roundRect(220, 220, 14)} color={GOLD} shade={0.3}>
        <Foil w={200} h={200} n={10} seed={5} />
        <Part shape={roundRect(222, 26, 6)} color={SILVER} flat outline={4} y={80} z={0.002} />
        {flag ? <FlagDecal kind="india" w={64} x={-40} y={-30} z={0.003} /> : null}
      </Part>
      <Part shape={roundRect(90, 46, 8)} color="#b9bcc4" flat outline={5} y={-132} z={0.001} />
      <Part shape={roundRect(50, 30, 6)} color="#7a7e88" flat outline={4} x={70} y={-124} z={0.001} />
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

/** China's Chang'e lander: silver body, gold skirt, two upturned solar wings, camera mast; `ascender` on top lifts by `lift` px with `thrust`. */
export const ChangELander: React.FC<XProps & { ascender?: boolean; lift?: number; thrust?: number; flag?: boolean; dust?: number }> = ({ ascender = false, lift = 0, thrust = 0, flag = true, dust = 0, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((sd) => (
      <React.Fragment key={`b${sd}`}>
        <Strut a={[sd * 80, 160]} b={[sd * 150, 20]} w={12} color="#9a9ea8" z={-0.02} />
        <Part shape={ellipse(30, 9)} color="#8a8e98" flat outline={4} x={sd * 152} y={10} z={-0.019} />
      </React.Fragment>
    ))}
    {[-1, 1].map((sd) => (
      <SolarPanel key={`w${sd}`} w={64} h={240} cols={1} rows={5} x={sd * 222} y={352} rot={sd * -0.55} z={-0.005} />
    ))}
    <Part shape={roundRect(330, 60, 10)} color={GOLD} flat outline={5} y={168} z={-0.001}>
      <Foil w={300} h={50} n={6} seed={6} />
    </Part>
    <Part shape={roundRect(330, 140, 12)} color="#e6e7ea" shade={0.3} y={262}>
      {flag ? <FlagDecal kind="china" w={62} x={-100} y={4} z={0.003} /> : null}
      <Part shape={roundRect(70, 40, 6)} color="#9aa0aa" flat outline={4} x={90} z={0.002} />
    </Part>
    <Line pts={[[120, 330], [120, 420]]} width={8} color="#9a9ea8" z={0.002} />
    <Part shape={roundRect(46, 28, 6)} color="#d9dce2" flat outline={4} x={120} y={430} z={0.003} />
    {ascender ? (
      <X y={378 + lift} z={0.004}>
        <Exhaust y={-36} len={260 * thrust} w={44} k={thrust > 0.02 ? 1 : 0} color="#ffc58a" glow={0.5} z={-0.01} />
        <Part shape={roundRect(160, 80, 12)} color={GOLD} shade={0.3}>
          <Foil w={140} h={60} n={4} seed={7} />
        </Part>
        <Part shape={roundRect(70, 30, 6)} color={WHITE} flat outline={4} y={50} z={0.001} />
        <Part shape={poly([[-16, -40], [16, -40], [22, -58], [-22, -58]])} color="#2a2a30" flat outline={4} z={-0.001} />
      </X>
    ) : null}
    {[-1, 1].map((sd) => (
      <React.Fragment key={`f${sd}`}>
        <Strut a={[sd * 155, 170]} b={[sd * 245, 22]} w={15} z={0.01} />
        <Part shape={ellipse(40, 12)} color="#b9bcc4" flat outline={5} x={sd * 248} y={10} z={0.011} />
      </React.Fragment>
    ))}
    <LandingDust k={dust} z={0.02} />
  </X>
);

/** Yutu-style rover: six wheels, gold body, two solar wings, camera mast. */
export const YutuRover: React.FC<XProps & { roll?: number }> = ({ roll = 0, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((sd) => (
      <SolarPanel key={sd} w={150} h={22} cols={4} rows={1} x={sd * 140} y={128} rot={sd * 0.28} z={-0.002} />
    ))}
    <Part shape={roundRect(210, 74, 10)} color={GOLD} shade={0.3} y={92}>
      <Foil w={190} h={60} n={5} seed={8} />
    </Part>
    <Line pts={[[64, 128], [64, 196]]} width={7} color="#9a9ea8" z={0.001} />
    <Part shape={roundRect(60, 30, 8)} color="#e6e7ea" flat outline={4} x={64} y={206} z={0.002} />
    <Part shape={circle(6)} color="#2a2a30" flat outline={0} x={84} y={206} z={0.003} />
    {[-80, 0, 80].map((x) => (
      <X key={x} x={x} y={28} rot={-roll} z={0.003}>
        <Part shape={circle(28)} color="#5a5a64" flat outline={5} />
        <Line pts={[[-18, 0], [18, 0]]} width={4} color="#9aa0aa" z={0.001} />
        <Line pts={[[0, -18], [0, 18]]} width={4} color="#9aa0aa" z={0.001} />
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

/** Vertical solar mast (tracks a low Sun). Origin = foot. `turn` −1..1 turns the panel edge-on. */
export const SolarMast: React.FC<XProps & { h?: number; turn?: number }> = ({ h = 520, turn = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(16, h, 6)} color="#b9bcc4" flat outline={4} y={h / 2} />
    <X y={h * 0.62} sx={Math.max(0.12, Math.cos(turn * 1.4))} z={0.001}>
      <SolarPanel w={170} h={ri(h * 0.62)} cols={3} rows={5} />
    </X>
    <Part shape={roundRect(70, 20, 6)} color="#8a8e98" flat outline={4} y={10} z={0.002} />
  </X>
);

/** Moon base: inflatable domes, a module, solar masts, dish; `lights` windows. Origin = ground centre. */
export const MoonBase: React.FC<XProps & { lights?: number; flag?: FlagKind | null; masts?: number; turn?: number }> = ({ lights = 0.6, flag = null, masts = 3, turn = 0, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      {Array.from({ length: masts }, (_, i) => (
        <SolarMast key={i} x={-620 - i * 190} h={500 + (i % 2) * 80} turn={turn} z={-0.02 + i * 0.001} />
      ))}
      <Part shape={roundRect(420, 120, 50)} color={WHITE} shade={0.3} x={60} y={70} z={-0.005}>
        {[-120, -40, 40, 120].map((x) => (
          <Part key={x} shape={roundRect(30, 24, 6)} color="#ffd88a" flat outline={4} x={x} y={10} opacity={0.4 + 0.6 * lights} z={0.001} />
        ))}
      </Part>
      {[
        [-260, 260],
        [330, 200],
      ].map(([x, r], i) => (
        <X key={i} x={x} z={i * 0.001}>
          <Part shape={blob([[-r, 0], [-r * 0.92, r * 0.5], [-r * 0.5, r * 0.88], [0, r], [r * 0.5, r * 0.88], [r * 0.92, r * 0.5], [r, 0]], 8)} color="#f2f2f4" shade={0.32}>
            {[-0.5, 0, 0.5].map((k) => (
              <Line key={k} pts={[[k * r * 0.9, 4], [k * r * 0.62, r * 0.7], [0, r * 0.98]]} smooth width={4} color="#c9ccd3" z={0.001} />
            ))}
            <Part shape={roundRect(r * 0.5, r * 0.16, 10)} color="#ffd88a" flat outline={4} y={r * 0.45} opacity={0.4 + 0.6 * lights} z={0.002} />
            <Part shape={roundRect(r * 0.36, r * 0.42, 14)} color="#9aa0aa" flat outline={4} y={r * 0.2} x={r * 0.48} z={0.002} />
          </Part>
          {lights > 0 ? <Glow rx={r * 0.7} ry={r * 0.3} y={r * 0.45} color="#ffd88a" alpha={0.25 * lights * (0.9 + 0.1 * Math.sin(frame * 0.1 + i))} additive z={0.01} /> : null}
        </X>
      ))}
      <Line pts={[[620, 0], [620, 230]]} width={10} color="#9a9ea8" z={0.002} />
      <Part shape={ellipse(80, 28)} color={WHITE} shade={0.3} x={620} y={250} rot={-0.4} z={0.003} />
      {flag ? <NationFlag kind={flag} w={150} pole={360} x={460} z={0.004} /> : null}
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
