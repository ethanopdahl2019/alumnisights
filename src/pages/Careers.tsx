
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


const Careers = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Join Our Mission
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              We're building a platform that transforms how students make education decisions. 
              Join our team and help make education more transparent and accessible.
            </p>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Open Positions */}
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">Open Positions</h2>
            
            <div className="space-y-6">
              {positions.map((position, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <h3 className="text-xl font-medium">{position.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{position.type}</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{position.location}</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{position.department}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{position.description}</p>
                  <a href="#" className="text-blue-600 font-medium hover:underline">
                    Learn more and apply →
                  </a>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-lg text-gray-700 mb-4">
                Don't see a position that matches your skills?
              </p>
              <a href="mailto:careers@alumnisights.com" className="text-blue-600 font-medium hover:underline">
                Send us your resume →
              </a>
            </div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">Why Work With Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-medium mb-3">Comprehensive Benefits</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Competitive salary and equity packages</li>
                  <li>• Health, dental, and vision insurance</li>
                  <li>• Flexible PTO policy</li>
                  <li>• 401(k) matching</li>
                  <li>• Professional development budget</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-medium mb-3">Work Environment</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Remote-first culture with flexible schedules</li>
                  <li>• Quarterly team retreats</li>
                  <li>• Collaborative, low-ego environment</li>
                  <li>• Impact-driven work culture</li>
                  <li>• Regular mentorship opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
