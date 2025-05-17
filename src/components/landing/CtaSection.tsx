
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-24 px-4 bg-navy text-white">
      <div className="container-custom max-w-6xl mx-auto text-center">
        <h2 className="font-garamond text-4xl md:text-5xl font-bold mb-6">
          Start Your College Journey with Confidence
        </h2>
        
        <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10">
          Connect with current students and alumni who can provide the insights you need to make informed decisions about your academic future.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-navy hover:bg-gray-100 text-lg px-8 py-6 h-auto">
            <Link to="/browse">Browse Profiles <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto">
            <Link to="/become-mentor">Become a Mentor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
