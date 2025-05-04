
import { supabase } from '@/integrations/supabase/client';
import type { UniversityContent } from '@/types/database';

export async function getUniversityContent(id: string): Promise<UniversityContent | null> {
  console.log("Fetching university content for ID:", id);
  
  try {
    const { data, error } = await supabase
      .from('universities_content')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching university content:", error);
      throw error;
    }
    
    console.log("Retrieved university content:", data);
    return data as unknown as UniversityContent;
  } catch (error) {
    console.error("Exception fetching university content:", error);
    throw error;
  }
}

export async function saveUniversityContent(id: string, content: {
  name: string;
  overview: string;
  admissionStats: string;
  applicationRequirements: string;
  alumniInsights?: string;
  image?: string | null;
}): Promise<UniversityContent> {
  console.log("Saving university content for ID:", id, "Content:", content);
  
  try {
    // Check if current user session exists and has admin role
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No active session found");
      throw new Error("Authentication required");
    }
    
    // Get role directly from user metadata in the session
    const userRole = session.user.user_metadata?.role;
    console.log("User role from metadata:", userRole);
    
    if (userRole !== 'admin') {
      console.error("User doesn't have admin role");
      throw new Error("Permission denied: Admin role required");
    }
    
    // Then proceed with the update
    const { data, error } = await supabase
      .from('universities_content')
      .upsert({
        id,
        name: content.name,
        overview: content.overview,
        admission_stats: content.admissionStats,
        application_requirements: content.applicationRequirements,
        alumni_insights: content.alumniInsights || '',
        image: content.image
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving university content:", error);
      throw error;
    }
    
    console.log("University content saved successfully:", data);
    return data as unknown as UniversityContent;
  } catch (error) {
    console.error("Exception saving university content:", error);
    throw error;
  }
}
