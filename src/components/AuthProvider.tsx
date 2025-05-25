
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
    // Set up auth state listener
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setSession(session);
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Check admin status whenever the user changes
      if (currentUser) {
        setIsUserAdmin(isAdmin(currentUser));
      } else {
        setIsUserAdmin(false);
      }
      
      setLoading(false);
    });

    // Check for existing session
    getCurrentSession()
      .then(session => {
        setSession(session);
        if (session) {
          return getCurrentUser();
        }
        return null;
      })
      .then(user => {
        setUser(user);
        if (user) {
          setIsUserAdmin(isAdmin(user));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
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
