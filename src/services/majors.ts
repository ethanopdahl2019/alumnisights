import { supabase } from "@/integrations/supabase/client";

export interface Major {
  id: string;
  name: string;
  category: string | null;
}

// Expanded list of common majors
const commonMajors = [
  // STEM
  { name: "Computer Science", category: "STEM" },
  { name: "Engineering", category: "STEM" },
  { name: "Mathematics", category: "STEM" },
  { name: "Physics", category: "STEM" },
  { name: "Chemistry", category: "STEM" },
  { name: "Biology", category: "STEM" },
  { name: "Biomedical Engineering", category: "STEM" },
  { name: "Electrical Engineering", category: "STEM" },
  { name: "Mechanical Engineering", category: "STEM" },
  { name: "Civil Engineering", category: "STEM" },
  { name: "Chemical Engineering", category: "STEM" },
  { name: "Data Science", category: "STEM" },
  { name: "Information Technology", category: "STEM" },
  { name: "Cybersecurity", category: "STEM" },
  
  // Business
  { name: "Business Administration", category: "Business" },
  { name: "Finance", category: "Business" },
  { name: "Marketing", category: "Business" },
  { name: "Economics", category: "Business" },
  { name: "Accounting", category: "Business" },
  { name: "International Business", category: "Business" },
  { name: "Entrepreneurship", category: "Business" },
  { name: "Supply Chain Management", category: "Business" },
  
  // Liberal Arts
  { name: "English", category: "Liberal Arts" },
  { name: "History", category: "Liberal Arts" },
  { name: "Philosophy", category: "Liberal Arts" },
  { name: "Political Science", category: "Liberal Arts" },
  { name: "Psychology", category: "Liberal Arts" },
  { name: "Sociology", category: "Liberal Arts" },
  { name: "Anthropology", category: "Liberal Arts" },
  { name: "International Relations", category: "Liberal Arts" },
  { name: "Communications", category: "Liberal Arts" },
  { name: "Journalism", category: "Liberal Arts" },
  
  // Arts
  { name: "Art", category: "Arts" },
  { name: "Music", category: "Arts" },
  { name: "Theater", category: "Arts" },
  { name: "Film Studies", category: "Arts" },
  { name: "Graphic Design", category: "Arts" },
  { name: "Fine Arts", category: "Arts" },
  
  // Health Sciences
  { name: "Pre-Med", category: "Health Sciences" },
  { name: "Nursing", category: "Health Sciences" },
  { name: "Public Health", category: "Health Sciences" },
  { name: "Kinesiology", category: "Health Sciences" },
  { name: "Physical Therapy", category: "Health Sciences" },
  { name: "Occupational Therapy", category: "Health Sciences" },
  
  // Education
  { name: "Education", category: "Education" },
  { name: "Elementary Education", category: "Education" },
  { name: "Secondary Education", category: "Education" },
  { name: "Special Education", category: "Education" },
  
  // Other
  { name: "Environmental Science", category: "Other" },
  { name: "Criminal Justice", category: "Other" },
  { name: "Social Work", category: "Other" },
  { name: "Architecture", category: "Other" },
  { name: "Urban Planning", category: "Other" },
  { name: "Undecided", category: "Other" }
];

// Fetch all majors from Supabase, with fallback to common majors
export async function getMajors(): Promise<Major[]> {
  try {
    const { data, error } = await supabase
      .from('majors')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching majors:', error);
      // Return common majors as fallback
      return commonMajors.map((major, index) => ({
        id: `common-${index}`,
        ...major
      }));
    }
    
    // If we have data from Supabase, use it; otherwise use common majors
    if (data && data.length > 0) {
      return data;
    } else {
      return commonMajors.map((major, index) => ({
        id: `common-${index}`,
        ...major
      }));
    }
  } catch (error) {
    console.error('Failed to fetch majors:', error);
    // Return common majors as fallback
    return commonMajors.map((major, index) => ({
      id: `common-${index}`,
      ...major
    }));
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
      // Fallback to searching common majors
      const filtered = commonMajors
        .filter(major => major.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10);
      return filtered.map((major, index) => ({
        id: `common-${index}`,
        ...major
      }));
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to search majors:', error);
    // Fallback to searching common majors
    const filtered = commonMajors
      .filter(major => major.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
    return filtered.map((major, index) => ({
      id: `common-${index}`,
      ...major
    }));
  }
}
