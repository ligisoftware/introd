import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import Link from "next/link";
import { HeroHeading } from "@/app/components/HeroHeading";
import { btnPrimary, btnSecondary } from "@/app/components/form-classes";

export default async function Home() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-container-md">
        <div className="max-w-xl">
          <HeroHeading text="One link. Your story. Every intro." />
          <p className="mt-4 font-sans text-base leading-relaxed text-ds-text-muted sm:mt-5 sm:text-lg">
            A single shareable page with your background, startup, and team—for investors and warm
            intros.
          </p>
          <p className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            {user ? (
              <>
                <Link href="/intro" className={btnPrimary}>
                  Edit your intro
                </Link>
                <Link
                  href="/profile"
                  className="rounded-ds-sm text-sm font-medium text-ds-text-muted transition-colors duration-ds ease-ds hover:text-ds-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
                >
                  Edit your profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login?next=/intro" className={btnPrimary}>
                  Get started
                </Link>
                <Link href="/login" className={btnSecondary}>
                  Log in
                </Link>
              </>
            )}
          </p>
          <ul className="mt-10 space-y-2 font-sans text-sm text-ds-text-muted sm:mt-12" aria-label="Why Introd">
            <li className="ds-stagger-1">One link, always up to date</li>
            <li className="ds-stagger-2">Professional first impression</li>
            <li className="ds-stagger-3">Less back-and-forth with investors</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
