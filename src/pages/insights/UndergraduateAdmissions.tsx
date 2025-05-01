
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { University } from "lucide-react";

const UndergraduateAdmissions = () => {
  // Array of universities to display
  const universities = [
    { id: "stanford", name: "Stanford University" },
    { id: "harvard", name: "Harvard University" },
    { id: "yale", name: "Yale University" },
    { id: "mit", name: "MIT" },
    { id: "princeton", name: "Princeton University" },
    { id: "columbia", name: "Columbia University" },
    { id: "upenn", name: "University of Pennsylvania" },
    { id: "dartmouth", name: "Dartmouth College" },
    { id: "brown", name: "Brown University" },
    { id: "cornell", name: "Cornell University" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Undergraduate Admissions Insights | AlumniSights</title>
        <meta name="description" content="Learn about undergraduate admission processes and strategies" />
      </Helmet>
      
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Undergraduate Admissions Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Expert advice and insights on undergraduate admissions processes at top universities
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {universities.map((university) => (
              <Link 
                key={university.id}
                to={`/insights/undergraduate-admissions/${university.id}`}
                className="transform transition-transform hover:scale-105 focus:outline-none"
              >
                <Card className="overflow-hidden border shadow hover:shadow-md h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-50 rounded-full p-4 mb-3">
                      <University className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-navy">
                      {university.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UndergraduateAdmissions;
