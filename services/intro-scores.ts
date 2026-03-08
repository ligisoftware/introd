import fs from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import type { PublicIntroProfile } from "@/types";
import { getByIntroId, upsert, deleteByIntroId } from "@/repositories/intro-scores";
import type { IntroScores } from "@/repositories/intro-scores";
import { IntroScoresResponseSchema } from "@/lib/validation/intro-scores";
import { serializeIntroForLLM } from "@/lib/ai/serialize-intro";
import { getPublicProfileByIntroId } from "@/repositories/intros";
import { getTeamMembersForIntro } from "@/repositories/collaborators";

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "lib/ai/intro-scores-prompt.txt"),
  "utf-8"
).trim();

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
    console.log("[intro-scores] raw LLM response", { introId, parsed });
    const result = IntroScoresResponseSchema.safeParse(parsed);
    if (!result.success) {
      console.error("[intro-scores] parse failed", { introId, errors: result.error.flatten() });
      return null;
    }

    const data = result.data;
    await upsert(supabase, {
      intro_id: introId,
      signal_score: data.signalScore,
      summary: data.summary,
      founder_score: data.founderScore,
      founder_rationale: data.founderRationale ?? null,
      founder_bullets: data.founderBullets,
      startup_score: data.startupScore,
      startup_rationale: data.startupRationale ?? null,
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
    console.error("[intro-scores] compute failed", {
      introId,
      model: MODEL,
      latencyMs: elapsed,
      err,
    });
    return null;
  }
}

/**
 * Invalidates cached scores and eagerly recomputes them in the background.
 * Fire-and-forget — errors are logged but don't propagate.
 */
export function refreshIntroScores(supabase: SupabaseClient, introId: string): void {
  (async () => {
    try {
      await deleteByIntroId(supabase, introId);

      const result = await getPublicProfileByIntroId(supabase, introId);
      if (!result) return;

      const { profile, ownerEmail, showOwnerEmail } = result;
      const collaboratorMembers = await getTeamMembersForIntro(supabase, introId);
      const ownerMember = {
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        email: showOwnerEmail ? ownerEmail : undefined,
        title: profile.title,
        startDate: profile.ownerStartDate,
        bio: profile.ownerBio,
        linkedinUrl: profile.userLinkedinUrl,
        twitterUrl: profile.userTwitterUrl,
      };
      profile.teamMembers = [ownerMember, ...collaboratorMembers];

      await computeAndPersistIntroScores(supabase, introId, profile);
    } catch (err) {
      console.error("[intro-scores] background refresh failed", { introId, err });
    }
  })();
}
