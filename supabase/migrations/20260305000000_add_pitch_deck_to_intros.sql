-- Migration: Add pitch deck attachment to intros
-- 1. Add pitch deck columns to public.intros
-- 2. Create intro-pitch-decks storage bucket with RLS

-- =============================================================================
-- Step 1: Add pitch deck columns to intros
-- =============================================================================

alter table public.intros
  add column if not exists pitch_deck_source text check (pitch_deck_source in ('storage', 'external') or pitch_deck_source is null),
  add column if not exists pitch_deck_storage_path text,
  add column if not exists pitch_deck_external_url text,
  add column if not exists pitch_deck_file_name text,
  add column if not exists pitch_deck_file_size_bytes bigint,
  add column if not exists pitch_deck_uploaded_at timestamptz;

alter table public.intros
  add constraint intros_pitch_deck_mutual_exclusion
  check (
    pitch_deck_source is null
    or (
      pitch_deck_source = 'storage'
      and pitch_deck_storage_path is not null
      and pitch_deck_external_url is null
    )
    or (
      pitch_deck_source = 'external'
      and pitch_deck_external_url is not null
      and pitch_deck_storage_path is null
    )
  );

-- =============================================================================
-- Step 2: Create intro-pitch-decks storage bucket
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('intro-pitch-decks', 'intro-pitch-decks', true)
on conflict (id) do update
  set name = excluded.name,
      public = excluded.public;

-- RLS policies for intro-pitch-decks bucket

-- Public read access for intro pitch decks in the public bucket
drop policy if exists "Public read access for intro pitch decks" on storage.objects;
create policy "Public read access for intro pitch decks"
  on storage.objects
  for select
  using (bucket_id = 'intro-pitch-decks');

-- Allow authenticated users to upload pitch deck files under their own auth.uid() folder
drop policy if exists "Users can upload their own pitch decks" on storage.objects;
create policy "Users can upload their own pitch decks"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'intro-pitch-decks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update files under their own auth.uid() folder
drop policy if exists "Users can update their own pitch decks" on storage.objects;
create policy "Users can update their own pitch decks"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'intro-pitch-decks'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'intro-pitch-decks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete files under their own auth.uid() folder
drop policy if exists "Users can delete their own pitch decks" on storage.objects;
create policy "Users can delete their own pitch decks"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'intro-pitch-decks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

