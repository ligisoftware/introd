"use client";

import Link from "next/link";
import type { IntroScores } from "@/repositories/intro-scores";
import { MovingBorder } from "@/app/components/ui/moving-border";

export type IntroSignalBlockMode = "full" | "blurred" | "hidden";

interface IntroSignalBlockProps {
  mode: IntroSignalBlockMode;
  scores: IntroScores | null;
  viewerSlug?: string | null;
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-red-400";
}

function scoreGlow(score: number): string {
  if (score >= 8) return "drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]";
  if (score >= 5) return "drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]";
  return "drop-shadow-[0_0_12px_rgba(248,113,113,0.5)]";
}

function scoreBadgeBg(score: number): string {
  if (score >= 8) return "bg-emerald-500/10 ring-1 ring-emerald-500/20";
  if (score >= 5) return "bg-amber-500/10 ring-1 ring-amber-500/20";
  return "bg-red-500/10 ring-1 ring-red-500/20";
}

function subScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-red-400";
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
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ds-text-subtle">
          {label}
        </span>
        {score != null && (
          <span
            className={`tabular-nums text-lg font-bold ${subScoreColor(score)}`}
          >
            {score}
            <span className="text-[11px] font-normal text-ds-text-subtle">
              /10
            </span>
          </span>
        )}
      </div>
      {score != null && rationale ? (
        <p className="text-[13px] leading-relaxed text-ds-text-muted">
          {rationale}
        </p>
      ) : score == null ? (
        <p className="text-xs text-ds-text-subtle italic">
          Not enough info to assess.
        </p>
      ) : null}
    </div>
  );
}

export function IntroSignalBlock({
  mode,
  scores,
  viewerSlug,
}: IntroSignalBlockProps) {
  if (mode === "hidden") return null;

  const isBlurred = mode === "blurred";
  const loginHref =
    viewerSlug != null && viewerSlug !== ""
      ? `/login?next=${encodeURIComponent(`/i/${viewerSlug}`)}`
      : "/login";

  return (
    <div
      className="ds-stagger-1 relative rounded-ds-lg p-[2px] overflow-hidden"
      data-testid="intro-signal-block"
    >
      {/* Moving purple gradient border */}
      <div className="absolute inset-0 rounded-ds-lg overflow-hidden">
        <MovingBorder duration={6000} rx="12" ry="12">
          <div className="h-28 w-28 opacity-[0.85] bg-[radial-gradient(circle,#a855f7_0%,#7c3aed_30%,#6d28d9_50%,transparent_70%)]" />
        </MovingBorder>
      </div>

      {/* Subtle static purple border fallback */}
      <div className="absolute inset-0 rounded-ds-lg ring-1 ring-purple-500/10" />

      <section
        className="relative rounded-[calc(var(--ds-radius-lg)-1px)] bg-ds-surface p-5 sm:p-6"
        aria-label="Signal score"
      >
        {isBlurred ? (
          <>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
              Signal score
            </h2>
            <div
              className="mt-5 select-none blur-md pointer-events-none min-h-[6rem]"
              aria-hidden
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-ds bg-ds-surface-hover" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-ds-surface-hover" />
                  <div className="h-3 w-1/2 rounded bg-ds-surface-hover" />
                </div>
              </div>
            </div>
            <div className="ds-feedback-in mt-5 rounded-ds border border-ds-border bg-ds-surface-hover/50 p-5">
              <p className="text-sm text-ds-text-muted">
                See the AI signal score and quick summary — know at a glance if
                this intro is worth a deeper look.
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
          <div className="ds-feedback-in">
            {scores ? (
              <div className="space-y-6">
                {/* Header + Primary Score */}
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                    Signal score
                  </h2>
                  {scores.signalScore != null && (
                    <div
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${scoreBadgeBg(scores.signalScore)} ${scoreColor(scores.signalScore)}`}
                    >
                      {scores.signalScore >= 8
                        ? "Strong"
                        : scores.signalScore >= 5
                          ? "Moderate"
                          : "Weak"}
                    </div>
                  )}
                </div>

                {/* Big Score */}
                {scores.signalScore != null && (
                  <div className="ds-stagger-2 flex items-center justify-center py-2">
                    <div className="text-center">
                      <span
                        className={`text-6xl font-black tabular-nums leading-none ${scoreColor(scores.signalScore)} ${scoreGlow(scores.signalScore)}`}
                        aria-label={`Signal score: ${scores.signalScore} out of 10`}
                      >
                        {scores.signalScore}
                      </span>
                      <span className="ml-1 text-xl font-medium text-ds-text-subtle">
                        /10
                      </span>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {scores.summary && (
                  <div className="ds-stagger-3">
                    <p className="text-[14px] leading-[1.7] text-ds-text-muted text-center">
                      {scores.summary}
                    </p>
                  </div>
                )}

                {/* Subscores */}
                {(scores.founderScore != null ||
                  scores.startupScore != null) && (
                  <div className="ds-stagger-4 border-t border-ds-border pt-5">
                    <div className="grid grid-cols-2 gap-5">
                      <SubScore
                        label="Founder"
                        score={scores.founderScore}
                        rationale={scores.founderRationale}
                      />
                      <SubScore
                        label="Startup"
                        score={scores.startupScore}
                        rationale={scores.startupRationale}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                  Signal score
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ds-text-muted">
                  Signal score is being prepared. Check back shortly.
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
