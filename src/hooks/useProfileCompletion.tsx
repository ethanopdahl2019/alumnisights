
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export function useProfileCompletion() {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) {
        setIsComplete(false);
        setLoading(false);
        return;
      }
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (!profile) {
          setIsComplete(false);
          setLoading(false);
          return;
        }
        
        // Store the role
        setRole(profile.role);
        
        // Check if profile is complete based on role
        if (profile.role === 'alumni') {
          // Alumni need to have all these fields
          const requiredFields = [
            'school_id',
            'major_id',
            'bio',
            'degree'
          ];
          
          const isProfileComplete = requiredFields.every(field => 
            profile[field] !== null && profile[field] !== undefined
          );
          
          setIsComplete(isProfileComplete);
        } else if (profile.role === 'applicant') {
          // Applicant needs different fields
          const requiredFields = [
            'school_id', // Target school
            'major_id'   // Intended major
          ];
          
          const isProfileComplete = requiredFields.every(field => 
            profile[field] !== null && profile[field] !== undefined
          );
          
          setIsComplete(isProfileComplete);
        } else {
          // If no role is set, profile is incomplete
          setIsComplete(false);
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
        setIsComplete(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkProfileCompletion();
  }, [user]);
  
  return { isComplete, loading, role };
}
