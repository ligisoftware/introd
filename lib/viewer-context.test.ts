import { describe, it, expect } from "vitest";
import { getViewerKind, getDebugParam, resolveScoreBlockMode } from "./viewer-context";

describe("getViewerKind", () => {
  const ownerId = "owner-uuid";

  it("returns anonymous when current user is null", () => {
    expect(getViewerKind(null, ownerId)).toBe("anonymous");
  });

  it("returns owner when current user id equals owner id", () => {
    expect(getViewerKind(ownerId, ownerId)).toBe("owner");
  });

  it("returns non-owner when current user id differs from owner id", () => {
    expect(getViewerKind("other-uuid", ownerId)).toBe("non-owner");
  });
});

describe("getDebugParam", () => {
  it("returns null when param is missing", () => {
    expect(getDebugParam({ get: () => null })).toBe(null);
    expect(getDebugParam({ get: (k) => (k === "ai_debug" ? undefined : null) })).toBe(null);
  });

  it("returns lowercased value for ai_debug", () => {
    expect(getDebugParam({ get: (k) => (k === "ai_debug" ? "FULL" : null) })).toBe("full");
    expect(getDebugParam({ get: (k) => (k === "ai_debug" ? "Blurred" : null) })).toBe("blurred");
  });
});

describe("resolveScoreBlockMode", () => {
  // When debug is disabled (NODE_ENV=test and no NEXT_PUBLIC_AI_SCORES_DEBUG),
  // debug param is ignored and viewer-based behavior is used.

  it("returns blurred for anonymous viewer when no debug override", () => {
    expect(resolveScoreBlockMode("anonymous", null)).toBe("blurred");
    expect(resolveScoreBlockMode("anonymous", "off")).toBe("blurred");
  });

  it("returns hidden for owner when no debug override", () => {
    expect(resolveScoreBlockMode("owner", null)).toBe("hidden");
    expect(resolveScoreBlockMode("owner", "off")).toBe("hidden");
  });

  it("returns full for non-owner when no debug override", () => {
    expect(resolveScoreBlockMode("non-owner", null)).toBe("full");
    expect(resolveScoreBlockMode("non-owner", "off")).toBe("full");
  });

  it("falls back to viewer when debug param is invalid (debug disabled in test env)", () => {
    // In test env DEBUG_ENABLED is typically false, so "full" param is ignored
    expect(resolveScoreBlockMode("owner", "full")).toBe("hidden");
    expect(resolveScoreBlockMode("anonymous", "full")).toBe("blurred");
  });
});
