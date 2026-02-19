import { IntroProfileView } from "@/app/components/IntroProfileView";
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
    <main className="flex flex-1 items-start justify-center bg-black px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto w-full max-w-md ds-hero-in">
        <IntroProfileView profile={profile} />
      </div>
    </main>
  );
}
