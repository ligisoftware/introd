import type { SupabaseClient } from "@supabase/supabase-js";

export interface IntroScoreRow {
  intro_id: string;
  summary: string | null;
  founder_score: number | null;
  founder_bullets: string[];
  startup_score: number | null;
  startup_bullets: string[];
  computed_at: string;
}

export interface IntroScores {
  introId: string;
  summary: string | null;
  founderScore: number | null;
  founderBullets: string[];
  startupScore: number | null;
  startupBullets: string[];
  computedAt: string;
}

function rowToScores(row: IntroScoreRow): IntroScores {
  return {
    introId: row.intro_id,
    summary: row.summary ?? null,
    founderScore: row.founder_score ?? null,
    founderBullets: Array.isArray(row.founder_bullets) ? row.founder_bullets : [],
    startupScore: row.startup_score ?? null,
    startupBullets: Array.isArray(row.startup_bullets) ? row.startup_bullets : [],
    computedAt: row.computed_at,
  };
}

const SELECT =
  "intro_id, summary, founder_score, founder_bullets, startup_score, startup_bullets, computed_at";

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
  summary: string | null;
  founder_score: number | null;
  founder_bullets: string[];
  startup_score: number | null;
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
        summary: row.summary,
        founder_score: row.founder_score,
        founder_bullets: row.founder_bullets,
        startup_score: row.startup_score,
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

export async function deleteByIntroId(
  supabase: SupabaseClient,
  introId: string
): Promise<void> {
  const { error } = await supabase.from("intro_scores").delete().eq("intro_id", introId);
  if (error) throw error;
}
