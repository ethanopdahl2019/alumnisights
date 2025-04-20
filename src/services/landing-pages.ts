
import { supabase } from '@/integrations/supabase/client';
import type { LandingPage, LandingPageTemplate, ContentBlock } from '@/types/database';

export async function getLandingPageTemplates(): Promise<LandingPageTemplate[]> {
  const { data, error } = await supabase
    .from('landing_page_templates')
    .select('*');

  if (error) throw error;
  return data;
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      template:template_id(name, slug),
      school:school_id(*),
      major:major_id(*),
      content_blocks:landing_page_blocks(
        block:content_block_id(*)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    ...data,
    content_blocks: data.content_blocks?.map((cb: any) => cb.block)
  };
}

export async function getContentBlocks(schoolId?: string, majorId?: string): Promise<ContentBlock[]> {
  let query = supabase.from('content_blocks').select('*');

  if (schoolId && majorId) {
    query = query.or(`school_id.eq.${schoolId},major_id.eq.${majorId}`);
  } else if (schoolId) {
    query = query.eq('school_id', schoolId);
  } else if (majorId) {
    query = query.eq('major_id', majorId);
  }

  const { data, error } = await query.order('order_position');

  if (error) throw error;
  return data;
}
