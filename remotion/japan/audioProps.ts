import { z } from "zod";

/** Audio levels that can be changed in Remotion Studio's Props panel (1 = as mixed). */
export const japanAudioSchema = z.object({
  musicVolume: z.number().min(0).max(2),
  narrationVolume: z.number().min(0).max(2),
});

export type JapanAudioProps = z.infer<typeof japanAudioSchema>;

export const defaultAudioProps: JapanAudioProps = { musicVolume: 1, narrationVolume: 1 };

/**
 * The film's balance: voice at 200% against music at 75%. Remotion has no
 * limiter, so a voice above 100% would clip; the same ratio is kept by
 * lowering the music instead (0.75 / 2).
 */
export const storyAudioProps: JapanAudioProps = { musicVolume: 0.375, narrationVolume: 1 };

/** Extra options a part takes when it is stitched into the seamless film. */
export type JapanPartProps = JapanAudioProps & {
  /** Keep the caption strip up at the end (the next part carries on). */
  seamless?: boolean;
  /** Leave out the part's title card (the film shows one title, at the start). */
  skipTitle?: boolean;
  /** Replaces the opening title's subtitle (Part 1 only). */
  introSubtitle?: string;
  /** The stretch of the part (in its own frames) that the film uses; the music fades in and out at its edges. */
  musicWindow?: [number, number];
  /** Frame by which the captions have cleared, ahead of the cut to the next part. */
  captionsClearBy?: number;
};

/** Music gain at a part's frame: a short fade in after the window opens, a 1 s fade out before it closes. */
export const musicGain = (frame: number, window?: [number, number]) =>
  window ? Math.max(0, Math.min(1, (frame - window[0]) / 12, (window[1] - frame) / 30)) : 1;
