
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ChevronsUpDown, Upload } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMajors, getActivities, getGreekLifeOptions } from '@/services/profiles';
import { getUniversities } from '@/services/universities';
import SearchInput from '@/components/SearchInput';

// Modified schema to make fields optional
const profileSchema = z.object({
  bio: z.string().optional(),
  universityId: z.string().optional(),
  degree: z.string().optional(),
  majorId: z.string().optional(),
  activities: z.array(z.string()).optional(),
  greekLife: z.string().optional(),
  image: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileComplete = () => {
  console.log("[ProfileComplete] Component rendering");
  const navigate = useNavigate();
  const { user, session } = useAuth();
  
  console.log("[ProfileComplete] Auth state:", { 
    userExists: !!user, 
    userEmail: user?.email, 
    sessionExists: !!session,
    userMetadata: user?.user_metadata 
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [greekLifeOptions, setGreekLifeOptions] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [universities, setUniversities] = useState<any[]>([]);
  const [universitySearchTerm, setUniversitySearchTerm] = useState("");
  const [majorSearchTerm, setMajorSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  
  const degrees = [
    { id: "bachelors", name: "Bachelor's Degree" },
    { id: "masters", name: "Master's Degree" },
    { id: "phd", name: "PhD" },
    { id: "associates", name: "Associate's Degree" },
    { id: "other", name: "Other" }
  ];
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      universityId: "",
      degree: "",
      majorId: "",
      activities: [],
      greekLife: "",
    },
    mode: "onChange",
  });
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[ProfileComplete] Image selected:", file.name);
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
    // Calculate form completion progress based on fields that have been filled
    const calculateProgress = () => {
      let completedSteps = 0;
      let totalSteps = 0;
      
      if (watchedValues.bio) {
        completedSteps++;
      }
      totalSteps++;
      
      if (watchedValues.universityId) {
        completedSteps++;
      }
      totalSteps++;
      
      if (watchedValues.degree) {
        completedSteps++;
      }
      totalSteps++;
      
      if (watchedValues.majorId) {
        completedSteps++;
      }
      totalSteps++;
      
      if (watchedValues.activities && watchedValues.activities.length > 0) {
        completedSteps++;
      }
      totalSteps++;
      
      if (imagePreview) {
        completedSteps++;
      }
      totalSteps++;
      
      const progressValue = (completedSteps / totalSteps) * 100;
      setProgress(progressValue);
    };
    
    calculateProgress();
  }, [watchedValues, imagePreview]);
  
  // Redirect if not logged in
  useEffect(() => {
    console.log("[ProfileComplete] Auth check running");
    if (!user && !session) {
      console.log("[ProfileComplete] No user or session found, redirecting to auth page");
      navigate('/auth');
      return;
    } else {
      console.log("[ProfileComplete] User is authenticated:", user?.email);
    }
    
    // Check if user already has a profile
    const checkExistingProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (data) {
            setExistingProfile(data);
            
            // Populate form with existing data
            form.setValue('bio', data.bio || '');
            form.setValue('universityId', data.school_id || '');
            form.setValue('degree', data.degree || '');
            form.setValue('majorId', data.major_id || '');
            
            if (data.image) {
              setImagePreview(data.image);
            }
            
            // Fetch activities for this profile
            const { data: activitiesData } = await supabase
              .from('profile_activities')
              .select('activity_id')
              .eq('profile_id', data.id);
              
            if (activitiesData) {
              form.setValue('activities', activitiesData.map(item => item.activity_id));
            }
            
            // Fetch greek life for this profile
            const { data: greekLifeData } = await supabase
              .from('profile_greek_life')
              .select('greek_life_id')
              .eq('profile_id', data.id)
              .maybeSingle();
              
            if (greekLifeData) {
              form.setValue('greekLife', greekLifeData.greek_life_id);
            }
            
            // Set university search term
            if (data.school_id) {
              const { data: schoolData } = await supabase
                .from('schools')
                .select('name')
                .eq('id', data.school_id)
                .maybeSingle();
                
              if (schoolData) {
                setUniversitySearchTerm(schoolData.name);
              }
            }
            
            // Set major search term
            if (data.major_id) {
              const { data: majorData } = await supabase
                .from('majors')
                .select('name')
                .eq('id', data.major_id)
                .maybeSingle();
                
              if (majorData) {
                setMajorSearchTerm(majorData.name);
              }
            }
          }
        } catch (err) {
          console.error("[ProfileComplete] Error checking for existing profile:", err);
        }
      }
    };
    
    // Load universities from the services
    const loadUniversities = async () => {
      console.log("[ProfileComplete] Loading universities");
      try {
        const universitiesData = await getUniversities();
        setUniversities(universitiesData);
        console.log("[ProfileComplete] Universities loaded:", universitiesData.length);
      } catch (error) {
        console.error('[ProfileComplete] Error loading universities:', error);
      }
    };
    
    // Load majors, activities, and Greek Life options
    const loadFormData = async () => {
      console.log("[ProfileComplete] Loading form data (majors, activities, etc.)");
      try {
        const [majorsData, activitiesData, greekLifeData] = await Promise.all([
          getMajors(),
          getActivities(),
          getGreekLifeOptions ? getGreekLifeOptions() : [] // Use if available, otherwise empty array
        ]);
        
        console.log("[ProfileComplete] Data loaded:", { 
          majorsCount: majorsData.length, 
          activitiesCount: activitiesData.length,
          greekLifeCount: greekLifeData?.length || 0
        });
        
        setMajors(majorsData);
        setActivities(activitiesData);
        setGreekLifeOptions(greekLifeData || []);
        
        await loadUniversities();
        await checkExistingProfile();
      } catch (error) {
        console.error('[ProfileComplete] Error loading form data:', error);
        toast("Failed to load profile data. Please try again later.");
      }
    };
    
    loadFormData();
  }, [session, navigate, user, form]);

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!imageFile && imagePreview && existingProfile?.image) {
      return existingProfile.image;
    }
    
    if (!imageFile) return null;
    
    try {
      console.log("[ProfileComplete] Uploading profile image");
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;
      
      // Upload the image
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, imageFile, {
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(data.path);
      
      console.log("[ProfileComplete] Image uploaded successfully:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('[ProfileComplete] Error uploading image:', error);
      toast("Failed to upload your profile image.");
      return null;
    }
  };
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      console.error("[ProfileComplete] Cannot complete profile - no user found");
      toast("You need to be logged in to complete your profile.");
      navigate('/auth');
      return;
    }
    
    console.log("[ProfileComplete] Starting profile submission:", values);
    setIsLoading(true);
    try {
      // Upload profile image if one is selected
      let imageUrl = null;
      if (imageFile || existingProfile?.image) {
        imageUrl = await uploadProfileImage(user.id);
      }
      
      // Get school_id from selected university
      const schoolId = values.universityId || undefined;
      const majorId = values.majorId || undefined;
      
      // Create or update profile
      const metadata = user.user_metadata || {};
      const name = `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim();
      
      if (existingProfile) {
        // Update existing profile
        console.log("[ProfileComplete] Updating profile for user:", user.id);
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: name || existingProfile.name,
            school_id: schoolId,
            major_id: majorId,
            bio: values.bio || existingProfile.bio,
            image: imageUrl || existingProfile.image,
            role: 'alumni' // Make sure role is set to alumni for browse section visibility
          })
          .eq('id', existingProfile.id);
          
        if (profileError) throw profileError;
        
        // If activities were selected, update them
        if (values.activities && values.activities.length > 0) {
          // First delete existing activities
          await supabase
            .from('profile_activities')
            .delete()
            .eq('profile_id', existingProfile.id);
            
          // Then add new activities
          const activityInserts = values.activities.map(activityId => ({
            profile_id: existingProfile.id,
            activity_id: activityId,
          }));
          
          if (activityInserts.length > 0) {
            const { error: activitiesError } = await supabase
              .from('profile_activities')
              .insert(activityInserts);
              
            if (activitiesError) throw activitiesError;
          }
        }
        
        // Update Greek life if selected
        if (values.greekLife && values.greekLife !== 'none') {
          // First delete existing greek life
          await supabase
            .from('profile_greek_life')
            .delete()
            .eq('profile_id', existingProfile.id);
            
          // Then add new greek life
          await supabase
            .from('profile_greek_life')
            .insert({
              profile_id: existingProfile.id,
              greek_life_id: values.greekLife,
            });
        }
        
        toast("Profile updated successfully!");
      } else {
        // Create new profile
        console.log("[ProfileComplete] Creating profile for user:", user.id);
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: name || user.email?.split('@')[0] || 'User',
            school_id: schoolId,
            major_id: majorId,
            bio: values.bio,
            image: imageUrl,
            role: 'alumni' // Make sure role is set to alumni for browse section visibility
          })
          .select('id')
          .single();
        
        if (profileError) throw profileError;
        
        console.log("[ProfileComplete] Profile created successfully:", newProfile);
        
        // Add activities to profile if selected
        if (values.activities && values.activities.length > 0) {
          const activityInserts = values.activities.map(activityId => ({
            profile_id: newProfile.id,
            activity_id: activityId,
          }));
          
          if (activityInserts.length > 0) {
            console.log("[ProfileComplete] Adding activities to profile:", activityInserts.length);
            const { error: activitiesError } = await supabase
              .from('profile_activities')
              .insert(activityInserts);
            
            if (activitiesError) throw activitiesError;
          }
        }
        
        // Add Greek life affiliation if selected
        if (values.greekLife && values.greekLife !== 'none') {
          console.log("[ProfileComplete] Adding Greek life affiliation:", values.greekLife);
          try {
            const { error: greekLifeError } = await supabase
              .from('profile_greek_life')
              .insert({
                profile_id: newProfile.id,
                greek_life_id: values.greekLife,
              });
            
            if (greekLifeError) throw greekLifeError;
          } catch (error) {
            console.error('[ProfileComplete] Error adding Greek life affiliation:', error);
            // Continue even if Greek life association fails
          }
        }
        
        toast("Profile complete! Your profile has been set up successfully.");
      }
      
      // Redirect to profile page or appropriate dashboard
      console.log("[ProfileComplete] Redirecting to alumni dashboard");
      navigate('/mentor-dashboard');
    } catch (error: any) {
      console.error('[ProfileComplete] Error completing profile:', error);
      toast("Failed to complete your profile: " + (error.message || "Please try again."));
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">
              Help others find you by completing your profile information
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
                This information will be displayed on your public profile. Fill in as many fields as you'd like.
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
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <textarea 
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell others about yourself, your experiences, and what you can offer..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="universityId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>University</FormLabel>
                        <FormControl>
                          <SearchInput
                            value={universitySearchTerm}
                            onChange={setUniversitySearchTerm}
                            placeholder="Type to search universities..."
                            options={universities.map(uni => ({
                              id: uni.id,
                              name: uni.name
                            }))}
                            onOptionSelect={(university) => {
                              form.setValue("universityId", university.id);
                              setUniversitySearchTerm(university.name);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your degree" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {degrees.map((degree) => (
                              <SelectItem key={degree.id} value={degree.id}>
                                {degree.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="majorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Major</FormLabel>
                        <FormControl>
                          <SearchInput
                            value={majorSearchTerm}
                            onChange={setMajorSearchTerm}
                            placeholder="Type to search majors..."
                            options={filteredMajors.map(major => ({
                              id: major.id,
                              name: major.name
                            }))}
                            onOptionSelect={(major) => {
                              form.setValue("majorId", major.id);
                              setMajorSearchTerm(major.name);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="greekLife"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Greek Life</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Greek organization (if any)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectLabel>Fraternities</SelectLabel>
                            {greekLifeOptions
                              .filter(org => org.type === 'fraternity')
                              .map(org => (
                                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                              ))
                            }
                            <SelectLabel>Sororities</SelectLabel>
                            {greekLifeOptions
                              .filter(org => org.type === 'sorority')
                              .map(org => (
                                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="activities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Activities</FormLabel>
                          <p className="text-sm text-gray-500">
                            Select the activities you're involved in
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {activities.map((activity) => (
                            <FormField
                              key={activity.id}
                              control={form.control}
                              name="activities"
                              render={({ field }) => (
                                <FormItem
                                  key={activity.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(activity.id)}
                                      onCheckedChange={(checked) => {
                                        const currentActivities = field.value || [];
                                        return checked
                                          ? field.onChange([...currentActivities, activity.id])
                                          : field.onChange(
                                              currentActivities.filter(
                                                (value) => value !== activity.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {activity.name}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
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
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : existingProfile ? "Update Profile" : "Complete Profile"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileComplete;
