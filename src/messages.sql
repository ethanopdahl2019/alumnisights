
-- This SQL file should be executed to add attachment support to the messages table
-- Add attachment_url column to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Create a storage bucket for message attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'Message Attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload attachments" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'message-attachments');

-- Create storage policy to allow authenticated users to read attachments
CREATE POLICY "Allow authenticated users to read attachments" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'message-attachments');
