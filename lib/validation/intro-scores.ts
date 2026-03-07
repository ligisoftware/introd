import { z } from "zod";

const bulletArray = z
  .array(z.string().max(500))
  .max(4)
  .nullable()
  .optional()
  .transform((v) => (Array.isArray(v) ? v : []));

/** LLM response schema: signal score, summary, and founder/startup subscores with rationales. */
export const IntroScoresResponseSchema = z.object({
  signalScore: z.number().int().min(0).max(10),
  summary: z.string().min(1).max(1000),
  founderScore: z.number().int().min(1).max(10).nullable(),
  founderRationale: z.string().max(500).nullable().optional(),
  founderBullets: bulletArray,
  startupScore: z.number().int().min(1).max(10).nullable(),
  startupRationale: z.string().max(500).nullable().optional(),
  startupBullets: bulletArray,
});

export type IntroScoresResponse = z.infer<typeof IntroScoresResponseSchema>;
