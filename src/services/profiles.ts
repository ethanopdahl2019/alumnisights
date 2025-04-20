
import { supabase } from '@/integrations/supabase/client';
import type { Profile, ProfileWithDetails } from '@/types/database';

export async function getFeaturedProfiles(): Promise<ProfileWithDetails[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      *,
      school:schools(*),
      major:majors(*),
      activities:profile_activities(activities(*))
    `)
    .eq('featured', true)
    .limit(3);

  if (error) {
    console.error('Error fetching featured profiles:', error);
    return [];
  }

  return profiles.map(profile => ({
    ...profile,
    activities: profile.activities.map((pa: any) => pa.activities)
  }));
}

export async function getAllProfiles(): Promise<ProfileWithDetails[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      *,
      school:schools(*),
      major:majors(*),
      activities:profile_activities(activities(*))
    `);

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return profiles.map(profile => ({
    ...profile,
    activities: profile.activities.map((pa: any) => pa.activities)
  }));
}

export async function getProfileById(id: string): Promise<ProfileWithDetails | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      school:schools(*),
      major:majors(*),
      activities:profile_activities(activities(*))
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return {
    ...profile,
    activities: profile.activities.map((pa: any) => pa.activities)
  };
}
