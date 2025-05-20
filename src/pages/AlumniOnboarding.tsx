
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import ProfileBasicInfo from '@/components/onboarding/ProfileBasicInfo';
import SchoolAndMajor from '@/components/onboarding/SchoolAndMajor';
import ActivitiesSelection from '@/components/onboarding/ActivitiesSelection';
import PricingSetup from '@/components/onboarding/PricingSetup';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the steps for the onboarding process
const ONBOARDING_STEPS = {
  BASIC_INFO: 1,
  EDUCATION: 2,
  ACTIVITIES: 3,
  PRICING: 4,
};

const AlumniOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.BASIC_INFO);
  const [profileData, setProfileData] = useState({
    name: '',
    headline: '',
    location: '',
    bio: '',
    image: null as File | null,
    schoolId: '',
    majorId: '',
    degree: '',
    graduationYear: undefined as number | undefined,
    sports: [] as string[],
    clubs: [] as string[],
    greekLife: [] as string[],
    price15Min: undefined as number | undefined,
    price30Min: undefined as number | undefined,
    price60Min: undefined as number | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Handle step navigation
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.PRICING));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, ONBOARDING_STEPS.BASIC_INFO));
  };

  // Update profile data
  const updateProfileData = (newData: Partial<typeof profileData>) => {
    setProfileData((prev) => ({ ...prev, ...newData }));
  };

  // Submit the completed profile
  const handleCompleteOnboarding = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Step 1: Upload profile image if exists
      let imageUrl = null;
      if (profileData.image) {
        const fileExt = profileData.image.name.split('.').pop();
        const fileName = `${user.id}-profile-${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data: fileData, error: fileError } = await supabase.storage
          .from('profile_images')
          .upload(fileName, profileData.image);
        
        if (fileError) throw fileError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('profile_images')
          .getPublicUrl(fileName);
        
        imageUrl = data.publicUrl;
      }
      
      // Step 2: Update or create profile
      const { data: profileData: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      const profilePayload = {
        user_id: user.id,
        name: profileData.name,
        headline: profileData.headline,
        location: profileData.location,
        bio: profileData.bio,
        image: imageUrl,
        school_id: profileData.schoolId,
        major_id: profileData.majorId,
        degree: profileData.degree,
        graduation_year: profileData.graduationYear,
        role: 'alumni',
        price_15_min: profileData.price15Min,
        price_30_min: profileData.price30Min,
        price_60_min: profileData.price60Min,
      };
      
      let profileId;
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', existingProfile.id)
          .select('id');
          
        if (error) throw error;
        profileId = existingProfile.id;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('profiles')
          .insert(profilePayload)
          .select('id');
          
        if (error) throw error;
        profileId = data?.[0]?.id;
      }
      
      // Step 3: Add related activities
      // Sports
      if (profileData.sports.length > 0) {
        await supabase
          .from('profile_sports')
          .delete()
          .eq('profile_id', profileId);
          
        const sportsPayload = profileData.sports.map(sportId => ({
          profile_id: profileId,
          sport_id: sportId
        }));
        
        await supabase.from('profile_sports').insert(sportsPayload);
      }
      
      // Clubs
      if (profileData.clubs.length > 0) {
        await supabase
          .from('profile_clubs')
          .delete()
          .eq('profile_id', profileId);
          
        const clubsPayload = profileData.clubs.map(clubId => ({
          profile_id: profileId,
          club_id: clubId
        }));
        
        await supabase.from('profile_clubs').insert(clubsPayload);
      }
      
      // Greek Life
      if (profileData.greekLife.length > 0) {
        await supabase
          .from('profile_greek_life')
          .delete()
          .eq('profile_id', profileId);
          
        const greekLifePayload = profileData.greekLife.map(greekLifeId => ({
          profile_id: profileId,
          greek_life_id: greekLifeId
        }));
        
        await supabase.from('profile_greek_life').insert(greekLifePayload);
      }
      
      toast.success('Profile setup completed!');
      navigate('/alumni-dashboard');
      
    } catch (error: any) {
      console.error('Error setting up profile:', error);
      toast.error(error.message || 'Failed to complete profile setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.BASIC_INFO:
        return (
          <ProfileBasicInfo 
            profileData={profileData}
            updateProfileData={updateProfileData}
            onNext={handleNext}
          />
        );
      case ONBOARDING_STEPS.EDUCATION:
        return (
          <SchoolAndMajor
            profileData={profileData}
            updateProfileData={updateProfileData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case ONBOARDING_STEPS.ACTIVITIES:
        return (
          <ActivitiesSelection
            profileData={profileData}
            updateProfileData={updateProfileData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case ONBOARDING_STEPS.PRICING:
        return (
          <PricingSetup
            profileData={profileData}
            updateProfileData={updateProfileData}
            onSubmit={handleCompleteOnboarding}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.BASIC_INFO:
        return "Basic Information";
      case ONBOARDING_STEPS.EDUCATION:
        return "Education Details";
      case ONBOARDING_STEPS.ACTIVITIES:
        return "Activities & Interests";
      case ONBOARDING_STEPS.PRICING:
        return "Session Pricing";
      default:
        return "Alumni Onboarding";
    }
  };

  return (
    <OnboardingLayout
      title={getStepTitle()}
      subtitle="Complete your alumni profile to get started"
      currentStep={currentStep}
      totalSteps={4}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};

export default AlumniOnboarding;
