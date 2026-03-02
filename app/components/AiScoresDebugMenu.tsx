"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const DEBUG_PARAM = "ai_debug";

type Mode = "full" | "blurred" | "owner" | "off";

/**
 * Dev-only menu to override AI score block visibility for testing.
 * Only rendered when NODE_ENV=development.
 */
export function AiScoresDebugMenu({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get(DEBUG_PARAM) ?? "off") as Mode;

  const setMode = useCallback(
    (mode: Mode) => {
      const next = new URLSearchParams(searchParams.toString());
      if (mode === "off") {
        next.delete(DEBUG_PARAM);
      } else {
        next.set(DEBUG_PARAM, mode);
      }
      const qs = next.toString();
      router.push(qs ? `/i/${slug}?${qs}` : `/i/${slug}`);
    },
    [slug, router, searchParams]
  );

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <section
      className="rounded-ds border border-ds-border bg-ds-surface-hover p-3 text-xs"
      aria-label="AI scores debug (development only)"
    >
      <p className="font-medium text-ds-text-muted">AI scores debug</p>
      <p className="mt-1 text-ds-text-subtle">Override visibility for testing:</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(["off", "full", "blurred", "owner"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setMode(mode)}
            className={`rounded-ds-sm border px-2 py-1 transition-colors duration-ds-fast ease-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg ${
              current === mode
                ? "border-ds-accent bg-ds-accent/20 text-ds-text"
                : "border-ds-border bg-ds-surface text-ds-text-muted hover:border-ds-border/80 hover:text-ds-text"
            }`}
          >
            {mode === "off" ? "Real" : mode}
          </button>
        ))}
      </div>
    </section>
  );
}
