import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getIntroById } from "@/services/intro";
import { redirect, notFound } from "next/navigation";
import { IntroEditor } from "./IntroEditor";

export default async function IntroEditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/intro");
  }

  const { id } = await params;
  const intro = await getIntroById(supabase, id, user.id);

  if (!intro) {
    notFound();
  }

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-container-lg">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">
            Edit your intro
          </h1>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            The details that appear on your shareable intro page.
          </p>
        </header>
        <IntroEditor initialIntro={intro} />
      </div>
    </main>
  );
}
