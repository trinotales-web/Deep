import { z } from "zod";

/** Audio levels that can be changed in Remotion Studio's Props panel (1 = as mixed). */
export const japanAudioSchema = z.object({
  musicVolume: z.number().min(0).max(2),
  narrationVolume: z.number().min(0).max(2),
});

export type JapanAudioProps = z.infer<typeof japanAudioSchema>;

export const defaultAudioProps: JapanAudioProps = { musicVolume: 1, narrationVolume: 1 };
