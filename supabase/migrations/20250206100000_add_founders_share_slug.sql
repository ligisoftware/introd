-- Add share_slug for unlisted shareable links (unguessable, unique)
ALTER TABLE public.founders
  ADD COLUMN IF NOT EXISTS share_slug text UNIQUE;

CREATE INDEX IF NOT EXISTS idx_founders_share_slug ON public.founders(share_slug)
  WHERE share_slug IS NOT NULL;
