ALTER TABLE public.intros ADD COLUMN founded_date date;

ALTER TABLE public.intros ADD COLUMN funding_rounds jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.intros ADD CONSTRAINT funding_rounds_is_array
  CHECK (funding_rounds IS NULL OR jsonb_typeof(funding_rounds) = 'array');
