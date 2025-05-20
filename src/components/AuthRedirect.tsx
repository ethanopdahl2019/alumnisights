
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import RoleSelectionDialog from './RoleSelectionDialog';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user, loading, needsRoleSelection, needsProfileCompletion, userRole } = useAuth();
  const [showRoleDialog, setShowRoleDialog] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Don't redirect if still loading
    if (loading) return;
    
    // If no user, no need to show dialog
    if (!user) return;
    
    // Don't show dialog if user is already on the role selection page
    if (location.pathname === '/role-selection') return;
    
    // If user needs to select a role and not currently on role selection page, show the dialog
    if (needsRoleSelection) {
      setShowRoleDialog(true);
    }
    // If user needs to complete profile, redirect based on role
    else if (needsProfileCompletion && userRole) {
      if (userRole === 'alumni') {
        navigate('/alumni-profile-complete');
      } else if (userRole === 'applicant') {
        navigate('/applicant-profile-complete');
      }
    }
  }, [user, loading, needsRoleSelection, needsProfileCompletion, userRole, navigate, location.pathname]);
  
  const handleCloseDialog = () => {
    setShowRoleDialog(false);
    // After closing the dialog, if user still needs role, redirect them to role selection page
    if (needsRoleSelection) {
      navigate('/role-selection');
    }
  };
  
  // Show role selection dialog if needed
  if (showRoleDialog && user) {
    return <RoleSelectionDialog isOpen={true} onClose={handleCloseDialog} />;
  }
  
  // Otherwise render children
  return <>{children}</>;
};

export default AuthRedirect;
