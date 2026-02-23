import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getIntroById } from "@/services/intro";
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
 * POST /api/intros/[id]/share — Generate or return the intro's share link.
 * Each intro gets one permanent link; subsequent calls return the existing link.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const intro = await getIntroById(supabase, id, user.id);

  if (!intro) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const origin = new URL(request.url).origin;

  if (intro.shareSlug) {
    return NextResponse.json({ url: `${origin}/i/${intro.shareSlug}` });
  }

  const slug = generateShareSlug();
  const updated = await setShareSlug(supabase, intro.id, slug);
  return NextResponse.json({ url: `${origin}/i/${updated.shareSlug ?? slug}` });
}
