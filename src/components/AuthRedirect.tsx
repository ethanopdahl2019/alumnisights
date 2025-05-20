import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import RoleSelectionDialog from './RoleSelectionDialog';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user, loading, needsRoleSelection, needsProfileCompletion, userRole } = useAuth();
  const [showRoleDialog, setShowRoleDialog] = React.useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Don't redirect if still loading
    if (loading) return;
    
    // If no user, no need to show dialog
    if (!user) return;
    
    // If user needs to select a role, show the dialog
    if (needsRoleSelection) {
      setShowRoleDialog(true);
    }
    // If user needs to complete profile, redirect based on role
    else if (needsProfileCompletion && userRole) {
      if (userRole === 'alumni') {
        navigate('/profile-complete');
      } else if (userRole === 'applicant') {
        navigate('/applicant-profile-complete');
      }
    }
  }, [user, loading, needsRoleSelection, needsProfileCompletion, userRole, navigate]);
  
  const handleCloseDialog = () => {
    setShowRoleDialog(false);
  };
  
  // Show role selection dialog if needed
  if (showRoleDialog && user) {
    return <RoleSelectionDialog isOpen={true} onClose={handleCloseDialog} />;
  }
  
  // Otherwise render children
  return <>{children}</>;
};

export default AuthRedirect;
