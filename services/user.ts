import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@/types";
import { getByAuthUserId, getByUsername, create, updateProfile } from "@/repositories/users";
import type { UserProfileUpdateRow } from "@/repositories/users";
import {
  UserProfileUpdateSchema,
  type UserProfileUpdateInput,
} from "@/lib/validation/user-profile";

/**
 * Returns the current user for the request: session → existing row or first-login create.
 */
export async function getCurrentUser(supabase: SupabaseClient): Promise<User | null> {
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
 * Validates user profile payload and updates only user-level columns.
 */
export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  payload: UserProfileUpdateInput,
  keys: (keyof UserProfileUpdateInput)[]
): Promise<User> {
  const parsed = UserProfileUpdateSchema.parse(payload);
  const row: UserProfileUpdateRow = {};

  if (keys.includes("username")) {
    row.username = parsed.username;
  }
  if (keys.includes("name")) {
    row.name = parsed.name ?? null;
  }
  if (keys.includes("avatarUrl")) {
    row.avatar_url = parsed.avatarUrl ?? null;
  }
  if (keys.includes("linkedinUrl")) {
    row.linkedin_url = parsed.linkedinUrl ?? null;
  }
  if (keys.includes("twitterUrl")) {
    row.twitter_url = parsed.twitterUrl ?? null;
  }
  if (keys.includes("bio")) {
    row.bio = parsed.bio ?? null;
  }
  if (keys.includes("experience")) {
    row.experience = parsed.experience ?? null;
  }

  return updateProfile(supabase, userId, row);
}

/**
 * Returns a user by username (for public profile pages).
 */
export async function getUserByUsername(
  supabase: SupabaseClient,
  username: string
): Promise<User | null> {
  return getByUsername(supabase, username);
}
