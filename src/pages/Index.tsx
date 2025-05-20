
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import FeaturedSchools from '@/components/FeaturedSchools';
import MentorReviews from '@/components/MentorReviews';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <Hero />
      
      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Schools */}
      <FeaturedSchools />
      
      {/* Testimonials */}
      <MentorReviews />
      
      <Footer />
    </div>
  );
};

export default Index;
