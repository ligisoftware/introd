import { createClient } from "@/lib/supabase/server";
import { getCurrentFounder, updateFounderProfile } from "@/services/founder";
import { FounderProfileUpdateSchema } from "@/lib/validation/founder-profile";
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

/**
 * Updates the current founder's profile. Body validated with Zod; only profile fields allowed.
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const founder = await getCurrentFounder(supabase);

  if (!founder) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = FounderProfileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const keys = Array.isArray(body)
    ? []
    : (Object.keys(body as Record<string, unknown>) as (keyof typeof parsed.data)[]);

  try {
    const updated = await updateFounderProfile(supabase, founder.id, parsed.data, keys);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/me error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
