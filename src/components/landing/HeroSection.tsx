
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container-custom max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-navy font-garamond">
          Connect with students at your dream schools
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
          Book conversations with current students and alumni to gain authentic insights for your college journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-navy hover:bg-navy/90 text-lg px-8 py-6 h-auto">
            <Link to="/browse">Browse Profiles <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-navy text-navy hover:bg-navy/5 text-lg px-8 py-6 h-auto">
            <Link to="/how-it-works">How It Works</Link>
          </Button>
        </div>
        
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F5F5DC] z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Students on campus" 
            className="w-full h-64 md:h-96 object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
