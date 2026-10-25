import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT_HAND, INK, ip, NARRATION_OFFSET, sec } from "./theme";
import { Defs } from "./draw";
import { WORDS_P1 } from "./words-part1";

/** One full-frame drawing. Ink + pencil inside get the line-boil wobble. */
export const SceneSvg: React.FC<{ f: number; children: React.ReactNode; boil?: number }> = ({ f, children, boil }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <Defs frame={f} boil={boil} />
    <g filter="url(#wobble)">{children}</g>
  </svg>
);

/** Shows a scene between [from, to) frames, cross-fading in over `xf` frames. */
export const Shot: React.FC<{ f: number; from: number; to: number; xf?: number; children: React.ReactNode }> = ({
  f,
  from,
  to,
  xf = 8,
  children,
}) => {
  if (f < from || f >= to + xf) return null;
  const o = xf > 0 ? ip(f, [from, from + xf], [0, 1]) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const PaperBg: React.FC = () => (
  <AbsoluteFill>
    <Img src={staticFile("japan/paper.jpg")} style={{ width: 1920, height: 1080 }} />
  </AbsoluteFill>
);

/** Final multiply grain so every layer sits on the same sheet of paper. */
export const GrainOverlay: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `url(${staticFile("japan/grain.jpg")})`,
      backgroundSize: "768px 768px",
      mixBlendMode: "multiply",
      opacity: 0.55,
      pointerEvents: "none",
    }}
  />
);

// Caption phrases as [firstWord, lastWord] indices into WORDS_P1.
const PHRASES: [number, number][] = [
  [0, 6], [7, 13], [14, 22], [23, 26], [27, 31], [32, 37], [38, 42], [43, 47], [48, 55], [56, 64], [65, 71],
  [72, 80], [81, 90], [91, 95], [96, 102], [103, 109], [110, 118], [119, 124], [125, 130], [131, 135],
  [136, 140], [141, 142], [143, 152],
];

const KEY_COLORS: Record<string, string> = {
  jomon: C.terracotta,
  yayoi: C.indigo,
  japan: C.red,
  japanese: C.red,
  volcanoes: C.red,
  erupted: C.red,
  tsunamis: C.deepSea,
  earthquakes: C.brown,
  rice: "#b58b1f",
  iron: "#5d636e",
  bronze: "#b0742a",
  mixed: "#8a4f9e",
  one: "#8a4f9e",
};

const strip = (w: string) => w.toLowerCase().replace(/[^a-z]/g, "");

/** Storybook caption typed on in time with the narration. */
export const Captions: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 30 - NARRATION_OFFSET;
  let active = -1;
  for (let i = 0; i < PHRASES.length; i++) {
    const start = WORDS_P1[PHRASES[i][0]][1] - 0.12;
    const nextStart = i + 1 < PHRASES.length ? WORDS_P1[PHRASES[i + 1][0]][1] - 0.12 : Infinity;
    const end = Math.min(nextStart, WORDS_P1[PHRASES[i][1]][2] + 1.4);
    if (t >= start && t < end) active = i;
  }
  if (active < 0) return null;
  const [a, b] = PHRASES[active];
  const phraseEnd = WORDS_P1[b][2] + 1.4;
  const nextStart = active + 1 < PHRASES.length ? WORDS_P1[PHRASES[active + 1][0]][1] - 0.12 : Infinity;
  const fadeOut = nextStart < phraseEnd ? 1 : ip(t, [phraseEnd - 0.35, phraseEnd], [1, 0]);
  const words = WORDS_P1.slice(a, b + 1);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 34,
        textAlign: "center",
        fontFamily: FONT_HAND,
        fontSize: 60,
        color: INK,
        opacity: fadeOut,
        letterSpacing: 0.5,
      }}
    >
      {words.map(([word, s, e], i) => {
        const p = ip(t, [s, Math.max(s + 0.08, s + (e - s) * 0.8)], [0, 1], (x) => x);
        const n = Math.ceil(word.length * p);
        const key = KEY_COLORS[strip(word)];
        return (
          <span key={i} style={{ color: key ?? INK }}>
            {word.split("").map((ch, j) => (
              <span key={j} style={{ opacity: j < n ? 1 : 0 }}>
                {ch}
              </span>
            ))}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

/** Torn paper strip along the bottom that carries the captions. */
export const CaptionStrip: React.FC<{ f: number; show: number }> = ({ f, show }) => {
  if (show <= 0) return null;
  const pts: string[] = [];
  for (let x = -20; x <= 1940; x += 24) {
    const y = 930 + Math.sin(x * 0.031) * 4 + Math.sin(x * 0.17 + 2) * 2.5 + ((x * 7919) % 13) * 0.35;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  const d = `M-20,1100 L${pts.join(" L")} L1940,1100 Z`;
  const slide = (1 - show) * 170;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `translateY(${slide}px)` }}>
      <defs>
        <pattern id="paperPat" width="1920" height="1080" patternUnits="userSpaceOnUse">
          <image href={staticFile("japan/paper.jpg")} width="1920" height="1080" />
        </pattern>
        <filter id="stripShadow" x="-5%" y="-30%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path d={d} fill="#3b2f20" opacity={0.22} transform="translate(0,-6)" filter="url(#stripShadow)" />
      <path d={d} fill="url(#paperPat)" />
      <path d={d} fill={C.white} opacity={0.25} />
    </svg>
  );
};

export const sceneAt = (s: number) => sec(s);
