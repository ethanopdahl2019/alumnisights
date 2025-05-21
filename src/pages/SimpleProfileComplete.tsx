
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
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Schema with all fields optional
const profileSchema = z.object({
  university: z.string().optional(),
  degree: z.string().optional(),
  major: z.string().optional(), 
  bio: z.string().optional(),
  location: z.string().optional(),
  graduationYear: z.string().optional(),
  image: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const SimpleProfileComplete = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      university: '',
      degree: '',
      major: '',
      bio: '',
      location: '',
      graduationYear: '',
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
    // Calculate form completion progress based on filled fields
    let completedSteps = 0;
    let totalSteps = 0;
    
    if (watchedValues.bio) completedSteps++;
    totalSteps++;
    
    if (watchedValues.university) completedSteps++;
    totalSteps++;
    
    if (watchedValues.degree) completedSteps++;
    totalSteps++;
    
    if (watchedValues.major) completedSteps++;
    totalSteps++;
    
    if (watchedValues.location) completedSteps++;
    totalSteps++;
    
    if (watchedValues.graduationYear) completedSteps++;
    totalSteps++;
    
    if (imagePreview) completedSteps++;
    totalSteps++;
    
    const progressValue = (completedSteps / totalSteps) * 100;
    setProgress(progressValue);
  }, [watchedValues, imagePreview]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user && !session) {
      navigate('/auth');
      return;
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
            form.setValue('university', data.school_name || '');
            form.setValue('degree', data.degree || '');
            form.setValue('major', data.major_name || '');
            form.setValue('location', data.location || '');
            form.setValue('graduationYear', data.graduation_year ? String(data.graduation_year) : '');
            
            if (data.image) {
              setImagePreview(data.image);
            }
          }
        } catch (err) {
          console.error("Error checking for existing profile:", err);
        }
      }
    };
    
    checkExistingProfile();
  }, [session, navigate, user, form]);

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!imageFile && imagePreview && existingProfile?.image) {
      return existingProfile.image;
    }
    
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
      toast("Failed to upload your profile image.");
      return null;
    }
  };
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      toast("You need to be logged in to complete your profile.");
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    try {
      // Upload profile image if one is selected
      let imageUrl = null;
      if (imageFile || existingProfile?.image) {
        imageUrl = await uploadProfileImage(user.id);
      }
      
      // Get metadata from session user
      const metadata = user.user_metadata || {};
      const name = `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim();

      // Determine role
      const role = metadata.role || 'applicant';
      
      // Convert graduation year to number if present
      const graduationYear = values.graduationYear ? parseInt(values.graduationYear, 10) : null;
      
      if (existingProfile) {
        // Update existing profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: name || existingProfile.name,
            school_name: values.university,
            major_name: values.major,
            bio: values.bio,
            image: imageUrl || existingProfile.image,
            location: values.location,
            graduation_year: graduationYear,
            degree: values.degree, // Using string degree directly
            role: role as 'applicant' | 'alumni', // Cast to union type
            visible: existingProfile.visible !== undefined ? existingProfile.visible : true // Preserve visibility or default to true
          })
          .eq('id', existingProfile.id);
          
        if (profileError) throw profileError;
        
        toast("Profile updated successfully!");
      } else {
        // Create new profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: name || user.email?.split('@')[0] || 'User',
            school_name: values.university,
            major_name: values.major,
            bio: values.bio,
            image: imageUrl,
            location: values.location,
            graduation_year: graduationYear,
            degree: values.degree, // Using string degree directly
            role: role as 'applicant' | 'alumni', // Cast to union type
            visible: true, // Default to visible for new profiles
            school_id: '', // Adding required fields with empty values
            major_id: ''  // Adding required fields with empty values
          });
        
        if (profileError) throw profileError;
        
        toast("Profile created successfully!");
      }
      
      // Redirect to appropriate page
      if (role === 'alumni') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/applicant-dashboard');
      }
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast("Failed to complete your profile: " + (error.message || "Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  // Degree options (simplified)
  const degrees = [
    { id: "bachelors", name: "Bachelor's Degree" },
    { id: "masters", name: "Master's Degree" },
    { id: "phd", name: "PhD" },
    { id: "other", name: "Other" }
  ];
  
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
                Fill in as many fields as you'd like to complete your profile.
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
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your university" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Major</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your major" {...field} />
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
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <textarea 
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell others about yourself..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Year" 
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
                      onClick={() => navigate('/my-account')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
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

export default SimpleProfileComplete;
