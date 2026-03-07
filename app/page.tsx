import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/user";
import Link from "next/link";
import { HeroHeading } from "@/app/components/HeroHeading";
import { btnPrimary, btnSecondary } from "@/app/components/form-classes";

export default async function Home() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  return (
    <main className="flex-1 py-10 sm:py-14">
      {/* Hero */}
      <section aria-labelledby="hero-heading">
        <div className="mx-auto max-w-container-md px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <HeroHeading text="One link. Your story. Every intro." />
            <p className="ds-hero-in mt-4 font-sans text-base leading-relaxed text-ds-text-muted sm:mt-5 sm:text-lg">
              A single shareable page with your background, startup, and team—for investors and warm
              intros.
            </p>
            <p className="ds-hero-in mt-4 text-sm text-ds-text-subtle sm:mt-5">Free to start.</p>
            <div className="ds-hero-in mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
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
                    Create your intro — free
                  </Link>
                  <Link href="/login" className={btnSecondary}>
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section
        className="bg-ds-surface py-16 sm:py-20"
        aria-labelledby="problem-heading solution-heading"
      >
        <div className="ds-section-in mx-auto max-w-container-lg px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            <div className="space-y-3">
              <h2 id="problem-heading" className="text-base font-semibold text-ds-text">
                The problem
              </h2>
              <p className="max-w-prose text-base leading-relaxed text-ds-text-muted sm:text-lg">
                Founders send the same context over and over—decks, bios, one-liners—across email
                and Slack. Investors get fragments, not a story.
              </p>
            </div>
            <div className="space-y-3">
              <h2 id="solution-heading" className="text-base font-semibold text-ds-text">
                The solution
              </h2>
              <p className="max-w-prose text-base leading-relaxed text-ds-text-muted sm:text-lg">
                Introd is one link that stays up to date. Your background, your startup, your team.
                One page. Every intro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Why Introd */}
      <section className="bg-ds-bg py-16 sm:py-20" aria-labelledby="features-heading">
        <div className="mx-auto max-w-container-lg px-4 sm:px-6 lg:px-8">
          <h2
            id="features-heading"
            className="ds-section-in mb-12 text-2xl font-bold text-ds-text sm:text-3xl"
          >
            Why Introd
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            <div className="ds-stagger-1 rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-[box-shadow,transform] duration-ds ease-ds hover:-translate-y-0.5 hover:shadow-ds sm:p-6">
              <span className="mb-3 block text-2xl" aria-hidden>
                🔗
              </span>
              <h3 className="mb-2 text-lg font-semibold text-ds-text">One link for every intro</h3>
              <p className="text-base leading-relaxed text-ds-text-muted">
                Share a single URL instead of resending decks and bios. Your intro stays in one
                place so investors and warm intros get the full picture every time.
              </p>
            </div>
            <div className="ds-stagger-2 rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-[box-shadow,transform] duration-ds ease-ds hover:-translate-y-0.5 hover:shadow-ds sm:p-6">
              <span className="mb-3 block text-2xl" aria-hidden>
                📄
              </span>
              <h3 className="mb-2 text-lg font-semibold text-ds-text">
                Professional first impression
              </h3>
              <p className="text-base leading-relaxed text-ds-text-muted">
                Your background, startup, and team in a clean, standardized format. Look prepared
                and credible from the first click.
              </p>
            </div>
            <div className="ds-stagger-3 rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-[box-shadow,transform] duration-ds ease-ds hover:-translate-y-0.5 hover:shadow-ds sm:p-6">
              <span className="mb-3 block text-2xl" aria-hidden>
                ✓
              </span>
              <h3 className="mb-2 text-lg font-semibold text-ds-text">Always up to date</h3>
              <p className="text-base leading-relaxed text-ds-text-muted">
                Update your page once and every shared link reflects the latest. No more
                &ldquo;here&apos;s the new deck&rdquo; threads.
              </p>
            </div>
            <div className="ds-stagger-4 rounded-ds-lg border border-ds-border bg-ds-surface p-5 shadow-ds-sm transition-[box-shadow,transform] duration-ds ease-ds hover:-translate-y-0.5 hover:shadow-ds sm:p-6">
              <span className="mb-3 block text-2xl" aria-hidden>
                🤝
              </span>
              <h3 className="mb-2 text-lg font-semibold text-ds-text">
                Built for warm intros and investors
              </h3>
              <p className="text-base leading-relaxed text-ds-text-muted">
                Designed for the way founders actually raise: one link in an email, in a Slack
                intro, or after a meeting. Less back-and-forth, more clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ds-surface py-16 sm:py-20" aria-labelledby="how-it-works-heading">
        <div className="mx-auto max-w-container-lg px-4 sm:px-6 lg:px-8">
          <h2
            id="how-it-works-heading"
            className="ds-section-in mb-12 text-2xl font-bold text-ds-text sm:text-3xl"
          >
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            <div className="ds-stagger-1 space-y-2">
              <h3 className="text-base font-semibold text-ds-text sm:text-lg">Create your intro</h3>
              <p className="text-base leading-relaxed text-ds-text-muted">
                Add your name, photo, and a short bio.
              </p>
            </div>
            <div className="ds-stagger-2 space-y-2">
              <h3 className="text-base font-semibold text-ds-text sm:text-lg">
                Add your startup & team
              </h3>
              <p className="text-base leading-relaxed text-ds-text-muted">
                Link your company, role, and key teammates.
              </p>
            </div>
            <div className="ds-stagger-3 space-y-2">
              <h3 className="text-base font-semibold text-ds-text sm:text-lg">Share one link</h3>
              <p className="text-base leading-relaxed text-ds-text-muted">
                Send your Introd link anywhere—email, Slack, or after a meeting.
              </p>
            </div>
          </div>
          <p className="ds-stagger-4 mt-8 text-center text-sm text-ds-text-muted sm:text-left">
            Takes minutes, not hours.
          </p>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-ds-bg py-16 sm:py-20" aria-labelledby="social-proof-heading">
        <div className="ds-section-in mx-auto max-w-container-md px-4 sm:px-6 lg:px-8">
          <h2 id="social-proof-heading" className="sr-only">
            Social proof
          </h2>
          <blockquote>
            <p className="text-lg leading-relaxed text-ds-text sm:text-xl">
              &ldquo;Introd made our intro process 10x simpler.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-ds-text-muted">— Founder, YC-backed</footer>
          </blockquote>
          <p className="mt-8 text-sm text-ds-text-subtle">
            Trusted by founders building the future.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="bg-ds-accent py-16 text-ds-text-inverse sm:py-20"
        aria-labelledby="final-cta-heading"
      >
        <div className="ds-section-in mx-auto max-w-container-md px-4 text-center sm:px-6 lg:px-8">
          <h2 id="final-cta-heading" className="text-2xl font-bold sm:text-3xl">
            Ready to make every intro count?
          </h2>
          <p className="mt-3 text-base sm:text-lg [color:var(--ds-text-inverse)]/90">
            One link. Your story. Share it everywhere.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <>
                <Link
                  href="/intro"
                  className="inline-flex items-center justify-center rounded-ds bg-[var(--ds-text-inverse)] px-6 py-3 text-sm font-medium text-[var(--ds-accent)] shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:opacity-90 hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-text-inverse)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-accent)] active:scale-[0.98]"
                >
                  Edit your intro
                </Link>
                <Link
                  href="/profile"
                  className="rounded-ds text-sm font-medium text-[var(--ds-text-inverse)]/90 underline underline-offset-2 hover:text-[var(--ds-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-text-inverse)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-accent)]"
                >
                  Edit your profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login?next=/intro"
                  className="inline-flex items-center justify-center rounded-ds bg-[var(--ds-text-inverse)] px-6 py-3 text-sm font-medium text-[var(--ds-accent)] shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:opacity-90 hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-text-inverse)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-accent)] active:scale-[0.98]"
                >
                  Create your intro — free
                </Link>
                <Link
                  href="/login"
                  className="rounded-ds text-sm font-medium text-[var(--ds-text-inverse)]/90 underline underline-offset-2 hover:text-[var(--ds-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-text-inverse)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-accent)]"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
