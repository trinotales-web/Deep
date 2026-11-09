import React from "react";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, GroundShadow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { shadeHex } from "../style";

// Side-view vehicles (front toward +x). Origin = ground point under the car's
// centre. `spin` turns the wheels (radians).

export const CarWheel: React.FC<XProps & { r?: number; spin?: number; rim?: string }> = ({ r = 58, spin = 0, rim = "#b9bec6", ...xf }) => (
  <X {...xf}>
    <Part shape={circle(r)} color="#2a2a30" shade={0.15} />
    <Part shape={circle(r * 0.6)} color={rim} shade={0.2} z={0.001} />
    <X rot={spin} z={0.002}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return <Line key={i} pts={[[Math.cos(a) * r * 0.15, Math.sin(a) * r * 0.15], [Math.cos(a) * r * 0.52, Math.sin(a) * r * 0.52]]} width={4} color={shadeHex(rim, 0.45)} />;
      })}
    </X>
    <Part shape={circle(r * 0.16)} color={shadeHex(rim, 0.3)} flat outline={3} z={0.003} />
  </X>
);

const Headlight: React.FC<XProps & { on?: number }> = ({ on = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={ellipse(16, 9)} color="#fff4c8" flat outline={3} />
    {on > 0 ? <Glow rx={160} ry={60} x={110} color="#fff2c6" alpha={0.35 * on} additive z={-0.01} /> : null}
  </X>
);

/** 2008 Tesla Roadster: low open two-seater. `children` sit in the cockpit (origin at the seat). */
export const Roadster: React.FC<XProps & { color?: string; spin?: number; lights?: number; shadow?: boolean; children?: React.ReactNode }> = ({
  color = "#c8262f",
  spin = 0,
  lights = 0,
  shadow = true,
  children,
  ...xf
}) => (
  <X {...xf}>
    {shadow ? <GroundShadow w={620} y={2} z={-0.05} /> : null}
    {children ? <X x={-40} y={92} z={-0.7}>{children}</X> : null}
    <Part
      shape={blob([[-290, 36], [-296, 92], [-250, 128], [-110, 136], [-70, 112], [70, 114], [150, 118], [250, 96], [304, 70], [300, 36]], 8)}
      color={color}
      shade={0.22}
      z={0.01}
    >
      <Line pts={[[-250, 82], [-120, 92], [40, 92], [200, 80]]} smooth width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
      <Part shape={roundPoly([[-40, 74], [10, 74], [6, 52], [-36, 52]], 4)} color={shadeHex(color, 0.3)} flat outline={3} z={0.001} />
    </Part>
    {/* windscreen frame */}
    <Line pts={[[66, 112], [20, 176], [-10, 178]]} width={7} color="#2a2a30" z={0.012} />
    <Part shape={poly([[64, 112], [18, 172], [0, 172], [30, 112]])} color="#a9d6ee" flat outline={0} opacity={0.55} z={0.011} />
    {/* seat backs */}
    <Part shape={roundRect(26, 60, 10)} color="#2a2228" shade={0.2} x={-108} y={136} rot={-0.25} z={0.0008} />
    <Headlight x={286} y={84} on={lights} z={0.02} />
    <Part shape={roundRect(20, 12, 4)} color="#e2402f" flat outline={3} x={-288} y={98} z={0.02} />
    <CarWheel x={-185} y={56} r={56} spin={spin} z={0.03} />
    <CarWheel x={190} y={56} r={56} spin={spin} z={0.03} />
  </X>
);

/** Electric four-door saloon (Model S) or the smaller Model 3 (`small`). */
export const SedanEV: React.FC<XProps & { color?: string; spin?: number; lights?: number; small?: boolean; shadow?: boolean }> = ({
  color = "#d8dde4",
  spin = 0,
  lights = 0,
  small = false,
  shadow = true,
  ...xf
}) => {
  const L = small ? 0.9 : 1;
  return (
    <X {...xf} sx={(xf.sx ?? 1) * L}>
      {shadow ? <GroundShadow w={680} y={2} z={-0.05} /> : null}
      <Part
        shape={blob([[-320, 40], [-326, 104], [-260, 130], [-150, 196], [40, 204], [140, 150], [290, 120], [330, 84], [326, 40]], 8)}
        color={color}
        shade={0.22}
      >
        <Line pts={[[-40, 136], [-34, 52]]} width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
        <Line pts={[[110, 130], [116, 54]]} width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
        <Part shape={roundRect(30, 8, 4)} color={shadeHex(color, 0.3)} flat outline={2.5} x={-80} y={112} z={0.001} />
        <Part shape={roundRect(30, 8, 4)} color={shadeHex(color, 0.3)} flat outline={2.5} x={70} y={112} z={0.001} />
      </Part>
      <Part shape={roundPoly([[-240, 132], [-140, 188], [30, 192], [120, 140]], [10, 30, 30, 10])} color="#2f3a4c" flat outline={4} z={0.001}>
        <Line pts={[[-46, 136], [-40, 190]]} width={6} color={color} z={0.001} />
        <Part shape={poly([[-150, 182], [-90, 186], [-130, 140]])} color="#ffffff" flat outline={0} opacity={0.18} z={0.001} />
      </Part>
      <Headlight x={312} y={96} on={lights} z={0.02} />
      <Part shape={roundRect(26, 12, 5)} color="#e2402f" flat outline={3} x={-318} y={108} z={0.02} />
      <CarWheel x={-205} y={58} r={58} spin={spin} z={0.03} />
      <CarWheel x={205} y={58} r={58} spin={spin} z={0.03} />
    </X>
  );
};

const Cracks: React.FC<XProps & { k: number; r?: number }> = ({ k, r = 90, ...xf }) => {
  if (k <= 0.01) return null;
  const arms = [0.2, 1.1, 1.9, 2.6, 3.5, 4.3, 5.2, 5.8];
  return (
    <X {...xf}>
      {arms.map((a, i) => {
        const L = r * (0.6 + (i % 3) * 0.25) * Math.min(1, k * 1.4);
        const m = 0.45;
        return (
          <Line
            key={i}
            pts={[[0, 0], [Math.cos(a) * L * m + Math.sin(a) * 8, Math.sin(a) * L * m - Math.cos(a) * 8], [Math.cos(a) * L, Math.sin(a) * L]]}
            width={3.5}
            color="#f4f6f8"
          />
        );
      })}
      <Part shape={circle(r * 0.22 * Math.min(1, k * 2))} color="#e8eef4" flat outline={2.5} />
      {k > 0.4 ? <Part shape={circle(r * 0.5)} color="#ffffff" flat outline={0} opacity={0.12} z={-0.001} /> : null}
    </X>
  );
};

/** Cybertruck: angular stainless wedge. `crack` / `crack2` shatter the front / rear side windows. */
export const Cybertruck: React.FC<XProps & { spin?: number; crack?: number; crack2?: number; lights?: number; shadow?: boolean }> = ({
  spin = 0,
  crack = 0,
  crack2 = 0,
  lights = 0,
  shadow = true,
  ...xf
}) => {
  const steel = "#c5cad1";
  return (
    <X {...xf}>
      {shadow ? <GroundShadow w={720} y={2} z={-0.05} /> : null}
      <Part shape={poly([[-350, 44], [-350, 150], [10, 262], [350, 150], [356, 70], [330, 44]])} color={steel} shade={0.22}>
        <Line pts={[[-350, 120], [356, 120]]} width={3} color="#9aa0aa" z={0.001} />
        <Line pts={[[-30, 116], [-26, 54]]} width={3} color="#9aa0aa" z={0.001} />
        <Line pts={[[130, 116], [134, 54]]} width={3} color="#9aa0aa" z={0.001} />
      </Part>
      {/* window band */}
      <Part shape={poly([[-210, 160], [10, 236], [250, 164], [240, 140], [-200, 140]])} color="#2a3242" flat outline={4} z={0.001}>
        <Line pts={[[-40, 140], [-40, 196]]} width={7} color={steel} z={0.001} />
        <Line pts={[[120, 140], [120, 200]]} width={7} color={steel} z={0.001} />
      </Part>
      <Cracks k={crack} x={40} y={172} r={70} z={0.003} />
      <Cracks k={crack2} x={-120} y={162} r={60} z={0.003} />
      {/* light bar */}
      <Part shape={roundRect(30, 8, 3)} color="#f6f2e0" flat outline={2.5} x={344} y={150} rot={-0.35} z={0.004} />
      {lights > 0 ? <Glow rx={180} ry={50} x={460} y={140} color="#fff2c6" alpha={0.3 * lights} additive z={-0.01} /> : null}
      {/* wheel arches */}
      {[-210, 220].map((x) => (
        <Part key={x} shape={poly([[x - 90, 44], [x - 70, 120], [x + 70, 120], [x + 90, 44]])} color="#3a3a42" flat outline={4} z={0.002} />
      ))}
      <CarWheel x={-210} y={62} r={62} spin={spin} z={0.03} />
      <CarWheel x={220} y={62} r={62} spin={spin} z={0.03} />
    </X>
  );
};

/** McLaren-style supercar (low, long). `wreck` 0..1 dents and breaks it; `glass` < 1 shows the cabin. */
export const Supercar: React.FC<XProps & { color?: string; spin?: number; wreck?: number; shadow?: boolean; glass?: number }> = ({ color = "#c8ccd2", spin = 0, wreck = 0, shadow = true, glass = 1, ...xf }) => (
  <X {...xf}>
    {shadow ? <GroundShadow w={660} y={2} z={-0.05} /> : null}
    <X rot={wreck * 0.04}>
      <Part
        shape={blob([[-310, 40], [-316, 100], [-240, 122], [-120, 130], [-40, 176], [80, 172], [150, 124], [280, 92], [322, 64], [318, 40]], 8)}
        color={wreck > 0.5 ? shadeHex(color, 0.12) : color}
        shade={0.22}
      >
        <Line pts={[[-300, 86], [-60, 98], [300, 74]]} smooth width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
        <Part shape={roundPoly([[-150, 100], [-70, 104], [-80, 70], [-140, 70]], 6)} color="#2a2a30" flat outline={3} z={0.001} />
      </Part>
      <Part shape={roundPoly([[-110, 132], [-40, 170], [70, 168], [130, 126]], [8, 26, 26, 8])} color="#2f3a4c" flat outline={4} opacity={glass} z={0.001} />
      <Part shape={roundRect(110, 14, 5)} color={shadeHex(color, 0.2)} flat outline={3.5} x={-270} y={140} z={0.002} />
      <Line pts={[[-250, 124], [-262, 140]]} width={6} color="#2a2a30" z={0.0015} />
      <Headlight x={300} y={78} z={0.02} />
      {wreck > 0 ? (
        <X z={0.02}>
          {([[-200, 90, 30], [40, 120, 26], [220, 74, 34], [-60, 70, 22]] as [number, number, number][]).map(([x, y, r], i) => (
            <Part key={i} shape={blob([[-r, 0], [-r * 0.4, r * 0.6], [r * 0.6, r * 0.4], [r, -r * 0.2], [r * 0.2, -r * 0.6], [-r * 0.6, -r * 0.5]], 6)} color={shadeHex(color, 0.45)} flat outline={3} x={x} y={y} opacity={Math.min(1, wreck * 1.5)} />
          ))}
          <Line pts={[[-120, 140], [-80, 120], [-96, 104], [-60, 90]]} width={4} color="#2a2228" opacity={wreck} />
          <Line pts={[[120, 120], [150, 104], [140, 90]]} width={4} color="#2a2228" opacity={wreck} />
        </X>
      ) : null}
    </X>
    <CarWheel x={-200} y={54} r={54} spin={spin} z={0.03} rot={wreck * 0.3} />
    <CarWheel x={205} y={54} r={54} spin={spin} z={0.03} />
  </X>
);

/** Two-door robotaxi (no steering wheel, no driver). */
export const Robotaxi: React.FC<XProps & { color?: string; spin?: number; lights?: number; shadow?: boolean }> = ({ color = "#d9c9a2", spin = 0, lights = 0, shadow = true, ...xf }) => (
  <X {...xf}>
    {shadow ? <GroundShadow w={560} y={2} z={-0.05} /> : null}
    <Part shape={blob([[-260, 40], [-268, 110], [-150, 190], [40, 200], [190, 140], [272, 96], [268, 40]], 8)} color={color} shade={0.22}>
      <Line pts={[[30, 130], [36, 52]]} width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
    </Part>
    <Part shape={roundPoly([[-180, 132], [-120, 184], [40, 188], [150, 136]], [10, 30, 30, 10])} color="#2f3a4c" flat outline={4} z={0.001}>
      <Part shape={roundRect(30, 46, 10)} color="#5a5a62" flat outline={3} x={-40} y={150} z={0.001} />
    </Part>
    <Part shape={roundRect(120, 8, 4)} color="#f6f2e0" flat outline={2.5} x={220} y={110} rot={-0.4} z={0.002} />
    {lights > 0 ? <Glow rx={150} ry={50} x={330} y={100} color="#fff2c6" alpha={0.3 * lights} additive z={-0.01} /> : null}
    <CarWheel x={-160} y={54} r={54} spin={spin} z={0.03} />
    <CarWheel x={170} y={54} r={54} spin={spin} z={0.03} />
  </X>
);

/** Airliner (side view, nose +x). Origin = fuselage centre. */
export const Airliner: React.FC<XProps & { stripe?: string; tail?: string }> = ({ stripe = "#2f6fa8", tail = "#2f6fa8", ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-460, -40], [-470, 20], [-380, 52], [380, 52], [452, 30], [470, 0], [452, -30], [380, -48], [-380, -48]], 8)} color="#f4f5f7" shade={0.2}>
      <Part shape={roundRect(860, 14, 6)} color={stripe} flat outline={0} y={-12} z={0.001} />
      {Array.from({ length: 16 }, (_, i) => (
        <Part key={i} shape={roundRect(14, 18, 6)} color="#2f3a4c" flat outline={2.5} x={-330 + i * 44} y={14} z={0.001} />
      ))}
      <Part shape={roundPoly([[400, 14], [444, 14], [436, 34], [404, 34]], 4)} color="#2f3a4c" flat outline={3} z={0.001} />
    </Part>
    <Part shape={roundPoly([[-470, 20], [-330, 40], [-410, 220], [-470, 220]], 10)} color={tail} shade={0.2} z={-0.001} />
    <Part shape={roundPoly([[-60, -30], [90, -30], [-90, -150], [-150, -150]], 8)} color="#c8ccd4" shade={0.2} z={0.002} />
    <Part shape={roundRect(110, 46, 20)} color="#b9bec6" shade={0.22} x={-40} y={-80} z={0.003} />
  </X>
);

/** Small high-wing propeller plane (nose +x). Origin = ground under the fuselage. */
export const SmallPlane: React.FC<XProps & { color?: string; stripe?: string; prop?: number }> = ({ color = "#f4f1ea", stripe = "#c8262f", prop = 0, ...xf }) => (
  <X {...xf}>
    <GroundShadow w={420} y={2} z={-0.05} />
    <Part shape={blob([[-240, 110], [-250, 150], [-120, 150], [120, 160], [190, 150], [200, 110], [120, 90], [-120, 100]], 8)} color={color} shade={0.2} y={0}>
      <Part shape={roundRect(400, 12, 5)} color={stripe} flat outline={0} y={122} z={0.001} />
      <Part shape={roundPoly([[60, 150], [130, 150], [110, 186], [70, 186]], 6)} color="#2f3a4c" flat outline={3.5} z={0.001} />
    </Part>
    <Part shape={roundRect(380, 22, 10)} color={color} shade={0.2} x={50} y={196} z={0.002} />
    <Line pts={[[70, 192], [40, 140]]} width={6} z={0.001} />
    <Part shape={roundPoly([[-250, 140], [-200, 150], [-236, 250], [-262, 250]], 8)} color={stripe} shade={0.2} z={-0.001} />
    <X x={206} y={126} z={0.003}>
      <Part shape={roundRect(14, 30, 6)} color="#3a3a42" flat outline={3} />
      <Part shape={ellipse(10, 90 * Math.abs(Math.cos(prop)) + 8)} color="#5a5a62" flat outline={3} opacity={0.75} x={8} />
    </X>
    <Line pts={[[-30, 100], [-40, 30]]} width={6} z={-0.001} />
    <Line pts={[[110, 96], [120, 30]]} width={6} z={-0.001} />
    <CarWheel x={-40} y={26} r={26} z={0.004} />
    <CarWheel x={120} y={26} r={26} z={0.004} />
  </X>
);

/** Wheelchair, side view (facing +x). Seat origin = ground. Sit a character at (x≈-10, y≈96). */
export const Wheelchair: React.FC<XProps & { color?: string }> = ({ color = "#3a5a8a", ...xf }) => (
  <X {...xf}>
    <GroundShadow w={300} y={2} z={-0.05} />
    <Line pts={[[-60, 210], [-70, 90], [60, 90], [90, 30]]} width={8} color={color} z={0.04} />
    <Part shape={roundRect(140, 18, 6)} color="#2a2a30" flat outline={3} y={96} z={0.041} />
    <CarWheel x={-30} y={70} r={70} rim="#c9ced6" z={0.045} />
    <CarWheel x={96} y={18} r={18} z={0.045} />
    <Part shape={ellipse(76, 76)} color="#000000" flat outline={0} opacity={0} />
  </X>
);
