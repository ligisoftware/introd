-- Migration: Split founders table into users + intros
-- 1. Rename founders → users
-- 2. Create intros table
-- 3. Migrate intro data from users into intros
-- 4. Drop intro-specific columns from users
-- 5. Create intro-avatars storage bucket
-- 6. Update RLS policies

-- =============================================================================
-- Step 1: Rename founders table → users
-- =============================================================================

-- Drop existing RLS policies that reference "founders"
drop policy if exists "Users can view their own founder row" on public.founders;
drop policy if exists "Users can insert their own founder row" on public.founders;
drop policy if exists "Users can update their own founder row" on public.founders;
drop policy if exists "Users can delete their own founder row" on public.founders;

alter table public.founders rename to users;

-- Rename indexes
alter index idx_founders_auth_user_id rename to idx_users_auth_user_id;
alter index idx_founders_share_slug rename to idx_users_share_slug;

-- Re-create RLS policies on users table
create policy "Users can view their own row"
  on public.users for select
  using (auth.uid() = auth_user_id);

create policy "Users can insert their own row"
  on public.users for insert
  with check (auth.uid() = auth_user_id);

create policy "Users can update their own row"
  on public.users for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

create policy "Users can delete their own row"
  on public.users for delete
  using (auth.uid() = auth_user_id);

-- =============================================================================
-- Step 2: Create intros table
-- =============================================================================

create table public.intros (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  share_slug    text unique,
  startup_name  text,
  startup_one_liner text,
  role          text,
  bio           text,
  website_url   text,
  linkedin_url  text,
  twitter_url   text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz,

  constraint intros_bio_length check (bio is null or char_length(bio) <= 1000),
  constraint intros_avatar_url_length check (avatar_url is null or char_length(avatar_url) <= 2048),
  constraint intros_startup_one_liner_length check (startup_one_liner is null or char_length(startup_one_liner) <= 300)
);

create index idx_intros_user_id on public.intros(user_id);
create index idx_intros_share_slug on public.intros(share_slug) where share_slug is not null;

-- Enable RLS on intros
alter table public.intros enable row level security;

-- Intros RLS: users can CRUD their own intros
create policy "Users can view their own intros"
  on public.intros for select
  using (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy "Users can insert their own intros"
  on public.intros for insert
  with check (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy "Users can update their own intros"
  on public.intros for update
  using (user_id in (select id from public.users where auth_user_id = auth.uid()))
  with check (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy "Users can delete their own intros"
  on public.intros for delete
  using (user_id in (select id from public.users where auth_user_id = auth.uid()));

-- =============================================================================
-- Step 3: Migrate intro data from users rows into intros rows
-- =============================================================================

insert into public.intros (user_id, share_slug, startup_name, startup_one_liner, role, bio, website_url, linkedin_url, twitter_url, avatar_url, created_at, updated_at)
select
  id,
  share_slug,
  startup_name,
  startup_one_liner,
  role,
  bio,
  website_url,
  linkedin_url,
  twitter_url,
  avatar_url,
  created_at,
  updated_at
from public.users
where startup_name is not null
   or startup_one_liner is not null
   or role is not null
   or bio is not null
   or website_url is not null
   or linkedin_url is not null
   or twitter_url is not null
   or share_slug is not null
   or avatar_url is not null;

-- =============================================================================
-- Step 4: Drop intro-specific columns from users table
-- =============================================================================

alter table public.users drop column if exists share_slug;
alter table public.users drop column if exists startup_name;
alter table public.users drop column if exists startup_one_liner;
alter table public.users drop column if exists role;
alter table public.users drop column if exists bio;
alter table public.users drop column if exists website_url;
alter table public.users drop column if exists linkedin_url;
alter table public.users drop column if exists twitter_url;

-- Keep: id, auth_user_id, email, display_name, avatar_url, created_at, updated_at

-- =============================================================================
-- Step 5: Create intro-avatars storage bucket
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('intro-avatars', 'intro-avatars', true)
on conflict (id) do update
  set name = excluded.name,
      public = excluded.public;

-- RLS policies for intro-avatars bucket
create policy "Public read access for intro avatars"
  on storage.objects
  for select
  using (bucket_id = 'intro-avatars');

create policy "Users can upload their own intro avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'intro-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own intro avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'intro-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'intro-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own intro avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'intro-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
