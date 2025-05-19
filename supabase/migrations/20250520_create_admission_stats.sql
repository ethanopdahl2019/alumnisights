
-- Create universities_admission_stats table
CREATE TABLE IF NOT EXISTS public.universities_admission_stats (
    university_id UUID PRIMARY KEY REFERENCES public.universities(id) ON DELETE CASCADE,
    acceptance_rate NUMERIC,
    average_sat NUMERIC,
    average_act NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add comment on table
COMMENT ON TABLE public.universities_admission_stats IS 'Stores admission statistics for universities.';

-- Create RLS policies
ALTER TABLE public.universities_admission_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read admission stats
CREATE POLICY "Allow anyone to read admission stats" 
  ON public.universities_admission_stats
  FOR SELECT 
  USING (true);

-- Create policy to allow admins to insert/update admission stats
CREATE POLICY "Allow admins to insert admission stats" 
  ON public.universities_admission_stats
  FOR INSERT 
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "Allow admins to update admission stats" 
  ON public.universities_admission_stats
  FOR UPDATE 
  USING ((SELECT is_admin()));

-- Create trigger to update the updated_at field
CREATE TRIGGER update_universities_admission_stats_updated_at
  BEFORE UPDATE ON public.universities_admission_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
