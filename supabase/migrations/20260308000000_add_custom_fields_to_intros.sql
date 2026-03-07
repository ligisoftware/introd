-- Migration: Add custom_fields JSONB column to intros
-- Allows founders to define arbitrary titled sections on their intro page.

alter table public.intros
  add column if not exists custom_fields jsonb not null default '[]'::jsonb;
