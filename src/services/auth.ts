
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

  // If signup successful and user is a mentor or alumni, create the profile
  if (data.user && (metadata.role === 'mentor' || metadata.role === 'alumni') && metadata.school_id && metadata.major_id) {
    try {
      // Create a profile immediately after successful sign up
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,  // Use 'id' instead of 'user_id'
          name: `${firstName} ${lastName}`,
          school_id: metadata.school_id,
          major_id: metadata.major_id,
          role: metadata.role,
          visible: true
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't throw here, as the user was already created
      }
    } catch (profileError) {
      console.error('Failed to create profile:', profileError);
    }
  } else if (data.user) {
    // For students, just create a basic profile without school/major info
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,  // Use 'id' instead of 'user_id'
          name: `${firstName} ${lastName}`,
          role: 'applicant',
          visible: true,
          // Add null values for required fields
          school_id: null,
          major_id: null
        });

      if (profileError) {
        console.error('Error creating basic profile:', profileError);
      }
    } catch (profileError) {
      console.error('Failed to create basic profile:', profileError);
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
  return getUserRole(user) === 'student' || getUserRole(user) === 'applicant';
}

export function isMentor(user: any) {
  return getUserRole(user) === 'mentor' || getUserRole(user) === 'alumni';
}

export function isAdmin(user: any) {
  // Check if user has admin role in user_metadata
  return getUserRole(user) === 'admin';
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

// Enhanced function to check admin status using both metadata and database function
export async function refreshAndCheckAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  
  // First check if user already has admin role in metadata
  if (getUserRole(user) === 'admin') {
    // Double check with the database function for extra security
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('Error calling is_admin function:', error);
        // Fall back to metadata-based check
        return getUserRole(user) === 'admin';
      }
      return !!data; // Convert to boolean
    } catch (error) {
      console.error('Error checking admin status via RPC:', error);
      // Fall back to metadata-based check
      return getUserRole(user) === 'admin';
    }
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
