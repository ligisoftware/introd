-- AI intro scores cache: one row per intro (founder + startup summary and scores).
-- Only server/service role should read or write; RLS denies direct client access.

create table public.intro_scores (
  intro_id       uuid primary key references public.intros(id) on delete cascade,
  summary        text,
  founder_score  smallint check (founder_score is null or (founder_score >= 1 and founder_score <= 10)),
  founder_bullets jsonb default '[]'::jsonb check (founder_bullets is null or jsonb_typeof(founder_bullets) = 'array'),
  startup_score  smallint check (startup_score is null or (startup_score >= 1 and startup_score <= 10)),
  startup_bullets jsonb default '[]'::jsonb check (startup_bullets is null or jsonb_typeof(startup_bullets) = 'array'),
  computed_at    timestamptz not null default now()
);

create index idx_intro_scores_computed_at on public.intro_scores(computed_at);

alter table public.intro_scores enable row level security;

-- No policies for anon/authenticated: only service role (bypasses RLS) can read/write.
-- This keeps scores server-only; viewer page uses server logic to decide what to expose.
