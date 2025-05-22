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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMajors, getActivities, getGreekLifeOptions } from '@/services/profiles';
import { getUniversitiesByLetter } from '@/pages/insights/universities/universities-data';
import SearchInput from '@/components/SearchInput';

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

type ProfileFormValues = z.infer<typeof profileSchema>;

const AlumniProfileComplete = () => {
  console.log("[AlumniProfileComplete] Component rendering");
  const navigate = useNavigate();
  const { user, session } = useAuth();
  
  console.log("[AlumniProfileComplete] Auth state:", { 
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
  const [flattenedUniversities, setFlattenedUniversities] = useState<{id: string, name: string}[]>([]);
  
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
      console.log("[AlumniProfileComplete] Image selected:", file.name);
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
    console.log("[AlumniProfileComplete] Form progress:", progressValue);
  }, [watchedValues, imagePreview]);
  
  // Redirect if not logged in
  useEffect(() => {
    console.log("[AlumniProfileComplete] Auth check running");
    if (!user && !session) {
      console.log("[AlumniProfileComplete] No user or session found, redirecting to auth page");
      navigate('/auth');
      return;
    } else {
      console.log("[AlumniProfileComplete] User is authenticated:", user?.email);
      // Check if the user is an alumni
      if (user?.user_metadata?.role !== 'alumni') {
        console.log("[AlumniProfileComplete] User is not an alumni, redirecting to appropriate dashboard");
        navigate('/');
        return;
      }
    }
    
    // Load universities from the insights page data
    const loadUniversities = () => {
      console.log("[AlumniProfileComplete] Loading universities");
      const universitiesByLetter = getUniversitiesByLetter();
      const allUniversities: {id: string, name: string}[] = [];
      
      // Flatten the university list from all letters
      Object.values(universitiesByLetter).forEach(universities => {
        universities.forEach(university => {
          allUniversities.push({
            id: university.id,
            name: university.name
          });
        });
      });
      
      // Sort universities by name
      allUniversities.sort((a, b) => a.name.localeCompare(b.name));
      setFlattenedUniversities(allUniversities);
      console.log("[AlumniProfileComplete] Universities loaded:", allUniversities.length);
    };
    
    // Load majors, activities, and Greek Life options
    const loadFormData = async () => {
      console.log("[AlumniProfileComplete] Loading form data (majors, activities, etc.)");
      try {
        const [majorsData, activitiesData, greekLifeData] = await Promise.all([
          getMajors(),
          getActivities(),
          getGreekLifeOptions ? getGreekLifeOptions() : []
        ]);
        
        console.log("[AlumniProfileComplete] Data loaded:", { 
          majorsCount: majorsData.length, 
          activitiesCount: activitiesData.length,
          greekLifeCount: greekLifeData?.length || 0
        });
        
        setMajors(majorsData);
        setActivities(activitiesData);
        setGreekLifeOptions(greekLifeData || []);
        loadUniversities();
      } catch (error) {
        console.error('[AlumniProfileComplete] Error loading form data:', error);
        toast("Failed to load profile data. Please try again later.");
      }
    };
    
    loadFormData();
  }, [session, navigate, user]);

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      console.log("[AlumniProfileComplete] Uploading profile image to alumni-data bucket");
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
      
      console.log("[AlumniProfileComplete] Image uploaded successfully:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('[AlumniProfileComplete] Error uploading image:', error);
      toast("Failed to upload your profile image.");
      return null;
    }
  };
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      console.error("[AlumniProfileComplete] Cannot complete profile - no user found");
      toast("You need to be logged in to complete your profile.");
      navigate('/auth');
      return;
    }
    
    console.log("[AlumniProfileComplete] Starting profile submission:", values);
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
      
      // Create profile
      console.log("[AlumniProfileComplete] Creating profile for user:", user.id);
      const { error: profileError } = await supabase
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
          price_60_min: values.rate60min
        });
      
      if (profileError) throw profileError;
      
      // Get the newly created profile
      console.log("[AlumniProfileComplete] Getting created profile");
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      console.log("[AlumniProfileComplete] Profile created successfully:", profileData);
      
      // Add activities to profile
      const activityInserts = values.activities.map(activityId => ({
        profile_id: profileData.id,
        activity_id: activityId,
      }));
      
      if (activityInserts.length > 0) {
        console.log("[AlumniProfileComplete] Adding activities to profile:", activityInserts.length);
        const { error: activitiesError } = await supabase
          .from('profile_activities')
          .insert(activityInserts);
        
        if (activitiesError) throw activitiesError;
      }
      
      // Add Greek life affiliation if selected
      if (values.greekLife && values.greekLife !== 'none') {
        console.log("[AlumniProfileComplete] Adding Greek life affiliation:", values.greekLife);
        try {
          const { error: greekLifeError } = await supabase
            .from('profile_greek_life')
            .insert({
              profile_id: profileData.id,
              greek_life_id: values.greekLife,
            });
          
          if (greekLifeError) throw greekLifeError;
        } catch (error) {
          console.error('[AlumniProfileComplete] Error adding Greek life affiliation:', error);
          // Continue even if Greek life association fails
        }
      }
      
      toast("Profile complete! Your alumni profile has been set up successfully.");
      
      // Redirect to alumni dashboard
      console.log("[AlumniProfileComplete] Redirecting to alumni dashboard");
      navigate('/alumni-dashboard');
    } catch (error: any) {
      console.error('[AlumniProfileComplete] Error completing profile:', error);
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
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <textarea 
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell others about yourself, your experiences, and what you can offer to students..."
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
                      <FormItem>
                        <FormLabel>University</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your university" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {flattenedUniversities.map((university) => (
                              <SelectItem key={university.id} value={university.id}>
                                {university.name}
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
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
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
                            options={filteredMajors}
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

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="rate15min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>15 Min Rate ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rate30min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>30 Min Rate ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="45"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rate60min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>60 Min Rate ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="80"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="greekLife"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Greek Life</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Greek organization (if any)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {greekLifeOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
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
                    name="activities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Activities</FormLabel>
                          <p className="text-sm text-gray-500">
                            Select the activities you were involved in
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
                                        return checked
                                          ? field.onChange([...field.value, activity.id])
                                          : field.onChange(
                                              field.value?.filter(
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
      </div>
      <Footer />
    </div>
  );
};

export default AlumniProfileComplete;
