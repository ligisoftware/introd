import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { listIntros } from "@/services/intro";
import { redirect } from "next/navigation";
import IntroCard from "./IntroCard";
import NewIntroCard from "./NewIntroCard";

export default async function IntrosListPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/intro");
  }

  const intros = await listIntros(supabase, user.id);

  if (intros.length === 0) {
    return (
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-container-lg">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">
              Your intros
            </h1>
            <p className="mt-1.5 text-sm text-ds-text-muted">
              Manage your shareable founder intros.
            </p>
          </header>

          <div className="flex flex-col items-center gap-4 rounded-ds-lg border border-ds-border bg-ds-surface px-6 py-12 text-center shadow-ds-sm">
            <p className="text-sm text-ds-text-muted">
              You don&apos;t have any intros yet. Create one to get started.
            </p>
            <NewIntroCard />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-container-lg">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">
            Your intros
          </h1>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            Manage your shareable founder intros.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {intros.map((intro) => (
            <IntroCard key={intro.id} intro={intro} />
          ))}
          {intros.length < 3 && <NewIntroCard />}
        </div>
      </div>
    </main>
  );
}
