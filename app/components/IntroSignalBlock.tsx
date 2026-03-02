import Link from "next/link";
import type { IntroScores } from "@/repositories/intro-scores";

export type IntroSignalBlockMode = "full" | "blurred" | "hidden";

interface IntroSignalBlockProps {
  mode: IntroSignalBlockMode;
  scores: IntroScores | null;
  /** Pass when on viewer page so blurred-state CTA can link to login with return URL */
  viewerSlug?: string | null;
}

const sectionHeadingClass =
  "text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle";

const sectionBorderByVariant = {
  founder: "border-l-4 border-l-ds-accent pl-3",
  startup: "border-l-4 border-l-ds-success pl-3",
} as const;

function ScoreSection({
  label,
  score,
  bullets,
  isFirst,
  variant,
}: {
  label: string;
  score: number | null;
  bullets: string[];
  isFirst: boolean;
  variant: "founder" | "startup";
}) {
  const borderClass = sectionBorderByVariant[variant];
  return (
    <div className={`${isFirst ? "mt-0" : "mt-5 border-t border-ds-border pt-5"} ${borderClass}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-ds-text">{label}</span>
        {score != null && (
          <span
            className="inline-flex items-baseline gap-0.5 rounded-ds-sm bg-ds-surface-hover px-2 py-0.5 font-semibold tabular-nums text-ds-text"
            aria-label={`${label}: ${score} out of 10`}
          >
            <span className="text-lg leading-none">{score}</span>
            <span className="text-xs font-medium text-ds-text-muted">/10</span>
          </span>
        )}
      </div>
      {score != null && bullets.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-ds-text-muted">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {score == null && (
        <p className="mt-1.5 text-sm text-ds-text-muted">Not enough information to assess.</p>
      )}
    </div>
  );
}

export function IntroSignalBlock({ mode, scores, viewerSlug }: IntroSignalBlockProps) {
  if (mode === "hidden") return null;

  const isBlurred = mode === "blurred";
  const loginHref =
    viewerSlug != null && viewerSlug !== ""
      ? `/login?next=${encodeURIComponent(`/i/${viewerSlug}`)}`
      : "/login";

  return (
    <section
      className="ds-stagger-1 rounded-ds-lg border border-ds-border border-t-2 border-t-ds-accent/25 bg-ds-surface p-5 shadow-ds transition-shadow duration-ds ease-ds sm:p-6"
      aria-label="AI summary and scores"
      data-testid="intro-signal-block"
    >
      <h2 className={sectionHeadingClass}>AI summary</h2>
      {isBlurred ? (
        <>
          {/* Blurred placeholder only — visual tease, not interactive */}
          <div
            className="mt-4 select-none blur-md pointer-events-none rounded-ds border border-ds-border/60 bg-ds-surface-hover/60 p-5 min-h-[5rem]"
            aria-hidden
          >
            <p className="text-sm text-ds-text-muted">
              Summary text would appear here with founder and startup scores…
            </p>
            <p className="mt-3 text-sm text-ds-text-muted">Founder &amp; team — /10</p>
            <p className="mt-2 text-sm text-ds-text-muted">Startup — /10</p>
          </div>
          {/* Readable CTA below the blur — not blurred, receives clicks */}
          <div className="ds-feedback-in mt-4 rounded-ds border border-ds-border bg-ds-surface-hover/50 p-5">
            <p className="text-sm text-ds-text-muted">
              Get an AI-generated summary and scores for founder fit and startup signal—at a glance.
            </p>
            <p className="mt-3">
              <Link
                href={loginHref}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ds-accent transition-opacity duration-ds-fast ease-ds hover:text-ds-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
              >
                Log in to see AI summary and scores
                <span aria-hidden className="text-ds-text-subtle">
                  →
                </span>
              </Link>
            </p>
            <p className="mt-3 text-xs text-ds-text-subtle">
              Free for viewers once you&apos;re signed in.
            </p>
          </div>
        </>
      ) : (
        <div className="ds-feedback-in mt-4">
          {scores ? (
            <>
              {scores.summary && (
                <div className="ds-stagger-2 border-b border-ds-border border-l-4 border-l-ds-border pb-5 pl-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                    Summary
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ds-text">{scores.summary}</p>
                </div>
              )}
              <div className="ds-stagger-3">
                <ScoreSection
                  label="Founder & team"
                  score={scores.founderScore}
                  bullets={scores.founderBullets}
                  isFirst={!scores.summary}
                  variant="founder"
                />
              </div>
              <div className="ds-stagger-4">
                <ScoreSection
                  label="Startup"
                  score={scores.startupScore}
                  bullets={scores.startupBullets}
                  isFirst={false}
                  variant="startup"
                />
              </div>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ds-text-muted">
              AI summary is being prepared. Check back shortly.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
