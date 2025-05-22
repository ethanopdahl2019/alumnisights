
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getMajors, getActivities, getGreekLifeOptions } from '@/services/profiles';
import ProfileBioSection from '@/components/alumni/ProfileBioSection';
import ProfileUniversitySection from '@/components/alumni/ProfileUniversitySection';
import ProfileRatesSection from '@/components/alumni/ProfileRatesSection';
import ProfileActivitiesSection from '@/components/alumni/ProfileActivitiesSection';
import ProfileImageUpload from '@/components/alumni/ProfileImageUpload';
import ProfileProgress from '@/components/alumni/ProfileProgress';
import ProfileFormActions from '@/components/alumni/ProfileFormActions';
import { useProfileSubmission } from '@/hooks/useProfileSubmission';

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
  const [majors, setMajors] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [greekLifeOptions, setGreekLifeOptions] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [majorSearchTerm, setMajorSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { isLoading, submitProfile } = useProfileSubmission();

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

  const onSubmit = async (values: ProfileFormValues) => {
    await submitProfile(values, user, imageFile);
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
        
        <ProfileProgress progress={progress} />
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
              <ProfileImageUpload 
                imagePreview={imagePreview}
                handleImageUpload={handleImageUpload}
              />
              
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
              
              <ProfileFormActions 
                isLoading={isLoading}
                progress={progress}
                onCancel={() => navigate('/')}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniProfileForm;
