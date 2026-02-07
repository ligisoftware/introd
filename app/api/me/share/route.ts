import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFounder } from "@/services/founder";
import { setShareSlug } from "@/repositories/founders";
import { NextResponse } from "next/server";

/** Generate an unguessable URL-safe slug (base64url, ~28 chars). */
function generateShareSlug(): string {
  return randomBytes(21)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * POST /api/me/share — Generate or return the founder's share link.
 * Authenticated only. If share_slug already exists, returns existing URL; otherwise generates and persists a new slug.
 * Body: { regenerate?: boolean } — if true, generate a new slug (old link stops working).
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const founder = await getCurrentFounder(supabase);

  if (!founder) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = new URL(request.url).origin;
  let regenerate = false;
  try {
    const body = await request.json().catch(() => ({}));
    regenerate = body?.regenerate === true;
  } catch {
    // no body or invalid JSON: keep regenerate false
  }

  if (!regenerate && founder.shareSlug) {
    return NextResponse.json({ url: `${origin}/p/${founder.shareSlug}` });
  }

  const slug = generateShareSlug();
  const updated = await setShareSlug(supabase, founder.id, slug);
  return NextResponse.json({ url: `${origin}/p/${updated.shareSlug ?? slug}` });
}
