
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
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
import { getMajors } from '@/services/profiles';
import { getUniversities } from '@/services/universities';
import SearchInput from '@/components/SearchInput';

const profileSchema = z.object({
  universityId: z.string().min(1, { message: "Please select your target university" }),
  majorId: z.string().min(1, { message: "Please select your intended major" }),
  interests: z.string().min(10, { message: "Please describe your interests" }),
  goals: z.string().min(10, { message: "Please describe your goals" }),
  image: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ApplicantProfileComplete = () => {
  console.log("[ApplicantProfileComplete] Component rendering");
  const navigate = useNavigate();
  const { user, session } = useAuth();
  
  console.log("[ApplicantProfileComplete] Auth state:", { 
    userExists: !!user, 
    userEmail: user?.email, 
    sessionExists: !!session,
    userMetadata: user?.user_metadata 
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [universities, setUniversities] = useState<any[]>([]);
  const [universitySearchTerm, setUniversitySearchTerm] = useState("");
  const [majorSearchTerm, setMajorSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      universityId: "",
      majorId: "",
      interests: "",
      goals: "",
    },
    mode: "onChange",
  });
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[ApplicantProfileComplete] Image selected:", file.name);
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
    if (watchedValues.universityId) completedSteps++;
    if (watchedValues.majorId) completedSteps++;
    if (watchedValues.interests.length >= 10) completedSteps++;
    if (watchedValues.goals.length >= 10) completedSteps++;
    if (imagePreview) completedSteps++;
    
    // Calculate progress based on total possible steps
    const progressValue = (completedSteps / 5) * 100;
    setProgress(progressValue);
    console.log("[ApplicantProfileComplete] Form progress:", progressValue);
  }, [watchedValues, imagePreview]);
  
  // Redirect if not logged in
  useEffect(() => {
    console.log("[ApplicantProfileComplete] Auth check running");
    if (!user && !session) {
      console.log("[ApplicantProfileComplete] No user or session found, redirecting to auth page");
      navigate('/auth');
      return;
    } else {
      console.log("[ApplicantProfileComplete] User is authenticated:", user?.email);
      // Check if the user is an applicant
      if (user?.user_metadata?.role !== 'applicant') {
        console.log("[ApplicantProfileComplete] User is not an applicant, redirecting to appropriate dashboard");
        navigate('/');
        return;
      }
    }
    
    // Load universities and majors
    const loadFormData = async () => {
      console.log("[ApplicantProfileComplete] Loading form data (majors, universities, etc.)");
      try {
        const [majorsData, universitiesData] = await Promise.all([
          getMajors(),
          getUniversities()
        ]);
        
        console.log("[ApplicantProfileComplete] Data loaded:", { 
          majorsCount: majorsData.length,
          universitiesCount: universitiesData.length
        });
        
        setMajors(majorsData);
        setUniversities(universitiesData);
      } catch (error) {
        console.error('[ApplicantProfileComplete] Error loading form data:', error);
        toast("Failed to load profile data. Please try again later.");
      }
    };
    
    loadFormData();
  }, [session, navigate, user]);

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      console.log("[ApplicantProfileComplete] Uploading profile image to applicant-data bucket");
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;
      
      // Upload the image
      const { data, error } = await supabase.storage
        .from('applicant-data')
        .upload(filePath, imageFile, {
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('applicant-data')
        .getPublicUrl(data.path);
      
      console.log("[ApplicantProfileComplete] Image uploaded successfully:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('[ApplicantProfileComplete] Error uploading image:', error);
      toast("Failed to upload your profile image.");
      return null;
    }
  };
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      console.error("[ApplicantProfileComplete] Cannot complete profile - no user found");
      toast("You need to be logged in to complete your profile.");
      navigate('/auth');
      return;
    }
    
    console.log("[ApplicantProfileComplete] Starting profile submission:", values);
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
      console.log("[ApplicantProfileComplete] Creating profile for user:", user.id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: `${metadata.first_name} ${metadata.last_name}`,
          school_id: schoolId,
          major_id: values.majorId,
          bio: `Goals: ${values.goals}\n\nInterests: ${values.interests}`,
          image: imageUrl,
          role: 'applicant'
        })
        .select()
        .single();
      
      if (profileError) throw profileError;
      
      // Add dream school
      if (profileData && schoolId) {
        try {
          // First, check if applicant_dream_schools exists in the database schema
          const { error: dreamSchoolError } = await supabase
            .from('applicant_dream_schools')
            .insert({
              profile_id: profileData.id,
              school_id: schoolId
            });
            
          if (dreamSchoolError) {
            console.error("[ApplicantProfileComplete] Error adding dream school:", dreamSchoolError);
          }
        } catch (error) {
          console.error('[ApplicantProfileComplete] Error adding dream school:', error);
          // Continue even if dream school addition fails
        }
      }
      
      toast("Profile complete! Your applicant profile has been set up successfully.");
      
      // Redirect to applicant dashboard
      console.log("[ApplicantProfileComplete] Redirecting to applicant dashboard");
      navigate('/applicant-dashboard');
    } catch (error: any) {
      console.error('[ApplicantProfileComplete] Error completing profile:', error);
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
            <h1 className="text-3xl font-bold mb-2">Complete Your Applicant Profile</h1>
            <p className="text-gray-600">
              Tell us about your goals and interests to help match you with the right alumni
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
                This information will help us connect you with relevant alumni
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
                    name="universityId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Target University</FormLabel>
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
                    name="majorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intended Major</FormLabel>
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
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Interests</FormLabel>
                        <FormControl>
                          <textarea 
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe your academic interests and what subjects you're passionate about..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Goals</FormLabel>
                        <FormControl>
                          <textarea 
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="What are your educational and career goals? What do you hope to achieve?"
                            {...field}
                          />
                        </FormControl>
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
                      disabled={isLoading || progress < 80} // 80% is good enough
                      className={progress < 80 ? "opacity-70" : ""}
                    >
                      {isLoading ? "Saving..." : "Complete Applicant Profile"}
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

export default ApplicantProfileComplete;
