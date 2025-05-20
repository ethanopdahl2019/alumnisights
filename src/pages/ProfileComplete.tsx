
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
  image: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileComplete = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
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
    
    // Calculate progress based on total possible steps (including image upload)
    setProgress((completedSteps / 6) * 100);
  }, [watchedValues, imagePreview]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!session) {
      navigate('/auth');
      return;
    }
    
    // Load universities from the insights page data
    const loadUniversities = () => {
      const universitiesByLetter = getUniversitiesByLetter();
      const allUniversities: any[] = [];
      
      // Flatten the university list from all letters
      Object.values(universitiesByLetter).forEach(universities => {
        universities.forEach(university => {
          allUniversities.push(university);
        });
      });
      
      // Sort universities by name
      allUniversities.sort((a, b) => a.name.localeCompare(b.name));
      setUniversities(allUniversities);
    };
    
    // Load majors, activities, and Greek Life options
    const loadFormData = async () => {
      try {
        const [majorsData, activitiesData, greekLifeData] = await Promise.all([
          getMajors(),
          getActivities(),
          getGreekLifeOptions ? getGreekLifeOptions() : [] // Use if available, otherwise empty array
        ]);
        
        setMajors(majorsData);
        setActivities(activitiesData);
        setGreekLifeOptions(greekLifeData || []);
        loadUniversities();
      } catch (error) {
        console.error('Error loading form data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later."
        });
      }
    };
    
    loadFormData();
  }, [session, navigate]);

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
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
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload your profile image."
      });
      return null;
    }
  };
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Upload profile image if one is selected
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadProfileImage(user.id);
      }
      
      // Get school_id from session user metadata or from selected university
      const metadata = user.user_metadata || {};
      const schoolId = values.universityId;
      
      if (!schoolId) {
        throw new Error("School information not found. Please try again.");
      }
      
      // Determine if user is a mentor/alumni or student/applicant
      const isMentor = metadata.user_type === 'mentor' || metadata.role === 'alumni';
      
      if (isMentor) {
        // Update alumni table
        const { error: alumniError } = await supabase
          .from('alumni')
          .update({
            school_id: schoolId,
            major_id: values.majorId,
            degree: values.degree,
            bio: values.bio,
            image: imageUrl
          })
          .eq('id', user.id);
          
        if (alumniError) throw alumniError;
      } else {
        // Update applicant table
        const { error: applicantError } = await supabase
          .from('applicants')
          .update({
            school_id: schoolId,
            major_id: values.majorId,
            degree: values.degree
          })
          .eq('id', user.id);
          
        if (applicantError) throw applicantError;
      }
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: `${metadata.first_name} ${metadata.last_name}`,
          school_id: schoolId,
          major_id: values.majorId,
          bio: values.bio,
          image: imageUrl, // Add profile image URL
        });
      
      if (profileError) throw profileError;
      
      // Get the newly created profile
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Add activities to profile
      const activityInserts = values.activities.map(activityId => ({
        profile_id: profileData.id,
        activity_id: activityId,
      }));
      
      if (activityInserts.length > 0) {
        const { error: activitiesError } = await supabase
          .from('profile_activities')
          .insert(activityInserts);
        
        if (activitiesError) throw activitiesError;
      }
      
      // Add Greek life affiliation if selected
      if (values.greekLife && values.greekLife !== 'none') {
        try {
          const { error: greekLifeError } = await supabase
            .from('profile_greek_life')
            .insert({
              profile_id: profileData.id,
              greek_life_id: values.greekLife,
            });
          
          if (greekLifeError) throw greekLifeError;
        } catch (error) {
          console.error('Error adding Greek life affiliation:', error);
          // Continue even if Greek life association fails
        }
      }
      
      toast({
        title: "Profile complete!",
        description: "Your profile has been set up successfully."
      });
      
      // Redirect based on user role
      if (isMentor) {
        navigate('/mentor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete your profile. Please try again."
      });
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
                This information will be displayed on your public profile
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
                            options={universities}
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
                            <SelectLabel>Fraternities</SelectLabel>
                            <SelectItem value="alpha-phi-alpha">Alpha Phi Alpha</SelectItem>
                            <SelectItem value="sigma-chi">Sigma Chi</SelectItem>
                            <SelectItem value="kappa-sigma">Kappa Sigma</SelectItem>
                            <SelectItem value="sigma-alpha-epsilon">Sigma Alpha Epsilon</SelectItem>
                            <SelectItem value="phi-delta-theta">Phi Delta Theta</SelectItem>
                            <SelectItem value="pi-kappa-alpha">Pi Kappa Alpha</SelectItem>
                            <SelectLabel>Sororities</SelectLabel>
                            <SelectItem value="alpha-chi-omega">Alpha Chi Omega</SelectItem>
                            <SelectItem value="chi-omega">Chi Omega</SelectItem>
                            <SelectItem value="delta-gamma">Delta Gamma</SelectItem>
                            <SelectItem value="kappa-kappa-gamma">Kappa Kappa Gamma</SelectItem>
                            <SelectItem value="alpha-phi">Alpha Phi</SelectItem>
                            <SelectItem value="delta-delta-delta">Delta Delta Delta</SelectItem>
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
                      {isLoading ? "Saving..." : "Complete Profile"}
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
