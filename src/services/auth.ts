
import { supabase } from '@/integrations/supabase/client';
import { UserCredentials, UserRegistration } from '@/types/database';

export async function signUp({ email, password, firstName, lastName, metadata = {} }: UserRegistration) {
  console.log("[auth.ts] Starting signup process with metadata:", metadata);
  
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
    console.error("[auth.ts] Signup error:", error);
    throw error;
  }

  console.log("[auth.ts] Signup successful:", data);
  return data;
}

export async function signIn({ email, password }: UserCredentials) {
  console.log("[auth.ts] Starting signin process for:", email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("[auth.ts] Signin error:", error);
    throw error;
  }

  console.log("[auth.ts] Signin successful for:", email);
  console.log("[auth.ts] User metadata:", data.user?.user_metadata);
  return data;
}

export async function signOut() {
  console.log("[auth.ts] Signing out user");
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("[auth.ts] Signout error:", error);
    throw error;
  }
  
  console.log("[auth.ts] Signout successful");
  return true;
}

export async function getCurrentSession() {
  console.log("[auth.ts] Getting current session");
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("[auth.ts] Error getting session:", error);
    throw error;
  }
  
  console.log("[auth.ts] Session retrieved:", data.session?.user?.email || "No active session");
  return data.session;
}

export async function getCurrentUser() {
  console.log("[auth.ts] Getting current user");
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("[auth.ts] Error getting user:", error);
    throw error;
  }
  
  console.log("[auth.ts] User retrieved:", data.user?.email || "No user found");
  return data.user;
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  console.log("[auth.ts] Setting up auth state change listener");
  return supabase.auth.onAuthStateChange(callback);
}

export function getUserRole(user: any) {
  if (!user) return null;
  const role = user.user_metadata?.role || null;
  console.log("[auth.ts] Getting user role:", role);
  return role;
}

export function isStudent(user: any) {
  const result = getUserRole(user) === 'student' || getUserRole(user) === 'applicant';
  console.log("[auth.ts] isStudent check:", result);
  return result;
}

export function isMentor(user: any) {
  const result = getUserRole(user) === 'mentor' || getUserRole(user) === 'alumni';
  console.log("[auth.ts] isMentor check:", result);
  return result;
}

export function isAdmin(user: any) {
  // Check if user has admin role in user_metadata
  const result = getUserRole(user) === 'admin';
  console.log("[auth.ts] isAdmin check:", result);
  return result;
}

export async function updateUserMetadata(metadata: Record<string, any>) {
  console.log("[auth.ts] Updating user metadata:", metadata);
  const { data, error } = await supabase.auth.updateUser({
    data: metadata
  });
  
  if (error) {
    console.error("[auth.ts] Error updating user metadata:", error);
    throw error;
  }
  
  console.log("[auth.ts] User metadata updated successfully");
  return data;
}

// Enhanced function to check admin status using both metadata and database function
export async function refreshAndCheckAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  
  console.log("[auth.ts] Checking admin status for:", user?.email);
  
  // First check if user already has admin role in metadata
  if (getUserRole(user) === 'admin') {
    // Double check with the database function for extra security
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('[auth.ts] Error calling is_admin function:', error);
        // Fall back to metadata-based check
        return getUserRole(user) === 'admin';
      }
      console.log("[auth.ts] Database is_admin check result:", data);
      return !!data; // Convert to boolean
    } catch (error) {
      console.error('[auth.ts] Error checking admin status via RPC:', error);
      // Fall back to metadata-based check
      return getUserRole(user) === 'admin';
    }
  }
  
  // If not found in metadata, refresh the user data
  try {
    console.log("[auth.ts] Admin role not found in metadata, refreshing session");
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('[auth.ts] Error refreshing session:', error);
      return false;
    }
    
    const refreshedUser = data.user;
    console.log("[auth.ts] Session refreshed, checking admin status again");
    return getUserRole(refreshedUser) === 'admin';
  } catch (error) {
    console.error('[auth.ts] Error checking admin status:', error);
    return false;
  }
}
