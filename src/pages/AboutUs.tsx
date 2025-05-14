
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About AlumniSights</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              AlumniSights was founded with a simple mission: to connect prospective students with authentic 
              insights from people who've been there before.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              As former students who navigated the complex world of college and graduate school applications, 
              we experienced firsthand how challenging it can be to make informed decisions about education.
            </p>
            <p className="text-gray-700 mb-6">
              We created AlumniSights to bridge the information gap between what universities tell you and what 
              current students and alumni know from experience. Our platform facilitates meaningful connections 
              that help prospective students make confident decisions about their educational future.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              We believe that education decisions should be made with complete information. By connecting 
              prospective students with alumni and current students, we create an ecosystem of knowledge 
              sharing that benefits everyone involved. Our goal is to make higher education more transparent 
              and accessible for all.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 mb-10">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
                <h3 className="text-xl font-medium">Sarah Johnson</h3>
                <p className="text-gray-600">Co-founder & CEO</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
                <h3 className="text-xl font-medium">Michael Chen</h3>
                <p className="text-gray-600">Co-founder & CTO</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Join Our Community</h2>
            <p className="text-gray-700 mb-6">
              Whether you're a prospective student seeking guidance or an alumnus looking to give back, 
              we invite you to join our growing community of mentors and mentees making education more 
              transparent and accessible.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-10">
              <h3 className="text-xl font-medium mb-2">Contact Us</h3>
              <p className="text-gray-700 mb-4">
                Have questions or suggestions? We'd love to hear from you.
              </p>
              <p className="text-gray-700">
                Email: <a href="mailto:info@alumnisights.com" className="text-blue-600 hover:underline">info@alumnisights.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
