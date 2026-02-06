-- Add profile columns to founders (all nullable for existing rows)
ALTER TABLE public.founders
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS startup_name text,
  ADD COLUMN IF NOT EXISTS startup_one_liner text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS twitter_url text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Optional: constrain bio length (500-1000 chars per plan; using 1000)
ALTER TABLE public.founders
  DROP CONSTRAINT IF EXISTS founders_bio_max_length;
ALTER TABLE public.founders
  ADD CONSTRAINT founders_bio_max_length CHECK (bio IS NULL OR char_length(bio) <= 1000);
