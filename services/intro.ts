import type { SupabaseClient } from "@supabase/supabase-js";
import type { Intro } from "@/types";
import { getByUserId, create, update } from "@/repositories/intros";
import type { IntroUpdateRow } from "@/repositories/intros";
import { IntroUpdateSchema, type IntroUpdateInput } from "@/lib/validation/intro";

/**
 * Gets or auto-creates a single intro for the user.
 */
export async function getCurrentIntro(supabase: SupabaseClient, userId: string): Promise<Intro> {
  const existing = await getByUserId(supabase, userId);
  if (existing) return existing;

  return create(supabase, userId);
}

/**
 * Validates intro payload and updates only intro columns.
 */
export async function updateIntro(
  supabase: SupabaseClient,
  introId: string,
  payload: IntroUpdateInput,
  keys: (keyof IntroUpdateInput)[]
): Promise<Intro> {
  const parsed = IntroUpdateSchema.parse(payload);
  const row: IntroUpdateRow = {};

  if (keys.includes("startupName")) {
    row.startup_name = parsed.startupName ?? null;
  }
  if (keys.includes("startupOneLiner")) {
    row.startup_one_liner = parsed.startupOneLiner ?? null;
  }
  if (keys.includes("role")) {
    row.role = parsed.role ?? null;
  }
  if (keys.includes("introText")) {
    row.intro_text = parsed.introText ?? null;
  }
  if (keys.includes("websiteUrl")) {
    row.website_url = parsed.websiteUrl ?? null;
  }
  if (keys.includes("linkedinUrl")) {
    row.linkedin_url = parsed.linkedinUrl ?? null;
  }
  if (keys.includes("twitterUrl")) {
    row.twitter_url = parsed.twitterUrl ?? null;
  }
  if (keys.includes("logoUrl")) {
    row.logo_url = parsed.logoUrl ?? null;
  }
  if (keys.includes("foundedDate")) {
    row.founded_date = parsed.foundedDate ?? null;
  }
  if (keys.includes("fundingRounds")) {
    row.funding_rounds = parsed.fundingRounds ?? null;
  }

  return update(supabase, introId, row);
}
