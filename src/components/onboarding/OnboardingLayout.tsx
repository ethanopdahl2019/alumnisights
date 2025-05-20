
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{title} | AlumniSights</title>
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
            
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-2 w-16 rounded-full ${i < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <div className="ml-4 text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-8">
              {children}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OnboardingLayout;
