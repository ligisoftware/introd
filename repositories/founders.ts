import type { SupabaseClient } from "@supabase/supabase-js";
import type { Founder } from "@/types";

/** DB row shape for public.founders */
interface FounderRow {
  id: string;
  auth_user_id: string;
  email: string;
  created_at: string;
  display_name?: string | null;
  role?: string | null;
  startup_name?: string | null;
  startup_one_liner?: string | null;
  bio?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  updated_at?: string | null;
}

function rowToFounder(row: FounderRow): Founder {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    displayName: row.display_name ?? undefined,
    role: row.role ?? undefined,
    startupName: row.startup_name ?? undefined,
    startupOneLiner: row.startup_one_liner ?? undefined,
    bio: row.bio ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

/** Profile-only payload for updates (snake_case for DB). */
export interface FounderProfileUpdateRow {
  display_name?: string | null;
  role?: string | null;
  startup_name?: string | null;
  startup_one_liner?: string | null;
  bio?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  updated_at?: string;
}

/**
 * Fetches a founder by auth user id. Uses the provided Supabase client so RLS applies.
 */
export async function getByAuthUserId(
  supabase: SupabaseClient,
  authUserId: string
): Promise<Founder | null> {
  const { data, error } = await supabase
    .from("founders")
    .select(
      "id, auth_user_id, email, created_at, display_name, role, startup_name, startup_one_liner, bio, website_url, linkedin_url, twitter_url, updated_at"
    )
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToFounder(data as FounderRow);
}

/**
 * Creates a founder row. Runs as the authenticated user so RLS allows insert when auth.uid() = auth_user_id.
 */
export async function create(
  supabase: SupabaseClient,
  authUserId: string,
  email: string
): Promise<Founder> {
  const { data, error } = await supabase
    .from("founders")
    .insert({ auth_user_id: authUserId, email })
    .select(
      "id, auth_user_id, email, created_at, display_name, role, startup_name, startup_one_liner, bio, website_url, linkedin_url, twitter_url, updated_at"
    )
    .single();

  if (error) throw error;
  return rowToFounder(data as FounderRow);
}

const PROFILE_SELECT =
  "id, auth_user_id, email, created_at, display_name, role, startup_name, startup_one_liner, bio, website_url, linkedin_url, twitter_url, updated_at";

/**
 * Updates only profile columns (and updated_at) for a founder. Returns the updated founder.
 */
export async function updateProfile(
  supabase: SupabaseClient,
  founderId: string,
  payload: FounderProfileUpdateRow
): Promise<Founder> {
  const updateRow: FounderProfileUpdateRow = {
    ...payload,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("founders")
    .update(updateRow)
    .eq("id", founderId)
    .select(PROFILE_SELECT)
    .single();

  if (error) throw error;
  return rowToFounder(data as FounderRow);
}
