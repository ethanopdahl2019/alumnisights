import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { getMajors } from '@/services/majors';
import { getSchools } from '@/services/profiles';
import { School, Major } from '@/types/database';
import { Upload, Camera } from 'lucide-react';
import { uploadFileToStorage } from '@/utils/fileUpload';

// Define form schema
const mentorProfileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  headline: z.string().min(1, { message: 'Headline is required' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters' }),
  universityId: z.string().min(1, { message: 'University is required' }),
  majorId: z.string().min(1, { message: 'Major is required' }),
  graduationYear: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 1900 && num <= new Date().getFullYear();
  }, {
    message: "Graduation year must be a valid year"
  }),
  location: z.string().min(1, { message: 'Location is required' }),
  price15Min: z.string().optional(),
  price30Min: z.string().optional(),
  price60Min: z.string().optional(),
});

type MentorProfileFormValues = z.infer<typeof mentorProfileFormSchema>;

const MentorProfileComplete = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form setup
  const form = useForm<MentorProfileFormValues>({
    resolver: zodResolver(mentorProfileFormSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      headline: '',
      bio: '',
      universityId: '',
      majorId: '',
      graduationYear: '',
      location: '',
      price15Min: '',
      price30Min: '',
      price60Min: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsData, majorsData] = await Promise.all([
          getSchools(),
          getMajors()
        ]);
        setSchools(schoolsData);
        setMajors(majorsData);
      } catch (error) {
        console.error("Failed to load form data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load schools and majors. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadFileToStorage({
        file,
        prefix: 'profile',
        resourceId: user.id
      });

      if (imageUrl) {
        setProfileImage(imageUrl);
        toast({
          title: "Image uploaded",
          description: "Profile image uploaded successfully"
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile image",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values: MentorProfileFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get university ID from user metadata or form
      const universityId = user.user_metadata?.university_id || values.universityId;
      
      // Find the school that matches the university
      let schoolId = null;
      if (universityId) {
        // Try to find a school with matching name or ID
        const matchingSchool = schools.find(school => 
          school.name.toLowerCase().includes(universityId.toLowerCase()) ||
          school.id === universityId
        );
        schoolId = matchingSchool?.id || null;
      }

      const profileData = {
        user_id: user.id,
        name: `${values.firstName} ${values.lastName}`,
        bio: values.bio,
        image: profileImage || null,
        school_id: schoolId,
        major_id: values.majorId,
        role: 'mentor',
        headline: values.headline,
        graduation_year: parseInt(values.graduationYear),
        location: values.location,
        price_15_min: parseFloat(values.price15Min || '0'),
        price_30_min: parseFloat(values.price30Min || '0'),
        price_60_min: parseFloat(values.price60Min || '0'),
        visible: true,
        university_id: universityId
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile completed",
        description: "Your mentor profile has been created successfully!"
      });

      navigate('/mentor-dashboard');

    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: "Profile creation failed",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Complete Your Mentor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback>
                  <Camera className="h-8 w-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col items-center space-y-2">
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingImage}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                </Label>
                <p className="text-xs text-gray-500">
                  Upload a professional profile photo
                </p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  {...form.register('firstName')} 
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-500 text-sm">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  {...form.register('lastName')} 
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-500 text-sm">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input 
                id="headline" 
                placeholder="e.g., Experienced Software Engineer" 
                {...form.register('headline')} 
              />
              {form.formState.errors.headline && (
                <p className="text-red-500 text-sm">{form.formState.errors.headline.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Tell us about yourself" 
                rows={3}
                {...form.register('bio')} 
              />
              {form.formState.errors.bio && (
                <p className="text-red-500 text-sm">{form.formState.errors.bio.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="universityId">University</Label>
                <Input 
                  id="universityId" 
                  placeholder="e.g., Harvard University" 
                  {...form.register('universityId')} 
                />
                {form.formState.errors.universityId && (
                  <p className="text-red-500 text-sm">{form.formState.errors.universityId.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="majorId">Major</Label>
                <Select onValueChange={(value) => form.setValue('majorId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your major" />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((major) => (
                      <SelectItem key={major.id} value={major.id}>
                        {major.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.majorId && (
                  <p className="text-red-500 text-sm">{form.formState.errors.majorId.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input 
                id="graduationYear" 
                placeholder="e.g., 2022" 
                {...form.register('graduationYear')} 
              />
              {form.formState.errors.graduationYear && (
                <p className="text-red-500 text-sm">{form.formState.errors.graduationYear.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="e.g., New York, NY" 
                {...form.register('location')} 
              />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price15Min">Price (15 min)</Label>
                <Input 
                  id="price15Min" 
                  placeholder="e.g., 25" 
                  type="number"
                  {...form.register('price15Min', { valueAsNumber: true })} 
                />
                {form.formState.errors.price15Min && (
                  <p className="text-red-500 text-sm">{form.formState.errors.price15Min.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="price30Min">Price (30 min)</Label>
                <Input 
                  id="price30Min" 
                  placeholder="e.g., 40" 
                  type="number"
                  {...form.register('price30Min', { valueAsNumber: true })} 
                />
                {form.formState.errors.price30Min && (
                  <p className="text-red-500 text-sm">{form.formState.errors.price30Min.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="price60Min">Price (60 min)</Label>
                <Input 
                  id="price60Min" 
                  placeholder="e.g., 75"
                  type="number"
                  {...form.register('price60Min', { valueAsNumber: true })} 
                />
                {form.formState.errors.price60Min && (
                  <p className="text-red-500 text-sm">{form.formState.errors.price60Min.message}</p>
                )}
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Profile...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorProfileComplete;
