
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    author_name: string;
    author_image?: string | null;
    created_at: string;
  };
  delay?: number;
}

const ReviewCard = ({ review, delay = 0 }: ReviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={review.author_image || "/placeholder.svg"} 
              alt={review.author_name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="font-medium">{review.author_name}</h4>
              <span className="text-sm text-gray-500">
                • {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            
            <p className="text-gray-700">{review.comment}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReviewCard;
