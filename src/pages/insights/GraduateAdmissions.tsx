
import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GraduateAdmissions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Graduate Admissions Insights | AlumniSights</title>
        <meta name="description" content="Explore graduate school application insights and tips" />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Graduate Admissions Insights
            </h1>
            <p className="text-lg text-gray-600">
              Expert advice and strategies for graduate school applications
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

export default GraduateAdmissions;
