import type { SupabaseClient } from "@supabase/supabase-js";
import type { Founder } from "@/types";
import { getByAuthUserId, create, updateProfile } from "@/repositories/founders";
import type { FounderProfileUpdateRow } from "@/repositories/founders";
import {
  FounderProfileUpdateSchema,
  type FounderProfileUpdateInput,
} from "@/lib/validation/founder-profile";

/**
 * Returns the current founder for the request: session → existing row or first-login create.
 * Uses the server Supabase client so auth and RLS apply.
 */
export async function getCurrentFounder(supabase: SupabaseClient): Promise<Founder | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const existing = await getByAuthUserId(supabase, user.id);
  if (existing) return existing;

  const email = user.email ?? null;
  if (!email) return null;

  const created = await create(supabase, user.id, email);
  return created;
}

/**
 * Validates profile payload with Zod and updates only profile columns (and updated_at).
 * Does not allow updating auth_user_id or email.
 */
export async function updateFounderProfile(
  supabase: SupabaseClient,
  founderId: string,
  payload: FounderProfileUpdateInput
): Promise<Founder> {
  const parsed = FounderProfileUpdateSchema.parse(payload);
  const row: FounderProfileUpdateRow = {
    display_name: parsed.displayName ?? null,
    role: parsed.role ?? null,
    startup_name: parsed.startupName ?? null,
    startup_one_liner: parsed.startupOneLiner ?? null,
    bio: parsed.bio ?? null,
    website_url: parsed.websiteUrl ?? null,
    linkedin_url: parsed.linkedinUrl ?? null,
    twitter_url: parsed.twitterUrl ?? null,
  };
  return updateProfile(supabase, founderId, row);
}
