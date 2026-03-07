import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getByShareSlug } from "@/repositories/intros";
import { getTeamMembersForIntro } from "@/repositories/collaborators";
import { getIntroScores, computeAndPersistIntroScores } from "@/services/intro-scores";
import { getViewerKind, ALWAYS_SHOW_AI_SCORES } from "@/lib/viewer-context";
import { NextResponse } from "next/server";

/**
 * GET /api/i/[slug]/scores — Returns AI intro scores for the given share slug.
 * 403 if viewer is anonymous or the intro owner. For logged-in non-owner: returns
 * cached scores or triggers compute then returns.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const serviceClient = createServiceRoleClient();

  const result = await getByShareSlug(serviceClient, slug);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const viewer = await getCurrentUser(supabase);
  const viewerKind = getViewerKind(viewer?.id ?? null, result.ownerUserId);
  if (!ALWAYS_SHOW_AI_SCORES && (viewerKind === "anonymous" || viewerKind === "owner")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let scores = await getIntroScores(serviceClient, result.introId);
  if (!scores) {
    const profile = result.profile;
    const collaboratorMembers = await getTeamMembersForIntro(serviceClient, result.introId);
    const ownerMember = {
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      email: result.showOwnerEmail ? result.ownerEmail : undefined,
      title: profile.title,
      startDate: profile.ownerStartDate,
      bio: profile.ownerBio,
      linkedinUrl: profile.userLinkedinUrl,
      twitterUrl: profile.userTwitterUrl,
    };
    profile.teamMembers = [ownerMember, ...collaboratorMembers];
    scores = await computeAndPersistIntroScores(serviceClient, result.introId, profile);
  }

  if (!scores) {
    return NextResponse.json({ error: "Scores temporarily unavailable" }, { status: 503 });
  }

  return NextResponse.json({
    summary: scores.summary,
    founderScore: scores.founderScore,
    founderBullets: scores.founderBullets,
    startupScore: scores.startupScore,
    startupBullets: scores.startupBullets,
  });
}
