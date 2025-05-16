
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const Resources = () => {
  const resourceCategories = [
    {
      title: "Undergraduate Insights",
      description: "Comprehensive guides and advice for undergraduate admissions",
      link: "/schools/undergraduate-admissions",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Application Guides",
      description: "Step-by-step guides to perfecting your college applications",
      link: "/resources/application-guides",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Test Prep Resources",
      description: "Resources to help you prepare for standardized tests",
      link: "/resources/test-prep",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Financial Aid & Scholarships",
      description: "Information about funding your education",
      link: "/resources/financial-aid",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "FAQ",
      description: "Answers to commonly asked questions",
      link: "/faq",
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-serif font-bold text-navy mb-6">Resources</h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              We've compiled a comprehensive collection of resources to help you navigate the 
              college admissions process, make informed decisions, and prepare for your 
              academic journey.
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {resourceCategories.map((category, index) => (
              <Link key={index} to={category.link} className="block group">
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-serif font-medium mb-2">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
            <div className="md:flex items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-serif font-bold mb-4">Looking for personalized guidance?</h2>
                <p className="text-xl text-gray-700 mb-6">
                  Connect with current students and alumni who can provide tailored advice 
                  based on your specific situation and goals.
                </p>
                <Link to="/browse" className="btn-primary text-lg px-10 py-4">
                  Browse Alumni
                </Link>
              </div>
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Students talking" 
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;
