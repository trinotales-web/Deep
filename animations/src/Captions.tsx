import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
} from "@remotion/captions";

// Higher = more words on screen at once.
const SWITCH_CAPTIONS_EVERY_MS = 1200;
const HIGHLIGHT_COLOR = "#ffb547";

export const Captions: React.FC<{ src: string }> = ({ src }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(src);
      setCaptions(await response.json());
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [src, continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const pages = useMemo(() => {
    if (!captions) return [];
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    }).pages;
  }, [captions]);

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.round(
          Math.min(
            nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
            ((page.startMs + SWITCH_CAPTIONS_EVERY_MS) / 1000) * fps,
          ),
        );
        if (endFrame <= startFrame) return null;
        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={endFrame - startFrame}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}
    >
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 72,
          fontWeight: 800,
          color: "white",
          whiteSpace: "pre",
          textShadow: "0 4px 16px rgba(0,0,0,0.6)",
        }}
      >
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          return (
            <span
              key={token.fromMs}
              style={{ color: isActive ? HIGHLIGHT_COLOR : "white" }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
