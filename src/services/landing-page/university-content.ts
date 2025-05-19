
import { supabase } from '@/integrations/supabase/client';
import type { UniversityContent } from '@/types/database';

export async function getUniversityContent(id: string): Promise<UniversityContent | null> {
  try {
    console.log("Fetching content for university ID:", id);
    const { data, error } = await supabase
      .from('universities_content')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching university content:', error);
      return null;
    }
    
    console.log("University content fetched:", data);
    return data;
  } catch (error) {
    console.error('Error fetching university content:', error);
    return null;
  }
}

export async function getUniversityLogo(id: string): Promise<string | null> {
  try {
    console.log("Fetching logo for university ID:", id);
    const { data, error } = await supabase
      .from('universities_content')
      .select('logo')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.info('No logo found for university:', id);
      return null;
    }
    
    return data.logo;
  } catch (error) {
    console.error('Error fetching university logo:', error);
    return null;
  }
}

export async function saveUniversityContent(id: string, content: {
  name: string;
  overview?: string;
  admissionStats?: string;
  applicationRequirements?: string;
  alumniInsights?: string;
  didYouKnow?: string;
  image?: string | null;
  logo?: string | null;
}): Promise<UniversityContent | null> {
  try {
    console.log("Saving university content:", content);
    
    // Log image/logo URLs for debugging
    console.log("Image URL to save:", content.image);
    console.log("Logo URL to save:", content.logo);
    
    const { data, error } = await supabase
      .from('universities_content')
      .upsert({
        id,
        name: content.name,
        overview: content.overview || null,
        admission_stats: content.admissionStats || null,
        application_requirements: content.applicationRequirements || null,
        alumni_insights: content.alumniInsights || null,
        did_you_know: content.didYouKnow || null,
        image: content.image || null,
        logo: content.logo || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving university content:', error);
      throw error;
    }
    
    console.log("University content saved successfully:", data);
    return data;
  } catch (error) {
    console.error('Error saving university content:', error);
    throw error;
  }
}
