
import { supabase } from '@/integrations/supabase/client';
import type { Profile, ProfileWithDetails, School } from '@/types/database';

// Helper function to parse social links
const parseSocialLinks = (socialLinks: any): Record<string, any> | null => {
  if (!socialLinks) return null;
  
  // If it's already an object, return it
  if (typeof socialLinks === 'object' && !Array.isArray(socialLinks)) {
    return socialLinks;
  }
  
  // If it's a string, try to parse it
  if (typeof socialLinks === 'string') {
    try {
      return JSON.parse(socialLinks);
    } catch (error) {
      console.error('Error parsing social links:', error);
      return null;
    }
  }
  
  return null;
};

// Add image when projecting schools
export async function getFeaturedProfiles(): Promise<ProfileWithDetails[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      *,
      school:schools(id, name, location, type, image, created_at),
      major:majors(*),
      activities:profile_activities(activities(*))
    `)
    .eq('featured', true)
    .eq('visible', true) // Only get visible profiles
    .limit(3);

  if (error) {
    console.error('Error fetching featured profiles:', error);
    return [];
  }

  return profiles.map(profile => ({
    ...profile,
    school: {
      ...profile.school,
      image: profile.school?.image ?? null
    },
    activities: profile.activities.map((pa: any) => pa.activities),
    role: profile.role as 'applicant' | 'alumni' | 'mentor',
    social_links: parseSocialLinks(profile.social_links)
  }));
}

export async function getAllProfiles(): Promise<ProfileWithDetails[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      *,
      school:schools(id, name, location, type, image, created_at),
      major:majors(*),
      activities:profile_activities(activities(*))
    `)
    .eq('visible', true); // Only get visible profiles

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return profiles.map(profile => ({
    ...profile,
    school: {
      ...profile.school,
      image: profile.school?.image ?? null
    },
    activities: profile.activities.map((pa: any) => pa.activities),
    role: profile.role as 'applicant' | 'alumni' | 'mentor',
    social_links: parseSocialLinks(profile.social_links)
  }));
}

export async function getProfileById(id: string): Promise<ProfileWithDetails | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      school:schools(id, name, location, type, image, created_at),
      major:majors(*),
      activities:profile_activities(activities(*))
    `)
    .eq('id', id)
    .maybeSingle(); // more reliable than .single()

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  if (!profile) return null;

  return {
    ...profile,
    school: {
      ...profile.school,
      image: profile.school?.image ?? null
    },
    activities: profile.activities.map((pa: any) => pa.activities),
    role: profile.role as 'applicant' | 'alumni' | 'mentor',
    social_links: parseSocialLinks(profile.social_links)
  };
}

export async function getSchools(): Promise<School[]> {
  const { data, error } = await supabase
    .from('schools')
    .select('id, name, location, type, image, created_at')
    .order('name');
    
  if (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
  
  // Add a fallback for missing images
  return data.map((school: any) => ({
    ...school,
    image: school.image ?? null
  }));
}

export async function getMajors() {
  const { data, error } = await supabase
    .from('majors')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching majors:', error);
    return [];
  }
  
  return data;
}

export async function getActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
  
  return data;
}
