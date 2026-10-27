import { useMemo } from "react";
import gsap from "gsap";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { TikTokPage } from "@remotion/captions";
import { useCaptionsFile } from "./Captions";
import { FONT } from "../toon/fonts";
import { INK } from "../toon/materials";

const COMBINE_MS = 700;
const EMPHASIS = "#e8392c";
const popEase = gsap.parseEase("back.out(3)");

// Ink rim around each glyph (text-shadow ring) plus a soft drop shadow.
const RIM = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return `${(Math.cos(a) * 4).toFixed(1)}px ${(Math.sin(a) * 4).toFixed(1)}px 0 ${INK}`;
})
  .concat(`0 6px 10px rgba(0,0,0,0.35)`)
  .join(",");

const Page: React.FC<{ page: TikTokPage; fontSize: number }> = ({ page, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = page.startMs + (frame / fps) * 1000;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize,
        letterSpacing: 1,
        wordSpacing: fontSize * 0.25,
        textTransform: "uppercase",
        whiteSpace: "pre",
        color: "white",
        textShadow: RIM,
        textAlign: "center",
      }}
    >
      {page.tokens.map((token) => {
        if (token.fromMs > t) return null;
        const emphasis = /\*/.test(token.text);
        const p = Math.min(1, (t - token.fromMs) / 160);
        return (
          <span
            key={token.fromMs}
            style={{
              display: "inline-block",
              transform: `scale(${0.6 + 0.4 * popEase(p)})`,
              color: emphasis ? EMPHASIS : "white",
            }}
          >
            {token.text.replace(/\*/g, "")}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Short-form documentary captions: 1-3 words at a time, words pop in as they are
 * spoken, and words wrapped in *asterisks* in the JSON are highlighted red.
 */
export const ShortsCaptions: React.FC<{ src: string; centerY?: number; fontSize?: number }> = ({
  src,
  centerY = 0.67,
  fontSize = 54,
}) => {
  const { fps, height } = useVideoConfig();
  const captions = useCaptionsFile(src);
  const pages = useMemo(
    () =>
      captions
        ? createTikTokStyleCaptions({
            captions,
            combineTokensWithinMilliseconds: COMBINE_MS,
            breakOnSilenceAfterMilliseconds: 200,
          }).pages
        : [],
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const last = page.tokens[page.tokens.length - 1];
        const endMs = Math.min(next ? next.startMs : Infinity, (last?.toMs ?? page.startMs) + 700);
        const from = Math.round((page.startMs / 1000) * fps);
        const dur = Math.round((endMs / 1000) * fps) - from;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <AbsoluteFill style={{ top: height * centerY - fontSize, height: fontSize * 2, alignItems: "center" }}>
              <Page page={page} fontSize={fontSize} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
