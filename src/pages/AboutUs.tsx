
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>About Us | AlumniSights</title>
        <meta name="description" content="Learn about the founders and mission of AlumniSights" />
      </Helmet>
      
      <Navbar />
      
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About AlumniSights</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              AlumniSights was founded with a simple mission: to connect prospective students with authentic 
              insights from people who've been there before.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Founders</h2>
            
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-2">Ethan Opdahl</h3>
                <p className="text-gray-700 mb-4">
                  Ethan attended Amherst College where he played lacrosse and studied Economics. 
                  After graduation, he pursued a career in consulting and currently works at Bain.
                  His experience navigating college admissions and athletics inspired him to create a 
                  platform that helps students make informed decisions about their education.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-2">Jeffrey Guo</h3>
                <p className="text-gray-700 mb-4">
                  Jeffrey studied Neuroscience at Johns Hopkins University and is now attending 
                  medical school at the University of Maryland. His journey through undergraduate 
                  education and into medical school highlighted the need for better guidance and 
                  mentorship for students considering similar paths.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              We believe that education decisions should be made with complete information. By connecting 
              prospective students with alumni and current students, we create an ecosystem of knowledge 
              sharing that benefits everyone involved. Our goal is to make higher education more transparent 
              and accessible for all.
            </p>
            
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
