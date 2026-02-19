import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import { getCurrentIntro } from "@/services/intro";
import { redirect } from "next/navigation";
import { ProfileEditor } from "./ProfileEditor";

export default async function ProfilePage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/profile");
  }

  const intro = await getCurrentIntro(supabase, user.id);

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-container-lg">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ds-text sm:text-3xl">
            Edit your profile
          </h1>
          <p className="mt-1.5 text-sm text-ds-text-muted">
            This is how you&apos;ll appear to others. You can come back anytime to update it.
          </p>
        </header>
        <ProfileEditor initialUser={user} initialIntro={intro} />
      </div>
    </main>
  );
}
