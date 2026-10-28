import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useDelayRender, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/fonts";
import type { Caption } from "@remotion/captions";
import { CAPTION_RED } from "../style";

// Reference caption style: heavy uppercase Montserrat, white with a hard dark
// drop shadow, the phrase builds up word by word (layout stays fixed), each new
// word pops in slightly larger, keywords in coral red.

const FONT = "Montserrat";
let fontPromise: Promise<unknown> | null = null;
const ensureFont = () => {
  fontPromise ??= Promise.all([
    loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-900-normal.woff2"), weight: "900" }),
    loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-800-normal.woff2"), weight: "800" }),
  ]);
  return fontPromise;
};

export type CaptionPage = { startMs: number; endMs: number; words: Caption[] };

/**
 * Group words into pages. Pass `pageStartsMs` to break exactly at phrase
 * starts; otherwise a new page starts after a pause or every `maxWords`.
 */
export const paginate = (captions: Caption[], opts: { pageStartsMs?: number[]; maxWords?: number; pauseMs?: number } = {}) => {
  const { pageStartsMs, maxWords = 3, pauseMs = 350 } = opts;
  const pages: CaptionPage[] = [];
  let cur: Caption[] = [];
  const flush = () => {
    if (cur.length) pages.push({ startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs, words: cur });
    cur = [];
  };
  captions.forEach((c, i) => {
    const prev = captions[i - 1];
    const breakHere = pageStartsMs
      ? pageStartsMs.includes(c.startMs) || pageStartsMs.some((p) => prev && prev.startMs < p && c.startMs >= p)
      : cur.length >= maxWords || (prev && (c.startMs - prev.endMs > pauseMs || /[.,?!;:]$/.test(prev.text.trim().replace(/\*/g, ""))));
    if (breakHere) flush();
    cur.push(c);
  });
  flush();
  return pages;
};

const clean = (t: string) => t.trim().replace(/\*/g, "");
const norm = (t: string) => clean(t).toLowerCase().replace(/[^a-z0-9']/g, "");

export type StyledCaptionsProps = {
  captions: Caption[];
  pageStartsMs?: number[];
  /** Extra words to color red (case-insensitive, punctuation ignored). */
  highlights?: string[];
  /** Vertical position of the caption center, 0 (top) .. 1 (bottom). */
  y?: number;
  /** Font size as a fraction of the frame's short side. */
  size?: number;
  /** Keep the last page on screen this long after its last word (ms). */
  holdMs?: number;
  maxWords?: number;
};

export const StyledCaptions: React.FC<StyledCaptionsProps> = ({
  captions,
  pageStartsMs,
  highlights = [],
  y,
  size = 0.05,
  holdMs = 450,
  maxWords = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading caption font"));
  useEffect(() => {
    ensureFont().then(() => continueRender(handle)).catch(cancelRender);
  }, [handle, continueRender, cancelRender]);

  const pages = useMemo(() => paginate(captions, { pageStartsMs, maxWords }), [captions, pageStartsMs, maxWords]);
  const hl = useMemo(() => new Set(highlights.map(norm)), [highlights]);
  const nowMs = (frame / fps) * 1000;

  const pageIndex = pages.findIndex((p, i) => {
    const next = pages[i + 1];
    const end = Math.min(next ? next.startMs : Infinity, p.endMs + holdMs);
    return nowMs >= p.startMs && nowMs < end;
  });
  if (pageIndex < 0) return null;
  const page = pages[pageIndex];

  const fontSize = Math.round(Math.min(width, height) * size);
  const wide = width > height;
  const centerY = (y ?? (wide ? 0.84 : 0.695)) * height;
  const shadow = Math.max(2, Math.round(fontSize * 0.075));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: width * 0.06,
          right: width * 0.06,
          top: centerY,
          transform: "translateY(-50%)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: fontSize * 0.55,
          rowGap: fontSize * 0.1,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize,
          lineHeight: 1.1,
          letterSpacing: fontSize * 0.01,
          textTransform: "uppercase",
        }}
      >
        {page.words.map((w, i) => {
          const visible = nowMs >= w.startMs;
          const age = ((nowMs - w.startMs) / 1000) * fps; // frames since spoken
          const pop = visible ? interpolate(age, [0, 4], [1.15, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }) : 1;
          const red = /\*/.test(w.text) || hl.has(norm(w.text));
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: visible ? 1 : 0,
                transform: `scale(${pop})`,
                transformOrigin: "50% 60%",
                color: red ? CAPTION_RED : "#ffffff",
                textShadow: [
                  `0 ${shadow}px 0 #1d1519`,
                  `${shadow * 0.5}px ${shadow}px 0 #1d1519`,
                  `0 0 ${shadow * 1.6}px rgba(20,12,16,0.65)`,
                ].join(", "),
                WebkitTextStroke: `${Math.max(1, fontSize * 0.02)}px #1d1519`,
                paintOrder: "stroke fill",
              }}
            >
              {clean(w.text)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
