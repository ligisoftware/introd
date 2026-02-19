import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getCurrentIntro } from "@/services/intro";
import { setShareSlug } from "@/repositories/intros";
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
 * POST /api/me/share — Generate or return the intro's share link.
 * Body: { regenerate?: boolean } — if true, generate a new slug.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const intro = await getCurrentIntro(supabase, user.id);

  const origin = new URL(request.url).origin;
  let regenerate = false;
  try {
    const body = await request.json().catch(() => ({}));
    regenerate = body?.regenerate === true;
  } catch {
    // no body or invalid JSON: keep regenerate false
  }

  if (!regenerate && intro.shareSlug) {
    return NextResponse.json({ url: `${origin}/p/${intro.shareSlug}` });
  }

  const slug = generateShareSlug();
  const updated = await setShareSlug(supabase, intro.id, slug);
  return NextResponse.json({ url: `${origin}/p/${updated.shareSlug ?? slug}` });
}
