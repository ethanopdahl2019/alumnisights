
import { supabase } from '@/integrations/supabase/client';
import { UserCredentials } from '@/types/database';

// Create type for sign up parameters
type SignUpParams = {
  email: string;
  password: string;
  options?: {
    data?: Record<string, any>;
    redirectTo?: string;
  };
};

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
  console.log("[auth.ts] User role:", data.user?.user_metadata?.role);
  console.log("[auth.ts] User type:", data.user?.user_metadata?.user_type);
  return data;
}

export async function signUp({ email, password, options }: SignUpParams) {
  console.log("[auth.ts] Starting signup process for:", email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options
  });

  if (error) {
    console.error("[auth.ts] Signup error:", error);
    throw error;
  }

  console.log("[auth.ts] Signup successful for:", email);
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
  console.log("[auth.ts] User metadata for mentor check:", user?.user_metadata);
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

export async function refreshAndCheckAdmin(user: any) {
  console.log("[auth.ts] Checking if user is admin:", user?.email);
  
  // First check if the user has the admin role in user_metadata
  if (isAdmin(user)) {
    console.log("[auth.ts] User has admin role in metadata:", true);
    return true;
  }
  
  // If not found in metadata, check for admin role in the database (profiles table)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error("[auth.ts] Error checking admin status in database:", error);
      throw error;
    }
    
    const hasAdminRole = data?.role === 'admin';
    console.log("[auth.ts] User has admin role in database:", hasAdminRole);
    
    // If admin in database but not in metadata, update the metadata
    if (hasAdminRole && !isAdmin(user)) {
      console.log("[auth.ts] Updating user metadata with admin role");
      await updateUserMetadata({ role: 'admin' });
    }
    
    return hasAdminRole;
  } catch (error) {
    console.error("[auth.ts] Error in refreshAndCheckAdmin:", error);
    return false;
  }
}
