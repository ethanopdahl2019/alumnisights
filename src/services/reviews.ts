
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
  // In a real implementation, this would fetch from the reviews table in Supabase
  // For now, we're returning mock data in the component
  return [];
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> {
  // This would create a new review in the database
  // Will be implemented when the reviews table is created
  return null;
}
