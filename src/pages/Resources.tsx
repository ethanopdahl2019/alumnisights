
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, FileText, Lightbulb, HelpCircle } from 'lucide-react';

const Resources = () => {
  const resourceCategories = [
    {
      title: "Undergraduate Insights",
      description: "Comprehensive guides and advice for undergraduate admissions",
      icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
      link: "/schools/undergraduate-admissions",
    },
    {
      title: "Application Guides",
      description: "Step-by-step guides to perfecting your college applications",
      icon: <FileText className="h-8 w-8 text-green-600" />,
      link: "/resources/application-guides",
    },
    {
      title: "Test Prep Resources",
      description: "Resources to help you prepare for standardized tests",
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      link: "/resources/test-prep",
    },
    {
      title: "Financial Aid & Scholarships",
      description: "Information about funding your education",
      icon: <Lightbulb className="h-8 w-8 text-orange-600" />,
      link: "/resources/financial-aid",
    },
    {
      title: "FAQ",
      description: "Answers to commonly asked questions",
      icon: <HelpCircle className="h-8 w-8 text-red-600" />,
      link: "/faq",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Resources</h1>
          
          <p className="text-lg text-gray-700 mb-10 max-w-3xl">
            We've compiled a comprehensive collection of resources to help you navigate the 
            college admissions process, make informed decisions, and prepare for your 
            academic journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {resourceCategories.map((category, index) => (
              <Link key={index} to={category.link}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-medium mb-2">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Looking for personalized guidance?</h2>
            <p className="text-gray-700 mb-4">
              Connect with current students and alumni who can provide tailored advice 
              based on your specific situation and goals.
            </p>
            <Link to="/browse" className="text-blue-600 font-medium hover:underline">
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
