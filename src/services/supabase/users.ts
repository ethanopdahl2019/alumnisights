
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    role?: string;
    avatar_url?: string;
  };
  profile?: {
    id: string;
    name?: string;
    bio?: string;
    role?: string;
    image?: string;
    school?: {
      name: string;
      location: string;
    };
    major?: {
      name: string;
    };
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  identities?: Array<{
    provider: string;
  }>;
  status?: string;
}

// Fetch all users with their profile information
export async function fetchAllUsers(): Promise<UserWithProfile[]> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("No active session");
    }

    // First get users from the admin-users edge function
    const response = await fetch(
      'https://xvnhujckrivhjnaslanm.supabase.co/functions/v1/admin-users',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch users");
    }

    const userData = await response.json();
    const users = userData.users || [];

    // Fetch profile data for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user: UserWithProfile) => {
        // Get profile data from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select(`
            *,
            school:schools(id, name, location),
            major:majors(id, name)
          `)
          .eq('user_id', user.id)
          .maybeSingle();

        return {
          ...user,
          profile: profileData || null
        };
      })
    );

    return usersWithProfiles;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Failed to load users: " + (error as Error).message);
    return [];
  }
}

// Delete a user
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("No active session");
    }

    // Call the Supabase Edge Function to delete the user
    const response = await fetch(
      'https://xvnhujckrivhjnaslanm.supabase.co/functions/v1/admin-delete-user',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete user");
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Failed to delete user: " + (error as Error).message);
    return false;
  }
}
