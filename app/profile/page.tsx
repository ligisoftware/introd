import { createClient } from "@/lib/supabase/server";
import { getCurrentFounder } from "@/services/founder";
import { redirect } from "next/navigation";
import { ProfileEditor } from "./ProfileEditor";
import type { Founder } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const founder = await getCurrentFounder(supabase);

  if (!founder) {
    redirect("/login?next=/profile");
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-container-md">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">
            Edit your profile
          </h1>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            This is how you&apos;ll appear to others. You can come back anytime to update it.
          </p>
        </header>
        <ProfileEditor initialFounder={founder as Founder} />
      </div>
    </main>
  );
}
