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

  // Create either applicant or alumni record based on user type
  if (data.user) {
    try {
      const userType = metadata.user_type || 'student';
      const userId = data.user.id;
      
      if (userType === 'mentor') {
        // Create alumni record
        const { error: alumniError } = await supabase.from('alumni').insert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          school_id: metadata.school_id || null,
          major_id: metadata.major_id || null,
          degree: metadata.degree || null
        });
        
        if (alumniError) throw alumniError;
      } else {
        // Create applicant record
        const { error: applicantError } = await supabase.from('applicants').insert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          school_id: metadata.school_id || null,
          major_id: metadata.major_id || null,
          degree: metadata.degree || null
        });
        
        if (applicantError) throw applicantError;
      }
    } catch (dbError) {
      console.error('Error creating user record:', dbError);
      // Proceed anyway since the auth record was created
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
