import React from "react";
import { C, Layer, Ink, Crayon, circle, ellipse, limb, cloudPad, spiral } from "./style";

const rad = (d) => (d * Math.PI) / 180;
const rot = ([x, y], deg, [ox, oy] = [0, 0]) => {
  const r = rad(deg);
  const dx = x - ox;
  const dy = y - oy;
  return [ox + dx * Math.cos(r) - dy * Math.sin(r), oy + dx * Math.sin(r) + dy * Math.cos(r)];
};

// Two-bone IK: shoulder -> elbow -> hand, elbow bent to one side.
export const ik = (s, target, l1, l2, bend = 1) => {
  let [tx, ty] = target;
  let dx = tx - s[0];
  let dy = ty - s[1];
  let d = Math.hypot(dx, dy) || 0.01;
  const max = l1 + l2 - 0.5;
  if (d > max) {
    tx = s[0] + (dx / d) * max;
    ty = s[1] + (dy / d) * max;
    d = max;
    dx = tx - s[0];
    dy = ty - s[1];
  }
  const a = Math.atan2(dy, dx);
  const b = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const ea = a - bend * b;
  return [s, [s[0] + Math.cos(ea) * l1, s[1] + Math.sin(ea) * l1], [tx, ty]];
};

const arm = (pts, color, w0 = 24, w1 = 19, handR = 9) => [
  { d: limb(pts, w0, w1), fill: color },
  { d: circle(pts[2][0], pts[2][1], handR), fill: C.skin },
];

// ---------------------------------------------------------------- Ryōkan

const monkFace = (hx, hy, eyes, look = 0) => {
  const parts = [
    { d: ellipse(hx - 30, hy + 2, 7, 10), fill: C.skin },
    { d: circle(hx, hy, 36), fill: C.skin },
    { d: `M ${hx - 34} ${hy - 8} Q ${hx - 30} ${hy - 38} ${hx} ${hy - 37} Q ${hx + 30} ${hy - 37} ${hx + 33} ${hy - 10} Q ${hx} ${hy - 26} ${hx - 34} ${hy - 8} Z`, fill: C.scalp, alpha: 0.55, line: false },
    { d: ellipse(hx - 6, hy + 14, 7, 5), fill: C.blush, alpha: 0.85, line: false },
    { d: ellipse(hx + 30, hy + 13, 5, 4.5), fill: C.blush, alpha: 0.85, line: false },
    // soft white brows of an old monk
    { d: `M ${hx - 8} ${hy - 14} Q ${hx + 2} ${hy - 19} ${hx + 9} ${hy - 13}`, w: 3, stroke: C.inkSoft },
    { d: `M ${hx + 20} ${hy - 13} Q ${hx + 26} ${hy - 17} ${hx + 31} ${hy - 12}`, w: 3, stroke: C.inkSoft },
    { d: `M ${hx + 8} ${hy + 18} Q ${hx + 14} ${hy + 24} ${hx + 21} ${hy + 18}`, w: 2.8 },
    { d: `M ${hx + 34} ${hy + 2} q 5 3 1 7`, w: 2.6 },
  ];
  const eye = (ex, ey, kind, r) => {
    if (kind === "closed") return [{ d: `M ${ex - 6} ${ey} Q ${ex} ${ey + 6} ${ex + 6} ${ey}`, w: 3 }];
    return [
      { d: circle(ex + look, ey, r), inkFill: C.ink },
      { d: circle(ex + look + 1.4, ey - 1.6, r * 0.32), inkFill: "#FFFFFF" },
    ];
  };
  const [eL, eR] = Array.isArray(eyes) ? eyes : [eyes, eyes];
  parts.push(...eye(hx + 2, hy - 2, eL, 4.6), ...eye(hx + 25, hy - 2, eR, 4));
  return parts;
};

export const MonkSeiza = ({ x, y, s = 1, eyes = "closed", breath = 0, look = 0, headTilt = 0, wave = null }) => {
  const by = 1 + breath * 0.014;
  const sleeve = wave === null
    ? [
      { d: "M -4 -116 C -24 -92 -16 -60 14 -52 L 50 -50 C 58 -56 52 -66 40 -66 L 20 -68 C 6 -78 8 -98 12 -114 Z", fill: C.robe },
      { d: ellipse(56, -56, 11, 9), fill: C.skin },
    ]
    : arm(ik([16, -108], [92 + Math.sin(wave) * 10, -178], 44, 40, -1), C.robe);
  const body = [
    { d: "M -66 0 C -78 -42 -66 -102 -30 -122 Q -6 -132 18 -122 C 40 -110 46 -84 42 -58 C 66 -54 92 -38 96 -12 Q 98 0 84 0 Z", fill: C.robe },
    { d: "M -26 -124 Q -10 -130 6 -126 L 48 -62 L 36 -44 Z", fill: C.kesa },
    { d: "M -14 -124 L 2 -100 L 14 -122 Z", fill: C.under },
    { d: "M -46 -18 Q -40 -56 -46 -86", w: 2.4, inkAlpha: 0.55 },
    { d: "M 60 -30 Q 74 -24 84 -10", w: 2.4, inkAlpha: 0.55 },
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`scale(1 ${by})`}>
        <Layer parts={body} />
        <g transform={`rotate(${headTilt} -2 -130)`}>
          <Layer parts={monkFace(-2, -160, eyes, look)} />
        </g>
        <Layer parts={sleeve} />
      </g>
    </g>
  );
};

// Standing Ryōkan. `front`/`back` are hand targets in local coordinates.
export const MonkStand = ({ x, y, s = 1, dress = "robe", eyes = "closed", front = [36, -112], back = [26, -116], bob = 0, look = 0, headTilt = 0, children }) => {
  const robe = dress === "robe" ? C.robe : C.under;
  const shF = [16, -172];
  const shB = [-16, -174];
  const armF = ik(shF, front, 44, 40, -1);
  const armB = ik(shB, back, 44, 40, -1);
  const body = [
    { d: "M -34 -184 Q 0 -194 32 -184 C 42 -130 50 -70 54 -16 Q 0 -6 -54 -16 C -50 -70 -44 -130 -34 -184 Z", fill: robe },
    dress === "robe"
      ? { d: "M -34 -182 Q -20 -190 -8 -188 L 52 -78 L 52 -52 Z", fill: C.kesa }
      : { d: "M -50 -104 Q 0 -96 48 -106 L 49 -92 Q 0 -82 -51 -90 Z", fill: "#C9CCDA" },
    { d: "M -14 -186 L 2 -160 L 16 -186 Z", fill: dress === "robe" ? C.under : "#ECE6D6" },
    { d: "M -20 -60 Q -18 -36 -22 -16", w: 2.4, inkAlpha: 0.5 },
    { d: "M 22 -70 Q 26 -40 24 -16", w: 2.4, inkAlpha: 0.5 },
  ];
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <Layer parts={[
        { d: ellipse(-18, -7, 15, 7), fill: C.skin },
        { d: ellipse(22, -7, 15, 7), fill: C.skin },
        { d: "M -30 -4 L -4 -4", w: 2.6 },
        { d: "M 10 -4 L 36 -4", w: 2.6 },
      ]} />
      <Layer parts={arm(armB, robe)} />
      <Layer parts={body} />
      {children}
      <Layer parts={arm(armF, robe)} />
      <g transform={`rotate(${headTilt} 0 -190)`}>
        <Layer parts={monkFace(0, -222, eyes, look)} />
      </g>
    </g>
  );
};

// Ryōkan seen from behind, writing at his desk under the window.
export const MonkBack = ({ x, y, s = 1, brush = 0 }) => {
  const hand = [104 + Math.sin(brush) * 8, -70 + Math.cos(brush * 1.3) * 3];
  const armF = ik([46, -116], hand, 50, 46, -1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Layer parts={[
        { d: "M -76 0 C -86 -50 -70 -120 -36 -146 Q 0 -160 36 -146 C 70 -120 86 -50 76 0 Z", fill: C.under },
        { d: "M -64 -60 Q 0 -50 64 -60 L 66 -46 Q 0 -36 -66 -46 Z", fill: "#C9CCDA" },
        { d: "M -30 -40 Q -26 -16 -32 0", w: 2.4, inkAlpha: 0.5 },
        { d: "M 26 -36 Q 30 -14 26 0", w: 2.4, inkAlpha: 0.5 },
        { d: ellipse(-36, -172, 8, 11), fill: C.skin },
        { d: ellipse(36, -172, 8, 11), fill: C.skin },
        { d: circle(0, -180, 37), fill: C.skin },
        { d: "M -35 -186 Q -30 -216 0 -217 Q 30 -216 35 -186 Q 0 -200 -35 -186 Z", fill: C.scalp, alpha: 0.6, line: false },
        { d: "M -4 -150 Q 0 -146 4 -150", w: 2.4, inkAlpha: 0.6 },
      ]} />
      <Layer parts={[
        ...arm(armF, C.under, 24, 19, 9),
        { d: limb([[hand[0] + 2, hand[1] - 6], [hand[0] + 12, hand[1] + 26]], 5, 4), fill: C.woodDark },
        { d: ellipse(hand[0] + 12, hand[1] + 28, 3.5, 5), inkFill: C.ink },
      ]} />
    </g>
  );
};

// The robe as a held piece of cloth hanging between two hands.
export const RobeCloth = ({ a, b, len = 110, sway = 0 }) => {
  const [ax, ay] = a;
  const [bx, by] = b;
  const lo = Math.max(ay, by);
  const sw = sway;
  const f = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const d = [
    `M ${f(bx, by)} L ${f(ax, ay)}`,
    `L ${f(ax + 20 + sw * 0.4, ay + 8)} L ${f(ax + 22 + sw * 0.6, ay + 58)} L ${f(ax + 4 + sw * 0.6, ay + 62)}`,
    `C ${f(ax + 6 + sw, lo + len * 0.6)}, ${f(ax + 8 + sw * 1.2, lo + len * 0.8)}, ${f(ax + 6 + sw * 1.5, lo + len)}`,
    `Q ${f((ax + bx) / 2 + sw * 1.5, lo + len + 8)} ${f(bx - 6 + sw * 1.5, lo + len)}`,
    `C ${f(bx - 8 + sw * 1.2, lo + len * 0.8)}, ${f(bx - 6 + sw, lo + len * 0.6)}, ${f(bx - 4 + sw * 0.6, by + 62)}`,
    `L ${f(bx - 22 + sw * 0.6, by + 58)} L ${f(bx - 20 + sw * 0.4, by + 8)} Z`,
  ].join(" ");
  const mx = (ax + bx) / 2;
  const kesa = `M ${f(bx + 2, by + 4)} L ${f(bx + 16, by + 2)} L ${f(ax + 4 + sw * 1.2, lo + len * 0.75)} L ${f(ax + 2 + sw * 1.3, lo + len * 0.9)} Z`;
  return (
    <Layer parts={[
      { d, fill: C.robe },
      { d: kesa, fill: C.kesa },
      { d: `M ${f(mx - 12, (ay + by) / 2)} L ${f(mx + sw * 0.5, (ay + by) / 2 + 30)} L ${f(mx + 12, (ay + by) / 2)}`, w: 2.4 },
      { d: `M ${f(mx + sw * 0.5, (ay + by) / 2 + 30)} L ${f(mx + sw * 1.4, lo + len)}`, w: 2.2, inkAlpha: 0.6 },
    ]} />
  );
};

// ---------------------------------------------------------------- the thief

const thiefHead = (eyes) => {
  const big = eyes === "wide";
  const er = big ? 5.6 : 4.2;
  return [
    { d: circle(0, 0, 31), fill: C.thiefCloth },
    { d: "M 2 -13 Q 24 -19 33 -5 Q 34 9 17 9 Q 2 8 0 -2 Z", fill: C.skin },
    { d: circle(14, -3, er), inkFill: C.ink },
    { d: circle(25, -3, er * 0.86), inkFill: C.ink },
    { d: circle(15.5, -4.8, er * 0.33), inkFill: "#FFFFFF" },
    { d: circle(26.2, -4.6, er * 0.3), inkFill: "#FFFFFF" },
    { d: "M 24 12 L 43 5 L 39 20 Z", fill: C.thiefCloth },
    { d: "M 24 14 L 36 28 L 23 25 Z", fill: C.thiefCloth },
    { d: circle(24, 13, 5), fill: C.thiefCloth },
    ...[spiral(-11, -11, 7), spiral(-15, 10, 6, 1.5, -1), spiral(4, -21, 5), spiral(-2, 18, 4.5, 1.4, -1), spiral(-22, -2, 4)].map((d) => ({ d, w: 2.3, stroke: "#F6F2E2" })),
  ];
};

// pose: { lean, phase, stride, handF, handB, eyes, crouch }
export const Thief = ({ x, y, s = 1, dir = 1, lean = 16, phase = 0, stride = 1, crouch = 1, handF, handB, eyes = "normal", headTilt = 0, run = false, children }) => {
  // legs, relative to the hip
  const leg = (off) => {
    const p = (phase + off) * Math.PI * 2;
    const swing = Math.sin(p);
    const lift = Math.max(0, Math.sin(p + 1.1));
    const thigh = (run ? 70 : 80) - stride * (run ? 42 : 30) * swing - (1 - crouch) * 4;
    const shin = thigh + 18 * crouch + stride * (run ? 70 : 52) * lift;
    const footA = run ? shin - 70 : 30 + 20 * lift * stride;
    const pts = [[off ? -5 : 5, 0]];
    for (const [len, deg] of [[42, thigh], [44, shin], [13, footA]]) {
      const [px, py] = pts[pts.length - 1];
      pts.push([px + Math.cos(rad(deg)) * len, py + Math.sin(rad(deg)) * len]);
    }
    return pts;
  };
  const lf = leg(0);
  const lb = leg(0.5);
  const hipY = -Math.max(lf[3][1], lb[3][1]);
  const H = [0, hipY];
  const toChar = (p) => rot([p[0], p[1] + hipY], lean, H);
  const shF = toChar([26, -62]);
  const shB = toChar([8, -64]);
  const head = toChar([24, -100]);
  const defF = [shF[0] + 28, shF[1] + 12];
  const defB = [shB[0] + 22, shB[1] + 20];
  const aF = ik(shF, handF ?? defF, 33, 31, run ? 1 : -1);
  const aB = ik(shB, handB ?? defB, 33, 31, run ? 1 : -1);
  const legParts = (pts) => {
    const abs = pts.map(([px, py]) => [px, py + hipY]);
    return [
      { d: limb([abs[0], abs[1], abs[2]], 20, 13), fill: C.thiefPants },
      { d: limb([abs[2], abs[3]], 11, 9), fill: C.skin },
    ];
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
      <Layer parts={arm(aB, C.thiefSuit, 18, 14, 7.5)} />
      <Layer parts={legParts(lb)} />
      <Layer parts={legParts(lf)} />
      <g transform={`rotate(${lean} ${H[0]} ${H[1]}) translate(0 ${hipY})`}>
        <Layer parts={[
          { d: "M -21 6 C -29 -30 -19 -62 3 -76 Q 20 -82 35 -70 C 41 -44 37 -14 29 8 Q 4 14 -21 6 Z", fill: C.thiefSuit },
          { d: "M -25 2 L 33 4 L 37 26 Q 6 33 -29 24 Z", fill: C.thiefSuit },
          { d: limb([[-23, -4], [33, -2]], 9), fill: C.thatchDark },
          { d: "M 6 -75 L 17 -50 L 30 -72 Z", fill: C.under },
          { d: "M 2 8 L 4 24", w: 2.2, inkAlpha: 0.6 },
        ]} />
      </g>
      <g transform={`translate(${head[0]} ${head[1]}) rotate(${headTilt + lean * 0.3})`}>
        <Layer parts={thiefHead(eyes)} />
      </g>
      {children}
      <Layer parts={arm(aF, C.thiefSuit, 18, 14, 7.5)} />
    </g>
  );
};

// ---------------------------------------------------------------- places & props

export const Hut = ({ x, y, s = 1, glow = 0 }) => {
  const boards = [-92, -68, -44, 40].map((bx) => ({ d: `M ${bx} -6 L ${bx} -140`, w: 2, inkAlpha: 0.45 }));
  const thatch = [];
  for (let i = -150; i <= 150; i += 13) thatch.push({ d: `M ${i} -128 L ${i * 0.96} -148`, w: 2, inkAlpha: 0.5 });
  for (let i = -96; i <= 96; i += 16) thatch.push({ d: `M ${i * 1.2} -160 L ${i} -186`, w: 1.8, inkAlpha: 0.35 });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Layer parts={[
        { d: "M -118 0 L -118 -146 L 118 -146 L 118 0 Z", fill: C.wood },
        { d: "M -30 0 L -30 -112 L 30 -112 L 30 0 Z", fill: glow ? "#F4D58A" : C.shadow, alpha: 0.95 },
        { d: "M -32 -114 L 32 -114 L 32 -72 L -32 -72 Z", fill: C.straw },
        ...[-104, -96, -88, -80].map((ly) => ({ d: `M -30 ${ly} L 30 ${ly}`, w: 1.6, inkAlpha: 0.5 })),
        { d: "M 50 -110 L 96 -110 L 96 -70 L 50 -70 Z", fill: "#F6EED6" },
        { d: "M 73 -110 L 73 -70 M 50 -90 L 96 -90", w: 2 },
        ...boards,
        { d: "M -112 -146 L -112 0 M 112 -146 L 112 0", w: 2.4 },
        { d: ellipse(-108, 2, 16, 7), fill: "#B9B6AE" },
        { d: ellipse(108, 2, 16, 7), fill: "#B9B6AE" },
      ]} />
      <Layer parts={[
        { d: "M -168 -138 Q -172 -126 -158 -124 L 158 -124 Q 172 -126 168 -138 L 106 -236 Q 0 -250 -106 -236 Z", fill: C.thatch },
        { d: "M -112 -234 Q 0 -254 112 -234 L 104 -252 Q 0 -270 -104 -252 Z", fill: C.thatchDark },
        { d: "M -40 -258 L -40 -246 M 0 -262 L 0 -248 M 40 -258 L 40 -246", w: 2.4 },
        ...thatch,
      ]} />
    </g>
  );
};

export const Pine = ({ x, y, s = 1, sway = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Layer parts={[
      { d: limb([[0, 0], [16, -70], [-8, -140], [18 + sway, -215]], 28, 12), fill: C.wood },
      { d: limb([[8, -110], [56 + sway, -146]], 10, 6), fill: C.wood },
      { d: limb([[-4, -150], [-52 + sway, -176]], 9, 6), fill: C.wood },
    ]} />
    <Layer parts={[
      { d: cloudPad(64 + sway, -142, 120, 32, 5), fill: C.pine },
      { d: cloudPad(-50 + sway, -172, 104, 30, 4), fill: C.pine },
      { d: cloudPad(18 + sway * 1.3, -214, 116, 34, 5), fill: C.pine },
      { d: cloudPad(-14 + sway * 1.5, -254, 84, 28, 4), fill: C.pine },
    ]} />
  </g>
);

export const Sun = ({ x, y, r = 46, t = 0 }) => {
  const rays = [];
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + t * 0.25;
    const r0 = r + 18 + (i % 2) * 2;
    const r1 = r0 + 18;
    rays.push({ d: `M ${(Math.cos(a) * r0).toFixed(1)} ${(Math.sin(a) * r0).toFixed(1)} L ${(Math.cos(a) * r1).toFixed(1)} ${(Math.sin(a) * r1).toFixed(1)}`, w: 3 });
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <Layer parts={[
        { d: circle(0, 0, r), fill: C.sun },
        { d: circle(-4, -4, r * 0.62), fill: C.sunCore, alpha: 0.85, line: false },
        ...rays,
      ]} />
    </g>
  );
};

export const Moon = ({ x, y, r = 90, glow = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 2.6} fill="url(#moonGlow)" opacity={glow} />
    <Layer parts={[
      { d: circle(0, 0, r), fill: C.moon },
      { d: ellipse(-r * 0.3, -r * 0.2, r * 0.2, r * 0.16), fill: C.moonDeep, alpha: 0.7, line: false },
      { d: ellipse(r * 0.28, r * 0.25, r * 0.15, r * 0.12), fill: C.moonDeep, alpha: 0.6, line: false },
      { d: ellipse(r * 0.1, -r * 0.48, r * 0.1, r * 0.08), fill: C.moonDeep, alpha: 0.6, line: false },
    ]} />
  </g>
);

export const Ground = ({ y, color = C.grass, x0 = -40, x1 = 1120, depth = 34, tufts = [], flowers = [] }) => {
  let band = `M ${x0} ${y} L ${x1} ${y} L ${x1} ${y + depth}`;
  for (let x = x1; x > x0; x -= 60) band += ` Q ${x - 30} ${y + depth + (x % 120 ? 10 : -6)} ${x - 60} ${y + depth}`;
  band += " Z";
  const tuftParts = tufts.map((tx) => ({ d: `M ${tx - 7} ${y} L ${tx - 11} ${y - 14} M ${tx} ${y} L ${tx} ${y - 19} M ${tx + 6} ${y} L ${tx + 11} ${y - 13}`, w: 2.4, stroke: C.grassDark }));
  return (
    <>
      <Layer base={false} parts={[{ d: band, fill: color, line: false }, { d: `M ${x0} ${y} L ${x1} ${y}`, w: 3.2 }, ...tuftParts]} />
      {flowers.map(([fx, col], i) => <Flower key={i} x={fx} y={y} color={col} />)}
    </>
  );
};

export const Flower = ({ x, y, color = C.petal, s = 1 }) => {
  const petals = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    petals.push({ d: circle(Math.cos(a) * 7, -30 + Math.sin(a) * 7, 5.5), fill: color });
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Layer parts={[{ d: "M 0 0 Q 2 -14 0 -26", w: 2.4, stroke: C.grassDark }, ...petals, { d: circle(0, -30, 3.6), fill: C.sunCore }]} />
    </g>
  );
};

export const Birds = ({ x, y, t }) => {
  const flap = (o) => 6 * Math.sin(t * 9 + o);
  const b = (bx, by, o) => `M ${bx - 13} ${by} Q ${bx - 6} ${by - 8 - flap(o)} ${bx} ${by} Q ${bx + 6} ${by - 8 - flap(o)} ${bx + 13} ${by}`;
  return (
    <g transform={`translate(${x + t * 14} ${y})`}>
      <Ink>
        <path d={b(0, 0, 0)} fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
        <path d={b(56, 26, 1.3)} fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      </Ink>
    </g>
  );
};

export const Sparkle = ({ x, y, r = 10, k = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <Ink>
      <path d={`M ${-r} 0 L ${r} 0 M 0 ${-r} L 0 ${r}`} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
    </Ink>
  </g>
);

export const Bowl = ({ x, y, s = 1, rot: r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <Layer parts={[
      { d: "M -36 -24 Q -34 2 0 2 Q 34 2 36 -24 Z", fill: C.bowl },
      { d: ellipse(0, -24, 36, 8), fill: "#5A3624" },
      { d: "M -14 2 L -12 6 L 12 6 L 14 2", w: 2.6 },
    ]} />
  </g>
);

export const Mat = ({ x, y, w = 260 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Layer parts={[
      { d: `M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 - 22} -16 L ${-w / 2 + 18} -16 Z`, fill: C.straw },
      ...[-0.3, 0, 0.3].map((k) => ({ d: `M ${k * w} -1 L ${k * w * 0.92} -15`, w: 1.8, inkAlpha: 0.5 })),
    ]} />
  </g>
);

export const Temari = ({ x, y, r = 22, spin = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`}>
    <Layer parts={[
      { d: circle(0, 0, r), fill: C.temariRed },
      { d: `M ${-r} -4 Q 0 -14 ${r} -4 L ${r} 6 Q 0 -4 ${-r} 6 Z`, fill: C.temariGold, line: false },
      { d: `M -6 ${-r} Q 6 0 -6 ${r} L 4 ${r} Q 16 0 4 ${-r} Z`, fill: C.temariTeal, line: false },
      { d: `M ${-r} -4 Q 0 -14 ${r} -4 M -6 ${-r} Q 6 0 -6 ${r}`, w: 2, inkAlpha: 0.7 },
    ]} />
  </g>
);

export const Petal = ({ x, y, r = 0, s = 1, color = C.petal }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <Layer parts={[{ d: "M 0 -9 Q 9 -2 0 9 Q -9 -2 0 -9 Z", fill: color, w: 2.2 }]} />
  </g>
);

export const Butterfly = ({ x, y, t, s = 1 }) => {
  const f = 0.35 + 0.65 * Math.abs(Math.sin(t * 14));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`scale(${f} 1)`}>
        <Layer parts={[
          { d: "M 0 -2 C -16 -26 -34 -16 -26 -2 C -32 10 -14 16 0 4 Z", fill: C.sun },
          { d: "M 0 -2 C 16 -26 34 -16 26 -2 C 32 10 14 16 0 4 Z", fill: C.temariTeal },
        ]} />
      </g>
      <Ink><path d="M 0 -10 L 0 12 M 0 -10 L -5 -18 M 0 -10 L 5 -18" stroke={C.ink} strokeWidth={2.6} strokeLinecap="round" fill="none" /></Ink>
    </g>
  );
};

export const Susuki = ({ x, y, h = 160, lean = 10, sway = 0, s = 1 }) => {
  const tip = [lean + sway, -h];
  const plume = [];
  for (let i = 0; i < 6; i++) {
    const py = -h + 12 + i * 11;
    const px = (lean + sway) * (1 - i / 9);
    plume.push({ d: `M ${px} ${py} q ${10 + i} -4 ${18 + i * 2} ${6 + i}`, w: 2, stroke: "#B39C6A" });
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Layer base={false} parts={[
        { d: `M 0 0 Q ${lean * 0.3} ${-h * 0.5} ${tip[0]} ${tip[1]}`, w: 2.6, stroke: "#8E9A62" },
        { d: `M 0 0 Q ${-14} ${-h * 0.35} ${-30 + sway * 0.5} ${-h * 0.45}`, w: 2.4, stroke: "#8E9A62" },
        { d: ellipse(tip[0] + 6, tip[1] + 30, 9, 30), fill: "#E9D8A8", line: false },
        ...plume,
      ]} />
    </g>
  );
};

export const Spider = ({ x, y, len }) => (
  <g>
    <Ink>
      <path d={`M ${x} 118 L ${x} ${y + len}`} stroke={C.ink} strokeWidth={1.6} opacity={0.7} />
    </Ink>
    <g transform={`translate(${x} ${y + len})`}>
      <Layer parts={[
        { d: circle(0, 6, 8), fill: "#5B5F78" },
        { d: "M -6 4 L -16 -2 M -6 8 L -17 10 M 6 4 L 16 -2 M 6 8 L 17 10", w: 2 },
        { d: circle(-3, 5, 1.4), inkFill: "#FFFFFF" },
        { d: circle(3, 5, 1.4), inkFill: "#FFFFFF" },
      ]} />
    </g>
  </g>
);

export const Desk = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Layer parts={[
      { d: "M -90 -54 L 90 -54 L 90 -40 L -90 -40 Z", fill: C.wood },
      { d: "M -80 -40 L -76 0 L -66 0 L -68 -40 Z", fill: C.woodDark },
      { d: "M 68 -40 L 66 0 L 76 0 L 80 -40 Z", fill: C.woodDark },
      { d: "M -60 -54 L 50 -54 L 56 -62 L -54 -62 Z", fill: "#FFFDF4" },
      { d: circle(70, -60, 9), fill: "#3A3F55" },
    ]} />
  </g>
);

export const MotionLines = ({ x, y, k = 1, dir = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${dir} 1)`} opacity={k}>
    <Ink>
      {[-36, -12, 12].map((oy, i) => (
        <path key={i} d={`M ${-30 - i * 8} ${oy} L ${-70 - i * 12} ${oy}`} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      ))}
    </Ink>
  </g>
);

export const Puff = ({ x, y, k }) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + k * 0.8})`} opacity={1 - k}>
    <Layer base={false} parts={[{ d: cloudPad(0, 0, 50, 20, 3, false), fill: "#C9C3B4", w: 2.4 }]} />
  </g>
);

export const InkText = ({ x, y, children, size = 64, rotate = 0, opacity = 1 }) => (
  <text x={x} y={y} fontFamily="Patrick Hand" fontSize={size} fill={C.ink} textAnchor="middle" transform={`rotate(${rotate} ${x} ${y})`} opacity={opacity}>
    {children}
  </text>
);

export { Crayon };
