import { IntroProfileView } from "@/app/components/IntroProfileView";
import { getByShareSlug } from "@/repositories/intros";
import { getTeamMembersForIntro } from "@/repositories/collaborators";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ViewerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceRoleClient();
  const result = await getByShareSlug(supabase, slug);

  if (!result) {
    notFound();
  }

  const { profile, introId, ownerEmail, showOwnerEmail } = result;

  // Build team members: owner first, then accepted collaborators
  const collaboratorMembers = await getTeamMembersForIntro(supabase, introId);
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

  return (
    <main className="relative flex flex-1 items-start justify-center bg-ds-bg px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div aria-hidden className="pointer-events-none fixed inset-0 ds-dot-grid" />
      <div className="relative mx-auto w-full max-w-xl ds-hero-in">
        <IntroProfileView profile={profile} />
      </div>
    </main>
  );
}
