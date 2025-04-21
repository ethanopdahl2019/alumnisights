
import { supabase } from '@/integrations/supabase/client';
import type { Profile, ProfileWithDetails } from '@/types/database';

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
    .limit(3);

  if (error || !Array.isArray(profiles)) {
    console.error('Error fetching featured profiles:', error);
    return [];
  }

  return profiles.map(profile => ({
    ...profile,
    school: {
      ...(profile.school ?? {}),
      image: profile.school?.image ?? null
    },
    activities: profile.activities.map((pa: any) => pa.activities)
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
    `);

  if (error || !Array.isArray(profiles)) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return profiles.map(profile => ({
    ...profile,
    school: {
      ...(profile.school ?? {}),
      image: profile.school?.image ?? null
    },
    activities: profile.activities.map((pa: any) => pa.activities)
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
    .single();

  if (error || !profile) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return {
    ...profile,
    school: {
      ...(profile.school ?? {}),
      image: profile.school?.image ?? null
    },
    activities: profile.activities.map((pa: any) => pa.activities)
  };
}

export async function getSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select('id, name, location, type, image, created_at')
    .order('name');
    
  if (error || !Array.isArray(data)) {
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
    
  if (error || !Array.isArray(data)) {
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
    
  if (error || !Array.isArray(data)) {
    console.error('Error fetching activities:', error);
    return [];
  }
  
  return data;
}

