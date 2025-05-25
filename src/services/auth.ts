
import { supabase } from '@/integrations/supabase/client';
import { UserCredentials, UserRegistration } from '@/types/database';

export async function signUp({ email, password, firstName, lastName, metadata = {} }: UserRegistration) {
  // Set default role if not provided
  if (!metadata.role) {
    metadata.role = 'student';
  }
  
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

  if (error) {
    throw error;
  }

  // If signup successful and we have required data, create the profile
  if (data.user && metadata.school_id && metadata.major_id) {
    try {
      // Create a profile immediately after successful sign up
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          name: `${firstName} ${lastName}`,
          school_id: metadata.school_id,
          major_id: metadata.major_id,
          visible: true
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't throw here, as the user was already created
      }
    } catch (profileError) {
      console.error('Failed to create profile:', profileError);
    }
  }

  return data;
}

export async function signIn({ email, password }: UserCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }
  
  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    throw error;
  }
  
  return data.user;
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export function getUserRole(user: any) {
  if (!user) return null;
  return user.user_metadata?.role || null;
}

export function isStudent(user: any) {
  const role = getUserRole(user);
  return role === 'student' || role === 'applicant';
}

export function isMentor(user: any) {
  const role = getUserRole(user);
  return role === 'mentor' || role === 'alumni';
}

export function isAdmin(user: any) {
  // Check if user has admin role in user_metadata
  const role = getUserRole(user);
  return role === 'admin';
}

export async function updateUserMetadata(metadata: Record<string, any>) {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Simplified admin check that doesn't rely on the database function
export async function refreshAndCheckAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  
  // Check if user already has admin role in metadata
  if (getUserRole(user) === 'admin') {
    return true;
  }
  
  // If not found in metadata, refresh the user data
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
    
    const refreshedUser = data.user;
    return getUserRole(refreshedUser) === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
