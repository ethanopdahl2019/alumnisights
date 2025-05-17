
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createReview } from '@/services/reviews';
import { supabase } from '@/integrations/supabase/client';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, { message: 'Review must be at least 5 characters' }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  profileId: string;
  mentorName: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ profileId, mentorName, onSuccess }) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });
  
  const rating = form.watch('rating');

  const handleStarClick = (value: number) => {
    form.setValue('rating', value);
  };

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast({ title: 'Error', description: 'You must be logged in to leave a review', variant: 'destructive' });
        return;
      }
      
      // Get user profile for name and image
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, image')
        .eq('user_id', data.user.id)
        .single();
      
      await createReview({
        profile_id: profileId,
        author_id: data.user.id,
        author_name: profileData?.name || 'Anonymous',
        author_image: profileData?.image || null,
        rating: values.rating,
        comment: values.comment,
      });
      
      toast({ title: 'Review submitted', description: `Your review for ${mentorName} has been submitted.` });
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({ 
        title: 'Error submitting review', 
        description: error.message || 'An error occurred while submitting your review',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= (hoveredStar || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your review here..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting || rating === 0}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
