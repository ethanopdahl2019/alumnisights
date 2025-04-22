import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession, getCurrentUser, onAuthStateChange } from '@/services/auth';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check user role and redirect if needed
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
          
        if (profile?.role === 'alumni') {
          window.location.pathname === '/applicant-dashboard' && navigate('/alumni-dashboard');
        } else {
          window.location.pathname === '/alumni-dashboard' && navigate('/applicant-dashboard');
        }
      }
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
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
