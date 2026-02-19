-- Rename bio column to intro_text in intros table
alter table public.intros rename column bio to intro_text;

-- Update the check constraint
alter table public.intros drop constraint if exists intros_bio_length;
alter table public.intros add constraint intros_intro_text_length
  check (intro_text is null or char_length(intro_text) <= 1000);
