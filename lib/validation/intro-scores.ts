import { z } from "zod";

const bulletArray = z
  .array(z.string().max(500))
  .max(4)
  .nullable()
  .optional()
  .transform((v) => (Array.isArray(v) ? v : []));

/** LLM response schema: summary + founder and startup scores with optional bullets. */
export const IntroScoresResponseSchema = z.object({
  summary: z.string().min(1).max(1000),
  founderScore: z.number().int().min(1).max(10).nullable(),
  founderBullets: bulletArray,
  startupScore: z.number().int().min(1).max(10).nullable(),
  startupBullets: bulletArray,
});

export type IntroScoresResponse = z.infer<typeof IntroScoresResponseSchema>;
