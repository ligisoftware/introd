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

// Bold, saturated score colors — #10b981 green, #f59e0b amber, #ef4444 red
function scoreColor(score: number): string {
  if (score >= 8) return "text-[#10b981]";
  if (score >= 5) return "text-[#f59e0b]";
  return "text-[#ef4444]";
}

function scoreGlow(score: number): string {
  if (score >= 8) return "drop-shadow-[0_0_16px_rgba(16,185,129,0.6)]";
  if (score >= 5) return "drop-shadow-[0_0_16px_rgba(245,158,11,0.5)]";
  return "drop-shadow-[0_0_16px_rgba(239,68,68,0.6)]";
}

function scoreBadgeBg(score: number): string {
  if (score >= 8) return "bg-[#10b981]/15 ring-1 ring-[#10b981]/25";
  if (score >= 5) return "bg-[#f59e0b]/15 ring-1 ring-[#f59e0b]/25";
  return "bg-[#ef4444]/15 ring-1 ring-[#ef4444]/25";
}

function scoreBarColor(score: number): string {
  if (score >= 8) return "bg-[#10b981]";
  if (score >= 5) return "bg-[#f59e0b]";
  return "bg-[#ef4444]";
}

function scoreBarGlow(score: number): string {
  if (score >= 8)
    return "shadow-[0_0_8px_rgba(16,185,129,0.5),0_0_2px_rgba(16,185,129,0.7)]";
  if (score >= 5)
    return "shadow-[0_0_8px_rgba(245,158,11,0.5),0_0_2px_rgba(245,158,11,0.7)]";
  return "shadow-[0_0_8px_rgba(239,68,68,0.5),0_0_2px_rgba(239,68,68,0.7)]";
}

// Soft glowy highlight for the moving border
const BORDER_HIGHLIGHT =
  "bg-[radial-gradient(circle,rgba(125,211,252,0.7)_0%,rgba(56,189,248,0.3)_35%,transparent_65%)]";

const BORDER_DROP_SHADOW =
  "drop-shadow(0 0 8px rgba(125,211,252,0.4)) drop-shadow(0 0 2px rgba(56,189,248,0.3))";

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
        <span className="text-xs font-medium text-ds-text-muted">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${scoreColor(score)}`}>
          {score}
          <span className="text-[10px] font-normal text-ds-text-muted">
            /10
          </span>
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-ds-surface-hover overflow-hidden">
        <div
          className={`h-full rounded-full ${scoreBarColor(score)} ${scoreBarGlow(score)} transition-all duration-ds-slow ease-ds-out`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      {rationale && (
        <p className="text-xs text-ds-text">{rationale}</p>
      )}
    </div>
  );
}

function AiSparkle() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="text-sky-300"
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

  return (
    <div
      className="ds-stagger-1 relative rounded-2xl p-[2px]"
      data-testid="intro-signal-block"
    >
      {/* Moving border */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ filter: BORDER_DROP_SHADOW }}
      >
        <MovingBorder duration={10000} rx="16" ry="16">
          <div className={`h-40 w-40 opacity-[0.8] ${BORDER_HIGHLIGHT}`} />
        </MovingBorder>
      </div>

      <section
        className="relative rounded-[calc(1rem-1px)] border border-[var(--ds-glass-border)] bg-ds-surface p-5"
        aria-label="Signal score"
      >
        {isBlurred ? (
          <div>
            <div className="flex items-center gap-1.5">
              <AiSparkle />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                Signal score
              </h2>
            </div>
            <div
              className="mt-4 select-none blur-md pointer-events-none min-h-[5rem]"
              aria-hidden
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-ds-surface-hover" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-ds-surface-hover" />
                  <div className="h-3 w-1/2 rounded bg-ds-surface-hover" />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-ds-border bg-ds-surface-hover/50 p-4">
              <p className="text-sm text-ds-text">
                See the AI signal score and quick summary — know at a glance if
                this intro is worth a deeper look.
              </p>
              <p className="mt-3">
                <Link
                  href={loginHref}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ds-accent transition-opacity duration-ds-fast ease-ds hover:text-ds-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg"
                >
                  Log in to see signal score
                  <span aria-hidden className="text-ds-text-muted">
                    &rarr;
                  </span>
                </Link>
              </p>
              <p className="mt-2 text-xs text-ds-text-muted">
                Free for viewers once you&apos;re signed in.
              </p>
            </div>
          </div>
        ) : (
          <div className="ds-feedback-in">
            {scores ? (
              <div className="space-y-5">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AiSparkle />
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                      Signal score
                    </h2>
                  </div>
                  {scores.signalScore != null && (
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${scoreBadgeBg(scores.signalScore)} ${scoreColor(scores.signalScore)}`}
                    >
                      {scores.signalScore >= 8
                        ? "Strong"
                        : scores.signalScore >= 5
                          ? "Moderate"
                          : "Weak"}
                    </span>
                  )}
                </div>

                {/* Score */}
                {scores.signalScore != null && (
                  <div className="ds-stagger-2 text-center py-1">
                    <span
                      className={`text-5xl font-black tabular-nums leading-none ${scoreColor(scores.signalScore)} ${scoreGlow(scores.signalScore)}`}
                      aria-label={`Signal score: ${scores.signalScore} out of 10`}
                    >
                      {scores.signalScore}
                    </span>
                    <span className="ml-1 text-lg font-medium text-ds-text-muted">
                      /10
                    </span>
                  </div>
                )}

                {/* Summary */}
                {scores.summary && (
                  <p className="ds-stagger-3 text-[13px] leading-[1.7] text-ds-text">
                    {scores.summary}
                  </p>
                )}

                {/* Subscores */}
                {(scores.founderScore != null ||
                  scores.startupScore != null) && (
                  <div className="ds-stagger-4 border-t border-ds-border pt-4 space-y-4">
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
              <div>
                <div className="flex items-center gap-1.5">
                  <AiSparkle />
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ds-text-subtle">
                    Signal score
                  </h2>
                </div>
                <p className="mt-4 text-sm text-ds-text">
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
