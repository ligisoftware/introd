-- Change summary column from text to jsonb (string array of bullet points).
alter table intro_scores
  alter column summary type jsonb using to_jsonb(summary);
