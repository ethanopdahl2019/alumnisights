
-- Create a storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'Profile Images', true);

-- Create policy to allow authenticated users to upload their own profile images
CREATE POLICY "Allow users to upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to update their own profile images
CREATE POLICY "Allow users to update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to delete their own profile images
CREATE POLICY "Allow users to delete their own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to select their own profile images
CREATE POLICY "Allow users to select their own profile images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow public access to read profile images
CREATE POLICY "Allow public to read all profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');
