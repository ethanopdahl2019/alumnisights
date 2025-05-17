
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';

// Static testimonials for now
const testimonials = [
  {
    id: '1',
    name: 'Emma Thompson',
    school: 'Stanford University',
    rating: 5,
    text: 'My conversation with an alumni was invaluable. I got honest advice about campus culture that helped me make my final decision.',
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Michael Chen',
    school: 'Harvard University',
    rating: 5,
    text: 'The insights I gained about Harvard's computer science program helped me tailor my application to stand out. I'm now a freshman there!',
    image: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Jasmine Williams',
    school: 'Yale University',
    rating: 5,
    text: 'Speaking with someone who had similar interests and background made me feel confident that I could thrive at Yale. Best decision I made during my college search.',
    image: 'https://i.pravatar.cc/150?img=3',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">What Students Say</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Hear from students who have used AlumniSights to guide their educational decisions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="flex items-center mb-6">
                <Avatar className="h-14 w-14 mr-4 border border-beige-100">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="font-serif">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-serif font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.school}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              
              <p className="text-gray-700 italic">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
