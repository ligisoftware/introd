-- Add personal social links to user profiles
ALTER TABLE public.users
  ADD COLUMN linkedin_url text,
  ADD COLUMN twitter_url text;
