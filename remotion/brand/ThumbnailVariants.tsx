import React from "react";
import { blobD, ellipseD, Ink, Pencil, Pt, Puff, Shade, Sparkle } from "../japan/draw";
import { Person } from "../japan/Person";
import { Castle, Boom } from "../japan/Props3";
import { Steamship } from "../japan/Props8";
import { C, rand } from "../japan/theme";
import { KatanaGrip, Limb, MarkerLine, Petal, Sweat, ThumbnailFrame, Title, TH as H, TW as W } from "./thumbParts";

/**
 * Alternative thumbnails for "History of Japan", each built on a different
 * click trigger, for A/B testing: shock at the black ships, a samurai who has
 * just sliced the title, and a ninja under the moon.
 */

type TitleProps = { kicker: string; title: string };

const Wobble: React.FC<{ children: React.ReactNode; sticker?: "sticker" | "stickerThin" }> = ({ children, sticker }) =>
  sticker ? (
    <g filter={`url(#${sticker})`}>
      <g filter="url(#wobble)">{children}</g>
    </g>
  ) : (
    <g filter="url(#wobble)">{children}</g>
  );

/** A figure from the cast, scaled about its head so it can be framed as a close-up. */
const CloseUp: React.FC<{ head: Pt; zoom: number; children: React.ReactNode }> = ({ head, zoom, children }) => (
  <g transform={`translate(${head[0]},${head[1] + 178 * zoom}) scale(${zoom})`}>{children}</g>
);

/* ------------------------------------------------------------------ */
/** 1. Shock: a samurai panics as the black ships loom out of the sunset. */
export const JapanThumbnailShips: React.FC<TitleProps> = ({ kicker, title }) => {
  const horizon = 488;
  const head: Pt = [1012, 300];
  return (
    <ThumbnailFrame>
      <defs>
        <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe6bd" />
          <stop offset="0.5" stopColor="#f6ad6a" />
          <stop offset="1" stopColor="#e5643e" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={horizon + 10} fill="url(#sunset)" opacity={0.9} />
      <Wobble>
        {/* the low sun, so the ships stand out black against it */}
        <Pencil d={ellipseD(330, horizon - 10, 170)} fill="#ffe6a0" ink={false} off={[0, 0]} />
        <Pencil d={`M-20,${horizon} Q320,${horizon - 8} 640,${horizon} T${W + 20},${horizon - 4} L${W + 20},${H + 20} L-20,${H + 20} Z`} fill="#3d6896" sw={4} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Ink key={i} d={`M${250 - i * 14},${horizon + 22 + i * 26} L${410 + i * 14},${horizon + 22 + i * 26}`} sw={6} color="#ffe6a0" opacity={0.75 - i * 0.1} />
        ))}
        <Steamship x={108} y={532} s={0.3} f={30} />
        <Steamship x={668} y={510} s={0.22} f={12} />
        <Steamship x={330} y={652} s={0.82} f={6} />
        {/* a blank fired in greeting (or warning) */}
        <Boom x={548} y={626} p={0.32} size={70} seed={3} />
        <Puff x={600} y={612} p={0.5} size={44} fill="#ece6da" seed={4} />
        <Puff x={644} y={598} p={0.42} size={34} fill="#ece6da" seed={8} />
      </Wobble>

      <Wobble sticker="sticker">
        <CloseUp head={head} zoom={2.5}>
          <Person x={0} y={0} tribe="samurai" expr="shock" f={0} blinkOff noArms look={[-0.85, 0.15]} />
          <Limb from={[-30, -126]} to={[-66, -180]} color={C.indigo} hand />
          <Limb from={[30, -126]} to={[66, -184]} color={C.indigo} hand />
        </CloseUp>
      </Wobble>
      <Wobble>
        <Sweat x={head[0] - 196} y={head[1] - 138} s={1.6} rot={-35} />
        <Sweat x={head[0] - 232} y={head[1] - 62} s={1.2} rot={-60} />
        <Sweat x={head[0] + 200} y={head[1] - 150} s={1.4} rot={35} />
        <Title kicker={kicker} title={title} x={40} y={34} titleInk={{ fill: "#fffaf0", outline: "#15161d" }} />
      </Wobble>
    </ThumbnailFrame>
  );
};

/* ------------------------------------------------------------------ */
/** The title word cut in two along a line, the halves pushed apart, with the slash across it. */
const SlicedTitle: React.FC<{ text: string; x: number; y: number; cap: number; a: Pt; b: Pt }> = ({ text, x, y, cap, a, b }) => {
  // extend the cut right across the frame
  const slope = (b[1] - a[1]) / (b[0] - a[0]);
  const yAt = (px: number) => a[1] + (px - a[0]) * slope;
  const above = `M0,0 H${W} V${yAt(W)} L0,${yAt(0)} Z`;
  const below = `M0,${yAt(0)} L${W},${yAt(W)} V${H} H0 Z`;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n: Pt = [(a[1] - b[1]) / len, (b[0] - a[0]) / len]; // perpendicular, pointing up
  const shift = 15;
  const line = <MarkerLine text={text} x={x} y={y} cap={cap} seed={9} ink={{ fill: "#fffaf0", outline: "#15161d" }} />;
  const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const streak = `M${a[0]},${a[1]} Q${mid[0] + n[0] * 26},${mid[1] + n[1] * 26} ${b[0]},${b[1]} Q${mid[0] - n[0] * 6},${mid[1] - n[1] * 6} ${a[0]},${a[1]} Z`;
  return (
    <g>
      <clipPath id="cutAbove">
        <path d={above} />
      </clipPath>
      <clipPath id="cutBelow">
        <path d={below} />
      </clipPath>
      <g clipPath="url(#cutAbove)">
        <g transform={`translate(${n[0] * shift - 4},${n[1] * shift})`}>{line}</g>
      </g>
      <g clipPath="url(#cutBelow)">
        <g transform={`translate(${-n[0] * shift + 4},${-n[1] * shift})`}>{line}</g>
      </g>
      <path d={streak} fill="#ffffff" opacity={0.75} filter="url(#glow)" />
      <path d={streak} fill="#ffffff" />
    </g>
  );
};

/** 2. Action: the samurai has just cut the title in half, and is very pleased with himself. */
export const JapanThumbnailSlash: React.FC<TitleProps> = ({ kicker, title }) => {
  const head: Pt = [1010, 318];
  return (
    <ThumbnailFrame>
      <rect x={0} y={0} width={W} height={H} fill="#c9362b" opacity={0.93} />
      <Wobble>
        {/* the flag's sun, behind him */}
        <Pencil d={ellipseD(head[0] + 6, head[1] + 24, 272)} fill="#f6ecd6" sw={5} />
        {Array.from({ length: 16 }, (_, i) => {
          const x = 30 + rand(i * 3 + 201) * 700;
          const y = 400 + rand(i * 3 + 202) * 300;
          return <Petal key={i} x={x} y={y} s={1.1 + rand(i * 3 + 203) * 1.1} rot={rand(i + 77) * 360} fill="#f3b8b0" />;
        })}
      </Wobble>

      <Wobble sticker="sticker">
        <CloseUp head={head} zoom={2.5}>
          <Person x={0} y={0} tribe="samurai" expr="happy" f={0} noArms />
          <KatanaGrip low={[34, -96]} angle={165} arm={C.indigo} length={250} />
        </CloseUp>
      </Wobble>
      <Wobble>
        <Sparkle x={560} y={660} s={1.6} color="#ffffff" />
        <Title
          kicker={kicker}
          title={title}
          x={40}
          y={34}
          halo="none"
          kickerInk={{ fill: "#fffaf0", outline: "#15161d" }}
          renderTitle={({ x, y, cap }) => <SlicedTitle text={title} x={x} y={y} cap={cap} a={[6, 352]} b={[800, 196]} />}
        />
      </Wobble>
    </ThumbnailFrame>
  );
};

/* ------------------------------------------------------------------ */
/** A four-pointed throwing star, spinning, with motion streaks behind it. */
const Shuriken: React.FC<{ x: number; y: number; s: number; rot: number }> = ({ x, y, s, rot }) => (
  <g>
    {[0, 1, 2].map((k) => (
      <Ink key={k} d={`M${x + 26 * s},${y - 10 * s + k * 10 * s} L${x + (90 + k * 30) * s},${y - 10 * s + k * 10 * s}`} sw={3} color="#dfe6f5" opacity={0.6} />
    ))}
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Pencil d="M0,-30 L7,-7 L30,0 L7,7 L0,30 L-7,7 L-30,0 L-7,-7 Z" fill="#b9c2d1" sw={3} />
      <path d={ellipseD(0, 0, 5)} fill="#2b2b35" />
    </g>
  </g>
);

/** 3. Mystery: a ninja under a giant moon over a sleeping castle. */
export const JapanThumbnailNinja: React.FC<TitleProps> = ({ kicker, title }) => {
  const head: Pt = [1010, 330];
  return (
    <ThumbnailFrame vignette="dark">
      <defs>
        <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141b38" />
          <stop offset="1" stopColor="#2c3a68" />
        </linearGradient>
        <linearGradient id="castleShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1c2550" stopOpacity={0.85} />
          <stop offset="0.62" stopColor="#1c2550" stopOpacity={0.85} />
          <stop offset="1" stopColor="#1c2550" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="moonGlow" cx="0.79" cy="0.46" r="0.42">
          <stop offset="0" stopColor="#fff3cc" stopOpacity={0.5} />
          <stop offset="1" stopColor="#fff3cc" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#night)" />
      <rect x={0} y={0} width={W} height={H} fill="url(#moonGlow)" />
      <Wobble>
        {Array.from({ length: 34 }, (_, i) => {
          const x = rand(i * 2 + 301) * W;
          const y = rand(i * 2 + 302) * 420;
          return i % 5 === 0 ? <Sparkle key={i} x={x} y={y} s={0.45} color="#f4ecd2" /> : <path key={i} d={ellipseD(x, y, 2.2)} fill="#f4ecd2" opacity={0.8} />;
        })}
        <Pencil d={ellipseD(head[0] + 6, head[1] + 10, 270)} fill="#f3e6bd" sw={4} ink="#c9b98a" />
        {[
          [880, 190, 34],
          [1150, 260, 22],
          [1100, 470, 40],
          [880, 520, 18],
        ].map(([x, y, r], i) => (
          <Shade key={i} d={ellipseD(x, y, r, r * 0.8)} fill="#d8c896" opacity={0.6} />
        ))}
        {/* the castle asleep in the dark */}
        <g opacity={0.5}>
          <Castle x={250} y={760} s={1.05} />
        </g>
        {/* night falls on the castle */}
        <rect x={0} y={300} width={700} height={420} fill="url(#castleShade)" style={{ mixBlendMode: "multiply" }} />
        <rect x={0} y={520} width={W} height={200} fill="#1a2348" opacity={0.25} />
        {[0, 1, 2].map((i) => (
          <Shade key={i} d={blobD(180 + i * 360, 690 - (i % 2) * 20, 260, 46, i + 2, 7, 0.12)} fill="#c9d3ef" opacity={0.18} />
        ))}
      </Wobble>

      <Wobble sticker="stickerThin">
        <CloseUp head={head} zoom={2.6}>
          <Person x={0} y={0} tribe="ninja" expr="angry" f={0} blinkOff noArms look={[-0.6, 0]} />
          {/* a kunai raised by the face; the other hand has just thrown */}
          <Pencil d="M58,-196 L66,-196 L63,-252 Z" fill="#cfd6e2" sw={3} />
          <Pencil d="M57,-194 L67,-194 L66,-166 L58,-166 Z" fill="#2b2b35" sw={2.5} />
          <Limb from={[30, -126]} to={[62, -174]} color="#2f3346" hand />
          <Limb from={[-30, -126]} to={[-72, -112]} color="#2f3346" hand />
        </CloseUp>
      </Wobble>
      <Wobble>
        <Shuriken x={790} y={418} s={1.05} rot={18} />
        <Shuriken x={660} y={470} s={0.85} rot={40} />
        <Shuriken x={548} y={430} s={0.7} rot={5} />
        <Title kicker={kicker} title={title} x={40} y={34} halo="dark" kickerInk={{ fill: "#f6f1e4" }} titleInk={{ fill: "#e2382d", outline: "#f6f1e4" }} />
      </Wobble>
    </ThumbnailFrame>
  );
};
