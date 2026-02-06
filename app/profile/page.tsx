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
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Edit your profile</h1>
        <p className="mt-1 text-gray-600 text-sm">
          This is how you&apos;ll appear to others. You can come back anytime to update it.
        </p>
        <ProfileEditor initialFounder={founder as Founder} />
      </div>
    </main>
  );
}
