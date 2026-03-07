-- Migration: Add generic attachments array to intros
-- Stores image and other file attachments alongside the existing pitch deck columns.

alter table public.intros
  add column if not exists attachments jsonb not null default '[]'::jsonb;

-- =============================================================================
-- Storage bucket for image attachments
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('intro-attachments', 'intro-attachments', true)
on conflict (id) do update
  set name = excluded.name,
      public = excluded.public;

-- Public read
drop policy if exists "Public read access for intro attachments" on storage.objects;
create policy "Public read access for intro attachments"
  on storage.objects
  for select
  using (bucket_id = 'intro-attachments');

-- Authenticated insert under own uid folder
drop policy if exists "Users can upload their own intro attachments" on storage.objects;
create policy "Users can upload their own intro attachments"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'intro-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated delete under own uid folder
drop policy if exists "Users can delete their own intro attachments" on storage.objects;
create policy "Users can delete their own intro attachments"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'intro-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
