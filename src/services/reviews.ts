
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  profile_id: string;
  author_id: string;
  author_name: string;
  author_image?: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export async function getProfileReviews(profileId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return data || [];
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }

  return data;
}

export async function getUserReviews(): Promise<Review[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('author_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }

  return data || [];
}

export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}
