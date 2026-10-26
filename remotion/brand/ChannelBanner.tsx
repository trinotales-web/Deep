import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Birds, Cloud, Defs, ellipseD, Ink, Pencil, Question, Shade, Sparkle, Sun } from "../japan/draw";
import { Expr, Person, Tribe } from "../japan/Person";
import { C, FONT_TITLE, INK, rand } from "../japan/theme";
import { Mascot } from "./ChannelLogo";

const W = 2560;
const H = 1440;
/** The part every device shows (YouTube's safe area for text and logos). */
export const BANNER_SAFE = { x: 507, y: 508, w: 1546, h: 423 };

const GROUND = 915;
const S = 0.72; // cast scale
const SP = 140; // space between sign holders
const ROW = 9 * SP + 12; // first holder to the mascot
const X0 = W / 2 - (ROW + 15) / 2;
// In cast units, from the holder's feet: the raised hand, and the sign above it.
const HAND = { x: 68, y: -165 };
const SIGN = { x: 60, y: -292, w: 100, h: 96 };
const CRATE = 44;

type Slot = { tribe: Tribe; letter: string; expr: Expr; rot: number; beard?: boolean };

/** History lines up to spell it out, not quite perfectly. */
const LINEUP: Slot[] = [
  { tribe: "roman", letter: "S", expr: "grin", rot: -6 },
  { tribe: "pharaoh", letter: "U", expr: "smile", rot: 4 },
  { tribe: "viking", letter: "B", expr: "grin", rot: -3 },
  { tribe: "samurai", letter: "S", expr: "grin", rot: 12 }, // ran it through with his katana
  { tribe: "khan", letter: "C", expr: "smile", rot: -5, beard: true },
  { tribe: "knight", letter: "R", expr: "grin", rot: 3 },
  { tribe: "ninja", letter: "I", expr: "happy", rot: -4 },
  { tribe: "napoleon", letter: "B", expr: "grin", rot: 5 }, // on a crate, naturally
  { tribe: "nomad", letter: "E", expr: "grin", rot: -7 }, // the caveman holds his backwards
];

const Sign: React.FC<{ letter: string; rot: number; mirror?: boolean; dy?: number }> = ({ letter, rot, mirror, dy = 0 }) => {
  const { w, h } = SIGN;
  return (
    <g transform={`translate(${SIGN.x},${SIGN.y + dy}) rotate(${rot})`}>
      <Pencil d={`M${-w / 2},${-h / 2} L${w / 2},${-h / 2 + 2} L${w / 2 - 2},${h / 2} L${-w / 2 + 1},${h / 2 - 1} Z`} fill={C.white} sw={4} />
      <Shade d={`M${w / 2 - 18},${-h / 2 + 5} L${w / 2 - 5},${-h / 2 + 6} L${w / 2 - 7},${h / 2 - 5} L${w / 2 - 20},${h / 2 - 5} Z`} fill={C.straw} opacity={0.4} />
      <text x={0} y={30} fontFamily={FONT_TITLE} fontSize={86} textAnchor="middle" fill={C.red} transform={mirror ? "scale(-1,1)" : undefined}>
        {letter}
      </text>
    </g>
  );
};

const Stick: React.FC<{ dy?: number }> = ({ dy = 0 }) => (
  <Pencil
    d={`M${HAND.x - 4},${HAND.y + 10} L${HAND.x + 4},${HAND.y + 10} L${SIGN.x + 4},${SIGN.y + dy + SIGN.h / 2 - 6} L${SIGN.x - 4},${SIGN.y + dy + SIGN.h / 2 - 6} Z`}
    fill={C.tan}
    sw={3}
  />
);

/** How far the samurai's sign has slid down his blade. */
const SKEWER_DROP = 26;

/** The samurai's katana, straight up through his sign; the tip is drawn again over the card. */
const Katana: React.FC<{ tipOnly?: boolean }> = ({ tipOnly }) =>
  tipOnly ? (
    <g>
      <Pencil d="M60,-312 L66.3,-312 Q64.5,-340 61,-368 L58,-365 Q59.5,-340 60,-312 Z" fill="#e3e7ec" sw={3} />
      <Ink d="M55,-316 l4,-7 M71,-316 l-4,-8" sw={2.5} />
    </g>
  ) : (
    <g>
      <Pencil d="M63,-138 L73,-138 L72,-180 L64,-180 Z" fill="#2b2b35" sw={3} />
      <Pencil d={ellipseD(68, -184, 13, 4.5)} fill={C.bronze} sw={2.5} />
      <Pencil d="M64,-187 L72,-187 Q71,-280 61,-368 L58,-365 Q62,-280 64,-187 Z" fill="#e3e7ec" sw={3} />
    </g>
  );

const Crate: React.FC = () => (
  <g>
    <Pencil d={`M-46,0 L46,0 L46,${-CRATE} L-46,${-CRATE} Z`} fill={C.tan} sw={4} />
    <Ink d={`M-46,${-CRATE / 2} L46,${-CRATE / 2}`} sw={2.5} opacity={0.6} />
    <Ink d={`M-38,-5 L38,${-CRATE + 5}`} sw={3} opacity={0.7} />
  </g>
);

const Holder: React.FC<{ slot: Slot; x: number }> = ({ slot, x }) => {
  const samurai = slot.tribe === "samurai";
  const lift = slot.tribe === "napoleon" ? CRATE : 0;
  return (
    <g transform={`translate(${x},${GROUND}) scale(${S})`}>
      {lift ? <Crate /> : null}
      <g transform={`translate(0,${-lift})`}>
        {samurai ? <Katana /> : <Stick dy={lift} />}
        <Person x={0} y={0} tribe={slot.tribe} expr={slot.expr} f={0} blinkOff aR={135} aL={18} beard={slot.beard} />
        <Sign letter={slot.letter} rot={slot.rot} mirror={slot.tribe === "nomad"} dy={lift + (samurai ? SKEWER_DROP : 0)} />
        {samurai ? <Katana tipOnly /> : null}
      </g>
    </g>
  );
};

const Pyramid: React.FC<{ x: number; y: number; h: number; w: number }> = ({ x, y, h, w }) => (
  <g>
    <Pencil d={`M${x - w},${y} L${x},${y - h} L${x + w},${y} Z`} fill={C.straw} sw={4} />
    <Shade d={`M${x},${y - h} L${x + w},${y} L${x + w * 0.25},${y} Z`} fill={C.tan} opacity={0.7} />
    {[0.3, 0.55, 0.78].map((k) => (
      <Ink key={k} d={`M${x - w * k},${y - h * (1 - k)} L${x + w * k},${y - h * (1 - k)}`} sw={2} opacity={0.4} />
    ))}
  </g>
);

const Palm: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <Pencil d={`M${x - 8},${y} Q${x - 4},${y - 100} ${x + 18},${y - 190} L${x + 30},${y - 186} Q${x + 10},${y - 100} ${x + 10},${y} Z`} fill={C.brown} sw={3.5} />
    {[
      [-70, 20],
      [-40, -30],
      [30, -36],
      [76, 10],
      [10, -50],
    ].map(([dx, dy], i) => (
      <Pencil
        key={i}
        d={`M${x + 24},${y - 188} Q${x + 24 + dx * 0.5},${y - 188 + dy - 40} ${x + 24 + dx},${y - 188 + dy} Q${x + 24 + dx * 0.5},${y - 188 + dy - 14} ${x + 24},${y - 180} Z`}
        fill={C.darkGreen}
        sw={3}
      />
    ))}
  </g>
);

/** The Leaning Tower of Pisa: eight storeys of arcades, a few degrees off true. */
const Pisa: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`rotate(6 ${x} ${y})`}>
    <Pencil d={`M${x - 34},${y} L${x + 34},${y} L${x + 34},${y - 236} L${x - 34},${y - 236} Z`} fill={C.white} sw={4} />
    <Pencil d={`M${x - 24},${y - 236} L${x + 24},${y - 236} L${x + 24},${y - 270} L${x - 24},${y - 270} Z`} fill={C.white} sw={3.5} />
    <Shade d={`M${x + 14},${y - 4} L${x + 30},${y - 4} L${x + 30},${y - 232} L${x + 14},${y - 232} Z`} fill={C.gray} opacity={0.35} />
    {[1, 2, 3, 4, 5, 6, 7].map((k) => (
      <Ink key={k} d={`M${x - 34},${y - k * 30} L${x + 34},${y - k * 30}`} sw={2.5} />
    ))}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((k) =>
      [-20, 0, 20].map((dx) => <Ink key={`${k}${dx}`} d={`M${x + dx - 5},${y - k * 30 - 6} L${x + dx - 5},${y - k * 30 - 18} Q${x + dx},${y - k * 30 - 25} ${x + dx + 5},${y - k * 30 - 18} L${x + dx + 5},${y - k * 30 - 6}`} sw={1.8} opacity={0.6} />),
    )}
  </g>
);

/** A moai, the big stone heads of Rapa Nui: tall flat-topped face, heavy brow, long nose and ears. */
const Moai: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const stone = "#9a958c";
  const dark = "#7a756c";
  return (
    <g>
      {[-1, 1].map((sd) => (
        <Pencil key={sd} d={`M${x + sd * 36},${y - 186} L${x + sd * 48},${y - 182} L${x + sd * 47},${y - 100} L${x + sd * 36},${y - 96} Z`} fill={dark} sw={3.5} />
      ))}
      <Pencil d={`M${x - 36},${y} L${x - 38},${y - 226} Q${x - 38},${y - 240} ${x - 24},${y - 240} L${x + 26},${y - 240} Q${x + 40},${y - 240} ${x + 38},${y - 226} L${x + 36},${y} Z`} fill={stone} sw={4} />
      <Shade d={`M${x + 20},${y - 236} L${x + 34},${y - 234} L${x + 32},${y - 4} L${x + 20},${y - 4} Z`} fill={dark} opacity={0.5} />
      <Pencil d={`M${x - 38},${y - 178} Q${x},${y - 186} ${x + 38},${y - 178} L${x + 37},${y - 164} Q${x},${y - 172} ${x - 37},${y - 164} Z`} fill={dark} sw={3.5} />
      {[-1, 1].map((sd) => (
        <Shade key={sd} d={ellipseD(x + sd * 17, y - 156, 13, 6)} fill={INK} opacity={0.55} />
      ))}
      <Pencil d={`M${x - 5},${y - 166} L${x + 5},${y - 166} L${x + 14},${y - 96} Q${x},${y - 88} ${x - 14},${y - 96} Z`} fill={stone} sw={3} />
      <Shade d={`M${x + 2},${y - 162} L${x + 5},${y - 162} L${x + 13},${y - 98} L${x + 5},${y - 93} Z`} fill={dark} opacity={0.6} />
      <Pencil d={`M${x - 17},${y - 72} Q${x},${y - 80} ${x + 17},${y - 72} Q${x},${y - 62} ${x - 17},${y - 72} Z`} fill={dark} sw={3} />
      <Ink d={`M${x - 14},${y - 42} Q${x},${y - 34} ${x + 14},${y - 42}`} sw={2.5} opacity={0.55} />
    </g>
  );
};

const Hills: React.FC = () => {
  const back: string[] = [];
  const front: string[] = [];
  for (let x = -40; x <= W + 40; x += 40) {
    back.push(`${x},${(852 + Math.sin(x / 210) * 16 + Math.sin(x / 77) * 5).toFixed(1)}`);
    front.push(`${x},${(902 + Math.sin(x / 160 + 1) * 6 + Math.sin(x / 53) * 2).toFixed(1)}`);
  }
  return (
    <g>
      <Pencil d={`M${back.join(" L")} L${W + 40},${H + 40} L-40,${H + 40} Z`} fill="#b9d29a" sw={3.5} off={[2, 2]} />
      <Pencil d={`M${front.join(" L")} L${W + 40},${H + 40} L-40,${H + 40} Z`} fill={C.green} sw={4} off={[2, 2]} />
    </g>
  );
};

/** Flowers and tufts on the lawn below the strip (seen on TVs). */
const Lawn: React.FC = () => {
  const items = [];
  for (let i = 0; i < 46; i++) {
    const x = rand(i * 2 + 11) * W;
    const y = 990 + rand(i * 2 + 12) * 420;
    items.push(
      i % 3 === 0 ? (
        <Pencil key={i} d={ellipseD(x, y, 9)} fill={i % 2 ? C.pink : C.yellow} sw={2.5} off={[1, 1]} />
      ) : (
        <Ink key={i} d={`M${x - 10},${y} L${x - 4},${y - 14} L${x},${y} L${x + 6},${y - 16} L${x + 10},${y}`} sw={2.5} color={C.darkGreen} opacity={0.7} />
      ),
    );
  }
  return <g>{items}</g>;
};

const NAME = "Zectenn Histori";

const Title: React.FC = () => {
  const tilt = NAME.split("").map((_, i) => (i % 2 ? 3 : -3)).join(" ");
  const bounce = NAME.split("").map((_, i) => (i === 0 ? 0 : i % 2 ? 6 : -6)).join(" ");
  return (
    <g>
      {[
        { dx: 6, dy: 7, fill: INK },
        { dx: 0, dy: 0, fill: C.white },
      ].map((l, k) => (
        <text
          key={k}
          x={W / 2 + l.dx}
          y={628 + l.dy}
          fontFamily={FONT_TITLE}
          fontSize={136}
          textAnchor="middle"
          fill={l.fill}
          stroke={INK}
          strokeWidth={11}
          paintOrder="stroke"
          strokeLinejoin="round"
          rotate={tilt}
          dy={bounce}
          letterSpacing={2}
        >
          {NAME}
        </text>
      ))}
    </g>
  );
};

/**
 * YouTube channel art (2560x1440). The name and the gag sit inside the safe
 * area every device shows; desktops add the landmarks either side, TVs the
 * whole sky and lawn.
 */
export const ChannelBanner: React.FC = () => {
  useJapanAssets();
  const mascotX = X0 + 9 * SP + 12;
  const caveSign = { x: X0 + 8 * SP + SIGN.x * S, y: GROUND + SIGN.y * S };
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: W, height: H, objectFit: "cover" }} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={0} />
        <g filter="url(#wobble)">
          <Shade d={`M0,0 H${W} V900 H0 Z`} fill={C.sky} opacity={0.38} />
          <Sun x={2474} y={598} r={40} f={0} />
          <Cloud x={330} y={585} w={210} h={70} seed={2} />
          <Cloud x={760} y={330} w={260} h={80} seed={5} />
          <Cloud x={1520} y={250} w={300} h={90} seed={7} />
          <Cloud x={2140} y={380} w={240} h={76} seed={3} />
          <Birds x={1990} y={560} f={0} n={3} dx={0} />
          <Birds x={420} y={300} f={10} n={2} dx={0} />

          <Pyramid x={250} y={884} h={240} w={180} />
          <Pyramid x={430} y={884} h={128} w={104} />
          <Palm x={80} y={890} />
          <Pisa x={2180} y={892} />
          <Moai x={2368} y={902} />
          <Hills />
          <Lawn />

          <Title />
          <Sparkle x={690} y={548} s={1.1} />
          <Sparkle x={1876} y={560} s={0.9} />

          {LINEUP.map((slot, i) => (
            <Holder key={i} slot={slot} x={X0 + i * SP} />
          ))}
          <g transform={`translate(${mascotX},${GROUND - 178 * S}) scale(${-S},${S})`}>
            <Mascot mood="wow" look={[0.75, -0.7]} legs />
          </g>
          <Question x={(caveSign.x + mascotX) / 2 + 22} y={caveSign.y - 6} s={1} size={64} rot={12} />
        </g>
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("japan/grain.jpg")})`,
          backgroundSize: "768px 768px",
          mixBlendMode: "multiply",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};
