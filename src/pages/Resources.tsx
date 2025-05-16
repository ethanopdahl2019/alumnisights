
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Resources = () => {
  const resourceCategories = [
    {
      title: "Undergraduate Insights",
      description: "Comprehensive guides and advice for undergraduate admissions",
      link: "/schools/undergraduate-admissions",
    },
    {
      title: "Application Guides",
      description: "Step-by-step guides to perfecting your college applications",
      link: "/resources/application-guides",
    },
    {
      title: "Test Prep Resources",
      description: "Resources to help you prepare for standardized tests",
      link: "/resources/test-prep",
    },
    {
      title: "Financial Aid & Scholarships",
      description: "Information about funding your education",
      link: "/resources/financial-aid",
    },
    {
      title: "FAQ",
      description: "Answers to commonly asked questions",
      link: "/faq",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-6">Resources</h1>
          
          <p className="text-lg text-gray-700 mb-10 max-w-3xl font-sans">
            We've compiled a comprehensive collection of resources to help you navigate the 
            college admissions process, make informed decisions, and prepare for your 
            academic journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {resourceCategories.map((category, index) => (
              <Link key={index} to={category.link} className="block h-full">
                <div className="h-full bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-serif mb-2">{category.title}</h2>
                  <p className="text-gray-600 font-sans">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-serif mb-4">Looking for personalized guidance?</h2>
            <p className="text-gray-700 mb-6 font-sans">
              Connect with current students and alumni who can provide tailored advice 
              based on your specific situation and goals.
            </p>
            <Link to="/browse" className="text-navy font-medium hover:underline font-sans">
              Browse our mentor network →
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;
