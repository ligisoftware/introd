import { FounderProfileView } from "@/app/components/FounderProfileView";
import { FeedbackForm } from "@/app/components/FeedbackForm";
import { getByShareSlug } from "@/repositories/founders";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ViewerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceRoleClient();
  const profile = await getByShareSlug(supabase, slug);

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <FounderProfileView profile={profile} />
        <FeedbackForm slug={slug} />
      </div>
    </main>
  );
}
