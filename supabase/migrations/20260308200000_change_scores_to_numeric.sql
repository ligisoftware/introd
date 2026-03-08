-- Change score columns from smallint to numeric to support decimal scores.
alter table public.intro_scores
  drop constraint if exists intro_scores_signal_score_check,
  drop constraint if exists intro_scores_founder_score_check,
  drop constraint if exists intro_scores_startup_score_check;

alter table public.intro_scores
  alter column signal_score type numeric(3,1) using signal_score::numeric(3,1),
  alter column founder_score type numeric(3,1) using founder_score::numeric(3,1),
  alter column startup_score type numeric(3,1) using startup_score::numeric(3,1);

alter table public.intro_scores
  add constraint intro_scores_signal_score_check check (signal_score is null or (signal_score >= 0 and signal_score <= 10)),
  add constraint intro_scores_founder_score_check check (founder_score is null or (founder_score >= 1 and founder_score <= 10)),
  add constraint intro_scores_startup_score_check check (startup_score is null or (startup_score >= 1 and startup_score <= 10));
