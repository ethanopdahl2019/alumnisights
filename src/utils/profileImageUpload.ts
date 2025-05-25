
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProfileImageUploadOptions {
  file: File;
  userId: string;
}

/**
 * Uploads a profile image to Supabase storage
 * @param options Object containing file and userId
 * @returns The public URL of the uploaded file or null if upload fails
 */
export async function uploadProfileImage({ 
  file, 
  userId 
}: ProfileImageUploadOptions): Promise<string | null> {
  if (!file) {
    return null;
  }

  try {
    console.log(`Starting profile image upload for user ${userId}...`);
    
    // Create a standardized filename format: user-id-profile-timestamp.extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;

    console.log("Uploading to path:", fileName);

    // Upload the file to the profile-photos bucket
    const { error: uploadError, data } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
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
      .from('profile-photos')
      .getPublicUrl(fileName);
    
    console.log("Public URL generated:", urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error: any) {
    console.error(`Error uploading profile image:`, error);
    let message = `Failed to upload profile image`;
    
    if (error.message) {
      message += ": " + error.message;
    }
    
    toast({
      title: "Upload failed",
      description: message,
      variant: "destructive"
    });
    return null;
  }
}
