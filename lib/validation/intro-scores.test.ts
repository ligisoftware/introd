import { describe, it, expect } from "vitest";
import { IntroScoresResponseSchema } from "./intro-scores";

describe("IntroScoresResponseSchema", () => {
  it("parses valid full response", () => {
    const raw = {
      summary: "Strong founder signal. Startup has clear differentiation.",
      founderScore: 8,
      founderBullets: ["Clear role", "Relevant experience"],
      startupScore: 7,
      startupBullets: ["Real problem", "Specific market"],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.summary).toBe(raw.summary);
      expect(result.data.founderScore).toBe(8);
      expect(result.data.startupScore).toBe(7);
      expect(result.data.founderBullets).toHaveLength(2);
      expect(result.data.startupBullets).toHaveLength(2);
    }
  });

  it("allows null scores for insufficient information", () => {
    const raw = {
      summary: "Limited information provided.",
      founderScore: null,
      founderBullets: [],
      startupScore: null,
      startupBullets: [],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.founderScore).toBeNull();
      expect(result.data.startupScore).toBeNull();
    }
  });

  it("rejects score out of range", () => {
    const raw = {
      summary: "Ok",
      founderScore: 11,
      founderBullets: [],
      startupScore: 5,
      startupBullets: [],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it("rejects empty summary", () => {
    const raw = {
      summary: "",
      founderScore: 5,
      founderBullets: [],
      startupScore: 5,
      startupBullets: [],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it("accepts null or omitted bullets as empty array", () => {
    expect(
      IntroScoresResponseSchema.safeParse({
        summary: "Ok",
        founderScore: 5,
        founderBullets: null,
        startupScore: 5,
        startupBullets: undefined,
      }).success
    ).toBe(true);
    const parsed = IntroScoresResponseSchema.safeParse({
      summary: "Ok",
      founderScore: 5,
      startupScore: 5,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.founderBullets).toEqual([]);
      expect(parsed.data.startupBullets).toEqual([]);
    }
  });

  it("caps founderBullets at 4", () => {
    const raw = {
      summary: "Summary",
      founderScore: 5,
      founderBullets: ["a", "b", "c", "d", "e"],
      startupScore: 5,
      startupBullets: [],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });
});
