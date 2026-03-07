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

const ExperienceSchema = z.object({
  company: z.string().max(200),
  title: z.string().max(200),
  logoUrl: optionalUrl,
  startDate: z.string().max(20).optional().nullable(),
  endDate: z.string().max(20).optional().nullable(),
  current: z.boolean().optional(),
});

/** Schema for user profile updates. */
export const UserProfileUpdateSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional(),
  name: z.string().max(200).optional(),
  avatarUrl: optionalUrl,
  bio: z.string().max(500).optional(),
  experience: z.array(ExperienceSchema).max(20).optional().nullable(),
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
});

export type UserProfileUpdateInput = z.infer<typeof UserProfileUpdateSchema>;
