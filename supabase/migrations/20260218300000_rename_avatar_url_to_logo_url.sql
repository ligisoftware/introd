-- Rename intros.avatar_url → logo_url (company logo, not user avatar)
ALTER TABLE public.intros RENAME COLUMN avatar_url TO logo_url;

-- Rename the check constraint to match
ALTER TABLE public.intros DROP CONSTRAINT IF EXISTS intros_avatar_url_length;
ALTER TABLE public.intros ADD CONSTRAINT intros_logo_url_length
  CHECK (logo_url IS NULL OR char_length(logo_url) <= 2048);
