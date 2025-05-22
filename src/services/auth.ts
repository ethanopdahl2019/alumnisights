
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SignInParams {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: SignInParams) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.user_metadata?.role === 'admin';
};

// Add this function to replace refreshAndCheckAdmin
export const refreshAndCheckAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // Get fresh session data
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user;
    
    if (!currentUser) return false;
    
    return isAdmin(currentUser);
  } catch (error) {
    console.error("Error refreshing admin status:", error);
    return false;
  }
};
