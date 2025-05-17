
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import SchoolsSection from '@/components/landing/SchoolsSection';
import AlumniSection from '@/components/landing/AlumniSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-beige-50">
      <Helmet>
        <title>AlumniSights - Connect with Students at Your Dream Schools</title>
        <meta name="description" content="Book conversations with current students and alumni to gain authentic insights for your college journey." />
      </Helmet>
      
      <Navbar />
      
      <main>
        <HeroSection />
        <HowItWorksSection />
        <SchoolsSection />
        <AlumniSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
