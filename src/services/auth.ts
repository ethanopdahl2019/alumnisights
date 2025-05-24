
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  metadata?: Record<string, any>;
}

interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, firstName, lastName, metadata }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        ...metadata
      }
    }
  });

  if (error) throw error;

  // Create profile after successful signup
  if (data.user) {
    const profileData: any = {
      user_id: data.user.id,
      name: `${firstName} ${lastName}`,
      role: metadata?.role || 'student',
      visible: true,
      major_id: metadata?.major_id || null,
    };

    // Use university_id for new profiles, fallback to school_id for backward compatibility
    if (metadata?.university_id) {
      profileData.university_id = metadata.university_id;
      profileData.school_id = null;
    } else if (metadata?.school_id) {
      profileData.school_id = metadata.school_id;
      profileData.university_id = null;
    } else {
      profileData.school_id = null;
      profileData.university_id = null;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profileData);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }
  }

  return { data, error };
}

export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export function isAdmin(user: User): boolean {
  return user?.user_metadata?.role === 'admin';
}

export function isMentor(user: User): boolean {
  return user?.user_metadata?.role === 'mentor';
}

export function isStudent(user: User): boolean {
  return user?.user_metadata?.role === 'student' || !user?.user_metadata?.role;
}

export async function refreshAndCheckAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  return user ? isAdmin(user) : false;
}
