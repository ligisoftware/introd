-- Add bio and experience columns to users table
alter table public.users add column bio text;
alter table public.users add column experience jsonb;

-- Constraints
alter table public.users add constraint users_bio_length
  check (bio is null or char_length(bio) <= 500);
