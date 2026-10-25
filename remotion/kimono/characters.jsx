import React from "react";
import { C, Layer, circle, ellipse, limb, cloudPad } from "../storybook/style";
import { ik } from "../storybook/characters";

export const K = {
  kimono: "#5B6FB0",
  sakura: "#F29BB0",
  obi: "#E9B949",
  cord: "#D9534A",
  hair: "#2D3150",
  lacquer: "#4A2C2A",
  shoji: "#F8F2E2",
  tatami: "#CFC98F",
  wall: "#EFE3C4",
  tile: "#7D8DB5",
  tileDark: "#5E6C96",
  gold: "#F2C14E",
  dust: "#BDB8AE",
  car: "#E0625A",
  tape: "#F4CD58",
  sky: "#C7DDE5",
};

const sakura = (pts, r = 3.4, color = K.sakura) =>
  pts.flatMap(([fx, fy]) => {
    const parts = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      parts.push({ d: circle(fx + Math.cos(a) * r * 1.25, fy + Math.sin(a) * r * 1.25, r), fill: color, line: false });
    }
    parts.push({ d: circle(fx, fy, r * 0.6), fill: "#FFFFFF", line: false });
    return parts;
  });

export const Heart = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <Layer parts={[{ d: "M 0 12 C -22 -4 -14 -22 0 -10 C 14 -22 22 -4 0 12 Z", fill: C.pink, w: 2.4 }]} />
  </g>
);

export const SweatDrop = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Layer parts={[{ d: "M 0 -12 Q 12 6 0 10 Q -12 6 0 -12 Z", fill: "#9FC8E8", w: 2.4 }]} />
  </g>
);

// ---------------------------------------------------------------- the wearer

const BODY = {
  right: "M -30 -188 Q 0 -196 28 -188 C 34 -130 40 -70 42 -12 Q 0 -4 -42 -12 C -40 -70 -36 -130 -30 -188 Z",
  long: "M -32 -186 Q 0 -194 30 -186 C 38 -130 46 -60 58 -20 C 68 -8 90 -4 96 2 Q 10 12 -80 2 C -66 -4 -50 -10 -46 -22 C -42 -70 -38 -130 -32 -186 Z",
  short: "M -30 -188 Q 0 -196 28 -188 C 32 -150 35 -110 37 -72 Q 0 -64 -37 -72 C -35 -110 -33 -150 -30 -188 Z",
};
const HEM = { right: -12, long: 0, short: -70 };

const face = (eyes, mouth, look, blush) => {
  const parts = [
    { d: "M -44 -228 A 38 38 0 0 1 32 -228 L 31 -198 Q 0 -190 -42 -196 Z", fill: K.hair },
    { d: "M -6 -198 L 10 -198 L 10 -186 L -6 -186 Z", fill: C.skin, line: false },
    { d: circle(2, -226, 32), fill: C.skin },
    { d: "M -29 -232 C -26 -262 30 -266 36 -234 Q 30 -226 24 -234 Q 16 -224 8 -234 Q 0 -226 -8 -234 Q -16 -226 -20 -234 Q -26 -228 -29 -232 Z", fill: K.hair },
    ...sakura([[-30, -250]], 3.6),
    { d: ellipse(3, -211, 7, 5), fill: C.blush, alpha: 0.85 * blush, line: false },
    { d: ellipse(31, -212, 5, 4.5), fill: C.blush, alpha: 0.85 * blush, line: false },
  ];
  const eye = (ex, r) => {
    if (eyes === "closed") return [{ d: `M ${ex - 5.5} -224 Q ${ex} -218 ${ex + 5.5} -224`, w: 3 }];
    const rr = eyes === "wide" ? r * 1.35 : r;
    return [
      { d: circle(ex + look, -224, rr), inkFill: C.ink },
      { d: circle(ex + look + 1.3, -225.6, rr * 0.33), inkFill: "#FFFFFF" },
    ];
  };
  parts.push(...eye(12, 4.4), ...eye(27, 3.9));
  if (eyes === "worried") {
    parts.push({ d: "M 6 -236 L 16 -233", w: 2.6 }, { d: "M 24 -233 L 32 -236", w: 2.6 });
  }
  const mouths = {
    smile: { d: "M 14 -205 Q 20 -199 26 -205", w: 2.8 },
    open: { d: "M 15 -206 Q 20 -197 25 -206 Z", fill: "#C65A5A", w: 2.4 },
    o: { d: circle(20, -204, 3.6), inkFill: C.ink },
    wavy: { d: "M 12 -204 q 3 -3 6 0 q 3 3 6 0 q 3 -3 5 0", w: 2.4 },
  };
  parts.push(mouths[mouth] ?? mouths.smile);
  return parts;
};

const armParts = (pts, fit, color) => {
  const [s, e, h] = pts;
  const lo = Math.max(s[1], e[1]);
  if (fit === "long") {
    const over = [h[0] + (h[0] - e[0]) * 0.35, h[1] + (h[1] - e[1]) * 0.35];
    return [
      { d: `M ${s[0]} ${s[1]} L ${e[0]} ${e[1]} L ${e[0] + 4} ${lo + 58} Q ${(s[0] + e[0]) / 2} ${lo + 70} ${s[0] - 4} ${s[1] + 48} Z`, fill: color },
      { d: limb([s, e, over], 25, 23), fill: color },
    ];
  }
  if (fit === "short") {
    return [
      { d: limb([e, h], 12, 11), fill: C.skin },
      { d: circle(h[0], h[1], 8), fill: C.skin },
      { d: `M ${s[0]} ${s[1]} L ${e[0]} ${e[1]} L ${e[0] + 2} ${lo + 20} Q ${(s[0] + e[0]) / 2} ${lo + 28} ${s[0] - 2} ${s[1] + 20} Z`, fill: color },
      { d: limb([s, e], 24, 23), fill: color },
    ];
  }
  return [
    { d: `M ${s[0]} ${s[1]} L ${e[0]} ${e[1]} L ${e[0] + 2} ${lo + 40} Q ${(s[0] + e[0]) / 2} ${lo + 52} ${s[0] - 2} ${s[1] + 34} Z`, fill: color },
    { d: limb([s, e, h], 24, 20), fill: color },
    { d: circle(h[0], h[1], 8), fill: C.skin },
  ];
};

// The wearer, facing right. fit: right | long | short.
// front/back are hand targets in local coordinates.
export const Person = ({
  x, y, s = 1, dir = 1, fit = "right", eyes = "open", mouth = "smile", look = 0, blush = 1,
  front = [32, -112], back = [22, -116], lean = 0, bob = 0, headTilt = 0,
  colors = {}, pattern = true, children, holdFront,
}) => {
  const kim = colors.kimono ?? K.kimono;
  const obi = colors.obi ?? K.obi;
  const hem = HEM[fit];
  const armF = ik([18, -178], front, 44, 40, -1);
  const armB = ik([-16, -180], back, 44, 40, -1);
  const flowers = [[-18, -60], [18, -82], [-6, -168], [24, -36], [-26, -92], [6, -30], [30, -150]].filter(([, fy]) => fy < hem - 8);
  const body = [
    { d: BODY[fit], fill: kim },
    ...(pattern ? sakura(flowers) : []),
    { d: "M -15 -191 L 4 -152 L 19 -191 Z", fill: "#FBF8EE" },
    { d: "M -8 -191 L 4 -166 L 12 -191 Z", fill: kim, line: false },
    { d: `M 4 -154 L -8 ${hem - 4}`, w: 2.4, inkAlpha: 0.6 },
    { d: "M -44 -114 L -56 -90 L -47 -88 L -38 -110 Z", fill: obi },
    { d: "M -36 -136 Q 0 -130 34 -136 L 36 -104 Q 0 -98 -38 -104 Z", fill: obi },
    { d: "M -38 -124 C -54 -146 -76 -136 -68 -121 C -76 -106 -54 -96 -38 -116 Z", fill: obi },
    { d: "M -56 -134 Q -58 -121 -56 -108", w: 2, inkAlpha: 0.55 },
    { d: circle(-39, -120, 6.5), fill: obi },
    { d: "M -37 -120 Q 0 -114 35 -120", w: 4, stroke: K.cord },
  ];
  const feet = fit === "long" ? [] : [
    ...(fit === "short" ? [{ d: limb([[-14, -74], [-15, -12]], 13), fill: C.skin }, { d: limb([[14, -74], [17, -12]], 13), fill: C.skin }] : []),
    { d: ellipse(-16, -7, 15, 7), fill: "#FFFFFF" },
    { d: ellipse(20, -7, 15, 7), fill: "#FFFFFF" },
    { d: "M -32 -1 L 0 -1 M 4 -1 L 36 -1", w: 3.4, stroke: "#B08A55" },
  ];
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${dir * s} ${s}) rotate(${lean})`}>
      {feet.length > 0 && <Layer parts={feet} />}
      <Layer parts={armParts(armB, fit, kim)} />
      <Layer parts={body} />
      <g transform={`rotate(${headTilt} 2 -196)`}>
        <Layer parts={face(eyes, mouth, look, blush)} />
      </g>
      {holdFront}
      <Layer parts={armParts(armF, fit, kim)} />
      {children}
    </g>
  );
};

// ---------------------------------------------------------------- the kimono on its stand (ikō)

export const KimonoStand = ({ x, y, s = 1, drop = 1, sway = 0, color = K.kimono, flowerColor = K.sakura, empty = false }) => {
  const flowers = [[-90, -200], [60, -150], [-30, -110], [90, -80], [-80, -70], [20, -230], [-200, -330], [200, -300], [170, -360], [-160, -290], [40, -340], [-50, -300]];
  const waves = [];
  for (let wx = -116; wx < 112; wx += 29) waves.push({ d: `M ${wx} -50 a 14.5 14.5 0 0 1 29 0`, w: 2.4, stroke: "#FFFFFF", inkAlpha: 0.85 });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Layer parts={[
        { d: "M -206 -392 L -192 -392 L -192 0 L -206 0 Z", fill: K.lacquer },
        { d: "M 192 -392 L 206 -392 L 206 0 L 192 0 Z", fill: K.lacquer },
        { d: "M -238 -14 L -160 -14 L -160 0 L -238 0 Z", fill: K.lacquer },
        { d: "M 160 -14 L 238 -14 L 238 0 L 160 0 Z", fill: K.lacquer },
        { d: "M -200 -306 L 200 -306 L 200 -294 L -200 -294 Z", fill: K.lacquer },
      ]} />
      {!empty && (
        <g transform={`rotate(${sway} 0 -392) translate(0 -392) scale(1 ${drop}) translate(0 392)`}>
          <Layer parts={[
            { d: "M -250 -392 L 250 -392 L 250 -262 Q 250 -252 240 -252 L 132 -252 L 124 -44 Q 0 -36 -124 -44 L -132 -252 L -240 -252 Q -250 -252 -250 -262 Z", fill: color },
            ...sakura(flowers, 5.5, flowerColor),
            ...waves,
            { d: "M -44 -392 L 0 -298 L 44 -392 Z", fill: "#FBF8EE" },
            { d: "M -28 -392 L 0 -330 L 28 -392 Z", fill: color, line: false },
            { d: "M 0 -300 L -34 -46", w: 2.4, inkAlpha: 0.6 },
            { d: "M -132 -392 L -132 -252 M 132 -392 L 132 -252", w: 2.2, inkAlpha: 0.5 },
          ]} />
        </g>
      )}
      <Layer parts={[{ d: "M -284 -402 Q -274 -416 -250 -412 L 250 -412 Q 274 -416 284 -402 L 278 -390 L -278 -390 Z", fill: K.lacquer }]} />
    </g>
  );
};

// ---------------------------------------------------------------- props

export const Tape = ({ x, y, h, s = 1 }) => {
  const ticks = [];
  for (let ty = 10; ty < h; ty += 10) {
    const big = ty % 50 === 0;
    ticks.push({ d: `M -13 ${-ty} L ${big ? 0 : -6} ${-ty}`, w: big ? 2.4 : 1.6, inkAlpha: 0.8 });
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {h > 2 && <Layer parts={[{ d: `M -13 0 L 13 0 L 13 ${-h} L -13 ${-h} Z`, fill: K.tape }, ...ticks]} />}
      <Layer parts={[
        { d: "M -28 0 L 28 0 L 28 -40 Q 28 -48 20 -48 L -20 -48 Q -28 -48 -28 -40 Z", fill: "#E89A3C" },
        { d: circle(0, -24, 9), fill: "#FBF1D6" },
      ]} />
    </g>
  );
};

export const Check = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Layer parts={[{ d: circle(0, 0, 24), fill: "#9CCB86" }, { d: "M -11 1 L -3 10 L 12 -9", w: 4.4 }]} />
  </g>
);

export const DustBunny = ({ x, y, k = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <Layer parts={[
      { d: cloudPad(0, -6, 64, 30, 4, false), fill: K.dust },
      { d: circle(-9, -8, 3.4), inkFill: C.ink },
      { d: circle(9, -8, 3.4), inkFill: C.ink },
      { d: circle(-8, -9.2, 1.1), inkFill: "#FFFFFF" },
      { d: circle(10, -9.2, 1.1), inkFill: "#FFFFFF" },
    ]} />
  </g>
);

export const Broom = ({ angle = 0 }) => (
  <g transform={`rotate(${angle} 0 0)`}>
    <Layer parts={[
      { d: limb([[0, 0], [0, 150]], 7, 6), fill: "#B98A4F" },
      { d: "M -6 146 L 6 146 L 26 196 Q 0 204 -26 196 Z", fill: "#D9C27A" },
      { d: "M -8 160 L -16 196 M 0 158 L 0 198 M 8 160 L 16 196", w: 1.8, inkAlpha: 0.6 },
    ]} />
  </g>
);

export const Wrench = ({ angle = 0 }) => (
  <g transform={`rotate(${angle})`}>
    <Layer parts={[
      { d: limb([[0, 0], [0, 64]], 10, 10), fill: "#AEB4C2" },
      { d: "M -12 64 Q -16 86 -6 92 L -4 80 L 4 80 L 6 92 Q 16 86 12 64 Z", fill: "#AEB4C2" },
    ]} />
  </g>
);

export const Coin = ({ x, y, flap = 0, s = 1 }) => {
  const w = 0.4 + 0.6 * Math.abs(Math.sin(flap));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`scale(${w} 1)`}>
        <Layer parts={[
          { d: "M -14 -2 C -30 -18 -44 -10 -40 0 C -44 8 -28 10 -14 4 Z", fill: "#FFFFFF" },
          { d: "M 14 -2 C 30 -18 44 -10 40 0 C 44 8 28 10 14 4 Z", fill: "#FFFFFF" },
        ]} />
      </g>
      <Layer parts={[{ d: circle(0, 0, 16), fill: K.gold }, { d: circle(0, 0, 5), fill: C.paper }]} />
    </g>
  );
};

export const Car = ({ x, y, s = 1, hood = 0, shake = 0 }) => (
  <g transform={`translate(${x + shake} ${y}) scale(${s})`}>
    <Layer parts={[
      { d: "M -232 -44 Q -234 -92 -184 -102 L -122 -106 Q -84 -172 0 -174 Q 92 -174 132 -112 L 198 -102 Q 236 -94 236 -54 L 236 -40 Q 236 -32 228 -32 L -224 -32 Q -232 -32 -232 -44 Z", fill: K.car },
      { d: "M -104 -110 Q -72 -160 -10 -162 L -10 -110 Z", fill: K.sky },
      { d: "M 6 -162 Q 84 -160 114 -110 L 6 -110 Z", fill: K.sky },
      { d: "M -60 -150 L -30 -116 M 40 -152 L 70 -116", w: 3, stroke: "#FFFFFF", inkAlpha: 0.9 },
      { d: "M -200 -64 L -90 -66 M 30 -64 L 180 -64", w: 3, stroke: "#FFFFFF", inkAlpha: 0.7 },
      { d: ellipse(-222, -66, 9, 12), fill: "#FFF1B8" },
      { d: "M 0 -110 L 0 -40", w: 2.4, inkAlpha: 0.6 },
      { d: ellipse(-150, -32, 40, 40), fill: "#4B4E63" },
      { d: circle(-150, -32, 16), fill: "#C9CCD8" },
      { d: ellipse(150, -32, 40, 40), fill: "#4B4E63" },
      { d: circle(150, -32, 16), fill: "#C9CCD8" },
      ...(hood > 0 ? [{ d: "M -226 -98 L -124 -104 L -124 -92 L -224 -86 Z", fill: "#3B3E52" }] : []),
    ]} />
    {hood > 0 && (
      <g transform={`rotate(${70 * hood} -122 -106)`}>
        <Layer parts={[{ d: "M -122 -106 L -228 -98 Q -232 -92 -226 -88 L -122 -94 Z", fill: K.car }]} />
      </g>
    )}
  </g>
);

const box = (w, h, col, ribbon) => [
  { d: `M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2} ${-h} L ${-w / 2} ${-h} Z`, fill: col },
  { d: `M -6 0 L 6 0 L 6 ${-h} L -6 ${-h} Z`, fill: ribbon },
  { d: `M -14 ${-h} C -30 ${-h - 22} -4 ${-h - 18} 0 ${-h} C 4 ${-h - 18} 30 ${-h - 22} 14 ${-h} Z`, fill: ribbon },
];
const bag = (w, h, col) => [
  { d: `M -14 ${-h} Q 0 ${-h - 34} 14 ${-h}`, w: 3.4 },
  { d: `M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 - 8} ${-h} L ${-w / 2 + 8} ${-h} Z`, fill: col },
  { d: `M ${-w / 2 + 6} ${-h + 16} L ${w / 2 - 6} ${-h + 16}`, w: 2, inkAlpha: 0.5 },
];

// The impress-others tower, bottom to top.
export const TOWER = [
  { h: 76, parts: box(170, 76, "#F2A7B7", K.gold) },
  { h: 96, parts: bag(120, 96, "#5FB3B0") },
  { h: 64, parts: box(138, 64, K.gold, "#D9534A") },
  { h: 70, parts: box(112, 70, "#B49AD8", "#FFFFFF") },
  { h: 84, parts: bag(96, 84, "#F0A04B") },
  { h: 56, parts: box(90, 56, "#7FC08E", "#F2A7B7") },
];

export const TowerItem = ({ item }) => <Layer parts={item.parts} />;

export const Thought = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Layer parts={[
      { d: circle(-34, 64, 7), fill: "#FFFFFF" },
      { d: circle(-20, 44, 11), fill: "#FFFFFF" },
      { d: cloudPad(0, 8, 120, 30, 4, false), fill: "#FFFFFF" },
    ]} />
    {children}
  </g>
);

export const House = ({ x, y, s = 1 }) => {
  const tiles = [];
  for (let tx = -280; tx <= 280; tx += 35) tiles.push({ d: `M ${tx * 1.36} -414 L ${tx} -526`, w: 2, inkAlpha: 0.45 });
  const windows = [];
  for (const ry of [-330, -120]) {
    for (const rx of [-254, 0, 254]) {
      windows.push({ d: `M ${rx - 34} ${ry - 26} L ${rx + 34} ${ry - 26} L ${rx + 34} ${ry + 26} L ${rx - 34} ${ry + 26} Z`, fill: K.shoji });
      windows.push({ d: `M ${rx} ${ry - 26} L ${rx} ${ry + 26} M ${rx - 34} ${ry} L ${rx + 34} ${ry}`, w: 2, inkAlpha: 0.7 });
    }
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Layer parts={[
        { d: "M -384 -416 L 384 -416 L 384 0 L -384 0 Z", fill: K.wall },
        ...windows,
        { d: "M -384 -214 L 384 -214 L 384 -200 L -384 -200 Z", fill: C.wood },
        { d: "M -384 -14 L 384 -14 L 384 0 L -384 0 Z", fill: C.wood },
        { d: "M -133 -416 L -121 -416 L -121 0 L -133 0 Z", fill: C.wood },
        { d: "M 121 -416 L 133 -416 L 133 0 L 121 0 Z", fill: C.wood },
        { d: "M -392 -416 L -376 -416 L -376 0 L -392 0 Z", fill: C.wood },
        { d: "M 376 -416 L 392 -416 L 392 0 L 376 0 Z", fill: C.wood },
      ]} />
      <Layer parts={[
        { d: "M -454 -408 Q -424 -422 -384 -428 L -304 -530 Q 0 -548 304 -530 L 384 -428 Q 424 -422 454 -408 L 444 -396 Q 0 -404 -444 -396 Z", fill: K.tile },
        { d: "M -312 -528 Q 0 -560 312 -528 L 302 -546 Q 0 -578 -302 -546 Z", fill: K.tileDark },
        ...tiles,
      ]} />
    </g>
  );
};
