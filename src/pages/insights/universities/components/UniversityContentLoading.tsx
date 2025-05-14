
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UniversityContentLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-8 animate-pulse"></div>
          
          <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              
              <div className="h-6 bg-gray-200 rounded w-1/4 mt-6 animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              
              <div className="h-6 bg-gray-200 rounded w-1/3 mt-6 animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversityContentLoading;
