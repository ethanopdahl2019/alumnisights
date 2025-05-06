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
  logo?: string | null;
}): Promise<UniversityContent> {
  console.log("Saving university content for ID:", id, "Content:", content);
  
  try {
    // Since RLS is disabled on the universities_content table, we can proceed without checking session
    // But let's keep minimal auth check to ensure some level of security in the app
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error("No active session found");
      throw new Error("Authentication required");
    }

    // Proceed with the update
    const { data, error } = await supabase
      .from('universities_content')
      .upsert({
        id,
        name: content.name,
        overview: content.overview,
        admission_stats: content.admissionStats,
        application_requirements: content.applicationRequirements,
        alumni_insights: content.alumniInsights || '',
        image: content.image,
        logo: content.logo
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
