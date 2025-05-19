
-- Create function to get all admission stats
CREATE OR REPLACE FUNCTION public.get_admission_stats()
RETURNS SETOF public.universities_admission_stats
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.universities_admission_stats;
$$;

-- Create function to get admission stats for a specific university
CREATE OR REPLACE FUNCTION public.get_university_admission_stats(p_university_id TEXT)
RETURNS public.universities_admission_stats
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.universities_admission_stats
  WHERE university_id = p_university_id;
$$;

-- Create function to update admission stats
CREATE OR REPLACE FUNCTION public.update_admission_stats(
  p_university_id TEXT,
  p_acceptance_rate NUMERIC,
  p_average_sat NUMERIC,
  p_average_act NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.universities_admission_stats (
    university_id, 
    acceptance_rate, 
    average_sat, 
    average_act,
    updated_at
  ) 
  VALUES (
    p_university_id, 
    p_acceptance_rate, 
    p_average_sat, 
    p_average_act,
    now()
  )
  ON CONFLICT (university_id) 
  DO UPDATE SET 
    acceptance_rate = p_acceptance_rate,
    average_sat = p_average_sat,
    average_act = p_average_act,
    updated_at = now();
    
  RETURN TRUE;
END;
$$;
