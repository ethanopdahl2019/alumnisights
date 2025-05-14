
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HowItWorksComponent from '@/components/HowItWorks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How AlumniSights Works
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              We connect prospective students with current students and alumni who've been in your shoes.
              Get authentic insights, personalized advice, and make confident decisions about your education.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/browse">Browse Profiles</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/become-mentor">Become a Mentor</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Process Steps */}
        <HowItWorksComponent />
        
        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Connect Through AlumniSights?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Authentic Perspectives</h3>
                <p className="text-gray-700">
                  Get beyond the glossy brochures and marketing materials. Hear what life is really like from people who've experienced it firsthand.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Personalized Advice</h3>
                <p className="text-gray-700">
                  Every student's journey is unique. Get advice tailored to your specific situation, goals, and concerns from someone who understands.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-purple-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Verified Mentors</h3>
                <p className="text-gray-700">
                  All our mentors go through a verification process to ensure they have genuine experience at the institutions they represent.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Student Success Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-medium">Alex J.</h3>
                    <p className="text-sm text-gray-600">Harvard University '24</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "My conversation with a current Harvard student gave me insights I couldn't find anywhere else. 
                  They helped me understand what the admissions committee was really looking for and how to make 
                  my application stand out."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-medium">Maya T.</h3>
                    <p className="text-sm text-gray-600">Stanford University '25</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "I was torn between two universities, but after speaking with alumni from both, I had a much 
                  clearer picture of which program would better suit my goals and learning style. Best decision 
                  I could have made!"
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Browse our network of verified mentors and start getting the insights you need
              to make confident decisions about your education.
            </p>
            <Button asChild size="lg">
              <Link to="/browse">Find Your Connection</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
