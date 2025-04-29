
import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ClubsAndGreekLife = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Clubs & Greek Life | AlumniSights</title>
        <meta name="description" content="Find information about campus organizations and Greek life" />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Clubs & Greek Life
            </h1>
            <p className="text-lg text-gray-600">
              Discover the vibrant world of campus organizations and Greek life
            </p>
          </div>
          
          {/* Placeholder content - will be replaced */}
          <div className="bg-blue-50 p-8 rounded-lg border border-blue-100 text-center">
            <p className="text-xl text-gray-600">
              Content for this section is coming soon.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClubsAndGreekLife;
