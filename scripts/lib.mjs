/**
 * Shared helpers for seed/patch scripts.
 * Parses .env.local and creates a service-role Supabase client.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

export function loadEnv(path = ".env.local") {
  return Object.fromEntries(
    readFileSync(path, "utf-8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
}

export function createServiceClient(env = loadEnv()) {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
