
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import RoleSelectionDialog from '@/components/RoleSelectionDialog';
import { supabase } from '@/integrations/supabase/client';

const RoleSelection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // If user is logged in, check if they already have a role
    if (user) {
      const checkUserRole = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        // If user already has a role, redirect to the appropriate page
        if (data?.role) {
          if (data.role === 'alumni') {
            navigate('/alumni-dashboard');
          } else if (data.role === 'applicant') {
            navigate('/applicant-dashboard');
          } else {
            navigate('/');
          }
        }
      };

      checkUserRole();
    }
  }, [user, loading, navigate]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <RoleSelectionDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
};

export default RoleSelection;
