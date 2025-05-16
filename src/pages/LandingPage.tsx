
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container-custom py-12">
        <section className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-6">
            Welcome to the Alumni Network
          </h1>
          <p className="font-sans text-xl text-gray-700 mb-8">
            Connect with alumni, share experiences, and build your professional network.
          </p>
          <Link to="/browse" className="inline-block bg-navy text-white px-8 py-3 rounded-lg font-sans hover:bg-navy/90 transition-colors cursor-pointer">
            Browse Alumni
          </Link>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-8 text-center">
            Featured Alumni
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                position: "Software Engineer at Google",
                image: "/placeholder.svg"
              },
              {
                name: "Jane Smith",
                position: "Marketing Manager at Amazon",
                image: "/placeholder.svg"
              },
              {
                name: "David Lee",
                position: "Data Scientist at Facebook",
                image: "/placeholder.svg"
              }
            ].map((alumni, index) => (
              <Link to="/browse" key={index} className="block">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer">
                  <div className="flex justify-center mb-4">
                    <img 
                      src={alumni.image} 
                      alt={alumni.name} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-center">
                    {alumni.name}
                  </h3>
                  <p className="font-sans text-gray-600 text-center">
                    {alumni.position}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
