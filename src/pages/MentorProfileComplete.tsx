
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getActivities } from '@/services/profiles';

const mentorProfileSchema = z.object({
  bio: z.string().min(20, { message: "Bio should be at least 20 characters" }),
  price15Min: z.number().min(1, { message: "15-minute session price is required" }),
  price30Min: z.number().min(1, { message: "30-minute session price is required" }),
  price60Min: z.number().min(1, { message: "60-minute session price is required" }),
  activities: z.array(z.string()).min(1, { message: "Please select at least one activity" }),
});

type MentorProfileFormValues = z.infer<typeof mentorProfileSchema>;

const MentorProfileComplete = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  
  const form = useForm<MentorProfileFormValues>({
    resolver: zodResolver(mentorProfileSchema),
    defaultValues: {
      bio: "",
      price15Min: 25,
      price30Min: 45,
      price60Min: 80,
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
    if (watchedValues.price15Min > 0) completedSteps++;
    if (watchedValues.price30Min > 0) completedSteps++;
    if (watchedValues.price60Min > 0) completedSteps++;
    if (watchedValues.activities.length > 0) completedSteps++;
    
    setProgress((completedSteps / 5) * 100);
  }, [watchedValues]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!session) {
      navigate('/auth');
      return;
    }
    
    // Load activities
    const loadActivities = async () => {
      try {
        const activitiesData = await getActivities();
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error loading activities:', error);
        toast({
          title: "Error",
          description: "Failed to load activities. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadActivities();
  }, [session, navigate]);
  
  const onSubmit = async (values: MentorProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get user metadata to find school and major IDs
      const metadata = user.user_metadata || {};
      const schoolId = metadata.school_id;
      const majorId = metadata.major_id;
      
      if (!schoolId || !majorId) {
        throw new Error("School and major information not found. Please contact support.");
      }
      
      // Create mentor profile
      const { error: profileError, data: profileData } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: `${metadata.first_name} ${metadata.last_name}`,
          school_id: schoolId,
          major_id: majorId,
          bio: values.bio,
          price_15_min: values.price15Min,
          price_30_min: values.price30Min,
          price_60_min: values.price60Min,
          visible: true,
          role: 'mentor'
        })
        .select()
        .single();
      
      if (profileError) throw profileError;
      
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
        title: "Mentor profile complete!",
        description: "Your mentor profile has been set up successfully.",
      });
      
      // Redirect to mentor dashboard
      navigate('/mentor-dashboard');
    } catch (error: any) {
      console.error('Error completing mentor profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete your mentor profile. Please try again.",
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
            <h1 className="text-3xl font-bold mb-2">Complete Your Mentor Profile</h1>
            <p className="text-gray-600">
              Set up your pricing and expertise to start mentoring students
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
              <CardTitle>Mentor Information</CardTitle>
              <CardDescription>
                This information will help students understand your expertise and book sessions with you
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
                            placeholder="Share your background, experience, and what you can help students with..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Pricing</h3>
                    <p className="text-sm text-gray-500">Set your rates for different session lengths</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="price15Min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>15-minute session ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="25"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price30Min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>30-minute session ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="45"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price60Min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>60-minute session ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="80"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="activities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Areas of Expertise</FormLabel>
                          <p className="text-sm text-gray-500">
                            Select the areas where you can provide mentorship
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

export default MentorProfileComplete;
