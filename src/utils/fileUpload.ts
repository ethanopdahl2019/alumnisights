
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UploadOptions {
  file: File;
  prefix: string;
  resourceId: string;
}

/**
 * Uploads a file to Supabase storage with organized folder structure
 * @param options Object containing file, prefix (type of image), and resourceId (user ID or university ID)
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
    
    // Determine bucket and path based on prefix
    let bucketName = 'university-content';
    let filePath = `universities/${sanitizedResourceId}/${prefix}/${fileName}`;
    
    if (prefix === 'profile') {
      bucketName = 'profile-photos';
      filePath = `${sanitizedResourceId}/${fileName}`;
    }

    console.log("Uploading to bucket:", bucketName, "path:", filePath);

    // Verify the bucket exists before attempting upload
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error("Error checking storage buckets:", bucketError);
      toast.error("Failed to access storage system");
      return null;
    }
    
    const bucket = buckets?.find(b => b.name === bucketName);
    
    if (!bucket) {
      console.error(`Storage bucket '${bucketName}' does not exist`);
      toast.error("Storage infrastructure not set up correctly. Please contact administrator.");
      return null;
    }

    // Upload the file to the appropriate bucket
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
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
      .from(bucketName)
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
