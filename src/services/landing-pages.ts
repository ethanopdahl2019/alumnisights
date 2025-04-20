
import { supabase } from '@/integrations/supabase/client';
import type { LandingPage, ContentBlock } from '@/types/database';

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      template:landing_page_templates(*),
      school:schools(*),
      major:majors(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching landing page:', error);
    return null;
  }

  // Get content blocks for this landing page
  const { data: contentBlocks, error: contentBlocksError } = await supabase
    .from('content_blocks')
    .select('*')
    .or(`school_id.eq.${data.school_id},major_id.eq.${data.major_id},type.eq.general`)
    .order('order_position');

  if (contentBlocksError) {
    console.error('Error fetching content blocks:', contentBlocksError);
  } else {
    data.content_blocks = contentBlocks;
  }

  return data;
}

export async function getSchoolLandingPages(): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      school:schools(*)
    `)
    .not('school_id', 'is', null)
    .is('major_id', null)
    .order('title');

  if (error) {
    console.error('Error fetching school landing pages:', error);
    return [];
  }

  return data;
}

export async function getMajorLandingPages(): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      major:majors(*)
    `)
    .not('major_id', 'is', null)
    .is('school_id', null)
    .order('title');

  if (error) {
    console.error('Error fetching major landing pages:', error);
    return [];
  }

  return data;
}

export async function getCombinedLandingPages(): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      school:schools(*),
      major:majors(*)
    `)
    .not('school_id', 'is', null)
    .not('major_id', 'is', null)
    .order('title');

  if (error) {
    console.error('Error fetching combined landing pages:', error);
    return [];
  }

  return data;
}

export async function getContentBlocksByType(type: string, id?: string): Promise<ContentBlock[]> {
  let query = supabase
    .from('content_blocks')
    .select('*')
    .eq('type', type)
    .order('order_position');
    
  if (id) {
    if (type === 'school') {
      query = query.eq('school_id', id);
    } else if (type === 'major') {
      query = query.eq('major_id', id);
    }
  }
  
  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${type} content blocks:`, error);
    return [];
  }

  return data;
}
