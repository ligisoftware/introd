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

  try {
    const created = await create(supabase, user.id, email);
    return created;
  } catch (err: unknown) {
    // Race condition: another concurrent request already created the row.
    // Re-fetch instead of crashing.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return getByAuthUserId(supabase, user.id);
    }
    throw err;
  }
}

/**
 * Validates profile payload with Zod and updates only profile columns (and updated_at).
 * Does not allow updating auth_user_id or email.
 */
export async function updateFounderProfile(
  supabase: SupabaseClient,
  founderId: string,
  payload: FounderProfileUpdateInput,
  keys: (keyof FounderProfileUpdateInput)[]
): Promise<Founder> {
  const parsed = FounderProfileUpdateSchema.parse(payload);
  const row: FounderProfileUpdateRow = {};

  if (keys.includes("displayName")) {
    row.display_name = parsed.displayName ?? null;
  }
  if (keys.includes("role")) {
    row.role = parsed.role ?? null;
  }
  if (keys.includes("startupName")) {
    row.startup_name = parsed.startupName ?? null;
  }
  if (keys.includes("startupOneLiner")) {
    row.startup_one_liner = parsed.startupOneLiner ?? null;
  }
  if (keys.includes("bio")) {
    row.bio = parsed.bio ?? null;
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
  if (keys.includes("avatarUrl")) {
    row.avatar_url = parsed.avatarUrl ?? null;
  }

  return updateProfile(supabase, founderId, row);
}
