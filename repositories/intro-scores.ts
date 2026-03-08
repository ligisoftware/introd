import type { SupabaseClient } from "@supabase/supabase-js";

export interface IntroScoreRow {
  intro_id: string;
  signal_score: number | null;
  summary: string[] | null;
  founder_score: number | null;
  founder_rationale: string | null;
  founder_bullets: string[];
  startup_score: number | null;
  startup_rationale: string | null;
  startup_bullets: string[];
  computed_at: string;
}

export interface IntroScores {
  introId: string;
  signalScore: number | null;
  summary: string[] | null;
  founderScore: number | null;
  founderRationale: string | null;
  founderBullets: string[];
  startupScore: number | null;
  startupRationale: string | null;
  startupBullets: string[];
  computedAt: string;
}

function rowToScores(row: IntroScoreRow): IntroScores {
  return {
    introId: row.intro_id,
    signalScore: row.signal_score ?? null,
    summary: Array.isArray(row.summary) ? row.summary : null,
    founderScore: row.founder_score ?? null,
    founderRationale: row.founder_rationale ?? null,
    founderBullets: Array.isArray(row.founder_bullets) ? row.founder_bullets : [],
    startupScore: row.startup_score ?? null,
    startupRationale: row.startup_rationale ?? null,
    startupBullets: Array.isArray(row.startup_bullets) ? row.startup_bullets : [],
    computedAt: row.computed_at,
  };
}

const SELECT =
  "intro_id, signal_score, summary, founder_score, founder_rationale, founder_bullets, startup_score, startup_rationale, startup_bullets, computed_at";

export async function getByIntroId(
  supabase: SupabaseClient,
  introId: string
): Promise<IntroScores | null> {
  const { data, error } = await supabase
    .from("intro_scores")
    .select(SELECT)
    .eq("intro_id", introId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToScores(data as IntroScoreRow);
}

export interface IntroScoresInsertRow {
  intro_id: string;
  signal_score: number | null;
  summary: string[] | null;
  founder_score: number | null;
  founder_rationale: string | null;
  founder_bullets: string[];
  startup_score: number | null;
  startup_rationale: string | null;
  startup_bullets: string[];
  computed_at?: string;
}

export async function upsert(
  supabase: SupabaseClient,
  row: IntroScoresInsertRow
): Promise<IntroScores> {
  const { data, error } = await supabase
    .from("intro_scores")
    .upsert(
      {
        intro_id: row.intro_id,
        signal_score: row.signal_score,
        summary: row.summary,
        founder_score: row.founder_score,
        founder_rationale: row.founder_rationale,
        founder_bullets: row.founder_bullets,
        startup_score: row.startup_score,
        startup_rationale: row.startup_rationale,
        startup_bullets: row.startup_bullets,
        computed_at: row.computed_at ?? new Date().toISOString(),
      },
      { onConflict: "intro_id" }
    )
    .select(SELECT)
    .single();

  if (error) throw error;
  return rowToScores(data as IntroScoreRow);
}

export async function deleteByIntroId(supabase: SupabaseClient, introId: string): Promise<void> {
  const { error } = await supabase.from("intro_scores").delete().eq("intro_id", introId);
  if (error) throw error;
}
