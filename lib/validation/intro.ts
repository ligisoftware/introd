import { z } from "zod";

/** Optional URL or empty string (for clearing the field). */
const optionalUrl = z
  .string()
  .max(2048)
  .optional()
  .transform((s) => (s === "" ? undefined : s))
  .refine((s) => s === undefined || s === "" || isValidUrl(s), {
    message: "Must be a valid URL or empty",
  });

function isValidUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

/** Schema for intro updates. */
export const IntroUpdateSchema = z.object({
  startupName: z.string().max(200).optional(),
  startupOneLiner: z.string().max(300).optional(),
  role: z.string().max(100).optional(),
  introText: z.string().max(1000).optional(),
  websiteUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
  avatarUrl: optionalUrl,
});

export type IntroUpdateInput = z.infer<typeof IntroUpdateSchema>;
