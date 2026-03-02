import { Suspense } from "react";
import { IntroProfileView } from "@/app/components/IntroProfileView";
import { IntroSignalBlock } from "@/app/components/IntroSignalBlock";
import { AiScoresDebugMenu } from "@/app/components/AiScoresDebugMenu";
import { getByShareSlug } from "@/repositories/intros";
import { getTeamMembersForIntro } from "@/repositories/collaborators";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getIntroScores, computeAndPersistIntroScores } from "@/services/intro-scores";
import {
  getViewerKind,
  getDebugParam,
  resolveScoreBlockMode,
} from "@/lib/viewer-context";
import type { TeamMember } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function searchParamsGet(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | null {
  const v = params[key];
  return Array.isArray(v) ? (v[0] ?? null) : (v ?? null);
}

export default async function ViewerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const serviceClient = createServiceRoleClient();
  const result = await getByShareSlug(serviceClient, slug);

  if (!result) {
    notFound();
  }

  const { profile, introId, ownerUserId, ownerEmail, showOwnerEmail } = result;

  // Build team members: owner first, then accepted collaborators
  const collaboratorMembers = await getTeamMembersForIntro(serviceClient, introId);
  const ownerMember: TeamMember = {
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    email: showOwnerEmail ? ownerEmail : undefined,
    title: profile.title,
    startDate: profile.ownerStartDate,
    bio: profile.ownerBio,
    linkedinUrl: profile.userLinkedinUrl,
    twitterUrl: profile.userTwitterUrl,
  };
  const teamMembers = [ownerMember, ...collaboratorMembers];
  profile.teamMembers = teamMembers;

  const viewer = await getCurrentUser(supabase);
  const viewerKind = getViewerKind(viewer?.id ?? null, ownerUserId);
  const debugParam = getDebugParam({
    get: (key: string) => searchParamsGet(resolvedSearchParams, key),
  });
  const scoreBlockMode = resolveScoreBlockMode(viewerKind, debugParam);

  let scores = await getIntroScores(serviceClient, introId);
  if (scoreBlockMode === "full" && !scores) {
    scores = await computeAndPersistIntroScores(serviceClient, introId, profile);
  }

  return (
    <main className="relative flex flex-1 items-start justify-center bg-ds-bg px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div aria-hidden className="pointer-events-none fixed inset-0 ds-dot-grid" />
      <div className="relative mx-auto w-full max-w-container-lg ds-hero-in">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1">
            <div className="mx-auto max-w-xl">
              <IntroProfileView profile={profile} />
            </div>
          </div>
          <aside className="w-full space-y-5 lg:sticky lg:top-[4.5rem] lg:w-80 lg:shrink-0">
            <IntroSignalBlock mode={scoreBlockMode} scores={scores} viewerSlug={slug} />
            <Suspense fallback={null}>
              <AiScoresDebugMenu slug={slug} />
            </Suspense>
          </aside>
        </div>
      </div>
    </main>
  );
}
