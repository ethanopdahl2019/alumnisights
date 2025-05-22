
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
