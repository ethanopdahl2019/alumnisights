
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import SchoolsSection from '@/components/landing/SchoolsSection';
import AlumniSection from '@/components/landing/AlumniSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CtaSection from '@/components/landing/CtaSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <Navbar />
      
      <main>
        <HeroSection />
        <HowItWorksSection />
        <SchoolsSection />
        <AlumniSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
