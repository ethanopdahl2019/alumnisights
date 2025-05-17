
import { supabase } from '@/integrations/supabase/client';

export type SiteImageCategory = 'campus' | 'students' | 'alumni' | 'events' | 'academic' | 'profile';

export interface SiteImage {
  id: string;
  url: string;
  alt_text?: string;
  caption?: string;
  category: SiteImageCategory;
}

export async function getSiteImages(category?: SiteImageCategory): Promise<SiteImage[]> {
  let query = supabase.from('site_images').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching images:', error);
    return [];
  }
  
  return data as SiteImage[];
}

export async function getRandomImage(category: SiteImageCategory): Promise<SiteImage | null> {
  const { data, error } = await supabase
    .from('site_images')
    .select('*')
    .eq('category', category)
    .limit(1)
    .single();
  
  if (error || !data) {
    console.error('Error fetching random image:', error);
    return null;
  }
  
  return data as SiteImage;
}
