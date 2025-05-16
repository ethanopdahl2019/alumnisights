
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-gray-800">
            Connect with Alumni Network
          </h1>
          <p className="text-xl text-gray-700 mb-8 font-sans">
            Find mentors, gain insights, and make informed decisions about your educational journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/browse" className="px-8 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-sans">
              Browse Alumni
            </Link>
            <Link to="/auth" className="px-8 py-3 border border-navy text-navy rounded-lg hover:bg-gray-50 transition-colors font-sans">
              Sign In
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-serif font-medium text-gray-900 mb-6 text-center">
            Featured Alumni
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-serif text-gray-900 mb-2">
                John Doe
              </h3>
              <p className="text-gray-700 font-sans">
                Software Engineer at Google
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-serif text-gray-900 mb-2">
                Jane Smith
              </h3>
              <p className="text-gray-700 font-sans">
                Marketing Manager at Amazon
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-serif text-gray-900 mb-2">
                David Lee
              </h3>
              <p className="text-gray-700 font-sans">
                Data Scientist at Facebook
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
