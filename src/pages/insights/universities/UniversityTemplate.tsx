
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// This is a template for university pages
const UniversityTemplate: React.FC<{
  name: string;
  content?: React.ReactNode;
}> = ({ name, content }) => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{name} Admissions | AlumniSights</title>
        <meta name="description" content={`Learn about undergraduate admissions at ${name} - statistics, requirements, and insights.`} />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              {name}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Undergraduate Admissions Insights
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>

          <div className="prose max-w-none">
            {content || (
              <>
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                  <p>
                    Welcome to the {name} undergraduate admissions insights page. Here you'll find 
                    valuable information about the application process, admission statistics, 
                    and tips to improve your chances of acceptance.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
                  <p>
                    The acceptance rate, average GPA, and test score information 
                    for {name} would be displayed here.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Application Requirements</h2>
                  <p>
                    Information about required essays, extracurricular activities,
                    and other application components specific to {name} would be listed here.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Alumni Insights</h2>
                  <p>
                    Advice and insights from {name} alumni about the admissions process
                    and university experience would be featured here.
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityTemplate;
