
import { supabase } from "@/integrations/supabase/client";

export interface University {
  id: string;
  name: string;
  state: string | null;
  type: string | null;
  order_letter: string;
}

// Fetch universities from Supabase
export async function getUniversities(): Promise<University[]> {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    return [];
  }
}

// Get universities grouped by first letter
export async function getUniversitiesByLetter(): Promise<Record<string, University[]>> {
  const universities = await getUniversities();
  const result: Record<string, University[]> = {};
  
  universities.forEach(university => {
    const letter = university.order_letter;
    if (!result[letter]) {
      result[letter] = [];
    }
    result[letter].push(university);
  });
  
  // Sort each letter group by name
  Object.keys(result).forEach(letter => {
    result[letter].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return result;
}

// Get all unique first letters of university names
export async function getAlphabeticalLetters(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('order_letter')
      .order('order_letter');
      
    if (error) {
      console.error('Error fetching alphabet letters:', error);
      return [];
    }
    
    // Extract unique letters
    const uniqueLetters = [...new Set(data.map(item => item.order_letter))];
    return uniqueLetters;
  } catch (error) {
    console.error('Failed to fetch alphabet letters:', error);
    return [];
  }
}

// Get a single university by ID
export async function getUniversityById(id: string): Promise<University | null> {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching university:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch university:', error);
    return null;
  }
}
