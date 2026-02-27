import type { SupabaseClient } from "@supabase/supabase-js";
import type { Intro } from "@/types";
import {
  getByUserId,
  listByUserId,
  getById,
  create,
  update,
  deleteById,
  countByUserId,
} from "@/repositories/intros";
import type { IntroUpdateRow } from "@/repositories/intros";
import { IntroUpdateSchema, type IntroUpdateInput } from "@/lib/validation/intro";
import { isCollaborator } from "@/services/collaborator";

/**
 * Gets or auto-creates a single intro for the user.
 */
export async function getCurrentIntro(supabase: SupabaseClient, userId: string): Promise<Intro> {
  const existing = await getByUserId(supabase, userId);
  if (existing) return existing;

  return create(supabase, userId);
}

/**
 * Returns all intros for a user, ordered by created_at ascending.
 */
export async function listIntros(supabase: SupabaseClient, userId: string): Promise<Intro[]> {
  return listByUserId(supabase, userId);
}

/**
 * Fetches a single intro by ID and verifies ownership.
 */
export async function getIntroById(
  supabase: SupabaseClient,
  introId: string,
  userId: string
): Promise<Intro | null> {
  const intro = await getById(supabase, introId);
  if (!intro || intro.userId !== userId) return null;
  return intro;
}

/**
 * Fetches a single intro by ID, allowing access for both owners and accepted collaborators.
 */
export async function getIntroForEditing(
  supabase: SupabaseClient,
  introId: string,
  userId: string
): Promise<{ intro: Intro; isOwner: boolean } | null> {
  const intro = await getById(supabase, introId);
  if (!intro) return null;

  if (intro.userId === userId) {
    return { intro, isOwner: true };
  }

  const collab = await isCollaborator(supabase, introId, userId);
  if (collab) {
    return { intro, isOwner: false };
  }

  return null;
}

const MAX_INTROS = 3;

/**
 * Creates a new intro for the user, enforcing a maximum of 3.
 */
export async function createIntro(
  supabase: SupabaseClient,
  userId: string
): Promise<{ intro?: Intro; error?: string }> {
  const count = await countByUserId(supabase, userId);
  if (count >= MAX_INTROS) {
    return { error: `You can have at most ${MAX_INTROS} intros` };
  }
  const intro = await create(supabase, userId);
  return { intro };
}

/**
 * Deletes an intro after verifying ownership.
 */
export async function deleteIntro(
  supabase: SupabaseClient,
  introId: string,
  userId: string
): Promise<{ error?: string }> {
  const intro = await getById(supabase, introId);
  if (!intro || intro.userId !== userId) {
    return { error: "Not found" };
  }
  await deleteById(supabase, introId);
  return {};
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
  if (keys.includes("showOwnerEmail")) {
    row.show_owner_email = parsed.showOwnerEmail ?? false;
  }
  if (keys.includes("ownerStartDate")) {
    row.owner_start_date = parsed.ownerStartDate ?? null;
  }
  if (keys.includes("fundingRounds")) {
    row.funding_rounds = parsed.fundingRounds ?? null;
  }

  return update(supabase, introId, row);
}
