
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession, getCurrentUser, onAuthStateChange, isAdmin } from '@/services/auth';
import { Session, User } from '@supabase/supabase-js';

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
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email);
      setSession(session);
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Check admin status whenever the user changes
      if (currentUser) {
        const adminStatus = isAdmin(currentUser);
        console.log('Admin status for user:', currentUser.email, adminStatus);
        setIsUserAdmin(adminStatus);
      } else {
        setIsUserAdmin(false);
      }
      
      setLoading(false);
    });

    // Check for existing session
    getCurrentSession()
      .then(session => {
        if (!mounted) return;
        console.log('Initial session check:', session?.user?.email);
        setSession(session);
        if (session) {
          return getCurrentUser();
        }
        return null;
      })
      .then(user => {
        if (!mounted) return;
        setUser(user);
        if (user) {
          const adminStatus = isAdmin(user);
          console.log('Initial admin status for user:', user.email, adminStatus);
          setIsUserAdmin(adminStatus);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (!mounted) return;
        console.error('Auth initialization error:', error);
        setLoading(false);
      });

    return () => {
      mounted = false;
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
