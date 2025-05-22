
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import ProfileBioSection from '@/components/alumni/ProfileBioSection';
import ProfileUniversitySection from '@/components/alumni/ProfileUniversitySection';
import ProfileRatesSection from '@/components/alumni/ProfileRatesSection';
import ProfileActivitiesSection from '@/components/alumni/ProfileActivitiesSection';
import { useAuth } from '@/components/AuthProvider';
import { getMajors, getActivities, getGreekLifeOptions } from '@/services/profiles';

const profileSchema = z.object({
  bio: z.string().min(20, { message: "Bio should be at least 20 characters" }),
  universityId: z.string().min(1, { message: "Please select your university" }),
  degree: z.string().min(1, { message: "Please select your degree" }),
  majorId: z.string().min(1, { message: "Please select your major" }),
  activities: z.array(z.string()).min(1, { message: "Please select at least one activity" }),
  greekLife: z.string().optional(),
  rate15min: z.string().min(1, { message: "Please enter your rate for 15 minute sessions" }).transform(Number),
  rate30min: z.string().min(1, { message: "Please enter your rate for 30 minute sessions" }).transform(Number),
  rate60min: z.string().min(1, { message: "Please enter your rate for 60 minute sessions" }).transform(Number),
  image: z.any().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface AlumniProfileFormProps {
  user: any;
  session: any;
}

const AlumniProfileForm: React.FC<AlumniProfileFormProps> = ({ user, session }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [greekLifeOptions, setGreekLifeOptions] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [majorSearchTerm, setMajorSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      universityId: "",
      degree: "",
      majorId: "",
      activities: [],
      greekLife: "",
      rate15min: "" as unknown as number,
      rate30min: "" as unknown as number,
      rate60min: "" as unknown as number,
    },
    mode: "onChange",
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[AlumniProfileForm] Image selected:", file.name);
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Watch form values to update progress
  const watchedValues = form.watch();

  useEffect(() => {
    // Calculate form completion progress
    let completedSteps = 0;
    if (watchedValues.bio.length >= 20) completedSteps++;
    if (watchedValues.universityId) completedSteps++;
    if (watchedValues.degree) completedSteps++;
    if (watchedValues.majorId) completedSteps++;
    if (watchedValues.activities.length > 0) completedSteps++;
    if (imagePreview) completedSteps++;
    if (watchedValues.rate15min) completedSteps++;
    if (watchedValues.rate30min) completedSteps++;
    if (watchedValues.rate60min) completedSteps++;
    
    // Calculate progress based on total possible steps
    const progressValue = (completedSteps / 9) * 100;
    setProgress(progressValue);
    console.log("[AlumniProfileForm] Form progress:", progressValue);
  }, [watchedValues, imagePreview]);

  useEffect(() => {
    // Load majors, activities, and Greek Life options
    const loadFormData = async () => {
      console.log("[AlumniProfileForm] Loading form data (majors, activities, etc.)");
      try {
        const [majorsData, activitiesData, greekLifeData] = await Promise.all([
          getMajors(),
          getActivities(),
          getGreekLifeOptions ? getGreekLifeOptions() : []
        ]);
        
        console.log("[AlumniProfileForm] Data loaded:", { 
          majorsCount: majorsData.length, 
          activitiesCount: activitiesData.length,
          greekLifeCount: greekLifeData?.length || 0
        });
        
        setMajors(majorsData);
        setActivities(activitiesData);
        setGreekLifeOptions(greekLifeData || []);
      } catch (error) {
        console.error('[AlumniProfileForm] Error loading form data:', error);
        toast("Failed to load profile data. Please try again later.");
      }
    };
    
    loadFormData();
  }, []);

  // Check for existing profile
  useEffect(() => {
    const checkForExistingProfile = async () => {
      if (!user) return;
      
      try {
        const { data: existingProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        // If existing profile found, redirect to dashboard
        if (existingProfile) {
          console.log("[AlumniProfileForm] Existing profile found, redirecting to dashboard");
          toast.info("Your profile is already set up!");
          navigate('/alumni-dashboard');
        }
      } catch (error) {
        console.error('[AlumniProfileForm] Error checking for existing profile:', error);
      }
    };
    
    checkForExistingProfile();
  }, [user, navigate]);

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      console.log("[AlumniProfileForm] Uploading profile image to alumni-data bucket");
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
      
      console.log("[AlumniProfileForm] Image uploaded successfully:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('[AlumniProfileForm] Error uploading image:', error);
      toast("Failed to upload your profile image.");
      return null;
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      console.error("[AlumniProfileForm] Cannot complete profile - no user found");
      toast("You need to be logged in to complete your profile.");
      navigate('/auth');
      return;
    }
    
    console.log("[AlumniProfileForm] Starting profile submission:", values);
    setIsLoading(true);
    try {
      // Upload profile image if one is selected
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadProfileImage(user.id);
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
        console.log("[AlumniProfileForm] Updating existing profile for user:", user.id);
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
        console.log("[AlumniProfileForm] Creating new profile for user:", user.id);
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
      
      console.log("[AlumniProfileForm] Profile created/updated successfully:", profileId);
      
      // Add activities to profile
      const activityInserts = values.activities.map(activityId => ({
        profile_id: profileId,
        activity_id: activityId,
      }));
      
      if (activityInserts.length > 0) {
        console.log("[AlumniProfileForm] Adding activities to profile:", activityInserts.length);
        const { error: activitiesError } = await supabase
          .from('profile_activities')
          .insert(activityInserts);
        
        if (activitiesError) throw activitiesError;
      }
      
      // Add Greek life affiliation if selected
      if (values.greekLife && values.greekLife !== 'none') {
        console.log("[AlumniProfileForm] Adding Greek life affiliation:", values.greekLife);
        try {
          const { error: greekLifeError } = await supabase
            .from('profile_greek_life')
            .insert({
              profile_id: profileId,
              greek_life_id: values.greekLife,
            });
          
          if (greekLifeError) throw greekLifeError;
        } catch (error) {
          console.error('[AlumniProfileForm] Error adding Greek life affiliation:', error);
          // Continue even if Greek life association fails
        }
      }
      
      toast.success("Profile complete! Your alumni profile has been set up successfully.");
      
      // Redirect to alumni dashboard
      console.log("[AlumniProfileForm] Redirecting to alumni dashboard");
      navigate('/alumni-dashboard');
    } catch (error: any) {
      console.error('[AlumniProfileForm] Error completing profile:', error);
      toast.error("Failed to complete your profile: " + (error.message || "Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  // Filter majors based on search
  const filteredMajors = majorSearchTerm 
    ? majors.filter(major => 
        major.name.toLowerCase().includes(majorSearchTerm.toLowerCase())
      ).slice(0, 10) 
    : majors.slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Alumni Profile</h1>
        <p className="text-gray-600">
          Help students find you by completing your alumni information
        </p>
        
        <div className="mt-6">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-sm text-gray-500 mt-2">
            Profile completion: {Math.round(progress)}%
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>
            This information will be displayed on your public alumni profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative cursor-pointer">
                  <Avatar className="w-24 h-24">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} alt="Profile preview" />
                    ) : (
                      <AvatarFallback className="bg-muted flex items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Click to upload your profile picture</p>
              </div>
              
              <ProfileBioSection control={form.control} />
              
              <ProfileUniversitySection 
                control={form.control}
                isLoading={isLoading}
              />
              
              <ProfileRatesSection control={form.control} />
              
              <ProfileActivitiesSection 
                control={form.control}
                activities={activities}
                greekLifeOptions={greekLifeOptions}
                filteredMajors={filteredMajors}
                setMajorSearchTerm={setMajorSearchTerm}
                majorSearchTerm={majorSearchTerm}
              />
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                >
                  Skip for now
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || progress < 100}
                  className={progress < 100 ? "opacity-70" : ""}
                >
                  {isLoading ? "Saving..." : "Complete Alumni Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniProfileForm;
