
import { supabase } from '@/integrations/supabase/client';
import type { LandingPageTemplate } from '@/types/database';

export async function getLandingPageTemplates(): Promise<LandingPageTemplate[]> {
  const { data, error } = await supabase
    .from('landing_page_templates')
    .select('*');

  if (error) throw error;
  return data;
}
