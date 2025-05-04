
import { supabase } from '@/integrations/supabase/client';
import type { ContentBlock } from '@/types/database';

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
