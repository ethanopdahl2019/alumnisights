
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface AuthRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireAlumni?: boolean;
  redirectTo?: string;
}

const AuthRoute: React.FC<AuthRouteProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireAlumni = false,
  redirectTo = '/auth',
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  
  // Check if the user is an alumni
  const [isAlumni, setIsAlumni] = React.useState<boolean | null>(null);
  const [isChecking, setIsChecking] = React.useState(true);
  
  useEffect(() => {
    const checkAlumniStatus = async () => {
      if (!user) {
        setIsAlumni(false);
        setIsChecking(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        setIsAlumni(data?.role === 'alumni');
      } catch (error) {
        console.error('Error checking alumni status:', error);
        setIsAlumni(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAlumniStatus();
  }, [user]);
  
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Not authenticated
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Requires admin but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/not-authorized" state={{ from: location }} replace />;
  }
  
  // Requires alumni but user is not alumni
  if (requireAlumni && !isAlumni) {
    return <Navigate to="/not-authorized" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default AuthRoute;
