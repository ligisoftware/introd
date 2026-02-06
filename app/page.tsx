import { createClient } from "@/lib/supabase/server";
import { getCurrentFounder } from "@/services/founder";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const founder = await getCurrentFounder(supabase);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Intro&apos;d</h1>
      <p className="mt-2 text-gray-600">
        Standardized first-impression layer for startup fundraising.
      </p>
      {founder && (
        <p className="mt-4">
          <Link
            href="/profile"
            className="text-sm font-medium text-gray-700 underline hover:no-underline"
          >
            Edit your profile
          </Link>
        </p>
      )}
    </main>
  );
}
