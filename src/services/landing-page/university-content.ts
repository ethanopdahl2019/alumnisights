
import { supabase } from '@/integrations/supabase/client';
import type { UniversityContent } from '@/types/database';

export async function getUniversityContent(id: string): Promise<UniversityContent | null> {
  try {
    const { data, error } = await supabase
      .from('universities_content')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching university content:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching university content:', error);
    return null;
  }
}

export async function getUniversityLogo(id: string): Promise<string | null> {
  try {
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
