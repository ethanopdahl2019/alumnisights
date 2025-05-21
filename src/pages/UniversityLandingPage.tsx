
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UniversityLandingPage = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">University: {slug}</h1>
        <p className="text-muted-foreground">
          This is a placeholder for the university landing page. Actual implementation will be done later.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default UniversityLandingPage;
