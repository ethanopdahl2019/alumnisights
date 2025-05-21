
-- Create a table to store applicant dream schools
CREATE TABLE IF NOT EXISTS public.applicant_dream_schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Each profile can only have a school once in their dream schools
  CONSTRAINT applicant_dream_schools_profile_school_unique UNIQUE (profile_id, school_id)
);

-- Add RLS policies
ALTER TABLE public.applicant_dream_schools ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own dream schools
CREATE POLICY "Users can view their own dream schools" 
  ON public.applicant_dream_schools 
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

-- Allow users to insert their own dream schools
CREATE POLICY "Users can insert their own dream schools" 
  ON public.applicant_dream_schools 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

-- Allow users to delete their own dream schools
CREATE POLICY "Users can delete their own dream schools" 
  ON public.applicant_dream_schools 
  FOR DELETE 
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );
