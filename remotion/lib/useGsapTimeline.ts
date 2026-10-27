import { useEffect, useMemo } from "react";
import gsap from "gsap";
import { useCurrentFrame, useVideoConfig } from "remotion";

type NumericState = Record<string, number>;

/**
 * Frame-driven GSAP timeline for Remotion.
 *
 * GSAP normally advances on requestAnimationFrame, which flickers in Remotion
 * renders. Here the timeline is created paused and seeked to the current
 * frame's time on every render, so GSAP easing and sequencing stay
 * deterministic. Tween plain values in `state`, then feed them to Three.js
 * props or styles.
 */
export const useGsapTimeline = <T extends NumericState>(
  initial: T,
  build: (tl: gsap.core.Timeline, state: T) => void,
): T => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { tl, state } = useMemo(() => {
    const state = { ...initial };
    const tl = gsap.timeline({ paused: true });
    build(tl, state);
    return { tl, state };
    // Timeline is built once; rebuild by remounting the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => void tl.kill(), [tl]);

  tl.seek(frame / fps, true);
  return { ...state };
};
