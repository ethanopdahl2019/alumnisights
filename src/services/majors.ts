import { supabase } from "@/integrations/supabase/client";

export interface Major {
  id: string;
  name: string;
  category: string | null;
}

// Fetch all majors from Supabase
export async function getMajors(): Promise<Major[]> {
  try {
    const { data, error } = await supabase
      .from('majors')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching majors:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch majors:', error);
    return [];
  }
}

// Get major by ID
export async function getMajorById(id: string): Promise<Major | null> {
  try {
    const { data, error } = await supabase
      .from('majors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching major:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch major:', error);
    return null;
  }
}

// Search majors by name
export async function searchMajors(query: string): Promise<Major[]> {
  try {
    const { data, error } = await supabase
      .from('majors')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(10);
      
    if (error) {
      console.error('Error searching majors:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to search majors:', error);
    return [];
  }
}

