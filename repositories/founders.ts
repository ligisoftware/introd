import type { SupabaseClient } from "@supabase/supabase-js";
import type { Founder } from "@/types";

/** DB row shape for public.founders */
interface FounderRow {
  id: string;
  auth_user_id: string;
  email: string;
  created_at: string;
}

function rowToFounder(row: FounderRow): Founder {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  };
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
    .select("id, auth_user_id, email, created_at")
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
    .select("id, auth_user_id, email, created_at")
    .single();

  if (error) throw error;
  return rowToFounder(data as FounderRow);
}
