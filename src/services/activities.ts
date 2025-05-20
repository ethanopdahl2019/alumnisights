
import { supabase } from '@/integrations/supabase/client';
import { Sport, Club, GreekLife } from '@/types/onboarding';

export async function getSports(): Promise<Sport[]> {
  const { data, error } = await supabase
    .from('sports')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching sports:', error);
    return [];
  }
  
  return data;
}

export async function getClubs(): Promise<Club[]> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching clubs:', error);
    return [];
  }
  
  return data;
}

export async function getGreekLife(): Promise<GreekLife[]> {
  const { data, error } = await supabase
    .from('greek_life')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching greek life organizations:', error);
    return [];
  }
  
  return data;
}

export async function addProfileSports(profileId: string, sportIds: string[]): Promise<boolean> {
  const sportEntries = sportIds.map(sportId => ({
    profile_id: profileId,
    sport_id: sportId
  }));

  const { error } = await supabase
    .from('profile_sports')
    .insert(sportEntries);

  if (error) {
    console.error('Error adding profile sports:', error);
    return false;
  }
  
  return true;
}

export async function addProfileClubs(profileId: string, clubIds: string[]): Promise<boolean> {
  const clubEntries = clubIds.map(clubId => ({
    profile_id: profileId,
    club_id: clubId
  }));

  const { error } = await supabase
    .from('profile_clubs')
    .insert(clubEntries);

  if (error) {
    console.error('Error adding profile clubs:', error);
    return false;
  }
  
  return true;
}

export async function addProfileGreekLife(profileId: string, greekLifeIds: string[]): Promise<boolean> {
  const greekLifeEntries = greekLifeIds.map(greekLifeId => ({
    profile_id: profileId,
    greek_life_id: greekLifeId
  }));

  const { error } = await supabase
    .from('profile_greek_life')
    .insert(greekLifeEntries);

  if (error) {
    console.error('Error adding profile greek life:', error);
    return false;
  }
  
  return true;
}
