
import { supabase } from '@/integrations/supabase/client';
import type { LandingPage, LandingPageTemplate, ContentBlock, School, UniversityContent } from '@/types/database';

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

// Updated functions for university content management
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
    // First check if current user has admin role from metadata
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.user_metadata?.role !== 'admin') {
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
