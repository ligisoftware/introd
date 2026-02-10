-- Add avatar_url to founders (public URL from storage)
ALTER TABLE public.founders
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- Optional length constraint for URL storage
ALTER TABLE public.founders
  DROP CONSTRAINT IF EXISTS founders_avatar_url_max_length;
ALTER TABLE public.founders
  ADD CONSTRAINT founders_avatar_url_max_length CHECK (avatar_url IS NULL OR char_length(avatar_url) <= 2048);
