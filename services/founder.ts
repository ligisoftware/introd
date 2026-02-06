import type { SupabaseClient } from "@supabase/supabase-js";
import type { Founder } from "@/types";
import { getByAuthUserId, create } from "@/repositories/founders";

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
