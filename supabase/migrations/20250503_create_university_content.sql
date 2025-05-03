
-- Create universities_content table
CREATE TABLE IF NOT EXISTS public.universities_content (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  overview TEXT,
  admission_stats TEXT,
  application_requirements TEXT,
  alumni_insights TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.universities_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read university content
CREATE POLICY "Allow anyone to read university content"
ON public.universities_content
FOR SELECT
USING (true);

-- Only allow users with admin role to insert/update
CREATE POLICY "Allow admins to insert university content"
ON public.universities_content
FOR INSERT
WITH CHECK ((SELECT role FROM auth.users WHERE id = auth.uid())::text = 'admin');

CREATE POLICY "Allow admins to update university content"
ON public.universities_content
FOR UPDATE
USING ((SELECT role FROM auth.users WHERE id = auth.uid())::text = 'admin');

-- Create a storage bucket for university images
INSERT INTO storage.buckets (id, name, public)
VALUES ('university-content', 'university-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for public read access
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'university-content');

-- Storage policy for admin uploads
CREATE POLICY "Admin Upload Access"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'university-content' 
  AND ((SELECT role FROM auth.users WHERE id = auth.uid())::text = 'admin')
);

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
