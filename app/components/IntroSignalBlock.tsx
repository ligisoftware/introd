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

function scoreColor(score: number): string {
  if (score >= 8) return "text-ds-success";
  if (score >= 5) return "text-ds-text";
  return "text-ds-error";
}

function scoreBgColor(score: number): string {
  if (score >= 8) return "bg-ds-success/10 border-ds-success/20";
  if (score >= 5) return "bg-ds-surface-hover border-ds-border";
  return "bg-ds-error/10 border-ds-error/20";
}

function SubScore({
  label,
  score,
  rationale,
}: {
  label: string;
  score: number | null;
  rationale: string | null;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-ds-text-subtle">{label}</span>
        {score != null && (
          <span className="tabular-nums text-sm font-semibold text-ds-text-muted">
            {score}<span className="text-xs font-normal text-ds-text-subtle">/10</span>
          </span>
        )}
      </div>
      {score != null && rationale ? (
        <p className="mt-1 text-xs leading-relaxed text-ds-text-muted">{rationale}</p>
      ) : score == null ? (
        <p className="mt-1 text-xs text-ds-text-subtle">Not enough info.</p>
      ) : null}
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
      aria-label="Signal score"
      data-testid="intro-signal-block"
    >
      <h2 className={sectionHeadingClass}>Signal score</h2>
      {isBlurred ? (
        <>
          <div
            className="mt-4 select-none blur-md pointer-events-none rounded-ds border border-ds-border/60 bg-ds-surface-hover/60 p-5 min-h-[5rem]"
            aria-hidden
          >
            <p className="text-sm text-ds-text-muted">
              Signal score and summary would appear here…
            </p>
          </div>
          <div className="ds-feedback-in mt-4 rounded-ds border border-ds-border bg-ds-surface-hover/50 p-5">
            <p className="text-sm text-ds-text-muted">
              See the AI signal score and quick summary — know at a glance if this intro is worth a deeper look.
            </p>
            <p className="mt-3">
              <Link
                href={loginHref}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ds-accent transition-opacity duration-ds-fast ease-ds hover:text-ds-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
              >
                Log in to see signal score
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
              {/* Primary signal score + summary */}
              <div className="ds-stagger-2">
                <div className="flex items-start gap-4">
                  {scores.signalScore != null && (
                    <div
                      className={`flex flex-col items-center justify-center rounded-ds border px-3 py-2 ${scoreBgColor(scores.signalScore)}`}
                    >
                      <span
                        className={`text-3xl font-bold tabular-nums leading-none ${scoreColor(scores.signalScore)}`}
                        aria-label={`Signal score: ${scores.signalScore} out of 10`}
                      >
                        {scores.signalScore}
                      </span>
                      <span className="mt-0.5 text-[10px] font-medium text-ds-text-subtle">/10</span>
                    </div>
                  )}
                  {scores.summary && (
                    <p className="flex-1 text-[15px] leading-relaxed text-ds-text">
                      {scores.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Subscores */}
              {(scores.founderScore != null || scores.startupScore != null) && (
                <div className="ds-stagger-3 mt-5 border-t border-ds-border pt-4">
                  <div className="flex gap-6">
                    <SubScore
                      label="Founder & team"
                      score={scores.founderScore}
                      rationale={scores.founderRationale}
                    />
                    <div className="w-px bg-ds-border" />
                    <SubScore
                      label="Startup"
                      score={scores.startupScore}
                      rationale={scores.startupRationale}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ds-text-muted">
              Signal score is being prepared. Check back shortly.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
