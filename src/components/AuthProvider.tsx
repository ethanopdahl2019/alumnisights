
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession, getCurrentUser, onAuthStateChange, isAdmin } from '@/services/auth';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

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
      
      // Show toast notifications for sign in/out events
      if (event === 'SIGNED_IN') {
        toast.success(`Welcome, ${currentUser?.user_metadata?.first_name || currentUser?.email || 'User'}!`);
      } else if (event === 'SIGNED_OUT') {
        toast.success('You have been signed out');
      } else if (event === 'USER_UPDATED') {
        toast.success('Your profile has been updated');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Password reset initiated');
      }
      
      // Check admin status whenever the user changes
      if (currentUser) {
        const adminStatus = isAdmin(currentUser);
        console.log("[AuthProvider] Admin status:", adminStatus);
        console.log("[AuthProvider] User role:", currentUser.user_metadata?.role);
        console.log("[AuthProvider] User type:", currentUser.user_metadata?.user_type);
        setIsUserAdmin(adminStatus);
      } else {
        setIsUserAdmin(false);
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
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("[AuthProvider] Error getting session or user:", error);
        toast.error("Error connecting to authentication service");
        setLoading(false);
      });

    return () => {
      console.log("[AuthProvider] Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading, isAdmin: isUserAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
