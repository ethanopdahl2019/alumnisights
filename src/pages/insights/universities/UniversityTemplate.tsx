
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DefaultLogo from "./DefaultLogo";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

// This is a template for university pages
const UniversityTemplate: React.FC<{
  name: string;
  logo?: string | null;
  image?: string | null;
  content?: React.ReactNode;
  showEditButton?: boolean;
  id?: string;
  didYouKnow?: string | null;
}> = ({ name, logo, image, content, showEditButton = false, id, didYouKnow }) => {
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{name} Admissions | AlumniSights</title>
        <meta name="description" content={`Learn about undergraduate admissions at ${name} - statistics, requirements, and insights.`} />
      </Helmet>

      <Navbar />

      {/* Hero Banner with University Image - Increased height from [40vh] to [50vh] */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        {image ? (
          <img 
            src={image} 
            alt={`${name} campus`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-navy to-navy-light"></div>
        )}
        
        <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20 w-full">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              {logo && (
                <div className="hidden md:block bg-white p-2 rounded-lg shadow-md w-20 h-20 flex-shrink-0">
                  <img 
                    src={logo} 
                    alt={`${name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {name}
                </h1>
                <p className="text-lg text-white/90">
                  Undergraduate Admissions Insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {logo && (
                <div className="md:hidden bg-white p-2 rounded-lg shadow-sm w-14 h-14 flex-shrink-0">
                  <img 
                    src={logo} 
                    alt={`${name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {!logo && (
                <div className="md:hidden">
                  <DefaultLogo name={name} className="h-14 w-14" />
                </div>
              )}
            </div>
            
            {id && showEditButton && (
              <div>
                <Link to={`/insights/university-content-editor/${id}`}>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div>
            {/* Main Content with integrated Did You Know */}
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
                    
                    {didYouKnow && (
                      <div className="my-6 bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-purple-800 mb-3">Did You Know?</h3>
                        <p className="text-sm text-purple-900">{didYouKnow}</p>
                      </div>
                    )}
                    
                    <p>
                      Additional information about {name}'s admissions process would be displayed here.
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityTemplate;
