import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-container-md">
        <div className="max-w-xl ds-hero-in">
          <h1 className="text-3xl font-bold tracking-tight text-ds-text sm:text-4xl">Introd</h1>
          <p className="mt-3 text-base text-ds-text-muted sm:text-lg">
            Standardized first-impression layer for startup fundraising.
          </p>
          <p className="mt-2 text-base text-ds-text-muted sm:text-lg">
            A single shareable page with your background, startup, and team—for investors and warm
            intros.
          </p>
          {user && (
            <p className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/intro"
                className="inline-flex items-center gap-2 rounded-ds bg-ds-accent px-4 py-2.5 text-sm font-medium text-ds-text-inverse shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:bg-ds-accent-hover hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98]"
              >
                Edit your intro
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-ds-text-muted transition-colors duration-ds ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg rounded-ds-sm"
              >
                Edit your profile
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
