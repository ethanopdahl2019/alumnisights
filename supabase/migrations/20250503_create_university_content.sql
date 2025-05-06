
-- Create universities_content table
CREATE TABLE IF NOT EXISTS public.universities_content (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  overview TEXT,
  admission_stats TEXT,
  application_requirements TEXT,
  alumni_insights TEXT,
  image TEXT,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Disable RLS to allow anyone to read/write university content
ALTER TABLE public.universities_content DISABLE ROW LEVEL SECURITY;

-- Create a storage bucket for university images
INSERT INTO storage.buckets (id, name, public)
VALUES ('university-content', 'university-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for public read access
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'university-content');

-- Storage policy for public upload access (no authentication required)
CREATE POLICY "Public Upload Access"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'university-content');

-- Create trigger function for updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_universities_content_updated_at
BEFORE UPDATE ON public.universities_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
