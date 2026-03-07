/**
 * Viewer context for the shared intro page: who is viewing and what score block to show.
 * Supports a debug override (dev only) to test all visibility states without multiple accounts.
 */

export type ScoreBlockMode = "full" | "blurred" | "hidden";

export type ViewerKind = "anonymous" | "owner" | "non-owner";

/**
 * When true, AI scores are shown to everyone (anonymous and owner see full scores).
 * Set to false to restore normal behavior: owner → hidden, anonymous → blurred, non-owner → full.
 */
export const ALWAYS_SHOW_AI_SCORES = true;

const DEBUG_PARAM = "ai_debug";
/** Debug override is only allowed in development (never in production). */
const DEBUG_ENABLED = process.env.NODE_ENV === "development";

/**
 * Resolves the effective score block mode from viewer and optional debug override.
 * - anonymous → blurred (or full when ALWAYS_SHOW_AI_SCORES)
 * - owner → hidden (or full when ALWAYS_SHOW_AI_SCORES)
 * - non-owner → full
 * Debug override (dev only): ?ai_debug=full|blurred|owner|off
 */
export function resolveScoreBlockMode(
  viewerKind: ViewerKind,
  debugParam: string | null
): ScoreBlockMode {
  if (DEBUG_ENABLED && debugParam && debugParam !== "off") {
    if (debugParam === "full" || debugParam === "blurred" || debugParam === "owner") {
      return debugParam === "owner" ? "hidden" : debugParam;
    }
  }

  if (ALWAYS_SHOW_AI_SCORES) {
    return "full";
  }

  switch (viewerKind) {
    case "anonymous":
      return "blurred";
    case "owner":
      return "hidden";
    case "non-owner":
      return "full";
  }
}

/**
 * Parses the ai_debug query parameter from a string (e.g. searchParams.ai_debug).
 */
export function getDebugParam(searchParams: { get(key: string): string | null }): string | null {
  const v = searchParams.get(DEBUG_PARAM);
  return v ? v.toLowerCase() : null;
}

/**
 * Determines viewer kind from current user id and intro owner user id.
 */
export function getViewerKind(currentUserId: string | null, ownerUserId: string): ViewerKind {
  if (!currentUserId) return "anonymous";
  if (currentUserId === ownerUserId) return "owner";
  return "non-owner";
}
