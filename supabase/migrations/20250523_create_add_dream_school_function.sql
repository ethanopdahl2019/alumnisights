
-- Create a function to add dream schools
CREATE OR REPLACE FUNCTION public.add_dream_school(p_profile_id UUID, p_school_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the dream school
  INSERT INTO public.applicant_dream_schools (profile_id, school_id)
  VALUES (p_profile_id, p_school_id)
  ON CONFLICT (profile_id, school_id) DO NOTHING;
END;
$$;
