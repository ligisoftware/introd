import { describe, it, expect } from "vitest";
import { serializeIntroForLLM } from "./serialize-intro";
import type { PublicIntroProfile } from "@/types";

describe("serializeIntroForLLM", () => {
  it("omits empty fields", () => {
    const profile: PublicIntroProfile = {};
    const out = serializeIntroForLLM(profile);
    expect(out).toBe("");
  });

  it("includes company and one-liner", () => {
    const profile: PublicIntroProfile = {
      startupName: "Acme Inc",
      startupOneLiner: "We do things.",
    };
    const out = serializeIntroForLLM(profile);
    expect(out).toContain("Company: Acme Inc");
    expect(out).toContain("One-liner: We do things.");
  });

  it("includes founder name, title, and bio", () => {
    const profile: PublicIntroProfile = {
      name: "Jane Doe",
      title: "CEO",
      ownerBio: "Previously at X.",
    };
    const out = serializeIntroForLLM(profile);
    expect(out).toContain("Founder: Jane Doe, CEO. Previously at X.");
  });

  it("includes team members", () => {
    const profile: PublicIntroProfile = {
      teamMembers: [{ name: "Alice", title: "CTO", bio: "Ex-Y" }, { name: "Bob" }],
    };
    const out = serializeIntroForLLM(profile);
    expect(out).toContain("Team:");
    expect(out).toContain("Alice");
    expect(out).toContain("CTO");
    expect(out).toContain("Bob");
  });

  it("is deterministic for same input", () => {
    const profile: PublicIntroProfile = {
      startupName: "Test",
      startupOneLiner: "One",
      introText: "Intro",
    };
    const a = serializeIntroForLLM(profile);
    const b = serializeIntroForLLM(profile);
    expect(a).toBe(b);
  });

  it("keeps output under rough token budget (~1.5k tokens ≈ 6k chars)", () => {
    const profile: PublicIntroProfile = {
      startupName: "A".repeat(200),
      startupOneLiner: "B".repeat(300),
      introText: "C".repeat(1000),
      name: "D",
      ownerBio: "E".repeat(500),
      teamMembers: Array.from({ length: 10 }, (_, i) => ({
        name: `Member ${i}`,
        title: "Title",
        bio: "Bio here",
      })),
    };
    const out = serializeIntroForLLM(profile);
    expect(out.length).toBeLessThan(6000);
  });
});
