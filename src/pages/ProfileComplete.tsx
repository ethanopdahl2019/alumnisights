
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMajors, getActivities } from '@/services/profiles';
import { getUniversitiesByLetter } from '@/pages/insights/universities/universities-data';

const profileSchema = z.object({
  bio: z.string().min(20, { message: "Bio should be at least 20 characters" }),
  universityId: z.string().min(1, { message: "Please select your university" }),
  degree: z.string().min(1, { message: "Please select your degree" }),
  majorId: z.string().min(1, { message: "Please select your major" }),
  activities: z.array(z.string()).min(1, { message: "Please select at least one activity" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileComplete = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [universities, setUniversities] = useState<any[]>([]);
  
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
    },
    mode: "onChange",
  });
  
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
    
    setProgress((completedSteps / 5) * 100);
  }, [watchedValues]);
  
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
    
    // Load majors and activities
    const loadFormData = async () => {
      try {
        const [majorsData, activitiesData] = await Promise.all([
          getMajors(),
          getActivities()
        ]);
        
        setMajors(majorsData);
        setActivities(activitiesData);
        loadUniversities();
      } catch (error) {
        console.error('Error loading form data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadFormData();
  }, [session, navigate]);
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get school_id from session user metadata or from selected university
      const metadata = user.user_metadata || {};
      const schoolId = values.universityId;
      
      if (!schoolId) {
        throw new Error("School information not found. Please try again.");
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
      
      const { error: activitiesError } = await supabase
        .from('profile_activities')
        .insert(activityInserts);
      
      if (activitiesError) throw activitiesError;
      
      toast({
        title: "Profile complete!",
        description: "Your profile has been set up successfully.",
      });
      
      // Redirect to profile page
      navigate(`/profile/${profileData.id}`);
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
                      <FormItem>
                        <FormLabel>University</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your university" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {universities.map((university) => (
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
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your major" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {majors.map((major) => (
                              <SelectItem key={major.id} value={major.id}>
                                {major.name}
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

