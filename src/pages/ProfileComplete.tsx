
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { Plus, X } from 'lucide-react';

// Define advanced degree schema
const advancedDegreeSchema = z.object({
  degree: z.string().min(1, { message: 'Degree is required' }),
  year: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 1900 && num <= new Date().getFullYear() + 10;
  }, {
    message: "Year must be a valid year"
  }),
  university: z.string().min(1, { message: 'University is required' }),
});

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
  hasAdvancedDegree: z.boolean().optional(),
  advancedDegrees: z.array(advancedDegreeSchema).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AdvancedDegree = z.infer<typeof advancedDegreeSchema>;

const degreeOptions = [
  'Master of Arts (MA)',
  'Master of Science (MS)',
  'Master of Business Administration (MBA)',
  'Master of Education (MEd)',
  'Master of Engineering (MEng)',
  'Master of Fine Arts (MFA)',
  'Master of Public Administration (MPA)',
  'Master of Social Work (MSW)',
  'Doctor of Philosophy (PhD)',
  'Doctor of Medicine (MD)',
  'Doctor of Dental Surgery (DDS)',
  'Doctor of Veterinary Medicine (DVM)',
  'Juris Doctor (JD)',
  'Doctor of Pharmacy (PharmD)',
  'Doctor of Physical Therapy (DPT)',
  'Doctor of Psychology (PsyD)',
  'Other'
];

const ProfileComplete = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [hasAdvancedDegree, setHasAdvancedDegree] = useState(false);
  const [advancedDegrees, setAdvancedDegrees] = useState<AdvancedDegree[]>([]);

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
      hasAdvancedDegree: false,
      advancedDegrees: [],
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

  const addAdvancedDegree = () => {
    setAdvancedDegrees([...advancedDegrees, { degree: '', year: '', university: '' }]);
  };

  const removeAdvancedDegree = (index: number) => {
    setAdvancedDegrees(advancedDegrees.filter((_, i) => i !== index));
  };

  const updateAdvancedDegree = (index: number, field: keyof AdvancedDegree, value: string) => {
    const updated = [...advancedDegrees];
    updated[index] = { ...updated[index], [field]: value };
    setAdvancedDegrees(updated);
    form.setValue('advancedDegrees', updated);
  };

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
        // Store advanced degrees in achievements array for now
        achievements: hasAdvancedDegree && advancedDegrees.length > 0 
          ? advancedDegrees.map(degree => `${degree.degree} from ${degree.university} (${degree.year})`)
          : null
      };

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          university_id: values.universityId,
          major_id: values.majorId,
          graduation_year: values.graduationYear,
          advanced_degrees: hasAdvancedDegree ? advancedDegrees : null
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

            {/* Advanced Degrees Section */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="hasAdvancedDegree"
                  checked={hasAdvancedDegree}
                  onCheckedChange={(checked) => {
                    setHasAdvancedDegree(checked as boolean);
                    if (!checked) {
                      setAdvancedDegrees([]);
                      form.setValue('advancedDegrees', []);
                    }
                  }}
                />
                <Label htmlFor="hasAdvancedDegree" className="text-base font-medium">
                  Do you have any advanced degrees?
                </Label>
              </div>

              {hasAdvancedDegree && (
                <div className="space-y-4">
                  {advancedDegrees.map((degree, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Advanced Degree {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAdvancedDegree(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Degree</Label>
                          <Select 
                            value={degree.degree}
                            onValueChange={(value) => updateAdvancedDegree(index, 'degree', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select degree" />
                            </SelectTrigger>
                            <SelectContent>
                              {degreeOptions.map((degreeOption) => (
                                <SelectItem key={degreeOption} value={degreeOption}>
                                  {degreeOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Year Graduated</Label>
                          <Input
                            placeholder="e.g., 2023"
                            value={degree.year}
                            onChange={(e) => updateAdvancedDegree(index, 'year', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label>University</Label>
                          <Select 
                            value={degree.university}
                            onValueChange={(value) => updateAdvancedDegree(index, 'university', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select university" />
                            </SelectTrigger>
                            <SelectContent>
                              {schools.map((school) => (
                                <SelectItem key={school.id} value={school.name}>
                                  {school.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAdvancedDegree}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Advanced Degree
                  </Button>
                </div>
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
