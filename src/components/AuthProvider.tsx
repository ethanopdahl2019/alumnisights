
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession, getCurrentUser, onAuthStateChange, isAdmin } from '@/services/auth';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  needsRoleSelection: boolean;
  needsProfileCompletion: boolean;
  userRole: string | null;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  needsRoleSelection: false,
  needsProfileCompletion: false,
  userRole: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check if user has a role or needs to complete their profile
  const checkUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, school_id, major_id')
        .eq('user_id', userId)
        .single();
      
      // If no profile or no role, user needs to select role
      if (!profile || !profile.role) {
        setNeedsRoleSelection(true);
        setNeedsProfileCompletion(false);
      } else {
        setNeedsRoleSelection(false);
        setUserRole(profile.role);
        
        // Check if profile needs completion based on role
        if (profile.role === 'alumni' && (!profile.school_id || !profile.major_id)) {
          setNeedsProfileCompletion(true);
        } else if (profile.role === 'applicant' && (!profile.school_id || !profile.major_id)) {
          setNeedsProfileCompletion(true);
        } else {
          setNeedsProfileCompletion(false);
        }
      }
    } catch (error) {
      console.error("[AuthProvider] Error checking user profile:", error);
      setNeedsRoleSelection(true); // Default to needing role selection if there's an error
    }
  };

  useEffect(() => {
    console.log("[AuthProvider] Setting up auth state listener");
    
    // Set up auth state listener
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log("[AuthProvider] Auth state changed:", event, session?.user?.email);
      console.log("[AuthProvider] User metadata:", session?.user?.user_metadata);
      console.log("[AuthProvider] Event type:", event);
      
      setSession(session);
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Check admin status whenever the user changes
      if (currentUser) {
        const adminStatus = isAdmin(currentUser);
        console.log("[AuthProvider] Admin status:", adminStatus);
        console.log("[AuthProvider] User role:", currentUser.user_metadata?.role);
        console.log("[AuthProvider] User type:", currentUser.user_metadata?.user_type);
        setIsUserAdmin(adminStatus);
        
        // Check if user has role and completed profile
        checkUserProfile(currentUser.id);
      } else {
        setIsUserAdmin(false);
        setNeedsRoleSelection(false);
        setNeedsProfileCompletion(false);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // Check for existing session
    console.log("[AuthProvider] Checking for existing session");
    getCurrentSession()
      .then(session => {
        console.log("[AuthProvider] Got existing session:", session?.user?.email);
        console.log("[AuthProvider] User metadata:", session?.user?.user_metadata);
        setSession(session);
        if (session) {
          return getCurrentUser();
        }
        return null;
      })
      .then(user => {
        console.log("[AuthProvider] Got current user:", user?.email);
        if (user) {
          console.log("[AuthProvider] User metadata:", user.user_metadata);
          setUser(user);
          setIsUserAdmin(isAdmin(user));
          
          // Check if user has role and completed profile
          checkUserProfile(user.id);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("[AuthProvider] Error getting session or user:", error);
        setLoading(false);
      });

    return () => {
      console.log("[AuthProvider] Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isAdmin: isUserAdmin,
      needsRoleSelection,
      needsProfileCompletion,
      userRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
