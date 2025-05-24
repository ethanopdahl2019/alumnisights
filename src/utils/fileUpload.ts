
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UploadOptions {
  file: File;
  prefix: string;
  resourceId: string;
}

/**
 * Uploads a file to Supabase storage with organized folder structure
 * @param options Object containing file, prefix (type of image), and resourceId (university ID)
 * @returns The public URL of the uploaded file or null if upload fails
 */
export async function uploadFileToStorage({ 
  file, 
  prefix, 
  resourceId 
}: UploadOptions): Promise<string | null> {
  if (!file) {
    return null;
  }

  try {
    console.log(`Starting ${prefix} upload for resource ${resourceId}...`);
    
    // Create a standardized filename format: resource-id-type-timestamp.extension
    const fileExt = file.name.split('.').pop();
    const sanitizedResourceId = resourceId ? resourceId.replace(/[^a-zA-Z0-9-]/g, '_') : 'new';
    const fileName = `${sanitizedResourceId}-${prefix}-${Date.now()}.${fileExt}`;
    const filePath = `universities/${sanitizedResourceId}/${prefix}/${fileName}`;

    console.log("Uploading to path:", filePath);

    // Verify the bucket exists before attempting upload
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error("Error checking storage buckets:", bucketError);
      toast.error("Failed to access storage system");
      return null;
    }
    
    const bucket = buckets?.find(b => b.name === 'university-content');
    
    if (!bucket) {
      console.error("Storage bucket 'university-content' does not exist");
      toast.error("Storage infrastructure not set up correctly. Please contact administrator.");
      return null;
    }

    // Upload the file to the university-content bucket
    const { error: uploadError, data } = await supabase.storage
      .from('university-content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    console.log("Upload successful:", data);
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('university-content')
      .getPublicUrl(filePath);
    
    console.log("Public URL generated:", urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error: any) {
    console.error(`Error uploading ${prefix}:`, error);
    let message = `Failed to upload ${prefix}`;
    
    if (error.message) {
      message += ": " + error.message;
    }
    
    toast.error(message);
    return null;
  }
}

/**
 * Simple file upload function for profile images
 */
export async function uploadFile(file: File, bucket: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${bucket}/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('university-content')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from('university-content')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
