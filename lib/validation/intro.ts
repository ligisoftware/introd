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

const optionalShortText = z
  .string()
  .max(50)
  .optional()
  .transform((s) => (s === "" ? undefined : s));

const FundingRoundSchema = z.object({
  type: z.enum(["round", "safe"]).optional(),
  roundName: z.string().min(1).max(100),
  amount: optionalShortText,
  date: z
    .string()
    .max(10)
    .optional()
    .transform((s) => (s === "" ? undefined : s)),
  postValuation: optionalShortText,
  valuationCap: optionalShortText,
});

/** Schema for intro updates. */
export const IntroUpdateSchema = z.object({
  startupName: z.string().max(200).optional(),
  startupOneLiner: z.string().max(300).optional(),
  role: z.string().max(100).optional(),
  introText: z
    .string()
    .optional()
    .refine((s) => !s || s.trim().split(/\s+/).length <= 500, {
      message: "Intro must be 500 words or fewer",
    }),
  websiteUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
  logoUrl: optionalUrl,
  foundedDate: z
    .string()
    .max(10)
    .optional()
    .transform((s) => (s === "" ? undefined : s))
    .refine((s) => s === undefined || /^\d{4}-\d{2}-\d{2}$/.test(s), {
      message: "Must be a valid date (YYYY-MM-DD)",
    }),
  showOwnerEmail: z.boolean().optional(),
  ownerStartDate: z
    .string()
    .max(10)
    .optional()
    .transform((s) => (s === "" ? undefined : s))
    .refine((s) => s === undefined || /^\d{4}-\d{2}-\d{2}$/.test(s), {
      message: "Must be a valid date (YYYY-MM-DD)",
    }),
  fundingRounds: z.array(FundingRoundSchema).max(20).optional(),
});

export type IntroUpdateInput = z.infer<typeof IntroUpdateSchema>;
