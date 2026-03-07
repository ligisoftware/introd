-- Add username column to users table
alter table public.users add column username text;

-- Backfill existing users with random usernames (user_ + 8 random alphanumeric chars)
update public.users
set username = 'user_' || substr(md5(random()::text || id::text), 1, 8)
where username is null;

-- Now make it NOT NULL and UNIQUE
alter table public.users alter column username set not null;
alter table public.users add constraint users_username_unique unique (username);

-- Index for fast lookups by username
create index idx_users_username on public.users (username);
