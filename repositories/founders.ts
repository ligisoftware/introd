import type { SupabaseClient } from "@supabase/supabase-js";
import type { Founder, PublicFounderProfile } from "@/types";

/** DB row shape for public.founders */
interface FounderRow {
  id: string;
  auth_user_id: string;
  email: string;
  created_at: string;
  share_slug?: string | null;
  display_name?: string | null;
  role?: string | null;
  startup_name?: string | null;
  startup_one_liner?: string | null;
  bio?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
}

function rowToFounder(row: FounderRow): Founder {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    shareSlug: row.share_slug ?? undefined,
    displayName: row.display_name ?? undefined,
    role: row.role ?? undefined,
    startupName: row.startup_name ?? undefined,
    startupOneLiner: row.startup_one_liner ?? undefined,
    bio: row.bio ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

function rowToPublicProfile(
  row: Pick<
    FounderRow,
    | "display_name"
    | "role"
    | "startup_name"
    | "startup_one_liner"
    | "bio"
    | "website_url"
    | "linkedin_url"
    | "twitter_url"
    | "avatar_url"
  >
): PublicFounderProfile {
  return {
    displayName: row.display_name ?? undefined,
    role: row.role ?? undefined,
    startupName: row.startup_name ?? undefined,
    startupOneLiner: row.startup_one_liner ?? undefined,
    bio: row.bio ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
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
  avatar_url?: string | null;
  updated_at?: string;
}

const FOUNDER_SELECT =
  "id, auth_user_id, email, created_at, share_slug, display_name, role, startup_name, startup_one_liner, bio, website_url, linkedin_url, twitter_url, avatar_url, updated_at";

/**
 * Fetches a founder by auth user id. Uses the provided Supabase client so RLS applies.
 */
export async function getByAuthUserId(
  supabase: SupabaseClient,
  authUserId: string
): Promise<Founder | null> {
  const { data, error } = await supabase
    .from("founders")
    .select(FOUNDER_SELECT)
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
    .select(FOUNDER_SELECT)
    .single();

  if (error) throw error;
  return rowToFounder(data as FounderRow);
}

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
    .select(FOUNDER_SELECT)
    .single();

  if (error) throw error;
  return rowToFounder(data as FounderRow);
}

const PUBLIC_PROFILE_SELECT =
  "display_name, role, startup_name, startup_one_liner, bio, website_url, linkedin_url, twitter_url, avatar_url";

/**
 * Fetches public profile by share_slug. Intended for use with the service role client
 * so RLS does not block anonymous viewer access. Returns only public columns (no email, no id).
 */
export async function getByShareSlug(
  supabase: SupabaseClient,
  slug: string
): Promise<PublicFounderProfile | null> {
  const { data, error } = await supabase
    .from("founders")
    .select(PUBLIC_PROFILE_SELECT)
    .eq("share_slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToPublicProfile(data as FounderRow);
}

/**
 * Sets share_slug for a founder. Use with the authenticated client so RLS restricts to owner.
 * Returns the updated founder.
 */
export async function setShareSlug(
  supabase: SupabaseClient,
  founderId: string,
  slug: string
): Promise<Founder> {
  const { data, error } = await supabase
    .from("founders")
    .update({ share_slug: slug })
    .eq("id", founderId)
    .select(FOUNDER_SELECT)
    .single();

  if (error) throw error;
  return rowToFounder(data as FounderRow);
}
