
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, BookOpen, BriefcaseBusiness, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const GraduateAdmissions = () => {
  const gradSchoolTypes = [
    {
      title: "Master's Programs",
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      description: "Specialized degrees typically taking 1-2 years to complete, focusing on advanced knowledge in a specific field.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Doctoral Programs",
      icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
      description: "Research-intensive degrees leading to a Ph.D., typically taking 4-6 years and requiring original research contributions.",
      image: "https://images.unsplash.com/photo-1590650213165-c1fef80648c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Professional Programs",
      icon: <BriefcaseBusiness className="h-8 w-8 text-green-500" />,
      description: "Career-focused degrees like MBA, JD, or MD, preparing students for specific professional paths.",
      image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Certificate Programs",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      description: "Short-term credentials demonstrating specialized knowledge, often completed in less than a year.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/70 to-white">
      <Helmet>
        <title>Graduate Admissions Insights | AlumniSights</title>
        <meta name="description" content="Learn about graduate admission processes and strategies" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-serif font-bold text-navy mb-4">
              Graduate Admissions Insights
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Expert advice and insights on graduate school admissions processes at top universities
            </p>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-serif font-semibold mb-8 text-center">Types of Graduate Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gradSchoolTypes.map((type, index) => (
                <Card key={index} className="border shadow hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 bg-gray-50 p-4 rounded-full">
                        {type.icon}
                      </div>
                      <h3 className="font-serif font-semibold text-lg mb-2">{type.title}</h3>
                      <p className="text-gray-600 text-sm">{type.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <div className="md:flex items-center gap-8">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h2 className="text-2xl font-serif font-semibold mb-6">Preparing for Graduate School</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="mb-4 text-gray-700">
                    Graduate school applications require careful planning and preparation. Here are some key aspects to consider:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                      <span>Research programs that align with your career goals and academic interests</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                      <span>Prepare for standardized tests like the GRE, GMAT, LSAT, or MCAT</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                      <span>Craft compelling personal statements and research proposals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                      <span>Secure strong letters of recommendation from academic and professional references</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                      <span>Build relevant experience through research, internships, or work experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-2"></span>
                      <span>Plan your finances, including exploring scholarship and funding opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Graduate school preparation" 
                  className="rounded-lg shadow-sm w-full h-auto"
                />
              </div>
            </div>
          </section>

          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-serif font-bold mb-3">Need personalized graduate admissions advice?</h2>
            <p className="mb-6 text-gray-700">Connect with alumni who have successfully navigated the graduate school process</p>
            <Link 
              to="/browse" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-medium"
            >
              Find a Mentor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GraduateAdmissions;
