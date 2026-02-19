import { IntroProfileView } from "@/app/components/IntroProfileView";
import { FeedbackForm } from "@/app/components/FeedbackForm";
import { getByShareSlug } from "@/repositories/intros";
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
    <main className="min-h-[calc(100vh-3.5rem)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-container-sm ds-hero-in">
        <IntroProfileView profile={profile} />
        <FeedbackForm slug={slug} />
      </div>
    </main>
  );
}
