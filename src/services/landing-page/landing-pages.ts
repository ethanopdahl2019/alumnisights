
import { supabase } from '@/integrations/supabase/client';
import type { LandingPage } from '@/types/database';

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      template:template_id(*),
      school:school_id(id, name, location, type, image, created_at),
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

  // Patch school.image so it exists, or null if undefined
  return {
    ...data,
    template: data.template ? {
      id: data.template.id,
      name: data.template.name,
      slug: data.template.slug,
      created_at: data.template.created_at
    } : null,
    school: data.school ? { ...data.school, image: data.school.image ?? null } : null,
    content_blocks: data.content_blocks?.map((cb: any) => cb.block) || []
  } as LandingPage;
}

export async function getLandingPageBySchool(schoolId: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      template:template_id(*),
      school:school_id(id, name, location, type, image, created_at),
      major:major_id(*),
      content_blocks:landing_page_blocks(
        block:content_block_id(*)
      )
    `)
    .eq('school_id', schoolId)
    .is('major_id', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    ...data,
    template: data.template ? {
      id: data.template.id,
      name: data.template.name,
      slug: data.template.slug,
      created_at: data.template.created_at
    } : null,
    school: data.school ? { ...data.school, image: data.school.image ?? null } : null,
    content_blocks: data.content_blocks?.map((cb: any) => cb.block) || []
  } as LandingPage;
}

export async function getLandingPageBySchoolAndMajor(schoolId: string, majorId: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      template:template_id(*),
      school:school_id(id, name, location, type, image, created_at),
      major:major_id(*),
      content_blocks:landing_page_blocks(
        block:content_block_id(*)
      )
    `)
    .eq('school_id', schoolId)
    .eq('major_id', majorId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    ...data,
    template: data.template ? {
      id: data.template.id,
      name: data.template.name,
      slug: data.template.slug,
      created_at: data.template.created_at
    } : null,
    school: data.school ? { ...data.school, image: data.school.image ?? null } : null,
    content_blocks: data.content_blocks?.map((cb: any) => cb.block) || []
  } as LandingPage;
}
