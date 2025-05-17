
import React, { useState, useEffect } from 'react';
import ReviewCard from '@/components/ReviewCard';
import { getProfileReviews, Review } from '@/services/reviews';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface MentorReviewsProps {
  profileId: string;
}

const MentorReviews: React.FC<MentorReviewsProps> = ({ profileId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getProfileReviews(profileId);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [profileId]);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 italic">No reviews yet</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(averageRating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-medium">{averageRating.toFixed(1)}</span>
        <span className="text-gray-500">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
      </div>
      
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} delay={index * 0.1} />
        ))}
      </div>
    </div>
  );
};

export default MentorReviews;
