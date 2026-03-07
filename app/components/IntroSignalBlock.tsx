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
  if (score >= 8) return "drop-shadow-[0_0_16px_rgba(52,211,153,0.6)]";
  if (score >= 5) return "drop-shadow-[0_0_16px_rgba(251,191,36,0.5)]";
  return "drop-shadow-[0_0_16px_rgba(248,113,113,0.6)]";
}

function scoreBadgeBg(score: number): string {
  if (score >= 8) return "bg-emerald-500/10 ring-1 ring-emerald-500/20";
  if (score >= 5) return "bg-amber-500/10 ring-1 ring-amber-500/20";
  return "bg-red-500/10 ring-1 ring-red-500/20";
}

function scoreBarColor(score: number): string {
  if (score >= 8) return "bg-emerald-400";
  if (score >= 5) return "bg-amber-400";
  return "bg-red-400";
}

function scoreBarGlow(score: number): string {
  if (score >= 8)
    return "shadow-[0_0_8px_rgba(52,211,153,0.4),0_0_2px_rgba(52,211,153,0.6)]";
  if (score >= 5)
    return "shadow-[0_0_8px_rgba(251,191,36,0.4),0_0_2px_rgba(251,191,36,0.6)]";
  return "shadow-[0_0_8px_rgba(248,113,113,0.4),0_0_2px_rgba(248,113,113,0.6)]";
}

// Radial gradient from the exact score color to transparent — the soft fade IS the glow.
// box-shadow gets clipped by overflow-hidden, but the gradient extends naturally.
function borderHighlightClass(score: number | null | undefined): string {
  // emerald-400=#34d399, amber-400=#fbbf24, red-400=#f87171, purple-400=#c084fc
  if (score == null) return "bg-[radial-gradient(circle,#c084fc_0%,#c084fc_25%,transparent_70%)]";
  if (score >= 8) return "bg-[radial-gradient(circle,#34d399_0%,#34d399_25%,transparent_70%)]";
  if (score >= 5) return "bg-[radial-gradient(circle,#fbbf24_0%,#fbbf24_25%,transparent_70%)]";
  return "bg-[radial-gradient(circle,#f87171_0%,#f87171_25%,transparent_70%)]";
}

function borderRingColor(score: number | null | undefined): string {
  if (score == null) return "ring-purple-500/10";
  if (score >= 8) return "ring-emerald-500/10";
  if (score >= 5) return "ring-amber-500/10";
  return "ring-red-500/10";
}

function SubScoreRow({
  label,
  score,
  rationale,
}: {
  label: string;
  score: number | null;
  rationale: string | null;
}) {
  if (score == null) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ds-text-subtle">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${scoreColor(score)}`}>
          {score}
          <span className="text-[10px] font-normal text-ds-text-subtle">
            /10
          </span>
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-ds-surface-hover overflow-hidden">
        <div
          className={`h-full rounded-full ${scoreBarColor(score)} ${scoreBarGlow(score)} transition-all duration-ds-slow ease-ds-out`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      {rationale && (
        <p className="text-xs text-ds-text-muted">{rationale}</p>
      )}
    </div>
  );
}

function AiSparkle() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="text-purple-400"
    >
      <path
        d="M8 0L9.79 6.21L16 8L9.79 9.79L8 16L6.21 9.79L0 8L6.21 6.21L8 0Z"
        fill="currentColor"
      />
    </svg>
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

  const signalScore = isBlurred ? null : scores?.signalScore;

  return (
    <div
      className="ds-stagger-1 relative rounded-ds-lg p-[2px] overflow-hidden"
      data-testid="intro-signal-block"
    >
      {/* Moving score-colored gradient border */}
      <div className="absolute inset-0 rounded-ds-lg overflow-hidden">
        <MovingBorder duration={7500} rx="12" ry="12">
          <div className={`h-40 w-40 opacity-[0.9] ${borderHighlightClass(signalScore)}`} />
        </MovingBorder>
      </div>

      {/* Subtle static border fallback */}
      <div className={`absolute inset-0 rounded-ds-lg ring-1 ${borderRingColor(signalScore)}`} />

      <section
        className="relative rounded-[calc(var(--ds-radius-lg)-1px)] bg-ds-bg-elevated p-5 sm:p-6 shadow-ds-md"
        aria-label="Signal score"
      >
        {isBlurred ? (
          <>
            <div className="flex items-center justify-center gap-1.5">
              <AiSparkle />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                Signal score
              </h2>
            </div>
            <div
              className="mt-5 select-none blur-md pointer-events-none min-h-[6rem]"
              aria-hidden
            >
              <div className="flex items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-ds bg-ds-surface-hover" />
                <div className="flex-1 space-y-2 max-w-[12rem]">
                  <div className="h-3 w-3/4 rounded bg-ds-surface-hover" />
                  <div className="h-3 w-1/2 rounded bg-ds-surface-hover" />
                </div>
              </div>
            </div>
            <div className="ds-feedback-in mt-5 rounded-ds border border-ds-border bg-ds-surface-hover/50 p-5 text-center">
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
                    &rarr;
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
              <div className="space-y-5 text-center">
                {/* Header */}
                <div className="flex items-center justify-center gap-1.5">
                  <AiSparkle />
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                    Signal score
                  </h2>
                </div>

                {/* Big Score + Badge */}
                {scores.signalScore != null && (
                  <div className="ds-stagger-2">
                    <span
                      className={`text-6xl font-black tabular-nums leading-none ${scoreColor(scores.signalScore)} ${scoreGlow(scores.signalScore)}`}
                      aria-label={`Signal score: ${scores.signalScore} out of 10`}
                    >
                      {scores.signalScore}
                    </span>
                    <span className="ml-1 text-xl font-medium text-ds-text-subtle">
                      /10
                    </span>
                    <div className="mt-2">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${scoreBadgeBg(scores.signalScore)} ${scoreColor(scores.signalScore)}`}
                      >
                        {scores.signalScore >= 8
                          ? "Strong"
                          : scores.signalScore >= 5
                            ? "Moderate"
                            : "Weak"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {scores.summary && (
                  <p className="ds-stagger-3 text-sm leading-relaxed text-ds-text-muted max-w-sm mx-auto">
                    {scores.summary}
                  </p>
                )}

                {/* Subscores */}
                {(scores.founderScore != null ||
                  scores.startupScore != null) && (
                  <div className="ds-stagger-4 border-t border-ds-border pt-5 text-left space-y-4">
                    <SubScoreRow
                      label="Founder"
                      score={scores.founderScore}
                      rationale={scores.founderRationale}
                    />
                    <SubScoreRow
                      label="Startup"
                      score={scores.startupScore}
                      rationale={scores.startupRationale}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <AiSparkle />
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                    Signal score
                  </h2>
                </div>
                <p className="mt-4 text-sm text-ds-text-muted">
                  Signal score is being prepared. Check back shortly.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
