import type { SupabaseClient } from "@supabase/supabase-js";
import type { Intro, PublicIntroProfile } from "@/types";

/** DB row shape for public.intros */
interface IntroRow {
  id: string;
  user_id: string;
  share_slug?: string | null;
  startup_name?: string | null;
  startup_one_liner?: string | null;
  role?: string | null;
  intro_text?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at?: string | null;
}

/** Joined row shape from the public profile query (partial intro + user join) */
interface PublicIntroJoinRow {
  startup_name?: string | null;
  startup_one_liner?: string | null;
  role?: string | null;
  intro_text?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  logo_url?: string | null;
  users: {
    name?: string | null;
    avatar_url?: string | null;
  };
}

function rowToIntro(row: IntroRow): Intro {
  return {
    id: row.id,
    userId: row.user_id,
    shareSlug: row.share_slug ?? undefined,
    startupName: row.startup_name ?? undefined,
    startupOneLiner: row.startup_one_liner ?? undefined,
    role: row.role ?? undefined,
    introText: row.intro_text ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

function joinedRowToPublicProfile(row: PublicIntroJoinRow): PublicIntroProfile {
  return {
    name: row.users?.name ?? undefined,
    avatarUrl: row.users?.avatar_url ?? undefined,
    startupName: row.startup_name ?? undefined,
    startupOneLiner: row.startup_one_liner ?? undefined,
    role: row.role ?? undefined,
    introText: row.intro_text ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    logoUrl: row.logo_url ?? undefined,
  };
}

/** Payload for intro updates (snake_case for DB). */
export interface IntroUpdateRow {
  startup_name?: string | null;
  startup_one_liner?: string | null;
  role?: string | null;
  intro_text?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  logo_url?: string | null;
  updated_at?: string;
}

const INTRO_SELECT =
  "id, user_id, share_slug, startup_name, startup_one_liner, role, intro_text, website_url, linkedin_url, twitter_url, logo_url, created_at, updated_at";

export async function getByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Intro | null> {
  const { data, error } = await supabase
    .from("intros")
    .select(INTRO_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToIntro(data as IntroRow);
}

export async function create(supabase: SupabaseClient, userId: string): Promise<Intro> {
  const { data, error } = await supabase
    .from("intros")
    .insert({ user_id: userId })
    .select(INTRO_SELECT)
    .single();

  if (error) throw error;
  return rowToIntro(data as IntroRow);
}

export async function update(
  supabase: SupabaseClient,
  introId: string,
  payload: IntroUpdateRow
): Promise<Intro> {
  const updateRow: IntroUpdateRow = {
    ...payload,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("intros")
    .update(updateRow)
    .eq("id", introId)
    .select(INTRO_SELECT)
    .single();

  if (error) throw error;
  return rowToIntro(data as IntroRow);
}

const PUBLIC_PROFILE_JOIN_SELECT =
  "startup_name, startup_one_liner, role, intro_text, website_url, linkedin_url, twitter_url, logo_url, users(name, avatar_url)";

export async function getByShareSlug(
  supabase: SupabaseClient,
  slug: string
): Promise<PublicIntroProfile | null> {
  const { data, error } = await supabase
    .from("intros")
    .select(PUBLIC_PROFILE_JOIN_SELECT)
    .eq("share_slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return joinedRowToPublicProfile(data as unknown as PublicIntroJoinRow);
}

export async function setShareSlug(
  supabase: SupabaseClient,
  introId: string,
  slug: string
): Promise<Intro> {
  const { data, error } = await supabase
    .from("intros")
    .update({ share_slug: slug })
    .eq("id", introId)
    .select(INTRO_SELECT)
    .single();

  if (error) throw error;
  return rowToIntro(data as IntroRow);
}
