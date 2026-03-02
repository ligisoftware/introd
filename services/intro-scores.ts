import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import type { PublicIntroProfile } from "@/types";
import { getByIntroId, upsert, deleteByIntroId } from "@/repositories/intro-scores";
import type { IntroScores } from "@/repositories/intro-scores";
import { IntroScoresResponseSchema } from "@/lib/validation/intro-scores";
import { serializeIntroForLLM } from "@/lib/ai/serialize-intro";

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `You are an expert at evaluating founder intros for investors. You will receive a text description of a startup intro (company, one-liner, intro text, founder and team details, funding). Your task is to output a JSON object with:

1. **summary** (string): 2-4 sentences summarizing the intro. Be neutral and descriptive. Focus on clarity and completeness. Avoid judgment words; use phrases like "low differentiation" or "problem not yet clearly stated" instead of "bad idea."

2. **founderScore** (number 1-10 or null): Rate founder & team signal: role clarity, team completeness, experience relevance. Use null if there is insufficient information.

3. **founderBullets** (array of 2-4 strings): Brief reasons for the founder score. Omit if founderScore is null.

4. **startupScore** (number 1-10 or null): Rate the startup: is there a real problem, a real market, differentiation? "Twitter clone" / "me-too" / generic "AI for X" with no wedge = low score. Use null if insufficient information.

5. **startupBullets** (array of 2-4 strings): Brief reasons for the startup score. Omit if startupScore is null.

Output only valid JSON with these keys. Keep bullets concise.`;

/**
 * Returns cached intro scores for an intro, or null if not computed.
 */
export async function getIntroScores(
  supabase: SupabaseClient,
  introId: string
): Promise<IntroScores | null> {
  return getByIntroId(supabase, introId);
}

/**
 * Deletes cached scores for an intro (e.g. after intro or collaborator update).
 */
export async function invalidateIntroScores(
  supabase: SupabaseClient,
  introId: string
): Promise<void> {
  try {
    await deleteByIntroId(supabase, introId);
  } catch (err) {
    console.error("[intro-scores] invalidate failed", { introId, err });
    throw err;
  }
}

/**
 * Computes founder + startup scores via LLM, persists to intro_scores, and returns the result.
 * On API or parse failure: logs, does not persist, returns null.
 */
export async function computeAndPersistIntroScores(
  supabase: SupabaseClient,
  introId: string,
  profile: PublicIntroProfile
): Promise<IntroScores | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("[intro-scores] OPENAI_API_KEY not set; skipping compute", { introId });
    return null;
  }

  const start = Date.now();
  const serialized = serializeIntroForLLM(profile);

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: serialized },
      ],
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      console.error("[intro-scores] empty response", { introId });
      return null;
    }

    const parsed = JSON.parse(rawContent) as unknown;
    const result = IntroScoresResponseSchema.safeParse(parsed);
    if (!result.success) {
      console.error("[intro-scores] parse failed", { introId, errors: result.error.flatten() });
      return null;
    }

    const data = result.data;
    await upsert(supabase, {
      intro_id: introId,
      summary: data.summary,
      founder_score: data.founderScore,
      founder_bullets: data.founderBullets,
      startup_score: data.startupScore,
      startup_bullets: data.startupBullets,
    });

    const elapsed = Date.now() - start;
    console.info("[intro-scores] computed", {
      introId,
      model: MODEL,
      latencyMs: elapsed,
      success: true,
    });

    return getByIntroId(supabase, introId);
  } catch (err) {
    const elapsed = Date.now() - start;
    console.error("[intro-scores] compute failed", { introId, model: MODEL, latencyMs: elapsed, err });
    return null;
  }
}
