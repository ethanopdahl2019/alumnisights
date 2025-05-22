
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the ProfileFormValues interface
export interface ProfileFormValues {
  universityId?: string;
  majorId?: string;
  bio?: string;
  rate15min?: number;
  rate30min?: number;
  rate60min?: number;
  activities?: string[];
  greekLife?: string;
}

export function useProfileSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (userId: string, imageFile: File): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      console.log("[useProfileSubmission] Uploading profile image to alumni-data bucket");
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;
      
      // Upload the image
      const { data, error } = await supabase.storage
        .from('alumni-data')
        .upload(filePath, imageFile, {
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('alumni-data')
        .getPublicUrl(data.path);
      
      console.log("[useProfileSubmission] Image uploaded successfully:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('[useProfileSubmission] Error uploading image:', error);
      toast("Failed to upload your profile image.");
      return null;
    }
  };

  const submitProfile = async (values: ProfileFormValues, user: any, imageFile: File | null) => {
    if (!user) {
      console.error("[useProfileSubmission] Cannot complete profile - no user found");
      toast("You need to be logged in to complete your profile.");
      navigate('/auth');
      return;
    }
    
    console.log("[useProfileSubmission] Starting profile submission:", values);
    setIsLoading(true);
    
    try {
      // Upload profile image if one is selected
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadProfileImage(user.id, imageFile);
      }
      
      // Get metadata from session user
      const metadata = user.user_metadata || {};
      
      // Store profile data
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim(),
          school_id: values.universityId,
          major_id: values.majorId,
          bio: values.bio,
          role: 'alumni',
          price_15_min: values.rate15min,
          price_30_min: values.rate30min,
          price_60_min: values.rate60min,
          image: imageUrl,
          visible: true
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      toast.success("Profile saved successfully!");
      return { success: true, data };
    } catch (error: any) {
      console.error('[useProfileSubmission] Error saving profile:', error);
      toast.error("Failed to save your profile: " + (error.message || "Please try again."));
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitProfile
  };
}
