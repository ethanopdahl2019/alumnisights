
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample testimonial data for the landing page
const testimonials = [
  {
    id: '1',
    author_name: 'Sarah Johnson',
    rating: 5,
    comment: "My mentor gave me incredible insights about Duke's basketball program that I couldn't find anywhere else. Their advice on the application process was invaluable.",
  },
  {
    id: '2',
    author_name: 'Michael Chang',
    rating: 5,
    comment: "I was on the fence about which school to choose, but after speaking with an alumni mentor, I had a much clearer picture of the culture and opportunities.",
  },
  {
    id: '3',
    author_name: 'Leila Rodriguez',
    rating: 4,
    comment: "The perspective I gained from my mentor chat helped me craft an application that truly stood out. They shared experiences that no guidebook could provide.",
  }
];

const TestimonialCard: React.FC<{
  author: string;
  rating: number;
  comment: string;
  delay: number;
}> = ({ author, rating, comment, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-700 mb-4 italic">"{comment}"</p>
          <p className="text-sm font-medium">— {author}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            What Our Students Say
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Hear from students who have found their perfect college match through conversations with our mentors.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              author={testimonial.author_name}
              rating={testimonial.rating}
              comment={testimonial.comment}
              delay={index * 0.1 + 0.3}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
