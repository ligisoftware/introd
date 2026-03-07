-- Add composite signal_score and replace bullet arrays with short rationale strings.
alter table public.intro_scores add column signal_score smallint
  check (signal_score is null or (signal_score >= 0 and signal_score <= 10));

alter table public.intro_scores add column founder_rationale text;
alter table public.intro_scores add column startup_rationale text;
