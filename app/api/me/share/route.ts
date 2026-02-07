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
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const founder = await getCurrentFounder(supabase);

  if (!founder) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = new URL(request.url).origin;

  if (founder.shareSlug) {
    return NextResponse.json({ url: `${origin}/p/${founder.shareSlug}` });
  }

  const slug = generateShareSlug();
  const updated = await setShareSlug(supabase, founder.id, slug);
  return NextResponse.json({ url: `${origin}/p/${updated.shareSlug ?? slug}` });
}
