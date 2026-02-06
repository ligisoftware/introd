import { createClient } from "@/lib/supabase/server";
import { getCurrentFounder } from "@/services/founder";
import { NextResponse } from "next/server";

/**
 * Returns the current founder when authenticated, or 401 Unauthorized.
 */
export async function GET() {
  const supabase = await createClient();
  const founder = await getCurrentFounder(supabase);

  if (!founder) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(founder);
}
