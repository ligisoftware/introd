import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@/types";

/** DB row shape for public.users */
interface UserRow {
  id: string;
  auth_user_id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  created_at: string;
  updated_at?: string | null;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    linkedinUrl: row.linkedin_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

/** Profile-only payload for user updates (snake_case for DB). */
export interface UserProfileUpdateRow {
  name?: string | null;
  avatar_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  updated_at?: string;
}

const USER_SELECT =
  "id, auth_user_id, email, name, avatar_url, linkedin_url, twitter_url, created_at, updated_at";

export async function getByAuthUserId(
  supabase: SupabaseClient,
  authUserId: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToUser(data as UserRow);
}

export async function getById(supabase: SupabaseClient, userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToUser(data as UserRow);
}

export async function create(
  supabase: SupabaseClient,
  authUserId: string,
  email: string
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert({ auth_user_id: authUserId, email })
    .select(USER_SELECT)
    .single();

  if (error) throw error;
  return rowToUser(data as UserRow);
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  payload: UserProfileUpdateRow
): Promise<User> {
  const updateRow: UserProfileUpdateRow = {
    ...payload,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("users")
    .update(updateRow)
    .eq("id", userId)
    .select(USER_SELECT)
    .single();

  if (error) throw error;
  return rowToUser(data as UserRow);
}
