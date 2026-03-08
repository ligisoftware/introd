import { describe, it, expect } from "vitest";
import { IntroScoresResponseSchema } from "./intro-scores";

describe("IntroScoresResponseSchema", () => {
  it("parses valid full response", () => {
    const raw = {
      signalScore: 8,
      summary: [
        "AI infra startup with strong technical founders.",
        "Early traction and differentiated approach.",
      ],
      founderScore: 8,
      founderRationale: "Strong technical background with relevant domain experience.",
      founderBullets: ["Clear role", "Relevant experience"],
      startupScore: 7,
      startupRationale: "Real problem with differentiated approach, early revenue.",
      startupBullets: ["Real problem", "Specific market"],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.signalScore).toBe(8);
      expect(result.data.summary).toEqual(raw.summary);
      expect(result.data.founderScore).toBe(8);
      expect(result.data.founderRationale).toBe(raw.founderRationale);
      expect(result.data.startupScore).toBe(7);
      expect(result.data.startupRationale).toBe(raw.startupRationale);
    }
  });

  it("allows null scores for insufficient information", () => {
    const raw = {
      signalScore: 3,
      summary: ["Limited information provided."],
      founderScore: null,
      founderRationale: null,
      founderBullets: [],
      startupScore: null,
      startupRationale: null,
      startupBullets: [],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.founderScore).toBeNull();
      expect(result.data.startupScore).toBeNull();
      expect(result.data.founderRationale).toBeNull();
      expect(result.data.startupRationale).toBeNull();
    }
  });

  it("rejects score out of range", () => {
    const raw = {
      signalScore: 5,
      summary: ["Ok"],
      founderScore: 11,
      founderBullets: [],
      startupScore: 5,
      startupBullets: [],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it("rejects signalScore out of range", () => {
    const raw = {
      signalScore: 11,
      summary: ["Ok"],
      founderScore: 5,
      founderBullets: [],
      startupScore: 5,
      startupBullets: [],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it("allows signalScore of 0", () => {
    const raw = {
      signalScore: 0,
      summary: ["Insufficient information for meaningful evaluation."],
      founderScore: null,
      startupScore: null,
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.signalScore).toBe(0);
    }
  });

  it("rejects empty summary array", () => {
    const raw = {
      signalScore: 5,
      summary: [],
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
        signalScore: 5,
        summary: ["Ok"],
        founderScore: 5,
        founderBullets: null,
        startupScore: 5,
        startupBullets: undefined,
      }).success
    ).toBe(true);
    const parsed = IntroScoresResponseSchema.safeParse({
      signalScore: 5,
      summary: ["Ok"],
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
      signalScore: 5,
      summary: ["Summary"],
      founderScore: 5,
      founderBullets: ["a", "b", "c", "d", "e"],
      startupScore: 5,
      startupBullets: [],
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it("rejects missing signalScore", () => {
    const raw = {
      summary: ["Ok"],
      founderScore: 5,
      startupScore: 5,
    };
    const result = IntroScoresResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });
});
