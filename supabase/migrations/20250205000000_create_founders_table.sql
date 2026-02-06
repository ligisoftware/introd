-- Create founders table
CREATE TABLE IF NOT EXISTS public.founders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index on auth_user_id for efficient lookups
CREATE INDEX IF NOT EXISTS idx_founders_auth_user_id ON public.founders(auth_user_id);

-- Enable Row Level Security
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- SELECT: Founders can only see their own row
CREATE POLICY "Founders can view own row"
  ON public.founders
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- INSERT: Founders can only create their own row
CREATE POLICY "Founders can insert own row"
  ON public.founders
  FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- UPDATE: Founders can only update their own row
CREATE POLICY "Founders can update own row"
  ON public.founders
  FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- DELETE: Founders can only delete their own row
CREATE POLICY "Founders can delete own row"
  ON public.founders
  FOR DELETE
  USING (auth.uid() = auth_user_id);
