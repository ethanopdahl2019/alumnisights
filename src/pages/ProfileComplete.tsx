
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

const applicationTypeOptions = [
  'Undergraduate college',
  'PhD programs',
  'Medical school',
  'Law school',
  'Dentistry school',
  'Master programs'
];

// Define form schema
const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters' }),
  universityId: z.string().min(1, { message: 'University is required' }),
  majorId: z.string().min(1, { message: 'Major is required' }),
  graduationYear: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 1900 && num <= new Date().getFullYear() + 10;
  }, {
    message: "Graduation year must be a valid year"
  }),
  applicationType: z.string().min(1, { message: 'Application type is required' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileComplete = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      universityId: '',
      majorId: '',
      graduationYear: '',
      applicationType: '',
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

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const profileData = {
        user_id: user.id,
        name: `${values.firstName} ${values.lastName}`,
        bio: values.bio,
        school_id: values.universityId,
        major_id: values.majorId,
        role: 'applicant',
        graduation_year: parseInt(values.graduationYear),
        visible: true,
        achievements: [`Applying to: ${values.applicationType}`]
      };

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          university_id: values.universityId,
          major_id: values.majorId,
          graduation_year: values.graduationYear,
          application_type: values.applicationType
        }
      });

      if (metadataError) throw metadataError;

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile completed",
        description: "Your profile has been created successfully!"
      });

      navigate('/student-dashboard');

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
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="Enter your first name" 
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
                  placeholder="Enter your last name" 
                  {...form.register('lastName')} 
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-500 text-sm">{form.formState.errors.lastName.message}</p>
                )}
              </div>
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

            <div>
              <Label htmlFor="universityId">University</Label>
              <Select onValueChange={(value) => form.setValue('universityId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input 
                id="graduationYear" 
                placeholder="e.g., 2025" 
                {...form.register('graduationYear')} 
              />
              {form.formState.errors.graduationYear && (
                <p className="text-red-500 text-sm">{form.formState.errors.graduationYear.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="applicationType">I am applying to</Label>
              <Select onValueChange={(value) => form.setValue('applicationType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select application type" />
                </SelectTrigger>
                <SelectContent>
                  {applicationTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.applicationType && (
                <p className="text-red-500 text-sm">{form.formState.errors.applicationType.message}</p>
              )}
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

export default ProfileComplete;
