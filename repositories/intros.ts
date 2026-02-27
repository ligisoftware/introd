import type { SupabaseClient } from "@supabase/supabase-js";
import type { Intro, PublicIntroProfile, FundingRound } from "@/types";

/** DB row shape for public.intros */
interface IntroRow {
  id: string;
  user_id: string;
  share_slug?: string | null;
  startup_name?: string | null;
  startup_one_liner?: string | null;
  title?: string | null;
  intro_text?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  logo_url?: string | null;
  founded_date?: string | null;
  location?: string | null;
  funding_rounds?: FundingRound[] | null;
  owner_start_date?: string | null;
  owner_bio?: string | null;
  show_owner_email?: boolean;
  created_at: string;
  updated_at?: string | null;
}

/** Joined row shape from the public profile query (partial intro + user join) */
interface PublicIntroJoinRow {
  startup_name?: string | null;
  startup_one_liner?: string | null;
  title?: string | null;
  intro_text?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  logo_url?: string | null;
  founded_date?: string | null;
  location?: string | null;
  funding_rounds?: FundingRound[] | null;
  owner_start_date?: string | null;
  owner_bio?: string | null;
  show_owner_email?: boolean;
  users: {
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
    linkedin_url?: string | null;
    twitter_url?: string | null;
  };
}

function rowToIntro(row: IntroRow): Intro {
  return {
    id: row.id,
    userId: row.user_id,
    shareSlug: row.share_slug ?? undefined,
    startupName: row.startup_name ?? undefined,
    startupOneLiner: row.startup_one_liner ?? undefined,
    title: row.title ?? undefined,
    introText: row.intro_text ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    foundedDate: row.founded_date ?? undefined,
    location: row.location ?? undefined,
    fundingRounds: row.funding_rounds ?? undefined,
    ownerStartDate: row.owner_start_date ?? undefined,
    ownerBio: row.owner_bio ?? undefined,
    showOwnerEmail: row.show_owner_email ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

function joinedRowToPublicProfile(
  row: PublicIntroJoinRow
): PublicIntroProfile & { ownerEmail?: string; showOwnerEmail?: boolean } {
  return {
    name: row.users?.name ?? undefined,
    avatarUrl: row.users?.avatar_url ?? undefined,
    userLinkedinUrl: row.users?.linkedin_url ?? undefined,
    userTwitterUrl: row.users?.twitter_url ?? undefined,
    ownerEmail: row.users?.email ?? undefined,
    startupName: row.startup_name ?? undefined,
    startupOneLiner: row.startup_one_liner ?? undefined,
    title: row.title ?? undefined,
    introText: row.intro_text ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    foundedDate: row.founded_date ?? undefined,
    location: row.location ?? undefined,
    fundingRounds: row.funding_rounds ?? undefined,
    ownerStartDate: row.owner_start_date ?? undefined,
    ownerBio: row.owner_bio ?? undefined,
    showOwnerEmail: row.show_owner_email ?? false,
  };
}

/** Payload for intro updates (snake_case for DB). */
export interface IntroUpdateRow {
  startup_name?: string | null;
  startup_one_liner?: string | null;
  title?: string | null;
  intro_text?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  logo_url?: string | null;
  founded_date?: string | null;
  location?: string | null;
  funding_rounds?: FundingRound[] | null;
  owner_start_date?: string | null;
  owner_bio?: string | null;
  show_owner_email?: boolean;
  updated_at?: string;
}

const INTRO_SELECT =
  "id, user_id, share_slug, startup_name, startup_one_liner, title, intro_text, website_url, linkedin_url, twitter_url, logo_url, founded_date, location, funding_rounds, owner_start_date, owner_bio, show_owner_email, created_at, updated_at";

export async function getByUserId(supabase: SupabaseClient, userId: string): Promise<Intro | null> {
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

export async function listByUserId(supabase: SupabaseClient, userId: string): Promise<Intro[]> {
  const { data, error } = await supabase
    .from("intros")
    .select(INTRO_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return (data as IntroRow[]).map(rowToIntro);
}

export async function getById(supabase: SupabaseClient, id: string): Promise<Intro | null> {
  const { data, error } = await supabase
    .from("intros")
    .select(INTRO_SELECT)
    .eq("id", id)
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
  "startup_name, startup_one_liner, title, intro_text, website_url, linkedin_url, twitter_url, logo_url, founded_date, location, funding_rounds, owner_start_date, owner_bio, show_owner_email, users(name, email, avatar_url, linkedin_url, twitter_url)";

export async function getByShareSlug(
  supabase: SupabaseClient,
  slug: string
): Promise<{
  profile: PublicIntroProfile;
  introId: string;
  ownerEmail?: string;
  showOwnerEmail: boolean;
} | null> {
  const { data, error } = await supabase
    .from("intros")
    .select(`id, ${PUBLIC_PROFILE_JOIN_SELECT}`)
    .eq("share_slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { id, ...rest } = data as unknown as PublicIntroJoinRow & { id: string };
  const result = joinedRowToPublicProfile(rest);
  const { ownerEmail, showOwnerEmail, ...profile } = result;
  return { profile, introId: id, ownerEmail, showOwnerEmail: showOwnerEmail ?? false };
}

export async function deleteById(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("intros").delete().eq("id", id);
  if (error) throw error;
}

export async function countByUserId(supabase: SupabaseClient, userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("intros")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;
  return count ?? 0;
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
