
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileFormValues } from '@/components/alumni/AlumniProfileForm';

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
      const schoolId = values.universityId;
      
      if (!schoolId) {
        throw new Error("School information not found. Please try again.");
      }
      
      // Check for existing profile
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, image')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      let profileId;
      
      if (existingProfile) {
        // Update existing profile
        console.log("[useProfileSubmission] Updating existing profile for user:", user.id);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            name: `${metadata.first_name} ${metadata.last_name}`,
            school_id: schoolId,
            major_id: values.majorId,
            bio: values.bio,
            image: imageUrl || existingProfile.image,
            role: 'alumni',
            price_15_min: values.rate15min,
            price_30_min: values.rate30min,
            price_60_min: values.rate60min,
            visible: true // Make sure profile is visible
          })
          .eq('id', existingProfile.id);
          
        if (updateError) throw updateError;
        
        profileId = existingProfile.id;
        
        // Delete existing activities
        const { error: deleteActivitiesError } = await supabase
          .from('profile_activities')
          .delete()
          .eq('profile_id', profileId);
          
        if (deleteActivitiesError) throw deleteActivitiesError;
        
        // Delete existing Greek life
        await supabase
          .from('profile_greek_life')
          .delete()
          .eq('profile_id', profileId);
      } else {
        // Create new profile
        console.log("[useProfileSubmission] Creating new profile for user:", user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: `${metadata.first_name} ${metadata.last_name}`,
            school_id: schoolId,
            major_id: values.majorId,
            bio: values.bio,
            image: imageUrl,
            role: 'alumni',
            price_15_min: values.rate15min,
            price_30_min: values.rate30min,
            price_60_min: values.rate60min,
            visible: true // Make sure profile is visible by default
          })
          .select('id')
          .single();
        
        if (profileError) throw profileError;
        
        profileId = profileData.id;
      }
      
      console.log("[useProfileSubmission] Profile created/updated successfully:", profileId);
      
      // Add activities to profile
      const activityInserts = values.activities.map(activityId => ({
        profile_id: profileId,
        activity_id: activityId,
      }));
      
      if (activityInserts.length > 0) {
        console.log("[useProfileSubmission] Adding activities to profile:", activityInserts.length);
        const { error: activitiesError } = await supabase
          .from('profile_activities')
          .insert(activityInserts);
        
        if (activitiesError) throw activitiesError;
      }
      
      // Add Greek life affiliation if selected
      if (values.greekLife && values.greekLife !== 'none') {
        console.log("[useProfileSubmission] Adding Greek life affiliation:", values.greekLife);
        try {
          const { error: greekLifeError } = await supabase
            .from('profile_greek_life')
            .insert({
              profile_id: profileId,
              greek_life_id: values.greekLife,
            });
          
          if (greekLifeError) throw greekLifeError;
        } catch (error) {
          console.error('[useProfileSubmission] Error adding Greek life affiliation:', error);
          // Continue even if Greek life association fails
        }
      }

      // Store restoration data
      try {
        const { error: restorationError } = await supabase
          .from('restoration_data')
          .insert({
            user_id: user.id,
            profile_id: profileId,
            restoration_type: 'profile_completion',
            restoration_details: {
              form_values: values,
              metadata: metadata,
              completion_date: new Date().toISOString()
            }
          });

        if (restorationError) {
          console.error('[useProfileSubmission] Error storing restoration data:', restorationError);
          // Continue even if storing restoration data fails
        }
      } catch (error) {
        console.error('[useProfileSubmission] Error in restoration data process:', error);
        // Continue even if storing restoration data fails
      }
      
      toast.success("Profile complete! Your alumni profile has been set up successfully.");
      
      // Redirect to alumni dashboard
      console.log("[useProfileSubmission] Redirecting to alumni dashboard");
      navigate('/alumni-dashboard');
      
      return { success: true, profileId };
    } catch (error: any) {
      console.error('[useProfileSubmission] Error completing profile:', error);
      toast.error("Failed to complete your profile: " + (error.message || "Please try again."));
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
