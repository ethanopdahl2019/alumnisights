
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
import { getSchools } from '@/services/profiles';
import { School } from '@/types/database';
import { Upload, Camera, Plus, X, ArrowLeft } from 'lucide-react';
import { uploadFileToStorage } from '@/utils/fileUpload';

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
const mentorProfileFormSchema = z.object({
  headline: z.string().min(1, { message: 'Headline is required' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters' }),
  graduationYear: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 1900 && num <= new Date().getFullYear();
  }, {
    message: "Graduation year must be a valid year"
  }),
  location: z.string().min(1, { message: 'Location is required' }),
  currentOccupation: z.string().min(1, { message: 'Current occupation is required' }),
  yearsOfExperience: z.string().min(1, { message: 'Years of experience is required' }),
  activities: z.array(z.string()).optional(),
  clubs: z.array(z.string()).optional(),
  greekLife: z.string().optional(),
  price15Min: z.number().min(1, { message: 'Price must be greater than 0' }).optional(),
  price30Min: z.number().min(1, { message: 'Price must be greater than 0' }).optional(),
  price60Min: z.number().min(1, { message: 'Price must be greater than 0' }).optional(),
  hasAdvancedDegree: z.boolean().optional(),
  advancedDegrees: z.array(advancedDegreeSchema).optional(),
});

type MentorProfileFormValues = z.infer<typeof mentorProfileFormSchema>;
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

const experienceOptions = [
  '0-1 years',
  '2-3 years',
  '4-5 years',
  '6-8 years',
  '9-12 years',
  '13-15 years',
  '16-20 years',
  '20+ years'
];

const MentorProfileComplete = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [hasAdvancedDegree, setHasAdvancedDegree] = useState(false);
  const [advancedDegrees, setAdvancedDegrees] = useState<AdvancedDegree[]>([]);
  const [availableActivities, setAvailableActivities] = useState<string[]>([
    'Student Government',
    'Academic Clubs',
    'Research',
    'Internships',
    'Study Abroad',
    'Volunteer Work',
    'Sports Teams',
    'Honor Societies',
    'Cultural Organizations',
    'Professional Organizations'
  ]);
  const [availableClubs, setAvailableClubs] = useState<string[]>([
    'Debate Team',
    'Drama Club',
    'Music Ensembles',
    'Academic Honor Societies',
    'Pre-professional Clubs',
    'Cultural Clubs',
    'Service Clubs',
    'Special Interest Groups'
  ]);

  // Form setup
  const form = useForm<MentorProfileFormValues>({
    resolver: zodResolver(mentorProfileFormSchema),
    defaultValues: {
      headline: '',
      bio: '',
      graduationYear: '',
      location: '',
      currentOccupation: '',
      yearsOfExperience: '',
      activities: [],
      clubs: [],
      greekLife: '',
      price15Min: undefined,
      price30Min: undefined,
      price60Min: undefined,
      hasAdvancedDegree: false,
      advancedDegrees: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolsData = await getSchools();
        setSchools(schoolsData);
      } catch (error) {
        console.error("Failed to load form data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load schools. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

  const onSubmit = async (values: MentorProfileFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get university ID and major from user metadata
      const universityId = user.user_metadata?.university_id;
      const majorId = user.user_metadata?.major_id;
      
      // Find the school that matches the university
      let schoolId = null;
      if (universityId) {
        const matchingSchool = schools.find(school => 
          school.name.toLowerCase().includes(universityId.toLowerCase()) ||
          school.id === universityId
        );
        schoolId = matchingSchool?.id || null;
      }

      // Get name from user metadata
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();

      const profileData = {
        user_id: user.id,
        name: fullName,
        bio: values.bio,
        image: profileImage || null,
        school_id: schoolId,
        major_id: majorId,
        role: 'mentor',
        headline: values.headline,
        graduation_year: parseInt(values.graduationYear),
        location: values.location,
        price_15_min: values.price15Min || null,
        price_30_min: values.price30Min || null,
        price_60_min: values.price60Min || null,
        visible: true,
        university_id: universityId,
        achievements: [
          `Current Occupation: ${values.currentOccupation}`,
          `Years of Experience: ${values.yearsOfExperience}`,
          ...(values.activities || []).map(activity => `Activity: ${activity}`),
          ...(values.clubs || []).map(club => `Club: ${club}`),
          ...(values.greekLife ? [`Greek Life: ${values.greekLife}`] : []),
          ...(hasAdvancedDegree && advancedDegrees.length > 0 
            ? advancedDegrees.map(degree => `${degree.degree} from ${degree.university} (${degree.year})`)
            : [])
        ]
      };

      // Update user metadata with advanced degrees
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
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
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

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
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingImage}
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById('profile-image')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                </Button>
                <p className="text-xs text-gray-500">
                  Upload a professional profile photo
                </p>
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
              <Label htmlFor="currentOccupation">Current Occupation</Label>
              <Input 
                id="currentOccupation" 
                placeholder="e.g., Software Engineer at Google" 
                {...form.register('currentOccupation')} 
              />
              {form.formState.errors.currentOccupation && (
                <p className="text-red-500 text-sm">{form.formState.errors.currentOccupation.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="yearsOfExperience">Years of Work Experience</Label>
              <Select onValueChange={(value) => form.setValue('yearsOfExperience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.yearsOfExperience && (
                <p className="text-red-500 text-sm">{form.formState.errors.yearsOfExperience.message}</p>
              )}
            </div>

            {/* Activities Section */}
            <div>
              <Label>College Activities</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableActivities.map((activity) => (
                  <div key={activity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`activity-${activity}`}
                      onCheckedChange={(checked) => {
                        const currentActivities = form.getValues('activities') || [];
                        if (checked) {
                          form.setValue('activities', [...currentActivities, activity]);
                        } else {
                          form.setValue('activities', currentActivities.filter(a => a !== activity));
                        }
                      }}
                    />
                    <Label htmlFor={`activity-${activity}`} className="text-sm">
                      {activity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clubs Section */}
            <div>
              <Label>College Clubs</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableClubs.map((club) => (
                  <div key={club} className="flex items-center space-x-2">
                    <Checkbox
                      id={`club-${club}`}
                      onCheckedChange={(checked) => {
                        const currentClubs = form.getValues('clubs') || [];
                        if (checked) {
                          form.setValue('clubs', [...currentClubs, club]);
                        } else {
                          form.setValue('clubs', currentClubs.filter(c => c !== club));
                        }
                      }}
                    />
                    <Label htmlFor={`club-${club}`} className="text-sm">
                      {club}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="greekLife">Greek Life (Optional)</Label>
              <Input 
                id="greekLife" 
                placeholder="e.g., Alpha Phi Alpha" 
                {...form.register('greekLife')} 
              />
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
                  min="1"
                  step="1"
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    form.setValue('price15Min', value);
                  }}
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
                  min="1"
                  step="1"
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    form.setValue('price30Min', value);
                  }}
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
                  min="1"
                  step="1"
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    form.setValue('price60Min', value);
                  }}
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
