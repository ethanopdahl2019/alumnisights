
import React from 'react';
import { Star } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';

const testimonials = [
  {
    id: "1",
    rating: 5,
    comment: "My call with Emma gave me insights into Harvard that I couldn't find anywhere else. She was honest about the challenges and opportunities, which helped me make my decision.",
    author_name: "Michael R.",
    author_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    created_at: "2024-04-15T12:00:00Z"
  },
  {
    id: "2",
    rating: 5,
    comment: "As a first-generation college student, I had so many questions about Stanford. Marcus helped me understand the application process and gave me tips that definitely strengthened my application.",
    author_name: "Sarah L.",
    author_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    created_at: "2024-04-10T14:30:00Z"
  },
  {
    id: "3",
    rating: 5,
    comment: "The conversation with Sophia about MIT's engineering program was eye-opening. She shared her course experiences and research opportunities that helped me decide on my major.",
    author_name: "David K.",
    author_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    created_at: "2024-04-05T09:15:00Z"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-[#F5F5DC]">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-garamond text-4xl md:text-5xl font-bold mb-6 text-navy">What Students Are Saying</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Hear from students who've connected through our platform
          </p>
          
          <div className="flex justify-center items-center mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-2 font-medium text-navy">4.9/5 from 200+ conversations</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ReviewCard 
              key={testimonial.id} 
              review={testimonial} 
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
