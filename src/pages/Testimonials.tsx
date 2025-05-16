
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Emily Chen",
      role: "Stanford University '23",
      quote: "AlumniSights connected me with a mentor who provided invaluable guidance during my application process. The personalized advice helped me highlight my strengths and address my weaknesses in ways I never would have thought of on my own.",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Marcus Johnson",
      role: "NYU Stern '22",
      quote: "As a first-generation college student, I had so many questions about university life. My mentor not only helped me with application strategies but also gave me practical advice about navigating campus life and making the most of my college experience.",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Sophia Rodriguez",
      role: "MIT '24",
      quote: "The insights I gained from my conversations with alumni were far more valuable than any guidebook or website. They shared honest feedback about the challenges and opportunities at MIT that helped me prepare mentally and academically.",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "James Wilson",
      role: "Duke University '22",
      quote: "When I was deciding between several universities, talking to current students through AlumniSights helped me understand the subtle differences in campus culture that you can't get from a brochure. It made all the difference in my final decision.",
      image: "https://i.pravatar.cc/150?img=4",
    },
    {
      name: "Aisha Patel",
      role: "Brown University '23",
      quote: "My mentor helped me navigate the complex financial aid process and find scholarship opportunities I didn't know existed. Their guidance was essential in making my dream school financially accessible.",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Tyler Brooks",
      role: "UC Berkeley '24",
      quote: "The candid feedback I received on my essays from an alumni who had served on admissions committees was game-changing. Their insider perspective helped me refine my personal statement and stand out in a competitive applicant pool.",
      image: "https://i.pravatar.cc/150?img=6",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Student Testimonials</h1>
          
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto text-center">
            Hear from students who have used AlumniSights to connect with mentors and gain valuable insights 
            that helped them make informed decisions about their education.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic flex-grow">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to find your mentor?</h2>
            <p className="text-gray-700 mb-6">
              Join thousands of students who have found valuable guidance through AlumniSights.
            </p>
            <Button asChild size="lg">
              <Link to="/browse">Browse Mentors Now</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Testimonials;
