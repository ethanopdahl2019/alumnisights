
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { OnboardingData } from '@/types/onboarding';
import { addProfileSports, addProfileClubs, addProfileGreekLife } from '@/services/activities';

const ProfileComplete = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show the onboarding modal when the component mounts
    if (user) {
      setIsModalOpen(true);
    } else {
      // If no user, redirect to auth page
      navigate('/auth');
    }
  }, [user, navigate]);
  
  const getUserRole = () => {
    return user?.user_metadata?.role || 'applicant';
  };
  
  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to complete your profile.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    try {
      const userRole = getUserRole();
      
      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
          school_id: data.schoolId,
          major_id: data.majorId,
          bio: data.bio || null,
          degree: data.degree || null,
          role: userRole,
          price_15_min: data.pricing?.price_15_min || null,
          price_30_min: data.pricing?.price_30_min || null,
          price_60_min: data.pricing?.price_60_min || null,
        })
        .select('id')
        .single();
      
      if (profileError) throw profileError;
      
      // Add sports, clubs, and Greek life if selected
      const promises = [];
      
      if (data.sports?.length) {
        promises.push(addProfileSports(profileData.id, data.sports));
      }
      
      if (data.clubs?.length) {
        promises.push(addProfileClubs(profileData.id, data.clubs));
      }
      
      if (data.greekLife?.length) {
        promises.push(addProfileGreekLife(profileData.id, data.greekLife));
      }
      
      // Wait for all promises to resolve
      if (promises.length) {
        await Promise.all(promises);
      }
      
      toast({
        title: "Profile complete!",
        description: "Your profile has been set up successfully.",
      });
      
      // Redirect based on user role
      if (userRole === 'alumni') {
        navigate('/alumni-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <OnboardingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleOnboardingComplete}
        userType={user?.user_metadata?.role as 'applicant' | 'alumni'}
      />
      
      {/* Minimal UI for when the modal is closed */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Setting Up Your Profile</h1>
          <p className="text-gray-600 mb-4">
            Please complete the onboarding process to set up your profile.
          </p>
          {!isModalOpen && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Setup
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileComplete;
